import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, X, Sparkles, ChevronDown } from 'lucide-react';

/**
 * EditorialDatePicker - Custom Calendar Date & Range Picker
 * Synchronized with Pedagogy's Editorial Design Language
 */
export const EditorialDatePicker = ({
    label,
    value = '',
    onChange,
    placeholder = 'Chọn thời gian...',
    className = '',
    isRange = true, // default to range for study phases (e.g. Từ tháng X đến tháng Y)
    portalZIndex = 9999
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, openUpward: false });
    const buttonRef = useRef(null);

    // Internal calendar view state
    const [viewDate, setViewDate] = useState(new Date());
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');

    // Parse initial value
    useEffect(() => {
        if (value) {
            let firstDateStr = value;
            if (value.includes(' - ')) {
                const [s, e] = value.split(' - ').map(x => x.trim());
                setRangeStart(s);
                setRangeEnd(e || '');
                firstDateStr = s;
            } else if (value.toLowerCase().startsWith('từ ') && value.toLowerCase().includes(' đến ')) {
                const parts = value.substring(3).split(/\s+đến\s+/i);
                setRangeStart(parts[0]?.trim() || '');
                setRangeEnd(parts[1]?.trim() || '');
                firstDateStr = parts[0]?.trim() || '';
            } else {
                setRangeStart(value);
                setRangeEnd('');
            }

            // Sync viewDate with the date
            if (firstDateStr && firstDateStr.includes('/')) {
                const parts = firstDateStr.split('/').map(Number);
                if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
                    setViewDate(new Date(parts[2], parts[1] - 1, parts[0]));
                }
            }
        }
    }, [value]);

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 380 && rect.top > 380;
            const left = Math.max(10, Math.min(rect.left, window.innerWidth - 340));
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left,
                width: Math.max(rect.width, 320),
                openUpward: openUp
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target) &&
                !event.target.closest('.editorial-portal-datepicker')
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [isOpen]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) updateCoords();
        setIsOpen(!isOpen);
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 25 }, (_, i) => currentYear - 10 + i);
    if (!yearOptions.includes(year)) {
        yearOptions.push(year);
        yearOptions.sort((a, b) => a - b);
    }

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const prevMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(year, month - 1, 1));
    };

    const nextMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(year, month + 1, 1));
    };

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Mon = 0

    const formatDateStr = (d, m, y) => {
        return `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}`;
    };

    const handleSelectDay = (dayNum) => {
        const dateStr = formatDateStr(dayNum, month, year);

        if (!isRange) {
            onChange(dateStr);
            setIsOpen(false);
            return;
        }

        // Range selection logic
        if (!rangeStart || (rangeStart && rangeEnd)) {
            setRangeStart(dateStr);
            setRangeEnd('');
        } else if (rangeStart && !rangeEnd) {
            const [d1, m1, y1] = rangeStart.split('/').map(Number);
            const t1 = new Date(y1, m1 - 1, d1).getTime();
            const t2 = new Date(year, month, dayNum).getTime();

            let finalVal = '';
            if (t2 < t1) {
                finalVal = `${dateStr} - ${rangeStart}`;
                setRangeStart(dateStr);
                setRangeEnd(rangeStart);
            } else {
                finalVal = `${rangeStart} - ${dateStr}`;
                setRangeEnd(dateStr);
            }
            onChange(finalVal);
            setIsOpen(false);
        }
    };

    // Quick Phase Presets for THPT Preparation
    const quickPresets = [
        { label: 'Tháng 9 - Tháng 12 (Kỳ 1)', val: 'Tháng 9 - Tháng 12' },
        { label: 'Tháng 1 - Tháng 4 (Chuyên đề)', val: 'Tháng 1 - Tháng 4' },
        { label: 'Tháng 5 - Tháng 6 (Luyện đề)', val: 'Tháng 5 - Tháng 6' },
        { label: 'Học kỳ 1 (05/09 - 15/01)', val: '05/09/2025 - 15/01/2026' },
        { label: 'Học kỳ 2 (16/01 - 25/05)', val: '16/01/2026 - 25/05/2026' },
        { label: 'Nước rút THPT (01/05 - 25/06)', val: '01/05/2026 - 25/06/2026' },
    ];

    const isDateSelected = (dayNum) => {
        const dStr = formatDateStr(dayNum, month, year);
        return dStr === rangeStart || dStr === rangeEnd;
    };

    const isDateInRange = (dayNum) => {
        if (!rangeStart || !rangeEnd) return false;
        const [d1, m1, y1] = rangeStart.split('/').map(Number);
        const [d2, m2, y2] = rangeEnd.split('/').map(Number);
        const t1 = new Date(y1, m1 - 1, d1).getTime();
        const t2 = new Date(y2, m2 - 1, d2).getTime();
        const current = new Date(year, month, dayNum).getTime();
        return current > t1 && current < t2;
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                    {label}
                </label>
            )}

            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`w-full flex items-center justify-between bg-white text-left transition-all group px-3 py-1.5 border border-brand-cerulean/30 hover:border-brand-jasper focus:border-brand-jasper text-xs font-body shadow-sm rounded-xs ${
                    isOpen ? 'ring-1 ring-brand-jasper border-brand-jasper' : ''
                }`}
            >
                <div className="flex items-center gap-2 truncate pr-2">
                    <Calendar size={14} className="text-brand-cerulean shrink-0 group-hover:text-brand-jasper transition-colors" />
                    <span className={value ? 'text-brand-ink font-medium font-serif-title' : 'text-gray-400'}>
                        {value || placeholder}
                    </span>
                </div>
                {value && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                            setRangeStart('');
                            setRangeEnd('');
                        }}
                        className="text-gray-400 hover:text-red-600 p-0.5"
                        title="Xóa thời gian"
                    >
                        <X size={13} />
                    </span>
                )}
            </button>

            {isOpen && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        left: `${coords.left}px`,
                        top: coords.openUpward ? 'auto' : `${coords.top}px`,
                        bottom: coords.openUpward ? `${coords.bottom}px` : 'auto',
                        width: '320px',
                        zIndex: portalZIndex
                    }}
                    className="editorial-portal-datepicker bg-brand-cream border-2 border-brand-cerulean shadow-2xl p-4 animate-fade-in-down select-none"
                >
                    {/* Header Month / Year Navigation */}
                    <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-brand-cerulean/20 gap-1.5">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1.5 hover:bg-brand-cerulean/10 text-brand-cerulean rounded-xs transition-colors shrink-0"
                            title="Tháng trước"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-2 flex-1 justify-center">
                            {/* Month Dropdown */}
                            <div className="relative">
                                <select
                                    value={month}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        const newMonth = Number(e.target.value);
                                        setViewDate(new Date(year, newMonth, 1));
                                    }}
                                    className="appearance-none bg-white border border-brand-cerulean/30 hover:border-brand-cerulean focus:border-brand-jasper text-brand-cerulean font-serif-title font-bold text-xs py-1 pl-2.5 pr-6 rounded-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-jasper shadow-xs transition-all"
                                >
                                    {monthNames.map((mName, idx) => (
                                        <option key={idx} value={idx} className="font-serif-title text-xs py-1 text-brand-ink">
                                            {mName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-brand-cerulean pointer-events-none" />
                            </div>

                            {/* Year Dropdown */}
                            <div className="relative">
                                <select
                                    value={year}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        const newYear = Number(e.target.value);
                                        setViewDate(new Date(newYear, month, 1));
                                    }}
                                    className="appearance-none bg-white border border-brand-cerulean/30 hover:border-brand-cerulean focus:border-brand-jasper text-brand-cerulean font-serif-title font-bold text-xs py-1 pl-2.5 pr-6 rounded-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-jasper shadow-xs transition-all"
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y} className="font-serif-title text-xs py-1 text-brand-ink">
                                            Năm {y}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-brand-cerulean pointer-events-none" />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1.5 hover:bg-brand-cerulean/10 text-brand-cerulean rounded-xs transition-colors shrink-0"
                            title="Tháng sau"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Day Names Strip */}
                    <div className="grid grid-cols-7 gap-1 text-center font-serif-title font-bold text-[10px] text-brand-cerulean/80 mb-1">
                        <span>T2</span>
                        <span>T3</span>
                        <span>T4</span>
                        <span>T5</span>
                        <span>T6</span>
                        <span>T7</span>
                        <span className="text-brand-jasper">CN</span>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-body mb-3">
                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                            <div key={`empty_${i}`} className="p-1.5"></div>
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const isSelected = isDateSelected(dayNum);
                            const inRange = isDateInRange(dayNum);

                            return (
                                <button
                                    key={dayNum}
                                    type="button"
                                    onClick={() => handleSelectDay(dayNum)}
                                    className={`py-1.5 px-0.5 text-xs font-serif transition-all rounded-xs ${
                                        isSelected
                                            ? 'bg-brand-cerulean text-white font-bold shadow-sm'
                                            : inRange
                                            ? 'bg-brand-cerulean/15 text-brand-cerulean font-medium'
                                            : 'text-brand-ink hover:bg-brand-cerulean/10 hover:text-brand-jasper'
                                    }`}
                                >
                                    {dayNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Presets Section */}
                    {isRange && (
                        <div className="pt-2 border-t border-brand-cerulean/15 space-y-1.5">
                            <span className="text-[10px] uppercase tracking-wider font-serif-title font-bold text-gray-500 block flex items-center gap-1">
                                <Sparkles size={11} className="text-brand-jasper" /> Mốc thời gian phổ biến:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                                {quickPresets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => {
                                            onChange(preset.val);
                                            setIsOpen(false);
                                        }}
                                        className="text-left px-2 py-1 bg-white border border-brand-cerulean/20 hover:border-brand-jasper hover:text-brand-jasper text-[11px] font-serif transition-colors rounded-xs truncate"
                                        title={preset.val}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer buttons */}
                    <div className="pt-2.5 mt-2 border-t border-brand-cerulean/15 flex justify-between items-center text-[11px]">
                        <button
                            type="button"
                            onClick={() => {
                                const todayStr = formatDateStr(new Date().getDate(), new Date().getMonth(), new Date().getFullYear());
                                onChange(todayStr);
                                setIsOpen(false);
                            }}
                            className="text-brand-cerulean hover:underline font-serif-title font-bold"
                        >
                            Hôm nay
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 bg-brand-cerulean text-white font-serif-title text-xs font-bold rounded shadow-xs"
                        >
                            Xong
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default EditorialDatePicker;
