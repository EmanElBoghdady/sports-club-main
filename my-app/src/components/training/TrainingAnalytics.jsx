import React from "react";
import { BarChart3, Activity, Clock } from "lucide-react";

const analytics = [
  {
    id: 1,
    team: "First Team",
    sport: "Football",
    sessions: 24,
    attendance: 87,
    performance: 7.8,
    hours: 48,
  },
  {
    id: 2,
    team: "U19",
    sport: "Football",
    sessions: 18,
    attendance: 92,
    performance: 8.1,
    hours: 36,
  },
];

export default function TrainingAnalytics() {
  const totalSessions = analytics.reduce((s, a) => s + a.sessions, 0);
  const avgAttendance = Math.round(
    analytics.reduce((s, a) => s + a.attendance, 0) / analytics.length
  );
  const avgPerformance =
    analytics.reduce((s, a) => s + a.performance, 0) / analytics.length;
  const totalHours = analytics.reduce((s, a) => s + a.hours, 0);

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800/50 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-100 uppercase tracking-tight">
              Training Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Performance metrics and training load analysis
            </p>
          </div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 group-hover:text-slate-400">Total sessions</p>
            <p className="text-3xl font-black text-slate-100">{totalSessions}</p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 group-hover:text-slate-400">Avg attendance</p>
            <p className="text-3xl font-black text-emerald-500">
              {avgAttendance}%
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 group-hover:text-slate-400">Avg performance</p>
            <p className="text-3xl font-black text-sky-500">
              {avgPerformance.toFixed(1)}<span className="text-sm font-medium text-slate-600">/10</span>
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 group-hover:text-slate-400">Total hours</p>
            <p className="text-3xl font-black text-violet-500">{totalHours}<span className="text-sm font-medium text-slate-600">h</span></p>
          </div>
        </div>

        {/* Per-team cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.map((a) => (
            <div
              key={a.id}
              className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 mb-1">
                    {a.sport}
                  </p>
                  <h3 className="text-xl font-bold text-slate-100">
                    {a.team}
                  </h3>
                </div>
                <span className="rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 flex items-center gap-2 border border-emerald-500/20">
                  <BarChart3 size={14} /> Training KPI
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Sessions
                  </p>
                  <p className="text-lg font-black text-slate-200">{a.sessions}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Attendance
                  </p>
                  <p className="text-lg font-black text-emerald-500">
                    {a.attendance}%
                  </p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Rating</p>
                  <p className="text-lg font-black text-sky-500">
                    {a.performance}/10
                  </p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Hours</p>
                  <p className="text-lg font-black text-violet-500">{a.hours}h</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-2">
                      <Activity size={14} className="text-emerald-500" /> Relative Load
                    </span>
                    <span className="text-slate-300">{Math.round((a.sessions * a.attendance) / 2)} <span className="text-slate-600">AU</span></span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      style={{ width: `${a.attendance}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-sky-500" /> Time on pitch
                  </span>
                  <span className="text-slate-300">{a.hours * 60} <span className="text-slate-600">min</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

