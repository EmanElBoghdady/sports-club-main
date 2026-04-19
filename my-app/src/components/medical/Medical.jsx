"use client"
import React, { useState, useEffect } from 'react'
import Header from '../Header';
import Card from '../players/Card';
import MedicalCard from './MedicalCard'
import { api } from "@/src/lib/api"; // استيراد الـ API

export default function Medical() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Players");
  
  // حالات جلب البيانات
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات من السيرفر
  useEffect(() => {
    const fetchMedical = async () => {
      try {
        setLoading(true);
        const data = await api.getInjuries();
        // لو الداتا جاية مباشرة أو جوه content (بسبب الـ Pagination)
        const actualData = data?.content || (Array.isArray(data) ? data : []);
        setRecords(actualData);
      } catch (err) {
        console.error("Medical Fetch Error:", err);
        setError("Failed to load medical records.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedical();
  }, []);

  // الفلترة بتتم دلوقتي على الـ records اللي جاية من الباك إيند
  const filteredRecords = records.filter(player => {
    // ملحوظة: تأكدي لو السيرفر بيرجع الاسم 'name' أو 'playerName'
    const name = player.name || player.playerName || ""; 
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    
    // المودال بيبعت Fit/Injured والباك إيند بيفهم Healthy/Injured
    const matchesTab = activeTab === "All Players" || player.state === activeTab;
    return matchesSearch && matchesTab;
  });

  // حساب الإحصائيات ديناميكياً
  const stats = {
    total: records.length,
    healthy: records.filter(r => r.state === "Healthy" || r.state === "Fit").length,
    injured: records.filter(r => r.state === "Injured").length,
    recovering: records.filter(r => r.state === "Recovering").length,
  };

  if (loading) return <div className="p-10 text-white text-center">Loading Medical Records...</div>;

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
      <Header title="Medical Center" desc="Monitor player health and injury status" />

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
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards - Updated to be dynamic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card title="Total Players" num={stats.total.toString()} icon={<i className="fi fi-rs-user text-xl"></i>} />
        <Card title="Healthy" num={stats.healthy.toString()} icon={<span className="material-symbols-outlined text-xl text-emerald-500">vital_signs</span>} />
        <Card title="Injured" num={stats.injured.toString()} icon={<span className="material-symbols-outlined text-xl text-red-500">vital_signs</span>} />
        <Card title="Recovering" num={stats.recovering.toString()} icon={<span className="material-symbols-outlined text-xl text-amber-500">license</span>} />
      </div>

      {error && <div className="text-red-500 mb-5 text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <MedicalCard
              key={record.id}
              name={record.name || record.playerName}
              position={record.position}
              sport={record.sport}
              state={record.state}
              injuryType={record.injuryType}
              progress={record.progress}
              expectedReturn={record.expectedReturn}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 py-10">No medical records found.</div>
        )}
      </div>
    </div>
  )
}