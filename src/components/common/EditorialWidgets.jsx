import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronDown,
    Check,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle2,
    AlertCircle,
    Info,
    Printer,
    Award
} from 'lucide-react';

// --- CUSTOM EDITORIAL DROPDOWN / SELECT COMPONENT ---
export const EditorialSelect = ({ label, value, onChange, options = [], className = "", placeholder, direction = "auto", isMulti = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, openUpward: false });
    const dropdownRef = useRef(null);

    // Normalize value array when isMulti is active
    const selectedValues = isMulti
        ? (Array.isArray(value)
            ? value
            : (value ? String(value).split(',').map(s => s.trim()).filter(Boolean) : []))
        : [];

    let displayLabel = placeholder || 'Chọn...';
    if (isMulti) {
        if (selectedValues.length > 0) {
            const labels = selectedValues.map(val => {
                const found = (options || []).find(opt => String(opt.value) === String(val));
                return found ? found.label : val;
            });
            displayLabel = labels.join(', ');
        }
    } else {
        const found = (options || []).find(opt => String(opt.value) === String(value));
        displayLabel = found?.label || found?.value || value || (placeholder || 'Chọn...');
    }

    const updateCoords = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = direction === "up" || (direction === "auto" && spaceBelow < 240 && rect.top > 240);
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left: Math.max(8, Math.min(rect.left, window.innerWidth - Math.max(rect.width, 240) - 8)),
                width: Math.max(rect.width, 240),
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
            if (selectedValues.some(v => String(v) === String(optValue))) {
                updated = selectedValues.filter(v => String(v) !== String(optValue));
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
                <span className="truncate text-base" title={typeof displayLabel === 'string' ? displayLabel : ''}>{displayLabel}</span>
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
                    {(!options || options.length === 0) ? (
                        <div className="px-4 py-3 text-xs text-gray-500 italic text-center font-serif-title">
                            Chưa có học phần nào để chọn
                        </div>
                    ) : (
                        <>
                            {isMulti && selectedValues.length > 0 && (
                                <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200/60 flex justify-between items-center text-xs font-serif-title sticky top-0 z-10">
                                    <span className="text-amber-800 font-bold">Đã chọn ({selectedValues.length})</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange([]);
                                        }}
                                        className="text-brand-jasper hover:underline font-bold"
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                </div>
                            )}
                            {options.map((opt) => {
                                const isSelected = isMulti 
                                    ? selectedValues.some(v => String(v) === String(opt.value))
                                    : String(value) === String(opt.value);
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelectOption(opt.value)}
                                        className={`px-4 py-2 text-sm font-body cursor-pointer flex items-center justify-between transition-colors ${
                                            isSelected
                                                ? 'bg-brand-cerulean text-brand-cream font-semibold'
                                                : 'text-brand-ink hover:bg-brand-cerulean/10 hover:text-brand-jasper'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2 truncate pr-2">
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
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

// --- CUSTOM EDITORIAL DATE PICKER COMPONENT ---
export const EditorialDatePicker = ({ label, value, onChange, className = "" }) => {
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
export const EditorialTimePicker = ({ label, value, onChange, className = "" }) => {
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
export const Modal = ({ isOpen, onClose, title, children }) => {
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
export const ToastNotification = ({ toast, onClose }) => {
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

// --- ALERT BOX COMPONENT ---
export const AlertBox = ({ type = "info", message, onClose }) => {
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

// --- PROGRESS BAR COMPONENT ---
export const ProgressBar = ({ current, total, label }) => {
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
