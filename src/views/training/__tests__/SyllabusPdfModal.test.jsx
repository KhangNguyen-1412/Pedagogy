import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { SyllabusPdfModal } from '../../../components/training/SyllabusPdfModal';
import { SyllabusView } from '../SyllabusView';
import { ScrollProvider } from '../../../context/ScrollContext';

describe('SyllabusPdfModal and SyllabusView PDF Download', () => {
    const mockModule = {
        id: 'mod_a12',
        code: 'A12',
        name: 'Ứng dụng công nghệ thông tin trong dạy học',
        englishName: 'Information Technology Application in Teaching',
        credits: 2,
        programIds: ['prog_nvsp'],
        instructor: 'TS. Nguyễn Văn A',
        instructorEmail: 'a12@lecturer.hcmue.edu.vn',
        prerequisites: 'Không có',
        syllabus: {
            description: 'Trang bị cho người học kiến thức và kỹ năng ứng dụng CNTT hiện đại trong thiết kế bài dạy.',
            objectives: [
                { code: 'YCD1', text: 'Hiểu và sử dụng thành thạo các phần mềm dạy học tương tác.' },
                { code: 'YCD2', text: 'Thiết kế được bài giảng số theo định dạng e-Learning chuẩn SCORM.' }
            ],
            clos: [
                'Thiết kế kế hoạch bài dạy có ứng dụng phần mềm giáo dục.',
                'Sử dụng hệ thống quản lý học tập trực tuyến LMS để tổ chức lớp học.'
            ],
            contentOutline: [
                {
                    title: 'Chương 1: Tổng quan về chuyển đổi số trong giáo dục phổ thông',
                    items: ['Khái niệm chuyển đổi số', 'Các mô hình dạy học kết hợp (Blended Learning)'],
                    discussion: 'Thảo luận về thuận lợi và rào cản khi ứng dụng AI trong dạy học.'
                }
            ],
            learningStages: [
                {
                    stageName: 'Giai đoạn 1: Bồi dưỡng trực tuyến qua hệ thống LMS',
                    activities: [
                        {
                            code: 'HĐ1',
                            name: 'Nghiên cứu tài liệu chuyển đổi số',
                            target: 'Nắm vững lý thuyết cơ bản',
                            tasks: 'Xem video bài giảng và hoàn thành quiz 10 câu hỏi',
                            materials: 'Slide bài giảng & E-book Chương 1',
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
                            name: 'Thực hành thiết kế bài dạy tích hợp CNTT',
                            target: 'Xây dựng giáo án số hoàn chỉnh',
                            tasks: 'Làm việc theo nhóm 4 học viên và trình bày demo',
                            materials: 'Phần mềm trình chiếu, máy tính xách tay',
                            mode: 'in_person',
                            assessment: 'Hồ sơ dạy học nhóm'
                        }
                    ]
                }
            ],
            deliverables: {
                online: ['Bài kiểm tra trắc nghiệm quá trình LMS', 'Kế hoạch tự học cá nhân'],
                inPerson: ['Kế hoạch bài dạy có ứng dụng CNTT hoàn chỉnh', 'Video mô phỏng 1 hoạt động dạy học']
            },
            references: [
                '[1] Bộ Giáo dục và Đào tạo (2021), Hướng dẫn ứng dụng CNTT trong dạy học.',
                '[2] Trường ĐH Sư phạm TP.HCM (2023), Giáo trình Công nghệ dạy học số.'
            ],
            approver: 'TS. Mai Thu Trang (Trưởng Bộ môn)',
            authorTeam: ['TS. Nguyễn Văn A', 'ThS. Trần Thị B']
        }
    };

    const mockProgram = {
        id: 'prog_nvsp',
        name: 'Nghiệp vụ Sư phạm - Đại học Sư phạm TP. Hồ Chí Minh',
        status: 'dang_hoc'
    };

    it('SyllabusPdfModal renders official university letterhead and all 8 syllabus sections', () => {
        const html = renderToString(
            <SyllabusPdfModal
                isOpen={true}
                onClose={() => {}}
                module={mockModule}
                syllabusData={mockModule.syllabus}
                program={mockProgram}
            />
        );

        // 1. Quốc hiệu Tiêu ngữ & Đơn vị chủ quản
        expect(html).toContain('BỘ GIÁO DỤC VÀ ĐÀO TẠO');
        expect(html).toContain('TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH');
        expect(html).toContain('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM');
        expect(html).toContain('Độc lập - Tự do - Hạnh phúc');

        // 2. Tiêu đề Đề cương chi tiết
        expect(html).toContain('ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN');
        expect(html).toContain('A12 - ỨNG DỤNG CÔNG NGHỆ THÔNG TIN TRONG DẠY HỌC');
        expect(html).toContain('Course Title: Information Technology Application in Teaching');

        // 3. Phần I: Thông tin chung
        expect(html).toContain('I. Thông tin tổng quát về học phần');
        expect(html).toContain('2 tín chỉ');
        expect(html).toContain('TS. Nguyễn Văn A');
        expect(html).toContain('a12@lecturer.hcmue.edu.vn');

        // 4. Phần II: Mục tiêu & Yêu cầu cần đạt
        expect(html).toContain('II. Mục tiêu &amp; Yêu cầu cần đạt của học phần');
        expect(html).toContain('Trang bị cho người học kiến thức và kỹ năng ứng dụng CNTT');
        expect(html).toContain('YCD1');
        expect(html).toContain('YCD2');

        // 5. Phần III: Chuẩn đầu ra CLOs
        expect(html).toContain('III. Chuẩn đầu ra học phần (Course Learning Outcomes - CLOs)');
        expect(html).toContain('CLO 1');
        expect(html).toContain('CLO 2');

        // 6. Phần IV: Nội dung chi tiết
        expect(html).toContain('IV. Nội dung chi tiết học phần');
        expect(html).toContain('Chương 1: Tổng quan về chuyển đổi số');

        // 7. Phần V: Kế hoạch bồi dưỡng & hoạt động dạy học
        expect(html).toContain('V. Kế hoạch bồi dưỡng &amp; Hoạt động dạy học');
        expect(html).toContain('Giai đoạn 1: Bồi dưỡng trực tuyến qua hệ thống LMS');
        expect(html).toContain('Giai đoạn 2: Bồi dưỡng trực tiếp tại giảng đường');
        expect(html).toContain('HĐ1');
        expect(html).toContain('HĐ2');

        // 8. Phần VI: Sản phẩm bắt buộc & Đánh giá kết quả
        expect(html).toContain('VI. Sản phẩm học tập bắt buộc &amp; Cơ chế đánh giá kết quả');
        expect(html).toContain('Đánh giá quá trình (Formative)');
        expect(html).toContain('Đánh giá tổng kết (Summative)');
        expect(html).toContain('50%');

        // 9. Phần VII: Tài liệu tham khảo
        expect(html).toContain('VII. Tài liệu học tập &amp; Tham khảo');
        expect(html).toContain('Thông tư số 12/2021/TT-BGDĐT');

        // 10. Phần VIII: Chữ ký & Phê duyệt
        expect(html).toContain('TRƯỞNG BỘ MÔN / PHÊ DUYỆT');
        expect(html).toContain('GIẢNG VIÊN / BAN BIÊN SOẠN');
        expect(html).toContain('TS. Mai Thu Trang');

        // 11. Thanh công cụ tải file
        expect(html).toContain('Tải file PDF / In A4');
        expect(html).toContain('Tải tệp');
        expect(html).toContain('.DOC');
    });

    it('SyllabusView renders the "Tải file PDF Đề cương A4" button', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <SyllabusView
                    modules={[mockModule]}
                    programs={[mockProgram]}
                    activeModuleId="mod_a12"
                />
            </ScrollProvider>
        );

        expect(html).toContain('Tải file PDF Đề cương A4');
        expect(html).toContain('Chỉnh sửa đề cương');
    });
});
