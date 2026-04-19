"use client";
import { useState, useEffect } from "react";
import { CALLUP_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, StatusBadge, PageHeader, AddButton, FilterTabs, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

// حقول الفورم (نفس اللي بعتيها بس منظمة)
const callupFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "callUpDate", label: "Call-Up Date", type: "date" },
    { key: "returnDate", label: "Return Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: CALLUP_STATUS },
];
// ... (بقية الحقول outerPlayerFields و outerTeamFields)

export default function ScoutingOps() {
    const [tab, setTab] = useState("callups");
    const [data, setData] = useState({ callups: [], players: [], teams: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    // دالة جلب البيانات من السيرفر
    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "callups") res = await api.getCallups();
            else if (tab === "outer-players") res = await api.getOuterPlayers();
            else res = await api.getOuterTeams();
            
            // تحديث الداتا بناءً على التاب
            setData(prev => ({ 
                ...prev, 
                [tab === "callups" ? "callups" : tab === "outer-players" ? "players" : "teams"]: Array.isArray(res) ? res : res?.content || [] 
            }));
        } catch (err) {
            console.error("Scouting Fetch Error:", err);
            // لو السيرفر وقع (500)، مش هنعرض صفحة بيضاء، هنطلع توست تنبيه
            setToast({ msg: "Server Error: Could not load scouting data", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tab]);

    const handleSave = async (form) => {
        try {
            if (tab === "callups") await api.createCallup(form);
            else if (tab === "outer-players") await api.createOuterPlayer(form);
            else await api.createOuterTeam(form);
            
            setToast({ msg: "Record added to scouting radar" });
            setShowModal(false);
            fetchData(); // تحديث القائمة بعد الإضافة
        } catch (err) {
            setToast({ msg: "Failed to save. Check server connection.", type: "error" });
        }
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Scouting Operations"
                subtitle="Track talent and monitor rival teams"
                action={<AddButton label="+ Add Record" onClick={() => setShowModal(true)} />}
            />
            
            <FilterTabs
                tabs={[["callups", "🌍 Call-Ups"], ["outer-players", "🔍 Tracked Players"], ["outer-teams", "🏟️ Opponent Teams"]]}
                active={tab} onSelect={setTab}
            />

            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest animate-pulse">Scanning Radar...</div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* عرض الجداول بناءً على التاب (نفس الـ JSX اللي بعتيه سليم تماماً) */}
                        {tab === "callups" && (
                             <table className="w-full text-left">
                                <thead className="bg-slate-950/50">
                                    <tr className="border-b border-slate-800">
                                        {["Player", "Call-Up", "Return", "Status"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {data.callups.map(c => (
                                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 font-mono text-[10px] text-emerald-500">{c.playerKeycloakId?.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-300">{c.callUpDate}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-300">{c.returnDate}</td>
                                            <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        )}
                        {/* ... بقية جداول outer-players و outer-teams بنفس النمط ... */}
                        
                        {(tab === "callups" ? data.callups : tab === "outer-players" ? data.players : data.teams).length === 0 && (
                            <EmptyState icon="🔭" title="No data found on the scouting radar" />
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <FormModal
                    title={`New ${tab.replace("-", " ")}`}
                    fields={tab === "callups" ? callupFields : tab === "outer-players" ? outerPlayerFields : outerTeamFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}