import React, { useState } from 'react';
import { Plus, CheckCircle2, PlusCircle } from 'lucide-react';
import { EditorialSelect, Modal } from '../../components/common/EditorialWidgets';
import { getCategoryPresets, isModuleInProgram } from '../../utils/ruleValidators';

export const ProgramsView = ({ programs, modules = [], onAddProgram, onToggleEnrollProgram, navigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'dai_hoc',
        evaluationType: 'credits',
        totalCreditsRequired: 135,
        status: 'active',
        rules: { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
    });

    const statusFilterOptions = [
        { label: 'Tất cả trạng thái', value: 'all' },
        { label: 'Đang học', value: 'active' },
        { label: 'Lên kế hoạch', value: 'planning' },
        { label: 'Đã hoàn thành', value: 'completed' },
    ];

    const handleUpdateProgramFormRule = (field, val) => {
        const num = Math.max(0, parseInt(val, 10) || 0);
        const nextRules = { ...formData.rules, [field]: num };
        setFormData({
            ...formData,
            rules: nextRules
        });
    };

    const programTotalCredits = formData.category === 'dai_hoc'
        ? ((formData.rules?.general ?? 0) +
           (formData.rules?.fundamentalMandatory ?? formData.rules?.fundamental ?? 0) +
           (formData.rules?.fundamentalElective ?? 0) +
           (formData.rules?.specializedMandatory ?? 0) +
           (formData.rules?.specializedElective ?? 0) +
           (formData.rules?.internshipGraduation ?? 0))
        : formData.evaluationType === 'modules' || formData.evaluationType === 'hours'
            ? ((formData.rules?.mandatoryA ?? 0) + (formData.rules?.electiveA ?? 0))
            : ((formData.rules?.mandatoryA ?? 0) +
               (formData.rules?.electiveA ?? 0) +
               (formData.rules?.mandatoryB ?? 0) +
               (formData.rules?.practiceB ?? 0) +
               (formData.rules?.electiveB ?? 0));

    const handleCreate = (e) => {
        e.preventDefault();
        const newProg = {
            id: 'prog_' + Date.now(),
            ...formData,
            isEnrolled: true,
            totalCreditsRequired: Number(formData.totalCreditsRequired),
            createdAt: new Date().toISOString()
        };
        onAddProgram(newProg);
        setIsModalOpen(false);
        setFormData({
            name: '',
            description: '',
            category: 'dai_hoc',
            evaluationType: 'credits',
            totalCreditsRequired: 135,
            status: 'active',
            rules: { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
        });
    };

    const filteredPrograms = statusFilter === 'all'
        ? programs
        : programs.filter(p => (p.status || 'active') === statusFilter);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Quản lý Chương trình đào tạo</h2>
                    <p className="text-lg text-gray-600 mt-2">Cấu trúc quy tắc tín chỉ Đại học & Khóa bồi dưỡng nghiệp vụ.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-52">
                        <EditorialSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilterOptions}
                        />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-jasper text-brand-cream font-serif-title hover:bg-red-800 transition-colors shadow-editorial whitespace-nowrap">
                        <Plus size={18} /> Khởi tạo
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredPrograms.map(prog => {
                    const sharedCount = modules.filter(m => isModuleInProgram(m, prog.id) && m.programIds && m.programIds.length > 1).length;
                    const isEnrolled = prog.isEnrolled !== false;
                    const isDaiHoc = prog.category === 'dai_hoc' || prog.rules?.general !== undefined;

                    return (
                        <div key={prog.id} className="border-editorial p-6 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-blue-50/30 transition-colors">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold cursor-pointer group-hover:text-brand-jasper" onClick={() => navigate('program_detail', { programId: prog.id })}>
                                        {prog.name}
                                    </h3>
                                    {isEnrolled ? (
                                        <span className="px-2.5 py-0.5 bg-brand-cerulean/15 text-brand-cerulean text-xs font-bold font-serif-title rounded border border-brand-cerulean/40 flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Đang chọn học
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold font-serif-title rounded border border-gray-300">
                                            Chưa chọn
                                        </span>
                                    )}
                                    {isDaiHoc && (
                                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-title rounded border border-emerald-300">
                                            Bậc Đại học (4 năm)
                                        </span>
                                    )}
                                    {sharedCount > 0 && (
                                        <span className="px-2.5 py-0.5 bg-blue-50 text-brand-cerulean/80 text-xs font-bold font-serif-title rounded border border-brand-cerulean/20">
                                            {sharedCount} học phần dùng chung
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{prog.description}</p>
                                
                                {isDaiHoc ? (
                                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-sans">
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">GD Đại cương: <b>{prog.rules?.general ?? 28} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">Cơ sở ngành (BB): <b>{prog.rules?.fundamentalMandatory ?? prog.rules?.fundamental ?? 26} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">Cơ sở ngành (TC): <b>{prog.rules?.fundamentalElective ?? 8} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">Chuyên ngành (BB): <b>{prog.rules?.specializedMandatory ?? 42} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">Chuyên ngành (TC): <b>{prog.rules?.specializedElective ?? 16} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">Thực tập & Khóa luận: <b>{prog.rules?.internshipGraduation ?? 15} TC</b></span>
                                    </div>
                                ) : prog.evaluationType === 'credits' && prog.rules ? (
                                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-sans">
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">A Bắt buộc: <b>{prog.rules.mandatoryA || 0} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">A Tự chọn: <b>{prog.rules.electiveA || 0} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">B Bắt buộc: <b>{prog.rules.mandatoryB || 0} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">B Thực hành: <b>{prog.rules.practiceB || 0} TC</b></span>
                                        <span className="bg-brand-cream border border-brand-cerulean/20 px-2 py-1 rounded">B Tự chọn: <b>{prog.rules.electiveB || 0} TC</b></span>
                                    </div>
                                ) : null}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => onToggleEnrollProgram && onToggleEnrollProgram(prog.id)}
                                    className={`px-4 py-2 text-xs font-serif-title font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                                        isEnrolled
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                            : 'bg-brand-cream border border-brand-cerulean text-brand-cerulean hover:bg-brand-cerulean hover:text-white'
                                    }`}
                                >
                                    {isEnrolled ? <CheckCircle2 size={16} /> : <PlusCircle size={16} />}
                                    {isEnrolled ? '✓ Đang chọn học' : '+ Chọn học môn này'}
                                </button>
                                <button onClick={() => navigate('program_detail', { programId: prog.id })} className="px-5 py-2 border border-brand-cerulean text-brand-cerulean font-serif-title hover:bg-brand-cerulean hover:text-white transition-colors whitespace-nowrap text-xs text-center">
                                    Đề cương & Học phần &rarr;
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Khởi tạo Chương trình đào tạo mới">
                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên chương trình (VD: Cử nhân Sư phạm Toán 2023 - 2027)</label>
                        <input required type="text" className="input-editorial w-full text-xl" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nhập tên chương trình..." />
                    </div>
                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mô tả mục tiêu</label>
                        <textarea className="input-editorial w-full resize-none" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Chương trình đào tạo cử nhân chất lượng cao..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <EditorialSelect
                                label="Phân loại Cấp bậc & Nhánh đào tạo"
                                value={formData.category || 'dai_hoc'}
                                onChange={val => {
                                    const presets = getCategoryPresets(val);
                                    setFormData({
                                        ...formData,
                                        category: val,
                                        evaluationType: presets.evaluationType,
                                        totalCreditsRequired: presets.totalCreditsRequired,
                                        rules: presets.rules
                                    });
                                }}
                                options={[
                                    { label: 'Bậc Đại học (Cử nhân / Kỹ sư 120-150 TC)', value: 'dai_hoc' },
                                    { label: 'Nhánh A: Nghiệp vụ Sư phạm (34-36 TC)', value: 'nhanh_a' },
                                    { label: 'Nhánh B: Bồi dưỡng CDNN Giáo viên', value: 'nhanh_b' },
                                    { label: 'Nhánh C: Chứng chỉ Kỹ năng / Ngắn hạn', value: 'nhanh_c' }
                                ]}
                            />
                        </div>
                        <div>
                            <EditorialSelect
                                label="Hệ thống Đánh giá & Tiến độ"
                                value={formData.evaluationType || 'credits'}
                                onChange={val => setFormData({ ...formData, evaluationType: val })}
                                options={[
                                    { label: 'Hệ Tín chỉ & GPA (Đại học, NVSP)', value: 'credits' },
                                    { label: 'Hệ Học phần & Chuyên đề (Bồi dưỡng CDNN)', value: 'modules' },
                                    { label: 'Hệ Thời lượng Tiết/Giờ học (BDTX, Kỹ năng)', value: 'hours' }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Dynamic Rule Config according to category and evaluationType */}
                    <div className="border p-4 bg-brand-cream border-brand-cerulean/20 space-y-4">
                        <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                            <h4 className="font-serif-title text-brand-cerulean text-lg">
                                {formData.category === 'dai_hoc'
                                    ? 'Cơ cấu số tín chỉ các khối có trong CTĐT'
                                    : formData.evaluationType === 'modules'
                                        ? 'Cơ cấu chuyên đề có trong CTĐT'
                                        : formData.evaluationType === 'hours'
                                            ? 'Cơ cấu thời lượng tiết học trong CTĐT'
                                            : 'Cơ cấu tín chỉ các khối có trong CTĐT'}
                            </h4>
                            <span className="text-[11px] text-gray-500 font-sans italic">
                                * Điền số lượng mở trong chương trình
                            </span>
                        </div>

                        {formData.category === 'dai_hoc' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">GD Đại cương (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.general ?? 28} onChange={e => handleUpdateProgramFormRule('general', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Cơ sở ngành BB (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.fundamentalMandatory ?? formData.rules.fundamental ?? 26} onChange={e => handleUpdateProgramFormRule('fundamentalMandatory', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Cơ sở ngành TC (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.fundamentalElective ?? 8} onChange={e => handleUpdateProgramFormRule('fundamentalElective', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên ngành BB (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.specializedMandatory ?? 42} onChange={e => handleUpdateProgramFormRule('specializedMandatory', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên ngành TC (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.specializedElective ?? 16} onChange={e => handleUpdateProgramFormRule('specializedElective', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Thực tập & Khóa luận (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.internshipGraduation ?? 15} onChange={e => handleUpdateProgramFormRule('internshipGraduation', e.target.value)} />
                                </div>
                            </div>
                        ) : formData.evaluationType === 'modules' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên đề Bắt buộc (Số môn)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryA} onChange={e => handleUpdateProgramFormRule('mandatoryA', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên đề Tự chọn (Số môn)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveA} onChange={e => handleUpdateProgramFormRule('electiveA', e.target.value)} />
                                </div>
                            </div>
                        ) : formData.evaluationType === 'hours' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Lý thuyết / Bài học (Tiết)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryA} onChange={e => handleUpdateProgramFormRule('mandatoryA', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Thực hành / Bài tập (Tiết)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveA} onChange={e => handleUpdateProgramFormRule('electiveA', e.target.value)} />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Bắt buộc (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryA} onChange={e => handleUpdateProgramFormRule('mandatoryA', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Tự chọn (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveA} onChange={e => handleUpdateProgramFormRule('electiveA', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Bắt buộc (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.mandatoryB} onChange={e => handleUpdateProgramFormRule('mandatoryB', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Thực hành (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.practiceB} onChange={e => handleUpdateProgramFormRule('practiceB', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Tự chọn (TC)</label>
                                    <input type="number" min="0" className="input-editorial w-full" value={formData.rules.electiveB} onChange={e => handleUpdateProgramFormRule('electiveB', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* Summary & Graduation Target Requirement */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-brand-cerulean/20">
                            <div className="p-3.5 bg-blue-50/70 border border-brand-cerulean/25 rounded space-y-1">
                                <div className="text-xs font-bold text-gray-700">
                                    Tổng số {formData.evaluationType === 'modules' ? 'chuyên đề' : formData.evaluationType === 'hours' ? 'tiết học' : 'TC'} có trong CTĐT (Tự động cộng)
                                </div>
                                <div className="text-2xl font-serif-title font-bold text-brand-cerulean flex items-baseline gap-1.5">
                                    <span>{programTotalCredits}</span>
                                    <span className="text-xs font-sans text-gray-500 font-normal">
                                        {formData.evaluationType === 'modules' ? 'chuyên đề mở' : formData.evaluationType === 'hours' ? 'tiết' : 'tín chỉ mở'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 italic">Tổng số lượng có trong toàn bộ danh mục chương trình đào tạo</p>
                            </div>
                            <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded space-y-1">
                                <label className="block text-xs font-bold text-brand-jasper">
                                    Số {formData.evaluationType === 'modules' ? 'chuyên đề' : formData.evaluationType === 'hours' ? 'tiết' : 'tín chỉ'} cần học để tốt nghiệp (Định mức) *
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="input-editorial w-full font-bold text-brand-jasper bg-white text-lg"
                                        value={formData.totalCreditsRequired}
                                        onChange={e => setFormData({ ...formData, totalCreditsRequired: Number(e.target.value) })}
                                        placeholder={formData.category === 'dai_hoc' ? "VD: 135" : "VD: 34"}
                                    />
                                    <span className="text-xs font-bold font-serif-title text-brand-jasper shrink-0">
                                        {formData.evaluationType === 'modules' ? 'Chuyên đề' : formData.evaluationType === 'hours' ? 'Tiết' : 'TC'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-brand-jasper/80 italic">Số tín chỉ thực tế sinh viên phải tích lũy để được xét tốt nghiệp</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover">Lưu Chương Trình</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
