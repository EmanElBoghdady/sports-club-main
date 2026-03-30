import React from 'react';

const TrainingCard = ({ session }) => {
  return (
    <div className="border-l-4 w-full border-emerald-500 rounded-xl p-5 bg-slate-900/50 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group">

      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">{session.title}</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-md bg-emerald-500/5">
          {session.sport}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {session.team && (
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="text-emerald-500/50">👥</span>
            <span className="font-medium text-slate-500 w-16">Team:</span>
            <span className="text-slate-300">{session.team}</span>
          </div>
        )}

        {session.time && (
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="text-emerald-500/50">🕒</span>
            <span className="font-medium text-slate-500 w-16">Time:</span>
            <span className="text-slate-300">{session.time}</span>
          </div>
        )}

        {session.coach && (
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="text-emerald-500/50">🧢</span>
            <span className="font-medium text-slate-500 w-16">Coach:</span>
            <span className="text-slate-300">{session.coach}</span>
          </div>
        )}

        {session.location && (
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="text-emerald-500/50">📍</span>
            <span className="font-medium text-slate-500 w-16">Location:</span>
            <span className="text-slate-300">{session.location}</span>
          </div>
        )}
      </div>

      <button className="w-full py-2.5 border border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 font-bold text-xs uppercase tracking-widest rounded-lg cursor-pointer transition-all">
        View Details
      </button>
    </div>
  );
};

export default TrainingCard;