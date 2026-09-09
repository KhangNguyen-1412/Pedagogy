import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { CollapsiblePageHeader } from '../CollapsiblePageHeader';
import { ScrollProvider } from '../../../context/ScrollContext';

describe('CollapsiblePageHeader', () => {
    it('renders expanded title and visible subtitle when not scrolled', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <CollapsiblePageHeader
                    title="Tổng quan học tập."
                    subtitle="Hệ thống quản lý tiến độ & kết quả cá nhân đa mô hình."
                />
            </ScrollProvider>
        );

        expect(html).toContain('Tổng quan học tập.');
        expect(html).toContain('text-2xl sm:text-3xl md:text-4xl');
        expect(html).toContain('grid-rows-[1fr] opacity-100');
        expect(html).toContain('Hệ thống quản lý tiến độ');
    });

    it('renders collapsed title with standardized size (text-base sm:text-lg) when scrolled down', () => {
        const html = renderToString(
            <ScrollProvider isScrolled={true} scrollY={120}>
                <CollapsiblePageHeader
                    title="Quản lý Chương trình đào tạo"
                    subtitle="Cấu trúc quy tắc tín chỉ Đại học & Khóa bồi dưỡng nghiệp vụ."
                />
            </ScrollProvider>
        );

        expect(html).toContain('Quản lý Chương trình đào tạo');
        // Standardized unified shrunk title size across all views
        expect(html).toContain('text-base sm:text-lg');
        expect(html).toContain('truncate');
        // Subtitle smoothly collapsed with CSS Grid 0fr
        expect(html).toContain('grid-rows-[0fr] opacity-0');
    });

    it('renders actions and collapses pre-title badges when scrolled', () => {
        const htmlExpanded = renderToString(
            <ScrollProvider isScrolled={false} scrollY={0}>
                <CollapsiblePageHeader
                    badge={<span className="badge">Thông tư 20</span>}
                    title="Chuẩn Nghề Nghiệp Giáo Viên"
                    actions={({ isScrolled }) => (
                        <button>{isScrolled ? 'Compact' : 'Expanded Button'}</button>
                    )}
                />
            </ScrollProvider>
        );
        expect(htmlExpanded).toContain('grid-rows-[1fr] opacity-100');
        expect(htmlExpanded).toContain('Expanded Button');

        const htmlCollapsed = renderToString(
            <ScrollProvider isScrolled={true} scrollY={80}>
                <CollapsiblePageHeader
                    badge={<span className="badge">Thông tư 20</span>}
                    title="Chuẩn Nghề Nghiệp Giáo Viên"
                    actions={({ isScrolled }) => (
                        <button>{isScrolled ? 'Compact' : 'Expanded Button'}</button>
                    )}
                />
            </ScrollProvider>
        );
        expect(htmlCollapsed).toContain('grid-rows-[0fr] opacity-0');
        expect(htmlCollapsed).toContain('Compact');
    });
});
