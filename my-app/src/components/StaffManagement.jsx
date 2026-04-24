"use client";
import { useState, useEffect } from "react";
import { STAFF_ROLES } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, PageHeader, AddButton, FilterTabs, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

// ✅ Staff Fields - بدون keycloakId
const staffFields = [
    { key: "username", label: "Username", placeholder: "johndoe", required: true },
    { key: "email", label: "Email", type: "email", placeholder: "staff@club.com" },
    { key: "password", label: "Password", type: "password" },
    { key: "firstName", label: "First Name", placeholder: "John" },
    { key: "lastName", label: "Last Name", placeholder: "Doe" },
    { key: "age", label: "Age", type: "number" },
    { key: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE"] },
    { key: "phone", label: "Phone", placeholder: "01xxxxxxxxx" },
    { key: "address", label: "Address", placeholder: "City, Country", full: true },
    { key: "staffRole", label: "Staff Role", type: "select", options: STAFF_ROLES },
    { key: "sportId", label: "Sport ID", type: "number" },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "teamManagerId", label: "Team Manager ID", type: "number" }, // هيتحول لـ dropdown بعدين
    { key: "specialization", label: "Specialization", placeholder: "e.g. Tactical" },
    { key: "yearsExperience", label: "Years of Experience", type: "number" },
    { key: "coachingLicenseLevel", label: "License Level", placeholder: "UEFA Pro" },
];

// ✅ Scout Fields - بدون userKeycloakId (بيتبعت auto)
const scoutFields = [
    { key: "region", label: "Region", placeholder: "North Africa" },
    { key: "organizationName", label: "Organization", placeholder: "Agency name" },
];

// ✅ Manager Fields - حسب الـ Swagger payload بالظبط
const managerFields = [
    { key: "username", label: "Username", placeholder: "manager_01", required: true },
    { key: "email", label: "Email", type: "email", placeholder: "manager@club.com" },
    { key: "password", label: "Password", type: "password" },
    { key: "firstName", label: "First Name", placeholder: "John" },
    { key: "lastName", label: "Last Name", placeholder: "Doe" },
    { key: "age", label: "Age", type: "number" },
    { key: "phone", label: "Phone", placeholder: "+201xxxxxxxxx" },
    { key: "address", label: "Address", placeholder: "City, Country", full: true },
    { key: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE"] },
    { key: "sportId", label: "Sport ID", type: "number" },
    {
        key: "canManageAllTeams", label: "Can Manage All Teams", type: "select", options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
        ]
    },
];

export default function StaffManagement() {
    const [tab, setTab] = useState("staff");
    const [staff, setStaff] = useState([]);
    const [scouts, setScouts] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const loadData = async () => {
        setLoading(true);
        try {
            if (tab === "staff") {
                const response = await api.getStaff();
                // بنجرب الداتا أولاً، لو مش موجودة بنشوف الـ content (عشان لو الـ API متغير)
                setStaff(response.data || response.content || (Array.isArray(response) ? response : []));
            }
            else if (tab === "scouts") {
                const response = await api.getScouts();
                setScouts(response.data || response.content || (Array.isArray(response) ? response : []));
            }
            else if (tab === "managers") {
                const response = await api.getSportManagers();
                console.log("Managers Data Check:", response.data); // للتأكد إنها Array
                setManagers(response.data || []);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [tab]);

    const handleSave = async (form) => {
        try {
            if (tab === "staff") {
                const payload = {
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password || "123456",
                    firstName: form.firstName,
                    lastName: form.lastName,
                    age: Number(form.age) || 20,
                    phone: String(form.phone),
                    address: form.address || "Cairo",
                    gender: form.gender || "MALE",
                    staffRole: form.staffRole || "HEAD_COACH",
                    sportId: Number(form.sportId) || 1,
                    teamId: Number(form.teamId) || 1,
                    teamManagerId: Number(form.teamManagerId) || 1,
                    skillType: "Technical",
                    yearsExperience: Number(form.yearsExperience) || 1,
                    toolsUsed: "None",
                    coachingLicenseLevel: form.coachingLicenseLevel || "None",
                    specialization: form.specialization || "General",
                    specialty: form.specialization || "General",
                    preManagedTeams: ["string"]
                };

                console.log("📦 Sending:", JSON.stringify(payload));

                editItem
                    ? await api.updateStaff(editItem.id, payload)
                    : await api.createStaff(payload);

                showToast(editItem ? "Staff updated" : "Staff added");
            }
            else if (tab === "scouts") {
                // ✅ userKeycloakId بيتبعت auto من الـ backend — مش محتاجينه هنا
                const payload = {
                    region: form.region || "",
                    organizationName: form.organizationName || "",
                };

                editItem
                    ? await api.updateScout(editItem.id, payload)
                    : await api.createScout(payload);

                showToast("Scout saved");

            } else if (tab === "managers") {
                // تجهيز الداتا وتحويل الأنواع (Casting)
                const payload = {
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    age: Number(form.age), // تحويل لـ Number
                    phone: String(form.phone),
                    address: form.address,
                    gender: form.gender,
                    sportId: Number(form.sportId), // تحويل لـ Number
                    // تحويل الـ String لـ Boolean حقيقي
                    canManageAllTeams: form.canManageAllTeams === "true" || form.canManageAllTeams === true,
                };

                console.log("Final Clean Payload:", payload); // شوفي الفرق في الكونسول (الأرقام هتكون بلون مختلف)

                editItem
                    ? await api.updateSportManager(editItem.id, payload)
                    : await api.createSportManager(payload);

                showToast(editItem ? "Manager updated" : "Manager added");
            }
            setShowModal(false);
            setEditItem(null);
            loadData();

        } catch (err) {
            console.error("Save failed:", err.response?.data || err);
            showToast(err.response?.data?.message || "Save failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            if (tab === "staff") await api.deleteStaff(id);
            else if (tab === "scouts") await api.deleteScout(id);
            else if (tab === "managers") await api.deleteSportManager(id);
            showToast("Deleted successfully");
            loadData();
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const getModalConfig = () => {
        if (tab === "scouts") return { title: editItem ? "Edit Scout" : "Add Scout", fields: scoutFields };
        if (tab === "managers") return { title: editItem ? "Edit Manager" : "Add Manager", fields: managerFields };
        return { title: editItem ? "Edit Staff" : "Add Staff", fields: staffFields };
    };

    const tabs = [
        ["staff", "🎓 Technical Staff"],
        ["scouts", "🔭 Scouts"],
        ["managers", "👔 Managers"]
    ];

    // ✅ Table headers حسب كل تاب
    const tableHeaders = {
        staff: ["Member / Role", "Team Info", "Specialization", "Account", "Actions"],
        scouts: ["Region", "Organization", "Actions"],
        managers: ["Manager", "Sport ID", "Can Manage All", "Account", "Actions"],
    };

    return (
        <div className="fade-in p-6 bg-slate-950 min-h-screen">
            <PageHeader
                title="Staff Management"
                subtitle="Manage technical staff, scouts, and club managers"
                action={<AddButton label="+ Add Member" onClick={() => { setEditItem(null); setShowModal(true); }} />}
            />

            <FilterTabs tabs={tabs} active={tab} onSelect={setTab} />

            {loading ? (
                <div className="text-center py-20 text-slate-500 font-black uppercase text-[10px] tracking-widest italic animate-pulse">
                    Loading Personnel...
                </div>
            ) : (
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-slate-800">
                                    {tableHeaders[tab].map(h => (
                                        <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* ✅ Staff Rows */}
                                {tab === "staff" && staff.map(s => (
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
                                            <div className="text-slate-400 text-xs font-bold">Team ID: {s.teamId}</div>
                                            <div className="text-slate-600 text-[10px]">Exp: {s.yearsExperience} yrs</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-200 text-sm">{s.specialization || "Generalist"}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-400 text-xs">{s.username}</div>
                                            <div className="text-slate-600 text-[10px] italic">{s.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button onClick={() => { setEditItem(s); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                <button onClick={() => handleDelete(s.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* ✅ Scout Rows */}
                                {tab === "scouts" && scouts.map(s => (
                                    <tr key={s.id} className="border-b border-slate-900 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-slate-200 text-sm font-bold group-hover:text-sky-400 transition-colors">{s.region}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{s.organizationName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button onClick={() => { setEditItem(s); setShowModal(true); }} className="text-slate-500 hover:text-emerald-500 transition-colors">✏️</button>
                                                <button onClick={() => handleDelete(s.id)} className="text-slate-500 hover:text-rose-500 transition-colors">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* ✅ Manager Rows */}
                                {tab === "managers" && managers.map((m, index) => (
                                    <tr
                                        // استخدمنا الـ id ولو مكرر بنضيف الـ index عشان الـ React Key error
                                        key={m.id || index}
                                        className="border-b border-slate-900 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-slate-100 font-bold group-hover:text-amber-400 transition-colors">
                                                {/* التأكد من الحروف الكبيرة في firstName و lastName */}
                                                {m.firstName} {m.lastName}
                                            </div>
                                            {/* عرض الـ Keycloak ID بخط صغير جداً لو حابة للتأكد */}
                                            <div className="text-slate-600 text-[9px] truncate max-w-[150px]">
                                                UUID: {m.keycloakId}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-400 text-sm">Sport #{m.sportId}</span>
                                                <span className="text-slate-600 text-[10px]">ID: {m.id}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border w-fit block ${m.canManageAllTeams
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-slate-800 text-slate-500 border-slate-700"
                                                }`}>
                                                {m.canManageAllTeams ? "Full Access" : "Limited"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-slate-400 text-xs">{m.email}</div>
                                            <div className="text-slate-600 text-[10px]">{m.phone}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => { setEditItem(m); setShowModal(true); }}
                                                    className="text-slate-500 hover:text-emerald-500 transition-colors"
                                                    title="Edit Manager"
                                                >
                                                    ✏️
                                                </button>

                                                {/* تم تعطيل الحذف أو إخفاؤه لأن الـ Swagger لا يدعمه حالياً */}
                                                <button
                                                    onClick={() => alert("Delete not supported by API yet")}
                                                    className="text-slate-800 cursor-not-allowed"
                                                    title="Delete not available"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Empty States */}
                        {tab === "staff" && staff.length === 0 && <EmptyState icon="🎓" title="No staff members found" />}
                        {tab === "scouts" && scouts.length === 0 && <EmptyState icon="🔭" title="No scouts found" />}
                        {tab === "managers" && managers.length === 0 && <EmptyState icon="👔" title="No managers found" />}
                    </div>
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
}