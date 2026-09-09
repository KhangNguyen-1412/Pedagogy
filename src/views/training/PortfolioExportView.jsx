import React, { useState, useEffect } from 'react';
import {
    Printer,
    Download,
    FileText,
    Award,
    School,
    CheckCircle2,
    Calendar,
    User,
    BookOpen,
    Eye,
    ShieldCheck,
    Layers,
    Share2,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { EditorialSelect, Modal } from '../../components/common/EditorialWidgets';
import {
    initialPracticumData,
    initialLessonPlans,
    initialGraduationCriteria,
    initialTeacherCompetencies
} from '../../data/trainingData';
import { calculateModuleFinal } from '../../utils/gpaCalculators';

export const PortfolioExportView = ({ profile, modules = [] }) => {
    const [exportType, setExportType] = useState('transcript'); // 'transcript' | 'dossier'
    const [filterCourseType, setFilterCourseType] = useState('all'); // 'all' | 'mandatory' | 'elective'
    const [includeSignatures, setIncludeSignatures] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // 1 | 2
    const [pageViewMode, setPageViewMode] = useState('paged'); // 'paged' | 'continuous'

    const getBlankInfo = () => ({
        studentName: profile?.fullName || '',
        studentId: profile?.studentId || '',
        dob: profile?.dob || '',
        pob: profile?.province || '',
        cohort: profile?.className || '',
        trainingMode: profile?.trainingMode || '',
        registrar: '',
        dean: ''
    });

    const [infoForm, setInfoForm] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_transcript_info');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.studentName !== 'Nguyễn Văn An') {
                        return parsed;
                    }
                } catch (e) {}
            }
        }
        return getBlankInfo();
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_transcript_info', JSON.stringify(infoForm));
        }
    }, [infoForm]);

    // Keep synced when profile updates if fields are still empty
    useEffect(() => {
        if (profile?.fullName && !infoForm.studentName) {
            setInfoForm(prev => ({
                ...prev,
                studentName: profile.fullName || prev.studentName,
                studentId: profile.studentId || prev.studentId,
                dob: profile.dob || prev.dob,
                pob: profile.province || prev.pob,
                cohort: profile.className || prev.cohort,
                trainingMode: profile.trainingMode || prev.trainingMode
            }));
        }
    }, [profile]);

    const handleResetTranscript = () => {
        if (window.confirm('Bạn có chắc chắn muốn đặt lại thông tin bản in và làm sạch dữ liệu bảng điểm?')) {
            const blank = getBlankInfo();
            setInfoForm(blank);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('pedagogy_transcript_info');
            }
        }
    };

    const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);

    // Filter to only enrolled or selected modules (elective must be selected)
    const enrolledModules = (modules || []).filter(m => m.type !== 'elective' || m.isSelected);

    const filteredModules = enrolledModules.filter(m => {
        if (filterCourseType === 'mandatory') return m.type === 'mandatory';
        if (filterCourseType === 'elective') return m.type === 'elective';
        return true;
    });

    const gradedModules = filteredModules.filter(m => {
        return m.grades && (
            m.grades.final !== undefined ||
            m.grades.midterm !== undefined ||
            m.grades.attendance !== undefined
        );
    });

    const totalCredits = filteredModules.reduce((acc, m) => acc + (Number(m.credits) || 0), 0);
    const gradedCredits = gradedModules.reduce((acc, m) => acc + (Number(m.credits) || 0), 0);
    const mandatoryModules = filteredModules.filter(m => m.type === 'mandatory');
    const electiveModules = filteredModules.filter(m => m.type === 'elective');
    const mandatoryCredits = mandatoryModules.reduce((acc, m) => acc + (Number(m.credits) || 0), 0);
    const electiveCredits = electiveModules.reduce((acc, m) => acc + (Number(m.credits) || 0), 0);

    let gpa10 = '---';
    let gpa4 = '---';
    let rank = 'Chưa xếp loại';

    if (gradedCredits > 0) {
        let sum10 = 0;
        let sum4 = 0;
        gradedModules.forEach(m => {
            const cr = Number(m.credits) || 0;
            const res = calculateModuleFinal(m.grades, m.syllabus?.weights);
            sum10 += res.score10 * cr;
            sum4 += res.gpa4 * cr;
        });
        gpa10 = (sum10 / gradedCredits).toFixed(2);
        gpa4 = (sum4 / gradedCredits).toFixed(2);
        const num4 = parseFloat(gpa4);
        if (num4 >= 3.6) rank = 'Xuất sắc';
        else if (num4 >= 3.2) rank = 'Giỏi';
        else if (num4 >= 2.5) rank = 'Khá';
        else if (num4 >= 2.0) rank = 'Trung bình';
        else rank = 'Yếu - Cần cố gắng';
    }

    // Dynamic data for Teaching Dossier
    const [dossierData, setDossierData] = useState(() => {
        let practicum = initialPracticumData;
        let plans = initialLessonPlans;
        let sessions = [];
        let competencies = initialTeacherCompetencies;

        if (typeof window !== 'undefined') {
            try {
                const sp = localStorage.getItem('pedagogy_practicum_data');
                if (sp) practicum = JSON.parse(sp);
            } catch (e) {}
            try {
                const sl = localStorage.getItem('pedagogy_lesson_plans');
                if (sl) plans = JSON.parse(sl);
            } catch (e) {}
            try {
                const sm = localStorage.getItem('pedagogy_micro_sessions');
                if (sm) sessions = JSON.parse(sm);
            } catch (e) {}
            try {
                const sc = localStorage.getItem('pedagogy_competencies');
                if (sc) competencies = JSON.parse(sc);
            } catch (e) {}
        }
        return { practicum, plans, sessions, competencies };
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let practicum = initialPracticumData;
            let plans = initialLessonPlans;
            let sessions = [];
            let competencies = initialTeacherCompetencies;
            try {
                const sp = localStorage.getItem('pedagogy_practicum_data');
                if (sp) practicum = JSON.parse(sp);
            } catch (e) {}
            try {
                const sl = localStorage.getItem('pedagogy_lesson_plans');
                if (sl) plans = JSON.parse(sl);
            } catch (e) {}
            try {
                const sm = localStorage.getItem('pedagogy_micro_sessions');
                if (sm) sessions = JSON.parse(sm);
            } catch (e) {}
            try {
                const sc = localStorage.getItem('pedagogy_competencies');
                if (sc) competencies = JSON.parse(sc);
            } catch (e) {}
            setDossierData({ practicum, plans, sessions, competencies });
        }
    }, [exportType]);

    const pSchool = dossierData.practicum?.school || {};
    const pEval = dossierData.practicum?.finalEvaluation || {};
    const schoolName = pSchool.name || 'Chưa cập nhật trường thực tập';
    const schoolPeriod = pSchool.period || 'Chưa xác định thời gian';
    const schoolMentor = pSchool.headTeacher || pSchool.homeroomAdvisor || pSchool.principal || 'Thầy/Cô hướng dẫn';
    const tScore = (pEval.teachingScore !== undefined && !isNaN(pEval.teachingScore)) ? Number(pEval.teachingScore).toFixed(1) : '---';
    const hScore = (pEval.homeroomScore !== undefined && !isNaN(pEval.homeroomScore)) ? Number(pEval.homeroomScore).toFixed(1) : '---';
    const rScore = (pEval.reportScore !== undefined && !isNaN(pEval.reportScore)) ? Number(pEval.reportScore).toFixed(1) : '---';
    const rawTotal = pEval.overallScore ?? pEval.totalScore;
    const totalScore = (rawTotal !== undefined && !isNaN(rawTotal)) ? Number(rawTotal).toFixed(2) : '---';

    const planCount = dossierData.plans?.length || 0;
    const microSessions = dossierData.sessions || [];
    const microAvg = microSessions.length > 0
        ? (microSessions.reduce((acc, s) => acc + (Number(s.score) || 0), 0) / microSessions.length).toFixed(1)
        : null;

    let ratedGood = 0;
    let ratedFair = 0;
    let ratedPass = 0;
    let ratedFail = 0;
    let ratedUnrated = 0;
    (dossierData.competencies || []).forEach(std => {
        (std.criteria || []).forEach(c => {
            if (c.level === 'good') ratedGood++;
            else if (c.level === 'fair') ratedFair++;
            else if (c.level === 'pass') ratedPass++;
            else if (c.level === 'fail') ratedFail++;
            else ratedUnrated++;
        });
    });
    const totalCriteria = ratedGood + ratedFair + ratedPass + ratedFail + ratedUnrated;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Sticky Editorial Header (Hidden on print) */}
            <header className="print:hidden sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean text-xs font-serif-title font-bold uppercase tracking-wider mb-2">
                        <Printer className="w-3.5 h-3.5 text-brand-cerulean" />
                        Trung tâm Hồ sơ • Bảng điểm & Chứng chỉ Sư phạm
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-serif-title text-brand-cerulean tracking-tight">
                        Xuất Bản Hồ Sơ & Bảng Điểm
                    </h1>
                    <p className="text-sm font-sans text-stone-600 mt-2 max-w-3xl">
                        Trích xuất bảng điểm học tập chính thức (Official Academic Transcript) và Hồ sơ Sư phạm tổng hợp (Teaching Dossier) theo chuẩn biểu mẫu quốc gia, hỗ trợ in ấn A4 sắc nét hoặc xuất tệp số.
                    </p>
                </div>

                {/* Print & Export Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleResetTranscript}
                        className="px-3 py-2 bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-200 text-xs font-serif-title font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                        title="Xóa mẫu thông tin bản in và làm sạch dữ liệu"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa mẫu
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        In Hồ Sơ (A4)
                    </button>
                    <button
                        onClick={() => alert('Đang tạo file PDF bản in chính thức...')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-300 text-stone-800 font-serif-title font-bold text-xs hover:bg-stone-200"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Xuất PDF
                    </button>
                </div>
            </header>

            {/* Document Controls Bar (Hidden on print) */}
            <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-editorial shadow-editorial p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex p-1 bg-brand-cream border border-brand-cerulean/30 rounded shadow-xs flex-wrap gap-1">
                        {[
                            { id: 'transcript', label: 'Bảng điểm Sư phạm (Transcript)', icon: FileText },
                            { id: 'dossier', label: 'Hồ sơ Năng lực Sư phạm (Teaching Dossier)', icon: Award }
                        ].map(tab => {
                            const TabIcon = tab.icon;
                            const isActive = exportType === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setExportType(tab.id)}
                                    className={`px-3 py-1.5 font-serif-title text-xs font-bold rounded transition-all flex items-center gap-2 whitespace-nowrap ${
                                        isActive
                                            ? 'bg-brand-cerulean text-white shadow-xs'
                                            : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                    }`}
                                >
                                    <TabIcon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {exportType === 'transcript' && (
                        <div className="flex items-center gap-2 text-xs font-sans">
                            <span className="font-serif-title font-bold text-stone-700">Lọc học phần:</span>
                            <EditorialSelect
                                value={filterCourseType}
                                onChange={(val) => setFilterCourseType(val)}
                                options={[
                                    { value: 'all', label: `Tất cả học phần (${totalCredits} TC)` },
                                    { value: 'mandatory', label: 'Chỉ học phần Bắt buộc (Khối A)' },
                                    { value: 'elective', label: 'Chỉ học phần Tự chọn (Khối C)' }
                                ]}
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <button
                        type="button"
                        onClick={() => setIsEditInfoModalOpen(true)}
                        className="px-3 py-1.5 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-xs flex items-center gap-1.5"
                    >
                        <Pencil className="w-3.5 h-3.5" /> Sửa thông tin bản in
                    </button>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeSignatures}
                            onChange={(e) => setIncludeSignatures(e.target.checked)}
                            className="rounded border-stone-300 text-brand-cerulean focus:ring-brand-cerulean"
                        />
                        <span className="text-stone-700 font-serif-title font-bold">Khung chữ ký & mộc</span>
                    </label>
                </div>
            </div>

            {/* ============================================================ */}
            {/* A4 PAGE CONTROLS BAR (Hidden on print) */}
            {/* ============================================================ */}
            <div className="print:hidden bg-stone-100 border border-stone-300 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-serif-title">
                <div className="flex items-center gap-2">
                    <span className="text-stone-500 font-bold uppercase tracking-wider text-[11px]">Chế độ xem A4:</span>
                    <div className="inline-flex p-0.5 bg-white border border-stone-200 rounded shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setPageViewMode('paged')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                pageViewMode === 'paged' ? 'bg-brand-cerulean text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                            }`}
                        >
                            Lật từng trang A4
                        </button>
                        <button
                            type="button"
                            onClick={() => setPageViewMode('continuous')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                pageViewMode === 'continuous' ? 'bg-brand-cerulean text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                            }`}
                        >
                            Cuộn cả 2 trang A4
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {pageViewMode === 'paged' ? (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => {
                                    setCurrentPage(1);
                                    window.scrollTo({ top: 350, behavior: 'smooth' });
                                }}
                                className={`px-3 py-1 border border-stone-300 font-bold text-xs flex items-center gap-1 transition-all ${
                                    currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-800 shadow-2xs'
                                }`}
                            >
                                <ChevronLeft size={13} /> Trang trước
                            </button>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(1);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className={`px-3 py-1 border text-xs font-bold font-mono transition-all ${
                                        currentPage === 1
                                            ? 'bg-brand-cerulean text-white border-brand-cerulean shadow-xs'
                                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                                    }`}
                                >
                                    Tờ 1
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(2);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className={`px-3 py-1 border text-xs font-bold font-mono transition-all ${
                                        currentPage === 2
                                            ? 'bg-brand-cerulean text-white border-brand-cerulean shadow-xs'
                                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                                    }`}
                                >
                                    Tờ 2
                                </button>
                            </div>

                            <button
                                type="button"
                                disabled={currentPage === 2}
                                onClick={() => {
                                    setCurrentPage(2);
                                    window.scrollTo({ top: 350, behavior: 'smooth' });
                                }}
                                className={`px-3 py-1 border border-stone-300 font-bold text-xs flex items-center gap-1 transition-all ${
                                    currentPage === 2 ? 'opacity-40 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-800 shadow-2xs'
                                }`}
                            >
                                Trang sau <ChevronRight size={13} />
                            </button>
                        </div>
                    ) : (
                        <span className="text-stone-500 italic font-sans text-xs">
                            Hiển thị liên tục cả 2 trang A4 chuẩn (Tờ 1 & Tờ 2)
                        </span>
                    )}
                    <span className="hidden sm:inline-block text-[11px] text-stone-500 font-mono bg-white px-2 py-1 border border-stone-200">
                        Khổ chuẩn 210 × 297 mm (A4)
                    </span>
                </div>
            </div>

            {/* ============================================================ */}
            {/* OFFICIAL PRINT CANVAS (A4 DOCUMENT PAPER SHEETS) */}
            {/* ============================================================ */}
            {exportType === 'transcript' && (
                <div className="space-y-8 print:space-y-0">
                    {/* ----------------- TRANSCRIPT PAGE 1 ----------------- */}
                    <div className={`${pageViewMode === 'paged' && currentPage !== 1 ? 'hidden print:flex' : 'flex'} max-w-[794px] w-full min-h-[1080px] mx-auto bg-white border-editorial shadow-editorial p-8 sm:p-12 text-stone-900 relative flex-col justify-between print:min-h-0 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-full print:break-after-page`}>
                        <div className="space-y-5">
                            {/* Header University & National Emblem */}
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b-2 border-stone-800">
                                <div className="space-y-1">
                                    <div className="text-[11px] font-serif uppercase tracking-wider text-stone-700 font-bold">
                                        BỘ GIÁO DỤC VÀ ĐÀO TẠO
                                    </div>
                                    <div className="text-xs font-serif uppercase tracking-wide font-bold text-brand-cerulean">
                                        TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
                                    </div>
                                    <div className="text-[11px] font-serif text-stone-600">
                                        PHÒNG QUẢN LÝ ĐÀO TẠO & NGHIỆP VỤ SƯ PHẠM
                                    </div>
                                </div>

                                <div className="text-center space-y-0.5">
                                    <div className="text-[11px] font-serif uppercase tracking-wider text-stone-800 font-bold">
                                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                    </div>
                                    <div className="text-[11px] font-serif italic text-stone-700 border-b border-stone-400 pb-1 inline-block">
                                        Độc lập - Tự do - Hạnh phúc
                                    </div>
                                </div>
                            </div>

                            {/* Title of Document */}
                            <div className="text-center py-1 space-y-1">
                                <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-wide uppercase">
                                    BẢNG ĐIỂM KẾT QUẢ HỌC TẬP TOÀN KHÓA
                                </h2>
                                <div className="text-xs font-serif font-bold text-brand-jasper uppercase tracking-wider">
                                    CHƯƠNG TRÌNH BỒI DƯỠNG NGHIỆP VỤ SƯ PHẠM GIÁO VIÊN TRUNG HỌC PHỔ THÔNG
                                </div>
                                <div className="text-[11px] font-serif italic text-stone-500">
                                    (Ban hành theo Thông tư số 12/2021/TT-BGDĐT của Bộ Giáo dục và Đào tạo)
                                </div>
                            </div>

                            {/* Student Information Box */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-50/70 border border-stone-200 text-xs font-sans">
                                <div>
                                    <span className="text-stone-500 block">Họ và tên học viên:</span>
                                    <strong className="font-serif text-stone-900 text-sm">
                                        {infoForm.studentName || <span className="text-stone-400 italic">Chưa nhập họ tên</span>}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-stone-500 block">Mã số học viên:</span>
                                    <strong className="font-mono text-stone-900">
                                        {infoForm.studentId || <span className="text-stone-400 italic">Chưa nhập</span>}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-stone-500 block">Ngày sinh:</span>
                                    <strong className="font-serif text-stone-900">
                                        {infoForm.dob || <span className="text-stone-400 italic">Chưa nhập</span>}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-stone-500 block">Nơi sinh:</span>
                                    <strong className="font-serif text-stone-900">
                                        {infoForm.pob || <span className="text-stone-400 italic">Chưa nhập</span>}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-stone-500 block">Khóa đào tạo:</span>
                                    <strong className="font-serif text-stone-900">
                                        {infoForm.cohort || <span className="text-stone-400 italic">Chưa nhập</span>}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-stone-500 block">Hệ đào tạo:</span>
                                    <strong className="font-serif text-stone-900">
                                        {infoForm.trainingMode || <span className="text-stone-400 italic">Chưa nhập</span>}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-stone-500 block">Tổng số tín chỉ:</span>
                                    <strong className="font-mono text-brand-cerulean font-bold">{totalCredits} TC</strong>
                                </div>
                                <div>
                                    <span className="text-stone-500 block">Xếp loại tốt nghiệp:</span>
                                    <strong className="font-serif text-brand-jasper font-bold">{rank}</strong>
                                </div>
                            </div>

                            {/* Modules Academic Table */}
                            <div className="overflow-x-auto border border-stone-300">
                                <table className="w-full text-left text-xs font-sans border-collapse">
                                    <thead>
                                        <tr className="bg-stone-100 border-b border-stone-300 text-stone-800 font-serif">
                                            <th className="py-2 px-2 text-center w-8 border-r border-stone-200">STT</th>
                                            <th className="py-2 px-2 w-20 border-r border-stone-200">Mã HP</th>
                                            <th className="py-2 px-3 border-r border-stone-200">Tên học phần sư phạm</th>
                                            <th className="py-2 px-2 text-center w-12 border-r border-stone-200">Số TC</th>
                                            <th className="py-2 px-2 text-center w-14 border-r border-stone-200">Điểm 10</th>
                                            <th className="py-2 px-2 text-center w-14 border-r border-stone-200">Điểm 4</th>
                                            <th className="py-2 px-2 text-center w-12 border-r border-stone-200">Chữ</th>
                                            <th className="py-2 px-3">Giảng viên phụ trách</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-200">
                                        {filteredModules.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="py-12 text-center text-stone-500 font-serif">
                                                    Chưa có học phần nào được chọn hoặc đăng ký trong danh mục này.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredModules.map((m, idx) => {
                                                const hasGrades = m.grades && (
                                                    m.grades.final !== undefined ||
                                                    m.grades.midterm !== undefined ||
                                                    m.grades.attendance !== undefined
                                                );
                                                const finalRes = hasGrades
                                                    ? calculateModuleFinal(m.grades, m.syllabus?.weights)
                                                    : null;
                                                const score10 = finalRes?.score10;
                                                const gpa4 = finalRes?.gpa4;
                                                const letter = finalRes?.letter || '-';

                                                return (
                                                    <tr key={m.id || m.code || idx} className="hover:bg-stone-50/50">
                                                        <td className="py-1.5 px-2 text-center text-stone-500 font-mono border-r border-stone-200">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="py-1.5 px-2 font-mono font-bold text-stone-700 border-r border-stone-200">
                                                            {m.code}
                                                        </td>
                                                        <td className="py-1.5 px-3 text-stone-900 font-serif border-r border-stone-200">
                                                            {m.name}
                                                        </td>
                                                        <td className="py-1.5 px-2 text-center font-mono border-r border-stone-200">
                                                            {m.credits}
                                                        </td>
                                                        <td className="py-1.5 px-2 text-center font-mono font-bold text-stone-800 border-r border-stone-200">
                                                            {typeof score10 === 'number' && !isNaN(score10) ? score10.toFixed(1) : '-'}
                                                        </td>
                                                        <td className="py-1.5 px-2 text-center font-mono text-stone-700 border-r border-stone-200">
                                                            {typeof gpa4 === 'number' && !isNaN(gpa4) ? gpa4.toFixed(1) : '-'}
                                                        </td>
                                                        <td className="py-1.5 px-2 text-center font-mono font-bold text-brand-cerulean border-r border-stone-200">
                                                            {letter}
                                                        </td>
                                                        <td className="py-1.5 px-3 text-stone-600 italic">
                                                            {m.lecturer || 'Khoa Sư phạm'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Page 1 Bottom Section & Page Flip Button */}
                        <div className="pt-4 mt-4 border-t border-stone-200 space-y-3 font-serif">
                            <p className="text-[11px] text-stone-500 italic text-center">
                                * Bảng điểm còn tiếp tục. Kết quả tổng hợp GPA toàn khóa và chữ ký xác nhận pháp lý tại Trang 2/2.
                            </p>

                            {/* Prominent Page Turn Button (Hidden on print) */}
                            <div className="print:hidden bg-brand-cream/60 border border-brand-cerulean/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-xs text-stone-600 font-sans flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                    <span>Học viên đã tích lũy <strong>{gradedCredits}/{totalCredits}</strong> tín chỉ trên Tờ 1.</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(2);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial transition-all self-end sm:self-auto"
                                >
                                    <span>Qua Trang 2 (Tổng hợp GPA & Chữ ký)</span>
                                    <ChevronRight size={15} />
                                </button>
                            </div>

                            {/* Page 1 Official Footer */}
                            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
                                <span>Mã tra cứu: PEDAGOGY-{infoForm.studentId || '2026'}-T1</span>
                                <span>Trường ĐH Sư phạm TP.HCM</span>
                                <span className="font-bold text-stone-700">Trang 1 / 2</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Sheet Divider between Page 1 and Page 2 (In continuous view mode) */}
                    {pageViewMode === 'continuous' && (
                        <div className="print:hidden my-8 flex items-center justify-center gap-4">
                            <div className="h-px bg-stone-300 flex-1 max-w-xs" />
                            <div className="px-4 py-1.5 bg-brand-cream border border-brand-cerulean/30 rounded-full font-serif-title text-xs font-bold text-brand-cerulean flex items-center gap-2 shadow-xs">
                                <span>Hết Trang 1</span>
                                <span>•</span>
                                <span>Bắt đầu Trang 2 Khổ A4</span>
                            </div>
                            <div className="h-px bg-stone-300 flex-1 max-w-xs" />
                        </div>
                    )}

                    {/* ----------------- TRANSCRIPT PAGE 2 ----------------- */}
                    <div className={`${pageViewMode === 'paged' && currentPage !== 2 ? 'hidden print:flex' : 'flex'} max-w-[794px] w-full min-h-[1080px] mx-auto bg-white border-editorial shadow-editorial p-8 sm:p-12 text-stone-900 relative flex-col justify-between print:min-h-0 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-full`}>
                        <div className="space-y-6">
                            {/* Page 2 Top Banner */}
                            <div className="pb-3 border-b-2 border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-serif">
                                <div>
                                    <span className="font-bold uppercase text-brand-cerulean block">
                                        TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
                                    </span>
                                    <span className="text-[11px] text-stone-500">
                                        BẢNG ĐIỂM KẾT QUẢ HỌC TẬP TOÀN KHÓA • TRANG 2
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-stone-900 block">
                                        Học viên: {infoForm.studentName || '---'}
                                    </span>
                                    <span className="font-mono text-stone-500 text-[11px]">
                                        MSSV: {infoForm.studentId || '---'}
                                    </span>
                                </div>
                            </div>

                            {/* Section A: Category Breakdown Table */}
                            <div className="space-y-2">
                                <h3 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider border-l-4 border-brand-cerulean pl-2.5">
                                    1. Cơ Cấu Tích Lũy Tín Chỉ Theo Khối Kiến Thức Sư Phạm
                                </h3>
                                <div className="border border-stone-300 overflow-hidden text-xs font-sans">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-stone-100 border-b border-stone-300 font-serif">
                                            <tr>
                                                <th className="py-2 px-3 border-r border-stone-200">Khối kiến thức đào tạo</th>
                                                <th className="py-2 px-3 text-center border-r border-stone-200 w-28">Số tín chỉ tích lũy</th>
                                                <th className="py-2 px-3 text-center border-r border-stone-200 w-28">Tình trạng</th>
                                                <th className="py-2 px-3">Ghi chú đối soát</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-200">
                                            <tr>
                                                <td className="py-2 px-3 font-serif font-medium border-r border-stone-200">
                                                    Khối A: Bắt buộc (Kiến thức chung & NVSP cốt lõi)
                                                </td>
                                                <td className="py-2 px-3 text-center font-mono font-bold border-r border-stone-200">
                                                    {mandatoryCredits} TC
                                                </td>
                                                <td className="py-2 px-3 text-center font-serif text-emerald-700 font-bold border-r border-stone-200">
                                                    Đã tích lũy đủ
                                                </td>
                                                <td className="py-2 px-3 text-stone-600 text-[11px]">
                                                    Hoàn thành đầy đủ các học phần điều kiện tiên quyết
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-3 font-serif font-medium border-r border-stone-200">
                                                    Khối C: Tự chọn chuyên sâu sư phạm THPT
                                                </td>
                                                <td className="py-2 px-3 text-center font-mono font-bold border-r border-stone-200">
                                                    {electiveCredits} TC
                                                </td>
                                                <td className="py-2 px-3 text-center font-serif text-emerald-700 font-bold border-r border-stone-200">
                                                    Đã tích lũy đủ
                                                </td>
                                                <td className="py-2 px-3 text-stone-600 text-[11px]">
                                                    Chọn học đúng các chuyên đề phương pháp giảng dạy
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-3 font-serif font-medium border-r border-stone-200">
                                                    Thực tập Sư phạm tại trường THPT liên kết (TTSP)
                                                </td>
                                                <td className="py-2 px-3 text-center font-mono font-bold border-r border-stone-200">
                                                    4 TC
                                                </td>
                                                <td className="py-2 px-3 text-center font-serif text-emerald-700 font-bold border-r border-stone-200">
                                                    {totalScore !== '---' ? `Đạt ${totalScore}/10` : 'Đang hoàn thiện'}
                                                </td>
                                                <td className="py-2 px-3 text-stone-600 text-[11px]">
                                                    Đã nộp biên bản dự giờ, giáo án 5555 và báo cáo chủ nhiệm
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Section B: Official GPA Summary Cards */}
                            <div className="space-y-2">
                                <h3 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider border-l-4 border-brand-cerulean pl-2.5">
                                    2. Tổng Hợp Điểm Trung Bình & Xếp Loại Tốt Nghiệp Toàn Khóa
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-stone-50 border border-stone-300 p-3 text-center">
                                        <span className="text-[10px] font-serif uppercase tracking-wider text-stone-500 block">
                                            Tổng số tín chỉ tích lũy
                                        </span>
                                        <span className="text-2xl font-mono font-bold text-stone-900 block mt-1">
                                            {totalCredits} <span className="text-xs text-stone-500">TC</span>
                                        </span>
                                    </div>

                                    <div className="bg-stone-50 border border-stone-300 p-3 text-center">
                                        <span className="text-[10px] font-serif uppercase tracking-wider text-stone-500 block">
                                            Điểm TB toàn khóa (Hệ 10)
                                        </span>
                                        <span className="text-2xl font-mono font-bold text-brand-jasper block mt-1">
                                            {gpa10} <span className="text-xs text-stone-500">/10</span>
                                        </span>
                                    </div>

                                    <div className="bg-stone-50 border border-stone-300 p-3 text-center">
                                        <span className="text-[10px] font-serif uppercase tracking-wider text-stone-500 block">
                                            Điểm TB toàn khóa (Hệ 4)
                                        </span>
                                        <span className="text-2xl font-mono font-bold text-brand-cerulean block mt-1">
                                            {gpa4} <span className="text-xs text-stone-500">/4.0</span>
                                        </span>
                                    </div>

                                    <div className="bg-brand-cream/80 border border-brand-cerulean/30 p-3 text-center">
                                        <span className="text-[10px] font-serif uppercase tracking-wider text-brand-cerulean block font-bold">
                                            Xếp loại tốt nghiệp
                                        </span>
                                        <span className="text-xl font-serif font-bold text-brand-jasper uppercase block mt-1">
                                            {rank}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section C: Grading Scale Reference */}
                            <div className="space-y-1.5">
                                <h3 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider border-l-4 border-brand-cerulean pl-2.5">
                                    3. Quy Định Quy Đổi Thang Điểm Đào Tạo Quốc Gia & ECTS
                                </h3>
                                <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-sans">
                                    <div className="bg-stone-50 border border-stone-200 p-2">
                                        <span className="font-serif font-bold text-stone-800 block">8.5 - 10.0</span>
                                        <span className="font-mono text-stone-600">Loại A (4.0)</span>
                                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Giỏi / Xuất sắc</span>
                                    </div>
                                    <div className="bg-stone-50 border border-stone-200 p-2">
                                        <span className="font-serif font-bold text-stone-800 block">7.0 - 8.4</span>
                                        <span className="font-mono text-stone-600">Loại B (3.0)</span>
                                        <span className="text-[10px] text-blue-700 font-bold block mt-0.5">Khá</span>
                                    </div>
                                    <div className="bg-stone-50 border border-stone-200 p-2">
                                        <span className="font-serif font-bold text-stone-800 block">5.5 - 6.9</span>
                                        <span className="font-mono text-stone-600">Loại C (2.0)</span>
                                        <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Trung bình</span>
                                    </div>
                                    <div className="bg-stone-50 border border-stone-200 p-2">
                                        <span className="font-serif font-bold text-stone-800 block">4.0 - 5.4</span>
                                        <span className="font-mono text-stone-600">Loại D (1.0)</span>
                                        <span className="text-[10px] text-orange-700 font-bold block mt-0.5">Trung bình yếu</span>
                                    </div>
                                    <div className="bg-stone-50 border border-stone-200 p-2">
                                        <span className="font-serif font-bold text-stone-800 block">Dưới 4.0</span>
                                        <span className="font-mono text-stone-600">Loại F (0.0)</span>
                                        <span className="text-[10px] text-rose-700 font-bold block mt-0.5">Chưa đạt</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section D: Signatures & Certification Box */}
                            {includeSignatures && (
                                <div className="grid grid-cols-2 gap-8 pt-6 text-xs font-serif">
                                    <div className="text-center space-y-1">
                                        <div className="font-bold uppercase text-stone-800">NGƯỜI LẬP BẢNG ĐIỂM</div>
                                        <div className="text-stone-400 italic text-[11px] pt-14">
                                            (Đã ký tên)
                                        </div>
                                        <div className="font-bold text-stone-800 pt-2">
                                            {infoForm.registrar || <span className="text-stone-400 italic font-normal">Chưa thiết lập</span>}
                                        </div>
                                    </div>

                                    <div className="text-center space-y-1">
                                        <div className="italic text-stone-600">
                                            {infoForm.pob ? `${infoForm.pob}, ` : 'TP. Hồ Chí Minh, '}ngày ..... tháng ..... năm 2026
                                        </div>
                                        <div className="font-bold uppercase text-stone-900">TRƯỞNG PHÒNG ĐÀO TẠO</div>
                                        <div className="text-stone-400 italic text-[11px] pt-14">
                                            (Ký tên và đóng dấu cơ quan)
                                        </div>
                                        <div className="font-bold text-stone-900 pt-2">
                                            {infoForm.dean || <span className="text-stone-400 italic font-normal">Chưa thiết lập</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Page 2 Bottom Section & Return Button */}
                        <div className="pt-4 mt-4 border-t border-stone-200 space-y-3 font-serif">
                            {/* Page Return Navigation (Hidden on print) */}
                            <div className="print:hidden bg-stone-50 border border-stone-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(1);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 text-stone-800 font-serif-title font-bold text-xs hover:bg-stone-100 transition-all shadow-2xs"
                                >
                                    <ChevronLeft size={15} />
                                    <span>Quay lại Trang 1 (Danh mục học phần)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial transition-all"
                                >
                                    <Printer size={15} />
                                    <span>In Trọn Bộ Bản A4 (Cả 2 Trang)</span>
                                </button>
                            </div>

                            {/* Page 2 Official Footer */}
                            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
                                <span>* Bảng điểm có giá trị pháp lý khi có đủ chữ ký và con dấu của Nhà trường.</span>
                                <span>Hệ thống Pedagogy</span>
                                <span className="font-bold text-stone-700">Trang 2 / 2</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* 2. TEACHING DOSSIER / PORTFOLIO SƯ PHẠM TỔNG THỂ */}
            {/* ============================================================ */}
            {exportType === 'dossier' && (
                <div className="space-y-8 print:space-y-0">
                    {/* ----------------- DOSSIER PAGE 1 ----------------- */}
                    <div className={`${pageViewMode === 'paged' && currentPage !== 1 ? 'hidden print:flex' : 'flex'} max-w-[794px] w-full min-h-[1080px] mx-auto bg-white border-editorial shadow-editorial p-8 sm:p-12 text-stone-900 relative flex-col justify-between print:min-h-0 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-full print:break-after-page`}>
                        <div className="space-y-6">
                            {/* Dossier Header */}
                            <div className="text-center pb-4 border-b-2 border-stone-800 space-y-1">
                                <div className="text-[11px] font-serif uppercase tracking-widest text-stone-500 font-bold">
                                    BỘ GIÁO DỤC VÀ ĐÀO TẠO • TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight uppercase">
                                    HỒ SƠ NĂNG LỰC SƯ PHẠM TỔNG THỂ (TEACHING DOSSIER)
                                </h2>
                                <p className="text-xs text-stone-600 font-serif italic">
                                    Học viên: <strong>{infoForm.studentName || 'Chưa nhập họ tên'}</strong> • Mã SV: <strong>{infoForm.studentId || 'Chưa nhập MSSV'}</strong> • Lớp: <strong>{infoForm.cohort || 'Chưa nhập lớp'}</strong>
                                </p>
                            </div>

                            {/* Section 1: Thực tập sư phạm summary */}
                            <div className="space-y-3">
                                <h3 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider border-l-4 border-brand-cerulean pl-3">
                                    1. Báo cáo Kết quả Thực tập Sư phạm tại Trường Phổ thông (TTSP)
                                </h3>
                                <div className="p-4 bg-stone-50 border border-stone-200 text-xs font-sans space-y-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div>
                                            <span className="text-stone-500 block">Trường thực tập:</span>
                                            <strong className="font-serif text-stone-800">{schoolName}</strong>
                                        </div>
                                        <div>
                                            <span className="text-stone-500 block">Thời gian thực tập:</span>
                                            <strong className="font-mono text-stone-800">{schoolPeriod}</strong>
                                        </div>
                                        <div>
                                            <span className="text-stone-500 block">Người hướng dẫn:</span>
                                            <strong className="font-serif text-stone-800">{schoolMentor}</strong>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-stone-200 grid grid-cols-4 gap-2 text-center">
                                        <div className="bg-white p-2 border border-stone-200">
                                            <div className="text-[10px] text-stone-500">Giảng dạy (50%)</div>
                                            <div className="font-mono font-bold text-stone-900">{tScore}</div>
                                        </div>
                                        <div className="bg-white p-2 border border-stone-200">
                                            <div className="text-[10px] text-stone-500">Chủ nhiệm (30%)</div>
                                            <div className="font-mono font-bold text-stone-900">{hScore}</div>
                                        </div>
                                        <div className="bg-white p-2 border border-stone-200">
                                            <div className="text-[10px] text-stone-500">Báo cáo TTSP (20%)</div>
                                            <div className="font-mono font-bold text-stone-900">{rScore}</div>
                                        </div>
                                        <div className="bg-brand-cream p-2 border border-brand-cerulean/30">
                                            <div className="text-[10px] text-brand-cerulean font-bold">Tổng kết TTSP</div>
                                            <div className="font-mono font-bold text-brand-jasper text-sm">{totalScore}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Kế hoạch bài dạy & Giảng thử */}
                            <div className="space-y-3">
                                <h3 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider border-l-4 border-brand-cerulean pl-3">
                                    2. Năng lực Soạn KHBD (CV 5555) & Tập giảng Vi Sư phạm
                                </h3>
                                <div className="p-4 bg-stone-50 border border-stone-200 text-xs font-sans space-y-2">
                                    {planCount === 0 ? (
                                        <p className="text-stone-500 italic">
                                            Chưa có Kế hoạch bài dạy nào được lưu trữ trong hệ thống. Vui lòng tạo kế hoạch bài dạy tại tab "Soạn KHBD".
                                        </p>
                                    ) : (
                                        <p className="text-stone-700 leading-relaxed">
                                            Đã hoàn thành biên soạn <strong>{planCount} Kế hoạch bài dạy</strong> chuẩn Công văn 5555 với 4 hoạt động học tập tích cực, được thông qua bởi Giảng viên bộ môn phương pháp.
                                            {microAvg ? (
                                                <> Hoàn thành các phiên tập giảng thử tại phòng Micro-teaching với điểm rèn luyện trung bình <strong>{microAvg}/10</strong>.</>
                                            ) : (
                                                <> Chưa có phiên tập giảng thử micro-teaching nào được ghi nhận.</>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dossier Page 1 Bottom Section & Page Flip Button */}
                        <div className="pt-4 mt-4 border-t border-stone-200 space-y-3 font-serif">
                            <p className="text-[11px] text-stone-500 italic text-center">
                                * Hồ sơ năng lực sư phạm còn tiếp tục. Kết quả đánh giá Chuẩn nghề nghiệp TT 20 và chữ ký tại Trang 2/2.
                            </p>

                            {/* Prominent Page Turn Button (Hidden on print) */}
                            <div className="print:hidden bg-brand-cream/60 border border-brand-cerulean/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <span className="text-xs text-stone-600 font-sans">
                                    Xem tiếp đánh giá 15 tiêu chí và chữ ký thẩm quyền:
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(2);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial transition-all"
                                >
                                    <span>Qua Trang 2 (Chuẩn nghề nghiệp & Chữ ký)</span>
                                    <ChevronRight size={15} />
                                </button>
                            </div>

                            {/* Page 1 Official Footer */}
                            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
                                <span>Hồ sơ năng lực sư phạm Pedagogy</span>
                                <span>Trường ĐH Sư phạm TP.HCM</span>
                                <span className="font-bold text-stone-700">Trang 1 / 2</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Sheet Divider between Page 1 and Page 2 (In continuous view mode) */}
                    {pageViewMode === 'continuous' && (
                        <div className="print:hidden my-8 flex items-center justify-center gap-4">
                            <div className="h-px bg-stone-300 flex-1 max-w-xs" />
                            <div className="px-4 py-1.5 bg-brand-cream border border-brand-cerulean/30 rounded-full font-serif-title text-xs font-bold text-brand-cerulean flex items-center gap-2 shadow-xs">
                                <span>Hết Trang 1</span>
                                <span>•</span>
                                <span>Bắt đầu Trang 2 Khổ A4</span>
                            </div>
                            <div className="h-px bg-stone-300 flex-1 max-w-xs" />
                        </div>
                    )}

                    {/* ----------------- DOSSIER PAGE 2 ----------------- */}
                    <div className={`${pageViewMode === 'paged' && currentPage !== 2 ? 'hidden print:flex' : 'flex'} max-w-[794px] w-full min-h-[1080px] mx-auto bg-white border-editorial shadow-editorial p-8 sm:p-12 text-stone-900 relative flex-col justify-between print:min-h-0 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-full`}>
                        <div className="space-y-6">
                            {/* Page 2 Top Banner */}
                            <div className="pb-3 border-b-2 border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-serif">
                                <div>
                                    <span className="font-bold uppercase text-brand-cerulean block">
                                        TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
                                    </span>
                                    <span className="text-[11px] text-stone-500">
                                        HỒ SƠ NĂNG LỰC SƯ PHẠM TỔNG THỂ • TRANG 2
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-stone-900 block">
                                        Học viên: {infoForm.studentName || '---'}
                                    </span>
                                    <span className="font-mono text-stone-500 text-[11px]">
                                        MSSV: {infoForm.studentId || '---'}
                                    </span>
                                </div>
                            </div>

                            {/* Section 3: Chuẩn nghề nghiệp TT 20 */}
                            <div className="space-y-3">
                                <h3 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider border-l-4 border-brand-cerulean pl-3">
                                    3. Đánh giá Chuẩn Nghề nghiệp Giáo viên (Thông tư 20/2018/TT-BGDĐT)
                                </h3>
                                <div className="p-4 bg-stone-50 border border-stone-200 text-xs font-sans space-y-2">
                                    {totalCriteria === ratedUnrated ? (
                                        <p className="text-stone-500 italic">
                                            Chưa thực hiện tự đánh giá 15 tiêu chí Chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông (Thông tư 20/2018/TT-BGDĐT). Vui lòng hoàn thành tự đánh giá tại mục "Chuẩn nghề nghiệp".
                                        </p>
                                    ) : (
                                        <p className="text-stone-700 leading-relaxed">
                                            Kết quả tự đánh giá và thẩm định: Đạt <strong>{ratedGood}/15</strong> tiêu chí loại Tốt, <strong>{ratedFair}/15</strong> tiêu chí loại Khá, <strong>{ratedPass}/15</strong> tiêu chí loại Đạt{ratedFail > 0 ? `, ${ratedFail}/15 tiêu chí Chưa đạt` : ''}{ratedUnrated > 0 ? ` (${ratedUnrated} tiêu chí chưa đánh giá)` : ''}. Có hồ sơ minh chứng về đạo đức nghề nghiệp, đổi mới phương pháp giảng dạy, chuyển đổi số giáo dục và phối hợp giáo dục học sinh.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Section 4: Cam kết rèn luyện */}
                            <div className="space-y-2">
                                <h3 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider border-l-4 border-brand-cerulean pl-3">
                                    4. Cam Kết Rèn Luyện & Đạo Đức Nghề Nghiệp Nhà Giáo
                                </h3>
                                <div className="p-4 bg-stone-50 border border-stone-200 text-xs font-serif leading-relaxed text-stone-700">
                                    Tôi xin cam đoan toàn bộ các số liệu học tập, giáo án bài dạy, biên bản dự giờ thực tập và minh chứng năng lực nghề nghiệp nêu trên là hoàn toàn chính xác, trung thực và phản ánh đúng quá trình rèn luyện sư phạm của bản thân.
                                </div>
                            </div>

                            {/* Certification sign off */}
                            {includeSignatures && (
                                <div className="grid grid-cols-2 gap-8 pt-8 text-xs font-serif">
                                    <div className="text-center space-y-1">
                                        <div className="font-bold uppercase text-stone-800">HỌC VIÊN SƯ PHẠM</div>
                                        <div className="text-stone-400 italic text-[11px] pt-14">
                                            (Ký và ghi rõ họ tên)
                                        </div>
                                        <div className="font-bold text-stone-800 pt-2">
                                            {infoForm.studentName || <span className="text-stone-400 italic font-normal">Học viên</span>}
                                        </div>
                                    </div>

                                    <div className="text-center space-y-1">
                                        <div className="italic text-stone-600">
                                            {infoForm.pob ? `${infoForm.pob}, ` : 'TP. Hồ Chí Minh, '}ngày ..... tháng ..... năm 2026
                                        </div>
                                        <div className="font-bold uppercase text-stone-900">BAN CHỈ ĐẠO ĐÀO TẠO SƯ PHẠM</div>
                                        <div className="text-stone-400 italic text-[11px] pt-14">
                                            (Ký tên và xác nhận)
                                        </div>
                                        <div className="font-bold text-stone-900 pt-2">
                                            {infoForm.dean || <span className="text-stone-400 italic font-normal">Trưởng ban</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dossier Page 2 Bottom Section & Return Button */}
                        <div className="pt-4 mt-4 border-t border-stone-200 space-y-3 font-serif">
                            {/* Page Return Navigation (Hidden on print) */}
                            <div className="print:hidden bg-stone-50 border border-stone-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(1);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 text-stone-800 font-serif-title font-bold text-xs hover:bg-stone-100 transition-all shadow-2xs"
                                >
                                    <ChevronLeft size={15} />
                                    <span>Quay lại Trang 1 (TTSP & Giáo án)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial transition-all"
                                >
                                    <Printer size={15} />
                                    <span>In Toàn Bộ Hồ Sơ A4</span>
                                </button>
                            </div>

                            {/* Page 2 Official Footer */}
                            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
                                <span>* Hồ sơ sư phạm lưu chiểu phục vụ công tác thanh tra và tuyển dụng giáo viên.</span>
                                <span>Hệ thống Pedagogy</span>
                                <span className="font-bold text-stone-700">Trang 2 / 2</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: SỬA THÔNG TIN BẢN IN */}
            <Modal
                isOpen={isEditInfoModalOpen}
                onClose={() => setIsEditInfoModalOpen(false)}
                title="Chỉnh Sửa Thông Tin Học Viên & Bản In Bảng Điểm"
            >
                <form onSubmit={(e) => { e.preventDefault(); setIsEditInfoModalOpen(false); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Họ và tên học viên
                            </label>
                            <input
                                type="text"
                                value={infoForm.studentName}
                                onChange={(e) => setInfoForm({ ...infoForm, studentName: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs font-serif font-bold"
                                placeholder="Nhập họ và tên..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Mã số học viên
                            </label>
                            <input
                                type="text"
                                value={infoForm.studentId}
                                onChange={(e) => setInfoForm({ ...infoForm, studentId: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs font-mono"
                                placeholder="Nhập MSSV..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Ngày sinh
                            </label>
                            <input
                                type="text"
                                value={infoForm.dob}
                                onChange={(e) => setInfoForm({ ...infoForm, dob: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                                placeholder="DD/MM/YYYY"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Nơi sinh
                            </label>
                            <input
                                type="text"
                                value={infoForm.pob}
                                onChange={(e) => setInfoForm({ ...infoForm, pob: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                                placeholder="Tỉnh / Thành phố..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Khóa đào tạo
                            </label>
                            <input
                                type="text"
                                value={infoForm.cohort}
                                onChange={(e) => setInfoForm({ ...infoForm, cohort: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                                placeholder="VD: K15 - Năm 2026..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Hệ đào tạo
                            </label>
                            <input
                                type="text"
                                value={infoForm.trainingMode}
                                onChange={(e) => setInfoForm({ ...infoForm, trainingMode: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                                placeholder="VD: Tập trung / Vừa làm vừa học..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Người lập bảng điểm
                            </label>
                            <input
                                type="text"
                                value={infoForm.registrar}
                                onChange={(e) => setInfoForm({ ...infoForm, registrar: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                                placeholder="Họ tên người lập..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Trưởng phòng đào tạo
                            </label>
                            <input
                                type="text"
                                value={infoForm.dean}
                                onChange={(e) => setInfoForm({ ...infoForm, dean: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                                placeholder="Họ tên trưởng phòng..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                        <button
                            type="button"
                            onClick={() => setIsEditInfoModalOpen(false)}
                            className="px-4 py-2 border border-stone-300 text-xs font-serif font-bold text-stone-700 hover:bg-stone-50"
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white text-xs font-serif font-bold hover:bg-brand-cerulean/90 shadow-sm"
                        >
                            Lưu Thông Tin Bản In
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
