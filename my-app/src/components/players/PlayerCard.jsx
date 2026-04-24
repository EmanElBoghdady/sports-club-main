import React from "react";

function PlayerCard({ player, onEdit }) {
  // 1. حساب الرياضة من المركز
  const getSport = (pos) => {
    if (!pos) return "General";
    const p = pos.toUpperCase();
    if (["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"].includes(p)) return "Football";
    if (["POINT_GUARD", "SHOOTING_GUARD", "SMALL_FORWARD", "POWER_FORWARD", "CENTER"].includes(p)) return "Basketball";
    return "Handball";
  };

  // 2. حساب السن
  const age = player.dateOfBirth ? (new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()) : "24";
  const positionName = (player.preferredPosition || player.position || "Unknown Player").replace(/_/g, " ");

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-800/50 transition-all duration-300 hover:border-emerald-500/40 hover:translate-y-[-4px] group overflow-hidden shadow-lg relative">

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onEdit && onEdit(player)}
          className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white p-2 rounded-xl border border-emerald-500/20 transition-all"
          title="Edit Player"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      </div>

      {/* Header: Position Title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <span className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1 block opacity-70">Position</span>
          <h3 className="font-bold text-xl text-slate-100 group-hover:text-emerald-400 transition-colors leading-tight uppercase">
            {positionName}
          </h3>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 text-emerald-500 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-xl">person</span>
        </div>
      </div>

      {/* Sport Badge */}
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
          {getSport(player.preferredPosition)}
        </span>
      </div>

      {/* Middle Grid: Age & Nationality */}
      <div className="grid grid-cols-2 gap-4 border-y border-slate-800/40 py-5 mb-5">
        <div className="border-r border-slate-800/40">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Age</p>
          <p className="text-base font-bold text-slate-100">{age} <span className="text-[10px] text-slate-500 font-normal">YRS</span></p>
        </div>
        <div className="pl-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nationality</p>
          <p className="text-base font-bold text-slate-100 truncate">
            {player.nationality === "string" ? "International" : player.nationality}
          </p>
        </div>
      </div>

      {/* Bottom Stats: Matches & Goals */}
      <div className="flex justify-between items-center bg-slate-950/30 rounded-2xl p-4 border border-slate-800/30">
        <div className="text-center flex-1">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Matches</p>
          <p className="text-lg font-black text-slate-100">{player.kitNumber || 0}</p>
        </div>
        <div className="w-[1px] h-6 bg-slate-800" />
        <div className="text-center flex-1">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Goals</p>
          <p className="text-lg font-black text-emerald-500">{player.marketValue || 0}</p>
        </div>
        <div className="w-[1px] h-6 bg-slate-800" />
        <div className="text-center flex-1">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Rating</p>
          <p className="text-lg font-black text-sky-400">8.5</p>
        </div>
      </div>

    </div>
  );
}

export default PlayerCard;