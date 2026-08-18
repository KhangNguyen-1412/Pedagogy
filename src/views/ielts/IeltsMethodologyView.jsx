import React, { useState } from 'react';
import {
    GraduationCap,
    BookOpen,
    Layers,
    AlertTriangle,
    Sparkles,
    CheckCircle,
    HelpCircle,
    ChevronRight,
    Award,
    FileText,
    Mic,
    PenTool,
    Headphones,
    ArrowRight
} from 'lucide-react';
import {
    IELTS_RUBRICS,
    IELTS_METHODOLOGIES,
    IELTS_ERROR_ANALYSIS,
    IELTS_LINGUISTICS
} from '../../data/ieltsData';

export const IeltsMethodologyView = ({ onSelectZone }) => {
    const [activeTab, setActiveTab] = useState('rubrics'); // 'rubrics', 'frameworks', 'distractors', 'linguistics'
    const [selectedSkill, setSelectedSkill] = useState('writing');

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Phương Pháp Luận & Rubrics IELTS</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Giải phẫu Band Descriptors 5.0 - 9.0, Khung tư duy PEEL/5W1H và Bẫy L1 Pitfalls.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { id: 'rubrics', label: '1. Tiêu chí Rubrics', icon: Award },
                        { id: 'frameworks', label: '2. Khung tư duy', icon: Layers },
                        { id: 'distractors', label: '3. Bẫy & Lỗi L1', icon: AlertTriangle },
                        { id: 'linguistics', label: '4. Ngôn ngữ 7.5+', icon: Sparkles }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1.5 text-xs font-serif-title font-bold transition-all border flex items-center gap-1.5 ${
                                    isActive
                                        ? 'bg-brand-jasper text-white border-brand-jasper shadow-editorial'
                                        : 'bg-white text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cream'
                                }`}
                            >
                                <Icon size={14} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TAB 1: RUBRICS & BAND DESCRIPTORS */}
            {activeTab === 'rubrics' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Skill Toggle Bar */}
                    <div className="border-editorial p-4 bg-white shadow-editorial flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-serif-title uppercase font-bold text-gray-500">Chọn Kỹ Năng:</span>
                            <div className="inline-flex border border-brand-cerulean bg-white p-0.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSkill('writing')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif-title font-bold transition-all ${
                                        selectedSkill === 'writing' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean hover:bg-brand-cream'
                                    }`}
                                >
                                    <PenTool size={14} /> Writing (Task 1 & 2)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedSkill('speaking')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif-title font-bold transition-all ${
                                        selectedSkill === 'speaking' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean hover:bg-brand-cream'
                                    }`}
                                >
                                    <Mic size={14} /> Speaking (Parts 1-3)
                                </button>
                            </div>
                        </div>

                        <div className="text-xs font-newsreader text-gray-600 italic">
                            * Tiêu chuẩn tham chiếu từ Bảng mô tả Band điểm chính thức của Cambridge ESOL & IDP.
                        </div>
                    </div>

                    {/* 4 Core Criteria Cards - Editorial Style */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(selectedSkill === 'writing' ? IELTS_RUBRICS.writing.task2_criteria : IELTS_RUBRICS.speaking.criteria).map((crit, idx) => (
                            <div key={idx} className="border-editorial bg-white p-5 shadow-editorial space-y-2 hover:bg-blue-50/20 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="w-8 h-8 bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/30 flex items-center justify-center font-mono font-bold text-xs">
                                            {crit.code}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-brand-jasper px-2 py-0.5 bg-red-50 border border-red-200">
                                            Trọng số {crit.weight}
                                        </span>
                                    </div>
                                    <h4 className="font-serif-title font-bold text-brand-cerulean text-base mb-1">{crit.name}</h4>
                                    <p className="text-xs font-newsreader text-gray-700 leading-relaxed">{crit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparative Band Descriptors Table - Editorial Box */}
                    <div className="border-editorial bg-white shadow-editorial overflow-hidden">
                        <div className="bg-brand-cream/80 p-4 border-b border-brand-cerulean/20 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="font-serif-title font-bold text-brand-cerulean text-lg">
                                    Bảng Phân Tích & Đối Chiếu Chi Tiết Từng Band Điểm
                                </h3>
                                <p className="text-xs font-newsreader text-gray-600">
                                    Nhận biết sự khác biệt cốt lõi giữa các mốc năng lực ngôn ngữ để bứt phá band điểm.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 space-y-4">
                            {(selectedSkill === 'writing' ? IELTS_RUBRICS.writing.band_descriptors : IELTS_RUBRICS.speaking.band_descriptors).map((bandItem, idx) => (
                                <div
                                    key={idx}
                                    className="border border-brand-cerulean/20 p-5 bg-brand-cream/20 hover:border-brand-cerulean transition-all space-y-3"
                                >
                                    <div className="flex items-center gap-2 border-b border-brand-cerulean/15 pb-2">
                                        <Award className="text-brand-jasper" size={20} />
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-lg">
                                            {bandItem.band}
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-newsreader text-gray-800">
                                        {selectedSkill === 'writing' ? (
                                            <>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Task Achievement / Response (TA/TR):
                                                    </span>
                                                    {bandItem.TA || bandItem.TR}
                                                </div>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Coherence & Cohesion (CC):
                                                    </span>
                                                    {bandItem.CC}
                                                </div>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Lexical Resource (LR):
                                                    </span>
                                                    {bandItem.LR}
                                                </div>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Grammatical Range & Accuracy (GRA):
                                                    </span>
                                                    {bandItem.GRA}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Fluency & Coherence (FC):
                                                    </span>
                                                    {bandItem.FC}
                                                </div>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Lexical Resource (LR):
                                                    </span>
                                                    {bandItem.LR}
                                                </div>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Grammatical Range & Accuracy (GRA):
                                                    </span>
                                                    {bandItem.GRA}
                                                </div>
                                                <div className="p-3 bg-white border border-brand-cerulean/15">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                        Pronunciation (P):
                                                    </span>
                                                    {bandItem.P}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: FRAMEWORKS & THOUGHT STRUCTURE */}
            {activeTab === 'frameworks' && (
                <div className="space-y-6 animate-fade-in">
                    {/* PEEL Paragraph Framework */}
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="flex items-center gap-2 text-xl font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-3">
                            <Layers size={22} className="text-brand-jasper" />
                            Khung Viết Đoạn Chuẩn Học Thuật: {IELTS_METHODOLOGIES.peel.name}
                        </div>
                        <p className="text-xs font-newsreader text-gray-700 leading-relaxed">
                            {IELTS_METHODOLOGIES.peel.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            {IELTS_METHODOLOGIES.peel.steps.map((step, idx) => (
                                <div key={idx} className="border border-brand-cerulean/25 bg-brand-cream/30 p-4 space-y-2 flex flex-col justify-between">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="w-6 h-6 bg-brand-cerulean text-white font-mono font-bold text-xs flex items-center justify-center">
                                                {step.step}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-500 font-bold">Bước {idx + 1}</span>
                                        </div>
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">{step.meaning}</h4>
                                        <p className="text-xs font-newsreader text-gray-700 leading-relaxed">{step.desc}</p>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-brand-cerulean/15 text-[11px] font-mono text-brand-jasper bg-white p-2 border">
                                        {step.example}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5W1H Speaking Framework */}
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="flex items-center gap-2 text-xl font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-3">
                            <Mic size={22} className="text-brand-jasper" />
                            Khung Phản Xạ Nói Không Bao Giờ Bí Ý: {IELTS_METHODOLOGIES.speaking5W1H.name}
                        </div>
                        <p className="text-xs font-newsreader text-gray-700 leading-relaxed">
                            {IELTS_METHODOLOGIES.speaking5W1H.description}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                            {IELTS_METHODOLOGIES.speaking5W1H.elements.map((el, idx) => (
                                <div key={idx} className="p-3 border border-brand-cerulean/25 bg-brand-cream/20 text-center space-y-1">
                                    <span className="font-mono font-bold text-brand-jasper text-base block">{el.q}</span>
                                    <span className="font-serif-title font-bold text-brand-cerulean text-xs block">{el.focus}</span>
                                    <p className="text-[11px] font-newsreader text-gray-600 leading-tight">{el.prompt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: ERROR ANALYSIS & DISTRACTORS */}
            {activeTab === 'distractors' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Listening/Reading Distractors */}
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-xl font-serif-title font-bold text-brand-cerulean flex items-center gap-2">
                                <AlertTriangle size={20} className="text-amber-700" />
                                Phân Tích Cấu Trúc Bẫy Trong Bài Thi Nghe & Đọc (Distractor Traps)
                            </h3>
                            <p className="text-xs font-newsreader text-gray-600 mt-1">
                                Giám khảo thiết kế câu hỏi trắc nghiệm dựa trên các mẫu tâm lý nghe/đọc sai lệch có quy luật.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {IELTS_ERROR_ANALYSIS.receptiveDistractors.map((trap, idx) => (
                                <div key={idx} className="border border-brand-cerulean/25 bg-brand-cream/30 p-4.5 space-y-2.5 flex flex-col justify-between">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-serif-title uppercase font-bold text-brand-jasper bg-red-50 px-2 py-0.5 border border-red-200">
                                                {trap.code}
                                            </span>
                                        </div>
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">{trap.type}</h4>
                                        <p className="text-xs font-newsreader text-gray-700 leading-relaxed">{trap.mechanism}</p>
                                    </div>
                                    <div className="mt-2 p-2.5 bg-white border border-brand-cerulean/15 text-xs font-newsreader text-brand-jasper">
                                        <strong>Chiến thuật vượt bẫy:</strong> {trap.counterStrategy}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vietnamese L1 Transfer Errors */}
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="border-b border-red-200 pb-3">
                            <h3 className="text-xl font-serif-title font-bold text-brand-jasper flex items-center gap-2">
                                <Sparkles size={20} />
                                Các Lỗi Giao Thoa Ngôn Ngữ Điển Hình Của Người Việt (L1 Pitfalls)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {IELTS_ERROR_ANALYSIS.productiveL1Errors.map((err, idx) => (
                                <div key={idx} className="border border-red-200 bg-red-50/20 p-4.5 space-y-2">
                                    <h4 className="font-serif-title font-bold text-red-950 text-sm">{err.error}</h4>
                                    <div className="text-xs font-mono space-y-1 p-2.5 bg-white border border-red-200">
                                        <div className="text-red-700">✗ Sai: {err.badExample}</div>
                                        <div className="text-emerald-700 font-bold">✓ Chuẩn: {err.goodExample}</div>
                                    </div>
                                    <p className="text-xs font-newsreader text-gray-700 italic pt-1">{err.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: LINGUISTICS & HIGH-BAND VOCABULARY */}
            {activeTab === 'linguistics' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-xl font-serif-title font-bold text-brand-cerulean flex items-center gap-2">
                                <Sparkles size={20} className="text-brand-jasper" />
                                Từ Vựng Học Thuật Theo Sắc Thái & Cụm Kết Hợp (Collocations & Register)
                            </h3>
                            <p className="text-xs font-newsreader text-gray-600 mt-1">
                                Điểm khác biệt giữa 6.0 và 8.0 nằm ở độ tự nhiên của cụm từ (Collocational Precision) và văn phong học thuật chuẩn mực (Academic Register).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {IELTS_LINGUISTICS.academicCollocations.map((item, idx) => (
                                <div key={idx} className="border border-brand-cerulean/25 bg-brand-cream/30 p-5 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-serif-title uppercase font-bold text-brand-cerulean bg-blue-50 px-2 py-0.5 border border-blue-200">
                                            Chủ đề: {item.topic}
                                        </span>
                                        <div className="text-xs space-y-1">
                                            <div className="text-gray-500 font-mono">Diễn đạt 6.0: {item.basicWord}</div>
                                            <div className="text-brand-jasper font-bold font-serif-title text-base">
                                                ★ Cụm 7.5+: {item.highBandCollocation}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white border border-brand-cerulean/15 text-xs font-newsreader italic text-gray-800">
                                        "{item.exampleSentence}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
