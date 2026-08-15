import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import vietnamLocations from './vietnamLocations.json';
import {
    X,
    LayoutDashboard,
    BookOpen,
    User,
    Menu,
    Plus,
    Target,
    Activity,
    ArrowLeft,
    Mail,
    Phone,
    ChevronDown,
    Check,
    Pencil,
    Trash2,
    Calendar,
    Award,
    FileText,
    FolderOpen,
    ExternalLink,
    CheckCircle2,
    Clock,
    GraduationCap,
    BookMarked,
    PlusCircle,
    Printer,
    ChevronLeft,
    ChevronRight,
    Grid,
    List,
    Link2,
    Search,
    Unlink,
    Users,
    TrendingUp,
    CheckSquare,
    Sparkles,
    AlertCircle,
    AlertTriangle,
    LogOut
} from 'lucide-react';
import {
    auth,
    googleProvider,
    signInWithPopup,
    onAuthStateChanged,
    getDoc,
    setDoc,
    deleteDoc,
    onSnapshot,
    getCollectionRef,
    getDocRef,
    setPersistence,
    browserLocalPersistence
} from './firebase';
import { signOut } from 'firebase/auth';
import { writeBatch } from 'firebase/firestore';
import logoImg from './assets/logo.png';
import {db} from './firebase';

import {
    DEFAULT_THPT_SUBJECTS,
    DEFAULT_THPT_YEARS,
    DEFAULT_THPT_EXAM_TYPES,
    DEFAULT_THPT_EXAMS,
    DEFAULT_THPT_PERSONAL_PROFILE,
    DEFAULT_THPT_RESULTS
} from './components/thpt/ThptDemoData';
import { ThptExamsView } from './components/thpt/ThptExamsView';
import { ThptPersonalGoalView } from './components/thpt/ThptPersonalGoalView';
import { ThptPersonalTrackingView } from './components/thpt/ThptPersonalTrackingView';
import { ThptAdmissionView } from './components/thpt/ThptAdmissionView';
import { AcademicTranscriptsView } from './components/thpt/AcademicTranscriptsView';
import { ThptPersonalTestModal } from './components/thpt/ThptPersonalTestModal';

// Helper for persistent User ID across page reloads
const getUserId = (currentUser) => {
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

// Storage Keys for Local Backup & Instant Persistence
const STORAGE_KEYS = {
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
};

const DEFAULT_PROFILE = {
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

// Helper to dynamically format module names containing bracketed placeholders with user's selected teaching subject
export const formatModuleName = (name, subject) => {
    if (!name) return '';
    if (!subject) return name;
    return name.replace(/\[[^\]]+\]/gi, subject);
};


// Automatic cleanup of initial demo mock data from LocalStorage
if (typeof window !== 'undefined' && localStorage.getItem('pedagogy_real_data_only') !== 'v1') {
    ['pedagogy_programs', 'pedagogy_modules', 'pedagogy_events', 'pedagogy_study_logs', 'pedagogy_resources'].forEach(key => {
        const item = localStorage.getItem(key);
        if (item && (item.includes('prog_nvsp_thcs_2026') || item.includes('mod_a01'))) {
            localStorage.removeItem(key);
        }
    });
    localStorage.setItem('pedagogy_real_data_only', 'v1');
}

// --- CUSTOM EDITORIAL DROPDOWN / SELECT COMPONENT ---
const EditorialSelect = ({ label, value, onChange, options, className = "", placeholder, direction = "auto", isMulti = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, openUpward: false });
    const dropdownRef = useRef(null);

    // Normalize value array when isMulti is active
    const selectedValues = isMulti
        ? (Array.isArray(value)
            ? value
            : (value ? String(value).split(', ').map(s => s.trim()).filter(Boolean) : []))
        : [];

    const selectedOption = !isMulti
        ? (options.find(opt => opt.value === value) || { label: placeholder || value, value })
        : null;

    let displayLabel = placeholder || 'Chọn...';
    if (isMulti) {
        if (selectedValues.length > 0) {
            const labels = options
                .filter(opt => selectedValues.includes(opt.value))
                .map(opt => opt.label);
            displayLabel = labels.length > 0 ? labels.join(', ') : selectedValues.join(', ');
        }
    } else {
        displayLabel = selectedOption?.label || selectedOption?.value || value || (placeholder || 'Chọn...');
    }

    const updateCoords = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = direction === "up" || (direction === "auto" && spaceBelow < 220 && rect.top > 220);
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left: rect.left,
                width: rect.width,
                openUpward: openUp
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !event.target.closest('.editorial-portal-select')
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (optValue) => {
        if (isMulti) {
            let updated;
            if (selectedValues.includes(optValue)) {
                updated = selectedValues.filter(v => v !== optValue);
            } else {
                updated = [...selectedValues, optValue];
            }
            onChange(updated);
        } else {
            onChange(optValue);
            setIsOpen(false);
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between py-2 border-b border-brand-cerulean font-body text-brand-ink text-left hover:border-brand-jasper focus:outline-none transition-colors bg-transparent group"
            >
                <span className="truncate text-lg" title={typeof displayLabel === 'string' ? displayLabel : ''}>{displayLabel}</span>
                <ChevronDown size={16} className={`text-brand-cerulean group-hover:text-brand-jasper transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                        top: coords.openUpward ? 'auto' : `${coords.top}px`,
                        bottom: coords.openUpward ? `${coords.bottom}px` : 'auto',
                        zIndex: 550
                    }}
                    className="editorial-portal-select bg-brand-cream border-editorial shadow-2xl max-h-56 overflow-y-auto animate-fade-in-down"
                >
                    {options.map((opt) => {
                        const isSelected = isMulti ? selectedValues.includes(opt.value) : value === opt.value;
                        return (
                            <div
                                key={opt.value}
                                onClick={() => handleSelectOption(opt.value)}
                                className={`px-4 py-2.5 text-base font-body cursor-pointer flex items-center justify-between transition-colors ${
                                    isSelected
                                        ? 'bg-brand-cerulean text-brand-cream font-semibold'
                                        : 'text-brand-ink hover:bg-brand-cerulean/10 hover:text-brand-jasper'
                                }`}
                            >
                                <span className="flex items-center gap-2 truncate">
                                    {isMulti && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="accent-brand-jasper w-4 h-4 cursor-pointer shrink-0"
                                        />
                                    )}
                                    <span className="truncate">{opt.label}</span>
                                </span>
                                {isSelected && <Check size={16} className="shrink-0 ml-2 text-brand-cream" />}
                            </div>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
};

// --- CUSTOM EDITORIAL DATE PICKER COMPONENT ---
const EditorialDatePicker = ({ label, value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, openUpward: false });
    const dateObj = value ? new Date(value) : new Date();
    const [viewDate, setViewDate] = useState(dateObj);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (value) {
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) setViewDate(parsed);
        }
    }, [value]);

    const updateCoords = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 310 && rect.top > 310;
            const left = Math.min(rect.left, window.innerWidth - 296);
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left: Math.max(10, left),
                openUpward: openUp
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !event.target.closest('.editorial-portal-datepicker')
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const prevMonth = (e) => { e.stopPropagation(); setViewDate(new Date(year, month - 1, 1)); };
    const nextMonth = (e) => { e.stopPropagation(); setViewDate(new Date(year, month + 1, 1)); };

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Mon = 0

    const formatDisplay = (val) => {
        if (!val) return 'Chọn ngày';
        const parts = val.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return val;
    };

    const handleSelectDay = (dayNum) => {
        const selected = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        onChange(selected);
        setIsOpen(false);
    };

    const handleSelectToday = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        onChange(todayStr);
        setViewDate(new Date());
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between py-2 border-b border-brand-cerulean font-body text-brand-ink text-left hover:border-brand-jasper focus:outline-none transition-colors bg-transparent group"
            >
                <span className="truncate text-lg">{formatDisplay(value)}</span>
                <Calendar size={18} className="text-brand-cerulean group-hover:text-brand-jasper transition-colors" />
            </button>

            {isOpen && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        left: `${coords.left}px`,
                        width: '288px',
                        top: coords.openUpward ? 'auto' : `${coords.top}px`,
                        bottom: coords.openUpward ? `${coords.bottom}px` : 'auto',
                        zIndex: 550
                    }}
                    className="editorial-portal-datepicker bg-brand-cream border-editorial shadow-2xl p-4 space-y-3 animate-fade-in-down"
                >
                    <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/20 font-serif-title">
                        <button type="button" onClick={prevMonth} className="p-1 text-brand-cerulean hover:text-brand-jasper">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-bold text-brand-cerulean">{monthNames[month]} {year}</span>
                        <button type="button" onClick={nextMonth} className="p-1 text-brand-cerulean hover:text-brand-jasper">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-serif-title text-brand-cerulean font-bold">
                        <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-sans text-sm">
                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-1"></div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const d = i + 1;
                            const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const isSelected = value === dStr;
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => handleSelectDay(d)}
                                    className={`p-1.5 rounded transition-all text-xs font-bold ${
                                        isSelected
                                            ? 'bg-brand-cerulean text-white shadow-sm'
                                            : 'hover:bg-brand-cerulean/10 text-brand-ink'
                                    }`}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-2 border-t border-brand-cerulean/20 text-right">
                        <button
                            type="button"
                            onClick={handleSelectToday}
                            className="text-xs font-serif-title text-brand-jasper hover:underline font-bold"
                        >
                            Hôm nay
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

// --- CUSTOM EDITORIAL TIME PICKER COMPONENT ---
const EditorialTimePicker = ({ label, value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, openUpward: false });
    const dropdownRef = useRef(null);

    const updateCoords = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 280 && rect.top > 280;
            const left = Math.min(rect.left, window.innerWidth - 264);
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left: Math.max(10, left),
                openUpward: openUp
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !event.target.closest('.editorial-portal-timepicker')
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    const timePresets = [
        { label: '07:30 (Sáng)', value: '07:30' },
        { label: '08:00 (Sáng)', value: '08:00' },
        { label: '08:30 (Sáng)', value: '08:30' },
        { label: '09:00 (Sáng)', value: '09:00' },
        { label: '10:00 (Sáng)', value: '10:00' },
        { label: '11:30 (Trưa)', value: '11:30' },
        { label: '13:30 (Chiều)', value: '13:30' },
        { label: '14:00 (Chiều)', value: '14:00' },
        { label: '15:30 (Chiều)', value: '15:30' },
        { label: '17:00 (Chiều)', value: '17:00' },
        { label: '18:00 (Tối)', value: '18:00' },
        { label: '19:30 (Tối)', value: '19:30' },
    ];

    const currentHour = value ? value.split(':')[0] : '08';
    const currentMin = value ? value.split(':')[1] : '00';

    const hours = Array.from({ length: 24 }).map((_, i) => String(i).padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between py-2 border-b border-brand-cerulean font-body text-brand-ink text-left hover:border-brand-jasper focus:outline-none transition-colors bg-transparent group"
            >
                <span className="truncate text-lg">{value || '08:00'}</span>
                <Clock size={18} className="text-brand-cerulean group-hover:text-brand-jasper transition-colors" />
            </button>

            {isOpen && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        left: `${coords.left}px`,
                        width: '256px',
                        top: coords.openUpward ? 'auto' : `${coords.top}px`,
                        bottom: coords.openUpward ? `${coords.bottom}px` : 'auto',
                        zIndex: 550
                    }}
                    className="editorial-portal-timepicker bg-brand-cream border-editorial shadow-2xl p-4 space-y-3 animate-fade-in-down"
                >
                    <div className="text-xs font-serif-title text-brand-cerulean font-bold border-b border-brand-cerulean/20 pb-1">
                        Chọn khung giờ phổ biến
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                        {timePresets.map(item => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => { onChange(item.value); setIsOpen(false); }}
                                className={`px-2 py-1 text-xs font-sans rounded text-left transition-colors ${
                                    value === item.value ? 'bg-brand-cerulean text-white font-bold' : 'hover:bg-brand-cerulean/10 text-brand-ink'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-brand-cerulean/20">
                        <div className="text-xs font-serif-title text-brand-cerulean font-bold mb-2">Tùy chỉnh Giờ & Phút</div>
                        <div className="flex gap-2 items-center">
                            <select
                                value={currentHour}
                                onChange={(e) => onChange(`${e.target.value}:${currentMin}`)}
                                className="input-editorial text-sm py-1 font-bold text-center w-full"
                            >
                                {hours.map(h => <option key={h} value={h}>{h} giờ</option>)}
                            </select>
                            <span className="font-bold font-serif-title text-brand-cerulean">:</span>
                            <select
                                value={currentMin}
                                onChange={(e) => onChange(`${currentHour}:${e.target.value}`)}
                                className="input-editorial text-sm py-1 font-bold text-center w-full"
                            >
                                {minutes.map(m => <option key={m} value={m}>{m} phút</option>)}
                            </select>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

// --- MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-md animate-backdrop-in">
            <div className="bg-brand-cream border-editorial p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-editorial relative animate-modal-pop-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-brand-cerulean hover:text-brand-jasper transition-colors p-1">
                    <X size={20} />
                </button>
                <h2 className="text-3xl font-serif-title text-brand-cerulean mb-6 pb-2 border-b border-brand-cerulean/30">{title}</h2>
                {children}
            </div>
        </div>,
        document.body
    );
};

// --- EDITORIAL TOAST NOTIFICATION COMPONENT ---
const ToastNotification = ({ toast, onClose }) => {
    if (!toast) return null;
    const isSuccess = toast.type === 'success';
    const isError = toast.type === 'error';

    return createPortal(
        <div className="fixed top-6 right-6 z-[600] animate-fade-in-down max-w-md">
            <div className={`flex items-center gap-3.5 px-5 py-3.5 shadow-2xl border ${
                isSuccess 
                    ? 'bg-brand-cerulean text-white border-brand-cerulean' 
                    : isError 
                        ? 'bg-brand-jasper text-white border-brand-jasper' 
                        : 'bg-gray-900 text-white border-gray-800'
            } rounded-sm min-w-[320px] font-sans relative overflow-hidden group`}>
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isSuccess ? 'bg-emerald-400' : isError ? 'bg-amber-400' : 'bg-blue-400'
                }`}></div>
                
                <div className="p-1 rounded-full bg-white/20 shrink-0 ml-1">
                    <CheckCircle2 size={18} />
                </div>
                
                <div className="flex-1 text-sm font-serif-title font-bold leading-snug tracking-wide">
                    {toast.message}
                </div>
                
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded transition-colors shrink-0 ml-1 text-white/80 hover:text-white"
                >
                    <X size={16} />
                </button>
            </div>
        </div>,
        document.body
    );
};

// --- RULE VALIDATION PANEL COMPONENT ---
const RuleValidationPanel = ({ program, modules }) => {
    const breakdown = calculateRuleBreakdown(program, modules);
    if (!breakdown) return null;
    const { evalType, blocks, totalEarned, totalTarget, unit, missingBlocks, isComplete } = breakdown;

    return (
        <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-cerulean/20 pb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-full ${isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isComplete ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
                    </div>
                    <div>
                        <h4 className="text-xl font-serif-title text-brand-cerulean font-bold">
                            Quy tắc Phân bổ & Kiểm tra Định mức ({evalType === 'credits' ? 'Hệ Tín chỉ' : evalType === 'modules' ? 'Hệ Chuyên đề' : 'Hệ Tiết học'})
                        </h4>
                        <p className="text-xs text-gray-500 font-sans mt-0.5">
                            {isComplete 
                                ? '✓ Tất cả các khối học phần đã đáp ứng đầy đủ định mức quy định!' 
                                : `⚠️ Còn ${missingBlocks.map(b => `${b.label}: thiếu ${b.target - b.current} ${b.unit}`).join(', ')}`}
                        </p>
                    </div>
                </div>
                <div className={`px-4 py-2 font-serif-title font-bold text-sm border rounded shrink-0 ${
                    isComplete ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                    Tổng tích lũy: {totalEarned} / {totalTarget} {unit}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {blocks.map(b => {
                    const isOk = b.current >= b.target && b.target > 0;
                    const isShort = b.current < b.target && b.target > 0;
                    const isOver = b.current > b.target && b.target > 0;
                    const diff = b.target - b.current;

                    return (
                        <div key={b.id || b.label} className={`p-3.5 border rounded-sm text-xs font-sans space-y-1.5 transition-all ${
                            isOk 
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                                : isShort 
                                    ? 'bg-amber-50/80 border-amber-300 text-amber-950' 
                                    : isOver
                                        ? 'bg-blue-50/80 border-blue-300 text-blue-950'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}>
                            <div className="font-serif-title font-bold text-xs truncate">{b.label}</div>
                            <div className="text-lg font-bold font-serif-title text-brand-cerulean">
                                {b.current} <span className="text-xs text-gray-500 font-normal">/ {b.target} {b.unit}</span>
                            </div>
                            <div className="font-bold text-[11px]">
                                {b.target === 0 ? (
                                    <span className="text-gray-400 font-normal">Không quy định</span>
                                ) : isOk && !isOver ? (
                                    <span className="text-emerald-700">✓ Đã đủ định mức</span>
                                ) : isOver ? (
                                    <span className="text-blue-700">ℹ️ Vượt {b.current - b.target} {b.unit}</span>
                                ) : (
                                    <span className="text-amber-700">⚠️ Thiếu {diff} {b.unit}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- CERTIFICATE MODAL COMPONENT ---
const CertificateModal = ({ isOpen, onClose, profile, program, overall }) => {
    if (!isOpen) return null;

    const today = new Date();
    const formattedDate = `Thành phố Hồ Chí Minh, ngày ${String(today.getDate()).padStart(2, '0')} tháng ${String(today.getMonth() + 1).padStart(2, '0')} năm ${today.getFullYear()}`;
    const certNo = `NV ${profile?.studentId?.replace(/[^0-9]/g, '') || '13861'}`;
    const issueNo = `01/QĐ11022K18HN${profile?.studentId?.replace(/[^0-9]/g, '') || '185'}`;

    return createPortal(
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-backdrop-in"
        >
            {/* Inject Landscape Print Rule */}
            <style>{`
                @media print {
                    @page { size: A4 landscape; margin: 10mm; }
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>

            {/* FIXED TOP FLOATING ACTION BAR (Always visible & fixed above scroll area) */}
            <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[310] flex items-center justify-between gap-4 bg-gray-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md max-w-4xl w-[92vw] md:w-auto print:hidden border border-white/20">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold font-serif-title text-sm truncate">
                    <Award size={18} />
                    <span className="truncate">Chứng chỉ tốt nghiệp Nghiệp vụ Sư phạm</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#b8952b] text-white text-xs font-sans font-bold shadow transition-colors flex items-center gap-1.5 rounded-full"
                    >
                        <Printer size={14} /> In / Tải Chứng chỉ
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-300 hover:text-white rounded-full bg-white/10 hover:bg-red-600 transition-all"
                        title="Đóng cửa sổ (Hoặc bấm ra ngoài)"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Certificate Paper Container with max-h and scroll fallback */}
            <div className="bg-[#FFFDF5] border-[8px] md:border-[12px] border-[#D4AF37] p-5 md:p-8 w-full max-w-5xl shadow-2xl relative rounded-sm mt-14 mb-4 max-h-[85vh] overflow-y-auto font-serif animate-modal-pop-in">
                {/* Inner Ornamental Certificate Border */}
                <div className="border-2 md:border-4 border-[#D4AF37] p-4 md:p-8 relative bg-amber-50/20 shadow-inner min-h-[440px] flex flex-col justify-between">
                    {/* Corner Flourishes */}
                    <div className="absolute top-1.5 left-1.5 w-6 h-6 md:w-7 md:h-7 border-t-4 border-l-4 border-[#D4AF37]"></div>
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 border-t-4 border-r-4 border-[#D4AF37]"></div>
                    <div className="absolute bottom-1.5 left-1.5 w-6 h-6 md:w-7 md:h-7 border-b-4 border-l-4 border-[#D4AF37]"></div>
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 border-b-4 border-r-4 border-[#D4AF37]"></div>

                    {/* Certificate Header Emblem */}
                    <div>
                        <div className="text-center space-y-1 mb-3">
                            <p className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-gray-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                            <p className="text-[11px] md:text-sm font-bold text-gray-700 underline underline-offset-4 decoration-double">Độc lập - Tự do - Hạnh phúc</p>
                        </div>

                        <div className="text-center space-y-1 mb-5">
                            <p className="text-xs md:text-base font-bold uppercase text-gray-800 tracking-wider">HIỆU TRƯỞNG TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH</p>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest my-0.5">CẤP</p>
                            <h1 className="text-3xl md:text-5xl font-serif font-black text-red-700 tracking-widest my-1 drop-shadow-sm">CHỨNG CHỈ</h1>
                            <h2 className="text-lg md:text-2xl font-serif font-bold text-gray-900 uppercase tracking-wide">NGHIỆP VỤ SƯ PHẠM</h2>
                        </div>
                    </div>

                    {/* Certificate Body Content */}
                    <div className="space-y-2.5 text-sm md:text-base text-gray-800 leading-relaxed px-2 md:px-12 font-serif my-2">
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dashed border-amber-400/60 pb-1 gap-2">
                            <span>Cho: <strong className="text-base md:text-lg text-gray-900 uppercase font-black tracking-wide ml-2">{profile?.fullName || 'NGUYỄN HUỲNH PHÚC KHANG'}</strong></span>
                            <span>Giới tính: <strong className="font-bold ml-2">{profile?.gender || 'Nam'}</strong></span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dashed border-amber-400/60 pb-1 gap-2">
                            <span>Sinh ngày: <strong className="font-bold ml-2">{profile?.dob || '01/01/2000'}</strong></span>
                            <span>Nơi sinh: <strong className="font-bold ml-2">{profile?.province || 'Thành phố Hồ Chí Minh'}</strong></span>
                        </div>
                        <div className="border-b border-dashed border-amber-400/60 pb-1">
                            <span>Đã hoàn thành chương trình: <em className="font-bold text-brand-cerulean text-base md:text-lg ml-2">{program?.name || profile?.major || 'Nghiệp vụ sư phạm THCS 2026'}</em></span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dashed border-amber-400/60 pb-1 gap-2">
                            <span>Điểm trung bình: <strong className="text-base text-red-700 font-bold ml-2">{overall?.gpa10 || '8.15'}</strong></span>
                            <span>Xếp loại: <strong className="text-base text-red-700 font-black uppercase tracking-wider ml-2">{overall?.rank || 'GIỎI'}</strong></span>
                        </div>
                    </div>

                    {/* Certificate Footer: Date, Signature & Red Seal */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center sm:items-end px-2 md:px-12 gap-4">
                        <div className="text-[11px] md:text-xs text-gray-600 space-y-1 text-center sm:text-left">
                            <p>Số hiệu: <strong className="text-red-700 text-sm font-mono font-bold">{certNo}</strong></p>
                            <p>Số vào sổ cấp chứng chỉ: <span className="font-mono text-gray-700">{issueNo}</span></p>
                        </div>

                        <div className="text-center relative min-w-[240px]">
                            <p className="text-[11px] md:text-xs text-gray-600 italic mb-1">{formattedDate}</p>
                            <p className="text-xs md:text-sm font-bold text-gray-800 uppercase">TL. HIỆU TRƯỞNG</p>
                            <p className="text-[11px] md:text-xs font-bold text-gray-700 uppercase">TRƯỞNG PHÒNG ĐÀO TẠO</p>
                            <div className="h-16 md:h-20 flex items-center justify-center my-1 relative">
                                {/* Red Stamp Simulation */}
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-red-600 flex items-center justify-center text-red-600 text-[9px] md:text-[10px] font-bold text-center leading-tight rotate-[-12deg] p-1.5 shadow-sm opacity-90 border-dashed">
                                    ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH ★
                                </div>
                                <span className="absolute font-serif italic text-blue-900 text-xl md:text-2xl font-bold rotate-[-10deg] pointer-events-none select-none drop-shadow">
                                    Nguyễn Văn A
                                </span>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-gray-900 mt-0.5">GS.TS Huỳnh Văn Sơn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

const AlertBox = ({ type = "info", message, onClose }) => {
    const colors = {
        info: "bg-blue-50 border-brand-cerulean text-brand-cerulean",
        error: "bg-red-50 border-brand-jasper text-brand-jasper",
        success: "bg-green-50 border-green-700 text-green-700"
    };
    return (
        <div className={`p-4 border ${colors[type]} flex justify-between items-start mb-4 shadow-sm`}>
            <span className="font-body text-lg">{message}</span>
            {onClose && <button onClick={onClose}><X size={16} /></button>}
        </div>
    );
};

const ProgressBar = ({ current, total, label }) => {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    return (
        <div className="w-full my-4">
            <div className="flex justify-between text-sm mb-1 font-serif-title text-brand-cerulean">
                <span>{label}</span>
                <span>{current} / {total} ({percentage}%)</span>
            </div>
            <div className="w-full bg-brand-cerulean/10 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-jasper h-2 transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const DEFAULT_PROGRAMS = [
    {
        id: "prog_nvsp_thcs_2026",
        name: "Nghiệp vụ sư phạm THCS 2026",
        description: "Khóa đào tạo bồi dưỡng nghiệp vụ sư phạm cấp THCS dành cho cử nhân các chuyên ngành phù hợp.",
        category: "nhanh_a",
        evaluationType: "credits",
        totalCreditsRequired: 34,
        status: "active",
        isEnrolled: true,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
    },
    {
        id: "prog_nvsp_thpt_2026",
        name: "Nghiệp vụ sư phạm THPT 2026",
        description: "Khóa đào tạo bồi dưỡng nghiệp vụ sư phạm cấp THPT chuẩn quy định mới của Bộ Giáo dục & Đào tạo.",
        category: "nhanh_a",
        evaluationType: "credits",
        totalCreditsRequired: 36,
        status: "active",
        isEnrolled: true,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 11, practiceB: 6, electiveB: 2 }
    }
];

const getCategoryPresets = (category) => {
    if (category === 'nhanh_b') {
        return {
            evaluationType: 'modules',
            totalCreditsRequired: 6,
            rules: { mandatoryA: 4, electiveA: 2, mandatoryB: 0, practiceB: 0, electiveB: 0 }
        };
    }
    if (category === 'nhanh_c') {
        return {
            evaluationType: 'hours',
            totalCreditsRequired: 120,
            rules: { mandatoryA: 80, electiveA: 40, mandatoryB: 0, practiceB: 0, electiveB: 0 }
        };
    }
    // nhanh_a (default NVSP)
    return {
        evaluationType: 'credits',
        totalCreditsRequired: 34,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
    };
};

const normalizeProgram = (prog) => {
    if (!prog) return prog;
    const category = prog.category || (prog.rules ? 'nhanh_a' : 'nhanh_b');
    let defaultEval = 'credits';
    if (category === 'nhanh_b') defaultEval = 'modules';
    else if (category === 'nhanh_c') defaultEval = 'hours';
    return {
        ...prog,
        category,
        evaluationType: prog.evaluationType || defaultEval
    };
};

const calculateRuleBreakdown = (program, modules = []) => {
    if (!program) return null;
    const progModules = modules.filter(m => isModuleInProgram(m, program.id));
    const evalType = program.evaluationType || (program.category === 'nhanh_b' ? 'modules' : program.category === 'nhanh_c' ? 'hours' : 'credits');
    const rules = program.rules || { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 };

    if (evalType === 'credits') {
        const activeMods = progModules.filter(m => m.type !== 'elective' || m.isSelected);

        const currentMandatoryA = activeMods.filter(m => (m.category === 'A' || !m.category) && m.type === 'mandatory').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentElectiveA = activeMods.filter(m => (m.category === 'A' || !m.category) && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentMandatoryB = activeMods.filter(m => m.category === 'B' && m.type === 'mandatory').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentPracticeB = activeMods.filter(m => m.category === 'B' && m.type === 'practice').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentElectiveB = activeMods.filter(m => m.category === 'B' && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);

        const targetMandatoryA = rules.mandatoryA ?? 15;
        const targetElectiveA = rules.electiveA ?? 2;
        const targetMandatoryB = rules.mandatoryB ?? 9;
        const targetPracticeB = rules.practiceB ?? 6;
        const targetElectiveB = rules.electiveB ?? 2;

        const totalEarned = currentMandatoryA + currentElectiveA + currentMandatoryB + currentPracticeB + currentElectiveB;
        const totalTarget = program.totalCreditsRequired || (targetMandatoryA + targetElectiveA + targetMandatoryB + targetPracticeB + targetElectiveB);

        const blocks = [
            { id: 'mandatoryA', label: 'Khối A Bắt buộc', current: currentMandatoryA, target: targetMandatoryA, unit: 'TC' },
            { id: 'electiveA', label: 'Khối A Tự chọn', current: currentElectiveA, target: targetElectiveA, unit: 'TC' },
            { id: 'mandatoryB', label: 'Khối B Bắt buộc', current: currentMandatoryB, target: targetMandatoryB, unit: 'TC' },
            { id: 'practiceB', label: 'Khối B Thực hành', current: currentPracticeB, target: targetPracticeB, unit: 'TC' },
            { id: 'electiveB', label: 'Khối B Tự chọn', current: currentElectiveB, target: targetElectiveB, unit: 'TC' },
        ];

        const missingBlocks = blocks.filter(b => b.target > 0 && b.current < b.target);
        const isComplete = missingBlocks.length === 0 && totalEarned >= totalTarget;

        return {
            evalType,
            blocks,
            totalEarned,
            totalTarget,
            unit: 'TC',
            missingBlocks,
            isComplete
        };
    }

    if (evalType === 'modules') {
        const passedCount = progModules.filter(m => {
            const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
            return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
        }).length;
        const totalCount = progModules.length;
        const targetCount = program.totalCreditsRequired || rules.mandatoryA || 6;
        const isComplete = passedCount >= targetCount && totalCount >= targetCount;

        return {
            evalType,
            blocks: [
                { id: 'modules', label: 'Số chuyên đề đã hoàn thành', current: passedCount, target: targetCount, unit: 'môn' }
            ],
            totalEarned: passedCount,
            totalTarget: targetCount,
            unit: 'môn',
            missingBlocks: passedCount < targetCount ? [{ label: 'Chuyên đề', current: passedCount, target: targetCount, unit: 'môn' }] : [],
            isComplete
        };
    }

    // hours
    const totalHoursLearned = progModules.filter(m => m.status === 'completed' || calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0).reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
    const targetHours = program.totalCreditsRequired || 120;
    const isComplete = totalHoursLearned >= targetHours;

    return {
        evalType,
        blocks: [
            { id: 'hours', label: 'Thời lượng tích lũy', current: totalHoursLearned, target: targetHours, unit: 'tiết' }
        ],
        totalEarned: totalHoursLearned,
        totalTarget: targetHours,
        unit: 'tiết',
        missingBlocks: totalHoursLearned < targetHours ? [{ label: 'Thời lượng', current: totalHoursLearned, target: targetHours, unit: 'tiết' }] : [],
        isComplete
    };
};

// Normalize legacy programId (string) → programIds (array) for shared module support
const normalizeModuleProgramIds = (mod) => {
    if (!mod) return mod;
    if (mod.programIds && Array.isArray(mod.programIds) && mod.programIds.length > 0) {
        // Already normalized — remove legacy field if present
        const { programId, ...rest } = mod;
        return rest;
    }
    if (mod.programId) {
        const { programId, ...rest } = mod;
        return { ...rest, programIds: [programId] };
    }
    return { ...mod, programIds: mod.programIds || [] };
};

const isModuleInProgram = (mod, progId) => {
    if (!mod || !progId) return false;
    if (mod.programIds && Array.isArray(mod.programIds) && mod.programIds.length > 0) {
        return mod.programIds.includes(progId);
    }
    return mod.programId === progId;
};

// Get human-readable names of programs a module belongs to
const getModuleProgramNames = (mod, programs) => {
    const ids = mod.programIds || (mod.programId ? [mod.programId] : []);
    return ids.map(id => programs.find(p => p.id === id)?.name || id).filter(Boolean);
};

const getFilteredModules = (modules = [], programs = [], selectedProgramFilter = 'all') => {
    let activePrograms = (programs || []).filter(p => p.isEnrolled !== false);
    if (selectedProgramFilter !== 'all') {
        activePrograms = (programs || []).filter(p => p.id === selectedProgramFilter);
    }
    const activeIds = activePrograms.map(p => p.id);
    if (activeIds.length === 0) {
        if (selectedProgramFilter === 'all') return modules || [];
        return [];
    }
    return (modules || []).filter(m => activeIds.some(pId => isModuleInProgram(m, pId)));
};

// ─── GPA HELPER FUNCTIONS ──────────────────────────────────────────────────
const calculateModuleFinal = (grades, weights = { attendance: 10, midterm: 30, final: 60 }) => {
    const att = Number(grades?.attendance || 0);
    const mid = Number(grades?.midterm || 0);
    const fin = Number(grades?.final || 0);
    const wAtt = (weights?.attendance || 10) / 100;
    const wMid = (weights?.midterm || 30) / 100;
    const wFin = (weights?.final || 60) / 100;
    const score10 = Math.round((att * wAtt + mid * wMid + fin * wFin) * 10) / 10;
    
    let letter = 'F';
    let gpa4 = 0.0;
    if (score10 >= 9.0) { letter = 'A+'; gpa4 = 4.0; }
    else if (score10 >= 8.5) { letter = 'A'; gpa4 = 3.8; }
    else if (score10 >= 8.0) { letter = 'B+'; gpa4 = 3.5; }
    else if (score10 >= 7.0) { letter = 'B'; gpa4 = 3.0; }
    else if (score10 >= 6.5) { letter = 'C+'; gpa4 = 2.5; }
    else if (score10 >= 5.5) { letter = 'C'; gpa4 = 2.0; }
    else if (score10 >= 5.0) { letter = 'D+'; gpa4 = 1.5; }
    else if (score10 >= 4.0) { letter = 'D'; gpa4 = 1.0; }
    else { letter = 'F'; gpa4 = 0.0; }

    return { score10, letter, gpa4 };
};

const calculateOverallGPA = (modules, programs = [], selectedProgramFilter = 'all') => {
    let totalWeightedScore10 = 0;
    let totalWeightedGPA4 = 0;
    let totalGradedCredits = 0;
    let earnedCredits = 0;

    let activePrograms = programs.filter(p => p.isEnrolled !== false && p.status !== 'completed');
    if (selectedProgramFilter !== 'all') {
        activePrograms = programs.filter(p => p.id === selectedProgramFilter);
    }
    const activeProgramIds = activePrograms.map(p => p.id);

    // Deduplicate: each module counted only once even if shared across programs
    const seenModuleIds = new Set();
    const activeMods = modules.filter(m => {
        if (seenModuleIds.has(m.id)) return false;
        const inProg = activeProgramIds.length === 0 || activeProgramIds.some(pId => isModuleInProgram(m, pId));
        const isSelectedType = m.type !== 'elective' || m.isSelected;
        if (inProg && isSelectedType) {
            seenModuleIds.add(m.id);
            return true;
        }
        return false;
    });

    const totalProgramCredits = activeMods.reduce((sum, m) => sum + Number(m.credits || 0), 0);

    activeMods.forEach(m => {
        const cr = Number(m.credits || 0);
        if (m.grades) {
            const { score10, letter, gpa4 } = calculateModuleFinal(m.grades, m.syllabus?.weights);
            totalWeightedScore10 += score10 * cr;
            totalWeightedGPA4 += gpa4 * cr;
            totalGradedCredits += cr;
            if (letter !== 'F' && score10 >= 4.0) {
                earnedCredits += cr;
            }
        }
    });

    const gpa10 = totalGradedCredits > 0 ? (totalWeightedScore10 / totalGradedCredits).toFixed(2) : '0.00';
    const gpa4 = totalGradedCredits > 0 ? (totalWeightedGPA4 / totalGradedCredits).toFixed(2) : '0.00';

    let rank = 'Chưa xếp loại';
    const num4 = parseFloat(gpa4);
    if (num4 >= 3.6) rank = 'Xuất sắc';
    else if (num4 >= 3.2) rank = 'Giỏi';
    else if (num4 >= 2.5) rank = 'Khá';
    else if (num4 >= 2.0) rank = 'Trung bình';
    else if (totalGradedCredits > 0) rank = 'Yếu - Yêu cầu cố gắng';

    return {
        gpa10,
        gpa4,
        totalCredits: totalGradedCredits,
        earnedCredits,
        totalProgramCredits,
        activeModulesCount: activeMods.length,
        rank
    };
};

// ─── VIEWS ─────────────────────────────────────────────────────────────────

// 1. DASHBOARD VIEW
const DashboardView = ({
    programs,
    modules,
    events,
    studyLogs,
    thptProfile,
    thptExams = [],
    thptResults = [],
    thptSubjects = [],
    navigate,
    onOpenCertificate,
    selectedProgramFilter = 'all',
    setSelectedProgramFilter
}) => {
    const normalizedPrograms = programs.map(normalizeProgram);
    const activePrograms = selectedProgramFilter === 'all'
        ? normalizedPrograms.filter(p => p.isEnrolled !== false && p.status !== 'completed')
        : normalizedPrograms.filter(p => p.id === selectedProgramFilter);

    const currentProg = selectedProgramFilter !== 'all' ? normalizedPrograms.find(p => p.id === selectedProgramFilter) : null;
    const evalType = currentProg?.evaluationType || (currentProg?.category === 'nhanh_b' ? 'modules' : currentProg?.category === 'nhanh_c' ? 'hours' : 'credits');

    const programOptions = [
        { label: '🌟 Tất cả chương trình học', value: 'all' },
        ...normalizedPrograms.map(p => ({
            label: `${p.name} (${p.evaluationType === 'modules' ? 'Hệ Chuyên đề' : p.evaluationType === 'hours' ? 'Hệ Tiết học' : 'Hệ Tín chỉ'})`,
            value: p.id
        }))
    ];

    const overall = calculateOverallGPA(modules, normalizedPrograms, selectedProgramFilter);
    const upcomingEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);

    // THPT Preparation Calculations (Personalized & Clean)
    const thptExamDate = new Date('2026-06-26T07:30:00');
    const today = new Date();
    const diffTime = thptExamDate - today;
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const thptResultsCount = (thptResults || []).length;
    const avgScore = thptResultsCount > 0
        ? (thptResults.reduce((s, r) => s + (Number(r.score) || 0), 0) / thptResultsCount).toFixed(1)
        : '--';
    const maxScore = thptResultsCount > 0
        ? Math.max(...thptResults.map(r => Number(r.score) || 0)).toFixed(1)
        : '--';

    // Compute dynamic metric cards based on selectedProgramFilter and evalType
    let metricCards = null;
    if (selectedProgramFilter === 'all' || evalType === 'credits') {
        metricCards = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-cerulean/10 text-brand-cerulean">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Tín chỉ tích lũy</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">
                            {overall.earnedCredits} <span className="text-lg text-gray-500 font-normal">/ {overall.totalProgramCredits} TC</span>
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Bắt buộc + Thực hành + Tự chọn</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-jasper/10 text-brand-jasper">
                        <Award size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Điểm Hệ 10</span>
                        <h4 className="text-3xl font-serif-title text-brand-jasper font-bold">{overall.gpa10} <span className="text-sm font-normal text-gray-500">/ 10</span></h4>
                        <span className="text-xs text-gray-500 font-sans">Trung bình tích lũy</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-800">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Số môn đang xem</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">{overall.activeModulesCount} Môn</h4>
                        <span className="text-xs text-gray-500 font-sans">Bắt buộc, thực hành & tự chọn</span>
                    </div>
                </div>
            </div>
        );
    } else if (evalType === 'modules') {
        const progModules = modules.filter(m => isModuleInProgram(m, currentProg.id));
        const passedMods = progModules.filter(m => {
            const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
            return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
        });
        const isEligible = passedMods.length >= progModules.length && progModules.length > 0;

        metricCards = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-cerulean/10 text-brand-cerulean">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Chuyên đề đã Đạt</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">
                            {passedMods.length} <span className="text-lg text-gray-500 font-normal">/ {progModules.length} chuyên đề</span>
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Đánh giá theo môn & bài thu hoạch</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-800">
                        <Award size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Cấp chứng chỉ</span>
                        <h4 className="text-xl font-serif-title text-emerald-800 font-bold">
                            {isEligible ? '✓ Đủ điều kiện' : 'Chưa đủ điều kiện'}
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">{isEligible ? 'Đã hoàn thành toàn bộ chuyên đề' : `Cần đạt thêm ${progModules.length - passedMods.length} chuyên đề`}</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-jasper/10 text-brand-jasper">
                        <FileCheck size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Bài thu hoạch / Đồ án</span>
                        <h4 className="text-3xl font-serif-title text-brand-jasper font-bold">
                            {passedMods.length} / {progModules.length}
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Trạng thái hoàn thành chuyên đề</span>
                    </div>
                </div>
            </div>
        );
    } else if (evalType === 'hours') {
        const progModules = modules.filter(m => isModuleInProgram(m, currentProg.id));
        const totalHours = progModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
        const completedHours = progModules.filter(m => {
            const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
            return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
        }).reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);

        metricCards = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-cerulean/10 text-brand-cerulean">
                        <Clock size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Thời lượng tích lũy</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">
                            {completedHours} <span className="text-lg text-gray-500 font-normal">/ {totalHours} tiết</span>
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Thời lượng tham gia học tập</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-800">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Chuyên cần & Tham gia</span>
                        <h4 className="text-3xl font-serif-title text-blue-900 font-bold">
                            {totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0}%
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Tỷ lệ tích lũy giờ học</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-jasper/10 text-brand-jasper">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Mô-đun hoàn thành</span>
                        <h4 className="text-3xl font-serif-title text-brand-jasper font-bold">
                            {progModules.filter(m => m.status === 'completed').length} / {progModules.length} Mô-đun
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Số bài học / kỹ năng đã hoàn thành</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-5xl font-serif-title text-brand-cerulean mb-2">Tổng quan học tập.</h2>
                    <p className="text-xl text-gray-600 font-body">Hệ thống quản lý tiến độ & kết quả cá nhân đa mô hình.</p>
                </div>
                <div className="flex gap-4 items-center flex-wrap w-full md:w-auto">
                    {(selectedProgramFilter === 'all' || evalType === 'credits') && (
                        <>
                            <div className="bg-brand-cerulean text-white p-3.5 text-center border-editorial shadow-editorial min-w-[100px]">
                                <span className="text-[10px] uppercase tracking-widest block opacity-80">GPA (Hệ 4)</span>
                                <span className="text-2xl font-serif-title font-bold">{overall.gpa4}</span>
                            </div>
                            <div className="bg-brand-jasper text-white p-3.5 text-center border-editorial shadow-editorial min-w-[100px]">
                                <span className="text-[10px] uppercase tracking-widest block opacity-80">Xếp loại</span>
                                <span className="text-lg font-serif-title font-bold">{overall.rank}</span>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Quick Metrics Grid */}
            {metricCards}

            {/* THPT Preparation & University Goal Section */}
            <section className="bg-white border-editorial p-6 sm:p-8 shadow-editorial relative overflow-hidden space-y-6">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-jasper"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-widest text-brand-jasper font-bold flex items-center gap-1.5">
                                <GraduationCap size={14} /> Kỳ thi Tốt nghiệp THPT 2026
                            </span>
                            {diffDays > 0 && (
                                <span className="px-2 py-0.5 bg-brand-jasper/10 text-brand-jasper font-bold text-[11px] rounded border border-brand-jasper/20">
                                    Còn {diffDays} ngày
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                            Mục tiêu Ôn thi & Luyện đề THPT Quốc gia
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate('thpt_tracking')}
                            className="px-3.5 py-1.5 bg-brand-jasper text-white font-sans text-xs font-bold shadow-sm hover:bg-brand-cerulean transition-all flex items-center gap-1.5 rounded"
                        >
                            <Plus size={13} /> Nhập điểm bài làm
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('thpt_goals')}
                            className="px-3.5 py-1.5 bg-brand-cream border border-brand-cerulean/30 hover:border-brand-jasper text-brand-cerulean text-xs font-bold shadow-sm transition-all rounded"
                        >
                            Quản lý mục tiêu &rarr;
                        </button>
                    </div>
                </div>

                {/* THPT KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Goal Card */}
                    <div className="p-4 bg-brand-cream border border-brand-cerulean/15 rounded space-y-1">
                        <span className="text-xs text-gray-500 font-serif block">Trường & Ngành mục tiêu</span>
                        <h4 className={`text-base font-serif-title font-bold line-clamp-1 ${thptProfile?.targetUniversity ? 'text-brand-cerulean' : 'text-gray-400 italic'}`}>
                            {thptProfile?.targetUniversity || 'Chưa thiết lập mục tiêu'}
                        </h4>
                        <div className="flex items-center justify-between pt-2 border-t border-brand-cerulean/10 text-xs">
                            <span className="text-gray-500">Khối: <strong>{thptProfile?.combination || '--'}</strong></span>
                            <span className="text-brand-jasper font-bold font-serif-title">
                                Mục tiêu: {thptProfile?.targetTotalScore > 0 ? `${thptProfile.targetTotalScore} đ` : '--'}
                            </span>
                        </div>
                    </div>

                    {/* Progress & Average Score */}
                    <div className="p-4 bg-brand-cream border border-brand-cerulean/15 rounded space-y-1">
                        <span className="text-xs text-gray-500 font-serif block">Tiến độ Luyện đề</span>
                        <div className="flex items-baseline justify-between">
                            <h4 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                {thptResultsCount} <span className="text-xs font-sans text-gray-500 font-normal">lượt đã luyện</span>
                            </h4>
                            <span className="text-xs font-bold text-brand-jasper">
                                ĐTB: {avgScore} {avgScore !== '--' ? 'đ' : ''}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-brand-cerulean/10 text-xs text-gray-500">
                            <span>Kỷ lục cao nhất: <strong className="text-emerald-700">{maxScore !== '--' ? `${maxScore} đ` : '--'}</strong></span>
                            <button onClick={() => navigate('thpt_tracking')} className="text-brand-cerulean hover:underline font-bold">
                                Xem biểu đồ
                            </button>
                        </div>
                    </div>

                    {/* Mistakes & Tips */}
                    <div className="p-4 bg-brand-cream border border-brand-cerulean/15 rounded space-y-1">
                        <span className="text-xs text-gray-500 font-serif block">Sổ tay Rút kinh nghiệm</span>
                        <div className="flex items-baseline justify-between">
                            <h4 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                {(thptProfile?.mistakeNotes || []).length} <span className="text-xs font-sans text-gray-500 font-normal">ghi chú bẫy/lỗi</span>
                            </h4>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-brand-cerulean/10 text-xs">
                            <span className="text-gray-500 truncate max-w-[170px]">
                                {(thptProfile?.mistakeNotes || []).length > 0 ? (thptProfile.mistakeNotes[0].title) : 'Chưa có ghi chú'}
                            </span>
                            <button onClick={() => navigate('thpt_goals')} className="text-brand-jasper hover:underline font-bold shrink-0">
                                Mở sổ tay
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Mistake Tip Banner (if any mistake exists) */}
                {(thptProfile?.mistakeNotes || []).length > 0 && (
                    <div className="p-3 bg-red-50/60 border border-brand-jasper/20 rounded flex items-start gap-3">
                        <AlertCircle size={16} className="text-brand-jasper shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-700 font-body">
                            <strong className="text-brand-jasper font-serif-title">Ghi nhớ bẫy đề thi gần nhất:</strong> {thptProfile.mistakeNotes[0].title} — <span className="italic">{thptProfile.mistakeNotes[0].remedy || thptProfile.mistakeNotes[0].mistake}</span>
                        </div>
                    </div>
                )}
            </section>

            {/* Certificate Quick Banner */}
            <section className="bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-blue-100/40 border-2 border-brand-cerulean/60 p-6 shadow-editorial flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-brand-cerulean text-white rounded-full shadow-md shrink-0">
                        <Award size={32} />
                    </div>
                    <div>
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-bold font-serif-title uppercase tracking-wider rounded border border-red-200">
                            Bản Mẫu Chuẩn Bộ Giáo Dục & Đào Tạo
                        </span>
                        <h4 className="text-xl font-serif-title text-brand-cerulean font-bold mt-1">Chứng chỉ Nghiệp vụ Sư phạm Chính thức</h4>
                        <p className="text-sm text-brand-cerulean/80 font-body">Xem bản chứng nhận hoàn thành khóa học nghiệp vụ sư phạm cá nhân hóa với dấu đỏ & chữ ký.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenCertificate}
                    className="px-6 py-3 bg-brand-cerulean text-white font-serif-title font-bold text-sm shadow-editorial hover:bg-brand-cerulean/80 transition-all shrink-0 flex items-center gap-2"
                >
                    <Award size={18} /> Xem & In Chứng chỉ
                </button>
            </section>

            {/* Program Progress */}
            <section className="bg-white border-editorial p-6 shadow-editorial">
                <h3 className="text-2xl font-serif-title text-brand-cerulean mb-4 border-b border-brand-cerulean/20 pb-2">Chương trình đang theo học</h3>
                {activePrograms.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-brand-cerulean/30">
                        <p className="text-gray-500 mb-4">Bạn chưa đăng ký chương trình học nào.</p>
                        <button onClick={() => navigate('programs')} className="px-6 py-2 bg-brand-cerulean text-white font-serif-title">Xem danh sách chương trình</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activePrograms.map(prog => {
                            const pEval = prog.evaluationType || (prog.category === 'nhanh_b' ? 'modules' : prog.category === 'nhanh_c' ? 'hours' : 'credits');
                            const progModules = modules.filter(m => isModuleInProgram(m, prog.id));

                            if (pEval === 'credits') {
                                const activeProgMods = progModules.filter(m => m.type !== 'elective' || m.isSelected);
                                const progActiveCredits = activeProgMods.reduce((s, m) => s + Number(m.credits || 0), 0);
                                const progEarnedCredits = activeProgMods.reduce((s, m) => {
                                    if (m.grades) {
                                        const { score10 } = calculateModuleFinal(m.grades, m.syllabus?.weights);
                                        if (score10 >= 4.0) return s + Number(m.credits || 0);
                                    }
                                    return s;
                                }, 0);
                                const targetCredits = progActiveCredits || 1;

                                return (
                                    <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                            <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-xs font-bold font-serif-title rounded border border-brand-cerulean/20 shrink-0">Hệ Tín chỉ</span>
                                        </div>
                                        <p className="text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                        <ProgressBar current={progEarnedCredits} total={targetCredits} label="Tiến độ tích lũy tín chỉ" />
                                    </div>
                                );
                            }

                            if (pEval === 'modules') {
                                const passedMods = progModules.filter(m => {
                                    const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
                                    return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
                                });
                                return (
                                    <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold font-serif-title rounded border border-emerald-300 shrink-0">Hệ Chuyên đề</span>
                                        </div>
                                        <p className="text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                        <ProgressBar current={passedMods.length} total={progModules.length || 1} label={`Chuyên đề đã Đạt: ${passedMods.length}/${progModules.length}`} />
                                    </div>
                                );
                            }

                            // Hours
                            const totalH = progModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
                            const doneH = progModules.filter(m => m.status === 'completed' || calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0).reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
                            return (
                                <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold font-serif-title rounded border border-blue-300 shrink-0">Hệ Tiết học</span>
                                    </div>
                                    <p className="text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                    <ProgressBar current={doneH} total={totalH || 1} label={`Thời lượng đã học: ${doneH}/${totalH} tiết`} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Upcoming Schedule */}
            <section className="bg-white border-editorial p-6 shadow-editorial">
                <div className="flex justify-between items-center mb-4 border-b border-brand-cerulean/20 pb-2">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean flex items-center gap-2">
                        <Calendar size={22} /> Lịch học & Thi sắp tới
                    </h3>
                    <button onClick={() => navigate('calendar')} className="text-sm font-serif-title text-brand-jasper hover:underline">
                        Xem lịch đầy đủ &rarr;
                    </button>
                </div>
                {upcomingEvents.length === 0 ? (
                    <p className="text-gray-500 italic">Chưa có lịch học/thi nào được lên kế hoạch.</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingEvents.map(evt => (
                            <div key={evt.id} className="p-4 border-l-4 border-brand-cerulean bg-brand-cream flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-gray-500">{evt.date} &bull; {evt.startTime} - {evt.endTime}</span>
                                    <h5 className="text-lg font-serif-title text-brand-cerulean">{evt.title}</h5>
                                    <span className="text-xs text-gray-600">{evt.location}</span>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase ${evt.attendanceStatus === 'present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {evt.attendanceStatus === 'present' ? 'Có mặt' : 'Kế hoạch'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

// 2. PROGRAMS & CREDIT RULES VIEW
const ProgramsView = ({ programs, modules = [], onAddProgram, onToggleEnrollProgram, navigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        totalCreditsRequired: 34,
        status: 'active',
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
    });

    const statusFilterOptions = [
        { label: 'Tất cả trạng thái', value: 'all' },
        { label: 'Đang học', value: 'active' },
        { label: 'Lên kế hoạch', value: 'planning' },
        { label: 'Đã hoàn thành', value: 'completed' },
    ];

    const handleCreate = (e) => {
        e.preventDefault();
        const newProg = {
            id: 'prog_' + Date.now(),
            ...formData,
            isEnrolled: true,
            totalCreditsRequired: Number(formData.totalCreditsRequired),
            createdAt: new Date().toISOString()
        };
        onAddProgram(newProg);
        setIsModalOpen(false);
        setFormData({
            name: '',
            description: '',
            totalCreditsRequired: 34,
            status: 'active',
            rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
        });
    };

    const filteredPrograms = statusFilter === 'all'
        ? programs
        : programs.filter(p => (p.status || 'active') === statusFilter);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Quản lý Chương trình đào tạo</h2>
                    <p className="text-lg text-gray-600 mt-2">Cấu trúc quy tắc tín chỉ các khối kiến thức & khóa đào tạo.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-52">
                        <EditorialSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilterOptions}
                        />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-jasper text-brand-cream font-serif-title hover:bg-red-800 transition-colors shadow-editorial whitespace-nowrap">
                        <Plus size={18} /> Khởi tạo
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredPrograms.map(prog => {
                    const sharedCount = modules.filter(m => isModuleInProgram(m, prog.id) && m.programIds && m.programIds.length > 1).length;
                    const isEnrolled = prog.isEnrolled !== false;

                    return (
                        <div key={prog.id} className="border-editorial p-6 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-blue-50/30 transition-colors">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold cursor-pointer group-hover:text-brand-jasper" onClick={() => navigate('program_detail', { programId: prog.id })}>
                                        {prog.name}
                                    </h3>
                                    {isEnrolled ? (
                                        <span className="px-2.5 py-0.5 bg-brand-cerulean/15 text-brand-cerulean text-xs font-bold font-serif-title rounded border border-brand-cerulean/40 flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Đang chọn học
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold font-serif-title rounded border border-gray-300">
                                            Chưa chọn
                                        </span>
                                    )}
                                    {sharedCount > 0 && (
                                        <span className="px-2.5 py-0.5 bg-blue-50 text-brand-cerulean/80 text-xs font-bold font-serif-title rounded border border-brand-cerulean/20">
                                            {sharedCount} học phần dùng chung
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{prog.description}</p>
                                
                                {/* Dynamic Rules breakdown display according to evaluationType */}
                                {prog.evaluationType === 'modules' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-serif bg-emerald-50/60 p-3 border border-emerald-200">
                                        <div><strong className="text-emerald-900">Chuyên đề Bắt buộc:</strong> {prog.rules?.mandatoryA || 4} chuyên đề</div>
                                        <div><strong className="text-emerald-900">Chuyên đề Tự chọn:</strong> {prog.rules?.electiveA || 2} chuyên đề</div>
                                        <div><strong className="text-emerald-900">Tổng yêu cầu:</strong> {prog.totalCreditsRequired || 6} chuyên đề</div>
                                    </div>
                                ) : prog.evaluationType === 'hours' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-serif bg-blue-50/60 p-3 border border-blue-200">
                                        <div><strong className="text-blue-900">Lý thuyết / Bài học:</strong> {prog.rules?.mandatoryA || 80} tiết</div>
                                        <div><strong className="text-blue-900">Thực hành / Bài tập:</strong> {prog.rules?.electiveA || 40} tiết</div>
                                        <div><strong className="text-blue-900">Tổng thời lượng:</strong> {prog.totalCreditsRequired || 120} tiết</div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-serif bg-brand-cream p-3 border border-brand-cerulean/20">
                                        <div><strong className="text-brand-cerulean">Khối A Bắt buộc:</strong> {prog.rules?.mandatoryA || 15} TC</div>
                                        <div><strong className="text-brand-cerulean">Khối A Tự chọn:</strong> {prog.rules?.electiveA || 2} TC</div>
                                        <div><strong className="text-brand-cerulean">Khối B Bắt buộc:</strong> {prog.rules?.mandatoryB || 9} TC</div>
                                        <div><strong className="text-brand-cerulean">Khối B Thực hành:</strong> {prog.rules?.practiceB || 6} TC</div>
                                    </div>
                                )}

                                <div className="flex gap-4 text-sm font-sans text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Target size={14} /> Tổng yêu cầu: {prog.totalCreditsRequired} {prog.evaluationType === 'modules' ? 'Chuyên đề' : prog.evaluationType === 'hours' ? 'Tiết học' : 'Tín chỉ'}
                                    </span>
                                    <span className="flex items-center gap-1"><Activity size={14} /> Trạng thái: {prog.status}</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => onToggleEnrollProgram && onToggleEnrollProgram(prog.id)}
                                    className={`px-5 py-2 text-xs font-serif-title font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 rounded-sm ${
                                        isEnrolled
                                            ? 'bg-brand-cerulean text-white hover:bg-brand-jasper'
                                            : 'bg-brand-cream border border-brand-cerulean text-brand-cerulean hover:bg-brand-cerulean hover:text-white'
                                    }`}
                                >
                                    {isEnrolled ? <CheckCircle2 size={16} /> : <PlusCircle size={16} />}
                                    {isEnrolled ? '✓ Đang chọn học' : '+ Chọn học môn này'}
                                </button>
                                <button onClick={() => navigate('program_detail', { programId: prog.id })} className="px-5 py-2 border border-brand-cerulean text-brand-cerulean font-serif-title hover:bg-brand-cerulean hover:text-white transition-colors whitespace-nowrap text-xs text-center">
                                    Đề cương & Học phần &rarr;
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Khởi tạo Chương trình đào tạo mới">
                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên chương trình (VD: NVSP THCS 2026)</label>
                        <input required type="text" className="input-editorial w-full text-xl" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nhập tên chương trình..." />
                    </div>
                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mô tả mục tiêu</label>
                        <textarea className="input-editorial w-full resize-none" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Chứng chỉ nghiệp vụ sư phạm cấp trung học cơ sở..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <EditorialSelect
                                label="Phân loại Nhánh đào tạo"
                                value={formData.category || 'nhanh_a'}
                                onChange={val => {
                                    const presets = getCategoryPresets(val);
                                    setFormData({
                                        ...formData,
                                        category: val,
                                        evaluationType: presets.evaluationType,
                                        totalCreditsRequired: presets.totalCreditsRequired,
                                        rules: presets.rules
                                    });
                                }}
                                options={[
                                    { label: 'Nhánh A: Nghiệp vụ sư phạm (NVSP)', value: 'nhanh_a' },
                                    { label: 'Nhánh B: Bồi dưỡng CDNN Giáo viên', value: 'nhanh_b' },
                                    { label: 'Nhánh C: Chứng chỉ Kỹ năng / Ngắn hạn', value: 'nhanh_c' }
                                ]}
                            />
                        </div>
                        <div>
                            <EditorialSelect
                                label="Hệ thống Đánh giá & Tiến độ"
                                value={formData.evaluationType || 'credits'}
                                onChange={val => setFormData({ ...formData, evaluationType: val })}
                                options={[
                                    { label: 'Hệ Tín chỉ & GPA (NVSP, Đại học)', value: 'credits' },
                                    { label: 'Hệ Học phần & Chuyên đề (Bồi dưỡng CDNN)', value: 'modules' },
                                    { label: 'Hệ Thời lượng Tiết/Giờ học (BDTX, Kỹ năng)', value: 'hours' }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Dynamic Rule Config according to evaluationType */}
                    <div className="border p-4 bg-brand-cream border-brand-cerulean/20 space-y-4">
                        <h4 className="font-serif-title text-brand-cerulean text-lg border-b border-brand-cerulean/20 pb-1">
                            {formData.evaluationType === 'modules'
                                ? 'Quy tắc phân bổ Chuyên đề (Số môn)'
                                : formData.evaluationType === 'hours'
                                    ? 'Quy tắc phân bổ Thời lượng (Tiết học)'
                                    : 'Quy tắc phân bổ Tín chỉ (TC)'}
                        </h4>

                        {formData.evaluationType === 'modules' ? (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên đề Bắt buộc (Số môn)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryA} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, mandatoryA: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên đề Tự chọn (Số môn)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveA} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, electiveA: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-cerulean mb-1">Tổng chuyên đề yêu cầu</label>
                                    <input type="number" min="1" className="input-editorial w-full font-bold" value={formData.totalCreditsRequired} onChange={e => setFormData({ ...formData, totalCreditsRequired: Number(e.target.value) })} />
                                </div>
                            </div>
                        ) : formData.evaluationType === 'hours' ? (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Lý thuyết / Bài học (Tiết)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryA} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, mandatoryA: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Thực hành / Bài tập (Tiết)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveA} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, electiveA: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-cerulean mb-1">Tổng số tiết yêu cầu</label>
                                    <input type="number" min="1" className="input-editorial w-full font-bold" value={formData.totalCreditsRequired} onChange={e => setFormData({ ...formData, totalCreditsRequired: Number(e.target.value) })} />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Bắt buộc (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryA} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, mandatoryA: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Tự chọn (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveA} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, electiveA: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Bắt buộc (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryB} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, mandatoryB: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Thực hành (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.practiceB} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, practiceB: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Tự chọn (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveB} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, electiveB: Number(e.target.value) } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-cerulean mb-1">Tổng tín chỉ yêu cầu</label>
                                    <input type="number" min="1" className="input-editorial w-full font-bold" value={formData.totalCreditsRequired} onChange={e => setFormData({ ...formData, totalCreditsRequired: Number(e.target.value) })} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover">Lưu Chương Trình</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// PROGRAM DETAIL VIEW
const ProgramDetailView = ({ programId, programs, modules, profile, onAddModule, onUpdateModule, onDeleteModule, onUpdateProgram, navigate }) => {
    const program = programs.find(p => p.id === programId) || (programs && programs.length > 0 ? programs[0] : null);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [isProgramEditModalOpen, setIsProgramEditModalOpen] = useState(false);
    const [programFormData, setProgramFormData] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [modForm, setModForm] = useState({ code: '', name: '', credits: 2, category: 'A', type: 'mandatory' });
    const [modalTab, setModalTab] = useState('create'); // 'create' | 'link'
    const [linkSearch, setLinkSearch] = useState('');

    const moduleTypeOptions = [
        { label: 'Bắt buộc', value: 'mandatory' },
        { label: 'Tự chọn', value: 'elective' },
        { label: 'Thực hành', value: 'practice' },
    ];

    const categoryFormOptions = [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
    ];

    const statusOptions = [
        { label: 'Lên kế hoạch', value: 'planned' },
        { label: 'Đang học', value: 'in_progress' },
        { label: 'Đã hoàn thành', value: 'completed' },
    ];

    const programModules = program ? modules.filter(m => isModuleInProgram(m, program.id)) : [];

    if (!program) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center border border-dashed border-brand-cerulean">
                <p className="text-xl font-serif-title text-gray-500 mb-4">Không tìm thấy thông tin chương trình đào tạo.</p>
                <button
                    onClick={() => navigate('programs')}
                    className="px-6 py-2 bg-brand-cerulean text-white font-serif-title"
                >
                    Quay lại Danh sách Chương trình
                </button>
            </div>
        );
    }

    // Auto-generate next module code number based on category (e.g. A01, A02 -> A03)
    const generateNextModuleCode = (category, currentModules) => {
        if (!category) return '';
        const prefix = category.toUpperCase();
        const existingForCat = currentModules.filter(m => (m.category || '').toUpperCase() === prefix);

        let maxNum = 0;
        existingForCat.forEach(m => {
            const codeStr = (m.code || '').toUpperCase();
            const match = codeStr.match(new RegExp(`^${prefix}(\\d+)$`));
            if (match) {
                const num = parseInt(match[1], 10);
                if (!isNaN(num) && num > maxNum) {
                    maxNum = num;
                }
            }
        });

        const nextNum = maxNum + 1;
        return `${prefix}${String(nextNum).padStart(2, '0')}`;
    };

    const handleOpenAddModal = () => {
        const defaultCat = 'A';
        const autoCode = generateNextModuleCode(defaultCat, programModules);
        setModForm({ code: autoCode, name: '', credits: 2, category: defaultCat, type: 'mandatory' });
        setIsModuleModalOpen(true);
    };

    const handleCreateModule = (e) => {
        e.preventDefault();
        const newMod = {
            id: 'mod_' + Date.now(),
            programIds: [programId],
            ...modForm,
            code: (modForm.code || '').toUpperCase().trim(),
            credits: Number(modForm.credits),
            status: 'planned',
            syllabus: {
                description: '',
                clos: [],
                weights: { attendance: 10, midterm: 30, final: 60 }
            },
            grades: { attendance: 0, midterm: 0, final: 0 }
        };
        onAddModule(newMod);
        setIsModuleModalOpen(false);
        const autoCode = generateNextModuleCode('A', [...programModules, newMod]);
        setModForm({ code: autoCode, name: '', credits: 2, category: 'A', type: 'mandatory' });
    };

    // Link an existing module from another program into this program
    const handleLinkExistingModule = (existingMod) => {
        const updatedProgramIds = [...(existingMod.programIds || []), programId];
        onUpdateModule({ ...existingMod, programIds: updatedProgramIds });
        setIsModuleModalOpen(false);
        setLinkSearch('');
    };

    // Modules from other programs that are NOT yet linked to this program
    const linkableModules = modules.filter(m => {
        if (isModuleInProgram(m, programId)) return false;
        const search = linkSearch.toLowerCase().trim();
        if (!search) return true;
        return (m.name || '').toLowerCase().includes(search) ||
               (m.code || '').toLowerCase().includes(search);
    });

    const handleToggleElectiveSelect = (targetMod) => {
        const isCurrentlySelected = !!targetMod.isSelected;

        if (isCurrentlySelected) {
            onUpdateModule({ ...targetMod, isSelected: false });
        } else {
            // Select targetMod and unselect all other electives in the same category/branch
            programModules.forEach(m => {
                if (m.category === targetMod.category && m.type === 'elective') {
                    if (m.id === targetMod.id) {
                        onUpdateModule({ ...m, isSelected: true });
                    } else if (m.isSelected) {
                        onUpdateModule({ ...m, isSelected: false });
                    }
                }
            });
        }
    };

    const handleSaveEditModule = (e) => {
        e.preventDefault();
        if (!editingModule) return;
        onUpdateModule({
            ...editingModule,
            code: (editingModule.code || '').toUpperCase().trim(),
            credits: Number(editingModule.credits)
        });
        setEditingModule(null);
    };

    const handleDeleteModuleClick = () => {
        if (!editingModule) return;
        if (window.confirm(`Bạn có chắc chắn muốn xóa học phần "${editingModule.name}"?`)) {
            onDeleteModule(editingModule.id);
            setEditingModule(null);
        }
    };

    const filteredModules = categoryFilter === 'all'
        ? programModules
        : programModules.filter(m => m.category === categoryFilter);

    const categoryFilterOptions = [
        { label: 'Tất cả khối kiến thức', value: 'all' },
        ...Array.from(new Set(programModules.map(m => m.category))).map(cat => ({ label: `Nhánh ${cat}`, value: cat }))
    ];

    const groupedModules = filteredModules.reduce((acc, mod) => {
        (acc[mod.category] = acc[mod.category] || []).push(mod);
        return acc;
    }, {});

    const handleOpenProgramEditModal = () => {
        setProgramFormData({
            ...program,
            rules: {
                mandatoryA: program.rules?.mandatoryA || 0,
                electiveA: program.rules?.electiveA || 0,
                mandatoryB: program.rules?.mandatoryB || 0,
                practiceB: program.rules?.practiceB || 0,
                electiveB: program.rules?.electiveB || 0,
            }
        });
        setIsProgramEditModalOpen(true);
    };

    const handleSaveProgramEdit = (e) => {
        e.preventDefault();
        if (!programFormData) return;
        if (onUpdateProgram) {
            onUpdateProgram(programFormData);
        }
        setIsProgramEditModalOpen(false);
    };

    // Total credits of all existing modules in this program curriculum
    const totalProgramCredits = programModules.reduce((sum, mod) => sum + Number(mod.credits || 0), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean space-y-3">
                <button onClick={() => navigate('programs')} className="flex items-center gap-2 text-brand-cerulean hover:text-brand-jasper font-serif-title text-sm font-bold transition-colors">
                    <ArrowLeft size={16} /> Quay lại danh sách chương trình
                </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-4xl sm:text-5xl font-serif-title text-brand-cerulean">{program.name}</h1>
                            <button
                                onClick={handleOpenProgramEditModal}
                                className="p-2 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 border border-brand-cerulean/30 rounded transition-all shadow-sm"
                                title="Chỉnh sửa thông tin chương trình đào tạo"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>
                        <p className="text-lg text-gray-600 font-body">{program.description}</p>
                    </div>
                    <div className="text-right min-w-[200px]">
                        {program.evaluationType === 'modules' ? (
                            <>
                                <div className="text-4xl font-serif-title text-brand-jasper">{programModules.length} <span className="text-lg text-gray-500">/ {program.totalCreditsRequired || 6}</span></div>
                                <div className="text-sm uppercase tracking-wider text-brand-cerulean font-bold mt-1">Chuyên đề trong CTĐT</div>
                            </>
                        ) : program.evaluationType === 'hours' ? (
                            <>
                                <div className="text-4xl font-serif-title text-brand-jasper">{programModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0)} <span className="text-lg text-gray-500">/ {program.totalCreditsRequired || 120}</span></div>
                                <div className="text-sm uppercase tracking-wider text-brand-cerulean font-bold mt-1">Tiết học trong CTĐT</div>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl font-serif-title text-brand-jasper">{totalProgramCredits} <span className="text-lg text-gray-500">/ {program.totalCreditsRequired || 34}</span></div>
                                <div className="text-sm uppercase tracking-wider text-brand-cerulean font-bold mt-1">Tín chỉ hiện có trong CTĐT</div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Live Rule Validation Breakdown Panel */}
            <RuleValidationPanel program={program} modules={modules} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-serif-title text-brand-cerulean">Danh sách Học phần theo Đề cương</h2>
                <div className="flex items-center gap-4">
                    {programModules.length > 0 && (
                        <div className="w-60">
                            <EditorialSelect
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                options={categoryFilterOptions}
                            />
                        </div>
                    )}
                    <button onClick={handleOpenAddModal} className="px-4 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover transition-all whitespace-nowrap">
                        + Thêm Học phần
                    </button>
                </div>
            </div>

            {Object.keys(groupedModules).length === 0 ? (
                <div className="p-12 border border-dashed border-brand-cerulean text-center">
                    <p className="text-xl font-serif-title text-gray-500">Chưa có học phần nào trong cấu trúc này.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(groupedModules).map(([category, mods]) => {
                        const mandatoryAndPractice = mods.filter(m => m.type !== 'elective');
                        const electives = mods.filter(m => m.type === 'elective');

                        // Check if any elective in this branch is currently selected
                        const selectedElectiveId = electives.find(m => m.isSelected)?.id;

                        return (
                            <section key={category} className="space-y-6 break-inside-avoid bg-white p-6 border-editorial shadow-editorial">
                                <div className="flex justify-between items-center border-b border-brand-cerulean pb-3">
                                    <h3 className="text-3xl font-serif-title text-brand-cerulean uppercase tracking-wider">
                                        NHÁNH {category}
                                    </h3>
                                    <span className="text-xs font-serif-title text-gray-500 uppercase tracking-widest">
                                        {mods.length} Học phần
                                    </span>
                                </div>

                                {/* PART 1: BẮT BUỘC & THỰC HÀNH */}
                                <div className="space-y-3">
                                    <h4 className="text-lg font-serif-title text-brand-jasper font-bold flex items-center gap-2 border-b border-brand-jasper/20 pb-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper"></span>
                                        I. Học phần Bắt buộc & Thực hành ({mandatoryAndPractice.length})
                                    </h4>
                                    {mandatoryAndPractice.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic py-2">Chưa có học phần bắt buộc/thực hành nào.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2">
                                            {mandatoryAndPractice.map(mod => (
                                                <div
                                                    key={mod.id}
                                                    className="border border-brand-cerulean/30 p-4 bg-brand-cream/30 relative group shadow-sm hover:border-brand-cerulean hover:shadow-editorial transition-all"
                                                >
                                                    <div className="absolute top-0 right-0 bg-brand-cerulean text-white px-2 py-1 text-xs font-bold">
                                                        {mod.credits} TC
                                                    </div>
                                                    <div className="pr-12">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-sm font-sans font-bold text-gray-500">{(mod.code || '').toUpperCase()}</span>
                                                            {mod.programIds && mod.programIds.length > 1 && (
                                                                <span className="px-1.5 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[10px] font-bold font-serif-title rounded border border-brand-cerulean/20 flex items-center gap-1">
                                                                    <Link2 size={10} /> Dùng chung ({mod.programIds.length} CT)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4
                                                            onClick={() => navigate('module_detail', { moduleId: mod.id, programId: program.id })}
                                                            className="text-xl font-serif-title text-brand-cerulean leading-tight mt-1 mb-2 group-hover:text-brand-jasper transition-colors cursor-pointer"
                                                        >
                                                            {formatModuleName(mod.name, profile?.teachingSubject || profile?.major)}
                                                        </h4>
                                                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                                                            <span className="text-xs italic text-gray-500">
                                                                {mod.type === 'mandatory' ? 'Bắt buộc' : 'Thực hành'} &bull; {mod.status === 'completed' ? 'Đã hoàn thành' : mod.status === 'in_progress' ? 'Đang học' : 'Lên kế hoạch'}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    title="Sửa thông tin học phần"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingModule({ ...mod, code: (mod.code || '').toUpperCase() });
                                                                    }}
                                                                    className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 rounded transition-colors"
                                                                >
                                                                    <Pencil size={15} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate('module_detail', { moduleId: mod.id, programId: program.id });
                                                                    }}
                                                                    className="text-sm font-serif-title text-brand-jasper hover:underline font-bold flex items-center gap-1"
                                                                >
                                                                    Chi tiết &rarr;
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* PART 2: TỰ CHỌN (CHỈ CHỌN 1 HỌC PHẦN) */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center border-b border-brand-jasper/20 pb-1">
                                        <h4 className="text-lg font-serif-title text-brand-jasper font-bold flex items-center gap-2 border-b border-brand-jasper/20 pb-1">
                                            <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper"></span>
                                            II. Học phần Tự chọn (Chỉ chọn 1 học phần)
                                        </h4>
                                        {selectedElectiveId && (
                                            <span className="text-xs bg-brand-jasper text-white font-serif-title font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                                                ✓ Đã chọn 1 môn tự chọn
                                            </span>
                                        )}
                                    </div>

                                    {electives.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic py-2">Chưa có học phần tự chọn nào trong nhánh này.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2">
                                            {electives.map(mod => {
                                                const isSelected = !!mod.isSelected;
                                                const isDimmed = selectedElectiveId && !isSelected;

                                                return (
                                                    <div
                                                        key={mod.id}
                                                        className={`p-4 relative transition-all duration-300 ${
                                                            isSelected
                                                                ? 'bg-amber-50/80 border-2 border-brand-jasper shadow-editorial'
                                                                : isDimmed
                                                                ? 'bg-gray-100/60 border border-dashed border-gray-300 opacity-45 grayscale hover:opacity-80'
                                                                : 'bg-white border border-brand-cerulean/30 hover:border-brand-cerulean hover:shadow-sm'
                                                        }`}
                                                    >
                                                        <div className="absolute top-0 right-0 bg-brand-cerulean text-white px-2 py-1 text-xs font-bold">
                                                            {mod.credits} TC
                                                        </div>

                                                        <div className="pr-12 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleElectiveSelect(mod)}
                                                                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif-title font-bold rounded transition-colors ${
                                                                        isSelected
                                                                            ? 'bg-brand-jasper text-white shadow-sm'
                                                                            : 'bg-white border border-gray-400 text-gray-700 hover:border-brand-jasper hover:text-brand-jasper'
                                                                    }`}
                                                                >
                                                                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-white bg-white/20' : 'border-gray-400'}`}>
                                                                        {isSelected && <Check size={12} className="text-white" />}
                                                                    </div>
                                                                    <span>{isSelected ? 'Đã chọn môn này' : 'Chọn môn này'}</span>
                                                                </button>
                                                                <span className="text-xs font-sans font-bold text-gray-500">{(mod.code || '').toUpperCase()}</span>
                                                                {mod.programIds && mod.programIds.length > 1 && (
                                                                    <span className="px-1.5 py-0.5 bg-blue-50/50 text-brand-cerulean/80 text-xs font-bold font-serif-title rounded border border-brand-cerulean/20 flex items-center gap-1">
                                                                        <Link2 size={10} /> Dùng chung
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h4
                                                                onClick={() => navigate('module_detail', { moduleId: mod.id, programId: program.id })}
                                                                className={`text-xl font-serif-title leading-tight mt-1 mb-2 transition-colors cursor-pointer ${
                                                                    isSelected ? 'text-brand-jasper font-bold' : 'text-brand-cerulean hover:text-brand-jasper'
                                                                }`}
                                                            >
                                                                {formatModuleName(mod.name, profile?.teachingSubject || profile?.major)}
                                                            </h4>

                                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                                                                <span className="text-xs italic text-gray-500">
                                                                    Tự chọn &bull; {mod.status === 'completed' ? 'Đã hoàn thành' : mod.status === 'in_progress' ? 'Đang học' : 'Lên kế hoạch'}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        title="Sửa thông tin học phần"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingModule({ ...mod, code: (mod.code || '').toUpperCase() });
                                                                        }}
                                                                        className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 rounded transition-colors"
                                                                    >
                                                                        <Pencil size={15} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigate('module_detail', { moduleId: mod.id, programId: program.id });
                                                                        }}
                                                                        className="text-sm font-serif-title text-brand-jasper hover:underline font-bold flex items-center gap-1"
                                                                    >
                                                                        Chi tiết &rarr;
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            {/* Modal Thêm Học Phần — 2 Tab: Tạo mới / Liên kết */}
            <Modal isOpen={isModuleModalOpen} onClose={() => { setIsModuleModalOpen(false); setModalTab('create'); setLinkSearch(''); }} title="Thêm Học phần">
                {/* Tab Switcher */}
                <div className="flex border-b border-brand-cerulean/30 mb-6 -mt-2">
                    <button
                        type="button"
                        onClick={() => setModalTab('create')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-serif-title font-bold transition-colors border-b-2 ${
                            modalTab === 'create'
                                ? 'border-brand-cerulean text-brand-cerulean'
                                : 'border-transparent text-gray-500 hover:text-brand-cerulean'
                        }`}
                    >
                        <Plus size={16} /> Tạo mới
                    </button>
                    <button
                        type="button"
                        onClick={() => setModalTab('link')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-serif-title font-bold transition-colors border-b-2 ${
                            modalTab === 'link'
                                ? 'border-brand-cerulean text-brand-cerulean'
                                : 'border-transparent text-gray-500 hover:text-brand-cerulean'
                        }`}
                    >
                        <Link2 size={16} /> Liên kết từ CT khác
                    </button>
                </div>

                {/* Tab Content: Create New */}
                {modalTab === 'create' && (
                    <form onSubmit={handleCreateModule} className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mã môn</label>
                                <input required type="text" className="input-editorial w-full uppercase" value={modForm.code} onChange={e => setModForm({ ...modForm, code: e.target.value.toUpperCase() })} placeholder="VD: A01" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên học phần</label>
                                <input required type="text" className="input-editorial w-full" value={modForm.name} onChange={e => setModForm({ ...modForm, name: e.target.value })} placeholder="Tâm lý học giáo dục..." />
                            </div>
                        </div>

                        {modForm.category === 'B' && (
                            <div className="p-3 bg-blue-50/80 border border-brand-cerulean/30 rounded space-y-2">
                                <label className="block text-xs font-serif-title font-bold text-brand-cerulean">
                                    Mẫu học phần chuẩn Nhánh B {profile?.teachingSubject ? `(Áp dụng môn: ${profile.teachingSubject})` : ''}:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { code: 'B01', name: `Phương pháp dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THCS`, credits: 2, type: 'mandatory' },
                                        { code: 'B02', name: `Xây dựng kế hoạch dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THCS`, credits: 2, type: 'mandatory' },
                                        { code: 'B03', name: `Tổ chức dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THCS`, credits: 2, type: 'mandatory' },
                                        { code: 'B04', name: `Thực hành dạy học [${profile?.teachingSubject || 'Môn học'}] cấp THCS ở trường sư phạm`, credits: 3, type: 'mandatory' },
                                        { code: 'B05', name: 'Thực hành kỹ năng giáo dục ở trường THCS', credits: 2, type: 'practice' },
                                        { code: 'B06', name: 'Thực tập sư phạm 1 ở trường THCS', credits: 2, type: 'practice' },
                                        { code: 'B07', name: 'Thực tập sư phạm 2 ở trường THCS', credits: 2, type: 'practice' },
                                    ].map(tpl => (
                                        <button
                                            key={tpl.code}
                                            type="button"
                                            onClick={() => {
                                                const formattedName = formatModuleName(tpl.name, profile?.teachingSubject || profile?.major);
                                                setModForm({
                                                    ...modForm,
                                                    code: tpl.code,
                                                    name: formattedName,
                                                    credits: tpl.credits,
                                                    type: tpl.type,
                                                    category: 'B'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-xs bg-white border border-brand-cerulean/40 hover:border-brand-cerulean hover:bg-blue-100/80 text-brand-cerulean font-bold transition-all rounded shadow-xs"
                                        >
                                            + Mẫu {tpl.code} ({tpl.credits} TC)
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {modForm.category === 'C' && (
                            <div className="p-3 bg-blue-50/80 border border-brand-cerulean/30 rounded space-y-2">
                                <label className="block text-xs font-serif-title font-bold text-brand-cerulean">
                                    Mẫu học phần chuẩn Nhánh C {profile?.teachingSubject ? `(Áp dụng môn: ${profile.teachingSubject})` : ''}:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { code: 'C01', name: `Phương pháp dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THPT`, credits: 2, type: 'mandatory' },
                                        { code: 'C02', name: `Xây dựng kế hoạch dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THPT`, credits: 2, type: 'mandatory' },
                                        { code: 'C03', name: `Tổ chức dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THPT`, credits: 2, type: 'mandatory' },
                                        { code: 'C04', name: `Thực hành dạy học [${profile?.teachingSubject || 'Môn học'}] cấp THPT ở trường sư phạm`, credits: 3, type: 'mandatory' },
                                        { code: 'C05', name: 'Thực hành kỹ năng giáo dục ở trường THPT', credits: 2, type: 'practice' },
                                        { code: 'C06', name: 'Thực tập sư phạm 1 ở trường THPT', credits: 2, type: 'practice' },
                                        { code: 'C07', name: 'Thực tập sư phạm 2 ở trường THPT', credits: 2, type: 'practice' },
                                    ].map(tpl => (
                                        <button
                                            key={tpl.code}
                                            type="button"
                                            onClick={() => {
                                                const formattedName = formatModuleName(tpl.name, profile?.teachingSubject || profile?.major);
                                                setModForm({
                                                    ...modForm,
                                                    code: tpl.code,
                                                    name: formattedName,
                                                    credits: tpl.credits,
                                                    type: tpl.type,
                                                    category: 'C'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-xs bg-white border border-brand-cerulean/40 hover:border-brand-cerulean hover:bg-blue-100/80 text-brand-cerulean font-bold transition-all rounded shadow-xs"
                                        >
                                            + Mẫu {tpl.code} ({tpl.credits} TC)
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Số Tín chỉ</label>
                                <input required type="number" min="1" className="input-editorial w-full" value={modForm.credits} onChange={e => setModForm({ ...modForm, credits: e.target.value })} />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Phân loại"
                                    value={modForm.type}
                                    onChange={val => setModForm({ ...modForm, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Nhánh"
                                    value={modForm.category}
                                    onChange={val => {
                                        const autoCode = generateNextModuleCode(val, programModules);
                                        setModForm({ ...modForm, category: val, code: autoCode });
                                    }}
                                    options={categoryFormOptions}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                            <button type="button" onClick={() => setIsModuleModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                            <button type="submit" className="px-6 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover">Lưu Học phần</button>
                        </div>
                    </form>
                )}

                {/* Tab Content: Link Existing Module */}
                {modalTab === 'link' && (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="input-editorial w-full pl-10 text-base"
                                placeholder="Tìm học phần theo tên hoặc mã môn..."
                                value={linkSearch}
                                onChange={e => setLinkSearch(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {linkableModules.length === 0 ? (
                            <div className="p-8 text-center border border-dashed border-gray-300">
                                <p className="text-gray-500 font-serif-title">Không có học phần nào từ chương trình khác để liên kết.</p>
                                <p className="text-xs text-gray-400 mt-1">Tất cả học phần đã thuộc chương trình này, hoặc chưa có học phần nào ở chương trình khác.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                                {linkableModules.map(mod => {
                                    const belongsTo = getModuleProgramNames(mod, programs);
                                    return (
                                        <div key={mod.id} className="flex items-center justify-between p-3 border border-gray-200 bg-white hover:border-brand-cerulean/30 transition-all group">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold font-sans text-gray-500">{(mod.code || '').toUpperCase()}</span>
                                                    <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 font-bold">{mod.credits} TC</span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5">
                                                        {mod.type === 'mandatory' ? 'Bắt buộc' : mod.type === 'practice' ? 'Thực hành' : 'Tự chọn'}
                                                    </span>
                                                </div>
                                                <h5 className="text-base font-serif-title text-brand-cerulean font-bold mt-0.5 truncate">{mod.name}</h5>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Hiện thuộc: {belongsTo.join(', ') || 'Không xác định'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleLinkExistingModule(mod)}
                                                className="ml-3 px-4 py-2 bg-brand-cerulean text-brand-cream text-xs font-serif-title font-bold hover:bg-brand-cerulean/80 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                                            >
                                                <Link2 size={14} /> Liên kết
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="pt-3 flex justify-end border-t border-brand-cerulean/20">
                            <button type="button" onClick={() => { setIsModuleModalOpen(false); setLinkSearch(''); }} className="px-6 py-2 text-gray-500 font-serif-title">Đóng</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Chỉnh Sửa Học Phần */}
            <Modal isOpen={!!editingModule} onClose={() => setEditingModule(null)} title="Chỉnh sửa thông tin Học phần">
                {editingModule && (
                    <form onSubmit={handleSaveEditModule} className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mã môn</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full uppercase"
                                    value={editingModule.code || ''}
                                    onChange={e => setEditingModule({ ...editingModule, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên học phần</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full"
                                    value={editingModule.name || ''}
                                    onChange={e => setEditingModule({ ...editingModule, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Số Tín chỉ</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    className="input-editorial w-full"
                                    value={editingModule.credits || 1}
                                    onChange={e => setEditingModule({ ...editingModule, credits: e.target.value })}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Phân loại"
                                    value={editingModule.type || 'mandatory'}
                                    onChange={val => setEditingModule({ ...editingModule, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Nhánh"
                                    value={editingModule.category || 'A'}
                                    onChange={val => setEditingModule({ ...editingModule, category: val })}
                                    options={categoryFormOptions}
                                />
                            </div>
                        </div>

                        <div>
                            <EditorialSelect
                                label="Trạng thái học phần"
                                value={editingModule.status || 'planned'}
                                onChange={val => setEditingModule({ ...editingModule, status: val })}
                                options={statusOptions}
                            />
                        </div>

                        <div className="pt-4 flex justify-between items-center border-t border-brand-cerulean/20">
                            <button
                                type="button"
                                onClick={handleDeleteModuleClick}
                                className="flex items-center gap-1 px-4 py-2 text-brand-jasper hover:bg-red-50 border border-brand-jasper/30 font-serif-title transition-colors"
                            >
                                <Trash2 size={16} /> Xóa học phần
                            </button>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingModule(null)}
                                    className="px-6 py-2 text-gray-500 font-serif-title"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover transition-all"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal Chỉnh Sửa Chương Trình Đào Tạo */}
            <Modal isOpen={isProgramEditModalOpen} onClose={() => setIsProgramEditModalOpen(false)} title="Chỉnh sửa Chương trình Đào tạo">
                {programFormData && (
                    <form onSubmit={handleSaveProgramEdit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên chương trình</label>
                            <input
                                required
                                type="text"
                                className="input-editorial w-full"
                                value={programFormData.name || ''}
                                onChange={e => setProgramFormData({ ...programFormData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mô tả mục tiêu</label>
                            <textarea
                                className="input-editorial w-full resize-none"
                                rows="2"
                                value={programFormData.description || ''}
                                onChange={e => setProgramFormData({ ...programFormData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="border p-4 bg-brand-cream border-brand-cerulean/20 space-y-4">
                            <h4 className="font-serif-title text-brand-cerulean text-lg border-b border-brand-cerulean/20 pb-1">Quy tắc phân bổ Tín chỉ</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Bắt buộc (TC)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input-editorial w-full"
                                        value={programFormData.rules?.mandatoryA ?? 0}
                                        onChange={e => setProgramFormData({ ...programFormData, rules: { ...programFormData.rules, mandatoryA: Number(e.target.value) } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Tự chọn (TC)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input-editorial w-full"
                                        value={programFormData.rules?.electiveA ?? 0}
                                        onChange={e => setProgramFormData({ ...programFormData, rules: { ...programFormData.rules, electiveA: Number(e.target.value) } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Bắt buộc (TC)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input-editorial w-full"
                                        value={programFormData.rules?.mandatoryB ?? 0}
                                        onChange={e => setProgramFormData({ ...programFormData, rules: { ...programFormData.rules, mandatoryB: Number(e.target.value) } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Thực hành (TC)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input-editorial w-full"
                                        value={programFormData.rules?.practiceB ?? 0}
                                        onChange={e => setProgramFormData({ ...programFormData, rules: { ...programFormData.rules, practiceB: Number(e.target.value) } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Tự chọn (TC)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input-editorial w-full"
                                        value={programFormData.rules?.electiveB ?? 0}
                                        onChange={e => setProgramFormData({ ...programFormData, rules: { ...programFormData.rules, electiveB: Number(e.target.value) } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-cerulean mb-1">Tổng TC yêu cầu</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input-editorial w-full font-bold"
                                        value={programFormData.totalCreditsRequired ?? 34}
                                        onChange={e => setProgramFormData({ ...programFormData, totalCreditsRequired: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                            <button type="button" onClick={() => setIsProgramEditModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                            <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">Cập nhật Chương Trình</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

// MODULE DETAIL VIEW
const ModuleDetailView = ({ moduleId, programId, programs, modules, profile, onUpdateModule, onDeleteModule, navigate }) => {
    const moduleItem = modules.find(m => m.id === moduleId);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);

    if (!moduleItem) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center border border-dashed border-brand-cerulean">
                <p className="text-xl font-serif-title text-gray-500 mb-4">Không tìm thấy thông tin học phần.</p>
                <button
                    onClick={() => navigate('program_detail', { programId })}
                    className="px-6 py-2 bg-brand-cerulean text-white font-serif-title"
                >
                    Quay lại Chương trình
                </button>
            </div>
        );
    }

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editingModule) return;
        onUpdateModule({
            ...editingModule,
            code: (editingModule.code || '').toUpperCase().trim(),
            credits: Number(editingModule.credits)
        });
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        const pIds = moduleItem.programIds || [];
        if (pIds.length > 1) {
            // Module belongs to multiple programs — ask unlink or full delete
            const choice = window.confirm(
                `Học phần "${moduleItem.name}" đang dùng chung giữa ${pIds.length} chương trình.\n\n` +
                `Bấm OK để GỠ khỏi chương trình hiện tại (giữ lại ở các CT khác).\n` +
                `Bấm Cancel để hủy thao tác.`
            );
            if (choice) {
                // Unlink from current program only
                const newProgramIds = pIds.filter(id => id !== programId);
                onUpdateModule({ ...moduleItem, programIds: newProgramIds });
                navigate('program_detail', { programId });
            }
        } else {
            if (window.confirm(`Bạn có chắc chắn muốn xóa hoàn toàn học phần "${moduleItem.name}"?`)) {
                onDeleteModule(moduleItem.id);
                navigate('program_detail', { programId: (pIds[0] || programId) });
            }
        }
    };

    // Unlink module from a specific program
    const handleUnlinkFromProgram = (targetProgId) => {
        const pIds = moduleItem.programIds || [];
        if (pIds.length <= 1) return; // Can't unlink if only 1 program
        const newProgramIds = pIds.filter(id => id !== targetProgId);
        onUpdateModule({ ...moduleItem, programIds: newProgramIds });
    };

    // Add module to another program
    const handleAddToProgram = (targetProgId) => {
        const pIds = moduleItem.programIds || [];
        if (pIds.includes(targetProgId)) return;
        onUpdateModule({ ...moduleItem, programIds: [...pIds, targetProgId] });
    };

    // Programs not yet linked to this module
    const unlinkablePrograms = programs.filter(p => !(moduleItem.programIds || []).includes(p.id));

    const { score10, letter, gpa4 } = calculateModuleFinal(moduleItem.grades, moduleItem.syllabus?.weights);

    const moduleTypeOptions = [
        { label: 'Bắt buộc', value: 'mandatory' },
        { label: 'Tự chọn', value: 'elective' },
        { label: 'Thực hành', value: 'practice' },
    ];

    const categoryFormOptions = [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
    ];

    const statusOptions = [
        { label: 'Lên kế hoạch', value: 'planned' },
        { label: 'Đang học', value: 'in_progress' },
        { label: 'Đã hoàn thành', value: 'completed' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Sticky Header Container */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean space-y-3">
                <button
                    onClick={() => navigate('program_detail', { programId: programId || (moduleItem.programIds && moduleItem.programIds[0]) })}
                    className="flex items-center gap-2 text-brand-cerulean hover:text-brand-jasper font-serif-title text-sm font-bold transition-colors"
                >
                    <ArrowLeft size={16} /> Quay lại danh sách học phần
                </button>

                <header className="bg-white border-editorial p-6 shadow-editorial flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2.5 py-1 bg-brand-cerulean text-white font-sans font-bold text-xs rounded">
                            {(moduleItem.code || '').toUpperCase()}
                        </span>
                        <span className="px-2.5 py-1 bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 font-serif-title text-xs font-bold">
                            Nhánh {moduleItem.category || 'A'}
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 font-sans text-xs font-bold">
                            {moduleItem.credits} Tín chỉ
                        </span>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-sans text-xs">
                            {moduleItem.type === 'mandatory' ? 'Bắt buộc' : moduleItem.type === 'practice' ? 'Thực hành' : 'Tự chọn'}
                        </span>
                        {moduleItem.programIds && moduleItem.programIds.length > 1 && (
                            <span className="px-2.5 py-1 bg-blue-50/50 text-brand-cerulean/80 border border-brand-cerulean/20 font-serif-title text-xs font-bold flex items-center gap-1">
                                <Link2 size={12} /> Dùng chung ({moduleItem.programIds.length} CT)
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-serif-title text-brand-cerulean">{formatModuleName(moduleItem.name, profile?.teachingSubject || profile?.major)}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setEditingModule({ ...moduleItem });
                            setIsEditModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-cream text-brand-cerulean border border-brand-cerulean font-serif-title shadow-sm hover:border-brand-jasper hover:text-brand-jasper transition-all"
                    >
                        <Pencil size={16} /> Chỉnh sửa
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa học phần"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>
            </div>

            {/* Main Content Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Summary Card */}
                <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean border-b border-brand-cerulean/20 pb-2">
                        Kết quả Học tập
                    </h3>
                    <div className="flex justify-around items-center py-4 bg-brand-cream border border-brand-cerulean/20">
                        <div className="text-center">
                            <span className="text-xs uppercase text-gray-500 font-bold block">Tổng điểm 10</span>
                            <span className="text-3xl font-serif-title text-brand-jasper font-bold">{score10}</span>
                        </div>
                        <div className="h-8 w-px bg-brand-cerulean/20"></div>
                        <div className="text-center">
                            <span className="text-xs uppercase text-gray-500 font-bold block">Hệ 4.0</span>
                            <span className="text-3xl font-serif-title text-brand-cerulean font-bold">{letter} ({gpa4})</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm font-body">
                        <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-600">Chuyên cần (10%):</span>
                            <span className="font-bold">{moduleItem.grades?.attendance || 0} / 10</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-600">Giữa kỳ (30%):</span>
                            <span className="font-bold">{moduleItem.grades?.midterm || 0} / 10</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Cuối kỳ (60%):</span>
                            <span className="font-bold">{moduleItem.grades?.final || 0} / 10</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('gradebook')}
                        className="w-full mt-4 py-2 bg-brand-cerulean text-white font-serif-title text-sm hover:bg-brand-jasper transition-colors"
                    >
                        Vào Sổ điểm cập nhật
                    </button>
                </div>

                {/* Syllabus Card */}
                <div className="md:col-span-2 bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-2">
                        <h3 className="text-2xl font-serif-title text-brand-cerulean">Mô tả & Đề cương môn học</h3>
                        <button onClick={() => navigate('syllabus')} className="text-sm font-serif-title text-brand-jasper hover:underline">
                            Sửa đề cương &rarr;
                        </button>
                    </div>

                    <div>
                        <h5 className="text-sm font-serif-title text-brand-cerulean font-bold mb-1">Mục tiêu môn học</h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {moduleItem.syllabus?.description || 'Chưa cập nhật mô tả mục tiêu học phần.'}
                        </p>
                    </div>

                    {moduleItem.syllabus?.prerequisites && (
                        <div>
                            <h5 className="text-sm font-serif-title text-brand-cerulean font-bold mb-1">Điều kiện tiên quyết / Ghi chú</h5>
                            <p className="text-gray-600 text-sm italic">{moduleItem.syllabus.prerequisites}</p>
                        </div>
                    )}

                    {moduleItem.syllabus?.clos && moduleItem.syllabus.clos.length > 0 && (
                        <div>
                            <h5 className="text-sm font-serif-title text-brand-cerulean font-bold mb-2">Chuẩn đầu ra (CLOs)</h5>
                            <ul className="space-y-1 text-sm text-gray-700 font-body">
                                {moduleItem.syllabus.clos.map((clo, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-brand-jasper font-bold">•</span>
                                        <span>{clo}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {moduleItem.syllabus?.schedule && moduleItem.syllabus.schedule.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 space-y-2">
                            <h5 className="text-sm font-serif-title text-brand-cerulean font-bold">Khung bài học theo tuần/buổi</h5>
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {moduleItem.syllabus.schedule.map((item, idx) => (
                                    <div key={idx} className="p-2.5 bg-brand-cream/50 border border-brand-cerulean/15 text-xs font-body flex justify-between items-start gap-3">
                                        <div className="font-bold text-brand-cerulean whitespace-nowrap">Tuần {item.week || idx + 1}:</div>
                                        <div className="flex-1">
                                            <div className="font-serif-title font-bold text-brand-jasper text-sm">{item.title}</div>
                                            {item.topics && <div className="text-gray-600 mt-0.5">{item.topics}</div>}
                                        </div>
                                        {item.hours && <div className="text-gray-500 font-bold whitespace-nowrap">{item.hours} tiết</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Linked Programs Section */}
            <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-2">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean flex items-center gap-2">
                        <Link2 size={20} /> Chương trình liên kết
                    </h3>
                    <span className="text-xs bg-blue-50/50 text-brand-cerulean/80 px-2.5 py-1 font-bold font-serif-title rounded border border-brand-cerulean/20">
                        {(moduleItem.programIds || []).length} chương trình
                    </span>
                </div>

                <div className="space-y-2">
                    {(moduleItem.programIds || []).map(pId => {
                        const prog = programs.find(p => p.id === pId);
                        const canUnlink = (moduleItem.programIds || []).length > 1;
                        return (
                            <div key={pId} className="flex items-center justify-between p-3 bg-brand-cream border border-brand-cerulean/20 hover:border-brand-cerulean transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-cerulean/10 text-brand-cerulean">
                                        <BookOpen size={16} />
                                    </div>
                                    <div>
                                        <h5
                                            className="text-base font-serif-title text-brand-cerulean font-bold cursor-pointer hover:text-brand-jasper transition-colors"
                                            onClick={() => navigate('program_detail', { programId: pId })}
                                        >
                                            {prog?.name || pId}
                                        </h5>
                                        <span className="text-xs text-gray-500">
                                            {prog?.totalCreditsRequired || '?'} TC yêu cầu • {prog?.status === 'completed' ? 'Đã hoàn thành' : 'Đang học'}
                                        </span>
                                    </div>
                                    {pId === programId && (
                                        <span className="px-2 py-0.5 bg-brand-cerulean text-white text-[10px] font-bold rounded">Hiện tại</span>
                                    )}
                                </div>
                                {canUnlink && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm(`Gỡ học phần "${moduleItem.name}" khỏi chương trình "${prog?.name || pId}"?`)) {
                                                handleUnlinkFromProgram(pId);
                                            }
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-serif-title text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                                        title="Gỡ liên kết khỏi chương trình này"
                                    >
                                        <Unlink size={12} /> Gỡ liên kết
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Add to another program */}
                {unlinkablePrograms.length > 0 && (
                    <div className="pt-3 border-t border-brand-cerulean/20">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-serif-title text-gray-600">Thêm vào chương trình khác:</span>
                            {unlinkablePrograms.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handleAddToProgram(p.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-serif-title font-bold bg-blue-50/50 text-brand-cerulean/80 border border-brand-cerulean/20 hover:bg-purple-100 transition-colors"
                                >
                                    <PlusCircle size={12} /> {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh sửa thông tin Học phần">
                {editingModule && (
                    <form onSubmit={handleSaveEdit} className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mã môn</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full uppercase"
                                    value={editingModule.code || ''}
                                    onChange={e => setEditingModule({ ...editingModule, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên học phần</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full"
                                    value={editingModule.name || ''}
                                    onChange={e => setEditingModule({ ...editingModule, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Số Tín chỉ</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    className="input-editorial w-full"
                                    value={editingModule.credits || 1}
                                    onChange={e => setEditingModule({ ...editingModule, credits: e.target.value })}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Phân loại"
                                    value={editingModule.type}
                                    onChange={val => setEditingModule({ ...editingModule, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Nhánh"
                                    value={editingModule.category}
                                    onChange={val => setEditingModule({ ...editingModule, category: val })}
                                    options={categoryFormOptions}
                                />
                            </div>
                        </div>

                        <div>
                            <EditorialSelect
                                label="Trạng thái học phần"
                                value={editingModule.status || 'planned'}
                                onChange={val => setEditingModule({ ...editingModule, status: val })}
                                options={statusOptions}
                            />
                        </div>

                        <div className="pt-4 flex justify-between items-center border-t border-brand-cerulean/20">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-serif-title text-sm flex items-center gap-1"
                            >
                                <Trash2 size={15} /> Xóa học phần
                            </button>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">Cập nhật</button>
                            </div>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

// 3. SYLLABUS MANAGEMENT VIEW (DYNAMIC FORM)
const SyllabusView = ({ modules, onUpdateModule, showToast }) => {
    const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || '');
    const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0];

    const defaultSyllabus = {
        description: '',
        prerequisites: '',
        clos: [''],
        schedule: [
            { week: 1, title: 'Buổi 1: Giới thiệu tổng quan & Đề cương học phần', topics: 'Nắm bắt mục tiêu, phương pháp giảng dạy và hình thức đánh giá.', hours: 3 }
        ],
        weights: { attendance: 10, midterm: 30, final: 60 }
    };

    const [syllabusData, setSyllabusData] = useState(currentModule?.syllabus || defaultSyllabus);

    useEffect(() => {
        if (currentModule) {
            setSyllabusData({
                description: currentModule.syllabus?.description || '',
                prerequisites: currentModule.syllabus?.prerequisites || '',
                clos: currentModule.syllabus?.clos || [''],
                schedule: currentModule.syllabus?.schedule || [
                    { week: 1, title: 'Buổi 1: Giới thiệu tổng quan & Đề cương học phần', topics: 'Nắm bắt mục tiêu, phương pháp giảng dạy và hình thức đánh giá.', hours: 3 }
                ],
                weights: currentModule.syllabus?.weights || { attendance: 10, midterm: 30, final: 60 }
            });
        }
    }, [selectedModuleId]);

    if (!currentModule) {
        return <div className="p-6 text-gray-500 font-serif-title text-xl">Chưa có học phần nào để quản lý đề cương.</div>;
    }

    const moduleSelectOptions = modules.map(m => ({
        label: `${(m.code || '').toUpperCase()} - ${m.name}`,
        value: m.id
    }));

    // Dynamic CLOs handlers
    const handleAddCLO = () => {
        setSyllabusData(prev => ({
            ...prev,
            clos: [...(prev.clos || []), '']
        }));
    };

    const handleCLOChange = (index, value) => {
        setSyllabusData(prev => {
            const nextCLOs = [...(prev.clos || [])];
            nextCLOs[index] = value;
            return { ...prev, clos: nextCLOs };
        });
    };

    const handleRemoveCLO = (index) => {
        setSyllabusData(prev => ({
            ...prev,
            clos: (prev.clos || []).filter((_, i) => i !== index)
        }));
    };

    // Dynamic Schedule handlers
    const handleAddScheduleRow = () => {
        setSyllabusData(prev => {
            const currentSchedule = prev.schedule || [];
            const nextWeek = currentSchedule.length + 1;
            return {
                ...prev,
                schedule: [
                    ...currentSchedule,
                    { week: nextWeek, title: '', topics: '', hours: 3 }
                ]
            };
        });
    };

    const handleScheduleChange = (index, field, value) => {
        setSyllabusData(prev => {
            const nextSchedule = [...(prev.schedule || [])];
            nextSchedule[index] = { ...nextSchedule[index], [field]: value };
            return { ...prev, schedule: nextSchedule };
        });
    };

    const handleRemoveScheduleRow = (index) => {
        setSyllabusData(prev => ({
            ...prev,
            schedule: (prev.schedule || []).filter((_, i) => i !== index)
        }));
    };

    const handleSaveSyllabus = (e) => {
        e.preventDefault();
        onUpdateModule({
            ...currentModule,
            syllabus: syllabusData
        });
        if (showToast) {
            showToast(`Đã lưu thành công đề cương chi tiết môn ${currentModule.name}!`, 'success');
        }
    };

    const att = Number(syllabusData.weights?.attendance || 0);
    const mid = Number(syllabusData.weights?.midterm || 0);
    const fin = Number(syllabusData.weights?.final || 0);
    const totalWeight = att + mid + fin;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Quản lý Đề cương chi tiết</h2>
                    <p className="text-lg text-gray-600 mt-1">Cấu hình Chuẩn đầu ra (CLOs), Khung bài học & Trọng số đánh giá.</p>
                </div>
                <div className="w-72">
                    <EditorialSelect
                        label="Chọn môn học"
                        value={selectedModuleId}
                        onChange={setSelectedModuleId}
                        options={moduleSelectOptions}
                    />
                </div>
            </header>

            <form onSubmit={handleSaveSyllabus} className="bg-white border-editorial p-8 shadow-editorial space-y-8">
                <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-4">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">{(currentModule.code || '').toUpperCase()}</span>
                        <h3 className="text-3xl font-serif-title text-brand-cerulean">{currentModule.name} ({currentModule.credits} TC)</h3>
                    </div>
                    <button type="submit" className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors">
                        Lưu Đề Cương Chi Tiết
                    </button>
                </div>

                {/* SECTION 1: THÔNG TIN CHUNG & MÔ TẢ MỤC TIÊU */}
                <div className="space-y-4">
                    <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        Thông tin chung & Mô tả mục tiêu
                    </h4>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mô tả mục tiêu môn học</label>
                        <textarea
                            rows="3"
                            className="input-editorial w-full resize-none"
                            value={syllabusData.description || ''}
                            onChange={e => setSyllabusData({ ...syllabusData, description: e.target.value })}
                            placeholder="Nhập mô tả mục tiêu học phần, kiến thức cốt lõi và năng lực đạt được..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Điều kiện tiên quyết / Ghi chú đề cương</label>
                        <input
                            type="text"
                            className="input-editorial w-full"
                            value={syllabusData.prerequisites || ''}
                            onChange={e => setSyllabusData({ ...syllabusData, prerequisites: e.target.value })}
                            placeholder="Ví dụ: Đã hoàn thành môn Lý luận dạy học..."
                        />
                    </div>
                </div>

                {/* SECTION 2: CHUẨN ĐẦU RA (CLOs) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                        <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                            Chuẩn đầu ra môn học (CLOs)
                        </h4>
                        <button type="button" onClick={handleAddCLO} className="text-xs font-serif-title text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                            <PlusCircle size={15} /> Thêm chuẩn đầu ra
                        </button>
                    </div>

                    <div className="space-y-3">
                        {(syllabusData.clos || []).map((clo, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-500 w-16 font-serif-title">CLO {idx + 1}:</span>
                                <input
                                    type="text"
                                    className="input-editorial flex-1"
                                    value={clo}
                                    onChange={e => handleCLOChange(idx, e.target.value)}
                                    placeholder="Ví dụ: Phân tích được các quy luật tâm lý học lứa tuổi..."
                                />
                                <button type="button" onClick={() => handleRemoveCLO(idx)} className="p-1 text-red-500 hover:text-red-700 transition-colors" title="Xóa dòng này">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {(!syllabusData.clos || syllabusData.clos.length === 0) && (
                            <p className="text-sm italic text-gray-400">Chưa có chuẩn đầu ra nào. Bấm 'Thêm chuẩn đầu ra' phía trên.</p>
                        )}
                    </div>
                </div>

                {/* SECTION 3: KHUNG BÀI HỌC (SẮP XẾP THEO TUẦN HOẶC BUỔI) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                        <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                            Khung bài học (Sắp xếp theo Tuần hoặc Buổi học)
                        </h4>
                        <button type="button" onClick={handleAddScheduleRow} className="text-xs font-serif-title text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                            <PlusCircle size={15} /> Thêm Buổi / Tuần học
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 border border-brand-cerulean/15 p-2.5 bg-brand-cream/20 rounded-sm">
                        {(syllabusData.schedule || []).map((item, idx) => (
                            <div key={idx} className="p-4 border border-brand-cerulean/20 bg-white space-y-3 relative group shadow-xs">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-2 w-36">
                                        <span className="text-xs font-bold text-brand-cerulean font-serif-title">Tuần/Buổi:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            className="input-editorial w-16 text-center font-bold"
                                            value={item.week || idx + 1}
                                            onChange={e => handleScheduleChange(idx, 'week', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="input-editorial w-full font-serif-title font-bold text-brand-cerulean"
                                            value={item.title || ''}
                                            onChange={e => handleScheduleChange(idx, 'title', e.target.value)}
                                            placeholder="Tên bài học / Tiêu đề buổi học..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-28">
                                        <input
                                            type="number"
                                            min="1"
                                            className="input-editorial w-14 text-center"
                                            value={item.hours || 3}
                                            onChange={e => handleScheduleChange(idx, 'hours', Number(e.target.value))}
                                        />
                                        <span className="text-xs text-gray-500 font-bold">tiết</span>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveScheduleRow(idx)} className="p-1 text-red-500 hover:text-red-700 transition-colors" title="Xóa buổi học này">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        className="input-editorial w-full text-xs text-gray-600"
                                        value={item.topics || ''}
                                        onChange={e => handleScheduleChange(idx, 'topics', e.target.value)}
                                        placeholder="Nội dung thảo luận, bài tập nhóm hoặc nhiệm vụ tự nghiên cứu..."
                                    />
                                </div>
                            </div>
                        ))}
                        {(!syllabusData.schedule || syllabusData.schedule.length === 0) && (
                            <p className="text-sm italic text-gray-400">Chưa có khung bài học nào. Bấm 'Thêm Buổi / Tuần học' để nhập liệu.</p>
                        )}
                    </div>
                </div>

                {/* SECTION 4: ĐÁNH GIÁ & TRỌNG SỐ */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                        <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                            Đánh giá & Trọng số điểm (%)
                        </h4>
                        <div>
                            {totalWeight === 100 ? (
                                <span className="px-2.5 py-1 bg-brand-cerulean text-white text-xs font-serif-title font-bold rounded shadow-sm">
                                    ✓ Tổng trọng số: 100%
                                </span>
                            ) : (
                                <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                                    Tổng trọng số: {totalWeight}% (Cần đủ 100%)
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-brand-cream border border-brand-cerulean/20 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên cần / Thái độ (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="input-editorial w-full font-bold"
                                value={syllabusData.weights?.attendance ?? 10}
                                onChange={e => setSyllabusData({
                                    ...syllabusData,
                                    weights: { ...syllabusData.weights, attendance: Number(e.target.value) }
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Giữa kỳ / Thảo luận (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="input-editorial w-full font-bold"
                                value={syllabusData.weights?.midterm ?? 30}
                                onChange={e => setSyllabusData({
                                    ...syllabusData,
                                    weights: { ...syllabusData.weights, midterm: Number(e.target.value) }
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Cuối kỳ / Đồ án (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="input-editorial w-full font-bold"
                                value={syllabusData.weights?.final ?? 60}
                                onChange={e => setSyllabusData({
                                    ...syllabusData,
                                    weights: { ...syllabusData.weights, final: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                    <button type="submit" className="px-8 py-3 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors text-lg">
                        Lưu Đề Cương Chi Tiết
                    </button>
                </div>
            </form>
        </div>
    );
};

// 4. CALENDAR & ATTENDANCE TRACKING VIEW
const CalendarAttendanceView = ({ modules, events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventForm, setEventForm] = useState({
        moduleId: modules[0]?.id || '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '11:30',
        location: '',
        meetLink: '',
        attendanceStatus: 'planned',
        notes: ''
    });

    const handleCreateEvent = (e) => {
        e.preventDefault();
        onAddEvent({
            id: 'evt_' + Date.now(),
            ...eventForm
        });
        setIsModalOpen(false);
        setEventForm({
            moduleId: modules[0]?.id || '',
            title: '',
            date: new Date().toISOString().split('T')[0],
            startTime: '08:00',
            endTime: '11:30',
            location: '',
            meetLink: '',
            attendanceStatus: 'planned',
            notes: ''
        });
    };

    const handleCheckin = (evt, newStatus) => {
        onUpdateEvent({
            ...evt,
            attendanceStatus: newStatus
        });
    };

    const moduleOptions = modules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));

    // Month Navigation Helpers
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const monthNames = [
        "THÁNG 1", "THÁNG 2", "THÁNG 3", "THÁNG 4", "THÁNG 5", "THÁNG 6",
        "THÁNG 7", "THÁNG 8", "THÁNG 9", "THÁNG 10", "THÁNG 11", "THÁNG 12"
    ];

    // Calendar Grid Days Calculation
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6

    const todayStr = new Date().toISOString().split('T')[0];

    const openAddForDate = (dateString) => {
        setEventForm({
            ...eventForm,
            date: dateString
        });
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Lịch biểu & Điểm danh</h2>
                    <p className="text-lg text-gray-600 mt-1">Quản lý thời gian, link học trực tuyến & ghi chú chuyên cần.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
                        title={viewMode === 'list' ? 'Chuyển sang dạng Lịch theo tháng' : 'Chuyển sang dạng Danh sách'}
                        className="p-2.5 bg-white border border-brand-cerulean text-brand-cerulean hover:bg-brand-cerulean hover:text-white transition-all shadow-sm flex items-center justify-center group"
                    >
                        {viewMode === 'list' ? (
                            <Calendar size={18} className="group-hover:scale-110 transition-transform" />
                        ) : (
                            <List size={18} className="group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-jasper text-white font-serif-title shadow-editorial whitespace-nowrap">
                        <Plus size={18} /> Thêm Buổi học / Thi
                    </button>
                </div>
            </header>

            {/* MONTH GRID VIEW */}
            {viewMode === 'grid' ? (
                <div className="bg-white border-editorial p-6 shadow-editorial space-y-6">
                    {/* Month Nav Controls */}
                    <div className="flex justify-between items-center pb-4 border-b border-brand-cerulean/20">
                        <button onClick={prevMonth} className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">
                            {monthNames[month]} - NĂM {year}
                        </h3>
                        <button onClick={nextMonth} className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Day Headers (Mon - Sun) */}
                    <div className="grid grid-cols-7 gap-1 text-center font-serif-title text-brand-cerulean font-bold text-sm bg-brand-cream py-2 border-b border-brand-cerulean">
                        <div>Thứ 2</div>
                        <div>Thứ 3</div>
                        <div>Thứ 4</div>
                        <div>Thứ 5</div>
                        <div>Thứ 6</div>
                        <div>Thứ 7</div>
                        <div>Chủ nhật</div>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty padding cells before first day */}
                        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="h-28 bg-gray-50/50 border border-gray-100 p-2 opacity-30"></div>
                        ))}

                        {/* Month Days */}
                        {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                            const dayNum = dayIdx + 1;
                            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isToday = dayStr === todayStr;
                            const dayEvents = events.filter(e => e.date === dayStr);

                            return (
                                <div
                                    key={dayStr}
                                    onClick={() => openAddForDate(dayStr)}
                                    className={`h-28 border p-2 flex flex-col justify-between transition-all cursor-pointer group hover:border-brand-jasper ${
                                        isToday ? 'bg-amber-50/60 border-brand-jasper font-bold' : 'bg-white border-brand-cerulean/20 hover:bg-brand-cream/50'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-sans font-bold ${isToday ? 'text-brand-jasper' : 'text-brand-cerulean'}`}>
                                            {dayNum}
                                        </span>
                                        {isToday && (
                                            <span className="text-[10px] bg-brand-jasper text-white px-1 font-sans uppercase">Hôm nay</span>
                                        )}
                                    </div>

                                    {/* Events List inside Day Cell */}
                                    <div className="space-y-1 overflow-y-auto max-h-20 my-1">
                                        {dayEvents.map(evt => {
                                            const mod = modules.find(m => m.id === evt.moduleId);
                                            const statusBg = evt.attendanceStatus === 'present' ? 'bg-green-700 text-white' : evt.attendanceStatus === 'absent' ? 'bg-red-700 text-white' : 'bg-brand-cerulean text-white';
                                            return (
                                                <div
                                                    key={evt.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert(`Buổi học: ${evt.title}\nGiờ: ${evt.startTime} - ${evt.endTime}\nĐịa điểm: ${evt.location || 'N/A'}`);
                                                    }}
                                                    className={`p-1 text-[11px] font-sans truncate rounded flex items-center justify-between ${statusBg}`}
                                                    title={`${evt.startTime} ${evt.title}`}
                                                >
                                                    <span className="truncate">{mod?.code || ''} {evt.title}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="text-[10px] text-gray-400 group-hover:text-brand-jasper opacity-0 group-hover:opacity-100 transition-opacity text-right font-serif-title">
                                        + Thêm
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* LIST VIEW */
                <div className="space-y-4">
                    {events.map(evt => {
                        const mod = modules.find(m => m.id === evt.moduleId);
                        return (
                            <div key={evt.id} className="bg-white border-editorial p-6 shadow-editorial flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-xs font-bold font-sans">
                                            {mod?.code || 'Học phần'}
                                        </span>
                                        <span className="text-sm font-sans text-gray-500 font-bold">{evt.date} ({evt.startTime} - {evt.endTime})</span>
                                    </div>
                                    <h4 className="text-2xl font-serif-title text-brand-cerulean">{evt.title}</h4>
                                    <div className="flex gap-4 text-sm font-body text-gray-600">
                                        <span>📍 {evt.location || 'Chưa cập nhật địa điểm'}</span>
                                        {evt.meetLink && (
                                            <a href={evt.meetLink} target="_blank" rel="noreferrer" className="text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                                                <ExternalLink size={14} /> Link Google Meet / Zoom
                                            </a>
                                        )}
                                    </div>
                                    {evt.notes && (
                                        <p className="text-xs bg-yellow-50 text-yellow-800 p-2 border-l-2 border-yellow-500 italic">
                                            📝 Ghi chú: {evt.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-serif-title text-gray-400 uppercase tracking-widest">Điểm danh</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`Xóa sự kiện "${evt.title}"?`)) {
                                                    onDeleteEvent(evt.id);
                                                }
                                            }}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Xóa sự kiện"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="flex gap-1 bg-brand-cream p-1 border border-brand-cerulean/20">
                                        <button
                                            onClick={() => handleCheckin(evt, 'present')}
                                            className={`px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'present' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-green-100'}`}
                                        >
                                            Có mặt
                                        </button>
                                        <button
                                            onClick={() => handleCheckin(evt, 'late')}
                                            className={`px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'late' ? 'bg-yellow-600 text-white' : 'text-gray-600 hover:bg-yellow-100'}`}
                                        >
                                            Trễ
                                        </button>
                                        <button
                                            onClick={() => handleCheckin(evt, 'absent')}
                                            className={`px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'absent' ? 'bg-red-700 text-white' : 'text-gray-600 hover:bg-red-100'}`}
                                        >
                                            Vắng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {events.length === 0 && (
                        <div className="p-12 text-center border border-dashed border-brand-cerulean text-gray-500 font-serif-title">
                            Chưa có buổi học hoặc lịch thi nào. Hãy tạo buổi học mới.
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm Sự kiện Lịch học / Lịch thi">
                <form onSubmit={handleCreateEvent} className="space-y-6">
                    <div>
                        <EditorialSelect
                            label="Môn học liên quan"
                            value={eventForm.moduleId}
                            onChange={val => setEventForm({ ...eventForm, moduleId: val })}
                            options={moduleOptions}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên buổi học / Sự kiện</label>
                        <input required type="text" className="input-editorial w-full" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="VD: Buổi 3 - Thảo luận nhóm..." />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <EditorialDatePicker
                                label="Ngày học"
                                value={eventForm.date}
                                onChange={val => setEventForm({ ...eventForm, date: val })}
                            />
                        </div>
                        <div>
                            <EditorialTimePicker
                                label="Giờ bắt đầu"
                                value={eventForm.startTime}
                                onChange={val => setEventForm({ ...eventForm, startTime: val })}
                            />
                        </div>
                        <div>
                            <EditorialTimePicker
                                label="Giờ kết thúc"
                                value={eventForm.endTime}
                                onChange={val => setEventForm({ ...eventForm, endTime: val })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Địa điểm / Phòng học</label>
                            <input type="text" className="input-editorial w-full" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="VD: Phòng A3.02" />
                        </div>
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Link Meet / Zoom (Nếu online)</label>
                            <input type="url" className="input-editorial w-full" value={eventForm.meetLink} onChange={e => setEventForm({ ...eventForm, meetLink: e.target.value })} placeholder="https://meet.google.com/..." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Ghi chú dặn dò</label>
                        <input type="text" className="input-editorial w-full" value={eventForm.notes} onChange={e => setEventForm({ ...eventForm, notes: e.target.value })} placeholder="Ví dụ: Mang theo máy tính cá nhân..." />
                    </div>

                    <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">Lưu Sự Kiện</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// 5. GRADEBOOK & GPA CALCULATOR VIEW
const GradebookView = ({ modules, programs = [], onUpdateModule }) => {
    const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');
    const normalizedPrograms = programs.map(normalizeProgram);
    const activeModules = getFilteredModules(modules, normalizedPrograms, selectedProgramFilter);

    const currentProg = selectedProgramFilter !== 'all' ? normalizedPrograms.find(p => p.id === selectedProgramFilter) : null;
    const evalType = currentProg?.evaluationType || 'credits';

    const programOptions = [
        { label: '🌟 Tất cả chương trình học', value: 'all' },
        ...normalizedPrograms.map(p => ({
            label: `${p.name} (${p.evaluationType === 'modules' ? 'Hệ Chuyên đề' : p.evaluationType === 'hours' ? 'Hệ Tiết học' : 'Hệ Tín chỉ'})`,
            value: p.id
        }))
    ];

    const overall = calculateOverallGPA(activeModules, normalizedPrograms, selectedProgramFilter);

    const handleGradeChange = (mod, field, val) => {
        const numVal = Math.min(10, Math.max(0, Number(val)));
        const updatedGrades = { ...(mod.grades || { attendance: 0, midterm: 0, final: 0 }), [field]: numVal };
        onUpdateModule({
            ...mod,
            grades: updatedGrades
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Sổ điểm & Đánh giá kết quả</h2>
                    <p className="text-lg text-gray-600 mt-1">Cập nhật điểm thành phần và theo dõi tiến độ tích lũy theo từng chương trình.</p>
                </div>
                <div className="flex gap-4 items-center flex-wrap w-full md:w-auto">
                    <div className="w-full md:w-72">
                        <EditorialSelect
                            label="Đang xem chương trình"
                            value={selectedProgramFilter}
                            onChange={val => setSelectedProgramFilter(val)}
                            options={programOptions}
                        />
                    </div>
                    {evalType === 'credits' ? (
                        <>
                            <div className="bg-white border-editorial p-3.5 text-center shadow-editorial min-w-[90px]">
                                <span className="text-[10px] uppercase text-gray-400 font-bold block">GPA Hệ 10</span>
                                <span className="text-2xl font-serif-title text-brand-cerulean font-bold">{overall.gpa10}</span>
                            </div>
                            <div className="bg-brand-cerulean text-white border-editorial p-3.5 text-center shadow-editorial min-w-[90px]">
                                <span className="text-[10px] uppercase text-white/80 font-bold block">GPA Hệ 4.0</span>
                                <span className="text-2xl font-serif-title font-bold">{overall.gpa4}</span>
                            </div>
                        </>
                    ) : (
                        <div className="bg-emerald-800 text-white border-editorial p-3.5 text-center shadow-editorial min-w-[120px]">
                            <span className="text-[10px] uppercase text-white/80 font-bold block">Đạt Chuyên đề</span>
                            <span className="text-xl font-serif-title font-bold">
                                {activeModules.filter(m => calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0 || m.status === 'completed').length} / {activeModules.length}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <div className="bg-white border-editorial shadow-editorial overflow-x-auto max-h-[500px] overflow-y-auto pr-1">
                <table className="w-full text-left font-body relative border-collapse">
                    <thead className="bg-brand-cream border-b border-brand-cerulean text-brand-cerulean font-serif-title sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-4">Mã môn</th>
                            <th className="p-4">Tên học phần / Chuyên đề</th>
                            <th className="p-4 text-center">{evalType === 'hours' ? 'Thời lượng' : 'Số TC'}</th>
                            <th className="p-4 text-center">Chuyên cần</th>
                            <th className="p-4 text-center">{evalType === 'credits' ? 'Giữa kỳ' : 'Bài tập / Thảo luận'}</th>
                            <th className="p-4 text-center">{evalType === 'credits' ? 'Cuối kỳ' : 'Bài thu hoạch / Đồ án'}</th>
                            <th className="p-4 text-center">Tổng kết (Hệ 10)</th>
                            <th className="p-4 text-center">Kết quả Đánh giá</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeModules.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-12 text-center text-gray-500 font-serif text-base bg-white/50">
                                    Chưa có học phần nào trong chương trình đã chọn. Hãy vào mục <strong className="text-brand-cerulean">Chương trình học</strong> để đăng ký hoặc thêm học phần mới.
                                </td>
                            </tr>
                        ) : (
                            activeModules.map(mod => {
                                const { score10, letter, gpa4 } = calculateModuleFinal(mod.grades, mod.syllabus?.weights);
                                const isPassed = score10 >= 5.0 || mod.status === 'completed';
                                return (
                                    <tr key={mod.id} className="hover:bg-brand-cream/50">
                                        <td className="p-4 font-sans font-bold text-gray-500">{(mod.code || '').toUpperCase()}</td>
                                        <td className="p-4 font-serif-title text-lg text-brand-cerulean font-bold flex items-center gap-2">
                                            <span>{mod.name}</span>
                                            {mod.type === 'elective' ? (
                                                <span className="px-2 py-0.5 text-xs font-serif bg-red-100 text-brand-jasper rounded font-bold">
                                                    Tự chọn
                                                </span>
                                            ) : mod.type === 'practice' ? (
                                                <span className="px-2 py-0.5 text-xs font-serif bg-blue-100 text-blue-800 rounded font-normal">
                                                    Thực hành
                                                </span>
                                            ) : null}
                                        </td>
                                        <td className="p-4 text-center font-bold">{evalType === 'hours' ? `${Number(mod.credits || 3) * 15} tiết` : `${mod.credits} TC`}</td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center"
                                                value={mod.grades?.attendance || 0}
                                                onChange={e => handleGradeChange(mod, 'attendance', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center"
                                                value={mod.grades?.midterm || 0}
                                                onChange={e => handleGradeChange(mod, 'midterm', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center"
                                                value={mod.grades?.final || 0}
                                                onChange={e => handleGradeChange(mod, 'final', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center font-serif-title text-xl text-brand-jasper font-bold">
                                            {score10}
                                        </td>
                                        <td className="p-4 text-center font-bold">
                                            {evalType === 'credits' ? (
                                                <span className="px-2 py-1 bg-brand-cerulean/10 text-brand-cerulean">
                                                    {letter} ({gpa4})
                                                </span>
                                            ) : (
                                                <span className={`px-2.5 py-1 text-xs rounded font-bold ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {isPassed ? '✓ ĐẠT' : 'CHƯA ĐẠT'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 6. RESOURCES & STUDY LOG VIEW
const ResourcesStudyLogView = ({ modules, studyLogs, resources, onAddStudyLog, onDeleteStudyLog, onAddResource, onDeleteResource }) => {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('pedagogy_resources_tab');
            if (saved) return saved;
        }
        return 'resources';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pedagogy_resources_tab', activeTab);
        }
    }, [activeTab]);
    const [logForm, setLogForm] = useState({ moduleId: modules[0]?.id || '', title: '', content: '' });
    const [resForm, setResForm] = useState({ moduleId: modules[0]?.id || '', title: '', type: 'Drive / PDF', url: '' });

    const handleCreateLog = (e) => {
        e.preventDefault();
        onAddStudyLog({
            id: 'log_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...logForm
        });
        setLogForm({ moduleId: modules[0]?.id || '', title: '', content: '' });
    };

    const handleCreateResource = (e) => {
        e.preventDefault();
        onAddResource({
            id: 'res_' + Date.now(),
            ...resForm
        });
        setResForm({ moduleId: modules[0]?.id || '', title: '', type: 'Drive / PDF', url: '' });
    };

    const moduleOptions = modules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Quản lý Học liệu & Nhật ký học tập</h2>
                    <p className="text-lg text-gray-600 mt-1">Lưu trữ tài liệu giảng dạy & ghi chép cá nhân sau từng buổi học.</p>
                </div>
                <div className="flex bg-white p-1 border border-brand-cerulean">
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-1.5 font-serif-title ${activeTab === 'resources' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean'}`}
                    >
                        Tài liệu học phần
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-1.5 font-serif-title ${activeTab === 'logs' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean'}`}
                    >
                        Nhật ký học tập
                    </button>
                </div>
            </header>

            {activeTab === 'resources' ? (
                <div className="space-y-6">
                    <form onSubmit={handleCreateResource} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <h3 className="text-xl font-serif-title text-brand-cerulean">Thêm Học liệu / Tài liệu mới</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <EditorialSelect
                                    label="Học phần"
                                    value={resForm.moduleId}
                                    onChange={val => setResForm({ ...resForm, moduleId: val })}
                                    options={moduleOptions}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên tài liệu / Slide</label>
                                <input required type="text" className="input-editorial w-full" value={resForm.title} onChange={e => setResForm({ ...resForm, title: e.target.value })} placeholder="VD: Slide Chương 1 - Tâm lý học" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-end">
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">URL Liên kết (Google Drive / DropBox)</label>
                                <input required type="url" className="input-editorial w-full" value={resForm.url} onChange={e => setResForm({ ...resForm, url: e.target.value })} placeholder="https://drive.google.com/..." />
                            </div>
                            <div>
                                <button type="submit" className="w-full py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">
                                    + Lưu Học liệu
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {resources.map(res => {
                            const mod = modules.find(m => m.id === res.moduleId);
                            return (
                                <div key={res.id} className="bg-white border-editorial p-4 shadow-editorial flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-bold text-gray-500">{mod?.code} - {mod?.name}</span>
                                        <h4 className="text-xl font-serif-title text-brand-cerulean">{res.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <a href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-jasper hover:underline font-serif-title">
                                            <ExternalLink size={16} /> Mở tài liệu
                                        </a>
                                        <button onClick={() => onDeleteResource(res.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <form onSubmit={handleCreateLog} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <h3 className="text-xl font-serif-title text-brand-cerulean">Ghi chép Nhật ký học tập</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <EditorialSelect
                                    label="Học phần"
                                    value={logForm.moduleId}
                                    onChange={val => setLogForm({ ...logForm, moduleId: val })}
                                    options={moduleOptions}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tiêu đề ghi chú</label>
                                <input required type="text" className="input-editorial w-full" value={logForm.title} onChange={e => setLogForm({ ...logForm, title: e.target.value })} placeholder="VD: Những thắc mắc cần hỏi thầy..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Nội dung ghi chép</label>
                            <textarea required rows="3" className="input-editorial w-full resize-none" value={logForm.content} onChange={e => setLogForm({ ...logForm, content: e.target.value })} placeholder="Nhập nội dung bài học hoặc phần ôn tập..."></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">
                                Lưu Nhật Ký
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {studyLogs.map(log => {
                            const mod = modules.find(m => m.id === log.moduleId);
                            return (
                                <div key={log.id} className="bg-white border-editorial p-6 shadow-editorial">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400">{log.date} &bull; {mod?.name}</span>
                                            <h4 className="text-2xl font-serif-title text-brand-cerulean">{log.title}</h4>
                                        </div>
                                        <button onClick={() => onDeleteStudyLog(log.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-gray-700 font-body leading-relaxed text-lg">{log.content}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// 7. PROFILE VIEW
const ProfileView = ({ profile, programs, thptProfile, navigate, onUpdateProfile, onOpenCertificate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile || {});

    useEffect(() => {
        setFormData(profile || {});
    }, [profile]);

    const handleSave = (e) => {
        e.preventDefault();
        const fullAddr = [formData.addressDetail, formData.ward, formData.province].filter(Boolean).join(', ');
        const updated = {
            ...formData,
            address: fullAddr
        };
        onUpdateProfile(updated);
        setIsEditing(false);
    };

    if (!profile) return null;

    const programOptions = (programs && programs.length > 0)
        ? programs.map(p => ({ label: p.name, value: p.name }))
        : [
            { label: "Nghiệp vụ sư phạm THCS 2026", value: "Nghiệp vụ sư phạm THCS 2026" },
            { label: "Nghiệp vụ sư phạm THPT 2026", value: "Nghiệp vụ sư phạm THPT 2026" }
        ];

    const genderOptions = [
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
        { label: 'Khác', value: 'Khác' },
    ];

    const statusOptions = [
        { label: 'Đang học', value: 'Đang học' },
        { label: 'Bảo lưu', value: 'Bảo lưu' },
        { label: 'Đã hoàn thành', value: 'Đã hoàn thành' },
        { label: 'Đã tốt nghiệp', value: 'Đã tốt nghiệp' },
    ];

    // Structured Address Location Dropdowns
    const provinceList = Object.keys(vietnamLocations || {});
    const provinceOptions = provinceList.map(p => ({ label: p, value: p }));

    const currentProvince = formData.province || provinceList[0] || 'Thành phố Hồ Chí Minh';
    const wardList = vietnamLocations[currentProvince] || [];
    const wardOptions = wardList.map(w => ({ label: w, value: w }));

    const emergencyRelationOptions = [
        { label: 'Anh em', value: 'Anh em' },
        { label: 'Chị em', value: 'Chị em' },
        { label: 'Ba', value: 'Ba' },
        { label: 'Mẹ', value: 'Mẹ' },
        { label: 'Bạn bè', value: 'Bạn bè' },
        { label: 'Người yêu', value: 'Người yêu' },
        { label: 'Khác', value: 'Khác' },
    ];

    const handleProvinceChange = (newProv) => {
        const newWardList = vietnamLocations[newProv] || [];
        const firstWard = newWardList[0] || '';
        const newAddrDetail = formData.addressDetail || '';
        const fullAddr = [newAddrDetail, firstWard, newProv].filter(Boolean).join(', ');
        setFormData(prev => ({
            ...prev,
            province: newProv,
            ward: firstWard,
            address: fullAddr
        }));
    };

    const handleWardChange = (newWard) => {
        const fullAddr = [formData.addressDetail || '', newWard, formData.province || ''].filter(Boolean).join(', ');
        setFormData(prev => ({
            ...prev,
            ward: newWard,
            address: fullAddr
        }));
    };

    const handleAddressDetailChange = (newDetail) => {
        const fullAddr = [newDetail, formData.ward || '', formData.province || ''].filter(Boolean).join(', ');
        setFormData(prev => ({
            ...prev,
            addressDetail: newDetail,
            address: fullAddr
        }));
    };

    const handleEmergencyFieldChange = (field, value) => {
        setFormData(prev => {
            const nextRel = field === 'emergencyRelation' ? value : (prev.emergencyRelation || 'Anh em');
            const nextName = field === 'emergencyName' ? value : (prev.emergencyName || '');
            const nextPhone = field === 'emergencyPhone' ? value : (prev.emergencyPhone || '');
            
            let fullContact = nextRel;
            if (nextName) fullContact += ` - ${nextName}`;
            if (nextPhone) fullContact += ` (${nextPhone})`;

            return {
                ...prev,
                [field]: value,
                emergencyContact: fullContact
            };
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Hồ sơ cá nhân</h2>
                    <p className="text-gray-500 font-body mt-1">Thông tin cá nhân, chương trình đào tạo & liên lạc cá nhân hóa.</p>
                </div>
                <div className="flex gap-3 items-center flex-wrap">
                    <button
                        type="button"
                        onClick={onOpenCertificate}
                        className="px-4 py-2 bg-brand-jasper hover:bg-brand-cerulean text-white font-serif-title shadow-editorial transition-colors flex items-center gap-2"
                    >
                        <Award size={16} /> Xem Chứng chỉ mẫu
                    </button>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors flex items-center gap-2"
                        >
                            <Pencil size={16} /> Chỉnh sửa hồ sơ
                        </button>
                    )}
                </div>
            </header>

            <form onSubmit={handleSave} className="bg-white p-8 border-editorial shadow-editorial space-y-8">
                {/* GROUP 1: THÔNG TIN ĐỊNH DANH & CÁ NHÂN */}
                <div className="space-y-4">
                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        1. Thông tin Định danh & Cá nhân
                    </h3>

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Avatar Link Input */}
                            <div className="md:col-span-2 space-y-3 p-4 bg-brand-cream/30 border border-brand-cerulean/20">
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold">Link Ảnh đại diện (URL Avatar)</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full border-2 border-brand-cerulean overflow-hidden bg-brand-cream flex items-center justify-center shrink-0 shadow-sm">
                                        {formData.avatarUrl ? (
                                            <img
                                                src={formData.avatarUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <User size={32} className="text-brand-cerulean" />
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        className="input-editorial flex-1"
                                        value={formData.avatarUrl || ''}
                                        onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                                        placeholder="https://images.unsplash.com/... hoặc dán link ảnh từ internet"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Họ và Tên đầy đủ</label>
                                <input required type="text" className="input-editorial w-full font-serif-title text-lg font-bold" value={formData.fullName || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Mã số học viên (MSSV)</label>
                                <input required type="text" className="input-editorial w-full font-bold" value={formData.studentId || ''} onChange={e => setFormData({ ...formData, studentId: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Ngày sinh</label>
                                <EditorialDatePicker
                                    value={formData.dob || ''}
                                    onChange={val => setFormData({ ...formData, dob: val })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <EditorialSelect
                                        label="Giới tính"
                                        value={formData.gender || 'Nam'}
                                        onChange={val => setFormData({ ...formData, gender: val })}
                                        options={genderOptions}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Số CCCD / CMND</label>
                                    <input type="text" className="input-editorial w-full" value={formData.idCard || ''} onChange={e => setFormData({ ...formData, idCard: e.target.value })} placeholder="079200..." />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-brand-cream/40 p-6 border border-brand-cerulean/20 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-editorial overflow-hidden bg-brand-cream flex items-center justify-center shrink-0">
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.fullName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                                    />
                                ) : (
                                    <User size={48} className="text-brand-cerulean" />
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Họ và Tên</span>
                                    <span className="text-2xl font-serif-title text-brand-cerulean font-bold">{profile.fullName}</span>
                                </div>
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Mã số học viên</span>
                                    <span className="text-lg font-sans text-brand-jasper font-bold">{profile.studentId || 'Chưa cập nhật'}</span>
                                </div>
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Ngày sinh</span>
                                    <span className="text-base font-body">{profile.dob || 'Chưa cập nhật'}</span>
                                </div>
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Giới tính & CCCD</span>
                                    <span className="text-base font-body">{profile.gender || 'Nam'} &bull; CCCD: {profile.idCard || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* GROUP 2: THÔNG TIN ĐÀO TẠO & KHÓA HỌC */}
                <div className="space-y-4">
                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        2. Thông tin Đào tạo & Khóa học
                    </h3>

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <EditorialSelect
                                    label="Chương trình bồi dưỡng"
                                    value={formData.major || ''}
                                    onChange={val => setFormData({ ...formData, major: val })}
                                    options={programOptions}
                                    placeholder="Chọn chương trình bồi dưỡng (có thể chọn nhiều)..."
                                    isMulti={true}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Môn đăng ký giảng dạy"
                                    value={formData.teachingSubject || ''}
                                    onChange={val => setFormData({ ...formData, teachingSubject: val })}
                                    options={[
                                        { label: 'Toán', value: 'Toán' },
                                        { label: 'Tin học', value: 'Tin học' },
                                        { label: 'Vật lý', value: 'Vật lý' },
                                        { label: 'Hóa học', value: 'Hóa học' },
                                        { label: 'Sinh học', value: 'Sinh học' },
                                        { label: 'Ngữ văn', value: 'Ngữ văn' },
                                        { label: 'Tiếng Anh', value: 'Tiếng Anh' },
                                        { label: 'Giáo dục Quốc phòng', value: 'Giáo dục Quốc phòng' },
                                        { label: 'Giáo dục kinh tế và pháp luật', value: 'Giáo dục kinh tế và pháp luật' },
                                        { label: 'Lịch sử', value: 'Lịch sử' },
                                        { label: 'Địa lý', value: 'Địa lý' },
                                        { label: 'Lịch sử và Địa lý', value: 'Lịch sử và Địa lý' },
                                        { label: 'Khoa học tự nhiên (KHTN)', value: 'Khoa học tự nhiên' },
                                        { label: 'Tiếng Trung', value: 'Tiếng Trung' },
                                        { label: 'Tiếng Nga', value: 'Tiếng Nga' },
                                        { label: 'Tiếng Pháp', value: 'Tiếng Pháp' },
                                        { label: 'Công nghệ', value: 'Công nghệ' },
                                        { label: 'Giáo dục thể chất', value: 'Giáo dục thể chất' },
                                    ]}
                                    placeholder="Chọn môn giảng dạy (có thể chọn nhiều)..."
                                    isMulti={true}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Khoa / Viện quản lý</label>
                                <input type="text" className="input-editorial w-full" value={formData.faculty || ''} onChange={e => setFormData({ ...formData, faculty: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Chuyên ngành gốc / Đầu vào</label>
                                <input type="text" className="input-editorial w-full" value={formData.originalMajor || ''} onChange={e => setFormData({ ...formData, originalMajor: e.target.value })} placeholder="VD: Cử nhân Công nghệ..." />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Lớp sinh hoạt / Mã lớp</label>
                                <input type="text" className="input-editorial w-full" value={formData.className || ''} onChange={e => setFormData({ ...formData, className: e.target.value })} placeholder="VD: K2026-NVSP" />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Hình thức đào tạo</label>
                                <input type="text" className="input-editorial w-full" value={formData.trainingMode || ''} onChange={e => setFormData({ ...formData, trainingMode: e.target.value })} placeholder="VD: Bồi dưỡng nghiệp vụ" />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Trạng thái học tập"
                                    value={formData.status || 'Đang học'}
                                    onChange={val => setFormData({ ...formData, status: val })}
                                    options={statusOptions}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-cream/40 p-5 border border-brand-cerulean/20">
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Chương trình học</span>
                                <span className="text-lg font-serif-title text-brand-cerulean font-bold">
                                    {Array.isArray(profile.major) ? profile.major.join(', ') : (profile.major || 'Chưa cập nhật')}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Môn đăng ký giảng dạy (Nhánh B & C)</span>
                                <span className="text-base font-serif-title font-bold text-brand-jasper">
                                    {profile.teachingSubject
                                        ? (Array.isArray(profile.teachingSubject) ? `Môn: ${profile.teachingSubject.join(', ')}` : `Môn ${profile.teachingSubject}`)
                                        : 'Chưa chọn môn dạy (Nhấp Chỉnh sửa để chọn)'}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Khoa / Đơn vị</span>
                                <span className="text-base font-body">{profile.faculty}</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Chuyên ngành gốc</span>
                                <span className="text-base font-body">{profile.originalMajor || 'Chưa cập nhật'}</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Lớp & Trạng thái</span>
                                <span className="text-base font-body">{profile.className || 'Chưa xếp lớp'} &bull; <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded">{profile.status || 'Đang học'}</span></span>
                            </div>
                            <div className="md:col-span-2 p-4 bg-blue-50/60 border border-brand-cerulean/50 rounded flex justify-between items-center flex-wrap gap-3 mt-2">
                                <div className="flex items-center gap-3">
                                    <Award className="text-brand-cerulean" size={24} />
                                    <div>
                                        <span className="text-xs uppercase font-bold text-brand-cerulean block">Chứng chỉ nghiệp vụ dự kiến</span>
                                        <span className="text-sm font-serif-title font-bold text-gray-800">Chứng chỉ Nghiệp vụ Sư phạm THCS / THPT chuẩn Bộ GD&ĐT</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onOpenCertificate}
                                    className="px-3.5 py-1.5 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-serif-title font-bold rounded shadow-sm transition-colors flex items-center gap-1.5"
                                >
                                    <Award size={14} /> Mở bản xem trước
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* GROUP 3: THÔNG TIN LIÊN LẠC & KHẨN CẤP */}
                <div className="space-y-4">
                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        3. Thông tin Liên lạc & Khẩn cấp
                    </h3>

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Email học viên</label>
                                <input type="email" className="input-editorial w-full" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Số điện thoại di động (+84...)</label>
                                <input
                                    type="tel"
                                    className="input-editorial w-full font-bold"
                                    value={formData.phone || '+84 '}
                                    onChange={e => {
                                        let val = e.target.value;
                                        if (!val.startsWith('+84') && val !== '') {
                                            val = '+84 ' + val.replace(/^\+?84\s?/, '');
                                        }
                                        setFormData({ ...formData, phone: val });
                                    }}
                                    placeholder="+84 703 506 140"
                                />
                            </div>

                            {/* Structured Address */}
                            <div className="md:col-span-2 space-y-4 p-4 bg-brand-cream/30 border border-brand-cerulean/20">
                                <span className="text-xs uppercase font-bold text-brand-cerulean block border-b border-brand-cerulean/20 pb-1">Chi tiết Địa chỉ liên hệ (Sau sáp nhập)</span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <EditorialSelect
                                            label="Tỉnh / Thành phố"
                                            value={formData.province || currentProvince}
                                            onChange={handleProvinceChange}
                                            options={provinceOptions}
                                        />
                                    </div>
                                    <div>
                                        <EditorialSelect
                                            label="Phường / Xã / Thị trấn"
                                            value={formData.ward || wardOptions[0]?.value || ''}
                                            onChange={handleWardChange}
                                            options={wardOptions}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Địa chỉ cụ thể (Số nhà, đường...)</label>
                                        <input
                                            type="text"
                                            className="input-editorial w-full"
                                            value={formData.addressDetail || ''}
                                            onChange={e => handleAddressDetailChange(e.target.value)}
                                            placeholder="VD: 351A Lạc Long Quân"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Structured Emergency Contact (3 Fields) */}
                            <div className="md:col-span-2 space-y-4 p-4 bg-brand-cream/30 border border-brand-cerulean/20">
                                <span className="text-xs uppercase font-bold text-brand-cerulean block border-b border-brand-cerulean/20 pb-1">Chi tiết Người liên hệ khẩn cấp (3 Mục thông tin)</span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <EditorialSelect
                                            label="1. Mối quan hệ"
                                            value={formData.emergencyRelation || 'Anh em'}
                                            onChange={val => handleEmergencyFieldChange('emergencyRelation', val)}
                                            options={emergencyRelationOptions}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">2. Họ và Tên người thân</label>
                                        <input
                                            type="text"
                                            className="input-editorial w-full font-bold"
                                            value={formData.emergencyName || ''}
                                            onChange={e => handleEmergencyFieldChange('emergencyName', e.target.value)}
                                            placeholder="VD: Nguyễn Huỳnh Phúc Hải"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">3. Số điện thoại (+84...)</label>
                                        <input
                                            type="tel"
                                            className="input-editorial w-full font-bold"
                                            value={formData.emergencyPhone || '+84 '}
                                            onChange={e => {
                                                let val = e.target.value;
                                                if (!val.startsWith('+84') && val !== '') {
                                                    val = '+84 ' + val.replace(/^\+?84\s?/, '');
                                                }
                                                handleEmergencyFieldChange('emergencyPhone', val);
                                            }}
                                            placeholder="+84 789 515 248"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-cream/40 p-5 border border-brand-cerulean/20">
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Email</span>
                                <span className="text-base font-body flex items-center gap-2 mt-0.5"><Mail size={16} className="text-brand-cerulean" /> {profile.email}</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Số điện thoại</span>
                                <span className="text-base font-body flex items-center gap-2 mt-0.5 font-bold text-brand-cerulean">
                                    <Phone size={16} className="text-brand-cerulean" />
                                    {profile.phone && profile.phone.startsWith('0') ? `+84 ${profile.phone.substring(1)}` : (profile.phone || 'Chưa cập nhật')}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Địa chỉ liên hệ</span>
                                <span className="text-lg font-serif-title text-brand-cerulean font-bold">
                                    {profile.address || [profile.addressDetail, profile.ward, profile.province].filter(Boolean).join(', ') || 'Chưa cập nhật'}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Liên hệ khẩn cấp</span>
                                <div className="flex items-center gap-3 font-body mt-1 flex-wrap">
                                    <span className="px-3 py-1 bg-brand-cerulean text-white text-xs font-serif-title font-bold rounded shadow-sm">
                                        {profile.emergencyRelation || 'Người thân'}
                                    </span>
                                    {profile.emergencyName && (
                                        <span className="text-lg font-serif-title font-bold text-brand-cerulean">
                                            {profile.emergencyName}
                                        </span>
                                    )}
                                    <span className="text-lg font-serif-title font-bold text-brand-jasper flex items-center gap-1.5">
                                        <Phone size={16} /> {profile.emergencyPhone || profile.emergencyContact || 'Chưa cập nhật'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* GROUP 4: KẾT QUẢ KỲ THI THPT & TRÚNG TUYỂN ĐẠI HỌC */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-2">
                        <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper"></span>
                            4. Kết quả Kỳ thi THPT & Trúng tuyển Đại học
                        </h3>
                        {navigate && (
                            <button
                                type="button"
                                onClick={() => navigate('thpt_goals')}
                                className="text-xs font-serif-title font-bold text-brand-jasper hover:text-brand-cerulean underline flex items-center gap-1"
                            >
                                Quản lý Nguyện vọng & Điểm thi THPT →
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-cream/40 p-5 border border-brand-cerulean/20">
                        <div>
                            <span className="text-xs uppercase font-bold text-gray-400 block">Trường Đại học trúng tuyển</span>
                            <span className="text-base font-serif-title text-brand-cerulean font-bold">
                                {thptProfile?.admittedUniversity || profile?.admittedUniversity || 'Chưa cập nhật'}
                            </span>
                            {(thptProfile?.admittedWishNumber || profile?.admittedWishNumber) && (
                                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-serif-title border border-emerald-300">
                                    {thptProfile?.admittedWishNumber || profile?.admittedWishNumber}
                                </span>
                            )}
                        </div>

                        <div>
                            <span className="text-xs uppercase font-bold text-gray-400 block">Ngành & Khối xét tuyển</span>
                            <span className="text-base font-serif-title text-brand-jasper font-bold">
                                {thptProfile?.admittedMajor || profile?.admittedMajor || 'Chưa cập nhật'}
                            </span>
                            {(thptProfile?.admittedCombination || profile?.combination) && (
                                <span className="text-xs text-gray-600 font-body block mt-0.5">
                                    Khối: <strong>{thptProfile?.admittedCombination || profile?.combination}</strong>
                                </span>
                            )}
                        </div>

                        <div>
                            <span className="text-xs uppercase font-bold text-gray-400 block">Điểm chuẩn & Nguyện vọng</span>
                            <span className="text-base font-serif-title text-emerald-700 font-bold">
                                {(thptProfile?.admittedScore || profile?.admittedScore) ? `${thptProfile?.admittedScore || profile?.admittedScore} đ` : 'Chưa cập nhật'}
                            </span>
                            <span className="text-xs text-gray-500 font-body block mt-0.5">
                                Đã lưu {(thptProfile?.aspirations || []).length} nguyện vọng đăng ký
                            </span>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="pt-6 border-t border-brand-cerulean/20 flex justify-end gap-4">
                        <button type="button" onClick={() => { setFormData(profile); setIsEditing(false); }} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                        <button type="submit" className="px-8 py-2.5 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors">Lưu Hồ Sơ</button>
                    </div>
                )}
            </form>
        </div>
    );
};

// SEO & Friendly URL Helpers
const slugify = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

const getSEOAndPath = (currentView, activeProgramId, activeModuleId, programs, modules) => {
    switch (currentView) {
        case 'dashboard':
            return {
                title: 'Tổng Quan Tiến Độ & GPA | Pedagogy - Hệ Thống Quản Lý Giáo Dục Cá Nhân',
                description: 'Trang tổng quan cá nhân theo dõi tín chỉ tích lũy, GPA hệ 4.0, xếp loại học lực và lịch học sắp tới.',
                path: '/'
            };
        case 'programs':
            return {
                title: 'Danh Sách Chương Trình Đào Tạo & Quy Tắc Tín Chỉ | Pedagogy',
                description: 'Danh sách tất cả các chương trình đào tạo sư phạm, cấu trúc khối kiến thức và tổng tín chỉ yêu cầu.',
                path: '/chuong-trinh-dao-tao'
            };
        case 'program_detail': {
            const prog = programs.find(p => p.id === activeProgramId);
            const nameSlug = slugify(prog?.name || 'detail');
            return {
                title: `${prog?.name || 'Chi Tiết Chương Trình'} | Pedagogy`,
                description: prog?.description || 'Chi tiết các học phần trong chương trình đào tạo sư phạm.',
                path: `/chuong-trinh-dao-tao/${nameSlug}`
            };
        }
        case 'module_detail': {
            const mod = modules.find(m => m.id === activeModuleId);
            const codeSlug = slugify(mod?.code || '');
            const nameSlug = slugify(mod?.name || 'hoc-phan');
            return {
                title: `${mod?.code ? `[${mod.code}] ` : ''}${mod?.name || 'Chi Tiết Học Phần'} | Pedagogy`,
                description: `Thông tin chi tiết môn ${mod?.name || ''}, chuẩn đầu ra CLOs, kết quả học tập và số tín chỉ.`,
                path: `/hoc-phan/${codeSlug ? `${codeSlug}-` : ''}${nameSlug}`
            };
        }
        case 'syllabus':
            return {
                title: 'Quản Lý Đề Cương & Chuẩn Đầu Ra (CLOs) | Pedagogy',
                description: 'Thiết lập đề cương chi tiết học phần, tỷ lệ trọng số điểm chuyên cần, giữa kỳ, cuối kỳ và CLOs.',
                path: '/de-cuong-hoc-phan'
            };
        case 'calendar':
            return {
                title: 'Lịch Biểu & Điểm Danh Từng Buổi | Pedagogy',
                description: 'Lịch học, lịch thi dạng lưới tháng (Calendar Grid), link Google Meet/Zoom và điểm danh chuyên cần.',
                path: '/lich-bieu-diem-danh'
            };
        case 'gradebook':
            return {
                title: 'Sổ Điểm & Tự Động Tính Toán GPA Hệ 4.0 | Pedagogy',
                description: 'Bảng điểm chi tiết học phần, tự động tính điểm tổng kết hệ 10, chuyển đổi điểm chữ A, B, C và GPA.',
                path: '/bang-diem-gpa'
            };
        case 'resources':
            return {
                title: 'Tài Liệu & Nhật Ký Học Tập | Pedagogy',
                description: 'Lưu trữ link tài liệu Google Drive, bài giảng slide PDF và nhật ký ghi chép tiến trình học tập.',
                path: '/tai-lieu-nhat-ky'
            };
        case 'profile':
            return {
                title: 'Hồ Sơ & Thông Tin Cá Nhân | Pedagogy',
                description: 'Quản lý thông tin mã học viên Nguyễn Huỳnh Phúc Khang, lớp khóa học 2026, khoa Sư phạm Kỹ thuật.',
                path: '/ho-so-ca-nhan'
            };
        case 'thpt_exams':
            return {
                title: 'Kho Đề Thi THPT & Đáp Án Chi Tiết | Pedagogy',
                description: 'Quản lý kho đề thi thử, đề chính thức THPT Quốc gia, công thức toán KaTeX và lời giải chi tiết.',
                path: '/de-thi-thpt'
            };
        case 'thpt_goals':
            return {
                title: 'Mục Tiêu & Kế Hoạch Ôn Thi THPT 2026 | Pedagogy',
                description: 'Mục tiêu điểm số Đại học, lộ trình ôn thi 4 giai đoạn và sổ tay rút kinh nghiệm cá nhân.',
                path: '/muc-tieu-thpt'
            };
        case 'thpt_tracking':
            return {
                title: 'Nhật Ký & Tiến Độ Ôn Luyện THPT | Pedagogy',
                description: 'Theo dõi tiến trình làm đề, điểm số và nhật ký ôn tập cá nhân.',
                path: '/tien-do-thpt'
            };
        case 'thpt_admission':
            return {
                title: 'Trúng Tuyển Đại Học & Danh Sách Nguyện Vọng | Pedagogy',
                description: 'Lưu trữ thông tin trường Đại học trúng tuyển, điểm thi chính thức và danh sách nguyện vọng.',
                path: '/trung-tuyen-nguyen-vong'
            };
        case 'thpt_transcripts':
            return {
                title: 'Học Bạ 3 Cấp & Điểm Xét Tuyển Đại Học | Pedagogy',
                description: 'Quản lý điểm học bạ Tiểu học, THCS, THPT và tính điểm xét tuyển học bạ vào các trường Đại học.',
                path: '/hoc-ba-3-cap'
            };
        default:
            return {
                title: 'Pedagogy - Quản Lý Giáo Dục Cá Nhân',
                description: 'Hệ thống tự quản lý chương trình đào tạo sư phạm cá nhân.',
                path: '/'
            };
    }
};

export const getViewFromPath = (path) => {
    if (!path || typeof path !== 'string') return null;
    const p = path.toLowerCase().trim();
    if (p.startsWith('/de-thi-thpt')) return 'thpt_exams';
    if (p.startsWith('/muc-tieu-thpt')) return 'thpt_goals';
    if (p.startsWith('/tien-do-thpt') || p.startsWith('/theo-doi-thpt')) return 'thpt_tracking';
    if (p.startsWith('/trung-tuyen') || p.startsWith('/nguyen-vong')) return 'thpt_admission';
    if (p.startsWith('/hoc-ba')) return 'thpt_transcripts';
    if (p.startsWith('/chuong-trinh-dao-tao/')) return 'program_detail';
    if (p.startsWith('/chuong-trinh-dao-tao')) return 'programs';
    if (p.startsWith('/hoc-phan')) return 'module_detail';
    if (p.startsWith('/de-cuong')) return 'syllabus';
    if (p.startsWith('/lich-bieu')) return 'calendar';
    if (p.startsWith('/bang-diem')) return 'gradebook';
    if (p.startsWith('/tai-lieu')) return 'resources';
    if (p.startsWith('/ho-so')) return 'profile';
    if (p === '/' || p === '/tong-quan' || p === '/dashboard') return 'dashboard';
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
    const [profile, setProfile] = useState(() => DEFAULT_PROFILE);
    const [programs, setPrograms] = useState(() => []);
    const [modules, setModules] = useState(() => []);
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
        setLoading(true); 
        
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userId = getUserId(currentUser);
                syncFirestoreData(userId, currentUser);
            } else {
                setUser(null);
                setProfile(DEFAULT_PROFILE);
                setPrograms(DEFAULT_PROGRAMS);
                setModules([]);
                setEvents([]);
                setStudyLogs([]);
                setResources([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
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
        } else {
            localStorage.setItem(STORAGE_KEYS.THPT_SUBJECTS, JSON.stringify(thptSubjects));
            localStorage.setItem(STORAGE_KEYS.THPT_YEARS, JSON.stringify(thptYears));
            localStorage.setItem(STORAGE_KEYS.THPT_EXAM_TYPES, JSON.stringify(thptExamTypes));
            localStorage.setItem(STORAGE_KEYS.THPT_EXAMS, JSON.stringify(thptExams));
            localStorage.setItem(STORAGE_KEYS.THPT_PROFILE, JSON.stringify(thptProfile));
            localStorage.setItem(STORAGE_KEYS.THPT_RESULTS, JSON.stringify(thptResults));
        }
    }, [user, profile, programs, modules, events, studyLogs, resources, thptSubjects, thptYears, thptExamTypes, thptExams, thptProfile, thptResults]);

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

            onSnapshot(getCollectionRef(userId, 'programs'), (snapshot) => {
                setPrograms(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            });

            onSnapshot(getCollectionRef(userId, 'modules'), (snapshot) => {
                setModules(snapshot.docs.map(d => normalizeModuleProgramIds({ id: d.id, ...d.data() })));
            });

            onSnapshot(getCollectionRef(userId, 'events'), (snapshot) => {
                setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            });

            onSnapshot(getCollectionRef(userId, 'studyLogs'), (snapshot) => {
                setStudyLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            });

            onSnapshot(getCollectionRef(userId, 'resources'), (snapshot) => {
                setResources(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            });

            onSnapshot(getCollectionRef(userId, 'thptExams'), (snapshot) => {
                const cleanExams = snapshot.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(e => !e.id.startsWith('exam_toan_') && !e.id.startsWith('exam_vatly_') && !e.id.startsWith('exam_hoahoc_') && !e.id.startsWith('exam_tienganh_'));
                setThptExams(cleanExams);
            });

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
            });

            onSnapshot(getCollectionRef(userId, 'thptResults'), (snapshot) => {
                const cleanResults = snapshot.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(r => !r.id.startsWith('res_00'));
                setThptResults(cleanResults);
            });
        } catch (err) {
            console.warn("Firestore sync setup error:", err);
        }
    };

    const handleSignOut = async () => {
        try {
            setAuthLoadingState('logging_out');
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
                                    <span>⚠️</span> {error}
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
            <aside className={`${isSidebarCollapsed ? 'w-20 px-3 py-5' : 'w-64 p-6'} h-full border-r border-brand-cerulean/20 flex flex-col shrink-0 hidden md:flex transition-all duration-300 ease-in-out bg-brand-cream relative select-none z-30`}>
                
                {/* Collapse / Expand Toggle Button on Border */}
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-white border border-brand-cerulean/30 shadow-sm flex items-center justify-center text-brand-cerulean hover:text-brand-jasper hover:border-brand-jasper transition-all z-20"
                    title={isSidebarCollapsed ? "Mở rộng thanh điều hướng (Ctrl+B)" : "Thu nhỏ thanh điều hướng (Ctrl+B)"}
                >
                    {isSidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
                </button>

                {/* Header / Logo */}
                <div className={`mb-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <img 
                        src={logoImg} 
                        alt="Pedagogy Logo" 
                        className={`${isSidebarCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-full shadow-sm transition-all cursor-pointer hover:scale-105 shrink-0`}
                        onClick={() => { if (isSidebarCollapsed) toggleSidebar(); }}
                        title={isSidebarCollapsed ? "Bấm để mở rộng thanh điều hướng" : "Pedagogy"}
                    />
                    {!isSidebarCollapsed && (
                        <div className="min-w-0">
                            <h1 className="font-serif-title text-3xl text-brand-cerulean tracking-tight truncate">Pedagogy.</h1>
                            <p className="text-xs italic text-gray-500 mt-0.5 font-body truncate">Personal Learning Management</p>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-0.5 custom-scrollbar">
                    {/* Dashboard (Tổng quan) */}
                    {(() => {
                        const item = { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard };
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                title={isSidebarCollapsed ? item.label : undefined}
                                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                                    isActive
                                        ? isSidebarCollapsed 
                                            ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                            : 'text-brand-jasper font-bold border-brand-jasper'
                                        : isSidebarCollapsed
                                            ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                            : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                                }`}
                            >
                                <Icon size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                                {!isSidebarCollapsed && <span className="text-base truncate">{item.label}</span>}
                            </button>
                        );
                    })()}

                    {/* Khóa đào tạo Suite */}
                    <div className={`pt-2 border-t border-brand-cerulean/15 space-y-1.5 ${isSidebarCollapsed ? 'mt-2' : ''}`}>
                        {!isSidebarCollapsed ? (
                            <span className="px-1 text-[10px] font-serif-title uppercase tracking-widest text-brand-cerulean/70 font-bold block mb-1">
                                Khóa đào tạo
                            </span>
                        ) : (
                            <div className="w-full flex justify-center py-1" title="Khóa đào tạo">
                                <div className="w-6 h-0.5 bg-brand-cerulean/20 rounded-full" />
                            </div>
                        )}

                        {[
                            { id: 'programs', match: ['programs', 'program_detail'], label: 'Chương trình học', icon: BookOpen },
                            { id: 'syllabus', label: 'Đề cương chi tiết', icon: FileText },
                            { id: 'calendar', label: 'Lịch biểu & Điểm danh', icon: Calendar },
                            { id: 'gradebook', label: 'Sổ điểm & GPA', icon: Award },
                            { id: 'resources', label: 'Học liệu & Nhật ký', icon: FolderOpen },
                        ].map(item => {
                            const Icon = item.icon;
                            const isActive = item.match ? item.match.includes(currentView) : currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.id)}
                                    title={isSidebarCollapsed ? item.label : undefined}
                                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                                        isActive
                                            ? isSidebarCollapsed 
                                                ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                                : 'text-brand-jasper font-bold border-brand-jasper'
                                            : isSidebarCollapsed
                                                ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                                : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                                    }`}
                                >
                                    <Icon size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                                    {!isSidebarCollapsed && <span className="text-base truncate">{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* THPT Personal Examination Suite */}
                    <div className={`pt-2 border-t border-brand-cerulean/15 space-y-1.5 ${isSidebarCollapsed ? 'mt-2' : ''}`}>
                        {!isSidebarCollapsed ? (
                            <span className="px-1 text-[10px] font-serif-title uppercase tracking-widest text-brand-cerulean/70 font-bold block mb-1">
                                Luyện Thi THPT
                            </span>
                        ) : (
                            <div className="w-full flex justify-center py-1" title="Khối Luyện Thi THPT">
                                <div className="w-6 h-0.5 bg-brand-cerulean/20 rounded-full" />
                            </div>
                        )}

                        {[
                            { id: 'thpt_exams', label: 'Đề thi & Đáp án', icon: FileText },
                            { id: 'thpt_goals', label: 'Mục tiêu & Kế hoạch', icon: Target },
                            { id: 'thpt_tracking', label: 'Nhật ký & Tiến độ', icon: TrendingUp },
                            { id: 'thpt_admission', label: 'Trúng tuyển & Nguyện vọng', icon: GraduationCap },
                            { id: 'thpt_transcripts', label: 'Học bạ 3 cấp', icon: BookMarked },
                        ].map(item => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.id)}
                                    title={isSidebarCollapsed ? item.label : undefined}
                                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                                        isActive
                                            ? isSidebarCollapsed 
                                                ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                                : 'text-brand-jasper font-bold border-brand-jasper'
                                            : isSidebarCollapsed
                                                ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                                : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                                    }`}
                                >
                                    <Icon size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                                    {!isSidebarCollapsed && <span className="text-base truncate">{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Profile Link */}
                    <div className="pt-2 border-t border-brand-cerulean/15">
                        <button
                            onClick={() => navigate('profile')}
                            title={isSidebarCollapsed ? 'Hồ sơ cá nhân' : undefined}
                            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                                currentView === 'profile'
                                    ? isSidebarCollapsed 
                                        ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                        : 'text-brand-jasper font-bold border-brand-jasper'
                                    : isSidebarCollapsed
                                        ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                        : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                            }`}
                        >
                            <User size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                            {!isSidebarCollapsed && <span className="text-base truncate">Hồ sơ cá nhân</span>}
                        </button>
                    </div>
                </nav>

                {/* Footer User Info */}
                {profile && (
                    <div className={`mt-auto pt-3 border-t border-brand-cerulean/20 ${isSidebarCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                        {!isSidebarCollapsed ? (
                            <>
                                <p className="font-serif-title text-brand-cerulean truncate font-bold text-sm">{profile.fullName}</p>
                                <p className="text-xs font-sans text-gray-500 truncate mb-2">{profile.email}</p>
                                
                                <button 
                                    onClick={handleSignOut} 
                                    className="text-xs font-bold text-brand-jasper hover:underline flex items-center gap-1.5"
                                >
                                    <LogOut size={13} /> Đăng xuất
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleSignOut}
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-brand-jasper hover:bg-red-50 hover:text-red-700 transition-colors"
                                title={`Đăng xuất (${profile.fullName})`}
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                )}
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-brand-cream border-b border-brand-cerulean p-4 flex justify-between items-center z-40">
                <div className="flex items-center gap-2">
                    <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-full" />
                    <h1 className="font-serif-title text-2xl text-brand-cerulean">Pedagogy</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('thpt_goals')}
                        className="px-2 py-1 bg-brand-cerulean text-white rounded text-xs font-bold"
                    >
                        Mục tiêu
                    </button>
                    <button
                        onClick={() => navigate('thpt_tracking')}
                        className="px-2 py-1 bg-brand-jasper text-white rounded text-xs font-bold"
                    >
                        Tiến độ
                    </button>
                    <button
                        onClick={() => navigate('thpt_admission')}
                        className="px-2 py-1 bg-amber-600 text-white rounded text-xs font-bold"
                    >
                        Trúng tuyển
                    </button>
                    <button
                        onClick={() => navigate('thpt_transcripts')}
                        className="px-2 py-1 bg-teal-700 text-white rounded text-xs font-bold"
                    >
                        Học bạ
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