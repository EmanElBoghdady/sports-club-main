"use client";
import { useState } from "react";
import { MOCK, INJURY_TYPES, INJURY_SEVERITY, INJURY_STATUS_LIST, FITNESS_TEST_TYPES, SPORTS, TREATMENT_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, StatusBadge, SportBadge, PageHeader, AddButton, ProgressBar, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

const SEV_COLOR = { MINOR: "text-emerald-600 bg-emerald-50 border-emerald-200", MODERATE: "text-amber-600 bg-amber-50 border-amber-200", SEVERE: "text-orange-600 bg-orange-50 border-orange-200", CRITICAL: "text-red-600 bg-red-50 border-red-200" };

const injuryFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "reportedByDoctorKeycloakId", label: "Doctor ID", placeholder: "uuid..." },
    { key: "injuryType", label: "Injury Type", type: "select", options: INJURY_TYPES },
    { key: "severity", label: "Severity", type: "select", options: INJURY_SEVERITY },
    { key: "injuredBodyPart", label: "Body Part", placeholder: "Left hamstring" },
    { key: "injuryDate", label: "Injury Date", type: "date" },
    { key: "expectedRecoveryDate", label: "Expected Recovery", type: "date" },
    { key: "status", label: "Status", type: "select", options: INJURY_STATUS_LIST },
    { key: "description", label: "Description", type: "textarea", full: true },
];
const diagnosisFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "doctorKeycloakId", label: "Doctor ID", placeholder: "uuid..." },
    { key: "injuryId", label: "Injury ID", type: "number" },
    { key: "diagnosis", label: "Diagnosis", placeholder: "Grade II strain" },
    { key: "medicalNotes", label: "Notes", type: "textarea", full: true },
    { key: "recommendations", label: "Recommendations", type: "textarea", full: true },
];
const treatmentFields = [
    { key: "injuryId", label: "Injury ID", type: "number" },
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "treatmentType", label: "Treatment", type: "select", options: ["PHYSIOTHERAPY", "SURGERY", "MEDICATION", "REST", "ICE_THERAPY", "ULTRASOUND", "MASSAGE"] },
    { key: "status", label: "Status", type: "select", options: TREATMENT_STATUS },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "medications", label: "Medications", placeholder: "Anti-inflammatory" },
    { key: "description", label: "Description", type: "textarea", full: true },
];
const fitnessFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "teamId", label: "Team ID", type: "number" },
    { key: "testType", label: "Test Type", type: "select", options: FITNESS_TEST_TYPES },
    { key: "sportType", label: "Sport", type: "select", options: SPORTS },
    { key: "testDate", label: "Date", type: "datetime-local" },
    { key: "testName", label: "Test Name", placeholder: "VO2 Max Test" },
    { key: "result", label: "Result", type: "number" },
    { key: "unit", label: "Unit", placeholder: "ml/kg/min" },
    { key: "resultCategory", label: "Category", placeholder: "Excellent" },
];
const rehabFields = [
    { key: "playerKeycloakId", label: "Player ID", placeholder: "uuid..." },
    { key: "injuryId", label: "Injury ID", type: "number" },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "expectedEndDate", label: "Expected End", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "PAUSED"] },
    { key: "exercises", label: "Exercises", type: "textarea", full: true },
];

const STEPS = [["injuries", "1. Injury"], ["diagnoses", "2. Diagnosis"], ["treatments", "3. Treatment"], ["rehab", "4. Rehabilitation"], ["fitness", "5. Fitness Test"]];

export default function MedicalRecords() {
    const [tab, setTab] = useState("injuries");
    const [injuries, setInjuries] = useState(MOCK.injuries);
    const [diagnoses, setDiagnoses] = useState(MOCK.diagnoses);
    const [treatments, setTreatments] = useState(MOCK.treatments);
    const [rehabs, setRehabs] = useState(MOCK.rehabs);
    const [fitnessTests, setFitness] = useState(MOCK.fitnessTests);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSave = async (form) => {
        if (tab === "injuries") { await api.createInjury(form).catch(() => { }); setInjuries(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "diagnoses") { await api.createDiagnosis(form).catch(() => { }); setDiagnoses(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "treatments") { await api.createTreatment(form).catch(() => { }); setTreatments(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "rehab") { await api.createRehab(form).catch(() => { }); setRehabs(d => [...d, { ...form, id: Date.now() }]); }
        if (tab === "fitness") { await api.createFitnessTest(form).catch(() => { }); setFitness(d => [...d, { ...form, id: Date.now() }]); }
        setToast({ msg: "Medical record saved" }); setShowModal(false);
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Medical Records"
                subtitle="Injuries → Diagnosis → Treatment → Rehabilitation → Fitness"
                action={<AddButton label="+ New Record" onClick={() => setShowModal(true)} />}
            />

            {/* Pipeline steps */}
            <div className="flex mb-6 border-b border-slate-800">
                {STEPS.map(([k, l]) => (
                    <button key={k} onClick={() => setTab(k)}
                        className={`flex-1 text-center py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${tab === k ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
                    >{l}</button>
                ))}
            </div>

            {tab === "injuries" && (
                <div className="flex flex-col gap-3">
                    {injuries.map(inj => (
                        <div key={inj.id} className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-sm border-l-4 group hover:bg-slate-900/50 transition-all"
                            style={{ borderLeftColor: inj.severity === "CRITICAL" ? "#ef4444" : inj.severity === "SEVERE" ? "#f97316" : inj.severity === "MODERATE" ? "#f59e0b" : "#10b981" }}>
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <div className="flex gap-2 mb-3 flex-wrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${SEV_COLOR[inj.severity] || ""}`}>{inj.severity}</span>
                                        <StatusBadge status={inj.status} />
                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800 uppercase tracking-wider">{inj.injuryType?.replace(/_/g, " ")}</span>
                                    </div>
                                    <p className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">{inj.injuredBodyPart}</p>
                                    <p className="text-[11px] font-medium text-slate-500 mt-2 flex items-center gap-2">
                                        <span className="text-slate-600">📅</span> {inj.injuryDate}
                                        <span className="text-slate-700">|</span>
                                        <span className="text-slate-600">🔄 Recovery:</span> {inj.expectedRecoveryDate}
                                    </p>
                                </div>
                                <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-slate-800 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95">Update</button>
                            </div>
                        </div>
                    ))}
                    {injuries.length === 0 && <EmptyState icon="🩹" title="No injuries reported" />}
                </div>
            )}

            {tab === "diagnoses" && (
                <div className="bg-slate-950 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-slate-800 bg-slate-900/20">
                                {["Player", "Injury", "Diagnosis", "Recommendations"].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {diagnoses.map(d => (
                                    <tr key={d.id} className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 uppercase tracking-tighter">{d.playerKeycloakId?.slice(0, 12)}…</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">#ID-{d.injuryId}</td>
                                        <td className="px-6 py-4 font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{d.diagnosis}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium leading-relaxed">{d.recommendations}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {diagnoses.length === 0 && <EmptyState icon="🩺" title="No diagnoses yet" />}
                    </div>
                </div>
            )}

            {tab === "treatments" && (
                <div className="flex flex-col gap-3">
                    {treatments.map(t => (
                        <div key={t.id} className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-sm hover:bg-slate-900/50 transition-all group">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">{t.treatmentType}</span>
                                        <StatusBadge status={t.status} />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-400">Injury <span className="text-slate-200">#ID-{t.injuryId}</span> · <span className="text-[11px] text-slate-500 font-mono uppercase">{t.startDate}</span></p>
                                </div>
                                <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-slate-800 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95">Update</button>
                            </div>
                        </div>
                    ))}
                    {treatments.length === 0 && <EmptyState icon="💊" title="No treatments yet" />}
                </div>
            )}

            {tab === "rehab" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rehabs.map(r => (
                        <div key={r.id} className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between mb-4"><span className="font-bold text-slate-200 uppercase tracking-widest text-xs">Rehab Program <span className="text-emerald-500">#{r.id}</span></span><StatusBadge status={r.status} /></div>
                            <p className="text-xs font-bold text-slate-500 mb-5 tracking-tight">Injury Case Reference <span className="text-slate-400">#ID-{r.injuryId}</span></p>
                            {r.progressPercent && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Recovery progress</span><span className="text-emerald-400">{r.progressPercent}%</span></div>
                                    <ProgressBar value={r.progressPercent} />
                                </div>
                            )}
                        </div>
                    ))}
                    {rehabs.length === 0 && <EmptyState icon="🏃" title="No rehab programs yet" />}
                </div>
            )}

            {tab === "fitness" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fitnessTests.map(ft => (
                        <div key={ft.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-emerald-500/5 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                {ft.sportType && <span className="text-4xl text-white pointer-events-none uppercase">{ft.sportType[0]}</span>}
                            </div>
                            <div className="flex justify-between mb-4 flex-wrap gap-2 relative z-10">
                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">{ft.testType?.replace(/_/g, " ")}</span>
                                {ft.sportType && <SportBadge sport={ft.sportType} />}
                            </div>
                            <p className="font-black text-slate-100 text-lg mb-1 tracking-tight group-hover:text-emerald-400 transition-colors uppercase">{ft.testName}</p>
                            <p className="text-[10px] font-bold text-slate-500 mb-5 tracking-widest">📅 {ft.testDate?.split("T")[0]}</p>
                            {ft.result && (
                                <div className="mt-auto pt-4 border-t border-slate-900 flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-emerald-400 tracking-tighter">{ft.result}</p>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{ft.unit} <span className="text-slate-700 mx-1">/</span> {ft.resultCategory}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {fitnessTests.length === 0 && <EmptyState icon="💪" title="No fitness tests yet" />}
                </div>
            )}

            {showModal && (
                <FormModal
                    title={tab === "injuries" ? "Report Injury" : tab === "diagnoses" ? "Add Diagnosis" : tab === "treatments" ? "New Treatment" : tab === "rehab" ? "Start Rehab" : "Fitness Test"}
                    fields={tab === "injuries" ? injuryFields : tab === "diagnoses" ? diagnosisFields : tab === "treatments" ? treatmentFields : tab === "rehab" ? rehabFields : fitnessFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} onClose={() => setToast(null)} />}
        </div>
    );
}
