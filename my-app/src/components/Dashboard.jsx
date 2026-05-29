"use client";
import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiDollarSign,
  FiAward,
  FiStar,
  FiUser,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";
import InfoCard from "./InfoCard";
import BarChart from "./charts/BarChart";
import Pie from "./charts/Pie";
import { api } from "@/src/lib/api";
import { SPORTS } from "@/src/data/mockData";
import { useRouter } from "next/navigation";

// Mirrors the Position enum on the backend (see user-management Position.java).
// Football and Handball share several visual names (LEFT_WING etc.) — Handball
// is disambiguated with the HB_ prefix on the backend.
const POSITION_TO_SPORT = {
  // Football
  GOALKEEPER:            "FOOTBALL",
  RIGHT_BACK:            "FOOTBALL",
  LEFT_BACK:             "FOOTBALL",
  CENTER_BACK:           "FOOTBALL",
  DEFENSIVE_MID:         "FOOTBALL",
  CENTRAL_MID:           "FOOTBALL",
  ATTACKING_MID:         "FOOTBALL",
  RIGHT_WING:            "FOOTBALL",
  LEFT_WING:             "FOOTBALL",
  STRIKER:               "FOOTBALL",
  // Basketball
  POINT_GUARD:           "BASKETBALL",
  SHOOTING_GUARD:        "BASKETBALL",
  SMALL_FORWARD:         "BASKETBALL",
  POWER_FORWARD:         "BASKETBALL",
  CENTER:                "BASKETBALL",
  // Tennis
  SINGLES_PLAYER:        "TENNIS",
  DOUBLES_PLAYER:        "TENNIS",
  // Swimming
  FREESTYLE_SWIMMER:     "SWIMMING",
  BACKSTROKE_SWIMMER:    "SWIMMING",
  BREASTSTROKE_SWIMMER:  "SWIMMING",
  BUTTERFLY_SWIMMER:     "SWIMMING",
  MEDLEY_SWIMMER:        "SWIMMING",
  // Volleyball
  SETTER:                "VOLLEYBALL",
  OUTSIDE_HITTER:        "VOLLEYBALL",
  OPPOSITE_HITTER:       "VOLLEYBALL",
  MIDDLE_BLOCKER:        "VOLLEYBALL",
  LIBERO:                "VOLLEYBALL",
  DEFENSIVE_SPECIALIST:  "VOLLEYBALL",
  // Handball (HB_ prefix)
  HB_GOALKEEPER:         "HANDBALL",
  HB_LEFT_WING:          "HANDBALL",
  HB_RIGHT_WING:         "HANDBALL",
  HB_LEFT_BACK:          "HANDBALL",
  HB_RIGHT_BACK:         "HANDBALL",
  HB_CENTRE_BACK:        "HANDBALL",
  HB_PIVOT:              "HANDBALL",
};

const sportFromPlayer = (p) => {
  const pos = String(p?.preferredPosition || p?.position || "").toUpperCase().trim();
  return POSITION_TO_SPORT[pos] || (p?.sportType ? String(p.sportType).toUpperCase() : "");
};

function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  const [stats, setStats] = useState({ members: 0, teams: 0 });
  const [activityItems, setActivityItems] = useState([]);
  const [sportStats, setSportStats] = useState([]);
  const [teamsBySport, setTeamsBySport] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {

    const savedRole = localStorage.getItem("user_role");
    setUserRole(savedRole ? savedRole.toLowerCase() : "fan");

    const fetchData = async () => {
      try {
        // apiFetch returns the parsed JSON directly. Spring pages return
        // { content: [...] }; bare list endpoints return an array.
        const unwrap = (res) => Array.isArray(res) ? res : (res?.content || res?.data || []);
        const players       = unwrap(await api.getPlayers());
        const teams         = unwrap(await api.getTeams());
        const notifications = unwrap(await api.getNotifications());
        const analyticsData = unwrap(await api.getPlayerAnalytics());

        setStats({ members: players.length, teams: teams.length });

        setActivityItems(
          notifications.map((n) => ({
            title: n.title,
            description: n.message,
            from: n.category,
            isNew: !n.isRead,
          }))
        );

        // Pull /sports so we can show every configured sport (even ones
        // with no players yet) and resolve team.sportId -> sport name.
        let sportsList = [];
        try {
          sportsList = unwrap(await api.getSports());
        } catch {
          // ignore — fall back to static list below
        }
        const sportNamesById = Object.fromEntries(
          sportsList.map((s) => [String(s.id), s.sportType || s.name || "Unknown"])
        );
        let sportNames = sportsList
          .map((s) => s?.sportType || s?.name)
          .filter(Boolean);
        if (sportNames.length === 0) sportNames = [...SPORTS];

        // Count players per sport by deriving the sport from each player's
        // preferredPosition (the same logic Players.jsx uses to label them).
        const playerCountsBySport = {};
        players.forEach((p) => {
          const key = sportFromPlayer(p);
          if (key) playerCountsBySport[key] = (playerCountsBySport[key] || 0) + 1;
        });

        const maxPlayerCount = Math.max(1, ...Object.values(playerCountsBySport));
        setSportStats(
          sportNames.map((sport) => {
            const key = String(sport).toUpperCase();
            const value = playerCountsBySport[key] || 0;
            return {
              name: key,
              value,
              // Scale bars relative to the biggest sport so small/zero values
              // are still legible.
              pct: (value / maxPlayerCount) * 100,
              color: "bg-emerald-500",
            };
          })
        );

        // Team distribution by sport — resolve each team's sportId via the
        // sports list, then feed the Pie chart items shaped like { sportType }.
        setTeamsBySport(
          teams.map((t) => ({
            sportType: sportNamesById[String(t.sportId)] || "Unknown",
          }))
        );

        setLoadError("");
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setLoadError(err.message || "Could not load dashboard data.");
      }
    };

    fetchData();
  }, []);

  const isAdmin = userRole === "admin";

  return (
    <div className="h-full bg-slate-950 overflow-y-auto w-full pb-10">
      <div className="p-6 space-y-8">

        {loadError && (
          <div className="alert-banner alert-danger text-sm">
            ⚠ {loadError}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 fade-in">
          <div>
            <h2 className="font-extrabold text-4xl md:text-5xl text-slate-100 tracking-tight uppercase leading-none">
              {isAdmin ? "Admin Control Center" : "Blue Stars Fan Zone"}
            </h2>
            <p className="text-emerald-400/70 text-[11px] font-bold uppercase tracking-[0.28em] mt-3">
              {isAdmin ? "Manage your club performance" : "Stay updated with your favorite club"}
            </p>
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={<FiUser strokeWidth={2.2} />} title="Club Members" num={stats.members} perc="+12%" />
          <InfoCard icon={<FiUsers strokeWidth={2.2} />} title="Active Teams" num={stats.teams} perc="+2" />

          {isAdmin ? (
            <InfoCard icon={<FiDollarSign strokeWidth={2.2} />} title="Revenue" num="$1.2M" perc="+18%" />
          ) : (
            <InfoCard icon={<FiStar strokeWidth={2.2} />} title="Global Rank" num="#42" perc="Top 5%" />
          )}

          <InfoCard icon={<FiAward strokeWidth={2.2} />} title="Championships" num="8" perc="+3" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-4">
               <FiTrendingUp className="text-emerald-400" strokeWidth={2.4} />
               <h3 className="text-[11px] font-extrabold uppercase text-emerald-400 tracking-[0.24em]">Players by Sport</h3>
             </div>
             <BarChart data={sportStats} label="Players" />
          </div>
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-4">
               <FiPieChart className="text-emerald-400" strokeWidth={2.4} />
               <h3 className="text-[11px] font-extrabold uppercase text-emerald-400 tracking-[0.24em]">Teams by Sport</h3>
             </div>
             <Pie data={teamsBySport} />
          </div>
        </div>

        {/* Sport Distribution */}
        <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 rounded-2xl p-6 border border-slate-800">
          <h3 className="text-[11px] font-extrabold uppercase text-slate-400 mb-6 tracking-[0.24em]">
            Sport Distribution
          </h3>
          <div className="space-y-5">
            {sportStats.map((sport) => (
              <div key={sport.name} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-100 font-semibold text-base group-hover:text-emerald-300 transition-colors tracking-wide">{sport.name}</span>
                  <span className="text-slate-500 text-[11px] uppercase font-bold tracking-widest tabular">{sport.value} players</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${sport.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions - admin */}
        {isAdmin && (
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 rounded-2xl p-6 border border-slate-800">
            <h3 className="text-[11px] font-extrabold text-slate-400 mb-6 uppercase tracking-[0.24em]">Administrative Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => router.push("/dashboard/matches")} className="p-3 bg-slate-950 text-slate-300 rounded-xl hover:border-emerald-500 hover:text-white border border-slate-800 transition-all text-sm font-semibold uppercase tracking-wider">Schedule Match</button>
              <button onClick={() => router.push("/dashboard/training")} className="p-3 bg-slate-950 text-slate-300 rounded-xl hover:border-emerald-500 hover:text-white border border-slate-800 transition-all text-sm font-semibold uppercase tracking-wider">Add Training</button>
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-[11px] font-extrabold text-slate-400 mb-6 uppercase tracking-[0.24em]">
            {isAdmin ? "System Logs" : "Latest Club Updates"}
          </h2>
          {activityItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <div className="text-3xl mb-3 opacity-40">📭</div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em]">
                No recent activity yet
              </p>
              <p className="text-xs mt-2 text-slate-600">
                New notifications and updates will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activityItems.slice(0, 5).map((item, index) => (
                <div key={index} className="flex gap-4 p-3 hover:bg-slate-800/40 rounded-xl transition-colors border-b border-slate-800/50 last:border-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)] shrink-0" />
                  <div>
                    <h3 className="text-slate-100 font-semibold text-base tracking-wide">{item.title}</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-[0.18em] bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">{item.from}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;




