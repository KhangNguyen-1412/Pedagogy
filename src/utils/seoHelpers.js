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

export const removeVietnameseTones = (str) => {
    if (!str) return '';
    return str
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .toLowerCase()
        .trim();
};

// Auto-generate HCMUE lecturer email according to standard: [tên ko dấu] + [họ và tên lót viết tắt] + @lecturer.hcmue.edu.vn
export const generateHcmueLecturerEmail = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return '';

    // Remove academic titles & honorifics (GS, PGS, TS, ThS, TSKH, CN, KS, BS, Thầy, Cô...)
    let clean = fullName
        .replace(/\b(gs|pgs|tskh|ts|ths|cn|ks|bs|thay|co)\b\.?/gi, '')
        .replace(/[.,;:()_/\-]/g, ' ')
        .trim();

    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';

    if (words.length === 1) {
        const tenNoTone = removeVietnameseTones(words[0]).replace(/[^a-z0-9]/g, '');
        return tenNoTone ? `${tenNoTone}@lecturer.hcmue.edu.vn` : '';
    }

    const ten = words[words.length - 1];
    const hoVaTenLot = words.slice(0, words.length - 1);

    const tenNoTone = removeVietnameseTones(ten).replace(/[^a-z0-9]/g, '');
    const hoVaTenLotInitials = hoVaTenLot
        .map(w => {
            const noTone = removeVietnameseTones(w).replace(/[^a-z0-9]/g, '');
            return noTone.charAt(0);
        })
        .filter(Boolean)
        .join('');

    if (!tenNoTone) return '';
    return `${tenNoTone}${hoVaTenLotInitials}@lecturer.hcmue.edu.vn`;
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

        default:
            return {
                title: 'Pedagogy - Nền Tảng Giáo Dục & Đào Tạo Sư Phạm Toàn Diện',
                description: 'Hệ thống cá nhân hóa học tập, quản lý chương trình đào tạo nghiệp vụ sư phạm và luyện thi IELTS Academic.',
                path: '/'
            };
    }
};

export const getViewFromPath = (pathname, programs = [], modules = []) => {
    const cleanPath = pathname ? pathname.replace(/\/$/, '') : '';
    if (cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html') return { view: 'dashboard' };
    if (cleanPath === '/chuong-trinh-dao-tao') return { view: 'programs' };
    if (cleanPath === '/de-cuong-hoc-phan') return { view: 'syllabus' };
    if (cleanPath === '/lich-bieu-diem-danh') return { view: 'calendar' };
    if (cleanPath === '/bang-diem-gpa') return { view: 'gradebook' };
    if (cleanPath === '/tai-lieu-nhat-ky') return { view: 'resources' };
    if (cleanPath === '/ho-so-ca-nhan') return { view: 'profile' };


    // IELTS
    if (cleanPath === '/ielts' || cleanPath === '/ielts/phuong-phap-rubrics') return { view: 'ielts_methodology' };
    if (cleanPath === '/ielts/luyen-dang-bai') return { view: 'ielts_drills' };
    if (cleanPath === '/ielts/writing-lab') return { view: 'ielts_writing_lab' };
    if (cleanPath === '/ielts/speaking-lab') return { view: 'ielts_speaking_lab' };
    if (cleanPath === '/ielts/thi-thu-truc-tuyen') return { view: 'ielts_simulator' };
    if (cleanPath === '/ielts/language-gym') return { view: 'ielts_gym' };
    if (cleanPath === '/ielts/bao-cao-tien-do') return { view: 'ielts_analytics' };



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
