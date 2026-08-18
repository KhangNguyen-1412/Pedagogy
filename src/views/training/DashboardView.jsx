import React from 'react';
import {
    GraduationCap,
    Award,
    BookOpen,
    CheckCircle2,
    Clock,
    Plus,
    AlertCircle,
    Calendar,
    FileCheck2 as FileCheck,
    UserCheck
} from 'lucide-react';
import { ProgressBar } from '../../components/common/EditorialWidgets';
import { normalizeProgram, getFilteredModules, isModuleInProgram } from "../../utils/ruleValidators";
import { calculateOverallGPA, calculateModuleFinal } from "../../utils/gpaCalculators";

export const DashboardView = ({
    programs,
    modules,
    events,
    studyLogs,
    thptProfile,
    thptExams = [],
    thptResults = [],
    thptSubjects = [],
    navigate,
    onOpenCertificate,
    selectedProgramFilter = 'all',
    setSelectedProgramFilter
}) => {
    const normalizedPrograms = programs.map(normalizeProgram);
    const activePrograms = selectedProgramFilter === 'all'
        ? normalizedPrograms.filter(p => p.isEnrolled !== false && p.status !== 'completed')
        : normalizedPrograms.filter(p => p.id === selectedProgramFilter);

    const currentProg = selectedProgramFilter !== 'all' ? normalizedPrograms.find(p => p.id === selectedProgramFilter) : null;
    const evalType = currentProg?.evaluationType || (currentProg?.category === 'nhanh_b' ? 'modules' : currentProg?.category === 'nhanh_c' ? 'hours' : 'credits');

    const overall = calculateOverallGPA(modules, normalizedPrograms, selectedProgramFilter);
    const upcomingEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);

    // THPT Preparation Calculations (Personalized & Clean)
    const thptExamDate = new Date('2026-06-26T07:30:00');
    const today = new Date();
    const diffTime = thptExamDate - today;
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const thptResultsCount = (thptResults || []).length;
    const avgScore = thptResultsCount > 0
        ? (thptResults.reduce((s, r) => s + (Number(r.score) || 0), 0) / thptResultsCount).toFixed(1)
        : '--';
    const maxScore = thptResultsCount > 0
        ? Math.max(...thptResults.map(r => Number(r.score) || 0)).toFixed(1)
        : '--';

    // Compute dynamic metric cards based on selectedProgramFilter and evalType
    let metricCards = null;
    if (selectedProgramFilter === 'all' || evalType === 'credits') {
        metricCards = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-cerulean/10 text-brand-cerulean">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Tín chỉ tích lũy</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">
                            {overall.earnedCredits} <span className="text-lg text-gray-500 font-normal">/ {overall.totalProgramCredits} TC</span>
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Bắt buộc + Thực hành + Tự chọn</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-jasper/10 text-brand-jasper">
                        <Award size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Điểm Hệ 10</span>
                        <h4 className="text-3xl font-serif-title text-brand-jasper font-bold">{overall.gpa10} <span className="text-sm font-normal text-gray-500">/ 10</span></h4>
                        <span className="text-xs text-gray-500 font-sans">Trung bình tích lũy</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-800">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Số môn đang xem</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">{overall.activeModulesCount} Môn</h4>
                        <span className="text-xs text-gray-500 font-sans">Bắt buộc, thực hành & tự chọn</span>
                    </div>
                </div>
            </div>
        );
    } else if (evalType === 'modules') {
        const progModules = modules.filter(m => isModuleInProgram(m, currentProg.id));
        const passedMods = progModules.filter(m => {
            const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
            return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
        });
        const isEligible = passedMods.length >= progModules.length && progModules.length > 0;

        metricCards = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-cerulean/10 text-brand-cerulean">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Chuyên đề đã Đạt</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">
                            {passedMods.length} <span className="text-lg text-gray-500 font-normal">/ {progModules.length} chuyên đề</span>
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Đánh giá theo môn & bài thu hoạch</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-800">
                        <Award size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Cấp chứng chỉ</span>
                        <h4 className="text-xl font-serif-title text-emerald-800 font-bold">
                            {isEligible ? '✓ Đủ điều kiện' : 'Chưa đủ điều kiện'}
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">{isEligible ? 'Đã hoàn thành toàn bộ chuyên đề' : `Cần đạt thêm ${progModules.length - passedMods.length} chuyên đề`}</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-jasper/10 text-brand-jasper">
                        <FileCheck size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Bài thu hoạch / Đồ án</span>
                        <h4 className="text-3xl font-serif-title text-brand-jasper font-bold">
                            {passedMods.length} / {progModules.length}
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Trạng thái hoàn thành chuyên đề</span>
                    </div>
                </div>
            </div>
        );
    } else if (evalType === 'hours') {
        const progModules = modules.filter(m => isModuleInProgram(m, currentProg.id));
        const totalHours = progModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
        const completedHours = progModules.filter(m => {
            const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
            return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
        }).reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);

        metricCards = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-cerulean/10 text-brand-cerulean">
                        <Clock size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Thời lượng tích lũy</span>
                        <h4 className="text-3xl font-serif-title text-brand-cerulean font-bold">
                            {completedHours} <span className="text-lg text-gray-500 font-normal">/ {totalHours} tiết</span>
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Thời lượng tham gia học tập</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-800">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Chuyên cần & Tham gia</span>
                        <h4 className="text-3xl font-serif-title text-blue-900 font-bold">
                            {totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0}%
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Tỷ lệ tích lũy giờ học</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                    <div className="p-3 bg-brand-jasper/10 text-brand-jasper">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-wider block">Mô-đun hoàn thành</span>
                        <h4 className="text-3xl font-serif-title text-brand-jasper font-bold">
                            {progModules.filter(m => m.status === 'completed').length} / {progModules.length} Mô-đun
                        </h4>
                        <span className="text-xs text-gray-500 font-sans">Số bài học / kỹ năng đã hoàn thành</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-5xl font-serif-title text-brand-cerulean mb-2">Tổng quan học tập.</h2>
                    <p className="text-xl text-gray-600 font-body">Hệ thống quản lý tiến độ & kết quả cá nhân đa mô hình.</p>
                </div>
                <div className="flex gap-4 items-center flex-wrap w-full md:w-auto">
                    {(selectedProgramFilter === 'all' || evalType === 'credits') && (
                        <>
                            <div className="bg-brand-cerulean text-white p-3.5 text-center border-editorial shadow-editorial min-w-[100px]">
                                <span className="text-[10px] uppercase tracking-widest block opacity-80">GPA (Hệ 4)</span>
                                <span className="text-2xl font-serif-title font-bold">{overall.gpa4}</span>
                            </div>
                            <div className="bg-brand-jasper text-white p-3.5 text-center border-editorial shadow-editorial min-w-[100px]">
                                <span className="text-[10px] uppercase tracking-widest block opacity-80">Xếp loại</span>
                                <span className="text-lg font-serif-title font-bold">{overall.rank}</span>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Quick Metrics Grid */}
            {metricCards}

            {/* THPT Preparation & University Goal Section */}
            <section className="bg-white border-editorial p-6 sm:p-8 shadow-editorial relative overflow-hidden space-y-6">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-jasper"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-widest text-brand-jasper font-bold flex items-center gap-1.5">
                                <GraduationCap size={14} /> Kỳ thi Tốt nghiệp THPT 2026
                            </span>
                            {diffDays > 0 && (
                                <span className="px-2 py-0.5 bg-brand-jasper/10 text-brand-jasper font-bold text-[11px] rounded border border-brand-jasper/20">
                                    Còn {diffDays} ngày
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                            Mục tiêu Ôn thi & Luyện đề THPT Quốc gia
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate('thpt_tracking')}
                            className="px-3.5 py-1.5 bg-brand-jasper text-white font-sans text-xs font-bold shadow-sm hover:bg-brand-cerulean transition-all flex items-center gap-1.5 rounded"
                        >
                            <Plus size={13} /> Nhập điểm bài làm
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('thpt_goals')}
                            className="px-3.5 py-1.5 bg-brand-cream border border-brand-cerulean/30 hover:border-brand-jasper text-brand-cerulean text-xs font-bold shadow-sm transition-all rounded"
                        >
                            Quản lý mục tiêu &rarr;
                        </button>
                    </div>
                </div>

                {/* THPT KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Goal Card */}
                    <div className="p-4 bg-brand-cream border border-brand-cerulean/15 rounded space-y-1">
                        <span className="text-xs text-gray-500 font-serif block">Trường & Ngành mục tiêu</span>
                        <h4 className={`text-base font-serif-title font-bold line-clamp-1 ${thptProfile?.targetUniversity ? 'text-brand-cerulean' : 'text-gray-400 italic'}`}>
                            {thptProfile?.targetUniversity || 'Chưa thiết lập mục tiêu'}
                        </h4>
                        <div className="flex items-center justify-between pt-2 border-t border-brand-cerulean/10 text-xs">
                            <span className="text-gray-500">Khối: <strong>{thptProfile?.combination || '--'}</strong></span>
                            <span className="text-brand-jasper font-bold font-serif-title">
                                Mục tiêu: {thptProfile?.targetTotalScore > 0 ? `${thptProfile.targetTotalScore} đ` : '--'}
                            </span>
                        </div>
                    </div>

                    {/* Progress & Average Score */}
                    <div className="p-4 bg-brand-cream border border-brand-cerulean/15 rounded space-y-1">
                        <span className="text-xs text-gray-500 font-serif block">Tiến độ Luyện đề</span>
                        <div className="flex items-baseline justify-between">
                            <h4 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                {thptResultsCount} <span className="text-xs font-sans text-gray-500 font-normal">lượt đã luyện</span>
                            </h4>
                            <span className="text-xs font-bold text-brand-jasper">
                                ĐTB: {avgScore} {avgScore !== '--' ? 'đ' : ''}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-brand-cerulean/10 text-xs text-gray-500">
                            <span>Kỷ lục cao nhất: <strong className="text-emerald-700">{maxScore !== '--' ? `${maxScore} đ` : '--'}</strong></span>
                            <button onClick={() => navigate('thpt_tracking')} className="text-brand-cerulean hover:underline font-bold">
                                Xem biểu đồ
                            </button>
                        </div>
                    </div>

                    {/* Mistakes & Tips */}
                    <div className="p-4 bg-brand-cream border border-brand-cerulean/15 rounded space-y-1">
                        <span className="text-xs text-gray-500 font-serif block">Sổ tay Rút kinh nghiệm</span>
                        <div className="flex items-baseline justify-between">
                            <h4 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                {(thptProfile?.mistakeNotes || []).length} <span className="text-xs font-sans text-gray-500 font-normal">ghi chú bẫy/lỗi</span>
                            </h4>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-brand-cerulean/10 text-xs">
                            <span className="text-gray-500 truncate max-w-[170px]">
                                {(thptProfile?.mistakeNotes || []).length > 0 ? (thptProfile.mistakeNotes[0].title) : 'Chưa có ghi chú'}
                            </span>
                            <button onClick={() => navigate('thpt_goals')} className="text-brand-jasper hover:underline font-bold shrink-0">
                                Mở sổ tay
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Mistake Tip Banner (if any mistake exists) */}
                {(thptProfile?.mistakeNotes || []).length > 0 && (
                    <div className="p-3 bg-red-50/60 border border-brand-jasper/20 rounded flex items-start gap-3">
                        <AlertCircle size={16} className="text-brand-jasper shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-700 font-body">
                            <strong className="text-brand-jasper font-serif-title">Ghi nhớ bẫy đề thi gần nhất:</strong> {thptProfile.mistakeNotes[0].title} — <span className="italic">{thptProfile.mistakeNotes[0].remedy || thptProfile.mistakeNotes[0].mistake}</span>
                        </div>
                    </div>
                )}
            </section>

            {/* Certificate Quick Banner */}
            <section className="bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-blue-100/40 border-2 border-brand-cerulean/60 p-6 shadow-editorial flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-brand-cerulean text-white rounded-full shadow-md shrink-0">
                        <Award size={32} />
                    </div>
                    <div>
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-bold font-serif-title uppercase tracking-wider rounded border border-red-200">
                            Bản Mẫu Chuẩn Bộ Giáo Dục & Đào Tạo
                        </span>
                        <h4 className="text-xl font-serif-title text-brand-cerulean font-bold mt-1">Chứng chỉ Nghiệp vụ Sư phạm Chính thức</h4>
                        <p className="text-sm text-brand-cerulean/80 font-body">Xem bản chứng nhận hoàn thành khóa học nghiệp vụ sư phạm cá nhân hóa với dấu đỏ & chữ ký.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenCertificate}
                    className="px-6 py-3 bg-brand-cerulean text-white font-serif-title font-bold text-sm shadow-editorial hover:bg-brand-cerulean/80 transition-all shrink-0 flex items-center gap-2"
                >
                    <Award size={18} /> Xem & In Chứng chỉ
                </button>
            </section>

            {/* Program Progress */}
            <section className="bg-white border-editorial p-6 shadow-editorial">
                <h3 className="text-2xl font-serif-title text-brand-cerulean mb-4 border-b border-brand-cerulean/20 pb-2">Chương trình đang theo học</h3>
                {activePrograms.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-brand-cerulean/30">
                        <p className="text-gray-500 mb-4">Bạn chưa đăng ký chương trình học nào.</p>
                        <button onClick={() => navigate('programs')} className="px-6 py-2 bg-brand-cerulean text-white font-serif-title">Xem danh sách chương trình</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activePrograms.map(prog => {
                            const pEval = prog.evaluationType || (prog.category === 'nhanh_b' ? 'modules' : prog.category === 'nhanh_c' ? 'hours' : 'credits');
                            const progModules = modules.filter(m => isModuleInProgram(m, prog.id));

                            if (pEval === 'credits') {
                                const activeProgMods = progModules.filter(m => m.type !== 'elective' || m.isSelected);
                                const progActiveCredits = activeProgMods.reduce((s, m) => s + Number(m.credits || 0), 0);
                                const progEarnedCredits = activeProgMods.reduce((s, m) => {
                                    if (m.grades) {
                                        const { score10 } = calculateModuleFinal(m.grades, m.syllabus?.weights);
                                        if (score10 >= 4.0) return s + Number(m.credits || 0);
                                    }
                                    return s;
                                }, 0);
                                const targetCredits = progActiveCredits || 1;

                                return (
                                    <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                            <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-xs font-bold font-serif-title rounded border border-brand-cerulean/20 shrink-0">Hệ Tín chỉ</span>
                                        </div>
                                        <p className="text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                        <ProgressBar current={progEarnedCredits} total={targetCredits} label="Tiến độ tích lũy tín chỉ" />
                                    </div>
                                );
                            }

                            if (pEval === 'modules') {
                                const passedMods = progModules.filter(m => {
                                    const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
                                    return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
                                });
                                return (
                                    <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold font-serif-title rounded border border-emerald-300 shrink-0">Hệ Chuyên đề</span>
                                        </div>
                                        <p className="text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                        <ProgressBar current={passedMods.length} total={progModules.length || 1} label={`Chuyên đề đã Đạt: ${passedMods.length}/${progModules.length}`} />
                                    </div>
                                );
                            }

                            // Hours
                            const totalH = progModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
                            const doneH = progModules.filter(m => m.status === 'completed' || calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0).reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
                            return (
                                <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold font-serif-title rounded border border-blue-300 shrink-0">Hệ Tiết học</span>
                                    </div>
                                    <p className="text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                    <ProgressBar current={doneH} total={totalH || 1} label={`Thời lượng đã học: ${doneH}/${totalH} tiết`} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Upcoming Schedule */}
            <section className="bg-white border-editorial p-6 shadow-editorial">
                <div className="flex justify-between items-center mb-4 border-b border-brand-cerulean/20 pb-2">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean flex items-center gap-2">
                        <Calendar size={22} /> Lịch học & Thi sắp tới
                    </h3>
                    <button onClick={() => navigate('calendar')} className="text-sm font-serif-title text-brand-jasper hover:underline">
                        Xem lịch đầy đủ &rarr;
                    </button>
                </div>
                {upcomingEvents.length === 0 ? (
                    <p className="text-gray-500 italic">Chưa có lịch học/thi nào được lên kế hoạch.</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingEvents.map(evt => (
                            <div key={evt.id} className="p-4 border-l-4 border-brand-cerulean bg-brand-cream flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-gray-500">{evt.date} &bull; {evt.startTime} - {evt.endTime}</span>
                                    <h5 className="text-lg font-serif-title text-brand-cerulean">{evt.title}</h5>
                                    <span className="text-xs text-gray-600">{evt.location}</span>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase ${evt.attendanceStatus === 'present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {evt.attendanceStatus === 'present' ? 'Có mặt' : 'Kế hoạch'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
