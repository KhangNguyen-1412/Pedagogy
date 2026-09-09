import React, { useState } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    FileText,
    Award,
    School,
    Layers,
    ShieldCheck,
    GraduationCap,
    Printer,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Eye,
    Save,
    Clock,
    Target,
    Lock
} from 'lucide-react';

export const FeaturesView = ({ navigate, currentUser, handleGoogleSignIn }) => {
    const [selectedTab, setSelectedTab] = useState('all');

    const features = [
        {
            id: 'programs',
            num: '01',
            icon: BookOpen,
            title: 'Quản Trị Chương Trình & Tiến Độ Tín Chỉ',
            category: 'academic',
            summary: 'Theo dõi lộ trình 34–35 tín chỉ chuẩn hóa theo Thông tư 11 & 12/2021/TT-BGDĐT.',
            details: [
                'Phân tách rõ ràng giữa Khối kiến thức chung (15-17 TC) và Khối kiến thức nhánh chuyên sâu (17-18 TC).',
                'Thanh tiến độ trực quan hiển thị số tín chỉ đã hoàn thành, đang học và còn lại theo thời gian thực.',
                'Kiểm soát điều kiện học phần tiên quyết đảm bảo học viên tiếp thu kiến thức theo trình tự sư phạm tối ưu.'
            ],
            targetView: 'programs'
        },
        {
            id: 'syllabus',
            num: '02',
            icon: FileText,
            title: 'Đề Cương Chi Tiết & Syllabus 15 Buổi Số Hóa',
            category: 'academic',
            summary: 'Tích hợp ma trận chuẩn đầu ra (CLOs) và cấu trúc chi tiết từng buổi học.',
            details: [
                'Syllabus chuẩn mực chia làm 15 buổi với nội dung trọng tâm, tài liệu đọc trước và hình thức kiểm tra.',
                'Thiết lập tỷ lệ trọng số đánh giá minh bạch: Chuyên cần (10%), Giữa kỳ (20-30%), Cuối kỳ (50-60%).',
                'Liên kết chuẩn đầu ra học phần với Khung năng lực nghề nghiệp giáo viên phổ thông.'
            ],
            targetView: 'syllabus'
        },
        {
            id: 'calendar',
            num: '03',
            icon: Calendar,
            title: 'Lịch Biểu & Điểm Danh Chuyên Cần Thông Minh',
            category: 'academic',
            summary: 'Ma trận thời khóa biểu tuần thông minh với phân ca học sáng, chiều, tối.',
            details: [
                'Giao diện lưới 7 ngày trong tuần trực quan, phân biệt rõ các ca học và thời gian bắt đầu/kết thúc.',
                'Tích hợp đường link học tập trực tuyến (Google Meet / Zoom) cho các buổi học từ xa.',
                'Tự động ghi nhận số buổi tham dự và cảnh báo nguy cơ cấm thi nếu vắng quá 20% số tiết quy định.'
            ],
            targetView: 'calendar'
        },
        {
            id: 'resources',
            num: '04',
            icon: Save,
            title: 'Sổ Bài Học Toàn Màn Hình & Auto-Save Nháp',
            category: 'academic',
            summary: 'Trang ghi chép bài học chuyên sâu với cơ chế tự động lưu nháp và mở slide song song.',
            details: [
                'Trang soạn thảo bài học toàn màn hình độc lập, nói không với popup modal tù túng.',
                'Cơ chế Auto-save tự động lưu liên tục vào localStorage: không bao giờ sợ mất bài khi thoát ra tra cứu tài liệu.',
                'Thanh tra cứu tài liệu Google Drive / PDF slide bài giảng đặt song song bên cạnh khung nhập liệu.'
            ],
            targetView: 'resources'
        },
        {
            id: 'gradebook',
            num: '05',
            icon: Award,
            title: 'Sổ Điểm & Tính Điểm GPA Chuẩn Học Chế Tín Chỉ',
            category: 'academic',
            summary: 'Tự động tính điểm trung bình chung tích lũy (GPA 4.0) và xếp loại học lực.',
            details: [
                'Quy đổi điểm tổng kết hệ 10 sang điểm chữ (A, B+, B, C+, C, D+, D, F) và hệ 4.0 chuẩn quy chế đại học.',
                'Tính toán GPA tích lũy tổng thể, phản ánh chính xác kết quả học tập trong từng giai đoạn đào tạo.',
                'Xếp loại học lực dự kiến (Xuất sắc, Giỏi, Khá, Trung bình) để thẩm định điều kiện cấp chứng chỉ.'
            ],
            targetView: 'gradebook'
        },
        {
            id: 'practicum',
            num: '06',
            icon: School,
            title: 'Hồ Sơ Thực Tập Sư Phạm & Sổ Dự Giờ Điện Tử',
            category: 'practicum',
            summary: 'Quản lý toàn diện giai đoạn kiến tập và thực tập giảng dạy tại trường phổ thông.',
            details: [
                'Lưu trữ thông tin trường phổ thông tiếp nhận: Ban giám hiệu, Giáo viên hướng dẫn chuyên môn và chủ nhiệm.',
                'Sổ dự giờ điện tử cho phép phân tích hoạt động học của học sinh theo tinh thần đổi mới giáo dục.',
                'Quản lý biên bản đánh giá tiết dạy thực tập, điểm thực tập giảng dạy và điểm công tác chủ nhiệm.'
            ],
            targetView: 'practicum'
        },
        {
            id: 'lesson_plans',
            num: '07',
            icon: Layers,
            title: 'Soạn Kế Hoạch Bài Dạy (KHBD) Chuẩn Công Văn 5512',
            category: 'practicum',
            summary: 'Thiết kế giáo án hiện đại theo cấu trúc 4 hoạt động bài học bắt buộc của Bộ GD&ĐT.',
            details: [
                'Cấu trúc giáo án chuẩn: Hoạt động Mở đầu &rarr; Hình thành kiến thức &rarr; Luyện tập &rarr; Vận dụng.',
                'Quản lý các đợt tập giảng vi mô (Micro-teaching) với thời lượng rút gọn (10-15 phút) trước bạn đồng học.',
                'Lưu trữ nhận xét chi tiết của giảng viên và tự rút kinh nghiệm sau mỗi giờ tập giảng.'
            ],
            targetView: 'lesson_plans'
        },
        {
            id: 'competencies',
            num: '08',
            icon: ShieldCheck,
            title: 'Đánh Giá Khung Năng Lực Giáo Viên Theo Thông Tư 20/2018',
            category: 'standards',
            summary: 'Hệ thống tự đánh giá 5 tiêu chuẩn và 15 tiêu chí năng lực nghề nghiệp giáo viên phổ thông.',
            details: [
                'Tiêu chuẩn 1: Phẩm chất nhà giáo; Tiêu chuẩn 2: Phát triển chuyên môn, nghiệp vụ.',
                'Tiêu chuẩn 3: Xây dựng môi trường giáo dục; Tiêu chuẩn 4: Phát triển quan hệ gia đình & xã hội.',
                'Tiêu chuẩn 5: Sử dụng ngoại ngữ và ứng dụng CNTT; có trường liên kết minh chứng cụ thể cho từng tiêu chí.'
            ],
            targetView: 'competencies'
        },
        {
            id: 'graduation',
            num: '09',
            icon: GraduationCap,
            title: 'Thẩm Định Tốt Nghiệp & Dự Báo Chứng Chỉ NVSP',
            category: 'standards',
            summary: 'Đối soát tự động các điều kiện công nhận tốt nghiệp và cấp chứng chỉ quốc gia.',
            details: [
                'Kiểm tra tự động 5 tiêu chuẩn: Tín chỉ tích lũy, Điểm rèn luyện, Điểm GPA, Điểm TTSP và Chứng chỉ phụ trợ.',
                'Dự báo xếp loại chứng chỉ tốt nghiệp (Xuất sắc, Giỏi, Khá) và hiển thị kết luận thẩm định hồ sơ.',
                'Xem trước phôi chứng chỉ nghiệp vụ sư phạm theo quy chuẩn của Bộ Giáo dục & Đào tạo.'
            ],
            targetView: 'graduation'
        },
        {
            id: 'portfolio_export',
            num: '10',
            icon: Printer,
            title: 'Xuất Bản Hồ Sơ Năng Lực Sư Phạm e-Portfolio A4',
            category: 'standards',
            summary: 'Trích xuất hồ sơ cá nhân và bảng điểm học tập phục vụ tuyển dụng viên chức giáo dục.',
            details: [
                'Tự động tổng hợp dữ liệu học tập thành tập Hồ sơ năng lực sư phạm (Teaching Dossier) chuyên nghiệp.',
                'Định dạng khổ giấy A4 chuẩn mực, tối ưu hóa để in ấn hoặc nộp hồ sơ xin việc tại trường phổ thông.',
                'Bao gồm bảng điểm chính thức, các kế hoạch bài dạy tiêu biểu và minh chứng đánh giá năng lực.'
            ],
            targetView: 'portfolio_export'
        }
    ];

    const filteredFeatures = selectedTab === 'all'
        ? features
        : features.filter(f => f.category === selectedTab);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
            {/* PAGE HEADER */}
            <header className="space-y-4 pb-6 border-b-2 border-brand-cerulean/20">
                <div className="flex items-center gap-2 text-xs font-sans text-gray-500 uppercase tracking-widest">
                    <button onClick={() => navigate('landing')} className="hover:text-brand-jasper transition-colors">
                        Trang chủ
                    </button>
                    <span>/</span>
                    <span className="text-brand-cerulean font-bold">Đặc điểm & Chức năng</span>
                </div>
                <h1 className="font-serif-title text-4xl sm:text-5xl text-brand-cerulean font-bold tracking-tight">
                    Mười Phân Hệ Chức Năng Cốt Lõi Của Hệ Thống
                </h1>
                <p className="font-serif text-lg text-gray-700 leading-relaxed max-w-3xl">
                    Kiến trúc số hóa khép kín đáp ứng toàn bộ các giai đoạn trong lộ trình bồi dưỡng: tiếp thu lý luận, thực hành soạn giáo án, quản lý kiến tập thực tập, và thẩm định cấp chứng chỉ.
                </p>
            </header>

            {/* CATEGORY FILTER TABS */}
            <div className="flex flex-wrap items-center gap-2 border-b border-brand-cerulean/20 pb-3 font-sans text-xs font-bold uppercase tracking-wider">
                {[
                    { id: 'all', label: 'Tất cả 10 Chức Năng' },
                    { id: 'academic', label: 'Học phần & Giảng đường' },
                    { id: 'practicum', label: 'Rèn nghề & Thực tập' },
                    { id: 'standards', label: 'Chuẩn nghề & Tốt nghiệp' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`px-4 py-2 rounded-xs transition-all ${
                            selectedTab === tab.id
                                ? 'bg-brand-cerulean text-white shadow-xs'
                                : 'bg-white border border-brand-cerulean/20 text-gray-700 hover:border-brand-jasper hover:text-brand-jasper'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* FEATURES LISTING */}
            <div className="space-y-8">
                {filteredFeatures.map((feat) => {
                    const Icon = feat.icon;
                    return (
                        <div
                            key={feat.id}
                            className="bg-white border-editorial p-6 sm:p-8 shadow-editorial hover:shadow-editorial-hover transition-all space-y-6"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/15">
                                <div className="flex items-center gap-4">
                                    <span className="font-serif-title text-3xl font-bold text-brand-jasper/60">
                                        {feat.num}
                                    </span>
                                    <div className="w-10 h-10 rounded-xs bg-brand-cream border border-brand-cerulean/20 flex items-center justify-center text-brand-cerulean">
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-brand-cerulean">
                                            {feat.title}
                                        </h3>
                                        <p className="font-serif text-sm text-gray-600">{feat.summary}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (currentUser) {
                                            navigate(feat.targetView);
                                        } else {
                                            navigate('login');
                                        }
                                    }}
                                    className="px-4 py-2 bg-brand-cream border border-brand-cerulean/30 text-brand-cerulean hover:bg-brand-cerulean hover:text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all rounded-xs shrink-0"
                                >
                                    {currentUser ? (
                                        <>
                                            <span>Mở Chức Năng</span>
                                            <ArrowRight size={13} />
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={12} className="text-gray-500" />
                                            <span>Đăng Nhập Để Mở</span>
                                            <ArrowRight size={13} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Bullet items */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-serif text-sm text-gray-700">
                                {feat.details.map((detail, idx) => (
                                    <div key={idx} className="p-3.5 bg-brand-cream/40 border border-brand-cerulean/10 flex items-start gap-2.5">
                                        <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BOTTOM CALL TO ACTION */}
            <div className="bg-brand-cerulean text-white p-8 sm:p-10 shadow-editorial text-center space-y-4">
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-brand-cream">
                    Trải Nghiệm Trực Tiếp Các Chức Năng Này
                </h3>
                <p className="font-serif text-brand-cream/80 max-w-xl mx-auto text-sm sm:text-base">
                    Hệ thống đã được nạp sẵn dữ liệu mô phỏng học kỳ đầy đủ để bạn khám phá quy trình quản lý học tập sư phạm toàn diện.
                </p>
                <div className="pt-2">
                    {currentUser ? (
                        <button
                            onClick={() => navigate('dashboard')}
                            className="px-6 py-3 bg-brand-jasper text-white font-sans text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-xs shadow-xs hover:bg-brand-jasper/90 transition-all"
                        >
                            <span>Vào Bảng Điều Khiển Ngay</span>
                            <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('login')}
                            className="px-6 py-3 bg-brand-jasper text-white font-sans text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-xs shadow-xs hover:bg-brand-jasper/90 transition-all"
                        >
                            <span>Đăng Nhập Để Vào Hệ Thống</span>
                            <ArrowRight size={15} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
