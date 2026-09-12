import React, { useState, useEffect, useRef } from 'react';
import {
    BookOpen,
    Plus,
    PlusCircle,
    Trash2,
    CheckCircle2,
    Check,
    ArrowRight,
    GraduationCap,
    Mail,
    RefreshCw,
    Sparkles,
    Pencil,
    Eye,
    Clock,
    ChevronRight,
    Award,
    AlignLeft,
    ListChecks,
    CalendarDays,
    Printer,
    Laptop,
    Users,
    Layers,
    BookCheck,
    FileText,
    Download,
    Building2,
    ShieldCheck,
    HelpCircle,
    Filter,
    Target,
    ClipboardList
} from 'lucide-react';
import { EditorialSelect } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';
import { getSelectedModules, getProgramStatus } from '../../utils/ruleValidators';
import { generateHcmueLecturerEmail } from '../../utils/seoHelpers';
import { enrichModuleWithNvspSyllabus, findNvspMasterModule } from '../../data/nvspSyllabusData';

export const SyllabusView = ({ modules = [], programs = [], activeModuleId, onSelectModule, onUpdateModule, showToast, navigate }) => {
    const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');

    // Danh sách các chương trình đang được học (đang học hoặc đã học)
    const enrolledPrograms = (programs || []).filter(p => getProgramStatus(p) !== 'chua_hoc');

    // Chỉ lấy các học phần đã chọn học:
    // 1. Thuộc CTĐT đang chọn học
    // 2. Nếu là môn tự chọn, phải có isSelected === true (hoặc đang học/đã hoàn thành)
    const selectedModules = getSelectedModules(modules, programs, selectedProgramFilter);

    const [selectedModuleId, setSelectedModuleId] = useState(() => {
        if (activeModuleId && selectedModules.some(m => m.id === activeModuleId)) {
            return activeModuleId;
        }
        return selectedModules[0]?.id || '';
    });

    // Chế độ xem: 'view' (read-only) hoặc 'edit' (form chỉnh sửa)
    const [displayMode, setDisplayMode] = useState('view');

    // Tab điều hướng nội dung sư phạm: 'plan' | 'overview' | 'content' | 'evaluation' | 'references'
    const [activeTab, setActiveTab] = useState('plan');

    // Bộ lọc hình thức hoạt động: 'all' | 'online' | 'in_person'
    const [activityFilter, setActivityFilter] = useState('all');

    // Ref lưu giá trị activeModuleId đã đồng bộ, tránh đè lên thao tác người dùng vừa chọn môn khác
    const syncedActiveIdRef = useRef(activeModuleId);

    // Khi prop activeModuleId thay đổi từ ngoài
    useEffect(() => {
        if (activeModuleId && activeModuleId !== syncedActiveIdRef.current) {
            syncedActiveIdRef.current = activeModuleId;
            if (selectedModules.some(m => m.id === activeModuleId)) {
                setSelectedModuleId(activeModuleId);
            }
        }
    }, [activeModuleId, selectedModules]);

    // Khi danh sách selectedModules thay đổi
    useEffect(() => {
        if (selectedModules.length > 0 && !selectedModules.some(m => m.id === selectedModuleId)) {
            const fallbackId = selectedModules[0].id;
            setSelectedModuleId(fallbackId);
            syncedActiveIdRef.current = fallbackId;
            if (onSelectModule) onSelectModule(fallbackId);
        }
    }, [selectedModules, selectedModuleId, onSelectModule]);

    // Hàm chuyển học phần khi người dùng click chọn trên giao diện
    const handleModuleChange = (modId) => {
        if (!modId) return;
        setSelectedModuleId(modId);
        syncedActiveIdRef.current = modId;
        setDisplayMode('view');
        setActiveTab('plan');
        if (onSelectModule) {
            onSelectModule(modId);
        }
    };

    const rawCurrentModule = selectedModules.find(m => m.id === selectedModuleId) || selectedModules[0];
    const currentModule = enrichModuleWithNvspSyllabus(rawCurrentModule);

    const defaultSyllabus = {
        instructor: '',
        instructorEmail: '',
        description: '',
        prerequisites: '',
        clos: [''],
        schedule: [
            { week: 1, title: 'Buổi 1: Giới thiệu tổng quan & Đề cương học phần', topics: 'Nắm bắt mục tiêu, phương pháp giảng dạy và hình thức đánh giá.', hours: 3 }
        ],
        weights: { attendance: 10, midterm: 30, final: 60 }
    };

    const [syllabusData, setSyllabusData] = useState(() => (currentModule?.syllabus || defaultSyllabus));

    useEffect(() => {
        if (currentModule) {
            const enriched = enrichModuleWithNvspSyllabus(currentModule);
            setSyllabusData({
                ...enriched.syllabus,
                instructor: enriched.instructor || enriched.syllabus?.instructor || '',
                instructorEmail: enriched.instructorEmail || enriched.syllabus?.instructorEmail || '',
                authorTeam: enriched.authorTeam || enriched.syllabus?.authorTeam || '',
                approver: enriched.approver || enriched.syllabus?.approver || '',
                description: enriched.syllabus?.description || '',
                prerequisites: enriched.prerequisites || enriched.syllabus?.prerequisites || '',
                clos: (enriched.syllabus?.clos && enriched.syllabus.clos.length > 0) ? enriched.syllabus.clos : [''],
                learningStages: enriched.syllabus?.learningStages || [],
                contentOutline: enriched.syllabus?.contentOutline || [],
                objectives: enriched.syllabus?.objectives || [],
                hoursBreakdown: enriched.syllabus?.hoursBreakdown,
                schedule: (enriched.syllabus?.schedule && enriched.syllabus.schedule.length > 0) ? enriched.syllabus.schedule : (enriched.syllabus?.learningStages?.length ? [] : [
                    { week: 1, title: 'Buổi 1: Giới thiệu tổng quan & Đề cương học phần', topics: 'Nắm bắt mục tiêu, phương pháp giảng dạy và hình thức đánh giá.', hours: 3 }
                ]),
                weights: enriched.syllabus?.weights || { attendance: 10, midterm: 30, final: 60 }
            });
        }
    }, [currentModule?.id, currentModule?.code]);

    // Khôi phục đề cương gốc chuẩn ĐH Sư phạm TP.HCM
    const handleResetToMaster = () => {
        if (!currentModule) return;
        const master = findNvspMasterModule(currentModule);
        if (!master) {
            if (showToast) showToast('Không tìm thấy đề cương mẫu gốc cho học phần này.', 'info');
            return;
        }
        const enriched = enrichModuleWithNvspSyllabus({ ...currentModule, syllabus: null });
        setSyllabusData(enriched.syllabus);
        if (onUpdateModule) {
            onUpdateModule(enriched);
        }
        if (showToast) {
            showToast(`Đã khôi phục đề cương gốc chuẩn ĐH Sư phạm TP.HCM cho môn ${currentModule.name}!`, 'success');
        }
    };

    // Tự động sinh email HCMUE khi người dùng nhập tên giảng viên
    const handleInstructorChange = (name) => {
        const autoEmail = generateHcmueLecturerEmail(name);
        setSyllabusData(prev => {
            const shouldAutoSync = !prev.instructorEmail || prev.instructorEmail.endsWith('@lecturer.hcmue.edu.vn');
            return {
                ...prev,
                instructor: name,
                instructorEmail: shouldAutoSync ? autoEmail : prev.instructorEmail
            };
        });
    };

    const handleRegenerateHcmueEmail = () => {
        if (syllabusData.instructor) {
            const autoEmail = generateHcmueLecturerEmail(syllabusData.instructor);
            setSyllabusData(prev => ({ ...prev, instructorEmail: autoEmail }));
            if (showToast) showToast('Đã tự động tạo email giảng viên!', 'success');
        }
    };

    // CLOs handlers
    const handleAddCLO = () => {
        setSyllabusData(prev => ({
            ...prev,
            clos: [...(prev.clos || []), '']
        }));
    };

    const handleCLOChange = (index, value) => {
        setSyllabusData(prev => {
            const nextCLOs = [...(prev.clos || [])];
            nextCLOs[index] = value;
            return { ...prev, clos: nextCLOs };
        });
    };

    const handleRemoveCLO = (index) => {
        setSyllabusData(prev => ({
            ...prev,
            clos: (prev.clos || []).filter((_, i) => i !== index)
        }));
    };

    // Schedule handlers
    const handleAddScheduleRow = () => {
        setSyllabusData(prev => {
            const currentSchedule = prev.schedule || [];
            const nextWeek = currentSchedule.length + 1;
            return {
                ...prev,
                schedule: [
                    ...currentSchedule,
                    { week: nextWeek, title: '', topics: '', hours: 3 }
                ]
            };
        });
    };

    const handleScheduleChange = (index, field, value) => {
        setSyllabusData(prev => {
            const nextSchedule = [...(prev.schedule || [])];
            nextSchedule[index] = { ...nextSchedule[index], [field]: value };
            return { ...prev, schedule: nextSchedule };
        });
    };

    const handleRemoveScheduleRow = (index) => {
        setSyllabusData(prev => ({
            ...prev,
            schedule: (prev.schedule || []).filter((_, i) => i !== index)
        }));
    };

    const handleSaveSyllabus = (e) => {
        e.preventDefault();
        if (!currentModule) return;
        const trimmedInstructor = (syllabusData.instructor || '').trim();
        const trimmedInstructorEmail = (syllabusData.instructorEmail || '').trim();
        const rawAuthorTeam = syllabusData.authorTeam;
        const formattedAuthorTeam = typeof rawAuthorTeam === 'string'
            ? rawAuthorTeam.split(',').map(s => s.trim()).filter(Boolean)
            : rawAuthorTeam;
        const trimmedApprover = (syllabusData.approver || '').trim();
        const updatedSyllabus = {
            ...currentModule.syllabus,
            ...syllabusData,
            instructor: trimmedInstructor,
            instructorEmail: trimmedInstructorEmail,
            authorTeam: formattedAuthorTeam,
            approver: trimmedApprover
        };
        onUpdateModule({
            ...currentModule,
            instructor: trimmedInstructor,
            instructorEmail: trimmedInstructorEmail,
            authorTeam: formattedAuthorTeam,
            approver: trimmedApprover,
            prerequisites: syllabusData.prerequisites || currentModule.prerequisites,
            syllabus: updatedSyllabus
        });
        if (showToast) {
            showToast(`Đã lưu thành công đề cương chi tiết môn ${currentModule.name}!`, 'success');
        }
        setDisplayMode('view');
    };

    const handlePrint = () => {
        window.print();
    };

    // Kiểm tra xem học phần hiện tại có dữ liệu Kế hoạch bồi dưỡng Sư phạm (Thông tư 12) hay không
    const isPedagogical = Boolean(
        syllabusData?.learningStages?.length ||
        syllabusData?.contentOutline?.length ||
        syllabusData?.hoursBreakdown ||
        currentModule?.code?.startsWith('A')
    );

    // Tính toán tổng số hoạt động học tập
    const allActivities = (syllabusData.learningStages || []).flatMap(stage => stage.activities || []);
    const totalActivitiesCount = allActivities.length;
    const onlineCount = allActivities.filter(a => a.mode === 'online').length;
    const inPersonCount = allActivities.filter(a => a.mode === 'in_person').length;

    // Lọc hoạt động theo activityFilter
    const filteredStages = (syllabusData.learningStages || []).map(stage => {
        const filteredActs = (stage.activities || []).filter(act => {
            if (activityFilter === 'online') return act.mode === 'online';
            if (activityFilter === 'in_person') return act.mode === 'in_person';
            return true;
        });
        return {
            ...stage,
            activities: filteredActs
        };
    }).filter(stage => stage.activities.length > 0);

    // Trường hợp chưa có học phần nào được chọn
    if (!currentModule || selectedModules.length === 0) {
        return (
            <div className="max-w-4xl mx-auto my-12 bg-white border-editorial p-10 text-center shadow-editorial space-y-6 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-brand-cream border border-brand-jasper/30 rounded-full flex items-center justify-center text-brand-jasper">
                    <BookOpen size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">
                        Chưa có học phần nào được chọn học
                    </h3>
                    <p className="text-gray-600 max-w-lg mx-auto text-sm leading-relaxed">
                        Mục Đề cương chi tiết chỉ hiển thị các học phần thuộc chương trình bạn đang chọn học và các học phần tự chọn đã được đăng ký.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {navigate && (
                        <>
                            <button
                                onClick={() => navigate('programs')}
                                className="px-5 py-2.5 bg-brand-cerulean text-white font-serif-title text-sm hover:bg-brand-jasper transition-colors shadow-sm flex items-center gap-1.5"
                            >
                                Xem Chương trình Đào tạo <ArrowRight size={15} />
                            </button>
                            {enrolledPrograms.length > 0 && (
                                <button
                                    onClick={() => navigate('program_detail', { programId: enrolledPrograms[0].id })}
                                    className="px-5 py-2.5 border border-brand-cerulean text-brand-cerulean font-serif-title text-sm hover:bg-brand-cerulean hover:text-white transition-colors"
                                >
                                    Chọn học phần tự chọn &rarr;
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    const att = Number(syllabusData.weights?.attendance || 0);
    const mid = Number(syllabusData.weights?.midterm || 0);
    const fin = Number(syllabusData.weights?.final || 0);
    const totalWeight = att + mid + fin;

    return (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            <CollapsiblePageHeader
                badge={
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean text-[11px] sm:text-xs font-serif-title font-bold uppercase tracking-wider mb-1 rounded-sm">
                        <BookOpen className="w-3.5 h-3.5 text-brand-cerulean" />
                        Nghiệp vụ Sư phạm • Đề cương Học phần
                    </div>
                }
                title="Đề cương chi tiết"
                subtitle={`Hiển thị các học phần đã chọn (${selectedModules.length} môn). Kế hoạch bồi dưỡng chuẩn Thông tư 12 & ĐH Sư phạm TP.HCM.`}
                actions={({ isScrolled }) => (
                    isScrolled ? (
                        <div className="text-xs font-serif-title font-bold text-brand-cerulean bg-brand-cream px-2.5 py-1 rounded border border-brand-cerulean/20 truncate max-w-[200px] sm:max-w-none shadow-xs">
                            {selectedModules.find(m => m.id === selectedModuleId)?.name || `${selectedModules.length} học phần`}
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                            {enrolledPrograms.length > 1 && (
                                <div className="w-full sm:w-52">
                                    <EditorialSelect
                                        label="Lọc theo CTĐT"
                                        value={selectedProgramFilter}
                                        onChange={setSelectedProgramFilter}
                                        options={[
                                            { label: `Tất cả CTĐT (${enrolledPrograms.length})`, value: 'all' },
                                            ...enrolledPrograms.map(p => ({
                                                label: p.name,
                                                value: p.id
                                            }))
                                        ]}
                                    />
                                </div>
                            )}
                            <div className="w-full sm:w-72">
                                <EditorialSelect
                                    label={`Học phần (${selectedModules.length} môn)`}
                                    value={selectedModuleId}
                                    onChange={handleModuleChange}
                                    options={selectedModules.map(m => ({
                                        label: `${(m.code || '').toUpperCase()} - ${m.name} (${m.credits} TC)`,
                                        value: m.id
                                    }))}
                                />
                            </div>
                        </div>
                    )
                )}
            />

            {/* ──── CHẾ ĐỘ XEM (READ-ONLY VIEW) ──── */}
            {displayMode === 'view' && (
                <div className="space-y-6 animate-fade-in print:space-y-4">
                    {/* BẢNG ĐẦU ĐỀ HÀNH CHÍNH SƯ PHẠM (ADMINISTRATIVE HEADER BANNER) */}
                    <div className="bg-white border-2 border-brand-cerulean/30 shadow-editorial p-5 sm:p-7 space-y-5 rounded-xl print:border-none print:shadow-none print:p-0">
                        {/* Quốc hiệu & Đơn vị đào tạo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4 border-b border-brand-cerulean/20 text-xs text-gray-700">
                            <div className="text-center md:text-left space-y-0.5">
                                <div className="font-bold uppercase tracking-wider text-gray-800">Bộ Giáo Dục và Đào Tạo</div>
                                <div className="font-serif-title font-bold text-brand-cerulean uppercase tracking-wide">Trường Đại Học Sư Phạm TP. Hồ Chí Minh</div>
                            </div>
                            <div className="text-center md:text-right space-y-0.5">
                                <div className="font-bold uppercase tracking-wider text-gray-800">Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam</div>
                                <div className="italic text-gray-600 font-serif-title">Độc lập - Tự do - Hạnh phúc</div>
                                {syllabusData.date && <div className="text-[11px] text-gray-500 mt-0.5">TP. Hồ Chí Minh, ngày {syllabusData.date}</div>}
                            </div>
                        </div>

                        {/* Tiêu đề môn học chính thức */}
                        <div className="text-center space-y-2 py-1 sm:py-2">
                            <div className="text-xs font-serif-title font-bold text-brand-jasper uppercase tracking-widest">
                                Kế Hoạch Bồi Dưỡng Học Phần
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-serif-title text-brand-cerulean font-bold uppercase tracking-wide leading-snug">
                                “{currentModule.name}”
                            </h2>
                            <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                                <span className="px-3 py-1 bg-brand-cerulean text-white font-bold text-xs rounded-md font-mono tracking-wider shadow-xs">
                                    MÃ HỌC PHẦN: {(currentModule.code || 'A12').toUpperCase()}
                                </span>
                                <span className="px-2.5 py-1 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean text-xs font-serif-title font-bold rounded-md">
                                    {currentModule.credits} Tín chỉ
                                </span>
                                {currentModule.type && (
                                    <span className="px-2.5 py-1 bg-brand-jasper/10 border border-brand-jasper/30 text-brand-jasper text-xs font-serif-title font-bold rounded-md">
                                        {currentModule.type === 'mandatory' ? 'Bắt buộc' : currentModule.type === 'practice' ? 'Thực hành' : 'Tự chọn'}
                                    </span>
                                )}
                            </div>
                            {syllabusData.legalBasis && (
                                <p className="text-xs text-gray-500 italic max-w-xl mx-auto pt-1 font-body">
                                    ({syllabusData.legalBasis})
                                </p>
                            )}
                        </div>

                        {/* 4 Thẻ thông số kép: Phân bổ tiết, Trực tiếp/Online, Tiên quyết, Giảng viên */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                            <div className="p-3 bg-brand-cream/40 border border-brand-cerulean/20 rounded-lg flex flex-col justify-between shadow-xs">
                                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                    <Clock size={13} className="text-brand-cerulean shrink-0" />
                                    <span>Phân bổ tiết học</span>
                                </div>
                                <div className="font-serif-title font-bold text-brand-cerulean text-xs sm:text-sm mt-1">
                                    {syllabusData.hoursBreakdown?.theory !== undefined ? (
                                        <span>{syllabusData.hoursBreakdown.theory} tiết LT &bull; {syllabusData.hoursBreakdown.practice} tiết TH</span>
                                    ) : (
                                        <span>{currentModule.credits * 15} tiết học phần</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 bg-brand-cream/40 border border-brand-cerulean/20 rounded-lg flex flex-col justify-between shadow-xs">
                                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                    <Laptop size={13} className="text-brand-jasper shrink-0" />
                                    <span>Hình thức tổ chức</span>
                                </div>
                                <div className="font-serif-title font-bold text-brand-jasper text-xs sm:text-sm mt-1">
                                    {syllabusData.hoursBreakdown?.inPerson !== undefined ? (
                                        <span>{syllabusData.hoursBreakdown.inPerson} trực tiếp &bull; {syllabusData.hoursBreakdown.online} trực tuyến</span>
                                    ) : (
                                        <span>Trực tiếp & LMS kết hợp</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 bg-brand-cream/40 border border-brand-cerulean/20 rounded-lg flex flex-col justify-between shadow-xs">
                                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                    <BookOpen size={13} className="text-brand-cerulean shrink-0" />
                                    <span>Học phần đã học</span>
                                </div>
                                <div className="font-serif-title font-bold text-gray-800 text-xs sm:text-sm mt-1 truncate" title={syllabusData.prerequisites || currentModule.prerequisites || 'Không yêu cầu'}>
                                    {syllabusData.prerequisites || currentModule.prerequisites || 'Không yêu cầu'}
                                </div>
                            </div>

                            <div className="p-3 bg-brand-cream/40 border border-brand-cerulean/20 rounded-lg flex flex-col justify-between shadow-xs">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        <GraduationCap size={13} className="text-brand-cerulean shrink-0" />
                                        <span>Giảng viên giảng dạy</span>
                                    </div>
                                    <span className="text-[9px] text-brand-jasper font-serif-title font-bold bg-brand-jasper/10 px-1.5 py-0.5 rounded-xs">Phụ trách lớp</span>
                                </div>
                                <div className="font-serif-title font-bold text-brand-cerulean text-xs sm:text-sm mt-1 truncate" title={syllabusData.instructor || 'Chưa phân công giảng viên'}>
                                    {syllabusData.instructor || 'Chưa phân công giảng viên'}
                                </div>
                                {syllabusData.instructorEmail ? (
                                    <span className="text-[11px] font-mono text-gray-500 truncate block mt-0.5">{syllabusData.instructorEmail}</span>
                                ) : (
                                    <span className="text-[10px] italic text-gray-400 block mt-0.5">Khoa phân công theo TKB</span>
                                )}
                            </div>
                        </div>

                        {/* Thông tin Bản quyền & Ban biên soạn đề cương chuyên môn */}
                        {syllabusData.authorTeam && syllabusData.authorTeam.length > 0 && (
                            <div className="flex items-center justify-between text-xs bg-brand-cream/30 p-2.5 sm:p-3 border border-brand-cerulean/15 rounded-lg text-gray-600 font-body flex-wrap gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                        <Building2 size={14} className="text-brand-jasper" />
                                        Ban biên soạn đề cương:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                        {Array.isArray(syllabusData.authorTeam) ? syllabusData.authorTeam[0] : syllabusData.authorTeam}
                                    </span>
                                    {Array.isArray(syllabusData.authorTeam) && syllabusData.authorTeam.length > 1 && (
                                        <span className="text-[11px] text-gray-500">
                                            (cùng {syllabusData.authorTeam.length - 1} tác giả chuyên môn)
                                        </span>
                                    )}
                                </div>
                                {syllabusData.approver && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-brand-cerulean/80 font-serif-title font-bold">
                                        <ShieldCheck size={13} className="text-emerald-700" />
                                        <span>Phê duyệt: {syllabusData.approver}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Nút hành động */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-cerulean/15 print:hidden">
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="px-3.5 py-1.5 border border-brand-cerulean/30 text-brand-cerulean font-serif-title text-xs font-bold hover:bg-brand-cerulean hover:text-white rounded-md flex items-center gap-1.5 transition-all shadow-xs"
                                    title="In hoặc lưu dạng PDF đề cương chi tiết chuẩn văn bản"
                                >
                                    <Printer size={14} />
                                    <span>In / Xuất PDF A4</span>
                                </button>
                                {navigate && (
                                    <button
                                        type="button"
                                        onClick={() => navigate('module_detail', { moduleId: currentModule.id })}
                                        className="px-3.5 py-1.5 border border-brand-cerulean/30 text-brand-cerulean font-serif-title text-xs font-bold hover:bg-brand-cerulean/10 rounded-md flex items-center gap-1.5 transition-all"
                                    >
                                        <Award size={14} />
                                        <span>Xem sổ điểm</span>
                                        <ArrowRight size={12} className="opacity-70 ml-0.5" />
                                    </button>
                                )}
                                {findNvspMasterModule(currentModule) && (
                                    <button
                                        type="button"
                                        onClick={handleResetToMaster}
                                        className="px-3.5 py-1.5 border border-brand-jasper/40 text-brand-jasper hover:bg-brand-jasper hover:text-white font-serif-title text-xs font-bold rounded-md flex items-center gap-1.5 transition-all shadow-xs"
                                        title="Khôi phục nguyên bản đề cương chi tiết chuẩn văn bản PDF của ĐH Sư phạm TP.HCM"
                                    >
                                        <RefreshCw size={14} />
                                        <span>Khôi phục chuẩn HCMUE</span>
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setDisplayMode('edit')}
                                className="px-4 py-1.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold hover:bg-brand-jasper rounded-md flex items-center gap-1.5 transition-all shadow-sm"
                            >
                                <Pencil size={14} />
                                <span>Chỉnh sửa đề cương</span>
                            </button>
                        </div>
                    </div>

                    {/* THANH ĐIỀU HƯỚNG TAB SƯ PHẠM (TABS NAVIGATION) */}
                    {isPedagogical && (
                        <div className="flex w-full p-1 bg-brand-cream border border-brand-cerulean/30 rounded-lg shadow-xs overflow-x-auto gap-1 print:hidden select-none">
                            {[
                                { id: 'plan', label: 'Kế hoạch Hoạt động', icon: CalendarDays, count: totalActivitiesCount },
                                { id: 'overview', label: 'I. Yêu cầu cần đạt', icon: ListChecks },
                                { id: 'content', label: 'II. Nội dung cơ bản', icon: Layers },
                                { id: 'evaluation', label: 'V & VI. Đánh giá kết quả', icon: Award },
                                { id: 'references', label: 'VII. Tài liệu tham khảo', icon: BookCheck }
                            ].map(tab => {
                                const TabIcon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 justify-center px-2.5 sm:px-4 py-2 font-serif-title text-[11px] sm:text-xs font-bold rounded-md transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                                            isActive
                                                ? 'bg-brand-cerulean text-white shadow-xs'
                                                : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                        }`}
                                    >
                                        <TabIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                        <span>{tab.label}</span>
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans font-bold ${
                                                isActive ? 'bg-white/20 text-white' : 'bg-brand-cerulean/15 text-brand-cerulean'
                                            }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* ──── TAB 1: KẾ HOẠCH HOẠT ĐỘNG (LEARNING ACTIVITIES TAB) ──── */}
                    {(activeTab === 'plan' || !isPedagogical) && (
                        <div className="space-y-5 animate-fade-in">
                            {isPedagogical && totalActivitiesCount > 0 ? (
                                <div className="space-y-4">
                                    {/* Sub-filter: Trực tuyến vs Trực tiếp */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-brand-cerulean/20 shadow-xs rounded-lg print:hidden">
                                        <div className="flex items-center gap-1.5 text-xs font-serif-title font-bold text-brand-cerulean">
                                            <Filter size={14} className="text-brand-cerulean" />
                                            <span>Bộ lọc hình thức:</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => setActivityFilter('all')}
                                                className={`px-3 py-1 text-xs font-serif-title font-bold rounded-md transition-colors ${
                                                    activityFilter === 'all'
                                                        ? 'bg-brand-cerulean text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Tất cả ({totalActivitiesCount})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActivityFilter('online')}
                                                className={`px-3 py-1 text-xs font-serif-title font-bold rounded-md transition-colors flex items-center gap-1.5 ${
                                                    activityFilter === 'online'
                                                        ? 'bg-emerald-700 text-white'
                                                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                                }`}
                                            >
                                                <Laptop size={13} />
                                                <span>Trực tuyến ({onlineCount})</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActivityFilter('in_person')}
                                                className={`px-3 py-1 text-xs font-serif-title font-bold rounded-md transition-colors flex items-center gap-1.5 ${
                                                    activityFilter === 'in_person'
                                                        ? 'bg-brand-cerulean text-white'
                                                        : 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 hover:bg-brand-cerulean/10'
                                                }`}
                                            >
                                                <Users size={13} />
                                                <span>Trực tiếp ({inPersonCount})</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Danh sách các giai đoạn & hoạt động */}
                                    <div className="space-y-6">
                                        {filteredStages.map((stage, sIdx) => (
                                            <div key={sIdx} className="bg-white border border-brand-cerulean/25 shadow-editorial rounded-xl overflow-hidden">
                                                {/* Header Giai đoạn */}
                                                <div className="bg-brand-cream/70 border-b border-brand-cerulean/20 px-4 py-2.5 flex items-center justify-between">
                                                    <h3 className="font-serif-title font-bold text-brand-cerulean text-sm sm:text-base uppercase tracking-wide flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-brand-jasper"></span>
                                                        <span>{stage.stageName}</span>
                                                    </h3>
                                                    <span className="text-[11px] font-sans font-semibold text-gray-500">
                                                        {stage.activities.length} hoạt động
                                                    </span>
                                                </div>

                                                {/* Danh sách hoạt động con */}
                                                <div className={`divide-y divide-brand-cerulean/15 ${stage.activities.length > 3 ? 'max-h-[640px] overflow-y-auto editor-scrollbar pr-1' : ''}`}>
                                                    {stage.activities.map((act) => {
                                                        const isOnline = act.mode === 'online';
                                                        return (
                                                            <div key={act.id} className="p-4 sm:p-5 hover:bg-brand-cream/15 transition-colors space-y-3">
                                                                {/* Tên hoạt động & Badge hình thức */}
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-bold text-xs font-mono rounded">
                                                                            {act.code || 'Hoạt động'}
                                                                        </span>
                                                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-base sm:text-lg">
                                                                            {act.name}
                                                                        </h4>
                                                                    </div>
                                                                    <div className="shrink-0">
                                                                        {isOnline ? (
                                                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold text-xs flex items-center gap-1 shadow-xs">
                                                                                <Laptop size={13} className="text-emerald-600" />
                                                                                <span>Trực tuyến (Online LMS)</span>
                                                                            </span>
                                                                        ) : (
                                                                            <span className="px-2.5 py-1 bg-brand-cerulean text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs">
                                                                                <Users size={13} />
                                                                                <span>Trực tiếp (Tại lớp)</span>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Chi tiết: Mục tiêu, Nhiệm vụ, Học liệu, Đánh giá */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700 bg-brand-cream/30 p-3 rounded-lg border border-brand-cerulean/15">
                                                                    {act.target && (
                                                                        <div className="space-y-1">
                                                                            <span className="font-serif-title font-bold text-brand-cerulean uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                                                                <Target size={13} className="text-brand-cerulean shrink-0" />
                                                                                <span>Mục tiêu hoạt động</span>
                                                                            </span>
                                                                            <p className="leading-relaxed text-gray-800 font-body">{act.target}</p>
                                                                        </div>
                                                                    )}

                                                                    {act.tasks && (
                                                                        <div className="space-y-1">
                                                                            <span className="font-serif-title font-bold text-brand-jasper uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                                                                <ClipboardList size={13} className="text-brand-jasper shrink-0" />
                                                                                <span>Nhiệm vụ của học viên</span>
                                                                            </span>
                                                                            <p className="leading-relaxed text-gray-800 font-body">{act.tasks}</p>
                                                                        </div>
                                                                    )}

                                                                    {act.materials && (
                                                                        <div className="space-y-1">
                                                                            <span className="font-serif-title font-bold text-gray-600 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                                                                <BookOpen size={13} className="text-brand-cerulean shrink-0" />
                                                                                <span>Học liệu & Công cụ</span>
                                                                            </span>
                                                                            <p className="leading-relaxed text-gray-700 font-body">{act.materials}</p>
                                                                        </div>
                                                                    )}

                                                                    {act.assessment && (
                                                                        <div className="space-y-1">
                                                                            <span className="font-serif-title font-bold text-emerald-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                                                                <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                                                                                <span>Hình thức kiểm tra, đánh giá</span>
                                                                            </span>
                                                                            <p className="leading-relaxed text-gray-700 font-body">{act.assessment}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Khung bài học dạng 15 tuần học truyền thống (cho các môn đại học thông thường) */
                                <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-4 rounded-xl">
                                    <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-2">
                                        <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                                            <CalendarDays size={18} className="text-brand-cerulean" />
                                            Khung bài học theo Tuần/Buổi
                                        </h3>
                                        {syllabusData.schedule && syllabusData.schedule.some(s => s.title) && (
                                            <span className="text-xs text-gray-500 font-sans">
                                                {syllabusData.schedule.filter(s => s.title).length} buổi học
                                            </span>
                                        )}
                                    </div>

                                    {syllabusData.schedule && syllabusData.schedule.some(s => s.title) ? (
                                        <div className="space-y-2.5 max-h-[480px] overflow-y-auto editor-scrollbar pr-2">
                                            {syllabusData.schedule.filter(s => s.title).map((item, idx) => (
                                                <div key={idx} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-brand-cream/40 border border-brand-cerulean/15 hover:border-brand-cerulean/30 transition-colors rounded-lg">
                                                    <div className="shrink-0 w-10 h-10 rounded-full bg-brand-cerulean/10 border border-brand-cerulean/20 flex flex-col items-center justify-center text-brand-cerulean">
                                                        <span className="text-[9px] font-bold uppercase font-sans leading-none">Buổi</span>
                                                        <span className="text-sm font-bold font-serif-title leading-none">{item.week || idx + 1}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-serif-title font-bold text-brand-jasper text-sm sm:text-base leading-snug">
                                                            {item.title}
                                                        </div>
                                                        {item.topics && (
                                                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">{item.topics}</div>
                                                        )}
                                                    </div>
                                                    {item.hours && (
                                                        <div className="shrink-0 flex items-center gap-1 text-xs text-gray-400 font-bold font-sans">
                                                            <Clock size={12} className="text-brand-cerulean" />
                                                            {item.hours} tiết
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-gray-400 text-center py-6">Chưa có khung bài học nào được cập nhật.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ──── TAB 2: YÊU CẦU CẦN ĐẠT & MỤC TIÊU (OVERVIEW TAB) ──── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-5 animate-fade-in">
                            {/* Mô tả mục tiêu học phần */}
                            <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-3 rounded-xl">
                                <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                                    <AlignLeft size={18} className="text-brand-cerulean" />
                                    <span>Mục tiêu chung của học phần</span>
                                </h3>
                                <p className="text-gray-700 text-sm sm:text-base font-body leading-relaxed pl-2">
                                    {syllabusData.description || <span className="italic text-gray-400">Chưa cập nhật mô tả mục tiêu học phần.</span>}
                                </p>
                            </div>

                            {/* Danh sách Yêu cầu cần đạt chi tiết */}
                            {syllabusData.objectives && syllabusData.objectives.length > 0 && (
                                <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-4 rounded-xl">
                                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                                        <ListChecks size={18} className="text-brand-cerulean" />
                                        <span>I. Yêu cầu cần đạt chuẩn (Sau khi hoàn thành học phần)</span>
                                    </h3>
                                    <div className={`grid grid-cols-1 gap-3 ${syllabusData.objectives.length > 3 ? 'max-h-[360px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                                        {syllabusData.objectives.map((obj, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-brand-cream/40 border border-brand-cerulean/15 rounded-lg">
                                                <span className="shrink-0 w-7 h-7 rounded-full bg-brand-cerulean text-white font-serif-title font-bold text-xs flex items-center justify-center shadow-xs">
                                                    {obj.code || idx + 1}
                                                </span>
                                                <div className="text-sm font-body text-gray-800 leading-relaxed pt-0.5">
                                                    {obj.text || obj}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chuẩn đầu ra (CLOs) */}
                            <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-4 rounded-xl">
                                <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                                    <CheckCircle2 size={18} className="text-brand-cerulean" />
                                    <span>Chuẩn đầu ra học phần (Course Learning Outcomes - CLOs)</span>
                                </h3>
                                {syllabusData.clos && syllabusData.clos.some(c => c) ? (
                                    <ul className={`space-y-2.5 ${syllabusData.clos.filter(c => c).length > 3 ? 'max-h-[300px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                                        {syllabusData.clos.filter(c => c).map((clo, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-800 font-body">
                                                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-brand-cerulean/10 text-brand-cerulean font-bold text-[11px] flex items-center justify-center font-sans">
                                                    {idx + 1}
                                                </span>
                                                <span className="leading-relaxed">{clo}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm italic text-gray-400 text-center py-4">Chưa có chuẩn đầu ra nào.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ──── TAB 3: NỘI DUNG CƠ BẢN (CONTENT OUTLINE TAB) ──── */}
                    {activeTab === 'content' && (
                        <div className="space-y-5 animate-fade-in">
                            {syllabusData.contentOutline && syllabusData.contentOutline.length > 0 ? (
                                <div className="space-y-4">
                                    {syllabusData.contentOutline.map((section, idx) => (
                                        <div key={idx} className="bg-white border-2 border-brand-cerulean/25 shadow-editorial rounded-xl overflow-hidden">
                                            {/* Tiêu đề nội dung lớn */}
                                            <div className="bg-brand-cream/80 border-b border-brand-cerulean/20 px-5 py-3">
                                                <h3 className="font-serif-title font-bold text-brand-cerulean text-sm sm:text-base leading-snug">
                                                    {section.title}
                                                </h3>
                                            </div>

                                            {/* Danh sách tiểu mục */}
                                            <div className="p-4 sm:p-5 space-y-3">
                                                <ul className={`space-y-2 ${section.items && section.items.length > 3 ? 'max-h-[220px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                                                    {section.items.map((item, iIdx) => (
                                                        <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm font-body text-gray-800 leading-relaxed">
                                                            <span className="text-brand-jasper mt-1">&bull;</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {section.discussion && (
                                                    <div className="mt-3 pt-3 border-t border-brand-cerulean/15 flex items-start gap-2 bg-brand-cream/30 p-2.5 rounded-lg text-xs font-body text-brand-jasper">
                                                        <HelpCircle size={15} className="shrink-0 mt-0.5" />
                                                        <span><strong>Thực hành & thảo luận:</strong> {section.discussion}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border-editorial shadow-editorial p-8 text-center text-gray-400 italic rounded-xl">
                                    Chưa có mục đề cương chi tiết nào. Bấm 'Chỉnh sửa đề cương' để bổ sung.
                                </div>
                            )}
                        </div>
                    )}

                    {/* ──── TAB 4: ĐÁNH GIÁ & SẢN PHẨM NỘP (EVALUATION TAB) ──── */}
                    {activeTab === 'evaluation' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* V. SẢN PHẨM HỌC TẬP PHẢI NỘP */}
                            {syllabusData.deliverables && (
                                <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-4 rounded-xl">
                                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                                        <Layers size={18} className="text-brand-cerulean" />
                                        <span>V. Sản phẩm học tập bắt buộc phải nộp</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Sản phẩm trực tuyến */}
                                        <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-2">
                                            <span className="font-serif-title font-bold text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                                <Laptop size={14} />
                                                <span>1. Sản phẩm bồi dưỡng trực tuyến</span>
                                            </span>
                                            <ul className={`space-y-1.5 text-xs text-gray-700 font-body ${(syllabusData.deliverables.online || []).length > 3 ? 'max-h-[180px] overflow-y-auto pr-1.5 editor-scrollbar' : ''}`}>
                                                {syllabusData.deliverables.online?.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Sản phẩm trực tiếp */}
                                        <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/20 rounded-lg space-y-2">
                                            <span className="font-serif-title font-bold text-brand-cerulean text-xs uppercase tracking-wider flex items-center gap-1.5">
                                                <Users size={14} />
                                                <span>2. Sản phẩm bồi dưỡng trực tiếp</span>
                                            </span>
                                            <ul className={`space-y-1.5 text-xs text-gray-700 font-body ${(syllabusData.deliverables.inPerson || []).length > 3 ? 'max-h-[180px] overflow-y-auto pr-1.5 editor-scrollbar' : ''}`}>
                                                {syllabusData.deliverables.inPerson?.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <Check size={13} className="text-brand-cerulean mt-0.5 shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VI. ĐÁNH GIÁ KẾT QUẢ HỌC PHẦN */}
                            <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-4 rounded-xl">
                                <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-2">
                                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                                        <Award size={18} className="text-brand-cerulean" />
                                        <span>VI. Cơ chế Đánh giá kết quả học phần</span>
                                    </h3>
                                    <span className="text-xs font-serif-title font-bold text-brand-cerulean bg-brand-cream px-2.5 py-1 border border-brand-cerulean/20 rounded-md">
                                        Thang điểm 0 - 10
                                    </span>
                                </div>

                                {syllabusData.evaluationScheme ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Đánh giá quá trình / điều kiện */}
                                        <div className="p-4 bg-white border border-brand-cerulean/20 rounded-lg space-y-3">
                                            <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-1.5">
                                                <span className="font-serif-title font-bold text-brand-cerulean text-xs uppercase tracking-wide">
                                                    Đánh giá quá trình (Điều kiện)
                                                </span>
                                                <span className="px-2 py-0.5 bg-brand-cerulean text-white font-bold text-xs rounded-md">
                                                    50%
                                                </span>
                                            </div>
                                            <div className={`space-y-2.5 ${(syllabusData.evaluationScheme.formative || []).length > 3 ? 'max-h-[260px] overflow-y-auto pr-1.5 editor-scrollbar' : ''}`}>
                                                {syllabusData.evaluationScheme.formative?.map((item, idx) => (
                                                    <div key={idx} className="text-xs space-y-1 bg-brand-cream/30 p-2.5 border border-brand-cerulean/10 rounded-md">
                                                        <div className="flex justify-between font-serif-title font-bold text-gray-800">
                                                            <span>{item.name}</span>
                                                            <span className="text-brand-jasper">{item.weight}%</span>
                                                        </div>
                                                        {item.condition && (
                                                            <p className="text-[11px] text-gray-500 italic font-body">{item.condition}</p>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="text-[11px] text-gray-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                                                    <strong>Điều kiện chuyên cần:</strong> Tham dự trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Đánh giá tổng kết / cuối học phần */}
                                        <div className="p-4 bg-white border border-brand-cerulean/20 rounded-lg space-y-3">
                                            <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-1.5">
                                                <span className="font-serif-title font-bold text-brand-jasper text-xs uppercase tracking-wide">
                                                    Đánh giá tổng kết (Cuối học phần)
                                                </span>
                                                <span className="px-2 py-0.5 bg-brand-jasper text-white font-bold text-xs rounded-md">
                                                    50%
                                                </span>
                                            </div>
                                            <div className="space-y-2.5">
                                                <div className="text-xs space-y-1 bg-brand-cream/30 p-2.5 border border-brand-cerulean/10 rounded-md">
                                                    <div className="font-serif-title font-bold text-brand-jasper text-sm">
                                                        {syllabusData.evaluationScheme.summative?.name || 'Thi kết thúc học phần'}
                                                    </div>
                                                    <p className="text-[11px] text-gray-600 font-body leading-relaxed">
                                                        {syllabusData.evaluationScheme.summative?.condition || 'Đạt trên 5.0 điểm để được xét hoàn thành học phần.'}
                                                    </p>
                                                </div>
                                                <div className="text-[11px] text-gray-500 font-body italic">
                                                    {syllabusData.evaluationScheme.notes || 'Nộp bài tập trên hệ thống quản lý học tập LMS theo hướng dẫn.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Thanh đo trọng số điểm truyền thống */
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Chuyên cần', value: att, barColor: 'bg-brand-cerulean/40', textColor: 'text-brand-cerulean' },
                                            { label: 'Giữa kỳ', value: mid, barColor: 'bg-brand-jasper/40', textColor: 'text-brand-jasper' },
                                            { label: 'Cuối kỳ', value: fin, barColor: 'bg-brand-cerulean/60', textColor: 'text-brand-cerulean' },
                                        ].map(item => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                                    <span className={`font-serif-title ${item.textColor}`}>{item.label}</span>
                                                    <span className="text-gray-700">{item.value}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                                                        style={{ width: `${item.value}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ──── TAB 5: TÀI LIỆU THAM KHẢO & NHÂN SỰ (REFERENCES TAB) ──── */}
                    {activeTab === 'references' && (
                        <div className="space-y-5 animate-fade-in">
                            {/* VII. TÀI LIỆU THAM KHẢO */}
                            <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-4 rounded-xl">
                                <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                                    <BookCheck size={18} className="text-brand-cerulean" />
                                    <span>VII. Tài liệu tham khảo & Căn cứ pháp quy</span>
                                </h3>
                                {syllabusData.references && syllabusData.references.length > 0 ? (
                                    <ul className={`space-y-2.5 ${syllabusData.references.length > 3 ? 'max-h-[280px] overflow-y-auto pr-2 editor-scrollbar' : ''}`}>
                                        {syllabusData.references.map((refItem, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-body text-gray-800 leading-relaxed bg-brand-cream/30 p-2.5 rounded-lg border border-brand-cerulean/10">
                                                <span className="font-bold text-brand-cerulean shrink-0 font-mono">[{idx + 1}]</span>
                                                <span>{refItem.replace(/^\[\d+\]\s*/, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm italic text-gray-400 text-center py-4">Chưa có danh mục tài liệu tham khảo nào.</p>
                                )}
                            </div>

                            {/* BAN BIÊN SOẠN & DUYỆT ĐỀ CƯƠNG */}
                            <div className="bg-white border-editorial shadow-editorial p-5 sm:p-6 space-y-4 rounded-xl">
                                <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                                    <Building2 size={18} className="text-brand-cerulean" />
                                    <span>Nhóm biên soạn & Kiểm duyệt chuyên môn</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    {/* Nhóm biên soạn */}
                                    <div className="space-y-2 bg-brand-cream/40 p-4 border border-brand-cerulean/20 rounded-lg">
                                        <span className="font-serif-title font-bold text-brand-cerulean text-xs uppercase tracking-wider block">
                                            Người / Nhóm biên soạn
                                        </span>
                                        {syllabusData.authorTeam && syllabusData.authorTeam.length > 0 ? (
                                            <ul className={`space-y-1 text-xs text-gray-800 font-body ${syllabusData.authorTeam.length > 3 ? 'max-h-[180px] overflow-y-auto pr-1.5 editor-scrollbar' : ''}`}>
                                                {syllabusData.authorTeam.map((author, idx) => (
                                                    <li key={idx} className="flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cerulean"></span>
                                                        <span>{author}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs text-gray-700 font-body">
                                                {syllabusData.instructor || 'Tập thể giảng viên Bộ môn'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Trưởng bộ môn kiểm duyệt */}
                                    <div className="space-y-2 bg-brand-cream/40 p-4 border border-brand-cerulean/20 rounded-lg flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <span className="font-serif-title font-bold text-brand-jasper text-xs uppercase tracking-wider block">
                                                Kiểm duyệt của Trưởng bộ môn / Trưởng nhóm
                                            </span>
                                            <p className="text-xs text-gray-700 font-body">
                                                {syllabusData.approver || 'TS. Mai Thu Trang (Trưởng Bộ môn)'}
                                            </p>
                                        </div>
                                        <div className="pt-3 border-t border-brand-cerulean/15 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
                                            <ShieldCheck size={14} className="text-emerald-700" />
                                            <span>Đã ký duyệt ban hành theo Thông tư 12/2021/TT-BGDĐT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ──── CHẾ ĐỘ CHỈNH SỬA (EDIT FORM) ──── */}
            {displayMode === 'edit' && (
                <form onSubmit={handleSaveSyllabus} className="bg-white border-editorial p-4 sm:p-8 shadow-editorial space-y-6 sm:space-y-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 border-b border-brand-cerulean/20 pb-4">
                        <div className="space-y-1.5 w-full md:w-auto">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-white bg-brand-cerulean px-2.5 py-0.5 rounded font-sans tracking-wide">
                                    {(currentModule.code || '').toUpperCase()}
                                </span>
                                {(syllabusData.instructor || currentModule.instructor) && (
                                    <span className="text-xs font-serif-title text-brand-cerulean bg-brand-cream px-2 py-0.5 rounded border border-brand-cerulean/30 flex items-center gap-1.5 font-semibold">
                                        <GraduationCap size={13} className="text-brand-jasper" />
                                        GV: {syllabusData.instructor || currentModule.instructor}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-title text-brand-cerulean font-bold">
                                {currentModule.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={() => setDisplayMode('view')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-brand-cerulean/30 text-brand-cerulean font-serif-title text-xs hover:bg-brand-cerulean/5 transition-colors"
                            >
                                <Eye size={13} />
                                Xem trước
                            </button>
                            <button type="submit" className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-cerulean text-white font-serif-title text-xs sm:text-base shadow-editorial hover:bg-brand-jasper transition-colors">
                                Lưu Đề Cương
                            </button>
                        </div>
                    </div>

                    {/* SECTION 1: THÔNG TIN CHUNG & GIẢNG VIÊN */}
                    <div className="space-y-5">
                        <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                            Thông tin Giảng viên & Mục tiêu học phần
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-cream/40 p-4 border border-brand-cerulean/20 rounded-lg">
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1 flex items-center gap-1.5 font-bold">
                                    <GraduationCap size={16} className="text-brand-jasper" />
                                    Giảng viên phụ trách lớp
                                </label>
                                <input
                                    type="text"
                                    className="input-editorial w-full bg-white"
                                    value={syllabusData.instructor || ''}
                                    onChange={e => handleInstructorChange(e.target.value)}
                                    placeholder="Ví dụ: TS. Thái Hoài Minh, PGS. TS. Huỳnh Văn Sơn..."
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-serif-title text-brand-cerulean flex items-center gap-1.5 font-bold">
                                        <Mail size={16} className="text-brand-jasper" />
                                        Email Giảng viên phụ trách
                                    </label>
                                    {syllabusData.instructor && (
                                        <button
                                            type="button"
                                            onClick={handleRegenerateHcmueEmail}
                                            className="text-[11px] text-brand-jasper hover:underline font-serif-title flex items-center gap-1 font-bold cursor-pointer"
                                            title="Tính toán lại email theo chuẩn HCMUE"
                                        >
                                            <RefreshCw size={11} /> Tự tạo lại email
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    className="input-editorial w-full bg-white font-mono text-sm"
                                    value={syllabusData.instructorEmail || ''}
                                    onChange={e => setSyllabusData({ ...syllabusData, instructorEmail: e.target.value })}
                                    placeholder="Tự động sinh: [tên][họ lót viết tắt]@lecturer.hcmue.edu.vn"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1 flex items-center gap-1.5 font-bold">
                                    <Building2 size={16} className="text-brand-jasper" />
                                    Ban biên soạn đề cương (HCMUE)
                                </label>
                                <input
                                    type="text"
                                    className="input-editorial w-full bg-white"
                                    value={Array.isArray(syllabusData.authorTeam) ? syllabusData.authorTeam.join(', ') : (syllabusData.authorTeam || '')}
                                    onChange={e => setSyllabusData({ ...syllabusData, authorTeam: e.target.value })}
                                    placeholder="Ví dụ: TS. Thái Hoài Minh, TS. Mai Thu Trang..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1 flex items-center gap-1.5 font-bold">
                                    <ShieldCheck size={16} className="text-emerald-700" />
                                    Cấp phê duyệt / Trưởng khoa
                                </label>
                                <input
                                    type="text"
                                    className="input-editorial w-full bg-white"
                                    value={syllabusData.approver || ''}
                                    onChange={e => setSyllabusData({ ...syllabusData, approver: e.target.value })}
                                    placeholder="Ví dụ: Trưởng khoa Sư phạm / Ban Giám hiệu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">Mô tả mục tiêu môn học</label>
                            <textarea
                                rows="3"
                                className="input-editorial w-full resize-none bg-white font-body"
                                value={syllabusData.description || ''}
                                onChange={e => setSyllabusData({ ...syllabusData, description: e.target.value })}
                                placeholder="Nhập mô tả mục tiêu học phần, kiến thức cốt lõi và năng lực đạt được..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">Điều kiện tiên quyết / Học phần đã học</label>
                            <input
                                type="text"
                                className="input-editorial w-full bg-white"
                                value={syllabusData.prerequisites || ''}
                                onChange={e => setSyllabusData({ ...syllabusData, prerequisites: e.target.value })}
                                placeholder="Ví dụ: Giáo dục học (A2)..."
                            />
                        </div>
                    </div>

                    {/* SECTION 2: CHUẨN ĐẦU RA (CLOs) */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                            <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                                Chuẩn đầu ra môn học (CLOs)
                            </h4>
                            <button type="button" onClick={handleAddCLO} className="text-xs font-serif-title text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                                <PlusCircle size={15} /> Thêm chuẩn đầu ra
                            </button>
                        </div>

                        <div className={`space-y-3 ${(syllabusData.clos || []).length > 3 ? 'max-h-[300px] overflow-y-auto pr-1.5 editor-scrollbar' : ''}`}>
                            {(syllabusData.clos || []).map((clo, idx) => (
                                <div key={idx} className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-xs font-bold text-gray-500 w-12 sm:w-16 font-serif-title shrink-0">CLO {idx + 1}:</span>
                                    <input
                                        type="text"
                                        className="input-editorial flex-1 text-xs sm:text-sm font-body"
                                        value={clo}
                                        onChange={e => handleCLOChange(idx, e.target.value)}
                                        placeholder="Ví dụ: Phân tích được các quy luật tâm lý học lứa tuổi..."
                                    />
                                    <button type="button" onClick={() => handleRemoveCLO(idx)} className="p-1 text-red-500 hover:text-red-700 transition-colors shrink-0" title="Xóa dòng này">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 3: KHUNG BÀI HỌC THEO BUỔI */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                            <h4 className="text-base sm:text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                                Khung bài học (Theo Tuần/Buổi)
                            </h4>
                            <button type="button" onClick={handleAddScheduleRow} className="text-xs font-serif-title text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                                <PlusCircle size={15} /> Thêm Buổi học
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[460px] overflow-y-auto editor-scrollbar pr-1 sm:pr-2 border border-brand-cerulean/15 p-2 sm:p-3 bg-brand-cream/20 rounded-lg">
                            {(syllabusData.schedule || []).map((item, idx) => (
                                <div key={idx} className="p-3 sm:p-4 border border-brand-cerulean/20 bg-white space-y-2.5 relative shadow-xs rounded-lg">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div className="flex items-center justify-between sm:justify-start gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-brand-cerulean font-serif-title shrink-0">Buổi:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="input-editorial w-14 text-center font-bold text-xs"
                                                    value={item.week || idx + 1}
                                                    onChange={e => handleScheduleChange(idx, 'week', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:hidden">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="input-editorial w-12 text-center text-xs"
                                                    value={item.hours || 3}
                                                    onChange={e => handleScheduleChange(idx, 'hours', Number(e.target.value))}
                                                />
                                                <span className="text-xs text-gray-500 font-bold">tiết</span>
                                                <button type="button" onClick={() => handleRemoveScheduleRow(idx)} className="p-1 text-red-500 hover:text-red-700 transition-colors ml-1" title="Xóa buổi này">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="text"
                                                className="input-editorial w-full font-serif-title font-bold text-brand-cerulean text-xs sm:text-sm"
                                                value={item.title || ''}
                                                onChange={e => handleScheduleChange(idx, 'title', e.target.value)}
                                                placeholder="Tên bài học / Tiêu đề buổi học..."
                                            />
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                                            <input
                                                type="number"
                                                min="1"
                                                className="input-editorial w-14 text-center text-sm"
                                                value={item.hours || 3}
                                                onChange={e => handleScheduleChange(idx, 'hours', Number(e.target.value))}
                                            />
                                            <span className="text-xs text-gray-500 font-bold">tiết</span>
                                            <button type="button" onClick={() => handleRemoveScheduleRow(idx)} className="p-1 text-red-500 hover:text-red-700 transition-colors ml-1" title="Xóa buổi này">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="input-editorial w-full text-xs text-gray-600 font-body"
                                            value={item.topics || ''}
                                            onChange={e => handleScheduleChange(idx, 'topics', e.target.value)}
                                            placeholder="Nội dung thảo luận, bài tập nhóm hoặc nhiệm vụ tự nghiên cứu..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: ĐÁNH GIÁ & TRỌNG SỐ */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-brand-cerulean/20 pb-1">
                            <h4 className="text-base sm:text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                                Đánh giá & Trọng số điểm (%)
                            </h4>
                            <div>
                                {totalWeight === 100 ? (
                                    <span className="px-2.5 py-1 bg-brand-cerulean text-white text-xs font-serif-title font-bold rounded shadow-sm flex items-center gap-1">
                                        <CheckCircle2 size={13} /> Tổng trọng số: 100%
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                                        Tổng trọng số: {totalWeight}% (Cần đủ 100%)
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 bg-brand-cream border border-brand-cerulean/20 grid grid-cols-3 gap-2.5 sm:gap-6">
                            <div>
                                <label className="block text-[11px] sm:text-xs font-bold text-gray-600 mb-1">Chuyên cần (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="input-editorial w-full font-bold text-center sm:text-left text-xs sm:text-sm"
                                    value={syllabusData.weights?.attendance ?? 10}
                                    onChange={e => setSyllabusData({
                                        ...syllabusData,
                                        weights: { ...syllabusData.weights, attendance: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-bold text-gray-600 mb-1">Giữa kỳ (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="input-editorial w-full font-bold text-center sm:text-left text-xs sm:text-sm"
                                    value={syllabusData.weights?.midterm ?? 30}
                                    onChange={e => setSyllabusData({
                                        ...syllabusData,
                                        weights: { ...syllabusData.weights, midterm: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-bold text-gray-600 mb-1">Cuối kỳ (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="input-editorial w-full font-bold text-center sm:text-left text-xs sm:text-sm"
                                    value={syllabusData.weights?.final ?? 60}
                                    onChange={e => setSyllabusData({
                                        ...syllabusData,
                                        weights: { ...syllabusData.weights, final: Number(e.target.value) }
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-brand-cerulean/20">
                        <button
                            type="button"
                            onClick={() => setDisplayMode('view')}
                            className="px-6 py-2.5 border border-brand-cerulean/30 text-brand-cerulean font-serif-title text-sm hover:bg-brand-cerulean/5 transition-colors flex items-center gap-2"
                        >
                            <Eye size={15} /> Xem trước
                        </button>
                        <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors text-base sm:text-lg text-center">
                            Lưu Đề Cương Chi Tiết
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
