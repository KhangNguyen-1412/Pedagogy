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
    AlertCircle,
    Lightbulb,
    Columns,
    AlignLeft
} from 'lucide-react';
import { EditorialSelect, EditorialDatePicker, Modal } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';
import { WordRichTextEditor } from '../../components/common/WordRichTextEditor';
import { getProgramStatus, isModuleInProgram } from '../../utils/ruleValidators';

const DRAFT_STORAGE_KEY = 'pedagogy_study_log_draft';
const PREFILL_EVENT_KEY = 'pedagogy_prefill_event';
const EDITOR_ACTIVE_KEY = 'pedagogy_study_log_editor_active';

export const ResourcesStudyLogView = ({
    programs = [],
    modules = [],
    studyLogs = [],
    resources = [],
    events = [],
    onAddStudyLog,
    onUpdateStudyLog,
    onDeleteStudyLog,
    onAddResource,
    onUpdateResource,
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

    // 1. Chỉ lấy những chương trình đào tạo ở trạng thái "Đang học" (dang_hoc)
    const activePrograms = useMemo(() => {
        return (programs || []).filter(p => getProgramStatus(p) === 'dang_hoc');
    }, [programs]);

    // 2. Bộ lọc CTĐT đang học cho Tab 1 (Nhật ký học tập)
    const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');

    // 3. Danh sách học phần khả dụng theo bộ lọc CTĐT đang học
    const availableModules = useMemo(() => {
        if (activePrograms.length === 0) return [];
        let targetProgramIds = activePrograms.map(p => p.id);
        if (selectedProgramFilter !== 'all') {
            targetProgramIds = targetProgramIds.filter(id => id === selectedProgramFilter);
        }
        return (modules || []).filter(m => targetProgramIds.some(pId => isModuleInProgram(m, pId)));
    }, [modules, activePrograms, selectedProgramFilter]);

    // Tất cả các module thuộc bất kỳ CTĐT đang học nào (để hiển thị & tra cứu tên môn)
    const allActiveModules = useMemo(() => {
        if (activePrograms.length === 0) return [];
        const allIds = activePrograms.map(p => p.id);
        return (modules || []).filter(m => allIds.some(pId => isModuleInProgram(m, pId)));
    }, [modules, activePrograms]);

    // Resource Form State (for Tab 2: Tài liệu học phần)
    const [resForm, setResForm] = useState(() => {
        const initProg = (programs || []).find(p => getProgramStatus(p) === 'dang_hoc');
        const initProgId = initProg ? initProg.id : '';
        const initMods = (modules || []).filter(m => isModuleInProgram(m, initProgId));
        return {
            programId: initProgId,
            moduleId: initMods[0]?.id || '',
            title: '',
            type: 'Drive / PDF',
            url: ''
        };
    });

    const [editingResourceId, setEditingResourceId] = useState(null);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);

    // Modules for Resource Form (dynamically filtered by resForm.programId)
    const formModulesForResource = useMemo(() => {
        if (!resForm.programId) {
            return availableModules.length > 0 ? availableModules : allActiveModules;
        }
        return (modules || []).filter(m => isModuleInProgram(m, resForm.programId));
    }, [modules, resForm.programId, availableModules, allActiveModules]);

    // Tự động đồng bộ resForm khi danh sách CTĐT đang học hoặc modules thay đổi
    useEffect(() => {
        setResForm(prev => {
            const nextProgId = (prev.programId && activePrograms.some(p => p.id === prev.programId))
                ? prev.programId
                : (activePrograms[0]?.id || '');

            const candidateMods = (modules || []).filter(m => isModuleInProgram(m, nextProgId));
            const nextModId = (prev.moduleId && candidateMods.some(m => m.id === prev.moduleId))
                ? prev.moduleId
                : (candidateMods[0]?.id || '');

            if (nextProgId !== prev.programId || nextModId !== prev.moduleId) {
                return { ...prev, programId: nextProgId, moduleId: nextModId };
            }
            return prev;
        });
    }, [activePrograms, modules]);

    // Study Log Filter & Search State
    const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Tab 2 (Resources) Filter & Search State
    const [resourceProgramFilter, setResourceProgramFilter] = useState('all');
    const [resourceModuleFilter, setResourceModuleFilter] = useState('all');
    const [resourceSearchQuery, setResourceSearchQuery] = useState('');

    // Reading Focus Modal State
    const [viewingLog, setViewingLog] = useState(null);

    // Initial empty log form (Cornell structure)
    const initialLogForm = {
        programId: activePrograms[0]?.id || '',
        moduleId: availableModules[0]?.id || allActiveModules[0]?.id || '',
        eventId: '',
        sessionNumber: '1',
        date: new Date().toISOString().split('T')[0],
        sessionTime: 'morning',
        instructor: '',
        title: '',
        cues: '',        // Cột Gợi ý / Cues (Từ khóa, câu hỏi ôn tập, ý chính gợi nhớ)
        content: '',     // Cột Ghi chép chi tiết / Notes
        summary: '',     // Khung Tóm tắt / Summary
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
                                         (logForm.cues && logForm.cues.trim()) ||
                                         (logForm.summary && logForm.summary.trim()) ||
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

    // Options cho bộ lọc và form
    const moduleOptions = useMemo(() => {
        return availableModules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));
    }, [availableModules]);

    const filterModuleOptions = useMemo(() => {
        return [
            { label: `Tất cả học phần (${availableModules.length})`, value: 'all' },
            ...moduleOptions
        ];
    }, [availableModules, moduleOptions]);

    const programOptions = useMemo(() => {
        return [
            { label: `Tất cả CTĐT đang học (${activePrograms.length})`, value: 'all' },
            ...activePrograms.map(p => ({ label: p.name, value: p.id }))
        ];
    }, [activePrograms]);

    // Modules for editor form
    const editorModules = useMemo(() => {
        if (!logForm.programId) return availableModules.length > 0 ? availableModules : allActiveModules;
        return (modules || []).filter(m => isModuleInProgram(m, logForm.programId));
    }, [modules, logForm.programId, availableModules, allActiveModules]);

    const editorModuleOptions = useMemo(() => {
        return editorModules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));
    }, [editorModules]);

    // Module options for Resource Form
    const resourceFormModuleOptions = useMemo(() => {
        return formModulesForResource.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));
    }, [formModulesForResource]);

    // Build event options for quick linking
    const eventOptions = useMemo(() => {
        const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
        return [
            { label: '-- Nhập tự do (Không liên kết lịch) --', value: '' },
            ...sorted.map(evt => {
                const mod = (modules || []).find(m => m.id === evt.moduleId);
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
        return (modules || []).find(m => m.id === logForm.moduleId);
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

        const mod = (modules || []).find(m => m.id === evt.moduleId);
        const prog = activePrograms.find(p => isModuleInProgram(mod, p.id)) || activePrograms[0];
        const matchBuoi = evt.title ? evt.title.match(/buổi\s*(\d+)/i) : null;
        const inferredSession = matchBuoi ? matchBuoi[1] : '';

        setLogForm(prev => ({
            ...prev,
            programId: prog?.id || prev.programId,
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

        const targetModId = prefillModuleId || prefillEvent?.moduleId || availableModules[0]?.id || allActiveModules[0]?.id || '';
        const targetMod = (modules || []).find(m => m.id === targetModId);
        const matchingProg = activePrograms.find(p => isModuleInProgram(targetMod, p.id)) || activePrograms[0];

        const existingLogsCount = studyLogs.filter(l => l.moduleId === targetModId).length;
        const nextSessionNum = String(existingLogsCount + 1);

        setLogForm({
            programId: matchingProg?.id || activePrograms[0]?.id || '',
            moduleId: targetModId,
            eventId: prefillEvent ? prefillEvent.id : '',
            sessionNumber: nextSessionNum,
            date: prefillEvent ? prefillEvent.date : new Date().toISOString().split('T')[0],
            sessionTime: prefillEvent ? (prefillEvent.session || 'morning') : 'morning',
            instructor: targetMod?.instructor || '',
            title: prefillEvent ? prefillEvent.title : '',
            cues: '',
            content: '',
            summary: '',
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
        const mod = (modules || []).find(m => m.id === log.moduleId);
        const prog = activePrograms.find(p => isModuleInProgram(mod, p.id)) || activePrograms[0];

        setLogForm({
            programId: log.programId || prog?.id || activePrograms[0]?.id || '',
            moduleId: log.moduleId || availableModules[0]?.id || allActiveModules[0]?.id || '',
            eventId: log.eventId || '',
            sessionNumber: log.sessionNumber || '1',
            date: log.date || new Date().toISOString().split('T')[0],
            sessionTime: log.sessionTime || 'morning',
            instructor: log.instructor || mod?.instructor || '',
            title: log.title || '',
            cues: log.cues || (log.keyTakeaways ? log.keyTakeaways : '') || '',
            content: log.content || '',
            summary: log.summary || '',
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
        if (e && e.preventDefault) e.preventDefault();
        if (!logForm.moduleId) {
            alert('Vui lòng chọn Học phần bài học.');
            return;
        }
        if (!logForm.title.trim()) {
            alert('Vui lòng nhập chủ đề hoặc tên bài học.');
            return;
        }

        // Tự động đồng bộ keyTakeaways nếu cues có dữ liệu
        const computedKeyTakeaways = logForm.keyTakeaways || logForm.cues;

        const payload = {
            ...logForm,
            keyTakeaways: computedKeyTakeaways,
            title: logForm.title.trim(),
            content: logForm.content.trim(),
            cues: (logForm.cues || '').trim(),
            summary: (logForm.summary || '').trim(),
            updatedAt: new Date().toISOString()
        };

        if (editingLogId) {
            if (onUpdateStudyLog) {
                onUpdateStudyLog({
                    id: editingLogId,
                    ...payload
                });
            }
        } else {
            onAddStudyLog({
                id: 'log_' + Date.now(),
                createdAt: new Date().toISOString(),
                ...payload
            });
        }

        // Clear saved draft from localStorage on successful save
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setSavedDraft(null);
        setEditingLogId(null);
        setEditorMode(false);

        // Flash feedback
        setSaveFeedback('Đã lưu bài học theo chuẩn Cornell vào Sổ ghi chép thành công!');
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

    // Open Modal for adding new Resource
    const handleOpenAddResource = () => {
        setEditingResourceId(null);
        const progId = (resourceProgramFilter !== 'all' && activePrograms.some(p => p.id === resourceProgramFilter))
            ? resourceProgramFilter
            : (activePrograms[0]?.id || '');
        const candidateMods = (modules || []).filter(m => isModuleInProgram(m, progId));
        const modId = (resourceModuleFilter !== 'all' && candidateMods.some(m => m.id === resourceModuleFilter))
            ? resourceModuleFilter
            : (candidateMods[0]?.id || '');

        setResForm({
            programId: progId,
            moduleId: modId,
            title: '',
            type: 'Drive / PDF',
            url: ''
        });
        setIsResourceModalOpen(true);
    };

    // Open Modal for editing existing Resource
    const handleStartEditResource = (res) => {
        const mod = (modules || []).find(m => m.id === res.moduleId);
        const prog = activePrograms.find(p => isModuleInProgram(mod, p.id)) || activePrograms[0];
        setEditingResourceId(res.id);
        setResForm({
            programId: res.programId || prog?.id || activePrograms[0]?.id || '',
            moduleId: res.moduleId,
            title: res.title,
            type: res.type || 'Drive / PDF',
            url: res.url
        });
        setIsResourceModalOpen(true);
    };

    // Close Resource Modal
    const handleCloseResourceModal = () => {
        setIsResourceModalOpen(false);
        setEditingResourceId(null);
    };

    // Create or Update Resource handler
    const handleSaveResource = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!resForm.moduleId) {
            alert('Vui lòng chọn Học phần cho tài liệu.');
            return;
        }
        if (!resForm.title.trim()) {
            alert('Vui lòng nhập tên tài liệu hoặc slide.');
            return;
        }
        if (!resForm.url.trim()) {
            alert('Vui lòng nhập đường dẫn URL liên kết tài liệu.');
            return;
        }

        if (editingResourceId) {
            if (onUpdateResource) {
                onUpdateResource({
                    id: editingResourceId,
                    ...resForm,
                    title: resForm.title.trim(),
                    url: resForm.url.trim(),
                    updatedAt: new Date().toISOString()
                });
            }
            setSaveFeedback('Đã cập nhật học liệu thành công!');
        } else {
            onAddResource({
                id: 'res_' + Date.now(),
                createdAt: new Date().toISOString(),
                ...resForm,
                title: resForm.title.trim(),
                url: resForm.url.trim()
            });
            setSaveFeedback('Đã thêm học liệu mới thành công!');
        }

        setIsResourceModalOpen(false);
        setEditingResourceId(null);
        setTimeout(() => setSaveFeedback(null), 3500);
    };

    // Delete Resource confirmation handler
    const handleConfirmDeleteResource = () => {
        if (!resourceToDelete) return;
        const targetTitle = resourceToDelete.title;
        onDeleteResource(resourceToDelete.id);
        setResourceToDelete(null);
        setSaveFeedback(`Đã xóa tài liệu "${targetTitle}" thành công.`);
        setTimeout(() => setSaveFeedback(null), 3000);
    };

    // Filter study logs by program, module and search query
    const filteredLogs = useMemo(() => {
        return studyLogs.filter(log => {
            const logMod = (modules || []).find(m => m.id === log.moduleId);

            // Lọc theo CTĐT đang học
            if (selectedProgramFilter !== 'all') {
                if (!logMod || !isModuleInProgram(logMod, selectedProgramFilter)) {
                    return false;
                }
            } else if (activePrograms.length > 0) {
                const activeIds = activePrograms.map(p => p.id);
                if (!logMod || !activeIds.some(pId => isModuleInProgram(logMod, pId))) {
                    return false;
                }
            }

            if (selectedModuleFilter !== 'all' && log.moduleId !== selectedModuleFilter) {
                return false;
            }

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const titleMatch = (log.title || '').toLowerCase().includes(q);
                const contentMatch = (log.content || '').toLowerCase().includes(q);
                const cuesMatch = (log.cues || '').toLowerCase().includes(q);
                const summaryMatch = (log.summary || '').toLowerCase().includes(q);
                const keyMatch = (log.keyTakeaways || '').toLowerCase().includes(q);
                const instrMatch = (log.instructor || '').toLowerCase().includes(q);
                const hwMatch = (log.homework || '').toLowerCase().includes(q);
                const modMatch = logMod ? `${logMod.code} ${logMod.name}`.toLowerCase().includes(q) : false;
                if (!titleMatch && !contentMatch && !cuesMatch && !summaryMatch && !keyMatch && !instrMatch && !hwMatch && !modMatch) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => {
            const dateComp = new Date(b.date || 0) - new Date(a.date || 0);
            if (dateComp !== 0) return dateComp;
            return (Number(b.sessionNumber) || 0) - (Number(a.sessionNumber) || 0);
        });
    }, [studyLogs, modules, activePrograms, selectedProgramFilter, selectedModuleFilter, searchQuery]);

    // Filter resources in Tab 2
    const tab2FilteredModules = useMemo(() => {
        if (resourceProgramFilter !== 'all') {
            return (modules || []).filter(m => isModuleInProgram(m, resourceProgramFilter));
        }
        return availableModules.length > 0 ? availableModules : allActiveModules;
    }, [modules, resourceProgramFilter, availableModules, allActiveModules]);

    const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const resMod = (modules || []).find(m => m.id === res.moduleId);

            // Filter by program
            if (resourceProgramFilter !== 'all') {
                if (!resMod || !isModuleInProgram(resMod, resourceProgramFilter)) return false;
            } else if (activePrograms.length > 0) {
                const activeIds = activePrograms.map(p => p.id);
                if (!resMod || !activeIds.some(pId => isModuleInProgram(resMod, pId))) return false;
            }

            // Filter by module
            if (resourceModuleFilter !== 'all' && res.moduleId !== resourceModuleFilter) {
                return false;
            }

            // Filter by search query
            if (resourceSearchQuery.trim()) {
                const q = resourceSearchQuery.toLowerCase();
                const titleMatch = (res.title || '').toLowerCase().includes(q);
                const urlMatch = (res.url || '').toLowerCase().includes(q);
                const modMatch = resMod ? `${resMod.code} ${resMod.name}`.toLowerCase().includes(q) : false;
                if (!titleMatch && !urlMatch && !modMatch) return false;
            }
            return true;
        });
    }, [resources, modules, activePrograms, resourceProgramFilter, resourceModuleFilter, resourceSearchQuery]);

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

    // Helper for shift icon & label
    const getSessionMeta = (sessionTime) => {
        switch (sessionTime) {
            case 'afternoon':
                return { label: 'Ca Chiều (13:30 - 17:00)', icon: Sunset, color: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' };
            case 'evening':
                return { label: 'Ca Tối (18:00 - 21:00)', icon: Moon, color: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-800' };
            case 'both':
                return { label: 'Cả ngày (Sáng & Chiều)', icon: Layers, color: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' };
            case 'morning':
            default:
                return { label: 'Ca Sáng (07:30 - 11:30)', icon: Sun, color: 'text-sky-600', badge: 'bg-sky-100 text-sky-800' };
        }
    };

    // =========================================================================
    // VIEW 1: TRÌNH SOẠN THẢO BÀI HỌC THEO PHƯƠNG PHÁP CORNELL (FULL-PAGE CANVAS)
    // =========================================================================
    if (editorMode) {
        return (
            <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-page-enter">
                {/* STICKY EDITORIAL TOPBAR */}
                <header className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur border-b border-brand-cerulean/20 px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleExitEditor}
                            className="p-1.5 text-brand-cerulean hover:bg-white border border-brand-cerulean/30 rounded-xs transition-colors flex items-center gap-1 text-xs font-serif-title font-bold"
                            title="Quay lại danh sách bài học"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Quay lại danh sách</span>
                        </button>
                        <div className="h-5 w-[1px] bg-brand-cerulean/20"></div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-jasper block">
                                {editingLogId ? 'Chỉnh sửa ghi chép Cornell' : 'Tạo mới ghi chép theo Cornell'}
                            </span>
                            <h2 className="text-sm sm:text-base font-serif-title font-bold text-brand-cerulean truncate max-w-[200px] sm:max-w-md">
                                {logForm.title || 'Chưa đặt tiêu đề bài học'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Auto-save status indicator */}
                        {lastSavedDraftTime && (
                            <span className="hidden md:flex items-center gap-1 text-[11px] font-sans text-gray-500 italic">
                                <Check size={12} className="text-emerald-600" />
                                <span>Đã lưu nháp {lastSavedDraftTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                        )}

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
                    {/* LEFT CANVAS: MAIN CORNELL NOTE FORM */}
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {activePrograms.length > 1 && (
                                    <div>
                                        <EditorialSelect
                                            label="Chương trình đào tạo *"
                                            value={logForm.programId}
                                            onChange={val => {
                                                const candidateMods = (modules || []).filter(m => isModuleInProgram(m, val));
                                                setLogForm(prev => ({
                                                    ...prev,
                                                    programId: val,
                                                    moduleId: candidateMods[0]?.id || ''
                                                }));
                                            }}
                                            options={activePrograms.map(p => ({ label: p.name, value: p.id }))}
                                        />
                                    </div>
                                )}
                                <div className={activePrograms.length > 1 ? '' : 'sm:col-span-2'}>
                                    <EditorialSelect
                                        label="Học phần *"
                                        value={logForm.moduleId}
                                        onChange={val => {
                                            const mod = (modules || []).find(m => m.id === val);
                                            setLogForm(prev => ({
                                                ...prev,
                                                moduleId: val,
                                                instructor: mod?.instructor || prev.instructor
                                            }));
                                        }}
                                        options={editorModuleOptions}
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

                        {/* 2. CORNELL NOTE SHEET CANVAS */}
                        <div className="bg-white border-editorial p-6 sm:p-8 shadow-editorial space-y-6">
                            {/* Header of Cornell Sheet */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b-2 border-brand-cerulean/30">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 bg-brand-cerulean text-white font-serif-title font-bold text-[11px] uppercase tracking-wider rounded-xs">
                                            Cornell Method
                                        </span>
                                        <span className="text-xs font-serif-title text-brand-jasper font-semibold">
                                            Phương pháp ghi chép Cornell tiêu chuẩn
                                        </span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-brand-cerulean mt-1">
                                        Bảng ghi chép bài học Cornell
                                    </h3>
                                </div>
                                <div className="text-xs font-sans text-gray-500 bg-brand-cream/60 px-3 py-1.5 border border-brand-cerulean/20 rounded-xs">
                                    <span className="font-semibold text-brand-cerulean">Quy trình 5R:</span> Record &rarr; Reduce &rarr; Recite &rarr; Reflect &rarr; Review
                                </div>
                            </div>

                            {/* Topic / Lesson Title */}
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

                            {/* 2-COLUMN CORNELL BODY */}
                            <div className="border border-brand-cerulean/30 rounded-xs overflow-hidden shadow-xs">
                                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-brand-cerulean/25 bg-brand-cream/15">
                                    {/* CUES / KEYWORDS / REVIEW QUESTIONS COLUMN (~38% or 5/12 cols) */}
                                    <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-3 bg-brand-cream/35">
                                        <div>
                                            <div className="flex items-center justify-between pb-2 border-b border-brand-cerulean/20">
                                                <label className="text-sm font-serif-title text-brand-cerulean font-bold flex items-center gap-1.5">
                                                    <Lightbulb size={16} className="text-brand-jasper" />
                                                    <span>CUES / CỘT GỢI Ý & TỰ VẤN</span>
                                                </label>
                                                <span className="text-[11px] font-sans text-brand-jasper font-semibold uppercase">30% - 35%</span>
                                            </div>
                                            <p className="text-xs font-sans text-gray-600 mt-1.5 leading-relaxed">
                                                Ghi <strong>từ khóa chính</strong>, <strong>câu hỏi tự kiểm tra (Recite)</strong> hoặc điểm tựa tư duy để ôn tập sau buổi học.
                                            </p>
                                        </div>

                                        <div className="flex-1">
                                            <textarea
                                                rows="15"
                                                className="input-editorial w-full resize-y text-sm font-body leading-relaxed p-3.5 bg-white border border-brand-cerulean/30 rounded-xs shadow-inner"
                                                value={logForm.cues}
                                                onChange={e => setLogForm({ ...logForm, cues: e.target.value })}
                                                placeholder={`• TỪ KHÓA CỐT LÕI:
- Vùng phát triển gần (ZPD)
- Thang đo nhận thức Bloom
- Chú ý có chủ định & Vô chủ định

• CÂU HỎI TỰ VẤN & ÔN TẬP (RECITE):
? Làm sao nhận biết học sinh rơi vào vùng quá tải nhận thức?
? 3 bước thiết kế câu hỏi phân hóa theo chuẩn sư phạm?`}
                                            />
                                        </div>

                                        <div className="text-[11px] font-sans text-gray-500 bg-white/80 p-2.5 border border-brand-cerulean/15 rounded-xs leading-normal">
                                            <span className="font-semibold text-brand-cerulean block mb-0.5">💡 Mẹo ôn bài Cornell:</span>
                                            Dùng tay che cột ghi chép bên phải, nhìn vào cột gợi ý bên trái để tự trả lời câu hỏi ôn tập.
                                        </div>
                                    </div>

                                    {/* NOTES / DETAILED LECTURE NOTES COLUMN (~62% or 7/12 cols) */}
                                    <div className="md:col-span-7 p-4 sm:p-5 flex flex-col space-y-3 bg-white">
                                        <div>
                                            <div className="flex items-center justify-between pb-2 border-b border-brand-cerulean/20">
                                                <label className="text-sm font-serif-title text-brand-cerulean font-bold flex items-center gap-1.5">
                                                    <FileText size={16} className="text-brand-cerulean" />
                                                    <span>NOTES / GHI CHÉP CHI TIẾT BÀI GIẢNG</span>
                                                </label>
                                                <span className="text-[11px] font-sans text-brand-cerulean font-semibold uppercase">65% - 70%</span>
                                            </div>
                                            <p className="text-xs font-sans text-gray-600 mt-1.5 leading-relaxed">
                                                Ghi chép đầy đủ <strong>luận điểm</strong>, <strong>định nghĩa</strong>, <strong>công thức</strong>, <strong>sơ đồ</strong> và ví dụ sư phạm thực tế.
                                            </p>
                                        </div>

                                        <div className="flex-1">
                                            <WordRichTextEditor
                                                value={logForm.content}
                                                onChange={html => setLogForm(prev => ({ ...prev, content: html }))}
                                                placeholder="Soạn thảo ghi chép bài giảng theo chuẩn Microsoft Word (sử dụng thanh Ribbon bên trên để định dạng tiêu đề, in đậm, in nghiêng, gạch chân, tô màu, chèn bảng hoặc nhập trực tiếp từ tệp Word .docx)..."
                                                minHeight="420px"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM CORNELL SUMMARY SECTION (FULL WIDTH) */}
                                <div className="p-4 sm:p-5 bg-amber-50/40 border-t-2 border-brand-cerulean/25 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-serif-title text-brand-cerulean font-bold flex items-center gap-1.5">
                                            <Sparkles size={16} className="text-brand-jasper" />
                                            <span>SUMMARY / TÓM TẮT CỐT LÕI BÀI HỌC (BOTTOM)</span>
                                        </label>
                                        <span className="text-xs text-gray-500 font-sans italic">2 - 4 câu đúc kết</span>
                                    </div>
                                    <p className="text-xs font-sans text-gray-600 leading-relaxed">
                                        Tóm lược toàn bộ bài học bằng chính ngôn từ súc tích của bạn ngay sau khi kết thúc buổi giảng để khắc sâu kiến thức.
                                    </p>
                                    <textarea
                                        rows="4"
                                        className="input-editorial w-full resize-y text-sm font-body leading-relaxed p-3.5 bg-white border border-brand-cerulean/30 rounded-xs shadow-inner"
                                        value={logForm.summary}
                                        onChange={e => setLogForm({ ...logForm, summary: e.target.value })}
                                        placeholder="VD: Buổi học đúc kết 6 mức độ nhận thức theo thang Bloom và cách vận dụng vùng phát triển gần (ZPD) vào thiết kế hoạt động học tập. Điểm cốt lõi là giáo viên cần chuyển từ thuyết giảng sang đặt câu hỏi gợi mở để kích hoạt tư duy bậc cao của học sinh."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. HOMEWORK & ATTACHMENTS */}
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-6">
                            {/* Homework & Action items */}
                            <div className="space-y-2">
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
                                />

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

                            {/* Attachments */}
                            <div className="pt-4 border-t border-brand-cerulean/15">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-semibold flex items-center gap-1">
                                    <FolderOpen size={14} className="text-brand-jasper" />
                                    <span>Đường dẫn tài liệu / Slide bài học trực tuyến (Google Drive / OneDrive / LMS)</span>
                                </label>
                                <input
                                    type="url"
                                    className="input-editorial w-full text-sm font-mono"
                                    value={logForm.attachments}
                                    onChange={e => setLogForm({ ...logForm, attachments: e.target.value })}
                                    placeholder="https://drive.google.com/file/d/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR: REFERENCE SLIDES & CORNELL CHEATSHEET */}
                    {showReferenceSidebar && (
                        <aside className="lg:col-span-4 space-y-6 sticky top-20">
                            {/* MODULE SLIDES / RESOURCES VIEWER */}
                            <div className="bg-white border-editorial p-5 shadow-editorial space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-brand-cerulean/20">
                                    <h4 className="font-serif-title text-brand-cerulean font-bold text-sm flex items-center gap-1.5">
                                        <FolderOpen size={16} className="text-brand-jasper" />
                                        <span>Slide & Tài liệu môn học này</span>
                                    </h4>
                                    <span className="text-xs px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-bold rounded-full">
                                        {moduleResources.length}
                                    </span>
                                </div>

                                <div className="text-xs font-serif-title text-gray-500">
                                    Môn: <strong className="text-brand-cerulean">{currentEditorModule ? `${currentEditorModule.code} - ${currentEditorModule.name}` : 'Chưa chọn'}</strong>
                                </div>

                                {moduleResources.length > 0 ? (
                                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                                        {moduleResources.map(r => (
                                            <div key={r.id} className="p-3 bg-brand-cream/40 border border-brand-cerulean/20 rounded-xs space-y-1 hover:border-brand-jasper transition-colors">
                                                <div className="text-xs font-serif-title font-bold text-brand-cerulean truncate" title={r.title}>
                                                    {r.title}
                                                </div>
                                                <div className="flex items-center justify-between gap-2 text-[11px] font-sans">
                                                    <span className="px-1.5 py-0.2 bg-brand-cream border border-brand-cerulean/30 text-gray-600 rounded">
                                                        {r.type || 'Tài liệu'}
                                                    </span>
                                                    <a
                                                        href={r.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-brand-jasper hover:underline font-bold flex items-center gap-0.5"
                                                    >
                                                        Mở link <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-brand-cream/30 border border-dashed border-brand-cerulean/20 text-center text-xs text-gray-500 space-y-1">
                                        <p>Chưa có slide / tài liệu nào cho môn này.</p>
                                        <p className="text-[11px] text-gray-400">Bạn có thể thêm ở Tab "Tài liệu học phần".</p>
                                    </div>
                                )}

                                <div className="pt-2 border-t border-brand-cerulean/10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm('Chuyển sang Tab Tài liệu môn để thêm slide mới? (Bản nháp bài học hiện tại vẫn được bảo lưu tự động)')) {
                                                setEditorMode(false);
                                                setActiveTab('resources');
                                            }
                                        }}
                                        className="w-full py-1.5 text-xs font-serif-title font-bold text-brand-cerulean border border-brand-cerulean/30 hover:bg-brand-cream transition-colors text-center block"
                                    >
                                        Quản lý tất cả học liệu &rarr;
                                    </button>
                                </div>
                            </div>

                            {/* CORNELL 5R PEDAGOGICAL CHEATSHEET */}
                            <div className="bg-brand-cream border border-brand-cerulean/30 p-5 rounded-xs space-y-3 shadow-xs">
                                <h4 className="font-serif-title text-brand-cerulean font-bold text-sm flex items-center gap-1.5">
                                    <Bookmark size={15} className="text-brand-jasper" />
                                    <span>Quy trình ghi chép Cornell 5R</span>
                                </h4>
                                <ul className="text-xs font-sans text-gray-700 space-y-2 list-none pl-0 leading-relaxed">
                                    <li className="flex items-start gap-1.5">
                                        <span className="font-bold text-brand-cerulean shrink-0">1. Record (Ghi chép):</span>
                                        <span>Trong buổi học, ghi luận điểm chính, định nghĩa, ví dụ vào cột Notes bên phải.</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="font-bold text-brand-cerulean shrink-0">2. Reduce (Thu gọn):</span>
                                        <span>Sau buổi học, cô đọng thành từ khóa và câu hỏi ôn tập vào cột Cues bên trái.</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="font-bold text-brand-cerulean shrink-0">3. Recite (Tự vấn):</span>
                                        <span>Che cột Notes, nhìn vào câu hỏi ở cột Cues để tự trả lời và tái hiện kiến thức.</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="font-bold text-brand-cerulean shrink-0">4. Reflect (Phản tư):</span>
                                        <span>Liên hệ kiến thức với phương pháp sư phạm và bối cảnh học sinh thực tế.</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="font-bold text-brand-cerulean shrink-0">5. Review (Tóm tắt):</span>
                                        <span>Viết 2-4 câu đúc kết cốt lõi vào khung Summary ở chân trang.</span>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    )}
                </div>

                {/* BOTTOM IN-FLOW ACTION CARD */}
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
                subtitle="Sổ ghi chép bài học sau từng buổi giảng theo phương pháp Cornell, lưu trữ tài liệu slide & việc cần làm trước buổi sau."
                actions={
                    <div className="flex w-full sm:w-auto bg-white p-1 border border-brand-cerulean shadow-xs shrink-0">
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`flex-1 sm:flex-none justify-center px-2.5 sm:px-4 py-1.5 sm:py-2 font-serif-title flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all ${
                                activeTab === 'logs' ? 'bg-brand-cerulean text-white font-bold shadow-xs' : 'text-brand-cerulean hover:bg-brand-cream'
                            }`}
                        >
                            <StickyNote size={14} />
                            <span>Sổ ghi chép Cornell</span>
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

            {/* BANNER NẾU CHƯA CÓ CTĐT NÀO Ở TRẠNG THÁI ĐANG HỌC */}
            {activePrograms.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-serif-title font-bold text-sm">Chưa có Chương trình đào tạo nào ở trạng thái "Đang học"</h4>
                            <p className="text-xs text-amber-800 font-sans mt-0.5">
                                Bạn hãy chuyển trạng thái của chương trình đào tạo sang "Đang học" để danh sách học phần hiển thị đầy đủ tại đây.
                            </p>
                        </div>
                    </div>
                    {navigate && (
                        <button
                            type="button"
                            onClick={() => navigate('programs')}
                            className="px-4 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-sm hover:bg-brand-cerulean/90 shrink-0"
                        >
                            Xem Chương trình học &rarr;
                        </button>
                    )}
                </div>
            )}

            {/* TAB 1: SỔ GHI CHÉP BÀI HỌC (SESSION LESSON NOTES - CORNELL STYLE) */}
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

                    {/* TOOLBAR: PROGRAM FILTER, MODULE FILTER, SEARCH & FULL-PAGE NEW NOTE BUTTON */}
                    <div className="bg-white border-editorial p-3.5 sm:p-5 shadow-editorial flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
                            {/* Program filter (nếu có > 1 CTĐT đang học) */}
                            {activePrograms.length > 1 && (
                                <div className="w-full sm:w-56">
                                    <EditorialSelect
                                        label="Lọc theo CTĐT đang học"
                                        value={selectedProgramFilter}
                                        onChange={val => {
                                            setSelectedProgramFilter(val);
                                            setSelectedModuleFilter('all');
                                        }}
                                        options={programOptions}
                                    />
                                </div>
                            )}

                            {/* Module filter */}
                            <div className="w-full sm:w-60">
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
                                    placeholder="Tìm theo tên bài, từ khóa, câu hỏi ôn tập, tóm tắt..."
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

                        {/* CTA: Full-page note editor button */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleOpenAddLog()}
                                className="w-full md:w-auto px-4 py-2.5 bg-brand-cerulean text-white font-serif-title font-bold text-xs sm:text-sm shadow-editorial hover:bg-brand-cerulean/90 transition-all flex items-center justify-center gap-2 shrink-0 group"
                            >
                                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                                <span>Ghi chép Cornell mới</span>
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
                                <span className="text-xs uppercase text-gray-500 font-bold block">Học phần khả dụng</span>
                                <h4 className="text-2xl font-serif-title font-bold text-brand-jasper">{availableModules.length} môn</h4>
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

                    {/* STUDY LOGS CARDS LIST (CORNELL STYLE CARDS) */}
                    <div className="space-y-6">
                        {filteredLogs.map(log => {
                            const mod = (modules || []).find(m => m.id === log.moduleId);
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

                                    <div className="p-4 sm:p-6 space-y-4">
                                        {/* HEADER METADATA: SESSION BADGE, CORNELL BADGE, MODULE, DATE, CA HỌC, GIẢNG VIÊN */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-cerulean/15">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-3 py-1 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-xs tracking-wider uppercase">
                                                    Buổi {log.sessionNumber || '01'}
                                                </span>

                                                <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/20 text-[11px] font-bold font-serif-title uppercase tracking-wider rounded-xs">
                                                    Cornell Note
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
                                                    <Eye size={14} /> Xem chuẩn Cornell
                                                </span>
                                            </h3>
                                        </div>

                                        {/* CORNELL 2-COLUMN SHEET BODY */}
                                        <div className="border border-brand-cerulean/25 rounded-xs overflow-hidden shadow-xs">
                                            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-brand-cerulean/20">
                                                {/* CUES / KEYWORDS / REVIEW QUESTIONS COLUMN (~35% or 4/12 cols) */}
                                                <div className="md:col-span-4 p-4 bg-brand-cream/35 space-y-2 flex flex-col">
                                                    <div className="flex items-center gap-1.5 text-xs font-serif-title font-bold text-brand-jasper uppercase tracking-wider pb-1 border-b border-brand-cerulean/20 shrink-0">
                                                        <Lightbulb size={14} />
                                                        <span>Cues & Câu hỏi gợi nhớ</span>
                                                    </div>

                                                    <div className="max-h-64 sm:max-h-80 overflow-y-auto pr-1">
                                                        {log.cues ? (
                                                            <div className="text-xs sm:text-sm font-body text-gray-700 leading-relaxed whitespace-pre-line">
                                                                {log.cues}
                                                            </div>
                                                        ) : keyItems.length > 0 || log.questions ? (
                                                            <div className="space-y-2">
                                                                {keyItems.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                                        {keyItems.map((k, idx) => (
                                                                            <span key={idx} className="px-2 py-0.5 bg-white border border-brand-cerulean/30 text-[11px] font-serif-title text-brand-cerulean font-medium rounded-xs">
                                                                                #{k}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {log.questions && (
                                                                    <div className="text-xs text-gray-600 italic bg-white/70 p-2 border border-brand-cerulean/15 rounded-xs">
                                                                        <strong>Thắc mắc:</strong> {log.questions}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-gray-400 italic">
                                                                Chưa ghi chú từ khóa gợi nhớ.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* NOTES / DETAILED LECTURE CONTENT (~65% or 8/12 cols) */}
                                                <div className="md:col-span-8 p-4 bg-white space-y-2 flex flex-col">
                                                    <div className="flex items-center gap-1.5 text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider pb-1 border-b border-brand-cerulean/20 shrink-0">
                                                        <FileText size={14} />
                                                        <span>Notes / Ghi chép chi tiết</span>
                                                    </div>
                                                    <div className="text-gray-800 font-body text-base leading-relaxed max-h-64 sm:max-h-80 overflow-y-auto pr-2">
                                                        {log.content ? (
                                                            /<[a-z][\s\S]*>/i.test(log.content) ? (
                                                                <div className="word-content" dangerouslySetInnerHTML={{ __html: log.content }} />
                                                            ) : (
                                                                <div className="whitespace-pre-line">{log.content}</div>
                                                            )
                                                        ) : (
                                                            <span className="text-gray-400 italic">Chưa có nội dung ghi chép chi tiết.</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* BOTTOM CORNELL SUMMARY ROW */}
                                            {log.summary && (
                                                <div className="p-3.5 bg-amber-50/50 border-t border-brand-cerulean/20 flex items-start gap-2.5 text-xs sm:text-sm">
                                                    <Sparkles size={16} className="text-brand-jasper shrink-0 mt-0.5" />
                                                    <div className="space-y-0.5">
                                                        <span className="font-serif-title font-bold text-brand-cerulean block uppercase text-[11px] tracking-wider">
                                                            Summary / Tóm tắt cốt lõi bài học:
                                                        </span>
                                                        <p className="font-body text-gray-800 leading-relaxed italic">
                                                            {log.summary}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

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
                                                    <BookOpen size={13} /> Đọc Cornell
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
                                        Hãy ghi chép lại nội dung bài giảng theo phương pháp Cornell (Cues - Notes - Summary) để dễ dàng ôn tập và phản tư sư phạm.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleOpenAddLog(selectedModuleFilter !== 'all' ? selectedModuleFilter : null)}
                                    className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title text-sm font-bold shadow-editorial hover:bg-brand-cerulean/90 transition-all inline-flex items-center gap-2"
                                >
                                    <Plus size={16} /> Bắt đầu ghi chép Cornell
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: TÀI LIỆU HỌC PHẦN (RESOURCES) */}
            {activeTab === 'resources' && (
                <div className="space-y-6">
                    {/* TOOLBAR TAB 2: HEADER, ACTION & FILTERS */}
                    <div className="bg-white border-editorial p-4 sm:p-5 shadow-editorial space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-cerulean/15">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                                    <FolderOpen size={22} className="text-brand-cerulean" />
                                    <span>Tài liệu & Học liệu môn học</span>
                                </h3>
                                <p className="text-xs text-gray-500 font-body mt-0.5">
                                    Kho lưu trữ slide bài giảng, giáo trình và tài liệu tham khảo theo từng CTĐT và học phần.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleOpenAddResource}
                                className="py-2 px-4 bg-brand-cerulean text-white font-serif-title font-bold text-sm shadow-editorial hover:bg-brand-cerulean/90 transition-colors flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
                            >
                                <Plus size={16} />
                                <span>Thêm tài liệu mới</span>
                            </button>
                        </div>

                        {/* FILTER & SEARCH CONTROLS */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
                                {activePrograms.length > 1 && (
                                    <div className="w-full sm:w-56">
                                        <EditorialSelect
                                            label="Lọc theo CTĐT đang học"
                                            value={resourceProgramFilter}
                                            onChange={val => {
                                                setResourceProgramFilter(val);
                                                setResourceModuleFilter('all');
                                            }}
                                            options={programOptions}
                                        />
                                    </div>
                                )}

                                <div className="w-full sm:w-60">
                                    <EditorialSelect
                                        label="Lọc theo Học phần"
                                        value={resourceModuleFilter}
                                        onChange={setResourceModuleFilter}
                                        options={[
                                            { label: `Tất cả học phần (${tab2FilteredModules.length})`, value: 'all' },
                                            ...tab2FilteredModules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }))
                                        ]}
                                    />
                                </div>

                                <div className="flex-1 relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={resourceSearchQuery}
                                        onChange={e => setResourceSearchQuery(e.target.value)}
                                        placeholder="Tìm kiếm tài liệu theo tên, link, môn học..."
                                        className="input-editorial w-full pl-9 pr-3 text-xs sm:text-sm"
                                    />
                                    {resourceSearchQuery && (
                                        <button
                                            onClick={() => setResourceSearchQuery('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DANH SÁCH TÀI LIỆU */}
                    <div className="space-y-4">
                        {filteredResources.map(res => {
                            const mod = (modules || []).find(m => m.id === res.moduleId);
                            const prog = activePrograms.find(p => isModuleInProgram(mod, p.id));
                            return (
                                <div key={res.id} className="bg-white border-editorial p-4 sm:p-5 shadow-editorial flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-brand-jasper">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {prog && (
                                                <span className="text-[10px] uppercase font-bold px-2 py-0.2 bg-brand-cerulean/10 text-brand-cerulean rounded">
                                                    {prog.name}
                                                </span>
                                            )}
                                            <span className="text-xs font-bold text-gray-500 font-mono">
                                                {mod?.code} - {mod?.name}
                                            </span>
                                            {res.type && (
                                                <span className="text-[11px] px-1.5 py-0.2 bg-brand-cream border border-brand-cerulean/20 text-gray-600 rounded">
                                                    {res.type}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-xl font-serif-title text-brand-cerulean font-bold">{res.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                                        <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cream border border-brand-jasper/30 text-brand-jasper hover:underline font-serif-title text-xs font-bold shadow-xs"
                                        >
                                            <ExternalLink size={14} /> Mở tài liệu
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleStartEditResource(res)}
                                            className="p-1.5 text-gray-600 hover:text-brand-cerulean hover:bg-brand-cream border border-transparent hover:border-brand-cerulean/30 rounded transition-colors"
                                            title="Chỉnh sửa tài liệu này"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setResourceToDelete(res)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition-colors"
                                            title="Xóa tài liệu"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredResources.length === 0 && (
                            <div className="bg-white border-2 border-dashed border-brand-cerulean/30 p-10 text-center space-y-3 font-serif-title shadow-editorial">
                                <div className="w-12 h-12 mx-auto rounded-full bg-brand-cream border border-brand-cerulean/30 flex items-center justify-center text-brand-cerulean">
                                    <FolderOpen size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold text-brand-cerulean">
                                        {resources.length === 0
                                            ? 'Chưa có tài liệu hoặc học liệu nào được lưu trữ'
                                            : 'Không tìm thấy tài liệu phù hợp với bộ lọc'}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-sans">
                                        {resources.length === 0
                                            ? 'Bấm nút bên dưới để thêm tài liệu hoặc slide học phần đầu tiên.'
                                            : 'Hãy thử đổi từ khóa tìm kiếm hoặc chọn lại chương trình/học phần.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleOpenAddResource}
                                    className="px-5 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-cerulean/90 transition-all inline-flex items-center gap-1.5"
                                >
                                    <Plus size={14} /> Thêm tài liệu ngay
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* READING FOCUS MODAL (CHUẨN BẢNG GHI CHÉP CORNELL) */}
            <Modal
                isOpen={!!viewingLog}
                onClose={() => setViewingLog(null)}
                title={viewingLog ? `Phiếu Ghi Chép Cornell • Buổi ${viewingLog.sessionNumber || '01'}` : ''}
                maxWidth="max-w-4xl"
            >
                {viewingLog && (() => {
                    const mod = (modules || []).find(m => m.id === viewingLog.moduleId);
                    const sessionMeta = getSessionMeta(viewingLog.sessionTime);
                    const SIcon = sessionMeta.icon;
                    const homeworkItems = parseHomeworkItems(viewingLog.homework);
                    const keyItems = parseKeyTakeaways(viewingLog.keyTakeaways);
                    const completedTasks = Array.isArray(viewingLog.completedTasks) ? viewingLog.completedTasks : [];

                    return (
                        <div className="space-y-6">
                            {/* TOP ACTION BAR */}
                            <div className="flex items-center justify-between pb-3 border-b border-brand-cerulean/20">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 bg-brand-cerulean text-white font-serif-title font-bold text-xs">
                                        {mod?.code || 'HP'}: {mod?.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-serif-title font-bold text-xs uppercase tracking-wider">
                                        Cornell Notes
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
                                        className="px-3 py-1 text-xs font-serif-title font-bold text-brand-cerulean border border-brand-cerulean/30 hover:bg-brand-cerulean hover:text-white rounded flex items-center gap-1"
                                    >
                                        <Pencil size={13} /> Sửa bài học này
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="px-3 py-1 text-xs font-serif-title font-bold text-brand-jasper border border-brand-jasper/40 hover:bg-brand-cream rounded flex items-center gap-1.5"
                                    >
                                        <Printer size={14} /> In phiếu Cornell
                                    </button>
                                </div>
                            </div>

                            {/* TITLE & METADATA */}
                            <div className="space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-brand-cerulean leading-snug">
                                    {viewingLog.title}
                                </h2>
                                <div className="flex flex-wrap gap-4 text-xs font-sans text-gray-600">
                                    <span><strong>Buổi số:</strong> {viewingLog.sessionNumber || '01'}</span>
                                    <span>&bull;</span>
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

                            {/* CORNELL NOTE SHEET DISPLAY */}
                            <div className="border border-brand-cerulean/30 rounded-xs overflow-hidden shadow-xs">
                                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-brand-cerulean/25">
                                    {/* CUES COLUMN (~35% or 4/12 cols) */}
                                    <div className="md:col-span-4 p-4 bg-brand-cream/35 space-y-3 flex flex-col">
                                        <h4 className="text-xs font-serif-title font-bold text-brand-jasper uppercase tracking-wider pb-1.5 border-b border-brand-cerulean/20 flex items-center gap-1 shrink-0">
                                            <Lightbulb size={14} />
                                            <span>Cues / Gợi ý & Tự vấn</span>
                                        </h4>
                                        <div className="max-h-96 overflow-y-auto pr-1">
                                            {viewingLog.cues ? (
                                                <div className="text-xs sm:text-sm font-body text-gray-800 leading-relaxed whitespace-pre-line">
                                                    {viewingLog.cues}
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {keyItems.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {keyItems.map((k, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 bg-white border border-brand-cerulean/30 text-xs font-serif-title text-brand-cerulean font-bold rounded-xs">
                                                                    #{k}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {viewingLog.questions && (
                                                        <div className="p-2.5 bg-white border border-brand-cerulean/15 rounded text-xs text-gray-700 italic">
                                                            <strong>Thắc mắc:</strong> {viewingLog.questions}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* NOTES COLUMN (~65% or 8/12 cols) */}
                                    <div className="md:col-span-8 p-4 sm:p-5 bg-white space-y-3 flex flex-col">
                                        <h4 className="text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider pb-1.5 border-b border-brand-cerulean/20 flex items-center gap-1 shrink-0">
                                            <FileText size={14} />
                                            <span>Notes / Ghi chép chi tiết bài giảng</span>
                                        </h4>
                                        <div className="text-gray-800 text-base font-body leading-relaxed max-h-96 overflow-y-auto pr-2">
                                            {viewingLog.content ? (
                                                /<[a-z][\s\S]*>/i.test(viewingLog.content) ? (
                                                    <div className="word-content" dangerouslySetInnerHTML={{ __html: viewingLog.content }} />
                                                ) : (
                                                    <div className="whitespace-pre-line">{viewingLog.content}</div>
                                                )
                                            ) : (
                                                <span className="text-gray-400 italic">Chưa có nội dung ghi chép chi tiết.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* SUMMARY (FULL WIDTH AT BOTTOM) */}
                                {viewingLog.summary && (
                                    <div className="p-4 bg-amber-50/50 border-t-2 border-brand-cerulean/25 space-y-1">
                                        <h4 className="text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider flex items-center gap-1.5">
                                            <Sparkles size={14} className="text-brand-jasper" />
                                            <span>Summary / Tóm tắt cốt lõi bài học:</span>
                                        </h4>
                                        <div className="text-sm font-body text-gray-800 leading-relaxed italic">
                                            {viewingLog.summary}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* HOMEWORK & ACTION ITEMS */}
                            {homeworkItems.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-serif-title font-bold text-amber-900 uppercase tracking-wider pb-1 border-b border-amber-300 flex items-center gap-1.5">
                                        <ListChecks size={14} className="text-brand-jasper" />
                                        <span>Dặn dò & Việc cần làm trước buổi sau</span>
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

            {/* RESOURCE CRUD MODAL (THÊM / SỬA TÀI LIỆU HỌC PHẦN) */}
            <Modal
                isOpen={isResourceModalOpen}
                onClose={handleCloseResourceModal}
                title={editingResourceId ? "Chỉnh sửa Tài liệu Học phần" : "Thêm Tài liệu Học phần Mới"}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSaveResource} className="space-y-4 pt-1">
                    {activePrograms.length > 1 && (
                        <div>
                            <EditorialSelect
                                label="Chương trình đào tạo (Đang học)"
                                value={resForm.programId}
                                onChange={val => {
                                    const nextCandidateMods = (modules || []).filter(m => isModuleInProgram(m, val));
                                    setResForm({
                                        ...resForm,
                                        programId: val,
                                        moduleId: nextCandidateMods[0]?.id || ''
                                    });
                                }}
                                options={activePrograms.map(p => ({ label: p.name, value: p.id }))}
                            />
                        </div>
                    )}

                    <div>
                        <EditorialSelect
                            label="Học phần *"
                            value={resForm.moduleId}
                            onChange={val => setResForm({ ...resForm, moduleId: val })}
                            options={resourceFormModuleOptions}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">
                            Tên tài liệu / Slide bài giảng *
                        </label>
                        <input
                            required
                            type="text"
                            className="input-editorial w-full text-sm"
                            value={resForm.title}
                            onChange={e => setResForm({ ...resForm, title: e.target.value })}
                            placeholder="VD: Slide Chương 1 - Nhập môn Tâm lý học Sư phạm"
                        />
                    </div>

                    <div>
                        <EditorialSelect
                            label="Định dạng tài liệu"
                            value={resForm.type}
                            onChange={val => setResForm({ ...resForm, type: val })}
                            options={[
                                { label: 'Google Drive / PDF', value: 'Drive / PDF' },
                                { label: 'Slide trình chiếu (PPTX)', value: 'Slide PPTX' },
                                { label: 'Tài liệu Word (DOCX)', value: 'Word DOCX' },
                                { label: 'Bản ghi video / Audio bài giảng', value: 'Video/Audio' },
                                { label: 'Trang liên kết ngoài', value: 'Liên kết ngoài' }
                            ]}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">
                            URL Liên kết (Google Drive / DropBox / Web) *
                        </label>
                        <input
                            required
                            type="url"
                            className="input-editorial w-full font-mono text-sm"
                            value={resForm.url}
                            onChange={e => setResForm({ ...resForm, url: e.target.value })}
                            placeholder="https://drive.google.com/..."
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-cerulean/20">
                        <button
                            type="button"
                            onClick={handleCloseResourceModal}
                            className="py-2 px-4 bg-gray-100 text-gray-700 font-serif-title font-bold text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-5 bg-brand-cerulean text-white font-serif-title font-bold text-xs sm:text-sm shadow-editorial hover:bg-brand-cerulean/90 transition-colors flex items-center gap-1.5"
                        >
                            {editingResourceId ? <Save size={15} /> : <Plus size={15} />}
                            <span>{editingResourceId ? 'Cập nhật tài liệu' : 'Lưu tài liệu'}</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* DELETE RESOURCE CONFIRMATION MODAL */}
            <Modal
                isOpen={!!resourceToDelete}
                onClose={() => setResourceToDelete(null)}
                title="Xác nhận xóa tài liệu"
                maxWidth="max-w-md"
            >
                {resourceToDelete && (() => {
                    const mod = (modules || []).find(m => m.id === resourceToDelete.moduleId);
                    const prog = activePrograms.find(p => isModuleInProgram(mod, p.id));
                    return (
                        <div className="space-y-4 pt-1">
                            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded text-red-900 text-sm">
                                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-bold">Bạn có chắc chắn muốn xóa tài liệu này?</p>
                                    <p className="text-xs text-red-700 leading-relaxed">
                                        Hành động này sẽ gỡ bỏ tài liệu khỏi hệ thống và không thể hoàn tác.
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 bg-white border border-brand-cerulean/20 rounded space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {prog && (
                                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-brand-cerulean/10 text-brand-cerulean rounded">
                                            {prog.name}
                                        </span>
                                    )}
                                    <span className="text-xs font-bold text-gray-500 font-mono">
                                        {mod?.code} - {mod?.name}
                                    </span>
                                </div>
                                <div className="font-serif-title font-bold text-brand-cerulean text-base">
                                    {resourceToDelete.title}
                                </div>
                                {resourceToDelete.type && (
                                    <span className="inline-block text-[11px] px-1.5 py-0.2 bg-brand-cream border border-brand-cerulean/20 text-gray-600 rounded">
                                        {resourceToDelete.type}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setResourceToDelete(null)}
                                    className="py-2 px-4 bg-gray-100 text-gray-700 font-serif-title font-bold text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDeleteResource}
                                    className="py-2 px-4 bg-red-600 text-white font-serif-title font-bold text-xs sm:text-sm shadow-editorial hover:bg-red-700 transition-colors flex items-center gap-1.5"
                                >
                                    <Trash2 size={15} />
                                    <span>Xóa vĩnh viễn</span>
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};
