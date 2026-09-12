import React from 'react';
import {
    GraduationCap,
    Award,
    BookOpen,
    CheckCircle2,
    Clock,
    Calendar,
    FileCheck2 as FileCheck,
    UserCheck
} from 'lucide-react';
import { ProgressBar } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';
import { normalizeProgram, getFilteredModules, isModuleInProgram } from "../../utils/ruleValidators";
import { calculateOverallGPA, calculateModuleFinal } from "../../utils/gpaCalculators";

export const DashboardView = ({
    programs,
    modules,
    events,
    studyLogs,
    navigate,
    onOpenCertificate,
    selectedProgramFilter = 'all',
    setSelectedProgramFilter
}) => {
    const normalizedPrograms = programs.map(normalizeProgram);
    const activePrograms = selectedProgramFilter === 'all'
        ? normalizedPrograms.filter(p => p.status === 'dang_hoc')
        : normalizedPrograms.filter(p => p.id === selectedProgramFilter);

    const currentProg = selectedProgramFilter !== 'all' ? normalizedPrograms.find(p => p.id === selectedProgramFilter) : null;
    const evalType = currentProg?.evaluationType || (currentProg?.category === 'nhanh_b' ? 'modules' : currentProg?.category === 'nhanh_c' ? 'hours' : 'credits');

    const overall = calculateOverallGPA(modules, normalizedPrograms, selectedProgramFilter);
    const upcomingEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);



    // Compute dynamic metric cards based on selectedProgramFilter and evalType
    let metricCards = null;
    if (selectedProgramFilter === 'all' || evalType === 'credits') {
        metricCards = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-brand-cerulean/10 text-brand-cerulean shrink-0">
                        <GraduationCap size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Tín chỉ tích lũy</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean font-bold">
                            {overall.earnedCredits} <span className="text-base sm:text-lg text-gray-500 font-normal">/ {overall.totalProgramCredits} TC</span>
                        </h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Bắt buộc + Thực hành + Tự chọn</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-brand-jasper/10 text-brand-jasper shrink-0">
                        <Award size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Điểm Hệ 10</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-brand-jasper font-bold">{overall.gpa10} <span className="text-sm font-normal text-gray-500">/ 10</span></h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Trung bình tích lũy</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-brand-cerulean/10 text-brand-cerulean shrink-0">
                        <BookOpen size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Số môn đang xem</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean font-bold">{overall.activeModulesCount} Môn</h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Bắt buộc, thực hành & tự chọn</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-brand-cerulean/10 text-brand-cerulean shrink-0">
                        <CheckCircle2 size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Chuyên đề đã Đạt</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean font-bold">
                            {passedMods.length} <span className="text-base sm:text-lg text-gray-500 font-normal">/ {progModules.length} chuyên đề</span>
                        </h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Đánh giá theo môn & bài thu hoạch</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className={`p-2.5 sm:p-3 shrink-0 ${isEligible ? 'bg-brand-cerulean/15 text-brand-cerulean' : 'bg-brand-jasper/10 text-brand-jasper'}`}>
                        <Award size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Cấp chứng chỉ</span>
                        <h4 className={`text-lg sm:text-xl font-serif-title ${isEligible ? 'text-brand-cerulean' : 'text-brand-jasper'} font-bold flex items-center gap-1.5`}>
                            {isEligible ? (
                                <>
                                    <CheckCircle2 size={16} className="text-brand-cerulean shrink-0" />
                                    <span>Đủ điều kiện</span>
                                </>
                            ) : (
                                <span>Chưa đủ điều kiện</span>
                            )}
                        </h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">{isEligible ? 'Đã hoàn thành toàn bộ chuyên đề' : `Cần đạt thêm ${progModules.length - passedMods.length} chuyên đề`}</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-brand-jasper/10 text-brand-jasper shrink-0">
                        <FileCheck size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Bài thu hoạch / Đồ án</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-brand-jasper font-bold">
                            {passedMods.length} / {progModules.length}
                        </h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Trạng thái hoàn thành chuyên đề</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-brand-cerulean/10 text-brand-cerulean shrink-0">
                        <Clock size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Thời lượng tích lũy</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean font-bold">
                            {completedHours} <span className="text-base sm:text-lg text-gray-500 font-normal">/ {totalHours} tiết</span>
                        </h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Thời lượng tham gia học tập</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-blue-100 text-blue-800 shrink-0">
                        <UserCheck size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Chuyên cần & Tham gia</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-blue-900 font-bold">
                            {totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0}%
                        </h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Tỷ lệ tích lũy giờ học</span>
                    </div>
                </div>
                <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial flex items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-brand-jasper/10 text-brand-jasper shrink-0">
                        <BookOpen size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider block">Mô-đun hoàn thành</span>
                        <h4 className="text-2xl sm:text-3xl font-serif-title text-brand-jasper font-bold">
                            {progModules.filter(m => m.status === 'completed').length} / {progModules.length} Mô-đun
                        </h4>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-sans">Số bài học / kỹ năng đã hoàn thành</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10">
            <CollapsiblePageHeader
                title="Tổng quan học tập."
                subtitle="Hệ thống quản lý tiến độ & kết quả cá nhân đa mô hình."
                actions={({ isScrolled }) => (
                    (selectedProgramFilter === 'all' || evalType === 'credits') ? (
                        <div className="flex items-center gap-2 sm:gap-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                            <div className={`bg-brand-cerulean text-white text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
                                isScrolled
                                    ? 'px-2.5 py-1 rounded gap-1.5 shadow-xs'
                                    : 'p-2 sm:p-3 shadow-editorial flex-col min-w-[70px] sm:min-w-[95px]'
                            }`}>
                                <span className={`uppercase font-bold tracking-wider opacity-80 transition-all duration-300 ${
                                    isScrolled ? 'text-[10px]' : 'text-[9px] sm:text-[10px] block'
                                }`}>
                                    {isScrolled ? 'GPA' : 'GPA (Hệ 4)'}
                                </span>
                                <span className={`font-serif-title font-bold transition-all duration-300 leading-tight ${
                                    isScrolled ? 'text-xs sm:text-sm' : 'text-lg sm:text-2xl'
                                }`}>
                                    {overall.gpa4}
                                </span>
                            </div>
                            <div className={`bg-brand-jasper text-white text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
                                isScrolled
                                    ? 'px-2.5 py-1 rounded gap-1.5 shadow-xs'
                                    : 'p-2 sm:p-3 shadow-editorial flex-col min-w-[70px] sm:min-w-[95px]'
                            }`}>
                                <span className={`uppercase font-bold tracking-wider opacity-80 transition-all duration-300 ${
                                    isScrolled ? 'text-[10px]' : 'text-[9px] sm:text-[10px] block'
                                }`}>
                                    {isScrolled ? 'Hạng' : 'Xếp loại'}
                                </span>
                                <span className={`font-serif-title font-bold transition-all duration-300 leading-tight ${
                                    isScrolled ? 'text-xs sm:text-sm' : 'text-sm sm:text-lg'
                                }`}>
                                    {overall.rank}
                                </span>
                            </div>
                        </div>
                    ) : null
                )}
            />

            {/* Quick Metrics Grid */}
            {metricCards}

            {/* Certificate Quick Banner */}
            <section className="bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-blue-100/40 border-2 border-brand-cerulean/60 p-4 sm:p-6 shadow-editorial flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                    <div className="p-2.5 sm:p-3.5 bg-brand-cerulean text-white rounded-full shadow-md shrink-0">
                        <Award size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <div>
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] sm:text-xs font-bold font-serif-title uppercase tracking-wider rounded border border-red-200">
                            Bản Mẫu Chuẩn Bộ Giáo Dục & Đào Tạo
                        </span>
                        <h4 className="text-lg sm:text-xl font-serif-title text-brand-cerulean font-bold mt-1">Chứng chỉ Nghiệp vụ Sư phạm Chính thức</h4>
                        <p className="text-xs sm:text-sm text-brand-cerulean/80 font-body">Xem bản chứng nhận hoàn thành khóa học nghiệp vụ sư phạm cá nhân hóa với dấu đỏ & chữ ký.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenCertificate}
                    className="w-full sm:w-auto justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-brand-cerulean text-white font-serif-title font-bold text-xs sm:text-sm shadow-editorial hover:bg-brand-cerulean/80 transition-all shrink-0 flex items-center gap-2"
                >
                    <Award size={16} /> Xem & In Chứng chỉ
                </button>
            </section>

            {/* Program Progress */}
            <section className="bg-white border-editorial p-4 sm:p-6 shadow-editorial">
                <h3 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean mb-4 border-b border-brand-cerulean/20 pb-2">Chương trình đang theo học</h3>
                {activePrograms.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-brand-cerulean/30">
                        <p className="text-gray-500 mb-4">Bạn chưa đăng ký chương trình học nào.</p>
                        <button onClick={() => navigate('programs')} className="px-6 py-2 bg-brand-cerulean text-white font-serif-title">Xem danh sách chương trình</button>
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${activePrograms.length > 3 ? 'max-h-[680px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
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
                                    <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-4 sm:p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all shadow-xs">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                            <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[11px] sm:text-xs font-bold font-serif-title rounded border border-brand-cerulean/20 shrink-0">Hệ Tín chỉ</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
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
                                    <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-4 sm:p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all shadow-xs">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                            <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[11px] sm:text-xs font-bold font-serif-title rounded border border-brand-cerulean/30 shrink-0">Hệ Chuyên đề</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                        <ProgressBar current={passedMods.length} total={progModules.length || 1} label={`Chuyên đề đã Đạt: ${passedMods.length}/${progModules.length}`} />
                                    </div>
                                );
                            }

                            // Hours
                            const totalH = progModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
                            const doneH = progModules.filter(m => m.status === 'completed' || calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0).reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
                            return (
                                <div key={prog.id} onClick={() => navigate('program_detail', { programId: prog.id })} className="border border-brand-cerulean/30 p-4 sm:p-6 bg-brand-cream cursor-pointer hover:border-brand-jasper transition-all shadow-xs">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold">{prog.name}</h4>
                                        <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[11px] sm:text-xs font-bold font-serif-title rounded border border-brand-cerulean/30 shrink-0">Hệ Tiết học</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 my-2 line-clamp-3">{prog.description}</p>
                                    <ProgressBar current={doneH} total={totalH || 1} label={`Thời lượng đã học: ${doneH}/${totalH} tiết`} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Upcoming Schedule */}
            <section className="bg-white border-editorial p-4 sm:p-6 shadow-editorial">
                <div className="flex justify-between items-center mb-4 border-b border-brand-cerulean/20 pb-2">
                    <h3 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean flex items-center gap-2">
                        <Calendar size={20} /> Lịch học & Thi sắp tới
                    </h3>
                    <button onClick={() => navigate('calendar')} className="text-xs sm:text-sm font-serif-title text-brand-jasper hover:underline">
                        Xem lịch đầy đủ &rarr;
                    </button>
                </div>
                {upcomingEvents.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">Chưa có lịch học/thi nào được lên kế hoạch.</p>
                ) : (
                    <div className={`space-y-3 ${upcomingEvents.length > 3 ? 'max-h-[480px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                        {upcomingEvents.map(evt => (
                            <div key={evt.id} className="p-3 sm:p-4 border-l-4 border-brand-cerulean bg-brand-cream flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-500">{evt.date} &bull; {evt.startTime} - {evt.endTime}</span>
                                    <h5 className="text-base sm:text-lg font-serif-title text-brand-cerulean font-bold">{evt.title}</h5>
                                    <span className="text-xs text-gray-600">{evt.location}</span>
                                </div>
                                <span className={`px-2.5 py-1 text-[11px] sm:text-xs font-bold uppercase shrink-0 ${evt.attendanceStatus === 'present' ? 'bg-brand-cerulean text-white' : 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/30'}`}>
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
