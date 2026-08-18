// =============================================================================
// PEDAGOGY ACADEMIC SUITE - TUYỂN SINH LỚP 10 (TS10 ACADEMIC DATABASE)
// Bộ Giáo dục & Đào tạo & Phân hóa Đặc thù Sở GD&ĐT (Hà Nội, TP.HCM, Đà Nẵng...)
// =============================================================================

// -----------------------------------------------------------------------------
// 1. DEFAULT PROFILE & TARGETS CHO HỌC SINH LỚP 9 ÔN THI VÀO 10
// -----------------------------------------------------------------------------
export const DEFAULT_TS10_PROFILE = {
    studentName: 'Nguyễn Huỳnh Phúc Khang',
    targetSchool: 'THPT Chuyên Lê Hồng Phong (TP.HCM)',
    targetClassType: 'Chuyên Toán / Nguyện vọng 1',
    targetProvince: 'TP. Hồ Chí Minh',
    examYear: 2026,
    targetScores: {
        math: 9.0,
        literature: 8.5,
        english: 9.5,
        specialized: 8.0 // Môn chuyên
    },
    currentPhase: 'phase2', // 'phase1' (Lấy gốc), 'phase2' (Tổng ôn chuyên đề), 'phase3' (Luyện đề thực chiến)
    completedLessons: 42,
    submittedEssaysCount: 8,
    simulatedExamsCount: 15
};

// -----------------------------------------------------------------------------
// 2. MÔN TOÁN 10: CÁC CHUYÊN ĐỀ CỐT LÕI & "GIẢI PHẪU BƯỚC LÀM" (BAREM 0.25đ)
// -----------------------------------------------------------------------------
export const TS10_MATH_TOPICS = [
    {
        id: 'math_can_thuc',
        category: 'Đại số cốt lõi',
        name: 'Căn thức & Rút gọn biểu thức chứa căn',
        importance: 'Chiếm 1.5 - 2.0 điểm (Câu 1 trong đề thi)',
        trapWarning: '⚠️ Bẫy nghiêm trọng: Quên ghi lại Điều Kiện Xác Định (ĐKXĐ) trước khi rút gọn hoặc quên đối chiếu điều kiện ở kết luận cuối cùng (Trừ 0.25đ đến 0.5đ).',
        formulaSummary: '$\\sqrt{A^2} = |A|$; $\\sqrt{A \\cdot B} = \\sqrt{A} \\cdot \\sqrt{B}$ ($A, B \\ge 0$); Trục căn thức ở mẫu: $\\frac{C}{\\sqrt{A} \\pm \\sqrt{B}} = \\frac{C(\\sqrt{A} \\mp \\sqrt{B})}{A - B}$',
        sampleProblem: {
            title: 'Bài toán rút gọn và tìm giá trị nguyên của biểu thức',
            question: 'Cho biểu thức $A = \\frac{x + 2\\sqrt{x}}{x - 4} - \\frac{1}{\\sqrt{x} - 2}$ và $B = \\frac{\\sqrt{x} + 1}{\\sqrt{x} - 2}$ với $x \\ge 0, x \\ne 4$.\n1) Rút gọn biểu thức $A$.\n2) Đặt $P = \\frac{A}{B}$. Tìm $x$ để $P < \\frac{1}{2}$.',
            stepsBarem: [
                {
                    stepNumber: 'Bước 1',
                    content: 'Nêu lại ĐKXĐ: $x \\ge 0, x \\ne 4$. Phân tích mẫu số: $x - 4 = (\\sqrt{x} - 2)(\\sqrt{x} + 2)$',
                    points: '0.25 điểm',
                    note: 'Bắt buộc phải ghi rõ điều kiện xác định đề bài cho.'
                },
                {
                    stepNumber: 'Bước 2',
                    content: 'Quy đồng mẫu thức chung $(\\sqrt{x} - 2)(\\sqrt{x} + 2)$:\n$A = \\frac{x + 2\\sqrt{x} - (\\sqrt{x} + 2)}{(\\sqrt{x} - 2)(\\sqrt{x} + 2)} = \\frac{x + \\sqrt{x} - 2}{(\\sqrt{x} - 2)(\\sqrt{x} + 2)}$',
                    points: '0.50 điểm',
                    note: 'Chú ý dấu ngoặc khi trừ phân thức thứ hai.'
                },
                {
                    stepNumber: 'Bước 3',
                    content: 'Phân tích tử thành nhân tử: $x + \\sqrt{x} - 2 = (\\sqrt{x} - 1)(\\sqrt{x} + 2)$.\nRút gọn: $A = \\frac{(\\sqrt{x} - 1)(\\sqrt{x} + 2)}{(\\sqrt{x} - 2)(\\sqrt{x} + 2)} = \\frac{\\sqrt{x} - 1}{\\sqrt{x} - 2}$',
                    points: '0.25 điểm',
                    note: 'Kết luận rút gọn rõ ràng.'
                },
                {
                    stepNumber: 'Bước 4 (Ý 2)',
                    content: 'Tính $P = \\frac{A}{B} = \\frac{\\sqrt{x} - 1}{\\sqrt{x} - 2} : \\frac{\\sqrt{x} + 1}{\\sqrt{x} - 2} = \\frac{\\sqrt{x} - 1}{\\sqrt{x} + 1}$.\nGiải bất phương trình: $P < \\frac{1}{2} \\Leftrightarrow \\frac{\\sqrt{x} - 1}{\\sqrt{x} + 1} - \\frac{1}{2} < 0 \\Leftrightarrow \\frac{2\\sqrt{x} - 2 - \\sqrt{x} - 1}{2(\\sqrt{x} + 1)} < 0 \\Leftrightarrow \\frac{\\sqrt{x} - 3}{2(\\sqrt{x} + 1)} < 0$',
                    points: '0.50 điểm',
                    note: 'KHÔNG ĐƯỢC nhân chéo khử mẫu khi chưa biết dấu của mẫu.'
                },
                {
                    stepNumber: 'Bước 5 (Kết luận)',
                    content: 'Vì $2(\\sqrt{x} + 1) > 0$ với mọi $x \\ge 0 \\Rightarrow \\sqrt{x} - 3 < 0 \\Leftrightarrow \\sqrt{x} < 3 \\Leftrightarrow x < 9$.\nKết hợp ĐKXĐ $x \\ge 0, x \\ne 4$, ta được: $0 \\le x < 9$ và $x \\ne 4$.',
                    points: '0.50 điểm',
                    note: '⚠️ CẢNH BÁO: Quên điều kiện $0 \\le x$ hoặc $x \\ne 4$ sẽ bị trừ 0.25đ.'
                }
            ]
        }
    },
    {
        id: 'math_viet_parabol',
        category: 'Đại số cốt lõi',
        name: 'Hàm số $y=ax^2$, Tương giao Parabol & Hệ thức Vi-ét',
        importance: 'Chiếm 2.0 - 2.5 điểm (Thường là câu 2 hoặc câu 3)',
        trapWarning: '⚠️ Bẫy nghiêm trọng: Không kiểm tra điều kiện $\\Delta > 0$ hoặc $\\Delta \\ge 0$ trước khi áp dụng hệ thức Vi-ét $x_1+x_2 = -b/a, x_1x_2 = c/a$.',
        formulaSummary: 'Hệ thức Vi-ét: $S = x_1 + x_2 = -\\frac{b}{a}$, $P = x_1 x_2 = \\frac{c}{a}$. Biến đổi đối xứng: $x_1^2 + x_2^2 = S^2 - 2P$; $|x_1 - x_2| = \\sqrt{S^2 - 4P}$',
        sampleProblem: {
            title: 'Sự tương giao giữa Parabol $(P): y = x^2$ và Đường thẳng $(d): y = 2mx - 2m + 1$',
            question: 'Trong mặt phẳng tọa độ $Oxy$, cho parabol $(P): y = x^2$ và đường thẳng $(d): y = 2mx - 2m + 1$.\n1) Chứng minh rằng $(d)$ luôn cắt $(P)$ tại hai điểm phân biệt với mọi $m \\ne 1$.\n2) Tìm $m$ để $x_1^2 + x_2^2 - 3x_1x_2 = 5$.',
            stepsBarem: [
                {
                    stepNumber: 'Bước 1',
                    content: 'Phương trình hoành độ giao điểm của $(P)$ và $(d)$:\n$x^2 = 2mx - 2m + 1 \\Leftrightarrow x^2 - 2mx + 2m - 1 = 0$ (*)',
                    points: '0.25 điểm',
                    note: 'Lập đúng phương trình hoành độ giao điểm.'
                },
                {
                    stepNumber: 'Bước 2',
                    content: 'Tính biệt thức $\\Delta\' = (-m)^2 - 1(2m - 1) = m^2 - 2m + 1 = (m - 1)^2$.\nVới mọi $m \\ne 1$, ta có $(m - 1)^2 > 0 \\Rightarrow \\Delta\' > 0$.\nVậy phương trình (*) luôn có 2 nghiệm phân biệt, hay $(d)$ luôn cắt $(P)$ tại 2 điểm phân biệt.',
                    points: '0.50 điểm',
                    note: 'Lập luận chặt chẽ $(m-1)^2 > 0$ khi $m \\ne 1$.'
                },
                {
                    stepNumber: 'Bước 3',
                    content: 'Theo định lý Vi-ét cho phương trình (*):\n$x_1 + x_2 = 2m$ và $x_1 x_2 = 2m - 1$',
                    points: '0.25 điểm',
                    note: 'Ghi đúng công thức Vi-ét.'
                },
                {
                    stepNumber: 'Bước 4',
                    content: 'Biến đổi biểu thức bài toán: $x_1^2 + x_2^2 - 3x_1x_2 = 5 \\Leftrightarrow (x_1+x_2)^2 - 5x_1x_2 = 5$\nThay Vi-ét vào: $(2m)^2 - 5(2m - 1) = 5 \\Leftrightarrow 4m^2 - 10m + 5 = 5 \\Leftrightarrow 4m^2 - 10m = 0$',
                    points: '0.50 điểm',
                    note: 'Thu gọn phương trình bậc hai theo $m$.'
                },
                {
                    stepNumber: 'Bước 5',
                    content: '$2m(2m - 5) = 0 \\Leftrightarrow m = 0$ hoặc $m = \\frac{5}{2}$.\nĐối chiếu điều kiện $m \\ne 1$: Cả hai giá trị $m=0$ và $m=2.5$ đều thỏa mãn.\nKết luận: $m \\in \\{0; \\frac{5}{2}\\}$.',
                    points: '0.50 điểm',
                    note: 'Bắt buộc đối chiếu điều kiện $m \\ne 1$.'
                }
            ]
        }
    },
    {
        id: 'math_toan_thuc_te',
        category: 'Toán thực tế & Ứng dụng',
        name: 'Bài toán Thực tế (Chiết khấu, Tăng trưởng, Thể tích, Lãi suất)',
        importance: 'Đặc sản đề thi Sở GD&ĐT TP.HCM (chiếm 3.0 - 4.0 điểm, 4-5 câu)',
        trapWarning: '⚠️ Bẫy: Nhầm lẫn giữa "giảm x%" (tính 100% - x%) và "tính số tiền giảm"; nhầm đơn vị đo lường (lít $\\leftrightarrow$ $m^3$ $\\leftrightarrow$ $dm^3$).',
        formulaSummary: 'Giá sau giảm: $P_{\\text{mới}} = P_{\\text{gốc}} \\times (1 - \\%\\text{giảm})$; Thể tích hình trụ: $V = \\pi r^2 h$; Hình nón: $V = \\frac{1}{3}\\pi r^2 h$; Hình cầu: $V = \\frac{4}{3}\\pi R^3$',
        sampleProblem: {
            title: 'Bài toán tính tiền điện / Chương trình khuyến mãi siêu thị',
            question: 'Một siêu thị điện máy thực hiện chương trình giảm giá cho dòng TV 55 inch nhân dịp Tết. Đợt 1 giảm 10% so với giá niêm yết. Đợt 2 giảm thêm 5% so với giá của đợt 1. Bác An mua một chiếc TV trong đợt 2 với số tiền 11.970.000 đồng.\n1) Hỏi giá niêm yết ban đầu của chiếc TV là bao nhiêu?\n2) Nếu siêu thị thực hiện giảm một lần 15% ngay từ đầu thì bác An có tiết kiệm được nhiều tiền hơn không? Giải thích vì sao.',
            stepsBarem: [
                {
                    stepNumber: 'Bước 1',
                    content: 'Gọi giá niêm yết ban đầu của chiếc TV là $x$ (đồng) ($x > 11.970.000$).\nGiá của chiếc TV sau đợt giảm giá thứ nhất là: $x \\times (100\\% - 10\\%) = 0.9x$ (đồng)',
                    points: '0.25 điểm',
                    note: 'Đặt ẩn và tìm giá đợt 1.'
                },
                {
                    stepNumber: 'Bước 2',
                    content: 'Giá của chiếc TV sau đợt giảm giá thứ hai là: $0.9x \\times (100\\% - 5\\%) = 0.9x \\times 0.95 = 0.855x$ (đồng)',
                    points: '0.25 điểm',
                    note: 'Tính theo phần trăm của đợt 1.'
                },
                {
                    stepNumber: 'Bước 3',
                    content: 'Theo đề bài, ta có phương trình: $0.855x = 11.970.000 \\Rightarrow x = \\frac{11.970.000}{0.855} = 14.000.000$ (đồng).\nThỏa mãn điều kiện. Vậy giá niêm yết ban đầu là 14.000.000 đồng.',
                    points: '0.50 điểm',
                    note: 'Thực hiện phép chia chính xác và kết luận có đơn vị.'
                },
                {
                    stepNumber: 'Bước 4 (Ý 2)',
                    content: 'Nếu giảm ngay 15% từ đầu, số tiền bác An phải trả là:\n$14.000.000 \\times (100\\% - 15\\%) = 14.000.000 \\times 0.85 = 11.900.000$ (đồng).',
                    points: '0.25 điểm',
                    note: 'Tính số tiền giảm 1 lần.'
                },
                {
                    stepNumber: 'Bước 5',
                    content: 'Vì $11.900.000 < 11.970.000$ nên bác An sẽ tiết kiệm được nhiều hơn $70.000$ đồng nếu siêu thị giảm 1 lần 15%.\nGiải thích: Vì ở đợt 2, mức giảm 5% chỉ được tính trên số tiền đã giảm ở đợt 1 chứ không tính trên giá gốc.',
                    points: '0.25 điểm',
                    note: 'So sánh và giải thích bản chất toán học.'
                }
            ]
        }
    },
    {
        id: 'math_hinh_tu_giac_noi_tiep',
        category: 'Hình học phẳng',
        name: 'Tứ giác nội tiếp & Các bài toán hình tổng hợp',
        importance: 'Chiếm 3.0 - 3.5 điểm (Thường là câu hình học phân loại học sinh)',
        trapWarning: '⚠️ Bẫy nghiêm trọng: Ngộ nhận các điểm thẳng hàng khi chưa chứng minh; thiếu căn cứ góc nội tiếp cùng chắn một cung; vẽ hình sai ở câu a bị chấm 0 điểm toàn bài hình.',
        formulaSummary: '4 cách chứng minh Tứ giác nội tiếp: 1) Tổng hai góc đối diện bằng $180^\\circ$; 2) Hai đỉnh kề nhau cùng nhìn cạnh đối diện dưới 2 góc bằng nhau; 3) Góc ngoài tại 1 đỉnh bằng góc trong đỉnh đối diện; 4) 4 đỉnh cách đều 1 điểm.',
        sampleProblem: {
            title: 'Chứng minh tứ giác nội tiếp và hệ thức tiếp tuyến - cát tuyến',
            question: 'Từ điểm $A$ nằm ngoài đường tròn $(O; R)$, vẽ hai tiếp tuyến $AB, AC$ với $(O)$ ($B, C$ là tiếp điểm). Vẽ cát tuyến $ADE$ không đi qua $O$ ($D$ nằm giữa $A$ và $E$).\n1) Chứng minh tứ giác $ABOC$ nội tiếp.\n2) Chứng minh $AB^2 = AD \\cdot AE$.',
            stepsBarem: [
                {
                    stepNumber: 'Bước 1 (Vẽ hình & Câu 1)',
                    content: 'Vẽ đúng hình đến câu 1 (tiếp tuyến vuông góc bán kính).\nXét tứ giác $ABOC$ có: $\\widehat{ABO} = 90^\\circ$ (do $AB$ là tiếp tuyến của $(O)$ tại $B$),\n$\\widehat{ACO} = 90^\\circ$ (do $AC$ là tiếp tuyến của $(O)$ tại $C$).',
                    points: '0.50 điểm',
                    note: 'Vẽ hình đúng và nêu rõ lý do tiếp tuyến.'
                },
                {
                    stepNumber: 'Bước 2',
                    content: 'Suy ra $\\widehat{ABO} + \\widehat{ACO} = 90^\\circ + 90^\\circ = 180^\\circ$.\nMà hai góc này ở vị trí đối nhau trong tứ giác $ABOC$.\n$\\Rightarrow$ Tứ giác $ABOC$ nội tiếp đường tròn đường kính $AO$.',
                    points: '0.50 điểm',
                    note: 'Nêu rõ "tổng 2 góc đối bằng 180 độ".'
                },
                {
                    stepNumber: 'Bước 3 (Câu 2)',
                    content: 'Xét $\\triangle ABD$ và $\\triangle AEB$ có:\n$\\widehat{BAE}$ là góc chung;\n$\\widehat{ABD} = \\widehat{AEB}$ (góc tạo bởi tia tiếp tuyến và dây cung và góc nội tiếp cùng chắn cung $\\overparen{BD}$).',
                    points: '0.50 điểm',
                    note: 'Ghi rõ lý do góc tiếp tuyến và góc nội tiếp.'
                },
                {
                    stepNumber: 'Bước 4',
                    content: '$\\Rightarrow \\triangle ABD \\sim \\triangle AEB$ (g.g)\n$\\Rightarrow \\frac{AB}{AE} = \\frac{AD}{AB} \\Rightarrow AB^2 = AD \\cdot AE$ (đpcm).',
                    points: '0.50 điểm',
                    note: 'Lập đúng tỉ số đồng dạng và nhân chéo.'
                }
            ]
        }
    }
];

// -----------------------------------------------------------------------------
// 3. MÔN NGỮ VĂN 10: SƠ ĐỒ TƯ DUY, KHUNG DÀN Ý LINH HOẠT & KHO DẪN CHỨNG
// -----------------------------------------------------------------------------
export const TS10_LITERATURE_DATA = {
    docHieuPhuongPhap: [
        {
            title: 'Nhận diện Phương thức Biểu đạt',
            description: 'Tự sự (kể sự việc), Miêu tả (tái hiện đặc điểm), Biểu cảm (bộc lộ cảm xúc), Nghị luận (bàn luận, thuyết phục), Thuyết minh (cung cấp tri thức), Hành chính công vụ.'
        },
        {
            title: 'Công thức Phân tích Biện pháp Tu từ',
            description: 'Công thức 3 bước: 1) Chỉ ra từ ngữ chứa biện pháp tu từ -> 2) Nêu tác dụng tạo hình ảnh/âm điệu -> 3) Bộc lộ tình cảm, thái độ của tác giả.'
        }
    ],
    nghiLuanXaHoi200Tu: {
        title: 'Quy trình 6 bước viết Đoạn văn 200 chữ chuẩn barem',
        steps: [
            { step: '1. Mở đoạn (1-2 câu)', content: 'Dẫn dắt trực tiếp và nêu đúng vấn đề nghị luận (Trích dẫn từ khóa của đề bài).' },
            { step: '2. Giải thích (2-3 câu)', content: 'Cắt nghĩa các từ ngữ trọng tâm và giải thích ý nghĩa khái quát của vấn đề.' },
            { step: '3. Bàn luận & Phân tích (5-6 câu)', content: 'Tại sao vấn đề lại đúng/cần thiết? Vấn đề mang lại giá trị gì cho cá nhân và cộng đồng?' },
            { step: '4. Dẫn chứng thực tế (3-4 câu)', content: 'Đưa 1 dẫn chứng tiêu biểu, xác thực, mang tính thời sự, phân tích ngắn gọn gắn với luận điểm.' },
            { step: '5. Phản biện / Mở rộng (2 câu)', content: 'Lật ngược vấn đề: Phê phán lối sống tiêu cực đối lập hoặc cái nhìn đa chiều hơn.' },
            { step: '6. Bài học & Kết đoạn (2 câu)', content: 'Rút ra bài học nhận thức (hiểu được gì) và hành động cụ thể cho bản thân học sinh.' }
        ],
        khoDanChungThoiSu: [
            {
                subject: 'Ý chí, Nghị lực & Vượt lên nghịch cảnh',
                name: 'Thầy giáo Nguyễn Ngọc Ký / Cô bé Đỗ Hạnh Nhi',
                detail: 'Tấm gương phi thường vượt lên khiếm khuyết thể xác để cống hiến tri thức cho xã hội.'
            },
            {
                subject: 'Lòng trắc ẩn & Tinh thần tương thân tương ái',
                name: 'Các đội cứu hộ tình nguyện trong bão Yagi (Bão số 3 - 2024)',
                detail: 'Hàng ngàn chuyến xe cứu trợ xuyên đêm mang lương thực đến vùng lũ miền Bắc, thể hiện tinh thần "lá lành đùm lá rách".'
            },
            {
                subject: 'Khát vọng cống hiến & Giữ gìn bản sắc',
                name: 'Ca sĩ Đen Vâu (Dự án Nuôi Em)',
                detail: 'Dùng toàn bộ doanh thu bài hát "Nấu ăn cho em" để xây trường và nuôi cơm cho hàng ngàn trẻ em vùng cao.'
            }
        ]
    },
    tacPhamLop9Mindmaps: [
        {
            id: 'tp_lang_le_sa_pa',
            title: 'Lặng lẽ Sa Pa',
            author: 'Nguyễn Thành Long',
            genre: 'Truyện ngắn',
            centralTheme: 'Vẻ đẹp của những con người lao động thầm lặng cống hiến hết mình cho Tổ quốc trên đỉnh núi cao.',
            mindmapNodes: [
                {
                    node: 'Nhân vật Anh thanh niên 27 tuổi',
                    branches: [
                        'Hoàn cảnh sống: Đỉnh Yên Sơn cao 2600m, "cô độc nhất thế gian", thời tiết khắc nghiệt gió tuyết.',
                        'Tinh thần trách nhiệm: Làm việc đo gió, đo mưa lúc 1h sáng cực kỳ chính xác; quan niệm "khi ta làm việc, ta với công việc là đôi".',
                        'Lối sống đẹp & Yêu đời: Trồng hoa lay-ơn, nuôi gà, đọc sách mở rộng tầm hiểu biết, hiếu khách nồng hậu.',
                        'Đức tính khiêm tốn: Từ chối để bác họa sĩ vẽ mình, nhiệt tình giới thiệu ông kĩ sư vườn rau và anh cán bộ nghiên cứu sét.'
                    ]
                },
                {
                    node: 'Ý nghĩa nhan đề',
                    branches: [
                        'Đảo ngữ "Lặng lẽ" lên đầu: Vẻ ngoài Sa Pa yên bình, thơ mộng đầy sương mù.',
                        'Ẩn dụ bên trong: Dưới sự lặng lẽ ấy là ngọn lửa cống hiến sôi nổi của những con người vô danh cho đất nước.'
                    ]
                }
            ],
            dynamicOutline: {
                moBai: 'Dẫn dắt về đề tài con người lao động mới trong công cuộc xây dựng CNXH -> Giới thiệu tác giả Nguyễn Thành Long và truyện ngắn "Lặng lẽ Sa Pa" -> Nêu vấn đề: Vẻ đẹp nhân vật anh thanh niên.',
                thanBai1: 'Luận điểm 1: Hoàn cảnh sống và tinh thần trách nhiệm vượt bậc với công việc khí tượng kiêm vật lý địa cầu.',
                thanBai2: 'Luận điểm 2: Vẻ đẹp tâm hồn yêu đời, cởi mở, chu đáo và tinh thần ham học hỏi qua những trang sách.',
                thanBai3: 'Luận điểm 3: Sự khiêm tốn chân thành và tấm lòng trân trọng những người đồng nghiệp thầm lặng khác.',
                ketBai: 'Khẳng định giá trị nhân văn của tác phẩm: Bức tranh tuyệt đẹp về thế hệ trẻ Việt Nam thời kỳ xây dựng đất nước.'
            },
            nhanDinhHay: '“Cuộc sống của chúng ta không thể thiếu những con người lặng lẽ, bởi chính họ là những viên gạch nền móng âm thầm xây nên tòa lâu đài hạnh phúc của nhân loại.”'
        },
        {
            id: 'tp_dong_chi',
            title: 'Đồng chí',
            author: 'Chính Hữu',
            genre: 'Thơ ca cách mạng',
            centralTheme: 'Tình đồng chí, đồng đội keo sơn gắn bó keo sơn bắt nguồn từ sự đồng cảnh ngộ, cùng chung lý tưởng chiến đấu bảo vệ Tổ quốc.',
            mindmapNodes: [
                {
                    node: 'Cơ sở hình thành tình đồng chí (7 câu đầu)',
                    branches: [
                        'Tương đồng về xuất thân nghèo khó: "Quê hương anh nước mặn đồng chua / Làng tôi nghèo đất cày lên sỏi đá".',
                        'Cùng chung lý tưởng cách mạng: "Súng bên súng, đầu sát bên đầu".',
                        'Chia sẻ gian lao, gắn kết tri kỷ: "Đêm rét chung chăn thành đôi tri kỷ".',
                        'Kết tinh bằng câu thơ đặc biệt: "Đồng chí!" (Câu thơ 2 tiếng tạo bản lề cảm xúc).'
                    ]
                },
                {
                    node: 'Biểu hiện cao đẹp của tình đồng chí (10 câu tiếp)',
                    branches: [
                        'Thấu hiểu nỗi niềm tâm tư của nhau: "Ruộng nương anh gửi bạn thân cày / Gian nhà không mặc kệ gió lung lay".',
                        'Cùng chia sẻ những cơn sốt rét rừng hiểm nghèo và thiếu thốn quân trang: "Áo anh rách vai, quần tôi có vài mảnh vá / Miệng cười buốt giá, chân không giày".',
                        'Cái nắm tay truyền hơi ấm: "Thương nhau tay nắm lấy bàn tay".'
                    ]
                },
                {
                    node: 'Bức tranh biểu tượng bất hủ (3 câu cuối)',
                    branches: [
                        'Hiện thực khắc nghiệt: Rừng hoang sương muối, đêm phục kích chờ giặc.',
                        'Biểu tượng lãng mạn cao đẹp: "Đầu súng trăng treo" - Sự hòa quyện giữa hiện thực (súng) và lãng mạn (trăng), chiến tranh và hòa bình.'
                    ]
                }
            ],
            dynamicOutline: {
                moBai: 'Giới thiệu nhà thơ chiến sĩ Chính Hữu và bài thơ "Đồng chí" (1948) -> Khẳng định đây là tượng đài bất hủ về tình anh bộ đội Cụ Hồ thời kỳ kháng chiến chống Pháp.',
                thanBai1: 'Luận điểm 1: Nguồn gốc xuất thân giản dị và sự đồng cảm tự nhiên kết tinh thành tình đồng chí thiêng liêng.',
                thanBai2: 'Luận điểm 2: Sức mạnh của tình đồng chí giúp người lính vượt qua gian khổ, thiếu thốn và bệnh tật nơi chiến trường.',
                thanBai3: 'Luận điểm 3: Hình tượng thơ kỳ vĩ, lãng mạn "Đầu súng trăng treo" - biểu tượng cho tâm hồn thi sĩ của người lính.',
                ketBai: 'Tổng kết ngôn ngữ thơ mộc mạc, cô đọng; ngợi ca vẻ đẹp bình dị mà cao cả của anh bộ đội Cụ Hồ.'
            },
            nhanDinhHay: '“Bài thơ Đồng chí của Chính Hữu như một viên ngọc thô được mài giũa bằng chính hiện thực chiến trường, giản dị mà lấp lánh thứ ánh sáng ấm áp của tình người trong khói lửa.”'
        },
        {
            id: 'tp_chiec_luoc_nga',
            title: 'Chiếc lược ngà',
            author: 'Nguyễn Quang Sáng',
            genre: 'Truyện ngắn',
            centralTheme: 'Tình cha con sâu nặng, thiêng liêng và cảm động trong hoàn cảnh éo le của chiến tranh khốc liệt.',
            mindmapNodes: [
                {
                    node: 'Diễn biến tâm lý bé Thu',
                    branches: [
                        'Khi mới gặp ông Sáu: Hoảng sợ, xa lánh, cự tuyệt quyết liệt vì vết sẹo trên mặt không giống trong ảnh.',
                        'Trong những ngày ông Sáu nghỉ phép: Cương quyết không gọi "ba", hắt trứng cá ra khỏi bát cơm, nhảy sang nhà ngoại khi bị đánh đòn.',
                        'Phút chia tay xúc động: Hiểu ra nguyên nhân vết sẹo qua lời kể của bà ngoại -> Tiếng gọi "Ba...a...a" xé lòng, ôm chặt cổ ba không cho đi.'
                    ]
                },
                {
                    node: 'Tình yêu con tha thiết của ông Sáu',
                    branches: [
                        'Những ngày phép: Đau đớn, bất lực trước sự lạnh lùng của con gái nhưng vẫn kiên nhẫn yêu thương.',
                        'Nơi chiến khu: Dồn hết tâm huyết mài từng chiếc răng lược ngà cho con; trước lúc hy sinh chỉ kịp móc chiếc lược gửi đồng đội trao cho con gái.'
                    ]
                }
            ],
            dynamicOutline: {
                moBai: 'Dẫn dắt về đề tài tình cảm gia đình trong chiến tranh -> Giới thiệu tác giả Nguyễn Quang Sáng và kiệt tác "Chiếc lược ngà".',
                thanBai1: 'Phân tích thái độ ương bướng của bé Thu thực chất là biểu hiện của tình yêu thương sâu sắc dành cho người ba trong bức ảnh.',
                thanBai2: 'Phân tích sự bùng nổ tình cảm mãnh liệt của bé Thu trong giờ phút chia tay tại bến xuồng.',
                thanBai3: 'Phân tích tình cha con cao cả qua kỷ vật chiếc lược ngà và sự hy sinh anh dũng của ông Sáu.',
                ketBai: 'Khẳng định chiến tranh có thể tàn phá thể xác nhưng không thể hủy diệt tình phụ tử thiêng liêng, bất diệt.'
            },
            nhanDinhHay: '“Chiếc lược ngà là bài ca cảm động về tình phụ tử, minh chứng hùng hồn rằng bom đạn chiến tranh có thể cướp đi sinh mạng nhưng bất lực trước sự thiêng liêng của tình cảm gia đình.”'
        }
    ]
};

// -----------------------------------------------------------------------------
// 4. MÔN TIẾNG ANH 10: PHÂN TÍCH CẤU TRÚC LỖI (ERROR ANALYSIS) & CÂU HỎI TRỌNG TÂM
// -----------------------------------------------------------------------------
export const TS10_ENGLISH_TOPICS = [
    {
        id: 'eng_phonetics_stress',
        category: 'Ngữ âm & Trọng âm',
        name: 'Quy tắc phát âm đuôi -ed, -s/es & Trọng âm 2-3 âm tiết',
        summaryRules: '1) Đuôi -ed: /id/ sau /t, d/; /t/ sau phụ âm vô thanh (p, k, f, s, sh, ch); /d/ trường hợp còn lại.\n2) Đuôi -s/es: /iz/ sau s, z, sh, ch, x, ge; /s/ sau p, t, k, f, th; /z/ trường hợp còn lại.\n3) Danh từ/Tính từ 2 âm tiết thường nhấn âm 1; Động từ 2 âm tiết thường nhấn âm 2.',
        quizzes: [
            {
                id: 'eq1',
                question: 'Choose the word whose underlined part is pronounced differently from the others:',
                options: ['A. arrived', 'B. decided', 'C. listened', 'D. opened'],
                correctAnswer: 'B. decided',
                errorAnalysis: {
                    whyCorrect: 'Đáp án B "decided" có đuôi "-ed" đi sau âm /d/ nên được phát âm là /ɪd/.',
                    whyOthersWrong: 'Các từ A "arrived", C "listened", D "opened" đều có đuôi "-ed" đi sau nguyên âm hoặc phụ âm hữu thanh (/v/, /n/) nên được phát âm là /d/.',
                    grammarRuleTag: 'Phát âm đuôi -ed (Quy tắc /ɪd/ vs /d/)'
                }
            },
            {
                id: 'eq2',
                question: 'Choose the word that has a different stress pattern from the others:',
                options: ['A. pollute', 'B. protect', 'C. damage', 'D. provide'],
                correctAnswer: 'C. damage',
                errorAnalysis: {
                    whyCorrect: 'Đáp án C "damage" là danh từ/động từ đặc biệt có trọng âm rơi vào âm tiết thứ 1 (/ˈdæm.ɪdʒ/).',
                    whyOthersWrong: 'Các từ A "pollute" (/pəˈluːt/), B "protect" (/prəˈtekt/), D "provide" (/prəˈvaɪd/) đều là động từ 2 âm tiết có trọng âm rơi vào âm tiết thứ 2.',
                    grammarRuleTag: 'Trọng âm từ có 2 âm tiết (Danh từ vs Động từ)'
                }
            }
        ]
    },
    {
        id: 'eng_grammar_conditionals',
        category: 'Ngữ pháp trọng tâm',
        name: 'Câu Điều Kiện (Loại 1, Loại 2) & Câu Ước Wish',
        summaryRules: '1) Điều kiện Loại 1 (Có thể xảy ra ở hiện tại/tương lai): If + S + V(s/es), S + will/can + V_bare.\n2) Điều kiện Loại 2 (Không có thật ở hiện tại): If + S + V2/ed (were), S + would/could + V_bare.\n3) Câu ước ở hiện tại: S + wish(es) + S + V2/ed (were cho tất cả các ngôi).',
        quizzes: [
            {
                id: 'eq3',
                question: 'If she ______ more free time, she would join our community volunteering campaign.',
                options: ['A. has', 'B. had', 'C. will have', 'D. is having'],
                correctAnswer: 'B. had',
                errorAnalysis: {
                    whyCorrect: 'Mệnh đề chính dùng "would join" (would + V_bare) -> Đây là câu điều kiện Loại 2 (diễn tả giả định không có thật ở hiện tại). Do đó mệnh đề If chia thì Quá khứ đơn "had".',
                    whyOthersWrong: 'A "has" dùng cho Loại 1; C "will have" sai ngữ pháp (không dùng will trong mệnh đề if); D "is having" không phù hợp với giả định Loại 2.',
                    grammarRuleTag: 'Câu điều kiện Loại 2 (Conditional Type 2)'
                }
            }
        ]
    },
    {
        id: 'eng_sentence_transformation',
        category: 'Viết lại câu (Sentence Transformation)',
        name: 'Chuyển đổi cấu trúc tương đương giữ nguyên nghĩa',
        summaryRules: '1) So that / In order that <-> In order to / So as to.\n2) Although / Even though + Mệnh đề <-> Despite / In spite of + N/V-ing.\n3) It takes sb [time] to do sth <-> S spends [time] doing sth.\n4) Because + Clause <-> Because of + N/V-ing.',
        transformationExercises: [
            {
                id: 'trans_1',
                originalSentence: 'Although the weather was extremely stormy, the rescue team reached the flooded village safely.',
                targetPrompt: 'Rewrite using "In spite of":',
                correctTransformation: 'In spite of the extremely stormy weather, the rescue team reached the flooded village safely.',
                explanation: 'Cấu trúc: "Although + S + V" chuyển sang "In spite of + Cụm danh từ (Adj + N)". Đổi "the weather was extremely stormy" thành "the extremely stormy weather".',
                commonMistakes: '⚠️ Lỗi phổ biến: Viết "In spite of the weather was stormy" (sai vì In spite of không đi trực tiếp với mệnh đề S+V).'
            },
            {
                id: 'trans_2',
                originalSentence: '"I will visit the historical museum with my classmates tomorrow," Nam said.',
                targetPrompt: 'Rewrite using Reported Speech:',
                correctTransformation: 'Nam said that he would visit the historical museum with his classmates the following day (or the next day).',
                explanation: 'Lùi thì: "will visit" -> "would visit"; Đổi đại từ: "I" -> "he", "my" -> "his"; Đổi trạng từ thời gian: "tomorrow" -> "the following day" hoặc "the next day".',
                commonMistakes: '⚠️ Lỗi phổ biến: Quên đổi "tomorrow" thành "the following day" hoặc quên đổi đại từ "my" thành "his".'
            }
        ]
    }
];

// -----------------------------------------------------------------------------
// 5. MA TRẬN ĐỀ THI THEO TỈNH/THÀNH PHỐ (PROVINCIAL EXAM MATRIX)
// -----------------------------------------------------------------------------
export const TS10_PROVINCIAL_MATRIX = [
    {
        provinceId: 'tphcm',
        provinceName: 'TP. Hồ Chí Minh',
        examCharacteristics: {
            math: 'Đề thi gồm 8 câu: 2 câu thuần túy (Căn thức & Parabol) + 5 câu Toán thực tế (hình học không gian, chiết khấu, hàm số bậc nhất, nồng độ dung dịch) + 1 câu Hình học thuần túy (3 ý).',
            literature: 'Cấu trúc đề mở, ngữ liệu Đọc hiểu và Nghị luận xã hội thường lấy từ các sự kiện xã hội nóng hổi mang tính thời sự; Đề thi không đóng khung văn mẫu.',
            english: '40 câu trắc nghiệm & điền từ (90 phút): Tập trung mạnh vào từ vựng theo ngữ cảnh, biển báo giao thông/thông báo đời sống (Signposts) và từ đồng nghĩa/trái nghĩa.'
        },
        yearsAvailable: ['2025', '2024', '2023', '2022'],
        schools: [
            { name: 'THPT Chuyên Lê Hồng Phong', type: 'Chuyên', benchmarkAvg: '38.5 / 50' },
            { name: 'THPT Chuyên Trần Đại Nghĩa', type: 'Chuyên', benchmarkAvg: '37.75 / 50' },
            { name: 'THPT Nguyễn Thượng Hiền', type: 'Đại trà (Top 1)', benchmarkAvg: '24.25 / 30' },
            { name: 'THPT Gia Định', type: 'Đại trà (Top 2)', benchmarkAvg: '23.0 / 30' },
            { name: 'THPT Bùi Thị Xuân', type: 'Đại trà', benchmarkAvg: '22.5 / 30' }
        ]
    },
    {
        provinceId: 'hanoi',
        provinceName: 'Hà Nội',
        examCharacteristics: {
            math: 'Cấu trúc truyền thống 5 bài tự luận: Bài I (Rút gọn biểu thức 2.0đ); Bài II (Giải bài toán bằng cách lập pt/hệ pt 2.0đ); Bài III (Hệ phương trình & Vi-ét 2.5đ); Bài IV (Hình học 3.0đ gồm 3-4 ý phân loại cao); Bài V (Bất đẳng thức Cauchy / Min-Max 0.5đ).',
            literature: 'Thường gồm 2 phần lớn (Phần I trích tác phẩm thơ/văn SGK lớp 9 kèm câu hỏi nghị luận văn học; Phần II trích văn bản xã hội kèm nghị luận xã hội).',
            english: '40 câu trắc nghiệm (60 phút): Trọng âm, ngữ âm, sửa lỗi sai, giao tiếp, đọc hiểu và viết lại câu.'
        },
        yearsAvailable: ['2025', '2024', '2023', '2022'],
        schools: [
            { name: 'THPT Chuyên Hà Nội - Amsterdam', type: 'Chuyên', benchmarkAvg: '42.0 / 50' },
            { name: 'THPT Chuyên Nguyễn Huệ', type: 'Chuyên', benchmarkAvg: '39.5 / 50' },
            { name: 'THPT Chu Văn An', type: 'Công lập Top 1', benchmarkAvg: '43.25 / 50' },
            { name: 'THPT Kim Liên', type: 'Công lập Top 2', benchmarkAvg: '41.5 / 50' },
            { name: 'THPT Thăng Long', type: 'Công lập', benchmarkAvg: '40.0 / 50' }
        ]
    },
    {
        provinceId: 'danang',
        provinceName: 'Đà Nẵng',
        examCharacteristics: {
            math: '5 câu tự luận: Kết hợp chặt chẽ giữa đại số giải tích căn thức, hàm số bậc hai Vi-ét và hình học đường tròn tiếp tuyến.',
            literature: 'Đề thi tích hợp nhân văn sâu sắc, chú trọng cảm nhận văn học và đoạn văn nghị luận xã hội giàu chất triết lý tuổi trẻ.',
            english: 'Trắc nghiệm kết hợp tự luận viết lại câu và sắp xếp câu hoàn chỉnh.'
        },
        yearsAvailable: ['2025', '2024', '2023'],
        schools: [
            { name: 'THPT Chuyên Lê Quý Đôn', type: 'Chuyên', benchmarkAvg: '44.0 / 60' },
            { name: 'THPT Phan Châu Trinh', type: 'Top 1 Đà Nẵng', benchmarkAvg: '56.0 / 60' },
            { name: 'THPT Hoàng Hoa Thám', type: 'Top 2 Đà Nẵng', benchmarkAvg: '52.5 / 60' }
        ]
    }
];

// -----------------------------------------------------------------------------
// 6. LỘ TRÌNH 3 GIAI ĐOẠN LUYỆN THI VÀO 10 (3-PHASE PATHWAY)
// -----------------------------------------------------------------------------
export const TS10_ROADMAP_PHASES = [
    {
        id: 'phase1',
        title: 'Giai Đoạn 1: Lấy Gốc & Nắm Chắc SGK',
        timeframe: 'Tháng 6 - Tháng 12',
        objective: 'Hoàn thành toàn bộ kiến thức nền tảng trong Sách Giáo Khoa Toán, Ngữ Văn, Tiếng Anh lớp 9.',
        status: 'completed',
        targetScoreRange: '5.0 - 7.0 điểm',
        keyMilestones: [
            'Nắm vững 5 phép biến đổi căn thức và giải phương trình bậc nhất, bậc hai.',
            'Thuộc lòng các bài thơ trọng tâm (Đồng chí, Bài thơ về tiểu đội xe không kính, Sang thu, Viếng lăng Bác).',
            'Nắm chắc 12 thì cơ bản và quy tắc phát âm đuôi -ed, -s/es trong Tiếng Anh.'
        ]
    },
    {
        id: 'phase2',
        title: 'Giai Đoạn 2: Tổng Ôn Chuyên Đề Phân Loại',
        timeframe: 'Tháng 1 - Tháng 3',
        objective: 'Đào sâu các dạng bài phân loại (Hệ thức Vi-ét, Tứ giác nội tiếp, Toán thực tế, Đoạn văn 200 chữ, Viết lại câu).',
        status: 'in_progress',
        targetScoreRange: '7.0 - 8.5 điểm',
        keyMilestones: [
            'Giải quyết triệt để các bài toán tương giao Parabol & Đường thẳng chứa tham số $m$.',
            'Luyện tập thành thạo 4 cách chứng minh tứ giác nội tiếp và tam giác đồng dạng.',
            'Lập dàn ý linh hoạt cho 8 tác phẩm văn xuôi và thơ lớp 9, thuộc kho 15 dẫn chứng thời sự.',
            'Thành thạo cấu trúc câu điều kiện, câu gián tiếp và mệnh đề quan hệ Tiếng Anh.'
        ]
    },
    {
        id: 'phase3',
        title: 'Giai Đoạn 3: Luyện Đề Thực Chiến & Khóa Điểm Rơi',
        timeframe: 'Tháng 4 - Tháng 6',
        objective: 'Mô phỏng áp lực phòng thi thật, canh chuẩn thời gian 120p (Toán/Văn) và 60-90p (Anh), rèn tâm lý không mất điểm oan.',
        status: 'upcoming',
        targetScoreRange: '8.5 - 9.5+ điểm',
        keyMilestones: [
            'Làm tối thiểu 20 đề thi chính thức của Sở GD&ĐT tỉnh nhà qua các năm.',
            'Khắc phục 100% các lỗi mất điểm: Quên ĐKXĐ, thiếu đơn vị, sai chính tả văn học, nhầm thì tiếng Anh.',
            'Rèn kỹ năng phân bổ thời gian: 45p làm 7 điểm đầu, 45p làm câu phân loại, 30p soát bài tỉ mỉ.'
        ]
    }
];

// -----------------------------------------------------------------------------
// 7. MẪU BÀI CHẤM TỰ LUẬN BAREM 0.25đ (CORRECTION LAB SAMPLES)
// -----------------------------------------------------------------------------
export const TS10_SAMPLE_CORRECTIONS = [
    {
        id: 'sub_math_01',
        subject: 'Toán học',
        studentName: 'Trần Minh Hoàng',
        examName: 'Đề Thi Thử Vào 10 - Trường THCS Chu Văn An',
        problemTitle: 'Câu 2.2: Hệ thức Vi-ét có chứa tham số m',
        maxScore: 1.5,
        gradedScore: 1.0,
        submissionImageText: `Cho pt: x^2 - (2m+1)x + m^2 + m = 0 (1).
Bài làm:
Theo định lý Vi-et ta có:
x1 + x2 = 2m + 1
x1.x2 = m^2 + m
Để x1^2 + x2^2 = 5:
<=> (x1+x2)^2 - 2x1x2 = 5
<=> (2m+1)^2 - 2(m^2+m) = 5
<=> 4m^2 + 4m + 1 - 2m^2 - 2m = 5
<=> 2m^2 + 2m - 4 = 0
<=> m^2 + m - 2 = 0
<=> m = 1 hoặc m = -2.
Vậy m = 1 hoặc m = -2.`,
        teacherAnnotations: [
            {
                line: 'Đầu bài làm',
                type: 'LỖI THIẾU BƯỚC NGHIÊM TRỌNG',
                penalty: '-0.50 điểm',
                comment: '❌ THIẾU TÍNH DELTA: Em chưa tính biệt thức Delta để tìm điều kiện cho phương trình có 2 nghiệm phân biệt! Phương trình chỉ có x1, x2 khi Delta >= 0. Cụ thể: Delta = (2m+1)^2 - 4(m^2+m) = 1 > 0 với mọi m. Dù delta luôn dương nhưng bắt buộc phải trình bày bước này trong bài thi!'
            },
            {
                line: 'Phần biến đổi Vi-ét',
                type: 'ĐÚNG CHÍNH XÁC',
                points: '+1.00 điểm',
                comment: '✅ Biến đổi hằng đẳng thức (x1+x2)^2 - 2x1x2 và giải phương trình bậc hai theo m chính xác.'
            }
        ],
        rubricBreakdown: [
            { criterion: 'Tính Delta và kết luận phương trình luôn có 2 nghiệm', max: 0.5, earned: 0.0, note: 'Bị trừ toàn bộ điểm ý này do không tính Delta' },
            { criterion: 'Áp dụng đúng định lý Vi-ét', max: 0.25, earned: 0.25, note: 'Đúng' },
            { criterion: 'Biến đổi biểu thức đối xứng x1^2 + x2^2', max: 0.25, earned: 0.25, note: 'Đúng' },
            { criterion: 'Giải phương trình ẩn m và kết luận', max: 0.5, earned: 0.5, note: 'Đúng' }
        ]
    },
    {
        id: 'sub_lit_01',
        subject: 'Ngữ Văn',
        studentName: 'Lê Nguyễn Quỳnh Anh',
        examName: 'Đề Thi Thử Vào 10 - Quận 1 (TP.HCM)',
        problemTitle: 'Nghị luận xã hội: Ý nghĩa của lòng biết ơn trong cuộc sống (Đoạn 200 chữ)',
        maxScore: 2.0,
        gradedScore: 1.75,
        submissionImageText: `Trong hành trình hoàn thiện nhân cách của mỗi con người, lòng biết ơn chính là sợi dây nối kết trái tim với trái tim. Biết ơn là sự trân trọng, ghi nhớ công lao và tấm lòng mà người khác đã dành cho mình. Khi biết ơn, ta không chỉ nuôi dưỡng một tâm hồn ấm áp mà còn lan tỏa năng lượng tích cực đến cộng đồng. Như hình ảnh các bạn trẻ tình nguyện viên trong đợt cứu trợ bão lũ miền Trung vừa qua, họ sẵn sàng xông pha vào vùng nguy hiểm chính là để tri ân mảnh đất đã cưu mang mình. Tuy nhiên, trong xã hội hiện nay vẫn còn một số người sống vô cảm, "ăn cháo đá bát", quên đi nguồn cội. Là một học sinh đang ngồi trên ghế nhà trường, em nhận thức sâu sắc rằng lòng biết ơn không nằm ở những lời nói hoa mỹ mà phải được thể hiện bằng hành động cụ thể: chăm chỉ học tập, kính trọng thầy cô và hiếu thảo với cha mẹ mỗi ngày.`,
        teacherAnnotations: [
            {
                line: 'Mở đoạn & Giải thích',
                type: 'ĐÚNG BAREM',
                points: '+0.50 điểm',
                comment: '✅ Mở đoạn tự nhiên, cắt nghĩa được khái niệm lòng biết ơn ngắn gọn, súc tích.'
            },
            {
                line: 'Dẫn chứng thực tế',
                type: 'CẦN LÀM RÕ HƠN',
                penalty: '-0.25 điểm',
                comment: '⚠️ Dẫn chứng về các bạn trẻ tình nguyện viên rất ý nghĩa nhưng cách lập luận gắn với "lòng biết ơn" hơi khiên cưỡng. Nên gắn dẫn chứng với việc học sinh tri ân thầy cô hoặc con cái đền đáp công ơn cha mẹ để sát thực tế hơn.'
            },
            {
                line: 'Phản biện & Bài học',
                type: 'RẤT TỐT',
                points: '+0.75 điểm',
                comment: '✅ Phản đề sắc sảo (phê phán thói vô cảm) và bài học hành động gắn liền với bản thân học sinh.'
            }
        ],
        rubricBreakdown: [
            { criterion: 'Đúng hình thức đoạn văn (không ngắt dòng, dung lượng 200 chữ)', max: 0.25, earned: 0.25, note: 'Chuẩn' },
            { criterion: 'Xác định đúng vấn đề nghị luận & Giải thích', max: 0.5, earned: 0.5, note: 'Rất rõ ràng' },
            { criterion: 'Bàn luận, phân tích & Dẫn chứng thực tế', max: 0.75, earned: 0.5, note: 'Dẫn chứng cần sắc nét hơn' },
            { criterion: 'Phản đề, bài học nhận thức & Diễn đạt, chính tả', max: 0.5, earned: 0.5, note: 'Chính tả tốt, hành văn mượt mà' }
        ]
    }
];
