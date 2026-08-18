import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    GraduationCap, Award, Building2, Plus, Trash2, Edit2,
    Save, X, ArrowUp, ArrowDown, Check, Sparkles, BookOpen, Clock
} from 'lucide-react';
import { EditorialSelect } from '../../components/common/EditorialWidgets';
import { EditorialUniversitySelect, HCMC_UNIVERSITIES } from '../../components/thpt/EditorialUniversitySelect';
import { EditorialMajorSelect, STANDARD_MAJORS } from '../../components/thpt/EditorialMajorSelect';
import { THPT_COMBINATIONS, OFFICIAL_THPT_SUBJECTS, calculateOfficialComboScore } from './ThptPersonalGoalView';

/**
 * ThptAdmissionView - Chuyên mục Trúng tuyển Đại học, Bảng điểm thi THPT & Danh sách Nguyện vọng
 * Đồng bộ chuẩn ngôn ngữ thiết kế Editorial / Cerulean & Jasper của Pedagogy
 */
export const ThptAdmissionView = ({
    profile,
    onUpdateProfile,
    showToast
}) => {
    // Official Admission & Exam Results State
    const [isEditingAdmission, setIsEditingAdmission] = useState(false);
    const [admissionForm, setAdmissionForm] = useState({
        admittedUniversity: profile?.admittedUniversity || '',
        admittedMajor: profile?.admittedMajor || '',
        admittedCombination: profile?.admittedCombination || profile?.combination || 'A00',
        admittedScore: profile?.admittedScore || '',
        admittedWishNumber: profile?.admittedWishNumber || 'NV1',
        admissionMethod: profile?.admissionMethod || 'Điểm thi THPT Quốc gia',
        officialExamYear: profile?.officialExamYear || new Date().getFullYear().toString(),
        officialExamScores: profile?.officialExamScores || {
            math: '',
            literature: '',
            english: '',
            physics: '',
            chemistry: '',
            biology: '',
            history: '',
            geography: '',
            civicEducation: '',
            informatics: '',
            technology: ''
        }
    });

    // Aspirations (Danh sách nguyện vọng) Modal & Form State
    const [isAspirationModalOpen, setIsAspirationModalOpen] = useState(false);
    const [editingAspirationId, setEditingAspirationId] = useState(null);
    const [aspirationForm, setAspirationForm] = useState({
        order: 1,
        universityCode: '',
        universityName: '',
        majorCode: '',
        majorName: '',
        combination: 'A00',
        benchmarkScore: '',
        status: 'admitted', // 'admitted' | 'passed' | 'failed' | 'pending'
        note: ''
    });

    // Determine initial registered subjects
    const getInitialRegisteredSubjectIds = (prof) => {
        if (prof?.registeredExamSubjects && prof.registeredExamSubjects.length > 0) {
            return prof.registeredExamSubjects;
        }
        const targetSubjs = (prof?.subjectTargets || []).map(st => st.subjectId);
        if (targetSubjs.length > 0) {
            return targetSubjs;
        }
        const combo = THPT_COMBINATIONS.find(c => c.value === (prof?.admittedCombination || prof?.combination));
        if (combo && combo.subjects && combo.subjects.length > 0) {
            return Array.from(new Set(['math', 'literature', ...combo.subjects]));
        }
        return ['math', 'literature', 'english', 'physics', 'chemistry'];
    };

    const [registeredSubjectIds, setRegisteredSubjectIds] = useState(() => getInitialRegisteredSubjectIds(profile));
    const [isCustomizeSubjectsOpen, setIsCustomizeSubjectsOpen] = useState(false);

    // Sync form state when profile changes
    useEffect(() => {
        if (profile) {
            setAdmissionForm({
                admittedUniversity: profile.admittedUniversity || '',
                admittedMajor: profile.admittedMajor || '',
                admittedCombination: profile.admittedCombination || profile.combination || 'A00',
                admittedScore: profile.admittedScore || '',
                admittedWishNumber: profile.admittedWishNumber || 'NV1',
                admissionMethod: profile.admissionMethod || 'Điểm thi THPT Quốc gia',
                officialExamYear: profile.officialExamYear || new Date().getFullYear().toString(),
                officialExamScores: profile.officialExamScores || {
                    math: '',
                    literature: '',
                    english: '',
                    physics: '',
                    chemistry: '',
                    biology: '',
                    history: '',
                    geography: '',
                    civicEducation: '',
                    informatics: '',
                    technology: ''
                }
            });
            setRegisteredSubjectIds(getInitialRegisteredSubjectIds(profile));
        }
    }, [profile]);

    // Toggle registered subject in/out
    const handleToggleRegisteredSubject = (subjId) => {
        const nextList = registeredSubjectIds.includes(subjId)
            ? registeredSubjectIds.filter(id => id !== subjId)
            : [...registeredSubjectIds, subjId];

        if (nextList.length === 0) {
            alert('Vui lòng chọn ít nhất 1 môn thi.');
            return;
        }

        setRegisteredSubjectIds(nextList);
        onUpdateProfile({
            ...profile,
            registeredExamSubjects: nextList
        });
        showToast?.('Đã cập nhật danh sách môn thi đăng ký');
    };

    // Close modals on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isAspirationModalOpen) {
                setIsAspirationModalOpen(false);
            }
        };
        if (isAspirationModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAspirationModalOpen]);

    // Admission Handlers
    const handleSaveAdmissionInfo = (e) => {
        e.preventDefault();
        onUpdateProfile({
            ...profile,
            ...admissionForm
        });
        setIsEditingAdmission(false);
        showToast?.('Đã lưu kết quả trúng tuyển & điểm thi THPT thành công');
    };

    const handleOfficialScoreChange = (subjId, scoreVal) => {
        const numVal = scoreVal === '' ? '' : Math.min(10, Math.max(0, Number(scoreVal)));
        setAdmissionForm(prev => ({
            ...prev,
            officialExamScores: {
                ...prev.officialExamScores,
                [subjId]: numVal
            }
        }));
    };

    // Aspiration Handlers
    const handleOpenAddAspiration = () => {
        const nextOrder = (profile?.aspirations || []).length + 1;
        setEditingAspirationId(null);
        setAspirationForm({
            order: nextOrder,
            universityCode: '',
            universityName: '',
            majorCode: '',
            majorName: '',
            combination: profile?.combination || 'A00',
            benchmarkScore: '',
            status: nextOrder === 1 ? 'admitted' : 'pending',
            note: ''
        });
        setIsAspirationModalOpen(true);
    };

    const handleOpenEditAspiration = (asp) => {
        setEditingAspirationId(asp.id);
        setAspirationForm({
            ...asp
        });
        setIsAspirationModalOpen(true);
    };

    const handleSaveAspiration = (e) => {
        e.preventDefault();
        if (!aspirationForm.universityName.trim() || !aspirationForm.majorName.trim()) {
            alert('Vui lòng nhập tên trường và ngành xét tuyển.');
            return;
        }

        let updatedAspirations;
        const currentList = profile?.aspirations || [];

        if (editingAspirationId) {
            updatedAspirations = currentList.map(a => 
                a.id === editingAspirationId ? { ...a, ...aspirationForm } : a
            );
        } else {
            const newAsp = {
                id: 'asp_' + Date.now(),
                ...aspirationForm,
                createdAt: new Date().toISOString()
            };
            updatedAspirations = [...currentList, newAsp];
        }

        const updatedProfile = {
            ...profile,
            aspirations: updatedAspirations
        };

        if (aspirationForm.status === 'admitted') {
            updatedProfile.admittedUniversity = aspirationForm.universityName;
            updatedProfile.admittedMajor = aspirationForm.majorName;
            updatedProfile.admittedCombination = aspirationForm.combination;
            updatedProfile.admittedScore = aspirationForm.benchmarkScore;
            updatedProfile.admittedWishNumber = `NV${aspirationForm.order}`;
        }

        onUpdateProfile(updatedProfile);
        setIsAspirationModalOpen(false);
        setEditingAspirationId(null);
        showToast?.(editingAspirationId ? 'Đã cập nhật nguyện vọng' : 'Đã thêm nguyện vọng mới');
    };

    const handleDeleteAspiration = (aspId) => {
        if (!window.confirm('Bạn có chắc muốn xóa nguyện vọng này?')) return;
        const currentList = profile?.aspirations || [];
        const filtered = currentList.filter(a => a.id !== aspId);
        const reIndexed = filtered.map((a, idx) => ({ ...a, order: idx + 1 }));
        onUpdateProfile({ ...profile, aspirations: reIndexed });
        showToast?.('Đã xóa nguyện vọng');
    };

    const handleMoveAspiration = (index, direction) => {
        const currentList = [...(profile?.aspirations || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentList.length) return;

        const temp = currentList[index];
        currentList[index] = currentList[targetIndex];
        currentList[targetIndex] = temp;

        const reIndexed = currentList.map((a, idx) => ({ ...a, order: idx + 1 }));
        onUpdateProfile({ ...profile, aspirations: reIndexed });
        showToast?.('Đã cập nhật thứ tự ưu tiên nguyện vọng');
    };

    const handleSetAsAdmitted = (asp) => {
        const currentList = (profile?.aspirations || []).map(a => ({
            ...a,
            status: a.id === asp.id ? 'admitted' : (a.status === 'admitted' ? 'passed' : a.status)
        }));

        onUpdateProfile({
            ...profile,
            aspirations: currentList,
            admittedUniversity: asp.universityName,
            admittedMajor: asp.majorName,
            admittedCombination: asp.combination,
            admittedScore: asp.benchmarkScore,
            admittedWishNumber: `NV${asp.order}`
        });
        showToast?.(`Đã thiết lập ${asp.universityName} là Trường Đại học trúng tuyển`);
    };

    const totalAspirations = (profile?.aspirations || []).length;
    const admittedAspiration = (profile?.aspirations || []).find(a => a.status === 'admitted');

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            {/* Header Banner */}
            <header className="sticky -top-6 md:-top-12 z-20 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean mt-1 flex items-center gap-2">
                        Trúng tuyển & Nguyện vọng
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 font-body">
                        Lưu giữ kết quả trúng tuyển Đại học, bảng điểm thi THPT Quốc gia và toàn bộ danh sách nguyện vọng xét tuyển.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleOpenAddAspiration}
                        className="px-4 py-2 bg-brand-jasper text-white text-xs font-bold font-serif-title shadow-editorial hover:bg-brand-cerulean transition-all flex items-center gap-1.5"
                    >
                        <Plus size={15} /> Thêm nguyện vọng mới
                    </button>
                </div>
            </header>

            {/* SECTION 1: UNIVERSITY ADMISSION HONOR CARD */}
            <div className="bg-white border-2 border-brand-cerulean/30 shadow-editorial relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-cerulean via-brand-jasper to-amber-500"></div>

                <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/15">
                        <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shadow-sm shrink-0">
                                <GraduationCap size={30} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-jasper text-white rounded font-sans uppercase tracking-wider">
                                        Trường Đại học Đã Đậu
                                    </span>
                                    {(profile?.admittedWishNumber || admittedAspiration) && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-serif-title">
                                            {profile?.admittedWishNumber || `NV${admittedAspiration?.order}`}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-serif-title font-bold text-2xl sm:text-3xl text-brand-cerulean mt-1">
                                    {profile?.admittedUniversity || 'Chưa cập nhật Trường Đại học trúng tuyển'}
                                </h3>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsEditingAdmission(!isEditingAdmission)}
                            className="px-4 py-2 bg-brand-cerulean text-white text-xs font-bold font-serif-title shadow-sm hover:bg-brand-jasper transition-all flex items-center gap-1.5 shrink-0"
                        >
                            <Edit2 size={14} /> {isEditingAdmission ? 'Đóng chỉnh sửa' : 'Chỉnh sửa Thông tin Đậu'}
                        </button>
                    </div>

                    {/* Details View */}
                    {!isEditingAdmission ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Ngành trúng tuyển</span>
                                <p className="font-serif-title font-bold text-brand-cerulean text-base">
                                    {profile?.admittedMajor || 'Chưa cập nhật'}
                                </p>
                            </div>
                            <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Khối xét tuyển</span>
                                <p className="font-serif-title font-bold text-brand-jasper text-base">
                                    {profile?.admittedCombination ? `Khối ${profile.admittedCombination}` : (profile?.combination ? `Khối ${profile.combination}` : 'Chưa cập nhật')}
                                </p>
                            </div>
                            <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Điểm chuẩn / Điểm đậu</span>
                                <p className="font-serif-title font-bold text-emerald-700 text-base">
                                    {profile?.admittedScore ? `${profile.admittedScore} điểm` : 'Chưa cập nhật'}
                                </p>
                            </div>
                            <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/15 rounded-xs space-y-1">
                                <span className="text-[11px] font-serif-title font-bold text-gray-500 uppercase tracking-wider block">Phương thức xét tuyển</span>
                                <p className="font-serif-title font-bold text-gray-700 text-xs">
                                    {profile?.admissionMethod || 'Điểm thi THPT Quốc gia'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Admission Edit Form */
                        <form onSubmit={handleSaveAdmissionInfo} className="p-5 bg-brand-cream/60 border border-brand-cerulean/25 rounded-xs space-y-4 animate-fade-in">
                            <h4 className="font-serif-title font-bold text-sm text-brand-cerulean pb-2 border-b border-brand-cerulean/15">
                                Cập nhật Thông tin Trường & Ngành đã trúng tuyển
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <EditorialUniversitySelect
                                        label="Tên trường Đại học đã trúng tuyển (TP.HCM)"
                                        value={admissionForm.admittedUniversity}
                                        onChange={(univName) => setAdmissionForm({ ...admissionForm, admittedUniversity: univName })}
                                        placeholder="Chọn trường Đại học tại TP.HCM..."
                                        required
                                    />
                                </div>

                                <div>
                                    <EditorialMajorSelect
                                        label="Ngành / Chuyên ngành trúng tuyển *"
                                        value={admissionForm.admittedMajor}
                                        onChange={(majorName) => setAdmissionForm({ ...admissionForm, admittedMajor: majorName })}
                                        placeholder="Chọn Ngành xét tuyển..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Khối xét tuyển
                                    </label>
                                    <EditorialSelect
                                        value={admissionForm.admittedCombination}
                                        onChange={val => setAdmissionForm({ ...admissionForm, admittedCombination: val })}
                                        options={THPT_COMBINATIONS.filter(c => c.value)}
                                        size="sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Điểm trúng tuyển
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="30"
                                        value={admissionForm.admittedScore}
                                        onChange={e => setAdmissionForm({ ...admissionForm, admittedScore: e.target.value })}
                                        placeholder="Vd: 28.65"
                                        className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Trúng tuyển theo Nguyện vọng
                                    </label>
                                    <input
                                        type="text"
                                        value={admissionForm.admittedWishNumber}
                                        onChange={e => setAdmissionForm({ ...admissionForm, admittedWishNumber: e.target.value })}
                                        placeholder="Vd: NV1, NV2..."
                                        className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Phương thức xét tuyển
                                    </label>
                                    <input
                                        type="text"
                                        value={admissionForm.admissionMethod}
                                        onChange={e => setAdmissionForm({ ...admissionForm, admissionMethod: e.target.value })}
                                        placeholder="Vd: Điểm thi THPT, ĐGNL..."
                                        className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-brand-cerulean/15">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingAdmission(false)}
                                    className="px-4 py-2 text-xs font-serif-title font-bold text-gray-500 hover:text-brand-ink"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                                >
                                    <Save size={14} /> Lưu kết quả trúng tuyển
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* SECTION 2: OFFICIAL THPT EXAM SCORES GRID (CHỈ HIỂN THỊ CÁC MÔN ĐĂNG KÝ) */}
            <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-brand-cerulean/15 gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-serif-title font-bold text-xl text-brand-cerulean flex items-center gap-2">
                                <Award size={20} className="text-brand-jasper" />
                                Bảng Điểm thi Tốt nghiệp THPT Quốc gia Chính thức
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean rounded font-sans">
                                {OFFICIAL_THPT_SUBJECTS.filter(s => registeredSubjectIds.includes(s.id)).length} môn đăng ký
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-body mt-0.5">
                            Bảng điểm chỉ hiển thị các môn bạn đã đăng ký thi tốt nghiệp. Bạn có thể nhấn nút "Tùy chỉnh môn thi" để thêm/bớt môn.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setIsCustomizeSubjectsOpen(!isCustomizeSubjectsOpen)}
                            className="px-3 py-1.5 bg-brand-cream border border-brand-cerulean/30 hover:border-brand-jasper hover:text-brand-jasper text-xs font-serif-title font-bold text-brand-cerulean rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                            {isCustomizeSubjectsOpen ? '✕ Đóng chọn môn' : '⚙ Tùy chỉnh môn thi'}
                        </button>

                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-serif-title font-bold text-brand-cerulean">Năm thi:</span>
                            <input
                                type="number"
                                value={admissionForm.officialExamYear}
                                onChange={e => setAdmissionForm({ ...admissionForm, officialExamYear: e.target.value })}
                                className="w-20 bg-white border border-brand-cerulean/30 px-2 py-1 text-xs font-bold text-brand-cerulean font-serif-title rounded-xs text-center"
                                placeholder="2025"
                            />
                        </div>
                    </div>
                </div>

                {/* SUBJECT CUSTOMIZATION ACCORDION / TOGGLE PANEL */}
                {isCustomizeSubjectsOpen && (
                    <div className="p-4 bg-brand-cream/60 border border-dashed border-brand-cerulean/30 rounded-xs space-y-3 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider block">
                                Chọn các môn bạn có đăng ký thi THPT Quốc gia:
                            </span>
                            <span className="text-[11px] text-gray-500 italic">
                                (Nhấp vào môn để chọn hoặc bỏ chọn)
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {OFFICIAL_THPT_SUBJECTS.map(subj => {
                                const isSelected = registeredSubjectIds.includes(subj.id);
                                return (
                                    <button
                                        key={subj.id}
                                        type="button"
                                        onClick={() => handleToggleRegisteredSubject(subj.id)}
                                        className={`px-3 py-1.5 rounded-xs text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                                            isSelected
                                                ? 'bg-brand-cerulean text-white shadow-xs ring-1 ring-brand-cerulean'
                                                : 'bg-white text-gray-500 border border-gray-300 hover:border-brand-cerulean hover:text-brand-cerulean'
                                        }`}
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full inline-block"
                                            style={{ backgroundColor: isSelected ? '#FFFFFF' : subj.color }}
                                        />
                                        {subj.name}
                                        {isSelected && <Check size={12} className="stroke-[3]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Subject Score Inputs Grid - ONLY DISPLAYING REGISTERED SUBJECTS */}
                {OFFICIAL_THPT_SUBJECTS.filter(subj => registeredSubjectIds.includes(subj.id)).length === 0 ? (
                    <div className="p-8 bg-brand-cream/30 border border-dashed border-brand-cerulean/20 text-center space-y-2 rounded-xs">
                        <p className="text-xs font-serif-title font-bold text-gray-500">Chưa có môn thi nào được chọn</p>
                        <button
                            type="button"
                            onClick={() => setIsCustomizeSubjectsOpen(true)}
                            className="px-4 py-1.5 bg-brand-cerulean text-white text-xs font-bold font-serif-title rounded-xs"
                        >
                            + Chọn môn thi đã đăng ký
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {OFFICIAL_THPT_SUBJECTS
                            .filter(subj => registeredSubjectIds.includes(subj.id))
                            .map(subj => {
                                const currentScore = admissionForm.officialExamScores?.[subj.id] ?? '';
                                return (
                                    <div
                                        key={subj.id}
                                        className="p-3 bg-brand-cream/40 border border-brand-cerulean/20 rounded-xs space-y-1.5 hover:border-brand-cerulean transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-[10px] font-bold text-white px-2 py-0.5 rounded"
                                                style={{ backgroundColor: subj.color }}
                                            >
                                                {subj.name}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.05"
                                                min="0"
                                                max="10"
                                                value={currentScore}
                                                onChange={e => handleOfficialScoreChange(subj.id, e.target.value)}
                                                placeholder="--.-"
                                                className="w-full text-center bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper font-serif-title font-bold text-base text-brand-cerulean py-1 rounded-xs shadow-xs"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* Computed Combination Scores from Official Input */}
                <div className="p-4 bg-brand-cream border border-brand-cerulean/25 rounded-xs space-y-2">
                    <span className="text-xs font-serif-title font-bold text-brand-cerulean block uppercase tracking-wider">
                        Tổng điểm theo các Khối xét tuyển chính:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                        {['A00', 'A01', 'B00', 'C00', 'D01', 'D07'].map(comboCode => {
                            const total = calculateOfficialComboScore(comboCode, admissionForm.officialExamScores);
                            const isTargetCombo = profile?.combination === comboCode;
                            return (
                                <div
                                    key={comboCode}
                                    className={`px-3 py-1.5 rounded-xs border text-xs flex items-center gap-2 ${
                                        isTargetCombo
                                            ? 'bg-brand-cerulean text-white border-brand-cerulean font-bold shadow-xs'
                                            : 'bg-white text-gray-700 border-brand-cerulean/20 font-serif'
                                    }`}
                                >
                                    <span className="font-serif-title font-bold">Khối {comboCode}:</span>
                                    <span className="font-bold text-sm">
                                        {total !== null ? `${total} đ` : '---'}
                                    </span>
                                    {isTargetCombo && (
                                        <span className="text-[9px] bg-brand-jasper text-white px-1 rounded uppercase font-sans font-bold">
                                            Khối của bạn
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveAdmissionInfo}
                        className="px-5 py-2.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                    >
                        <Save size={14} /> Lưu Bảng Điểm Thi THPT
                    </button>
                </div>
            </div>

            {/* SECTION 3: REGISTERED ASPIRATIONS LIST (DANH SÁCH NGUYỆN VỌNG) */}
            <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-brand-cerulean/15 gap-3">
                    <div>
                        <h3 className="font-serif-title font-bold text-xl text-brand-cerulean flex items-center gap-2">
                            <Building2 size={20} className="text-brand-jasper" />
                            Danh sách Nguyện vọng Đã Đăng ký Thời Điểm Đó ({totalAspirations})
                        </h3>
                        <p className="text-xs text-gray-500 font-body mt-0.5">
                            Lưu giữ toàn bộ thứ tự nguyện vọng xét tuyển (NV1, NV2, NV3...) cùng kết quả trúng tuyển
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenAddAspiration}
                        className="px-4 py-2 bg-brand-jasper text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-cerulean transition-all flex items-center gap-1.5 shrink-0"
                    >
                        <Plus size={15} /> Thêm nguyện vọng mới
                    </button>
                </div>

                {/* Aspirations Cards */}
                {totalAspirations === 0 ? (
                    <div className="p-12 text-center text-gray-400 space-y-3 bg-brand-cream/30 border border-dashed border-brand-cerulean/20 rounded-xs">
                        <Building2 size={36} className="mx-auto text-gray-300" />
                        <p className="font-serif-title text-base text-gray-600 font-bold">Chưa có nguyện vọng nào được ghi nhận</p>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Hãy nhấn nút "Thêm nguyện vọng mới" để lưu danh sách nguyện vọng xét tuyển Đại học thời điểm đó của bạn.
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenAddAspiration}
                            className="mt-2 px-5 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-sm hover:bg-brand-jasper transition-all inline-flex items-center gap-1.5"
                        >
                            <Plus size={14} /> Thêm nguyện vọng đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(profile?.aspirations || []).map((asp, idx) => {
                            const isAdmitted = asp.status === 'admitted';
                            const isPassed = asp.status === 'passed';
                            const isFailed = asp.status === 'failed';

                            return (
                                <div
                                    key={asp.id}
                                    className={`p-4 border rounded-xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                                        isAdmitted
                                            ? 'bg-emerald-50/80 border-emerald-400 shadow-sm ring-1 ring-emerald-300'
                                            : isPassed
                                                ? 'bg-blue-50/60 border-blue-300'
                                                : isFailed
                                                    ? 'bg-gray-50 border-gray-200 opacity-80'
                                                    : 'bg-white border-brand-cerulean/20 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        {/* Wish Order Badge */}
                                        <div className={`w-11 h-11 rounded-full flex flex-col items-center justify-center font-serif-title font-bold text-xs shrink-0 shadow-xs ${
                                            isAdmitted
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-brand-cerulean/15 text-brand-cerulean border border-brand-cerulean/25'
                                        }`}>
                                            <span className="text-[9px] uppercase leading-none">NV</span>
                                            <span className="text-sm leading-none font-bold">{asp.order || idx + 1}</span>
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-serif-title font-bold text-brand-cerulean text-sm sm:text-base truncate">
                                                    {asp.universityName} {asp.universityCode && `(${asp.universityCode})`}
                                                </h4>
                                                {isAdmitted && (
                                                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded font-sans uppercase tracking-wider flex items-center gap-1">
                                                        <Check size={11} /> Đã trúng tuyển
                                                    </span>
                                                )}
                                                {isPassed && (
                                                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded font-sans uppercase">
                                                        Đủ điểm chuẩn
                                                    </span>
                                                )}
                                                {isFailed && (
                                                    <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded font-sans">
                                                        Không đủ điểm
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-600 font-body flex items-center gap-3 flex-wrap">
                                                <span>Ngành: <strong className="text-brand-cerulean">{asp.majorName}</strong> {asp.majorCode && `(Mã: ${asp.majorCode})`}</span>
                                                <span>•</span>
                                                <span>Khối: <strong className="text-brand-jasper">Khối {asp.combination}</strong></span>
                                                {asp.benchmarkScore && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Điểm chuẩn: <strong className="text-emerald-700">{asp.benchmarkScore} đ</strong></span>
                                                    </>
                                                )}
                                            </div>

                                            {asp.note && (
                                                <p className="text-[11px] text-gray-500 italic font-body">
                                                    Ghi chú: {asp.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                        {!isAdmitted && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetAsAdmitted(asp)}
                                                className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors"
                                                title="Chọn nguyện vọng này làm trường trúng tuyển chính thức"
                                            >
                                                Chọn làm trường đỗ
                                            </button>
                                        )}

                                        {/* Re-order buttons */}
                                        <button
                                            type="button"
                                            onClick={() => handleMoveAspiration(idx, 'up')}
                                            disabled={idx === 0}
                                            className="p-1 text-gray-400 hover:text-brand-cerulean disabled:opacity-30 rounded"
                                            title="Tăng thứ tự ưu tiên (Lên trên)"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMoveAspiration(idx, 'down')}
                                            disabled={idx === (profile?.aspirations || []).length - 1}
                                            className="p-1 text-gray-400 hover:text-brand-cerulean disabled:opacity-30 rounded"
                                            title="Giảm thứ tự ưu tiên (Xuống dưới)"
                                        >
                                            <ArrowDown size={14} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditAspiration(asp)}
                                            className="p-1 text-gray-400 hover:text-brand-cerulean rounded"
                                            title="Chỉnh sửa nguyện vọng"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAspiration(asp.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                                            title="Xóa nguyện vọng"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* MODAL: ADD / EDIT ASPIRATION (Portal to document.body) */}
            {isAspirationModalOpen && createPortal(
                <div 
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-brand-cerulean/60 backdrop-blur-sm animate-backdrop-in"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsAspirationModalOpen(false);
                    }}
                >
                    <div 
                        className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-4 sm:p-5 bg-brand-cream border-b border-brand-cerulean/20 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-jasper/10 border border-brand-jasper/25 flex items-center justify-center text-brand-jasper shrink-0">
                                    <Building2 size={22} />
                                </div>
                                <div>
                                    <h3 className="font-serif-title font-bold text-base sm:text-lg text-brand-cerulean leading-tight">
                                        {editingAspirationId ? 'Chỉnh sửa Nguyện vọng' : 'Thêm Nguyện vọng Xét tuyển Mới'}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-body mt-0.5">
                                        Thứ tự ưu tiên: <strong>Nguyện vọng {aspirationForm.order} (NV{aspirationForm.order})</strong>
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAspirationModalOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-brand-jasper rounded-xs hover:bg-brand-cerulean/10 transition-colors"
                                title="Đóng modal (Esc)"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveAspiration} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div className="sm:col-span-1">
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Thứ tự NV *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={aspirationForm.order}
                                        onChange={e => setAspirationForm({ ...aspirationForm, order: Number(e.target.value) || 1 })}
                                        className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-bold text-center py-2 rounded-xs shadow-xs"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <EditorialUniversitySelect
                                        label="Tên trường Đại học (TP.HCM)"
                                        value={aspirationForm.universityName}
                                        onChange={(univName, univCode) => {
                                            setAspirationForm(prev => ({
                                                ...prev,
                                                universityName: univName,
                                                universityCode: univCode || prev.universityCode
                                            }));
                                        }}
                                        placeholder="Chọn trường Đại học tại TP.HCM..."
                                        required
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-1">
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Mã trường
                                    </label>
                                    <input
                                        type="text"
                                        value={aspirationForm.universityCode}
                                        onChange={e => setAspirationForm({ ...aspirationForm, universityCode: e.target.value.toUpperCase() })}
                                        placeholder="Vd: QSB, BKA..."
                                        className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-1.5 uppercase rounded-xs shadow-xs"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <EditorialMajorSelect
                                        label="Tên Ngành xét tuyển *"
                                        value={aspirationForm.majorName}
                                        onChange={(majorName, majorCode) => {
                                            setAspirationForm(prev => ({
                                                ...prev,
                                                majorName: majorName,
                                                majorCode: majorCode || prev.majorCode
                                            }));
                                        }}
                                        placeholder="Chọn Ngành xét tuyển..."
                                        required
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Khối thi
                                    </label>
                                    <EditorialSelect
                                        value={aspirationForm.combination}
                                        onChange={val => setAspirationForm({ ...aspirationForm, combination: val })}
                                        options={THPT_COMBINATIONS.filter(c => c.value)}
                                        size="sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Điểm chuẩn năm đó
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="30"
                                        value={aspirationForm.benchmarkScore}
                                        onChange={e => setAspirationForm({ ...aspirationForm, benchmarkScore: e.target.value })}
                                        placeholder="Vd: 28.05"
                                        className="w-full bg-white border border-brand-cerulean/30 focus:border-brand-jasper text-xs font-body px-3 py-1.5 rounded-xs shadow-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Trạng thái
                                    </label>
                                    <EditorialSelect
                                        value={aspirationForm.status}
                                        onChange={val => setAspirationForm({ ...aspirationForm, status: val })}
                                        options={[
                                            { value: 'admitted', label: 'Đã trúng tuyển (Đã đỗ)' },
                                            { value: 'passed', label: 'Đủ điểm chuẩn' },
                                            { value: 'failed', label: 'Không đủ điểm / Trượt' },
                                            { value: 'pending', label: 'Chưa xét / Đang chờ' }
                                        ]}
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                    Ghi chú thêm
                                </label>
                                <textarea
                                    rows={2}
                                    value={aspirationForm.note}
                                    onChange={e => setAspirationForm({ ...aspirationForm, note: e.target.value })}
                                    placeholder="Chương trình đào tạo, học phí, học bổng..."
                                    className="w-full bg-brand-cream/30 border border-brand-cerulean/25 focus:border-brand-jasper focus:bg-white text-xs font-body p-2.5 rounded-xs resize-none shadow-xs"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 pt-3 border-t border-brand-cerulean/15">
                                <button
                                    type="button"
                                    onClick={() => setIsAspirationModalOpen(false)}
                                    className="px-4 py-2 text-xs font-serif-title font-bold text-gray-500 hover:text-brand-ink"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-editorial hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                                >
                                    <Save size={14} /> {editingAspirationId ? 'Lưu thay đổi' : 'Thêm nguyện vọng'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ThptAdmissionView;
