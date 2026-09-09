import React from 'react';
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    School,
    Layers,
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    Calendar,
    FileText,
    Award,
    TrendingUp,
    ExternalLink,
    Compass,
    Users,
    Clock,
    Lock,
    User
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const LandingPageView = ({
    navigate,
    currentUser,
    handleGoogleSignIn
}) => {
    return (
        <div className="space-y-16 sm:space-y-24 pb-16">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 sm:pt-20 pb-12 border-b border-brand-cerulean/20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left column: Typography & Headline */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cerulean/10 border border-brand-cerulean/25 rounded-xs text-brand-cerulean font-sans text-xs font-bold uppercase tracking-widest">
                                <Sparkles size={14} className="text-brand-jasper" />
                                <span>Chương trình bồi dưỡng chuẩn quốc gia</span>
                            </div>

                            <h1 className="font-serif-title text-4xl sm:text-6xl text-brand-cerulean leading-[1.12] tracking-tight font-bold">
                                Kiến tạo Chân dung <span className="italic text-brand-jasper">Nhà giáo Hiện đại</span> trong Kỷ nguyên Số.
                            </h1>

                            <p className="font-serif text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Hệ thống quản trị học tập và rèn luyện nghiệp vụ sư phạm cá nhân hóa dành cho cử nhân ngoài sư phạm muốn trở thành giáo viên THCS & THPT theo chuẩn Thông tư 11 & 12/2021 của Bộ GD&ĐT.
                            </p>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                                {currentUser ? (
                                    <>
                                        <button
                                            onClick={() => navigate('dashboard')}
                                            className="w-full sm:w-auto px-7 py-3.5 bg-brand-cerulean text-white font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 rounded-xs shadow-editorial hover:bg-brand-cerulean/90 hover:translate-y-[-2px] transition-all"
                                        >
                                            <span>Vào Bảng Điều Khiển LMS</span>
                                            <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => navigate('features')}
                                            className="w-full sm:w-auto px-5 py-3.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean font-sans text-sm font-bold uppercase tracking-wider hover:bg-brand-cerulean hover:text-white transition-all rounded-xs"
                                        >
                                            10 Chức Năng Nền Tảng
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate('login')}
                                            className="w-full sm:w-auto px-7 py-3.5 bg-brand-cerulean text-white font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 rounded-xs shadow-editorial hover:bg-brand-cerulean/90 hover:translate-y-[-2px] transition-all"
                                        >
                                            <User size={15} />
                                            <span>Đăng Nhập Vào Quản Trị</span>
                                            <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => navigate('features')}
                                            className="w-full sm:w-auto px-5 py-3.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean font-sans text-sm font-bold uppercase tracking-wider hover:bg-brand-cerulean hover:text-white transition-all rounded-xs"
                                        >
                                            10 Chức Năng
                                        </button>
                                        <button
                                            onClick={() => navigate('history')}
                                            className="w-full sm:w-auto px-5 py-3.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean font-sans text-sm font-bold uppercase tracking-wider hover:bg-brand-cerulean hover:text-white transition-all rounded-xs"
                                        >
                                            Lịch Sử Chứng Chỉ
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Trust badges */}
                            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-sans text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={15} className="text-emerald-700" />
                                    <span>Căn cứ Luật Giáo dục 2019</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={15} className="text-emerald-700" />
                                    <span>Bộ GD&ĐT ban hành</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={15} className="text-emerald-700" />
                                    <span>Giá trị vĩnh viễn toàn quốc</span>
                                </div>
                            </div>
                        </div>

                        {/* Right column: Editorial Hero Card */}
                        <div className="lg:col-span-5">
                            <div className="bg-white border-editorial shadow-editorial p-6 sm:p-8 space-y-6 relative">
                                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 hidden sm:block">
                                    <span className="px-3 py-1 bg-brand-jasper text-white text-xs font-sans font-bold uppercase tracking-wider shadow-xs">
                                        Nghiệp vụ 2026
                                    </span>
                                </div>

                                <div className="border-b border-brand-cerulean/15 pb-4">
                                    <span className="text-xs font-sans text-gray-500 uppercase tracking-widest block mb-1">
                                        Học phần cốt lõi
                                    </span>
                                    <h3 className="font-serif-title text-2xl text-brand-cerulean font-bold">
                                        Hành Trình Bồi Dưỡng Nhà Giáo
                                    </h3>
                                </div>

                                <div className="space-y-3.5">
                                    {[
                                        { title: 'Lý luận giáo dục & Tâm lý học lứa tuổi', credits: '4 Tín chỉ', status: 'Căn tảng' },
                                        { title: 'Lý luận dạy học & Đánh giá năng lực học sinh', credits: '6 Tín chỉ', status: 'Trọng tâm' },
                                        { title: 'Kế hoạch bài dạy KHBD chuẩn Công văn 5512', credits: '4 Tín chỉ', status: 'Thực hành' },
                                        { title: 'Kiến tập & Thực tập sư phạm tại trường phổ thông', credits: '4 Tín chỉ', status: 'Thực chiến' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-3 bg-brand-cream/60 border border-brand-cerulean/15 flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <p className="font-serif-title text-sm font-bold text-gray-900">{item.title}</p>
                                                <p className="text-xs font-sans text-gray-500">{item.credits}</p>
                                            </div>
                                            <span className="text-[11px] font-sans font-bold px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean rounded-xs">
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2 border-t border-brand-cerulean/15 flex justify-between items-center text-xs font-sans">
                                    <span className="text-gray-500">Tổng chương trình:</span>
                                    <span className="font-bold text-brand-jasper text-sm">34 – 35 Tín chỉ chuẩn</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* KEY METRICS RIBBON */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="bg-brand-cerulean text-white p-8 sm:p-12 shadow-editorial">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/20">
                        <div className="space-y-1 pt-4 lg:pt-0">
                            <p className="font-serif-title text-4xl sm:text-5xl font-bold text-brand-cream">35</p>
                            <p className="font-sans text-xs sm:text-sm uppercase tracking-wider text-brand-cream/80">Tín chỉ đào tạo</p>
                            <p className="text-[11px] text-brand-cream/60 hidden sm:block">Theo TT 11 & TT 12/2021</p>
                        </div>
                        <div className="space-y-1 pt-4 lg:pt-0">
                            <p className="font-serif-title text-4xl sm:text-5xl font-bold text-brand-cream">05</p>
                            <p className="font-sans text-xs sm:text-sm uppercase tracking-wider text-brand-cream/80">Tiêu chuẩn nghề nghiệp</p>
                            <p className="text-[11px] text-brand-cream/60 hidden sm:block">Chuẩn TT 20/2018/TT-BGDĐT</p>
                        </div>
                        <div className="space-y-1 pt-4 lg:pt-0">
                            <p className="font-serif-title text-4xl sm:text-5xl font-bold text-brand-cream">100%</p>
                            <p className="font-sans text-xs sm:text-sm uppercase tracking-wider text-brand-cream/80">Minh chứng số hóa</p>
                            <p className="text-[11px] text-brand-cream/60 hidden sm:block">Giáo án, nhật ký & e-Portfolio</p>
                        </div>
                        <div className="space-y-1 pt-4 lg:pt-0">
                            <p className="font-serif-title text-4xl sm:text-5xl font-bold text-brand-cream">02</p>
                            <p className="font-sans text-xs sm:text-sm uppercase tracking-wider text-brand-cream/80">Chương trình chuẩn</p>
                            <p className="text-[11px] text-brand-cream/60 hidden sm:block">Giáo viên THCS & Giáo viên THPT</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4 CORE PILLARS SECTION */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Khung năng lực nhà giáo
                    </span>
                    <h2 className="font-serif-title text-3xl sm:text-4xl text-brand-cerulean font-bold">
                        Bốn Trụ Cột Nghiệp Vụ Sư Phạm Toàn Diện
                    </h2>
                    <p className="font-serif text-gray-600 text-base">
                        Chương trình bồi dưỡng được cấu trúc chặt chẽ nhằm chuyển hóa tri thức chuyên ngành thành năng lực sư phạm vượt trội trên bục giảng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            num: '01',
                            title: 'Nền tảng Giáo dục học & Tâm lý học Sư phạm',
                            desc: 'Thấu hiểu sự phát triển thể chất và tâm lý của học sinh lứa tuổi thiếu niên và vị thành niên. Xây dựng môi trường lớp học an toàn, thân thiện, tôn trọng sự khác biệt cá nhân.',
                            tag: 'Khối cơ bản'
                        },
                        {
                            num: '02',
                            title: 'Phương pháp Dạy học Phát triển Phẩm chất & Năng lực',
                            desc: 'Làm chủ kỹ thuật dạy học tích cực (bàn tay nặn bột, dạy học dự án, kỹ thuật mảnh ghép), soạn giáo án theo Công văn 5512 và xây dựng đề kiểm tra ma trận đặc tả chuẩn Bộ GD&ĐT.',
                            tag: 'Khối chuyên ngành'
                        },
                        {
                            num: '03',
                            title: 'Ứng dụng Công nghệ Giáo dục & Chuyển đổi số',
                            desc: 'Khai thác hiệu quả phần mềm mô phỏng, bài giảng tương tác, hệ thống LMS và sử dụng các công cụ Trí tuệ nhân tạo (AI) có trách nhiệm trong nghiên cứu học liệu sư phạm.',
                            tag: 'Khối kỹ năng số'
                        },
                        {
                            num: '04',
                            title: 'Rèn luyện Nghiệp vụ, Kiến tập & Thực tập Sư phạm',
                            desc: 'Rèn luyện kỹ năng viết bảng, phát âm sư phạm, tập giảng vi mô (Micro-teaching) và trải nghiệm thực tế 8-10 tuần kiến tập - thực tập giảng dạy tại trường phổ thông đối tác.',
                            tag: 'Khối thực hành'
                        },
                    ].map((pillar, idx) => (
                        <div key={idx} className="bg-white border-editorial p-8 shadow-editorial relative space-y-4 hover:border-brand-jasper transition-all group">
                            <div className="flex justify-between items-start">
                                <span className="font-serif-title text-3xl text-brand-cerulean/30 group-hover:text-brand-jasper transition-colors font-bold">
                                    {pillar.num}
                                </span>
                                <span className="text-xs font-sans font-bold px-2 py-0.5 bg-brand-cream border border-brand-cerulean/20 text-brand-cerulean">
                                    {pillar.tag}
                                </span>
                            </div>
                            <h3 className="font-serif-title text-xl font-bold text-brand-cerulean group-hover:text-brand-jasper transition-colors">
                                {pillar.title}
                            </h3>
                            <p className="font-serif text-sm text-gray-600 leading-relaxed">
                                {pillar.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PLATFORM FEATURES PREVIEW */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                    <div className="space-y-2">
                        <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                            Hệ sinh thái số Pedagogy
                        </span>
                        <h2 className="font-serif-title text-3xl text-brand-cerulean font-bold">
                            Công Cụ Hỗ Trợ Toàn Trình Khóa Học
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('features')}
                        className="text-xs font-sans font-bold text-brand-cerulean hover:text-brand-jasper flex items-center gap-1 uppercase tracking-wider"
                    >
                        <span>Xem chi tiết cả 10 tính năng</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            view: 'calendar',
                            icon: Calendar,
                            title: 'Thời Khóa Biểu & Điểm Danh',
                            desc: 'Theo dõi ca học sáng/chiều/tối, link trực tuyến và điểm danh chuyên cần tự động từng buổi.'
                        },
                        {
                            view: 'resources',
                            icon: FileText,
                            title: 'Sổ Bài Học Toàn Màn Hình',
                            desc: 'Trang ghi chép bài học chuyên sâu với cơ chế Auto-save tự động lưu nháp và mở slide song song.'
                        },
                        {
                            view: 'lesson_plans',
                            icon: Layers,
                            title: 'Kế Hoạch Bài Dạy (CV 5512)',
                            desc: 'Soạn thảo giáo án chuẩn 4 hoạt động bài học, quản lý các đợt tập giảng và phản hồi của người hướng dẫn.'
                        },
                        {
                            view: 'practicum',
                            icon: School,
                            title: 'Sổ Dự Giờ & Thực Tập Sư Phạm',
                            desc: 'Quản lý lịch kiến tập, nhật ký chủ nhiệm lớp và tiêu chí đánh giá giờ dạy của giáo viên hướng dẫn.'
                        },
                        {
                            view: 'competencies',
                            icon: ShieldCheck,
                            title: 'Khung Năng Lực (TT 20/2018)',
                            desc: 'Tự đánh giá 5 tiêu chuẩn và 15 tiêu chí năng lực nghề nghiệp giáo viên cơ sở giáo dục phổ thông.'
                        },
                        {
                            view: 'portfolio_export',
                            icon: Award,
                            title: 'Xuất Hồ Sơ e-Portfolio PDF',
                            desc: 'Tổng hợp bảng điểm, minh chứng giáo án và nhật ký thực tập để in ấn hoặc nộp hồ sơ tuyển dụng viên chức.'
                        },
                    ].map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (currentUser) {
                                        navigate(feature.view);
                                    } else {
                                        navigate('login');
                                    }
                                }}
                                className="bg-white border-editorial p-6 shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group space-y-3"
                            >
                                <div className="w-10 h-10 rounded-xs bg-brand-cream border border-brand-cerulean/20 flex items-center justify-center text-brand-cerulean group-hover:bg-brand-cerulean group-hover:text-white transition-colors">
                                    <Icon size={20} />
                                </div>
                                <h3 className="font-serif-title text-lg font-bold text-brand-cerulean group-hover:text-brand-jasper transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="font-serif text-sm text-gray-600 leading-relaxed">
                                    {feature.desc}
                                </p>
                                <div className="pt-2 text-xs font-sans font-bold flex items-center gap-1.5 text-brand-jasper">
                                    {currentUser ? (
                                        <>
                                            <span>Mở chức năng này</span>
                                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={12} className="text-gray-400" />
                                            <span className="text-gray-500 group-hover:text-brand-jasper transition-colors">Đăng nhập để sử dụng</span>
                                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* PEDAGOGICAL PHILOSOPHY QUOTE */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <div className="p-8 sm:p-12 border-y-2 border-brand-cerulean/20 space-y-4">
                    <p className="font-serif text-2xl sm:text-3xl italic text-brand-cerulean leading-relaxed">
                        "Giáo dục không phải là việc đổ đầy một cái bình, mà là thắp sáng một ngọn lửa."
                    </p>
                    <div className="w-12 h-1 bg-brand-jasper mx-auto rounded-full"></div>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-gray-600">
                        William Butler Yeats • Triết lý Giáo dục Khai phóng
                    </p>
                </div>
            </section>

            {/* FINAL CALL TO ACTION */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="bg-white border-editorial p-8 sm:p-12 shadow-editorial text-center space-y-6">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Khởi đầu hành trình sư phạm
                    </span>
                    <h2 className="font-serif-title text-3xl sm:text-5xl text-brand-cerulean font-bold max-w-2xl mx-auto">
                        Sẵn sàng để bước lên bục giảng với bản lĩnh nhà giáo?
                    </h2>
                    <p className="font-serif text-base sm:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
                        Truy cập ngay bảng điều khiển học tập cá nhân để theo dõi tiến độ tích lũy tín chỉ, lịch học và soạn thảo giáo án của bạn.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                        {currentUser ? (
                            <button
                                onClick={() => navigate('dashboard')}
                                className="w-full sm:w-auto px-8 py-3.5 bg-brand-cerulean text-white font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow-editorial hover:bg-brand-cerulean/90 hover:translate-y-[-2px] transition-all"
                            >
                                <span>Truy cập Bảng điều khiển LMS</span>
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('login')}
                                className="w-full sm:w-auto px-8 py-3.5 bg-brand-cerulean text-white font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 rounded-xs shadow-editorial hover:bg-brand-cerulean/90 hover:translate-y-[-2px] transition-all"
                            >
                                <User size={15} />
                                <span>Đăng Nhập Để Vào Quản Trị</span>
                                <ArrowRight size={16} />
                            </button>
                        )}
                        <button
                            onClick={() => navigate('contact')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean font-sans text-sm font-bold uppercase tracking-wider hover:bg-brand-cerulean hover:text-white transition-all rounded-xs"
                        >
                            Tư vấn Tuyển sinh & Bồi dưỡng
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
