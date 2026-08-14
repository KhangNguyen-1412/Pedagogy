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
    onSaveResult,
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

    // Handle Editor Full Page View
    if (isEditorOpen) {
        return (
            <ThptExamEditorModal
                key={examToEdit?.id || 'new_exam_editor'}
                isOpen={true}
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
                    setIsEditorOpen(false);
                    setExamToEdit(null);
                    showToast?.('Đã lưu đề thi thành công');
                }}
                showToast={showToast}
            />
        );
    }

    // Handle view detail
    const activeExam = exams.find(e => e.id === selectedExamId);

    if (activeExam) {
        return (
            <ThptExamDetailView
                exam={activeExam}
                exams={exams}
                subjects={subjects}
                years={years}
                examTypes={examTypes}
                onBack={() => setSelectedExamId(null)}
                onEditExam={(exam) => {
                    setExamToEdit(exam);
                    setIsEditorOpen(true);
                }}
                onSaveResult={onSaveResult}
                showToast={showToast}
            />
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in-up">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Quản lý Đề thi & Đáp án</h2>
                    <p className="text-lg text-gray-600 mt-2">Lưu trữ cấu trúc đề thi, biên soạn câu hỏi KaTeX & hướng dẫn giải chi tiết.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-48">
                        <EditorialSelect
                            value={selectedSubject}
                            onChange={setSelectedSubject}
                            options={[
                                { value: 'all', label: `Tất cả môn học (${subjects.length})` },
                                ...subjects.map(s => ({ value: s.id, label: s.name }))
                            ]}
                        />
                    </div>
                    <div className="w-36">
                        <EditorialSelect
                            value={selectedYear}
                            onChange={setSelectedYear}
                            options={[
                                { value: 'all', label: 'Tất cả năm' },
                                ...years.map(y => ({ value: y, label: `Năm ${y}` }))
                            ]}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsMetadataOpen(true)}
                        className="px-3.5 py-2 border border-brand-cerulean text-brand-cerulean font-serif-title hover:bg-brand-cerulean hover:text-white transition-colors whitespace-nowrap text-sm"
                    >
                        <Tag size={16} className="inline mr-1" /> Danh mục
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setExamToEdit(null);
                            setIsEditorOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-jasper text-brand-cream font-serif-title hover:bg-red-800 transition-colors shadow-editorial whitespace-nowrap"
                    >
                        <Plus size={18} /> Soạn đề mới
                    </button>
                </div>
            </div>

            {/* Exams List - Identical Horizontal Cards to ProgramsView */}
            {filteredExams.length === 0 ? (
                <div className="p-12 text-center bg-white border-editorial shadow-editorial space-y-3">
                    <FileText size={36} className="mx-auto text-brand-cerulean/40" />
                    <h3 className="font-serif-title font-bold text-xl text-brand-cerulean">Không tìm thấy đề thi phù hợp</h3>
                    <p className="text-sm text-gray-500 font-body">Hãy thử đổi tiêu chí tìm kiếm hoặc tạo thêm đề thi mới vào ngân hàng đề.</p>
                    <button
                        type="button"
                        onClick={() => { setExamToEdit(null); setIsEditorOpen(true); }}
                        className="mt-2 px-6 py-2 bg-brand-jasper text-white font-serif-title shadow-editorial hover:bg-red-800 transition-all"
                    >
                        + Soạn đề thi mới
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredExams.map(exam => {
                        const subject = subjects.find(s => s.id === exam.subjectId) || { name: 'Môn thi', color: '#124874' };
                        const examType = examTypes.find(t => t.id === exam.examTypeId) || { name: 'Đề thi chuẩn', badge: 'Đề thi' };
                        const qCount = exam.questions?.length || 0;

                        return (
                            <div
                                key={exam.id}
                                className="border-editorial p-6 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-blue-50/30 transition-colors"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3
                                            onClick={() => setSelectedExamId(exam.id)}
                                            className="text-2xl font-serif-title text-brand-cerulean font-bold cursor-pointer group-hover:text-brand-jasper"
                                        >
                                            {exam.title}
                                        </h3>
                                        <span
                                            className="px-2.5 py-0.5 text-xs font-bold font-serif-title rounded border text-white"
                                            style={{ backgroundColor: subject.color || '#124874' }}
                                        >
                                            {subject.name}
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-brand-cerulean/15 text-brand-cerulean text-xs font-bold font-serif-title rounded border border-brand-cerulean/40">
                                            Năm {exam.year || '2026'}
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono font-bold rounded border border-gray-300">
                                            {exam.code || 'MĐ-01'}
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-blue-50 text-brand-cerulean/80 text-xs font-bold font-serif-title rounded border border-brand-cerulean/20">
                                            {examType.name || 'Đề thi chuẩn'}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {exam.description || 'Đề thi chuẩn cấu trúc phân hóa của Bộ Giáo dục & Đào tạo, có đáp án và lời giải chi tiết.'}
                                    </p>

                                    {/* Info Strip - Identical style to ProgramsView rules breakdown */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-serif bg-brand-cream p-3 border border-brand-cerulean/20">
                                        <div><strong className="text-brand-cerulean">Thời gian:</strong> {exam.duration || 90} phút</div>
                                        <div><strong className="text-brand-cerulean">Số câu hỏi:</strong> {qCount} câu</div>
                                        <div><strong className="text-brand-cerulean">Điểm tối đa:</strong> {exam.maxScore || 10} điểm</div>
                                        <div><strong className="text-brand-cerulean">Cấu trúc:</strong> {exam.questions?.some(q => q.type === 'true_false') ? 'Định dạng 2025+' : 'Trắc nghiệm'}</div>
                                    </div>

                                    <div className="flex gap-4 text-sm font-sans text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FileText size={14} /> Tổng {qCount} câu hỏi
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> Thời lượng: {exam.duration || 90} phút
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Tag size={14} /> Niên khóa: {exam.year || 2026}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedExamId(exam.id)}
                                        className="px-5 py-2 text-xs font-serif-title font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 rounded-sm bg-brand-cerulean text-white hover:bg-brand-jasper"
                                    >
                                        <Eye size={15} /> Xem & Làm bài
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setExamToEdit(exam);
                                                setIsEditorOpen(true);
                                            }}
                                            className="flex-1 px-3 py-1.5 border border-brand-cerulean text-brand-cerulean font-serif-title hover:bg-brand-cerulean hover:text-white transition-colors whitespace-nowrap text-xs text-center flex items-center justify-center gap-1"
                                        >
                                            <Edit2 size={13} /> Sửa đề
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDuplicateExam(exam)}
                                            className="px-2.5 py-1.5 border border-brand-cerulean/30 text-gray-600 font-serif-title hover:bg-brand-cream transition-colors text-xs flex items-center justify-center"
                                            title="Nhân bản đề này"
                                        >
                                            <Copy size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`Bạn có chắc muốn xóa đề thi "${exam.title}"?`)) {
                                                    onDeleteExam(exam.id);
                                                    showToast?.('Đã xóa đề thi');
                                                }
                                            }}
                                            className="px-2.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-xs flex items-center justify-center"
                                            title="Xóa đề thi"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
