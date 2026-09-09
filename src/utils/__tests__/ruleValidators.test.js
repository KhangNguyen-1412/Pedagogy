import { describe, it, expect } from 'vitest';
import {
    PROGRAM_STATUSES,
    getProgramStatus,
    getProgramStatusLabel,
    normalizeProgram,
    isModuleInProgram,
    getCategoryPresets,
    calculateRuleBreakdown,
    isThptProgram,
    isThcsProgram
} from '../ruleValidators';

describe('ruleValidators - Program Status Management', () => {
    it('should define 3 standard canonical statuses', () => {
        expect(PROGRAM_STATUSES.CHUA_HOC).toBe('chua_hoc');
        expect(PROGRAM_STATUSES.DANG_HOC).toBe('dang_hoc');
        expect(PROGRAM_STATUSES.DA_HOC).toBe('da_hoc');
    });

    it('should correctly resolve program status for various inputs', () => {
        // null or undefined program defaults to chua_hoc
        expect(getProgramStatus(null)).toBe('chua_hoc');
        expect(getProgramStatus({})).toBe('dang_hoc');

        // Explicit status
        expect(getProgramStatus({ status: 'chua_hoc' })).toBe('chua_hoc');
        expect(getProgramStatus({ status: 'planning' })).toBe('chua_hoc');
        expect(getProgramStatus({ isEnrolled: false })).toBe('chua_hoc');

        expect(getProgramStatus({ status: 'da_hoc' })).toBe('da_hoc');
        expect(getProgramStatus({ status: 'completed' })).toBe('da_hoc');

        expect(getProgramStatus({ status: 'dang_hoc' })).toBe('dang_hoc');
        expect(getProgramStatus({ status: 'active', isEnrolled: true })).toBe('dang_hoc');
    });

    it('should provide localized human-readable labels', () => {
        expect(getProgramStatusLabel('chua_hoc')).toBe('Chưa học');
        expect(getProgramStatusLabel('dang_hoc')).toBe('Đang học');
        expect(getProgramStatusLabel('da_hoc')).toBe('Đã học');

        expect(getProgramStatusLabel({ status: 'chua_hoc' })).toBe('Chưa học');
        expect(getProgramStatusLabel({ status: 'dang_hoc' })).toBe('Đang học');
        expect(getProgramStatusLabel({ status: 'da_hoc' })).toBe('Đã học');
    });

    it('should normalize program object with status and enrollment integrity', () => {
        const rawProgram = {
            id: 'nvsp-1',
            name: 'Nghiệp vụ sư phạm',
            status: 'chua_hoc',
            category: 'nhanh_a'
        };
        const normalized = normalizeProgram(rawProgram);
        expect(normalized.status).toBe('chua_hoc');
        expect(normalized.isEnrolled).toBe(false);
        expect(normalized.evaluationType).toBe('credits');
    });
});

describe('ruleValidators - Module and Category Presets', () => {
    it('should return correct presets for each category', () => {
        const daiHoc = getCategoryPresets('dai_hoc');
        expect(daiHoc.evaluationType).toBe('credits');
        expect(daiHoc.totalCreditsRequired).toBe(135);

        const nhanhB = getCategoryPresets('nhanh_b');
        expect(nhanhB.evaluationType).toBe('modules');
        expect(nhanhB.totalCreditsRequired).toBe(6);

        const nhanhC = getCategoryPresets('nhanh_c');
        expect(nhanhC.evaluationType).toBe('hours');
        expect(nhanhC.totalCreditsRequired).toBe(120);

        const nhanhA = getCategoryPresets('nhanh_a');
        expect(nhanhA.evaluationType).toBe('credits');
        expect(nhanhA.totalCreditsRequired).toBe(34);
    });

    it('should correctly check if module belongs to program', () => {
        const mod1 = { id: 'm1', programId: 'prog-a' };
        const mod2 = { id: 'm2', programIds: ['prog-a', 'prog-b'] };
        const mod3 = { id: 'm3' };

        expect(isModuleInProgram(mod1, 'prog-a')).toBe(true);
        expect(isModuleInProgram(mod1, 'prog-b')).toBe(false);
        expect(isModuleInProgram(mod2, 'prog-b')).toBe(true);
        expect(isModuleInProgram(mod3, 'prog-any')).toBe(false);
    });
});

describe('ruleValidators - calculateRuleBreakdown (Curriculum Quota Validation)', () => {
    it('should calculate existing credits in program curriculum, including unselected electives', () => {
        const program = {
            id: 'prog-nvsp',
            category: 'nhanh_a',
            evaluationType: 'credits',
            totalCreditsRequired: 34,
            rules: { mandatoryA: 15, electiveA: 20, mandatoryB: 9, practiceB: 6, electiveB: 2 }
        };

        const modules = [
            // Khối A Bắt buộc: 15 TC
            { id: 'm1', programId: 'prog-nvsp', category: 'A', type: 'mandatory', credits: 15 },
            // Khối A Tự chọn: 2 môn x 10 TC = 20 TC, but one has isSelected: false
            { id: 'm2', programId: 'prog-nvsp', category: 'A', type: 'elective', credits: 10, isSelected: true },
            { id: 'm3', programId: 'prog-nvsp', category: 'A', type: 'elective', credits: 10, isSelected: false },
            // Module from another program (should NOT be counted)
            { id: 'm4', programId: 'prog-other', category: 'A', type: 'elective', credits: 5, isSelected: true }
        ];

        const breakdown = calculateRuleBreakdown(program, modules);
        expect(breakdown).not.toBeNull();
        expect(breakdown.evalType).toBe('credits');

        // Total earned should count both m1 (15) + m2 (10) + m3 (10) = 35 TC, ignoring isSelected: false
        expect(breakdown.totalEarned).toBe(35);

        const blockA_BB = breakdown.blocks.find(b => b.id === 'mandatoryA');
        expect(blockA_BB.current).toBe(15);
        expect(blockA_BB.target).toBe(15);

        const blockA_TC = breakdown.blocks.find(b => b.id === 'electiveA');
        // Crucial: current should be 20 (both m2 and m3), not just 10 (selected)
        expect(blockA_TC.current).toBe(20);
        expect(blockA_TC.target).toBe(20);
    });

    it('should calculate existing modules for Dai Hoc programs without checking student selection', () => {
        const program = {
            id: 'prog-dh',
            category: 'dai_hoc',
            evaluationType: 'credits',
            totalCreditsRequired: 135,
            rules: { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
        };

        const modules = [
            { id: 'm1', programId: 'prog-dh', knowledgeBlock: 'general', credits: 28 },
            { id: 'm2', programId: 'prog-dh', knowledgeBlock: 'fundamental', type: 'elective', credits: 8, isSelected: false }
        ];

        const breakdown = calculateRuleBreakdown(program, modules);
        const blockFundElective = breakdown.blocks.find(b => b.id === 'fundamentalElective');
        expect(blockFundElective.current).toBe(8);
    });

    it('should count existing modules in curriculum for nhanh_b (modules)', () => {
        const program = {
            id: 'prog-b',
            category: 'nhanh_b',
            evaluationType: 'modules',
            totalCreditsRequired: 6,
            rules: { mandatoryA: 4, electiveA: 2 }
        };

        const modules = [
            { id: 'm1', programId: 'prog-b', type: 'mandatory', status: 'planned' },
            { id: 'm2', programId: 'prog-b', type: 'mandatory', status: 'in_progress' },
            { id: 'm3', programId: 'prog-b', type: 'elective', status: 'planned' }
        ];

        const breakdown = calculateRuleBreakdown(program, modules);
        expect(breakdown.totalEarned).toBe(3);
        const mand = breakdown.blocks.find(b => b.id === 'modulesMandatory');
        const elec = breakdown.blocks.find(b => b.id === 'modulesElective');
        expect(mand.current).toBe(2);
        expect(elec.current).toBe(1);
    });

    it('should distinguish THCS (Khối A & B) and THPT (Khối A & C) correctly', () => {
        const progThcs = {
            id: 'prog_nvsp_thcs_2026',
            name: 'Nghiệp vụ sư phạm THCS 2026',
            category: 'nvsp_thcs',
            evaluationType: 'credits'
        };

        const progThpt = {
            id: 'prog_nvsp_thpt_2026',
            name: 'Nghiệp vụ sư phạm THPT 2026',
            category: 'nvsp_thpt',
            evaluationType: 'credits'
        };

        expect(isThcsProgram(progThcs)).toBe(true);
        expect(isThptProgram(progThcs)).toBe(false);

        expect(isThptProgram(progThpt)).toBe(true);
        expect(isThcsProgram(progThpt)).toBe(false);

        // Breakdown for THCS: only contains Khối A and Khối B
        const breakdownThcs = calculateRuleBreakdown(progThcs, []);
        expect(breakdownThcs.levelLabel).toBe('NVSP THCS - Khối A & B');
        expect(breakdownThcs.blocks.map(b => b.id)).toEqual([
            'mandatoryA', 'electiveA', 'mandatoryB', 'practiceB', 'electiveB'
        ]);
        expect(breakdownThcs.totalTarget).toBe(34);

        // Breakdown for THPT: only contains Khối A and Khối C
        const breakdownThpt = calculateRuleBreakdown(progThpt, []);
        expect(breakdownThpt.levelLabel).toBe('NVSP THPT - Khối A & C');
        expect(breakdownThpt.blocks.map(b => b.id)).toEqual([
            'mandatoryA', 'electiveA', 'mandatoryC', 'practiceC', 'electiveC'
        ]);
        expect(breakdownThpt.totalTarget).toBe(36);
    });
});

