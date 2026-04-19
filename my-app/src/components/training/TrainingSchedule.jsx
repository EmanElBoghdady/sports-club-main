"use client"
import React, { useState, useEffect } from 'react'; // أضفنا useEffect
import Header from '../Header';
import TrainingFilter from './TrainingFilter';
import TrainingDayGroup from './TrainingDayGroup';
import Card from '../players/Card';
import TrainingModal from './TrainingModal';
import { api } from "@/src/lib/api"; // استيراد الـ API

const TrainingSchedule = () => {
  const [filters, setFilters] = useState({ sport: 'All' });
  const [sessions, setSessions] = useState([]); // البداية مصفوفة فاضية
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // 1. دالة جلب التدريبات من السيرفر
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await api.getTrainingSessions();
      // الربط مع حقل content لو السيرفر بيستخدم Pagination
      const actualData = data?.content || (Array.isArray(data) ? data : []);
      setSessions(actualData);
    } catch (err) {
      console.error("Training Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // 2. الفلترة (تأكدي أن الحقل في السيرفر اسمه sport)
  const filteredData = sessions.filter(item => {
    if (filters.sport === 'All' || filters.sport === 'All Sports') return true;
    return item.sport === filters.sport;
  });

  // 3. تجميع البيانات حسب التاريخ
  const groupedData = filteredData.reduce((groups, item) => {
    // ملحوظة: لو التاريخ بيجي من السيرفر كامل (ISO)، ممكن تحتاجي تقصي التاريخ بس: item.date.split('T')[0]
    const dateKey = item.date || item.startTime?.split('T')[0] || "Unknown Date";
    if (!groups[dateKey]) { groups[dateKey] = []; }
    groups[dateKey].push(item);
    return groups;
  }, {});

  if (loading) return <div className="text-white p-10 text-center">Loading Training Sessions...</div>;

  return (
    <div className="w-full h-full bg-slate-950 p-2 overflow-y-auto">
      <Header 
        title="Training Schedule" 
        desc="Manage training sessions and plans" 
        buttonTitle="Add Training" 
        onClick={() => setOpenModal(true)} 
      />

      <TrainingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        // نبعت fetchSessions للمودال عشان يحدث الصفحة بعد الإضافة
        onSuccess={fetchSessions} 
      />

      {/* الـ Cards دي ممكن نخلي أرقامها ديناميكية بناءً على sessions.length */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        <Card title="Total Sessions" num={sessions.length.toString()} icon={<span className="material-symbols-outlined text-lg">fitness_center</span>} />
        <Card title="Tactical" num={sessions.filter(s => s.type === 'TACTICAL').length.toString()} icon={<span className="material-symbols-outlined text-lg">target</span>} />
        <Card title="Fitness" num={sessions.filter(s => s.type === 'FITNESS').length.toString()} icon={<span className="material-symbols-outlined text-lg">target</span>} />
        <Card title="Technical" num={sessions.filter(s => s.type === 'TECHNICAL').length.toString()} icon={<span className="material-symbols-outlined text-lg">target</span>} />
      </div>

      <TrainingFilter filters={filters} updateFilter={updateFilter} />

      <div className="space-y-8 mt-4 px-2 pb-10">
        {Object.entries(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([date, sessions]) => (
            <TrainingDayGroup key={date} date={date} sessions={sessions} />
          ))
        ) : (
          <div className="text-slate-500 text-center py-20 uppercase tracking-widest text-xs">No training sessions found</div>
        )}
      </div>
    </div>
  );
};

export default TrainingSchedule;