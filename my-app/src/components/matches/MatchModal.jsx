"use client";
import React, { useState } from "react";
import { FaTrophy, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const SPORTS = ["Football", "Basketball", "Handball"];
const STATUS_OPTIONS = ["SCHEDULED", "LIVE", "COMPLETED"];

const defaultForm = {
  homeTeam: "",
  awayTeam: "",
  sport: "",
  date: "",
  time: "",
  location: "",
  status: "SCHEDULED",
};

export default function MatchModal({ open, onClose, onAddMatch }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.homeTeam.trim()) e.homeTeam = "Home team is required";
    if (!form.awayTeam.trim()) e.awayTeam = "Away team is required";
    if (!form.sport) e.sport = "Select a sport";
    if (!form.date) e.date = "Date is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    onAddMatch?.({
      id: Date.now(),
      ...form,
    });

    setForm(defaultForm);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(defaultForm);
    setErrors({});
    onClose();
  };

  const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      {children}
      {error && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{error}</span>}
    </div>
  );

  const inputCls = (key) =>
    `bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all w-full placeholder:text-slate-600
     ${errors[key]
      ? "border-red-500/50 focus:border-red-500 ring-2 ring-red-500/10"
      : "border-slate-800 focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
    }`;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-950 rounded-2xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200 border border-slate-800">

        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-5 border-b border-slate-800">
          <div className="bg-emerald-500/10 text-emerald-500 rounded-xl p-2.5 border border-emerald-500/20">
            <FaTrophy size={18} />
          </div>
          <div>
            <h2 className="font-black text-slate-100 text-xl uppercase tracking-tight">Schedule Match</h2>
            <p className="text-slate-500 text-xs font-medium">Create a new match event</p>
          </div>
          <button onClick={handleClose} className="ml-auto text-slate-500 hover:text-slate-300 rounded-lg p-2 hover:bg-slate-900 transition-all">✕</button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 grid grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto custom-scrollbar" >
          
          <Field label="Home Team" error={errors.homeTeam}>
            <input className={inputCls("homeTeam")} placeholder="Team A" value={form.homeTeam} onChange={(e) => set("homeTeam", e.target.value)} />
          </Field>

          <Field label="Away Team" error={errors.awayTeam}>
            <input className={inputCls("awayTeam")} placeholder="Team B" value={form.awayTeam} onChange={(e) => set("awayTeam", e.target.value)} />
          </Field>

          <Field label="Sport" error={errors.sport}>
            <select className={inputCls("sport")} value={form.sport} onChange={(e) => set("sport", e.target.value)}>
              <option value="" className="bg-slate-950">Select sport</option>
              {SPORTS.map((s) => <option key={s} value={s} className="bg-slate-950">{s}</option>)}
            </select>
          </Field>

          <Field label="Status" error={errors.status}>
            <select className={inputCls("status")} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-slate-950">{s}</option>)}
            </select>
          </Field>

          <Field label="Date" error={errors.date}>
            <input type="date" className={inputCls("date")} value={form.date} onChange={(e) => set("date", e.target.value)} />
          </Field>

          <Field label="Time" error={errors.time}>
            <input type="time" className={inputCls("time")} value={form.time} onChange={(e) => set("time", e.target.value)} />
          </Field>

          <div className="col-span-2">
            <Field label="Location / Stadium" error={errors.location}>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className={`${inputCls("location")} pl-10`} placeholder="Main Stadium" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-6 py-6 border-t border-slate-800">
          <button onClick={handleClose} className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-all">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all">Create Match</button>
        </div>
      </div>
    </div>
  );
}