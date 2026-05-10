"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaUsers, FaRunning, FaFutbol, FaHeartbeat, FaSearch, FaChartLine,
  FaDollarSign, FaPhotoVideo, FaEnvelope, FaChartBar, FaCog,
  FaLayerGroup, FaShieldAlt, FaTimes, FaBars,
} from "react-icons/fa";

// تأكدي أن هذه المصفوفة خارج المكون لثبات البيانات
const sections = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", icon: FaLayerGroup, href: "/dashboard", roles: ["any"] }],
  },
  {
    title: "People",
    items: [
      { name: "Players", icon: FaUsers, href: "/dashboard/players", roles: ["admin", "head_coach", "assistant_coach", "specific_coach", "fitness_coach", "performance_analyst", "team_doctor", "physiotherapist", "team_manager" , "fan" , "any"] },
      { name: "User Management", icon: FaShieldAlt, href: "/dashboard/users", roles: ["admin"] },
      { name: "Staff", icon: FaUsers, href: "/dashboard/staff", roles: ["admin", "sport_manager", "team_manager"] },
      { name: "Teams & Sports", icon: FaFutbol, href: "/dashboard/teams", roles: ["admin", "sport_manager", "team_manager", "head_coach", "fan"] },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Training", icon: FaRunning, href: "/dashboard/training", roles: ["admin", "head_coach", "assistant_coach", "specific_coach", "fitness_coach"] },
      { name: "Matches", icon: FaFutbol, href: "/dashboard/matches", roles: ["any"] },
      { name: "Medical", icon: FaHeartbeat, href: "/dashboard/medical", roles: ["admin", "team_doctor", "physiotherapist", "head_coach"] },
      { name: "Medical Records", icon: FaHeartbeat, href: "/dashboard/medical-records", roles: ["admin", "team_doctor"] },
      { name: "Scouting", icon: FaSearch, href: "/dashboard/scouting", roles: ["admin", "scout"] },
      { name: "Contracts & Transfers", icon: FaLayerGroup, href: "/dashboard/contracts", roles: ["admin", "sport_manager", "team_manager"] },
    ],
  },
  {
    title: "Analytics",
    items: [
      { name: "Overview", icon: FaChartLine, href: "/dashboard/analytics", roles: ["admin", "head_coach", "performance_analyst", "scout"] },
      { name: "Training Analytics", icon: FaChartLine, href: "/dashboard/training-analytics", roles: ["admin", "head_coach", "performance_analyst"] },
      { name: "Reports", icon: FaChartBar, href: "/dashboard/reports", roles: ["admin", "scout"] },
    ],
  },
  {
    title: "Finance & Sponsors",
    items: [
      { name: "Finance", icon: FaDollarSign, href: "/dashboard/finance", roles: ["admin", "sponsor"] },
      { name: "Sponsors", icon: FaDollarSign, href: "/dashboard/sponsors", roles: ["admin", "sponsor"] },
    ],
  },
  {
    title: "Communication",
    items: [
      { name: "Media", icon: FaPhotoVideo, href: "/dashboard/media", roles: ["admin", "head_coach", "assistant_coach", "specific_coach", "fitness_coach", "performance_analyst", "team_doctor", "physiotherapist", "team_manager" ] },
      { name: "Messages", icon: FaEnvelope, href: "/dashboard/messages", roles: ["admin", "head_coach", "assistant_coach", "specific_coach", "fitness_coach", "performance_analyst", "team_doctor", "physiotherapist", "team_manager" ] },
      { name: "Alerts", icon: FaShieldAlt, href: "/dashboard/alerts", roles: ["admin", "head_coach", "team_doctor"] },
      { name: "Settings", icon: FaCog, href: "/dashboard/settings", roles: ["any"] },
    ],
  },
];

const Sidebar = ({ onSidebarToggle }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(""); 

  useEffect(() => {
    // جلب الرول وتحويله لـ lowercase لضمان التطابق
    const savedRole = localStorage.getItem("user_role");
    setUserRole(savedRole ? savedRole.toLowerCase() : "fan");
  }, []);

  const handleToggle = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (onSidebarToggle) onSidebarToggle(newState);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out
        bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 
        overflow-y-auto sidebar-scrollbar border-r border-emerald-500/10
        ${isSidebarOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Header Section */}
      <div className="p-4 flex justify-between items-center border-b border-emerald-500/20 mb-4">
        {isSidebarOpen && (
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-emerald-400 text-2xl" />
            <span className="text-xl font-bold text-white tracking-tight">Blue Stars</span>
          </div>
        )}
        <button
          onClick={handleToggle}
          className={`text-white hover:bg-emerald-700/40 p-2 rounded-lg transition-all ${!isSidebarOpen && "mx-auto"}`}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 pb-10">
        {sections.map((section) => {
          const visibleItems = section.items.filter(item => 
            item.roles.includes("any") || item.roles.includes(userRole) || userRole === "admin"
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-6">
              {isSidebarOpen && (
                <h3 className="px-4 mb-2 text-[10px] font-bold uppercase text-emerald-500/60 tracking-widest">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center transition-all duration-200 group
                        ${isActive ? "bg-emerald-500/20 text-white border-r-4 border-emerald-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-emerald-300"}
                        ${isSidebarOpen ? "px-4 py-3 gap-3 rounded-lg mx-2" : "justify-center py-4"}
                      `}
                      title={!isSidebarOpen ? item.name : ""}
                    >
                      <Icon className={`text-lg ${isActive ? "text-emerald-400" : "group-hover:text-emerald-300"}`} />
                      {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;



