"use client";
import { useState, useEffect } from "react";
import { ROLES } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import {
    FormModal, StatusBadge, Avatar, StatCard, PageHeader, AddButton, Toast, EmptyState
} from "@/src/components/shared/SharedComponents";

const ROLE_COLORS = {
    ADMIN: "text-red-400 bg-red-500/10 border-red-500/20",
    PLAYER: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    HEAD_COACH: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    DOCTOR: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    SCOUT: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    SPONSOR: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const fields = [
    { key: "username", label: "Username", placeholder: "johndoe123" },
    { key: "email", label: "Email", type: "email", placeholder: "john@club.com" },
    { key: "password", label: "Password", type: "password", placeholder: "********" }, // مهم جداً
    { key: "firstName", label: "First Name", placeholder: "John" },
    { key: "lastName", label: "Last Name", placeholder: "Doe" },
    { key: "displayName", label: "Display Name", placeholder: "Johnny" },
    { key: "age", label: "Age", type: "number", placeholder: "25" },
    { key: "phone", label: "Phone", placeholder: "+213..." },
    { key: "address", label: "Address", placeholder: "123 Main St" },
    { key: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE"] },
    { key: "role", label: "Role", type: "select", options: ROLES },
    { key: "specialization", label: "Specialization", placeholder: "Goalkeeper Coach" },
    { key: "experienceYears", label: "Experience Years", type: "number", placeholder: "5" },
    { key: "bloodType", label: "Blood Type", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    { key: "favoriteTeamId", label: "Favorite Team ID", type: "number", placeholder: "1" },
];
export default function UserManagement() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    // 1. تحميل البيانات عند فتح الصفحة
    // داخل صفحة UserManagement.jsx

    const loadUsers = async () => {
        try {
            setLoading(true);

            // تنظيف الفلاتر: نبعت الحقل فقط لو فيه قيمة فعلاً
            const params = {};
            if (roleFilter !== "ALL") params.role = roleFilter;
            if (search.trim() !== "") params.firstName = search;

            // نداء الـ API بالفلاتر "المنظفة"
            const response = await api.getUsers(params);

            // تحديث الداتا
            const finalData = Array.isArray(response) ? response : response.content || response.data || [];
            setData(finalData);

            console.log("Fetched Data:", finalData); // شوفي في الكونسول هل الأدمن الجديد موجود في المصفوفة؟
        } catch (error) {
            console.error("Fetch error:", error);
            showToast("Failed to fetch users", "error");
        } finally {
            setLoading(false);
        }
    };

    // تأكدي إن الـ useEffect بينادي loadUsers لما الـ roleFilter يتغير
    useEffect(() => {
        loadUsers();
    }, [roleFilter]); // هتعمل إعادة تحميل كل ما تغيري الفلتر

    // 2. البحث والتصفية (Client-side)
    const filtered = (data || []).filter(u =>
        (roleFilter === "ALL" || u.role === roleFilter) &&
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );


    const handleSave = async (form) => {
        // تجهيز الداتا وتحويل الأنواع بدقة لتطابق البوست مان
        const payload = {
            ...form,

            age: form.age ? Number(form.age) : 0,
            experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
            favoriteTeamId: form.favoriteTeamId ? Number(form.favoriteTeamId) : 1,

            gender: form.gender?.toUpperCase(),
            role: form.role?.toUpperCase(),
            bloodType: form.bloodType?.toUpperCase(),
        };

        console.log("🚀 Payload being sent to server:", payload);

        try {
            // نداء الأندبوينت الخاص بالأدمن
            const res = await api.adminCreateUser(payload);
            console.log("✅ Success Response:", res);
            showToast("User created successfully!");
            loadUsers();
        } catch (error) {
            console.error("❌ Request Failed:", error);
            showToast("Bad Request (400): راجعي البيانات المدخلة", "error");
        }
        setShowModal(false);
        setEditItem(null);
    };
    // 4. حذف مستخدم
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.deleteUser(id);
            showToast("User deleted from server", "error");
            loadUsers();
        } catch (error) {
            showToast("Error deleting user", "error");
        }
    };

    if (loading) return <div className="p-10 text-emerald-500 font-bold">Connecting to Services...</div>;

    return (
        <div className="fade-in">
            <PageHeader
                title="User Management"
                subtitle="Manage all system users and role assignments"
                action={<AddButton label="+ Add User" onClick={() => { setEditItem(null); setShowModal(true); }} />}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {["ADMIN", "PLAYER", "HEAD_COACH", "DOCTOR"].map(r => (
                    <StatCard key={r} label={r.replace("_", " ")} value={data.filter(u => u.role === r).length} />
                ))}
            </div>

            {/* Table card */}
            <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 flex-1 min-w-48 group focus-within:border-emerald-500/50 transition-all">
                        <span className="text-slate-500 group-focus-within:text-emerald-500 transition-colors">🔍</span>
                        <input
                            placeholder="Search users..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/50 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                    >
                        <option value="ALL" className="bg-slate-900">All Roles</option>
                        {ROLES.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/20">
                                {["User", "Email", "Phone", "Role", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar name={`${u.firstName} ${u.lastName}`} size={38} />
                                            <div>
                                                <p className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{u.firstName} {u.lastName}</p>
                                                <p className="text-[10px] font-mono text-slate-600 mt-0.5 uppercase tracking-tighter">{u.keycloakId?.slice(0, 18)}…</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{u.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{u.phoneNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${ROLE_COLORS[u.role] || "text-slate-400 bg-slate-500/10 border-slate-500/20"}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => { setEditItem(u); setShowModal(true); }}
                                                className="cursor-pointerp-2 rounded-lg text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all active:scale-90"
                                                title="Edit"
                                            >✏️</button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="cursor-pointer p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-90"
                                                title="Delete"
                                            >🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <EmptyState icon="👥" title="No users found" />}
                </div>
            </div>

            {showModal && (
                <FormModal
                    title={editItem ? "Edit User" : "Create User"}
                    fields={fields}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    initialData={editItem || {}}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}