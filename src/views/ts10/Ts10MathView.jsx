import React, { useState } from 'react';
import {
    Calculator,
    AlertTriangle,
    CheckCircle2,
    BookOpen,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    Award,
    Sparkles,
    Eye,
    EyeOff,
    Check,
    Layers,
    Clock,
    Tag
} from 'lucide-react';
import { TS10_MATH_TOPICS } from '../../data/ts10Data';
import { MathText } from '../../components/common/MathText';

export const Ts10MathView = () => {
    const [selectedTopicId, setSelectedTopicId] = useState(TS10_MATH_TOPICS[0]?.id);
    const [revealedSteps, setRevealedSteps] = useState({}); // { [stepIndex]: boolean }
    const [revealAll, setRevealAll] = useState(true);

    const activeTopic = TS10_MATH_TOPICS.find(t => t.id === selectedTopicId) || TS10_MATH_TOPICS[0];

    const toggleStep = (idx) => {
        setRevealedSteps(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const handleToggleAll = () => {
        const nextState = !revealAll;
        setRevealAll(nextState);
        const newState = {};
        activeTopic.sampleProblem?.stepsBarem.forEach((_, idx) => {
            newState[idx] = nextState;
        });
        setRevealedSteps(newState);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Toán 10 & Barem Bước Làm</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Giải phẫu bước làm bài toán, barem điểm 0.25đ và cảnh báo bẫy trừ điểm oan.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleToggleAll}
                        className="flex items-center gap-2 px-4 py-2 border border-brand-cerulean text-brand-cerulean font-serif-title hover:bg-brand-cerulean hover:text-white transition-colors text-sm shadow-editorial whitespace-nowrap bg-white"
                    >
                        {revealAll ? <EyeOff size={16} /> : <Eye size={16} />}
                        {revealAll ? 'Ẩn toàn bộ bước' : 'Hiện toàn bộ barem'}
                    </button>
                </div>
            </div>

            {/* Topic Selector Cards - Editorial Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TS10_MATH_TOPICS.map(topic => {
                    const isSelected = selectedTopicId === topic.id;
                    return (
                        <div
                            key={topic.id}
                            onClick={() => {
                                setSelectedTopicId(topic.id);
                                setRevealAll(true);
                                setRevealedSteps({});
                            }}
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
                                        {topic.category}
                                    </span>
                                </div>
                                <h3 className={`font-serif-title font-bold text-sm line-clamp-2 ${
                                    isSelected ? 'text-brand-jasper' : 'text-brand-cerulean group-hover:text-brand-jasper'
                                }`}>
                                    <MathText text={topic.name} />
                                </h3>
                            </div>
                            <div className="mt-3 pt-2 border-t border-brand-cerulean/15 text-xs text-gray-500 flex items-center justify-between font-sans">
                                <span className="truncate">{topic.importance.split('(')[0]}</span>
                                <ChevronRight size={14} className={isSelected ? 'text-brand-jasper' : 'text-gray-400'} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Topic Workspace - Editorial Box */}
            <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                {/* Topic Header & Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-cerulean/20 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean bg-brand-cerulean/10 px-2.5 py-0.5 border border-brand-cerulean/30">
                                {activeTopic.category}
                            </span>
                            <span className="text-xs font-body text-gray-600 font-bold">
                                {activeTopic.importance}
                            </span>
                        </div>
                        <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean mt-2">
                            <MathText text={activeTopic.name} />
                        </h3>
                    </div>
                </div>

                {/* Formula Summary & Trap Warnings - Editorial Strips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Formula box */}
                    <div className="border border-brand-cerulean/30 bg-brand-cream/50 p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                            <BookOpen size={15} /> Công thức & Kiến thức cốt lõi
                        </div>
                        <div className="text-xs font-sans text-brand-cerulean leading-relaxed bg-white p-3 border border-brand-cerulean/20">
                            <MathText text={activeTopic.formulaSummary} />
                        </div>
                    </div>

                    {/* Trap warning */}
                    <div className="border border-amber-300 bg-amber-50/50 p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-amber-900 uppercase tracking-wider">
                            <AlertTriangle size={15} className="text-amber-700" /> Bẫy thường gặp & Lỗi trừ điểm oan
                        </div>
                        <div className="text-xs font-body text-amber-950 leading-relaxed bg-white p-3 border border-amber-200">
                            <MathText text={activeTopic.trapWarning} />
                        </div>
                    </div>
                </div>

                {/* Sample Problem Box */}
                {activeTopic.sampleProblem && (
                    <div className="space-y-4 pt-2">
                        <div className="border-editorial p-5 md:p-6 bg-brand-cream/40 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean bg-brand-cerulean/15 px-2.5 py-0.5 border border-brand-cerulean/40">
                                    Bài toán mẫu minh họa
                                </span>
                                <span className="text-xs italic text-gray-500 font-body">
                                    Chuẩn cấu trúc đề thi chính thức
                                </span>
                            </div>
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-lg">
                                <MathText text={activeTopic.sampleProblem.title} />
                            </h4>
                            <div className="text-sm text-gray-800 bg-white p-4 border border-brand-cerulean/20 leading-relaxed">
                                <MathText text={activeTopic.sampleProblem.question} />
                            </div>
                        </div>

                        {/* Step-by-Step Logic with 0.25 Point Barem */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-2">
                                <h4 className="font-serif-title font-bold text-brand-cerulean text-lg flex items-center gap-2">
                                    <Layers size={18} className="text-brand-jasper" />
                                    Giải phẫu barem bước làm chi tiết (Step-by-Step Logic)
                                </h4>
                                <span className="text-xs text-gray-500 italic font-body">
                                    * Nhấp vào từng bước để ẩn/hiện lời giải
                                </span>
                            </div>

                            <div className="space-y-3">
                                {activeTopic.sampleProblem.stepsBarem.map((step, idx) => {
                                    const isRevealed = revealAll || revealedSteps[idx];
                                    return (
                                        <div
                                            key={idx}
                                            className="border border-brand-cerulean/25 bg-white shadow-xs transition-all"
                                        >
                                            {/* Step Header */}
                                            <button
                                                type="button"
                                                onClick={() => toggleStep(idx)}
                                                className="w-full p-3.5 text-left flex items-center justify-between bg-brand-cream/30 hover:bg-blue-50/40 transition-colors border-b border-gray-100"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 bg-brand-cerulean text-white font-mono font-bold text-xs flex items-center justify-center">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-serif-title font-bold text-brand-cerulean text-sm">
                                                        {step.stepNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-300">
                                                        +{step.points}
                                                    </span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-gray-400 transition-transform ${isRevealed ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </button>

                                            {/* Step Body */}
                                            {isRevealed && (
                                                <div className="p-4 md:p-5 space-y-3 bg-white animate-fade-in">
                                                    <div className="text-sm font-sans text-gray-800 bg-brand-cream/30 p-4 border border-brand-cerulean/15 leading-relaxed">
                                                        <MathText text={step.content} />
                                                    </div>
                                                    {step.note && (
                                                        <div className="flex items-start gap-2 text-xs text-brand-cerulean bg-blue-50/60 p-3 border border-brand-cerulean/20">
                                                            <HelpCircle size={15} className="shrink-0 text-brand-jasper mt-0.5" />
                                                            <span><strong>Lời khuyên của Giám khảo:</strong> <MathText text={step.note} /></span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
