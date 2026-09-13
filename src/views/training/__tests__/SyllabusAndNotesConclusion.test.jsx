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
        expect(html).toContain('In / Xuất PDF A4');
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
});
