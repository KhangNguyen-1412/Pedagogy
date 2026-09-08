import { describe, it, expect } from 'vitest';
import {
    PROGRAM_STATUSES,
    getProgramStatus,
    getProgramStatusLabel,
    normalizeProgram,
    isModuleInProgram,
    getCategoryPresets
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
