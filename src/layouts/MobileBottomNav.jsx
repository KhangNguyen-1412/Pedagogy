import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    Award,
    School,
    FileText,
    FolderOpen,
    Layers,
    ShieldCheck,
    GraduationCap,
    Printer,
    User,
    MoreHorizontal,
    X,
    LogOut,
    ChevronRight,
} from 'lucide-react';

export const MobileBottomNav = ({
    currentView,
    navigate,
    profile,
    currentUser,
    handleSignOut,
}) => {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const navRef = useRef(null);
    const tabRefs = useRef({});
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });
    const [indicatorReady, setIndicatorReady] = useState(false);

    // Tính toán vị trí indicator dựa trên tab active
    const updateIndicator = useCallback(() => {
        const activeTabId = primaryTabs.find(t => {
            if (t.id === '_more') {
                const allMoreIds = moreGroups.flatMap(g => g.items.map(i => i.id));
                return allMoreIds.includes(currentView);
            }
            if (t.match) return t.match.includes(currentView);
            return currentView === t.id;
        })?.id || 'dashboard';

        const tabEl = tabRefs.current[activeTabId];
        const navEl = navRef.current;
        if (tabEl && navEl) {
            const navRect = navEl.getBoundingClientRect();
            const tabRect = tabEl.getBoundingClientRect();
            setIndicator({
                left: tabRect.left - navRect.left,
                width: tabRect.width,
            });
            // Bật transition sau lần render đầu tiên
            if (!indicatorReady) {
                requestAnimationFrame(() => setIndicatorReady(true));
            }
        }
    }, [currentView, indicatorReady]);

    useEffect(() => {
        updateIndicator();
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator]);

    // 5 mục chính hiển thị trực tiếp trên bottom bar
    const primaryTabs = [
        { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
        { id: 'programs', label: 'Khóa học', icon: BookOpen, match: ['programs', 'program_detail', 'module_detail'] },
        { id: 'calendar', label: 'Lịch biểu', icon: Calendar },
        { id: 'gradebook', label: 'Sổ điểm', icon: Award },
        { id: '_more', label: 'Thêm', icon: MoreHorizontal },
    ];

    // Các mục trong menu "Thêm"
    const moreGroups = [
        {
            title: 'Khóa đào tạo',
            items: [
                { id: 'syllabus', label: 'Đề cương chi tiết', icon: FileText },
                { id: 'resources', label: 'Học liệu & Nhật ký', icon: FolderOpen },
            ]
        },
        {
            title: 'Nghiệp vụ Sư phạm',
            items: [
                { id: 'practicum', label: 'Thực tập sư phạm', icon: School },
                { id: 'lesson_plans', label: 'Giáo án & Giảng thử', icon: Layers },
                { id: 'competencies', label: 'Chuẩn nghề nghiệp', icon: ShieldCheck },
                { id: 'graduation', label: 'Xét tốt nghiệp', icon: GraduationCap },
                { id: 'portfolio_export', label: 'Hồ sơ & Bảng điểm', icon: Printer },
            ]
        },
        {
            title: 'Tài khoản',
            items: [
                { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
            ]
        },
    ];

    const handleTabPress = (tab) => {
        if (tab.id === '_more') {
            setIsMoreOpen(true);
            return;
        }
        setIsMoreOpen(false);
        navigate(tab.id);
    };

    const handleMoreItemPress = (id) => {
        setIsMoreOpen(false);
        navigate(id);
    };

    const isTabActive = (tab) => {
        if (tab.id === '_more') {
            // Highlight "Thêm" khi đang ở view thuộc menu mở rộng
            const allMoreIds = moreGroups.flatMap(g => g.items.map(i => i.id));
            return isMoreOpen || allMoreIds.includes(currentView);
        }
        if (tab.match) return tab.match.includes(currentView);
        return currentView === tab.id;
    };

    return (
        <>
            {/* Overlay backdrop khi mở menu "Thêm" */}
            {isMoreOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-[59] animate-backdrop-in"
                    onClick={() => setIsMoreOpen(false)}
                />
            )}

            {/* Drawer menu "Thêm" trượt lên từ dưới */}
            <div
                className={`md:hidden fixed bottom-[72px] left-3 right-3 z-[60] transition-all duration-300 ease-out ${
                    isMoreOpen
                        ? 'translate-y-0 opacity-100 pointer-events-auto'
                        : 'translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                <div className="bg-brand-cream border border-brand-cerulean/10 rounded-2xl shadow-2xl max-h-[65vh] overflow-y-auto">
                    {/* Header Drawer */}
                    <div className="sticky top-0 bg-brand-cream/95 backdrop-blur-sm px-5 pt-4 pb-3 flex items-center justify-between border-b border-brand-cerulean/10 z-10">
                        <h3 className="font-serif-title text-lg font-bold text-brand-cerulean">
                            Điều hướng
                        </h3>
                        <button
                            onClick={() => setIsMoreOpen(false)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-brand-jasper hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Nội dung Drawer */}
                    <div className="px-4 py-3 space-y-4">
                        {moreGroups.map((group) => (
                            <div key={group.title}>
                                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-cerulean/60 px-1 mb-1.5">
                                    {group.title}
                                </p>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = currentView === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleMoreItemPress(item.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                                                    isActive
                                                        ? 'bg-brand-cerulean text-white font-bold shadow-xs'
                                                        : 'text-gray-700 hover:bg-brand-cerulean/5'
                                                }`}
                                            >
                                                <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-brand-cerulean'}`} />
                                                <span className="text-sm font-serif flex-1 text-left">{item.label}</span>
                                                <ChevronRight size={14} className={`shrink-0 ${isActive ? 'text-white/60' : 'text-gray-400'}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Nút đăng xuất nếu đã đăng nhập */}
                        {currentUser && handleSignOut && (
                            <div className="pt-2 border-t border-brand-cerulean/10">
                                <button
                                    onClick={() => { setIsMoreOpen(false); handleSignOut(); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-jasper hover:bg-red-50 transition-all cursor-pointer"
                                >
                                    <LogOut size={18} className="shrink-0" />
                                    <span className="text-sm font-serif font-bold">Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Spacer tránh bị che bởi bottom bar */}
                    <div className="h-2" />
                </div>
            </div>

            {/* BOTTOM NAVIGATION BAR — Floating */}
            <nav ref={navRef} className="md:hidden fixed bottom-3 left-3 right-3 z-[61] bg-white/90 backdrop-blur-xl border border-brand-cerulean/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
                {/* Sliding pill indicator */}
                <div
                    className="absolute top-1.5 h-[calc(100%-12px)] rounded-xl bg-brand-jasper/10 pointer-events-none"
                    style={{
                        left: indicator.left,
                        width: indicator.width,
                        transition: indicatorReady ? 'left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)' : 'none',
                    }}
                />
                {/* Safe area padding cho iPhone X+ */}
                <div className="flex items-stretch justify-around h-[56px] px-2 pb-[env(safe-area-inset-bottom,0px)] relative">
                    {primaryTabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isTabActive(tab);
                        return (
                            <button
                                key={tab.id}
                                ref={el => tabRefs.current[tab.id] = el}
                                onClick={() => handleTabPress(tab)}
                                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 cursor-pointer relative z-[1] ${
                                    active
                                        ? 'text-brand-jasper'
                                        : 'text-gray-500 active:text-brand-cerulean'
                                }`}
                                style={{ transition: 'color 0.25s ease' }}
                            >
                                <Icon
                                    size={22}
                                    strokeWidth={active ? 2.5 : 1.8}
                                    style={{ transition: 'stroke-width 0.25s ease, transform 0.25s ease', transform: active ? 'scale(1.1)' : 'scale(1)' }}
                                />
                                <span className={`text-[10px] leading-tight font-sans transition-all ${active ? 'font-bold' : 'font-medium'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};
