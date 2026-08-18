import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { EditorialSelect } from '../../components/common/EditorialWidgets';

export const SyllabusView = ({ modules, onUpdateModule, showToast }) => {
    const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || '');
    const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0];

    const defaultSyllabus = {
        description: '',
        prerequisites: '',
        clos: [''],
        schedule: [
            { week: 1, title: 'Buổi 1: Giới thiệu tổng quan & Đề cương học phần', topics: 'Nắm bắt mục tiêu, phương pháp giảng dạy và hình thức đánh giá.', hours: 3 }
        ],
        weights: { attendance: 10, midterm: 30, final: 60 }
    };

    const [syllabusData, setSyllabusData] = useState(currentModule?.syllabus || defaultSyllabus);

    useEffect(() => {
        if (currentModule) {
            setSyllabusData({
                description: currentModule.syllabus?.description || '',
                prerequisites: currentModule.syllabus?.prerequisites || '',
                clos: currentModule.syllabus?.clos || [''],
                schedule: currentModule.syllabus?.schedule || [
                    { week: 1, title: 'Buổi 1: Giới thiệu tổng quan & Đề cương học phần', topics: 'Nắm bắt mục tiêu, phương pháp giảng dạy và hình thức đánh giá.', hours: 3 }
                ],
                weights: currentModule.syllabus?.weights || { attendance: 10, midterm: 30, final: 60 }
            });
        }
    }, [selectedModuleId]);

    if (!currentModule) {
        return <div className="p-6 text-gray-500 font-serif-title text-xl">Chưa có học phần nào để quản lý đề cương.</div>;
    }

    const moduleSelectOptions = modules.map(m => ({
        label: `${(m.code || '').toUpperCase()} - ${m.name}`,
        value: m.id
    }));

    // Dynamic CLOs handlers
    const handleAddCLO = () => {
        setSyllabusData(prev => ({
            ...prev,
            clos: [...(prev.clos || []), '']
        }));
    };

    const handleCLOChange = (index, value) => {
        setSyllabusData(prev => {
            const nextCLOs = [...(prev.clos || [])];
            nextCLOs[index] = value;
            return { ...prev, clos: nextCLOs };
        });
    };

    const handleRemoveCLO = (index) => {
        setSyllabusData(prev => ({
            ...prev,
            clos: (prev.clos || []).filter((_, i) => i !== index)
        }));
    };

    // Dynamic Schedule handlers
    const handleAddScheduleRow = () => {
        setSyllabusData(prev => {
            const currentSchedule = prev.schedule || [];
            const nextWeek = currentSchedule.length + 1;
            return {
                ...prev,
                schedule: [
                    ...currentSchedule,
                    { week: nextWeek, title: '', topics: '', hours: 3 }
                ]
            };
        });
    };

    const handleScheduleChange = (index, field, value) => {
        setSyllabusData(prev => {
            const nextSchedule = [...(prev.schedule || [])];
            nextSchedule[index] = { ...nextSchedule[index], [field]: value };
            return { ...prev, schedule: nextSchedule };
        });
    };

    const handleRemoveScheduleRow = (index) => {
        setSyllabusData(prev => ({
            ...prev,
            schedule: (prev.schedule || []).filter((_, i) => i !== index)
        }));
    };

    const handleSaveSyllabus = (e) => {
        e.preventDefault();
        onUpdateModule({
            ...currentModule,
            syllabus: syllabusData
        });
        if (showToast) {
            showToast(`Đã lưu thành công đề cương chi tiết môn ${currentModule.name}!`, 'success');
        }
    };

    const att = Number(syllabusData.weights?.attendance || 0);
    const mid = Number(syllabusData.weights?.midterm || 0);
    const fin = Number(syllabusData.weights?.final || 0);
    const totalWeight = att + mid + fin;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Quản lý Đề cương chi tiết</h2>
                    <p className="text-lg text-gray-600 mt-1">Cấu hình Chuẩn đầu ra (CLOs), Khung bài học & Trọng số đánh giá.</p>
                </div>
                <div className="w-72">
                    <EditorialSelect
                        label="Chọn môn học"
                        value={selectedModuleId}
                        onChange={setSelectedModuleId}
                        options={moduleSelectOptions}
                    />
                </div>
            </header>

            <form onSubmit={handleSaveSyllabus} className="bg-white border-editorial p-8 shadow-editorial space-y-8">
                <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-4">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">{(currentModule.code || '').toUpperCase()}</span>
                        <h3 className="text-3xl font-serif-title text-brand-cerulean">{currentModule.name} ({currentModule.credits} TC)</h3>
                    </div>
                    <button type="submit" className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors">
                        Lưu Đề Cương Chi Tiết
                    </button>
                </div>

                {/* SECTION 1: THÔNG TIN CHUNG & MÔ TẢ MỤC TIÊU */}
                <div className="space-y-4">
                    <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        Thông tin chung & Mô tả mục tiêu
                    </h4>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mô tả mục tiêu môn học</label>
                        <textarea
                            rows="3"
                            className="input-editorial w-full resize-none"
                            value={syllabusData.description || ''}
                            onChange={e => setSyllabusData({ ...syllabusData, description: e.target.value })}
                            placeholder="Nhập mô tả mục tiêu học phần, kiến thức cốt lõi và năng lực đạt được..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Điều kiện tiên quyết / Ghi chú đề cương</label>
                        <input
                            type="text"
                            className="input-editorial w-full"
                            value={syllabusData.prerequisites || ''}
                            onChange={e => setSyllabusData({ ...syllabusData, prerequisites: e.target.value })}
                            placeholder="Ví dụ: Đã hoàn thành môn Lý luận dạy học..."
                        />
                    </div>
                </div>

                {/* SECTION 2: CHUẨN ĐẦU RA (CLOs) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                        <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                            Chuẩn đầu ra môn học (CLOs)
                        </h4>
                        <button type="button" onClick={handleAddCLO} className="text-xs font-serif-title text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                            <PlusCircle size={15} /> Thêm chuẩn đầu ra
                        </button>
                    </div>

                    <div className="space-y-3">
                        {(syllabusData.clos || []).map((clo, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-500 w-16 font-serif-title">CLO {idx + 1}:</span>
                                <input
                                    type="text"
                                    className="input-editorial flex-1"
                                    value={clo}
                                    onChange={e => handleCLOChange(idx, e.target.value)}
                                    placeholder="Ví dụ: Phân tích được các quy luật tâm lý học lứa tuổi..."
                                />
                                <button type="button" onClick={() => handleRemoveCLO(idx)} className="p-1 text-red-500 hover:text-red-700 transition-colors" title="Xóa dòng này">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {(!syllabusData.clos || syllabusData.clos.length === 0) && (
                            <p className="text-sm italic text-gray-400">Chưa có chuẩn đầu ra nào. Bấm 'Thêm chuẩn đầu ra' phía trên.</p>
                        )}
                    </div>
                </div>

                {/* SECTION 3: KHUNG BÀI HỌC (SẮP XẾP THEO TUẦN HOẶC BUỔI) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                        <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                            Khung bài học (Sắp xếp theo Tuần hoặc Buổi học)
                        </h4>
                        <button type="button" onClick={handleAddScheduleRow} className="text-xs font-serif-title text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                            <PlusCircle size={15} /> Thêm Buổi / Tuần học
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 border border-brand-cerulean/15 p-2.5 bg-brand-cream/20 rounded-sm">
                        {(syllabusData.schedule || []).map((item, idx) => (
                            <div key={idx} className="p-4 border border-brand-cerulean/20 bg-white space-y-3 relative group shadow-xs">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-2 w-36">
                                        <span className="text-xs font-bold text-brand-cerulean font-serif-title">Tuần/Buổi:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            className="input-editorial w-16 text-center font-bold"
                                            value={item.week || idx + 1}
                                            onChange={e => handleScheduleChange(idx, 'week', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="input-editorial w-full font-serif-title font-bold text-brand-cerulean"
                                            value={item.title || ''}
                                            onChange={e => handleScheduleChange(idx, 'title', e.target.value)}
                                            placeholder="Tên bài học / Tiêu đề buổi học..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-28">
                                        <input
                                            type="number"
                                            min="1"
                                            className="input-editorial w-14 text-center"
                                            value={item.hours || 3}
                                            onChange={e => handleScheduleChange(idx, 'hours', Number(e.target.value))}
                                        />
                                        <span className="text-xs text-gray-500 font-bold">tiết</span>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveScheduleRow(idx)} className="p-1 text-red-500 hover:text-red-700 transition-colors" title="Xóa buổi học này">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        className="input-editorial w-full text-xs text-gray-600"
                                        value={item.topics || ''}
                                        onChange={e => handleScheduleChange(idx, 'topics', e.target.value)}
                                        placeholder="Nội dung thảo luận, bài tập nhóm hoặc nhiệm vụ tự nghiên cứu..."
                                    />
                                </div>
                            </div>
                        ))}
                        {(!syllabusData.schedule || syllabusData.schedule.length === 0) && (
                            <p className="text-sm italic text-gray-400">Chưa có khung bài học nào. Bấm 'Thêm Buổi / Tuần học' để nhập liệu.</p>
                        )}
                    </div>
                </div>

                {/* SECTION 4: ĐÁNH GIÁ & TRỌNG SỐ */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                        <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                            Đánh giá & Trọng số điểm (%)
                        </h4>
                        <div>
                            {totalWeight === 100 ? (
                                <span className="px-2.5 py-1 bg-brand-cerulean text-white text-xs font-serif-title font-bold rounded shadow-sm">
                                    ✓ Tổng trọng số: 100%
                                </span>
                            ) : (
                                <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                                    Tổng trọng số: {totalWeight}% (Cần đủ 100%)
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-brand-cream border border-brand-cerulean/20 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên cần / Thái độ (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="input-editorial w-full font-bold"
                                value={syllabusData.weights?.attendance ?? 10}
                                onChange={e => setSyllabusData({
                                    ...syllabusData,
                                    weights: { ...syllabusData.weights, attendance: Number(e.target.value) }
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Giữa kỳ / Thảo luận (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="input-editorial w-full font-bold"
                                value={syllabusData.weights?.midterm ?? 30}
                                onChange={e => setSyllabusData({
                                    ...syllabusData,
                                    weights: { ...syllabusData.weights, midterm: Number(e.target.value) }
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Cuối kỳ / Đồ án (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="input-editorial w-full font-bold"
                                value={syllabusData.weights?.final ?? 60}
                                onChange={e => setSyllabusData({
                                    ...syllabusData,
                                    weights: { ...syllabusData.weights, final: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                    <button type="submit" className="px-8 py-3 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors text-lg">
                        Lưu Đề Cương Chi Tiết
                    </button>
                </div>
            </form>
        </div>
    );
};
