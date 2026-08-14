import React, { useState, useMemo } from 'react';
import {
    Plus, Search, Filter, BookOpen, Calendar, Tag, FileText,
    Clock, Eye, Edit2, Trash2, Copy, Printer, Award, Sparkles, SlidersHorizontal
} from 'lucide-react';
import { ThptExamEditorModal } from './ThptExamEditorModal';
import { ThptMetadataModal } from './ThptMetadataModal';
import { ThptExamDetailView } from './ThptExamDetailView';
import { EditorialSelect } from './EditorialSelect';

export const ThptExamsView = ({
    exams,
    subjects,
    years,
    examTypes,
    onSaveExam,
    onDeleteExam,
    onDuplicateExam,
    onUpdateSubjects,
    onUpdateYears,
    onUpdateExamTypes,
    showToast
}) => {
    // View state
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isMetadataOpen, setIsMetadataOpen] = useState(false);
    const [examToEdit, setExamToEdit] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    // Filtered exams
    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const matchesSearch = !searchTerm ||
                exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesSubject = selectedSubject === 'all' || exam.subjectId === selectedSubject;
            const matchesYear = selectedYear === 'all' || String(exam.year) === String(selectedYear);
            const matchesType = selectedType === 'all' || exam.examTypeId === selectedType;

            return matchesSearch && matchesSubject && matchesYear && matchesType;
        });
    }, [exams, searchTerm, selectedSubject, selectedYear, selectedType]);

    // Handle view detail
    const activeExam = exams.find(e => e.id === selectedExamId);

    if (activeExam) {
        return (
            <ThptExamDetailView
                exam={activeExam}
                subjects={subjects}
                years={years}
                examTypes={examTypes}
                onBack={() => setSelectedExamId(null)}
                onEditExam={(exam) => {
                    setExamToEdit(exam);
                    setIsEditorOpen(true);
                }}
                showToast={showToast}
            />
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-brand-cerulean/20 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-brand-jasper font-bold mb-1">
                        <FileText size={14} /> Ngân hàng Đề thi THPT Quốc gia
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean tracking-tight">
                        Quản lý Đề thi & Đáp án
                    </h1>
                    <p className="text-sm italic text-gray-600 font-body mt-1">
                        Lưu trữ cấu trúc đề thi, biên soạn câu hỏi KaTeX, hình ảnh biểu đồ & hướng dẫn giải chi tiết
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setIsMetadataOpen(true)}
                        className="px-4 py-2.5 bg-white border border-brand-cerulean/40 text-brand-cerulean hover:border-brand-cerulean hover:bg-brand-cerulean/5 font-sans text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                    >
                        <Tag size={15} /> Quản lý Danh mục
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setExamToEdit(null);
                            setIsEditorOpen(true);
                        }}
                        className="px-5 py-2.5 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-editorial transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Soạn đề thi mới
                    </button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Tổng số đề thi</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1">{exams.length}</p>
                </div>
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Môn học kích hoạt</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-jasper mt-1">{subjects.length}</p>
                </div>
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Năm thi quản lý</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1">{years.length}</p>
                </div>
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Tổng câu hỏi trong kho</span>
                    <p className="text-2xl font-serif-title font-bold text-emerald-700 mt-1">
                        {exams.reduce((acc, curr) => acc + (curr.questions?.length || 0), 0)}
                    </p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4 relative">
                        <Search size={16} className="absolute left-3 top-3 text-brand-cerulean/60" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Tìm theo tên đề, mã đề thi..."
                            className="w-full pl-9 pr-3 py-2 input-editorial text-sm font-body bg-transparent"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <EditorialSelect
                            value={selectedSubject}
                            onChange={setSelectedSubject}
                            options={[
                                { value: 'all', label: `Tất cả môn học (${subjects.length})` },
                                ...subjects.map(s => ({ value: s.id, label: s.name }))
                            ]}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <EditorialSelect
                            value={selectedYear}
                            onChange={setSelectedYear}
                            options={[
                                { value: 'all', label: 'Tất cả năm' },
                                ...years.map(y => ({ value: y, label: `Năm ${y}` }))
                            ]}
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <EditorialSelect
                            value={selectedType}
                            onChange={setSelectedType}
                            options={[
                                { value: 'all', label: 'Tất cả loại đề' },
                                ...examTypes.map(t => ({ value: t.id, label: t.name }))
                            ]}
                        />
                    </div>
                </div>

                {(selectedSubject !== 'all' || selectedYear !== 'all' || selectedType !== 'all' || searchTerm) && (
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                        <span>Đang lọc: Tìm thấy <strong>{filteredExams.length}</strong> / {exams.length} đề thi</span>
                        <button
                            type="button"
                            onClick={() => { setSearchTerm(''); setSelectedSubject('all'); setSelectedYear('all'); setSelectedType('all'); }}
                            className="text-brand-jasper hover:underline font-bold"
                        >
                            Xóa tất cả bộ lọc
                        </button>
                    </div>
                )}
            </div>

            {/* Exams Grid */}
            {filteredExams.length === 0 ? (
                <div className="p-12 text-center bg-white border border-brand-cerulean/20 shadow-sm space-y-3">
                    <FileText size={36} className="mx-auto text-brand-cerulean/40" />
                    <h3 className="font-serif-title font-bold text-lg text-brand-cerulean">Không tìm thấy đề thi phù hợp</h3>
                    <p className="text-xs text-gray-500 font-body">Hãy thử đổi tiêu chí tìm kiếm hoặc tạo thêm đề thi mới vào ngân hàng đề.</p>
                    <button
                        type="button"
                        onClick={() => { setExamToEdit(null); setIsEditorOpen(true); }}
                        className="mt-2 px-4 py-2 bg-brand-cerulean text-white font-sans text-xs font-bold shadow-sm"
                    >
                        Soạn đề thi mới
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map(exam => {
                        const subject = subjects.find(s => s.id === exam.subjectId) || { name: 'Môn thi', color: '#124874' };
                        const examType = examTypes.find(t => t.id === exam.examTypeId) || { name: 'Đề thi', badge: 'Đề thi' };
                        const qCount = exam.questions?.length || 0;

                        return (
                            <div
                                key={exam.id}
                                className="bg-white border border-brand-cerulean/20 shadow-editorial hover:shadow-editorial-hover transition-all flex flex-col justify-between group relative"
                            >
                                {/* Top Accent Color Stripe */}
                                <div
                                    className="h-1.5 w-full"
                                    style={{ backgroundColor: subject.color || '#124874' }}
                                />

                                <div className="p-5 space-y-3">
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="px-2 py-0.5 text-[11px] font-bold text-white rounded"
                                                style={{ backgroundColor: subject.color || '#124874' }}
                                            >
                                                {subject.name}
                                            </span>
                                            <span className="px-2 py-0.5 text-[11px] font-bold bg-brand-cerulean/10 text-brand-cerulean rounded">
                                                Năm {exam.year || '2026'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border">
                                            {exam.code || 'MĐ-01'}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <h3
                                            onClick={() => setSelectedExamId(exam.id)}
                                            className="font-serif-title font-bold text-lg text-brand-cerulean hover:text-brand-jasper transition-colors cursor-pointer line-clamp-2"
                                            title={exam.title}
                                        >
                                            {exam.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-body line-clamp-2 mt-1">
                                            {exam.description || 'Đề thi chuẩn cấu trúc phân hóa THPT Quốc gia.'}
                                        </p>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600 font-body">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-brand-cerulean" />
                                            <span>{exam.duration || 90} phút</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FileText size={13} className="text-brand-jasper" />
                                            <span><strong>{qCount}</strong> câu hỏi</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Bar */}
                                <div className="p-3 bg-brand-cerulean/5 border-t border-brand-cerulean/15 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedExamId(exam.id)}
                                        className="text-xs font-serif-title font-bold text-brand-cerulean hover:text-brand-jasper flex items-center gap-1 transition-colors"
                                    >
                                        <Eye size={14} /> Xem & In đề
                                    </button>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onDuplicateExam(exam)}
                                            className="p-1.5 text-gray-500 hover:text-brand-cerulean hover:bg-white rounded transition-colors"
                                            title="Nhân bản đề này"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setExamToEdit(exam);
                                                setIsEditorOpen(true);
                                            }}
                                            className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-white rounded transition-colors"
                                            title="Chỉnh sửa đề thi"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`Bạn có chắc muốn xóa đề thi "${exam.title}"?`)) {
                                                    onDeleteExam(exam.id);
                                                    showToast?.('Đã xóa đề thi');
                                                }
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Xóa đề thi"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Exam Editor Modal */}
            <ThptExamEditorModal
                isOpen={isEditorOpen}
                onClose={() => {
                    setIsEditorOpen(false);
                    setExamToEdit(null);
                }}
                examToEdit={examToEdit}
                subjects={subjects}
                years={years}
                examTypes={examTypes}
                onSaveExam={(savedExam) => {
                    onSaveExam(savedExam);
                    showToast?.('Đã lưu đề thi thành công');
                }}
                showToast={showToast}
            />

            {/* Metadata Modal */}
            <ThptMetadataModal
                isOpen={isMetadataOpen}
                onClose={() => setIsMetadataOpen(false)}
                subjects={subjects}
                onUpdateSubjects={onUpdateSubjects}
                years={years}
                onUpdateYears={onUpdateYears}
                examTypes={examTypes}
                onUpdateExamTypes={onUpdateExamTypes}
                showToast={showToast}
            />
        </div>
    );
};

export default ThptExamsView;
