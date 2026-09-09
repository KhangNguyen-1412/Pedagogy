import { calculateModuleFinal } from './gpaCalculators';

export const isThptProgram = (prog) => {
    if (!prog) return false;
    if (prog.category === 'nvsp_thpt') return true;
    if (prog.category === 'dai_hoc' || prog.rules?.general !== undefined) return false;
    const name = (prog.name || '').toLowerCase();
    const id = (prog.id || '').toLowerCase();
    if (name.includes('thpt') || id.includes('thpt')) return true;
    if (prog.rules?.mandatoryC !== undefined || prog.rules?.practiceC !== undefined || prog.rules?.electiveC !== undefined) return true;
    return false;
};

export const isThcsProgram = (prog) => {
    if (!prog) return false;
    if (prog.category === 'nvsp_thcs') return true;
    if (prog.category === 'dai_hoc' || prog.rules?.general !== undefined) return false;
    if (isThptProgram(prog)) return false;
    const name = (prog.name || '').toLowerCase();
    const id = (prog.id || '').toLowerCase();
    if (name.includes('thcs') || id.includes('thcs')) return true;
    if (prog.rules?.mandatoryB !== undefined || prog.rules?.practiceB !== undefined || prog.rules?.electiveB !== undefined) return true;
    return true; // Mặc định NVSP là THCS (Khối A & B)
};

export const getCategoryPresets = (category) => {
    if (category === 'dai_hoc') {
        return {
            evaluationType: 'credits',
            totalCreditsRequired: 135,
            rules: { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
        };
    }
    if (category === 'nvsp_thpt') {
        return {
            evaluationType: 'credits',
            totalCreditsRequired: 36,
            rules: { mandatoryA: 15, electiveA: 2, mandatoryC: 11, practiceC: 6, electiveC: 2 }
        };
    }
    if (category === 'nvsp_thcs' || category === 'nhanh_a') {
        return {
            evaluationType: 'credits',
            totalCreditsRequired: 34,
            rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
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
    // Default THCS
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
    let category = prog.category;
    if (!category) {
        if (prog.rules?.general !== undefined) category = 'dai_hoc';
        else if (isThptProgram(prog)) category = 'nvsp_thpt';
        else if (isThcsProgram(prog)) category = 'nvsp_thcs';
        else if (prog.rules) category = 'nvsp_thcs';
        else category = 'nhanh_b';
    } else if (category === 'nhanh_a') {
        category = isThptProgram(prog) ? 'nvsp_thpt' : 'nvsp_thcs';
    }
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
    const progModules = (modules || []).filter(m => isModuleInProgram(m, program.id));
    const evalType = program.evaluationType || (program.category === 'nhanh_b' ? 'modules' : program.category === 'nhanh_c' ? 'hours' : 'credits');
    const isDaiHoc = program.category === 'dai_hoc' || program.rules?.general !== undefined;

    // 1. Hệ Tín chỉ - Bậc Đại học
    if (isDaiHoc && evalType === 'credits') {
        const rules = program.rules || {
            general: 28,
            fundamentalMandatory: 26,
            fundamentalElective: 8,
            specializedMandatory: 42,
            specializedElective: 16,
            internshipGraduation: 15
        };

        const currentGeneral = progModules.filter(m =>
            m.knowledgeBlock === 'general' || m.category === 'general' || (!m.knowledgeBlock && (!m.category || m.category === 'general'))
        ).reduce((s, m) => s + Number(m.credits || 0), 0);

        const currentFundamentalMandatory = progModules.filter(m =>
            (m.knowledgeBlock === 'fundamental' || m.category === 'fundamental') && (m.type === 'mandatory' || !m.type)
        ).reduce((s, m) => s + Number(m.credits || 0), 0);

        const currentFundamentalElective = progModules.filter(m =>
            (m.knowledgeBlock === 'fundamental' || m.category === 'fundamental') && m.type === 'elective'
        ).reduce((s, m) => s + Number(m.credits || 0), 0);

        const currentSpecializedMandatory = progModules.filter(m =>
            (m.knowledgeBlock === 'specialized' || m.category === 'specialized') && (m.type === 'mandatory' || !m.type)
        ).reduce((s, m) => s + Number(m.credits || 0), 0);

        const currentSpecializedElective = progModules.filter(m =>
            (m.knowledgeBlock === 'specialized' || m.category === 'specialized') && m.type === 'elective'
        ).reduce((s, m) => s + Number(m.credits || 0), 0);

        const currentInternship = progModules.filter(m =>
            m.knowledgeBlock === 'internship' || m.category === 'internship' || m.type === 'practice'
        ).reduce((s, m) => s + Number(m.credits || 0), 0);

        const targetGeneral = rules.general ?? 28;
        const targetFundamentalMandatory = rules.fundamentalMandatory ?? rules.fundamental ?? 26;
        const targetFundamentalElective = rules.fundamentalElective ?? 8;
        const targetSpecializedMandatory = rules.specializedMandatory ?? 42;
        const targetSpecializedElective = rules.specializedElective ?? 16;
        const targetInternship = rules.internshipGraduation ?? 15;

        const totalEarned = progModules.reduce((s, m) => s + Number(m.credits || 0), 0);
        const totalTarget = program.totalCreditsRequired || (targetGeneral + targetFundamentalMandatory + targetFundamentalElective + targetSpecializedMandatory + targetSpecializedElective + targetInternship);

        const allBlocks = [
            { id: 'general', label: 'GD Đại cương', current: currentGeneral, target: targetGeneral, unit: 'TC' },
            { id: 'fundamentalMandatory', label: 'Cơ sở ngành (BB)', current: currentFundamentalMandatory, target: targetFundamentalMandatory, unit: 'TC' },
            { id: 'fundamentalElective', label: 'Cơ sở ngành (TC)', current: currentFundamentalElective, target: targetFundamentalElective, unit: 'TC' },
            { id: 'specializedMandatory', label: 'Chuyên ngành (BB)', current: currentSpecializedMandatory, target: targetSpecializedMandatory, unit: 'TC' },
            { id: 'specializedElective', label: 'Chuyên ngành (TC)', current: currentSpecializedElective, target: targetSpecializedElective, unit: 'TC' },
            { id: 'internshipGraduation', label: 'Thực tập & Khóa luận', current: currentInternship, target: targetInternship, unit: 'TC' },
        ];

        const blocks = allBlocks.filter(b => b.target > 0 || b.current > 0);
        const missingBlocks = blocks.filter(b => b.target > 0 && b.current < b.target);
        const isComplete = missingBlocks.length === 0 && totalEarned >= totalTarget;

        return {
            evalType,
            programCategory: 'dai_hoc',
            levelLabel: 'Bậc Đại học',
            blocks,
            totalEarned,
            totalTarget,
            unit: 'TC',
            missingBlocks,
            isComplete
        };
    }

    // 2. Hệ Tín chỉ - NVSP / Khối A, B, C
    if (evalType === 'credits') {
        const isThpt = isThptProgram(program);
        const isThcs = isThcsProgram(program);

        const defaultRules = isThpt
            ? { mandatoryA: 15, electiveA: 2, mandatoryC: 11, practiceC: 6, electiveC: 2 }
            : { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 };

        const rules = program.rules || defaultRules;

        const isCatA = (m) => {
            const c = (m.category || m.knowledgeBlock || '').toUpperCase();
            return c === 'A' || c === 'NHANH_A' || (!m.category && !m.knowledgeBlock);
        };
        const isCatB = (m) => {
            const c = (m.category || m.knowledgeBlock || '').toUpperCase();
            return c === 'B' || c === 'NHANH_B';
        };
        const isCatC = (m) => {
            const c = (m.category || m.knowledgeBlock || '').toUpperCase();
            return c === 'C' || c === 'NHANH_C';
        };

        // Đếm TẤT CẢ các học phần hiện có trong CTĐT của từng khối
        const currentMandatoryA = progModules.filter(m => isCatA(m) && (m.type === 'mandatory' || !m.type)).reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentElectiveA = progModules.filter(m => isCatA(m) && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);

        const currentMandatoryB = progModules.filter(m => isCatB(m) && (m.type === 'mandatory' || !m.type)).reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentPracticeB = progModules.filter(m => isCatB(m) && m.type === 'practice').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentElectiveB = progModules.filter(m => isCatB(m) && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);

        const currentMandatoryC = progModules.filter(m => isCatC(m) && (m.type === 'mandatory' || !m.type)).reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentPracticeC = progModules.filter(m => isCatC(m) && m.type === 'practice').reduce((s, m) => s + Number(m.credits || 0), 0);
        const currentElectiveC = progModules.filter(m => isCatC(m) && m.type === 'elective').reduce((s, m) => s + Number(m.credits || 0), 0);

        const targetMandatoryA = Number(rules.mandatoryA ?? 15);
        const targetElectiveA = Number(rules.electiveA ?? 2);
        const targetMandatoryB = Number(rules.mandatoryB ?? (isThcs ? 9 : 0));
        const targetPracticeB = Number(rules.practiceB ?? (isThcs ? 6 : 0));
        const targetElectiveB = Number(rules.electiveB ?? (isThcs ? 2 : 0));
        const targetMandatoryC = Number(rules.mandatoryC ?? (isThpt ? 11 : 0));
        const targetPracticeC = Number(rules.practiceC ?? (isThpt ? 6 : 0));
        const targetElectiveC = Number(rules.electiveC ?? (isThpt ? 2 : 0));

        const totalEarned = progModules.reduce((s, m) => s + Number(m.credits || 0), 0);
        const totalTarget = program.totalCreditsRequired || (
            isThpt
                ? (targetMandatoryA + targetElectiveA + targetMandatoryC + targetPracticeC + targetElectiveC)
                : (targetMandatoryA + targetElectiveA + targetMandatoryB + targetPracticeB + targetElectiveB)
        );

        let candidateBlocks = [];
        if (isThpt) {
            // THPT: Khối A và Khối C
            candidateBlocks = [
                { id: 'mandatoryA', label: 'Khối A Bắt buộc', current: currentMandatoryA, target: targetMandatoryA, unit: 'TC' },
                { id: 'electiveA', label: 'Khối A Tự chọn', current: currentElectiveA, target: targetElectiveA, unit: 'TC' },
                { id: 'mandatoryC', label: 'Khối C Bắt buộc', current: currentMandatoryC, target: targetMandatoryC, unit: 'TC' },
                { id: 'practiceC', label: 'Khối C Thực hành', current: currentPracticeC, target: targetPracticeC, unit: 'TC' },
                { id: 'electiveC', label: 'Khối C Tự chọn', current: currentElectiveC, target: targetElectiveC, unit: 'TC' },
            ];
            // Nếu có học phần Khối B phát sinh thực tế thì hiển thị bổ sung
            if (currentMandatoryB > 0 || currentPracticeB > 0 || currentElectiveB > 0) {
                if (currentMandatoryB > 0 || targetMandatoryB > 0) candidateBlocks.push({ id: 'mandatoryB', label: 'Khối B Bắt buộc', current: currentMandatoryB, target: targetMandatoryB, unit: 'TC' });
                if (currentPracticeB > 0 || targetPracticeB > 0) candidateBlocks.push({ id: 'practiceB', label: 'Khối B Thực hành', current: currentPracticeB, target: targetPracticeB, unit: 'TC' });
                if (currentElectiveB > 0 || targetElectiveB > 0) candidateBlocks.push({ id: 'electiveB', label: 'Khối B Tự chọn', current: currentElectiveB, target: targetElectiveB, unit: 'TC' });
            }
        } else {
            // THCS: Khối A và Khối B
            candidateBlocks = [
                { id: 'mandatoryA', label: 'Khối A Bắt buộc', current: currentMandatoryA, target: targetMandatoryA, unit: 'TC' },
                { id: 'electiveA', label: 'Khối A Tự chọn', current: currentElectiveA, target: targetElectiveA, unit: 'TC' },
                { id: 'mandatoryB', label: 'Khối B Bắt buộc', current: currentMandatoryB, target: targetMandatoryB, unit: 'TC' },
                { id: 'practiceB', label: 'Khối B Thực hành', current: currentPracticeB, target: targetPracticeB, unit: 'TC' },
                { id: 'electiveB', label: 'Khối B Tự chọn', current: currentElectiveB, target: targetElectiveB, unit: 'TC' },
            ];
            // Nếu có học phần Khối C phát sinh thực tế thì hiển thị bổ sung
            if (currentMandatoryC > 0 || currentPracticeC > 0 || currentElectiveC > 0) {
                if (currentMandatoryC > 0 || targetMandatoryC > 0) candidateBlocks.push({ id: 'mandatoryC', label: 'Khối C Bắt buộc', current: currentMandatoryC, target: targetMandatoryC, unit: 'TC' });
                if (currentPracticeC > 0 || targetPracticeC > 0) candidateBlocks.push({ id: 'practiceC', label: 'Khối C Thực hành', current: currentPracticeC, target: targetPracticeC, unit: 'TC' });
                if (currentElectiveC > 0 || targetElectiveC > 0) candidateBlocks.push({ id: 'electiveC', label: 'Khối C Tự chọn', current: currentElectiveC, target: targetElectiveC, unit: 'TC' });
            }
        }

        const blocks = candidateBlocks.filter(b => b.target > 0 || b.current > 0);
        const missingBlocks = blocks.filter(b => b.target > 0 && b.current < b.target);
        const isComplete = missingBlocks.length === 0 && totalEarned >= totalTarget;

        return {
            evalType,
            programCategory: isThpt ? 'nvsp_thpt' : 'nvsp_thcs',
            levelLabel: isThpt ? 'NVSP THPT - Khối A & C' : 'NVSP THCS - Khối A & B',
            blocks,
            totalEarned,
            totalTarget,
            unit: 'TC',
            missingBlocks,
            isComplete
        };
    }

    // 3. Hệ Chuyên đề (modules)
    if (evalType === 'modules') {
        const rules = program.rules || { mandatoryA: 4, electiveA: 2 };
        const targetMandatory = Number(rules.mandatoryA ?? rules.mandatory ?? 0);
        const targetElective = Number(rules.electiveA ?? rules.elective ?? 0);
        const currentMandatory = progModules.filter(m => m.type !== 'elective').length;
        const currentElective = progModules.filter(m => m.type === 'elective').length;
        const totalCount = progModules.length;
        const targetCount = program.totalCreditsRequired || (targetMandatory + targetElective) || 6;

        let blocks = [];
        if (targetMandatory > 0 || targetElective > 0) {
            if (targetMandatory > 0 || currentMandatory > 0) {
                blocks.push({ id: 'modulesMandatory', label: 'Chuyên đề Bắt buộc', current: currentMandatory, target: targetMandatory, unit: 'môn' });
            }
            if (targetElective > 0 || currentElective > 0) {
                blocks.push({ id: 'modulesElective', label: 'Chuyên đề Tự chọn', current: currentElective, target: targetElective, unit: 'môn' });
            }
        } else {
            blocks.push({ id: 'modulesTotal', label: 'Số chuyên đề trong CTĐT', current: totalCount, target: targetCount, unit: 'môn' });
        }

        const missingBlocks = blocks.filter(b => b.target > 0 && b.current < b.target);
        const isComplete = missingBlocks.length === 0 && totalCount >= targetCount;

        return {
            evalType,
            blocks,
            totalEarned: totalCount,
            totalTarget: targetCount,
            unit: 'môn',
            missingBlocks,
            isComplete
        };
    }

    // 4. Hệ Tiết học (hours)
    const rules = program.rules || { mandatoryA: 80, electiveA: 40 };
    const targetMandatoryHours = Number(rules.mandatoryA ?? rules.mandatory ?? 0);
    const targetElectiveHours = Number(rules.electiveA ?? rules.elective ?? 0);
    const currentMandatoryHours = progModules.filter(m => m.type !== 'elective').reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
    const currentElectiveHours = progModules.filter(m => m.type === 'elective').reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
    const totalHours = progModules.reduce((s, m) => s + (Number(m.credits || 3) * 15), 0);
    const targetHours = program.totalCreditsRequired || (targetMandatoryHours + targetElectiveHours) || 120;

    let blocks = [];
    if (targetMandatoryHours > 0 || targetElectiveHours > 0) {
        if (targetMandatoryHours > 0 || currentMandatoryHours > 0) {
            blocks.push({ id: 'hoursMandatory', label: 'Tiết học Bắt buộc', current: currentMandatoryHours, target: targetMandatoryHours, unit: 'tiết' });
        }
        if (targetElectiveHours > 0 || currentElectiveHours > 0) {
            blocks.push({ id: 'hoursElective', label: 'Tiết học Tự chọn', current: currentElectiveHours, target: targetElectiveHours, unit: 'tiết' });
        }
    } else {
        blocks.push({ id: 'hoursTotal', label: 'Thời lượng tiết học trong CTĐT', current: totalHours, target: targetHours, unit: 'tiết' });
    }

    const missingBlocks = blocks.filter(b => b.target > 0 && b.current < b.target);
    const isComplete = missingBlocks.length === 0 && totalHours >= targetHours;

    return {
        evalType,
        blocks,
        totalEarned: totalHours,
        totalTarget: targetHours,
        unit: 'tiết',
        missingBlocks,
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

