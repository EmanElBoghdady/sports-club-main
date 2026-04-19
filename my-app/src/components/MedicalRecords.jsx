"use client";
import { useState, useEffect } from "react";
import { INJURY_TYPES, INJURY_SEVERITY, INJURY_STATUS_LIST, FITNESS_TEST_TYPES, SPORTS, TREATMENT_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import { FormModal, StatusBadge, SportBadge, PageHeader, AddButton, ProgressBar, Toast, EmptyState } from "@/src/components/shared/SharedComponents";

const SEV_COLOR = { 
    MINOR: "text-emerald-600 bg-emerald-50 border-emerald-200", 
    MODERATE: "text-amber-600 bg-amber-50 border-amber-200", 
    SEVERE: "text-orange-600 bg-orange-50 border-orange-200", 
    CRITICAL: "text-red-600 bg-red-50 border-red-200" 
};

// ... (الحقول ثابتة كما هي في الكود الخاص بكِ)

const STEPS = [
    ["injuries", "1. Injury"], ["diagnoses", "2. Diagnosis"], 
    ["treatments", "3. Treatment"], ["rehab", "4. Rehabilitation"], 
    ["fitness", "5. Fitness Test"]
];

export default function MedicalRecords() {
    const [tab, setTab] = useState("injuries");
    const [data, setData] = useState({ injuries: [], diagnoses: [], treatments: [], rehabs: [], fitness: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    // 1. جلب البيانات بناءً على التبويب النشط
    const loadCurrentTab = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === "injuries") res = await api.getInjuries();
            else if (tab === "diagnoses") res = await api.getDiagnoses();
            else if (tab === "treatments") res = await api.getTreatments();
            else if (tab === "rehab") res = await api.getRehabs();
            else if (tab === "fitness") res = await api.getFitnessTests();
            
            setData(prev => ({ ...prev, [tab]: Array.isArray(res) ? res : res?.content || [] }));
        } catch (err) {
            setToast({ msg: "Failed to fetch records", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCurrentTab();
    }, [tab]);

    // 2. معالجة الحفظ لكل نوع
    const handleSave = async (form) => {
        try {
            if (tab === "injuries") await api.createInjury(form);
            else if (tab === "diagnoses") await api.createDiagnosis(form);
            else if (tab === "treatments") await api.createTreatment(form);
            else if (tab === "rehab") await api.createRehab(form);
            else if (tab === "fitness") await api.createFitnessTest(form);
            
            setToast({ msg: "Record saved successfully" });
            setShowModal(false);
            loadCurrentTab();
        } catch (err) {
            setToast({ msg: "Error saving record", type: "error" });
        }
    };

    return (
        <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
            <PageHeader
                title="Medical Center"
                subtitle="Player Health & Performance Pipeline"
                action={<AddButton label="+ New Record" onClick={() => setShowModal(true)} />}
            />

            {/* Pipeline Navigation */}
            <div className="flex mb-8 bg-slate-900/50 p-1 rounded-xl border border-slate-800 shadow-inner">
                {STEPS.map(([k, l]) => (
                    <button key={k} onClick={() => setTab(k)}
                        className={`flex-1 text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg ${tab === k ? "bg-emerald-500 text-slate-950 shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        {l.split(". ")[1]}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-slate-600 font-black text-xs tracking-widest uppercase">Fetching medical files...</div>
            ) : (
                <div className="space-y-4">
                    {/* Render Content Based on Tab */}
                    {tab === "injuries" && data.injuries.map(inj => (
                        <div key={inj.id} className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 border-l-4 hover:bg-slate-900/60 transition-all"
                            style={{ borderLeftColor: inj.severity === "CRITICAL" ? "#ef4444" : inj.severity === "SEVERE" ? "#f97316" : "#10b981" }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex gap-2 mb-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${SEV_COLOR[inj.severity]}`}>{inj.severity}</span>
                                        <StatusBadge status={inj.status} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-100">{inj.injuredBodyPart}</h3>
                                    <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-tighter">
                                        📅 Reported: {inj.injuryDate} | 🔄 Est. Return: {inj.expectedRecoveryDate}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Patient ID</p>
                                    <p className="font-mono text-xs text-slate-400">{inj.playerKeycloakId?.slice(0, 8)}...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* ... (باقي التبويبات تتبع نفس النمط باستخدام بيانات من data[tab]) ... */}
                    
                    {data[tab]?.length === 0 && <EmptyState icon="📂" title={`No ${tab} records found`} />}
                </div>
            )}

            {showModal && (
                <FormModal
                    title={`New ${tab.slice(0, -1)} Record`}
                    fields={tab === "injuries" ? injuryFields : tab === "diagnoses" ? diagnosisFields : tab === "treatments" ? treatmentFields : tab === "rehab" ? rehabFields : fitnessFields}
                    onSubmit={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}