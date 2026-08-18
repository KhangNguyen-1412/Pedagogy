import React, { useState, useEffect, useRef } from 'react';
import {
    FileSpreadsheet,
    FileText,
    Presentation,
    CheckCircle2,
    Clock,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    Lightbulb,
    Award,
    Play,
    HelpCircle,
    Check,
    Square,
    Save,
    ExternalLink,
    Filter,
    Table,
    Layers,
    Type,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    BarChart3,
    Sparkles,
    Eye,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { MOS_MULTI_PROJECTS, MOS_SUBJECTS } from '../../data/mosIc3Data';

export const MosVirtualSandboxView = ({
    selectedProjectId = 'proj_excel_01',
    onCompleteProject,
    navigate,
    showToast
}) => {
    const [project, setProject] = useState(() => {
        return MOS_MULTI_PROJECTS.find(p => p.id === selectedProjectId) || MOS_MULTI_PROJECTS[0];
    });

    const [activeTaskIndex, setActiveTaskIndex] = useState(0);
    const [taskCompletedState, setTaskCompletedState] = useState({});
    const [taskReviewState, setTaskReviewState] = useState({});
    const [showHint, setShowHint] = useState(false);
    const [showOptimalPath, setShowOptimalPath] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(50 * 60); // 50 mins
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    // Office Ribbon State
    const [activeRibbonTab, setActiveRibbonTab] = useState('Home');
    const [activeCell, setActiveCell] = useState('D2');
    const [formulaBarValue, setFormulaBarValue] = useState('');
    const [appliedStyles, setAppliedStyles] = useState({
        bold: false,
        italic: false,
        underline: false,
        conditionalFormatting: false,
        pivotCreated: false,
        chartCreated: false,
        sectionBreakAdded: false,
        tableOfContentsAdded: false,
        apaCitationAdded: false,
        slideMasterUpdated: false,
        smartArtConverted: false,
        morphApplied: false
    });

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [projectSubmitted, setProjectSubmitted] = useState(false);
    const [earnedScore, setEarnedScore] = useState(0);

    // Timer Countdown
    useEffect(() => {
        let timer = null;
        if (isTimerRunning && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isTimerRunning, timeRemaining]);

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const currentTask = project.tasks[activeTaskIndex] || project.tasks[0];
    const isExcel = project.subjectId === 'mos_excel';
    const isWord = project.subjectId === 'mos_word';
    const isPpt = project.subjectId === 'mos_ppt';

    const handleToggleTaskCompleted = (index) => {
        setTaskCompletedState(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleToggleTaskReview = (index) => {
        setTaskReviewState(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleApplyAction = (actionKey, successMessage) => {
        setAppliedStyles(prev => ({
            ...prev,
            [actionKey]: true
        }));
        setTaskCompletedState(prev => ({
            ...prev,
            [activeTaskIndex]: true
        }));
        if (showToast) {
            showToast(successMessage || 'Thao tác hợp lệ theo tiêu chuẩn Certiport!', 'success');
        }
    };

    const handleApplyFormula = (e) => {
        e.preventDefault();
        const formula = formulaBarValue.trim().toUpperCase();
        if (formula.includes('VLOOKUP') || formula.includes('IF') || formula.includes('SUM') || formula.includes('IFS')) {
            handleApplyAction('formulaApplied', `Đã áp dụng công thức ${formulaBarValue} thành công!`);
        } else {
            if (showToast) {
                showToast(`Đã nhập công thức: ${formulaBarValue}`, 'info');
            }
        }
    };

    const handleResetProject = () => {
        if (window.confirm('Bạn có chắc chắn muốn đặt lại (Reset) toàn bộ dự án về trạng thái ban đầu?')) {
            setTaskCompletedState({});
            setTaskReviewState({});
            setAppliedStyles({});
            setFormulaBarValue('');
            setTimeRemaining(50 * 60);
            if (showToast) showToast('Đã đặt lại dự án thành công!', 'info');
        }
    };

    const handleSubmitProject = () => {
        const completedCount = Object.values(taskCompletedState).filter(Boolean).length;
        const total = project.tasks.length;
        const score = Math.round((completedCount / total) * 1000);
        setEarnedScore(score);
        setProjectSubmitted(true);
        setIsTimerRunning(false);

        if (onCompleteProject) {
            onCompleteProject({
                projectId: project.id,
                title: project.title,
                score,
                maxScore: 1000,
                completedTasks: completedCount,
                totalTasks: total,
                timeSpentSeconds: 50 * 60 - timeRemaining
            });
        }
    };

    const ribbonTabs = isExcel
        ? ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View']
        : isWord
            ? ['File', 'Home', 'Insert', 'Layout', 'References', 'Mailings', 'Review', 'View']
            : ['File', 'Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Review', 'View'];

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Standard Pedagogy Sticky Header */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 text-xs font-serif-title font-bold uppercase rounded ${
                            isExcel ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : isWord ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-red-100 text-red-900 border border-red-300'
                        }`}>
                            {isExcel ? 'MOS Excel 365' : isWord ? 'MOS Word 365' : 'MOS PowerPoint 365'}
                        </span>
                        <span className="text-xs text-gray-500 font-mono font-bold">Tệp: {project.documentName}</span>
                    </div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Phòng Lab Ảo Multi-Project MOS</h2>
                    <p className="text-lg text-gray-600 mt-1 font-body">{project.title}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border-editorial shadow-editorial font-mono font-bold text-lg text-brand-jasper">
                        <Clock size={18} className="text-brand-jasper animate-spin-slow" />
                        <span>{formatTimer(timeRemaining)}</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleResetProject}
                        className="px-4 py-2 bg-white border-editorial shadow-editorial hover:bg-gray-50 text-gray-700 font-serif-title text-sm flex items-center gap-1.5 transition-colors"
                        title="Khôi phục trạng thái ban đầu của tệp mẫu"
                    >
                        <RotateCcw size={14} /> Đặt lại
                    </button>
                </div>
            </div>

            {/* Context & Description Box */}
            <div className="bg-white p-6 border-editorial shadow-editorial relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-cerulean"></div>
                <h3 className="text-lg font-serif-title text-brand-cerulean font-bold mb-1">Tình Huống Nghiệp Vụ Thực Tế:</h3>
                <p className="text-sm font-body text-gray-700 leading-relaxed">{project.context}</p>
            </div>

            {/* SPLIT PANE VIRTUAL SANDBOX CONTAINER */}
            <div className="border-[3px] border-brand-cerulean bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col min-h-[750px]">
                
                {/* 1. VIRTUAL OFFICE RIBBON TOOLBAR (TOP INTERFACE) */}
                <div className="bg-[#f3f2f1] border-b border-gray-300 select-none">
                    {/* Window Title bar (Classic Office Look) */}
                    <div className={`${isExcel ? 'bg-[#107c41]' : isWord ? 'bg-[#185abd]' : 'bg-[#c43e1c]'} text-white px-4 py-1.5 flex items-center justify-between text-xs font-sans font-semibold`}>
                        <div className="flex items-center gap-2">
                            {isExcel ? <FileSpreadsheet size={15} /> : isWord ? <FileText size={15} /> : <Presentation size={15} />}
                            <span>{project.documentName} - Virtual Office Sandbox (Simulated Environment)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-white/80 font-normal">Autosave: On</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">Nguyen Huynh Phuc Khang</span>
                        </div>
                    </div>

                    {/* Ribbon Tab Headers */}
                    <div className="flex items-center border-b border-gray-300 bg-white px-2 overflow-x-auto">
                        {ribbonTabs.map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveRibbonTab(tab)}
                                className={`px-4 py-2 text-xs font-sans font-medium transition-colors border-b-2 ${
                                    activeRibbonTab === tab
                                        ? `${isExcel ? 'border-[#107c41] text-[#107c41]' : isWord ? 'border-[#185abd] text-[#185abd]' : 'border-[#c43e1c] text-[#c43e1c]'} font-bold bg-[#f3f2f1]`
                                        : 'border-transparent text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Ribbon Action Tools Panel */}
                    <div className="p-2.5 bg-[#f3f2f1] flex items-center gap-3 text-xs overflow-x-auto min-h-[72px]">
                        {activeRibbonTab === 'Home' && (
                            <>
                                <div className="flex flex-col items-center border-r border-gray-300 pr-3">
                                    <div className="flex gap-1 mb-1">
                                        <button onClick={() => setAppliedStyles(p => ({ ...p, bold: !p.bold }))} className={`p-1.5 rounded ${appliedStyles.bold ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Bold (Ctrl+B)"><Bold size={13} /></button>
                                        <button onClick={() => setAppliedStyles(p => ({ ...p, italic: !p.italic }))} className={`p-1.5 rounded ${appliedStyles.italic ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Italic (Ctrl+I)"><Italic size={13} /></button>
                                        <button onClick={() => setAppliedStyles(p => ({ ...p, underline: !p.underline }))} className={`p-1.5 rounded ${appliedStyles.underline ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Underline (Ctrl+U)"><Underline size={13} /></button>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-sans">Font</span>
                                </div>

                                {isExcel && (
                                    <div className="flex flex-col items-center border-r border-gray-300 pr-3">
                                        <div className="flex gap-1.5 mb-1">
                                            <button
                                                onClick={() => handleApplyAction('conditionalFormatting', 'Đã áp dụng quy tắc Conditional Formatting (Lương > 20tr bôi xanh)!')}
                                                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-gray-300 rounded text-xs font-semibold text-emerald-800 flex items-center gap-1 shadow-xs"
                                            >
                                                <Sparkles size={13} className="text-emerald-600" /> Conditional Formatting
                                            </button>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-sans">Styles</span>
                                    </div>
                                )}

                                {isWord && (
                                    <div className="flex flex-col items-center border-r border-gray-300 pr-3">
                                        <div className="flex gap-1 mb-1">
                                            <button onClick={() => handleApplyAction('heading1', 'Đã gán Heading 1')} className="px-2 py-0.5 bg-white border border-gray-300 hover:bg-blue-50 text-blue-900 font-bold rounded">Heading 1</button>
                                            <button onClick={() => handleApplyAction('heading2', 'Đã gán Heading 2')} className="px-2 py-0.5 bg-white border border-gray-300 hover:bg-blue-50 text-blue-800 font-semibold rounded">Heading 2</button>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-sans">Styles</span>
                                    </div>
                                )}

                                {isPpt && (
                                    <div className="flex flex-col items-center border-r border-gray-300 pr-3">
                                        <button
                                            onClick={() => handleApplyAction('smartArtConverted', 'Đã chuyển đổi Bullet List thành SmartArt Horizontal Process!')}
                                            className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-gray-300 rounded font-semibold text-orange-900 flex items-center gap-1"
                                        >
                                            <Layers size={13} /> Convert to SmartArt
                                        </button>
                                        <span className="text-[10px] text-gray-500 font-sans">Paragraph</span>
                                    </div>
                                )}
                            </>
                        )}

                        {activeRibbonTab === 'Insert' && (
                            <>
                                <div className="flex items-center gap-2 border-r border-gray-300 pr-3">
                                    {isExcel && (
                                        <>
                                            <button
                                                onClick={() => handleApplyAction('pivotCreated', 'Đã tạo Pivot Table tại sheet "Pivot_Analysis"!')}
                                                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-gray-300 rounded font-semibold text-emerald-900 flex items-center gap-1.5 shadow-xs"
                                            >
                                                <Table size={14} className="text-emerald-700" /> PivotTable
                                            </button>
                                            <button
                                                onClick={() => handleApplyAction('chartCreated', 'Đã chèn biểu đồ 2-D Clustered Column "So Sánh Thu Nhập 2026"!')}
                                                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-gray-300 rounded font-semibold text-emerald-900 flex items-center gap-1.5 shadow-xs"
                                            >
                                                <BarChart3 size={14} className="text-emerald-700" /> 2-D Clustered Column
                                            </button>
                                        </>
                                    )}
                                    {isWord && (
                                        <button
                                            onClick={() => handleApplyAction('tableOfContentsAdded', 'Đã chèn Mục lục Tự động (Automatic Table 2)!')}
                                            className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-gray-300 rounded font-semibold text-blue-900 flex items-center gap-1.5"
                                        >
                                            <Table size={14} /> Table / Break
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {activeRibbonTab === 'Formulas' && isExcel && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setFormulaBarValue('=VLOOKUP(C2, Department_Lookup!$A$2:$B$10, 2, FALSE)');
                                        handleApplyAction('vlookup', 'Đã chèn hàm VLOOKUP tra cứu phòng ban!');
                                    }}
                                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-gray-300 rounded font-semibold text-emerald-900 flex items-center gap-1"
                                >
                                    Lookup & Ref: VLOOKUP
                                </button>
                                <button
                                    onClick={() => {
                                        setFormulaBarValue('=IF(F2>=90, E2*0.2, IF(F2>=75, E2*0.1, 0))');
                                        handleApplyAction('ifLogic', 'Đã chèn hàm tính thưởng IF/IFS logic!');
                                    }}
                                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-gray-300 rounded font-semibold text-emerald-900 flex items-center gap-1"
                                >
                                    Logical: IF / IFS
                                </button>
                            </div>
                        )}

                        {activeRibbonTab === 'References' && isWord && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleApplyAction('tableOfContentsAdded', 'Đã tạo Mục lục Tự động (Table of Contents)!')}
                                    className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-gray-300 rounded font-semibold text-blue-900"
                                >
                                    Table of Contents (Mục lục)
                                </button>
                                <button
                                    onClick={() => handleApplyAction('apaCitationAdded', 'Đã thêm nguồn trích dẫn APA: Huỳnh Văn Sơn (2024)!')}
                                    className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-gray-300 rounded font-semibold text-blue-900"
                                >
                                    Insert Citation (APA 7th)
                                </button>
                            </div>
                        )}

                        {activeRibbonTab === 'Layout' && isWord && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleApplyAction('sectionBreakAdded', 'Đã chèn Section Break (Next Page) phân tách trang bìa!')}
                                    className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-gray-300 rounded font-semibold text-blue-900"
                                >
                                    Breaks ➔ Section Break (Next Page)
                                </button>
                            </div>
                        )}

                        {activeRibbonTab === 'View' && isPpt && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleApplyAction('slideMasterUpdated', 'Đã truy cập Slide Master và đồng bộ Logo nhà trường lên toàn bộ slide!')}
                                    className="px-3 py-1.5 bg-white hover:bg-orange-50 border border-gray-300 rounded font-semibold text-orange-900"
                                >
                                    Master Views ➔ Slide Master
                                </button>
                            </div>
                        )}

                        {activeRibbonTab === 'Transitions' && isPpt && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleApplyAction('morphApplied', 'Đã áp dụng hiệu ứng Morph Transitions (Duration 1.25s, Apply to All)!')}
                                    className="px-3 py-1.5 bg-white hover:bg-orange-50 border border-gray-300 rounded font-semibold text-orange-900"
                                >
                                    Effect: Morph (Apply to All)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Formula Bar (For Excel) */}
                    {isExcel && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-t border-gray-300 text-xs">
                            <div className="w-14 px-2 py-1 bg-gray-100 border border-gray-300 text-center font-mono font-bold text-gray-700">
                                {activeCell}
                            </div>
                            <span className="font-serif italic text-gray-500 font-bold">fx</span>
                            <form onSubmit={handleApplyFormula} className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={formulaBarValue}
                                    onChange={e => setFormulaBarValue(e.target.value)}
                                    placeholder="=VLOOKUP(C2, Department_Lookup!$A$2:$B$10, 2, FALSE) hoặc =IF(F2>=90, E2*0.2, ...)"
                                    className="w-full px-2.5 py-1 border border-gray-300 font-mono text-xs focus:outline-none focus:border-emerald-600 bg-white"
                                />
                                <button type="submit" className="px-3 py-1 bg-emerald-700 text-white font-sans text-xs font-bold rounded">
                                    Áp dụng
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* 2. MAIN DOCUMENT WORKSPACE CANVAS */}
                <div className="flex-1 bg-[#e1dfdd] p-4 md:p-6 overflow-y-auto max-h-[420px]">
                    {isExcel && (
                        <div className="bg-white border border-gray-300 shadow-md font-sans text-xs max-w-5xl mx-auto overflow-x-auto">
                            <div className="p-3 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
                                <h4 className="font-bold text-gray-800 font-sans text-sm">Trang tính: {project.activeSheet}</h4>
                                <span className="text-[11px] text-gray-500 font-mono">Bảng dữ liệu: Staff_Salary_Table (A1:H7)</span>
                            </div>

                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 border-b border-gray-300">
                                        <th className="p-2 border-r border-gray-300 text-center w-10">#</th>
                                        <th className="p-2 border-r border-gray-300">Mã NV (A)</th>
                                        <th className="p-2 border-r border-gray-300">Họ và Tên (B)</th>
                                        <th className="p-2 border-r border-gray-300">Mã PB (C)</th>
                                        <th className="p-2 border-r border-gray-300">Tên Phòng Ban (D)</th>
                                        <th className="p-2 border-r border-gray-300 text-right">Lương Cơ Bản (E)</th>
                                        <th className="p-2 border-r border-gray-300 text-center">KPI Score (F)</th>
                                        <th className="p-2 border-r border-gray-300 text-right">Tiền Thưởng (G)</th>
                                        <th className="p-2 text-right">Tổng Thu Nhập (H)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.tableData.map((row, idx) => {
                                        const isHighSalary = row.totalSalary > 20000000;
                                        const isHighlight = appliedStyles.conditionalFormatting && isHighSalary;

                                        return (
                                            <tr key={row.id} className="border-b border-gray-200 hover:bg-blue-50/40 transition-colors">
                                                <td className="p-2 border-r border-gray-300 text-center bg-gray-50 text-gray-400 font-mono">{idx + 1}</td>
                                                <td className="p-2 border-r border-gray-300 font-mono font-semibold text-blue-900">{row.empCode}</td>
                                                <td className="p-2 border-r border-gray-300 font-bold text-gray-900">{row.name}</td>
                                                <td className="p-2 border-r border-gray-300 font-mono text-center">{row.deptCode}</td>
                                                <td className="p-2 border-r border-gray-300 text-gray-800">
                                                    {appliedStyles.vlookup || appliedStyles.formulaApplied ? (
                                                        <span className="font-semibold text-emerald-800">{row.deptName}</span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">#N/A (Chưa VLOOKUP)</span>
                                                    )}
                                                </td>
                                                <td className="p-2 border-r border-gray-300 text-right font-mono">{row.baseSalary.toLocaleString('vi-VN')} đ</td>
                                                <td className="p-2 border-r border-gray-300 text-center font-bold">
                                                    <span className={`px-1.5 py-0.5 rounded text-[11px] ${row.kpiScore >= 90 ? 'bg-green-100 text-green-800' : row.kpiScore >= 75 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                                        {row.kpiScore}
                                                    </span>
                                                </td>
                                                <td className="p-2 border-r border-gray-300 text-right font-mono text-emerald-700">
                                                    {appliedStyles.ifLogic || appliedStyles.formulaApplied ? `${row.bonus.toLocaleString('vi-VN')} đ` : '0 đ'}
                                                </td>
                                                <td className={`p-2 text-right font-mono font-bold ${
                                                    isHighlight ? 'bg-green-100 text-green-900 border-2 border-green-500' : 'text-gray-900'
                                                }`}>
                                                    {row.totalSalary.toLocaleString('vi-VN')} đ
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Simulated Visual Chart if generated */}
                            {appliedStyles.chartCreated && (
                                <div className="p-4 bg-emerald-50/50 border-t border-emerald-300 m-3 rounded">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-bold text-emerald-900 font-sans">Biểu đồ 2-D Clustered Column: So Sánh Thu Nhập Nhân Viên 2026 (Chart Style 8)</h5>
                                        <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">Đạt tiêu chuẩn Task 5</span>
                                    </div>
                                    <div className="h-32 bg-white border border-gray-300 flex items-end justify-around p-3 gap-2">
                                        {project.tableData.map(r => (
                                            <div key={r.id} className="flex flex-col items-center gap-1 flex-1">
                                                <div className="w-full flex items-end justify-center gap-1 h-20">
                                                    <div style={{ height: `${(r.baseSalary / 30000000) * 100}%` }} className="w-3 bg-blue-500 rounded-t" title={`Base: ${r.baseSalary}`}></div>
                                                    <div style={{ height: `${(r.totalSalary / 30000000) * 100}%` }} className="w-3 bg-emerald-600 rounded-t" title={`Total: ${r.totalSalary}`}></div>
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-mono truncate max-w-[60px]">{r.name.split(' ').pop()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isWord && (
                        <div className="bg-white shadow-xl max-w-3xl mx-auto p-10 min-h-[360px] border border-gray-300 font-serif leading-relaxed text-gray-800 relative">
                            {appliedStyles.sectionBreakAdded && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1 mb-4 rounded flex items-center justify-between font-sans">
                                    <span>[Section Break (Next Page) - Đã tách phân vùng trang bìa & nội dung]</span>
                                    <CheckCircle2 size={14} />
                                </div>
                            )}

                            {appliedStyles.tableOfContentsAdded && (
                                <div className="border border-dashed border-gray-400 p-4 mb-6 bg-gray-50 rounded font-sans text-xs">
                                    <h4 className="font-bold text-gray-900 uppercase tracking-wide mb-2 text-sm border-b pb-1">MỤC LỤC TỰ ĐỘNG (TABLE OF CONTENTS)</h4>
                                    <p className="flex justify-between"><span>CHƯƠNG 1: TỔNG QUAN TÀI LIỆU ...........................................................</span> <span>Trang 3</span></p>
                                    <p className="flex justify-between pl-4"><span>1.1 Cơ sở lý luận giáo dục ..............................................................</span> <span>Trang 3</span></p>
                                    <p className="flex justify-between pl-4"><span>1.2 Phương pháp nghiên cứu thực nghiệm ..........................................</span> <span>Trang 5</span></p>
                                </div>
                            )}

                            <h1 className="text-2xl font-bold font-serif-title text-brand-cerulean mb-4 text-center">
                                KỶ YẾU NGHIÊN CỨU KHOA HỌC SƯ PHẠM 2026
                            </h1>

                            <h2 className={`text-lg font-bold mb-2 ${appliedStyles.heading1 ? 'text-blue-900 border-b pb-1 border-blue-300' : 'text-gray-900'}`}>
                                CHƯƠNG 1: TỔNG QUAN TÀI LIỆU
                            </h2>

                            <p className="text-sm mb-3">
                                Nghiên cứu ứng dụng công nghệ giáo dục số trong việc đổi mới phương pháp giảng dạy tại các cơ sở đào tạo sư phạm trọng điểm.
                            </p>

                            <h3 className={`text-base font-semibold mb-2 ${appliedStyles.heading2 ? 'text-blue-800 italic' : 'text-gray-800'}`}>
                                1.1 Cơ sở lý luận giáo dục
                            </h3>

                            <p className="text-sm">
                                Quá trình tiếp thu tri thức của học sinh diễn ra thông qua các hoạt động tương tác trải nghiệm thực tế.
                                {appliedStyles.apaCitationAdded ? (
                                    <span className="font-bold text-blue-900 bg-blue-100 px-1 py-0.5 rounded mx-1 text-xs">
                                        (Huỳnh Văn Sơn, 2024)
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic"> [Chưa chèn trích dẫn APA]</span>
                                )}
                            </p>
                        </div>
                    )}

                    {isPpt && (
                        <div className="bg-white shadow-xl max-w-3xl mx-auto aspect-video p-8 border border-gray-300 flex flex-col justify-between relative rounded">
                            {appliedStyles.slideMasterUpdated && (
                                <div className="absolute top-4 right-4 bg-brand-cream border border-brand-cerulean/30 px-3 py-1 rounded text-xs font-bold text-brand-cerulean flex items-center gap-1 shadow-sm">
                                    <span>Logo Đại học Sư phạm (1.5cm)</span>
                                </div>
                            )}

                            <div>
                                <span className="text-xs font-bold text-orange-700 tracking-wider uppercase font-sans">Slide 4 of 10</span>
                                <h3 className="text-2xl font-bold font-serif-title text-brand-cerulean mt-1">QUY TRÌNH 4 BƯỚC DẠY HỌC TÍCH HỢP</h3>
                            </div>

                            {appliedStyles.smartArtConverted ? (
                                <div className="grid grid-cols-4 gap-3 my-auto">
                                    {[
                                        { step: '1. Khởi động', desc: 'Tạo tình huống có vấn đề' },
                                        { step: '2. Khám phá', desc: 'Thực hành phòng lab ảo' },
                                        { step: '3. Luyện tập', desc: 'Giải quyết multi-project' },
                                        { step: '4. Vận dụng', desc: 'Báo cáo & Đánh giá' }
                                    ].map((s, i) => (
                                        <div key={i} className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-3 rounded shadow-md text-center">
                                            <p className="font-bold font-sans text-xs">{s.step}</p>
                                            <p className="text-[10px] text-orange-100 mt-1">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 my-auto">
                                    <li>Bước 1: Khởi động và khơi gợi động lực học tập.</li>
                                    <li>Bước 2: Khám phá kiến thức qua bài tập tình huống.</li>
                                    <li>Bước 3: Luyện tập kỹ năng trên phần mềm mô phỏng.</li>
                                    <li>Bước 4: Vận dụng thực tế và tổng kết đánh giá.</li>
                                </ul>
                            )}

                            <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-2 font-sans">
                                <span>Khóa luận tốt nghiệp Sư phạm Kỹ thuật 2026</span>
                                <span>Nguyễn Huỳnh Phúc Khang</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. CERTIPORT EXAMINATION CONSOLE (BOTTOM PANE) */}
                <div className="bg-[#2c3e50] text-white p-4 border-t-4 border-brand-jasper">
                    {/* Project & Task Selector Navigation Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-gray-600">
                        <div className="flex items-center gap-3">
                            <span className="bg-brand-jasper text-white text-xs font-bold font-sans px-2.5 py-1 rounded">
                                Multi-Project Mode
                            </span>
                            <span className="text-sm font-sans font-bold text-amber-300">
                                Project 1 of 5 &bull; Task {activeTaskIndex + 1} of {project.tasks.length}
                            </span>
                        </div>

                        {/* Task Number Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {project.tasks.map((t, idx) => {
                                const isDone = taskCompletedState[idx];
                                const isReview = taskReviewState[idx];
                                const isActive = activeTaskIndex === idx;

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setActiveTaskIndex(idx);
                                            setShowHint(false);
                                            setShowOptimalPath(false);
                                        }}
                                        className={`px-3 py-1 rounded text-xs font-sans font-bold transition-all flex items-center gap-1 ${
                                            isActive
                                                ? 'bg-amber-400 text-gray-950 ring-2 ring-white shadow'
                                                : isDone
                                                    ? 'bg-emerald-700 text-white'
                                                    : isReview
                                                        ? 'bg-amber-700 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {isDone && <Check size={12} />}
                                        <span>Task {idx + 1}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Task Requirement Instruction Box */}
                    <div className="py-3.5 space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-amber-400 font-sans text-sm shrink-0">Yêu cầu Task {currentTask.taskNumber}:</span>
                            <p className="text-sm font-sans text-gray-100 leading-relaxed font-medium">
                                {currentTask.instruction}
                            </p>
                        </div>

                        {/* Optimal Path & Shortcut Helpers */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowOptimalPath(!showOptimalPath)}
                                className="text-xs font-sans text-amber-300 hover:text-white flex items-center gap-1 font-bold underline underline-offset-2"
                            >
                                <Lightbulb size={14} /> {showOptimalPath ? 'Ẩn luồng thao tác tối ưu' : 'Xem luồng thao tác tối ưu (Click-Path)'}
                            </button>

                            <label className="flex items-center gap-1.5 text-xs font-sans cursor-pointer ml-auto">
                                <input
                                    type="checkbox"
                                    checked={Boolean(taskCompletedState[activeTaskIndex])}
                                    onChange={() => handleToggleTaskCompleted(activeTaskIndex)}
                                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                                />
                                <span className={taskCompletedState[activeTaskIndex] ? 'text-emerald-300 font-bold' : 'text-gray-300'}>
                                    Mark as Completed (Đã hoàn thành)
                                </span>
                            </label>

                            <label className="flex items-center gap-1.5 text-xs font-sans cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Boolean(taskReviewState[activeTaskIndex])}
                                    onChange={() => handleToggleTaskReview(activeTaskIndex)}
                                    className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                                />
                                <span className={taskReviewState[activeTaskIndex] ? 'text-amber-300 font-bold' : 'text-gray-300'}>
                                    Mark for Review (Xem lại sau)
                                </span>
                            </label>
                        </div>

                        {/* Optimal Path Details Display */}
                        {showOptimalPath && (
                            <div className="p-3 bg-gray-800/90 border border-amber-400/40 rounded text-xs font-sans space-y-1.5 animate-fade-in-down">
                                <div className="flex items-center gap-2 text-amber-300 font-bold">
                                    <span>🎯 Luồng click Ribbon chuẩn Certiport:</span>
                                </div>
                                <p className="text-gray-200 font-mono">
                                    {currentTask.optimalClickPath.join(' ➔ ')}
                                </p>
                                {currentTask.shortcut && (
                                    <p className="text-emerald-300">
                                        ⚡ <strong>Phím tắt nhanh:</strong> <span className="font-mono">{currentTask.shortcut}</span>
                                    </p>
                                )}
                                <p className="text-gray-400 italic text-[11px]">
                                    💡 Mẹo thi: {currentTask.hintText}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Console Footer Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={activeTaskIndex === 0}
                                onClick={() => setActiveTaskIndex(prev => Math.max(0, prev - 1))}
                                className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 rounded text-xs font-sans font-bold flex items-center gap-1"
                            >
                                <ChevronLeft size={14} /> Previous Task
                            </button>
                            <button
                                type="button"
                                disabled={activeTaskIndex === project.tasks.length - 1}
                                onClick={() => setActiveTaskIndex(prev => Math.min(project.tasks.length - 1, prev + 1))}
                                className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 rounded text-xs font-sans font-bold flex items-center gap-1"
                            >
                                Next Task <ChevronRight size={14} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmitProject}
                            className="px-6 py-2.5 bg-brand-jasper hover:bg-red-800 text-brand-cream font-serif-title font-bold text-sm shadow-editorial transition-all flex items-center gap-2"
                        >
                            <Award size={16} /> Chấm Điểm & Nộp Dự Án
                        </button>
                    </div>
                </div>
            </div>

            {/* Scorecard Modal when Submitted */}
            {projectSubmitted && (
                <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white border-editorial shadow-2xl p-8 max-w-lg w-full text-center space-y-5 animate-modal-pop-in">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-2 border-emerald-300">
                            <Award size={32} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Báo Cáo Điểm Số Certiport MOS</span>
                            <h3 className="text-3xl font-serif-title text-brand-cerulean font-bold mt-1">{project.title}</h3>
                        </div>

                        <div className="p-4 bg-brand-cream border border-brand-cerulean/20 rounded">
                            <div className="text-4xl font-serif-title font-black text-brand-jasper mb-1">
                                {earnedScore} / 1000
                            </div>
                            <p className="text-sm font-sans font-bold text-gray-700">
                                {earnedScore >= 700 ? '🎉 ĐẠT CHUẨN CHỨNG CHỈ (PASSED)' : '⚠️ CẦN LUYỆN TẬP THÊM (FAILED)'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-mono">Thời gian hoàn thành: {formatTimer(50 * 60 - timeRemaining)}</p>
                        </div>

                        <div className="flex gap-3 justify-center pt-2">
                            <button
                                type="button"
                                onClick={() => setProjectSubmitted(false)}
                                className="px-5 py-2 border border-gray-300 font-serif-title text-sm rounded text-gray-700 hover:bg-gray-50"
                            >
                                Tiếp tục thực hành
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setProjectSubmitted(false);
                                    if (navigate) navigate('mos_analytics');
                                }}
                                className="px-6 py-2 bg-brand-cerulean text-white font-serif-title text-sm rounded shadow hover:bg-brand-jasper transition-colors"
                            >
                                Xem Báo Cáo Chuẩn Đoán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
