"use client";
import { useState, useEffect, useCallback } from "react";
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
    EmptyState,
    StatusBadge
} from "@/src/components/shared/SharedComponents";

// Abbreviated Fields
const trainingAnalyticsFields = [
    { key: "teamId", label: "Team ID", type: "number", required: true },
    { key: "playerKeycloakId", label: "Player KC ID (Optional)", placeholder: "Leave blank for auto-generate" },
    { key: "periodStart", label: "Period Start", type: "date" },
    { key: "periodEnd", label: "Period End", type: "date" },
    { key: "totalSessions", label: "Total Sessions", type: "number" },
    { key: "attendanceRate", label: "Attendance Rate %", type: "number" },
    { key: "notes", label: "Notes", full: true }
];

const teamAnalyticsFields = [
    { key: "teamId", label: "Team ID", type: "number", required: true },
    { key: "sportType", label: "Sport", type: "select", options: ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS"] },
    { key: "periodStart", label: "Period Start", type: "date" },
    { key: "periodEnd", label: "Period End", type: "date" },
    { key: "totalMatches", label: "Total Matches", type: "number" },
    { key: "wins", label: "Wins", type: "number" },
    { key: "draws", label: "Draws", type: "number" },
    { key: "losses", label: "Losses", type: "number" }
];

const playerAnalyticsFields = [
    { key: "playerKeycloakId", label: "Player KC ID (Optional)", placeholder: "Leave blank for auto-generate" },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "sportType", label: "Sport", type: "select", options: ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS"] },
    { key: "periodStart", label: "Period Start", type: "date" },
    { key: "periodEnd", label: "Period End", type: "date" },
    { key: "totalMatches", label: "Total Matches", type: "number" },
    { key: "primaryScore", label: "Goals/Points", type: "number" },
    { key: "averageRating", label: "Average Rating", type: "number" }
];

const matchAnalysisFields = [
    { key: "matchId", label: "Match ID", type: "number", required: true },
    { key: "teamId", label: "Team ID", type: "number", required: true },
    { key: "sportType", label: "Sport", type: "select", options: ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS"] },
    { key: "analyzedByUserKeycloakId", label: "Analyst KC ID (Optional)", placeholder: "Leave blank for auto-generate" },
    { key: "tacticalAnalysis", label: "Tactical Analysis", full: true },
    { key: "keyMoments", label: "Key Moments", full: true }
];

export default function AnalyticsDetail() {
    const [tab, setTab] = useState("match-analysis");
    const [data, setData] = useState({ matchAnalyses: [], playerAnalytics: [], teamAnalytics: [], trainingAnalytics: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const loadAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "match-analysis") res = await api.getMatchAnalyses();
            else if (tab === "player-analytics") res = await api.getPlayerAnalytics();
            else if (tab === "team-analytics") res = await api.getTeamAnalytics();
            else if (tab === "training-analytics") res = await api.getTrainingAnalytics();

            const finalData = Array.isArray(res) ? res : (res?.content || res?.data || []);
            setData(prev => ({ 
                ...prev, 
                [tab === "match-analysis" ? "matchAnalyses" : 
                 tab === "player-analytics" ? "playerAnalytics" : 
                 tab === "team-analytics" ? "teamAnalytics" : "trainingAnalytics"]: finalData 
            }));
        } catch (err) {
            console.error("Analytics Load Error:", err);
            showToast("Failed to load analytics", "error");
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

    const handleSave = async (form) => {
        try {
            let payload = { ...form };

            // Explicitly cast numbers and clean payload
            const numberKeys = ['teamId', 'totalSessions', 'attendanceRate', 'averageTrainingLoad', 'totalMatches', 'wins', 'draws', 'losses', 'pointsFor', 'pointsAgainst', 'primaryScore', 'secondaryScore', 'averageRating', 'matchId'];
            numberKeys.forEach(k => {
                if (payload[k] !== undefined && payload[k] !== "" && payload[k] !== null) {
                    payload[k] = Number(payload[k]);
                } else {
                    delete payload[k];
                }
            });

            // Auto-fill Keycloak IDs with mock UUIDs if they are left empty
            if (tab === "training-analytics" || tab === "player-analytics") {
                if (!payload.playerKeycloakId) payload.playerKeycloakId = "00000000-0000-0000-0000-000000000000";
            }
            if (tab === "match-analysis") {
                if (!payload.analyzedByUserKeycloakId) payload.analyzedByUserKeycloakId = "00000000-0000-0000-0000-000000000000";
            }

            // Remove empty strings
            Object.keys(payload).forEach(k => {
                if (payload[k] === "") delete payload[k];
            });

            let response;
            if (tab === "match-analysis") {
                response = editItem ? await api.updateMatchAnalysis(editItem.id, payload) : await api.createMatchAnalysis(payload);
            } else if (tab === "player-analytics") {
                response = editItem ? await api.updatePlayerAnalytics(editItem.id, payload) : await api.createPlayerAnalytics(payload);
            } else if (tab === "team-analytics") {
                response = editItem ? await api.updateTeamAnalytics(editItem.id, payload) : await api.createTeamAnalytics(payload);
            } else if (tab === "training-analytics") {
                response = editItem ? await api.updateTrainingAnalytics(editItem.id, payload) : await api.createTrainingAnalytics(payload);
            }

            if (response && response.success === false) {
                throw new Error(response.message || "Failed to save record");
            }

            showToast(editItem ? "Updated successfully" : "Added successfully");
            setShowModal(false);
            setEditItem(null);
            loadAnalytics();
        } catch (err) {
            console.error("Save Error:", err);
            showToast(err.message || "Error saving analytics data", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        try {
            if (tab === "match-analysis") await api.deleteMatchAnalysis(id);
            else if (tab === "player-analytics") await api.deletePlayerAnalytics(id);
            else if (tab === "team-analytics") await api.deleteTeamAnalytics(id);
            else if (tab === "training-analytics") await api.deleteTrainingAnalytics(id);

            showToast("Deleted successfully");
            loadAnalytics();
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const tabsConfig = [
        ["match-analysis", "🎥 Match Analysis"], 
        ["player-analytics", "👤 Player Analytics"], 
        ["team-analytics", "🏟️ Team Analytics"],
        ["training-analytics", "💪 Training Analytics"]
    ];

    const getModalFields = () => {
        if (tab === "match-analysis") return matchAnalysisFields;
        if (tab === "player-analytics") return playerAnalyticsFields;
        if (tab === "team-analytics") return teamAnalyticsFields;
        return trainingAnalyticsFields;
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Analytics & Reports"
                subtitle="Performance breakdowns, tactical reports, and training insights"
                action={<AddButton label={`+ Add ${tab.split('-')[0]}`} onClick={() => { setEditItem(null); setShowModal(true); }} />}
            />
            
            <FilterTabs tabs={tabsConfig} active={tab} onSelect={setTab} />

            <div className="mt-6">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 font-black uppercase text-[10px] tracking-widest italic animate-pulse mt-8">
                        LOADING ANALYTICS...
                    </div>
                ) : (
                    <>
                        {/* Match Analysis View */}
                        {tab === "match-analysis" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {data.matchAnalyses.map(a => (
                                    <div key={a.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all group relative">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditItem(a); setShowModal(true); }} className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(a.id)} className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Delete">🗑️</button>
                                        </div>
                                        <div className="flex justify-between mb-5">
                                            <div>
                                                <p className="font-black text-slate-100 text-lg uppercase">Match <span className="text-emerald-500">#{a.matchId}</span></p>
                                                <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest italic">{a.analyzedByUserKeycloakId?.slice(0, 16)}…</p>
                                            </div>
                                            <StatusBadge status={a.sportType} />
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/50 text-sm text-slate-400 leading-relaxed italic max-h-32 overflow-hidden">
                                            <span className="text-emerald-500 not-italic font-bold mr-2 uppercase tracking-tighter">Tactics:</span> {a.tacticalAnalysis || 'No analysis provided'}
                                        </div>
                                    </div>
                                ))}
                                {data.matchAnalyses.length === 0 && <div className="col-span-full"><EmptyState icon="🎥" title="No match analyses recorded" /></div>}
                            </div>
                        )}

                        {/* Player Analytics View */}
                        {tab === "player-analytics" && (
                            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-900/20 border-b border-slate-800">
                                        <tr>
                                            {["Player KC ID", "Sport", "Period", "Matches", "Score", "Rating", "Actions"].map(h => (
                                                <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.playerAnalytics.map(pa => (
                                            <tr key={pa.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02]">
                                                <td className="px-6 py-4 font-mono text-[10px] text-slate-500" title={pa.playerKeycloakId}>{pa.playerKeycloakId?.slice(0, 14)}…</td>
                                                <td className="px-6 py-4"><StatusBadge status={pa.sportType} /></td>
                                                <td className="px-6 py-4 text-slate-400 text-xs">
                                                    {pa.periodStart || '?'} <br/> <span className="text-slate-600">to</span> {pa.periodEnd || '?'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-300 font-bold">{pa.totalMatches} <span className="text-[10px] text-slate-600 font-medium">MTCH</span></td>
                                                <td className="px-6 py-4 font-black text-emerald-400 text-lg">{pa.primaryScore || 0}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-black text-base ${pa.averageRating >= 7 ? "text-emerald-400" : "text-amber-500"}`}>{pa.averageRating || 0}</span>
                                                    <span className="text-[10px] text-slate-700 font-bold">/10</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-3">
                                                        <button onClick={() => { setEditItem(pa); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                        <button onClick={() => handleDelete(pa.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {data.playerAnalytics.length === 0 && <EmptyState icon="👤" title="No player analytics data" />}
                            </div>
                        )}

                        {/* Team Analytics View */}
                        {tab === "team-analytics" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.teamAnalytics.map(ta => (
                                    <div key={ta.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/30 transition-all group relative">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditItem(ta); setShowModal(true); }} className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(ta.id)} className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Delete">🗑️</button>
                                        </div>
                                        <div className="flex justify-between mb-6">
                                            <div>
                                                <p className="font-bold text-slate-200 uppercase tracking-widest text-sm">Squad ID <span className="text-blue-500">#{ta.teamId}</span></p>
                                                <p className="text-[10px] text-slate-500 mt-1">{ta.periodStart || '?'} ➔ {ta.periodEnd || '?'}</p>
                                            </div>
                                            <StatusBadge status={ta.sportType} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                                            <div className="bg-emerald-500/5 rounded-xl py-3 border border-emerald-500/10"><p className="text-2xl font-black text-emerald-400">{ta.wins || 0}</p><p className="text-[9px] font-bold text-slate-600 uppercase">Wins</p></div>
                                            <div className="bg-amber-500/5 rounded-xl py-3 border border-amber-500/10"><p className="text-2xl font-black text-amber-400">{ta.draws || 0}</p><p className="text-[9px] font-bold text-slate-600 uppercase">Draws</p></div>
                                            <div className="bg-red-500/5 rounded-xl py-3 border border-red-500/10"><p className="text-2xl font-black text-rose-500">{ta.losses || 0}</p><p className="text-[9px] font-bold text-slate-600 uppercase">Losses</p></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                <span>Season Winrate</span>
                                                <span className="text-emerald-400">{Math.round((ta.wins / ((ta.wins + ta.draws + ta.losses) || 1)) * 100) || 0}%</span>
                                            </div>
                                            <ProgressBar value={(ta.wins / ((ta.wins + ta.draws + ta.losses) || 1)) * 100} />
                                        </div>
                                    </div>
                                ))}
                                {data.teamAnalytics.length === 0 && <EmptyState icon="🏟️" title="No team analytics recorded" />}
                            </div>
                        )}

                        {/* Training Analytics View */}
                        {tab === "training-analytics" && (
                            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-900/20 border-b border-slate-800">
                                        <tr>
                                            {["Team ID", "Player KC ID", "Period", "Total Sessions", "Attendance Rate", "Actions"].map(h => (
                                                <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.trainingAnalytics.map(ta => (
                                            <tr key={ta.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02]">
                                                <td className="px-6 py-4 font-mono text-[10px] text-slate-500">#{ta.teamId || '—'}</td>
                                                <td className="px-6 py-4 font-mono text-[10px] text-slate-500" title={ta.playerKeycloakId}>{ta.playerKeycloakId ? ta.playerKeycloakId.slice(0,14)+'…' : 'ALL'}</td>
                                                <td className="px-6 py-4 text-slate-400 text-xs">
                                                    {ta.periodStart || '?'} <br/> <span className="text-slate-600">to</span> {ta.periodEnd || '?'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-300 font-bold">{ta.totalSessions}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-black text-base ${ta.attendanceRate >= 80 ? "text-emerald-400" : "text-amber-500"}`}>{ta.attendanceRate || 0}%</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-3">
                                                        <button onClick={() => { setEditItem(ta); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                        <button onClick={() => handleDelete(ta.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {data.trainingAnalytics.length === 0 && <EmptyState icon="💪" title="No training analytics data" />}
                            </div>
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <FormModal
                    title={`${editItem ? 'Edit' : 'Add'} ${tab.split('-')[0].charAt(0).toUpperCase() + tab.split('-')[0].slice(1)} Analytics`}
                    fields={getModalFields()}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}