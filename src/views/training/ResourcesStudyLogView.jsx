import React, { useState, useEffect } from 'react';
import {
    FolderOpen,
    BookMarked,
    Plus,
    Trash2,
    FileText,
    ExternalLink
} from 'lucide-react';
import { EditorialSelect, EditorialDatePicker } from '../../components/common/EditorialWidgets';

export const ResourcesStudyLogView = ({ modules, studyLogs, resources, onAddStudyLog, onDeleteStudyLog, onAddResource, onDeleteResource }) => {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('pedagogy_resources_tab');
            if (saved) return saved;
        }
        return 'resources';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pedagogy_resources_tab', activeTab);
        }
    }, [activeTab]);
    const [logForm, setLogForm] = useState({ moduleId: modules[0]?.id || '', title: '', content: '' });
    const [resForm, setResForm] = useState({ moduleId: modules[0]?.id || '', title: '', type: 'Drive / PDF', url: '' });

    const handleCreateLog = (e) => {
        e.preventDefault();
        onAddStudyLog({
            id: 'log_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...logForm
        });
        setLogForm({ moduleId: modules[0]?.id || '', title: '', content: '' });
    };

    const handleCreateResource = (e) => {
        e.preventDefault();
        onAddResource({
            id: 'res_' + Date.now(),
            ...resForm
        });
        setResForm({ moduleId: modules[0]?.id || '', title: '', type: 'Drive / PDF', url: '' });
    };

    const moduleOptions = modules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Quản lý Học liệu & Nhật ký học tập</h2>
                    <p className="text-lg text-gray-600 mt-1">Lưu trữ tài liệu giảng dạy & ghi chép cá nhân sau từng buổi học.</p>
                </div>
                <div className="flex bg-white p-1 border border-brand-cerulean">
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-1.5 font-serif-title ${activeTab === 'resources' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean'}`}
                    >
                        Tài liệu học phần
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-1.5 font-serif-title ${activeTab === 'logs' ? 'bg-brand-cerulean text-white' : 'text-brand-cerulean'}`}
                    >
                        Nhật ký học tập
                    </button>
                </div>
            </header>

            {activeTab === 'resources' ? (
                <div className="space-y-6">
                    <form onSubmit={handleCreateResource} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <h3 className="text-xl font-serif-title text-brand-cerulean">Thêm Học liệu / Tài liệu mới</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <EditorialSelect
                                    label="Học phần"
                                    value={resForm.moduleId}
                                    onChange={val => setResForm({ ...resForm, moduleId: val })}
                                    options={moduleOptions}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên tài liệu / Slide</label>
                                <input required type="text" className="input-editorial w-full" value={resForm.title} onChange={e => setResForm({ ...resForm, title: e.target.value })} placeholder="VD: Slide Chương 1 - Tâm lý học" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-end">
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">URL Liên kết (Google Drive / DropBox)</label>
                                <input required type="url" className="input-editorial w-full" value={resForm.url} onChange={e => setResForm({ ...resForm, url: e.target.value })} placeholder="https://drive.google.com/..." />
                            </div>
                            <div>
                                <button type="submit" className="w-full py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">
                                    + Lưu Học liệu
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {resources.map(res => {
                            const mod = modules.find(m => m.id === res.moduleId);
                            return (
                                <div key={res.id} className="bg-white border-editorial p-4 shadow-editorial flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-bold text-gray-500">{mod?.code} - {mod?.name}</span>
                                        <h4 className="text-xl font-serif-title text-brand-cerulean">{res.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <a href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-jasper hover:underline font-serif-title">
                                            <ExternalLink size={16} /> Mở tài liệu
                                        </a>
                                        <button onClick={() => onDeleteResource(res.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <form onSubmit={handleCreateLog} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <h3 className="text-xl font-serif-title text-brand-cerulean">Ghi chép Nhật ký học tập</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <EditorialSelect
                                    label="Học phần"
                                    value={logForm.moduleId}
                                    onChange={val => setLogForm({ ...logForm, moduleId: val })}
                                    options={moduleOptions}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tiêu đề ghi chú</label>
                                <input required type="text" className="input-editorial w-full" value={logForm.title} onChange={e => setLogForm({ ...logForm, title: e.target.value })} placeholder="VD: Những thắc mắc cần hỏi thầy..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Nội dung ghi chép</label>
                            <textarea required rows="3" className="input-editorial w-full resize-none" value={logForm.content} onChange={e => setLogForm({ ...logForm, content: e.target.value })} placeholder="Nhập nội dung bài học hoặc phần ôn tập..."></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">
                                Lưu Nhật Ký
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {studyLogs.map(log => {
                            const mod = modules.find(m => m.id === log.moduleId);
                            return (
                                <div key={log.id} className="bg-white border-editorial p-6 shadow-editorial">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400">{log.date} &bull; {mod?.name}</span>
                                            <h4 className="text-2xl font-serif-title text-brand-cerulean">{log.title}</h4>
                                        </div>
                                        <button onClick={() => onDeleteStudyLog(log.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-gray-700 font-body leading-relaxed text-lg">{log.content}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
