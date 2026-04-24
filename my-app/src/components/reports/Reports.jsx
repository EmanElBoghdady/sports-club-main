"use client"
import React, { useState, useEffect, useCallback } from "react";
import { FileText, Calendar, Download, TrendingUp, Eye, Users, Activity, DollarSign, Pencil, Trash2 } from "lucide-react";
import { api } from "@/src/lib/api";
import ScoutingModal from "@/src/components/scouting/ScoutingModal";

const iconMap = {
  Performance: TrendingUp,
  Development: Users,
  Medical:     Activity,
  Financial:   DollarSign,
  Scouting:    Eye,
  Analytics:   TrendingUp,
};

const safeArray = (data) => Array.isArray(data) ? data : (data?.content || []);

// ── Helper: بيحدد الـ API calls الصح بناءً على نوع الريبورت ──────────────
const getApiActions = (category) => {
  switch (category) {
    case "Scouting":  return { update: api.updateScoutReport,   del: api.deleteScoutReport };
    case "Analytics": return { update: api.updateTeamAnalytics, del: api.deleteTeamAnalytics };
    case "Match":     return { update: api.updateMatchAnalysis,  del: api.deleteMatchAnalysis };
    default:          return { update: api.updateTeamAnalytics, del: api.deleteTeamAnalytics };
  }
};

export default function ReportsPage() {
  const [search, setSearch]         = useState("");
  const [activeTab, setActiveTab]   = useState("All");
  const [reports, setReports]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showScoutModal, setShowScoutModal] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const [teamData, matchData, scoutData] = await Promise.all([
        api.getTeamAnalytics().catch(() => []),
        api.getMatchAnalyses().catch(() => []),
        api.getScoutReports().catch(() => []),
      ]);

      const mappedTeam = safeArray(teamData).map(t => ({
        ...t, _raw: t, _source: "team",
        category: "Analytics",
        title: t.title || t.analysisTitle || t.teamName || `Team Analytics #${t.id}`,
        desc:  t.description || t.notes || t.summary || "Team performance analytics report.",
        createdAt: t.createdAt || Date.now(),
      }));

      const mappedMatch = safeArray(matchData).map(m => ({
        ...m, _raw: m, _source: "match",
        category: "Match",
        title: m.title || m.analysisTitle || m.matchTitle || `Match Analysis #${m.id}`,
        desc:  m.description || m.notes || m.summary || "Match performance analysis report.",
        createdAt: m.createdAt || Date.now(),
      }));

      const mappedScout = safeArray(scoutData).map(s => ({
        ...s, _raw: s, _source: "scout",
        category: "Scouting",
        title: s.title || s.playerName || `Scout Report #${s.id}`,
        desc:  s.overallAssessment || s.notes || "Detailed scouting analysis.",
        createdAt: s.reportDate || s.createdAt || Date.now(),
      }));

      const combined = [...mappedTeam, ...mappedMatch, ...mappedScout].map(item => ({
        ...item,
        icon: iconMap[item.category] || FileText,
        date: new Date(item.createdAt || Date.now()).toLocaleDateString(),
        size: item.fileSize || "1.5 MB",
      }));

      setReports(combined);
    } catch (err) {
      console.error("Reports Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (report) => {
    if (!confirm(`Delete "${report.title}"?`)) return;
    setDeletingId(report.id);
    try {
      const { del } = getApiActions(report.category);
      await del(report.id);
      await fetchReports();
    } catch (err) {
      alert("Failed to delete: " + (err?.message || "Server error"));
    } finally {
      setDeletingId(null);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const handleEdit = (report) => {
    // بس Scouting عنده مودال مخصص، الباقي مش عندنا مودال edit ليهم دلوقتي
    if (report.category === "Scouting") {
      setEditReport(report._raw || report);
      setShowScoutModal(true);
    }
  };

  // ── Filters ────────────────────────────────────────────────────────────────
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title?.toLowerCase().includes(search.toLowerCase());
    const matchesTab    = activeTab === "All" || r.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const categories = ["All", ...new Set(reports.map(r => r.category))];

  return (
    <div className="bg-[#030712] min-h-screen p-6 lg:p-10 overflow-y-auto w-full fade-in">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Reports & Analytics</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Official insights and statistics</p>
          </div>
          <button
            onClick={() => { setEditReport(null); setShowScoutModal(true); }}
            className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20">
            + New Scout Report
          </button>
        </div>

        {/* ── Stats Grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Reports",    value: reports.length,                                          icon: FileText,   color: "text-white" },
            { title: "Team Analytics",   value: reports.filter(r => r.category === "Analytics").length,  icon: TrendingUp, color: "text-blue-400" },
            { title: "Match Analyses",   value: reports.filter(r => r.category === "Match").length,      icon: Activity,   color: "text-rose-400" },
            { title: "Scouting Reports", value: reports.filter(r => r.category === "Scouting").length,   icon: Eye,        color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0a0f1d] rounded-[2rem] px-6 py-6 border border-white/5 shadow-2xl relative overflow-hidden group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">{stat.title}</p>
              <p className={`text-3xl font-black tracking-tight relative z-10 ${stat.color}`}>{stat.value}</p>
              <div className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-emerald-500/10 transition-colors duration-500">
                <stat.icon size={80} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Filters ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-emerald-500/50 transition-all w-64"
          />
          <div className="flex gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-xl flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === cat
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards ────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600 gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Compiling Reports...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
            {filteredReports.map((report, index) => {
              const IconComponent = report.icon || FileText;
              const isDeleting    = deletingId === report.id;
              const isScout       = report.category === "Scouting";
              const uniqueKey     = `${report.category ?? "report"}-${report.id ?? "x"}-${index}`;

              return (
                <div key={uniqueKey}
                  className="bg-[#0a0f1d] border border-white/5 rounded-[2.5rem] p-6 hover:border-emerald-500/30 transition-all shadow-2xl group relative overflow-hidden flex flex-col h-full">

                  {/* ── Badge + Actions ── */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-lg bg-emerald-500/10 text-emerald-400 border-emerald-500/20 z-10">
                      {report.category}
                    </div>

                    <div className="flex items-center gap-2 z-10">
                      {/* ✏️ Edit — فقط Scouting عنده مودال مخصص */}
                      {isScout && (
                        <button
                          onClick={() => handleEdit(report)}
                          title="Edit Report"
                          className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-amber-400 hover:border-amber-500/40 transition-all">
                          <Pencil size={14} />
                        </button>
                      )}

                      {/* 🗑️ Delete — على كل الأنواع */}
                      <button
                        onClick={() => handleDelete(report)}
                        disabled={isDeleting}
                        title="Delete Report"
                        className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-40">
                        {isDeleting
                          ? <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          : <Trash2 size={14} />}
                      </button>

                      {/* Icon */}
                      <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-slate-500 border border-white/5 shadow-inner group-hover:text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <IconComponent size={18} />
                      </div>
                    </div>
                  </div>

                  {/* ── Content ── */}
                  <div className="flex-1 mb-6 z-10">
                    <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{report.desc}</p>
                  </div>

                  {/* ── Meta ── */}
                  <div className="bg-slate-950/40 p-4 rounded-[1.8rem] border border-white/5 space-y-3 mb-6 z-10">
                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500">
                      <span className="flex items-center gap-2 uppercase">
                        <Calendar size={14} className="text-emerald-500" /> Generated On
                      </span>
                      <span className="text-slate-200">{report.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500 border-t border-white/5 pt-3">
                      <span className="flex items-center gap-2 uppercase">
                        <Download size={14} className="text-emerald-500" /> File Size
                      </span>
                      <span className="text-slate-200">{report.size}</span>
                    </div>
                  </div>

                  {/* ── Action ── */}
                  <button className="w-full mt-auto inline-flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-3.5 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-lg z-10">
                    <Download size={16} /> Download PDF
                  </button>

                  {/* Decor */}
                  <div className="absolute -bottom-6 -right-6 text-white/[0.02] pointer-events-none group-hover:text-emerald-500/[0.05] transition-colors duration-700">
                    <IconComponent size={140} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredReports.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-6 opacity-20 grayscale">📭</div>
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">No reports found</p>
          </div>
        )}
      </div>

      {/* ── Scout Report Modal ────────────────────────────────────────────── */}
      <ScoutingModal
        open={showScoutModal}
        onClose={() => { setShowScoutModal(false); setEditReport(null); }}
        onSaved={() => { setShowScoutModal(false); setEditReport(null); fetchReports(); }}
        editData={editReport}
      />
    </div>
  );
}