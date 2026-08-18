import React, { useState } from 'react';
import {
    Target,
    Filter,
    CheckCircle2,
    XCircle,
    HelpCircle,
    ChevronRight,
    Headphones,
    BookOpen,
    PenTool,
    Mic,
    RotateCcw,
    Sparkles,
    AlertCircle,
    Info,
    Check
} from 'lucide-react';
import { IELTS_DRILLS, IELTS_SKILLS } from '../../data/ieltsData';
import { IeltsAudioPlayer } from './IeltsAudioPlayer';

export const IeltsDrillsView = ({ onCompleteDrill, showToast }) => {
    const [selectedSkill, setSelectedSkill] = useState('all');
    const [activeDrillId, setActiveDrillId] = useState(IELTS_DRILLS[0]?.id);
    
    // User answer state for active drill
    const [userAnswers, setUserAnswers] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [feedbackResults, setFeedbackResults] = useState(null);

    const activeDrill = IELTS_DRILLS.find(d => d.id === activeDrillId) || IELTS_DRILLS[0];

    // Filter drills list
    const filteredDrills = IELTS_DRILLS.filter(drill => {
        if (selectedSkill !== 'all' && drill.skill !== selectedSkill) return false;
        return true;
    });

    const handleSelectDrill = (drillId) => {
        setActiveDrillId(drillId);
        setUserAnswers({});
        setIsChecked(false);
        setFeedbackResults(null);
    };

    const handleAnswerChange = (questionId, val) => {
        if (isChecked) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: val }));
    };

    const handleCheckAnswers = () => {
        if (!activeDrill) return;
        let score = 0;
        const total = (activeDrill.questions || activeDrill.exercises || []).length;
        const results = {};

        if (activeDrill.questions) {
            activeDrill.questions.forEach(q => {
                const userVal = (userAnswers[q.id] || '').trim().toLowerCase();
                const correctVal = (q.correctAnswer || '').trim().toLowerCase();
                const isCorrect = userVal === correctVal || (userVal.length > 0 && correctVal.includes(userVal));
                if (isCorrect) score++;
                results[q.id] = isCorrect;
            });
        }

        setFeedbackResults({
            score,
            total,
            percentage: Math.round((score / Math.max(total, 1)) * 100),
            details: results
        });
        setIsChecked(true);

        if (onCompleteDrill) {
            onCompleteDrill({
                drillId: activeDrill.id,
                drillTitle: activeDrill.title,
                skill: activeDrill.skill,
                score,
                total,
                date: new Date().toISOString()
            });
        }
        if (showToast) {
            showToast(`Đã kiểm tra bài Drill: Đạt ${score}/${total} câu chính xác!`, 'success');
        }
    };

    const handleReset = () => {
        setUserAnswers({});
        setIsChecked(false);
        setFeedbackResults(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Kho Drills Chuyên Sâu IELTS</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Bài tập ngắn 3-5 phút theo từng dạng câu hỏi với giải thích bẫy chi tiết và bảng từ đồng nghĩa.</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="px-3.5 py-2 bg-white border border-brand-cerulean text-xs font-serif-title font-bold text-brand-cerulean shadow-editorial"
                    >
                        <option value="all">Tất cả Kỹ Năng ({IELTS_DRILLS.length})</option>
                        <option value="listening">Nghe (Listening)</option>
                        <option value="reading">Đọc (Reading)</option>
                        <option value="writing">Viết (Writing)</option>
                    </select>
                </div>
            </div>

            {/* Main Layout: Left Drills Sidebar + Right Interactive Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left List of Drills (4 Cols) */}
                <div className="lg:col-span-4 space-y-3">
                    <span className="text-xs font-serif-title uppercase font-bold text-gray-500 block px-1">
                        Danh Sách Bài Drills ({filteredDrills.length})
                    </span>

                    <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                        {filteredDrills.map((drill) => {
                            const isSelected = drill.id === activeDrillId;
                            return (
                                <div
                                    key={drill.id}
                                    onClick={() => handleSelectDrill(drill.id)}
                                    className={`p-4 border transition-all text-left cursor-pointer flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-blue-50/50 border-brand-jasper shadow-editorial ring-1 ring-brand-jasper'
                                            : 'bg-white border-brand-cerulean/20 hover:bg-brand-cream'
                                    }`}
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-serif-title uppercase font-bold px-2 py-0.5 border ${
                                                drill.skill === 'listening' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                                drill.skill === 'reading' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                                'bg-purple-50 text-purple-800 border-purple-200'
                                            }`}>
                                                {drill.skill.toUpperCase()} • {drill.targetBand}
                                            </span>
                                            <span className="text-[11px] font-mono text-gray-400 font-bold">{drill.timeEst}</span>
                                        </div>
                                        <h4 className={`font-serif-title font-bold text-sm line-clamp-2 ${
                                            isSelected ? 'text-brand-jasper' : 'text-brand-cerulean'
                                        }`}>
                                            {drill.title}
                                        </h4>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-brand-cerulean/15 text-[11px] font-mono text-gray-500 flex items-center justify-between">
                                        <span>Dạng: {drill.questionType}</span>
                                        <ChevronRight size={13} className={isSelected ? 'text-brand-jasper' : 'text-gray-300'} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Interactive Drill Work Area (8 Cols) - Editorial Box */}
                <div className="lg:col-span-8 border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                    {activeDrill && (
                        <>
                            {/* Drill Header */}
                            <div className="border-b border-brand-cerulean/20 pb-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean bg-brand-cerulean/10 px-2.5 py-0.5 border border-brand-cerulean/30">
                                        {activeDrill.skill.toUpperCase()} • {activeDrill.targetBand}
                                    </span>
                                    <span className="text-xs font-mono text-gray-500 font-bold">
                                        Thời gian gợi ý: {activeDrill.timeEst}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                    {activeDrill.title}
                                </h3>
                                <p className="text-xs font-newsreader text-gray-700 leading-relaxed">
                                    {activeDrill.strategy}
                                </p>
                            </div>

                            {/* Audio Player if Listening */}
                            {activeDrill.audioUrl && (
                                <div className="p-4 border border-brand-cerulean/20 bg-brand-cream/40 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                        <Headphones size={15} /> Trạm Phát Audio Đề Thi:
                                    </div>
                                    <IeltsAudioPlayer src={activeDrill.audioUrl} title={activeDrill.title} />
                                </div>
                            )}

                            {/* Reading Passage / Context if provided */}
                            {activeDrill.passage && (
                                <div className="border border-brand-cerulean/20 bg-brand-cream/30 p-4.5 space-y-2">
                                    <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean block">
                                        Đoạn Văn Trích Đoạn (Reading Excerpt):
                                    </span>
                                    <div className="text-xs font-newsreader text-gray-800 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-line p-3 bg-white border border-brand-cerulean/10">
                                        {activeDrill.passage}
                                    </div>
                                </div>
                            )}

                            {/* Questions Section */}
                            <div className="space-y-4 pt-2">
                                <span className="text-xs font-serif-title uppercase font-bold text-gray-500 block border-b border-brand-cerulean/15 pb-1">
                                    Nội Dung Câu Hỏi Luyện Tập:
                                </span>

                                <div className="space-y-4">
                                    {activeDrill.questions?.map((q, idx) => {
                                        const isCorrect = feedbackResults?.details?.[q.id];
                                        return (
                                            <div
                                                key={q.id}
                                                className={`p-4 border transition-all ${
                                                    isChecked
                                                        ? isCorrect
                                                            ? 'border-emerald-400 bg-emerald-50/40'
                                                            : 'border-red-400 bg-red-50/40'
                                                        : 'border-brand-cerulean/20 bg-white'
                                                }`}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-2 text-sm font-sans font-bold text-gray-800">
                                                        <span className="w-5 h-5 bg-brand-cerulean text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                            {idx + 1}
                                                        </span>
                                                        <span>{q.prompt}</span>
                                                    </div>

                                                    {/* If Multiple Choice Options */}
                                                    {q.options && q.options.length > 0 ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-7">
                                                            {q.options.map(opt => (
                                                                <label
                                                                    key={opt.key}
                                                                    className={`p-2.5 border text-xs font-sans flex items-center gap-2 cursor-pointer transition-all ${
                                                                        userAnswers[q.id] === opt.key
                                                                            ? 'border-brand-cerulean bg-blue-50 font-bold'
                                                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`q_${q.id}`}
                                                                        value={opt.key}
                                                                        checked={userAnswers[q.id] === opt.key}
                                                                        onChange={() => handleAnswerChange(q.id, opt.key)}
                                                                        disabled={isChecked}
                                                                        className="text-brand-cerulean"
                                                                    />
                                                                    <span><strong>{opt.key}.</strong> {opt.text}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        /* Text Input */
                                                        <div className="pl-7 pt-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Nhập câu trả lời (tối đa 2-3 từ)..."
                                                                value={userAnswers[q.id] || ''}
                                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                                disabled={isChecked}
                                                                className="w-full p-2.5 border border-brand-cerulean/30 text-xs font-mono bg-white"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Feedback Box (Revealed after Check) */}
                                                    {isChecked && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 pl-7 text-xs font-newsreader space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                {isCorrect ? (
                                                                    <span className="text-emerald-800 font-bold flex items-center gap-1 font-serif-title">
                                                                        <CheckCircle2 size={14} /> Chính xác! Đáp án: {q.correctAnswer}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-800 font-bold flex items-center gap-1 font-serif-title">
                                                                        <XCircle size={14} /> Chưa đúng. Đáp án chuẩn: {q.correctAnswer}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {q.distractorNote && (
                                                                <p className="text-gray-700 italic">
                                                                    <strong>Giải thích bẫy:</strong> {q.distractorNote}
                                                                </p>
                                                            )}
                                                            {q.synonymMatch && (
                                                                <div className="text-[11px] font-mono text-brand-jasper bg-white p-2 border border-brand-cerulean/15 mt-1">
                                                                    Từ đồng nghĩa (Paraphrase): {q.synonymMatch}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-4 border-t border-brand-cerulean/20">
                                {isChecked ? (
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs font-mono font-bold">
                                            Kết quả: <span className="text-brand-jasper text-base">{feedbackResults.score}/{feedbackResults.total}</span> ({feedbackResults.percentage}%)
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="px-4 py-2 border border-gray-300 text-xs font-serif-title font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                                        >
                                            <RotateCcw size={14} /> Làm lại
                                        </button>
                                    </div>
                                ) : (
                                    <div />
                                )}

                                {!isChecked && (
                                    <button
                                        type="button"
                                        onClick={handleCheckAnswers}
                                        className="px-6 py-2.5 bg-brand-jasper text-white text-xs font-serif-title font-bold hover:bg-red-800 shadow-editorial flex items-center gap-1.5"
                                    >
                                        <Check size={16} /> Kiểm Tra Đáp Án & Xem Giải Thích
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
