import React, { useState } from 'react';
import {
    MapPin,
    Building2,
    Calendar,
    Award,
    Sparkles,
    FileText,
    BookOpen,
    ArrowRight,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { TS10_PROVINCIAL_MATRIX } from '../../data/ts10Data';

export const Ts10ProvincialMatrixView = () => {
    const [selectedProvinceId, setSelectedProvinceId] = useState(TS10_PROVINCIAL_MATRIX[0]?.provinceId);
    const [filterType, setFilterType] = useState('all'); // 'all', 'Chuyên', 'Đại trà'

    const activeProvince = TS10_PROVINCIAL_MATRIX.find(p => p.provinceId === selectedProvinceId) || TS10_PROVINCIAL_MATRIX[0];

    const characteristics = activeProvince.examCharacteristics || activeProvince.characteristics || {};
    const schoolsList = activeProvince.schools || [];

    const filteredSchools = schoolsList.filter(school => {
        if (filterType === 'all') return true;
        return (school.type || '').toLowerCase().includes(filterType.toLowerCase());
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Ma Trận Đề Tuyển Sinh 10</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Đặc thù đề thi theo từng Sở GD&ĐT (Hà Nội, TP.HCM, Đà Nẵng) và tra cứu điểm chuẩn trường top.</p>
                </div>
            </div>

            {/* Province Selector Bar - Editorial style */}
            <div className="border-editorial p-4 bg-white shadow-editorial flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-serif-title uppercase font-bold text-gray-500 mr-1">Chọn Tỉnh / Thành Phố:</span>
                    <div className="flex flex-wrap gap-2">
                        {TS10_PROVINCIAL_MATRIX.map(p => (
                            <button
                                key={p.provinceId}
                                type="button"
                                onClick={() => setSelectedProvinceId(p.provinceId)}
                                className={`px-3.5 py-1.5 text-xs font-serif-title font-bold transition-all border ${
                                    selectedProvinceId === p.provinceId
                                        ? 'bg-brand-jasper text-white border-brand-jasper shadow-xs'
                                        : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cerulean/10'
                                }`}
                            >
                                {p.provinceName}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Province Exam Characteristics - Editorial Box */}
            <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                <div className="border-b border-brand-cerulean/20 pb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-serif-title font-bold uppercase text-brand-cerulean bg-brand-cerulean/10 px-2.5 py-0.5 border border-brand-cerulean/30">
                                Sở GD&ĐT {activeProvince.provinceName}
                            </span>
                            <span className="text-xs font-body text-gray-500 font-bold">
                                Cập nhật kỳ thi 2024 - 2025
                            </span>
                        </div>
                        <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1.5">
                            Phân Tích Đặc Thù Cấu Trúc Đề Thi
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Math Specifics */}
                    <div className="border border-brand-cerulean/30 bg-brand-cream/30 p-4.5 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                            <BookOpen size={15} /> 1. Đặc Thù Môn Toán
                        </div>
                        <p className="text-xs font-newsreader text-gray-800 leading-relaxed bg-white p-3 border border-brand-cerulean/15">
                            {characteristics.math || 'Đang cập nhật đặc thù đề toán...'}
                        </p>
                    </div>

                    {/* Literature Specifics */}
                    <div className="border border-brand-cerulean/30 bg-brand-cream/30 p-4.5 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                            <FileText size={15} /> 2. Đặc Thù Môn Ngữ Văn
                        </div>
                        <p className="text-xs font-newsreader text-gray-800 leading-relaxed bg-white p-3 border border-brand-cerulean/15">
                            {characteristics.literature || 'Đang cập nhật đặc thù đề văn...'}
                        </p>
                    </div>

                    {/* English Specifics */}
                    <div className="border border-brand-cerulean/30 bg-brand-cream/30 p-4.5 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                            <Award size={15} /> 3. Đặc Thù Môn Tiếng Anh
                        </div>
                        <p className="text-xs font-newsreader text-gray-800 leading-relaxed bg-white p-3 border border-brand-cerulean/15">
                            {characteristics.english || 'Đang cập nhật đặc thù đề anh...'}
                        </p>
                    </div>
                </div>
            </div>

            {/* School Benchmark Scores & Provincial Exams - Editorial List */}
            <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-cerulean/20 pb-4">
                    <div>
                        <h4 className="text-xl font-serif-title font-bold text-brand-cerulean flex items-center gap-2">
                            <Building2 size={20} className="text-brand-jasper" />
                            Điểm Chuẩn Tuyển Sinh & Các Trường THPT Trọng Điểm ({activeProvince.provinceName})
                        </h4>
                        <p className="text-xs font-newsreader text-gray-600 mt-1">
                            Tra cứu điểm chuẩn đầu vào các trường Chuyên và trường Đại trà Top đầu qua các năm.
                        </p>
                    </div>

                    {/* Filter Type */}
                    <div className="flex items-center gap-1.5 border border-brand-cerulean/30 bg-white p-1">
                        {['all', 'Chuyên', 'Đại trà'].map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFilterType(t)}
                                className={`px-3 py-1 text-xs font-serif-title font-bold transition-all ${
                                    filterType === t
                                        ? 'bg-brand-cerulean text-white'
                                        : 'text-brand-cerulean hover:bg-brand-cream'
                                }`}
                            >
                                {t === 'all' ? 'Tất cả' : t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSchools.map((school, sIdx) => (
                        <div
                            key={sIdx}
                            className="p-4 border border-brand-cerulean/25 bg-white flex items-center justify-between gap-4 hover:border-brand-cerulean transition-all shadow-xs"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-serif-title font-bold uppercase px-2 py-0.5 border ${
                                        school.type === 'Chuyên'
                                            ? 'bg-brand-jasper text-white border-brand-jasper'
                                            : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30'
                                    }`}>
                                        {school.type}
                                    </span>
                                </div>
                                <h5 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                    {school.name}
                                </h5>
                            </div>

                            <div className="text-right shrink-0">
                                <span className="text-[11px] font-mono text-gray-400 block font-bold">Điểm Chuẩn:</span>
                                <span className="text-base font-mono font-bold text-brand-jasper">
                                    {school.benchmarkAvg || school.benchmark || 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
