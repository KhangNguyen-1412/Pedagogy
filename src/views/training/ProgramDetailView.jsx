import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    ChevronDown,
    Plus,
    Pencil,
    Trash2,
    FileText,
    CheckCircle2,
    Clock,
    BookOpen,
    PlusCircle,
    Search,
    Unlink,
    Link2,
    AlertCircle,
    AlertTriangle,
    Info,
    Sparkles,
    Calendar,
    Award,
    ArrowLeft,
    Check
} from 'lucide-react';
import { EditorialSelect, Modal, AlertBox, ProgressBar } from '../../components/common/EditorialWidgets';
import { RuleValidationPanel } from '../../components/training/RuleValidationPanel';
import { isModuleInProgram, getModuleProgramNames, calculateRuleBreakdown, normalizeModuleProgramIds } from "../../utils/ruleValidators";
import { calculateModuleFinal } from "../../utils/gpaCalculators";
import { formatModuleName } from "../../utils/seoHelpers";

export const ProgramDetailView = ({ programId, programs, modules, profile, onAddModule, onUpdateModule, onDeleteModule, onUpdateProgram, navigate }) => {
    const program = programs.find(p => p.id === programId) || (programs && programs.length > 0 ? programs[0] : null);
    const isDaiHoc = program?.category === 'dai_hoc' || program?.rules?.general !== undefined;

    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [isProgramEditModalOpen, setIsProgramEditModalOpen] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [viewMode, setViewMode] = useState('category'); // 'category' | 'semester'
    const [programFormData, setProgramFormData] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const [modForm, setModForm] = useState({
        code: '',
        name: '',
        credits: isDaiHoc ? 3 : 2,
        category: isDaiHoc ? 'general' : 'A',
        knowledgeBlock: isDaiHoc ? 'general' : 'A',
        semester: 'unassigned',
        prerequisites: '',
        type: 'mandatory'
    });
    const [modalTab, setModalTab] = useState('create'); // 'create' | 'batch' | 'link'
    const [linkSearch, setLinkSearch] = useState('');
    const [batchText, setBatchText] = useState('');
    const [batchDefaults, setBatchDefaults] = useState({
        category: isDaiHoc ? 'general' : 'A',
        type: 'mandatory',
        credits: isDaiHoc ? 3 : 2,
        semester: 'unassigned'
    });

    const moduleTypeOptions = [
        { label: 'Bắt buộc', value: 'mandatory' },
        { label: 'Tự chọn', value: 'elective' },
        { label: 'Thực hành / Khóa luận', value: 'practice' },
    ];

    const categoryFormOptions = isDaiHoc
        ? [
            { label: 'GD Đại cương', value: 'general' },
            { label: 'Cơ sở ngành & Bổ trợ', value: 'fundamental' },
            { label: 'Chuyên ngành', value: 'specialized' },
            { label: 'Thực tập & Khóa luận tốt nghiệp', value: 'internship' },
        ]
        : [
            { label: 'Nhánh A', value: 'A' },
            { label: 'Nhánh B', value: 'B' },
            { label: 'Nhánh C', value: 'C' },
        ];

    const semesterOptions = [
        { label: 'Chưa xếp học kỳ (Xếp sau)', value: 'unassigned' },
        { label: 'Học kỳ 1 (Năm 1)', value: '1' },
        { label: 'Học kỳ 2 (Năm 1)', value: '2' },
        { label: 'Học kỳ 3 (Năm 2)', value: '3' },
        { label: 'Học kỳ 4 (Năm 2)', value: '4' },
        { label: 'Học kỳ 5 (Năm 3)', value: '5' },
        { label: 'Học kỳ 6 (Năm 3)', value: '6' },
        { label: 'Học kỳ 7 (Năm 4)', value: '7' },
        { label: 'Học kỳ 8 (Năm 4)', value: '8' },
        { label: 'Kỳ hè / Dự thính', value: 'summer' }
    ];

    const programModules = program ? modules.filter(m => isModuleInProgram(m, program.id)) : [];
    const unassignedCount = programModules.filter(m => !m.semester || m.semester === 'unassigned').length;

    const semesterFilterOptions = [
        { label: 'Tất cả các học kỳ', value: 'all' },
        ...(unassignedCount > 0 ? [{ label: `⚠️ Chưa xếp học kỳ (${unassignedCount})`, value: 'unassigned' }] : []),
        ...semesterOptions.filter(opt => opt.value !== 'unassigned')
    ];

    const statusOptions = [
        { label: 'Lên kế hoạch', value: 'planned' },
        { label: 'Đang học', value: 'in_progress' },
        { label: 'Đã hoàn thành', value: 'completed' },
    ];

    const sortedProgramModules = [...programModules].sort((a, b) => {
        const semA = a.semester === 'unassigned' ? 999 : (Number(a.semester) || 99);
        const semB = b.semester === 'unassigned' ? 999 : (Number(b.semester) || 99);
        if (semA !== semB) return semA - semB;
        return (a.code || '').localeCompare(b.code || '');
    });

    const prerequisiteOptions = sortedProgramModules.map(m => ({
        label: `${m.code ? `[${m.code}] ` : ''}${m.name}${m.semester && m.semester !== 'unassigned' ? ` (HK ${m.semester})` : ''}`,
        value: m.code || m.name
    }));

    const editingPrerequisiteOptions = editingModule
        ? sortedProgramModules
            .filter(m => m.id !== editingModule.id && m.code !== editingModule.code)
            .map(m => ({
                label: `${m.code ? `[${m.code}] ` : ''}${m.name}${m.semester && m.semester !== 'unassigned' ? ` (HK ${m.semester})` : ''}`,
                value: m.code || m.name
            }))
        : prerequisiteOptions;

    // Duplicate detection in Add Module modal
    const trimmedModCode = (modForm.code || '').trim().toUpperCase();
    const trimmedModName = (modForm.name || '').trim().toLowerCase();

    // Check duplicate in current program (by exact code or exact name)
    const duplicateInCurrentProgram = (trimmedModCode || trimmedModName)
        ? programModules.find(m => {
            const mCode = (m.code || '').trim().toUpperCase();
            const mName = (m.name || '').trim().toLowerCase();
            return (trimmedModCode && mCode === trimmedModCode) || (trimmedModName && mName === trimmedModName);
        })
        : null;

    // Check duplicate in other programs across the system (not yet linked to this program)
    const duplicateInOtherPrograms = (!duplicateInCurrentProgram && (trimmedModCode || trimmedModName))
        ? modules.find(m => {
            if (isModuleInProgram(m, programId)) return false;
            const mCode = (m.code || '').trim().toUpperCase();
            const mName = (m.name || '').trim().toLowerCase();
            return (trimmedModCode && mCode === trimmedModCode) || (trimmedModName && mName === trimmedModName);
        })
        : null;

    // Duplicate detection in Edit Module modal
    const trimmedEditCode = (editingModule?.code || '').trim().toUpperCase();
    const trimmedEditName = (editingModule?.name || '').trim().toLowerCase();
    const duplicateInEdit = editingModule && (trimmedEditCode || trimmedEditName)
        ? programModules.find(m => m.id !== editingModule.id && (
            (trimmedEditCode && (m.code || '').trim().toUpperCase() === trimmedEditCode) ||
            (trimmedEditName && (m.name || '').trim().toLowerCase() === trimmedEditName)
        ))
        : null;

    if (!program) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center border border-dashed border-brand-cerulean">
                <p className="text-xl font-serif-title text-gray-500 mb-4">Không tìm thấy thông tin chương trình đào tạo.</p>
                <button
                    onClick={() => navigate('programs')}
                    className="px-6 py-2 bg-brand-cerulean text-white font-serif-title"
                >
                    Quay lại Danh sách Chương trình
                </button>
            </div>
        );
    }

    // Auto-generate next module code number based on category
    const generateNextModuleCode = (category, currentModules) => {
        if (!category) return '';
        if (isDaiHoc) {
            const prefix = category === 'general' ? 'GEN' : category === 'fundamental' ? 'BAS' : category === 'specialized' ? 'SPE' : 'INT';
            const count = currentModules.filter(m => m.category === category || m.knowledgeBlock === category).length + 1;
            return `${prefix}${String(count).padStart(2, '0')}`;
        }
        const prefix = category.toUpperCase();
        const existingForCat = currentModules.filter(m => (m.category || '').toUpperCase() === prefix);

        let maxNum = 0;
        existingForCat.forEach(m => {
            const codeStr = (m.code || '').toUpperCase();
            const match = codeStr.match(new RegExp(`^${prefix}(\\d+)$`));
            if (match) {
                const num = parseInt(match[1], 10);
                if (!isNaN(num) && num > maxNum) {
                    maxNum = num;
                }
            }
        });

        const nextNum = maxNum + 1;
        return `${prefix}${String(nextNum).padStart(2, '0')}`;
    };

    const handleOpenAddModal = () => {
        const defaultCat = isDaiHoc ? 'general' : 'A';
        const autoCode = generateNextModuleCode(defaultCat, programModules);
        setModForm({
            code: autoCode,
            name: '',
            credits: isDaiHoc ? 3 : 2,
            category: defaultCat,
            knowledgeBlock: defaultCat,
            semester: semesterFilter !== 'all' ? semesterFilter : 'unassigned',
            prerequisites: '',
            type: 'mandatory'
        });
        setIsModuleModalOpen(true);
    };

    const handleCreateModule = (e) => {
        e.preventDefault();
        if (duplicateInCurrentProgram) {
            if (!window.confirm(`Học phần "[${duplicateInCurrentProgram.code}] ${duplicateInCurrentProgram.name}" đã có trong chương trình này. Bạn có chắc chắn muốn tiếp tục tạo trùng lặp không?`)) {
                return;
            }
        }
        const newMod = {
            id: 'mod_' + Date.now(),
            programIds: [programId],
            ...modForm,
            code: (modForm.code || '').toUpperCase().trim(),
            credits: Number(modForm.credits),
            semester: modForm.semester || 'unassigned',
            prerequisites: Array.isArray(modForm.prerequisites) ? modForm.prerequisites.join(', ') : (modForm.prerequisites?.trim() || ''),
            knowledgeBlock: modForm.category || 'general',
            status: 'planned',
            syllabus: {
                description: '',
                clos: [],
                weights: { attendance: 10, midterm: 30, final: 60 }
            },
            grades: { attendance: 0, midterm: 0, final: 0 }
        };
        onAddModule(newMod);
        setIsModuleModalOpen(false);
        const defaultCat = isDaiHoc ? 'general' : 'A';
        const autoCode = generateNextModuleCode(defaultCat, [...programModules, newMod]);
        setModForm({
            code: autoCode,
            name: '',
            credits: isDaiHoc ? 3 : 2,
            category: defaultCat,
            knowledgeBlock: defaultCat,
            semester: semesterFilter !== 'all' ? semesterFilter : 'unassigned',
            prerequisites: '',
            type: 'mandatory'
        });
    };

    // Parser for quick batch list input
    const parsedBatchModules = useMemo(() => {
        if (!batchText.trim()) return [];
        const lines = batchText.split('\n').map(l => l.trim()).filter(Boolean);
        
        let genCount = programModules.filter(m => (m.category || m.knowledgeBlock) === batchDefaults.category).length;

        return lines.map((line, idx) => {
            let code = '';
            let name = line;
            let credits = batchDefaults.credits || (isDaiHoc ? 3 : 2);
            let category = batchDefaults.category || (isDaiHoc ? 'general' : 'A');
            let type = batchDefaults.type || 'mandatory';
            let semester = batchDefaults.semester || 'unassigned';

            // 1. Pipe or Tab separated format: CODE | NAME | CREDITS | CATEGORY
            if (line.includes('|') || line.includes('\t')) {
                const parts = line.split(/[|\t]/).map(p => p.trim());
                if (parts.length >= 2) {
                    if (parts[0].match(/^[A-Za-z0-9_-]{2,10}$/)) {
                        code = parts[0].toUpperCase();
                        name = parts[1];
                        if (parts[2] && !isNaN(Number(parts[2]))) credits = Number(parts[2]);
                        if (parts[3] && ['general', 'fundamental', 'specialized', 'internship', 'A', 'B', 'C'].includes(parts[3])) category = parts[3];
                    } else {
                        name = parts[0];
                        if (!isNaN(Number(parts[1]))) credits = Number(parts[1]);
                    }
                }
            } else {
                // 2. Format: "MTH101: Giải tích 1" or "MTH101 - Giải tích 1" or "MTH101. Giải tích 1"
                const codeMatch = line.match(/^([A-Za-z0-9_-]{2,10})[\s:.\–—-]+(.*)$/);
                if (codeMatch) {
                    code = codeMatch[1].toUpperCase();
                    name = codeMatch[2].trim();
                }

                // 3. Format: "... (3 TC)" or "... - 3 tín chỉ" or "... (3 tín chỉ)"
                const credMatch = name.match(/[\(\[-]?\s*(\d+)\s*(?:tc|tín chỉ|credits?)?\s*[\)\]]?$/i);
                if (credMatch && credMatch[1]) {
                    credits = Number(credMatch[1]);
                    name = name.replace(/[\(\[-]?\s*(\d+)\s*(?:tc|tín chỉ|credits?)?\s*[\)\]]?$/i, '').trim();
                }
            }

            if (!code) {
                genCount++;
                const prefix = isDaiHoc
                    ? (category === 'general' ? 'GEN' : category === 'fundamental' ? 'BAS' : category === 'specialized' ? 'SPE' : 'INT')
                    : (category.toUpperCase());
                code = `${prefix}${String(genCount).padStart(2, '0')}`;
            }

            return {
                id: `batch_mod_${Date.now()}_${idx}`,
                code: code.toUpperCase(),
                name: name || `Học phần ${idx + 1}`,
                credits: Number(credits) || 3,
                category,
                knowledgeBlock: category,
                type,
                semester,
                prerequisites: '',
                status: 'planned',
                syllabus: {
                    description: '',
                    clos: [],
                    weights: { attendance: 10, midterm: 30, final: 60 }
                },
                grades: { attendance: 0, midterm: 0, final: 0 }
            };
        });
    }, [batchText, batchDefaults, programModules, isDaiHoc]);

    const handleSaveBatchModules = (e) => {
        e.preventDefault();
        if (parsedBatchModules.length === 0) return;

        parsedBatchModules.forEach((mod, idx) => {
            onAddModule({
                ...mod,
                id: `mod_${Date.now()}_${idx}`,
                programIds: [programId]
            });
        });

        setBatchText('');
        setIsModuleModalOpen(false);
    };

    // Link an existing module from another program into this program
    const handleLinkExistingModule = (existingMod) => {
        const updatedProgramIds = [...(existingMod.programIds || []), programId];
        onUpdateModule({ ...existingMod, programIds: updatedProgramIds });
        setIsModuleModalOpen(false);
        setLinkSearch('');
    };

    // Modules from other programs that are NOT yet linked to this program
    const linkableModules = modules.filter(m => {
        if (isModuleInProgram(m, programId)) return false;
        const search = linkSearch.toLowerCase().trim();
        if (!search) return true;
        return (m.name || '').toLowerCase().includes(search) ||
               (m.code || '').toLowerCase().includes(search);
    });

    const handleToggleElectiveSelect = (targetMod) => {
        const isCurrentlySelected = !!targetMod.isSelected;

        if (isCurrentlySelected) {
            onUpdateModule({ ...targetMod, isSelected: false });
        } else {
            // Select targetMod and unselect other electives in same group/semester if needed
            programModules.forEach(m => {
                if (m.category === targetMod.category && m.type === 'elective') {
                    if (m.id === targetMod.id) {
                        onUpdateModule({ ...m, isSelected: true });
                    } else if (m.isSelected && !isDaiHoc) {
                        onUpdateModule({ ...m, isSelected: false });
                    }
                }
            });
            onUpdateModule({ ...targetMod, isSelected: true });
        }
    };

    const handleSaveEditModule = (e) => {
        e.preventDefault();
        if (!editingModule) return;
        onUpdateModule({
            ...editingModule,
            code: (editingModule.code || '').toUpperCase().trim(),
            credits: Number(editingModule.credits),
            semester: editingModule.semester || '1',
            prerequisites: Array.isArray(editingModule.prerequisites) ? editingModule.prerequisites.join(', ') : (editingModule.prerequisites?.trim() || ''),
            knowledgeBlock: editingModule.category || editingModule.knowledgeBlock || 'general'
        });
        setEditingModule(null);
    };

    const handleDeleteModuleClick = () => {
        if (!editingModule) return;
        if (window.confirm(`Bạn có chắc chắn muốn xóa học phần "${editingModule.name}"?`)) {
            onDeleteModule(editingModule.id);
            setEditingModule(null);
        }
    };

    const filteredModules = programModules.filter(m => {
        const catMatch = categoryFilter === 'all' || m.category === categoryFilter || (isDaiHoc && m.knowledgeBlock === categoryFilter);
        const semMatch = !isDaiHoc || semesterFilter === 'all' || String(m.semester || 'unassigned') === String(semesterFilter);
        return catMatch && semMatch;
    });

    const categoryFilterOptions = [
        { label: 'Tất cả khối kiến thức', value: 'all' },
        ...(isDaiHoc
            ? [
                { label: 'Khối GD Đại cương', value: 'general' },
                { label: 'Khối Cơ sở ngành & Bổ trợ', value: 'fundamental' },
                { label: 'Khối Chuyên ngành', value: 'specialized' },
                { label: 'Khối Thực tập & Tốt nghiệp', value: 'internship' },
            ]
            : Array.from(new Set(programModules.map(m => m.category))).map(cat => ({ label: `Nhánh ${cat}`, value: cat }))
        )
    ];

    const getCategoryTitle = (cat) => {
        if (cat === 'general') return 'KHỐI KIẾN THỨC GIÁO DỤC ĐẠI CƯƠNG';
        if (cat === 'fundamental') return 'KHỐI KIẾN THỨC CƠ SỞ NGÀNH & BỔ TRỢ';
        if (cat === 'specialized') return 'KHỐI KIẾN THỨC CHUYÊN NGÀNH';
        if (cat === 'internship') return 'KHỐI THỰC TẬP & TỐT NGHIỆP';
        return `NHÁNH ${cat}`;
    };

    const getSemesterTitle = (sem) => {
        switch (String(sem)) {
            case 'unassigned': return 'HỌC PHẦN CHƯA XẾP HỌC KỲ (CẦN PHÂN BỔ)';
            case '1': return 'HỌC KỲ 1 (NĂM THỨ NHẤT)';
            case '2': return 'HỌC KỲ 2 (NĂM THỨ NHẤT)';
            case '3': return 'HỌC KỲ 3 (NĂM THỨ HAI)';
            case '4': return 'HỌC KỲ 4 (NĂM THỨ HAI)';
            case '5': return 'HỌC KỲ 5 (NĂM THỨ BA)';
            case '6': return 'HỌC KỲ 6 (NĂM THỨ BA)';
            case '7': return 'HỌC KỲ 7 (NĂM THỨ TƯ)';
            case '8': return 'HỌC KỲ 8 (NĂM THỨ TƯ)';
            case 'summer': return 'HỌC KỲ HÈ (BỔ TRỢ / DỰ THÍNH)';
            default: return `HỌC KỲ ${sem}`;
        }
    };

    const groupedModules = filteredModules.reduce((acc, mod) => {
        const key = mod.category || mod.knowledgeBlock || (isDaiHoc ? 'general' : 'A');
        (acc[key] = acc[key] || []).push(mod);
        return acc;
    }, {});

    const groupedBySemester = filteredModules.reduce((acc, mod) => {
        const sem = mod.semester ? String(mod.semester) : 'unassigned';
        (acc[sem] = acc[sem] || []).push(mod);
        return acc;
    }, {});

    const sortedSemesters = Object.keys(groupedBySemester).sort((a, b) => {
        if (a === 'unassigned') return -1;
        if (b === 'unassigned') return 1;
        if (a === 'summer') return 1;
        if (b === 'summer') return -1;
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
    });

    const handleUpdateProgramFormDataRule = (field, val) => {
        const num = Math.max(0, parseInt(val, 10) || 0);
        const nextRules = { ...(programFormData?.rules || {}), [field]: num };
        setProgramFormData({
            ...programFormData,
            rules: nextRules
        });
    };

    const handleOpenProgramEditModal = () => {
        setProgramFormData({
            ...program,
            rules: isDaiHoc
                ? {
                    general: program.rules?.general ?? 28,
                    fundamentalMandatory: program.rules?.fundamentalMandatory ?? program.rules?.fundamental ?? 26,
                    fundamentalElective: program.rules?.fundamentalElective ?? 8,
                    specializedMandatory: program.rules?.specializedMandatory ?? 42,
                    specializedElective: program.rules?.specializedElective ?? 16,
                    internshipGraduation: program.rules?.internshipGraduation ?? 15,
                }
                : {
                    mandatoryA: program.rules?.mandatoryA || 0,
                    electiveA: program.rules?.electiveA || 0,
                    mandatoryB: program.rules?.mandatoryB || 0,
                    practiceB: program.rules?.practiceB || 0,
                    electiveB: program.rules?.electiveB || 0,
                }
        });
        setIsProgramEditModalOpen(true);
    };

    const handleSaveProgramEdit = (e) => {
        e.preventDefault();
        if (!programFormData) return;
        if (onUpdateProgram) {
            onUpdateProgram(programFormData);
        }
        setIsProgramEditModalOpen(false);
    };

    // Total credits of all existing modules in this program curriculum
    const totalProgramCredits = programModules.reduce((sum, mod) => sum + Number(mod.credits || 0), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean space-y-3">
                <button onClick={() => navigate('programs')} className="flex items-center gap-2 text-brand-cerulean hover:text-brand-jasper font-serif-title text-sm font-bold transition-colors">
                    <ArrowLeft size={16} /> Quay lại danh sách chương trình
                </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-4xl sm:text-5xl font-serif-title text-brand-cerulean">{program.name}</h1>
                            {isDaiHoc && (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-title rounded border border-emerald-300">
                                    Bậc Đại học (4 năm &bull; 8 Học kỳ)
                                </span>
                            )}
                            <button
                                onClick={handleOpenProgramEditModal}
                                className="p-2 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 border border-brand-cerulean/30 rounded transition-all shadow-sm"
                                title="Chỉnh sửa thông tin chương trình đào tạo"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>
                        {program.description && (
                            <div className="max-w-3xl">
                                <p className={`text-sm text-gray-600 font-body leading-relaxed transition-all ${!isDescExpanded ? 'line-clamp-2' : ''}`}>
                                    {program.description}
                                </p>
                                {program.description.length > 120 && (
                                    <button
                                        type="button"
                                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                                        className="inline-flex items-center gap-1 text-xs font-serif-title font-bold text-brand-cerulean hover:text-brand-jasper transition-colors mt-0.5"
                                    >
                                        {isDescExpanded ? 'Thu gọn ▲' : 'Xem thêm mục tiêu ▼'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="text-right min-w-[200px]">
                        {program.evaluationType === 'modules' ? (
                            <>
                                <div className="text-4xl font-serif-title text-brand-jasper">{programModules.length} <span className="text-lg text-gray-500">/ {program.totalCreditsRequired || 6}</span></div>
                                <div className="text-sm uppercase tracking-wider text-brand-cerulean font-bold mt-1">Chuyên đề trong CTĐT</div>
                            </>
                        ) : program.evaluationType === 'hours' ? (
                            <>
                                <div className="text-4xl font-serif-title text-brand-jasper">{programModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0)} <span className="text-lg text-gray-500">/ {program.totalCreditsRequired || 120}</span></div>
                                <div className="text-sm uppercase tracking-wider text-brand-cerulean font-bold mt-1">Tiết học trong CTĐT</div>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl font-serif-title text-brand-jasper">{totalProgramCredits} <span className="text-lg text-gray-500">/ {program.totalCreditsRequired || (isDaiHoc ? 135 : 34)}</span></div>
                                <div className="text-sm uppercase tracking-wider text-brand-cerulean font-bold mt-1">Tín chỉ hiện có trong CTĐT</div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Live Rule Validation Breakdown Panel */}
            <RuleValidationPanel program={program} modules={modules} />

            {/* Action Bar with View Mode Switcher and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-brand-cerulean/20 pb-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-serif-title text-brand-cerulean">
                        {viewMode === 'category' ? 'Danh sách Học phần theo Khối kiến thức' : 'Lộ trình Học phần theo Từng Học kỳ'}
                    </h2>
                    {/* View Switcher Toggle */}
                    <div className="inline-flex p-1 bg-brand-cream border border-brand-cerulean/30 rounded shadow-xs">
                        <button
                            type="button"
                            onClick={() => setViewMode('category')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-serif-title font-bold transition-all rounded ${
                                viewMode === 'category'
                                    ? 'bg-brand-cerulean text-white shadow-xs'
                                    : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                            }`}
                        >
                            <BookOpen size={14} /> Theo Khối kiến thức
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('semester')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-serif-title font-bold transition-all rounded ${
                                viewMode === 'semester'
                                    ? 'bg-brand-cerulean text-white shadow-xs'
                                    : 'text-brand-cerulean hover:bg-brand-cerulean/10'
                            }`}
                        >
                            <Calendar size={14} /> Theo Học kỳ (Kỳ 1 - Kỳ 8)
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {isDaiHoc && viewMode === 'category' && (
                        <div className="w-48">
                            <EditorialSelect
                                value={semesterFilter}
                                onChange={setSemesterFilter}
                                options={semesterFilterOptions}
                            />
                        </div>
                    )}
                    {programModules.length > 0 && (
                        <div className="w-52">
                            <EditorialSelect
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                options={categoryFilterOptions}
                            />
                        </div>
                    )}
                    <button onClick={handleOpenAddModal} className="px-4 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover transition-all whitespace-nowrap">
                        + Thêm Học phần
                    </button>
                </div>
            </div>

            {/* Render Modules: View Mode = Semester */}
            {viewMode === 'semester' ? (
                Object.keys(groupedBySemester).length === 0 ? (
                    <div className="p-12 border border-dashed border-brand-cerulean text-center bg-white">
                        <p className="text-xl font-serif-title text-gray-500">Chưa có học phần nào trong bộ lọc này.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {sortedSemesters.map(semKey => {
                            const mods = groupedBySemester[semKey] || [];
                            const mandatoryAndPractice = mods.filter(m => m.type !== 'elective');
                            const electives = mods.filter(m => m.type === 'elective');
                            const semTotalCredits = mods.reduce((s, m) => s + Number(m.credits || 0), 0);

                            return (
                                <section key={semKey} className="space-y-6 break-inside-avoid bg-white p-6 border-editorial shadow-editorial">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b-2 border-brand-cerulean pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-brand-cerulean text-white font-serif-title font-bold flex items-center justify-center text-lg shrink-0 shadow-xs">
                                                {semKey === 'summer' ? 'Hè' : `K${semKey}`}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif-title text-brand-cerulean uppercase tracking-wider flex items-center gap-2 flex-wrap">
                                                    {getSemesterTitle(semKey)}
                                                    {semKey === 'unassigned' && (
                                                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold font-sans rounded-full normal-case">
                                                            Chưa phân bổ
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-sans mt-0.5">
                                                    {semKey === 'unassigned' 
                                                        ? 'Các học phần đã nhập nhưng chưa gán kỳ học — bạn có thể chọn học kỳ ngay trên thẻ môn'
                                                        : semKey === 'summer' 
                                                        ? 'Kỳ học bổ sung / Tích lũy trước' 
                                                        : `Giai đoạn đào tạo học kỳ ${semKey}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-brand-cream border border-brand-cerulean/30 rounded text-xs font-serif-title font-bold text-brand-cerulean shrink-0">
                                            {mods.length} Học phần &bull; <span className="text-brand-jasper font-bold">{semTotalCredits} TC</span>
                                        </span>
                                    </div>

                                    {semKey === 'unassigned' && (
                                        <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded flex items-start gap-2.5 text-xs text-amber-950 font-serif-title">
                                            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold">Danh sách học phần cần xếp học kỳ:</p>
                                                <p className="font-sans text-amber-900 mt-0.5">
                                                    Sử dụng ô chọn <strong>[⚠️ Chưa xếp kỳ ▾]</strong> trên từng thẻ môn học bên dưới để phân bổ trực tiếp môn học vào Học kỳ 1, 2, 3...
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bắt buộc trong kỳ */}
                                    {mandatoryAndPractice.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-base font-serif-title text-brand-jasper font-bold flex items-center gap-2 border-b border-brand-jasper/20 pb-1">
                                                <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper"></span>
                                                Học phần Bắt buộc & Thực hành ({mandatoryAndPractice.length}) &bull; {mandatoryAndPractice.reduce((s, m) => s + Number(m.credits || 0), 0)} TC
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {mandatoryAndPractice.map(mod => (
                                                    <div
                                                        key={mod.id}
                                                        className="border border-brand-cerulean/30 p-4 bg-brand-cream/30 relative group shadow-sm hover:border-brand-cerulean hover:shadow-editorial transition-all"
                                                    >
                                                        <div className="absolute top-0 right-0 bg-brand-cerulean text-white px-2 py-1 text-xs font-bold font-serif-title">
                                                            {mod.credits} TC
                                                        </div>
                                                        <div className="pr-12">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <span className="text-sm font-sans font-bold text-gray-600">{(mod.code || '').toUpperCase()}</span>
                                                                {isDaiHoc && (
                                                                    <select
                                                                        value={mod.semester || 'unassigned'}
                                                                        onChange={(e) => {
                                                                            e.stopPropagation();
                                                                            onUpdateModule({
                                                                                ...mod,
                                                                                semester: e.target.value
                                                                            });
                                                                        }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        title="Phân bổ / Chuyển học kỳ"
                                                                        className={`text-[11px] font-bold font-serif-title py-0.5 px-1.5 rounded border transition-colors cursor-pointer outline-none ${
                                                                            !mod.semester || mod.semester === 'unassigned'
                                                                                ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 shadow-xs font-bold'
                                                                                : 'bg-blue-50 text-brand-cerulean border-brand-cerulean/30 hover:border-brand-cerulean'
                                                                        }`}
                                                                    >
                                                                        <option value="unassigned">⚠️ Chưa xếp kỳ</option>
                                                                        <option value="1">Học kỳ 1</option>
                                                                        <option value="2">Học kỳ 2</option>
                                                                        <option value="3">Học kỳ 3</option>
                                                                        <option value="4">Học kỳ 4</option>
                                                                        <option value="5">Học kỳ 5</option>
                                                                        <option value="6">Học kỳ 6</option>
                                                                        <option value="7">Học kỳ 7</option>
                                                                        <option value="8">Học kỳ 8</option>
                                                                        <option value="summer">Kỳ hè</option>
                                                                    </select>
                                                                )}
                                                                {isDaiHoc && (
                                                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold font-serif-title rounded border border-gray-300">
                                                                        {mod.knowledgeBlock === 'general' || mod.category === 'general' ? 'Đại cương' :
                                                                         mod.knowledgeBlock === 'fundamental' || mod.category === 'fundamental' ? 'Cơ sở ngành' :
                                                                         mod.knowledgeBlock === 'specialized' || mod.category === 'specialized' ? 'Chuyên ngành' :
                                                                         mod.knowledgeBlock === 'internship' || mod.category === 'internship' ? 'TT & Khóa luận' : 'Khối khác'}
                                                                    </span>
                                                                )}
                                                                {mod.prerequisites && (
                                                                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-bold font-serif-title rounded border border-amber-300">
                                                                        Tiên quyết: {mod.prerequisites}
                                                                    </span>
                                                                )}
                                                                {mod.programIds && mod.programIds.length > 1 && (
                                                                    <span className="px-1.5 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[10px] font-bold font-serif-title rounded border border-brand-cerulean/20 flex items-center gap-1">
                                                                        <Link2 size={10} /> Dùng chung ({mod.programIds.length} CT)
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4
                                                                onClick={() => navigate('module_detail', { moduleId: mod.id, programId: program.id })}
                                                                className="text-xl font-serif-title text-brand-cerulean leading-tight mb-2 group-hover:text-brand-jasper transition-colors cursor-pointer"
                                                            >
                                                                {formatModuleName(mod.name, profile?.teachingSubject || profile?.major)}
                                                            </h4>
                                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                                                                <span className="text-xs italic text-gray-500">
                                                                    {mod.type === 'mandatory' ? 'Bắt buộc' : 'Thực hành'} &bull; {mod.status === 'completed' ? 'Đã hoàn thành' : mod.status === 'in_progress' ? 'Đang học' : 'Lên kế hoạch'}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        title="Sửa thông tin học phần"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingModule({ ...mod, code: (mod.code || '').toUpperCase() });
                                                                        }}
                                                                        className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 rounded transition-colors"
                                                                    >
                                                                        <Pencil size={15} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigate('module_detail', { moduleId: mod.id, programId: program.id });
                                                                        }}
                                                                        className="text-sm font-serif-title text-brand-jasper hover:underline font-bold flex items-center gap-1"
                                                                    >
                                                                        Chi tiết &rarr;
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tự chọn trong kỳ */}
                                    {electives.length > 0 && (
                                        <div className="space-y-3 pt-2">
                                            <h4 className="text-base font-serif-title text-brand-jasper font-bold flex items-center gap-2 border-b border-brand-jasper/20 pb-1">
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                                Học phần Tự chọn trong kỳ ({electives.length}) &bull; {electives.reduce((s, m) => s + Number(m.credits || 0), 0)} TC
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {electives.map(mod => {
                                                    const isSelected = !!mod.isSelected;

                                                    return (
                                                        <div
                                                            key={mod.id}
                                                            className={`p-4 relative transition-all duration-300 ${
                                                                isSelected
                                                                    ? 'bg-amber-50/80 border-2 border-brand-jasper shadow-editorial'
                                                                    : 'bg-white border border-brand-cerulean/30 hover:border-brand-cerulean hover:shadow-sm'
                                                            }`}
                                                        >
                                                            <div className="absolute top-0 right-0 bg-brand-cerulean text-white px-2 py-1 text-xs font-bold font-serif-title">
                                                                {mod.credits} TC
                                                            </div>

                                                            <div className="pr-12 space-y-2">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleToggleElectiveSelect(mod)}
                                                                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif-title font-bold rounded transition-colors ${
                                                                            isSelected
                                                                                ? 'bg-brand-jasper text-white shadow-sm'
                                                                                : 'bg-white border border-gray-400 text-gray-700 hover:border-brand-jasper hover:text-brand-jasper'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-white bg-white/20' : 'border-gray-400'}`}>
                                                                            {isSelected && <Check size={12} className="text-white" />}
                                                                        </div>
                                                                        <span>{isSelected ? 'Đã chọn học' : 'Chọn học'}</span>
                                                                    </button>
                                                                    <span className="text-xs font-sans font-bold text-gray-600">{(mod.code || '').toUpperCase()}</span>
                                                                    {isDaiHoc && (
                                                                        <select
                                                                            value={mod.semester || 'unassigned'}
                                                                            onChange={(e) => {
                                                                                e.stopPropagation();
                                                                                onUpdateModule({
                                                                                    ...mod,
                                                                                    semester: e.target.value
                                                                                });
                                                                            }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            title="Phân bổ / Chuyển học kỳ"
                                                                            className={`text-[11px] font-bold font-serif-title py-0.5 px-1.5 rounded border transition-colors cursor-pointer outline-none ${
                                                                                !mod.semester || mod.semester === 'unassigned'
                                                                                    ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 font-bold'
                                                                                    : 'bg-blue-50 text-brand-cerulean border-brand-cerulean/30 hover:border-brand-cerulean'
                                                                            }`}
                                                                        >
                                                                            <option value="unassigned">⚠️ Chưa xếp kỳ</option>
                                                                            <option value="1">Học kỳ 1</option>
                                                                            <option value="2">Học kỳ 2</option>
                                                                            <option value="3">Học kỳ 3</option>
                                                                            <option value="4">Học kỳ 4</option>
                                                                            <option value="5">Học kỳ 5</option>
                                                                            <option value="6">Học kỳ 6</option>
                                                                            <option value="7">Học kỳ 7</option>
                                                                            <option value="8">Học kỳ 8</option>
                                                                            <option value="summer">Kỳ hè</option>
                                                                        </select>
                                                                    )}
                                                                    {isDaiHoc && (
                                                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold font-serif-title rounded border border-gray-300">
                                                                            {mod.knowledgeBlock === 'general' || mod.category === 'general' ? 'Đại cương' :
                                                                             mod.knowledgeBlock === 'fundamental' || mod.category === 'fundamental' ? 'Cơ sở ngành' :
                                                                             mod.knowledgeBlock === 'specialized' || mod.category === 'specialized' ? 'Chuyên ngành' :
                                                                             mod.knowledgeBlock === 'internship' || mod.category === 'internship' ? 'TT & Khóa luận' : 'Khối khác'}
                                                                        </span>
                                                                    )}
                                                                    {mod.prerequisites && (
                                                                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-bold font-serif-title rounded border border-amber-300">
                                                                            Tiên quyết: {mod.prerequisites}
                                                                        </span>
                                                                    )}
                                                                    {mod.programIds && mod.programIds.length > 1 && (
                                                                        <span className="px-1.5 py-0.5 bg-blue-50/50 text-brand-cerulean/80 text-xs font-bold font-serif-title rounded border border-brand-cerulean/20 flex items-center gap-1">
                                                                            <Link2 size={10} /> Dùng chung
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <h4
                                                                    onClick={() => navigate('module_detail', { moduleId: mod.id, programId: program.id })}
                                                                    className={`text-xl font-serif-title leading-tight mt-1 mb-2 transition-colors cursor-pointer ${
                                                                        isSelected ? 'text-brand-jasper font-bold' : 'text-brand-cerulean hover:text-brand-jasper'
                                                                    }`}
                                                                >
                                                                    {formatModuleName(mod.name, profile?.teachingSubject || profile?.major)}
                                                                </h4>

                                                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                                                                    <span className="text-xs italic text-gray-500">
                                                                        Tự chọn &bull; {mod.status === 'completed' ? 'Đã hoàn thành' : mod.status === 'in_progress' ? 'Đang học' : 'Lên kế hoạch'}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            title="Sửa thông tin học phần"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEditingModule({ ...mod, code: (mod.code || '').toUpperCase() });
                                                                            }}
                                                                            className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 rounded transition-colors"
                                                                        >
                                                                            <Pencil size={15} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                navigate('module_detail', { moduleId: mod.id, programId: program.id });
                                                                            }}
                                                                            className="text-sm font-serif-title text-brand-jasper hover:underline font-bold flex items-center gap-1"
                                                                        >
                                                                            Chi tiết &rarr;
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )
            ) : (
                /* Render Modules: View Mode = Category */
                Object.keys(groupedModules).length === 0 ? (
                    <div className="p-12 border border-dashed border-brand-cerulean text-center bg-white">
                        <p className="text-xl font-serif-title text-gray-500">Chưa có học phần nào trong bộ lọc này.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(groupedModules).map(([category, mods]) => {
                            const mandatoryAndPractice = mods.filter(m => m.type !== 'elective');
                            const electives = mods.filter(m => m.type === 'elective');

                            // Check if any elective in this branch is currently selected
                            const selectedElectiveId = electives.find(m => m.isSelected)?.id;

                            return (
                                <section key={category} className="space-y-6 break-inside-avoid bg-white p-6 border-editorial shadow-editorial">
                                    <div className="flex justify-between items-center border-b border-brand-cerulean pb-3">
                                        <h3 className="text-2xl font-serif-title text-brand-cerulean uppercase tracking-wider">
                                            {getCategoryTitle(category)}
                                        </h3>
                                        <span className="text-xs font-serif-title text-gray-500 uppercase tracking-widest">
                                            {mods.length} Học phần &bull; {mods.reduce((s, m) => s + Number(m.credits || 0), 0)} TC
                                        </span>
                                    </div>

                                    {/* PART 1: BẮT BUỘC & THỰC HÀNH */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-serif-title text-brand-jasper font-bold flex items-center gap-2 border-b border-brand-jasper/20 pb-1">
                                            <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper"></span>
                                            I. Học phần Bắt buộc & Thực hành ({mandatoryAndPractice.length})
                                        </h4>
                                        {mandatoryAndPractice.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic py-2">Chưa có học phần bắt buộc/thực hành nào.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2">
                                                {mandatoryAndPractice.map(mod => (
                                                    <div
                                                        key={mod.id}
                                                        className="border border-brand-cerulean/30 p-4 bg-brand-cream/30 relative group shadow-sm hover:border-brand-cerulean hover:shadow-editorial transition-all"
                                                    >
                                                        <div className="absolute top-0 right-0 bg-brand-cerulean text-white px-2 py-1 text-xs font-bold">
                                                            {mod.credits} TC
                                                        </div>
                                                        <div className="pr-12">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <span className="text-sm font-sans font-bold text-gray-500">{(mod.code || '').toUpperCase()}</span>
                                                                {isDaiHoc && (
                                                                    <select
                                                                        value={mod.semester || 'unassigned'}
                                                                        onChange={(e) => {
                                                                            e.stopPropagation();
                                                                            onUpdateModule({
                                                                                ...mod,
                                                                                semester: e.target.value
                                                                            });
                                                                        }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        title="Phân bổ / Chuyển học kỳ"
                                                                        className={`text-[11px] font-bold font-serif-title py-0.5 px-1.5 rounded border transition-colors cursor-pointer outline-none ${
                                                                            !mod.semester || mod.semester === 'unassigned'
                                                                                ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 font-bold'
                                                                                : 'bg-blue-50 text-brand-cerulean border-brand-cerulean/30 hover:border-brand-cerulean'
                                                                        }`}
                                                                    >
                                                                        <option value="unassigned">⚠️ Chưa xếp kỳ</option>
                                                                        <option value="1">Học kỳ 1</option>
                                                                        <option value="2">Học kỳ 2</option>
                                                                        <option value="3">Học kỳ 3</option>
                                                                        <option value="4">Học kỳ 4</option>
                                                                        <option value="5">Học kỳ 5</option>
                                                                        <option value="6">Học kỳ 6</option>
                                                                        <option value="7">Học kỳ 7</option>
                                                                        <option value="8">Học kỳ 8</option>
                                                                        <option value="summer">Kỳ hè</option>
                                                                    </select>
                                                                )}
                                                                {mod.prerequisites && (
                                                                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-bold font-serif-title rounded border border-amber-300">
                                                                        Tiên quyết: {mod.prerequisites}
                                                                    </span>
                                                                )}
                                                                {mod.programIds && mod.programIds.length > 1 && (
                                                                    <span className="px-1.5 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[10px] font-bold font-serif-title rounded border border-brand-cerulean/20 flex items-center gap-1">
                                                                        <Link2 size={10} /> Dùng chung ({mod.programIds.length} CT)
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4
                                                                onClick={() => navigate('module_detail', { moduleId: mod.id, programId: program.id })}
                                                                className="text-xl font-serif-title text-brand-cerulean leading-tight mb-2 group-hover:text-brand-jasper transition-colors cursor-pointer"
                                                            >
                                                                {formatModuleName(mod.name, profile?.teachingSubject || profile?.major)}
                                                            </h4>
                                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                                                                <span className="text-xs italic text-gray-500">
                                                                    {mod.type === 'mandatory' ? 'Bắt buộc' : 'Thực hành'} &bull; {mod.status === 'completed' ? 'Đã hoàn thành' : mod.status === 'in_progress' ? 'Đang học' : 'Lên kế hoạch'}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        title="Sửa thông tin học phần"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingModule({ ...mod, code: (mod.code || '').toUpperCase() });
                                                                        }}
                                                                        className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 rounded transition-colors"
                                                                    >
                                                                        <Pencil size={15} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigate('module_detail', { moduleId: mod.id, programId: program.id });
                                                                        }}
                                                                        className="text-sm font-serif-title text-brand-jasper hover:underline font-bold flex items-center gap-1"
                                                                    >
                                                                        Chi tiết &rarr;
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* PART 2: TỰ CHỌN */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-center border-b border-brand-jasper/20 pb-1">
                                            <h4 className="text-lg font-serif-title text-brand-jasper font-bold flex items-center gap-2 border-b border-brand-jasper/20 pb-1">
                                                <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper"></span>
                                                II. Học phần Tự chọn ({electives.length})
                                            </h4>
                                            {selectedElectiveId && (
                                                <span className="text-xs bg-brand-jasper text-white font-serif-title font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                                                    ✓ Đã đăng ký môn tự chọn
                                                </span>
                                            )}
                                        </div>

                                        {electives.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic py-2">Chưa có học phần tự chọn nào trong khối này.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2">
                                                {electives.map(mod => {
                                                    const isSelected = !!mod.isSelected;
                                                    const isDimmed = !isDaiHoc && selectedElectiveId && !isSelected;

                                                    return (
                                                        <div
                                                            key={mod.id}
                                                            className={`p-4 relative transition-all duration-300 ${
                                                                isSelected
                                                                    ? 'bg-amber-50/80 border-2 border-brand-jasper shadow-editorial'
                                                                    : isDimmed
                                                                    ? 'bg-gray-100/60 border border-dashed border-gray-300 opacity-45 grayscale hover:opacity-80'
                                                                    : 'bg-white border border-brand-cerulean/30 hover:border-brand-cerulean hover:shadow-sm'
                                                            }`}
                                                        >
                                                            <div className="absolute top-0 right-0 bg-brand-cerulean text-white px-2 py-1 text-xs font-bold">
                                                                {mod.credits} TC
                                                            </div>

                                                            <div className="pr-12 space-y-2">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleToggleElectiveSelect(mod)}
                                                                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif-title font-bold rounded transition-colors ${
                                                                            isSelected
                                                                                ? 'bg-brand-jasper text-white shadow-sm'
                                                                                : 'bg-white border border-gray-400 text-gray-700 hover:border-brand-jasper hover:text-brand-jasper'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-white bg-white/20' : 'border-gray-400'}`}>
                                                                            {isSelected && <Check size={12} className="text-white" />}
                                                                        </div>
                                                                        <span>{isSelected ? 'Đã chọn học' : 'Chọn học'}</span>
                                                                    </button>
                                                                    <span className="text-xs font-sans font-bold text-gray-500">{(mod.code || '').toUpperCase()}</span>
                                                                    {isDaiHoc && (
                                                                        <select
                                                                            value={mod.semester || 'unassigned'}
                                                                            onChange={(e) => {
                                                                                e.stopPropagation();
                                                                                onUpdateModule({
                                                                                    ...mod,
                                                                                    semester: e.target.value
                                                                                });
                                                                            }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            title="Phân bổ / Chuyển học kỳ"
                                                                            className={`text-[11px] font-bold font-serif-title py-0.5 px-1.5 rounded border transition-colors cursor-pointer outline-none ${
                                                                                !mod.semester || mod.semester === 'unassigned'
                                                                                    ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 font-bold'
                                                                                    : 'bg-blue-50 text-brand-cerulean border-brand-cerulean/30 hover:border-brand-cerulean'
                                                                            }`}
                                                                        >
                                                                            <option value="unassigned">⚠️ Chưa xếp kỳ</option>
                                                                            <option value="1">Học kỳ 1</option>
                                                                            <option value="2">Học kỳ 2</option>
                                                                            <option value="3">Học kỳ 3</option>
                                                                            <option value="4">Học kỳ 4</option>
                                                                            <option value="5">Học kỳ 5</option>
                                                                            <option value="6">Học kỳ 6</option>
                                                                            <option value="7">Học kỳ 7</option>
                                                                            <option value="8">Học kỳ 8</option>
                                                                            <option value="summer">Kỳ hè</option>
                                                                        </select>
                                                                    )}
                                                                    {mod.prerequisites && (
                                                                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-bold font-serif-title rounded border border-amber-300">
                                                                            Tiên quyết: {mod.prerequisites}
                                                                        </span>
                                                                    )}
                                                                    {mod.programIds && mod.programIds.length > 1 && (
                                                                        <span className="px-1.5 py-0.5 bg-blue-50/50 text-brand-cerulean/80 text-xs font-bold font-serif-title rounded border border-brand-cerulean/20 flex items-center gap-1">
                                                                            <Link2 size={10} /> Dùng chung
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <h4
                                                                    onClick={() => navigate('module_detail', { moduleId: mod.id, programId: program.id })}
                                                                    className={`text-xl font-serif-title leading-tight mt-1 mb-2 transition-colors cursor-pointer ${
                                                                        isSelected ? 'text-brand-jasper font-bold' : 'text-brand-cerulean hover:text-brand-jasper'
                                                                    }`}
                                                                >
                                                                    {formatModuleName(mod.name, profile?.teachingSubject || profile?.major)}
                                                                </h4>

                                                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                                                                    <span className="text-xs italic text-gray-500">
                                                                        Tự chọn &bull; {mod.status === 'completed' ? 'Đã hoàn thành' : mod.status === 'in_progress' ? 'Đang học' : 'Lên kế hoạch'}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            title="Sửa thông tin học phần"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEditingModule({ ...mod, code: (mod.code || '').toUpperCase() });
                                                                            }}
                                                                            className="p-1.5 text-brand-cerulean hover:text-brand-jasper hover:bg-brand-cerulean/10 rounded transition-colors"
                                                                        >
                                                                            <Pencil size={15} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                navigate('module_detail', { moduleId: mod.id, programId: program.id });
                                                                            }}
                                                                            className="text-sm font-serif-title text-brand-jasper hover:underline font-bold flex items-center gap-1"
                                                                        >
                                                                            Chi tiết &rarr;
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )
            )}

            {/* Modal Thêm Học Phần — 3 Tab: Tạo từng môn / Nhập nhanh danh sách / Liên kết */}
            <Modal isOpen={isModuleModalOpen} onClose={() => { setIsModuleModalOpen(false); setModalTab('create'); setLinkSearch(''); setBatchText(''); }} title="Thêm Học phần">
                {/* Tab Switcher */}
                <div className="flex border-b border-brand-cerulean/30 mb-6 -mt-2 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setModalTab('create')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-serif-title font-bold transition-colors border-b-2 whitespace-nowrap ${
                            modalTab === 'create'
                                ? 'border-brand-cerulean text-brand-cerulean'
                                : 'border-transparent text-gray-500 hover:text-brand-cerulean'
                        }`}
                    >
                        <Plus size={16} /> Tạo từng môn
                    </button>
                    <button
                        type="button"
                        onClick={() => setModalTab('batch')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-serif-title font-bold transition-colors border-b-2 whitespace-nowrap ${
                            modalTab === 'batch'
                                ? 'border-brand-cerulean text-brand-cerulean'
                                : 'border-transparent text-gray-500 hover:text-brand-cerulean'
                        }`}
                    >
                        <FileText size={16} /> Nhập nhanh danh sách {parsedBatchModules.length > 0 ? `(${parsedBatchModules.length})` : ''}
                    </button>
                    <button
                        type="button"
                        onClick={() => setModalTab('link')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-serif-title font-bold transition-colors border-b-2 whitespace-nowrap ${
                            modalTab === 'link'
                                ? 'border-brand-cerulean text-brand-cerulean'
                                : 'border-transparent text-gray-500 hover:text-brand-cerulean'
                        }`}
                    >
                        <Link2 size={16} /> Liên kết từ CT khác
                    </button>
                </div>

                {/* Tab Content: Create New */}
                {modalTab === 'create' && (
                    <form onSubmit={handleCreateModule} className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mã môn</label>
                                <input required type="text" className="input-editorial w-full uppercase" value={modForm.code} onChange={e => setModForm({ ...modForm, code: e.target.value.toUpperCase() })} placeholder={isDaiHoc ? "VD: MTH101" : "VD: A01"} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên học phần</label>
                                <input required type="text" className="input-editorial w-full" value={modForm.name} onChange={e => setModForm({ ...modForm, name: e.target.value })} placeholder="Giải tích 1, Triết học..." />
                            </div>
                        </div>

                        {/* Duplicate Alert in Current Program */}
                        {duplicateInCurrentProgram && (
                            <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-sm flex items-start gap-2.5 text-amber-900 animate-fade-in-down shadow-sm">
                                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-xs space-y-1 flex-1">
                                    <p className="font-serif-title font-bold text-amber-950 text-sm flex items-center gap-1.5">
                                        Đã có học phần này trong chương trình!
                                    </p>
                                    <p className="text-amber-900">
                                        Đã có học phần <span className="font-bold font-sans">[{duplicateInCurrentProgram.code}] {duplicateInCurrentProgram.name}</span> ({duplicateInCurrentProgram.credits} TC{duplicateInCurrentProgram.semester ? `, Học kỳ ${duplicateInCurrentProgram.semester}` : ''}) trong CTĐT hiện tại.
                                    </p>
                                    <p className="text-amber-800/80 italic text-[11px]">
                                        Vui lòng kiểm tra lại mã môn hoặc tên học phần để tránh bị tạo trùng lặp.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Duplicate Found in Other Programs -> Link Suggestion */}
                        {duplicateInOtherPrograms && (
                            <div className="p-3.5 bg-blue-50 border-2 border-brand-cerulean/40 rounded-sm flex items-start gap-2.5 text-brand-cerulean animate-fade-in-down shadow-sm">
                                <Info size={18} className="text-brand-cerulean shrink-0 mt-0.5" />
                                <div className="text-xs space-y-1.5 flex-1">
                                    <p className="font-serif-title font-bold text-brand-cerulean text-sm">
                                        Tìm thấy học phần tương tự ở chương trình khác!
                                    </p>
                                    <p className="text-gray-700">
                                        Học phần <span className="font-bold font-sans">[{duplicateInOtherPrograms.code}] {duplicateInOtherPrograms.name}</span> ({duplicateInOtherPrograms.credits} TC) đã có trong hệ thống (thuộc {getModuleProgramNames(duplicateInOtherPrograms, programs).join(', ') || 'CT khác'}).
                                    </p>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => handleLinkExistingModule(duplicateInOtherPrograms)}
                                            className="px-3 py-1.5 bg-brand-cerulean text-white font-serif-title font-bold text-xs hover:bg-brand-cerulean/90 shadow-sm flex items-center gap-1.5 transition-colors"
                                        >
                                            <Link2 size={13} /> Dùng chung học phần này ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}



                        {modForm.category === 'B' && !isDaiHoc && (
                            <div className="p-3 bg-blue-50/80 border border-brand-cerulean/30 rounded space-y-2">
                                <label className="block text-xs font-serif-title font-bold text-brand-cerulean">
                                    Mẫu học phần chuẩn Nhánh B {profile?.teachingSubject ? `(Áp dụng môn: ${profile.teachingSubject})` : ''}:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { code: 'B01', name: `Phương pháp dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THCS`, credits: 2, type: 'mandatory' },
                                        { code: 'B02', name: `Xây dựng kế hoạch dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THCS`, credits: 2, type: 'mandatory' },
                                        { code: 'B03', name: `Tổ chức dạy học [${profile?.teachingSubject || 'Môn học'}] ở trường THCS`, credits: 2, type: 'mandatory' },
                                        { code: 'B04', name: `Thực hành dạy học [${profile?.teachingSubject || 'Môn học'}] cấp THCS ở trường sư phạm`, credits: 3, type: 'mandatory' },
                                        { code: 'B05', name: 'Thực hành kỹ năng giáo dục ở trường THCS', credits: 2, type: 'practice' },
                                        { code: 'B06', name: 'Thực tập sư phạm 1 ở trường THCS', credits: 2, type: 'practice' },
                                        { code: 'B07', name: 'Thực tập sư phạm 2 ở trường THCS', credits: 2, type: 'practice' },
                                    ].map(tpl => (
                                        <button
                                            key={tpl.code}
                                            type="button"
                                            onClick={() => {
                                                const formattedName = formatModuleName(tpl.name, profile?.teachingSubject || profile?.major);
                                                setModForm({
                                                    ...modForm,
                                                    code: tpl.code,
                                                    name: formattedName,
                                                    credits: tpl.credits,
                                                    type: tpl.type,
                                                    category: 'B'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-xs bg-white border border-brand-cerulean/40 hover:border-brand-cerulean hover:bg-blue-100/80 text-brand-cerulean font-bold transition-all rounded shadow-xs"
                                        >
                                            + Mẫu {tpl.code} ({tpl.credits} TC)
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Số Tín chỉ</label>
                                <input required type="number" min="1" className="input-editorial w-full" value={modForm.credits} onChange={e => setModForm({ ...modForm, credits: e.target.value })} />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Phân loại"
                                    value={modForm.type}
                                    onChange={val => setModForm({ ...modForm, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label={isDaiHoc ? "Khối kiến thức" : "Nhánh"}
                                    value={modForm.category}
                                    onChange={val => {
                                        const autoCode = generateNextModuleCode(val, programModules);
                                        setModForm({ ...modForm, category: val, knowledgeBlock: val, code: autoCode });
                                    }}
                                    options={categoryFormOptions}
                                />
                            </div>
                        </div>

                        {isDaiHoc && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <EditorialSelect
                                        label="Học kỳ đề xuất"
                                        value={modForm.semester || '1'}
                                        onChange={val => setModForm({ ...modForm, semester: val })}
                                        options={semesterOptions}
                                    />
                                </div>
                                <div>
                                    <EditorialSelect
                                        label="Học phần tiên quyết (nếu có)"
                                        value={modForm.prerequisites || ''}
                                        onChange={val => setModForm({ ...modForm, prerequisites: Array.isArray(val) ? val.join(', ') : val })}
                                        options={prerequisiteOptions}
                                        placeholder="Không có (hoặc chọn học phần...)"
                                        isMulti={true}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                            <button type="button" onClick={() => setIsModuleModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                            <button type="submit" className="px-6 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover">Lưu Học phần</button>
                        </div>
                    </form>
                )}

                {/* Tab Content: Batch List Input */}
                {modalTab === 'batch' && (
                    <form onSubmit={handleSaveBatchModules} className="space-y-5">
                        <div className="p-3.5 bg-blue-50/70 border border-brand-cerulean/30 rounded text-xs space-y-1 text-brand-cerulean">
                            <p className="font-serif-title font-bold text-sm">💡 Nhập danh sách học phần hàng loạt (Xếp học kỳ sau)</p>
                            <p className="text-gray-700">
                                Nhập hoặc dán danh sách tên học phần (mỗi dòng một môn). Hệ thống sẽ tự động gán mã môn, số tín chỉ và đặt trạng thái <strong>Chưa xếp học kỳ</strong> để bạn phân bổ sau.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <EditorialSelect
                                    label={isDaiHoc ? "Khối kiến thức mặc định" : "Nhánh"}
                                    value={batchDefaults.category}
                                    onChange={val => setBatchDefaults({ ...batchDefaults, category: val })}
                                    options={categoryFormOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Phân loại mặc định"
                                    value={batchDefaults.type}
                                    onChange={val => setBatchDefaults({ ...batchDefaults, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Số TC mặc định</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="input-editorial w-full"
                                    value={batchDefaults.credits}
                                    onChange={e => setBatchDefaults({ ...batchDefaults, credits: Number(e.target.value) || 1 })}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-serif-title text-brand-cerulean font-bold">
                                    Danh sách học phần (Mỗi dòng 1 môn)
                                </label>
                                <span className="text-xs text-gray-500 font-sans">
                                    {parsedBatchModules.length} học phần được nhận diện
                                </span>
                            </div>
                            <textarea
                                rows="6"
                                className="input-editorial w-full font-mono text-sm leading-relaxed p-3 border border-brand-cerulean/30 focus:border-brand-cerulean bg-white"
                                placeholder={`Ví dụ:\nTriết học Mác - Lênin (3 TC)\nKinh tế chính trị Mác - Lênin\nChủ nghĩa xã hội khoa học\nLịch sử Đảng Cộng sản Việt Nam\nTư tưởng Hồ Chí Minh\nNgoại ngữ 1 (3 TC)`}
                                value={batchText}
                                onChange={e => setBatchText(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* Live Preview List */}
                        {parsedBatchModules.length > 0 && (
                            <div className="space-y-2">
                                <h5 className="text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wide">
                                    Xem trước kết quả nhập ({parsedBatchModules.length} môn):
                                </h5>
                                <div className="max-h-48 overflow-y-auto border border-gray-200 bg-white divide-y divide-gray-100 text-xs">
                                    {parsedBatchModules.map((m, idx) => (
                                        <div key={idx} className="p-2.5 flex items-center justify-between gap-3 hover:bg-blue-50/30">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-bold text-gray-400 w-5 text-right">{idx + 1}.</span>
                                                <span className="font-bold font-sans bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px]">
                                                    {m.code}
                                                </span>
                                                <span className="font-serif-title text-brand-cerulean font-bold truncate">
                                                    {m.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-bold text-[10px]">
                                                    {m.credits} TC
                                                </span>
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                                                    {m.type === 'mandatory' ? 'Bắt buộc' : m.type === 'practice' ? 'Thực hành' : 'Tự chọn'}
                                                </span>
                                                <span className="px-1.5 py-0.5 bg-amber-100/70 text-amber-900 rounded text-[10px] font-bold">
                                                    Chưa xếp kỳ
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-between items-center border-t border-brand-cerulean/20">
                            <button
                                type="button"
                                onClick={() => { setIsModuleModalOpen(false); setBatchText(''); }}
                                className="px-6 py-2 text-gray-500 font-serif-title"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={parsedBatchModules.length === 0}
                                className={`px-6 py-2 font-serif-title font-bold shadow-editorial transition-all flex items-center gap-2 ${
                                    parsedBatchModules.length > 0
                                        ? 'bg-brand-cerulean text-brand-cream hover:bg-brand-cerulean/90'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <Plus size={16} /> Lưu danh sách ({parsedBatchModules.length} học phần)
                            </button>
                        </div>
                    </form>
                )}

                {/* Tab Content: Link Existing Module */}
                {modalTab === 'link' && (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="input-editorial w-full pl-10 text-base"
                                placeholder="Tìm học phần theo tên hoặc mã môn..."
                                value={linkSearch}
                                onChange={e => setLinkSearch(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {linkableModules.length === 0 ? (
                            <div className="p-8 text-center border border-dashed border-gray-300">
                                <p className="text-gray-500 font-serif-title">Không có học phần nào từ chương trình khác để liên kết.</p>
                                <p className="text-xs text-gray-400 mt-1">Tất cả học phần đã thuộc chương trình này, hoặc chưa có học phần nào ở chương trình khác.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                                {linkableModules.map(mod => {
                                    const belongsTo = getModuleProgramNames(mod, programs);
                                    return (
                                        <div key={mod.id} className="flex items-center justify-between p-3 border border-gray-200 bg-white hover:border-brand-cerulean/30 transition-all group">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold font-sans text-gray-500">{(mod.code || '').toUpperCase()}</span>
                                                    <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 font-bold">{mod.credits} TC</span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5">
                                                        {mod.type === 'mandatory' ? 'Bắt buộc' : mod.type === 'practice' ? 'Thực hành' : 'Tự chọn'}
                                                    </span>
                                                </div>
                                                <h5 className="text-base font-serif-title text-brand-cerulean font-bold mt-0.5 truncate">{mod.name}</h5>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Hiện thuộc: {belongsTo.join(', ') || 'Không xác định'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleLinkExistingModule(mod)}
                                                className="ml-3 px-4 py-2 bg-brand-cerulean text-brand-cream text-xs font-serif-title font-bold hover:bg-brand-cerulean/80 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                                            >
                                                <Link2 size={14} /> Liên kết
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="pt-3 flex justify-end border-t border-brand-cerulean/20">
                            <button type="button" onClick={() => { setIsModuleModalOpen(false); setLinkSearch(''); }} className="px-6 py-2 text-gray-500 font-serif-title">Đóng</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Chỉnh Sửa Học Phần */}
            <Modal isOpen={!!editingModule} onClose={() => setEditingModule(null)} title="Chỉnh sửa thông tin Học phần">
                {editingModule && (
                    <form onSubmit={handleSaveEditModule} className="space-y-6">
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

                        {/* Duplicate Alert in Edit Modal */}
                        {duplicateInEdit && (
                            <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-sm flex items-start gap-2.5 text-amber-900 animate-fade-in-down shadow-sm">
                                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-xs space-y-0.5 flex-1">
                                    <p className="font-serif-title font-bold text-amber-950 text-sm">
                                        Cảnh báo trùng với học phần khác!
                                    </p>
                                    <p className="text-amber-900">
                                        Mã môn hoặc tên học phần đang trùng với <span className="font-bold font-sans">[{duplicateInEdit.code}] {duplicateInEdit.name}</span> trong cùng chương trình đào tạo.
                                    </p>
                                </div>
                            </div>
                        )}

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
                                    value={editingModule.type || 'mandatory'}
                                    onChange={val => setEditingModule({ ...editingModule, type: val })}
                                    options={moduleTypeOptions}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label={isDaiHoc ? "Khối kiến thức" : "Nhánh"}
                                    value={editingModule.category || (isDaiHoc ? 'general' : 'A')}
                                    onChange={val => setEditingModule({ ...editingModule, category: val, knowledgeBlock: val })}
                                    options={categoryFormOptions}
                                />
                            </div>
                        </div>

                        {isDaiHoc && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <EditorialSelect
                                        label="Học kỳ đề xuất"
                                        value={editingModule.semester || '1'}
                                        onChange={val => setEditingModule({ ...editingModule, semester: val })}
                                        options={semesterOptions}
                                    />
                                </div>
                                <div>
                                    <EditorialSelect
                                        label="Học phần tiên quyết (nếu có)"
                                        value={editingModule.prerequisites || ''}
                                        onChange={val => setEditingModule({ ...editingModule, prerequisites: Array.isArray(val) ? val.join(', ') : val })}
                                        options={editingPrerequisiteOptions}
                                        placeholder="Không có (hoặc chọn học phần...)"
                                        isMulti={true}
                                    />
                                </div>
                            </div>
                        )}

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
                                onClick={handleDeleteModuleClick}
                                className="flex items-center gap-1 px-4 py-2 text-brand-jasper hover:bg-red-50 border border-brand-jasper/30 font-serif-title transition-colors"
                            >
                                <Trash2 size={16} /> Xóa học phần
                            </button>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingModule(null)}
                                    className="px-6 py-2 text-gray-500 font-serif-title"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-brand-cerulean text-brand-cream font-serif-title shadow-editorial hover:shadow-editorial-hover transition-all"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal Chỉnh Sửa Chương Trình Đào Tạo */}
            <Modal isOpen={isProgramEditModalOpen} onClose={() => setIsProgramEditModalOpen(false)} title="Chỉnh sửa Chương trình Đào tạo">
                {programFormData && (
                    <form onSubmit={handleSaveProgramEdit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên chương trình</label>
                            <input
                                required
                                type="text"
                                className="input-editorial w-full"
                                value={programFormData.name || ''}
                                onChange={e => setProgramFormData({ ...programFormData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Mô tả mục tiêu</label>
                            <textarea
                                className="input-editorial w-full resize-none"
                                rows="2"
                                value={programFormData.description || ''}
                                onChange={e => setProgramFormData({ ...programFormData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="border p-4 bg-brand-cream border-brand-cerulean/20 space-y-4">
                            <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-1">
                                <h4 className="font-serif-title text-brand-cerulean text-lg">
                                    {isDaiHoc
                                        ? 'Cơ cấu số tín chỉ các khối có trong CTĐT'
                                        : program.evaluationType === 'modules'
                                            ? 'Cơ cấu chuyên đề có trong CTĐT'
                                            : program.evaluationType === 'hours'
                                                ? 'Cơ cấu thời lượng tiết học trong CTĐT'
                                                : 'Cơ cấu tín chỉ các khối có trong CTĐT'}
                                </h4>
                                <span className="text-[11px] text-gray-500 font-sans italic">
                                    * Điền số lượng mở trong chương trình
                                </span>
                            </div>
                            {isDaiHoc ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">GD Đại cương (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.general ?? 28}
                                            onChange={e => handleUpdateProgramFormDataRule('general', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Cơ sở ngành BB (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.fundamentalMandatory ?? programFormData.rules?.fundamental ?? 26}
                                            onChange={e => handleUpdateProgramFormDataRule('fundamentalMandatory', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Cơ sở ngành TC (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.fundamentalElective ?? 8}
                                            onChange={e => handleUpdateProgramFormDataRule('fundamentalElective', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên ngành BB (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.specializedMandatory ?? 42}
                                            onChange={e => handleUpdateProgramFormDataRule('specializedMandatory', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Chuyên ngành TC (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.specializedElective ?? 16}
                                            onChange={e => handleUpdateProgramFormDataRule('specializedElective', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Thực tập & Khóa luận (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.internshipGraduation ?? 15}
                                            onChange={e => handleUpdateProgramFormDataRule('internshipGraduation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Bắt buộc (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.mandatoryA ?? 0}
                                            onChange={e => handleUpdateProgramFormDataRule('mandatoryA', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Khối A Tự chọn (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.electiveA ?? 0}
                                            onChange={e => handleUpdateProgramFormDataRule('electiveA', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Bắt buộc (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.mandatoryB ?? 0}
                                            onChange={e => handleUpdateProgramFormDataRule('mandatoryB', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Thực hành (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.practiceB ?? 0}
                                            onChange={e => handleUpdateProgramFormDataRule('practiceB', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Khối B Tự chọn (TC)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-editorial w-full"
                                            value={programFormData.rules?.electiveB ?? 0}
                                            onChange={e => handleUpdateProgramFormDataRule('electiveB', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Summary & Graduation Target Requirement */}
                            {(() => {
                                const editProgramTotalCredits = isDaiHoc
                                    ? ((programFormData.rules?.general ?? 0) +
                                       (programFormData.rules?.fundamentalMandatory ?? programFormData.rules?.fundamental ?? 0) +
                                       (programFormData.rules?.fundamentalElective ?? 0) +
                                       (programFormData.rules?.specializedMandatory ?? 0) +
                                       (programFormData.rules?.specializedElective ?? 0) +
                                       (programFormData.rules?.internshipGraduation ?? 0))
                                    : ((programFormData.rules?.mandatoryA ?? 0) +
                                       (programFormData.rules?.electiveA ?? 0) +
                                       (programFormData.rules?.mandatoryB ?? 0) +
                                       (programFormData.rules?.practiceB ?? 0) +
                                       (programFormData.rules?.electiveB ?? 0));

                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-brand-cerulean/20">
                                        <div className="p-3.5 bg-blue-50/70 border border-brand-cerulean/25 rounded space-y-1">
                                            <div className="text-xs font-bold text-gray-700">
                                                Tổng số {program.evaluationType === 'modules' ? 'chuyên đề' : program.evaluationType === 'hours' ? 'tiết học' : 'TC'} có trong CTĐT (Tự động cộng)
                                            </div>
                                            <div className="text-2xl font-serif-title font-bold text-brand-cerulean flex items-baseline gap-1.5">
                                                <span>{editProgramTotalCredits}</span>
                                                <span className="text-xs font-sans text-gray-500 font-normal">
                                                    {program.evaluationType === 'modules' ? 'chuyên đề mở' : program.evaluationType === 'hours' ? 'tiết' : 'tín chỉ mở'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-gray-500 italic">Tổng số lượng có trong toàn bộ danh mục chương trình đào tạo</p>
                                        </div>
                                        <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded space-y-1">
                                            <label className="block text-xs font-bold text-brand-jasper">
                                                Số {program.evaluationType === 'modules' ? 'chuyên đề' : program.evaluationType === 'hours' ? 'tiết' : 'tín chỉ'} cần học để tốt nghiệp (Định mức) *
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    className="input-editorial w-full font-bold text-brand-jasper bg-white text-lg"
                                                    value={programFormData.totalCreditsRequired ?? 135}
                                                    onChange={e => setProgramFormData({ ...programFormData, totalCreditsRequired: Number(e.target.value) })}
                                                    placeholder={isDaiHoc ? "VD: 135" : "VD: 34"}
                                                />
                                                <span className="text-xs font-bold font-serif-title text-brand-jasper shrink-0">
                                                    {program.evaluationType === 'modules' ? 'Chuyên đề' : program.evaluationType === 'hours' ? 'Tiết' : 'TC'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-brand-jasper/80 italic">Số tín chỉ thực tế sinh viên phải tích lũy để được xét tốt nghiệp</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                            <button type="button" onClick={() => setIsProgramEditModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                            <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">Cập nhật Chương Trình</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};
