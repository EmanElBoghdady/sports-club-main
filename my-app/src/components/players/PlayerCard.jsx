import React from "react";

function PlayerCard({ player }) {
  return (
    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors leading-tight">{player.name}</h3>
          <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{player.position}</h2>
        </div>
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <span className="material-symbols-outlined text-emerald-500 text-sm">person</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-2.5 py-1 rounded-md bg-emerald-500/5">
          {player.sport}
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${player.state === "Fit"
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}>
          {player.state}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-slate-800/50 py-4 mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Age</p>
          <p className="text-sm font-bold text-slate-200">{player.age}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Nationality</p>
          <p className="text-sm font-bold text-slate-200">{player.nationality}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Matches</p>
          <p className="text-sm font-black text-slate-100">{player.matches}</p>
        </div>
        <div className="w-[1px] h-8 bg-slate-800/50" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Goals</p>
          <p className="text-sm font-black text-slate-100">{player.points}</p>
        </div>
        <div className="w-[1px] h-8 bg-slate-800/50" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Rating</p>
          <p className="text-sm font-black text-sky-500">{player.rating}</p>
        </div>
      </div>

    </div>
  );
}

export default PlayerCard;
