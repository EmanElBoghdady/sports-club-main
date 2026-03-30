import React from "react";

export default function MedicalCard({
  name,
  position,
  sport,
  state,
  injuryType,
  expectedReturn,
  progress,
  actionTitle
}) {
  const isInjured = state === "Injured";

  return (
    <div
      className={`bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group relative overflow-hidden ${isInjured ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-500"
        }`}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700" />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex gap-4">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-xs font-black ring-1 ring-inset tracking-tighter shadow-xl
              ${isInjured
                ? "bg-red-500/10 text-red-400 ring-red-500/20"
                : "bg-amber-500/10 text-amber-400 ring-amber-500/20"}`}
          >
            {name
              .split(" ")
              .map(n => n[0])
              .join("")}
          </div>

          <div>
            <p className="font-black text-slate-100 tracking-tight group-hover:text-emerald-400 transition-colors uppercase text-sm">
              {name}
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {position} <span className="mx-1 text-slate-800">•</span> {sport}
            </p>
          </div>
        </div>

        <span
          className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-lg
            ${isInjured
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
        >
          {state}
        </span>
      </div>

      <div className="mt-8 space-y-3 relative z-10">
        {isInjured ? (
          <>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-slate-500">Injury Type:</span>
              <span className="text-red-400">{injuryType}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-slate-500">Expected Return:</span>
              <span className="text-slate-200">{expectedReturn}</span>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-500">Recovery Progress:</span>
                <span className="text-emerald-400">{progress}</span>
              </div>
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  style={{ width: progress }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-slate-500">Expected Return:</span>
              <span className="text-slate-200">{expectedReturn}</span>
            </div>
          </>
        )}
      </div>

  
    </div>
  );
}
