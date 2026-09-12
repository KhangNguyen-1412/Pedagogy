import React, { useState, useMemo } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    ExternalLink,
    Plus,
    Pencil,
    Trash2,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    List,
    FileText,
    GraduationCap,
    Sun,
    Sunset,
    Moon,
    CalendarDays,
    AlertTriangle,
    Sparkles,
    Filter,
    Layers,
    CheckSquare,
    Square,
    StickyNote,
    BookOpen
} from 'lucide-react';
import {
    EditorialSelect,
    EditorialDatePicker,
    EditorialTimePicker,
    Modal
} from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';

// Timetable Matrix Rows (Sáng, Chiều, Tối)
export const TIMETABLE_ROWS = [
    {
        id: 'morning',
        label: 'Ca Sáng',
        shortLabel: 'Sáng',
        timeRange: '07:30 - 11:30',
        periodDesc: 'Tiết 1 - 5',
        icon: Sun,
        iconColor: 'text-brand-cerulean',
        badgeClass: 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/30',
        defaultStart: '07:30',
        defaultEnd: '11:30'
    },
    {
        id: 'afternoon',
        label: 'Ca Chiều',
        shortLabel: 'Chiều',
        timeRange: '13:30 - 17:00',
        periodDesc: 'Tiết 6 - 10',
        icon: Sunset,
        iconColor: 'text-brand-jasper',
        badgeClass: 'bg-brand-cream text-brand-jasper border border-brand-jasper/30',
        defaultStart: '13:30',
        defaultEnd: '17:00'
    },
    {
        id: 'evening',
        label: 'Ca Tối',
        shortLabel: 'Tối',
        timeRange: '18:00 - 21:00',
        periodDesc: 'Tiết 11 - 13',
        icon: Moon,
        iconColor: 'text-brand-cerulean',
        badgeClass: 'bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/30',
        defaultStart: '18:00',
        defaultEnd: '21:00'
    }
];

// Session definitions including 'both' (Cả 2 ca) strictly synchronized with Editorial 2-tone palette
export const SESSIONS = [
    {
        id: 'morning',
        label: 'Ca Sáng',
        shortLabel: 'Sáng',
        timeRange: '07:30 - 11:30',
        periodDesc: 'Tiết 1 - 5',
        icon: Sun,
        iconColor: 'text-brand-cerulean',
        badgeClass: 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/30',
        defaultStart: '07:30',
        defaultEnd: '11:30'
    },
    {
        id: 'afternoon',
        label: 'Ca Chiều',
        shortLabel: 'Chiều',
        timeRange: '13:30 - 17:00',
        periodDesc: 'Tiết 6 - 10',
        icon: Sunset,
        iconColor: 'text-brand-jasper',
        badgeClass: 'bg-brand-cream text-brand-jasper border border-brand-jasper/30',
        defaultStart: '13:30',
        defaultEnd: '17:00'
    },
    {
        id: 'both',
        label: 'Cả 2 ca (Sáng & Chiều)',
        shortLabel: 'Cả 2 ca',
        timeRange: '07:30 - 17:00',
        periodDesc: 'Tiết 1 - 10 (Cả ngày)',
        icon: Layers,
        iconColor: 'text-brand-cerulean',
        badgeClass: 'bg-brand-cream text-brand-cerulean border-2 border-brand-cerulean font-bold',
        defaultStart: '07:30',
        defaultEnd: '17:00'
    },
    {
        id: 'evening',
        label: 'Ca Tối',
        shortLabel: 'Tối',
        timeRange: '18:00 - 21:00',
        periodDesc: 'Tiết 11 - 13',
        icon: Moon,
        iconColor: 'text-brand-cerulean',
        badgeClass: 'bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/30',
        defaultStart: '18:00',
        defaultEnd: '21:00'
    }
];

export const getEventSession = (evtOrTime) => {
    if (typeof evtOrTime === 'object' && evtOrTime !== null) {
        if (evtOrTime.session === 'both') return 'both';
        const start = evtOrTime.startTime;
        const end = evtOrTime.endTime;
        if (start && end) {
            const startH = parseInt(start.split(':')[0], 10);
            const endH = parseInt(end.split(':')[0], 10);
            // Starts in morning (<12) and ends in afternoon or later (>=13)
            if (startH < 12 && endH >= 13) return 'both';
        }
        if (evtOrTime.session) return evtOrTime.session;
    }
    const timeStr = typeof evtOrTime === 'string' ? evtOrTime : evtOrTime?.startTime;
    if (!timeStr) return 'morning';
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (isNaN(hour) || hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
};

const pad = (n) => String(n).padStart(2, '0');
const formatDateYMD = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const todayStr = formatDateYMD(new Date());

export const CalendarAttendanceView = ({ modules = [], events = [], studyLogs = [], navigate, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'grid' | 'list'
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const [selectedDayDate, setSelectedDayDate] = useState(() => todayStr);
    const [selectedMonthDate, setSelectedMonthDate] = useState(() => todayStr);
    const [mobileWeekTab, setMobileWeekTab] = useState('day'); // 'day' | 'all' | 'matrix'
    const [sessionFilter, setSessionFilter] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'both' | 'evening'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);

    // Chỉ lấy các học phần đã chọn học để đưa vào danh mục chọn của lịch biểu
    const enrolledModules = useMemo(() => {
        return (modules || []).filter(m => {
            if (m.isEnrolled === false) return false;
            if (m.type === 'elective') {
                const hasGrades = m.grades && (Number(m.grades.final) > 0 || Number(m.grades.midterm) > 0);
                const isFinishedOrActive = m.status === 'in_progress' || m.status === 'completed';
                return !!m.isSelected || hasGrades || isFinishedOrActive;
            }
            return true;
        });
    }, [modules]);

    const activeModules = enrolledModules.length > 0 ? enrolledModules : modules;

    const [eventForm, setEventForm] = useState({
        moduleId: activeModules[0]?.id || modules[0]?.id || '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        session: 'morning',
        startTime: '07:30',
        endTime: '11:30',
        location: '',
        meetLink: '',
        attendanceStatus: 'planned',
        notes: ''
    });

    const handleOpenAdd = (defaultDate = null, defaultSession = 'morning') => {
        setEditingEventId(null);
        const sessionMeta = SESSIONS.find(s => s.id === defaultSession) || SESSIONS[0];
        setEventForm({
            moduleId: activeModules[0]?.id || modules[0]?.id || '',
            title: '',
            date: defaultDate || new Date().toISOString().split('T')[0],
            session: defaultSession,
            startTime: sessionMeta.defaultStart,
            endTime: sessionMeta.defaultEnd,
            location: '',
            meetLink: '',
            attendanceStatus: 'planned',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (evt) => {
        setEditingEventId(evt.id);
        const inferred = getEventSession(evt);
        setEventForm({
            moduleId: evt.moduleId || modules[0]?.id || '',
            title: evt.title || '',
            date: evt.date || new Date().toISOString().split('T')[0],
            session: evt.session || inferred,
            startTime: evt.startTime || '07:30',
            endTime: evt.endTime || '11:30',
            location: evt.location || '',
            meetLink: evt.meetLink || '',
            attendanceStatus: evt.attendanceStatus || 'planned',
            notes: evt.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleApplySessionPreset = (session) => {
        setEventForm(prev => ({
            ...prev,
            session: session.id,
            startTime: session.defaultStart,
            endTime: session.defaultEnd
        }));
    };

    const handleToggleSessionCheckbox = (type) => {
        const current = eventForm.session || getEventSession(eventForm);
        const hasMorning = current === 'morning' || current === 'both';
        const hasAfternoon = current === 'afternoon' || current === 'both';
        const hasEvening = current === 'evening';

        let nextMorning = hasMorning;
        let nextAfternoon = hasAfternoon;
        let nextEvening = hasEvening;

        if (type === 'morning') nextMorning = !hasMorning;
        if (type === 'afternoon') nextAfternoon = !hasAfternoon;
        if (type === 'evening') {
            nextEvening = !hasEvening;
            if (nextEvening) {
                nextMorning = false;
                nextAfternoon = false;
            }
        } else if (nextMorning || nextAfternoon) {
            nextEvening = false;
        }

        if (nextMorning && nextAfternoon) {
            setEventForm(prev => ({
                ...prev,
                session: 'both',
                startTime: '07:30',
                endTime: '17:00'
            }));
        } else if (nextMorning) {
            setEventForm(prev => ({
                ...prev,
                session: 'morning',
                startTime: '07:30',
                endTime: '11:30'
            }));
        } else if (nextAfternoon) {
            setEventForm(prev => ({
                ...prev,
                session: 'afternoon',
                startTime: '13:30',
                endTime: '17:00'
            }));
        } else if (nextEvening) {
            setEventForm(prev => ({
                ...prev,
                session: 'evening',
                startTime: '18:00',
                endTime: '21:00'
            }));
        }
    };

    const handleSaveEvent = (e) => {
        e.preventDefault();
        if (editingEventId) {
            onUpdateEvent({
                id: editingEventId,
                ...eventForm
            });
        } else {
            onAddEvent({
                id: 'evt_' + Date.now(),
                ...eventForm
            });
        }
        setIsModalOpen(false);
        setEditingEventId(null);
    };

    const handleCheckin = (evt, newStatus) => {
        onUpdateEvent({
            ...evt,
            attendanceStatus: newStatus
        });
    };

    const moduleOptions = activeModules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));

    // Month Grid Calculation
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const monthNames = [
        "THÁNG 1", "THÁNG 2", "THÁNG 3", "THÁNG 4", "THÁNG 5", "THÁNG 6",
        "THÁNG 7", "THÁNG 8", "THÁNG 9", "THÁNG 10", "THÁNG 11", "THÁNG 12"
    ];

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6

    // Weekly Timetable Matrix Helpers
    const getMondayOfWeek = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const currentMonday = getMondayOfWeek(currentWeekDate);
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(currentMonday);
        d.setDate(currentMonday.getDate() + i);
        return d;
    });

    const prevWeek = () => {
        const d = new Date(currentWeekDate);
        d.setDate(d.getDate() - 7);
        setCurrentWeekDate(d);
    };

    const nextWeek = () => {
        const d = new Date(currentWeekDate);
        d.setDate(d.getDate() + 7);
        setCurrentWeekDate(d);
    };

    const jumpToToday = () => {
        setCurrentWeekDate(new Date());
        setCurrentMonth(new Date());
        setSelectedDayDate(todayStr);
        setSelectedMonthDate(todayStr);
    };

    // Active Day for Mobile Week View
    const activeDayDate = weekDays.some(d => formatDateYMD(d) === selectedDayDate)
        ? selectedDayDate
        : formatDateYMD(weekDays[0]);

    const selectedDayObj = weekDays.find(d => formatDateYMD(d) === activeDayDate) || weekDays[0];
    const selectedDayIdx = weekDays.findIndex(d => formatDateYMD(d) === activeDayDate);
    const selectedDayName = selectedDayIdx >= 0 ? dayNames[selectedDayIdx] : 'Thứ 2';
    const selectedDayTitle = `${selectedDayName}, ${pad(selectedDayObj.getDate())}/${pad(selectedDayObj.getMonth() + 1)}/${selectedDayObj.getFullYear()}`;
    const selectedDayEvents = events
        .filter(e => e.date === activeDayDate)
        .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    // Selected Date for Month View
    const monthSelectedDateEvents = events
        .filter(e => e.date === selectedMonthDate)
        .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    const selectedMonthDateObj = new Date(selectedMonthDate + 'T00:00:00');
    const selectedMonthDateFormatted = !isNaN(selectedMonthDateObj.getTime())
        ? `${dayNames[(selectedMonthDateObj.getDay() + 6) % 7]}, ${pad(selectedMonthDateObj.getDate())}/${pad(selectedMonthDateObj.getMonth() + 1)}/${selectedMonthDateObj.getFullYear()}`
        : selectedMonthDate;

    // Filter events by session (supporting 'both' for full-day)
    const filteredListEvents = events.filter(evt => {
        if (sessionFilter === 'all') return true;
        const s = getEventSession(evt);
        if (sessionFilter === 'both') return s === 'both';
        if (sessionFilter === 'morning') return s === 'morning' || s === 'both';
        if (sessionFilter === 'afternoon') return s === 'afternoon' || s === 'both';
        return s === sessionFilter;
    });

    // Reusable Event Card Component for Mobile & Detailed Views
    const renderEventCard = (evt) => {
        const mod = modules.find(m => m.id === evt.moduleId);
        const session = getEventSession(evt);
        const sessionMeta = SESSIONS.find(s => s.id === session) || SESSIONS[0];
        const SessionIcon = sessionMeta.icon;
        const isBoth = session === 'both';
        const relatedLog = (studyLogs || []).find(l => l.eventId === evt.id || (l.date === evt.date && l.moduleId === evt.moduleId));

        return (
            <div key={evt.id} className="bg-white border-editorial p-3.5 sm:p-5 shadow-editorial space-y-3 transition-all hover:border-brand-cerulean">
                {/* Header: Session & Status & Actions */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-brand-cerulean/15">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[10px] sm:text-xs font-bold font-sans">
                            {mod?.code || 'Học phần'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-serif-title font-bold flex items-center gap-1 ${sessionMeta.badgeClass}`}>
                            <SessionIcon size={12} className={sessionMeta.iconColor} />
                            <span>{sessionMeta.label} ({evt.startTime} - {evt.endTime})</span>
                            {isBoth && <span className="font-mono text-[9px] text-brand-jasper font-bold">&bull; Tiết 1-10</span>}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => handleOpenEdit(evt)}
                            className="p-1.5 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 rounded transition-colors"
                            title="Chỉnh sửa buổi học"
                        >
                            <Pencil size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (window.confirm(`Xóa buổi học "${evt.title}"?`)) {
                                    onDeleteEvent(evt.id);
                                }
                            }}
                            className="p-1.5 text-gray-400 hover:text-brand-jasper hover:bg-brand-cream rounded transition-colors"
                            title="Xóa buổi học"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>

                {/* Title & Subject */}
                <div>
                    <h4 className="font-serif-title font-bold text-brand-cerulean text-base sm:text-lg leading-snug">
                        {evt.title}
                    </h4>
                    {mod?.name && mod.name !== evt.title && (
                        <p className="text-xs text-gray-500 font-sans mt-0.5 font-medium">{mod.name}</p>
                    )}
                </div>

                {/* Metadata: Location, Teacher, Meet Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 font-sans">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-brand-jasper shrink-0" />
                        <span className="truncate">{evt.location || 'Chưa cập nhật phòng học'}</span>
                    </div>
                    {mod?.instructor && (
                        <div className="flex items-center gap-1.5">
                            <GraduationCap size={13} className="text-brand-cerulean shrink-0" />
                            <span className="truncate">GV: {mod.instructor}</span>
                        </div>
                    )}
                    {evt.meetLink && (
                        <div className="sm:col-span-2">
                            <a
                                href={evt.meetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-brand-jasper hover:underline font-bold text-xs"
                            >
                                <ExternalLink size={12} /> Link lớp trực tuyến (Meet / Zoom)
                            </a>
                        </div>
                    )}
                </div>

                {/* Notes if any */}
                {evt.notes && (
                    <div className="p-2 bg-brand-cream/80 border-l-2 border-brand-cerulean text-xs italic text-gray-700 flex items-start gap-1.5">
                        <FileText size={12} className="text-brand-cerulean shrink-0 mt-0.5" />
                        <span>{evt.notes}</span>
                    </div>
                )}

                {/* Sổ ghi chép link */}
                {relatedLog ? (
                    <div className="flex items-center justify-between p-2 bg-brand-cream/60 border border-brand-cerulean/20 text-xs">
                        <div className="flex items-center gap-1.5 text-brand-cerulean truncate">
                            <StickyNote size={12} className="text-brand-jasper shrink-0" />
                            <span className="font-bold truncate">{relatedLog.title}</span>
                        </div>
                        {navigate && (
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.setItem('pedagogy_view_log_id', relatedLog.id);
                                    sessionStorage.setItem('pedagogy_resources_tab', 'logs');
                                    navigate('resources');
                                }}
                                className="text-xs font-serif-title font-bold text-brand-jasper hover:underline shrink-0 ml-2"
                            >
                                Mở sổ &rarr;
                            </button>
                        )}
                    </div>
                ) : navigate ? (
                    <button
                        type="button"
                        onClick={() => {
                            sessionStorage.setItem('pedagogy_prefill_event', JSON.stringify(evt));
                            sessionStorage.setItem('pedagogy_study_log_editor_active', 'true');
                            sessionStorage.setItem('pedagogy_resources_tab', 'logs');
                            navigate('resources');
                        }}
                        className="text-[11px] font-serif-title text-gray-500 hover:text-brand-cerulean inline-flex items-center gap-1 hover:underline font-medium"
                    >
                        <Plus size={11} /> Thêm ghi chép bài học
                    </button>
                ) : null}

                {/* Quick Check-in Bar */}
                <div className="pt-2 border-t border-brand-cerulean/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-serif-title text-gray-500 font-bold uppercase tracking-wider">
                        Trạng thái điểm danh:
                    </span>
                    <div className="flex items-center gap-1 w-full sm:w-auto bg-brand-cream p-0.5 border border-brand-cerulean/20">
                        <button
                            type="button"
                            onClick={() => handleCheckin(evt, 'present')}
                            className={`flex-1 sm:flex-none px-3 py-1 text-[11px] font-serif-title text-center transition-all ${
                                evt.attendanceStatus === 'present'
                                    ? 'bg-brand-cerulean text-white font-bold shadow-xs'
                                    : 'text-gray-600 hover:bg-white'
                            }`}
                        >
                            Có mặt
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCheckin(evt, 'late')}
                            className={`flex-1 sm:flex-none px-3 py-1 text-[11px] font-serif-title text-center transition-all ${
                                evt.attendanceStatus === 'late'
                                    ? 'bg-brand-jasper/90 text-white font-bold shadow-xs'
                                    : 'text-gray-600 hover:bg-white'
                            }`}
                        >
                            Đi trễ
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCheckin(evt, 'absent')}
                            className={`flex-1 sm:flex-none px-3 py-1 text-[11px] font-serif-title text-center transition-all ${
                                evt.attendanceStatus === 'absent'
                                    ? 'bg-brand-jasper text-white font-bold shadow-xs'
                                    : 'text-gray-600 hover:bg-white'
                            }`}
                        >
                            Vắng
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Conflict detection in event modal
    const conflictEvent = events.find(e =>
        e.id !== editingEventId &&
        e.date === eventForm.date &&
        ((e.startTime <= eventForm.startTime && eventForm.startTime < e.endTime) ||
         (e.startTime < eventForm.endTime && eventForm.endTime <= e.endTime) ||
         (eventForm.startTime <= e.startTime && e.endTime <= eventForm.endTime))
    );

    // Quick seed sample timetable if empty
    const handleSeedSampleSchedule = () => {
        const monday = getMondayOfWeek(new Date());
        const getDateStr = (offsetDays) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + offsetDays);
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        };

        const samples = [
            {
                moduleId: modules[0]?.id || 'mod_dh_triet_hoc',
                title: `Học phần ${modules[0]?.name || 'Triết học Mác - Lênin'}`,
                date: getDateStr(0),
                session: 'morning',
                startTime: '07:30',
                endTime: '11:30',
                location: 'Phòng A2.04 - Giảng đường A',
                meetLink: '',
                attendanceStatus: 'present',
                notes: 'Học lý thuyết chương 1 & 2'
            },
            {
                moduleId: modules[1]?.id || modules[0]?.id || 'mod_dh_giai_tich_1',
                title: `Thực hành ${modules[1]?.name || 'Giải tích 1'}`,
                date: getDateStr(0),
                session: 'afternoon',
                startTime: '13:30',
                endTime: '17:00',
                location: 'Phòng B1.02 - Khu thực hành',
                meetLink: '',
                attendanceStatus: 'present',
                notes: 'Giải bài tập đạo hàm và chuỗi số'
            },
            {
                moduleId: modules[2]?.id || modules[0]?.id || 'mod_nvsp_tam_ly',
                title: `Chuyên đề ${modules[2]?.name || 'Tâm lý học giáo dục'}`,
                date: getDateStr(1),
                session: 'morning',
                startTime: '07:30',
                endTime: '11:30',
                location: 'Hội trường B3.01',
                meetLink: 'https://meet.google.com/ped-nvsp-2026',
                attendanceStatus: 'planned',
                notes: 'Thảo luận đặc điểm tâm lý lứa tuổi học sinh'
            },
            {
                moduleId: modules[3]?.id || modules[0]?.id || 'mod_nvsp_giao_duc_hoc',
                title: `Rèn luyện NVSP: Hội thảo & Thực hành thi giảng`,
                date: getDateStr(2),
                session: 'both',
                startTime: '07:30',
                endTime: '17:00',
                location: 'Phòng Micro-teaching 01 & Hội trường A',
                meetLink: '',
                attendanceStatus: 'planned',
                notes: 'Sáng (Tiết 1-5): Phân tích giáo án & phương pháp. Chiều (Tiết 6-10): Thi giảng thử 15 phút tại lớp.'
            },
            {
                moduleId: modules[4]?.id || modules[0]?.id || 'mod_nvsp_ren_luyen',
                title: `Kiểm tra chuyên đề ${modules[4]?.name || 'Nghiệp vụ SP'}`,
                date: getDateStr(3),
                session: 'morning',
                startTime: '07:30',
                endTime: '11:30',
                location: 'Phòng A2.04',
                meetLink: '',
                attendanceStatus: 'planned',
                notes: 'Làm bài thu hoạch giữa kỳ'
            },
            {
                moduleId: modules[5]?.id || modules[1]?.id || 'mod_nvsp_thuc_tap_1',
                title: `Kiến tập sư phạm tại trường phổ thông`,
                date: getDateStr(4),
                session: 'afternoon',
                startTime: '13:30',
                endTime: '17:00',
                location: 'Trường THCS / THPT Thực hành Sư phạm',
                meetLink: '',
                attendanceStatus: 'planned',
                notes: 'Dự giờ tiết mẫu của giáo viên hướng dẫn'
            }
        ];

        samples.forEach((item, idx) => {
            onAddEvent({
                id: 'evt_sample_' + Date.now() + '_' + idx,
                ...item
            });
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            <CollapsiblePageHeader
                title="Lịch biểu & Điểm danh"
                subtitle="Quản lý thời khóa biểu theo ca Sáng – Chiều, phòng học, đường dẫn trực tuyến & chuyên cần."
                actions={({ isScrolled }) => (
                    <div className={`flex gap-2 sm:gap-3 w-full sm:w-auto ${
                        isScrolled
                            ? 'items-center justify-end'
                            : 'flex-col sm:flex-row items-stretch sm:items-center'
                    }`}>
                        {/* View Switcher: Tuần | Tháng | Danh sách */}
                        <div className={`items-center p-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-serif-title ${
                            isScrolled ? 'hidden md:flex' : 'flex w-full sm:w-auto'
                        }`}>
                            <button
                                type="button"
                                onClick={() => setViewMode('week')}
                                title="Xem Thời khóa biểu tuần phân ca Sáng - Chiều"
                                className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-3 py-1.5 rounded transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-[11px] sm:text-xs font-bold ${
                                    viewMode === 'week'
                                        ? 'bg-brand-cerulean text-white shadow-xs'
                                        : 'text-gray-600 hover:text-brand-cerulean hover:bg-brand-cream'
                                }`}
                            >
                                <CalendarDays size={14} />
                                <span>TKB Tuần</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                title="Xem Lịch theo tháng"
                                className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-3 py-1.5 rounded transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-[11px] sm:text-xs font-bold ${
                                    viewMode === 'grid'
                                        ? 'bg-brand-cerulean text-white shadow-xs'
                                        : 'text-gray-600 hover:text-brand-cerulean hover:bg-brand-cream'
                                }`}
                            >
                                <Calendar size={14} />
                                <span>Lịch tháng</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                title="Xem danh sách chi tiết tất cả buổi học"
                                className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-3 py-1.5 rounded transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-[11px] sm:text-xs font-bold ${
                                    viewMode === 'list'
                                        ? 'bg-brand-cerulean text-white shadow-xs'
                                        : 'text-gray-600 hover:text-brand-cerulean hover:bg-brand-cream'
                                }`}
                            >
                                <List size={14} />
                                <span>Danh sách</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleOpenAdd()}
                            className={`justify-center flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-jasper text-white font-serif-title shadow-editorial whitespace-nowrap hover:bg-brand-jasper/90 transition-all text-xs sm:text-sm font-bold shrink-0 ${
                                isScrolled ? 'px-2.5 py-1 text-xs w-auto' : 'w-full sm:w-auto'
                            }`}
                        >
                            <Plus size={14} /> <span>Thêm Buổi học</span>
                        </button>
                    </div>
                )}
            />

            {/* EMPTY STATE HELPER (Optional 1-Click Sample Timetable) */}
            {events.length === 0 && (
                <div className="p-6 bg-brand-cream border-2 border-dashed border-brand-cerulean/30 rounded-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-brand-cerulean/30 flex items-center justify-center text-brand-cerulean shrink-0">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-base">Chưa có lịch học nào trong hệ thống</h4>
                            <p className="text-xs text-gray-600 font-sans mt-0.5">Bạn có thể tạo lịch thủ công hoặc nạp nhanh mẫu thời khóa biểu tuần chuẩn Sáng & Chiều để trải nghiệm.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSeedSampleSchedule}
                        className="px-4 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-sm hover:bg-brand-cerulean/90 transition-all flex items-center gap-2 shrink-0"
                    >
                        <Sparkles size={14} /> Nạp mẫu TKB Tuần (Sáng & Chiều)
                    </button>
                </div>
            )}

            {/* 1. WEEKLY MATRIX TIMETABLE VIEW (Chế độ xem Thời Khóa Biểu Tuần) */}
            {viewMode === 'week' && (
                <div className="bg-white border-editorial shadow-editorial space-y-4 p-3.5 sm:p-5">
                    {/* Week Navigation Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-4 border-b border-brand-cerulean/20">
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                            <button
                                onClick={prevWeek}
                                className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 rounded-sm transition-colors cursor-pointer"
                                title="Tuần trước"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={jumpToToday}
                                className="px-3 py-1.5 text-xs font-serif-title font-bold text-brand-cerulean border border-brand-cerulean/30 hover:bg-brand-cream rounded-sm cursor-pointer"
                            >
                                Tuần này
                            </button>
                            <button
                                onClick={nextWeek}
                                className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 rounded-sm transition-colors cursor-pointer"
                                title="Tuần kế tiếp"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <h3 className="text-sm sm:text-lg md:text-xl font-serif-title text-brand-cerulean font-bold text-center">
                            Tuần từ {pad(weekDays[0].getDate())}/{pad(weekDays[0].getMonth() + 1)} đến {pad(weekDays[6].getDate())}/{pad(weekDays[6].getMonth() + 1)}/{weekDays[6].getFullYear()}
                        </h3>

                        {/* Session Legend Indicator */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs font-serif-title flex-wrap justify-center">
                            <span className="flex items-center gap-1.5 text-brand-cerulean font-semibold">
                                <Sun size={14} className="text-brand-cerulean" /> Ca Sáng
                            </span>
                            <span className="text-gray-300">&bull;</span>
                            <span className="flex items-center gap-1.5 text-brand-jasper font-semibold">
                                <Sunset size={14} className="text-brand-jasper" /> Ca Chiều
                            </span>
                            <span className="text-gray-300">&bull;</span>
                            <span className="flex items-center gap-1.5 text-brand-cerulean font-bold">
                                <Layers size={14} className="text-brand-cerulean" /> Cả 2 ca
                            </span>
                        </div>
                    </div>

                    {/* DEDICATED MOBILE WEEK VIEW (<md) */}
                    <div className="md:hidden space-y-4">
                        {/* Mobile 3-Way Mode Switcher: Theo ngày / Tất cả 7 ngày / Bảng 8 cột */}
                        <div className="flex items-center p-0.5 bg-brand-cream border border-brand-cerulean/20 rounded text-xs font-serif-title">
                            <button
                                type="button"
                                onClick={() => setMobileWeekTab('day')}
                                className={`flex-1 py-1.5 text-center font-bold transition-all rounded-xs cursor-pointer ${
                                    mobileWeekTab === 'day'
                                        ? 'bg-brand-cerulean text-white shadow-xs'
                                        : 'text-gray-600 hover:text-brand-cerulean'
                                }`}
                            >
                                Theo từng ngày
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileWeekTab('all')}
                                className={`flex-1 py-1.5 text-center font-bold transition-all rounded-xs cursor-pointer ${
                                    mobileWeekTab === 'all'
                                        ? 'bg-brand-cerulean text-white shadow-xs'
                                        : 'text-gray-600 hover:text-brand-cerulean'
                                }`}
                            >
                                Cả tuần (7 ngày)
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileWeekTab('matrix')}
                                className={`flex-1 py-1.5 text-center font-bold transition-all rounded-xs cursor-pointer ${
                                    mobileWeekTab === 'matrix'
                                        ? 'bg-brand-cerulean text-white shadow-xs'
                                        : 'text-gray-600 hover:text-brand-cerulean'
                                }`}
                            >
                                Bảng 8 cột
                            </button>
                        </div>

                        {/* MODE 1: THEO TỪNG NGÀY (DEFAULT MOBILE) */}
                        {mobileWeekTab === 'day' && (
                            <div className="space-y-4 animate-fade-in">
                                {/* Day Selector Ribbon (7 ngày T2 - CN) */}
                                <div className="grid grid-cols-7 gap-1 bg-brand-cream p-1 border border-brand-cerulean/20">
                                    {weekDays.map((d, idx) => {
                                        const dateStr = formatDateYMD(d);
                                        const isToday = dateStr === todayStr;
                                        const isSelected = dateStr === activeDayDate;
                                        const dayEvts = events.filter(e => e.date === dateStr);
                                        const hasEvts = dayEvts.length > 0;
                                        return (
                                            <button
                                                key={dateStr}
                                                type="button"
                                                onClick={() => setSelectedDayDate(dateStr)}
                                                className={`flex flex-col items-center py-2 px-0.5 border transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-brand-cerulean text-white border-brand-cerulean shadow-sm font-bold'
                                                        : isToday
                                                        ? 'bg-white text-brand-jasper border-brand-jasper font-bold'
                                                        : 'bg-white/80 text-gray-700 border-brand-cerulean/20 hover:bg-white'
                                                }`}
                                            >
                                                <span className={`text-[10px] font-serif-title uppercase font-bold ${
                                                    isSelected ? 'text-white' : isToday ? 'text-brand-jasper' : 'text-gray-500'
                                                }`}>
                                                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][idx]}
                                                </span>
                                                <span className={`text-sm font-sans font-bold mt-0.5 ${
                                                    isSelected ? 'text-white' : isToday ? 'text-brand-jasper' : 'text-brand-cerulean'
                                                }`}>
                                                    {pad(d.getDate())}
                                                </span>
                                                <div className="h-1.5 mt-1 flex items-center justify-center">
                                                    {hasEvts && (
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-brand-jasper'}`} />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Active Day Header & Action */}
                                <div className="flex items-center justify-between gap-2 px-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-serif-title font-bold text-brand-cerulean text-base">
                                            {selectedDayTitle}
                                        </span>
                                        {activeDayDate === todayStr && (
                                            <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-brand-jasper text-white px-1.5 py-0.5">
                                                Hôm nay
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenAdd(activeDayDate)}
                                        className="text-xs font-serif-title font-bold text-brand-jasper hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <Plus size={13} /> Thêm buổi
                                    </button>
                                </div>

                                {/* Selected Day Cards */}
                                {selectedDayEvents.length > 0 ? (
                                    <div className={`space-y-3 ${selectedDayEvents.length > 3 ? 'max-h-[520px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                                        {selectedDayEvents.map(evt => renderEventCard(evt))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white border border-dashed border-brand-cerulean/30 space-y-3">
                                        <p className="text-sm font-serif-title text-gray-600">
                                            Không có buổi học nào vào ngày này.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenAdd(activeDayDate)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-xs hover:bg-brand-cerulean/90 cursor-pointer"
                                        >
                                            <Plus size={13} /> Thêm buổi học vào ngày này
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODE 2: TẤT CẢ 7 NGÀY (CHẾ ĐỘ XEM CUỘN DỌC CẢ TUẦN) */}
                        {mobileWeekTab === 'all' && (
                            <div className="space-y-4 animate-fade-in">
                                {weekDays.map((d, idx) => {
                                    const dateStr = formatDateYMD(d);
                                    const isToday = dateStr === todayStr;
                                    const dayEvts = events.filter(e => e.date === dateStr);
                                    return (
                                        <div key={dateStr} className="space-y-2">
                                            <div className={`p-2.5 border flex items-center justify-between ${
                                                isToday
                                                    ? 'bg-brand-cream border-brand-jasper shadow-xs'
                                                    : 'bg-white border-brand-cerulean/20'
                                            }`}>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-serif-title font-bold text-sm ${isToday ? 'text-brand-jasper' : 'text-brand-cerulean'}`}>
                                                        {dayNames[idx]}, {pad(d.getDate())}/{pad(d.getMonth() + 1)}
                                                    </span>
                                                    {isToday && (
                                                        <span className="text-[9px] font-sans font-bold uppercase bg-brand-jasper text-white px-1.5 py-0.5">
                                                            Hôm nay
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-serif-title text-gray-500">
                                                        {dayEvts.length} buổi
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenAdd(dateStr)}
                                                        className="text-[11px] font-serif-title text-brand-jasper hover:underline font-bold cursor-pointer"
                                                    >
                                                        + Thêm
                                                    </button>
                                                </div>
                                            </div>
                                            {dayEvts.length > 0 ? (
                                                <div className="space-y-2.5 pl-1">
                                                    {dayEvts.map(evt => renderEventCard(evt))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic font-body px-3 py-1">
                                                    Không có tiết học
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Responsive Matrix Grid: Shown on desktop always, or on mobile when 'matrix' tab is active */}
                    <div className={`${mobileWeekTab === 'matrix' ? 'block' : 'hidden md:block'} overflow-x-auto pb-2`}>
                        {mobileWeekTab === 'matrix' && (
                            <div className="md:hidden text-[11px] text-brand-cerulean/80 flex items-center justify-between gap-1 font-serif-title bg-brand-cream/80 px-2.5 py-1.5 mb-2 border border-brand-cerulean/20">
                                <span>↔ Vuốt ngang bảng để xem đủ 7 ngày học</span>
                                <span className="font-bold font-sans">8 cột</span>
                            </div>
                        )}
                        <div className="min-w-[760px] border border-brand-cerulean/30">
                            {/* Days of Week Header */}
                            <div className="grid grid-cols-8 bg-brand-cream border-b border-brand-cerulean/30 text-center font-serif-title font-bold text-xs">
                                <div className="p-3 border-r border-brand-cerulean/30 text-brand-cerulean uppercase tracking-wider flex items-center justify-center">
                                    Ca học
                                </div>
                                {weekDays.map((d, idx) => {
                                    const dateStr = formatDateYMD(d);
                                    const isToday = dateStr === todayStr;
                                    return (
                                        <div
                                            key={dateStr}
                                            className={`p-2.5 border-r last:border-r-0 border-brand-cerulean/20 transition-colors ${
                                                isToday ? 'bg-white font-black text-brand-jasper border-b-2 border-b-brand-jasper' : 'text-brand-cerulean'
                                            }`}
                                        >
                                            <div className="text-xs uppercase">{dayNames[idx]}</div>
                                            <div className="text-sm font-sans mt-0.5">
                                                {pad(d.getDate())}/{pad(d.getMonth() + 1)}
                                                {isToday && (
                                                    <span className="block text-[9px] uppercase tracking-wider text-brand-jasper mt-0.5">Hôm nay</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Matrix Rows: Ca Sáng, Ca Chiều, Ca Tối */}
                            {TIMETABLE_ROWS.map((session, sIdx) => {
                                const SessionIcon = session.icon;
                                const isMorning = session.id === 'morning';
                                const isAfternoon = session.id === 'afternoon';

                                return (
                                    <div
                                        key={session.id}
                                        className={`grid grid-cols-8 border-b last:border-b-0 border-brand-cerulean/20 min-h-[140px] ${
                                            isMorning ? 'bg-white' : isAfternoon ? 'bg-brand-cream/35' : 'bg-brand-cream/60'
                                        }`}
                                    >
                                        {/* Row Label (Cột Ca học) */}
                                        <div className="p-3 border-r border-brand-cerulean/30 flex flex-col justify-between items-center text-center bg-brand-cream/60">
                                            <div className="space-y-1">
                                                <div className="p-2 rounded-full bg-white shadow-2xs inline-flex items-center justify-center">
                                                    <SessionIcon size={18} className={isMorning ? 'text-brand-cerulean' : isAfternoon ? 'text-brand-jasper' : 'text-brand-cerulean'} />
                                                </div>
                                                <div className="font-serif-title font-bold text-xs text-brand-cerulean">
                                                    {session.label}
                                                </div>
                                                <div className="text-[10px] text-gray-500 font-sans">
                                                    {session.time}
                                                </div>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-gray-600 border border-gray-200 font-mono inline-block">
                                                    {session.periods}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 7 Day Columns for this Session */}
                                        {weekDays.map((d) => {
                                            const dateStr = formatDateYMD(d);
                                            // An event with 'both' sessions appears in both Morning and Afternoon rows
                                            const dayEvents = events.filter(e => {
                                                if (e.date !== dateStr) return false;
                                                const s = getEventSession(e);
                                                if (session.id === 'morning') return s === 'morning' || s === 'both';
                                                if (session.id === 'afternoon') return s === 'afternoon' || s === 'both';
                                                if (session.id === 'evening') return s === 'evening';
                                                return false;
                                            });
                                            const isToday = dateStr === todayStr;

                                            return (
                                                <div
                                                    key={`${session.id}_${dateStr}`}
                                                    className={`p-2 border-r last:border-r-0 border-brand-cerulean/15 flex flex-col justify-between group relative transition-colors ${
                                                        isToday ? 'bg-brand-cream/20' : ''
                                                    }`}
                                                >
                                                    <div className="space-y-1.5 overflow-y-auto max-h-40">
                                                        {dayEvents.map(evt => {
                                                            const mod = modules.find(m => m.id === evt.moduleId);
                                                            const isBoth = getEventSession(evt) === 'both';
                                                            return (
                                                                <div
                                                                    key={evt.id}
                                                                    onClick={() => handleOpenEdit(evt)}
                                                                    className={`p-2 rounded-sm border text-xs font-sans shadow-xs transition-all cursor-pointer hover:shadow-editorial relative group/card ${
                                                                        isBoth
                                                                            ? 'bg-white border-2 border-brand-cerulean ring-1 ring-brand-cerulean/20 text-gray-900'
                                                                            : isAfternoon
                                                                            ? 'bg-white border-brand-jasper/40 hover:border-brand-jasper text-gray-800'
                                                                            : 'bg-white border-brand-cerulean/40 hover:border-brand-cerulean text-gray-800'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between gap-1 mb-1">
                                                                        <div className="flex items-center gap-1 flex-wrap">
                                                                            <span className="font-bold text-[10px] font-mono px-1 py-0.2 bg-brand-cream text-brand-cerulean border border-brand-cerulean/20 rounded-xs">
                                                                                {mod?.code || 'HP'}
                                                                            </span>
                                                                            {isBoth && (
                                                                                <span className="font-bold text-[9px] font-serif-title px-1 py-0.2 bg-brand-cerulean text-white rounded-xs flex items-center gap-0.5" title="Học cả 2 ca Sáng & Chiều (07:30 - 17:00)">
                                                                                    <Layers size={9} /> Cả 2 ca
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[10px] font-bold text-gray-500 font-mono shrink-0">
                                                                            {isBoth ? (isMorning ? '07:30-11:30' : '13:30-17:00') : `${evt.startTime} - ${evt.endTime}`}
                                                                        </span>
                                                                    </div>
                                                                    <div className="font-serif-title font-bold text-xs text-brand-cerulean line-clamp-2 leading-tight">
                                                                        {evt.title}
                                                                    </div>
                                                                    {isBoth && (
                                                                        <div className="text-[9px] text-gray-500 font-sans italic mt-0.5">
                                                                            {isMorning ? 'Kéo dài sang Ca Chiều' : 'Tiếp nối từ Ca Sáng'} (Tiết 1-10)
                                                                        </div>
                                                                    )}
                                                                    {evt.location && (
                                                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1 truncate">
                                                                            <MapPin size={10} className="text-brand-jasper shrink-0" />
                                                                            <span className="truncate">{evt.location}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-center justify-between text-[10px]">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className={`font-semibold ${
                                                                                evt.attendanceStatus === 'present' ? 'text-brand-cerulean' : evt.attendanceStatus === 'absent' ? 'text-brand-jasper' : 'text-gray-500'
                                                                            }`}>
                                                                                {evt.attendanceStatus === 'present' ? 'Có mặt' : evt.attendanceStatus === 'late' ? 'Trễ' : evt.attendanceStatus === 'absent' ? 'Vắng' : 'Kế hoạch'}
                                                                            </span>
                                                                            {(studyLogs || []).some(l => l.eventId === evt.id || (l.date === evt.date && l.moduleId === evt.moduleId)) && (
                                                                                <span className="text-brand-jasper flex items-center" title="Đã có ghi chép bài học">
                                                                                    <StickyNote size={10} />
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <Pencil size={10} className="text-gray-400 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Quick add button on cell bottom hover */}
                                                    <div className="flex items-center justify-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenAdd(dateStr, session.id)}
                                                            className="text-[10px] font-serif-title text-gray-500 hover:text-brand-cerulean py-0.5 px-1 hover:bg-white rounded-xs transition-colors"
                                                            title={`Thêm buổi học ${session.label}`}
                                                        >
                                                            + {session.shortLabel}
                                                        </button>
                                                        {session.id !== 'evening' && (
                                                            <>
                                                                <span className="text-gray-300 text-[9px]">&bull;</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleOpenAdd(dateStr, 'both')}
                                                                    className="text-[10px] font-serif-title text-brand-cerulean hover:underline py-0.5 px-1 hover:bg-white rounded-xs transition-colors font-bold"
                                                                    title="Thêm buổi học cả ngày (Cả 2 ca Sáng & Chiều)"
                                                                >
                                                                    + Cả 2 ca
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. MONTH GRID VIEW (Chế độ xem Lịch Tháng) */}
            {viewMode === 'grid' && (
                <div className="bg-white border-editorial p-3.5 sm:p-6 shadow-editorial space-y-4 sm:space-y-6">
                    {/* Month Nav Controls */}
                    <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-brand-cerulean/20">
                        <button onClick={prevMonth} className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <h3 className="text-lg sm:text-2xl font-serif-title text-brand-cerulean font-bold">
                            {monthNames[month]} - NĂM {year}
                        </h3>
                        <button onClick={nextMonth} className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Day Headers (Mon - Sun) */}
                    <div className="grid grid-cols-7 gap-1 text-center font-serif-title text-brand-cerulean font-bold text-xs sm:text-sm bg-brand-cream py-1.5 sm:py-2 border-b border-brand-cerulean">
                        <div><span className="sm:hidden">T2</span><span className="hidden sm:inline">Thứ 2</span></div>
                        <div><span className="sm:hidden">T3</span><span className="hidden sm:inline">Thứ 3</span></div>
                        <div><span className="sm:hidden">T4</span><span className="hidden sm:inline">Thứ 4</span></div>
                        <div><span className="sm:hidden">T5</span><span className="hidden sm:inline">Thứ 5</span></div>
                        <div><span className="sm:hidden">T6</span><span className="hidden sm:inline">Thứ 6</span></div>
                        <div><span className="sm:hidden">T7</span><span className="hidden sm:inline">Thứ 7</span></div>
                        <div><span className="sm:hidden">CN</span><span className="hidden sm:inline">Chủ nhật</span></div>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="h-16 sm:h-28 bg-gray-50/50 border border-gray-100 p-1 opacity-30"></div>
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                            const dayNum = dayIdx + 1;
                            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isToday = dayStr === todayStr;
                            const dayEvents = events
                                .filter(e => e.date === dayStr)
                                .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

                            const isSelected = dayStr === selectedMonthDate;
                            return (
                                <div
                                    key={dayStr}
                                    onClick={() => setSelectedMonthDate(dayStr)}
                                    className={`min-h-[64px] sm:h-32 border p-1 sm:p-2 flex flex-col justify-between transition-all cursor-pointer group ${
                                        isSelected
                                            ? 'ring-2 ring-brand-cerulean border-brand-cerulean bg-blue-50/40 font-bold shadow-xs'
                                            : isToday
                                            ? 'bg-brand-cream border-2 border-brand-jasper font-bold'
                                            : 'bg-white border-brand-cerulean/20 hover:bg-brand-cream/50'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-xs sm:text-sm font-sans font-bold ${isSelected ? 'text-brand-cerulean' : isToday ? 'text-brand-jasper' : 'text-brand-cerulean'}`}>
                                            {dayNum}
                                        </span>
                                        {isToday && (
                                            <span className="text-[9px] sm:text-[10px] bg-brand-jasper text-white px-1 font-sans uppercase">Hôm nay</span>
                                        )}
                                    </div>

                                    {/* On mobile: compact event dots */}
                                    <div className="sm:hidden flex flex-wrap gap-1 mt-1">
                                        {dayEvents.slice(0, 3).map(evt => (
                                            <span
                                                key={evt.id}
                                                className={`w-2 h-2 rounded-full ${
                                                    evt.attendanceStatus === 'present' ? 'bg-emerald-600' : evt.attendanceStatus === 'absent' ? 'bg-red-600' : 'bg-brand-cerulean'
                                                }`}
                                                title={evt.title}
                                            />
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <span className="text-[9px] font-bold text-brand-cerulean leading-none">+{dayEvents.length - 3}</span>
                                        )}
                                    </div>

                                    {/* Events List inside Day Cell with Session Icons (Desktop) */}
                                    <div className="hidden sm:block space-y-1 overflow-y-auto max-h-22 my-1">
                                        {dayEvents.map(evt => {
                                            const mod = modules.find(m => m.id === evt.moduleId);
                                            const session = getEventSession(evt);
                                            const isBoth = session === 'both';
                                            const isAft = session === 'afternoon';
                                            const statusBg = evt.attendanceStatus === 'present'
                                                ? 'bg-brand-cerulean text-white'
                                                : evt.attendanceStatus === 'absent'
                                                ? 'bg-brand-jasper text-white'
                                                : isBoth
                                                ? 'bg-brand-cream text-brand-cerulean border-2 border-brand-cerulean font-bold'
                                                : isAft
                                                ? 'bg-brand-cream text-brand-jasper border border-brand-jasper/40'
                                                : 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/40';

                                            return (
                                                <div
                                                    key={evt.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEdit(evt);
                                                    }}
                                                    className={`p-1 text-[11px] font-sans truncate rounded flex items-center justify-between cursor-pointer hover:opacity-90 hover:ring-1 hover:ring-brand-cerulean/40 transition-all ${statusBg}`}
                                                    title={`[${isBoth ? 'Cả 2 ca (Sáng & Chiều)' : isAft ? 'Ca Chiều' : 'Ca Sáng'}] ${evt.startTime} - ${evt.endTime}: ${evt.title}`}
                                                >
                                                    <span className="truncate flex items-center gap-1">
                                                        {isBoth ? (
                                                            <Layers size={10} className={evt.attendanceStatus === 'present' || evt.attendanceStatus === 'absent' ? 'text-white shrink-0' : 'text-brand-cerulean shrink-0'} />
                                                        ) : isAft ? (
                                                            <Sunset size={10} className={evt.attendanceStatus === 'present' || evt.attendanceStatus === 'absent' ? 'text-white shrink-0' : 'text-brand-jasper shrink-0'} />
                                                        ) : (
                                                            <Sun size={10} className={evt.attendanceStatus === 'present' || evt.attendanceStatus === 'absent' ? 'text-white shrink-0' : 'text-brand-cerulean shrink-0'} />
                                                        )}
                                                        <span className="font-bold font-mono">{isBoth ? 'Cả 2 ca' : evt.startTime}</span>
                                                        <span className="truncate">{mod?.code || evt.title}</span>
                                                    </span>
                                                    <Pencil size={9} className="opacity-70 shrink-0 ml-0.5" />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="text-[10px] text-gray-400 group-hover:text-brand-jasper opacity-0 group-hover:opacity-100 transition-opacity text-right font-serif-title">
                                        + Xem
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* SELECTED DATE DETAILS PANEL (Crucial for Mobile & Helpful on Desktop) */}
                    <div className="pt-4 sm:pt-6 border-t border-brand-cerulean/20 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-brand-cerulean shrink-0" />
                                <h4 className="font-serif-title font-bold text-brand-cerulean text-base sm:text-lg">
                                    Lịch học: {selectedMonthDateFormatted}
                                </h4>
                                {selectedMonthDate === todayStr && (
                                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-brand-jasper text-white px-1.5 py-0.5">
                                        Hôm nay
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => handleOpenAdd(selectedMonthDate)}
                                className="text-xs font-serif-title font-bold text-brand-jasper hover:underline flex items-center gap-1 cursor-pointer w-fit"
                            >
                                <Plus size={13} /> Thêm buổi học vào ngày này
                            </button>
                        </div>

                        {monthSelectedDateEvents.length > 0 ? (
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${monthSelectedDateEvents.length > 3 ? 'max-h-[520px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                                {monthSelectedDateEvents.map(evt => renderEventCard(evt))}
                            </div>
                        ) : (
                            <div className="p-6 text-center bg-brand-cream/50 border border-dashed border-brand-cerulean/30 space-y-2">
                                <p className="text-xs sm:text-sm font-serif-title text-gray-500">
                                    Không có buổi học nào vào ngày này.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleOpenAdd(selectedMonthDate)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-xs hover:bg-brand-cerulean/90 cursor-pointer"
                                >
                                    <Plus size={12} /> Thêm buổi học
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 3. LIST VIEW (Chế độ xem Danh Sách với Bộ lọc Ca học) */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {/* Session Quick Filter Bar */}
                    <div className="bg-white border-editorial p-3.5 sm:p-4 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean shrink-0">
                            <Filter size={15} /> Lọc theo Ca học:
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => setSessionFilter('all')}
                                className={`px-3 py-1.5 text-xs font-serif-title font-bold rounded transition-all whitespace-nowrap shrink-0 sm:shrink cursor-pointer ${
                                    sessionFilter === 'all'
                                        ? 'bg-brand-cerulean text-white shadow-xs'
                                        : 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 hover:bg-white'
                                }`}
                            >
                                Tất cả ca ({events.length})
                            </button>
                            {SESSIONS.map(s => {
                                const count = s.id === 'both'
                                    ? events.filter(e => getEventSession(e) === 'both').length
                                    : s.id === 'morning'
                                    ? events.filter(e => { const ses = getEventSession(e); return ses === 'morning' || ses === 'both'; }).length
                                    : s.id === 'afternoon'
                                    ? events.filter(e => { const ses = getEventSession(e); return ses === 'afternoon' || ses === 'both'; }).length
                                    : events.filter(e => getEventSession(e) === s.id).length;
                                const SIcon = s.icon;
                                const isSelected = sessionFilter === s.id;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setSessionFilter(s.id)}
                                        className={`px-3 py-1.5 text-xs font-serif-title font-bold rounded transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 sm:shrink cursor-pointer ${
                                            isSelected
                                                ? s.id === 'afternoon' ? 'bg-brand-jasper text-white shadow-xs' : 'bg-brand-cerulean text-white shadow-xs'
                                                : s.badgeClass + ' hover:bg-white'
                                        }`}
                                    >
                                        <SIcon size={13} className={isSelected ? 'text-white' : s.iconColor} />
                                        <span>{s.label} ({count})</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events List */}
                    <div className={`space-y-4 ${filteredListEvents.length > 3 ? 'max-h-[720px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                        {filteredListEvents.map(evt => {
                            const mod = modules.find(m => m.id === evt.moduleId);
                            const session = getEventSession(evt);
                            const sessionMeta = SESSIONS.find(s => s.id === session) || SESSIONS[0];
                            const SessionIcon = sessionMeta.icon;
                            const isBoth = session === 'both';

                            return (
                                <div key={evt.id} className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                                    <div className="flex-1 space-y-2 w-full">
                                        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                                            <span className="px-2.5 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[11px] sm:text-xs font-bold font-sans">
                                                {mod?.code || 'Học phần'}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded text-[11px] sm:text-xs font-serif-title font-bold flex items-center gap-1.5 ${sessionMeta.badgeClass}`}>
                                                <SessionIcon size={13} className={sessionMeta.iconColor} />
                                                {sessionMeta.label} ({evt.startTime} - {evt.endTime})
                                                {isBoth && <span className="font-mono text-[10px] text-brand-jasper font-bold">&bull; Tiết 1 - 10</span>}
                                            </span>
                                            <span className="text-xs sm:text-sm font-sans text-gray-500 font-bold">{evt.date}</span>
                                        </div>

                                        <h4 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold">{evt.title}</h4>

                                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-body text-gray-600 items-center">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-brand-jasper shrink-0" />
                                                {evt.location || 'Chưa cập nhật địa điểm'}
                                            </span>
                                            {mod?.instructor && (
                                                <span className="flex items-center gap-1.5 text-brand-cerulean font-serif-title font-semibold">
                                                    <GraduationCap size={14} className="text-brand-cerulean shrink-0" />
                                                    GV: {mod.instructor}
                                                </span>
                                            )}
                                            {evt.meetLink && (
                                                <a href={evt.meetLink} target="_blank" rel="noreferrer" className="text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                                                    <ExternalLink size={14} /> Link Google Meet / Zoom
                                                </a>
                                            )}
                                        </div>

                                        {/* SỔ GHI CHÉP BÀI HỌC CỦA BUỔI HỌC NÀY */}
                                        {(() => {
                                            const relatedLog = getLinkedStudyLog(evt);
                                            if (relatedLog) {
                                                return (
                                                    <div className="flex items-center justify-between gap-2 p-2 bg-brand-cream/70 border border-brand-cerulean/30 rounded-xs text-xs">
                                                        <div className="flex items-center gap-1.5 text-brand-cerulean overflow-hidden">
                                                            <StickyNote size={14} className="text-brand-jasper shrink-0" />
                                                            <span className="font-serif-title font-bold shrink-0">Ghi chép:</span>
                                                            <span className="font-sans font-semibold text-gray-800 truncate">{relatedLog.title}</span>
                                                        </div>
                                                        {navigate && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (typeof window !== 'undefined') {
                                                                        sessionStorage.setItem('pedagogy_view_log_id', relatedLog.id);
                                                                        sessionStorage.setItem('pedagogy_resources_tab', 'logs');
                                                                    }
                                                                    navigate('resources');
                                                                }}
                                                                className="text-xs font-serif-title font-bold text-brand-jasper hover:underline shrink-0 ml-2"
                                                            >
                                                                Mở sổ &rarr;
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            if (navigate) {
                                                return (
                                                    <div className="pt-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (typeof window !== 'undefined') {
                                                                    sessionStorage.setItem('pedagogy_open_log_modal', 'true');
                                                                    sessionStorage.setItem('pedagogy_prefill_module_id', evt.moduleId || '');
                                                                    sessionStorage.setItem('pedagogy_prefill_date', evt.date || '');
                                                                    sessionStorage.setItem('pedagogy_resources_tab', 'logs');
                                                                }
                                                                navigate('resources');
                                                            }}
                                                            className="inline-flex items-center gap-1 text-xs font-serif-title font-bold text-brand-cerulean/80 hover:text-brand-cerulean hover:underline"
                                                        >
                                                            <BookOpen size={12} /> Tạo ghi chép cho buổi học này &rarr;
                                                        </button>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    <div className="flex flex-col sm:flex-row md:flex-col items-end sm:items-center md:items-end justify-between gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEdit(evt)}
                                                className="px-2.5 py-1 text-xs font-serif-title font-semibold text-brand-cerulean border border-brand-cerulean/30 hover:bg-brand-cerulean hover:text-white rounded transition-all flex items-center gap-1"
                                                title="Chỉnh sửa buổi học"
                                            >
                                                <Pencil size={12} /> Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm(`Xóa sự kiện "${evt.title}"?`)) {
                                                        onDeleteEvent(evt.id);
                                                    }
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-brand-jasper hover:bg-brand-cream rounded transition-colors"
                                                title="Xóa sự kiện"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                        <div className="flex gap-1 bg-brand-cream p-1 border border-brand-cerulean/20 w-full sm:w-auto justify-around sm:justify-start">
                                            <button
                                                onClick={() => handleCheckin(evt, 'present')}
                                                className={`flex-1 sm:flex-none text-center px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'present' ? 'bg-brand-cerulean text-white font-bold' : 'text-gray-600 hover:bg-white'}`}
                                            >
                                                Có mặt
                                            </button>
                                            <button
                                                onClick={() => handleCheckin(evt, 'late')}
                                                className={`flex-1 sm:flex-none text-center px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'late' ? 'bg-brand-jasper/80 text-white font-bold' : 'text-gray-600 hover:bg-white'}`}
                                            >
                                                Trễ
                                            </button>
                                            <button
                                                onClick={() => handleCheckin(evt, 'absent')}
                                                className={`flex-1 sm:flex-none text-center px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'absent' ? 'bg-brand-jasper text-white font-bold' : 'text-gray-600 hover:bg-white'}`}
                                            >
                                                Vắng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredListEvents.length === 0 && (
                        <div className="p-12 text-center border border-dashed border-brand-cerulean/40 text-gray-500 font-serif-title bg-white">
                            Không có buổi học nào trong bộ lọc này.
                        </div>
                    )}
                </div>
            )}

            {/* MODAL: THÊM / CHỈNH SỬA LỊCH HỌC VỚI PRESET CA SÁNG / CA CHIỀU */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingEventId(null);
                }}
                title={editingEventId ? "Chỉnh sửa Lịch học / Lịch thi" : "Thêm Sự kiện Lịch học / Lịch thi"}
            >
                <form onSubmit={handleSaveEvent} className="space-y-6">
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
                        <input
                            required
                            type="text"
                            className="input-editorial w-full"
                            value={eventForm.title}
                            onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                            placeholder="VD: Buổi 3 - Phương pháp giảng dạy môn học..."
                        />
                    </div>

                    {/* Quick Session Selection & Multi-select (Có thể chọn cả 2 ca) */}
                    <div className="space-y-3 p-3.5 bg-brand-cream border border-brand-cerulean/30 rounded-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <label className="text-xs font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                <Clock size={14} className="text-brand-cerulean" />
                                Chọn Ca học:
                            </label>
                            <span className="text-[11px] text-gray-500 font-sans italic">
                                Có thể chọn riêng Ca Sáng, Ca Chiều hoặc <strong>chọn cả 2 ca luôn</strong>
                            </span>
                        </div>

                        {/* 4 Preset Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SESSIONS.map(session => {
                                const SIcon = session.icon;
                                const currentSession = eventForm.session || getEventSession(eventForm);
                                const isMatched = currentSession === session.id ||
                                    (eventForm.startTime === session.defaultStart && eventForm.endTime === session.defaultEnd);
                                const isBoth = session.id === 'both';
                                const isAfternoon = session.id === 'afternoon';

                                return (
                                    <button
                                        key={session.id}
                                        type="button"
                                        onClick={() => handleApplySessionPreset(session)}
                                        className={`p-2.5 text-xs font-serif-title font-bold rounded border transition-all flex flex-col items-center justify-center gap-1 text-center ${
                                            isMatched
                                                ? isBoth
                                                    ? 'bg-brand-cerulean text-white border-brand-cerulean shadow-md ring-2 ring-brand-cerulean/30'
                                                    : isAfternoon
                                                    ? 'bg-brand-jasper text-white border-brand-jasper shadow-sm'
                                                    : 'bg-brand-cerulean text-white border-brand-cerulean shadow-sm'
                                                : isBoth
                                                ? 'bg-white text-brand-cerulean border-dashed border-2 border-brand-cerulean/50 hover:border-brand-cerulean hover:bg-brand-cream'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-brand-cerulean hover:bg-brand-cream'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <SIcon size={14} className={isMatched ? 'text-white' : isBoth ? 'text-brand-cerulean' : session.iconColor} />
                                            <span>{session.shortLabel}</span>
                                        </div>
                                        <span className={`text-[10px] font-mono ${isMatched ? 'text-white/90' : 'text-gray-500'}`}>
                                            {session.timeRange}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Multi-select Checkboxes */}
                        <div className="pt-2 border-t border-brand-cerulean/15 flex flex-wrap items-center justify-between gap-2 text-xs font-serif-title">
                            <span className="text-[11px] text-gray-600 font-semibold">
                                Tích chọn linh hoạt:
                            </span>
                            <div className="flex items-center gap-4 flex-wrap">
                                <label
                                    onClick={() => handleToggleSessionCheckbox('morning')}
                                    className="flex items-center gap-1.5 cursor-pointer text-brand-cerulean select-none hover:opacity-80"
                                >
                                    {(eventForm.session === 'morning' || eventForm.session === 'both' || (eventForm.startTime < '12:00' && eventForm.endTime >= '11:00')) ? (
                                        <CheckSquare size={15} className="text-brand-cerulean" />
                                    ) : (
                                        <Square size={15} className="text-gray-400" />
                                    )}
                                    <span>Ca Sáng (07:30–11:30)</span>
                                </label>

                                <label
                                    onClick={() => handleToggleSessionCheckbox('afternoon')}
                                    className="flex items-center gap-1.5 cursor-pointer text-brand-jasper select-none hover:opacity-80"
                                >
                                    {(eventForm.session === 'afternoon' || eventForm.session === 'both' || (eventForm.startTime < '18:00' && eventForm.endTime >= '13:00' && eventForm.startTime >= '12:00') || (eventForm.startTime < '12:00' && eventForm.endTime >= '14:00')) ? (
                                        <CheckSquare size={15} className="text-brand-jasper" />
                                    ) : (
                                        <Square size={15} className="text-gray-400" />
                                    )}
                                    <span>Ca Chiều (13:30–17:00)</span>
                                </label>

                                <label
                                    onClick={() => handleToggleSessionCheckbox('evening')}
                                    className="flex items-center gap-1.5 cursor-pointer text-gray-700 select-none hover:opacity-80"
                                >
                                    {(eventForm.session === 'evening' || (eventForm.startTime >= '18:00')) ? (
                                        <CheckSquare size={15} className="text-brand-cerulean" />
                                    ) : (
                                        <Square size={15} className="text-gray-400" />
                                    )}
                                    <span>Ca Tối (18:00–21:00)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                    {/* Conflict Warning if overlapping */}
                    {conflictEvent && (
                        <div className="p-3 bg-brand-cream border-2 border-brand-jasper/40 rounded-sm flex items-start gap-2.5 text-xs text-brand-jasper animate-fade-in-down shadow-sm">
                            <AlertTriangle size={16} className="text-brand-jasper shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                                <p className="font-serif-title font-bold text-sm">
                                    Lưu ý trùng giờ / ca học!
                                </p>
                                <p className="text-gray-700 font-sans">
                                    Ngày <span className="font-bold">{eventForm.date}</span> đã có sự kiện: <strong className="text-brand-jasper">[{conflictEvent.title}]</strong> vào khung giờ <strong className="font-mono">{conflictEvent.startTime} – {conflictEvent.endTime}</strong>. Hãy kiểm tra lại nếu không muốn bị trùng ca.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Địa điểm / Phòng học</label>
                            <input
                                type="text"
                                className="input-editorial w-full"
                                value={eventForm.location}
                                onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                                placeholder="VD: Phòng A3.02 - Giảng đường A"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Link Meet / Zoom (Nếu online)</label>
                            <input
                                type="url"
                                className="input-editorial w-full"
                                value={eventForm.meetLink}
                                onChange={e => setEventForm({ ...eventForm, meetLink: e.target.value })}
                                placeholder="https://meet.google.com/..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <EditorialSelect
                                label="Trạng thái Điểm danh"
                                value={eventForm.attendanceStatus || 'planned'}
                                onChange={val => setEventForm({ ...eventForm, attendanceStatus: val })}
                                options={[
                                    { label: 'Lên kế hoạch / Chưa diễn ra', value: 'planned' },
                                    { label: 'Có mặt', value: 'present' },
                                    { label: 'Đi trễ', value: 'late' },
                                    { label: 'Vắng mặt', value: 'absent' }
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Ghi chú dặn dò</label>
                            <input
                                type="text"
                                className="input-editorial w-full"
                                value={eventForm.notes}
                                onChange={e => setEventForm({ ...eventForm, notes: e.target.value })}
                                placeholder="Ví dụ: Mang theo giáo án & máy tính cá nhân..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-brand-cerulean/20">
                        {editingEventId ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
                                        onDeleteEvent(editingEventId);
                                        setIsModalOpen(false);
                                        setEditingEventId(null);
                                    }
                                }}
                                className="text-xs text-brand-jasper hover:underline font-serif-title flex items-center gap-1 font-bold"
                            >
                                <Trash2 size={14} /> Xóa sự kiện
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingEventId(null);
                                }}
                                className="px-5 py-2 text-gray-500 font-serif-title"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-cerulean/90 transition-colors font-bold"
                            >
                                {editingEventId ? 'Lưu Thay Đổi' : 'Lưu Sự Kiện'}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
