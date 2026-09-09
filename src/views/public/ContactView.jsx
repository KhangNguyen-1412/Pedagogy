import React, { useState } from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    CheckCircle2,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Building2,
    MessageSquare,
    ExternalLink
} from 'lucide-react';

export const ContactView = ({ navigate }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        degreeMajor: '',
        targetProgram: 'thpt',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) return;
        setIsSubmitted(true);
        setTimeout(() => {
            // After 6 seconds, reset state
            setIsSubmitted(false);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                degreeMajor: '',
                targetProgram: 'thpt',
                message: ''
            });
        }, 6000);
    };

    const faqs = [
        {
            q: 'Bằng tốt nghiệp đại học của tôi có đủ điều kiện đăng ký học chứng chỉ NVSP không?',
            a: 'Theo quy định tại Thông tư 11 và 12/2021/TT-BGDĐT, bạn đủ điều kiện nếu sở hữu bằng cử nhân (đại học) thuộc các chuyên ngành phù hợp với môn học trong chương trình giáo dục phổ thông (Toán, Vật lý, Hóa học, Sinh học, Ngữ văn, Lịch sử, Địa lý, Tin học, Tiếng Anh, Công nghệ, Giáo dục thể chất, Âm nhạc, Mỹ thuật...). Trường hợp tên ngành chưa hoàn toàn trùng khớp, Hội đồng chuyên môn của trường sẽ xét bảng điểm chi tiết để xác định tính tương thích.'
        },
        {
            q: 'Thời gian hoàn thành khóa bồi dưỡng là bao lâu và có lớp học ngoài giờ hành chính không?',
            a: 'Chương trình gồm 34 đến 35 tín chỉ, thời gian đào tạo thông thường từ 9 đến 12 tháng tùy theo tiến độ đăng ký học phần. Nhà trường tổ chức linh hoạt các lớp học ngoài giờ hành chính (tối thứ Hai – Tư – Sáu hoặc trọn ngày Thứ Bảy và Chủ Nhật) để học viên đang đi làm có thể thuận tiện theo học.'
        },
        {
            q: 'Khóa học có được tổ chức trực tuyến (Online) hoàn toàn không?',
            a: 'Theo quy định của Bộ Giáo dục & Đào tạo, các học phần lý thuyết chung và bài giảng kiến thức có thể được tổ chức trực tuyến kết hợp thông qua hệ thống LMS và phòng học ảo Google Meet/Zoom. Tuy nhiên, các học phần rèn luyện kỹ năng sư phạm, tập giảng vi mô (Micro-teaching) và đợt Thực tập sư phạm bắt buộc phải tham gia trực tiếp tại cơ sở đào tạo và trường phổ thông đối tác.'
        },
        {
            q: 'Giai đoạn Thực tập sư phạm được tổ chức tại trường nào? Học viên có thể tự liên hệ trường không?',
            a: 'Nhà trường có mạng lưới hơn 50 trường THCS và THPT đối tác tại TP.HCM tiếp nhận học viên thực tập. Đồng thời, học viên ở các tỉnh thành khác được quyền tự liên hệ trường phổ thông công lập/tư thục gần nơi cư trú hoặc nơi đang công tác, gửi Đơn xin thực tập về phòng Đào tạo phê duyệt trước khi thực hiện.'
        },
        {
            q: 'Chứng chỉ Nghiệp vụ Sư phạm có thời hạn bao lâu và có giá trị tại các tỉnh khác không?',
            a: 'Chứng chỉ bồi dưỡng nghiệp vụ sư phạm cấp theo phôi chuẩn của Bộ Giáo dục & Đào tạo có GIÁ TRỊ VĨNH VIỄN (không có thời hạn hết hạn) và có GIÁ TRỊ PHÁP LÝ TRÊN TOÀN QUỐC (áp dụng tại tất cả 63 tỉnh/thành phố). Chứng chỉ là hồ sơ bắt buộc để tham dự các kỳ thi tuyển dụng viên chức ngành giáo dục.'
        },
        {
            q: 'Người đã có chứng chỉ NVSP cấp trước năm 2021 có bắt buộc phải học lại theo Thông tư 11/12 không?',
            a: 'Những chứng chỉ nghiệp vụ sư phạm đã được cấp hợp pháp trước ngày 22/05/2021 theo các quy định cũ vẫn được công nhận giá trị theo quy định chuyển tiếp của Bộ GD&ĐT. Tuy nhiên, nếu bạn muốn dự tuyển viên chức giáo viên THCS hoặc THPT mà đơn vị tuyển dụng yêu cầu cụ thể chứng chỉ theo chuẩn Thông tư 11 hoặc 12, bạn nên tham gia khóa bồi dưỡng cập nhật để đảm bảo tính pháp lý tối ưu.'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
            {/* PAGE HEADER */}
            <header className="space-y-4 pb-6 border-b-2 border-brand-cerulean/20">
                <div className="flex items-center gap-2 text-xs font-sans text-gray-500 uppercase tracking-widest">
                    <button onClick={() => navigate('landing')} className="hover:text-brand-jasper transition-colors">
                        Trang chủ
                    </button>
                    <span>/</span>
                    <span className="text-brand-cerulean font-bold">Liên hệ & Tư vấn</span>
                </div>
                <h1 className="font-serif-title text-4xl sm:text-5xl text-brand-cerulean font-bold tracking-tight">
                    Trung Tâm Tư Vấn Tuyển Sinh & Hỗ Trợ Học Vụ
                </h1>
                <p className="font-serif text-lg text-gray-700 leading-relaxed max-w-3xl">
                    Đội ngũ chuyên viên học vụ và cố vấn sư phạm luôn sẵn sàng giải đáp mọi thắc mắc về hồ sơ tuyển sinh, quy chế tín chỉ và lịch khai giảng khóa mới.
                </p>
            </header>

            {/* CONTACT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border-editorial p-6 shadow-editorial space-y-3">
                    <div className="w-10 h-10 rounded-xs bg-brand-cream border border-brand-cerulean/20 flex items-center justify-center text-brand-cerulean">
                        <MapPin size={20} />
                    </div>
                    <h3 className="font-serif-title text-lg font-bold text-brand-cerulean">Địa Chỉ Cơ Sở</h3>
                    <p className="font-serif text-sm text-gray-700 leading-relaxed">
                        Phòng Quản lý Đào tạo & Bồi dưỡng Thường xuyên<br />
                        280 An Dương Vương, Phường 4, Quận 5, TP. Hồ Chí Minh
                    </p>
                </div>

                <div className="bg-white border-editorial p-6 shadow-editorial space-y-3">
                    <div className="w-10 h-10 rounded-xs bg-brand-cream border border-brand-cerulean/20 flex items-center justify-center text-brand-cerulean">
                        <Phone size={20} />
                    </div>
                    <h3 className="font-serif-title text-lg font-bold text-brand-cerulean">Đường Dây Nóng</h3>
                    <p className="font-serif text-sm text-gray-700 leading-relaxed">
                        Tổng đài: (028) 3835 2020 (Máy lẻ 108)<br />
                        Hotline Tuyển sinh: 0903 141 202 (Zalo tư vấn 24/7)
                    </p>
                </div>

                <div className="bg-white border-editorial p-6 shadow-editorial space-y-3">
                    <div className="w-10 h-10 rounded-xs bg-brand-cream border border-brand-cerulean/20 flex items-center justify-center text-brand-cerulean">
                        <Clock size={20} />
                    </div>
                    <h3 className="font-serif-title text-lg font-bold text-brand-cerulean">Giờ Tiếp Đón</h3>
                    <p className="font-serif text-sm text-gray-700 leading-relaxed">
                        Thứ Hai – Thứ Sáu: 07:30 – 11:30 | 13:30 – 17:00<br />
                        Thứ Bảy: 08:00 – 11:30 (Trực tuyển sinh)
                    </p>
                </div>
            </div>

            {/* 2-COLUMN: INQUIRY FORM & FAQ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left col: Minimalist Contact Form */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border-editorial p-6 sm:p-8 shadow-editorial space-y-6 relative">
                        <div className="border-b border-brand-cerulean/15 pb-3">
                            <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                                Trực tuyến
                            </span>
                            <h3 className="font-serif-title text-2xl font-bold text-brand-cerulean">
                                Gửi Yêu Cầu Tư Vấn
                            </h3>
                            <p className="font-serif text-xs text-gray-600 mt-1">
                                Chúng tôi sẽ phản hồi qua Email hoặc Số điện thoại trong vòng 24 giờ làm việc.
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div className="p-6 bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-fade-in">
                                <CheckCircle2 size={36} className="text-emerald-700 mx-auto" />
                                <h4 className="font-serif-title text-lg font-bold text-emerald-900">
                                    Đã Gửi Yêu Cầu Thành Công!
                                </h4>
                                <p className="font-serif text-xs text-emerald-800 leading-relaxed">
                                    Cảm ơn bạn đã liên hệ. Ban Tuyển sinh Nghiệp vụ Sư phạm sẽ rà soát ngành học và liên hệ tư vấn lộ trình phù hợp nhất cho bạn.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 font-serif">
                                <div className="space-y-1">
                                    <label className="text-xs font-sans font-bold text-gray-700 uppercase tracking-wider block">
                                        Họ và Tên *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-3 py-2 bg-brand-cream/40 border border-brand-cerulean/30 focus:border-brand-jasper focus:bg-white outline-none transition-all text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-sans font-bold text-gray-700 uppercase tracking-wider block">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="email@example.com"
                                            className="w-full px-3 py-2 bg-brand-cream/40 border border-brand-cerulean/30 focus:border-brand-jasper focus:bg-white outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-sans font-bold text-gray-700 uppercase tracking-wider block">
                                            Số Điện Thoại
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="0901 234 567"
                                            className="w-full px-3 py-2 bg-brand-cream/40 border border-brand-cerulean/30 focus:border-brand-jasper focus:bg-white outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-sans font-bold text-gray-700 uppercase tracking-wider block">
                                        Chuyên Ngành Đại Học Đã Tốt Nghiệp
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.degreeMajor}
                                        onChange={(e) => setFormData({ ...formData, degreeMajor: e.target.value })}
                                        placeholder="Ví dụ: Cử nhân Toán học, Ngôn ngữ Anh..."
                                        className="w-full px-3 py-2 bg-brand-cream/40 border border-brand-cerulean/30 focus:border-brand-jasper focus:bg-white outline-none transition-all text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-sans font-bold text-gray-700 uppercase tracking-wider block">
                                        Chương Trình Quan Tâm
                                    </label>
                                    <select
                                        value={formData.targetProgram}
                                        onChange={(e) => setFormData({ ...formData, targetProgram: e.target.value })}
                                        className="w-full px-3 py-2 bg-brand-cream/40 border border-brand-cerulean/30 focus:border-brand-jasper focus:bg-white outline-none transition-all text-sm"
                                    >
                                        <option value="thpt">Nghiệp vụ Sư phạm THPT (Thông tư 12/2021)</option>
                                        <option value="thcs">Nghiệp vụ Sư phạm THCS (Thông tư 11/2021)</option>
                                        <option value="tuvan">Cần tư vấn xác định ngành phù hợp</option>
                                        <option value="lms">Hỗ trợ kỹ thuật hệ thống LMS Pedagogy</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-sans font-bold text-gray-700 uppercase tracking-wider block">
                                        Nội Dung Câu Hỏi / Thắc Mắc
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Ghi rõ thắc mắc về lịch khai giảng, học phí, hình thức học..."
                                        className="w-full px-3 py-2 bg-brand-cream/40 border border-brand-cerulean/30 focus:border-brand-jasper focus:bg-white outline-none transition-all text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-brand-cerulean text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow-xs hover:bg-brand-cerulean/90 transition-all"
                                >
                                    <Send size={14} />
                                    <span>Gửi Thư Tư Vấn Ngay</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right col: Comprehensive FAQ Accordion */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="border-b border-brand-cerulean/15 pb-3">
                        <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                            Hỏi đáp tuyển sinh
                        </span>
                        <h3 className="font-serif-title text-2xl font-bold text-brand-cerulean">
                            Các Câu Hỏi Thường Gặp (FAQ)
                        </h3>
                        <p className="font-serif text-xs text-gray-600 mt-1">
                            Giải đáp chi tiết các quy định pháp lý và thủ tục học tập được nhiều học viên quan tâm nhất.
                        </p>
                    </div>

                    <div className="space-y-3 font-serif">
                        {faqs.map((faq, index) => {
                            const isOpen = expandedFaq === index;
                            return (
                                <div
                                    key={index}
                                    className={`bg-white border transition-all duration-300 shadow-xs overflow-hidden ${
                                        isOpen ? 'border-brand-jasper/60 shadow-editorial' : 'border-editorial'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setExpandedFaq(isOpen ? -1 : index)}
                                        className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-brand-cream/40 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="font-serif-title font-bold text-brand-jasper text-sm shrink-0 mt-0.5">
                                                Q{index + 1}.
                                            </span>
                                            <span className={`font-serif-title font-bold text-sm sm:text-base transition-colors ${
                                                isOpen ? 'text-brand-jasper' : 'text-brand-cerulean'
                                            }`}>
                                                {faq.q}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className={`shrink-0 mt-1 transition-transform duration-300 ease-out ${
                                                isOpen ? 'rotate-180 text-brand-jasper' : 'rotate-0 text-brand-cerulean'
                                            }`}
                                        />
                                    </button>

                                    <div className={`accordion-collapse ${isOpen ? 'open' : ''}`}>
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5 pt-2 text-sm text-gray-700 leading-relaxed border-t border-brand-cerulean/10 bg-brand-cream/30">
                                                <p>{faq.a}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
