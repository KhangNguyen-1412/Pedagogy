import React, { useState } from 'react';
import {
    FileSpreadsheet,
    FileText,
    Presentation,
    Play,
    CheckCircle2,
    Clock,
    Award,
    Sparkles,
    Search,
    Filter,
    Layers,
    BookOpen
} from 'lucide-react';
import { MOS_MULTI_PROJECTS, MOS_SUBJECTS } from '../../data/mosIc3Data';
import { EditorialSelect } from '../../components/common/EditorialWidgets';

export const MosProjectBankView = ({ onSelectProject, navigate }) => {
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const subjectFilterOptions = [
        { label: 'Tất cả phần mềm', value: 'all' },
        { label: 'MOS Excel 365', value: 'mos_excel' },
        { label: 'MOS Word 365', value: 'mos_word' },
        { label: 'MOS PowerPoint 365', value: 'mos_ppt' }
    ];

    const filteredProjects = MOS_MULTI_PROJECTS.filter(p => {
        const matchesSubject = selectedSubjectFilter === 'all' || p.subjectId === selectedSubjectFilter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.context.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSubject && matchesSearch;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Standard Pedagogy Sticky Header */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Kho Dự Án Multi-Projects MOS</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Dự án tình huống thực tế chuẩn Certiport (Word, Excel, PowerPoint 2019/365).</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (onSelectProject) onSelectProject('proj_excel_01');
                            if (navigate) navigate('mos_sandbox');
                        }}
                        className="px-5 py-2.5 bg-brand-jasper text-brand-cream font-serif-title hover:bg-red-800 transition-colors shadow-editorial flex items-center gap-2"
                    >
                        <Play size={16} /> Vào Phòng Lab Ảo
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 border-editorial shadow-editorial flex flex-col sm:flex-row justify-between gap-4 items-center">
                <div className="w-full sm:w-60">
                    <EditorialSelect
                        value={selectedSubjectFilter}
                        onChange={setSelectedSubjectFilter}
                        options={subjectFilterOptions}
                    />
                </div>

                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm dự án, nghiệp vụ HR, Báo cáo..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 font-body text-sm focus:outline-none focus:border-brand-cerulean"
                    />
                </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((proj) => {
                    const isExcel = proj.subjectId === 'mos_excel';
                    const isWord = proj.subjectId === 'mos_word';
                    const isPpt = proj.subjectId === 'mos_ppt';

                    return (
                        <div
                            key={proj.id}
                            className="bg-white border-editorial shadow-editorial hover:shadow-2xl transition-all flex flex-col justify-between p-6 relative overflow-hidden group"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${
                                isExcel ? 'bg-[#107c41]' : isWord ? 'bg-[#185abd]' : 'bg-[#c43e1c]'
                            }`} />

                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2 pt-1">
                                    <span className={`px-2.5 py-0.5 text-xs font-serif-title font-bold uppercase rounded ${
                                        isExcel ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : isWord ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-red-100 text-red-900 border border-red-300'
                                    }`}>
                                        {isExcel ? 'Excel 365' : isWord ? 'Word 365' : 'PowerPoint 365'}
                                    </span>
                                    <span className="text-xs font-mono text-gray-500 font-bold">50 Phút thi</span>
                                </div>

                                <h3 className="text-xl font-serif-title font-bold text-brand-cerulean group-hover:text-brand-jasper transition-colors line-clamp-2">
                                    {proj.title}
                                </h3>

                                <p className="text-sm font-body text-gray-600 leading-relaxed line-clamp-3">
                                    {proj.context}
                                </p>

                                <div className="p-3 bg-brand-cream/60 border border-brand-cerulean/20 rounded space-y-1.5 text-xs font-body">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Số lượng tác vụ:</span>
                                        <strong className="font-serif-title text-brand-cerulean text-sm">{proj.tasks.length} tasks</strong>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tệp tài nguyên:</span>
                                        <span className="font-mono text-gray-600 truncate max-w-[200px]">{proj.documentName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 mt-5 flex justify-between items-center">
                                <span className="text-xs font-serif-title font-bold text-emerald-800 flex items-center gap-1">
                                    <CheckCircle2 size={15} /> Điểm chuẩn: 700/1000
                                </span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onSelectProject) onSelectProject(proj.id);
                                        if (navigate) navigate('mos_sandbox');
                                    }}
                                    className="px-4 py-2 bg-brand-cerulean hover:bg-brand-jasper text-brand-cream font-serif-title font-bold text-xs shadow-editorial transition-colors flex items-center gap-1.5"
                                >
                                    <Play size={13} /> Thực hành Lab
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
