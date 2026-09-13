import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { SyllabusView } from '../SyllabusView';
import { ResourcesStudyLogView } from '../ResourcesStudyLogView';
import { ScrollProvider } from '../../../context/ScrollContext';

describe('SyllabusView and ResourcesStudyLogView section conclusion tests', () => {
    beforeEach(() => {
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.clear();
        }
    });

    const mockPrograms = [
        { id: 'prog_1', name: 'Nghiệp vụ sư phạm', status: 'dang_hoc' }
    ];
    const mockModules = [
        {
            id: 'mod_1',
            code: 'A12',
            name: 'Ứng dụng CNTT trong dạy học',
            credits: 2,
            programIds: ['prog_1'],
            syllabus: {
                description: 'Mục tiêu học phần',
                clos: ['CLO 1'],
                schedule: [{ week: 1, title: 'Buổi 1', topics: 'Topic 1', hours: 3 }]
            }
        }
    ];

    it('SyllabusView does not contain the "Khôi phục chuẩn HCMUE" button', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <SyllabusView
                    modules={mockModules}
                    programs={mockPrograms}
                    activeModuleId="mod_1"
                />
            </ScrollProvider>
        );

        expect(html).not.toContain('Khôi phục chuẩn HCMUE');
        expect(html).toContain('Tải file PDF Đề cương A4');
        expect(html).toContain('Chỉnh sửa đề cương');
    });

    it('ResourcesStudyLogView renders section conclusions for each Cornell section', () => {
        const mockStudyLogs = [
            {
                id: 'log_1',
                programId: 'prog_1',
                moduleId: 'mod_1',
                sessionNumber: '1',
                date: '2026-09-13',
                title: 'Bài học về phương pháp dạy học',
                sections: [
                    {
                        id: 'sec_1',
                        title: 'Mục 1: Nhận thức lý luận',
                        cues: 'Từ khóa 1',
                        note: 'Ghi chép chi tiết mục 1',
                        conclusion: 'Đúc kết sư phạm cho mục 1: Lấy học sinh làm trung tâm.'
                    },
                    {
                        id: 'sec_2',
                        title: 'Mục 2: Thực hành tổ chức',
                        cues: 'Từ khóa 2',
                        note: 'Ghi chép chi tiết mục 2',
                        conclusion: 'Đúc kết sư phạm cho mục 2: Tăng cường hoạt động trải nghiệm.'
                    }
                ],
                summary: 'Tổng kết toàn bài học: Đạt mục tiêu đề ra.'
            }
        ];

        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <ResourcesStudyLogView
                    programs={mockPrograms}
                    modules={mockModules}
                    studyLogs={mockStudyLogs}
                />
            </ScrollProvider>
        );

        // Verify section 1 conclusion renders
        expect(html).toMatch(/Kết luận Mục.*?1.*?:/);
        expect(html).toContain('Đúc kết sư phạm cho mục 1: Lấy học sinh làm trung tâm.');

        // Verify section 2 conclusion renders
        expect(html).toMatch(/Kết luận Mục.*?2.*?:/);
        expect(html).toContain('Đúc kết sư phạm cho mục 2: Tăng cường hoạt động trải nghiệm.');

        // Verify overall summary still renders
        expect(html).toContain('Summary / Tóm tắt cốt lõi bài học:');
        expect(html).toContain('Tổng kết toàn bài học: Đạt mục tiêu đề ra.');
    });

    it('ResourcesStudyLogView supports multiple content parts within 1 section, each part having its own keywords', () => {
        const mockStudyLogsWithParts = [
            {
                id: 'log_parts_1',
                programId: 'prog_1',
                moduleId: 'mod_1',
                sessionNumber: '2',
                date: '2026-09-13',
                title: 'Bài học: Kỹ thuật dạy học tích cực',
                sections: [
                    {
                        id: 'sec_multi_parts',
                        title: 'Mục 1: Các kỹ thuật dạy học cơ bản',
                        items: [
                            {
                                id: 'part_1',
                                cues: 'Từ khóa Phần 1: Kỹ thuật khăn trải bàn, Brainstorming',
                                note: 'Nội dung Phần 1: Các bước chia nhóm và phân công ghi chép.'
                            },
                            {
                                id: 'part_2',
                                cues: 'Từ khóa Phần 2: Kỹ thuật mảnh ghép (Jigsaw), Đóng vai',
                                note: 'Nội dung Phần 2: Nhóm chuyên sâu và nhóm mảnh ghép tổng hợp kiến thức.'
                            }
                        ],
                        conclusion: 'Kết luận Mục 1: Lựa chọn kỹ thuật phù hợp với đặc thù đối tượng học sinh.'
                    }
                ],
                summary: 'Tổng kết toàn bài: Đã nắm vững các kỹ thuật dạy học tích cực.'
            }
        ];

        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <ResourcesStudyLogView
                    programs={mockPrograms}
                    modules={mockModules}
                    studyLogs={mockStudyLogsWithParts}
                />
            </ScrollProvider>
        );

        // Verify section header and title
        expect(html).toContain('Mục 1: Các kỹ thuật dạy học cơ bản');

        // Verify Part 1 has its own keywords and notes
        expect(html).toContain('Phần 1');
        expect(html).toContain('Từ khóa Phần 1: Kỹ thuật khăn trải bàn, Brainstorming');
        expect(html).toContain('Nội dung Phần 1: Các bước chia nhóm và phân công ghi chép.');

        // Verify Part 2 has its own keywords and notes
        expect(html).toContain('Phần 2');
        expect(html).toContain('Từ khóa Phần 2: Kỹ thuật mảnh ghép (Jigsaw), Đóng vai');
        expect(html).toContain('Nội dung Phần 2: Nhóm chuyên sâu và nhóm mảnh ghép tổng hợp kiến thức.');

        // Verify section conclusion at the bottom of the section
        expect(html).toContain('Kết luận Mục 1:');
        expect(html).toContain('Kết luận Mục 1: Lựa chọn kỹ thuật phù hợp với đặc thù đối tượng học sinh.');

        // Verify overall summary
        expect(html).toContain('Tổng kết toàn bài: Đã nắm vững các kỹ thuật dạy học tích cực.');
    });
});
