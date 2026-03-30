"use client";

import React from "react";
import { FaShieldAlt, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Navbar = ({ isSidebarOpen, currentPage, user }) => {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
    }
    router.push("/login");
  };

  return (
    <div className="bg-[var(--bg-card)] shadow-sm border-b border-[var(--border)] p-4 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center">

        {/* Left */}
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-[var(--accent)] text-xl" />
          <div className="flex flex-col">
            <h3 className="uppercase text-md text-[var(--text)] font-semibold">
              {currentPage || "Dashboard"}
            </h3>
            <span className="text-[var(--text-muted)] text-xs">President</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            title="Logout"
          >
            <FaSignOutAlt />
            <span className="hidden sm:block">Logout</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 px-2 py-1 rounded-lg transition">
            {user?.image ? (
              <img
                src={user.image}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border border-[var(--border)]"
              />
            ) : (
              <FaUserCircle className="text-[var(--accent)] text-2xl" />
            )}
            <span className="text-sm text-[var(--text)] hidden sm:block">
              {user?.name || "User"}
            </span>
          </div>

        </div>
      </div>

      {/* Gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent mt-3 opacity-40" />
    </div>
  );
};

export default Navbar;