import { calculateModuleFinal } from './gpaCalculators';

export const getCategoryPresets = (category) => {
    if (category === 'dai_hoc') {
        return {
            evaluationType: 'credits',
            totalCreditsRequired: 135,
            rules: { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
        };
    }
    if (category === 'nhanh_b') {
        return {
            evaluationType: 'modules',
            totalCreditsRequired: 6,
            rules: { mandatoryA: 4, electiveA: 2, mandatoryB: 0, practiceB: 0, electiveB: 0 }
        };
    }
    if (category === 'nhanh_c') {
        return {
            evaluationType: 'hours',
            totalCreditsRequired: 120,
            rules: { mandatoryA: 80, electiveA: 40, mandatoryB: 0, practiceB: 0, electiveB: 0 }
        };
    }
    // nhanh_a (default NVSP)
    return {
        evaluationType: 'credits',
        totalCreditsRequired: 34,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
    };
};

export const PROGRAM_STATUSES = {
    CHUA_HOC: 'chua_hoc',
    DANG_HOC: 'dang_hoc',
    DA_HOC: 'da_hoc'
};

export const getProgramStatus = (prog) => {
    if (!prog) return 'chua_hoc';
    const s = prog.status;
    if (s === 'chua_hoc' || s === 'planning' || prog.isEnrolled === false) return 'chua_hoc';
    if (s === 'da_hoc' || s === 'completed') return 'da_hoc';
    return 'dang_hoc';
};

export const getProgramStatusLabel = (progOrStatus) => {
    const s = typeof progOrStatus === 'object' ? getProgramStatus(progOrStatus) : progOrStatus;
    if (s === 'chua_hoc') return 'Chưa học';
    if (s === 'da_hoc') return 'Đã học';
    return 'Đang học';
};

export const normalizeProgram = (prog) => {
    if (!prog) return prog;
    const category = prog.category || (prog.rules?.general !== undefined ? 'dai_hoc' : prog.rules ? 'nhanh_a' : 'nhanh_b');
    let defaultEval = 'credits';
    if (category === 'nhanh_b') defaultEval = 'modules';
    else if (category === 'nhanh_c') defaultEval = 'hours';
    const status = getProgramStatus(prog);
    return {
        ...prog,
        category,
        evaluationType: prog.evaluationType || defaultEval,
        status,
        isEnrolled: status !== 'chua_hoc'
    };
};

export const calculateRuleBreakdown = (program, modules = []) => {
    if (!program) return null;
    const progModules = modules.filter(m => isModuleInProgram(m, program.id));
    const evalType = program.evaluationType || (program.category === 'nhanh_b' ? 'modules' : program.category === 'nhanh_c' ? 'hours' : 'credits');
    const isDaiHoc = program.category === 'dai_hoc' || program.rules?.general !== undefined;
    const rules = program.rules || (isDaiHoc
        ? { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
        : { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
    );

    if (isDaiHoc && evalType === 'credits') {
        const activeMods = progModules.filter(m => m.type !== 'elective' || m.isSelected !== false);

        const currentGeneral = activeMods.filter(m => m.knowledgeBlock === 'general' || m.category === 'general' || m.category === 'A' || (!m.knowledgeBlock && (!m.category || m.category === 'general'))).reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentFundamentalMandatory = activeMods.filter(m => (m.knowledgeBlock === 'fundamental' || m.category === 'fundamental' || m.category === 'B') && (m.type === 'mandatory' || !m.type)).reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentFundamentalElective = activeMods.filter(m => (m.knowledgeBlock === 'fundamental' || m.category === 'fundamental' || m.category === 'B') && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentSpecializedMandatory = activeMods.filter(m => (m.knowledgeBlock === 'specialized' || m.category === 'specialized' || m.category === 'C') && (m.type === 'mandatory' || !m.type)).reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentSpecializedElective = activeMods.filter(m => (m.knowledgeBlock === 'specialized' || m.category === 'specialized' || m.category === 'C') && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentInternship = activeMods.filter(m => m.knowledgeBlock === 'internship' || m.category === 'internship' || m.type === 'practice').reduce((s, m) => s + Number(m.credits || 0), 0);

        const targetGeneral = rules.general ?? 28;
        const targetFundamentalMandatory = rules.fundamentalMandatory ?? rules.fundamental ?? 26;
        const targetFundamentalElective = rules.fundamentalElective ?? 8;
        const targetSpecializedMandatory = rules.specializedMandatory ?? 42;
        const targetSpecializedElective = rules.specializedElective ?? 16;
        const targetInternship = rules.internshipGraduation ?? 15;

        const totalEarned = currentGeneral + currentFundamentalMandatory + currentFundamentalElective + currentSpecializedMandatory + currentSpecializedElective + currentInternship;
        const totalTarget = program.totalCreditsRequired || (targetGeneral + targetFundamentalMandatory + targetFundamentalElective + targetSpecializedMandatory + targetSpecializedElective + targetInternship);

        const blocks = [
            { id: 'general', label: 'GD Đại cương', current: currentGeneral, target: targetGeneral, unit: 'TC' },
            { id: 'fundamentalMandatory', label: 'Cơ sở ngành (BB)', current: currentFundamentalMandatory, target: targetFundamentalMandatory, unit: 'TC' },
            { id: 'fundamentalElective', label: 'Cơ sở ngành (TC)', current: currentFundamentalElective, target: targetFundamentalElective, unit: 'TC' },
            { id: 'specializedMandatory', label: 'Chuyên ngành (BB)', current: currentSpecializedMandatory, target: targetSpecializedMandatory, unit: 'TC' },
            { id: 'specializedElective', label: 'Chuyên ngành (TC)', current: currentSpecializedElective, target: targetSpecializedElective, unit: 'TC' },
            { id: 'internshipGraduation', label: 'Thực tập & Khóa luận', current: currentInternship, target: targetInternship, unit: 'TC' },
        ];

        const missingBlocks = blocks.filter(b => b.target > 0 && b.current < b.target);
        const isComplete = missingBlocks.length === 0 && totalEarned >= totalTarget;

        return {
            evalType,
            blocks,
            totalEarned,
            totalTarget,
            unit: 'TC',
            missingBlocks,
            isComplete
        };
    }

    if (evalType === 'credits') {
        const activeMods = progModules.filter(m => m.type !== 'elective' || m.isSelected);

        const currentMandatoryA = activeMods.filter(m => (m.category === 'A' || !m.category) && m.type === 'mandatory').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentElectiveA = activeMods.filter(m => (m.category === 'A' || !m.category) && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentMandatoryB = activeMods.filter(m => m.category === 'B' && m.type === 'mandatory').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentPracticeB = activeMods.filter(m => m.category === 'B' && m.type === 'practice').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentElectiveB = activeMods.filter(m => m.category === 'B' && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);

        const targetMandatoryA = rules.mandatoryA ?? 15;
        const targetElectiveA = rules.electiveA ?? 2;
        const targetMandatoryB = rules.mandatoryB ?? 9;
        const targetPracticeB = rules.practiceB ?? 6;
        const targetElectiveB = rules.electiveB ?? 2;

        const totalEarned = currentMandatoryA + currentElectiveA + currentMandatoryB + currentPracticeB + currentElectiveB;
        const totalTarget = program.totalCreditsRequired || (targetMandatoryA + targetElectiveA + targetMandatoryB + targetPracticeB + targetElectiveB);

        const blocks = [
            { id: 'mandatoryA', label: 'Khối A Bắt buộc', current: currentMandatoryA, target: targetMandatoryA, unit: 'TC' },
            { id: 'electiveA', label: 'Khối A Tự chọn', current: currentElectiveA, target: targetElectiveA, unit: 'TC' },
            { id: 'mandatoryB', label: 'Khối B Bắt buộc', current: currentMandatoryB, target: targetMandatoryB, unit: 'TC' },
            { id: 'practiceB', label: 'Khối B Thực hành', current: currentPracticeB, target: targetPracticeB, unit: 'TC' },
            { id: 'electiveB', label: 'Khối B Tự chọn', current: currentElectiveB, target: targetElectiveB, unit: 'TC' },
        ];

        const missingBlocks = blocks.filter(b => b.target > 0 && b.current < b.target);
        const isComplete = missingBlocks.length === 0 && totalEarned >= totalTarget;

        return {
            evalType,
            blocks,
            totalEarned,
            totalTarget,
            unit: 'TC',
            missingBlocks,
            isComplete
        };
    }

    if (evalType === 'modules') {
        const passedCount = progModules.filter(m => {
            const final = calculateModuleFinal(m.grades, m.syllabus?.weights);
            return (final.score10 && final.score10 >= 5.0) || m.status === 'completed';
        }).length;
        const totalCount = progModules.length;
        const targetCount = program.totalCreditsRequired || rules.mandatoryA || 6;
        const isComplete = passedCount >= targetCount && totalCount >= targetCount;

        return {
            evalType,
            blocks: [
                { id: 'modules', label: 'Số chuyên đề đã hoàn thành', current: passedCount, target: targetCount, unit: 'môn' }
            ],
            totalEarned: passedCount,
            totalTarget: targetCount,
            unit: 'môn',
            missingBlocks: passedCount < targetCount ? [{ label: 'Chuyên đề', current: passedCount, target: targetCount, unit: 'môn' }] : [],
            isComplete
        };
    }

    // hours
    const totalHoursLearned = progModules.filter(m => m.status === 'completed' || calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0).reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
    const targetHours = program.totalCreditsRequired || 120;
    const isComplete = totalHoursLearned >= targetHours;

    return {
        evalType,
        blocks: [
            { id: 'hours', label: 'Thời lượng tích lũy', current: totalHoursLearned, target: targetHours, unit: 'tiết' }
        ],
        totalEarned: totalHoursLearned,
        totalTarget: targetHours,
        unit: 'tiết',
        missingBlocks: totalHoursLearned < targetHours ? [{ label: 'Thời lượng', current: totalHoursLearned, target: targetHours, unit: 'tiết' }] : [],
        isComplete
    };
};

// Normalize legacy programId (string) → programIds (array) for shared module support
export const normalizeModuleProgramIds = (mod) => {
    if (!mod) return mod;
    if (mod.programIds && Array.isArray(mod.programIds) && mod.programIds.length > 0) {
        const { programId, ...rest } = mod;
        return rest;
    }
    if (mod.programId) {
        const { programId, ...rest } = mod;
        return { ...rest, programIds: [programId] };
    }
    return { ...mod, programIds: mod.programIds || [] };
};

export const isModuleInProgram = (mod, progId) => {
    if (!mod || !progId) return false;
    if (mod.programIds && Array.isArray(mod.programIds) && mod.programIds.length > 0) {
        return mod.programIds.includes(progId);
    }
    return mod.programId === progId;
};

// Get human-readable names of programs a module belongs to
export const getModuleProgramNames = (mod, programs) => {
    const ids = mod.programIds || (mod.programId ? [mod.programId] : []);
    return ids.map(id => programs.find(p => p.id === id)?.name || id).filter(Boolean);
};

export const getFilteredModules = (modules = [], programs = [], selectedProgramFilter = 'all') => {
    let activePrograms = (programs || []).filter(p => getProgramStatus(p) !== 'chua_hoc');
    if (selectedProgramFilter !== 'all') {
        activePrograms = (programs || []).filter(p => p.id === selectedProgramFilter);
    }
    const activeIds = activePrograms.map(p => p.id);
    if (activeIds.length === 0) {
        if (selectedProgramFilter === 'all') return modules || [];
        return [];
    }
    return (modules || []).filter(m => activeIds.some(pId => isModuleInProgram(m, pId)));
};

// Lọc các học phần đã được chọn học:
// 1. Thuộc chương trình đào tạo đang chọn học (không phải 'chua_hoc')
// 2. Nếu là môn tự chọn (type === 'elective'): phải được đánh dấu chọn (isSelected === true) hoặc đang học/đã hoàn thành/đã có điểm
// 3. Không bị đánh dấu huỷ chọn (isEnrolled !== false)
export const getSelectedModules = (modules = [], programs = [], selectedProgramFilter = 'all') => {
    const enrolledPrograms = (programs || []).filter(p => getProgramStatus(p) !== 'chua_hoc');
    let targetPrograms = enrolledPrograms;
    if (selectedProgramFilter !== 'all') {
        targetPrograms = enrolledPrograms.filter(p => p.id === selectedProgramFilter);
    }
    const targetProgramIds = targetPrograms.map(p => p.id);
    if (targetProgramIds.length === 0) {
        return [];
    }

    return (modules || []).filter(m => {
        // Phải thuộc ít nhất 1 chương trình mục tiêu đang chọn học
        const inProgram = targetProgramIds.some(pId => isModuleInProgram(m, pId));
        if (!inProgram) return false;

        // Nếu học phần bị đánh dấu rõ ràng không chọn học
        if (m.isEnrolled === false) return false;

        // Nếu là học phần tự chọn, chỉ hiển thị nếu người học đã bấm "Chọn học" (isSelected === true)
        // hoặc đã phát sinh điểm / đang học / hoàn thành
        if (m.type === 'elective') {
            const hasGrades = m.grades && (Number(m.grades.final) > 0 || Number(m.grades.midterm) > 0);
            const isFinishedOrActive = m.status === 'in_progress' || m.status === 'completed';
            return !!m.isSelected || hasGrades || isFinishedOrActive;
        }

        // Môn bắt buộc / thực hành trong chương trình đang chọn học
        return true;
    });
};

