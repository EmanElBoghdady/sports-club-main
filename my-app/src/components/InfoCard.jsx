import React from 'react'

function InfoCard({ icon, title, num, perc }) {
  return (
    <div className='bg-slate-900/50 rounded-2xl p-5 w-full shadow-sm border border-slate-800 hover:border-emerald-500/50 transition-all group backdrop-blur-sm'>
      <div className="flex justify-between items-start mb-4">
        <h4 className='text-xs font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors'>{title}</h4>
        <span className='text-emerald-500 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 group-hover:scale-110 transition-transform'>
          {icon}
        </span>
      </div>

      <div className='flex flex-col gap-1'>
        <span className='text-3xl font-black text-slate-100 tracking-tight'>{num}</span>
        <span className='text-[10px] font-black uppercase tracking-widest text-emerald-400'>
          {perc}
        </span>
      </div>
    </div>
  )
}

export default InfoCard