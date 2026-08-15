import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Search, ChevronDown, Check, X, Sparkles } from 'lucide-react';

/**
 * Danh sách Ngành đào tạo Đại học chuẩn theo phân loại của Bộ GD&ĐT (Cấp IV)
 * Kèm Mã ngành chuẩn để tự động điền vào hồ sơ xét tuyển
 */
export const STANDARD_MAJORS = [
    // --- MÁY TÍNH & CÔNG NGHỆ THÔNG TIN ---
    { code: '7480201', name: 'Khoa học Máy tính', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480103', name: 'Kỹ thuật Phần mềm', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480106', name: 'Kỹ thuật Máy tính', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480104', name: 'Hệ thống Thông tin', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480202', name: 'An toàn Thông tin', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480201', name: 'Công nghệ Thông tin', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480107', name: 'Trí tuệ Nhân tạo (AI)', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480109', name: 'Khoa học Dữ liệu', group: 'Máy tính & Công nghệ Thông tin' },
    { code: '7480204', name: 'Công nghệ Đa phương tiện', group: 'Máy tính & Công nghệ Thông tin' },

    // --- KINH DOANH, QUẢN LÝ & KINH TẾ ---
    { code: '7340101', name: 'Quản trị Kinh doanh', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340120', name: 'Kinh doanh Quốc tế', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340115', name: 'Marketing', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340122', name: 'Thương mại Điện tử (E-Commerce)', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340201', name: 'Tài chính - Ngân hàng', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340301', name: 'Kế toán', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340302', name: 'Kiểm toán', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7310101', name: 'Kinh tế', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7310106', name: 'Kinh tế Quốc tế', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340404', name: 'Quản trị Nhân lực', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7810103', name: 'Quản trị Dịch vụ Du lịch & Lữ hành', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7810201', name: 'Quản trị Khách sạn', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7810202', name: 'Quản trị Nhà hàng & Dịch vụ Ăn uống', group: 'Kinh doanh, Quản lý & Kinh tế' },
    { code: '7340116', name: 'Bất động sản', group: 'Kinh doanh, Quản lý & Kinh tế' },

    // --- KỸ THUẬT & CÔNG NGHỆ ---
    { code: '7520216', name: 'Kỹ thuật Điều khiển & Tự động hóa', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520201', name: 'Kỹ thuật Điện, Điện tử', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520207', name: 'Kỹ thuật Điện tử - Viễn thông', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520114', name: 'Kỹ thuật Cơ điện tử', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520103', name: 'Kỹ thuật Cơ khí', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520130', name: 'Kỹ thuật Ô tô (Công nghệ Ô tô)', group: 'Kỹ thuật & Công nghệ' },
    { code: '7510605', name: 'Logistics & Quản lý Chuỗi cung ứng', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520301', name: 'Kỹ thuật Hóa học', group: 'Kỹ thuật & Công nghệ' },
    { code: '7580201', name: 'Kỹ thuật Xây dựng', group: 'Kỹ thuật & Công nghệ' },
    { code: '7420201', name: 'Công nghệ Sinh học', group: 'Kỹ thuật & Công nghệ' },
    { code: '7540101', name: 'Công nghệ Thực phẩm', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520320', name: 'Kỹ thuật Môi trường', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520120', name: 'Kỹ thuật Hàng không', group: 'Kỹ thuật & Công nghệ' },
    { code: '7520503', name: 'Kỹ thuật Y sinh', group: 'Kỹ thuật & Công nghệ' },

    // --- Y DƯỢC & SỨC KHỎE ---
    { code: '7720101', name: 'Y khoa (Bác sĩ Đa khoa)', group: 'Y Dược & Sức khỏe' },
    { code: '7720501', name: 'Răng - Hàm - Mặt', group: 'Y Dược & Sức khỏe' },
    { code: '7720201', name: 'Dược học', group: 'Y Dược & Sức khỏe' },
    { code: '7720115', name: 'Y học Cổ truyền', group: 'Y Dược & Sức khỏe' },
    { code: '7720301', name: 'Điều dưỡng', group: 'Y Dược & Sức khỏe' },
    { code: '7720601', name: 'Kỹ thuật Xét nghiệm Y học', group: 'Y Dược & Sức khỏe' },
    { code: '7720603', name: 'Kỹ thuật Phục hồi Chức năng', group: 'Y Dược & Sức khỏe' },
    { code: '7720701', name: 'Y tế Công cộng', group: 'Y Dược & Sức khỏe' },

    // --- LUẬT, TRUYỀN THÔNG & XÃ HỘI NHÂN VĂN ---
    { code: '7380101', name: 'Luật', group: 'Luật, Truyền thông & KHXH' },
    { code: '7380107', name: 'Luật Kinh tế', group: 'Luật, Truyền thông & KHXH' },
    { code: '7380108', name: 'Luật Quốc tế', group: 'Luật, Truyền thông & KHXH' },
    { code: '7320104', name: 'Truyền thông Đa phương tiện', group: 'Luật, Truyền thông & KHXH' },
    { code: '7320108', name: 'Quan hệ Công chúng (PR)', group: 'Luật, Truyền thông & KHXH' },
    { code: '7320101', name: 'Báo chí', group: 'Luật, Truyền thông & KHXH' },
    { code: '7310206', name: 'Quan hệ Quốc tế', group: 'Luật, Truyền thông & KHXH' },
    { code: '7310401', name: 'Tâm lý học', group: 'Luật, Truyền thông & KHXH' },
    { code: '7310608', name: 'Đông phương học', group: 'Luật, Truyền thông & KHXH' },
    { code: '7310630', name: 'Quốc tế học', group: 'Luật, Truyền thông & KHXH' },
    { code: '7310301', name: 'Xã hội học', group: 'Luật, Truyền thông & KHXH' },

    // --- NGÔN NGỮ & VĂN HÓA ---
    { code: '7220201', name: 'Ngôn ngữ Anh', group: 'Ngôn ngữ & Văn hóa' },
    { code: '7220204', name: 'Ngôn ngữ Trung Quốc', group: 'Ngôn ngữ & Văn hóa' },
    { code: '7220209', name: 'Ngôn ngữ Nhật', group: 'Ngôn ngữ & Văn hóa' },
    { code: '7220210', name: 'Ngôn ngữ Hàn Quốc', group: 'Ngôn ngữ & Văn hóa' },
    { code: '7220203', name: 'Ngôn ngữ Pháp', group: 'Ngôn ngữ & Văn hóa' },
    { code: '7220202', name: 'Ngôn ngữ Nga', group: 'Ngôn ngữ & Văn hóa' },

    // --- SƯ PHẠM & GIÁO DỤC ---
    { code: '7140209', name: 'Sư phạm Toán học', group: 'Sư phạm & Giáo dục' },
    { code: '7140217', name: 'Sư phạm Ngữ văn', group: 'Sư phạm & Giáo dục' },
    { code: '7140231', name: 'Sư phạm Tiếng Anh', group: 'Sư phạm & Giáo dục' },
    { code: '7140211', name: 'Sư phạm Vật lí', group: 'Sư phạm & Giáo dục' },
    { code: '7140212', name: 'Sư phạm Hóa học', group: 'Sư phạm & Giáo dục' },
    { code: '7140213', name: 'Sư phạm Sinh học', group: 'Sư phạm & Giáo dục' },
    { code: '7140218', name: 'Sư phạm Lịch sử', group: 'Sư phạm & Giáo dục' },
    { code: '7140219', name: 'Sư phạm Địa lí', group: 'Sư phạm & Giáo dục' },
    { code: '7140202', name: 'Giáo dục Tiểu học', group: 'Sư phạm & Giáo dục' },
    { code: '7140201', name: 'Giáo dục Mầm non', group: 'Sư phạm & Giáo dục' },

    // --- KIẾN TRÚC, MỸ THUẬT & THIẾT KẾ ---
    { code: '7580101', name: 'Kiến trúc', group: 'Kiến trúc & Thiết kế' },
    { code: '7580102', name: 'Kiến trúc Cảnh quan', group: 'Kiến trúc & Thiết kế' },
    { code: '7210403', name: 'Thiết kế Đồ họa', group: 'Kiến trúc & Thiết kế' },
    { code: '7580108', name: 'Thiết kế Nội thất', group: 'Kiến trúc & Thiết kế' },
    { code: '7210404', name: 'Thiết kế Thời trang', group: 'Kiến trúc & Thiết kế' },
    { code: '7210402', name: 'Thiết kế Công nghiệp', group: 'Kiến trúc & Thiết kế' },

    // --- NÔNG LÂM, THỦY SẢN & TÀI NGUYÊN ---
    { code: '7620105', name: 'Chăn nuôi', group: 'Nông lâm & Tài nguyên' },
    { code: '7640101', name: 'Thú y (Bác sĩ Thú y)', group: 'Nông lâm & Tài nguyên' },
    { code: '7620110', name: 'Khoa học Cây trồng (Nông học)', group: 'Nông lâm & Tài nguyên' },
    { code: '7620301', name: 'Nuôi trồng Thủy sản', group: 'Nông lâm & Tài nguyên' },
    { code: '7850101', name: 'Quản lý Đất đai', group: 'Nông lâm & Tài nguyên' },
    { code: '7850103', name: 'Quản lý Tài nguyên & Môi trường', group: 'Nông lâm & Tài nguyên' }
];

/**
 * EditorialMajorSelect - Dropdown chọn Ngành xét tuyển Đại học chuẩn Bộ GD&ĐT
 * Hỗ trợ tìm kiếm theo tên ngành, mã ngành và tự động điền mã ngành
 */
export const EditorialMajorSelect = ({
    label = 'Tên Ngành xét tuyển',
    value = '',
    onChange, // receives (majorName, majorCode)
    onSelectMajor, // optional callback: ({ code, name, group })
    placeholder = 'Chọn Ngành xét tuyển...',
    className = '',
    required = false,
    size = 'md' // 'sm' | 'md'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, openUpward: false });
    const buttonRef = useRef(null);
    const searchInputRef = useRef(null);

    // Find if the current value matches any major in the list
    const matchedMajor = useMemo(() => {
        if (!value) return null;
        return STANDARD_MAJORS.find(
            m => m.name.toLowerCase() === value.toLowerCase() ||
                 m.code.toLowerCase() === value.toLowerCase() ||
                 value.toLowerCase().includes(m.name.toLowerCase())
        );
    }, [value]);

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = spaceBelow < 320 && rect.top > 320;
            const left = Math.max(10, Math.min(rect.left, window.innerWidth - Math.max(rect.width, 360) - 10));
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left,
                width: Math.max(rect.width, 360),
                openUpward: openUp
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target) &&
                !event.target.closest('.editorial-portal-major-select')
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
            setTimeout(() => {
                if (searchInputRef.current) searchInputRef.current.focus();
            }, 50);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [isOpen]);

    // Filtered majors based on search query
    const filteredMajors = useMemo(() => {
        if (!searchQuery.trim()) return STANDARD_MAJORS;
        const q = searchQuery.toLowerCase().trim();
        return STANDARD_MAJORS.filter(m => 
            m.name.toLowerCase().includes(q) ||
            m.code.toLowerCase().includes(q) ||
            m.group.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Group filtered majors by Group
    const groupedMajors = useMemo(() => {
        const groups = {};
        filteredMajors.forEach(m => {
            if (!groups[m.group]) groups[m.group] = [];
            groups[m.group].push(m);
        });
        return groups;
    }, [filteredMajors]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
            setSearchQuery('');
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (major) => {
        onChange?.(major.name, major.code);
        onSelectMajor?.(major);
        setIsOpen(false);
        setIsCustomMode(false);
    };

    const handleSaveCustom = (e) => {
        e.preventDefault();
        if (customValue.trim()) {
            onChange?.(customValue.trim(), '');
            setIsOpen(false);
            setIsCustomMode(false);
        }
    };

    const isSmall = size === 'sm';

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                    {label} {required && <span className="text-brand-jasper">*</span>}
                </label>
            )}

            {/* Selector Trigger Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`w-full bg-white border border-brand-cerulean/30 hover:border-brand-jasper focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper transition-all flex items-center justify-between text-left shadow-xs rounded-xs ${
                    isSmall ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs'
                }`}
            >
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    <BookOpen size={15} className="text-brand-jasper shrink-0" />
                    {value ? (
                        <span className="font-serif font-bold text-brand-cerulean truncate">
                            {value}
                            {matchedMajor && (
                                <span className="ml-1.5 px-1.5 py-0.5 bg-brand-jasper/10 text-brand-jasper text-[10px] font-sans font-bold rounded">
                                    {matchedMajor.code}
                                </span>
                            )}
                        </span>
                    ) : (
                        <span className="text-gray-400 font-body italic truncate">
                            {placeholder}
                        </span>
                    )}
                </div>
                <ChevronDown size={14} className={`text-brand-cerulean/60 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-brand-jasper' : ''}`} />
            </button>

            {/* Portal Dropdown Content */}
            {isOpen && createPortal(
                <div
                    className="editorial-portal-major-select fixed z-[10000] animate-scale-up"
                    style={{
                        ...(coords.openUpward
                            ? { bottom: `${coords.bottom}px` }
                            : { top: `${coords.top}px` }),
                        left: `${coords.left}px`,
                        width: `${coords.width}px`
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-white border-2 border-brand-cerulean shadow-2xl overflow-hidden flex flex-col max-h-[380px] rounded-xs">
                        {/* Header & Search Bar */}
                        <div className="p-2.5 bg-brand-cream border-b border-brand-cerulean/20 space-y-2 shrink-0">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-serif-title font-bold text-brand-cerulean uppercase tracking-wider flex items-center gap-1.5">
                                    <BookOpen size={13} className="text-brand-jasper" />
                                    Danh mục Ngành đào tạo ({STANDARD_MAJORS.length})
                                </span>
                                <span className="text-[10px] text-gray-500 font-serif">
                                    Chuẩn Bộ GD&ĐT
                                </span>
                            </div>

                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-cerulean/60" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm theo tên ngành (CNTT, Y khoa, Kinh tế...) hoặc mã ngành..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-brand-cerulean/30 focus:border-brand-jasper focus:ring-1 focus:ring-brand-jasper text-xs font-body rounded-xs shadow-inner"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-jasper"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List of Majors grouped */}
                        <div className="overflow-y-auto flex-1 p-1.5 space-y-2 custom-scrollbar">
                            {Object.keys(groupedMajors).length === 0 ? (
                                <div className="p-6 text-center text-gray-400 space-y-2">
                                    <p className="text-xs font-serif italic">Không tìm thấy ngành nào khớp với từ khóa "{searchQuery}"</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange?.(searchQuery.trim(), '');
                                            setIsOpen(false);
                                        }}
                                        className="px-3 py-1.5 bg-brand-cerulean text-white text-xs font-bold font-serif-title rounded-xs shadow-xs hover:bg-brand-jasper"
                                    >
                                        Sử dụng "{searchQuery}" làm tên ngành
                                    </button>
                                </div>
                            ) : (
                                Object.entries(groupedMajors).map(([groupName, list]) => (
                                    <div key={groupName} className="space-y-0.5">
                                        <div className="px-2 py-1 bg-brand-cream/60 border-y border-brand-cerulean/10 text-[10px] font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                            {groupName} ({list.length})
                                        </div>

                                        {list.map(m => {
                                            const isSelected = value === m.name || value === m.code;
                                            return (
                                                <button
                                                    key={m.code + m.name}
                                                    type="button"
                                                    onClick={() => handleSelectOption(m)}
                                                    className={`w-full text-left px-2.5 py-2 rounded-xs flex items-center justify-between gap-2 transition-colors ${
                                                        isSelected
                                                            ? 'bg-brand-cerulean text-white font-bold shadow-xs'
                                                            : 'text-gray-800 hover:bg-brand-cream hover:text-brand-cerulean'
                                                    }`}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-xs font-serif-title leading-tight ${isSelected ? 'text-white font-bold' : 'text-brand-cerulean font-bold'}`}>
                                                                {m.name}
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] opacity-80 mt-0.5 font-sans">
                                                            Mã ngành: <strong>{m.code}</strong>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                                            isSelected
                                                                ? 'bg-white/20 text-white border-white/40'
                                                                : 'bg-brand-jasper/10 text-brand-jasper border-brand-jasper/25'
                                                        }`}>
                                                            {m.code}
                                                        </span>
                                                        {isSelected && <Check size={14} className="stroke-[3] text-white" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer with Custom Input fallback */}
                        <div className="p-2 bg-brand-cream border-t border-brand-cerulean/20 flex justify-between items-center text-xs shrink-0">
                            {!isCustomMode ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCustomMode(true);
                                        setCustomValue(value || searchQuery || '');
                                    }}
                                    className="text-[11px] font-bold text-brand-jasper hover:underline flex items-center gap-1"
                                >
                                    + Nhập tên ngành / chuyên ngành khác
                                </button>
                            ) : (
                                <form onSubmit={handleSaveCustom} className="w-full flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        placeholder="Nhập tên ngành / chuyên ngành..."
                                        className="flex-1 px-2 py-1 bg-white border border-brand-cerulean/30 text-xs font-body rounded-xs"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="px-2.5 py-1 bg-brand-cerulean text-white text-[11px] font-bold font-serif-title rounded-xs"
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomMode(false)}
                                        className="px-2 py-1 text-gray-500 text-[11px]"
                                    >
                                        Hủy
                                    </button>
                                </form>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-2.5 py-1 text-gray-500 hover:text-brand-ink text-[11px] font-serif-title font-bold"
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

export default EditorialMajorSelect;
