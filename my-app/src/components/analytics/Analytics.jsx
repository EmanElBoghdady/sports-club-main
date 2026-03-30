import React from 'react'
import AnalyticCard from "./AnalyticCard"
import Header from '../Header';
import Filter from './Filter';

function Analytics() {
    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
            <Header title="Analytics & Reports" desc="Performance insights and statistics" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <AnalyticCard
                    title="Win Rate"
                    num="68%"
                    icon={<div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5 transition-all group-hover:scale-110"><i className="fi fi-rs-user text-xl"></i></div>}
                    doub="+12%"
                />
                <AnalyticCard
                    title="Avg Goals/Game"
                    num="2.4"
                    icon={<div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5 transition-all group-hover:scale-110"><i className="fi fi-rs-user text-xl"></i></div>}
                    doub="+0.3"
                />
                <AnalyticCard
                    title="Team Rating"
                    num="8.2"
                    icon={<div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5 transition-all group-hover:scale-110"><i className="fi fi-rs-user text-xl"></i></div>}
                    doub="+0.5"
                />
                <AnalyticCard
                    title="Player Fitness"
                    num="94%"
                    icon={<div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5 transition-all group-hover:scale-110"><i className="fi fi-rs-user text-xl"></i></div>}
                    doub="+2%"
                />
            </div>

            <div className="mt-10">
                <Filter />
            </div>
        </div>
    )
}

export default Analytics