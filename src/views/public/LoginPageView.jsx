import React from 'react';
import { ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const LoginPageView = ({
    navigate,
    handleGoogleSignIn,
    authLoadingState,
    error,
    setError
}) => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-brand-cream">
            {/* CỘT TRÁI: HÌNH ẢNH & TRÍCH DẪN (Giữ nguyên Split Screen) */}
            <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden shadow-2xl z-10">
                {/* Hình ảnh nền */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop')" }}
                ></div>
                
                {/* Lớp phủ màu Xanh Cerulean đậm */}
                <div className="absolute inset-0 bg-brand-cerulean/90 mix-blend-multiply"></div>

                {/* Top: Logo & Back Link */}
                <div className="relative z-10 flex items-center justify-between">
                    <button
                        onClick={() => navigate('landing')}
                        className="inline-flex items-center gap-2 text-brand-cream/80 hover:text-white font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        <span>Về Trang Giới Thiệu</span>
                    </button>
                    <span className="text-xs font-sans text-brand-cream/60 uppercase tracking-widest">
                        Cổng Xác Thực 2026
                    </span>
                </div>

                {/* Middle: Câu trích dẫn triết lý giáo dục */}
                <div className="relative z-10 text-white max-w-md py-12 space-y-6">
                    <div className="w-12 h-1 bg-brand-jasper rounded-full"></div>
                    <p className="text-3xl font-serif-title leading-snug text-brand-cream">
                        "Giáo dục không phải là việc đổ đầy một cái bình, mà là thắp sáng một ngọn lửa."
                    </p>
                    <div>
                        <p className="text-sm font-sans font-bold tracking-[0.2em] uppercase text-white">
                            William Butler Yeats
                        </p>
                        <p className="text-xs font-serif italic text-brand-cream/75">
                            Triết lý Giáo dục Khai phóng & Sư phạm Hiện đại
                        </p>
                    </div>
                </div>

                {/* Bottom: Tiêu chuẩn pháp lý */}
                <div className="relative z-10 pt-6 border-t border-white/20 text-xs font-sans text-brand-cream/80 flex items-center justify-between">
                    <span>Chuẩn Thông tư 11 & 12/2021 Bộ GD&ĐT</span>
                    <span>ĐH Sư Phạm TP.HCM</span>
                </div>
            </div>

            {/* CỘT PHẢI: FORM ĐĂNG NHẬP GOOGLE TỐI GIẢN */}
            <div className="w-full lg:w-7/12 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
                {/* Header: Logo & Nút về trang giới thiệu */}
                <div className="w-full max-w-md mx-auto flex items-center justify-between pb-6 border-b border-brand-cerulean/15">
                    <div className="flex items-center gap-3">
                        <img 
                            src={logoImg} 
                            alt="Pedagogy Logo" 
                            className="w-12 h-12 rounded-full border border-brand-cerulean/20 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => navigate('landing')}
                            title="Về trang giới thiệu"
                        />
                        <div>
                            <h1 className="font-serif-title text-2xl text-brand-cerulean tracking-tight font-bold">
                                Pedagogy.
                            </h1>
                            <p className="text-[10px] text-gray-500 font-sans uppercase tracking-widest">
                                Cổng Đăng Nhập Quản Trị
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('landing')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-cream border border-brand-cerulean/25 text-brand-cerulean hover:bg-brand-cerulean hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer"
                    >
                        <ArrowLeft size={13} />
                        <span>Trang Giới Thiệu</span>
                    </button>
                </div>

                {/* Center: Chỗ bấm Google đăng nhập tối giản */}
                <div className="w-full max-w-md mx-auto my-auto py-10 space-y-6">
                    <div className="space-y-2">
                        <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                            Xác thực danh tính
                        </span>
                        <h2 className="font-serif-title text-3xl font-bold text-brand-cerulean">
                            Đăng Nhập
                        </h2>
                        <p className="font-serif text-sm text-gray-600 leading-relaxed">
                            Sử dụng tài khoản Google để truy cập Bảng điều khiển học tập và hồ sơ rèn nghề Sư phạm.
                        </p>
                    </div>

                    {/* Thông báo lỗi nếu có */}
                    {error && (
                        <div className="p-3 bg-red-50 border-l-3 border-brand-jasper text-brand-jasper text-xs font-sans flex items-center justify-between gap-2 shadow-xs">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                            <button 
                                onClick={() => setError && setError(null)} 
                                className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Nút bấm Google tối giản, sắc nét */}
                    <div className="space-y-3 pt-2">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={authLoadingState === 'logging_in'}
                            className="w-full py-3.5 px-6 bg-white hover:bg-gray-50 border border-gray-300 hover:border-brand-cerulean text-gray-700 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 rounded-xs shadow-xs transition-all cursor-pointer hover:translate-y-[-1px] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.19 0 10.03 0 12s.45 3.81 1.25 5.42l4.03-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                            <span>{authLoadingState === 'logging_in' ? 'Đang kết nối...' : 'Tiếp tục với Google'}</span>
                        </button>
                    </div>
                </div>

                {/* Footer: Thông tin bảo mật & hotline */}
                <div className="w-full max-w-md mx-auto pt-6 border-t border-brand-cerulean/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-brand-jasper" />
                        <span>Firebase Auth & SSL 256-bit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>(028) 3835 2020</span>
                        <span>•</span>
                        <span>nvsp@hcmue.edu.vn</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
