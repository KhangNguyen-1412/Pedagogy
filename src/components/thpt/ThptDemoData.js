/**
 * Danh mục Chuẩn & Hằng số Luyện Thi Tốt Nghiệp THPT & Đại Học (Chính thức)
 * Toàn bộ dữ liệu đề thi, kết quả, ghi chú và mục tiêu hoàn toàn do người dùng tự thiết lập.
 */

export const DEFAULT_THPT_SUBJECTS = [
    { id: 'math', name: 'Toán học', code: 'TOAN', color: '#124874', icon: 'Calculator' },
    { id: 'physics', name: 'Vật lí', code: 'VATLY', color: '#0D9488', icon: 'Activity' },
    { id: 'chemistry', name: 'Hóa học', code: 'HOAHOC', color: '#CF373D', icon: 'FlaskConical' },
    { id: 'biology', name: 'Sinh học', code: 'SINHHOC', color: '#16A34A', icon: 'Dna' },
    { id: 'english', name: 'Tiếng Anh', code: 'TIENGANH', color: '#7C3AED', icon: 'Languages' },
    { id: 'literature', name: 'Ngữ văn', code: 'NGUVAN', color: '#EA580C', icon: 'BookOpen' },
    { id: 'history', name: 'Lịch sử', code: 'LICHSU', color: '#B45309', icon: 'Landmark' },
    { id: 'geography', name: 'Địa lí', code: 'DIALY', color: '#0284C7', icon: 'Globe' },
    { id: 'economic_law', name: 'Kinh tế & Pháp luật', code: 'GDKTPL', color: '#475569', icon: 'Scale' },
    { id: 'informatics', name: 'Tin học', code: 'TINHOC', color: '#2563EB', icon: 'Binary' },
];

export const DEFAULT_THPT_YEARS = [
    '2026', '2025', '2024', '2023', '2022', '2021', '2020'
];

export const DEFAULT_THPT_EXAM_TYPES = [
    { id: 'official', name: 'Đề thi chính thức (Bộ GD&ĐT)', badge: 'Chính thức', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'sample', name: 'Đề tham khảo / Minh họa Bộ GD&ĐT', badge: 'Minh họa', color: 'bg-blue-100 text-blue-800' },
    { id: 'trial_school', name: 'Đề thi thử THPT Chuyên / Sở GD', badge: 'Thi thử', color: 'bg-purple-100 text-purple-800' },
    { id: 'dgnl', name: 'Đề thi Đánh giá năng lực (ĐGNL ĐHQG)', badge: 'ĐGNL', color: 'bg-amber-100 text-amber-800' },
    { id: 'term', name: 'Đề kiểm tra Giữa kỳ / Cuối kỳ', badge: 'Định kỳ', color: 'bg-slate-100 text-slate-800' },
];

// Khởi tạo hoàn toàn rỗng - Không có dữ liệu giả lập/mặc định tự điền
export const DEFAULT_THPT_EXAMS = [];

export const DEFAULT_THPT_PERSONAL_PROFILE = {
    fullName: '',
    grade: '12',
    school: '',
    combination: '',
    targetUniversity: '',
    targetTotalScore: 0,
    subjectTargets: [],
    studyPhases: [],
    mistakeNotes: []
};

export const DEFAULT_THPT_RESULTS = [];
