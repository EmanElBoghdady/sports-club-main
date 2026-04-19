const API_BASE = "http://127.0.0.1:8080";

async function apiFetch(url, options = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // 1. لازم نجهز الـ headers ونحط فيها التوكن من البداية
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }


    let res = await fetch(url, { ...options, headers });

    // لو التوكن انتهى (401)
    if (res.status === 401) {
        try {
            // 3. نداء دالة تجديد التوكن
            const newToken = await api.refreshToken();

            // 4. تحديث الـ headers بالتوكن الجديد وإعادة المحاولة
            headers["Authorization"] = `Bearer ${newToken}`;
            res = await fetch(url, { ...options, headers });
        } catch (err) {
            // لو الـ Refresh كمان فشل، وديه لصفحة الـ Login
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
    }


    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
}

export const api = {

    adminCreateUser: (data) => apiFetch(`${API_BASE}/auth/admin/create-user`, {
        method: "POST",
        body: JSON.stringify(data),
    }),

    // دالة الـ Logout
    logout: async () => {
        try {
            await apiFetch(`${API_BASE}/auth/logout`, { method: "POST" });
        } finally {
            // بنمسح التوكنز حتى لو السيرفر رد بـ Error عشان نخرج اليوزر
            localStorage.clear();
            window.location.href = "/login";
        }
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem("refreshToken"); // تأكدي إنك مخزناه وقت الـ Login
        const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });
        if (!response.ok) throw new Error("Session expired");
        const data = await response.json();

        // تحديث التوكنز في المتصفح
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.accessToken;
    },

    // Scouting

    getOuterPlayers: () => apiFetch(`${API_BASE}/outer-players`),
    /** 1. Medical & Fitness Service **/
    getInjuries: () => apiFetch(`${API_BASE}/injuries`),
    getDiagnoses: () => apiFetch(`${API_BASE}/diagnoses`),
    getTreatments: () => apiFetch(`${API_BASE}/treatments`),
    getFitnessTests: () => apiFetch(`${API_BASE}/fitness-tests`),
    getTrainingLoads: () => apiFetch(`${API_BASE}/training-loads`),

    /** 2. Training & Match Service **/
    getMatches: () => apiFetch(`${API_BASE}/matches`),
    getMatchEvents: (matchId) => apiFetch(`${API_BASE}/match-events/${matchId}`),
    getTrainingSessions: () => apiFetch(`${API_BASE}/training-sessions`),
    getTrainingPlans: () => apiFetch(`${API_BASE}/training-plans`),
    getAttendance: () => apiFetch(`${API_BASE}/training-attendance`),

    addMatch: (data) => apiFetch(`${API_BASE}/matches`, {
        method: "POST",
        body: JSON.stringify(data),
    }),

    /** 3. Player Management Service **/
    // ملاحظة: الـ GET مسموح للكل، الـ POST للـ ADMIN فقط
    // getPlayers: (status = "AVAILABLE") => apiFetch(`${API_BASE}/players?status=${status}`),

    addOuterPlayer: (data) => apiFetch(`${API_BASE}/outer-players`, {
        method: "POST",
        body: JSON.stringify(data),
    }),
    getTeams: () => apiFetch(`${API_BASE}/teams`),
    createTeam: (data) => apiFetch(`${API_BASE}/teams`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateTeam: (id, data) => apiFetch(`${API_BASE}/teams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    getSports: () => apiFetch(`${API_BASE}/sports`),
    createSport: (data) => apiFetch(`${API_BASE}/sports`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // --- National Teams Endpoints ---
    getNationalTeams: () => apiFetch(`${API_BASE}/national-teams`),
    createNationalTeam: (data) => apiFetch(`${API_BASE}/national-teams`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getPlayerContracts: () => apiFetch(`${API_BASE}/player-contracts`),



    getContracts: () => apiFetch(`${API_BASE}/contracts`),

    createContract: (data) => apiFetch(`${API_BASE}/contracts`, { method: 'POST', body: JSON.stringify(data) }),

    getIncomingTransfers: () => apiFetch(`${API_BASE}/transfers/incoming`),
    createIncomingTransfer: (data) => apiFetch(`${API_BASE}/transfers/incoming`, { method: 'POST', body: JSON.stringify(data) }),

    getOutgoingTransfers: () => apiFetch(`${API_BASE}/transfers/outgoing`),
    createOutgoingTransfer: (data) => apiFetch(`${API_BASE}/transfers/outgoing`, { method: 'POST', body: JSON.stringify(data) }),

    getRosters: () => apiFetch(`${API_BASE}/rosters`),
    createRoster: (data) => apiFetch(`${API_BASE}/rosters`, { method: 'POST', body: JSON.stringify(data) }),



    /** 4. User Management Service **/
    // جربي العنوان اللي قلتي عليه
    // في ملف api.js

    getUsers: (filters = {}) => {
        // بناء الـ Query String من الفلاتر (لو مفيش فلاتر هيبعت فاضي)
        const params = new URLSearchParams({
            firstName: filters.firstName || "",
            lastName: filters.lastName || "",
            email: filters.email || "",
            gender: filters.gender || "",
            role: filters.role || "",
            minAge: filters.minAge || "",
            maxAge: filters.maxAge || ""
        }).toString();

        return apiFetch(`${API_BASE}/users/search?${params}`);
    },
    getStaff: () => apiFetch(`${API_BASE}/staff`),
    getScouts: () => apiFetch(`${API_BASE}/scouts`),
    getSportManagers: () => apiFetch(`${API_BASE}/sport-managers`),
    getScoutReports: () => apiFetch(`${API_BASE}/scout-reports`),
    createStaff: (data) => apiFetch(`${API_BASE}/staff`, { method: 'POST', body: JSON.stringify(data) }),
    updateStaff: (id, data) => apiFetch(`${API_BASE}/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStaff: (id) => apiFetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' }),

    // Scouts Endpoints

    createScout: (data) => apiFetch(`${API_BASE}/scouts`, { method: 'POST', body: JSON.stringify(data) }),
    deleteScout: (id) => apiFetch(`${API_BASE}/scouts/${id}`, { method: 'DELETE' }),

    getCallups: () => apiFetch(`${API_BASE}/callups`),
    getOuterPlayers: () => apiFetch(`${API_BASE}/outer-players`),
    getOuterTeams: () => apiFetch(`${API_BASE}/outer-teams`),

    // تأكدي من وجود Create أيضاً
    createCallup: (data) => apiFetch(`${API_BASE}/callups`, { method: 'POST', body: JSON.stringify(data) }),

    /** 5. Notification & Mail Service **/
    getNotifications: () => apiFetch(`${API_BASE}/notifications`),
    getMessages: () => apiFetch(`${API_BASE}/messages`),
    getAlerts: () => apiFetch(`${API_BASE}/alerts`),
    getPosts: () => apiFetch(`${API_BASE}/posts`),
    createPost: (data) => apiFetch(`${API_BASE}/posts`, { method: 'POST', body: JSON.stringify(data) }),
    updatePost: (id, data) => apiFetch(`${API_BASE}/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getAlerts: () => apiFetch(`${API_BASE}/alerts`),
    acknowledgeAlert: (id) => apiFetch(`${API_BASE}/alerts/${id}/acknowledge`, { method: 'POST' }),
    resolveAlert: (id) => apiFetch(`${API_BASE}/alerts/${id}/resolve`, { method: 'POST' }),
    markNotificationRead: (id) => apiFetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' }),
    /** 6. Reports & Analytics Service **/
    getTeamAnalytics: () => apiFetch(`${API_BASE}/team-analytics`),
    getPlayerAnalytics: (id) => apiFetch(`${API_BASE}/player-analytics/${id}`),
    getMatchAnalyses: () => apiFetch(`${API_BASE}/match-analyses`),






    // Finance Service
    getTransactions: () => apiFetch(`${API_BASE}/finance/transactions`),
    getFinanceSummary: () => apiFetch(`${API_BASE}/finance/summary`),
    exportFinancePDF: () => apiFetch(`${API_BASE}/finance/export`, { method: 'GET' }),
    /** 7. Authentication **/
    login: (credentials) => apiFetch(`${API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify(credentials),
    }),
};