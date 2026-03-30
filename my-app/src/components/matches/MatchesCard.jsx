"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const MatchesCard = ({ match }) => {
  const router = useRouter();

  return (
    <div className="border-l-4 w-full border-emerald-500 rounded-xl p-5 bg-slate-900/50 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group">

      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-2.5 py-1 rounded-md bg-emerald-500/5">
          {match.sport}
        </span>

        <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${
          match.status === "LIVE"
            ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        }`}>
          {match.status}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm font-bold text-slate-100">{match.homeTeam}</span>
          {match.homeScore !== undefined && (
            <span className="text-xl font-black text-slate-100">{match.homeScore}</span>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">VS</div>

        <div className="flex justify-between">
          <span className="text-sm font-bold text-slate-100">{match.awayTeam}</span>
          {match.awayScore !== undefined && (
            <span className="text-xl font-black text-slate-100">{match.awayScore}</span>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400 mb-6 space-y-1">
        <div className="flex items-center gap-2">
          <Calendar size={14} /> {match.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} /> {match.time}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} /> {match.location}
        </div>
      </div>

      <button
        onClick={() => router.push(`/match/${match.id}`)}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-lg"
      >
        {match.actionText || "View Details"}
      </button>
    </div>
  );
};

export default MatchesCard;
