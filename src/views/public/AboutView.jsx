import React from 'react';
import {
    GraduationCap,
    BookOpen,
    Award,
    ShieldCheck,
    CheckCircle2,
    Users,
    Target,
    Compass,
    Sparkles,
    Building2,
    ArrowRight,
    FileText,
    School
} from 'lucide-react';

export const AboutView = ({ navigate }) => {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
            {/* PAGE HEADER */}
            <header className="space-y-4 pb-6 border-b-2 border-brand-cerulean/20">
                <div className="flex items-center gap-2 text-xs font-sans text-gray-500 uppercase tracking-widest">
                    <button onClick={() => navigate('landing')} className="hover:text-brand-jasper transition-colors">
                        Trang chủ
                    </button>
                    <span>/</span>
                    <span className="text-brand-cerulean font-bold">Giới thiệu</span>
                </div>
                <h1 className="font-serif-title text-4xl sm:text-5xl text-brand-cerulean font-bold tracking-tight">
                    Về Chương Trình Bồi Dưỡng & Nền Tảng Pedagogy
                </h1>
                <p className="font-serif text-lg text-gray-700 leading-relaxed max-w-3xl">
                    Cầu nối vững chắc đưa cử nhân khoa học cơ bản tự tin bước lên bục giảng phổ thông, đáp ứng trọn vẹn chuẩn trình độ nhà giáo theo Luật Giáo dục 2019 và các thông tư của Bộ Giáo dục & Đào tạo.
                </p>
            </header>

            {/* ORIGIN & MISSION */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Sứ mệnh cốt lõi
                    </span>
                    <h2 className="font-serif-title text-2xl sm:text-3xl text-brand-cerulean font-bold">
                        Đổi Mới Phương Thức Rèn Nghề Sư Phạm Trong Kỷ Nguyên Số
                    </h2>
                    <p className="font-serif text-base text-gray-700 leading-relaxed">
                        Hàng năm, hàng nghìn cử nhân xuất sắc tốt nghiệp các ngành Toán học, Vật lý, Hóa học, Sinh học, Ngữ văn, Lịch sử, Ngoại ngữ và Công nghệ thông tin nuôi dưỡng ước mơ trở thành thầy cô giáo. Họ sở hữu nền tảng học thuật chuyên sâu và tư duy sắc bén, nhưng thường gặp rào cản lớn về phương pháp sư phạm, tâm lý học lứa tuổi, và kỹ thuật tổ chức bài giảng theo định hướng phát triển phẩm chất, năng lực.
                    </p>
                    <p className="font-serif text-base text-gray-700 leading-relaxed">
                        <strong>Pedagogy LMS</strong> được thiết kế nhằm đồng hành trọn vẹn cùng người học trong suốt 34–35 tín chỉ bồi dưỡng: từ việc tiếp cận lý luận dạy học hiện đại, thực hành soạn giáo án chuẩn Công văn 5512, quản lý giờ dự giờ, đến tự đánh giá theo chuẩn nghề nghiệp Thông tư 20/2018 và xuất bản hồ sơ năng lực sư phạm e-Portfolio hoàn chỉnh.
                    </p>
                </div>

                <div className="md:col-span-5">
                    <div className="bg-white border-editorial p-6 sm:p-8 shadow-editorial space-y-4">
                        <div className="flex items-center gap-3 text-brand-cerulean">
                            <Compass size={28} className="text-brand-jasper" />
                            <h3 className="font-serif-title text-xl font-bold">Tầm Nhìn 2030</h3>
                        </div>
                        <p className="font-serif text-sm text-gray-600 leading-relaxed">
                            Trở thành nền tảng số hóa tiêu biểu trong hệ sinh thái bồi dưỡng thường xuyên và đào tạo giáo viên của Việt Nam, gắn kết chặt chẽ giữa trường đại học sư phạm, cơ sở thực tập phổ thông và học viên.
                        </p>
                        <div className="pt-3 border-t border-brand-cerulean/15 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-sans font-bold text-gray-800">
                                <CheckCircle2 size={14} className="text-emerald-700" />
                                <span>Chuẩn mực học thuật sư phạm</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-sans font-bold text-gray-800">
                                <CheckCircle2 size={14} className="text-emerald-700" />
                                <span>Công nghệ giáo dục trực quan</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-sans font-bold text-gray-800">
                                <CheckCircle2 size={14} className="text-emerald-700" />
                                <span>Học qua hành động & phản tư</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EDUCATIONAL PHILOSOPHY */}
            <section className="bg-white border-editorial p-8 sm:p-10 shadow-editorial space-y-6">
                <div className="border-b border-brand-cerulean/15 pb-4">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Định hướng sư phạm
                    </span>
                    <h2 className="font-serif-title text-2xl sm:text-3xl text-brand-cerulean font-bold">
                        Triết Lý Giáo Dục Khai Phóng & Dạy Học Tích Cực
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 p-4 bg-brand-cream/50 border border-brand-cerulean/15">
                        <h4 className="font-serif-title text-lg font-bold text-brand-cerulean">
                            1. Dạy học là thắp lửa
                        </h4>
                        <p className="font-serif text-sm text-gray-700 leading-relaxed">
                            Người thầy không chỉ truyền thụ kiến thức đơn thuần mà là người tổ chức, dẫn dắt học sinh tự khám phá chân lý, phát triển tư duy phản biện và óc sáng tạo.
                        </p>
                    </div>

                    <div className="space-y-2 p-4 bg-brand-cream/50 border border-brand-cerulean/15">
                        <h4 className="font-serif-title text-lg font-bold text-brand-cerulean">
                            2. Học qua trải nghiệm
                        </h4>
                        <p className="font-serif text-sm text-gray-700 leading-relaxed">
                            Nghiệp vụ sư phạm không thể học chay. Mỗi học phần đều gắn liền với tập giảng vi mô, phân tích video tiết dạy thực tế và thực hành dự giờ tại trường phổ thông.
                        </p>
                    </div>

                    <div className="space-y-2 p-4 bg-brand-cream/50 border border-brand-cerulean/15">
                        <h4 className="font-serif-title text-lg font-bold text-brand-cerulean">
                            3. Phản tư nghề nghiệp
                        </h4>
                        <p className="font-serif text-sm text-gray-700 leading-relaxed">
                            Nhà giáo tiến bộ nhờ liên tục nhìn nhận lại giờ dạy của mình qua sổ ghi chép bài học, ý kiến đóng góp của giảng viên hướng dẫn và học sinh.
                        </p>
                    </div>
                </div>
            </section>

            {/* BENEFICIARIES & ELIGIBILITY */}
            <section className="space-y-6">
                <div className="space-y-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Tuyển sinh & Đào tạo
                    </span>
                    <h2 className="font-serif-title text-3xl text-brand-cerulean font-bold">
                        Ai Cần Tham Gia Khóa Bồi Dưỡng Nghiệp Vụ Sư Phạm?
                    </h2>
                    <p className="font-serif text-gray-600 text-base">
                        Theo quy định tại Thông tư 11/2021/TT-BGDĐT và Thông tư 12/2021/TT-BGDĐT, đối tượng tham gia chương trình bao gồm:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xs bg-brand-cerulean text-white flex items-center justify-center font-bold">
                                01
                            </div>
                            <div>
                                <h3 className="font-serif-title text-lg font-bold text-brand-cerulean">
                                    Cử nhân Ngoài Sư phạm Muốn Trở Thành Giáo Viên
                                </h3>
                                <p className="text-xs font-sans text-gray-500">Đối tượng chủ lực</p>
                            </div>
                        </div>
                        <p className="font-serif text-sm text-gray-700 leading-relaxed">
                            Người đã có bằng tốt nghiệp đại học các chuyên ngành khoa học tự nhiên, xã hội, ngoại ngữ, nghệ thuật hoặc thể thao (thuộc danh mục các môn học trong chương trình giáo dục phổ thông 2018) và có nguyện vọng trở thành giáo viên THCS hoặc THPT.
                        </p>
                        <div className="p-3 bg-brand-cream/60 border-l-3 border-brand-jasper text-xs font-serif text-gray-600">
                            Ví dụ: Cử nhân ngành Toán học, Hóa học, Ngôn ngữ Anh, Công nghệ thông tin, Lịch sử, Văn học...
                        </div>
                    </div>

                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xs bg-brand-cerulean text-white flex items-center justify-center font-bold">
                                02
                            </div>
                            <div>
                                <h3 className="font-serif-title text-lg font-bold text-brand-cerulean">
                                    Giáo Viên Hợp Đồng Cần Chuẩn Hóa Chức Danh
                                </h3>
                                <p className="text-xs font-sans text-gray-500">Chuẩn chức danh nghề nghiệp</p>
                            </div>
                        </div>
                        <p className="font-serif text-sm text-gray-700 leading-relaxed">
                            Các thầy cô đang giảng dạy theo hợp đồng lao động tại các trường phổ thông công lập, tư thục, trung tâm giáo dục thường xuyên hoặc trường quốc tế nhưng chưa có chứng chỉ nghiệp vụ sư phạm theo quy định tại Điều 72 Luật Giáo dục 2019.
                        </p>
                        <div className="p-3 bg-brand-cream/60 border-l-3 border-brand-jasper text-xs font-serif text-gray-600">
                            Giúp học viên hoàn thiện điều kiện cần để được ký hợp đồng chính thức, xét thăng hạng hoặc thi tuyển viên chức giáo dục.
                        </div>
                    </div>
                </div>
            </section>

            {/* TRAINING INSTITUTION & COMMITMENTS */}
            <section className="bg-white border-editorial p-8 sm:p-10 shadow-editorial space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-cerulean/15">
                    <div className="space-y-1">
                        <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                            Cơ sở giáo dục liên kết
                        </span>
                        <h2 className="font-serif-title text-2xl sm:text-3xl text-brand-cerulean font-bold">
                            Trường Đại Học Sư Phạm TP. Hồ Chí Minh (HCMUE)
                        </h2>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 font-sans text-xs font-bold uppercase tracking-wider rounded-xs">
                        Đơn vị trọng điểm quốc gia
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-2">
                        <h4 className="font-serif-title font-bold text-base text-brand-cerulean">
                            Uy tín học thuật gần 50 năm
                        </h4>
                        <p className="font-serif text-gray-600 leading-relaxed">
                            Đại học Sư phạm TP.HCM là cái nôi đào tạo và bồi dưỡng hàng vạn nhà giáo xuất sắc cho các tỉnh thành phía Nam và cả nước.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-serif-title font-bold text-base text-brand-cerulean">
                            Đội ngũ Giảng viên Đầu ngành
                        </h4>
                        <p className="font-serif text-gray-600 leading-relaxed">
                            100% học phần được phụ trách bởi các Giáo sư, Phó Giáo sư, Tiến sĩ và Thạc sĩ chuyên ngành Phương pháp dạy học và Tâm lý học giáo dục.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-serif-title font-bold text-base text-brand-cerulean">
                            Mạng lưới Trường Phổ thông Đối tác
                        </h4>
                        <p className="font-serif text-gray-600 leading-relaxed">
                            Hệ thống hơn 50 trường THCS và THPT chất lượng cao tại TP.HCM tiếp nhận học viên đến kiến tập và thực tập sư phạm thực chiến.
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-brand-cerulean/15 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-sans text-gray-600">
                        <ShieldCheck size={16} className="text-brand-jasper" />
                        <span>Chứng chỉ có giá trị pháp lý vĩnh viễn trên phạm vi toàn quốc.</span>
                    </div>
                    <button
                        onClick={() => navigate('history')}
                        className="text-xs font-sans font-bold text-brand-cerulean hover:text-brand-jasper flex items-center gap-1 uppercase tracking-wider"
                    >
                        <span>Tìm hiểu lịch sử pháp lý chứng chỉ</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </section>
        </div>
    );
};
