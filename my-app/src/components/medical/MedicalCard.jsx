// src/components/medical/MedicalCard.jsx
import { MEDICAL_CONFIG } from "@/src/data/medicalFields";

export default function MedicalCard({ data, type, onEdit, onDelete }) {
  const icon = MEDICAL_CONFIG[type]?.icon || "medical_services";

  const getCardTitle = () => {
    if (type === "Injuries") return data.injuryType || "Unknown Injury";
    if (type === "Fitness") return data.testName || "Fitness Test";
    if (type === "Recovery") return data.programName || "Recovery Program";
    if (type === "Training") return data.trainingType || "Training Load";
    if (type === "Diagnoses") return `Diagnosis #${data.id}`;
    return data.treatmentType || "Medical Record";
  };

  return (
    <div className="bg-[#0a0f1d] border border-white/5 rounded-[2.5rem] p-6 hover:border-emerald-500/30 transition-all shadow-2xl group relative overflow-hidden">

      {/* Badges - تم تحسين المسافات هنا */}
      <div className="flex justify-end gap-2 mb-4">
        <div className="bg-slate-800/40 text-[9px] px-3 py-1 rounded-lg text-slate-500 font-mono border border-white/5">
          PID: {data.playerId || '---'}
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1 rounded-lg font-black border border-emerald-500/20 shadow-sm">
          REF-ID: {data.id}
        </div>
      </div>

      <div className="flex justify-between items-start mb-6">
        {/* Icon Container */}
        <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-emerald-500 border border-white/5 shadow-inner group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
          <span className="material-icons text-3xl">{icon}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(data)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
          >
            <span className="material-icons text-sm">edit</span>
          </button>
          <button
            onClick={() => onDelete(data.id)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <span className="material-icons text-sm">delete</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-1 mb-6">
        <h3 className="text-white font-black text-xl uppercase tracking-tight truncate">
          {getCardTitle()}
        </h3>
        <p className="text-emerald-500 text-[10px] font-black tracking-[0.2em] uppercase opacity-60 flex items-center gap-1">
          <span className="material-icons text-[12px]">fingerprint</span>
          {data.playerKeycloakId?.substring(0, 8) || `UUID: ${data.id}`}
        </p>
      </div>

      {/* Data Grid */}
      <div className="bg-slate-950/40 p-5 rounded-[1.8rem] border border-white/5 space-y-4">
        <div className="flex justify-between items-center text-[10px] font-black tracking-widest">
          <span className="text-slate-500 uppercase">Current Status</span>
          <span className={`px-3 py-1 rounded-full text-[9px] ${data.severity === 'SEVERE' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
            {data.status || data.severity || "ACTIVE"}
          </span>
        </div>

        <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500 border-t border-white/5 pt-4">
          <span className="flex items-center gap-1">
            <span className="material-icons text-[14px]">calendar_today</span>
            {type === 'Training' ? 'LOAD VALUE' : 'REPORTED DATE'}
          </span>
          <span className="text-slate-200">
            {data.load || data.injuryDate || data.testDate || data.startDate || "N/A"}
          </span>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-4 -right-4 text-white/[0.02] pointer-events-none group-hover:text-emerald-500/[0.05] transition-colors">
        <span className="material-icons text-8xl">{icon}</span>
      </div>
    </div>
  );
}