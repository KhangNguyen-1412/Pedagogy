import React, { useState, useEffect } from 'react';
import {
    PenTool,
    Clock,
    Play,
    Pause,
    RotateCcw,
    Sparkles,
    CheckCircle2,
    BookOpen,
    HelpCircle,
    Award,
    ChevronDown,
    Save,
    Trash2,
    FileText,
    ArrowRight
} from 'lucide-react';
import { IELTS_WRITING_TASKS, IELTS_RUBRICS } from '../../data/ieltsData';

export const IeltsWritingLab = ({ onSaveEssay, showToast }) => {
    const [selectedTaskId, setSelectedTaskId] = useState(IELTS_WRITING_TASKS[0]?.id);
    const [essayText, setEssayText] = useState('');
    const [timerSeconds, setTimerSeconds] = useState((IELTS_WRITING_TASKS[0]?.timeLimitMinutes || 20) * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showSampleEssay, setShowSampleEssay] = useState(false);
    const [showPeelGuide, setShowPeelGuide] = useState(true);
    const [selfAssessment, setSelfAssessment] = useState({
        ta_tr: '7.0',
        cc: '7.0',
        lr: '7.0',
        gra: '7.0',
        notes: ''
    });

    const activeTask = IELTS_WRITING_TASKS.find(t => t.id === selectedTaskId) || IELTS_WRITING_TASKS[0];

    // Word count calculator
    const wordCount = essayText.trim() === '' ? 0 : essayText.trim().split(/\s+/).length;

    // Timer effect
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds(sec => sec - 1);
            }, 1000);
        } else if (timerSeconds === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            if (showToast) showToast('Hết thời gian làm bài viết!', 'info');
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);

    const handleSelectTask = (taskId) => {
        const task = IELTS_WRITING_TASKS.find(t => t.id === taskId);
        setSelectedTaskId(taskId);
        setEssayText('');
        setIsTimerRunning(false);
        setTimerSeconds((task?.timeLimitMinutes || 40) * 60);
        setShowSampleEssay(false);
    };

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleToggleTimer = () => {
        setIsTimerRunning(!isTimerRunning);
    };

    const handleResetTimer = () => {
        setIsTimerRunning(false);
        setTimerSeconds((activeTask?.timeLimitMinutes || 40) * 60);
    };

    const handleSaveEssay = () => {
        if (!essayText.trim()) {
            if (showToast) showToast('Vui lòng viết nội dung bài luận trước khi lưu!', 'error');
            return;
        }

        const overall = (
            (parseFloat(selfAssessment.ta_tr) +
             parseFloat(selfAssessment.cc) +
             parseFloat(selfAssessment.lr) +
             parseFloat(selfAssessment.gra)) / 4
        ).toFixed(1);

        const essayRecord = {
            id: 'essay_' + Date.now(),
            taskId: activeTask.id,
            taskType: activeTask.type,
            prompt: activeTask.prompt,
            content: essayText,
            wordCount,
            timeSpentMinutes: activeTask.timeLimitMinutes - Math.floor(timerSeconds / 60),
            date: new Date().toISOString(),
            selfAssessment: {
                ...selfAssessment,
                overall
            }
        };

        if (onSaveEssay) {
            onSaveEssay(essayRecord);
        }
        if (showToast) {
            showToast('Đã lưu bài viết thành công vào Lịch Sử Luyện Tập!', 'success');
        }
    };

    const outlineEntries = activeTask?.outlineGuide ? Object.entries(activeTask.outlineGuide) : [];
    const peelArray = Array.isArray(activeTask?.peelOutline) ? activeTask.peelOutline : [];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Phòng Writing Lab</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Giao diện Split-Screen, đếm từ real-time, đồng hồ 20/40p và dàn ý PEEL chuẩn giám khảo.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3.5 py-2 border font-mono font-bold text-sm bg-white shadow-editorial ${
                        timerSeconds < 300 ? 'text-brand-jasper border-brand-jasper animate-pulse' : 'text-brand-cerulean border-brand-cerulean'
                    }`}>
                        <Clock size={16} />
                        <span>{formatTimer(timerSeconds)}</span>
                        <button
                            type="button"
                            onClick={handleToggleTimer}
                            className="ml-1 p-1 hover:text-brand-jasper text-brand-cerulean"
                            title={isTimerRunning ? 'Tạm dừng' : 'Bắt đầu bấm giờ'}
                        >
                            {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button
                            type="button"
                            onClick={handleResetTimer}
                            className="p-1 hover:text-brand-jasper text-gray-400"
                            title="Đặt lại đồng hồ"
                        >
                            <RotateCcw size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Task Selector Bar - Editorial Style */}
            <div className="border-editorial p-4 bg-white shadow-editorial flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-serif-title uppercase font-bold text-gray-500 mr-2">Chọn Đề Bài:</span>
                    {IELTS_WRITING_TASKS.map(task => (
                        <button
                            key={task.id}
                            type="button"
                            onClick={() => handleSelectTask(task.id)}
                            className={`px-3 py-1.5 text-xs font-serif-title font-bold transition-all border ${
                                selectedTaskId === task.id
                                    ? 'bg-brand-jasper text-white border-brand-jasper shadow-xs'
                                    : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cerulean/10'
                            }`}
                        >
                            {task.type} • {task.topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* SPLIT-SCREEN WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Screen: Prompt & PEEL Framework (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Prompt Box */}
                    <div className="border-editorial bg-white p-6 shadow-editorial space-y-3">
                        <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-2">
                            <span className="text-xs font-serif-title uppercase font-bold px-2.5 py-0.5 border bg-red-50 text-brand-jasper border-red-200">
                                {activeTask.type}
                            </span>
                            <span className="text-xs font-newsreader text-gray-500">
                                Đề xuất: ≥ {activeTask.recommendedWords} từ ({activeTask.timeLimitMinutes} phút)
                            </span>
                        </div>

                        <h3 className="font-serif-title font-bold text-brand-cerulean text-base">
                            Đề Bài (Prompt):
                        </h3>
                        <p className="text-xs font-newsreader text-gray-800 leading-relaxed p-3.5 bg-brand-cream/60 border border-brand-cerulean/15">
                            {activeTask.prompt}
                        </p>

                        {/* Graph Preview if Task 1 */}
                        {activeTask.graphData && (
                            <div className="p-3.5 bg-white border border-brand-cerulean/20 space-y-2">
                                <span className="text-xs font-serif-title font-bold text-brand-cerulean uppercase block">
                                    📊 Biểu Đồ Dữ Liệu Tham Chiếu:
                                </span>
                                <div className="space-y-2">
                                    {activeTask.graphData.countries.map((c, i) => (
                                        <div key={i} className="text-xs font-mono">
                                            <div className="flex justify-between text-gray-700 mb-1">
                                                <span className="font-bold">{c.name}</span>
                                                <span>1980: {c.data[0]}% ➔ 2020: {c.data[4]}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-cerulean"
                                                    style={{ width: `${c.data[4]}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PEEL Paragraph Framework / Outline Guide Helper */}
                    {(outlineEntries.length > 0 || peelArray.length > 0) && (
                        <div className="border border-brand-cerulean/25 bg-brand-cream/30 p-5 space-y-3">
                            <div
                                onClick={() => setShowPeelGuide(!showPeelGuide)}
                                className="flex items-center justify-between cursor-pointer border-b border-brand-cerulean/15 pb-2"
                            >
                                <h4 className="font-serif-title font-bold text-brand-cerulean text-sm flex items-center gap-1.5">
                                    <BookOpen size={16} className="text-brand-jasper" />
                                    Khung Dàn Ý Gợi Ý Chuẩn Giám Khảo
                                </h4>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${showPeelGuide ? 'rotate-180' : ''}`} />
                            </div>

                            {showPeelGuide && (
                                <div className="space-y-2 text-xs font-newsreader text-gray-800 animate-fade-in">
                                    {outlineEntries.map(([sectionKey, sectionContent]) => (
                                        <div key={sectionKey} className="p-2.5 bg-white border border-brand-cerulean/15">
                                            <strong className="text-brand-jasper font-serif-title uppercase block">{sectionKey}:</strong>
                                            <span className="text-gray-700">{sectionContent}</span>
                                        </div>
                                    ))}
                                    {peelArray.map((item, idx) => (
                                        <div key={idx} className="p-2.5 bg-white border border-brand-cerulean/15">
                                            <strong className="text-brand-jasper font-serif-title block">{item.step || `Bước ${idx + 1}`}:</strong>
                                            <span className="text-gray-700">{item.guide || item.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Screen: Writing Area & Word Count (7 Cols) */}
                <div className="lg:col-span-7 border-editorial bg-white p-6 md:p-8 shadow-editorial space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-cerulean/20 pb-3">
                        <div className="flex items-center gap-3">
                            <span className="font-serif-title font-bold text-brand-cerulean text-lg">Bài Viết Của Bạn</span>
                            <span className={`px-2.5 py-0.5 text-xs font-mono font-bold border ${
                                wordCount >= activeTask.recommendedWords
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}>
                                {wordCount} từ / tối thiểu {activeTask.recommendedWords} từ
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowSampleEssay(!showSampleEssay)}
                                className="text-xs font-serif-title font-bold text-brand-cerulean hover:underline flex items-center gap-1"
                            >
                                <Sparkles size={14} className="text-amber-600" />
                                {showSampleEssay ? 'Ẩn Bài Mẫu 8.5+' : 'Xem Bài Mẫu 8.5+'}
                            </button>
                        </div>
                    </div>

                    {/* Editor Textarea */}
                    <textarea
                        rows={14}
                        placeholder="Bắt đầu viết bài luận của bạn tại đây theo cấu trúc PEEL (Introduction, Overview/Body 1, Body 2, Conclusion)..."
                        value={essayText}
                        onChange={(e) => setEssayText(e.target.value)}
                        className="w-full p-4 bg-brand-cream/30 border border-brand-cerulean/30 text-xs font-newsreader text-gray-900 leading-relaxed focus:outline-none focus:border-brand-jasper"
                    />

                    {/* Band 8.5+ Sample Essay Overlay */}
                    {showSampleEssay && (activeTask.sampleEssayBand85 || activeTask.sampleBand8) && (
                        <div className="p-4 bg-amber-50/50 border border-amber-300 space-y-3 text-xs font-newsreader animate-fade-in">
                            <div className="flex items-center gap-1.5 font-serif-title font-bold text-amber-950 uppercase border-b border-amber-200 pb-2">
                                <Award size={16} className="text-amber-700" /> {activeTask.sampleEssayBand85?.title || 'Bài Mẫu Giám Khảo Band 8.5+'}
                            </div>
                            <p className="text-gray-800 whitespace-pre-line leading-relaxed bg-white p-3.5 border border-amber-200">
                                {activeTask.sampleEssayBand85?.content || activeTask.sampleBand8}
                            </p>
                            {activeTask.sampleEssayBand85?.examinerComments && (
                                <div className="space-y-1.5 pt-1">
                                    <span className="font-serif-title font-bold text-brand-cerulean block uppercase text-[11px]">
                                        Nhận xét chi tiết của Giám khảo (Examiner Comments):
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                        {activeTask.sampleEssayBand85.examinerComments.map((c, i) => (
                                            <div key={i} className="p-2 bg-white border border-amber-200">
                                                <strong className="text-brand-jasper block">{c.criteria}:</strong>
                                                <span className="text-gray-700">{c.comment}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Self-Assessment Rubric Score Card */}
                    <div className="pt-3 border-t border-brand-cerulean/20 space-y-3">
                        <span className="text-xs font-serif-title uppercase font-bold text-brand-cerulean block">
                            Tự Đánh Giá Theo Rubrics IELTS (Band Score Descriptors):
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
                            {['ta_tr', 'cc', 'lr', 'gra'].map(crit => (
                                <div key={crit} className="space-y-1">
                                    <label className="text-[11px] font-mono text-gray-500 uppercase block font-bold">
                                        {crit.toUpperCase()}:
                                    </label>
                                    <select
                                        value={selfAssessment[crit]}
                                        onChange={(e) => setSelfAssessment({ ...selfAssessment, [crit]: e.target.value })}
                                        className="w-full p-2 bg-brand-cream border border-brand-cerulean/30 text-xs font-mono font-bold text-brand-cerulean"
                                    >
                                        {['5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map(b => (
                                            <option key={b} value={b}>Band {b}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end pt-2">
                            <button
                                type="button"
                                onClick={handleSaveEssay}
                                className="flex items-center gap-2 px-6 py-2.5 bg-brand-jasper text-white text-xs font-serif-title font-bold hover:bg-red-800 shadow-editorial"
                            >
                                <Save size={16} /> Lưu Bài Viết & Tự Đánh Giá
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
