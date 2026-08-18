import React, { useState } from 'react';
import {
    BookOpen,
    Sparkles,
    GitBranch,
    FileText,
    Quote,
    CheckCircle2,
    Layers,
    ChevronRight,
    Award,
    Flame,
    Share2,
    Compass,
    Feather
} from 'lucide-react';
import { TS10_LITERATURE_DATA } from '../../data/ts10Data';
import { MathText } from '../../components/common/MathText';

export const Ts10LiteratureView = () => {
    const [activeTab, setActiveTab] = useState('mindmaps'); // 'mindmaps', 'social_essay', 'reading_comprehension'
    const worksList = TS10_LITERATURE_DATA?.tacPhamLop9Mindmaps || [];
    const [selectedWorkId, setSelectedWorkId] = useState(worksList[0]?.id);

    const activeWork = worksList.find(w => w.id === selectedWorkId) || worksList[0] || {};

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Ngữ Văn & Sơ Đồ Tư Duy</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Trực quan hóa tác phẩm SGK lớp 9, khung dàn ý linh hoạt và đoạn văn 200 chữ 6 bước.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { id: 'mindmaps', label: '1. Sơ đồ tư duy', icon: GitBranch },
                        { id: 'social_essay', label: '2. Đoạn 200 chữ', icon: Compass },
                        { id: 'reading_comprehension', label: '3. Đọc hiểu & Tu từ', icon: BookOpen },
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3.5 py-2 font-serif-title text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                    isActive
                                        ? 'bg-brand-jasper text-white border-brand-jasper shadow-editorial'
                                        : 'bg-white text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cream'
                                }`}
                            >
                                <Icon size={14} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TAB 1: MINDMAPS & TAC PHAM */}
            {activeTab === 'mindmaps' && (
                <div className="space-y-6 animate-fade-in">
                    {/* List of 9th Grade Works Cards - Editorial style */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {worksList.map(work => {
                            const isSelected = selectedWorkId === work.id;
                            return (
                                <div
                                    key={work.id}
                                    onClick={() => setSelectedWorkId(work.id)}
                                    className={`border-editorial p-4 bg-white cursor-pointer transition-all flex flex-col justify-between group ${
                                        isSelected
                                            ? 'bg-blue-50/40 border-brand-jasper shadow-editorial ring-1 ring-brand-jasper'
                                            : 'hover:bg-blue-50/30'
                                    }`}
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-serif-title uppercase font-bold px-2 py-0.5 border ${
                                                isSelected 
                                                    ? 'bg-brand-jasper text-white border-brand-jasper' 
                                                    : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30'
                                            }`}>
                                                {work.genre || 'Văn học 9'}
                                            </span>
                                        </div>
                                        <h4 className={`font-serif-title font-bold text-base line-clamp-1 ${
                                            isSelected ? 'text-brand-jasper' : 'text-brand-cerulean group-hover:text-brand-jasper'
                                        }`}>
                                            {work.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 italic font-newsreader">{work.author}</p>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-brand-cerulean/15 text-[11px] text-brand-cerulean flex items-center justify-between font-serif-title">
                                        <span>Xem sơ đồ & dàn ý</span>
                                        <ChevronRight size={14} className={isSelected ? 'text-brand-jasper' : 'text-gray-400'} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Active Work Visual Analysis Workspace - Editorial Box */}
                    {activeWork && activeWork.title && (
                        <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                            {/* Work Header */}
                            <div className="border-b border-brand-cerulean/20 pb-4 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean bg-brand-cerulean/10 px-2.5 py-0.5 border border-brand-cerulean/30">
                                            {activeWork.genre || 'Văn bản'}
                                        </span>
                                        <span className="text-xs font-newsreader text-gray-600 font-bold">
                                            Tác giả: {activeWork.author}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-serif-title font-bold text-brand-cerulean mt-2">
                                        {activeWork.title}
                                    </h3>
                                    {activeWork.centralTheme && (
                                        <p className="text-sm font-newsreader italic text-gray-700 mt-1">
                                            <strong>Chủ đề cốt lõi:</strong> {activeWork.centralTheme}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Mindmap Interactive Branches (Tree View) */}
                            {activeWork.mindmapNodes && activeWork.mindmapNodes.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-base font-serif-title font-bold text-brand-cerulean flex items-center gap-2 border-b border-brand-cerulean/15 pb-2">
                                        <GitBranch size={18} className="text-brand-jasper" />
                                        Sơ Đồ Tư Duy (Mindmap Branches) & Luận Điểm Trọng Tâm
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeWork.mindmapNodes.map((item, bIdx) => (
                                            <div
                                                key={bIdx}
                                                className="border border-brand-cerulean/25 bg-brand-cream/30 p-5 space-y-3 flex flex-col justify-between"
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 bg-brand-cerulean text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                                                            {bIdx + 1}
                                                        </span>
                                                        <h5 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                                            {item.node}
                                                        </h5>
                                                    </div>

                                                    <div className="space-y-1.5 pt-2">
                                                        {(item.branches || []).map((pt, pIdx) => (
                                                            <div key={pIdx} className="text-xs font-newsreader text-gray-800 flex items-start gap-1.5">
                                                                <span className="text-brand-jasper font-bold">•</span>
                                                                <span>{pt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Outlines & Elite Quotes */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                                {/* Dynamic Outline (7 Cols) */}
                                {activeWork.dynamicOutline && (
                                    <div className="lg:col-span-7 border border-brand-cerulean/30 bg-white p-5 space-y-3">
                                        <h5 className="font-serif-title font-bold text-brand-cerulean text-sm flex items-center gap-2 border-b border-brand-cerulean/15 pb-2">
                                            <Layers size={16} className="text-brand-jasper" />
                                            Khung Dàn Ý Linh Hoạt (Dynamic Outline)
                                        </h5>

                                        <div className="space-y-3 text-xs font-newsreader text-gray-800 leading-relaxed">
                                            {activeWork.dynamicOutline.moBai && (
                                                <div className="p-3 bg-brand-cream/40 border border-brand-cerulean/15">
                                                    <strong className="text-brand-jasper block mb-1 font-serif-title uppercase">I. Mở bài (0.5đ):</strong>
                                                    {activeWork.dynamicOutline.moBai}
                                                </div>
                                            )}

                                            <div className="p-3 bg-brand-cream/40 border border-brand-cerulean/15">
                                                <strong className="text-brand-jasper block mb-1 font-serif-title uppercase">II. Thân bài (3.0đ):</strong>
                                                <ul className="space-y-1 list-disc pl-4">
                                                    {activeWork.dynamicOutline.thanBai1 && <li>{activeWork.dynamicOutline.thanBai1}</li>}
                                                    {activeWork.dynamicOutline.thanBai2 && <li>{activeWork.dynamicOutline.thanBai2}</li>}
                                                    {activeWork.dynamicOutline.thanBai3 && <li>{activeWork.dynamicOutline.thanBai3}</li>}
                                                </ul>
                                            </div>

                                            {activeWork.dynamicOutline.ketBai && (
                                                <div className="p-3 bg-brand-cream/40 border border-brand-cerulean/15">
                                                    <strong className="text-brand-jasper block mb-1 font-serif-title uppercase">III. Kết bài (0.5đ):</strong>
                                                    {activeWork.dynamicOutline.ketBai}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Elite Quotes for 9.0+ Essay (5 Cols) */}
                                {activeWork.nhanDinhHay && (
                                    <div className="lg:col-span-5 border border-brand-jasper/30 bg-red-50/20 p-5 space-y-3">
                                        <h5 className="font-serif-title font-bold text-brand-jasper text-sm flex items-center gap-2 border-b border-red-200 pb-2">
                                            <Quote size={16} />
                                            Nhận Định Văn Học Đắt Giá (9.0+)
                                        </h5>

                                        <div className="bg-white p-4 border border-red-200 space-y-2 shadow-xs">
                                            <p className="text-xs font-newsreader italic text-red-950 leading-relaxed">
                                                {activeWork.nhanDinhHay}
                                            </p>
                                            <div className="text-[11px] font-serif-title text-brand-jasper font-bold pt-2 border-t border-red-100">
                                                Áp dụng: Tăng chiều sâu cho phần Mở bài hoặc Kết bài.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: NGHỊ LUẬN XÃ HỘI (ĐOẠN 200 CHỮ) */}
            {activeTab === 'social_essay' && TS10_LITERATURE_DATA?.nghiLuanXaHoi200Tu && (
                <div className="space-y-6 animate-fade-in">
                    {/* 6 Steps Guide - Editorial Box */}
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-cerulean/20 pb-3">
                            <div>
                                <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                    {TS10_LITERATURE_DATA.nghiLuanXaHoi200Tu.title || 'Quy trình 6 bước viết Đoạn văn 200 chữ'}
                                </h3>
                                <p className="text-xs font-newsreader text-gray-600 mt-1">
                                    Chuẩn barem chấm thi tuyển sinh 10 (2.0 điểm) - Tránh lan man, không viết thành bài văn thu nhỏ.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {(TS10_LITERATURE_DATA.nghiLuanXaHoi200Tu.steps || []).map((step, sIdx) => (
                                <div
                                    key={sIdx}
                                    className="border border-brand-cerulean/25 bg-brand-cream/30 p-4 space-y-2 flex flex-col justify-between"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="w-6 h-6 bg-brand-jasper text-white text-xs font-mono font-bold flex items-center justify-center">
                                                {sIdx + 1}
                                            </span>
                                        </div>
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm pt-1">
                                            {step.step}
                                        </h4>
                                        <p className="text-xs font-newsreader text-gray-700 leading-relaxed">
                                            {step.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fresh Current Affairs Evidence 2024-2025 */}
                    {TS10_LITERATURE_DATA.nghiLuanXaHoi200Tu.khoDanChungThoiSu && (
                        <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                            <div className="flex items-center gap-2 text-lg font-serif-title font-bold text-brand-jasper border-b border-red-200 pb-2">
                                <Flame size={20} />
                                Kho Dẫn Chứng Thời Sự Nóng Hổi (Cập nhật 2024 - 2025)
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                {TS10_LITERATURE_DATA.nghiLuanXaHoi200Tu.khoDanChungThoiSu.map((dc, dcIdx) => (
                                    <div
                                        key={dcIdx}
                                        className="border border-red-200 bg-red-50/20 p-5 space-y-3 flex flex-col justify-between"
                                    >
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-serif-title uppercase font-bold text-brand-jasper bg-white px-2 py-0.5 border border-red-200">
                                                {dc.subject}
                                            </span>
                                            <h5 className="font-serif-title font-bold text-red-950 text-sm">
                                                {dc.name}
                                            </h5>
                                            <p className="text-xs font-newsreader text-gray-800 leading-relaxed">
                                                {dc.detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: ĐỌC HIỂU & BIỆN PHÁP TU TỪ */}
            {activeTab === 'reading_comprehension' && TS10_LITERATURE_DATA?.docHieuPhuongPhap && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-4">
                        <div className="border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                Cẩm Nang Đọc Hiểu & Phương Pháp Phân Tích
                            </h3>
                            <p className="text-xs font-newsreader text-gray-600 mt-1">
                                Công thức trả lời câu hỏi Đọc hiểu đạt trọn vẹn 3.0 điểm trong đề thi vào 10.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {TS10_LITERATURE_DATA.docHieuPhuongPhap.map((item, iIdx) => (
                                <div
                                    key={iIdx}
                                    className="border border-brand-cerulean/25 bg-brand-cream/30 p-5 space-y-3"
                                >
                                    <h4 className="font-serif-title font-bold text-brand-cerulean text-sm border-b border-brand-cerulean/15 pb-1.5">
                                        {item.title}
                                    </h4>

                                    <div className="text-xs font-newsreader text-gray-800 leading-relaxed">
                                        {item.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
