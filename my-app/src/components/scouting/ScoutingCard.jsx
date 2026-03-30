import React from "react";
import { FaStar, FaArrowUp } from "react-icons/fa";

export default function ScoutingCard({ player }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700" />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-xs text-emerald-500 group-hover:bg-emerald-500/10 group-hover:scale-105 transition-all shadow-xl tracking-tighter">
            {player.initials}
          </div>

          <div>
            <h3 className="font-black text-slate-100 tracking-tight group-hover:text-emerald-400 transition-colors uppercase text-sm">
              {player.name}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {player.position}
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          {player.status}
        </span>
      </div>

      <div className="flex gap-2 mt-4 relative z-10">
        <span className="text-[9px] font-black uppercase tracking-widest border border-slate-800 bg-slate-950 text-slate-400 px-3 py-1 rounded-full group-hover:border-emerald-500/30 transition-colors">
          {player.sport}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-3 text-[10px] font-bold uppercase tracking-widest mt-6 border-y border-slate-800/50 py-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Age:</span>
          <span className="text-slate-300">{player.age} years</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-slate-600">Club:</span>
          <span className="text-slate-300">{player.club}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-600">Nation:</span>
          <span className="text-slate-300">{player.nationality}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Current Rating</p>
          <div className="flex items-center gap-2 font-black text-lg text-slate-100">
            <FaStar className="text-amber-500 text-sm" />
            {player.rating}
          </div>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Potential</p>
          <div className="flex items-center justify-end gap-2 text-emerald-400 font-black text-lg">
            <FaArrowUp className="text-sm" />
            {player.potential}
          </div>
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">Key Strengths</p>
        <div className="flex flex-wrap gap-2">
          {player.strengths.map((skill, i) => (
            <span
              key={i}
              className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/5 text-slate-300 px-3 py-1 rounded-full border border-slate-800 group-hover:border-emerald-500/20 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
