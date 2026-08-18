import React, { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Flag,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Award,
    Sparkles,
    AlertCircle,
    FileText,
    Play,
    Pause,
    Send
} from 'lucide-react';
import { IELTS_MOCK_TESTS } from '../../data/ieltsData';

export const IeltsExamSimulator = ({ onSaveMockResult, showToast }) => {
    const [selectedTestId, setSelectedTestId] = useState(IELTS_MOCK_TESTS[0]?.id);
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [testMode, setTestMode] = useState('section'); // 'section' or 'full'
    const [secondsLeft, setSecondsLeft] = useState(60 * 60);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [scoreReport, setScoreReport] = useState(null);

    const activeTest = IELTS_MOCK_TESTS.find(t => t.id === selectedTestId) || IELTS_MOCK_TESTS[0];
    const currentSection = activeTest.sections[0];
    const questionsList = currentSection.questions || [];
    const currentQuestion = questionsList[activeQuestionIndex];

    // Countdown Timer
    useEffect(() => {
        let interval = null;
        if (isTestStarted && !isSubmitted && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(sec => sec - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isTestStarted && !isSubmitted) {
            handleSubmitTest();
            if (showToast) showToast('Hết thời gian thi! Hệ thống tự động thu bài.', 'info');
        }
        return () => clearInterval(interval);
    }, [isTestStarted, isSubmitted, secondsLeft]);

    const formatTimer = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStartTest = (mode) => {
        setTestMode(mode);
        setSecondsLeft(mode === 'full' ? 180 * 60 : (activeTest.durationMinutes || 60) * 60);
        setAnswers({});
        setFlaggedQuestions({});
        setIsSubmitted(false);
        setScoreReport(null);
        setActiveQuestionIndex(0);
        setIsTestStarted(true);
    };

    const handleSelectOption = (qId, optionIdx) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: optionIdx
        }));
    };

    const handleSelectTFNG = (qId, val) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: val
        }));
    };

    const toggleFlag = (qIndex) => {
        setFlaggedQuestions(prev => ({
            ...prev,
            [qIndex]: !prev[qIndex]
        }));
    };

    const handleSubmitTest = () => {
        let rawScore = 0;
        const total = questionsList.length;
        const reviewDetails = [];

        questionsList.forEach((q, idx) => {
            const userAns = answers[q.id];
            let isCorrect = false;

            if (q.type === 'MCQ') {
                isCorrect = userAns === q.correctIndex;
            } else if (q.type === 'TFNG') {
                isCorrect = userAns === q.correctAnswer;
            }

            if (isCorrect) rawScore++;

            reviewDetails.push({
                index: idx + 1,
                id: q.id,
                question: q.question,
                userAnswer: userAns !== undefined ? (q.type === 'MCQ' ? q.options[userAns] : userAns) : 'Chưa trả lời',
                correctAnswer: q.type === 'MCQ' ? q.options[q.correctIndex] : q.correctAnswer,
                isCorrect
            });
        });

        // Approximate Band Score conversion
        const percentage = rawScore / Math.max(total, 1);
        let band = '5.0';
        if (percentage >= 0.9) band = '8.5 - 9.0';
        else if (percentage >= 0.8) band = '7.5 - 8.0';
        else if (percentage >= 0.65) band = '6.5 - 7.0';
        else if (percentage >= 0.5) band = '5.5 - 6.0';

        const report = {
            testId: activeTest.id,
            testTitle: activeTest.title,
            rawScore,
            totalQuestions: total,
            estimatedBand: band,
            details: reviewDetails,
            completedAt: new Date().toISOString()
        };

        setScoreReport(report);
        setIsSubmitted(true);
        setIsTestStarted(false);

        if (onSaveMockResult) {
            onSaveMockResult(report);
        }
        if (showToast) {
            showToast(`Nộp bài thi thành công! Điểm ước tính: Band ${band}`, 'success');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Phòng Thi Thử (Simulator)</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Mô phỏng thi máy Computer-delivered IELTS (Section & Full Test 3h) kèm Score Card.</p>
                </div>
                {isTestStarted && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3.5 py-1.5 border border-brand-cerulean bg-white font-mono font-bold text-sm text-brand-cerulean shadow-editorial">
                            <Clock size={16} className="text-brand-jasper animate-pulse" />
                            <span>{formatTimer(secondsLeft)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* LOBBY / PRE-TEST SELECTION (When test has not started and not submitted) */}
            {!isTestStarted && !isSubmitted && (
                <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                    <div className="border-b border-brand-cerulean/20 pb-4">
                        <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                            Chọn Chế Độ Luyện Thi Thử
                        </h3>
                        <p className="text-xs font-newsreader text-gray-600 mt-1">
                            Trải nghiệm áp lực phòng thi thật với đồng hồ đếm ngược, bảng palette chuyển câu và chấm điểm chuẩn band.
                        </p>
                    </div>

                    {/* Test Modes Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mode 1: Section Test */}
                        <div className="border border-brand-cerulean/25 bg-brand-cream/30 p-6 flex flex-col justify-between hover:border-brand-cerulean transition-all">
                            <div className="space-y-3">
                                <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean px-2.5 py-0.5 bg-white border border-brand-cerulean/30">
                                    Luyện Từng Kỹ Năng
                                </span>
                                <h4 className="text-xl font-serif-title font-bold text-brand-cerulean">
                                    Section Test (Reading 60 Phút)
                                </h4>
                                <p className="text-xs font-newsreader text-gray-700 leading-relaxed">
                                    Tập trung hoàn thành bài đọc học thuật với các dạng câu hỏi kinh điển (Multiple Choice, True/False/Not Given) trong 60 phút.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleStartTest('section')}
                                className="mt-6 w-full py-2.5 bg-brand-cerulean hover:bg-brand-cerulean/90 text-white font-serif-title font-bold text-xs shadow-editorial transition-all flex items-center justify-center gap-2"
                            >
                                <Play size={15} /> Bắt Đầu Bài Thi Section
                            </button>
                        </div>

                        {/* Mode 2: Full Mock Test */}
                        <div className="border border-brand-jasper/40 bg-red-50/20 p-6 flex flex-col justify-between hover:border-brand-jasper transition-all">
                            <div className="space-y-3">
                                <span className="text-xs font-serif-title font-bold uppercase text-brand-jasper px-2.5 py-0.5 bg-white border border-red-200">
                                    Mô Phỏng Toàn Diện
                                </span>
                                <h4 className="text-xl font-serif-title font-bold text-brand-cerulean">
                                    Full Mock Test (3 Tiếng Liên Tục)
                                </h4>
                                <p className="text-xs font-newsreader text-gray-700 leading-relaxed">
                                    Thử thách sức bền tâm lý và khả năng duy trì tập trung với chuỗi liên hoàn Listening (30p) + Reading (60p) + Writing (60p).
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleStartTest('full')}
                                className="mt-6 w-full py-2.5 bg-brand-jasper hover:bg-red-800 text-white font-serif-title font-bold text-xs shadow-editorial transition-all flex items-center justify-center gap-2"
                            >
                                <Play size={15} /> Bắt Đầu Full Test (3 Tiếng)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LIVE EXAM ROOM (SPLIT SCREEN SIMULATION) */}
            {isTestStarted && !isSubmitted && (
                <div className="space-y-6">
                    {/* Top Palette Navigation */}
                    <div className="border-editorial p-4 bg-white shadow-editorial flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-serif-title uppercase font-bold text-gray-500 mr-1">Bảng câu hỏi:</span>
                            {questionsList.map((q, idx) => {
                                const isAnswered = answers[q.id] !== undefined;
                                const isFlagged = flaggedQuestions[idx];
                                const isCurrent = idx === activeQuestionIndex;

                                return (
                                    <button
                                        key={q.id}
                                        type="button"
                                        onClick={() => setActiveQuestionIndex(idx)}
                                        className={`w-7 h-7 text-xs font-mono font-bold border transition-all flex items-center justify-center relative ${
                                            isCurrent
                                                ? 'bg-brand-cerulean text-white border-brand-cerulean'
                                                : isAnswered
                                                    ? 'bg-blue-50 text-brand-cerulean border-brand-cerulean/40'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {idx + 1}
                                        {isFlagged && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-jasper rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmitTest}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-jasper text-white text-xs font-serif-title font-bold hover:bg-red-800 shadow-editorial"
                        >
                            <Send size={13} /> Nộp Bài Thi
                        </button>
                    </div>

                    {/* Split View: Passage (Left) + Question (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Screen: Passage (7 Cols) */}
                        <div className="lg:col-span-7 border-editorial bg-white p-6 shadow-editorial space-y-3">
                            <span className="text-xs font-serif-title uppercase font-bold text-brand-cerulean bg-blue-50 px-2.5 py-0.5 border border-blue-200">
                                Reading Passage 1
                            </span>
                            <h3 className="font-serif-title font-bold text-brand-cerulean text-lg">
                                {currentSection.passageTitle}
                            </h3>
                            <div className="text-xs font-newsreader text-gray-800 leading-relaxed max-h-[500px] overflow-y-auto p-4 bg-brand-cream/30 border border-brand-cerulean/15 whitespace-pre-line">
                                {currentSection.passageText}
                            </div>
                        </div>

                        {/* Right Screen: Current Question (5 Cols) */}
                        <div className="lg:col-span-5 border-editorial bg-white p-6 shadow-editorial space-y-4">
                            <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-2">
                                <span className="text-xs font-mono font-bold text-brand-cerulean">
                                    Câu {activeQuestionIndex + 1} / {questionsList.length}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => toggleFlag(activeQuestionIndex)}
                                    className={`flex items-center gap-1 text-xs font-serif-title font-bold ${
                                        flaggedQuestions[activeQuestionIndex] ? 'text-brand-jasper' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Flag size={14} /> {flaggedQuestions[activeQuestionIndex] ? 'Đã đánh dấu cờ' : 'Đánh dấu xem lại'}
                                </button>
                            </div>

                            {currentQuestion && (
                                <div className="space-y-4">
                                    <p className="text-sm font-sans font-bold text-gray-900 leading-relaxed">
                                        {currentQuestion.question}
                                    </p>

                                    {/* Multiple Choice Options */}
                                    {currentQuestion.type === 'MCQ' && (
                                        <div className="space-y-2">
                                            {currentQuestion.options.map((opt, oIdx) => (
                                                <label
                                                    key={oIdx}
                                                    className={`p-3 border text-xs font-sans flex items-center gap-2.5 cursor-pointer transition-all ${
                                                        answers[currentQuestion.id] === oIdx
                                                            ? 'border-brand-cerulean bg-blue-50/70 font-bold text-brand-cerulean'
                                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`q_${currentQuestion.id}`}
                                                        checked={answers[currentQuestion.id] === oIdx}
                                                        onChange={() => handleSelectOption(currentQuestion.id, oIdx)}
                                                        className="text-brand-cerulean"
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {/* True/False/Not Given Options */}
                                    {currentQuestion.type === 'TFNG' && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {['TRUE', 'FALSE', 'NOT GIVEN'].map((choice) => (
                                                <button
                                                    key={choice}
                                                    type="button"
                                                    onClick={() => handleSelectTFNG(currentQuestion.id, choice)}
                                                    className={`p-2.5 border text-xs font-mono font-bold transition-all ${
                                                        answers[currentQuestion.id] === choice
                                                            ? 'border-brand-cerulean bg-brand-cerulean text-white shadow-xs'
                                                            : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                                                    }`}
                                                >
                                                    {choice}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Navigation Next/Prev */}
                                    <div className="flex items-center justify-between pt-4 border-t border-brand-cerulean/15">
                                        <button
                                            type="button"
                                            disabled={activeQuestionIndex === 0}
                                            onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                                            className="px-3 py-1.5 border border-gray-300 text-xs font-serif-title font-bold text-gray-700 disabled:opacity-30"
                                        >
                                            ← Câu trước
                                        </button>
                                        <button
                                            type="button"
                                            disabled={activeQuestionIndex === questionsList.length - 1}
                                            onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                                            className="px-3 py-1.5 bg-brand-cerulean text-white text-xs font-serif-title font-bold disabled:opacity-30 shadow-xs"
                                        >
                                            Câu tiếp theo →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SCORE REPORT & POST-EXAM REVIEW */}
            {isSubmitted && scoreReport && (
                <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6 animate-fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-cerulean/20 pb-4">
                        <div>
                            <span className="text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-300">
                                Báo Cáo Kết Quả Thi Thử
                            </span>
                            <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1.5">
                                {scoreReport.testTitle}
                            </h3>
                        </div>

                        <div className="text-right">
                            <span className="text-xs font-mono text-gray-500 block">Ước tính Band điểm:</span>
                            <span className="text-3xl font-mono font-bold text-brand-jasper">
                                Band {scoreReport.estimatedBand}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/20">
                            <span className="text-xs font-serif-title uppercase font-bold text-gray-500 block">Số Câu Đúng:</span>
                            <strong className="text-xl font-mono text-brand-cerulean">{scoreReport.rawScore} / {scoreReport.totalQuestions}</strong>
                        </div>
                        <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/20">
                            <span className="text-xs font-serif-title uppercase font-bold text-gray-500 block">Độ Chính Xác:</span>
                            <strong className="text-xl font-mono text-emerald-800">
                                {Math.round((scoreReport.rawScore / scoreReport.totalQuestions) * 100)}%
                            </strong>
                        </div>
                        <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/20">
                            <span className="text-xs font-serif-title uppercase font-bold text-gray-500 block">Thời Gian Hoàn Thành:</span>
                            <strong className="text-xs font-mono text-gray-700 block mt-1">{new Date(scoreReport.completedAt).toLocaleString('vi-VN')}</strong>
                        </div>
                    </div>

                    {/* Review Answers List */}
                    <div className="space-y-3 pt-2">
                        <h4 className="font-serif-title font-bold text-brand-cerulean text-lg border-b border-brand-cerulean/15 pb-2">
                            Chi Tiết Từng Câu Trả Lời:
                        </h4>

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {scoreReport.details.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-3.5 border text-xs font-sans flex items-start justify-between gap-4 ${
                                        item.isCorrect ? 'bg-emerald-50/40 border-emerald-300' : 'bg-red-50/40 border-red-300'
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <span className="font-bold text-gray-900 block">
                                            Câu {item.index}: {item.question}
                                        </span>
                                        <div className="text-[11px] text-gray-700 font-mono">
                                            Đáp án của bạn: <strong>{item.userAnswer}</strong>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        {item.isCorrect ? (
                                            <span className="text-emerald-800 font-bold font-mono">✓ Đúng (+1)</span>
                                        ) : (
                                            <div className="text-right">
                                                <span className="text-red-700 font-bold font-mono block">✗ Sai</span>
                                                <span className="text-[11px] text-emerald-800 font-mono">Chuẩn: {item.correctAnswer}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-brand-cerulean/20">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSubmitted(false);
                                setIsTestStarted(false);
                            }}
                            className="px-6 py-2 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 shadow-editorial"
                        >
                            Quay Lại Sảnh Thi Thử
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
