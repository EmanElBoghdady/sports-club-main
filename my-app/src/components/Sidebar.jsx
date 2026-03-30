"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  FaUsers,
  FaRunning,
  FaFutbol,
  FaHeartbeat,
  FaSearch,
  FaChartLine,
  FaDollarSign,
  FaPhotoVideo,
  FaEnvelope,
  FaChartBar,
  FaCog,
  FaLayerGroup,
  FaShieldAlt,
  FaTimes,
  FaBars,
 
} from "react-icons/fa";

const sections = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", icon: FaLayerGroup, href: "/dashboard" }],
  },
  {
    title: "People",
    items: [
      { name: "Players", icon: FaUsers, href: "/dashboard/players" },
      { name: "User Management", icon: FaShieldAlt, href: "/dashboard/users" },
      { name: "Staff", icon: FaUsers, href: "/dashboard/staff" },
      { name: "Teams & Sports", icon: FaFutbol, href: "/dashboard/teams" },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Training", icon: FaRunning, href: "/dashboard/training" },
      { name: "Matches", icon: FaFutbol, href: "/dashboard/matches" },
      { name: "Medical", icon: FaHeartbeat, href: "/dashboard/medical" },
      { name: "Medical Records", icon: FaHeartbeat, href: "/dashboard/medical-records" },
      { name: "Scouting", icon: FaSearch, href: "/dashboard/scouting" },
      { name: "Scouting Ops", icon: FaSearch, href: "/dashboard/scouting-ops" },
      { name: "Contracts & Transfers", icon: FaLayerGroup, href: "/dashboard/contracts" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { name: "Overview", icon: FaChartLine, href: "/dashboard/analytics" },
      { name: "Analytics Detail", icon: FaChartBar, href: "/dashboard/analytics-detail" },
      { name: "Training Analytics", icon: FaChartLine, href: "/dashboard/training-analytics" },
      { name: "Reports", icon: FaChartBar, href: "/dashboard/reports" },
    ],
  },
  {
    title: "Finance & Sponsors",
    items: [
      { name: "Finance", icon: FaDollarSign, href: "/dashboard/finance" },
      { name: "Sponsors", icon: FaDollarSign, href: "/dashboard/sponsors" },
    ],
  },
  {
    title: "Communication",
    items: [
      { name: "Media", icon: FaPhotoVideo, href: "/dashboard/media" },
      { name: "Messages", icon: FaEnvelope, href: "/dashboard/messages" },
      { name: "Alerts", icon: FaShieldAlt, href: "/dashboard/alerts" },
      { name: "Settings", icon: FaCog, href: "/dashboard/settings" },
    ],
  },
];

const Sidebar = ({ onSidebarToggle }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const handleToggle = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (onSidebarToggle) onSidebarToggle(newState);
  };

  

  return (
    <div
      className={`
       relative bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 overflow-hidden fixed z-20 transition-all duration-300 ease-in-out h-full overflow-y-auto
       sidebar-scrollbar
        ${isSidebarOpen ? "w-64" : "w-16"}
      `}
    >
      {/* Logo / toggle */}
      <div className="p-3 border-b border-[var(--border)] flex justify-between items-center m-3">
        <div
          className={`
            flex items-center gap-3 transition-all duration-300
            ${isSidebarOpen ? "opacity-100 " : "opacity-0 w-0 overflow-hidden"}
          `}
        >
          <FaShieldAlt className="text-white text-xl flex-shrink-0" />
          <span className="text-xl font-bold text-white whitespace-nowrap ">
            Blue Stars
          </span>
        </div>
        <button
          onClick={handleToggle}
          className="text-white hover:bg-emerald-700/40 hover:translate-x-1 p-2 rounded-lg transition-colors flex-shrink-0"
        >
          {isSidebarOpen ? (
            <FaTimes className="text-lg" />
          ) : (
            <FaBars className="text-lg " />
          )}
        </button>
      </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40"></div>
      {/* Nav sections */}
      <div className="mt-3 pb-16">
        {sections.map((section) => (
          <div key={section.title} className="mb-2">
            {isSidebarOpen && (
              <div className="px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-100/70">
                {section.title}
              </div>
            )}
            <div className="mt-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
flex items-center rounded-lg text-sm w-full mx-1 transition-all duration-200 hover:bg-emerald-700/40 hover:translate-x-1
${isActive ? "bg-emerald-800/60 border-l-4 border-emerald-400 shadow-lg" : ""}
${isSidebarOpen ? "gap-3 pl-4 py-2.5" : "justify-center p-3"}
`}
                    title={!isSidebarOpen ? item.name : ""}
                  >
                    <span className="text-base text-emerald-300">
                      <Icon />
                    </span>
                    <span
                      className={`
                        capitalize transition-all duration-300 overflow-hidden
                        ${isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
                      `}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

      </div>

      
      
    </div>
  );
};

export default Sidebar;