import React from "react";
import {
  FaUsers,
  FaDollarSign,
  FaTrophy,
  FaAward,
  FaUser,
  FaFutbol,
  FaRunning,
} from "react-icons/fa";
import { BsChatLeft } from "react-icons/bs";
import InfoCard from "./InfoCard";
import LineChart from "./charts/LineChart";
import Pie from "./charts/Pie";
import FormationBoard from "./FormationBoard";

function Dashboard() {
  const activityItems = [
    {
      title: "New Player Transfer Update",
      description:
        "Please review the new player profiles sent by our scouts.",
      from: "Sports Director",
      isNew: true,
    },
    {
      title: "Injury Report - Erik Hansen",
      description: "Erik will need 2 weeks recovery. Full report attached.",
      from: "Medical Team",
      isNew: false,
    },
    {
      title: "Match Analysis - Last Game",
      description:
        "Your analysis is ready. Key highlights from the last match are ready.",
      from: "Analyst",
      isNew: false,
    },
  ];

  const sportStats = [
    {
      name: "Football",
      icon: <FaFutbol />,
      value: 120,
      pct: 40,
      color: "bg-emerald-600",
    },
    {
      name: "Basketball",
      icon: <FaUsers />,
      value: 85,
      pct: 28,
      color: "bg-teal-500",
    },
    {
      name: "Handball",
      icon: <FaUsers />,
      value: 60,
      pct: 20,
      color: "bg-cyan-500",
    },
    {
      name: "Volleyball",
      icon: <FaUsers />,
      value: 35,
      pct: 12,
      color: "bg-emerald-400",
    },
  ];

  const quickActions = [
    { label: "Schedule Match", icon: <FaFutbol /> },
    { label: "Add Training", icon: <FaRunning /> },
    { label: "Report Injury", icon: <FaAward /> },
    { label: "Send Message", icon: <BsChatLeft /> },
  ];

  return (
    <div className="h-full bg-slate-950 overflow-y-auto w-full">
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 fade-in">
          <div>
            <h2 className="font-black text-3xl text-slate-100 tracking-tight">
              Welcome back, John Morrison!
            </h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
              Here&apos;s what&apos;s happening with your club today.
            </p>
          </div>

          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            {["24H", "7D", "30D", "ALL"].map((range) => (
              <button
                key={range}
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                    ${range === "7D"
                    ? "bg-slate-100 text-slate-950 shadow-lg shadow-white/5"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <InfoCard icon={<FaUser />} title="Total Members" num="300" perc="+12%" />
          <InfoCard icon={<FaTrophy />} title="Active Teams" num="12" perc="+2" />
          <InfoCard icon={<FaDollarSign />} title="Revenue" num="$1.2M" perc="+18%" />
          <InfoCard icon={<FaAward />} title="Championships" num="8" perc="+3" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 rounded-2xl p-6 shadow-sm border border-slate-800 shadow-emerald-950/20 backdrop-blur-sm">
            <LineChart />
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 shadow-sm border border-slate-800 shadow-emerald-950/20 backdrop-blur-sm">
            <Pie />
          </div>
        </div>

        {/* Sport distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 rounded-2xl p-6 shadow-sm border border-slate-800 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">
              Sport Distribution
            </h3>

            <div className="space-y-4">
              {sportStats.map((sport) => (
                <div key={sport.name}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500 group-hover:scale-110 transition-transform">{sport.icon}</span>
                      <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                        {sport.name}
                      </span>
                    </div>

                    <span className="text-slate-500 font-bold text-[10px] uppercase tracking-tighter">
                      {sport.value} players
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sport.color}`}
                      style={{ width: `${sport.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-slate-900/50 rounded-2xl p-6 shadow-sm border border-slate-800 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
              Quick Actions
            </h3>

            <p className="text-[10px] font-bold text-slate-600 mb-6 uppercase tracking-widest leading-none">
              Jump quickly to the most common workflows.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl bg-slate-950 hover:bg-emerald-500/[0.05] text-slate-300 border border-slate-800 hover:border-emerald-500/50 transition-all group"
                >
                  <span className="text-emerald-500 transition-transform group-hover:scale-110">{action.icon}</span>
                  <span className="group-hover:text-white transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-slate-900/50 rounded-2xl shadow-sm p-6 border border-slate-800 backdrop-blur-sm">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            Recent Activity
          </h2>

          <p className="text-[10px] font-bold text-slate-600 mb-6 uppercase tracking-widest leading-none">
            Latest updates and notifications
          </p>

          <div className="space-y-4">
            {activityItems.map((item, index) => (
              <div
                key={index}
                className="border-b last:border-none border-slate-800/50 py-4 group cursor-pointer hover:bg-emerald-500/[0.01] transition-colors rounded-xl px-2"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                      <BsChatLeft size={16} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors tracking-tight">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 mt-3 font-black text-[9px] uppercase tracking-widest">
                        <span className="text-slate-600">From:</span>
                        <span className="text-emerald-500">
                          {item.from}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.isNew && (
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;