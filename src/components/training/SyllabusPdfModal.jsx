import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Printer,
    Download,
    X,
    Building2,
    ShieldCheck,
    CheckCircle2,
    BookOpen,
    Laptop,
    Users,
    FileText,
    Award
} from 'lucide-react';

export const SyllabusPdfModal = ({ isOpen, onClose, module: currentModule, syllabusData, program }) => {
    if (!isOpen || !currentModule) return null;

    const [includeSignatures, setIncludeSignatures] = useState(true);

    const today = new Date();
    const formattedDate = `Thành phố Hồ Chí Minh, ngày ${String(today.getDate()).padStart(2, '0')} tháng ${String(today.getMonth() + 1).padStart(2, '0')} năm ${today.getFullYear()}`;

    const moduleCode = currentModule.code || 'HP';
    const moduleName = currentModule.name || 'Học phần';
    const englishName = syllabusData?.englishName || currentModule.englishName || 'Detailed Course Syllabus';
    const credits = currentModule.credits || 2;
    const hours = syllabusData?.hoursBreakdown || { theory: 15, practice: 30, selfStudy: 60 };
    const prerequisites = syllabusData?.prerequisites || currentModule.prerequisites || 'Không có';
    const instructor = syllabusData?.instructor || currentModule.instructor || 'Tập thể Giảng viên Bộ môn';
    const instructorEmail = syllabusData?.instructorEmail || currentModule.instructorEmail || `${moduleCode.toLowerCase()}@lecturer.hcmue.edu.vn`;
    const authorTeam = Array.isArray(syllabusData?.authorTeam)
        ? syllabusData.authorTeam
        : (syllabusData?.authorTeam ? [syllabusData.authorTeam] : [instructor]);
    const approver = syllabusData?.approver || 'TS. Mai Thu Trang (Trưởng Bộ môn)';
    const programName = program?.name || 'Nghiệp vụ Sư phạm - Trường Đại học Sư phạm TP. Hồ Chí Minh';

    // Download as Word .doc
    const handleDownloadDoc = () => {
        const printContent = document.getElementById('syllabus-a4-document');
        if (!printContent) return;

        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>De_cuong_${moduleCode}_${moduleName}</title>
        <style>
            body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #111; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            th, td { border: 1px solid #333; padding: 6px 10px; font-size: 11pt; text-align: left; }
            th { background-color: #f3f3f3; font-weight: bold; }
            h1, h2, h3, h4 { color: #0f3656; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .italic { font-style: italic; }
        </style>
        </head><body>`;
        const footer = "</body></html>";
        const sourceHTML = header + printContent.innerHTML + footer;

        const blob = new Blob(['\ufeff' + sourceHTML], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `De_cuong_chi_tiet_${moduleCode}_HCMUE.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const modalContent = (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-backdrop-in"
        >
            {/* INJECT A4 PRINT STYLE RULES */}
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 12mm 15mm 15mm 15mm;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                        font-family: 'Times New Roman', Times, serif !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .syllabus-print-sheet {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    .avoid-break {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>

            {/* FIXED TOP FLOATING ACTION BAR */}
            <div className="sticky top-2 z-[310] flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 text-white px-4 sm:px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-md max-w-4xl w-[94vw] md:w-full print:hidden border border-white/20 mb-4">
                <div className="flex items-center gap-2 text-brand-cream font-bold font-serif-title text-xs sm:text-sm truncate">
                    <FileText size={16} className="text-amber-400 shrink-0" />
                    <span className="truncate">Xuất file PDF Đề cương chi tiết: {moduleCode} - {moduleName}</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
                    <label className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={includeSignatures}
                            onChange={(e) => setIncludeSignatures(e.target.checked)}
                            className="rounded text-brand-cerulean focus:ring-brand-cerulean"
                        />
                        <span>Khung chữ ký</span>
                    </label>

                    <button
                        type="button"
                        onClick={handleDownloadDoc}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-serif-title font-bold rounded-full transition-colors flex items-center gap-1.5"
                        title="Tải về tệp tài liệu Microsoft Word (.doc)"
                    >
                        <Download size={14} />
                        <span className="hidden sm:inline">Tải tệp</span> .DOC
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-1.5 bg-brand-jasper hover:bg-brand-jasper/90 text-white text-xs font-serif-title font-bold shadow-md transition-colors flex items-center gap-1.5 rounded-full"
                        title="In hoặc Lưu dưới dạng file PDF chuẩn A4"
                    >
                        <Printer size={14} />
                        <span>Tải file PDF / In A4</span>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-red-600 transition-all"
                        title="Đóng cửa sổ"
                    >
                        <X size={17} />
                    </button>
                </div>
            </div>

            {/* A4 DOCUMENT CONTAINER */}
            <div
                id="syllabus-a4-document"
                className="syllabus-print-sheet bg-white text-gray-900 w-full max-w-[840px] shadow-2xl p-6 sm:p-12 md:p-14 border border-stone-300 relative rounded-sm font-body leading-relaxed text-sm my-2 select-text"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
                {/* 1. QUỐC HIỆU & ĐƠN VỊ ĐÀO TẠO */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-brand-cerulean/30">
                    <div className="text-center sm:text-left space-y-0.5 w-full sm:w-auto">
                        <p className="text-xs uppercase font-bold text-gray-700 tracking-wider">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
                        <p className="text-xs sm:text-sm font-bold uppercase text-brand-cerulean tracking-wide">TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH</p>
                        <p className="text-xs font-bold text-gray-700">KHOA / BỘ MÔN NGHIỆP VỤ SƯ PHẠM</p>
                        <div className="w-24 h-0.5 bg-brand-cerulean mx-auto sm:mx-0 mt-1"></div>
                    </div>

                    <div className="text-center space-y-0.5 w-full sm:w-auto">
                        <p className="text-xs font-bold uppercase text-gray-800 tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-800">Độc lập - Tự do - Hạnh phúc</p>
                        <div className="w-28 h-0.5 bg-gray-700 mx-auto mt-1"></div>
                    </div>
                </div>

                {/* 2. TIÊU ĐỀ ĐỀ CƯƠNG */}
                <div className="text-center my-6 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-jasper px-2.5 py-0.5 bg-amber-50 border border-brand-jasper/20 rounded inline-block">
                        Chương trình bồi dưỡng Nghiệp vụ Sư phạm (Thông tư 12/2021/TT-BGDĐT)
                    </span>
                    <h1 className="text-xl sm:text-2xl font-bold uppercase text-brand-cerulean tracking-wide pt-1">
                        ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN
                    </h1>
                    <h2 className="text-base sm:text-lg font-bold text-brand-jasper">
                        {`${moduleCode} - ${moduleName.toUpperCase()}`}
                    </h2>
                    <p className="text-xs italic text-gray-600">
                        {`(Course Title: ${englishName})`}
                    </p>
                </div>

                {/* 3. PHẦN I: THÔNG TIN TỔNG QUÁT */}
                <section className="mb-6 space-y-2 avoid-break">
                    <h3 className="text-sm font-bold uppercase text-brand-cerulean tracking-wider border-b border-brand-cerulean/30 pb-1">
                        I. Thông tin tổng quát về học phần
                    </h3>
                    <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 font-bold bg-stone-50 w-1/3 border-r border-gray-300">1. Tên học phần:</td>
                                <td className="p-2 font-bold text-brand-cerulean">{`${moduleName} (${moduleCode})`}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 font-bold bg-stone-50 border-r border-gray-300">2. Số tín chỉ:</td>
                                <td className="p-2 font-semibold">
                                    {`${credits} tín chỉ (${hours.theory} tiết Lý thuyết, ${hours.practice} tiết Thực hành/Thảo luận, ${hours.selfStudy} giờ Tự học)`}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 font-bold bg-stone-50 border-r border-gray-300">3. Học phần tiên quyết / học trước:</td>
                                <td className="p-2">{prerequisites}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 font-bold bg-stone-50 border-r border-gray-300">4. Đơn vị phụ trách chuyên môn:</td>
                                <td className="p-2">Khoa Khoa học Giáo dục & Tâm lý học / ĐH Sư phạm TP.HCM</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 font-bold bg-stone-50 border-r border-gray-300">5. Giảng viên biên soạn & Phụ trách:</td>
                                <td className="p-2">
                                    <span className="font-bold">{instructor}</span> — Email công vụ: <span className="font-mono text-brand-cerulean">{instructorEmail}</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 font-bold bg-stone-50 border-r border-gray-300">6. Đối tượng người học:</td>
                                <td className="p-2">Học viên chương trình Bồi dưỡng Nghiệp vụ Sư phạm THCS / THPT</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* 4. PHẦN II: MỤC TIÊU & YÊU CẦU CẦN ĐẠT */}
                <section className="mb-6 space-y-2.5 avoid-break">
                    <h3 className="text-sm font-bold uppercase text-brand-cerulean tracking-wider border-b border-brand-cerulean/30 pb-1">
                        II. Mục tiêu & Yêu cầu cần đạt của học phần
                    </h3>
                    {syllabusData?.description && (
                        <div className="text-xs sm:text-sm text-gray-800 leading-relaxed text-justify">
                            <strong className="text-brand-cerulean">1. Mục tiêu chung: </strong>
                            {syllabusData.description}
                        </div>
                    )}

                    {syllabusData?.objectives && syllabusData.objectives.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                            <strong className="text-xs sm:text-sm text-brand-cerulean block">
                                2. Các yêu cầu cần đạt chuẩn sau khi hoàn thành học phần:
                            </strong>
                            <div className="space-y-1.5 pl-2">
                                {syllabusData.objectives.map((obj, idx) => (
                                    <div key={idx} className="text-xs sm:text-sm flex items-start gap-2 text-justify">
                                        <span className="font-bold text-brand-cerulean shrink-0 font-mono">[{obj.code || idx + 1}]</span>
                                        <span>{obj.text || obj}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* 5. PHẦN III: CHUẨN ĐẦU RA HỌC PHẦN (CLOs) */}
                <section className="mb-6 space-y-2 avoid-break">
                    <h3 className="text-sm font-bold uppercase text-brand-cerulean tracking-wider border-b border-brand-cerulean/30 pb-1">
                        III. Chuẩn đầu ra học phần (Course Learning Outcomes - CLOs)
                    </h3>
                    <p className="text-xs italic text-gray-600">
                        Học xong học phần này, người học đạt được các chuẩn đầu ra (CLO) cụ thể sau:
                    </p>
                    <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
                        <thead>
                            <tr className="bg-stone-100 text-brand-cerulean font-bold border-b border-gray-400">
                                <th className="p-2 border-r border-gray-400 w-16 text-center">Ký hiệu</th>
                                <th className="p-2 border-r border-gray-400">Nội dung chuẩn đầu ra (CLO)</th>
                                <th className="p-2 w-32 text-center">Mức độ năng lực</th>
                            </tr>
                        </thead>
                        <tbody>
                            {syllabusData?.clos && syllabusData.clos.filter(Boolean).length > 0 ? (
                                syllabusData.clos.filter(Boolean).map((clo, idx) => (
                                    <tr key={idx} className="border-b border-gray-300">
                                        <td className="p-2 border-r border-gray-300 text-center font-bold text-brand-cerulean font-mono">
                                            {`CLO ${idx + 1}`}
                                        </td>
                                        <td className="p-2 border-r border-gray-300 text-justify">{clo}</td>
                                        <td className="p-2 text-center text-xs font-semibold text-gray-700">Đạt chuẩn NVSP</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-3 text-center italic text-gray-500">Đang cập nhật chuẩn đầu ra.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* 6. PHẦN IV: NỘI DUNG CHI TIẾT HỌC PHẦN */}
                {syllabusData?.contentOutline && syllabusData.contentOutline.length > 0 && (
                    <section className="mb-6 space-y-2.5 avoid-break">
                        <h3 className="text-sm font-bold uppercase text-brand-cerulean tracking-wider border-b border-brand-cerulean/30 pb-1">
                            IV. Nội dung chi tiết học phần
                        </h3>
                        <div className="space-y-3">
                            {syllabusData.contentOutline.map((sec, idx) => (
                                <div key={idx} className="border border-gray-300 p-3 rounded-xs space-y-1.5">
                                    <h4 className="font-bold text-brand-cerulean text-xs sm:text-sm">
                                        {sec.title}
                                    </h4>
                                    {sec.items && sec.items.length > 0 && (
                                        <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-gray-800 pl-2">
                                            {sec.items.map((it, iIdx) => (
                                                <li key={iIdx} className="text-justify">{it}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {sec.discussion && (
                                        <p className="text-xs text-brand-jasper italic pt-1 border-t border-gray-200">
                                            <strong>Chủ đề thảo luận & thực hành:</strong> {sec.discussion}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 7. PHẦN V: KẾ HOẠCH BỒI DƯỠNG & HOẠT ĐỘNG DẠY HỌC */}
                <section className="mb-6 space-y-2.5">
                    <h3 className="text-sm font-bold uppercase text-brand-cerulean tracking-wider border-b border-brand-cerulean/30 pb-1">
                        V. Kế hoạch bồi dưỡng & Hoạt động dạy học (Thông tư 12/2021/TT-BGDĐT)
                    </h3>

                    {syllabusData?.learningStages && syllabusData.learningStages.length > 0 ? (
                        <div className="space-y-4">
                            {syllabusData.learningStages.map((stage, stIdx) => (
                                <div key={stIdx} className="space-y-2 avoid-break">
                                    <h4 className="font-bold text-xs sm:text-sm text-brand-jasper uppercase tracking-wide flex items-center gap-1.5">
                                        <span>▶ {stage.stageName}</span>
                                        <span className="text-xs text-gray-500 font-normal">({stage.activities?.length || 0} hoạt động)</span>
                                    </h4>
                                    <table className="w-full border-collapse border border-gray-400 text-xs">
                                        <thead>
                                            <tr className="bg-stone-100 text-gray-800 font-bold border-b border-gray-400">
                                                <th className="p-1.5 border-r border-gray-400 w-16 text-center">Mã HĐ</th>
                                                <th className="p-1.5 border-r border-gray-400 w-1/4">Tên hoạt động</th>
                                                <th className="p-1.5 border-r border-gray-400">Nhiệm vụ & Mục tiêu học viên</th>
                                                <th className="p-1.5 border-r border-gray-400 w-24 text-center">Hình thức</th>
                                                <th className="p-1.5 w-28 text-center">Đánh giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stage.activities?.map((act, aIdx) => (
                                                <tr key={aIdx} className="border-b border-gray-300">
                                                    <td className="p-1.5 border-r border-gray-300 text-center font-bold text-brand-cerulean font-mono">
                                                        {act.code || `HĐ${aIdx + 1}`}
                                                    </td>
                                                    <td className="p-1.5 border-r border-gray-300 font-bold text-gray-900">
                                                        {act.name}
                                                    </td>
                                                    <td className="p-1.5 border-r border-gray-300 space-y-0.5">
                                                        {act.target && <div><strong>Mục tiêu:</strong> {act.target}</div>}
                                                        {act.tasks && <div><strong>Nhiệm vụ:</strong> {act.tasks}</div>}
                                                        {act.materials && <div className="text-gray-500 italic">Học liệu: {act.materials}</div>}
                                                    </td>
                                                    <td className="p-1.5 border-r border-gray-300 text-center">
                                                        {act.mode === 'online' ? (
                                                            <span className="font-bold text-emerald-700">Trực tuyến (LMS)</span>
                                                        ) : (
                                                            <span className="font-bold text-brand-cerulean">Trực tiếp (Tại lớp)</span>
                                                        )}
                                                    </td>
                                                    <td className="p-1.5 text-center text-[11px] text-gray-700">
                                                        {act.assessment || 'Nộp sản phẩm LMS'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Khung 15 buổi học truyền thống */
                        syllabusData?.schedule && syllabusData.schedule.some(s => s.title) && (
                            <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm avoid-break">
                                <thead>
                                    <tr className="bg-stone-100 text-brand-cerulean font-bold border-b border-gray-400">
                                        <th className="p-2 border-r border-gray-400 w-16 text-center">Buổi</th>
                                        <th className="p-2 border-r border-gray-400">Nội dung bài học</th>
                                        <th className="p-2 border-r border-gray-400">Chủ đề chi tiết</th>
                                        <th className="p-2 w-20 text-center">Số tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {syllabusData.schedule.filter(s => s.title).map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-300">
                                            <td className="p-2 border-r border-gray-300 text-center font-bold font-mono">{item.week || idx + 1}</td>
                                            <td className="p-2 border-r border-gray-300 font-bold">{item.title}</td>
                                            <td className="p-2 border-r border-gray-300 text-gray-700">{item.topics || '—'}</td>
                                            <td className="p-2 text-center font-mono">{item.hours || 3}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </section>

                {/* 8. PHẦN VI: SẢN PHẨM HỌC TẬP & ĐÁNH GIÁ KẾT QUẢ */}
                <section className="mb-6 space-y-2.5 avoid-break">
                    <h3 className="text-sm font-bold uppercase text-brand-cerulean tracking-wider border-b border-brand-cerulean/30 pb-1">
                        VI. Sản phẩm học tập bắt buộc & Cơ chế đánh giá kết quả
                    </h3>

                    {/* Sản phẩm bắt buộc */}
                    {syllabusData?.deliverables && (
                        <div className="space-y-1.5 text-xs sm:text-sm">
                            <strong className="text-brand-cerulean">1. Sản phẩm học tập bắt buộc phải nộp:</strong>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                                <div className="border border-gray-300 p-2.5 rounded bg-stone-50/70 space-y-1">
                                    <span className="font-bold text-emerald-800 uppercase text-[11px] block">
                                        a. Sản phẩm trực tuyến (Online LMS):
                                    </span>
                                    <ul className="list-disc list-inside text-xs space-y-0.5 text-gray-700">
                                        {(syllabusData.deliverables.online || ['Bài tập trắc nghiệm khách quan', 'Bản thảo kế hoạch dạy học']).map((it, idx) => (
                                            <li key={idx}>{it}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="border border-gray-300 p-2.5 rounded bg-stone-50/70 space-y-1">
                                    <span className="font-bold text-brand-cerulean uppercase text-[11px] block">
                                        b. Sản phẩm trực tiếp (Tại lớp):
                                    </span>
                                    <ul className="list-disc list-inside text-xs space-y-0.5 text-gray-700">
                                        {(syllabusData.deliverables.inPerson || ['Hồ sơ dạy học hoàn chỉnh', 'Báo cáo thuyết trình tập giảng']).map((it, idx) => (
                                            <li key={idx}>{it}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cơ chế đánh giá */}
                    <div className="space-y-1.5 pt-1 text-xs sm:text-sm">
                        <strong className="text-brand-cerulean">2. Cơ chế và Trọng số điểm đánh giá (Thang điểm 10):</strong>
                        <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm mt-1">
                            <thead>
                                <tr className="bg-stone-100 text-gray-800 font-bold border-b border-gray-400">
                                    <th className="p-2 border-r border-gray-400 w-1/3">Hình thức đánh giá</th>
                                    <th className="p-2 border-r border-gray-400 w-24 text-center">Trọng số</th>
                                    <th className="p-2">Điều kiện & Nội dung đánh giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-300">
                                    <td className="p-2 border-r border-gray-300 font-bold">Đánh giá quá trình (Formative)</td>
                                    <td className="p-2 border-r border-gray-300 text-center font-bold text-brand-cerulean">50%</td>
                                    <td className="p-2 text-justify">
                                        Chuyên cần (tham dự tối thiểu 80% thời lượng); hoàn thành đầy đủ các bài kiểm tra trắc nghiệm và nhiệm vụ trực tuyến LMS.
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2 border-r border-gray-300 font-bold">Đánh giá tổng kết (Summative)</td>
                                    <td className="p-2 border-r border-gray-300 text-center font-bold text-brand-jasper">50%</td>
                                    <td className="p-2 text-justify">
                                        Thi kết thúc học phần / Nộp Kế hoạch bài dạy hoàn chỉnh theo công văn của Bộ GD&ĐT. Điểm đánh giá phải đạt từ 5.0 trở lên.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 9. PHẦN VII: TÀI LIỆU THAM KHẢO */}
                <section className="mb-6 space-y-2 avoid-break">
                    <h3 className="text-sm font-bold uppercase text-brand-cerulean tracking-wider border-b border-brand-cerulean/30 pb-1">
                        VII. Tài liệu học tập & Tham khảo
                    </h3>
                    <div className="space-y-1 pl-2 text-xs sm:text-sm">
                        {syllabusData?.references && syllabusData.references.length > 0 ? (
                            syllabusData.references.map((ref, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-justify">
                                    <span className="font-bold text-brand-cerulean shrink-0 font-mono">[{idx + 1}]</span>
                                    <span>{ref.replace(/^\[\d+\]\s*/, '')}</span>
                                </div>
                            ))
                        ) : (
                            <p className="italic text-gray-500">Giáo trình Nghiệp vụ Sư phạm - Trường ĐH Sư phạm TP. Hồ Chí Minh.</p>
                        )}
                        <div className="flex items-start gap-2 text-justify text-gray-700 italic pt-1">
                            <span className="font-bold text-brand-cerulean shrink-0 font-mono">[*]</span>
                            <span>Thông tư số 12/2021/TT-BGDĐT ban hành chương trình bồi dưỡng nghiệp vụ sư phạm cho người có bằng cử nhân chuyên ngành phù hợp có nguyện vọng trở thành giáo viên.</span>
                        </div>
                    </div>
                </section>

                {/* 10. PHẦN VIII: CHỮ KÝ XÁC NHẬN & DUYỆT */}
                {includeSignatures && (
                    <section className="mt-8 pt-4 border-t-2 border-gray-300 avoid-break">
                        <div className="text-right text-xs italic text-gray-600 mb-3">
                            {formattedDate}
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-center">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-brand-cerulean tracking-wider">
                                    TRƯỞNG BỘ MÔN / PHÊ DUYỆT
                                </p>
                                <p className="text-[11px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
                                <div className="h-24 flex items-center justify-center relative my-1">
                                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-brand-jasper/60 flex items-center justify-center text-brand-jasper text-[8px] font-bold text-center leading-tight rotate-[-10deg] p-1 opacity-80">
                                        ĐẠI HỌC SƯ PHẠM TP.HCM ★ KHOA SƯ PHẠM
                                    </div>
                                    <span className="absolute font-serif italic text-brand-cerulean text-lg font-bold rotate-[-8deg] pointer-events-none select-none">
                                        {approver.replace(/^TS\.\s*|\(.*\)/g, '') || 'Mai Thu Trang'}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-gray-900">{approver}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-brand-cerulean tracking-wider">
                                    GIẢNG VIÊN / BAN BIÊN SOẠN
                                </p>
                                <p className="text-[11px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
                                <div className="h-24 flex items-center justify-center relative my-1">
                                    <span className="font-serif italic text-brand-cerulean text-lg font-bold rotate-[-6deg] pointer-events-none select-none">
                                        {instructor}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-gray-900">{instructor}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* FOOTER NOTICE */}
                <div className="mt-6 pt-3 border-t border-gray-200 text-center text-[10px] text-gray-500 italic">
                    Đề cương chi tiết được trích xuất từ Hệ thống Quản trị Học tập Nghiệp vụ Sư phạm (Pedagogy) • Trường Đại học Sư phạm TP. Hồ Chí Minh.
                </div>
            </div>
        </div>
    );

    if (typeof document === 'undefined') {
        return modalContent;
    }

    return createPortal(modalContent, document.body);
};
