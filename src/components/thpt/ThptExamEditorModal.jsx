import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Plus, Trash2, Check, CheckCircle2, Image, Calculator, HelpCircle, Eye, ArrowLeft,
    ArrowUp, ArrowDown, Sparkles, Copy, FileText, ChevronRight, AlertCircle, Upload, PenTool, Edit3, Table,
    BookOpen, Landmark, Globe, Languages, Volume2, Quote, ListChecks, FileCheck, Layers, Link2, Music,
    ChevronDown, Scale, TrendingUp, Underline, Bold, Search, RefreshCw, Activity, FlaskConical, Dna, Binary
} from 'lucide-react';
import { MathText } from '../common/MathText';
import { EditorialSelect } from './EditorialSelect';
import { ThptDrawingCanvasModal } from './ThptDrawingCanvasModal';
import { ThptTableBuilderModal } from './ThptTableBuilderModal';

const QUESTION_TYPE_OPTIONS = [
    { value: 'multiple_choice', label: 'Trắc nghiệm 4 lựa chọn (A/B/C/D)' },
    { value: 'true_false', label: 'Trắc nghiệm Đúng/Sai (THPT 2025+)' },
    { value: 'short_answer', label: 'Trắc nghiệm Điền đáp số' },
    { value: 'essay', label: 'Tự luận / Câu hỏi mở' }
];

const ATLAT_PAGES = [
    { page: '4-5', label: 'Trang 4-5: Bản đồ Hành chính Việt Nam' },
    { page: '6-7', label: 'Trang 6-7: Bản đồ Địa chất & Khoáng sản' },
    { page: '9', label: 'Trang 9: Khí hậu Việt Nam' },
    { page: '10', label: 'Trang 10: Hệ thống Sông ngòi' },
    { page: '13', label: 'Trang 13: Các miền địa lí tự nhiên (Miền Bắc)' },
    { page: '14', label: 'Trang 14: Các miền địa lí tự nhiên (Miền Nam)' },
    { page: '15', label: 'Trang 15: Dân số & Mật độ dân cư' },
    { page: '17', label: 'Trang 17: Kinh tế chung & Các vùng kinh tế' },
    { page: '18', label: 'Trang 18: Nông nghiệp chung' },
    { page: '19', label: 'Trang 19: Nông nghiệp (Lúa, Cây công nghiệp, Chăn nuôi)' },
    { page: '20', label: 'Trang 20: Thủy sản & Lâm nghiệp' },
    { page: '21', label: 'Trang 21: Công nghiệp chung' },
    { page: '22', label: 'Trang 22: Các ngành công nghiệp trọng điểm' },
    { page: '23', label: 'Trang 23: Giao thông vận tải' },
    { page: '24', label: 'Trang 24: Thương mại (Nội thương & Ngoại thương)' },
    { page: '25', label: 'Trang 25: Du lịch Việt Nam' },
    { page: '26', label: 'Trang 26: Vùng Trung du miền núi Bắc Bộ & Đồng bằng sông Hồng' },
    { page: '27', label: 'Trang 27: Vùng Bắc Trung Bộ' },
    { page: '28', label: 'Trang 28: Vùng Duyên hải Nam Trung Bộ & Tây Nguyên' },
    { page: '29', label: 'Trang 29: Vùng Đông Nam Bộ & Đồng bằng sông Cửu Long' },
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

const getSubjectCategory = (subjectId) => {
    if (subjectId === 'literature') return 'literature';
    if (subjectId === 'history' || subjectId === 'economic_law') return 'history_law';
    if (subjectId === 'geography') return 'geography';
    if (subjectId === 'english') return 'english';
    if (subjectId === 'physics') return 'physics';
    if (subjectId === 'chemistry') return 'chemistry';
    if (subjectId === 'biology') return 'biology';
    if (subjectId === 'informatics') return 'informatics';
    return 'math';
};

const SpecializedToolMenu = ({
    currentSubject,
    currentSubjectCategory,
    options,
    onSelectAction
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, openUpward: false });
    const buttonRef = useRef(null);

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 280 && rect.top > 280;
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left: Math.max(8, Math.min(rect.left, window.innerWidth - 270)),
                width: Math.max(rect.width, 240),
                openUpward: openUp
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(e.target) &&
                !e.target.closest('.specialized-tool-portal')
            ) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [isOpen]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) updateCoords();
        setIsOpen(!isOpen);
    };

    const getSubjectIcon = (cat) => {
        switch (cat) {
            case 'literature': return BookOpen;
            case 'history_law': return Landmark;
            case 'geography': return Globe;
            case 'english': return Languages;
            case 'physics': return Activity;
            case 'chemistry': return FlaskConical;
            case 'biology': return Dna;
            case 'informatics': return Binary;
            default: return Calculator;
        }
    };

    const SubjectIcon = getSubjectIcon(currentSubjectCategory);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`py-1 px-2.5 bg-white border border-brand-cerulean/30 hover:border-brand-jasper text-xs font-serif-title font-bold text-brand-cerulean rounded-sm shadow-sm flex items-center justify-between gap-2 transition-all group ${
                    isOpen ? 'ring-1 ring-brand-jasper border-brand-jasper' : ''
                }`}
                title={`Công cụ chuyên biệt môn ${currentSubject.name}`}
            >
                <div className="flex items-center gap-1.5 truncate">
                    <SubjectIcon size={13} className="text-brand-jasper shrink-0" />
                    <span>Công cụ: {currentSubject.name}</span>
                </div>
                <ChevronDown
                    size={13}
                    className={`text-brand-cerulean shrink-0 transition-transform duration-200 group-hover:text-brand-jasper ${
                        isOpen ? 'rotate-180 text-brand-jasper' : ''
                    }`}
                />
            </button>

            {isOpen && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                        top: coords.openUpward ? 'auto' : `${coords.top}px`,
                        bottom: coords.openUpward ? `${coords.bottom}px` : 'auto',
                        zIndex: 9999
                    }}
                    className="specialized-tool-portal editorial-portal-dropdown bg-brand-cream border-editorial shadow-2xl max-h-72 overflow-y-auto animate-fade-in-down py-1"
                >
                    <div className="px-3.5 py-1.5 border-b border-brand-cerulean/15 text-[10px] uppercase font-serif-title font-bold text-gray-500 tracking-wider flex items-center gap-1.5">
                        <SubjectIcon size={12} className="text-brand-jasper" />
                        <span>Công cụ {currentSubject.name}</span>
                    </div>
                    {options.map((opt) => {
                        const IconComponent = opt.icon || Sparkles;
                        return (
                            <div
                                key={opt.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    onSelectAction(opt.id);
                                }}
                                className="px-3.5 py-2 text-xs font-body cursor-pointer flex items-center gap-2.5 text-brand-ink hover:bg-brand-cerulean/10 hover:text-brand-jasper transition-colors"
                            >
                                <IconComponent size={14} className="text-brand-cerulean shrink-0 group-hover:text-brand-jasper" />
                                <span className="truncate">{opt.label}</span>
                            </div>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
};

export const ThptExamEditorModal = ({
    isOpen,
    onClose,
    examToEdit,
    subjects = [],
    years = [],
    examTypes = [],
    onSaveExam,
    showToast
}) => {
    const [formData, setFormData] = useState(() => {
        if (examToEdit) return JSON.parse(JSON.stringify(examToEdit));
        return {
            id: 'exam_' + Date.now(),
            code: 'THPT-' + (years[0] || new Date().getFullYear()) + '-01',
            title: '',
            subjectId: subjects[0]?.id || 'math',
            year: years[0] || '2026',
            examTypeId: examTypes[0]?.id || 'trial_school',
            duration: 90,
            maxScore: 10,
            description: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            passages: [],
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
    const [drawingTarget, setDrawingTarget] = useState(null); // { target: 'question' | 'explanation', mode: 'add' | 'edit', index?: number }
    const [questionUrlInput, setQuestionUrlInput] = useState('');
    const [expUrlInput, setExpUrlInput] = useState('');
    const [isTableBuilderOpen, setIsTableBuilderOpen] = useState(false);
    const [tableTarget, setTableTarget] = useState('content'); // 'content' | 'explanation'
    const [isPassageManagerOpen, setIsPassageManagerOpen] = useState(false);
    const [editingPassage, setEditingPassage] = useState(null); // null or passage object
    const [selectedAtlatPage, setSelectedAtlatPage] = useState(ATLAT_PAGES[0].page);
    const [explanationPreviewHeight, setExplanationPreviewHeight] = useState('240px');
    const fileInputRef = useRef(null);
    const expFileInputRef = useRef(null);

    // Current category auto-derived from selected subject
    const currentSubjectCategory = getSubjectCategory(formData.subjectId);
    const currentSubject = subjects.find(s => s.id === formData.subjectId) || { name: 'Môn học' };

    // Keep formData perfectly in sync whenever examToEdit or isOpen changes
    useEffect(() => {
        if (!isOpen) return;

        if (examToEdit) {
            const cloned = JSON.parse(JSON.stringify(examToEdit));
            if (!cloned.questions || !Array.isArray(cloned.questions) || cloned.questions.length === 0) {
                cloned.questions = [
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
                ];
            }
            if (!Array.isArray(cloned.passages)) {
                cloned.passages = [];
            }
            setFormData(cloned);
            setActiveQuestionIndex(0);
        } else {
            setFormData({
                id: 'exam_' + Date.now(),
                code: 'THPT-' + (years[0] || new Date().getFullYear()) + '-01',
                title: '',
                subjectId: subjects[0]?.id || 'math',
                year: years[0] || '2026',
                examTypeId: examTypes[0]?.id || 'trial_school',
                duration: 90,
                maxScore: 10,
                description: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                passages: [],
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
            });
            setActiveQuestionIndex(0);
        }
    }, [isOpen, examToEdit]);

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
        } else if (targetField === 'correctAnswer') {
            updatedQuestions[activeQuestionIndex].correctAnswer = (updatedQuestions[activeQuestionIndex].correctAnswer || '') + ' ' + targetText;
        }
        
        setFormData({ ...formData, questions: updatedQuestions });
    };

    // Insert arbitrary text or template
    const handleInsertTemplate = (textToInsert, targetField = 'content') => {
        if (!currentQuestion) return;
        const updatedQuestions = [...formData.questions];
        const cur = updatedQuestions[activeQuestionIndex][targetField] || '';
        updatedQuestions[activeQuestionIndex][targetField] = cur ? `${cur}\n\n${textToInsert}` : textToInsert;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    // Handle Table Insertion from Table Builder
    const handleInsertTable = (tableCode) => {
        const updatedQuestions = [...formData.questions];
        const field = tableTarget === 'explanation' ? 'explanation' : tableTarget === 'correctAnswer' ? 'correctAnswer' : 'content';
        const cur = updatedQuestions[activeQuestionIndex][field] || '';
        updatedQuestions[activeQuestionIndex][field] = cur ? `${cur}\n\n${tableCode}` : tableCode;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    // Fast Rubric Presets for Literature and Social Sciences
    const handleInsertRubric = (rubricType) => {
        let rubricText = '';
        if (rubricType === 'paragraph_200') {
            rubricText = `### BAREM TIÊU CHÍ CHẤM ĐOẠN VĂN NGHỊ LUẬN (200 CHỮ)\n| Tiêu chí | Nội dung yêu cầu | Điểm tối đa |\n| :--- | :--- | :--- |\n| **1. Hình thức đoạn văn** | Đảm bảo dung lượng khoảng 200 chữ, đúng cấu trúc đoạn văn, không xuống dòng. | **0.25 điểm** |\n| **2. Xác định vấn đề** | Xác định đúng trọng tâm vấn đề nghị luận xã hội/văn học. | **0.25 điểm** |\n| **3. Triển khai luận điểm** | Lập luận chặt chẽ, luận cứ rõ ràng, dẫn chứng thực tế xác thực và thuyết phục. | **1.00 điểm** |\n| **4. Chính tả, ngữ pháp** | Đúng chính tả, ngữ pháp tiếng Việt, diễn đạt trong sáng, mạch lạc. | **0.25 điểm** |\n| **5. Sáng tạo & Liên hệ** | Có suy nghĩ sâu sắc, góc nhìn mới mẻ, liên hệ bản thân chân thành. | **0.25 điểm** |\n| **Tổng điểm** | | **2.00 điểm** |`;
        } else if (rubricType === 'essay_600') {
            rubricText = `### BAREM TIÊU CHÍ CHẤM BÀI VĂN NGHỊ LUẬN (600 CHỮ)\n| Tiêu chí | Nội dung yêu cầu | Điểm tối đa |\n| :--- | :--- | :--- |\n| **1. Bố cục bài viết** | Đầy đủ 3 phần: Mở bài - Thân bài - Kết bài, đúng thể thức bài văn nghị luận. | **0.50 điểm** |\n| **2. Mở bài** | Dẫn dắt ấn tượng, giới thiệu được tác giả/tác phẩm hoặc vấn đề nghị luận. | **0.50 điểm** |\n| **3. Thân bài** | Phân tích sâu sắc nội dung và nghệ thuật, triển khai các luận điểm logic, dẫn chứng tiêu biểu. | **2.00 điểm** |\n| **4. Đánh giá & Kết bài** | Khái quát giá trị, liên hệ mở rộng hoặc rút ra bài học ý nghĩa. | **0.50 điểm** |\n| **5. Chính tả, sáng tạo** | Diễn đạt giàu hình ảnh, cảm xúc, hành văn mượt mà, sáng tạo. | **0.50 điểm** |\n| **Tổng điểm** | | **4.00 điểm** |`;
        } else if (rubricType === 'history_case') {
            rubricText = `### BAREM HƯỚNG DẪN CHẤM CÂU HỎI LỊCH SỬ / GDKT&PL\n| Ý | Nội dung trọng tâm cần đạt | Điểm |\n| :--- | :--- | :--- |\n| **1. Khái quát bối cảnh / Căn cứ pháp lý** | Nêu đúng mốc thời gian, sự kiện hoặc Điều/Khoản luật liên quan. | **0.50 điểm** |\n| **2. Phân tích nguyên nhân / Bản chất** | Giải thích rõ nguyên nhân, ý nghĩa hoặc đánh giá hành vi đúng/sai. | **1.00 điểm** |\n| **3. Bài học kinh nghiệm / Liên hệ thực tiễn** | Rút ra bài học lịch sử hoặc giải pháp ứng xử pháp luật phù hợp. | **0.50 điểm** |\n| **Tổng điểm** | | **2.00 điểm** |`;
        }
        handleInsertTemplate(rubricText, 'explanation');
        showToast?.('Đã chèn Barem tiêu chí chấm Rubric vào phần Lời giải chi tiết');
    };

    // Quick Fill 4 True/False statements for History / Law
    const handleQuickFillTrueFalse = () => {
        const updated = [...formData.questions];
        const q = { ...updated[activeQuestionIndex] };
        q.type = 'true_false';
        q.options = [
            { id: 'a', text: 'Tư liệu khẳng định bối cảnh lịch sử / căn cứ pháp lý diễn ra theo đúng quy định.' },
            { id: 'b', text: 'Sự kiện / Hành vi được nêu phản ánh sự thay đổi căn bản trong thực tiễn.' },
            { id: 'c', text: 'Mục đích chính của sự việc là nhằm phục vụ lợi ích cục bộ của một nhóm nhỏ.' },
            { id: 'd', text: 'Bài học kinh nghiệm rút ra có giá trị lâu dài đối với công cuộc phát triển hiện nay.' }
        ];
        q.correctAnswer = { a: true, b: true, c: false, d: true };
        updated[activeQuestionIndex] = q;
        setFormData({ ...formData, questions: updated });
        showToast?.('Đã tạo 4 nhận định Đúng/Sai mẫu từ tư liệu');
    };

    // Get specialized dropdown options based on subject category (synchronized with Lucide icons)
    const getSpecializedDropdownOptions = (cat, subjectName) => {
        switch (cat) {
            case 'physics':
                return [
                    { id: 'ph_osc', label: 'PT Dao động điều hòa (x = Acos...)', icon: Activity },
                    { id: 'ph_wave', label: 'PT Truyền sóng cơ (u = Acos...)', icon: Activity },
                    { id: 'ph_gas', label: 'PT Khí lý tưởng (pV = nRT)', icon: Activity },
                    { id: 'ph_thermo', label: 'Nguyên lí 1 Nhiệt động (ΔU = A+Q)', icon: Activity },
                    { id: 'ph_nuclear', label: 'Mẫu Phản ứng hạt nhân', icon: Activity },
                    { id: 'ph_error', label: 'Mẫu Ghi sai số (x̄ ± Δx)', icon: FileText },
                    { id: 'common_table', label: 'Chèn Bảng số liệu thực nghiệm', icon: Table }
                ];
            case 'chemistry':
                return [
                    { id: 'chem_arrow_eq', label: 'Mũi tên thuận nghịch (⇌)', icon: RefreshCw },
                    { id: 'chem_arrow_xt', label: 'Mũi tên xúc tác nhiệt (→ t°, xt)', icon: FlaskConical },
                    { id: 'chem_arrow_acid', label: 'Mũi tên acid đặc nóng', icon: FlaskConical },
                    { id: 'chem_enthalpy', label: 'Biến thiên Enthalpy (Δr H°298)', icon: FlaskConical },
                    { id: 'chem_epol', label: 'Sức điện động pin (E°pin)', icon: FlaskConical },
                    { id: 'chem_functional', label: 'Nhóm chức hữu cơ (-OH, -COOH...)', icon: FlaskConical },
                    { id: 'chem_complex', label: 'Công thức Phức chất', icon: FlaskConical },
                    { id: 'chem_experiment', label: 'Mẫu 3 bước Thí nghiệm hóa học', icon: FileText },
                    { id: 'common_table', label: 'Chèn Bảng dữ liệu / Chuẩn độ', icon: Table }
                ];
            case 'biology':
                return [
                    { id: 'bio_cross', label: 'Chuỗi phép lai (P → F1 → F2)', icon: Dna },
                    { id: 'bio_linkage', label: 'Kiểu gen liên kết & Hoán vị', icon: Dna },
                    { id: 'bio_dna_seq', label: 'Trình tự chuỗi gen 5\' - 3\'', icon: Dna },
                    { id: 'bio_dna_calc', label: 'Công thức ADN (Chiều dài, LK Hydro)', icon: Calculator },
                    { id: 'bio_hardy', label: 'Cân bằng quần thể Hardy-Weinberg', icon: Dna },
                    { id: 'bio_food_web', label: 'Chuỗi & Lưới thức ăn sinh thái', icon: Dna },
                    { id: 'common_table', label: 'Chèn Bảng kiểu hình / Quần thể', icon: Table }
                ];
            case 'informatics':
                return [
                    { id: 'info_code_py', label: 'Mẫu khối code Python / C++', icon: FileText },
                    { id: 'info_big_o', label: 'Ký hiệu độ phức tạp O(n log n)', icon: Calculator },
                    { id: 'info_binary', label: 'Biểu diễn hệ nhị phân / Hex', icon: Binary },
                    { id: 'common_table', label: 'Chèn Bảng kiểm thử (Trace table)', icon: Table }
                ];
            case 'literature':
                return [
                    { id: 'lit_passage', label: 'Quản lý Ngữ liệu Đọc hiểu', icon: BookOpen },
                    { id: 'lit_poem', label: 'Trích đoạn Thơ (thụt lề chuẩn)', icon: Quote },
                    { id: 'lit_source', label: 'Trích dẫn Nguồn & Xuất xứ SGK', icon: BookOpen },
                    { id: 'lit_rubric_200', label: 'Barem 200 chữ (Đoạn văn)', icon: FileCheck },
                    { id: 'lit_rubric_600', label: 'Barem 600 chữ (Bài văn)', icon: ListChecks },
                    { id: 'common_table', label: 'Chèn Bảng Dữ Liệu / So sánh', icon: Table }
                ];
            case 'history_law':
                return [
                    { id: 'hist_doc', label: 'Trích dẫn Tư liệu Lịch sử', icon: Landmark },
                    { id: 'law_case', label: 'Tình huống Pháp luật / Kinh tế', icon: Scale },
                    { id: 'hist_tf4', label: 'Tự động điền 4 ý Đúng/Sai mẫu', icon: Sparkles },
                    { id: 'hist_rubric', label: 'Barem tự luận Sử / GDKT&PL', icon: FileCheck },
                    { id: 'common_table', label: 'Chèn Bảng Niên biểu / Số liệu', icon: Table }
                ];
            case 'geography':
                return [
                    { id: 'geo_density', label: 'Công thức Mật độ dân số', icon: Calculator },
                    { id: 'geo_yield', label: 'Công thức Năng suất cây trồng', icon: Calculator },
                    { id: 'geo_growth', label: 'Công thức Tốc độ tăng trưởng', icon: TrendingUp },
                    { id: 'common_table', label: 'Chèn Bảng Số liệu Thống kê', icon: Table },
                    { id: 'geo_atlat_9', label: 'Chỉ dẫn Atlat Trang 9 (Khí hậu)', icon: Globe },
                    { id: 'geo_atlat_15', label: 'Chỉ dẫn Atlat Trang 15 (Dân số)', icon: Globe },
                    { id: 'geo_atlat_17', label: 'Chỉ dẫn Atlat Trang 17 (Vùng kinh tế)', icon: Globe },
                    { id: 'geo_atlat_20', label: 'Chỉ dẫn Atlat Trang 20 (Nông nghiệp)', icon: Globe },
                    { id: 'geo_atlat_21', label: 'Chỉ dẫn Atlat Trang 21 (Công nghiệp)', icon: Globe },
                    { id: 'geo_atlat_25', label: 'Chỉ dẫn Atlat Trang 25 (Du lịch)', icon: Globe }
                ];
            case 'english':
                return [
                    { id: 'eng_cloze', label: 'Tạo Cloze Test (Đục lỗ [1], [2])', icon: FileText },
                    { id: 'eng_underline', label: 'Gạch chân âm tiết (<u>...</u>)', icon: Underline },
                    { id: 'eng_stress', label: 'In đậm trọng âm (**...**)', icon: Bold },
                    { id: 'eng_closest', label: 'Mẫu câu Closest in meaning', icon: Search },
                    { id: 'eng_opposite', label: 'Mẫu câu Opposite in meaning', icon: RefreshCw },
                    { id: 'common_table', label: 'Chèn Bảng Dữ Liệu / Phân tích', icon: Table }
                ];
            default: // math
                return [
                    { id: 'common_table', label: 'Chèn Bảng Biến thiên / Dữ liệu', icon: Table },
                    { id: 'math_\\frac{a}{b}', label: 'Phân số (\\frac{a}{b})', icon: Calculator },
                    { id: 'math_\\sqrt{x}', label: 'Căn bậc hai (\\sqrt{x})', icon: Calculator },
                    { id: 'math_\\int_{a}^{b} f(x) dx', label: 'Tích phân (\\int)', icon: Calculator },
                    { id: 'math_\\lim_{x \\to x_0} f(x)', label: 'Giới hạn (\\lim)', icon: Calculator },
                    { id: 'math_\\vec{u}', label: 'Ký hiệu Véc-tơ (\\vec{u})', icon: Calculator },
                    { id: 'math_\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}', label: 'Hệ phương trình (\\cases)', icon: Calculator },
                    { id: 'math_prob', label: 'Xác suất có điều kiện P(A|B)', icon: Calculator },
                    { id: 'math_\\Delta', label: 'Ký hiệu Delta (\\Delta)', icon: Calculator }
                ];
        }
    };

    // Execute specialized tool action
    const handleExecuteSpecializedTool = (actionId) => {
        if (!actionId) return;

        // Common table builder
        if (actionId === 'common_table') {
            setTableTarget('content');
            setIsTableBuilderOpen(true);
            return;
        }

        // Physics
        if (actionId === 'ph_osc') {
            handleInsertTemplate(`$$x = A\\cos(\\omega t + \\varphi)$$`);
        } else if (actionId === 'ph_wave') {
            handleInsertTemplate(`$$u = A\\cos\\left(\\omega t - \\frac{2\\pi x}{\\lambda}\\right)$$`);
        } else if (actionId === 'ph_gas') {
            handleInsertTemplate(`$$pV = nRT \\quad \\text{hoặc} \\quad \\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$$`);
        } else if (actionId === 'ph_thermo') {
            handleInsertTemplate(`$$\\Delta U = A + Q$$`);
        } else if (actionId === 'ph_nuclear') {
            handleInsertTemplate(`$$_{\\;Z}^{A}\\text{X} + \\;_{Z'}^{A'}\\text{Y} \\rightarrow \\;_{Z''}^{A''}\\text{Z} + \\;_{0}^{1}\\text{n}$$`);
        } else if (actionId === 'ph_error') {
            handleInsertTemplate(`$$\\bar{x} \\pm \\Delta x = 9{,}81 \\pm 0{,}02 \\quad (\\text{m/s}^2)$$`);
        }

        // Chemistry
        else if (actionId === 'chem_arrow_eq') {
            handleInsertTemplate(`$\\rightleftharpoons$`);
        } else if (actionId === 'chem_arrow_xt') {
            handleInsertTemplate(`$\\xrightarrow{t^\\circ, \\text{xt}}$`);
        } else if (actionId === 'chem_arrow_acid') {
            handleInsertTemplate(`$\\xrightarrow{\\text{H}_2\\text{SO}_4 \\text{ đặc}, t^\\circ}$`);
        } else if (actionId === 'chem_enthalpy') {
            handleInsertTemplate(`$$\\Delta_r H_{298}^\\circ = \\sum \\Delta_f H_{298}^\\circ(\\text{sp}) - \\sum \\Delta_f H_{298}^\\circ(\\text{cđ}) \\quad (\\text{kJ})$$`);
        } else if (actionId === 'chem_epol') {
            handleInsertTemplate(`$$E^\\circ_{\\text{pin}} = E^\\circ_{\\text{catot}} - E^\\circ_{\\text{anot}} \\quad (\\text{V})$$`);
        } else if (actionId === 'chem_functional') {
            handleInsertTemplate(`$-\\text{OH}, -\\text{CHO}, -\\text{COOH}, -\\text{COO}-, -\\text{NH}_2$`);
        } else if (actionId === 'chem_complex') {
            handleInsertTemplate(`$[\\text{Cu}(\\text{H}_2\\text{O})_4]^{2+}, [\\text{Ag}(\\text{NH}_3)_2]^+$`);
        } else if (actionId === 'chem_experiment') {
            handleInsertTemplate(`> **Thí nghiệm:**\n> - **Bước 1:** Cho 1 mL dung dịch $\\text{AgNO}_3$ 1% vào ống nghiệm sạch.\n> - **Bước 2:** Nhỏ từng giọt dung dịch $\\text{NH}_3$ 5% cho đến khi kết tủa tan hết.\n> - **Bước 3:** Thêm tiếp 1 mL dung dịch glucose 2%, đun nóng nhẹ trong cốc nước ấm.`);
        }

        // Biology
        else if (actionId === 'bio_cross') {
            handleInsertTemplate(`$$\\text{P}: \\text{AaBb} \\times \\text{aabb} \\rightarrow \\text{F}_1: 1\\text{AaBb} : 1\\text{Aabb} : 1\\text{aaBb} : 1\\text{aabb}$$`);
        } else if (actionId === 'bio_linkage') {
            handleInsertTemplate(`$$\\text{P}: \\frac{\\text{AB}}{\\text{ab}} \\times \\frac{\\text{ab}}{\\text{ab}} \\quad (f = 20\\%)$$`);
        } else if (actionId === 'bio_dna_seq') {
            handleInsertTemplate(`$5'\\text{-AUG-GCA-UUC-UGA-}3'$`);
        } else if (actionId === 'bio_dna_calc') {
            handleInsertTemplate(`$$L = \\frac{N}{2} \\times 3{,}4 \\text{ (\\AA)}, \\quad H = 2A + 3G$$`);
        } else if (actionId === 'bio_hardy') {
            handleInsertTemplate(`$$p^2\\text{AA} + 2pq\\text{Aa} + q^2\\text{aa} = 1 \\quad (p + q = 1)$$`);
        } else if (actionId === 'bio_food_web') {
            handleInsertTemplate(`$$\\text{Cỏ} \\rightarrow \\text{Sâu ăn lá} \\rightarrow \\text{Chim sâu} \\rightarrow \\text{Đại bàng}$$`);
        }

        // Informatics
        else if (actionId === 'info_code_py') {
            handleInsertTemplate("```python\ndef solve(arr):\n    # TODO: Implement algorithm\n    return sum(arr)\n```");
        } else if (actionId === 'info_big_o') {
            handleInsertTemplate(`$O(1), O(\\log n), O(n), O(n \\log n), O(n^2)$`);
        } else if (actionId === 'info_binary') {
            handleInsertTemplate(`$1010_2 = 10_{10} = \\text{0x0A}$`);
        }

        // Literature
        else if (actionId === 'lit_passage') {
            setIsPassageManagerOpen(true);
        } else if (actionId === 'lit_poem') {
            handleInsertTemplate(`> *Trích đoạn thơ:*\n> "Dòng sông xanh biếc lượn quanh co\n> Núi đứng sừng sững tựa mây ngàn\n> Gió hát reo vang đồng nội vắng\n> Khát vọng tương lai rực ánh vàng."\n\n*(Trích "Tác phẩm...", Tác giả..., NXB Giáo dục, 2024)*`);
        } else if (actionId === 'lit_source') {
            handleInsertTemplate(`\n\n*(Trích dẫn theo SGK Ngữ văn 12, Bộ Chân trời sáng tạo/Kết nối tri thức, NXB Giáo dục Việt Nam, 2024, tr. ...)*`);
        } else if (actionId === 'lit_rubric_200') {
            handleInsertRubric('paragraph_200');
        } else if (actionId === 'lit_rubric_600') {
            handleInsertRubric('essay_600');
        }

        // History & Law
        else if (actionId === 'hist_doc') {
            handleInsertTemplate(`> **Tư liệu Lịch sử:**\n> "Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy."\n*(Trích Tuyên ngôn Độc lập - Hồ Chí Minh, ngày 02/09/1945)*`);
        } else if (actionId === 'law_case') {
            handleInsertTemplate(`> **Tình huống thực tế:**\n> Doanh nghiệp A ký hợp đồng cung ứng 50 tấn nông sản cho Công ty B. Đến hạn giao nhận, do bão lũ làm sạt lở đường vận tải, A đã chủ động gửi thông báo chậm giao 3 ngày kèm xác nhận thiên tai từ chính quyền địa phương...`);
        } else if (actionId === 'hist_tf4') {
            handleQuickFillTrueFalse();
        } else if (actionId === 'hist_rubric') {
            handleInsertRubric('history_case');
        }

        // Geography
        else if (actionId.startsWith('geo_atlat_')) {
            const pageCode = actionId.replace('geo_atlat_', '');
            const atlatObj = ATLAT_PAGES.find(p => p.page === pageCode);
            handleInsertTemplate(`(Căn cứ vào Atlat Địa lí Việt Nam ${atlatObj?.label || `trang ${pageCode}`}, cho biết...)`);
        } else if (actionId === 'geo_density') {
            handleInsertTemplate(`$$\\text{Mật độ dân số} = \\frac{\\text{Dân số (người)}}{\\text{Diện tích (km}^2)} \\quad (\\text{người/km}^2)$$`);
        } else if (actionId === 'geo_yield') {
            handleInsertTemplate(`$$\\text{Năng suất lúa} = \\frac{\\text{Sản lượng (tạ)}}{\\text{Diện tích gieo trồng (ha)}} \\quad (\\text{tạ/ha})$$`);
        } else if (actionId === 'geo_growth') {
            handleInsertTemplate(`$$\\text{Tốc độ tăng trưởng năm } N = \\frac{\\text{Giá trị năm } N}{\\text{Giá trị năm gốc}} \\times 100\\%$$`);
        }

        // English
        else if (actionId === 'eng_cloze') {
            handleInsertTemplate(`Read the following passage and mark the letter A, B, C, or D on your answer sheet to indicate the correct word or phrase that best fits each of the numbered blanks from 1 to 4:\n\nRenewable energy plays an increasingly vital role in [1]______ global carbon emissions. Many countries are now investing heavily in solar and wind power [2]______ fossil fuels. Moreover, technological advancements have significantly reduced the cost of clean energy, making it more accessible to [3]______ households. As a result, experts predict that renewable energy will soon become the primary [4]______ of electricity worldwide.`);
        } else if (actionId === 'eng_underline') {
            handleInsertTemplate(`<u>ch</u>`);
        } else if (actionId === 'eng_stress') {
            handleInsertTemplate(`**stress**`);
        } else if (actionId === 'eng_closest') {
            handleInsertTemplate(`Mark the letter A, B, C, or D on your answer sheet to indicate the word(s) CLOSEST in meaning to the underlined word(s) in each of the following questions:`);
        } else if (actionId === 'eng_opposite') {
            handleInsertTemplate(`Mark the letter A, B, C, or D on your answer sheet to indicate the word(s) OPPOSITE in meaning to the underlined word(s) in each of the following questions:`);
        }

        // Math
        else if (actionId === 'math_prob') {
            handleInsertTemplate(`$$P(A|B) = \\frac{P(AB)}{P(B)} \\quad (P(B) > 0)$$`);
        } else if (actionId.startsWith('math_')) {
            const tex = actionId.replace('math_', '');
            handleInsertMath(tex, 'content');
        }
    };

    // Update active question property
    const updateActiveQuestion = (field, value) => {
        const updated = [...formData.questions];
        const q = { ...updated[activeQuestionIndex], [field]: value };

        // For essay questions, keep explanation and correctAnswer synchronized
        if (q.type === 'essay') {
            if (field === 'explanation') {
                q.correctAnswer = value;
            } else if (field === 'correctAnswer') {
                q.explanation = value;
            }
        }

        // Auto-initialize options and correctAnswer structure when switching question type
        if (field === 'type') {
            if (value === 'essay') {
                const solution = q.explanation || (typeof q.correctAnswer === 'string' ? q.correctAnswer : '');
                q.explanation = solution;
                q.correctAnswer = solution;
                q.options = [];
            } else if (value === 'true_false') {
                const currentOptMap = {};
                (q.options || []).forEach(o => {
                    currentOptMap[String(o.id).toLowerCase()] = o.text;
                });
                q.options = ['a', 'b', 'c', 'd'].map(key => ({
                    id: key,
                    text: currentOptMap[key] || ''
                }));
                if (typeof q.correctAnswer !== 'object' || q.correctAnswer === null) {
                    q.correctAnswer = { a: true, b: false, c: false, d: true };
                }
            } else if (value === 'multiple_choice') {
                const currentOptMap = {};
                (q.options || []).forEach(o => {
                    currentOptMap[String(o.id).toUpperCase()] = o.text;
                });
                q.options = ['A', 'B', 'C', 'D'].map(key => ({
                    id: key,
                    text: currentOptMap[key] || ''
                }));
                if (typeof q.correctAnswer !== 'string' || !['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
                    q.correctAnswer = 'A';
                }
            }
        }

        updated[activeQuestionIndex] = q;
        setFormData({ ...formData, questions: updated });
    };

    // Update option text (case-insensitive & auto-insert)
    const updateOptionText = (optId, text) => {
        const updated = [...formData.questions];
        const q = { ...updated[activeQuestionIndex] };
        let currentOptions = Array.isArray(q.options) ? [...q.options] : [];

        const normalizedId = String(optId).trim();
        const existingIndex = currentOptions.findIndex(
            opt => String(opt.id).toLowerCase() === normalizedId.toLowerCase()
        );

        if (existingIndex >= 0) {
            currentOptions[existingIndex] = {
                ...currentOptions[existingIndex],
                text
            };
        } else {
            currentOptions.push({ id: normalizedId, text });
        }

        q.options = currentOptions;
        updated[activeQuestionIndex] = q;
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

    // Helper to get all question images
    const getQuestionImages = (q) => {
        if (!q) return [];
        if (Array.isArray(q.imageUrls) && q.imageUrls.length > 0) {
            return q.imageUrls.filter(Boolean);
        }
        if (q.imageUrl) {
            return [q.imageUrl];
        }
        return [];
    };

    // Helper to get all explanation images
    const getExplanationImages = (q) => {
        if (!q) return [];
        if (Array.isArray(q.explanationImageUrls) && q.explanationImageUrls.length > 0) {
            return q.explanationImageUrls.filter(Boolean);
        }
        if (q.explanationImageUrl) {
            return [q.explanationImageUrl];
        }
        return [];
    };

    // Add images (supports multiple)
    const handleAddImages = (newImages, isExplanation = false) => {
        if (!newImages || newImages.length === 0) return;
        const fieldArray = isExplanation ? 'explanationImageUrls' : 'imageUrls';
        const fieldSingle = isExplanation ? 'explanationImageUrl' : 'imageUrl';
        const currentImgs = isExplanation ? getExplanationImages(currentQuestion) : getQuestionImages(currentQuestion);
        const combined = [...currentImgs, ...newImages];

        const updated = [...formData.questions];
        updated[activeQuestionIndex] = {
            ...updated[activeQuestionIndex],
            [fieldArray]: combined,
            [fieldSingle]: combined[0] || ''
        };
        setFormData({ ...formData, questions: updated });
    };

    // Remove single image by index
    const handleRemoveImage = (imgIndex, isExplanation = false) => {
        const fieldArray = isExplanation ? 'explanationImageUrls' : 'imageUrls';
        const fieldSingle = isExplanation ? 'explanationImageUrl' : 'imageUrl';
        const currentImgs = isExplanation ? getExplanationImages(currentQuestion) : getQuestionImages(currentQuestion);
        const filtered = currentImgs.filter((_, idx) => idx !== imgIndex);

        const updated = [...formData.questions];
        updated[activeQuestionIndex] = {
            ...updated[activeQuestionIndex],
            [fieldArray]: filtered,
            [fieldSingle]: filtered[0] || ''
        };
        setFormData({ ...formData, questions: updated });
    };

    // Move image position (left/right)
    const handleMoveImage = (fromIdx, toIdx, isExplanation = false) => {
        const fieldArray = isExplanation ? 'explanationImageUrls' : 'imageUrls';
        const fieldSingle = isExplanation ? 'explanationImageUrl' : 'imageUrl';
        const currentImgs = isExplanation ? getExplanationImages(currentQuestion) : getQuestionImages(currentQuestion);
        if (toIdx < 0 || toIdx >= currentImgs.length) return;

        const next = [...currentImgs];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);

        const updated = [...formData.questions];
        updated[activeQuestionIndex] = {
            ...updated[activeQuestionIndex],
            [fieldArray]: next,
            [fieldSingle]: next[0] || ''
        };
        setFormData({ ...formData, questions: updated });
    };

    // Image Upload handler (supports multiple files at once)
    const handleImageUpload = (e, isExplanation = false) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter(f => f.size <= 4 * 1024 * 1024);
        if (validFiles.length < files.length) {
            alert('Một số ảnh vượt quá 4MB đã được bỏ qua.');
        }
        if (validFiles.length === 0) return;

        let loadedCount = 0;
        const results = [];

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                results.push(reader.result);
                loadedCount++;
                if (loadedCount === validFiles.length) {
                    handleAddImages(results, isExplanation);
                    showToast?.(`Đã tải lên ${results.length} hình ảnh`);
                }
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
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

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12">
            {/* Header Banner - Editorial System Header (Sticky Header) */}
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-6 border-b-2 border-brand-cerulean space-y-3">
                <div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 text-brand-cerulean hover:text-brand-jasper font-serif-title text-sm font-bold transition-colors"
                    >
                        <ArrowLeft size={16} /> Quay lại Ngân hàng Đề thi
                    </button>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean tracking-tight">
                                {examToEdit ? 'Chỉnh sửa Đề thi THPT' : 'Soạn Thảo Đề Thi Mới'}
                            </h1>
                            <span className="px-3 py-1 bg-brand-cerulean/10 text-brand-cerulean font-serif-title text-xs font-bold rounded border border-brand-cerulean/30 flex items-center gap-1.5 shadow-xs">
                                <FileText size={14} className="text-brand-jasper" />
                                Tổng số câu trong đề: <strong className="text-brand-jasper font-bold text-sm ml-0.5">{formData.questions.length}</strong> câu
                            </span>
                        </div>
                        <p className="text-base text-gray-600 font-body">
                            Soạn thảo câu hỏi, công thức toán KaTeX, biểu đồ & lời giải chi tiết
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className={`px-4 py-2 border border-brand-cerulean/30 font-serif-title text-xs font-bold transition-all flex items-center gap-2 ${
                                previewMode ? 'bg-brand-jasper text-white shadow-sm' : 'bg-white text-brand-cerulean hover:border-brand-jasper'
                            }`}
                        >
                            <Eye size={15} /> {previewMode ? 'Chế độ Soạn thảo' : 'Xem trước KaTeX'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-brand-cerulean/30 text-gray-600 hover:text-brand-jasper font-serif-title text-xs font-bold shadow-sm transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-brand-cerulean hover:bg-brand-jasper text-brand-cream font-serif-title text-sm font-bold shadow-editorial hover:shadow-editorial-hover transition-all flex items-center gap-2"
                        >
                            <Check size={18} /> Lưu Đề Thi
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Studio Card Workspace */}
            <div className="bg-white border-editorial shadow-editorial flex flex-col md:flex-row min-h-[750px] overflow-hidden">
                {/* Left Sidebar: General Info & Question List Navigation */}
                <div className="w-full md:w-80 border-r border-brand-cerulean/20 bg-brand-cream/30 flex flex-col overflow-y-auto p-4 space-y-5 shrink-0 max-h-[900px]">
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

                            {/* Passages Section in General Info */}
                            <div className="pt-2 border-t border-brand-cerulean/15">
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-[11px] font-serif-title font-bold text-brand-cerulean flex items-center gap-1">
                                        <BookOpen size={12} className="text-brand-jasper" /> Ngữ liệu / Tư liệu ({formData.passages?.length || 0})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsPassageManagerOpen(true)}
                                        className="text-[10px] font-bold text-brand-cerulean hover:text-brand-jasper flex items-center gap-0.5"
                                    >
                                        <Plus size={11} /> Quản lý
                                    </button>
                                </div>
                                {formData.passages && formData.passages.length > 0 ? (
                                    <div className="space-y-1 max-h-24 overflow-y-auto">
                                        {formData.passages.map((p, pIdx) => (
                                            <div key={p.id || pIdx} className="p-1.5 bg-brand-cream/60 border border-brand-cerulean/20 rounded flex items-center justify-between text-[11px]">
                                                <span className="font-serif-title font-bold text-brand-cerulean truncate max-w-[170px]" title={p.title}>
                                                    {p.title || `Ngữ liệu ${pIdx + 1}`}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingPassage(p);
                                                        setIsPassageManagerOpen(true);
                                                    }}
                                                    className="text-[10px] text-brand-jasper font-bold hover:underline shrink-0"
                                                >
                                                    Sửa
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-gray-400 italic">
                                        Chưa có bài đọc / văn bản ngữ liệu nào.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Question List Index Matrix */}
                        <div className="space-y-2.5 flex-1">
                            <div className="flex justify-between items-center pt-1 border-t border-brand-cerulean/15">
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
                                            {q.type !== 'essay' && q.correctAnswer && (
                                                <span className="absolute -top-1 -right-1 text-[9px] bg-emerald-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                                                    {q.type === 'multiple_choice' && typeof q.correctAnswer === 'string' && q.correctAnswer.length <= 2
                                                        ? q.correctAnswer
                                                        : '✓'}
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
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="px-3 py-1 bg-brand-cerulean text-white font-serif-title font-bold text-sm rounded shrink-0">
                                            Câu {activeQuestionIndex + 1} / {formData.questions.length}
                                        </span>

                                        {/* 1. Question Type Selector */}
                                        <EditorialSelect
                                            value={currentQuestion.type || 'multiple_choice'}
                                            onChange={val => updateActiveQuestion('type', val)}
                                            options={QUESTION_TYPE_OPTIONS}
                                            size="sm"
                                            className="w-56"
                                        />

                                        {/* 2. Specialized Tool Dropdown (Synchronized with Editorial Design System) */}
                                        <SpecializedToolMenu
                                            currentSubject={currentSubject}
                                            currentSubjectCategory={currentSubjectCategory}
                                            options={getSpecializedDropdownOptions(currentSubjectCategory, currentSubject.name)}
                                            onSelectAction={handleExecuteSpecializedTool}
                                        />

                                        {/* 4. Link to Passage */}
                                        {formData.passages && formData.passages.length > 0 && (
                                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 border border-brand-cerulean/20 rounded shadow-sm">
                                                <Link2 size={13} className="text-brand-jasper shrink-0" />
                                                <span className="text-[11px] font-bold text-gray-600 shrink-0">Ngữ liệu:</span>
                                                <select
                                                    value={currentQuestion.passageId || ''}
                                                    onChange={e => updateActiveQuestion('passageId', e.target.value)}
                                                    className="text-xs font-serif-title font-bold text-brand-cerulean bg-transparent focus:outline-none max-w-[140px] truncate"
                                                >
                                                    <option value="">-- Độc lập --</option>
                                                    {formData.passages.map((p, pIdx) => (
                                                        <option key={p.id || pIdx} value={p.id}>
                                                            {p.title || `Ngữ liệu ${pIdx + 1}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Action buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDuplicateQuestion(activeQuestionIndex)}
                                            className="px-2.5 py-1 text-xs text-brand-cerulean bg-white border border-brand-cerulean/30 hover:border-brand-cerulean rounded flex items-center gap-1"
                                            title="Nhân bản câu hỏi"
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

                                {/* Quick Math Symbols Bar for Math and Physics */}
                                {(currentSubjectCategory === 'math' || currentSubjectCategory === 'physics') && (
                                    <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white border border-brand-cerulean/15 rounded text-xs shadow-sm">
                                        <span className="text-[10px] text-gray-400 font-bold self-center mr-1 shrink-0">Toán & Ký hiệu nhanh:</span>
                                        {QUICK_MATH_SYMBOLS.map(sym => (
                                            <button
                                                key={sym.label}
                                                type="button"
                                                onClick={() => handleInsertMath(sym.tex, 'content')}
                                                className="px-2 py-0.5 bg-brand-cream hover:bg-brand-cerulean hover:text-white text-brand-cerulean border border-brand-cerulean/20 rounded font-serif text-xs transition-colors shrink-0"
                                                title={`${sym.label}: $${sym.tex}$`}
                                            >
                                                {sym.preview}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Question Content */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-serif-title font-bold text-brand-cerulean">
                                        Nội dung Câu hỏi (Đề bài):
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={currentQuestion.content}
                                        onChange={e => updateActiveQuestion('content', e.target.value)}
                                        placeholder={
                                            currentSubjectCategory === 'english'
                                                ? 'Enter question content (e.g. Mark the letter A, B, C, or D on your answer sheet...)'
                                                : currentSubjectCategory === 'literature'
                                                    ? 'Nhập câu hỏi Đọc hiểu hoặc đề bài Viết đoạn văn / bài văn nghị luận...'
                                                    : currentSubjectCategory === 'history_law'
                                                        ? 'Nhập câu hỏi trắc nghiệm hoặc nhận định phân tích tư liệu lịch sử / tình huống pháp luật...'
                                                        : currentSubjectCategory === 'geography'
                                                            ? 'Nhập câu hỏi địa lí, chỉ dẫn tra cứu Atlat hoặc yêu cầu tính toán số liệu...'
                                                            : currentSubjectCategory === 'physics'
                                                                ? 'Nhập câu hỏi Vật lí, thông số dao động, nhiệt học, sóng hoặc hạt nhân... ($x = A\\cos(\\omega t)$)'
                                                                : currentSubjectCategory === 'chemistry'
                                                                    ? 'Nhập câu hỏi Hóa học, phương trình phản ứng, cấu tạo hóa học, nhiệt động học...'
                                                                    : currentSubjectCategory === 'biology'
                                                                        ? 'Nhập câu hỏi Sinh học, sơ đồ lai, phả hệ, phân tích chuỗi ADN hoặc bài toán quần thể...'
                                                                        : currentSubjectCategory === 'informatics'
                                                                            ? 'Nhập câu hỏi Tin học, đoạn mã nguồn chương trình hoặc thuật toán...'
                                                                            : 'Nhập nội dung đề bài... Hỗ trợ công thức $x^2 + y^2 = 1$ hoặc $$\\int_{0}^{\\pi} \\sin(x)dx$$'
                                        }
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

                                {/* Question Multi-Image Gallery */}
                                {(() => {
                                    const questionImages = getQuestionImages(currentQuestion);

                                    return (
                                        <div className="p-3.5 bg-white border border-brand-cerulean/20 rounded space-y-3">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <div>
                                                    <span className="text-xs font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                                        <Image size={14} className="text-brand-jasper" /> Bộ sưu tập Hình ảnh / Đồ thị ({questionImages.length} hình):
                                                    </span>
                                                    <p className="text-[11px] text-gray-500 font-sans">
                                                        Một câu hỏi có thể có nhiều hình (Hình 1, Hình 2, Hình 3...).
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {/* Option 1: Upload Multiple */}
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/*"
                                                        multiple
                                                        onChange={e => handleImageUpload(e, false)}
                                                        className="hidden"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-2.5 py-1 bg-white border border-brand-cerulean/30 hover:border-brand-jasper text-brand-cerulean hover:text-brand-jasper text-xs font-bold rounded flex items-center gap-1 transition-all shadow-sm"
                                                        title="Tải 1 hoặc nhiều ảnh từ máy tính"
                                                    >
                                                        <Upload size={12} /> 1. Up ảnh (chọn nhiều hình)
                                                    </button>

                                                    {/* Option 2: Live Canvas Drawing */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setDrawingTarget({ target: 'question', mode: 'add' })}
                                                        className="px-2.5 py-1 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-bold rounded flex items-center gap-1 transition-all shadow-sm"
                                                        title="Mở bảng vẽ trực tiếp: Đồ thị hàm số, trục Oxy, hình học không gian..."
                                                    >
                                                        <PenTool size={12} /> 2. Vẽ hình mới
                                                    </button>
                                                </div>
                                            </div>

                                            {/* URL input adder */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="url"
                                                    value={questionUrlInput}
                                                    onChange={e => setQuestionUrlInput(e.target.value)}
                                                    placeholder="Hoặc dán URL ảnh trực tiếp (https://...)"
                                                    className="flex-1 input-editorial text-xs font-body px-2.5 py-1 bg-brand-cream/30"
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && questionUrlInput.trim()) {
                                                            e.preventDefault();
                                                            handleAddImages([questionUrlInput.trim()], false);
                                                            setQuestionUrlInput('');
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (questionUrlInput.trim()) {
                                                            handleAddImages([questionUrlInput.trim()], false);
                                                            setQuestionUrlInput('');
                                                        }
                                                    }}
                                                    disabled={!questionUrlInput.trim()}
                                                    className="px-3 py-1 bg-brand-cerulean text-white rounded text-xs font-bold disabled:opacity-40"
                                                >
                                                    + Thêm ảnh
                                                </button>
                                            </div>

                                            {/* Images Grid */}
                                            {questionImages.length > 0 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                                                    {questionImages.map((imgUrl, imgIdx) => (
                                                        <div
                                                            key={imgIdx}
                                                            className="p-2 bg-brand-cream/40 border border-brand-cerulean/20 rounded relative group flex flex-col justify-between"
                                                        >
                                                            <div className="flex justify-between items-center mb-1.5">
                                                                <span className="px-1.5 py-0.5 bg-brand-cerulean text-white font-serif-title font-bold text-[10px] rounded">
                                                                    Hình {imgIdx + 1}
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    {imgIdx > 0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMoveImage(imgIdx, imgIdx - 1, false)}
                                                                            className="px-1 py-0.5 bg-white border border-gray-300 hover:border-brand-cerulean text-[10px] rounded"
                                                                            title="Di chuyển sang trái"
                                                                        >
                                                                            ◀
                                                                        </button>
                                                                    )}
                                                                    {imgIdx < questionImages.length - 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMoveImage(imgIdx, imgIdx + 1, false)}
                                                                            className="px-1 py-0.5 bg-white border border-gray-300 hover:border-brand-cerulean text-[10px] rounded"
                                                                            title="Di chuyển sang phải"
                                                                        >
                                                                            ▶
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveImage(imgIdx, false)}
                                                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded ml-1"
                                                                        title="Xóa hình này"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-center p-1 bg-white border border-gray-200 rounded min-h-[110px] max-h-[130px] overflow-hidden">
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={`Hình ${imgIdx + 1}`}
                                                                    className="max-h-28 object-contain"
                                                                />
                                                            </div>

                                                            <div className="mt-2 flex justify-end">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDrawingTarget({ target: 'question', mode: 'edit', index: imgIdx })}
                                                                    className="text-[10px] text-brand-cerulean hover:text-brand-jasper font-bold flex items-center gap-1"
                                                                >
                                                                    <Edit3 size={11} /> Sửa trên Canvas
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Options / Answer Editor based on Question Type (Hidden for essay) */}
                                {currentQuestion.type === 'short_answer' ? (
                                    <div className="p-4 bg-white border border-brand-cerulean/20 rounded shadow-sm space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/15">
                                            <label className="text-xs font-serif-title font-bold text-brand-cerulean uppercase flex items-center gap-1.5">
                                                <Sparkles size={14} className="text-brand-jasper" /> Đáp số / Kết quả điền ngắn (Short Answer):
                                            </label>
                                            <span className="text-xs font-sans text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                                                Dạng: Điền đáp số
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={currentQuestion.correctAnswer || ''}
                                                onChange={e => updateActiveQuestion('correctAnswer', e.target.value)}
                                                placeholder="Nhập đáp số chính xác (vd: 2.5 hoặc -1/3 hoặc x = 2 hoặc (1; 9])..."
                                                className="w-full input-editorial text-sm font-mono px-3 py-2"
                                            />
                                            {currentQuestion.correctAnswer && (
                                                <div className="p-2.5 bg-brand-cerulean/5 border border-brand-cerulean/20 rounded text-xs flex items-center gap-2">
                                                    <span className="text-gray-500 font-sans">Xem trước đáp số:</span>
                                                    <strong className="text-brand-cerulean font-serif text-sm">
                                                        <MathText text={currentQuestion.correctAnswer} />
                                                    </strong>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : currentQuestion.type === 'true_false' ? (
                                    <div className="p-4 bg-white border border-brand-cerulean/20 rounded shadow-sm space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                                4 Mệnh đề Đúng / Sai (a, b, c, d):
                                            </label>
                                            <span className="text-xs font-sans text-brand-cerulean font-bold bg-brand-cream px-2 py-0.5 border border-brand-cerulean/20 rounded">
                                                Dạng Trắc nghiệm Đúng / Sai (THPT mới)
                                            </span>
                                        </div>
                                        <div className="space-y-2.5">
                                            {['a', 'b', 'c', 'd'].map((itemKey) => {
                                                const opt = currentQuestion.options?.find(o => String(o.id).toLowerCase() === itemKey) || { id: itemKey, text: '' };
                                                const currentAnswers = typeof currentQuestion.correctAnswer === 'object' && currentQuestion.correctAnswer !== null
                                                    ? currentQuestion.correctAnswer
                                                    : {};
                                                const isTrue = currentAnswers[itemKey] === true || currentAnswers[itemKey] === 'Đ';

                                                return (
                                                    <div key={itemKey} className="p-3 border border-brand-cerulean/20 rounded bg-white space-y-2">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                                                            <span className="w-7 h-7 rounded-full bg-brand-cerulean text-white font-serif-title font-bold text-xs flex items-center justify-center uppercase shrink-0">
                                                                {itemKey}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={opt.text || ''}
                                                                onChange={e => updateOptionText(itemKey, e.target.value)}
                                                                placeholder={`Nội dung mệnh đề ${itemKey})... (vd: Đạo hàm $f'(x) > 0, \\forall x \\in (0; 2)$)`}
                                                                className="flex-1 w-full input-editorial text-xs font-body px-2.5 py-1.5"
                                                            />
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = { ...currentAnswers, [itemKey]: true };
                                                                        updateActiveQuestion('correctAnswer', updated);
                                                                    }}
                                                                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                                                                        isTrue
                                                                            ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    }`}
                                                                >
                                                                    <Check size={12} /> ĐÚNG
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = { ...currentAnswers, [itemKey]: false };
                                                                        updateActiveQuestion('correctAnswer', updated);
                                                                    }}
                                                                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                                                                        currentAnswers[itemKey] === false || currentAnswers[itemKey] === 'S'
                                                                            ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
                                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    }`}
                                                                >
                                                                    <X size={12} /> SAI
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {opt.text && (
                                                            <div className="pl-9 text-xs text-brand-ink font-serif flex items-start gap-1">
                                                                <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">Preview:</span>
                                                                <div className="flex-1"><MathText text={opt.text} /></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : currentQuestion.type === 'multiple_choice' ? (
                                    /* Standard Multiple Choice 4 Options (A, B, C, D) */
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                                4 Lựa chọn Đáp án (Chọn tròn để đặt Đáp án đúng):
                                            </label>
                                            <span className="text-xs font-sans text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                                                Đáp án đúng hiện tại: {typeof currentQuestion.correctAnswer === 'string' ? currentQuestion.correctAnswer : 'A'}
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
                                ) : null}

                                {/* Explanation & Solution Guide (For Essay: Unified Solution & Answer) */}
                                <div className="p-4 bg-white border border-brand-cerulean/20 rounded shadow-sm space-y-3">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-1 border-b border-brand-cerulean/15">
                                        <div className="flex items-center gap-2">
                                            {currentQuestion.type === 'essay' ? (
                                                <FileText size={16} className="text-brand-jasper" />
                                            ) : (
                                                <Sparkles size={15} className="text-brand-jasper" />
                                            )}
                                            <div>
                                                <label className="text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                                    {currentQuestion.type === 'essay'
                                                        ? 'Đáp án / Bài giải chuẩn của câu Tự luận:'
                                                        : 'Lời giải chi tiết & Phương pháp giải (Explanation):'}
                                                </label>
                                                {currentQuestion.type === 'essay' && (
                                                    <p className="text-[11px] text-gray-500 font-sans">
                                                        Nhập các bước giải, chứng minh, công thức toán và đáp số chi tiết (tự do xuống dòng)
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTableTarget('explanation');
                                                    setIsTableBuilderOpen(true);
                                                }}
                                                className="px-2.5 py-1 bg-brand-cerulean/10 hover:bg-brand-cerulean hover:text-white text-brand-cerulean text-xs font-bold rounded flex items-center gap-1 transition-colors"
                                                title="Chèn bảng dữ liệu vào phần Lời giải"
                                            >
                                                <Table size={12} className="text-brand-jasper" /> Chèn Bảng
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Math Symbols Toolbar for Explanation / Essay */}
                                    <div className="flex flex-wrap gap-1 p-2 bg-brand-cream/60 border border-brand-cerulean/15 rounded text-xs">
                                        <span className="text-[10px] text-gray-400 font-bold self-center mr-1">Chèn nhanh:</span>
                                        {[
                                            { label: 'x = a', code: 'x = ' },
                                            { label: '√x', code: '\\sqrt{x}' },
                                            { label: 'a/b', code: '\\frac{a}{b}' },
                                            { label: '∫ dx', code: '\\int f(x)\\,dx' },
                                            { label: 'lim', code: '\\lim_{x \\to x_0}' },
                                            { label: 'x²', code: 'x^2' },
                                            { label: '⇒', code: '\\Rightarrow' },
                                            { label: '⇔', code: '\\Leftrightarrow' },
                                            { label: '∈', code: '\\in' },
                                            { label: '[a; b]', code: '[a; b]' },
                                            { label: 'véc-tơ', code: '\\vec{u}' }
                                        ].map(sym => (
                                            <button
                                                key={sym.label}
                                                type="button"
                                                onClick={() => handleInsertMath(sym.code, 'explanation')}
                                                className="px-2 py-0.5 bg-white hover:bg-brand-cerulean hover:text-white border border-brand-cerulean/25 rounded text-[11px] font-mono transition-colors"
                                            >
                                                {sym.label}
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        rows={currentQuestion.type === 'essay' ? 6 : 3}
                                        value={currentQuestion.explanation || (currentQuestion.type === 'essay' && typeof currentQuestion.correctAnswer === 'string' ? currentQuestion.correctAnswer : '')}
                                        onChange={e => updateActiveQuestion('explanation', e.target.value)}
                                        placeholder={
                                            currentQuestion.type === 'essay'
                                                ? 'Nhập toàn bộ hướng dẫn giải, các bước biến đổi, chứng minh toán học, công thức và đáp số cuối cùng...'
                                                : 'Nhập hướng dẫn giải, phân tích từng bước, công thức áp dụng, lưu ý bẫy đề thi...'
                                        }
                                        className="w-full p-3 bg-brand-cream/40 border border-brand-cerulean/30 rounded font-body text-xs text-brand-ink focus:outline-none focus:border-brand-jasper focus:bg-white leading-relaxed"
                                    />

                                    {(() => {
                                        const answerPreviewText = currentQuestion.explanation || (typeof currentQuestion.correctAnswer === 'string' ? currentQuestion.correctAnswer : '');
                                        if (!answerPreviewText) return null;

                                        return (
                                            <div className="p-3.5 bg-brand-cerulean/5 border border-brand-cerulean/30 rounded space-y-2 shadow-sm">
                                                <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-brand-cerulean/20">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-serif-title font-bold text-brand-cerulean uppercase">
                                                        <CheckCircle2 size={14} className="text-brand-cerulean" />
                                                        <span>Xem trước {currentQuestion.type === 'essay' ? 'Đáp án / Lời giải Tự luận' : 'Lời giải chi tiết'}:</span>
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        maxHeight: explanationPreviewHeight === 'auto' ? 'none' : explanationPreviewHeight,
                                                        minHeight: '80px',
                                                        height: explanationPreviewHeight === 'auto' ? 'auto' : undefined
                                                    }}
                                                    className="text-xs text-brand-ink font-body leading-relaxed pl-1 overflow-y-auto bg-white/95 p-3 rounded border border-brand-cerulean/20 resize-y transition-all relative"
                                                >
                                                    <MathText text={answerPreviewText} />
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Explanation Multi-Image Gallery */}
                                    {(() => {
                                        const expImages = getExplanationImages(currentQuestion);

                                        return (
                                            <div className="pt-2 border-t border-brand-cerulean/10 space-y-2">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                    <span className="text-xs font-serif-title font-bold text-brand-cerulean flex items-center gap-1.5">
                                                        <Image size={13} className="text-brand-jasper" /> Hình vẽ minh họa lời giải ({expImages.length} hình):
                                                    </span>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="file"
                                                            ref={expFileInputRef}
                                                            accept="image/*"
                                                            multiple
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
                                                            onClick={() => setDrawingTarget({ target: 'explanation', mode: 'add' })}
                                                            className="px-2.5 py-1 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
                                                        >
                                                            <PenTool size={12} /> Vẽ hình lời giải mới
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Exp URL adder */}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="url"
                                                        value={expUrlInput}
                                                        onChange={e => setExpUrlInput(e.target.value)}
                                                        placeholder="Hoặc dán URL ảnh lời giải..."
                                                        className="flex-1 input-editorial text-xs font-body px-2 py-1 bg-brand-cream/30"
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && expUrlInput.trim()) {
                                                                e.preventDefault();
                                                                handleAddImages([expUrlInput.trim()], true);
                                                                setExpUrlInput('');
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (expUrlInput.trim()) {
                                                                handleAddImages([expUrlInput.trim()], true);
                                                                setExpUrlInput('');
                                                            }
                                                        }}
                                                        disabled={!expUrlInput.trim()}
                                                        className="px-3 py-1 bg-brand-cerulean hover:bg-brand-jasper text-white rounded text-xs font-bold disabled:opacity-40 transition-colors"
                                                    >
                                                        + Thêm
                                                    </button>
                                                </div>

                                                {/* Explanation Images Grid */}
                                                {expImages.length > 0 && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                                        {expImages.map((imgUrl, imgIdx) => (
                                                            <div
                                                                key={imgIdx}
                                                                className="p-2 bg-emerald-50/40 border border-emerald-300 rounded relative group flex flex-col justify-between"
                                                            >
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-700 text-white rounded">
                                                                        Hình giải {imgIdx + 1}
                                                                    </span>
                                                                    <div className="flex items-center gap-1">
                                                                        {imgIdx > 0 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleMoveImage(imgIdx, imgIdx - 1, true)}
                                                                                className="px-1 py-0.5 bg-white border text-[10px] rounded"
                                                                            >
                                                                                ◀
                                                                            </button>
                                                                        )}
                                                                        {imgIdx < expImages.length - 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleMoveImage(imgIdx, imgIdx + 1, true)}
                                                                                className="px-1 py-0.5 bg-white border text-[10px] rounded"
                                                                            >
                                                                                ▶
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveImage(imgIdx, true)}
                                                                            className="p-1 text-red-500 hover:text-red-700"
                                                                        >
                                                                            <X size={11} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-center p-1 bg-white border border-emerald-200 rounded min-h-[90px] max-h-[110px] overflow-hidden">
                                                                    <img
                                                                        src={imgUrl}
                                                                        alt={`Hình giải ${imgIdx + 1}`}
                                                                        className="max-h-24 object-contain"
                                                                    />
                                                                </div>

                                                                <div className="mt-1.5 flex justify-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setDrawingTarget({ target: 'explanation', mode: 'edit', index: imgIdx })}
                                                                        className="text-[10px] text-emerald-800 font-bold flex items-center gap-1"
                                                                    >
                                                                        <Edit3 size={10} /> Sửa trên Canvas
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </>
                        )}
                    </div>
                </div>



            {/* Interactive Drawing Canvas Modal */}
            {drawingTarget && (
                <ThptDrawingCanvasModal
                    isOpen={Boolean(drawingTarget)}
                    onClose={() => setDrawingTarget(null)}
                    initialImageUrl={
                        drawingTarget.mode === 'edit' && typeof drawingTarget.index === 'number'
                            ? (drawingTarget.target === 'question'
                                ? getQuestionImages(currentQuestion)[drawingTarget.index]
                                : getExplanationImages(currentQuestion)[drawingTarget.index])
                            : null
                    }
                    title={
                        drawingTarget.target === 'question'
                            ? `Studio Vẽ Đồ thị / Hình học cho Đề bài (Câu ${currentQuestion.order || activeQuestionIndex + 1})`
                            : `Studio Vẽ Hình minh họa Lời giải (Câu ${currentQuestion.order || activeQuestionIndex + 1})`
                    }
                    onSaveImage={(dataUrl) => {
                        const isExp = drawingTarget.target === 'explanation';
                        if (drawingTarget.mode === 'edit' && typeof drawingTarget.index === 'number') {
                            const currentImgs = isExp ? getExplanationImages(currentQuestion) : getQuestionImages(currentQuestion);
                            const next = [...currentImgs];
                            next[drawingTarget.index] = dataUrl;
                            const fieldArray = isExp ? 'explanationImageUrls' : 'imageUrls';
                            const fieldSingle = isExp ? 'explanationImageUrl' : 'imageUrl';
                            const updated = [...formData.questions];
                            updated[activeQuestionIndex] = {
                                ...updated[activeQuestionIndex],
                                [fieldArray]: next,
                                [fieldSingle]: next[0] || ''
                            };
                            setFormData({ ...formData, questions: updated });
                        } else {
                            handleAddImages([dataUrl], isExp);
                        }
                        setDrawingTarget(null);
                        showToast?.('Đã lưu hình vẽ thành công');
                    }}
                />
            )}

            {/* Table Builder Modal */}
            <ThptTableBuilderModal
                isOpen={isTableBuilderOpen}
                onClose={() => setIsTableBuilderOpen(false)}
                onInsertTable={handleInsertTable}
            />

            {/* Passage Manager Modal */}
            {isPassageManagerOpen && createPortal(
                <div className="fixed inset-0 z-[1150] bg-brand-cerulean/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg overflow-hidden animate-modal-pop-in">
                        {/* Header */}
                        <div className="p-3.5 bg-brand-cerulean text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <BookOpen size={18} className="text-yellow-300" />
                                <div>
                                    <h3 className="font-serif-title font-bold text-sm">
                                        Quản Lý Ngữ Liệu / Tư Liệu Dùng Chung ({formData.passages?.length || 0})
                                    </h3>
                                    <p className="text-[10px] text-white/80">
                                        Dùng cho bài thi Ngữ văn (Đọc hiểu), Lịch sử (Tư liệu), Địa lí (Bảng số liệu), Tiếng Anh (Reading/Cloze)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPassageManagerOpen(false);
                                    setEditingPassage(null);
                                }}
                                className="p-1 hover:bg-white/20 rounded text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-cream/30">
                            {editingPassage ? (
                                /* Edit Form */
                                <div className="space-y-3 p-4 bg-white border border-brand-cerulean/20 rounded shadow-sm">
                                    <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/15">
                                        <span className="font-serif-title font-bold text-xs text-brand-cerulean uppercase">
                                            {editingPassage.id ? 'Chỉnh sửa Ngữ liệu' : 'Tạo Ngữ liệu mới'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setEditingPassage(null)}
                                            className="text-xs text-gray-500 hover:text-brand-jasper font-bold"
                                        >
                                            ← Quay lại danh sách
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-0.5">Tiêu đề Ngữ liệu *</label>
                                            <input
                                                type="text"
                                                value={editingPassage.title || ''}
                                                onChange={e => setEditingPassage({ ...editingPassage, title: e.target.value })}
                                                placeholder="Vd: Văn bản 1: Mùa xuân nho nhỏ / Tư liệu 1..."
                                                className="w-full input-editorial text-xs font-body px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-0.5">Thể loại / Phân loại</label>
                                            <select
                                                value={editingPassage.type || 'literature'}
                                                onChange={e => setEditingPassage({ ...editingPassage, type: e.target.value })}
                                                className="w-full text-xs font-serif-title bg-white border border-brand-cerulean/30 rounded p-1"
                                            >
                                                <option value="literature">Ngữ văn: Thơ / Văn xuôi / Ký sự</option>
                                                <option value="history">Lịch sử: Tư liệu / Văn kiện</option>
                                                <option value="law">GDKT&PL: Tình huống pháp lý</option>
                                                <option value="geography">Địa lí: Bảng số liệu & Nhận định</option>
                                                <option value="english">Tiếng Anh: Reading / Cloze Test</option>
                                                <option value="general">Khác / Dùng chung</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Tác giả</label>
                                            <input
                                                type="text"
                                                value={editingPassage.author || ''}
                                                onChange={e => setEditingPassage({ ...editingPassage, author: e.target.value })}
                                                placeholder="Vd: Thanh Hải / Hồ Chí Minh..."
                                                className="w-full input-editorial text-xs font-body px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Nguồn / Xuất xứ</label>
                                            <input
                                                type="text"
                                                value={editingPassage.source || ''}
                                                onChange={e => setEditingPassage({ ...editingPassage, source: e.target.value })}
                                                placeholder="Vd: NXB Giáo dục / Báo Tuổi trẻ..."
                                                className="w-full input-editorial text-xs font-body px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-0.5">Năm sáng tác / xuất bản</label>
                                            <input
                                                type="text"
                                                value={editingPassage.year || ''}
                                                onChange={e => setEditingPassage({ ...editingPassage, year: e.target.value })}
                                                placeholder="Vd: 1980 / 2024..."
                                                className="w-full input-editorial text-xs font-body px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-0.5">
                                            Link file Audio Nghe (Dành cho Tiếng Anh):
                                        </label>
                                        <input
                                            type="url"
                                            value={editingPassage.audioUrl || ''}
                                            onChange={e => setEditingPassage({ ...editingPassage, audioUrl: e.target.value })}
                                            placeholder="https://example.com/audio-listening.mp3"
                                            className="w-full input-editorial text-xs font-mono px-2 py-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-serif-title font-bold text-brand-cerulean mb-0.5">
                                            Nội dung Văn bản Ngữ liệu (Hỗ trợ Markdown & Thơ) *:
                                        </label>
                                        <textarea
                                            rows={6}
                                            value={editingPassage.content || ''}
                                            onChange={e => setEditingPassage({ ...editingPassage, content: e.target.value })}
                                            placeholder="Dán hoặc nhập toàn bộ nội dung văn bản đọc hiểu, đoạn thơ, tư liệu lịch sử hoặc đoạn văn tiếng Anh..."
                                            className="w-full p-2.5 bg-white border border-brand-cerulean/30 rounded font-body text-xs text-brand-ink focus:outline-none focus:border-brand-jasper leading-relaxed shadow-inner"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingPassage(null)}
                                            className="px-3 py-1.5 border border-brand-cerulean/30 text-xs font-bold rounded"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!editingPassage.title?.trim() && !editingPassage.content?.trim()) {
                                                    showToast?.('Vui lòng nhập tiêu đề hoặc nội dung ngữ liệu');
                                                    return;
                                                }
                                                const currentPassages = Array.isArray(formData.passages) ? [...formData.passages] : [];
                                                const passageToSave = {
                                                    ...editingPassage,
                                                    id: editingPassage.id || ('passage_' + Date.now())
                                                };
                                                const existingIdx = currentPassages.findIndex(p => p.id === passageToSave.id);
                                                if (existingIdx >= 0) {
                                                    currentPassages[existingIdx] = passageToSave;
                                                } else {
                                                    currentPassages.push(passageToSave);
                                                }
                                                setFormData({ ...formData, passages: currentPassages });
                                                setEditingPassage(null);
                                                showToast?.('Đã lưu Ngữ liệu thành công');
                                            }}
                                            className="px-4 py-1.5 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-bold rounded shadow"
                                        >
                                            Lưu Ngữ Liệu
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Passage List */
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-serif-title font-bold text-brand-cerulean">
                                            Danh sách Ngữ liệu trong đề thi:
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setEditingPassage({
                                                title: `Ngữ liệu ${(formData.passages?.length || 0) + 1}`,
                                                type: getSubjectCategory(formData.subjectId),
                                                author: '',
                                                source: '',
                                                year: '',
                                                content: '',
                                                audioUrl: '',
                                                imageUrls: []
                                            })}
                                            className="px-3 py-1.5 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-bold rounded flex items-center gap-1 shadow-sm"
                                        >
                                            <Plus size={13} /> + Thêm Ngữ liệu mới
                                        </button>
                                    </div>

                                    {formData.passages && formData.passages.length > 0 ? (
                                        <div className="space-y-2">
                                            {formData.passages.map((p, idx) => (
                                                <div key={p.id || idx} className="p-3 bg-white border border-brand-cerulean/20 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[10px] font-bold rounded">
                                                                #{idx + 1}
                                                            </span>
                                                            <h4 className="font-serif-title font-bold text-xs text-brand-cerulean">
                                                                {p.title || `Ngữ liệu ${idx + 1}`}
                                                            </h4>
                                                            {p.author && (
                                                                <span className="text-[11px] text-gray-500 font-sans">
                                                                    - {p.author}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-gray-600 line-clamp-2 font-body italic pl-1">
                                                            "{p.content || '(Chưa có nội dung văn bản)'}"
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingPassage(p)}
                                                            className="px-2.5 py-1 text-xs font-bold text-brand-cerulean bg-brand-cream/60 hover:bg-brand-cerulean hover:text-white border border-brand-cerulean/20 rounded transition-colors"
                                                        >
                                                            Chỉnh sửa
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (window.confirm(`Bạn có chắc muốn xóa "${p.title}" không?`)) {
                                                                    const updatedPassages = formData.passages.filter(item => item.id !== p.id);
                                                                    setFormData({ ...formData, passages: updatedPassages });
                                                                }
                                                            }}
                                                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center bg-white border border-dashed border-brand-cerulean/30 rounded-lg space-y-2">
                                            <BookOpen size={28} className="mx-auto text-brand-cerulean/40" />
                                            <p className="text-xs font-serif-title font-bold text-brand-cerulean">
                                                Chưa có ngữ liệu nào được tạo
                                            </p>
                                            <p className="text-[11px] text-gray-500 max-w-md mx-auto">
                                                Thêm văn bản đọc hiểu, đoạn thơ, tư liệu lịch sử hoặc bài đọc tiếng Anh để nhóm các câu hỏi liên quan lại với nhau.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-white border-t border-brand-cerulean/20 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPassageManagerOpen(false);
                                    setEditingPassage(null);
                                }}
                                className="px-4 py-1.5 bg-brand-cerulean text-white text-xs font-bold rounded"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ThptExamEditorModal;
