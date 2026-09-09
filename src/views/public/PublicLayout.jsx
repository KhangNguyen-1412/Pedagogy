import React, { useState } from 'react';
import {
    Menu,
    X,
    ArrowRight,
    GraduationCap,
    BookOpen,
    ShieldCheck,
    Phone,
    Mail,
    MapPin,
    ExternalLink,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    User,
    LogOut,
    LogIn
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const PublicLayout = ({
    currentView,
    navigate,
    currentUser,
    handleGoogleSignIn,
    handleSignOut,
    handleEnterLMS,
    children
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'landing', label: 'Trang chủ' },
        { id: 'about', label: 'Giới thiệu' },
        { id: 'features', label: 'Đặc điểm & Chức năng' },
        { id: 'history', label: 'Lịch sử Chứng chỉ NVSP' },
        { id: 'contact', label: 'Liên hệ' }
    ];

    const handleNav = (viewId) => {
        setIsMobileMenuOpen(false);
        navigate(viewId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-brand-cream text-[#1A1A1A] flex flex-col font-serif selection:bg-brand-jasper/20 selection:text-brand-jasper">
            {/* MINIMALIST EDITORIAL HEADER */}
            <header className="sticky top-0 z-40 bg-brand-cream/90 backdrop-blur-md border-b border-brand-cerulean/15 transition-all">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Brand Logo & Name */}
                    <div 
                        onClick={() => handleNav('landing')}
                        className="flex items-center gap-2.5 cursor-pointer group select-none"
                        title="Về trang chủ Pedagogy"
                    >
                        <img 
                            src={logoImg} 
                            alt="Pedagogy Logo" 
                            className="w-8 h-8 rounded-full border border-brand-cerulean/15 shadow-xs group-hover:scale-105 transition-transform" 
                        />
                        <span className="font-serif-title text-2xl text-brand-cerulean tracking-tight font-bold group-hover:text-brand-jasper transition-colors">
                            Pedagogy.
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 font-serif text-sm">
                        {navItems.map(item => {
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className={`relative py-1 transition-colors ${
                                        isActive
                                            ? 'text-brand-jasper font-bold'
                                            : 'text-gray-700 hover:text-brand-cerulean'
                                    }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand-jasper rounded-full"></span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right CTA Action */}
                    <div className="hidden sm:flex items-center gap-2.5">
                        {currentUser ? (
                            <>
                                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-sans pr-1">
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-brand-cerulean/20" />
                                    ) : (
                                        <User size={14} className="text-brand-cerulean" />
                                    )}
                                    <span className="max-w-[110px] truncate font-semibold">{currentUser.displayName || 'Học viên'}</span>
                                </div>
                                <button
                                    onClick={() => (handleEnterLMS ? handleEnterLMS() : navigate('dashboard'))}
                                    className="px-3.5 py-1.5 bg-brand-cerulean text-white hover:bg-brand-cerulean/90 font-serif text-xs font-semibold tracking-wide transition-all rounded-xs flex items-center gap-1.5 shadow-xs"
                                >
                                    <span>Bảng điều khiển</span>
                                    <ArrowRight size={13} />
                                </button>
                                {handleSignOut && (
                                    <button
                                        onClick={handleSignOut}
                                        className="text-gray-400 hover:text-brand-jasper p-1 transition-colors"
                                        title="Đăng xuất khỏi hệ thống"
                                    >
                                        <LogOut size={15} />
                                    </button>
                                )}
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('login')}
                                className="px-4 py-1.5 border border-brand-cerulean bg-brand-cerulean text-white hover:bg-brand-cerulean/90 font-serif text-xs font-semibold tracking-wide transition-all rounded-xs flex items-center gap-1.5 shadow-xs"
                                title="Đăng nhập để vào trang quản trị"
                            >
                                <User size={13} />
                                <span>Đăng nhập</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-1.5 text-brand-cerulean hover:text-brand-jasper transition-colors"
                        aria-label="Mở thực đơn"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-brand-cream border-b border-brand-cerulean/20 px-4 py-3 space-y-1 animate-fade-in-down">
                        {navItems.map(item => {
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className={`w-full text-left py-2 px-3 rounded-xs font-serif text-sm flex items-center justify-between transition-colors ${
                                        isActive
                                            ? 'bg-brand-cerulean text-white font-bold'
                                            : 'text-gray-800 hover:bg-brand-cerulean/10'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && <CheckCircle2 size={14} />}
                                </button>
                            );
                        })}
                        <div className="pt-2.5 border-t border-brand-cerulean/15 space-y-2">
                            {currentUser ? (
                                <>
                                    <div className="flex items-center justify-between text-xs text-gray-700 px-2">
                                        <span className="font-semibold truncate">{currentUser.displayName || currentUser.email}</span>
                                        {handleSignOut && (
                                            <button onClick={handleSignOut} className="text-brand-jasper font-bold text-xs hover:underline flex items-center gap-1">
                                                <LogOut size={12} /> Đăng xuất
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            navigate('dashboard');
                                        }}
                                        className="w-full py-2 bg-brand-cerulean text-white font-serif text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 rounded-xs shadow-xs"
                                    >
                                        <span>Vào Bảng Điều Khiển LMS</span>
                                        <ArrowRight size={13} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('login');
                                    }}
                                    className="w-full py-2.5 bg-brand-cerulean text-white font-serif text-xs font-bold tracking-wide flex items-center justify-center gap-2 rounded-xs shadow-xs"
                                >
                                    <User size={14} />
                                    <span>Đăng nhập vào Quản trị</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT AREA WITH PAGE TRANSITION */}
            <main key={currentView} className="flex-1 animate-page-enter">
                {children}
            </main>

            {/* MINIMALIST EDITORIAL FOOTER */}
            <footer className="bg-white border-t border-brand-cerulean/20 pt-14 pb-10 text-gray-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-cerulean/15">
                        {/* Brand Column */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <img src={logoImg} alt="Pedagogy Logo" className="w-9 h-9 rounded-full border border-brand-cerulean/20" />
                                <span className="font-serif-title text-2xl text-brand-cerulean font-bold">Pedagogy.</span>
                            </div>
                            <p className="font-body text-sm leading-relaxed text-gray-600">
                                Nền tảng số hóa quản lý học tập và rèn luyện nghiệp vụ sư phạm cá nhân hóa, xây dựng theo chuẩn chương trình của Bộ Giáo dục & Đào tạo.
                            </p>
                            <div className="text-xs font-sans text-brand-cerulean/80 space-y-1">
                                <p className="font-bold">Đơn vị bồi dưỡng liên kết:</p>
                                <p>Trường Đại học Sư phạm TP. Hồ Chí Minh</p>
                            </div>
                        </div>

                        {/* Navigation Column */}
                        <div className="space-y-3">
                            <h3 className="font-serif-title text-base font-bold text-brand-cerulean uppercase tracking-wider pb-1 border-b border-brand-cerulean/10">
                                Cổng Thông Tin
                            </h3>
                            <ul className="space-y-2 text-sm font-sans">
                                <li>
                                    <button onClick={() => handleNav('landing')} className="hover:text-brand-jasper transition-colors">
                                        Trang chủ
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleNav('about')} className="hover:text-brand-jasper transition-colors">
                                        Về chương trình bồi dưỡng
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleNav('features')} className="hover:text-brand-jasper transition-colors">
                                        10 Phân hệ chức năng
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleNav('history')} className="hover:text-brand-jasper transition-colors">
                                        Lịch sử & Căn cứ pháp lý
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleNav('contact')} className="hover:text-brand-jasper transition-colors">
                                        Tư vấn tuyển sinh & Liên hệ
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Regulatory Framework */}
                        <div className="space-y-3">
                            <h3 className="font-serif-title text-base font-bold text-brand-cerulean uppercase tracking-wider pb-1 border-b border-brand-cerulean/10">
                                Căn Cứ Pháp Lý
                            </h3>
                            <ul className="space-y-2 text-xs font-sans leading-relaxed text-gray-600">
                                <li className="hover:text-brand-cerulean">
                                    <strong>Luật Giáo dục 2019:</strong> Điều 72 về Chuẩn trình độ đào tạo của nhà giáo.
                                </li>
                                <li className="hover:text-brand-cerulean">
                                    <strong>Thông tư 11/2021/TT-BGDĐT:</strong> Chương trình bồi dưỡng NVSP giáo viên THCS.
                                </li>
                                <li className="hover:text-brand-cerulean">
                                    <strong>Thông tư 12/2021/TT-BGDĐT:</strong> Chương trình bồi dưỡng NVSP giáo viên THPT.
                                </li>
                                <li className="hover:text-brand-cerulean">
                                    <strong>Thông tư 20/2018/TT-BGDĐT:</strong> Chuẩn nghề nghiệp giáo viên cơ sở phổ thông.
                                </li>
                                <li className="hover:text-brand-cerulean">
                                    <strong>Công văn 5512/BGDĐT-GDTrH:</strong> Xây dựng và tổ chức kế hoạch bài dạy.
                                </li>
                            </ul>
                        </div>

                        {/* Contact info column */}
                        <div className="space-y-3">
                            <h3 className="font-serif-title text-base font-bold text-brand-cerulean uppercase tracking-wider pb-1 border-b border-brand-cerulean/10">
                                Trụ Sở & Liên Hệ
                            </h3>
                            <div className="space-y-2.5 text-xs font-sans text-gray-600">
                                <div className="flex items-start gap-2">
                                    <MapPin size={15} className="text-brand-cerulean shrink-0 mt-0.5" />
                                    <span>280 An Dương Vương, Phường 4, Quận 5, TP. Hồ Chí Minh</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={15} className="text-brand-cerulean shrink-0" />
                                    <span>(028) 3835 2020 • Hotline: 0903 141 202</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={15} className="text-brand-cerulean shrink-0" />
                                    <span>nvsp@hcmue.edu.vn</span>
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={() => handleNav('contact')}
                                        className="w-full py-2 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean font-bold text-center hover:bg-brand-cerulean hover:text-white transition-all text-xs"
                                    >
                                        Gửi thư tư vấn trực tuyến
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom copyright line */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-gray-500">
                        <p>© 2026 Pedagogy Personal Learning Management. Thiết kế chuẩn phong cách Editorial tối giản.</p>
                        <div className="flex items-center gap-4">
                            <button onClick={() => handleNav('history')} className="hover:underline">Pháp lý khóa học</button>
                            <span>•</span>
                            <button onClick={() => handleNav('features')} className="hover:underline">Tính năng LMS</button>
                            <span>•</span>
                            <button
                                onClick={() => navigate(currentUser ? 'dashboard' : 'login')}
                                className="hover:underline font-bold text-brand-cerulean"
                            >
                                {currentUser ? 'Bảng điều khiển →' : 'Đăng nhập Quản trị →'}
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
