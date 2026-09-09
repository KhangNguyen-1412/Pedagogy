import React, { useState, useEffect } from 'react';
import {
    School,
    Calendar,
    MapPin,
    User,
    Plus,
    Pencil,
    Trash2,
    Award,
    FileText,
    CheckCircle2,
    ClipboardCheck,
    Users,
    Sparkles,
    Clock,
    BookOpen,
    AlertCircle,
    CheckSquare
} from 'lucide-react';
import { EditorialSelect, EditorialDatePicker, Modal } from '../../components/common/EditorialWidgets';
import { initialPracticumData } from '../../data/trainingData';

export const PracticumView = () => {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'observation' | 'homeroom' | 'evaluation'
    const [practicumData, setPracticumData] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_practicum_data');
            if (saved) try { return JSON.parse(saved); } catch (e) {}
        }
        return initialPracticumData;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_practicum_data', JSON.stringify(practicumData));
        }
    }, [practicumData]);

    const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
    const [editingObsId, setEditingObsId] = useState(null);

    // Modal states for School info, Homeroom, and Scores
    const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
    const [schoolForm, setSchoolForm] = useState({
        name: practicumData.school?.name || '',
        address: practicumData.school?.address || '',
        period: practicumData.school?.period || '',
        principal: practicumData.school?.principal || '',
        headTeacher: practicumData.school?.headTeacher || '',
        homeroomAdvisor: practicumData.school?.homeroomAdvisor || '',
        teachingClass: practicumData.assignment?.teachingClass || '',
        homeroomClass: practicumData.assignment?.homeroomClass || '',
        studentCount: practicumData.assignment?.studentCount || 35
    });

    const [isHomeroomModalOpen, setIsHomeroomModalOpen] = useState(false);
    const [homeroomForm, setHomeroomForm] = useState({
        date: new Date().toISOString().split('T')[0],
        title: '',
        content: '',
        issuesResolved: '',
        advisorFeedback: ''
    });

    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
    const [scoreForm, setScoreForm] = useState({
        teachingScore: practicumData.finalEvaluation?.teachingScore || 9.5,
        homeroomScore: practicumData.finalEvaluation?.homeroomScore || 9.0,
        reportScore: practicumData.finalEvaluation?.reportScore || 9.0
    });

    const [obsForm, setObsForm] = useState({
        date: new Date().toISOString().split('T')[0],
        period: 'Tiết 2',
        subject: 'Toán học 10',
        lessonTitle: '',
        teacher: '',
        className: 'Lớp 10 Chuyên Toán 1',
        lessonPlanRating: 9.0,
        teacherActivitiesRating: 9.0,
        studentActivitiesRating: 9.0,
        feedbackStrengths: '',
        feedbackWeaknesses: '',
        notes: ''
    });

    const handleOpenAddObs = () => {
        setEditingObsId(null);
        setObsForm({
            date: new Date().toISOString().split('T')[0],
            period: 'Tiết 2',
            subject: 'Toán học 10',
            lessonTitle: '',
            teacher: practicumData.school.headTeacher,
            className: practicumData.assignment.teachingClass,
            lessonPlanRating: 9.0,
            teacherActivitiesRating: 9.0,
            studentActivitiesRating: 9.0,
            feedbackStrengths: '',
            feedbackWeaknesses: '',
            notes: ''
        });
        setIsObservationModalOpen(true);
    };

    const handleOpenEditObs = (obs) => {
        setEditingObsId(obs.id);
        setObsForm({ ...obs });
        setIsObservationModalOpen(true);
    };

    const handleSaveObs = (e) => {
        e.preventDefault();
        const total = (
            Number(obsForm.lessonPlanRating || 0) +
            Number(obsForm.teacherActivitiesRating || 0) +
            Number(obsForm.studentActivitiesRating || 0)
        ) / 3 * 2; // Quy đổi thang điểm 20

        if (editingObsId) {
            setPracticumData(prev => ({
                ...prev,
                observationLogs: prev.observationLogs.map(item =>
                    item.id === editingObsId ? { ...obsForm, id: editingObsId, totalScore: parseFloat(total.toFixed(1)) } : item
                )
            }));
        } else {
            const newObs = {
                ...obsForm,
                id: 'obs_' + Date.now(),
                totalScore: parseFloat(total.toFixed(1))
            };
            setPracticumData(prev => ({
                ...prev,
                observationLogs: [newObs, ...prev.observationLogs]
            }));
        }
        setIsObservationModalOpen(false);
    };

    const handleDeleteObs = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa biên bản dự giờ này?')) {
            setPracticumData(prev => ({
                ...prev,
                observationLogs: prev.observationLogs.filter(item => item.id !== id)
            }));
        }
    };

    // Save School & Assignment
    const handleSaveSchool = (e) => {
        e.preventDefault();
        setPracticumData(prev => ({
            ...prev,
            school: {
                ...prev.school,
                name: schoolForm.name,
                address: schoolForm.address,
                period: schoolForm.period,
                principal: schoolForm.principal,
                headTeacher: schoolForm.headTeacher,
                homeroomAdvisor: schoolForm.homeroomAdvisor
            },
            assignment: {
                ...prev.assignment,
                teachingClass: schoolForm.teachingClass,
                homeroomClass: schoolForm.homeroomClass,
                studentCount: Number(schoolForm.studentCount) || 35
            }
        }));
        setIsSchoolModalOpen(false);
    };

    // Save Homeroom Log
    const handleSaveHomeroom = (e) => {
        e.preventDefault();
        const newLog = {
            id: 'hr_' + Date.now(),
            ...homeroomForm
        };
        setPracticumData(prev => ({
            ...prev,
            homeroomLogs: [newLog, ...(prev.homeroomLogs || [])]
        }));
        setIsHomeroomModalOpen(false);
        setHomeroomForm({
            date: new Date().toISOString().split('T')[0],
            title: '',
            content: '',
            issuesResolved: '',
            advisorFeedback: ''
        });
    };

    // Save Evaluation Scores
    const handleSaveScores = (e) => {
        e.preventDefault();
        const t = Number(scoreForm.teachingScore) || 0;
        const h = Number(scoreForm.homeroomScore) || 0;
        const r = Number(scoreForm.reportScore) || 0;
        const total = parseFloat((t * 0.5 + h * 0.3 + r * 0.2).toFixed(2));
        setPracticumData(prev => ({
            ...prev,
            finalEvaluation: {
                ...prev.finalEvaluation,
                teachingScore: t,
                homeroomScore: h,
                reportScore: r,
                totalScore: total
            }
        }));
        setIsScoreModalOpen(false);
    };

    const handleResetToBlank = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dữ liệu thực tập và nhập lại từ đầu?')) {
            setPracticumData(initialPracticumData);
            if (typeof window !== 'undefined') {
                localStorage.setItem('pedagogy_practicum_data', JSON.stringify(initialPracticumData));
            }
        }
    };

    const overallPracticumScore = practicumData.finalEvaluation?.totalScore ?? practicumData.finalEvaluation?.overallScore ?? '---';
    const obsLogsCount = practicumData.observationLogs?.length || 0;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Sticky Editorial Header */}
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean text-xs font-serif-title font-bold uppercase tracking-wider mb-2">
                        <School className="w-3.5 h-3.5 text-brand-cerulean" />
                        Hồ sơ Thực địa Sư phạm • Trường THPT Liên kết
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-serif-title text-brand-cerulean tracking-tight">
                        Thực tập & Kiến tập Sư phạm
                    </h1>
                    <p className="text-sm font-sans text-stone-600 mt-2 max-w-3xl">
                        Hồ sơ trường phổ thông tiếp nhận, sổ dự giờ theo Công văn 5555, công tác chủ nhiệm & đánh giá đợt TTSP.
                    </p>
                </div>

                {/* Stat Counters & Reset */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-6 bg-white border border-stone-200 px-4 py-2 shadow-xs">
                        <div className="text-right">
                            <div className="text-[10px] font-serif-title uppercase tracking-wider text-stone-500">Điểm Tổng TTSP</div>
                            <div className="text-3xl font-serif-title font-bold text-brand-jasper leading-none mt-1">
                                {overallPracticumScore}<span className="text-stone-400 text-lg">/10</span>
                            </div>
                        </div>
                        <div className="border-l border-stone-200 pl-4 text-left">
                            <div className="text-[10px] font-serif-title uppercase tracking-wider text-stone-500">Tiết Dự giờ</div>
                            <div className="text-3xl font-serif-title font-bold text-brand-cerulean leading-none mt-1">
                                {obsLogsCount}<span className="text-stone-400 text-lg"> tiết</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleResetToBlank}
                        className="px-3 py-2 bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-200 text-xs font-serif-title font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                        title="Xóa dữ liệu mẫu và nhập mới từ đầu"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa mẫu
                    </button>
                </div>
            </header>

            {/* Segmented Pill Tab Switcher */}
            <div className="inline-flex p-1 bg-brand-cream border border-brand-cerulean/30 rounded shadow-xs flex-wrap gap-1">
                {[
                    { id: 'overview', label: 'Tổng quan đợt TTSP', icon: School },
                    { id: 'observation', label: `Sổ dự giờ (${obsLogsCount})`, icon: ClipboardCheck },
                    { id: 'homeroom', label: 'Công tác chủ nhiệm', icon: Users },
                    { id: 'evaluation', label: 'Đánh giá & Bảng điểm', icon: Award }
                ].map(tab => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-serif-title text-xs font-bold rounded transition-all flex items-center gap-2 whitespace-nowrap ${
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

            {/* TAB 1: TỔNG QUAN ĐỢT THỰC TẬP */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Trường Tiếp Nhận Banner */}
                    <div className="bg-white border-editorial shadow-editorial p-6 border-l-4 border-l-brand-cerulean space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
                            <div>
                                <span className="px-2 py-0.5 text-xs font-bold bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 rounded-xs uppercase tracking-wider">
                                    Đơn vị Tiếp nhận Thực tập Sư phạm
                                </span>
                                <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1.5">
                                    {practicumData.school?.name || "Chưa thiết lập trường thực tập"}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                    <MapPin size={13} className="text-brand-jasper shrink-0" />
                                    <span>{practicumData.school?.address || "Chưa cập nhật địa chỉ trường"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-cream p-3 border border-brand-cerulean/20 text-right min-w-[180px]">
                                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Thời gian đợt TTSP</span>
                                    <span className="text-sm font-bold text-brand-cerulean font-serif-title">
                                        {practicumData.school?.period || "Chưa thiết lập"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSchoolForm({
                                            name: practicumData.school?.name || '',
                                            address: practicumData.school?.address || '',
                                            period: practicumData.school?.period || '',
                                            principal: practicumData.school?.principal || '',
                                            headTeacher: practicumData.school?.headTeacher || '',
                                            homeroomAdvisor: practicumData.school?.homeroomAdvisor || '',
                                            teachingClass: practicumData.assignment?.teachingClass || '',
                                            homeroomClass: practicumData.assignment?.homeroomClass || '',
                                            studentCount: practicumData.assignment?.studentCount || 0
                                        });
                                        setIsSchoolModalOpen(true);
                                    }}
                                    className="px-3 py-2 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 flex items-center gap-1.5 shadow-xs shrink-0"
                                >
                                    <Pencil size={13} /> Sửa Phân Công
                                </button>
                            </div>
                        </div>

                        {/* Ban chỉ đạo & Hướng dẫn */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                            <div className="p-3 bg-brand-cream/50 border border-gray-200 rounded-sm space-y-1">
                                <span className="text-gray-500 font-serif-title uppercase tracking-wider block text-[10px]">Hiệu trưởng nhà trường</span>
                                <p className="font-bold text-brand-cerulean text-sm flex items-center gap-1.5">
                                    <User size={14} className="text-brand-cerulean" /> {practicumData.school?.principal || "Chưa cập nhật"}
                                </p>
                                <span className="text-[11px] text-gray-500 block">Trưởng Ban chỉ đạo thực tập tại trường</span>
                            </div>

                            <div className="p-3 bg-brand-cream/50 border border-brand-cerulean/30 rounded-sm space-y-1">
                                <span className="text-brand-cerulean font-serif-title uppercase tracking-wider block text-[10px] font-bold">GV Hướng dẫn Chuyên môn</span>
                                <p className="font-bold text-brand-cerulean text-sm flex items-center gap-1.5">
                                    <User size={14} className="text-brand-cerulean" /> {practicumData.school?.headTeacher || "Chưa phân công"}
                                </p>
                                <span className="text-[11px] text-gray-600 block">Hướng dẫn soạn giáo án, dự giờ & chấm tiết dạy</span>
                            </div>

                            <div className="p-3 bg-brand-cream/50 border border-brand-jasper/30 rounded-sm space-y-1">
                                <span className="text-brand-jasper font-serif-title uppercase tracking-wider block text-[10px] font-bold">GV Hướng dẫn Chủ nhiệm</span>
                                <p className="font-bold text-brand-jasper text-sm flex items-center gap-1.5">
                                    <User size={14} className="text-brand-jasper" /> {practicumData.school?.homeroomAdvisor || "Chưa phân công"}
                                </p>
                                <span className="text-[11px] text-gray-600 block">Hướng dẫn quản lý lớp, tổ chức sinh hoạt & HĐ trải nghiệm</span>
                            </div>
                        </div>
                    </div>

                    {/* Phân công lớp & Lịch trình */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border-editorial shadow-editorial p-6 space-y-4">
                            <h4 className="font-serif-title text-xl font-bold text-brand-cerulean flex items-center gap-2 border-b pb-2">
                                <BookOpen size={18} className="text-brand-cerulean" /> Lớp & Môn học Phân công
                            </h4>
                            <div className="space-y-3 text-sm font-sans">
                                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Lớp giảng dạy chính:</span>
                                    <span className="font-bold text-brand-cerulean">
                                        {practicumData.assignment?.teachingClass ? `${practicumData.assignment.teachingClass} (${practicumData.assignment.studentCount || 0} học sinh)` : "Chưa phân công"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Lớp thực tập chủ nhiệm:</span>
                                    <span className="font-bold text-brand-jasper">{practicumData.assignment?.homeroomClass || "Chưa phân công"}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Môn học phụ trách:</span>
                                    <span className="font-bold text-brand-cerulean">{practicumData.assignment?.subject || "Chưa phân công"}</span>
                                </div>
                                <div className="flex justify-between items-start py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500 shrink-0 mr-2">Thời khóa biểu TTSP:</span>
                                    <span className="font-mono text-xs text-right text-gray-800">{practicumData.assignment?.schedule || "Chưa xếp lịch"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-editorial shadow-editorial p-6 space-y-4">
                            <h4 className="font-serif-title text-xl font-bold text-brand-cerulean flex items-center gap-2 border-b pb-2">
                                <Calendar size={18} className="text-brand-cerulean" /> Lộ trình 8 Tuần Thực tập
                            </h4>
                            <div className="space-y-2 text-xs font-sans">
                                <div className="p-2.5 bg-brand-cream border-l-2 border-brand-cerulean">
                                    <span className="font-bold text-brand-cerulean font-serif-title block">Tuần 1 (02/03 – 08/03): Nhận trường & Tiếp cận thực tế</span>
                                    <p className="text-gray-600 mt-0.5">Gặp Ban Giám hiệu, nghe báo cáo tình hình giáo dục địa phương, nhận lớp và ra mắt học sinh.</p>
                                </div>
                                <div className="p-2.5 bg-brand-cream border-l-2 border-brand-cerulean">
                                    <span className="font-bold text-brand-cerulean font-serif-title block">Tuần 2 – Tuần 4 (09/03 – 29/03): Dự giờ & Tập giảng</span>
                                    <p className="text-gray-600 mt-0.5">Dự giờ tiết mẫu của GVHDCM (tối thiểu 6 tiết), soạn giáo án 5555 và tập giảng thử tại tổ chuyên môn.</p>
                                </div>
                                <div className="p-2.5 bg-brand-cream border-l-2 border-brand-jasper">
                                    <span className="font-bold text-brand-jasper font-serif-title block">Tuần 5 – Tuần 7 (30/03 – 19/04): Giảng dạy chính thức & Chủ nhiệm</span>
                                    <p className="text-gray-600 mt-0.5">Đứng lớp trực tiếp (tối thiểu 4 tiết có chấm điểm), điều hành các buổi sinh hoạt lớp và trải nghiệm.</p>
                                </div>
                                <div className="p-2.5 bg-brand-cream border-l-2 border-brand-cerulean">
                                    <span className="font-bold text-brand-cerulean font-serif-title block">Tuần 8 (20/04 – 26/04): Tổng kết & Báo cáo thu hoạch</span>
                                    <p className="text-gray-600 mt-0.5">Lập hồ sơ thực tập, họp hội đồng đánh giá cho điểm, chia tay trường và học sinh.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SỔ DỰ GIỜ ĐIỆN TỬ THEO CÔNG VĂN 5555 */}
            {activeTab === 'observation' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-editorial p-4 shadow-editorial">
                        <div>
                            <h3 className="text-xl font-serif-title text-brand-cerulean font-bold">
                                Sổ Dự giờ Điện tử (Chuẩn Công văn 5555/BGDĐT)
                            </h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Ghi chép phân tích bài học theo 3 tiêu chí: Kế hoạch bài dạy, Hoạt động của giáo viên và Hoạt động của học sinh.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleOpenAddObs}
                            className="px-4 py-2 bg-brand-jasper text-white text-xs font-serif-title font-bold shadow-editorial hover:bg-brand-jasper/90 transition-all flex items-center gap-1.5 shrink-0"
                        >
                            <Plus size={16} /> Ghi Biên bản Dự giờ Mới
                        </button>
                    </div>

                    {/* Danh sách biên bản dự giờ */}
                    <div className="space-y-4">
                        {practicumData.observationLogs?.length === 0 ? (
                            <div className="bg-white border-editorial shadow-editorial p-12 text-center space-y-3">
                                <ClipboardCheck className="w-12 h-12 mx-auto text-stone-300" />
                                <h4 className="text-lg font-serif-title font-bold text-stone-700">Chưa có biên bản dự giờ nào</h4>
                                <p className="text-xs text-stone-500 max-w-md mx-auto">
                                    Bấm nút "Ghi Biên bản Dự giờ Mới" để ghi chép phân tích tiết học dự giờ của giáo viên hướng dẫn hoặc đồng nghiệp.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleOpenAddObs}
                                    className="px-4 py-2 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 inline-flex items-center gap-1.5 mt-2"
                                >
                                    <Plus size={14} /> Ghi biên bản đầu tiên
                                </button>
                            </div>
                        ) : (
                            practicumData.observationLogs.map(obs => (
                                <div key={obs.id} className="bg-white border-editorial shadow-editorial p-6 space-y-4 border-l-4 border-l-brand-cerulean">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2 py-0.5 text-xs font-bold font-mono bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 rounded-xs">
                                                    {obs.date} &bull; {obs.period}
                                                </span>
                                                <span className="px-2 py-0.5 text-xs font-bold font-serif-title bg-brand-cream text-brand-jasper border border-brand-jasper/30 rounded-xs">
                                                    {obs.className}
                                                </span>
                                                <span className="text-xs text-gray-500 font-sans font-semibold">
                                                    Môn: {obs.subject}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-serif-title font-bold text-brand-cerulean mt-1.5">
                                                {obs.lessonTitle}
                                            </h4>
                                            <p className="text-xs text-gray-600 font-sans mt-0.5">
                                                Giáo viên đứng lớp: <strong>{obs.teacher}</strong>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="bg-brand-cream p-2.5 border border-brand-cerulean/30 text-center min-w-[100px]">
                                                <span className="text-[10px] text-gray-500 block uppercase font-mono">Điểm Đánh giá</span>
                                                <span className="text-2xl font-serif-title font-bold text-brand-jasper">
                                                    {obs.totalScore} <span className="text-xs text-gray-400 font-normal">/20</span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditObs(obs)}
                                                    className="p-1.5 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 rounded-xs"
                                                    title="Sửa biên bản"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteObs(obs.id)}
                                                    className="p-1.5 text-gray-400 hover:text-brand-jasper hover:bg-brand-cream rounded-xs"
                                                    title="Xóa biên bản"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3 Tiêu chí Công văn 5555 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                        <div className="p-2.5 bg-brand-cream/40 border border-gray-200 rounded-xs">
                                            <span className="text-gray-500 font-serif-title block text-[10px]">1. Kế hoạch & Hồ sơ dạy học</span>
                                            <span className="font-bold text-brand-cerulean text-sm">{obs.lessonPlanRating} / 10</span>
                                        </div>
                                        <div className="p-2.5 bg-brand-cream/40 border border-gray-200 rounded-xs">
                                            <span className="text-gray-500 font-serif-title block text-[10px]">2. Hoạt động của Giáo viên</span>
                                            <span className="font-bold text-brand-cerulean text-sm">{obs.teacherActivitiesRating} / 10</span>
                                        </div>
                                        <div className="p-2.5 bg-brand-cream/40 border border-gray-200 rounded-xs">
                                            <span className="text-gray-500 font-serif-title block text-[10px]">3. Hoạt động của Học sinh</span>
                                            <span className="font-bold text-brand-cerulean text-sm">{obs.studentActivitiesRating} / 10</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs font-sans">
                                        <div className="p-2.5 bg-brand-cream text-brand-cerulean border-l-2 border-brand-cerulean">
                                            <strong>Ưu điểm nổi bật:</strong> {obs.feedbackStrengths}
                                        </div>
                                        {obs.feedbackWeaknesses && (
                                            <div className="p-2.5 bg-brand-cream text-brand-jasper border-l-2 border-brand-jasper">
                                                <strong>Góp ý & Tồn tại:</strong> {obs.feedbackWeaknesses}
                                            </div>
                                        )}
                                        {obs.notes && (
                                            <p className="text-gray-500 italic text-[11px]">
                                                Bài học rút ra: {obs.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: CÔNG TÁC CHỦ NHIỆM LỚP */}
            {activeTab === 'homeroom' && (
                <div className="space-y-6">
                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <div>
                                <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">
                                    Nhật ký Thực tập Công tác Chủ nhiệm
                                </h3>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    Quản lý nề nếp lớp học, giáo dục tư tưởng, giải quyết tình huống sư phạm và hoạt động trải nghiệm.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-brand-cream text-brand-jasper border border-brand-jasper/30 text-xs font-serif-title font-bold rounded-xs">
                                    {practicumData.assignment?.homeroomClass ? `Lớp ${practicumData.assignment.homeroomClass}` : "Chưa phân công lớp"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsHomeroomModalOpen(true)}
                                    className="px-3 py-1.5 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 flex items-center gap-1.5 shadow-xs"
                                >
                                    <Plus size={14} /> Ghi Nhật Ký Mới
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {practicumData.homeroomLogs?.length === 0 ? (
                                <div className="p-12 text-center border border-dashed border-stone-300 bg-white space-y-3">
                                    <Users className="w-12 h-12 mx-auto text-stone-300" />
                                    <h4 className="text-base font-serif-title font-bold text-stone-700">Chưa có nhật ký chủ nhiệm nào</h4>
                                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                                        Ghi nhận các hoạt động sinh hoạt lớp, quản lý nền nếp học sinh và tổ chức hoạt động trải nghiệm.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsHomeroomModalOpen(true)}
                                        className="px-4 py-2 bg-brand-jasper text-white text-xs font-serif-title font-bold hover:bg-brand-jasper/90 inline-flex items-center gap-1.5"
                                    >
                                        <Plus size={14} /> Ghi nhật ký đầu tiên
                                    </button>
                                </div>
                            ) : (
                                practicumData.homeroomLogs.map(log => (
                                    <div key={log.id} className="p-4 bg-brand-cream/30 border border-brand-cerulean/20 rounded-sm space-y-2.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono font-bold text-gray-500">{log.date}</span>
                                            <span className="text-[10px] uppercase font-bold text-brand-cerulean px-2 py-0.5 bg-white border border-brand-cerulean/20 rounded-xs">
                                                Hoạt động chủ nhiệm
                                            </span>
                                        </div>
                                        <h4 className="font-serif-title text-lg font-bold text-brand-cerulean">
                                            {log.title}
                                        </h4>
                                        <p className="text-xs text-gray-700 font-sans leading-relaxed">
                                            {log.content}
                                        </p>
                                        {log.issuesResolved && (
                                            <div className="p-2.5 bg-white border border-brand-cerulean/20 text-xs font-sans text-brand-cerulean rounded-xs">
                                                <strong>Tình huống sư phạm đã xử lý:</strong> {log.issuesResolved}
                                            </div>
                                        )}
                                        {log.advisorFeedback && (
                                            <p className="text-xs text-brand-jasper font-sans italic">
                                                Nhận xét của GVHDCN: {log.advisorFeedback}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: ĐÁNH GIÁ & BẢNG ĐIỂM TTSP */}
            {activeTab === 'evaluation' && (
                <div className="space-y-6">
                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-6">
                        <div className="border-b pb-4">
                            <span className="text-xs font-serif-title uppercase tracking-widest text-brand-jasper font-bold">
                                Kết Quả Thực Tập Sư Phạm Cuối Khóa
                            </span>
                            <div className="flex justify-between items-center mt-1">
                                <h3 className="text-3xl font-serif-title text-brand-cerulean font-bold">
                                    Bảng Điểm & Đánh Giá Toàn Diện Đợt Thực Tập
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setScoreForm({
                                            teachingScore: practicumData.finalEvaluation?.teachingScore || 0,
                                            homeroomScore: practicumData.finalEvaluation?.homeroomScore || 0,
                                            reportScore: practicumData.finalEvaluation?.reportScore || 0
                                        });
                                        setIsScoreModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 bg-brand-jasper text-white text-xs font-serif-title font-bold hover:bg-brand-jasper/90 flex items-center gap-1.5 shadow-xs shrink-0"
                                >
                                    <Pencil size={13} /> Cập Nhật Điểm
                                </button>
                            </div>
                        </div>

                        {/* Điểm tổng kết */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-brand-cream border border-brand-cerulean/30">
                                <span className="text-xs text-gray-500 uppercase font-mono block">1. Thực tập Giảng dạy (50%)</span>
                                <span className="text-3xl font-serif-title font-bold text-brand-cerulean mt-1 block">
                                    {practicumData.finalEvaluation?.teachingScore || 0}
                                </span>
                            </div>

                            <div className="p-4 bg-brand-cream border border-brand-jasper/30">
                                <span className="text-xs text-gray-500 uppercase font-mono block">2. Thực tập Chủ nhiệm (30%)</span>
                                <span className="text-3xl font-serif-title font-bold text-brand-jasper mt-1 block">
                                    {practicumData.finalEvaluation?.homeroomScore || 0}
                                </span>
                            </div>

                            <div className="p-4 bg-brand-cream border border-brand-cerulean/30">
                                <span className="text-xs text-gray-500 uppercase font-mono block">3. Báo cáo & Kỷ luật (20%)</span>
                                <span className="text-3xl font-serif-title font-bold text-brand-cerulean mt-1 block">
                                    {practicumData.finalEvaluation?.reportScore || 0}
                                </span>
                            </div>

                            <div className="p-4 bg-brand-cerulean text-white border-2 border-brand-cerulean shadow-editorial">
                                <span className="text-xs text-white/80 uppercase font-mono block">Tổng Kết Thực Tập</span>
                                <span className="text-3xl font-serif-title font-bold mt-1 block">
                                    {practicumData.finalEvaluation?.overallScore || 0}
                                </span>
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-xs mt-1 inline-block font-serif-title font-bold uppercase">
                                    Xếp loại: {practicumData.finalEvaluation?.rank || "Chưa xếp loại"}
                                </span>
                            </div>
                        </div>

                        {/* Nhận xét của ban chỉ đạo thực tập */}
                        <div className="p-5 bg-brand-cream border-2 border-brand-cerulean/40 rounded-sm space-y-2 text-xs font-sans">
                            <span className="font-serif-title font-bold text-sm text-brand-cerulean flex items-center gap-1.5">
                                <CheckCircle2 size={16} className="text-brand-cerulean" />
                                Nhận xét Tổng thể của Ban Chỉ đạo Thực tập Sư phạm
                            </span>
                            <p className="text-gray-700 text-sm leading-relaxed italic">
                                "{practicumData.finalEvaluation?.advisorSummary || 'Chưa có nhận xét tổng thể từ Ban chỉ đạo thực tập sư phạm. Nhấn Cập Nhật Điểm để nhập điểm và nhận xét.'}"
                            </p>
                            <div className="pt-2 flex justify-between items-center text-gray-500 border-t border-brand-cerulean/20 text-[11px]">
                                <span>Trưởng đoàn TTSP: <strong>{practicumData.school?.delegationLeader || 'Chưa phân công'}</strong></span>
                                <span>Hiệu trưởng: <strong>{practicumData.school?.principal || 'Chưa phân công'}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: THÊM / SỬA BIÊN BẢN DỰ GIỜ */}
            <Modal
                isOpen={isObservationModalOpen}
                onClose={() => setIsObservationModalOpen(false)}
                title={editingObsId ? "Chỉnh sửa Biên bản Dự giờ" : "Ghi Biên bản Dự giờ Tiết học (Công văn 5555)"}
            >
                <form onSubmit={handleSaveObs} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-serif-title text-brand-cerulean mb-1 font-bold">Ngày dự giờ</label>
                            <EditorialDatePicker
                                value={obsForm.date}
                                onChange={val => setObsForm({ ...obsForm, date: val })}
                            />
                        </div>
                        <div>
                            <label className="block font-serif-title text-brand-cerulean mb-1 font-bold">Tiết học</label>
                            <input
                                type="text"
                                className="input-editorial w-full text-xs"
                                value={obsForm.period}
                                onChange={e => setObsForm({ ...obsForm, period: e.target.value })}
                                placeholder="VD: Tiết 2, Tiết 4"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-serif-title text-brand-cerulean mb-1 font-bold">Môn học</label>
                            <input
                                type="text"
                                className="input-editorial w-full text-xs"
                                value={obsForm.subject}
                                onChange={e => setObsForm({ ...obsForm, subject: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-serif-title text-brand-cerulean mb-1 font-bold">Lớp học</label>
                            <input
                                type="text"
                                className="input-editorial w-full text-xs"
                                value={obsForm.className}
                                onChange={e => setObsForm({ ...obsForm, className: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-serif-title text-brand-cerulean mb-1 font-bold">Tên bài học / Tiết dạy</label>
                        <input
                            type="text"
                            className="input-editorial w-full text-xs"
                            value={obsForm.lessonTitle}
                            onChange={e => setObsForm({ ...obsForm, lessonTitle: e.target.value })}
                            placeholder="VD: Bài 3: Dấu của tam thức bậc hai"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-serif-title text-brand-cerulean mb-1 font-bold">Giáo viên đứng lớp</label>
                        <input
                            type="text"
                            className="input-editorial w-full text-xs"
                            value={obsForm.teacher}
                            onChange={e => setObsForm({ ...obsForm, teacher: e.target.value })}
                            required
                        />
                    </div>

                    {/* Điểm 3 tiêu chí theo Công văn 5555 */}
                    <div className="p-3 bg-brand-cream border border-brand-cerulean/30 space-y-2 rounded-xs">
                        <label className="font-serif-title font-bold text-brand-cerulean block">
                            Đánh giá theo 3 tiêu chí Công văn 5555/BGDĐT (Thang điểm 10):
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <span className="text-[10px] text-gray-600 block truncate">1. Kế hoạch bài dạy</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    className="input-editorial w-full text-center text-xs"
                                    value={obsForm.lessonPlanRating}
                                    onChange={e => setObsForm({ ...obsForm, lessonPlanRating: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-600 block truncate">2. HĐ của Giáo viên</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    className="input-editorial w-full text-center text-xs"
                                    value={obsForm.teacherActivitiesRating}
                                    onChange={e => setObsForm({ ...obsForm, teacherActivitiesRating: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-600 block truncate">3. HĐ của Học sinh</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    className="input-editorial w-full text-center text-xs"
                                    value={obsForm.studentActivitiesRating}
                                    onChange={e => setObsForm({ ...obsForm, studentActivitiesRating: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block font-serif-title text-brand-cerulean mb-1 font-bold">Ưu điểm nổi bật của tiết dạy</label>
                        <textarea
                            rows={2}
                            className="input-editorial w-full text-xs"
                            value={obsForm.feedbackStrengths}
                            onChange={e => setObsForm({ ...obsForm, feedbackStrengths: e.target.value })}
                            placeholder="Kỹ năng gợi mở, sử dụng thiết bị, tương tác nhóm..."
                        />
                    </div>

                    <div>
                        <label className="block font-serif-title text-brand-jasper mb-1 font-bold">Góp ý điều chỉnh / Tồn tại cần khắc phục</label>
                        <textarea
                            rows={2}
                            className="input-editorial w-full text-xs"
                            value={obsForm.feedbackWeaknesses}
                            onChange={e => setObsForm({ ...obsForm, feedbackWeaknesses: e.target.value })}
                            placeholder="Phân bố thời gian, kỹ năng bao quát lớp..."
                        />
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t">
                        <button
                            type="button"
                            onClick={() => setIsObservationModalOpen(false)}
                            className="px-4 py-2 text-gray-500 font-serif-title text-xs"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-cerulean/90"
                        >
                            Lưu Biên Bản
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: CHỈNH SỬA PHÂN CÔNG & TRƯỜNG THỰC TẬP */}
            <Modal
                isOpen={isSchoolModalOpen}
                onClose={() => setIsSchoolModalOpen(false)}
                title="Chỉnh Sửa Thông Tin Đơn Vị & Phân Công Thực Tập Sư Phạm"
            >
                <form onSubmit={handleSaveSchool} className="space-y-4">
                    <div>
                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                            Tên trường tiếp nhận thực tập *
                        </label>
                        <input
                            type="text"
                            required
                            className="input-editorial w-full text-xs"
                            value={schoolForm.name}
                            onChange={e => setSchoolForm({ ...schoolForm, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                            Địa chỉ trường *
                        </label>
                        <input
                            type="text"
                            required
                            className="input-editorial w-full text-xs"
                            value={schoolForm.address}
                            onChange={e => setSchoolForm({ ...schoolForm, address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Thời gian thực tập *
                            </label>
                            <input
                                type="text"
                                required
                                className="input-editorial w-full text-xs"
                                value={schoolForm.period}
                                onChange={e => setSchoolForm({ ...schoolForm, period: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Hiệu trưởng / Trưởng ban chỉ đạo
                            </label>
                            <input
                                type="text"
                                className="input-editorial w-full text-xs"
                                value={schoolForm.principal}
                                onChange={e => setSchoolForm({ ...schoolForm, principal: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                GV Hướng dẫn Chuyên môn *
                            </label>
                            <input
                                type="text"
                                required
                                className="input-editorial w-full text-xs"
                                value={schoolForm.headTeacher}
                                onChange={e => setSchoolForm({ ...schoolForm, headTeacher: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-jasper mb-1">
                                GV Hướng dẫn Chủ nhiệm *
                            </label>
                            <input
                                type="text"
                                required
                                className="input-editorial w-full text-xs"
                                value={schoolForm.homeroomAdvisor}
                                onChange={e => setSchoolForm({ ...schoolForm, homeroomAdvisor: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Lớp dạy chuyên môn
                            </label>
                            <input
                                type="text"
                                className="input-editorial w-full text-xs"
                                value={schoolForm.teachingClass}
                                onChange={e => setSchoolForm({ ...schoolForm, teachingClass: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-jasper mb-1">
                                Lớp thực tập chủ nhiệm
                            </label>
                            <input
                                type="text"
                                className="input-editorial w-full text-xs"
                                value={schoolForm.homeroomClass}
                                onChange={e => setSchoolForm({ ...schoolForm, homeroomClass: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Sĩ số học sinh
                            </label>
                            <input
                                type="number"
                                className="input-editorial w-full text-xs"
                                value={schoolForm.studentCount}
                                onChange={e => setSchoolForm({ ...schoolForm, studentCount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t">
                        <button
                            type="button"
                            onClick={() => setIsSchoolModalOpen(false)}
                            className="px-4 py-2 text-gray-500 font-serif-title text-xs"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-cerulean/90"
                        >
                            Lưu Thông Tin
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: THÊM NHẬT KÝ CHỦ NHIỆM */}
            <Modal
                isOpen={isHomeroomModalOpen}
                onClose={() => setIsHomeroomModalOpen(false)}
                title="Ghi Thêm Hoạt Động & Tình Huống Chủ Nhiệm"
            >
                <form onSubmit={handleSaveHomeroom} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Ngày thực hiện *
                            </label>
                            <EditorialDatePicker
                                value={homeroomForm.date}
                                onChange={val => setHomeroomForm({ ...homeroomForm, date: val })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Tên hoạt động sinh hoạt *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ví dụ: Tọa đàm định hướng nghề nghiệp"
                                className="input-editorial w-full text-xs"
                                value={homeroomForm.title}
                                onChange={e => setHomeroomForm({ ...homeroomForm, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                            Nội dung chi tiết buổi sinh hoạt
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Mô tả các hoạt động, phản ứng của học sinh..."
                            className="input-editorial w-full text-xs"
                            value={homeroomForm.content}
                            onChange={e => setHomeroomForm({ ...homeroomForm, content: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif-title font-bold text-brand-jasper mb-1">
                            Tình huống sư phạm đã giải quyết (nếu có)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Xung đột giữa học sinh, học sinh chán nản, động viên cá biệt..."
                            className="input-editorial w-full text-xs"
                            value={homeroomForm.issuesResolved}
                            onChange={e => setHomeroomForm({ ...homeroomForm, issuesResolved: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                            Góp ý của Giáo viên Hướng dẫn Chủ nhiệm
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Nhận xét của GVHDCN..."
                            className="input-editorial w-full text-xs"
                            value={homeroomForm.advisorFeedback}
                            onChange={e => setHomeroomForm({ ...homeroomForm, advisorFeedback: e.target.value })}
                        />
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t">
                        <button
                            type="button"
                            onClick={() => setIsHomeroomModalOpen(false)}
                            className="px-4 py-2 text-gray-500 font-serif-title text-xs"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-cerulean/90"
                        >
                            Lưu Nhật Ký
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: CẬP NHẬT ĐIỂM ĐÁNH GIÁ TTSP */}
            <Modal
                isOpen={isScoreModalOpen}
                onClose={() => setIsScoreModalOpen(false)}
                title="Cập Nhật Điểm Đánh Giá Thực Tập Sư Phạm Cuối Khóa"
            >
                <form onSubmit={handleSaveScores} className="space-y-4">
                    <p className="text-xs text-gray-600 font-sans">
                        Điểm tổng kết được tính tự động theo công thức chuẩn: <strong>Giảng dạy (50%) + Chủ nhiệm (30%) + Báo cáo (20%)</strong>.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Điểm Giảng dạy (50%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                required
                                className="input-editorial w-full text-xs text-center font-mono font-bold"
                                value={scoreForm.teachingScore}
                                onChange={e => setScoreForm({ ...scoreForm, teachingScore: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-jasper mb-1">
                                Điểm Chủ nhiệm (30%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                required
                                className="input-editorial w-full text-xs text-center font-mono font-bold"
                                value={scoreForm.homeroomScore}
                                onChange={e => setScoreForm({ ...scoreForm, homeroomScore: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-1">
                                Điểm Báo cáo (20%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                required
                                className="input-editorial w-full text-xs text-center font-mono font-bold"
                                value={scoreForm.reportScore}
                                onChange={e => setScoreForm({ ...scoreForm, reportScore: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="p-3 bg-brand-cream border border-brand-cerulean/30 text-center">
                        <span className="text-xs text-gray-500 font-mono uppercase block">Điểm Tổng kết Dự kiến:</span>
                        <span className="text-2xl font-serif-title font-bold text-brand-jasper">
                            {parseFloat((
                                (Number(scoreForm.teachingScore) || 0) * 0.5 +
                                (Number(scoreForm.homeroomScore) || 0) * 0.3 +
                                (Number(scoreForm.reportScore) || 0) * 0.2
                            ).toFixed(2))} <span className="text-xs text-gray-400 font-normal">/ 10</span>
                        </span>
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t">
                        <button
                            type="button"
                            onClick={() => setIsScoreModalOpen(false)}
                            className="px-4 py-2 text-gray-500 font-serif-title text-xs"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-cerulean/90"
                        >
                            Lưu Điểm
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
