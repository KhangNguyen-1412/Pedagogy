import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Award, Check, Calendar, Clock, FileText,
    CheckCircle2, AlertCircle, Sparkles, CheckSquare, RefreshCw
} from 'lucide-react';
import { EditorialSelect } from './EditorialSelect';

export const ThptPersonalTestModal = ({
    isOpen,
    onClose,
    initialExamId = null,
    exams = [],
    subjects = [],
    onSaveResult,
    showToast
}) => {
    const [selectedExamId, setSelectedExamId] = useState(initialExamId || exams[0]?.id || '');
    const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeSpent, setTimeSpent] = useState(90);
    const [selfNotes, setSelfNotes] = useState('');
    
    // Grading mode: 'auto_sheet' (phiếu đáp án tự chấm) | 'direct_score' (nhập điểm trực tiếp)
    const [gradingMode, setGradingMode] = useState('auto_sheet');

    // For direct score mode
    const [manualScore, setManualScore] = useState('8.0');
    const [manualCorrectCount, setManualCorrectCount] = useState(4);

    // For auto-sheet mode: { [questionId]: 'A' | 'B' | 'C' | 'D' }
    const [studentAnswers, setStudentAnswers] = useState({});

    // Keep state updated when initial props change
    useEffect(() => {
        if (initialExamId) setSelectedExamId(initialExamId);
    }, [initialExamId]);

    // Active selected exam
    const activeExam = exams.find(e => e.id === selectedExamId) || exams[0];

    // Reset or initialize answers when active exam changes
    useEffect(() => {
        if (activeExam) {
            setTimeSpent(activeExam.duration || 90);
            const initAnswers = {};
            activeExam.questions?.forEach(q => {
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
        showToast?.('Đã điền toàn bộ đáp án chuẩn của đề');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedExamId) {
            alert('Vui lòng chọn đề thi bạn vừa giải.');
            return;
        }

        const finalScore = gradingMode === 'auto_sheet' ? calculatedScore : Number(manualScore);
        const finalCorrectCount = gradingMode === 'auto_sheet' ? autoCorrectCount : Number(manualCorrectCount);

        const newResult = {
            id: 'res_' + Date.now(),
            examId: selectedExamId,
            testDate,
            timeSpent: Number(timeSpent) || 90,
            score: finalScore,
            correctCount: finalCorrectCount,
            totalQuestions: totalQuestions || (gradingMode === 'auto_sheet' ? totalQuestions : 10),
            answers: studentAnswers,
            selfNotes: selfNotes.trim(),
            createdAt: new Date().toISOString()
        };

        onSaveResult(newResult);
        onClose();
        showToast?.(`Đã ghi nhận kết quả bài làm: ${finalScore} điểm`);
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
                                Ghi nhận Kết quả Làm Đề của Tôi
                            </h2>
                            <p className="text-xs opacity-80 font-sans">
                                Tự chấm bài theo phiếu trả lời trắc nghiệm & ghi chép rút kinh nghiệm cá nhân
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
                    {/* Select Exam & Date */}
                    <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1 flex items-center gap-1.5">
                                <FileText size={14} /> Chọn Đề thi tôi vừa làm *
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
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1 flex items-center gap-1.5">
                                <Calendar size={14} /> Ngày tôi làm bài
                            </label>
                            <input
                                type="date"
                                value={testDate}
                                onChange={e => setTestDate(e.target.value)}
                                className="w-full input-editorial text-sm font-body px-2 py-1.5"
                                required
                            />
                        </div>
                    </div>

                    {/* Mode Toggle & Timing */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-brand-cerulean/5 p-4 border border-brand-cerulean/15 rounded">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-serif-title font-bold text-brand-cerulean">Chế độ chấm bài:</span>
                            <button
                                type="button"
                                onClick={() => setGradingMode('auto_sheet')}
                                className={`px-3 py-1 text-xs font-sans font-bold rounded transition-all ${
                                    gradingMode === 'auto_sheet'
                                        ? 'bg-brand-cerulean text-white shadow-sm'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                📝 Tự động chấm theo Phiếu khoanh
                            </button>
                            <button
                                type="button"
                                onClick={() => setGradingMode('direct_score')}
                                className={`px-3 py-1 text-xs font-sans font-bold rounded transition-all ${
                                    gradingMode === 'direct_score'
                                        ? 'bg-brand-cerulean text-white shadow-sm'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                🔢 Nhập điểm số trực tiếp
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock size={15} className="text-brand-cerulean" />
                            <span className="text-xs font-serif text-brand-cerulean">Thời gian tôi làm (phút):</span>
                            <input
                                type="number"
                                min="1"
                                max="300"
                                value={timeSpent}
                                onChange={e => setTimeSpent(e.target.value)}
                                className="w-16 input-editorial text-xs font-mono font-bold text-center px-1 py-1"
                            />
                        </div>
                    </div>

                    {/* GRADING MODE 1: AUTO SHEET */}
                    {gradingMode === 'auto_sheet' && (
                        <div className="bg-white p-5 border border-brand-cerulean/20 shadow-sm space-y-4">
                            <div className="flex flex-wrap justify-between items-center pb-2 border-b border-brand-cerulean/15 gap-2">
                                <div>
                                    <h3 className="font-serif-title font-bold text-brand-cerulean text-sm flex items-center gap-1.5">
                                        <CheckSquare size={16} className="text-brand-jasper" />
                                        Phiếu trả lời trắc nghiệm của tôi:
                                    </h3>
                                    <p className="text-[11px] text-gray-500 font-sans">
                                        Tích chọn đáp án bạn đã làm để hệ thống đối chiếu với đáp án chuẩn của đề
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleQuickFillAllCorrect}
                                        className="text-[11px] font-sans font-bold text-brand-cerulean hover:text-brand-jasper flex items-center gap-1"
                                    >
                                        <Sparkles size={12} /> Điền thử đáp án chuẩn
                                    </button>
                                </div>
                            </div>

                            {/* Questions Answer Matrix */}
                            {(!activeExam?.questions || activeExam.questions.length === 0) ? (
                                <div className="p-8 text-center text-gray-400 text-xs font-serif">
                                    Đề thi này chưa có danh sách câu hỏi chi tiết. Hãy chuyển sang chế độ "Nhập điểm số trực tiếp".
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                                    {activeExam.questions.map((q, idx) => {
                                        const myAns = studentAnswers[q.id];
                                        const isCorrect = myAns && myAns === q.correctAnswer;
                                        const isWrong = myAns && myAns !== q.correctAnswer;

                                        return (
                                            <div
                                                key={q.id}
                                                className={`p-2.5 border rounded flex items-center justify-between transition-all ${
                                                    isCorrect
                                                        ? 'bg-emerald-50 border-emerald-300'
                                                        : isWrong
                                                            ? 'bg-red-50 border-red-300'
                                                            : 'bg-white border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-serif-title font-bold text-xs text-brand-cerulean">
                                                        Câu {idx + 1}:
                                                    </span>
                                                    {isCorrect && (
                                                        <span className="text-[10px] text-emerald-700 font-bold">✓ Đúng</span>
                                                    )}
                                                    {isWrong && (
                                                        <span className="text-[10px] text-red-600 font-bold">✗ Sai (Đ.A: {q.correctAnswer})</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {['A', 'B', 'C', 'D'].map(opt => {
                                                        const isSelected = myAns === opt;
                                                        return (
                                                            <button
                                                                key={opt}
                                                                type="button"
                                                                onClick={() => handleSelectOption(q.id, opt)}
                                                                className={`w-6 h-6 rounded-full text-xs font-bold font-sans transition-all flex items-center justify-center ${
                                                                    isSelected
                                                                        ? opt === q.correctAnswer
                                                                            ? 'bg-emerald-600 text-white shadow-sm scale-110'
                                                                            : 'bg-brand-jasper text-white shadow-sm scale-110'
                                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                                                                }`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Auto Score Summary Bar */}
                            <div className="bg-brand-cream p-4 border border-brand-cerulean/20 flex flex-wrap justify-between items-center gap-4 rounded">
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="font-serif-title text-brand-cerulean">
                                        Tổng câu: <strong>{totalQuestions}</strong>
                                    </span>
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={14} /> Đúng: {autoCorrectCount}
                                    </span>
                                    <span className="text-red-600 font-bold flex items-center gap-1">
                                        <AlertCircle size={14} /> Sai: {autoWrongCount}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-serif-title text-brand-cerulean">Điểm quy đổi:</span>
                                    <span className="text-2xl font-serif-title font-bold text-brand-jasper">
                                        {calculatedScore}
                                    </span>
                                    <span className="text-xs font-sans text-gray-500">/ 10.0</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GRADING MODE 2: DIRECT SCORE */}
                    {gradingMode === 'direct_score' && (
                        <div className="bg-white p-5 border border-brand-cerulean/20 shadow-sm space-y-4">
                            <h3 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                Nhập điểm số đạt được:
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">
                                        Điểm thi đạt được (thang 10) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        value={manualScore}
                                        onChange={e => setManualScore(e.target.value)}
                                        className="w-full input-editorial text-lg font-serif-title font-bold text-brand-jasper px-3 py-1.5"
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
                                        className="w-full input-editorial text-sm font-body px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Self Reflection & Notes */}
                    <div className="bg-white p-5 border border-brand-cerulean/20 shadow-sm space-y-2">
                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                            <Sparkles size={14} className="text-brand-jasper" />
                            Ghi chú Tự rút kinh nghiệm sau bài thi này:
                        </label>
                        <textarea
                            rows={3}
                            value={selfNotes}
                            onChange={e => setSelfNotes(e.target.value)}
                            placeholder="Ví dụ: Bị bẫy câu 34 tích phân, mất quá nhiều thời gian ở câu 40 hình học, cần tăng tốc 30 câu đầu..."
                            className="w-full input-editorial text-xs font-body p-2.5"
                        />
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-brand-cerulean/20 bg-brand-cerulean/5 flex justify-end gap-3 shrink-0 rounded">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-sans text-gray-600 hover:text-gray-900"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                            <Check size={14} /> Lưu Kết quả Bài thi
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ThptPersonalTestModal;
