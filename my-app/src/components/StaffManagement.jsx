"use client";
import { useState, useEffect } from "react";
import { STAFF_ROLES } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, PageHeader, AddButton, FilterTabs, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

// 1. تعريف الحقول بناءً على الـ Schema الجديدة للسيرفر
const staffFields = [
    // بيانات الحساب (User Account)
    { key: "username", label: "Username", placeholder: "johndoe", required: true },
    { key: "email", label: "Email", type: "email", placeholder: "staff@club.com" },
    { key: "password", label: "Password", type: "password" },

    // بيانات شخصية (Personal Info)
    { key: "firstName", label: "First Name", placeholder: "John" },
    { key: "lastName", label: "Last Name", placeholder: "Doe" },
    { key: "age", label: "Age", type: "number" },
    { key: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE"] },
    { key: "phone", label: "Phone", placeholder: "01xxxxxxxxx" },
    { key: "address", label: "Address", placeholder: "City, Country", full: true },

    // بيانات الفريق والدور (Team & Role)
    { key: "staffRole", label: "Staff Role", type: "select", options: STAFF_ROLES },
    { key: "sportId", label: "Sport ID", type: "number" },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "teamManagerId", label: "Team Manager ID", type: "number" },

    // بيانات الخبرة (Technical)
    { key: "specialization", label: "Specialization", placeholder: "e.g. Tactical" },
    { key: "yearsExperience", label: "Years of Experience", type: "number" },
    { key: "coachingLicenseLevel", label: "License Level", placeholder: "UEFA Pro" },
];

const scoutFields = [
    { key: "userKeycloakId", label: "User Keycloak ID", placeholder: "uuid..." },
    { key: "region", label: "Region", placeholder: "North Africa" },
    { key: "organizationName", label: "Organization", placeholder: "Agency name" },
];

export default function StaffManagement() {
    const [tab, setTab] = useState("staff");
    const [staff, setStaff] = useState([]);
    const [scouts, setScouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const loadData = async () => {
        setLoading(true);
        try {
            if (tab === "staff") {
                const data = await api.getStaff();
                setStaff(Array.isArray(data) ? data : data?.content || []);
            } else if (tab === "scouts") {
                const data = await api.getScouts();
                setScouts(Array.isArray(data) ? data : data?.content || []);
            }
        } catch (err) {
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [tab]);

    const handleSave = async (form) => {
        try {
            if (tab === "staff") {
                // 1. بناء الـ Payload مع ضمان عدم وجود أي undefined
                const rawPayload = {
                    username: form.username || "",
                    email: form.email || "",
                    password: form.password || "",
                    firstName: form.firstName || "",
                    lastName: form.lastName || "",
                    age: Number(form.age) || 0,
                    phone: form.phone || "",
                    address: form.address || "",
                    gender: form.gender || "MALE",
                    sportId: Number(form.sportId) || 0,
                    teamId: Number(form.teamId) || 0,
                    staffRole: form.staffRole || "HEAD_COACH",
                    teamManagerId: Number(form.teamManagerId) || 0,
                    skillType: form.skillType || "General",
                    yearsExperience: Number(form.yearsExperience) || 0,
                    toolsUsed: form.toolsUsed || "Standard",
                    coachingLicenseLevel: form.coachingLicenseLevel || "None",
                    preManagedTeams: form.preManagedTeams ? [String(form.preManagedTeams)] : ["string"],
                    specialization: form.specialization || "General",
                    specialty: form.specialty || form.specialization || "General"
                };

                // 2. تحويل أي قيمة undefined إلى null أو string فاضي لضمان سلامة الـ JSON
                const sanitizedPayload = JSON.parse(JSON.stringify(rawPayload, (key, value) =>
                    value === undefined ? null : value
                ));

                console.log("🚀 Payload to send:", sanitizedPayload);

                if (editItem) {
                    await api.updateStaff(editItem.id, sanitizedPayload);
                    showToast("Staff updated successfully");
                } else {
                    await api.createStaff(sanitizedPayload);
                    showToast("Staff added successfully");
                }
            } else if (tab === "scouts") {
                await api.createScout(form);
                showToast("Scout added successfully");
            }

            setShowModal(false);
            setEditItem(null);
            loadData();
        } catch (err) {
            console.error("❌ Request Failed:", err.response?.data || err);
            const errorMsg = err.response?.data?.message || "JSON Format Error - check console";
            showToast(errorMsg, "error");
        }
    };


    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            if (tab === "staff") await api.deleteStaff(id);
            else await api.deleteScout(id);
            showToast("Deleted successfully");
            loadData();
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const tabs = [
        ["staff", "🎓 Technical Staff"],
        ["scouts", "🔭 Scouts"],
        ["managers", "👔 Managers"]
    ];

    return (
        <div className="fade-in p-6 bg-slate-950 min-h-screen">
            <PageHeader
                title="Staff Management"
                subtitle="Manage technical staff, scouts, and club managers"
                action={<AddButton label="+ Add Member" onClick={() => setShowModal(true)} />}
            />

            <FilterTabs tabs={tabs} active={tab} onSelect={setTab} />

            {loading ? (
                <div className="text-center py-20 text-slate-500 font-black uppercase text-[10px] tracking-widest italic animate-pulse">Loading Personnel...</div>
            ) : (
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-slate-800">
                                    {tab === "staff" ? (
                                        ["Member / Role", "Team Info", "Specialization", "Account", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))
                                    ) : (
                                        ["Scout ID", "Region", "Organization", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                        ))
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {tab === "staff" ? staff.map(s => (
                                    <tr key={s.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-100 font-bold group-hover:text-emerald-400 transition-colors">
                                                    {s.firstName} {s.lastName}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase border border-blue-500/20 w-fit mt-1">
                                                    {s.staffRole}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-400 text-xs font-bold uppercase">Team ID: {s.teamId}</div>
                                            <div className="text-slate-600 text-[10px]">Exp: {s.yearsExperience} Years</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-200 text-sm font-medium">
                                            {s.specialization || "Generalist"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-400 text-xs">{s.username}</div>
                                            <div className="text-slate-600 text-[10px] italic">{s.email}</div>
                                        </td>
                                        <td className="px-6 py-4 flex gap-3">
                                            <button onClick={() => { setEditItem(s); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                            <button onClick={() => handleDelete(s.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                        </td>
                                    </tr>
                                )) : scouts.map(s => (
                                    <tr key={s.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{s.userKeycloakId}</td>
                                        <td className="px-6 py-4 text-slate-200 text-sm font-bold">{s.region}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{s.organizationName}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDelete(s.id)} className="hover:text-rose-500 transition-colors">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {((tab === "staff" && staff.length === 0) || (tab === "scouts" && scouts.length === 0)) && (
                            <EmptyState icon="👥" title="No staff members found" />
                        )}
                    </div>
                </div>
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