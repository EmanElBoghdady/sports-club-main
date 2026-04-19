"use client"
import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Filters from './Filters'
import Card from '../players/Card';
import MatchesCard from './MatchesCard'
import MatchModal from './MatchModal'; // تأكدي من إنشاء هذا المكون
import { api } from "@/src/lib/api";

import {
  FaArrowUp,
  FaAward,
  FaCalendar,
  FaLifeRing,
  FaPlus,
} from 'react-icons/fa';

function Matches() {
  const [filters, setFilters] = useState({ sport: 'All' });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // الحالة الخاصة بفتح وإغلاق المودال
  const [openModal, setOpenModal] = useState(false);

  // دالة جلب البيانات من الباك إيند
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await api.getMatches();
      const actualData = data?.content || (Array.isArray(data) ? data : []);
      setMatches(actualData);
    } catch (err) {
      console.error("Matches Fetch Error:", err);
      setError("Failed to load matches from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await api.getMatches();
        // السيرفر غالباً بيرد بـ مصفوفة أو Object جواه content
        const matchesList = data?.content || (Array.isArray(data) ? data : []);
        setMatches(matchesList);
      } catch (err) {
        console.error("Match Fetch Error:", err);
      }
    };
    fetchMatches();
  }, []);
  // دالة إضافة مباراة جديدة (نفس منطق اللاعبين)
  const handleAddMatch = async (form) => {
    try {
      // 1. تجهيز البيانات (Payload) بناءً على اللي السيرفر مستنيه
      const payload = {
        // لازم الـ IDs للفرق لو السيستم شغال بيهم
        homeTeamId: Number(form.homeTeamId), 
        awayTeamId: Number(form.awayTeamId),
        // التاريخ لازم يتبعت بتنسيق ISO (YYYY-MM-DDTHH:mm:ss)
        matchDate: `${form.date}T${form.time || '00:00'}:00`,
        location: form.location,
        sport: form.sport.toUpperCase(), // دايمًا خليه كابيتال في السيستم ده
        status: "SCHEDULED" // الحالة الافتراضية
      };
  
      setLoading(true);
      const response = await api.addMatch(payload);
  
      // 2. لو العملية نجحت والسيرفر رجع الماتش الجديد، ضيفيه للقائمة
      if (response) {
        // ملحوظة: لو السيرفر بيرجع الـ data فاضية زي اللاعبين، هننادي fetchMatches تاني
        await fetchMatches(); 
        return { success: true };
      }
    } catch (err) {
      console.error("Add Match Error:", err);
      setError(err.message || "Failed to add match. Check your permissions.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredData = (matches || []).filter(item => {
    if (filters.sport === 'All' || filters.sport === 'All Sports') return true;
    return item.sport === filters.sport;
  });

  const liveMatches = filteredData.filter(m => m.status === "LIVE");
  const scheduledMatches = filteredData.filter(m => m.status === "SCHEDULED");
  const completedMatches = filteredData.filter(m => m.status === "COMPLETED");

  if (loading) return <div className="p-10 text-white text-center">Loading matches...</div>;

  return (
    <div className="w-full h-full bg-slate-950 p-2 overflow-y-auto">
      <Header 
        title="Matches" 
        desc="View and manage all matches" 
        buttonTitle="Schedule Match"
        onClick={() => setOpenModal(true)} // تشغيل الزرار لفتح المودال
        icon={<FaPlus className="text-white" />} // نفس ستايل الأيقونة في اللاعبين
      />

      {/* المودال الخاص بإضافة مباراة */}
      <MatchModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        onAddMatch={handleAddMatch}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        <Card title="Total Matches" num={filteredData.length.toString()} icon={<FaAward className="text-lg" />} />
        <Card title="Live Now" num={liveMatches.length.toString()} icon={<FaLifeRing className="text-red-500 text-lg animate-pulse" />} />
        <Card title="Scheduled" num={scheduledMatches.length.toString()} icon={<FaCalendar className="text-lg text-emerald-500" />} />
        <Card title="Completed" num={completedMatches.length.toString()} icon={<FaArrowUp className="text-lg text-emerald-600" />} />
      </div>

      <Filters filters={filters} updateFilter={updateFilter} />

      {error && <div className="text-red-500 p-4 text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-2 pb-10">
        {filteredData.length > 0 ? (
          filteredData.map(match => (
            <MatchesCard key={match.id} match={match} />
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 py-10">No matches found.</div>
        )}
      </div>
    </div>
  );
};

export default Matches;