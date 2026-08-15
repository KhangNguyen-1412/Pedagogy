import React, { useState, useEffect, useMemo } from 'react';
import {
    BookMarked, Award, GraduationCap, School,
    Save, Edit2, CheckCircle2, ChevronRight, Sparkles, Building2,
    Calendar, TrendingUp, HelpCircle, Check, Plus,
    Image as ImageIcon, Upload, Eye, Trash2, X, Maximize2
} from 'lucide-react';
import { EditorialSelect } from './EditorialSelect';
import { OFFICIAL_THPT_SUBJECTS } from './ThptPersonalGoalView';

/**
 * Danh mục Môn học THCS
 */
export const THCS_SUBJECTS = [
    { id: 'math', name: 'Toán học', color: '#124874' },
    { id: 'literature', name: 'Ngữ văn', color: '#124874' },
    { id: 'english', name: 'Tiếng Anh (Ngoại ngữ 1)', color: '#124874' },
    { id: 'physics', name: 'Vật lí', color: '#124874' },
    { id: 'chemistry', name: 'Hóa học', color: '#124874', grades: ['8', '9'] },
    { id: 'biology', name: 'Sinh học', color: '#124874' },
    { id: 'history', name: 'Lịch sử', color: '#124874' },
    { id: 'geography', name: 'Địa lí', color: '#124874' },
    { id: 'civics', name: 'Giáo dục công dân (GDCD)', color: '#124874' },
    { id: 'informatics', name: 'Tin học', color: '#124874' },
    { id: 'technology', name: 'Công nghệ', color: '#124874' },
    { id: 'pe', name: 'Thể dục (Giáo dục thể chất)', color: '#124874', isEvaluation: true },
    { id: 'music', name: 'Âm nhạc', color: '#124874', isEvaluation: true },
    { id: 'art', name: 'Mĩ thuật', color: '#124874', isEvaluation: true },
];

/**
 * Danh mục Môn học Tiểu học chuẩn GDPT
 */
export const PRIMARY_SUBJECTS = [
    { id: 'vietnamese', name: 'Tiếng Việt', color: '#124874', hasScore: true },
    { id: 'math', name: 'Toán', color: '#124874', hasScore: true },
    { id: 'english', name: 'Tiếng Anh', color: '#124874', hasScore: true, grades: ['4', '5'] },
    { id: 'science', name: 'Khoa học (Tự nhiên & Xã hội)', color: '#124874', hasScore: true, isSplit5: true },
    { id: 'history_geography', name: 'Lịch sử & Địa lí', color: '#124874', hasScore: true, grades: ['4', '5'] },
    { id: 'informatics_tech', name: 'Tin học & Công nghệ', color: '#124874', hasScore: true, grades: ['3', '4', '5'] },
    { id: 'ethics', name: 'Đạo đức', color: '#124874', hasScore: true, isSplit5: true },
    { id: 'pe', name: 'Thể dục (Giáo dục thể chất)', color: '#124874', hasScore: true, isSplit5: true },
    { id: 'music', name: 'Âm nhạc', color: '#124874', hasScore: true, isSplit5: true },
    { id: 'art', name: 'Mĩ thuật', color: '#124874', hasScore: true, isSplit5: true },
    { id: 'technique', name: 'Kĩ thuật', color: '#124874', hasScore: true, isSplit5: true, grades: ['4', '5'] },
    { id: 'activities', name: 'Hoạt động trải nghiệm', color: '#124874', hasScore: false, grades: ['4', '5'] }
];

export const EVAL_PASS_FAIL_OPTIONS = [
    { value: 'Đ', label: 'Đạt (Đ)' },
    { value: 'CĐ', label: 'Chưa đạt (CĐ)' },
];

export const TRANSCRIPT_RANK_OPTIONS = [
    { value: 'Học sinh Xuất sắc', label: 'Học sinh Xuất sắc' },
    { value: 'Học sinh Giỏi', label: 'Học sinh Giỏi' },
    { value: 'Học sinh Khá', label: 'Học sinh Khá' },
    { value: 'Học sinh Đạt', label: 'Học sinh Đạt' },
    { value: 'Chưa đạt', label: 'Chưa đạt' },
];

export const TRANSCRIPT_CONDUCT_OPTIONS = [
    { value: 'Tốt', label: 'Tốt' },
    { value: 'Khá', label: 'Khá' },
    { value: 'Đạt', label: 'Đạt' },
    { value: 'Chưa đạt', label: 'Chưa đạt' },
];

export const PRIMARY_EVAL_RESULT_OPTIONS = [
    { value: 'Hoàn thành Xuất sắc', label: 'Hoàn thành Xuất sắc' },
    { value: 'Hoàn thành Tốt', label: 'Hoàn thành Tốt' },
    { value: 'Hoàn thành', label: 'Hoàn thành' },
    { value: 'Chưa hoàn thành', label: 'Chưa hoàn thành' },
];

export const PRIMARY_SUBJECT_STATUS_OPTIONS = [
    { value: 'T', label: 'Tốt (T)' },
    { value: 'H', label: 'Hoàn thành (H)' },
    { value: 'C', label: 'Chưa HT (C)' },
];

/**
 * Component Tải lên & Xem trước Giấy khen từng học kỳ
 */
const CertificateUploadCard = ({
    label,
    iconColor = "text-amber-600",
    titleValue,
    imageValue,
    onTitleChange,
    onImageChange,
    onPreviewImage,
    placeholder = "Nhập tên giấy khen..."
}) => {
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file hình ảnh (PNG, JPG, JPEG, WEBP)');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            onImageChange(event.target.result);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    return (
        <div className="p-3.5 bg-white border border-brand-cerulean/20 rounded-xs space-y-2.5 shadow-xs transition-all hover:border-brand-cerulean/40 flex flex-col justify-between">
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5 text-xs">
                        <Award size={13} className={iconColor} />
                        {label}
                    </span>
                    {imageValue && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-sans flex items-center gap-1">
                            <ImageIcon size={10} /> Đã có ảnh
                        </span>
                    )}
                </div>

                <input
                    type="text"
                    value={titleValue || ''}
                    onChange={e => onTitleChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-brand-cream/40 border border-brand-cerulean/25 px-2.5 py-1.5 text-xs font-body rounded-xs focus:border-brand-jasper focus:bg-white"
                />
            </div>

            {/* Certificate Image Area */}
            {imageValue ? (
                <div className="relative group rounded-xs border border-brand-cerulean/25 overflow-hidden bg-stone-900/5 h-28 flex items-center justify-center">
                    <img 
                        src={imageValue} 
                        alt={titleValue || label} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => onPreviewImage(imageValue, `${label}: ${titleValue || 'Giấy khen'}`)}
                    />
                    <div className="absolute inset-0 bg-brand-cerulean/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <button
                            type="button"
                            onClick={() => onPreviewImage(imageValue, `${label}: ${titleValue || 'Giấy khen'}`)}
                            className="p-1.5 bg-white text-brand-cerulean rounded-xs hover:bg-brand-jasper hover:text-white transition-colors shadow-xs"
                            title="Xem phóng to ảnh"
                        >
                            <Eye size={14} />
                        </button>
                        <label className="p-1.5 bg-white text-brand-cerulean rounded-xs hover:bg-brand-jasper hover:text-white transition-colors cursor-pointer shadow-xs" title="Đổi ảnh khác">
                            <Upload size={14} />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileSelect} 
                                className="hidden" 
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => onImageChange('')}
                            className="p-1.5 bg-white text-rose-600 rounded-xs hover:bg-rose-600 hover:text-white transition-colors shadow-xs"
                            title="Xóa ảnh"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-brand-cerulean/25 rounded-xs hover:border-brand-jasper hover:bg-brand-cream/50 transition-all cursor-pointer group text-center h-28 bg-brand-cream/20">
                    <Upload size={18} className="text-brand-cerulean/60 group-hover:text-brand-jasper transition-colors mb-1" />
                    <span className="text-xs font-serif-title font-bold text-brand-cerulean group-hover:text-brand-jasper transition-colors">
                        Tải ảnh Giấy khen
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans mt-0.5">
                        Click để chọn file ảnh
                    </span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect} 
                        className="hidden" 
                    />
                </label>
            )}
        </div>
    );
};

/**
 * AcademicTranscriptsView - Quản lý Học bạ 3 Cấp (Tiểu học - THCS - THPT)
 * Đầy đủ bảng điểm chi tiết từng môn, từng học kỳ cho tất cả các cấp học
 */
export const AcademicTranscriptsView = ({
    profile,
    onUpdateProfile,
    showToast
}) => {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('pedagogy_transcript_tab');
            if (saved && saved !== 'simulator') return saved;
        }
        return 'high_school';
    }); // 'high_school' | 'secondary' | 'primary'

    const [selectedThptGrade, setSelectedThptGrade] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('pedagogy_transcript_thpt_grade');
            if (saved) return saved;
        }
        return '12';
    }); // '10' | '11' | '12'

    const [selectedThcsGrade, setSelectedThcsGrade] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('pedagogy_transcript_thcs_grade');
            if (saved) return saved;
        }
        return '9';
    }); // '6' | '7' | '8' | '9'

    const [selectedPrimaryGrade, setSelectedPrimaryGrade] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('pedagogy_transcript_primary_grade');
            if (saved) return saved;
        }
        return '5';
    }); // '1' | '2' | '3' | '4' | '5'

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pedagogy_transcript_tab', activeTab);
            sessionStorage.setItem('pedagogy_transcript_thpt_grade', selectedThptGrade);
            sessionStorage.setItem('pedagogy_transcript_thcs_grade', selectedThcsGrade);
            sessionStorage.setItem('pedagogy_transcript_primary_grade', selectedPrimaryGrade);
        }
    }, [activeTab, selectedThptGrade, selectedThcsGrade, selectedPrimaryGrade]);

    // Default structure fallback
    const initialTranscripts = useMemo(() => {
        return {
            highSchool: {
                schoolName: profile?.school || '',
                graduationYear: profile?.officialExamYear || '2026',
                grade10: { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade11: { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade12: { scores: {}, gpa: '', rank: 'Học sinh Xuất sắc', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                ...(profile?.transcripts?.highSchool || {})
            },
            secondarySchool: {
                schoolName: '',
                graduationYear: '',
                grade6: { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade7: { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade8: { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade9: { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                entranceExam10: {
                    schoolAdmitted: profile?.school || '',
                    mathScore: '',
                    literatureScore: '',
                    englishScore: '',
                    specializedScore: '',
                    totalScore: ''
                },
                ...(profile?.transcripts?.secondarySchool || {})
            },
            primarySchool: {
                schoolName: '',
                graduationYear: '',
                grade1: { scores: {}, gpa: '', result: 'Hoàn thành Xuất sắc', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade2: { scores: {}, gpa: '', result: 'Hoàn thành Xuất sắc', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade3: { scores: {}, gpa: '', result: 'Hoàn thành Xuất sắc', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade4: { scores: {}, gpa: '', result: 'Hoàn thành Xuất sắc', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                grade5: { scores: {}, gpa: '', result: 'Hoàn thành Xuất sắc', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' },
                ...(profile?.transcripts?.primarySchool || {})
            }
        };
    }, [profile]);

    const [transcripts, setTranscripts] = useState(initialTranscripts);
    const [isEditingHighSchoolInfo, setIsEditingHighSchoolInfo] = useState(false);
    const [isEditingSecondary, setIsEditingSecondary] = useState(false);
    const [isEditingPrimary, setIsEditingPrimary] = useState(false);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, imageUrl: '', title: '' });

    useEffect(() => {
        setTranscripts(initialTranscripts);
    }, [initialTranscripts]);

    // Save helper
    const handleSaveAll = (updatedTranscripts) => {
        const toSave = updatedTranscripts || transcripts;
        onUpdateProfile({
            ...profile,
            transcripts: toSave
        });
        showToast?.('Đã lưu dữ liệu toàn bộ học bạ 3 cấp thành công');
    };

    // 1. Helper: Update THPT Subject Score (Grades 10, 11, 12)
    const handleUpdateThptScore = (gradeKey, subjId, field, value) => {
        const isEvalSubj = OFFICIAL_THPT_SUBJECTS.find(s => s.id === subjId)?.isEvaluation;
        const processedVal = isEvalSubj
            ? value
            : (value === '' ? '' : Math.min(10, Math.max(0, Number(value))));

        setTranscripts(prev => {
            const currentGrade = prev.highSchool[`grade${gradeKey}`] || { scores: {} };
            const currentSubj = currentGrade.scores?.[subjId] || { hk1: isEvalSubj ? 'Đ' : '', hk2: isEvalSubj ? 'Đ' : '', final: isEvalSubj ? 'Đ' : '' };
            
            const updatedSubj = {
                ...currentSubj,
                [field]: processedVal
            };

            if (!isEvalSubj) {
                if (field === 'hk1' || field === 'hk2') {
                    const hk1Val = field === 'hk1' ? processedVal : currentSubj.hk1;
                    const hk2Val = field === 'hk2' ? processedVal : currentSubj.hk2;
                    if (hk1Val !== '' && hk2Val !== '' && !isNaN(Number(hk1Val)) && !isNaN(Number(hk2Val))) {
                        updatedSubj.final = Number(((Number(hk1Val) + Number(hk2Val) * 2) / 3).toFixed(2));
                    }
                }
            } else {
                if (field === 'hk1' || field === 'hk2') {
                    const hk2Val = field === 'hk2' ? processedVal : currentSubj.hk2;
                    updatedSubj.final = hk2Val || processedVal || 'Đ';
                }
            }

            const updatedScores = {
                ...(currentGrade.scores || {}),
                [subjId]: updatedSubj
            };

            // Exclude evaluation-only subjects from numerical GPA
            const scoredSubjectIds = OFFICIAL_THPT_SUBJECTS.filter(s => !s.isEvaluation).map(s => s.id);
            const finals = Object.entries(updatedScores)
                .filter(([sId]) => scoredSubjectIds.includes(sId))
                .map(([, s]) => s.final)
                .filter(f => f !== '' && f !== undefined && !isNaN(Number(f)));

            let computedGpa = currentGrade.gpa;
            if (finals.length > 0) {
                computedGpa = Number((finals.reduce((a, b) => a + Number(b), 0) / finals.length).toFixed(2));
            }

            return {
                ...prev,
                highSchool: {
                    ...prev.highSchool,
                    [`grade${gradeKey}`]: {
                        ...currentGrade,
                        scores: updatedScores,
                        gpa: computedGpa
                    }
                }
            };
        });
    };

    // 2. Helper: Update THCS Subject Score (Grades 6, 7, 8, 9)
    const handleUpdateThcsScore = (gradeKey, subjId, field, value) => {
        const isEvalSubj = THCS_SUBJECTS.find(s => s.id === subjId)?.isEvaluation;
        const processedVal = isEvalSubj
            ? value
            : (value === '' ? '' : Math.min(10, Math.max(0, Number(value))));

        setTranscripts(prev => {
            const currentGrade = prev.secondarySchool[`grade${gradeKey}`] || { scores: {} };
            const currentSubj = currentGrade.scores?.[subjId] || { hk1: isEvalSubj ? 'Đ' : '', hk2: isEvalSubj ? 'Đ' : '', final: isEvalSubj ? 'Đ' : '' };
            
            const updatedSubj = {
                ...currentSubj,
                [field]: processedVal
            };

            if (!isEvalSubj) {
                if (field === 'hk1' || field === 'hk2') {
                    const hk1Val = field === 'hk1' ? processedVal : currentSubj.hk1;
                    const hk2Val = field === 'hk2' ? processedVal : currentSubj.hk2;
                    if (hk1Val !== '' && hk2Val !== '' && !isNaN(Number(hk1Val)) && !isNaN(Number(hk2Val))) {
                        updatedSubj.final = Number(((Number(hk1Val) + Number(hk2Val) * 2) / 3).toFixed(2));
                    }
                }
            } else {
                if (field === 'hk1' || field === 'hk2') {
                    const hk2Val = field === 'hk2' ? processedVal : currentSubj.hk2;
                    updatedSubj.final = hk2Val || processedVal || 'Đ';
                }
            }

            const updatedScores = {
                ...(currentGrade.scores || {}),
                [subjId]: updatedSubj
            };

            // Exclude evaluation-only subjects and subjects not in this grade from numerical GPA
            const scoredSubjectIds = THCS_SUBJECTS
                .filter(s => (!s.grades || s.grades.includes(String(gradeKey))) && !s.isEvaluation)
                .map(s => s.id);
            const finals = Object.entries(updatedScores)
                .filter(([sId]) => scoredSubjectIds.includes(sId))
                .map(([, s]) => s.final)
                .filter(f => f !== '' && f !== undefined && !isNaN(Number(f)));

            let computedGpa = currentGrade.gpa;
            if (finals.length > 0) {
                computedGpa = Number((finals.reduce((a, b) => a + Number(b), 0) / finals.length).toFixed(2));
            }

            return {
                ...prev,
                secondarySchool: {
                    ...prev.secondarySchool,
                    [`grade${gradeKey}`]: {
                        ...currentGrade,
                        scores: updatedScores,
                        gpa: computedGpa
                    }
                }
            };
        });
    };

    // 3. Helper: Update Primary Subject Score (Grades 1, 2, 3, 4, 5)
    const handleUpdatePrimaryScore = (gradeKey, subjId, field, value) => {
        const subjDef = PRIMARY_SUBJECTS.find(s => s.id === subjId);
        const isSplit5 = subjDef?.isSplit5;
        const maxVal = (field === 'hk1' || field === 'hk2') && isSplit5 ? 5 : 10;

        const numVal = (field === 'hk1' || field === 'hk2' || field === 'final')
            ? (value === '' ? '' : Math.min(maxVal, Math.max(0, Number(value))))
            : value;

        setTranscripts(prev => {
            const currentGrade = prev.primarySchool[`grade${gradeKey}`] || { scores: {} };
            const currentSubj = currentGrade.scores?.[subjId] || { hk1: '', hk2: '', final: '', status: 'Hoàn thành Tốt', comment: '' };
            
            const updatedSubj = {
                ...currentSubj,
                [field]: numVal
            };

            if (field === 'hk1' || field === 'hk2') {
                const hk1Val = field === 'hk1' ? numVal : currentSubj.hk1;
                const hk2Val = field === 'hk2' ? numVal : currentSubj.hk2;
                if (hk1Val !== '' && hk2Val !== '' && !isNaN(Number(hk1Val)) && !isNaN(Number(hk2Val))) {
                    if (isSplit5) {
                        // Chia đều theo 2 học kỳ: HK1 (tối đa 5) + HK2 (tối đa 5) = Cả năm (tối đa 10)
                        updatedSubj.final = Number((Number(hk1Val) + Number(hk2Val)).toFixed(1));
                    } else {
                        // Môn tính điểm chuẩn: trung bình 2 học kỳ
                        updatedSubj.final = Number(((Number(hk1Val) + Number(hk2Val)) / 2).toFixed(1));
                    }
                }
            }

            const updatedScores = {
                ...(currentGrade.scores || {}),
                [subjId]: updatedSubj
            };

            // Compute Primary GPA for core scored subjects available in this grade
            const scoredSubjects = PRIMARY_SUBJECTS.filter(s => s.hasScore && (!s.grades || s.grades.includes(String(gradeKey))));
            const scoredIds = scoredSubjects.map(s => s.id);
            const finals = Object.entries(updatedScores)
                .filter(([sId]) => scoredIds.includes(sId))
                .map(([, s]) => s.final)
                .filter(f => f !== '' && f !== undefined && !isNaN(Number(f)));
            
            let computedGpa = currentGrade.gpa;
            if (finals.length > 0) {
                computedGpa = Number((finals.reduce((a, b) => a + Number(b), 0) / finals.length).toFixed(1));
            }

            return {
                ...prev,
                primarySchool: {
                    ...prev.primarySchool,
                    [`grade${gradeKey}`]: {
                        ...currentGrade,
                        scores: updatedScores,
                        gpa: computedGpa
                    }
                }
            };
        });
    };

    // Active Grade Data for each level
    const currentThptGradeData = transcripts.highSchool[`grade${selectedThptGrade}`] || { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' };
    const currentThcsGradeData = transcripts.secondarySchool[`grade${selectedThcsGrade}`] || { scores: {}, gpa: '', rank: 'Học sinh Giỏi', conduct: 'Tốt', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' };
    const currentPrimaryGradeData = transcripts.primarySchool[`grade${selectedPrimaryGrade}`] || { scores: {}, gpa: '', result: 'Hoàn thành Xuất sắc', awardHk1: '', awardHk1Img: '', awardHk2: '', awardHk2Img: '', awardYear: '', awardYearImg: '', awards: '' };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            {/* Header Banner */}
            <header className="sticky -top-6 md:-top-12 z-20 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean mt-1 flex items-center gap-2">
                        Học bạ 3 Cấp (Tiểu học - THCS - THPT)
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 font-body">
                        Quản lý đầy đủ bảng điểm chi tiết từng môn và danh hiệu khen thưởng của Tiểu học, THCS và THPT.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        type="button"
                        onClick={() => handleSaveAll(transcripts)}
                        className="px-5 py-2 bg-brand-cerulean text-white text-xs font-bold font-serif-title shadow-editorial hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                    >
                        <Save size={15} /> Lưu toàn bộ học bạ
                    </button>
                </div>
            </header>

            {/* QUICK STATS CARDS: 3 EDUCATIONAL LEVELS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* THPT Card */}
                <div 
                    onClick={() => setActiveTab('high_school')}
                    className={`p-5 bg-white border-2 rounded-xs shadow-editorial cursor-pointer transition-all ${
                        activeTab === 'high_school' ? 'border-brand-cerulean ring-2 ring-brand-cerulean/15' : 'border-brand-cerulean/20 hover:border-brand-cerulean/50'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">Cấp 3 • THPT</span>
                        <GraduationCap size={20} className="text-brand-jasper" />
                    </div>
                    <h4 className="font-serif-title font-bold text-lg text-brand-cerulean mt-2 truncate">
                        {transcripts.highSchool.schoolName || 'Chưa nhập trường THPT'}
                    </h4>
                    <div className="mt-3 flex items-center justify-between text-xs font-body text-gray-600 pt-2 border-t border-brand-cerulean/10">
                        <span>ĐTB Lớp 12: <strong className="text-brand-jasper">{transcripts.highSchool.grade12?.gpa || '--'}</strong></span>
                        <span>ĐTB 3 Năm: <strong className="text-brand-cerulean">{
                            [transcripts.highSchool.grade10?.gpa, transcripts.highSchool.grade11?.gpa, transcripts.highSchool.grade12?.gpa]
                                .filter(Boolean)
                                .reduce((a, b, _, arr) => a + Number(b) / arr.length, 0)
                                .toFixed(2) || '--'
                        }</strong></span>
                    </div>
                </div>

                {/* THCS Card */}
                <div 
                    onClick={() => setActiveTab('secondary')}
                    className={`p-5 bg-white border-2 rounded-xs shadow-editorial cursor-pointer transition-all ${
                        activeTab === 'secondary' ? 'border-brand-cerulean ring-2 ring-brand-cerulean/15' : 'border-brand-cerulean/20 hover:border-brand-cerulean/50'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">Cấp 2 • THCS</span>
                        <School size={20} className="text-emerald-700" />
                    </div>
                    <h4 className="font-serif-title font-bold text-lg text-brand-cerulean mt-2 truncate">
                        {transcripts.secondarySchool.schoolName || 'Chưa nhập trường THCS'}
                    </h4>
                    <div className="mt-3 flex items-center justify-between text-xs font-body text-gray-600 pt-2 border-t border-brand-cerulean/10">
                        <span>Đỗ Tuyển sinh 10: <strong className="text-emerald-700">{transcripts.secondarySchool.entranceExam10?.schoolAdmitted || 'Chưa cập nhật'}</strong></span>
                        <span>ĐTB Lớp 9: <strong className="text-brand-cerulean">{transcripts.secondarySchool.grade9?.gpa || '--'}</strong></span>
                    </div>
                </div>

                {/* Primary Card */}
                <div 
                    onClick={() => setActiveTab('primary')}
                    className={`p-5 bg-white border-2 rounded-xs shadow-editorial cursor-pointer transition-all ${
                        activeTab === 'primary' ? 'border-brand-cerulean ring-2 ring-brand-cerulean/15' : 'border-brand-cerulean/20 hover:border-brand-cerulean/50'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">Cấp 1 • Tiểu học</span>
                        <Award size={20} className="text-amber-600" />
                    </div>
                    <h4 className="font-serif-title font-bold text-lg text-brand-cerulean mt-2 truncate">
                        {transcripts.primarySchool.schoolName || 'Chưa nhập trường Tiểu học'}
                    </h4>
                    <div className="mt-3 flex items-center justify-between text-xs font-body text-gray-600 pt-2 border-t border-brand-cerulean/10">
                        <span>ĐTB Lớp 5: <strong className="text-brand-cerulean">{transcripts.primarySchool.grade5?.gpa || '--'} đ</strong></span>
                        <span className="text-amber-800 font-bold">5 Năm Hoàn thành Xuất sắc</span>
                    </div>
                </div>
            </div>

            {/* TAB 1: CẤP 3 - THPT */}
            {activeTab === 'high_school' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/15">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-cerulean text-white rounded font-sans uppercase">
                                        Trường THPT
                                    </span>
                                    <span className="text-xs font-serif text-gray-500">Khóa tốt nghiệp: {transcripts.highSchool.graduationYear || '2026'}</span>
                                </div>
                                <h3 className="font-serif-title font-bold text-2xl text-brand-cerulean mt-1">
                                    {transcripts.highSchool.schoolName || 'Chưa cập nhật tên trường THPT'}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsEditingHighSchoolInfo(!isEditingHighSchoolInfo)}
                                className="px-4 py-2 bg-brand-cream border border-brand-cerulean/30 hover:border-brand-jasper hover:text-brand-jasper text-xs font-bold font-serif-title text-brand-cerulean rounded-xs transition-colors flex items-center gap-1.5"
                            >
                                <Edit2 size={13} /> {isEditingHighSchoolInfo ? 'Đóng form' : 'Sửa thông tin trường THPT'}
                            </button>
                        </div>

                        {/* Edit THPT Info Form */}
                        {isEditingHighSchoolInfo && (
                            <div className="p-4 bg-brand-cream/60 border border-brand-cerulean/20 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Tên trường THPT
                                    </label>
                                    <input
                                        type="text"
                                        value={transcripts.highSchool.schoolName}
                                        onChange={e => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: { ...prev.highSchool, schoolName: e.target.value }
                                        }))}
                                        placeholder="Vd: THPT Chuyên Lê Hồng Phong TP.HCM"
                                        className="w-full bg-white border border-brand-cerulean/30 px-3 py-1.5 text-xs font-body rounded-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Năm tốt nghiệp THPT
                                    </label>
                                    <input
                                        type="text"
                                        value={transcripts.highSchool.graduationYear}
                                        onChange={e => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: { ...prev.highSchool, graduationYear: e.target.value }
                                        }))}
                                        placeholder="Vd: 2026"
                                        className="w-full bg-white border border-brand-cerulean/30 px-3 py-1.5 text-xs font-body rounded-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Grade Switcher Tabs (Lớp 10, Lớp 11, Lớp 12) */}
                        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-serif-title font-bold text-brand-cerulean">Chọn khối lớp:</span>
                                {['10', '11', '12'].map(gr => (
                                    <button
                                        key={gr}
                                        type="button"
                                        onClick={() => setSelectedThptGrade(gr)}
                                        className={`px-4 py-1.5 text-xs font-serif-title font-bold rounded-xs transition-all ${
                                            selectedThptGrade === gr
                                                ? 'bg-brand-cerulean text-white shadow-xs'
                                                : 'bg-brand-cream border border-brand-cerulean/25 text-brand-cerulean hover:bg-brand-cerulean/10'
                                        }`}
                                    >
                                        Lớp {gr}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 text-xs flex-wrap">
                                <span>ĐTB Năm Lớp {selectedThptGrade}: <strong className="text-brand-jasper text-sm">{currentThptGradeData.gpa || '--'} đ</strong></span>
                                <span>•</span>
                                <span>Xếp loại: <strong className="text-brand-cerulean">{currentThptGradeData.rank || 'Học sinh Giỏi'}</strong></span>
                                {(currentThptGradeData.awardHk1 || currentThptGradeData.awardHk2 || currentThptGradeData.awardYear || currentThptGradeData.awards || currentThptGradeData.awardHk1Img || currentThptGradeData.awardHk2Img || currentThptGradeData.awardYearImg) && (
                                    <>
                                        <span>•</span>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {(currentThptGradeData.awardHk1 || currentThptGradeData.awardHk1Img) && (
                                                <span 
                                                    onClick={() => currentThptGradeData.awardHk1Img && setPreviewModal({ isOpen: true, imageUrl: currentThptGradeData.awardHk1Img, title: `Giấy khen HK1 Lớp ${selectedThptGrade}: ${currentThptGradeData.awardHk1 || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/60 px-2 py-0.5 rounded-xs text-[11px] font-medium ${
                                                        currentThptGradeData.awardHk1Img ? 'cursor-pointer hover:bg-amber-100 hover:border-amber-400' : ''
                                                    }`} 
                                                    title={currentThptGradeData.awardHk1Img ? 'Click để xem ảnh Giấy khen' : 'Giấy khen HK1'}
                                                >
                                                    <Award size={11} className="text-amber-600" /> HK1: {currentThptGradeData.awardHk1 || 'Đã đính kèm ảnh'}
                                                    {currentThptGradeData.awardHk1Img && <ImageIcon size={11} className="text-amber-700 ml-0.5" />}
                                                </span>
                                            )}
                                            {(currentThptGradeData.awardHk2 || currentThptGradeData.awardHk2Img) && (
                                                <span 
                                                    onClick={() => currentThptGradeData.awardHk2Img && setPreviewModal({ isOpen: true, imageUrl: currentThptGradeData.awardHk2Img, title: `Giấy khen HK2 Lớp ${selectedThptGrade}: ${currentThptGradeData.awardHk2 || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/60 px-2 py-0.5 rounded-xs text-[11px] font-medium ${
                                                        currentThptGradeData.awardHk2Img ? 'cursor-pointer hover:bg-amber-100 hover:border-amber-400' : ''
                                                    }`} 
                                                    title={currentThptGradeData.awardHk2Img ? 'Click để xem ảnh Giấy khen' : 'Giấy khen HK2'}
                                                >
                                                    <Award size={11} className="text-amber-600" /> HK2: {currentThptGradeData.awardHk2 || 'Đã đính kèm ảnh'}
                                                    {currentThptGradeData.awardHk2Img && <ImageIcon size={11} className="text-amber-700 ml-0.5" />}
                                                </span>
                                            )}
                                            {(currentThptGradeData.awardYear || currentThptGradeData.awards || currentThptGradeData.awardYearImg) && (
                                                <span 
                                                    onClick={() => currentThptGradeData.awardYearImg && setPreviewModal({ isOpen: true, imageUrl: currentThptGradeData.awardYearImg, title: `Giấy khen Cả năm Lớp ${selectedThptGrade}: ${currentThptGradeData.awardYear || currentThptGradeData.awards || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-brand-jasper/10 text-brand-jasper border border-brand-jasper/30 px-2 py-0.5 rounded-xs text-[11px] font-bold ${
                                                        currentThptGradeData.awardYearImg ? 'cursor-pointer hover:bg-brand-jasper/20 hover:border-brand-jasper/50' : ''
                                                    }`} 
                                                    title={currentThptGradeData.awardYearImg ? 'Click để xem ảnh Giấy khen' : 'Giấy khen Cả năm'}
                                                >
                                                    <Award size={11} className="text-brand-jasper" /> Cả năm: {currentThptGradeData.awardYear || currentThptGradeData.awards || 'Đã đính kèm ảnh'}
                                                    {currentThptGradeData.awardYearImg && <ImageIcon size={11} className="text-brand-jasper ml-0.5" />}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Interactive Subject Scores Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-cream border-y border-brand-cerulean/20 text-brand-cerulean font-serif-title text-xs">
                                        <th className="py-2.5 px-3 font-bold">Môn học</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28">Học kỳ 1 (HK1)</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28">Học kỳ 2 (HK2)</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28 bg-brand-cerulean/5">Cả năm</th>
                                        <th className="py-2.5 px-3 font-bold text-center">Đánh giá</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-cerulean/10 text-xs font-body">
                                    {OFFICIAL_THPT_SUBJECTS.map(subj => {
                                        const isEval = subj.isEvaluation;
                                        const subjScore = currentThptGradeData.scores?.[subj.id] || { hk1: isEval ? 'Đ' : '', hk2: isEval ? 'Đ' : '', final: isEval ? 'Đ' : '' };

                                        if (isEval) {
                                            const finalEval = subjScore.final || subjScore.hk2 || subjScore.hk1 || 'Đ';
                                            const isPass = finalEval === 'Đ';
                                            return (
                                                <tr key={subj.id} className="hover:bg-brand-cream/30 transition-colors">
                                                    <td className="py-2.5 px-3 font-serif font-bold text-brand-cerulean flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subj.color }} />
                                                        {subj.name}
                                                        <span className="text-[10px] text-gray-500 font-sans font-normal italic">(Đánh giá Đ/CĐ)</span>
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <EditorialSelect
                                                            value={subjScore.hk1 || 'Đ'}
                                                            onChange={val => handleUpdateThptScore(selectedThptGrade, subj.id, 'hk1', val)}
                                                            options={EVAL_PASS_FAIL_OPTIONS}
                                                            size="sm"
                                                            className="w-24 mx-auto"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <EditorialSelect
                                                            value={subjScore.hk2 || 'Đ'}
                                                            onChange={val => handleUpdateThptScore(selectedThptGrade, subj.id, 'hk2', val)}
                                                            options={EVAL_PASS_FAIL_OPTIONS}
                                                            size="sm"
                                                            className="w-24 mx-auto"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-center bg-brand-cerulean/5">
                                                        <EditorialSelect
                                                            value={finalEval}
                                                            onChange={val => handleUpdateThptScore(selectedThptGrade, subj.id, 'final', val)}
                                                            options={EVAL_PASS_FAIL_OPTIONS}
                                                            size="sm"
                                                            className="w-24 mx-auto font-bold"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                                                            isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                        }`}>
                                                            {isPass ? 'Đạt' : 'Chưa đạt'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return (
                                            <tr key={subj.id} className="hover:bg-brand-cream/30 transition-colors">
                                                <td className="py-2.5 px-3 font-serif font-bold text-brand-cerulean flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subj.color }} />
                                                    {subj.name}
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={subjScore.hk1 ?? ''}
                                                        onChange={e => handleUpdateThptScore(selectedThptGrade, subj.id, 'hk1', e.target.value)}
                                                        placeholder="--.-"
                                                        className="w-16 text-center bg-white border border-brand-cerulean/25 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper font-bold text-xs py-1 rounded-xs shadow-xs"
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={subjScore.hk2 ?? ''}
                                                        onChange={e => handleUpdateThptScore(selectedThptGrade, subj.id, 'hk2', e.target.value)}
                                                        placeholder="--.-"
                                                        className="w-16 text-center bg-white border border-brand-cerulean/25 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper font-bold text-xs py-1 rounded-xs shadow-xs"
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-center bg-brand-cerulean/5">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={subjScore.final ?? ''}
                                                        onChange={e => handleUpdateThptScore(selectedThptGrade, subj.id, 'final', e.target.value)}
                                                        placeholder="--.-"
                                                        className="w-16 text-center bg-white border-2 border-brand-cerulean/40 focus:border-brand-jasper font-bold text-xs py-1 text-brand-jasper rounded-xs shadow-xs"
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-gray-500 italic text-[11px] text-center">
                                                    {subjScore.final >= 9.0 ? 'Xuất sắc' : subjScore.final >= 8.0 ? 'Giỏi' : subjScore.final >= 6.5 ? 'Khá' : subjScore.final !== '' ? 'Đạt' : '--'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Grade Settings & Semester Awards */}
                        <div className="p-5 bg-brand-cream border border-brand-cerulean/20 rounded-xs space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <EditorialSelect
                                    label="Xếp loại Học lực:"
                                    value={currentThptGradeData.rank || 'Học sinh Giỏi'}
                                    onChange={val => setTranscripts(prev => ({
                                         ...prev,
                                         highSchool: {
                                             ...prev.highSchool,
                                             [`grade${selectedThptGrade}`]: { ...currentThptGradeData, rank: val }
                                         }
                                    }))}
                                    options={TRANSCRIPT_RANK_OPTIONS}
                                    size="sm"
                                />
                                <EditorialSelect
                                    label="Hạnh kiểm / Rèn luyện:"
                                    value={currentThptGradeData.conduct || 'Tốt'}
                                    onChange={val => setTranscripts(prev => ({
                                         ...prev,
                                         highSchool: {
                                             ...prev.highSchool,
                                             [`grade${selectedThptGrade}`]: { ...currentThptGradeData, conduct: val }
                                         }
                                    }))}
                                    options={TRANSCRIPT_CONDUCT_OPTIONS}
                                    size="sm"
                                />
                            </div>

                            {/* Semester Awards (Giấy khen từng học kỳ có upload hình) */}
                            <div className="pt-3 border-t border-brand-cerulean/15 space-y-2.5">
                                <div className="flex items-center gap-1.5">
                                    <Award size={15} className="text-brand-jasper" />
                                    <span className="font-serif-title font-bold text-xs text-brand-cerulean uppercase tracking-wider">
                                        Giấy khen & Danh hiệu Khen thưởng Lớp {selectedThptGrade} (Từng học kỳ):
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <CertificateUploadCard
                                        label="Giấy khen Học kỳ 1 (HK1)"
                                        iconColor="text-amber-600"
                                        titleValue={currentThptGradeData.awardHk1}
                                        imageValue={currentThptGradeData.awardHk1Img}
                                        placeholder="Vd: Giấy khen Học sinh Giỏi HK1..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: {
                                                ...prev.highSchool,
                                                [`grade${selectedThptGrade}`]: { ...currentThptGradeData, awardHk1: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: {
                                                ...prev.highSchool,
                                                [`grade${selectedThptGrade}`]: { ...currentThptGradeData, awardHk1Img: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />

                                    <CertificateUploadCard
                                        label="Giấy khen Học kỳ 2 (HK2)"
                                        iconColor="text-amber-600"
                                        titleValue={currentThptGradeData.awardHk2}
                                        imageValue={currentThptGradeData.awardHk2Img}
                                        placeholder="Vd: Giấy khen Học sinh Giỏi HK2..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: {
                                                ...prev.highSchool,
                                                [`grade${selectedThptGrade}`]: { ...currentThptGradeData, awardHk2: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: {
                                                ...prev.highSchool,
                                                [`grade${selectedThptGrade}`]: { ...currentThptGradeData, awardHk2Img: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />

                                    <CertificateUploadCard
                                        label="Giấy khen Cả năm"
                                        iconColor="text-brand-jasper"
                                        titleValue={currentThptGradeData.awardYear || currentThptGradeData.awards}
                                        imageValue={currentThptGradeData.awardYearImg}
                                        placeholder="Vd: Học sinh Xuất sắc cả năm..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: {
                                                ...prev.highSchool,
                                                [`grade${selectedThptGrade}`]: { ...currentThptGradeData, awardYear: val, awards: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            highSchool: {
                                                ...prev.highSchool,
                                                [`grade${selectedThptGrade}`]: { ...currentThptGradeData, awardYearImg: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-brand-cerulean/15">
                                <button
                                    type="button"
                                    onClick={() => handleSaveAll(transcripts)}
                                    className="px-5 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-xs hover:bg-brand-jasper transition-all flex items-center gap-1.5"
                                >
                                    <Save size={14} /> Lưu điểm Lớp {selectedThptGrade}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: CẤP 2 - THCS */}
            {activeTab === 'secondary' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Secondary School General Info */}
                    <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/15">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-700 text-white rounded font-sans uppercase">
                                        Trường THCS
                                    </span>
                                    <span className="text-xs font-serif text-gray-500">Khóa tốt nghiệp: {transcripts.secondarySchool.graduationYear || '2023'}</span>
                                </div>
                                <h3 className="font-serif-title font-bold text-2xl text-brand-cerulean mt-1">
                                    {transcripts.secondarySchool.schoolName || 'Chưa cập nhật tên trường THCS'}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsEditingSecondary(!isEditingSecondary)}
                                className="px-4 py-2 bg-brand-cream border border-brand-cerulean/30 hover:border-brand-jasper hover:text-brand-jasper text-xs font-bold font-serif-title text-brand-cerulean rounded-xs transition-colors flex items-center gap-1.5"
                            >
                                <Edit2 size={13} /> {isEditingSecondary ? 'Đóng form' : 'Sửa thông tin THCS'}
                            </button>
                        </div>

                        {/* Edit Secondary School Form */}
                        {isEditingSecondary && (
                            <div className="p-4 bg-brand-cream/60 border border-brand-cerulean/20 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Tên trường THCS
                                    </label>
                                    <input
                                        type="text"
                                        value={transcripts.secondarySchool.schoolName}
                                        onChange={e => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: { ...prev.secondarySchool, schoolName: e.target.value }
                                        }))}
                                        placeholder="Vd: THCS Nguyễn Du - Quận 1"
                                        className="w-full bg-white border border-brand-cerulean/30 px-3 py-1.5 text-xs font-body rounded-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Năm tốt nghiệp THCS
                                    </label>
                                    <input
                                        type="text"
                                        value={transcripts.secondarySchool.graduationYear}
                                        onChange={e => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: { ...prev.secondarySchool, graduationYear: e.target.value }
                                        }))}
                                        placeholder="Vd: 2023"
                                        className="w-full bg-white border border-brand-cerulean/30 px-3 py-1.5 text-xs font-body rounded-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Grade Switcher Tabs for THCS (Lớp 6, 7, 8, 9) */}
                        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-serif-title font-bold text-brand-cerulean">Chọn khối lớp THCS:</span>
                                {['6', '7', '8', '9'].map(gr => (
                                    <button
                                        key={gr}
                                        type="button"
                                        onClick={() => setSelectedThcsGrade(gr)}
                                        className={`px-4 py-1.5 text-xs font-serif-title font-bold rounded-xs transition-all ${
                                            selectedThcsGrade === gr
                                                ? 'bg-emerald-700 text-white shadow-xs'
                                                : 'bg-brand-cream border border-brand-cerulean/25 text-brand-cerulean hover:bg-brand-cerulean/10'
                                        }`}
                                    >
                                        Lớp {gr}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 text-xs flex-wrap">
                                <span>ĐTB Năm Lớp {selectedThcsGrade}: <strong className="text-emerald-700 text-sm">{currentThcsGradeData.gpa || '--'} đ</strong></span>
                                <span>•</span>
                                <span>Xếp loại: <strong className="text-brand-cerulean">{currentThcsGradeData.rank || 'Học sinh Giỏi'}</strong></span>
                                {(currentThcsGradeData.awardHk1 || currentThcsGradeData.awardHk2 || currentThcsGradeData.awardYear || currentThcsGradeData.awards || currentThcsGradeData.awardHk1Img || currentThcsGradeData.awardHk2Img || currentThcsGradeData.awardYearImg) && (
                                    <>
                                        <span>•</span>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {(currentThcsGradeData.awardHk1 || currentThcsGradeData.awardHk1Img) && (
                                                <span 
                                                    onClick={() => currentThcsGradeData.awardHk1Img && setPreviewModal({ isOpen: true, imageUrl: currentThcsGradeData.awardHk1Img, title: `Giấy khen HK1 Lớp ${selectedThcsGrade}: ${currentThcsGradeData.awardHk1 || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/60 px-2 py-0.5 rounded-xs text-[11px] font-medium ${
                                                        currentThcsGradeData.awardHk1Img ? 'cursor-pointer hover:bg-amber-100 hover:border-amber-400' : ''
                                                    }`} 
                                                    title={currentThcsGradeData.awardHk1Img ? 'Click để xem ảnh Giấy khen' : 'Giấy khen HK1'}
                                                >
                                                    <Award size={11} className="text-amber-600" /> HK1: {currentThcsGradeData.awardHk1 || 'Đã đính kèm ảnh'}
                                                    {currentThcsGradeData.awardHk1Img && <ImageIcon size={11} className="text-amber-700 ml-0.5" />}
                                                </span>
                                            )}
                                            {(currentThcsGradeData.awardHk2 || currentThcsGradeData.awardHk2Img) && (
                                                <span 
                                                    onClick={() => currentThcsGradeData.awardHk2Img && setPreviewModal({ isOpen: true, imageUrl: currentThcsGradeData.awardHk2Img, title: `Giấy khen HK2 Lớp ${selectedThcsGrade}: ${currentThcsGradeData.awardHk2 || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/60 px-2 py-0.5 rounded-xs text-[11px] font-medium ${
                                                        currentThcsGradeData.awardHk2Img ? 'cursor-pointer hover:bg-amber-100 hover:border-amber-400' : ''
                                                    }`} 
                                                    title={currentThcsGradeData.awardHk2Img ? 'Click để xem ảnh Giấy khen' : 'Giấy khen HK2'}
                                                >
                                                    <Award size={11} className="text-amber-600" /> HK2: {currentThcsGradeData.awardHk2 || 'Đã đính kèm ảnh'}
                                                    {currentThcsGradeData.awardHk2Img && <ImageIcon size={11} className="text-amber-700 ml-0.5" />}
                                                </span>
                                            )}
                                            {(currentThcsGradeData.awardYear || currentThcsGradeData.awards || currentThcsGradeData.awardYearImg) && (
                                                <span 
                                                    onClick={() => currentThcsGradeData.awardYearImg && setPreviewModal({ isOpen: true, imageUrl: currentThcsGradeData.awardYearImg, title: `Giấy khen Cả năm Lớp ${selectedThcsGrade}: ${currentThcsGradeData.awardYear || currentThcsGradeData.awards || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-xs text-[11px] font-bold ${
                                                        currentThcsGradeData.awardYearImg ? 'cursor-pointer hover:bg-emerald-200 hover:border-emerald-400' : ''
                                                    }`} 
                                                    title={currentThcsGradeData.awardYearImg ? 'Click để xem ảnh Giấy khen' : 'Giấy khen Cả năm'}
                                                >
                                                    <Award size={11} className="text-emerald-700" /> Cả năm: {currentThcsGradeData.awardYear || currentThcsGradeData.awards || 'Đã đính kèm ảnh'}
                                                    {currentThcsGradeData.awardYearImg && <ImageIcon size={11} className="text-emerald-800 ml-0.5" />}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* THCS DETAILED SUBJECT SCORES TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-cream border-y border-brand-cerulean/20 text-brand-cerulean font-serif-title text-xs">
                                        <th className="py-2.5 px-3 font-bold">Môn học THCS</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28">Học kỳ 1 (HK1)</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28">Học kỳ 2 (HK2)</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28 bg-emerald-50">Cả năm</th>
                                        <th className="py-2.5 px-3 font-bold text-center">Đánh giá</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-cerulean/10 text-xs font-body">
                                    {THCS_SUBJECTS.filter(subj => !subj.grades || subj.grades.includes(String(selectedThcsGrade))).map(subj => {
                                        const isEval = subj.isEvaluation;
                                        const subjScore = currentThcsGradeData.scores?.[subj.id] || { hk1: isEval ? 'Đ' : '', hk2: isEval ? 'Đ' : '', final: isEval ? 'Đ' : '' };

                                        if (isEval) {
                                            const finalEval = subjScore.final || subjScore.hk2 || subjScore.hk1 || 'Đ';
                                            const isPass = finalEval === 'Đ';
                                            return (
                                                <tr key={subj.id} className="hover:bg-brand-cream/30 transition-colors">
                                                    <td className="py-2.5 px-3 font-serif font-bold text-brand-cerulean flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subj.color }} />
                                                        {subj.name}
                                                        <span className="text-[10px] text-gray-500 font-sans font-normal italic">(Đánh giá Đ/CĐ)</span>
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <EditorialSelect
                                                            value={subjScore.hk1 || 'Đ'}
                                                            onChange={val => handleUpdateThcsScore(selectedThcsGrade, subj.id, 'hk1', val)}
                                                            options={EVAL_PASS_FAIL_OPTIONS}
                                                            size="sm"
                                                            className="w-24 mx-auto"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <EditorialSelect
                                                            value={subjScore.hk2 || 'Đ'}
                                                            onChange={val => handleUpdateThcsScore(selectedThcsGrade, subj.id, 'hk2', val)}
                                                            options={EVAL_PASS_FAIL_OPTIONS}
                                                            size="sm"
                                                            className="w-24 mx-auto"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-center bg-emerald-50">
                                                        <EditorialSelect
                                                            value={finalEval}
                                                            onChange={val => handleUpdateThcsScore(selectedThcsGrade, subj.id, 'final', val)}
                                                            options={EVAL_PASS_FAIL_OPTIONS}
                                                            size="sm"
                                                            className="w-24 mx-auto font-bold"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                                                            isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                        }`}>
                                                            {isPass ? 'Đạt' : 'Chưa đạt'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return (
                                            <tr key={subj.id} className="hover:bg-brand-cream/30 transition-colors">
                                                <td className="py-2.5 px-3 font-serif font-bold text-brand-cerulean flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subj.color }} />
                                                    {subj.name}
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={subjScore.hk1 ?? ''}
                                                        onChange={e => handleUpdateThcsScore(selectedThcsGrade, subj.id, 'hk1', e.target.value)}
                                                        placeholder="--.-"
                                                        className="w-16 text-center bg-white border border-brand-cerulean/25 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold text-xs py-1 rounded-xs shadow-xs"
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={subjScore.hk2 ?? ''}
                                                        onChange={e => handleUpdateThcsScore(selectedThcsGrade, subj.id, 'hk2', e.target.value)}
                                                        placeholder="--.-"
                                                        className="w-16 text-center bg-white border border-brand-cerulean/25 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold text-xs py-1 rounded-xs shadow-xs"
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-center bg-emerald-50">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={subjScore.final ?? ''}
                                                        onChange={e => handleUpdateThcsScore(selectedThcsGrade, subj.id, 'final', e.target.value)}
                                                        placeholder="--.-"
                                                        className="w-16 text-center bg-white border-2 border-emerald-600/50 focus:border-emerald-700 font-bold text-xs py-1 text-emerald-800 rounded-xs shadow-xs"
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-gray-500 italic text-[11px] text-center">
                                                    {subjScore.final >= 9.0 ? 'Xuất sắc' : subjScore.final >= 8.0 ? 'Giỏi' : subjScore.final >= 6.5 ? 'Khá' : subjScore.final !== '' ? 'Đạt' : '--'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer THCS Grade Settings & Semester Awards */}
                        <div className="p-5 bg-brand-cream border border-brand-cerulean/20 rounded-xs space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <EditorialSelect
                                    label="Xếp loại Học lực:"
                                    value={currentThcsGradeData.rank || 'Học sinh Giỏi'}
                                    onChange={val => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, rank: val }
                                        }
                                    }))}
                                    options={TRANSCRIPT_RANK_OPTIONS}
                                    size="sm"
                                />
                                <EditorialSelect
                                    label="Hạnh kiểm / Rèn luyện:"
                                    value={currentThcsGradeData.conduct || 'Tốt'}
                                    onChange={val => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, conduct: val }
                                        }
                                    }))}
                                    options={TRANSCRIPT_CONDUCT_OPTIONS}
                                    size="sm"
                                />
                            </div>

                            {/* Semester Awards (Giấy khen từng học kỳ có upload hình) */}
                            <div className="pt-3 border-t border-brand-cerulean/15 space-y-2.5">
                                <div className="flex items-center gap-1.5">
                                    <Award size={15} className="text-emerald-700" />
                                    <span className="font-serif-title font-bold text-xs text-brand-cerulean uppercase tracking-wider">
                                        Giấy khen & Danh hiệu Khen thưởng Lớp {selectedThcsGrade} (Từng học kỳ):
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <CertificateUploadCard
                                        label="Giấy khen Học kỳ 1 (HK1)"
                                        iconColor="text-amber-600"
                                        titleValue={currentThcsGradeData.awardHk1}
                                        imageValue={currentThcsGradeData.awardHk1Img}
                                        placeholder="Vd: Giấy khen Học sinh Giỏi HK1..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: {
                                                ...prev.secondarySchool,
                                                [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, awardHk1: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: {
                                                ...prev.secondarySchool,
                                                [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, awardHk1Img: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />

                                    <CertificateUploadCard
                                        label="Giấy khen Học kỳ 2 (HK2)"
                                        iconColor="text-amber-600"
                                        titleValue={currentThcsGradeData.awardHk2}
                                        imageValue={currentThcsGradeData.awardHk2Img}
                                        placeholder="Vd: Giấy khen Học sinh Giỏi HK2..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: {
                                                ...prev.secondarySchool,
                                                [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, awardHk2: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: {
                                                ...prev.secondarySchool,
                                                [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, awardHk2Img: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />

                                    <CertificateUploadCard
                                        label="Giấy khen Cả năm"
                                        iconColor="text-emerald-700"
                                        titleValue={currentThcsGradeData.awardYear || currentThcsGradeData.awards}
                                        imageValue={currentThcsGradeData.awardYearImg}
                                        placeholder="Vd: Giấy khen Học sinh Giỏi cả năm, Cháu ngoan Bác Hồ..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: {
                                                ...prev.secondarySchool,
                                                [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, awardYear: val, awards: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            secondarySchool: {
                                                ...prev.secondarySchool,
                                                [`grade${selectedThcsGrade}`]: { ...currentThcsGradeData, awardYearImg: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-brand-cerulean/15">
                                <button
                                    type="button"
                                    onClick={() => handleSaveAll(transcripts)}
                                    className="px-5 py-2 bg-emerald-700 text-white font-serif-title text-xs font-bold shadow-xs hover:bg-emerald-800 transition-all flex items-center gap-1.5"
                                >
                                    <Save size={14} /> Lưu điểm Lớp {selectedThcsGrade}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ENTRANCE EXAM TO GRADE 10 (KỲ THI TUYỂN SINH VÀO LỚP 10) */}
                    <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-cerulean/15">
                            <h3 className="font-serif-title font-bold text-xl text-brand-cerulean flex items-center gap-2">
                                <Award size={20} className="text-brand-jasper" />
                                Kết quả Kỳ thi Tuyển sinh vào Lớp 10 THPT
                            </h3>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                                Đã Trúng tuyển
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                    Trường THPT Đã Trúng tuyển vào Lớp 10
                                </label>
                                <input
                                    type="text"
                                    value={transcripts.secondarySchool.entranceExam10?.schoolAdmitted}
                                    onChange={e => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            entranceExam10: { ...prev.secondarySchool.entranceExam10, schoolAdmitted: e.target.value }
                                        }
                                    }))}
                                    placeholder="Vd: THPT Chuyên Lê Hồng Phong TP.HCM"
                                    className="w-full bg-white border border-brand-cerulean/30 px-3 py-2 text-xs font-bold text-brand-cerulean rounded-xs shadow-xs"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Môn Toán</label>
                                <input
                                    type="number"
                                    step="0.05"
                                    min="0"
                                    max="10"
                                    value={transcripts.secondarySchool.entranceExam10?.mathScore}
                                    onChange={e => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            entranceExam10: { ...prev.secondarySchool.entranceExam10, mathScore: e.target.value }
                                        }
                                    }))}
                                    placeholder="--.-"
                                    className="w-full text-center bg-white border border-brand-cerulean/30 py-1.5 font-bold text-sm text-brand-cerulean rounded-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Môn Ngữ văn</label>
                                <input
                                    type="number"
                                    step="0.05"
                                    min="0"
                                    max="10"
                                    value={transcripts.secondarySchool.entranceExam10?.literatureScore}
                                    onChange={e => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            entranceExam10: { ...prev.secondarySchool.entranceExam10, literatureScore: e.target.value }
                                        }
                                    }))}
                                    placeholder="--.-"
                                    className="w-full text-center bg-white border border-brand-cerulean/30 py-1.5 font-bold text-sm text-brand-cerulean rounded-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Môn Tiếng Anh</label>
                                <input
                                    type="number"
                                    step="0.05"
                                    min="0"
                                    max="10"
                                    value={transcripts.secondarySchool.entranceExam10?.englishScore}
                                    onChange={e => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            entranceExam10: { ...prev.secondarySchool.entranceExam10, englishScore: e.target.value }
                                        }
                                    }))}
                                    placeholder="--.-"
                                    className="w-full text-center bg-white border border-brand-cerulean/30 py-1.5 font-bold text-sm text-brand-cerulean rounded-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Môn Chuyên (nếu có)</label>
                                <input
                                    type="number"
                                    step="0.05"
                                    min="0"
                                    max="10"
                                    value={transcripts.secondarySchool.entranceExam10?.specializedScore}
                                    onChange={e => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            entranceExam10: { ...prev.secondarySchool.entranceExam10, specializedScore: e.target.value }
                                        }
                                    }))}
                                    placeholder="--.-"
                                    className="w-full text-center bg-white border border-brand-cerulean/30 py-1.5 font-bold text-sm text-brand-jasper rounded-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">Tổng điểm xét</label>
                                <input
                                    type="number"
                                    step="0.05"
                                    value={transcripts.secondarySchool.entranceExam10?.totalScore}
                                    onChange={e => setTranscripts(prev => ({
                                        ...prev,
                                        secondarySchool: {
                                            ...prev.secondarySchool,
                                            entranceExam10: { ...prev.secondarySchool.entranceExam10, totalScore: e.target.value }
                                        }
                                    }))}
                                    placeholder="--.-"
                                    className="w-full text-center bg-brand-cream border-2 border-brand-cerulean/40 py-1.5 font-bold text-sm text-brand-jasper rounded-xs"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => handleSaveAll(transcripts)}
                                className="px-5 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold shadow-xs hover:bg-brand-jasper transition-all"
                            >
                                Lưu kết quả Cấp 2
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: CẤP 1 - TIỂU HỌC */}
            {activeTab === 'primary' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-6 sm:p-8 border border-brand-cerulean/20 shadow-editorial space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/15">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-600 text-white rounded font-sans uppercase">
                                        Trường Tiểu học
                                    </span>
                                    <span className="text-xs font-serif text-gray-500">Khóa hoàn thành: {transcripts.primarySchool.graduationYear || '2019'}</span>
                                </div>
                                <h3 className="font-serif-title font-bold text-2xl text-brand-cerulean mt-1">
                                    {transcripts.primarySchool.schoolName || 'Chưa cập nhật tên trường Tiểu học'}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsEditingPrimary(!isEditingPrimary)}
                                className="px-4 py-2 bg-brand-cream border border-brand-cerulean/30 hover:border-brand-jasper hover:text-brand-jasper text-xs font-bold font-serif-title text-brand-cerulean rounded-xs transition-colors flex items-center gap-1.5"
                            >
                                <Edit2 size={13} /> {isEditingPrimary ? 'Đóng form' : 'Sửa thông tin Tiểu học'}
                            </button>
                        </div>

                        {/* Edit Primary School Form */}
                        {isEditingPrimary && (
                            <div className="p-4 bg-brand-cream/60 border border-brand-cerulean/20 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Tên trường Tiểu học
                                    </label>
                                    <input
                                        type="text"
                                        value={transcripts.primarySchool.schoolName}
                                        onChange={e => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: { ...prev.primarySchool, schoolName: e.target.value }
                                        }))}
                                        placeholder="Vd: Tiểu học Lê Ngọc Hân"
                                        className="w-full bg-white border border-brand-cerulean/30 px-3 py-1.5 text-xs font-body rounded-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                                        Năm hoàn thành Tiểu học
                                    </label>
                                    <input
                                        type="text"
                                        value={transcripts.primarySchool.graduationYear}
                                        onChange={e => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: { ...prev.primarySchool, graduationYear: e.target.value }
                                        }))}
                                        placeholder="Vd: 2019"
                                        className="w-full bg-white border border-brand-cerulean/30 px-3 py-1.5 text-xs font-body rounded-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Grade Switcher Tabs for Primary (Lớp 1, 2, 3, 4, 5) */}
                        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-serif-title font-bold text-brand-cerulean">Chọn khối lớp Tiểu học:</span>
                                {['1', '2', '3', '4', '5'].map(gr => (
                                    <button
                                        key={gr}
                                        type="button"
                                        onClick={() => setSelectedPrimaryGrade(gr)}
                                        className={`px-4 py-1.5 text-xs font-serif-title font-bold rounded-xs transition-all ${
                                            selectedPrimaryGrade === gr
                                                ? 'bg-amber-600 text-white shadow-xs'
                                                : 'bg-brand-cream border border-brand-cerulean/25 text-brand-cerulean hover:bg-brand-cerulean/10'
                                        }`}
                                    >
                                        Lớp {gr}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 text-xs flex-wrap">
                                <span>ĐTB Văn Hóa Lớp {selectedPrimaryGrade}: <strong className="text-amber-800 text-sm">{currentPrimaryGradeData.gpa || '--'} đ</strong></span>
                                <span>•</span>
                                <span>Đánh giá: <strong className="text-brand-cerulean">{currentPrimaryGradeData.result || 'Hoàn thành Xuất sắc'}</strong></span>
                                {(currentPrimaryGradeData.awardHk1 || currentPrimaryGradeData.awardHk2 || currentPrimaryGradeData.awardYear || currentPrimaryGradeData.awards || currentPrimaryGradeData.awardHk1Img || currentPrimaryGradeData.awardHk2Img || currentPrimaryGradeData.awardYearImg) && (
                                    <>
                                        <span>•</span>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {(currentPrimaryGradeData.awardHk1 || currentPrimaryGradeData.awardHk1Img) && (
                                                <span 
                                                    onClick={() => currentPrimaryGradeData.awardHk1Img && setPreviewModal({ isOpen: true, imageUrl: currentPrimaryGradeData.awardHk1Img, title: `Giấy khen HK1 Lớp ${selectedPrimaryGrade}: ${currentPrimaryGradeData.awardHk1 || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/60 px-2 py-0.5 rounded-xs text-[11px] font-medium ${
                                                        currentPrimaryGradeData.awardHk1Img ? 'cursor-pointer hover:bg-amber-100 hover:border-amber-400' : ''
                                                    }`} 
                                                    title={currentPrimaryGradeData.awardHk1Img ? 'Click để xem ảnh Giấy khen' : 'Giấy khen HK1'}
                                                >
                                                    <Award size={11} className="text-amber-600" /> HK1: {currentPrimaryGradeData.awardHk1 || 'Đã đính kèm ảnh'}
                                                    {currentPrimaryGradeData.awardHk1Img && <ImageIcon size={11} className="text-amber-700 ml-0.5" />}
                                                </span>
                                            )}
                                            {(currentPrimaryGradeData.awardHk2 || currentPrimaryGradeData.awardHk2Img) && (
                                                <span 
                                                    onClick={() => currentPrimaryGradeData.awardHk2Img && setPreviewModal({ isOpen: true, imageUrl: currentPrimaryGradeData.awardHk2Img, title: `Giấy khen HK2 Lớp ${selectedPrimaryGrade}: ${currentPrimaryGradeData.awardHk2 || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/60 px-2 py-0.5 rounded-xs text-[11px] font-medium ${
                                                        currentPrimaryGradeData.awardHk2Img ? 'cursor-pointer hover:bg-amber-100 hover:border-amber-400' : ''
                                                    }`} 
                                                    title={currentPrimaryGradeData.awardHk2Img ? 'Click để xem ảnh Giấy khen' : 'Giấy khen HK2'}
                                                >
                                                    <Award size={11} className="text-amber-600" /> HK2: {currentPrimaryGradeData.awardHk2 || 'Đã đính kèm ảnh'}
                                                    {currentPrimaryGradeData.awardHk2Img && <ImageIcon size={11} className="text-amber-700 ml-0.5" />}
                                                </span>
                                            )}
                                            {(currentPrimaryGradeData.awardYear || currentPrimaryGradeData.awards || currentPrimaryGradeData.awardYearImg) && (
                                                <span 
                                                    onClick={() => currentPrimaryGradeData.awardYearImg && setPreviewModal({ isOpen: true, imageUrl: currentPrimaryGradeData.awardYearImg, title: `Giấy khen Cả năm Lớp ${selectedPrimaryGrade}: ${currentPrimaryGradeData.awardYear || currentPrimaryGradeData.awards || ''}` })}
                                                    className={`inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-xs text-[11px] font-bold ${
                                                        currentPrimaryGradeData.awardYearImg ? 'cursor-pointer hover:bg-amber-200 hover:border-amber-400' : ''
                                                    }`} 
                                                    title={currentPrimaryGradeData.awardYearImg ? 'Click để xem ảnh Giấy khen' : 'Giấy khen Cả năm'}
                                                >
                                                    <Award size={11} className="text-amber-700" /> Cả năm: {currentPrimaryGradeData.awardYear || currentPrimaryGradeData.awards || 'Đã đính kèm ảnh'}
                                                    {currentPrimaryGradeData.awardYearImg && <ImageIcon size={11} className="text-amber-800 ml-0.5" />}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* PRIMARY DETAILED SUBJECT SCORES TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-cream border-y border-brand-cerulean/20 text-brand-cerulean font-serif-title text-xs">
                                        <th className="py-2.5 px-3 font-bold">Môn học Tiểu học</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28">Điểm Giữa kỳ / HK1</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28">Điểm Cuối kỳ / HK2</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-28 bg-amber-50">Cả năm</th>
                                        <th className="py-2.5 px-3 font-bold text-center w-36">Mức đạt chuẩn</th>
                                        <th className="py-2.5 px-3 font-bold">Nhận xét của giáo viên</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-cerulean/10 text-xs font-body">
                                    {PRIMARY_SUBJECTS.filter(subj => !subj.grades || subj.grades.includes(String(selectedPrimaryGrade))).map(subj => {
                                        const subjScore = currentPrimaryGradeData.scores?.[subj.id] || { hk1: '', hk2: '', final: '', status: 'T', comment: '' };
                                        const isSplit5 = subj.isSplit5;
                                        return (
                                            <tr key={subj.id} className="hover:bg-brand-cream/30 transition-colors">
                                                <td className="py-2.5 px-3 font-serif font-bold text-brand-cerulean flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subj.color }} />
                                                    {subj.name}
                                                    {isSplit5 && (
                                                        <span className="text-[10px] text-amber-700 font-sans font-normal italic">(5đ / HK)</span>
                                                    )}
                                                </td>

                                                {subj.hasScore ? (
                                                    <>
                                                        <td className="py-2 px-3 text-center">
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                min="0"
                                                                max={isSplit5 ? "5" : "10"}
                                                                value={subjScore.hk1 ?? ''}
                                                                onChange={e => handleUpdatePrimaryScore(selectedPrimaryGrade, subj.id, 'hk1', e.target.value)}
                                                                placeholder={isSplit5 ? "/5" : "--.-"}
                                                                className="w-16 text-center bg-white border border-brand-cerulean/25 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-bold text-xs py-1 rounded-xs shadow-xs"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3 text-center">
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                min="0"
                                                                max={isSplit5 ? "5" : "10"}
                                                                value={subjScore.hk2 ?? ''}
                                                                onChange={e => handleUpdatePrimaryScore(selectedPrimaryGrade, subj.id, 'hk2', e.target.value)}
                                                                placeholder={isSplit5 ? "/5" : "--.-"}
                                                                className="w-16 text-center bg-white border border-brand-cerulean/25 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-bold text-xs py-1 rounded-xs shadow-xs"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3 text-center bg-amber-50">
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                min="0"
                                                                max="10"
                                                                value={subjScore.final ?? ''}
                                                                onChange={e => handleUpdatePrimaryScore(selectedPrimaryGrade, subj.id, 'final', e.target.value)}
                                                                placeholder="--.-"
                                                                className="w-16 text-center bg-white border-2 border-amber-600/50 focus:border-amber-700 font-bold text-xs py-1 text-amber-900 rounded-xs shadow-xs"
                                                            />
                                                        </td>
                                                    </>
                                                ) : (
                                                    <td colSpan={3} className="py-2 px-3 text-center text-gray-500 italic text-[11px] bg-brand-cream/30">
                                                        Đánh giá định kỳ bằng nhận xét
                                                    </td>
                                                )}

                                                <td className="py-2 px-3 text-center">
                                                    <EditorialSelect
                                                        value={subjScore.status || 'T'}
                                                        onChange={val => handleUpdatePrimaryScore(selectedPrimaryGrade, subj.id, 'status', val)}
                                                        options={PRIMARY_SUBJECT_STATUS_OPTIONS}
                                                        size="sm"
                                                        className="w-28 mx-auto"
                                                    />
                                                </td>

                                                <td className="py-2 px-3">
                                                    <input
                                                        type="text"
                                                        value={subjScore.comment || ''}
                                                        onChange={e => handleUpdatePrimaryScore(selectedPrimaryGrade, subj.id, 'comment', e.target.value)}
                                                        placeholder="Nhận xét của cô giáo..."
                                                        className="w-full bg-white border border-brand-cerulean/20 px-2 py-1 text-xs font-body rounded-xs"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Primary Grade Settings & Semester Awards */}
                        <div className="p-5 bg-brand-cream border border-brand-cerulean/20 rounded-xs space-y-4">
                            <div>
                                <EditorialSelect
                                    label={`Kết quả đánh giá chung Lớp ${selectedPrimaryGrade}:`}
                                    value={currentPrimaryGradeData.result || 'Hoàn thành Xuất sắc'}
                                    onChange={val => setTranscripts(prev => ({
                                        ...prev,
                                        primarySchool: {
                                            ...prev.primarySchool,
                                            [`grade${selectedPrimaryGrade}`]: { ...currentPrimaryGradeData, result: val }
                                        }
                                    }))}
                                    options={PRIMARY_EVAL_RESULT_OPTIONS}
                                    size="sm"
                                />
                            </div>

                            {/* Semester Awards (Giấy khen từng học kỳ có upload hình) */}
                            <div className="pt-3 border-t border-brand-cerulean/15 space-y-2.5">
                                <div className="flex items-center gap-1.5">
                                    <Award size={15} className="text-amber-600" />
                                    <span className="font-serif-title font-bold text-xs text-brand-cerulean uppercase tracking-wider">
                                        Giấy khen & Danh hiệu Khen thưởng Lớp {selectedPrimaryGrade} (Từng học kỳ):
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <CertificateUploadCard
                                        label="Giấy khen Học kỳ 1 (HK1)"
                                        iconColor="text-amber-600"
                                        titleValue={currentPrimaryGradeData.awardHk1}
                                        imageValue={currentPrimaryGradeData.awardHk1Img}
                                        placeholder="Vd: Khen thưởng Học sinh Tiêu biểu HK1..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: {
                                                ...prev.primarySchool,
                                                [`grade${selectedPrimaryGrade}`]: { ...currentPrimaryGradeData, awardHk1: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: {
                                                ...prev.primarySchool,
                                                [`grade${selectedPrimaryGrade}`]: { ...currentPrimaryGradeData, awardHk1Img: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />

                                    <CertificateUploadCard
                                        label="Giấy khen Học kỳ 2 (HK2)"
                                        iconColor="text-amber-600"
                                        titleValue={currentPrimaryGradeData.awardHk2}
                                        imageValue={currentPrimaryGradeData.awardHk2Img}
                                        placeholder="Vd: Khen thưởng Học sinh Xuất sắc HK2..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: {
                                                ...prev.primarySchool,
                                                [`grade${selectedPrimaryGrade}`]: { ...currentPrimaryGradeData, awardHk2: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: {
                                                ...prev.primarySchool,
                                                [`grade${selectedPrimaryGrade}`]: { ...currentPrimaryGradeData, awardHk2Img: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />

                                    <CertificateUploadCard
                                        label="Giấy khen Cả năm"
                                        iconColor="text-amber-700"
                                        titleValue={currentPrimaryGradeData.awardYear || currentPrimaryGradeData.awards}
                                        imageValue={currentPrimaryGradeData.awardYearImg}
                                        placeholder="Vd: Khen thưởng Học sinh Xuất sắc, Vở sạch chữ đẹp..."
                                        onTitleChange={val => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: {
                                                ...prev.primarySchool,
                                                [`grade${selectedPrimaryGrade}`]: { ...currentPrimaryGradeData, awardYear: val, awards: val }
                                            }
                                        }))}
                                        onImageChange={img => setTranscripts(prev => ({
                                            ...prev,
                                            primarySchool: {
                                                ...prev.primarySchool,
                                                [`grade${selectedPrimaryGrade}`]: { ...currentPrimaryGradeData, awardYearImg: img }
                                            }
                                        }))}
                                        onPreviewImage={(img, title) => setPreviewModal({ isOpen: true, imageUrl: img, title })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-brand-cerulean/15">
                                <button
                                    type="button"
                                    onClick={() => handleSaveAll(transcripts)}
                                    className="px-5 py-2 bg-amber-600 text-white font-serif-title text-xs font-bold shadow-xs hover:bg-amber-700 transition-all flex items-center gap-1.5"
                                >
                                    <Save size={14} /> Lưu điểm Lớp {selectedPrimaryGrade}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL: Xem phóng to ảnh Giấy khen */}
            {previewModal.isOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setPreviewModal({ isOpen: false, imageUrl: '', title: '' })}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] w-full bg-white p-4 rounded-xs shadow-2xl border-2 border-brand-cerulean space-y-3 animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-brand-cerulean/20">
                            <h4 className="font-serif-title font-bold text-brand-cerulean flex items-center gap-2 text-base">
                                <Award size={20} className="text-amber-600" />
                                {previewModal.title || 'Ảnh Giấy khen'}
                            </h4>
                            <button
                                type="button"
                                onClick={() => setPreviewModal({ isOpen: false, imageUrl: '', title: '' })}
                                className="p-1.5 text-gray-500 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-stone-900/5 rounded-xs p-2">
                            <img 
                                src={previewModal.imageUrl} 
                                alt={previewModal.title} 
                                className="max-h-[70vh] max-w-full object-contain rounded-xs shadow-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicTranscriptsView;
