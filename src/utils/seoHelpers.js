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

        case 'practicum':
            return {
                title: 'Thực Tập & Kiến Tập Sư Phạm (TTSP) | Pedagogy',
                description: 'Quản lý hồ sơ thực tập sư phạm, sổ dự giờ điện tử Công văn 5555, nhật ký chủ nhiệm lớp và bảng điểm tổng kết.',
                path: '/thuc-tap-su-pham'
            };
        case 'lesson_plans':
            return {
                title: 'Kế Hoạch Bài Dạy (CV 5555) & Phòng Tập Giảng | Pedagogy',
                description: 'Soạn giáo án điện tử chuẩn Công văn 5555 với 4 hoạt động bài học và ghi nhận đánh giá tập giảng Micro-teaching.',
                path: '/ke-hoach-bai-day'
            };
        case 'competencies':
            return {
                title: 'Chuẩn Nghề Nghiệp Giáo Viên (TT 20/2018) & PLO | Pedagogy',
                description: 'Hệ thống tự đánh giá 5 tiêu chuẩn 15 tiêu chí nghề nghiệp giáo viên phổ thông và liên kết ma trận chuẩn đầu ra CTĐT.',
                path: '/chuan-nghe-nghiep'
            };
        case 'graduation':
            return {
                title: 'Thẩm Định Tốt Nghiệp & Cấp Chứng Chỉ NVSP | Pedagogy',
                description: 'Đối soát 5 tiêu chuẩn công nhận tốt nghiệp và xem trước phôi chứng chỉ nghiệp vụ sư phạm theo quy chuẩn Bộ GD&ĐT.',
                path: '/tham-dinh-tot-nghiep'
            };
        case 'portfolio_export':
            return {
                title: 'Xuất Bản Hồ Sơ Sư Phạm & Bảng Điểm In Ấn | Pedagogy',
                description: 'Trích xuất bảng điểm học tập chính thức và Hồ sơ năng lực sư phạm tổng thể (Teaching Dossier) hỗ trợ in ấn A4.',
                path: '/xuat-ho-so-bang-diem'
            };

        default:
            return {
                title: 'Pedagogy - Nền Tảng Quản Trị & Đào Tạo Nghiệp Vụ Sư Phạm',
                description: 'Hệ thống cá nhân hóa học tập, quản lý chương trình đào tạo nghiệp vụ sư phạm, thực tập giảng dạy và cấp chứng chỉ chuẩn quốc gia.',
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

    // Pedagogical Modules
    if (cleanPath === '/thuc-tap-su-pham') return { view: 'practicum' };
    if (cleanPath === '/ke-hoach-bai-day') return { view: 'lesson_plans' };
    if (cleanPath === '/chuan-nghe-nghiep') return { view: 'competencies' };
    if (cleanPath === '/tham-dinh-tot-nghiep') return { view: 'graduation' };
    if (cleanPath === '/xuat-ho-so-bang-diem') return { view: 'portfolio_export' };



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
