// Storage Keys for Local Backup & Instant Persistence
export const STORAGE_KEYS = {
    PROFILE: 'pedagogy_profile',
    PROGRAMS: 'pedagogy_programs',
    MODULES: 'pedagogy_modules',
    EVENTS: 'pedagogy_events',
    STUDY_LOGS: 'pedagogy_study_logs',
    RESOURCES: 'pedagogy_resources',
    THPT_SUBJECTS: 'pedagogy_thpt_subjects',
    THPT_YEARS: 'pedagogy_thpt_years',
    THPT_EXAM_TYPES: 'pedagogy_thpt_exam_types',
    THPT_EXAMS: 'pedagogy_thpt_exams',
    THPT_PROFILE: 'pedagogy_thpt_profile',
    THPT_RESULTS: 'pedagogy_thpt_results',
    IELTS_PROFILE: 'pedagogy_ielts_profile',
    IELTS_DRILL_HISTORY: 'pedagogy_ielts_drill_history',
    IELTS_WRITING_SUBMISSIONS: 'pedagogy_ielts_writing_submissions',
    IELTS_SPEAKING_RECORDINGS: 'pedagogy_ielts_speaking_recordings',
    IELTS_MOCK_RESULTS: 'pedagogy_ielts_mock_results',
    TS10_PROFILE: 'pedagogy_ts10_profile',
    TS10_SUBMISSIONS: 'pedagogy_ts10_submissions',
    MOS_PROFILE: 'pedagogy_mos_profile',
    MOS_PROJECT_HISTORY: 'pedagogy_mos_project_history',
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
    if (typeof window !== 'undefined' && localStorage.getItem('pedagogy_real_data_only') !== 'v1') {
        ['pedagogy_programs', 'pedagogy_modules', 'pedagogy_events', 'pedagogy_study_logs', 'pedagogy_resources'].forEach(key => {
            const item = localStorage.getItem(key);
            if (item && (item.includes('prog_nvsp_thcs_2026') || item.includes('mod_a01'))) {
                localStorage.removeItem(key);
            }
        });
        localStorage.setItem('pedagogy_real_data_only', 'v1');
    }
};
