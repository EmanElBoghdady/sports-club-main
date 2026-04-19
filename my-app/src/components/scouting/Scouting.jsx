"use client";
import { useState, useEffect } from "react";
import { CALLUP_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { 
    FormModal, 
    StatusBadge, 
    PageHeader, 
    AddButton, 
    FilterTabs, 
    Toast, 
    EmptyState 
} from "@/src/components/shared/SharedComponents";

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
    const [data, setData] = useState({ callups: [], players: [], teams: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "callups") res = await api.getCallups();
            else if (tab === "outer-players") res = await api.getOuterPlayers();
            else res = await api.getOuterTeams();
            
            const finalData = Array.isArray(res) ? res : (res?.content || []);
            setData(prev => ({ 
                ...prev, 
                [tab === "callups" ? "callups" : tab === "outer-players" ? "players" : "teams"]: finalData 
            }));
        } catch (err) {
            setToast({ msg: "Server connection failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [tab]);

    const handleSave = async (form) => {
        try {
            if (tab === "callups") await api.createCallup(form);
            else if (tab === "outer-players") await api.createOuterPlayer(form);
            else await api.createOuterTeam(form);
            
            setToast({ msg: "Record added to scouting radar" });
            setShowModal(false);
            fetchData();
        } catch (err) {
            setToast({ msg: "Failed to save record", type: "error" });
        }
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Scouting Operations"
                subtitle="National call-ups and talent tracking"
                action={<AddButton label="+ Add Record" onClick={() => setShowModal(true)} />}
            />
            <FilterTabs
                tabs={[["callups", "🌍 Call-Ups"], ["outer-players", "🔍 Tracked Players"], ["outer-teams", "🏟️ Opponent Teams"]]}
                active={tab} onSelect={setTab}
            />

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center text-slate-500 font-bold animate-pulse">Scanning Radar...</div>
                ) : (
                    <div className="overflow-x-auto">
                        {tab === "callups" && (
                            <table className="w-full">
                                <thead className="bg-slate-900/20 border-b border-slate-800">
                                    <tr>{["Player", "Call-Up", "Return", "Status"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {data.callups.map(c => (
                                        <tr key={c.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{c.playerKeycloakId?.slice(0, 16)}…</td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">{c.callUpDate}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">{c.returnDate}</td>
                                            <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {/* تكرار نفس هيكل الجدول للتبويبات الأخرى (Players, Teams) */}
                        {((tab === "callups" && data.callups.length === 0) || (tab === "outer-players" && data.players.length === 0) || (tab === "outer-teams" && data.teams.length === 0)) &&
                            <EmptyState icon="🔭" title="Radar is empty" />
                        }
                    </div>
                )}
            </div>
            {showModal && (
                <FormModal
                    title={`Add New ${tab.replace("-", " ")}`}
                    fields={tab === "callups" ? callupFields : tab === "outer-players" ? outerPlayerFields : outerTeamFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}