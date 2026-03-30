"use client";
import { useState } from "react";
import { MOCK, STAFF_ROLES } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, PageHeader, AddButton, FilterTabs, StatusBadge, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

const staffFields = [
    { key: "userKeycloakId", label: "User Keycloak ID", placeholder: "uuid..." },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "staffRole", label: "Staff Role", type: "select", options: STAFF_ROLES },
    { key: "specialization", label: "Specialization", placeholder: "e.g. Tactical" },
    { key: "contractStart", label: "Contract Start", type: "date" },
    { key: "contractEnd", label: "Contract End", type: "date" },
];
const scoutFields = [
    { key: "userKeycloakId", label: "User Keycloak ID", placeholder: "uuid..." },
    { key: "region", label: "Region", placeholder: "North Africa" },
    { key: "organizationName", label: "Organization", placeholder: "Agency name" },
];

export default function StaffManagement() {
    const [tab, setTab] = useState("staff");
    const [staff, setStaff] = useState(MOCK.staff);
    const [scouts, setScouts] = useState(MOCK.scouts);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const tabs = [["staff", "🎓 Technical Staff"], ["scouts", "🔭 Scouts"], ["managers", "👔 Managers"], ["sport-managers", "🏅 Sport Managers"]];

    const handleSave = async (form) => {
        if (tab === "staff") {
            await api.createStaff(form).catch(() => { });
            setStaff(d => editItem ? d.map(s => s.id === editItem.id ? { ...s, ...form } : s) : [...d, { ...form, id: Date.now() }]);
        } else {
            await api.createScout(form).catch(() => { });
            setScouts(d => [...d, { ...form, id: Date.now() }]);
        }
        showToast("Saved");
        setShowModal(false); setEditItem(null);
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Staff Management"
                subtitle="Technical staff, scouts, managers and sport directors"
                action={<AddButton label="+ Add Member" onClick={() => setShowModal(true)} />}
            />
            <FilterTabs tabs={tabs} active={tab} onSelect={setTab} />

            {tab === "staff" && (
                <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Role", "Team", "Specialization", "Contract Period", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr></thead>
                            <tbody>
                                {staff.map(s => (
                                    <tr key={s.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                                                {s.staffRole}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">Team #{s.teamId}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300 font-semibold">{s.specialization}</td>
                                        <td className="px-6 py-4 text-[11px] font-mono text-slate-500 uppercase">{s.contractStart} → {s.contractEnd}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => { setEditItem(s); setShowModal(true); }}
                                                className="p-2 rounded-lg text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all active:scale-90"
                                                title="Edit"
                                            >✏️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {staff.length === 0 && <EmptyState icon="🎓" title="No staff added yet" />}
                    </div>
                </div>
            )}

            {tab === "scouts" && (
                <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Scout ID", "Region", "Organization"].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr></thead>
                            <tbody>
                                {scouts.map(s => (
                                    <tr key={s.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{s.userKeycloakId}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300 font-bold">{s.region}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">{s.organizationName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {scouts.length === 0 && <EmptyState icon="🔭" title="No scouts added yet" />}
                    </div>
                </div>
            )}

            {["managers", "sport-managers"].includes(tab) && (
                <EmptyState icon="👔" title={`No ${tab} yet — use the button above to add one`}
                    action={<AddButton label="+ Add" onClick={() => setShowModal(true)} />}
                />
            )}

            {showModal && (
                <FormModal
                    title={tab === "scouts" ? "Add Scout" : editItem ? "Edit Staff" : "Add Staff"}
                    fields={tab === "scouts" ? scoutFields : staffFields}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
