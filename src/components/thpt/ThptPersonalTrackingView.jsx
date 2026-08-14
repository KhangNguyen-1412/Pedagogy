import React, { useState, useMemo } from 'react';
import {
    TrendingUp, Award, Plus, BookOpen, Calendar,
    CheckCircle2, Clock, Trash2, ArrowUpRight, Target, Sparkles, BarChart2, FileText, Check
} from 'lucide-react';
import { ThptPersonalTestModal } from './ThptPersonalTestModal';
import { EditorialSelect } from './EditorialSelect';

export const ThptPersonalTrackingView = ({
    profile,
    exams = [],
    results = [],
    subjects = [],
    onSaveResult,
    onDeleteResult,
    showToast
}) => {
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

    // Filter results by selected subject
    const filteredResults = useMemo(() => {
        return results.filter(res => {
            if (selectedSubjectFilter !== 'all') {
                const exam = exams.find(e => e.id === res.examId);
                if (!exam || exam.subjectId !== selectedSubjectFilter) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    }, [results, selectedSubjectFilter, exams]);

    // Reverse sorted for table view (latest first)
    const tableResults = useMemo(() => {
        return [...filteredResults].sort((a, b) => new Date(b.testDate) - new Date(a.testDate));
    }, [filteredResults]);

    // Computed Stats
    const totalTests = filteredResults.length;
    const avgScore = totalTests > 0
        ? (filteredResults.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / totalTests).toFixed(1)
        : '0.0';
    const highestScore = totalTests > 0
        ? Math.max(...filteredResults.map(r => Number(r.score) || 0)).toFixed(1)
        : '0.0';
    const latestScore = totalTests > 0
        ? (Number(filteredResults[filteredResults.length - 1].score) || 0).toFixed(1)
        : '0.0';
    const firstScore = totalTests > 0
        ? (Number(filteredResults[0].score) || 0).toFixed(1)
        : '0.0';
    const progressDiff = totalTests >= 2
        ? (Number(latestScore) - Number(firstScore)).toFixed(1)
        : 0;

    // Target score for the selected subject or overall
    const currentSubjectTarget = useMemo(() => {
        if (selectedSubjectFilter !== 'all') {
            const st = (profile?.subjectTargets || []).find(t => t.subjectId === selectedSubjectFilter);
            return st ? Number(st.target) : 9.0;
        }
        return 9.0;
    }, [selectedSubjectFilter, profile]);

    // SVG Chart Dimensions
    const chartWidth = 700;
    const chartHeight = 230;
    const padding = { top: 25, right: 30, bottom: 35, left: 40 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    // Chart coordinate points
    const chartPoints = useMemo(() => {
        if (filteredResults.length === 0) return [];
        if (filteredResults.length === 1) {
            const score = Number(filteredResults[0].score) || 0;
            const y = padding.top + innerHeight - (score / 10) * innerHeight;
            return [{
                x: padding.left + innerWidth / 2,
                y,
                score,
                date: filteredResults[0].testDate,
                examId: filteredResults[0].examId
            }];
        }
        return filteredResults.map((r, index) => {
            const score = Number(r.score) || 0;
            const x = padding.left + (index / (filteredResults.length - 1)) * innerWidth;
            const y = padding.top + innerHeight - (score / 10) * innerHeight;
            return {
                x,
                y,
                score,
                date: r.testDate,
                examId: r.examId
            };
        });
    }, [filteredResults, innerWidth, innerHeight]);

    const linePathD = useMemo(() => {
        if (chartPoints.length === 0) return '';
        return chartPoints.reduce((acc, pt, idx) => {
            return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
        }, '');
    }, [chartPoints]);

    const areaPathD = useMemo(() => {
        if (chartPoints.length === 0) return '';
        const firstPt = chartPoints[0];
        const lastPt = chartPoints[chartPoints.length - 1];
        const bottomY = padding.top + innerHeight;
        return `${linePathD} L ${lastPt.x} ${bottomY} L ${firstPt.x} ${bottomY} Z`;
    }, [chartPoints, linePathD, innerHeight]);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-brand-cerulean/20 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-brand-jasper font-bold mb-1">
                        <TrendingUp size={14} /> Nhật ký Giải đề & Phân tích Điểm số
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean tracking-tight">
                        Tiến độ & Kết quả Luyện đề của Tôi
                    </h1>
                    <p className="text-sm italic text-gray-600 font-body mt-1">
                        Theo dõi biểu đồ tăng trưởng điểm số, nhật ký rút kinh nghiệm và khoảng cách tới mục tiêu Đại học
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsEntryModalOpen(true)}
                        className="px-5 py-2.5 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-editorial transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Ghi nhận Kết quả Làm Đề
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-80">
                    <label className="text-xs font-serif-title text-brand-cerulean shrink-0 font-bold flex items-center gap-1.5">
                        <BookOpen size={14} /> Lọc môn học:
                    </label>
                    <EditorialSelect
                        value={selectedSubjectFilter}
                        onChange={setSelectedSubjectFilter}
                        options={[
                            { value: 'all', label: `Tất cả môn học (${subjects.length})` },
                            ...subjects.map(s => ({
                                value: s.id,
                                label: s.name
                            }))
                        ]}
                        size="sm"
                        className="flex-1"
                    />
                </div>

                <div className="text-xs text-gray-500 font-serif">
                    Mục tiêu: <strong className="text-brand-cerulean">{profile?.targetUniversity || 'Đại học Mục tiêu'}</strong> ({profile?.targetTotalScore || 27.5} đ)
                </div>
            </div>

            {/* KPIs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Điểm trung bình của tôi</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1">
                        {totalTests > 0 ? `${avgScore} đ` : '---'}
                    </p>
                    <span className="text-[11px] text-gray-400 font-body">Qua {totalTests} lần làm đề</span>
                </div>

                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Kỷ lục điểm cao nhất</span>
                    <p className="text-2xl font-serif-title font-bold text-emerald-700 mt-1">
                        {totalTests > 0 ? `${highestScore} đ` : '---'}
                    </p>
                    <span className="text-[11px] text-emerald-600 font-body font-bold">Thành tích cao nhất</span>
                </div>

                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Điểm đề gần nhất</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-jasper mt-1">
                        {totalTests > 0 ? `${latestScore} đ` : '---'}
                    </p>
                    <span className="text-[11px] text-gray-400 font-body">
                        {totalTests > 0 ? filteredResults[filteredResults.length - 1].testDate : 'Chưa có'}
                    </span>
                </div>

                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Xu hướng tiến bộ</span>
                    <p className="text-2xl font-serif-title font-bold text-indigo-700 mt-1 flex items-center gap-1">
                        {totalTests > 1 ? (
                            <>
                                {Number(progressDiff) >= 0 ? `+${progressDiff}` : progressDiff} đ
                                <ArrowUpRight size={18} className={Number(progressDiff) >= 0 ? 'text-emerald-600' : 'text-red-500'} />
                            </>
                        ) : 'Ổn định'}
                    </p>
                    <span className="text-[11px] text-gray-400 font-body">So với đề đầu tiên</span>
                </div>
            </div>

            {/* Performance Progress Chart Box */}
            <div className="bg-white p-6 border border-brand-cerulean/20 shadow-editorial space-y-4">
                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-brand-cerulean/15 gap-2">
                    <div>
                        <h3 className="font-serif-title font-bold text-lg text-brand-cerulean flex items-center gap-2">
                            <BarChart2 size={18} className="text-brand-jasper" />
                            Biểu đồ Điểm số theo Thời gian
                        </h3>
                        <p className="text-xs text-gray-500 font-body mt-0.5">
                            Trực quan hóa sự tiến bộ qua các lần giải đề thi thử
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-serif font-bold text-brand-jasper px-3 py-1 bg-brand-jasper/10 rounded flex items-center gap-1.5">
                            <Target size={13} /> Mốc mục tiêu: {currentSubjectTarget}đ
                        </span>
                    </div>
                </div>

                {filteredResults.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 space-y-2">
                        <Award size={36} className="mx-auto text-gray-300" />
                        <p className="font-serif-title text-sm text-gray-500">Chưa có bài thi nào được ghi nhận</p>
                        <p className="text-xs">Hãy nhấn nút "Ghi nhận Kết quả Làm Đề" phía trên để lưu kết quả bài thi đầu tiên của bạn.</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto py-2">
                        <svg
                            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                            className="w-full h-56 max-w-full font-sans select-none"
                        >
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#124874" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#124874" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Y-Axis Grid Lines & Labels */}
                            {[0, 2.5, 5.0, 7.5, 10.0].map((scoreTick) => {
                                const y = padding.top + innerHeight - (scoreTick / 10) * innerHeight;
                                return (
                                    <g key={scoreTick}>
                                        <line
                                            x1={padding.left}
                                            y1={y}
                                            x2={chartWidth - padding.right}
                                            y2={y}
                                            stroke="#E5E7EB"
                                            strokeDasharray="4 4"
                                        />
                                        <text
                                            x={padding.left - 8}
                                            y={y + 4}
                                            textAnchor="end"
                                            className="text-[10px] fill-gray-400 font-mono"
                                        >
                                            {scoreTick}đ
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Target Highlight Line */}
                            <line
                                x1={padding.left}
                                y1={padding.top + innerHeight - (currentSubjectTarget / 10) * innerHeight}
                                x2={chartWidth - padding.right}
                                y2={padding.top + innerHeight - (currentSubjectTarget / 10) * innerHeight}
                                stroke="#CF373D"
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                                opacity="0.7"
                            />
                            <text
                                x={chartWidth - padding.right}
                                y={padding.top + innerHeight - (currentSubjectTarget / 10) * innerHeight - 4}
                                textAnchor="end"
                                className="text-[9px] fill-brand-jasper font-bold"
                            >
                                Mốc mục tiêu ({currentSubjectTarget}đ)
                            </text>

                            {/* Area Fill */}
                            {areaPathD && (
                                <path d={areaPathD} fill="url(#scoreGradient)" />
                            )}

                            {/* Main Line */}
                            {linePathD && (
                                <path
                                    d={linePathD}
                                    fill="none"
                                    stroke="#124874"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}

                            {/* Data Points & Score Badges */}
                            {chartPoints.map((pt, idx) => {
                                return (
                                    <g key={idx} className="group cursor-pointer">
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r="5"
                                            fill="#FFFFFF"
                                            stroke="#124874"
                                            strokeWidth="2.5"
                                            className="hover:r-7 transition-all"
                                        />
                                        <rect
                                            x={pt.x - 14}
                                            y={pt.y - 20}
                                            width="28"
                                            height="15"
                                            rx="3"
                                            fill="#124874"
                                        />
                                        <text
                                            x={pt.x}
                                            y={pt.y - 9}
                                            textAnchor="middle"
                                            className="text-[9px] font-bold fill-white font-mono"
                                        >
                                            {pt.score.toFixed(1)}
                                        </text>
                                        <text
                                            x={pt.x}
                                            y={padding.top + innerHeight + 18}
                                            textAnchor="middle"
                                            className="text-[10px] fill-gray-500 font-mono"
                                        >
                                            {pt.date.slice(5)}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}
            </div>

            {/* Test History Table */}
            <div className="bg-white border border-brand-cerulean/20 shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/15">
                    <h3 className="font-serif-title font-bold text-lg text-brand-cerulean flex items-center gap-2">
                        <FileText size={18} className="text-brand-jasper" />
                        Nhật ký Chi tiết các Lần Làm Đề ({tableResults.length})
                    </h3>
                </div>

                {tableResults.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs font-serif">
                        Chưa có lịch sử làm đề nào phù hợp với bộ lọc.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-brand-cerulean/20 font-serif-title text-brand-cerulean bg-brand-cerulean/5">
                                    <th className="py-3 px-4">Ngày làm</th>
                                    <th className="py-3 px-4">Tên đề thi</th>
                                    <th className="py-3 px-4">Môn thi</th>
                                    <th className="py-3 px-4 text-center">Thời gian</th>
                                    <th className="py-3 px-4 text-center">Số câu đúng</th>
                                    <th className="py-3 px-4 text-center">Điểm số</th>
                                    <th className="py-3 px-4">Ghi chú rút kinh nghiệm của tôi</th>
                                    <th className="py-3 px-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-body">
                                {tableResults.map(res => {
                                    const exam = exams.find(e => e.id === res.examId) || { title: 'Đề thi đã xóa', code: 'N/A' };
                                    const subj = subjects.find(s => s.id === exam.subjectId) || { name: 'Môn thi', color: '#124874' };

                                    return (
                                        <tr key={res.id} className="hover:bg-brand-cream/60 transition-colors">
                                            <td className="py-3 px-4 font-mono text-gray-600 whitespace-nowrap">
                                                {res.testDate}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-serif-title font-bold text-brand-cerulean block">
                                                    {exam.title}
                                                </span>
                                                <span className="text-[10px] font-mono text-gray-400">
                                                    Mã đề: {exam.code || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className="text-[10px] font-mono px-2 py-0.5 text-white rounded font-bold"
                                                    style={{ backgroundColor: subj.color }}
                                                >
                                                    {subj.name}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center font-mono">
                                                {res.timeSpent || 90}p
                                            </td>
                                            <td className="py-3 px-4 text-center font-mono">
                                                {res.correctCount || 0} / {res.totalQuestions || 50}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="font-serif-title text-base font-bold text-brand-jasper">
                                                    {Number(res.score).toFixed(1)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 italic max-w-xs">
                                                {res.selfNotes || res.teacherFeedback || '---'}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('Bạn có chắc muốn xóa kết quả bài thi này?')) {
                                                            onDeleteResult(res.id);
                                                            showToast?.('Đã xóa kết quả');
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Xóa bài làm này"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Test Entry Modal */}
            <ThptPersonalTestModal
                isOpen={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                exams={exams}
                subjects={subjects}
                onSaveResult={onSaveResult}
                showToast={showToast}
            />
        </div>
    );
};

export default ThptPersonalTrackingView;
