"use client"
import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const initialAlerts = [
  {
    id: 1,
    type: "INJURY_REPORTED",
    title: "Critical Injury Alert",
    message: "Player Youcef reported with hamstring strain",
    priority: "HIGH",
    target: "Medical Team",
    acknowledged: false,
    resolved: false,
  },
  {
    id: 2,
    type: "CONTRACT_EXPIRING",
    title: "Contract Expiring Soon",
    message: "Karim Mansouri contract expires in 30 days",
    priority: "MEDIUM",
    target: "Team Manager",
    acknowledged: false,
    resolved: false,
  },
];

const initialNotifications = [
  {
    id: 1,
    title: "Match Scheduled",
    message: "Blue Stars FC vs Red Lions FC scheduled for Nov 2",
    category: "MATCH_REMINDER",
    status: "UNREAD",
  },
  {
    id: 2,
    title: "Injury Report",
    message: "Player #6 reported injury during training",
    category: "INJURY",
    status: "READ",
  },
];

export default function Alerts() {
  const [tab, setTab] = useState("alerts");
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [notifications, setNotifications] = useState(initialNotifications);

  const filteredAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().includes(search.toLowerCase()) ||
    alert.message.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotifications = notifications.filter(notif =>
    notif.title.toLowerCase().includes(search.toLowerCase()) ||
    notif.message.toLowerCase().includes(search.toLowerCase())
  );

  const acknowledgeAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
    );
  };

  const criticalCount = alerts.filter((a) => a.priority === "HIGH").length;
  const unreadNotifs = notifications.filter((n) => n.status === "UNREAD").length;

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header / stats */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 fade-in">
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">
              Alerts & Notifications
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
              System alerts, player health warnings and match reminders
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-2xl px-6 py-4 border border-slate-800 shadow-xl min-w-[140px]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Critical alerts</p>
              <p className="text-xl font-black text-rose-500 tracking-tight">{criticalCount}</p>
            </div>
            <div className="bg-slate-900/50 rounded-2xl px-6 py-4 border border-slate-800 shadow-xl min-w-[140px]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Unread</p>
              <p className="text-xl font-black text-emerald-500 tracking-tight">
                {unreadNotifs}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="relative w-full md:w-96 group">
            <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
            <input
              type="text"
              placeholder="Search alerts or notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="inline-flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50">
            <button
              onClick={() => setTab("alerts")}
              className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all duration-300
                ${tab === "alerts"
                  ? "bg-slate-100 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"}`}
            >
              <Bell size={14} />
              Alerts
            </button>
            <button
              onClick={() => setTab("notifications")}
              className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all duration-300
                ${tab === "notifications"
                  ? "bg-slate-100 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${unreadNotifs > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
              Notifications
            </button>
          </div>
        </div>

        {/* Content */}
        {tab === "alerts" ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border transition-all group relative overflow-hidden flex justify-between gap-6
                  ${alert.priority === "HIGH" ? "border-rose-500/30" : "border-amber-500/30"} 
                  ${alert.resolved ? "opacity-40 grayscale" : "hover:border-slate-700"}`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700" />

                <div className="flex gap-4 relative z-10">
                  <div className={`mt-1 p-3 rounded-xl shadow-xl border
                    ${alert.priority === "HIGH"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
                    {alert.priority === "HIGH" ? <AlertTriangle size={20} /> : <Bell size={20} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                        {alert.title}
                      </h3>
                      <span className="text-[9px] px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-500 font-black uppercase tracking-widest">
                        {alert.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl group-hover:text-slate-300 transition-colors">
                      {alert.message}
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-4">
                      Target: <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">{alert.target}</span>
                    </p>

                    <div className="flex gap-3 mt-4">
                      {alert.acknowledged && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                          <CheckCircle2 size={12} /> Acknowledged
                        </span>
                      )}
                      {alert.resolved && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-slate-600 border border-slate-800 text-[9px] font-black uppercase tracking-widest">
                          <XCircle size={12} /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!alert.resolved && (
                  <div className="flex flex-col gap-3 items-end relative z-10">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl border border-slate-800 text-slate-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-white transition-all duration-300"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border transition-all flex justify-between items-center group relative overflow-hidden
                  ${n.status === "UNREAD" ? "border-emerald-500/30" : "border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700"}`}
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700" />

                <div className="relative z-10 w-full">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2 group-hover:text-emerald-500 transition-colors">
                    {n.category.replace(/_/g, " ")}
                  </p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                      {n.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed max-w-2xl">{n.message}</p>
                </div>

                {n.status === "UNREAD" && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="relative z-10 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10 active:scale-95 whitespace-nowrap ml-6"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
