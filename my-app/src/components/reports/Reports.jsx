"use client"
import React, { useState, useEffect } from "react";
import { FileText, Calendar, Download, TrendingUp, Eye, Users, Activity, DollarSign } from "lucide-react";
import { api } from "@/src/lib/api"; // الربط الأساسي

// ماب للأيقونات بناءً على الكاتيجوري اللي جاية من السيرفر
const iconMap = {
  Performance: TrendingUp,
  Development: Users,
  Medical: Activity,
  Financial: DollarSign,
  Scouting: Eye,
  Analytics: TrendingUp,
};

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات من السيرفر (Reports & Analytics Service)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // بنجيب كذا نوع تقرير زي ما مكتوب في الجدول
        const [teamData, matchData] = await Promise.all([
          api.getTeamAnalytics(),
          api.getMatchAnalyses()
        ]);
        
        // دمج البيانات وتحويلها لشكل الكروت اللي عندنا
        const combined = [
          ...(Array.isArray(teamData) ? teamData : []),
          ...(Array.isArray(matchData) ? matchData : [])
        ].map(item => ({
          ...item,
          icon: iconMap[item.category] || FileText, // أيقونة افتراضية لو مش موجودة
          date: new Date(item.createdAt || Date.now()).toLocaleDateString(),
          size: item.fileSize || "1.5 MB"
        }));

        setReports(combined);
      } catch (err) {
        console.error("Reports Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // دالة الفلترة
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title?.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || report.category === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) return <div className="p-10 text-white text-center">Loading Analytics...</div>;

  return (
    <div className="bg-slate-950 min-h-screen p-6 overflow-y-auto w-full">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">Reports & Analytics</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Official insights and statistics</p>
          </div>
          
          <button className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
            Generate Live Analysis
          </button>
        </div>

        {/* Stats Grid (Dynamic) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Reports", value: reports.length, icon: FileText },
            { title: "Performance Docs", value: reports.filter(r => r.category === 'Performance').length, icon: TrendingUp },
            { title: "Medical Logs", value: reports.filter(r => r.category === 'Medical').length, icon: Activity },
            { title: "Scouting Reports", value: reports.filter(r => r.category === 'Scouting').length, icon: Eye },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-100">{stat.value}</h3>
              </div>
              <stat.icon className="text-emerald-500" size={24} />
            </div>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => (
            <div key={index} className="bg-slate-900/50 border-l-4 border-l-emerald-500 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="flex justify-between mb-4">
                <span className="text-[9px] px-3 py-1 rounded-full font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  {report.category}
                </span>
                <report.icon size={18} className="text-slate-500" />
              </div>
              <h3 className="font-black text-slate-100 mb-2 uppercase text-sm">{report.title}</h3>
              <p className="text-xs text-slate-500 mb-6 line-clamp-2">{report.desc}</p>
              
              <div className="flex justify-between text-[9px] font-black uppercase text-slate-600 border-t border-slate-800/50 pt-4 mb-4">
                <span>{report.date}</span>
                <span>{report.size}</span>
              </div>
              
              <button className="w-full bg-emerald-600/10 text-emerald-500 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
                Download PDF
              </button>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-20 text-slate-600 uppercase text-xs tracking-widest">No reports found in this category</div>
        )}
      </div>
    </div>
  );
}