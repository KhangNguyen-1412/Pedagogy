import { isModuleInProgram } from './ruleValidators';

// ─── GPA HELPER FUNCTIONS ──────────────────────────────────────────────────
export const calculateModuleFinal = (grades, weights = { attendance: 10, midterm: 30, final: 60 }) => {
    const att = Number(grades?.attendance || 0);
    const mid = Number(grades?.midterm || 0);
    const fin = Number(grades?.final || 0);
    const wAtt = (weights?.attendance || 10) / 100;
    const wMid = (weights?.midterm || 30) / 100;
    const wFin = (weights?.final || 60) / 100;
    const score10 = Math.round((att * wAtt + mid * wMid + fin * wFin) * 10) / 10;
    
    let letter = 'F';
    let gpa4 = 0.0;
    if (score10 >= 9.0) { letter = 'A+'; gpa4 = 4.0; }
    else if (score10 >= 8.5) { letter = 'A'; gpa4 = 3.8; }
    else if (score10 >= 8.0) { letter = 'B+'; gpa4 = 3.5; }
    else if (score10 >= 7.0) { letter = 'B'; gpa4 = 3.0; }
    else if (score10 >= 6.5) { letter = 'C+'; gpa4 = 2.5; }
    else if (score10 >= 5.5) { letter = 'C'; gpa4 = 2.0; }
    else if (score10 >= 5.0) { letter = 'D+'; gpa4 = 1.5; }
    else if (score10 >= 4.0) { letter = 'D'; gpa4 = 1.0; }
    else { letter = 'F'; gpa4 = 0.0; }

    return { score10, letter, gpa4 };
};

export const calculateOverallGPA = (modules, programs = [], selectedProgramFilter = 'all') => {
    let totalWeightedScore10 = 0;
    let totalWeightedGPA4 = 0;
    let totalGradedCredits = 0;
    let earnedCredits = 0;

    let activePrograms = programs.filter(p => p.isEnrolled !== false && p.status !== 'completed');
    if (selectedProgramFilter !== 'all') {
        activePrograms = programs.filter(p => p.id === selectedProgramFilter);
    }
    const activeProgramIds = activePrograms.map(p => p.id);

    // Deduplicate: each module counted only once even if shared across programs
    const seenModuleIds = new Set();
    const activeMods = modules.filter(m => {
        if (seenModuleIds.has(m.id)) return false;
        const inProg = activeProgramIds.length === 0 || activeProgramIds.some(pId => isModuleInProgram(m, pId));
        const isSelectedType = m.type !== 'elective' || m.isSelected;
        if (inProg && isSelectedType) {
            seenModuleIds.add(m.id);
            return true;
        }
        return false;
    });

    const totalProgramCredits = activeMods.reduce((sum, m) => sum + Number(m.credits || 0), 0);

    activeMods.forEach(m => {
        const cr = Number(m.credits || 0);
        if (m.grades) {
            const { score10, letter, gpa4 } = calculateModuleFinal(m.grades, m.syllabus?.weights);
            totalWeightedScore10 += score10 * cr;
            totalWeightedGPA4 += gpa4 * cr;
            totalGradedCredits += cr;
            if (letter !== 'F' && score10 >= 4.0) {
                earnedCredits += cr;
            }
        }
    });

    const gpa10 = totalGradedCredits > 0 ? (totalWeightedScore10 / totalGradedCredits).toFixed(2) : '0.00';
    const gpa4 = totalGradedCredits > 0 ? (totalWeightedGPA4 / totalGradedCredits).toFixed(2) : '0.00';

    let rank = 'Chưa xếp loại';
    const num4 = parseFloat(gpa4);
    if (num4 >= 3.6) rank = 'Xuất sắc';
    else if (num4 >= 3.2) rank = 'Giỏi';
    else if (num4 >= 2.5) rank = 'Khá';
    else if (num4 >= 2.0) rank = 'Trung bình';
    else if (totalGradedCredits > 0) rank = 'Yếu - Yêu cầu cố gắng';

    return {
        gpa10,
        gpa4,
        totalCredits: totalGradedCredits,
        earnedCredits,
        totalProgramCredits,
        activeModulesCount: activeMods.length,
        rank
    };
};
