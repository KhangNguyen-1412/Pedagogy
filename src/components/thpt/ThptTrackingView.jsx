import React, { useState, useMemo } from 'react';
import {
    TrendingUp, Award, Plus, Filter, User, BookOpen, Calendar,
    CheckCircle2, Clock, Trash2, ArrowUpRight, Target, Sparkles, BarChart2, FileText
} from 'lucide-react';
import { ThptTestEntryModal } from './ThptTestEntryModal';
import { EditorialSelect } from './EditorialSelect';

export const ThptTrackingView = ({
    students = [],
    exams = [],
    results = [],
    subjects = [],
    onSaveResult,
    onDeleteResult,
    initialStudentId = null,
    showToast
}) => {
    const [selectedStudentFilter, setSelectedStudentFilter] = useState(initialStudentId || 'all');
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

    // Active student profile if selected
    const activeStudent = students.find(s => s.id === selectedStudentFilter);

    // Filter results
    const filteredResults = useMemo(() => {
        return results.filter(res => {
            if (selectedStudentFilter !== 'all' && res.studentId !== selectedStudentFilter) {
                return false;
            }
            if (selectedSubjectFilter !== 'all') {
                const exam = exams.find(e => e.id === res.examId);
                if (!exam || exam.subjectId !== selectedSubjectFilter) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    }, [results, selectedStudentFilter, selectedSubjectFilter, exams]);

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

    // SVG Chart Dimensions
    const chartWidth = 700;
    const chartHeight = 220;
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
                        <TrendingUp size={14} /> Hệ thống Tracking & Điểm số
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean tracking-tight">
                        Theo dõi Tiến độ & Kết quả Thi
                    </h1>
                    <p className="text-sm italic text-gray-600 font-body mt-1">
                        Phân tích biểu đồ tiến bộ điểm số từng học viên theo môn học qua các lần giải đề thi thử
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsEntryModalOpen(true)}
                        className="px-5 py-2.5 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-editorial transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Nhập kết quả / Chấm bài
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1 flex items-center gap-1.5">
                        <User size={14} /> Chọn Học viên cần theo dõi:
                    </label>
                    <EditorialSelect
                        value={selectedStudentFilter}
                        onChange={setSelectedStudentFilter}
                        options={[
                            { value: 'all', label: `Tất cả học viên (${students.length})` },
                            ...students.map(s => ({
                                value: s.id,
                                label: `${s.fullName} (${s.studentCode || 'HS'}) - Lớp ${s.grade || '12'}`
                            }))
                        ]}
                    />
                </div>

                <div>
                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1 flex items-center gap-1.5">
                        <BookOpen size={14} /> Lọc theo Môn học:
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
                    />
                </div>
            </div>

            {/* KPIs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Điểm trung bình</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1">
                        {totalTests > 0 ? `${avgScore} đ` : '---'}
                    </p>
                    <span className="text-[11px] text-gray-400 font-body">Trên {totalTests} bài làm</span>
                </div>

                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Điểm cao nhất</span>
                    <p className="text-2xl font-serif-title font-bold text-emerald-700 mt-1">
                        {totalTests > 0 ? `${highestScore} đ` : '---'}
                    </p>
                    <span className="text-[11px] text-emerald-600 font-body font-bold">Kỷ lục bài thi</span>
                </div>

                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Bài thi gần nhất</span>
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
                    <span className="text-[11px] text-gray-400 font-body">So với bài đầu tiên</span>
                </div>
            </div>

            {/* Performance Progress Chart Box */}
            <div className="bg-white p-6 border border-brand-cerulean/20 shadow-editorial space-y-4">
                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-brand-cerulean/15 gap-2">
                    <div>
                        <h3 className="font-serif-title font-bold text-lg text-brand-cerulean flex items-center gap-2">
                            <BarChart2 size={18} className="text-brand-jasper" />
                            Biểu đồ Tiến độ Điểm số theo Thời gian
                        </h3>
                        <p className="text-xs text-gray-500 font-body mt-0.5">
                            {activeStudent ? `Đang theo dõi học viên: ${activeStudent.fullName}` : 'Tổng hợp tiến độ bài thi'}
                        </p>
                    </div>

                    {activeStudent?.targetScores?.totalTarget && (
                        <span className="text-xs font-serif font-bold text-brand-jasper px-3 py-1 bg-brand-jasper/10 rounded">
                            Mục tiêu đề ra: {activeStudent.targetScores.totalTarget}
                        </span>
                    )}
                </div>

                {filteredResults.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 space-y-2">
                        <Award size={36} className="mx-auto text-gray-300" />
                        <p className="font-serif-title text-sm text-gray-500">Chưa có đủ dữ liệu bài thi để vẽ biểu đồ</p>
                        <p className="text-xs">Hãy nhấn nút "Nhập kết quả / Chấm bài" phía trên để lưu bài thi đầu tiên.</p>
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

                            {/* Y-Axis Grid Lines & Labels (0, 2, 4, 6, 8, 10) */}
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

                            {/* Target 8.0/9.0 Highlight Line */}
                            <line
                                x1={padding.left}
                                y1={padding.top + innerHeight - (8.0 / 10) * innerHeight}
                                x2={chartWidth - padding.right}
                                y2={padding.top + innerHeight - (8.0 / 10) * innerHeight}
                                stroke="#CF373D"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                opacity="0.6"
                            />
                            <text
                                x={chartWidth - padding.right}
                                y={padding.top + innerHeight - (8.0 / 10) * innerHeight - 4}
                                textAnchor="end"
                                className="text-[9px] fill-brand-jasper font-bold"
                            >
                                Mốc Giỏi (8.0đ)
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

            {/* Results Table */}
            <div className="bg-white border border-brand-cerulean/20 shadow-sm space-y-4 p-5">
                <div className="flex justify-between items-center">
                    <h3 className="font-serif-title font-bold text-base text-brand-cerulean">
                        Bảng Nhật ký Chi tiết Kết quả Kiểm tra ({tableResults.length})
                    </h3>
                </div>

                {tableResults.length === 0 ? (
                    <p className="text-xs text-gray-500 italic py-6 text-center">Chưa có kết quả bài thi nào được ghi nhận.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-body">
                            <thead className="bg-brand-cerulean text-brand-cream font-serif-title font-bold">
                                <tr>
                                    <th className="p-3">Ngày thi</th>
                                    <th className="p-3">Học viên</th>
                                    <th className="p-3">Đề thi</th>
                                    <th className="p-3 text-center">Môn</th>
                                    <th className="p-3 text-center">Thời gian</th>
                                    <th className="p-3 text-center">Đúng/Tổng</th>
                                    <th className="p-3 text-center">Điểm số</th>
                                    <th className="p-3">Nhận xét của GV</th>
                                    <th className="p-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tableResults.map(res => {
                                    const student = students.find(s => s.id === res.studentId) || { fullName: 'Học viên' };
                                    const exam = exams.find(e => e.id === res.examId) || { title: 'Đề thi đã lưu', subjectId: 'math' };
                                    const subject = subjects.find(s => s.id === exam.subjectId) || { name: 'Toán', color: '#124874' };
                                    const isExcellent = Number(res.score) >= 8.5;
                                    const isPass = Number(res.score) >= 5.0;

                                    return (
                                        <tr key={res.id} className="hover:bg-brand-cream/60 transition-colors">
                                            <td className="p-3 font-mono text-gray-600">{res.testDate}</td>
                                            <td className="p-3 font-serif-title font-bold text-brand-cerulean">{student.fullName}</td>
                                            <td className="p-3 font-serif-title font-bold text-gray-800">{exam.title}</td>
                                            <td className="p-3 text-center">
                                                <span
                                                    className="px-2 py-0.5 text-[10px] font-bold text-white rounded"
                                                    style={{ backgroundColor: subject.color || '#124874' }}
                                                >
                                                    {subject.name}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">{res.timeSpent || 90}p</td>
                                            <td className="p-3 text-center font-bold">
                                                {res.correctCount || 0} / {res.totalQuestions || 0}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2.5 py-1 rounded font-bold font-serif-title text-sm ${
                                                    isExcellent
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : isPass
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-amber-100 text-amber-900'
                                                }`}>
                                                    {Number(res.score).toFixed(1)} đ
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600 italic max-w-xs">{res.teacherFeedback || '---'}</td>
                                            <td className="p-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('Bạn có chắc muốn xóa kết quả bài thi này?')) {
                                                            onDeleteResult(res.id);
                                                            showToast?.('Đã xóa kết quả bài thi');
                                                        }
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                    title="Xóa kết quả này"
                                                >
                                                    <Trash2 size={14} />
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
            <ThptTestEntryModal
                isOpen={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                initialStudentId={selectedStudentFilter !== 'all' ? selectedStudentFilter : null}
                students={students}
                exams={exams}
                subjects={subjects}
                onSaveResult={onSaveResult}
                showToast={showToast}
            />
        </div>
    );
};

export default ThptTrackingView;
