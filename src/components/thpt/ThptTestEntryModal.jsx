import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Award, Check, Calendar, Clock, User, FileText,
    CheckCircle2, AlertCircle, Sparkles, CheckSquare, RefreshCw
} from 'lucide-react';
import { EditorialSelect } from './EditorialSelect';
import { EditorialDatePicker } from './EditorialDatePicker';

export const ThptTestEntryModal = ({
    isOpen,
    onClose,
    initialStudentId = null,
    initialExamId = null,
    students = [],
    exams = [],
    subjects = [],
    onSaveResult,
    showToast
}) => {
    const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || students[0]?.id || '');
    const [selectedExamId, setSelectedExamId] = useState(initialExamId || exams[0]?.id || '');
    const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeSpent, setTimeSpent] = useState(90);
    const [teacherFeedback, setTeacherFeedback] = useState('');
    
    // Grading mode: 'auto_sheet' (phiếu đáp án tự chấm) | 'direct_score' (nhập điểm trực tiếp)
    const [gradingMode, setGradingMode] = useState('auto_sheet');

    // For direct score mode
    const [manualScore, setManualScore] = useState('8.0');
    const [manualCorrectCount, setManualCorrectCount] = useState(4);

    // For auto-sheet mode: { [questionId]: 'A' | 'B' | 'C' | 'D' }
    const [studentAnswers, setStudentAnswers] = useState({});

    // Keep state updated when initial props change
    useEffect(() => {
        if (initialStudentId) setSelectedStudentId(initialStudentId);
        if (initialExamId) setSelectedExamId(initialExamId);
    }, [initialStudentId, initialExamId]);

    // Active selected exam
    const activeExam = exams.find(e => e.id === selectedExamId) || exams[0];

    // Reset or initialize answers when active exam changes
    useEffect(() => {
        if (activeExam) {
            setTimeSpent(activeExam.duration || 90);
            const initAnswers = {};
            activeExam.questions?.forEach(q => {
                // Default empty or preserve if present
                initAnswers[q.id] = studentAnswers[q.id] || '';
            });
            setStudentAnswers(initAnswers);
        }
    }, [selectedExamId]);

    if (!isOpen) return null;

    // Calculate auto grade results
    const totalQuestions = activeExam?.questions?.length || 0;
    let autoCorrectCount = 0;
    let autoWrongCount = 0;

    if (activeExam?.questions) {
        activeExam.questions.forEach(q => {
            if (studentAnswers[q.id] && studentAnswers[q.id] === q.correctAnswer) {
                autoCorrectCount++;
            } else if (studentAnswers[q.id]) {
                autoWrongCount++;
            }
        });
    }

    const calculatedScore = totalQuestions > 0
        ? Number(((autoCorrectCount / totalQuestions) * 10).toFixed(2))
        : 0;

    const handleSelectOption = (questionId, optionId) => {
        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleQuickFillAllCorrect = () => {
        if (!activeExam?.questions) return;
        const allCorrect = {};
        activeExam.questions.forEach(q => {
            allCorrect[q.id] = q.correctAnswer || 'A';
        });
        setStudentAnswers(allCorrect);
        showToast?.('Đã điền nhanh toàn bộ đáp án đúng');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedExamId) {
            alert('Vui lòng chọn Học viên và Đề thi.');
            return;
        }

        const finalScore = gradingMode === 'auto_sheet' ? calculatedScore : Number(manualScore);
        const finalCorrectCount = gradingMode === 'auto_sheet' ? autoCorrectCount : Number(manualCorrectCount);

        const newResult = {
            id: 'res_' + Date.now(),
            studentId: selectedStudentId,
            examId: selectedExamId,
            testDate,
            timeSpent: Number(timeSpent) || 90,
            score: finalScore,
            correctCount: finalCorrectCount,
            totalQuestions: totalQuestions || (gradingMode === 'auto_sheet' ? totalQuestions : 10),
            answers: studentAnswers,
            teacherFeedback: teacherFeedback.trim(),
            createdAt: new Date().toISOString()
        };

        onSaveResult(newResult);
        onClose();
        showToast?.(`Đã lưu kết quả bài thi: ${finalScore} điểm`);
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-brand-cerulean/50 backdrop-blur-sm animate-backdrop-in">
            <div className="bg-brand-cream border-editorial shadow-2xl w-full max-w-4xl h-[680px] max-h-[92vh] flex flex-col animate-modal-pop-in overflow-hidden">
                {/* Modal Header */}
                <div className="p-5 border-b border-brand-cerulean/20 flex justify-between items-center bg-brand-cerulean text-brand-cream shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded">
                            <Award size={22} className="text-brand-cream" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif-title font-bold tracking-wide">
                                Nhập Kết quả & Chấm bài thi THPT
                            </h2>
                            <p className="text-xs opacity-80 font-sans">
                                Ghi nhận điểm số, tự động đối chiếu phiếu trả lời & lưu trữ tiến độ
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

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Select Student & Exam */}
                    <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1 flex items-center gap-1.5">
                                <User size={14} /> Chọn Học viên làm bài *
                            </label>
                            <EditorialSelect
                                value={selectedStudentId}
                                onChange={setSelectedStudentId}
                                options={students.map(s => ({
                                    value: s.id,
                                    label: `${s.fullName} (${s.studentCode || 'HS'}) - Lớp ${s.grade || '12'}`
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1 flex items-center gap-1.5">
                                <FileText size={14} /> Chọn Đề thi đã làm *
                            </label>
                            <EditorialSelect
                                value={selectedExamId}
                                onChange={setSelectedExamId}
                                options={exams.map(e => ({
                                    value: e.id,
                                    label: `[${e.code || 'MĐ'}] ${e.title} (${e.questions?.length || 0} câu)`
                                }))}
                            />
                        </div>

                        <div>
                            <EditorialDatePicker
                                label="Ngày kiểm tra"
                                value={testDate}
                                onChange={setTestDate}
                                isRange={false}
                                placeholder="Chọn ngày kiểm tra..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1 flex items-center gap-1.5">
                                <Clock size={14} /> Thời gian làm bài (phút)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="300"
                                value={timeSpent}
                                onChange={e => setTimeSpent(e.target.value)}
                                className="w-full input-editorial text-sm font-body px-2 py-1.5"
                            />
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex border-b border-brand-cerulean/20 gap-4">
                        <button
                            type="button"
                            onClick={() => setGradingMode('auto_sheet')}
                            className={`pb-2.5 px-2 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                                gradingMode === 'auto_sheet'
                                    ? 'border-brand-jasper text-brand-jasper'
                                    : 'border-transparent text-gray-500 hover:text-brand-cerulean'
                            }`}
                        >
                            <CheckSquare size={16} /> Chấm theo Phiếu trả lời (Tự động tính điểm)
                        </button>
                        <button
                            type="button"
                            onClick={() => setGradingMode('direct_score')}
                            className={`pb-2.5 px-2 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                                gradingMode === 'direct_score'
                                    ? 'border-brand-jasper text-brand-jasper'
                                    : 'border-transparent text-gray-500 hover:text-brand-cerulean'
                            }`}
                        >
                            <Award size={16} /> Nhập điểm số trực tiếp
                        </button>
                    </div>

                    {/* GRADING MODE 1: AUTO ANSWER SHEET */}
                    {gradingMode === 'auto_sheet' && (
                        <div className="space-y-4">
                            {/* Live Score Counter Banner */}
                            <div className="p-4 bg-white border border-brand-cerulean/20 shadow-sm flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <span className="text-[11px] text-gray-500 uppercase block font-serif">Số câu đúng</span>
                                        <strong className="text-xl font-serif-title text-emerald-700">
                                            {autoCorrectCount} / {totalQuestions}
                                        </strong>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200" />
                                    <div>
                                        <span className="text-[11px] text-gray-500 uppercase block font-serif">Số câu sai</span>
                                        <strong className="text-xl font-serif-title text-red-600">
                                            {autoWrongCount} câu
                                        </strong>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200" />
                                    <div>
                                        <span className="text-[11px] text-gray-500 uppercase block font-serif">Điểm quy đổi (Thang 10)</span>
                                        <strong className="text-2xl font-serif-title text-brand-jasper">
                                            {calculatedScore} đ
                                        </strong>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleQuickFillAllCorrect}
                                    className="px-3 py-1.5 bg-brand-cerulean/10 hover:bg-brand-cerulean hover:text-white text-brand-cerulean text-xs font-bold rounded flex items-center gap-1 transition-colors"
                                >
                                    <Sparkles size={13} /> Điền thử đáp án chuẩn 10đ
                                </button>
                            </div>

                            {/* Answer Sheet Grid */}
                            <div className="bg-white p-5 border border-brand-cerulean/20 shadow-sm space-y-3">
                                <h4 className="font-serif-title font-bold text-xs text-brand-cerulean uppercase tracking-wider">
                                    Phiếu tích chọn đáp án học viên đã làm:
                                </h4>

                                {activeExam?.questions?.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic py-4 text-center">
                                        Đề thi này chưa có câu hỏi nào.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
                                        {activeExam?.questions?.map((q, idx) => {
                                            const studentChosen = studentAnswers[q.id];
                                            const isCorrect = studentChosen && studentChosen === q.correctAnswer;
                                            const isWrong = studentChosen && studentChosen !== q.correctAnswer;

                                            return (
                                                <div
                                                    key={q.id}
                                                    className={`p-2.5 border rounded flex items-center justify-between transition-colors ${
                                                        isCorrect
                                                            ? 'bg-emerald-50/60 border-emerald-400'
                                                            : isWrong
                                                                ? 'bg-red-50/60 border-red-300'
                                                                : 'bg-brand-cream/30 border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-serif-title font-bold text-brand-cerulean text-xs">
                                                            Câu {idx + 1}:
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-mono">
                                                            (ĐA: {typeof q.correctAnswer === 'string' ? q.correctAnswer : 'Đ/S'})
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        {['A', 'B', 'C', 'D'].map(optLetter => (
                                                            <button
                                                                key={optLetter}
                                                                type="button"
                                                                onClick={() => handleSelectOption(q.id, optLetter)}
                                                                className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                                                                    studentChosen === optLetter
                                                                        ? optLetter === q.correctAnswer
                                                                            ? 'bg-emerald-600 text-white shadow-sm'
                                                                            : 'bg-red-600 text-white shadow-sm'
                                                                        : 'bg-white border border-gray-300 text-gray-700 hover:border-brand-cerulean'
                                                                }`}
                                                            >
                                                                {optLetter}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* GRADING MODE 2: DIRECT SCORE */}
                    {gradingMode === 'direct_score' && (
                        <div className="bg-white p-5 border border-brand-cerulean/20 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">
                                    Điểm số đạt được (Thang 10) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={manualScore}
                                    onChange={e => setManualScore(e.target.value)}
                                    className="w-full input-editorial text-lg font-serif-title font-bold text-brand-jasper px-2 py-1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">
                                    Số câu trả lời đúng
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={manualCorrectCount}
                                    onChange={e => setManualCorrectCount(e.target.value)}
                                    className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                />
                            </div>
                        </div>
                    )}

                    {/* Teacher Feedback */}
                    <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm space-y-2">
                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean">
                            Nhận xét & Dặn dò của Giáo viên cho bài làm này:
                        </label>
                        <textarea
                            rows={2}
                            value={teacherFeedback}
                            onChange={e => setTeacherFeedback(e.target.value)}
                            placeholder="Vd: Bài làm tiến bộ rõ rệt phần Tích phân, cần chú ý tính toán cẩn thận phần Hình Oxyz..."
                            className="w-full p-2.5 bg-brand-cream/40 border border-brand-cerulean/20 rounded font-body text-xs text-brand-ink focus:outline-none focus:border-brand-jasper"
                        />
                    </div>

                    {/* Submit Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border border-gray-300 font-sans text-xs font-bold text-gray-700"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-7 py-2 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                        >
                            <Check size={16} /> Lưu Kết quả & Điểm số
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ThptTestEntryModal;
