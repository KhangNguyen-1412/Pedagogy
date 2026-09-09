import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Calendar,
    Award,
    FolderOpen,
    School,
    Layers,
    ShieldCheck,
    GraduationCap,
    Printer,
    User,
    LogOut,
    LogIn,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const SidebarNavigation = ({
    currentView,
    navigate,
    isSidebarCollapsed,
    toggleSidebar,
    profile,
    currentUser,
    handleGoogleSignIn,
    handleSignOut
}) => {
    return (
        <aside
            className={`bg-brand-cream border-r border-brand-cerulean/20 h-full flex flex-col justify-between transition-all duration-300 relative shadow-sm z-30 shrink-0 ${
                isSidebarCollapsed ? 'w-20 p-3' : 'w-72 p-5 md:p-6'
            }`}
        >
            {/* Collapse Toggle Button (Desktop floating tab) */}
            <button
                type="button"
                onClick={toggleSidebar}
                className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-white border border-brand-cerulean/30 shadow-sm flex items-center justify-center text-brand-cerulean hover:text-brand-jasper hover:border-brand-jasper transition-all z-20"
                title={isSidebarCollapsed ? "Mở rộng thanh điều hướng (Ctrl+B)" : "Thu nhỏ thanh điều hướng (Ctrl+B)"}
            >
                {isSidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>

            {/* Header / Logo -> Click to open Landing & About Page */}
            <div 
                onClick={() => navigate('landing')}
                className={`mb-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} cursor-pointer group select-none`}
                title="Xem trang giới thiệu & thông tin chương trình"
            >
                <img 
                    src={logoImg} 
                    alt="Pedagogy Logo" 
                    className={`${isSidebarCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-full shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md shrink-0 border border-brand-cerulean/10`}
                />
                {!isSidebarCollapsed && (
                    <div className="min-w-0">
                        <h1 className="font-serif-title text-3xl text-brand-cerulean tracking-tight truncate group-hover:text-brand-jasper transition-colors font-bold">
                            Pedagogy.
                        </h1>
                        <p className="text-xs italic text-gray-500 mt-0.5 font-body truncate group-hover:text-gray-700 transition-colors">
                            Personal Learning Management
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-0.5 custom-scrollbar">
                {/* Dashboard (Tổng quan) */}
                {(() => {
                    const item = { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard };
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.id)}
                            title={isSidebarCollapsed ? item.label : undefined}
                            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                                isActive
                                    ? isSidebarCollapsed 
                                        ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                        : 'text-brand-jasper font-bold border-brand-jasper'
                                    : isSidebarCollapsed
                                        ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                        : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                            }`}
                        >
                            <Icon size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                            {!isSidebarCollapsed && <span className="text-base truncate">{item.label}</span>}
                        </button>
                    );
                })()}

                {/* Khóa đào tạo Suite */}
                <div className={`pt-2 border-t border-brand-cerulean/15 space-y-1.5 ${isSidebarCollapsed ? 'mt-2' : ''}`}>
                    {!isSidebarCollapsed ? (
                        <span className="px-1 text-[10px] font-serif-title uppercase tracking-widest text-brand-cerulean/70 font-bold block mb-1">
                            Khóa đào tạo
                        </span>
                    ) : (
                        <div className="w-full flex justify-center py-1" title="Khóa đào tạo">
                            <div className="w-6 h-0.5 bg-brand-cerulean/20 rounded-full" />
                        </div>
                    )}

                    {[
                        { id: 'programs', match: ['programs', 'program_detail'], label: 'Chương trình học', icon: BookOpen },
                        { id: 'syllabus', label: 'Đề cương chi tiết', icon: FileText },
                        { id: 'calendar', label: 'Lịch biểu & Điểm danh', icon: Calendar },
                        { id: 'gradebook', label: 'Sổ điểm & GPA', icon: Award },
                        { id: 'resources', label: 'Học liệu & Nhật ký', icon: FolderOpen },
                    ].map(item => {
                        const Icon = item.icon;
                        const isActive = item.match ? item.match.includes(currentView) : currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                title={isSidebarCollapsed ? item.label : undefined}
                                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                                    isActive
                                        ? isSidebarCollapsed 
                                            ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                            : 'text-brand-jasper font-bold border-brand-jasper'
                                        : isSidebarCollapsed
                                            ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                            : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                                }`}
                            >
                                <Icon size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                                {!isSidebarCollapsed && <span className="text-base truncate">{item.label}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Nghiệp vụ Sư phạm Suite */}
                <div className={`pt-2 border-t border-brand-cerulean/15 space-y-1.5 ${isSidebarCollapsed ? 'mt-2' : ''}`}>
                    {!isSidebarCollapsed ? (
                        <span className="px-1 text-[10px] font-serif-title uppercase tracking-widest text-brand-cerulean/70 font-bold block mb-1">
                            Nghiệp vụ Sư phạm
                        </span>
                    ) : (
                        <div className="w-full flex justify-center py-1" title="Nghiệp vụ Sư phạm">
                            <div className="w-6 h-0.5 bg-brand-cerulean/20 rounded-full" />
                        </div>
                    )}

                    {[
                        { id: 'practicum', label: 'Thực tập sư phạm', icon: School },
                        { id: 'lesson_plans', label: 'Giáo án & Giảng thử', icon: Layers },
                        { id: 'competencies', label: 'Chuẩn nghề nghiệp', icon: ShieldCheck },
                        { id: 'graduation', label: 'Xét tốt nghiệp', icon: GraduationCap },
                        { id: 'portfolio_export', label: 'Hồ sơ & Bảng điểm', icon: Printer },
                    ].map(item => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                title={isSidebarCollapsed ? item.label : undefined}
                                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                                    isActive
                                        ? isSidebarCollapsed 
                                            ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                            : 'text-brand-jasper font-bold border-brand-jasper'
                                        : isSidebarCollapsed
                                            ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                            : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                                }`}
                            >
                                <Icon size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                                {!isSidebarCollapsed && <span className="text-base truncate">{item.label}</span>}
                            </button>
                        );
                    })}
                </div>



                {/* Profile Link */}
                <div className="pt-2 border-t border-brand-cerulean/15">
                    <button
                        onClick={() => navigate('profile')}
                        title={isSidebarCollapsed ? 'Hồ sơ cá nhân' : undefined}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-2.5 rounded-lg' : 'gap-3 py-2 px-1 text-left border-b'} transition-all ${
                            currentView === 'profile'
                                ? isSidebarCollapsed 
                                    ? 'bg-brand-jasper text-white font-bold shadow-xs' 
                                    : 'text-brand-jasper font-bold border-brand-jasper'
                                : isSidebarCollapsed
                                    ? 'text-brand-cerulean hover:bg-brand-cerulean/10'
                                    : 'text-brand-cerulean border-transparent hover:border-brand-jasper hover:text-brand-jasper'
                        }`}
                    >
                        <User size={isSidebarCollapsed ? 20 : 18} className="shrink-0" />
                        {!isSidebarCollapsed && <span className="text-base truncate">Hồ sơ cá nhân</span>}
                    </button>
                </div>
            </nav>

            {/* Footer User Info */}
            {profile && (
                <div className={`mt-auto pt-3 border-t border-brand-cerulean/20 ${isSidebarCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                    {!isSidebarCollapsed ? (
                        <>
                            <p className="font-serif-title text-brand-cerulean truncate font-bold text-sm">{profile.fullName || 'Học Viên'}</p>
                            <p className="text-xs font-sans text-gray-500 truncate mb-2">{profile.email || currentUser?.email || ''}</p>
                            
                            {currentUser ? (
                                <button 
                                    onClick={handleSignOut} 
                                    className="text-xs font-bold text-brand-jasper hover:underline flex items-center gap-1.5"
                                >
                                    <LogOut size={13} /> Đăng xuất
                                </button>
                            ) : (
                                <button 
                                    onClick={handleGoogleSignIn} 
                                    className="text-xs font-bold text-brand-cerulean hover:underline flex items-center gap-1.5"
                                >
                                    <LogIn size={13} /> Đăng nhập Google
                                </button>
                            )}
                        </>
                    ) : (
                        currentUser ? (
                            <button 
                                onClick={handleSignOut} 
                                title="Đăng xuất"
                                className="p-2 text-brand-jasper hover:bg-red-50 rounded-full transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        ) : (
                            <button 
                                onClick={handleGoogleSignIn} 
                                title="Đăng nhập Google"
                                className="p-2 text-brand-cerulean hover:bg-brand-cerulean/10 rounded-full transition-colors"
                            >
                                <LogIn size={16} />
                            </button>
                        )
                    )}
                </div>
            )}
        </aside>
    );
};
