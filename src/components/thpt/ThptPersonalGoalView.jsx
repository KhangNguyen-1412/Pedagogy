import React, { useState, useMemo } from 'react';
import {
    Target, Award, BookOpen, Sparkles, CheckCircle2, Circle, Clock,
    Plus, Trash2, Edit2, AlertCircle, Save, Filter, Search, GraduationCap
} from 'lucide-react';
import { EditorialSelect } from './EditorialSelect';

export const ThptPersonalGoalView = ({
    profile,
    subjects = [],
    results = [],
    onUpdateProfile,
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
    const [mistakeForm, setMistakeForm] = useState({
        subjectId: subjects[0]?.id || 'math',
        topic: '',
        title: '',
        mistake: '',
        remedy: '',
        category: 'Bẫy đề thi'
    });

    // Study Phase Add State
    const [newPhaseTitle, setNewPhaseTitle] = useState('');
    const [newPhaseTimeline, setNewPhaseTimeline] = useState('');

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

    // Handle Update Subject Target Score
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
        setTargetForm({ ...targetForm, subjectTargets: updatedList });
    };

    // Handle Toggle Phase Status
    const handleTogglePhase = (phaseId) => {
        const phases = profile?.studyPhases || [];
        const updatedPhases = phases.map(p => {
            if (p.id === phaseId) {
                const nextStatus = p.status === 'completed' ? 'in_progress' : p.status === 'in_progress' ? 'pending' : 'completed';
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
        if (!newPhaseTitle.trim()) return;
        const newPhase = {
            id: 'phase_' + Date.now(),
            title: newPhaseTitle.trim(),
            timeline: newPhaseTimeline.trim() || 'Tự do',
            status: 'pending'
        };
        const phases = [...(profile?.studyPhases || []), newPhase];
        onUpdateProfile({ ...profile, studyPhases: phases });
        setNewPhaseTitle('');
        setNewPhaseTimeline('');
        showToast?.('Đã thêm giai đoạn ôn thi mới');
    };

    // Handle Delete Phase
    const handleDeletePhase = (phaseId) => {
        const phases = (profile?.studyPhases || []).filter(p => p.id !== phaseId);
        onUpdateProfile({ ...profile, studyPhases: phases });
        showToast?.('Đã xóa giai đoạn');
    };

    // Handle Add Mistake Note
    const handleSaveMistakeNote = (e) => {
        e.preventDefault();
        if (!mistakeForm.title.trim() || !mistakeForm.mistake.trim()) {
            alert('Vui lòng nhập tiêu đề và nội dung lỗi sai.');
            return;
        }

        const newNote = {
            id: 'mis_' + Date.now(),
            ...mistakeForm,
            date: new Date().toISOString().split('T')[0]
        };

        const notes = [newNote, ...(profile?.mistakeNotes || [])];
        onUpdateProfile({ ...profile, mistakeNotes: notes });
        setIsAddMistakeOpen(false);
        setMistakeForm({
            subjectId: subjects[0]?.id || 'math',
            topic: '',
            title: '',
            mistake: '',
            remedy: '',
            category: 'Bẫy đề thi'
        });
        showToast?.('Đã lưu lỗi sai vào Sổ tay Rút kinh nghiệm');
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
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-brand-cerulean/20 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-jasper font-bold mb-1">
                        <GraduationCap size={14} /> Cá nhân hóa Kế hoạch Ôn thi THPT
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean tracking-tight">
                        Mục tiêu & Kế hoạch Ôn thi của Tôi
                    </h1>
                    <p className="text-sm italic text-gray-600 font-body mt-1">
                        Thiết lập mục tiêu Đại học, lộ trình từng giai đoạn và sổ tay rút kinh nghiệm tránh bẫy đề thi
                    </p>
                </div>

                {/* Quick Switch Tab Pill */}
                <div className="flex items-center bg-white border border-brand-cerulean/20 shadow-sm p-1 rounded">
                    <button
                        type="button"
                        onClick={() => setActiveTab('targets')}
                        className={`px-3 py-1.5 font-serif-title text-xs font-bold transition-all rounded ${
                            activeTab === 'targets'
                                ? 'bg-brand-cerulean text-white shadow-sm'
                                : 'text-brand-cerulean/80 hover:text-brand-jasper'
                        }`}
                    >
                        Mục tiêu & Khối thi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('phases')}
                        className={`px-3 py-1.5 font-serif-title text-xs font-bold transition-all rounded ${
                            activeTab === 'phases'
                                ? 'bg-brand-cerulean text-white shadow-sm'
                                : 'text-brand-cerulean/80 hover:text-brand-jasper'
                        }`}
                    >
                        Lộ trình Giai đoạn ({(profile?.studyPhases || []).length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('mistakes')}
                        className={`px-3 py-1.5 font-serif-title text-xs font-bold transition-all rounded ${
                            activeTab === 'mistakes'
                                ? 'bg-brand-cerulean text-white shadow-sm'
                                : 'text-brand-cerulean/80 hover:text-brand-jasper'
                        }`}
                    >
                        Sổ tay Sửa lỗi sai ({(profile?.mistakeNotes || []).length})
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
                                        Khối xét tuyển: {profile?.combination || 'Chưa thiết lập'}
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
                                    <span className="text-xs font-serif text-gray-500 block">Tổng mục tiêu</span>
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
                                        <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                            Khối thi xét tuyển
                                        </label>
                                        <input
                                            type="text"
                                            value={targetForm.combination}
                                            onChange={e => setTargetForm({ ...targetForm, combination: e.target.value })}
                                            placeholder="Vd: A00 (Toán, Lí, Hóa), D01..."
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                            Trường & Ngành Đại học Mục tiêu
                                        </label>
                                        <input
                                            type="text"
                                            value={targetForm.targetUniversity}
                                            onChange={e => setTargetForm({ ...targetForm, targetUniversity: e.target.value })}
                                            placeholder="Vd: Đại học Bách Khoa - Ngành Khoa học Máy tính"
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                            Tổng điểm mục tiêu (3 môn)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.05"
                                            min="0"
                                            max="30"
                                            value={targetForm.targetTotalScore}
                                            onChange={e => setTargetForm({ ...targetForm, targetTotalScore: e.target.value })}
                                            placeholder="Vd: 27.5"
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5 font-bold text-brand-jasper"
                                        />
                                    </div>
                                </div>

                                {/* Subject-specific Targets */}
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-2">
                                        Điểm mục tiêu chi tiết theo từng môn thi:
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {subjects.slice(0, 8).map(s => {
                                            const currentTarget = targetForm.subjectTargets.find(st => st.subjectId === s.id)?.target ?? '';
                                            return (
                                                <div key={s.id} className="p-3 bg-white border border-brand-cerulean/15 rounded flex items-center justify-between">
                                                    <span className="text-xs font-serif-title font-bold text-brand-cerulean">{s.name}</span>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={currentTarget}
                                                        onChange={e => handleUpdateSubjectTarget(s.id, e.target.value)}
                                                        placeholder="--"
                                                        className="w-16 input-editorial text-xs font-body px-1 py-0.5 text-center font-bold text-brand-jasper"
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
                                    return (
                                        <div key={st.subjectId} className="bg-white border border-brand-cerulean/20 p-5 shadow-sm space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subj.color }} />
                                                    <span className="font-serif-title font-bold text-brand-cerulean text-base">{subj.name}</span>
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
                    <div className="bg-white border border-brand-cerulean/20 shadow-editorial p-6 space-y-6">
                        <div className="flex justify-between items-center pb-3 border-b border-brand-cerulean/15">
                            <div>
                                <h3 className="font-serif-title font-bold text-lg text-brand-cerulean flex items-center gap-2">
                                    <Clock size={18} className="text-brand-jasper" />
                                    Lộ trình Giai đoạn Ôn thi Cá nhân
                                </h3>
                                <p className="text-xs text-gray-500 font-body">
                                    Tự thiết lập các giai đoạn ôn tập và tích chọn để cập nhật tiến độ
                                </p>
                            </div>
                        </div>

                        {/* Phase List */}
                        {(profile?.studyPhases || []).length === 0 ? (
                            <div className="p-8 text-center text-gray-400 bg-brand-cream/40 border border-dashed border-brand-cerulean/20 rounded">
                                <Clock size={32} className="mx-auto text-brand-cerulean/30 mb-2" />
                                <p className="font-serif-title text-sm text-gray-600 font-bold">Chưa có giai đoạn ôn tập nào</p>
                                <p className="text-xs text-gray-400 mt-1">Sử dụng form bên dưới để thêm các giai đoạn theo lộ trình ôn thi của bạn.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(profile?.studyPhases || []).map((phase) => {
                                    const isDone = phase.status === 'completed';
                                    const isInProgress = phase.status === 'in_progress';

                                    return (
                                        <div
                                            key={phase.id}
                                            className={`p-4 border transition-all flex items-center justify-between gap-4 ${
                                                isDone
                                                    ? 'bg-emerald-50/60 border-emerald-300'
                                                    : isInProgress
                                                        ? 'bg-brand-cream border-brand-jasper shadow-sm'
                                                        : 'bg-white border-gray-200 opacity-70'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleTogglePhase(phase.id)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    {isDone ? (
                                                        <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-100" />
                                                    ) : isInProgress ? (
                                                        <Sparkles size={22} className="text-brand-jasper animate-pulse" />
                                                    ) : (
                                                        <Circle size={22} className="text-gray-300" />
                                                    )}
                                                </button>
                                                <div>
                                                    <p className={`font-serif-title text-sm font-bold ${
                                                        isDone ? 'line-through text-gray-500' : 'text-brand-cerulean'
                                                    }`}>
                                                        {phase.title}
                                                    </p>
                                                    <span className="text-[11px] text-gray-500 font-body">
                                                        Thời gian: {phase.timeline} • Trạng thái: {
                                                            isDone ? 'Đã hoàn thành' : isInProgress ? 'Đang thực hiện' : 'Chưa bắt đầu'
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleTogglePhase(phase.id)}
                                                    className={`px-2.5 py-1 text-xs font-bold rounded ${
                                                        isDone
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : isInProgress
                                                                ? 'bg-brand-jasper text-white'
                                                                : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {isDone ? 'Hoàn thành' : isInProgress ? 'Đang ôn tập' : 'Bắt đầu'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhase(phase.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                    title="Xóa giai đoạn"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Add Phase Form */}
                        <form onSubmit={handleAddPhase} className="p-4 bg-brand-cream border border-brand-cerulean/20 flex flex-col sm:flex-row gap-3 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Tên giai đoạn mới</label>
                                <input
                                    type="text"
                                    value={newPhaseTitle}
                                    onChange={e => setNewPhaseTitle(e.target.value)}
                                    placeholder="Vd: Giai đoạn 1: Nắm chắc toàn bộ kiến thức SGK..."
                                    className="w-full input-editorial text-xs font-body px-2 py-1.5"
                                    required
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Thời gian dự kiến</label>
                                <input
                                    type="text"
                                    value={newPhaseTimeline}
                                    onChange={e => setNewPhaseTimeline(e.target.value)}
                                    placeholder="Vd: Tháng 9 - Tháng 12"
                                    className="w-full input-editorial text-xs font-body px-2 py-1.5"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-brand-cerulean text-white text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all shrink-0 flex items-center gap-1"
                            >
                                <Plus size={14} /> Thêm giai đoạn
                            </button>
                        </form>
                    </div>
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
                            onClick={() => setIsAddMistakeOpen(true)}
                            className="px-4 py-2 bg-brand-jasper text-white text-xs font-bold shadow-sm hover:bg-brand-cerulean transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                            <Plus size={14} /> Ghi lại Lỗi sai / Bẫy mới
                        </button>
                    </div>

                    {/* Add Mistake Modal / Inline Form */}
                    {isAddMistakeOpen && (
                        <form onSubmit={handleSaveMistakeNote} className="bg-white p-6 border-editorial shadow-editorial space-y-4 animate-fade-in-down">
                            <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/15">
                                <h3 className="font-serif-title font-bold text-brand-cerulean text-sm flex items-center gap-2">
                                    <AlertCircle size={16} className="text-brand-jasper" /> Ghi chép lỗi sai vào Sổ tay Rút kinh nghiệm
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsAddMistakeOpen(false)}
                                    className="text-xs text-gray-400 hover:text-gray-700"
                                >
                                    Đóng
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Môn học</label>
                                    <EditorialSelect
                                        value={mistakeForm.subjectId}
                                        onChange={val => setMistakeForm({ ...mistakeForm, subjectId: val })}
                                        options={subjects.map(s => ({ value: s.id, label: s.name }))}
                                        size="sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Chuyên đề / Dạng bài</label>
                                    <input
                                        type="text"
                                        value={mistakeForm.topic}
                                        onChange={e => setMistakeForm({ ...mistakeForm, topic: e.target.value })}
                                        placeholder="Vd: Tích phân từng phần, Dao động cơ..."
                                        className="w-full input-editorial text-xs font-body px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Phân loại lỗi</label>
                                    <EditorialSelect
                                        value={mistakeForm.category}
                                        onChange={val => setMistakeForm({ ...mistakeForm, category: val })}
                                        options={[
                                            { value: 'Bẫy đề thi', label: '⚠️ Bẫy đề thi' },
                                            { value: 'Lỗi kiến thức', label: '📚 Lỗi kiến thức còn hổng' },
                                            { value: 'Tính toán ẩu', label: '✏️ Lỗi tính toán ẩu' },
                                            { value: 'Kinh nghiệm làm bài', label: '💡 Kinh nghiệm phân bố giờ' }
                                        ]}
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Tiêu đề lỗi sai *</label>
                                <input
                                    type="text"
                                    value={mistakeForm.title}
                                    onChange={e => setMistakeForm({ ...mistakeForm, title: e.target.value })}
                                    placeholder="Vd: Quên chia hệ số 1/3 trong thể tích khối chóp"
                                    className="w-full input-editorial text-xs font-body px-2 py-1 font-bold text-brand-cerulean"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-jasper mb-1">
                                        ❌ Lỗi tôi đã mắc phải (Tại sao sai?):
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={mistakeForm.mistake}
                                        onChange={e => setMistakeForm({ ...mistakeForm, mistake: e.target.value })}
                                        placeholder="Mô tả chi tiết nguyên nhân sai..."
                                        className="w-full input-editorial text-xs font-body p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-emerald-800 mb-1">
                                        ✅ Cách khắc phục & Ghi nhớ lần sau:
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={mistakeForm.remedy}
                                        onChange={e => setMistakeForm({ ...mistakeForm, remedy: e.target.value })}
                                        placeholder="Mẹo nhớ, công thức chuẩn, quy tắc kiểm tra lại..."
                                        className="w-full input-editorial text-xs font-body p-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddMistakeOpen(false)}
                                    className="px-4 py-2 text-xs text-gray-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-brand-jasper text-white text-xs font-bold shadow-sm hover:bg-brand-cerulean transition-all"
                                >
                                    Lưu vào Sổ tay
                                </button>
                            </div>
                        </form>
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
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] px-2 py-0.5 bg-brand-cream border border-brand-cerulean/15 text-brand-jasper font-bold rounded">
                                                    {note.category}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteMistakeNote(note.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                                                    title="Xóa ghi chú"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                            {note.title}
                                        </h4>

                                        <div className="p-3 bg-red-50/70 border-l-2 border-brand-jasper rounded-r text-xs space-y-1">
                                            <span className="font-bold text-brand-jasper block text-[11px]">Lỗi đã gặp:</span>
                                            <p className="text-gray-700 font-body">{note.mistake}</p>
                                        </div>

                                        {note.remedy && (
                                            <div className="p-3 bg-emerald-50/70 border-l-2 border-emerald-600 rounded-r text-xs space-y-1">
                                                <span className="font-bold text-emerald-800 block text-[11px]">Cách khắc phục:</span>
                                                <p className="text-gray-700 font-body">{note.remedy}</p>
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
        </div>
    );
};

export default ThptPersonalGoalView;
