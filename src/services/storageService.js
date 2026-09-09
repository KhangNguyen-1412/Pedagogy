// Storage Keys for Local Backup & Instant Persistence
export const STORAGE_KEYS = {
    PROFILE: 'pedagogy_profile',
    PROGRAMS: 'pedagogy_programs',
    MODULES: 'pedagogy_modules',
    EVENTS: 'pedagogy_events',
    STUDY_LOGS: 'pedagogy_study_logs',
    RESOURCES: 'pedagogy_resources',
    IELTS_PROFILE: 'pedagogy_ielts_profile',
    IELTS_DRILL_HISTORY: 'pedagogy_ielts_drill_history',
    IELTS_WRITING_SUBMISSIONS: 'pedagogy_ielts_writing_submissions',
    IELTS_SPEAKING_RECORDINGS: 'pedagogy_ielts_speaking_recordings',
    IELTS_MOCK_RESULTS: 'pedagogy_ielts_mock_results',
};

export const DEFAULT_PROFILE = {
    avatarUrl: "",
    fullName: "",
    studentId: "",
    dob: "",
    gender: "",
    idCard: "",
    major: "",
    faculty: "",
    originalMajor: "",
    teachingSubject: "",
    className: "",
    trainingMode: "",
    status: "",
    email: "",
    phone: "",
    addressDetail: "",
    ward: "",
    province: "",
    emergencyRelation: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyContact: "",
    createdAt: new Date().toISOString()
};

// Helper for persistent User ID across page reloads
export const getUserId = (currentUser) => {
    if (currentUser?.uid) {
        localStorage.setItem('pedagogy_user_id', currentUser.uid);
        return currentUser.uid;
    }
    let storedId = localStorage.getItem('pedagogy_user_id');
    if (!storedId) {
        storedId = 'user_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('pedagogy_user_id', storedId);
    }
    return storedId;
};

// Automatic cleanup of initial demo mock data from LocalStorage
export const initStorageCleanup = () => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('pedagogy_clean_slate_2026_v4') !== 'true') {
            const keysToPurge = [
                'pedagogy_practicum_data',
                'pedagogy_lesson_plans',
                'pedagogy_micro_sessions',
                'pedagogy_competencies',
                'pedagogy_plo_matrix',
                'pedagogy_graduation_audit',
                'pedagogy_transcript_info'
            ];
            keysToPurge.forEach(key => localStorage.removeItem(key));
            localStorage.setItem('pedagogy_clean_slate_2026_v4', 'true');
        }
    }
};
