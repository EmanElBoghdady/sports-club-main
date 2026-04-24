"use client";

import { Calendar, Clock, MapPin, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import { useState } from "react";

const MatchesCard = ({ match, onRefresh, onViewDetails, onEdit }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this match?")) return;
    try {
      setDeleting(true);
      await api.deleteMatch(match.id);
      onRefresh?.();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative border-l-4 w-full border-emerald-500 rounded-xl p-5 bg-slate-900/50 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group">

      {/* Edit & Delete buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit?.(match); }}
          className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-lg transition-all"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all disabled:opacity-50"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Sport & Status */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-2.5 py-1 rounded-md bg-emerald-500/5">
          {match.sportType || match.sport}
        </span>
        <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${match.status === "LIVE"
            ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
            : match.status === "COMPLETED"
              ? "bg-slate-700 text-slate-400 border-slate-600"
              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          }`}>
          {match.status}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-100">
            Team #{match.homeTeamId}
          </span>
          <span className="text-xl font-black text-slate-100">
            {match.homeTeamScore ?? "-"}
          </span>
        </div>
        <div className="text-center text-xs text-slate-500 font-black tracking-widest">VS</div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-100">
            Team #{match.outerTeamId}
          </span>
          <span className="text-xl font-black text-slate-100">
            {match.awayTeamScore ?? "-"}
          </span>
        </div>
      </div>

      {/* Match Info */}
      <div className="text-xs text-slate-400 mb-6 space-y-1.5">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-slate-500" />
          {match.kickoffTime ? new Date(match.kickoffTime).toLocaleDateString() : "TBD"}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-slate-500" />
          {match.kickoffTime ? new Date(match.kickoffTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD"}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-slate-500" />
          {match.venue || "TBD"}
        </div>
      </div>

      {/* Extra Info */}
      {match.competition && (
        <div className="mb-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold border-t border-slate-800 pt-3">
          🏆 {match.competition} — {match.season}
        </div>
      )}

      <button
        onClick={() => onViewDetails ? onViewDetails(match) : router.push(`/match/${match.id}`)}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all"
      >
        View Details
      </button>
    </div>
  );
};

export { MatchesCard };
export default MatchesCard;