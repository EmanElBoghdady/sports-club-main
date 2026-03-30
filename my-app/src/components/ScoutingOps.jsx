"use client";
import { useState } from "react";
import { MOCK, CALLUP_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, StatusBadge, PageHeader, AddButton, FilterTabs, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

const callupFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "callUpDate", label: "Call-Up Date", type: "date" },
    { key: "returnDate", label: "Return Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: CALLUP_STATUS },
];
const outerPlayerFields = [
    { key: "name", label: "Player Name", placeholder: "Full name" },
    { key: "currentTeam", label: "Current Team", placeholder: "FC Name" },
    { key: "position", label: "Position", placeholder: "STRIKER" },
    { key: "age", label: "Age", type: "number" },
    { key: "nationality", label: "Nationality", placeholder: "Algerian" },
];
const outerTeamFields = [
    { key: "name", label: "Team Name", placeholder: "FC Rival" },
    { key: "country", label: "Country", placeholder: "Algeria" },
    { key: "league", label: "League", placeholder: "Division 1" },
];

export default function ScoutingOps() {
    const [tab, setTab] = useState("callups");
    const [callups, setCallups] = useState(MOCK.callups);
    const [outerPlayers, setOuterPlayers] = useState(MOCK.outerPlayers);
    const [outerTeams, setOuterTeams] = useState(MOCK.outerTeams);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSave = async (form) => {
        if (tab === "callups") { await api.createCallup(form).catch(() => { }); setCallups(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "outer-players") { await api.createOuterPlayer(form).catch(() => { }); setOuterPlayers(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "outer-teams") { await api.createOuterTeam(form).catch(() => { }); setOuterTeams(d => [...d, { ...form, id: Date.now() }]); }
        setToast({ msg: "Saved" }); setShowModal(false);
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Scouting Operations"
                subtitle="National call-ups, tracked players and opponent teams"
                action={<AddButton label="+ Add" onClick={() => setShowModal(true)} />}
            />
            <FilterTabs
                tabs={[["callups", "🌍 Call-Ups"], ["outer-players", "🔍 Tracked Players"], ["outer-teams", "🏟️ Opponent Teams"]]}
                active={tab} onSelect={setTab}
            />

            <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    {tab === "callups" && (
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Player", "Call-Up Date", "Return Date", "Status"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {callups.map(c => (
                                    <tr key={c.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{c.playerKeycloakId?.slice(0, 16)}…</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{c.callUpDate}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{c.returnDate}</td>
                                        <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === "outer-players" && (
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Player", "Team", "Position", "Age", "Nationality"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {outerPlayers.map(p => (
                                    <tr key={p.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{p.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{p.currentTeam}</td>
                                        <td className="px-6 py-4"><span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">{p.position}</span></td>
                                        <td className="px-6 py-4 text-sm text-slate-300 font-bold">{p.age}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{p.nationality}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === "outer-teams" && (
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Team", "Country", "League"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {outerTeams.map(t => (
                                    <tr key={t.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{t.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300 font-bold">{t.country}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{t.league}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {((tab === "callups" && callups.length === 0) || (tab === "outer-players" && outerPlayers.length === 0) || (tab === "outer-teams" && outerTeams.length === 0)) &&
                        <EmptyState icon="🔭" title="Nothing tracked yet" />
                    }
                </div>
            </div>

            {showModal && (
                <FormModal
                    title={tab === "callups" ? "Add Call-Up" : tab === "outer-players" ? "Add Tracked Player" : "Add Opponent Team"}
                    fields={tab === "callups" ? callupFields : tab === "outer-players" ? outerPlayerFields : outerTeamFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} onClose={() => setToast(null)} />}
        </div>
    );
}
