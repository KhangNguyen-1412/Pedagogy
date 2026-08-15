import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Building2, Search, ChevronDown, Check, X, Sparkles } from 'lucide-react';

/**
 * Danh sách các trường Đại học tại Thành phố Hồ Chí Minh (TP.HCM)
 * Kèm mã trường chuẩn Bộ GD&ĐT và tên viết tắt
 */
export const HCMC_UNIVERSITIES = [
    // --- ĐẠI HỌC QUỐC GIA TP.HCM ---
    { code: 'QSB', name: 'Đại học Bách Khoa - ĐHQG TP.HCM', shortName: 'HCMUT', group: 'ĐHQG TP.HCM' },
    { code: 'QST', name: 'Đại học Khoa học Tự nhiên - ĐHQG TP.HCM', shortName: 'HCMUS', group: 'ĐHQG TP.HCM' },
    { code: 'QSC', name: 'Đại học Công nghệ Thông tin - ĐHQG TP.HCM', shortName: 'UIT', group: 'ĐHQG TP.HCM' },
    { code: 'QSX', name: 'Đại học Khoa học Xã hội và Nhân văn - ĐHQG TP.HCM', shortName: 'USSH', group: 'ĐHQG TP.HCM' },
    { code: 'QSK', name: 'Đại học Kinh tế - Luật - ĐHQG TP.HCM', shortName: 'UEL', group: 'ĐHQG TP.HCM' },
    { code: 'QSG', name: 'Đại học Quốc tế - ĐHQG TP.HCM', shortName: 'IU', group: 'ĐHQG TP.HCM' },
    { code: 'QSY', name: 'Khoa Y / ĐH Khoa học Sức khỏe - ĐHQG TP.HCM', shortName: 'UHS', group: 'ĐHQG TP.HCM' },
    { code: 'QSA', name: 'Đại học An Giang - ĐHQG TP.HCM', shortName: 'AGU', group: 'ĐHQG TP.HCM' },

    // --- TRƯỜNG ĐẠI HỌC CÔNG LẬP TẠI TP.HCM ---
    { code: 'SPK', name: 'Đại học Sư phạm Kỹ thuật TP.HCM', shortName: 'HCMUTE', group: 'Đại học Công lập TP.HCM' },
    { code: 'YDS', name: 'Đại học Y Dược TP.HCM', shortName: 'UMP', group: 'Đại học Công lập TP.HCM' },
    { code: 'TYS', name: 'Đại học Y khoa Phạm Ngọc Thạch', shortName: 'PNTU', group: 'Đại học Công lập TP.HCM' },
    { code: 'KSA', name: 'Đại học Kinh tế TP.HCM', shortName: 'UEH', group: 'Đại học Công lập TP.HCM' },
    { code: 'SPS', name: 'Đại học Sư phạm TP.HCM', shortName: 'HCMUE', group: 'Đại học Công lập TP.HCM' },
    { code: 'LPS', name: 'Đại học Luật TP.HCM', shortName: 'ULAW', group: 'Đại học Công lập TP.HCM' },
    { code: 'NLS', name: 'Đại học Nông Lâm TP.HCM', shortName: 'NLU', group: 'Đại học Công lập TP.HCM' },
    { code: 'GTS', name: 'Đại học Giao thông Vận tải TP.HCM', shortName: 'UTH', group: 'Đại học Công lập TP.HCM' },
    { code: 'GSA', name: 'Đại học Giao thông Vận tải - Phân hiệu TP.HCM', shortName: 'UTC-PH', group: 'Đại học Công lập TP.HCM' },
    { code: 'HUI', name: 'Đại học Công nghiệp TP.HCM', shortName: 'IUH', group: 'Đại học Công lập TP.HCM' },
    { code: 'DCT', name: 'Đại học Công Thương TP.HCM', shortName: 'HUIT', group: 'Đại học Công lập TP.HCM' },
    { code: 'SGD', name: 'Đại học Sài Gòn', shortName: 'SGU', group: 'Đại học Công lập TP.HCM' },
    { code: 'DMS', name: 'Đại học Tài chính - Marketing', shortName: 'UFM', group: 'Đại học Công lập TP.HCM' },
    { code: 'NHS', name: 'Đại học Ngân hàng TP.HCM', shortName: 'HUB', group: 'Đại học Công lập TP.HCM' },
    { code: 'MBS', name: 'Đại học Mở TP.HCM', shortName: 'HCMCOU', group: 'Đại học Công lập TP.HCM' },
    { code: 'KTS', name: 'Đại học Kiến trúc TP.HCM', shortName: 'UAH', group: 'Đại học Công lập TP.HCM' },
    { code: 'MTS', name: 'Đại học Mỹ thuật TP.HCM', shortName: 'HCMUFA', group: 'Đại học Công lập TP.HCM' },
    { code: 'TDS', name: 'Đại học Thể dục Thể thao TP.HCM', shortName: 'USH', group: 'Đại học Công lập TP.HCM' },
    { code: 'BVS', name: 'Học viện Công nghệ Bưu chính Viễn thông - Cơ sở TP.HCM', shortName: 'PTIT', group: 'Đại học Công lập TP.HCM' },
    { code: 'HVC', name: 'Học viện Cán bộ TP.HCM', shortName: 'HVC', group: 'Đại học Công lập TP.HCM' },
    { code: 'HHK', name: 'Học viện Hàng không Việt Nam', shortName: 'VAA', group: 'Đại học Công lập TP.HCM' },
    { code: 'NTS', name: 'Đại học Ngoại thương - Cơ sở II TP.HCM', shortName: 'FTU2', group: 'Đại học Công lập TP.HCM' },
    { code: 'DTT', name: 'Đại học Tôn Đức Thắng', shortName: 'TDTU', group: 'Đại học Công lập TP.HCM' },
    { code: 'DTM', name: 'Đại học Tài nguyên và Môi trường TP.HCM', shortName: 'HCMUNRE', group: 'Đại học Công lập TP.HCM' },
    { code: 'VHS', name: 'Đại học Văn hóa TP.HCM', shortName: 'HCMUC', group: 'Đại học Công lập TP.HCM' },

    // --- TRƯỜNG ĐẠI HỌC NGOÀI CÔNG LẬP & QUỐC TẾ TẠI TP.HCM ---
    { code: 'FPT', name: 'Đại học FPT TP.HCM', shortName: 'FPTU', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'RMU', name: 'Đại học RMIT Việt Nam (Cơ sở Nam Sài Gòn)', shortName: 'RMIT', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'FUV', name: 'Đại học Fulbright Việt Nam', shortName: 'Fulbright', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'HIU', name: 'Đại học Quốc tế Hồng Bàng', shortName: 'HIU', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'HSU', name: 'Đại học Hoa Sen', shortName: 'HSU', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'UEF', name: 'Đại học Kinh tế - Tài chính TP.HCM', shortName: 'UEF', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'DKC', name: 'Đại học Công nghệ TP.HCM (HUTECH)', shortName: 'HUTECH', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'VLU', name: 'Đại học Văn Lang', shortName: 'VLU', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'NTT', name: 'Đại học Nguyễn Tất Thành', shortName: 'NTTU', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'SIU', name: 'Đại học Quốc tế Sài Gòn', shortName: 'SIU', group: 'Ngoài Công lập & Quốc tế TP.HCM' },
    { code: 'GDU', name: 'Đại học Gia Định', shortName: 'GDU', group: 'Ngoài Công lập & Quốc tế TP.HCM' }
];

/**
 * EditorialUniversitySelect - Dropdown chọn trường Đại học tại TP.HCM
 * Hỗ trợ tìm kiếm theo tên, mã trường, từ khóa viết tắt và tự động điền mã trường
 */
export const EditorialUniversitySelect = ({
    label = 'Tên trường Đại học (TP.HCM)',
    value = '',
    onChange, // receives (universityName, universityCode)
    onSelectUniversity, // optional callback: ({ code, name, shortName })
    placeholder = 'Chọn trường Đại học tại TP.HCM...',
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

    // Find if the current value matches any school in the list
    const matchedUniversity = useMemo(() => {
        if (!value) return null;
        return HCMC_UNIVERSITIES.find(
            u => u.name.toLowerCase() === value.toLowerCase() ||
                 u.code.toLowerCase() === value.toLowerCase() ||
                 value.toLowerCase().includes(u.name.toLowerCase())
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
                !event.target.closest('.editorial-portal-university-select')
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
            // Focus search input when opened
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

    // Filtered universities based on search query
    const filteredUniversities = useMemo(() => {
        if (!searchQuery.trim()) return HCMC_UNIVERSITIES;
        const q = searchQuery.toLowerCase().trim();
        return HCMC_UNIVERSITIES.filter(u => 
            u.name.toLowerCase().includes(q) ||
            u.code.toLowerCase().includes(q) ||
            (u.shortName && u.shortName.toLowerCase().includes(q)) ||
            u.group.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Group filtered universities by Group
    const groupedUniversities = useMemo(() => {
        const groups = {};
        filteredUniversities.forEach(u => {
            if (!groups[u.group]) groups[u.group] = [];
            groups[u.group].push(u);
        });
        return groups;
    }, [filteredUniversities]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
            setSearchQuery('');
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (univ) => {
        onChange?.(univ.name, univ.code);
        onSelectUniversity?.(univ);
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
                    <Building2 size={15} className="text-brand-jasper shrink-0" />
                    {value ? (
                        <span className="font-serif font-bold text-brand-cerulean truncate">
                            {value}
                            {matchedUniversity && (
                                <span className="ml-1.5 px-1.5 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-[10px] font-sans font-bold rounded">
                                    {matchedUniversity.code}
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
                    className="editorial-portal-university-select fixed z-[10000] animate-scale-up"
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
                                    <Building2 size={13} className="text-brand-jasper" />
                                    Danh sách Trường ĐH TP.HCM ({HCMC_UNIVERSITIES.length})
                                </span>
                                <span className="text-[10px] text-gray-500 font-serif">
                                    Kèm mã trường
                                </span>
                            </div>

                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-cerulean/60" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm theo tên trường, mã (QSB, UIT, KSA...) hoặc tên tắt..."
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

                        {/* List of Universities grouped */}
                        <div className="overflow-y-auto flex-1 p-1.5 space-y-2 custom-scrollbar">
                            {Object.keys(groupedUniversities).length === 0 ? (
                                <div className="p-6 text-center text-gray-400 space-y-2">
                                    <p className="text-xs font-serif italic">Không tìm thấy trường nào khớp với từ khóa "{searchQuery}"</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange?.(searchQuery.trim(), '');
                                            setIsOpen(false);
                                        }}
                                        className="px-3 py-1.5 bg-brand-cerulean text-white text-xs font-bold font-serif-title rounded-xs shadow-xs hover:bg-brand-jasper"
                                    >
                                        Sử dụng "{searchQuery}" làm tên trường
                                    </button>
                                </div>
                            ) : (
                                Object.entries(groupedUniversities).map(([groupName, list]) => (
                                    <div key={groupName} className="space-y-0.5">
                                        <div className="px-2 py-1 bg-brand-cream/60 border-y border-brand-cerulean/10 text-[10px] font-serif-title font-bold text-brand-cerulean uppercase tracking-wider">
                                            {groupName} ({list.length})
                                        </div>

                                        {list.map(u => {
                                            const isSelected = value === u.name || value === u.code;
                                            return (
                                                <button
                                                    key={u.code}
                                                    type="button"
                                                    onClick={() => handleSelectOption(u)}
                                                    className={`w-full text-left px-2.5 py-2 rounded-xs flex items-center justify-between gap-2 transition-colors ${
                                                        isSelected
                                                            ? 'bg-brand-cerulean text-white font-bold shadow-xs'
                                                            : 'text-gray-800 hover:bg-brand-cream hover:text-brand-cerulean'
                                                    }`}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-xs font-serif-title leading-tight ${isSelected ? 'text-white font-bold' : 'text-brand-cerulean font-bold'}`}>
                                                                {u.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] opacity-80 mt-0.5 font-sans">
                                                            <span>Mã trường: <strong>{u.code}</strong></span>
                                                            {u.shortName && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>Tên viết tắt: <strong>{u.shortName}</strong></span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                                            isSelected
                                                                ? 'bg-white/20 text-white border-white/40'
                                                                : 'bg-brand-jasper/10 text-brand-jasper border-brand-jasper/25'
                                                        }`}>
                                                            {u.code}
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
                                    + Nhập tên trường Đại học khác ngoài TP.HCM
                                </button>
                            ) : (
                                <form onSubmit={handleSaveCustom} className="w-full flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        placeholder="Nhập tên trường khác..."
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

export default EditorialUniversitySelect;
