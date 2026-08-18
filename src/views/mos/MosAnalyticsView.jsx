import React from 'react';
import {
    TrendingUp,
    Award,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Zap,
    Table,
    BookOpen,
    ShieldCheck,
    Presentation,
    Flame,
    ArrowUpRight,
    HelpCircle,
    Play
} from 'lucide-react';
import { MOS_BADGES, MOS_HEATMAP_TABS, DEFAULT_MOS_PROFILE } from '../../data/mosIc3Data';

export const MosAnalyticsView = ({ profile = DEFAULT_MOS_PROFILE, navigate }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Standard Pedagogy Sticky Header */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Chẩn Đoán Năng Lực & Huy Hiệu MOS</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Bản đồ nhiệt lỗi sai Ribbon Tab, đánh giá tốc độ thao tác và bảng vinh danh.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => { if (navigate) navigate('mos_sandbox'); }}
                        className="px-5 py-2.5 bg-brand-jasper text-brand-cream font-serif-title hover:bg-red-800 transition-colors shadow-editorial flex items-center gap-2"
                    >
                        <Play size={16} /> Luyện Đề Bù Lỗ Hổng
                    </button>
                </div>
            </div>

            {/* KPI Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 border-editorial shadow-editorial text-center space-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-jasper"></div>
                    <span className="text-xs font-serif-title font-bold text-gray-500 uppercase">Sẵn sàng thi thật</span>
                    <div className="text-4xl font-serif-title font-black text-brand-jasper">{profile.overallExamReadiness}%</div>
                    <span className="text-[11px] text-emerald-800 font-bold font-body flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> Đạt chuẩn Certiport
                    </span>
                </div>

                <div className="bg-white p-5 border-editorial shadow-editorial text-center space-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-cerulean"></div>
                    <span className="text-xs font-serif-title font-bold text-gray-500 uppercase">Tốc độ thao tác</span>
                    <div className="text-4xl font-serif-title font-black text-brand-cerulean">{profile.averageTaskSpeedSeconds}s</div>
                    <span className="text-[11px] text-gray-600 font-body">Mục tiêu: &lt; 45s/task</span>
                </div>

                <div className="bg-white p-5 border-editorial shadow-editorial text-center space-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
                    <span className="text-xs font-serif-title font-bold text-gray-500 uppercase">Dự án hoàn thành</span>
                    <div className="text-4xl font-serif-title font-black text-emerald-800">{profile.totalProjectsCompleted}</div>
                    <span className="text-[11px] text-gray-600 font-body">Tổng số 12 Multi-Projects</span>
                </div>

                <div className="bg-white p-5 border-editorial shadow-editorial text-center space-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                    <span className="text-xs font-serif-title font-bold text-gray-500 uppercase">Huy hiệu danh hiệu</span>
                    <div className="text-4xl font-serif-title font-black text-amber-600">{profile.badgesUnlocked.length}</div>
                    <span className="text-[11px] text-gray-600 font-body">Tổng 6 huy hiệu</span>
                </div>
            </div>

            {/* SECTION 1: ERROR HEATMAP ACROSS RIBBON TABS */}
            <div className="bg-white p-6 border-editorial shadow-editorial space-y-5 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-cerulean"></div>
                <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-3">
                    <div>
                        <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">
                            Bản Đồ Nhiệt Lỗi Sai (Error Heatmap theo Ribbon Tab)
                        </h3>
                        <p className="text-xs text-gray-600 font-body mt-0.5">
                            Phân tích tỷ lệ chính xác của từng nhóm công cụ trên thanh Ribbon để tối ưu thời gian ôn luyện
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOS_HEATMAP_TABS.map(tab => {
                        const isGood = tab.accuracy >= 85;
                        const isWarning = tab.accuracy >= 75 && tab.accuracy < 85;
                        const isDanger = tab.accuracy < 75;

                        return (
                            <div
                                key={tab.id}
                                className={`p-4 border rounded space-y-2.5 transition-all ${
                                    isGood
                                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                                        : isWarning
                                            ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                                            : 'bg-red-50/70 border-red-300 text-red-950'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold font-serif-title text-xs text-gray-900">{tab.name}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                        isGood ? 'bg-emerald-200 text-emerald-900' : isWarning ? 'bg-amber-200 text-amber-900' : 'bg-red-200 text-red-900'
                                    }`}>
                                        {tab.accuracy}%
                                    </span>
                                </div>

                                <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full ${
                                            isGood ? 'bg-emerald-600' : isWarning ? 'bg-amber-500' : 'bg-red-600'
                                        }`}
                                        style={{ width: `${tab.accuracy}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center text-[11px] font-body">
                                    <span className="text-gray-600">Đã làm: {tab.totalQuestions} tasks</span>
                                    <span className="font-bold">
                                        {isDanger ? '⚠️ Cần luyện thêm' : isWarning ? 'Cần duy trì' : '✓ Vững vàng'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: TIME-EFFICIENCY METRICS */}
            <div className="bg-white p-6 border-editorial shadow-editorial space-y-4 font-body relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-jasper"></div>
                <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">
                    Đánh Giá Tốc Độ Thao Tác (Time-Efficiency Benchmark)
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Trong bài thi Certiport MOS, mỗi dự án gồm 5-7 Tasks phải hoàn thành trong 50 phút (trung bình tối đa 45-50 giây/task).
                </p>

                <div className="p-4 bg-brand-cream/70 border border-brand-cerulean/20 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Tốc độ hiện tại của bạn: <strong className="text-brand-jasper text-base font-mono">{profile.averageTaskSpeedSeconds}s / Task</strong></span>
                        <span className="text-emerald-800 font-bold font-serif-title">⚡ Nhanh hơn 15% so với chuẩn yêu cầu</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600 text-[11px] font-mono">
                            <span>Siêu tốc (&lt; 30s)</span>
                            <span>Chuẩn Certiport (45s)</span>
                            <span>Nguy cơ trễ hạn (&gt; 60s)</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 bg-emerald-500 w-1/3"></div>
                            <div className="absolute left-1/3 top-0 bottom-0 bg-amber-400 w-1/3"></div>
                            <div className="absolute left-2/3 top-0 bottom-0 bg-red-400 w-1/3"></div>
                            {/* Pin Indicator */}
                            <div
                                style={{ left: `${(profile.averageTaskSpeedSeconds / 90) * 100}%` }}
                                className="absolute top-0 bottom-0 w-2 bg-black border-2 border-white shadow -translate-x-1"
                                title={`Tốc độ của bạn: ${profile.averageTaskSpeedSeconds}s`}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: GAMIFICATION BADGES TROPHY CABINET */}
            <div className="bg-white p-6 border-editorial shadow-editorial space-y-5 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-cerulean"></div>
                <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-3">
                    <div>
                        <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <Award size={22} className="text-amber-500" /> Bảng Vinh Danh Huy Hiệu (Gamification Badges)
                        </h3>
                        <p className="text-xs text-gray-600 font-body mt-0.5">Chứng nhận điện tử kỹ năng chuyên sâu được cấp phát tự động</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOS_BADGES.map(b => (
                        <div
                            key={b.id}
                            className={`p-4 border rounded flex items-start gap-3.5 transition-all ${
                                b.unlocked
                                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                                    : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${
                                b.unlocked ? 'bg-amber-400 text-gray-900 border-amber-500 shadow-sm' : 'bg-gray-200 text-gray-400 border-gray-300'
                            }`}>
                                <Award size={22} />
                            </div>

                            <div className="space-y-1 font-body">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-serif-title font-bold text-sm text-brand-cerulean">{b.name}</h4>
                                    {b.unlocked && (
                                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                                            Đã đạt
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 leading-snug">{b.description}</p>
                                {b.unlocked && (
                                    <span className="text-[10px] text-gray-500 font-mono block pt-0.5">
                                        Mở khóa: {b.unlockedDate}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
