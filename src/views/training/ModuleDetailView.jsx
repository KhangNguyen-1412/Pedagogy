import React, { useState, useEffect } from 'react';
import {
    Pencil,
    Trash2,
    BookOpen,
    Clock,
    FileText,
    ArrowLeft,
    CheckCircle2,
    Link2,
    Unlink,
    Plus,
    PlusCircle,
    Check,
    Award
} from 'lucide-react';
import { EditorialSelect, Modal } from '../../components/common/EditorialWidgets';
import { isModuleInProgram, getModuleProgramNames } from "../../utils/ruleValidators";
import { calculateModuleFinal } from "../../utils/gpaCalculators";
import { formatModuleName } from "../../utils/seoHelpers";

export const ModuleDetailView = ({ moduleId, programId, programs, modules, profile, onUpdateModule, onDeleteModule, navigate }) => {
    const moduleItem = modules.find(m => m.id === moduleId);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);

    if (!moduleItem) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center border border-dashed border-brand-cerulean">
                <p className="text-xl font-serif-title text-gray-500 mb-4">Không tìm thấy thông tin học phần.</p>
                <button
                    onClick={() => navigate('program_detail', { programId })}
                    className="px-6 py-2 bg-brand-cerulean text-white font-serif-title"
                >
                    Quay lại Chương trình
                </button>
            </div>
        );
    }

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editingModule) return;
        onUpdateModule({
            ...editingModule,
            code: (editingModule.code || '').toUpperCase().trim(),
            credits: Number(editingModule.credits)
        });
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        const pIds = moduleItem.programIds || [];
        if (pIds.length > 1) {
            // Module belongs to multiple programs — ask unlink or full delete
            const choice = window.confirm(
                `Học phần "${moduleItem.name}" đang dùng chung giữa ${pIds.length} chương trình.\n\n` +
                `Bấm OK để GỠ khỏi chương trình hiện tại (giữ lại ở các CT khác).\n` +
                `Bấm Cancel để hủy thao tác.`
            );
            if (choice) {
                // Unlink from current program only
                const newProgramIds = pIds.filter(id => id !== programId);
                onUpdateModule({ ...moduleItem, programIds: newProgramIds });
                navigate('program_detail', { programId });
            }
        } else {
            if (window.confirm(`Bạn có chắc chắn muốn xóa hoàn toàn học phần "${moduleItem.name}"?`)) {
                onDeleteModule(moduleItem.id);
                navigate('program_detail', { programId: (pIds[0] || programId) });
            }
        }
    };

    // Unlink module from a specific program
    const handleUnlinkFromProgram = (targetProgId) => {
        const pIds = moduleItem.programIds || [];
        if (pIds.length <= 1) return; // Can't unlink if only 1 program
        const newProgramIds = pIds.filter(id => id !== targetProgId);
        onUpdateModule({ ...moduleItem, programIds: newProgramIds });
    };

    // Add module to another program
    const handleAddToProgram = (targetProgId) => {
        const pIds = moduleItem.programIds || [];
        if (pIds.includes(targetProgId)) return;
        onUpdateModule({ ...moduleItem, programIds: [...pIds, targetProgId] });
    };

    // Programs not yet linked to this module
    const unlinkablePrograms = programs.filter(p => !(moduleItem.programIds || []).includes(p.id));

    const { score10, letter, gpa4 } = calculateModuleFinal(moduleItem.grades, moduleItem.syllabus?.weights);

    const moduleTypeOptions = [
        { label: 'Bắt buộc', value: 'mandatory' },
        { label: 'Tự chọn', value: 'elective' },
        { label: 'Thực hành', value: 'practice' },
    ];

    const categoryFormOptions = [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
    ];

    const statusOptions = [
        { label: 'Lên kế hoạch', value: 'planned' },
        { label: 'Đang học', value: 'in_progress' },
        { label: 'Đã hoàn thành', value: 'completed' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Sticky Header Container */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean space-y-3">
                <button
                    onClick={() => navigate('program_detail', { programId: programId || (moduleItem.programIds && moduleItem.programIds[0]) })}
                    className="flex items-center gap-2 text-brand-cerulean hover:text-brand-jasper font-serif-title text-sm font-bold transition-colors"
                >
                    <ArrowLeft size={16} /> Quay lại danh sách học phần
                </button>

                <header className="bg-white border-editorial p-6 shadow-editorial flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2.5 py-1 bg-brand-cerulean text-white font-sans font-bold text-xs rounded">
                            {(moduleItem.code || '').toUpperCase()}
                        </span>
                        <span className="px-2.5 py-1 bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 font-serif-title text-xs font-bold">
                            Nhánh {moduleItem.category || 'A'}
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 font-sans text-xs font-bold">
                            {moduleItem.credits} Tín chỉ
                        </span>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-sans text-xs">
                            {moduleItem.type === 'mandatory' ? 'Bắt buộc' : moduleItem.type === 'practice' ? 'Thực hành' : 'Tự chọn'}
                        </span>
                        {moduleItem.programIds && moduleItem.programIds.length > 1 && (
                            <span className="px-2.5 py-1 bg-blue-50/50 text-brand-cerulean/80 border border-brand-cerulean/20 font-serif-title text-xs font-bold flex items-center gap-1">
                                <Link2 size={12} /> Dùng chung ({moduleItem.programIds.length} CT)
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-serif-title text-brand-cerulean">{formatModuleName(moduleItem.name, profile?.teachingSubject || profile?.major)}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setEditingModule({ ...moduleItem });
                            setIsEditModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-cream text-brand-cerulean border border-brand-cerulean font-serif-title shadow-sm hover:border-brand-jasper hover:text-brand-jasper transition-all"
                    >
                        <Pencil size={16} /> Chỉnh sửa
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa học phần"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>
            </div>

            {/* Main Content Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Summary Card */}
                <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean border-b border-brand-cerulean/20 pb-2">
                        Kết quả Học tập
                    </h3>
                    <div className="flex justify-around items-center py-4 bg-brand-cream border border-brand-cerulean/20">
                        <div className="text-center">
                            <span className="text-xs uppercase text-gray-500 font-bold block">Tổng điểm 10</span>
                            <span className="text-3xl font-serif-title text-brand-jasper font-bold">{score10}</span>
                        </div>
                        <div className="h-8 w-px bg-brand-cerulean/20"></div>
                        <div className="text-center">
                            <span className="text-xs uppercase text-gray-500 font-bold block">Hệ 4.0</span>
                            <span className="text-3xl font-serif-title text-brand-cerulean font-bold">{letter} ({gpa4})</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm font-body">
                        <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-600">Chuyên cần (10%):</span>
                            <span className="font-bold">{moduleItem.grades?.attendance || 0} / 10</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-600">Giữa kỳ (30%):</span>
                            <span className="font-bold">{moduleItem.grades?.midterm || 0} / 10</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-600">Cuối kỳ (60%):</span>
                            <span className="font-bold">{moduleItem.grades?.final || 0} / 10</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('gradebook')}
                        className="w-full mt-4 py-2 bg-brand-cerulean text-white font-serif-title text-sm hover:bg-brand-jasper transition-colors"
                    >
                        Vào Sổ điểm cập nhật
                    </button>
                </div>

                {/* Syllabus Card */}
                <div className="md:col-span-2 bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-2">
                        <h3 className="text-2xl font-serif-title text-brand-cerulean">Mô tả & Đề cương môn học</h3>
                        <button onClick={() => navigate('syllabus')} className="text-sm font-serif-title text-brand-jasper hover:underline">
                            Sửa đề cương &rarr;
                        </button>
                    </div>

                    <div>
                        <h5 className="text-sm font-serif-title text-brand-cerulean font-bold mb-1">Mục tiêu môn học</h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {moduleItem.syllabus?.description || 'Chưa cập nhật mô tả mục tiêu học phần.'}
                        </p>
                    </div>

                    {moduleItem.syllabus?.prerequisites && (
                        <div>
                            <h5 className="text-sm font-serif-title text-brand-cerulean font-bold mb-1">Điều kiện tiên quyết / Ghi chú</h5>
                            <p className="text-gray-600 text-sm italic">{moduleItem.syllabus.prerequisites}</p>
                        </div>
                    )}

                    {moduleItem.syllabus?.clos && moduleItem.syllabus.clos.length > 0 && (
                        <div>
                            <h5 className="text-sm font-serif-title text-brand-cerulean font-bold mb-2">Chuẩn đầu ra (CLOs)</h5>
                            <ul className="space-y-1 text-sm text-gray-700 font-body">
                                {moduleItem.syllabus.clos.map((clo, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-brand-jasper font-bold">•</span>
                                        <span>{clo}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {moduleItem.syllabus?.schedule && moduleItem.syllabus.schedule.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 space-y-2">
                            <h5 className="text-sm font-serif-title text-brand-cerulean font-bold">Khung bài học theo tuần/buổi</h5>
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {moduleItem.syllabus.schedule.map((item, idx) => (
                                    <div key={idx} className="p-2.5 bg-brand-cream/50 border border-brand-cerulean/15 text-xs font-body flex justify-between items-start gap-3">
                                        <div className="font-bold text-brand-cerulean whitespace-nowrap">Tuần {item.week || idx + 1}:</div>
                                        <div className="flex-1">
                                            <div className="font-serif-title font-bold text-brand-jasper text-sm">{item.title}</div>
                                            {item.topics && <div className="text-gray-600 mt-0.5">{item.topics}</div>}
                                        </div>
                                        {item.hours && <div className="text-gray-500 font-bold whitespace-nowrap">{item.hours} tiết</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Linked Programs Section */}
            <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-2">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean flex items-center gap-2">
                        <Link2 size={20} /> Chương trình liên kết
                    </h3>
                    <span className="text-xs bg-blue-50/50 text-brand-cerulean/80 px-2.5 py-1 font-bold font-serif-title rounded border border-brand-cerulean/20">
                        {(moduleItem.programIds || []).length} chương trình
                    </span>
                </div>

                <div className="space-y-2">
                    {(moduleItem.programIds || []).map(pId => {
                        const prog = programs.find(p => p.id === pId);
                        const canUnlink = (moduleItem.programIds || []).length > 1;
                        return (
                            <div key={pId} className="flex items-center justify-between p-3 bg-brand-cream border border-brand-cerulean/20 hover:border-brand-cerulean transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-cerulean/10 text-brand-cerulean">
                                        <BookOpen size={16} />
                                    </div>
                                    <div>
                                        <h5
                                            className="text-base font-serif-title text-brand-cerulean font-bold cursor-pointer hover:text-brand-jasper transition-colors"
                                            onClick={() => navigate('program_detail', { programId: pId })}
                                        >
                                            {prog?.name || pId}
                                        </h5>
                                        <span className="text-xs text-gray-500">
                                            {prog?.totalCreditsRequired || '?'} TC yêu cầu • {prog?.status === 'completed' ? 'Đã hoàn thành' : 'Đang học'}
                                        </span>
                                    </div>
                                    {pId === programId && (
                                        <span className="px-2 py-0.5 bg-brand-cerulean text-white text-[10px] font-bold rounded">Hiện tại</span>
                                    )}
                                </div>
                                {canUnlink && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm(`Gỡ học phần "${moduleItem.name}" khỏi chương trình "${prog?.name || pId}"?`)) {
                                                handleUnlinkFromProgram(pId);
                                            }
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-serif-title text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                                        title="Gỡ liên kết khỏi chương trình này"
                                    >
                                        <Unlink size={12} /> Gỡ liên kết
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Add to another program */}
                {unlinkablePrograms.length > 0 && (
                    <div className="pt-3 border-t border-brand-cerulean/20">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-serif-title text-gray-600">Thêm vào chương trình khác:</span>
                            {unlinkablePrograms.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handleAddToProgram(p.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-serif-title font-bold bg-blue-50/50 text-brand-cerulean/80 border border-brand-cerulean/20 hover:bg-purple-100 transition-colors"
                                >
                                    <PlusCircle size={12} /> {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh sửa thông tin Học phần">
                {editingModule && (
                    <form onSubmit={handleSaveEdit} className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mã môn</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full uppercase"
                                    value={editingModule.code || ''}
                                    onChange={e => setEditingModule({ ...editingModule, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên học phần</label>
                                <input
                                    required
                                    type="text"
                                    className="input-editorial w-full"
                                    value={editingModule.name || ''}
                                    onChange={e => setEditingModule({ ...editingModule, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Số Tín chỉ</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    className="input-editorial w-full"
                                    value={editingModule.credits || 1}
                                    onChange={e => setEditingModule({ ...editingModule, credits: e.target.value })}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Phân loại"
                                    value={editingModule.type}
                                    onChange={val => setEditingModule({ ...editingModule, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Nhánh"
                                    value={editingModule.category}
                                    onChange={val => setEditingModule({ ...editingModule, category: val })}
                                    options={categoryFormOptions}
                                />
                            </div>
                        </div>

                        <div>
                            <EditorialSelect
                                label="Trạng thái học phần"
                                value={editingModule.status || 'planned'}
                                onChange={val => setEditingModule({ ...editingModule, status: val })}
                                options={statusOptions}
                            />
                        </div>

                        <div className="pt-4 flex justify-between items-center border-t border-brand-cerulean/20">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-serif-title text-sm flex items-center gap-1"
                            >
                                <Trash2 size={15} /> Xóa học phần
                            </button>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">Cập nhật</button>
                            </div>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};
