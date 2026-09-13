import React, { useState, useMemo } from 'react';
import {
    Pencil,
    Trash2,
    BookOpen,
    Clock,
    FileText,
    ArrowLeft,
    CheckCircle2,
    Link2,
    Unlink,
    Plus,
    PlusCircle,
    Check,
    Award,
    CalendarDays,
    Laptop,
    Users,
    Target,
    Building2,
    ShieldCheck,
    ListChecks,
    Printer,
    Download,
    ExternalLink,
    GraduationCap,
    Mail,
    Sparkles,
    StickyNote,
    BookCheck,
    Copy,
    ArrowRight,
    Eye,
    Filter,
    Layers,
    BookMarked
} from 'lucide-react';
import { EditorialSelect, Modal } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';
import { isModuleInProgram, getModuleProgramNames, getProgramStatusLabel } from "../../utils/ruleValidators";
import { calculateModuleFinal } from "../../utils/gpaCalculators";
import { formatModuleName, generateHcmueLecturerEmail } from "../../utils/seoHelpers";
import { enrichModuleWithNvspSyllabus } from '../../data/nvspSyllabusData';
import { SyllabusPdfModal } from '../../components/training/SyllabusPdfModal';

export const ModuleDetailView = ({
    moduleId,
    programId,
    programs = [],
    modules = [],
    profile,
    onUpdateModule,
    onDeleteModule,
    navigate
}) => {
    const rawModule = modules.find(m => m.id === moduleId);
    const moduleItem = useMemo(() => enrichModuleWithNvspSyllabus(rawModule), [rawModule]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    // Tab điều hướng nội dung: 'plan' | 'outcomes' | 'outline' | 'deliverables' | 'references'
    const [activeTab, setActiveTab] = useState('plan');

    // Bộ lọc hình thức hoạt động trong tab Kế hoạch: 'all' | 'online' | 'in_person'
    const [activityFilter, setActivityFilter] = useState('all');

    if (!moduleItem) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center border-2 border-dashed border-brand-cerulean/40 bg-white shadow-editorial space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream border border-brand-cerulean/30 flex items-center justify-center text-brand-cerulean">
                    <BookOpen size={32} />
                </div>
                <p className="text-xl font-serif-title text-gray-700 font-bold">Không tìm thấy thông tin học phần.</p>
                <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
                    Học phần này có thể đã bị gỡ bỏ hoặc bạn đang truy cập bằng liên kết không hợp lệ.
                </p>
                <button
                    type="button"
                    onClick={() => navigate('program_detail', { programId })}
                    className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title font-bold text-sm shadow-editorial hover:bg-brand-jasper transition-colors inline-flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Quay lại Chương trình đào tạo
                </button>
            </div>
        );
    }

    const currentProgram = programs.find(p => p.id === programId) ||
        programs.find(p => moduleItem.programIds?.includes(p.id)) ||
        programs[0];

    const syllabus = moduleItem.syllabus || {};
    const learningStages = syllabus.learningStages || [];
    const totalActivitiesCount = learningStages.reduce((acc, stage) => acc + (stage.activities?.length || 0), 0);
    const scheduleItems = syllabus.schedule || [];
    const clos = syllabus.clos || [];
    const objectives = syllabus.objectives || [];
    const contentOutline = syllabus.contentOutline || [];
    const deliverables = syllabus.deliverables || {
        online: ['Bài tập trắc nghiệm khách quan trên LMS', 'Bản thảo Kế hoạch bài dạy số hóa'],
        inPerson: ['Hồ sơ Kế hoạch bài dạy hoàn chỉnh', 'Bài tập thực hành tập giảng / Thuyết trình demo']
    };
    const references = syllabus.references || [];
    const authorTeam = syllabus.authorTeam || moduleItem.authorTeam || ['Khoa Sư phạm - ĐH Sư phạm TP.HCM'];
    const approver = syllabus.approver || moduleItem.approver || 'TS. Mai Thu Trang (Trưởng Bộ môn)';
    const instructor = moduleItem.instructor || syllabus.instructor || 'Tập thể Giảng viên Bộ môn';
    const instructorEmail = moduleItem.instructorEmail || syllabus.instructorEmail || `${(moduleItem.code || 'hp').toLowerCase()}@lecturer.hcmue.edu.vn`;

    // Hours calculation
    const hoursBreakdown = syllabus.hoursBreakdown || {};
    const hours = {
        theory: hoursBreakdown.theory || Math.round((moduleItem.credits || 2) * 15 * 0.4),
        practice: hoursBreakdown.practice || Math.round((moduleItem.credits || 2) * 30 * 0.6),
        selfStudy: hoursBreakdown.selfStudy || ((moduleItem.credits || 2) * 30),
        total: hoursBreakdown.total || ((moduleItem.credits || 2) * 50)
    };

    // Điểm số học phần
    const { score10, letter, gpa4 } = calculateModuleFinal(moduleItem.grades, syllabus.weights);

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editingModule) return;
        onUpdateModule({
            ...editingModule,
            code: (editingModule.code || '').toUpperCase().trim(),
            credits: Number(editingModule.credits),
            instructor: (editingModule.instructor || '').trim(),
            instructorEmail: (editingModule.instructorEmail || '').trim(),
            syllabus: {
                ...(editingModule.syllabus || {}),
                instructor: (editingModule.instructor || '').trim(),
                instructorEmail: (editingModule.instructorEmail || '').trim()
            }
        });
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        const pIds = moduleItem.programIds || [];
        if (pIds.length > 1) {
            const choice = window.confirm(
                `Học phần "${moduleItem.name}" đang dùng chung giữa ${pIds.length} chương trình đào tạo.\n\n` +
                `Bấm OK để GỠ khỏi chương trình hiện tại (vẫn giữ lại ở các chương trình khác).\n` +
                `Bấm Cancel để hủy thao tác.`
            );
            if (choice) {
                const newProgramIds = pIds.filter(id => id !== programId);
                onUpdateModule({ ...moduleItem, programIds: newProgramIds });
                navigate('program_detail', { programId });
            }
        } else {
            if (window.confirm(`Bạn có chắc chắn muốn xóa hoàn toàn học phần "${moduleItem.name}" khỏi hệ thống?`)) {
                onDeleteModule(moduleItem.id);
                navigate('program_detail', { programId: (pIds[0] || programId) });
            }
        }
    };

    const handleUnlinkFromProgram = (targetProgId) => {
        const pIds = moduleItem.programIds || [];
        if (pIds.length <= 1) return;
        const newProgramIds = pIds.filter(id => id !== targetProgId);
        onUpdateModule({ ...moduleItem, programIds: newProgramIds });
    };

    const handleAddToProgram = (targetProgId) => {
        const pIds = moduleItem.programIds || [];
        if (pIds.includes(targetProgId)) return;
        onUpdateModule({ ...moduleItem, programIds: [...pIds, targetProgId] });
    };

    const unlinkablePrograms = programs.filter(p => !(moduleItem.programIds || []).includes(p.id));

    const moduleTypeOptions = [
        { label: 'Bắt buộc', value: 'mandatory' },
        { label: 'Tự chọn', value: 'elective' },
        { label: 'Thực hành', value: 'practice' },
    ];

    const categoryFormOptions = [
        { label: 'Khối A (Chung)', value: 'A' },
        { label: 'Khối B (THCS)', value: 'B' },
        { label: 'Khối C (THPT)', value: 'C' },
    ];

    const statusOptions = [
        { label: 'Lên kế hoạch', value: 'planned' },
        { label: 'Đang học', value: 'in_progress' },
        { label: 'Đã hoàn thành', value: 'completed' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-16">
            {/* HEADER WITH BADGES & ACTIONS */}
            <CollapsiblePageHeader
                backButton={{
                    label: 'Quay lại Chương trình đào tạo',
                    onClick: () => navigate('program_detail', { programId: programId || (moduleItem.programIds && moduleItem.programIds[0]) })
                }}
                badge={
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 sm:py-1 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-2xs tracking-wider uppercase rounded-2xs">
                            {(moduleItem.code || '').toUpperCase()}
                        </span>
                        <span className="px-2.5 py-0.5 sm:py-1 bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 font-serif-title text-xs font-bold rounded-2xs">
                            {moduleItem.category?.startsWith('elective') ? 'Tự chọn' : `Nhánh ${moduleItem.category || 'A'}`}
                        </span>
                        <span className="px-2.5 py-0.5 sm:py-1 bg-brand-cream text-brand-jasper border border-brand-jasper/30 font-serif-title text-xs font-bold rounded-2xs">
                            {`${moduleItem.credits} Tín chỉ`}
                        </span>
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-xs font-sans rounded-2xs border border-stone-200">
                            {`${hours.theory} tiết LT • ${hours.practice} tiết TH • ${hours.selfStudy}h Tự học`}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-bold font-serif-title rounded-2xs border ${
                            moduleItem.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : moduleItem.status === 'in_progress'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-stone-50 text-stone-600 border-stone-300'
                        }`}>
                            {moduleItem.status === 'completed' ? 'Đã hoàn thành' : moduleItem.status === 'in_progress' ? 'Đang học' : 'Lên kế hoạch'}
                        </span>
                        {moduleItem.programIds && moduleItem.programIds.length > 1 && (
                            <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/20 font-serif-title text-xs font-bold flex items-center gap-1 rounded-2xs">
                                <Link2 size={11} /> Dùng chung ({moduleItem.programIds.length} CT)
                            </span>
                        )}
                    </div>
                }
                title={formatModuleName(moduleItem.name, profile?.teachingSubject || profile?.major)}
                actions={
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full md:w-auto justify-end">
                        {/* Nút Xem Đề cương chi tiết */}
                        <button
                            type="button"
                            onClick={() => navigate('syllabus', { moduleId: moduleItem.id })}
                            className="px-3.5 py-1.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold hover:bg-brand-jasper rounded-xs flex items-center gap-1.5 transition-all shadow-xs"
                            title="Xem đề cương chi tiết học phần đầy đủ"
                        >
                            <BookOpen size={14} />
                            <span>Xem Đề cương chi tiết</span>
                            <ArrowRight size={12} className="opacity-80" />
                        </button>

                        {/* Nút Tải file PDF Đề cương A4 */}
                        <button
                            type="button"
                            onClick={() => setIsPdfModalOpen(true)}
                            className="px-3 py-1.5 bg-white text-brand-cerulean border border-brand-cerulean/40 hover:bg-brand-cream font-serif-title text-xs font-bold rounded-xs flex items-center gap-1.5 transition-all shadow-2xs"
                            title="In hoặc tải file PDF đề cương chi tiết chuẩn A4 HCMUE"
                        >
                            <Printer size={14} />
                            <span className="hidden sm:inline">Tải PDF</span> A4
                        </button>

                        {/* Nút Chỉnh sửa */}
                        <button
                            type="button"
                            onClick={() => {
                                setEditingModule({ ...moduleItem });
                                setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-brand-cerulean hover:bg-brand-cream border border-gray-200 rounded transition-colors"
                            title="Chỉnh sửa thông tin học phần"
                        >
                            <Pencil size={15} />
                        </button>

                        {/* Nút Xóa */}
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded transition-colors"
                            title="Gỡ / Xóa học phần"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                }
            />

            {/* MAIN TWO-COLUMN LAYOUT: SIDEBAR (1/3) & TABS CONTENT (2/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ========================================================================= */}
                {/* LEFT COLUMN: ACADEMIC SIDEBAR (GRADE, LECTURER, HOURS, LINKED PROGRAMS) */}
                {/* ========================================================================= */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-5">
                    {/* 1. THẺ ĐIỂM SỐ & KẾT QUẢ HỌC TẬP */}
                    <div className="bg-white border-editorial p-4 sm:p-5 shadow-editorial space-y-3.5">
                        <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-2">
                            <h3 className="text-base sm:text-lg font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                <Award size={17} className="text-brand-jasper" />
                                <span>Kết quả Học tập</span>
                            </h3>
                            <span className="text-[11px] font-sans font-medium text-gray-500">
                                Thang điểm 10
                            </span>
                        </div>

                        <div className="flex justify-around items-center py-3 bg-brand-cream border border-brand-cerulean/20 rounded-xs">
                            <div className="text-center">
                                <span className="text-[10px] uppercase text-gray-500 font-bold block tracking-wider">Tổng điểm 10</span>
                                <span className="text-2xl sm:text-3xl font-serif-title text-brand-jasper font-bold">{score10}</span>
                            </div>
                            <div className="h-8 w-px bg-brand-cerulean/20"></div>
                            <div className="text-center">
                                <span className="text-[10px] uppercase text-gray-500 font-bold block tracking-wider">Thang 4.0</span>
                                <span className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean font-bold">{letter} ({gpa4})</span>
                            </div>
                        </div>

                        <div className="space-y-1.5 text-xs font-body divide-y divide-gray-100">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Chuyên cần (10%):</span>
                                <span className="font-bold text-gray-800">{moduleItem.grades?.attendance ?? 0} / 10</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Đánh giá quá trình (30%):</span>
                                <span className="font-bold text-gray-800">{moduleItem.grades?.midterm ?? 0} / 10</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Đánh giá kết thúc (60%):</span>
                                <span className="font-bold text-gray-800">{moduleItem.grades?.final ?? 0} / 10</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-brand-cerulean/15 flex gap-2">
                            <button
                                type="button"
                                onClick={() => navigate('gradebook')}
                                className="flex-1 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold hover:bg-brand-jasper transition-colors rounded-xs text-center shadow-xs"
                            >
                                Cập nhật Sổ điểm
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('resources')}
                                className="px-3 py-2 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean font-serif-title text-xs font-bold hover:bg-brand-cerulean hover:text-white transition-colors rounded-xs flex items-center gap-1"
                                title="Mở Sổ ghi chép Cornell của học phần này"
                            >
                                <StickyNote size={13} />
                                <span>Sổ ghi</span>
                            </button>
                        </div>
                    </div>

                    {/* 2. THẺ GIẢNG VIÊN & BAN BIÊN SOẠN */}
                    <div className="bg-white border-editorial p-4 sm:p-5 shadow-editorial space-y-3">
                        <h3 className="text-base sm:text-lg font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-2 flex items-center gap-1.5">
                            <GraduationCap size={18} className="text-brand-cerulean" />
                            <span>Cán bộ &amp; Giảng viên</span>
                        </h3>

                        <div className="space-y-2 text-xs">
                            <div className="p-2.5 bg-brand-cream/60 border border-brand-cerulean/15 rounded-xs space-y-1">
                                <span className="text-[10px] uppercase font-bold text-gray-500 font-serif-title block">
                                    Giảng viên phụ trách:
                                </span>
                                <p className="font-serif-title font-bold text-brand-cerulean text-sm">
                                    {instructor}
                                </p>
                                <div className="flex items-center gap-1.5 text-gray-600 font-mono text-[11px] pt-0.5">
                                    <Mail size={12} className="text-brand-jasper shrink-0" />
                                    <a href={`mailto:${instructorEmail}`} className="hover:underline text-brand-jasper truncate">
                                        {instructorEmail}
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-1 pt-1">
                                <div className="flex items-start gap-1.5">
                                    <Building2 size={13} className="text-brand-jasper shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="font-serif-title text-gray-800 text-[11px] block">Ban biên soạn đề cương:</strong>
                                        <span className="text-gray-600 text-[11px]">
                                            {Array.isArray(authorTeam) ? authorTeam.join(', ') : authorTeam}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-1.5 pt-1">
                                    <ShieldCheck size={13} className="text-emerald-700 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="font-serif-title text-gray-800 text-[11px] block">Phê duyệt chuyên môn:</strong>
                                        <span className="text-gray-600 text-[11px]">{approver}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. THẺ PHÂN BỔ GIỜ HỌC & TÍN CHỈ */}
                    <div className="bg-white border-editorial p-4 sm:p-5 shadow-editorial space-y-3">
                        <h3 className="text-base sm:text-lg font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-2 flex items-center gap-1.5">
                            <Clock size={17} className="text-brand-cerulean" />
                            <span>Phân bổ Giờ học</span>
                        </h3>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-brand-cream/50 border border-brand-cerulean/20 rounded-xs">
                                <span className="text-[10px] text-gray-500 uppercase font-bold block">Lý thuyết</span>
                                <strong className="text-base font-serif-title text-brand-cerulean block mt-0.5">{hours.theory}</strong>
                                <span className="text-[10px] text-gray-500">tiết</span>
                            </div>
                            <div className="p-2 bg-brand-cream/50 border border-brand-cerulean/20 rounded-xs">
                                <span className="text-[10px] text-gray-500 uppercase font-bold block">Thực hành</span>
                                <strong className="text-base font-serif-title text-brand-jasper block mt-0.5">{hours.practice}</strong>
                                <span className="text-[10px] text-gray-500">tiết</span>
                            </div>
                            <div className="p-2 bg-brand-cream/50 border border-brand-cerulean/20 rounded-xs">
                                <span className="text-[10px] text-gray-500 uppercase font-bold block">Tự học</span>
                                <strong className="text-base font-serif-title text-emerald-800 block mt-0.5">{hours.selfStudy}</strong>
                                <span className="text-[10px] text-gray-500">giờ</span>
                            </div>
                        </div>

                        {syllabus.prerequisites && (
                            <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-xs text-xs text-amber-900 space-y-0.5">
                                <strong>Điều kiện tiên quyết / Học trước:</strong>
                                <p className="italic text-gray-700">{syllabus.prerequisites}</p>
                            </div>
                        )}
                    </div>

                    {/* 4. THẺ CHƯƠNG TRÌNH LIÊN KẾT */}
                    <div className="bg-white border-editorial p-4 sm:p-5 shadow-editorial space-y-3">
                        <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-2">
                            <h3 className="text-base sm:text-lg font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                <Link2 size={17} />
                                <span>Chương trình liên kết</span>
                            </h3>
                            <span className="text-[11px] bg-brand-cerulean/10 text-brand-cerulean px-2 py-0.5 font-bold font-serif-title rounded">
                                {(moduleItem.programIds || []).length} CT
                            </span>
                        </div>

                        <div className="space-y-2">
                            {(moduleItem.programIds || []).map(pId => {
                                const prog = programs.find(p => p.id === pId);
                                const canUnlink = (moduleItem.programIds || []).length > 1;
                                const isCurrent = pId === programId;
                                return (
                                    <div key={pId} className="flex items-center justify-between p-2.5 bg-brand-cream/60 border border-brand-cerulean/20 rounded-xs text-xs">
                                        <div className="space-y-0.5">
                                            <h5
                                                className="font-serif-title text-brand-cerulean font-bold hover:text-brand-jasper cursor-pointer flex items-center gap-1"
                                                onClick={() => navigate('program_detail', { programId: pId })}
                                            >
                                                <span>{prog?.name || pId}</span>
                                                {isCurrent && (
                                                    <span className="px-1.5 py-0.2 bg-brand-cerulean text-white text-[9px] font-bold rounded">Hiện tại</span>
                                                )}
                                            </h5>
                                            <span className="text-[10px] text-gray-500 block">
                                                {prog?.totalCreditsRequired || '?'} TC &bull; {getProgramStatusLabel(prog)}
                                            </span>
                                        </div>
                                        {canUnlink && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm(`Gỡ học phần "${moduleItem.name}" khỏi chương trình "${prog?.name || pId}"?`)) {
                                                        handleUnlinkFromProgram(pId);
                                                    }
                                                }}
                                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                title="Gỡ liên kết khỏi chương trình này"
                                            >
                                                <Unlink size={13} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {unlinkablePrograms.length > 0 && (
                            <div className="pt-2 border-t border-brand-cerulean/15 space-y-1.5">
                                <span className="text-[11px] font-serif-title text-gray-600 font-bold block">
                                    Thêm vào chương trình khác:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {unlinkablePrograms.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => handleAddToProgram(p.id)}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-serif-title font-bold bg-white text-brand-cerulean border border-brand-cerulean/30 hover:bg-brand-cerulean hover:text-white transition-colors rounded-xs shadow-2xs"
                                        >
                                            <PlusCircle size={11} /> {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* RIGHT COLUMN: CORE SYLLABUS TABS (PLAN, OUTCOMES, OUTLINE, DELIVERABLES, REFS) */}
                {/* ========================================================================= */}
                <div className="lg:col-span-8 space-y-5">
                    {/* TABS NAVIGATION BAR (MIRRORING SYLLABUSVIEW) */}
                    <div className="flex w-full p-1 bg-brand-cream border border-brand-cerulean/30 rounded-lg shadow-xs overflow-x-auto gap-1 select-none">
                        {[
                            { id: 'plan', label: 'Kế hoạch Hoạt động', icon: CalendarDays, count: totalActivitiesCount },
                            { id: 'outcomes', label: 'Mục tiêu & CLOs', icon: Target, count: clos.length },
                            { id: 'outline', label: 'Nội dung & Seminar', icon: BookOpen, count: contentOutline.length },
                            { id: 'deliverables', label: 'Sản phẩm & Đánh giá', icon: ListChecks },
                            { id: 'references', label: 'Tài liệu & Pháp lý', icon: Building2 },
                        ].map(tab => {
                            const TabIcon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 font-serif-title text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all rounded-md flex-1 justify-center ${
                                        isActive
                                            ? 'bg-brand-cerulean text-white shadow-xs'
                                            : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                    }`}
                                >
                                    <TabIcon size={14} className={isActive ? 'text-white' : 'text-brand-jasper'} />
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && tab.count > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                            isActive ? 'bg-white/25 text-white' : 'bg-brand-cerulean/10 text-brand-cerulean'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* TAB 1: KẾ HOẠCH HOẠT ĐỘNG (LEARNING ACTIVITIES) */}
                    {activeTab === 'plan' && (
                        <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial space-y-5 animate-fade-in">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-brand-cerulean/20">
                                <div>
                                    <h4 className="text-lg sm:text-xl font-serif-title font-bold text-brand-cerulean">
                                        Kế hoạch Bồi dưỡng &amp; Hoạt động Dạy học
                                    </h4>
                                    <p className="text-xs text-gray-500 font-body mt-0.5">
                                        Theo chuẩn bồi dưỡng kết hợp (Blended Learning) quy định tại Thông tư 12/2021/TT-BGDĐT.
                                    </p>
                                </div>

                                {/* Filter buttons: All / Online / In-person */}
                                {learningStages.length > 0 && (
                                    <div className="flex items-center gap-1 bg-brand-cream p-1 border border-brand-cerulean/25 rounded-xs text-xs font-serif-title">
                                        <button
                                            type="button"
                                            onClick={() => setActivityFilter('all')}
                                            className={`px-2.5 py-1 rounded-2xs font-bold transition-colors ${
                                                activityFilter === 'all' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                            }`}
                                        >
                                            Tất cả ({totalActivitiesCount})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActivityFilter('online')}
                                            className={`px-2.5 py-1 rounded-2xs font-bold transition-colors ${
                                                activityFilter === 'online' ? 'bg-emerald-700 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                                            }`}
                                        >
                                            Online LMS
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActivityFilter('in_person')}
                                            className={`px-2.5 py-1 rounded-2xs font-bold transition-colors ${
                                                activityFilter === 'in_person' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                            }`}
                                        >
                                            Tại lớp
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* STAGES LIST */}
                            {learningStages.length > 0 ? (
                                <div className="space-y-6">
                                    {learningStages.map((stage, stIdx) => {
                                        const filteredActs = (stage.activities || []).filter(act => {
                                            if (activityFilter === 'all') return true;
                                            return act.mode === activityFilter;
                                        });

                                        if (filteredActs.length === 0 && activityFilter !== 'all') return null;

                                        const isOnlineStage = stage.stageName?.toLowerCase().includes('trực tuyến') || stIdx === 0;

                                        return (
                                            <div key={stIdx} className="space-y-3">
                                                <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
                                                    <span className={`p-1.5 rounded-xs ${
                                                        isOnlineStage ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-cerulean/10 text-brand-cerulean'
                                                    }`}>
                                                        {isOnlineStage ? <Laptop size={16} /> : <Users size={16} />}
                                                    </span>
                                                    <h5 className="font-serif-title font-bold text-sm sm:text-base text-brand-cerulean">
                                                        {stage.stageName}
                                                    </h5>
                                                    <span className="text-xs text-gray-500 font-sans ml-auto">
                                                        ({filteredActs.length} hoạt động)
                                                    </span>
                                                </div>

                                                <div className="space-y-2.5">
                                                    {filteredActs.map((act, aIdx) => (
                                                        <div
                                                            key={aIdx}
                                                            className="p-3.5 bg-brand-cream/40 border border-brand-cerulean/20 hover:border-brand-cerulean/50 transition-colors rounded-xs space-y-2 text-xs"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="px-2 py-0.5 bg-brand-cerulean text-white font-serif-title font-bold text-[11px] rounded-xs font-mono">
                                                                        {act.code || `HĐ${aIdx + 1}`}
                                                                    </span>
                                                                    <h6 className="font-serif-title font-bold text-gray-900 text-xs sm:text-sm">
                                                                        {act.name}
                                                                    </h6>
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                                                    act.mode === 'online'
                                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                                        : 'bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/30'
                                                                }`}>
                                                                    {act.mode === 'online' ? 'Trực tuyến LMS' : 'Trực tiếp tại lớp'}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 bg-white/70 p-2.5 border border-brand-cerulean/10 rounded-2xs">
                                                                {act.target && (
                                                                    <div>
                                                                        <strong className="text-brand-cerulean font-serif-title block text-[11px]">Mục tiêu:</strong>
                                                                        <p>{act.target}</p>
                                                                    </div>
                                                                )}
                                                                {act.tasks && (
                                                                    <div>
                                                                        <strong className="text-brand-jasper font-serif-title block text-[11px]">Nhiệm vụ học viên:</strong>
                                                                        <p>{act.tasks}</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-gray-500">
                                                                {act.materials && (
                                                                    <span className="italic truncate max-w-md">
                                                                        Học liệu: {act.materials}
                                                                    </span>
                                                                )}
                                                                <span className="font-semibold text-brand-cerulean ml-auto">
                                                                    Đánh giá: {act.assessment || 'Nộp sản phẩm LMS'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* KHUNG 15 TUẦN TRUYỀN THỐNG NẾU KHÔNG CÓ STAGES */
                                <div className="space-y-2">
                                    <div className="divide-y divide-gray-200 border border-gray-200 rounded-xs overflow-hidden">
                                        {scheduleItems.map((item, idx) => (
                                            <div key={idx} className="p-3 bg-white hover:bg-brand-cream/30 transition-colors flex items-start gap-3 text-xs">
                                                <span className="px-2 py-1 bg-brand-cerulean text-white font-serif-title font-bold text-xs rounded shrink-0">
                                                    Tuần {item.week || idx + 1}
                                                </span>
                                                <div className="flex-1 space-y-0.5">
                                                    <h6 className="font-serif-title font-bold text-brand-cerulean text-sm">{item.title}</h6>
                                                    {item.topics && <p className="text-gray-600">{item.topics}</p>}
                                                </div>
                                                <span className="text-gray-500 font-mono font-bold shrink-0">{item.hours || 3} tiết</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FOOTER ACTION */}
                            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                                <span className="text-xs text-gray-500 italic">
                                    Mọi hoạt động đều có thể ghi chép và đúc kết sư phạm vào Sổ Cornell.
                                </span>
                                <button
                                    type="button"
                                    onClick={() => navigate('resources')}
                                    className="px-3 py-1.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold hover:bg-brand-jasper rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                    <StickyNote size={13} />
                                    <span>Vào Sổ ghi chép Cornell</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: MỤC TIÊU & CHUẨN ĐẦU RA (OUTCOMES & CLOs) */}
                    {activeTab === 'outcomes' && (
                        <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial space-y-6 animate-fade-in">
                            {/* MỤC TIÊU TỔNG QUÁT */}
                            <div className="space-y-2">
                                <h4 className="text-base sm:text-lg font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-1.5 flex items-center gap-1.5">
                                    <Target size={17} className="text-brand-jasper" />
                                    <span>Mục tiêu Tổng quát Học phần</span>
                                </h4>
                                <p className="text-xs sm:text-sm leading-relaxed text-gray-800 font-body text-justify bg-stone-50 p-3.5 border border-stone-200 rounded-xs">
                                    {syllabus.description || 'Học phần trang bị cho người học những phẩm chất, năng lực nghề nghiệp và kiến thức chuyên môn cốt lõi đáp ứng chuẩn đầu ra của ngành sư phạm.'}
                                </p>
                            </div>

                            {/* YÊU CẦU CẦN ĐẠT CHUẨN NGHỀ NGHIỆP (YCD) */}
                            {objectives.length > 0 && (
                                <div className="space-y-2.5">
                                    <h4 className="text-base font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-1 flex items-center gap-1.5">
                                        <BookCheck size={16} className="text-brand-cerulean" />
                                        <span>Yêu cầu cần đạt chuẩn năng lực nghề nghiệp (YCD)</span>
                                    </h4>
                                    <div className="space-y-2">
                                        {objectives.map((obj, idx) => (
                                            <div key={idx} className="p-2.5 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs flex items-start gap-2.5 text-xs text-justify">
                                                <span className="font-bold text-brand-cerulean font-mono bg-white px-2 py-0.5 border border-brand-cerulean/30 rounded-2xs shrink-0">
                                                    [{obj.code || idx + 1}]
                                                </span>
                                                <span className="text-gray-800 font-body leading-relaxed">{obj.text || obj}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* MA TRẬN CHUẨN ĐẦU RA (CLOs) */}
                            <div className="space-y-2.5">
                                <h4 className="text-base font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-1 flex items-center gap-1.5">
                                    <Award size={16} className="text-brand-jasper" />
                                    <span>Chuẩn đầu ra học phần (Course Learning Outcomes - CLOs)</span>
                                </h4>
                                <div className="border border-gray-300 rounded-xs overflow-hidden">
                                    <table className="w-full border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-stone-100 text-brand-cerulean font-bold border-b border-gray-300">
                                                <th className="p-2.5 border-r border-gray-300 w-16 text-center">Ký hiệu</th>
                                                <th className="p-2.5 border-r border-gray-300 text-left">Nội dung chuẩn đầu ra (CLO)</th>
                                                <th className="p-2.5 w-28 text-center">Mức chuẩn</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {clos.length > 0 ? (
                                                clos.map((clo, idx) => (
                                                    <tr key={idx} className="hover:bg-brand-cream/30">
                                                        <td className="p-2.5 border-r border-gray-200 text-center font-bold text-brand-cerulean font-mono">
                                                            CLO {idx + 1}
                                                        </td>
                                                        <td className="p-2.5 border-r border-gray-200 text-gray-800 text-justify font-body">
                                                            {clo}
                                                        </td>
                                                        <td className="p-2.5 text-center font-semibold text-emerald-800 text-[11px]">
                                                            Đạt chuẩn NVSP
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="p-4 text-center italic text-gray-500">Đang cập nhật chuẩn đầu ra.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: NỘI DUNG & SEMINAR (CONTENT OUTLINE) */}
                    {activeTab === 'outline' && (
                        <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial space-y-4 animate-fade-in">
                            <div className="border-b border-brand-cerulean/20 pb-2">
                                <h4 className="text-lg sm:text-xl font-serif-title font-bold text-brand-cerulean">
                                    Nội dung chi tiết &amp; Chủ đề Thảo luận Seminar
                                </h4>
                                <p className="text-xs text-gray-500 font-body mt-0.5">
                                    Phân bố các chuyên đề bài giảng và chủ đề thực hành tình huống sư phạm.
                                </p>
                            </div>

                            {contentOutline.length > 0 ? (
                                <div className="space-y-4">
                                    {contentOutline.map((sec, idx) => (
                                        <div key={idx} className="p-4 bg-brand-cream/40 border border-brand-cerulean/20 rounded-xs space-y-2.5">
                                            <h5 className="font-serif-title font-bold text-brand-cerulean text-sm sm:text-base flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-brand-cerulean text-white text-xs rounded-2xs font-mono">
                                                    {idx + 1}
                                                </span>
                                                <span>{sec.title}</span>
                                            </h5>

                                            {sec.items && sec.items.length > 0 && (
                                                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-gray-700 pl-2 font-body">
                                                    {sec.items.map((it, iIdx) => (
                                                        <li key={iIdx} className="leading-relaxed">{it}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            {sec.discussion && (
                                                <div className="pt-2 border-t border-brand-cerulean/15 text-xs text-brand-jasper italic bg-white/70 p-2.5 rounded-2xs">
                                                    <strong>Chủ đề thảo luận &amp; thực hành tình huống:</strong> {sec.discussion}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center border border-dashed border-gray-300 text-gray-500 text-xs italic">
                                    Chưa cập nhật danh mục chương mục chi tiết cho học phần này.
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 4: SẢN PHẨM & ĐÁNH GIÁ (DELIVERABLES & EVALUATION) */}
                    {activeTab === 'deliverables' && (
                        <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial space-y-6 animate-fade-in">
                            {/* SẢN PHẨM HỌC TẬP BẮT BUỘC */}
                            <div className="space-y-3">
                                <h4 className="text-base sm:text-lg font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-1.5 flex items-center gap-1.5">
                                    <ListChecks size={17} className="text-brand-jasper" />
                                    <span>Sản phẩm học tập bắt buộc phải nộp</span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="border border-emerald-300 p-3 bg-emerald-50/50 rounded-xs space-y-1.5">
                                        <span className="font-serif-title font-bold text-emerald-900 uppercase text-xs flex items-center gap-1">
                                            <Laptop size={13} />
                                            <span>a. Sản phẩm trực tuyến (Online LMS):</span>
                                        </span>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
                                            {(deliverables.online || []).map((it, idx) => (
                                                <li key={idx} className="leading-relaxed">{it}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border border-brand-cerulean/30 p-3 bg-brand-cream/50 rounded-xs space-y-1.5">
                                        <span className="font-serif-title font-bold text-brand-cerulean uppercase text-xs flex items-center gap-1">
                                            <Users size={13} />
                                            <span>b. Sản phẩm trực tiếp (Tại giảng đường):</span>
                                        </span>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
                                            {(deliverables.inPerson || []).map((it, idx) => (
                                                <li key={idx} className="leading-relaxed">{it}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* CƠ CHẾ ĐÁNH GIÁ KẾT QUẢ & TRỌNG SỐ */}
                            <div className="space-y-3 pt-2">
                                <h4 className="text-base sm:text-lg font-serif-title font-bold text-brand-cerulean border-b border-brand-cerulean/20 pb-1.5 flex items-center gap-1.5">
                                    <Award size={17} className="text-brand-cerulean" />
                                    <span>Cơ chế và Trọng số Đánh giá (Thang điểm 10)</span>
                                </h4>

                                <div className="border border-gray-300 rounded-xs overflow-hidden">
                                    <table className="w-full border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-stone-100 text-brand-cerulean font-bold border-b border-gray-300">
                                                <th className="p-2.5 border-r border-gray-300 text-left w-1/3">Hình thức đánh giá</th>
                                                <th className="p-2.5 border-r border-gray-300 text-center w-24">Trọng số</th>
                                                <th className="p-2.5 text-left">Tiêu chí &amp; Điều kiện hoàn thành</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="p-2.5 border-r border-gray-200 font-bold text-gray-900">
                                                    Đánh giá quá trình (Formative)
                                                </td>
                                                <td className="p-2.5 border-r border-gray-200 text-center font-bold text-brand-cerulean text-sm">
                                                    50%
                                                </td>
                                                <td className="p-2.5 text-gray-700 text-justify">
                                                    Chuyên cần (tham dự tối thiểu 80% thời lượng); hoàn thành đầy đủ bài kiểm tra trắc nghiệm và nhiệm vụ trực tuyến LMS.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2.5 border-r border-gray-200 font-bold text-gray-900">
                                                    Đánh giá tổng kết (Summative)
                                                </td>
                                                <td className="p-2.5 border-r border-gray-200 text-center font-bold text-brand-jasper text-sm">
                                                    50%
                                                </td>
                                                <td className="p-2.5 text-gray-700 text-justify">
                                                    Thi kết thúc học phần / Nộp Hồ sơ Kế hoạch bài dạy hoàn chỉnh theo công văn của Bộ GD&amp;ĐT. Điểm đánh giá phải đạt từ 5.0 trở lên.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: TÀI LIỆU & PHÁP LÝ (REFERENCES & LEGAL BASIS) */}
                    {activeTab === 'references' && (
                        <div className="bg-white border-editorial p-4 sm:p-6 shadow-editorial space-y-5 animate-fade-in">
                            <div className="border-b border-brand-cerulean/20 pb-2">
                                <h4 className="text-lg sm:text-xl font-serif-title font-bold text-brand-cerulean">
                                    Tài liệu Học tập &amp; Căn cứ Pháp lý
                                </h4>
                                <p className="text-xs text-gray-500 font-body mt-0.5">
                                    Văn bản quy phạm pháp luật và giáo trình học liệu chính thức.
                                </p>
                            </div>

                            {/* PHÁP LÝ */}
                            <div className="p-3.5 bg-brand-cream/60 border border-brand-cerulean/25 rounded-xs space-y-1 text-xs">
                                <strong className="text-brand-cerulean font-serif-title block text-xs uppercase tracking-wider">
                                    Căn cứ Pháp lý Ban hành:
                                </strong>
                                <p className="text-gray-800 font-body italic">
                                    {syllabus.legalBasis || 'Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo ban hành chương trình bồi dưỡng nghiệp vụ sư phạm.'}
                                </p>
                            </div>

                            {/* TÀI LIỆU THAM KHẢO */}
                            <div className="space-y-2">
                                <strong className="text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider block">
                                    Danh mục Giáo trình &amp; Tài liệu tham khảo:
                                </strong>
                                <div className="space-y-1.5 pl-1 text-xs">
                                    {references.length > 0 ? (
                                        references.map((ref, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-justify text-gray-800">
                                                <span className="font-bold text-brand-cerulean font-mono shrink-0">[{idx + 1}]</span>
                                                <span className="leading-relaxed">{ref.replace(/^\[\d+\]\s*/, '')}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-500">Giáo trình Nghiệp vụ Sư phạm - Trường Đại học Sư phạm TP. Hồ Chí Minh.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL CHỈNH SỬA HỌC PHẦN */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh sửa thông tin Học phần">
                {editingModule && (
                    <form onSubmit={handleSaveEdit} className="space-y-5 text-xs sm:text-sm">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-1">
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Mã môn</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full uppercase font-mono font-bold"
                                    value={editingModule.code || ''}
                                    onChange={e => setEditingModule({ ...editingModule, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Tên học phần</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full font-serif-title"
                                    value={editingModule.name || ''}
                                    onChange={e => setEditingModule({ ...editingModule, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Số Tín chỉ</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    className="input-editorial w-full font-bold"
                                    value={editingModule.credits || 1}
                                    onChange={e => setEditingModule({ ...editingModule, credits: e.target.value })}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Phân loại"
                                    value={editingModule.type}
                                    onChange={val => setEditingModule({ ...editingModule, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Nhánh"
                                    value={editingModule.category}
                                    onChange={val => setEditingModule({ ...editingModule, category: val })}
                                    options={categoryFormOptions}
                                />
                            </div>
                        </div>

                        <div>
                            <EditorialSelect
                                label="Trạng thái học phần"
                                value={editingModule.status || 'planned'}
                                onChange={val => setEditingModule({ ...editingModule, status: val })}
                                options={statusOptions}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Giảng viên phụ trách</label>
                                <input
                                    type="text"
                                    className="input-editorial w-full"
                                    value={editingModule.instructor || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        const autoEmail = generateHcmueLecturerEmail(val);
                                        setEditingModule(prev => {
                                            const shouldAutoSync = !prev.instructorEmail || prev.instructorEmail.endsWith('@lecturer.hcmue.edu.vn');
                                            return {
                                                ...prev,
                                                instructor: val,
                                                instructorEmail: shouldAutoSync ? autoEmail : prev.instructorEmail
                                            };
                                        });
                                    }}
                                    placeholder="Ví dụ: TS. Nguyễn Văn A"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Email Giảng viên</label>
                                <input
                                    type="text"
                                    className="input-editorial w-full font-mono text-xs"
                                    value={editingModule.instructorEmail || ''}
                                    onChange={e => setEditingModule({ ...editingModule, instructorEmail: e.target.value })}
                                    placeholder="Tự động: [tên][họ lót]@lecturer.hcmue.edu.vn"
                                />
                            </div>
                        </div>

                        <div className="pt-3 flex justify-between items-center border-t border-brand-cerulean/20">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-3.5 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-serif-title text-xs flex items-center gap-1 rounded"
                            >
                                <Trash2 size={14} /> Xóa học phần
                            </button>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-500 font-serif-title text-xs hover:bg-gray-100 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-jasper rounded"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </Modal>

            {/* MODAL XUẤT VÀ IN PDF ĐỀ CƯƠNG A4 CHUẨN HCMUE */}
            <SyllabusPdfModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                module={moduleItem}
                syllabusData={syllabus}
                program={currentProgram}
            />
        </div>
    );
};
