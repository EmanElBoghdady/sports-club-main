// ─── API LAYER ─────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8080";
const SERVICES = {
    user: `${API_BASE}/api/user-management`,
    player: `${API_BASE}/api/player-management`,
    training: `${API_BASE}/api/training-match`,
    medical: `${API_BASE}/api/medical-fitness`,
    reports: `${API_BASE}/api/reports-analytics`,
    notifications: `${API_BASE}/api/notification-mail`,
};

let authToken = null;
export const setApiToken = (t) => { authToken = t; };

export async function apiFetch(url, opts = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...opts.headers,
    };
    const res = await fetch(url, { ...opts, headers });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    if (res.status === 204) return null;
    return res.json();
}

export const api = {
    // Users
    getUsers: () => apiFetch(`${SERVICES.user}/users`),
    createUser: (d) => apiFetch(`${SERVICES.user}/users`, { method: "POST", body: JSON.stringify(d) }),
    updateUser: (id, d) => apiFetch(`${SERVICES.user}/users/${id}`, { method: "PUT", body: JSON.stringify(d) }),
    deleteUser: (id) => apiFetch(`${SERVICES.user}/users/${id}`, { method: "DELETE" }),

    // Players
    getPlayers: () => apiFetch(`${SERVICES.user}/players`),
    createPlayer: (d) => apiFetch(`${SERVICES.user}/players`, { method: "POST", body: JSON.stringify(d) }),

    // Staff & Scouts
    getStaff: () => apiFetch(`${SERVICES.user}/staff`),
    createStaff: (d) => apiFetch(`${SERVICES.user}/staff`, { method: "POST", body: JSON.stringify(d) }),
    updateStaff: (id, d) => apiFetch(`${SERVICES.user}/staff/${id}`, { method: "PUT", body: JSON.stringify(d) }),
    getScouts: () => apiFetch(`${SERVICES.user}/scouts`),
    createScout: (d) => apiFetch(`${SERVICES.user}/scouts`, { method: "POST", body: JSON.stringify(d) }),

    // Teams & Sports
    getTeams: () => apiFetch(`${SERVICES.user}/teams`),
    createTeam: (d) => apiFetch(`${SERVICES.user}/teams`, { method: "POST", body: JSON.stringify(d) }),
    updateTeam: (id, d) => apiFetch(`${SERVICES.user}/teams/${id}`, { method: "PUT", body: JSON.stringify(d) }),
    deleteTeam: (id) => apiFetch(`${SERVICES.user}/teams/${id}`, { method: "DELETE" }),
    getSports: () => apiFetch(`${SERVICES.user}/sports`),
    createSport: (d) => apiFetch(`${SERVICES.user}/sports`, { method: "POST", body: JSON.stringify(d) }),
    updateSport: (id, d) => apiFetch(`${SERVICES.user}/sports/${id}`, { method: "PUT", body: JSON.stringify(d) }),
    deleteSport: (id) => apiFetch(`${SERVICES.user}/sports/${id}`, { method: "DELETE" }),
    getNationalTeams: () => apiFetch(`${SERVICES.user}/national-teams`),
    createNationalTeam: (d) => apiFetch(`${SERVICES.user}/national-teams`, { method: "POST", body: JSON.stringify(d) }),

    // Contracts & Transfers
    getContracts: () => apiFetch(`${SERVICES.player}/player-contracts`),
    createContract: (d) => apiFetch(`${SERVICES.player}/player-contracts`, { method: "POST", body: JSON.stringify(d) }),
    getIncomingTransfers: () => apiFetch(`${SERVICES.player}/player-transfers-incoming`),
    createIncomingTransfer: (d) => apiFetch(`${SERVICES.player}/player-transfers-incoming`, { method: "POST", body: JSON.stringify(d) }),
    getOutgoingTransfers: () => apiFetch(`${SERVICES.player}/player-transfers-outgoing`),
    createOutgoingTransfer: (d) => apiFetch(`${SERVICES.player}/player-transfers-outgoing`, { method: "POST", body: JSON.stringify(d) }),
    getRosters: () => apiFetch(`${SERVICES.player}/rosters`),
    createRoster: (d) => apiFetch(`${SERVICES.player}/rosters`, { method: "POST", body: JSON.stringify(d) }),

    // Scouting
    getCallups: () => apiFetch(`${SERVICES.player}/player-call-ups`),
    createCallup: (d) => apiFetch(`${SERVICES.player}/player-call-ups`, { method: "POST", body: JSON.stringify(d) }),
    getOuterPlayers: () => apiFetch(`${SERVICES.player}/outer-players`),
    createOuterPlayer: (d) => apiFetch(`${SERVICES.player}/outer-players`, { method: "POST", body: JSON.stringify(d) }),
    getOuterTeams: () => apiFetch(`${SERVICES.player}/outer-teams`),
    createOuterTeam: (d) => apiFetch(`${SERVICES.player}/outer-teams`, { method: "POST", body: JSON.stringify(d) }),

    // Training
    getTrainingSessions: () => apiFetch(`${SERVICES.training}/training-sessions`),
    createTrainingSession: (d) => apiFetch(`${SERVICES.training}/training-sessions`, { method: "POST", body: JSON.stringify(d) }),
    getTrainingPlans: () => apiFetch(`${SERVICES.training}/training-plans`),
    createTrainingPlan: (d) => apiFetch(`${SERVICES.training}/training-plans`, { method: "POST", body: JSON.stringify(d) }),
    getAttendance: () => apiFetch(`${SERVICES.training}/training-attendance`),
    createAttendance: (d) => apiFetch(`${SERVICES.training}/training-attendance`, { method: "POST", body: JSON.stringify(d) }),
    getDrills: () => apiFetch(`${SERVICES.training}/training-drills`),
    createDrill: (d) => apiFetch(`${SERVICES.training}/training-drills`, { method: "POST", body: JSON.stringify(d) }),
    createAssessment: (d) => apiFetch(`${SERVICES.training}/player-training-assessments`, { method: "POST", body: JSON.stringify(d) }),

    // Matches
    getMatches: () => apiFetch(`${SERVICES.training}/matches`),
    createMatch: (d) => apiFetch(`${SERVICES.training}/matches`, { method: "POST", body: JSON.stringify(d) }),
    createMatchEvent: (d) => apiFetch(`${SERVICES.training}/match-events`, { method: "POST", body: JSON.stringify(d) }),
    createLineup: (d) => apiFetch(`${SERVICES.training}/match-lineups`, { method: "POST", body: JSON.stringify(d) }),
    createFormation: (d) => apiFetch(`${SERVICES.training}/match-formations`, { method: "POST", body: JSON.stringify(d) }),

    // Medical
    getInjuries: () => apiFetch(`${SERVICES.medical}/injuries`),
    createInjury: (d) => apiFetch(`${SERVICES.medical}/injuries`, { method: "POST", body: JSON.stringify(d) }),
    createDiagnosis: (d) => apiFetch(`${SERVICES.medical}/diagnoses`, { method: "POST", body: JSON.stringify(d) }),
    createTreatment: (d) => apiFetch(`${SERVICES.medical}/treatments`, { method: "POST", body: JSON.stringify(d) }),
    createRehab: (d) => apiFetch(`${SERVICES.medical}/rehabilitations`, { method: "POST", body: JSON.stringify(d) }),
    getFitnessTests: () => apiFetch(`${SERVICES.medical}/fitness-tests`),
    createFitnessTest: (d) => apiFetch(`${SERVICES.medical}/fitness-tests`, { method: "POST", body: JSON.stringify(d) }),

    // Analytics & Reports
    createMatchAnalysis: (d) => apiFetch(`${SERVICES.reports}/match-analyses`, { method: "POST", body: JSON.stringify(d) }),
    createPlayerAnalytics: (d) => apiFetch(`${SERVICES.reports}/player-analytics`, { method: "POST", body: JSON.stringify(d) }),
    createTeamAnalytics: (d) => apiFetch(`${SERVICES.reports}/team-analytics`, { method: "POST", body: JSON.stringify(d) }),
    createTrainingAnalytics: (d) => apiFetch(`${SERVICES.reports}/training-analytics`, { method: "POST", body: JSON.stringify(d) }),

    // Sponsors
    getSponsorOffers: () => apiFetch(`${SERVICES.reports}/sponsor-contract-offers`),
    createSponsorOffer: (d) => apiFetch(`${SERVICES.reports}/sponsor-contract-offers`, { method: "POST", body: JSON.stringify(d) }),
    updateSponsorOffer: (id, d) => apiFetch(`${SERVICES.reports}/sponsor-contract-offers/${id}`, { method: "PUT", body: JSON.stringify(d) }),

    // Notifications & Messages
    getUnreadNotifications: (id) => apiFetch(`${SERVICES.notifications}/notifications/recipient/${id}/unread`),
    markNotificationRead: (id) => apiFetch(`${SERVICES.notifications}/notifications/${id}/read`, { method: "PATCH" }),
    acknowledgeAlert: (id, kid) => apiFetch(`${SERVICES.notifications}/alerts/${id}/acknowledge?acknowledgedByKeycloakId=${kid}`, { method: "PATCH" }),
    resolveAlert: (id) => apiFetch(`${SERVICES.notifications}/alerts/${id}/resolve`, { method: "PATCH" }),
    createAlert: (d) => apiFetch(`${SERVICES.notifications}/alerts`, { method: "POST", body: JSON.stringify(d) }),
    sendMessage: (d) => apiFetch(`${SERVICES.notifications}/messages`, { method: "POST", body: JSON.stringify(d) }),
};
