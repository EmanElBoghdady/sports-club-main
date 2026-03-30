import React from 'react';
import { CalendarDays } from 'lucide-react';

const Header = ({ title, desc, icon, buttonTitle, onClick }) => {
  return (
    <div className="mb-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="md:text-4xl font-black text-3xl text-slate-100 tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
            {desc}
          </p>
        </div>

        {buttonTitle && (
          <button
            onClick={onClick}
            className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            {icon}
            {buttonTitle}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;