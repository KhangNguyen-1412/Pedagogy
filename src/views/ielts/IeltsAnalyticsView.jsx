import React, { useState } from 'react';
import {
    TrendingUp,
    Target,
    Award,
    AlertCircle,
    Calendar,
    CheckCircle2,
    BookOpen,
    FileText,
    Mic,
    Clock,
    Sparkles,
    Trash2,
    Play
} from 'lucide-react';
import { IELTS_DIAGNOSTIC_ITEMS, DEFAULT_IELTS_PROFILE } from '../../data/ieltsData';

export const IeltsAnalyticsView = ({
    profile: userProfile,
    drillHistory = [],
    writingSubmissions = [],
    speakingRecordings = [],
    mockResults = [],
    onUpdateProfile,
    showToast
}) => {
    // Merge user profile with defaults to ensure all properties exist
    const profile = {
        ...DEFAULT_IELTS_PROFILE,
        ...(userProfile || {}),
        currentBands: {
            ...DEFAULT_IELTS_PROFILE.currentBands,
            ...(userProfile?.currentBands || {})
        },
        targetBands: {
            ...DEFAULT_IELTS_PROFILE.targetBands,
            ...(userProfile?.targetBands || {})
        }
    };

    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'gap_analysis', 'diagnostic', 'history'
    const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
    const [diagnosticCompleted, setDiagnosticCompleted] = useState(false);
    const [diagnosticResult, setDiagnosticResult] = useState(null);

    const handleDiagnosticSelect = (itemId, optIdx) => {
        setDiagnosticAnswers(prev => ({ ...prev, [itemId]: optIdx }));
    };

    const handleFinishDiagnostic = () => {
        let correctCount = 0;
        IELTS_DIAGNOSTIC_ITEMS.forEach(item => {
            if (diagnosticAnswers[item.id] === item.correctIndex) {
                correctCount++;
            }
        });

        const estimatedBand = correctCount === IELTS_DIAGNOSTIC_ITEMS.length ? '7.5+' : (correctCount > 0 ? '6.5' : '5.5');
        setDiagnosticResult({
            score: correctCount,
            total: IELTS_DIAGNOSTIC_ITEMS.length,
            band: estimatedBand
        });
        setDiagnosticCompleted(true);
        if (showToast) {
            showToast(`Hoàn thành bài Chẩn đoán! Trình độ ước tính ban đầu: Band ${estimatedBand}`, 'success');
        }
    };

    const targetListening = profile.targetBands?.listening || profile.targetListening || '8.0';
    const targetReading = profile.targetBands?.reading || profile.targetReading || '8.0';
    const targetWriting = profile.targetBands?.writing || profile.targetWriting || '7.0';
    const targetSpeaking = profile.targetBands?.speaking || profile.targetSpeaking || '7.0';

    const currentListening = profile.currentBands?.listening || '6.5';
    const currentReading = profile.currentBands?.reading || '7.0';
    const currentWriting = profile.currentBands?.writing || '6.0';
    const currentSpeaking = profile.currentBands?.speaking || '6.0';

    const milestones = profile.pathwayMilestones || DEFAULT_IELTS_PROFILE.pathwayMilestones || [];
    const weaknesses = profile.weaknesses || DEFAULT_IELTS_PROFILE.weaknesses || [];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Tiến Độ & Phân Tích Lỗ Hổng</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Chẩn đoán năng lực khởi điểm, phân rã điểm yếu và theo dõi lộ trình Target Band {profile.targetBandOverall || '7.5'}.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { id: 'overview', label: '1. Tổng quan', icon: TrendingUp },
                        { id: 'gap_analysis', label: '2. Phân tích lỗ hổng', icon: AlertCircle },
                        { id: 'diagnostic', label: '3. Diagnostic Placement', icon: Target },
                        { id: 'history', label: '4. Nhật ký', icon: Clock }
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

            {/* TAB 1: OVERVIEW & RADAR / SCORE PROGRESSION */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    {/* 4 Skills Target Band Cards - Editorial Style */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { skill: 'Listening', current: currentListening, target: targetListening, color: 'text-blue-900' },
                            { skill: 'Reading', current: currentReading, target: targetReading, color: 'text-emerald-900' },
                            { skill: 'Writing', current: currentWriting, target: targetWriting, color: 'text-purple-900' },
                            { skill: 'Speaking', current: currentSpeaking, target: targetSpeaking, color: 'text-brand-jasper' }
                        ].map((item, idx) => (
                            <div key={idx} className="border-editorial bg-white p-5 shadow-editorial space-y-2">
                                <span className="text-xs font-serif-title uppercase font-bold text-gray-500 block">
                                    {item.skill}
                                </span>
                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-2xl font-mono font-bold ${item.color}`}>{item.current}</span>
                                        <span className="text-xs font-mono text-gray-400">/ {item.target}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Mục tiêu</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full bg-brand-cerulean"
                                        style={{ width: `${(parseFloat(item.current) / parseFloat(item.target)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Overall Target Milestone & Test Date */}
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-cerulean/20 pb-3">
                            <div className="space-y-1">
                                <span className="text-xs font-serif-title uppercase font-bold text-brand-jasper">
                                    Lộ Trình Cá Nhân Hóa (Personalized Pathway)
                                </span>
                                <h3 className="text-xl font-serif-title font-bold text-brand-cerulean">
                                    Mục Tiêu IELTS Overall {profile.targetBandOverall || '7.5'} • Ngày thi dự kiến: {profile.targetDate || profile.examDate || '2026-11-20'}
                                </h3>
                            </div>
                        </div>

                        {/* Pathway Milestones */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {milestones.map((m, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 border transition-all flex flex-col justify-between ${
                                        m.status === 'completed'
                                            ? 'bg-emerald-50/40 border-emerald-300'
                                            : m.status === 'in_progress'
                                                ? 'bg-blue-50/40 border-brand-cerulean shadow-xs'
                                                : 'bg-brand-cream/30 border-gray-200 opacity-70'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-serif-title font-bold uppercase px-2 py-0.5 border ${
                                                m.status === 'completed'
                                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                                    : m.status === 'in_progress'
                                                        ? 'bg-brand-cerulean text-white border-brand-cerulean'
                                                        : 'bg-gray-100 text-gray-600 border-gray-300'
                                            }`}>
                                                {m.status === 'completed' ? '✓ Đã Đạt' : m.status === 'in_progress' ? '⚡ Đang Thực Hiện' : '⏳ Sắp Tới'}
                                            </span>
                                            <span className="text-xs font-mono font-bold text-gray-500">Mốc {m.month}</span>
                                        </div>
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">{m.phase}</h4>
                                        <p className="text-xs font-newsreader text-gray-700 leading-relaxed">{m.focus}</p>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-gray-200 text-xs font-mono font-bold text-brand-jasper">
                                        Mục tiêu: {m.target}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: GAP ANALYSIS */}
            {activeTab === 'gap_analysis' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean flex items-center gap-2">
                                <AlertCircle size={22} className="text-brand-jasper" />
                                Phân Tích Lỗ Hổng & Điểm Nghẽn Năng Lực (Diagnostic Gap Analysis)
                            </h3>
                            <p className="text-xs font-newsreader text-gray-600 mt-1">
                                Thuật toán phân tích bóc tách các tiêu chí đang cản trở bạn bứt phá từ 6.5 lên 7.5+.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {weaknesses.map((w, idx) => (
                                <div key={idx} className="border border-brand-cerulean/25 bg-brand-cream/30 p-5 space-y-3">
                                    <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-2">
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                            {w.skill}: {w.aspect}
                                        </h4>
                                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${
                                            w.priority === 'High' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                                        }`}>
                                            Ưu tiên: {w.priority}
                                        </span>
                                    </div>

                                    <div className="text-xs font-newsreader space-y-2 text-gray-800 leading-relaxed">
                                        <div>
                                            <strong className="text-brand-jasper font-serif-title block">Nguyên nhân gốc rễ (Root Cause):</strong>
                                            {w.issue}
                                        </div>
                                        <div className="p-2.5 bg-white border border-brand-cerulean/15">
                                            <strong className="text-brand-cerulean font-serif-title block">Hành động khắc phục đề xuất:</strong>
                                            {w.remedy}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: DIAGNOSTIC PLACEMENT */}
            {activeTab === 'diagnostic' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-5">
                        <div className="border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                Bài Kiểm Tra Chẩn Đoán Trình Độ Ban Đầu (Diagnostic Placement)
                            </h3>
                            <p className="text-xs font-newsreader text-gray-600 mt-1">
                                Trắc nghiệm nhanh 5 câu hỏi tình huống để định vị mức độ am hiểu cấu trúc bài thi và năng lực ngôn ngữ.
                            </p>
                        </div>

                        {!diagnosticCompleted ? (
                            <div className="space-y-6 pt-2">
                                {IELTS_DIAGNOSTIC_ITEMS.map((item, qIdx) => (
                                    <div key={item.id} className="p-4 border border-brand-cerulean/20 bg-brand-cream/20 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-brand-cerulean text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                {qIdx + 1}
                                            </span>
                                            <p className="text-sm font-sans font-bold text-gray-900 leading-relaxed">
                                                {item.prompt}
                                            </p>
                                        </div>

                                        <div className="space-y-2 pl-7">
                                            {item.options.map((opt, oIdx) => (
                                                <label
                                                    key={oIdx}
                                                    className={`p-2.5 border text-xs font-sans flex items-center gap-2 cursor-pointer transition-all ${
                                                        diagnosticAnswers[item.id] === oIdx
                                                            ? 'border-brand-cerulean bg-blue-50/70 font-bold'
                                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`diag_${item.id}`}
                                                        checked={diagnosticAnswers[item.id] === oIdx}
                                                        onChange={() => handleDiagnosticSelect(item.id, oIdx)}
                                                        className="text-brand-cerulean"
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={handleFinishDiagnostic}
                                        className="px-6 py-2.5 bg-brand-jasper text-white text-xs font-serif-title font-bold hover:bg-red-800 shadow-editorial"
                                    >
                                        Hoàn Thành Bài Chẩn Đoán & Định Vị Band
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-emerald-50/50 border border-emerald-300 space-y-3 text-center animate-fade-in">
                                <span className="text-xs font-serif-title uppercase font-bold text-emerald-900 block">
                                    Kết Quả Định Vị Ban Đầu:
                                </span>
                                <h4 className="text-3xl font-mono font-bold text-brand-jasper">
                                    Band {diagnosticResult.band}
                                </h4>
                                <p className="text-xs font-newsreader text-gray-700">
                                    Bạn đã trả lời chính xác {diagnosticResult.score} / {diagnosticResult.total} câu hỏi chẩn đoán chuyên sâu.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setDiagnosticCompleted(false)}
                                    className="mt-2 px-4 py-1.5 border border-emerald-400 bg-white text-emerald-900 text-xs font-serif-title font-bold"
                                >
                                    Làm Lại Bài Chẩn Đoán
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 4: PRACTICE HISTORY */}
            {activeTab === 'history' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                Nhật Ký Luyện Tập & Bài Làm Đã Lưu
                            </h3>
                            <p className="text-xs font-newsreader text-gray-600 mt-1">
                                Danh sách các bài Writing, Speaking và Drills đã hoàn thành trên hệ thống.
                            </p>
                        </div>

                        {/* Drills History */}
                        <div className="space-y-2 pt-2">
                            <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean block">
                                1. Lịch Sử Drills Đã Hoàn Thành ({drillHistory.length}):
                            </span>
                            {drillHistory.length === 0 ? (
                                <p className="text-xs font-newsreader text-gray-500 italic p-3 bg-brand-cream/30 border border-brand-cerulean/15">
                                    Chưa có bài drill nào được ghi nhận. Hãy vào mục "Kho Drills" để luyện tập ngay!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {drillHistory.map((d, i) => (
                                        <div key={i} className="p-3 bg-brand-cream/40 border border-brand-cerulean/15 flex items-center justify-between text-xs font-sans">
                                            <div className="space-y-0.5">
                                                <span className="font-bold text-gray-800 block">{d.drillTitle}</span>
                                                <span className="text-[11px] text-gray-500 font-mono">{new Date(d.date).toLocaleString('vi-VN')}</span>
                                            </div>
                                            <span className="font-mono font-bold text-brand-jasper">
                                                {d.score} / {d.total} câu ({Math.round((d.score / d.total) * 100)}%)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Writing Submissions History */}
                        <div className="space-y-2 pt-4 border-t border-brand-cerulean/15">
                            <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean block">
                                2. Lịch Sử Bài Viết Writing Lab ({writingSubmissions.length}):
                            </span>
                            {writingSubmissions.length === 0 ? (
                                <p className="text-xs font-newsreader text-gray-500 italic p-3 bg-brand-cream/30 border border-brand-cerulean/15">
                                    Chưa có bài viết nào được lưu. Hãy vào "Phòng Writing Lab" để thực hành viết!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {writingSubmissions.map((w, i) => (
                                        <div key={i} className="p-3 bg-brand-cream/40 border border-brand-cerulean/15 flex items-center justify-between text-xs font-sans">
                                            <div className="space-y-0.5">
                                                <span className="font-bold text-gray-800 block">{w.taskType}: {w.prompt?.slice(0, 50)}...</span>
                                                <span className="text-[11px] text-gray-500 font-mono">{w.wordCount} từ • {new Date(w.date).toLocaleString('vi-VN')}</span>
                                            </div>
                                            <span className="font-mono font-bold text-brand-jasper">
                                                Band {w.selfAssessment?.overall || '7.0'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
