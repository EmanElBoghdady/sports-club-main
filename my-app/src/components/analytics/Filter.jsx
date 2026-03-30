"use client";

import React, { useState } from "react";
import { performanceData } from "@/src/data/performanceData";
import Pie from "../charts/Pie";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

function Filter() {
  const [activeTab, setActiveTab] = useState("team");
  const chartData = performanceData[activeTab] || performanceData.team;
  const data = [
    { name: 'Goals', Basketball: 0, Football: 45, Handball: 120 },
    { name: 'Assists', Basketball: 35, Football: 85, Handball: 95 },
    { name: 'Points', Basketball: 250, Football: 0, Handball: 0 },
    { name: 'Avg Rating', Basketball: 8, Football: 7.5, Handball: 7 },
  ];

  const dataa = [
    { subject: 'Attack', A: 85, B: 70, fullMark: 100 },
    { subject: 'Defense', A: 75, B: 80, fullMark: 100 },
    { subject: 'Midfield', A: 80, B: 75, fullMark: 100 },
    { subject: 'Possession', A: 90, B: 85, fullMark: 100 },
    { subject: 'Speed', A: 70, B: 90, fullMark: 100 },
    { subject: 'Stamina', A: 85, B: 75, fullMark: 100 },
  ];

  return (
    <div className="space-y-10">
      {/* FILTER TABS */}
      <div className="inline-flex bg-slate-900/50 backdrop-blur-sm rounded-xl p-1 border border-slate-800">
        {["team", "players", "tactical"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300
              ${activeTab === tab
                ? "bg-slate-100 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
          >
            {tab === "team" && "Team Performance"}
            {tab === "players" && "Player Statistics"}
            {tab === "tactical" && "Tactical Analysis"}
          </button>
        ))}
      </div>


      {activeTab === "team" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 group relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-[80px]" />

            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 relative z-10">
              Monthly Performance
            </h2>

            <div className="h-72 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.bar}>
                  <XAxis
                    dataKey="month"
                    stroke="#475569"
                    fontSize={10}
                    fontWeight="bold"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    fontWeight="bold"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      padding: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', tracking: '0.1em', paddingBottom: '20px' }}
                  />
                  <Bar dataKey="wins" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="draws" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 group relative overflow-hidden shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 relative z-10">
              Distribution Overview
            </h2>
            <div className="h-72 flex items-center justify-center relative z-10">
              <Pie />
            </div>
          </div>
        </div>
      )}


      {activeTab === "players" && (
        <div className="space-y-8 mt-10">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />

            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight relative z-10">
              Player Statistics by Sport
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 relative z-10">
              Comparative performance across different sports
            </p>

            <div className="h-[400px] w-full mt-10 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  barGap={8}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1e293b"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 'bold' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 'bold' }}
                    domain={[0, 260]}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: "12px",
                      border: "1px solid #1e293b",
                      fontSize: '10px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      padding: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="rect"
                    wrapperStyle={{ paddingTop: "20px", fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' }}
                  />

                  <Bar dataKey="Basketball" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Football" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Handball" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
              Top Performers
            </h2>
            <p className="text-[10px] font-bold text-slate-600 mb-10 uppercase tracking-widest leading-none">
              Best players this month
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-slate-950/50 border border-slate-900 hover:border-emerald-500/30 rounded-2xl p-6 transition-all group flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <span className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500 font-black text-sm group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">{item}</span>
                    <div>
                      <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">Marcus Silva</h4>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Football</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h6 className="text-xs font-black text-emerald-500 tracking-tighter">8.9</h6>
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-1">8 Goals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab == "tactical" && (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden mt-10">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">Tactical Comparison</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Team A vs Team B performance across key areas</p>
          </div>

          <div className="h-[500px] w-full mt-10 relative z-10 bg-slate-950/30 rounded-3xl border border-slate-800/50 p-6 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataa}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 'bold' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />

                <Radar
                  name="Team A"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Radar
                  name="Team B"
                  dataKey="B"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  strokeWidth={3}
                />

                <Legend
                  iconType="circle"
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: '40px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
