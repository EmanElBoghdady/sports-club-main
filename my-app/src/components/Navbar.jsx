"use client";

import React, { useState, useEffect } from "react";
import { FiShield, FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

const ROLE_LABELS = {
  admin:               "Admin",
  sport_manager:       "Sport Manager",
  team_manager:        "Team Manager",
  head_coach:          "Head Coach",
  assistant_coach:     "Assistant Coach",
  specific_coach:      "Specific Coach",
  fitness_coach:       "Fitness Coach",
  performance_analyst: "Performance Analyst",
  team_doctor:         "Team Doctor",
  doctor:              "Doctor",
  physiotherapist:     "Physiotherapist",
  scout:               "Scout",
  sponsor:             "Sponsor",
  fan:                 "Fan",
  player:              "Player",
  national_team:       "National Team",
  staff:               "Staff",
};

const Navbar = ({ isSidebarOpen, currentPage, user }) => {
  const router = useRouter();
  const [roleLabel, setRoleLabel] = useState("");
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const role = localStorage.getItem("user_role")?.toLowerCase() || "";
    setRoleLabel(ROLE_LABELS[role] || role.replace(/_/g, " ") || "Guest");

    // Pull a display name from the decoded JWT or fall back to the username.
    try {
      const info = JSON.parse(localStorage.getItem("user_info") || "{}");
      if (info.username) setDisplayName(info.username);
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('user_role', { path: '/' });
    Cookies.remove('token', { path: '/' });

    localStorage.removeItem("user_role");
    localStorage.removeItem("user_info");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const prettyPage = (currentPage || "Dashboard")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border)] px-6 py-4 transition-all duration-300 ease-in-out sticky top-0 z-100">
      <div className="flex justify-between items-center">

        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/25 flex items-center justify-center">
            <FiShield className="text-[var(--accent)] text-lg" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <h3 className="uppercase text-lg text-[var(--text)] font-extrabold tracking-wide">
              {prettyPage}
            </h3>
            <span className="text-[var(--text-muted)] text-[11px] uppercase tracking-[0.18em] font-semibold">
              {roleLabel || "—"}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm  font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10  px-4 py-2 rounded-lg transition-all cursor-pointer"
            title="Logout"
          >
            <FiLogOut strokeWidth={2.5} />
            <span className="hidden sm:block">Logout</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-800/60 border border-transparent hover:border-[var(--border)] px-3 py-1.5 rounded-lg transition">
            {user?.image ? (
              <img
                src={user.image}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border border-[var(--border)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/25 to-cyan-500/15 border border-emerald-500/30 flex items-center justify-center">
                <FiUser className="text-emerald-300 text-base" strokeWidth={2.5} />
              </div>
            )}
            <span className="text-sm font-semibold text-[var(--text)] hidden sm:block tracking-wide">
              {user?.name || displayName}
            </span>
          </div>

        </div>
      </div>

      {/* Gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent mt-3 opacity-50" />
    </div>
  );
};

export default Navbar;
