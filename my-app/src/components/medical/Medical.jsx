"use client";
import React, { useState, useEffect } from 'react';
import { api } from "@/src/lib/api";
import { MEDICAL_CONFIG } from "@/src/data/medicalFields";
import Header from '../Header';
import { FormModal, Toast } from "@/src/components/shared/SharedComponents";
import MedicalCard from './MedicalCard';

export default function Medical() {
  const [activeTab, setActiveTab] = useState("Injuries");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.medical[activeTab].get();
      const fetchedData = res?.content || res?.data || (Array.isArray(res) ? res : []);
      setData(fetchedData);
    } catch (err) {
      console.error("Load Error:", err);
      setData([]);
      setToast({ msg: `No ${activeTab} data found yet`, type: "info" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [activeTab]);

  const buildPayload = (formData, activeTab) => {
    const today = new Date().toISOString().split('T')[0];
    const DEFAULT_PLAYER_UUID = "00000000-0000-0000-0000-000000000001";
    const DEFAULT_DOCTOR_UUID = "d1111111-1111-1111-1111-111111111111";

    if (activeTab === "Fitness") {
      return {
        playerKeycloakId: formData.playerKeycloakId || DEFAULT_PLAYER_UUID,
        teamId: Number(formData.teamId || 1),
        testType: formData.testType || "VO2_MAX",
        sportType: formData.sportType || "FOOTBALL",
        testDate: formData.testDate ? new Date(formData.testDate).toISOString() : new Date().toISOString(),
        conductedByDoctorKeycloakId: DEFAULT_DOCTOR_UUID,
        testName: formData.testName || "Fitness Assessment",
        result: Number(formData.result || 0),
        unit: formData.unit || "N/A",
        resultCategory: "GENERAL",
        notes: formData.notes || "",
        recommendations: "Follow plan",
        attachments: ""
      };
    }

    if (activeTab === "Rehabilitation") {
      return {
        injuryId: Number(formData.injuryId),
        playerId: Number(formData.playerId || 1),
        physiotherapistId: Number(formData.physiotherapistId || 1),
        status: formData.status || "NOT_STARTED",
        rehabPlan: formData.rehabPlan || "Plan Details",
        exercises: formData.exercises || "Exercises List",
        durationWeeks: Number(formData.durationWeeks || 1),
        startDate: formData.startDate || today,
        expectedEndDate: formData.expectedEndDate || today,
        actualEndDate: formData.actualEndDate || today,
        progressNotes: formData.progressNotes || "",
        restrictions: formData.restrictions || "None",
        createdAt: new Date().toISOString()
      };
    }

    if (activeTab === "Recovery") {
      return {
        ...formData,
        rehabilitationId: Number(formData.rehabilitationId),
        playerId: Number(formData.playerId || 1),
        sessionsPerWeek: Number(formData.sessionsPerWeek || 0),
        durationMinutes: Number(formData.durationMinutes || 0),
        status: "ACTIVE"
      };
    }

    // Injuries, Diagnoses, Treatments, Training
    return {
      ...formData,
      playerId: Number(formData.playerId || 1),
      injuryId: formData.injuryId ? Number(formData.injuryId) : undefined,
      playerKeycloakId: DEFAULT_PLAYER_UUID,
      doctorKeycloakId: DEFAULT_DOCTOR_UUID
    };
  };

  const handleSave = async (formData) => {
    try {
      const payload = buildPayload(formData, activeTab);
      const isEditing = !!editData?.id;

      console.log(`${isEditing ? 'Updating' : 'Creating'} ${activeTab}:`, payload);

      if (isEditing) {
        await api.medical[activeTab].put(editData.id, payload);
        setToast({ msg: `${activeTab} updated successfully!`, type: "success" });
      } else {
        await api.medical[activeTab].post(payload);
        setToast({ msg: `${activeTab} saved successfully!`, type: "success" });
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("Detailed Backend Error:", err);
      setToast({ msg: err.message || "Check Required Fields/IDs", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.medical[activeTab].delete(id);
      setToast({ msg: "Deleted!", type: "success" });
      loadData();
    } catch (err) {
      setToast({ msg: "Delete failed (404 or Server Error)", type: "error" });
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditData({});
    setShowModal(true);
  };

  return (
    <div className="w-full h-full bg-[#020617] p-6 overflow-y-auto">
      <Header title="Medical Center" desc="High-Performance Health Management" />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 bg-slate-900/40 p-2 rounded-3xl border border-white/5 w-fit">
        {Object.keys(MEDICAL_CONFIG).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === tab ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"}`}
          >
            {MEDICAL_CONFIG[tab].label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl font-black tracking-tighter uppercase">
          {activeTab} <span className="text-emerald-500">Log</span>
        </h2>
        <button
          onClick={handleAddNew}
          className="bg-emerald-600 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-emerald-900/20 flex items-center gap-2"
        >
          <span className="material-icons">add</span> Add New Record
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 animate-pulse text-emerald-500 font-mono tracking-widest">
          LOADING_SECURE_DATA...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((item, idx) => (
            <MedicalCard
              key={item.id || idx}
              data={item}
              type={activeTab}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <FormModal
          title={editData?.id ? `Edit ${activeTab}` : `Add ${activeTab}`}
          fields={MEDICAL_CONFIG[activeTab].fields}
          initialData={editData}
          onSubmit={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}