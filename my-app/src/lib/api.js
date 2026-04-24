const API_BASE = "http://localhost:8080";

async function apiFetch(url, options = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };
    if (options.body) headers['Content-Type'] = 'application/json';

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) return {};
    return response.json();
}

export const api = {
    // 1. Notifications & Alerts
    getNotifications: () => apiFetch(`${API_BASE}/notifications`),
    createNotification: (data) => apiFetch(`${API_BASE}/notifications`, { method: 'POST', body: JSON.stringify(data) }),
    updateNotification: (id, data) => apiFetch(`${API_BASE}/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteNotification: (id) => apiFetch(`${API_BASE}/notifications/${id}`, { method: 'DELETE' }),
    markNotificationRead: (id) => apiFetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' }),
    getAlerts: () => apiFetch(`${API_BASE}/alerts`),
    createAlert: (data) => apiFetch(`${API_BASE}/alerts`, { method: 'POST', body: JSON.stringify(data) }),
    updateAlert: (id, data) => apiFetch(`${API_BASE}/alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAlert: (id) => apiFetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' }),
    resolveAlert: (id) => apiFetch(`${API_BASE}/alerts/resolve?id=${id}`, { method: 'PATCH' }),
    acknowledgeAlert: (id) => apiFetch(`${API_BASE}/alerts/acknowledge?id=${id}`, { method: 'PATCH' }),

    // 2. Medical Module (Connected to Medical.jsx)
    medical: {
        Injuries: {
            get: () => apiFetch(`${API_BASE}/injuries`),
            getById: (id) => apiFetch(`${API_BASE}/injuries/${id}`),
            post: (data) => apiFetch(`${API_BASE}/injuries`, { method: 'POST', body: JSON.stringify(data) }),
            put: (id, data) => apiFetch(`${API_BASE}/injuries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`${API_BASE}/injuries/${id}`, { method: 'DELETE' })
        },
        Diagnoses: {
            get: () => apiFetch(`${API_BASE}/diagnoses`),
            getById: (id) => apiFetch(`${API_BASE}/diagnoses/${id}`),
            post: (data) => apiFetch(`${API_BASE}/diagnoses`, { method: 'POST', body: JSON.stringify(data) }),
            put: (id, data) => apiFetch(`${API_BASE}/diagnoses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`${API_BASE}/diagnoses/${id}`, { method: 'DELETE' })
        },
        Treatments: {
            get: () => apiFetch(`${API_BASE}/treatments`),
            getById: (id) => apiFetch(`${API_BASE}/treatments/${id}`),
            post: (data) => apiFetch(`${API_BASE}/treatments`, { method: 'POST', body: JSON.stringify(data) }),
            put: (id, data) => apiFetch(`${API_BASE}/treatments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`${API_BASE}/treatments/${id}`, { method: 'DELETE' })
        },
        Fitness: {
            get: () => apiFetch(`${API_BASE}/fitness-tests`),
            getById: (id) => apiFetch(`${API_BASE}/fitness-tests/${id}`),
            getBySport: () => apiFetch(`${API_BASE}/fitness-tests/by-sport`),
            post: (data) => apiFetch(`${API_BASE}/fitness-tests`, { method: 'POST', body: JSON.stringify(data) }),
            put: (id, data) => apiFetch(`${API_BASE}/fitness-tests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`${API_BASE}/fitness-tests/${id}`, { method: 'DELETE' })
        },
        Rehabilitation: {
            get: () => apiFetch(`${API_BASE}/rehabilitations`),
            getById: (id) => apiFetch(`${API_BASE}/rehabilitations/${id}`),
            post: (data) => apiFetch(`${API_BASE}/rehabilitations`, { method: 'POST', body: JSON.stringify(data) }),
            put: (id, data) => apiFetch(`${API_BASE}/rehabilitations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`${API_BASE}/rehabilitations/${id}`, { method: 'DELETE' })
        },
        Recovery: {
            get: () => apiFetch(`${API_BASE}/recovery-programs`),
            getById: (id) => apiFetch(`${API_BASE}/recovery-programs/${id}`),
            post: (data) => apiFetch(`${API_BASE}/recovery-programs`, { method: 'POST', body: JSON.stringify(data) }),
            put: (id, data) => apiFetch(`${API_BASE}/recovery-programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`${API_BASE}/recovery-programs/${id}`, { method: 'DELETE' })
        },
        Training: {
            get: () => apiFetch(`${API_BASE}/training-loads`),
            getById: (id) => apiFetch(`${API_BASE}/training-loads/${id}`),
            post: (data) => apiFetch(`${API_BASE}/training-loads`, { method: 'POST', body: JSON.stringify(data) }),
            put: (id, data) => apiFetch(`${API_BASE}/training-loads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id) => apiFetch(`${API_BASE}/training-loads/${id}`, { method: 'DELETE' })
        }
    },

    // 3. Matches & Events
    getMatches: () => apiFetch(`${API_BASE}/matches`),
    createMatch: (data) => apiFetch(`${API_BASE}/matches`, { method: 'POST', body: JSON.stringify(data) }),
    updateMatch: (id, data) => apiFetch(`${API_BASE}/matches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMatch: (id) => apiFetch(`${API_BASE}/matches/${id}`, { method: 'DELETE' }),
    getMatchFormations: () => apiFetch(`${API_BASE}/match-formations`),
    getMatchFormationById: (id) => apiFetch(`${API_BASE}/match-formations/${id}`),
    createMatchFormation: (data) => apiFetch(`${API_BASE}/match-formations`, { method: 'POST', body: JSON.stringify(data) }),
    updateMatchFormation: (id, data) => apiFetch(`${API_BASE}/match-formations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMatchFormation: (id) => apiFetch(`${API_BASE}/match-formations/${id}`, { method: 'DELETE' }),

    getMatchLineups: () => apiFetch(`${API_BASE}/match-lineups`),
    getMatchLineupById: (id) => apiFetch(`${API_BASE}/match-lineups/${id}`),
    createMatchLineup: (data) => apiFetch(`${API_BASE}/match-lineups`, { method: 'POST', body: JSON.stringify(data) }),
    updateMatchLineup: (id, data) => apiFetch(`${API_BASE}/match-lineups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMatchLineup: (id) => apiFetch(`${API_BASE}/match-lineups/${id}`, { method: 'DELETE' }),

    getMatchEvents: () => apiFetch(`${API_BASE}/match-events`),
    getMatchEventById: (id) => apiFetch(`${API_BASE}/match-events/${id}`),
    createMatchEvent: (data) => apiFetch(`${API_BASE}/match-events`, { method: 'POST', body: JSON.stringify(data) }),
    updateMatchEvent: (id, data) => apiFetch(`${API_BASE}/match-events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMatchEvent: (id) => apiFetch(`${API_BASE}/match-events/${id}`, { method: 'DELETE' }),

    getMatchPerformanceReviews: () => apiFetch(`${API_BASE}/match-performance-reviews`),
    getMatchPerformanceReviewById: (id) => apiFetch(`${API_BASE}/match-performance-reviews/${id}`),
    createMatchPerformanceReview: (data) => apiFetch(`${API_BASE}/match-performance-reviews`, { method: 'POST', body: JSON.stringify(data) }),
    updateMatchPerformanceReview: (id, data) => apiFetch(`${API_BASE}/match-performance-reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMatchPerformanceReview: (id) => apiFetch(`${API_BASE}/match-performance-reviews/${id}`, { method: 'DELETE' }),


    // 4. Staff, Scouts & Managers
    getStaff: () => apiFetch(`${API_BASE}/staff`),
    createStaff: (data) => apiFetch(`${API_BASE}/staff`, { method: 'POST', body: JSON.stringify(data) }),
    updateStaff: (id, data) => apiFetch(`${API_BASE}/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStaff: (id) => apiFetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' }),
    getScouts: () => apiFetch(`${API_BASE}/scouts`),
    createScout: (data) => apiFetch(`${API_BASE}/scouts`, { method: 'POST', body: JSON.stringify(data) }),
    updateScout: (id, data) => apiFetch(`${API_BASE}/scouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteScout: (id) => apiFetch(`${API_BASE}/scouts/${id}`, { method: 'DELETE' }),
    getSportManagers: () => apiFetch(`${API_BASE}/sport-managers`),
    createSportManager: (data) => apiFetch(`${API_BASE}/sport-managers`, { method: 'POST', body: JSON.stringify(data) }),
    updateSportManager: (id, data) => apiFetch(`${API_BASE}/sport-managers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSportManager: (id) => apiFetch(`${API_BASE}/sport-managers/${id}`, { method: 'DELETE' }),

    // 5. Training Module
    getTrainingSessions: () => apiFetch(`${API_BASE}/training-sessions`),
    createTrainingSession: (data) => apiFetch(`${API_BASE}/training-sessions`, { method: 'POST', body: JSON.stringify(data) }),
    updateTrainingSession: (id, data) => apiFetch(`${API_BASE}/training-sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrainingSession: (id) => apiFetch(`${API_BASE}/training-sessions/${id}`, { method: 'DELETE' }),
    getTrainingPlans: () => apiFetch(`${API_BASE}/training-plans`),
    createTrainingPlan: (data) => apiFetch(`${API_BASE}/training-plans`, { method: 'POST', body: JSON.stringify(data) }),
    updateTrainingPlan: (id, data) => apiFetch(`${API_BASE}/training-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrainingPlan: (id) => apiFetch(`${API_BASE}/training-plans/${id}`, { method: 'DELETE' }),
    getTrainingDrills: () => apiFetch(`${API_BASE}/training-drills`),
    updateTrainingDrill: (id, data) => apiFetch(`${API_BASE}/training-drills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getAttendance: () => apiFetch(`${API_BASE}/attendance`),
    updateAttendance: (id, data) => apiFetch(`${API_BASE}/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // 6. Teams & Players Module
    getTeams: () => apiFetch(`${API_BASE}/teams`),
    getTeamById: (id) => apiFetch(`${API_BASE}/teams/${id}`),
    createTeam: (data) => apiFetch(`${API_BASE}/teams`, { method: 'POST', body: JSON.stringify(data) }),
    updateTeam: (id, data) => apiFetch(`${API_BASE}/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTeam: (id) => apiFetch(`${API_BASE}/teams/${id}`, { method: 'DELETE' }),

    getSports: () => apiFetch(`${API_BASE}/sports`),
    getSportById: (id) => apiFetch(`${API_BASE}/sports/${id}`),
    createSport: (data) => apiFetch(`${API_BASE}/sports`, { method: 'POST', body: JSON.stringify(data) }),
    updateSport: (id, data) => apiFetch(`${API_BASE}/sports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSport: (id) => apiFetch(`${API_BASE}/sports/${id}`, { method: 'DELETE' }),
    getSportsByType: (type) => apiFetch(`${API_BASE}/sports/type/${type}`),

    getRosters: () => apiFetch(`${API_BASE}/rosters`),
    getRosterById: (id) => apiFetch(`${API_BASE}/rosters/${id}`),
    createRoster: (data) => apiFetch(`${API_BASE}/rosters`, { method: 'POST', body: JSON.stringify(data) }),
    updateRoster: (id, data) => apiFetch(`${API_BASE}/rosters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRoster: (id) => apiFetch(`${API_BASE}/rosters/${id}`, { method: 'DELETE' }),

    getPlayers: (status = 'AVAILABLE') => apiFetch(`${API_BASE}/players?status=${status}`),
    getPlayerById: (id) => apiFetch(`${API_BASE}/players/${id}`),
    updatePlayer: (id, data) => apiFetch(`${API_BASE}/players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updatePlayerStatus: (id, status) => apiFetch(`${API_BASE}/players/${id}/status?status=${status}`, { method: 'PUT' }),
    assignRosterToPlayer: (id, rosterId) => apiFetch(`${API_BASE}/players/${id}/assign-roster/${rosterId}`, { method: 'PUT' }),
    assignContractToPlayer: (id, contractId) => apiFetch(`${API_BASE}/players/${id}/assign-contract/${contractId}`, { method: 'PUT' }),
    getNationalTeams: () => apiFetch(`${API_BASE}/national-teams`),
    createNationalTeam: (data) => apiFetch(`${API_BASE}/national-teams`, { method: 'POST', body: JSON.stringify(data) }),
    updateNationalTeam: (id, data) => apiFetch(`${API_BASE}/national-teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteNationalTeam: (id) => apiFetch(`${API_BASE}/national-teams/${id}`, { method: 'DELETE' }),

    getTeams: () => apiFetch(`${API_BASE}/teams`),
    createTeam: (data) => apiFetch(`${API_BASE}/teams`, { method: 'POST', body: JSON.stringify(data) }),
    updateTeam: (id, data) => apiFetch(`${API_BASE}/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTeam: (id) => apiFetch(`${API_BASE}/teams/${id}`, { method: 'DELETE' }),

    getSports: () => apiFetch(`${API_BASE}/sports`),
    getSportById: (id) => apiFetch(`${API_BASE}/sports/${id}`),
    createSport: (data) => apiFetch(`${API_BASE}/sports`, { method: 'POST', body: JSON.stringify(data) }),
    updateSport: (id, data) => apiFetch(`${API_BASE}/sports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSport: (id) => apiFetch(`${API_BASE}/sports/${id}`, { method: 'DELETE' }),
    getSportsByType: (type) => apiFetch(`${API_BASE}/sports/type/${type}`),

    // 7. Transfers, Contracts & Callups
    getIncomingTransfers: () => apiFetch(`${API_BASE}/player-transfers-incoming`),
    getIncomingTransferById: (id) => apiFetch(`${API_BASE}/player-transfers-incoming/${id}`),
    createIncomingTransfer: (data) => apiFetch(`${API_BASE}/player-transfers-incoming`, { method: 'POST', body: JSON.stringify(data) }),
    updateIncomingTransfer: (id, data) => apiFetch(`${API_BASE}/player-transfers-incoming/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteIncomingTransfer: (id) => apiFetch(`${API_BASE}/player-transfers-incoming/${id}`, { method: 'DELETE' }),

    getOutgoingTransfers: () => apiFetch(`${API_BASE}/player-transfers-outgoing`),
    getOutgoingTransferById: (id) => apiFetch(`${API_BASE}/player-transfers-outgoing/${id}`),
    createOutgoingTransfer: (data) => apiFetch(`${API_BASE}/player-transfers-outgoing`, { method: 'POST', body: JSON.stringify(data) }),
    updateOutgoingTransfer: (id, data) => apiFetch(`${API_BASE}/player-transfers-outgoing/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteOutgoingTransfer: (id) => apiFetch(`${API_BASE}/player-transfers-outgoing/${id}`, { method: 'DELETE' }),

    getPlayerContracts: () => apiFetch(`${API_BASE}/player-contracts`),
    getPlayerContractById: (id) => apiFetch(`${API_BASE}/player-contracts/${id}`),
    createPlayerContract: (data) => apiFetch(`${API_BASE}/player-contracts`, { method: 'POST', body: JSON.stringify(data) }),
    updatePlayerContract: (id, data) => apiFetch(`${API_BASE}/player-contracts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlayerContract: (id) => apiFetch(`${API_BASE}/player-contracts/${id}`, { method: 'DELETE' }),

    getCallups: () => apiFetch(`${API_BASE}/player-callups`),
    getCallupById: (id) => apiFetch(`${API_BASE}/player-callups/${id}`),
    createCallup: (data) => apiFetch(`${API_BASE}/player-callups`, { method: 'POST', body: JSON.stringify(data) }),
    updateCallup: (id, data) => apiFetch(`${API_BASE}/player-callups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCallup: (id) => apiFetch(`${API_BASE}/player-callups/${id}`, { method: 'DELETE' }),

    getTrainingSessions: () => apiFetch(`${API_BASE}/training-sessions`),
    getTrainingSessionById: (id) => apiFetch(`${API_BASE}/training-sessions/${id}`),
    createTrainingSession: (data) => apiFetch(`${API_BASE}/training-sessions`, { method: 'POST', body: JSON.stringify(data) }),
    updateTrainingSession: (id, data) => apiFetch(`${API_BASE}/training-sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrainingSession: (id) => apiFetch(`${API_BASE}/training-sessions/${id}`, { method: 'DELETE' }),

    getTrainingPlans: () => apiFetch(`${API_BASE}/training-plans`),
    getTrainingPlanById: (id) => apiFetch(`${API_BASE}/training-plans/${id}`),
    createTrainingPlan: (data) => apiFetch(`${API_BASE}/training-plans`, { method: 'POST', body: JSON.stringify(data) }),
    updateTrainingPlan: (id, data) => apiFetch(`${API_BASE}/training-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrainingPlan: (id) => apiFetch(`${API_BASE}/training-plans/${id}`, { method: 'DELETE' }),

    getTrainingDrills: () => apiFetch(`${API_BASE}/training-drills`),
    getTrainingDrillById: (id) => apiFetch(`${API_BASE}/training-drills/${id}`),
    createTrainingDrill: (data) => apiFetch(`${API_BASE}/training-drills`, { method: 'POST', body: JSON.stringify(data) }),
    updateTrainingDrill: (id, data) => apiFetch(`${API_BASE}/training-drills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrainingDrill: (id) => apiFetch(`${API_BASE}/training-drills/${id}`, { method: 'DELETE' }),

    getAttendance: () => apiFetch(`${API_BASE}/training-attendance`),
    getAttendanceById: (id) => apiFetch(`${API_BASE}/training-attendance/${id}`),
    createAttendance: (data) => apiFetch(`${API_BASE}/training-attendance`, { method: 'POST', body: JSON.stringify(data) }),
    updateAttendance: (id, data) => apiFetch(`${API_BASE}/training-attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAttendance: (id) => apiFetch(`${API_BASE}/training-attendance/${id}`, { method: 'DELETE' }),

    getPlayerMatchStatistics: () => apiFetch(`${API_BASE}/player-match-statistics`),
    getPlayerMatchStatisticById: (id) => apiFetch(`${API_BASE}/player-match-statistics/${id}`),
    getPlayerMatchStatisticsBySport: () => apiFetch(`${API_BASE}/player-match-statistics/by-sport`),
    getPlayerMatchStatisticsByMatch: (matchId) => apiFetch(`${API_BASE}/player-match-statistics/by-match/${matchId}`),
    createPlayerMatchStatistic: (data) => apiFetch(`${API_BASE}/player-match-statistics`, { method: 'POST', body: JSON.stringify(data) }),
    updatePlayerMatchStatistic: (id, data) => apiFetch(`${API_BASE}/player-match-statistics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlayerMatchStatistic: (id) => apiFetch(`${API_BASE}/player-match-statistics/${id}`, { method: 'DELETE' }),

    getPlayerTrainingAssessments: () => apiFetch(`${API_BASE}/player-training-assessments`),
    getPlayerTrainingAssessmentById: (id) => apiFetch(`${API_BASE}/player-training-assessments/${id}`),
    createPlayerTrainingAssessment: (data) => apiFetch(`${API_BASE}/player-training-assessments`, { method: 'POST', body: JSON.stringify(data) }),
    updatePlayerTrainingAssessment: (id, data) => apiFetch(`${API_BASE}/player-training-assessments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlayerTrainingAssessment: (id) => apiFetch(`${API_BASE}/player-training-assessments/${id}`, { method: 'DELETE' }),
    // 13. Messaging
    getAllMessages: () => apiFetch(`${API_BASE}/messages`),
    getMessageById: (id) => apiFetch(`${API_BASE}/messages/${id}`),
    getMessagesBySender: (keycloakId) => apiFetch(`${API_BASE}/messages/sender/${keycloakId}`),
    getMessagesByRecipient: (keycloakId) => apiFetch(`${API_BASE}/messages/recipient/${keycloakId}`),
    createMessage: (data) => apiFetch(`${API_BASE}/messages`, { method: 'POST', body: JSON.stringify(data) }),
    updateMessage: (id, data) => apiFetch(`${API_BASE}/messages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMessage: (id) => apiFetch(`${API_BASE}/messages/${id}`, { method: 'DELETE' }),

    getTrainingAnalytics: () => apiFetch(`${API_BASE}/training-analytics`),
    createTrainingAnalytics: (data) => apiFetch(`${API_BASE}/training-analytics`, { method: 'POST', body: JSON.stringify(data) }),
    updateTrainingAnalytics: (id, data) => apiFetch(`${API_BASE}/training-analytics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrainingAnalytics: (id) => apiFetch(`${API_BASE}/training-analytics/${id}`, { method: 'DELETE' }),

    getTeamAnalytics: () => apiFetch(`${API_BASE}/team-analytics`),
    getTeamAnalyticsBySport: () => apiFetch(`${API_BASE}/team-analytics/by-sport`),
    createTeamAnalytics: (data) => apiFetch(`${API_BASE}/team-analytics`, { method: 'POST', body: JSON.stringify(data) }),
    updateTeamAnalytics: (id, data) => apiFetch(`${API_BASE}/team-analytics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTeamAnalytics: (id) => apiFetch(`${API_BASE}/team-analytics/${id}`, { method: 'DELETE' }),

    getPlayerAnalytics: () => apiFetch(`${API_BASE}/player-analytics`),
    getPlayerAnalyticsBySport: () => apiFetch(`${API_BASE}/player-analytics/by-sport`),
    createPlayerAnalytics: (data) => apiFetch(`${API_BASE}/player-analytics`, { method: 'POST', body: JSON.stringify(data) }),
    updatePlayerAnalytics: (id, data) => apiFetch(`${API_BASE}/player-analytics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlayerAnalytics: (id) => apiFetch(`${API_BASE}/player-analytics/${id}`, { method: 'DELETE' }),

    getMatchAnalyses: () => apiFetch(`${API_BASE}/match-analyses`),
    getMatchAnalysesBySport: () => apiFetch(`${API_BASE}/match-analyses/by-sport`),
    createMatchAnalysis: (data) => apiFetch(`${API_BASE}/match-analyses`, { method: 'POST', body: JSON.stringify(data) }),
    updateMatchAnalysis: (id, data) => apiFetch(`${API_BASE}/match-analyses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMatchAnalysis: (id) => apiFetch(`${API_BASE}/match-analyses/${id}`, { method: 'DELETE' }),

    // 8. Scouting & Outer Entities
    getScoutReports: () => apiFetch(`${API_BASE}/scout-reports`),
    createScoutReport: (data) => apiFetch(`${API_BASE}/scout-reports`, { method: 'POST', body: JSON.stringify(data) }),
    updateScoutReport: (id, data) => apiFetch(`${API_BASE}/scout-reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteScoutReport: (id) => apiFetch(`${API_BASE}/scout-reports/${id}`, { method: 'DELETE' }),

    getOuterPlayers: () => apiFetch(`${API_BASE}/outer-players`),
    getOuterPlayerById: (id) => apiFetch(`${API_BASE}/outer-players/${id}`),
    createOuterPlayer: (data) => apiFetch(`${API_BASE}/outer-players`, { method: 'POST', body: JSON.stringify(data) }),
    addOuterPlayer: (data) => apiFetch(`${API_BASE}/outer-players`, { method: 'POST', body: JSON.stringify(data) }),
    updateOuterPlayer: (id, data) => apiFetch(`${API_BASE}/outer-players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteOuterPlayer: (id) => apiFetch(`${API_BASE}/outer-players/${id}`, { method: 'DELETE' }),

    getOuterTeams: () => apiFetch(`${API_BASE}/outer-teams`),
    getOuterTeamById: (id) => apiFetch(`${API_BASE}/outer-teams/${id}`),
    createOuterTeam: (data) => apiFetch(`${API_BASE}/outer-teams`, { method: 'POST', body: JSON.stringify(data) }),
    updateOuterTeam: (id, data) => apiFetch(`${API_BASE}/outer-teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteOuterTeam: (id) => apiFetch(`${API_BASE}/outer-teams/${id}`, { method: 'DELETE' }),
    getSponsorOffers: () => apiFetch(`${API_BASE}/sponsor-offers`),
    createSponsorOffer: (data) => apiFetch(`${API_BASE}/sponsor-offers`, { method: 'POST', body: JSON.stringify(data) }),
    updateSponsorOffer: (id, data) => apiFetch(`${API_BASE}/sponsor-offers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSponsorOffer: (id) => apiFetch(`${API_BASE}/sponsor-offers/${id}`, { method: 'DELETE' }),
    getUsers: () => apiFetch(`${API_BASE}/users`),
    adminCreateUser: (data) => apiFetch(`${API_BASE}/users`, { method: 'POST', body: JSON.stringify(data) }),
    deleteUser: (id) => apiFetch(`${API_BASE}/users/${id}`, { method: 'DELETE' }),
    getTeamAnalytics: () => apiFetch(`${API_BASE}/team-analytics`),
    getMatchAnalyses: () => apiFetch(`${API_BASE}/match-analyses`),
    getRosters: () => apiFetch(`${API_BASE}/rosters`),
};