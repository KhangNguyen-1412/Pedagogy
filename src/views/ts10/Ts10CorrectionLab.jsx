import React, { useState } from 'react';
import {
    FileCheck2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Upload,
    Plus,
    FileText,
    Award,
    Edit3,
    Sparkles,
    Trash2,
    Send
} from 'lucide-react';
import { TS10_SAMPLE_CORRECTIONS } from '../../data/ts10Data';
import { MathText } from '../../components/common/MathText';

export const Ts10CorrectionLab = ({ submissions = [], onSaveSubmission, showToast }) => {
    const allSubmissions = [...TS10_SAMPLE_CORRECTIONS, ...submissions];
    const [selectedSubId, setSelectedSubId] = useState(allSubmissions[0]?.id);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Upload new essay state
    const [newSubject, setNewSubject] = useState('Toán học');
    const [newExamName, setNewExamName] = useState('');
    const [newProblemTitle, setNewProblemTitle] = useState('');
    const [newText, setNewText] = useState('');

    const activeSubmission = allSubmissions.find(s => s.id === selectedSubId) || allSubmissions[0];

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!newProblemTitle.trim() || !newText.trim()) {
            if (showToast) showToast('Vui lòng nhập tên câu hỏi và nội dung bài làm!', 'error');
            return;
        }

        const newSub = {
            id: 'sub_custom_' + Date.now(),
            subject: newSubject,
            studentName: 'Học sinh (Bạn)',
            examName: newExamName || 'Bài Tự Luyện Tự Luận',
            problemTitle: newProblemTitle,
            maxScore: newSubject === 'Toán học' ? 2.0 : 2.0,
            gradedScore: 1.5,
            submissionImageText: newText,
            teacherAnnotations: [
                {
                    line: 'Đoạn đầu bài làm',
                    type: 'NHẬN XÉT SƠ BỘ',
                    points: '+1.50 điểm',
                    comment: '✅ Bài làm đã gửi thành công vào hệ thống. Giáo viên chuyên môn đang tiến hành chấm và phân tích chi tiết barem 0.25đ cho bạn!'
                }
            ],
            rubricBreakdown: [
                { criterion: 'Trình bày đúng quy cách & Đầy đủ các bước', max: 1.0, earned: 0.75, note: 'Tốt' },
                { criterion: 'Tính toán / Lập luận chính xác', max: 1.0, earned: 0.75, note: 'Khá' }
            ]
        };

        if (onSaveSubmission) {
            onSaveSubmission(newSub);
        }
        setSelectedSubId(newSub.id);
        setIsUploadModalOpen(false);
        setNewExamName('');
        setNewProblemTitle('');
        setNewText('');
        if (showToast) showToast('Đã nộp bài tự luận thành công để chấm điểm!', 'success');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Chấm Bài Tự Luận (0.25đ)</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Không gian nộp & chấm bài tự luận Toán, Văn có bút đỏ của giáo viên và barem chi tiết.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-jasper text-brand-cream font-serif-title hover:bg-red-800 transition-colors shadow-editorial whitespace-nowrap"
                    >
                        <Plus size={18} /> Nộp bài tự luận
                    </button>
                </div>
            </div>

            {/* Submissions Bar - Editorial Style */}
            <div className="border-editorial p-4 bg-white shadow-editorial flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-serif-title uppercase font-bold text-gray-500 mr-2">Chọn Bài Chấm:</span>
                    {allSubmissions.map(sub => (
                        <button
                            key={sub.id}
                            type="button"
                            onClick={() => setSelectedSubId(sub.id)}
                            className={`px-3 py-1.5 text-xs font-serif-title font-bold transition-all border ${
                                selectedSubId === sub.id
                                    ? 'bg-brand-jasper text-white border-brand-jasper shadow-xs'
                                    : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cerulean/10'
                            }`}
                        >
                            [{sub.subject}] {sub.problemTitle.slice(0, 25)}... ({sub.gradedScore}/{sub.maxScore}đ)
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Submission Paper & Grading Suite */}
            {activeSubmission && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Student Submission Paper (7 Cols) */}
                    <div className="lg:col-span-7 border-editorial bg-white p-6 shadow-editorial space-y-4">
                        <div className="border-b border-brand-cerulean/20 pb-3 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean bg-brand-cerulean/10 px-2 py-0.5 border border-brand-cerulean/30">
                                    Môn {activeSubmission.subject} • {activeSubmission.studentName}
                                </span>
                                <h3 className="text-xl font-serif-title font-bold text-brand-cerulean mt-1.5">
                                    <MathText text={activeSubmission.problemTitle} />
                                </h3>
                                <p className="text-xs font-newsreader text-gray-500 italic">
                                    Kỳ thi: {activeSubmission.examName}
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="text-xs font-mono text-gray-500 block">Điểm đạt được:</span>
                                <span className="text-2xl font-mono font-bold text-brand-jasper">
                                    {activeSubmission.gradedScore} / {activeSubmission.maxScore}đ
                                </span>
                            </div>
                        </div>

                        {/* Submission Paper Body */}
                        <div className="space-y-2">
                            <span className="text-xs font-serif-title uppercase font-bold text-gray-600 block">
                                Nội Dung Bài Làm Của Thí Sinh:
                            </span>
                            <div className="bg-brand-cream/30 border border-brand-cerulean/20 p-5 font-mono text-xs text-gray-800 whitespace-pre-line leading-relaxed shadow-inner">
                                <MathText text={activeSubmission.submissionImageText} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Teacher Annotations & Rubrics (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Red Pen Teacher Annotations Box */}
                        <div className="border-editorial border-brand-jasper/40 bg-white p-6 shadow-editorial space-y-4">
                            <div className="flex items-center gap-2 text-sm font-serif-title font-bold text-brand-jasper border-b border-red-100 pb-2">
                                <Edit3 size={18} /> Ghi Chú Bút Đỏ Của Giáo Viên (Teacher Annotations)
                            </div>

                            <div className="space-y-3">
                                {activeSubmission.teacherAnnotations.map((anno, aIdx) => (
                                    <div
                                        key={aIdx}
                                        className="bg-red-50/60 border border-red-200 p-3.5 space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                                            <span className="text-red-900">{anno.line}</span>
                                            <span className={anno.penalty ? 'text-red-700' : 'text-emerald-700'}>
                                                {anno.penalty || anno.points}
                                            </span>
                                        </div>
                                        <div className="text-xs font-newsreader text-red-950 leading-relaxed">
                                            <MathText text={anno.comment} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 0.25 Point Rubric Breakdown */}
                        <div className="border-editorial bg-white p-6 shadow-editorial space-y-3">
                            <h4 className="text-sm font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                Bảng Phân Tách Barem Điểm Chi Tiết
                            </h4>

                            <div className="space-y-2">
                                {activeSubmission.rubricBreakdown.map((rub, rIdx) => (
                                    <div
                                        key={rIdx}
                                        className="p-3 bg-brand-cream/60 border border-brand-cerulean/15 flex items-center justify-between text-xs font-newsreader"
                                    >
                                        <div className="space-y-0.5 max-w-[70%]">
                                            <span className="font-bold text-gray-800 block"><MathText text={rub.criterion} /></span>
                                            <span className="text-[11px] text-gray-500 italic">{rub.note}</span>
                                        </div>
                                        <span className="font-mono font-bold text-brand-cerulean shrink-0">
                                            {rub.earned} / {rub.max}đ
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Upload New Submission */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white max-w-xl w-full p-6 md:p-8 space-y-5 border-editorial shadow-editorial">
                        <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-xl font-serif-title font-bold text-brand-cerulean">
                                Nộp Bài Làm Tự Luận Để Chấm Điểm
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-serif-title uppercase font-bold text-gray-600 block mb-1">
                                        Môn Học
                                    </label>
                                    <select
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        className="w-full p-2.5 bg-brand-cream border border-brand-cerulean text-xs font-sans"
                                    >
                                        <option value="Toán học">Toán học (Barem 0.25đ)</option>
                                        <option value="Ngữ Văn">Ngữ Văn (Đoạn 200 chữ/Nghị luận)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-serif-title uppercase font-bold text-gray-600 block mb-1">
                                        Kỳ Thi / Đợt Thi
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Thi Thử Tháng 3/2026"
                                        value={newExamName}
                                        onChange={(e) => setNewExamName(e.target.value)}
                                        className="w-full p-2.5 bg-brand-cream border border-brand-cerulean text-xs font-sans"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-serif-title uppercase font-bold text-gray-600 block mb-1">
                                    Tên Câu Hỏi / Đề Bài
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Câu 2 - Hệ thức Vi-ét và điều kiện tham số m"
                                    value={newProblemTitle}
                                    onChange={(e) => setNewProblemTitle(e.target.value)}
                                    className="w-full p-2.5 bg-brand-cream border border-brand-cerulean text-xs font-sans"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-serif-title uppercase font-bold text-gray-600 block mb-1">
                                    Nội Dung Bài Làm Tự Luận
                                </label>
                                <textarea
                                    rows={8}
                                    placeholder="Nhập chi tiết từng bước giải hoặc đoạn văn của bạn..."
                                    value={newText}
                                    onChange={(e) => setNewText(e.target.value)}
                                    className="w-full p-3 bg-brand-cream border border-brand-cerulean text-xs font-mono leading-relaxed"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-xs font-serif-title hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-brand-jasper text-white text-xs font-serif-title hover:bg-red-800 shadow-editorial"
                                >
                                    <Send size={14} /> Gửi bài chấm điểm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
