"use client";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { api } from "@/src/lib/api";
const SPORTS = ["Football", "Basketball", "Handball"];

const POSITIONS_BY_SPORT = {
  Football: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
  Basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  Handball: ["Goalkeeper", "Left Wing", "Right Wing", "Left Back", "Right Back", "Centre Back", "Pivot"],
};

const STATES = ["Fit", "Injured", "Suspended"];

const NATIONALITIES = [
  "Algerian", "Moroccan", "Tunisian", "Egyptian", "French",
  "Spanish", "Brazilian", "Argentinian", "Italian", "Other",
];

const defaultForm = {
  name: "",
  sport: "",
  position: "",
  state: "Fit",
  age: "",
  nationality: "",
  matches: "",
  points: "",
  rating: "",
};

export default function Modal({ open, onClose, onAddPlayer }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const set = (key, val) => {
    setForm((prev) => ({
      ...prev,
      [key]: val,
      // reset position when sport changes
      ...(key === "sport" ? { position: "" } : {}),
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.sport) e.sport = "Select a sport";
    if (!form.position) e.position = "Select a position";
    if (!form.age || isNaN(form.age) || +form.age < 14 || +form.age > 50)
      e.age = "Valid age (14–50)";
    if (!form.nationality) e.nationality = "Select nationality";
    if (form.rating !== "" && (isNaN(form.rating) || +form.rating < 0 || +form.rating > 10))
      e.rating = "Rating 0–10";
    return e;
  };

  const handleSubmit = async () => {
    // تجميع البيانات المهمة فقط للسيرفر
    const payload = {
      dateOfBirth: form.dateOfBirth || "2003-01-01",
      nationality: form.nationality || "Egyptian",
      preferredPosition: (form.position || "FORWARD").toUpperCase().replace(/\s+/g, '_'),
      marketValue: Number(form.points) || 0, // الجولز
      kitNumber: Number(form.matches) || 0,  // الماتشات
      outerTeamId: 1 // قيمة ثابتة طالما شلنا الحالة
    };

    try {
      await api.createOuterPlayer(payload);
      if (onAddPlayer) await onAddPlayer();
      handleClose();
      alert("✅ Player Saved!");
    } catch (err) {
      console.error("Submission error:", err.response?.data);
      alert("Error saving player. Please check the fields.");
    }
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
            <FaUser size={18} />
          </div>
          <div>
            <h2 className="font-black text-slate-100 text-xl uppercase tracking-tight">Add New Player</h2>
            <p className="text-slate-500 text-xs font-medium">Fill in the player's details below</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-auto text-slate-500 hover:text-slate-300 cursor-pointer rounded-lg p-2 hover:bg-slate-900 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 grid grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto custom-scrollbar" >

          {/* Full name – full width */}
          <div className="col-span-2">
            <Field label="Full Name" error={errors.name}>
              <input
                className={inputCls("name")}
                placeholder="e.g. Youcef Atal"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
          </div>

          {/* Sport */}
          <Field label="Sport" error={errors.sport}>
            <select className={inputCls("sport")} value={form.sport} onChange={(e) => set("sport", e.target.value)}>
              <option value="" className="bg-slate-950">Select sport</option>
              {SPORTS.map((s) => <option key={s} className="bg-slate-950">{s}</option>)}
            </select>
          </Field>

          {/* Position – depends on sport */}
          <Field label="Position" error={errors.position}>
            <select
              className={inputCls("position")}
              value={form.position}
              onChange={(e) => set("position", e.target.value)}
              disabled={!form.sport}
            >
              <option value="" className="bg-slate-950">Select position</option>
              {(POSITIONS_BY_SPORT[form.sport] || []).map((p) => <option key={p} className="bg-slate-950">{p}</option>)}
            </select>
          </Field>


          {/* Nationality */}
          <Field label="Nationality" error={errors.nationality}>
            <select className={inputCls("nationality")} value={form.nationality} onChange={(e) => set("nationality", e.target.value)}>
              <option value="" className="bg-slate-950">Select nationality</option>
              {NATIONALITIES.map((n) => <option key={n} className="bg-slate-950">{n}</option>)}
            </select>
          </Field>

          {/* Age */}
          <Field label="Age" error={errors.age}>
            <input
              type="number"
              className={inputCls("age")}
              placeholder="e.g. 24"
              min={14} max={50}
              value={form.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </Field>

          {/* Matches */}
          <Field label="Matches" error={errors.matches}>
            <input
              type="number"
              className={inputCls("matches")}
              placeholder="e.g. 20"
              min={0}
              value={form.matches}
              onChange={(e) => set("matches", e.target.value)}
            />
          </Field>

          {/* Points / Goals */}
          <Field label="Goals / Points" error={errors.points}>
            <input
              type="number"
              className={inputCls("points")}
              placeholder="e.g. 8"
              min={0}
              value={form.points}
              onChange={(e) => set("points", e.target.value)}
            />
          </Field>

          {/* Rating */}
          <div className="col-span-2">
            <Field label="Performance Rating (0–10)" error={errors.rating}>
              <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <input
                  type="range"
                  min={0} max={10} step={0.1}
                  value={form.rating || 0}
                  onChange={(e) => set("rating", e.target.value)}
                  className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-full appearance-none"
                />
                <span className={`text-lg font-black w-12 text-center
                  ${+form.rating >= 7 ? "text-emerald-500" : +form.rating >= 5 ? "text-amber-500" : "text-red-500"}`}>
                  {form.rating || "0"}
                </span>
              </div>
            </Field>
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-4 px-6 py-6 border-t border-slate-800">
          <button
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-slate-200 cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Register Player
          </button>
        </div>

      </div>
    </div>
  );
}