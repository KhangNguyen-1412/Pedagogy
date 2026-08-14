import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Edit2, Check, BookOpen, Calendar, Tag, Sparkles } from 'lucide-react';

const PRESET_COLORS = [
    '#124874', '#CF373D', '#0D9488', '#16A34A', '#7C3AED',
    '#EA580C', '#B45309', '#0284C7', '#475569', '#2563EB',
    '#DB2777', '#059669', '#4F46E5', '#9333EA'
];

export const ThptMetadataModal = ({
    isOpen,
    onClose,
    subjects,
    onUpdateSubjects,
    years,
    onUpdateYears,
    examTypes,
    onUpdateExamTypes,
    showToast
}) => {
    const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' | 'years' | 'examTypes'

    // Form state for Subject
    const [editingSubjectId, setEditingSubjectId] = useState(null);
    const [subForm, setSubForm] = useState({ name: '', code: '', color: '#124874' });

    // Form state for Year
    const [newYearInput, setNewYearInput] = useState('');

    // Form state for Exam Type
    const [editingExamTypeId, setEditingExamTypeId] = useState(null);
    const [examTypeForm, setExamTypeForm] = useState({ name: '', badge: '', color: 'bg-blue-100 text-blue-800' });

    if (!isOpen) return null;

    // --- Subject Handlers ---
    const handleSaveSubject = (e) => {
        e.preventDefault();
        if (!subForm.name.trim()) return;

        if (editingSubjectId) {
            const updated = subjects.map(s => s.id === editingSubjectId ? {
                ...s,
                name: subForm.name.trim(),
                code: (subForm.code || subForm.name.substring(0, 4)).toUpperCase().trim(),
                color: subForm.color
            } : s);
            onUpdateSubjects(updated);
            showToast?.('Đã cập nhật môn học thành công');
        } else {
            const newId = 'subj_' + Date.now();
            const newSub = {
                id: newId,
                name: subForm.name.trim(),
                code: (subForm.code || subForm.name.substring(0, 4)).toUpperCase().trim(),
                color: subForm.color
            };
            onUpdateSubjects([...subjects, newSub]);
            showToast?.('Đã thêm môn học mới thành công');
        }

        setEditingSubjectId(null);
        setSubForm({ name: '', code: '', color: '#124874' });
    };

    const handleEditSubject = (subj) => {
        setEditingSubjectId(subj.id);
        setSubForm({ name: subj.name, code: subj.code || '', color: subj.color || '#124874' });
    };

    const handleDeleteSubject = (subjId) => {
        if (window.confirm('Bạn có chắc muốn xóa môn học này? Các đề thi thuộc môn này có thể cần được phân loại lại.')) {
            onUpdateSubjects(subjects.filter(s => s.id !== subjId));
            showToast?.('Đã xóa môn học');
        }
    };

    // --- Year Handlers ---
    const handleAddYear = (e) => {
        e.preventDefault();
        const year = newYearInput.trim();
        if (!year) return;
        if (years.includes(year)) {
            alert('Năm này đã tồn tại trong danh sách.');
            return;
        }
        const updated = [year, ...years].sort((a, b) => Number(b) - Number(a));
        onUpdateYears(updated);
        setNewYearInput('');
        showToast?.('Đã thêm năm thi mới');
    };

    const handleDeleteYear = (year) => {
        if (years.length <= 1) {
            alert('Cần giữ lại ít nhất 1 năm thi trong danh mục.');
            return;
        }
        if (window.confirm(`Bạn có chắc muốn xóa năm ${year}?`)) {
            onUpdateYears(years.filter(y => y !== year));
            showToast?.(`Đã xóa năm ${year}`);
        }
    };

    // --- Exam Type Handlers ---
    const handleSaveExamType = (e) => {
        e.preventDefault();
        if (!examTypeForm.name.trim()) return;

        if (editingExamTypeId) {
            const updated = examTypes.map(t => t.id === editingExamTypeId ? {
                ...t,
                name: examTypeForm.name.trim(),
                badge: examTypeForm.badge.trim() || examTypeForm.name.trim(),
                color: examTypeForm.color
            } : t);
            onUpdateExamTypes(updated);
            showToast?.('Đã cập nhật loại kỳ thi');
        } else {
            const newId = 'type_' + Date.now();
            const newType = {
                id: newId,
                name: examTypeForm.name.trim(),
                badge: examTypeForm.badge.trim() || examTypeForm.name.trim(),
                color: examTypeForm.color
            };
            onUpdateExamTypes([...examTypes, newType]);
            showToast?.('Đã thêm loại kỳ thi mới');
        }

        setEditingExamTypeId(null);
        setExamTypeForm({ name: '', badge: '', color: 'bg-blue-100 text-blue-800' });
    };

    const handleEditExamType = (t) => {
        setEditingExamTypeId(t.id);
        setExamTypeForm({ name: t.name, badge: t.badge || '', color: t.color || 'bg-blue-100 text-blue-800' });
    };

    const handleDeleteExamType = (typeId) => {
        if (examTypes.length <= 1) {
            alert('Cần giữ lại ít nhất 1 loại kỳ thi.');
            return;
        }
        if (window.confirm('Bạn có chắc muốn xóa loại kỳ thi này?')) {
            onUpdateExamTypes(examTypes.filter(t => t.id !== typeId));
            showToast?.('Đã xóa loại kỳ thi');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-brand-cerulean/40 backdrop-blur-sm animate-backdrop-in">
            <div className="bg-brand-cream border-editorial shadow-2xl w-full max-w-3xl h-[620px] max-h-[90vh] flex flex-col overflow-hidden animate-modal-pop-in">
                {/* Modal Header */}
                <div className="p-6 border-b border-brand-cerulean/20 flex justify-between items-center bg-brand-cerulean text-brand-cream shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded">
                            <Tag size={22} className="text-brand-cream" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif-title font-bold tracking-wide">
                                Quản lý Danh mục THPT
                            </h2>
                            <p className="text-xs opacity-80 font-sans">
                                Cấu hình Môn học, Năm thi & Loại kỳ thi chuẩn hóa hệ thống
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors text-brand-cream"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-brand-cerulean/20 bg-brand-cerulean/5 px-6 pt-3 gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('subjects'); setEditingSubjectId(null); }}
                        className={`pb-3 px-2 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'subjects'
                                ? 'border-brand-jasper text-brand-jasper'
                                : 'border-transparent text-brand-cerulean/70 hover:text-brand-cerulean'
                        }`}
                    >
                        <BookOpen size={16} /> Danh mục Môn học ({subjects.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('years'); }}
                        className={`pb-3 px-2 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'years'
                                ? 'border-brand-jasper text-brand-jasper'
                                : 'border-transparent text-brand-cerulean/70 hover:text-brand-cerulean'
                        }`}
                    >
                        <Calendar size={16} /> Năm thi ({years.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('examTypes'); setEditingExamTypeId(null); }}
                        className={`pb-3 px-2 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'examTypes'
                                ? 'border-brand-jasper text-brand-jasper'
                                : 'border-transparent text-brand-cerulean/70 hover:text-brand-cerulean'
                        }`}
                    >
                        <Tag size={16} /> Loại Đề & Kỳ thi ({examTypes.length})
                    </button>
                </div>

                {/* Tab Content Area */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* TAB 1: SUBJECTS */}
                    {activeTab === 'subjects' && (
                        <div className="space-y-6">
                            {/* Subject Edit / Add Form */}
                            <form onSubmit={handleSaveSubject} className="bg-white p-4 border border-brand-cerulean/20 shadow-sm space-y-4">
                                <div className="font-serif-title font-bold text-brand-cerulean flex items-center justify-between text-sm">
                                    <span>{editingSubjectId ? '✏️ Chỉnh sửa Môn học' : '➕ Thêm Môn học mới'}</span>
                                    {editingSubjectId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingSubjectId(null); setSubForm({ name: '', code: '', color: '#124874' }); }}
                                            className="text-xs text-gray-500 hover:underline"
                                        >
                                            Hủy chỉnh sửa
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <div className="sm:col-span-6">
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Tên môn học *</label>
                                        <input
                                            type="text"
                                            value={subForm.name}
                                            onChange={e => setSubForm({ ...subForm, name: e.target.value })}
                                            placeholder="Vd: Toán học, Vật lí, Hóa học..."
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Mã viết tắt</label>
                                        <input
                                            type="text"
                                            value={subForm.code}
                                            onChange={e => setSubForm({ ...subForm, code: e.target.value.toUpperCase() })}
                                            placeholder="Vd: TOAN, VATLY"
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                        />
                                    </div>
                                    <div className="sm:col-span-3 flex flex-col justify-end">
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-brand-cerulean hover:bg-brand-cerulean/90 text-white font-sans text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            <Check size={14} /> {editingSubjectId ? 'Cập nhật' : 'Thêm môn'}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1.5">Màu sắc nhận diện:</label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {PRESET_COLORS.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setSubForm({ ...subForm, color: c })}
                                                style={{ backgroundColor: c }}
                                                className={`w-6 h-6 rounded-full transition-transform ${
                                                    subForm.color === c ? 'ring-2 ring-offset-2 ring-brand-jasper scale-110' : 'hover:scale-105'
                                                }`}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={subForm.color}
                                            onChange={e => setSubForm({ ...subForm, color: e.target.value })}
                                            className="w-7 h-7 cursor-pointer border-0 rounded bg-transparent ml-2"
                                            title="Chọn màu tùy chỉnh"
                                        />
                                    </div>
                                </div>
                            </form>

                            {/* Subjects List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {subjects.map(subj => (
                                    <div
                                        key={subj.id}
                                        className="p-3.5 bg-white border border-brand-cerulean/15 flex items-center justify-between shadow-sm hover:border-brand-cerulean/40 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-10 rounded-sm"
                                                style={{ backgroundColor: subj.color || '#124874' }}
                                            />
                                            <div>
                                                <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                                    {subj.name}
                                                </h4>
                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {subj.code || subj.id}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditSubject(subj)}
                                                className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cream rounded transition-colors"
                                                title="Sửa môn học"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSubject(subj.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Xóa môn học"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: YEARS */}
                    {activeTab === 'years' && (
                        <div className="space-y-6">
                            {/* Year Add Form */}
                            <form onSubmit={handleAddYear} className="bg-white p-4 border border-brand-cerulean/20 shadow-sm flex items-end gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Thêm năm thi mới</label>
                                    <input
                                        type="number"
                                        min="2000"
                                        max="2099"
                                        value={newYearInput}
                                        onChange={e => setNewYearInput(e.target.value)}
                                        placeholder="Vd: 2027"
                                        className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="py-2 px-5 bg-brand-cerulean hover:bg-brand-cerulean/90 text-white font-sans text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all shrink-0"
                                >
                                    <Plus size={14} /> Thêm năm
                                </button>
                            </form>

                            {/* Years Badges Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {years.map(year => (
                                    <div
                                        key={year}
                                        className="p-3 bg-white border border-brand-cerulean/20 flex items-center justify-between shadow-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-brand-cerulean" />
                                            <span className="font-serif-title font-bold text-brand-cerulean text-base">
                                                Năm {year}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteYear(year)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Xóa năm này"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: EXAM TYPES */}
                    {activeTab === 'examTypes' && (
                        <div className="space-y-6">
                            {/* Exam Type Form */}
                            <form onSubmit={handleSaveExamType} className="bg-white p-4 border border-brand-cerulean/20 shadow-sm space-y-4">
                                <div className="font-serif-title font-bold text-brand-cerulean flex items-center justify-between text-sm">
                                    <span>{editingExamTypeId ? '✏️ Chỉnh sửa Loại Kỳ thi' : '➕ Thêm Loại Kỳ thi mới'}</span>
                                    {editingExamTypeId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingExamTypeId(null); setExamTypeForm({ name: '', badge: '', color: 'bg-blue-100 text-blue-800' }); }}
                                            className="text-xs text-gray-500 hover:underline"
                                        >
                                            Hủy
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <div className="sm:col-span-6">
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Tên đầy đủ loại đề *</label>
                                        <input
                                            type="text"
                                            value={examTypeForm.name}
                                            onChange={e => setExamTypeForm({ ...examTypeForm, name: e.target.value })}
                                            placeholder="Vd: Đề thi thử THPT Chuyên, Đề thi Khảo sát..."
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Nhãn hiển thị ngắn (Badge)</label>
                                        <input
                                            type="text"
                                            value={examTypeForm.badge}
                                            onChange={e => setExamTypeForm({ ...examTypeForm, badge: e.target.value })}
                                            placeholder="Vd: Thi thử, Khảo sát"
                                            className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                        />
                                    </div>
                                    <div className="sm:col-span-3 flex flex-col justify-end">
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-brand-cerulean hover:bg-brand-cerulean/90 text-white font-sans text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            <Check size={14} /> {editingExamTypeId ? 'Cập nhật' : 'Thêm loại'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Exam Types List */}
                            <div className="space-y-2">
                                {examTypes.map(t => (
                                    <div
                                        key={t.id}
                                        className="p-3 bg-white border border-brand-cerulean/15 flex items-center justify-between shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded ${t.color || 'bg-blue-100 text-blue-800'}`}>
                                                {t.badge || t.name}
                                            </span>
                                            <span className="font-serif-title font-bold text-brand-cerulean text-sm">
                                                {t.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditExamType(t)}
                                                className="p-1.5 text-brand-cerulean hover:text-brand-jasper rounded"
                                                title="Sửa"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteExamType(t.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                                                title="Xóa"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-brand-cerulean/20 bg-brand-cerulean/5 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-brand-cerulean text-white font-sans text-xs font-bold hover:bg-brand-cerulean/90 shadow-sm"
                    >
                        Hoàn tất & Đóng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ThptMetadataModal;
