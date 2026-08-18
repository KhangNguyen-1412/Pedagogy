import React, { useState } from 'react';
import {
    Languages,
    CheckCircle2,
    XCircle,
    HelpCircle,
    ChevronRight,
    Sparkles,
    AlertTriangle,
    BookOpen,
    ArrowRight,
    RotateCcw
} from 'lucide-react';
import { TS10_ENGLISH_TOPICS } from '../../data/ts10Data';

export const Ts10EnglishView = () => {
    const [selectedTopicId, setSelectedTopicId] = useState(TS10_ENGLISH_TOPICS[0]?.id);
    const [userAnswers, setUserAnswers] = useState({}); // { quizId: selectedOptionString }
    const [showTransformAnswers, setShowTransformAnswers] = useState({}); // { transId: boolean }

    const activeTopic = TS10_ENGLISH_TOPICS.find(t => t.id === selectedTopicId) || TS10_ENGLISH_TOPICS[0];

    const handleSelectOption = (quizId, optionStr) => {
        setUserAnswers(prev => ({
            ...prev,
            [quizId]: optionStr
        }));
    };

    const toggleTransformAnswer = (transId) => {
        setShowTransformAnswers(prev => ({
            ...prev,
            [transId]: !prev[transId]
        }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Tiếng Anh & Phân Tích Lỗi Sai</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Trắc nghiệm bóc tách bẫy ngữ âm/ngữ pháp (Error Analysis Engine) và kỹ thuật viết lại câu tương đương.</p>
                </div>
            </div>

            {/* Topics Selector - Editorial style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TS10_ENGLISH_TOPICS.map(topic => {
                    const isSelected = selectedTopicId === topic.id;
                    const quizCount = topic.quizzes?.length || topic.transformationExercises?.length || 0;
                    return (
                        <div
                            key={topic.id}
                            onClick={() => setSelectedTopicId(topic.id)}
                            className={`border-editorial p-5 bg-white cursor-pointer transition-all flex flex-col justify-between group ${
                                isSelected
                                    ? 'bg-blue-50/40 border-brand-jasper shadow-editorial ring-1 ring-brand-jasper'
                                    : 'hover:bg-blue-50/30'
                            }`}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-serif-title uppercase font-bold px-2 py-0.5 border ${
                                        isSelected 
                                            ? 'bg-brand-jasper text-white border-brand-jasper' 
                                            : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30'
                                    }`}>
                                        {topic.category || 'Tiếng Anh 10'}
                                    </span>
                                </div>
                                <h3 className={`font-serif-title font-bold text-base ${
                                    isSelected ? 'text-brand-jasper' : 'text-brand-cerulean group-hover:text-brand-jasper'
                                }`}>
                                    {topic.name}
                                </h3>
                            </div>
                            <div className="mt-3 pt-2 border-t border-brand-cerulean/15 text-xs text-gray-500 flex items-center justify-between font-sans">
                                <span>{quizCount} bài tập luyện</span>
                                <ChevronRight size={14} className={isSelected ? 'text-brand-jasper' : 'text-gray-400'} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Topic Content Workspace - Editorial Box */}
            {activeTopic && (
                <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                    {/* Topic Core Grammar / Rules Box */}
                    {activeTopic.summaryRules && (
                        <div className="border border-brand-cerulean/25 bg-brand-cream/40 p-5 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                <BookOpen size={16} /> Quy Tắc Ngữ Pháp & Dấu Hiệu Nhận Biết Cốt Lõi
                            </div>

                            <div className="text-xs font-newsreader text-gray-800 leading-relaxed bg-white p-4 border border-brand-cerulean/20 whitespace-pre-line">
                                {activeTopic.summaryRules}
                            </div>
                        </div>
                    )}

                    {/* 1. QUIZZES WITH ERROR ANALYSIS */}
                    {activeTopic.quizzes && activeTopic.quizzes.length > 0 && (
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-3">
                                <h4 className="font-serif-title font-bold text-brand-cerulean text-lg flex items-center gap-2">
                                    <Sparkles size={18} className="text-brand-jasper" />
                                    Luyện Tập & Phân Tích Chi Tiết Cấu Trúc Lỗi Sai (Error Analysis)
                                </h4>
                                <span className="text-xs italic text-gray-500 font-body">
                                    * Bấm vào phương án để mở khóa phân tích lỗi
                                </span>
                            </div>

                            <div className="space-y-6">
                                {activeTopic.quizzes.map((quiz, qIdx) => {
                                    const selectedOption = userAnswers[quiz.id];
                                    const isAnswered = Boolean(selectedOption);

                                    return (
                                        <div
                                            key={quiz.id}
                                            className="border border-brand-cerulean/30 p-5 bg-white space-y-4 shadow-xs"
                                        >
                                            {/* Question Prompt */}
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 bg-brand-cerulean text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                    {qIdx + 1}
                                                </span>
                                                <p className="text-sm font-sans font-bold text-gray-900 leading-relaxed">
                                                    {quiz.question}
                                                </p>
                                            </div>

                                            {/* 4 Options */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-9">
                                                {quiz.options.map((opt, oIdx) => {
                                                    const isThisSelected = selectedOption === opt;
                                                    const isCorrect = opt === quiz.correctAnswer;

                                                    let btnStyle = "border-gray-300 hover:border-brand-cerulean bg-white text-gray-800";
                                                    if (isAnswered) {
                                                        if (isCorrect) {
                                                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                                                        } else if (isThisSelected && !isCorrect) {
                                                            btnStyle = "border-red-500 bg-red-50 text-red-900 font-bold";
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={oIdx}
                                                            type="button"
                                                            onClick={() => handleSelectOption(quiz.id, opt)}
                                                            className={`p-3 text-left border text-xs font-sans transition-all flex items-center justify-between ${btnStyle}`}
                                                        >
                                                            <span>{opt}</span>

                                                            {isAnswered && isCorrect && (
                                                                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                                                            )}
                                                            {isAnswered && isThisSelected && !isCorrect && (
                                                                <XCircle size={16} className="text-red-700 shrink-0" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* ERROR ANALYSIS ENGINE BOX (Revealed after answering) */}
                                            {isAnswered && quiz.errorAnalysis && (
                                                <div className="mt-4 pt-4 border-t border-brand-cerulean/15 pl-9 space-y-3 animate-fade-in">
                                                    <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-jasper uppercase tracking-wider">
                                                        <HelpCircle size={15} /> Giải Phẫu Chi Tiết: Tại Sao Đúng? Tại Sao Sai?
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-newsreader">
                                                        {/* Correct Option Breakdown */}
                                                        <div className="p-3 bg-emerald-50/70 border border-emerald-300 space-y-1">
                                                            <strong className="text-emerald-900 block font-serif-title">
                                                                ✓ Đáp án ĐÚNG: ({quiz.correctAnswer})
                                                            </strong>
                                                            <p className="text-emerald-950 leading-relaxed">
                                                                {quiz.errorAnalysis.whyCorrect}
                                                            </p>
                                                        </div>

                                                        {/* Why Distractors are Wrong */}
                                                        <div className="p-3 bg-red-50/50 border border-red-200 space-y-1.5">
                                                            <strong className="text-red-900 block font-serif-title">
                                                                ✗ Phân tích lỗi các đáp án SAI:
                                                            </strong>
                                                            <p className="text-red-950 leading-relaxed">
                                                                {quiz.errorAnalysis.whyOthersWrong}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 2. SENTENCE TRANSFORMATIONS */}
                    {activeTopic.transformationExercises && activeTopic.transformationExercises.length > 0 && (
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-3">
                                <h4 className="font-serif-title font-bold text-brand-cerulean text-lg">
                                    Bài Tập Viết Lại Câu Tuyển Sinh 10 (Sentence Transformation)
                                </h4>
                            </div>

                            <div className="space-y-4">
                                {activeTopic.transformationExercises.map((trans, tIdx) => {
                                    const isShown = showTransformAnswers[trans.id];
                                    return (
                                        <div
                                            key={trans.id}
                                            className="border border-brand-cerulean/30 p-5 bg-white space-y-3 shadow-xs"
                                        >
                                            <div className="space-y-1 text-xs font-sans">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 bg-brand-cerulean text-white text-xs font-mono font-bold flex items-center justify-center">
                                                        {tIdx + 1}
                                                    </span>
                                                    <span className="font-bold text-gray-900 text-sm">{trans.originalSentence}</span>
                                                </div>
                                                <div className="pl-7 text-brand-jasper font-mono text-sm pt-1">
                                                    ➔ {trans.targetPrompt} ...
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => toggleTransformAnswer(trans.id)}
                                                className="ml-7 text-xs font-serif-title font-bold text-brand-cerulean hover:underline flex items-center gap-1"
                                            >
                                                {isShown ? 'Ẩn đáp án & bẫy ngữ pháp' : 'Hiện câu viết lại chuẩn & bẫy ngữ pháp'}
                                            </button>

                                            {isShown && (
                                                <div className="ml-7 p-3.5 bg-brand-cream/50 border border-brand-cerulean/20 space-y-2 text-xs font-newsreader animate-fade-in">
                                                    <div className="text-emerald-950 font-bold font-sans">
                                                        Đáp án chuẩn: <span className="underline">{trans.correctTransformation}</span>
                                                    </div>
                                                    {trans.explanation && (
                                                        <div className="text-gray-700">
                                                            <strong>Giải thích:</strong> {trans.explanation}
                                                        </div>
                                                    )}
                                                    {trans.commonMistakes && (
                                                        <div className="text-red-900 italic border-t border-brand-cerulean/15 pt-1.5">
                                                            {trans.commonMistakes}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
