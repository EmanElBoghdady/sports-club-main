"use client";
import { useState, useEffect } from "react";
import { SPORTS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { 
    FormModal, 
    SportBadge, 
    PageHeader, 
    AddButton, 
    FilterTabs, 
    ProgressBar, 
    Toast, 
    EmptyState 
} from "@/src/components/shared/SharedComponents";

// حقول النماذج
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
    const [data, setData] = useState({ matchAnalyses: [], playerAnalytics: [], teamAnalytics: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    // دالة جلب البيانات من السيرفر
    const loadAnalytics = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "match-analysis") res = await api.getMatchAnalyses();
            else if (tab === "player-analytics") res = await api.getPlayerAnalytics();
            else res = await api.getTeamAnalytics();

            const finalData = Array.isArray(res) ? res : (res?.content || []);
            setData(prev => ({ 
                ...prev, 
                [tab === "match-analysis" ? "matchAnalyses" : tab === "player-analytics" ? "playerAnalytics" : "teamAnalytics"]: finalData 
            }));
        } catch (err) {
            console.error("Analytics Load Error:", err);
            setToast({ msg: "Failed to load analytics", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAnalytics(); }, [tab]);

    const handleSave = async (form) => {
        try {
            if (tab === "match-analysis") await api.createMatchAnalysis(form);
            else if (tab === "player-analytics") await api.createPlayerAnalytics(form);
            else await api.createTeamAnalytics(form);

            setToast({ msg: "Analytics saved successfully!" });
            setShowModal(false);
            loadAnalytics();
        } catch (err) {
            setToast({ msg: "Error saving analytics data", type: "error" });
        }
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Analytics Detail"
                subtitle="Performance breakdown and technical reports"
                action={<AddButton label="+ New Analysis" onClick={() => setShowModal(true)} />}
            />
            
            <FilterTabs
                tabs={[
                    ["match-analysis", "🎥 Match"], 
                    ["player-analytics", "👤 Player"], 
                    ["team-analytics", "🏟️ Team"]
                ]}
                active={tab} onSelect={setTab}
            />

            <div className="mt-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-slate-500 font-bold animate-pulse">
                        PROCESSING ANALYTICS...
                    </div>
                ) : (
                    <>
                        {/* Match Analysis View */}
                        {tab === "match-analysis" && (
                            <div className="flex flex-col gap-4">
                                {data.matchAnalyses.map(a => (
                                    <div key={a.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all group">
                                        <div className="flex justify-between mb-5">
                                            <div>
                                                <p className="font-black text-slate-100 text-lg uppercase">Match Analysis <span className="text-slate-500">#{a.matchId}</span></p>
                                                <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest italic">{a.analystKeycloakId?.slice(0, 16)}…</p>
                                            </div>
                                            <SportBadge sport={a.sportType} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mb-5 text-center">
                                            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                                                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Possession</p>
                                                <p className="text-3xl font-black text-blue-400">{a.possession}%</p>
                                            </div>
                                            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                                                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">xG For</p>
                                                <p className="text-3xl font-black text-emerald-400">{a.xgFor}</p>
                                            </div>
                                            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                                                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">xG Against</p>
                                                <p className="text-3xl font-black text-rose-500">{a.xgAgainst}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/50 text-sm text-slate-400 leading-relaxed italic">
                                            <span className="text-emerald-500 not-italic font-bold mr-2 uppercase tracking-tighter">Key Findings:</span> {a.keyFindings}
                                        </div>
                                    </div>
                                ))}
                                {data.matchAnalyses.length === 0 && <EmptyState icon="🎥" title="No match analyses recorded" />}
                            </div>
                        )}

                        {/* Player Analytics View */}
                        {tab === "player-analytics" && (
                            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-900/20 border-b border-slate-800">
                                        <tr>
                                            {["Player ID", "Sport", "Played", "Score", "Rating"].map(h => (
                                                <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.playerAnalytics.map(pa => (
                                            <tr key={pa.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02]">
                                                <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{pa.playerKeycloakId?.slice(0, 14)}…</td>
                                                <td className="px-6 py-4"><SportBadge sport={pa.sportType} /></td>
                                                <td className="px-6 py-4 text-slate-300 font-bold">{pa.matchesPlayed} <span className="text-[10px] text-slate-600 font-medium">MTCH</span></td>
                                                <td className="px-6 py-4 font-black text-emerald-400 text-lg">{pa.primaryScore}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-black text-base ${pa.performanceRating >= 7 ? "text-emerald-400" : "text-amber-500"}`}>{pa.performanceRating}</span>
                                                    <span className="text-[10px] text-slate-700 font-bold">/10</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {data.playerAnalytics.length === 0 && <EmptyState icon="👤" title="No player performance data" />}
                            </div>
                        )}

                        {/* Team Analytics View */}
                        {tab === "team-analytics" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.teamAnalytics.map(ta => (
                                    <div key={ta.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/30 transition-all">
                                        <div className="flex justify-between mb-6">
                                            <p className="font-bold text-slate-200 uppercase tracking-widest text-sm">Squad ID <span className="text-blue-500">#{ta.teamId}</span></p>
                                            <SportBadge sport={ta.sportType} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                                            <div className="bg-emerald-500/5 rounded-xl py-3 border border-emerald-500/10"><p className="text-2xl font-black text-emerald-400">{ta.wins}</p><p className="text-[9px] font-bold text-slate-600 uppercase">Wins</p></div>
                                            <div className="bg-amber-500/5 rounded-xl py-3 border border-amber-500/10"><p className="text-2xl font-black text-amber-400">{ta.draws}</p><p className="text-[9px] font-bold text-slate-600 uppercase">Draws</p></div>
                                            <div className="bg-red-500/5 rounded-xl py-3 border border-red-500/10"><p className="text-2xl font-black text-rose-500">{ta.losses}</p><p className="text-[9px] font-bold text-slate-600 uppercase">Losses</p></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                <span>Season Winrate</span>
                                                <span className="text-emerald-400">{Math.round((ta.wins / (ta.wins + ta.draws + ta.losses || 1)) * 100)}%</span>
                                            </div>
                                            <ProgressBar value={(ta.wins / (ta.wins + ta.draws + ta.losses || 1)) * 100} />
                                        </div>
                                    </div>
                                ))}
                                {data.teamAnalytics.length === 0 && <EmptyState icon="🏟️" title="No team analytics recorded" />}
                            </div>
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <FormModal
                    title={`Add New ${tab.replace("-", " ")}`}
                    fields={tab === "match-analysis" ? maFields : tab === "player-analytics" ? paFields : taFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}