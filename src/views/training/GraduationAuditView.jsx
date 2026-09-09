import React, { useState, useEffect } from 'react';
import {
    GraduationCap,
    Award,
    CheckCircle2,
    Clock,
    FileText,
    ShieldCheck,
    AlertCircle,
    Printer,
    Download,
    Eye,
    Calendar,
    User,
    CheckSquare,
    Sparkles,
    ChevronRight,
    Pencil
} from 'lucide-react';
import { initialGraduationCriteria } from '../../data/trainingData';
import { Modal, EditorialSelect } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';

export const GraduationAuditView = ({ profile }) => {
    const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'certificate' | 'procedure'
    const [auditData, setAuditData] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_graduation_audit');
            if (saved) try { return JSON.parse(saved); } catch (e) {}
        }
        return initialGraduationCriteria;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_graduation_audit', JSON.stringify(auditData));
        }
    }, [auditData]);

    // Modal state for Requirement Editing
    const [isEditReqModalOpen, setIsEditReqModalOpen] = useState(false);
    const [editingReqId, setEditingReqId] = useState(null);
    const [reqForm, setReqForm] = useState({
        status: 'passed',
        currentVal: '',
        details: ''
    });

    // Modal state for Certificate Editing
    const [isEditCertModalOpen, setIsEditCertModalOpen] = useState(false);
    const [certForm, setCertForm] = useState({
        studentName: profile?.fullName || '',
        dob: profile?.dob || '',
        pob: profile?.pob || '',
        certificateSerial: auditData.predictedOutcome?.certificateSerial || 'Chưa cấp số',
        registryNumber: auditData.predictedOutcome?.registryNumber || 'Chưa vào sổ',
        projectedRank: auditData.predictedOutcome?.projectedRank || 'Chưa xếp loại',
        signatory: 'GS. TS. Huỳnh Văn Sơn',
        reviewDate: auditData.predictedOutcome?.reviewDate || ''
    });


    const handleOpenEditReq = (req) => {
        setEditingReqId(req.id);
        setReqForm({
            status: req.status,
            currentVal: req.currentVal,
            details: req.details
        });
        setIsEditReqModalOpen(true);
    };

    const handleSaveReq = (e) => {
        e.preventDefault();
        setAuditData(prev => {
            const updatedReqs = prev.requirements.map(r =>
                r.id === editingReqId ? { ...r, ...reqForm } : r
            );
            const passed = updatedReqs.filter(r => r.status === 'passed').length;
            return {
                ...prev,
                requirements: updatedReqs,
                predictedOutcome: {
                    ...prev.predictedOutcome,
                    clearancePercent: Math.round((passed / updatedReqs.length) * 100),
                    isEligible: passed === updatedReqs.length
                }
            };
        });
        setIsEditReqModalOpen(false);
    };

    const handleSaveCert = (e) => {
        e.preventDefault();
        setAuditData(prev => ({
            ...prev,
            predictedOutcome: {
                ...prev.predictedOutcome,
                certificateSerial: certForm.certificateSerial,
                projectedRank: certForm.projectedRank
            }
        }));
        setIsEditCertModalOpen(false);
    };

    const passedCount = auditData.requirements.filter(r => r.status === 'passed').length;
    const totalCount = auditData.requirements.length;
    const clearancePercent = Math.round((passedCount / totalCount) * 100);
    const isAllPassed = passedCount === totalCount;

    const renderReqStatusBadge = (status) => {
        if (status === 'passed') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 font-serif text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ĐỦ ĐIỀU KIỆN
                </span>
            );
        }
        if (status === 'pending') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 font-serif text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    ĐANG ĐỐI SOÁT
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 font-serif text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                CHƯA ĐẠT
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            <CollapsiblePageHeader
                badge={
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean text-[11px] sm:text-xs font-serif-title font-bold uppercase tracking-wider mb-1">
                        <GraduationCap className="w-3.5 h-3.5 text-brand-cerulean" />
                        Hội đồng Đào tạo • Cấp Chứng chỉ Nghiệp vụ Sư phạm
                    </div>
                }
                title="Thẩm Định Điều Kiện Tốt Nghiệp"
                subtitle={`Đối soát 5 tiêu chuẩn pháp lý theo ${auditData.targetProgram.legalBasis}, chuẩn hóa dữ liệu tín chỉ, GPA, kết quả thực tập sư phạm và ngoại ngữ - tin học trước khi Hội đồng ra quyết định công nhận tốt nghiệp.`}
                actions={({ isScrolled }) => (
                    <div className="flex items-center gap-2 sm:gap-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                        <div className={`bg-white border border-stone-200 text-center shadow-xs flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'px-2.5 py-1 gap-1.5' : 'p-1.5 sm:p-2 flex-col min-w-[75px]'
                        }`}>
                            <span className={`uppercase font-serif-title text-stone-500 transition-all duration-300 ${
                                isScrolled ? 'hidden' : 'text-[9px] block'
                            }`}>
                                Tiến độ
                            </span>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className={`w-4 h-4 transition-all duration-300 ${isAllPassed ? 'text-emerald-600' : 'text-amber-500'}`} />
                                <span className={`font-serif-title font-bold text-brand-cerulean transition-all duration-300 leading-tight ${
                                    isScrolled ? 'text-xs sm:text-sm' : 'text-base sm:text-xl'
                                }`}>
                                    {clearancePercent}%
                                </span>
                            </div>
                        </div>
                        <div className={`bg-white border border-stone-200 text-center shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'px-2.5 py-1' : 'p-1.5 sm:p-2 min-w-[85px]'
                        }`}>
                            <span className={`uppercase font-serif-title text-stone-500 transition-all duration-300 ${
                                isScrolled ? 'hidden' : 'text-[9px] block'
                            }`}>
                                Trạng thái
                            </span>
                            <span className={`font-serif-title font-bold transition-all duration-300 ${
                                isScrolled ? 'text-xs' : 'text-xs sm:text-sm block'
                            } ${isAllPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {isAllPassed ? 'Đủ điều kiện' : 'Đang đối soát'}
                            </span>
                        </div>


                    </div>
                )}
            />

            {/* Segmented Pill Tab Switcher */}
            <div className="flex w-full p-1 bg-brand-cream border border-brand-cerulean/30 rounded shadow-xs overflow-x-auto gap-1">
                {[
                    { id: 'audit', label: '5 Trụ Cột', count: `${passedCount}/${totalCount}`, icon: ShieldCheck },
                    { id: 'certificate', label: 'Phôi Chứng Chỉ', icon: Award },
                    { id: 'procedure', label: 'Quy Trình Xét Cấp', icon: FileText }
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
                            {tab.count && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans ${isActive ? 'bg-white/20 text-white' : 'bg-brand-cerulean/15 text-brand-cerulean'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: THẨM ĐỊNH 5 TRỤ CỘT ĐIỀU KIỆN */}
            {activeTab === 'audit' && (
                <div className="space-y-6">
                    {/* Summary Outcome Box */}
                    <div className="bg-white border-editorial shadow-editorial p-4 sm:p-6 border-l-4 border-l-brand-cerulean">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-[11px] sm:text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                    Dự thảo Kết luận của Hội đồng Đào tạo:
                                </span>
                                <h3 className="font-serif-title font-bold text-stone-900 text-base sm:text-lg">
                                    {isAllPassed
                                        ? 'ĐỦ ĐIỀU KIỆN TỐT NGHIỆP & ĐỀ NGHỊ CẤP CHỨNG CHỈ NVSP'
                                        : 'CHƯA ĐỦ ĐIỀU KIỆN TỐT NGHIỆP & ĐANG THẨM ĐỊNH HỒ SƠ'}
                                </h3>
                                <p className="text-xs text-stone-600 font-sans">
                                    Dự kiến xếp loại: <strong className="text-stone-900 font-serif-title font-bold text-brand-jasper">{auditData.predictedOutcome?.projectedRank || 'Chưa xếp loại'}</strong> • Số hiệu: <strong className="font-mono text-stone-800">{auditData.predictedOutcome?.certificateSerial || 'Chưa cấp số'}</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab('certificate')}
                                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial self-start md:self-auto"
                            >
                                <Eye className="w-4 h-4" />
                                Xem Phôi Chứng Chỉ
                            </button>
                        </div>
                    </div>

                    {/* 5 Pillars Requirement Cards */}
                    <div className="space-y-4">
                        {auditData.requirements.map((req, idx) => {
                            return (
                                <div
                                    key={req.id}
                                    className={`bg-white border-editorial shadow-editorial p-3.5 sm:p-6 border-l-4 transition-colors ${
                                        req.status === 'passed'
                                            ? 'border-l-emerald-600'
                                            : req.status === 'pending'
                                                ? 'border-l-amber-500'
                                                : 'border-l-rose-500'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-brand-cerulean/10 text-brand-cerulean font-mono text-xs font-bold flex items-center justify-center border border-brand-cerulean/20 shrink-0">
                                                {idx + 1}
                                            </div>
                                            <h4 className="font-serif-title font-bold text-stone-900 text-base sm:text-lg">
                                                {req.title}
                                            </h4>
                                        </div>

                                        <div className="flex items-center gap-2 self-start sm:self-auto">
                                            {renderReqStatusBadge(req.status)}
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditReq(req)}
                                                className="p-1.5 text-brand-cerulean hover:bg-brand-cream border border-stone-200 transition-colors"
                                                title="Sửa thẩm định"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-xs text-stone-600 font-sans mb-3 sm:mb-4 pl-0 sm:pl-9">
                                        {req.desc}
                                    </p>

                                    <div className="pl-0 sm:pl-9 grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-stone-200 text-xs font-sans">
                                        <div className="bg-stone-50 p-3 border border-stone-200">
                                            <span className="font-serif-title font-bold text-stone-500 block mb-1">
                                                Chuẩn yêu cầu tối thiểu:
                                            </span>
                                            <span className="font-mono font-bold text-stone-800">
                                                {req.requiredVal}
                                            </span>
                                        </div>

                                        <div className="bg-brand-cream/50 p-3 border border-brand-cerulean/20">
                                            <span className="font-serif-title font-bold text-brand-cerulean block mb-1">
                                                Thực tế đã tích lũy:
                                            </span>
                                            <span className="font-mono font-bold text-brand-cerulean">
                                                {req.currentVal}
                                            </span>
                                        </div>

                                        <div className="bg-stone-50 p-3 border border-stone-200">
                                            <span className="font-serif-title font-bold text-stone-500 block mb-1">
                                                Ghi chú thẩm định:
                                            </span>
                                            <span className="text-stone-700 leading-tight">
                                                {req.details}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 2: BẢN PHÁC THẢO PHÔI CHỨNG CHỈ NVSP */}
            {activeTab === 'certificate' && (
                <div className="space-y-6">
                    <div className="bg-white border-editorial shadow-editorial p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-serif-title font-bold text-stone-900 text-lg">
                                Bản Xem Trước Phôi Chứng Chỉ Nghiệp Vụ Sư Phạm
                            </h3>
                            <p className="text-xs text-stone-500 font-sans mt-0.5">
                                Bản phác thảo thiết kế theo quy chuẩn mẫu văn bằng chứng chỉ quốc gia của Bộ Giáo dục và Đào tạo.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditCertModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 border border-stone-300 text-stone-700 font-serif-title font-bold text-xs hover:bg-stone-200"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                Sửa thông tin phôi
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                In phôi mẫu
                            </button>
                        </div>
                    </div>

                    {/* Certificate Paper Canvas */}
                    <div className="max-w-4xl mx-auto bg-white border-8 border-double border-amber-900/40 p-10 shadow-editorial text-stone-900 relative">
                        {/* Corner decorative borders */}
                        <div className="border-4 border-amber-800/30 p-8 text-center space-y-6">
                            {/* Header */}
                            <div className="space-y-1">
                                <div className="text-xs font-serif uppercase tracking-widest text-stone-700 font-bold">
                                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                </div>
                                <div className="text-xs font-serif text-stone-700 italic border-b border-stone-400 pb-2 inline-block">
                                    Độc lập - Tự do - Hạnh phúc
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <div className="text-sm font-serif font-bold text-brand-cerulean uppercase tracking-wider">
                                    HIỆU TRƯỞNG TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
                                </div>
                                <div className="text-xs font-serif italic text-stone-600">
                                    Cấp cho:
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-wide uppercase pt-1">
                                    {certForm.studentName}
                                </h2>
                                <div className="text-xs font-serif text-stone-600">
                                    Sinh ngày: <strong>{certForm.dob}</strong> • Nơi sinh: <strong>{certForm.pob}</strong>
                                </div>
                            </div>

                            <div className="py-2">
                                <div className="text-base font-serif font-bold text-brand-jasper uppercase tracking-widest border-t-2 border-b-2 border-brand-jasper/30 py-2 inline-block">
                                    CHỨNG CHỈ BỒI DƯỠNG NGHIỆP VỤ SƯ PHẠM
                                </div>
                                <div className="text-sm font-serif font-bold text-stone-800 uppercase mt-1">
                                    DÀNH CHO GIÁO VIÊN TRUNG HỌC PHỔ THÔNG
                                </div>
                            </div>

                            <div className="text-xs font-serif text-stone-700 space-y-1 max-w-xl mx-auto leading-relaxed">
                                <p>Đã hoàn thành khóa đào tạo bồi dưỡng nghiệp vụ sư phạm theo đúng quy định tại {auditData.targetProgram.legalBasis}.</p>
                                <p>Điểm trung bình toàn khóa: <strong className="font-mono">{auditData.requirements.find(r => r.id === 'req_gpa')?.currentVal || '---'}</strong> • Xếp loại tốt nghiệp: <strong className="text-brand-jasper uppercase font-bold">{certForm.projectedRank}</strong></p>
                            </div>

                            {/* Seal and signatures */}
                            <div className="grid grid-cols-2 gap-8 pt-8 text-xs font-serif">
                                <div className="text-left space-y-1">
                                    <div>Số hiệu chứng chỉ: <strong className="font-mono">{certForm.certificateSerial}</strong></div>
                                    <div>Vào sổ cấp chứng chỉ số: <strong className="font-mono">{certForm.registryNumber}</strong></div>
                                </div>

                                <div className="text-center space-y-1">
                                    <div className="italic text-stone-600">
                                        TP. Hồ Chí Minh{certForm.reviewDate ? `, ngày ${certForm.reviewDate}` : ', ngày ..... tháng ..... năm 2026'}
                                    </div>
                                    <div className="font-bold uppercase text-stone-900">HIỆU TRƯỞNG</div>
                                    <div className="text-stone-400 italic text-[11px] pt-12">
                                        (Đã ký tên và đóng dấu)
                                    </div>
                                    <div className="font-bold font-serif text-stone-900 pt-2">{certForm.signatory}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: QUY TRÌNH XÉT DUYỆT & CẤP PHÁT */}
            {activeTab === 'procedure' && (
                <div className="bg-white border-editorial shadow-editorial p-6 space-y-6">
                    <div>
                        <h3 className="font-serif-title font-bold text-stone-900 text-xl">
                            Quy Trình 5 Giai Đoạn Xét Duyệt & Cấp Phát Chứng Chỉ Sư Phạm
                        </h3>
                        <p className="text-xs text-stone-500 font-sans mt-1">
                            Quy trình chuẩn hóa hồ sơ học viên từ kiểm tra điều kiện đến ký duyệt và bàn giao văn bằng chứng chỉ chính thức.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                step: "Giai đoạn 1",
                                title: "Kiểm tra tích lũy tín chỉ & Hồ sơ học tập cá nhân",
                                desc: "Phòng Quản trị Đào tạo đối soát khung 35 tín chỉ, điểm các học phần thành phần và kiểm tra các chứng chỉ điều kiện tiên quyết (Ngoại ngữ, Tin học).",
                                time: "Tuần 1 tháng tốt nghiệp"
                            },
                            {
                                step: "Giai đoạn 2",
                                title: "Tổng hợp kết quả Thực tập Sư phạm từ Trường Phổ thông",
                                desc: "Khoa Sư phạm tiếp nhận hồ sơ, giáo án thực tập và biên bản đánh giá từ Ban chỉ đạo thực tập tại trường THPT liên kết.",
                                time: "Tuần 2 tháng tốt nghiệp"
                            },
                            {
                                step: "Giai đoạn 3",
                                title: "Hội đồng Xét Tốt nghiệp Nhà trường họp thông qua",
                                desc: "Hội đồng xét duyệt danh sách học viên đủ điều kiện, giải quyết các khiếu nại (nếu có) và lập biên bản kết luận trình Hiệu trưởng.",
                                time: "Tuần 3 tháng tốt nghiệp"
                            },
                            {
                                step: "Giai đoạn 4",
                                title: "Ban hành Quyết định công nhận tốt nghiệp & In phôi",
                                desc: "Hiệu trưởng ký quyết định công nhận tốt nghiệp, cấp mã số hiệu phôi chứng chỉ theo phân bổ của Bộ Giáo dục và Đào tạo.",
                                time: "Tuần 4 tháng tốt nghiệp"
                            },
                            {
                                step: "Giai đoạn 5",
                                title: "Tổ chức Lễ trao Chứng chỉ & Bàn giao Hồ sơ",
                                desc: "Trao chứng chỉ chính thức và hồ sơ học tập (Bảng điểm gốc, Nhật ký TTSP) cho tân nhà giáo.",
                                time: "Cuối khóa đào tạo"
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-4 border border-stone-200 bg-brand-cream/30 hover:bg-brand-cream/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-brand-cerulean text-white font-mono text-[11px] font-bold">
                                            {item.step}
                                        </span>
                                        <h4 className="font-serif-title font-bold text-stone-900 text-base">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className="text-right min-w-[150px]">
                                    <span className="text-[11px] font-mono text-stone-500 bg-white px-2.5 py-1 border border-stone-200">
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL: CHỈNH SỬA THẨM ĐỊNH TIÊU CHUẨN */}
            <Modal
                isOpen={isEditReqModalOpen}
                onClose={() => setIsEditReqModalOpen(false)}
                title="Cập Nhật Kết Quả Thẩm Định Tiêu Chuẩn Tốt Nghiệp"
            >
                <form onSubmit={handleSaveReq} className="space-y-4">
                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Trạng thái thẩm định *
                        </label>
                        <EditorialSelect
                            value={reqForm.status}
                            onChange={(val) => setReqForm({ ...reqForm, status: val })}
                            options={[
                                { value: 'passed', label: 'Đủ điều kiện (Đã thẩm định đạt chuẩn)' },
                                { value: 'pending', label: 'Chưa đạt (Đang chờ bổ sung hồ sơ)' }
                            ]}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Giá trị thực tế tích lũy *
                        </label>
                        <input
                            type="text"
                            required
                            value={reqForm.currentVal}
                            onChange={(e) => setReqForm({ ...reqForm, currentVal: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-300 text-xs font-mono focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                            Ghi chú / Chi tiết hồ sơ xác minh:
                        </label>
                        <textarea
                            rows={3}
                            value={reqForm.details}
                            onChange={(e) => setReqForm({ ...reqForm, details: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                        <button
                            type="button"
                            onClick={() => setIsEditReqModalOpen(false)}
                            className="px-4 py-2 border border-stone-300 text-xs font-serif font-bold text-stone-700 hover:bg-stone-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white text-xs font-serif font-bold hover:bg-brand-cerulean/90 shadow-sm"
                        >
                            Lưu Thẩm Định
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: CHỈNH SỬA THÔNG TIN PHÔI CHỨNG CHỈ */}
            <Modal
                isOpen={isEditCertModalOpen}
                onClose={() => setIsEditCertModalOpen(false)}
                title="Chỉnh Sửa Thông Tin In Phôi Chứng Chỉ Nghiệp Vụ Sư Phạm"
            >
                <form onSubmit={handleSaveCert} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Họ và tên người nhận *
                            </label>
                            <input
                                type="text"
                                required
                                value={certForm.studentName}
                                onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs uppercase font-serif font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Ngày sinh *
                            </label>
                            <input
                                type="text"
                                required
                                value={certForm.dob}
                                onChange={(e) => setCertForm({ ...certForm, dob: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Nơi sinh *
                            </label>
                            <input
                                type="text"
                                required
                                value={certForm.pob}
                                onChange={(e) => setCertForm({ ...certForm, pob: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Xếp loại tốt nghiệp *
                            </label>
                            <EditorialSelect
                                value={certForm.projectedRank}
                                onChange={(val) => setCertForm({ ...certForm, projectedRank: val })}
                                options={[
                                    { value: 'Xuất sắc (High Distinction)', label: 'Xuất sắc' },
                                    { value: 'Giỏi (Distinction)', label: 'Giỏi' },
                                    { value: 'Khá (Credit)', label: 'Khá' },
                                    { value: 'Trung bình (Pass)', label: 'Trung bình' }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Số hiệu chứng chỉ *
                            </label>
                            <input
                                type="text"
                                required
                                value={certForm.certificateSerial}
                                onChange={(e) => setCertForm({ ...certForm, certificateSerial: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Số vào sổ cấp *
                            </label>
                            <input
                                type="text"
                                required
                                value={certForm.registryNumber}
                                onChange={(e) => setCertForm({ ...certForm, registryNumber: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Ngày ký cấp chứng chỉ
                            </label>
                            <input
                                type="text"
                                value={certForm.reviewDate}
                                onChange={(e) => setCertForm({ ...certForm, reviewDate: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                                Người ký (Hiệu trưởng)
                            </label>
                            <input
                                type="text"
                                value={certForm.signatory}
                                onChange={(e) => setCertForm({ ...certForm, signatory: e.target.value })}
                                className="w-full px-3 py-2 border border-stone-300 text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                        <button
                            type="button"
                            onClick={() => setIsEditCertModalOpen(false)}
                            className="px-4 py-2 border border-stone-300 text-xs font-serif font-bold text-stone-700 hover:bg-stone-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white text-xs font-serif font-bold hover:bg-brand-cerulean/90 shadow-sm"
                        >
                            Cập Nhật Phôi
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
