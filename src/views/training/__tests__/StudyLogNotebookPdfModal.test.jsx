import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StudyLogNotebookPdfModal } from '../../../components/training/StudyLogNotebookPdfModal';
import { ResourcesStudyLogView } from '../ResourcesStudyLogView';
import { ScrollProvider } from '../../../context/ScrollContext';

describe('StudyLogNotebookPdfModal and Multi-select Student Notebook PDF Export', () => {
    beforeEach(() => {
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.clear();
        }
    });

    const mockProfile = {
        fullName: 'Nguyễn Văn Sư Phạm',
        studentId: 'NVSP-2025-089',
        className: 'Lớp Nghiệp vụ Sư phạm K2025'
    };

    const mockModules = [
        {
            id: 'NVSP-01',
            code: 'NVSP01',
            name: 'Tâm lý học Sư phạm',
            instructor: 'PGS.TS Trần Thị Thu',
            programIds: ['PROG-01']
        },
        {
            id: 'NVSP-02',
            code: 'NVSP02',
            name: 'Giáo dục học Sư phạm',
            instructor: 'TS. Nguyễn Văn Bình',
            programIds: ['PROG-01']
        }
    ];

    const mockPrograms = [
        {
            id: 'PROG-01',
            name: 'Chứng chỉ Nghiệp vụ Sư phạm',
            status: 'dang_hoc'
        }
    ];

    const mockLogs = [
        {
            id: 'log-1',
            moduleId: 'NVSP-01',
            programId: 'PROG-01',
            sessionNumber: '1',
            date: '2026-09-10',
            sessionTime: 'morning',
            title: 'Khái quát Tâm lý học Sư phạm Đại học',
            instructor: 'PGS.TS Trần Thị Thu',
            sections: [
                {
                    id: 'sec-1',
                    title: 'Bản chất hiện tượng tâm lý người học',
                    conclusion: 'Tâm lý học sinh viên mang tính chủ động cao.',
                    items: [
                        {
                            id: 'part-1',
                            cues: 'Đặc điểm lứa tuổi SV',
                            note: 'Khả năng tư duy độc lập, tự định hướng phát triển.'
                        }
                    ]
                }
            ],
            summary: 'Nắm chắc các đặc trưng tâm lý lứa tuổi sinh viên để đổi mới phương pháp dạy học.',
            homework: '- Làm bài tập phân tích tình huống số 2\n- Chuẩn bị slide buổi 2'
        },
        {
            id: 'log-2',
            moduleId: 'NVSP-01',
            programId: 'PROG-01',
            sessionNumber: '2',
            date: '2026-09-17',
            sessionTime: 'afternoon',
            title: 'Quy luật hình thành kỹ năng và tri thức',
            instructor: 'PGS.TS Trần Thị Thu',
            sections: [
                {
                    id: 'sec-2',
                    title: 'Động cơ và thái độ học tập',
                    conclusion: 'Động cơ nội tại là yếu tố quyết định năng lực tự học.',
                    items: [
                        {
                            id: 'part-2',
                            cues: 'Động cơ nhận thức',
                            note: 'Kích thích tò mò khoa học qua bài toán thực tế.'
                        }
                    ]
                }
            ],
            summary: 'Tạo lập môi trường học tập tích cực để kích thích động cơ nội tại.',
            homework: '- Đọc trước giáo trình chương 3'
        }
    ];

    it('renders single study log with authentic Vietnamese school notebook label, ruled paper styling and pedagogical blocks', () => {
        const html = renderToString(
            <StudyLogNotebookPdfModal
                isOpen={true}
                onClose={() => {}}
                logs={[mockLogs[0]]}
                modules={mockModules}
                programs={mockPrograms}
                profile={mockProfile}
            />
        );

        // Header controls
        expect(html).toContain('Xuất PDF Tập Ghi Bài Học Sinh');
        expect(html).toContain('1 bài học');
        expect(html).toContain('Tải file PDF (In A4)');
        expect(html).toContain('File Word (.doc)');
        expect(html).toContain('Sửa nhãn vở');

        // School Notebook Cover & Label
        expect(html).toContain('TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH');
        expect(html).toContain('TẬP BÀI GHI HỌC PHẦN');
        expect(html).toContain('Họ và tên học viên:');
        expect(html).toContain('Nguyễn Văn Sư Phạm');
        expect(html).toContain('Mã số học viên:');
        expect(html).toContain('NVSP-2025-089');
        expect(html).toContain('Lớp / Khóa học:');
        expect(html).toContain('Lớp Nghiệp vụ Sư phạm K2025');
        expect(html).toContain('Học phần:');
        expect(html).toContain('Tâm lý học Sư phạm');

        // Notebook Ruled Paper Margin & Content
        expect(html).toContain('Khái quát Tâm lý học Sư phạm Đại học');
        expect(html).toContain('Bản chất hiện tượng tâm lý người học');
        expect(html).toContain('Đặc điểm lứa tuổi SV');
        expect(html).toContain('Khả năng tư duy độc lập');
        expect(html).toContain('Tâm lý học sinh viên mang tính chủ động cao.');
        expect(html).toContain('Bài học rút ra &amp; Tổng kết toàn buổi (Summary):');
        expect(html).toContain('Nắm chắc các đặc trưng tâm lý lứa tuổi sinh viên');
        expect(html).toContain('Dặn dò của Giảng viên &amp; Bài tập về nhà:');
        expect(html).toContain('Làm bài tập phân tích tình huống số 2');
    });

    it('renders Table of Contents and multiple sessions merged into one single document when batch logs are exported', () => {
        const html = renderToString(
            <StudyLogNotebookPdfModal
                isOpen={true}
                onClose={() => {}}
                logs={mockLogs}
                modules={mockModules}
                programs={mockPrograms}
                profile={mockProfile}
            />
        );

        // Header displays count
        expect(html).toContain('2 bài ghi gộp');

        // Table of Contents
        expect(html).toContain('MỤC LỤC TẬP BÀI GHI HỌC TẬP');
        expect(html).toContain('Khái quát Tâm lý học Sư phạm Đại học');
        expect(html).toContain('Quy luật hình thành kỹ năng và tri thức');

        // All lessons rendered in sequence
        expect(html).toContain('BÀI HỌC BUỔI');
        expect(html).toContain('Động cơ và thái độ học tập');
        expect(html).toContain('Động cơ nhận thức');
        expect(html).toContain('Động cơ nội tại là yếu tố quyết định năng lực tự học.');
    });

    it('ResourcesStudyLogView renders selection checkboxes and quick PDF download buttons', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <ResourcesStudyLogView
                    programs={mockPrograms}
                    modules={mockModules}
                    studyLogs={mockLogs}
                    profile={mockProfile}
                />
            </ScrollProvider>
        );

        // List has study logs
        expect(html).toContain('Danh sách bài ghi');
        expect(html).toContain('Khái quát Tâm lý học Sư phạm Đại học');

        // Checkbox button for log selection
        expect(html).toContain('Chọn bài ghi này để xuất PDF');

        // Quick notebook PDF button on row
        expect(html).toContain('Tập ghi (PDF)');
        expect(html).toContain('Tải bài ghi này dạng Tập ghi bài (PDF/Word)');

        // Read button
        expect(html).toContain('Đọc');
    });
});
