import React, { useState, useEffect } from 'react';
import {
    FileText,
    CheckCircle2,
    Clock,
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    Award,
    Users,
    Sparkles,
    Calendar,
    Download,
    Eye,
    HelpCircle,
    Sliders,
    Video,
    CheckSquare
} from 'lucide-react';
import { EditorialSelect, EditorialDatePicker, Modal } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';
import { initialLessonPlans, initialMicroTeachingSessions } from '../../data/trainingData';

export const LessonPlansView = ({ profile }) => {
    const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'microteaching' | 'templates'
    const [lessonPlans, setLessonPlans] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_lesson_plans');
            if (saved) try { return JSON.parse(saved); } catch (e) {}
        }
        return initialLessonPlans;
    });
    const [selectedPlanId, setSelectedPlanId] = useState(() => {
        return lessonPlans[0]?.id || 'lp_01';
    });
    const [microSessions, setMicroSessions] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_micro_sessions');
            if (saved) try { return JSON.parse(saved); } catch (e) {}
        }
        return initialMicroTeachingSessions;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_lesson_plans', JSON.stringify(lessonPlans));
        }
    }, [lessonPlans]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_micro_sessions', JSON.stringify(microSessions));
        }
    }, [microSessions]);

    // Modal state for KHBD
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null);
    const [planForm, setPlanForm] = useState({
        title: '',
        subject: 'Toán học',
        grade: 'Lớp 10',
        duration: '2 tiết (90 phút)',
        objectives: {
            knowledge: '',
            competencies: '',
            qualities: ''
        },
        materials: '',
        status: 'draft',
        author: profile?.fullName || '',
        reviewer: ''
    });

    // Modal state for Micro-teaching
    const [isMicroModalOpen, setIsMicroModalOpen] = useState(false);
    const [microForm, setMicroForm] = useState({
        date: new Date().toISOString().split('T')[0],
        lessonTitle: '',
        room: '',
        duration: '15 phút',
        score: '',
        criteria: {
            posture: '',
            voice: '',
            boardWork: '',
            interaction: '',
            technology: ''
        },
        lecturerFeedback: '',
        peerFeedback: ''
    });

    const activePlan = lessonPlans.find(p => p.id === selectedPlanId) || lessonPlans[0];

    // Open Add KHBD Modal
    const handleOpenAddPlan = () => {
        setEditingPlanId(null);
        setPlanForm({
            title: '',
            subject: 'Toán học',
            grade: 'Lớp 10',
            duration: '2 tiết (90 phút)',
            objectives: {
                knowledge: '',
                competencies: '',
                qualities: ''
            },
            materials: '',
            status: 'draft',
            author: profile?.fullName || '',
            reviewer: ''
        });
        setIsPlanModalOpen(true);
    };

    // Open Edit KHBD Modal
    const handleOpenEditPlan = (plan) => {
        setEditingPlanId(plan.id);
        setPlanForm({
            title: plan.title,
            subject: plan.subject,
            grade: plan.grade,
            duration: plan.duration,
            objectives: { ...plan.objectives },
            materials: plan.materials,
            status: plan.status,
            author: plan.author,
            reviewer: plan.reviewer
        });
        setIsPlanModalOpen(true);
    };

    const handleSavePlan = (e) => {
        e.preventDefault();
        if (editingPlanId) {
            setLessonPlans(prev => prev.map(p => {
                if (p.id === editingPlanId) {
                    return {
                        ...p,
                        ...planForm
                    };
                }
                return p;
            }));
        } else {
            const newId = `lp_${Date.now()}`;
            const newPlan = {
                id: newId,
                ...planForm,
                activities: [
                    {
                        number: 1,
                        name: "Hoạt động 1: Khởi động / Xác định vấn đề",
                        time: "10 phút",
                        goal: "Tạo tâm thế hứng thú và gợi mở kiến thức bài học.",
                        content: "Quan sát tình huống thực tế và trả lời câu hỏi dẫn dắt.",
                        product: "Câu trả lời hoặc dự đoán ban đầu của học sinh.",
                        organization: "GV nêu vấn đề -> Học sinh làm việc cá nhân -> Trao đổi nhanh."
                    },
                    {
                        number: 2,
                        name: "Hoạt động 2: Hình thành kiến thức mới",
                        time: "35 phút",
                        goal: "Khám phá và tiếp thu các đơn vị kiến thức trọng tâm.",
                        content: "Học sinh thực hiện phiếu nhiệm vụ học tập theo nhóm.",
                        product: "Kết quả bài tập trên bảng phụ và báo cáo nhóm.",
                        organization: "Chuyển giao nhiệm vụ -> Thực hiện -> Báo cáo thảo luận -> Kết luận chuẩn hóa."
                    },
                    {
                        number: 3,
                        name: "Hoạt động 3: Luyện tập",
                        time: "30 phút",
                        goal: "Khắc sâu kiến thức thông qua bài tập áp dụng trực tiếp.",
                        content: "Giải các bài tập trong phiếu học tập hoặc sách giáo khoa.",
                        product: "Bài giải chính xác trong vở ghi chép học sinh.",
                        organization: "Học sinh giải độc lập, giáo viên nhận xét sửa lỗi sai phổ biến."
                    },
                    {
                        number: 4,
                        name: "Hoạt động 4: Vận dụng & Mở rộng",
                        time: "15 phút",
                        goal: "Vận dụng kiến thức giải quyết bài toán thực tiễn.",
                        content: "Giao nhiệm vụ nghiên cứu mở rộng liên hệ đời sống.",
                        product: "Sản phẩm nộp ở buổi học sau.",
                        organization: "GV hướng dẫn nhiệm vụ về nhà và tiêu chí đánh giá."
                    }
                ]
            };
            setLessonPlans(prev => [newPlan, ...prev]);
            setSelectedPlanId(newId);
        }
        setIsPlanModalOpen(false);
    };

    const handleDeletePlan = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa Kế hoạch bài dạy này không?')) {
            const filtered = lessonPlans.filter(p => p.id !== id);
            setLessonPlans(filtered);
            if (selectedPlanId === id && filtered.length > 0) {
                setSelectedPlanId(filtered[0].id);
            }
        }
    };

    // Save Micro-teaching session
    const handleSaveMicro = (e) => {
        e.preventDefault();
        const newSession = {
            id: `mt_${Date.now()}`,
            ...microForm
        };
        setMicroSessions(prev => [newSession, ...prev]);
        setIsMicroModalOpen(false);
    };

    const avgMicroScore = microSessions.length > 0
        ? (microSessions.reduce((acc, s) => acc + s.score, 0) / microSessions.length).toFixed(1)
        : '---';
    const approvedPlansCount = lessonPlans.filter(p => p.status === 'approved').length;

    const handleResetPlans = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giáo án mẫu và ca tập giảng để nhập mới?')) {
            setLessonPlans([]);
            setMicroSessions([]);
            setSelectedPlanId(null);
            if (typeof window !== 'undefined') {
                localStorage.setItem('pedagogy_lesson_plans', JSON.stringify([]));
                localStorage.setItem('pedagogy_micro_sessions', JSON.stringify([]));
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            <CollapsiblePageHeader
                badge={
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean text-[11px] sm:text-xs font-serif-title font-bold uppercase tracking-wider mb-1">
                        <FileText className="w-3.5 h-3.5 text-brand-cerulean" />
                        Nghiệp vụ Sư phạm • Kế hoạch Bài dạy (CV 5555)
                    </div>
                }
                title="Soạn KHBD Chuẩn 5555 & Phòng Tập Giảng"
                subtitle="Hệ thống biên soạn giáo án điện tử theo Công văn 5555/BGDĐT-GDTrH với 4 hoạt động học tập, kết hợp phòng ghi âm - đánh giá tập giảng Micro-teaching theo phiếu tiêu chí sư phạm."
                actions={({ isScrolled }) => (
                    <div className="flex items-center gap-2 sm:gap-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                        <div className={`bg-white border border-stone-200 text-center shadow-xs flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'px-2.5 py-1 gap-1.5' : 'p-1.5 sm:p-2 flex-col min-w-[75px]'
                        }`}>
                            <span className={`uppercase font-serif-title text-stone-500 transition-all duration-300 ${
                                isScrolled ? 'text-[10px]' : 'text-[9px] block'
                            }`}>
                                {isScrolled ? 'Đã duyệt:' : 'KHBD duyệt'}
                            </span>
                            <span className={`font-serif-title font-bold text-brand-cerulean transition-all duration-300 leading-tight ${
                                isScrolled ? 'text-xs sm:text-sm' : 'text-base sm:text-xl'
                            }`}>
                                {approvedPlansCount}/{lessonPlans.length}
                            </span>
                        </div>
                        <div className={`bg-white border border-stone-200 text-center shadow-xs flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'px-2.5 py-1 gap-1.5' : 'p-1.5 sm:p-2 flex-col min-w-[75px]'
                        }`}>
                            <span className={`uppercase font-serif-title text-stone-500 transition-all duration-300 ${
                                isScrolled ? 'text-[10px]' : 'text-[9px] block'
                            }`}>
                                {isScrolled ? 'Giảng thử:' : 'Điểm giảng'}
                            </span>
                            <span className={`font-serif-title font-bold text-brand-jasper transition-all duration-300 leading-tight ${
                                isScrolled ? 'text-xs sm:text-sm' : 'text-base sm:text-xl'
                            }`}>
                                {avgMicroScore}/10
                            </span>
                        </div>
                    </div>
                )}
            />

            {/* Segmented Pill Tab Switcher */}
            <div className="flex w-full p-1 bg-brand-cream border border-brand-cerulean/30 rounded shadow-xs overflow-x-auto gap-1">
                {[
                    { id: 'plans', label: 'KHBD (5555)', count: lessonPlans.length, icon: BookOpen },
                    { id: 'microteaching', label: 'Tập giảng (Micro)', count: `${microSessions.length} ca`, icon: Video },
                    { id: 'templates', label: 'Khung Tiêu chí & Mẫu', icon: Sliders }
                ].map(tab => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 justify-center px-2.5 sm:px-4 py-2 font-serif-title text-[11px] sm:text-xs font-bold rounded transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                                isActive
                                    ? 'bg-brand-cerulean text-white shadow-xs'
                                    : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                            }`}
                        >
                            <TabIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans ${isActive ? 'bg-white/20 text-white' : 'bg-brand-cerulean/15 text-brand-cerulean'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: KẾ HOẠCH BÀI DẠY (KHBD) */}
            {activeTab === 'plans' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Left column: List of lesson plans */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                            <h3 className="font-serif-title font-bold text-stone-900 text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-brand-cerulean" />
                                Danh mục Giáo án
                            </h3>
                            <button
                                onClick={handleOpenAddPlan}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 shadow-editorial"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Soạn mới
                            </button>
                        </div>

                        <div className="space-y-3">
                            {lessonPlans.length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-stone-200 bg-stone-50/50 space-y-2">
                                    <FileText className="w-8 h-8 mx-auto text-stone-300" />
                                    <p className="text-xs text-stone-600 font-serif-title font-bold">Chưa có giáo án nào</p>
                                    <p className="text-[11px] text-stone-400 font-sans">Nhấn "Soạn mới" ở góc trên để tạo Kế hoạch bài dạy chuẩn 5555</p>
                                </div>
                            ) : (
                                lessonPlans.map(plan => {
                                const isSelected = plan.id === selectedPlanId;
                                return (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`p-4 cursor-pointer transition-all ${
                                            isSelected
                                                ? 'bg-white border-editorial shadow-editorial border-l-4 border-l-brand-cerulean ring-1 ring-brand-cerulean'
                                                : 'bg-white border border-stone-200 hover:border-brand-cerulean/60 hover:bg-stone-50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <span className="inline-block px-2 py-0.5 bg-stone-100 border border-stone-200 text-[11px] font-mono text-stone-700">
                                                {plan.subject} • {plan.grade}
                                            </span>
                                            <span className={`text-[11px] font-serif-title font-bold px-2 py-0.5 ${
                                                plan.status === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {plan.status === 'approved' ? 'Đã duyệt' : 'Bản nháp'}
                                            </span>
                                        </div>

                                        <h4 className="font-serif-title font-bold text-stone-900 text-sm leading-snug line-clamp-2 mb-2">
                                            {plan.title}
                                        </h4>

                                        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 font-sans">
                                            <span>Thời lượng: {plan.duration}</span>
                                            <span className="italic">GV: {plan.reviewer}</span>
                                        </div>
                                    </div>
                                );
                            }))}
                        </div>
                    </div>

                    {/* Right column: Detailed Lesson Plan View */}
                    <div className="lg:col-span-8 bg-white border-editorial shadow-editorial p-6 space-y-6">
                        {activePlan ? (
                            <>
                                {/* Plan Header */}
                                <div className="border-b border-stone-200 pb-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 bg-brand-cerulean/10 text-brand-cerulean font-mono text-xs font-bold">
                                                {activePlan.subject}
                                            </span>
                                            <span className="px-2.5 py-1 bg-stone-100 text-stone-700 font-mono text-xs">
                                                {activePlan.grade}
                                            </span>
                                            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 font-mono text-xs">
                                                {activePlan.duration}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenEditPlan(activePlan)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif-title font-bold text-brand-cerulean bg-brand-cerulean/10 hover:bg-brand-cerulean/20 border border-brand-cerulean/30"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlan(activePlan.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif-title font-bold text-brand-jasper bg-brand-jasper/10 hover:bg-brand-jasper/20 border border-brand-jasper/30"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-serif-title font-bold text-stone-900 leading-snug">
                                        {activePlan.title}
                                    </h2>

                                    <div className="flex items-center gap-6 mt-3 text-xs text-stone-500 font-sans">
                                        <span>Soạn bởi: <strong className="text-stone-800 font-serif-title">{activePlan.author}</strong></span>
                                        <span>Người duyệt: <strong className="text-stone-800 font-serif-title">{activePlan.reviewer}</strong></span>
                                        <span>Tình trạng:
                                            <span className={`ml-1.5 font-serif-title font-bold ${
                                                activePlan.status === 'approved' ? 'text-emerald-700' : 'text-amber-700'
                                            }`}>
                                                {activePlan.status === 'approved' ? 'Đã phê duyệt thông qua' : 'Bản thảo đang sửa đổi'}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* I. MỤC TIÊU BÀI HỌC (Chuẩn 5555) */}
                                <div className="space-y-3">
                                    <h3 className="font-serif-title font-bold text-stone-900 text-sm uppercase tracking-wide border-l-4 border-brand-cerulean pl-3">
                                        I. Mục tiêu Dạy học
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3.5 bg-stone-50 border border-stone-200">
                                            <div className="font-serif-title font-bold text-stone-800 text-xs mb-1.5 flex items-center gap-1.5">
                                                <BookOpen className="w-3.5 h-3.5 text-brand-cerulean" />
                                                1. Về Kiến thức
                                            </div>
                                            <p className="text-xs text-stone-600 leading-relaxed font-sans">
                                                {activePlan.objectives.knowledge}
                                            </p>
                                        </div>

                                        <div className="p-3.5 bg-stone-50 border border-stone-200">
                                            <div className="font-serif-title font-bold text-stone-800 text-xs mb-1.5 flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-brand-cerulean" />
                                                2. Về Năng lực
                                            </div>
                                            <p className="text-xs text-stone-600 leading-relaxed font-sans">
                                                {activePlan.objectives.competencies}
                                            </p>
                                        </div>

                                        <div className="p-3.5 bg-stone-50 border border-stone-200">
                                            <div className="font-serif-title font-bold text-stone-800 text-xs mb-1.5 flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5 text-brand-cerulean" />
                                                3. Về Phẩm chất
                                            </div>
                                            <p className="text-xs text-stone-600 leading-relaxed font-sans">
                                                {activePlan.objectives.qualities}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* II. THIẾT BỊ DẠY HỌC & HỌC LIỆU */}
                                <div className="space-y-2">
                                    <h3 className="font-serif-title font-bold text-stone-900 text-sm uppercase tracking-wide border-l-4 border-brand-cerulean pl-3">
                                        II. Thiết bị dạy học và học liệu
                                    </h3>
                                    <div className="p-3.5 bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed font-sans">
                                        {activePlan.materials}
                                    </div>
                                </div>

                                {/* III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CV 5555) */}
                                <div className="space-y-4">
                                    <h3 className="font-serif-title font-bold text-stone-900 text-sm uppercase tracking-wide border-l-4 border-brand-cerulean pl-3">
                                        III. Tiến trình dạy học (Chuẩn 4 Hoạt động Công văn 5555)
                                    </h3>

                                    <div className="space-y-4">
                                        {activePlan.activities?.map((act, index) => (
                                            <div
                                                key={index}
                                                className="border border-stone-200 overflow-hidden bg-white shadow-xs"
                                            >
                                                <div className="bg-brand-cream/60 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
                                                    <span className="font-serif-title font-bold text-stone-800 text-sm flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-none bg-brand-cerulean text-white flex items-center justify-center text-xs font-mono">
                                                            {act.number}
                                                        </span>
                                                        {act.name}
                                                    </span>
                                                    <span className="text-xs font-mono text-stone-600 bg-white px-2 py-0.5 border border-stone-200">
                                                        {act.time}
                                                    </span>
                                                </div>

                                                <div className="p-4 space-y-2.5 text-xs font-sans">
                                                    <div>
                                                        <span className="font-serif-title font-bold text-stone-800">a) Mục tiêu: </span>
                                                        <span className="text-stone-600">{act.goal}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-serif-title font-bold text-stone-800">b) Nội dung: </span>
                                                        <span className="text-stone-600">{act.content}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-serif-title font-bold text-stone-800">c) Sản phẩm: </span>
                                                        <span className="text-stone-600">{act.product}</span>
                                                    </div>
                                                    <div className="p-2.5 bg-stone-50 border border-stone-200 mt-2">
                                                        <span className="font-serif-title font-bold text-stone-800 block mb-1">
                                                            d) Tổ chức thực hiện:
                                                        </span>
                                                        <span className="text-stone-700 leading-relaxed">
                                                            {act.organization}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 text-stone-400 space-y-3">
                                <BookOpen className="w-12 h-12 mx-auto text-stone-300" />
                                <h4 className="font-serif-title text-base font-bold text-stone-700">Chưa có Kế hoạch bài dạy nào</h4>
                                <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                                    Hệ thống hỗ trợ biên soạn đầy đủ 4 hoạt động học tập theo đúng mẫu Công văn 5555 của Bộ Giáo dục & Đào tạo.
                                </p>
                                <button
                                    onClick={handleOpenAddPlan}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 shadow-editorial mt-2"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Soạn giáo án đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: PHÒNG TẬP GIẢNG (MICRO-TEACHING) */}
            {activeTab === 'microteaching' && (
                <div className="space-y-6">
                    <div className="bg-white border-editorial shadow-editorial p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-serif-title font-bold text-stone-900 text-lg">
                                Hồ sơ Ghi nhận Rèn luyện Giảng thử (Micro-teaching)
                            </h3>
                            <p className="text-xs text-stone-500 font-sans mt-0.5">
                                Các phiên giảng 15-20 phút trước giảng viên và nhóm bạn học sư phạm với 5 tiêu chí tác phong, ngôn ngữ, viết bảng, tương tác và công nghệ.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsMicroModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 shadow-editorial shrink-0"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Đăng ký Ca tập giảng mới
                        </button>
                    </div>

                    {microSessions.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed border-stone-200 bg-white space-y-3">
                            <Video className="w-12 h-12 mx-auto text-stone-300" />
                            <h4 className="font-serif-title text-base font-bold text-stone-700">Chưa có ca tập giảng nào</h4>
                            <p className="text-xs text-stone-500 font-sans max-w-md mx-auto">
                                Ghi nhận các phiên giảng thử 15-20 phút theo 5 tiêu chí sư phạm để tích lũy hồ sơ rèn luyện.
                            </p>
                            <button
                                onClick={() => setIsMicroModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-cerulean text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 shadow-editorial mt-1"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Đăng ký ca đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {microSessions.map(session => (
                                <div
                                    key={session.id}
                                    className="bg-white border-editorial shadow-editorial p-5 space-y-4 relative border-l-4 border-l-brand-cerulean"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-mono text-[11px] font-bold">
                                                    {session.date}
                                                </span>
                                                <span className="px-2 py-0.5 bg-stone-100 text-stone-600 font-mono text-[11px]">
                                                    {session.duration}
                                                </span>
                                                <span className="px-2 py-0.5 bg-stone-100 text-stone-600 font-mono text-[11px]">
                                                    {session.room}
                                                </span>
                                            </div>
                                            <h4 className="font-serif-title font-bold text-stone-900 text-base leading-snug">
                                                {session.lessonTitle}
                                            </h4>
                                        </div>
                                        <div className="text-right min-w-[60px]">
                                            <span className="text-3xl font-serif-title font-bold text-brand-jasper">
                                                {session.score}
                                            </span>
                                            <span className="text-xs text-stone-400 font-serif-title">/10</span>
                                        </div>
                                    </div>

                                    {/* 5 criteria ratings */}
                                    <div className="space-y-2 pt-2 border-t border-stone-100">
                                        <div className="text-xs font-serif-title font-bold text-stone-700">
                                            Điểm thành phần 5 tiêu chí:
                                        </div>
                                        <div className="grid grid-cols-5 gap-1.5 text-center">
                                            <div className="bg-stone-50 border border-stone-200 p-2">
                                                <div className="text-[10px] text-stone-500">Tác phong</div>
                                                <div className="font-mono font-bold text-stone-900 text-xs mt-0.5">
                                                    {session.criteria?.posture}
                                                </div>
                                            </div>
                                            <div className="bg-stone-50 border border-stone-200 p-2">
                                                <div className="text-[10px] text-stone-500">Ngôn ngữ</div>
                                                <div className="font-mono font-bold text-stone-900 text-xs mt-0.5">
                                                    {session.criteria?.voice}
                                                </div>
                                            </div>
                                            <div className="bg-stone-50 border border-stone-200 p-2">
                                                <div className="text-[10px] text-stone-500">Viết bảng</div>
                                                <div className="font-mono font-bold text-stone-900 text-xs mt-0.5">
                                                    {session.criteria?.boardWork}
                                                </div>
                                            </div>
                                            <div className="bg-stone-50 border border-stone-200 p-2">
                                                <div className="text-[10px] text-stone-500">Tương tác</div>
                                                <div className="font-mono font-bold text-stone-900 text-xs mt-0.5">
                                                    {session.criteria?.interaction}
                                                </div>
                                            </div>
                                            <div className="bg-stone-50 border border-stone-200 p-2">
                                                <div className="text-[10px] text-stone-500">CNTT</div>
                                                <div className="font-mono font-bold text-stone-900 text-xs mt-0.5">
                                                    {session.criteria?.technology}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedbacks */}
                                    <div className="space-y-2 pt-2 border-t border-stone-100 text-xs font-sans">
                                        <div className="bg-brand-cream/40 border-l-2 border-brand-cerulean p-2.5">
                                            <span className="font-serif-title font-bold text-brand-cerulean block mb-0.5">
                                                Nhận xét của Giảng viên hướng dẫn:
                                            </span>
                                            <p className="text-stone-700 italic leading-relaxed">
                                                "{session.lecturerFeedback}"
                                            </p>
                                        </div>
                                        <div className="bg-stone-50 border-l-2 border-stone-300 p-2.5">
                                            <span className="font-serif-title font-bold text-stone-700 block mb-0.5">
                                                Ý kiến góp ý của đồng môn (bạn học):
                                            </span>
                                            <p className="text-stone-600 leading-relaxed">
                                                "{session.peerFeedback}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: KHUNG TIÊU CHÍ CV 5555 & BIỂU MẪU */}
            {activeTab === 'templates' && (
                <div className="bg-white border-editorial shadow-editorial p-6 space-y-6">
                    <div>
                        <h3 className="font-serif-title font-bold text-stone-900 text-xl">
                            Khung Tiêu Chí Đánh Giá Bài Học Theo Công Văn 5555/BGDĐT-GDTrH
                        </h3>
                        <p className="text-xs text-stone-500 font-sans mt-1">
                            Quy chuẩn 3 phương diện và 12 tiêu chí đánh giá giờ dạy đối với giáo viên phổ thông của Bộ Giáo dục & Đào tạo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-stone-200 p-4 bg-stone-50">
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-sm mb-2 pb-2 border-b border-stone-200">
                                1. Kế hoạch & Tài liệu Dạy học (4 Tiêu chí)
                            </h4>
                            <ul className="text-xs text-stone-700 space-y-2 font-sans list-disc list-inside">
                                <li>Mức độ phù hợp của chuỗi hoạt động học với mục tiêu, nội dung và phương pháp dạy học.</li>
                                <li>Mức độ rõ ràng của mục tiêu, nội dung, kỹ thuật tổ chức và sản phẩm cần đạt của mỗi nhiệm vụ.</li>
                                <li>Mức độ phù hợp của thiết bị dạy học và học liệu được sử dụng.</li>
                                <li>Mức độ hợp lý của phương án kiểm tra, đánh giá trong quá trình dạy học.</li>
                            </ul>
                        </div>

                        <div className="border border-stone-200 p-4 bg-stone-50">
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-sm mb-2 pb-2 border-b border-stone-200">
                                2. Tổ chức Hoạt động Dạy học (4 Tiêu chí)
                            </h4>
                            <ul className="text-xs text-stone-700 space-y-2 font-sans list-disc list-inside">
                                <li>Mức độ sinh động, hấp dẫn của phương pháp và hình thức chuyển giao nhiệm vụ học tập.</li>
                                <li>Khả năng theo dõi, quan sát, kịp thời phát hiện khó khăn của học sinh.</li>
                                <li>Mức độ hiệu quả của các biện pháp hỗ trợ và khuyến khích học sinh hợp tác, tự học.</li>
                                <li>Mức độ chính xác, linh hoạt trong xử lý các tình huống sư phạm phát sinh.</li>
                            </ul>
                        </div>

                        <div className="border border-stone-200 p-4 bg-stone-50">
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-sm mb-2 pb-2 border-b border-stone-200">
                                3. Hoạt động của Học sinh (4 Tiêu chí)
                            </h4>
                            <ul className="text-xs text-stone-700 space-y-2 font-sans list-disc list-inside">
                                <li>Khả năng tiếp nhận và sẵn sàng thực hiện nhiệm vụ học tập của học sinh.</li>
                                <li>Mức độ tích cực, chủ động, sáng tạo, hợp tác trong thực hiện nhiệm vụ.</li>
                                <li>Mức độ đúng đắn, chính xác, phù hợp của các kết quả thực hiện nhiệm vụ.</li>
                                <li>Mức độ tự tin, chuẩn xác của học sinh khi trình bày, trao đổi, thảo luận kết quả.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-brand-cerulean" />
                            <div>
                                <h5 className="font-serif-title font-bold text-stone-900 text-sm">
                                    Tải mẫu Kế hoạch bài dạy chuẩn CV 5555 (.docx)
                                </h5>
                                <p className="text-xs text-stone-600 font-sans">
                                    Bản mẫu word đầy đủ khung mục tiêu 3 phần và bảng thiết kế 4 hoạt động bài học.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => alert('Đang xuất mẫu Kế hoạch bài dạy chuẩn CV 5555...')}
                            className="px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial"
                        >
                            Tải file mẫu
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: SOẠN / CHỈNH SỬA KHBD */}
            <Modal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                title={editingPlanId ? "Chỉnh sửa Kế hoạch bài dạy (CV 5555)" : "Soạn mới Kế hoạch bài dạy (CV 5555)"}
            >
                <form onSubmit={handleSavePlan} className="space-y-4">
                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Tên Kế hoạch bài dạy (Tên bài học) *
                        </label>
                        <input
                            type="text"
                            required
                            value={planForm.title}
                            onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                            placeholder="Ví dụ: Bài 3: Hàm số bậc hai và đồ thị"
                            className="w-full px-3 py-2 border border-stone-300 text-sm font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Môn học *
                            </label>
                            <EditorialSelect
                                value={planForm.subject}
                                onChange={(val) => setPlanForm({ ...planForm, subject: val })}
                                options={[
                                    { value: 'Toán học', label: 'Toán học' },
                                    { value: 'Ngữ văn', label: 'Ngữ văn' },
                                    { value: 'Tiếng Anh', label: 'Tiếng Anh' },
                                    { value: 'Vật lý', label: 'Vật lý' },
                                    { value: 'Hóa học', label: 'Hóa học' },
                                    { value: 'Sinh học', label: 'Sinh học' },
                                    { value: 'Lịch sử', label: 'Lịch sử' },
                                    { value: 'Địa lý', label: 'Địa lý' }
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Khối lớp *
                            </label>
                            <EditorialSelect
                                value={planForm.grade}
                                onChange={(val) => setPlanForm({ ...planForm, grade: val })}
                                options={[
                                    { value: 'Lớp 6', label: 'Lớp 6' },
                                    { value: 'Lớp 7', label: 'Lớp 7' },
                                    { value: 'Lớp 8', label: 'Lớp 8' },
                                    { value: 'Lớp 9', label: 'Lớp 9' },
                                    { value: 'Lớp 10', label: 'Lớp 10' },
                                    { value: 'Lớp 11', label: 'Lớp 11' },
                                    { value: 'Lớp 12', label: 'Lớp 12' }
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Thời lượng *
                            </label>
                            <input
                                type="text"
                                required
                                value={planForm.duration}
                                onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                                placeholder="Ví dụ: 2 tiết (90 phút)"
                                className="w-full px-3 py-2 border border-stone-300 text-sm font-sans focus:outline-none focus:border-brand-cerulean"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-stone-200">
                        <span className="text-xs font-serif font-bold text-brand-cerulean block uppercase">
                            Mục tiêu Dạy học 3 Phần:
                        </span>

                        <div>
                            <label className="block text-xs font-serif font-medium text-stone-700 mb-1">
                                1. Mục tiêu Về Kiến thức:
                            </label>
                            <textarea
                                rows={2}
                                value={planForm.objectives.knowledge}
                                onChange={(e) => setPlanForm({
                                    ...planForm,
                                    objectives: { ...planForm.objectives, knowledge: e.target.value }
                                })}
                                placeholder="Học sinh nhận biết, giải thích, vận dụng..."
                                className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-medium text-stone-700 mb-1">
                                2. Mục tiêu Về Năng lực:
                            </label>
                            <textarea
                                rows={2}
                                value={planForm.objectives.competencies}
                                onChange={(e) => setPlanForm({
                                    ...planForm,
                                    objectives: { ...planForm.objectives, competencies: e.target.value }
                                })}
                                placeholder="Năng lực toán học, tư duy logic, hợp tác nhóm..."
                                className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-medium text-stone-700 mb-1">
                                3. Mục tiêu Về Phẩm chất:
                            </label>
                            <textarea
                                rows={2}
                                value={planForm.objectives.qualities}
                                onChange={(e) => setPlanForm({
                                    ...planForm,
                                    objectives: { ...planForm.objectives, qualities: e.target.value }
                                })}
                                placeholder="Trách nhiệm, chăm chỉ, trung thực trong giải toán..."
                                className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Thiết bị dạy học và học liệu:
                        </label>
                        <input
                            type="text"
                            value={planForm.materials}
                            onChange={(e) => setPlanForm({ ...planForm, materials: e.target.value })}
                            placeholder="Máy chiếu, Phiếu học tập, SGK, phần mềm minh họa..."
                            className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                        <button
                            type="button"
                            onClick={() => setIsPlanModalOpen(false)}
                            className="px-4 py-2 border border-stone-300 text-xs font-serif font-bold text-stone-700 hover:bg-stone-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white text-xs font-serif font-bold hover:bg-brand-cerulean/90 shadow-sm"
                        >
                            {editingPlanId ? "Lưu cập nhật" : "Tạo KHBD"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: ĐĂNG KÝ CA TẬP GIẢNG */}
            <Modal
                isOpen={isMicroModalOpen}
                onClose={() => setIsMicroModalOpen(false)}
                title="Đăng ký & Ghi nhận Ca Tập giảng Vi sư phạm (Micro-teaching)"
            >
                <form onSubmit={handleSaveMicro} className="space-y-4">
                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Tên phân đoạn bài học tập giảng *
                        </label>
                        <input
                            type="text"
                            required
                            value={microForm.lessonTitle}
                            onChange={(e) => setMicroForm({ ...microForm, lessonTitle: e.target.value })}
                            placeholder="Ví dụ: Tập giảng thử 15 phút: Khởi động và vào bài Hàm số bậc hai"
                            className="w-full px-3 py-2 border border-stone-300 text-sm font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Ngày thực hiện *
                            </label>
                            <EditorialDatePicker
                                value={microForm.date}
                                onChange={(val) => setMicroForm({ ...microForm, date: val })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Phòng rèn luyện *
                            </label>
                            <EditorialSelect
                                value={microForm.room}
                                onChange={(val) => setMicroForm({ ...microForm, room: val })}
                                options={[
                                    { value: 'Phòng Micro-teaching B2.01', label: 'Phòng Micro-teaching B2.01' },
                                    { value: 'Phòng Micro-teaching B2.02', label: 'Phòng Micro-teaching B2.02' },
                                    { value: 'Phòng Micro-teaching B2.03', label: 'Phòng Micro-teaching B2.03' },
                                    { value: 'Hội trường B Sư phạm', label: 'Hội trường B Sư phạm' }
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Thời lượng *
                            </label>
                            <EditorialSelect
                                value={microForm.duration}
                                onChange={(val) => setMicroForm({ ...microForm, duration: val })}
                                options={[
                                    { value: '10 phút', label: '10 phút' },
                                    { value: '15 phút', label: '15 phút' },
                                    { value: '20 phút', label: '20 phút' },
                                    { value: '30 phút', label: '30 phút' }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-200">
                        <label className="block text-xs font-serif font-bold text-stone-800">
                            Điểm đánh giá sơ bộ theo 5 tiêu chí (Thang 10):
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            <div>
                                <span className="text-[10px] text-stone-500 block">Tác phong</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={microForm.criteria.posture}
                                    onChange={(e) => setMicroForm({
                                        ...microForm,
                                        criteria: { ...microForm.criteria, posture: parseFloat(e.target.value) || 0 }
                                    })}
                                    className="w-full px-2 py-1 border border-stone-300 text-xs font-mono text-center"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-500 block">Giọng nói</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={microForm.criteria.voice}
                                    onChange={(e) => setMicroForm({
                                        ...microForm,
                                        criteria: { ...microForm.criteria, voice: parseFloat(e.target.value) || 0 }
                                    })}
                                    className="w-full px-2 py-1 border border-stone-300 text-xs font-mono text-center"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-500 block">Viết bảng</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={microForm.criteria.boardWork}
                                    onChange={(e) => setMicroForm({
                                        ...microForm,
                                        criteria: { ...microForm.criteria, boardWork: parseFloat(e.target.value) || 0 }
                                    })}
                                    className="w-full px-2 py-1 border border-stone-300 text-xs font-mono text-center"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-500 block">Tương tác</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={microForm.criteria.interaction}
                                    onChange={(e) => setMicroForm({
                                        ...microForm,
                                        criteria: { ...microForm.criteria, interaction: parseFloat(e.target.value) || 0 }
                                    })}
                                    className="w-full px-2 py-1 border border-stone-300 text-xs font-mono text-center"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-500 block">CNTT</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={microForm.criteria.technology}
                                    onChange={(e) => setMicroForm({
                                        ...microForm,
                                        criteria: { ...microForm.criteria, technology: parseFloat(e.target.value) || 0 }
                                    })}
                                    className="w-full px-2 py-1 border border-stone-300 text-xs font-mono text-center"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Nhận xét của Giảng viên hướng dẫn:
                        </label>
                        <textarea
                            rows={2}
                            value={microForm.lecturerFeedback}
                            onChange={(e) => setMicroForm({ ...microForm, lecturerFeedback: e.target.value })}
                            placeholder="Ghi nhận ưu điểm và điểm cần khắc phục..."
                            className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Góp ý của nhóm sinh viên đóng vai học sinh:
                        </label>
                        <textarea
                            rows={2}
                            value={microForm.peerFeedback}
                            onChange={(e) => setMicroForm({ ...microForm, peerFeedback: e.target.value })}
                            placeholder="Cảm nhận về không khí lớp và tính hấp dẫn của câu hỏi..."
                            className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                        <button
                            type="button"
                            onClick={() => setIsMicroModalOpen(false)}
                            className="px-4 py-2 border border-stone-300 text-xs font-serif font-bold text-stone-700 hover:bg-stone-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white text-xs font-serif font-bold hover:bg-brand-cerulean/90 shadow-sm"
                        >
                            Lưu Ca Tập Giảng
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
