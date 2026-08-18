import React from 'react';
import { createPortal } from 'react-dom';
import { Award, Printer, X } from 'lucide-react';

export const CertificateModal = ({ isOpen, onClose, profile, program, overall }) => {
    if (!isOpen) return null;

    const today = new Date();
    const formattedDate = `Thành phố Hồ Chí Minh, ngày ${String(today.getDate()).padStart(2, '0')} tháng ${String(today.getMonth() + 1).padStart(2, '0')} năm ${today.getFullYear()}`;
    const certNo = `NV ${profile?.studentId?.replace(/[^0-9]/g, '') || '13861'}`;
    const issueNo = `01/QĐ11022K18HN${profile?.studentId?.replace(/[^0-9]/g, '') || '185'}`;

    return createPortal(
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-backdrop-in"
        >
            {/* Inject Landscape Print Rule */}
            <style>{`
                @media print {
                    @page { size: A4 landscape; margin: 10mm; }
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>

            {/* FIXED TOP FLOATING ACTION BAR */}
            <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[310] flex items-center justify-between gap-4 bg-gray-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md max-w-4xl w-[92vw] md:w-auto print:hidden border border-white/20">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold font-serif-title text-sm truncate">
                    <Award size={18} />
                    <span className="truncate">Chứng chỉ tốt nghiệp Nghiệp vụ Sư phạm</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#b8952b] text-white text-xs font-sans font-bold shadow transition-colors flex items-center gap-1.5 rounded-full"
                    >
                        <Printer size={14} /> In / Tải Chứng chỉ
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-300 hover:text-white rounded-full bg-white/10 hover:bg-red-600 transition-all"
                        title="Đóng cửa sổ (Hoặc bấm ra ngoài)"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Certificate Paper Container */}
            <div className="bg-[#FFFDF5] border-[8px] md:border-[12px] border-[#D4AF37] p-5 md:p-8 w-full max-w-5xl shadow-2xl relative rounded-sm mt-14 mb-4 max-h-[85vh] overflow-y-auto font-serif animate-modal-pop-in">
                {/* Inner Ornamental Certificate Border */}
                <div className="border-2 md:border-4 border-[#D4AF37] p-4 md:p-8 relative bg-amber-50/20 shadow-inner min-h-[440px] flex flex-col justify-between">
                    {/* Corner Flourishes */}
                    <div className="absolute top-1.5 left-1.5 w-6 h-6 md:w-7 md:h-7 border-t-4 border-l-4 border-[#D4AF37]"></div>
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 border-t-4 border-r-4 border-[#D4AF37]"></div>
                    <div className="absolute bottom-1.5 left-1.5 w-6 h-6 md:w-7 md:h-7 border-b-4 border-l-4 border-[#D4AF37]"></div>
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 border-b-4 border-r-4 border-[#D4AF37]"></div>

                    {/* Certificate Header Emblem */}
                    <div>
                        <div className="text-center space-y-1 mb-3">
                            <p className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-gray-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                            <p className="text-[11px] md:text-sm font-bold text-gray-700 underline underline-offset-4 decoration-double">Độc lập - Tự do - Hạnh phúc</p>
                        </div>

                        <div className="text-center space-y-1 mb-5">
                            <p className="text-xs md:text-base font-bold uppercase text-gray-800 tracking-wider">HIỆU TRƯỞNG TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH</p>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest my-0.5">CẤP</p>
                            <h1 className="text-3xl md:text-5xl font-serif font-black text-red-700 tracking-widest my-1 drop-shadow-sm">CHỨNG CHỈ</h1>
                            <h2 className="text-lg md:text-2xl font-serif font-bold text-gray-900 uppercase tracking-wide">NGHIỆP VỤ SƯ PHẠM</h2>
                        </div>
                    </div>

                    {/* Certificate Body Content */}
                    <div className="space-y-2.5 text-sm md:text-base text-gray-800 leading-relaxed px-2 md:px-12 font-serif my-2">
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dashed border-amber-400/60 pb-1 gap-2">
                            <span>Cho: <strong className="text-base md:text-lg text-gray-900 uppercase font-black tracking-wide ml-2">{profile?.fullName || 'NGUYỄN HUỲNH PHÚC KHANG'}</strong></span>
                            <span>Giới tính: <strong className="font-bold ml-2">{profile?.gender || 'Nam'}</strong></span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dashed border-amber-400/60 pb-1 gap-2">
                            <span>Sinh ngày: <strong className="font-bold ml-2">{profile?.dob || '01/01/2000'}</strong></span>
                            <span>Nơi sinh: <strong className="font-bold ml-2">{profile?.province || 'Thành phố Hồ Chí Minh'}</strong></span>
                        </div>
                        <div className="border-b border-dashed border-amber-400/60 pb-1">
                            <span>Đã hoàn thành chương trình: <em className="font-bold text-brand-cerulean text-base md:text-lg ml-2">{program?.name || profile?.major || 'Nghiệp vụ sư phạm THCS 2026'}</em></span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dashed border-amber-400/60 pb-1 gap-2">
                            <span>Điểm trung bình: <strong className="text-base text-red-700 font-bold ml-2">{overall?.gpa10 || '8.15'}</strong></span>
                            <span>Xếp loại: <strong className="text-base text-red-700 font-black uppercase tracking-wider ml-2">{overall?.rank || 'GIỎI'}</strong></span>
                        </div>
                    </div>

                    {/* Certificate Footer: Date, Signature & Red Seal */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center sm:items-end px-2 md:px-12 gap-4">
                        <div className="text-[11px] md:text-xs text-gray-600 space-y-1 text-center sm:text-left">
                            <p>Số hiệu: <strong className="text-red-700 text-sm font-mono font-bold">{certNo}</strong></p>
                            <p>Số vào sổ cấp chứng chỉ: <span className="font-mono text-gray-700">{issueNo}</span></p>
                        </div>

                        <div className="text-center relative min-w-[240px]">
                            <p className="text-[11px] md:text-xs text-gray-600 italic mb-1">{formattedDate}</p>
                            <p className="text-xs md:text-sm font-bold text-gray-800 uppercase">TL. HIỆU TRƯỞNG</p>
                            <p className="text-[11px] md:text-xs font-bold text-gray-700 uppercase">TRƯỞNG PHÒNG ĐÀO TẠO</p>
                            <div className="h-16 md:h-20 flex items-center justify-center my-1 relative">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-red-600 flex items-center justify-center text-red-600 text-[9px] md:text-[10px] font-bold text-center leading-tight rotate-[-12deg] p-1.5 shadow-sm opacity-90 border-dashed">
                                    ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH ★
                                </div>
                                <span className="absolute font-serif italic text-blue-900 text-xl md:text-2xl font-bold rotate-[-10deg] pointer-events-none select-none drop-shadow">
                                    Nguyễn Văn A
                                </span>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-gray-900 mt-0.5">GS.TS Huỳnh Văn Sơn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
