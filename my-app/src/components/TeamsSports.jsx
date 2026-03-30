"use client";
import { useState } from "react";
import { MOCK, SPORTS, SPORT_ICONS, SPORT_COLORS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, SportBadge, PageHeader, AddButton, FilterTabs, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

export default function TeamsSports() {
    const [tab, setTab] = useState("teams");
    const [teams, setTeams] = useState(MOCK.teams);
    const [sports, setSports] = useState(MOCK.sports);
    const [nationalTeams, setNational] = useState(MOCK.nationalTeams);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const teamFields = [{ key: "name", label: "Team Name", placeholder: "Blue Stars FC" }, { key: "country", label: "Country", placeholder: "Algeria" }, { key: "sportId", label: "Sport ID", type: "number" }];
    const sportFields = [{ key: "name", label: "Sport Name", placeholder: "Football Division 1" }, { key: "sportType", label: "Sport Type", type: "select", options: SPORTS }];
    const ntFields = [{ key: "name", label: "National Team Name", placeholder: "Algeria National Team" }, { key: "country", label: "Country", placeholder: "Algeria" }, { key: "sportType", label: "Sport Type", type: "select", options: SPORTS }];

    const handleSave = async (form) => {
        if (tab === "teams") {
            await api.createTeam(form).catch(() => { });
            setTeams(d => editItem ? d.map(t => t.id === editItem.id ? { ...t, ...form } : t) : [...d, { ...form, id: Date.now() }]);
        } else if (tab === "sports") {
            await api.createSport(form).catch(() => { });
            setSports(d => [...d, { ...form, id: Date.now() }]);
        } else {
            await api.createNationalTeam(form).catch(() => { });
            setNational(d => [...d, { ...form, id: Date.now() }]);
        }
        setToast({ msg: "Saved" });
        setShowModal(false); setEditItem(null);
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Teams & Sports"
                subtitle="Club teams, sport types and national teams"
                action={<AddButton label="+ Add" onClick={() => setShowModal(true)} />}
            />
            <FilterTabs
                tabs={[["teams", "🏟️ Club Teams"], ["sports", "🎯 Sports"], ["national", "🌍 National Teams"]]}
                active={tab} onSelect={setTab}
            />

            {tab === "teams" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map(t => {
                        const sp = sports.find(s => s.id === t.sportId);
                        return (
                            <div key={t.id}
                                className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all cursor-pointer group"
                                onClick={() => { setEditItem(t); setShowModal(true); }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{sp ? SPORT_ICONS[sp.sportType] : "🏟️"}</span>
                                    {sp && <SportBadge sport={sp.sportType} />}
                                </div>
                                <p className="font-bold text-slate-100 text-lg">{t.name}</p>
                                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                                    <span className="text-emerald-500">📍</span> {t.country}
                                </p>
                            </div>
                        );
                    })}
                    <div
                        className="bg-slate-900/20 rounded-2xl p-5 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all min-h-[140px] group"
                        onClick={() => { setEditItem(null); setShowModal(true); }}
                    >
                        <span className="text-3xl text-slate-700 group-hover:text-emerald-500 transition-colors">+</span>
                        <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors">Add New Team</p>
                    </div>
                </div>
            )}

            {tab === "sports" && (
                <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-800">
                                    {["Name", "Type", "Actions"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {sports.map(s => (
                                    <tr key={s.id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-slate-200">{s.name}</td>
                                        <td className="px-6 py-4"><SportBadge sport={s.sportType} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditItem(s); setShowModal(true); }}
                                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                ✏️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === "national" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nationalTeams.map(nt => (
                        <div key={nt.id}
                            className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all cursor-pointer group"
                            onClick={() => { setEditItem(nt); setShowModal(true); }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🌍</span>
                                {nt.sportType && <SportBadge sport={nt.sportType} />}
                            </div>
                            <p className="font-bold text-slate-100 text-lg">{nt.name}</p>
                            {nt.country && (
                                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                                    <span className="text-emerald-500">📍</span> {nt.country}
                                </p>
                            )}
                        </div>
                    ))}
                    <div
                        className="bg-slate-900/20 rounded-2xl p-5 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all min-h-[140px] group"
                        onClick={() => { setEditItem(null); setShowModal(true); }}
                    >
                        <span className="text-3xl text-slate-700 group-hover:text-emerald-500 transition-colors">+</span>
                        <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors">Add National Team</p>
                    </div>
                </div>
            )}

            {showModal && (
                <FormModal
                    title={tab === "teams" ? (editItem ? "Edit Team" : "Add Team") : tab === "sports" ? "Add Sport" : "Add National Team"}
                    fields={tab === "teams" ? teamFields : tab === "sports" ? sportFields : ntFields}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}
            {toast && <Toast msg={toast.msg} onClose={() => setToast(null)} />}
        </div>
    );
}
