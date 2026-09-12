import React, { useState, useMemo } from 'react';
import { Award, BookOpen, AlertCircle, Check, Search, RotateCcw, X, Filter, CheckSquare, Square } from 'lucide-react';
import { EditorialSelect } from '../../components/common/EditorialWidgets';
import { CollapsiblePageHeader } from '../../components/common/CollapsiblePageHeader';
import { normalizeProgram, getFilteredModules, getModuleProgramNames, isModuleInProgram, getProgramStatus, getProgramStatusLabel, getSelectedModules } from "../../utils/ruleValidators";
import { calculateModuleFinal, calculateOverallGPA } from "../../utils/gpaCalculators";

export const GradebookView = ({ modules = [], programs = [], onUpdateModule }) => {
    const [programStatusFilter, setProgramStatusFilter] = useState('all'); // 'all' | 'dang_hoc' | 'da_hoc' | 'chua_hoc'
    const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [gradeStatusFilter, setGradeStatusFilter] = useState('all'); // 'all' | 'passed' | 'failed' | 'graded' | 'ungraded'
    const [searchQuery, setSearchQuery] = useState('');
    const [onlySelectedFilter, setOnlySelectedFilter] = useState(true);

    const normalizedPrograms = programs.map(normalizeProgram);

    // Lọc danh sách chương trình theo trạng thái CTĐT
    const programsMatchingStatus = useMemo(() => {
        if (programStatusFilter === 'all') return normalizedPrograms;
        return normalizedPrograms.filter(p => p.status === programStatusFilter);
    }, [normalizedPrograms, programStatusFilter]);

    const currentProg = selectedProgramFilter !== 'all' ? normalizedPrograms.find(p => p.id === selectedProgramFilter) : null;
    const evalType = currentProg?.evaluationType || 'credits';

    // Tùy chọn trạng thái CTĐT
    const programStatusOptions = [
        { label: 'Tất cả trạng thái CTĐT', value: 'all' },
        { label: 'CTĐT Đang học', value: 'dang_hoc' },
        { label: 'CTĐT Đã học (Hoàn thành)', value: 'da_hoc' },
        { label: 'CTĐT Chưa học (Kế hoạch)', value: 'chua_hoc' }
    ];

    // Tùy chọn chương trình đào tạo
    const programOptions = [
        { label: `Tất cả chương trình ${programStatusFilter !== 'all' ? `(${getProgramStatusLabel(programStatusFilter)})` : ''}`, value: 'all' },
        ...programsMatchingStatus.map(p => ({
            label: `${p.name} [${getProgramStatusLabel(p.status)}]`,
            value: p.id
        }))
    ];

    // Danh sách học phần nền theo CTĐT và trạng thái CTĐT (Mặc định chỉ lấy các học phần đã được chọn học)
    const baseModules = useMemo(() => {
        let list = [];
        if (selectedProgramFilter !== 'all') {
            list = (modules || []).filter(m => isModuleInProgram(m, selectedProgramFilter));
        } else {
            const targetProgramIds = programsMatchingStatus
                .filter(p => programStatusFilter !== 'all' ? true : p.status !== 'chua_hoc')
                .map(p => p.id);
            list = (modules || []).filter(m => targetProgramIds.some(pId => isModuleInProgram(m, pId)));
        }

        // Khử trùng lặp môn dùng chung
        const seen = new Set();
        let deduplicated = list.filter(m => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });

        // Chỉ hiển thị các học phần đã chọn học (mặc định: true)
        // 1. Không bị đánh dấu huỷ chọn (m.isEnrolled !== false)
        // 2. Môn tự chọn (type === 'elective') phải có isSelected === true hoặc đã có điểm / đang học / hoàn thành
        if (onlySelectedFilter) {
            deduplicated = deduplicated.filter(m => {
                if (m.isEnrolled === false) return false;
                if (m.type === 'elective') {
                    const hasGrades = m.grades && (Number(m.grades.final) > 0 || Number(m.grades.midterm) > 0 || Number(m.grades.attendance) > 0);
                    const isFinishedOrActive = m.status === 'in_progress' || m.status === 'completed';
                    return !!m.isSelected || hasGrades || isFinishedOrActive;
                }
                return true;
            });
        }

        return deduplicated;
    }, [modules, selectedProgramFilter, programsMatchingStatus, programStatusFilter, onlySelectedFilter]);

    // Trích xuất danh sách học kỳ có trong danh mục học phần
    const availableSemesters = useMemo(() => {
        const sems = new Set();
        baseModules.forEach(m => {
            if (m.semester !== undefined && m.semester !== null && m.semester !== '') {
                sems.add(String(m.semester));
            }
        });
        return Array.from(sems).sort((a, b) => {
            if (a === 'unassigned') return 1;
            if (b === 'unassigned') return -1;
            if (a === 'summer') return 1;
            if (b === 'summer') return -1;
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        });
    }, [baseModules]);

    const semesterOptions = [
        { label: 'Tất cả học kỳ', value: 'all' },
        ...availableSemesters.map(sem => ({
            label: sem === 'unassigned' ? 'Chưa phân kỳ' : sem === 'summer' ? 'Học kỳ hè' : `Học kỳ ${sem}`,
            value: sem
        }))
    ];

    const categoryOptions = [
        { label: 'Tất cả khối & loại môn', value: 'all' },
        { label: 'Khối GD Đại cương', value: 'cat_general' },
        { label: 'Khối Cơ sở ngành', value: 'cat_fundamental' },
        { label: 'Khối Chuyên ngành', value: 'cat_specialized' },
        { label: 'Khối Thực tập & Khóa luận', value: 'cat_internship' },
        { label: 'Khối A (Nghiệp vụ SP)', value: 'cat_A' },
        { label: 'Khối B (Bồi dưỡng CDNN)', value: 'cat_B' },
        { label: 'Môn Bắt buộc', value: 'type_mandatory' },
        { label: 'Môn Tự chọn', value: 'type_elective' },
        { label: 'Môn Thực hành', value: 'type_practice' }
    ];

    const gradeStatusOptions = [
        { label: 'Tất cả kết quả', value: 'all' },
        { label: 'Đã đạt kết quả (Điểm ≥ 5.0)', value: 'passed' },
        { label: 'Chưa đạt / Cần học lại (< 5.0)', value: 'failed' },
        { label: 'Đã có điểm đánh giá', value: 'graded' },
        { label: 'Chưa có điểm / Đang học', value: 'ungraded' }
    ];

    // Lọc học phần kết hợp đa chiều
    const filteredModules = useMemo(() => {
        return baseModules.filter(mod => {
            // Tìm kiếm từ khóa (mã hoặc tên môn)
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const codeMatch = (mod.code || '').toLowerCase().includes(q);
                const nameMatch = (mod.name || '').toLowerCase().includes(q);
                if (!codeMatch && !nameMatch) return false;
            }

            // Lọc học kỳ
            if (semesterFilter !== 'all') {
                const modSem = mod.semester ? String(mod.semester) : 'unassigned';
                if (modSem !== semesterFilter) return false;
            }

            // Lọc khối kiến thức & loại môn
            if (categoryFilter !== 'all') {
                if (categoryFilter.startsWith('type_')) {
                    const targetType = categoryFilter.replace('type_', '');
                    if ((mod.type || 'mandatory') !== targetType) return false;
                } else if (categoryFilter.startsWith('cat_')) {
                    const targetCat = categoryFilter.replace('cat_', '');
                    const modBlock = mod.knowledgeBlock || mod.category;
                    if (modBlock !== targetCat && mod.category !== targetCat) return false;
                }
            }

            // Lọc kết quả đánh giá
            if (gradeStatusFilter !== 'all') {
                const finalResult = calculateModuleFinal(mod.grades, mod.syllabus?.weights);
                const hasGrade = (mod.grades && (Number(mod.grades.final) > 0 || Number(mod.grades.midterm) > 0 || Number(mod.grades.attendance) > 0)) || Number(finalResult.score10) > 0;
                const isPassed = Number(finalResult.score10) >= 5.0 || mod.status === 'completed';

                if (gradeStatusFilter === 'passed' && !isPassed) return false;
                if (gradeStatusFilter === 'failed' && (isPassed || !hasGrade)) return false;
                if (gradeStatusFilter === 'graded' && !hasGrade) return false;
                if (gradeStatusFilter === 'ungraded' && hasGrade) return false;
            }

            return true;
        });
    }, [baseModules, searchQuery, semesterFilter, categoryFilter, gradeStatusFilter]);

    const isFiltered = selectedProgramFilter !== 'all' || programStatusFilter !== 'all' || semesterFilter !== 'all' || categoryFilter !== 'all' || gradeStatusFilter !== 'all' || searchQuery.trim() !== '' || !onlySelectedFilter;

    const handleResetFilters = () => {
        setProgramStatusFilter('all');
        setSelectedProgramFilter('all');
        setSemesterFilter('all');
        setCategoryFilter('all');
        setGradeStatusFilter('all');
        setSearchQuery('');
        setOnlySelectedFilter(true);
    };

    const overall = calculateOverallGPA(filteredModules, normalizedPrograms, selectedProgramFilter);
    const passedCount = filteredModules.filter(m => calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0 || m.status === 'completed').length;

    const handleGradeChange = (mod, field, val) => {
        const numVal = Math.min(10, Math.max(0, Number(val)));
        const updatedGrades = { ...(mod.grades || { attendance: 0, midterm: 0, final: 0 }), [field]: numVal };
        onUpdateModule({
            ...mod,
            grades: updatedGrades
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <CollapsiblePageHeader
                title="Sổ điểm & Đánh giá kết quả"
                subtitle="Cập nhật điểm thành phần, theo dõi GPA và kết quả tích lũy theo từng phân hệ."
                actions={({ isScrolled }) => (
                    evalType === 'credits' ? (
                        <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'flex items-center gap-1.5 sm:gap-2' : 'grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full md:w-auto'
                        }`}>
                            <div className={`bg-white border border-brand-cerulean/20 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
                                isScrolled
                                    ? 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-xs'
                                    : 'p-1.5 sm:p-2.5 shadow-editorial flex-col min-w-[55px] sm:min-w-[75px]'
                            }`}>
                                <span className={`font-bold transition-all duration-300 ${
                                    isScrolled ? 'text-[10px] text-gray-500 mr-1' : 'text-[9px] uppercase text-gray-400 block'
                                }`}>
                                    {isScrolled ? '10:' : 'Hệ 10'}
                                </span>
                                <span className={`font-serif-title font-bold text-brand-cerulean transition-all duration-300 leading-tight ${
                                    isScrolled ? 'text-xs sm:text-sm' : 'text-base sm:text-xl'
                                }`}>{overall.gpa10}</span>
                            </div>
                            <div className={`bg-brand-cerulean text-white text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
                                isScrolled
                                    ? 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-xs'
                                    : 'p-1.5 sm:p-2.5 shadow-editorial flex-col min-w-[55px] sm:min-w-[75px]'
                            }`}>
                                <span className={`font-bold transition-all duration-300 ${
                                    isScrolled ? 'text-[10px] text-white/80 mr-1' : 'text-[9px] uppercase text-white/80 block'
                                }`}>
                                    {isScrolled ? '4.0:' : 'Hệ 4.0'}
                                </span>
                                <span className={`font-serif-title font-bold transition-all duration-300 leading-tight ${
                                    isScrolled ? 'text-xs sm:text-sm' : 'text-base sm:text-xl'
                                }`}>{overall.gpa4}</span>
                            </div>
                            <div className={`bg-white border border-brand-cerulean/20 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
                                isScrolled
                                    ? 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-xs'
                                    : 'p-1.5 sm:p-2.5 shadow-editorial flex-col min-w-[55px] sm:min-w-[75px]'
                            }`}>
                                <span className={`font-bold transition-all duration-300 ${
                                    isScrolled ? 'text-[10px] text-gray-500 mr-1' : 'text-[9px] uppercase text-gray-400 block'
                                }`}>
                                    {isScrolled ? 'TC:' : 'Tín chỉ'}
                                </span>
                                <span className={`font-serif-title font-bold text-brand-jasper transition-all duration-300 leading-tight ${
                                    isScrolled ? 'text-xs sm:text-sm' : 'text-base sm:text-xl'
                                }`}>{overall.earnedCredits}</span>
                            </div>
                            <div className={`bg-white border border-brand-cerulean/20 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
                                isScrolled
                                    ? 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-xs'
                                    : 'p-1.5 sm:p-2.5 shadow-editorial flex-col min-w-[65px] sm:min-w-[85px]'
                            }`}>
                                <span className={`font-bold transition-all duration-300 ${
                                    isScrolled ? 'hidden' : 'text-[9px] uppercase text-gray-400 block'
                                }`}>
                                    Xếp loại
                                </span>
                                <span className={`font-serif-title font-bold text-brand-cerulean transition-all duration-300 leading-tight ${
                                    isScrolled ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                                }`}>{overall.rank}</span>
                            </div>
                        </div>
                    ) : (
                        <div className={`bg-brand-cerulean text-white border-editorial text-center shadow-editorial transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'px-2.5 py-1' : 'p-2 sm:p-3 sm:min-w-[140px]'
                        }`}>
                            <span className={`uppercase text-white/80 font-bold block transition-all duration-300 ${
                                isScrolled ? 'text-[9px]' : 'text-[10px]'
                            }`}>Đạt Chuyên đề</span>
                            <span className={`font-serif-title font-bold transition-all duration-300 ${
                                isScrolled ? 'text-xs sm:text-sm' : 'text-lg sm:text-xl'
                            }`}>
                                {passedCount} / {filteredModules.length}
                            </span>
                        </div>
                    )
                )}
            />

            {/* BẢNG BỘ LỌC ĐA CHIỀU */}
            <section className="bg-white border-editorial p-3.5 sm:p-5 shadow-editorial space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Tìm theo mã học phần, tên môn học..."
                            className="input-editorial w-full pl-10 pr-9 text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2.5 justify-between sm:justify-end flex-wrap">
                        {/* Toggle chỉ hiển thị học phần đã chọn học */}
                        <button
                            type="button"
                            onClick={() => setOnlySelectedFilter(!onlySelectedFilter)}
                            className={`px-3 py-1.5 text-xs font-serif-title font-bold rounded flex items-center gap-1.5 transition-all ${
                                onlySelectedFilter
                                    ? 'bg-brand-cerulean text-white shadow-xs'
                                    : 'bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 hover:bg-white'
                            }`}
                            title="Bật/Tắt hiển thị: Chỉ hiển thị các học phần đã chọn học (Bắt buộc & Tự chọn đã chọn)"
                        >
                            {onlySelectedFilter ? <CheckSquare size={14} className="text-white" /> : <Square size={14} className="text-gray-400" />}
                            <span>Chỉ học phần đã chọn</span>
                        </button>

                        <span className="text-xs font-serif-title text-gray-500">
                            Hiển thị <strong className="text-brand-cerulean font-bold text-sm">{filteredModules.length}</strong> / {baseModules.length} học phần
                        </span>
                        {isFiltered && (
                            <button
                                onClick={handleResetFilters}
                                className="px-3 py-1.5 text-xs font-serif-title border border-gray-300 hover:border-brand-jasper text-gray-600 hover:text-brand-jasper rounded flex items-center gap-1.5 transition-colors bg-gray-50"
                                title="Đặt lại toàn bộ bộ lọc"
                            >
                                <RotateCcw size={13} />
                                <span>Đặt lại bộ lọc</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                        <EditorialSelect
                            label="Trạng thái CTĐT"
                            value={programStatusFilter}
                            onChange={val => {
                                setProgramStatusFilter(val);
                                if (val !== 'all' && selectedProgramFilter !== 'all') {
                                    const target = normalizedPrograms.find(p => p.id === selectedProgramFilter);
                                    if (target && target.status !== val) setSelectedProgramFilter('all');
                                }
                            }}
                            options={programStatusOptions}
                        />
                    </div>
                    <div>
                        <EditorialSelect
                            label="Chương trình đào tạo"
                            value={selectedProgramFilter}
                            onChange={setSelectedProgramFilter}
                            options={programOptions}
                        />
                    </div>
                    <div>
                        <EditorialSelect
                            label="Học kỳ"
                            value={semesterFilter}
                            onChange={setSemesterFilter}
                            options={semesterOptions}
                        />
                    </div>
                    <div>
                        <EditorialSelect
                            label="Khối kiến thức / Loại"
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            options={categoryOptions}
                        />
                    </div>
                    <div>
                        <EditorialSelect
                            label="Kết quả đánh giá"
                            value={gradeStatusFilter}
                            onChange={setGradeStatusFilter}
                            options={gradeStatusOptions}
                        />
                    </div>
                </div>
            </section>

            {/* DANH SÁCH THẺ ĐIỂM DÀNH CHO MOBILE / MÀN HÌNH DỌC (md:hidden) */}
            <div className={`md:hidden space-y-3 ${filteredModules.length > 3 ? 'max-h-[640px] overflow-y-auto pr-1 editor-scrollbar' : ''}`}>
                {filteredModules.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-white border-editorial shadow-editorial space-y-2">
                        <Filter size={28} className="text-gray-400 mx-auto stroke-1" />
                        <p className="font-serif-title text-sm text-gray-600">
                            {isFiltered ? "Không tìm thấy học phần nào khớp với bộ lọc." : "Chưa có học phần nào trong chương trình."}
                        </p>
                        {isFiltered && (
                            <button
                                onClick={handleResetFilters}
                                className="px-3 py-1.5 bg-brand-cerulean text-white text-xs font-serif-title inline-flex items-center gap-1.5 shadow-sm"
                            >
                                <RotateCcw size={13} /> Đặt lại bộ lọc
                            </button>
                        )}
                    </div>
                ) : (
                    filteredModules.map(mod => {
                        const { score10, letter, gpa4 } = calculateModuleFinal(mod.grades, mod.syllabus?.weights);
                        const isPassed = score10 >= 5.0 || mod.status === 'completed';
                        return (
                            <div key={mod.id} className="bg-white border-editorial p-3.5 shadow-editorial space-y-2.5">
                                {/* Header: Code, Semester, Credits & Final Badge */}
                                <div className="flex justify-between items-start gap-2 pb-2 border-b border-gray-100">
                                    <div className="space-y-0.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-sans font-bold text-xs text-brand-cerulean bg-brand-cerulean/10 px-1.5 py-0.5 rounded">
                                                {(mod.code || '').toUpperCase()}
                                            </span>
                                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-sans rounded border border-gray-200">
                                                {mod.semester ? (mod.semester === 'summer' ? 'Hè' : `HK ${mod.semester}`) : 'Chưa xếp'}
                                            </span>
                                            <span className="text-[11px] font-bold text-gray-600 font-sans">
                                                {evalType === 'hours' ? `${Number(mod.credits || 3) * 15} tiết` : `${mod.credits} TC`}
                                            </span>
                                        </div>
                                        <h4 className="font-serif-title font-bold text-sm text-brand-cerulean leading-snug">
                                            {mod.name}
                                        </h4>
                                    </div>
                                    {/* Score indicator */}
                                    <div className="text-right shrink-0">
                                        <div className="text-lg font-serif-title text-brand-jasper font-bold leading-tight">
                                            {score10}
                                        </div>
                                        {evalType === 'credits' ? (
                                            <span className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded inline-block ${
                                                isPassed ? 'bg-brand-cerulean/10 text-brand-cerulean' : 'bg-red-50 text-red-700'
                                            }`}>
                                                {letter} ({gpa4})
                                            </span>
                                        ) : (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block ${
                                                isPassed ? 'bg-brand-cerulean/15 text-brand-cerulean' : 'bg-red-50 text-red-700'
                                            }`}>
                                                {isPassed ? 'ĐẠT' : 'CHƯA'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 3 Inline Grade Inputs: CC, GK, CK */}
                                <div className="grid grid-cols-3 gap-2 bg-brand-cream/50 p-2 border border-brand-cerulean/15 rounded-xs">
                                    <div>
                                        <label className="block text-[10px] font-serif-title text-gray-600 font-bold mb-1 text-center">
                                            CC ({mod.syllabus?.weights?.attendance ?? 10}%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            className="input-editorial w-full text-center font-sans text-xs py-1 px-1"
                                            value={mod.grades?.attendance || 0}
                                            onChange={e => handleGradeChange(mod, 'attendance', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-serif-title text-gray-600 font-bold mb-1 text-center truncate">
                                            {evalType === 'credits' ? `GK (${mod.syllabus?.weights?.midterm ?? 30}%)` : 'B.tập'}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            className="input-editorial w-full text-center font-sans text-xs py-1 px-1"
                                            value={mod.grades?.midterm || 0}
                                            onChange={e => handleGradeChange(mod, 'midterm', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-serif-title text-gray-600 font-bold mb-1 text-center truncate">
                                            {evalType === 'credits' ? `CK (${mod.syllabus?.weights?.final ?? 60}%)` : 'Đồ án'}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            className="input-editorial w-full text-center font-sans text-xs py-1 px-1"
                                            value={mod.grades?.final || 0}
                                            onChange={e => handleGradeChange(mod, 'final', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* BẢNG ĐIỂM HỌC PHẦN DÀNH CHO DESKTOP (hidden md:block) */}
            <div className={`hidden md:block bg-white border-editorial shadow-editorial overflow-x-auto ${filteredModules.length > 3 ? 'max-h-[600px] overflow-y-auto pr-1 editor-scrollbar' : ''}`}>
                <table className="w-full text-left font-body relative border-collapse">
                    <thead className="bg-brand-cream border-b border-brand-cerulean text-brand-cerulean font-serif-title sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-4">Mã môn</th>
                            <th className="p-4">Tên học phần / Chuyên đề</th>
                            <th className="p-4 text-center">Học kỳ</th>
                            <th className="p-4 text-center">{evalType === 'hours' ? 'Thời lượng' : 'Số TC'}</th>
                            <th className="p-4 text-center">Chuyên cần</th>
                            <th className="p-4 text-center">{evalType === 'credits' ? 'Giữa kỳ' : 'Bài tập / Thảo luận'}</th>
                            <th className="p-4 text-center">{evalType === 'credits' ? 'Cuối kỳ' : 'Bài thu hoạch / Đồ án'}</th>
                            <th className="p-4 text-center">Tổng kết (Hệ 10)</th>
                            <th className="p-4 text-center">Kết quả Đánh giá</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredModules.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="p-12 text-center text-gray-500 font-serif text-base bg-white/50">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Filter size={32} className="text-gray-400 stroke-1" />
                                        <p className="font-serif-title text-base text-gray-600">
                                            {isFiltered ? "Không tìm thấy học phần nào khớp với bộ lọc hiện tại." : "Chưa có học phần nào trong chương trình đã chọn."}
                                        </p>
                                        {isFiltered && (
                                            <button
                                                onClick={handleResetFilters}
                                                className="px-4 py-2 bg-brand-cerulean text-white text-xs font-serif-title flex items-center gap-1.5 shadow-sm hover:bg-brand-cerulean/80 transition-colors"
                                            >
                                                <RotateCcw size={14} /> Đặt lại tất cả bộ lọc
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredModules.map(mod => {
                                const { score10, letter, gpa4 } = calculateModuleFinal(mod.grades, mod.syllabus?.weights);
                                const isPassed = score10 >= 5.0 || mod.status === 'completed';
                                return (
                                    <tr key={mod.id} className="hover:bg-brand-cream/50 transition-colors">
                                        <td className="p-4 font-sans font-bold text-gray-500 whitespace-nowrap">{(mod.code || '').toUpperCase()}</td>
                                        <td className="p-4 font-serif-title text-base text-brand-cerulean font-bold">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span>{mod.name}</span>
                                                {mod.type === 'elective' ? (
                                                    <span className="px-2 py-0.5 text-xs font-serif bg-brand-cream text-brand-jasper border border-brand-jasper/30 rounded font-bold">
                                                        Tự chọn {mod.isSelected ? '(Đã chọn)' : ''}
                                                    </span>
                                                ) : mod.type === 'practice' ? (
                                                    <span className="px-2 py-0.5 text-xs font-serif bg-brand-cream text-brand-cerulean border border-brand-cerulean/30 rounded font-normal">
                                                        Thực hành
                                                    </span>
                                                ) : null}
                                            </div>
                                            {selectedProgramFilter === 'all' && (
                                                <span className="text-[11px] text-gray-500 font-sans block mt-0.5 font-normal">
                                                    {getModuleProgramNames(mod, normalizedPrograms).join(' • ')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center font-sans text-xs whitespace-nowrap">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200 font-medium">
                                                {mod.semester ? (mod.semester === 'summer' ? 'Hè' : `HK ${mod.semester}`) : 'Chưa xếp'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-bold whitespace-nowrap">{evalType === 'hours' ? `${Number(mod.credits || 3) * 15} tiết` : `${mod.credits} TC`}</td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center font-sans"
                                                value={mod.grades?.attendance || 0}
                                                onChange={e => handleGradeChange(mod, 'attendance', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center font-sans"
                                                value={mod.grades?.midterm || 0}
                                                onChange={e => handleGradeChange(mod, 'midterm', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center font-sans"
                                                value={mod.grades?.final || 0}
                                                onChange={e => handleGradeChange(mod, 'final', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center font-serif-title text-xl text-brand-jasper font-bold whitespace-nowrap">
                                            {score10}
                                        </td>
                                        <td className="p-4 text-center font-bold whitespace-nowrap">
                                            {evalType === 'credits' ? (
                                                <span className={`px-2 py-1 rounded text-xs inline-block font-sans ${
                                                    isPassed ? 'bg-brand-cerulean/10 text-brand-cerulean border border-brand-cerulean/20' : 'bg-brand-cream text-brand-jasper border border-brand-jasper/30'
                                                }`}>
                                                    {letter} ({gpa4})
                                                </span>
                                            ) : (
                                                <span className={`px-2.5 py-1 text-xs rounded font-bold inline-flex items-center gap-1 ${isPassed ? 'bg-brand-cerulean/15 text-brand-cerulean' : 'bg-brand-cream text-brand-jasper border border-brand-jasper/30'}`}>
                                                    {isPassed ? <><Check size={12} className="stroke-[2.5]" /> ĐẠT</> : 'CHƯA ĐẠT'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

