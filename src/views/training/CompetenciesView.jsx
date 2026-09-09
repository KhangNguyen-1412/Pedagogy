import React, { useState, useEffect } from 'react';
import {
    Award,
    Compass,
    CheckCircle2,
    Clock,
    BookOpen,
    FileText,
    Pencil,
    Sparkles,
    ShieldCheck,
    CheckSquare,
    Layers,
    ChevronDown,
    ChevronUp,
    Download,
    Filter,
    Trash2
} from 'lucide-react';
import { EditorialSelect, Modal } from '../../components/common/EditorialWidgets';
import { initialTeacherCompetencies, initialPloMatrix } from '../../data/trainingData';

export const CompetenciesView = () => {
    const [activeTab, setActiveTab] = useState('tt20'); // 'tt20' | 'plo' | 'guidelines'
    const [competencies, setCompetencies] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_competencies');
            if (saved) try { return JSON.parse(saved); } catch (e) {}
        }
        return initialTeacherCompetencies;
    });
    const [ploMatrix, setPloMatrix] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_plo_matrix');
            if (saved) try { return JSON.parse(saved); } catch (e) {}
        }
        return initialPloMatrix;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_competencies', JSON.stringify(competencies));
        }
    }, [competencies]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pedagogy_plo_matrix', JSON.stringify(ploMatrix));
        }
    }, [ploMatrix]);
    const [expandedStandards, setExpandedStandards] = useState(['std_1', 'std_2']);

    // Modal state for editing a criterion
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCriterion, setEditingCriterion] = useState(null);
    const [standardIdForEdit, setStandardIdForEdit] = useState(null);
    const [criterionForm, setCriterionForm] = useState({
        level: 'good',
        evidence: '',
        notes: ''
    });

    // Toggle accordion
    const toggleStandard = (id) => {
        setExpandedStandards(prev =>
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    // Open Edit Modal
    const handleOpenEdit = (stdId, crit) => {
        setStandardIdForEdit(stdId);
        setEditingCriterion(crit);
        setCriterionForm({
            level: crit.level,
            evidence: crit.evidence || '',
            notes: crit.notes || ''
        });
        setIsEditModalOpen(true);
    };

    // Save Criterion changes
    const handleSaveCriterion = (e) => {
        e.preventDefault();
        setCompetencies(prev => prev.map(std => {
            if (std.standardId === standardIdForEdit) {
                return {
                    ...std,
                    criteria: std.criteria.map(c => {
                        if (c.id === editingCriterion.id) {
                            return {
                                ...c,
                                level: criterionForm.level,
                                evidence: criterionForm.evidence,
                                notes: criterionForm.notes
                            };
                        }
                        return c;
                    })
                };
            }
            return std;
        }));
        setIsEditModalOpen(false);
    };

    // Helper counts
    const allCriteria = competencies.flatMap(s => s.criteria);
    const goodCount = allCriteria.filter(c => c.level === 'good').length;
    const fairCount = allCriteria.filter(c => c.level === 'fair').length;
    const passCount = allCriteria.filter(c => c.level === 'pass').length;
    const failCount = allCriteria.filter(c => c.level === 'fail').length;

    const ploAchievedCount = ploMatrix.filter(p => p.status === 'achieved').length;

    const getLevelBadge = (level) => {
        switch (level) {
            case 'good':
                return <span className="px-2.5 py-1 text-xs font-serif font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Tốt</span>;
            case 'fair':
                return <span className="px-2.5 py-1 text-xs font-serif font-bold bg-sky-100 text-sky-800 border border-sky-300">Khá</span>;
            case 'pass':
                return <span className="px-2.5 py-1 text-xs font-serif font-bold bg-amber-100 text-amber-800 border border-amber-300">Đạt</span>;
            case 'fail':
                return <span className="px-2.5 py-1 text-xs font-serif font-bold bg-rose-100 text-rose-800 border border-rose-300">Chưa đạt</span>;
            case 'unrated':
            default:
                return <span className="px-2.5 py-1 text-xs font-serif font-bold bg-stone-100 text-stone-600 border border-stone-300">Chưa đánh giá</span>;
        }
    };

    let overallRating = 'CHƯA ĐÁNH GIÁ';
    let overallBadgeClass = 'bg-stone-500 text-white';
    if (failCount > 0) {
        overallRating = 'CHƯA ĐẠT (UNQUALIFIED)';
        overallBadgeClass = 'bg-rose-700 text-white';
    } else if (goodCount >= 10 && (goodCount + fairCount) === 15) {
        overallRating = 'LOẠI TỐT (EXCELLENT)';
        overallBadgeClass = 'bg-emerald-700 text-white';
    } else if ((goodCount + fairCount + passCount) === 15) {
        overallRating = 'LOẠI KHÁ (GOOD)';
        overallBadgeClass = 'bg-sky-700 text-white';
    } else if (passCount + fairCount + goodCount > 0) {
        overallRating = 'ĐANG TỰ ĐÁNH GIÁ';
        overallBadgeClass = 'bg-amber-600 text-white';
    }

    const handleResetCompetencies = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ đánh giá và minh chứng mẫu để nhập mới?')) {
            setCompetencies(initialTeacherCompetencies);
            setPloMatrix(initialPloMatrix);
            if (typeof window !== 'undefined') {
                localStorage.setItem('pedagogy_competencies', JSON.stringify(initialTeacherCompetencies));
                localStorage.setItem('pedagogy_plo_matrix', JSON.stringify(initialPloMatrix));
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Top Sticky Header */}
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2.5 py-0.5 text-xs font-bold font-serif-title bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 rounded uppercase tracking-wider">
                            Thông tư 20/2018/TT-BGDĐT
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-bold font-serif-title bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/20 rounded">
                            5 Tiêu chuẩn &bull; 15 Tiêu chí
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-serif-title text-brand-cerulean flex items-center gap-3">
                        <Award className="text-brand-cerulean shrink-0" size={36} />
                        Chuẩn Nghề Nghiệp Giáo Viên & Ma Trận PLO
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 font-body leading-relaxed mt-1">
                        Hệ thống tự đánh giá năng lực nghề nghiệp giáo viên cơ sở giáo dục phổ thông, quản trị minh chứng và đối soát chuẩn đầu ra.
                    </p>
                </div>

                {/* Score Stats & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-white border border-brand-cerulean/20 px-3.5 py-2 text-center shadow-xs">
                            <div className="text-2xl font-serif-title font-bold text-emerald-700">{goodCount} <span className="text-xs text-gray-400">/ 15</span></div>
                            <div className="text-[10px] font-serif-title uppercase tracking-wider text-emerald-800 font-bold">Mức Tốt</div>
                        </div>
                        <div className="bg-white border border-brand-cerulean/20 px-3.5 py-2 text-center shadow-xs">
                            <div className="text-2xl font-serif-title font-bold text-sky-700">{fairCount} <span className="text-xs text-gray-400">/ 15</span></div>
                            <div className="text-[10px] font-serif-title uppercase tracking-wider text-sky-800 font-bold">Mức Khá</div>
                        </div>
                        <div className="bg-white border border-brand-cerulean/20 px-3.5 py-2 text-center shadow-xs">
                            <div className="text-2xl font-serif-title font-bold text-brand-cerulean">{ploAchievedCount} <span className="text-xs text-gray-400">/ {ploMatrix.length}</span></div>
                            <div className="text-[10px] font-serif-title uppercase tracking-wider text-brand-cerulean font-bold">Chuẩn PLO</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleResetCompetencies}
                        className="px-3 py-2 bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-200 text-xs font-serif-title flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                        title="Xóa toàn bộ đánh giá và minh chứng mẫu"
                    >
                        <Trash2 size={14} /> Xóa mẫu
                    </button>
                </div>
            </header>

            {/* Segmented Tab Switcher */}
            <div className="flex items-center justify-between gap-4 border-b border-brand-cerulean/20 pb-4">
                <div className="inline-flex p-1 bg-brand-cream border border-brand-cerulean/30 rounded shadow-xs flex-wrap gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('tt20')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-serif-title font-bold transition-all rounded ${
                            activeTab === 'tt20'
                                ? 'bg-brand-cerulean text-white shadow-xs'
                                : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                        }`}
                    >
                        <Award size={15} /> 5 Tiêu chuẩn – 15 Tiêu chí (TT 20)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('plo')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-serif-title font-bold transition-all rounded ${
                            activeTab === 'plo'
                                ? 'bg-brand-cerulean text-white shadow-xs'
                                : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                        }`}
                    >
                        <Compass size={15} /> Ma trận Chuẩn đầu ra (PLO)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('guidelines')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-serif-title font-bold transition-all rounded ${
                            activeTab === 'guidelines'
                                ? 'bg-brand-cerulean text-white shadow-xs'
                                : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                        }`}
                    >
                        <BookOpen size={15} /> Quy trình & Hướng dẫn Minh chứng
                    </button>
                </div>
            </div>

            {/* TAB 1: 5 TIÊU CHUẨN 15 TIÊU CHÍ */}
            {activeTab === 'tt20' && (
                <div className="space-y-6">
                    {/* Status Overview Card */}
                    <div className="bg-white border-editorial shadow-editorial p-6 border-l-4 border-l-brand-cerulean flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="px-2 py-0.5 text-[11px] font-bold font-serif-title bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 rounded uppercase tracking-wider">
                                Điều 10 • Thông tư 20/2018/TT-BGDĐT
                            </span>
                            <h3 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold mt-1">
                                Kết Quả Tự Đánh Giá Chuẩn Nghề Nghiệp Giáo Viên Toàn Diện
                            </h3>
                            <p className="text-xs text-gray-600 font-sans leading-relaxed">
                                Đạt mức <strong>TỐT</strong> khi có tất cả tiêu chí đạt loại khá trở lên và tối thiểu 2/3 tiêu chí đạt loại tốt (bao gồm các tiêu chí cốt lõi 3, 4, 5, 6, 7).
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <span className="text-xs text-gray-500 font-serif-title block">Xếp loại tự đánh giá:</span>
                                <span className={`inline-block px-3 py-1 font-serif-title font-bold text-sm rounded ${overallBadgeClass}`}>
                                    {overallRating}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Standards Accordion List */}
                    <div className="space-y-4">
                        {competencies.map((standard) => {
                            const isExpanded = expandedStandards.includes(standard.standardId);
                            const stdCriteriaCount = standard.criteria.length;
                            const stdGoodCount = standard.criteria.filter(c => c.level === 'good').length;

                            return (
                                <div
                                    key={standard.standardId}
                                    className="bg-white border-editorial shadow-editorial overflow-hidden"
                                >
                                    {/* Standard Header */}
                                    <div
                                        onClick={() => toggleStandard(standard.standardId)}
                                        className="p-5 bg-brand-cream/40 border-b border-brand-cerulean/20 flex items-center justify-between cursor-pointer hover:bg-blue-50/40 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-brand-cerulean" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-stone-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-serif-title font-bold text-brand-cerulean text-lg leading-snug">
                                                    {standard.standardName}
                                                </h4>
                                                <p className="text-xs text-stone-500 font-sans mt-0.5 line-clamp-1">
                                                    {standard.standardDesc}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono font-bold text-brand-cerulean bg-white px-2.5 py-1 border border-brand-cerulean/30 rounded">
                                                {stdGoodCount}/{stdCriteriaCount} Tốt
                                            </span>
                                        </div>
                                    </div>

                                    {/* Standard Criteria Details */}
                                    {isExpanded && (
                                        <div className="p-6 space-y-4">
                                            <p className="text-xs italic text-stone-600 font-sans bg-brand-cream/30 p-3 border-l-4 border-brand-cerulean">
                                                {standard.standardDesc}
                                            </p>

                                            <div className="space-y-3">
                                                {standard.criteria.map((crit) => (
                                                    <div
                                                        key={crit.id}
                                                        className="border-editorial p-4 hover:bg-blue-50/20 transition-colors bg-white shadow-xs space-y-2"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-mono text-xs font-bold rounded">
                                                                    {crit.code}
                                                                </span>
                                                                <h5 className="font-serif-title font-bold text-stone-900 text-base">
                                                                    {crit.name}
                                                                </h5>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {getLevelBadge(crit.level)}
                                                                <button
                                                                    onClick={() => handleOpenEdit(standard.standardId, crit)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-serif-title font-bold text-brand-cerulean bg-brand-cream hover:bg-brand-cerulean hover:text-white border border-brand-cerulean/30 transition-all rounded shadow-xs"
                                                                >
                                                                    <Pencil className="w-3 h-3" />
                                                                    Cập nhật minh chứng
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-stone-600 font-sans mb-3 leading-relaxed">
                                                            {crit.desc}
                                                        </p>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-stone-100 text-xs font-sans">
                                                            <div className="bg-brand-cream/30 p-2.5 border border-brand-cerulean/10">
                                                                <span className="font-serif font-bold text-brand-cerulean block mb-1">
                                                                    Minh chứng xác thực:
                                                                </span>
                                                                <span className="text-stone-800 leading-relaxed">
                                                                    {crit.evidence || 'Chưa cập nhật minh chứng.'}
                                                                </span>
                                                            </div>
                                                            <div className="bg-stone-50 p-2.5 border border-stone-200">
                                                                <span className="font-serif font-bold text-stone-700 block mb-1">
                                                                    Ghi chú rèn luyện:
                                                                </span>
                                                                <span className="text-stone-600 leading-relaxed">
                                                                    {crit.notes || 'Không có ghi chú thêm.'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 2: MA TRẬN CHUẨN ĐẦU RA (PLO MATRIX) */}
            {activeTab === 'plo' && (
                <div className="space-y-6">
                    <div className="bg-white border-editorial shadow-editorial p-6 border-l-4 border-l-brand-cerulean flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="px-2 py-0.5 text-[11px] font-bold font-serif-title bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 rounded uppercase tracking-wider">
                                Khung Kiểm định Chất lượng GDĐH
                            </span>
                            <h3 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold mt-1">
                                Ma Trận Đo Lường Chuẩn Đầu Ra Chương Trình (PLO Matrix)
                            </h3>
                            <p className="text-xs text-gray-600 font-sans mt-0.5">
                                Bản đồ liên kết các học phần sư phạm với 6 chuẩn đầu ra kiến thức, kỹ năng và phẩm chất nghề nghiệp theo khung chuẩn.
                            </p>
                        </div>
                        <div className="text-xs font-serif-title bg-brand-cream px-3.5 py-2 border border-brand-cerulean/30 text-brand-cerulean font-bold rounded shadow-xs">
                            Tỷ lệ đạt chuẩn: {Math.round((ploAchievedCount / ploMatrix.length) * 100)}%
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ploMatrix.map((plo) => {
                            const isAchieved = plo.status === 'achieved';
                            const isInProgress = plo.status === 'in_progress';

                            return (
                                <div
                                    key={plo.ploCode}
                                    className={`bg-white border-editorial shadow-editorial p-6 space-y-3 group hover:bg-blue-50/20 transition-colors ${
                                        isAchieved
                                            ? 'border-t-4 border-t-emerald-600'
                                            : isInProgress
                                                ? 'border-t-4 border-t-sky-600'
                                                : 'border-t-4 border-t-stone-400'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="px-2.5 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-mono text-xs font-bold rounded">
                                                {plo.ploCode}
                                            </span>
                                            <h4 className="font-serif-title font-bold text-brand-cerulean text-lg mt-1.5 leading-snug">
                                                {plo.ploName}
                                            </h4>
                                        </div>
                                        <span className={`text-xs font-serif-title font-bold px-2.5 py-1 rounded ${
                                            isAchieved
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : isInProgress
                                                    ? 'bg-sky-100 text-sky-800'
                                                    : 'bg-stone-100 text-stone-600'
                                        }`}>
                                            {isAchieved ? 'Đã đạt chuẩn' : isInProgress ? 'Đang tích lũy' : 'Kế hoạch'}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 font-sans leading-relaxed">
                                        {plo.desc}
                                    </p>

                                    <div className="pt-3 border-t border-stone-100">
                                        <div className="text-[11px] font-serif-title font-bold text-gray-500 uppercase mb-1.5">
                                            Học phần đảm nhận đo lường:
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {plo.targetModules.map((modCode) => (
                                                <span
                                                    key={modCode}
                                                    className="px-2 py-0.5 bg-brand-cream border border-brand-cerulean/20 font-mono text-xs text-brand-cerulean font-bold rounded"
                                                >
                                                    {modCode}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 3: QUY TRÌNH & HƯỚNG DẪN MINH CHỨNG */}
            {activeTab === 'guidelines' && (
                <div className="bg-white border-editorial shadow-editorial p-6 space-y-6">
                    <div>
                        <span className="px-2 py-0.5 text-[11px] font-bold font-serif-title bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 rounded uppercase tracking-wider">
                            Quy chuẩn 3 Bước
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif-title text-brand-cerulean font-bold mt-1">
                            Quy Trình Đánh Giá & Thu Thập Hồ Sơ Minh Chứng Theo Thông Tư 20/2018
                        </h3>
                        <p className="text-xs text-gray-500 font-sans mt-1">
                            Quy chuẩn 3 bước thẩm định xếp loại chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border-editorial p-5 bg-brand-cream/30 space-y-2">
                            <span className="w-7 h-7 rounded-full bg-brand-cerulean text-white flex items-center justify-center font-mono font-bold text-xs mb-2 shadow-xs">
                                1
                            </span>
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-base">
                                Bước 1: Tự đánh giá
                            </h4>
                            <p className="text-xs text-gray-600 font-sans leading-relaxed">
                                Giáo viên hoàn thiện phiếu tự đánh giá, đối chiếu thực tế giảng dạy và đính kèm đầy đủ hồ sơ minh chứng xác thực cho từng tiêu chí trong số 15 tiêu chí.
                            </p>
                        </div>

                        <div className="border-editorial p-5 bg-brand-cream/30 space-y-2">
                            <span className="w-7 h-7 rounded-full bg-brand-cerulean text-white flex items-center justify-center font-mono font-bold text-xs mb-2 shadow-xs">
                                2
                            </span>
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-base">
                                Bước 2: Đồng nghiệp đánh giá
                            </h4>
                            <p className="text-xs text-gray-600 font-sans leading-relaxed">
                                Tổ chuyên môn tổ chức họp đóng góp ý kiến và ghi nhận kết quả đánh giá thành viên dựa trên báo cáo tự đánh giá và hồ sơ minh chứng đã nộp.
                            </p>
                        </div>

                        <div className="border-editorial p-5 bg-brand-cream/30 space-y-2">
                            <span className="w-7 h-7 rounded-full bg-brand-cerulean text-white flex items-center justify-center font-mono font-bold text-xs mb-2 shadow-xs">
                                3
                            </span>
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-base">
                                Bước 3: Người đứng đầu đánh giá
                            </h4>
                            <p className="text-xs text-gray-600 font-sans leading-relaxed">
                                Hiệu trưởng xem xét kết quả tự đánh giá và ý kiến của tổ chuyên môn, ra thông báo kết quả đánh giá và xếp loại chuẩn nghề nghiệp giáo viên toàn diện.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-brand-cream/60 border border-brand-cerulean/30 rounded flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-brand-cerulean shrink-0" />
                            <div>
                                <h4 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                    Tải biểu mẫu Phiếu tự đánh giá Chuẩn nghề nghiệp (File Word .docx)
                                </h4>
                                <p className="text-xs text-gray-600 font-sans">
                                    Mẫu Phụ lục ban hành kèm theo Thông tư số 20/2018/TT-BGDĐT của Bộ GD&ĐT.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => alert('Đang xuất biểu mẫu Thông tư 20/2018...')}
                            className="px-4 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-editorial transition-all"
                        >
                            Tải file mẫu
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: CẬP NHẬT MINH CHỨNG & MỨC TỰ ĐÁNH GIÁ */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`Cập nhật: ${editingCriterion?.code} - ${editingCriterion?.name}`}
            >
                <form onSubmit={handleSaveCriterion} className="space-y-4">
                    <div>
                        <label className="block text-xs font-serif-title font-bold text-stone-800 mb-1">
                            Mức tự đánh giá *
                        </label>
                        <EditorialSelect
                            value={criterionForm.level}
                            onChange={(val) => setCriterionForm({ ...criterionForm, level: val })}
                            options={[
                                { value: 'good', label: 'Tốt (Vượt trội, chia sẻ và hỗ trợ đồng nghiệp)' },
                                { value: 'fair', label: 'Khá (Thành thạo, hoàn thành tốt yêu cầu)' },
                                { value: 'pass', label: 'Đạt (Đáp ứng đủ điều kiện cơ bản)' },
                                { value: 'fail', label: 'Chưa đạt (Cần tiếp tục rèn luyện)' }
                            ]}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif-title font-bold text-stone-800 mb-1">
                            Hồ sơ Minh chứng xác thực *
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={criterionForm.evidence}
                            onChange={(e) => setCriterionForm({ ...criterionForm, evidence: e.target.value })}
                            placeholder="Ghi rõ văn bản, quyết định, biên bản dự giờ, số liệu kết quả chứng minh..."
                            className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-serif-title font-bold text-stone-800 mb-1">
                            Ghi chú / Kế hoạch rèn luyện thêm:
                        </label>
                        <textarea
                            rows={2}
                            value={criterionForm.notes}
                            onChange={(e) => setCriterionForm({ ...criterionForm, notes: e.target.value })}
                            placeholder="Biện pháp khắc phục hạn chế hoặc phương hướng phấn đấu..."
                            className="w-full px-3 py-2 border border-stone-300 text-xs font-sans focus:outline-none focus:border-brand-cerulean"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 border border-stone-300 text-xs font-serif-title font-bold text-stone-700 hover:bg-stone-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-brand-cerulean text-white text-xs font-serif font-bold hover:bg-brand-cerulean/90 shadow-sm"
                        >
                            Lưu Minh Chứng
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
