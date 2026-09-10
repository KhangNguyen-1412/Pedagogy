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
import { MobileBottomNav } from './layouts/MobileBottomNav';
import {
    EditorialSelect,
    EditorialDatePicker,
    EditorialTimePicker,
    Modal,
    ToastNotification,
    AlertBox,
    ProgressBar,
    Skeleton,
    AppLayoutSkeleton,
    ViewSkeleton
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
import { ScrollProvider } from './context/ScrollContext';



// Pedagogical Training Views
import { PracticumView } from './views/training/PracticumView';
import { LessonPlansView } from './views/training/LessonPlansView';
import { CompetenciesView } from './views/training/CompetenciesView';
import { GraduationAuditView } from './views/training/GraduationAuditView';
import { PortfolioExportView } from './views/training/PortfolioExportView';

// Public Marketing & Information Suite
import { PublicLayout } from './views/public/PublicLayout';
import { LandingPageView } from './views/public/LandingPageView';
import { AboutView } from './views/public/AboutView';
import { FeaturesView } from './views/public/FeaturesView';
import { HistoryView } from './views/public/HistoryView';
import { ContactView } from './views/public/ContactView';
import { LoginPageView } from './views/public/LoginPageView';

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
    'practicum',
    'lesson_plans',
    'competencies',
    'graduation',
    'portfolio_export',
    'profile',
    'landing',
    'about',
    'features',
    'history',
    'contact',
    'login'
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

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success', duration = 3500) => {
        const id = Date.now();
        setToast({ message, type, id });
        setTimeout(() => {
            setToast(prev => (prev?.id === id ? null : prev));
        }, duration);
    };

    // Đảm bảo luôn trích xuất đúng string view hợp lệ và mặc định hiển thị Trang chủ Giới thiệu khi mới vào web
    const [currentView, setCurrentView] = useState(() => {
        if (typeof window === 'undefined') return 'landing';
        // Khi mới vào web ở địa chỉ gốc '/', lập tức vào ngay Trang chủ Giới thiệu
        if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/trang-chu') {
            return 'landing';
        }
        const parsed = getViewFromPath(window.location.pathname);
        const fromPath = resolveViewString(parsed);
        if (fromPath) return fromPath;
        const saved = localStorage.getItem('pedagogy_current_view');
        const fromSaved = resolveViewString(saved);
        if (fromSaved) return fromSaved;
        return 'landing';
    });

    const [authLoadingState, setAuthLoadingState] = useState(null); // 'logging_in' | 'logging_out' | null
    const [isViewTransitioning, setIsViewTransitioning] = useState(false);
    const isScrolledRef = useRef(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Reset scroll state on view transition
    useEffect(() => {
        isScrolledRef.current = false;
        setIsScrolled(false);
    }, [currentView]);

    const handleMainScroll = (e) => {
        const top = e.currentTarget.scrollTop;
        // Hysteresis: collapse when scrolling down past 35px; expand when scrolling back up (< 12px)
        // Eliminates continuous re-rendering storm and edge flickering
        const nextScrolled = isScrolledRef.current ? top > 12 : top > 35;
        if (nextScrolled !== isScrolledRef.current) {
            isScrolledRef.current = nextScrolled;
            setIsScrolled(nextScrolled);
        }
    };

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
            navigate('dashboard');
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
        } else {
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
            localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
            localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
            localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(studyLogs));
            localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
        }
    }, [user, profile, programs, modules, events, studyLogs, resources]);

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
            navigate('landing');
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

    const handleUpdateStudyLog = async (updatedLog) => {
        setStudyLogs(prev => prev.map(l => l.id === updatedLog.id ? updatedLog : l));
        const userId = getUserId(user);
        try { await setDoc(getDocRef(userId, 'studyLogs', updatedLog.id), updatedLog); } catch (err) {}
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
                const targetView = resolveViewString(e.state.currentView) || 'landing';
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
                    const target = resolveViewString(saved) || 'landing';
                    setCurrentView(target);
                }
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (view, data = {}) => {
        const targetView = resolveViewString(view) || 'dashboard';
        if (targetView !== currentView) {
            setIsViewTransitioning(true);
            setTimeout(() => setIsViewTransitioning(false), 280);
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        }
        setCurrentView(targetView);
        if (data.programId) setActiveProgramId(data.programId);
        if (data.moduleId) setActiveModuleId(data.moduleId);

        const seo = getSEOAndPath(targetView, data.programId || activeProgramId, data.moduleId || activeModuleId, programs, modules);
        if (typeof window !== 'undefined' && window.location.pathname !== seo.path) {
            window.history.pushState({ currentView: targetView, activeProgramId: data.programId || activeProgramId, activeModuleId: data.moduleId || activeModuleId }, '', seo.path);
        }
    };

    if (loading) {
        return <AppLayoutSkeleton currentView={currentView} />;
    }

    const handleEnterLMS = (targetView = 'dashboard') => {
        if (!user) {
            handleGoogleLogin();
            return;
        }
        navigate(typeof targetView === 'string' ? targetView : 'dashboard');
    };

    const PUBLIC_VIEWS = ['landing', 'about', 'features', 'history', 'contact'];
    if (PUBLIC_VIEWS.includes(currentView)) {
        return (
            <>
                {isViewTransitioning && (
                    <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-brand-cerulean via-brand-jasper to-brand-cerulean z-50 animate-route-progress pointer-events-none" />
                )}
                <PublicLayout
                    currentView={currentView}
                    navigate={navigate}
                    currentUser={user}
                    handleGoogleSignIn={handleGoogleLogin}
                    handleSignOut={handleSignOut}
                    handleEnterLMS={handleEnterLMS}
                >
                    {currentView === 'landing' && (
                        <LandingPageView
                            navigate={navigate}
                            currentUser={user}
                            handleGoogleSignIn={handleGoogleLogin}
                        />
                    )}
                    {currentView === 'about' && <AboutView navigate={navigate} />}
                    {currentView === 'features' && (
                        <FeaturesView
                            navigate={navigate}
                            currentUser={user}
                            handleGoogleSignIn={handleGoogleLogin}
                        />
                    )}
                    {currentView === 'history' && <HistoryView navigate={navigate} />}
                    {currentView === 'contact' && <ContactView navigate={navigate} />}
                </PublicLayout>
            </>
        );
    }

    // Nếu người dùng đã đăng nhập mà vẫn ở view 'login' -> tự động vào 'dashboard'
    if (user && currentView === 'login') {
        navigate('dashboard');
        return null;
    }

    // TRANG ĐĂNG NHẬP DÀNH RIÊNG & RÀO CHẮN XÁC THỰC QUẢN TRỊ
    if (currentView === 'login' || !user) {
        return (
            <>
                {isViewTransitioning && (
                    <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-brand-cerulean via-brand-jasper to-brand-cerulean z-50 animate-route-progress pointer-events-none" />
                )}
                <div key="login" className="animate-page-enter">
                    <LoginPageView
                        navigate={navigate}
                        handleGoogleSignIn={handleGoogleLogin}
                        authLoadingState={authLoadingState}
                        error={error}
                        setError={setError}
                    />
                </div>
            </>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-brand-cream relative">
            {isViewTransitioning && (
                <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-brand-cerulean via-brand-jasper to-brand-cerulean z-50 animate-route-progress pointer-events-none" />
            )}
            {/* Sidebar (Desktop only) */}
            <div className="hidden md:block">
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
            </div>

            {/* Mobile Header — app-style with page title */}
            {(() => {
                const viewLabels = {
                    dashboard: 'Tổng quan',
                    programs: 'Chương trình học',
                    program_detail: 'Chi tiết chương trình',
                    module_detail: 'Chi tiết môn học',
                    syllabus: 'Đề cương chi tiết',
                    calendar: 'Lịch biểu & Điểm danh',
                    gradebook: 'Sổ điểm & GPA',
                    resources: 'Học liệu & Nhật ký',
                    practicum: 'Thực tập sư phạm',
                    lesson_plans: 'Giáo án & Giảng thử',
                    competencies: 'Chuẩn nghề nghiệp',
                    graduation: 'Xét tốt nghiệp',
                    portfolio_export: 'Hồ sơ & Bảng điểm',
                    profile: 'Hồ sơ cá nhân',
                };
                const pageTitle = viewLabels[currentView] || 'Pedagogy';
                return (
                    <div className="md:hidden fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-brand-cerulean/10 px-3 h-11 flex items-center justify-between z-40 shadow-sm">
                        {/* Left — Logo tap to home */}
                        <div className="flex items-center gap-1.5 shrink-0 w-9" onClick={() => navigate('dashboard')}>
                            <img src={logoImg} alt="Logo" className="w-7 h-7 rounded-full" />
                        </div>
                        {/* Center — App branding */}
                        <div className="flex-1 text-center font-serif-title text-xs font-bold text-brand-cerulean tracking-wider uppercase opacity-80 truncate px-2">
                            Đào tạo Sư phạm
                        </div>
                        {/* Right — Avatar */}
                        <div className="flex items-center shrink-0 w-9 justify-end">
                            {profile && (
                                profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt="avatar"
                                        className="w-7 h-7 rounded-full border border-brand-cerulean/15"
                                        onClick={() => navigate('profile')}
                                    />
                                ) : (
                                    <div
                                        className="w-7 h-7 rounded-full bg-brand-cerulean/10 flex items-center justify-center text-brand-cerulean text-[11px] font-bold"
                                        onClick={() => navigate('profile')}
                                    >
                                        {(profile.fullName || 'U').charAt(0)}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Main Content Area (Independent Vertical Scroll with Page Transition Animation) */}
            <main key={currentView} onScroll={handleMainScroll} className="flex-1 h-full overflow-y-auto px-3.5 sm:px-4 md:px-12 pt-3.5 sm:pt-4 md:pt-12 pb-32 sm:pb-36 md:pb-20 mt-11 md:mt-0 animate-page-enter">
                <ScrollProvider isScrolled={isScrolled}>
                    {error && <AlertBox type="error" message={error} onClose={() => setError(null)} />}

                {isViewTransitioning ? (
                    <ViewSkeleton currentView={currentView} />
                ) : (
                    <>
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
                                studyLogs={studyLogs}
                                navigate={navigate}
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
                                modules={(filteredModules.length > 0 ? filteredModules : modules).filter(m => m.status === 'in_progress')}
                                studyLogs={studyLogs}
                                resources={resources}
                                events={events}
                                onAddStudyLog={handleAddStudyLog}
                                onUpdateStudyLog={handleUpdateStudyLog}
                                onDeleteStudyLog={handleDeleteStudyLog}
                                onAddResource={handleAddResource}
                                onDeleteResource={handleDeleteResource}
                                navigate={navigate}
                            />
                        )}

                        {currentView === 'practicum' && (
                            <PracticumView />
                        )}
                        {currentView === 'lesson_plans' && (
                            <LessonPlansView profile={profile} />
                        )}
                        {currentView === 'competencies' && (
                            <CompetenciesView />
                        )}
                        {currentView === 'graduation' && (
                            <GraduationAuditView profile={profile} />
                        )}
                        {currentView === 'portfolio_export' && (
                            <PortfolioExportView profile={profile} modules={modules} />
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
                    </>
                )}

                {/* Generous bottom clearance spacer ensuring floating bottom bar never obscures content */}
                <div className="h-10 sm:h-12 md:hidden pointer-events-none" aria-hidden="true" />
                </ScrollProvider>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav
                currentView={currentView}
                navigate={navigate}
                profile={profile}
                currentUser={user}
                handleSignOut={handleSignOut}
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