import { describe, it, expect } from 'vitest';
import { calculateModuleFinal, calculateOverallGPA } from '../gpaCalculators';

describe('gpaCalculators - calculateModuleFinal', () => {
    it('should calculate correct 10-scale, 4-scale, and letter grade with default weights', () => {
        // Attendance (10%), Midterm (30%), Final (60%)
        // 10*0.1 + 8*0.3 + 9*0.6 = 1.0 + 2.4 + 5.4 = 8.8
        const result = calculateModuleFinal({ attendance: 10, midterm: 8, final: 9 });
        expect(result.score10).toBe(8.8);
        expect(result.letter).toBe('A');
        expect(result.gpa4).toBe(3.8);
    });

    it('should handle maximum scores (A+ / 4.0)', () => {
        const result = calculateModuleFinal({ attendance: 10, midterm: 10, final: 10 });
        expect(result.score10).toBe(10);
        expect(result.letter).toBe('A+');
        expect(result.gpa4).toBe(4.0);
    });

    it('should handle custom weights correctly', () => {
        // Attendance 20%, Midterm 20%, Final 60%
        // 5*0.2 + 5*0.2 + 5*0.6 = 5.0
        const result = calculateModuleFinal(
            { attendance: 5, midterm: 5, final: 5 },
            { attendance: 20, midterm: 20, final: 60 }
        );
        expect(result.score10).toBe(5.0);
        expect(result.letter).toBe('D+');
        expect(result.gpa4).toBe(1.5);
    });

    it('should assign F and 0.0 for failing scores (< 4.0)', () => {
        const result = calculateModuleFinal({ attendance: 3, midterm: 3, final: 3 });
        expect(result.score10).toBe(3.0);
        expect(result.letter).toBe('F');
        expect(result.gpa4).toBe(0.0);
    });
});

describe('gpaCalculators - calculateOverallGPA', () => {
    const mockPrograms = [
        { id: 'prog-1', name: 'Nghiệp vụ sư phạm', status: 'dang_hoc', isEnrolled: true },
        { id: 'prog-2', name: 'Đại học Sư phạm', status: 'chua_hoc', isEnrolled: false }
    ];

    const mockModules = [
        {
            id: 'mod-1',
            programId: 'prog-1',
            credits: 3,
            type: 'mandatory',
            grades: { attendance: 9, midterm: 9, final: 9 }
        },
        {
            id: 'mod-2',
            programId: 'prog-1',
            credits: 2,
            type: 'mandatory',
            grades: { attendance: 8, midterm: 8, final: 8 }
        },
        {
            id: 'mod-3',
            programId: 'prog-2',
            credits: 4,
            type: 'mandatory',
            grades: { attendance: 10, midterm: 10, final: 10 }
        }
    ];

    it('should compute weighted GPA correctly for active programs only', () => {
        const stats = calculateOverallGPA(mockModules, mockPrograms, 'all');
        // Only prog-1 is active (prog-2 is chua_hoc)
        // mod-1: score10 = 9.0, gpa4 = 4.0, credits = 3
        // mod-2: score10 = 8.0, gpa4 = 3.5, credits = 2
        // Total credits = 5
        // Weighted 10: (9*3 + 8*2) / 5 = 43 / 5 = 8.6
        // Weighted 4: (4.0*3 + 3.5*2) / 5 = 19 / 5 = 3.8
        expect(Number(stats.gpa10)).toBe(8.6);
        expect(Number(stats.gpa4)).toBe(3.8);
        expect(stats.earnedCredits).toBe(5);
    });

    it('should handle empty module list gracefully', () => {
        const stats = calculateOverallGPA([], mockPrograms, 'all');
        expect(stats.gpa10).toBe('0.00');
        expect(stats.gpa4).toBe('0.00');
        expect(stats.earnedCredits).toBe(0);
    });
});
