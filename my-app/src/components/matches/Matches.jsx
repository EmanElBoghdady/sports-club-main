"use client"
import React, { useState } from 'react';
import Header from '../Header';
import Filters from './Filters'
import Card from '../players/Card';
import MatchesCard from './MatchesCard'
import { matchesData } from "../../data/matchesData";

import {
  FaArrowUp,
  FaAward,
  FaCalendar,
  FaLifeRing,
} from 'react-icons/fa';
function Matches() {

  const [filters, setFilters] = useState({
    sport: 'All',
  });


  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };


  const filteredData = matchesData.filter(item => {
    if (filters.sport === 'All' || filters.sport === 'All Sports') return true;
    return item.sport === filters.sport;
  });

  const liveMatches = filteredData.filter(m => m.status === "LIVE");
  const scheduledMatches = filteredData.filter(m => m.status === "SCHEDULED");
  const completedMatches = filteredData.filter(m => m.status === "COMPLETED");


  return (
    <div className="w-full h-full bg-slate-950 p-2 overflow-y-auto">

      <Header title="Matches" desc="View and manage all matches" buttonTitle="Schedule Match" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        <Card
          title="Total Matches"
          num={filteredData.length}
          icon={<FaAward className="text-lg" />}
        />
        <Card
          title="Live Now"
          num={liveMatches.length}
          icon={<FaLifeRing className="text-red-500 text-lg animate-pulse" />} />

        <Card
          title="Scheduled"
          num={scheduledMatches.length}
          icon={<FaCalendar className="text-lg text-emerald-500" />}
        />
        <Card
          title="Completed"
          num={completedMatches.length}
          icon={<FaArrowUp className="text-lg text-emerald-600" />} />
      </div>

      <Filters
        filters={filters}
        updateFilter={updateFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-2 pb-10">
        {filteredData.map(match => (
          <MatchesCard key={match.id} match={match} />
        ))}
      </div>

    </div>
  );
};

export default Matches