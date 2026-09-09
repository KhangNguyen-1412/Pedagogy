import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, PlusCircle, Trash2, CheckCircle2, Check, ArrowRight, GraduationCap, Mail, RefreshCw, Sparkles } from 'lucide-react';
import { EditorialSelect } from '../../components/common/EditorialWidgets';
import { getSelectedModules, getProgramStatus } from '../../utils/ruleValidators';
import { generateHcmueLecturerEmail } from '../../utils/seoHelpers';

export const SyllabusView = ({ modules = [], programs = [], activeModuleId, onSelectModule, onUpdateModule, showToast, navigate }) => {
    const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');

    // Danh sách các chương trình đang được học (đang học hoặc đã học)
    const enrolledPrograms = (programs || []).filter(p => getProgramStatus(p) !== 'chua_hoc');

    // Chỉ lấy các học phần đã chọn học:
    // 1. Thuộc CTĐT đang chọn học
    // 2. Nếu là môn tự chọn, phải có isSelected === true (hoặc đang học/đã hoàn thành)
    const selectedModules = getSelectedModules(modules, programs, selectedProgramFilter);

    const [selectedModuleId, setSelectedModuleId] = useState(() => {
        if (activeModuleId && selectedModules.some(m => m.id === activeModuleId)) {
            return activeModuleId;
        }
        return selectedModules[0]?.id || '';
    });

    // Ref lưu giá trị activeModuleId đã đồng bộ, tránh đè lên thao tác người dùng vừa chọn môn khác
    const syncedActiveIdRef = useRef(activeModuleId);

    // Khi prop activeModuleId thay đổi từ ngoài (ví dụ điều hướng từ ModuleDetail/ProgramDetail)
    useEffect(() => {
        if (activeModuleId && activeModuleId !== syncedActiveIdRef.current) {
            syncedActiveIdRef.current = activeModuleId;
            if (selectedModules.some(m => m.id === activeModuleId)) {
                setSelectedModuleId(activeModuleId);
            }
        }
    }, [activeModuleId, selectedModules]);

    // Khi danh sách selectedModules thay đổi (do lọc CTĐT) mà môn hiện tại không còn thuộc danh sách
    useEffect(() => {
        if (selectedModules.length > 0 && !selectedModules.some(m => m.id === selectedModuleId)) {
            const fallbackId = selectedModules[0].id;
            setSelectedModuleId(fallbackId);
            syncedActiveIdRef.current = fallbackId;
            if (onSelectModule) onSelectModule(fallbackId);
        }
    }, [selectedModules, selectedModuleId, onSelectModule]);

    // Hàm chuyển học phần khi người dùng click chọn trên giao diện
    const handleModuleChange = (modId) => {
        if (!modId) return;
        setSelectedModuleId(modId);
        syncedActiveIdRef.current = modId;
        if (onSelectModule) {
            onSelectModule(modId);
        }
    };

    const currentModule = selectedModules.find(m => m.id === selectedModuleId) || selectedModules[0];

    const defaultSyllabus = {
        instructor: '',
        instructorEmail: '',
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
                instructor: currentModule.instructor || currentModule.syllabus?.instructor || '',
                instructorEmail: currentModule.instructorEmail || currentModule.syllabus?.instructorEmail || '',
                description: currentModule.syllabus?.description || '',
                prerequisites: currentModule.syllabus?.prerequisites || '',
                clos: (currentModule.syllabus?.clos && currentModule.syllabus.clos.length > 0) ? currentModule.syllabus.clos : [''],
                schedule: (currentModule.syllabus?.schedule && currentModule.syllabus.schedule.length > 0) ? currentModule.syllabus.schedule : [
                    { week: 1, title: 'Buổi 1: Giới thiệu tổng quan & Đề cương học phần', topics: 'Nắm bắt mục tiêu, phương pháp giảng dạy và hình thức đánh giá.', hours: 3 }
                ],
                weights: currentModule.syllabus?.weights || { attendance: 10, midterm: 30, final: 60 }
            });
        }
    }, [currentModule?.id]);

    // Tự động sinh email HCMUE khi người dùng nhập tên giảng viên
    const handleInstructorChange = (name) => {
        const autoEmail = generateHcmueLecturerEmail(name);
        setSyllabusData(prev => {
            const shouldAutoSync = !prev.instructorEmail || prev.instructorEmail.endsWith('@lecturer.hcmue.edu.vn');
            return {
                ...prev,
                instructor: name,
                instructorEmail: shouldAutoSync ? autoEmail : prev.instructorEmail
            };
        });
    };

    const handleRegenerateHcmueEmail = () => {
        if (syllabusData.instructor) {
            const autoEmail = generateHcmueLecturerEmail(syllabusData.instructor);
            setSyllabusData(prev => ({ ...prev, instructorEmail: autoEmail }));
            if (showToast) showToast('Đã tự động tạo email giảng viên!', 'success');
        }
    };

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
        if (!currentModule) return;
        const trimmedInstructor = (syllabusData.instructor || '').trim();
        const trimmedInstructorEmail = (syllabusData.instructorEmail || '').trim();
        const updatedSyllabus = {
            ...syllabusData,
            instructor: trimmedInstructor,
            instructorEmail: trimmedInstructorEmail
        };
        onUpdateModule({
            ...currentModule,
            instructor: trimmedInstructor,
            instructorEmail: trimmedInstructorEmail,
            syllabus: updatedSyllabus
        });
        if (showToast) {
            showToast(`Đã lưu thành công đề cương chi tiết môn ${currentModule.name}!`, 'success');
        }
    };

    // Trường hợp chưa có học phần nào được chọn
    if (!currentModule || selectedModules.length === 0) {
        return (
            <div className="max-w-4xl mx-auto my-12 bg-white border-editorial p-10 text-center shadow-editorial space-y-6 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-brand-cream border border-brand-jasper/30 rounded-full flex items-center justify-center text-brand-jasper">
                    <BookOpen size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">
                        Chưa có học phần nào được chọn học
                    </h3>
                    <p className="text-gray-600 max-w-lg mx-auto text-sm leading-relaxed">
                        Mục Đề cương chi tiết chỉ hiển thị các học phần thuộc chương trình bạn đang chọn học và các học phần tự chọn đã được đăng ký.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {navigate && (
                        <>
                            <button
                                onClick={() => navigate('programs')}
                                className="px-5 py-2.5 bg-brand-cerulean text-white font-serif-title text-sm hover:bg-brand-jasper transition-colors shadow-sm flex items-center gap-1.5"
                            >
                                Xem Chương trình Đào tạo <ArrowRight size={15} />
                            </button>
                            {enrolledPrograms.length > 0 && (
                                <button
                                    onClick={() => navigate('program_detail', { programId: enrolledPrograms[0].id })}
                                    className="px-5 py-2.5 border border-brand-cerulean text-brand-cerulean font-serif-title text-sm hover:bg-brand-cerulean hover:text-white transition-colors"
                                >
                                    Chọn học phần tự chọn &rarr;
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    const att = Number(syllabusData.weights?.attendance || 0);
    const mid = Number(syllabusData.weights?.midterm || 0);
    const fin = Number(syllabusData.weights?.final || 0);
    const totalWeight = att + mid + fin;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif-title text-brand-cerulean">Quản lý Đề cương chi tiết</h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Hiển thị các học phần đã chọn học ({selectedModules.length} môn). Cấu hình CLOs, khung bài học & trọng số.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    {enrolledPrograms.length > 1 && (
                        <div className="w-full sm:w-60">
                            <EditorialSelect
                                label="Lọc theo CTĐT"
                                value={selectedProgramFilter}
                                onChange={setSelectedProgramFilter}
                                options={[
                                    { label: `Tất cả CTĐT đang học (${enrolledPrograms.length})`, value: 'all' },
                                    ...enrolledPrograms.map(p => ({
                                        label: p.name,
                                        value: p.id
                                    }))
                                ]}
                            />
                        </div>
                    )}
                    <div className="w-full sm:w-80">
                        <EditorialSelect
                            label={`Học phần đã chọn (${selectedModules.length} môn)`}
                            value={selectedModuleId}
                            onChange={handleModuleChange}
                            options={selectedModules.map(m => ({
                                label: `${(m.code || '').toUpperCase()} - ${m.name} (${m.credits} TC)${m.type === 'elective' ? ' [Tự chọn]' : ''}`,
                                value: m.id
                            }))}
                        />
                    </div>
                </div>
            </header>


            <form onSubmit={handleSaveSyllabus} className="bg-white border-editorial p-8 shadow-editorial space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-cerulean/20 pb-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-xs font-bold text-white bg-brand-cerulean px-2.5 py-0.5 rounded font-sans tracking-wide">
                                {(currentModule.code || '').toUpperCase()}
                            </span>
                            {(syllabusData.instructor || currentModule.instructor) && (
                                <span className="text-xs font-serif-title text-brand-cerulean bg-brand-cream px-2.5 py-0.5 rounded border border-brand-cerulean/30 flex items-center gap-1.5 font-semibold">
                                    <GraduationCap size={13} className="text-brand-jasper" />
                                    GV: {syllabusData.instructor || currentModule.instructor}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-serif-title text-brand-cerulean font-bold">
                            {currentModule.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {navigate && (
                            <button
                                type="button"
                                onClick={() => navigate('module_detail', { moduleId: currentModule.id })}
                                className="px-3 py-2 border border-brand-cerulean text-brand-cerulean font-serif-title text-xs hover:bg-brand-cerulean hover:text-white transition-colors"
                            >
                                Xem Học Phần &rarr;
                            </button>
                        )}
                        <button type="submit" className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors">
                            Lưu Đề Cương Chi Tiết
                        </button>
                    </div>
                </div>

                {/* SECTION 1: THÔNG TIN CHUNG & GIẢNG VIÊN */}
                <div className="space-y-5">
                    <h4 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        Thông tin Giảng viên & Mục tiêu học phần
                    </h4>

                    {/* Vị trí nhập tên giảng viên & tự động sinh email HCMUE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-cream/40 p-4 border border-brand-cerulean/20">
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1 flex items-center gap-1.5 font-bold">
                                <GraduationCap size={16} className="text-brand-jasper" />
                                Giảng viên phụ trách
                            </label>
                            <input
                                type="text"
                                className="input-editorial w-full bg-white"
                                value={syllabusData.instructor || ''}
                                onChange={e => handleInstructorChange(e.target.value)}
                                placeholder="Ví dụ: PGS. TS. Nguyễn Văn An, ThS. Trần Thị Kim Chi..."
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-serif-title text-brand-cerulean flex items-center gap-1.5 font-bold">
                                    <Mail size={16} className="text-brand-jasper" />
                                    Email Giảng viên
                                </label>
                                {syllabusData.instructor && (
                                    <button
                                        type="button"
                                        onClick={handleRegenerateHcmueEmail}
                                        className="text-[11px] text-brand-jasper hover:underline font-serif-title flex items-center gap-1 font-bold cursor-pointer"
                                        title="Tính toán lại email theo chuẩn HCMUE"
                                    >
                                        <RefreshCw size={11} /> Tự tạo lại email
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                className="input-editorial w-full bg-white font-mono text-sm"
                                value={syllabusData.instructorEmail || ''}
                                onChange={e => setSyllabusData({ ...syllabusData, instructorEmail: e.target.value })}
                                placeholder="Tự động sinh: [tên][họ lót viết tắt]@lecturer.hcmue.edu.vn"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">Mô tả mục tiêu môn học</label>
                        <textarea
                            rows="3"
                            className="input-editorial w-full resize-none bg-white"
                            value={syllabusData.description || ''}
                            onChange={e => setSyllabusData({ ...syllabusData, description: e.target.value })}
                            placeholder="Nhập mô tả mục tiêu học phần, kiến thức cốt lõi và năng lực đạt được..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1 font-bold">Điều kiện tiên quyết / Ghi chú đề cương</label>
                        <input
                            type="text"
                            className="input-editorial w-full bg-white"
                            value={syllabusData.prerequisites || ''}
                            onChange={e => setSyllabusData({ ...syllabusData, prerequisites: e.target.value })}
                            placeholder="Ví dụ: Đã hoàn thành môn Giải tích 1..."
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
                                <span className="px-2.5 py-1 bg-brand-cerulean text-white text-xs font-serif-title font-bold rounded shadow-sm flex items-center gap-1">
                                    <CheckCircle2 size={13} /> Tổng trọng số: 100%
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
