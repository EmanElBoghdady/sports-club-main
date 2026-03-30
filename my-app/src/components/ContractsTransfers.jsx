"use client";
import { useState } from "react";
import { MOCK, CONTRACT_STATUS, TRANSFER_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, StatusBadge, StatCard, PageHeader, AddButton, FilterTabs, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

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
    const [tab, setTab] = useState("contracts");
    const [contracts, setContracts] = useState(MOCK.contracts);
    const [incoming, setIncoming] = useState(MOCK.incomingTransfers);
    const [outgoing, setOutgoing] = useState(MOCK.outgoingTransfers);
    const [rosters, setRosters] = useState(MOCK.rosters);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSave = async (form) => {
        if (tab === "contracts") { await api.createContract(form).catch(() => { }); setContracts(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "incoming") { await api.createIncomingTransfer(form).catch(() => { }); setIncoming(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "outgoing") { await api.createOutgoingTransfer(form).catch(() => { }); setOutgoing(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "rosters") { await api.createRoster(form).catch(() => { }); setRosters(d => [...d, { ...form, id: Date.now() }]); }
        setToast({ msg: "Saved" }); setShowModal(false);
    };

    const allTransfers = [...incoming, ...outgoing];

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Contracts & Transfers"
                subtitle="Player contracts, transfer windows and squad rosters"
                action={<AddButton label="+ New" onClick={() => setShowModal(true)} />}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Active Contracts" value={contracts.filter(c => c.contractStatus === "ACTIVE").length} color="text-emerald-400" />
                <StatCard label="Incoming" value={incoming.length} color="text-blue-400" />
                <StatCard label="Outgoing" value={outgoing.length} color="text-amber-400" />
                <StatCard label="Pending" value={allTransfers.filter(t => t.status === "PENDING").length} color="text-red-400" />
            </div>

            <FilterTabs
                tabs={[["contracts", "📝 Contracts"], ["incoming", "📥 Incoming"], ["outgoing", "📤 Outgoing"], ["rosters", "📋 Rosters"]]}
                active={tab} onSelect={setTab}
            />

            <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    {tab === "contracts" && (
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Player", "Team", "Salary", "Period", "Status"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {contracts.map(c => (
                                    <tr key={c.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{c.playerKeycloakId?.slice(0, 18)}…</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium tracking-tight">Team #{c.teamId}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-400 text-sm tracking-tight">${c.salary?.toLocaleString()} <span className="text-[10px] text-slate-600 font-medium">/MO</span></td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.startDate} → {c.endDate}</td>
                                        <td className="px-6 py-4"><StatusBadge status={c.contractStatus} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {(tab === "incoming" || tab === "outgoing") && (
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Player", tab === "incoming" ? "From" : "To", "Fee", "Date", "Status"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {(tab === "incoming" ? incoming : outgoing).map(t => (
                                    <tr key={t.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{t.playerKeycloakId?.slice(0, 18)}…</td>
                                        <td className="px-6 py-4 font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{tab === "incoming" ? t.fromTeam : t.toTeam}</td>
                                        <td className="px-6 py-4 font-black text-sm tracking-tight" style={{ color: tab === "incoming" ? "#34d399" : "#fb7185" }}>{tab === "incoming" ? "+" : "-"}${t.transferFee?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.transferDate}</td>
                                        <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === "rosters" && (
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Team", "Player", "Season"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {rosters.map(r => (
                                    <tr key={r.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-300">Team #{r.teamId}</td>
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{r.playerKeycloakId}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{r.seasonYear}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {((tab === "contracts" && contracts.length === 0) || (tab === "incoming" && incoming.length === 0) || (tab === "outgoing" && outgoing.length === 0) || (tab === "rosters" && rosters.length === 0)) &&
                        <EmptyState icon="📝" title="Nothing here yet" />
                    }
                </div>
            </div>

            {showModal && (
                <FormModal
                    title={tab === "contracts" ? "New Contract" : tab === "incoming" ? "Incoming Transfer" : tab === "outgoing" ? "Outgoing Transfer" : "Add Roster Entry"}
                    fields={tab === "contracts" ? contractFields : tab === "incoming" ? incomingFields : tab === "outgoing" ? outgoingFields : rosterFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} onClose={() => setToast(null)} />}
        </div>
    );
}
