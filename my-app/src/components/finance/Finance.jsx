"use client";
import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* ================= DATA ================= */

const stats = [
  {
    title: "Total Revenue",
    value: "$1200K",
    change: "+18%",
    icon: DollarSign,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Total Expenses",
    value: "$750K",
    change: "+5%",
    icon: CreditCard,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  {
    title: "Net Income",
    value: "$450K",
    change: "+35%",
    icon: TrendingUp,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Profit Margin",
    value: "38%",
    change: "+8%",
    icon: Clock,
    bg: "bg-sky-100",
    color: "text-sky-600",
  },
];

const revenueData = [
  { month: "Jan", revenue: 850000, expenses: 620000 },
  { month: "Feb", revenue: 920000, expenses: 680000 },
  { month: "Mar", revenue: 1050000, expenses: 720000 },
  { month: "Apr", revenue: 980000, expenses: 690000 },
  { month: "May", revenue: 1200000, expenses: 760000 },
];

const pieData = [
  { name: "Player Salaries", value: 450000 },
  { name: "Staff Salaries", value: 180000 },
  { name: "Facilities", value: 85000 },
  { name: "Equipment", value: 35000 },
];

const pieColors = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe"];

const transactions = [
  {
    title: "Ticket Sales - Championship Match",
    date: "2025-10-28",
    amount: 125000,
    type: "income",
  },
  {
    title: "Player Transfer - David Thompson",
    date: "2025-10-26",
    amount: 85000,
    type: "expense",
  },
  {
    title: "Sponsorship - TechCorp Q4",
    date: "2025-10-25",
    amount: 200000,
    type: "income",
  },
  {
    title: "Facility Maintenance",
    date: "2025-10-24",
    amount: 15000,
    type: "expense",
  },
  {
    title: "Merchandise Sales",
    date: "2025-10-23",
    amount: 35000,
    type: "income",
  },
];

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, change, icon: Icon, bg, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-green-600 mt-1">↗ {change}</p>
    </div>
    <div className={`p-3 rounded-xl ${bg}`}>
      <Icon className={color} size={22} />
    </div>
  </div>
);

/* ================= PAGE ================= */

export default function Finance() {
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("All Time");

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All Time" ||
      (activeTab === "Income" && t.type === "income") ||
      (activeTab === "Expenses" && t.type === "expense") ||
      (activeTab === "This Month" && t.date.startsWith("2025-10")); // Mock monthly filter
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-slate-950 min-h-screen p-6 overflow-y-auto w-full">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 fade-in">
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">
              Financial Management
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
              Revenue, expenses, and budget tracking
            </p>
          </div>

          <div className="flex gap-4">
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
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
            />
          </div>

          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar w-full md:w-auto">
            {["All Time", "This Month", "Income", "Expenses"].map((tab) => (
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
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.title}</p>
                  <h3 className="text-2xl font-black text-slate-100 tracking-tight">{s.value}</h3>
                  <p className="text-[10px] font-black text-emerald-500 mt-2 uppercase tracking-widest">↗ {s.change}</p>
                </div>
                <div className={`p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all shadow-xl`}>
                  <s.icon size={22} />
                </div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 group relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-[80px]" />

            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2 relative z-10">
              Revenue vs Expenses
            </h2>
            <p className="text-[10px] font-bold text-slate-600 mb-10 uppercase tracking-widest leading-none relative z-10">
              Monthly financial overview
            </p>

            <div className="h-72 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
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
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      padding: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={4}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 group relative overflow-hidden shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2 relative z-10">
              Expense Breakdown
            </h2>
            <p className="text-[10px] font-bold text-slate-600 mb-10 uppercase tracking-widest leading-none relative z-10">
              Monthly cost distribution
            </p>

            <div className="h-72 flex items-center justify-center relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    label={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={pieColors[index]} stroke="transparent" />
                    ))}
                  </Pie>
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-2xl">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            Recent Transactions
          </h2>
          <p className="text-[10px] font-bold text-slate-600 mb-10 uppercase tracking-widest leading-none">
            Latest financial activities
          </p>

          <div className="space-y-4">
            {filteredTransactions.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-950/50 hover:bg-slate-950 border border-slate-900 rounded-2xl p-4 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl shadow-lg transition-transform group-hover:scale-110 ${t.type === "income"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }`}
                  >
                    {t.type === "income" ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                      {t.title}
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{t.date}</p>
                  </div>
                </div>

                <p
                  className={`text-sm font-black tracking-tighter ${t.type === "income"
                    ? "text-emerald-400"
                    : "text-rose-400"
                    }`}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
