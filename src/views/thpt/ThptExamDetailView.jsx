import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    ArrowLeft, Printer, Edit2, Eye, EyeOff, CheckCircle2, Clock,
    BookOpen, Calendar, Tag, Share2, Award, FileText, Check, Play, X,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers, LayoutGrid, Sparkles,
    Pause, RotateCcw, Send, AlertCircle, Minimize2, Maximize2, HelpCircle,
    GripHorizontal, AlertTriangle, ShieldCheck, Flame, Focus, CheckSquare,
    Image as ImageIcon, UploadCloud, Trash2, ZoomIn, FileCheck, PenTool, Volume2, Quote
} from 'lucide-react';
import { MathText } from '../../components/common/MathText';

export const ThptExamDetailView = ({
    exam,
    exams = [],
    subjects = [],
    years = [],
    examTypes = [],
    onBack,
    onEditExam,
    onSaveResult,
    showToast
}) => {
    const [showAnswers, setShowAnswers] = useState(false);
    const [selectedZoomImage, setSelectedZoomImage] = useState(null);
    
    // Pagination state
    const [pageSize, setPageSize] = useState(10); // 5, 10, 20, 1 (focus mode), 'sections', 'all'
    const [currentPage, setCurrentPage] = useState(1);

    // Pre-test Confirmation Modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Live Test Taking Session with 2 Widgets
    const [isTakingTest, setIsTakingTest] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false); // Zen Focus Mode
    const [timeRemaining, setTimeRemaining] = useState(90 * 60); // seconds
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [studentAnswers, setStudentAnswers] = useState({});
    const [isAnswerSheetCollapsed, setIsAnswerSheetCollapsed] = useState(false);
    const [testResultSummary, setTestResultSummary] = useState(null);
    const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
    const [manualEssayScores, setManualEssayScores] = useState({});

    // Draggable Position States for the 2 Widgets
    const [timerPos, setTimerPos] = useState({ x: 0, y: 0, isCustom: false });
    const [sheetPos, setSheetPos] = useState({ x: 0, y: 0, isCustom: false });

    // Dragging refs
    const isDraggingTimerRef = useRef(false);
    const timerDragOffsetRef = useRef({ x: 0, y: 0 });

    const isDraggingSheetRef = useRef(false);
    const sheetDragOffsetRef = useRef({ x: 0, y: 0 });

    const timerRef = useRef(null);

    if (!exam) return null;

    const subject = subjects.find(s => s.id === exam.subjectId) || { name: 'Môn thi', color: '#124874' };
    const examType = examTypes.find(t => t.id === exam.examTypeId) || { name: 'Đề thi' };
    const questions = exam.questions || [];
    const totalQuestions = questions.length;
    const totalDurationSeconds = (exam.duration || 90) * 60;

    // Countdown Timer Effect
    useEffect(() => {
        if (isTakingTest && !isTimerPaused && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmitTest(true); // Auto submit on timeout
                        return 0;
                    }
                    return prev - 1;
                });
                setTimeSpentSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isTakingTest, isTimerPaused, timeRemaining]);

    // Handle Global Drag Listeners
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDraggingTimerRef.current) {
                const newX = Math.max(10, Math.min(window.innerWidth - 240, e.clientX - timerDragOffsetRef.current.x));
                const newY = Math.max(10, Math.min(window.innerHeight - 80, e.clientY - timerDragOffsetRef.current.y));
                setTimerPos({ x: newX, y: newY, isCustom: true });
            }
            if (isDraggingSheetRef.current) {
                const newX = Math.max(10, Math.min(window.innerWidth - 320, e.clientX - sheetDragOffsetRef.current.x));
                const newY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - sheetDragOffsetRef.current.y));
                setSheetPos({ x: newX, y: newY, isCustom: true });
            }
        };

        const handleMouseUp = () => {
            isDraggingTimerRef.current = false;
            isDraggingSheetRef.current = false;
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 0) return;
            const touch = e.touches[0];
            if (isDraggingTimerRef.current) {
                const newX = Math.max(10, Math.min(window.innerWidth - 240, touch.clientX - timerDragOffsetRef.current.x));
                const newY = Math.max(10, Math.min(window.innerHeight - 80, touch.clientY - timerDragOffsetRef.current.y));
                setTimerPos({ x: newX, y: newY, isCustom: true });
            }
            if (isDraggingSheetRef.current) {
                const newX = Math.max(10, Math.min(window.innerWidth - 320, touch.clientX - sheetDragOffsetRef.current.x));
                const newY = Math.max(10, Math.min(window.innerHeight - 150, touch.clientY - sheetDragOffsetRef.current.y));
                setSheetPos({ x: newX, y: newY, isCustom: true });
            }
        };

        const handleTouchEnd = () => {
            isDraggingTimerRef.current = false;
            isDraggingSheetRef.current = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    // Drag starter for Timer Widget
    const startTimerDrag = (e) => {
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
        const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
        if (!clientX || !clientY) return;

        const currentElem = e.currentTarget.closest('.draggable-timer-widget');
        if (currentElem) {
            const rect = currentElem.getBoundingClientRect();
            timerDragOffsetRef.current = {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
            isDraggingTimerRef.current = true;
        }
    };

    // Drag starter for Sheet Widget
    const startSheetDrag = (e) => {
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
        const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
        if (!clientX || !clientY) return;

        const currentElem = e.currentTarget.closest('.draggable-sheet-widget');
        if (currentElem) {
            const rect = currentElem.getBoundingClientRect();
            sheetDragOffsetRef.current = {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
            isDraggingSheetRef.current = true;
        }
    };

    // Trigger confirmation modal first
    const handlePromptStartTest = () => {
        setIsConfirmModalOpen(true);
    };

    // Start Test Session after user confirms
    const handleConfirmStartTest = () => {
        setIsConfirmModalOpen(false);
        setIsTakingTest(true);
        setIsFocusMode(true); // Automatically enter Focus Mode
        setTimeRemaining((exam.duration || 90) * 60);
        setTimeSpentSeconds(0);
        setIsTimerPaused(false);
        setStudentAnswers({});
        setShowAnswers(false);
        setIsAnswerSheetCollapsed(false);
        setTestResultSummary(null);
        setManualEssayScores({});

        // Reset positions to default responsive corners
        setTimerPos({
            x: Math.max(16, window.innerWidth - 270),
            y: 80,
            isCustom: false
        });
        setSheetPos({
            x: Math.max(16, window.innerWidth - 390),
            y: 150,
            isCustom: false
        });

        showToast?.('Bắt đầu tính giờ làm bài! Chúc bạn đạt kết quả cao nhất!');
    };

    // Format Seconds to MM:SS or HH:MM:SS
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Helper for getting essay structured answer
    const getEssayAnswer = (questionId) => {
        const val = studentAnswers[questionId];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            return {
                text: typeof val.text === 'string' ? val.text : '',
                images: Array.isArray(val.images) ? val.images : []
            };
        }
        return {
            text: typeof val === 'string' ? val : '',
            images: []
        };
    };

    // Update Essay Text
    const updateEssayText = (questionId, text) => {
        const current = getEssayAnswer(questionId);
        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: { ...current, text }
        }));
    };

    // Add Essay Uploaded Images
    const handleEssayFileUpload = (questionId, e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(base64Images => {
            const current = getEssayAnswer(questionId);
            setStudentAnswers(prev => ({
                ...prev,
                [questionId]: {
                    ...current,
                    images: [...current.images, ...base64Images]
                }
            }));
            showToast?.(`Đã đính kèm ${base64Images.length} ảnh bài làm!`);
        });
    };

    // Remove an uploaded essay image
    const removeEssayImage = (questionId, imgIdx) => {
        const current = getEssayAnswer(questionId);
        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...current,
                images: current.images.filter((_, idx) => idx !== imgIdx)
            }
        }));
    };

    // Handle Option Selection
    const handleSelectOption = (questionId, optionId) => {
        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    // Handle True/False Selection
    const handleSelectTrueFalse = (questionId, itemKey, isTrue) => {
        setStudentAnswers(prev => {
            const currentObj = typeof prev[questionId] === 'object' && prev[questionId] !== null ? prev[questionId] : {};
            return {
                ...prev,
                [questionId]: {
                    ...currentObj,
                    [itemKey]: isTrue
                }
            };
        });
    };

    // Calculate BGD Standard Score & Submit
    const handleSubmitTest = (isAuto = false) => {
        if (!isAuto) {
            const answeredCount = Object.keys(studentAnswers).filter(k => {
                const val = studentAnswers[k];
                if (typeof val === 'object' && val !== null) {
                    if (Array.isArray(val.images) && val.images.length > 0) return true;
                    if (typeof val.text === 'string' && val.text.trim() !== '') return true;
                    return Object.keys(val).length > 0;
                }
                return val !== undefined && String(val).trim() !== '';
            }).length;

            if (answeredCount < totalQuestions) {
                const confirmSubmit = window.confirm(
                    `Bạn mới hoàn thành ${answeredCount}/${totalQuestions} câu. Bạn có chắc chắn muốn nộp bài và kết thúc không?`
                );
                if (!confirmSubmit) return;
            }
        }

        // Calculate score for Objective questions only (TN 4 lựa chọn, Đúng/Sai, Điền đáp số)
        let autoCorrectCount = 0;
        let autoEarnedPoints = 0;
        let autoMaxPossiblePoints = 0;

        const essayQuestionsList = questions.filter(q => q.type === 'essay');
        const objectiveQuestionsList = questions.filter(q => q.type !== 'essay');

        objectiveQuestionsList.forEach(q => {
            const studentAns = studentAnswers[q.id];
            if (q.type === 'true_false') {
                autoMaxPossiblePoints += 1.0;
                const correctObj = typeof q.correctAnswer === 'object' && q.correctAnswer !== null ? q.correctAnswer : {};
                const studentObj = typeof studentAns === 'object' && studentAns !== null ? studentAns : {};
                
                let correctStatements = 0;
                ['a', 'b', 'c', 'd'].forEach(k => {
                    if (studentObj[k] !== undefined && studentObj[k] === correctObj[k]) {
                        correctStatements++;
                    }
                });

                if (correctStatements === 1) autoEarnedPoints += 0.1;
                else if (correctStatements === 2) autoEarnedPoints += 0.25;
                else if (correctStatements === 3) autoEarnedPoints += 0.5;
                else if (correctStatements === 4) {
                    autoEarnedPoints += 1.0;
                    autoCorrectCount++;
                }
            } else if (q.type === 'short_answer') {
                autoMaxPossiblePoints += 0.5;
                const isCorrect = studentAns && String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                if (isCorrect) {
                    autoEarnedPoints += 0.5;
                    autoCorrectCount++;
                }
            } else {
                // multiple_choice
                autoMaxPossiblePoints += 0.25;
                if (studentAns && studentAns === q.correctAnswer) {
                    autoEarnedPoints += 0.25;
                    autoCorrectCount++;
                }
            }
        });

        const autoScore = autoMaxPossiblePoints > 0
            ? Number(((autoEarnedPoints / autoMaxPossiblePoints) * 10).toFixed(2))
            : objectiveQuestionsList.length > 0 ? Number(((autoCorrectCount / objectiveQuestionsList.length) * 10).toFixed(2)) : 0;

        const autoWrongCount = Math.max(0, objectiveQuestionsList.length - autoCorrectCount);
        const minutesSpent = Math.ceil(timeSpentSeconds / 60) || 1;

        const resultData = {
            id: 'res_' + Date.now(),
            examId: exam.id,
            testDate: new Date().toISOString().split('T')[0],
            timeSpent: minutesSpent,
            score: autoScore,
            correctCount: autoCorrectCount,
            totalQuestions,
            objectiveQuestionsCount: objectiveQuestionsList.length,
            essayQuestionsCount: essayQuestionsList.length,
            answers: studentAnswers,
            createdAt: new Date().toISOString()
        };

        onSaveResult?.(resultData);
        setIsTakingTest(false);
        setIsFocusMode(false); // Exit focus mode
        setShowAnswers(true); // Auto reveal answers so student can review
        setTestResultSummary({
            id: resultData.id,
            score: autoScore,
            correctCount: autoCorrectCount,
            wrongCount: autoWrongCount,
            timeSpent: minutesSpent,
            totalQuestions,
            objectiveCount: objectiveQuestionsList.length,
            essayQuestions: essayQuestionsList,
            hasEssay: essayQuestionsList.length > 0
        });
        showToast?.(`Đã nộp bài thành công! Điểm trắc nghiệm tự động: ${autoScore}/10 điểm.`);
    };

    // Calculate filled answers count
    const filledAnswersCount = Object.keys(studentAnswers).filter(k => {
        const val = studentAnswers[k];
        if (typeof val === 'object' && val !== null) {
            if (Array.isArray(val.images) && val.images.length > 0) return true;
            if (typeof val.text === 'string' && val.text.trim() !== '') return true;
            return Object.keys(val).length > 0;
        }
        return val !== undefined && String(val).trim() !== '';
    }).length;

    // Build standard BGD sections if 'sections' mode is chosen
    const sections = [];
    if (pageSize === 'sections') {
        const p1 = questions.filter(q => q.type === 'multiple_choice' || !q.type);
        const p2 = questions.filter(q => q.type === 'true_false');
        const p3 = questions.filter(q => q.type === 'short_answer' || q.type === 'essay');

        if (p1.length > 0) sections.push({ id: 'p1', title: 'PHẦN I: CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN', desc: 'Thí sinh trả lời từ câu 1 đến câu ' + p1.length + '. Mỗi câu chỉ chọn một phương án.', questions: p1 });
        if (p2.length > 0) sections.push({ id: 'p2', title: 'PHẦN II: CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI', desc: 'Thí sinh trả lời từ câu 1 đến câu ' + p2.length + '. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.', questions: p2 });
        if (p3.length > 0) sections.push({ id: 'p3', title: 'PHẦN III: CÂU HỎI TRẢ LỜI NGẮN & TỰ LUẬN', desc: 'Thí sinh trả lời từ câu 1 đến câu ' + p3.length + '. Điền đáp số hoặc trình bày lời giải.', questions: p3 });

        if (sections.length === 0 && totalQuestions > 0) {
            sections.push({ id: 'all', title: 'TOÀN BỘ CÂU HỎI ĐỀ THI', desc: '', questions });
        }
    }

    // Determine current slice of questions
    let totalPages = 1;
    let displayedQuestions = [];
    let currentSectionInfo = null;

    if (pageSize === 'all') {
        totalPages = 1;
        displayedQuestions = questions.map((q, idx) => ({ ...q, originalIndex: idx }));
    } else if (pageSize === 'sections') {
        totalPages = sections.length || 1;
        const safePage = Math.min(Math.max(1, currentPage), totalPages);
        currentSectionInfo = sections[safePage - 1] || sections[0];
        displayedQuestions = (currentSectionInfo?.questions || []).map((q) => ({
            ...q,
            originalIndex: questions.findIndex(orig => orig.id === q.id)
        }));
    } else {
        const numSize = Number(pageSize) || 10;
        totalPages = Math.max(1, Math.ceil(totalQuestions / numSize));
        const safePage = Math.min(Math.max(1, currentPage), totalPages);
        const startIdx = (safePage - 1) * numSize;
        const endIdx = Math.min(startIdx + numSize, totalQuestions);
        displayedQuestions = questions.slice(startIdx, endIdx).map((q, i) => ({
            ...q,
            originalIndex: startIdx + i
        }));
    }

    // Reset page when page size changes
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    // Jump to specific question
    const handleJumpToQuestion = (qIndex) => {
        if (pageSize === 'all') {
            const el = document.getElementById(`question-card-${qIndex}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        if (pageSize === 'sections') {
            const targetQ = questions[qIndex];
            const secIndex = sections.findIndex(sec => sec.questions.some(q => q.id === targetQ?.id));
            if (secIndex !== -1) {
                setCurrentPage(secIndex + 1);
                setTimeout(() => {
                    const el = document.getElementById(`question-card-${qIndex}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            return;
        }
        const numSize = Number(pageSize) || 10;
        const targetPage = Math.floor(qIndex / numSize) + 1;
        setCurrentPage(targetPage);
        setTimeout(() => {
            const el = document.getElementById(`question-card-${qIndex}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const handlePrint = () => {
        window.print();
    };

    const examViewJSX = (
        <div className={`space-y-6 pb-12 ${
            isTakingTest && isFocusMode
                ? 'fixed inset-0 z-[950] bg-[#fbf9f5] overflow-y-auto p-4 sm:p-8 animate-fade-in w-screen h-screen'
                : 'max-w-5xl mx-auto animate-fade-in-up'
        }`}>
            {/* Sticky Editorial Header Banner (Matching System Design Language) */}
            <header className={`print:hidden sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-6 border-b-2 border-brand-cerulean space-y-3 ${
                isTakingTest && isFocusMode ? 'max-w-7xl mx-auto' : ''
            }`}>
                <div>
                    {!isTakingTest ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex items-center gap-2 text-brand-cerulean hover:text-brand-jasper font-serif-title text-sm font-bold transition-colors"
                        >
                            <ArrowLeft size={16} /> Quay lại Ngân hàng Đề thi
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-brand-cerulean text-white text-xs font-serif-title font-bold rounded flex items-center gap-1.5 shadow-sm">
                                <Focus size={14} /> PHÒNG THI CHÍNH THỨC
                            </span>
                            <span className="text-xs text-brand-cerulean font-bold">
                                • {exam.title} ({subject.name})
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean tracking-tight">
                                {exam.title}
                            </h1>
                            <span className="px-2.5 py-0.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold rounded shadow-xs">
                                {subject.name}
                            </span>
                            <span className="px-2.5 py-0.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean font-mono text-xs font-bold rounded-xs">
                                Mã đề: {exam.code || '101'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-gray-600 font-body flex-wrap">
                            <span>Năm {exam.year || '2026'}</span>
                            <span>•</span>
                            <span>{examType.name}</span>
                            <span>•</span>
                            <span>{exam.duration || 90} phút</span>
                            <span>•</span>
                            <span>{questions.length} câu hỏi</span>
                            {exam.description && (
                                <>
                                    <span>•</span>
                                    <span className="italic text-gray-500">{exam.description}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                        {!isTakingTest ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePromptStartTest}
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-serif-title font-bold flex items-center gap-1.5 transition-all shadow-md rounded-xs hover:scale-105"
                                >
                                    <Play size={14} className="fill-white" /> Bắt đầu Làm Bài
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowAnswers(!showAnswers)}
                                    className={`w-44 py-2 rounded-xs text-xs font-serif-title font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 ${
                                        showAnswers
                                            ? 'bg-brand-jasper text-white'
                                            : 'bg-brand-cerulean text-white hover:bg-brand-cerulean/90'
                                    }`}
                                    title={showAnswers ? 'Ẩn lời giải chi tiết và đáp án' : 'Hiện lời giải chi tiết và đáp án'}
                                >
                                    {showAnswers ? <EyeOff size={14} /> : <Eye size={14} />}
                                    <span>{showAnswers ? 'Ẩn Lời giải & Đáp án' : 'Hiện Lời giải & Đáp án'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onEditExam(exam)}
                                    className="px-3 py-2 bg-white border border-brand-cerulean/40 text-brand-cerulean hover:border-brand-jasper hover:text-brand-jasper text-xs font-serif-title font-bold flex items-center gap-1.5 transition-colors rounded-xs shadow-xs"
                                >
                                    <Edit2 size={13} /> Chỉnh sửa đề
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="px-3 py-2 bg-brand-jasper hover:bg-red-800 text-white text-xs font-serif-title font-bold flex items-center gap-1.5 transition-colors shadow-sm rounded-xs"
                                    title="In toàn bộ đề thi hoặc xuất ra file PDF"
                                >
                                    <Printer size={13} /> In đề / PDF
                                </button>
                            </>
                        ) : (
                            /* PURE EXAM ACTIONS ONLY WHEN TAKING TEST */
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsFocusMode(!isFocusMode)}
                                    className={`px-3 py-2 text-xs font-serif-title font-bold rounded-xs border transition-all flex items-center gap-1.5 ${
                                        isFocusMode
                                            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                            : 'bg-white text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cream'
                                    }`}
                                    title={isFocusMode ? 'Thu nhỏ về giao diện bình thường' : 'Bật chế độ tập trung toàn màn hình chỉ nhìn đề thi'}
                                >
                                    {isFocusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                                    <span>{isFocusMode ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('Bạn có chắc chắn muốn hủy phiên làm bài và rời phòng thi không?')) {
                                            setIsTakingTest(false);
                                            setIsFocusMode(false);
                                            setStudentAnswers({});
                                        }
                                    }}
                                    className="px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-serif-title font-bold rounded-xs transition-colors"
                                >
                                    Hủy bài thi
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSubmitTest(false)}
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-serif-title flex items-center gap-1.5 transition-all shadow-md rounded-xs"
                                >
                                    <Send size={14} /> Nộp Bài & Xem Điểm
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Pagination & Display Navigation Toolbar (Hidden on print) */}
            <div className="print:hidden bg-white p-3.5 border border-brand-cerulean/20 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {/* View Mode & Page Size Selector */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                            <Layers size={14} className="text-brand-jasper" /> Chế độ hiển thị:
                        </span>
                        <div className="flex items-center gap-1 bg-brand-cream/60 p-1 border border-brand-cerulean/20 rounded-xs">
                            {[
                                { value: 'all', label: 'Tất cả' },
                                { value: 10, label: '10 câu/trang' },
                                { value: 20, label: '20 câu/trang' },
                                { value: 5, label: '5 câu/trang' },
                                { value: 1, label: '1 câu (Tập trung)' },
                                { value: 'sections', label: '3 Phần (BGD)' }
                            ].map(opt => (
                                <button
                                    key={String(opt.value)}
                                    type="button"
                                    onClick={() => handlePageSizeChange(opt.value)}
                                    className={`px-2.5 py-1 text-xs font-serif-title font-bold rounded-xs transition-all ${
                                        pageSize === opt.value
                                            ? 'bg-brand-cerulean text-white shadow-xs'
                                            : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Buttons */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="p-1.5 border border-brand-cerulean/20 rounded-xs text-brand-cerulean hover:bg-brand-cerulean/10 disabled:opacity-30 disabled:pointer-events-none"
                                title="Trang đầu tiên"
                            >
                                <ChevronsLeft size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-2.5 py-1 border border-brand-cerulean/20 rounded-xs text-xs font-serif-title font-bold text-brand-cerulean hover:bg-brand-cerulean/10 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                            >
                                <ChevronLeft size={13} /> Trước
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-7 h-7 rounded-xs text-xs font-bold transition-all ${
                                            currentPage === pageNum
                                                ? 'bg-brand-jasper text-white shadow-xs font-serif-title'
                                                : 'border border-brand-cerulean/20 text-brand-cerulean hover:bg-brand-cerulean/10'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2.5 py-1 border border-brand-cerulean/20 rounded-xs text-xs font-serif-title font-bold text-brand-cerulean hover:bg-brand-cerulean/10 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                            >
                                Tiếp <ChevronRight size={13} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="p-1.5 border border-brand-cerulean/20 rounded-xs text-brand-cerulean hover:bg-brand-cerulean/10 disabled:opacity-30 disabled:pointer-events-none"
                                title="Trang cuối cùng"
                            >
                                <ChevronsRight size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Question Jump Navigator Matrix */}
                {totalQuestions > 1 && (
                    <div className="pt-2.5 border-t border-brand-cerulean/10 flex items-center gap-2 overflow-x-auto pb-1">
                        <span className="text-[11px] font-serif-title font-bold text-gray-500 shrink-0">
                            Nhảy đến câu:
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                            {questions.map((q, qIdx) => {
                                const isCurrentDisplayed = displayedQuestions.some(dq => dq.originalIndex === qIdx);
                                const val = studentAnswers[q.id];
                                const isAnswered = val !== undefined && val !== '' && (typeof val !== 'object' || (val.images && val.images.length > 0) || (val.text && val.text.trim() !== '') || Object.keys(val).length > 0);

                                return (
                                    <button
                                        key={qIdx}
                                        type="button"
                                        onClick={() => handleJumpToQuestion(qIdx)}
                                        className={`w-6 h-6 rounded-xs text-[11px] font-mono font-bold transition-all relative ${
                                            isCurrentDisplayed
                                                ? 'bg-brand-cerulean text-white shadow-xs scale-105'
                                                : isAnswered
                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                    : 'bg-brand-cream/80 border border-brand-cerulean/20 text-brand-cerulean hover:bg-brand-jasper hover:text-white'
                                        }`}
                                        title={`Chuyển đến Câu ${qIdx + 1}`}
                                    >
                                        {qIdx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Exam Section: Sidebar Matrix + Exam Paper Container */}
            <div className={`mx-auto flex flex-col lg:flex-row items-start gap-6 ${
                isFocusMode ? 'max-w-7xl' : 'max-w-6xl'
            }`}>
                {/* SIDEBAR: QUESTION COMPLETION PROGRESS PANEL (Shown beside exam paper while taking test) */}
                {isTakingTest && (
                    <aside className="print:hidden w-full lg:w-64 shrink-0 lg:sticky lg:top-20 bg-white border border-brand-cerulean/20 shadow-editorial rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-brand-cerulean/15">
                            <div className="flex items-center gap-2">
                                <CheckSquare size={16} className="text-emerald-700" />
                                <h4 className="font-serif-title font-bold text-xs uppercase text-brand-cerulean tracking-wider">
                                    Tiến độ làm bài
                                </h4>
                            </div>
                            <span className="text-[11px] font-serif-title font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                                {filledAnswersCount} / {totalQuestions}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                <div
                                    className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                                    style={{ width: `${Math.round((filledAnswersCount / (totalQuestions || 1)) * 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 font-sans">
                                <span>Hoàn thành: {Math.round((filledAnswersCount / (totalQuestions || 1)) * 100)}%</span>
                                <span>Còn: {totalQuestions - filledAnswersCount} câu</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 text-[10px] text-gray-600 pt-1 pb-1">
                            <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                                <span>Đã làm ({filledAnswersCount})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 border border-gray-300 inline-block" />
                                <span>Chưa làm ({totalQuestions - filledAnswersCount})</span>
                            </div>
                        </div>

                        {/* Question Badges Grid */}
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase font-serif-title font-bold text-gray-400">
                                Danh sách câu hỏi:
                            </span>
                            <div className="grid grid-cols-5 gap-1.5 max-h-[46vh] overflow-y-auto pr-1">
                                {questions.map((q, qIdx) => {
                                    const val = studentAnswers[q.id];
                                    const isDone = val !== undefined && val !== '' && (typeof val !== 'object' || (val.images && val.images.length > 0) || (val.text && val.text.trim() !== '') || Object.keys(val).length > 0);
                                    const isCurrentPageItem = displayedQuestions.some(dq => dq.originalIndex === qIdx);

                                    return (
                                        <button
                                            key={qIdx}
                                            type="button"
                                            onClick={() => handleJumpToQuestion(qIdx)}
                                            className={`h-8 rounded text-xs font-mono font-bold transition-all flex flex-col items-center justify-center relative ${
                                                isDone
                                                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                                                    : 'bg-brand-cream/60 border border-gray-300 text-gray-700 hover:bg-brand-cream hover:border-brand-cerulean'
                                            } ${
                                                isCurrentPageItem ? 'ring-2 ring-brand-jasper' : ''
                                            }`}
                                            title={`Câu ${qIdx + 1}: ${isDone ? 'Đã làm' : 'Chưa làm'} - Bấm để chuyển tới câu này`}
                                        >
                                            <span>{qIdx + 1}</span>
                                            {isDone && <span className="text-[8px] leading-none text-emerald-100">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-2 border-t border-brand-cerulean/15">
                            <button
                                type="button"
                                onClick={() => handleSubmitTest(false)}
                                className="w-full py-2 bg-brand-jasper hover:bg-brand-jasper/90 text-white text-xs font-bold font-serif-title rounded shadow flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Send size={13} /> Nộp bài & Chấm điểm
                            </button>
                        </div>
                    </aside>
                )}

                {/* Exam Paper Container (Optimized for Screen & Print) */}
                <div className={`flex-1 w-full bg-white p-6 sm:p-10 border border-brand-cerulean/20 shadow-editorial rounded-lg print:shadow-none print:border-none print:p-0`}>
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
                    <div className="text-center mb-6">
                        <h1 className="font-serif-title text-xl font-bold text-brand-cerulean">
                            {exam.title}
                        </h1>
                        {exam.description && (
                            <p className="text-xs italic text-gray-500 font-body mt-1 max-w-2xl mx-auto">
                                {exam.description}
                            </p>
                        )}
                        {/* Screen Current Page Indicator */}
                        {totalPages > 1 && (
                            <div className="print:hidden mt-3 inline-flex items-center gap-2 px-3 py-1 bg-brand-cream/80 border border-brand-cerulean/20 rounded-full text-xs font-serif-title text-brand-cerulean font-bold">
                                <span>Trang {currentPage} / {totalPages}</span>
                                <span className="text-gray-300">•</span>
                                <span>Hiển thị {displayedQuestions.length} / {totalQuestions} câu</span>
                            </div>
                        )}
                    </div>

                    {/* Section Title Banner if in sections mode */}
                    {currentSectionInfo && (
                        <div className="mb-6 p-3 bg-brand-cerulean/5 border-l-4 border-brand-cerulean rounded-r">
                            <h3 className="font-serif-title font-bold text-sm text-brand-cerulean">
                                {currentSectionInfo.title}
                            </h3>
                            {currentSectionInfo.desc && (
                                <p className="text-xs text-gray-600 font-body mt-0.5 italic">
                                    {currentSectionInfo.desc}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Questions List (Paginated on Screen, Flowing on Print) */}
                    <div className="space-y-8">
                        {displayedQuestions.map((q, localIdx) => {
                            const originalIdx = q.originalIndex !== undefined ? q.originalIndex : localIdx;
                            const myStudentAns = studentAnswers[q.id];
                            
                            // Check if question belongs to a passage
                            const passage = q.passageId ? (exam.passages || []).find(p => p.id === q.passageId) : null;
                            const prevQuestion = localIdx > 0 ? displayedQuestions[localIdx - 1] : null;
                            const isFirstQuestionOfPassage = passage && (!prevQuestion || prevQuestion.passageId !== q.passageId);

                            return (
                                <React.Fragment key={q.id || originalIdx}>
                                    {/* Passage Card Header */}
                                    {isFirstQuestionOfPassage && (
                                        <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/80 to-brand-cream/50 border-2 border-brand-cerulean/30 rounded-lg shadow-sm space-y-3 print:break-inside-avoid my-6 animate-fade-in">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-brand-cerulean/15">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 bg-brand-cerulean text-white text-[10px] font-serif-title font-bold rounded uppercase tracking-wider">
                                                        {passage.type === 'literature' ? '📖 Văn bản Đọc hiểu' : passage.type === 'history' ? '🏛️ Tư liệu Lịch sử' : passage.type === 'law' ? '⚖️ Tình huống Pháp luật' : passage.type === 'geography' ? '🗺️ Bảng số liệu & Tư liệu' : passage.type === 'english' ? '🌐 Reading Passage' : '📚 Ngữ liệu Dùng chung'}
                                                    </span>
                                                    <h3 className="font-serif-title font-bold text-sm text-brand-cerulean">
                                                        {passage.title}
                                                    </h3>
                                                </div>
                                                {(passage.author || passage.year) && (
                                                    <span className="text-xs text-gray-600 font-sans italic">
                                                        {passage.author} {passage.year ? `(${passage.year})` : ''}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Audio player if listening track present */}
                                            {passage.audioUrl && (
                                                <div className="p-2.5 bg-white border border-purple-200 rounded flex items-center gap-3">
                                                    <Volume2 size={16} className="text-purple-600 shrink-0" />
                                                    <span className="text-xs font-bold text-purple-900 shrink-0">File Nghe (Audio):</span>
                                                    <audio controls className="h-8 w-full max-w-md">
                                                        <source src={passage.audioUrl} />
                                                        Trình duyệt không hỗ trợ phát âm thanh.
                                                    </audio>
                                                </div>
                                            )}

                                            {/* Passage Content */}
                                            {passage.content && (
                                                <div className="font-body text-xs sm:text-sm text-brand-ink leading-relaxed whitespace-pre-wrap bg-white/80 p-3.5 rounded border border-brand-cerulean/10 shadow-inner">
                                                    <MathText text={passage.content} />
                                                </div>
                                            )}

                                            {/* Source citation */}
                                            {passage.source && (
                                                <p className="text-[11px] text-gray-500 italic text-right font-serif">
                                                    — Nguồn: {passage.source}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div
                                        id={`question-card-${originalIdx}`}
                                        className={`space-y-3 pb-6 border-b border-gray-200 last:border-0 print:break-inside-avoid ${
                                            showAnswers ? 'bg-amber-50/20 p-4 rounded border border-amber-200/50' : ''
                                        }`}
                                    >
                                        {/* Question Title */}
                                        <div className="text-sm font-body leading-relaxed text-brand-ink">
                                            <strong className="font-serif-title font-bold text-brand-cerulean mr-2 text-base">
                                                Câu {originalIdx + 1}:
                                            </strong>
                                            <MathText text={q.content} className="inline" />
                                        </div>

                                    {/* Question Multi-Image Gallery */}
                                    {(() => {
                                        const questionImages = Array.isArray(q.imageUrls) && q.imageUrls.length > 0
                                            ? q.imageUrls.filter(Boolean)
                                            : q.imageUrl ? [q.imageUrl] : [];

                                        if (questionImages.length === 0) return null;

                                        return (
                                            <div className={`my-3.5 grid gap-3 ${
                                                questionImages.length === 1
                                                    ? 'grid-cols-1 max-w-md mx-auto'
                                                    : questionImages.length === 2
                                                        ? 'grid-cols-1 sm:grid-cols-2'
                                                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                            }`}>
                                                {questionImages.map((imgUrl, imgIdx) => (
                                                    <div
                                                        key={imgIdx}
                                                        onClick={() => setSelectedZoomImage({ url: imgUrl, title: `Hình ${imgIdx + 1} - Câu ${originalIdx + 1}` })}
                                                        className="relative group border border-brand-cerulean/20 p-2 bg-white rounded shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center cursor-zoom-in"
                                                    >
                                                        <img
                                                            src={imgUrl}
                                                            alt={`Hình ${imgIdx + 1} - Câu ${originalIdx + 1}`}
                                                            className="max-h-56 w-auto object-contain rounded"
                                                        />
                                                        <span className="mt-1.5 px-2 py-0.5 bg-brand-cream text-brand-cerulean font-serif-title font-bold text-[11px] rounded border border-brand-cerulean/20">
                                                            {questionImages.length > 1 ? `Hình ${imgIdx + 1}` : 'Hình minh họa'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}

                                    {/* Options / Answer Layout based on question type */}
                                    {q.type === 'essay' ? (
                                        /* SPATIOUS ESSAY WORKSPACE (Nhập bài làm hoặc tải ảnh) */
                                        <div className="p-4 bg-brand-cream/60 border border-brand-cerulean/30 rounded-lg space-y-3.5">
                                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-brand-cerulean/15">
                                                <div className="flex items-center gap-2">
                                                    <PenTool size={16} className="text-brand-jasper" />
                                                    <span className="text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                                        BÀI LÀM TỰ LUẬN
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 italic">
                                                        (Tự chấm điểm sau khi nộp bài)
                                                    </span>
                                                </div>
                                                {isTakingTest && (
                                                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                                                        Đang trong bài thi
                                                    </span>
                                                )}
                                            </div>

                                            {/* Essay Input Fields while taking test */}
                                            {isTakingTest && (() => {
                                                const essayAns = getEssayAnswer(q.id);

                                                return (
                                                    <div className="space-y-3">
                                                        {/* Choice 1: Large typing area */}
                                                        <div>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <label className="text-xs font-serif-title font-bold text-gray-700 flex items-center gap-1.5">
                                                                    <span>✍️ Lựa chọn 1: Trình bày bài giải trực tiếp</span>
                                                                </label>
                                                                <span className="text-[10px] text-gray-400 font-mono">
                                                                    {essayAns.text.length} ký tự
                                                                </span>
                                                            </div>
                                                            <textarea
                                                                rows={6}
                                                                value={essayAns.text}
                                                                onChange={e => updateEssayText(q.id, e.target.value)}
                                                                placeholder="Nhập các bước chứng minh, lập luận toán học, công thức LaTeX (ví dụ: $x = \frac{-b \pm \sqrt{\Delta}}{2a}$) hoặc bài làm tự luận của bạn..."
                                                                className="w-full p-3 bg-white border border-brand-cerulean/40 rounded-lg font-body text-xs text-brand-ink focus:outline-none focus:border-brand-jasper shadow-inner leading-relaxed"
                                                            />
                                                            {essayAns.text && (
                                                                <div className="mt-1.5 p-2 bg-white/80 border border-dashed border-gray-300 rounded text-xs">
                                                                    <span className="text-[10px] font-bold text-gray-400 block mb-0.5">Xem trước công thức bài làm:</span>
                                                                    <MathText text={essayAns.text} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Choice 2: Upload Multiple Photos */}
                                                        <div className="pt-2 border-t border-brand-cerulean/15">
                                                            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                                                                <label className="text-xs font-serif-title font-bold text-gray-700 flex items-center gap-1.5">
                                                                    <ImageIcon size={14} className="text-brand-cerulean" />
                                                                    <span>📷 Lựa chọn 2: Chèn ảnh chụp bài làm (hỗ trợ nhiều ảnh)</span>
                                                                </label>
                                                                <label className="px-3 py-1.5 bg-brand-cerulean hover:bg-brand-cerulean/90 text-white rounded text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm transition-all">
                                                                    <UploadCloud size={14} /> Tải ảnh bài làm từ máy
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={e => handleEssayFileUpload(q.id, e)}
                                                                        className="hidden"
                                                                    />
                                                                </label>
                                                            </div>

                                                            {/* Uploaded Images Gallery */}
                                                            {essayAns.images.length > 0 ? (
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 p-2 bg-white rounded-lg border border-brand-cerulean/20">
                                                                    {essayAns.images.map((imgUrl, imgIdx) => (
                                                                        <div key={imgIdx} className="relative group border border-gray-200 rounded p-1 bg-brand-cream/30 flex flex-col items-center">
                                                                            <img
                                                                                src={imgUrl}
                                                                                alt={`Bài làm trang ${imgIdx + 1}`}
                                                                                onClick={() => setSelectedZoomImage({ url: imgUrl, title: `Bài làm tự luận trang ${imgIdx + 1} - Câu ${originalIdx + 1}` })}
                                                                                className="h-28 w-full object-contain rounded cursor-zoom-in hover:opacity-90"
                                                                            />
                                                                            <div className="w-full flex justify-between items-center mt-1 text-[10px] text-gray-600 px-1">
                                                                                <span>Trang {imgIdx + 1}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeEssayImage(q.id, imgIdx)}
                                                                                    className="p-0.5 text-red-500 hover:text-red-700 rounded"
                                                                                    title="Xóa ảnh này"
                                                                                >
                                                                                    <Trash2 size={12} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="p-3 bg-white/60 border border-dashed border-gray-300 rounded text-center text-xs text-gray-400">
                                                                    Chưa có ảnh bài làm nào được đính kèm. Bạn có thể chụp ảnh giấy nháp/tập bài làm và tải lên tại đây.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Show Answer if Active */}
                                            {showAnswers && (
                                                <div className="mt-2 text-xs font-body text-emerald-800 bg-white p-3 border border-emerald-300 rounded">
                                                    <strong>Hướng dẫn & Đáp số tự luận: </strong>
                                                    <MathText text={q.correctAnswer || q.explanation || 'Chưa có đáp số'} />
                                                </div>
                                            )}
                                        </div>
                                    ) : q.type === 'short_answer' ? (
                                        /* SHORT ANSWER FIELD */
                                        <div className="p-3 bg-brand-cream/60 border border-brand-cerulean/20 rounded space-y-2">
                                            <div className="flex items-center justify-between text-xs font-serif-title font-bold text-brand-cerulean">
                                                <span>ĐIỀN ĐÁP SỐ / TRẢ LỜI NGẮN</span>
                                                {isTakingTest && (
                                                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                                                        Đang trong bài thi
                                                    </span>
                                                )}
                                            </div>

                                            {/* Input field while taking test */}
                                            {isTakingTest && (
                                                <div className="pt-1">
                                                    <input
                                                        type="text"
                                                        value={typeof myStudentAns === 'string' ? myStudentAns : ''}
                                                        onChange={e => handleSelectOption(q.id, e.target.value)}
                                                        placeholder="Nhập đáp số (vd: 2.5 hoặc -1/3)..."
                                                        className="w-full sm:w-64 input-editorial text-xs font-mono p-2 bg-white"
                                                    />
                                                </div>
                                            )}

                                            {showAnswers && (
                                                <div className="mt-2 text-xs font-body text-emerald-800">
                                                    <strong>Kết quả chính xác: </strong>
                                                    <MathText text={q.correctAnswer || 'Chưa nhập kết quả'} />
                                                </div>
                                            )}
                                        </div>
                                    ) : q.type === 'true_false' ? (
                                        <div className="space-y-1.5 pt-1">
                                            {['a', 'b', 'c', 'd'].map(key => {
                                                const opt = q.options?.find(o => o.id.toLowerCase() === key) || { id: key, text: '' };
                                                if (!opt.text) return null;
                                                const ansObj = typeof q.correctAnswer === 'object' && q.correctAnswer !== null ? q.correctAnswer : {};
                                                const isTrue = ansObj[key] === true || ansObj[key] === 'Đ';
                                                const myTF = typeof myStudentAns === 'object' && myStudentAns?.[key];

                                                return (
                                                    <div key={key} className="p-2.5 bg-white border border-gray-200 rounded text-xs flex items-center justify-between gap-2">
                                                        <div className="flex items-start gap-1.5 flex-1">
                                                            <strong className="font-serif-title text-brand-cerulean">{key})</strong>
                                                            <div className="font-body text-brand-ink">
                                                                <MathText text={opt.text} />
                                                            </div>
                                                        </div>

                                                        {/* Interactive True / False Buttons while taking test */}
                                                        {isTakingTest && (
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSelectTrueFalse(q.id, key, true)}
                                                                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                                                        myTF === true
                                                                            ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-400'
                                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    }`}
                                                                >
                                                                    Đúng
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSelectTrueFalse(q.id, key, false)}
                                                                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                                                        myTF === false
                                                                            ? 'bg-red-600 text-white shadow ring-2 ring-red-400'
                                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    }`}
                                                                >
                                                                    Sai
                                                                </button>
                                                            </div>
                                                        )}

                                                        {showAnswers && (
                                                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                                                                isTrue ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                                                            }`}>
                                                                {isTrue ? '✓ Đúng' : '✗ Sai'}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        /* Options A, B, C, D */
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                            {q.options?.map((opt) => {
                                                const isCorrect = q.correctAnswer === opt.id;
                                                const isChosen = myStudentAns === opt.id;

                                                return (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => isTakingTest && handleSelectOption(q.id, opt.id)}
                                                        className={`p-2.5 text-sm font-body rounded transition-colors flex items-start gap-2 ${
                                                            isTakingTest ? 'cursor-pointer' : ''
                                                        } ${
                                                            showAnswers && isCorrect
                                                                ? 'bg-emerald-100/70 border border-emerald-500 text-emerald-950 font-bold'
                                                                : isTakingTest && isChosen
                                                                    ? 'bg-brand-cerulean text-white font-bold shadow-md ring-2 ring-brand-jasper'
                                                                    : 'hover:bg-brand-cream/80 bg-brand-cream/30 border border-transparent'
                                                        }`}
                                                    >
                                                        <span className={`font-serif-title font-bold shrink-0 ${
                                                            showAnswers && isCorrect
                                                                ? 'text-emerald-800'
                                                                : isTakingTest && isChosen
                                                                    ? 'text-white'
                                                                    : 'text-brand-cerulean'
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
                                    )}

                                    {/* Solution / Explanation Box (Shown when toggle is active) */}
                                    {showAnswers && (
                                        <div className="mt-4 p-4 bg-white border-l-4 border-emerald-600 shadow-sm rounded-r space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-emerald-800">
                                                <CheckCircle2 size={15} />
                                                <span>HƯỚNG DẪN GIẢI CHI TIẾT {typeof q.correctAnswer === 'string' ? `(ĐÁP ÁN ${q.correctAnswer})` : ''}:</span>
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

                                            {/* Explanation Multi-Image Gallery */}
                                            {(() => {
                                                const expImages = Array.isArray(q.explanationImageUrls) && q.explanationImageUrls.length > 0
                                                    ? q.explanationImageUrls.filter(Boolean)
                                                    : q.explanationImageUrl ? [q.explanationImageUrl] : [];

                                                if (expImages.length === 0) return null;

                                                return (
                                                    <div className={`my-3 grid gap-3 ${
                                                        expImages.length === 1
                                                            ? 'grid-cols-1 max-w-sm'
                                                            : 'grid-cols-1 sm:grid-cols-2'
                                                    }`}>
                                                        {expImages.map((imgUrl, imgIdx) => (
                                                            <div
                                                                key={imgIdx}
                                                                onClick={() => setSelectedZoomImage({ url: imgUrl, title: `Hình giải ${imgIdx + 1} - Câu ${originalIdx + 1}` })}
                                                                className="relative group border border-emerald-300 p-1.5 bg-white rounded shadow-sm cursor-zoom-in flex flex-col items-center hover:border-emerald-500"
                                                            >
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={`Hình giải ${imgIdx + 1}`}
                                                                    className="max-h-48 object-contain rounded"
                                                                />
                                                                <span className="mt-1 text-[10px] text-emerald-800 font-bold">
                                                                    {expImages.length > 1 ? `Hình giải ${imgIdx + 1}` : 'Hình minh họa lời giải'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Bottom Pagination & End Marker */}
                    {totalPages > 1 && (
                        <div className="print:hidden mt-8 pt-4 border-t border-brand-cerulean/20 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <div className="text-xs font-serif-title text-brand-cerulean font-bold">
                                Trang {currentPage} / {totalPages} (Hiển thị {displayedQuestions.length} / {totalQuestions} câu)
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(p => Math.max(1, p - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-brand-cerulean/30 rounded text-xs font-bold text-brand-cerulean hover:bg-brand-cerulean hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-all"
                                >
                                    <ChevronLeft size={14} /> Trang trước
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                        <button
                                            key={pageNum}
                                            type="button"
                                            onClick={() => {
                                                setCurrentPage(pageNum);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                                                currentPage === pageNum
                                                    ? 'bg-brand-jasper text-white shadow font-serif-title'
                                                    : 'border border-brand-cerulean/20 text-brand-cerulean hover:bg-brand-cerulean/10'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(p => Math.min(totalPages, p + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 border border-brand-cerulean/30 rounded text-xs font-bold text-brand-cerulean hover:bg-brand-cerulean hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-all"
                                >
                                    Trang sau <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Exam End Marker */}
                    <div className="mt-8 pt-4 border-t border-brand-cerulean/20 text-center font-serif italic text-xs text-gray-500">
                        ---------- {currentPage === totalPages || pageSize === 'all' ? 'HẾT' : `Hết Trang ${currentPage}`} ----------
                    </div>
                </div>
            </div>

            {/* PORTAL 1: PRE-TEST CONFIRMATION MODAL (Renders directly into document.body to cover full screen & sidebar) */}
            {isConfirmModalOpen && createPortal(
                <div className="fixed inset-0 z-[999] bg-brand-cerulean/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-brand-cream border-editorial shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-modal-pop-in">
                        {/* Header */}
                        <div className="p-4 bg-brand-cerulean text-brand-cream flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded">
                                    <Flame size={20} className="text-brand-cream" />
                                </div>
                                <div>
                                    <h3 className="font-serif-title font-bold text-base tracking-wide">
                                        Xác Nhận Bắt Đầu Làm Bài Thi
                                    </h3>
                                    <p className="text-xs opacity-80 font-sans">
                                        Bấm giờ đếm ngược & mở phiếu trả lời trắc nghiệm
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="p-1 hover:bg-white/20 rounded transition-colors text-brand-cream"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Exam Specs Box */}
                            <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm space-y-2 text-xs">
                                <div className="flex justify-between items-center py-1 border-b border-brand-cerulean/10">
                                    <span className="text-gray-500 font-sans">Tên đề thi:</span>
                                    <strong className="text-brand-cerulean font-serif-title text-sm">{exam.title}</strong>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-brand-cerulean/10">
                                    <span className="text-gray-500 font-sans">Môn thi & Năm:</span>
                                    <span className="font-bold text-brand-jasper">{subject.name} - Năm {exam.year || '2026'}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-brand-cerulean/10">
                                    <span className="text-gray-500 font-sans">Thời gian làm bài:</span>
                                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                                        <Clock size={14} /> {exam.duration || 90} phút
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-500 font-sans">Số lượng câu hỏi:</span>
                                    <span className="font-bold text-brand-cerulean">{totalQuestions} câu</span>
                                </div>
                            </div>

                            {/* Guidance Notice */}
                            <div className="p-3 bg-brand-cream/80 border border-brand-cerulean/20 text-xs text-brand-ink leading-relaxed space-y-1.5">
                                <p className="font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-emerald-700" /> Hướng dẫn & Quy định phòng thi:
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-gray-600 font-body text-[11px]">
                                    <li>Bảng theo dõi tiến độ kế bên đề thi sẽ cho bạn biết chính xác câu nào đã làm, câu nào còn thiếu.</li>
                                    <li>Với các <strong>câu tự luận</strong>, bạn có thể nhập văn bản giải chi tiết hoặc tải lên nhiều ảnh bài làm viết tay.</li>
                                    <li>Điểm số trắc nghiệm sẽ được tự động chấm, câu tự luận bạn có thể tự cho điểm sau khi đối chiếu đáp án chi tiết.</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="flex-1 py-2.5 border border-brand-cerulean/30 hover:bg-brand-cream text-brand-cerulean text-xs font-bold transition-colors"
                                >
                                    Để sau / Quay lại
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmStartTest}
                                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-serif-title shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Play size={14} className="fill-white" /> Tôi Đã Sẵn Sàng!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* PORTAL 2: DRAGGABLE FLOATING COUNTDOWN TIMER (Rendered directly into document.body) */}
            {isTakingTest && createPortal(
                <div
                    className="draggable-timer-widget print:hidden fixed z-[1050] bg-white/95 border-2 border-brand-cerulean shadow-2xl p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md select-none hover:shadow-brand-cerulean/30 transition-shadow"
                    style={{
                        left: timerPos.isCustom ? `${timerPos.x}px` : undefined,
                        top: timerPos.isCustom ? `${timerPos.y}px` : '80px',
                        right: timerPos.isCustom ? undefined : '1.5rem'
                    }}
                >
                    {/* Drag Handle Bar */}
                    <div
                        onMouseDown={startTimerDrag}
                        onTouchStart={startTimerDrag}
                        className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-brand-cerulean rounded hover:bg-brand-cream/80"
                        title="Giữ chuột hoặc chạm để kéo di chuyển Đồng hồ"
                    >
                        <GripHorizontal size={16} />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${
                            timeRemaining < 300 ? 'bg-red-100 text-red-600 animate-ping' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                            <Clock size={18} />
                        </div>
                        <div>
                            <div className="text-[9px] uppercase font-serif-title font-bold text-gray-500">
                                Thời gian còn lại
                            </div>
                            <div className={`text-lg font-mono font-bold ${
                                timeRemaining < 300 ? 'text-red-600' : 'text-brand-cerulean'
                            }`}>
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                        <button
                            type="button"
                            onClick={() => setIsTimerPaused(!isTimerPaused)}
                            className="p-1.5 bg-brand-cream hover:bg-brand-cerulean hover:text-white rounded transition-colors text-brand-cerulean"
                            title={isTimerPaused ? 'Tiếp tục làm bài' : 'Tạm dừng đồng hồ'}
                        >
                            {isTimerPaused ? <Play size={13} /> : <Pause size={13} />}
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* PORTAL 3: DRAGGABLE FLOATING ANSWER SHEET (Rendered directly into document.body) */}
            {isTakingTest && createPortal(
                <div
                    className={`draggable-sheet-widget print:hidden fixed z-[1040] select-none ${
                        isAnswerSheetCollapsed
                            ? 'w-auto'
                            : 'w-80 sm:w-96 max-h-[75vh]'
                    }`}
                    style={{
                        left: sheetPos.isCustom ? `${sheetPos.x}px` : undefined,
                        top: sheetPos.isCustom ? `${sheetPos.y}px` : '150px',
                        right: sheetPos.isCustom ? undefined : '1.5rem'
                    }}
                >
                    {isAnswerSheetCollapsed ? (
                        <div className="flex items-center gap-1 bg-brand-cerulean text-white rounded-full shadow-2xl p-1 pr-3">
                            <div
                                onMouseDown={startSheetDrag}
                                onTouchStart={startSheetDrag}
                                className="cursor-grab active:cursor-grabbing p-2 text-white/80 hover:text-white"
                                title="Kéo di chuyển phiếu"
                            >
                                <GripHorizontal size={16} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAnswerSheetCollapsed(false)}
                                className="flex items-center gap-2 text-xs font-serif-title font-bold hover:underline"
                            >
                                <FileText size={15} /> Phiếu Trả Lời ({filledAnswersCount}/{totalQuestions})
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white/95 backdrop-blur border-2 border-brand-cerulean shadow-2xl rounded-xl max-h-[75vh] flex flex-col overflow-hidden">
                            {/* Sheet Header & Drag Handle */}
                            <div className="p-2.5 bg-brand-cerulean text-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        onMouseDown={startSheetDrag}
                                        onTouchStart={startSheetDrag}
                                        className="cursor-grab active:cursor-grabbing p-1 text-white/80 hover:text-white rounded hover:bg-white/10"
                                        title="Giữ chuột hoặc chạm để kéo di chuyển Phiếu làm bài"
                                    >
                                        <GripHorizontal size={16} />
                                    </div>
                                    <FileText size={15} />
                                    <div>
                                        <h4 className="text-xs font-serif-title font-bold uppercase tracking-wider">
                                            Phiếu Trả Lời
                                        </h4>
                                        <p className="text-[10px] text-white/80">
                                            Đã làm: <strong>{filledAnswersCount}/{totalQuestions}</strong> câu ({Math.round((filledAnswersCount / (totalQuestions || 1)) * 100)}%)
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAnswerSheetCollapsed(true)}
                                    className="p-1 hover:bg-white/20 rounded text-white"
                                    title="Thu nhỏ phiếu"
                                >
                                    <Minimize2 size={15} />
                                </button>
                            </div>

                            {/* Sheet Questions Matrix Body */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-gray-100 max-h-[50vh]">
                                {questions.map((q, qIdx) => {
                                    const myAns = studentAnswers[q.id];
                                    const isFilled = myAns !== undefined && myAns !== '' && (
                                        typeof myAns !== 'object' ||
                                        (myAns.images && myAns.images.length > 0) ||
                                        (myAns.text && myAns.text.trim() !== '') ||
                                        Object.keys(myAns).length > 0
                                    );

                                    return (
                                        <div key={q.id || qIdx} className="pt-2 first:pt-0 space-y-1">
                                            <div className="flex justify-between items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleJumpToQuestion(qIdx)}
                                                    className={`text-xs font-serif-title font-bold text-left hover:underline flex items-center gap-1 ${
                                                        isFilled ? 'text-emerald-700' : 'text-brand-cerulean'
                                                    }`}
                                                >
                                                    Câu {qIdx + 1}
                                                    {isFilled && <span className="text-[10px] text-emerald-600 font-sans">✓</span>}
                                                </button>
                                                <span className="text-[10px] font-sans text-gray-400">
                                                    {q.type === 'true_false' ? 'Đúng/Sai' : q.type === 'short_answer' ? 'Điền số' : q.type === 'essay' ? 'Tự luận' : 'TN 4 ý'}
                                                </span>
                                            </div>

                                            {/* Input controls based on question type */}
                                            {q.type === 'essay' ? (
                                                /* Essay in Answer Sheet Widget */
                                                (() => {
                                                    const essayAns = getEssayAnswer(q.id);

                                                    return (
                                                        <div className="space-y-1.5 p-2 bg-brand-cream/40 border border-brand-cerulean/20 rounded">
                                                            <textarea
                                                                rows={2}
                                                                value={essayAns.text}
                                                                onChange={e => updateEssayText(q.id, e.target.value)}
                                                                placeholder="Nhập bài giải tự luận..."
                                                                className="w-full p-1.5 text-xs font-body bg-white border border-gray-300 rounded focus:outline-none focus:border-brand-cerulean"
                                                            />
                                                            <div className="flex items-center justify-between gap-1">
                                                                <label className="text-[10px] text-brand-cerulean font-bold hover:underline cursor-pointer flex items-center gap-1">
                                                                    <UploadCloud size={12} /> Đính kèm ảnh ({essayAns.images.length})
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={e => handleEssayFileUpload(q.id, e)}
                                                                        className="hidden"
                                                                    />
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleJumpToQuestion(qIdx)}
                                                                    className="text-[10px] text-brand-jasper font-bold hover:underline"
                                                                >
                                                                    Mở rộng trên đề ↗
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })()
                                            ) : q.type === 'true_false' ? (
                                                <div className="grid grid-cols-2 gap-1.5 text-xs">
                                                    {['a', 'b', 'c', 'd'].map(subKey => {
                                                        const isSelectedTrue = typeof myAns === 'object' && myAns?.[subKey] === true;
                                                        const isSelectedFalse = typeof myAns === 'object' && myAns?.[subKey] === false;

                                                        return (
                                                            <div key={subKey} className="flex items-center justify-between p-1 bg-gray-50 border rounded">
                                                                <span className="font-bold text-[11px] text-brand-cerulean">{subKey})</span>
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSelectTrueFalse(q.id, subKey, true)}
                                                                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                                                            isSelectedTrue ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'
                                                                        }`}
                                                                    >
                                                                        Đ
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSelectTrueFalse(q.id, subKey, false)}
                                                                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                                                            isSelectedFalse ? 'bg-red-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'
                                                                        }`}
                                                                    >
                                                                        S
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : q.type === 'short_answer' ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={typeof myAns === 'string' ? myAns : ''}
                                                        onChange={e => handleSelectOption(q.id, e.target.value)}
                                                        placeholder="Nhập đáp số..."
                                                        className="w-full input-editorial text-xs font-mono px-2 py-1 bg-brand-cream/30"
                                                    />
                                                </div>
                                            ) : (
                                                /* Multiple Choice 4 Options (A, B, C, D) */
                                                <div className="flex items-center justify-between gap-1">
                                                    {['A', 'B', 'C', 'D'].map(optKey => (
                                                        <button
                                                            key={optKey}
                                                            type="button"
                                                            onClick={() => handleSelectOption(q.id, optKey)}
                                                            className={`flex-1 py-1 rounded text-xs font-bold transition-all ${
                                                                myAns === optKey
                                                                    ? 'bg-brand-cerulean text-white shadow ring-2 ring-brand-jasper'
                                                                    : 'bg-brand-cream/60 border border-brand-cerulean/20 text-brand-cerulean hover:bg-brand-cerulean/10'
                                                            }`}
                                                        >
                                                            {optKey}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sheet Footer */}
                            <div className="p-3 bg-brand-cream border-t border-brand-cerulean/20 flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('Bạn có chắc chắn muốn hủy phiên làm bài hiện tại không?')) {
                                            setIsTakingTest(false);
                                            setIsFocusMode(false);
                                            setStudentAnswers({});
                                        }
                                    }}
                                    className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-xs font-bold hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmitTest(false)}
                                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold font-serif-title shadow-md flex items-center justify-center gap-1.5 transition-all"
                                >
                                    <Send size={13} /> Nộp bài & Chấm điểm
                                </button>
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* PORTAL 4: CELEBRATION SCORE SUMMARY MODAL (Rendered directly into document.body) */}
            {testResultSummary && createPortal(
                <div className="fixed inset-0 z-[999] bg-brand-cerulean/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-brand-cream border-editorial shadow-2xl rounded max-w-lg w-full p-6 text-center space-y-4 animate-modal-pop-in my-8">
                        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-300">
                            <Award size={36} />
                        </div>
                        <div>
                            <h3 className="font-serif-title text-xl font-bold text-brand-cerulean">
                                Kết Quả Bài Làm Của Bạn
                            </h3>
                            <p className="text-xs text-gray-600 font-sans mt-0.5">
                                {exam.title}
                            </p>
                        </div>

                        {/* Big Score Box */}
                        <div className="p-4 bg-white border border-brand-cerulean/20 shadow-sm rounded space-y-1">
                            <span className="text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                Điểm Trắc Nghiệm Tự Động
                            </span>
                            <div className="text-4xl font-serif-title font-bold text-brand-jasper">
                                {testResultSummary.score} <span className="text-sm text-gray-500 font-sans">/ 10.0</span>
                            </div>
                            {testResultSummary.hasEssay && (
                                <p className="text-[11px] text-brand-jasper font-serif-title font-bold pt-1 flex items-center gap-1.5">
                                    <AlertCircle size={13} className="shrink-0" /> Bài thi có {testResultSummary.essayQuestions.length} câu tự luận. Bạn có thể đối chiếu lời giải chi tiết bên dưới để tự chấm phần tự luận!
                                </p>
                            )}
                        </div>

                        {/* Breakdown Grid */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="p-2.5 bg-white border border-emerald-300 rounded">
                                <div className="text-[10px] text-emerald-800 font-bold">Số câu TN đúng</div>
                                <div className="text-lg font-bold text-emerald-700">{testResultSummary.correctCount}</div>
                            </div>
                            <div className="p-2.5 bg-white border border-red-300 rounded">
                                <div className="text-[10px] text-red-800 font-bold">Số câu TN sai</div>
                                <div className="text-lg font-bold text-red-700">{testResultSummary.wrongCount}</div>
                            </div>
                            <div className="p-2.5 bg-white border border-blue-300 rounded">
                                <div className="text-[10px] text-blue-800 font-bold">Thời gian làm</div>
                                <div className="text-lg font-bold text-blue-700">{testResultSummary.timeSpent}p</div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setTestResultSummary(null)}
                                className="w-full py-3 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-bold font-serif-title shadow-md transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={16} /> 🔍 Xem Toàn Bộ Lời Giải Chi Tiết & Bài Làm
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* PORTAL 5: FULLSCREEN LIGHTBOX ZOOM MODAL (Rendered directly into document.body) */}
            {selectedZoomImage && createPortal(
                <div
                    className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedZoomImage(null)}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-lg shadow-2xl overflow-hidden flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-full flex justify-between items-center pb-2 mb-2 border-b border-gray-200">
                            <span className="font-serif-title font-bold text-sm text-brand-cerulean">
                                {selectedZoomImage.title || 'Xem hình phóng to'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedZoomImage(null)}
                                className="p-1 text-gray-500 hover:text-red-600 rounded transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="overflow-auto max-h-[78vh] flex items-center justify-center p-2 bg-brand-cream/20 rounded">
                            <img
                                src={selectedZoomImage.url}
                                alt={selectedZoomImage.title}
                                className="max-h-[72vh] w-auto object-contain rounded"
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );

    if (isTakingTest && isFocusMode) {
        return createPortal(examViewJSX, document.body);
    }

    return examViewJSX;
};

export default ThptExamDetailView;
