// SEO & Friendly URL Helpers
export const slugify = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// Helper to dynamically format module names containing bracketed placeholders with user's selected teaching subject
export const formatModuleName = (name, subject) => {
    if (!name) return '';
    if (!subject) return name;
    return name.replace(/\[[^\]]+\]/gi, subject);
};

export const getSEOAndPath = (currentView, activeProgramId, activeModuleId, programs, modules) => {
    switch (currentView) {
        case 'dashboard':
            return {
                title: 'Tổng Quan Tiến Độ & GPA | Pedagogy - Hệ Thống Quản Lý Giáo Dục Cá Nhân',
                description: 'Trang tổng quan cá nhân theo dõi tín chỉ tích lũy, GPA hệ 4.0, xếp loại học lực và lịch học sắp tới.',
                path: '/'
            };
        case 'programs':
            return {
                title: 'Danh Sách Chương Trình Đào Tạo & Quy Tắc Tín Chỉ | Pedagogy',
                description: 'Danh sách tất cả các chương trình đào tạo sư phạm, cấu trúc khối kiến thức và tổng tín chỉ yêu cầu.',
                path: '/chuong-trinh-dao-tao'
            };
        case 'program_detail': {
            const prog = programs.find(p => p.id === activeProgramId);
            const nameSlug = slugify(prog?.name || 'detail');
            return {
                title: `${prog?.name || 'Chi Tiết Chương Trình'} | Pedagogy`,
                description: prog?.description || 'Chi tiết các học phần trong chương trình đào tạo sư phạm.',
                path: `/chuong-trinh-dao-tao/${nameSlug}`
            };
        }
        case 'module_detail': {
            const mod = modules.find(m => m.id === activeModuleId);
            const codeSlug = slugify(mod?.code || '');
            const nameSlug = slugify(mod?.name || 'hoc-phan');
            return {
                title: `${mod?.code ? `[${mod.code}] ` : ''}${mod?.name || 'Chi Tiết Học Phần'} | Pedagogy`,
                description: `Thông tin chi tiết môn ${mod?.name || ''}, chuẩn đầu ra CLOs, kết quả học tập và số tín chỉ.`,
                path: `/hoc-phan/${codeSlug ? `${codeSlug}-` : ''}${nameSlug}`
            };
        }
        case 'syllabus':
            return {
                title: 'Quản Lý Đề Cương & Chuẩn Đầu Ra (CLOs) | Pedagogy',
                description: 'Thiết lập đề cương chi tiết học phần, tỷ lệ trọng số điểm chuyên cần, giữa kỳ, cuối kỳ và CLOs.',
                path: '/de-cuong-hoc-phan'
            };
        case 'calendar':
            return {
                title: 'Lịch Biểu & Điểm Danh Từng Buổi | Pedagogy',
                description: 'Lịch học, lịch thi dạng lưới tháng (Calendar Grid), link Google Meet/Zoom và điểm danh chuyên cần.',
                path: '/lich-bieu-diem-danh'
            };
        case 'gradebook':
            return {
                title: 'Sổ Điểm & Tự Động Tính Toán GPA Hệ 4.0 | Pedagogy',
                description: 'Bảng điểm chi tiết học phần, tự động tính điểm tổng kết hệ 10, chuyển đổi điểm chữ A, B, C và GPA.',
                path: '/bang-diem-gpa'
            };
        case 'resources':
            return {
                title: 'Tài Liệu & Nhật Ký Học Tập | Pedagogy',
                description: 'Lưu trữ link tài liệu Google Drive, bài giảng slide PDF và nhật ký ghi chép tiến trình học tập.',
                path: '/tai-lieu-nhat-ky'
            };
        case 'profile':
            return {
                title: 'Hồ Sơ & Thông Tin Cá Nhân | Pedagogy',
                description: 'Quản lý thông tin mã học viên, lớp khóa học, khoa Sư phạm Kỹ thuật.',
                path: '/ho-so-ca-nhan'
            };
        case 'thpt_exams':
            return {
                title: 'Kho Đề Thi THPT & Đáp Án Chi Tiết | Pedagogy',
                description: 'Quản lý kho đề thi thử, đề chính thức THPT Quốc gia, công thức toán KaTeX và lời giải chi tiết.',
                path: '/de-thi-thpt'
            };
        case 'thpt_goals':
            return {
                title: 'Mục Tiêu & Kế Hoạch Ôn Thi THPT 2026 | Pedagogy',
                description: 'Mục tiêu điểm số Đại học, lộ trình ôn thi 4 giai đoạn và sổ tay rút kinh nghiệm cá nhân.',
                path: '/muc-tieu-thpt'
            };
        case 'thpt_tracking':
            return {
                title: 'Bảng Theo Dõi & Lịch Sử Làm Đề THPT | Pedagogy',
                description: 'Lịch sử làm bài thi, phân tích biểu đồ biến thiên điểm số và so sánh điểm trung bình với mục tiêu.',
                path: '/lich-su-thi-thpt'
            };
        case 'thpt_admission':
            return {
                title: 'Dự Báo Điểm Chuẩn & Xét Tuyển Đại Học 2026 | Pedagogy',
                description: 'Công cụ tính điểm tổ hợp A00, B00, C00, D01 và dự báo khả năng trúng tuyển các trường đại học.',
                path: '/xet-tuyen-thpt'
            };
        case 'thpt_transcripts':
            return {
                title: 'Học Bạ Số & Điểm Trung Bình THPT (Lớp 10, 11, 12) | Pedagogy',
                description: 'Bảng điểm học bạ số 3 năm THPT, tự động tính điểm trung bình cả năm phục vụ xét tuyển học bạ.',
                path: '/hoc-ba-thpt'
            };
        case 'ts10_math':
            return {
                title: 'Ôn Thi Tuyển Sinh 10 - Chuyên Đề Môn Toán | Pedagogy',
                description: 'Hệ thống kiến thức Đại số, Hình học và Toán thực tế thi vào lớp 10 theo chuẩn Sở GD&ĐT.',
                path: '/tuyen-sinh-10/toan'
            };
        case 'ts10_literature':
            return {
                title: 'Ôn Thi Tuyển Sinh 10 - Sơ Đồ Tư Duy & Dàn Ý Ngữ Văn | Pedagogy',
                description: 'Mindmap các tác phẩm Văn học lớp 9, dàn bài Nghị luận xã hội & Nghị luận văn học vào 10.',
                path: '/tuyen-sinh-10/ngu-van'
            };
        case 'ts10_english':
            return {
                title: 'Ôn Thi Tuyển Sinh 10 - Ngữ Pháp & Viết Lại Câu Tiếng Anh | Pedagogy',
                description: 'Tổng hợp ngữ pháp trọng tâm, trắc nghiệm phân tích bẫy lỗi sai và bài tập viết lại câu thi vào 10.',
                path: '/tuyen-sinh-10/tieng-anh'
            };
        case 'ts10_matrix':
            return {
                title: 'Ma Trận & Phân Tích Cấu Trúc Đề Thi Vào 10 Các Tỉnh | Pedagogy',
                description: 'So sánh cấu trúc đề thi, độ phân hóa và phổ điểm chuẩn tuyển sinh lớp 10 TP.HCM, Hà Nội, Đà Nẵng.',
                path: '/tuyen-sinh-10/ma-tran-de-thi'
            };
        case 'ts10_correction':
            return {
                title: 'Phòng Luyện Đề & Sửa Bài Tuyển Sinh 10 Trực Tuyến | Pedagogy',
                description: 'Trạm nộp bài và nhận phản hồi, đối chiếu barem điểm chi tiết từng bước theo chuẩn giám khảo.',
                path: '/tuyen-sinh-10/sua-bai-truc-tuyen'
            };
        case 'ts10_roadmap':
            return {
                title: 'Lộ Trình Ôn Thi Tuyển Sinh 10 & Báo Cáo Tiến Độ | Pedagogy',
                description: 'Kế hoạch ôn thi 3 giai đoạn (Nền tảng, Tổng ôn, Luyện đề) và đánh giá xác suất đỗ Nguyện vọng 1.',
                path: '/tuyen-sinh-10/lo-trinh-tien-do'
            };
        case 'ielts_hub':
        case 'ielts_methodology':
            return {
                title: 'IELTS Academic - Phương Pháp & Tiêu Chí Chấm Band 7.5+ | Pedagogy',
                description: 'Phân tích tiêu chí chấm 4 kỹ năng IELTS, ma trận Band Descriptors và khung tư duy PEEL, 5W1H.',
                path: '/ielts/phuong-phap-rubrics'
            };
        case 'ielts_drills':
            return {
                title: 'IELTS Academic - Luyện Dạng Bài Trọng Tâm (Micro-Drills) | Pedagogy',
                description: 'Kho bài tập ngắn 3-5 phút theo từng dạng câu hỏi khó: Matching Headings, True/False/Not Given, Audio Drills.',
                path: '/ielts/luyen-dang-bai'
            };
        case 'ielts_writing_lab':
            return {
                title: 'IELTS Writing Lab - Phòng Soạn Thảo & Dàn Ý Giám Khảo | Pedagogy',
                description: 'Giao diện Split-Screen viết bài Task 1 & Task 2, đếm từ real-time, đồng hồ bấm giờ và bài mẫu 8.5+.',
                path: '/ielts/writing-lab'
            };
        case 'ielts_speaking_lab':
            return {
                title: 'IELTS Speaking Lab - Trạm Thu Âm & Cue Card Giám Khảo | Pedagogy',
                description: 'Thu âm trực tiếp bài nói Speaking Part 1, 2, 3 trên trình duyệt, dàn ý 5W1H và bài mẫu Cambridge 8.0+.',
                path: '/ielts/speaking-lab'
            };
        case 'ielts_simulator':
            return {
                title: 'IELTS Exam Simulator - Phòng Thi Thử Trực Tuyến 3 Giờ | Pedagogy',
                description: 'Mô phỏng kỳ thi máy tính IELTS Computer-Delivered với đồng hồ đếm ngược và bảng điểm sau nộp bài.',
                path: '/ielts/thi-thu-truc-tuyen'
            };
        case 'ielts_gym':
            return {
                title: 'IELTS Language Gym - Flashcards Collocations & Ngữ Pháp 7.5+ | Pedagogy',
                description: 'Luyện phản xạ từ vựng học thuật C1/C2 theo chủ đề, phát âm UK và bài tập cấu trúc ngữ pháp nâng cao.',
                path: '/ielts/language-gym'
            };
        case 'ielts_analytics':
            return {
                title: 'Báo Cáo Tiến Độ & Gap Analysis IELTS 4 Kỹ Năng | Pedagogy',
                description: 'Định vị trình độ Diagnostic Placement, phân tích lỗ hổng kỹ năng và lộ trình cán mốc mục tiêu Target Band.',
                path: '/ielts/bao-cao-tien-do'
            };
        case 'mos_hub':
            return {
                title: 'Khối Tin Học Quốc Tế (MOS & IC3) - Virtual Sandbox | Pedagogy',
                description: 'Phòng thực hành ảo luyện thi chứng chỉ Tin học Quốc tế Microsoft Office Specialist và IC3 Digital Literacy GS6.',
                path: '/tin-hoc-quoc-te'
            };
        case 'mos_sandbox':
            return {
                title: 'Phòng Lab Ảo Mô Phỏng Multi-Project (MOS Word/Excel/PPT) | Pedagogy',
                description: 'Giao diện giả lập thanh Ribbon Microsoft Office và bảng điều khiển Certiport chấm điểm thao tác thực tế.',
                path: '/tin-hoc-quoc-te/phong-lab-ao'
            };
        case 'mos_projects':
            return {
                title: 'Kho Dự Án Multi-Projects MOS 2019/365 | Pedagogy',
                description: 'Dự án thực tế quản lý nhân sự HR, báo cáo tài chính, kỷ yếu nghiên cứu khoa học và slide thuyết trình.',
                path: '/tin-hoc-quoc-te/kho-du-an'
            };
        case 'ic3_lab':
            return {
                title: 'Phòng Lab Năng Lực Số & An Toàn Mạng IC3 GS6 | Pedagogy',
                description: 'Chẩn đoán Phishing email lừa đảo, mô phỏng CLI mạng và thiết lập xác thực 2FA an toàn.',
                path: '/tin-hoc-quoc-te/ic3-digital-lab'
            };
        case 'mos_analytics':
            return {
                title: 'Bản Đồ Nhiệt Lỗi Sai & Huy Hiệu MOS/IC3 | Pedagogy',
                description: 'Bản đồ nhiệt Error Heatmap theo Ribbon Tab, đo tốc độ hoàn thành Task và bảng vinh danh chứng nhận điện tử.',
                path: '/tin-hoc-quoc-te/chuan-doan-huy-hieu'
            };
        default:
            return {
                title: 'Pedagogy - Nền Tảng Giáo Dục & Đào Tạo Sư Phạm Toàn Diện',
                description: 'Hệ thống cá nhân hóa học tập, quản lý chương trình sư phạm, luyện thi THPT Quốc gia, Vào 10 và IELTS.',
                path: '/'
            };
    }
};

export const getViewFromPath = (pathname, programs = [], modules = []) => {
    const cleanPath = pathname ? pathname.replace(/\/$/, '') : '';
    if (cleanPath === '' || cleanPath === '/') return { view: 'dashboard' };
    if (cleanPath === '/chuong-trinh-dao-tao') return { view: 'programs' };
    if (cleanPath === '/de-cuong-hoc-phan') return { view: 'syllabus' };
    if (cleanPath === '/lich-bieu-diem-danh') return { view: 'calendar' };
    if (cleanPath === '/bang-diem-gpa') return { view: 'gradebook' };
    if (cleanPath === '/tai-lieu-nhat-ky') return { view: 'resources' };
    if (cleanPath === '/ho-so-ca-nhan') return { view: 'profile' };
    if (cleanPath === '/de-thi-thpt') return { view: 'thpt_exams' };
    if (cleanPath === '/muc-tieu-thpt') return { view: 'thpt_goals' };
    if (cleanPath === '/lich-su-thi-thpt') return { view: 'thpt_tracking' };
    if (cleanPath === '/xet-tuyen-thpt') return { view: 'thpt_admission' };
    if (cleanPath === '/hoc-ba-thpt') return { view: 'thpt_transcripts' };

    // TS10
    if (cleanPath === '/tuyen-sinh-10/toan') return { view: 'ts10_math' };
    if (cleanPath === '/tuyen-sinh-10/ngu-van') return { view: 'ts10_literature' };
    if (cleanPath === '/tuyen-sinh-10/tieng-anh') return { view: 'ts10_english' };
    if (cleanPath === '/tuyen-sinh-10/ma-tran-de-thi') return { view: 'ts10_matrix' };
    if (cleanPath === '/tuyen-sinh-10/sua-bai-truc-tuyen') return { view: 'ts10_correction' };
    if (cleanPath === '/tuyen-sinh-10/lo-trinh-tien-do') return { view: 'ts10_roadmap' };

    // IELTS
    if (cleanPath === '/ielts' || cleanPath === '/ielts/phuong-phap-rubrics') return { view: 'ielts_methodology' };
    if (cleanPath === '/ielts/luyen-dang-bai') return { view: 'ielts_drills' };
    if (cleanPath === '/ielts/writing-lab') return { view: 'ielts_writing_lab' };
    if (cleanPath === '/ielts/speaking-lab') return { view: 'ielts_speaking_lab' };
    if (cleanPath === '/ielts/thi-thu-truc-tuyen') return { view: 'ielts_simulator' };
    if (cleanPath === '/ielts/language-gym') return { view: 'ielts_gym' };
    if (cleanPath === '/ielts/bao-cao-tien-do') return { view: 'ielts_analytics' };

    // MOS & IC3
    if (cleanPath === '/tin-hoc-quoc-te') return { view: 'mos_hub' };
    if (cleanPath === '/tin-hoc-quoc-te/phong-lab-ao') return { view: 'mos_sandbox' };
    if (cleanPath === '/tin-hoc-quoc-te/kho-du-an') return { view: 'mos_projects' };
    if (cleanPath === '/tin-hoc-quoc-te/ic3-digital-lab') return { view: 'ic3_lab' };
    if (cleanPath === '/tin-hoc-quoc-te/chuan-doan-huy-hieu') return { view: 'mos_analytics' };

    if (cleanPath.startsWith('/chuong-trinh-dao-tao/')) {
        const slug = cleanPath.replace('/chuong-trinh-dao-tao/', '');
        const matched = programs.find(p => slugify(p.name) === slug);
        if (matched) return { view: 'program_detail', programId: matched.id };
        return { view: 'programs' };
    }

    if (cleanPath.startsWith('/hoc-phan/')) {
        const slug = cleanPath.replace('/hoc-phan/', '');
        const matched = modules.find(m => {
            const codeSlug = slugify(m.code || '');
            const nameSlug = slugify(m.name || '');
            return (codeSlug && slug === `${codeSlug}-${nameSlug}`) || slug === nameSlug;
        });
        if (matched) return { view: 'module_detail', moduleId: matched.id };
        return { view: 'programs' };
    }

    return { view: 'dashboard' };
};
