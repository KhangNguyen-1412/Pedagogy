import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Plus, Trash2, Check, Image, Calculator, HelpCircle, Eye,
    ArrowUp, ArrowDown, Sparkles, Copy, FileText, ChevronRight, AlertCircle, Upload, PenTool, Edit3
} from 'lucide-react';
import { MathText } from './MathText';
import { EditorialSelect } from './EditorialSelect';
import { ThptDrawingCanvasModal } from './ThptDrawingCanvasModal';

const QUESTION_TYPE_OPTIONS = [
    { value: 'multiple_choice', label: 'Trắc nghiệm 4 lựa chọn (A/B/C/D)' },
    { value: 'true_false', label: 'Trắc nghiệm Đúng/Sai (THPT 2025+)' },
    { value: 'short_answer', label: 'Trắc nghiệm Điền đáp số' },
    { value: 'essay', label: 'Tự luận / Câu hỏi mở' }
];

const QUICK_MATH_SYMBOLS = [
    { label: 'Phân số', tex: '\\frac{a}{b}', preview: 'a/b' },
    { label: 'Căn bậc hai', tex: '\\sqrt{x}', preview: '√x' },
    { label: 'Số mũ', tex: 'x^{2}', preview: 'x²' },
    { label: 'Chỉ số dưới', tex: 'x_{1}', preview: 'x₁' },
    { label: 'Tích phân', tex: '\\int_{a}^{b} f(x) dx', preview: '∫' },
    { label: 'Giới hạn', tex: '\\lim_{x \\to x_0} f(x)', preview: 'lim' },
    { label: 'Vector', tex: '\\vec{u}', preview: 'u⃗' },
    { label: 'Hệ phương trình', tex: '\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}', preview: '{' },
    { label: 'Vuông góc', tex: '\\perp', preview: '⊥' },
    { label: 'Song song', tex: '\\parallel', preview: '∥' },
    { label: 'Góc', tex: '\\widehat{ABC}', preview: '∠' },
    { label: 'Vô cực', tex: '\\infty', preview: '∞' },
    { label: 'Pi', tex: '\\pi', preview: 'π' },
    { label: 'Delta', tex: '\\Delta', preview: 'Δ' },
    { label: 'Alpha', tex: '\\alpha', preview: 'α' },
    { label: 'Beta', tex: '\\beta', preview: 'β' },
    { label: 'Thuộc', tex: '\\in', preview: '∈' },
    { label: 'Tương đương', tex: '\\Leftrightarrow', preview: '⇔' },
    { label: 'Suy ra', tex: '\\Rightarrow', preview: '⇒' },
];

export const ThptExamEditorModal = ({
    isOpen,
    onClose,
    examToEdit,
    subjects,
    years,
    examTypes,
    onSaveExam,
    showToast
}) => {
    const [formData, setFormData] = useState(() => {
        if (examToEdit) return JSON.parse(JSON.stringify(examToEdit));
        return {
            id: 'exam_' + Date.now(),
            code: 'THPT-' + new Date().getFullYear() + '-01',
            title: '',
            subjectId: subjects[0]?.id || 'math',
            year: years[0] || '2026',
            examTypeId: examTypes[0]?.id || 'trial_school',
            duration: 90,
            maxScore: 10,
            description: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questions: [
                {
                    id: 'q_' + Date.now(),
                    order: 1,
                    type: 'multiple_choice',
                    content: '',
                    imageUrl: '',
                    options: [
                        { id: 'A', text: '' },
                        { id: 'B', text: '' },
                        { id: 'C', text: '' },
                        { id: 'D', text: '' }
                    ],
                    correctAnswer: 'A',
                    explanation: '',
                    explanationImageUrl: ''
                }
            ]
        };
    });

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [previewMode, setPreviewMode] = useState(false);
    const [drawingTarget, setDrawingTarget] = useState(null); // 'question' | 'explanation' | null
    const fileInputRef = useRef(null);
    const expFileInputRef = useRef(null);

    if (!isOpen) return null;

    const currentQuestion = formData.questions[activeQuestionIndex] || formData.questions[0];

    // Insert LaTeX symbol at cursor or append
    const handleInsertMath = (texSymbol, targetField = 'content') => {
        if (!currentQuestion) return;
        const targetText = `$${texSymbol}$`;
        const updatedQuestions = [...formData.questions];
        
        if (targetField === 'content') {
            updatedQuestions[activeQuestionIndex].content = (updatedQuestions[activeQuestionIndex].content || '') + ' ' + targetText;
        } else if (targetField === 'explanation') {
            updatedQuestions[activeQuestionIndex].explanation = (updatedQuestions[activeQuestionIndex].explanation || '') + ' ' + targetText;
        }
        
        setFormData({ ...formData, questions: updatedQuestions });
    };

    // Update active question property
    const updateActiveQuestion = (field, value) => {
        const updated = [...formData.questions];
        updated[activeQuestionIndex] = {
            ...updated[activeQuestionIndex],
            [field]: value
        };
        setFormData({ ...formData, questions: updated });
    };

    // Update option text
    const updateOptionText = (optId, text) => {
        const updated = [...formData.questions];
        const q = updated[activeQuestionIndex];
        q.options = q.options.map(opt => opt.id === optId ? { ...opt, text } : opt);
        setFormData({ ...formData, questions: updated });
    };

    // Add new question
    const handleAddQuestion = () => {
        const newOrder = formData.questions.length + 1;
        const newQ = {
            id: 'q_' + Date.now() + '_' + newOrder,
            order: newOrder,
            type: 'multiple_choice',
            content: '',
            imageUrl: '',
            options: [
                { id: 'A', text: '' },
                { id: 'B', text: '' },
                { id: 'C', text: '' },
                { id: 'D', text: '' }
            ],
            correctAnswer: 'A',
            explanation: '',
            explanationImageUrl: ''
        };
        setFormData({
            ...formData,
            questions: [...formData.questions, newQ]
        });
        setActiveQuestionIndex(formData.questions.length);
    };

    // Duplicate question
    const handleDuplicateQuestion = (index) => {
        const target = formData.questions[index];
        const duplicated = {
            ...JSON.parse(JSON.stringify(target)),
            id: 'q_' + Date.now(),
            order: formData.questions.length + 1
        };
        const updated = [...formData.questions, duplicated];
        setFormData({ ...formData, questions: updated });
        setActiveQuestionIndex(updated.length - 1);
        showToast?.('Đã nhân bản câu hỏi');
    };

    // Delete question
    const handleDeleteQuestion = (index) => {
        if (formData.questions.length <= 1) {
            alert('Đề thi cần có ít nhất 1 câu hỏi.');
            return;
        }
        const updated = formData.questions.filter((_, idx) => idx !== index).map((q, idx) => ({
            ...q,
            order: idx + 1
        }));
        setFormData({ ...formData, questions: updated });
        setActiveQuestionIndex(Math.max(0, index - 1));
    };

    // Image Upload handler (Base64 conversion for instant embedding)
    const handleImageUpload = (e, isExplanation = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Kích thước ảnh tối đa là 2MB. Vui lòng nén hoặc chọn ảnh nhỏ hơn.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (isExplanation) {
                updateActiveQuestion('explanationImageUrl', reader.result);
            } else {
                updateActiveQuestion('imageUrl', reader.result);
            }
            showToast?.('Đã chèn ảnh thành công');
        };
        reader.readAsDataURL(file);
    };

    // Submit and save exam
    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Vui lòng nhập tiêu đề đề thi.');
            return;
        }

        const cleanedExam = {
            ...formData,
            title: formData.title.trim(),
            code: formData.code.trim().toUpperCase(),
            totalQuestions: formData.questions.length,
            updatedAt: new Date().toISOString()
        };

        onSaveExam(cleanedExam);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-brand-cerulean/50 backdrop-blur-sm animate-backdrop-in">
            <div className="bg-brand-cream border-editorial shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col animate-modal-pop-in overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-brand-cerulean/20 flex justify-between items-center bg-brand-cerulean text-brand-cream shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded">
                            <FileText size={22} className="text-brand-cream" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif-title font-bold tracking-wide">
                                {examToEdit ? 'Chỉnh sửa Đề thi THPT' : 'Tạo Đề thi THPT Mới'}
                            </h2>
                            <p className="text-xs opacity-80 font-sans">
                                Soạn thảo câu hỏi, công thức toán LaTeX & hình ảnh đáp án chi tiết
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className={`px-3 py-1.5 rounded text-xs font-sans font-bold flex items-center gap-1.5 transition-colors ${
                                previewMode ? 'bg-brand-jasper text-white' : 'bg-white/15 text-brand-cream hover:bg-white/25'
                            }`}
                        >
                            <Eye size={14} /> {previewMode ? 'Chế độ Soạn thảo' : 'Xem trước KaTeX'}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded transition-colors text-brand-cream"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left Sidebar: General Info & Question List Navigation */}
                    <div className="w-full md:w-80 border-r border-brand-cerulean/20 bg-white/50 flex flex-col overflow-y-auto p-4 space-y-5 shrink-0">
                        {/* General Info Form */}
                        <div className="space-y-3 p-3 bg-white border border-brand-cerulean/20 shadow-sm rounded-sm">
                            <h3 className="text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                Thông tin chung đề thi
                            </h3>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Tiêu đề đề thi *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Vd: Đề thi thử THPT 2025 Môn Toán..."
                                    className="w-full input-editorial text-xs font-body px-1 py-1"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Mã đề</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="TOAN-101"
                                        className="w-full input-editorial text-xs font-body px-1 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Thời gian (phút)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="300"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                                        className="w-full input-editorial text-xs font-body px-1 py-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Môn học</label>
                                    <EditorialSelect
                                        value={formData.subjectId}
                                        onChange={val => setFormData({ ...formData, subjectId: val })}
                                        options={subjects.map(s => ({ value: s.id, label: s.name }))}
                                        size="sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Năm thi</label>
                                    <EditorialSelect
                                        value={formData.year}
                                        onChange={val => setFormData({ ...formData, year: val })}
                                        options={years.map(y => ({ value: y, label: `Năm ${y}` }))}
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Kỳ thi / Loại đề</label>
                                <EditorialSelect
                                    value={formData.examTypeId}
                                    onChange={val => setFormData({ ...formData, examTypeId: val })}
                                    options={examTypes.map(t => ({ value: t.id, label: t.name }))}
                                    size="sm"
                                />
                            </div>
                        </div>

                        {/* Question List Index Matrix */}
                        <div className="space-y-2 flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                    Danh sách câu hỏi ({formData.questions.length})
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="p-1 text-xs bg-brand-cerulean text-white hover:bg-brand-jasper transition-colors rounded flex items-center gap-1 font-bold"
                                >
                                    <Plus size={12} /> Thêm câu
                                </button>
                            </div>

                            <div className="grid grid-cols-5 gap-1.5 max-h-56 overflow-y-auto p-1">
                                {formData.questions.map((q, idx) => {
                                    const isSelected = activeQuestionIndex === idx;
                                    const hasContent = !!q.content?.trim();
                                    return (
                                        <button
                                            key={q.id || idx}
                                            type="button"
                                            onClick={() => setActiveQuestionIndex(idx)}
                                            className={`h-9 rounded font-sans text-xs font-bold transition-all relative flex items-center justify-center ${
                                                isSelected
                                                    ? 'bg-brand-jasper text-white shadow-md scale-105'
                                                    : hasContent
                                                        ? 'bg-white border border-brand-cerulean text-brand-cerulean hover:bg-brand-cerulean/10'
                                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                            }`}
                                        >
                                            {idx + 1}
                                            {q.correctAnswer && (
                                                <span className="absolute -top-1 -right-1 text-[9px] bg-emerald-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                                                    {q.correctAnswer}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Area: Active Question Editor or Live Preview */}
                    <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-5 bg-brand-cream">
                        {currentQuestion && (
                            <>
                                {/* Question Header Bar */}
                                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-brand-cerulean/20 gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-brand-cerulean text-white font-serif-title font-bold text-sm rounded shrink-0">
                                            Câu {activeQuestionIndex + 1} / {formData.questions.length}
                                        </span>
                                        <EditorialSelect
                                            value={currentQuestion.type || 'multiple_choice'}
                                            onChange={val => updateActiveQuestion('type', val)}
                                            options={QUESTION_TYPE_OPTIONS}
                                            size="sm"
                                            className="w-72"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDuplicateQuestion(activeQuestionIndex)}
                                            className="px-2.5 py-1 text-xs text-brand-cerulean bg-white border border-brand-cerulean/30 hover:border-brand-cerulean rounded flex items-center gap-1"
                                            title="Nhân bản câu này"
                                        >
                                            <Copy size={13} /> Nhân bản
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteQuestion(activeQuestionIndex)}
                                            className="px-2.5 py-1 text-xs text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded flex items-center gap-1"
                                            title="Xóa câu hỏi này"
                                        >
                                            <Trash2 size={13} /> Xóa câu
                                        </button>
                                    </div>
                                </div>

                                {/* Math Toolbar */}
                                <div className="p-2.5 bg-white border border-brand-cerulean/20 rounded shadow-sm">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Calculator size={14} className="text-brand-cerulean" />
                                        <span className="text-xs font-serif-title font-bold text-brand-cerulean">
                                            Chèn nhanh ký hiệu Toán & Công thức LaTeX:
                                        </span>
                                        <span className="text-[11px] text-gray-500 italic">
                                            (Nhấn vào ký hiệu để chèn cú pháp $...$)
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_MATH_SYMBOLS.map(sym => (
                                            <button
                                                key={sym.label}
                                                type="button"
                                                onClick={() => handleInsertMath(sym.tex, 'content')}
                                                className="px-2 py-1 bg-brand-cream hover:bg-brand-cerulean hover:text-white text-brand-cerulean border border-brand-cerulean/20 rounded font-serif text-xs transition-colors"
                                                title={`${sym.label}: $${sym.tex}$`}
                                            >
                                                {sym.preview}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Question Content */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-serif-title font-bold text-brand-cerulean">
                                        Nội dung Câu hỏi (Đề bài):
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={currentQuestion.content}
                                        onChange={e => updateActiveQuestion('content', e.target.value)}
                                        placeholder="Nhập nội dung đề bài... Hỗ trợ công thức $x^2 + y^2 = 1$ hoặc $$\int_{0}^{\pi} \sin(x)dx$$"
                                        className="w-full p-3 bg-white border border-brand-cerulean/30 rounded font-body text-sm text-brand-ink focus:outline-none focus:border-brand-jasper shadow-inner"
                                    />
                                    {currentQuestion.content && (
                                        <div className="p-3 bg-brand-cerulean/5 border border-brand-cerulean/15 rounded">
                                            <p className="text-[11px] font-serif-title text-brand-cerulean font-bold uppercase mb-1">
                                                Xem trước hiển thị đề bài:
                                            </p>
                                            <MathText text={currentQuestion.content} className="text-sm text-brand-ink" />
                                        </div>
                                    )}
                                </div>

                                {/* Question Image / Graph with 2 Options */}
                                <div className="p-3.5 bg-white border border-brand-cerulean/20 rounded space-y-3">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <span className="text-xs font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                            <Image size={14} className="text-brand-jasper" /> Hình ảnh / Biểu đồ / Đồ thị đi kèm:
                                        </span>

                                        {/* 2 Clear Options */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Option 1: Upload */}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={e => handleImageUpload(e, false)}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-2.5 py-1 bg-white border border-brand-cerulean/30 hover:border-brand-jasper text-brand-cerulean hover:text-brand-jasper text-xs font-bold rounded flex items-center gap-1 transition-all shadow-sm"
                                                title="Tải ảnh có sẵn từ máy tính"
                                            >
                                                <Upload size={12} /> 1. Up hình có sẵn
                                            </button>

                                            {/* Option 2: Live Canvas Drawing */}
                                            <button
                                                type="button"
                                                onClick={() => setDrawingTarget('question')}
                                                className="px-2.5 py-1 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-bold rounded flex items-center gap-1 transition-all shadow-sm"
                                                title="Mở bảng vẽ trực tiếp: Đồ thị hàm số, trục Oxy, hình học không gian, mạch điện..."
                                            >
                                                <PenTool size={12} /> 2. Tự vẽ trên hệ thống
                                            </button>
                                        </div>
                                    </div>

                                    {/* URL input fallback */}
                                    <input
                                        type="url"
                                        value={currentQuestion.imageUrl || ''}
                                        onChange={e => updateActiveQuestion('imageUrl', e.target.value)}
                                        placeholder="Hoặc dán URL ảnh trực tiếp (https://...)"
                                        className="w-full input-editorial text-xs font-body px-2 py-1 bg-brand-cream/30"
                                    />

                                    {/* Image Preview & Edit Button */}
                                    {currentQuestion.imageUrl && (
                                        <div className="p-2 bg-brand-cream/50 border border-brand-cerulean/20 rounded flex items-start gap-4">
                                            <div className="relative inline-block border border-brand-cerulean/20 p-1 bg-white rounded">
                                                <img
                                                    src={currentQuestion.imageUrl}
                                                    alt="Hình minh họa đề bài"
                                                    className="max-h-48 max-w-full object-contain rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateActiveQuestion('imageUrl', '')}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                                                    title="Xóa hình ảnh này"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>

                                            <div className="space-y-2 text-xs">
                                                <p className="font-serif-title font-bold text-brand-cerulean">Hình ảnh đính kèm hiện tại</p>
                                                <p className="text-gray-500 font-body text-[11px]">Hình vẽ sẽ hiển thị trực tiếp ngay dưới đề bài câu hỏi.</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setDrawingTarget('question')}
                                                    className="px-2.5 py-1 bg-white border border-brand-cerulean/30 hover:border-brand-jasper text-brand-cerulean text-[11px] font-bold rounded flex items-center gap-1"
                                                >
                                                    <Edit3 size={12} /> Tiếp tục chỉnh sửa trên Studio vẽ
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Options (A, B, C, D) & Correct Answer Selection */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                            4 Lựa chọn Đáp án (Chọn tròn để đặt Đáp án đúng):
                                        </label>
                                        <span className="text-xs font-sans text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                                            Đáp án đúng hiện tại: {currentQuestion.correctAnswer || 'Chưa chọn'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {currentQuestion.options?.map((opt) => {
                                            const isCorrect = currentQuestion.correctAnswer === opt.id;
                                            return (
                                                <div
                                                    key={opt.id}
                                                    className={`p-3 border rounded bg-white transition-all space-y-1.5 ${
                                                        isCorrect
                                                            ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                                                            : 'border-brand-cerulean/20 hover:border-brand-cerulean/40'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`correct_ans_${currentQuestion.id}`}
                                                                checked={isCorrect}
                                                                onChange={() => updateActiveQuestion('correctAnswer', opt.id)}
                                                                className="accent-emerald-600 w-4 h-4 cursor-pointer"
                                                            />
                                                            <span className={`font-serif-title font-bold text-sm ${isCorrect ? 'text-emerald-700' : 'text-brand-cerulean'}`}>
                                                                Đáp án {opt.id}
                                                            </span>
                                                        </label>
                                                        {isCorrect && (
                                                            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5">
                                                                <Check size={12} /> ĐÚNG
                                                            </span>
                                                        )}
                                                    </div>

                                                    <input
                                                        type="text"
                                                        value={opt.text}
                                                        onChange={e => updateOptionText(opt.id, e.target.value)}
                                                        placeholder={`Nội dung đáp án ${opt.id}... (vd: $x = 2$)`}
                                                        className="w-full input-editorial text-xs font-body px-1 py-1"
                                                    />

                                                    {opt.text && (
                                                        <div className="pt-1 text-xs text-brand-ink/90 font-serif">
                                                            <span className="text-[10px] text-gray-400 mr-1">Preview:</span>
                                                            <MathText text={opt.text} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Explanation & Solution Guide */}
                                <div className="p-4 bg-white border border-brand-cerulean/20 rounded shadow-sm space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={15} className="text-brand-jasper" />
                                            <label className="text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                                Lời giải chi tiết & Phương pháp giải (Explanation):
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                ref={expFileInputRef}
                                                accept="image/*"
                                                onChange={e => handleImageUpload(e, true)}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => expFileInputRef.current?.click()}
                                                className="px-2 py-0.5 bg-brand-cerulean/10 hover:bg-brand-cerulean hover:text-white text-brand-cerulean text-[11px] font-bold rounded flex items-center gap-1"
                                            >
                                                <Image size={11} /> Thêm ảnh lời giải
                                            </button>
                                        </div>
                                    </div>

                                    <textarea
                                        rows={3}
                                        value={currentQuestion.explanation || ''}
                                        onChange={e => updateActiveQuestion('explanation', e.target.value)}
                                        placeholder="Nhập hướng dẫn giải, phân tích từng bước, công thức áp dụng, lưu ý bẫy đề thi..."
                                        className="w-full p-2.5 bg-brand-cream/50 border border-brand-cerulean/20 rounded font-body text-xs text-brand-ink focus:outline-none focus:border-brand-jasper"
                                    />

                                    {currentQuestion.explanation && (
                                        <div className="p-3 bg-emerald-50/40 border border-emerald-200/60 rounded">
                                            <p className="text-[11px] font-serif-title text-emerald-800 font-bold uppercase mb-1">
                                                Xem trước lời giải:
                                            </p>
                                            <MathText text={currentQuestion.explanation} className="text-xs text-brand-ink" />
                                        </div>
                                    )}

                                    {/* Explanation Image & Actions */}
                                    <div className="pt-2 border-t border-brand-cerulean/10 space-y-2">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <span className="text-xs font-serif-title font-bold text-emerald-800 flex items-center gap-1.5">
                                                <Image size={13} /> Hình vẽ minh họa lời giải (tùy chọn):
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    ref={expFileInputRef}
                                                    accept="image/*"
                                                    onChange={e => handleImageUpload(e, true)}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => expFileInputRef.current?.click()}
                                                    className="px-2.5 py-1 bg-white border border-brand-cerulean/30 hover:border-brand-jasper text-brand-cerulean text-xs font-bold rounded flex items-center gap-1"
                                                >
                                                    <Upload size={12} /> Up ảnh lời giải
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDrawingTarget('explanation')}
                                                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-1"
                                                >
                                                    <PenTool size={12} /> Tự vẽ hình lời giải
                                                </button>
                                            </div>
                                        </div>

                                        {currentQuestion.explanationImageUrl && (
                                            <div className="p-2 bg-emerald-50/50 border border-emerald-200 rounded flex items-start gap-3">
                                                <div className="relative inline-block border border-emerald-300 p-1 bg-white rounded">
                                                    <img
                                                        src={currentQuestion.explanationImageUrl}
                                                        alt="Hình giải thích"
                                                        className="max-h-36 max-w-full object-contain rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateActiveQuestion('explanationImageUrl', '')}
                                                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                        title="Xóa hình lời giải"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                                <div className="text-xs space-y-1">
                                                    <p className="font-bold text-emerald-900">Hình minh họa lời giải</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDrawingTarget('explanation')}
                                                        className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                                                    >
                                                        <Edit3 size={11} /> Sửa trên Studio vẽ
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-brand-cerulean/20 bg-brand-cerulean/5 flex justify-between items-center shrink-0">
                    <div className="text-xs font-serif-title text-brand-cerulean">
                        Tổng số câu: <strong className="text-brand-jasper">{formData.questions.length}</strong> câu
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-brand-cerulean/30 font-sans text-xs font-bold text-brand-cerulean hover:bg-brand-cerulean/10"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                        >
                            <Check size={14} /> Lưu Đề thi
                        </button>
                    </div>
                </div>

                {/* Interactive Drawing Canvas Modal */}
                {drawingTarget && (
                    <ThptDrawingCanvasModal
                        isOpen={Boolean(drawingTarget)}
                        onClose={() => setDrawingTarget(null)}
                        initialImageUrl={
                            drawingTarget === 'question'
                                ? currentQuestion.imageUrl
                                : currentQuestion.explanationImageUrl
                        }
                        title={
                            drawingTarget === 'question'
                                ? `Studio Vẽ Đồ thị / Hình học cho Đề bài (Câu ${currentQuestion.order || activeQuestionIndex + 1})`
                                : `Studio Vẽ Hình minh họa Lời giải (Câu ${currentQuestion.order || activeQuestionIndex + 1})`
                        }
                        onSaveImage={(dataUrl) => {
                            if (drawingTarget === 'question') {
                                updateActiveQuestion('imageUrl', dataUrl);
                                showToast?.('Đã lưu hình vẽ vào câu hỏi thành công');
                            } else {
                                updateActiveQuestion('explanationImageUrl', dataUrl);
                                showToast?.('Đã lưu hình vẽ vào lời giải thành công');
                            }
                        }}
                    />
                )}
            </div>
        </div>,
        document.body
    );
};

export default ThptExamEditorModal;
