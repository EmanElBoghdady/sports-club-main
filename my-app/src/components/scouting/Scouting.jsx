"use client"
import React, { useState } from 'react'
import Header from '../Header';
import Card from '../players/Card';
import { playersData } from '../../data/playersData'
import ScoutingCard from './ScoutingCard';
import ScoutingModal from './ScoutingModal';
function Scouting() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Reports");

  const [reports, setReports] = useState(playersData);
const [openModal, setOpenModal] = useState(false);

  const filteredReports = reports.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All Reports" ||
      (activeTab === "Top Rated" && player.rating >= 8.5) ||
      (activeTab === "Under Review" && player.state === "Under Review") ||
      (activeTab === "Shortlisted" && player.shortlisted);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full h-full bg-slate-950 p-3 overflow-y-auto">
      <Header title="Scouting Reports" desc="Talent discovery and player evaluations"
        buttonTitle="New Report"
         onClick={() => setOpenModal(true)} />

         <ScoutingModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onAddReport={(newReport) => setReports(prev => [newReport, ...prev])}
/>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 mb-10 shadow-2xl">
        <div className="relative w-full md:w-96 group">
          <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
          <input
            type="text"
            placeholder="Search reports or scouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
          />
        </div>

        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar w-full md:w-auto">
          {["All Reports", "Top Rated", "Under Review", "Shortlisted"].map((tab) => (
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
          title="Active Reports"
          num="23"
          icon={<i className="fi fi-rs-user text-xl"></i>} />
        <Card
          title="Recommended"
          num="8"
          icon={<span className="material-symbols-outlined text-xl">vital_signs</span>} />

        <Card
          title="Under Review"
          num="10"
          icon={<span className="material-symbols-outlined text-xl">vital_signs</span>}
        />
        <Card
          title="Trials Scheduled"
          num="5"
          icon={<span className="material-symbols-outlined text-xl">license</span>} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        {filteredReports.map((player) => (
          <ScoutingCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

export default Scouting