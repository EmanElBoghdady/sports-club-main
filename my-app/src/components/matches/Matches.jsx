"use client"
import React, { useState, useEffect } from 'react';
import { api } from "@/src/lib/api";
import { 
    PageHeader, AddButton, FilterTabs, Toast, EmptyState, FormModal, StatCard, StatusBadge 
} from "@/src/components/shared/SharedComponents";
import MatchesCard from './MatchesCard';
import MatchModal from './MatchModal';
import Filters from './Filters';
import FormationBoard from '../FormationBoard';
import { FaAward, FaCalendar, FaLifeRing, FaArrowUp, FaChessKnight } from 'react-icons/fa';

const formationFields = [
    { key: "teamId", label: "Team ID", type: "number", required: true },
    { key: "setByCoachKeycloakId", label: "Coach Keycloak ID" },
    { key: "formation", label: "Formation (e.g. 4-4-2)", required: true },
    { key: "tacticalApproach", label: "Tactical Approach", full: true },
    { key: "formationDetails", label: "Formation Details", full: true }
];

const lineupFields = [
    { key: "teamId", label: "Team ID", type: "number", required: true },
    { key: "playerId", label: "Player ID", type: "number", required: true },
    { key: "matchFormationId", label: "Formation ID", type: "number", required: true },
    { key: "lineupStatus", label: "Lineup Status", type: "select", options: ["STARTING_11", "SUBSTITUTE", "RESERVE"] },
    { key: "position", label: "Position", type: "select", options: ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"] },
    { key: "jerseyNumber", label: "Jersey Number", type: "number" },
    { key: "wasSubstituted", label: "Was Substituted?", type: "select", options: [{label: "Yes", value: true}, {label: "No", value: false}] },
    { key: "substitutionMinute", label: "Substitution Min", type: "number" },
    { key: "substitutedByPlayerId", label: "Sub By (Player ID)", type: "number" }
];

const eventFields = [
    { key: "matchId", label: "Match ID", type: "number", required: true },
    { key: "teamId", label: "Team ID", type: "number", required: true },
    { key: "playerKeycloakId", label: "Player Keycloak ID" },
    { key: "eventType", label: "Event Type", type: "select", options: ["GOAL", "ASSIST", "CARD_YELLOW", "CARD_RED", "SUBSTITUTION"] },
    { key: "minute", label: "Minute", type: "number", required: true },
    { key: "extraTime", label: "Extra Time (Min)", type: "number" },
    { key: "description", label: "Description", full: true }
];

const reviewFields = [
    { key: "matchId", label: "Match ID", type: "number", required: true },
    { key: "reviewedByCoachId", label: "Reviewer Coach ID", type: "number", required: true },
    { key: "playerId", label: "Player ID", type: "number", required: true },
    { key: "overallPerformanceRating", label: "Overall Rating (1-10)", type: "number" },
    { key: "tacticalAnalysis", label: "Tactical Analysis", full: true },
    { key: "strengths", label: "Strengths", full: true },
    { key: "weaknesses", label: "Weaknesses", full: true },
    { key: "areasForImprovement", label: "Areas for Improvement", full: true }
];

const Matches = () => {
    const [tab, setTab] = useState("matches");
    const [data, setData] = useState({ matches: [], formations: [], lineups: [], events: [], reviews: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);
    const [matchFilters, setMatchFilters] = useState({ sport: 'All' });
    const [viewBoardMatch, setViewBoardMatch] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const loadData = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "matches") res = await api.getMatches();
            else if (tab === "formations") res = await api.getMatchFormations();
            else if (tab === "lineups") res = await api.getMatchLineups();
            else if (tab === "events") res = await api.getMatchEvents();
            else if (tab === "reviews") res = await api.getMatchPerformanceReviews();

            const finalData = res?.data || res?.content || (Array.isArray(res) ? res : []);
            setData(prev => ({ ...prev, [tab]: finalData }));
        } catch (err) {
            console.error(`Fetch Error [${tab}]:`, err);
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [tab]);

    // Used for the specialized Matches tab
    const handleAddMatch = async (form) => {
        try {
            const payload = {
                ...form,
                homeTeamId: Number(form.homeTeamId) || 0,
                outerTeamId: Number(form.outerTeamId) || 0,
                attendance: form.attendance ? Number(form.attendance) : null,
                kickoffTime: form.kickoffTime ? new Date(form.kickoffTime).toISOString() : new Date().toISOString(),
            };

            if (editItem) {
                await api.updateMatch(editItem.id, payload);
            } else {
                await api.addMatch(payload);
            }
            
            showToast(editItem ? "Match Updated Successfully" : "Match Scheduled Successfully");
            setShowModal(false);
            setEditItem(null);
            loadData();
        } catch (err) {
            showToast(err.message || "Failed to save match.", "error");
        }
    };

    const handleSaveGeneric = async (form) => {
        try {
            let payload = { ...form };
            
            const numberKeys = ['matchId', 'teamId', 'playerId', 'minute', 'extraTime', 'minutesPlayed', 'overallPerformanceRating', 'reviewedByCoachId', 'jerseyNumber', 'substitutionMinute', 'substitutedByPlayerId', 'matchFormationId'];
            
            numberKeys.forEach(k => {
                if (payload[k] !== undefined && payload[k] !== "" && payload[k] !== null) {
                    payload[k] = Number(payload[k]);
                } else {
                    delete payload[k];
                }
            });
            
            if (payload.wasSubstituted === "true" || payload.wasSubstituted === true) payload.wasSubstituted = true;
            else if (payload.wasSubstituted === "false" || payload.wasSubstituted === false) payload.wasSubstituted = false;

            // Remove empty strings to prevent Spring Boot HttpMessageNotReadableException
            Object.keys(payload).forEach(k => {
                if (payload[k] === "") delete payload[k];
            });

            let response;
            if (tab === "formations") {
                response = editItem ? await api.updateMatchFormation(editItem.id, payload) : await api.createMatchFormation(payload);
            } else if (tab === "lineups") {
                response = editItem ? await api.updateMatchLineup(editItem.id, payload) : await api.createMatchLineup(payload);
            } else if (tab === "events") {
                response = editItem ? await api.updateMatchEvent(editItem.id, payload) : await api.createMatchEvent(payload);
            } else if (tab === "reviews") {
                response = editItem ? await api.updateMatchPerformanceReview(editItem.id, payload) : await api.createMatchPerformanceReview(payload);
            }

            if (response && response.success === false) {
                throw new Error(response.message || "Failed to save record");
            }

            showToast(editItem ? "Updated successfully" : "Added successfully");
            setShowModal(false);
            setEditItem(null);
            loadData();
        } catch (err) {
            console.error("Save Error:", err);
            showToast(err.message || "Failed to save data", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            if (tab === "formations") await api.deleteMatchFormation(id);
            else if (tab === "lineups") await api.deleteMatchLineup(id);
            else if (tab === "events") await api.deleteMatchEvent(id);
            else if (tab === "reviews") await api.deleteMatchPerformanceReview(id);
            
            showToast("Deleted successfully");
            loadData();
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const getModalConfig = () => {
        let config = { title: "Add Record", fields: [] };
        if (tab === "formations") config = { title: "Add Formation", fields: formationFields };
        if (tab === "lineups") config = { title: "Add Lineup", fields: lineupFields };
        if (tab === "events") config = { title: "Add Event", fields: eventFields };
        if (tab === "reviews") config = { title: "Add Review", fields: reviewFields };
        
        if (editItem) config.title = config.title.replace("Add", "Edit");
        return config;
    };

    const tabs = [
        ["matches", "🏆 Matches"],
        ["formations", "♟️ Formations"],
        ["lineups", "📋 Lineups"],
        ["events", "⚡ Events"],
        ["reviews", "⭐ Reviews"]
    ];

    // Filter Matches only
    const filteredMatches = (data.matches || []).filter(item => {
        if (matchFilters.sport === 'All' || matchFilters.sport === 'All Sports') return true;
        const sportStr = item.sportType || item.sport;
        return sportStr === matchFilters.sport;
    });

    const liveMatches = filteredMatches.filter(m => m.status === "LIVE");
    const scheduledMatches = filteredMatches.filter(m => m.status === "SCHEDULED");
    const completedMatches = filteredMatches.filter(m => m.status === "COMPLETED");

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader 
                title="Match Hub" 
                subtitle="Manage schedules, lineups, tactical formations, and match performance" 
                action={<AddButton label={`+ Add ${tab.charAt(0).toUpperCase() + tab.slice(1, -1)}`} onClick={() => { setEditItem(null); setShowModal(true); }} />} 
            />

            <FilterTabs tabs={tabs} active={tab} onSelect={setTab} />

            {loading ? (
                <div className="text-center py-20 text-slate-500 font-black uppercase text-[10px] tracking-widest italic animate-pulse">
                    LOADING MATCH DATA...
                </div>
            ) : (
                <div className="mt-4">
                    {/* MATCHES TAB */}
                    {tab === "matches" && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className='bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center gap-4'>
                                    <FaAward className="text-3xl text-emerald-500 opacity-50" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Matches</p>
                                        <p className="text-2xl font-black text-slate-100">{filteredMatches.length}</p>
                                    </div>
                                </div>
                                <div className='bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center gap-4'>
                                    <FaLifeRing className="text-3xl text-red-500 opacity-50 animate-pulse" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Now</p>
                                        <p className="text-2xl font-black text-slate-100">{liveMatches.length}</p>
                                    </div>
                                </div>
                                <div className='bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center gap-4'>
                                    <FaCalendar className="text-3xl text-blue-500 opacity-50" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scheduled</p>
                                        <p className="text-2xl font-black text-slate-100">{scheduledMatches.length}</p>
                                    </div>
                                </div>
                                <div className='bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center gap-4'>
                                    <FaArrowUp className="text-3xl text-slate-500 opacity-50" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed</p>
                                        <p className="text-2xl font-black text-slate-100">{completedMatches.length}</p>
                                    </div>
                                </div>
                            </div>

                            <Filters filters={matchFilters} updateFilter={(key, val) => setMatchFilters(p => ({ ...p, [key]: val }))} />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-10 mt-6">
                                {filteredMatches.length > 0 ? (
                                    filteredMatches.map(match => (
                                        <MatchesCard 
                                            key={match.id} 
                                            match={match} 
                                            onRefresh={loadData} 
                                            onViewDetails={(m) => setViewBoardMatch(m)} 
                                            onEdit={(m) => { setEditItem(m); setShowModal(true); }}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full"><EmptyState icon="🏆" title="No matches found" /></div>
                                )}
                            </div>
                        </>
                    )}

                    {/* FORMATIONS TAB */}
                    {tab === "formations" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.formations.map(f => (
                                <div key={f.id} className="relative border-l-4 border-emerald-500 rounded-xl p-5 bg-slate-900/50 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditItem(f); setShowModal(true); }} className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Edit">✏️</button>
                                        <button onClick={() => handleDelete(f.id)} className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Delete">🗑️</button>
                                    </div>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20">
                                            <FaChessKnight className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-emerald-400 font-black text-lg">{f.formation || 'Untitled'}</h3>
                                            <div className="flex gap-2 mt-1">
                                                <StatusBadge status={`Team #${f.teamId || '?'}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-4 border-t border-slate-800 pt-4">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><span className="text-sm">🛡️</span> Approach</span>
                                            <span className="text-slate-300 font-medium max-w-[120px] truncate" title={f.tacticalApproach}>{f.tacticalApproach || '—'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><span className="text-sm">⚔️</span> Coach ID</span>
                                            <span className="text-slate-300 font-mono">{f.setByCoachKeycloakId || '—'}</span>
                                        </div>
                                    </div>
                                    {f.formationDetails && (
                                        <div className="mt-4 text-[10px] text-slate-400 italic border-t border-slate-800/50 pt-3 max-h-16 overflow-hidden">
                                            "{f.formationDetails}"
                                        </div>
                                    )}
                                </div>
                            ))}
                            {data.formations.length === 0 && <div className="col-span-full"><EmptyState icon="♟️" title="No formations found" /></div>}
                        </div>
                    )}

                    {/* LINEUPS TAB */}
                    {tab === "lineups" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Formation ID", "Team ID", "Player ID", "Position", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.lineups.map(l => (
                                        <tr key={l.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{l.matchFormationId || '—'}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{l.teamId}</td>
                                            <td className="px-6 py-4 text-slate-100 font-mono text-sm">#{l.playerId}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-black">{l.position}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border w-fit block 
                                                    ${l.lineupStatus === 'STARTING_11' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                    {l.lineupStatus || 'UNKNOWN'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(l); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(l.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.lineups.length === 0 && <EmptyState icon="📋" title="No lineups found" />}
                        </div>
                    )}

                    {/* EVENTS TAB */}
                    {tab === "events" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Match ID", "Team ID", "Minute", "Event Type", "Player KC ID", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.events.map(e => (
                                        <tr key={e.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{e.matchId}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{e.teamId || '—'}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-black">{e.minute}' {e.extraTime ? `+${e.extraTime}` : ''}</td>
                                            <td className="px-6 py-4"><StatusBadge status={e.eventType} /></td>
                                            <td className="px-6 py-4 text-slate-100 font-mono text-sm" title={e.playerKeycloakId}>
                                                {e.playerKeycloakId ? `${e.playerKeycloakId.substring(0,6)}...` : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(e); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(e.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.events.length === 0 && <EmptyState icon="⚡" title="No events found" />}
                        </div>
                    )}

                    {/* REVIEWS TAB */}
                    {tab === "reviews" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Match ID", "Reviewer ID", "Player ID", "Rating", "Analysis", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.reviews.map(r => (
                                        <tr key={r.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{r.matchId}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{r.reviewedByCoachId || '—'}</td>
                                            <td className="px-6 py-4 text-slate-100 font-mono text-sm">#{r.playerId || '—'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-emerald-400 font-black text-lg">{r.overallPerformanceRating || 5}</span>
                                                    <span className="text-[10px] text-slate-600 font-bold">/ 10</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">{r.tacticalAnalysis || r.strengths || r.weaknesses || 'No comments'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(r); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(r.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.reviews.length === 0 && <EmptyState icon="⭐" title="No reviews found" />}
                        </div>
                    )}
                </div>
            )}

            {showModal && tab === "matches" && (
                <MatchModal
                    open={showModal}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    onAddMatch={handleAddMatch}
                    initialData={editItem}
                />
            )}

            {showModal && tab !== "matches" && (
                <FormModal
                    {...getModalConfig()}
                    onSubmit={handleSaveGeneric}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}

            {viewBoardMatch && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 fade-in">
                    <div className="bg-slate-950 rounded-2xl shadow-2xl w-full max-w-4xl relative border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50">
                            <h2 className="font-black text-slate-100 text-xl uppercase tracking-tight flex items-center gap-3">
                                <FaChessKnight className="text-emerald-500" />
                                Tactical Board
                                <span className="text-sm font-medium text-slate-500 ml-2">Match #{viewBoardMatch.id}</span>
                            </h2>
                            <button onClick={() => setViewBoardMatch(null)} className="text-slate-500 hover:text-slate-300 rounded-lg p-2 hover:bg-slate-900 transition-all font-bold">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <FormationBoard match={viewBoardMatch} />
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Matches;