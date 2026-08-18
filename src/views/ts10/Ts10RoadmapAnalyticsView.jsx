import React from 'react';
import {
    TrendingUp,
    Calendar,
    Target,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ArrowRight,
    Award,
    Sparkles,
    BarChart3,
    Compass,
    Check
} from 'lucide-react';
import { TS10_ROADMAP_PHASES, DEFAULT_TS10_PROFILE } from '../../data/ts10Data';
import { MathText } from '../../components/common/MathText';

export const Ts10RoadmapAnalyticsView = ({ profile: userProfile }) => {
    const profile = {
        ...DEFAULT_TS10_PROFILE,
        ...(userProfile || {}),
        targetScores: {
            ...DEFAULT_TS10_PROFILE.targetScores,
            ...(userProfile?.targetScores || {})
        }
    };

    // Simulated mock test score progression over 4 recent test dates
    const scoreHistory = [
        { date: 'T11/2025', math: 7.5, lit: 7.0, eng: 8.0 },
        { date: 'T12/2025', math: 8.0, lit: 7.5, eng: 8.5 },
        { date: 'T01/2026', math: 8.5, lit: 8.0, eng: 9.0 },
        { date: 'T02/2026 (Mới nhất)', math: 8.75, lit: 8.25, eng: 9.25 }
    ];

    const currentScore = scoreHistory[scoreHistory.length - 1];

    // Gap analysis insights
    const gapInsights = [
        {
            subject: 'Toán học',
            issue: 'Mất 0.5đ ở câu Hình học ý c (Chứng minh 3 điểm thẳng hàng) và thỉnh thoảng quên kiểm tra Delta ở phương trình Vi-ét.',
            recommendation: 'Luyện thêm 10 bài chuyên đề Tứ giác nội tiếp và ôn lại quy tắc Delta Vi-ét.',
            urgency: 'Cao'
        },
        {
            subject: 'Ngữ Văn',
            issue: 'Dẫn chứng trong đoạn văn 200 chữ đôi khi chưa bám sát vấn đề thời sự thực tế.',
            recommendation: 'Bổ sung các dẫn chứng mới từ Kho Dẫn Chứng Thời Sự 2024-2025.',
            urgency: 'Trung bình'
        },
        {
            subject: 'Tiếng Anh',
            issue: 'Dễ nhầm lẫn câu điều kiện hỗn hợp và quy tắc trọng âm từ có 3 âm tiết kết thúc bằng -ic, -tion.',
            recommendation: 'Làm lại các bài trắc nghiệm Error Analysis phần Trọng âm.',
            urgency: 'Thấp'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Lộ Trình & Phong Độ Vào 10</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Lộ trình 3 giai đoạn, theo dõi biến thiên điểm thi thử & phân tích lỗ hổng kiến thức.</p>
                </div>
            </div>

            {/* Target Card & Quick Stats - Editorial Style */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border-editorial bg-white p-5 shadow-editorial space-y-1">
                    <span className="text-[11px] font-serif-title uppercase font-bold text-gray-500 block">Mục Tiêu Trường:</span>
                    <strong className="text-sm font-serif-title font-bold text-brand-cerulean block line-clamp-1">
                        {profile.targetSchool}
                    </strong>
                    <span className="text-xs font-newsreader text-brand-jasper font-bold">
                        {profile.targetProvince}
                    </span>
                </div>

                <div className="border-editorial bg-white p-5 shadow-editorial space-y-1">
                    <span className="text-[11px] font-serif-title uppercase font-bold text-gray-500 block">Toán Hiện Tại / Mục Tiêu:</span>
                    <div className="flex items-baseline gap-2">
                        <strong className="text-2xl font-mono font-bold text-brand-cerulean">{currentScore.math}</strong>
                        <span className="text-xs font-mono text-gray-500">/ {profile.targetScores.math}đ</span>
                    </div>
                </div>

                <div className="border-editorial bg-white p-5 shadow-editorial space-y-1">
                    <span className="text-[11px] font-serif-title uppercase font-bold text-gray-500 block">Văn Hiện Tại / Mục Tiêu:</span>
                    <div className="flex items-baseline gap-2">
                        <strong className="text-2xl font-mono font-bold text-brand-cerulean">{currentScore.lit}</strong>
                        <span className="text-xs font-mono text-gray-500">/ {profile.targetScores.literature}đ</span>
                    </div>
                </div>

                <div className="border-editorial bg-white p-5 shadow-editorial space-y-1">
                    <span className="text-[11px] font-serif-title uppercase font-bold text-gray-500 block">Anh Hiện Tại / Mục Tiêu:</span>
                    <div className="flex items-baseline gap-2">
                        <strong className="text-2xl font-mono font-bold text-brand-cerulean">{currentScore.eng}</strong>
                        <span className="text-xs font-mono text-gray-500">/ {profile.targetScores.english}đ</span>
                    </div>
                </div>
            </div>

            {/* 3-Phase Pathway Tracker - Editorial Box */}
            <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                <div className="border-b border-brand-cerulean/20 pb-3">
                    <h3 className="text-xl font-serif-title font-bold text-brand-cerulean flex items-center gap-2">
                        <Calendar size={20} className="text-brand-jasper" />
                        Lộ Trình 3 Giai Đoạn Vàng Tuyển Sinh 10 (Pathway)
                    </h3>
                    <p className="text-xs font-newsreader text-gray-600 mt-1">
                        Phân bổ thời gian khoa học từ Lấy gốc SGK đến Tổng ôn chuyên đề và Khóa điểm rơi thực chiến.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {TS10_ROADMAP_PHASES.map((phase) => {
                        const isCurrent = profile.currentPhase === phase.id;
                        const isDone = phase.id === 'phase1' && profile.currentPhase !== 'phase1';

                        return (
                            <div
                                key={phase.id}
                                className={`p-5 border transition-all flex flex-col justify-between space-y-4 ${
                                    isCurrent
                                        ? 'bg-blue-50/40 border-brand-jasper shadow-editorial ring-1 ring-brand-jasper'
                                        : isDone
                                            ? 'bg-emerald-50/30 border-emerald-300'
                                            : 'bg-brand-cream/30 border-gray-200 opacity-80'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-serif-title font-bold uppercase px-2 py-0.5 border ${
                                            isDone 
                                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                                                : isCurrent 
                                                    ? 'bg-brand-jasper text-white border-brand-jasper' 
                                                    : 'bg-gray-100 text-gray-600 border-gray-300'
                                        }`}>
                                            {isDone ? '✓ Đã Hoàn Thành' : isCurrent ? '⚡ Đang Thực Hiện' : '⏳ Sắp Tới'}
                                        </span>
                                        <span className="text-xs font-mono text-gray-500 font-bold">
                                            {phase.timeframe}
                                        </span>
                                    </div>

                                    <h4 className="font-serif-title font-bold text-brand-cerulean text-base">
                                        {phase.title}
                                    </h4>

                                    <p className="text-xs font-newsreader text-gray-700 leading-relaxed">
                                        {phase.objective}
                                    </p>

                                    <div className="space-y-1.5 pt-2 border-t border-gray-200">
                                        <span className="text-[11px] font-serif-title uppercase font-bold text-gray-600 block">
                                            Mốc Trọng Tâm:
                                        </span>
                                        {phase.keyMilestones.map((m, mIdx) => (
                                            <div key={mIdx} className="text-xs font-newsreader text-gray-800 flex items-start gap-1.5">
                                                <span className="text-brand-jasper font-bold">•</span>
                                                <span><MathText text={m} /></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-[11px] font-mono font-bold text-brand-jasper pt-2 border-t border-gray-200">
                                    Khoảng điểm kỳ vọng: {phase.targetScoreRange}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Score Progression & Gap Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Score Progression Chart Table (6 Cols) */}
                <div className="lg:col-span-6 border-editorial bg-white p-6 shadow-editorial space-y-4">
                    <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-2">
                        <h3 className="font-serif-title font-bold text-brand-cerulean text-lg flex items-center gap-2">
                            <BarChart3 size={18} className="text-brand-jasper" />
                            Biến Thiên Điểm Thi Thử 3 Môn
                        </h3>
                    </div>

                    {/* Table View of Score Evolution */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs font-sans border-collapse">
                            <thead>
                                <tr className="border-b-2 border-brand-cerulean bg-brand-cream text-brand-cerulean font-serif-title uppercase font-bold">
                                    <th className="py-2.5 px-3 text-left">Đợt Thi</th>
                                    <th className="py-2.5 px-2 text-center">Toán</th>
                                    <th className="py-2.5 px-2 text-center">Văn</th>
                                    <th className="py-2.5 px-2 text-center">Anh</th>
                                    <th className="py-2.5 px-2 text-center">Tổng Điểm</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 font-mono">
                                {scoreHistory.map((s, idx) => {
                                    const total = s.math + s.lit + s.eng;
                                    const isLatest = idx === scoreHistory.length - 1;
                                    return (
                                        <tr key={idx} className={isLatest ? 'bg-blue-50/50 font-bold' : 'hover:bg-gray-50'}>
                                            <td className="py-2.5 px-3 font-sans text-gray-800">{s.date}</td>
                                            <td className="py-2.5 px-2 text-center text-blue-900">{s.math}</td>
                                            <td className="py-2.5 px-2 text-center text-emerald-900">{s.lit}</td>
                                            <td className="py-2.5 px-2 text-center text-purple-900">{s.eng}</td>
                                            <td className="py-2.5 px-2 text-center text-brand-jasper font-bold">{total.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Gap Analysis & Actionable Insights (6 Cols) */}
                <div className="lg:col-span-6 border-editorial bg-white p-6 shadow-editorial space-y-4">
                    <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-2">
                        <h3 className="font-serif-title font-bold text-brand-jasper text-lg flex items-center gap-2">
                            <AlertTriangle size={18} />
                            Phân Tích Lỗ Hổng Kiến Thức (Gap Analysis)
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {gapInsights.map((gap, gIdx) => (
                            <div
                                key={gIdx}
                                className="p-3.5 border border-brand-cerulean/20 bg-brand-cream/30 space-y-1.5 text-xs font-newsreader"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-serif-title font-bold text-brand-cerulean uppercase">
                                        Môn {gap.subject}
                                    </span>
                                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${
                                        gap.urgency === 'Cao' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}>
                                        Cấp bách: {gap.urgency}
                                    </span>
                                </div>
                                <p className="text-gray-800">
                                    <strong>Vấn đề:</strong> {gap.issue}
                                </p>
                                <p className="text-brand-jasper italic pt-1 border-t border-gray-200">
                                    <strong>Đề xuất khắc phục:</strong> {gap.recommendation}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
