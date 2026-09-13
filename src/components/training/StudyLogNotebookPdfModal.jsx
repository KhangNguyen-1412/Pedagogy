import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Printer,
    Download,
    X,
    BookOpen,
    CheckCircle2,
    Calendar,
    GraduationCap,
    Lightbulb,
    FileText,
    ListChecks,
    Sparkles,
    User,
    Award,
    Bookmark,
    Layers,
    AlignLeft
} from 'lucide-react';

export const StudyLogNotebookPdfModal = ({
    isOpen,
    onClose,
    logs = [],
    modules = [],
    programs = [],
    profile = {}
}) => {
    if (!isOpen || !logs || logs.length === 0) return null;

    // Sorting logs chronologically by session number or date
    const sortedLogs = [...logs].sort((a, b) => {
        const numA = parseInt(a.sessionNumber, 10) || 0;
        const numB = parseInt(b.sessionNumber, 10) || 0;
        if (numA !== numB) return numA - numB;
        return (a.date || '').localeCompare(b.date || '');
    });

    const primaryModuleId = sortedLogs[0]?.moduleId;
    const currentModule = (modules || []).find(m => m.id === primaryModuleId) || {};
    const currentProgram = (programs || []).find(p => p.id === sortedLogs[0]?.programId) || programs[0] || {};

    // Notebook Customization Options
    const [includeCover, setIncludeCover] = useState(true);
    const [paperStyle, setPaperStyle] = useState('ruled'); // 'ruled' (dòng kẻ có lề đỏ) | 'grid' (ô ly) | 'plain' (giấy trắng)
    const [includeToc, setIncludeToc] = useState(logs.length > 1);

    // Student Info on Notebook Label
    const [studentInfo, setStudentInfo] = useState({
        studentName: profile?.fullName || 'Học viên Sư phạm',
        studentId: profile?.studentId || 'NVSP-2025-089',
        studentClass: profile?.className || 'Lớp Nghiệp vụ Sư phạm K2025',
        schoolYear: '2025 - 2026',
        instructor: currentModule.instructor || sortedLogs[0]?.instructor || 'Tập thể Giảng viên Sư phạm'
    });

    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // Format Vietnamese long date: "Thứ ..., ngày DD tháng MM năm YYYY"
    const formatLongDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
            const dayName = days[d.getDay()];
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dayName}, ngày ${dd} tháng ${mm} năm ${yyyy}`;
        } catch (e) {
            return dateStr;
        }
    };

    // Helper to get section items
    const getSectionItems = (sec) => {
        if (Array.isArray(sec?.items) && sec.items.length > 0) {
            return sec.items;
        }
        return [{
            id: 'part_' + (sec?.id || '1') + '_0',
            cues: sec?.cues || '',
            note: sec?.note || sec?.content || ''
        }];
    };

    // Parse homework items
    const parseHomeworkItems = (hwText) => {
        if (!hwText) return [];
        return hwText
            .split('\n')
            .map(line => line.replace(/^[-*•\d.]\s*/, '').trim())
            .filter(Boolean);
    };

    // Download as Word .doc
    const handleDownloadDoc = () => {
        const printContent = document.getElementById('study-log-notebook-document');
        if (!printContent) return;

        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Tap_bai_ghi_${currentModule.code || 'NVSP'}</title>
        <style>
            body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.45; color: #111; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            th, td { border: 1px solid #444; padding: 6px 10px; font-size: 11pt; text-align: left; }
            th { background-color: #f3f3f3; font-weight: bold; }
            h1, h2, h3, h4 { color: #0f3656; }
            .notebook-label { border: 2px solid #222; padding: 16px; margin: 20px auto; max-width: 500px; text-align: center; background: #fffcf5; }
            .cues-cell { width: 35%; border-right: 2px solid #dc2626; vertical-align: top; padding: 8px; background: #fdfbf7; font-weight: bold; color: #b91c1c; }
            .notes-cell { width: 65%; vertical-align: top; padding: 8px; }
            .conclusion-box { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 8px 12px; margin: 8px 0; font-style: italic; }
            .summary-box { background-color: #ecfdf5; border: 1px solid #10b981; padding: 10px 14px; margin: 12px 0; }
            .homework-box { background-color: #fefce8; border: 1px dashed #ca8a04; padding: 8px 12px; margin: 8px 0; }
        </style>
        </head><body>`;
        const footer = "</body></html>";
        const sourceHTML = header + printContent.innerHTML + footer;

        const blob = new Blob(['\ufeff' + sourceHTML], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = logs.length === 1
            ? `Tap_ghi_bai_Buoi_${sortedLogs[0].sessionNumber || '01'}_${currentModule.code || 'NVSP'}.doc`
            : `Tap_ghi_bai_${currentModule.code || 'NVSP'}_${logs.length}_buoi.doc`;
        a.download = filename;
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
                        margin: 10mm 12mm 12mm 12mm;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                        font-family: 'Times New Roman', Times, serif !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .notebook-modal-wrapper {
                        padding: 0 !important;
                        background: transparent !important;
                        position: static !important;
                    }
                    .notebook-page-sheet {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                    }
                    .notebook-break-before {
                        page-break-before: always !important;
                        break-before: page !important;
                    }
                    .notebook-ruled-bg {
                        background-image: repeating-linear-gradient(transparent, transparent 27px, #cbd5e1 28px) !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .notebook-grid-bg {
                        background-size: 20px 20px !important;
                        background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px) !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .notebook-red-margin {
                        border-right: 2px solid #ef4444 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* TOP CONTROLS & TOOLBAR */}
            <div className="w-full max-w-4xl bg-white border border-stone-300 shadow-xl rounded-t-sm px-4 py-3 sticky top-2 z-40 print:hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 bg-amber-50 text-brand-jasper border border-amber-200 rounded shrink-0">
                        <BookOpen size={18} />
                    </span>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-serif-title font-bold text-sm sm:text-base text-gray-900 truncate">
                                Xuất PDF Tập Ghi Bài Học Sinh
                            </h3>
                            <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean font-serif-title font-bold text-xs rounded-full shrink-0">
                                {logs.length === 1 ? '1 bài học' : `${logs.length} bài ghi gộp`}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 truncate font-sans">
                            {currentModule.code ? `${currentModule.code} - ${currentModule.name}` : 'Học phần Nghiệp vụ Sư phạm'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
                    <button
                        type="button"
                        onClick={() => setIsEditingInfo(!isEditingInfo)}
                        className={`px-2.5 py-1.5 text-xs font-serif-title font-medium rounded border transition-colors flex items-center gap-1 ${
                            isEditingInfo
                                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                : 'text-stone-700 hover:bg-stone-100 border-stone-300'
                        }`}
                        title="Tùy chỉnh họ tên, MSSV trên Nhãn vở"
                    >
                        <User size={13} />
                        <span>Sửa nhãn vở</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadDoc}
                        className="px-2.5 py-1.5 text-xs font-serif-title font-medium text-stone-700 hover:text-brand-cerulean hover:bg-stone-100 border border-stone-300 rounded flex items-center gap-1 transition-colors"
                        title="Tải về file định dạng Microsoft Word (.doc)"
                    >
                        <Download size={13} />
                        <span className="hidden sm:inline">File Word (.doc)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 text-xs font-serif-title font-bold text-white bg-brand-cerulean hover:bg-brand-cerulean/90 rounded shadow-xs flex items-center gap-1.5 transition-all"
                        title="In hoặc Lưu thành file PDF A4 chuẩn"
                    >
                        <Printer size={14} />
                        <span>Tải file PDF (In A4)</span>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
                        title="Đóng cửa sổ"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* CUSTOMIZATION OPTIONS BAR */}
            <div className="w-full max-w-4xl bg-stone-50 border-x border-b border-stone-300 px-4 py-2 print:hidden flex flex-wrap items-center justify-between gap-2.5 text-xs text-stone-700">
                <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={includeCover}
                            onChange={e => setIncludeCover(e.target.checked)}
                            className="rounded text-brand-cerulean focus:ring-0"
                        />
                        <span className="font-medium">Trang bìa &amp; Nhãn vở</span>
                    </label>

                    {logs.length > 1 && (
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={includeToc}
                                onChange={e => setIncludeToc(e.target.checked)}
                                className="rounded text-brand-cerulean focus:ring-0"
                            />
                            <span className="font-medium">Trang Mục lục</span>
                        </label>
                    )}

                    <div className="flex items-center gap-1.5">
                        <span className="text-stone-500">Kiểu giấy:</span>
                        <select
                            value={paperStyle}
                            onChange={e => setPaperStyle(e.target.value)}
                            className="text-xs bg-white border border-stone-300 rounded px-2 py-0.5 font-medium text-stone-800 focus:outline-none"
                        >
                            <option value="ruled">Dòng kẻ tập có lề đỏ (Chuẩn vở học sinh)</option>
                            <option value="grid">Kẻ ô ly / Caro học sinh</option>
                            <option value="plain">Giấy trắng phẳng (Tối giản)</option>
                        </select>
                    </div>
                </div>

                <div className="text-[11px] text-stone-500 italic">
                    Khổ giấy A4 dọc &bull; Chuẩn lề Cornell &bull; Font Times New Roman
                </div>
            </div>

            {/* EDIT STUDENT INFO DRAWER (OPTIONAL) */}
            {isEditingInfo && (
                <div className="w-full max-w-4xl bg-amber-50 border-x border-b border-amber-300 p-3.5 print:hidden space-y-2.5 text-xs animate-fade-in-down">
                    <div className="flex items-center justify-between font-serif-title font-bold text-amber-900">
                        <span>Thông tin hiển thị trên Nhãn Vở tập học sinh:</span>
                        <button
                            type="button"
                            onClick={() => setIsEditingInfo(false)}
                            className="text-amber-700 hover:text-amber-900 font-normal underline"
                        >
                            Hoàn tất &amp; Đóng
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        <div>
                            <label className="block text-stone-600 mb-0.5">Họ và tên học viên:</label>
                            <input
                                type="text"
                                className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded"
                                value={studentInfo.studentName}
                                onChange={e => setStudentInfo({ ...studentInfo, studentName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-stone-600 mb-0.5">Mã số học viên (MSSV):</label>
                            <input
                                type="text"
                                className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded"
                                value={studentInfo.studentId}
                                onChange={e => setStudentInfo({ ...studentInfo, studentId: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-stone-600 mb-0.5">Lớp / Khóa đào tạo:</label>
                            <input
                                type="text"
                                className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded"
                                value={studentInfo.studentClass}
                                onChange={e => setStudentInfo({ ...studentInfo, studentClass: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-stone-600 mb-0.5">Giảng viên phụ trách:</label>
                            <input
                                type="text"
                                className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded"
                                value={studentInfo.instructor}
                                onChange={e => setStudentInfo({ ...studentInfo, instructor: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* PRINTABLE A4 NOTEBOOK DOCUMENT CONTAINER                                 */}
            {/* ========================================================================= */}
            <div
                id="study-log-notebook-document"
                className="w-full max-w-4xl bg-white shadow-2xl rounded-b-sm p-6 sm:p-10 md:p-12 space-y-12 font-serif text-gray-900 leading-relaxed notebook-page-sheet"
                style={{ minHeight: '297mm' }}
            >
                {/* 1. TRANG BÌA TẬP GHI BÀI HỌC SINH (COVER PAGE) */}
                {includeCover && (
                    <div className="border-4 border-double border-stone-800 p-8 sm:p-12 min-h-[250mm] flex flex-col justify-between items-center text-center relative bg-[#faf8f5] shadow-xs">
                        {/* School & Department Header */}
                        <div className="space-y-1.5 w-full border-b-2 border-stone-700 pb-5">
                            <p className="text-xs sm:text-sm uppercase tracking-widest font-bold text-stone-700">
                                BỘ GIÁO DỤC VÀ ĐÀO TẠO
                            </p>
                            <h2 className="text-base sm:text-xl font-bold uppercase tracking-wider text-brand-cerulean">
                                TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH
                            </h2>
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-jasper">
                                {currentProgram.name || 'CHƯƠNG TRÌNH ĐÀO TẠO NGHIỆP VỤ SƯ PHẠM'}
                            </p>
                        </div>

                        {/* CENTER ICONIC STUDENT NOTEBOOK LABEL (NHÃN VỞ HỌC SINH) */}
                        <div className="my-8 w-full max-w-lg bg-white border-2 border-stone-800 p-6 sm:p-8 rounded shadow-md relative">
                            {/* Decorative corner staples */}
                            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-stone-500"></div>
                            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-stone-500"></div>
                            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-stone-500"></div>
                            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-stone-500"></div>

                            <div className="space-y-3">
                                <div className="border-b border-stone-300 pb-2">
                                    <span className="text-[11px] font-sans uppercase tracking-widest font-bold text-stone-500 block">
                                        VỞ GHI BÀI HỌC VIÊN
                                    </span>
                                    <h1 className="text-xl sm:text-2xl font-bold text-brand-cerulean uppercase mt-1">
                                        TẬP BÀI GHI HỌC PHẦN
                                    </h1>
                                </div>

                                <div className="text-left space-y-2.5 text-sm pt-2">
                                    <div className="flex items-baseline justify-between border-b border-dotted border-stone-400 pb-1">
                                        <span className="text-stone-600 font-bold shrink-0">Học phần:</span>
                                        <span className="font-bold text-brand-cerulean text-right truncate pl-2">
                                            {currentModule.name ? `${currentModule.code || 'HP'} - ${currentModule.name}` : 'Nghiệp vụ sư phạm'}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-dotted border-stone-400 pb-1">
                                        <span className="text-stone-600 font-bold shrink-0">Giảng viên:</span>
                                        <span className="font-semibold text-gray-900 text-right truncate pl-2">
                                            {studentInfo.instructor || 'Tập thể Giảng viên'}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-dotted border-stone-400 pb-1">
                                        <span className="text-stone-600 font-bold shrink-0">Họ và tên học viên:</span>
                                        <span className="font-bold text-brand-jasper text-right truncate pl-2">
                                            {studentInfo.studentName}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-dotted border-stone-400 pb-1">
                                        <span className="text-stone-600 font-bold shrink-0">Mã số học viên:</span>
                                        <span className="font-semibold text-gray-900 text-right truncate pl-2">
                                            {studentInfo.studentId}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-dotted border-stone-400 pb-1">
                                        <span className="text-stone-600 font-bold shrink-0">Lớp / Khóa học:</span>
                                        <span className="font-semibold text-gray-900 text-right truncate pl-2">
                                            {studentInfo.studentClass}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-dotted border-stone-400 pb-1">
                                        <span className="text-stone-600 font-bold shrink-0">Số lượng bài ghi:</span>
                                        <span className="font-bold text-stone-800 text-right truncate pl-2">
                                            {sortedLogs.length} buổi học ghi chép
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pedagogical Slogan & Footer */}
                        <div className="space-y-2 w-full border-t-2 border-stone-700 pt-5">
                            <p className="text-xs sm:text-sm italic text-stone-600">
                                &ldquo;Dạy học là nghề sáng tạo nhất trong các nghề sáng tạo vì nó sáng tạo ra những con người sáng tạo.&rdquo;
                            </p>
                            <p className="text-xs font-bold uppercase tracking-widest text-stone-700">
                                NIÊN KHÓA {studentInfo.schoolYear} &bull; THÀNH PHỐ HỒ CHÍ MINH
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. TRANG MỤC LỤC TẬP BÀI GHI (TABLE OF CONTENTS) */}
                {includeToc && sortedLogs.length > 1 && (
                    <div className="notebook-break-before space-y-6 pt-4 min-h-[250mm]">
                        <div className="text-center border-b-2 border-stone-800 pb-3">
                            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-brand-cerulean">
                                MỤC LỤC TẬP BÀI GHI HỌC TẬP
                            </h2>
                            <p className="text-xs text-stone-600 italic mt-1">
                                Danh sách các buổi học và chủ đề bài giảng đã ghi chép theo chuẩn Cornell
                            </p>
                        </div>

                        <table className="w-full border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-stone-100 border-y-2 border-stone-800">
                                    <th className="p-2 border border-stone-300 text-center w-12 font-bold">Buổi</th>
                                    <th className="p-2 border border-stone-300 text-center w-28 font-bold">Ngày học</th>
                                    <th className="p-2 border border-stone-300 text-left font-bold">Chủ đề &amp; Tên bài học</th>
                                    <th className="p-2 border border-stone-300 text-center w-24 font-bold">Số mục ghi</th>
                                    <th className="p-2 border border-stone-300 text-center w-20 font-bold">Trang</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLogs.map((log, lIdx) => {
                                    const secCount = Array.isArray(log.sections) ? log.sections.length : 1;
                                    return (
                                        <tr key={log.id || lIdx} className="hover:bg-stone-50 border-b border-stone-200">
                                            <td className="p-2.5 border border-stone-300 text-center font-bold text-brand-cerulean">
                                                {log.sessionNumber || String(lIdx + 1).padStart(2, '0')}
                                            </td>
                                            <td className="p-2.5 border border-stone-300 text-center text-stone-700">
                                                {log.date}
                                            </td>
                                            <td className="p-2.5 border border-stone-300">
                                                <span className="font-bold text-gray-900 block">{log.title}</span>
                                                {log.summary && (
                                                    <span className="text-xs text-stone-600 italic line-clamp-1 mt-0.5">
                                                        {log.summary}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-2.5 border border-stone-300 text-center text-stone-700">
                                                {secCount} mục
                                            </td>
                                            <td className="p-2.5 border border-stone-300 text-center font-bold text-stone-600">
                                                {includeCover ? lIdx + 2 : lIdx + 1}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 3. CÁC BÀI GHI TRONG TẬP (INDIVIDUAL NOTEBOOK LESSON SHEETS) */}
                {sortedLogs.map((log, lIdx) => {
                    const mod = (modules || []).find(m => m.id === log.moduleId) || currentModule;
                    const homeworkItems = parseHomeworkItems(log.homework);
                    const sections = (Array.isArray(log.sections) && log.sections.length > 0)
                        ? log.sections
                        : [{ id: 'sec_1', title: '', cues: log.cues || '', note: log.content || '', conclusion: '' }];

                    return (
                        <div
                            key={log.id || lIdx}
                            className={`space-y-6 pt-2 ${(includeCover || lIdx > 0) ? 'notebook-break-before' : ''}`}
                        >
                            {/* NOTEBOOK PAGE TOP HEADER LINE */}
                            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-2 text-xs font-sans text-stone-700">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-brand-cerulean uppercase">
                                        {mod.code || 'HP'}: {mod.name}
                                    </span>
                                    <span>&bull;</span>
                                    <span className="font-bold text-brand-jasper">
                                        Buổi {log.sessionNumber || String(lIdx + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="italic font-serif">
                                    {formatLongDate(log.date)}
                                </div>
                            </div>

                            {/* LESSON TITLE WITH DOUBLE UNDERLINE (MÔ PHỎNG TIÊU ĐỀ BÀI VỞ HỌC SINH) */}
                            <div className="text-center py-2">
                                <span className="text-xs uppercase font-sans font-bold tracking-widest text-stone-500 block">
                                    BÀI HỌC BUỔI {log.sessionNumber || '01'}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-brand-cerulean mt-1 inline-block pb-1.5 border-b-2 border-double border-brand-cerulean">
                                    {log.title}
                                </h2>
                                {(log.instructor || mod.instructor) && (
                                    <p className="text-xs italic text-stone-600 mt-1">
                                        Giảng viên đứng lớp: <strong>{log.instructor || mod.instructor}</strong>
                                    </p>
                                )}
                            </div>

                            {/* NOTEBOOK BODY: CORNELL 2 COLUMNS WITH RED MARGIN & RULED PAPER */}
                            <div
                                className={`border border-stone-300 rounded-sm overflow-hidden ${
                                    paperStyle === 'ruled'
                                        ? 'notebook-ruled-bg'
                                        : paperStyle === 'grid'
                                        ? 'notebook-grid-bg'
                                        : 'bg-white'
                                }`}
                                style={paperStyle === 'ruled' ? {
                                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #cbd5e1 28px)'
                                } : paperStyle === 'grid' ? {
                                    backgroundSize: '20px 20px',
                                    backgroundImage: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)'
                                } : {}}
                            >
                                {/* HEADER OF COLUMNS */}
                                <div className="grid grid-cols-12 border-b-2 border-stone-800 bg-stone-100/90 text-xs font-bold uppercase tracking-wider">
                                    <div className="col-span-4 p-2.5 text-brand-jasper border-r-2 border-red-400 notebook-red-margin flex items-center gap-1">
                                        <Lightbulb size={13} className="text-amber-600 shrink-0" />
                                        <span>Cột Lề: Từ Khóa &amp; Gợi Ý (Cues)</span>
                                    </div>
                                    <div className="col-span-8 p-2.5 text-brand-cerulean flex items-center gap-1 pl-3">
                                        <FileText size={13} className="text-brand-cerulean shrink-0" />
                                        <span>Nội Dung Ghi Chép Bài Giảng (Notes)</span>
                                    </div>
                                </div>

                                {/* LIST OF CORNELL SECTIONS */}
                                <div className="divide-y-2 divide-stone-300">
                                    {sections.map((sec, sIdx) => {
                                        const secParts = getSectionItems(sec);
                                        return (
                                            <div key={sec.id || sIdx} className="space-y-0">
                                                {/* SECTION HEADING BAR (IF MULTIPLE SECTIONS) */}
                                                {(sec.title || sections.length > 1) && (
                                                    <div className="bg-stone-100/80 px-3.5 py-1.5 border-b border-stone-300 flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-brand-cerulean text-white font-serif font-bold text-xs uppercase rounded-xs">
                                                            Mục {sIdx + 1}
                                                        </span>
                                                        <span className="font-bold text-sm text-brand-cerulean">
                                                            {sec.title || `Nội dung phần ${sIdx + 1}`}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* CONTENT PARTS WITH RED MARGIN SEPARATOR */}
                                                <div className="divide-y divide-stone-200">
                                                    {secParts.map((part, pIdx) => (
                                                        <div key={part.id || pIdx} className="grid grid-cols-12">
                                                            {/* CUES (LEFT OF RED MARGIN ~33%) */}
                                                            <div className="col-span-4 p-3 sm:p-4 border-r-2 border-red-400 notebook-red-margin bg-[#fffcf7]/60 space-y-1.5">
                                                                {secParts.length > 1 && (
                                                                    <span className="text-[10px] font-bold text-brand-jasper uppercase tracking-wider block">
                                                                        Từ khóa Phần {pIdx + 1}:
                                                                    </span>
                                                                )}
                                                                <div className="text-xs sm:text-sm font-semibold text-brand-jasper leading-relaxed whitespace-pre-line">
                                                                    {part.cues || <span className="text-stone-400 font-normal italic">--</span>}
                                                                </div>
                                                            </div>

                                                            {/* NOTES (RIGHT OF RED MARGIN ~67%) */}
                                                            <div className="col-span-8 p-3 sm:p-4 bg-white/70 space-y-1.5 pl-3.5 sm:pl-5">
                                                                {secParts.length > 1 && (
                                                                    <span className="text-[10px] font-bold text-brand-cerulean uppercase tracking-wider block">
                                                                        Ghi chép Phần {pIdx + 1}:
                                                                    </span>
                                                                )}
                                                                <div className="text-xs sm:text-sm text-gray-900 leading-relaxed">
                                                                    {part.note ? (
                                                                        /<[a-z][\s\S]*>/i.test(part.note) ? (
                                                                            <div className="word-content" dangerouslySetInnerHTML={{ __html: part.note }} />
                                                                        ) : (
                                                                            <div className="whitespace-pre-line">{part.note}</div>
                                                                        )
                                                                    ) : (
                                                                        <span className="text-stone-400 italic">Chưa có nội dung ghi chép.</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* SECTION CONCLUSION (TIỂU KẾT SƯ PHẠM / GHI NHỚ MỤC) */}
                                                {sec.conclusion && (
                                                    <div className="p-3 bg-amber-50/80 border-t border-amber-300 flex items-start gap-2 text-xs sm:text-sm">
                                                        <Sparkles size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                                        <div className="space-y-0.5">
                                                            <span className="font-bold text-amber-900 uppercase text-[11px] tracking-wider block">
                                                                ✦ Ghi nhớ / Kết luận Mục {sIdx + 1}:
                                                            </span>
                                                            <p className="italic text-gray-900 font-serif leading-relaxed">
                                                                &ldquo;{sec.conclusion}&rdquo;
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* OVERALL LESSON SUMMARY BOX (BÀI HỌC RÚT RA TOÀN BUỔI) */}
                            {log.summary && (
                                <div className="border-2 border-brand-cerulean/60 rounded p-3.5 sm:p-4 bg-amber-50/40 space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cerulean uppercase tracking-wider border-b border-brand-cerulean/20 pb-1">
                                        <Sparkles size={14} className="text-brand-jasper" />
                                        <span>✦ Bài học rút ra &amp; Tổng kết toàn buổi (Summary):</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-900 font-serif leading-relaxed italic pt-1">
                                        {log.summary}
                                    </p>
                                </div>
                            )}

                            {/* HOMEWORK CHECKLIST BOX (DẶN DÒ BÀI TẬP VỀ NHÀ) */}
                            {homeworkItems.length > 0 && (
                                <div className="border border-stone-400 border-dashed rounded p-3.5 bg-stone-50/80 space-y-2 text-xs sm:text-sm">
                                    <div className="flex items-center gap-1.5 font-bold text-stone-800 uppercase text-xs tracking-wider border-b border-stone-300 pb-1">
                                        <ListChecks size={14} className="text-brand-jasper" />
                                        <span>✦ Dặn dò của Giảng viên &amp; Bài tập về nhà:</span>
                                    </div>
                                    <ul className="space-y-1.5 pl-1">
                                        {homeworkItems.map((hw, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="w-3.5 h-3.5 border border-stone-600 inline-block mt-0.5 shrink-0 rounded-2xs"></span>
                                                <span className="text-gray-800">{hw}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* FOOTER OF EACH NOTEBOOK LESSON PAGE */}
                            <div className="flex items-center justify-between border-t border-stone-300 pt-2 text-[11px] text-stone-500 font-sans">
                                <span>Tập bài ghi học viên &bull; Trường Đại học Sư phạm TP.HCM</span>
                                <span>
                                    Buổi {log.sessionNumber || '01'} &bull; Trang {includeCover ? lIdx + (includeToc && sortedLogs.length > 1 ? 3 : 2) : lIdx + 1}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    if (typeof document === 'undefined') {
        return modalContent;
    }
    return createPortal(modalContent, document.body);
};
