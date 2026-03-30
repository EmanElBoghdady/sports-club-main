"use client"
import React, { useState } from 'react'
import Header from '../Header';
import Card from '../players/Card';
import MedicalCard from './MedicalCard'
import { playersData } from '../../data/playersData'

export default function Medical() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Players");

  const filteredPlayers = playersData.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All Players" || player.state === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
      <Header title="Medical Center" desc="Monitor player health and injury status"
        />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 mb-10 shadow-2xl">
        <div className="relative w-full md:w-96 group">
          <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
          <input
            type="text"
            placeholder="Search players or medical records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
          />
        </div>

        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar w-full md:w-auto">
          {["All Players", "Healthy", "Injured", "Recovering"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${activeTab === tab
                  ? "bg-slate-100 text-slate-950 shadow-lg shadow-white/5"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card
          title="Total Players"
          num="5"
          icon={<i className="fi fi-rs-user text-xl"></i>} />
        <Card
          title="Fit"
          num="3"
          icon={<span className="material-symbols-outlined text-xl">vital_signs</span>} />

        <Card
          title="Injured"
          num="1"
          icon={<span className="material-symbols-outlined text-xl">vital_signs</span>}
        />
        <Card
          title="Recovering"
          num="1"
          icon={<span className="material-symbols-outlined text-xl">license</span>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {filteredPlayers.map(player => (
          <MedicalCard
            key={player.id}
            name={player.name}
            position={player.position}
            sport={player.sport}
            state={player.state}
            injuryType={player.injuryType}
            progress={player.progress}
            expectedReturn={player.expectedReturn}
            />))}
      </div>


    </div>
  )
}
