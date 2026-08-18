// ============================================================================
// DATASET: KHỐI TIN HỌC QUỐC TẾ (MOS & IC3) - PEDAGOGY ACADEMY
// Standard: Certiport Multi-Project MOS 2019/365 & IC3 Digital Literacy GS6
// ============================================================================

export const DEFAULT_MOS_PROFILE = {
    totalProjectsCompleted: 8,
    totalPracticeHours: 14.5,
    averageTaskSpeedSeconds: 38, // Certiport target: < 45s/task
    overallExamReadiness: 86, // Percentage
    currentTrack: 'mos_excel', // 'mos_excel' | 'mos_word' | 'mos_ppt' | 'ic3_gs6'
    targetExamDate: '2026-10-15',
    badgesUnlocked: ['excel_pivot_master', 'word_academic_pro', 'ic3_cyber_defender', 'speed_demon_30s'],
    recentAttempts: [
        { id: 'att_01', projectId: 'proj_excel_01', title: 'Phân tích Doanh số & Lương Thưởng HR', score: 950, maxScore: 1000, timeSpentMinutes: 34, passed: true, date: '2026-08-16' },
        { id: 'att_02', projectId: 'proj_word_01', title: 'Đề tài Nghiên cứu Khoa học & Báo cáo Sư phạm', score: 920, maxScore: 1000, timeSpentMinutes: 38, passed: true, date: '2026-08-14' },
        { id: 'att_03', projectId: 'proj_ppt_01', title: 'Slide Thuyết trình Báo cáo Khóa luận 2026', score: 880, maxScore: 1000, timeSpentMinutes: 41, passed: true, date: '2026-08-11' }
    ]
};

export const MOS_SUBJECTS = [
    {
        id: 'mos_excel',
        name: 'MOS Excel 365 / 2019',
        code: 'MO-200',
        icon: 'FileSpreadsheet',
        color: '#107c41',
        description: 'Phân tích dữ liệu bảng tính, hàm logic nâng cao, Pivot Table, Conditional Formatting và biểu diễn đồ thị trực quan.',
        totalProjects: 12,
        totalTasks: 60,
        examTimeMinutes: 50,
        passScore: 700,
        maxScore: 1000
    },
    {
        id: 'mos_word',
        name: 'MOS Word 365 / 2019',
        code: 'MO-100',
        icon: 'FileText',
        color: '#185abd',
        description: 'Soạn thảo và định dạng văn bản học thuật, tạo mục lục tự động, quản lý nguồn trích dẫn APA/IEEE, Section Breaks và Mail Merge.',
        totalProjects: 10,
        totalTasks: 50,
        examTimeMinutes: 50,
        passScore: 700,
        maxScore: 1000
    },
    {
        id: 'mos_ppt',
        name: 'MOS PowerPoint 365 / 2019',
        code: 'MO-300',
        icon: 'Presentation',
        color: '#c43e1c',
        description: 'Thiết kế slide trình diễn chuyên nghiệp, Slide Master phân cấp, hiệu ứng Transitions/Animations, nhúng Media và thiết lập in ấn Handouts.',
        totalProjects: 8,
        totalTasks: 40,
        examTimeMinutes: 50,
        passScore: 700,
        maxScore: 1000
    },
    {
        id: 'ic3_gs6',
        name: 'IC3 Digital Literacy GS6',
        code: 'IC3-GS6',
        icon: 'ShieldCheck',
        color: '#5c2d91',
        description: 'Chứng chỉ Tin học Quốc tế về Nền tảng Công nghệ số, Ứng dụng văn phòng & Cộng tác trực tuyến, An toàn thông tin và Xử lý sự cố.',
        totalProjects: 6,
        totalTasks: 45,
        examTimeMinutes: 50,
        passScore: 700,
        maxScore: 1000
    }
];

export const MOS_HEATMAP_TABS = [
    { id: 'tab_home', name: 'Home (Cơ bản & Styles)', category: 'common', accuracy: 94, totalQuestions: 48, status: 'good' },
    { id: 'tab_insert', name: 'Insert (Chèn Bảng & Media)', category: 'common', accuracy: 88, totalQuestions: 35, status: 'good' },
    { id: 'tab_layout', name: 'Page Layout & Page Setup', category: 'word_excel', accuracy: 82, totalQuestions: 28, status: 'warning' },
    { id: 'tab_formulas', name: 'Formulas (Hàm Logic & Tra cứu)', category: 'excel', accuracy: 74, totalQuestions: 42, status: 'danger' },
    { id: 'tab_data', name: 'Data (Pivot, Filter, Sort)', category: 'excel', accuracy: 78, totalQuestions: 30, status: 'warning' },
    { id: 'tab_references', name: 'References (Mục lục & Trích dẫn)', category: 'word', accuracy: 68, totalQuestions: 25, status: 'danger' },
    { id: 'tab_slidemaster', name: 'View & Slide Master', category: 'ppt', accuracy: 85, totalQuestions: 22, status: 'good' },
    { id: 'tab_security', name: 'An toàn mạng & Phishing', category: 'ic3', accuracy: 91, totalQuestions: 32, status: 'good' }
];

export const MOS_BADGES = [
    {
        id: 'excel_pivot_master',
        name: 'Excel Pivot Master',
        icon: 'Table',
        description: 'Hoàn thành xuất sắc 5 dự án tạo và tùy biến bảng Pivot Table phân tích dữ liệu đa chiều.',
        category: 'Excel',
        unlocked: true,
        unlockedDate: '2026-08-16'
    },
    {
        id: 'word_academic_pro',
        name: 'Word Academic Pro',
        icon: 'BookOpen',
        description: 'Thành thạo kỹ thuật tạo mục lục tự động nhiều cấp và trích dẫn chuẩn APA/IEEE.',
        category: 'Word',
        unlocked: true,
        unlockedDate: '2026-08-14'
    },
    {
        id: 'ic3_cyber_defender',
        name: 'IC3 Cyber Defender',
        icon: 'ShieldCheck',
        description: 'Đạt điểm tuyệt đối trong phần nhận diện email lừa đảo (Phishing) và thiết lập 2FA an toàn số.',
        category: 'IC3',
        unlocked: true,
        unlockedDate: '2026-08-10'
    },
    {
        id: 'speed_demon_30s',
        name: 'Tốc Độ Vàng (< 35s/Task)',
        icon: 'Zap',
        description: 'Duy trì tốc độ hoàn thành các tác vụ thực hành dưới 35 giây/task liên tiếp trong 3 dự án.',
        category: 'Speed',
        unlocked: true,
        unlockedDate: '2026-08-16'
    },
    {
        id: 'ppt_master_presenter',
        name: 'PowerPoint Master Presenter',
        icon: 'Presentation',
        description: 'Tùy chỉnh Slide Master phân cấp hoàn chỉnh và áp dụng Morph Transitions mượt mà.',
        category: 'PowerPoint',
        unlocked: false,
        unlockedDate: null
    },
    {
        id: 'mos_grandmaster_1000',
        name: 'MOS Grandmaster 1000',
        icon: 'Award',
        description: 'Đạt điểm số tuyệt đối 1000/1000 trong một bài thi mô phỏng Multi-Project chính thức.',
        category: 'Excellence',
        unlocked: false,
        unlockedDate: null
    }
];

// ============================================================================
// MULTI-PROJECT DATA BANK (WORD, EXCEL, POWERPOINT)
// ============================================================================

export const MOS_MULTI_PROJECTS = [
    // ------------------------------------------------------------------------
    // PROJECT 1: MOS EXCEL - QUẢN LÝ NHÂN SỰ & DOANH THU CÔNG TY CÔNG NGHỆ
    // ------------------------------------------------------------------------
    {
        id: 'proj_excel_01',
        subjectId: 'mos_excel',
        title: 'Project 1: Quản lý Nhân sự & Phân tích Doanh thu Tháng 8/2026',
        context: 'Bạn là chuyên viên phân tích dữ liệu HR & Tài chính của Tập đoàn EdTech. Hãy xử lý bảng tính Excel để tính toán lương thưởng, tra cứu phòng ban và tạo biểu đồ tổng kết báo cáo cho Ban Giám đốc.',
        documentName: 'Staff_Salary_Analysis_2026.xlsx',
        activeSheet: 'Salary_Sheet',
        sheets: ['Salary_Sheet', 'Department_Lookup', 'Revenue_Summary'],
        tableData: [
            { id: 1, empCode: 'EMP001', name: 'Nguyễn Văn An', deptCode: 'IT', deptName: 'Công Nghệ', baseSalary: 22000000, kpiScore: 92, bonus: 4400000, totalSalary: 26400000, status: 'Đạt KPI' },
            { id: 2, empCode: 'EMP002', name: 'Trần Thị Bích', deptCode: 'MKT', deptName: 'Marketing', baseSalary: 18000000, kpiScore: 84, bonus: 2700000, totalSalary: 20700000, status: 'Đạt KPI' },
            { id: 3, empCode: 'EMP003', name: 'Lê Hoàng Cường', deptCode: 'SALES', deptName: 'Kinh Doanh', baseSalary: 15000000, kpiScore: 68, bonus: 0, totalSalary: 15000000, status: 'Cần cố gắng' },
            { id: 4, empCode: 'EMP004', name: 'Phạm Thu Dung', deptCode: 'HR', deptName: 'Nhân Sự', baseSalary: 16000000, kpiScore: 95, bonus: 3200000, totalSalary: 19200000, status: 'Xuất sắc' },
            { id: 5, empCode: 'EMP005', name: 'Vũ Đức Em', deptCode: 'IT', deptName: 'Công Nghệ', baseSalary: 25000000, kpiScore: 88, bonus: 3750000, totalSalary: 28750000, status: 'Đạt KPI' },
            { id: 6, empCode: 'EMP006', name: 'Hoàng Mai Phương', deptCode: 'SALES', deptName: 'Kinh Doanh', baseSalary: 14000000, kpiScore: 78, bonus: 1400000, totalSalary: 15400000, status: 'Đạt KPI' }
        ],
        tasks: [
            {
                taskNumber: 1,
                instruction: 'Trên trang tính "Salary_Sheet", tại ô D2, hãy sử dụng hàm VLOOKUP để tự động tra cứu tên phòng ban (Department Name) từ bảng tra cứu "Dept_Table" trên trang tính "Department_Lookup" dựa theo mã Dept Code ở cột C. Sao chép công thức xuống hết cột D.',
                formulaTarget: 'VLOOKUP',
                expectedFormula: '=VLOOKUP(C2, Department_Lookup!$A$2:$B$10, 2, FALSE)',
                optimalClickPath: ['Tab Formulas', 'Function Library: Lookup & Reference', 'Chọn VLOOKUP', 'Lookup_value: C2', 'Table_array: Department_Lookup!$A$2:$B$10', 'Col_index_num: 2', 'Range_lookup: FALSE'],
                shortcut: 'Gõ trực tiếp =VLOOKUP(C2, Department_Lookup!$A$2:$B$10, 2, 0)',
                hintText: 'Sử dụng tuyệt đối hóa địa chỉ vùng tra cứu ($A$2:$B$10) bằng phím F4 để không bị lệch khi kéo fill handle.',
                points: 20
            },
            {
                taskNumber: 2,
                instruction: 'Tại cột "Bonus" (cột G), tính tiền thưởng theo điều kiện: Nếu điểm KPI (cột F) >= 90 thì thưởng 20% Base Salary; nếu KPI >= 75 thì thưởng 10% Base Salary; các trường hợp còn lại thưởng 0 đồng.',
                formulaTarget: 'IF_LOGIC',
                expectedFormula: '=IF(F2>=90, E2*0.2, IF(F2>=75, E2*0.1, 0))',
                optimalClickPath: ['Tab Formulas', 'Function Library: Logical', 'Chọn IF lồng nhau', 'Logical_test: F2>=90', 'Value_if_true: E2*0.2', 'Value_if_false: IF(...)'],
                shortcut: 'Hoặc dùng hàm =IFS(F2>=90, E2*0.2, F2>=75, E2*0.1, TRUE, 0)',
                hintText: 'Hàm IFS trên Excel 365/2019 giúp viết điều kiện nối tiếp ngắn gọn hơn so với lồng nhiều lệnh IF.',
                points: 20
            },
            {
                taskNumber: 3,
                instruction: 'Áp dụng định dạng có điều kiện (Conditional Formatting) cho cột "Total Salary" (cột H): Bôi màu nền xanh lá nhạt với chữ xanh đậm (Light Green Fill with Dark Green Text) cho tất cả các nhân sự có Tổng thu nhập trên 20,000,000 VNĐ.',
                formulaTarget: 'CONDITIONAL_FORMATTING',
                optimalClickPath: ['Tab Home', 'Nhóm Styles', 'Chọn Conditional Formatting', 'Highlight Cells Rules -> Greater Than...', 'Nhập giá trị: 20000000', 'Chọn kiểu: Green Fill with Dark Green Text'],
                shortcut: 'Alt + H -> L -> H -> G',
                hintText: 'Chỉ quét chọn vùng dữ liệu từ H2:H7, không quét cả dòng tiêu đề cột H1.',
                points: 20
            },
            {
                taskNumber: 4,
                instruction: 'Tạo một bảng tổng hợp Pivot Table tại một trang tính mới đặt tên là "Pivot_Analysis". Thống kê Tổng Lương (Sum of Total Salary) và Số lượng nhân viên (Count of Employee) được nhóm theo từng Phòng ban (deptName).',
                formulaTarget: 'PIVOT_TABLE',
                optimalClickPath: ['Quét chọn bảng dữ liệu Salary_Sheet', 'Tab Insert', 'Nhóm Tables', 'Chọn PivotTable', 'Chọn New Worksheet', 'Kéo field "deptName" vào Rows', 'Kéo "totalSalary" vào Values', 'Kéo "empCode" vào Values'],
                shortcut: 'Alt + N -> V -> T',
                hintText: 'Đổi tên Sheet thành "Pivot_Analysis" ngay sau khi tạo để khớp tiêu chí chấm điểm tự động của Certiport.',
                points: 20
            },
            {
                taskNumber: 5,
                instruction: 'Trên trang tính "Salary_Sheet", chèn một biểu đồ hình cột 2-D Clustered Column biểu diễn so sánh giữa Base Salary và Total Salary của từng nhân viên. Đặt tiêu đề biểu đồ là "So Sánh Thu Nhập Nhân Viên 2026" và áp dụng Chart Style 8.',
                formulaTarget: 'CHART_CREATION',
                optimalClickPath: ['Quét chọn cột Name, Base Salary, Total Salary', 'Tab Insert', 'Nhóm Charts', 'Chọn 2-D Clustered Column', 'Nhấp Chart Title -> Đổi tên', 'Tab Chart Design -> Chọn Chart Style 8'],
                shortcut: 'Alt + F1 (Tạo nhanh biểu đồ mặc định)',
                hintText: 'Giữ phím Ctrl để chọn cùng lúc các cột dữ liệu không liền kề (Cột B, Cột E và Cột H).',
                points: 20
            }
        ]
    },

    // ------------------------------------------------------------------------
    // PROJECT 2: MOS WORD - BÁO CÁO NGHIÊN CỨU KHOA HỌC & ĐỀ TÀI SƯ PHẠM
    // ------------------------------------------------------------------------
    {
        id: 'proj_word_01',
        subjectId: 'mos_word',
        title: 'Project 2: Báo Cáo Nghiên Cứu Khoa Học Sư Phạm 2026',
        context: 'Bạn đang biên tập tài liệu Kỷ yếu Nghiên cứu Khoa học Sư phạm Kỹ thuật. Hãy hoàn thiện cấu trúc tài liệu: tạo ngắt trang Section Break, làm mục lục tự động, chèn trích dẫn APA và thiết lập Mail Merge gửi thư mời báo cáo.',
        documentName: 'Pedagogy_Research_Report_2026.docx',
        pageCount: 8,
        tasks: [
            {
                taskNumber: 1,
                instruction: 'Tại vị trí ngay trước đề mục "CHƯƠNG 1: TỔNG QUAN TÀI LIỆU", hãy chèn một dấu ngắt phân vùng sang trang mới kiểu "Section Break (Next Page)" để tách trang Bìa và Mục lục ra khỏi nội dung chính.',
                formulaTarget: 'SECTION_BREAK',
                optimalClickPath: ['Đặt con trỏ trước chữ CHƯƠNG 1', 'Tab Layout', 'Nhóm Page Setup', 'Bấm Breaks', 'Dưới mục Section Breaks chọn "Next Page"'],
                shortcut: 'Alt + P -> B -> N',
                hintText: 'Tuyệt đối không dùng Page Break (Ctrl+Enter) vì không thể tạo số trang khác nhau cho từng phân vùng.',
                points: 20
            },
            {
                taskNumber: 2,
                instruction: 'Áp dụng định dạng phong cách kiểu (Heading Styles) cho các tiêu đề trong bài: Gán Heading 1 cho các đề mục cấp 1 ("CHƯƠNG 1", "CHƯƠNG 2"), và gán Heading 2 cho các tiểu mục cấp 2 ("1.1 Cơ sở lý luận", "1.2 Phương pháp nghiên cứu").',
                formulaTarget: 'HEADING_STYLES',
                optimalClickPath: ['Chọn văn bản tiêu đề', 'Tab Home', 'Nhóm Styles', 'Bấm chọn "Heading 1" hoặc "Heading 2"'],
                shortcut: 'Ctrl + Alt + 1 (Heading 1) / Ctrl + Alt + 2 (Heading 2)',
                hintText: 'Phím tắt Ctrl+Alt+1 giúp gán Heading 1 chỉ trong 0.5 giây.',
                points: 20
            },
            {
                taskNumber: 3,
                instruction: 'Tại Trang 2 (sau trang bìa), hãy chèn một bảng Mục lục Tự động phong cách "Automatic Table 2" (Bảng nội dung tự động). Đảm bảo số trang và tiêu đề hiển thị đầy đủ đến cấp Heading 3.',
                formulaTarget: 'TABLE_OF_CONTENTS',
                optimalClickPath: ['Đặt con trỏ ở Trang 2', 'Tab References', 'Nhóm Table of Contents', 'Bấm Table of Contents', 'Chọn mẫu "Automatic Table 2"'],
                shortcut: 'Alt + S -> T',
                hintText: 'Nếu cập nhật nội dung sau đó, hãy bấm Update Table -> Update Entire Table.',
                points: 20
            },
            {
                taskNumber: 4,
                instruction: 'Tại cuối đoạn văn thứ hai của Mục 1.1, hãy chèn một nguồn trích dẫn mới (Insert Citation) theo chuẩn trích dẫn APA 7th Edition: Loại nguồn "Book", Tác giả "Huỳnh Văn Sơn", Tựa đề "Tâm lý học Giáo dục hiện đại", Năm "2024", Nhà xuất bản "NXB Đại học Sư phạm TP.HCM".',
                formulaTarget: 'CITATIONS_BIBLIOGRAPHY',
                optimalClickPath: ['Đặt con trỏ tại cuối câu', 'Tab References', 'Nhóm Citations & Bibliography', 'Chọn Style: APA', 'Bấm Insert Citation -> Add New Source...', 'Điền thông tin tác giả và năm'],
                shortcut: 'Alt + S -> C -> A',
                hintText: 'Kiểm tra kỹ Style trích dẫn đã là APA trước khi bấm Add New Source.',
                points: 20
            },
            {
                taskNumber: 5,
                instruction: 'Thiết lập trộn thư (Mail Merge): Kết nối tài liệu hiện tại với danh sách người nhận từ tệp "Guest_List.xlsx". Chèn các trường hợp nhất (Merge Fields) «Ho_Ten» và «Don_Vi» vào bức thư ngỏ tại trang cuối.',
                formulaTarget: 'MAIL_MERGE',
                optimalClickPath: ['Tab Mailings', 'Bấm Start Mail Merge -> Letters', 'Bấm Select Recipients -> Use an Existing List...', 'Chọn tệp Excel', 'Bấm Insert Merge Field để chèn trường'],
                shortcut: 'Alt + M -> S -> L',
                hintText: 'Kiểm tra kết quả trộn bằng nút "Preview Results" trên Tab Mailings.',
                points: 20
            }
        ]
    },

    // ------------------------------------------------------------------------
    // PROJECT 3: MOS POWERPOINT - SLIDE THUYẾT TRÌNH BÁO CÁO KHÓA LUẬN
    // ------------------------------------------------------------------------
    {
        id: 'proj_ppt_01',
        subjectId: 'mos_ppt',
        title: 'Project 3: Thiết kế Slide Báo Cáo Khóa Luận Tốt Nghiệp 2026',
        context: 'Bạn chuẩn bị bảo vệ Khóa luận Sư phạm trước Hội đồng Giám khảo. Hãy thiết lập bố cục Slide Master đồng bộ, chèn biểu đồ SmartArt quy trình giảng dạy, thiết lập hiệu ứng Morph Transition và xuất bản tài liệu Handouts 3 slides/trang.',
        documentName: 'Thesis_Defense_Pedagogy_2026.pptx',
        slideCount: 10,
        tasks: [
            {
                taskNumber: 1,
                instruction: 'Truy cập chế độ Slide Master: Chèn Logo nhà trường "logo.png" vào góc trên bên phải của Slide Master gốc (Master Slide lớn nhất trên cùng) với chiều cao 1.5 cm. Đảm bảo logo tự động xuất hiện đồng bộ trên tất cả các slide con.',
                formulaTarget: 'SLIDE_MASTER',
                optimalClickPath: ['Tab View', 'Nhóm Master Views', 'Chọn Slide Master', 'Cuộn lên Slide số 1 trên cùng', 'Tab Insert -> Pictures -> Chọn logo', 'Chỉnh Size Height = 1.5 cm', 'Tab Slide Master -> Close Master View'],
                shortcut: 'Alt + W -> M',
                hintText: 'Chỉ chèn vào Slide Master gốc (Top-level Master), không chèn riêng lẻ vào từng Layout con.',
                points: 20
            },
            {
                taskNumber: 2,
                instruction: 'Tại Slide 4 ("Quy trình 4 Bước Dạy Học"), chuyển đổi danh sách dấu đầu dòng (Bullet list) thành biểu đồ SmartArt dạng "Horizontal Process" (Quy trình ngang). Áp dụng màu sắc "Colorful Accent Colors" và phong cách "3-D Polished".',
                formulaTarget: 'SMARTART_CONVERT',
                optimalClickPath: ['Chọn khung văn bản Bullet list', 'Tab Home', 'Nhóm Paragraph', 'Bấm "Convert to SmartArt Graphic"', 'Chọn Horizontal Process', 'Tab SmartArt Design -> Change Colors -> Colorful', 'SmartArt Styles -> 3-D Polished'],
                shortcut: 'Alt + H -> M -> Chọn SmartArt',
                hintText: 'Tính năng Convert to SmartArt giúp biến danh sách chữ thô thành sơ đồ trực quan chỉ với 2 click chuột.',
                points: 20
            },
            {
                taskNumber: 3,
                instruction: 'Áp dụng hiệu ứng chuyển trang (Transition) kiểu "Morph" cho tất cả các slide từ Slide 2 đến Slide 10. Thiết lập thời lượng hiệu ứng (Duration) là 1.25 giây và áp dụng cho toàn bộ slide (Apply to All).',
                formulaTarget: 'TRANSITIONS_MORPH',
                optimalClickPath: ['Chọn Slide 2', 'Tab Transitions', 'Nhóm Transition to This Slide', 'Chọn hiệu ứng "Morph"', 'Tại ô Duration nhập: 01.25', 'Bấm nút "Apply to All"'],
                shortcut: 'Alt + T -> Chọn Morph -> Bấm Apply To All',
                hintText: 'Morph là hiệu ứng chuyển động tân tiến nhất trên PowerPoint 365, tạo cảm giác chuyển động mượt như video.',
                points: 20
            },
            {
                taskNumber: 4,
                instruction: 'Tại Slide 7, chèn một video ngắn "teaching_demo.mp4". Thiết lập tùy chọn phát video (Video Options): Tự động phát khi chuyển đến slide ("Automatically"), bật chế độ xem toàn màn hình ("Play Full Screen") và ẩn video khi không phát ("Hide While Not Playing").',
                formulaTarget: 'MEDIA_VIDEO_OPTIONS',
                optimalClickPath: ['Tại Slide 7', 'Tab Insert -> Video -> This Device...', 'Chọn tệp video', 'Tab Video Playback', 'Mục Start chọn "Automatically"', 'Tích chọn "Play Full Screen" và "Hide While Not Playing"'],
                shortcut: 'Alt + N -> V',
                hintText: 'Các tùy chọn nằm trong Tab ngữ cảnh "Playback" khi nhấp chọn vào khung Video.',
                points: 20
            },
            {
                taskNumber: 5,
                instruction: 'Cấu hình thiết lập in ấn: Thiết lập in tài liệu phát tay cho Hội đồng (Handouts) với định dạng 3 Slides trên một trang (có dòng kẻ ghi chú bên cạnh), thứ tự in theo cột (Collate) và chế độ màu Pure Black and White.',
                formulaTarget: 'PRINT_HANDOUTS',
                optimalClickPath: ['Tab File -> Print', 'Mục Settings: Chọn "3 Slides per page (Handouts)"', 'Bấm Color: Chọn "Pure Black and White"', 'Kiểm tra bản xem trước Preview'],
                shortcut: 'Ctrl + P -> Đổi chế độ in Handouts',
                hintText: 'Bố cục Handouts 3 Slides là chuẩn mực kinh điển cho các buổi báo cáo học thuật và hội thảo.',
                points: 20
            }
        ]
    }
];

// ============================================================================
// IC3 DIGITAL LITERACY GS6 (LEVEL 1, LEVEL 2, LEVEL 3)
// ============================================================================

export const IC3_LEVELS_DATA = [
    {
        level: 1,
        title: 'IC3 GS6 Level 1: Nền Tảng Công Nghệ Số (Foundations)',
        badgeName: 'Digital Foundation Specialist',
        targetScore: 700,
        topics: [
            {
                id: 'ic3_l1_hardware',
                title: 'Phần Cứng & Kiến Trúc Thiết Bị',
                questionsCount: 15,
                scenario: 'Nhận diện các cổng kết nối (Thunderbolt, USB-C, HDMI, DisplayPort), phân biệt RAM, SSD NVMe, CPU và chức năng của GPU trong xử lý đồ họa.',
                interactiveLabType: 'hardware_connectors_match'
            },
            {
                id: 'ic3_l1_os_files',
                title: 'Hệ Điều Hành & Quản Lý Tập Tin',
                questionsCount: 12,
                scenario: 'Đường dẫn tuyệt đối/tương đối (File Path), nén file ZIP, gán quyền phân quyền (Read/Write/Execute) và thiết lập sao lưu đám mây tự động.',
                interactiveLabType: 'file_structure_tree'
            },
            {
                id: 'ic3_l1_cloud',
                title: 'Điện Toán Đám Mây & Kết Nối Mạng',
                questionsCount: 15,
                scenario: 'Mô hình SaaS, PaaS, IaaS; Phân biệt mạng LAN, WAN, VPN, băng tần Wi-Fi 2.4GHz vs 5GHz và các dịch vụ lưu trữ OneDrive/Google Drive.',
                interactiveLabType: 'cloud_sync_topology'
            }
        ]
    },
    {
        level: 2,
        title: 'IC3 GS6 Level 2: Ứng Dụng Cốt Lõi & Cộng Tác Trực Tuyến (Applications & Collaboration)',
        badgeName: 'Productivity & Collaboration Pro',
        targetScore: 700,
        topics: [
            {
                id: 'ic3_l2_documents',
                title: 'Định Dạng Văn Bản & Bảng Tính Cơ Bản',
                questionsCount: 15,
                scenario: 'Quy chuẩn căn lề, thụt dòng First Line Indent, hàm tính toán cơ bản SUM/AVERAGE/MAX/MIN và biểu diễn dữ liệu bảng.',
                interactiveLabType: 'document_styling_lab'
            },
            {
                id: 'ic3_l2_collaboration',
                title: 'Công Cụ Cộng Tác Trực Tuyến & Họp Số',
                questionsCount: 15,
                scenario: 'Quản lý lịch họp trên Google Calendar/Outlook, cộng tác đồng thời (Real-time Co-authoring), Version History và phân quyền xem/chỉnh sửa.',
                interactiveLabType: 'co_authoring_permission_lab'
            },
            {
                id: 'ic3_l2_multimedia',
                title: 'Bản Quyền Số & Đa Phương Tiện',
                questionsCount: 12,
                scenario: 'Giấy phép bản quyền Creative Commons (CC-BY, CC-NC), xử lý ảnh số cơ bản, độ phân giải DPI/PPI và xuất file PDF chuẩn in.',
                interactiveLabType: 'creative_commons_license_match'
            }
        ]
    },
    {
        level: 3,
        title: 'IC3 GS6 Level 3: An Toàn Thông Tin & Quản Trị Rủi Ro Số (Cybersecurity & Troubleshooting)',
        badgeName: 'Cyber Defender & Problem Solver',
        targetScore: 700,
        topics: [
            {
                id: 'ic3_l3_phishing_malware',
                title: 'Phòng Chống Lừa Đảo & Mã Độc (Phishing & Malware)',
                questionsCount: 18,
                scenario: 'Giải phẫu Email giả mạo ngân hàng, kiểm tra Header & Tên miền ẩn danh, phát hiện Ransomware, Trojan và kỹ thuật Social Engineering.',
                interactiveLabType: 'phishing_email_inspector'
            },
            {
                id: 'ic3_l3_identity_2fa',
                title: 'Bảo Vệ Danh Tính Số & Xác Thực 2 Yếu Tố (2FA)',
                questionsCount: 15,
                scenario: 'Thiết lập TOTP Authenticator, Passkey FIDO2, quản lý mật khẩu (Password Manager) và dấu chân số (Digital Footprint).',
                interactiveLabType: 'two_factor_auth_simulator'
            },
            {
                id: 'ic3_l3_troubleshooting',
                title: 'Chẩn Đoán & Xử Lý Sự Cố Kỹ Thuật (Troubleshooting)',
                questionsCount: 12,
                scenario: 'Khắc phục sự cố mất kết nối mạng (IP Conflict, DNS failure, Ping gateway), máy tính bị treo Task Manager và khôi phục hệ thống.',
                interactiveLabType: 'network_diagnostic_cli'
            }
        ]
    }
];
