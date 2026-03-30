"use client"
import React, { useState } from 'react';
import Header from '../Header';
import TrainingFilter from './TrainingFilter';
import TrainingDayGroup from './TrainingDayGroup';
import { trainingData } from '../../data/trainingData';
import Card from '../players/Card';
import TrainingModal from './TrainingModal'

const TrainingSchedule = () => {

  const [filters, setFilters] = useState({
    sport: 'All',
  });

const [sessions, setSessions] = useState(trainingData);
  const [openModal, setOpenModal] = useState(false);
  
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };


  const filteredData = sessions.filter(item => {
  if (filters.sport === 'All' || filters.sport === 'All Sports') return true;
  return item.sport === filters.sport;
});


  const groupedData = filteredData.reduce((groups, item) => {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
    return groups;
  }, {});



  return (
    <div className="w-full h-full bg-slate-950 p-2 overflow-y-auto">

      <Header title="Training Schedule" desc="Manage training sessions and plans" buttonTitle="Add Training" onClick={() => setOpenModal(true)} />
        <TrainingModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onAddSession={(newSession) => setSessions(prev => [newSession, ...prev])}
/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        <Card
          title="This Week"
          num="4"
          icon={<span className="material-symbols-outlined text-lg">fitness_center</span>}
        />
        <Card
          title="Tactical Training"
          num="1"
          icon={<span className="material-symbols-outlined text-lg">target</span>} />

        <Card
          title="Fitness Session"
          num="1"
          icon={<span className="material-symbols-outlined text-lg">target</span>}
        />
        <Card
          title="Technical"
          num="2"
          icon={<span className="material-symbols-outlined text-lg">target</span>} />
      </div>

      <TrainingFilter
        filters={filters}
        updateFilter={updateFilter}
      />

      <div className="space-y-8 mt-4 px-2 pb-10">
        {Object.entries(groupedData).map(([date, sessions]) => (
          <TrainingDayGroup
            key={date}
            date={date}
            sessions={sessions}
          />
        ))}
      </div>

    </div>
  );
};

export default TrainingSchedule;