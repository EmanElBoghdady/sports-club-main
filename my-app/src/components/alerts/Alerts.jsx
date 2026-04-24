"use client";
import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import {
    FormModal,
    PageHeader,
    AddButton,
    FilterTabs,
    Toast,
    EmptyState,
    StatusBadge
} from "@/src/components/shared/SharedComponents";
import { Bell, AlertTriangle, CheckCircle2, Pencil, Trash2, ShieldAlert, CheckSquare } from "lucide-react";

// ─── CONFIG FOR NOTIFICATIONS ──────────────────────────────────────────────
const notificationFields = [
    { key: "recipientUserKeycloakId", label: "Recipient ID", placeholder: "string", required: true },
    { key: "title", label: "Title", required: true },
    { key: "message", label: "Message", required: true, full: true },
    { key: "notificationType", label: "Type", type: "select", options: ["IN_APP", "EMAIL", "SMS"], required: true },
    { key: "category", label: "Category", type: "select", options: ["INJURY", "TRAINING", "MATCH", "ADMIN", "FINANCE"], required: true },
    { key: "status", label: "Status", type: "select", options: ["PENDING", "SENT", "FAILED"], required: true },
    { key: "emailSubject", label: "Email Subject" },
    { key: "emailBody", label: "Email Body", full: true },
    { key: "relatedEntityType", label: "Related Entity Type" },
    { key: "relatedEntityId", label: "Related Entity ID", type: "number" },
    { key: "actionUrl", label: "Action URL" },
];

// ─── CONFIG FOR ALERTS (NEW SCHEMA) ────────────────────────────────────────
const alertFields = [
    { key: "targetUserKeycloakId", label: "Target User ID", placeholder: "string", required: true },
    { key: "targetRole", label: "Target Role", placeholder: "e.g. COACH" },
    { key: "title", label: "Alert Title", required: true },
    { key: "message", label: "Short Message", required: true },
    { key: "description", label: "Full Description", required: true, full: true },
    { key: "alertType", label: "Alert Type", type: "select", options: ["SYSTEM", "SECURITY", "MAINTENANCE", "ANNOUNCEMENT"], required: true },
    { key: "priority", label: "Priority", type: "select", options: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    { key: "relatedEntityType", label: "Related Entity Type" },
    { key: "relatedEntityId", label: "Related Entity ID", type: "number" },
    { key: "actionRequired", label: "Action Required" },
    { key: "metadata", label: "Metadata (JSON/String)", full: true },
];

export default function CommunicationsPage() {
    const [mainTab, setMainTab] = useState("notifications"); // notifications | alerts
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [toast, setToast] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = mainTab === "notifications" ? await api.getNotifications() : await api.getAlerts();
            let finalData = [];
            if (Array.isArray(res)) finalData = res;
            else if (res?.content) finalData = res.content;
            else if (res?.data) finalData = res.data;
            setData(finalData);
        } catch (err) {
            setToast({ msg: "Failed to load data", type: "error" });
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [mainTab]);

    const handleSave = async (form) => {
        try {
            let payload;
            if (mainTab === "notifications") {
                payload = {
                    // 1. تأكدي إن الحقول دي مطابقة للـ Swagger بالظبط (كابيتال وسمول)
                    recipientUserKeycloakId: "a0cdb123-6783-4f09-95bb-bd07d0058285",
                    notificationType: "IN_APP",     // جربي قيمة ثابتة بسيطة الأول
                    category: "ADMIN",              // جربي ADMIN بدل TRAINING
                    status: "PENDING",              // الحالة الابتدائية دايماً أضمن
                    title: form.title || "Default Title",
                    message: form.message || "Default Message",

                    // 2. الحقول اللي ممكن تكون عاملة أزمة (الـ Numbers والـ Nulls)
                    relatedEntityId: Number(form.relatedEntityId) || 0, // لازم يكون رقم
                    relatedEntityType: "GENERAL",   // بلاش null، حطي كلمة تدل على النوع

                    // 3. الحقول الاختيارية (لو السيرفر مش طالبها، بلاش نبعتها خالص أو نبعتها String)
                    emailSubject: form.emailSubject || "No Subject",
                    emailBody: form.emailBody || "No Body",
                    actionUrl: form.actionUrl || "http://localhost:3000"
                };
            } else {
                // Alert Payload (Your NEW Schema) - تظبيط الـ Enums والـ Numbers
                payload = {
                    targetUserKeycloakId: form.targetUserKeycloakId || "string",
                    targetRole: form.targetRole || "ROLE_USER", // يفضل قيمة افتراضية منطقية
                    title: form.title || "",
                    message: form.message || "",
                    description: form.description || "",
                    alertType: (form.alertType || "SYSTEM").toUpperCase(),
                    priority: (form.priority || "LOW").toUpperCase(),
                    relatedEntityId: Number(form.relatedEntityId || 0),
                    relatedEntityType: form.relatedEntityType ? String(form.relatedEntityType).toUpperCase() : "GENERAL",
                    actionRequired: form.actionRequired || null,
                    metadata: form.metadata || null
                };
            }
            console.log(`Sending ${mainTab} Payload:`, payload);

            if (editItem) {
                mainTab === "notifications"
                    ? await api.updateNotification(editItem.id, payload)
                    : await api.updateAlert(editItem.id, payload);
                setToast({ msg: "Updated Successfully!" });
            } else {
                mainTab === "notifications"
                    ? await api.createNotification(payload)
                    : await api.createAlert(payload);
                setToast({ msg: "Created Successfully!" });
            }
            setShowModal(false);
            setEditItem(null);
            fetchData();
        } catch (err) {
            setToast({ msg: err.message, type: "error" });
        }
    };

    const handleAction = async (id, action) => {
        try {
            console.log(`Executing ${action} on ID: ${id}`);

            if (action === "read") await api.markNotificationRead(id);
            else if (action === "resolve") await api.resolveAlert(id);
            else if (action === "acknowledge") await api.acknowledgeAlert(id);

            setToast({ msg: `${action} successful!` });
            fetchData();
        } catch (err) {
            console.error(`Action ${action} failed:`, err);
            setToast({ msg: "Action failed: Check server console", type: "error" });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this record?")) return;
        try {
            mainTab === "notifications" ? await api.deleteNotification(id) : await api.deleteAlert(id);
            fetchData();
        } catch (err) { setToast({ msg: "Delete failed", type: "error" }); }
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in text-slate-200">
            <PageHeader
                title={mainTab === "notifications" ? "Notifications" : "System Alerts"}
                subtitle={`Manage and track all ${mainTab}`}
                action={<AddButton label={`+ New ${mainTab === "notifications" ? "Notification" : "Alert"}`} onClick={() => { setEditItem(null); setShowModal(true); }} />}
            />

            <FilterTabs
                tabs={[["notifications", "📨 Notifications"], ["alerts", "⚠️ System Alerts"]]}
                active={mainTab} onSelect={setMainTab}
            />

            <div className="space-y-3">
                {loading ? <div className="p-20 text-center animate-pulse text-slate-500 uppercase tracking-widest">Loading...</div> : (
                    <>
                        {data.map(item => (
                            <div key={item.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl border border-white/5 shadow-inner ${mainTab === 'notifications' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                                        {mainTab === 'notifications' ? <Bell size={18} /> : <AlertTriangle size={18} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                                            <StatusBadge status={item.category || item.priority} />
                                            <span className="text-[10px] text-slate-600 font-mono">#{item.id}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-1">{item.message || item.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {mainTab === "notifications" && (
                                        <button onClick={() => handleAction(item.id, "read")} className="p-2 text-slate-500 hover:text-emerald-400 transition-colors" title="Mark Read"><CheckCircle2 size={16} /></button>
                                    )}
                                    {mainTab === "alerts" && (
                                        <>
                                            <button onClick={() => handleAction(item.id, "acknowledge")} className="p-2 text-slate-500 hover:text-blue-400 transition-colors" title="Acknowledge"><CheckSquare size={16} /></button>
                                            <button onClick={() => handleAction(item.id, "resolve")} className="p-2 text-slate-500 hover:text-emerald-400 transition-colors" title="Resolve"><ShieldAlert size={16} /></button>
                                        </>
                                    )}
                                    <button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-2 text-slate-500 hover:text-amber-400 transition-colors"><Pencil size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && <EmptyState icon={mainTab === 'notifications' ? "📭" : "🛡️"} title={`No ${mainTab} found`} />}
                    </>
                )}
            </div>

            {showModal && (
                <FormModal
                    title={`${editItem ? "Edit" : "New"} ${mainTab === "notifications" ? "Notification" : "Alert"}`}
                    fields={mainTab === "notifications" ? notificationFields : alertFields}
                    initialData={editItem}
                    onSubmit={handleSave}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}