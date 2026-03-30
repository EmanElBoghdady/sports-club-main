"use client"
import React from "react";
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  Eye,
  Users,
  Activity,
  DollarSign,
} from "lucide-react";

/* =========================
   Stats Data
========================= */
const stats = [
  { title: "Total Reports", value: "48", icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
  { title: "This Month", value: "6", icon: Calendar, bg: "bg-green-100", color: "text-green-600" },
  { title: "Downloads", value: "234", icon: Download, bg: "bg-purple-100", color: "text-purple-600" },
  { title: "Categories", value: "6", icon: TrendingUp, bg: "bg-yellow-100", color: "text-yellow-600" },
];

/* =========================
   Reports Data
========================= */
const initialReports = [
  {
    category: "Performance",
    title: "Q4 2025 Performance Report",
    desc: "Comprehensive analysis of team performance across all sports",
    date: "10/25/2025",
    size: "2.4 MB",
    icon: Activity,
  },
  {
    category: "Development",
    title: "Player Development Report - October",
    desc: "Individual player progress and training effectiveness",
    date: "10/20/2025",
    size: "1.8 MB",
    icon: Users,
  },
  {
    category: "Medical",
    title: "Medical & Injury Analysis",
    desc: "Health trends and injury prevention insights",
    date: "10/18/2025",
    size: "1.2 MB",
    icon: FileText,
  },
  {
    category: "Financial",
    title: "Financial Summary - October 2025",
    desc: "Revenue, expenses, and budget analysis",
    date: "10/15/2025",
    size: "3.1 MB",
    icon: DollarSign,
  },
  {
    category: "Scouting",
    title: "Scouting & Recruitment Report",
    desc: "Talent acquisition and trial results",
    date: "10/12/2025",
    size: "2.7 MB",
    icon: Eye,
  },
  {
    category: "Analytics",
    title: "Match Analytics - Last 10 Games",
    desc: "Tactical analysis and performance metrics",
    date: "10/10/2025",
    size: "4.5 MB",
    icon: TrendingUp,
  },
];

const categories = [
  { name: "Performance", icon: TrendingUp },
  { name: "Development", icon: Users },
  { name: "Medical", icon: FileText },
  { name: "Financial", icon: FileText },
  { name: "Scouting", icon: Eye },
  { name: "Analytics", icon: Activity },
];

/* =========================
   Main Component
========================= */
export default function ReportsPage() {
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("All");
  const [reports, setReports] = React.useState(initialReports);

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [formData, setFormData] = React.useState({
    category: "",
    title: "",
    desc: "",
    date: "",
    size: "",
  });

  const openModal = (report = null, index = null) => {
    if (report) {
      setFormData({ ...report });
      setEditingIndex(index);
    } else {
      setFormData({ category: "", title: "", desc: "", date: "", size: "" });
      setEditingIndex(null);
    }
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...reports];
      updated[editingIndex] = { ...formData, icon: reports[editingIndex].icon };
      setReports(updated);
    } else {
      setReports([...reports, { ...formData, icon: Activity }]); // default icon
    }
    setModalOpen(false);
  };

  // ----------------------
  // Download Functionality
  // ----------------------
  const handleDownload = (report) => {
    const content = `
Report Title: ${report.title}
Category: ${report.category}
Description: ${report.desc}
Date: ${report.date}
Size: ${report.size}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.replace(/\s/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.desc.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || report.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-slate-950 min-h-screen p-6 overflow-y-auto w-full">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 fade-in">
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">
              Reports & Documents
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
              Access and download official reports
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              Generate Report
            </button>
            <button className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95">
              Export PDF
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 mb-10 shadow-2xl">
          <div className="relative w-full md:w-96 group">
            <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
            />
          </div>

          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar w-full md:w-auto">
            {["All", "Performance", "Medical", "Financial", "Scouting"].map((tab) => (
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-black text-slate-100 tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => {
            const Icon = report.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 border-l-4 border-l-emerald-500 rounded-2xl shadow-sm hover:border-slate-700 transition-all p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700" />

                {/* Badge + Icon */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span
                    className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/10 text-emerald-400`}
                  >
                    {report.category}
                  </span>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Icon size={18} />
                  </div>
                </div>

                {/* Title */}
                <div className="relative z-10">
                  <h3 className="font-black text-slate-100 mb-2 uppercase tracking-tight text-sm group-hover:text-emerald-400 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium uppercase tracking-wide opacity-80">{report.desc}</p>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6 border-t border-slate-800/50 pt-4">
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => openModal(report, index)}
                      className="flex-1 border border-slate-800 bg-slate-950 text-slate-400 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-white transition-all"
                    >
                      View / Edit
                    </button>
                    <button
                      onClick={() => handleDownload(report)}
                      className="flex-1 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Form */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-slate-950 rounded-2xl p-8 w-96 shadow-2xl relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
              >
                ✕
              </button>
              <h2 className="text-lg font-black text-slate-100 mb-4">
                {editingIndex !== null ? "Edit Report" : "Create New Report"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700"
                  required
                />
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="flex-1 p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700"
                    required
                  />
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="Size"
                    className="flex-1 p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all"
                >
                  {editingIndex !== null ? "Update Report" : "Save Report"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
