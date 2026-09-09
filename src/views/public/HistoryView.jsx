import React from 'react';
import {
    Calendar,
    BookOpen,
    Scale,
    CheckCircle2,
    ShieldCheck,
    Award,
    FileText,
    ArrowRight,
    HelpCircle,
    Info,
    Clock
} from 'lucide-react';

export const HistoryView = ({ navigate }) => {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
            {/* PAGE HEADER */}
            <header className="space-y-4 pb-6 border-b-2 border-brand-cerulean/20">
                <div className="flex items-center gap-2 text-xs font-sans text-gray-500 uppercase tracking-widest">
                    <button onClick={() => navigate('landing')} className="hover:text-brand-jasper transition-colors">
                        Trang chủ
                    </button>
                    <span>/</span>
                    <span className="text-brand-cerulean font-bold">Lịch sử Chứng chỉ NVSP</span>
                </div>
                <h1 className="font-serif-title text-4xl sm:text-5xl text-brand-cerulean font-bold tracking-tight">
                    Lịch Sử Phát Triển & Khung Pháp Lý Của Chứng Chỉ Nghiệp Vụ Sư Phạm
                </h1>
                <p className="font-serif text-lg text-gray-700 leading-relaxed max-w-3xl">
                    Hành trình 30 năm hoàn thiện chuẩn chức danh nghề nghiệp nhà giáo tại Việt Nam và bước ngoặt lịch sử mở ra cơ hội đứng lớp cho cử nhân ngoài sư phạm theo Luật Giáo dục 2019.
                </p>
            </header>

            {/* HISTORICAL TIMELINE */}
            <section className="space-y-8">
                <div className="border-b border-brand-cerulean/15 pb-4">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Dòng thời gian
                    </span>
                    <h2 className="font-serif-title text-2xl sm:text-3xl text-brand-cerulean font-bold">
                        Bốn Giai Đoạn Tiến Hóa Của Chứng Chỉ Sư Phạm Tại Việt Nam
                    </h2>
                </div>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-brand-cerulean/20">
                    {/* Era 1 */}
                    <div className="relative flex items-start gap-6 pl-10">
                        <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-brand-cream border-4 border-brand-cerulean shadow-xs"></div>
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-3 flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="text-xs font-sans font-bold px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean rounded-xs">
                                    Giai đoạn trước năm 2005
                                </span>
                                <span className="text-xs font-sans text-gray-500">Khởi thủy hệ thống chứng chỉ</span>
                            </div>
                            <h3 className="font-serif-title text-xl font-bold text-brand-cerulean">
                                Chứng Chỉ Nghiệp Vụ Sư Phạm Bậc 1 & Bậc 2
                            </h3>
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                                Trong giai đoạn này, Bộ Giáo dục & Đào tạo quy định 2 cấp độ:
                            </p>
                            <ul className="text-xs font-sans space-y-1.5 text-gray-600 list-disc list-inside">
                                <li><strong>NVSP Bậc 1:</strong> Dành cho người muốn dạy Tiểu học và THCS (khoảng 15–18 đơn vị học trình).</li>
                                <li><strong>NVSP Bậc 2:</strong> Dành cho người muốn dạy THPT, Trung cấp chuyên nghiệp, Cao đẳng và Đại học (khoảng 20–25 đơn vị học trình).</li>
                            </ul>
                        </div>
                    </div>

                    {/* Era 2 */}
                    <div className="relative flex items-start gap-6 pl-10">
                        <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-brand-cream border-4 border-brand-cerulean shadow-xs"></div>
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-3 flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="text-xs font-sans font-bold px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean rounded-xs">
                                    Giai đoạn 2007 – 2014
                                </span>
                                <span className="text-xs font-sans text-gray-500">Quyết định 31/2007/QĐ-BGDĐT</span>
                            </div>
                            <h3 className="font-serif-title text-xl font-bold text-brand-cerulean">
                                Chuyển Đổi Sang Học Chế Tín Chỉ & Phân Nhánh Chuyên Biệt
                            </h3>
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                                Bộ GD&ĐT ban hành chương trình khung bồi dưỡng nghiệp vụ sư phạm theo học chế tín chỉ. Phân tách rõ chứng chỉ bồi dưỡng cho giảng viên Đại học - Cao đẳng, giáo viên TCCN và giáo viên phổ thông, chuẩn hóa hồ sơ đánh giá và cấp phát chứng chỉ.
                            </p>
                        </div>
                    </div>

                    {/* Era 3 */}
                    <div className="relative flex items-start gap-6 pl-10">
                        <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-brand-cream border-4 border-amber-600 shadow-xs"></div>
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-3 flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="text-xs font-sans font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-xs">
                                    Giai đoạn 2014 – 2021
                                </span>
                                <span className="text-xs font-sans text-gray-500">Tái cơ cấu & Chấn chỉnh toàn quốc</span>
                            </div>
                            <h3 className="font-serif-title text-xl font-bold text-brand-cerulean">
                                Tạm Dừng Đào Tạo Để Nâng Chuẩn Trình Độ Nhà Giáo
                            </h3>
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                                Bộ GD&ĐT ban hành Công văn số 3326/BGDĐT-NGCBQLGD tạm dừng tổ chức đào tạo, cấp chứng chỉ NVSP cho người tốt nghiệp đại học muốn làm giáo viên phổ thông để giải quyết tình trạng thừa - thiếu cục bộ giáo viên, đồng thời chuẩn bị căn cứ ban hành Luật Giáo dục mới.
                            </p>
                        </div>
                    </div>

                    {/* Era 4 */}
                    <div className="relative flex items-start gap-6 pl-10">
                        <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-brand-jasper border-4 border-brand-cream shadow-xs"></div>
                        <div className="bg-white border-editorial p-6 shadow-editorial space-y-4 flex-1 border-brand-jasper">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="text-xs font-sans font-bold px-2.5 py-1 bg-brand-jasper text-white rounded-xs">
                                    Từ ngày 22/05/2021 đến nay (Hiện hành)
                                </span>
                                <span className="text-xs font-sans font-bold text-brand-jasper">Bước ngoặt lịch sử</span>
                            </div>
                            <h3 className="font-serif-title text-2xl font-bold text-brand-cerulean">
                                Ban Hành Thông Tư 11 & 12/2021/TT-BGDĐT: Chuẩn Mực Mới
                            </h3>
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                                Ngày 05/04/2021, Bộ trưởng Bộ GD&ĐT chính thức ký ban hành Thông tư số 11/2021 (cho giáo viên THCS) và Thông tư số 12/2021 (cho giáo viên THPT). Chương trình nâng dung lượng lên 34–35 tín chỉ thực chất, tăng cường thời lượng kiến tập và thực tập sư phạm thực chiến tại các trường phổ thông.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEGAL BASIS: LUẬT GIÁO DỤC 2019 */}
            <section className="bg-white border-editorial p-8 sm:p-10 shadow-editorial space-y-6">
                <div className="flex items-center gap-3 border-b border-brand-cerulean/15 pb-4">
                    <Scale size={28} className="text-brand-jasper" />
                    <div>
                        <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                            Căn cứ pháp lý cao nhất
                        </span>
                        <h2 className="font-serif-title text-2xl sm:text-3xl text-brand-cerulean font-bold">
                            Điều 72 Luật Giáo Dục 2019: Chuẩn Trình Độ Nhà Giáo
                        </h2>
                    </div>
                </div>

                <div className="p-5 bg-brand-cream/60 border-l-4 border-brand-cerulean font-serif text-base text-gray-800 leading-relaxed italic">
                    "1. Chuẩn trình độ đào tạo của nhà giáo được quy định như sau:<br />
                    b) Có bằng cử nhân thuộc ngành đào tạo giáo viên trở lên đối với giáo viên tiểu học, trung học cơ sở, trung học phổ thông.<br />
                    Trường hợp môn học chưa đủ giáo viên có bằng cử nhân thuộc ngành đào tạo giáo viên thì <strong className="not-italic text-brand-cerulean font-bold underline">phải có bằng cử nhân chuyên ngành phù hợp và có chứng chỉ bồi dưỡng nghiệp vụ sư phạm</strong>."
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-serif text-gray-700">
                    <div className="space-y-2">
                        <h4 className="font-serif-title font-bold text-base text-brand-cerulean">
                            Ý nghĩa pháp lý
                        </h4>
                        <p className="leading-relaxed">
                            Quy định này hợp pháp hóa con đường trở thành giáo viên công lập và tư thục của cử nhân tốt nghiệp các trường đại học đa ngành, miễn là có bằng cử nhân chuyên ngành phù hợp với môn học giảng dạy.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-serif-title font-bold text-base text-brand-cerulean">
                            Bình đẳng trong tuyển dụng
                        </h4>
                        <p className="leading-relaxed">
                            Người có Bằng Cử nhân Chuyên ngành + Chứng chỉ NVSP (TT11 hoặc TT12) có giá trị dự thi tuyển viên chức giáo dục hoàn toàn tương đương với người tốt nghiệp Đại học Sư phạm chính quy.
                        </p>
                    </div>
                </div>
            </section>

            {/* COMPARISON TABLE: TT11 VS TT12 */}
            <section className="space-y-6">
                <div className="space-y-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Đối chiếu chi tiết
                    </span>
                    <h2 className="font-serif-title text-3xl text-brand-cerulean font-bold">
                        So Sánh Chương Trình THCS (TT 11) Và Chương Trình THPT (TT 12)
                    </h2>
                </div>

                <div className="bg-white border-editorial shadow-editorial overflow-x-auto">
                    <table className="w-full text-left font-serif text-sm border-collapse">
                        <thead>
                            <tr className="bg-brand-cerulean text-white font-sans text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 border-r border-white/20">Tiêu chí</th>
                                <th className="p-4 border-r border-white/20">Chương trình THCS (Thông tư 11/2021)</th>
                                <th className="p-4">Chương trình THPT (Thông tư 12/2021)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-cerulean/15">
                            <tr>
                                <td className="p-4 font-sans font-bold bg-brand-cream/40 border-r border-brand-cerulean/15">
                                    Tổng số tín chỉ
                                </td>
                                <td className="p-4 border-r border-brand-cerulean/15 font-bold text-brand-cerulean">
                                    34 Tín chỉ
                                </td>
                                <td className="p-4 font-bold text-brand-jasper">
                                    34 – 35 Tín chỉ
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-sans font-bold bg-brand-cream/40 border-r border-brand-cerulean/15">
                                    Khối kiến thức chung
                                </td>
                                <td className="p-4 border-r border-brand-cerulean/15">
                                    17 Tín chỉ (Tâm lý học, Giáo dục học, Lý luận dạy học, Ứng dụng CNTT, Quản lý lớp)
                                </td>
                                <td className="p-4">
                                    15 Tín chỉ (Tâm lý học, Giáo dục học, Lý luận dạy học, Ứng dụng CNTT, Quản lý lớp)
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-sans font-bold bg-brand-cream/40 border-r border-brand-cerulean/15">
                                    Khối kiến thức nhánh
                                </td>
                                <td className="p-4 border-r border-brand-cerulean/15">
                                    17 Tín chỉ (Tập trung phương pháp dạy học tích hợp THCS và lứa tuổi thiếu niên 11-15 tuổi)
                                </td>
                                <td className="p-4">
                                    19 – 20 Tín chỉ (Tập trung phương pháp dạy học phân hóa, hướng nghiệp sâu lứa tuổi 15-18 tuổi)
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-sans font-bold bg-brand-cream/40 border-r border-brand-cerulean/15">
                                    Thực tập sư phạm
                                </td>
                                <td className="p-4 border-r border-brand-cerulean/15">
                                    4 Tín chỉ (Thực tập tại trường THCS: Kiến tập & Thực tập giảng dạy)
                                </td>
                                <td className="p-4">
                                    4 Tín chỉ (Thực tập tại trường THPT: Kiến tập & Thực tập giảng dạy)
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-sans font-bold bg-brand-cream/40 border-r border-brand-cerulean/15">
                                    Đối tượng bằng cấp
                                </td>
                                <td className="p-4 border-r border-brand-cerulean/15">
                                    Cử nhân chuyên ngành phù hợp với các môn học cấp THCS
                                </td>
                                <td className="p-4">
                                    Cử nhân chuyên ngành phù hợp với các môn học cấp THPT
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-sans font-bold bg-brand-cream/40 border-r border-brand-cerulean/15">
                                    Phạm vi giảng dạy
                                </td>
                                <td className="p-4 border-r border-brand-cerulean/15">
                                    Được dạy cấp THCS và Tiểu học (đối với các môn chuyên biệt)
                                </td>
                                <td className="p-4">
                                    Được dạy cấp THPT, THCS và các cơ sở giáo dục nghề nghiệp
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* VALUE & EMPLOYMENT OPPORTUNITIES */}
            <section className="bg-white border-editorial p-8 sm:p-10 shadow-editorial space-y-6">
                <div className="border-b border-brand-cerulean/15 pb-4">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-jasper">
                        Cơ hội nghề nghiệp
                    </span>
                    <h2 className="font-serif-title text-2xl sm:text-3xl text-brand-cerulean font-bold">
                        Giá Trị Thực Tế Của Chứng Chỉ Nghiệp Vụ Sư Phạm
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 p-4 bg-brand-cream/50 border border-brand-cerulean/15">
                        <h4 className="font-serif-title text-base font-bold text-brand-cerulean">
                            1. Thi tuyển viên chức giáo dục
                        </h4>
                        <p className="font-serif text-xs text-gray-700 leading-relaxed">
                            Đáp ứng tiêu chuẩn dự thi kỳ thi tuyển dụng viên chức của tất cả 63 tỉnh/thành phố trên cả nước, được xếp vào ngạch viên chức giáo viên hạng III.
                        </p>
                    </div>

                    <div className="space-y-2 p-4 bg-brand-cream/50 border border-brand-cerulean/15">
                        <h4 className="font-serif-title text-base font-bold text-brand-cerulean">
                            2. Trường tư thục & quốc tế
                        </h4>
                        <p className="font-serif text-xs text-gray-700 leading-relaxed">
                            Điều kiện bắt buộc để các trường tư thục, trường song ngữ và trường quốc tế ký hợp đồng lao động chính thức và đăng ký danh sách giáo viên với Sở GD&ĐT.
                        </p>
                    </div>

                    <div className="space-y-2 p-4 bg-brand-cream/50 border border-brand-cerulean/15">
                        <h4 className="font-serif-title text-base font-bold text-brand-cerulean">
                            3. Giá trị sử dụng vĩnh viễn
                        </h4>
                        <p className="font-serif text-xs text-gray-700 leading-relaxed">
                            Chứng chỉ cấp theo Thông tư 11 & Thông tư 12 có giá trị sử dụng trọn đời, không có thời hạn hết hạn như một số chứng chỉ ngắn hạn khác.
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-brand-cerulean/15 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-xs font-sans text-gray-600">
                        Bạn cần được tư vấn ngành học của mình phù hợp với Thông tư 11 hay Thông tư 12?
                    </span>
                    <button
                        onClick={() => navigate('contact')}
                        className="px-5 py-2.5 bg-brand-cerulean text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-xs shadow-xs hover:bg-brand-cerulean/90 transition-all"
                    >
                        <span>Gửi câu hỏi tư vấn tuyển sinh</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </section>
        </div>
    );
};
