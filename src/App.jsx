import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    AlertCircle,
    CheckCircle2,
    X
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
import { DEFAULT_IELTS_PROFILE } from './data/ieltsData';

// Utils
import { calculateOverallGPA, calculateModuleFinal } from './utils/gpaCalculators';
import {
    getCategoryPresets,
    normalizeProgram,
    getProgramStatus,
    getProgramStatusLabel,
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



// IELTS Suite Views
import { IeltsHubView } from './views/ielts/IeltsHubView';
import { IeltsMethodologyView } from './views/ielts/IeltsMethodologyView';
import { IeltsDrillsView } from './views/ielts/IeltsDrillsView';
import { IeltsWritingLab } from './views/ielts/IeltsWritingLab';
import { IeltsSpeakingLab } from './views/ielts/IeltsSpeakingLab';
import { IeltsExamSimulator } from './views/ielts/IeltsExamSimulator';
import { IeltsLanguageGym } from './views/ielts/IeltsLanguageGym';
import { IeltsAnalyticsView } from './views/ielts/IeltsAnalyticsView';



// Initialize storage cleanup
initStorageCleanup();

export const VALID_VIEWS = [
    'dashboard',
    'programs',
    'program_detail',
    'module_detail',
    'syllabus',
    'calendar',
    'gradebook',
    'resources',
    'ielts_hub',
    'ielts_methodology',
    'ielts_drills',
    'ielts_writing_lab',
    'ielts_speaking_lab',
    'ielts_simulator',
    'ielts_gym',
    'ielts_analytics',
    'profile'
];

export const resolveViewString = (candidate) => {
    if (!candidate) return null;
    if (typeof candidate === 'string' && VALID_VIEWS.includes(candidate)) {
        return candidate;
    }
    if (typeof candidate === 'object' && candidate.view && VALID_VIEWS.includes(candidate.view)) {
        return candidate.view;
    }
    return null;
};

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Guest Mode: Mặc định cho phép người dùng vào xem hệ thống ngay khi truy cập trang
    const [isGuestMode, setIsGuestMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const explicitLogout = localStorage.getItem('pedagogy_explicit_logout');
            if (explicitLogout === 'true') return false;
        }
        return true;
    });
    const [showGuestBanner, setShowGuestBanner] = useState(true);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success', duration = 3500) => {
        const id = Date.now();
        setToast({ message, type, id });
        setTimeout(() => {
            setToast(prev => (prev?.id === id ? null : prev));
        }, duration);
    };

    // Đảm bảo luôn trích xuất đúng string view hợp lệ và mặc định hiển thị Dashboard khi mới vào
    const [currentView, setCurrentView] = useState(() => {
        if (typeof window === 'undefined') return 'dashboard';
        const parsed = getViewFromPath(window.location.pathname);
        const fromPath = resolveViewString(parsed);
        if (fromPath) return fromPath;
        const saved = localStorage.getItem('pedagogy_current_view');
        const fromSaved = resolveViewString(saved);
        if (fromSaved) return fromSaved;
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
            if (typeof window !== 'undefined') {
                localStorage.removeItem('pedagogy_explicit_logout');
            }
            setIsGuestMode(true);
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
            alert("Đã đẩy toàn bộ dữ liệu thật lên Cloud thành công! Bây giờ bạn có thể lên web thật để kiểm tra.");
            
        } catch (error) {
            console.error("Lỗi đồng bộ dữ liệu thật:", error);
            alert("Có lỗi xảy ra: " + error.message);
        }
    };

    const [activeProgramId, setActiveProgramId] = useState(() => {
        if (typeof window !== 'undefined') {
            const parsed = getViewFromPath(window.location.pathname);
            if (parsed?.programId) return parsed.programId;
            return localStorage.getItem('pedagogy_active_program_id') || null;
        }
        return null;
    });
    const [activeModuleId, setActiveModuleId] = useState(() => {
        if (typeof window !== 'undefined') {
            const parsed = getViewFromPath(window.location.pathname);
            if (parsed?.moduleId) return parsed.moduleId;
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


    const handleUpdateProgramStatus = async (programId, newStatus) => {
        let updatedProgram = null;
        
        const updated = programs.map(p => {
            if (p.id === programId) {
                updatedProgram = {
                    ...p,
                    status: newStatus,
                    isEnrolled: newStatus !== 'chua_hoc'
                };
                return updatedProgram;
            }
            return p;
        });
        
        // Cập nhật Local State & Firebase
        setPrograms(updated);

        if (updatedProgram) {
            const userId = getUserId(user);
            try { 
                await setDoc(getDocRef(userId, 'programs', programId), updatedProgram); 
            } catch (err) {
                console.error("Lỗi cập nhật trạng thái chương trình:", err);
            }
        }
    };

    const handleToggleEnrollProgram = async (programId) => {
        const prog = programs.find(p => p.id === programId);
        if (!prog) return;
        const current = getProgramStatus(prog);
        const next = current === 'chua_hoc' ? 'dang_hoc' : 'chua_hoc';
        await handleUpdateProgramStatus(programId, next);
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
            localStorage.setItem(`${STORAGE_KEYS.IELTS_PROFILE}_${user.uid}`, JSON.stringify(ieltsProfile));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_DRILL_HISTORY}_${user.uid}`, JSON.stringify(ieltsDrillHistory));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_WRITING_SUBMISSIONS}_${user.uid}`, JSON.stringify(ieltsWritingSubmissions));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_SPEAKING_RECORDINGS}_${user.uid}`, JSON.stringify(ieltsSpeakingRecordings));
            localStorage.setItem(`${STORAGE_KEYS.IELTS_MOCK_RESULTS}_${user.uid}`, JSON.stringify(ieltsMockResults));
        } else {
            localStorage.setItem(STORAGE_KEYS.IELTS_PROFILE, JSON.stringify(ieltsProfile));
            localStorage.setItem(STORAGE_KEYS.IELTS_DRILL_HISTORY, JSON.stringify(ieltsDrillHistory));
            localStorage.setItem(STORAGE_KEYS.IELTS_WRITING_SUBMISSIONS, JSON.stringify(ieltsWritingSubmissions));
            localStorage.setItem(STORAGE_KEYS.IELTS_SPEAKING_RECORDINGS, JSON.stringify(ieltsSpeakingRecordings));
            localStorage.setItem(STORAGE_KEYS.IELTS_MOCK_RESULTS, JSON.stringify(ieltsMockResults));
        }
    }, [user, profile, programs, modules, events, studyLogs, resources, ieltsProfile, ieltsDrillHistory, ieltsWritingSubmissions, ieltsSpeakingRecordings, ieltsMockResults]);

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
            setModules(DEFAULT_MODULES);
            setEvents([]);
            setStudyLogs([]);
            setResources([]);

            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
                if (user?.uid) localStorage.removeItem(`${key}_${user.uid}`);
            });
            localStorage.removeItem('pedagogy_user_id');
            if (typeof window !== 'undefined') {
                localStorage.setItem('pedagogy_explicit_logout', 'true');
            }
            setIsGuestMode(false);
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
        const normalized = {
            ...updatedProg,
            isEnrolled: updatedProg.status !== 'chua_hoc'
        };
        setPrograms(prev => prev.map(p => p.id === normalized.id ? normalized : p));
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'programs', normalized.id), normalized); } catch (err) {}
    };

    const handleDeleteProgram = async (progId) => {
        setPrograms(prev => prev.filter(p => p.id !== progId));
        if (activeProgramId === progId) {
            setActiveProgramId(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('pedagogy_active_program_id');
            }
        }
        if (selectedProgramFilter === progId) {
            setSelectedProgramFilter('all');
        }

        const userId = getUserId(user);
        try {
            await deleteDoc(getDocRef(userId, 'programs', progId));
        } catch (err) {}

        // Dọn dẹp hoặc gỡ liên kết học phần thuộc CTĐT bị xóa
        const modulesToKeep = [];
        const modulesToDelete = [];
        const modulesToUpdate = [];

        modules.forEach(m => {
            const pIds = (m.programIds && m.programIds.length > 0)
                ? m.programIds
                : (m.programId ? [m.programId] : []);

            if (pIds.includes(progId)) {
                const remaining = pIds.filter(id => id !== progId);
                if (remaining.length === 0) {
                    modulesToDelete.push(m);
                } else {
                    const updatedMod = {
                        ...m,
                        programIds: remaining,
                        programId: remaining[0]
                    };
                    modulesToKeep.push(updatedMod);
                    modulesToUpdate.push(updatedMod);
                }
            } else {
                modulesToKeep.push(m);
            }
        });

        if (modulesToDelete.length > 0 || modulesToUpdate.length > 0) {
            setModules(modulesToKeep);
            for (const m of modulesToDelete) {
                try { await deleteDoc(getDocRef(userId, 'modules', m.id)); } catch (e) {}
            }
            for (const m of modulesToUpdate) {
                try { await setDoc(getDocRef(userId, 'modules', m.id), m); } catch (e) {}
            }
        }
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
            const safeView = resolveViewString(currentView) || 'dashboard';
            localStorage.setItem('pedagogy_current_view', safeView);
            if (activeProgramId) localStorage.setItem('pedagogy_active_program_id', activeProgramId);
            if (activeModuleId) localStorage.setItem('pedagogy_active_module_id', activeModuleId);
        }
    }, [currentView, activeProgramId, activeModuleId, programs, modules]);

    // Browser History PopState Listener (Back/Forward Buttons)
    useEffect(() => {
        const handlePopState = (e) => {
            if (e.state && e.state.currentView) {
                const targetView = resolveViewString(e.state.currentView) || 'dashboard';
                setCurrentView(targetView);
                if (e.state.activeProgramId) setActiveProgramId(e.state.activeProgramId);
                if (e.state.activeModuleId) setActiveModuleId(e.state.activeModuleId);
            } else {
                const parsed = getViewFromPath(window.location.pathname);
                const fromPath = resolveViewString(parsed);
                if (fromPath) {
                    setCurrentView(fromPath);
                    if (parsed?.programId) setActiveProgramId(parsed.programId);
                    if (parsed?.moduleId) setActiveModuleId(parsed.moduleId);
                } else {
                    const saved = localStorage.getItem('pedagogy_current_view');
                    const target = resolveViewString(saved) || 'dashboard';
                    setCurrentView(target);
                }
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (view, data = {}) => {
        const targetView = resolveViewString(view) || 'dashboard';
        setCurrentView(targetView);
        if (data.programId) setActiveProgramId(data.programId);
        if (data.moduleId) setActiveModuleId(data.moduleId);

        const seo = getSEOAndPath(targetView, data.programId || activeProgramId, data.moduleId || activeModuleId, programs, modules);
        if (typeof window !== 'undefined' && window.location.pathname !== seo.path) {
            window.history.pushState({ currentView: targetView, activeProgramId: data.programId || activeProgramId, activeModuleId: data.moduleId || activeModuleId }, '', seo.path);
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

    if (!user && !isGuestMode) {
        return (
            <div className="min-h-screen flex flex-col lg:flex-row bg-brand-cream">
                {/* CỘT TRÁI: HÌNH ẢNH & TRÍCH DẪN (Ẩn trên điện thoại) */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden shadow-2xl z-10">
                    {/* Hình ảnh nền */}
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

                            <div className="relative flex py-4 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase font-sans">Hoặc</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsGuestMode(true);
                                    if (typeof window !== 'undefined') {
                                        localStorage.removeItem('pedagogy_explicit_logout');
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-brand-cerulean/30 bg-brand-cream/60 hover:bg-brand-cerulean hover:text-white text-brand-cerulean font-sans font-bold transition-all text-sm group shadow-xs"
                            >
                                <span>Khám phá ngay (Chế độ Khách)</span>
                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
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
                        onClick={() => navigate('dashboard')}
                        className="px-2 py-1 bg-emerald-800 text-white rounded text-xs font-bold shrink-0"
                    >
                        Nghiệp vụ SP
                    </button>
                    <button
                        onClick={() => navigate('ielts_hub')}
                        className="px-2 py-1 bg-brand-cerulean text-white rounded text-xs font-bold shrink-0"
                    >
                        Luyện thi IELTS
                    </button>
                </div>
            </div>

            {/* Main Content Area (Independent Vertical Scroll with Fade Up Animation) */}
            <main key={currentView} className="flex-1 h-full overflow-y-auto p-6 md:p-12 mt-14 md:mt-0 animate-fade-in-up">
                {error && <AlertBox type="error" message={error} onClose={() => setError(null)} />}

                {/* Banner thông báo chế độ Khách */}
                {!user && showGuestBanner && (
                    <div className="mb-6 p-3.5 sm:p-4 bg-amber-50/95 border-l-4 border-amber-500 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
                        <div className="flex items-center gap-2.5 text-amber-900 text-xs sm:text-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
                            <span>Bạn đang trải nghiệm <strong>Chế độ Khách</strong> (dữ liệu lưu trên máy). Hãy đăng nhập để đồng bộ và bảo lưu an toàn lên Cloud!</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleGoogleLogin}
                                className="px-3 py-1.5 bg-brand-cerulean text-white font-sans text-xs font-bold rounded-xs hover:bg-brand-cerulean/90 transition-colors shadow-xs"
                            >
                                Đăng nhập Google
                            </button>
                            <button
                                onClick={() => setShowGuestBanner(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 flex items-center justify-center transition-colors"
                                title="Đóng thông báo"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Trang Dashboard mặc định: Luôn hiển thị khi currentView === 'dashboard' HOẶC khi không khớp view nào */}
                {(!VALID_VIEWS.includes(currentView) || currentView === 'dashboard') && (
                    <DashboardView
                        programs={programs}
                        modules={modules}
                        events={events}
                        studyLogs={studyLogs}
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
                        onDeleteProgram={handleDeleteProgram}
                        onToggleEnrollProgram={handleToggleEnrollProgram}
                        onUpdateProgramStatus={handleUpdateProgramStatus}
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
                        onUpdateProgramStatus={handleUpdateProgramStatus}
                        onDeleteProgram={handleDeleteProgram}
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
                        modules={modules}
                        programs={programs}
                        activeModuleId={activeModuleId}
                        onSelectModule={(id) => setActiveModuleId(id)}
                        onUpdateModule={handleUpdateModule}
                        showToast={showToast}
                        navigate={navigate}
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

                {currentView === 'profile' && (
                    <ProfileView
                        profile={profile}
                        programs={programs}
                        navigate={navigate}
                        onUpdateProfile={handleUpdateProfile}
                        onOpenCertificate={() => setIsCertModalOpen(true)}
                    />
                )}
            </main>

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