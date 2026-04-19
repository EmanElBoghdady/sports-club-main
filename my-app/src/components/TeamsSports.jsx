"use client";
import { useState, useEffect } from "react";
import { SPORTS, SPORT_ICONS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, SportBadge, PageHeader, AddButton, FilterTabs, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

export default function TeamsSports() {
    const [tab, setTab] = useState("teams");
    const [teams, setTeams] = useState([]);
    const [sports, setSports] = useState([]);
    const [nationalTeams, setNational] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    // 1. تعريف الحقول ديناميكياً
    const teamFields = [
        { key: "name", label: "Team Name", placeholder: "e.g. Under-21 Stars" },
        { key: "country", label: "Country", placeholder: "Algeria" },
        { key: "sportId", label: "Sport", type: "select", 
          options: sports.map(s => ({ value: s.id, label: s.name })) 
        }
    ];

    const sportFields = [
        { key: "name", label: "League/Sport Name", placeholder: "First Division" },
        { key: "sportType", label: "Sport Category", type: "select", options: SPORTS }
    ];

    // 2. جلب البيانات من السيرفر
    const loadAllData = async () => {
        setLoading(true);
        try {
            const [teamsRes, sportsRes, ntRes] = await Promise.all([
                api.getTeams(),
                api.getSports(),
                api.getNationalTeams()
            ]);
            setTeams(Array.isArray(teamsRes) ? teamsRes : teamsRes?.content || []);
            setSports(Array.isArray(sportsRes) ? sportsRes : sportsRes?.content || []);
            setNational(Array.isArray(ntRes) ? ntRes : ntRes?.content || []);
        } catch (err) {
            setToast({ msg: "Error loading data", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    // 3. معالجة الحفظ
    const handleSave = async (form) => {
        try {
            if (tab === "teams") {
                editItem ? await api.updateTeam(editItem.id, form) : await api.createTeam(form);
            } else if (tab === "sports") {
                await api.createSport(form);
            } else {
                await api.createNationalTeam(form);
            }
            setToast({ msg: "Successfully Saved!" });
            setShowModal(false);
            setEditItem(null);
            loadAllData(); // تحديث القائمة
        } catch (err) {
            setToast({ msg: "Save failed", type: "error" });
        }
    };

    if (loading) return <div className="p-10 text-white font-black text-center tracking-widest">LOADING TEAMS...</div>;

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Teams & Sports"
                subtitle="Organize club structure and sport categories"
                action={<AddButton label="+ Add New" onClick={() => setShowModal(true)} />}
            />
            
            <FilterTabs
                tabs={[ ["teams", "🏟️ Club Teams"], ["sports", "🎯 Sports"], ["national", "🌍 National Teams"] ]}
                active={tab} onSelect={setTab}
            />

            {/* عرض الفرق كبطاقات (Cards) */}
            {tab === "teams" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(t => {
                        const sp = sports.find(s => s.id === t.sportId);
                        return (
                            <div key={t.id} className="group bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-emerald-500/50 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-3xl group-hover:scale-110 transition-transform">
                                        {sp ? SPORT_ICONS[sp.sportType] : "🏟️"}
                                    </div>
                                    {sp && <SportBadge sport={sp.sportType} />}
                                </div>
                                <h3 className="text-xl font-black text-slate-100 mb-1">{t.name}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">📍 {t.country}</p>
                                <button 
                                    onClick={() => { setEditItem(t); setShowModal(true); }}
                                    className="w-full py-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                                >
                                    Manage Team
                                </button>
                            </div>
                        );
                    })}
                    <button onClick={() => setShowModal(true)} className="border-2 border-dashed border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-600 hover:border-emerald-500/50 hover:text-emerald-500 transition-all">
                        <span className="text-3xl mb-2">+</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">New Team</span>
                    </button>
                </div>
            )}

            {/* عرض الرياضات كجدول */}
            {tab === "sports" && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950">
                            <tr>
                                {["Sport Name", "Category", "ID"].map(h => (
                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {sports.map(s => (
                                <tr key={s.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 font-bold text-slate-200">{s.name}</td>
                                    <td className="px-6 py-4"><SportBadge sport={s.sportType} /></td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{s.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* عرض المنتخبات */}
            {tab === "national" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nationalTeams.map(nt => (
                        <div key={nt.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                             <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl">🌍</span>
                                <SportBadge sport={nt.sportType} />
                             </div>
                             <h3 className="text-lg font-black text-slate-100">{nt.name}</h3>
                             <p className="text-xs text-slate-500 font-bold uppercase mt-1">{nt.country}</p>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <FormModal
                    title={tab === "teams" ? "Team Details" : tab === "sports" ? "Add Sport" : "Add National Team"}
                    fields={tab === "teams" ? teamFields : tab === "sports" ? sportFields : ntFields}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}
            
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}