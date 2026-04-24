"use client";
import { useState, useEffect } from "react";
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
import { Pencil, Trash2 } from "lucide-react";

// ─── SCHEMAS MATCHING YOUR JSON ───────────────────────────────────────────────

const contractFields = [
    { key: "playerKeycloakId", label: "Player Keycloak ID", placeholder: "uuid...", required: true },
    { key: "startDate", label: "Start Date", type: "date", required: true },
    { key: "endDate", label: "End Date", type: "date", required: true },
    { key: "salary", label: "Salary", type: "number", required: true },
    { key: "releaseClause", label: "Release Clause", type: "number", required: true },
];

const incomingFields = [
    { key: "outerPlayerId", label: "Outer Player ID", type: "number", required: true },
    { key: "fromOuterTeamId", label: "From Outer Team ID", type: "number", required: true },
    { key: "toTeamId", label: "To Team ID", type: "number", required: true },
    { key: "requestDate", label: "Request Date", type: "date", required: true },
];

const outgoingFields = [
    { key: "playerKeycloakId", label: "Player Keycloak ID", placeholder: "uuid...", required: true },
    { key: "fromTeamId", label: "From Team ID", type: "number", required: true },
    { key: "toOuterTeamId", label: "To Outer Team ID", type: "number", required: true },
    { key: "requestDate", label: "Request Date", type: "date", required: true },
];

export default function ContractsTransfers() {
    const [tab, setTab] = useState("contracts");
    const [data, setData] = useState({ 
        contracts: [], incoming: [], outgoing: [] 
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "contracts") res = await api.getPlayerContracts();
            else if (tab === "incoming") res = await api.getIncomingTransfers();
            else if (tab === "outgoing") res = await api.getOutgoingTransfers();

            const finalData = Array.isArray(res) ? res : (res?.content || res?.data || res?.items || []);
            setData(prev => ({ ...prev, [tab]: finalData }));
        } catch (err) {
            console.error("API Error:", err);
            setToast({ msg: "Failed to load data", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [tab]);

    const handleSave = async (form) => {
        try {
            const payload = { ...form };
            
            // Cast only the fields required by the schema
            const numKeys = ["salary", "releaseClause", "outerPlayerId", "fromOuterTeamId", "toTeamId", "fromTeamId", "toOuterTeamId"];
            numKeys.forEach(k => {
                if (payload[k] !== undefined && payload[k] !== "" && payload[k] !== null) {
                    payload[k] = Number(payload[k]);
                }
            });

            // Clean up payload to only include keys in the schema (Prevent unknown properties error)
            const schemaKeys = tab === "contracts" 
                ? ["playerKeycloakId", "startDate", "endDate", "salary", "releaseClause"]
                : tab === "incoming"
                ? ["outerPlayerId", "fromOuterTeamId", "toTeamId", "requestDate"]
                : ["playerKeycloakId", "fromTeamId", "toOuterTeamId", "requestDate"];

            const finalPayload = {};
            schemaKeys.forEach(k => { if (payload[k] !== undefined) finalPayload[k] = payload[k]; });

            let res;
            if (tab === "contracts") {
                res = editItem ? await api.updatePlayerContract(editItem.id, finalPayload) : await api.createPlayerContract(finalPayload);
            } else if (tab === "incoming") {
                res = editItem ? await api.updateIncomingTransfer(editItem.id, finalPayload) : await api.createIncomingTransfer(finalPayload);
            } else if (tab === "outgoing") {
                res = editItem ? await api.updateOutgoingTransfer(editItem.id, finalPayload) : await api.createOutgoingTransfer(finalPayload);
            }

            setToast({ msg: "Record saved successfully!" });
            setShowModal(false);
            setEditItem(null);
            loadData();
        } catch (err) {
            console.error("Save Error Details:", err);
            setToast({ 
                msg: err.message || "Error saving record", 
                type: "error" 
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            if (tab === "contracts") await api.deletePlayerContract(id);
            else if (tab === "incoming") await api.deleteIncomingTransfer(id);
            else if (tab === "outgoing") await api.deleteOutgoingTransfer(id);
            
            setToast({ msg: "Deleted successfully" });
            loadData();
        } catch (err) {
            setToast({ msg: "Delete failed", type: "error" });
        }
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Contracts & Transfers"
                subtitle="Market operations and player agreements"
                action={<AddButton label="+ New Request" onClick={() => { setEditItem(null); setShowModal(true); }} />}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Contracts" value={data.contracts.length} color="text-emerald-400" />
                <StatCard label="Incoming Requests" value={data.incoming.length} color="text-blue-400" />
                <StatCard label="Outgoing Requests" value={data.outgoing.length} color="text-rose-400" />
            </div>

            <FilterTabs
                tabs={[
                    ["contracts", "📝 Contracts"], 
                    ["incoming", "📥 Incoming Req"], 
                    ["outgoing", "📤 Outgoing Req"]
                ]}
                active={tab} 
                onSelect={setTab}
            />

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-slate-500 font-bold animate-pulse">Loading Ledger...</div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Table for Contracts */}
                        {tab === "contracts" && (
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/20">
                                    <tr className="border-b border-slate-800">
                                        {["Player ID", "Salary", "Release Clause", "Period", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.contracts.map(c => (
                                        <tr key={c.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{c.playerKeycloakId?.slice(0, 18)}…</td>
                                            <td className="px-6 py-4 font-bold text-emerald-400 text-sm">${c.salary?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-slate-300">${c.releaseClause?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{c.startDate} → {c.endDate}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={() => { setEditItem(c); setShowModal(true); }} className="p-2 text-slate-500 hover:text-emerald-400"><Pencil size={14}/></button>
                                                <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-500 hover:text-rose-400"><Trash2 size={14}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Table for Incoming */}
                        {tab === "incoming" && (
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/20">
                                    <tr className="border-b border-slate-800">
                                        {["Outer Player", "From Outer Team", "To Our Team", "Request Date", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.incoming.map(t => (
                                        <tr key={t.id} className="border-b border-slate-900 hover:bg-blue-500/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-300">ID: {t.outerPlayerId}</td>
                                            <td className="px-6 py-4 text-sm text-slate-300">Team ID: {t.fromOuterTeamId}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-blue-400">Team ID: {t.toTeamId}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{t.requestDate}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={() => { setEditItem(t); setShowModal(true); }} className="p-2 text-slate-500 hover:text-blue-400"><Pencil size={14}/></button>
                                                <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-500 hover:text-rose-400"><Trash2 size={14}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Table for Outgoing */}
                        {tab === "outgoing" && (
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/20">
                                    <tr className="border-b border-slate-800">
                                        {["Our Player", "From Our Team", "To Outer Team", "Request Date", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.outgoing.map(t => (
                                        <tr key={t.id} className="border-b border-slate-900 hover:bg-rose-500/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{t.playerKeycloakId?.slice(0, 18)}…</td>
                                            <td className="px-6 py-4 text-sm text-slate-300">Team ID: {t.fromTeamId}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-rose-400">Outer Team ID: {t.toOuterTeamId}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{t.requestDate}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={() => { setEditItem(t); setShowModal(true); }} className="p-2 text-slate-500 hover:text-rose-400"><Pencil size={14}/></button>
                                                <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-500 hover:text-rose-400"><Trash2 size={14}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {data[tab].length === 0 && <EmptyState icon="🤝" title="No market requests found" />}
                    </div>
                )}
            </div>

            {showModal && (
                <FormModal
                    title={`${editItem ? "Edit" : "New"} ${tab === "contracts" ? "Contract" : "Transfer Request"}`}
                    fields={
                        tab === "contracts" ? contractFields : 
                        tab === "incoming" ? incomingFields : 
                        outgoingFields
                    }
                    initialData={editItem}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                />
            )}

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}