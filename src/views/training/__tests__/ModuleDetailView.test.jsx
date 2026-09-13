import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ModuleDetailView } from '../ModuleDetailView';
import { ScrollProvider } from '../../../context/ScrollContext';

describe('ModuleDetailView alignment with Detailed Syllabus (SyllabusView)', () => {
    const mockPrograms = [
        {
            id: 'prog_nvsp_thpt',
            name: 'Nghiệp vụ Sư phạm THPT - ĐH Sư phạm TP.HCM',
            status: 'dang_hoc',
            totalCreditsRequired: 34
        }
    ];

    const mockModules = [
        {
            id: 'mod_a12',
            code: 'A12',
            name: 'Ứng dụng công nghệ thông tin trong dạy học',
            credits: 2,
            programIds: ['prog_nvsp_thpt'],
            instructor: 'ThS. Đặng Văn Khoa',
            instructorEmail: 'khoadv@lecturer.hcmue.edu.vn',
            prerequisites: 'Giáo dục học (A2)',
            type: 'elective',
            status: 'in_progress',
            grades: {
                attendance: 9,
                midterm: 8.5,
                final: 9.0
            },
            syllabus: {
                legalBasis: 'Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021',
                authorTeam: ['TS. Thái Hoài Minh', 'Khoa Công nghệ Thông tin'],
                approver: 'TS. Mai Thu Trang (Trưởng Bộ môn)',
                hoursBreakdown: {
                    total: 50,
                    theory: 10,
                    practice: 40,
                    selfStudy: 60
                },
                description: 'Học phần trang bị cho học viên năng lực phân tích, lựa chọn, sử dụng và đề xuất cải tiến các phần mềm CNTT.',
                objectives: [
                    { code: 'YCD1', text: 'Phân tích được các khả năng và cấp độ ứng dụng CNTT trong dạy học.' },
                    { code: 'YCD2', text: 'Sử dụng thành thạo phần mềm dạy học tương tác và LMS.' }
                ],
                clos: [
                    'Thiết kế kế hoạch bài dạy có ứng dụng CNTT số hóa.',
                    'Khai thác hiệu quả phần mềm giáo dục trong giờ học.'
                ],
                learningStages: [
                    {
                        stageName: 'Giai đoạn 1: Bồi dưỡng trực tuyến qua hệ thống LMS',
                        activities: [
                            {
                                code: 'HĐ1',
                                name: 'Nghiên cứu tài liệu tổng quan chuyển đổi số',
                                target: 'Nắm vững lý thuyết cơ bản',
                                tasks: 'Hoàn thành bài tập trắc nghiệm trên LMS',
                                materials: 'Slide bài giảng & E-book',
                                mode: 'online',
                                assessment: 'Điểm trắc nghiệm LMS'
                            }
                        ]
                    },
                    {
                        stageName: 'Giai đoạn 2: Bồi dưỡng trực tiếp tại giảng đường',
                        activities: [
                            {
                                code: 'HĐ2',
                                name: 'Thực hành thiết kế bài dạy số hóa',
                                target: 'Xây dựng giáo án SCORM',
                                tasks: 'Trình bày demo trước giảng viên',
                                materials: 'Máy tính cá nhân',
                                mode: 'in_person',
                                assessment: 'Đánh giá sản phẩm'
                            }
                        ]
                    }
                ],
                deliverables: {
                    online: ['Bài tập trắc nghiệm LMS', 'Bản thảo kế hoạch bài dạy'],
                    inPerson: ['Hồ sơ Kế hoạch bài dạy hoàn chỉnh', 'Báo cáo thuyết trình tập giảng']
                }
            }
        }
    ];

    it('ModuleDetailView renders official academic header, hours breakdown, and navigation buttons', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <ModuleDetailView
                    moduleId="mod_a12"
                    programId="prog_nvsp_thpt"
                    programs={mockPrograms}
                    modules={mockModules}
                    navigate={() => {}}
                />
            </ScrollProvider>
        );

        // 1. Tên học phần và mã môn
        expect(html).toContain('A12');
        expect(html).toContain('Ứng dụng công nghệ thông tin trong dạy học');
        expect(html).toContain('2 Tín chỉ');

        // 2. Phân bổ giờ học chuẩn
        expect(html).toContain('10 tiết LT');
        expect(html).toContain('40 tiết TH');
        expect(html).toContain('60h Tự học');

        // 3. Nút liên kết chuyển đến Đề cương chi tiết và In/Tải PDF
        expect(html).toContain('Xem Đề cương chi tiết');
        expect(html).toContain('Tải PDF');

        // 4. Cán bộ giảng viên & Email công vụ
        expect(html).toContain('ThS. Đặng Văn Khoa');
        expect(html).toContain('khoadv@lecturer.hcmue.edu.vn');
        expect(html).toContain('TS. Thái Hoài Minh');
        expect(html).toContain('TS. Mai Thu Trang (Trưởng Bộ môn)');

        // 5. Thẻ kết quả học tập
        expect(html).toContain('Kết quả Học tập');
        expect(html).toContain('Cập nhật Sổ điểm');
        expect(html).toContain('Sổ ghi');
    });

    it('ModuleDetailView renders learning stages, activities, and pedagogical tabs matching SyllabusView', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <ModuleDetailView
                    moduleId="mod_a12"
                    programId="prog_nvsp_thpt"
                    programs={mockPrograms}
                    modules={mockModules}
                    navigate={() => {}}
                />
            </ScrollProvider>
        );

        // Tab navigation items
        expect(html).toContain('Kế hoạch Hoạt động');
        expect(html).toContain('Mục tiêu &amp; CLOs');
        expect(html).toContain('Nội dung &amp; Seminar');
        expect(html).toContain('Sản phẩm &amp; Đánh giá');
        expect(html).toContain('Tài liệu &amp; Pháp lý');

        // Stage 1 & Stage 2 activities in default 'plan' tab
        expect(html).toContain('Giai đoạn 1: Bồi dưỡng trực tuyến qua hệ thống LMS');
        expect(html).toContain('HĐ1');
        expect(html).toContain('Nghiên cứu tài liệu tổng quan chuyển đổi số');
        expect(html).toContain('Trực tuyến LMS');

        expect(html).toContain('Giai đoạn 2: Bồi dưỡng trực tiếp tại giảng đường');
        expect(html).toContain('HĐ2');
        expect(html).toContain('Thực hành thiết kế bài dạy số hóa');
        expect(html).toContain('Trực tiếp tại lớp');
    });

    it('ModuleDetailView handles non-existent module gracefully', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <ModuleDetailView
                    moduleId="mod_non_existent"
                    programId="prog_nvsp_thpt"
                    programs={mockPrograms}
                    modules={mockModules}
                    navigate={() => {}}
                />
            </ScrollProvider>
        );

        expect(html).toContain('Không tìm thấy thông tin học phần.');
        expect(html).toContain('Quay lại Chương trình đào tạo');
    });
});
