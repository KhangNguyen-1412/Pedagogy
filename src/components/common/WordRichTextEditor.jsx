import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Table,
    Highlighter,
    Palette,
    Type,
    FileUp,
    Minus,
    Eraser,
    Sparkles,
    Check,
    ChevronDown,
    FileText
} from 'lucide-react';
import mammoth from 'mammoth';

const TEXT_COLORS = [
    { label: 'Mặc định (Đen mực)', value: '#1e293b' },
    { label: 'Xanh Cerulean', value: '#124874' },
    { label: 'Đỏ Jasper', value: '#CF373D' },
    { label: 'Xanh ngọc bích', value: '#059669' },
    { label: 'Hổ phách đậm', value: '#d97706' },
    { label: 'Tím hoa cà', value: '#7c3aed' },
    { label: 'Xám ghi', value: '#64748b' }
];

const HIGHLIGHT_COLORS = [
    { label: 'Không màu', value: 'transparent' },
    { label: 'Vàng dạ quang', value: '#fef08a' },
    { label: 'Xanh lục dạ quang', value: '#bbf7d0' },
    { label: 'Xanh ngọc bích nhạt', value: '#a5f3fc' },
    { label: 'Hồng phấn', value: '#fbcfe8' },
    { label: 'Cam nhạt', value: '#fed7aa' }
];

const escapeHtml = (text) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

export const formatInitialContent = (content) => {
    if (!content) return '';
    // If content already contains HTML tags, return as is
    if (/<[a-z][\s\S]*>/i.test(content)) {
        return content;
    }
    // Convert plain text with newlines into HTML paragraphs
    return content
        .split('\n')
        .map(line => line.trim() === '' ? '<p><br></p>' : `<p>${escapeHtml(line)}</p>`)
        .join('');
};

export const WordRichTextEditor = ({
    value = '',
    onChange,
    placeholder = 'Bắt đầu soạn thảo nội dung ghi chép như trong Microsoft Word...',
    minHeight = '380px'
}) => {
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Sync content from outside (initial or external change) without resetting cursor while user types
    useEffect(() => {
        if (!editorRef.current) return;
        const currentHtml = editorRef.current.innerHTML;
        const formattedNext = formatInitialContent(value);
        if (currentHtml !== formattedNext && document.activeElement !== editorRef.current) {
            editorRef.current.innerHTML = formattedNext;
            updateCounts(editorRef.current.innerText || '');
        }
    }, [value]);

    const updateCounts = (text) => {
        const clean = text.trim();
        const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
        setWordCount(words);
        setCharCount(text.length);
    };

    const handleInput = () => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        const text = editorRef.current.innerText || '';
        updateCounts(text);
        if (onChange) {
            onChange(html);
        }
    };

    // Helper to execute formatting commands without losing focus
    const exec = (command, val = null) => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(command, false, val);
        handleInput();
    };

    // Heading format
    const applyHeading = (tag) => {
        exec('formatBlock', tag);
        setShowHeadingMenu(false);
    };

    // Text Color
    const applyColor = (color) => {
        exec('foreColor', color);
        setShowColorPicker(false);
    };

    // Highlight color
    const applyHighlight = (color) => {
        if (color === 'transparent') {
            exec('removeFormat');
        } else {
            exec('hiliteColor', color);
        }
        setShowHighlightPicker(false);
    };

    // Insert Table
    const insertTable = (rows = 3, cols = 3) => {
        let tableHtml = '<table class="w-full border-collapse border border-slate-300 my-3"><thead><tr>';
        for (let c = 1; c <= cols; c++) {
            tableHtml += `<th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs">Cột ${c}</th>`;
        }
        tableHtml += '</tr></thead><tbody>';
        for (let r = 1; r <= rows; r++) {
            tableHtml += '<tr>';
            for (let c = 1; c <= cols; c++) {
                tableHtml += '<td class="border border-slate-300 p-2 text-xs">Dữ liệu</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</table><p><br></p>';
        exec('insertHTML', tableHtml);
    };

    // Insert Callout Box
    const insertCallout = () => {
        const calloutHtml = `
            <blockquote class="my-3 p-3.5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r text-gray-800 text-sm">
                <strong>💡 Lưu ý sư phạm quan trọng:</strong> Nhập luận điểm cần ghi nhớ tại đây...
            </blockquote><p><br></p>
        `;
        exec('insertHTML', calloutHtml);
    };

    // Import Word (.docx) file directly
    const handleWordFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            if (result && result.value) {
                if (editorRef.current) {
                    editorRef.current.innerHTML = result.value;
                    handleInput();
                }
            } else {
                alert('Tệp Word rỗng hoặc không có nội dung văn bản.');
            }
        } catch (error) {
            console.error('Lỗi khi đọc file Word:', error);
            alert('Không thể đọc file Word này. Vui lòng đảm bảo tệp có định dạng .docx hợp lệ.');
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle Keyboard shortcuts
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    };

    return (
        <div className="border border-brand-cerulean/30 rounded-xs bg-white shadow-xs overflow-hidden flex flex-col font-sans">
            {/* MICROSOFT WORD STYLE RIBBON TOOLBAR */}
            <div className="bg-slate-50 border-b border-brand-cerulean/20 p-1.5 sm:p-2 select-none flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-700">
                {/* TOOLBAR HEADER BADGE */}
                <div className="flex items-center gap-1.5 pr-2 mr-1 border-r border-slate-300 hidden md:flex text-brand-cerulean font-serif-title font-bold text-xs">
                    <FileText size={15} className="text-brand-cerulean" />
                    <span>Word Ribbon</span>
                </div>

                {/* UNDO / REDO */}
                <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('undo'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-brand-cerulean transition-colors"
                        title="Hoàn tác (Ctrl+Z)"
                    >
                        <Undo size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('redo'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-brand-cerulean transition-colors"
                        title="Làm lại (Ctrl+Y)"
                    >
                        <Redo size={14} />
                    </button>
                </div>

                {/* PARAGRAPH / HEADING DROPDOWN */}
                <div className="relative pr-1.5 border-r border-slate-300">
                    <button
                        type="button"
                        onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                        title="Kiểu định dạng đoạn văn"
                    >
                        <span>Kiểu chữ</span>
                        <ChevronDown size={12} />
                    </button>
                    {showHeadingMenu && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-300 shadow-xl rounded z-30 py-1 font-body text-xs">
                            <button
                                type="button"
                                onMouseDown={e => { e.preventDefault(); applyHeading('<p>'); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-brand-cream/60 flex items-center justify-between"
                            >
                                <span>Văn bản thường</span>
                                <span className="text-[10px] text-gray-400">Normal</span>
                            </button>
                            <button
                                type="button"
                                onMouseDown={e => { e.preventDefault(); applyHeading('<h1>'); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-brand-cream/60 font-serif-title font-bold text-brand-cerulean text-sm flex items-center justify-between"
                            >
                                <span>Tiêu đề lớn</span>
                                <span className="text-[10px] text-gray-400">H1</span>
                            </button>
                            <button
                                type="button"
                                onMouseDown={e => { e.preventDefault(); applyHeading('<h2>'); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-brand-cream/60 font-serif-title font-bold text-brand-cerulean text-xs flex items-center justify-between"
                            >
                                <span>Tiêu đề vừa</span>
                                <span className="text-[10px] text-gray-400">H2</span>
                            </button>
                            <button
                                type="button"
                                onMouseDown={e => { e.preventDefault(); applyHeading('<h3>'); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-brand-cream/60 font-serif-title font-bold text-brand-jasper text-xs flex items-center justify-between"
                            >
                                <span>Tiêu đề nhỏ</span>
                                <span className="text-[10px] text-gray-400">H3</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* TEXT STYLES: BOLD, ITALIC, UNDERLINE, STRIKETHROUGH */}
                <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('bold'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 font-bold hover:text-brand-cerulean transition-colors"
                        title="In đậm (Ctrl+B)"
                    >
                        <Bold size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('italic'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors italic"
                        title="In nghiêng (Ctrl+I)"
                    >
                        <Italic size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('underline'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Gạch chân (Ctrl+U)"
                    >
                        <Underline size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Gạch ngang chữ"
                    >
                        <Strikethrough size={14} />
                    </button>
                </div>

                {/* COLOR & HIGHLIGHT PICKERS */}
                <div className="flex items-center gap-1 pr-1.5 border-r border-slate-300 relative">
                    {/* Font Color */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean flex items-center gap-0.5 transition-colors"
                            title="Màu chữ văn bản"
                        >
                            <Palette size={14} />
                            <ChevronDown size={10} />
                        </button>
                        {showColorPicker && (
                            <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-300 shadow-xl rounded z-30 p-2 space-y-1">
                                <div className="text-[11px] font-bold text-gray-500 pb-1 border-b border-gray-100">
                                    Chọn màu chữ
                                </div>
                                {TEXT_COLORS.map(c => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onMouseDown={e => { e.preventDefault(); applyColor(c.value); }}
                                        className="w-full text-left px-2 py-1 text-xs hover:bg-slate-100 rounded flex items-center gap-2"
                                    >
                                        <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: c.value }} />
                                        <span>{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Highlight Color */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-jasper flex items-center gap-0.5 transition-colors"
                            title="Bút dạ quang / Tô sáng văn bản"
                        >
                            <Highlighter size={14} />
                            <ChevronDown size={10} />
                        </button>
                        {showHighlightPicker && (
                            <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-300 shadow-xl rounded z-30 p-2 space-y-1">
                                <div className="text-[11px] font-bold text-gray-500 pb-1 border-b border-gray-100">
                                    Màu bút dạ quang
                                </div>
                                {HIGHLIGHT_COLORS.map(h => (
                                    <button
                                        key={h.value}
                                        type="button"
                                        onMouseDown={e => { e.preventDefault(); applyHighlight(h.value); }}
                                        className="w-full text-left px-2 py-1 text-xs hover:bg-slate-100 rounded flex items-center gap-2"
                                    >
                                        <span className="w-4 h-3.5 rounded border border-gray-300 shrink-0" style={{ backgroundColor: h.value }} />
                                        <span>{h.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ALIGNMENTS: LEFT, CENTER, RIGHT, JUSTIFY */}
                <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Căn trái"
                    >
                        <AlignLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Căn giữa"
                    >
                        <AlignCenter size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('justifyRight'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Căn phải"
                    >
                        <AlignRight size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('justifyFull'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Căn đều hai bên"
                    >
                        <AlignJustify size={14} />
                    </button>
                </div>

                {/* LISTS: BULLET, NUMBER */}
                <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Danh sách dấu chấm (Bullets)"
                    >
                        <List size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Danh sách số (Numbering)"
                    >
                        <ListOrdered size={14} />
                    </button>
                </div>

                {/* INSERTS: QUOTE, TABLE, DIVIDER, CALLOUT */}
                <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('formatBlock', '<blockquote>'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Đoạn trích dẫn (Blockquote)"
                    >
                        <Quote size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); insertTable(3, 3); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Chèn bảng 3x3"
                    >
                        <Table size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); insertCallout(); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-amber-700 hover:bg-amber-100 transition-colors"
                        title="Chèn Hộp ghi chú sư phạm nổi bật"
                    >
                        <Sparkles size={14} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('insertHorizontalRule'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-800 hover:text-brand-cerulean transition-colors"
                        title="Đường kẻ ngang phân cách"
                    >
                        <Minus size={14} />
                    </button>
                </div>

                {/* IMPORT WORD (.DOCX) FILE BUTTON */}
                <div className="flex items-center gap-1.5 ml-auto">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".docx"
                        onChange={handleWordFileUpload}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isImporting}
                        className="px-2.5 py-1 text-xs font-serif-title font-bold text-brand-cerulean bg-brand-cream/80 hover:bg-brand-cerulean hover:text-white border border-brand-cerulean/30 rounded flex items-center gap-1 transition-all"
                        title="Tải lên tệp Word (.docx) để tự động chuyển thành ghi chép"
                    >
                        <FileUp size={13} />
                        <span>{isImporting ? 'Đang đọc Word...' : 'Nhập file Word (.docx)'}</span>
                    </button>

                    <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-red-600 transition-colors"
                        title="Xóa tất cả định dạng về mặc định"
                    >
                        <Eraser size={14} />
                    </button>
                </div>
            </div>

            {/* WORD DOCUMENT EDITABLE CANVAS */}
            <div className="relative bg-white p-6 sm:p-8 cursor-text overflow-y-auto" style={{ minHeight }}>
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    data-placeholder={placeholder}
                    className="word-content outline-none text-base font-body text-slate-800 leading-relaxed min-h-[300px] focus:outline-none"
                />
            </div>

            {/* WORD STATUS BAR (BOTTOM) */}
            <div className="bg-slate-100 border-t border-slate-200 px-3 py-1.5 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 select-none">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-brand-cerulean">
                        <FileText size={12} />
                        <span>Chế độ Word Soạn thảo</span>
                    </span>
                    <span>&bull;</span>
                    <span><strong>{wordCount}</strong> từ</span>
                    <span>&bull;</span>
                    <span><strong>{charCount}</strong> ký tự</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                    <span>Phím tắt: <strong>Ctrl+B</strong> In đậm, <strong>Ctrl+I</strong> In nghiêng, <strong>Ctrl+U</strong> Gạch chân</span>
                </div>
            </div>
        </div>
    );
};
