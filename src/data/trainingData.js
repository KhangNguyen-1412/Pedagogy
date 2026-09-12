import { NVSP_MODULES } from './nvspSyllabusData';

// Default Programs Dataset
export const DEFAULT_PROGRAMS = [
    {
        id: "prog_daihoc_sp_toan_2027",
        name: "Cử nhân Sư phạm Toán học 2023 - 2027",
        description: "Chương trình đào tạo Cử nhân Sư phạm Toán học 4 năm (135 Tín chỉ), chuẩn kiểm định chất lượng giáo dục đại học.",
        category: "dai_hoc",
        evaluationType: "credits",
        totalCreditsRequired: 135,
        status: "dang_hoc",
        isEnrolled: true,
        rules: { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
    },
    {
        id: "prog_nvsp_thcs_2026",
        name: "Nghiệp vụ sư phạm THCS 2026",
        description: "Khóa đào tạo bồi dưỡng nghiệp vụ sư phạm cấp THCS dành cho cử nhân các chuyên ngành phù hợp (Khối A & Khối B).",
        category: "nvsp_thcs",
        evaluationType: "credits",
        totalCreditsRequired: 34,
        status: "dang_hoc",
        isEnrolled: true,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
    },
    {
        id: "prog_nvsp_thpt_2026",
        name: "Nghiệp vụ sư phạm THPT 2026",
        description: "Khóa đào tạo bồi dưỡng nghiệp vụ sư phạm cấp THPT chuẩn quy định mới của Bộ Giáo dục & Đào tạo (Khối A & Khối C).",
        category: "nvsp_thpt",
        evaluationType: "credits",
        totalCreditsRequired: 36,
        status: "chua_hoc",
        isEnrolled: false,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryC: 11, practiceC: 6, electiveC: 2 }
    }
];

// Default Modules Dataset (40+ modules)
export const DEFAULT_MODULES = [
    // Học kỳ 1 (Năm 1)
    {
        id: "mod_dh_triet_hoc",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "PHI101",
        name: "Triết học Mác - Lênin",
        credits: 3,
        category: "general",
        knowledgeBlock: "general",
        semester: "1",
        type: "mandatory",
        status: "completed",
        syllabus: {
            description: "Học phần trang bị thế giới quan duy vật biện chứng và phương pháp luận khoa học.",
            clos: ["Hiểu các quy luật biện chứng duy vật", "Vận dụng tư duy logic vào khoa học Toán"],
            weights: { attendance: 10, midterm: 30, final: 60 }
        },
        grades: { attendance: 9.0, midterm: 8.5, final: 8.5 }
    },
    {
        id: "mod_dh_giai_tich_1",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "MTH101",
        name: "Giải tích 1",
        credits: 3,
        category: "general",
        knowledgeBlock: "general",
        semester: "1",
        type: "mandatory",
        status: "completed",
        syllabus: {
            description: "Phép tính vi tích phân hàm một biến số thực, chuỗi số và chuỗi hàm.",
            clos: ["Thành thạo tính giới hạn, đạo hàm và tích phân", "Khảo sát và vẽ đường cong"],
            weights: { attendance: 10, midterm: 30, final: 60 }
        },
        grades: { attendance: 9.5, midterm: 9.0, final: 9.0 }
    },
    {
        id: "mod_dh_dai_so_tuyen_tinh",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "MTH102",
        name: "Đại số tuyến tính & Hình học giải tích",
        credits: 3,
        category: "general",
        knowledgeBlock: "general",
        semester: "1",
        type: "mandatory",
        status: "completed",
        grades: { attendance: 9.0, midterm: 8.5, final: 8.8 }
    },
    {
        id: "mod_dh_tin_hoc_dc",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "INF101",
        name: "Tin học đại cương & Lập trình Python cơ bản",
        credits: 3,
        category: "general",
        knowledgeBlock: "general",
        semester: "1",
        type: "mandatory",
        status: "completed",
        grades: { attendance: 10, midterm: 9.5, final: 9.5 }
    },
    {
        id: "mod_dh_tieng_anh_1",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "ENG101",
        name: "Tiếng Anh tổng quát 1",
        credits: 3,
        category: "general",
        knowledgeBlock: "general",
        semester: "1",
        type: "mandatory",
        status: "completed",
        grades: { attendance: 9.0, midterm: 8.0, final: 8.5 }
    },
    // Học kỳ 2 (Năm 1)
    {
        id: "mod_dh_giai_tich_2",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "MTH201",
        name: "Giải tích 2 (Giải tích đa biến)",
        credits: 3,
        category: "fundamental",
        knowledgeBlock: "fundamental",
        semester: "2",
        type: "mandatory",
        prerequisites: "MTH101",
        status: "in_progress",
        grades: { attendance: 9.0, midterm: 8.5, final: 0 }
    },
    {
        id: "mod_dh_cau_truc_dai_so",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "MTH202",
        name: "Cấu trúc đại số (Nhóm, Vành, Trường)",
        credits: 3,
        category: "fundamental",
        knowledgeBlock: "fundamental",
        semester: "2",
        type: "mandatory",
        prerequisites: "MTH102",
        status: "in_progress",
        grades: { attendance: 8.5, midterm: 8.0, final: 0 }
    },
    {
        id: "mod_dh_giao_duc_hoc",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "PED201",
        name: "Giáo dục học & Tâm lý học lứa tuổi",
        credits: 3,
        category: "fundamental",
        knowledgeBlock: "fundamental",
        semester: "2",
        type: "mandatory",
        status: "in_progress",
        grades: { attendance: 9.0, midterm: 9.0, final: 0 }
    },
    // Học kỳ 3 (Năm 2)
    {
        id: "mod_dh_ppdh_toan",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "PED301",
        name: "Lý luận và Phương pháp dạy học môn Toán",
        credits: 4,
        category: "specialized",
        knowledgeBlock: "specialized",
        semester: "3",
        type: "mandatory",
        status: "planned"
    },
    {
        id: "mod_dh_hinh_hoc_vi_phan",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "MTH305",
        name: "Hình học vi phân & Tô pô đại cương",
        credits: 3,
        category: "specialized",
        knowledgeBlock: "specialized",
        semester: "3",
        type: "elective",
        isSelected: true,
        status: "planned"
    },
    // Học kỳ 7 & 8 (Năm 4)
    {
        id: "mod_dh_thuc_tap_sp",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "PED401",
        name: "Thực tập sư phạm tại trường THPT",
        credits: 7,
        category: "internship",
        knowledgeBlock: "internship",
        semester: "7",
        type: "practice",
        status: "planned"
    },
    {
        id: "mod_dh_khoa_luan",
        programIds: ["prog_daihoc_sp_toan_2027"],
        code: "THE499",
        name: "Khóa luận tốt nghiệp Cử nhân Sư phạm",
        credits: 8,
        category: "internship",
        knowledgeBlock: "internship",
        semester: "8",
        type: "mandatory",
        status: "planned"
    },
    ...NVSP_MODULES
];

// ==========================================
// 1. DỮ LIỆU THỰC TẬP & KIẾN TẬP SƯ PHẠM (PRACTICUM)
// ==========================================
export const initialPracticumData = {
    school: {
        name: "",
        type: "THPT",
        address: "",
        principal: "",
        headTeacher: "",
        homeroomAdvisor: "",
        delegationLeader: "",
        delegationSize: 0,
        period: ""
    },
    assignment: {
        teachingClass: "",
        homeroomClass: "",
        studentCount: 0,
        subject: "",
        schedule: ""
    },
    observationLogs: [],
    homeroomLogs: [],
    finalEvaluation: {
        teachingScore: 0,
        homeroomScore: 0,
        reportScore: 0,
        overallScore: 0,
        rank: "Chưa xếp loại",
        advisorSummary: ""
    }
};

// ==========================================
// 2. DỮ LIỆU KẾ HOẠCH BÀI DẠY (KHBD 5555) & MICRO-TEACHING
// ==========================================
export const initialLessonPlans = [];

export const initialMicroTeachingSessions = [];

// ==========================================
// 3. DỮ LIỆU CHUẨN NGHỀ NGHIỆP GIÁO VIÊN (THÔNG TƯ 20/2018/TT-BGDĐT) & PLO
// ==========================================
export const initialTeacherCompetencies = [
    {
        standardId: "std_1",
        standardName: "Tiêu chuẩn 1: Phẩm chất nhà giáo",
        standardDesc: "Tuân thủ các quy định và rèn luyện về đạo đức nhà giáo; chia sẻ kinh nghiệm, hỗ trợ đồng nghiệp trong rèn luyện đạo đức và tạo dựng phong cách nhà giáo.",
        criteria: [
            {
                id: "crit_1",
                code: "Tiêu chí 1",
                name: "Đạo đức nhà giáo",
                desc: "Mẫu mực về đạo đức nhà giáo; chia sẻ kinh nghiệm, hỗ trợ đồng nghiệp trong rèn luyện đạo đức nhà giáo.",
                level: "unrated", // 'unrated' | 'pass' | 'fair' | 'good' | 'fail'
                evidence: "",
                notes: ""
            },
            {
                id: "crit_2",
                code: "Tiêu chí 2",
                name: "Phong cách nhà giáo",
                desc: "Có tác phong và phương pháp làm việc mẫu mực; có ảnh hưởng tốt và hỗ trợ đồng nghiệp xây dựng phong cách nhà giáo.",
                level: "unrated",
                evidence: "",
                notes: ""
            }
        ]
    },
    {
        standardId: "std_2",
        standardName: "Tiêu chuẩn 2: Phát triển chuyên môn, nghiệp vụ",
        standardDesc: "Nắm vững chuyên môn và nghiệp vụ sư phạm; thường xuyên cập nhật nâng cao năng lực chuyên môn và nghiệp vụ đáp ứng yêu cầu đổi mới giáo dục.",
        criteria: [
            {
                id: "crit_3",
                code: "Tiêu chí 3",
                name: "Phát triển chuyên môn bản thân",
                desc: "Tự học, tự bồi dưỡng nâng cao năng lực chuyên môn; hướng dẫn, hỗ trợ đồng nghiệp về nội dung phương pháp chuyên môn.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_4",
                code: "Tiêu chí 4",
                name: "Xây dựng kế hoạch dạy học và giáo dục",
                desc: "Xây dựng kế hoạch dạy học và giáo dục theo hướng phát triển phẩm chất, năng lực học sinh.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_5",
                code: "Tiêu chí 5",
                name: "Sử dụng phương pháp dạy học và giáo dục",
                desc: "Áp dụng các phương pháp, kỹ thuật dạy học tích cực nhằm phát triển phẩm chất, năng lực học sinh.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_6",
                code: "Tiêu chí 6",
                name: "Kiểm tra, đánh giá học sinh",
                desc: "Sử dụng các hình thức, phương pháp kiểm tra đánh giá vì sự tiến bộ của học sinh.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_7",
                code: "Tiêu chí 7",
                name: "Tư vấn và hỗ trợ học sinh",
                desc: "Hiểu đặc điểm tâm sinh lý lứa tuổi học sinh; tư vấn, hỗ trợ học sinh phát triển năng lực, giải quyết vướng mắc tâm lý.",
                level: "unrated",
                evidence: "",
                notes: ""
            }
        ]
    },
    {
        standardId: "std_3",
        standardName: "Tiêu chuẩn 3: Xây dựng môi trường giáo dục",
        standardDesc: "Xây dựng môi trường giáo dục an toàn, lành mạnh, thân thiện, dân chủ, phòng chống bạo lực học đường.",
        criteria: [
            {
                id: "crit_8",
                code: "Tiêu chí 8",
                name: "Xây dựng văn hóa nhà trường",
                desc: "Tham gia xây dựng văn hóa ứng xử, tôn sư trọng đạo trong trường phổ thông.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_9",
                code: "Tiêu chí 9",
                name: "Thực hiện quyền dân chủ trong nhà trường",
                desc: "Tôn trọng và phát huy quyền dân chủ của học sinh trong các hoạt động dạy học và giáo dục.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_10",
                code: "Tiêu chí 10",
                name: "Trường học an toàn, phòng chống bạo lực",
                desc: "Chủ động phát hiện và ngăn ngừa các nguy cơ mất an toàn, bạo lực học đường.",
                level: "unrated",
                evidence: "",
                notes: ""
            }
        ]
    },
    {
        standardId: "std_4",
        standardName: "Tiêu chuẩn 4: Mối quan hệ giữa nhà trường, gia đình và xã hội",
        standardDesc: "Tạo dựng mối quan hệ hợp tác với cha mẹ học sinh và các tổ chức xã hội để nâng cao hiệu quả giáo dục.",
        criteria: [
            {
                id: "crit_11",
                code: "Tiêu chí 11",
                name: "Hợp tác với cha mẹ học sinh",
                desc: "Thiết lập kênh liên lạc thường xuyên, kịp thời thông tin về tiến bộ của học sinh.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_12",
                code: "Tiêu chí 12",
                name: "Phối hợp giữa nhà trường, gia đình và xã hội",
                desc: "Tham gia các hoạt động giáo dục ngoài giờ lên lớp gắn với cộng đồng.",
                level: "unrated",
                evidence: "",
                notes: ""
            }
        ]
    },
    {
        standardId: "std_5",
        standardName: "Tiêu chuẩn 5: Ngoại ngữ & Ứng dụng CNTT trong dạy học",
        standardDesc: "Sử dụng ngoại ngữ và ứng dụng CNTT, khai thác các thiết bị công nghệ số trong hoạt động dạy học.",
        criteria: [
            {
                id: "crit_13",
                code: "Tiêu chí 13",
                name: "Sử dụng ngoại ngữ hoặc tiếng dân tộc",
                desc: "Có khả năng giao tiếp và khai thác tài liệu chuyên môn bằng ngoại ngữ đạt chuẩn Bậc 3 (B1/B2).",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_14",
                code: "Tiêu chí 14",
                name: "Ứng dụng CNTT & Chuyển đổi số",
                desc: "Ứng dụng thành thạo phần mềm dạy học, hệ thống LMS, công cụ AI sư phạm trong thiết kế bài giảng.",
                level: "unrated",
                evidence: "",
                notes: ""
            },
            {
                id: "crit_15",
                code: "Tiêu chí 15",
                name: "Khai thác và sử dụng thiết bị công nghệ",
                desc: "Vận hành và bảo quản tốt thiết bị trình chiếu, phòng học thông minh, thí nghiệm ảo.",
                level: "unrated",
                evidence: "",
                notes: ""
            }
        ]
    }
];

export const initialPloMatrix = [
    {
        ploCode: "PLO 1",
        ploName: "Năng lực Khoa học Giáo dục & Sư phạm",
        desc: "Vận dụng vững chắc kiến thức tâm lý học, giáo dục học và lý luận dạy học vào phân tích thực tiễn giáo dục phổ thông.",
        targetModules: ["THE101", "THE201", "THE202"],
        status: "planned"
    },
    {
        ploCode: "PLO 2",
        ploName: "Năng lực Thiết kế Kế hoạch Bài dạy (5555)",
        desc: "Thiết kế kế hoạch bài dạy bám sát yêu cầu cần đạt của Chương trình GDPT 2018 theo hướng phát triển năng lực, phẩm chất học sinh.",
        targetModules: ["THE301", "THE302", "THE303"],
        status: "planned"
    },
    {
        ploCode: "PLO 3",
        ploName: "Năng lực Tổ chức Dạy học & Giáo dục",
        desc: "Tổ chức các hoạt động dạy học tích cực, linh hoạt xử lý tình huống sư phạm và quản lý lớp học hiệu quả.",
        targetModules: ["THE401", "THE402"],
        status: "planned"
    },
    {
        ploCode: "PLO 4",
        ploName: "Năng lực Kiểm tra Đánh giá Giáo dục",
        desc: "Xây dựng công cụ kiểm tra đánh giá đa dạng, sử dụng Rubrics và phương pháp đánh giá quá trình vì sự tiến bộ của học sinh.",
        targetModules: ["THE303"],
        status: "planned"
    },
    {
        ploCode: "PLO 5",
        ploName: "Năng lực Nghiên cứu Khoa học Sư phạm Ứng dụng",
        desc: "Thực hiện đề tài nghiên cứu khoa học sư phạm ứng dụng hoặc sáng kiến kinh nghiệm giải quyết vấn đề thực tế.",
        targetModules: ["THE499"],
        status: "planned"
    },
    {
        ploCode: "PLO 6",
        ploName: "Phẩm chất Đạo đức Nhà giáo & Trách nhiệm Xã hội",
        desc: "Thể hiện tác phong nhà giáo mẫu mực, tôn trọng người học, tận tụy với sự nghiệp giáo dục và tuân thủ pháp luật.",
        targetModules: ["THE101", "THE401"],
        status: "planned"
    }
];

// ==========================================
// 4. DỮ LIỆU ĐIỀU KIỆN TỐT NGHIỆP & CẤP CHỨNG CHỈ (GRADUATION AUDIT)
// ==========================================
export const initialGraduationCriteria = {
    targetProgram: {
        id: "prog_nvsp_thpt",
        name: "Nghiệp vụ Sư phạm Giáo viên THPT",
        code: "NVSP-THPT",
        certificateTitle: "CHỨNG CHỈ BỒI DƯỠNG NGHIỆP VỤ SƯ PHẠM GIÁO VIÊN TRUNG HỌC PHỔ THÔNG",
        issuingAuthority: "Trường Đại học Sư phạm TP. Hồ Chí Minh",
        legalBasis: "Quy định tại Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ trưởng Bộ GD&ĐT"
    },
    requirements: [
        {
            id: "req_credits",
            title: "1. Tích lũy đủ khối lượng tín chỉ quy định",
            desc: "Hoàn thành đủ khối lượng tín chỉ quy định theo khung chương trình đào tạo nghiệp vụ sư phạm.",
            status: "pending",
            currentVal: "Chưa hoàn thành",
            requiredVal: "Hoàn thành 100% TC",
            details: "Đang chờ đối soát dữ liệu tích lũy các học phần."
        },
        {
            id: "req_gpa",
            title: "2. Điểm trung bình chung tích lũy (GPA)",
            desc: "Điểm trung bình chung học tập toàn khóa đạt từ 5.0 trở lên (Thang điểm 10) hoặc 2.0 trở lên (Thang điểm 4).",
            status: "pending",
            currentVal: "Chưa có điểm GPA",
            requiredVal: "≥ 5.0 (Hệ 10) / ≥ 2.0 (Hệ 4)",
            details: "Chưa hoàn thành toàn bộ học phần trong chương trình."
        },
        {
            id: "req_internship",
            title: "3. Học phần Thực tập & Kiến tập Sư phạm",
            desc: "Hoàn thành đợt thực tập sư phạm tại trường phổ thông được phân công và đạt điểm từ 5.0 trở lên.",
            status: "pending",
            currentVal: "Chưa thực hiện",
            requiredVal: "≥ 5.0 / 10",
            details: "Chưa hoàn thành đợt thực tập sư phạm tại trường phổ thông."
        },
        {
            id: "req_language_it",
            title: "4. Chuẩn đầu ra Ngoại ngữ & Tin học",
            desc: "Có chứng chỉ tiếng Anh tối thiểu Bậc 3 (B1/B2) và Chứng chỉ Ứng dụng CNTT cơ bản theo Thông tư 03.",
            status: "pending",
            currentVal: "Chưa nộp chứng chỉ",
            requiredVal: "Bậc 3 & CNTT Thông tư 03",
            details: "Chưa nộp hồ sơ minh chứng chứng chỉ Ngoại ngữ & Tin học."
        },
        {
            id: "req_conduct_final",
            title: "5. Điểm Rèn luyện & Bài thu hoạch cuối khóa",
            desc: "Điểm rèn luyện đạo đức xếp loại Tốt trở lên; Hoàn thành bài thu hoạch nghiệp vụ sư phạm cuối khóa.",
            status: "pending",
            currentVal: "Chưa đánh giá",
            requiredVal: "Khá trở lên • Thu hoạch ≥ 5.0",
            details: "Chưa đánh giá điểm rèn luyện và nộp bài thu hoạch cuối khóa."
        }
    ],
    predictedOutcome: {
        isEligible: false,
        projectedRank: "Chưa đủ điều kiện",
        clearancePercent: 0,
        certificateSerial: "Chưa cấp số",
        reviewDate: ""
    }
};

