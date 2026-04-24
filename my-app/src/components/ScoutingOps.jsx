"use client";
import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { 
    FormModal, 
    PageHeader, 
    AddButton, 
    FilterTabs, 
    Toast, 
    EmptyState 
} from "@/src/components/shared/SharedComponents";
import { Pencil } from "lucide-react";

// الحقول الخاصة بالـ Scouts
const scoutFields = [
    { key: "username", label: "Username", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "password", label: "Password", type: "password", required: true },
    { key: "firstName", label: "First Name", required: true },
    { key: "lastName", label: "Last Name", required: true },
    { key: "age", label: "Age", type: "number" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE"] },
    { key: "region", label: "Region" },
];

const reportFields = [
    { key: "scoutKeycloakId", label: "Scout KC ID", required: true },
    { key: "playerKeycloakId", label: "Player KC ID (Optional)" },
    { key: "outerPlayerId", label: "Outer Player ID (Optional)", type: "number" },
    { key: "reportTitle", label: "Report Title", required: true },
    { key: "reportContent", label: "Detailed Content", full: true, required: true },
    { key: "rating", label: "Rating (1-10)", type: "number", required: true },
];

const outerPlayerFields = [
    { key: "firstName", label: "First Name", required: true },
    { key: "lastName", label: "Last Name", required: true },
    { key: "currentTeam", label: "Current Team" },
    { key: "position", label: "Position" },
    { key: "sportType", label: "Sport", type: "select", options: ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS"] },
    { key: "nationality", label: "Nationality" },
    { key: "age", label: "Age", type: "number" },
];

const outerTeamFields = [
    { key: "name", label: "Team Name", required: true },
    { key: "country", label: "Country" },
    { key: "league", label: "League" },
];

export default function ScoutingOps() {
    const [tab, setTab] = useState("scouts");
    const [data, setData] = useState({ "scouts": [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "scouts") res = await api.getScouts();
            else if (tab === "reports") res = await api.getScoutReports();
            else if (tab === "outer-players") res = await api.getOuterPlayers();
            else if (tab === "outer-teams") res = await api.getOuterTeams();
            
            const finalData = Array.isArray(res) ? res : (res?.content || res?.data || []);
            setData(prev => ({ ...prev, [tab]: finalData }));
        } catch (err) {
            console.error("Scouting Load Error:", err);
            setData(prev => ({ ...prev, [tab]: [] }));
            setToast({ msg: "Could not load data", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [tab]);

    const handleSave = async (form) => {
        try {
            const payload = { ...form };
            const numKeys = ["age", "rating", "outerPlayerId"];
            numKeys.forEach(k => { if (payload[k]) payload[k] = Number(payload[k]); });

            if (tab === "scouts") {
                editItem ? await api.updateScout(editItem.id, payload) : await api.createScout(payload);
            } else if (tab === "reports") {
                editItem ? await api.updateScoutReport(editItem.id, payload) : await api.createScoutReport(payload);
            } else if (tab === "outer-players") {
                editItem ? await api.updateOuterPlayer(editItem.id, payload) : await api.addOuterPlayer(payload);
            } else if (tab === "outer-teams") {
                editItem ? await api.updateOuterTeam(editItem.id, payload) : await api.createOuterTeam(payload);
            }
            
            setToast({ msg: "Record saved successfully" });
            setShowModal(false);
            setEditItem(null);
            fetchData();
        } catch (err) {
            console.error("Scouting Save Error:", err);
            setToast({ 
                msg: err.message || "Failed to save record", 
                type: "error" 
            });
        }
    };

    const currentData = data[tab] || [];

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Scout Operations"
                subtitle="Manage your scouting staff and recruitment"
                action={<AddButton label="+ Add Scout" onClick={() => { setEditItem(null); setShowModal(true); }} />}
            />
            
            <FilterTabs
                tabs={[
                    ["scouts", "🕵️ Scouts"],
                    ["reports", "📋 Reports"],
                    ["outer-players", "🌍 Players"],
                    ["outer-teams", "🏟️ Teams"]
                ]}
                active={tab} onSelect={setTab}
            />

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm min-h-[400px]">
                {loading ? (
                    <div className="p-20 text-center text-slate-500 font-bold animate-pulse uppercase tracking-[0.3em]">Loading Radar...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900/20 border-b border-slate-800">
                                <tr>
                                    {tab === "scouts" && ["Name", "Region", "Gender", "Contact", "Actions"].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                                    {tab === "reports" && ["Title", "Scout ID", "Rating", "Actions"].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                                    {tab === "outer-players" && ["Name", "Team", "Position", "Actions"].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                                    {tab === "outer-teams" && ["Name", "Country", "League", "Actions"].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map(item => (
                                    <tr key={item.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-colors">
                                        {tab === "scouts" && (
                                            <>
                                                <td className="px-6 py-4 font-bold text-slate-200">{item.firstName} {item.lastName}</td>
                                                <td className="px-6 py-4 text-xs text-slate-400">{item.region || "Global"}</td>
                                                <td className="px-6 py-4 text-xs text-slate-400">{item.gender}</td>
                                                <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{item.phone || item.email}</td>
                                            </>
                                        )}
                                        {tab === "reports" && (
                                            <>
                                                <td className="px-6 py-4 font-bold text-slate-200">{item.reportTitle}</td>
                                                <td className="px-6 py-4 text-[10px] text-slate-500 font-mono">{item.scoutKeycloakId?.slice(0, 18)}…</td>
                                                <td className="px-6 py-4 text-emerald-400 font-black text-base">{item.rating}/10</td>
                                            </>
                                        )}
                                        {tab === "outer-players" && (
                                            <>
                                                <td className="px-6 py-4 font-bold text-slate-200">{item.firstName} {item.lastName}</td>
                                                <td className="px-6 py-4 text-xs text-slate-400">{item.currentTeam || "Free Agent"}</td>
                                                <td className="px-6 py-4 text-xs text-slate-400">{item.position}</td>
                                            </>
                                        )}
                                        {tab === "outer-teams" && (
                                            <>
                                                <td className="px-6 py-4 font-bold text-slate-200">{item.name}</td>
                                                <td className="px-6 py-4 text-xs text-slate-400">{item.country}</td>
                                                <td className="px-6 py-4 text-xs text-slate-400">{item.league}</td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => { setEditItem(item); setShowModal(true); }} className="text-slate-500 hover:text-emerald-400 transition-colors">✏️</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-rose-400 transition-colors">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {currentData.length === 0 && <EmptyState icon="🔭" title={`No ${tab} records found`} />}
                    </div>
                )}
            </div>
            
            {showModal && (
                <FormModal
                    title={`${editItem ? "Edit" : "New"} Scout`}
                    fields={scoutFields}
                    initialData={editItem}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}