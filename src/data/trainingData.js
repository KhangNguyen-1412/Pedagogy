// Default Programs Dataset
export const DEFAULT_PROGRAMS = [
    {
        id: "prog_daihoc_sp_toan_2027",
        name: "Cử nhân Sư phạm Toán học 2023 - 2027",
        description: "Chương trình đào tạo Cử nhân Sư phạm Toán học 4 năm (135 Tín chỉ), chuẩn kiểm định chất lượng giáo dục đại học.",
        category: "dai_hoc",
        evaluationType: "credits",
        totalCreditsRequired: 135,
        status: "active",
        isEnrolled: true,
        rules: { general: 28, fundamentalMandatory: 26, fundamentalElective: 8, specializedMandatory: 42, specializedElective: 16, internshipGraduation: 15 }
    },
    {
        id: "prog_nvsp_thcs_2026",
        name: "Nghiệp vụ sư phạm THCS 2026",
        description: "Khóa đào tạo bồi dưỡng nghiệp vụ sư phạm cấp THCS dành cho cử nhân các chuyên ngành phù hợp.",
        category: "nhanh_a",
        evaluationType: "credits",
        totalCreditsRequired: 34,
        status: "active",
        isEnrolled: true,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 9, practiceB: 6, electiveB: 2 }
    },
    {
        id: "prog_nvsp_thpt_2026",
        name: "Nghiệp vụ sư phạm THPT 2026",
        description: "Khóa đào tạo bồi dưỡng nghiệp vụ sư phạm cấp THPT chuẩn quy định mới của Bộ Giáo dục & Đào tạo.",
        category: "nhanh_a",
        evaluationType: "credits",
        totalCreditsRequired: 36,
        status: "active",
        isEnrolled: true,
        rules: { mandatoryA: 15, electiveA: 2, mandatoryB: 11, practiceB: 6, electiveB: 2 }
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
    }
];
