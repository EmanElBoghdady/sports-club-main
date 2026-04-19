"use client";
import { useState, useEffect } from "react";
import { CONTRACT_STATUS, TRANSFER_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { 
    FormModal, 
    StatusBadge, 
    StatCard, 
    PageHeader, 
    AddButton, 
    FilterTabs, 
    Toast, 
    EmptyState 
} from "@/src/components/shared/SharedComponents";

// حقول إدخال البيانات للنماذج المختلفة
const contractFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "salary", label: "Salary", type: "number" },
    { key: "releaseClause", label: "Release Clause", type: "number" },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "contractStatus", label: "Status", type: "select", options: CONTRACT_STATUS },
];

const incomingFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "fromTeam", label: "From Team", placeholder: "FC Rival" },
    { key: "transferFee", label: "Fee", type: "number" },
    { key: "transferDate", label: "Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: TRANSFER_STATUS },
    { key: "contractDetails", label: "Details", placeholder: "3-year deal", full: true },
];

const outgoingFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "toTeam", label: "To Team", placeholder: "FC Destination" },
    { key: "transferFee", label: "Fee", type: "number" },
    { key: "transferDate", label: "Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: TRANSFER_STATUS },
    { key: "contractDetails", label: "Details", placeholder: "Sold permanently", full: true },
];

const rosterFields = [
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "seasonYear", label: "Season", placeholder: "2025/2026" },
];

export default function ContractsTransfers() {
    // الحالة (State) لإدارة التبويبات والبيانات
    const [tab, setTab] = useState("contracts");
    const [data, setData] = useState({ 
        contracts: [], incoming: [], outgoing: [], rosters: [] 
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    // دالة جلب البيانات من السيرفر
    const loadData = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "contracts") res = await api.getContracts();
            else if (tab === "incoming") res = await api.getIncomingTransfers();
            else if (tab === "outgoing") res = await api.getOutgoingTransfers();
            else if (tab === "rosters") res = await api.getRosters();

            // التأكد من أن النتيجة مصفوفة (Array) لتجنب أخطاء الـ .map()
            const finalData = Array.isArray(res) ? res : (res?.content || []);
            setData(prev => ({ ...prev, [tab]: finalData }));
        } catch (err) {
            console.error("API Error:", err);
            setToast({ msg: "Failed to load data from server", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // تحميل البيانات عند فتح الصفحة أو تغيير التبويب
    useEffect(() => {
        loadData();
    }, [tab]);

    // حفظ البيانات الجديدة
    const handleSave = async (form) => {
        try {
            if (tab === "contracts") await api.createContract(form);
            else if (tab === "incoming") await api.createIncomingTransfer(form);
            else if (tab === "outgoing") await api.createOutgoingTransfer(form);
            else if (tab === "rosters") await api.createRoster(form);

            setToast({ msg: "Record saved successfully!" });
            setShowModal(false);
            loadData(); // تحديث القائمة فوراً
        } catch (err) {
            setToast({ msg: "Error saving record. Check console.", type: "error" });
        }
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Contracts & Transfers"
                subtitle="Manage player deals and market movements"
                action={<AddButton label="+ New Record" onClick={() => setShowModal(true)} />}
            />

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Active Contracts" value={data.contracts.length} color="text-emerald-400" />
                <StatCard label="Incoming Deals" value={data.incoming.length} color="text-blue-400" />
                <StatCard label="Outgoing Deals" value={data.outgoing.length} color="text-amber-400" />
                <StatCard label="Total Rosters" value={data.rosters.length} color="text-purple-400" />
            </div>

            <FilterTabs
                tabs={[
                    ["contracts", "📝 Contracts"], 
                    ["incoming", "📥 Incoming"], 
                    ["outgoing", "📤 Outgoing"], 
                    ["rosters", "📋 Rosters"]
                ]}
                active={tab} 
                onSelect={setTab}
            />

            <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                        Loading Ledger...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* عرض جدول العقود */}
                        {tab === "contracts" && (
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/20">
                                    <tr className="border-b border-slate-800">
                                        {["Player", "Team", "Salary", "Period", "Status"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.contracts.map(c => (
                                        <tr key={c.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{c.playerKeycloakId?.slice(0, 18)}…</td>
                                            <td className="px-6 py-4 text-sm text-slate-300">ID: {c.teamId}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-400 text-sm">${c.salary?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{c.startDate} → {c.endDate}</td>
                                            <td className="px-6 py-4"><StatusBadge status={c.contractStatus} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* عرض جداول الانتقالات (قادمة أو مغادرة) */}
                        {(tab === "incoming" || tab === "outgoing") && (
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/20">
                                    <tr className="border-b border-slate-800">
                                        {["Player", tab === "incoming" ? "From" : "To", "Fee", "Date", "Status"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tab === "incoming" ? data.incoming : data.outgoing).map(t => (
                                        <tr key={t.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{t.playerKeycloakId?.slice(0, 18)}…</td>
                                            <td className="px-6 py-4 font-bold text-slate-200 text-sm">{tab === "incoming" ? t.fromTeam : t.toTeam}</td>
                                            <td className={`px-6 py-4 font-black text-sm ${tab === "incoming" ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {tab === "incoming" ? "+" : "-"}${t.transferFee?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{t.transferDate}</td>
                                            <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* عرض قائمة الفريق (Rosters) */}
                        {tab === "rosters" && (
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/20">
                                    <tr className="border-b border-slate-800">
                                        {["Team", "Player", "Season"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rosters.map(r => (
                                        <tr key={r.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-300">Team #{r.teamId}</td>
                                            <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{r.playerKeycloakId}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{r.seasonYear}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {data[tab].length === 0 && <EmptyState icon="📝" title="No records found in this category" />}
                    </div>
                )}
            </div>

            {/* النافذة المنبثقة لإضافة سجل جديد */}
            {showModal && (
                <FormModal
                    title={`New ${tab.replace("-", " ")}`}
                    fields={
                        tab === "contracts" ? contractFields : 
                        tab === "incoming" ? incomingFields : 
                        tab === "outgoing" ? outgoingFields : 
                        rosterFields
                    }
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}