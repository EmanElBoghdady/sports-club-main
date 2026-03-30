"use client";
import { useState } from "react";
import { MOCK, ROLES } from "@/src/data/mockData";
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
    { key: "firstName", label: "First Name", placeholder: "John" },
    { key: "lastName", label: "Last Name", placeholder: "Doe" },
    { key: "email", label: "Email", type: "email", placeholder: "john@club.dz" },
    { key: "phoneNumber", label: "Phone", placeholder: "+213555000" },
    { key: "dateOfBirth", label: "Date of Birth", type: "date" },
    { key: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE"] },
    { key: "role", label: "Role", type: "select", options: ROLES },
    { key: "address", label: "Address", placeholder: "123 Main St", full: true },
];

export default function UserManagement() {
    const [data, setData] = useState(MOCK.users);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => setToast({ msg, type });

    const filtered = data.filter(u =>
        (roleFilter === "ALL" || u.role === roleFilter) &&
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    const handleSave = async (form) => {
        try {
            if (editItem) {
                await api.updateUser(editItem.id, form).catch(() => { });
                setData(d => d.map(u => u.id === editItem.id ? { ...u, ...form } : u));
                showToast("User updated");
            } else {
                await api.createUser(form).catch(() => { });
                setData(d => [...d, { ...form, id: Date.now() }]);
                showToast("User created");
            }
        } catch { showToast("Saved locally", "info"); }
        setShowModal(false); setEditItem(null);
    };

    const handleDelete = (id) => {
        setData(d => d.filter(u => u.id !== id));
        showToast("User deleted", "error");
    };

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
                                                className="p-2 rounded-lg text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all active:scale-90"
                                                title="Edit"
                                            >✏️</button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-90"
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
