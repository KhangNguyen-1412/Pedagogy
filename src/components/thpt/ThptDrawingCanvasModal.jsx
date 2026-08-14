import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    X, Check, Undo, Redo, Trash2, Edit3, Square, Circle, Minus,
    MoveRight, Type, Grid as GridIcon, Palette, RotateCcw,
    Maximize2, Sparkles, Download, Layers, Box, Compass, ChevronDown
} from 'lucide-react';

export const ThptDrawingCanvasModal = ({
    isOpen,
    onClose,
    onSaveImage,
    initialImageUrl = '',
    title = 'Studio Vẽ Đồ thị & Hình học THPT'
}) => {
    const canvasRef = useRef(null);
    const [currentTool, setCurrentTool] = useState('pen'); // 'pen' | 'line' | 'dashed_line' | 'arrow' | 'rect' | 'circle' | 'right_angle' | 'text' | 'eraser'
    const [strokeColor, setStrokeColor] = useState('#124874');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [showGrid, setShowGrid] = useState(true);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [textInput, setTextInput] = useState('');
    const [textPosition, setTextPosition] = useState(null);
    const [isAddingText, setIsAddingText] = useState(false);
    const [is3DMenuOpen, setIs3DMenuOpen] = useState(false);

    const CANVAS_WIDTH = 760;
    const CANVAS_HEIGHT = 460;

    const COLORS = [
        '#124874', // Brand cerulean
        '#CF373D', // Brand jasper / red
        '#16A34A', // Green
        '#2563EB', // Blue
        '#D97706', // Orange
        '#7C3AED', // Purple
        '#1F2937', // Dark ink
        '#6B7280'  // Gray
    ];

    const STROKE_WIDTHS = [
        { label: 'Mảnh (1px)', value: 1.5 },
        { label: 'Vừa (2.5px)', value: 2.5 },
        { label: 'Đậm (4px)', value: 4 },
        { label: 'Rất đậm (6px)', value: 6 }
    ];

    // Push canvas state to history
    const pushHistory = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        setHistory(prev => {
            const next = prev.slice(0, historyStep + 1);
            return [...next, dataUrl];
        });
        setHistoryStep(prev => prev + 1);
    }, [historyStep]);

    // Draw grid background on canvas
    const drawGridLines = useCallback((ctx) => {
        if (!showGrid) return;
        ctx.save();
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 0.8;
        const gridSize = 20;

        for (let x = 0; x < CANVAS_WIDTH; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }
        ctx.restore();
    }, [showGrid]);

    // Clear and redraw canvas background
    const clearCanvasToWhite = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawGridLines(ctx);
    }, [drawGridLines]);

    // Initialize Canvas when opened
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawGridLines(ctx);

            if (initialImageUrl) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                    const initData = canvas.toDataURL('image/png');
                    setHistory([initData]);
                    setHistoryStep(0);
                };
                img.src = initialImageUrl;
            } else {
                const initData = canvas.toDataURL('image/png');
                setHistory([initData]);
                setHistoryStep(0);
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [isOpen, initialImageUrl, drawGridLines]);

    // Undo action
    const handleUndo = () => {
        if (historyStep <= 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const nextStep = historyStep - 1;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(img, 0, 0);
            setHistoryStep(nextStep);
        };
        img.src = history[nextStep];
    };

    // Redo action
    const handleRedo = () => {
        if (historyStep >= history.length - 1) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const nextStep = historyStep + 1;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(img, 0, 0);
            setHistoryStep(nextStep);
        };
        img.src = history[nextStep];
    };

    // Reset / Clear board
    const handleClearAll = () => {
        if (window.confirm('Bạn có chắc muốn xóa toàn bộ hình vẽ trên bảng?')) {
            clearCanvasToWhite();
            pushHistory();
        }
    };

    // Helper: Draw text label
    const drawLabel = (ctx, text, x, y, font = 'bold 15px "Playfair Display", Georgia, serif') => {
        ctx.font = font;
        ctx.fillStyle = strokeColor;
        ctx.fillText(text, x, y);
    };

    // Helper: Draw line
    const drawLineSegment = (ctx, x1, y1, x2, y2, isDashed = false) => {
        ctx.beginPath();
        if (isDashed) {
            ctx.setLineDash([5, 5]);
        } else {
            ctx.setLineDash([]);
        }
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    // ─── 3D PRESET BUILDERS ──────────────────────────────────────────────────

    // 1. Hệ trục Oxy (2D)
    const drawOxyPreset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Trục Ox
        ctx.beginPath();
        ctx.moveTo(40, centerY);
        ctx.lineTo(CANVAS_WIDTH - 40, centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH - 40, centerY);
        ctx.lineTo(CANVAS_WIDTH - 50, centerY - 5);
        ctx.lineTo(CANVAS_WIDTH - 50, centerY + 5);
        ctx.closePath();
        ctx.fill();

        // Trục Oy
        ctx.beginPath();
        ctx.moveTo(centerX, CANVAS_HEIGHT - 30);
        ctx.lineTo(centerX, 30);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, 30);
        ctx.lineTo(centerX - 5, 40);
        ctx.lineTo(centerX + 5, 40);
        ctx.closePath();
        ctx.fill();

        drawLabel(ctx, 'O', centerX - 15, centerY + 18);
        drawLabel(ctx, 'x', CANVAS_WIDTH - 35, centerY + 18);
        drawLabel(ctx, 'y', centerX + 12, 35);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 2. Hệ trục Oxyz (3D Không Gian)
    const drawOxyzPreset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const ox = 380, oy = 250;

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Trục Oz (thẳng đứng lên)
        drawLineSegment(ctx, ox, oy, ox, 60);
        ctx.beginPath();
        ctx.moveTo(ox, 60);
        ctx.lineTo(ox - 5, 72);
        ctx.lineTo(ox + 5, 72);
        ctx.closePath();
        ctx.fill();

        // Trục Oy (sang phải)
        drawLineSegment(ctx, ox, oy, ox + 260, oy);
        ctx.beginPath();
        ctx.moveTo(ox + 260, oy);
        ctx.lineTo(ox + 248, oy - 5);
        ctx.lineTo(ox + 248, oy + 5);
        ctx.closePath();
        ctx.fill();

        // Trục Ox (chếch xuống trái 45 độ)
        drawLineSegment(ctx, ox, oy, ox - 180, oy + 150);
        ctx.beginPath();
        ctx.moveTo(ox - 180, oy + 150);
        ctx.lineTo(ox - 165, oy + 145);
        ctx.lineTo(ox - 173, oy + 135);
        ctx.closePath();
        ctx.fill();

        // Tia đối nét đứt
        drawLineSegment(ctx, ox, oy, ox, oy + 80, true);
        drawLineSegment(ctx, ox, oy, ox - 120, oy, true);
        drawLineSegment(ctx, ox, oy, ox + 90, oy - 75, true);

        drawLabel(ctx, 'O', ox - 18, oy - 8);
        drawLabel(ctx, 'z', ox + 12, 65);
        drawLabel(ctx, 'y', ox + 265, oy + 15);
        drawLabel(ctx, 'x', ox - 195, oy + 165);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 3. Hình chóp tam giác / Tứ diện S.ABC (có đường cao SH vuông góc đáy)
    const drawPyramidTriangular = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const S = { x: 380, y: 70 };
        const A = { x: 230, y: 350 };
        const B = { x: 350, y: 410 };
        const C = { x: 530, y: 350 };
        const H = { x: 380, y: 360 };

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Cạnh thấy (nét liền)
        drawLineSegment(ctx, S.x, S.y, A.x, A.y);
        drawLineSegment(ctx, S.x, S.y, B.x, B.y);
        drawLineSegment(ctx, S.x, S.y, C.x, C.y);
        drawLineSegment(ctx, A.x, A.y, B.x, B.y);
        drawLineSegment(ctx, B.x, B.y, C.x, C.y);

        // Cạnh khuất (nét đứt)
        drawLineSegment(ctx, A.x, A.y, C.x, C.y, true);
        drawLineSegment(ctx, S.x, S.y, H.x, H.y, true); // Đường cao SH

        // Ký hiệu góc vuông SH ⟂ đáy
        ctx.setLineDash([]);
        ctx.strokeRect(H.x - 8, H.y - 8, 8, 8);

        // Nhãn đỉnh
        drawLabel(ctx, 'S', S.x - 6, S.y - 12);
        drawLabel(ctx, 'A', A.x - 20, A.y + 10);
        drawLabel(ctx, 'B', B.x - 5, B.y + 22);
        drawLabel(ctx, 'C', C.x + 10, C.y + 10);
        drawLabel(ctx, 'H', H.x - 15, H.y + 16);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 4. Hình chóp tứ giác S.ABCD (Đáy hình bình hành)
    const drawPyramidQuadrilateral = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const S = { x: 380, y: 70 };
        const A = { x: 270, y: 310 }; // Sau trái
        const B = { x: 190, y: 390 }; // Trước trái
        const C = { x: 470, y: 390 }; // Trước phải
        const D = { x: 550, y: 310 }; // Sau phải
        const O = { x: 370, y: 350 }; // Tâm đáy

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Cạnh ngoài thấy (nét liền)
        drawLineSegment(ctx, S.x, S.y, B.x, B.y);
        drawLineSegment(ctx, S.x, S.y, C.x, C.y);
        drawLineSegment(ctx, S.x, S.y, D.x, D.y);
        drawLineSegment(ctx, B.x, B.y, C.x, C.y);
        drawLineSegment(ctx, C.x, C.y, D.x, D.y);

        // Cạnh khuất nét đứt (SA, AB, AD, SO, AC, BD)
        drawLineSegment(ctx, S.x, S.y, A.x, A.y, true);
        drawLineSegment(ctx, A.x, A.y, B.x, B.y, true);
        drawLineSegment(ctx, A.x, A.y, D.x, D.y, true);
        drawLineSegment(ctx, A.x, A.y, C.x, C.y, true);
        drawLineSegment(ctx, B.x, B.y, D.x, D.y, true);
        drawLineSegment(ctx, S.x, S.y, O.x, O.y, true); // Chiều cao SO

        // Nhãn đỉnh
        drawLabel(ctx, 'S', S.x - 6, S.y - 12);
        drawLabel(ctx, 'A', A.x - 18, A.y - 8);
        drawLabel(ctx, 'B', B.x - 20, B.y + 12);
        drawLabel(ctx, 'C', C.x + 8, C.y + 15);
        drawLabel(ctx, 'D', D.x + 10, D.y - 8);
        drawLabel(ctx, 'O', O.x - 12, O.y + 18);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 5. Hình lập phương / Khối hộp chữ nhật ABCD.A'B'C'D'
    const drawCubeBox = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Đáy dưới ABCD
        const A = { x: 280, y: 270 };
        const B = { x: 200, y: 350 };
        const C = { x: 480, y: 350 };
        const D = { x: 560, y: 270 };

        // Đáy trên A'B'C'D'
        const h = 150;
        const A1 = { x: A.x, y: A.y - h };
        const B1 = { x: B.x, y: B.y - h };
        const C1 = { x: C.x, y: C.y - h };
        const D1 = { x: D.x, y: D.y - h };

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Đáy trên (toàn bộ nét liền)
        drawLineSegment(ctx, A1.x, A1.y, B1.x, B1.y);
        drawLineSegment(ctx, B1.x, B1.y, C1.x, C1.y);
        drawLineSegment(ctx, C1.x, C1.y, D1.x, D1.y);
        drawLineSegment(ctx, D1.x, D1.y, A1.x, A1.y);

        // Cột đứng thấy
        drawLineSegment(ctx, B1.x, B1.y, B.x, B.y);
        drawLineSegment(ctx, C1.x, C1.y, C.x, C.y);
        drawLineSegment(ctx, D1.x, D1.y, D.x, D.y);

        // Đáy dưới thấy
        drawLineSegment(ctx, B.x, B.y, C.x, C.y);
        drawLineSegment(ctx, C.x, C.y, D.x, D.y);

        // Cạnh khuất nét đứt (AA', AB, AD)
        drawLineSegment(ctx, A1.x, A1.y, A.x, A.y, true);
        drawLineSegment(ctx, A.x, A.y, B.x, B.y, true);
        drawLineSegment(ctx, A.x, A.y, D.x, D.y, true);

        // Nhãn
        drawLabel(ctx, "A'", A1.x - 18, A1.y - 8);
        drawLabel(ctx, "B'", B1.x - 20, B1.y - 5);
        drawLabel(ctx, "C'", C1.x + 8, C1.y - 5);
        drawLabel(ctx, "D'", D1.x + 10, D1.y - 8);

        drawLabel(ctx, "A", A.x - 18, A.y + 12);
        drawLabel(ctx, "B", B.x - 20, B.y + 12);
        drawLabel(ctx, "C", C.x + 8, C.y + 12);
        drawLabel(ctx, "D", D.x + 10, D.y + 12);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 6. Hình lăng trụ đứng tam giác ABC.A'B'C'
    const drawTriangularPrism = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const A1 = { x: 260, y: 120 };
        const B1 = { x: 360, y: 170 };
        const C1 = { x: 500, y: 120 };

        const h = 200;
        const A = { x: A1.x, y: A1.y + h };
        const B = { x: B1.x, y: B1.y + h };
        const C = { x: C1.x, y: C1.y + h };

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Đáy trên
        drawLineSegment(ctx, A1.x, A1.y, B1.x, B1.y);
        drawLineSegment(ctx, B1.x, B1.y, C1.x, C1.y);
        drawLineSegment(ctx, C1.x, C1.y, A1.x, A1.y);

        // Cạnh đứng
        drawLineSegment(ctx, A1.x, A1.y, A.x, A.y);
        drawLineSegment(ctx, B1.x, B1.y, B.x, B.y);
        drawLineSegment(ctx, C1.x, C1.y, C.x, C.y);

        // Đáy dưới
        drawLineSegment(ctx, A.x, A.y, B.x, B.y);
        drawLineSegment(ctx, B.x, B.y, C.x, C.y);
        drawLineSegment(ctx, A.x, A.y, C.x, C.y, true); // Nét đứt

        drawLabel(ctx, "A'", A1.x - 20, A1.y - 5);
        drawLabel(ctx, "B'", B1.x - 5, B1.y + 18);
        drawLabel(ctx, "C'", C1.x + 8, C1.y - 5);
        drawLabel(ctx, "A", A.x - 20, A.y + 10);
        drawLabel(ctx, "B", B.x - 5, B.y + 20);
        drawLabel(ctx, "C", C.x + 8, C.y + 10);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 7. Hình nón (Đỉnh S, Đáy Elip bán phần nét đứt, Trục SO)
    const drawCone = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const S = { x: 380, y: 90 };
        const O = { x: 380, y: 370 };
        const rx = 160;
        const ry = 42;

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Hai đường sinh ngoài
        drawLineSegment(ctx, S.x, S.y, O.x - rx, O.y);
        drawLineSegment(ctx, S.x, S.y, O.x + rx, O.y);

        // Đáy: Nửa trước nét liền (0 đến PI)
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.ellipse(O.x, O.y, rx, ry, 0, 0, Math.PI);
        ctx.stroke();

        // Đáy: Nửa sau nét đứt (PI đến 2*PI)
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.ellipse(O.x, O.y, rx, ry, 0, Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Trục SO & Bán kính R nét đứt
        drawLineSegment(ctx, S.x, S.y, O.x, O.y, true);
        drawLineSegment(ctx, O.x, O.y, O.x + rx, O.y, true);

        // Góc vuông tại O
        ctx.setLineDash([]);
        ctx.strokeRect(O.x, O.y - 8, 8, 8);

        drawLabel(ctx, 'S', S.x - 6, S.y - 12);
        drawLabel(ctx, 'O', O.x - 18, O.y - 6);
        drawLabel(ctx, 'R', O.x + (rx / 2) - 4, O.y - 8);
        drawLabel(ctx, 'h', S.x - 18, (S.y + O.y) / 2);
        drawLabel(ctx, 'l', S.x + (rx / 2) + 20, (S.y + O.y) / 2);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 8. Hình trụ (Khối trụ tròn xoay)
    const drawCylinder = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const O1 = { x: 380, y: 130 };
        const O = { x: 380, y: 360 };
        const rx = 150;
        const ry = 36;

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Đáy trên (Elip toàn bộ nét liền)
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.ellipse(O1.x, O1.y, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Hai đường sinh bên
        drawLineSegment(ctx, O1.x - rx, O1.y, O.x - rx, O.y);
        drawLineSegment(ctx, O1.x + rx, O1.y, O.x + rx, O.y);

        // Đáy dưới: Nửa trước liền, nửa sau đứt
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.ellipse(O.x, O.y, rx, ry, 0, 0, Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.ellipse(O.x, O.y, rx, ry, 0, Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Trục O'O
        drawLineSegment(ctx, O1.x, O1.y, O.x, O.y, true);
        drawLineSegment(ctx, O1.x, O1.y, O1.x + rx, O1.y, true);
        drawLineSegment(ctx, O.x, O.y, O.x + rx, O.y, true);

        drawLabel(ctx, "O'", O1.x - 18, O1.y - 8);
        drawLabel(ctx, 'O', O.x - 18, O.y - 8);
        drawLabel(ctx, 'R', O1.x + (rx / 2) - 4, O1.y - 8);
        drawLabel(ctx, 'h', O.x - 18, (O1.y + O.y) / 2);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // 9. Mặt cầu / Khối cầu
    const drawSphere = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const O = { x: 380, y: 240 };
        const R = 140;

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Vòng tròn biên
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(O.x, O.y, R, 0, 2 * Math.PI);
        ctx.stroke();

        // Vĩ tuyến giữa: Nửa trước liền, nửa sau đứt
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.ellipse(O.x, O.y, R, 38, 0, 0, Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.ellipse(O.x, O.y, R, 38, 0, Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Tâm O & Bán kính R
        ctx.beginPath();
        ctx.arc(O.x, O.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = strokeColor;
        ctx.fill();

        drawLineSegment(ctx, O.x, O.y, O.x + R, O.y, true);
        drawLabel(ctx, 'O', O.x - 16, O.y - 8);
        drawLabel(ctx, 'R', O.x + (R / 2) - 4, O.y - 8);

        ctx.restore();
        pushHistory();
        setIs3DMenuOpen(false);
    };

    // ─────────────────────────────────────────────────────────────────────────

    // Mouse coordinates helper
    const getPos = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    // Mouse Down Handler
    const handleMouseDown = (e) => {
        const pos = getPos(e);
        setStartPos(pos);

        if (currentTool === 'text') {
            setTextPosition(pos);
            setIsAddingText(true);
            return;
        }

        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (currentTool === 'pen' || currentTool === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : strokeColor;
            ctx.lineWidth = currentTool === 'eraser' ? strokeWidth * 6 : strokeWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.setLineDash([]);
        }
    };

    // Mouse Move Handler
    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);

        if (currentTool === 'pen' || currentTool === 'eraser') {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else {
            // Restore snapshot from current history step to show live dragging preview
            if (history[historyStep]) {
                const img = new Image();
                img.src = history[historyStep];
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.drawImage(img, 0, 0);

                ctx.save();
                ctx.strokeStyle = strokeColor;
                ctx.fillStyle = strokeColor;
                ctx.lineWidth = strokeWidth;

                if (currentTool === 'dashed_line') {
                    ctx.setLineDash([6, 6]); // Nét đứt hình học không gian
                } else {
                    ctx.setLineDash([]);
                }

                if (currentTool === 'line' || currentTool === 'dashed_line') {
                    ctx.beginPath();
                    ctx.moveTo(startPos.x, startPos.y);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.stroke();
                } else if (currentTool === 'arrow') {
                    ctx.beginPath();
                    ctx.moveTo(startPos.x, startPos.y);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.stroke();

                    // Draw arrowhead
                    const angle = Math.atan2(pos.y - startPos.y, pos.x - startPos.x);
                    const headlen = 10 + strokeWidth;
                    ctx.beginPath();
                    ctx.moveTo(pos.x, pos.y);
                    ctx.lineTo(pos.x - headlen * Math.cos(angle - Math.PI / 6), pos.y - headlen * Math.sin(angle - Math.PI / 6));
                    ctx.lineTo(pos.x - headlen * Math.cos(angle + Math.PI / 6), pos.y - headlen * Math.sin(angle + Math.PI / 6));
                    ctx.closePath();
                    ctx.fill();
                } else if (currentTool === 'rect') {
                    ctx.strokeRect(
                        Math.min(startPos.x, pos.x),
                        Math.min(startPos.y, pos.y),
                        Math.abs(pos.x - startPos.x),
                        Math.abs(pos.y - startPos.y)
                    );
                } else if (currentTool === 'circle') {
                    const radiusX = Math.abs(pos.x - startPos.x) / 2;
                    const radiusY = Math.abs(pos.y - startPos.y) / 2;
                    const centerX = Math.min(startPos.x, pos.x) + radiusX;
                    const centerY = Math.min(startPos.y, pos.y) + radiusY;
                    ctx.beginPath();
                    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }
    };

    // Mouse Up Handler
    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        pushHistory();
    };

    // Submit Text to Canvas
    const handleAddTextSubmit = (e) => {
        e?.preventDefault();
        if (!textInput.trim() || !textPosition) {
            setIsAddingText(false);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.fillStyle = strokeColor;
        ctx.font = `bold ${strokeWidth >= 4 ? '18px' : '15px'} "Playfair Display", Georgia, serif`;
        ctx.fillText(textInput.trim(), textPosition.x, textPosition.y);
        ctx.restore();

        pushHistory();
        setTextInput('');
        setTextPosition(null);
        setIsAddingText(false);
    };

    // Final Save Handler: Export to PNG DataURL and send to caller
    const handleSaveAndApply = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        onSaveImage(dataUrl);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border-2 border-brand-cerulean shadow-2xl w-full max-w-5xl rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="p-4 bg-brand-cerulean text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-brand-jasper text-white rounded">
                            <Box size={16} />
                        </div>
                        <div>
                            <h3 className="font-serif-title font-bold text-base leading-tight">
                                {title}
                            </h3>
                            <p className="text-[11px] text-white/80 font-sans">
                                Hỗ trợ vẽ 2D & Hình học không gian 3D (Chóp, Lăng trụ, Hộp chữ nhật, Nón, Trụ, Cầu, Trục Oxyz)...
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-3 bg-brand-cream/80 border-b border-brand-cerulean/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Tool Selection Buttons */}
                    <div className="flex items-center gap-1 bg-white p-1 border border-brand-cerulean/20 rounded shadow-sm flex-wrap">
                        <button
                            type="button"
                            onClick={() => setCurrentTool('pen')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'pen' ? 'bg-brand-cerulean text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Bút vẽ tự do"
                        >
                            <Edit3 size={13} /> Bút vẽ
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTool('line')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'line' ? 'bg-brand-cerulean text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Đoạn thẳng liền (Cạnh thấy)"
                        >
                            <Minus size={13} /> Nét liền
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTool('dashed_line')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'dashed_line' ? 'bg-brand-cerulean text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Nét đứt (- -) cho cạnh khuất hình không gian 3D"
                        >
                            <Layers size={13} /> Nét đứt (- -)
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTool('arrow')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'arrow' ? 'bg-brand-cerulean text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Vectơ / Mũi tên trục"
                        >
                            <MoveRight size={13} /> Mũi tên
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTool('circle')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'circle' ? 'bg-brand-cerulean text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Hình tròn / Elip đáy nón, trụ"
                        >
                            <Circle size={13} /> Tròn/Elip
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTool('rect')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'rect' ? 'bg-brand-cerulean text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Hình chữ nhật"
                        >
                            <Square size={13} /> Hình hộp
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTool('text')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'text' ? 'bg-brand-cerulean text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Chèn ký tự / Đỉnh S, A, B, C, D, x, y, z..."
                        >
                            <Type size={13} /> Chữ/Đỉnh
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTool('eraser')}
                            className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-bold ${
                                currentTool === 'eraser' ? 'bg-brand-jasper text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Tẩy xóa nét vẽ"
                        >
                            Tẩy
                        </button>
                    </div>

                    {/* 3D Geometry Presets Dropdown Menu */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIs3DMenuOpen(!is3DMenuOpen)}
                            className="px-3 py-1.5 bg-brand-jasper text-white hover:bg-brand-cerulean rounded font-bold flex items-center gap-1.5 shadow-sm transition-all text-xs"
                            title="Chèn mẫu hình học không gian 3D chuẩn"
                        >
                            <Box size={14} /> Mẫu Hình Không Gian 3D <ChevronDown size={13} />
                        </button>

                        {is3DMenuOpen && (
                            <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 max-h-[390px] overflow-y-auto bg-white border-2 border-brand-cerulean shadow-2xl rounded-lg z-50 py-1 divide-y divide-gray-100 animate-fade-in-down text-left">
                                <div className="px-3.5 py-1.5 bg-brand-cream/90 text-[11px] font-bold font-serif-title text-brand-cerulean uppercase sticky top-0 z-10 border-b border-brand-cerulean/10">
                                    📐 Khối Đa Diện & Chóp
                                </div>
                                <button
                                    type="button"
                                    onClick={drawPyramidTriangular}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🔺</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Hình chóp tam giác S.ABC</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">Chiều cao SH ⟂ đáy, cạnh khuất nét đứt</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={drawPyramidQuadrilateral}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🔲</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Hình chóp tứ giác S.ABCD</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">Đáy hình bình hành, tâm O, chiều cao SO</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={drawCubeBox}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🧊</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Hình lập phương / Khối hộp chữ nhật</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">8 đỉnh ABCD.A'B'C'D' với 3 cạnh khuất</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={drawTriangularPrism}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🏛️</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Lăng trụ tam giác ABC.A'B'C'</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">Lăng trụ đứng 6 đỉnh, đáy tam giác</div>
                                    </div>
                                </button>

                                <div className="px-3.5 py-1.5 bg-brand-cream/90 text-[11px] font-bold font-serif-title text-brand-cerulean uppercase sticky top-0 z-10 border-b border-brand-cerulean/10">
                                    🌀 Khối Tròn Xoay & Tọa Độ
                                </div>
                                <button
                                    type="button"
                                    onClick={drawCone}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🍦</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Hình nón tròn xoay</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">Đỉnh S, Đáy Elip bán phần, Trục SO, Bán kính R</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={drawCylinder}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🛢️</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Hình trụ tròn xoay</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">2 đáy elip, hai đường sinh, trục O'O</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={drawSphere}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🌐</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Khối cầu / Mặt cầu</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">Tâm O, Bán kính R, vĩ tuyến xích đạo</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={drawOxyzPreset}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">🧭</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Hệ trục tọa độ không gian Oxyz</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">3 trục Ox, Oy, Oz và các tia đối nét đứt</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={drawOxyPreset}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-brand-cream/60 transition-colors flex items-start gap-2.5"
                                >
                                    <span className="text-base shrink-0 mt-0.5">📊</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-serif-title font-bold text-brand-cerulean text-xs">Hệ trục tọa độ Oxy (2D)</div>
                                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">Hệ trục tọa độ mặt phẳng chuẩn</div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Grid Toggle */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowGrid(!showGrid);
                            const canvas = canvasRef.current;
                            if (!canvas) return;
                            const ctx = canvas.getContext('2d');
                            const currentImg = new Image();
                            currentImg.onload = () => {
                                ctx.fillStyle = '#FFFFFF';
                                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                                if (!showGrid) drawGridLines(ctx);
                                ctx.drawImage(currentImg, 0, 0);
                            };
                            currentImg.src = canvas.toDataURL('image/png');
                        }}
                        className={`px-2.5 py-1.5 border rounded flex items-center gap-1 font-bold ${
                            showGrid ? 'bg-brand-cerulean/10 border-brand-cerulean text-brand-cerulean' : 'bg-white border-gray-300 text-gray-500'
                        }`}
                    >
                        <GridIcon size={13} /> Lưới ô ly
                    </button>

                    {/* Color Palette & Stroke Width */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-white p-1 border border-brand-cerulean/20 rounded">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setStrokeColor(c)}
                                    style={{ backgroundColor: c }}
                                    className={`w-5 h-5 rounded-full border transition-transform ${
                                        strokeColor === c ? 'scale-125 border-brand-jasper ring-2 ring-brand-jasper/30' : 'border-gray-300'
                                    }`}
                                />
                            ))}
                        </div>

                        <select
                            value={strokeWidth}
                            onChange={e => setStrokeWidth(Number(e.target.value))}
                            className="input-editorial py-1 px-2 text-xs bg-white font-sans"
                        >
                            {STROKE_WIDTHS.map(w => (
                                <option key={w.value} value={w.value}>{w.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Undo / Redo / Clear */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleUndo}
                            disabled={historyStep <= 0}
                            className="p-1.5 bg-white border border-brand-cerulean/20 text-brand-cerulean rounded hover:bg-gray-50 disabled:opacity-30"
                            title="Hoàn tác (Undo)"
                        >
                            <Undo size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRedo}
                            disabled={historyStep >= history.length - 1}
                            className="p-1.5 bg-white border border-brand-cerulean/20 text-brand-cerulean rounded hover:bg-gray-50 disabled:opacity-30"
                            title="Làm lại (Redo)"
                        >
                            <Redo size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="p-1.5 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50"
                            title="Xóa trắng bảng vẽ"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center overflow-auto relative">
                    <div className="bg-white shadow-lg border border-gray-300 relative inline-block rounded overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className={`cursor-crosshair block ${currentTool === 'eraser' ? 'cursor-cell' : ''}`}
                        />

                        {/* Inline Text Input Overlay */}
                        {isAddingText && textPosition && (
                            <form
                                onSubmit={handleAddTextSubmit}
                                style={{ left: textPosition.x, top: textPosition.y - 15 }}
                                className="absolute z-20 flex items-center gap-1 bg-white p-1 border-2 border-brand-jasper shadow-md rounded"
                            >
                                <input
                                    type="text"
                                    autoFocus
                                    value={textInput}
                                    onChange={e => setTextInput(e.target.value)}
                                    placeholder="Nhập nhãn (S, A, B, C, O, h, R...)"
                                    className="px-2 py-0.5 text-xs font-serif-title font-bold text-brand-cerulean outline-none w-44"
                                />
                                <button
                                    type="submit"
                                    className="p-1 bg-brand-cerulean text-white rounded hover:bg-brand-jasper"
                                >
                                    <Check size={12} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsAddingText(false); setTextPosition(null); }}
                                    className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    <X size={12} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-white border-t border-brand-cerulean/20 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-xs text-gray-500 font-sans italic">
                        💡 <strong>Mẹo Hình Không Gian 3D:</strong> Chọn menu <strong>"Mẫu Hình Không Gian 3D"</strong> để dựng sẵn khối chóp, lăng trụ, nón, trụ, cầu hoặc trục $Oxyz$, sau đó dùng công cụ <strong>"Nét đứt"</strong> hoặc <strong>"Chữ/Đỉnh"</strong> để vẽ thêm thiết diện và đường vuông góc.
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs text-gray-600 hover:text-gray-900"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAndApply}
                            className="px-6 py-2 bg-brand-cerulean text-white font-serif-title font-bold text-xs shadow-editorial hover:bg-brand-jasper transition-all flex items-center gap-2 rounded"
                        >
                            <Check size={15} /> Lưu & Áp dụng hình vẽ vào câu hỏi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThptDrawingCanvasModal;
