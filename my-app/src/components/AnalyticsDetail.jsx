"use client";
import { useState } from "react";
import { MOCK, SPORTS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, SportBadge, StatCard, PageHeader, AddButton, FilterTabs, ProgressBar, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

const maFields = [
    { key: "matchId", label: "Match ID", type: "number" },
    { key: "sportType", label: "Sport", type: "select", options: SPORTS },
    { key: "analystKeycloakId", label: "Analyst ID", placeholder: "uuid..." },
    { key: "keyFindings", label: "Key Findings", type: "textarea", full: true },
    { key: "xgFor", label: "xG For", type: "number" },
    { key: "xgAgainst", label: "xG Against", type: "number" },
    { key: "possession", label: "Possession %", type: "number" },
];
const paFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "sportType", label: "Sport", type: "select", options: SPORTS },
    { key: "matchesPlayed", label: "Matches", type: "number" },
    { key: "minutesPlayed", label: "Minutes", type: "number" },
    { key: "primaryScore", label: "Goals/Points", type: "number" },
    { key: "secondaryScore", label: "Assists", type: "number" },
    { key: "performanceRating", label: "Rating", type: "number" },
];
const taFields = [
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "sportType", label: "Sport", type: "select", options: SPORTS },
    { key: "wins", label: "Wins", type: "number" },
    { key: "draws", label: "Draws", type: "number" },
    { key: "losses", label: "Losses", type: "number" },
    { key: "pointsFor", label: "Points For", type: "number" },
    { key: "pointsAgainst", label: "Points Against", type: "number" },
];

export default function AnalyticsDetail() {
    const [tab, setTab] = useState("match-analysis");
    const [matchAnalyses, setMA] = useState(MOCK.matchAnalyses);
    const [playerAnalytics, setPA] = useState(MOCK.playerAnalytics);
    const [teamAnalytics, setTA] = useState(MOCK.teamAnalytics);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSave = async (form) => {
        if (tab === "match-analysis") { await api.createMatchAnalysis(form).catch(() => { }); setMA(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "player-analytics") { await api.createPlayerAnalytics(form).catch(() => { }); setPA(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "team-analytics") { await api.createTeamAnalytics(form).catch(() => { }); setTA(d => [...d, { ...form, id: Date.now() }]); }
        setToast({ msg: "Analytics saved" }); setShowModal(false);
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Analytics Detail"
                subtitle="Match analysis, player and team performance data"
                action={<AddButton label="+ Add Analytics" onClick={() => setShowModal(true)} />}
            />
            <FilterTabs
                tabs={[["match-analysis", "🎥 Match Analysis"], ["player-analytics", "👤 Player Analytics"], ["team-analytics", "🏟️ Team Analytics"]]}
                active={tab} onSelect={setTab}
            />

            {tab === "match-analysis" && (
                <div className="flex flex-col gap-4">
                    {matchAnalyses.map(a => (
                        <div key={a.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all group">
                            <div className="flex justify-between mb-5 flex-wrap gap-3">
                                <div>
                                    <p className="font-black text-slate-100 text-lg group-hover:text-emerald-400 transition-colors uppercase tracking-tight">Match Analysis <span className="text-slate-500">#{a.matchId}</span></p>
                                    <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{a.analystKeycloakId?.slice(0, 12)}…</p>
                                </div>
                                <SportBadge sport={a.sportType} />
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                {a.possession && <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50 text-center"><p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Possession</p><p className="text-3xl font-black text-blue-400 tracking-tighter">{a.possession}%</p></div>}
                                {a.xgFor !== undefined && <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50 text-center"><p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">xG For</p><p className="text-3xl font-black text-emerald-400 tracking-tighter">{a.xgFor}</p></div>}
                                {a.xgAgainst !== undefined && <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50 text-center"><p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">xG Against</p><p className="text-3xl font-black text-red-400 tracking-tighter">{a.xgAgainst}</p></div>}
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/50">
                                <p className="text-sm text-slate-400 font-medium italic leading-relaxed"><span className="text-emerald-500 not-italic font-bold mr-2">FINDINGS:</span> {a.keyFindings}</p>
                            </div>
                        </div>
                    ))}
                    {matchAnalyses.length === 0 && <EmptyState icon="🎥" title="No match analyses yet" />}
                </div>
            )}

            {tab === "player-analytics" && (
                <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Player", "Sport", "Matches", "Minutes", "Goals", "Rating"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {playerAnalytics.map(pa => (
                                    <tr key={pa.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{pa.playerKeycloakId?.slice(0, 14)}…</td>
                                        <td className="px-6 py-4"><SportBadge sport={pa.sportType} /></td>
                                        <td className="px-6 py-4 text-sm text-slate-300 font-bold">{pa.matchesPlayed}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{pa.minutesPlayed}'</td>
                                        <td className="px-6 py-4 font-black text-emerald-400 text-base">{pa.primaryScore}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-black text-sm tracking-tight ${pa.performanceRating >= 7 ? "text-emerald-400" : pa.performanceRating >= 5 ? "text-amber-400" : "text-red-400"}`}>
                                                {pa.performanceRating}<span className="text-[10px] text-slate-600 font-bold">/10</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {playerAnalytics.length === 0 && <EmptyState icon="👤" title="No player analytics yet" />}
                    </div>
                </div>
            )}

            {tab === "team-analytics" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teamAnalytics.map(ta => (
                        <div key={ta.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all group">
                            <div className="flex justify-between mb-6">
                                <p className="font-bold text-slate-200 uppercase tracking-widest text-sm">Squad Analysis <span className="text-emerald-500">#{ta.teamId}</span></p>
                                <SportBadge sport={ta.sportType} />
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                                <div className="bg-emerald-500/5 rounded-xl py-3 border border-emerald-500/10"><p className="text-3xl font-black text-emerald-400 tracking-tighter">{ta.wins}</p><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wins</p></div>
                                <div className="bg-amber-500/5 rounded-xl py-3 border border-amber-500/10"><p className="text-3xl font-black text-amber-400 tracking-tighter">{ta.draws}</p><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Draws</p></div>
                                <div className="bg-red-500/5 rounded-xl py-3 border border-red-500/10"><p className="text-3xl font-black text-red-500 tracking-tighter">{ta.losses}</p><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Losses</p></div>
                            </div>
                            {ta.winRate && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Season Win Rate</span><span className="text-emerald-400">{Math.round(ta.winRate * 100)}%</span></div>
                                    <ProgressBar value={ta.winRate * 100} />
                                </div>
                            )}
                        </div>
                    ))}
                    {teamAnalytics.length === 0 && <EmptyState icon="🏟️" title="No team analytics yet" />}
                </div>
            )}

            {showModal && (
                <FormModal
                    title={tab === "match-analysis" ? "New Match Analysis" : tab === "player-analytics" ? "Add Player Analytics" : "Add Team Analytics"}
                    fields={tab === "match-analysis" ? maFields : tab === "player-analytics" ? paFields : taFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} onClose={() => setToast(null)} />}
        </div>
    );
}
