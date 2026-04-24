"use client";
import React, { useState } from "react";
import { FaTrophy, FaMapMarkerAlt } from "react-icons/fa";

const SPORT_TYPES = ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS"];
const MATCH_TYPES = ["LEAGUE", "CUP", "FRIENDLY", "PLAYOFF"];

const defaultForm = {
  homeTeamId: "",
  outerTeamId: "",
  matchType: "LEAGUE",
  sportType: "FOOTBALL",
  venue: "",
  competition: "",
  season: "",
  kickoffTime: "",
  finishTime: "",
  referee: "",
  attendance: "",
  matchSummary: "",
  notes: "",
  matchFormationId: "",
};

export default function MatchModal({ open, onClose, onAddMatch, initialData }) {
  const [form, setForm] = React.useState(defaultForm);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (initialData) {
      const formatted = { ...initialData };
      // Format dates for datetime-local input: YYYY-MM-DDTHH:mm
      if (formatted.kickoffTime) formatted.kickoffTime = new Date(formatted.kickoffTime).toISOString().slice(0, 16);
      if (formatted.finishTime) formatted.finishTime = new Date(formatted.finishTime).toISOString().slice(0, 16);
      setForm({ ...defaultForm, ...formatted });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  if (!open) return null;

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.homeTeamId) e.homeTeamId = "Required";
    if (!form.outerTeamId) e.outerTeamId = "Required";
    if (!form.kickoffTime) e.kickoffTime = "Required";
    if (!form.venue?.toString().trim()) e.venue = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAddMatch?.(form);
    setForm(defaultForm);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(defaultForm);
    setErrors({});
    onClose();
  };

  const Field = ({ label, error, children, full }) => (
    <div className={`flex flex-col gap-2 ${full ? "col-span-2" : ""}`}>
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</label>
      {children}
      {error && <span className="text-red-500 text-[10px] font-bold">{error}</span>}
    </div>
  );

  const inputCls = (key) =>
    `bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all w-full placeholder:text-slate-600
        ${errors[key] ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-emerald-500"}`;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-950 rounded-2xl shadow-2xl w-full max-w-2xl relative border border-slate-800">

        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-5 border-b border-slate-800">
          <div className="bg-emerald-500/10 text-emerald-500 rounded-xl p-2.5 border border-emerald-500/20">
            <FaTrophy size={18} />
          </div>
          <div>
            <h2 className="font-black text-slate-100 text-xl uppercase tracking-tight">{initialData ? "Edit Match" : "Schedule Match"}</h2>
            <p className="text-slate-500 text-xs">{initialData ? `Updating Match #${initialData.id}` : "Fill in match details"}</p>
          </div>
          <button onClick={handleClose} className="ml-auto text-slate-500 hover:text-slate-300 rounded-lg p-2 hover:bg-slate-900 transition-all">✕</button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 grid grid-cols-2 gap-5 max-h-[65vh] overflow-y-auto">

          <Field label="Home Team ID *" error={errors.homeTeamId}>
            <input type="number" className={inputCls("homeTeamId")} placeholder="e.g. 1" value={form.homeTeamId} onChange={e => set("homeTeamId", e.target.value)} />
          </Field>

          <Field label="Outer Team ID *" error={errors.outerTeamId}>
            <input type="number" className={inputCls("outerTeamId")} placeholder="e.g. 2" value={form.outerTeamId} onChange={e => set("outerTeamId", e.target.value)} />
          </Field>

          <Field label="Sport Type" error={errors.sportType}>
            <select className={inputCls("sportType")} value={form.sportType} onChange={e => set("sportType", e.target.value)}>
              {SPORT_TYPES.map(s => <option key={s} value={s} className="bg-slate-950">{s}</option>)}
            </select>
          </Field>

          <Field label="Match Type" error={errors.matchType}>
            <select className={inputCls("matchType")} value={form.matchType} onChange={e => set("matchType", e.target.value)}>
              {MATCH_TYPES.map(s => <option key={s} value={s} className="bg-slate-950">{s}</option>)}
            </select>
          </Field>

          <Field label="Kickoff Time *" error={errors.kickoffTime}>
            <input type="datetime-local" className={inputCls("kickoffTime")} value={form.kickoffTime} onChange={e => set("kickoffTime", e.target.value)} />
          </Field>

          <Field label="Finish Time" error={errors.finishTime}>
            <input type="datetime-local" className={inputCls("finishTime")} value={form.finishTime} onChange={e => set("finishTime", e.target.value)} />
          </Field>

          <Field label="Venue / Stadium *" error={errors.venue} full>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className={`${inputCls("venue")} pl-10`} placeholder="Main Stadium" value={form.venue} onChange={e => set("venue", e.target.value)} />
            </div>
          </Field>

          <Field label="Competition" error={errors.competition}>
            <input className={inputCls("competition")} placeholder="e.g. Premier League" value={form.competition} onChange={e => set("competition", e.target.value)} />
          </Field>

          <Field label="Season" error={errors.season}>
            <input className={inputCls("season")} placeholder="e.g. 2025/2026" value={form.season} onChange={e => set("season", e.target.value)} />
          </Field>

          <Field label="Referee" error={errors.referee}>
            <input className={inputCls("referee")} placeholder="Referee name" value={form.referee} onChange={e => set("referee", e.target.value)} />
          </Field>

          <Field label="Attendance" error={errors.attendance}>
            <input type="number" className={inputCls("attendance")} placeholder="e.g. 50000" value={form.attendance} onChange={e => set("attendance", e.target.value)} />
          </Field>

          <Field label="Formation ID" error={errors.matchFormationId}>
            <input type="number" className={inputCls("matchFormationId")} placeholder="e.g. 1" value={form.matchFormationId} onChange={e => set("matchFormationId", e.target.value)} />
          </Field>

          <Field label="Match Summary" error={errors.matchSummary} full>
            <textarea className={`${inputCls("matchSummary")} resize-none h-20`} placeholder="Brief summary..." value={form.matchSummary} onChange={e => set("matchSummary", e.target.value)} />
          </Field>

          <Field label="Notes" error={errors.notes} full>
            <textarea className={`${inputCls("notes")} resize-none h-16`} placeholder="Additional notes..." value={form.notes} onChange={e => set("notes", e.target.value)} />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-6 py-5 border-t border-slate-800">
          <button onClick={handleClose} className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-all">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all">{initialData ? "Update Match" : "Create Match"}</button>
        </div>
      </div>
    </div>
  );
}