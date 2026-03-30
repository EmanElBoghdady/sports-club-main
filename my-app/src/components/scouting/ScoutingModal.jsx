"use client";
import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SPORTS_POSITIONS = {
  Football:   ["Goalkeeper", "Defender", "Midfielder", "Forward", "Winger"],
  Basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  Handball:   ["Goalkeeper", "Left Wing", "Right Wing", "Left Back", "Right Back", "Centre Back", "Pivot"],
  Volleyball: ["Setter", "Outside Hitter", "Opposite Hitter", "Middle Blocker", "Libero"],
  Swimming:   ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Medley"],
  Tennis:     ["Singles Player", "Doubles Player"],
};

const STATUSES    = ["Recommended", "Under Review", "Shortlisted", "Rejected"];
const NATIONALITIES = ["Algerian", "Moroccan", "Tunisian", "Egyptian", "French", "Spanish", "Brazilian", "Argentinian", "American", "Italian", "Other"];
const STRENGTHS_OPTIONS = ["Speed", "Finishing", "Positioning", "Passing", "Dribbling", "Heading", "Defending", "Leadership", "Vision", "Stamina", "Shooting", "Teamwork", "Agility", "Strength", "Decision Making"];

const defaultForm = {
  name:        "",
  sport:       "",
  position:    "",
  status:      "Under Review",
  age:         "",
  club:        "",
  nationality: "",
  rating:      5,
  potential:   5,
  strengths:   [],
};

export default function ScoutingModal({ open, onClose, onAddReport }) {
  const [form, setForm]   = useState(defaultForm);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val, ...(key === "sport" ? { position: "" } : {}) }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const toggleStrength = (s) =>
    set("strengths", form.strengths.includes(s)
      ? form.strengths.filter(x => x !== s)
      : form.strengths.length < 5 ? [...form.strengths, s] : form.strengths
    );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name     = "Name is required";
    if (!form.sport)       e.sport    = "Select a sport";
    if (!form.position)    e.position = "Select a position";
    if (!form.club.trim()) e.club     = "Club is required";
    if (!form.nationality) e.nationality = "Select nationality";
    if (!form.age || isNaN(form.age) || +form.age < 14 || +form.age > 45) e.age = "Valid age (14–45)";
    if (form.strengths.length === 0) e.strengths = "Pick at least one strength";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const initials = form.name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    onAddReport?.({
      id:          Date.now(),
      ...form,
      age:         Number(form.age),
      rating:      Number(form.rating),
      potential:   Number(form.potential),
      initials,
    });

    setForm(defaultForm);
    setErrors({});
    onClose();
  };

  const handleClose = () => { setForm(defaultForm); setErrors({}); onClose(); };

  const inputCls = (key) =>
    `w-full bg-slate-800/50 border rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600
     ${errors[key] ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20" : "border-slate-700 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"}`;

  const Field = ({ label, error, children, full }) => (
    <div className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      {children}
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-slate-800">
          <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-xl p-2">
            <FaMagnifyingGlass className="text-emerald-400" size={16} />
          </div>
          <div>
            <h2 className="font-black text-slate-100 text-lg uppercase tracking-widest">New Scout Report</h2>
            <p className="text-slate-500 text-xs">Add a new player to scouting database</p>
          </div>
          <button onClick={handleClose} className="ml-auto text-slate-600 hover:text-slate-300 hover:bg-slate-800 rounded-lg p-1.5 transition-all">✕</button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4 max-h-[62vh] overflow-y-auto">

          {/* Name */}
          <Field label="Full Name *" error={errors.name} full>
            <input className={inputCls("name")} placeholder="e.g. Youcef Atal" value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>

          {/* Sport */}
          <Field label="Sport *" error={errors.sport}>
            <select className={inputCls("sport")} value={form.sport} onChange={e => set("sport", e.target.value)}>
              <option value="">Select sport</option>
              {Object.keys(SPORTS_POSITIONS).map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>

          {/* Position */}
          <Field label="Position *" error={errors.position}>
            <select className={inputCls("position")} value={form.position} onChange={e => set("position", e.target.value)} disabled={!form.sport}>
              <option value="">Select position</option>
              {(SPORTS_POSITIONS[form.sport] || []).map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>

          {/* Age */}
          <Field label="Age *" error={errors.age}>
            <input type="number" className={inputCls("age")} placeholder="e.g. 21" min={14} max={45} value={form.age} onChange={e => set("age", e.target.value)} />
          </Field>

          {/* Club */}
          <Field label="Current Club *" error={errors.club}>
            <input className={inputCls("club")} placeholder="e.g. AC Roma Youth" value={form.club} onChange={e => set("club", e.target.value)} />
          </Field>

          {/* Nationality */}
          <Field label="Nationality *" error={errors.nationality} full>
            <select className={inputCls("nationality")} value={form.nationality} onChange={e => set("nationality", e.target.value)}>
              <option value="">Select nationality</option>
              {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
            </select>
          </Field>

          {/* Status */}
          <Field label="Status" full>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map(s => (
                <button key={s} type="button" onClick={() => set("status", s)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all
                    ${form.status === s
                      ? s === "Recommended" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : s === "Shortlisted" ? "bg-blue-500/20 border-blue-500 text-blue-400"
                      : s === "Rejected"    ? "bg-red-500/20 border-red-500 text-red-400"
                      :                       "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                      : "border-slate-800 text-slate-600 hover:border-slate-700"}`}>
                  {s}
                </button>
              ))}
            </div>
          </Field>

          {/* Rating slider */}
          <Field label="Current Rating" full>
            <div className="flex items-center gap-4">
              <input type="range" min={0} max={10} step={0.1} value={form.rating}
                onChange={e => set("rating", e.target.value)} className="flex-1 accent-amber-500" />
              <span className={`text-sm font-black w-8 text-center
                ${+form.rating >= 8 ? "text-emerald-400" : +form.rating >= 6 ? "text-amber-400" : "text-red-400"}`}>
                {Number(form.rating).toFixed(1)}
              </span>
            </div>
          </Field>

          {/* Potential slider */}
          <Field label="Potential" full>
            <div className="flex items-center gap-4">
              <input type="range" min={0} max={10} step={0.1} value={form.potential}
                onChange={e => set("potential", e.target.value)} className="flex-1 accent-emerald-500" />
              <span className={`text-sm font-black w-8 text-center
                ${+form.potential >= 8 ? "text-emerald-400" : +form.potential >= 6 ? "text-amber-400" : "text-red-400"}`}>
                {Number(form.potential).toFixed(1)}
              </span>
            </div>
          </Field>

          {/* Strengths */}
          <Field label={`Key Strengths * (max 5 — ${form.strengths.length}/5)`} error={errors.strengths} full>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS_OPTIONS.map(s => (
                <button key={s} type="button" onClick={() => toggleStrength(s)}
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all
                    ${form.strengths.includes(s)
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400"
                      : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"}`}>
                  {s}
                </button>
              ))}
            </div>
          </Field>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
          <button onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all">
            Add Report
          </button>
        </div>

      </div>
    </div>
  );
}