// =========================================================================
// BỘ DỮ LIỆU ĐỀ CƯƠNG CHI TIẾT 12 HỌC PHẦN NGHIỆP VỤ SƯ PHẠM (NVSP)
// Ban hành theo Thông tư số 12/2021/TT-BGDĐT & Trường ĐH Sư phạm TP.HCM (HCMUE)
// =========================================================================

export const NVSP_MODULES = [
    // ---------------------------------------------------------------------
    // 1. MÃ HỌC PHẦN: A12 - ỨNG DỤNG CÔNG NGHỆ THÔNG TIN TRONG DẠY HỌC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a12",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A12",
        name: "Ứng dụng công nghệ thông tin trong dạy học",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học (A2)",
        instructor: "ThS. Đặng Văn Khoa",
        instructorEmail: "khoadv@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "10/06/2021",
            authorTeam: [
                "TS. Thái Hoài Minh (Trưởng nhóm biên soạn đề cương)",
                "Tập thể Giảng viên Khoa Công nghệ Thông tin"
            ],
            approver: "TS. Mai Thu Trang (Trưởng Bộ môn)",
            instructor: "ThS. Đặng Văn Khoa",
            instructorEmail: "khoadv@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học (A2)",
            hoursBreakdown: {
                total: 50,
                theory: 10,
                practice: 40,
                inPerson: 15,
                online: 35
            },
            description: "Học phần trang bị cho học viên năng lực phân tích, lựa chọn, sử dụng và đề xuất cải tiến các phần mềm, hệ thống CNTT để dạy học trực tiếp, trực tuyến và kết hợp (Blended Learning) cho học sinh phổ thông.",
            objectives: [
                { code: "1", text: "Phân tích được các khả năng và cấp độ ứng dụng CNTT trong dạy học ở trường phổ thông." },
                { code: "2", text: "Sử dụng được phần mềm, hệ thống CNTT để dạy học trực tiếp trên lớp, dạy học qua mạng và dạy học kết hợp giữa học trên lớp và học qua mạng cho học sinh phổ thông." },
                { code: "3", text: "Lựa chọn được phần mềm, hệ thống CNTT để dạy học trực tiếp trên lớp, dạy học qua mạng và dạy học kết hợp giữa học trên lớp và học qua mạng cho học sinh phổ thông cho một bài học/chủ đề cụ thể." },
                { code: "4", text: "Đề xuất được phương cải tiến khi sử dụng một số phần mềm, hệ thống CNTT để dạy học trực tiếp trên lớp, dạy học qua mạng và dạy học kết hợp giữa học trên lớp và học qua mạng cho học sinh phổ thông." }
            ],
            clos: [
                "Phân tích được các khả năng và cấp độ ứng dụng CNTT trong dạy học ở trường phổ thông.",
                "Sử dụng thành thạo phần mềm, hệ thống CNTT để tổ chức dạy học trực tiếp, trực tuyến và kết hợp.",
                "Lựa chọn phần mềm và hệ thống CNTT tối ưu cho một bài học/chủ đề sư phạm cụ thể.",
                "Đề xuất phương án cải tiến công cụ và kỹ thuật số nhằm nâng cao hiệu quả tương tác dạy học."
            ],
            contentOutline: [
                {
                    title: "NỘI DUNG 1. Một số vấn đề cơ bản về ứng dụng công nghệ thông tin trong dạy học",
                    items: [
                        "1.1. Phương tiện dạy học (1.1.1. Vai trò của phương tiện; 1.1.2. Giới thiệu một số phương tiện phổ biến; 1.1.3. Nguyên tắc lựa chọn phương tiện dạy học)",
                        "1.2. Sử dụng phương tiện hiện đại trong dạy học (1.2.1. Vai trò của phương tiện hiện đại; 1.2.2. Giới thiệu một số phương tiện hiện đại phổ biến; 1.2.3. Nguyên tắc sử dụng phương tiện hiện đại)",
                        "1.3. Ứng dụng công nghệ thông tin trong dạy học ở trường phổ thông (1.3.1. Cấp độ ứng dụng CNTT; 1.3.2. Các hình thức ứng dụng CNTT; 1.3.3. Yêu cầu về năng lực đối với giáo viên)"
                    ],
                    discussion: "Câu hỏi thảo luận – Bài tập thực hành về phương tiện và năng lực GV"
                },
                {
                    title: "NỘI DUNG 2. Một số công cụ, phần mềm hỗ trợ ứng dụng công nghệ thông tin trong dạy học",
                    items: [
                        "2.1. Phân loại công cụ, phần mềm (Biên tập học liệu số; Xây dựng môi trường học tập trực tuyến; Kiểm tra đánh giá học sinh)",
                        "2.2. Kĩ thuật sử dụng một số công cụ, phần mềm: PowerPoint tương tác, Trình biên tập Video, Kahoot, Padlet, Bộ công cụ Google (Drive, Docs, Slide, Form, Classroom), công cụ đặc thù môn học"
                    ],
                    discussion: "Câu hỏi thảo luận – Bài tập thực hành sử dụng phần mềm dạy học"
                },
                {
                    title: "NỘI DUNG 3. Ứng dụng công nghệ thông tin trong chủ đề/bài học cụ thể",
                    items: [
                        "3.1. Quy trình thiết kế chủ đề/bài dạy có ứng dụng công nghệ thông tin",
                        "3.2. Đánh giá bài dạy/chủ đề có ứng dụng công nghệ thông tin"
                    ],
                    discussion: "Câu hỏi thảo luận – Thực hành thiết kế hồ sơ bài dạy (KHBD 5512 số hóa)"
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: CHUẨN BỊ (Trực tuyến)",
                    activities: [
                        {
                            id: "act_0",
                            code: "Hoạt động 0",
                            name: "Làm quen và kết nối",
                            mode: "online",
                            target: "Đăng nhập và làm quen với hệ thống học tập từ xa.",
                            tasks: "Đăng nhập vào hệ thống theo thông tin được cung cấp; đọc tài liệu hướng dẫn/Infographic tìm hiểu mục tiêu, nội dung, lộ trình; trao đổi với báo cáo viên hoặc hỗ trợ kỹ thuật.",
                            materials: "Tài liệu hướng dẫn, Infographic môn học",
                            assessment: "Ghi nhận đăng nhập và tương tác diễn đàn"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: HỌC TẬP, THỰC HÀNH (Trực tuyến và trực tiếp)",
                    activities: [
                        {
                            id: "act_1",
                            code: "Hoạt động 1",
                            name: "Tìm hiểu về phương tiện dạy học",
                            mode: "online",
                            target: "Nhận diện phương tiện phổ biến; trình bày vai trò và nguyên tắc lựa chọn phương tiện dạy học.",
                            tasks: "Đọc tài liệu đọc; tham gia trò chơi trả lời câu hỏi liên quan; thảo luận nguyên tắc lựa chọn phương tiện dạy học.",
                            materials: "Tài liệu đọc Nội dung 1",
                            assessment: "Kết quả trả lời trò chơi và ý kiến thảo luận diễn đàn"
                        },
                        {
                            id: "act_2",
                            code: "Hoạt động 2",
                            name: "Tìm hiểu về phương tiện hiện đại hỗ trợ dạy học",
                            mode: "online",
                            target: "Nhận diện phương tiện hiện đại; trình bày vai trò và các yêu cầu, nguyên tắc sử dụng.",
                            tasks: "Đọc tài liệu; thảo luận yêu cầu và nguyên tắc sử dụng phương tiện dạy học hiện đại.",
                            materials: "Tài liệu đọc Nội dung 1",
                            assessment: "Tham gia chia sẻ ý kiến trên diễn đàn"
                        },
                        {
                            id: "act_3",
                            code: "Hoạt động 3",
                            name: "Định hướng ứng dụng CNTT trong dạy học phổ thông",
                            mode: "online",
                            target: "Trình bày các cấp độ ứng dụng CNTT; phân tích đặc điểm các hình thức ứng dụng CNTT.",
                            tasks: "Đọc tài liệu đọc; trả lời câu hỏi liên quan đến nội dung hoạt động.",
                            materials: "Tài liệu đọc Nội dung 1",
                            assessment: "Kết quả trả lời câu hỏi nội dung hoạt động"
                        },
                        {
                            id: "act_4",
                            code: "Hoạt động 4",
                            name: "Yêu cầu năng lực đối với giáo viên về ứng dụng CNTT",
                            mode: "online",
                            target: "Trình bày yêu cầu năng lực CNTT của GV; tự đánh giá và đề xuất kế hoạch phát triển năng lực bản thân.",
                            tasks: "Đọc tài liệu; tự đánh giá năng lực CNTT bản thân; đề xuất kế hoạch phát triển cá nhân.",
                            materials: "Tài liệu đọc Nội dung 1",
                            assessment: "Kết quả bản tự đánh giá và kế hoạch phát triển cá nhân"
                        },
                        {
                            id: "act_5",
                            code: "Hoạt động 5",
                            name: "Kiểm tra kết thúc nội dung 1",
                            mode: "online",
                            target: "Phân tích vai trò và cấp độ ứng dụng CNTT trong dạy học ở trường phổ thông.",
                            tasks: "Trả lời 10 câu hỏi trắc nghiệm khách quan về Nội dung 1.",
                            materials: "Tài liệu đọc Nội dung 1, Ngân hàng đề TNKQ",
                            assessment: "10 câu hỏi TNKQ (Trọng số 10% điểm quá trình)"
                        },
                        {
                            id: "act_6",
                            code: "Hoạt động 6",
                            name: "Phân loại các công cụ, phần mềm hỗ trợ dạy học",
                            mode: "online",
                            target: "Trình bày cơ sở phân loại; liệt kê các công cụ, phần mềm hỗ trợ dạy học.",
                            tasks: "Đọc tài liệu; chia sẻ các công cụ, phần mềm hỗ trợ dạy học nói chung và trong môn học nói riêng.",
                            materials: "Tài liệu đọc Nội dung 2",
                            assessment: "Tham gia chia sẻ trên diễn đàn"
                        },
                        {
                            id: "act_7",
                            code: "Hoạt động 7",
                            name: "Tìm hiểu và thực hành sử dụng phần mềm (7.1 đến 7.n)",
                            mode: "online",
                            target: "Sử dụng được các chức năng cơ bản; nêu định hướng sử dụng phần mềm/công cụ trong dạy học.",
                            tasks: "Đọc tài liệu; thực hành theo hướng dẫn qua văn bản hoặc video clip (PowerPoint, Google Suite, Kahoot, Padlet, Video).",
                            materials: "Tài liệu đọc, video hướng dẫn thực hành",
                            assessment: "Bài tập thực hành của học viên (Trọng số 40% điểm quá trình)"
                        },
                        {
                            id: "act_8",
                            code: "Hoạt động 8",
                            name: "Trao đổi, thảo luận nội dung 2",
                            mode: "in_person",
                            target: "Giải đáp thắc mắc và làm sâu sắc kỹ thuật sử dụng công cụ, phần mềm.",
                            tasks: "Đặt câu hỏi về những vấn đề chưa rõ; tham gia phản hồi ý kiến cùng giảng viên và lớp học.",
                            materials: "Tài liệu đọc, máy tính, công cụ phần mềm",
                            assessment: "Tính tích cực trao đổi và tương tác tại lớp"
                        },
                        {
                            id: "act_9",
                            code: "Hoạt động 9",
                            name: "Tìm hiểu quy trình thiết kế chủ đề/bài dạy có ứng dụng CNTT",
                            mode: "online",
                            target: "Phân tích quy trình lựa chọn phương án ứng dụng CNTT trong dạy học.",
                            tasks: "Đọc tài liệu; thực hiện bài tập ghép đôi tên các bước trong quy trình và mô tả/sản phẩm đầu ra.",
                            materials: "Tài liệu đọc Nội dung 3",
                            assessment: "Kết quả thực hiện bài tập ghép đôi"
                        },
                        {
                            id: "act_10",
                            code: "Hoạt động 10",
                            name: "Thực hành thiết kế chủ đề/bài học có ứng dụng CNTT",
                            mode: "in_person",
                            target: "Đề xuất phương án ứng dụng CNTT; thiết kế hồ sơ bài dạy cho chủ đề cụ thể.",
                            tasks: "Lựa chọn chủ đề/bài học môn học; thiết kế hồ sơ bài dạy có ứng dụng CNTT; chia sẻ và báo cáo hồ sơ bài dạy.",
                            materials: "Tài liệu đọc, mẫu kế hoạch bài dạy 5512",
                            assessment: "Kết quả sản phẩm hồ sơ bài dạy của học viên"
                        },
                        {
                            id: "act_11",
                            code: "Hoạt động 11",
                            name: "Đánh giá chủ đề/bài học có ứng dụng CNTT",
                            mode: "in_person",
                            target: "Trình bày tiêu chí đánh giá; đánh giá hồ sơ bài dạy của học viên khác và đề xuất cải tiến.",
                            tasks: "Đọc và đánh giá hồ sơ bài dạy của bạn học; đề xuất phương án cải tiến.",
                            materials: "Hồ sơ bài dạy của học viên khác, phiếu đánh giá rubric",
                            assessment: "Kết quả đánh giá và chất lượng phương án cải tiến"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 3: PHẢN HỒI, ĐÁNH GIÁ (Trực tuyến)",
                    activities: [
                        {
                            id: "act_12",
                            code: "Hoạt động 12",
                            name: "Hoàn thiện sản phẩm học tập và nộp bài",
                            mode: "online",
                            target: "Nộp sản phẩm đánh giá cuối khóa lên hệ thống quản lý học tập LMS.",
                            tasks: "Xem nhận xét của giảng viên và bạn học; hoàn thiện sản phẩm và nộp bài cuối khóa.",
                            materials: "Hồ sơ bài dạy hoàn thiện",
                            assessment: "Đánh giá tổng kết (Trọng số 50% điểm cuối kỳ)"
                        },
                        {
                            id: "act_13",
                            code: "Hoạt động 13",
                            name: "Phản hồi khóa bồi dưỡng",
                            mode: "online",
                            target: "Cung cấp ý kiến đánh giá chất lượng khóa học.",
                            tasks: "Hoàn thành phiếu khảo sát đánh giá khóa học.",
                            materials: "Phiếu khảo sát trực tuyến",
                            assessment: "Kết quả phản hồi của học viên"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Trả lời 10 câu hỏi trắc nghiệm khách quan (Hoạt động 5)",
                    "Các bài tập thực hành sử dụng phần mềm dạy học (Hoạt động 7)",
                    "Nộp hồ sơ bài dạy có ứng dụng CNTT hoàn thiện lên hệ thống LMS (Hoạt động 12)"
                ],
                inPerson: [
                    "Hồ sơ bài dạy sơ bộ và bài trình bày báo cáo tại lớp (Hoạt động 10)",
                    "Phiếu đánh giá nhận xét chéo và đề xuất cải tiến bài dạy của nhóm khác (Hoạt động 11)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Hoạt động 5: Kiểm tra kết thúc nội dung 1 (10 câu TNKQ)", weight: 10, condition: "Đạt từ 5.0 trở lên hoặc hoàn thành trên 50% bài tập" },
                    { name: "Hoạt động 7: Các bài tập thực hành sử dụng phần mềm", weight: 40, condition: "Đạt từ 5.0 trở lên" }
                ],
                summative: {
                    name: "Hoạt động 12: Thiết kế hồ sơ bài dạy có ứng dụng công nghệ thông tin cho một chủ đề/bài học cụ thể",
                    weight: 50,
                    condition: "Đạt từ 5.0 điểm trở lên. Điều kiện dự thi: Tham gia trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm chấm từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Hình thức nộp bài: Nộp bài tập trên hệ thống quản lý học tập LMS theo hướng dẫn."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Bộ Giáo dục và Đào tạo (2020). Thông tư số 32/2020/TT-BGDĐT ban hành điều lệ trường trung học cơ sở, trường trung học phổ thông và trường phổ thông có nhiều cấp học.",
                "[2] Bộ Giáo dục và Đào tạo (2020). Công văn số 5512/BGDĐT-GDTrH về tổ chức thực hiện kế hoạch giáo dục trong trường học.",
                "[3] Bộ Giáo dục và Đào tạo (2020). Thông tư số 09/2021/TT-BGDĐT quy định về quản lý và tổ chức dạy học trực tuyến trong cơ sở giáo dục phổ thông và cơ sở giáo dục thường xuyên.",
                "[4] Bộ Giáo dục và Đào tạo (2018). Chương trình giáo dục phổ thông, Chương trình tổng thể và Chương trình môn học (Ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT ngày 26 tháng 12 năm 2018 của Bộ trưởng Bộ Giáo dục và Đào tạo).",
                "[5] VVOB (2010). Công nghệ thông tin cho dạy học tích cực. https://vietnam.vvob.org/sites/vietnam/files/huong_dan_sd_bo_cong_cu_vietnamese.pdf",
                "[6] UNESCO (2018). ICT Competency Framework for Teachers. https://unesdoc.unesco.org/ark:/48223/pf0000265721",
                "[7] Jane Hart (2020). Top Tools for Learning 2020. https://www.toptools4learning.com/jane-hart/"
            ]
        },
        grades: { attendance: 9.5, midterm: 9.0, final: 9.2 }
    },

    // ---------------------------------------------------------------------
    // 2. MÃ HỌC PHẦN: A07 - RÈN LUYỆN NGHIỆP VỤ SƯ PHẠM
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a07",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A07",
        name: "Rèn luyện nghiệp vụ sư phạm",
        credits: 3,
        category: "mandatoryA",
        knowledgeBlock: "mandatoryA",
        semester: "1",
        type: "practice",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Không",
        instructor: "ThS. Nguyễn Thị Thu Trang",
        instructorEmail: "trangntt@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "09/06/2021",
            authorTeam: [
                "TS. Mai Thu Trang (Trưởng nhóm)",
                "ThS. Đặng Văn Khoa",
                "ThS. Dương Tấn Giàu",
                "TS. Phan Thị Thu Hiền",
                "TS. Lý Gia Tiên",
                "ThS. Mai Hoàng Phương",
                "ThS. Ngô Minh Đức",
                "TS. Nguyễn Thị Hằng",
                "TS. Trịnh Lê Hồng Phương",
                "ThS. Nguyễn Phước Bảo Khôi",
                "TS. Phạm Thị Bình",
                "ThS. Trần Quang Nam",
                "ThS. Võ Thị Hồng Trước",
                "ThS. Hồ Thị Ngọc Thanh"
            ],
            approver: "TS. Mai Thu Trang (Trưởng Bộ môn / Trưởng nhóm)",
            instructor: "ThS. Nguyễn Thị Thu Trang",
            instructorEmail: "trangntt@lecturer.hcmue.edu.vn",
            prerequisites: "Không",
            hoursBreakdown: {
                total: 90,
                theory: 0,
                practice: 90,
                inPerson: 30,
                online: 60
            },
            description: "Học phần thực hành chuyên sâu nhằm hình thành và tôi luyện các kỹ năng nghiệp vụ sư phạm cốt lõi: xử lý thông tin giáo dục, ứng dụng CNTT, ngôn ngữ thuyết trình, chữ viết và trình bày bảng khoa học, thiết lập và sử dụng phương tiện dạy học.",
            objectives: [
                { code: "T1", text: "Kỹ năng sáng tạo và khai thác, lưu trữ, xử lý thông tin giáo dục." },
                { code: "T2", text: "Kỹ năng sử dụng công nghệ thông tin thông dụng trong dạy học." },
                { code: "T3", text: "Kỹ năng sử dụng ngôn ngữ nói và thuyết trình, kỹ năng viết và trình bày bảng." },
                { code: "T4", text: "Kỹ năng sử dụng phương tiện dạy học." }
            ],
            clos: [
                "Thành thạo kỹ năng tìm kiếm, chọn lọc, xử lý và chia sẻ học liệu số phục vụ giảng dạy.",
                "Soạn thảo kế hoạch dạy học số, bài trình chiếu tương tác và tạo môi trường học tập kết hợp.",
                "Vận dụng chuẩn mực ngôn ngữ nói, kiểm soát ngữ điệu, tư thế viết bảng ngay ngắn, rõ đẹp và bố cục khoa học.",
                "Vận hành, kết nối thành thạo và xử lý sự cố thiết bị công nghệ dạy học hiện đại."
            ],
            contentOutline: [
                {
                    title: "1. Tổng quan về các kỹ năng, kỹ xảo cần vận dụng trong quá trình rèn luyện NVSP",
                    items: [
                        "Bản chất, đặc điểm, quy trình và ý nghĩa của hoạt động rèn luyện nghiệp vụ sư phạm tại trường THCS, THPT"
                    ],
                    discussion: "Học viên đọc hướng dẫn, thực hiện nhiệm vụ của từng hoạt động, xem tài liệu PDF"
                },
                {
                    title: "2. Rèn luyện kỹ năng khai thác, lưu trữ, xử lý thông tin giáo dục và sử dụng ứng dụng CNTT",
                    items: [
                        "2.1. Thực hành tìm kiếm, xử lý, chọn lọc thông tin giáo dục; lưu trữ, quản lý và chia sẻ tài liệu trên máy tính và internet",
                        "2.2. Thực hành soạn thảo kế hoạch dạy học môn Tin học trên máy tính và bài trình chiếu đa phương tiện; tạo môi trường học tập tương tác; xây dựng mô hình học tập kết hợp; tạo và trộn đề thi trắc nghiệm; quản lý hồ sơ chuyên môn số"
                    ],
                    discussion: "Thảo luận làm việc nhóm và thực hành tạo & trộn đề thi"
                },
                {
                    title: "3. Hình thành và vận dụng linh hoạt ngôn ngữ nói, thuyết trình, viết và trình bày bảng",
                    items: [
                        "3.1. Thực hành phát âm tròn vành, rõ chữ, kiểm soát giọng nói, ngữ điệu, khắc phục khuyết tật nói",
                        "3.2. Xây dựng đề cương thuyết trình; thực hành thuyết trình theo đề cương",
                        "3.3. Thực hành mở đầu bài thuyết trình, giao tiếp mắt, ngôn ngữ cơ thể, rèn luyện sự tự tin",
                        "3.4. Rèn luyện tư thế viết bảng (phấn/bút dạ), cầm phấn, sử dụng giẻ lau, kiểm soát lớp học khi viết",
                        "3.5. Rèn luyện viết chữ thẳng hàng, đều, sạch đẹp, đúng chính tả chữ hoa, chữ thường",
                        "3.6. Rèn luyện trình bày bảng khoa học: viết tên bài học, cấu trúc đề mục, tạo điểm nhấn trực quan"
                    ],
                    discussion: "Thực hành phát âm, thuyết trình nhóm và rèn chữ viết bảng tại giảng đường"
                },
                {
                    title: "4. Thiết lập sáng tạo và sử dụng phương tiện dạy học",
                    items: [
                        "4.1. Cấu tạo, chức năng và kết nối phương tiện thiết bị dạy học (máy tính, máy chiếu, bảng tương tác, âm thanh, máy quay)",
                        "4.2. Thực hành kết nối hệ thống có dây và không dây giữa thiết bị cá nhân với phương tiện dùng chung; khắc phục sự cố kết nối",
                        "4.3. Thực hành bảo quản, sửa chữa nhỏ các phương tiện, thiết bị dùng chung"
                    ],
                    discussion: "Thực hành đấu nối dây cáp, cân chỉnh âm thanh, máy chiếu và bảo quản thiết bị"
                }
            ],
            learningStages: [
                {
                    stageName: "PHẦN 1: BỒI DƯỠNG TRỰC TUYẾN (60 tiết)",
                    activities: [
                        {
                            id: "act_a07_1",
                            code: "Nội dung 1",
                            name: "Tổng quan về kỹ năng rèn luyện NVSP",
                            mode: "online",
                            target: "Nắm vững mục tiêu, bản chất, đặc điểm và quy trình rèn luyện NVSP.",
                            tasks: "Đọc hướng dẫn, xem tài liệu PDF và nộp sản phẩm thực hành.",
                            materials: "Tài liệu PDF tổng quan",
                            assessment: "Sản phẩm thực hành (Cô Thanh phụ trách)"
                        },
                        {
                            id: "act_a07_2",
                            code: "Nội dung 2",
                            name: "Rèn luyện kỹ năng xử lý thông tin giáo dục & ứng dụng CNTT",
                            mode: "online",
                            target: "Đạt chuẩn T1, T2: Soạn KHBD số, tạo ngân hàng đề thi trắc nghiệm.",
                            tasks: "Thảo luận nhóm, thực hành tạo đề, trộn đề thi và xây dựng học liệu tương tác.",
                            materials: "Phần mềm trộn đề, LMS, bài giảng mẫu",
                            assessment: "Sản phẩm thực hành trộn đề thi (Thầy Phương, Thầy Đức, Cô Trước)"
                        }
                    ]
                },
                {
                    stageName: "PHẦN 2: BỒI DƯỠNG TRỰC TIẾP (30 tiết)",
                    activities: [
                        {
                            id: "act_a07_3",
                            code: "Nội dung 3",
                            name: "Rèn luyện ngôn ngữ nói, thuyết trình, viết và trình bày bảng",
                            mode: "in_person",
                            target: "Đạt chuẩn T3: Phát âm chuẩn, diễn đạt lưu loát, chữ viết bảng ngay ngắn, bố cục khoa học.",
                            tasks: "Thực hành phát âm, mở đầu bài giảng, điều khiển ánh mắt, đứng viết bảng và bố cục bảng sư phạm trước hội đồng giảng viên.",
                            materials: "Phấn viết, bảng từ, giẻ lau, micro",
                            assessment: "Sản phẩm thực hành thuyết trình & viết bảng (Cô Trước, Cô Bình, Cô Yến, Cô Hiền, Cô Hằng, Thầy Bảo)"
                        },
                        {
                            id: "act_a07_4",
                            code: "Nội dung 4",
                            name: "Thiết lập sáng tạo và sử dụng phương tiện dạy học",
                            mode: "in_person",
                            target: "Đạt chuẩn T4: Kết nối thành thạo thiết bị trình chiếu, âm thanh, bảng tương tác.",
                            tasks: "Thực hành đấu nối hệ thống, xử lý tình huống mất hình ảnh/âm thanh và bảo dưỡng thiết bị.",
                            materials: "Máy tính, máy chiếu đa phương tiện, cáp HDMI/VGA, bảng tương tác, micro, loa",
                            assessment: "Sản phẩm thực hành kết nối thiết bị (Cô Thanh, Thầy Phương, Thầy Nam, Thầy Giàu)"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Sản phẩm thực hành khai thác thông tin và trộn đề trắc nghiệm trực tuyến"
                ],
                inPerson: [
                    "Sản phẩm thực hành thuyết trình sư phạm và bảng viết mẫu tại lớp",
                    "Thao tác vận hành kết nối phương tiện thiết bị dạy học"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Giảng viên đánh giá sản phẩm thực hành", weight: 25, condition: "Đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: Giảng viên đánh giá sản phẩm thực hành", weight: 25, condition: "Đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Thực hành kết hợp vấn đáp",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập thì được tham dự đánh giá cuối học phần."
            },
            weights: { attendance: 20, midterm: 30, final: 50 },
            references: [
                "[1] Bộ Giáo dục và Đào tạo (2012). Thông tư số 46/2012/TT-BGD ĐT ngày 04 tháng 12 năm 2012.",
                "[2] Bộ giáo dục và Đào tạo (2014-2015). Công văn số 4099/BGDĐT-GDTrH. (Công văn v/v Hướng dẫn thực hiện nhiệm vụ Giáo dục Trung học năm học 2014-2015).",
                "[3] Bộ giáo dục và Đào tạo (2020-2021). Chương trình ETEP, mođun 9 ứng dụng CNTT trong quản lý và giáo dục."
            ]
        },
        grades: { attendance: 9.0, midterm: 8.5, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 3. MÃ HỌC PHẦN: A10 - QUẢN LÝ LỚP HỌC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a10",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A10",
        name: "Quản lý lớp học",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học và Tâm lý học giáo dục",
        instructor: "TS. Lê Thị Minh Hương",
        instructorEmail: "huongltm@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "17/05/2021",
            authorTeam: [
                "TS.GVC Nguyễn Thị Bích Hồng (Trưởng nhóm)",
                "ThS. Đào Thị Duy Duyên",
                "ThS. Nguyễn Đình Ký"
            ],
            approver: "TS.GVC Nguyễn Thị Bích Hồng (Trưởng Bộ môn / Trưởng nhóm)",
            instructor: "TS. Lê Thị Minh Hương",
            instructorEmail: "huongltm@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học và Tâm lý học giáo dục",
            hoursBreakdown: {
                total: 45,
                theory: 15,
                practice: 30,
                inPerson: 15,
                online: 30
            },
            description: "Học phần giúp học viên hệ thống hóa kiến thức và nâng cao kỹ năng quản lý lớp học trong quá trình dạy học và công tác chủ nhiệm theo quan điểm giáo dục kỷ luật tích cực ở trường THCS/THPT.",
            objectives: [
                { code: "1", text: "Xác định quan điểm giáo dục tích cực trong quản lý lớp học." },
                { code: "2", text: "Liệt kê và vận dụng các biện pháp quản lý lớp học theo quan điểm giáo dục tích cực trong quá trình dạy học và công tác chủ nhiệm." }
            ],
            clos: [
                "Xác định và phân tích thấu đáo các quan điểm giáo dục tự trị, bị trị và kỷ luật tích cực trong quản lý lớp học.",
                "Vận dụng các biện pháp quản lý lớp học bằng nội dung, phương pháp, kiểm tra đánh giá và quản lý môi trường học tập an toàn.",
                "Xây dựng kế hoạch và tổ chức quản lý hồ sơ, nội quy, hoạt động và các mối quan hệ lớp học trong công tác chủ nhiệm.",
                "Xử lý thành thạo tình huống sư phạm thực tế liên quan đến bầu không khí tâm lý và phối hợp hiệu quả giữa nhà trường và gia đình."
            ],
            contentOutline: [
                {
                    title: "A. NỘI DUNG LÝ THUYẾT (15 tiết)",
                    items: [
                        "1. Lý luận chung về quản lý lớp học (1.1. Khái niệm quản lý, quản lý giáo dục, quản lý lớp học; 1.2. Quan điểm giáo dục tự trị, bị trị và kỷ luật tích cực trong quản lý lớp học)",
                        "2. Quản lý lớp học trong quá trình dạy học theo quan điểm giáo dục kỷ luật tích cực ở trường THCS/THPT (2.1. Nội dung và biện pháp quản lý lớp học theo cấu trúc của quá trình dạy học: bằng nội dung, phương pháp dạy học & bằng kiểm tra, đánh giá học tập; 2.2. Nội dung và biện pháp quản lý môi trường học tập: cơ sở vật chất, môi trường vật lý, bầu không khí tâm lý lớp học)",
                        "3. Quản lý lớp học trong công tác chủ nhiệm theo quan điểm giáo dục kỷ luật tích cực (3.1. Nội dung và biện pháp quản lý hồ sơ lớp học; 3.2. Quản lý các hoạt động của lớp: xây dựng nội quy, tổ chức hoạt động, điều phối sự tham gia, kiểm tra đánh giá hiệu quả; 3.3. Quản lý các mối quan hệ: học sinh - học sinh trên lớp & mạng xã hội, học sinh - giáo viên, học sinh - gia đình, học sinh - xã hội)"
                    ],
                    discussion: "Học viên nghiên cứu tài liệu, chuẩn bị bài thuyết trình nhóm và trao đổi tình huống thực tiễn"
                },
                {
                    title: "B. NỘI DUNG THỰC HÀNH (30 tiết - Chọn 2 trong 6 nội dung)",
                    items: [
                        "1. Thực hành xử lý tình huống liên quan đến bầu không khí lớp học bằng giáo dục kỷ luật tích cực",
                        "2. Xây dựng một số cách thức kiểm tra đánh giá theo quan điểm giáo dục tự trị",
                        "3. Lên kế hoạch và thiết kế được các biện pháp xây dựng môi trường học tập an toàn và lành mạnh cho học sinh THCS/THPT",
                        "4. Tổ chức xây dựng nội quy lớp học theo quan điểm giáo dục kỷ luật tích cực",
                        "5. Xử lý tình huống về các mối quan hệ của lớp học bằng quan điểm giáo dục kỷ luật tích cực",
                        "6. Xây dựng một số cách thức phối hợp với gia đình trong việc áp dụng kỷ luật tích cực cho lớp học"
                    ],
                    discussion: "Làm việc nhóm thiết kế sản phẩm thu hoạch, đóng vai xử lý tình huống và xây dựng biện pháp chủ nhiệm"
                }
            ],
            learningStages: [
                {
                    stageName: "PHẦN 1: BỒI DƯỠNG TRỰC TUYẾN (30 tiết)",
                    activities: [
                        {
                            id: "act_a10_0",
                            code: "Hướng dẫn",
                            name: "Hướng dẫn học trực tuyến",
                            mode: "online",
                            target: "Nắm vững mục tiêu, nội dung học phần và cách thức tham gia bồi dưỡng trực tuyến.",
                            tasks: "Đọc hướng dẫn giới thiệu mục tiêu, nội dung; tìm hiểu cách thức thực hiện hoạt động trực tuyến và kiểm tra đánh giá sản phẩm trên hệ thống LMS.",
                            materials: "Hướng dẫn học tập, Infographic môn học",
                            assessment: "Ghi nhận đăng nhập và tiếp nhận kế hoạch học tập"
                        },
                        {
                            id: "act_a10_1",
                            code: "Hoạt động 1",
                            name: "Tìm hiểu và trình bày khái niệm về quản lý, quản lý giáo dục và quản lý lớp học",
                            mode: "online",
                            target: "Trình bày được các khái niệm quản lý, quản lý giáo dục, quản lý lớp học và quan điểm giáo dục kỷ luật tích cực trong quản lý lớp học.",
                            tasks: "Đọc tài liệu và trình bày trực tuyến trước lớp các khái niệm quản lý, quản lý giáo dục và quản lý lớp học; nêu câu hỏi, thắc mắc cần GV hỗ trợ giải đáp trên hệ thống hoặc khi dạy trực tiếp.",
                            materials: "Tài liệu học phần Quản lý lớp học (Tài liệu 1)",
                            assessment: "Đánh giá cá nhân: nêu đúng được các khái niệm và các quan điểm trong quản lý lớp học"
                        },
                        {
                            id: "act_a10_2",
                            code: "Hoạt động 2",
                            name: "Thuyết trình nhóm: Quản lý lớp học trong quá trình dạy học theo quan điểm GD kỷ luật tích cực",
                            mode: "online",
                            target: "Trình bày được nội dung quản lý lớp học trong quá trình dạy học theo quan điểm giáo dục kỷ luật tích cực.",
                            tasks: "Mỗi nhóm nghiên cứu nội dung được phân công; làm việc nhóm và thuyết trình trực tuyến trước lớp; bàn luận và đặt câu hỏi phản biện làm rõ nội dung.",
                            materials: "Tài liệu website, sách giảng viên cung cấp",
                            assessment: "Đánh giá thuyết trình nhóm và chất lượng thảo luận phản biện"
                        },
                        {
                            id: "act_a10_3",
                            code: "Hoạt động 3",
                            name: "Thảo luận nhóm: Quản lý lớp học trong công tác chủ nhiệm theo quan điểm GD kỷ luật tích cực",
                            mode: "online",
                            target: "Hiểu và áp dụng được biện pháp quản lý hồ sơ lớp học và quản lý các hoạt động của lớp học.",
                            tasks: "Thảo luận nhóm và trình bày trực tuyến trước lớp nội dung quản lý lớp học bằng các biện pháp quản lý hồ sơ lớp học và quản lý các hoạt động của lớp học; ghi lại thắc mắc để GV giải đáp.",
                            materials: "Tài liệu web, tài liệu giảng viên cung cấp",
                            assessment: "Đánh giá mức độ hiểu và trình bày ý nghĩa của các biện pháp quản lý"
                        }
                    ]
                },
                {
                    stageName: "PHẦN 2: BỒI DƯỠNG TRỰC TIẾP (15 tiết)",
                    activities: [
                        {
                            id: "act_a10_intro",
                            code: "Giới thiệu & Phần 1",
                            name: "Tổ chức lớp & Trao đổi nhận xét quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Hệ thống hóa kết quả học trực tuyến, giải đáp thắc mắc và định hướng thực hành chuyên sâu.",
                            tasks: "Chia nhóm, phát kế hoạch và dụng cụ; học viên thảo luận theo nhóm và báo cáo lại những nội dung đã làm được và các nội dung cần GV hỗ trợ trực tiếp.",
                            materials: "Kế hoạch bồi dưỡng, dụng cụ học tập",
                            assessment: "Mức độ tích cực thảo luận và báo cáo của các nhóm"
                        },
                        {
                            id: "act_a10_4",
                            code: "Hoạt động 4",
                            name: "Dạy bổ sung các nội dung trọng tâm chưa thể thực hiện tốt với hình thức trực tuyến",
                            mode: "in_person",
                            target: "Hiểu được các nội dung trọng tâm chưa thể thực hiện tốt với hình thức trực tuyến.",
                            tasks: "Đặt câu hỏi, lắng nghe, ghi chép và phản hồi mức độ tiếp thu; trả lời đúng những câu hỏi kiểm tra lại của GV.",
                            materials: "Tất cả tài liệu / Bài giảng của GV",
                            assessment: "Đánh giá tham gia đúng giờ, nhiệt tình đóng góp và trả lời đúng câu hỏi kiểm tra của GV"
                        },
                        {
                            id: "act_a10_5",
                            code: "Hoạt động 5",
                            name: "Thực hành xử lý tình huống và thiết kế biện pháp quản lý lớp học",
                            mode: "in_person",
                            target: "Các nhóm học viên hoàn thành và nộp sản phẩm thu hoạch thực hành theo nội dung phân công (chọn 2 trong 6 nội dung thực hành).",
                            tasks: "Làm việc nhóm thiết kế xây dựng sản phẩm thu hoạch (xử lý tình huống bầu không khí lớp học, kiểm tra đánh giá tự trị, môi trường học tập an toàn, nội quy lớp học, quan hệ lớp học, phối hợp phụ huynh); bảo vệ và phản biện sản phẩm.",
                            materials: "Tất cả tài liệu / sáng kiến kinh nghiệm thực tế",
                            assessment: "Đánh giá sản phẩm: đúng thời hạn, đúng nội dung/hình thức và trả lời tốt câu hỏi phản biện"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Bài thu hoạch cá nhân về những điểm mới, giá trị cốt lõi trong quá trình học trực tuyến"
                ],
                inPerson: [
                    "Tiểu luận đánh giá cuối kỳ: Mỗi nhóm chọn 1 trong 6 nội dung thực hành để xây dựng hồ sơ biện pháp và xử lý tình huống quản lý lớp học"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Chấm điểm hoàn thành bài tập nhóm trên hệ thống LMS", weight: 25, condition: "Đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: Giảng viên chấm điểm hoạt động bồi dưỡng trực tiếp", weight: 25, condition: "Đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Tiểu luận (Mỗi nhóm chọn 1 trong 6 nội dung thực hành)",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm. Điều kiện dự thi: HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập thì được tham dự đánh giá cuối học phần."
            },
            weights: { attendance: 20, midterm: 30, final: 50 },
            references: [
                "[1] Nguyễn Thị Bích Hồng, Đào Thị Duy Duyên, Nguyễn Đình Ký (tổng hợp, biên soạn) (2021). Tài liệu học phần Quản lý lớp học. Lưu hành nội bộ.",
                "[2] Đặng Huỳnh Mai (2010). Phương Pháp tổ chức quản lý lớp học. NXB Đại học sư phạm TP.HCM.",
                "[3] Đoàn Huy Oánh (2005). Tâm lý sư phạm. NXB Đại học Quốc gia TPHCM.",
                "[4] Garrett, T. (2014). Effective classroom management: The essentials. Teachers College Press.",
                "[5] Nguyễn Lăng Bình, Tạ Thúy Hạnh, Phan Thị Lạc (2015). Tài liệu bồi dưỡng Giáo viên Trung học phổ thông về giáo dục kỉ luật tích cực. Dự án phát triển giáo dục trung học phổ thông giai đoạn II. Hà Nội.",
                "[6] Phạm Thị Kim Anh (2020). Một số kĩ năng quản lí lớp học trong giờ học của giáo viên ở trường phổ thông hiện nay. Dạy và Học ngày nay, số kì 1-7/2020, tr49, 63.",
                "[7] Robert J. Marzano (2003). Quản lý hiệu quả lớp học. Nhà xuất bản giáo dục Việt Nam."
            ]
        },
        grades: { attendance: 9.0, midterm: 8.8, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 3. MÃ HỌC PHẦN: A6 - GIAO TIẾP SƯ PHẠM
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a6",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A6",
        name: "Giao tiếp sư phạm",
        credits: 2,
        category: "mandatoryA",
        knowledgeBlock: "mandatoryA",
        semester: "1",
        type: "mandatory",
        isSelected: true,
        status: "in_progress",
        prerequisites: "A2 Giáo dục học",
        instructor: "TS. Bùi Hồng Quân",
        instructorEmail: "quanbh@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "2021",
            authorTeam: [
                "PGS. TS. Huỳnh Văn Sơn (Chủ biên)",
                "PGS. TS. Võ Văn Nam",
                "TS. Võ Thị Tường Vy",
                "TS. Mai Mỹ Hạnh"
            ],
            approver: "Trưởng Bộ môn Tâm lý học / Giao tiếp sư phạm - Trường ĐH Sư phạm TP.HCM",
            instructor: "TS. Bùi Hồng Quân",
            instructorEmail: "quanbh@lecturer.hcmue.edu.vn",
            prerequisites: "A2 Giáo dục học",
            hoursBreakdown: {
                total: 50,
                theory: 10,
                practice: 40,
                inPerson: 40,
                online: 10
            },
            description: "Học phần hỗ trợ, giúp học viên trình bày được những vấn đề cơ bản về quá trình giao tiếp sư phạm, nguyên tắc giao tiếp sư phạm và các qui tắc ứng xử trong trường học; phân tích được qui trình và các kỹ năng giao tiếp sư phạm của giáo viên, xử lý được các tình huống sư phạm phổ biến đối với các giáo viên.",
            objectives: [
                { code: "O1", text: "Trình bày được những vấn đề cơ bản về quá trình giao tiếp sư phạm, nguyên tắc giao tiếp sư phạm và các qui tắc ứng xử trong trường học." },
                { code: "O2", text: "Phân tích được qui trình và các kỹ năng giao tiếp sư phạm của giáo viên, xử lý được các tình huống sư phạm phổ biến đối với các giáo viên." }
            ],
            clos: [
                "Nắm vững bản chất, đặc trưng, vai trò, chức năng và các giai đoạn của quá trình giao tiếp sư phạm.",
                "Nhận diện và phân tích sâu sắc các phong cách giao tiếp sư phạm (dân chủ, độc đoán, tự do) gắn liền với nhân cách người thầy.",
                "Thực hành thành thạo hệ thống kỹ năng giao tiếp: định hướng, ấn tượng ban đầu, lắng nghe, phản hồi/khen chê, kiểm soát cảm xúc và điều chỉnh.",
                "Vận dụng quy trình xử lý khéo léo các tình huống giao tiếp sư phạm giữa giáo viên với học sinh và giữa giáo viên với cha mẹ học sinh."
            ],
            contentOutline: [
                {
                    title: "1. Khái quát về giao tiếp Sư phạm",
                    items: [
                        "a. Bản chất của hoạt động giao tiếp, văn hóa giao tiếp và ứng xử",
                        "b. Đặc trưng, vai trò và chức năng của giao tiếp Sư phạm",
                        "c. Đối tượng và phương tiện giao tiếp Sư phạm",
                        "d. Các giai đoạn của quá trình giao tiếp Sư phạm",
                        "e. Các loại phong cách giao tiếp sư phạm",
                        "f. Mối liên hệ giữa nhân cách của nhà giáo với phong cách giao tiếp Sư phạm"
                    ],
                    discussion: "Thảo luận về chuẩn mực văn hóa ứng xử sư phạm và mối liên hệ giữa nhân cách với phong cách người thầy."
                },
                {
                    title: "2. Nguyên tắc giao tiếp Sư phạm và quy tắc ứng xử trong trường học",
                    items: [
                        "a. Các nguyên tắc giao tiếp Sư phạm: (i) Đảm bảo tính mô phạm; (ii) Tôn trọng nhân cách; (iii) Thiện chí; (iv) Đồng cảm; (v) Tạo niềm tin trong giao tiếp Sư phạm",
                        "b. Quy tắc ứng xử trong trường học"
                    ],
                    discussion: "Phân tích tình huống vi phạm nguyên tắc tôn trọng nhân cách học sinh và giải pháp khắc phục."
                },
                {
                    title: "3. Quy Trình và kỹ năng giao tiếp Sư phạm",
                    items: [
                        "a. Quy trình giao tiếp sư phạm dựa trên các khâu của quá trình dạy học và quá trình giáo dục",
                        "b. Các kỹ năng giao tiếp Sư phạm: (i) Kỹ năng định hướng giao tiếp Sư phạm; (ii) Kỹ năng tạo ấn tượng ban đầu; (iii) Kỹ năng lắng nghe; (iv) Kỹ năng phản hồi, khen ngợi, phê bình, trách phạt; (v) Kỹ năng kiểm soát cảm xúc bản thân; (vi) Kỹ năng điều khiển điều chỉnh quá trình giao tiếp Sư phạm"
                    ],
                    discussion: "Bài tập rèn luyện kỹ năng phản hồi khen chê tích cực và phương pháp kiểm soát cơn giận sư phạm."
                },
                {
                    title: "4. Xử lý tình huống sư phạm",
                    items: [
                        "a. Phân loại các tình huống giao tiếp sư phạm đối với giáo viên",
                        "b. Quy trình, kỹ năng xử lý các tình huống giao tiếp Sư phạm",
                        "c. Thực hành xử lý tình huống giao tiếp giữa giáo viên và học sinh",
                        "d. Thực hành xử lý tình huống giao tiếp giữa giáo viên và cha mẹ học sinh"
                    ],
                    discussion: "Đóng vai xử lý tình huống xung đột học sinh trong lớp và ứng xử khi phụ huynh phản ánh bức xúc."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (10 tiết)",
                    activities: [
                        {
                            id: "act_a6_intro",
                            code: "Hướng dẫn",
                            name: "Hướng dẫn học trực tuyến môđun Giao tiếp sư phạm",
                            mode: "online",
                            target: "Nắm bắt mục tiêu, nội dung học phần và phương pháp thực hiện các hoạt động trực tuyến.",
                            tasks: "Xem video/file tài liệu hướng dẫn học tập trực tuyến; tìm hiểu cách thức thực hiện kiểm tra đánh giá và nộp sản phẩm.",
                            materials: "Video giới thiệu, File tài liệu hướng dẫn trực tuyến",
                            assessment: "Xác nhận đã xem và hoàn thành hướng dẫn trực tuyến"
                        },
                        {
                            id: "act_a6_1",
                            code: "Hoạt động 1",
                            name: "Làm quen trên diễn đàn chung",
                            mode: "online",
                            target: "Tạo sự gắn kết lớp học, xác định động cơ và kỳ vọng đối với học phần Giao tiếp sư phạm.",
                            tasks: "Học viên giới thiệu về bản thân qua 3 câu hỏi trên diễn đàn chung: Tại sao đến với khóa học? Mong muốn điều gì? Dùng 3 từ để miêu tả về bản thân.",
                            materials: "Diễn đàn trao đổi chung của lớp học trực tuyến LMS",
                            assessment: "Tham gia đăng bài và tương tác đầy đủ trên diễn đàn"
                        },
                        {
                            id: "act_a6_2",
                            code: "Hoạt động 2",
                            name: "Khởi động tri thức (Trò chơi 'Đi tìm từ khóa')",
                            mode: "online",
                            target: "Trình bày được bản chất của hoạt động giao tiếp, văn hóa giao tiếp và ứng xử.",
                            tasks: "Tham gia trò chơi 'ĐI TÌM TỪ KHÓA' để chọn từ khóa gắn với khái niệm giao tiếp; Đọc tài liệu PDF; Thực hiện bài tập điền vào chỗ trống.",
                            materials: "Tài liệu PDF bản chất giao tiếp và ứng xử",
                            assessment: "Hoàn thành 100% bài tập điền vào chỗ trống"
                        },
                        {
                            id: "act_a6_3",
                            code: "Hoạt động 3",
                            name: "Vẽ sơ đồ tư duy chức năng giao tiếp sư phạm",
                            mode: "online",
                            target: "Trình bày được đặc trưng, vai trò và chức năng của giao tiếp Sư phạm.",
                            tasks: "Đọc tài liệu về đặc trưng vai trò chức năng; Xem clip 'Cảm động về Thầy Cô giáo' (YouTube: yfUjmhpBLvM) và viết cảm nghĩ; Vẽ sơ đồ tư duy tóm tắt các chức năng GTSP (từ 3 cấp độ trở lên) nộp lên hệ thống.",
                            materials: "Tài liệu PDF, Video clip YouTube (https://www.youtube.com/watch?v=yfUjmhpBLvM)",
                            assessment: "Hoàn thành viết cảm nghĩ clip và nộp sơ đồ tư duy đúng yêu cầu"
                        },
                        {
                            id: "act_a6_4",
                            code: "Hoạt động 4",
                            name: "Trò chơi 'Đuổi hình bắt chữ'",
                            mode: "online",
                            target: "Trình bày được đối tượng và phương tiện giao tiếp Sư phạm.",
                            tasks: "Đọc tài liệu về đối tượng và phương tiện giao tiếp; Tham gia trò chơi 'Đuổi hình bắt chữ' để tìm các từ khóa có liên quan đến nội dung đã đọc (5 từ khóa).",
                            materials: "Tài liệu PDF, Hình vẽ minh họa trò chơi",
                            assessment: "Hoàn thành được ít nhất 3/5 từ khóa trong trò chơi"
                        },
                        {
                            id: "act_a6_5",
                            code: "Hoạt động 5",
                            name: "Sắp xếp quy trình các giai đoạn giao tiếp",
                            mode: "online",
                            target: "Trình bày được các giai đoạn của quá trình giao tiếp Sư phạm.",
                            tasks: "Sắp xếp các giai đoạn của quá trình giao tiếp theo đúng trình tự; Đọc tài liệu củng cố kiến thức; Trả lời 10 câu hỏi trắc nghiệm Đúng / Sai trên LMS.",
                            materials: "Tài liệu PDF các giai đoạn GTSP, Bộ câu hỏi Đúng/Sai",
                            assessment: "Trả lời đúng tối thiểu 8/10 câu trắc nghiệm"
                        },
                        {
                            id: "act_a6_6",
                            code: "Hoạt động 6",
                            name: "Nối cột phong cách giao tiếp sư phạm",
                            mode: "online",
                            target: "Trình bày được các loại phong cách giao tiếp sư phạm và biểu hiện đặc trưng.",
                            tasks: "Tham gia trò chơi 'Nối cột' (Cột A: phong cách - Cột B: biểu hiện); Đọc tài liệu củng cố; Đọc 3 tình huống sư phạm cho sẵn và xác định phong cách giao tiếp của giáo viên trong mỗi tình huống.",
                            materials: "Tài liệu PDF, 3 tình huống sư phạm",
                            assessment: "Xác định đúng 3 phong cách giao tiếp sư phạm tương ứng với 3 tình huống"
                        },
                        {
                            id: "act_a6_7",
                            code: "Hoạt động 7",
                            name: "Đi tìm chân dung nhà giáo",
                            mode: "online",
                            target: "Trình bày được mối liên hệ giữa nhân cách của nhà giáo với phong cách giao tiếp Sư phạm.",
                            tasks: "Sưu tầm chân dung nhà giáo minh chứng nhân cách với phong cách GTSP (Word/PDF <= 2 trang, trong đó 0.5 trang bình luận, phân tích cá nhân); Xem clip YouTube (https://www.youtube.com/watch?v=6NpPdpc34qM&t=5s) và viết nhận xét ít nhất 5 dòng về cô giáo.",
                            materials: "Tài liệu PDF, Video clip YouTube (https://www.youtube.com/watch?v=6NpPdpc34qM&t=5s)",
                            assessment: "Hoàn thành bài sưu tầm chân dung đúng quy định + viết ít nhất 5 dòng nhận xét clip"
                        },
                        {
                            id: "act_a6_8",
                            code: "Hoạt động 8",
                            name: "Kiểm tra trắc nghiệm Chương 1",
                            mode: "online",
                            target: "Hệ thống hóa và đánh giá toàn bộ kiến thức cơ bản của Chương 1.",
                            tasks: "Trả lời 20 câu hỏi trắc nghiệm khách quan trên hệ thống LMS; Ghi lại các thắc mắc, câu hỏi cần giảng viên hỗ trợ giải đáp trong giai đoạn trực tiếp.",
                            materials: "Ngân hàng 20 câu hỏi trắc nghiệm trực tuyến LMS",
                            assessment: "Trả lời đúng từ 75% trở lên (được làm nhiều lần để hoàn thành điều kiện)"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (40 tiết)",
                    activities: [
                        {
                            id: "act_a6_intro_face",
                            code: "Giới thiệu",
                            name: "Giới thiệu khóa học & Tổ chức lớp học",
                            mode: "in_person",
                            target: "Thiết lập môi trường tương tác sư phạm, định hướng mục tiêu và kế hoạch bồi dưỡng trực tiếp.",
                            tasks: "Giới thiệu thành phần tham dự, giảng viên, chương trình bồi dưỡng; Chia nhóm học tập, phát kế hoạch và dụng cụ; Giới thiệu hình thức kiểm tra đánh giá, tài liệu tham khảo và tài nguyên học phần.",
                            materials: "Kế hoạch bồi dưỡng, Dụng cụ học tập, Tài nguyên môn học",
                            assessment: "Tham gia tổ chức lớp và phân công nhóm học tập"
                        },
                        {
                            id: "act_a6_p1",
                            code: "Phần 1",
                            name: "Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Giải quyết các khó khăn, vướng mắc phát sinh trong quá trình tự học trực tuyến.",
                            tasks: "Học viên thảo luận nhóm báo cáo lại nội dung đã làm trực tuyến và công việc cần hỗ trợ trực tiếp; Giảng viên hướng dẫn giải đáp thắc mắc.",
                            materials: "Báo cáo tổng kết tự học trực tuyến của nhóm",
                            assessment: "Đánh giá mức độ tích cực tham gia báo cáo và thảo luận nhóm"
                        },
                        {
                            id: "act_a6_p2",
                            code: "Phần 2",
                            name: "Hướng dẫn lý thuyết tương tác chuyên sâu",
                            mode: "in_person",
                            target: "Trình bày được các nguyên tắc GTSP, quy tắc ứng xử trong trường học; Phân tích quy trình và kỹ năng GTSP của giáo viên.",
                            tasks: "Giảng viên tổ chức giảng dạy nội dung: Nguyên tắc GTSP và quy tắc ứng xử, Quy trình và kỹ năng GTSP, Xử lý tình huống sư phạm (lý thuyết); Học viên tham gia trò chơi, thảo luận nhóm, thuyết trình theo nhóm, công não, vấn đáp đàm thoại.",
                            materials: "Tài liệu đọc chuyên sâu, Video, Tranh ảnh tình huống sư phạm",
                            assessment: "Đánh giá chuyên cần, tính tích cực phát biểu và bài thuyết trình của nhóm"
                        },
                        {
                            id: "act_a6_p3",
                            code: "Phần 3",
                            name: "Hướng dẫn thực hành xử lý tình huống sư phạm",
                            mode: "in_person",
                            target: "Thể hiện thành thạo các kỹ năng GTSP trong tình huống thực tế: định hướng, ấn tượng ban đầu, lắng nghe, phản hồi/khen/phê bình, kiểm soát cảm xúc và điều chỉnh.",
                            tasks: "Đóng vai học sinh - giáo viên - cha mẹ học sinh xử lý các tình huống sư phạm cụ thể; Nhận xét chéo giữa các nhóm; Nghe GV nhận xét, bổ sung nguyên tắc trọng tâm; Hoàn thành bài viết phân tích tình huống cá nhân/nhóm.",
                            materials: "Kịch bản tình huống sư phạm, Phiếu đánh giá đóng vai",
                            assessment: "Đánh giá mức độ hoàn thành nhiệm vụ đóng vai và chất lượng bài viết phân tích tình huống"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Sản phẩm bài tập theo yêu cầu trong từng hoạt động (Sơ đồ tư duy 3 cấp độ chức năng GTSP, bài thu hoạch sưu tầm chân dung nhà giáo kèm bình luận)",
                    "Kết quả kiểm tra 20 câu hỏi trắc nghiệm Chương 1 trên LMS (đạt từ 75% trở lên)"
                ],
                inPerson: [
                    "Bài thu hoạch phân tích tình huống sư phạm cá nhân/nhóm",
                    "Sản phẩm thực hành đóng vai và biên bản nhận xét chéo kỹ năng giao tiếp trực tiếp tại lớp"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống LMS", weight: 25, condition: "Đạt từ 5.0 điểm trở lên hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: Giảng viên chấm điểm hoạt động bồi dưỡng trực tiếp", weight: 25, condition: "Đạt từ 5.0 điểm trở lên" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Thi tự luận",
                    weight: 50,
                    condition: "Đạt từ 5.0 điểm trở lên. Điều kiện dự thi: Tham dự trên 80% số tiết trên lớp và hoàn thành đầy đủ các bài điều kiện."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Học viên cần tham gia tích cực hoạt động thực hành đóng vai tình huống sư phạm tại lớp."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Huỳnh Văn Sơn (chủ biên), Võ Văn Nam, Võ Thị Tường Vy, Mai Mỹ Hạnh (2017). Giao tiếp sư phạm. NXB Đại học Sư phạm TP.HCM.",
                "[2] Hoàng Anh, Đỗ Thị Châu (2012). 300 Tình huống giao tiếp sư phạm. NXB Giáo dục Việt Nam.",
                "[3] Huỳnh Văn Sơn, Nguyễn Thị Tứ, Bùi Hồng Quân, Nguyễn Hoàng Khắc Hiếu (2011). Tâm lý học giao tiếp. NXB Đại học Sư phạm TP.HCM.",
                "[4] Nguyễn Văn Lũy, Lê Quang Sơn (2015). Giáo trình giao tiếp sư phạm. NXB ĐH Sư Phạm Hà Nội."
            ]
        },
        grades: { attendance: 9.5, midterm: 8.8, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 4. MÃ HỌC PHẦN: A4 - ĐÁNH GIÁ TRONG GIÁO DỤC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a4",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A4",
        name: "Đánh giá trong giáo dục",
        credits: 2,
        category: "mandatoryA",
        knowledgeBlock: "mandatoryA",
        semester: "1",
        type: "mandatory",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học (A2)",
        instructor: "TS. Hoàng Thị Minh Phương",
        instructorEmail: "phuonghtm@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "2021",
            authorTeam: [
                "ThS. Lê Thùy Trang (Trưởng nhóm biên soạn đề cương)",
                "TS. Trần Khai Xuân",
                "TS. Nguyễn Thị Hằng",
                "TS. Phan Nguyễn Thái Phong",
                "ThS. Hà Văn Thắng",
                "TS. Mai Thu Trang",
                "ThS. Đào Thị Mộng Ngọc",
                "ThS. Mai Hoàng Phương",
                "TS. Phan Thị Thu Hiền",
                "TS. Nguyễn Thành Ngọc Bảo",
                "ThS. Đào Thị Hoàng Hoa",
                "TS. Nguyễn Thị Nga",
                "ThS. Bùi Quang Tuyến",
                "TS. Nguyễn Viết Hưng",
                "TS. Dư Thống Nhất",
                "ThS. Nguyễn Chung Hải"
            ],
            approver: "TS. Mai Thu Trang (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "TS. Hoàng Thị Minh Phương",
            instructorEmail: "phuonghtm@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học (A2)",
            hoursBreakdown: {
                total: 45,
                theory: 15,
                practice: 30,
                inPerson: 15,
                online: 30
            },
            description: "Học phần trang bị cho học viên mục đích, vai trò, nguyên tắc và quy trình kiểm tra, đánh giá trong giáo dục theo hướng phát triển phẩm chất, năng lực; kỹ năng thiết kế công cụ, thực hiện kiểm tra đánh giá quá trình và kết quả học tập; sử dụng và phân tích kết quả đánh giá để ghi nhận sự tiến bộ của học sinh và đổi mới phương pháp dạy học.",
            objectives: [
                { code: "O1", text: "Trình bày được mục đích, vai trò, nguyên tắc và quy trình kiểm tra, đánh giá trong giáo dục nói chung và kiểm tra, đánh giá học sinh theo hướng phát triển phẩm chất, năng lực nói riêng." },
                { code: "O2", text: "Biết cách thiết kế công cụ và thực hiện kiểm tra, đánh giá quá trình và kết quả học tập; sử dụng và phân tích kết quả đánh giá để ghi nhận sự tiến bộ của học sinh và đổi mới phương pháp dạy học." },
                { code: "O3", text: "Phân tích được: các loại hình đánh giá và các phương pháp, công cụ đánh giá trong dạy học; các mục tiêu học tập cơ bản của học sinh và các phương pháp kiểm tra dùng để đánh giá các mục tiêu đó." },
                { code: "O4", text: "Xây dựng được bộ công cụ kiểm tra, đánh giá quá trình dạy học; và các điều kiện cần thiết để sử dụng bộ công cụ này một cách hiệu quả." }
            ],
            clos: [
                "Nắm vững mục đích, vai trò, nguyên tắc và quy trình kiểm tra đánh giá phẩm chất, năng lực học sinh theo chuẩn CT GDPT 2018.",
                "Phân tích sâu sắc các loại hình đánh giá: tổng kết, quá trình, tiêu chí, cá nhân/nhóm và đánh giá xác thực.",
                "Sử dụng và phối hợp linh hoạt các phương pháp kiểm tra viết, quan sát, hỏi đáp và các công cụ câu hỏi, bài tập, bảng kiểm, thang đo, rubric.",
                "Thiết kế hoàn chỉnh ma trận, bản đặc tả, đề kiểm tra định kỳ và bộ công cụ đánh giá quá trình đáp ứng yêu cầu thực tiễn."
            ],
            contentOutline: [
                {
                    title: "CHƯƠNG 1. CƠ SỞ LÝ LUẬN/MỘT SỐ VẤN ĐỀ CHUNG VỀ KIỂM TRA, ĐÁNH GIÁ TRONG GIÁO DỤC",
                    items: [
                        "1.1. Khái niệm, mục đích, vai trò của kiểm tra, đánh giá trong giáo dục",
                        "1.2. Nguyên tắc kiểm tra, đánh giá trong giáo dục",
                        "1.3. Quy trình kiểm tra, đánh giá trong giáo dục",
                        "1.4. Yêu cầu về phẩm chất, năng lực của giáo viên trong kiểm tra, đánh giá học sinh",
                        "1.5. Tăng cường sự tham gia của cha mẹ học sinh trong kiểm tra, đánh giá quá trình và kết quả học tập, rèn luyện của học sinh"
                    ],
                    discussion: "Thảo luận về mối quan hệ giữa kiểm tra, đo lường và đánh giá năng lực học sinh theo định hướng hiện đại."
                },
                {
                    title: "CHƯƠNG 2. CÁC LOẠI HÌNH ĐÁNH GIÁ TRONG GIÁO DỤC",
                    items: [
                        "2.1. Đánh giá tổng kết",
                        "2.2. Đánh giá quá trình",
                        "2.3. Đánh giá theo tiêu chí",
                        "2.4. Đánh giá cá nhân và nhóm",
                        "2.5. Đánh giá xác thực và sáng tạo"
                    ],
                    discussion: "So sánh đánh giá quá trình vì sự tiến bộ của người học (Assessment for Learning) với đánh giá tổng kết."
                },
                {
                    title: "CHƯƠNG 3. PHƯƠNG PHÁP VÀ CÔNG CỤ ĐÁNH GIÁ TRONG DẠY HỌC",
                    items: [
                        "3.1. Các phương pháp kiểm tra, đánh giá: kiểm tra viết, quan sát, hỏi - đáp",
                        "3.2. Các công cụ đánh giá học sinh: câu hỏi, bài tập, đề kiểm tra, sản phẩm học tập, hồ sơ học tập, bảng kiểm, thang đánh giá, phiếu đánh giá theo tiêu chí",
                        "3.3. Tiêu chuẩn của một công cụ đánh giá"
                    ],
                    discussion: "Phân tích ưu nhược điểm của việc sử dụng hồ sơ học tập (e-Portfolio) và phiếu đánh giá Rubric."
                },
                {
                    title: "CHƯƠNG 4. THIẾT KẾ CÔNG CỤ ĐÁNH GIÁ TRONG DẠY HỌC",
                    items: [
                        "4.1. Quy trình thiết kế các công cụ đánh giá trong dạy học; xử lý kết quả đánh giá trong dạy học",
                        "4.2. Phản hồi kết quả đánh giá trong dạy học môn học; sử dụng kết quả đánh giá trong dạy học môn học",
                        "4.3. Ứng dụng công nghệ thông tin trong kiểm tra, đánh giá học sinh",
                        "4.4. Thực hành xây dựng công cụ kiểm tra, đánh giá trong quá trình dạy học một nội dung cụ thể; thực hành xây dựng đề kiểm tra định kỳ"
                    ],
                    discussion: "Thực hành biên soạn ma trận, bản đặc tả và câu hỏi trắc nghiệm/tự luận cho đề kiểm tra định kỳ."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (30 tiết)",
                    activities: [
                        {
                            id: "act_a4_1",
                            code: "Hoạt động 1",
                            name: "Mục đích, vai trò, nguyên tắc và quy trình kiểm tra, đánh giá trong giáo dục",
                            mode: "online",
                            target: "Đạt chuẩn O1: Trình bày được mục đích, vai trò, nguyên tắc và quy trình kiểm tra, đánh giá trong giáo dục nói chung và kiểm tra, đánh giá học sinh theo hướng phát triển phẩm chất, năng lực.",
                            tasks: "Tìm hiểu: (1) Mối quan hệ giữa kiểm tra, đánh giá và đo lường; (2) Yêu cầu phẩm chất, năng lực; (3) Mục đích, vai trò, bản chất, quy trình. Học viên đọc hướng dẫn, thực hiện nhiệm vụ của từng hoạt động, xem tài liệu trên LMS.",
                            materials: "Tài liệu đọc Chương 1, Video bài giảng trực tuyến LMS",
                            assessment: "Trắc nghiệm. Hệ thống đánh giá."
                        },
                        {
                            id: "act_a4_2",
                            code: "Hoạt động 2",
                            name: "Các loại hình đánh giá trong giáo dục",
                            mode: "online",
                            target: "Đạt chuẩn O3: Phân tích được các loại hình đánh giá và các phương pháp, công cụ đánh giá trong dạy học.",
                            tasks: "Tìm hiểu: (4) Đánh giá tổng kết; (5) Đánh giá quá trình; (6) Đánh giá theo tiêu chí; (7) Đánh giá cá nhân và nhóm; (8) Đánh giá xác thực và sáng tạo. Học viên đọc hướng dẫn, thực hiện nhiệm vụ của từng hoạt động, xem tài liệu.",
                            materials: "Tài liệu đọc Chương 2, Infographic so sánh các loại hình đánh giá",
                            assessment: "Trắc nghiệm. Hệ thống đánh giá."
                        },
                        {
                            id: "act_a4_3",
                            code: "Hoạt động 3",
                            name: "Phương pháp và công cụ đánh giá trong dạy học",
                            mode: "online",
                            target: "Đạt chuẩn O3: Nắm vững các mục tiêu học tập cơ bản của học sinh và phương pháp kiểm tra dùng để đánh giá các mục tiêu đó.",
                            tasks: "Tìm hiểu: công cụ, phương pháp, tiêu chuẩn. Học viên đọc hướng dẫn, thực hiện nhiệm vụ của từng hoạt động, xem tài liệu.",
                            materials: "Tài liệu đọc Chương 3, Biểu mẫu bảng kiểm và Rubric tham khảo",
                            assessment: "Trắc nghiệm. Hệ thống đánh giá."
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (15 tiết)",
                    activities: [
                        {
                            id: "act_a4_intro",
                            code: "Giới thiệu",
                            name: "Giới thiệu khóa học & Định hướng thực hành",
                            mode: "in_person",
                            target: "Làm rõ mục tiêu bồi dưỡng trực tiếp, chia nhóm chuyên môn và hướng dẫn xây dựng bộ công cụ đánh giá.",
                            tasks: "Giới thiệu mục tiêu, nội dung giai đoạn trực tiếp; Chia nhóm học tập theo môn học; Hướng dẫn quy trình thực hành thiết kế công cụ và tiêu chuẩn sản phẩm thực hành.",
                            materials: "Đề cương bồi dưỡng, Mẫu ma trận đề và Rubric chuẩn Bộ GD&ĐT",
                            assessment: "Xác nhận phân công nhóm và đăng ký chủ đề thực hành"
                        },
                        {
                            id: "act_a4_p1",
                            code: "Hoạt động 4",
                            name: "Thiết kế công cụ đánh giá trong dạy học",
                            mode: "in_person",
                            target: "Đạt chuẩn O2, O4: Biết cách thiết kế công cụ và thực hiện kiểm tra đánh giá quá trình và kết quả; Xây dựng được bộ công cụ kiểm tra, đánh giá quá trình dạy học và các điều kiện cần thiết để sử dụng hiệu quả.",
                            tasks: "Thảo luận và thực hành xây dựng công cụ kiểm tra, đánh giá trong quá trình dạy học một nội dung cụ thể; thực hành xây dựng đề kiểm tra định kỳ (ma trận đề, bản đặc tả, câu hỏi trắc nghiệm/tự luận, hướng dẫn chấm và phiếu đánh giá theo tiêu chí rubric); Báo cáo sản phẩm nhóm và nhận xét phản biện.",
                            materials: "Khung ma trận đề kiểm tra định kỳ, Phiếu đánh giá Rubric, Máy tính và máy chiếu",
                            assessment: "Sản phẩm thực hành bộ công cụ đánh giá của nhóm được GV chấm điểm trực tiếp"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Sản phẩm bài tập trắc nghiệm trên hệ thống LMS (hoàn thành đầy đủ các bài trắc nghiệm của 3 hoạt động)"
                ],
                inPerson: [
                    "Sản phẩm thực hành: Bộ công cụ kiểm tra đánh giá hoàn chỉnh (Ma trận đề, bản đặc tả đề kiểm tra định kỳ, đề thi minh họa, hướng dẫn chấm và phiếu đánh giá tiêu chí Rubric)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: GV chấm sản phẩm thực hành", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Thi tự luận",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm. Điều kiện: HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập thì được tham dự đánh giá cuối học phần."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân. Bám sát các phần đánh giá đã định hướng trong Thông tư.",
                notes: "Bắt buộc hoàn thành cả 2 bài điều kiện để đủ tiêu chuẩn tham dự thi tự luận cuối kỳ."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Nguyễn Công Khanh, Đào Thị Oanh (2015). Giáo trình kiểm tra đánh giá trong giáo dục. NXB ĐH Sư phạm.",
                "[2] Kiểm tra, đánh giá học sinh trung học phổ thông theo hướng phát triển năng lực – Tài liệu bồi dưỡng Module 3. ĐHSPHN, 2020."
            ]
        },
        grades: { attendance: 9.0, midterm: 8.5, final: 8.8 }
    },

    // ---------------------------------------------------------------------
    // 5. MÃ HỌC PHẦN: A05 - QUẢN LÝ NHÀ NƯỚC VỀ GIÁO DỤC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a05",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A05",
        name: "Quản lý nhà nước về giáo dục",
        credits: 2,
        category: "mandatoryA",
        knowledgeBlock: "mandatoryA",
        semester: "1",
        type: "mandatory",
        isSelected: true,
        status: "in_progress",
        prerequisites: "A02 Giáo dục học",
        instructor: "TS. Hoàng Thị Thanh Huyền",
        instructorEmail: "huyenhtt@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "05/06/2021",
            authorTeam: [
                "TS. Nguyễn Sỹ Thư (Nhóm biên soạn)",
                "TS. Dư Thống Nhất (Nhóm biên soạn)"
            ],
            approver: "TS. Dư Thống Nhất (Trưởng Bộ môn Quản lý giáo dục / Trưởng nhóm kiểm duyệt)",
            instructor: "TS. Hoàng Thị Thanh Huyền",
            instructorEmail: "huyenhtt@lecturer.hcmue.edu.vn",
            prerequisites: "A02 Giáo dục học",
            hoursBreakdown: {
                total: 40,
                theory: 20,
                practice: 20,
                inPerson: 10,
                online: 30
            },
            description: "Học phần giúp học viên trình bày được những vấn đề cơ bản về giáo dục trong xã hội hiện đại, quản lí nhà nước về giáo dục và hệ thống giáo dục quốc dân Việt Nam; phân tích được cơ cấu tổ chức, nguyên tắc và nội dung quản lí trường trung học; phân tích được nhiệm vụ, quyền hạn của giáo viên và các chức danh trong bộ máy quản lí nhà trường; hình thành ý thức tự giác chấp hành các quy định thuộc về quản lí hành chính nhà nước, quản lí giáo dục trong quá trình hoạt động nghề nghiệp.",
            objectives: [
                { code: "O1", text: "Trình bày được những vấn đề cơ bản về giáo dục trong xã hội hiện đại, quản lí nhà nước về giáo dục và hệ thống giáo dục quốc dân Việt Nam." },
                { code: "O2", text: "Phân tích được cơ cấu tổ chức, nguyên tắc và nội dung quản lí trường trung học." },
                { code: "O3", text: "Phân tích được, nhiệm vụ, quyền hạn của giáo viên và các chức danh trong bộ máy quản lí nhà trường." },
                { code: "O4", text: "Có ý thức tự giác chấp hành các quy định thuộc về quản lí hành chính nhà nước, quản lí giáo dục trong quá trình hoạt động nghề nghiệp." }
            ],
            clos: [
                "Trình bày rõ đặc điểm kinh tế tri thức, xu thế giáo dục thế giới và chiến lược phát triển giáo dục Việt Nam.",
                "Nắm vững các quy định của Luật Giáo dục 2019, Điều lệ trường trung học (Thông tư 32/2020) và Nghị định 127/2018.",
                "Phân tích cơ cấu tổ chức, nguyên tắc quản lý và phương thức vận hành trường THCS/THPT trong bối cảnh đổi mới.",
                "Thực thi đúng chức trách, nhiệm vụ, quyền hạn của giáo viên phổ thông và chấp hành nghiêm kỷ cương hành chính ngành giáo dục."
            ],
            contentOutline: [
                {
                    title: "1. Giáo dục trong xã hội hiện đại",
                    items: [
                        "1.1.1. Đặc điểm kinh tế tri thức/ xã hội hiện đại",
                        "1.1.2. Giáo dục trong nền kinh tế tri thức",
                        "1.1.3. Yêu cầu đặt ra đối với giáo dục trong thời đại mới",
                        "1.2. Xu thế và chiến lược phát triển giáo dục trên thế giới (1.2.1. Xu thế phát triển; 1.2.2. Chiến lược phát triển)",
                        "1.3. Chiến lược phát triển giáo dục, xã hội hóa giáo dục ở Việt Nam (1.3.1. Chiến lược phát triển giáo dục ở Việt Nam; 1.3.2. Xã hội hóa giáo dục ở Việt Nam)"
                    ],
                    discussion: "Thảo luận về cơ hội và thách thức của nền kinh tế tri thức và chuyển đổi số đối với giáo dục phổ thông Việt Nam."
                },
                {
                    title: "2. Quản lý hành chính nhà nước và quản lý nhà nước về giáo dục",
                    items: [
                        "2.1. Nhà nước, Nhà nước Cộng hòa Xã hội Chủ nghĩa Việt Nam",
                        "2.2. Quản lý hành chính nhà nước và công vụ, công chức",
                        "2.3. Quản lý nhà nước trong lĩnh vực giáo dục (Vị trí, vai trò, nguyên tắc, nội dung, bộ máy, phân cấp)",
                        "2.4. Luật Giáo dục 2019 (Lý do ban hành, cấu trúc, nội dung cơ bản)",
                        "2.5. Điều lệ, quy chế, quy định đối với giáo dục trung học"
                    ],
                    discussion: "Phân tích nguyên tắc phân cấp quản lý giáo dục từ trung ương đến địa phương"
                },
                {
                    title: "3. Hệ thống giáo dục quốc dân Việt Nam",
                    items: [
                        "3.1. Căn cứ xây dựng và khung hệ thống giáo dục quốc dân Việt Nam",
                        "3.2. Tính chất, nguyên lý và mục tiêu giáo dục Việt Nam; xu hướng phát triển",
                        "3.3. Nội dung và giải pháp thực hiện đổi mới căn bản và toàn diện giáo dục",
                        "3.4. Giai đoạn giáo dục cơ bản và giai đoạn giáo dục định hướng nghề nghiệp"
                    ],
                    discussion: "Phân luồng học sinh sau THCS và định hướng nghề nghiệp ở bậc THPT"
                },
                {
                    title: "4. Quản lý giáo dục trong trường trung học",
                    items: [
                        "4.1. Cơ cấu tổ chức nhà trường trung học",
                        "4.2. Nguyên tắc quản lý nhà trường",
                        "4.3. Nội dung quản lý nhà trường trong bối cảnh đổi mới giáo dục",
                        "4.4. Phương thức quản lý nhà trường",
                        "4.5. Nhiệm vụ, quyền hạn của giáo viên và các chức danh trong bộ máy quản lý",
                        "4.6. Ứng dụng công nghệ thông tin trong dạy học và quản lý trường trung học"
                    ],
                    discussion: "Phân tích chức năng của Tổ chuyên môn và quyền hạn xử lý kỷ luật học sinh"
                }
            ],
            learningStages: [
                {
                    stageName: "PHẦN 1: BỒI DƯỠNG TRỰC TUYẾN (30 tiết)",
                    activities: [
                        {
                            id: "act_a05_1",
                            code: "Hoạt động 1",
                            name: "Tìm hiểu giáo dục trong xã hội hiện đại",
                            mode: "online",
                            target: "Trình bày đặc điểm kinh tế tri thức, xu thế giáo dục thế giới và chiến lược GD Việt Nam.",
                            tasks: "Đọc tài liệu Nội dung 1, xem Infographic, tóm tắt ý chính và làm trắc nghiệm.",
                            materials: "Tài liệu đọc Nội dung 1, Infographic",
                            assessment: "Trả lời câu hỏi trắc nghiệm trên hệ thống"
                        },
                        {
                            id: "act_a05_2",
                            code: "Hoạt động 2",
                            name: "Tìm hiểu quản lý hành chính nhà nước & QLNN về giáo dục",
                            mode: "online",
                            target: "Trình bày các vấn đề cơ bản về Nhà nước, công vụ, nội dung Luật Giáo dục 2019 và Điều lệ trường học.",
                            tasks: "Đọc tài liệu Nội dung 2, xem Infographic, trả lời câu hỏi tự luận và trắc nghiệm.",
                            materials: "Tài liệu đọc Nội dung 2, Luật Giáo dục 2019",
                            assessment: "Trả lời câu hỏi trắc nghiệm trên hệ thống"
                        },
                        {
                            id: "act_a05_3",
                            code: "Hoạt động 3",
                            name: "Tìm hiểu hệ thống giáo dục quốc dân Việt Nam",
                            mode: "online",
                            target: "Trình bày khung hệ thống GD quốc dân, mục tiêu, nguyên lý và giải pháp đổi mới căn bản toàn diện.",
                            tasks: "Đọc tài liệu Nội dung 3, xem Infographic, nghiên cứu sơ đồ khung hệ thống GD quốc dân.",
                            materials: "Tài liệu đọc Nội dung 3, Quyết định 711/QĐ-TTg",
                            assessment: "Trả lời câu hỏi trắc nghiệm trên hệ thống"
                        },
                        {
                            id: "act_a05_4",
                            code: "Hoạt động 4",
                            name: "Tìm hiểu quản lý giáo dục trong trường trung học",
                            mode: "online",
                            target: "Trình bày cơ cấu tổ chức trường trung học, nguyên tắc quản lý, nhiệm vụ quyền hạn giáo viên và ứng dụng CNTT.",
                            tasks: "Đọc tài liệu Nội dung 4, xem Infographic, trả lời câu hỏi tình huống nhiệm vụ GV.",
                            materials: "Tài liệu đọc Nội dung 4, Thông tư 32/2020",
                            assessment: "Trả lời 50 câu hỏi trắc nghiệm tổng hợp trực tuyến"
                        }
                    ]
                },
                {
                    stageName: "PHẦN 2: BỒI DƯỠNG TRỰC TIẾP (10 tiết)",
                    activities: [
                        {
                            id: "act_a05_p1",
                            code: "Hoạt động 1",
                            name: "Hệ thống hóa kiến thức quản lý giáo dục",
                            mode: "in_person",
                            target: "Hệ thống hóa 8 nội dung cốt lõi của quản lý nhà nước về giáo dục.",
                            tasks: "Làm việc theo 8 nhóm học tập hoàn thành Phiếu học tập số 01; trình bày trên giấy A0 hoặc PowerPoint; báo cáo và thảo luận toàn lớp.",
                            materials: "Giấy A0, bút dạ, Phiếu học tập số 01",
                            assessment: "Bảng tóm tắt nội dung và bài báo cáo của nhóm"
                        },
                        {
                            id: "act_a05_p2",
                            code: "Hoạt động 2",
                            name: "Thực hành giải quyết tình huống pháp lý & nhiệm vụ GV",
                            mode: "in_person",
                            target: "Phân tích cơ cấu tổ chức trường học; liên hệ quyền hạn và nhiệm vụ thực tế của giáo viên.",
                            tasks: "Làm việc nhóm theo Phiếu học tập số 02; phân tích ví dụ minh họa về các tình huống pháp lý trong trường học; báo cáo và nghe GV tổng kết.",
                            materials: "Tình huống pháp lý học đường, Phiếu học tập số 02",
                            assessment: "Bảng tóm tắt nội dung + ví dụ minh họa và bài báo cáo nhóm"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Hoàn thành bài kiểm tra 50 câu hỏi trắc nghiệm khách quan trên hệ thống"
                ],
                inPerson: [
                    "Bảng tóm tắt nội dung của nhóm trên giấy A0 hoặc slide thuyết trình"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm bài tập trắc nghiệm trên hệ thống (50 câu)", weight: 50, condition: "Đạt từ 5.0 điểm trở lên đối với bài trắc nghiệm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Bài kiểm tra tự luận",
                    weight: 50,
                    condition: "Đạt từ 5.0 điểm trở lên. Điều kiện dự thi: Tham gia trên 80% số tiết trên lớp và hoàn thành bài điều kiện."
                },
                scale: "Điểm từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Học viên cần đọc kỹ Luật Giáo dục 2019 và Điều lệ trường phổ thông."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Bộ Giáo dục và Đào tạo, Thông tư số 32/2020/TT-BGDĐT ngày 15/9/2020 về Điều lệ trường THCS, THPT và trường PT có nhiều cấp học.",
                "[2] Thủ tướng Chính phủ, Quyết định số 711/QĐ-TTg ngày 13/6/2012 ban hành Chiến lược phát triển giáo dục Việt Nam 2011-2020.",
                "[3] Chính phủ, Nghị định số 127/2018/NĐ-CP ngày 21/9/2018 quy định trách nhiệm quản lý nhà nước về giáo dục.",
                "[4] Quốc hội, Luật Giáo dục số 43/2019/QH14 ngày 14/6/2019.",
                "[5] Cơ sở đào tạo biên soạn, Tài liệu về Chuyên đề: Quản lý nhà nước về giáo dục."
            ]
        },
        grades: { attendance: 9.0, midterm: 9.0, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 6. MÃ HỌC PHẦN: A1 - TÂM LÝ HỌC GIÁO DỤC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a1",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A1",
        name: "Tâm lý học giáo dục",
        credits: 2,
        category: "mandatoryA",
        knowledgeBlock: "mandatoryA",
        semester: "1",
        type: "mandatory",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Không",
        instructor: "TS. Lê Thị Hân",
        instructorEmail: "hanlt@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "2021",
            authorTeam: [
                "PGS. TS. Trần Thị Thu Mai (Chủ biên)",
                "TS. Nguyễn Thị Bích Hồng",
                "TS. Lê Thị Hân",
                "ThS. Hoàng Thị Ân"
            ],
            approver: "Trưởng Khoa Tâm lý học - Trường ĐH Sư phạm TP.HCM",
            instructor: "TS. Lê Thị Hân",
            instructorEmail: "hanlt@lecturer.hcmue.edu.vn",
            prerequisites: "Không",
            hoursBreakdown: {
                total: 45,
                theory: 15,
                practice: 30,
                inPerson: 20,
                online: 25
            },
            description: "Học phần trang bị cho học viên hệ thống tri thức khoa học về các quy luật tâm lý của hoạt động dạy học và giáo dục; đặc điểm tâm lý học sinh lứa tuổi THCS và THPT; tâm lý học nhân cách và các liệu pháp tư vấn, hỗ trợ tâm lý học đường.",
            objectives: [
                { code: "1", text: "Phân tích được các quy luật tâm lý chi phối quá trình tiếp thu tri thức, hình thành kỹ năng và thái độ của học sinh." },
                { code: "2", text: "Nhận diện và lý giải được đặc điểm phát triển thể chất, nhận thức, cảm xúc và giao tiếp của học sinh THCS, THPT." },
                { code: "3", text: "Vận dụng các lý thuyết học tập và tâm lý học lứa tuổi để kích thích động cơ học tập nội tại và xây dựng môi trường học đường tích cực." },
                { code: "4", text: "Thực hành tư vấn, hỗ trợ tâm lý học sinh gặp khó khăn trong học tập, quan hệ bạn bè hoặc khủng hoảng tâm lý tuổi dậy thì." }
            ],
            clos: [
                "Phân tích các cơ chế tâm lý của sự hình thành khái niệm khoa học và năng lực nhận thức ở học sinh.",
                "Nhận diện sớm các dấu hiệu bất ổn tâm lý học đường: áp lực học tập, lo âu, xung đột đồng trang lứa và hành vi lệch chuẩn.",
                "Thiết kế các biện pháp sư phạm nhằm phát huy động cơ học tập tự thân và hình thành phẩm chất nhân cách tốt đẹp cho học sinh.",
                "Xây dựng quy trình tiếp nhận, lắng nghe và lập kế hoạch hỗ trợ tâm lý cá nhân học sinh đạt hiệu quả mô phạm."
            ],
            contentOutline: [
                {
                    title: "Chương 1: Những vấn đề chung của Tâm lý học giáo dục",
                    items: [
                        "1.1. Bản chất hiện tượng tâm lý người và cơ sở sinh lý của hoạt động tâm lý",
                        "1.2. Các quy luật tâm lý cơ bản trong hoạt động dạy học và giáo dục",
                        "1.3. Phương pháp nghiên cứu tâm lý học sinh: quan sát, đàm thoại, trắc nghiệm, phân tích sản phẩm hoạt động"
                    ],
                    discussion: "Tác động của mạng xã hội và công nghệ số đến sự hình thành tâm lý thế hệ Gen Z và Gen Alpha."
                },
                {
                    title: "Chương 2: Đặc điểm tâm lý học sinh lứa tuổi phổ thông (THCS & THPT)",
                    items: [
                        "2.1. Khủng hoảng tâm lý tuổi dậy thì và sự biến đổi mạnh mẽ về thể chất, hệ thần kinh",
                        "2.2. Sự phát triển tư duy trừu tượng, tính độc lập và nhu cầu tự khẳng định bản thân",
                        "2.3. Hoạt động giao tiếp với bạn bè, nhóm xã hội và tình cảm lãng mạn học trò",
                        "2.4. Sự hình thành lý tưởng sống, định hướng giá trị và xu hướng nghề nghiệp ở học sinh THPT"
                    ],
                    discussion: "Phân tích tình huống học sinh bị cô lập trong tập thể lớp và biện pháp hỗ trợ hòa nhập của giáo viên."
                },
                {
                    title: "Chương 3: Tâm lý học dạy học và giáo dục nhân cách",
                    items: [
                        "3.1. Bản chất tâm lý của hoạt động học tập và sự hình thành khái niệm khoa học",
                        "3.2. Các lý thuyết học tập hiện đại: Thuyết hành vi, Thuyết nhận thức, Thuyết kiến tạo xã hội của Vygotsky",
                        "3.3. Động cơ học tập: cơ chế hình thành, chuyển hóa động cơ bên ngoài thành động cơ bên trong",
                        "3.4. Cơ sở tâm lý của việc hình thành niềm tin, tình cảm và thói quen đạo đức cho học sinh"
                    ],
                    discussion: "Thực hành thiết kế các chiến lược kích thích hứng thú học tập nội tại cho môn học chuyên môn."
                },
                {
                    title: "Chương 4: Tư vấn và hỗ trợ tâm lý học đường",
                    items: [
                        "4.1. Khái quát về tư vấn tâm lý học đường: mục đích, nguyên tắc đạo đức và quy trình tham vấn",
                        "4.2. Kỹ năng lắng nghe thấu cảm, đặt câu hỏi gợi mở và phản hồi tích cực trong tham vấn 1-1",
                        "4.3. Nhận diện và sơ cứu tâm lý ban đầu cho học sinh khủng hoảng (lo âu thi cử, bạo lực học đường, áp lực gia đình)",
                        "4.4. Phối hợp giữa giáo viên bộ môn, giáo viên chủ nhiệm, chuyên gia tâm lý và cha mẹ học sinh"
                    ],
                    discussion: "Đóng vai giải quyết tình huống tham vấn học sinh có biểu hiện trầm cảm hoặc áp lực điểm số nặng nề."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (25 tiết)",
                    activities: [
                        {
                            id: "act_a1_1",
                            code: "Hoạt động 1",
                            name: "Tìm hiểu bản chất hiện tượng tâm lý và các quy luật nhận thức",
                            mode: "online",
                            target: "Hệ thống hóa các khái niệm nền tảng về tâm lý người và cơ chế phản ánh tâm lý.",
                            tasks: "Đọc tài liệu Chương 1 trên hệ thống LMS, xem video bài giảng tương tác và ghi chép tóm tắt theo sơ đồ tư duy.",
                            materials: "Tài liệu đọc Chương 1, video bài giảng LMS",
                            assessment: "Điểm tham gia học trực tuyến và nộp sơ đồ tư duy"
                        },
                        {
                            id: "act_a1_2",
                            code: "Hoạt động 2",
                            name: "Nghiên cứu đặc điểm tâm lý lứa tuổi học sinh THCS và THPT",
                            mode: "online",
                            target: "Nhận diện sự phát triển nhận thức, cảm xúc và giao tiếp của học sinh lứa tuổi dậy thì và đầu thanh niên.",
                            tasks: "Phân tích bảng so sánh đặc điểm tâm lý THCS vs THPT; trả lời câu hỏi tự kiểm tra trên LMS.",
                            materials: "Infographic tâm lý học lứa tuổi, bảng đối sánh",
                            assessment: "Kết quả bài tự kiểm tra trên LMS (đạt từ 80% trở lên)"
                        },
                        {
                            id: "act_a1_3",
                            code: "Hoạt động 3",
                            name: "Khám phá các lý thuyết học tập: Thuyết hành vi, Thuyết nhận thức, Thuyết kiến tạo",
                            mode: "online",
                            target: "Làm chủ cơ sở tâm lý của thuyết kiến tạo (Piaget, Vygotsky) trong dạy học phát triển năng lực.",
                            tasks: "Đọc chuyên đề các lý thuyết học tập; thảo luận trên diễn đàn về 'Vùng phát triển gần nhất' (ZPD) của Vygotsky.",
                            materials: "Tài liệu chuyên đề Lý thuyết học tập hiện đại",
                            assessment: "Đánh giá mức độ tham gia thảo luận chất lượng trên diễn đàn"
                        },
                        {
                            id: "act_a1_4",
                            code: "Hoạt động 4",
                            name: "Phân tích cơ chế hình thành động cơ học tập và hứng thú nhận thức",
                            mode: "online",
                            target: "Xác định các yếu tố kích thích động cơ học tập nội tại của học sinh.",
                            tasks: "Đọc tài liệu Chương 3; đề xuất 3 biện pháp kích thích hứng thú học tập đối với một chủ đề môn học cụ thể.",
                            materials: "Tài liệu đọc Chương 3, mẫu phiếu biện pháp sư phạm",
                            assessment: "Phiếu đề xuất biện pháp kích thích động cơ học tập"
                        },
                        {
                            id: "act_a1_5",
                            code: "Hoạt động 5",
                            name: "Kiểm tra trắc nghiệm kiến thức Tâm lý học giáo dục trên hệ thống LMS",
                            mode: "online",
                            target: "Đánh giá tổng quát kiến thức nền tảng của giai đoạn bồi dưỡng trực tuyến.",
                            tasks: "Thực hiện bài kiểm tra trắc nghiệm 20 câu hỏi khách quan trong thời gian 30 phút trên hệ thống LMS.",
                            materials: "Ngân hàng đề thi trắc nghiệm LMS",
                            assessment: "Điểm trắc nghiệm LMS (Trọng số 20% điểm quá trình)"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (20 tiết)",
                    activities: [
                        {
                            id: "act_a1_6",
                            code: "Hoạt động 6",
                            name: "Phân tích ca tâm lý học đường điển hình (Case Study Analysis)",
                            mode: "in_person",
                            target: "Vận dụng kiến thức tâm lý lứa tuổi để chẩn đoán nguyên nhân khó khăn tâm lý của học sinh.",
                            tasks: "Làm việc nhóm phân tích 01 hồ sơ ca học sinh cá biệt (nghiện game, chống đối thầy cô hoặc thu mình thụ động).",
                            materials: "Hồ sơ các ca tâm lý học đường mẫu",
                            assessment: "Bản phân tích ca tâm lý và biên bản làm việc nhóm"
                        },
                        {
                            id: "act_a1_7",
                            code: "Hoạt động 7",
                            name: "Thực hành kỹ năng tham vấn và xử lý khủng hoảng tâm lý học sinh (Role-playing)",
                            mode: "in_person",
                            target: "Thành thạo kỹ năng tiếp xúc ban đầu, lắng nghe thấu cảm và đặt câu hỏi gợi mở trong tham vấn 1-1.",
                            tasks: "Đóng vai: Học viên đóng vai Giáo viên tham vấn và Học sinh gặp khó khăn tâm lý; các thành viên quan sát nhận xét.",
                            materials: "Kịch bản đóng vai tham vấn, bảng tiêu chí quan sát",
                            assessment: "Đánh giá kỹ năng giao tiếp tham vấn qua bảng kiểm quan sát"
                        },
                        {
                            id: "act_a1_8",
                            code: "Hoạt động 8",
                            name: "Thiết kế kế hoạch can thiệp và hỗ trợ tâm lý cá nhân học sinh",
                            mode: "in_person",
                            target: "Xây dựng được bản kế hoạch hỗ trợ tâm lý cụ thể theo từng giai đoạn can thiệp.",
                            tasks: "Lập kế hoạch hành động: xác định mục tiêu hỗ trợ, các biện pháp phối hợp gia đình và thang đo tiến bộ.",
                            materials: "Biểu mẫu Kế hoạch hỗ trợ tâm lý cá nhân học sinh",
                            assessment: "Sản phẩm Kế hoạch hỗ trợ tâm lý (Trọng số 20% điểm quá trình)"
                        },
                        {
                            id: "act_a1_9",
                            code: "Hoạt động 9",
                            name: "Báo cáo chuyên đề nhóm và phản biện biện pháp hỗ trợ tâm lý",
                            mode: "in_person",
                            target: "Bảo vệ phương án hỗ trợ tâm lý trước hội đồng lớp học và tiếp thu phản hồi chuyên môn.",
                            tasks: "Đại diện nhóm thuyết trình báo cáo ca can thiệp; phản biện và trả lời câu hỏi của giảng viên và các nhóm khác.",
                            materials: "Slide báo cáo thuyết trình",
                            assessment: "Đánh giá bài thuyết trình và chất lượng phản biện nhóm (10% điểm quá trình)"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 3: PHẢN HỒI VÀ ĐÁNH GIÁ TỔNG KẾT",
                    activities: [
                        {
                            id: "act_a1_10",
                            code: "Hoạt động 10",
                            name: "Hoàn thiện Hồ sơ nghiên cứu trường hợp (Case Study) và nộp bài cuối khóa",
                            mode: "online",
                            target: "Tổng hợp toàn bộ quá trình nghiên cứu và giải pháp hỗ trợ tâm lý thành hồ sơ khoa học hoàn chỉnh.",
                            tasks: "Chỉnh sửa hồ sơ ca can thiệp theo góp ý của giảng viên và nộp sản phẩm tổng kết lên hệ thống LMS.",
                            materials: "Hồ sơ nghiên cứu trường hợp hoàn thiện",
                            assessment: "Đánh giá kết thúc học phần (Trọng số 50% điểm cuối kỳ)"
                        },
                        {
                            id: "act_a1_11",
                            code: "Hoạt động 11",
                            name: "Khảo sát phản hồi về chất lượng bồi dưỡng học phần",
                            mode: "online",
                            target: "Cung cấp ý kiến đóng góp nâng cao chất lượng chương trình và phương pháp bồi dưỡng.",
                            tasks: "Hoàn thành phiếu khảo sát đánh giá khóa học trực tuyến trên hệ thống LMS.",
                            materials: "Phiếu khảo sát chất lượng khóa học",
                            assessment: "Ghi nhận hoàn thành khảo sát phản hồi"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Kết quả bài kiểm tra trắc nghiệm kiến thức trên LMS (Hoạt động 5)",
                    "Sơ đồ tư duy các quy luật tâm lý và các giai đoạn phát triển lứa tuổi (Hoạt động 1)",
                    "Hồ sơ nghiên cứu trường hợp (Case Study) can thiệp tâm lý hoàn thiện (Hoạt động 10)"
                ],
                inPerson: [
                    "Bản phân tích ca tâm lý học đường thực tế của nhóm (Hoạt động 6)",
                    "Biên bản đánh giá thực hành đóng vai tham vấn tâm lý 1-1 (Hoạt động 7)",
                    "Bản Kế hoạch can thiệp và hỗ trợ tâm lý cá nhân học sinh (Hoạt động 8)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Hoạt động 5: Bài kiểm tra trắc nghiệm kiến thức trên hệ thống LMS", weight: 20, condition: "Đạt từ 5.0 trở lên" },
                    { name: "Hoạt động 8: Kế hoạch can thiệp và hỗ trợ tâm lý cá nhân học sinh", weight: 20, condition: "Đạt từ 5.0 trở lên" },
                    { name: "Hoạt động 9: Thuyết trình báo cáo chuyên đề và ý thức chuyên cần", weight: 10, condition: "Tham gia > 80% số tiết trực tiếp" }
                ],
                summative: {
                    name: "Hoạt động 10: Hồ sơ nghiên cứu trường hợp (Case Study) và thi tự luận phân tích tình huống tâm lý sư phạm",
                    weight: 50,
                    condition: "Đạt từ 5.0 trở lên. Điều kiện: Đạt đầy đủ các bài tập quá trình và tham gia trên 80% thời lượng."
                },
                scale: "Thang điểm 0 - 10, làm tròn đến một chữ số thập phân.",
                notes: "Học viên nộp đầy đủ bài tập và hồ sơ trên hệ thống LMS đúng thời hạn quy định."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Huỳnh Văn Sơn (chủ biên) (2018). Tâm lý học lứa tuổi và tâm lý học sư phạm. NXB Đại học Sư phạm TP.HCM.",
                "[2] Trần Thị Thu Mai (2019). Giáo trình Tâm lý học giáo dục. NXB Đại học Sư phạm TP.HCM.",
                "[3] Anita Woolfolk (2016). Educational Psychology (Tâm lý học giáo dục), Bản dịch tiếng Việt. NXB Tri Thức.",
                "[4] Nguyễn Thị Bích Hồng (2017). Tư vấn tâm lý học đường trong trường phổ thông. NXB Đại học Sư phạm TP.HCM.",
                "[5] Robert J. Sternberg, Wendy M. Williams (2010). Educational Psychology. Pearson Education Inc."
            ]
        },
        grades: { attendance: 9.5, midterm: 9.0, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 7. MÃ HỌC PHẦN: A2 - GIÁO DỤC HỌC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a2",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A2",
        name: "Giáo dục học",
        credits: 3,
        category: "mandatoryA",
        knowledgeBlock: "mandatoryA",
        semester: "1",
        type: "mandatory",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Không",
        instructor: "ThS. Bùi Thị Ngọc Linh",
        instructorEmail: "linhbtn@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "2021",
            authorTeam: [
                "TS. Nguyễn Thị Bích Hồng (Chủ biên)",
                "PGS. TS. Nguyễn Kim Hồng",
                "TS. Mai Thu Trang",
                "ThS. Bùi Thị Ngọc Linh"
            ],
            approver: "Trưởng Khoa Khoa học Giáo dục - Trường ĐH Sư phạm TP.HCM",
            instructor: "ThS. Bùi Thị Ngọc Linh",
            instructorEmail: "linhbtn@lecturer.hcmue.edu.vn",
            prerequisites: "Không",
            hoursBreakdown: {
                total: 70,
                theory: 25,
                practice: 45,
                inPerson: 30,
                online: 40
            },
            description: "Học phần trang bị hệ thống tri thức lý luận giáo dục học hiện đại; bản chất, quy luật và nguyên tắc của quá trình giáo dục đạo đức, nhân cách; phương pháp giáo dục kỷ luật tích cực; công tác giáo viên chủ nhiệm và phối hợp các lực lượng giáo dục trong và ngoài nhà trường.",
            objectives: [
                { code: "1", text: "Phân tích được vai trò của giáo dục đối với sự phát triển cá nhân và tiến bộ xã hội trong bối cảnh đổi mới GDPT 2018." },
                { code: "2", text: "Nắm vững mục tiêu, nhiệm vụ, bản chất và hệ thống các nguyên tắc giáo dục nhân cách học sinh phổ thông." },
                { code: "3", text: "Vận dụng thành thạo các phương pháp giáo dục kỷ luật tích cực, phương pháp nêu gương, khen thưởng và thuyết phục." },
                { code: "4", text: "Thiết kế kế hoạch công tác chủ nhiệm lớp toàn diện cho năm học và kịch bản tổ chức Hoạt động trải nghiệm, hướng nghiệp." }
            ],
            clos: [
                "Làm chủ hệ thống khái niệm, quy luật và nguyên tắc giáo dục học sinh theo định hướng phát triển phẩm chất.",
                "Thiết kế kế hoạch công tác chủ nhiệm lớp chuẩn mực (kế hoạch tuần, tháng, học kỳ, năm học) phù hợp với thực tiễn nhà trường.",
                "Vận dụng linh hoạt các biện pháp kỷ luật tích cực thay thế trừng phạt thân thể và xúc phạm nhân phẩm.",
                "Xây dựng mạng lưới phối hợp hiệu quả giữa Ban Giám hiệu, Đoàn - Đội, Giáo viên bộ môn, Ban đại diện Cha mẹ học sinh và cộng đồng."
            ],
            contentOutline: [
                {
                    title: "Chương 1: Giáo dục học là một khoa học về giáo dục con người",
                    items: [
                        "1.1. Đối tượng, nhiệm vụ, phương pháp nghiên cứu của Giáo dục học hiện đại",
                        "1.2. Giáo dục và sự phát triển cá nhân (vai trò di truyền, môi trường, giáo dục và hoạt động cá nhân)",
                        "1.3. Mục tiêu, tính chất và nguyên lý giáo dục Việt Nam theo Luật Giáo dục 2019 và CT GDPT 2018"
                    ],
                    discussion: "Vai trò chủ đạo của giáo dục nhà trường trước làn sóng thông tin đa chiều trên không gian mạng."
                },
                {
                    title: "Chương 2: Quá trình giáo dục đạo đức và nhân cách",
                    items: [
                        "2.1. Bản chất, đặc điểm và cấu trúc của quá trình giáo dục nhân cách học sinh phổ thông",
                        "2.2. Hệ thống các nguyên tắc giáo dục học sinh: đảm bảo tính mục đích, gắn với đời sống, phát huy tập thể, tôn trọng nhân cách",
                        "2.3. Hệ thống phương pháp giáo dục: nhóm phương pháp giáo dục ý thức, nhóm tổ chức hoạt động, nhóm kích thích hành vi"
                    ],
                    discussion: "Phân tích tình huống học sinh vi phạm nội quy và áp dụng nguyên tắc tôn trọng nhân cách kết hợp yêu cầu hợp lý."
                },
                {
                    title: "Chương 3: Kỷ luật tích cực trong nhà trường phổ thông",
                    items: [
                        "3.1. Bản chất của kỷ luật tích cực và sự khác biệt căn bản với kỷ luật trừng phạt",
                        "3.2. Hậu quả tiêu cực của trừng phạt thể xác và tinh thần đối với sự phát triển nhân cách học sinh",
                        "3.3. Các kỹ thuật kỷ luật tích cực: Hệ quả tự nhiên và logic, thỏa thuận quy tắc lớp học, khen ngợi hành vi nỗ lực, thời gian tạm lắng tích cực"
                    ],
                    discussion: "Xây dựng Bộ quy tắc ứng xử văn hóa trong lớp học do học sinh tự thảo luận và cam kết thực hiện."
                },
                {
                    title: "Chương 4: Công tác giáo viên chủ nhiệm và Hoạt động trải nghiệm, hướng nghiệp",
                    items: [
                        "4.1. Vị trí, vai trò và chức năng nhiệm vụ của Giáo viên chủ nhiệm lớp ở trường phổ thông",
                        "4.2. Quy trình lập kế hoạch chủ nhiệm: kế hoạch năm học, kế hoạch học kỳ, kế hoạch tháng và tuần",
                        "4.3. Phương pháp xây dựng tập thể lớp tự quản vững mạnh và bầu chọn ban cán sự lớp",
                        "4.4. Kịch bản tổ chức Tiết sinh hoạt lớp và Hoạt động trải nghiệm, hướng nghiệp theo Chương trình GDPT 2018",
                        "4.5. Phối hợp giữa Nhà trường - Gia đình (Ban đại diện CMHS) - Xã hội trong giáo dục học sinh"
                    ],
                    discussion: "Thực hành thiết kế một buổi họp phụ huynh đầu năm học theo hướng đổi mới, tương tác tích cực."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (40 tiết)",
                    activities: [
                        {
                            id: "act_a2_1",
                            code: "Hoạt động 1",
                            name: "Khám phá đối tượng, nhiệm vụ và các khái niệm nền tảng của Giáo dục học",
                            mode: "online",
                            target: "Hệ thống hóa bản chất khoa học giáo dục và nguyên lý giáo dục Việt Nam.",
                            tasks: "Đọc tài liệu Chương 1 trên LMS; hoàn thành sơ đồ khái niệm về mối quan hệ giữa di truyền, môi trường và giáo dục.",
                            materials: "Tài liệu đọc Chương 1, video bài giảng LMS",
                            assessment: "Sơ đồ khái niệm và mức độ hoàn thành bài đọc"
                        },
                        {
                            id: "act_a2_2",
                            code: "Hoạt động 2",
                            name: "Nghiên cứu vai trò của giáo dục đối với sự phát triển nhân cách trong kỷ nguyên số",
                            mode: "online",
                            target: "Phân tích yêu cầu phát triển 5 phẩm chất và 10 năng lực cốt lõi theo CT GDPT 2018.",
                            tasks: "Xem video phân tích Chương trình GDPT 2018; tham gia thảo luận diễn đàn về thách thức giáo dục thời đại 4.0.",
                            materials: "Video chuyên đề GDPT 2018, tài liệu Thông tư 32/2018",
                            assessment: "Đánh giá bài viết thảo luận trên diễn đàn lớp học"
                        },
                        {
                            id: "act_a2_3",
                            code: "Hoạt động 3",
                            name: "Hệ thống hóa các nguyên tắc giáo dục nhân cách học sinh phổ thông",
                            mode: "online",
                            target: "Làm chủ 6 nguyên tắc giáo dục cơ bản và liên hệ thực tế dạy học.",
                            tasks: "Đọc tài liệu Chương 2; giải quyết 3 tình huống trắc nghiệm tình huống về vi phạm nguyên tắc giáo dục.",
                            materials: "Tài liệu Chương 2, bài tập tình huống",
                            assessment: "Kết quả bài tập trắc nghiệm tình huống"
                        },
                        {
                            id: "act_a2_4",
                            code: "Hoạt động 4",
                            name: "Tìm hiểu các phương pháp giáo dục kỷ luật tích cực thay thế trừng phạt",
                            mode: "online",
                            target: "Nhận thức sâu sắc tác hại của bạo lực học đường và thành thạo các kỹ thuật kỷ luật tích cực.",
                            tasks: "Đọc Cẩm nang Kỷ luật tích cực của Bộ GD&ĐT; lập bảng so sánh Kỷ luật trừng phạt vs Kỷ luật tích cực.",
                            materials: "Cẩm nang Kỷ luật tích cực, tài liệu UNICEF",
                            assessment: "Bảng đối sánh phương pháp kỷ luật nộp trên LMS"
                        },
                        {
                            id: "act_a2_5",
                            code: "Hoạt động 5",
                            name: "Nghiên cứu chức năng, nhiệm vụ và quyền hạn của Giáo viên chủ nhiệm lớp",
                            mode: "online",
                            target: "Nắm vững quy định về công tác chủ nhiệm theo Điều lệ trường phổ thông (Thông tư 32/2020).",
                            tasks: "Nghiên cứu Điều lệ trường trung học; tóm tắt 5 nhiệm vụ trọng tâm và 3 quyền hạn của GV chủ nhiệm.",
                            materials: "Thông tư số 32/2020/TT-BGDĐT",
                            assessment: "Bài tập trắc nghiệm ngắn về Điều lệ trường trung học"
                        },
                        {
                            id: "act_a2_6",
                            code: "Hoạt động 6",
                            name: "Kiểm tra trắc nghiệm lý luận giáo dục trên hệ thống LMS (20 câu trắc nghiệm)",
                            mode: "online",
                            target: "Đánh giá tổng hợp kiến thức lý luận giáo dục của giai đoạn học tập trực tuyến.",
                            tasks: "Làm bài kiểm tra trắc nghiệm 20 câu hỏi khách quan trên hệ thống LMS trong 35 phút.",
                            materials: "Ngân hàng đề thi trắc nghiệm LMS",
                            assessment: "Điểm trắc nghiệm LMS (Trọng số 20% điểm quá trình)"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (30 tiết)",
                    activities: [
                        {
                            id: "act_a2_7",
                            code: "Hoạt động 7",
                            name: "Thực hành thiết kế Kế hoạch công tác chủ nhiệm lớp cho một năm học (hoặc học kỳ)",
                            mode: "in_person",
                            target: "Thiết kế kế hoạch chủ nhiệm đầy đủ các mục tiêu, biện pháp và tiến trình thời gian.",
                            tasks: "Làm việc nhóm xây dựng khung kế hoạch chủ nhiệm cho một lớp học giả định (đặc điểm học sinh, ban đại diện CMHS, phong trào thi đua).",
                            materials: "Mẫu kế hoạch công tác chủ nhiệm chuẩn của Bộ GD&ĐT",
                            assessment: "Bản thảo kế hoạch chủ nhiệm nhóm và góp ý tại lớp"
                        },
                        {
                            id: "act_a2_8",
                            code: "Hoạt động 8",
                            name: "Thiết kế kịch bản và thực hành tổ chức Tiết sinh hoạt lớp theo chủ đề phát triển phẩm chất",
                            mode: "in_person",
                            target: "Đổi mới tiết sinh hoạt lớp từ kiểm điểm phê bình sang hoạt động giáo dục truyền cảm hứng.",
                            tasks: "Soạn kịch bản chi tiết cho 1 tiết sinh hoạt lớp 45 phút (ví dụ: Chủ đề 'Lòng biết ơn', 'Văn hóa ứng xử mạng xã hội'); đóng vai tổ chức một hoạt động 15 phút.",
                            materials: "Mẫu giáo án Hoạt động trải nghiệm, hướng nghiệp",
                            assessment: "Kịch bản tiết sinh hoạt lớp (Trọng số 20% điểm quá trình)"
                        },
                        {
                            id: "act_a2_9",
                            code: "Hoạt động 9",
                            name: "Xử lý các tình huống sư phạm phức tạp trong quan hệ Thầy - Trò và phối hợp Phụ huynh",
                            mode: "in_person",
                            target: "Rèn luyện sự bình tĩnh, khéo léo và chuẩn mực đạo đức sư phạm khi giải quyết mâu thuẫn.",
                            tasks: "Mỗi nhóm bốc thăm 01 tình huống thực tế (học sinh đánh nhau, trốn học nhiều buổi, phụ huynh phản ứng gay gắt với giáo viên) và trình bày phương án giải quyết.",
                            materials: "Bộ thẻ 20 tình huống sư phạm thực tiễn",
                            assessment: "Đánh giá phương án giải quyết tình huống sư phạm"
                        },
                        {
                            id: "act_a2_10",
                            code: "Hoạt động 10",
                            name: "Xây dựng Bộ quy tắc ứng xử văn hóa lớp học và biện pháp xây dựng tập thể lớp tự quản",
                            mode: "in_person",
                            target: "Xây dựng môi trường lớp học dân chủ, thân thiện và nâng cao tính tự giác của học sinh.",
                            tasks: "Thực hành thiết kế cây quy tắc lớp học; xây dựng cơ chế khen thưởng tích cực và phân công ban cán sự lớp.",
                            materials: "Giấy A0, bút màu, mẫu cây quy tắc lớp học",
                            assessment: "Sản phẩm Bộ quy tắc ứng xử văn hóa lớp học"
                        },
                        {
                            id: "act_a2_11",
                            code: "Hoạt động 11",
                            name: "Thuyết trình, bảo vệ kế hoạch chủ nhiệm và đánh giá chéo giữa các nhóm học viên",
                            mode: "in_person",
                            target: "Bảo vệ các giải pháp chủ nhiệm trước tập thể và rèn luyện kỹ năng phản biện mang tính xây dựng.",
                            tasks: "Báo cáo sản phẩm kế hoạch chủ nhiệm trước lớp; các nhóm khác sử dụng phiếu rubric để nhận xét đánh giá chéo.",
                            materials: "Phiếu đánh giá Rubric kế hoạch chủ nhiệm",
                            assessment: "Đánh giá thuyết trình và ý thức chuyên cần (10% điểm quá trình)"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 3: PHẢN HỒI VÀ ĐÁNH GIÁ TỔNG KẾT",
                    activities: [
                        {
                            id: "act_a2_12",
                            code: "Hoạt động 12",
                            name: "Hoàn thiện Hồ sơ kế hoạch công tác chủ nhiệm hoàn chỉnh và nộp bài cuối khóa",
                            mode: "online",
                            target: "Tổng hợp toàn bộ kế hoạch năm học, kịch bản sinh hoạt lớp và quy tắc lớp học thành hồ sơ hoàn chỉnh.",
                            tasks: "Tiếp thu nhận xét của giảng viên, hoàn thiện hồ sơ và nộp sản phẩm tổng kết lên LMS.",
                            materials: "Hồ sơ kế hoạch công tác chủ nhiệm hoàn chỉnh",
                            assessment: "Đánh giá kết thúc học phần (Trọng số 50% điểm cuối kỳ)"
                        },
                        {
                            id: "act_a2_13",
                            code: "Hoạt động 13",
                            name: "Khảo sát phản hồi về chất lượng bồi dưỡng học phần",
                            mode: "online",
                            target: "Cung cấp ý kiến đóng góp hoàn thiện chương trình học phần Giáo dục học.",
                            tasks: "Hoàn thành phiếu khảo sát chất lượng khóa học trực tuyến trên LMS.",
                            materials: "Phiếu khảo sát phản hồi trực tuyến",
                            assessment: "Ghi nhận hoàn thành khảo sát"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Kết quả bài kiểm tra trắc nghiệm lý luận giáo dục trên LMS (Hoạt động 6)",
                    "Sơ đồ khái niệm nguyên lý giáo dục và bảng đối sánh kỷ luật tích cực (Hoạt động 1 & 4)",
                    "Hồ sơ Kế hoạch công tác chủ nhiệm lớp trọn gói cho năm học (Hoạt động 12)"
                ],
                inPerson: [
                    "Bản Kịch bản chi tiết Tiết sinh hoạt lớp theo chủ đề phát triển phẩm chất (Hoạt động 8)",
                    "Biên bản giải quyết tình huống sư phạm và phối hợp cha mẹ học sinh (Hoạt động 9)",
                    "Sản phẩm poster Bộ quy tắc ứng xử văn hóa lớp học (Hoạt động 10)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Hoạt động 6: Kiểm tra trắc nghiệm lý luận giáo dục trên LMS", weight: 20, condition: "Đạt từ 5.0 trở lên" },
                    { name: "Hoạt động 8: Kịch bản tiết sinh hoạt lớp theo chủ đề", weight: 20, condition: "Đạt từ 5.0 trở lên" },
                    { name: "Hoạt động 11: Thuyết trình báo cáo kế hoạch chủ nhiệm và chuyên cần", weight: 10, condition: "Tham gia > 80% số tiết trực tiếp" }
                ],
                summative: {
                    name: "Hoạt động 12: Hồ sơ Kế hoạch công tác chủ nhiệm cả năm và thi tự luận lý luận giáo dục học",
                    weight: 50,
                    condition: "Đạt từ 5.0 trở lên. Điều kiện: Hoàn thành đầy đủ các nhiệm vụ quá trình."
                },
                scale: "Thang điểm 0 - 10, làm tròn đến một chữ số thập phân.",
                notes: "Học viên nộp hồ sơ sản phẩm lên hệ thống LMS theo định dạng PDF chuẩn."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Đặng Vũ Hoạt, Hà Thị Đức (2015). Giáo dục học đại cương. NXB Đại học Sư phạm Hà Nội.",
                "[2] Nguyễn Thị Bích Hồng, Huỳnh Văn Sơn (2018). Giáo trình Giáo dục học phổ thông. NXB Đại học Sư phạm TP.HCM.",
                "[3] Bộ Giáo dục và Đào tạo (2020). Thông tư số 32/2020/TT-BGDĐT ban hành Điều lệ trường THCS, THPT và trường phổ thông có nhiều cấp học.",
                "[4] Cục Nhà giáo và Cán bộ Quản lý Giáo dục (2019). Cẩm nang Giáo dục Kỷ luật tích cực trong nhà trường. NXB Dân Trí.",
                "[5] Trần Thị Tuyết Oanh (chủ biên) (2016). Giáo trình Giáo dục học (Tập 1 & Tập 2). NXB Đại học Sư phạm."
            ]
        },
        grades: { attendance: 9.0, midterm: 8.5, final: 8.5 }
    },

    // ---------------------------------------------------------------------
    // 8. MÃ HỌC PHẦN: A3 - LÝ LUẬN DẠY HỌC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a3",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A3",
        name: "Lý luận dạy học",
        credits: 3,
        category: "mandatoryA",
        knowledgeBlock: "mandatoryA",
        semester: "1",
        type: "mandatory",
        isSelected: true,
        status: "in_progress",
        prerequisites: "A2 Giáo dục học",
        instructor: "TS. Đặng Thị Lan",
        instructorEmail: "landt@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "2021",
            authorTeam: [
                "TS. Phan Văn Triều (Chủ biên)",
                "TS. Đặng Thị Lan",
                "ThS. Lê Thùy Trang",
                "TS. Huỳnh Công Khôi"
            ],
            approver: "Trưởng Bộ môn Lý luận dạy học - Trường ĐH Sư phạm TP.HCM",
            instructor: "TS. Đặng Thị Lan",
            instructorEmail: "landt@lecturer.hcmue.edu.vn",
            prerequisites: "A2 Giáo dục học",
            hoursBreakdown: {
                total: 70,
                theory: 20,
                practice: 50,
                inPerson: 30,
                online: 40
            },
            description: "Học phần trang bị cơ sở lý luận về bản chất quá trình dạy học, các quy luật và nguyên tắc dạy học; hệ thống các phương pháp và kỹ thuật dạy học tích cực; quy trình thiết kế và thực thi Kế hoạch bài dạy (giáo án) chuẩn Công văn 5512/BGDĐT-GDTrH; kỹ năng tổ chức và đánh giá tiết học phát triển phẩm chất, năng lực học sinh.",
            objectives: [
                { code: "1", text: "Phân tích được bản chất, cấu trúc, chức năng và các quy luật cơ bản của quá trình dạy học hiện đại." },
                { code: "2", text: "Nắm vững và vận dụng linh hoạt các phương pháp dạy học tích cực (Dạy học giải quyết vấn đề, Dạy học dự án, Bàn tay nặn bột, Dạy học khám phá)." },
                { code: "3", text: "Sử dụng thành thạo các kỹ thuật dạy học tích cực (Khăn trải bàn, Mảnh ghép, Phòng tranh, Sơ đồ tư duy, Đóng vai, Bể cá, KWL)." },
                { code: "4", text: "Thiết kế Kế hoạch bài dạy (KHBD) chuẩn Công văn 5512/BGDĐT-GDTrH gồm 4 hoạt động học tập và thực hành tập giảng vi mô (Micro-teaching)." }
            ],
            clos: [
                "Giải thích được mối quan hệ biện chứng giữa hoạt động dạy của giáo viên và hoạt động học của học sinh theo nguyên lý lấy người học làm trung tâm.",
                "Lựa chọn và phối hợp các phương pháp, kỹ thuật dạy học phù hợp với đặc trưng môn học và mục tiêu cần đạt của bài học.",
                "Thiết kế tiến trình dạy học gồm 4 hoạt động: Khởi động, Khám phá kiến thức mới, Luyện tập và Vận dụng đáp ứng các tiêu chí của Công văn 5555/BGDĐT.",
                "Thể hiện năng lực sư phạm tự tin, bao quát lớp, đặt câu hỏi gợi mở và xử lý tình huống dạy học trong tiết tập giảng vi mô."
            ],
            contentOutline: [
                {
                    title: "Chương 1: Quá trình dạy học – Bản chất, quy luật và nguyên tắc",
                    items: [
                        "1.1. Bản chất nhận thức độc đáo của học sinh trong dạy học và cấu trúc của quá trình dạy học",
                        "1.2. Mối quan hệ biện chứng giữa hoạt động dạy của giáo viên và hoạt động học của học sinh",
                        "1.3. Các quy luật dạy học cơ bản (thống nhất giữa dạy học và phát triển trí tuệ, giữa dạy học và giáo dục)",
                        "1.4. Hệ thống nguyên tắc dạy học hiện đại: tính khoa học, tính vừa sức, trực quan, phát huy tính tích cực tự lực"
                    ],
                    discussion: "Sự chuyển dịch mô hình dạy học từ truyền thụ tri thức sang tổ chức hoạt động học cho học sinh."
                },
                {
                    title: "Chương 2: Phương pháp dạy học tích cực",
                    items: [
                        "2.1. Khái niệm, bản chất và đặc trưng của phương pháp dạy học tích cực",
                        "2.2. Phương pháp dạy học giải quyết vấn đề (Problem-Based Learning - PBL)",
                        "2.3. Phương pháp dạy học theo dự án (Project-Based Learning)",
                        "2.4. Phương pháp dạy học khám phá và phương pháp Bàn tay nặn bột (Hands-on)",
                        "2.5. Phương pháp thảo luận nhóm và phương pháp dạy học trực quan hiện đại"
                    ],
                    discussion: "Phân tích ưu điểm và rào cản khi triển khai dạy học dự án tại trường phổ thông."
                },
                {
                    title: "Chương 3: Kỹ thuật dạy học tích cực",
                    items: [
                        "3.1. Kỹ thuật Khăn trải bàn (Placemat Activity): nguyên tắc tổ chức, ưu điểm và lưu ý",
                        "3.2. Kỹ thuật Các mảnh ghép (Jigsaw): giai đoạn chuyên sâu và giai đoạn phối hợp",
                        "3.3. Kỹ thuật Phòng tranh (Gallery Walk): trưng bày sản phẩm học tập và nhận xét chéo",
                        "3.4. Kỹ thuật KWL / KWLH, Sơ đồ tư duy (Mindmap), Kỹ thuật Đóng vai và Kỹ thuật Bể cá (Fishbowl)"
                    ],
                    discussion: "Thực hành thiết kế một hoạt động khám phá kiến thức sử dụng phối hợp kỹ thuật Khăn trải bàn và Kỹ thuật Mảnh ghép."
                },
                {
                    title: "Chương 4: Thiết kế Kế hoạch bài dạy theo Công văn 5512/BGDĐT-GDTrH",
                    items: [
                        "4.1. Cấu trúc chuẩn của Kế hoạch bài dạy theo Phụ lục IV Công văn 5512/BGDĐT-GDTrH",
                        "4.2. Kỹ thuật viết mục tiêu bài dạy theo Yêu cầu cần đạt: Kiến thức, Năng lực chung, Năng lực đặc thù, Phẩm chất",
                        "4.3. Thiết kế thiết bị dạy học và học liệu số (phiếu học tập, mô hình, video, phần mềm)",
                        "4.4. Thiết kế chuỗi 4 hoạt động học: (1) Khởi động/Mở đầu; (2) Hình thành kiến thức mới; (3) Luyện tập; (4) Vận dụng",
                        "4.5. 12 tiêu chí phân tích, đánh giá kế hoạch và bài dạy theo Công văn 5555/BGDĐT-GDTrH"
                    ],
                    discussion: "Thực hành rà soát, phản biện và cải tiến kế hoạch bài dạy của nhóm học viên theo 12 tiêu chí Công văn 5555."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (40 tiết)",
                    activities: [
                        {
                            id: "act_a3_1",
                            code: "Hoạt động 1",
                            name: "Nghiên cứu bản chất quá trình dạy học và quy luật nhận thức độc đáo của học sinh",
                            mode: "online",
                            target: "Nắm vững mối quan hệ giữa dạy và học theo quan điểm lấy người học làm trung tâm.",
                            tasks: "Đọc tài liệu Chương 1 trên LMS; lập bảng tóm tắt 4 quy luật và 6 nguyên tắc dạy học.",
                            materials: "Tài liệu đọc Chương 1, video bài giảng trực tuyến",
                            assessment: "Bảng tóm tắt quy luật dạy học nộp trên LMS"
                        },
                        {
                            id: "act_a3_2",
                            code: "Hoạt động 2",
                            name: "Phân tích hệ thống các nguyên tắc dạy học hiện đại phát triển năng lực",
                            mode: "online",
                            target: "Nhận diện cách thức cụ thể hóa các nguyên tắc dạy học vào một tiết học cụ thể.",
                            tasks: "Xem video phân tích một tiết dạy mẫu; chỉ ra các nguyên tắc dạy học đã được giáo viên vận dụng.",
                            materials: "Video tiết dạy mẫu phân tích nguyên tắc sư phạm",
                            assessment: "Bài tập phân tích video tiết dạy mẫu trên LMS"
                        },
                        {
                            id: "act_a3_3",
                            code: "Hoạt động 3",
                            name: "Khám phá các phương pháp dạy học tích cực (PBL, dạy học dự án, dạy học khám phá)",
                            mode: "online",
                            target: "Làm chủ quy trình các bước tổ chức dạy học giải quyết vấn đề và dạy học theo dự án.",
                            tasks: "Đọc tài liệu Chương 2; phân tích 01 dự án học tập mẫu và chỉ ra các pha thực hiện của học sinh.",
                            materials: "Tài liệu Chương 2, hồ sơ dự án học tập mẫu",
                            assessment: "Đánh giá bài tập phân tích dự án học tập"
                        },
                        {
                            id: "act_a3_4",
                            code: "Hoạt động 4",
                            name: "Làm chủ các kỹ thuật dạy học tích cực (Khăn trải bàn, Mảnh ghép, Phòng tranh, Sơ đồ tư duy)",
                            mode: "online",
                            target: "Thành thạo cách thiết kế lệnh hoạt động và phiếu học tập tương ứng với từng kỹ thuật dạy học.",
                            tasks: "Nghiên cứu tài liệu các kỹ thuật dạy học; thiết kế 01 phiếu giao việc cho kỹ thuật Khăn trải bàn.",
                            materials: "Cẩm nang Kỹ thuật dạy học tích cực, mẫu phiếu giao việc",
                            assessment: "Sản phẩm phiếu giao việc kỹ thuật dạy học"
                        },
                        {
                            id: "act_a3_5",
                            code: "Hoạt động 5",
                            name: "Phân tích video tiết dạy minh họa xuất sắc và nhận diện chuỗi 4 hoạt động học tập",
                            mode: "online",
                            target: "Phân tích chuỗi hoạt động Khởi động - Khám phá - Luyện tập - Vận dụng qua thực tế giảng dạy.",
                            tasks: "Xem video tiết dạy đạt giải cao; ghi nhận xét về mục tiêu, nội dung, sản phẩm và cách thức tổ chức từng hoạt động.",
                            materials: "Video tiết dạy minh họa chuẩn của Bộ GD&ĐT",
                            assessment: "Phiếu phân tích tiến trình bài dạy qua video"
                        },
                        {
                            id: "act_a3_6",
                            code: "Hoạt động 6",
                            name: "Kiểm tra trắc nghiệm lý luận dạy học trên hệ thống LMS (20 câu trắc nghiệm)",
                            mode: "online",
                            target: "Đánh giá tổng hợp kiến thức lý luận dạy học của giai đoạn bồi dưỡng trực tuyến.",
                            tasks: "Thực hiện bài kiểm tra trắc nghiệm 20 câu hỏi khách quan trong 35 phút trên hệ thống LMS.",
                            materials: "Ngân hàng đề thi trắc nghiệm LMS",
                            assessment: "Điểm trắc nghiệm LMS (Trọng số 20% điểm quá trình)"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (30 tiết)",
                    activities: [
                        {
                            id: "act_a3_7",
                            code: "Hoạt động 7",
                            name: "Thực hành xác định mục tiêu bài dạy (Yêu cầu cần đạt) chuẩn theo Chương trình GDPT 2018",
                            mode: "in_person",
                            target: "Sử dụng các động từ hành vi có thể lượng hóa để viết mục tiêu kiến thức, năng lực và phẩm chất.",
                            tasks: "Làm việc nhóm chọn 1 bài học môn học; đối chiếu Chương trình tổng thể và Chương trình môn học để viết mục tiêu.",
                            materials: "Chương trình môn học GDPT 2018, Bảng phân loại mục tiêu Bloom",
                            assessment: "Bản mục tiêu bài dạy và góp ý của giảng viên"
                        },
                        {
                            id: "act_a3_8",
                            code: "Hoạt động 8",
                            name: "Thiết kế chuỗi 4 hoạt động học tập (Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng) chuẩn 5512",
                            mode: "in_person",
                            target: "Xây dựng hoàn chỉnh kế hoạch bài dạy đáp ứng đầy đủ cấu trúc 4 bước của mỗi hoạt động.",
                            tasks: "Thiết kế chi tiết tiến trình dạy học: Mục tiêu, Nội dung, Sản phẩm học sinh phải hoàn thành, Tổ chức thực hiện (Giao việc - Thực hiện - Báo cáo - Kết luận).",
                            materials: "Mẫu kế hoạch bài dạy chuẩn Công văn 5512",
                            assessment: "Bản thảo kế hoạch bài dạy nhóm (Trọng số 20% điểm quá trình)"
                        },
                        {
                            id: "act_a3_9",
                            code: "Hoạt động 9",
                            name: "Xây dựng công cụ đánh giá kết quả học tập trong kế hoạch bài dạy (Rubrics, bài tập đánh giá năng lực)",
                            mode: "in_person",
                            target: "Tích hợp đánh giá thường xuyên vào từng hoạt động học tập thông qua rubrics và câu hỏi gợi mở.",
                            tasks: "Xây dựng rubric chấm sản phẩm học tập của hoạt động khám phá hoặc hoạt động luyện tập.",
                            materials: "Mẫu Rubrics đánh giá năng lực học sinh",
                            assessment: "Bản Rubrics và công cụ đánh giá bài học"
                        },
                        {
                            id: "act_a3_10",
                            code: "Hoạt động 10",
                            name: "Tổ chức tập giảng vi mô (Micro-teaching) trong nhóm nhỏ (15-20 phút/học viên)",
                            mode: "in_person",
                            target: "Thực hành năng lực giảng dạy trực tiếp: tác phong sư phạm, quản lý thời gian, điều hành hoạt động học sinh.",
                            tasks: "Mỗi học viên tập giảng một hoạt động cụ thể (15 phút) trước nhóm; các bạn học đóng vai học sinh phổ thông.",
                            materials: "Máy chiếu, bảng viết, phiếu học tập, giáo cụ bài dạy",
                            assessment: "Đánh giá tiết tập giảng vi mô (Trọng số 10% điểm quá trình)"
                        },
                        {
                            id: "act_a3_11",
                            code: "Hoạt động 11",
                            name: "Phân tích, nhận xét tiết tập giảng dựa trên 12 tiêu chí của Công văn 5555/BGDĐT",
                            mode: "in_person",
                            target: "Nâng cao năng lực sinh hoạt chuyên môn theo nghiên cứu bài học và phân tích hoạt động của học sinh.",
                            tasks: "Học viên trong nhóm sử dụng phiếu phân tích tiết dạy theo Công văn 5555 để nhận xét, chỉ ra ưu điểm và đề xuất cải tiến.",
                            materials: "Phiếu phân tích bài học theo Công văn 5555/BGDĐT",
                            assessment: "Biên bản nhận xét tiết tập giảng của nhóm"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 3: PHẢN HỒI VÀ ĐÁNH GIÁ TỔNG KẾT",
                    activities: [
                        {
                            id: "act_a3_12",
                            code: "Hoạt động 12",
                            name: "Hoàn thiện Hồ sơ Kế hoạch bài dạy chuẩn 5512 kèm video hoặc phiếu nhận xét tập giảng nộp LMS",
                            mode: "online",
                            target: "Hoàn thiện sản phẩm kế hoạch bài dạy chuyên sâu đạt chuẩn mô phạm của Bộ GD&ĐT.",
                            tasks: "Tiếp thu nhận xét sau buổi tập giảng, chỉnh sửa hoàn thiện giáo án 5512 kèm học liệu số và nộp lên hệ thống LMS.",
                            materials: "Hồ sơ Kế hoạch bài dạy hoàn chỉnh kèm học liệu",
                            assessment: "Đánh giá kết thúc học phần (Trọng số 50% điểm cuối kỳ)"
                        },
                        {
                            id: "act_a3_13",
                            code: "Hoạt động 13",
                            name: "Khảo sát phản hồi về chất lượng bồi dưỡng học phần",
                            mode: "online",
                            target: "Ghi nhận ý kiến đánh giá để không ngừng nâng cao chất lượng học phần Lý luận dạy học.",
                            tasks: "Hoàn thành phiếu khảo sát chất lượng khóa học trực tuyến trên LMS.",
                            materials: "Phiếu khảo sát phản hồi trực tuyến",
                            assessment: "Ghi nhận hoàn thành khảo sát"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Kết quả bài kiểm tra trắc nghiệm lý luận dạy học trên LMS (Hoạt động 6)",
                    "Phiếu giao việc kỹ thuật dạy học tích cực và phân tích video dạy học (Hoạt động 4 & 5)",
                    "Hồ sơ Kế hoạch bài dạy (KHBD) hoàn chỉnh chuẩn 5512 kèm học liệu số (Hoạt động 12)"
                ],
                inPerson: [
                    "Bản thảo kế hoạch bài dạy có tích hợp rubrics đánh giá của nhóm (Hoạt động 8 & 9)",
                    "Biên bản đánh giá tiết tập giảng vi mô (Micro-teaching) theo Công văn 5555 (Hoạt động 11)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Hoạt động 6: Kiểm tra trắc nghiệm lý luận dạy học trên LMS", weight: 20, condition: "Đạt từ 5.0 trở lên" },
                    { name: "Hoạt động 8: Bản thảo Kế hoạch bài dạy chuẩn Công văn 5512", weight: 20, condition: "Đạt từ 5.0 trở lên" },
                    { name: "Hoạt động 10: Thực hành tiết tập giảng vi mô và chuyên cần", weight: 10, condition: "Tham gia > 80% số tiết trực tiếp" }
                ],
                summative: {
                    name: "Hoạt động 12: Hồ sơ Kế hoạch bài dạy hoàn thiện chuẩn 5512 và thi tự luận cuối khóa",
                    weight: 50,
                    condition: "Đạt từ 5.0 trở lên. Điều kiện: Hoàn thành đầy đủ các bài tập quá trình."
                },
                scale: "Thang điểm 0 - 10, làm tròn đến một chữ số thập phân.",
                notes: "Học viên nộp hồ sơ kế hoạch bài dạy chuẩn định dạng PDF lên hệ thống LMS."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Trần Thị Tuyết Oanh (chủ biên) (2015). Giáo trình Lý luận dạy học. NXB Đại học Sư phạm.",
                "[2] Bộ Giáo dục và Đào tạo (2020). Công văn số 5512/BGDĐT-GDTrH về tổ chức thực hiện kế hoạch giáo dục trong trường học.",
                "[3] Bộ Giáo dục và Đào tạo (2014). Công văn số 5555/BGDĐT-GDTrH về việc hướng dẫn sinh hoạt chuyên môn về đổi mới phương pháp dạy học và kiểm tra, đánh giá.",
                "[4] Nguyễn Văn Cường, Bernd Meier (2014). Lý luận dạy học hiện đại. NXB Đại học Sư phạm.",
                "[5] Phan Văn Triều, Đặng Thị Lan (2020). Giáo trình Phương pháp và kỹ thuật dạy học tích cực. NXB Đại học Sư phạm TP.HCM."
            ]
        },
        grades: { attendance: 9.5, midterm: 9.0, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 10. MÃ HỌC PHẦN: A08 - HOẠT ĐỘNG GIÁO DỤC Ở TRƯỜNG PHỔ THÔNG
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a08",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A08",
        name: "Hoạt động giáo dục ở trường phổ thông",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học",
        instructor: "TS. Trần Thị Hương",
        instructorEmail: "huongtt@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "30/05/2021",
            authorTeam: [
                "ThS. Võ Thị Hồng Trước (Nhóm biên soạn)",
                "TS. Nguyễn Đức Danh (Nhóm biên soạn)"
            ],
            approver: "TS. Nguyễn Đức Danh (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "TS. Trần Thị Hương",
            instructorEmail: "huongtt@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học",
            hoursBreakdown: {
                total: 45,
                theory: 15,
                practice: 30,
                inPerson: 20,
                online: 10
            },
            description: "Học phần trang bị cho học viên vị trí, vai trò, mục tiêu của giáo dục phổ thông trong hệ thống GD quốc dân; nội dung, phương pháp và kỹ năng công tác chủ nhiệm lớp; các nguyên tắc và kỹ năng tham vấn giáo dục cơ bản/chuyên biệt; cùng lý thuyết, hình thức và phương pháp tư vấn hướng nghiệp cho học sinh.",
            objectives: [
                { code: "O1", text: "Trình bày vị trí, vai trò, mục tiêu của GD phổ thông trong hệ thống GD quốc dân; mục tiêu và kế hoạch GD của chương trình GD phổ thông." },
                { code: "O2", text: "Phân tích các nội dung và phương pháp công tác của giáo viên chủ nhiệm lớp ở trường phổ thông." },
                { code: "O3", text: "Thực hiện một số kỹ năng trong công tác chủ nhiệm lớp ở trường phổ thông." },
                { code: "O4", text: "Trình bày các vấn đề chung về tham vấn giáo dục, các nguyên tắc trong tham vấn giáo dục." },
                { code: "O5", text: "Thực hiện một số kỹ năng tham vấn cơ bản và kỹ năng chuyên biệt trong tham vấn giáo dục." },
                { code: "O6", text: "Phân tích các yếu tố ảnh hưởng đến kỹ năng tham vấn." },
                { code: "O7", text: "Trình bày các vấn đề cơ bản về hướng nghiệp cho học sinh: các lý thuyết hướng nghiệp, nội dung cơ bản của công tác hướng nghiệp, các phương pháp hướng nghiệp." },
                { code: "O8", text: "Phân tích các biện pháp phát triển năng lực hướng nghiệp của học sinh." },
                { code: "O9", text: "Thực hiện các kỹ năng và liệu pháp tư vấn hướng nghiệp cho học sinh." }
            ],
            clos: [
                "Nắm vững mục tiêu và kế hoạch giáo dục của Chương trình GDPT 2018 trong hệ thống giáo dục quốc dân.",
                "Thành thạo phương pháp và kỹ năng công tác chủ nhiệm lớp: lập hồ sơ, xây dựng tập thể, phối hợp các lực lượng GD và xử lý tình huống.",
                "Thực hiện thành thạo các kỹ năng tham vấn giáo dục cơ bản (lắng nghe, thấu cảm, phản hồi) và chuyên biệt (phát hiện sớm, đánh giá, can thiệp).",
                "Vận dụng các lý thuyết, liệu pháp và quy trình tư vấn hướng nghiệp phát triển năng lực nghề nghiệp cho học sinh phổ thông."
            ],
            contentOutline: [
                {
                    title: "Chương 1. Khái quát về giáo dục phổ thông",
                    items: [
                        "1.1 Khái quát về hệ thống giáo dục quốc dân Việt Nam",
                        "1.2 Chương trình giáo dục phổ thông (1.2.1 Khái niệm chương trình GD phổ thông; 1.2.2 Mục tiêu chương trình GD phổ thông; 1.2.3 Kế hoạch GD phổ thông)"
                    ],
                    discussion: "Thảo luận về tính liên thông và mục tiêu phân luồng giáo dục theo định hướng phát triển phẩm chất, năng lực học sinh."
                },
                {
                    title: "Chương 2. Nội dung và phương pháp công tác chủ nhiệm lớp ở trường PT",
                    items: [
                        "2.1 Xây dựng và quản lý hồ sơ học sinh lớp chủ nhiệm",
                        "2.2 Lập kế hoạch công tác chủ nhiệm lớp",
                        "2.3 Xây dựng môi trường lớp học và tập thể học sinh",
                        "2.4 Tổ chức các nội dung giáo dục toàn diện",
                        "2.5 Phối hợp với gia đình học sinh và các lực lượng giáo dục",
                        "2.6 Xử lý tình huống trong công tác chủ nhiệm"
                    ],
                    discussion: "Phân tích các tình huống sư phạm điển hình trong công tác chủ nhiệm và giải pháp phối hợp hiệu quả giữa nhà trường - gia đình - xã hội."
                },
                {
                    title: "Chương 3. Tham vấn giáo dục",
                    items: [
                        "3.1 Lý luận chung về tham vấn giáo dục (3.1.1 Khái niệm; 3.1.2 Nội dung; 3.1.3 Nhiệm vụ; 3.1.4 Yêu cầu phẩm chất và năng lực của nhà tham vấn giáo dục)",
                        "3.2 Nguyên tắc trong tham vấn giáo dục (3.2.1 Tôn trọng thân chủ; 3.2.2 Chấp nhận, không phán xét; 3.2.3 Dành quyền tự quyết; 3.2.4 Đảm bảo bí mật thân chủ)",
                        "3.3 Kỹ năng tham vấn: 3.3.1 Kỹ năng cơ bản (thiết lập mối quan hệ, lắng nghe, đặt câu hỏi, phản hồi, thấu hiểu); 3.3.2 Kỹ năng chuyên biệt (phát hiện sớm, đánh giá vấn đề, xây dựng & tổ chức phòng ngừa, can thiệp)",
                        "3.4 Các yếu tố ảnh hưởng đến kỹ năng tham vấn giáo dục (3.4.1 Nhóm chủ thể tham vấn; 3.4.2 Nhóm yếu tố bên ngoài)"
                    ],
                    discussion: "Thực hành đạo đức nghề nghiệp và quy tắc bảo mật thông tin thân chủ trong môi trường học đường."
                },
                {
                    title: "Chương 4. Hoạt động hướng nghiệp cho học sinh",
                    items: [
                        "4.1 Các vấn đề chung về hướng nghiệp (4.1.1 Lý thuyết hướng nghiệp: mô hình cung cấp dịch vụ, vòng nghề nghiệp, cây nghề nghiệp, lý thuyết hệ thống, mô hình lập kế hoạch nghề; 4.1.2 Các hình thức hướng nghiệp; 4.1.3 Phương pháp hướng nghiệp)",
                        "4.2 Phát triển năng lực hướng nghiệp cho học sinh (4.2.1 Nhận thức bản thân; 4.2.2 Nhận thức nghề nghiệp; 4.2.3 Tìm hiểu thị trường tuyển dụng; 4.2.4 Xây dựng kế hoạch rèn luyện)",
                        "4.3 Tư vấn hướng nghiệp (4.3.1 Kỹ năng cơ bản về tư vấn hướng nghiệp; 4.3.2 Các liệu pháp tư vấn; 4.3.3 Điều kiện đảm bảo tư vấn hướng nghiệp hiệu quả)"
                    ],
                    discussion: "Ứng dụng mô hình Cây nghề nghiệp và Holland để định hướng chọn ngành nghề phù hợp với tính cách, sở thích học sinh."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (10 tiết)",
                    activities: [
                        {
                            id: "act_a08_1",
                            code: "Hoạt động 1",
                            name: "Tìm hiểu chung về học phần Hoạt động giáo dục",
                            mode: "online",
                            target: "Trình bày mục tiêu, nội dung, kế hoạch học tập của học phần.",
                            tasks: "Đọc các hướng dẫn tham gia học phần trong lớp học trực tuyến; Đọc đề cương chi tiết học phần.",
                            materials: "Đề cương chi tiết học phần",
                            assessment: "Xác nhận đã nghiên cứu đề cương chi tiết"
                        },
                        {
                            id: "act_a08_2",
                            code: "Hoạt động 2",
                            name: "Tìm hiểu khái quát về giáo dục phổ thông",
                            mode: "online",
                            target: "Trình bày vị trí, vai trò, mục tiêu của GD phổ thông trong hệ thống GD quốc dân; mục tiêu và kế hoạch GD của CT GDPT.",
                            tasks: "Đọc tài liệu học tập 4 (trang 9 - 30) và trả lời câu hỏi trên hệ thống LMS.",
                            materials: "Tài liệu học tập số 4, câu hỏi",
                            assessment: "Trả lời đúng các câu hỏi"
                        },
                        {
                            id: "act_a08_3",
                            code: "Hoạt động 3",
                            name: "Tìm hiểu công tác chủ nhiệm ở trường phổ thông",
                            mode: "online",
                            target: "Phân tích các nội dung và phương pháp công tác chủ nhiệm lớp ở trường phổ thông.",
                            tasks: "Đọc tài liệu học tập 4 (trang 46 - 106); Trả lời các câu hỏi và bài tập trên hệ thống.",
                            materials: "Tài liệu học tập số 4, câu hỏi, bài tập",
                            assessment: "Hoàn thành các câu hỏi và bài tập"
                        },
                        {
                            id: "act_a08_4",
                            code: "Hoạt động 4",
                            name: "Tìm hiểu tham vấn giáo dục cho học sinh",
                            mode: "online",
                            target: "Trình bày các vấn đề chung và nguyên tắc tham vấn GD; trình bày kỹ năng tham vấn cơ bản và chuyên biệt trong tham vấn giáo dục.",
                            tasks: "Đọc tài liệu học tập số 3 (trang 7 - 56); Trả lời các câu hỏi và bài tập.",
                            materials: "Tài liệu học tập số 3, câu hỏi",
                            assessment: "Hoàn thành các câu hỏi"
                        },
                        {
                            id: "act_a08_5",
                            code: "Hoạt động 5",
                            name: "Tìm hiểu hoạt động hướng nghiệp cho học sinh",
                            mode: "online",
                            target: "Trình bày các vấn đề cơ bản về hướng nghiệp cho học sinh: lý thuyết, hình thức, phương pháp hướng nghiệp.",
                            tasks: "Đọc tài liệu học tập số 1 (trang 27 - 64); Trả lời câu hỏi trên hệ thống LMS.",
                            materials: "Tài liệu số 1, câu hỏi",
                            assessment: "Hoàn thành các câu hỏi"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (20 tiết)",
                    activities: [
                        {
                            id: "act_a08_face_intro",
                            code: "Giới thiệu & Phần 1",
                            name: "Giới thiệu khóa học & Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Tổ chức lớp học, thống nhất yêu cầu và giải đáp các khó khăn của giai đoạn trực tuyến.",
                            tasks: "Giới thiệu thành phần tham dự, báo cáo viên, chương trình bồi dưỡng; Chia nhóm, phát kế hoạch và dụng cụ; Giới thiệu hình thức kiểm tra đánh giá, tài liệu tham khảo; Thảo luận nhóm báo cáo kết quả trực tuyến; GV giải đáp thắc mắc chung.",
                            materials: "Kế hoạch bồi dưỡng, tài nguyên học phần",
                            assessment: "Tham gia tổ chức lớp và báo cáo tiến độ học trực tuyến"
                        },
                        {
                            id: "act_a08_p1",
                            code: "Hoạt động 1",
                            name: "Thực hành một số kỹ năng công tác chủ nhiệm lớp",
                            mode: "in_person",
                            target: "Thực hành xây dựng và quản lý hồ sơ HS, xây dựng tập thể lớp, phối hợp lực lượng GD, tổ chức GD toàn diện; giải quyết tình huống chủ nhiệm.",
                            tasks: "Làm việc nhóm thực hiện: Xây dựng và quản lý hồ sơ học sinh; Xây dựng tập thể học sinh lớp chủ nhiệm; Phối hợp các lực lượng giáo dục trong và ngoài nhà trường; Tổ chức các nội dung GD toàn diện; Giải quyết tình huống trong công tác chủ nhiệm.",
                            materials: "Tài liệu số 2, 4, bài giảng và file trình chiếu của giảng viên, hồ sơ học sinh và kế hoạch mẫu",
                            assessment: "Đánh giá sản phẩm nhóm, kỹ năng phối hợp, thái độ hợp tác và trách nhiệm từng thành viên"
                        },
                        {
                            id: "act_a08_p3",
                            code: "Hoạt động 3",
                            name: "Thực hành kỹ năng tham vấn giáo dục",
                            mode: "in_person",
                            target: "Thực hiện một số kỹ năng tham vấn cơ bản và kỹ năng chuyên biệt trong tham vấn giáo dục.",
                            tasks: "Thực hiện các bài tập thực hành kỹ năng tham vấn cơ bản và chuyên biệt thông qua hình thức làm việc nhóm và sắm vai.",
                            materials: "Tài liệu học tập số 3, bài giảng và file trình chiếu bài giảng của GV, bài tập thực hành",
                            assessment: "Đánh giá sản phẩm nhóm (kết quả thực hiện các kỹ năng tham vấn GD), kỹ năng phối hợp, thái độ hợp tác, trách nhiệm của từng thành viên"
                        },
                        {
                            id: "act_a08_p4",
                            code: "Hoạt động 4",
                            name: "Thực hành tư vấn hướng nghiệp",
                            mode: "in_person",
                            target: "Phân tích các biện pháp phát triển năng lực hướng nghiệp; thực hiện kỹ năng và liệu pháp tư vấn hướng nghiệp cho học sinh.",
                            tasks: "Thực hiện các bài tập về phát triển năng lực hướng nghiệp cho học sinh và thực hành các kỹ năng tư vấn hướng nghiệp cơ bản qua làm việc nhóm nhỏ.",
                            materials: "Tài liệu học tập số 1, bài giảng và file trình chiếu của GV, bài tập thực hành",
                            assessment: "Đánh giá sản phẩm nhóm, kỹ năng phối hợp, thái độ hợp tác và trách nhiệm của từng thành viên"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Trả lời câu hỏi trắc nghiệm/tự luận trên hệ thống LMS",
                    "Sản phẩm bài tập thực hành các nội dung theo yêu cầu"
                ],
                inPerson: [
                    "Hồ sơ học sinh và Kế hoạch công tác chủ nhiệm lớp",
                    "Các sản phẩm thực hành kỹ năng công tác chủ nhiệm theo yêu cầu của từng loại bài tập",
                    "Sản phẩm thực hành tham vấn giáo dục và phát triển năng lực hướng nghiệp cho học sinh, thực hành tham vấn hướng nghiệp"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: Giảng viên chấm điểm hoạt động bồi dưỡng trực tiếp", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Bài kiểm tra, sản phẩm thực hành",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm. Điều kiện: HV tham gia trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Bắt buộc đạt trên 5 điểm cả hai bài điều kiện để đủ tiêu chuẩn tham dự đánh giá cuối học phần."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Hồ Phụng Hoàng, Trần Thị Thu, Nguyễn Thị Châu (2012). Quản lý hướng nghiệp ở cấp trung học. Hà Nội: NXB Đại học Sư phạm.",
                "[2] Trần Thị Hương (2012). Bài tập thực hành Giáo dục học phổ thông. TP Hồ Chí Minh: NXB Đại học Sư phạm TP.HCM.",
                "[3] Hoàng Anh Phước (2016). Kĩ năng tham vấn học đường. Những vấn đề lí luận và thực tiễn. Hà Nội: NXB Đại học Sư phạm.",
                "[4] Nguyễn Đắc Thanh, Trần Thị Hương, Võ Thị Hồng Trước (2019). Tổ chức hoạt động giáo dục ở trường phổ thông. TP Hồ Chí Minh: NXB Đại học Sư phạm TP.HCM."
            ]
        },
        grades: { attendance: 9.5, midterm: 8.8, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 11. MÃ HỌC PHẦN: A9 - KỶ LUẬT TÍCH CỰC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a9",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A9",
        name: "Kỷ luật tích cực",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học",
        instructor: "ThS. Nguyễn Văn Thắng",
        instructorEmail: "thangnv@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 11/2021/TT-BGDĐT & Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ GD&ĐT",
            date: "15/05/2021",
            authorTeam: [
                "ThS. Nguyễn Thị Ngọc Bích (Nhóm biên soạn)",
                "TS. Võ Thị Tường Vy (Nhóm biên soạn)",
                "ThS. Lưu Mạnh Hùng (Nhóm biên soạn)"
            ],
            approver: "TS. Võ Thị Tường Vy (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "ThS. Nguyễn Văn Thắng",
            instructorEmail: "thangnv@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học",
            hoursBreakdown: {
                total: 45,
                theory: 15,
                practice: 30,
                inPerson: 15,
                online: 30
            },
            description: "Học phần hỗ trợ, giúp học viên lĩnh hội kiến thức nền tảng lý luận về kỷ luật tích cực: khái niệm, đặc điểm, mục tiêu, vai trò; cơ sở tâm lý và văn bản pháp luật; phương pháp triển khai kỷ luật tích cực trong nhà trường; các biện pháp thay đổi cách cư xử, quản lý hành vi và xây dựng môi trường lớp học thân thiện.",
            objectives: [
                { code: "O1", text: "Nhận biết được lý luận chung về kỉ luật tích cực cho học sinh phổ thông." },
                { code: "O2", text: "Mô tả được phương pháp triển khai kỷ luật tích cực trong nhà trường." },
                { code: "O3", text: "Phân tích và có khả năng vận dụng được biện pháp xây dựng kỉ luật tích cực trong lớp học." },
                { code: "O4", text: "Vận dụng kiến thức đã học để thiết kế các biện pháp kỷ luật tích cực trong lớp học." }
            ],
            clos: [
                "Trình bày rõ bản chất, đặc điểm, mục tiêu và cơ sở tâm lý - pháp lý của kỷ luật tích cực trong giáo dục phổ thông.",
                "Phân tích hậu quả tiêu cực của trừng phạt thân thể/tinh thần và các giải pháp thay thế mang tính giáo dục nhân văn.",
                "Thành thạo phương pháp xây dựng môi trường sư phạm thân thiện và mạng lưới hỗ trợ kỷ luật tích cực trong nhà trường.",
                "Thiết kế hoàn chỉnh dự án/hoạt động về biện pháp kỷ luật tích cực và quy tắc ứng xử lớp học có sự tham gia của học sinh."
            ],
            contentOutline: [
                {
                    title: "A. NỘI DUNG LÝ THUYẾT - 1. Lý luận chung về kỉ luật tích cực trong nhà trường PT",
                    items: [
                        "1.1 Khái niệm, đặc điểm, mục tiêu và vai trò của kỷ luật tích cực trong nhà trường PT (1.1.1 Khái niệm; 1.1.2 Đặc điểm; 1.1.3 Mục tiêu; 1.1.4 Vai trò)",
                        "1.2 Cơ sở lý luận và thực tiễn của kỉ luật tích cực (1.2.1 Cơ sở tâm lý của kỷ luật tích cực: Đặc điểm tâm lý của học sinh THCS/THPT; 1.2.2 Các văn bản pháp luật; 1.2.3 Hậu quả của việc sử dụng các biện pháp trừng phạt thân thể và tinh thần học sinh PT)",
                        "1.3 Những định hướng cơ bản trong việc áp dụng kỷ luật tích cực trong nhà trường PT"
                    ],
                    discussion: "Thảo luận về sự khác biệt căn bản giữa kỷ luật trừng phạt truyền thống và giáo dục kỷ luật tích cực nhân văn."
                },
                {
                    title: "A. NỘI DUNG LÝ THUYẾT - 2. Phương pháp triển khai kỷ luật tích cực trong nhà trường",
                    items: [
                        "2.1 Thay đổi nhận thức của giáo viên về các hình thức kỉ luật tích cực",
                        "2.2 Xây dựng môi trường sư phạm thân thiện trong nhà trường PT",
                        "2.3 Xây dựng mạng lưới thực hiện kỉ luật tích cực trong nhà trường PT"
                    ],
                    discussion: "Xây dựng cơ chế phối hợp giữa giáo viên chủ nhiệm, bộ môn, ban giám hiệu và phụ huynh học sinh."
                },
                {
                    title: "A. NỘI DUNG LÝ THUYẾT - 3. Biện pháp xây dựng kỉ luật tích cực trong lớp học",
                    items: [
                        "3.1 Thay đổi cách cư xử trong lớp học",
                        "3.2 Quan tâm đến hoàn cảnh của học sinh; áp dụng các biện pháp quản lý hành vi của học sinh trong lớp học",
                        "3.3 Xây dựng môi trường lớp học thân thiện",
                        "3.4 Tăng cường sự tham gia của học sinh trong xây dựng, giám sát nội quy lớp học"
                    ],
                    discussion: "Quy trình tổ chức cho học sinh cùng thảo luận và biểu quyết ban hành nội quy lớp học tích cực."
                },
                {
                    title: "B. NỘI DUNG THỰC HÀNH: Thiết kế biện pháp kỷ luật tích cực ở lớp học",
                    items: [
                        "Nhận diện, mô tả và phân tích được kỷ luật tích cực ở trường THCS/THPT",
                        "Thiết kế biện pháp kỷ luật tích cực ở trường THCS/THPT (kế hoạch hành động / đề án lớp học)",
                        "Thuyết trình và phản biện sản phẩm dự án trước hội đồng lớp học"
                    ],
                    discussion: "Đóng vai xử lý các ca hành vi bất thường của học sinh bằng phương pháp kỷ luật tích cực thay vì trừng phạt."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (30 tiết)",
                    activities: [
                        {
                            id: "act_a9_intro",
                            code: "Hướng dẫn",
                            name: "Hướng dẫn học trực tuyến môn Kỷ luật tích cực",
                            mode: "online",
                            target: "Nắm vững mục tiêu, nội dung, hình thức và phương pháp đánh giá sản phẩm trực tuyến.",
                            tasks: "Giới thiệu mục tiêu, nội dung học phần; Giới thiệu hình thức bồi dưỡng trực tuyến và hướng dẫn cách thức thực hiện các HĐ học tập; Hướng dẫn thực hiện kiểm tra đánh giá / sản phẩm trực tuyến.",
                            materials: "Tài liệu học phần, Đề cương chi tiết",
                            assessment: "Xác nhận nắm vững kế hoạch học tập"
                        },
                        {
                            id: "act_a9_1",
                            code: "Hoạt động 1",
                            name: "Tìm hiểu và trình bày Khái niệm, đặc điểm, mục tiêu và vai trò của kỷ luật tích cực",
                            mode: "online",
                            target: "Trình bày được Khái niệm, đặc điểm, mục tiêu và vai trò của kỷ luật tích cực trong nhà trường PT.",
                            tasks: "Đọc tài liệu và trình bày trực tuyến trước lớp các Khái niệm, đặc điểm, mục tiêu và vai trò của kỷ luật tích cực (2t lý thuyết + 1/2t thảo luận).",
                            materials: "Tài liệu 1, 2, 3",
                            assessment: "HV nêu đúng Khái niệm, đặc điểm, mục tiêu và vai trò của kỷ luật tích cực trong nhà trường PT"
                        },
                        {
                            id: "act_a9_2",
                            code: "Hoạt động 2",
                            name: "Thuyết trình nhóm về Cơ sở tâm lý của kỉ luật trong trường THCS/THPT",
                            mode: "online",
                            target: "Trình bày được cơ sở tâm lý của kỉ luật trong trường THCS/THPT.",
                            tasks: "Mỗi nhóm nghiên cứu nội dung Cơ sở tâm lý của kỉ luật trong trường THCS/THPT; làm việc nhóm và thuyết trình trực tuyến trước lớp (2t lý thuyết + 1/2t thảo luận).",
                            materials: "Tài liệu 1, 2, 3",
                            assessment: "HV trình bày đủ nội hàm của Cơ sở tâm lý của kỉ luật trong trường THCS/THPT"
                        },
                        {
                            id: "act_a9_3",
                            code: "Hoạt động 3",
                            name: "Thảo luận và trình bày Thay đổi nhận thức của giáo viên về các hình thức kỉ luật tích cực",
                            mode: "online",
                            target: "Trình bày được nội dung Thay đổi nhận thức của giáo viên về các hình thức kỉ luật tích cực.",
                            tasks: "Mỗi nhóm đọc tài liệu, thảo luận và trình bày nội dung thay đổi nhận thức của giáo viên về các hình thức kỉ luật tích cực (2t lý thuyết + 1/2t thảo luận).",
                            materials: "Tài liệu 1, 2, 3",
                            assessment: "HV trình bày đủ nội dung thay đổi nhận thức của giáo viên về các hình thức kỉ luật tích cực"
                        },
                        {
                            id: "act_a9_4",
                            code: "Hoạt động 4",
                            name: "Thuyết trình nhóm về xây dựng môi trường sư phạm thân thiện & mạng lưới kỷ luật tích cực",
                            mode: "online",
                            target: "Trình bày được nội dung xây dựng môi trường sư phạm thân thiện trong nhà trường PT, xây dựng mạng lưới thực hiện kỉ luật tích cực.",
                            tasks: "Nhóm được giao chuẩn bị bài thuyết trình trước và trình bày kết quả về xây dựng môi trường sư phạm thân thiện, xây dựng mạng lưới thực hiện kỷ luật tích cực (2t lý thuyết + 1/2t thảo luận).",
                            materials: "Tài liệu 1, 2, 3",
                            assessment: "HV trình bày đủ nội dung về môi trường thân thiện và mạng lưới thực hiện kỷ luật tích cực"
                        },
                        {
                            id: "act_a9_5",
                            code: "Hoạt động 5",
                            name: "Thảo luận và trình bày Thay đổi cách cư xử trong lớp học, quản lý hành vi học sinh",
                            mode: "online",
                            target: "Trình bày được nội dung thay đổi cách cư xử trong lớp học, quan tâm hoàn cảnh học sinh; áp dụng các biện pháp quản lý hành vi học sinh.",
                            tasks: "Mỗi nhóm đọc tài liệu, thảo luận và trình bày thay đổi cách cư xử trong lớp học, quan tâm đến hoàn cảnh của HS, quản lý hành vi HS (2t lý thuyết + 1/2t thảo luận).",
                            materials: "Tài liệu 1, 2, 3",
                            assessment: "HV trình bày đủ nội dung thay đổi cách cư xử và quản lý hành vi học sinh"
                        },
                        {
                            id: "act_a9_6",
                            code: "Hoạt động 6",
                            name: "Thuyết trình về Xây dựng môi trường lớp học thân thiện, tăng cường học sinh tham gia nội quy",
                            mode: "online",
                            target: "Trình bày được nội dung xây dựng môi trường lớp học thân thiện, tăng cường sự tham gia của học sinh trong xây dựng, giám sát nội quy lớp học.",
                            tasks: "Nhóm được phân công thuyết trình về môi trường lớp học thân thiện và quy trình học sinh tham gia xây dựng, giám sát nội quy (2t lý thuyết + 1/2t thảo luận).",
                            materials: "Tài liệu 1, 2, 3",
                            assessment: "HV trình bày đủ nội dung về xây dựng môi trường thân thiện và học sinh tham gia nội quy"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (15 tiết)",
                    activities: [
                        {
                            id: "act_a9_face_intro",
                            code: "Giới thiệu & Phần 1",
                            name: "Giới thiệu khóa học & Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Thống nhất yêu cầu thực hành trực tiếp và giải quyết vướng mắc lý thuyết trực tuyến.",
                            tasks: "Giới thiệu thành phần tham dự, báo cáo viên, chương trình bồi dưỡng; Tổ chức lớp: chia nhóm, phát kế hoạch và dụng cụ; Thảo luận nhóm báo cáo những nội dung đã làm được trực tuyến và nội dung cần hỗ trợ trực tiếp; GV hướng dẫn giải đáp thắc mắc.",
                            materials: "Kế hoạch bồi dưỡng, dụng cụ học tập",
                            assessment: "Tham gia tổ chức lớp và phản hồi tiến độ tự học"
                        },
                        {
                            id: "act_a9_7",
                            code: "Hoạt động 7",
                            name: "Dạy bổ sung các nội dung trọng tâm chưa thể thực hiện tốt với hình thức trực tuyến",
                            mode: "in_person",
                            target: "Hiểu sâu và giải quyết các điểm nghẽn nhận thức về kỷ luật tích cực trong môi trường sư phạm thực tế.",
                            tasks: "Đặt câu hỏi, lắng nghe, ghi chép và phản hồi mức độ tiếp thu cũng như trả lời các câu hỏi kiểm tra lại của GV.",
                            materials: "Tất cả tài liệu / Bài giảng của GV",
                            assessment: "Tham gia hoạt động đúng giờ, đầy đủ, nhiệt tình đóng góp và trả lời đúng câu hỏi kiểm tra của GV"
                        },
                        {
                            id: "act_a9_8",
                            code: "Hoạt động 8",
                            name: "Thiết kế biện pháp kỷ luật tích cực ở trường THCS/THPT",
                            mode: "in_person",
                            target: "Các nhóm HV nộp sản phẩm là dự án/hoạt động về biện pháp kỷ luật tích cực ở trường THCS/THPT.",
                            tasks: "Làm việc nhóm để thiết kế dự án/hoạt động về biện pháp kỷ luật tích cực ở trường THCS/THPT, gồm 2 bước: (1) Nhận diện, mô tả và phân tích kỷ luật tích cực ở trường THCS/THPT; (2) Thiết kế biện pháp kỷ luật tích cực; Trả lời phản biện.",
                            materials: "Tất cả tài liệu học phần",
                            assessment: "Nộp dự án/hoạt động đúng thời hạn, đáp ứng đúng yêu cầu về nội dung và hình thức, trả lời tốt các câu hỏi phản biện"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Mỗi nhóm học viên phải nộp bài thuyết trình trên hệ thống LMS",
                    "Mỗi cá nhân hoàn thành sản phẩm bài tập lên hệ thống"
                ],
                inPerson: [
                    "Các nhóm HV nộp sản phẩm về dự án/hoạt động kỷ luật tích cực đúng thời hạn",
                    "Biên bản thảo luận và phản biện chuyên môn trực tiếp tại lớp"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Chấm điểm hoàn thành bài tập nhóm trên hệ thống LMS", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: Giảng viên chấm điểm hoạt động bồi dưỡng trực tiếp", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Bài viết tự luận (Bài thu hoạch hoạt động về biện pháp kỷ luật tích cực ở trường THCS/THPT)",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm. Điều kiện: HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Hoàn thành đầy đủ các bài tập nhóm và hoạt động thiết kế dự án trực tiếp."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Bộ Giáo dục và Đào tạo (2005). Tài liệu bồi dưỡng giáo viên THPT về giáo dục kỉ luật tích cực. Hà Nội.",
                "[2] Save The Children (2008). Đổi mới phương pháp quản lý lớp học bằng các biện pháp Giáo dục kỷ luật tích cực. NXB Đồng Nai.",
                "[3] Cơ quan Hợp tác và Phát triển Thụy Sỹ (2014). Tài liệu tập huấn: Giáo dục kỷ luật tích cực.",
                "[4] TS. Lê Văn Hảo (2009). Phương pháp kỷ luật tích cực, Tài liệu tập huấn cho tập huấn viên. Tổ chức Plan tại Việt Nam.",
                "[5] Jane Nelsen (2020). Kỷ luật tích cực (Bình Max dịch, In lần thứ tư). NXB Phụ nữ Việt Nam.",
                "[6] CSDL Phương pháp kỷ luật tích cực: https://tailieu.vn/tag/phuong-phap-ky-luat-tich-cuc.html"
            ]
        },
        grades: { attendance: 9.0, midterm: 8.5, final: 8.8 }
    },

    // ---------------------------------------------------------------------
    // 12. MÃ HỌC PHẦN: A11 - KỸ THUẬT DẠY HỌC TÍCH CỰC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a11",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A11",
        name: "Kỹ thuật dạy học tích cực",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học",
        instructor: "TS. Cao Thị Châu Thủy",
        instructorEmail: "thuyctc@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "10/06/2021",
            authorTeam: [
                "ThS. Đào Xuân Phương Trang (Khoa Tiếng Anh)",
                "TS. Trần Khai Xuân (Khoa Tiếng Trung)",
                "ThS. Trần Lê Quân (Khoa Tiếng Nga)",
                "ThS. Hạ Thị Mai Hương (Khoa Tiếng Pháp)",
                "TS. Phạm Thị Bình (Khoa Địa lý)",
                "ThS. Đỗ Công Nam (Khoa Giáo dục Chính trị)",
                "ThS. Đào Thị Mộng Ngọc (Khoa Lịch sử)",
                "TS. Nguyễn Thanh Nga (Khoa Vật lý)",
                "TS. Phan Thị Thu Hiền (Khoa Sinh học)",
                "TS. Nguyễn Thành Ngọc Bảo (Khoa Ngữ văn)",
                "TS. Trịnh Lê Hồng Phương (Khoa Hóa học)",
                "ThS. Ngô Minh Đức (Khoa Toán Tin học)",
                "ThS. Đặng Văn Khoa (Khoa GD Quốc phòng)",
                "TS. Trần Sơn Hải (Khoa Công nghệ Thông tin)"
            ],
            approver: "TS. Nguyễn Thanh Nga (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "TS. Cao Thị Châu Thủy",
            instructorEmail: "thuyctc@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học",
            hoursBreakdown: {
                total: 50,
                theory: 10,
                practice: 40,
                inPerson: 40,
                online: 10
            },
            description: "Học phần giúp học viên trình bày đặc trưng dạy học tích cực và vấn đề vận dụng kỹ thuật dạy học tích cực ở trường THCS/THPT; phân tích các bước thực hiện, ưu điểm, hạn chế của từng kỹ thuật dạy học tích cực; và thực hiện thành thạo các kỹ thuật trong môi trường lớp học giả định.",
            objectives: [
                { code: "O1", text: "Trình bày được đặc trưng của dạy học tích cực và vấn đề vận dụng kỹ thuật dạy học tích cực ở trường THCS/THPT." },
                { code: "O2", text: "Phân tích được các bước thực hiện, ưu điểm, hạn chế của từng kỹ thuật dạy học tích cực." },
                { code: "O3", text: "Thực hiện được các kỹ thuật dạy học tích cực trong môi trường lớp học giả định." }
            ],
            clos: [
                "Nắm vững các đặc trưng cốt lõi của dạy học tích cực và cơ sở tâm lý học - giáo dục học trong vận dụng kỹ thuật sư phạm.",
                "Phân tích chuyên sâu quy trình, ưu điểm và hạn chế của các kỹ thuật cá nhân (5W1H, 321, động não, cầm tay chỉ việc), kỹ thuật nhóm (khăn trải bàn, mảnh ghép, bể cá, XYZ, phòng tranh...) và kỹ thuật phản hồi (3 lần 3, KWLH, khảo sát).",
                "Thiết kế lệnh hoạt động, phiếu học tập và kế hoạch bài dạy tích hợp linh hoạt các kỹ thuật dạy học tích cực.",
                "Thực hành giảng dạy tự tin trong môi trường lớp học giả định và xử lý hiệu quả các khó khăn sư phạm phát sinh."
            ],
            contentOutline: [
                {
                    title: "Nội dung 1. Các đặc trưng của dạy học tích cực",
                    items: [
                        "Dạy học thông qua tổ chức các hoạt động học tập của học sinh",
                        "Dạy và học chú trọng rèn luyện phương pháp tự học",
                        "Tăng cường học tập cá thể, phối hợp với học tập hợp tác",
                        "Kết hợp đánh giá của thầy với tự đánh giá của học trò"
                    ],
                    discussion: "Bản chất chuyển dịch từ dạy học truyền thụ kiến thức sang dạy học phát triển phẩm chất, năng lực người học."
                },
                {
                    title: "Nội dung 2. Vận dụng kỹ thuật dạy học tích cực",
                    items: [
                        "Cơ sở tâm lý học giáo dục, giáo dục học của kỹ thuật dạy học tích cực",
                        "Sự cần thiết của việc vận dụng các kỹ thuật dạy học tích cực",
                        "Lựa chọn và sử dụng phối hợp các kỹ thuật dạy học tích cực",
                        "Khó khăn và hướng khắc phục khi áp dụng các kỹ thuật dạy học tích cực"
                    ],
                    discussion: "Các rào cản tâm lý của học sinh và phương thức phân chia thời gian hợp lý khi vận dụng kỹ thuật tích cực."
                },
                {
                    title: "Nội dung 3. Đặc điểm của một số kỹ thuật dạy học tích cực",
                    items: [
                        "Các kỹ thuật tổ chức hoạt động cá nhân: kỹ thuật 5W1H, kỹ thuật 321, kỹ thuật động não, kỹ thuật cầm tay chỉ việc…",
                        "Các kỹ thuật tổ chức hoạt động nhóm: kỹ thuật hỏi - đáp, kỹ thuật chia sẻ nhóm đôi, kỹ thuật tranh luận ủng hộ - phản đối, kỹ thuật sơ đồ tư duy, kỹ thuật đóng vai, kỹ thuật khăn trải bàn, kỹ thuật mảnh ghép, kỹ thuật tia chớp, kỹ thuật bể cá, kỹ thuật ổ bi, kỹ thuật XYZ, kỹ thuật phòng tranh,…",
                        "Các kỹ thuật lấy thông tin phản hồi: kỹ thuật 3 lần 3, kỹ thuật khảo sát, kỹ thuật KWLH,…"
                    ],
                    discussion: "So sánh kỹ thuật Khăn trải bàn và Kỹ thuật Mảnh ghép trong việc phát huy trách nhiệm cá nhân trong nhóm hợp tác."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (10 tiết)",
                    activities: [
                        {
                            id: "act_a11_intro",
                            code: "Hướng dẫn",
                            name: "Hướng dẫn học trực tuyến môn Kỹ thuật dạy học tích cực",
                            mode: "online",
                            target: "Nắm vững mục tiêu, nội dung học phần và phương pháp thực hiện nhiệm vụ trực tuyến.",
                            tasks: "Giới thiệu mục tiêu, nội dung của học phần; Giới thiệu hình thức bồi dưỡng trực tuyến và hướng dẫn cách thức thực hiện hoạt động học tập; Hướng dẫn thực hiện kiểm tra đánh giá / sản phẩm trực tuyến.",
                            materials: "Tài liệu bồi dưỡng trực tuyến, hướng dẫn LMS",
                            assessment: "Hoàn thành nghiên cứu tài liệu hướng dẫn"
                        },
                        {
                            id: "act_a11_1",
                            code: "Buổi 1 - Sáng - HĐ 1",
                            name: "Tìm hiểu các đặc trưng của dạy học tích cực ở trường phổ thông",
                            mode: "online",
                            target: "Trình bày được các đặc trưng của dạy học tích cực: tổ chức hoạt động, rèn tự học, cá thể kết hợp hợp tác, kết hợp đánh giá.",
                            tasks: "Đọc tài liệu và làm bài tập tải lên hệ thống LMS.",
                            materials: "Tài liệu đọc",
                            assessment: "Hoàn thành bài tập tải lên hệ thống"
                        },
                        {
                            id: "act_a11_2",
                            code: "Buổi 1 - Sáng - HĐ 2",
                            name: "Tìm hiểu cơ sở tâm lý học giáo dục, giáo dục học của kỹ thuật dạy học tích cực ở trường phổ thông",
                            mode: "online",
                            target: "Trình bày được cơ sở tâm lý học giáo dục, giáo dục học của kỹ thuật dạy học tích cực.",
                            tasks: "Đọc tài liệu và làm bài tập tải lên hệ thống.",
                            materials: "Tài liệu đọc",
                            assessment: "Hoàn thành bài tập tải lên hệ thống"
                        },
                        {
                            id: "act_a11_3",
                            code: "Buổi 1 - Sáng - HĐ 3",
                            name: "Tìm hiểu sự cần thiết của việc vận dụng các kỹ thuật dạy học tích cực",
                            mode: "online",
                            target: "Nêu được sự cần thiết của việc vận dụng các kỹ thuật dạy học tích cực.",
                            tasks: "Đọc tài liệu và làm bài tập tải lên hệ thống LMS.",
                            materials: "Tài liệu đọc",
                            assessment: "Hoàn thành bài tập tải lên hệ thống"
                        },
                        {
                            id: "act_a11_4",
                            code: "Buổi 1 - Sáng - HĐ 4",
                            name: "Tìm hiểu đặc điểm của kỹ thuật tổ chức hoạt động cá nhân",
                            mode: "online",
                            target: "Trình bày được đặc điểm của một số kỹ thuật tổ chức hoạt động cá nhân: các bước tiến hành, ưu điểm, hạn chế.",
                            tasks: "Đọc tài liệu và làm bài tập tải lên hệ thống.",
                            materials: "Tài liệu đọc",
                            assessment: "Hoàn thành bài tập tải lên hệ thống"
                        },
                        {
                            id: "act_a11_5",
                            code: "Buổi 2 - Chiều - HĐ 5",
                            name: "Tìm hiểu đặc điểm của kỹ thuật tổ chức hoạt động nhóm",
                            mode: "online",
                            target: "Trình bày được đặc điểm của một số kỹ thuật tổ chức hoạt động nhóm: các bước tiến hành, ưu điểm, hạn chế.",
                            tasks: "Đọc tài liệu và làm bài tập tải lên hệ thống.",
                            materials: "Tài liệu đọc",
                            assessment: "Hoàn thành bài tập tải lên hệ thống"
                        },
                        {
                            id: "act_a11_6",
                            code: "Buổi 2 - Chiều - HĐ 6",
                            name: "Tìm hiểu đặc điểm của kỹ thuật lấy thông tin phản hồi",
                            mode: "online",
                            target: "Trình bày được đặc điểm của một số kỹ thuật lấy thông tin phản hồi: các bước tiến hành, ưu điểm, hạn chế.",
                            tasks: "Đọc tài liệu và làm bài tập; Nêu câu hỏi, thắc mắc ghi lại để đề nghị GV hỗ trợ giải đáp khi dạy trực tiếp.",
                            materials: "Tài liệu đọc",
                            assessment: "Hoàn thành bài tập tải lên hệ thống"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (40 tiết / 4 ngày)",
                    activities: [
                        {
                            id: "act_a11_d2_s",
                            code: "Buổi 1 - Ngày 2 (Sáng)",
                            name: "Giới thiệu bồi dưỡng & Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Tổ chức lớp học, thống nhất yêu cầu và giải đáp các khó khăn của giai đoạn trực tuyến.",
                            tasks: "Giới thiệu thành phần tham dự, báo cáo viên, chương trình; Tổ chức lớp: chia nhóm, phát kế hoạch và dụng cụ học tập; Giới thiệu kế hoạch bồi dưỡng, hình thức kiểm tra đánh giá, tài liệu tham khảo; Thảo luận nhóm báo cáo kết quả tự học trực tuyến; GV giải đáp thắc mắc.",
                            materials: "Kế hoạch bồi dưỡng, dụng cụ học tập, tài nguyên học phần",
                            assessment: "Hoàn thành ổn định nhóm và thống nhất kế hoạch thực hành"
                        },
                        {
                            id: "act_a11_d2_c",
                            code: "Buổi 2 - Ngày 2 (Chiều)",
                            name: "Hoạt động 1: Phân tích, đánh giá một số kỹ thuật tổ chức hoạt động cá nhân",
                            mode: "in_person",
                            target: "Thực hành phân tích các bước thực hiện, ưu điểm, hạn chế của kỹ thuật cá nhân (5W1H, 321, động não, cầm tay chỉ việc); nêu khó khăn và giải pháp.",
                            tasks: "Học viên thực hiện nhiệm vụ cá nhân (giấy A4), thảo luận nhóm (giấy A0); Mỗi nhóm cử đại diện 2 học viên trình bày tối đa 15 phút.",
                            materials: "Tài liệu đọc, PPT hướng dẫn, giấy A4, giấy A0",
                            assessment: "Tham gia đầy đủ, nhiệt tình, báo cáo sản phẩm cá nhân A4 và nhóm A0"
                        },
                        {
                            id: "act_a11_d3",
                            code: "Buổi 1+2 - Ngày 3 (Sáng, Chiều)",
                            name: "Hoạt động 2: Phân tích, đánh giá một số kỹ thuật tổ chức hoạt động nhóm",
                            mode: "in_person",
                            target: "Thực hành phân tích các bước thực hiện, ưu điểm, hạn chế kỹ thuật nhóm (khăn trải bàn, mảnh ghép, bể cá, ổ bi, XYZ, phòng tranh...); nêu khó khăn và giải pháp.",
                            tasks: "Thảo luận nhóm trên giấy A0; Báo cáo sản phẩm; Mỗi nhóm cử đại diện 2 HV trình bày trong thời gian tối đa 15 phút.",
                            materials: "Tài liệu đọc, PPT hướng dẫn, giấy A0",
                            assessment: "Tham gia hoạt động đầy đủ, nhiệt tình, báo cáo sản phẩm nhóm giấy A0"
                        },
                        {
                            id: "act_a11_d4_s",
                            code: "Buổi 1 - Ngày 4 (Sáng)",
                            name: "Hoạt động 3: Phân tích, đánh giá một số kỹ thuật lấy thông tin phản hồi",
                            mode: "in_person",
                            target: "Thực hành phân tích các bước thực hiện, ưu điểm, hạn chế của kỹ thuật phản hồi (3 lần 3, khảo sát, KWLH); nêu khó khăn và đề xuất giải pháp.",
                            tasks: "Hoạt động cá nhân trên giấy A4; Thảo luận nhóm trên giấy A0; Báo cáo sản phẩm nhóm tối đa 15 phút.",
                            materials: "Tài liệu đọc, PPT hướng dẫn, giấy A4, giấy A0",
                            assessment: "Hoạt động cá nhân A4, sản phẩm nhóm A0 và phần thuyết trình"
                        },
                        {
                            id: "act_a11_d4_c",
                            code: "Buổi 2 - Ngày 4 (Chiều)",
                            name: "Hoạt động 4: Thực hành vận dụng kỹ thuật tổ chức HĐ cá nhân và phản hồi trong dạy học",
                            mode: "in_person",
                            target: "Thực hành minh họa được việc vận dụng kỹ thuật tổ chức hoạt động cá nhân và lấy thông tin phản hồi trong dạy học môn học/hoạt động giáo dục.",
                            tasks: "Thực hiện nhiệm vụ cá nhân (giấy A4), thảo luận nhóm (giấy A0); Xây dựng bài dạy minh họa; Mỗi nhóm cử đại diện 2 HV trình bày tối đa 15 phút.",
                            materials: "Tài liệu đọc, PPT hướng dẫn, SGK, chương trình môn học / hoạt động giáo dục",
                            assessment: "Tham gia đầy đủ, nhiệt tình, báo cáo sản phẩm cá nhân A4 và nhóm A0"
                        },
                        {
                            id: "act_a11_d5_s",
                            code: "Buổi 1 - Ngày 5 (Sáng)",
                            name: "Hoạt động 5: Thực hành vận dụng kỹ thuật tổ chức hoạt động nhóm trong dạy học môn học",
                            mode: "in_person",
                            target: "Thực hành minh họa được việc vận dụng kỹ thuật tổ chức hoạt động nhóm trong dạy học môn học/hoạt động giáo dục.",
                            tasks: "Thảo luận nhóm trên giấy A0; Mỗi nhóm cử đại diện 2 HV trình bày bài dạy nhóm trong thời gian tối đa 15 phút.",
                            materials: "Tài liệu đọc, PPT hướng dẫn, SGK, chương trình môn học / hoạt động giáo dục",
                            assessment: "Tham gia đầy đủ, nhiệt tình, báo cáo sản phẩm nhóm giấy A0"
                        },
                        {
                            id: "act_a11_d5_c",
                            code: "Buổi 2 - Ngày 5 (Chiều)",
                            name: "Hoạt động 6: Thực hành các kỹ thuật dạy học tích cực trong môi trường lớp học giả định",
                            mode: "in_person",
                            target: "Thực hành lựa chọn và sử dụng phối hợp các kỹ thuật dạy học tích cực trong môi trường lớp học giả định.",
                            tasks: "Thực hiện nhiệm vụ cá nhân/nhóm, thảo luận, chia sẻ; Mỗi nhóm cử đại diện thực hành dạy học có sử dụng kỹ thuật dạy học tích cực trong môi trường lớp học giả định.",
                            materials: "Tài liệu đọc, PPT hướng dẫn, SGK, chương trình môn học / hoạt động giáo dục",
                            assessment: "Đánh giá tiết thực hành giảng dạy lớp học giả định và tinh thần hợp tác nhóm"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Bài tập trực tuyến đã hoàn thành và nộp lên hệ thống LMS"
                ],
                inPerson: [
                    "Sản phẩm thảo luận nhóm sau mỗi hoạt động (Giấy A0, bài tập cá nhân A4)",
                    "Kế hoạch dạy học môn học/hoạt động giáo dục có sử dụng kỹ thuật dạy học tích cực",
                    "Thực hành dạy học có sử dụng kỹ thuật dạy học tích cực trong môi trường lớp học giả định"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: Giảng viên chấm điểm hoạt động bồi dưỡng trực tiếp", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Viết tiểu luận",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm. Điều kiện: HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Bắt buộc hoàn thành cả 2 bài điều kiện để đủ tiêu chuẩn tham dự đánh giá cuối học phần."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Bộ Giáo dục và Đào tạo, Chương trình ETEP (2020). Sử dụng phương pháp dạy học, giáo dục phát triển phẩm chất, năng lực học sinh trung học. Trường ĐHSP TPHCM.",
                "[2] Huỳnh Văn Sơn, Nguyễn Kim Hồng, Nguyễn Thị Diễm My (2016). Phương pháp dạy học phát triển năng lực học sinh phổ thông. NXB ĐHSP TPHCM."
            ]
        },
        grades: { attendance: 9.5, midterm: 9.0, final: 9.2 }
    },

    // ---------------------------------------------------------------------
    // 13. MÃ HỌC PHẦN: A14 - TỔ CHỨC HOẠT ĐỘNG GIÁO DỤC STEM Ở TRƯỜNG PHỔ THÔNG
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a14",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A14",
        name: "Tổ chức hoạt động giáo dục STEM ở trường phổ thông",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học + B1 (Phương pháp dạy học môn Toán/Vật lý/Hóa học/Sinh học/CNTT)",
        instructor: "ThS. Vũ Đình Chuẩn",
        instructorEmail: "chuanvd@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "15/07/2021",
            authorTeam: [
                "Tập thể Giảng viên Ban Đào tạo & Bồi dưỡng Giáo viên STEM (HCMUE)",
                "TS. Nguyễn Thị Thu Trang (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)"
            ],
            approver: "TS. Nguyễn Thị Thu Trang (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "ThS. Vũ Đình Chuẩn",
            instructorEmail: "chuanvd@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học + B1 (Phương pháp dạy học môn Toán/Vật lý/Hóa học/Sinh học/CNTT)",
            hoursBreakdown: {
                total: 50,
                theory: 10,
                practice: 40,
                inPerson: 40,
                online: 10
            },
            description: "Học phần hỗ trợ học viên hiểu và trình bày được các vấn đề của giáo dục STEM; phân tích được các tiêu chí và quy trình chuẩn xây dựng chủ đề giáo dục STEM theo Công văn 3089/BGDĐT-GDTrH; thiết kế và tổ chức được chủ đề giáo dục STEM cho học sinh THCS/THPT.",
            objectives: [
                { code: "1", text: "Hiểu và trình bày được các vấn đề của giáo dục STEM." },
                { code: "2", text: "Phân tích được các tiêu chí và quy trình xây dựng chủ đề giáo dục STEM cho học sinh THCS/THPT." },
                { code: "3", text: "Thiết kế được chủ đề giáo dục STEM cho học sinh THCS/THPT." }
            ],
            clos: [
                "Hiểu và trình bày được bản chất, vai trò, ý nghĩa và các hình thức tổ chức giáo dục STEM trong chương trình giáo dục phổ thông.",
                "Phân tích chuyên sâu 5 tiêu chí của một bài học STEM và quy trình 4 bước xây dựng chủ đề giáo dục STEM chuẩn theo Công văn 3089/BGDĐT-GDTrH.",
                "Thiết kế hoàn chỉnh kế hoạch bài dạy STEM và tiêu chí sản phẩm theo môn học chính gắn với giải quyết vấn đề thực tiễn.",
                "Tổ chức thử nghiệm thành công hoạt động trải nghiệm STEM, chế tạo sản phẩm mô hình và đánh giá phẩm chất, năng lực học sinh."
            ],
            contentOutline: [
                {
                    title: "Chương 1. KHÁI QUÁT VỀ GIÁO DỤC STEM",
                    items: [
                        "2.1. Giới thiệu khái niệm: Khái niệm STEM và Khái niệm giáo dục STEM",
                        "2.2. Vai trò, ý nghĩa của giáo dục STEM trong chương trình giáo dục phổ thông",
                        "2.3. Các hình thức tổ chức giáo dục STEM trong nhà trường phổ thông: Dạy học các môn khoa học theo bài học STEM; Tổ chức hoạt động trải nghiệm STEM; Tổ chức hoạt động nghiên cứu khoa học, kĩ thuật",
                        "2.4. Điều kiện triển khai giáo dục STEM: Cơ sở vật chất trong thực hiện giáo dục STEM ở trường phổ thông; Vai trò của các cấp quản lí đối với giáo dục STEM"
                    ],
                    discussion: "Phân biệt dạy học môn khoa học theo bài học STEM với hoạt động trải nghiệm STEM và NCKH kỹ thuật."
                },
                {
                    title: "Chương 2. XÂY DỰNG CHỦ ĐỀ STEM",
                    items: [
                        "2.1. Tiêu chí xây dựng chủ đề giáo dục STEM",
                        "2.2. Tiêu chí đánh giá tiến trình dạy học chủ đề STEM",
                        "2.3. Quy trình xây dựng chủ đề giáo dục STEM: Lựa chọn chủ đề giáo dục STEM; Xác định vấn đề cần giải quyết; Xây dựng tiêu chí đối với giải pháp giải quyết vấn đề, sản phẩm cần chế tạo; Thiết kế tiến trình tổ chức hoạt động dạy học chủ đề STEM",
                        "2.4. Đánh giá trong giáo dục STEM: Nguyên tắc đánh giá; Các yêu cầu đánh giá; Định hướng về phương pháp và công cụ đánh giá"
                    ],
                    discussion: "Mối liên hệ giữa tiêu chí đánh giá sản phẩm STEM với việc hình thành kiến thức nền tảng của môn học."
                },
                {
                    title: "Chương 3. MỘT SỐ CHỦ ĐỀ STEM THAM KHẢO",
                    items: [
                        "Chủ đề: THIẾT KẾ HỆ THỐNG BÁO ĐỘNG KHI MỞ CỬA",
                        "Chủ đề: BÌNH CHỮA CHÁY MINI",
                        "Chủ đề: HỆ THỐNG HỖ TRỢ QUANG HỢP CHO CÂY RONG ĐUÔI CHÓ",
                        "Chủ đề: ĐÈN NGỦ TIẾT KIỆM ĐIỆN TÍCH HỢP SẠC ĐIỆN THOẠI",
                        "Chủ đề: BỘ DỤNG CỤ HỌC HÌNH HỌC CHO NGƯỜI KHIẾM THỊ",
                        "Chủ đề: GẬY THÔNG MINH HỖ TRỢ NGƯỜI KHIẾM THỊ"
                    ],
                    discussion: "Phân tích tính khả thi và cách lựa chọn nguyên vật liệu tái chế, sẵn có trong triển khai chủ đề STEM tại địa phương."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (10 tiết)",
                    activities: [
                        {
                            id: "act_a14_on_1",
                            code: "HĐ 1 (Trực tuyến)",
                            name: "Khởi động với công văn 3089",
                            mode: "online",
                            target: "Nhận biết được tổng quan về hình thức, nội dung của giáo dục STEM trong trường trung học.",
                            tasks: "Đọc tài liệu về công văn 3089: về Triển khai thực hiện giáo dục STEM trong giáo dục trung học; Trả lời 10 câu hỏi đi kèm.",
                            materials: "Công văn số 3089/BGDĐT-GDTrH của Bộ Giáo dục và Đào tạo",
                            assessment: "Học viên được xem là hoàn thành nhiệm vụ nếu trả lời đúng 70% số câu hỏi"
                        },
                        {
                            id: "act_a14_on_2",
                            code: "HĐ 2 (Trực tuyến)",
                            name: "Tìm hiểu khái quát về giáo dục STEM",
                            mode: "online",
                            target: "Hiểu được vai trò, ý nghĩa của giáo dục STEM trong chương trình giáo dục phổ thông; Hiểu được phân biệt được các cách lồng ghép giáo dục STEM trong các môn học; Hướng dẫn học sinh nghiên cứu khoa học - kỹ thuật; Mô tả, phân tích được các điều kiện triển khai giáo dục STEM.",
                            tasks: "Xem video chủ đề giáo dục STEM minh họa (cung cấp trên LMS); Đọc tài liệu từ trang 35 đến trang 49; Trả lời các câu hỏi từ câu 11 đến câu 15; Gửi câu hỏi, thắc mắc lên hệ thống LMS cần GV hỗ trợ giải đáp.",
                            materials: "Video bài giảng LMS, tài liệu đọc chuyên đề STEM (trang 35-49)",
                            assessment: "Học viên được xem là hoàn thành nhiệm vụ nếu trả lời đúng 60% số câu hỏi"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (40 tiết)",
                    activities: [
                        {
                            id: "act_a14_ip_intro",
                            code: "Khai mạc & Phần 1 (Trực tiếp)",
                            name: "Giới thiệu chương trình & Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Giới thiệu thành phần, chương trình; chia nhóm, thống nhất kế hoạch và giải đáp vướng mắc học trực tuyến.",
                            tasks: "Giới thiệu thành phần tham dự, báo cáo viên, chương trình bồi dưỡng; Tổ chức lớp: chia nhóm, phát tài liệu, kế hoạch và dụng cụ học tập; Giới thiệu kế hoạch bồi dưỡng: mục tiêu, thời gian, nội dung, hình thức kiểm tra đánh giá; Chia sẻ tài nguyên Classroom; Trao đổi nhận xét học trực tuyến; GV giải đáp thắc mắc.",
                            materials: "Tài liệu học tập, kế hoạch bồi dưỡng, hệ thống Classroom",
                            assessment: "Ổn định phân chia nhóm học tập và tiếp thu định hướng thực hành"
                        },
                        {
                            id: "act_a14_ip_1",
                            code: "HĐ 1 (Trực tiếp)",
                            name: "Thực hành trải nghiệm STEM (Chế tạo chiếc cầu giấy)",
                            mode: "in_person",
                            target: "Nhận biết được 4 thành tố S,T,E,M và vai trò của mỗi thành tố này trong quá trình làm sản phẩm STEM và vì sao nó quyết định sự thành công của sản phẩm STEM; Nhận biết mối liên hệ giữa tiêu chí của sản phẩm STEM với kiến thức, kĩ năng nhắm đến trong chủ đề STEM.",
                            tasks: "Thực hành theo nhóm: Làm chiếc cầu giấy; Phân tích 4 thành tố S,T,E,M; Phân tích tiêu chí sản phẩm.",
                            materials: "Giấy bìa size A4",
                            assessment: "Học viên tham gia hoạt động đầy đủ, nhiệt tình, hoàn thành sản phẩm"
                        },
                        {
                            id: "act_a14_ip_2",
                            code: "HĐ 2 (Trực tiếp)",
                            name: "Tiêu chí xây dựng chủ đề giáo dục STEM",
                            mode: "in_person",
                            target: "Biết và phân tích được: Các tiêu chí của một chủ đề STEM, Cấu trúc chủ đề STEM, Phương pháp tổ chức, Hình thức tổ chức, Tiến trình tổ chức chủ đề giáo dục STEM.",
                            tasks: "Nghe báo cáo, ghi chép, phân tích tình huống, thảo luận đặt câu hỏi; Vẽ sơ đồ tư duy về chủ đề STEM theo 5 vấn đề sau: Tiêu chí - Cấu trúc - Phương pháp tổ chức - Hình thức tổ chức - Tiến trình tổ chức.",
                            materials: "Tài liệu đọc chuyên khảo, giấy A0, bút dạ",
                            assessment: "Học viên tham gia hoạt động đầy đủ, nhiệt tình, hoàn thành sản phẩm sơ đồ tư duy, báo cáo chia sẻ trước lớp"
                        },
                        {
                            id: "act_a14_ip_3",
                            code: "HĐ 3 (Trực tiếp)",
                            name: "Phân tích một chủ đề giáo dục STEM minh họa & Thực hành thiết kế",
                            mode: "in_person",
                            target: "Phân tích được: Lựa chọn chủ đề STEM; xác định vấn đề cần giải quyết; Xây dựng tiêu chí đối với giải pháp giải quyết vấn đề, sản phẩm cần chế tạo; Thiết kế tiến trình tổ chức hoạt động dạy học chủ đề; Thực hành thiết kế chủ đề giáo dục STEM.",
                            tasks: "Mỗi nhóm phân tích một chủ đề STEM (Bài học/Hoạt động trải nghiệm STEM theo môn học chính); Trình bày thành file (theo công văn 3089): Kiến thức chủ đạo, Kiến thức liên môn STEM, Tiêu chí sản phẩm và mối liên hệ với kiến thức nhắm đến, Bản thiết kế, Sản phẩm (quy trình/mô hình,...); Góp ý cho nhóm trình bày và thảo luận đặt câu hỏi.",
                            materials: "Tài liệu đọc, mẫu kế hoạch bài dạy STEM theo Công văn 3089",
                            assessment: "Học viên tham gia hoạt động đầy đủ, hoàn thành sản phẩm chủ đề STEM, báo cáo chia sẻ trước lớp; nộp file A14.TenNhom.doc"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Trả lời 15 câu hỏi trắc nghiệm trên hệ thống LMS"
                ],
                inPerson: [
                    "Sản phẩm thực hành của hoạt động 1 (chiếc cầu giấy)",
                    "Sơ đồ tư duy 5 vấn đề tổ chức chủ đề STEM (Hoạt động 2)",
                    "Sản phẩm bài tập của hoạt động 3: nộp file theo tên A14.TenNhom.doc (có danh sách thành viên trong nhóm và kèm email của mọi thành viên)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống (Hoạt động 1 và 2)", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: GV chấm điểm hoạt động bồi dưỡng trực tiếp (Hoạt động 1)", weight: 25, condition: "HV đạt điều kiện nếu đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Bài kiểm tra, thu hoạch, sản phẩm thực hành (Hoạt động 3)",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm. Điều kiện: HV thực hiện trên 75% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Bắt buộc hoàn thành 2 bài điều kiện và nộp file thiết kế chủ đề A14.TenNhom.doc."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Bộ Giáo dục và Đào tạo (2020). Công văn số 3089/BGDĐT-GDTrH ngày 14/8/2020 về việc Triển khai thực hiện giáo dục STEM trong giáo dục trung học.",
                "[2] Bộ Giáo dục và Đào tạo (2018). Chương trình giáo dục phổ thông - Chương trình tổng thể (Ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT).",
                "[3] Nguyễn Thanh Nga, Hoàng Phước Muội (2017). Thiết kế và tổ chức chủ đề STEM cho học sinh trung học cơ sở và trung học phổ thông. NXB Đại học Sư phạm TP.HCM.",
                "[4] Nguyễn Văn Biên, Tưởng Duy Hải (2019). Giáo dục STEM trong nhà trường phổ thông. NXB Giáo dục Việt Nam.",
                "[5] Tài liệu hướng dẫn bồi dưỡng giáo viên môn Khoa học tự nhiên, Toán, Công nghệ, Tin học về giáo dục STEM. Trường Đại học Sư phạm TP.HCM (2021)."
            ]
        },
        grades: { attendance: 9.2, midterm: 8.8, final: 9.0 }
    },

    // ---------------------------------------------------------------------
    // 14. MÃ HỌC PHẦN: A15 - GIÁO DỤC GIÁ TRỊ SỐNG VÀ KỸ NĂNG SỐNG
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a15",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A15",
        name: "Giáo dục giá trị sống và kỹ năng sống",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học",
        instructor: "ThS. Nguyễn Văn Hiến",
        instructorEmail: "hiennv@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "25/05/2021",
            authorTeam: [
                "ThS. Nguyễn Văn Hiến (Đồng tác giả biên soạn đề cương)",
                "TS. Dư Thống Nhất (Đồng tác giả biên soạn đề cương)"
            ],
            approver: "TS. Dư Thống Nhất (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "ThS. Nguyễn Văn Hiến",
            instructorEmail: "hiennv@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học",
            hoursBreakdown: {
                total: 50,
                theory: 10,
                practice: 40,
                inPerson: 35,
                online: 15
            },
            description: "Học phần trang bị cho học viên hệ thống lý luận và thực tiễn về giáo dục giá trị sống và kỹ năng sống cho học sinh; phân tích hình thức, phương pháp và kiểm tra - đánh giá; quy trình thiết kế và thực hành xây dựng kế hoạch giáo dục theo chủ đề cho học sinh phổ thông.",
            objectives: [
                { code: "1", text: "Trình bày được khái niệm, ý nghĩa, mục tiêu, nội dung của giáo dục giá trị sống và kỹ năng sống cho học sinh." },
                { code: "2", text: "Phân tích được hình thức và phương pháp giáo dục, kiểm tra - đánh giá trong giáo dục giá trị sống và kỹ năng sống cho học sinh." },
                { code: "3", text: "Xây dựng được kế hoạch giáo dục giá trị sống và kỹ năng sống cho học sinh." }
            ],
            clos: [
                "Trình bày chuẩn xác khái niệm, ý nghĩa, nguyên tắc cốt lõi của giáo dục giá trị sống và kỹ năng sống; phân tích 14 giá trị sống và 3 nhóm kỹ năng sống cơ bản cho học sinh phổ thông.",
                "Phân tích và lựa chọn linh hoạt các hình thức tích hợp, chủ đề chuyên biệt và phương pháp tương tác giáo dục (đàm thoại, thảo luận nhóm, đóng vai, giải quyết tình huống, trò chơi, dự án).",
                "Vận dụng quy trình 5 bước để thiết kế kế hoạch giáo dục giá trị sống và kỹ năng sống theo chủ đề đáp ứng yêu cầu cần đạt của CT GDPT 2018.",
                "Tổ chức thành thạo các hoạt động giáo dục trên lớp và đánh giá kết quả rèn luyện của học sinh theo rubric sư phạm."
            ],
            contentOutline: [
                {
                    title: "Chương 1. Khái quát chung về giáo dục giá trị sống và kỹ năng sống cho học sinh",
                    items: [
                        "1.1. Khái niệm về giáo dục giá trị sống, giáo dục kỹ năng sống (Khái niệm giá trị sống và giáo dục giá trị sống; Khái niệm kỹ năng sống và giáo dục kỹ năng sống)",
                        "1.2. Ý nghĩa của giáo dục giá trị sống và kỹ năng sống cho học sinh (Ý nghĩa giáo dục giá trị sống; Ý nghĩa giáo dục kỹ năng sống)",
                        "1.3. Nguyên tắc giáo dục giá trị sống và kỹ năng sống cho học sinh: Đảm bảo sự tác động toàn vẹn ba mặt nhận thức, tình cảm, hành vi; Đảm bảo tính trải nghiệm trong các hoạt động giáo dục; Đảm bảo tính thường xuyên, liên tục trong tác động; Đảm bảo tính hệ thống trong tác động; Đảm bảo sự gắn kết giữa giá trị sống và kỹ năng sống"
                    ],
                    discussion: "Mối quan hệ biện chứng giữa 'Giá trị sống' (chuẩn mực bên trong) và 'Kỹ năng sống' (hành vi thể hiện bên ngoài)."
                },
                {
                    title: "Chương 2. Tổ chức hoạt động giáo dục giá trị sống và kỹ năng sống cho học sinh",
                    items: [
                        "2.1. Mục tiêu giáo dục giá trị sống và kỹ năng sống cho học sinh (Mục tiêu giáo dục giá trị sống; Mục tiêu giáo dục kỹ năng sống)",
                        "2.2. Nội dung giáo dục giá trị sống và kỹ năng sống cho học sinh: 14 Giá trị sống (Yêu nước, Hòa bình, Tôn trọng, Trách nhiệm, Hợp tác, Đoàn kết, Khoan dung, Yêu thương, Tự do, Giản dị, Trung thực, Hạnh phúc, Khiêm tốn, Chăm chỉ); 3 Nhóm kỹ năng sống (Nhóm quan hệ với bản thân; Nhóm quan hệ với người khác; Nhóm quan hệ với công việc)",
                        "2.3. Các hình thức giáo dục: Tích hợp trong các hoạt động giáo dục của nhà trường; Giáo dục qua các chủ đề chuyên biệt",
                        "2.4. Phương pháp giáo dục: Đàm thoại; Thảo luận nhóm; Đóng vai; Giải quyết tình huống; Trò chơi; Kể chuyện; Giáo dục theo dự án",
                        "2.5. Đánh giá kết quả giáo dục giá trị sống và kỹ năng sống cho học sinh"
                    ],
                    discussion: "Lựa chọn và phối hợp các phương pháp giáo dục tích cực nhằm phát triển phẩm chất, năng lực học sinh phổ thông."
                },
                {
                    title: "Chương 3. Thực hành xây dựng kế hoạch giáo dục giá trị sống và kỹ năng sống cho học sinh",
                    items: [
                        "3.1. Quy trình xây dựng kế hoạch giáo dục giá trị sống và kỹ năng sống cho học sinh theo chủ đề: 3.1. Lựa chọn chủ đề; 3.2. Xác định mục tiêu của chủ đề; 3.3. Xác định nội dung, hình thức, phương pháp tổ chức; 3.4. Thiết kế tiến trình hoạt động; 3.5. Hoàn thiện kế hoạch",
                        "3.2. Thực hành xây dựng kế hoạch giáo dục"
                    ],
                    discussion: "Quy trình thiết kế và tiêu chí rubric đánh giá kế hoạch giáo dục giá trị sống và kỹ năng sống theo chủ đề."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (15 tiết / 9 Hoạt động)",
                    activities: [
                        {
                            id: "act_a15_on_1",
                            code: "HĐ 1 (Trực tuyến)",
                            name: "Làm quen",
                            mode: "online",
                            target: "Trình bày được những thông tin cơ bản về học phần.",
                            tasks: "Đọc các hướng dẫn tham gia học phần trong lớp học trực tuyến; Xem video giới thiệu học phần, đề cương chi tiết học phần.",
                            materials: "Video giới thiệu học phần, đề cương chi tiết học phần",
                            assessment: "Không đánh giá điểm số"
                        },
                        {
                            id: "act_a15_on_2",
                            code: "HĐ 2 (Trực tuyến)",
                            name: "Kết nối",
                            mode: "online",
                            target: "Nêu được khái niệm giá trị sống, giáo dục giá trị sống; Phân tích được ý nghĩa của giáo dục giá trị sống cho học sinh.",
                            tasks: "Nghiên cứu video và trả lời các câu hỏi bên dưới video; Đọc tài liệu text về khái niệm và ý nghĩa của giáo dục giá trị sống.",
                            materials: "Video và tài liệu text về khái niệm và ý nghĩa của giáo dục giá trị sống",
                            assessment: "Hoàn thành việc trả lời các câu hỏi"
                        },
                        {
                            id: "act_a15_on_3",
                            code: "HĐ 3 (Trực tuyến)",
                            name: "Nghiên cứu",
                            mode: "online",
                            target: "Nêu được khái niệm kỹ năng sống, giáo dục kỹ năng sống; Phân tích được ý nghĩa của giáo dục kỹ năng sống cho học sinh.",
                            tasks: "Nghiên cứu tình huống và trả lời các câu hỏi bên dưới tình huống; Đọc tài liệu text về khái niệm kỹ năng sống, giáo dục kỹ năng sống và ý nghĩa của giáo dục kỹ năng sống.",
                            materials: "Tình huống và tài liệu text về khái niệm kỹ năng sống, giáo dục kỹ năng sống và ý nghĩa của giáo dục kỹ năng sống",
                            assessment: "Hoàn thành việc trả lời các câu hỏi"
                        },
                        {
                            id: "act_a15_on_4",
                            code: "HĐ 4 (Trực tuyến)",
                            name: "Suy ngẫm",
                            mode: "online",
                            target: "Làm rõ nguyên tắc giáo dục giá trị sống và kỹ năng sống cho học sinh.",
                            tasks: "Chia sẻ ý kiến của mình dưới dạng bình luận (30 - 50 từ): Theo anh/chị khi giáo dục những nội dung này cho học sinh phổ thông, nhà giáo dục cần lưu ý điều gì?; Nghiên cứu tài liệu text về các nguyên tắc.",
                            materials: "Tài liệu text về các nguyên tắc giáo dục giá trị sống và kỹ năng sống cho học sinh",
                            assessment: "Hoàn thành việc chia sẻ ý kiến cá nhân (30- 50 từ) lên lớp học MS Teams"
                        },
                        {
                            id: "act_a15_on_5",
                            code: "HĐ 5 (Trực tuyến)",
                            name: "Lượng giá chương 1",
                            mode: "online",
                            target: "Nêu được những điểm lí luận quan trọng của chương 1.",
                            tasks: "Trả lời 5 câu hỏi trắc nghiệm về nội dung chương 1; Gởi các câu hỏi mà bản thân còn băn khoăn.",
                            materials: "5 câu hỏi trắc nghiệm về nội dung chương 1",
                            assessment: "Hoàn thành bài tập trắc nghiệm"
                        },
                        {
                            id: "act_a15_on_6",
                            code: "HĐ 6 (Trực tuyến)",
                            name: "Chia sẻ",
                            mode: "online",
                            target: "Làm rõ mục tiêu giáo dục giá trị sống và kỹ năng sống cho học sinh.",
                            tasks: "Chia sẻ ý kiến của mình dưới dạng bình luận (30- 50 từ): Theo anh/chị, giáo dục giá trị sống và kỹ năng sống cho học sinh phổ thông cần phải hướng tới những mục tiêu nào? Vì sao?; Nghiên cứu tài liệu text về mục tiêu.",
                            materials: "Tài liệu text về mục tiêu giáo dục giá trị sống và kỹ năng sống cho học sinh",
                            assessment: "Hoàn thành việc chia sẻ ý kiến cá nhân (30-50 từ) lên lớp học MS Teams"
                        },
                        {
                            id: "act_a15_on_7",
                            code: "HĐ 7 (Trực tuyến)",
                            name: "Xây dựng nội dung",
                            mode: "online",
                            target: "Xác định các giá trị sống và kỹ năng sống cần giáo dục cho học sinh phổ thông.",
                            tasks: "Yêu cầu 1: Hoàn thành bài tập xác định 10 giá trị sống cần giáo dục cho học sinh phổ thông (tên, ý nghĩa, nội dung thành phần); Yêu cầu 2: Hoàn thành bài tập xác định 10 kỹ năng sống cần giáo dục cho học sinh phổ thông; Nghiên cứu tài liệu text.",
                            materials: "Tài liệu text về nội dung giáo dục giá trị sống và kỹ năng sống cho học sinh",
                            assessment: "Hoàn thành bài tập (gởi lên lớp học MS Teams)"
                        },
                        {
                            id: "act_a15_on_8",
                            code: "HĐ 8 (Trực tuyến)",
                            name: "Tìm hiểu phương thức",
                            mode: "online",
                            target: "Phân tích được các hình thức, phương pháp, kiểm tra - đánh giá trong giáo dục giá trị sống và kỹ năng sống cho học sinh phổ thông.",
                            tasks: "Hoàn thành bảng phân tích 5 giá trị sống và 5 kỹ năng sống tiêu biểu và viết tên những cách thức có ưu thế trong việc giáo dục nội dung đó; Nghiên cứu tài liệu text.",
                            materials: "Tài liệu text về hình thức, phương pháp, kiểm tra - đánh giá trong giáo dục giá trị sống và kỹ năng sống cho học sinh",
                            assessment: "Hoàn thành bài tập (gởi lên lớp học MS Teams)"
                        },
                        {
                            id: "act_a15_on_9",
                            code: "HĐ 9 (Trực tuyến)",
                            name: "Lượng giá chương 2",
                            mode: "online",
                            target: "Nêu được những điểm lí luận quan trọng của chương 2.",
                            tasks: "Trả lời 10 câu hỏi trắc nghiệm về nội dung chương 2; Gởi các câu hỏi mà bản thân còn băn khoăn.",
                            materials: "10 câu hỏi trắc nghiệm về nội dung chương 2",
                            assessment: "Hoàn thành bài tập trắc nghiệm"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (35 tiết)",
                    activities: [
                        {
                            id: "act_a15_ip_intro",
                            code: "Giới thiệu & Phần 1 (Trực tiếp)",
                            name: "Giới thiệu & Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Nắm vững kế hoạch học tập, mục tiêu, hình thức đánh giá và giải đáp thắc mắc từ quá trình trực tuyến.",
                            tasks: "Giới thiệu về giảng viên; Tổ chức lớp, phát kế hoạch học tập; Giới thiệu kế hoạch học tập: mục tiêu, thời gian, nội dung, hình thức kiểm tra, đánh giá và tài liệu tham khảo; Chia sẻ tài nguyên; Học viên báo cáo kết quả tự học trực tuyến; Giảng viên giải đáp thắc mắc.",
                            materials: "Kế hoạch học tập, tài nguyên học phần",
                            assessment: "Tiếp thu định hướng học phần và phân chia nhóm thực hành"
                        },
                        {
                            id: "act_a15_ip_1",
                            code: "HĐ 1 (Trực tiếp)",
                            name: "Hệ thống kiến thức",
                            mode: "in_person",
                            target: "Phân tích được các vấn đề cơ bản của giáo dục giá trị sống và kỹ năng sống cho học sinh phổ thông (khái niệm, ý nghĩa, nguyên tắc, mục tiêu, nội dung).",
                            tasks: "Làm việc theo nhóm học tập (6 nhóm) để hoàn thành bài tập: Thiết kế sơ đồ tóm tắt các vấn đề cơ bản của giáo dục giá trị sống và kỹ năng sống cho học sinh phổ thông. Lấy ví dụ việc vận dụng các nguyên tắc (3 nhóm tóm tắt về giá trị sống, 3 nhóm tóm tắt về kỹ năng sống); Đại diện nhóm báo cáo; Thảo luận toàn lớp và tổng kết nội dung.",
                            materials: "Tài liệu text, giấy A0, bút màu",
                            assessment: "Báo cáo của nhóm theo yêu cầu"
                        },
                        {
                            id: "act_a15_ip_2",
                            code: "HĐ 2 (Trực tiếp)",
                            name: "Thực hành phương pháp giáo dục",
                            mode: "in_person",
                            target: "Làm rõ được các phương pháp giáo dục giá trị sống và kỹ năng sống cho học sinh phổ thông.",
                            tasks: "Làm việc theo nhóm học tập (7 nhóm) để hoàn thành bài tập: Dựa trên việc nghiên cứu cách thức thực hiện các phương pháp, hãy thiết kế một ví dụ minh họa và tổ chức tại lớp (15 phút). Mỗi nhóm chuẩn bị cho 1 phương pháp; Các nhóm lần lượt thể hiện phần thực hành; Thảo luận toàn lớp; Nghe giảng viên nhận xét, góp ý.",
                            materials: "Tài liệu text, tình huống/kịch bản mô phỏng",
                            assessment: "Sản phẩm thực hành của nhóm theo yêu cầu"
                        },
                        {
                            id: "act_a15_ip_3",
                            code: "HĐ 3 (Trực tiếp)",
                            name: "Thiết kế kế hoạch giáo dục",
                            mode: "in_person",
                            target: "Vận dụng các lí luận về giáo dục giá trị sống và kỹ năng sống để thiết kế kế hoạch giáo dục theo chủ đề cho học sinh phổ thông.",
                            tasks: "Nghe giảng viên thuyết trình về quy trình thiết kế kế hoạch giáo dục giá trị sống và kỹ năng sống theo chủ đề cho học sinh phổ thông; Đặt câu hỏi phản hồi; Làm việc theo 6 nhóm để thực hành thiết kế kế hoạch; Dán sản phẩm của nhóm lên tường tại khu vực thảo luận; Tham quan, nghe giới thiệu sơ bộ sản phẩm nhóm khác; Đại diện các nhóm báo cáo sản phẩm; Đánh giá chéo và phản hồi; Nghe giảng viên nhận xét; Hoàn thiện kế hoạch sau buổi học.",
                            materials: "Tài liệu text, giấy A0, rubric đánh giá kế hoạch",
                            assessment: "Kế hoạch mà các nhóm thiết kế theo rubric đánh giá"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Trả lời 2 bộ câu hỏi trắc nghiệm (HĐ 5, HĐ 9) và 4 bài tự luận (HĐ 4, HĐ 6, HĐ 7, HĐ 8) trên hệ thống MS Teams"
                ],
                inPerson: [
                    "Kế hoạch giáo dục giá trị sống và kỹ năng sống theo chủ đề cho học sinh phổ thông (Sản phẩm Hoạt động 3)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống", weight: 25, condition: "HV đạt điều kiện nếu đạt từ 5 điểm trở lên hoặc hoàn thành từ 50% bài tập trở lên" },
                    { name: "Bài điều kiện 2: GV chấm điểm hoạt động bồi dưỡng trực tiếp", weight: 25, condition: "HV đạt điều kiện nếu đạt từ 5 điểm trở lên" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Bài tập lớn (nộp lại cho GV)",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu đạt từ 5 điểm trở lên. Điều kiện: HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Hoàn thành đầy đủ các bài tập trực tuyến trên MS Teams và sản phẩm kế hoạch chủ đề trực tiếp."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Nguyễn Văn Hiến, Dư Thống Nhất, Đặng Ánh Hồng (2021). Bài giảng học phần giáo dục giá trị sống và kỹ năng sống. Trường Đại học Sư phạm TP.HCM. Lưu hành nội bộ.",
                "[2] Nguyễn Thanh Bình, Lê Thị Thu Hà, Đỗ Khánh Năm, Nguyễn Thị Quỳnh Phương (2017). Giáo trình chuyên đề Giáo dục kĩ năng sống. Hà Nội: Nxb Đại học Sư phạm.",
                "[3] Nguyễn Công Khanh (2019). Phương pháp giáo dục giá trị sống, kĩ năng sống. Hà Nội: Nxb Đại học Sư phạm.",
                "[4] Nguyễn Thị Mỹ Lộc, Đinh Thị Kim Thoa (2010). Giáo dục giá trị và kỹ năng sống cho học sinh phổ thông (tập 1, 2). Tài liệu tập huấn giáo viên. Hà Nội.",
                "[5] VOB - Hội Liên hiệp Phụ nữ Việt Nam (2012). Giáo dục kỹ năng sống cho trẻ vị thành niên. Tài liệu online."
            ]
        },
        grades: { attendance: 9.5, midterm: 9.0, final: 9.2 }
    },

    // ---------------------------------------------------------------------
    // 15. MÃ HỌC PHẦN: A16 - GIÁO DỤC VÌ SỰ PHÁT TRIỂN BỀN VỮNG
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a16",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A16",
        name: "Giáo dục vì sự phát triển bền vững",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học",
        instructor: "ThS. Lê Thị Thu Liễu",
        instructorEmail: "lieultt@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "03/06/2021",
            authorTeam: [
                "ThS. Lê Thị Thu Liễu (Đồng tác giả biên soạn đề cương)",
                "ThS. Nguyễn Văn Hiến (Đồng tác giả biên soạn đề cương)"
            ],
            approver: "TS. Nguyễn Đức Danh (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "ThS. Lê Thị Thu Liễu",
            instructorEmail: "lieultt@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học",
            hoursBreakdown: {
                total: 45,
                theory: 15,
                practice: 30,
                inPerson: 15,
                online: 15
            },
            description: "Học phần giúp học viên nắm vững lý luận và phương pháp giáo dục vì sự phát triển bền vững (ESD); phân tích phương pháp, cách tiếp cận tích hợp liên môn, xuyên môn và dạy học giải quyết vấn đề; thiết kế và tổ chức chủ đề giáo dục vì sự phát triển bền vững trong trường THCS/THPT.",
            objectives: [
                { code: "1", text: "Trình bày được các vấn đề cơ bản về phát triển bền vững và giáo dục vì sự phát triển bền vững." },
                { code: "2", text: "Phân tích được các phương pháp giáo dục vì sự phát triển bền vững cho học sinh THCS, THPT." },
                { code: "3", text: "Xây dựng được các chủ đề giáo dục vì sự phát triển bền vững cho học sinh THCS/THPT." }
            ],
            clos: [
                "Trình bày chuẩn xác khái niệm phát triển bền vững, các thách thức đa tầng (địa phương, quốc gia, toàn cầu), mục tiêu 3 trụ cột (kinh tế, môi trường, văn hóa xã hội), nguyên tắc và lĩnh vực ưu tiên của Việt Nam.",
                "Phân tích chuyên sâu mục tiêu, nội dung và các cách tiếp cận toàn diện/cụ thể của giáo dục vì sự phát triển bền vững (ESD) trên thế giới và tại Việt Nam.",
                "Vận dụng định hướng tiếp cận dạy học tích hợp liên môn, xuyên môn và dạy học phát hiện, giải quyết vấn đề trong CT GDPT 2018 để thiết kế chủ đề ESD.",
                "Xây dựng hoàn chỉnh kế hoạch 01 chủ đề giáo dục vì sự phát triển bền vững trong môn học hoặc hoạt động trải nghiệm, hướng nghiệp và xác định công cụ đánh giá phù hợp."
            ],
            contentOutline: [
                {
                    title: "Phần 1: Phát triển bền vững",
                    items: [
                        "1.1 Những thách thức đối với địa phương, quốc gia, toàn cầu: Khái niệm phát triển bền vững; Những thách thức đối với địa phương; Những thách thức đối với quốc gia; Những thách thức đối với toàn cầu",
                        "1.2 Mục tiêu phát triển bền vững về kinh tế, môi trường và văn hóa xã hội: Mục tiêu kinh tế; Mục tiêu môi trường; Mục tiêu văn hóa xã hội",
                        "1.3 Nguyên tắc phát triển bền vững",
                        "1.4 Các lĩnh vực ưu tiên phát triển bền vững của Việt Nam"
                    ],
                    discussion: "Mối quan hệ biện chứng và thách thức cân bằng giữa tăng trưởng kinh tế, bảo vệ môi trường sinh thái và công bằng xã hội."
                },
                {
                    title: "Phần 2: Mục tiêu, nội dung và tiếp cận giáo dục vì sự phát triển bền vững",
                    items: [
                        "2.1 Mục tiêu giáo dục vì sự phát triển bền vững và ảnh hưởng của GD vì sự PTBV đối với kinh tế, môi trường và văn hóa xã hội: Mục tiêu giáo dục; Ảnh hưởng đối với 3 trụ cột",
                        "2.2 Nội dung giáo dục vì sự phát triển bền vững: Nội dung trên thế giới; Nội dung ở Việt Nam",
                        "2.3 Tiếp cận giáo dục vì sự phát triển bền vững: Cách tiếp cận toàn diện; Các cách tiếp cận cụ thể"
                    ],
                    discussion: "Sự chuyển dịch từ Giáo dục Môi trường truyền thống sang Giáo dục vì sự Phát triển Bền vững (ESD) theo định hướng UNESCO."
                },
                {
                    title: "Phần 3: Giáo dục vì sự phát triển bền vững trong trường THCS/THPT",
                    items: [
                        "3.1 Những vấn đề chung về GD vì sự PTBV trong trường THCS/THPT: Giới thiệu về CT GDPT 2018; Định hướng tích hợp GD vì sự PTBV trong các cấp độ CT; Định hướng tiếp cận dạy học tích hợp liên môn, xuyên môn và phát hiện, giải quyết vấn đề",
                        "3.2 Mục tiêu, nội dung giáo dục vì sự PTBV trong trường THCS/THPT: Mục tiêu giáo dục; Nội dung giáo dục",
                        "3.3 Tổ chức hoạt động giáo dục vì sự phát triển bền vững trong trường THCS/THPT: Xây dựng chủ đề GD vì sự PTBV; Xác định các phương pháp giáo dục; Xác định hình thức, phương pháp đánh giá quá trình và kết quả; Phối hợp các lực lượng tham gia giáo dục"
                    ],
                    discussion: "Kinh nghiệm quốc tế (Thụy Điển, Nhật Bản) và giải pháp xây dựng trường học xanh, trường học sinh thái bền vững tại Việt Nam."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (15 tiết)",
                    activities: [
                        {
                            id: "act_a16_on_intro",
                            code: "Hướng dẫn trực tuyến",
                            name: "Khởi động & Hướng dẫn học trực tuyến",
                            mode: "online",
                            target: "Nắm vững mục tiêu, nội dung học phần, hình thức bồi dưỡng và quy định kiểm tra đánh giá trực tuyến.",
                            tasks: "Giới thiệu mục tiêu, nội dung học phần; Giới thiệu hình thức bồi dưỡng trực tuyến và hướng dẫn cách thức thực hiện; Hướng dẫn thực hiện kiểm tra đánh giá/thực hiện các sản phẩm trực tuyến.",
                            materials: "Tài liệu hướng dẫn trực tuyến, hệ thống LMS",
                            assessment: "Hoàn thành tiếp thu hướng dẫn học phần"
                        },
                        {
                            id: "act_a16_on_1",
                            code: "HĐ 1 (Trực tuyến)",
                            name: "Tìm hiểu về phát triển bền vững",
                            mode: "online",
                            target: "Trình bày được khái niệm về phát triển bền vững và những thách thức đối với địa phương, quốc gia, toàn cầu; Trình bày mục tiêu phát triển bền vững về kinh tế, môi trường và văn hóa xã hội; Phân tích các nguyên tắc phát triển bền vững; Nêu được các lĩnh vực ưu tiên phát triển bền vững của Việt Nam.",
                            tasks: "Học viên nghiên cứu tài liệu để trả lời các câu tự luận/trắc nghiệm ở nội dung 1; Nêu câu hỏi, thắc mắc cần GV hỗ trợ giải đáp khi học trực tiếp.",
                            materials: "Tài liệu đọc: Nội dung 1, Infographic 1 – Nội dung 1, tài liệu tham khảo khác",
                            assessment: "Kết quả trả lời các câu hỏi trắc nghiệm khách quan"
                        },
                        {
                            id: "act_a16_on_2",
                            code: "HĐ 2 (Trực tuyến)",
                            name: "Tìm hiểu về mục tiêu, nội dung và tiếp cận giáo dục vì sự phát triển bền vững",
                            mode: "online",
                            target: "Trình bày được các mục tiêu, nội dung giáo dục vì sự phát triển bền vững; Phân tích được các cách tiếp cận giáo dục vì sự phát triển bền vững.",
                            tasks: "Học viên nghiên cứu tài liệu để trả lời các câu tự luận/trắc nghiệm ở nội dung 2; Nêu câu hỏi, thắc mắc cần GV hỗ trợ giải đáp khi học trực tiếp.",
                            materials: "Tài liệu đọc: Nội dung 2, Infographic 2 – Nội dung 2, tài liệu tham khảo khác",
                            assessment: "Kết quả trả lời các câu hỏi trắc nghiệm khách quan"
                        },
                        {
                            id: "act_a16_on_3",
                            code: "HĐ 3 (Trực tuyến)",
                            name: "Tìm hiểu về giáo dục vì sự phát triển bền vững trong trường THCS/THPT",
                            mode: "online",
                            target: "Trình bày những vấn đề chung về giáo dục vì sự phát triển bền vững trong trường THCS/THPT; Trình bày mục tiêu, nội dung giáo dục vì sự PTBV; Phân tích các khía cạnh về tổ chức hoạt động giáo dục (chủ đề, phương pháp, hình thức đánh giá, phối hợp lực lượng) và cho ví dụ minh họa.",
                            tasks: "Học viên nghiên cứu tài liệu để trả lời các câu tự luận/trắc nghiệm ở nội dung 3; Nêu câu hỏi, thắc mắc cần GV hỗ trợ giải đáp khi học trực tiếp.",
                            materials: "Tài liệu đọc: Nội dung 3, Infographic 3 – Nội dung 3, tài liệu tham khảo khác",
                            assessment: "Kết quả trả lời các câu hỏi trắc nghiệm khách quan và tự luận"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (15 tiết)",
                    activities: [
                        {
                            id: "act_a16_ip_intro",
                            code: "Giới thiệu & Phần 1 (Trực tiếp)",
                            name: "Giới thiệu & Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Giới thiệu chương trình, tổ chức lớp chia nhóm, nắm kế hoạch và giải đáp các khó khăn của học trực tuyến.",
                            tasks: "Giới thiệu thành phần tham dự, báo cáo viên; Giới thiệu chương trình bồi dưỡng; Tổ chức lớp: chia nhóm, phát kế hoạch và dụng cụ học tập; Giới thiệu kế hoạch bồi dưỡng: mục tiêu, thời gian, nội dung, hình thức kiểm tra đánh giá; Chia sẻ tài nguyên; Học viên thảo luận theo nhóm và báo cáo lại những nội dung đã làm được; GV hướng dẫn giải đáp thắc mắc.",
                            materials: "Kế hoạch bồi dưỡng, dụng cụ học tập, tài nguyên học phần",
                            assessment: "Thống nhất tổ chức nhóm và kế hoạch thực hành"
                        },
                        {
                            id: "act_a16_ip_1",
                            code: "HĐ 1 (Trực tiếp)",
                            name: "Hệ thống hóa các vấn đề lí thuyết về phát triển bền vững và liên hệ thực tiễn",
                            mode: "in_person",
                            target: "Xác định được các vấn đề lí thuyết về phát triển bền vững và liên hệ vận dụng với thực tiễn ở Việt Nam.",
                            tasks: "HV nêu câu hỏi thắc mắc; Trao đổi, tiếp thu nội dung 1 từ giảng viên; HV làm việc theo nhóm: Trình bày các vấn đề lí thuyết về phát triển bền vững và cho ví dụ minh họa cụ thể; Trình bày kết quả thảo luận theo nhóm; Trao đổi toàn lớp.",
                            materials: "Tài liệu đọc: Nội dung 1, Infographic – Nội dung 1, tài liệu tham khảo",
                            assessment: "Đánh giá bài 1: Kết quả trình bày các vấn đề lí thuyết về phát triển bền vững và cho ví dụ minh họa cụ thể (theo nhóm)"
                        },
                        {
                            id: "act_a16_ip_2",
                            code: "HĐ 2 (Trực tiếp)",
                            name: "Hệ thống hóa lí thuyết về mục tiêu, nội dung và tiếp cận giáo dục vì sự PTBV",
                            mode: "in_person",
                            target: "Xác định được các vấn đề lí thuyết về mục tiêu, nội dung và tiếp cận giáo dục vì sự phát triển bền vững; và cho ví dụ minh họa.",
                            tasks: "HV nêu câu hỏi; Trao đổi tiếp thu nội dung 2; HV làm việc theo nhóm: Trình bày các vấn đề lí thuyết về mục tiêu, nội dung và tiếp cận giáo dục vì sự PTBV và cho ví dụ minh họa cụ thể; Trình bày kết quả thảo luận; Trao đổi toàn lớp.",
                            materials: "Tài liệu đọc: Nội dung 2, Infographic – Nội dung 2, tài liệu tham khảo",
                            assessment: "Đánh giá bài 2: Kết quả trình bày các vấn đề lí thuyết về mục tiêu, nội dung và tiếp cận giáo dục vì sự phát triển bền vững; và cho ví dụ minh họa cụ thể (theo nhóm)"
                        },
                        {
                            id: "act_a16_ip_3",
                            code: "HĐ 3 (Trực tiếp)",
                            name: "Tìm hiểu về giáo dục vì sự phát triển bền vững trong trường THCS/THPT",
                            mode: "in_person",
                            target: "Trình bày những vấn đề chung, mục tiêu, nội dung giáo dục vì sự phát triển bền vững ở trường THCS/THPT; Phân tích các khía cạnh về tổ chức hoạt động giáo dục và cho ví dụ minh họa.",
                            tasks: "HV làm việc theo nhóm: (1) Trình bày những vấn đề chung; (2) Trình bày mục tiêu, nội dung; (3) Phân tích các khía cạnh về tổ chức hoạt động giáo dục vì sự PTBV và cho ví dụ minh họa; Trao đổi toàn lớp.",
                            materials: "Tài liệu đọc: Nội dung 3, CT GDPT tổng thể và môn học/HĐTN-HN 2018",
                            assessment: "Đánh giá bài 3: Kết quả trình bày sản phẩm thảo luận (nhóm)"
                        },
                        {
                            id: "act_a16_ip_4",
                            code: "HĐ 4 (Trực tiếp)",
                            name: "Thực hành xây dựng chủ đề giáo dục vì sự phát triển bền vững trong trường THCS/THPT",
                            mode: "in_person",
                            target: "Xây dựng 01 kế hoạch chủ đề giáo dục vì sự phát triển bền vững trong một môn học/hoạt động trải nghiệm, hướng nghiệp trong chương trình.",
                            tasks: "HV làm việc theo nhóm để xây dựng 01 kế hoạch chủ đề giáo dục vì sự phát triển bền vững; Trình bày kết quả thảo luận theo nhóm; Trao đổi toàn lớp.",
                            materials: "Tài liệu đọc: Nội dung 3.3, CT GDPT 2018",
                            assessment: "Đánh giá bài 4: Kết quả trình bày về kế hoạch của 01 chủ đề giáo dục vì sự phát triển bền vững (nhóm)"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Bản trả lời câu hỏi trắc nghiệm/tự luận trên hệ thống"
                ],
                inPerson: [
                    "Bài tập vận dụng theo các nội dung 1, 2, 3 (Kế hoạch của 01 chủ đề giáo dục vì sự phát triển bền vững)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống", weight: 25, condition: "HV đạt điều kiện nếu đạt từ 5 điểm trở lên hoặc hoàn thành từ 50% bài tập trở lên" },
                    { name: "Bài điều kiện 2: GV chấm điểm hoạt động bồi dưỡng trực tiếp", weight: 25, condition: "HV đạt điều kiện nếu đạt từ 5 điểm trở lên" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Bài tập lớn (nộp lại cho GV)",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu đạt từ 5 điểm trở lên. Điều kiện: HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Hoàn thành các bài tập trắc nghiệm trực tuyến và kế hoạch chủ đề thực hành theo nhóm."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Fredriksson, U., Kusanagi, K. N., Gougoulakis, P., Matsuda, Y., & Kitamura, Y. (2020). A comparative study of curriculums for Education for Sustainable Development (ESD) in Sweden and Japan. Sustainability (Switzerland), 12(3), 1–16.",
                "[2] Kieu, T. K., Singer, J., & Gannon, T. J. (2015). Education for sustainable development in Vietnam: lessons learned from teacher education. International Journal of Sustainability in Higher Education, 17(6), 853–874.",
                "[3] Mensah, J. (2019). Sustainable development: Meaning, history, principles, pillars, and implications for human action: Literature review. Cogent Social Sciences, 5(1), 1–21.",
                "[4] United Nations (2018). Issues and trends in Education for Sustainable Development. In UNESCO Publishing.",
                "[5] Vietnamese Government (2017). Decision 622/QD-TTCP on National action plan to implement the Government’s 2030 Agenda for Sustainable Development in 2017 (pp. 1–88)."
            ]
        },
        grades: { attendance: 9.0, midterm: 8.7, final: 8.9 }
    },

    // ---------------------------------------------------------------------
    // 16. MÃ HỌC PHẦN: A17 - XÂY DỰNG MÔI TRƯỜNG GIÁO DỤC
    // ---------------------------------------------------------------------
    {
        id: "mod_nvsp_a17",
        programIds: ["prog_nvsp_thcs_2026", "prog_nvsp_thpt_2026"],
        code: "A17",
        name: "Xây dựng môi trường giáo dục",
        credits: 2,
        category: "electiveA",
        knowledgeBlock: "electiveA",
        semester: "1",
        type: "elective",
        isSelected: true,
        status: "in_progress",
        prerequisites: "Giáo dục học",
        instructor: "TS. Dư Thống Nhất",
        instructorEmail: "nhatdt@lecturer.hcmue.edu.vn",
        syllabus: {
            institution: "BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH",
            legalBasis: "Theo Thông tư số 12/2021/TT-BGDĐT ngày 05/04/2021 của Bộ Giáo dục và Đào tạo",
            date: "05/06/2021",
            authorTeam: [
                "TS. Dư Thống Nhất (Đồng tác giả biên soạn đề cương)",
                "PGS.TS. Nguyễn Sỹ Thư (Đồng tác giả biên soạn đề cương)"
            ],
            approver: "TS. Dư Thống Nhất (Trưởng Bộ môn / Trưởng nhóm kiểm duyệt)",
            instructor: "TS. Dư Thống Nhất",
            instructorEmail: "nhatdt@lecturer.hcmue.edu.vn",
            prerequisites: "Giáo dục học",
            hoursBreakdown: {
                total: 45,
                theory: 15,
                practice: 30,
                inPerson: 15,
                online: 30
            },
            description: "Học phần trang bị cho học viên các đặc điểm của môi trường giáo dục vì sự tiến bộ của học sinh; nhận diện tệ nạn xã hội và bạo lực học đường; yêu cầu, trách nhiệm bảo đảm môi trường giáo dục an toàn, lành mạnh, thân thiện theo Nghị định 80/2017/NĐ-CP; các biện pháp lồng ghép giới, xây dựng văn hóa nhà trường và đề xuất bộ quy tắc ứng xử, an toàn học đường ở trường THCS/THPT.",
            objectives: [
                { code: "1", text: "Trình bày được các đặc điểm của môi trường giáo dục vì sự tiến bộ của học sinh." },
                { code: "2", text: "Trình bày được nội dung bạo lực học đường và phòng chống bạo lực học đường." },
                { code: "3", text: "Trình bày được yêu cầu, trách nhiệm bảo đảm môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường." },
                { code: "4", text: "Trình bày được các qui định về văn hóa ứng xử trong nhà trường, phòng chống bạo lực học đường." },
                { code: "5", text: "Phân tích được các nội dung cốt lõi về môi trường giáo dục an toàn, lành mạnh, thân thiện; bạo lực học đường và phòng chống bạo lực học đường; về bình đẳng giới, bạo lực trên cơ sở giới." },
                { code: "6", text: "Vận dụng được các biện pháp xây dựng môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường ở trường THCS/THPT vào nhà trường cụ thể." },
                { code: "7", text: "Xây dựng và đề xuất được bộ quy tắc cụ thể về ứng xử và an toàn học đường ở trường THCS/THPT." }
            ],
            clos: [
                "Trình bày chuẩn xác đặc điểm, yêu cầu và trách nhiệm pháp lý của nhà trường, gia đình và xã hội trong bảo đảm môi trường giáo dục an toàn, lành mạnh, thân thiện theo Nghị định 80/2017/NĐ-CP và Thông tư 06/2019/TT-BGDĐT.",
                "Phân tích chuyên sâu thực trạng, nguyên nhân và dấu hiệu nhận diện của các nguy cơ bạo lực học đường, tệ nạn xã hội, bình đẳng giới và bạo lực trên cơ sở giới.",
                "Vận dụng các phương pháp và kĩ thuật thu thập, xử lý thông tin (định lượng, định tính) để xác định nguy cơ tiềm ẩn và hiện hữu về mất an toàn trường học.",
                "Xây dựng và đề xuất được Bộ quy tắc cụ thể về ứng xử văn hóa và an toàn học đường; giải pháp lồng ghép giới và mô hình phối hợp Nhà trường - Gia đình - Cộng đồng hiệu quả cho trường THCS/THPT."
            ],
            contentOutline: [
                {
                    title: "1. Môi trường giáo dục vì sự tiến bộ của học sinh",
                    items: [
                        "1.1 Môi trường giáo dục an toàn, lành mạnh, thân thiện: Khái niệm; Đặc điểm của môi trường giáo dục an toàn, lành mạnh, thân thiện",
                        "1.2. Nhận diện một số tệ nạn xã hội và bạo lực trong nhà trường: Tệ nạn xã hội; Bạo lực học đường",
                        "1.3. Yêu cầu, trách nhiệm bảo đảm môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường: Yêu cầu bảo đảm; Trách nhiệm bảo đảm"
                    ],
                    discussion: "Phân tích các biểu hiện mới của bạo lực học đường (bắt nạt qua mạng xã hội - cyberbullying) và giải pháp phòng ngừa từ sớm."
                },
                {
                    title: "2. Biện pháp xây dựng môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường ở trường THCS/THPT",
                    items: [
                        "2.1. Biện pháp xác định các nguy cơ tiềm ẩn và hiện hữu về bạo lực học đường và sự mất an toàn ở trường THCS/THPT: Thu thập, xử lí thông tin về môi trường giáo dục (phương pháp, kĩ thuật, thiết kế, xử lý số liệu định lượng, định tính); Xác định các nguy cơ tiềm ẩn và hiện hữu",
                        "2.2. Biện pháp lồng ghép giới trong hoạt động dạy học, giáo dục học sinh: Lồng ghép giới trong hoạt động dạy học; Lồng ghép giới trong hoạt động giáo dục",
                        "2.3. Biện pháp xây dựng văn hóa nhà trường vì sự tiến bộ của học sinh; xây dựng các quy tắc ứng xử và an toàn học đường: Xây dựng văn hóa nhà trường vì sự tiến bộ của học sinh; Xây dựng các quy tắc ứng xử và an toàn học đường ở trường",
                        "2.4. Biện pháp phối hợp giữa nhà trường, gia đình và xã hội trong xây dựng môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường: Tăng cường phối hợp với gia đình; Tăng cường phối hợp với cộng đồng"
                    ],
                    discussion: "Quy trình xử lý tình huống khẩn cấp khi phát hiện nguy cơ bạo lực học đường hoặc xâm hại trẻ em trong trường phổ thông."
                }
            ],
            learningStages: [
                {
                    stageName: "GIAI ĐOẠN 1: BỒI DƯỠNG TRỰC TUYẾN (30 tiết)",
                    activities: [
                        {
                            id: "act_a17_on_intro",
                            code: "Hướng dẫn trực tuyến",
                            name: "Khởi động & Hướng dẫn học trực tuyến",
                            mode: "online",
                            target: "Nắm vững mục tiêu, nội dung học phần, hình thức bồi dưỡng và quy định kiểm tra đánh giá trực tuyến.",
                            tasks: "Xem video/file tài liệu hướng dẫn học trực tuyến học phần 'Xây dựng môi trường giáo dục' gồm: Tìm hiểu mục tiêu, nội dung của học phần; Tìm hiểu hình thức bồi dưỡng trực tuyến và hướng dẫn cách thức thực hiện; Tìm hiểu hướng dẫn thực hiện kiểm tra, đánh giá học trực tuyến, học trực tiếp.",
                            materials: "Video/file tài liệu hướng dẫn, hệ thống LMS",
                            assessment: "Hoàn thành tiếp thu hướng dẫn và chuẩn bị học phần"
                        },
                        {
                            id: "act_a17_on_1",
                            code: "HĐ 1 (Trực tuyến)",
                            name: "Tìm hiểu môi trường giáo dục vì sự tiến bộ của học sinh",
                            mode: "online",
                            target: "Trình bày được các đặc điểm của môi trường giáo dục vì sự tiến bộ của học sinh; Trình bày được nội dung bạo lực học đường và phòng chống bạo lực học đường; Trình bày được yêu cầu, trách nhiệm bảo đảm môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường.",
                            tasks: "Học viên đọc tài liệu để trả lời câu hỏi trắc nghiệm và tóm tắt ý chính nội dung: Môi trường giáo dục an toàn, lành mạnh, thân thiện; Nhận diện một số tệ nạn xã hội và bạo lực trong nhà trường; Yêu cầu, trách nhiệm bảo đảm môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường.",
                            materials: "Tài liệu đọc: Nội dung 1, Infographic – nội dung 1",
                            assessment: "Trả lời câu hỏi trắc nghiệm; Nêu các thắc mắc và sẽ được giải đáp trên hệ thống hoặc khi dạy trực tiếp"
                        },
                        {
                            id: "act_a17_on_2",
                            code: "HĐ 2 (Trực tuyến)",
                            name: "Tìm hiểu biện pháp xây dựng môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường ở trường THCS/THPT",
                            mode: "online",
                            target: "Trình bày được các qui định về văn hóa ứng xử trong nhà trường, phòng chống bạo lực học đường; Phân tích được các nội dung cốt lõi về môi trường giáo dục an toàn, lành mạnh, thân thiện; bạo lực học đường và phòng chống bạo lực học đường; về bình đẳng giới, bạo lực trên cơ sở giới; Vận dụng được các biện pháp vào nhà trường cụ thể; Xây dựng và đề xuất được bộ quy tắc cụ thể về ứng xử và an toàn học đường ở trường THCS/THPT.",
                            tasks: "Học viên đọc tài liệu để trả lời câu hỏi trắc nghiệm và tóm tắt ý chính nội dung: Biện pháp xác định các nguy cơ tiềm ẩn và hiện hữu về bạo lực học đường và sự mất an toàn; Biện pháp lồng ghép giới trong dạy học, giáo dục; Biện pháp xây dựng văn hóa nhà trường, quy tắc ứng xử; Biện pháp phối hợp Nhà trường - Gia đình - Xã hội.",
                            materials: "Tài liệu đọc: Nội dung 2, Infographic – nội dung 2",
                            assessment: "Trả lời câu hỏi trắc nghiệm; Nêu các thắc mắc và sẽ được giải đáp trên hệ thống hoặc khi dạy trực tiếp"
                        }
                    ]
                },
                {
                    stageName: "GIAI ĐOẠN 2: BỒI DƯỠNG TRỰC TIẾP (15 tiết)",
                    activities: [
                        {
                            id: "act_a17_ip_intro",
                            code: "Giới thiệu & Phần 1 (Trực tiếp)",
                            name: "Giới thiệu & Trao đổi nhận xét về quá trình học trực tuyến",
                            mode: "in_person",
                            target: "Giới thiệu chương trình, tổ chức chia nhóm và giải đáp những vướng mắc của quá trình học trực tuyến.",
                            tasks: "Giới thiệu thành phần tham dự; Giới thiệu chương trình học phần bồi dưỡng; Tổ chức lớp: chia nhóm, giải thích nguyên tắc làm việc nhóm; Giới thiệu kế hoạch bồi dưỡng: mục tiêu, thời gian, nội dung, hình thức kiểm tra đánh giá; Chia sẻ tài nguyên về học phần; Trao đổi nhận xét về quá trình học trực tuyến; GV hướng dẫn giải đáp những thắc mắc.",
                            materials: "Kế hoạch bồi dưỡng, tài nguyên học phần",
                            assessment: "Thống nhất tổ chức nhóm và nguyên tắc làm việc"
                        },
                        {
                            id: "act_a17_ip_1",
                            code: "HĐ 1 (Trực tiếp)",
                            name: "Tìm hiểu môi trường giáo dục vì sự tiến bộ của học sinh",
                            mode: "in_person",
                            target: "Trình bày được các đặc điểm của môi trường giáo dục vì sự tiến bộ của học sinh; Trình bày được nội dung bạo lực học đường và phòng chống bạo lực học đường; Trình bày được yêu cầu, trách nhiệm bảo đảm môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường.",
                            tasks: "HV làm việc nhóm theo phiếu học tập số 01: thảo luận về môi trường giáo dục an toàn, bạo lực học đường, bình đẳng giới và bạo lực trên cơ sở giới, yêu cầu/trách nhiệm bảo đảm môi trường GD; Trình bày trên giấy A0 hoặc PowerPoint và báo cáo kết quả thảo luận nhóm; Trao đổi toàn lớp; GV giải đáp, thắc mắc, tư vấn theo vấn đề HV nêu ra.",
                            materials: "Phiếu học tập số 01, giấy A0 hoặc slide PowerPoint, tài liệu Nội dung 1",
                            assessment: "Biên bản làm việc nhóm"
                        },
                        {
                            id: "act_a17_ip_2",
                            code: "HĐ 2 (Trực tiếp)",
                            name: "Tìm hiểu biện pháp xây dựng môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường ở trường THCS/THPT",
                            mode: "in_person",
                            target: "Trình bày các qui định về văn hóa ứng xử; Phân tích nội dung cốt lõi về môi trường an toàn, bạo lực học đường, bình đẳng giới; Vận dụng biện pháp vào nhà trường cụ thể; Xây dựng và đề xuất được bộ quy tắc cụ thể về ứng xử và an toàn học đường ở trường THCS/THPT.",
                            tasks: "HV làm việc nhóm theo phiếu học tập số 02: thảo luận về biện pháp xác định nguy cơ tiềm ẩn và hiện hữu, biện pháp lồng ghép giới, biện pháp xây dựng văn hóa nhà trường/quy tắc ứng xử, biện pháp phối hợp Nhà trường - Gia đình - Xã hội; Trình bày trên giấy A0 hoặc PowerPoint; Trao đổi toàn lớp; GV giải đáp, tư vấn.",
                            materials: "Phiếu học tập số 02, giấy A0, slide PowerPoint, tài liệu Nội dung 2",
                            assessment: "Bảng đề xuất bộ quy tắc ứng xử và an toàn học đường ở trường"
                        }
                    ]
                }
            ],
            deliverables: {
                online: [
                    "Trả lời câu hỏi trắc nghiệm trên hệ thống"
                ],
                inPerson: [
                    "Bảng đề xuất bộ quy tắc ứng xử và an toàn học đường ở trường (Sản phẩm Hoạt động 2 trực tiếp)"
                ]
            },
            evaluationScheme: {
                formative: [
                    { name: "Bài điều kiện 1: Hệ thống chấm điểm hoàn thành bài tập trên hệ thống (20%)", weight: 20, condition: "HV đạt điều kiện nếu đạt trên 5 điểm hoặc hoàn thành trên 50% bài tập" },
                    { name: "Bài điều kiện 2: GV chấm điểm hoạt động bồi dưỡng trực tiếp (30%)", weight: 30, condition: "HV đạt điều kiện nếu đạt trên 5 điểm" }
                ],
                summative: {
                    name: "Đánh giá cuối học phần: Bài tiểu luận (50%)",
                    weight: 50,
                    condition: "HV được đánh giá đạt nếu được trên 5 điểm. Điều kiện: HV thực hiện trên 80% số tiết trên lớp và hoàn thành các nhiệm vụ học tập."
                },
                scale: "Điểm: từ 0 đến 10, làm tròn đến một chữ số thập phân.",
                notes: "Điểm tổng kết kết hợp Bài ĐK1 (20%), Bài ĐK2 (30%) và Tiểu luận cuối kỳ (50%)."
            },
            weights: { attendance: 10, midterm: 40, final: 50 },
            references: [
                "[1] Bộ Giáo dục và Đào tạo (2017). Quyết định số 5886/QĐ-BGDĐT ngày 28/2/2017 Ban hành chương trình hành động phòng, chống bạo lực học đường trong các cơ sở GD mầm non, GD phổ thông và GDTX giai đoạn 2017-2021.",
                "[2] Bộ Giáo dục và Đào tạo (2019). Chỉ thị số 993/CT-BGDĐT ngày 12/4/2019 về việc tăng cường giải pháp phòng, chống bạo lực học đường trong cơ sở giáo dục.",
                "[3] Bộ Giáo dục và Đào tạo (2019). Quy định quy tắc ứng xử trong cơ sở GD mầm non, GD phổ thông, GDTX (Thông tư số 06/2019/TT-BGDĐT ngày 12/4/2019).",
                "[4] Bùi Quý Khiêm (2019). Một số nội dung cơ bản về môi trường giáo dục an toàn, lành mạnh, thân thiện; phòng, chống bạo lực học đường.",
                "[5] Chính phủ (2017). Nghị định số 80/2017/NĐ-CP ngày 17/7/2017 quy định về môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường.",
                "[6] Đặng Hoàng Minh, Trần Thành Nam (2011). Hành vi bạo lực ở thanh thiếu niên - Con đường hình thành và cách tiếp cận đánh giá. Tạp chí Tâm lí học, (12), tr 22-26.",
                "[7] Huỳnh Văn Sơn (Chủ biên, 2017). Kỹ năng phòng chống bạo lực học đường. NXB Đại học Sư phạm TP. Hồ Chí Minh.",
                "[8] Lê Thị Ngọc Thúy (2014). Xây dựng văn hóa nhà trường - Lý thuyết và thực hành. NXB Đại học Quốc gia Hà Nội.",
                "[9] Mai Mỹ Hạnh, Bùi Hồng Quân, Nguyễn Vĩnh Khương (2014). Hành vi bạo lực học đường – Một khái niệm cần quan tâm trong tâm lý học giáo dục. Kỉ yếu Hội thảo Khoa học, Viện Nghiên cứu Giáo dục Trường ĐHSP TP.HCM.",
                "[10] Nguyễn Văn Hộ (2010). Phương pháp và kĩ thuật thu thập, xử lí thông tin về môi trường giáo dục trung học phổ thông. Module 4.",
                "[11] Thủ tướng Chính phủ (2017). Chỉ thị số 18/CT-TTg ngày 16/05/2017 về việc tăng cường giải pháp phòng, chống bạo lực, xâm hại trẻ em."
            ]
        },
        grades: { attendance: 9.4, midterm: 8.9, final: 9.1 }
    }
];

// =========================================================================
// TIỆN ÍCH TỰ ĐỘNG ĐỒNG BỘ & BỔ SUNG ĐỀ CƯƠNG CHI TIẾT CHUẨN HCMUE
// =========================================================================

/**
 * Chuẩn hóa mã học phần NVSP (A01 -> A1, A04 -> A4, A05 -> A5, v.v.)
 */
export function normalizeNvspCode(code = '') {
    const clean = String(code).trim().toUpperCase();
    const match = clean.match(/^A0?([1-9]|1[0-9])$/);
    if (match) return 'A' + parseInt(match[1], 10);
    return clean;
}

/**
 * Tìm học phần chuẩn HCMUE tương ứng trong bộ dữ liệu NVSP_MODULES
 */
export function findNvspMasterModule(mod) {
    if (!mod) return null;
    const modCode = String(mod.code || '').trim().toUpperCase();
    const modId = String(mod.id || '').toLowerCase();
    const modName = String(mod.name || '').trim().toLowerCase();
    const normModCode = normalizeNvspCode(modCode);

    // Bước 1: So khớp ưu tiên tuyệt đối theo ID hoặc mã học phần (Code)
    if (modId || normModCode) {
        const byCodeOrId = NVSP_MODULES.find(m => {
            const masterCode = String(m.code).trim().toUpperCase();
            const masterId = String(m.id).toLowerCase();
            const normMasterCode = normalizeNvspCode(masterCode);

            if (modId && masterId) {
                if (modId === masterId) return true;
                if (modId.replace('a0', 'a') === masterId.replace('a0', 'a')) return true;
            }
            if (normModCode && normMasterCode && normModCode === normMasterCode) return true;
            return false;
        });
        if (byCodeOrId) return byCodeOrId;
    }

    // Bước 2: So khớp theo tên môn học khi không có mã hoặc mã không khớp
    if (modName) {
        return NVSP_MODULES.find(m => {
            const masterName = String(m.name).trim().toLowerCase();
            if (modName === masterName) return true;
            if (modName.includes('stem') && masterName.includes('stem')) return true;
            if ((modName.includes('giá trị sống') || modName.includes('kỹ năng sống')) && (masterName.includes('giá trị sống') || masterName.includes('kỹ năng sống'))) return true;
            if (modName.includes('phát triển bền vững') && masterName.includes('phát triển bền vững')) return true;
            if (modName.includes('môi trường giáo dục') && masterName.includes('môi trường giáo dục')) return true;
            if (modName.includes('đánh giá') && masterName.includes('đánh giá')) return true;
            if (modName.includes('tâm lý') && masterName.includes('tâm lý')) return true;
            if (modName.includes('lý luận dạy học') && masterName.includes('lý luận dạy học')) return true;
            if (modName.includes('quản lý lớp') && masterName.includes('quản lý lớp')) return true;
            if (modName.includes('quản lý nhà nước') && masterName.includes('quản lý nhà nước')) return true;
            if (modName.includes('giao tiếp') && masterName.includes('giao tiếp')) return true;
            if (modName.includes('rèn luyện') && masterName.includes('rèn luyện')) return true;
            if (modName.includes('công nghệ thông tin') && masterName.includes('công nghệ thông tin')) return true;
            if (modName.includes('kỷ luật tích cực') && masterName.includes('kỷ luật tích cực')) return true;
            if (modName.includes('kỹ thuật dạy học') && masterName.includes('kỹ thuật dạy học')) return true;
            if (!modName.includes('stem') && modName.includes('hoạt động giáo dục') && masterName.includes('hoạt động giáo dục')) return true;
            if (modName.includes('giáo dục học') && masterName.includes('giáo dục học') && !modName.includes('tâm lý')) return true;
            return false;
        });
    }

    return null;
}

/**
 * Tự động hợp nhất / bổ sung dữ liệu đề cương chi tiết chuẩn HCMUE vào học phần
 */
export function enrichModuleWithNvspSyllabus(mod) {
    if (!mod) return mod;
    const master = findNvspMasterModule(mod);
    if (!master) return mod;

    const hasExistingStages = Array.isArray(mod.syllabus?.learningStages) && mod.syllabus.learningStages.length > 0;

    const mergedSyllabus = hasExistingStages
        ? {
            ...master.syllabus,
            ...mod.syllabus,
            hoursBreakdown: mod.syllabus?.hoursBreakdown || master.syllabus?.hoursBreakdown,
            learningStages: mod.syllabus?.learningStages || master.syllabus?.learningStages,
            contentOutline: mod.syllabus?.contentOutline || master.syllabus?.contentOutline,
            objectives: mod.syllabus?.objectives || master.syllabus?.objectives,
            clos: (mod.syllabus?.clos && mod.syllabus.clos.length > 0 && mod.syllabus.clos[0]) ? mod.syllabus.clos : master.syllabus?.clos,
            authorTeam: mod.syllabus?.authorTeam || master.syllabus?.authorTeam,
            approver: mod.syllabus?.approver || master.syllabus?.approver,
            legalBasis: mod.syllabus?.legalBasis || master.syllabus?.legalBasis,
            institution: mod.syllabus?.institution || master.syllabus?.institution,
            date: mod.syllabus?.date || master.syllabus?.date
        }
        : {
            ...master.syllabus,
            ...(mod.syllabus || {})
        };

    return {
        ...master,
        ...mod,
        instructor: mod.instructor || master.instructor,
        instructorEmail: mod.instructorEmail || master.instructorEmail,
        authorTeam: mod.authorTeam || master.authorTeam || master.syllabus?.authorTeam,
        approver: mod.approver || master.approver || master.syllabus?.approver,
        prerequisites: mod.prerequisites || master.prerequisites,
        syllabus: mergedSyllabus
    };
}
