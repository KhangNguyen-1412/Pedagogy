import React, { useState } from 'react';
import {
    ArrowLeft, Printer, Edit2, Eye, EyeOff, CheckCircle2, Clock,
    BookOpen, Calendar, Tag, Share2, Award, FileText, Check
} from 'lucide-react';
import { MathText } from './MathText';

export const ThptExamDetailView = ({
    exam,
    subjects,
    years,
    examTypes,
    onBack,
    onEditExam,
    showToast
}) => {
    const [showAnswers, setShowAnswers] = useState(false);
    const [filterQuestion, setFilterQuestion] = useState('all');

    if (!exam) return null;

    const subject = subjects.find(s => s.id === exam.subjectId) || { name: 'Môn thi', color: '#124874' };
    const examType = examTypes.find(t => t.id === exam.examTypeId) || { name: 'Đề thi' };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Action Bar (Hidden on print) */}
            <div className="print:hidden flex flex-wrap justify-between items-center bg-white p-4 border border-brand-cerulean/20 shadow-sm gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 border border-brand-cerulean/30 text-brand-cerulean hover:text-brand-jasper hover:border-brand-jasper text-xs font-bold flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={16} /> Quay lại Ngân hàng đề
                </button>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setShowAnswers(!showAnswers)}
                        className={`px-4 py-2 rounded text-xs font-sans font-bold flex items-center gap-2 transition-all shadow-sm ${
                            showAnswers
                                ? 'bg-emerald-700 text-white'
                                : 'bg-brand-cerulean text-white hover:bg-brand-cerulean/90'
                        }`}
                    >
                        {showAnswers ? <EyeOff size={16} /> : <Eye size={16} />}
                        {showAnswers ? 'Ẩn Lời giải & Đáp án' : 'Hiện Lời giải & Đáp án'}
                    </button>

                    <button
                        type="button"
                        onClick={() => onEditExam(exam)}
                        className="px-4 py-2 bg-white border border-brand-cerulean/40 text-brand-cerulean hover:border-brand-jasper hover:text-brand-jasper text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                        <Edit2 size={15} /> Chỉnh sửa đề
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-2 bg-brand-jasper hover:bg-brand-jasper/90 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                        <Printer size={15} /> In đề thi / Xuất PDF
                    </button>
                </div>
            </div>

            {/* Exam Paper Container (Optimized for Screen & Print) */}
            <div className="bg-white p-6 sm:p-10 border border-brand-cerulean/20 shadow-editorial max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
                {/* Official Exam Header */}
                <div className="border-b-2 border-brand-cerulean pb-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-center sm:text-left">
                        <div className="border-r border-brand-cerulean/20 pr-4">
                            <h3 className="font-serif-title font-bold text-xs uppercase tracking-wider text-brand-cerulean">
                                KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG {exam.year || '2026'}
                            </h3>
                            <p className="font-serif text-sm font-bold text-brand-jasper uppercase mt-1">
                                {examType.name}
                            </p>
                            <p className="text-xs text-gray-500 italic mt-0.5">
                                Khóa luyện thi THPT Quốc gia
                            </p>
                        </div>
                        <div className="pl-4">
                            <h2 className="font-serif-title font-bold text-base uppercase text-brand-cerulean">
                                BÀI THI: {subject.name.toUpperCase()}
                            </h2>
                            <p className="text-xs font-body text-gray-700 mt-1">
                                Thời gian làm bài: <strong>{exam.duration || 90} phút</strong> (không kể thời gian phát đề)
                            </p>
                            <div className="mt-2 inline-block px-3 py-1 bg-brand-cerulean text-white font-mono text-xs font-bold">
                                Mã đề thi: {exam.code || '101'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-gray-300 flex justify-between text-xs font-body text-gray-600">
                        <span>Họ và tên thí sinh: ............................................................................</span>
                        <span>Số báo danh: .............................</span>
                    </div>
                </div>

                {/* Exam Title & Overview */}
                <div className="text-center mb-8">
                    <h1 className="font-serif-title text-xl font-bold text-brand-cerulean">
                        {exam.title}
                    </h1>
                    {exam.description && (
                        <p className="text-xs italic text-gray-500 font-body mt-1 max-w-2xl mx-auto">
                            {exam.description}
                        </p>
                    )}
                </div>

                {/* Questions List */}
                <div className="space-y-8">
                    {exam.questions?.map((q, idx) => {
                        return (
                            <div
                                key={q.id || idx}
                                className={`space-y-3 pb-6 border-b border-gray-200 last:border-0 ${
                                    showAnswers ? 'bg-amber-50/20 p-4 rounded border border-amber-200/50' : ''
                                }`}
                            >
                                {/* Question Title */}
                                <div className="text-sm font-body leading-relaxed text-brand-ink">
                                    <strong className="font-serif-title font-bold text-brand-cerulean mr-2 text-base">
                                        Câu {idx + 1}:
                                    </strong>
                                    <MathText text={q.content} className="inline" />
                                </div>

                                {/* Question Image if present */}
                                {q.imageUrl && (
                                    <div className="my-3 text-center">
                                        <img
                                            src={q.imageUrl}
                                            alt={`Hình minh họa câu ${idx + 1}`}
                                            className="max-h-64 object-contain mx-auto border border-gray-200 p-1 bg-white rounded shadow-sm"
                                        />
                                    </div>
                                )}

                                {/* Options A, B, C, D */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                    {q.options?.map((opt) => {
                                        const isCorrect = q.correctAnswer === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                className={`p-2.5 text-sm font-body rounded transition-colors flex items-start gap-2 ${
                                                    showAnswers && isCorrect
                                                        ? 'bg-emerald-100/70 border border-emerald-500 text-emerald-950 font-bold'
                                                        : 'hover:bg-brand-cream/80'
                                                }`}
                                            >
                                                <span className={`font-serif-title font-bold shrink-0 ${
                                                    showAnswers && isCorrect ? 'text-emerald-800' : 'text-brand-cerulean'
                                                }`}>
                                                    {opt.id}.
                                                </span>
                                                <div className="flex-1">
                                                    <MathText text={opt.text} />
                                                </div>
                                                {showAnswers && isCorrect && (
                                                    <Check size={16} className="text-emerald-700 shrink-0 ml-1 mt-0.5" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Solution / Explanation Box (Shown when toggle is active) */}
                                {showAnswers && (
                                    <div className="mt-4 p-4 bg-white border-l-4 border-emerald-600 shadow-sm rounded-r space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-emerald-800">
                                            <CheckCircle2 size={15} />
                                            <span>HƯỚNG DẪN GIẢI CHI TIẾT (ĐÁP ÁN {q.correctAnswer}):</span>
                                        </div>

                                        {q.explanation ? (
                                            <div className="text-xs font-body text-gray-800 leading-relaxed pl-1">
                                                <MathText text={q.explanation} />
                                            </div>
                                        ) : (
                                            <p className="text-xs italic text-gray-400">
                                                Chưa có lời giải chi tiết cho câu hỏi này.
                                            </p>
                                        )}

                                        {q.explanationImageUrl && (
                                            <div className="mt-2 text-center">
                                                <img
                                                    src={q.explanationImageUrl}
                                                    alt={`Hình giải thích câu ${idx + 1}`}
                                                    className="max-h-56 object-contain mx-auto border border-emerald-200 p-1 bg-white rounded"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Exam End Marker */}
                <div className="mt-10 pt-4 border-t border-brand-cerulean/20 text-center font-serif italic text-xs text-gray-500">
                    ---------- HẾT ----------
                </div>
            </div>
        </div>
    );
};

export default ThptExamDetailView;
