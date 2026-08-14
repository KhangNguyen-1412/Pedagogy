import React, { useState, useMemo, useRef } from 'react';
import {
    X, Check, Eye, Trash2, Plus, FileText, CheckCircle2,
    Copy, AlignLeft, Sparkles, HelpCircle, Upload, FileCode,
    FileCheck, RefreshCw, Paperclip, AlertCircle
} from 'lucide-react';
import mammoth from 'mammoth';
import { MathText } from './MathText';

// ==========================================
// SAMPLE EXAM TEXT TEMPLATES FOR QUICK TEST
// ==========================================
const SAMPLE_EXAM_TEXT = `Câu 1: Cho hàm số y = f(x) có bảng biến thiên với đạo hàm f'(x) = x(x - 2)^2. Số điểm cực trị của hàm số đã cho là:
A. 0
*B. 1
C. 2
D. 3
Lời giải: Ta có f'(x) = 0 <=> x = 0 hoặc x = 2 (nghiệm kép). Đạo hàm chỉ đổi dấu khi qua nghiệm đơn x = 0, do đó hàm số có đúng 1 điểm cực trị.

Câu 2. Cho khối chóp S.ABC có đáy ABC là tam giác vuông tại A, AB = a, AC = a*sqrt(3). Chiều cao khối chóp bằng 2a. Thể tích của khối chóp S.ABC là:
A. a^3*sqrt(3)/3
*B. a^3*sqrt(3)
C. 2a^3*sqrt(3)/3
D. a^3/3
Lời giải: Diện tích tam giác đáy S_ABC = 1/2 * a * a*sqrt(3) = a^2*sqrt(3)/2. Thể tích V = 1/3 * S_ABC * h = 1/3 * a^2*sqrt(3)/2 * 2a = a^3*sqrt(3)/3.

Câu 3: Tập nghiệm của bất phương trình log_2(x - 1) <= 3 là:
A. (1; 9]
B. [1; 9]
C. (1; +inf)
*D. (-inf; 9]
Lời giải: Điều kiện xác định: x - 1 > 0 <=> x > 1. Bất phương trình tương đương x - 1 <= 2^3 = 8 <=> x <= 9. Kết hợp điều kiện suy ra tập nghiệm là (1; 9].

Câu 4: Cho tích phân int_0^1 (2x + 1)dx. Giá trị của tích phân này bằng:
A. 1
*B. 2
C. 3
D. 4
Lời giải: Nguyên hàm F(x) = x^2 + x. Thay cận: F(1) - F(0) = (1 + 1) - 0 = 2.
`;

// ==========================================
// MATH & TEXT NORMALIZER ENGINE
// ==========================================
export const cleanVietnamesePdfSpacedText = (str) => {
    if (!str) return '';
    let res = str;
    // Replace spaced letters inside Vietnamese words
    res = res.replace(/([a-zA-ZÀ-ỹ0-9])\s+([àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ])/gi, '$1$2');
    res = res.replace(/([àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ])\s+([a-zA-Z0-9])/gi, '$1$2');
    return res;
};

export const normalizeMathToLatex = (rawText) => {
    if (!rawText) return '';
    let text = rawText;

    // Normalize arrow vectors e.g. "→ AD" or "AD →" -> "\vec{AD}"
    text = text
        .replace(/(?:→\s*([A-Za-z0-9']+)|([A-Za-z0-9']+)\s*→)/g, (_, p1, p2) => `$\\vec{${p1 || p2}}$`)
        .replace(/\b(?:vecto|vector|vec)\s*([a-zA-Z0-9']+)/gi, '$\\vec{$1}$')
        .replace(/\bvec\(([a-zA-Z0-9']+)\)/gi, '$\\vec{$1}$');

    // Normalize integrals e.g. "∫ f(x)dx" or "∫ [2 + f(x)]dx"
    text = text
        .replace(/∫\s*([^\n;=]+?dx)/gi, '$\\int $1$')
        .replace(/\bint_([0-9a-zA-Z\+\-]+)\^([0-9a-zA-Z\+\-]+)\s*([^$]+)dx/gi, '$\\int_{$1}^{$2} $3 dx$');

    // Normalize logarithms e.g. "log3(3x)" or "log_3(3x)"
    text = text
        .replace(/\blog_?([0-9a-zA-Z]+)\s*\(([^)]+)\)/gi, '$\\log_{$1}($2)$')
        .replace(/\bln\s*\(([^)]+)\)/gi, '$\\ln($1)$');

    // Normalize square roots
    text = text
        .replace(/\b(?:sqrt|căn)\(([^)]+)\)/gi, '$\\sqrt{$1}$');

    // Normalize sequence subscripts e.g. "u1", "u2", "u3", "un"
    text = text
        .replace(/\b([uUvV])([1-9]|n)\b/g, '$$$1_{$2}$$')
        .replace(/\b([a-zA-Z])_([0-9a-zA-Z]+)/g, '$$$1_{$2}$$');

    // Normalize exponents e.g. "x^2", "x^3", "x2", "x3" (in math context)
    text = text
        .replace(/\b([a-zA-Z])\^([0-9a-zA-Z\+\-]+)/g, '$$$1^{$2}$$')
        .replace(/\b([a-zA-Z])([2345])\b(?!\s*[\wà-ỹ])/g, '$$$1^{$2}$$');

    // Normalize common mathematical symbols if not already wrapped in $...$
    text = text
        .replace(/<=>/g, ' $\\Leftrightarrow$ ')
        .replace(/=>/g, ' $\\Rightarrow$ ')
        .replace(/<=/g, ' $\\le$ ')
        .replace(/>=/g, ' $\\ge$ ')
        .replace(/!=/g, ' $\\ne$ ')
        .replace(/≠/g, ' $\\ne$ ')
        .replace(/ċ/g, ' $\\cdot$ ')
        .replace(/·/g, ' $\\cdot$ ')
        .replace(/\bpi\b/gi, '$\\pi$')
        .replace(/\balpha\b/gi, '$\\alpha$')
        .replace(/\bbeta\b/gi, '$\\beta$')
        .replace(/\bdelta\b/gi, '$\\Delta$')
        .replace(/\btheta\b/gi, '$\\theta$')
        .replace(/\binf\b/gi, '$\\infty$')
        .replace(/\+inf\b/gi, '$+\\infty$')
        .replace(/\-inf\b/gi, '$-\\infty$');

    // Clean up excessive dollar signs
    text = text.replace(/\$\$+/g, '$');

    return text.trim();
};

// ==========================================
// VIETNAMESE EXAM QUESTION PARSER ENGINE
// ==========================================
export const parseExamText = (rawText) => {
    if (!rawText || !rawText.trim()) return [];

    let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    // 1. Extract bottom Answer Key Table if present
    const answersMap = {};
    const answerTableRegex = /(?:bảng đáp án|đáp án tham khảo|bảng tra đáp án)[\s\S]*$/i;
    const answerTableMatch = text.match(answerTableRegex);
    if (answerTableMatch) {
        const tableText = answerTableMatch[0];
        text = text.substring(0, answerTableMatch.index).trim();
        const itemRegex = /(?:Câu\s*)?(\d+)[\s.:\-)\]]+\s*([A-D])/gi;
        let match;
        while ((match = itemRegex.exec(tableText)) !== null) {
            answersMap[parseInt(match[1], 10)] = match[2].toUpperCase();
        }
    }

    // 2. Find all Question headers using clean regex
    const headerRegex = /(?:^|\n)\s*(?:\[?\s*(?:Câu|Bài|Question)\s*(\d+)[\s.:\-)\]]+)/gi;
    const headerMatches = [];
    let hMatch;
    while ((hMatch = headerRegex.exec(text)) !== null) {
        headerMatches.push({
            order: parseInt(hMatch[1], 10),
            startIndex: hMatch.index,
            headerLength: hMatch[0].length
        });
    }

    if (headerMatches.length === 0) {
        // Fallback: Check for standard numbered items like "1.", "2."
        const numHeaderRegex = /(?:^|\n)\s*(\d+)[\.\)]\s+/g;
        while ((hMatch = numHeaderRegex.exec(text)) !== null) {
            headerMatches.push({
                order: parseInt(hMatch[1], 10),
                startIndex: hMatch.index,
                headerLength: hMatch[0].length
            });
        }
    }

    // If still no headers found, treat entire text as single question
    if (headerMatches.length === 0) {
        headerMatches.push({
            order: 1,
            startIndex: 0,
            headerLength: 0
        });
    }

    const questions = [];

    for (let i = 0; i < headerMatches.length; i++) {
        const current = headerMatches[i];
        const next = headerMatches[i + 1];

        const rawBlock = next
            ? text.substring(current.startIndex + current.headerLength, next.startIndex).trim()
            : text.substring(current.startIndex + current.headerLength).trim();

        if (!rawBlock && headerMatches.length > 1) continue;

        const order = current.order || (i + 1);

        // Extract Explanation if present
        let explanation = '';
        let contentAndOptions = rawBlock;
        const expMatch = rawBlock.match(/(?:Lời giải|Hướng dẫn giải|Giải chi tiết|HD giải|HD)[\s.:]+([\s\S]*)$/i);
        if (expMatch) {
            explanation = expMatch[1].trim();
            contentAndOptions = rawBlock.substring(0, expMatch.index).trim();
        }

        // Extract inline answer if present (e.g. "Đáp án: A", "Chọn A")
        let extractedAnswer = answersMap[order] || 'A';
        const inlineAnswerMatch = contentAndOptions.match(/(?:Đáp án đúng|Đáp án|Chọn|Key)[\s.:\-)\]]+([A-D])/i);
        if (inlineAnswerMatch) {
            extractedAnswer = inlineAnswerMatch[1].toUpperCase();
            contentAndOptions = contentAndOptions.replace(/(?:Đáp án đúng|Đáp án|Chọn|Key)[\s.:\-)\]]+[A-D]/gi, '').trim();
        }

        // 5. Check for Multiple Choice (A, B, C, D)
        const mcTagRegex = /(?:^|\s|\n)([*_]?)\s*(?:\\choice\s*)?(?:\[?\s*([A-D])[\.\)\:\-\]]+)\s*/g;
        const mcPositions = [];
        let mcMatch;
        while ((mcMatch = mcTagRegex.exec(contentAndOptions)) !== null) {
            mcPositions.push({
                isStarred: !!mcMatch[1],
                id: mcMatch[2].toUpperCase(),
                startIndex: mcMatch.index,
                tagLength: mcMatch[0].length
            });
        }

        // 6. Check for True/False (a, b, c, d)
        const tfTagRegex = /(?:^|\s|\n)([*_]?)\s*(?:\\item\s*)?(?:\[?\s*([a-d])[\.\)\:\-\]]+)\s*/g;
        const tfPositions = [];
        let tfMatch;
        while ((tfMatch = tfTagRegex.exec(contentAndOptions)) !== null) {
            tfPositions.push({
                isStarred: !!tfMatch[1],
                id: tfMatch[2].toLowerCase(),
                startIndex: tfMatch.index,
                tagLength: tfMatch[0].length
            });
        }

        let qType = 'essay';
        let options = [];
        let questionContent = '';

        if (mcPositions.length >= 2) {
            qType = 'multiple_choice';
            options = [
                { id: 'A', text: '' },
                { id: 'B', text: '' },
                { id: 'C', text: '' },
                { id: 'D', text: '' }
            ];
            questionContent = contentAndOptions.substring(0, mcPositions[0].startIndex).trim();

            for (let j = 0; j < mcPositions.length; j++) {
                const optCur = mcPositions[j];
                const optNext = mcPositions[j + 1];

                const optRawText = optNext
                    ? contentAndOptions.substring(optCur.startIndex + optCur.tagLength, optNext.startIndex).trim()
                    : contentAndOptions.substring(optCur.startIndex + optCur.tagLength).trim();

                if (optCur.isStarred) {
                    extractedAnswer = optCur.id;
                }

                const targetOpt = options.find(o => o.id === optCur.id);
                if (targetOpt) {
                    targetOpt.text = normalizeMathToLatex(optRawText);
                }
            }
        } else if (tfPositions.length >= 2) {
            qType = 'true_false';
            options = [
                { id: 'a', text: '' },
                { id: 'b', text: '' },
                { id: 'c', text: '' },
                { id: 'd', text: '' }
            ];
            const tfAnswers = { a: true, b: false, c: false, d: true };
            questionContent = contentAndOptions.substring(0, tfPositions[0].startIndex).trim();

            for (let j = 0; j < tfPositions.length; j++) {
                const optCur = tfPositions[j];
                const optNext = tfPositions[j + 1];

                let optRawText = optNext
                    ? contentAndOptions.substring(optCur.startIndex + optCur.tagLength, optNext.startIndex).trim()
                    : contentAndOptions.substring(optCur.startIndex + optCur.tagLength).trim();

                // Check for True / False marker in text: [Đ], [S], \True, \False, (Đúng), (Sai)
                if (/\b(?:\[Đ\]|Đúng|\bTrue\b|\\True|\*)\b/i.test(optRawText) || optCur.isStarred) {
                    tfAnswers[optCur.id] = true;
                    optRawText = optRawText.replace(/\b(?:\[Đ\]|Đúng|\bTrue\b|\\True)\b/gi, '').trim();
                } else if (/\b(?:\[S\]|Sai|\bFalse\b|\\False)\b/i.test(optRawText)) {
                    tfAnswers[optCur.id] = false;
                    optRawText = optRawText.replace(/\b(?:\[S\]|Sai|\bFalse\b|\\False)\b/gi, '').trim();
                }

                const targetOpt = options.find(o => o.id === optCur.id);
                if (targetOpt) {
                    targetOpt.text = normalizeMathToLatex(optRawText);
                }
            }
            extractedAnswer = tfAnswers;
        } else {
            qType = 'essay';
            questionContent = contentAndOptions.trim();
        }

        questions.push({
            id: 'q_' + Date.now() + '_' + order,
            order: order,
            type: qType,
            content: normalizeMathToLatex(questionContent),
            imageUrl: '',
            options: options,
            correctAnswer: extractedAnswer,
            explanation: normalizeMathToLatex(explanation),
            explanationImageUrl: ''
        });
    }

    return questions;
};

// ==========================================
// FILE TEXT EXTRACTOR (.DOCX, .TXT, .PDF)
// ==========================================
export const extractTextFromFile = async (file) => {
    const fileName = file.name.toLowerCase();

    // 1. Microsoft Word Document (.docx)
    if (fileName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    }

    // 2. Plain Text / Markdown / TeX (.txt, .md, .tex, .json, .csv)
    if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.tex') || fileName.endsWith('.json') || file.type.startsWith('text/')) {
        return await file.text();
    }

    // 3. PDF Document (.pdf) using PDF.js
    if (fileName.endsWith('.pdf')) {
        try {
            const pdfjsLib = await import('pdfjs-dist');
            if (pdfjsLib.GlobalWorkerOptions) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
            }
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                let lastY = null;
                let pageText = '';

                for (const item of textContent.items) {
                    if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                        pageText += '\n';
                    } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
                        pageText += ' ';
                    }
                    pageText += item.str;
                    lastY = item.transform[5];
                }

                fullText += (fullText ? '\n\n' : '') + pageText;
            }

            if (fullText.trim()) {
                return cleanVietnamesePdfSpacedText(fullText);
            }
        } catch (pdfErr) {
            console.warn('PDF.js parse warning, trying fallback stream extractor:', pdfErr);
        }

        // Fallback binary stream scanner
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = uint8.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8[i]);
        }
        const textChunks = [];
        const tjRegex = /\(([^)]+)\)\s*Tj/g;
        let match;
        while ((match = tjRegex.exec(binary)) !== null) {
            textChunks.push(match[1]);
        }
        if (textChunks.length > 0) return textChunks.join(' ');
        const plainMatches = binary.match(/[\w\s\u00C0-\u1EF9.,:;?!+=\-*\/()\[\]{}<>^$_]{4,}/g);
        return plainMatches ? plainMatches.join('\n') : '';
    }

    // Default fallback: Try reading as text
    return await file.text();
};

export const ThptAiVisionScannerModal = ({
    isOpen,
    onClose,
    onImportQuestions,
    existingQuestionsCount = 0,
    showToast
}) => {
    const [rawText, setRawText] = useState('');
    const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // { name, size, type }
    const [isReadingFile, setIsReadingFile] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [importMode, setImportMode] = useState('append'); // 'append' | 'replace'
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    // Automatically parse raw text in real-time
    const parsedQuestions = useMemo(() => {
        if (!rawText.trim()) return [];
        return parseExamText(rawText);
    }, [rawText]);

    // Handle File Selection or Drop
    const handleFileProcess = async (file) => {
        if (!file) return;

        setIsReadingFile(true);
        setFileError(null);

        try {
            const text = await extractTextFromFile(file);
            if (!text || !text.trim()) {
                throw new Error(`Không thể trích xuất văn bản từ file "${file.name}". File có thể là ảnh quét thuần túy hoặc bị khóa mã hóa.`);
            }

            setRawText(text);
            setUploadedFileInfo({
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                type: file.name.split('.').pop().toUpperCase()
            });
            showToast?.(`Đã tải & đọc thành công file "${file.name}"`);
        } catch (err) {
            console.error('File Read Error:', err);
            setFileError(err.message || 'Lỗi đọc file.');
        } finally {
            setIsReadingFile(false);
        }
    };

    // Drag and Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFileProcess(files[0]);
        }
    };

    // Apply import to Exam Editor
    const handleApplyImport = () => {
        if (parsedQuestions.length === 0) return;
        onImportQuestions(parsedQuestions, importMode);
        onClose();
        showToast?.(`Đã nạp thành công ${parsedQuestions.length} câu hỏi vào đề thi!`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-5xl rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="p-4 bg-brand-cerulean text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-brand-jasper text-white rounded">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h3 className="font-serif-title font-bold text-base leading-tight">
                                Trình Nhập Nhanh & Tải File Đề thi (.DOCX / .PDF / .TXT)
                            </h3>
                            <p className="text-[11px] text-white/80 font-sans">
                                Tải file Word/PDF hoặc Dán văn bản để hệ thống tự động bóc tách câu hỏi, đáp án $A/B/C/D$ & chuẩn hóa công thức KaTeX
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setUploadedFileInfo(null);
                                setRawText(SAMPLE_EXAM_TEXT);
                            }}
                            className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
                            title="Nạp văn bản đề mẫu thử nghiệm"
                        >
                            <Copy size={13} /> Nạp văn bản mẫu thử
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* File Upload Banner / Dropzone Bar */}
                <div className="p-3 bg-brand-cream border-b border-brand-cerulean/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".docx,.doc,.pdf,.txt,.md,.tex,.json"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                handleFileProcess(e.target.files[0]);
                            }
                        }}
                        className="hidden"
                    />

                    {uploadedFileInfo ? (
                        <div className="flex items-center justify-between w-full bg-white p-2.5 rounded border border-emerald-300 shadow-sm">
                            <div className="flex items-center gap-2.5 text-xs">
                                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded">
                                    <FileCheck size={16} />
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 block font-serif-title">
                                        {uploadedFileInfo.name} ({uploadedFileInfo.size})
                                    </span>
                                    <span className="text-[11px] text-emerald-700 font-sans">
                                        ✓ Đã bóc tách thành công <strong>{parsedQuestions.length} câu hỏi</strong> từ file
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded flex items-center gap-1 transition-colors"
                            >
                                <RefreshCw size={12} /> Chọn file khác
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-brand-cerulean hover:text-white text-brand-cerulean border border-brand-cerulean/30 rounded font-serif-title font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <Upload size={15} className="text-brand-jasper" />
                                <span>Tải lên file đề thi (.DOCX / .PDF / .TXT)</span>
                            </button>

                            <span className="text-[11px] text-gray-500 font-sans italic">
                                * Hoặc Kéo & Thả file trực tiếp vào khung soạn thảo bên dưới
                            </span>
                        </div>
                    )}
                </div>

                {/* Error Banner */}
                {fileError && (
                    <div className="p-2.5 bg-red-50 border-b border-red-200 text-xs text-red-700 flex items-center gap-2 px-4">
                        <AlertCircle size={15} className="text-red-600 shrink-0" />
                        <span><strong>Lỗi đọc file:</strong> {fileError}</span>
                    </div>
                )}

                {/* Main Split Pane Body */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex-1 overflow-hidden p-4 bg-brand-cream/30 flex flex-col transition-colors ${
                        isDragging ? 'bg-brand-cerulean/10 ring-2 ring-brand-jasper ring-inset' : ''
                    }`}
                >
                    <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
                        {/* Left Pane: Raw Text Input */}
                        <div className="flex-1 flex flex-col bg-white border border-brand-cerulean/20 rounded shadow-sm overflow-hidden">
                            <div className="p-2.5 bg-brand-cerulean/5 border-b border-brand-cerulean/15 flex justify-between items-center text-xs">
                                <span className="font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                    <AlignLeft size={14} /> Nội dung văn bản đề thi (Có thể chỉnh sửa trực tiếp):
                                </span>
                                {rawText && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRawText('');
                                            setUploadedFileInfo(null);
                                        }}
                                        className="text-gray-400 hover:text-red-600 font-bold text-[11px]"
                                    >
                                        Xóa nội dung
                                    </button>
                                )}
                            </div>

                            <textarea
                                value={rawText}
                                onChange={e => setRawText(e.target.value)}
                                placeholder={`Dán nội dung đề thi vào đây hoặc Tải file .docx / .pdf ở trên!\n\nVí dụ cấu trúc:\nCâu 1: Cho hàm số y = f(x)... có cực trị tại:\nA. 0\n*B. 1  (dấu * trước đáp án đúng)\nC. 2\nD. 3\nLời giải: Ta có f'(x) = 0...\n\nCâu 2. Cho hình chóp S.ABC có đáy...\nA. a^3   B. a^3*sqrt(3)   C. 2a^3   D. 4a^3\nĐáp án: B`}
                                className="flex-1 p-3.5 text-xs font-mono text-gray-800 focus:outline-none resize-none leading-relaxed bg-white"
                            />

                            <div className="p-2 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 font-sans flex justify-between items-center">
                                <span>* Tự động nhận diện: `Câu 1:`, `A.`, `B.`, `C.`, `D.`, `*A.`, `Lời giải:...`</span>
                                <span>{rawText.length} ký tự</span>
                            </div>
                        </div>

                        {/* Right Pane: Live KaTeX Preview & Parsed Questions */}
                        <div className="flex-1 flex flex-col bg-white border border-brand-cerulean/20 rounded shadow-sm overflow-hidden">
                            <div className="p-2.5 bg-emerald-50 border-b border-emerald-200 flex justify-between items-center text-xs">
                                <span className="font-serif-title font-bold text-emerald-900 flex items-center gap-1.5">
                                    <CheckCircle2 size={15} className="text-emerald-700" />
                                    Kết quả bóc tách thời gian thực ({parsedQuestions.length} câu hỏi):
                                </span>
                                <span className="text-[11px] font-sans font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                                    {parsedQuestions.length > 0 ? 'Sẵn sàng nạp' : 'Chờ dữ liệu'}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-brand-cream/20">
                                {isReadingFile ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-brand-cerulean space-y-2">
                                        <RefreshCw size={28} className="animate-spin text-brand-cerulean" />
                                        <p className="text-xs font-serif-title font-bold">
                                            Đang đọc và trích xuất nội dung từ file...
                                        </p>
                                    </div>
                                ) : parsedQuestions.length > 0 ? (
                                    parsedQuestions.map((q, idx) => (
                                        <div key={q.id || idx} className="bg-white border border-brand-cerulean/20 p-3.5 rounded shadow-sm space-y-2.5">
                                            <div className="flex justify-between items-center">
                                                <span className="px-2 py-0.5 bg-brand-cerulean text-white font-serif-title font-bold text-xs rounded">
                                                    Câu {idx + 1} ({q.type === 'true_false' ? 'Đúng/Sai' : q.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'})
                                                </span>
                                                <span className="text-[11px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                    Đáp án: {typeof q.correctAnswer === 'string'
                                                        ? q.correctAnswer
                                                        : typeof q.correctAnswer === 'object' && q.correctAnswer !== null
                                                            ? Object.entries(q.correctAnswer).map(([k, v]) => `${k}:${v ? 'Đ' : 'S'}`).join(' | ')
                                                            : 'Chưa có'}
                                                </span>
                                            </div>

                                            {/* Question Content */}
                                            <div className="text-xs text-brand-ink font-body leading-relaxed">
                                                <MathText text={q.content} />
                                            </div>

                                            {/* Options */}
                                            {q.type === 'true_false' ? (
                                                <div className="space-y-1 pt-1">
                                                    {q.options?.map(opt => {
                                                        const ansObj = typeof q.correctAnswer === 'object' && q.correctAnswer !== null ? q.correctAnswer : {};
                                                        const isTrue = ansObj[opt.id] === true || ansObj[opt.id] === 'Đ';
                                                        return (
                                                            <div key={opt.id} className="p-1.5 rounded text-xs flex items-center justify-between border bg-white border-gray-200">
                                                                <div className="flex items-center gap-1.5 flex-1 font-body">
                                                                    <span className="font-serif-title font-bold text-brand-cerulean uppercase">{opt.id})</span>
                                                                    <MathText text={opt.text} />
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isTrue ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                                                                    {isTrue ? '✓ Đúng' : '✗ Sai'}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                                    {q.options?.map(opt => (
                                                        <div
                                                            key={opt.id}
                                                            className={`p-1.5 rounded text-xs flex items-start gap-1.5 border ${
                                                                q.correctAnswer === opt.id
                                                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                                                                    : 'bg-white border-gray-200 text-gray-700'
                                                            }`}
                                                        >
                                                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                                                q.correctAnswer === opt.id ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-700'
                                                            }`}>
                                                                {opt.id}
                                                            </span>
                                                            <div className="flex-1 font-body">
                                                                <MathText text={opt.text} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Explanation */}
                                            {q.explanation && (
                                                <div className="p-2 bg-blue-50/60 border border-blue-200 rounded text-xs text-blue-950 space-y-0.5">
                                                    <span className="font-serif-title font-bold text-brand-cerulean block text-[10px]">
                                                        Lời giải chi tiết:
                                                    </span>
                                                    <MathText text={q.explanation} />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-2">
                                        <FileText size={32} className="text-gray-300 mx-auto" />
                                        <p className="text-xs font-serif-title font-bold text-gray-500">
                                            Chưa có câu hỏi nào được bóc tách
                                        </p>
                                        <p className="text-[11px] text-gray-400 font-sans max-w-xs">
                                            Hãy tải lên file Word (.docx), PDF hoặc dán văn bản đề thi vào khung bên trái.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-3.5 bg-white border-t border-brand-cerulean/20 flex justify-between items-center">
                    {/* Mode Selector */}
                    <div className="flex items-center gap-4 text-xs font-sans">
                        <span className="font-bold text-brand-cerulean font-serif-title">Phương thức nạp:</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                                type="radio"
                                name="importMode"
                                value="append"
                                checked={importMode === 'append'}
                                onChange={() => setImportMode('append')}
                                className="text-brand-cerulean"
                            />
                            <span>Thêm tiếp vào sau ({existingQuestionsCount} câu hiện có)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                                type="radio"
                                name="importMode"
                                value="replace"
                                checked={importMode === 'replace'}
                                onChange={() => setImportMode('replace')}
                                className="text-brand-cerulean"
                            />
                            <span>Thay thế toàn bộ câu hỏi</span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs text-gray-600 hover:text-gray-900"
                        >
                            Đóng
                        </button>

                        <button
                            type="button"
                            disabled={parsedQuestions.length === 0}
                            onClick={handleApplyImport}
                            className="px-6 py-2 bg-brand-cerulean hover:bg-brand-jasper text-white font-serif-title font-bold text-xs shadow-editorial transition-all disabled:opacity-40 flex items-center gap-1.5 rounded"
                        >
                            <Check size={15} />
                            <span>Nhập {parsedQuestions.length} câu hỏi vào Đề thi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThptAiVisionScannerModal;
