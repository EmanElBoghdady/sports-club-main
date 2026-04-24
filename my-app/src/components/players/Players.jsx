"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/src/lib/api";
import PlayerCard from "./PlayerCard";
import PlayerFilter from "./PlayerFilter";
import Modal from "./Modal";
import { FaUser } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Card from "./Card";
import Header from "../Header";
import { FilterTabs, FormModal, Toast, EmptyState, StatusBadge } from "@/src/components/shared/SharedComponents";

const SPORT_MAP = {
    football: ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"],
    basketball: ["POINT_GUARD", "SHOOTING_GUARD", "SMALL_FORWARD", "POWER_FORWARD", "CENTER"],
    handball: ["LEFT_WING", "RIGHT_WING", "LEFT_BACK", "RIGHT_BACK", "CENTRE_BACK", "PIVOT"]
};

const getSportFromPosition = (pos) => {
    if (!pos) return "";
    const p = pos.toUpperCase().trim();

    if (SPORT_MAP.football.includes(p)) return "football";
    if (SPORT_MAP.basketball.includes(p)) return "basketball";
    if (SPORT_MAP.handball.includes(p)) return "handball";
    return "";
};

const trainingAssessmentFields = [
    { key: "trainingSessionId", label: "Session ID", type: "number", required: true },
    { key: "playerId", label: "Player ID", type: "number", required: true },
    { key: "assessedByCoachId", label: "Coach ID", type: "number", required: true },
    { key: "condition", label: "Condition", type: "select", options: ["EXCELLENT", "GOOD", "FAIR", "POOR", "INJURED"] },
    { key: "performanceRating", label: "Performance (1-10)", type: "number" },
    { key: "effortRating", label: "Effort (1-10)", type: "number" },
    { key: "attitudeRating", label: "Attitude (1-10)", type: "number" },
    { key: "strengths", label: "Strengths", full: true },
    { key: "areasForImprovement", label: "Areas for Improvement", full: true },
    { key: "coachComments", label: "Coach Comments", full: true }
];

const matchStatsFields = [
    { key: "matchId", label: "Match ID", type: "number", required: true },
    { key: "playerId", label: "Player ID", type: "number", required: true },
    { key: "sportType", label: "Sport Type", type: "select", options: ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS"] },
    { key: "minutesPlayed", label: "Minutes Played", type: "number" },
    { key: "performanceRating", label: "Rating (1-10)", type: "number" },
    { key: "goals", label: "Goals (Football)", type: "number" },
    { key: "assists", label: "Assists", type: "number" },
    { key: "yellowCards", label: "Yellow Cards", type: "number" },
    { key: "redCards", label: "Red Cards", type: "number" },
    { key: "points", label: "Points (Basketball)", type: "number" },
    { key: "rebounds", label: "Rebounds", type: "number" },
    { key: "goalsHandball", label: "Goals (Handball)", type: "number" },
    { key: "saves", label: "Saves (Goalkeeper)", type: "number" }
];

const playerFields = [
    { key: "firstName", label: "First Name", required: true },
    { key: "lastName", label: "Last Name", required: true },
    { key: "nationality", label: "Nationality" },
    { key: "dateOfBirth", label: "Date of Birth", type: "date" },
    { key: "preferredPosition", label: "Position", type: "select", options: ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD", "POINT_GUARD", "SHOOTING_GUARD", "SMALL_FORWARD", "POWER_FORWARD", "CENTER", "LEFT_WING", "RIGHT_WING", "LEFT_BACK", "RIGHT_BACK", "CENTRE_BACK", "PIVOT"] },
    { key: "height", label: "Height (cm)", type: "number" },
    { key: "weight", label: "Weight (kg)", type: "number" },
    { key: "foot", label: "Preferred Foot", type: "select", options: ["LEFT", "RIGHT", "BOTH"] },
    { key: "kitNumber", label: "Kit Number", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["AVAILABLE", "INJURED", "ABSENT", "SUSPENDED"] }
];

function Players() {
    const [tab, setTab] = useState("directory");
    const sports = ["All Sports", "Football", "Basketball", "Handball"];
    const [selectedSport, setSelectedSport] = useState("All Sports");
    const [search, setSearch] = useState("");

    const [openPlayerModal, setOpenPlayerModal] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const [data, setData] = useState({ directory: [], stats: [], assessments: [] });
    const [loading, setLoading] = useState(true);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "directory") res = await api.getOuterPlayers();
            else if (tab === "stats") res = await api.getPlayerMatchStatistics();
            else if (tab === "assessments") res = await api.getPlayerTrainingAssessments();

            const actualData = Array.isArray(res) ? res : (res?.content || res?.data || []);
            setData(prev => ({ ...prev, [tab]: actualData }));
        } catch (err) {
            console.error(`Fetch Error [${tab}]:`, err);
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => { loadData(); }, [loadData]);

    const filteredPlayers = (data.directory || []).filter((p) => {
        const playerName = (p.name || p.firstName || "").toLowerCase();
        const searchTerm = search.toLowerCase();
        const playerSport = getSportFromPosition(p.preferredPosition || p.position);
        const searchMatch = playerName.includes(searchTerm);
        const sportMatch = selectedSport === "All Sports" || playerSport === selectedSport.toLowerCase();
        return sportMatch && searchMatch;
    });

    const handleSaveGeneric = async (form) => {
        try {
            let payload = { ...form };

            // Cast numbers
            const numberKeys = ['height', 'weight', 'kitNumber', 'trainingSessionId', 'playerId', 'assessedByCoachId', 'performanceRating', 'effortRating', 'attitudeRating', 'matchId', 'minutesPlayed', 'goals', 'assists', 'yellowCards', 'redCards', 'points', 'rebounds', 'goalsHandball', 'saves'];
            numberKeys.forEach(k => {
                if (payload[k] !== undefined && payload[k] !== "" && payload[k] !== null) {
                    payload[k] = Number(payload[k]);
                } else if (payload[k] === "" || payload[k] === null) {
                    delete payload[k];
                }
            });

            let response;
            if (tab === "directory") {
                if (editItem) {
                    response = await api.updateOuterPlayer(editItem.id, payload);
                }
            } else if (tab === "stats") {
                response = editItem ? await api.updatePlayerMatchStatistic(editItem.id, payload) : await api.createPlayerMatchStatistic(payload);
            } else if (tab === "assessments") {
                response = editItem ? await api.updatePlayerTrainingAssessment(editItem.id, payload) : await api.createPlayerTrainingAssessment(payload);
            }

            showToast(editItem ? "Updated successfully" : "Added successfully");
            setOpenFormModal(false);
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
            if (tab === "stats") await api.deletePlayerMatchStatistic(id);
            else if (tab === "assessments") await api.deletePlayerTrainingAssessment(id);

            showToast("Deleted successfully");
            loadData();
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const tabsConfig = [
        ["directory", "👥 Directory"],
        ["stats", "📊 Match Stats"],
        ["assessments", "💪 Training Assessments"]
    ];

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <Header
                title={"Player Hub"}
                desc={"Manage players, view detailed match statistics, and track training assessments"}
                buttonTitle={tab === "directory" ? "Add Player" : `Add ${tab === "stats" ? "Stat" : "Assessment"}`}
                icon={<FaUser className="text-white" />}
                onClick={() => {
                    if (tab === "directory") setOpenPlayerModal(true);
                    else { setEditItem(null); setOpenFormModal(true); }
                }}
            />

            <FilterTabs tabs={tabsConfig} active={tab} onSelect={setTab} />

            <Modal open={openPlayerModal} onClose={() => setOpenPlayerModal(false)} onAddPlayer={loadData} />

            {loading ? (
                <div className="text-center py-20 text-slate-500 font-black uppercase text-[10px] tracking-widest italic animate-pulse mt-8">
                    LOADING DATA...
                </div>
            ) : (
                <div className="mt-6">
                    {tab === "directory" && (
                        <>
                            <div className="bg-slate-900/50 backdrop-blur-sm px-6 py-4 rounded-2xl flex flex-col lg:flex-row justify-between items-center gap-6 border border-slate-800">
                                <div className="flex items-center rounded-xl px-4 py-3 w-full lg:w-1/3 bg-slate-950 border border-slate-800">
                                    <FaMagnifyingGlass className="text-slate-500 mr-3" />
                                    <input
                                        type="search"
                                        placeholder="Search players..."
                                        className="bg-transparent outline-none w-full text-xs text-slate-100"
                                        onChange={(e) => setSearch(e.target.value)}
                                        value={search}
                                    />
                                </div>
                                <PlayerFilter sports={sports} selectedSport={selectedSport} setSelectedSport={setSelectedSport} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
                                <Card title="Total Players" num={data.directory.length.toString()} icon="👥" />
                                <Card title="Football" num={data.directory.filter(p => getSportFromPosition(p.preferredPosition) === "football").length.toString()} icon="⚽" />
                                <Card title="Basketball" num={data.directory.filter(p => getSportFromPosition(p.preferredPosition) === "basketball").length.toString()} icon="🏀" />
                                <Card title="Handball" num={data.directory.filter(p => getSportFromPosition(p.preferredPosition) === "handball").length.toString()} icon="🤾" />
                            </div>

                            {filteredPlayers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                                    {filteredPlayers.map((player) => (
                                        <PlayerCard
                                            key={player.id}
                                            player={player}
                                            onEdit={(p) => { setEditItem(p); setOpenFormModal(true); }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon="👥" title="No players found" />
                            )}
                        </>
                    )}

                    {tab === "stats" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Match ID", "Player ID", "Sport", "Rating", "Key Stats", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.stats.map(s => (
                                        <tr key={s.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{s.matchId}</td>
                                            <td className="px-6 py-4 text-slate-100 font-mono text-sm">#{s.playerId}</td>
                                            <td className="px-6 py-4"><StatusBadge status={s.sportType} /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-emerald-400 font-black text-lg">{s.performanceRating || 0}</span>
                                                    <span className="text-[10px] text-slate-600 font-bold">/ 10</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs">
                                                {s.goals ? `⚽ Goals: ${s.goals} ` : ''}
                                                {s.assists ? `👟 Assists: ${s.assists} ` : ''}
                                                {s.points ? `🏀 Points: ${s.points} ` : ''}
                                                {s.minutesPlayed ? `⏱️ Min: ${s.minutesPlayed}` : ''}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(s); setOpenFormModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(s.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.stats.length === 0 && <EmptyState icon="📊" title="No match statistics found" />}
                        </div>
                    )}

                    {tab === "assessments" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Session ID", "Player ID", "Coach ID", "Condition", "Overall", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.assessments.map(a => (
                                        <tr key={a.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{a.trainingSessionId}</td>
                                            <td className="px-6 py-4 text-slate-100 font-mono text-sm">#{a.playerId}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">#{a.assessedByCoachId}</td>
                                            <td className="px-6 py-4"><StatusBadge status={a.condition || 'UNKNOWN'} /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-slate-400">Perf: <span className="text-emerald-400 font-bold">{a.performanceRating || 0}/10</span></span>
                                                    <span className="text-xs text-slate-400">Effort: <span className="text-emerald-400 font-bold">{a.effortRating || 0}/10</span></span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(a); setOpenFormModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(a.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.assessments.length === 0 && <EmptyState icon="💪" title="No training assessments found" />}
                        </div>
                    )}
                </div>
            )}

            {openFormModal && (
                <FormModal
                    title={editItem ? `Edit ${tab === "directory" ? "Player" : tab === "stats" ? "Statistic" : "Assessment"}` : `Add ${tab === "stats" ? "Statistic" : "Assessment"}`}
                    fields={tab === "directory" ? playerFields : tab === "stats" ? matchStatsFields : trainingAssessmentFields}
                    onSubmit={handleSaveGeneric}
                    onClose={() => { setOpenFormModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default Players;