import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Target, Award, BookOpen, Sparkles, CheckCircle2, Circle, Clock,
    Plus, Trash2, Edit2, AlertCircle, Save, Filter, Search, GraduationCap,
    AlertTriangle, Calculator, Lightbulb, X, CheckSquare, Compass,
    Building2, ArrowUp, ArrowDown, Check, Zap
} from 'lucide-react';
import { EditorialSelect } from './EditorialSelect';
import { EditorialDatePicker } from './EditorialDatePicker';
import { EditorialUniversitySelect } from './EditorialUniversitySelect';
import { MathText } from './MathText';

export const THPT_COMBINATIONS = [
    { value: '', label: '-- Chọn Khối thi xét tuyển --', subjects: [] },
    { value: 'A00', label: 'Khối A00 (Toán, Vật lí, Hóa học)', subjects: ['math', 'physics', 'chemistry'] },
    { value: 'A01', label: 'Khối A01 (Toán, Vật lí, Tiếng Anh)', subjects: ['math', 'physics', 'english'] },
    { value: 'A02', label: 'Khối A02 (Toán, Vật lí, Sinh học)', subjects: ['math', 'physics', 'biology'] },
    { value: 'B00', label: 'Khối B00 (Toán, Hóa học, Sinh học)', subjects: ['math', 'chemistry', 'biology'] },
    { value: 'B08', label: 'Khối B08 (Toán, Sinh học, Tiếng Anh)', subjects: ['math', 'biology', 'english'] },
    { value: 'C00', label: 'Khối C00 (Ngữ văn, Lịch sử, Địa lí)', subjects: ['literature', 'history', 'geography'] },
    { value: 'C01', label: 'Khối C01 (Ngữ văn, Toán, Vật lí)', subjects: ['literature', 'math', 'physics'] },
    { value: 'C02', label: 'Khối C02 (Ngữ văn, Toán, Hóa học)', subjects: ['literature', 'math', 'chemistry'] },
    { value: 'C03', label: 'Khối C03 (Ngữ văn, Toán, Lịch sử)', subjects: ['literature', 'math', 'history'] },
    { value: 'D01', label: 'Khối D01 (Toán, Ngữ văn, Tiếng Anh)', subjects: ['math', 'literature', 'english'] },
    { value: 'D07', label: 'Khối D07 (Toán, Hóa học, Tiếng Anh)', subjects: ['math', 'chemistry', 'english'] },
    { value: 'D08', label: 'Khối D08 (Toán, Sinh học, Tiếng Anh)', subjects: ['math', 'biology', 'english'] },
    { value: 'D09', label: 'Khối D09 (Toán, Lịch sử, Tiếng Anh)', subjects: ['math', 'history', 'english'] },
    { value: 'D10', label: 'Khối D10 (Toán, Địa lí, Tiếng Anh)', subjects: ['math', 'geography', 'english'] },
    { value: 'D14', label: 'Khối D14 (Ngữ văn, Lịch sử, Tiếng Anh)', subjects: ['literature', 'history', 'english'] },
    { value: 'D15', label: 'Khối D15 (Ngữ văn, Địa lí, Tiếng Anh)', subjects: ['literature', 'geography', 'english'] },
    { value: 'custom', label: 'Khối tự chọn khác', subjects: [] }
];

export const OFFICIAL_THPT_SUBJECTS = [
    { id: 'math', name: 'Toán', color: '#124874' },
    { id: 'literature', name: 'Ngữ văn', color: '#124874' },
    { id: 'english', name: 'Tiếng Anh', color: '#124874' },
    { id: 'physics', name: 'Vật lí', color: '#124874' },
    { id: 'chemistry', name: 'Hóa học', color: '#124874' },
    { id: 'biology', name: 'Sinh học', color: '#124874' },
    { id: 'history', name: 'Lịch sử', color: '#124874' },
    { id: 'geography', name: 'Địa lí', color: '#124874' },
    { id: 'civicEducation', name: 'GDCD / KTPL', color: '#124874' },
    { id: 'informatics', name: 'Tin học', color: '#124874' },
    { id: 'technology', name: 'Công nghệ', color: '#124874' },
];

export const calculateOfficialComboScore = (comboCode, scores = {}) => {
    const combo = THPT_COMBINATIONS.find(c => c.value === comboCode);
    if (!combo || !combo.subjects || combo.subjects.length === 0) return null;
    let total = 0;
    let count = 0;
    for (const subjId of combo.subjects) {
        const val = scores[subjId];
        if (val !== undefined && val !== '' && !isNaN(Number(val))) {
            total += Number(val);
            count++;
        }
    }
    return count === combo.subjects.length ? Number(total.toFixed(2)) : null;
};

export const parseAnyDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const s = dateStr.trim();
    if (!s) return null;
    // Format: DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split('/').map(Number);
        return new Date(y, m - 1, d);
    }
    // Format: YYYY-MM-DD
    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(s)) {
        const parts = s.split('T')[0].split('-').map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
};

export const getPhaseTimeStatus = (phase) => {
    // 1. If user explicitly marked as completed
    if (phase?.status === 'completed') {
        return {
            status: 'completed',
            label: 'Đã hoàn thành',
            colorClass: 'text-emerald-700',
            bgBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            bgCardClass: 'bg-emerald-50/60 border-emerald-300',
            isDone: true,
            isInProgress: false,
            isOverdue: false,
            timeDetail: ''
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate = parseAnyDate(phase?.startDate);
    let endDate = parseAnyDate(phase?.endDate);

    // Fallback: parse from timeline string if startDate or endDate not explicitly saved
    if (!startDate || !endDate) {
        const { start, end } = parseTimelineRange(phase?.timeline || '');
        if (!startDate && start) startDate = parseAnyDate(start);
        if (!endDate && end) endDate = parseAnyDate(end);
    }

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    // If endDate has passed
    if (endDate && today > endDate) {
        const diffDays = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
        return {
            status: 'overdue',
            label: 'Đã qua thời gian',
            colorClass: 'text-amber-700',
            bgBadgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
            bgCardClass: 'bg-amber-50/50 border-amber-300 shadow-xs',
            isDone: false,
            isInProgress: false,
            isOverdue: true,
            timeDetail: `Hết hạn ${diffDays} ngày trước`
        };
    }

    // If today is within [startDate, endDate]
    if (startDate && endDate && today >= startDate && today <= endDate) {
        const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
            status: 'in_progress',
            label: 'Đang thực hiện',
            colorClass: 'text-brand-jasper',
            bgBadgeClass: 'bg-brand-jasper text-white border-brand-jasper',
            bgCardClass: 'bg-brand-cream border-brand-jasper shadow-sm',
            isDone: false,
            isInProgress: true,
            isOverdue: false,
            timeDetail: daysLeft === 0 ? 'Hôm nay là hạn cuối' : `Còn ${daysLeft} ngày`
        };
    }

    // If today is before startDate
    if (startDate && today < startDate) {
        const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
            status: 'pending',
            label: 'Chưa bắt đầu',
            colorClass: 'text-gray-500',
            bgBadgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
            bgCardClass: 'bg-white border-brand-cerulean/20 shadow-xs',
            isDone: false,
            isInProgress: false,
            isOverdue: false,
            timeDetail: `Bắt đầu sau ${daysUntil} ngày`
        };
    }

    // Fallback status if no dates
    if (phase?.status === 'in_progress') {
        return {
            status: 'in_progress',
            label: 'Đang thực hiện',
            colorClass: 'text-brand-jasper',
            bgBadgeClass: 'bg-brand-jasper text-white border-brand-jasper',
            bgCardClass: 'bg-brand-cream border-brand-jasper shadow-sm',
            isDone: false,
            isInProgress: true,
            isOverdue: false,
            timeDetail: ''
        };
    }

    return {
        status: 'pending',
        label: 'Chưa bắt đầu',
        colorClass: 'text-gray-500',
        bgBadgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
        bgCardClass: 'bg-white border-brand-cerulean/20 shadow-xs',
        isDone: false,
        isInProgress: false,
        isOverdue: false,
        timeDetail: ''
    };
};

export const getCleanPhaseTitle = (title) => {
    if (!title) return '';
    return title.replace(/^(Giai đoạn\s*(\d+|cuối|cuoi|nước rút|nuoc rut)|GĐ\s*\d+)[\s:.\-_]*/i, '').trim();
};

export const getPhaseLabel = (index, total) => {
    if (total > 1 && index === total - 1) {
        return 'Giai đoạn cuối';
    }
    return `Giai đoạn ${index + 1}`;
};

export const parseTimelineRange = (timelineStr = '') => {
    if (!timelineStr) return { start: '', end: '' };
    const str = timelineStr.trim();
    if (str.toLowerCase().startsWith('từ ') && str.toLowerCase().includes(' đến ')) {
        const parts = str.substring(3).split(/\s+đến\s+/i);
        return { start: parts[0]?.trim() || '', end: parts[1]?.trim() || '' };
    }
    if (str.includes(' - ')) {
        const parts = str.split(' - ');
        return { start: parts[0]?.trim() || '', end: parts[1]?.trim() || '' };
    }
    return { start: str, end: '' };
};

export const formatTimelineRange = (start, end) => {
    const s = (start || '').trim();
    const e = (end || '').trim();
    if (s && e) return `Từ ${s} đến ${e}`;
    if (s) return `Từ ${s}`;
    if (e) return `Đến ${e}`;
    return 'Tự do';
};

export const ThptPersonalGoalView = ({
    profile,
    subjects = [],
    results = [],
    onUpdateProfile,
    navigate,
    showToast
}) => {
    const [isEditingTargets, setIsEditingTargets] = useState(false);
    const [activeTab, setActiveTab] = useState('targets'); // 'targets' | 'mistakes' | 'phases'
    
    // Target Form State (Empty defaults, purely user-driven)
    const [targetForm, setTargetForm] = useState({
        combination: profile?.combination || '',
        targetUniversity: profile?.targetUniversity || '',
        targetTotalScore: profile?.targetTotalScore || '',
        subjectTargets: profile?.subjectTargets || []
    });

    // Mistake Note Filter & Form State
    const [mistakeSearch, setMistakeSearch] = useState('');
    const [mistakeSubjectFilter, setMistakeSubjectFilter] = useState('all');
    const [isAddMistakeOpen, setIsAddMistakeOpen] = useState(false);
    const [editingMistakeId, setEditingMistakeId] = useState(null);
    const [mistakeForm, setMistakeForm] = useState({
        subjectId: subjects[0]?.id || 'math',
        topic: '',
        title: '',
        mistake: '',
        remedy: '',
        category: 'Bẫy đề thi'
    });

    // Study Phase Modal & Form State
    const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
    const [newPhaseTitle, setNewPhaseTitle] = useState('');
    const [newPhaseTarget, setNewPhaseTarget] = useState('');
    const [newPhaseActivities, setNewPhaseActivities] = useState('');
    const [newPhaseStartDate, setNewPhaseStartDate] = useState('');
    const [newPhaseEndDate, setNewPhaseEndDate] = useState('');

    // Study Phase Edit State
    const [editingPhaseId, setEditingPhaseId] = useState(null);
    const [editingPhaseForm, setEditingPhaseForm] = useState({
        title: '',
        target: '',
        activities: '',
        startDate: '',
        endDate: ''
    });

    // Official Admission & Exam Results State
    const [isEditingAdmission, setIsEditingAdmission] = useState(false);
    const [admissionForm, setAdmissionForm] = useState({
        admittedUniversity: profile?.admittedUniversity || '',
        admittedMajor: profile?.admittedMajor || '',
        admittedCombination: profile?.admittedCombination || profile?.combination || 'A00',
        admittedScore: profile?.admittedScore || '',
        admittedWishNumber: profile?.admittedWishNumber || 'NV1',
        admissionMethod: profile?.admissionMethod || 'Điểm thi THPT Quốc gia',
        officialExamYear: profile?.officialExamYear || new Date().getFullYear().toString(),
        officialExamScores: profile?.officialExamScores || {
            math: '',
            literature: '',
            english: '',
            physics: '',
            chemistry: '',
            biology: '',
            history: '',
            geography: '',
            civicEducation: '',
            informatics: '',
            technology: ''
        }
    });

    // Aspirations (Danh sách nguyện vọng) Modal & Form State
    const [isAspirationModalOpen, setIsAspirationModalOpen] = useState(false);
    const [editingAspirationId, setEditingAspirationId] = useState(null);
    const [aspirationForm, setAspirationForm] = useState({
        order: 1,
        universityCode: '',
        universityName: '',
        majorCode: '',
        majorName: '',
        combination: 'A00',
        benchmarkScore: '',
        status: 'admitted', // 'admitted' | 'passed' | 'failed' | 'pending'
        note: ''
    });

    // Sync form state with profile updates
    useEffect(() => {
        if (profile) {
            setAdmissionForm({
                admittedUniversity: profile.admittedUniversity || '',
                admittedMajor: profile.admittedMajor || '',
                admittedCombination: profile.admittedCombination || profile.combination || 'A00',
                admittedScore: profile.admittedScore || '',
                admittedWishNumber: profile.admittedWishNumber || 'NV1',
                admissionMethod: profile.admissionMethod || 'Điểm thi THPT Quốc gia',
                officialExamYear: profile.officialExamYear || new Date().getFullYear().toString(),
                officialExamScores: profile.officialExamScores || {
                    math: '',
                    literature: '',
                    english: '',
                    physics: '',
                    chemistry: '',
                    biology: '',
                    history: '',
                    geography: '',
                    civicEducation: '',
                    informatics: '',
                    technology: ''
                }
            });
        }
    }, [profile]);

    const handleOpenAddPhase = () => {
        setEditingPhaseId(null);
        setNewPhaseTitle('');
        setNewPhaseTarget('');
        setNewPhaseActivities('');
        setNewPhaseStartDate('');
        setNewPhaseEndDate('');
        setIsPhaseModalOpen(true);
    };

    const handleOpenEditPhase = (phase) => {
        const { start, end } = parseTimelineRange(phase.timeline || '');
        setEditingPhaseId(phase.id);
        setEditingPhaseForm({
            title: getCleanPhaseTitle(phase.title) || phase.title || '',
            target: phase.target || '',
            activities: phase.activities || '',
            startDate: phase.startDate || start,
            endDate: phase.endDate || end
        });
        setIsPhaseModalOpen(true);
    };

    const handleClosePhaseModal = () => {
        setIsPhaseModalOpen(false);
        setEditingPhaseId(null);
    };

    const handleSavePhase = (e) => {
        e.preventDefault();
        if (editingPhaseId) {
            const raw = editingPhaseForm.title.trim();
            if (!raw) return;
            const cleanTitle = getCleanPhaseTitle(raw) || raw;
            const timeline = formatTimelineRange(editingPhaseForm.startDate, editingPhaseForm.endDate);
            const updatedPhases = (profile?.studyPhases || []).map(p => {
                if (p.id === editingPhaseId) {
                    return {
                        ...p,
                        title: cleanTitle,
                        target: editingPhaseForm.target.trim(),
                        activities: editingPhaseForm.activities.trim(),
                        startDate: editingPhaseForm.startDate,
                        endDate: editingPhaseForm.endDate,
                        timeline: timeline
                    };
                }
                return p;
            });
            onUpdateProfile({ ...profile, studyPhases: updatedPhases });
            setIsPhaseModalOpen(false);
            setEditingPhaseId(null);
            showToast?.('Đã cập nhật giai đoạn ôn thi');
        } else {
            const raw = newPhaseTitle.trim();
            if (!raw) return;
            const cleanTitle = getCleanPhaseTitle(raw) || raw;
            const timeline = formatTimelineRange(newPhaseStartDate, newPhaseEndDate);
            const newPhase = {
                id: 'phase_' + Date.now(),
                title: cleanTitle,
                target: newPhaseTarget.trim(),
                activities: newPhaseActivities.trim(),
                startDate: newPhaseStartDate,
                endDate: newPhaseEndDate,
                timeline: timeline,
                status: 'pending'
            };
            const phases = [...(profile?.studyPhases || []), newPhase];
            onUpdateProfile({ ...profile, studyPhases: phases });
            setIsPhaseModalOpen(false);
            setNewPhaseTitle('');
            setNewPhaseTarget('');
            setNewPhaseActivities('');
            setNewPhaseStartDate('');
            setNewPhaseEndDate('');
            showToast?.('Đã thêm giai đoạn ôn thi mới');
        }
    };

    // Active subjects belonging to current chosen combination
    const activeCombo = THPT_COMBINATIONS.find(c => c.value === targetForm.combination);
    const activeComboSubjects = activeCombo?.subjects || [];

    // Helper: calculate total score of the 3 subjects in the combination
    const calculateComboTotal = (combinationCode, subjectTargetsList) => {
        const combo = THPT_COMBINATIONS.find(c => c.value === combinationCode);
        const comboSubjects = combo?.subjects || [];
        if (comboSubjects.length > 0) {
            return comboSubjects.reduce((sum, sId) => {
                const st = subjectTargetsList.find(item => item.subjectId === sId);
                return sum + (Number(st?.target) || 0);
            }, 0);
        }
        return subjectTargetsList.reduce((sum, st) => sum + (Number(st.target) || 0), 0);
    };

    // Keep form state in sync when profile changes
    React.useEffect(() => {
        if (profile) {
            setTargetForm({
                combination: profile.combination || '',
                targetUniversity: profile.targetUniversity || '',
                targetTotalScore: profile.targetTotalScore || '',
                subjectTargets: profile.subjectTargets || []
            });
        }
    }, [profile]);

    // Handle Save Target Form
    const handleSaveTargets = (e) => {
        e.preventDefault();
        const updated = {
            ...profile,
            ...targetForm,
            targetTotalScore: targetForm.targetTotalScore ? Number(targetForm.targetTotalScore) : 0
        };
        onUpdateProfile(updated);
        setIsEditingTargets(false);
        showToast?.('Đã cập nhật mục tiêu ôn thi thành công');
    };

    // Handle Change Combination Dropdown
    const handleCombinationChange = (newCombo) => {
        const total = calculateComboTotal(newCombo, targetForm.subjectTargets);
        setTargetForm(prev => ({
            ...prev,
            combination: newCombo,
            targetTotalScore: total > 0 ? Number(total.toFixed(2)) : (prev.targetTotalScore || '')
        }));
    };

    // Handle Update Subject Target Score & auto-recalculate combo total
    const handleUpdateSubjectTarget = (subjId, score) => {
        const numScore = score === '' ? '' : Number(score);
        const existing = targetForm.subjectTargets.find(st => st.subjectId === subjId);
        let updatedList;
        if (existing) {
            if (score === '') {
                updatedList = targetForm.subjectTargets.filter(st => st.subjectId !== subjId);
            } else {
                updatedList = targetForm.subjectTargets.map(st => st.subjectId === subjId ? { ...st, target: numScore } : st);
            }
        } else if (score !== '') {
            updatedList = [...targetForm.subjectTargets, { subjectId: subjId, target: numScore }];
        } else {
            updatedList = targetForm.subjectTargets;
        }

        const total = calculateComboTotal(targetForm.combination, updatedList);
        setTargetForm(prev => ({
            ...prev,
            subjectTargets: updatedList,
            targetTotalScore: total > 0 ? Number(total.toFixed(2)) : ''
        }));
    };

    // Handle Toggle Phase Status (Mark completed / unmark)
    const handleTogglePhase = (phaseId) => {
        const phases = profile?.studyPhases || [];
        const updatedPhases = phases.map(p => {
            if (p.id === phaseId) {
                const nextStatus = p.status === 'completed' ? 'pending' : 'completed';
                return { ...p, status: nextStatus };
            }
            return p;
        });
        onUpdateProfile({ ...profile, studyPhases: updatedPhases });
        showToast?.('Đã cập nhật tiến độ giai đoạn');
    };

    // Handle Add Phase
    const handleAddPhase = (e) => {
        e.preventDefault();
        const raw = newPhaseTitle.trim();
        if (!raw) return;
        const cleanTitle = getCleanPhaseTitle(raw) || raw;
        const timeline = formatTimelineRange(newPhaseStartDate, newPhaseEndDate);
        const newPhase = {
            id: 'phase_' + Date.now(),
            title: cleanTitle,
            target: newPhaseTarget.trim(),
            activities: newPhaseActivities.trim(),
            startDate: newPhaseStartDate,
            endDate: newPhaseEndDate,
            timeline: timeline,
            status: 'pending'
        };
        const phases = [...(profile?.studyPhases || []), newPhase];
        onUpdateProfile({ ...profile, studyPhases: phases });
        setNewPhaseTitle('');
        setNewPhaseTarget('');
        setNewPhaseActivities('');
        setNewPhaseStartDate('');
        setNewPhaseEndDate('');
        showToast?.('Đã thêm giai đoạn ôn thi mới');
    };

    // Handle Delete Phase
    const handleDeletePhase = (phaseId) => {
        const phases = (profile?.studyPhases || []).filter(p => p.id !== phaseId);
        onUpdateProfile({ ...profile, studyPhases: phases });
        showToast?.('Đã xóa giai đoạn');
    };

    // Mistake Note Handlers
    const handleOpenAddMistake = () => {
        setEditingMistakeId(null);
        setMistakeForm({
            subjectId: subjects[0]?.id || 'math',
            topic: '',
            title: '',
            mistake: '',
            remedy: '',
            category: 'Bẫy đề thi'
        });
        setIsAddMistakeOpen(true);
    };

    const handleOpenEditMistake = (note) => {
        setEditingMistakeId(note.id);
        setMistakeForm({
            subjectId: note.subjectId || subjects[0]?.id || 'math',
            topic: note.topic || '',
            title: note.title || '',
            mistake: note.mistake || '',
            remedy: note.remedy || '',
            category: note.category || 'Bẫy đề thi'
        });
        setIsAddMistakeOpen(true);
    };

    const handleCloseMistakeModal = () => {
        setIsAddMistakeOpen(false);
        setEditingMistakeId(null);
    };

    // Close modals on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isAddMistakeOpen) handleCloseMistakeModal();
                if (isPhaseModalOpen) handleClosePhaseModal();
                if (isAspirationModalOpen) setIsAspirationModalOpen(false);
            }
        };
        if (isAddMistakeOpen || isPhaseModalOpen || isAspirationModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAddMistakeOpen, isPhaseModalOpen, isAspirationModalOpen]);

    // Admission & Aspirations Handlers
    const handleSaveAdmissionInfo = (e) => {
        e.preventDefault();
        onUpdateProfile({
            ...profile,
            ...admissionForm
        });
        setIsEditingAdmission(false);
        showToast?.('Đã lưu kết quả trúng tuyển & điểm thi THPT thành công');
    };

    const handleOfficialScoreChange = (subjId, scoreVal) => {
        const numVal = scoreVal === '' ? '' : Math.min(10, Math.max(0, Number(scoreVal)));
        setAdmissionForm(prev => ({
            ...prev,
            officialExamScores: {
                ...prev.officialExamScores,
                [subjId]: numVal
            }
        }));
    };

    const handleOpenAddAspiration = () => {
        const nextOrder = (profile?.aspirations || []).length + 1;
        setEditingAspirationId(null);
        setAspirationForm({
            order: nextOrder,
            universityCode: '',
            universityName: '',
            majorCode: '',
            majorName: '',
            combination: profile?.combination || 'A00',
            benchmarkScore: '',
            status: nextOrder === 1 ? 'admitted' : 'pending',
            note: ''
        });
        setIsAspirationModalOpen(true);
    };

    const handleOpenEditAspiration = (asp) => {
        setEditingAspirationId(asp.id);
        setAspirationForm({
            ...asp
        });
        setIsAspirationModalOpen(true);
    };

    const handleSaveAspiration = (e) => {
        e.preventDefault();
        if (!aspirationForm.universityName.trim() || !aspirationForm.majorName.trim()) {
            alert('Vui lòng nhập tên trường và ngành xét tuyển.');
            return;
        }

        let updatedAspirations;
        const currentList = profile?.aspirations || [];

        if (editingAspirationId) {
            updatedAspirations = currentList.map(a => 
                a.id === editingAspirationId ? { ...a, ...aspirationForm } : a
            );
        } else {
            const newAsp = {
                id: 'asp_' + Date.now(),
                ...aspirationForm,
                createdAt: new Date().toISOString()
            };
            updatedAspirations = [...currentList, newAsp];
        }

        // If this aspiration is marked as 'admitted', auto-sync with profile admitted fields
        const updatedProfile = {
            ...profile,
            aspirations: updatedAspirations
        };

        if (aspirationForm.status === 'admitted') {
            updatedProfile.admittedUniversity = aspirationForm.universityName;
            updatedProfile.admittedMajor = aspirationForm.majorName;
            updatedProfile.admittedCombination = aspirationForm.combination;
            updatedProfile.admittedScore = aspirationForm.benchmarkScore;
            updatedProfile.admittedWishNumber = `NV${aspirationForm.order}`;
        }

        onUpdateProfile(updatedProfile);
        setIsAspirationModalOpen(false);
        setEditingAspirationId(null);
        showToast?.(editingAspirationId ? 'Đã cập nhật nguyện vọng' : 'Đã thêm nguyện vọng mới');
    };

    const handleDeleteAspiration = (aspId) => {
        if (!window.confirm('Bạn có chắc muốn xóa nguyện vọng này?')) return;
        const currentList = profile?.aspirations || [];
        const filtered = currentList.filter(a => a.id !== aspId);
        // Re-index orders 1, 2, 3...
        const reIndexed = filtered.map((a, idx) => ({ ...a, order: idx + 1 }));
        onUpdateProfile({ ...profile, aspirations: reIndexed });
        showToast?.('Đã xóa nguyện vọng');
    };

    const handleMoveAspiration = (index, direction) => {
        const currentList = [...(profile?.aspirations || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentList.length) return;

        const temp = currentList[index];
        currentList[index] = currentList[targetIndex];
        currentList[targetIndex] = temp;

        const reIndexed = currentList.map((a, idx) => ({ ...a, order: idx + 1 }));
        onUpdateProfile({ ...profile, aspirations: reIndexed });
        showToast?.('Đã cập nhật thứ tự ưu tiên nguyện vọng');
    };

    const handleSetAsAdmitted = (asp) => {
        const currentList = (profile?.aspirations || []).map(a => ({
            ...a,
            status: a.id === asp.id ? 'admitted' : (a.status === 'admitted' ? 'passed' : a.status)
        }));

        onUpdateProfile({
            ...profile,
            aspirations: currentList,
            admittedUniversity: asp.universityName,
            admittedMajor: asp.majorName,
            admittedCombination: asp.combination,
            admittedScore: asp.benchmarkScore,
            admittedWishNumber: `NV${asp.order}`
        });
        showToast?.(`Đã thiết lập ${asp.universityName} là Trường Đại học trúng tuyển`);
    };

    // Insert LaTeX symbol/snippet into mistake or remedy field
    const insertLatexToField = (field, latexSnippet) => {
        setMistakeForm(prev => {
            const currentVal = prev[field] || '';
            const toInsert = `$${latexSnippet}$`;
            return {
                ...prev,
                [field]: currentVal ? `${currentVal} ${toInsert}` : toInsert
            };
        });
    };

    const handleSaveMistakeNote = (e) => {
        e.preventDefault();
        if (!mistakeForm.title.trim() || !mistakeForm.mistake.trim()) {
            alert('Vui lòng nhập tiêu đề và nội dung lỗi sai.');
            return;
        }

        let notes;
        if (editingMistakeId) {
            notes = (profile?.mistakeNotes || []).map(n => 
                n.id === editingMistakeId
                    ? { ...n, ...mistakeForm }
                    : n
            );
            showToast?.('Đã cập nhật ghi chú lỗi sai');
        } else {
            const newNote = {
                id: 'mis_' + Date.now(),
                ...mistakeForm,
                date: new Date().toISOString().split('T')[0]
            };
            notes = [newNote, ...(profile?.mistakeNotes || [])];
            showToast?.('Đã lưu lỗi sai vào Sổ tay Rút kinh nghiệm');
        }

        onUpdateProfile({ ...profile, mistakeNotes: notes });
        setIsAddMistakeOpen(false);
        setEditingMistakeId(null);
        setMistakeForm({
            subjectId: subjects[0]?.id || 'math',
            topic: '',
            title: '',
            mistake: '',
            remedy: '',
            category: 'Bẫy đề thi'
        });
    };

    // Handle Delete Mistake Note
    const handleDeleteMistakeNote = (noteId) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này khỏi sổ tay?')) {
            const notes = (profile?.mistakeNotes || []).filter(n => n.id !== noteId);
            onUpdateProfile({ ...profile, mistakeNotes: notes });
            showToast?.('Đã xóa ghi chú');
        }
    };

    // Filter Mistake Notes
    const filteredMistakeNotes = useMemo(() => {
        const notes = profile?.mistakeNotes || [];
        return notes.filter(n => {
            const matchSubj = mistakeSubjectFilter === 'all' || n.subjectId === mistakeSubjectFilter;
            const matchQuery = !mistakeSearch ||
                n.title.toLowerCase().includes(mistakeSearch.toLowerCase()) ||
                n.mistake.toLowerCase().includes(mistakeSearch.toLowerCase()) ||
                n.topic.toLowerCase().includes(mistakeSearch.toLowerCase()) ||
                n.remedy.toLowerCase().includes(mistakeSearch.toLowerCase());
            return matchSubj && matchQuery;
        });
    }, [profile?.mistakeNotes, mistakeSubjectFilter, mistakeSearch]);

    // Average Score calculation
    const avgScore = results.length > 0
        ? (results.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / results.length).toFixed(1)
        : '0.0';

    const hasTargets = profile?.targetUniversity || profile?.combination || (profile?.targetTotalScore > 0);

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Mục tiêu & Kế hoạch Ôn thi</h2>
                    <p className="text-lg text-gray-600 mt-2">Thiết lập mục tiêu Đại học, lộ trình từng giai đoạn và sổ tay rút kinh nghiệm.</p>
                </div>

                {/* Quick Switch Tab Pill */}
                <div className="flex items-center bg-white border border-brand-cerulean/30 shadow-sm p-1 shrink-0 flex-wrap gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('targets')}
                        className={`px-3 sm:px-4 py-2 font-serif-title text-xs font-bold transition-all ${
                            activeTab === 'targets'
                                ? 'bg-brand-cerulean text-white shadow-sm'
                                : 'text-brand-cerulean hover:text-brand-jasper'
                        }`}
                    >
                        Mục tiêu & Khối thi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('phases')}
                        className={`px-3 sm:px-4 py-2 font-serif-title text-xs font-bold transition-all ${
                            activeTab === 'phases'
                                ? 'bg-brand-cerulean text-white shadow-sm'
                                : 'text-brand-cerulean hover:text-brand-jasper'
                        }`}
                    >
                        Lộ trình Giai đoạn ({(profile?.studyPhases || []).length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('mistakes')}
                        className={`px-3 sm:px-4 py-2 font-serif-title text-xs font-bold transition-all ${
                            activeTab === 'mistakes'
                                ? 'bg-brand-cerulean text-white shadow-sm'
                                : 'text-brand-cerulean hover:text-brand-jasper'
                        }`}
                    >
                        Sổ tay Sửa lỗi ({(profile?.mistakeNotes || []).length})
                    </button>
                </div>
            </div>

            {/* TAB 1: TARGETS & COMBINATIONS */}
            {activeTab === 'targets' && (
                <div className="space-y-6">
                    {/* Dream University & Target Score Card */}
                    <div className="bg-white border border-brand-cerulean/20 shadow-editorial p-6 sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-jasper"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-serif-title font-bold text-xs rounded">
                                        Khối xét tuyển: {profile?.combination ? `Khối ${profile.combination}` : 'Chưa thiết lập'}
                                    </span>
                                    {profile?.grade && (
                                        <span className="px-2.5 py-0.5 bg-brand-jasper/10 text-brand-jasper font-serif-title font-bold text-xs rounded">
                                            Lớp {profile.grade}
                                        </span>
                                    )}
                                </div>
                                <h2 className={`text-2xl sm:text-3xl font-serif-title font-bold ${
                                    profile?.targetUniversity ? 'text-brand-cerulean' : 'text-gray-400 italic'
                                }`}>
                                    {profile?.targetUniversity || 'Chưa thiết lập Trường & Ngành mục tiêu'}
                                </h2>
                                <p className="text-sm font-body text-gray-500 italic">
                                    {hasTargets
                                        ? 'Quyết tâm đạt ngưỡng điểm mục tiêu để trúng tuyển nguyện vọng kỳ thi Tốt nghiệp THPT.'
                                        : 'Hãy nhấn "Chỉnh sửa Mục tiêu & Điểm số" để thiết lập trường, khối thi và điểm kỳ vọng của bạn.'
                                    }
                                </p>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 bg-brand-cream p-4 border border-brand-cerulean/15 rounded">
                                <div className="text-center border-r border-brand-cerulean/20 pr-4">
                                    <span className="text-xs font-serif text-gray-500 block">Tổng mục tiêu (3 môn)</span>
                                    <p className="text-3xl font-serif-title font-bold text-brand-jasper">
                                        {profile?.targetTotalScore ? profile.targetTotalScore : '--'}
                                        {profile?.targetTotalScore ? <span className="text-sm font-normal text-gray-500"> đ</span> : ''}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-serif text-gray-500 block">ĐTB làm đề hiện tại</span>
                                    <p className="text-3xl font-serif-title font-bold text-brand-cerulean">
                                        {avgScore}
                                        <span className="text-sm font-normal text-gray-500"> đ</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-brand-cerulean/10 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsEditingTargets(!isEditingTargets)}
                                className="text-xs font-bold text-brand-cerulean hover:text-brand-jasper flex items-center gap-1.5 underline"
                            >
                                <Edit2 size={13} /> {isEditingTargets ? 'Đóng form chỉnh sửa' : 'Chỉnh sửa Mục tiêu & Điểm số'}
                            </button>
                        </div>

                        {/* Edit Target Form */}
                        {isEditingTargets && (
                            <form onSubmit={handleSaveTargets} className="mt-6 p-5 bg-brand-cream border border-brand-cerulean/20 space-y-5 animate-fade-in-down">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <EditorialSelect
                                            label="Khối thi xét tuyển"
                                            value={targetForm.combination || ''}
                                            onChange={val => handleCombinationChange(val)}
                                            options={THPT_COMBINATIONS.map(c => ({
                                                value: c.value,
                                                label: c.label
                                            }))}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <EditorialUniversitySelect
                                            label="Trường Đại học Mục tiêu (TP.HCM)"
                                            value={targetForm.targetUniversity}
                                            onChange={(univName) => setTargetForm({ ...targetForm, targetUniversity: univName })}
                                            placeholder="Chọn trường Đại học tại TP.HCM..."
                                            size="sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold">
                                                Tổng điểm mục tiêu (3 môn khối)
                                            </label>
                                            {targetForm.combination && (
                                                <span className="text-[10px] bg-brand-jasper/10 text-brand-jasper font-bold px-1.5 py-0.5 rounded border border-brand-jasper/20 flex items-center gap-1">
                                                    <Zap size={10} /> Tự động tính
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="number"
                                            step="0.05"
                                            min="0"
                                            max="30"
                                            value={targetForm.targetTotalScore || ''}
                                            onChange={e => setTargetForm({ ...targetForm, targetTotalScore: e.target.value })}
                                            placeholder="0.0"
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5 font-bold text-brand-jasper bg-white"
                                        />
                                        <p className="text-[10px] text-gray-500 font-sans mt-1">
                                            {activeComboSubjects.length > 0
                                                ? `Tự động cộng tổng điểm của 3 môn thuộc khối ${targetForm.combination}.`
                                                : 'Tự động cập nhật khi bạn nhập điểm các môn thi ở bên dưới.'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Subject-specific Targets */}
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2">
                                        <label className="block text-xs font-serif-title text-brand-cerulean font-bold">
                                            Điểm mục tiêu chi tiết theo từng môn thi:
                                        </label>
                                        <span className="text-[11px] text-gray-600 font-sans italic">
                                            {activeComboSubjects.length > 0 
                                                ? `(3 môn thuộc khối ${targetForm.combination} được làm nổi bật, các môn ngoài khối sẽ mờ đi)`
                                                : '(Chọn khối thi ở trên để tự động làm nổi bật 3 môn xét tuyển)'
                                            }
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {subjects.map(s => {
                                            const isComboSubj = activeComboSubjects.includes(s.id);
                                            const currentTarget = targetForm.subjectTargets.find(st => st.subjectId === s.id)?.target ?? '';
                                            return (
                                                <div
                                                    key={s.id}
                                                    className={`p-3 rounded flex items-center justify-between transition-all ${
                                                        isComboSubj
                                                            ? 'bg-white border-2 border-brand-cerulean shadow-md opacity-100 ring-2 ring-brand-cerulean/15'
                                                            : activeComboSubjects.length > 0
                                                                ? 'bg-gray-50/60 border border-dashed border-gray-300 opacity-40 hover:opacity-100 focus-within:opacity-100 focus-within:bg-white focus-within:border-brand-cerulean focus-within:shadow-sm'
                                                                : 'bg-white border border-brand-cerulean/15 opacity-100'
                                                    }`}
                                                >
                                                    <div className="space-y-0.5 pr-1">
                                                        <span className={`text-xs font-serif-title font-bold block ${isComboSubj ? 'text-brand-cerulean' : 'text-gray-700'}`}>
                                                            {s.name}
                                                        </span>
                                                        {isComboSubj ? (
                                                            <span className="text-[9px] bg-brand-jasper text-white px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider inline-block">
                                                                Môn khối
                                                            </span>
                                                        ) : activeComboSubjects.length > 0 ? (
                                                            <span className="text-[10px] text-gray-400 font-sans italic block">
                                                                Ngoài khối
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={currentTarget}
                                                        onChange={e => handleUpdateSubjectTarget(s.id, e.target.value)}
                                                        placeholder="--"
                                                        className={`w-14 input-editorial text-xs font-body px-1 py-1 text-center font-bold ${
                                                            isComboSubj ? 'text-brand-jasper bg-brand-cream/60' : 'text-gray-700 bg-white'
                                                        }`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingTargets(false)}
                                        className="px-4 py-2 text-xs text-gray-600 hover:text-gray-900"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-brand-cerulean text-white text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                                    >
                                        <Save size={14} /> Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Subject Breakdown Targets Cards */}
                    <div>
                        <h3 className="font-serif-title font-bold text-lg text-brand-cerulean mb-3 flex items-center gap-2">
                            <BookOpen size={18} className="text-brand-jasper" />
                            Chỉ tiêu điểm số từng môn trong khối thi của tôi:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {(profile?.subjectTargets || []).length > 0 ? (
                                profile.subjectTargets.map(st => {
                                    const subj = subjects.find(s => s.id === st.subjectId) || { name: st.subjectId, color: '#124874' };
                                    const comboObj = THPT_COMBINATIONS.find(c => c.value === profile?.combination);
                                    const isComboMember = (comboObj?.subjects || []).includes(st.subjectId);
                                    return (
                                        <div key={st.subjectId} className={`bg-white border p-5 shadow-sm space-y-2 rounded ${isComboMember ? 'border-brand-cerulean/40 ring-1 ring-brand-cerulean/20' : 'border-brand-cerulean/20'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subj.color }} />
                                                    <span className="font-serif-title font-bold text-brand-cerulean text-base">{subj.name}</span>
                                                    {isComboMember && (
                                                        <span className="text-[9px] bg-brand-jasper text-white px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                                                            Khối {profile.combination}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs px-2 py-0.5 bg-brand-cream border border-brand-cerulean/20 font-bold text-brand-jasper">
                                                    Mục tiêu: {st.target} đ
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-cerulean rounded-full"
                                                    style={{ width: `${Math.min(100, (st.target / 10) * 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[11px] text-gray-500 font-body">
                                                <span>0.0</span>
                                                <span>5.0</span>
                                                <span>8.0+</span>
                                                <span>10.0</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="sm:col-span-3 p-8 bg-white border border-brand-cerulean/20 text-center text-gray-500 text-xs">
                                    Chưa có chỉ tiêu môn học cụ thể. Hãy bấm "Chỉnh sửa Mục tiêu & Điểm số" phía trên để thiết lập điểm số cho từng môn.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: STUDY PHASES & ROADMAP */}
            {activeTab === 'phases' && (
                <div className="space-y-6">
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                        <div>
                            <h3 className="font-serif-title font-bold text-base text-brand-cerulean flex items-center gap-2">
                                <Compass size={18} className="text-brand-jasper" />
                                Lộ trình Ôn thi Từng Giai đoạn
                            </h3>
                            <p className="text-xs text-gray-500 font-body mt-0.5">
                                Phân chia thời gian, đặt mục tiêu cụ thể và quản lý nhiệm vụ cho từng mốc nước rút
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenAddPhase}
                            className="px-4 py-2 bg-brand-cerulean text-white text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                            <Plus size={15} /> Thêm giai đoạn mới
                        </button>
                    </div>

                    {/* Phase List Cards */}
                    {(profile?.studyPhases || []).length === 0 ? (
                        <div className="p-12 bg-white border border-brand-cerulean/20 text-center text-gray-400 space-y-3">
                            <Target size={40} className="mx-auto text-gray-300" />
                            <p className="font-serif-title text-base text-gray-600 font-bold">Chưa có giai đoạn ôn thi nào trong lộ trình</p>
                            <p className="text-xs text-gray-500 max-w-md mx-auto">
                                Hãy thiết lập các giai đoạn ôn thi (như Nắm chắc kiến thức SGK, Luyện chuyên đề nâng cao, Luyện đề thi thử...) để theo dõi tiến độ rõ ràng.
                            </p>
                            <button
                                type="button"
                                onClick={handleOpenAddPhase}
                                className="mt-2 px-5 py-2 bg-brand-cerulean text-white text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all inline-flex items-center gap-1.5"
                            >
                                <Plus size={14} /> Thêm giai đoạn đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(profile?.studyPhases || []).map((phase, idx) => {
                                const totalPhases = (profile?.studyPhases || []).length;
                                const phaseLabel = getPhaseLabel(idx, totalPhases);
                                const cleanTitle = getCleanPhaseTitle(phase.title) || phase.title;
                                const statusInfo = getPhaseTimeStatus(phase);
                                const isDone = statusInfo.isDone;
                                const isInProgress = statusInfo.isInProgress;
                                const isOverdue = statusInfo.isOverdue;
                                const isFinalPhase = phaseLabel === 'Giai đoạn cuối';

                                return (
                                    <div
                                        key={phase.id}
                                        className={`p-4 border transition-all space-y-3 rounded-xs ${statusInfo.bgCardClass}`}
                                    >
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleTogglePhase(phase.id)}
                                                    className="transition-transform hover:scale-110 shrink-0 mt-0.5"
                                                    title={isDone ? "Bấm để bỏ đánh dấu hoàn thành" : "Bấm để đánh dấu hoàn thành"}
                                                >
                                                    {isDone ? (
                                                        <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-100" />
                                                    ) : isInProgress ? (
                                                        <Sparkles size={22} className="text-brand-jasper animate-pulse" />
                                                    ) : isOverdue ? (
                                                        <Clock size={22} className="text-amber-600" />
                                                    ) : (
                                                        <Circle size={22} className="text-gray-300" />
                                                    )}
                                                </button>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded font-serif-title ${
                                                            isFinalPhase
                                                                ? 'bg-brand-jasper text-white shadow-xs'
                                                                : 'bg-brand-cerulean/15 text-brand-cerulean'
                                                        }`}>
                                                            {phaseLabel}
                                                        </span>
                                                        <h4 className={`font-serif-title text-sm font-bold truncate ${
                                                            isDone ? 'line-through text-gray-500' : 'text-brand-cerulean'
                                                        }`}>
                                                            {cleanTitle}
                                                        </h4>
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 font-body mt-0.5 flex items-center gap-2 flex-wrap">
                                                        <span>Thời gian: <strong className="text-gray-700">{phase.timeline}</strong></span>
                                                        <span>•</span>
                                                        <span>Trạng thái: <strong className={statusInfo.colorClass}>{statusInfo.label}</strong></span>
                                                        {statusInfo.timeDetail && (
                                                            <span className={`px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                                                                isInProgress ? 'bg-brand-jasper/10 text-brand-jasper' : isOverdue ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {statusInfo.timeDetail}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleTogglePhase(phase.id)}
                                                    className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                                                        isDone
                                                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                            : isInProgress
                                                                ? 'bg-brand-jasper text-white hover:bg-red-700'
                                                                : isOverdue
                                                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                    title={isDone ? "Bấm để bỏ hoàn thành" : "Bấm để đánh dấu đã xong"}
                                                >
                                                    {isDone ? '✓ Đã xong' : isOverdue ? 'Đánh dấu xong' : isInProgress ? 'Đang thực hiện' : 'Bắt đầu'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditPhase(phase)}
                                                    className="p-1 text-gray-400 hover:text-brand-cerulean rounded transition-colors"
                                                    title="Chỉnh sửa nội dung giai đoạn"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhase(phase.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                                    title="Xóa giai đoạn"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content Detail: Mục tiêu & Hoạt động chính */}
                                        {(phase.target || phase.activities) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-brand-cerulean/10 text-xs">
                                                {phase.target && (
                                                    <div className="p-2.5 bg-white/90 border border-brand-cerulean/15 rounded-xs flex items-start gap-2 shadow-xs">
                                                        <Target size={14} className="text-brand-cerulean shrink-0 mt-0.5" />
                                                        <div className="min-w-0">
                                                            <span className="font-bold text-brand-cerulean font-serif-title block text-[11px] uppercase tracking-wider mb-0.5">
                                                                Mục tiêu
                                                            </span>
                                                            <p className="text-gray-700 font-body leading-relaxed whitespace-pre-line">
                                                                {phase.target}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {phase.activities && (
                                                    <div className="p-2.5 bg-white/90 border border-brand-cerulean/15 rounded-xs flex items-start gap-2 shadow-xs">
                                                        <CheckSquare size={14} className="text-brand-cerulean shrink-0 mt-0.5" />
                                                        <div className="min-w-0">
                                                            <span className="font-bold text-brand-cerulean font-serif-title block text-[11px] uppercase tracking-wider mb-0.5">
                                                                Hoạt động chính
                                                            </span>
                                                            <p className="text-gray-700 font-body leading-relaxed whitespace-pre-line">
                                                                {phase.activities}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Add / Edit Phase Modal (Portal to document.body) */}
                    {isPhaseModalOpen && createPortal(
                        <div 
                            className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-brand-cerulean/60 backdrop-blur-sm animate-backdrop-in"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) handleClosePhaseModal();
                            }}
                        >
                            <div 
                                className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="p-4 sm:p-5 bg-brand-cream border-b border-brand-cerulean/20 flex justify-between items-center shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-cerulean/10 border border-brand-cerulean/25 flex items-center justify-center text-brand-cerulean shrink-0">
                                            <Target size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif-title font-bold text-base sm:text-lg text-brand-cerulean leading-tight">
                                                {editingPhaseId ? 'Chỉnh sửa Giai đoạn Ôn thi' : 'Thêm giai đoạn mới vào Lộ trình'}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-body mt-0.5">
                                                {editingPhaseId 
                                                    ? 'Cập nhật thời gian, mục tiêu và danh sách hoạt động chính cho giai đoạn này'
                                                    : `Giai đoạn tiếp theo: Giai đoạn ${(profile?.studyPhases || []).length + 1}`}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClosePhaseModal}
                                        className="p-1.5 text-gray-400 hover:text-brand-jasper rounded-xs hover:bg-brand-cerulean/10 transition-colors"
                                        title="Đóng modal (Esc)"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Body - Form */}
                                <form onSubmit={handleSavePhase} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1 font-bold">
                                                Tên giai đoạn *
                                            </label>
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-3 py-2 bg-brand-cerulean/15 border border-r-0 border-brand-cerulean/30 text-brand-cerulean font-bold text-xs font-serif-title shrink-0 select-none whitespace-nowrap rounded-l-xs">
                                                    {editingPhaseId 
                                                        ? getPhaseLabel((profile?.studyPhases || []).findIndex(p => p.id === editingPhaseId), (profile?.studyPhases || []).length)
                                                        : `Giai đoạn ${(profile?.studyPhases || []).length + 1}`}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={editingPhaseId ? editingPhaseForm.title : newPhaseTitle}
                                                    onChange={e => editingPhaseId 
                                                        ? setEditingPhaseForm({ ...editingPhaseForm, title: e.target.value })
                                                        : setNewPhaseTitle(e.target.value)
                                                    }
                                                    placeholder="Chủ đề (Vd: Nắm chắc toàn bộ kiến thức SGK...)"
                                                    className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-2 rounded-r-xs shadow-xs transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <EditorialDatePicker
                                                label="Từ ngày / thời điểm"
                                                value={editingPhaseId ? editingPhaseForm.startDate : newPhaseStartDate}
                                                onChange={val => editingPhaseId
                                                    ? setEditingPhaseForm({ ...editingPhaseForm, startDate: val })
                                                    : setNewPhaseStartDate(val)
                                                }
                                                placeholder="Ngày bắt đầu..."
                                                isRange={false}
                                            />
                                        </div>
                                        <div className="sm:col-span-1">
                                            <EditorialDatePicker
                                                label="Đến ngày / thời điểm"
                                                value={editingPhaseId ? editingPhaseForm.endDate : newPhaseEndDate}
                                                onChange={val => editingPhaseId
                                                    ? setEditingPhaseForm({ ...editingPhaseForm, endDate: val })
                                                    : setNewPhaseEndDate(val)
                                                }
                                                placeholder="Ngày kết thúc..."
                                                isRange={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1 font-bold flex items-center gap-1.5">
                                                <Target size={14} className="text-brand-cerulean" /> Mục tiêu giai đoạn
                                            </label>
                                            <textarea
                                                value={editingPhaseId ? editingPhaseForm.target : newPhaseTarget}
                                                onChange={e => editingPhaseId
                                                    ? setEditingPhaseForm({ ...editingPhaseForm, target: e.target.value })
                                                    : setNewPhaseTarget(e.target.value)
                                                }
                                                placeholder="Vd: Nắm vững 100% kiến thức nền tảng, giải thành thạo các câu mức 1-2 (dưới 7.5 điểm)..."
                                                rows={3}
                                                className="w-full bg-brand-cream/40 border border-brand-cerulean/25 focus:border-brand-jasper focus:bg-white focus:ring-1 focus:ring-brand-jasper text-xs font-body p-3 rounded-xs resize-none shadow-xs transition-all leading-relaxed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1 font-bold flex items-center gap-1.5">
                                                <CheckSquare size={14} className="text-brand-cerulean" /> Hoạt động chính
                                            </label>
                                            <textarea
                                                value={editingPhaseId ? editingPhaseForm.activities : newPhaseActivities}
                                                onChange={e => editingPhaseId
                                                    ? setEditingPhaseForm({ ...editingPhaseForm, activities: e.target.value })
                                                    : setNewPhaseActivities(e.target.value)
                                                }
                                                placeholder="Vd: Học lý thuyết từng chương, giải bài tập SBT, làm 2 đề kiểm tra mỗi tuần, ghi chú công thức..."
                                                rows={3}
                                                className="w-full bg-brand-cream/40 border border-brand-cerulean/25 focus:border-brand-jasper focus:bg-white focus:ring-1 focus:ring-brand-jasper text-xs font-body p-3 rounded-xs resize-none shadow-xs transition-all leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="flex justify-end items-center gap-3 pt-3 border-t border-brand-cerulean/15">
                                        <button
                                            type="button"
                                            onClick={handleClosePhaseModal}
                                            className="px-4 py-2 text-xs font-serif-title font-bold text-gray-500 hover:text-brand-ink transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                                        >
                                            <Save size={14} /> {editingPhaseId ? 'Lưu thay đổi' : 'Thêm giai đoạn'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            )}

            {/* TAB 3: MISTAKE NOTEBOOK (SỔ TAY LỖI SAI & BẪY ĐỀ THI) */}
            {activeTab === 'mistakes' && (
                <div className="space-y-6">
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                        <div className="flex flex-1 items-center gap-3">
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-3 top-2.5 text-brand-cerulean/60" />
                                <input
                                    type="text"
                                    value={mistakeSearch}
                                    onChange={e => setMistakeSearch(e.target.value)}
                                    placeholder="Tìm lỗi sai theo chuyên đề, từ khóa bẫy..."
                                    className="w-full pl-9 pr-3 py-1.5 input-editorial text-xs font-body"
                                />
                            </div>
                            <div className="w-44 shrink-0">
                                <EditorialSelect
                                    value={mistakeSubjectFilter}
                                    onChange={setMistakeSubjectFilter}
                                    options={[
                                        { value: 'all', label: 'Tất cả môn' },
                                        ...subjects.map(s => ({ value: s.id, label: s.name }))
                                    ]}
                                    size="sm"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenAddMistake}
                            className="px-4 py-2 bg-brand-jasper text-white text-xs font-bold shadow-sm hover:bg-brand-cerulean transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                            <Plus size={14} /> Ghi lại Lỗi sai / Bẫy mới
                        </button>
                    </div>

                    {/* Add / Edit Mistake Modal (Portal to document.body) */}
                    {isAddMistakeOpen && createPortal(
                        <div 
                            className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-brand-cerulean/60 backdrop-blur-sm animate-backdrop-in"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) handleCloseMistakeModal();
                            }}
                        >
                            <div 
                                className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="p-4 sm:p-5 bg-brand-cream border-b border-brand-cerulean/20 flex justify-between items-center shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-jasper/10 border border-brand-jasper/25 flex items-center justify-center text-brand-jasper shrink-0">
                                            <AlertCircle size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif-title font-bold text-base sm:text-lg text-brand-cerulean leading-tight">
                                                {editingMistakeId ? 'Chỉnh sửa Ghi chép Lỗi sai' : 'Ghi chép Lỗi sai vào Sổ tay Rút kinh nghiệm'}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-body mt-0.5">
                                                Lưu lại bẫy đề thi, lỗi kiến thức hổng và kinh nghiệm làm bài để không lặp lại
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCloseMistakeModal}
                                        className="p-1.5 text-gray-400 hover:text-brand-jasper rounded-xs hover:bg-brand-cerulean/10 transition-colors"
                                        title="Đóng modal (Esc)"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Body - Form */}
                                <form onSubmit={handleSaveMistakeNote} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1 font-bold">Môn học</label>
                                            <EditorialSelect
                                                value={mistakeForm.subjectId}
                                                onChange={val => setMistakeForm({ ...mistakeForm, subjectId: val })}
                                                options={subjects.map(s => ({ value: s.id, label: s.name }))}
                                                size="sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1 font-bold">Chuyên đề / Dạng bài</label>
                                            <input
                                                type="text"
                                                value={mistakeForm.topic}
                                                onChange={e => setMistakeForm({ ...mistakeForm, topic: e.target.value })}
                                                placeholder="Vd: Tích phân từng phần, Dao động cơ..."
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1 font-bold">Phân loại lỗi</label>
                                            <EditorialSelect
                                                value={mistakeForm.category}
                                                onChange={val => setMistakeForm({ ...mistakeForm, category: val })}
                                                options={[
                                                    { value: 'Bẫy đề thi', label: 'Bẫy đề thi', icon: AlertTriangle, iconClassName: 'text-amber-500' },
                                                    { value: 'Lỗi kiến thức', label: 'Lỗi kiến thức còn hổng', icon: BookOpen, iconClassName: 'text-brand-cerulean' },
                                                    { value: 'Tính toán ẩu', label: 'Lỗi tính toán ẩu', icon: Calculator, iconClassName: 'text-brand-jasper' },
                                                    { value: 'Kinh nghiệm làm bài', label: 'Kinh nghiệm phân bố giờ', icon: Lightbulb, iconClassName: 'text-amber-600' }
                                                ]}
                                                size="sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1 font-bold">Tiêu đề lỗi sai *</label>
                                        <input
                                            type="text"
                                            value={mistakeForm.title}
                                            onChange={e => setMistakeForm({ ...mistakeForm, title: e.target.value })}
                                            placeholder="Vd: Quên chia hệ số 1/3 trong thể tích khối chóp"
                                            className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-2 font-bold text-brand-cerulean rounded-xs shadow-xs transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-xs font-serif-title text-brand-jasper font-bold flex items-center gap-1.5">
                                                    <AlertCircle size={14} className="text-brand-jasper shrink-0" /> Lỗi tôi đã mắc phải (Tại sao sai?):
                                                </label>
                                                <span className="text-[10px] text-gray-400 font-serif-title">Hỗ trợ LaTeX $...$</span>
                                            </div>

                                            {/* Quick Math Toolbar */}
                                            <div className="flex flex-wrap items-center gap-1 mb-1.5 pb-1 border-b border-brand-jasper/15">
                                                <span className="text-[10px] text-gray-400 font-serif-title mr-0.5">Chèn:</span>
                                                {[
                                                    { label: 'a/b', tex: '\\frac{a}{b}', title: 'Phân số' },
                                                    { label: '√x', tex: '\\sqrt{x}', title: 'Căn bậc 2' },
                                                    { label: 'x²', tex: 'x^2', title: 'Số mũ' },
                                                    { label: 'Δ', tex: '\\Delta', title: 'Delta' },
                                                    { label: '→u', tex: '\\vec{u}', title: 'Vectơ' },
                                                    { label: '∫', tex: '\\int', title: 'Tích phân' },
                                                    { label: 'π', tex: '\\pi', title: 'Số Pi' },
                                                    { label: '±', tex: '\\pm', title: 'Cộng trừ' },
                                                    { label: '≤', tex: '\\le', title: 'Nhỏ hơn hoặc bằng' },
                                                    { label: '≥', tex: '\\ge', title: 'Lớn hơn hoặc bằng' },
                                                ].map(sym => (
                                                    <button
                                                        key={sym.label}
                                                        type="button"
                                                        onClick={() => insertLatexToField('mistake', sym.tex)}
                                                        className="px-1.5 py-0.5 text-[10px] font-serif bg-white hover:bg-brand-jasper/10 text-brand-jasper border border-brand-jasper/25 rounded-xs transition-colors"
                                                        title={sym.title}
                                                    >
                                                        {sym.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                rows={3}
                                                value={mistakeForm.mistake}
                                                onChange={e => setMistakeForm({ ...mistakeForm, mistake: e.target.value })}
                                                placeholder="Vd: Quên công thức thể tích $V = \frac{1}{3}Bh$, tính nhầm $\Delta = b^2 - 4ac < 0$..."
                                                className="w-full bg-red-50/40 border border-brand-jasper/30 focus:border-brand-jasper focus:bg-white focus:ring-1 focus:ring-brand-jasper text-xs font-body p-2.5 rounded-xs resize-none shadow-xs transition-all leading-relaxed"
                                                required
                                            />

                                            {/* Live LaTeX Preview */}
                                            {mistakeForm.mistake && (
                                                <div className="mt-1.5 p-2 bg-white/90 border border-dashed border-brand-jasper/30 rounded-xs text-xs">
                                                    <span className="text-[10px] font-serif-title font-bold text-brand-jasper block mb-0.5 uppercase tracking-wider">
                                                        Xem trước công thức:
                                                    </span>
                                                    <div className="text-gray-800 font-body leading-relaxed break-words">
                                                        <MathText text={mistakeForm.mistake} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-xs font-serif-title text-emerald-800 font-bold flex items-center gap-1.5">
                                                    <CheckCircle2 size={14} className="text-emerald-700 shrink-0" /> Cách khắc phục & Ghi nhớ lần sau:
                                                </label>
                                                <span className="text-[10px] text-gray-400 font-serif-title">Hỗ trợ LaTeX $...$</span>
                                            </div>

                                            {/* Quick Math Toolbar */}
                                            <div className="flex flex-wrap items-center gap-1 mb-1.5 pb-1 border-b border-emerald-600/15">
                                                <span className="text-[10px] text-gray-400 font-serif-title mr-0.5">Chèn:</span>
                                                {[
                                                    { label: 'a/b', tex: '\\frac{a}{b}', title: 'Phân số' },
                                                    { label: '√x', tex: '\\sqrt{x}', title: 'Căn bậc 2' },
                                                    { label: 'x²', tex: 'x^2', title: 'Số mũ' },
                                                    { label: 'Δ', tex: '\\Delta', title: 'Delta' },
                                                    { label: '→u', tex: '\\vec{u}', title: 'Vectơ' },
                                                    { label: '∫', tex: '\\int', title: 'Tích phân' },
                                                    { label: 'π', tex: '\\pi', title: 'Số Pi' },
                                                    { label: '±', tex: '\\pm', title: 'Cộng trừ' },
                                                    { label: '≤', tex: '\\le', title: 'Nhỏ hơn hoặc bằng' },
                                                    { label: '≥', tex: '\\ge', title: 'Lớn hơn hoặc bằng' },
                                                ].map(sym => (
                                                    <button
                                                        key={sym.label}
                                                        type="button"
                                                        onClick={() => insertLatexToField('remedy', sym.tex)}
                                                        className="px-1.5 py-0.5 text-[10px] font-serif bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-600/25 rounded-xs transition-colors"
                                                        title={sym.title}
                                                    >
                                                        {sym.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                rows={3}
                                                value={mistakeForm.remedy}
                                                onChange={e => setMistakeForm({ ...mistakeForm, remedy: e.target.value })}
                                                placeholder="Vd: Nhớ nhân $\frac{1}{3}$ khi tính chóp, kiểm tra điều kiện $a > 0$ và $\Delta > 0$..."
                                                className="w-full bg-emerald-50/40 border border-emerald-600/30 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 text-xs font-body p-2.5 rounded-xs resize-none shadow-xs transition-all leading-relaxed"
                                            />

                                            {/* Live LaTeX Preview */}
                                            {mistakeForm.remedy && (
                                                <div className="mt-1.5 p-2 bg-white/90 border border-dashed border-emerald-600/30 rounded-xs text-xs">
                                                    <span className="text-[10px] font-serif-title font-bold text-emerald-800 block mb-0.5 uppercase tracking-wider">
                                                        Xem trước công thức:
                                                    </span>
                                                    <div className="text-gray-800 font-body leading-relaxed break-words">
                                                        <MathText text={mistakeForm.remedy} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="flex justify-end items-center gap-3 pt-3 border-t border-brand-cerulean/15">
                                        <button
                                            type="button"
                                            onClick={handleCloseMistakeModal}
                                            className="px-4 py-2 text-xs font-serif-title font-bold text-gray-500 hover:text-brand-ink transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-brand-jasper text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-cerulean transition-all flex items-center gap-1.5"
                                        >
                                            <Save size={14} /> {editingMistakeId ? 'Lưu thay đổi' : 'Lưu vào Sổ tay'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Mistake Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredMistakeNotes.length === 0 ? (
                            <div className="sm:col-span-2 p-12 bg-white border border-brand-cerulean/20 text-center text-gray-400 space-y-2">
                                <BookOpen size={36} className="mx-auto text-gray-300" />
                                <p className="font-serif-title text-sm text-gray-500">Sổ tay lỗi sai đang trống</p>
                                <p className="text-xs">Mỗi khi làm đề gặp câu sai hoặc bẫy, hãy nhấn "Ghi lại Lỗi sai / Bẫy mới" để tự tích lũy kinh nghiệm.</p>
                            </div>
                        ) : (
                            filteredMistakeNotes.map((note) => {
                                const subj = subjects.find(s => s.id === note.subjectId) || { name: note.subjectId, color: '#124874' };
                                return (
                                    <div
                                        key={note.id}
                                        className="bg-white border border-brand-cerulean/20 shadow-sm p-5 space-y-3 relative group hover:border-brand-jasper transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="text-[10px] px-2 py-0.5 text-white rounded font-bold"
                                                    style={{ backgroundColor: subj.color }}
                                                >
                                                    {subj.name}
                                                </span>
                                                <span className="text-[11px] font-serif-title text-gray-500 font-bold">
                                                    {note.topic}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] px-2 py-0.5 bg-brand-cream border border-brand-cerulean/15 text-brand-jasper font-bold rounded">
                                                    {note.category}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditMistake(note)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-brand-cerulean transition-opacity rounded"
                                                    title="Chỉnh sửa ghi chú"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteMistakeNote(note.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity rounded"
                                                    title="Xóa ghi chú"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                            <MathText text={note.title} />
                                        </h4>

                                        <div className="p-3 bg-red-50/70 border-l-2 border-brand-jasper rounded-r text-xs space-y-1">
                                            <span className="font-bold text-brand-jasper block text-[11px]">Lỗi đã gặp:</span>
                                            <div className="text-gray-700 font-body leading-relaxed">
                                                <MathText text={note.mistake} />
                                            </div>
                                        </div>

                                        {note.remedy && (
                                            <div className="p-3 bg-emerald-50/70 border-l-2 border-emerald-600 rounded-r text-xs space-y-1">
                                                <span className="font-bold text-emerald-800 block text-[11px]">Cách khắc phục:</span>
                                                <div className="text-gray-700 font-body leading-relaxed">
                                                    <MathText text={note.remedy} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-[10px] text-gray-400 text-right pt-1">
                                            Ghi nhận ngày: {note.date}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* TAB 4: OFFICIAL THPT EXAM SCORES, ADMITTED UNIVERSITY & REGISTERED ASPIRATIONS */}
            {activeTab === 'admission' && (
                <div className="space-y-8 animate-fade-in-up">
                    {/* SECTION 1: UNIVERSITY ADMISSION HONOR CARD */}
                    <div className="bg-white border-2 border-brand-cerulean/30 shadow-editorial relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-cerulean via-brand-jasper to-amber-500"></div>

                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/15">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-sm shrink-0">
                                        <GraduationCap size={26} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-jasper text-white rounded font-sans uppercase tracking-wider">
                                                Kết quả Trúng tuyển
                                            </span>
                                            {profile?.admittedWishNumber && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-serif-title">
                                                    {profile.admittedWishNumber}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-serif-title font-bold text-2xl text-brand-cerulean mt-1">
                                            {profile?.admittedUniversity || 'Chưa cập nhật Trường Đại học trúng tuyển'}
                                        </h3>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsEditingAdmission(!isEditingAdmission)}
                                    className="px-4 py-2 bg-brand-cerulean text-white text-xs font-bold font-serif-title shadow-sm hover:bg-brand-jasper transition-all flex items-center gap-1.5 shrink-0"
                                >
                                    <Edit2 size={14} /> {isEditingAdmission ? 'Đóng chỉnh sửa' : 'Chỉnh sửa Thông tin Đậu'}
                                </button>
                            </div>

                            {/* Details View */}
                            {!isEditingAdmission ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                        <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Ngành trúng tuyển</span>
                                        <p className="font-serif-title font-bold text-brand-cerulean text-base">
                                            {profile?.admittedMajor || 'Chưa cập nhật'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                        <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Khối xét tuyển</span>
                                        <p className="font-serif-title font-bold text-brand-jasper text-base">
                                            {profile?.admittedCombination ? `Khối ${profile.admittedCombination}` : 'Chưa cập nhật'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                        <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Điểm chuẩn / Điểm đậu</span>
                                        <p className="font-serif-title font-bold text-emerald-700 text-base">
                                            {profile?.admittedScore ? `${profile.admittedScore} điểm` : 'Chưa cập nhật'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                        <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Phương thức xét tuyển</span>
                                        <p className="font-serif-title font-bold text-gray-700 text-xs">
                                            {profile?.admissionMethod || 'Điểm thi THPT Quốc gia'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Admission Edit Form */
                                <form onSubmit={handleSaveAdmissionInfo} className="p-5 bg-brand-cream/60 border border-brand-cerulean/25 rounded-xs space-y-4 animate-fade-in">
                                    <h4 className="font-serif-title font-bold text-sm text-brand-cerulean pb-2 border-b border-brand-cerulean/15">
                                        Cập nhật Thông tin Trường & Ngành đã trúng tuyển
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Tên trường Đại học đã trúng tuyển *
                                            </label>
                                            <input
                                                type="text"
                                                value={admissionForm.admittedUniversity}
                                                onChange={e => setAdmissionForm({ ...admissionForm, admittedUniversity: e.target.value })}
                                                placeholder="Vd: Đại học Bách Khoa TP.HCM (HCMUT)"
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-2 rounded-xs shadow-xs"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Ngành / Chuyên ngành trúng tuyển *
                                            </label>
                                            <input
                                                type="text"
                                                value={admissionForm.admittedMajor}
                                                onChange={e => setAdmissionForm({ ...admissionForm, admittedMajor: e.target.value })}
                                                placeholder="Vd: Khoa học Máy tính (Chương trình Tiên tiến)"
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-2 rounded-xs shadow-xs"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Khối xét tuyển
                                            </label>
                                            <EditorialSelect
                                                value={admissionForm.admittedCombination}
                                                onChange={val => setAdmissionForm({ ...admissionForm, admittedCombination: val })}
                                                options={THPT_COMBINATIONS.filter(c => c.value)}
                                                size="sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Điểm trúng tuyển
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="30"
                                                value={admissionForm.admittedScore}
                                                onChange={e => setAdmissionForm({ ...admissionForm, admittedScore: e.target.value })}
                                                placeholder="Vd: 28.65"
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Trúng tuyển theo Nguyện vọng
                                            </label>
                                            <input
                                                type="text"
                                                value={admissionForm.admittedWishNumber}
                                                onChange={e => setAdmissionForm({ ...admissionForm, admittedWishNumber: e.target.value })}
                                                placeholder="Vd: NV1, NV2..."
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Phương thức xét tuyển
                                            </label>
                                            <input
                                                type="text"
                                                value={admissionForm.admissionMethod}
                                                onChange={e => setAdmissionForm({ ...admissionForm, admissionMethod: e.target.value })}
                                                placeholder="Vd: Điểm thi THPT, ĐGNL..."
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t border-brand-cerulean/15">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingAdmission(false)}
                                            className="px-4 py-2 text-xs font-serif-title font-bold text-gray-500 hover:text-brand-ink"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                                        >
                                            <Save size={14} /> Lưu kết quả trúng tuyển
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: OFFICIAL THPT EXAM SCORES GRID */}
                    <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-brand-cerulean/15 gap-3">
                            <div>
                                <h3 className="font-serif-title font-bold text-xl text-brand-cerulean flex items-center gap-2">
                                    <Award size={20} className="text-brand-jasper" />
                                    Bảng Điểm thi Tốt nghiệp THPT Quốc gia Chính thức
                                </h3>
                                <p className="text-xs text-gray-500 font-body mt-0.5">
                                    Nhập điểm số chính thức bạn đã đạt được trong kỳ thi Tốt nghiệp THPT để lưu trữ và tính tổng điểm các khối
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-serif-title font-bold text-brand-cerulean">Năm thi:</span>
                                <input
                                    type="number"
                                    value={admissionForm.officialExamYear}
                                    onChange={e => setAdmissionForm({ ...admissionForm, officialExamYear: e.target.value })}
                                    className="w-24 bg-white border border-brand-cerulean/30 px-2 py-1 text-xs font-bold text-brand-cerulean font-serif-title rounded-xs"
                                    placeholder="2025"
                                />
                            </div>
                        </div>

                        {/* Subject Score Inputs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {OFFICIAL_THPT_SUBJECTS.map(subj => {
                                const currentScore = admissionForm.officialExamScores?.[subj.id] ?? '';
                                return (
                                    <div
                                        key={subj.id}
                                        className="p-3 bg-brand-cream/40 border border-brand-cerulean/20 rounded-xs space-y-1.5 hover:border-brand-cerulean transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-[10px] font-bold text-white px-2 py-0.5 rounded"
                                                style={{ backgroundColor: subj.color }}
                                            >
                                                {subj.name}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.05"
                                                min="0"
                                                max="10"
                                                value={currentScore}
                                                onChange={e => handleOfficialScoreChange(subj.id, e.target.value)}
                                                placeholder="--.-"
                                                className="w-full text-center bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper font-serif-title font-bold text-base text-brand-cerulean py-1 rounded-xs shadow-xs"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Computed Combination Scores from Official Input */}
                        <div className="p-4 bg-brand-cream border border-brand-cerulean/25 rounded-xs space-y-2">
                            <span className="text-xs font-serif-title font-bold text-brand-cerulean block uppercase tracking-wider">
                                Tổng điểm theo các Khối xét tuyển chính:
                            </span>
                            <div className="flex flex-wrap gap-2.5">
                                {['A00', 'A01', 'B00', 'C00', 'D01', 'D07'].map(comboCode => {
                                    const total = calculateOfficialComboScore(comboCode, admissionForm.officialExamScores);
                                    const isTargetCombo = profile?.combination === comboCode;
                                    return (
                                        <div
                                            key={comboCode}
                                            className={`px-3 py-1.5 rounded-xs border text-xs flex items-center gap-2 ${
                                                isTargetCombo
                                                    ? 'bg-brand-cerulean text-white border-brand-cerulean font-bold shadow-xs'
                                                    : 'bg-white text-gray-700 border-brand-cerulean/20 font-serif'
                                            }`}
                                        >
                                            <span className="font-serif-title font-bold">Khối {comboCode}:</span>
                                            <span className="font-bold text-sm">
                                                {total !== null ? `${total} đ` : '---'}
                                            </span>
                                            {isTargetCombo && (
                                                <span className="text-[9px] bg-brand-jasper text-white px-1 rounded uppercase font-sans font-bold">
                                                    Khối của bạn
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSaveAdmissionInfo}
                                className="px-5 py-2.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                            >
                                <Save size={14} /> Lưu Bảng Điểm Thi THPT
                            </button>
                        </div>
                    </div>

                    {/* SECTION 3: REGISTERED ASPIRATIONS LIST (DANH SÁCH NGUYỆN VỌNG) */}
                    <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-brand-cerulean/15 gap-3">
                            <div>
                                <h3 className="font-serif-title font-bold text-xl text-brand-cerulean flex items-center gap-2">
                                    <Building2 size={20} className="text-brand-jasper" />
                                    Danh sách Nguyện vọng Đã Đăng ký Thời Điểm Đó
                                </h3>
                                <p className="text-xs text-gray-500 font-body mt-0.5">
                                    Lưu giữ toàn bộ thứ tự nguyện vọng xét tuyển (NV1, NV2, NV3...) cùng kết quả đỗ / trượt
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleOpenAddAspiration}
                                className="px-4 py-2 bg-brand-jasper text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-cerulean transition-all flex items-center gap-1.5 shrink-0"
                            >
                                <Plus size={15} /> Thêm nguyện vọng mới
                            </button>
                        </div>

                        {/* Aspirations Cards / Table */}
                        {(profile?.aspirations || []).length === 0 ? (
                            <div className="p-12 text-center text-gray-400 space-y-3 bg-brand-cream/30 border border-dashed border-brand-cerulean/20 rounded-xs">
                                <Building2 size={36} className="mx-auto text-gray-300" />
                                <p className="font-serif-title text-base text-gray-600 font-bold">Chưa có nguyện vọng nào được ghi nhận</p>
                                <p className="text-xs text-gray-500 max-w-md mx-auto">
                                    Hãy nhấn nút "Thêm nguyện vọng mới" để lưu danh sách nguyện vọng xét tuyển Đại học thời điểm đó của bạn.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleOpenAddAspiration}
                                    className="mt-2 px-5 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all inline-flex items-center gap-1.5"
                                >
                                    <Plus size={14} /> Thêm nguyện vọng đầu tiên
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(profile?.aspirations || []).map((asp, idx) => {
                                    const isAdmitted = asp.status === 'admitted';
                                    const isPassed = asp.status === 'passed';
                                    const isFailed = asp.status === 'failed';

                                    return (
                                        <div
                                            key={asp.id}
                                            className={`p-4 border rounded-xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                                                isAdmitted
                                                    ? 'bg-emerald-50/80 border-emerald-400 shadow-sm ring-1 ring-emerald-300'
                                                    : isPassed
                                                        ? 'bg-blue-50/60 border-blue-300'
                                                        : isFailed
                                                            ? 'bg-gray-50 border-gray-200 opacity-80'
                                                            : 'bg-white border-brand-cerulean/20 shadow-xs'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3 min-w-0">
                                                {/* Wish Order Badge */}
                                                <div className={`w-11 h-11 rounded-full flex flex-col items-center justify-center font-serif-title font-bold text-xs shrink-0 shadow-xs ${
                                                    isAdmitted
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-brand-cerulean/15 text-brand-cerulean border border-brand-cerulean/25'
                                                }`}>
                                                    <span className="text-[9px] uppercase leading-none">NV</span>
                                                    <span className="text-sm leading-none font-bold">{asp.order || idx + 1}</span>
                                                </div>

                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm sm:text-base truncate">
                                                            {asp.universityName} {asp.universityCode && `(${asp.universityCode})`}
                                                        </h4>
                                                        {isAdmitted && (
                                                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded font-sans uppercase tracking-wider flex items-center gap-1">
                                                                <Check size={11} /> Đã trúng tuyển
                                                            </span>
                                                        )}
                                                        {isPassed && (
                                                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded font-sans uppercase">
                                                                Đủ điểm chuẩn
                                                            </span>
                                                        )}
                                                        {isFailed && (
                                                            <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded font-sans">
                                                                Không đủ điểm
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="text-xs text-gray-600 font-body flex items-center gap-3 flex-wrap">
                                                        <span>Ngành: <strong className="text-brand-cerulean">{asp.majorName}</strong> {asp.majorCode && `(Mã: ${asp.majorCode})`}</span>
                                                        <span>•</span>
                                                        <span>Khối: <strong className="text-brand-jasper">Khối {asp.combination}</strong></span>
                                                        {asp.benchmarkScore && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Điểm chuẩn: <strong className="text-emerald-700">{asp.benchmarkScore} đ</strong></span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {asp.note && (
                                                        <p className="text-[11px] text-gray-500 italic font-body">
                                                            Ghi chú: {asp.note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                                {!isAdmitted && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetAsAdmitted(asp)}
                                                        className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors"
                                                        title="Chọn nguyện vọng này làm trường trúng tuyển chính thức"
                                                    >
                                                        Chọn làm trường đỗ
                                                    </button>
                                                )}

                                                {/* Re-order buttons */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveAspiration(idx, 'up')}
                                                    disabled={idx === 0}
                                                    className="p-1 text-gray-400 hover:text-brand-cerulean disabled:opacity-30 rounded"
                                                    title="Tăng thứ tự ưu tiên (Lên trên)"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveAspiration(idx, 'down')}
                                                    disabled={idx === (profile?.aspirations || []).length - 1}
                                                    className="p-1 text-gray-400 hover:text-brand-cerulean disabled:opacity-30 rounded"
                                                    title="Giảm thứ tự ưu tiên (Xuống dưới)"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditAspiration(asp)}
                                                    className="p-1 text-gray-400 hover:text-brand-cerulean rounded"
                                                    title="Chỉnh sửa nguyện vọng"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAspiration(asp.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                    title="Xóa nguyện vọng"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* MODAL: ADD / EDIT ASPIRATION (Portal to document.body) */}
                    {isAspirationModalOpen && createPortal(
                        <div 
                            className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-brand-cerulean/60 backdrop-blur-sm animate-backdrop-in"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) setIsAspirationModalOpen(false);
                            }}
                        >
                            <div 
                                className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="p-4 sm:p-5 bg-brand-cream border-b border-brand-cerulean/20 flex justify-between items-center shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-jasper/10 border border-brand-jasper/25 flex items-center justify-center text-brand-jasper shrink-0">
                                            <Building2 size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif-title font-bold text-base sm:text-lg text-brand-cerulean leading-tight">
                                                {editingAspirationId ? 'Chỉnh sửa Nguyện vọng' : 'Thêm Nguyện vọng Xét tuyển Mới'}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-body mt-0.5">
                                                Thứ tự ưu tiên: <strong>Nguyện vọng {aspirationForm.order} (NV{aspirationForm.order})</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsAspirationModalOpen(false)}
                                        className="p-1.5 text-gray-400 hover:text-brand-jasper rounded-xs hover:bg-brand-cerulean/10 transition-colors"
                                        title="Đóng modal (Esc)"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Form */}
                                <form onSubmit={handleSaveAspiration} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Thứ tự NV *
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={aspirationForm.order}
                                                onChange={e => setAspirationForm({ ...aspirationForm, order: Number(e.target.value) || 1 })}
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-bold text-center py-2 rounded-xs shadow-xs"
                                                required
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Tên trường Đại học *
                                            </label>
                                            <input
                                                type="text"
                                                value={aspirationForm.universityName}
                                                onChange={e => setAspirationForm({ ...aspirationForm, universityName: e.target.value })}
                                                placeholder="Vd: Đại học Bách Khoa - ĐHQG TP.HCM"
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-2 rounded-xs shadow-xs"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Mã trường
                                            </label>
                                            <input
                                                type="text"
                                                value={aspirationForm.universityCode}
                                                onChange={e => setAspirationForm({ ...aspirationForm, universityCode: e.target.value.toUpperCase() })}
                                                placeholder="Vd: QSB, BKA..."
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-1.5 uppercase rounded-xs shadow-xs"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Tên Ngành xét tuyển *
                                            </label>
                                            <input
                                                type="text"
                                                value={aspirationForm.majorName}
                                                onChange={e => setAspirationForm({ ...aspirationForm, majorName: e.target.value })}
                                                placeholder="Vd: Khoa học Máy tính"
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Khối thi
                                            </label>
                                            <EditorialSelect
                                                value={aspirationForm.combination}
                                                onChange={val => setAspirationForm({ ...aspirationForm, combination: val })}
                                                options={THPT_COMBINATIONS.filter(c => c.value)}
                                                size="sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Điểm chuẩn năm đó
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="30"
                                                value={aspirationForm.benchmarkScore}
                                                onChange={e => setAspirationForm({ ...aspirationForm, benchmarkScore: e.target.value })}
                                                placeholder="Vd: 28.05"
                                                className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                                Trạng thái
                                            </label>
                                            <EditorialSelect
                                                value={aspirationForm.status}
                                                onChange={val => setAspirationForm({ ...aspirationForm, status: val })}
                                                options={[
                                                    { value: 'admitted', label: 'Đã trúng tuyển (Đã đỗ)' },
                                                    { value: 'passed', label: 'Đủ điểm chuẩn' },
                                                    { value: 'failed', label: 'Không đủ điểm / Trượt' },
                                                    { value: 'pending', label: 'Chưa xét / Đang chờ' }
                                                ]}
                                                size="sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                            Ghi chú thêm
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={aspirationForm.note}
                                            onChange={e => setAspirationForm({ ...aspirationForm, note: e.target.value })}
                                            placeholder="Chương trình đào tạo, học phí, học bổng..."
                                            className="w-full bg-brand-cream/30 border border-brand-cerulean/25 focus:border-brand-jasper focus:bg-white text-xs font-body p-2.5 rounded-xs resize-none shadow-xs"
                                        />
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="flex justify-end gap-3 pt-3 border-t border-brand-cerulean/15">
                                        <button
                                            type="button"
                                            onClick={() => setIsAspirationModalOpen(false)}
                                            className="px-4 py-2 text-xs font-serif-title font-bold text-gray-500 hover:text-brand-ink"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                                        >
                                            <Save size={14} /> {editingAspirationId ? 'Lưu thay đổi' : 'Thêm nguyện vọng'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            )}
        </div>
    );
};

export default ThptPersonalGoalView;
