"use client";
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";
import { api } from "@/src/lib/api"; // الربط الأساسي بالـ API

export default function Alerts() {
  const [tab, setTab] = useState("alerts");
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب التنبيهات والإشعارات من السيرفر
  const fetchAllData = async () => {
    try {
      setLoading(true);
      // بنادي على الـ Notification Service
      const [alertsData, notifsData] = await Promise.all([
        api.getAlerts(),
        api.getNotifications()
      ]);
      
      setAlerts(Array.isArray(alertsData) ? alertsData : alertsData?.content || []);
      setNotifications(Array.isArray(notifsData) ? notifsData : notifsData?.content || []);
    } catch (err) {
      console.error("Error fetching alerts/notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. معالجة الإجراءات (Acknowledge / Resolve / Read)
  const handleAcknowledge = async (id) => {
    try {
      await api.acknowledgeAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    } catch (err) { console.error(err); }
  };

  const handleResolve = async (id) => {
    try {
      await api.resolveAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    } catch (err) { console.error(err); }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: "READ" } : n));
    } catch (err) { console.error(err); }
  };

  // الفلترة
  const filteredAlerts = alerts.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.message?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotifications = notifications.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.message?.toLowerCase().includes(search.toLowerCase())
  );

  const criticalCount = alerts.filter(a => a.priority === "HIGH" && !a.resolved).length;
  const unreadNotifs = notifications.filter(n => n.status === "UNREAD").length;

  if (loading) return <div className="p-10 text-white text-center font-black uppercase text-[10px] tracking-widest">Synchronizing Alerts...</div>;

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header & Stats */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">Alerts & Notifications</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">System health and real-time warnings</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-2xl px-6 py-4 border border-rose-500/20 shadow-lg min-w-[140px]">
              <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Critical Issues</p>
              <p className="text-xl font-black text-rose-500">{criticalCount}</p>
            </div>
            <div className="bg-slate-900/50 rounded-2xl px-6 py-4 border border-emerald-500/20 shadow-lg min-w-[140px]">
              <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Unread Msg</p>
              <p className="text-xl font-black text-emerald-500">{unreadNotifs}</p>
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50">
            {["alerts", "notifications"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${tab === t ? "bg-white text-black" : "text-slate-500"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="space-y-4">
          {tab === "alerts" ? (
            filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
              <div key={alert.id} className={`bg-slate-900/50 p-6 rounded-2xl border flex justify-between gap-6 transition-all ${alert.priority === "HIGH" ? "border-rose-500/20" : "border-slate-800"} ${alert.resolved && "opacity-40"}`}>
                <div className="flex gap-4">
                   <div className={`p-3 rounded-xl ${alert.priority === "HIGH" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"}`}>
                      {alert.priority === "HIGH" ? <AlertTriangle size={20}/> : <Bell size={20}/>}
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-slate-100 uppercase mb-1">{alert.title}</h3>
                      <p className="text-xs text-slate-400 max-w-xl">{alert.message}</p>
                      <div className="flex gap-3 mt-4">
                        {alert.acknowledged && <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Acknowledged</span>}
                        {alert.resolved && <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-800 px-2 py-1 rounded">Resolved</span>}
                      </div>
                   </div>
                </div>
                {!alert.resolved && (
                  <div className="flex flex-col gap-2">
                    {!alert.acknowledged && <button onClick={() => handleAcknowledge(alert.id)} className="text-[9px] font-black uppercase p-2 border border-slate-700 text-slate-400 hover:text-white rounded-lg">Acknowledge</button>}
                    <button onClick={() => handleResolve(alert.id)} className="text-[9px] font-black uppercase p-2 bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 rounded-lg">Resolve</button>
                  </div>
                )}
              </div>
            )) : <div className="text-center py-10 text-slate-700 font-black uppercase text-[10px]">No Alerts Found</div>
          ) : (
            filteredNotifications.map(n => (
              <div key={n.id} className={`bg-slate-900/50 p-6 rounded-2xl border flex justify-between items-center ${n.status === "UNREAD" ? "border-emerald-500/20" : "border-slate-800 opacity-60"}`}>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-600 mb-1">{n.category}</p>
                  <h3 className="text-sm font-black text-slate-100 uppercase">{n.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                </div>
                {n.status === "UNREAD" && <button onClick={() => handleMarkRead(n.id)} className="text-[9px] font-black uppercase px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded-lg">Mark Read</button>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}