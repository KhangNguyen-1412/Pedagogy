import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import logoImg from './assets/logo.png';

// Services
import {
    auth,
    googleProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    getDoc,
    setDoc,
    deleteDoc,
    onSnapshot,
    getCollectionRef,
    getDocRef,
    setPersistence,
    browserLocalPersistence,
    handleFirestoreError,
    writeBatch,
    db
} from './services/firebaseService';

import {
    STORAGE_KEYS,
    DEFAULT_PROFILE,
    getUserId,
    initStorageCleanup
} from './services/storageService';

// Datasets
import { DEFAULT_PROGRAMS, DEFAULT_MODULES } from './data/trainingData';
import {
    DEFAULT_THPT_SUBJECTS,
    DEFAULT_THPT_YEARS,
    DEFAULT_THPT_EXAM_TYPES,
    DEFAULT_THPT_EXAMS,
    DEFAULT_THPT_PERSONAL_PROFILE,
    DEFAULT_THPT_RESULTS
} from './data/thptData';
import { DEFAULT_TS10_PROFILE } from './data/ts10Data';
import { DEFAULT_IELTS_PROFILE } from './data/ieltsData';

// Utils
import { calculateOverallGPA, calculateModuleFinal } from './utils/gpaCalculators';
import {
    getCategoryPresets,
    normalizeProgram,
    calculateRuleBreakdown,
    normalizeModuleProgramIds,
    isModuleInProgram,
    getModuleProgramNames,
    getFilteredModules
} from './utils/ruleValidators';
import { slugify, getSEOAndPath, getViewFromPath, formatModuleName } from './utils/seoHelpers';

// Layouts & Reusable UI Components
import { SidebarNavigation } from './layouts/SidebarNavigation';
import {
    EditorialSelect,
    EditorialDatePicker,
    EditorialTimePicker,
    Modal,
    ToastNotification,
    AlertBox,
    ProgressBar
} from './components/common/EditorialWidgets';
import { CertificateModal } from './components/training/CertificateModal';
import { ThptPersonalTestModal } from './components/thpt/ThptPersonalTestModal';

// Training Suite Views
import { DashboardView } from './views/training/DashboardView';
import { ProgramsView } from './views/training/ProgramsView';
import { ProgramDetailView } from './views/training/ProgramDetailView';
import { ModuleDetailView } from './views/training/ModuleDetailView';
import { SyllabusView } from './views/training/SyllabusView';
import { CalendarAttendanceView } from './views/training/CalendarAttendanceView';
import { GradebookView } from './views/training/GradebookView';
import { ResourcesStudyLogView } from './views/training/ResourcesStudyLogView';
import { ProfileView } from './views/training/ProfileView';

// THPT Suite Views
import { ThptExamsView } from './views/thpt/ThptExamsView';
import { ThptPersonalGoalView } from './views/thpt/ThptPersonalGoalView';
import { ThptPersonalTrackingView } from './views/thpt/ThptPersonalTrackingView';
import { ThptAdmissionView } from './views/thpt/ThptAdmissionView';
import { AcademicTranscriptsView } from './views/thpt/AcademicTranscriptsView';

// TS10 Suite Views
import { Ts10HubView } from './views/ts10/Ts10HubView';
import { Ts10MathView } from './views/ts10/Ts10MathView';
import { Ts10LiteratureView } from './views/ts10/Ts10LiteratureView';
import { Ts10EnglishView } from './views/ts10/Ts10EnglishView';
import { Ts10ProvincialMatrixView } from './views/ts10/Ts10ProvincialMatrixView';
import { Ts10CorrectionLab } from './views/ts10/Ts10CorrectionLab';
import { Ts10RoadmapAnalyticsView } from './views/ts10/Ts10RoadmapAnalyticsView';

// IELTS Suite Views
import { IeltsHubView } from './views/ielts/IeltsHubView';
import { IeltsMethodologyView } from './views/ielts/IeltsMethodologyView';
import { IeltsDrillsView } from './views/ielts/IeltsDrillsView';
import { IeltsWritingLab } from './views/ielts/IeltsWritingLab';
import { IeltsSpeakingLab } from './views/ielts/IeltsSpeakingLab';
import { IeltsExamSimulator } from './views/ielts/IeltsExamSimulator';
import { IeltsLanguageGym } from './views/ielts/IeltsLanguageGym';
import { IeltsAnalyticsView } from './views/ielts/IeltsAnalyticsView';

// MOS & IC3 International IT Suite Views
import { MosIc3HubView } from './views/mos/MosIc3HubView';

// Initialize storage cleanup
initStorageCleanup();

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success', duration = 3500) => {
        const id = Date.now();
        setToast({ message, type, id });
        setTimeout(() => {
            setToast(prev => (prev?.id === id ? null : prev));
        }, duration);
    };
    const [currentView, setCurrentView] = useState(() => {
        if (typeof window === 'undefined') return 'dashboard';
        const fromPath = getViewFromPath(window.location.pathname);
        if (fromPath) return fromPath;
        const saved = localStorage.getItem('pedagogy_current_view');
        if (saved) return saved;
        return 'dashboard';
    });

    const [authLoadingState, setAuthLoadingState] = useState(null); // 'logging_in' | 'logging_out' | null

    const handleGoogleLogin = async () => {
        setAuthLoadingState('logging_in');
        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            const googleProfile = {
                ...DEFAULT_PROFILE,
                fullName: user.displayName || DEFAULT_PROFILE.fullName,
                email: user.email || DEFAULT_PROFILE.email,
                avatarUrl: user.photoURL || DEFAULT_PROFILE.avatarUrl,
            };
            
            if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
                localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(googleProfile));
                setProfile(googleProfile);
            }
        } catch (error) {
            console.error("Lỗi đăng nhập Google:", error);
            setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
        } finally {
            setTimeout(() => setAuthLoadingState(null), 400);
        }
    };
    // Đảm bảo bạn đã có sẵn import db từ file firebase

    const handleMigrateRealData = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập bằng Google trên máy local này trước!");
            return;
        }

        const confirm = window.confirm("Hệ thống sẽ lấy dữ liệu THẬT đang có trên máy tính này (Local) để đẩy lên Cloud cho tài khoản Google của bạn. Tiếp tục?");
        if (!confirm) return;

        try {
            const batch = writeBatch(db);
            const userId = getUserId(user);

            // 1. Rút dữ liệu thật từ LocalStorage (nơi nó đang bị kẹt)
            const localProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE));
            const localPrograms = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRAMS) || '[]');
            const localModules = JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES) || '[]');
            const localEvents = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
            const localStudyLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_LOGS) || '[]');
            const localResources = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES) || '[]');

            // 2. Gom toàn bộ lệnh ghi đè lên Firebase
            if (localProfile) batch.set(getDocRef(userId, 'profile', 'main'), localProfile);
            
            localPrograms.forEach(p => batch.set(getDocRef(userId, 'programs', p.id), p));
            localModules.forEach(m => batch.set(getDocRef(userId, 'modules', m.id), m));
            localEvents.forEach(e => batch.set(getDocRef(userId, 'events', e.id), e));
            localStudyLogs.forEach(l => batch.set(getDocRef(userId, 'studyLogs', l.id), l));
            localResources.forEach(r => batch.set(getDocRef(userId, 'resources', r.id), r));

            // 3. Thực thi bắn dữ liệu lên mây
            await batch.commit();
            alert("🎉 Đã đẩy toàn bộ dữ liệu thật lên Cloud thành công! Bây giờ bạn có thể lên web thật để kiểm tra.");
            
        } catch (error) {
            console.error("Lỗi đồng bộ dữ liệu thật:", error);
            alert("Có lỗi xảy ra: " + error.message);
        }
    };

    const [activeProgramId, setActiveProgramId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pedagogy_active_program_id') || null;
        }
        return null;
    });
    const [activeModuleId, setActiveModuleId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pedagogy_active_module_id') || null;
        }
        return null;
    });
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');

    // Collapsible Sidebar State (persisted to localStorage)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pedagogy_sidebar_collapsed') === 'true';
        }
        return false;
    });

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('pedagogy_sidebar_collapsed', String(next));
            }
            return next;
        });
    };

    // Keyboard shortcut (Ctrl+B / Cmd+B) to toggle sidebar
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Initial Data State (strictly driven by Firestore Realtime Sync)
    const firestoreSubscriptionsRef = useRef([]);
    const [profile, setProfile] = useState(() => DEFAULT_PROFILE);
    const [programs, setPrograms] = useState(() => DEFAULT_PROGRAMS);
    const [modules, setModules] = useState(() => DEFAULT_MODULES);
    const [events, setEvents] = useState(() => []);
    const [studyLogs, setStudyLogs] = useState(() => []);
    const [resources, setResources] = useState(() => []);

    // THPT Data States
    const [thptSubjects, setThptSubjects] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.THPT_SUBJECTS);
            if (local) {
                try {
                    const parsed = JSON.parse(local);
                    if (Array.isArray(parsed)) {
                        return parsed.map(s => ({ ...s, color: '#124874' }));
                    }
                } catch (e) {}
            }
        }
        return DEFAULT_THPT_SUBJECTS;
    });

    const [thptYears, setThptYears] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.THPT_YEARS);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return DEFAULT_THPT_YEARS;
    });

    const [thptExamTypes, setThptExamTypes] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.THPT_EXAM_TYPES);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return DEFAULT_THPT_EXAM_TYPES;
    });

    const [thptExams, setThptExams] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.THPT_EXAMS);
            if (local) {
                try {
                    const parsed = JSON.parse(local);
                    return parsed.filter(e => !e.id.startsWith('exam_toan_') && !e.id.startsWith('exam_vatly_') && !e.id.startsWith('exam_hoahoc_') && !e.id.startsWith('exam_tienganh_'));
                } catch (e) {}
            }
        }
        return DEFAULT_THPT_EXAMS;
    });

    const [thptProfile, setThptProfile] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.THPT_PROFILE);
            if (local) {
                try {
                    const parsed = JSON.parse(local);
                    if (parsed.targetUniversity === 'Đại học Bách Khoa TP.HCM - Ngành Khoa học Máy tính' ||
                        parsed.targetUniversity === 'Đại học Bách Khoa - Ngành Khoa học Máy tính' ||
                        parsed.targetUniversity === 'Đại học Bách Khoa TP.HCM - Khoa học Máy tính') {
                        parsed.targetUniversity = '';
                        parsed.targetTotalScore = 0;
                        parsed.combination = '';
                        parsed.subjectTargets = [];
                    }
                    if (parsed.mistakeNotes) {
                        parsed.mistakeNotes = parsed.mistakeNotes.filter(m => !m.id.startsWith('mis_00'));
                    }
                    return parsed;
                } catch (e) {}
            }
        }
        return DEFAULT_THPT_PERSONAL_PROFILE;
    });

    const [thptResults, setThptResults] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.THPT_RESULTS);
            if (local) {
                try {
                    const parsed = JSON.parse(local);
                    return parsed.filter(r => !r.id.startsWith('res_00'));
                } catch (e) {}
            }
        }
        return DEFAULT_THPT_RESULTS;
    });

    // IELTS Academic Suite States
    const [ieltsProfile, setIeltsProfile] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.IELTS_PROFILE);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return DEFAULT_IELTS_PROFILE;
    });
    const [ieltsDrillHistory, setIeltsDrillHistory] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.IELTS_DRILL_HISTORY);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return [];
    });
    const [ieltsWritingSubmissions, setIeltsWritingSubmissions] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.IELTS_WRITING_SUBMISSIONS);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return [];
    });
    const [ieltsSpeakingRecordings, setIeltsSpeakingRecordings] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.IELTS_SPEAKING_RECORDINGS);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return [];
    });
    const [ieltsMockResults, setIeltsMockResults] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.IELTS_MOCK_RESULTS);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return [];
    });

    const handleUpdateIeltsProfile = (newProfile) => {
        setIeltsProfile(newProfile);
    };
    const handleCompleteIeltsDrill = (drillRecord) => {
        setIeltsDrillHistory(prev => [drillRecord, ...prev]);
    };
    const handleSaveIeltsEssay = (essayRecord) => {
        setIeltsWritingSubmissions(prev => [essayRecord, ...prev]);
    };
    const handleSaveIeltsRecording = (recordingRecord) => {
        setIeltsSpeakingRecordings(prev => [recordingRecord, ...prev]);
    };
    const handleSaveIeltsMockResult = (mockRecord) => {
        setIeltsMockResults(prev => [mockRecord, ...prev]);
    };

    // TS10 Tuyển Sinh Lớp 10 States
    const [ts10Profile, setTs10Profile] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.TS10_PROFILE);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return DEFAULT_TS10_PROFILE;
    });
    const [ts10Submissions, setTs10Submissions] = useState(() => {
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(STORAGE_KEYS.TS10_SUBMISSIONS);
            if (local) try { return JSON.parse(local); } catch (e) {}
        }
        return [];
    });

    const handleUpdateTs10Profile = (newProfile) => {
        setTs10Profile(newProfile);
    };
    const handleSaveTs10Submission = (submission) => {
        setTs10Submissions(prev => [submission, ...prev]);
    };

    // TS10 LocalStorage Sync
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.TS10_PROFILE, JSON.stringify(ts10Profile));
        }
    }, [ts10Profile]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.TS10_SUBMISSIONS, JSON.stringify(ts10Submissions));
        }
    }, [ts10Submissions]);

    const [isGlobalTestEntryOpen, setIsGlobalTestEntryOpen] = useState(false);

    const handleToggleEnrollProgram = async (programId) => {
        let updatedProgram = null;
        
        const updated = programs.map(p => {
            if (p.id === programId) {
                updatedProgram = { ...p, isEnrolled: p.isEnrolled === false ? true : false };
                return updatedProgram;
            }
            return p;
        });
        
        // Cập nhật Local State & Firebase
        setPrograms(updated);

        // Bổ sung đồng bộ lên Firebase
        if (updatedProgram) {
            const userId = getUserId(user);
            try { 
                await setDoc(getDocRef(userId, 'programs', programId), updatedProgram); 
            } catch (err) {
                console.error("Lỗi cập nhật trạng thái chương trình:", err);
            }
        }
    };

    const filteredModules = getFilteredModules(modules, programs, selectedProgramFilter);

    // Authenticate & Connect Firestore Realtime Sync
    useEffect(() => {
        let isMounted = true;
        const safetyTimer = setTimeout(() => {
            if (isMounted) setLoading(false);
        }, 1200);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!isMounted) return;
            try {
                if (currentUser) {
                    setUser(currentUser);
                    const userId = getUserId(currentUser);
                    await syncFirestoreData(userId, currentUser);
                } else {
                    setUser(null);
                    setProfile(DEFAULT_PROFILE);
                    setPrograms(DEFAULT_PROGRAMS);
                    setModules(DEFAULT_MODULES);
                    setEvents([]);
                    setStudyLogs([]);
                    setResources([]);
                }
            } catch (err) {
                console.error("Auth state change error:", err);
            } finally {
                if (isMounted) {
                    clearTimeout(safetyTimer);
                    setLoading(false);
                }
            }
        }, (err) => {
            console.error("onAuthStateChanged error:", err);
            if (isMounted) {
                clearTimeout(safetyTimer);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            clearTimeout(safetyTimer);
            unsubscribe();
            if (firestoreSubscriptionsRef.current && firestoreSubscriptionsRef.current.length > 0) {
                firestoreSubscriptionsRef.current.forEach(unsub => {
                    try { if (typeof unsub === 'function') unsub(); } catch (e) {}
                });
                firestoreSubscriptionsRef.current = [];
            }
        };
    }, []);

    // LocalStorage Auto-Sync (Scoped by logged-in user to prevent cross-account leakage)
    useEffect(() => {
        if (user?.uid) {
            localStorage.setItem(`${STORAGE_KEYS.PROFILE}_${user.uid}`, JSON.stringify(profile));
            localStorage.setItem(`${STORAGE_KEYS.PROGRAMS}_${user.uid}`, JSON.stringify(programs));
            localStorage.setItem(`${STORAGE_KEYS.MODULES}_${user.uid}`, JSON.stringify(modules));
            localStorage.setItem(`${STORAGE_KEYS.EVENTS}_${user.uid}`, JSON.stringify(events));
            localStorage.setItem(`${STORAGE_KEYS.STUDY_LOGS}_${user.uid}`, JSON.stringify(studyLogs));
            localStorage.setItem(`${STORAGE_KEYS.RESOURCES}_${user.uid}`, JSON.stringify(resources));
            localStorage.setItem(`${STORAGE_KEYS.THPT_SUBJECTS}_${user.uid}`, JSON.stringify(thptSubjects));
            localStorage.setItem(`${STORAGE_KEYS.THPT_YEARS}_${user.uid}`, JSON.stringify(thptYears));
            localStorage.setItem(`${STORAGE_KEYS.THPT_EXAM_TYPES}_${user.uid}`, JSON.stringify(thptExamTypes));
            localStorage.setItem(`${STORAGE_KEYS.THPT_EXAMS}_${user.uid}`, JSON.stringify(thptExams));
            localStorage.setItem(`${STORAGE_KEYS.THPT_PROFILE}_${user.uid}`, JSON.stringify(thptProfile));
            localStorage.setItem(`${STORAGE_KEYS.THPT_RESULTS}_${user.uid}`, JSON.stringify(thptResults));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_PROFILE}_${user.uid}`, JSON.stringify(ieltsProfile));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_DRILL_HISTORY}_${user.uid}`, JSON.stringify(ieltsDrillHistory));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_WRITING_SUBMISSIONS}_${user.uid}`, JSON.stringify(ieltsWritingSubmissions));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_SPEAKING_RECORDINGS}_${user.uid}`, JSON.stringify(ieltsSpeakingRecordings));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_MOCK_RESULTS}_${user.uid}`, JSON.stringify(ieltsMockResults));
        } else {
            localStorage.setItem(STORAGE_KEYS.THPT_SUBJECTS, JSON.stringify(thptSubjects));
            localStorage.setItem(STORAGE_KEYS.THPT_YEARS, JSON.stringify(thptYears));
            localStorage.setItem(STORAGE_KEYS.THPT_EXAM_TYPES, JSON.stringify(thptExamTypes));
            localStorage.setItem(STORAGE_KEYS.THPT_EXAMS, JSON.stringify(thptExams));
            localStorage.setItem(STORAGE_KEYS.THPT_PROFILE, JSON.stringify(thptProfile));
            localStorage.setItem(STORAGE_KEYS.THPT_RESULTS, JSON.stringify(thptResults));
            localStorage.setItem(STORAGE_KEYS.IELTS_PROFILE, JSON.stringify(ieltsProfile));
            localStorage.setItem(STORAGE_KEYS.IELTS_DRILL_HISTORY, JSON.stringify(ieltsDrillHistory));
            localStorage.setItem(STORAGE_KEYS.IELTS_WRITING_SUBMISSIONS, JSON.stringify(ieltsWritingSubmissions));
            localStorage.setItem(STORAGE_KEYS.IELTS_SPEAKING_RECORDINGS, JSON.stringify(ieltsSpeakingRecordings));
            localStorage.setItem(STORAGE_KEYS.IELTS_MOCK_RESULTS, JSON.stringify(ieltsMockResults));
        }
    }, [user, profile, programs, modules, events, studyLogs, resources, thptSubjects, thptYears, thptExamTypes, thptExams, thptProfile, thptResults, ieltsProfile, ieltsDrillHistory, ieltsWritingSubmissions, ieltsSpeakingRecordings, ieltsMockResults]);

    // Firestore Realtime Sync Logic (Strict per-account Cloud Sync)
    const syncFirestoreData = async (userId, googleUser) => {
        try {
            const profileRef = getDocRef(userId, 'profile', 'main');
            const snap = await getDoc(profileRef);
            if (snap.exists()) {
                setProfile(snap.data());
            } else {
                const initProfile = {
                    avatarUrl: googleUser?.photoURL || "",
                    fullName: googleUser?.displayName || "",
                    studentId: "",
                    dob: "",
                    gender: "",
                    idCard: "",
                    major: "",
                    faculty: "",
                    originalMajor: "",
                    className: "",
                    trainingMode: "",
                    status: "",
                    email: googleUser?.email || "",
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
                setProfile(initProfile);
                await setDoc(profileRef, initProfile);
            }

            // Cleanup legacy mock docs from Firestore if present
            const mockExams = ['exam_toan_2025_001', 'exam_vatly_2025_002', 'exam_hoahoc_2025_003', 'exam_tienganh_2025_004'];
            mockExams.forEach(id => { deleteDoc(getDocRef(userId, 'thptExams', id)).catch(() => {}); });
            const mockResults = ['res_001', 'res_002', 'res_003', 'res_004', 'res_005'];
            mockResults.forEach(id => { deleteDoc(getDocRef(userId, 'thptResults', id)).catch(() => {}); });

            // Cleanup any active listeners before starting new ones
            if (firestoreSubscriptionsRef.current && firestoreSubscriptionsRef.current.length > 0) {
                firestoreSubscriptionsRef.current.forEach(unsub => {
                    try { if (typeof unsub === 'function') unsub(); } catch (e) {}
                });
                firestoreSubscriptionsRef.current = [];
            }

            const unsubs = [];

            unsubs.push(
                onSnapshot(getCollectionRef(userId, 'programs'), (snapshot) => {
                    setPrograms(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                }, (err) => handleFirestoreError('programs-sync', err))
            );

            unsubs.push(
                onSnapshot(getCollectionRef(userId, 'modules'), (snapshot) => {
                    setModules(snapshot.docs.map(d => normalizeModuleProgramIds({ id: d.id, ...d.data() })));
                }, (err) => handleFirestoreError('modules-sync', err))
            );

            unsubs.push(
                onSnapshot(getCollectionRef(userId, 'events'), (snapshot) => {
                    setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                }, (err) => handleFirestoreError('events-sync', err))
            );

            unsubs.push(
                onSnapshot(getCollectionRef(userId, 'studyLogs'), (snapshot) => {
                    setStudyLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                }, (err) => handleFirestoreError('studyLogs-sync', err))
            );

            unsubs.push(
                onSnapshot(getCollectionRef(userId, 'resources'), (snapshot) => {
                    setResources(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                }, (err) => handleFirestoreError('resources-sync', err))
            );

            unsubs.push(
                onSnapshot(getCollectionRef(userId, 'thptExams'), (snapshot) => {
                    const cleanExams = snapshot.docs
                        .map(d => ({ id: d.id, ...d.data() }))
                        .filter(e => !e.id.startsWith('exam_toan_') && !e.id.startsWith('exam_vatly_') && !e.id.startsWith('exam_hoahoc_') && !e.id.startsWith('exam_tienganh_'));
                    setThptExams(cleanExams);
                }, (err) => handleFirestoreError('thptExams-sync', err))
            );

            unsubs.push(
                onSnapshot(getDocRef(userId, 'thptProfile', 'main'), (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        let modified = false;
                        if (data.targetUniversity === 'Đại học Bách Khoa TP.HCM - Ngành Khoa học Máy tính' ||
                            data.targetUniversity === 'Đại học Bách Khoa - Ngành Khoa học Máy tính' ||
                            data.targetUniversity === 'Đại học Bách Khoa TP.HCM - Khoa học Máy tính') {
                            data.targetUniversity = '';
                            data.targetTotalScore = 0;
                            data.combination = '';
                            data.subjectTargets = [];
                            modified = true;
                        }
                        if (data.mistakeNotes) {
                            const originalLen = data.mistakeNotes.length;
                            data.mistakeNotes = data.mistakeNotes.filter(m => !m.id.startsWith('mis_00'));
                            if (data.mistakeNotes.length !== originalLen) modified = true;
                        }
                        if (modified) {
                            setDoc(getDocRef(userId, 'thptProfile', 'main'), data).catch(() => {});
                        }
                        setThptProfile(data);
                    }
                }, (err) => handleFirestoreError('thptProfile-sync', err))
            );

            unsubs.push(
                onSnapshot(getCollectionRef(userId, 'thptResults'), (snapshot) => {
                    const cleanResults = snapshot.docs
                        .map(d => ({ id: d.id, ...d.data() }))
                        .filter(r => !r.id.startsWith('res_00'));
                    setThptResults(cleanResults);
                }, (err) => handleFirestoreError('thptResults-sync', err))
            );

            firestoreSubscriptionsRef.current = unsubs;
        } catch (err) {
            handleFirestoreError("syncFirestoreData", err);
        }
    };

    const handleSignOut = async () => {
        try {
            setAuthLoadingState('logging_out');
            if (firestoreSubscriptionsRef.current && firestoreSubscriptionsRef.current.length > 0) {
                firestoreSubscriptionsRef.current.forEach(unsub => {
                    try { if (typeof unsub === 'function') unsub(); } catch (e) {}
                });
                firestoreSubscriptionsRef.current = [];
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // Smooth exit delay
            await signOut(auth);
            setUser(null);
            setProfile(DEFAULT_PROFILE);
            setPrograms(DEFAULT_PROGRAMS);
            setModules([]);
            setEvents([]);
            setStudyLogs([]);
            setResources([]);
            setThptExams(DEFAULT_THPT_EXAMS);
            setThptProfile(DEFAULT_THPT_PERSONAL_PROFILE);
            setThptResults(DEFAULT_THPT_RESULTS);
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
                if (user?.uid) localStorage.removeItem(`${key}_${user.uid}`);
            });
            localStorage.removeItem('pedagogy_user_id');
        } catch (err) {
            console.error("Lỗi đăng xuất:", err);
        } finally {
            setAuthLoadingState(null);
        }
    };

    // Data Mutators (Programs, Modules, Events, Logs, Resources, Profile)
    const handleAddProgram = async (newProg) => {
        setPrograms(prev => [newProg, ...prev]);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'programs', newProg.id), newProg); } catch (err) {}
    };

    const handleUpdateProgram = async (updatedProg) => {
        setPrograms(prev => prev.map(p => p.id === updatedProg.id ? updatedProg : p));
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'programs', updatedProg.id), updatedProg); } catch (err) {}
    };

    const handleAddModule = async (newMod) => {
        const normalized = normalizeModuleProgramIds({ ...newMod, code: (newMod.code || '').toUpperCase().trim() });
        setModules(prev => [...prev, normalized]);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'modules', normalized.id), normalized); } catch (err) {}
    };

    const handleUpdateModule = async (updatedMod) => {
        const normalized = { ...updatedMod, code: (updatedMod.code || '').toUpperCase().trim() };
        setModules(prev => prev.map(m => m.id === normalized.id ? normalized : m));
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'modules', normalized.id), normalized); } catch (err) {}
    };

    const handleDeleteModule = async (modId) => {
        setModules(prev => prev.filter(m => m.id !== modId));
        const userId = getUserId(user);
        try { await deleteDoc(getDocRef(userId, 'modules', modId)); } catch (err) {}
    };

    const handleAddEvent = async (newEvt) => {
        setEvents(prev => [newEvt, ...prev]);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'events', newEvt.id), newEvt); } catch (err) {}
    };

    const handleUpdateEvent = async (updatedEvt) => {
        setEvents(prev => prev.map(e => e.id === updatedEvt.id ? updatedEvt : e));
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'events', updatedEvt.id), updatedEvt); } catch (err) {}
    };

    const handleDeleteEvent = async (evtId) => {
        setEvents(prev => prev.filter(e => e.id !== evtId));
        const userId = getUserId(user);
        try { await deleteDoc(getDocRef(userId, 'events', evtId)); } catch (err) {}
    };

    const handleAddStudyLog = async (newLog) => {
        setStudyLogs(prev => [newLog, ...prev]);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'studyLogs', newLog.id), newLog); } catch (err) {}
    };

    const handleDeleteStudyLog = async (logId) => {
        setStudyLogs(prev => prev.filter(l => l.id !== logId));
        const userId = getUserId(user);
        try { await deleteDoc(getDocRef(userId, 'studyLogs', logId)); } catch (err) {}
    };

    const handleAddResource = async (newRes) => {
        setResources(prev => [newRes, ...prev]);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'resources', newRes.id), newRes); } catch (err) {}
    };

    const handleDeleteResource = async (resId) => {
        setResources(prev => prev.filter(r => r.id !== resId));
        const userId = getUserId(user);
        try { await deleteDoc(getDocRef(userId, 'resources', resId)); } catch (err) {}
    };

    const handleUpdateProfile = async (updatedProfile) => {
        setProfile(updatedProfile);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'profile', 'main'), updatedProfile); } catch (err) {}
    };

    // THPT Exam Mutators
    const handleSaveThptExam = async (savedExam) => {
        setThptExams(prev => {
            const exists = prev.some(e => e.id === savedExam.id);
            if (exists) return prev.map(e => e.id === savedExam.id ? savedExam : e);
            return [savedExam, ...prev];
        });
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'thptExams', savedExam.id), savedExam); } catch (err) {}
    };

    const handleDeleteThptExam = async (examId) => {
        setThptExams(prev => prev.filter(e => e.id !== examId));
        const userId = getUserId(user);
        try { await deleteDoc(getDocRef(userId, 'thptExams', examId)); } catch (err) {}
    };

    const handleDuplicateThptExam = async (exam) => {
        const duplicated = {
            ...JSON.parse(JSON.stringify(exam)),
            id: 'exam_' + Date.now(),
            code: (exam.code || 'DE') + '-COPY',
            title: exam.title + ' (Bản sao)',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        handleSaveThptExam(duplicated);
        showToast('Đã nhân bản đề thi thành công');
    };

    // THPT Personal Profile Mutator
    const handleUpdateThptProfile = async (updatedProfile) => {
        setThptProfile(updatedProfile);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'thptProfile', 'main'), updatedProfile); } catch (err) {}
    };

    // THPT Result Mutators
    const handleSaveThptResult = async (savedResult) => {
        setThptResults(prev => {
            const exists = prev.some(r => r.id === savedResult.id);
            if (exists) return prev.map(r => r.id === savedResult.id ? savedResult : r);
            return [savedResult, ...prev];
        });
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'thptResults', savedResult.id), savedResult); } catch (err) {}
    };

    const handleDeleteThptResult = async (resultId) => {
        setThptResults(prev => prev.filter(r => r.id !== resultId));
        const userId = getUserId(user);
        try { await deleteDoc(getDocRef(userId, 'thptResults', resultId)); } catch (err) {}
    };

    // THPT Metadata Mutators
    const handleUpdateThptSubjects = async (updatedSubjects) => {
        setThptSubjects(updatedSubjects);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'thptMetadata', 'subjects'), { list: updatedSubjects }); } catch (err) {}
    };

    const handleUpdateThptYears = async (updatedYears) => {
        setThptYears(updatedYears);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'thptMetadata', 'years'), { list: updatedYears }); } catch (err) {}
    };

    const handleUpdateThptExamTypes = async (updatedTypes) => {
        setThptExamTypes(updatedTypes);
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'thptMetadata', 'examTypes'), { list: updatedTypes }); } catch (err) {}
    };

    // SEO & Friendly URL Sync Effect
    useEffect(() => {
        const seo = getSEOAndPath(currentView, activeProgramId, activeModuleId, programs, modules);

        // Dynamic Document Title
        document.title = seo.title;

        // Dynamic Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', seo.description);

        // OpenGraph Title & Description
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', seo.title);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', seo.description);

        // Update URL PushState
        if (typeof window !== 'undefined' && window.location.pathname !== seo.path) {
            window.history.pushState({ currentView, activeProgramId, activeModuleId }, '', seo.path);
        }

        // Persist view and selection state to localStorage for reliable reload restoration
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_current_view', currentView);
            if (activeProgramId) localStorage.setItem('pedagogy_active_program_id', activeProgramId);
            if (activeModuleId) localStorage.setItem('pedagogy_active_module_id', activeModuleId);
        }
    }, [currentView, activeProgramId, activeModuleId, programs, modules]);

    // Browser History PopState Listener (Back/Forward Buttons)
    useEffect(() => {
        const handlePopState = (e) => {
            if (e.state && e.state.currentView) {
                setCurrentView(e.state.currentView);
                if (e.state.activeProgramId) setActiveProgramId(e.state.activeProgramId);
                if (e.state.activeModuleId) setActiveModuleId(e.state.activeModuleId);
            } else {
                const fromPath = getViewFromPath(window.location.pathname);
                if (fromPath) {
                    setCurrentView(fromPath);
                } else {
                    const saved = localStorage.getItem('pedagogy_current_view');
                    setCurrentView(saved || 'dashboard');
                }
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (view, data = {}) => {
        setCurrentView(view);
        if (data.programId) setActiveProgramId(data.programId);
        if (data.moduleId) setActiveModuleId(data.moduleId);

        const seo = getSEOAndPath(view, data.programId || activeProgramId, data.moduleId || activeModuleId, programs, modules);
        if (typeof window !== 'undefined' && window.location.pathname !== seo.path) {
            window.history.pushState({ currentView: view, activeProgramId: data.programId || activeProgramId, activeModuleId: data.moduleId || activeModuleId }, '', seo.path);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <div className="text-center font-serif-title text-brand-cerulean text-2xl animate-pulse">
                    Đang chuẩn bị không gian học tập...
                </div>
            </div>
        );
    }

if (!user) {
        return (
            <div className="min-h-screen flex flex-col lg:flex-row bg-brand-cream">
                {/* CỘT TRÁI: HÌNH ẢNH & TRÍCH DẪN (Ẩn trên điện thoại) */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden shadow-2xl z-10">
                    {/* Hình ảnh nền (Bạn có thể đổi URL ảnh khác nếu muốn) */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop')" }}
                    ></div>
                    
                    {/* Lớp phủ màu Xanh Cerulean giúp chữ dễ đọc và giữ tone màu thương hiệu */}
                    <div className="absolute inset-0 bg-brand-cerulean/85 mix-blend-multiply"></div>
                    
                    {/* Nội dung câu trích dẫn */}
                    <div className="relative z-10 text-white max-w-lg text-center px-4">
                        <p className="text-4xl font-serif-title leading-tight mb-8">
                            "Giáo dục không phải là việc đổ đầy một cái bình, mà là thắp sáng một ngọn lửa."
                        </p>
                        <div className="w-16 h-1.5 bg-brand-jasper mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg font-sans font-bold tracking-[0.2em] uppercase opacity-90 text-brand-cream">
                            William Butler Yeats
                        </p>
                    </div>
                </div>

                {/* CỘT PHẢI: LOGO & FORM ĐĂNG NHẬP */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
                    <div className="w-full max-w-md animate-auth-in">
                        {/* Logo & Tiêu đề nằm trên form đăng nhập */}
                        <div className="text-center mb-10 flex flex-col items-center">
                            <img 
                                src={logoImg} 
                                alt="Pedagogy Logo" 
                                className="w-36 h-36 rounded-full shadow-lg border-4 border-brand-cerulean/10 mb-5" 
                            />
                            <h1 className="font-serif-title text-5xl text-brand-cerulean tracking-tight mb-2">Pedagogy.</h1>
                            <p className="text-base italic text-gray-600 font-body">Personal Learning Management</p>
                        </div>

                        {/* Box Đăng nhập */}
                        <div className="bg-white p-10 border-editorial shadow-editorial w-full relative">
                            {/* Accent line màu Đỏ Jasper */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-jasper"></div>

                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-serif-title text-brand-cerulean mb-2">Chào mừng trở lại</h2>
                                <p className="text-gray-500 font-body text-sm">Vui lòng đăng nhập để truy cập vào hệ thống.</p>
                            </div>

                            <button 
                                onClick={handleGoogleLogin} 
                                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 shadow-sm hover:shadow-editorial-hover hover:border-brand-cerulean transition-all bg-white group"
                            >
                                <img 
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                    alt="Google Logo" 
                                    className="w-6 h-6 group-hover:scale-110 transition-transform" 
                                />
                                <span className="font-sans font-bold text-gray-700 group-hover:text-brand-cerulean transition-colors">
                                    Tiếp tục với Google
                                </span>
                            </button>
                            
                            {error && (
                                <div className="mt-5 p-3 bg-red-50 border-l-4 border-brand-jasper text-brand-jasper text-sm font-bold flex items-center gap-2">
                                    <AlertCircle size={16} className="shrink-0 text-brand-jasper" /> {error}
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 text-center text-xs text-gray-400 font-body">
                            &copy; {new Date().getFullYear()} Pedagogy. Khóa luận Tốt nghiệp 2026.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-brand-cream">
            {/* Sidebar (Stationary / Fixed with Collapsible Support) */}
            <SidebarNavigation
                currentView={currentView}
                navigate={navigate}
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                profile={profile}
                currentUser={user}
                handleGoogleSignIn={handleGoogleLogin}
                handleSignOut={handleSignOut}
            />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-brand-cream border-b border-brand-cerulean p-4 flex justify-between items-center z-40">
                <div className="flex items-center gap-2">
                    <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-full" />
                    <h1 className="font-serif-title text-2xl text-brand-cerulean">Pedagogy</h1>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                    <button
                        onClick={() => navigate('ts10_math')}
                        className="px-2 py-1 bg-emerald-800 text-white rounded text-xs font-bold shrink-0"
                    >
                        Vào 10
                    </button>
                    <button
                        onClick={() => navigate('ielts_methodology')}
                        className="px-2 py-1 bg-brand-cerulean text-white rounded text-xs font-bold shrink-0"
                    >
                        IELTS
                    </button>
                    <button
                        onClick={() => navigate('thpt_goals')}
                        className="px-2 py-1 bg-brand-jasper text-white rounded text-xs font-bold shrink-0"
                    >
                        THPT
                    </button>
                </div>
            </div>

            {/* Main Content Area (Independent Vertical Scroll with Fade Up Animation) */}
            <main key={currentView} className="flex-1 h-full overflow-y-auto p-6 md:p-12 mt-14 md:mt-0 animate-fade-in-up">
                {error && <AlertBox type="error" message={error} onClose={() => setError(null)} />}


                {currentView === 'dashboard' && (
                    <DashboardView
                        programs={programs}
                        modules={modules}
                        events={events}
                        studyLogs={studyLogs}
                        thptProfile={thptProfile}
                        thptExams={thptExams}
                        thptResults={thptResults}
                        thptSubjects={thptSubjects}
                        navigate={navigate}
                        onOpenCertificate={() => setIsCertModalOpen(true)}
                        selectedProgramFilter={selectedProgramFilter}
                        setSelectedProgramFilter={setSelectedProgramFilter}
                    />
                )}
                {currentView === 'programs' && (
                    <ProgramsView
                        programs={programs}
                        modules={modules}
                        onAddProgram={handleAddProgram}
                        onToggleEnrollProgram={handleToggleEnrollProgram}
                        navigate={navigate}
                    />
                )}
                {currentView === 'program_detail' && (
                    <ProgramDetailView
                        programId={activeProgramId || (programs[0] && programs[0].id)}
                        programs={programs}
                        modules={modules}
                        profile={profile}
                        onAddModule={handleAddModule}
                        onUpdateModule={handleUpdateModule}
                        onDeleteModule={handleDeleteModule}
                        onUpdateProgram={handleUpdateProgram}
                        navigate={navigate}
                    />
                )}
                {currentView === 'module_detail' && (
                    <ModuleDetailView
                        moduleId={activeModuleId || (modules[0] && modules[0].id)}
                        programId={activeProgramId || (programs[0] && programs[0].id)}
                        programs={programs}
                        modules={modules}
                        profile={profile}
                        onUpdateModule={handleUpdateModule}
                        onDeleteModule={handleDeleteModule}
                        navigate={navigate}
                    />
                )}
                {currentView === 'syllabus' && (
                    <SyllabusView
                        modules={filteredModules.length > 0 ? filteredModules : modules}
                        onUpdateModule={handleUpdateModule}
                        showToast={showToast}
                    />
                )}
                {currentView === 'calendar' && (
                    <CalendarAttendanceView
                        modules={filteredModules.length > 0 ? filteredModules : modules}
                        events={events}
                        onAddEvent={handleAddEvent}
                        onUpdateEvent={handleUpdateEvent}
                        onDeleteEvent={handleDeleteEvent}
                    />
                )}
                {currentView === 'gradebook' && (
                    <GradebookView
                        modules={modules}
                        programs={programs}
                        onUpdateModule={handleUpdateModule}
                    />
                )}
                {currentView === 'resources' && (
                    <ResourcesStudyLogView
                        modules={filteredModules.length > 0 ? filteredModules : modules}
                        studyLogs={studyLogs}
                        resources={resources}
                        onAddStudyLog={handleAddStudyLog}
                        onDeleteStudyLog={handleDeleteStudyLog}
                        onAddResource={handleAddResource}
                        onDeleteResource={handleDeleteResource}
                    />
                )}
                {currentView === 'thpt_exams' && (
                    <ThptExamsView
                        exams={thptExams}
                        subjects={thptSubjects}
                        years={thptYears}
                        examTypes={thptExamTypes}
                        onSaveExam={handleSaveThptExam}
                        onDeleteExam={handleDeleteThptExam}
                        onDuplicateExam={handleDuplicateThptExam}
                        onUpdateSubjects={handleUpdateThptSubjects}
                        onUpdateYears={handleUpdateThptYears}
                        onUpdateExamTypes={handleUpdateThptExamTypes}
                        onSaveResult={handleSaveThptResult}
                        showToast={showToast}
                    />
                )}
                {currentView === 'thpt_goals' && (
                    <ThptPersonalGoalView
                        profile={thptProfile}
                        subjects={thptSubjects}
                        results={thptResults}
                        onUpdateProfile={handleUpdateThptProfile}
                        navigate={navigate}
                        showToast={showToast}
                    />
                )}
                {currentView === 'thpt_tracking' && (
                    <ThptPersonalTrackingView
                        profile={thptProfile}
                        exams={thptExams}
                        results={thptResults}
                        subjects={thptSubjects}
                        onSaveResult={handleSaveThptResult}
                        onDeleteResult={handleDeleteThptResult}
                        onUpdateProfile={handleUpdateThptProfile}
                        navigate={navigate}
                        showToast={showToast}
                    />
                )}
                {currentView === 'thpt_admission' && (
                    <ThptAdmissionView
                        profile={thptProfile}
                        subjects={thptSubjects}
                        onUpdateProfile={handleUpdateThptProfile}
                        showToast={showToast}
                    />
                )}
                {currentView === 'thpt_transcripts' && (
                    <AcademicTranscriptsView
                        profile={thptProfile}
                        onUpdateProfile={handleUpdateThptProfile}
                        showToast={showToast}
                    />
                )}
                {['ts10_math', 'ts10_literature', 'ts10_english', 'ts10_matrix', 'ts10_correction', 'ts10_roadmap'].includes(currentView) && (
                    <Ts10HubView
                        currentSubView={currentView}
                        navigate={navigate}
                        profile={ts10Profile}
                        submissions={ts10Submissions}
                        onSaveSubmission={handleSaveTs10Submission}
                        showToast={showToast}
                    />
                )}
                {['ielts_hub', 'ielts_methodology', 'ielts_drills', 'ielts_writing_lab', 'ielts_speaking_lab', 'ielts_simulator', 'ielts_gym', 'ielts_analytics'].includes(currentView) && (
                    <IeltsHubView
                        currentSubView={currentView}
                        navigate={navigate}
                        profile={ieltsProfile}
                        drillHistory={ieltsDrillHistory}
                        writingSubmissions={ieltsWritingSubmissions}
                        speakingRecordings={ieltsSpeakingRecordings}
                        mockResults={ieltsMockResults}
                        onUpdateProfile={handleUpdateIeltsProfile}
                        onCompleteDrill={handleCompleteIeltsDrill}
                        onSaveEssay={handleSaveIeltsEssay}
                        onSaveRecording={handleSaveIeltsRecording}
                        onSaveMockResult={handleSaveIeltsMockResult}
                        showToast={showToast}
                    />
                )}
                {['mos_hub', 'mos_sandbox', 'mos_projects', 'ic3_lab', 'mos_analytics'].includes(currentView) && (
                    <MosIc3HubView
                        currentSubView={currentView}
                        navigate={navigate}
                        showToast={showToast}
                    />
                )}
                {currentView === 'profile' && (
                    <ProfileView
                        profile={profile}
                        programs={programs}
                        thptProfile={thptProfile}
                        navigate={navigate}
                        onUpdateProfile={handleUpdateProfile}
                        onOpenCertificate={() => setIsCertModalOpen(true)}
                    />
                )}
            </main>

            {/* Global Quick Test Entry Modal */}
            <ThptPersonalTestModal
                isOpen={isGlobalTestEntryOpen}
                onClose={() => setIsGlobalTestEntryOpen(false)}
                exams={thptExams}
                subjects={thptSubjects}
                onSaveResult={handleSaveThptResult}
                showToast={showToast}
            />

            {/* Auth Login / Logout Transition Overlay */}
            {authLoadingState && createPortal(
                <div className="fixed inset-0 z-[400] bg-brand-cream/90 backdrop-blur-md flex flex-col items-center justify-center space-y-4 animate-backdrop-in">
                    <div className="w-14 h-14 border-4 border-brand-cerulean/30 border-t-brand-cerulean rounded-full animate-spin"></div>
                    <p className="text-xl font-serif-title font-bold text-brand-cerulean animate-pulse">
                        {authLoadingState === 'logging_in' ? 'Đang kết nối tài khoản Google...' : 'Đang đăng xuất an toàn...'}
                    </p>
                </div>,
                document.body
            )}

            {/* Certificate Modal */}
            <CertificateModal
                isOpen={isCertModalOpen}
                onClose={() => setIsCertModalOpen(false)}
                profile={profile}
                program={programs.find(p => p.id === activeProgramId) || programs[0]}
                overall={calculateOverallGPA(modules)}
            />

            {/* Custom Toast Notification Component */}
            <ToastNotification toast={toast} onClose={() => setToast(null)} />
        </div>
    );
}