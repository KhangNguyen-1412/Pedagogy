import React, { useState } from 'react';
import { X, Check, Table, Plus, Trash2, LayoutGrid, Sparkles, RefreshCw, Code2 } from 'lucide-react';
import { MathText } from './MathText';

// Presets for quick generation
const TABLE_PRESETS = [
    {
        id: 'statistics_group',
        name: 'Bảng Thống kê ghép nhóm',
        desc: 'Nhóm khoảng giá trị & Tần số học sinh / đối tượng',
        headers: ['Khoảng giá trị [a; b)', '[10; 20)', '[20; 30)', '[30; 40)', '[40; 50)', '[50; 60)'],
        rows: [
            ['Tần số (Số lượng)', '5', '12', '18', '10', '7']
        ]
    },
    {
        id: 'variation_table',
        name: 'Bảng Biến thiên (x, y\', y)',
        desc: 'Bảng xét dấu đạo hàm & chiều biến thiên hàm số',
        headers: ['x', '$-\\infty$', '$x_1$', '$x_2$', '$+\\infty$'],
        rows: [
            ['y\'', '+', '0', '-', '0'],
            ['y', '$-\\infty$', '$y_{CĐ}$', '$y_{CT}$', '$+\\infty$']
        ]
    },
    {
        id: 'probability_distribution',
        name: 'Bảng Phân phối Xác suất',
        desc: 'Biến ngẫu nhiên rời rạc X & Xác suất P(X = x)',
        headers: ['X', '0', '1', '2', '3'],
        rows: [
            ['P(X = x)', '0.1', '0.4', '0.3', '0.2']
        ]
    },
    {
        id: 'custom_2x4',
        name: 'Bảng 2 Hàng x 4 Cột',
        desc: 'Bảng 2 dòng tiêu chuẩn',
        headers: ['Tiêu đề 1', 'Cột A', 'Cột B', 'Cột C'],
        rows: [
            ['Dòng 1', 'Giá trị 1', 'Giá trị 2', 'Giá trị 3']
        ]
    }
];

export const ThptTableBuilderModal = ({
    isOpen,
    onClose,
    onInsertTable
}) => {
    const [headers, setHeaders] = useState(['Tiêu đề', 'Cột 1', 'Cột 2', 'Cột 3']);
    const [rows, setRows] = useState([
        ['Hàng 1', 'A1', 'A2', 'A3'],
        ['Hàng 2', 'B1', 'B2', 'B3']
    ]);
    const [exportFormat, setExportFormat] = useState('latex'); // 'latex' | 'markdown'

    // Load preset
    const handleLoadPreset = (preset) => {
        setHeaders([...preset.headers]);
        setRows(preset.rows.map(r => [...r]));
    };

    // Add Column
    const handleAddColumn = () => {
        const colNum = headers.length;
        setHeaders([...headers, `Cột ${colNum}`]);
        setRows(rows.map(row => [...row, '']));
    };

    // Remove Column
    const handleRemoveColumn = (colIdx) => {
        if (headers.length <= 2) return;
        setHeaders(headers.filter((_, idx) => idx !== colIdx));
        setRows(rows.map(row => row.filter((_, idx) => idx !== colIdx)));
    };

    // Add Row
    const handleAddRow = () => {
        setRows([...rows, new Array(headers.length).fill('')]);
    };

    // Remove Row
    const handleRemoveRow = (rowIdx) => {
        if (rows.length <= 1) return;
        setRows(rows.filter((_, idx) => idx !== rowIdx));
    };

    // Update Header Cell
    const handleHeaderChange = (colIdx, val) => {
        const next = [...headers];
        next[colIdx] = val;
        setHeaders(next);
    };

    // Update Row Cell
    const handleCellChange = (rowIdx, colIdx, val) => {
        const next = rows.map(r => [...r]);
        next[rowIdx][colIdx] = val;
        setRows(next);
    };

    // Generate Markdown Table String
    const generateMarkdown = () => {
        const headerLine = `| ${headers.map(h => h.trim() || '-').join(' | ')} |`;
        const sepLine = `| ${headers.map(() => '---').join(' | ')} |`;
        const rowLines = rows.map(r => `| ${r.map(cell => cell.trim() || '-').join(' | ')} |`);
        return `\n${headerLine}\n${sepLine}\n${rowLines.join('\n')}\n`;
    };

    // Generate LaTeX Array String
    const generateLatex = () => {
        const align = `|${headers.map(() => 'c').join('|')}|`;
        const formatCell = (val) => {
            const trimmed = val.trim() || '-';
            if (trimmed.startsWith('$') && trimmed.endsWith('$')) {
                return trimmed.slice(1, -1);
            }
            if (/^[0-9.,\-+/*]+$/.test(trimmed)) {
                return trimmed;
            }
            return `\\text{${trimmed}}`;
        };

        const headerLine = headers.map(formatCell).join(' & ');
        const rowLines = rows.map(r => r.map(formatCell).join(' & ')).join(' \\\\\n\\hline\n');

        return `\n$$\\begin{array}{${align}}\n\\hline\n${headerLine} \\\\\n\\hline\n${rowLines} \\\\\n\\hline\n\\end{array}$$\n`;
    };

    const handleConfirm = () => {
        const tableCode = exportFormat === 'latex' ? generateLatex() : generateMarkdown();
        onInsertTable(tableCode);
        onClose();
    };

    if (!isOpen) return null;

    const currentOutputCode = exportFormat === 'latex' ? generateLatex() : generateMarkdown();

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-4xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-3.5 bg-brand-cerulean text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-brand-jasper text-white rounded">
                            <Table size={16} />
                        </div>
                        <div>
                            <h3 className="font-serif-title font-bold text-base leading-tight">
                                Trình Tạo & Chèn Bảng Dữ Liệu (Hỗ trợ LaTeX & Markdown)
                            </h3>
                            <p className="text-[11px] text-white/80 font-sans">
                                Tạo bảng thống kê ghép nhóm, bảng biến thiên, bảng phân phối xác suất hoặc bảng số liệu LaTeX
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Preset Selector */}
                <div className="p-3 bg-brand-cream border-b border-brand-cerulean/20">
                    <span className="text-xs font-serif-title font-bold text-brand-cerulean block mb-1.5 flex items-center gap-1">
                        <Sparkles size={13} className="text-brand-jasper" /> Chọn mẫu bảng dựng sẵn nhanh:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TABLE_PRESETS.map(preset => (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleLoadPreset(preset)}
                                className="p-2 bg-white hover:bg-brand-cerulean/10 border border-brand-cerulean/25 hover:border-brand-cerulean rounded text-left transition-all group"
                            >
                                <span className="font-serif-title font-bold text-xs text-brand-cerulean block group-hover:text-brand-jasper">
                                    {preset.name}
                                </span>
                                <span className="text-[10px] text-gray-500 line-clamp-1 block">
                                    {preset.desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-cream/30">
                    {/* Controls Bar */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleAddColumn}
                                className="px-2.5 py-1 bg-white hover:bg-brand-cerulean hover:text-white border border-brand-cerulean/30 rounded text-xs font-bold text-brand-cerulean flex items-center gap-1 transition-colors"
                            >
                                <Plus size={12} /> Thêm Cột
                            </button>
                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="px-2.5 py-1 bg-white hover:bg-brand-cerulean hover:text-white border border-brand-cerulean/30 rounded text-xs font-bold text-brand-cerulean flex items-center gap-1 transition-colors"
                            >
                                <Plus size={12} /> Thêm Hàng
                            </button>
                        </div>

                        {/* Format Switcher */}
                        <div className="flex items-center gap-3 text-xs font-sans bg-white px-3 py-1 rounded border border-brand-cerulean/20">
                            <span className="font-bold text-brand-cerulean font-serif-title">Định dạng chèn:</span>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="exportFormat"
                                    value="latex"
                                    checked={exportFormat === 'latex'}
                                    onChange={() => setExportFormat('latex')}
                                    className="text-brand-cerulean"
                                />
                                <span className="font-bold text-emerald-800">LaTeX (\begin{`{array}`})</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="exportFormat"
                                    value="markdown"
                                    checked={exportFormat === 'markdown'}
                                    onChange={() => setExportFormat('markdown')}
                                    className="text-brand-cerulean"
                                />
                                <span>Markdown (|...|)</span>
                            </label>
                        </div>
                    </div>

                    {/* Visual Interactive Table Editor */}
                    <div className="overflow-x-auto border border-brand-cerulean/20 rounded shadow-sm bg-white p-2">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    {headers.map((h, colIdx) => (
                                        <th key={colIdx} className="p-1.5 border border-brand-cerulean/20 bg-brand-cerulean/10 min-w-[110px]">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="text"
                                                    value={h}
                                                    onChange={e => handleHeaderChange(colIdx, e.target.value)}
                                                    placeholder={`Cột ${colIdx + 1}`}
                                                    className="w-full p-1 text-xs font-serif-title font-bold text-brand-cerulean bg-white border border-brand-cerulean/30 rounded text-center focus:outline-none focus:border-brand-jasper"
                                                />
                                                {headers.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveColumn(colIdx)}
                                                        className="text-gray-300 hover:text-red-500 p-0.5"
                                                        title="Xóa cột này"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="w-8 p-1 text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="hover:bg-brand-cream/20">
                                        {row.map((cell, colIdx) => (
                                            <td key={colIdx} className="p-1.5 border border-brand-cerulean/20">
                                                <input
                                                    type="text"
                                                    value={cell}
                                                    onChange={e => handleCellChange(rowIdx, colIdx, e.target.value)}
                                                    placeholder="Giá trị..."
                                                    className="w-full p-1 text-xs font-body text-gray-800 bg-white border border-gray-200 rounded text-center focus:outline-none focus:border-brand-cerulean"
                                                />
                                            </td>
                                        ))}
                                        <td className="p-1 text-center">
                                            {rows.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRow(rowIdx)}
                                                    className="text-gray-300 hover:text-red-500 p-1"
                                                    title="Xóa hàng này"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Live Rendered Table Preview */}
                    <div className="p-3 bg-white border border-brand-cerulean/20 rounded shadow-sm space-y-1.5">
                        <span className="text-[11px] font-serif-title font-bold text-brand-cerulean uppercase block">
                            Xem trước bảng render trong đề thi:
                        </span>
                        <div className="p-3 bg-brand-cream/30 border border-brand-cerulean/15 rounded flex justify-center">
                            <MathText text={currentOutputCode} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3.5 bg-white border-t border-brand-cerulean/20 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-sans">
                        Kích thước: <strong>{rows.length} hàng x {headers.length} cột</strong> ({exportFormat === 'latex' ? 'LaTeX Array' : 'Markdown'})
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs text-gray-600 hover:text-gray-900"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="px-5 py-2 bg-brand-cerulean hover:bg-brand-jasper text-white font-serif-title font-bold text-xs shadow-editorial transition-all flex items-center gap-1.5 rounded"
                        >
                            <Check size={14} />
                            <span>Chèn Bảng vào Nội dung Đề bài</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThptTableBuilderModal;
