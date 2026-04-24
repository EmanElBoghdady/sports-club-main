export const MEDICAL_CONFIG = {
    Injuries: {
        label: "Injuries", icon: "local_hospital", fields: [
            { key: "playerId", label: "Player ID", type: "number" },
            { key: "injuryType", label: "Type", type: "select", options: ["MUSCLE_STRAIN", "LIGAMENT_TEAR", "FRACTURE"] },
            { key: "severity", label: "Severity", type: "select", options: ["MINOR", "MODERATE", "SEVERE"] },
            { key: "bodyPart", label: "Body Part" },
            { key: "injuryDate", label: "Date", type: "date" }
        ]
    },
    Training: {
        label: "Training Loads", icon: "fitness_center", fields: [
            { key: "playerId", label: "Player ID", type: "number" },
            { key: "durationMinutes", label: "Duration (Min)", type: "number" },
            { key: "intensity", label: "Intensity (1-10)", type: "number" },
            { key: "load", label: "Total Load", type: "number" },
            { key: "trainingType", label: "Type" }
        ]
    },
    Recovery: {
        label: "Recovery",
        icon: "self_improvement",
        fields: [
            { key: "rehabilitationId", label: "Rehabilitation ID", type: "number", placeholder: "Enter Injury ID" }, // الحقل المنقذ
            { key: "programName", label: "Program Name" },
            { key: "sessionsPerWeek", label: "Sessions/Week", type: "number" },
            { key: "durationMinutes", label: "Duration", type: "number" },
            { key: "startDate", label: "Start Date", type: "date" },
            { key: "endDate", label: "End Date", type: "date" }
        ]
    },
    Fitness: {
        label: "Fitness Tests",
        icon: "speed",
        fields: [

            { key: "teamId", label: "Team ID", type: "number" },
            { key: "testType", label: "Test Type", type: "select", options: ["VO2_MAX", "SPRINT", "AGILITY", "ENDURANCE"] },
            { key: "sportType", label: "Sport Type", type: "select", options: ["FOOTBALL", "BASKETBALL", "TENN"] },
            { key: "testName", label: "Test Name" },
            { key: "result", label: "Result Value", type: "number" },
            { key: "unit", label: "Unit (e.g. ml/kg/min)" },
            { key: "testDate", label: "Test Date", type: "date" }
        ]
    },
    Diagnoses: {
        label: "Diagnoses",
        icon: "description",
        fields: [
            { key: "injuryId", label: "Injury ID", type: "number", placeholder: "Must exist in Injuries" }, // الحقل المنقذ 2
            { key: "diagnosis", label: "Diagnosis Detail", type: "textarea" },
            { key: "medicalNotes", label: "Notes", type: "textarea" }
        ]
    },
    Treatments: {
        label: "Treatments",
        icon: "medication",
        fields: [
            { key: "injuryId", label: "Injury ID", type: "number" }, // الحقل المنقذ 3
            { key: "treatmentType", label: "Treatment" },
            { key: "dosage", label: "Dosage" },
            { key: "startDate", label: "Start Date", type: "date" }
        ]
    }, Rehabilitation: {
        label: "Rehabilitation",
        icon: "healing",
        fields: [
            { key: "injuryId", label: "Injury ID", type: "number" },
            { key: "playerId", label: "Player ID", type: "number" },
            { key: "physiotherapistId", label: "Physio ID", type: "number" },
            { key: "rehabPlan", label: "Rehab Plan", type: "textarea" },
            { key: "exercises", label: "Exercises List", type: "textarea" },
            { key: "durationWeeks", label: "Duration (Weeks)", type: "number" },
            { key: "status", label: "Status", type: "select", options: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] },
            { key: "startDate", label: "Start Date", type: "date" },
            { key: "expectedEndDate", label: "Expected End Date", type: "date" }
        ]
    },
};