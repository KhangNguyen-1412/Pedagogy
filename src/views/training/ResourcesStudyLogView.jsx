import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    FolderOpen,
    BookMarked,
    Plus,
    Trash2,
    FileText,
    ExternalLink,
    Pencil,
    Calendar,
    Clock,
    GraduationCap,
    Sparkles,
    CheckSquare,
    Square,
    Search,
    BookOpen,
    HelpCircle,
    CheckCircle2,
    ListChecks,
    Printer,
    Eye,
    Filter,
    Sun,
    Sunset,
    Moon,
    Layers,
    X,
    CalendarDays,
    ChevronRight,
    StickyNote,
    ArrowLeft,
    Save,
    RotateCcw,
    Bookmark,
    Info,
    Check,
    PanelRightClose,
    PanelRightOpen,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { EditorialSelect, EditorialDatePicker, Modal } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';

const DRAFT_STORAGE_KEY = 'pedagogy_study_log_draft';
const PREFILL_EVENT_KEY = 'pedagogy_prefill_event';
const EDITOR_ACTIVE_KEY = 'pedagogy_study_log_editor_active';

export const ResourcesStudyLogView = ({
    modules = [],
    studyLogs = [],
    resources = [],
    events = [],
    onAddStudyLog,
    onUpdateStudyLog,
    onDeleteStudyLog,
    onAddResource,
    onDeleteResource,
    navigate
}) => {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('pedagogy_resources_tab');
            if (saved) return saved;
        }
        return 'logs';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pedagogy_resources_tab', activeTab);
        }
    }, [activeTab]);

    // Resource Form State (for Tab: Tài liệu học phần)
    const [resForm, setResForm] = useState({
        moduleId: modules[0]?.id || '',
        title: '',
        type: 'Drive / PDF',
        url: ''
    });

    // Study Log Filter & Search State
    const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Reading Focus Modal State
    const [viewingLog, setViewingLog] = useState(null);

    // Initial empty log form
    const initialLogForm = {
        moduleId: modules[0]?.id || '',
        eventId: '',
        sessionNumber: '1',
        date: new Date().toISOString().split('T')[0],
        sessionTime: 'morning',
        instructor: '',
        title: '',
        content: '',
        keyTakeaways: '',
        homework: '',
        questions: '',
        attachments: '',
        completedTasks: []
    };

    // Full-page Editor State
    const [editorMode, setEditorMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem(EDITOR_ACTIVE_KEY);
            return saved === 'true';
        }
        return false;
    });

    const [editingLogId, setEditingLogId] = useState(null);
    const [selectedCalendarEventId, setSelectedCalendarEventId] = useState('');
    const [logForm, setLogForm] = useState(initialLogForm);
    const [lastSavedDraftTime, setLastSavedDraftTime] = useState(null);
    const [showReferenceSidebar, setShowReferenceSidebar] = useState(true);
    const [saveFeedback, setSaveFeedback] = useState(null);

    // Persisted draft detection from localStorage
    const [savedDraft, setSavedDraft] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
                if (raw) return JSON.parse(raw);
            } catch (e) {}
        }
        return null;
    });

    // Synchronize editorMode with sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(EDITOR_ACTIVE_KEY, editorMode ? 'true' : 'false');
        }
    }, [editorMode]);

    // Check for prefill event from Calendar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const prefillRaw = sessionStorage.getItem(PREFILL_EVENT_KEY);
            if (prefillRaw) {
                try {
                    const evt = JSON.parse(prefillRaw);
                    sessionStorage.removeItem(PREFILL_EVENT_KEY);
                    handleOpenAddLog(evt.moduleId, evt);
                } catch (e) {}
            }
        }
    }, []);

    // Check for view log request from Calendar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const viewLogId = sessionStorage.getItem('pedagogy_view_log_id');
            if (viewLogId) {
                sessionStorage.removeItem('pedagogy_view_log_id');
                const target = studyLogs.find(l => l.id === viewLogId);
                if (target) {
                    setViewingLog(target);
                }
            }
        }
    }, [studyLogs]);

    // AUTO-SAVE DRAFT TO LOCALSTORAGE whenever logForm changes in editorMode
    useEffect(() => {
        if (editorMode) {
            const hasMeaningfulContent = (logForm.title && logForm.title.trim()) ||
                                         (logForm.content && logForm.content.trim()) ||
                                         (logForm.homework && logForm.homework.trim()) ||
                                         (logForm.keyTakeaways && logForm.keyTakeaways.trim()) ||
                                         (logForm.questions && logForm.questions.trim());

            if (hasMeaningfulContent) {
                const draftData = {
                    editingLogId,
                    formData: logForm,
                    selectedCalendarEventId,
                    lastSavedAt: new Date().toISOString()
                };
                localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
                setSavedDraft(draftData);
                setLastSavedDraftTime(new Date());
            }
        }
    }, [logForm, editorMode, editingLogId, selectedCalendarEventId]);

    const moduleOptions = modules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));
    const filterModuleOptions = [
        { label: 'Tất cả học phần', value: 'all' },
        ...moduleOptions
    ];

    // Build event options for quick linking
    const eventOptions = useMemo(() => {
        const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
        return [
            { label: '-- Nhập tự do (Không liên kết lịch) --', value: '' },
            ...sorted.map(evt => {
                const mod = modules.find(m => m.id === evt.moduleId);
                const sessionLabel = evt.session === 'afternoon' ? 'Chiều' : evt.session === 'evening' ? 'Tối' : evt.session === 'both' ? 'Cả ngày' : 'Sáng';
                return {
                    label: `[${evt.date} • ${sessionLabel}] ${mod?.code || 'HP'}: ${evt.title}`,
                    value: evt.id
                };
            })
        ];
    }, [events, modules]);

    // Current module in editor form
    const currentEditorModule = useMemo(() => {
        return modules.find(m => m.id === logForm.moduleId);
    }, [modules, logForm.moduleId]);

    // Resources matching the currently selected module in editor
    const moduleResources = useMemo(() => {
        if (!logForm.moduleId) return [];
        return resources.filter(r => r.moduleId === logForm.moduleId);
    }, [resources, logForm.moduleId]);

    // When selecting an event from Calendar in the Editor
    const handleSelectCalendarEvent = (evtId) => {
        setSelectedCalendarEventId(evtId);
        if (!evtId) {
            setLogForm(prev => ({ ...prev, eventId: '' }));
            return;
        }

        const evt = events.find(e => e.id === evtId);
        if (!evt) return;

        const mod = modules.find(m => m.id === evt.moduleId);
        const matchBuoi = evt.title.match(/buổi\s*(\d+)/i);
        const inferredSession = matchBuoi ? matchBuoi[1] : '';

        setLogForm(prev => ({
            ...prev,
            eventId: evt.id,
            moduleId: evt.moduleId || prev.moduleId,
            date: evt.date || prev.date,
            sessionTime: evt.session || 'morning',
            instructor: mod?.instructor || prev.instructor || '',
            sessionNumber: inferredSession || prev.sessionNumber || '1',
            title: prev.title || evt.title || '',
            attachments: prev.attachments || evt.meetLink || ''
        }));
    };

    // Open Add Log Page
    const handleOpenAddLog = (prefillModuleId = null, prefillEvent = null) => {
        setEditingLogId(null);
        setSelectedCalendarEventId(prefillEvent ? prefillEvent.id : '');

        const targetModId = prefillModuleId || prefillEvent?.moduleId || modules[0]?.id || '';
        const targetMod = modules.find(m => m.id === targetModId);
        const existingLogsCount = studyLogs.filter(l => l.moduleId === targetModId).length;
        const nextSessionNum = String(existingLogsCount + 1);

        setLogForm({
            moduleId: targetModId,
            eventId: prefillEvent ? prefillEvent.id : '',
            sessionNumber: nextSessionNum,
            date: prefillEvent ? prefillEvent.date : new Date().toISOString().split('T')[0],
            sessionTime: prefillEvent ? (prefillEvent.session || 'morning') : 'morning',
            instructor: targetMod?.instructor || '',
            title: prefillEvent ? prefillEvent.title : '',
            content: '',
            keyTakeaways: '',
            homework: '',
            questions: '',
            attachments: prefillEvent?.meetLink || '',
            completedTasks: []
        });

        setActiveTab('logs');
        setEditorMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Open Edit Log Page
    const handleOpenEditLog = (log) => {
        setEditingLogId(log.id);
        setSelectedCalendarEventId(log.eventId || '');
        const mod = modules.find(m => m.id === log.moduleId);

        setLogForm({
            moduleId: log.moduleId || modules[0]?.id || '',
            eventId: log.eventId || '',
            sessionNumber: log.sessionNumber || '1',
            date: log.date || new Date().toISOString().split('T')[0],
            sessionTime: log.sessionTime || 'morning',
            instructor: log.instructor || mod?.instructor || '',
            title: log.title || '',
            content: log.content || '',
            keyTakeaways: log.keyTakeaways || '',
            homework: log.homework || '',
            questions: log.questions || '',
            attachments: log.attachments || '',
            completedTasks: Array.isArray(log.completedTasks) ? log.completedTasks : []
        });

        setActiveTab('logs');
        setEditorMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Resume writing from saved draft
    const handleResumeDraft = () => {
        if (!savedDraft) return;
        setEditingLogId(savedDraft.editingLogId || null);
        setSelectedCalendarEventId(savedDraft.selectedCalendarEventId || '');
        setLogForm(savedDraft.formData);
        setActiveTab('logs');
        setEditorMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Discard saved draft
    const handleDiscardDraft = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi chép dở dang này và bắt đầu lại?')) {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            setSavedDraft(null);
            setLogForm(initialLogForm);
            setEditingLogId(null);
            setSelectedCalendarEventId('');
        }
    };

    // Exit editor mode (draft is retained in localStorage)
    const handleExitEditor = () => {
        setEditorMode(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Save Log to permanent list
    const handleSaveLog = (e) => {
        e.preventDefault();
        if (!logForm.title.trim()) {
            alert('Vui lòng nhập chủ đề hoặc tên bài học.');
            return;
        }

        if (editingLogId) {
            if (onUpdateStudyLog) {
                onUpdateStudyLog({
                    id: editingLogId,
                    ...logForm
                });
            }
        } else {
            onAddStudyLog({
                id: 'log_' + Date.now(),
                createdAt: new Date().toISOString(),
                ...logForm
            });
        }

        // Clear saved draft from localStorage on successful save
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setSavedDraft(null);
        setEditingLogId(null);
        setEditorMode(false);

        // Flash feedback
        setSaveFeedback('Đã lưu bài học vào Sổ ghi chép thành công!');
        setTimeout(() => setSaveFeedback(null), 4000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Toggle homework task directly on note card
    const handleToggleHomeworkTask = (log, taskIndex) => {
        if (!onUpdateStudyLog) return;
        const currentCompleted = Array.isArray(log.completedTasks) ? [...log.completedTasks] : [];
        const isDone = currentCompleted.includes(taskIndex);
        const nextCompleted = isDone
            ? currentCompleted.filter(idx => idx !== taskIndex)
            : [...currentCompleted, taskIndex];

        onUpdateStudyLog({
            ...log,
            completedTasks: nextCompleted
        });
    };

    // Create Resource handler
    const handleCreateResource = (e) => {
        e.preventDefault();
        onAddResource({
            id: 'res_' + Date.now(),
            ...resForm
        });
        setResForm({ moduleId: modules[0]?.id || '', title: '', type: 'Drive / PDF', url: '' });
    };

    // Filter study logs by module and search query
    const filteredLogs = useMemo(() => {
        return studyLogs.filter(log => {
            if (selectedModuleFilter !== 'all' && log.moduleId !== selectedModuleFilter) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const titleMatch = (log.title || '').toLowerCase().includes(q);
                const contentMatch = (log.content || '').toLowerCase().includes(q);
                const keyMatch = (log.keyTakeaways || '').toLowerCase().includes(q);
                const instrMatch = (log.instructor || '').toLowerCase().includes(q);
                const hwMatch = (log.homework || '').toLowerCase().includes(q);
                if (!titleMatch && !contentMatch && !keyMatch && !instrMatch && !hwMatch) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => {
            const dateComp = new Date(b.date || 0) - new Date(a.date || 0);
            if (dateComp !== 0) return dateComp;
            return (Number(b.sessionNumber) || 0) - (Number(a.sessionNumber) || 0);
        });
    }, [studyLogs, selectedModuleFilter, searchQuery]);

    // Parse homework string into array of items
    const parseHomeworkItems = (text) => {
        if (!text) return [];
        return text
            .split(/\r?\n|;/)
            .map(t => t.trim().replace(/^[-*•]\s*/, ''))
            .filter(Boolean);
    };

    // Parse key takeaways into badges
    const parseKeyTakeaways = (text) => {
        if (!text) return [];
        return text
            .split(/[,;\n]/)
            .map(t => t.trim().replace(/^[-*•]\s*/, ''))
            .filter(Boolean);
    };

    const getSessionMeta = (sessionTime) => {
        switch (sessionTime) {
            case 'afternoon':
                return { label: 'Ca Chiều (13:30–17:00)', icon: Sunset, color: 'text-brand-jasper', badge: 'bg-brand-cream text-brand-jasper border border-brand-jasper/30' };
            case 'evening':
                return { label: 'Ca Tối (18:00–21:00)', icon: Moon, color: 'text-brand-cerulean', badge: 'bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/30' };
            case 'both':
                return { label: 'Cả 2 ca (07:30–17:00)', icon: Layers, color: 'text-brand-cerulean', badge: 'bg-brand-cream text-brand-cerulean border-2 border-brand-cerulean font-bold' };
            case 'morning':
            default:
                return { label: 'Ca Sáng (07:30–11:30)', icon: Sun, color: 'text-brand-cerulean', badge: 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/30' };
        }
    };

    // =========================================================================
    // VIEW 1: TRANG SOẠN THẢO BÀI HỌC TOÀN TRANG (FULL-PAGE LESSON NOTE EDITOR)
    // =========================================================================
    if (editorMode) {
        return (
            <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
                {/* MINIMALIST COMPACT HEADER */}
                <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-3 md:pt-6 pb-3 -mt-6 md:-mt-12 border-b border-brand-cerulean/20 flex items-center justify-between gap-4">
                    {/* Left: Simple back link & module badge */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        <button
                            type="button"
                            onClick={handleExitEditor}
                            className="flex items-center gap-1 text-gray-500 hover:text-brand-cerulean font-serif-title text-xs sm:text-sm transition-colors py-1 shrink-0"
                            title="Quay lại danh sách (Bản nháp tự động lưu)"
                        >
                            <ArrowLeft size={16} />
                            <span>Sổ bài học</span>
                        </button>

                        <span className="text-gray-300 shrink-0">/</span>

                        <h2 className="font-serif-title text-brand-cerulean font-bold text-base sm:text-lg truncate">
                            {editingLogId ? 'Sửa bài học' : 'Soạn bài học mới'}
                        </h2>

                        {currentEditorModule && (
                            <span className="hidden sm:inline-flex items-center text-[11px] font-serif-title px-2 py-0.5 bg-white text-brand-cerulean border border-brand-cerulean/20 rounded-xs shrink-0">
                                {currentEditorModule.code} &bull; Buổi {logForm.sessionNumber || '01'}
                            </span>
                        )}
                    </div>

                    {/* Right: Auto-save status, Slide drawer toggle & Save Button */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Subtle auto-save status */}
                        <div
                            className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-500 font-sans"
                            title="Mọi nội dung đang soạn được tự động bảo lưu liên tục trên máy"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Đã lưu nháp{lastSavedDraftTime ? ` ${lastSavedDraftTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
                        </div>

                        {/* Reference slides toggle */}
                        <button
                            type="button"
                            onClick={() => setShowReferenceSidebar(!showReferenceSidebar)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-serif-title transition-all rounded-xs ${
                                showReferenceSidebar
                                    ? 'bg-brand-cerulean/10 text-brand-cerulean font-bold border border-brand-cerulean/30'
                                    : 'text-gray-600 hover:text-brand-cerulean hover:bg-white border border-transparent'
                            }`}
                            title="Bật/Tắt tra cứu slide & tài liệu học phần"
                        >
                            <FolderOpen size={14} className="text-brand-jasper" />
                            <span className="hidden sm:inline">Slide ({moduleResources.length})</span>
                        </button>

                        {/* Discard draft icon */}
                        <button
                            type="button"
                            onClick={handleDiscardDraft}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                            title="Xóa nháp và làm mới"
                        >
                            <RotateCcw size={14} />
                        </button>

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={handleSaveLog}
                            className="px-4 py-1.5 bg-brand-cerulean text-white font-serif-title text-xs sm:text-sm font-bold shadow-sm hover:bg-brand-cerulean/90 transition-all flex items-center gap-1.5"
                        >
                            <Save size={14} />
                            <span>{editingLogId ? 'Cập nhật' : 'Lưu bài học'}</span>
                        </button>
                    </div>
                </header>

                {/* MAIN EDITOR FORM + REFERENCE SIDEBAR LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT CANVAS: MAIN LESSON FORM (8 or 12 cols) */}
                    <div className={`space-y-6 ${showReferenceSidebar ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                        {/* 1. SESSION METADATA CARD */}
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-brand-cerulean/20">
                                <h3 className="text-xl font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                                    <CalendarDays size={18} className="text-brand-jasper" />
                                    <span>Thông tin Buổi học & Giảng viên</span>
                                </h3>
                                <span className="text-xs text-gray-500 font-sans italic">Buổi số & Ca học</span>
                            </div>

                            {/* Optional quick link from calendar */}
                            {events.length > 0 && !editingLogId && (
                                <div className="p-3 bg-brand-cream border border-brand-cerulean/30 rounded-xs space-y-1">
                                    <label className="block text-xs font-serif-title font-bold text-brand-cerulean">
                                        Nạp nhanh thông tin từ một buổi trong Thời khóa biểu:
                                    </label>
                                    <EditorialSelect
                                        value={selectedCalendarEventId}
                                        onChange={handleSelectCalendarEvent}
                                        options={eventOptions}
                                        placeholder="Chọn một buổi học từ lịch biểu..."
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <EditorialSelect
                                        label="Học phần *"
                                        value={logForm.moduleId}
                                        onChange={val => {
                                            const mod = modules.find(m => m.id === val);
                                            setLogForm(prev => ({
                                                ...prev,
                                                moduleId: val,
                                                instructor: mod?.instructor || prev.instructor
                                            }));
                                        }}
                                        options={moduleOptions}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">
                                        Buổi học số *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="input-editorial w-full font-bold"
                                        value={logForm.sessionNumber}
                                        onChange={e => setLogForm({ ...logForm, sessionNumber: e.target.value })}
                                        placeholder="VD: 1, 2, 3..."
                                    />
                                </div>
                                <div>
                                    <EditorialDatePicker
                                        label="Ngày học *"
                                        value={logForm.date}
                                        onChange={val => setLogForm({ ...logForm, date: val })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <EditorialSelect
                                        label="Ca học trong ngày"
                                        value={logForm.sessionTime}
                                        onChange={val => setLogForm({ ...logForm, sessionTime: val })}
                                        options={[
                                            { label: 'Ca Sáng (07:30 - 11:30)', value: 'morning' },
                                            { label: 'Ca Chiều (13:30 - 17:00)', value: 'afternoon' },
                                            { label: 'Cả ngày (Cả 2 ca Sáng & Chiều)', value: 'both' },
                                            { label: 'Ca Tối (18:00 - 21:00)', value: 'evening' }
                                        ]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-serif-title text-brand-cerulean mb-1">
                                        Giảng viên đứng lớp buổi này
                                    </label>
                                    <input
                                        type="text"
                                        className="input-editorial w-full"
                                        value={logForm.instructor}
                                        onChange={e => setLogForm({ ...logForm, instructor: e.target.value })}
                                        placeholder="VD: PGS.TS Nguyễn Văn A"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. LESSON TITLE & CORE LECTURE NOTES CANVAS */}
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">
                                    Chủ đề / Tên bài học của buổi này *
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full text-xl sm:text-2xl font-serif-title font-bold text-brand-cerulean"
                                    value={logForm.title}
                                    onChange={e => setLogForm({ ...logForm, title: e.target.value })}
                                    placeholder="VD: Chương 2: Các quy luật nhận thức & tư duy trong dạy học THPT"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                                    <label className="block text-sm font-serif-title text-brand-cerulean font-bold">
                                        Nội dung ghi chép trọng tâm bài giảng *
                                    </label>
                                    <div className="flex items-center gap-2 text-xs font-sans text-gray-500">
                                        <span>Gợi ý: Chia theo các đề mục lớn & ví dụ dẫn chứng</span>
                                    </div>
                                </div>

                                <textarea
                                    required
                                    rows="14"
                                    className="input-editorial w-full resize-y text-base font-body leading-relaxed p-4 bg-brand-cream/30 border border-brand-cerulean/30 rounded-xs shadow-inner"
                                    value={logForm.content}
                                    onChange={e => setLogForm({ ...logForm, content: e.target.value })}
                                    placeholder={`1. ĐẶT VẤN ĐỀ VÀ MỤC TIÊU BÀI HỌC:
- Mục tiêu kiến thức, năng lực và phẩm chất theo chuẩn sư phạm...

2. NỘI DUNG LÝ THUYẾT TRỌNG TÂM:
- Khái niệm bản chất của quá trình nhận thức...
- Các cấp độ tư duy: Biết, Hiểu, Vận dụng, Phân tích, Đánh giá, Sáng tạo...
- Quy luật tâm lý học sinh trong giờ học: Chú ý có chủ định và vô chủ định...

3. TÌNH HUỐNG SƯ PHẠM VÀ PHƯƠNG PHÁP DẠY HỌC:
- Cách thức giáo viên gợi mở khi học sinh chưa hiểu bài...
- Kỹ thuật đặt câu hỏi phân hóa đối tượng học sinh...`}
                                ></textarea>
                            </div>
                        </div>

                        {/* 3. KEY TAKEAWAYS & HOMEWORK TASKS */}
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-6">
                            {/* Key takeaways */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-serif-title text-brand-cerulean font-bold flex items-center gap-1.5">
                                        <Sparkles size={16} className="text-brand-jasper" />
                                        <span>Kiến thức cốt lõi & Từ khóa quan trọng (Key Takeaways)</span>
                                    </label>
                                    <span className="text-xs text-gray-500 font-sans italic">Phân cách bằng dấu phẩy hoặc chấm phẩy</span>
                                </div>
                                <input
                                    type="text"
                                    className="input-editorial w-full text-sm"
                                    value={logForm.keyTakeaways}
                                    onChange={e => setLogForm({ ...logForm, keyTakeaways: e.target.value })}
                                    placeholder="VD: Thang đo Bloom; Vùng phát triển gần ZPD; Tư duy phản biện; Chú ý có chủ định"
                                />

                                {/* Live preview of badges */}
                                {parseKeyTakeaways(logForm.keyTakeaways).length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {parseKeyTakeaways(logForm.keyTakeaways).map((k, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 bg-brand-cream border border-brand-cerulean/30 rounded-xs text-xs font-serif-title text-brand-cerulean font-medium shadow-xs flex items-center gap-1"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-jasper"></span>
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Homework & Action items */}
                            <div className="space-y-2 pt-4 border-t border-brand-cerulean/15">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-serif-title text-brand-cerulean font-bold flex items-center gap-1.5">
                                        <ListChecks size={16} className="text-brand-jasper" />
                                        <span>Dặn dò & Việc cần làm trước buổi sau (Bài tập về nhà)</span>
                                    </label>
                                    <span className="text-xs text-gray-500 font-sans italic">Mỗi dòng là một việc cần làm</span>
                                </div>
                                <textarea
                                    rows="4"
                                    className="input-editorial w-full resize-y text-sm font-sans p-3 bg-brand-cream/30 border border-brand-cerulean/30 rounded-xs"
                                    value={logForm.homework}
                                    onChange={e => setLogForm({ ...logForm, homework: e.target.value })}
                                    placeholder={`- Đọc trước chương 3: Động lực học tập (trang 45 - 60)
- Soạn đề cương bài tập nhóm số 1 (Hạn nộp: Thứ 6 tuần tới)
- Chuẩn bị 2 câu hỏi thảo luận về kế hoạch bài dạy theo Công văn 5555`}
                                ></textarea>

                                {/* Live preview of checklist */}
                                {parseHomeworkItems(logForm.homework).length > 0 && (
                                    <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded space-y-1.5 text-xs text-gray-800">
                                        <span className="font-serif-title font-bold text-amber-900 block">Xem trước danh sách việc cần làm:</span>
                                        {parseHomeworkItems(logForm.homework).map((hw, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Square size={13} className="text-amber-600" />
                                                <span>{hw}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Questions & Attached slides */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-cerulean/15">
                                <div>
                                    <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-semibold flex items-center gap-1">
                                        <HelpCircle size={14} />
                                        <span>Thắc mắc cần hỏi thầy cô buổi kế</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input-editorial w-full text-sm"
                                        value={logForm.questions}
                                        onChange={e => setLogForm({ ...logForm, questions: e.target.value })}
                                        placeholder="VD: Phân biệt rõ hơn giữa tư duy hội tụ và phân kỳ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-semibold flex items-center gap-1">
                                        <ExternalLink size={14} />
                                        <span>Link Slide / Tài liệu buổi học (Nếu có)</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="input-editorial w-full text-sm"
                                        value={logForm.attachments}
                                        onChange={e => setLogForm({ ...logForm, attachments: e.target.value })}
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR: REFERENCE SLIDES & MODULE MATERIALS (GÓC HỌC LIỆU BÀI GIẢNG) */}
                    {showReferenceSidebar && (
                        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                            {/* MODULE RESOURCES PANEL */}
                            <div className="bg-white border-editorial p-5 shadow-editorial space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-brand-cerulean/20">
                                    <div className="flex items-center gap-2">
                                        <FolderOpen size={16} className="text-brand-jasper" />
                                        <h4 className="font-serif-title text-brand-cerulean font-bold text-base">
                                            Slide & Tài liệu môn học
                                        </h4>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-mono font-bold rounded">
                                        {moduleResources.length} link
                                    </span>
                                </div>

                                <p className="text-xs text-gray-600 font-sans">
                                    Mở trực tiếp tài liệu để đối chiếu và ghi chép mà không cần rời khỏi trang:
                                </p>

                                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                    {moduleResources.map(res => (
                                        <div
                                            key={res.id}
                                            className="p-3 bg-brand-cream/50 border border-brand-cerulean/20 rounded-xs space-y-1.5 hover:border-brand-jasper transition-colors"
                                        >
                                            <h5 className="font-serif-title text-xs font-bold text-brand-cerulean line-clamp-2">
                                                {res.title}
                                            </h5>
                                            <a
                                                href={res.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-serif-title font-bold text-brand-jasper hover:underline"
                                            >
                                                <ExternalLink size={12} /> Mở xem slide trong tab mới
                                            </a>
                                        </div>
                                    ))}

                                    {moduleResources.length === 0 && (
                                        <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-xs text-gray-500 font-serif-title">
                                            Chưa có tài liệu nào cho học phần này.
                                        </div>
                                    )}
                                </div>

                                {/* Quick button to switch to tab tài liệu */}
                                <div className="pt-2 border-t border-brand-cerulean/15">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab('resources');
                                            setEditorMode(false);
                                        }}
                                        className="w-full py-1.5 text-center text-xs font-serif-title font-bold text-brand-cerulean hover:text-brand-jasper hover:underline"
                                    >
                                        Quản lý tất cả học liệu &rarr;
                                    </button>
                                </div>
                            </div>

                            {/* PEDAGOGICAL NOTE-TAKING CHEATSHEET */}
                            <div className="bg-brand-cream border border-brand-cerulean/30 p-5 rounded-xs space-y-3 shadow-xs">
                                <h4 className="font-serif-title text-brand-cerulean font-bold text-sm flex items-center gap-1.5">
                                    <Bookmark size={15} className="text-brand-jasper" />
                                    <span>Gợi ý ghi chép chuẩn sư phạm</span>
                                </h4>
                                <ul className="text-xs font-sans text-gray-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                                    <li><strong>Đề mục rõ ràng:</strong> Ghi lại các đề mục lớn theo đúng phân phối chương trình môn học.</li>
                                    <li><strong>Tình huống dạy học:</strong> Chú ý ghi lại các ví dụ sư phạm thực tế mà giảng viên minh họa.</li>
                                    <li><strong>Dặn dò buổi sau:</strong> Ghi cụ thể số trang tài liệu cần đọc trước để buổi sau trao đổi tự tin hơn.</li>
                                </ul>
                            </div>
                        </aside>
                    )}
                </div>

                {/* BOTTOM IN-FLOW ACTION CARD (NO FIXED OVERLAY) */}
                <div className="bg-white border-editorial p-5 shadow-editorial flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                    <div className="text-xs text-gray-600 font-sans">
                        <span>Đang soạn: <strong className="text-brand-cerulean font-serif-title text-sm">{logForm.title || 'Chưa có tiêu đề'}</strong></span>
                        {lastSavedDraftTime && (
                            <span className="text-emerald-700 font-semibold ml-2">&bull; Bản nháp an toàn trong bộ nhớ máy</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={handleExitEditor}
                            className="px-4 py-2 text-xs font-serif-title text-gray-600 hover:text-brand-jasper transition-colors"
                        >
                            Thoát ra danh sách (Đã lưu nháp)
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveLog}
                            className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title text-sm font-bold shadow-editorial hover:bg-brand-cerulean/90 transition-all flex items-center gap-2"
                        >
                            <Save size={15} />
                            <span>{editingLogId ? 'Lưu Thay Đổi Bài Học' : 'Lưu Vào Sổ Bài Học'}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 2: TRANG DANH SÁCH BÀI HỌC VÀ HỌC LIỆU (NOTEBOOK LIST VIEW)
    // =========================================================================
    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12">
            <CollapsiblePageHeader
                title="Học liệu & Nhật ký học tập"
                subtitle="Sổ ghi chép bài học sau từng buổi giảng, lưu trữ tài liệu slide & việc cần làm trước buổi sau."
                actions={
                    <div className="flex w-full sm:w-auto bg-white p-1 border border-brand-cerulean shadow-xs shrink-0">
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-4 py-1.5 sm:py-2 font-serif-title flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all ${
                                activeTab === 'logs' ? 'bg-brand-cerulean text-white font-bold shadow-xs' : 'text-brand-cerulean hover:bg-brand-cream'
                            }`}
                        >
                            <StickyNote size={14} />
                            <span>Sổ ghi chép</span>
                            <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-sans ${
                                activeTab === 'logs' ? 'bg-white/25 text-white' : 'bg-brand-cerulean/10 text-brand-cerulean font-bold'
                            }`}>
                                {studyLogs.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-4 py-1.5 sm:py-2 font-serif-title flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all ${
                                activeTab === 'resources' ? 'bg-brand-cerulean text-white font-bold shadow-xs' : 'text-brand-cerulean hover:bg-brand-cream'
                            }`}
                        >
                            <FolderOpen size={14} />
                            <span>Tài liệu môn</span>
                            <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-sans ${
                                activeTab === 'resources' ? 'bg-white/25 text-white' : 'bg-brand-cerulean/10 text-brand-cerulean font-bold'
                            }`}>
                                {resources.length}
                            </span>
                        </button>
                    </div>
                }
            />

            {/* FEEDBACK BANNER IF JUST SAVED */}
            {saveFeedback && (
                <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded flex items-center gap-2 text-xs sm:text-sm font-serif-title font-bold animate-fade-in-down shadow-xs">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>{saveFeedback}</span>
                </div>
            )}

            {/* TAB 1: SỔ GHI CHÉP BÀI HỌC (SESSION LESSON NOTES) */}
            {activeTab === 'logs' && (
                <div className="space-y-6">
                    {/* PERSISTENT UNSAVED DRAFT ALERT BANNER */}
                    {savedDraft && (
                        <div className="p-3.5 sm:p-4 bg-amber-50 border-2 border-brand-jasper/50 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-editorial animate-fade-in-down">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-brand-jasper/10 text-brand-jasper rounded-full mt-0.5 shrink-0">
                                    <StickyNote size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm sm:text-base">
                                            Bạn đang có một bài ghi chép dở dang chưa lưu vào sổ!
                                        </h4>
                                        <span className="px-1.5 py-0.2 bg-brand-jasper text-white text-[10px] font-bold uppercase rounded">Bản nháp</span>
                                    </div>
                                    <p className="text-xs font-sans text-gray-700 mt-0.5">
                                        Bài: <strong className="text-brand-jasper font-serif-title text-xs sm:text-sm">{savedDraft.formData.title || 'Chưa đặt tiêu đề'}</strong> &bull; {savedDraft.formData.date} &bull; Tự động bảo lưu lúc {new Date(savedDraft.lastSavedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                                <button
                                    type="button"
                                    onClick={handleDiscardDraft}
                                    className="px-3 py-1.5 text-xs font-serif-title text-gray-500 hover:text-brand-jasper hover:underline"
                                >
                                    Xóa nháp
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResumeDraft}
                                    className="px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-cerulean/90 flex items-center gap-1.5"
                                >
                                    <Pencil size={13} /> Tiếp tục ghi chép &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TOOLBAR: MODULE FILTER, SEARCH & FULL-PAGE NEW NOTE BUTTON */}
                    <div className="bg-white border-editorial p-3.5 sm:p-5 shadow-editorial flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
                            {/* Module filter */}
                            <div className="w-full sm:w-64">
                                <EditorialSelect
                                    label="Lọc theo Học phần"
                                    value={selectedModuleFilter}
                                    onChange={setSelectedModuleFilter}
                                    options={filterModuleOptions}
                                />
                            </div>

                            {/* Search input */}
                            <div className="flex-1 relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Tìm theo tên bài, nội dung, từ khóa..."
                                    className="input-editorial w-full pl-9 pr-3 text-xs sm:text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                            {events.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleOpenAddLog(null, events[0])}
                                    title="Nạp nhanh từ buổi học gần nhất trong Lịch biểu"
                                    className="hidden lg:flex items-center gap-1.5 px-3 py-2.5 text-xs font-serif-title font-bold text-brand-cerulean bg-brand-cream border border-brand-cerulean/30 hover:bg-white transition-all shadow-xs"
                                >
                                    <CalendarDays size={14} className="text-brand-jasper" />
                                    <span>Ghi từ Lịch học</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => handleOpenAddLog(selectedModuleFilter !== 'all' ? selectedModuleFilter : null)}
                                className="w-full sm:w-auto px-5 py-2.5 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-cerulean/90 transition-colors text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Soạn Bài Học Mới
                            </button>
                        </div>
                    </div>

                    {/* STATS STRIP */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                        <div className="bg-white border-editorial p-3 sm:p-4 shadow-editorial flex items-center gap-2.5 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-cerulean/10 text-brand-cerulean flex items-center justify-center shrink-0">
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <span className="text-[10px] sm:text-xs uppercase text-gray-500 font-bold block">Tổng số buổi</span>
                                <h4 className="text-lg sm:text-2xl font-serif-title font-bold text-brand-cerulean">{studyLogs.length} buổi</h4>
                            </div>
                        </div>

                        <div className="bg-white border-editorial p-4 shadow-editorial flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-cream text-brand-jasper flex items-center justify-center shrink-0 border border-brand-jasper/30">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <span className="text-xs uppercase text-gray-500 font-bold block">Học phần đang học</span>
                                <h4 className="text-2xl font-serif-title font-bold text-brand-jasper">{modules.length} môn</h4>
                            </div>
                        </div>

                        <div className="bg-white border-editorial p-4 shadow-editorial flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-cerulean/10 text-brand-cerulean flex items-center justify-center shrink-0">
                                <ListChecks size={20} />
                            </div>
                            <div>
                                <span className="text-xs uppercase text-gray-500 font-bold block">Đang xem theo lọc</span>
                                <h4 className="text-2xl font-serif-title font-bold text-brand-cerulean">{filteredLogs.length} bài ghi</h4>
                            </div>
                        </div>

                        <div className="bg-white border-editorial p-4 shadow-editorial flex items-center justify-between">
                            <div>
                                <span className="text-xs uppercase text-gray-500 font-bold block">Thời khóa biểu</span>
                                <span className="text-xs font-serif-title text-brand-cerulean mt-0.5 block">Đồng bộ lịch ca học</span>
                            </div>
                            {navigate && (
                                <button
                                    type="button"
                                    onClick={() => navigate('calendar')}
                                    className="p-2 text-brand-jasper hover:bg-brand-cream border border-brand-jasper/30 rounded transition-colors"
                                    title="Chuyển đến Lịch biểu"
                                >
                                    <Calendar size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* STUDY LOGS CARDS LIST */}
                    <div className="space-y-6">
                        {filteredLogs.map(log => {
                            const mod = modules.find(m => m.id === log.moduleId);
                            const sessionMeta = getSessionMeta(log.sessionTime);
                            const SIcon = sessionMeta.icon;
                            const homeworkItems = parseHomeworkItems(log.homework);
                            const keyItems = parseKeyTakeaways(log.keyTakeaways);
                            const completedTasks = Array.isArray(log.completedTasks) ? log.completedTasks : [];

                            return (
                                <article
                                    key={log.id}
                                    className="bg-white border-editorial shadow-editorial transition-all hover:shadow-lg relative overflow-hidden"
                                >
                                    {/* TOP COLOR ACCENT BAR */}
                                    <div className="h-1.5 bg-gradient-to-r from-brand-cerulean via-brand-cerulean/80 to-brand-jasper w-full"></div>

                                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                        {/* HEADER METADATA: SESSION BADGE, MODULE, DATE, CA HỌC, GIẢNG VIÊN */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-cerulean/15">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-3 py-1 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-xs tracking-wider uppercase">
                                                    Buổi {log.sessionNumber || '01'}
                                                </span>

                                                <span className="px-2.5 py-0.5 bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 text-xs font-bold font-serif-title">
                                                    {mod?.code || 'HP'}: {mod?.name || 'Học phần sư phạm'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs font-serif-title flex-wrap">
                                                <span className="flex items-center gap-1.5 text-gray-600 font-sans font-semibold">
                                                    <Calendar size={14} className="text-brand-cerulean" />
                                                    <span>{log.date}</span>
                                                </span>

                                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${sessionMeta.badge}`}>
                                                    <SIcon size={12} className={sessionMeta.color} />
                                                    <span>{sessionMeta.label}</span>
                                                </span>

                                                {(log.instructor || mod?.instructor) && (
                                                    <span className="flex items-center gap-1 text-brand-cerulean font-serif-title font-bold bg-brand-cerulean/5 px-2 py-0.5 border border-brand-cerulean/20">
                                                        <GraduationCap size={13} className="text-brand-cerulean" />
                                                        <span>GV: {log.instructor || mod?.instructor}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* LESSON TITLE */}
                                        <div>
                                            <h3
                                                onClick={() => setViewingLog(log)}
                                                className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean font-bold hover:text-brand-jasper transition-colors cursor-pointer leading-tight flex items-start justify-between gap-4 group"
                                            >
                                                <span>{log.title}</span>
                                                <span className="text-xs font-sans text-gray-400 font-normal group-hover:text-brand-jasper flex items-center gap-1 shrink-0 pt-1">
                                                    <Eye size={14} /> Xem bài học
                                                </span>
                                            </h3>
                                        </div>

                                        {/* CORE LECTURE CONTENT (TRỌNG TÂM BÀI GIẢNG) */}
                                        <div className="bg-brand-cream/40 p-4 border-l-4 border-brand-cerulean text-gray-800 font-body text-lg leading-relaxed whitespace-pre-line space-y-2">
                                            {log.content}
                                        </div>

                                        {/* KEY TAKEAWAYS / KEYWORDS BADGES */}
                                        {keyItems.length > 0 && (
                                            <div className="space-y-1.5 pt-1">
                                                <div className="flex items-center gap-1.5 text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                                    <Sparkles size={14} className="text-brand-jasper" />
                                                    <span>Kiến thức cốt lõi & Từ khóa bài học:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {keyItems.map((item, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2.5 py-1 bg-white border border-brand-cerulean/30 rounded-xs text-xs font-serif-title text-brand-cerulean font-medium shadow-xs flex items-center gap-1"
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-jasper"></span>
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* HOMEWORK & ACTION ITEMS (INTERACTIVE CHECKLIST) */}
                                        {homeworkItems.length > 0 && (
                                            <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-sm space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-serif-title font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                                                        <ListChecks size={15} className="text-brand-jasper" />
                                                        <span>Dặn dò & Việc cần làm trước buổi sau ({completedTasks.length}/{homeworkItems.length} hoàn thành)</span>
                                                    </span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {homeworkItems.map((hw, idx) => {
                                                        const isDone = completedTasks.includes(idx);
                                                        return (
                                                            <div
                                                                key={idx}
                                                                onClick={() => handleToggleHomeworkTask(log, idx)}
                                                                className="flex items-start gap-2.5 text-sm cursor-pointer select-none group/item py-0.5"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="mt-0.5 text-gray-500 hover:text-brand-jasper transition-colors"
                                                                >
                                                                    {isDone ? (
                                                                        <CheckSquare size={16} className="text-brand-cerulean" />
                                                                    ) : (
                                                                        <Square size={16} className="text-gray-400 group-hover/item:text-brand-jasper" />
                                                                    )}
                                                                </button>
                                                                <span className={`font-sans leading-snug ${
                                                                    isDone ? 'line-through text-gray-400 italic' : 'text-gray-800'
                                                                }`}>
                                                                    {hw}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* QUESTIONS & CLARIFICATIONS */}
                                        {log.questions && (
                                            <div className="p-3 bg-blue-50/60 border-l-2 border-brand-cerulean text-xs text-brand-cerulean flex items-start gap-2">
                                                <HelpCircle size={15} className="text-brand-cerulean shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <span className="font-serif-title font-bold block">Thắc mắc cần hỏi thầy cô trong buổi kế:</span>
                                                    <span className="font-sans text-gray-700 italic">{log.questions}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* ATTACHMENTS / SLIDE LINK */}
                                        {log.attachments && (
                                            <div className="pt-2 flex items-center gap-2">
                                                <span className="text-xs text-gray-500 font-serif-title font-semibold">Tài liệu buổi học:</span>
                                                <a
                                                    href={log.attachments}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-serif-title font-bold text-brand-jasper hover:underline bg-brand-cream px-2.5 py-1 border border-brand-jasper/30"
                                                >
                                                    <ExternalLink size={13} /> Mở Slide / Tài liệu liên kết
                                                </a>
                                            </div>
                                        )}

                                        {/* FOOTER ACTIONS */}
                                        <div className="pt-4 border-t border-brand-cerulean/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="text-xs font-sans text-gray-400">
                                                {log.eventId ? (
                                                    <span className="flex items-center gap-1 text-brand-cerulean/80">
                                                        <CheckCircle2 size={12} className="text-emerald-600" /> Đã đồng bộ với Lịch biểu
                                                    </span>
                                                ) : (
                                                    <span>Ghi chép độc lập</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewingLog(log)}
                                                    className="px-3 py-1.5 text-xs font-serif-title font-bold text-brand-cerulean border border-brand-cerulean/30 hover:bg-brand-cerulean hover:text-white transition-all flex items-center gap-1"
                                                >
                                                    <BookOpen size={13} /> Đọc Ôn Tập
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditLog(log)}
                                                    className="px-3 py-1.5 text-xs font-serif-title font-bold text-brand-cerulean bg-brand-cream border border-brand-cerulean/30 hover:bg-brand-cerulean hover:text-white transition-all flex items-center gap-1"
                                                >
                                                    <Pencil size={13} /> Sửa
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm(`Bạn có chắc chắn muốn xóa bài ghi chép: "${log.title}"?`)) {
                                                            onDeleteStudyLog(log.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Xóa bài ghi chép"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}

                        {filteredLogs.length === 0 && (
                            <div className="bg-white border-2 border-dashed border-brand-cerulean/30 p-12 text-center space-y-4 shadow-editorial">
                                <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream border border-brand-cerulean/30 flex items-center justify-center text-brand-cerulean">
                                    <BookMarked size={32} />
                                </div>
                                <div className="space-y-1 max-w-md mx-auto">
                                    <h4 className="text-xl font-serif-title font-bold text-brand-cerulean">
                                        Chưa có bài ghi chép nào {selectedModuleFilter !== 'all' ? 'cho học phần này' : ''}
                                    </h4>
                                    <p className="text-sm font-sans text-gray-600">
                                        Hãy ghi chép lại nội dung bài giảng, từ khóa quan trọng và bài tập dặn dò sau mỗi buổi học để dễ dàng ôn tập thi cử sau này.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleOpenAddLog(selectedModuleFilter !== 'all' ? selectedModuleFilter : null)}
                                    className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title text-sm font-bold shadow-editorial hover:bg-brand-cerulean/90 transition-all inline-flex items-center gap-2"
                                >
                                    <Plus size={16} /> Bắt đầu ghi chép bài học
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: TÀI LIỆU HỌC PHẦN (RESOURCES) */}
            {activeTab === 'resources' && (
                <div className="space-y-6">
                    <form onSubmit={handleCreateResource} className="bg-white border-editorial p-4 sm:p-6 shadow-editorial space-y-4">
                        <h3 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold">Thêm Học liệu / Tài liệu mới</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <EditorialSelect
                                    label="Học phần"
                                    value={resForm.moduleId}
                                    onChange={val => setResForm({ ...resForm, moduleId: val })}
                                    options={moduleOptions}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên tài liệu / Slide bài giảng</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full"
                                    value={resForm.title}
                                    onChange={e => setResForm({ ...resForm, title: e.target.value })}
                                    placeholder="VD: Slide Chương 1 - Nhập môn Tâm lý học Sư phạm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">URL Liên kết (Google Drive / DropBox / PDF)</label>
                                <input
                                    required
                                    type="url"
                                    className="input-editorial w-full"
                                    value={resForm.url}
                                    onChange={e => setResForm({ ...resForm, url: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <div>
                                <button type="submit" className="w-full py-2 bg-brand-cerulean text-white font-serif-title font-bold shadow-editorial hover:bg-brand-cerulean/90 transition-colors">
                                    + Lưu Học liệu
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {resources.map(res => {
                            const mod = modules.find(m => m.id === res.moduleId);
                            return (
                                <div key={res.id} className="bg-white border-editorial p-5 shadow-editorial flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 font-mono">{mod?.code} - {mod?.name}</span>
                                        <h4 className="text-xl font-serif-title text-brand-cerulean font-bold">{res.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cream border border-brand-jasper/30 text-brand-jasper hover:underline font-serif-title text-xs font-bold shadow-xs"
                                        >
                                            <ExternalLink size={14} /> Mở tài liệu
                                        </a>
                                        <button
                                            onClick={() => onDeleteResource(res.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                            title="Xóa tài liệu"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {resources.length === 0 && (
                            <div className="bg-white border-2 border-dashed border-brand-cerulean/30 p-8 text-center text-gray-500 font-serif-title">
                                Chưa có học liệu nào được lưu trữ.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CHẾ ĐỘ ĐỌC ÔN TẬP BÀI HỌC (FOCUS READING MODE / PRINT FRIENDLY) */}
            <Modal
                isOpen={!!viewingLog}
                onClose={() => setViewingLog(null)}
                title="Sổ Ghi Chép Bài Học • Đọc Ôn Tập"
            >
                {viewingLog && (() => {
                    const mod = modules.find(m => m.id === viewingLog.moduleId);
                    const sessionMeta = getSessionMeta(viewingLog.sessionTime);
                    const SIcon = sessionMeta.icon;
                    const homeworkItems = parseHomeworkItems(viewingLog.homework);
                    const keyItems = parseKeyTakeaways(viewingLog.keyTakeaways);
                    const completedTasks = Array.isArray(viewingLog.completedTasks) ? viewingLog.completedTasks : [];

                    return (
                        <div className="space-y-6 pt-2 font-serif">
                            {/* PRINT / ACTION BAR */}
                            <div className="flex justify-between items-center pb-3 border-b border-brand-cerulean/20">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-brand-cerulean text-white font-bold text-xs">
                                        BUỔI {viewingLog.sessionNumber || '01'}
                                    </span>
                                    <span className="font-serif-title text-sm text-brand-cerulean font-bold">
                                        {mod?.code} - {mod?.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const target = viewingLog;
                                            setViewingLog(null);
                                            handleOpenEditLog(target);
                                        }}
                                        className="px-3 py-1 text-xs font-serif-title font-bold text-brand-cerulean border border-brand-cerulean/40 hover:bg-brand-cream rounded flex items-center gap-1.5"
                                    >
                                        <Pencil size={13} /> Sửa bài học này
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="px-3 py-1 text-xs font-serif-title font-bold text-brand-jasper border border-brand-jasper/40 hover:bg-brand-cream rounded flex items-center gap-1.5"
                                    >
                                        <Printer size={14} /> In phiếu
                                    </button>
                                </div>
                            </div>

                            {/* TITLE & METADATA */}
                            <div className="space-y-2">
                                <h2 className="text-3xl font-serif-title font-bold text-brand-cerulean leading-snug">
                                    {viewingLog.title}
                                </h2>
                                <div className="flex flex-wrap gap-4 text-xs font-sans text-gray-600">
                                    <span><strong>Ngày học:</strong> {viewingLog.date}</span>
                                    <span>&bull;</span>
                                    <span className="flex items-center gap-1">
                                        <SIcon size={13} className={sessionMeta.color} />
                                        <strong>Ca học:</strong> {sessionMeta.label}
                                    </span>
                                    {(viewingLog.instructor || mod?.instructor) && (
                                        <>
                                            <span>&bull;</span>
                                            <span><strong>Giảng viên:</strong> {viewingLog.instructor || mod?.instructor}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* CORE CONTENT */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-serif-title font-bold text-brand-cerulean uppercase tracking-wider pb-1 border-b border-brand-cerulean/20">
                                    1. Trọng tâm bài giảng
                                </h4>
                                <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/20 text-gray-800 text-lg font-body leading-relaxed whitespace-pre-line">
                                    {viewingLog.content}
                                </div>
                            </div>

                            {/* KEY TAKEAWAYS */}
                            {keyItems.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-serif-title font-bold text-brand-cerulean uppercase tracking-wider pb-1 border-b border-brand-cerulean/20 flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-brand-jasper" />
                                        2. Kiến thức cốt lõi & Từ khóa
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {keyItems.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-white border border-brand-cerulean/30 rounded-xs text-xs font-serif-title font-bold text-brand-cerulean shadow-xs"
                                            >
                                                # {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* HOMEWORK & ACTION ITEMS */}
                            {homeworkItems.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-serif-title font-bold text-amber-900 uppercase tracking-wider pb-1 border-b border-amber-300 flex items-center gap-1.5">
                                        <ListChecks size={14} className="text-brand-jasper" />
                                        3. Dặn dò & Việc cần làm trước buổi sau
                                    </h4>
                                    <div className="space-y-2 p-4 bg-amber-50/60 border border-amber-200">
                                        {homeworkItems.map((hw, idx) => {
                                            const isDone = completedTasks.includes(idx);
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleToggleHomeworkTask(viewingLog, idx)}
                                                    className="flex items-start gap-2 text-sm cursor-pointer select-none"
                                                >
                                                    <span className="mt-0.5">
                                                        {isDone ? (
                                                            <CheckSquare size={16} className="text-brand-cerulean" />
                                                        ) : (
                                                            <Square size={16} className="text-gray-400" />
                                                        )}
                                                    </span>
                                                    <span className={isDone ? 'line-through text-gray-400 italic font-sans' : 'text-gray-800 font-sans'}>
                                                        {hw}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* QUESTIONS */}
                            {viewingLog.questions && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-serif-title font-bold text-brand-cerulean uppercase tracking-wider pb-1 border-b border-brand-cerulean/20 flex items-center gap-1.5">
                                        <HelpCircle size={14} className="text-brand-cerulean" />
                                        4. Câu hỏi & Thắc mắc cần trao đổi
                                    </h4>
                                    <div className="p-3 bg-blue-50/60 border border-blue-200 text-sm font-sans text-gray-800 italic">
                                        {viewingLog.questions}
                                    </div>
                                </div>
                            )}

                            {/* ATTACHMENTS */}
                            {viewingLog.attachments && (
                                <div className="pt-2">
                                    <a
                                        href={viewingLog.attachments}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial"
                                    >
                                        <ExternalLink size={14} /> Mở Slide / Tài liệu trực tuyến
                                    </a>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end border-t border-brand-cerulean/20">
                                <button
                                    type="button"
                                    onClick={() => setViewingLog(null)}
                                    className="px-5 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-sm"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};
