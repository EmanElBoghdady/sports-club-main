"use client"
import React, { useState, useEffect } from 'react';
import { api } from "@/src/lib/api";
import { 
    PageHeader, AddButton, FilterTabs, Toast, EmptyState, FormModal, StatCard, SportBadge, StatusBadge 
} from "@/src/components/shared/SharedComponents";
import TrainingDayGroup from './TrainingDayGroup';

const sessionFields = [
    { key: "title", label: "Session Title", required: true },
    { key: "sportType", label: "Sport Type", type: "select", options: ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS", "SWIMMING"] },
    { key: "type", label: "Category", type: "select", options: ["TACTICAL", "TECHNICAL", "FITNESS", "RECOVERY", "SET_PIECES"] },
    { key: "date", label: "Date", type: "date", placeholder: "YYYY-MM-DD" },
    { key: "startTime", label: "Start Time", type: "time" },
    { key: "durationMinutes", label: "Duration (Mins)", type: "number" },
    { key: "location", label: "Location", placeholder: "Main Pitch" },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "coachId", label: "Coach ID", placeholder: "uuid..." }
];

const planFields = [
    { key: "title", label: "Plan Title", required: true },
    { key: "description", label: "Description" },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "createdByCoachId", label: "Coach ID", type: "number" },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["DRAFT", "ACTIVE", "COMPLETED"] },
    { key: "goals", label: "Goals" },
    { key: "focus", label: "Focus" }
];

const drillFields = [
    { key: "trainingSessionId", label: "Session ID", type: "number", required: true },
    { key: "drillName", label: "Drill Name", required: true },
    { key: "category", label: "Category", type: "select", options: ["WARMUP", "TACTICAL", "TECHNICAL", "FITNESS", "SHOOTING_DRILL"] },
    { key: "durationMinutes", label: "Duration (Mins)", type: "number" },
    { key: "orderInSession", label: "Order In Session", type: "number" },
    { key: "intensity", label: "Intensity (1-10)", type: "number" },
    { key: "equipment", label: "Equipment" },
    { key: "description", label: "Description", full: true },
    { key: "instructions", label: "Instructions", full: true }
];

const attendanceFields = [
    { key: "trainingSessionId", label: "Session ID", type: "number", required: true },
    { key: "playerId", label: "Player ID", type: "number", required: true },
    { key: "status", label: "Status", type: "select", options: ["PRESENT", "ABSENT", "EXCUSED"] },
    { key: "checkInTime", label: "Check-in Time", type: "datetime-local" },
    { key: "absenceReason", label: "Absence Reason" },
    { key: "notes", label: "Notes", full: true }
];

const TrainingSchedule = () => {
    const [tab, setTab] = useState("sessions");
    const [data, setData] = useState({ sessions: [], plans: [], drills: [], attendance: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const loadData = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "sessions") res = await api.getTrainingSessions();
            else if (tab === "plans") res = await api.getTrainingPlans();
            else if (tab === "drills") res = await api.getTrainingDrills();
            else if (tab === "attendance") res = await api.getAttendance();

            console.log(`[Training Fetch] Response for ${tab}:`, res);
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

    const handleSave = async (form) => {
        try {
            let payload = { ...form };
            
            // Type casting
            if (payload.teamId) payload.teamId = Number(payload.teamId);
            if (payload.durationMinutes) payload.durationMinutes = Number(payload.durationMinutes);
            if (payload.trainingSessionId) payload.trainingSessionId = Number(payload.trainingSessionId);
            if (payload.createdByCoachId) payload.createdByCoachId = Number(payload.createdByCoachId);
            if (payload.orderInSession) payload.orderInSession = Number(payload.orderInSession);
            if (payload.intensity) payload.intensity = Number(payload.intensity);
            if (payload.playerId) payload.playerId = Number(payload.playerId);
            
            // Format datetime if provided
            if (payload.checkInTime) {
                payload.checkInTime = new Date(payload.checkInTime).toISOString();
            }

            if (tab === "sessions") {
                editItem ? await api.updateTrainingSession(editItem.id, payload) : await api.createTrainingSession(payload);
            } else if (tab === "plans") {
                editItem ? await api.updateTrainingPlan(editItem.id, payload) : await api.createTrainingPlan(payload);
            } else if (tab === "drills") {
                editItem ? await api.updateTrainingDrill(editItem.id, payload) : await api.createTrainingDrill(payload);
            } else if (tab === "attendance") {
                editItem ? await api.updateAttendance(editItem.id, payload) : await api.createAttendance(payload);
            }

            showToast(editItem ? "Updated successfully" : "Added successfully");
            setShowModal(false);
            setEditItem(null);
            loadData();
        } catch (err) {
            console.error("Save Error:", err);
            showToast("Failed to save data", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            if (tab === "sessions") await api.deleteTrainingSession(id);
            else if (tab === "plans") await api.deleteTrainingPlan(id);
            else if (tab === "drills") await api.deleteTrainingDrill(id);
            else if (tab === "attendance") await api.deleteAttendance(id);
            
            showToast("Deleted successfully");
            loadData();
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const getModalConfig = () => {
        let config = { title: "Add Session", fields: sessionFields };
        if (tab === "plans") config = { title: "Add Plan", fields: planFields };
        if (tab === "drills") config = { title: "Add Drill", fields: drillFields };
        if (tab === "attendance") config = { title: "Add Attendance", fields: attendanceFields };
        
        if (editItem) config.title = config.title.replace("Add", "Edit");
        return config;
    };

    // Grouping for Sessions Tab
    const groupedSessions = data.sessions.reduce((groups, item) => {
        const dateKey = item.date || item.startTime?.split('T')[0] || "No Date";
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(item);
        return groups;
    }, {});

    const tabs = [
        ["sessions", "📅 Sessions"],
        ["plans", "📝 Plans"],
        ["drills", "🏃‍♂️ Drills"],
        ["attendance", "✅ Attendance"]
    ];

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader 
                title="Training Hub" 
                subtitle="Manage your schedules, plans, drills, and team attendance" 
                action={<AddButton label={`+ Add ${tab.charAt(0).toUpperCase() + tab.slice(1, -1)}`} onClick={() => { setEditItem(null); setShowModal(true); }} />} 
            />

            <FilterTabs tabs={tabs} active={tab} onSelect={setTab} />

            {loading ? (
                <div className="text-center py-20 text-slate-500 font-black uppercase text-[10px] tracking-widest italic animate-pulse">
                    LOADING TRAINING DATA...
                </div>
            ) : (
                <div className="mt-4">
                    {/* SESSIONS TAB */}
                    {tab === "sessions" && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <StatCard label="Total Sessions" value={data.sessions.length} />
                                <StatCard label="Tactical" value={data.sessions.filter(s => s.type === 'TACTICAL').length} color="text-blue-400" />
                                <StatCard label="Fitness" value={data.sessions.filter(s => s.type === 'FITNESS').length} color="text-amber-400" />
                                <StatCard label="Technical" value={data.sessions.filter(s => s.type === 'TECHNICAL').length} color="text-purple-400" />
                            </div>

                            <div className="space-y-8 pb-10">
                                {Object.entries(groupedSessions).length > 0 ? (
                                    Object.entries(groupedSessions).map(([date, sessions]) => (
                                        <TrainingDayGroup key={date} date={date} sessions={sessions} />
                                    ))
                                ) : (
                                    <EmptyState icon="📅" title="No sessions scheduled" />
                                )}
                            </div>
                        </>
                    )}

                    {/* PLANS TAB */}
                    {tab === "plans" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Plan Title", "Duration", "Team ID", "Coach ID", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.plans.map(p => (
                                        <tr key={p.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4">
                                                <div className="text-slate-100 font-bold">{p.title}</div>
                                                <div className="text-slate-500 text-xs truncate max-w-xs">{p.description}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">
                                                {p.startDate} <span className="mx-1 text-slate-600">→</span> {p.endDate}
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 font-mono text-sm">#{p.teamId}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-mono">{p.createdByCoachId}</td>
                                            <td className="px-6 py-4"><StatusBadge status={p.status || "DRAFT"} /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(p); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(p.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.plans.length === 0 && <EmptyState icon="📝" title="No training plans" />}
                        </div>
                    )}

                    {/* DRILLS TAB */}
                    {tab === "drills" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Drill Name", "Category", "Intensity", "Duration", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.drills.map(d => (
                                        <tr key={d.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4">
                                                <div className="text-slate-100 font-bold">{d.drillName}</div>
                                                <div className="text-slate-500 text-xs truncate max-w-xs">{d.description}</div>
                                            </td>
                                            <td className="px-6 py-4"><StatusBadge status={d.category} /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-emerald-400 font-bold">{d.intensity || 5}</span>
                                                    <span className="text-[10px] text-slate-600">/ 10</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-emerald-400 font-bold">{d.durationMinutes} min</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(d); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(d.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.drills.length === 0 && <EmptyState icon="🏃‍♂️" title="No training drills" />}
                        </div>
                    )}

                    {/* ATTENDANCE TAB */}
                    {tab === "attendance" && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800">
                                        {["Session ID", "Player ID", "Check-in", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.attendance.map(a => (
                                        <tr key={a.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all">
                                            <td className="px-6 py-4 text-slate-300 font-mono text-sm">#{a.trainingSessionId}</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm font-mono">#{a.playerId}</td>
                                            <td className="px-6 py-4 text-slate-400 text-xs">
                                                {a.checkInTime ? new Date(a.checkInTime).toLocaleString() : "—"}
                                                {a.notes && <div className="text-[10px] text-slate-500 truncate max-w-[100px]">{a.notes}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border w-fit block 
                                                    ${a.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                      a.status === 'ABSENT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                                      'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setEditItem(a); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                    <button onClick={() => handleDelete(a.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.attendance.length === 0 && <EmptyState icon="✅" title="No attendance records" />}
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <FormModal
                    {...getModalConfig()}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default TrainingSchedule;