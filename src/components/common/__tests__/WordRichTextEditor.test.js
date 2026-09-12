import { describe, it, expect } from 'vitest';
import { sanitizePastedHtml, formatInitialContent } from '../WordRichTextEditor';

describe('sanitizePastedHtml & formatInitialContent', () => {
    it('strips inline font-family from pasted HTML while preserving bold, color, and structure', () => {
        const dirtyHtml = '<p style="font-family: Arial, sans-serif; font-size: 14pt; color: #124874;"><span style="font-family: Calibri;">Điểm luận <b>chính</b></span></p>';
        const clean = sanitizePastedHtml(dirtyHtml);

        expect(clean).not.toContain('Arial');
        expect(clean).not.toContain('Calibri');
        expect(clean).not.toContain('font-family');
        expect(clean).toContain('<b>chính</b>');
        expect(clean).toContain('Điểm luận');
    });

    it('removes face attributes from legacy font tags', () => {
        const legacyHtml = '<font face="Times New Roman" size="4" color="#CF373D">Nội dung font cũ</font>';
        const clean = sanitizePastedHtml(legacyHtml);

        expect(clean).not.toContain('Times New Roman');
        expect(clean).not.toContain('face=');
        expect(clean).toContain('Nội dung font cũ');
    });

    it('cleans Microsoft Word mso- styles and classes', () => {
        const wordHtml = '<p class="MsoNormal" style="mso-bidi-font-family: Arial; font-family: \'Times New Roman\'; line-height: 115%;">Bài học sư phạm</p>';
        const clean = sanitizePastedHtml(wordHtml);

        expect(clean).not.toContain('MsoNormal');
        expect(clean).not.toContain('mso-bidi-font-family');
        expect(clean).not.toContain('Times New Roman');
        expect(clean).toContain('Bài học sư phạm');
    });

    it('strips white or near-white background colors copied from foreign pages', () => {
        const whiteBgHtml = '<span style="background-color: rgb(255, 255, 255); color: #124874;">Văn bản nền trắng</span>';
        const clean = sanitizePastedHtml(whiteBgHtml);

        expect(clean).not.toContain('background-color: rgb(255, 255, 255)');
        expect(clean).toContain('Văn bản nền trắng');
    });

    it('formatInitialContent automatically sanitizes HTML content containing foreign fonts', () => {
        const initialWithFonts = '<div><p style="font-family: Tahoma;">Quy luật nhận thức</p></div>';
        const formatted = formatInitialContent(initialWithFonts);

        expect(formatted).not.toContain('Tahoma');
        expect(formatted).toContain('Quy luật nhận thức');
    });
});
