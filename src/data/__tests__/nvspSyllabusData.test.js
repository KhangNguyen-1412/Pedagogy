import { describe, it, expect } from 'vitest';
import { NVSP_MODULES, normalizeNvspCode, findNvspMasterModule, enrichModuleWithNvspSyllabus } from '../nvspSyllabusData';
import { DEFAULT_MODULES } from '../trainingData';

describe('NVSP Syllabi Data (Thông tư 12/2021/TT-BGDĐT & HCMUE)', () => {
    it('contains all 16 pedagogical modules with correct codes', () => {
        const codes = NVSP_MODULES.map(m => m.code);
        expect(codes).toContain('A12');
        expect(codes).toContain('A07');
        expect(codes).toContain('A10');
        expect(codes).toContain('A6');
        expect(codes).toContain('A4');
        expect(codes).toContain('A05');
        expect(codes).toContain('A1');
        expect(codes).toContain('A2');
        expect(codes).toContain('A3');
        expect(codes).toContain('A08');
        expect(codes).toContain('A9');
        expect(codes).toContain('A11');
        expect(codes).toContain('A14');
        expect(codes).toContain('A15');
        expect(codes).toContain('A16');
        expect(codes).toContain('A17');
        expect(NVSP_MODULES.length).toBe(16);
    });

    it('all NVSP modules are included in DEFAULT_MODULES', () => {
        const defaultCodes = DEFAULT_MODULES.map(m => m.code);
        expect(defaultCodes).toContain('A12');
        expect(defaultCodes).toContain('A07');
        expect(defaultCodes).toContain('A10');
        expect(defaultCodes).toContain('A6');
        expect(defaultCodes).toContain('A4');
        expect(defaultCodes).toContain('A05');
        expect(defaultCodes).toContain('A08');
        expect(defaultCodes).toContain('A9');
        expect(defaultCodes).toContain('A11');
    });

    it('A12 has correct syllabus hours breakdown, 13 activities, 4 objectives, and 7 references', () => {
        const a12 = NVSP_MODULES.find(m => m.code === 'A12');
        expect(a12).toBeDefined();
        expect(a12.credits).toBe(2);
        expect(a12.prerequisites).toBe('Giáo dục học (A2)');
        expect(a12.syllabus.hoursBreakdown.theory).toBe(10);
        expect(a12.syllabus.hoursBreakdown.practice).toBe(40);
        expect(a12.syllabus.hoursBreakdown.inPerson).toBe(15);
        expect(a12.syllabus.hoursBreakdown.online).toBe(35);
        expect(a12.syllabus.objectives.length).toBe(4);
        expect(a12.syllabus.learningStages.length).toBe(3);
        const totalActs = a12.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBe(14); // Hoạt động 0 đến Hoạt động 13
        expect(a12.syllabus.references.length).toBe(7);
        expect(a12.syllabus.evaluationScheme.formative.length).toBe(2);
        expect(a12.syllabus.evaluationScheme.summative.weight).toBe(50);
        expect(a12.instructor).toBe('ThS. Đặng Văn Khoa');
        expect(a12.syllabus.authorTeam[0]).toContain('TS. Thái Hoài Minh');
    });

    it('A07 has 90 practice hours, 14 author members, 4 objectives, and 3 references', () => {
        const a07 = NVSP_MODULES.find(m => m.code === 'A07');
        expect(a07).toBeDefined();
        expect(a07.credits).toBe(3);
        expect(a07.prerequisites).toBe('Không');
        expect(a07.syllabus.hoursBreakdown.theory).toBe(0);
        expect(a07.syllabus.hoursBreakdown.practice).toBe(90);
        expect(a07.syllabus.hoursBreakdown.inPerson).toBe(30);
        expect(a07.syllabus.hoursBreakdown.online).toBe(60);
        expect(a07.syllabus.authorTeam.length).toBe(14);
        expect(a07.syllabus.objectives.length).toBe(4);
        expect(a07.syllabus.objectives.map(o => o.code)).toEqual(['T1', 'T2', 'T3', 'T4']);
        expect(a07.syllabus.references.length).toBe(3);
        expect(a07.syllabus.approver).toContain('TS. Mai Thu Trang');
        expect(a07.instructor).toBe('ThS. Nguyễn Thị Thu Trang');
        expect(a07.syllabus.authorTeam).not.toContain('ThS. Nguyễn Thị Thu Trang');
    });

    it('A10 (Quản lý lớp học) has 45 hours, 3 authors, 2 objectives, and 7 references', () => {
        const a10 = NVSP_MODULES.find(m => m.code === 'A10');
        expect(a10).toBeDefined();
        expect(a10.credits).toBe(2);
        expect(a10.prerequisites).toBe('Giáo dục học và Tâm lý học giáo dục');
        expect(a10.syllabus.hoursBreakdown.total).toBe(45);
        expect(a10.syllabus.hoursBreakdown.theory).toBe(15);
        expect(a10.syllabus.hoursBreakdown.practice).toBe(30);
        expect(a10.syllabus.hoursBreakdown.inPerson).toBe(15);
        expect(a10.syllabus.hoursBreakdown.online).toBe(30);
        expect(a10.syllabus.authorTeam.length).toBe(3);
        expect(a10.syllabus.authorTeam[0]).toContain('TS.GVC Nguyễn Thị Bích Hồng');
        expect(a10.instructor).toBe('TS. Lê Thị Minh Hương');
        expect(a10.syllabus.authorTeam).not.toContain('TS. Lê Thị Minh Hương');
        expect(a10.syllabus.objectives.length).toBe(2);
        expect(a10.syllabus.contentOutline.length).toBe(2);
        expect(a10.syllabus.references.length).toBe(7);
        const totalActs = a10.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBe(7);
        expect(a10.syllabus.evaluationScheme.formative.length).toBe(2);
        expect(a10.syllabus.evaluationScheme.summative.weight).toBe(50);
    });

    it('A6 has >= 8 online activities and in-person roleplay', () => {
        const a6 = NVSP_MODULES.find(m => m.code === 'A6');
        expect(a6).toBeDefined();
        expect(a6.syllabus.hoursBreakdown.inPerson).toBe(40);
        expect(a6.syllabus.hoursBreakdown.online).toBe(10);
        const onlineStage = a6.syllabus.learningStages.find(s => s.stageName.includes('TRỰC TUYẾN'));
        expect(onlineStage.activities.length).toBeGreaterThanOrEqual(8);
        expect(a6.syllabus.authorTeam.length).toBe(4);
    });

    it('A4 (Đánh giá trong giáo dục) has 16 HCMUE authors, O1-O4 objectives, and full stages', () => {
        const a4 = NVSP_MODULES.find(m => m.code === 'A4');
        expect(a4).toBeDefined();
        expect(a4.syllabus.authorTeam.length).toBe(16);
        expect(a4.syllabus.objectives.length).toBe(4);
        expect(a4.syllabus.contentOutline.length).toBe(4);
        expect(a4.syllabus.hoursBreakdown.theory).toBe(15);
        expect(a4.syllabus.hoursBreakdown.practice).toBe(30);
        expect(a4.syllabus.evaluationScheme.formative.length).toBe(2);
        expect(a4.syllabus.evaluationScheme.summative).toBeDefined();
    });

    it('A05 (Quản lý nhà nước về giáo dục) has 2 HCMUE authors, 4 parts, and 40 hours', () => {
        const a05 = NVSP_MODULES.find(m => m.code === 'A05');
        expect(a05).toBeDefined();
        expect(a05.syllabus.authorTeam.length).toBe(2);
        expect(a05.syllabus.objectives.length).toBe(4);
        expect(a05.syllabus.contentOutline.length).toBe(4);
        expect(a05.syllabus.hoursBreakdown.total).toBe(40);
        expect(a05.syllabus.hoursBreakdown.theory).toBe(20);
        expect(a05.syllabus.hoursBreakdown.practice).toBe(20);
        expect(a05.syllabus.evaluationScheme.formative.length).toBeGreaterThanOrEqual(1);
        expect(a05.syllabus.evaluationScheme.summative).toBeDefined();
    });

    it('differentiates teaching instructor from authorTeam for all NVSP modules', () => {
        NVSP_MODULES.forEach(module => {
            expect(module.instructor).toBeDefined();
            expect(module.instructor.length).toBeGreaterThan(0);
            expect(module.syllabus.authorTeam).toBeDefined();
            expect(module.syllabus.authorTeam.length).toBeGreaterThan(0);
            expect(module.syllabus.instructor).toBe(module.instructor);
            expect(module.syllabus.instructorEmail).toMatch(/@lecturer\.hcmue\.edu\.vn$/);
        });
    });

    it('A1 (Tâm lý học giáo dục) has complete stages, CLOs, and > 10 activities', () => {
        const a1 = NVSP_MODULES.find(m => m.code === 'A1');
        expect(a1).toBeDefined();
        expect(a1.syllabus.hoursBreakdown.theory).toBe(15);
        expect(a1.syllabus.hoursBreakdown.practice).toBe(30);
        expect(a1.syllabus.clos.length).toBeGreaterThanOrEqual(4);
        expect(a1.syllabus.contentOutline.length).toBeGreaterThanOrEqual(4);
        const totalActs = a1.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBeGreaterThanOrEqual(10);
        expect(a1.syllabus.deliverables.online.length).toBeGreaterThanOrEqual(2);
        expect(a1.syllabus.deliverables.inPerson.length).toBeGreaterThanOrEqual(2);
    });

    it('A2 (Giáo dục học) has complete stages, CLOs, and > 10 activities', () => {
        const a2 = NVSP_MODULES.find(m => m.code === 'A2');
        expect(a2).toBeDefined();
        expect(a2.syllabus.hoursBreakdown.theory).toBe(25);
        expect(a2.syllabus.hoursBreakdown.practice).toBe(45);
        expect(a2.syllabus.clos.length).toBeGreaterThanOrEqual(4);
        expect(a2.syllabus.contentOutline.length).toBeGreaterThanOrEqual(4);
        const totalActs = a2.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBeGreaterThanOrEqual(10);
        expect(a2.syllabus.deliverables.online.length).toBeGreaterThanOrEqual(2);
        expect(a2.syllabus.deliverables.inPerson.length).toBeGreaterThanOrEqual(2);
    });

    it('A3 (Lý luận dạy học) has complete stages, CLOs, and > 10 activities', () => {
        const a3 = NVSP_MODULES.find(m => m.code === 'A3');
        expect(a3).toBeDefined();
        expect(a3.syllabus.hoursBreakdown.theory).toBe(20);
        expect(a3.syllabus.hoursBreakdown.practice).toBe(50);
        expect(a3.syllabus.clos.length).toBeGreaterThanOrEqual(4);
        expect(a3.syllabus.contentOutline.length).toBeGreaterThanOrEqual(4);
        const totalActs = a3.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBeGreaterThanOrEqual(10);
        expect(a3.syllabus.deliverables.online.length).toBeGreaterThanOrEqual(2);
        expect(a3.syllabus.deliverables.inPerson.length).toBeGreaterThanOrEqual(2);
    });

    it('normalizeNvspCode correctly normalizes A01-A07 and preserves others', () => {
        expect(normalizeNvspCode('A04')).toBe('A4');
        expect(normalizeNvspCode('A4')).toBe('A4');
        expect(normalizeNvspCode('A01')).toBe('A1');
        expect(normalizeNvspCode('A05')).toBe('A5');
        expect(normalizeNvspCode('A12')).toBe('A12');
    });

    it('findNvspMasterModule matches modules with A04 or A4', () => {
        const match1 = findNvspMasterModule({ code: 'A04', name: 'Đánh giá trong giáo dục' });
        expect(match1).toBeDefined();
        expect(match1.code).toBe('A4');
        expect(match1.instructor).toBe('TS. Hoàng Thị Minh Phương');

        const match2 = findNvspMasterModule({ code: 'A4' });
        expect(match2).toBeDefined();
        expect(match2.instructor).toBe('TS. Hoàng Thị Minh Phương');
    });

    it('findNvspMasterModule matches A7 and A07 to Rèn luyện nghiệp vụ sư phạm', () => {
        const matchA7 = findNvspMasterModule({ code: 'A7' });
        expect(matchA7).toBeDefined();
        expect(matchA7.code).toBe('A07');
        expect(matchA7.name).toBe('Rèn luyện nghiệp vụ sư phạm');

        const matchA07 = findNvspMasterModule({ code: 'A07' });
        expect(matchA07).toBeDefined();
        expect(matchA07.code).toBe('A07');
    });

    it('findNvspMasterModule matches A12 to Ứng dụng công nghệ thông tin trong dạy học', () => {
        const matchA12 = findNvspMasterModule({ code: 'A12' });
        expect(matchA12).toBeDefined();
        expect(matchA12.code).toBe('A12');
        expect(matchA12.name).toBe('Ứng dụng công nghệ thông tin trong dạy học');
    });

    it('findNvspMasterModule matches A10 to Quản lý lớp học', () => {
        const matchA10 = findNvspMasterModule({ code: 'A10' });
        expect(matchA10).toBeDefined();
        expect(matchA10.code).toBe('A10');
        expect(matchA10.name).toBe('Quản lý lớp học');

        const matchByName = findNvspMasterModule({ name: 'Quản lý lớp học' });
        expect(matchByName).toBeDefined();
        expect(matchByName.code).toBe('A10');
    });

    it('enrichModuleWithNvspSyllabus automatically populates rich syllabus for stub modules', () => {
        const stubA04 = { id: 'test_a04', code: 'A04', name: 'Đánh giá trong giáo dục', credits: 2 };
        const enriched = enrichModuleWithNvspSyllabus(stubA04);
        expect(enriched.instructor).toBe('TS. Hoàng Thị Minh Phương');
        expect(enriched.syllabus.authorTeam.length).toBe(16);
        expect(enriched.syllabus.hoursBreakdown.total).toBe(45);
        expect(enriched.syllabus.learningStages.length).toBe(2);

        const stubA7 = { id: 'test_a7', code: 'A7', name: 'Rèn luyện nghiệp vụ sư phạm', credits: 3 };
        const enrichedA7 = enrichModuleWithNvspSyllabus(stubA7);
        expect(enrichedA7.instructor).toBe('ThS. Nguyễn Thị Thu Trang');
        expect(enrichedA7.syllabus.hoursBreakdown.practice).toBe(90);
        expect(enrichedA7.syllabus.authorTeam.length).toBe(14);

        const stubA12 = { id: 'test_a12', code: 'A12', name: 'Ứng dụng công nghệ thông tin trong dạy học', credits: 2 };
        const enrichedA12 = enrichModuleWithNvspSyllabus(stubA12);
        expect(enrichedA12.instructor).toBe('ThS. Đặng Văn Khoa');
        expect(enrichedA12.syllabus.hoursBreakdown.total).toBe(50);
        expect(enrichedA12.syllabus.references.length).toBe(7);

        const stubA10 = { id: 'test_a10', code: 'A10', name: 'Quản lý lớp học', credits: 2 };
        const enrichedA10 = enrichModuleWithNvspSyllabus(stubA10);
        expect(enrichedA10.instructor).toBe('TS. Lê Thị Minh Hương');
        expect(enrichedA10.syllabus.hoursBreakdown.total).toBe(45);
        expect(enrichedA10.syllabus.authorTeam.length).toBe(3);
        expect(enrichedA10.syllabus.references.length).toBe(7);
    });

    it('A08 (Hoạt động giáo dục ở trường phổ thông) has 45 hours, 2 authors, 9 objectives, and 4 references', () => {
        const a08 = NVSP_MODULES.find(m => m.code === 'A08');
        expect(a08).toBeDefined();
        expect(a08.credits).toBe(2);
        expect(a08.prerequisites).toBe('Giáo dục học');
        expect(a08.syllabus.hoursBreakdown.total).toBe(45);
        expect(a08.syllabus.hoursBreakdown.theory).toBe(15);
        expect(a08.syllabus.hoursBreakdown.practice).toBe(30);
        expect(a08.syllabus.hoursBreakdown.inPerson).toBe(20);
        expect(a08.syllabus.hoursBreakdown.online).toBe(10);
        expect(a08.syllabus.authorTeam.length).toBe(2);
        expect(a08.syllabus.authorTeam[0]).toContain('ThS. Võ Thị Hồng Trước');
        expect(a08.syllabus.approver).toContain('TS. Nguyễn Đức Danh');
        expect(a08.instructor).toBe('TS. Trần Thị Hương');
        expect(a08.syllabus.authorTeam).not.toContain('TS. Trần Thị Hương');
        expect(a08.syllabus.objectives.length).toBe(9);
        expect(a08.syllabus.contentOutline.length).toBe(4);
        expect(a08.syllabus.references.length).toBe(4);
        expect(a08.syllabus.evaluationScheme.formative.length).toBe(2);
        expect(a08.syllabus.evaluationScheme.summative.weight).toBe(50);
    });

    it('A9 (Kỷ luật tích cực) has 45 hours, 3 authors, 4 objectives, and 6 references', () => {
        const a9 = NVSP_MODULES.find(m => m.code === 'A9');
        expect(a9).toBeDefined();
        expect(a9.credits).toBe(2);
        expect(a9.prerequisites).toBe('Giáo dục học');
        expect(a9.syllabus.hoursBreakdown.total).toBe(45);
        expect(a9.syllabus.hoursBreakdown.theory).toBe(15);
        expect(a9.syllabus.hoursBreakdown.practice).toBe(30);
        expect(a9.syllabus.hoursBreakdown.inPerson).toBe(15);
        expect(a9.syllabus.hoursBreakdown.online).toBe(30);
        expect(a9.syllabus.authorTeam.length).toBe(3);
        expect(a9.syllabus.approver).toContain('TS. Võ Thị Tường Vy');
        expect(a9.instructor).toBe('ThS. Nguyễn Văn Thắng');
        expect(a9.syllabus.authorTeam).not.toContain('ThS. Nguyễn Văn Thắng');
        expect(a9.syllabus.objectives.length).toBe(4);
        expect(a9.syllabus.contentOutline.length).toBe(4);
        expect(a9.syllabus.references.length).toBe(6);
        expect(a9.syllabus.evaluationScheme.formative.length).toBe(2);
        expect(a9.syllabus.evaluationScheme.summative.weight).toBe(50);
    });

    it('A11 (Kỹ thuật dạy học tích cực) has 50 hours, 14 authors, 3 objectives, and 2 references', () => {
        const a11 = NVSP_MODULES.find(m => m.code === 'A11');
        expect(a11).toBeDefined();
        expect(a11.credits).toBe(2);
        expect(a11.prerequisites).toBe('Giáo dục học');
        expect(a11.syllabus.hoursBreakdown.total).toBe(50);
        expect(a11.syllabus.hoursBreakdown.theory).toBe(10);
        expect(a11.syllabus.hoursBreakdown.practice).toBe(40);
        expect(a11.syllabus.hoursBreakdown.inPerson).toBe(40);
        expect(a11.syllabus.hoursBreakdown.online).toBe(10);
        expect(a11.syllabus.authorTeam.length).toBe(14);
        expect(a11.syllabus.approver).toContain('TS. Nguyễn Thanh Nga');
        expect(a11.instructor).toBe('TS. Cao Thị Châu Thủy');
        expect(a11.syllabus.authorTeam).not.toContain('TS. Cao Thị Châu Thủy');
        expect(a11.syllabus.objectives.length).toBe(3);
        expect(a11.syllabus.contentOutline.length).toBe(3);
        expect(a11.syllabus.references.length).toBe(2);
        expect(a11.syllabus.evaluationScheme.formative.length).toBe(2);
        expect(a11.syllabus.evaluationScheme.summative.weight).toBe(50);
    });

    it('findNvspMasterModule matches A08, A9, and A11 by code and name', () => {
        const matchA08 = findNvspMasterModule({ code: 'A08' });
        expect(matchA08).toBeDefined();
        expect(matchA08.code).toBe('A08');
        expect(matchA08.name).toBe('Hoạt động giáo dục ở trường phổ thông');

        const matchA8 = findNvspMasterModule({ code: 'A8' });
        expect(matchA8).toBeDefined();
        expect(matchA8.code).toBe('A08');

        const matchA9 = findNvspMasterModule({ code: 'A9' });
        expect(matchA9).toBeDefined();
        expect(matchA9.code).toBe('A9');
        expect(matchA9.name).toBe('Kỷ luật tích cực');

        const matchA11 = findNvspMasterModule({ code: 'A11' });
        expect(matchA11).toBeDefined();
        expect(matchA11.code).toBe('A11');
        expect(matchA11.name).toBe('Kỹ thuật dạy học tích cực');

        const matchByName11 = findNvspMasterModule({ name: 'kỹ thuật dạy học tích cực' });
        expect(matchByName11).toBeDefined();
        expect(matchByName11.code).toBe('A11');

        const matchA14 = findNvspMasterModule({ code: 'A14' });
        expect(matchA14).toBeDefined();
        expect(matchA14.code).toBe('A14');
        expect(matchA14.name).toContain('STEM');

        const matchA15 = findNvspMasterModule({ code: 'A15' });
        expect(matchA15).toBeDefined();
        expect(matchA15.code).toBe('A15');
        expect(matchA15.name).toContain('giá trị sống');

        const matchA16 = findNvspMasterModule({ code: 'A16' });
        expect(matchA16).toBeDefined();
        expect(matchA16.code).toBe('A16');
        expect(matchA16.name).toContain('phát triển bền vững');

        const matchA17 = findNvspMasterModule({ code: 'A17' });
        expect(matchA17).toBeDefined();
        expect(matchA17.code).toBe('A17');
        expect(matchA17.name).toContain('môi trường giáo dục');
    });

    it('A14 STEM has correct hours, objectives, 3 chapters, and references', () => {
        const a14 = NVSP_MODULES.find(m => m.code === 'A14');
        expect(a14).toBeDefined();
        expect(a14.credits).toBe(2);
        expect(a14.syllabus.hoursBreakdown.theory).toBe(10);
        expect(a14.syllabus.hoursBreakdown.practice).toBe(40);
        expect(a14.syllabus.hoursBreakdown.inPerson).toBe(40);
        expect(a14.syllabus.hoursBreakdown.online).toBe(10);
        expect(a14.syllabus.objectives.length).toBe(3);
        expect(a14.syllabus.contentOutline.length).toBe(3);
        expect(a14.syllabus.references.length).toBe(5);
        expect(a14.syllabus.learningStages.length).toBe(2);
        const totalActs = a14.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBe(6); // 2 online + 4 inPerson
    });

    it('A15 Giá trị sống & Kỹ năng sống has 50 hours, 14 values, and 13 activities', () => {
        const a15 = NVSP_MODULES.find(m => m.code === 'A15');
        expect(a15).toBeDefined();
        expect(a15.credits).toBe(2);
        expect(a15.syllabus.hoursBreakdown.total).toBe(50);
        expect(a15.syllabus.hoursBreakdown.online).toBe(15);
        expect(a15.syllabus.hoursBreakdown.inPerson).toBe(35);
        expect(a15.syllabus.objectives.length).toBe(3);
        expect(a15.syllabus.contentOutline.length).toBe(3);
        expect(a15.syllabus.contentOutline[1].items[1]).toContain('14 Giá trị sống');
        expect(a15.syllabus.references.length).toBe(5);
        expect(a15.syllabus.learningStages.length).toBe(2);
        const totalActs = a15.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBe(13); // 9 online + 4 inPerson
    });

    it('A16 Phát triển bền vững has 45 hours, 3 parts, and international references', () => {
        const a16 = NVSP_MODULES.find(m => m.code === 'A16');
        expect(a16).toBeDefined();
        expect(a16.credits).toBe(2);
        expect(a16.syllabus.hoursBreakdown.total).toBe(45);
        expect(a16.syllabus.hoursBreakdown.theory).toBe(15);
        expect(a16.syllabus.hoursBreakdown.practice).toBe(30);
        expect(a16.syllabus.objectives.length).toBe(3);
        expect(a16.syllabus.contentOutline.length).toBe(3);
        expect(a16.syllabus.references.length).toBe(5);
        const totalActs = a16.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBe(9); // 4 online + 5 inPerson
    });

    it('A17 Môi trường giáo dục has 45 hours, 7 objectives, and 11 references', () => {
        const a17 = NVSP_MODULES.find(m => m.code === 'A17');
        expect(a17).toBeDefined();
        expect(a17.credits).toBe(2);
        expect(a17.syllabus.hoursBreakdown.theory).toBe(15);
        expect(a17.syllabus.hoursBreakdown.practice).toBe(30);
        expect(a17.syllabus.hoursBreakdown.online).toBe(30);
        expect(a17.syllabus.hoursBreakdown.inPerson).toBe(15);
        expect(a17.syllabus.objectives.length).toBe(7);
        expect(a17.syllabus.contentOutline.length).toBe(2);
        expect(a17.syllabus.references.length).toBe(11);
        const totalActs = a17.syllabus.learningStages.flatMap(s => s.activities).length;
        expect(totalActs).toBe(6); // 3 online + 3 inPerson
    });

    it('enrichModuleWithNvspSyllabus automatically populates rich syllabus for A08, A9, A11, A14, A15, A16, A17 stubs', () => {
        const stubA08 = { id: 'test_a08', code: 'A08', name: 'Hoạt động giáo dục ở trường phổ thông', credits: 2 };
        const enrichedA08 = enrichModuleWithNvspSyllabus(stubA08);
        expect(enrichedA08.instructor).toBe('TS. Trần Thị Hương');
        expect(enrichedA08.syllabus.authorTeam.length).toBe(2);
        expect(enrichedA08.syllabus.hoursBreakdown.total).toBe(45);
        expect(enrichedA08.syllabus.objectives.length).toBe(9);

        const stubA9 = { id: 'test_a9', code: 'A9', name: 'Kỷ luật tích cực', credits: 2 };
        const enrichedA9 = enrichModuleWithNvspSyllabus(stubA9);
        expect(enrichedA9.instructor).toBe('ThS. Nguyễn Văn Thắng');
        expect(enrichedA9.syllabus.authorTeam.length).toBe(3);
        expect(enrichedA9.syllabus.hoursBreakdown.total).toBe(45);
        expect(enrichedA9.syllabus.references.length).toBe(6);

        const stubA11 = { id: 'test_a11', code: 'A11', name: 'Kỹ thuật dạy học tích cực', credits: 2 };
        const enrichedA11 = enrichModuleWithNvspSyllabus(stubA11);
        expect(enrichedA11.instructor).toBe('TS. Cao Thị Châu Thủy');
        expect(enrichedA11.syllabus.authorTeam.length).toBe(14);
        expect(enrichedA11.syllabus.hoursBreakdown.total).toBe(50);
        expect(enrichedA11.syllabus.objectives.length).toBe(3);

        const stubA14 = { id: 'test_a14', code: 'A14', name: 'Tổ chức hoạt động giáo dục STEM ở trường phổ thông', credits: 2 };
        const enrichedA14 = enrichModuleWithNvspSyllabus(stubA14);
        expect(enrichedA14.instructor).toBe('ThS. Vũ Đình Chuẩn');
        expect(enrichedA14.syllabus.hoursBreakdown.total).toBe(50);
        expect(enrichedA14.syllabus.objectives.length).toBe(3);

        const stubA15 = { id: 'test_a15', code: 'A15', name: 'Giáo dục giá trị sống và kỹ năng sống', credits: 2 };
        const enrichedA15 = enrichModuleWithNvspSyllabus(stubA15);
        expect(enrichedA15.instructor).toBe('ThS. Nguyễn Văn Hiến');
        expect(enrichedA15.syllabus.authorTeam.length).toBe(2);
        expect(enrichedA15.syllabus.hoursBreakdown.total).toBe(50);

        const stubA16 = { id: 'test_a16', code: 'A16', name: 'Giáo dục vì sự phát triển bền vững', credits: 2 };
        const enrichedA16 = enrichModuleWithNvspSyllabus(stubA16);
        expect(enrichedA16.instructor).toBe('ThS. Lê Thị Thu Liễu');
        expect(enrichedA16.syllabus.hoursBreakdown.total).toBe(45);

        const stubA17 = { id: 'test_a17', code: 'A17', name: 'Xây dựng môi trường giáo dục', credits: 2 };
        const enrichedA17 = enrichModuleWithNvspSyllabus(stubA17);
        expect(enrichedA17.instructor).toBe('TS. Dư Thống Nhất');
        expect(enrichedA17.syllabus.objectives.length).toBe(7);
    });
});

