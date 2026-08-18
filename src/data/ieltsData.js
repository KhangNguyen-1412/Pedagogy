// =============================================================================
// PEDAGOGY IELTS ACADEMIC SUITE - COMPREHENSIVE PEDAGOGICAL DATABASE
// Designed for rigorous academic training, deep rubrics analysis, and interactive labs
// =============================================================================

export const IELTS_SKILLS = [
    { id: 'listening', name: 'Nghe (Listening)', code: 'LIS', color: '#124874', icon: 'Headphones', desc: 'Luyện tai, phản xạ bắt từ khóa & tránh bẫy distractors' },
    { id: 'reading', name: 'Đọc (Reading)', code: 'REA', color: '#0D6E6E', icon: 'BookOpen', desc: 'Tốc độ xử lý văn bản, Skimming/Scanning & Paraphrasing' },
    { id: 'writing', name: 'Viết (Writing)', code: 'WRI', color: '#CF373D', icon: 'PenTool', desc: 'Tư duy logic PEEL, ngữ pháp chuẩn xác & Coherence' },
    { id: 'speaking', name: 'Nói (Speaking)', code: 'SPE', color: '#D97706', icon: 'Mic', desc: 'Phản xạ 5W1H, độ trôi chảy & ngữ điệu tự nhiên' },
];

export const IELTS_PRACTICE_ZONES = [
    { id: 'methodology', label: 'Phương Pháp & Tiêu Chí', icon: 'GraduationCap', desc: 'Giải phẫu Band Descriptors, Khung tư duy PEEL/5W1H & Bẫy kinh điển' },
    { id: 'drills', label: 'Kho Drills Chuyên Sâu', icon: 'Target', desc: 'Bài tập ngắn 3-5 phút theo từng dạng câu hỏi với giải thích bẫy chi tiết' },
    { id: 'writing_lab', label: 'Writing Lab', icon: 'FileEdit', desc: 'Giao diện Split-Screen, đếm từ real-time, đồng hồ 20/40p & dàn ý PEEL' },
    { id: 'speaking_lab', label: 'Speaking Lab', icon: 'Mic2', desc: 'Trạm ghi âm trực tiếp, Cue Card Part 2, sơ đồ tư duy & phản xạ 5W1H' },
    { id: 'simulator', label: 'Phòng Thi Thử (Simulator)', icon: 'Clock', desc: 'Mô phỏng thi máy Computer-delivered IELTS (Section & Full Test 3h)' },
    { id: 'gym', label: 'Language Gym', icon: 'Dumbbell', desc: 'Flashcards Collocations/Register & Trắc nghiệm Ngữ pháp nâng band 7.0+' },
    { id: 'analytics', label: 'Chẩn Đoán & Báo Cáo', icon: 'TrendingUp', desc: 'Diagnostic Placement, Phân tích lỗ hổng (Gap Analysis) & Lộ trình' }
];

// -----------------------------------------------------------------------------
// 1. ACADEMIC RUBRICS & BAND DESCRIPTORS (Writing & Speaking)
// -----------------------------------------------------------------------------
export const IELTS_RUBRICS = {
    writing: {
        task1_criteria: [
            { code: 'TA', name: 'Task Achievement', weight: '25%', desc: 'Mức độ đáp ứng yêu cầu đề bài, tóm tắt thông tin quan trọng và tổng quan rõ ràng (Overview).' },
            { code: 'CC', name: 'Coherence & Cohesion', weight: '25%', desc: 'Tính mạch lạc, tổ chức đoạn văn logic và sử dụng từ nối tự nhiên, chính xác.' },
            { code: 'LR', name: 'Lexical Resource', weight: '25%', desc: 'Vốn từ vựng phong phú, sử dụng chính xác collocations và hạn chế lỗi chính tả.' },
            { code: 'GRA', name: 'Grammatical Range & Accuracy', weight: '25%', desc: 'Sự đa dạng cấu trúc câu (phức, ghép, bị động, mệnh đề quan hệ) và độ chính xác ngữ pháp.' }
        ],
        task2_criteria: [
            { code: 'TR', name: 'Task Response', weight: '25%', desc: 'Trả lời đầy đủ tất cả các phần của đề bài, lập luận có chiều sâu và lập trường nhất quán.' },
            { code: 'CC', name: 'Coherence & Cohesion', weight: '25%', desc: 'Bố cục chặt chẽ theo mô hình PEEL, chuyển ý mượt mà giữa các đoạn và câu.' },
            { code: 'LR', name: 'Lexical Resource', weight: '25%', desc: 'Sử dụng từ vựng học thuật chính xác theo ngữ vực (Register), collocations đắt giá.' },
            { code: 'GRA', name: 'Grammatical Range & Accuracy', weight: '25%', desc: 'Sử dụng linh hoạt các cấu trúc ngữ pháp nâng cao (đảo ngữ, câu điều kiện, câu chẻ).' }
        ],
        band_descriptors: [
            {
                band: '8.0 - 9.0 (Expert / Very Good)',
                TA: 'Bao quát đầy đủ yêu cầu bài thi; Nêu bật các điểm then chốt và xu hướng nổi bật một cách chuẩn xác, Overview cực kỳ sắc nét.',
                TR: 'Giải quyết toàn diện tất cả các khía cạnh của đề; Lập trường rõ ràng xuyên suốt bài; Luận điểm được mở rộng sâu sắc và hỗ trợ thuyết phục.',
                CC: 'Sử dụng liên từ một cách vô hình, tự nhiên (seamless cohesion); Phân đoạn hoàn hảo, mỗi đoạn một trọng tâm ý tưởng duy nhất.',
                LR: 'Sử dụng từ ngữ học thuật phong phú, linh hoạt và chuẩn xác; Sử dụng nhuần nhuyễn collocations hiếm gặp; Sai sót chính tả cực kỳ hiếm (lỗi ngẫu nhiên).',
                GRA: 'Sử dụng đa dạng các cấu trúc phức tạp một cách tự nhiên và chính xác tuyệt đối; Hầu như không có lỗi ngữ pháp nào.'
            },
            {
                band: '7.0 (Good User)',
                TA: 'Đáp ứng tốt các yêu cầu; Đưa ra Overview rõ ràng về xu hướng chính; Có phân tích các số liệu/đặc điểm quan trọng nhưng đôi lúc có thể mở rộng sâu hơn.',
                TR: 'Trả lời đầy đủ các phần của đề bài; Có quan điểm rõ ràng xuyên suốt; Luận điểm được phát triển tốt, dù đôi khi còn một vài chỗ chưa mở rộng tối đa.',
                CC: 'Tổ chức thông tin mạch lạc; Sử dụng đa dạng các từ nối (linking devices) dù đôi lúc còn hơi máy móc; Chia đoạn văn hợp lý.',
                LR: 'Vốn từ đủ phong phú để thể hiện ý tưởng linh hoạt; Sử dụng được một số collocations và từ vựng ít phổ biến (less common); Có thể có vài lỗi nhỏ về chọn từ/chính tả.',
                GRA: 'Sử dụng thường xuyên các câu phức; Đa số các câu không có lỗi; Kiểm soát tốt ngữ pháp và dấu câu dù vẫn có thể xuất hiện vài lỗi nhỏ ngẫu nhiên.'
            },
            {
                band: '6.0 (Competent User)',
                TA: 'Đáp ứng được yêu cầu của đề bài; Có Overview nhưng có thể chưa rõ ràng hoặc thiếu số liệu quan trọng; Một số chi tiết có thể bị tập trung quá mức hoặc thiếu.',
                TR: 'Đề cập đến tất cả các phần của câu hỏi; Quan điểm nhìn chung rõ ràng nhưng kết luận có thể chưa thật sắc bén; Luận điểm chính được nêu nhưng chưa giải thích sâu.',
                CC: 'Sắp xếp thông tin có trật tự; Sử dụng từ nối nhưng có thể bị lặp lại hoặc dùng sai chỗ; Phân đoạn chưa hoàn toàn hợp lý ở một số vị trí.',
                LR: 'Vốn từ đủ dùng cho bài viết; Cố gắng dùng từ vựng phức tạp nhưng còn sai sót về ngữ cảnh hoặc ngữ pháp của từ (word formation).',
                GRA: 'Kết hợp cả câu đơn và câu phức; Câu phức thường mắc lỗi ngữ pháp hoặc dấu câu dù người đọc vẫn có thể hiểu được ý chính.'
            },
            {
                band: '5.0 (Modest User)',
                TA: 'Chỉ đáp ứng được một phần yêu cầu; Thiếu Overview tổng quan hoặc Overview không chính xác; Số liệu bị liệt kê rời rạc.',
                TR: 'Chỉ trả lời được một phần đề bài; Lập trường không rõ ràng hoặc mâu thuẫn; Luận điểm bị hạn chế hoặc không liên quan.',
                CC: 'Bài viết thiếu tính liên kết; Lạm dụng hoặc dùng sai từ nối; Không chia đoạn hoặc chia đoạn lộn xộn.',
                LR: 'Vốn từ hạn chế, lặp từ nghiêm trọng; Dùng sai từ gây khó hiểu cho người đọc.',
                GRA: 'Chỉ sử dụng được các cấu trúc câu đơn giản; Câu phức thường bị lỗi nặng làm cản trở việc tiếp nhận thông tin.'
            }
        ]
    },
    speaking: {
        criteria: [
            { code: 'FC', name: 'Fluency & Coherence', weight: '25%', desc: 'Độ trôi chảy, tốc độ nói tự nhiên, khả năng duy trì câu trả lời dài và liên kết ý tưởng.' },
            { code: 'LR', name: 'Lexical Resource', weight: '25%', desc: 'Khả năng sử dụng từ vựng đa dạng, idioms, phrasal verbs và collocations tự nhiên theo ngữ cảnh nói.' },
            { code: 'GRA', name: 'Grammatical Range & Accuracy', weight: '25%', desc: 'Sử dụng linh hoạt các cấu trúc ngữ pháp trong văn nói và độ chuẩn xác.' },
            { code: 'PR', name: 'Pronunciation', weight: '25%', desc: 'Phát âm chuẩn từng âm tiết, trọng âm từ (word stress), trọng âm câu (sentence stress) và ngữ điệu (intonation).' }
        ],
        band_descriptors: [
            {
                band: '8.0 - 9.0',
                FC: 'Nói trôi chảy tự nhiên, chỉ ngập ngừng để suy nghĩ ý tưởng chứ không phải tìm từ; Phát triển chủ đề mạch lạc, sâu sắc.',
                LR: 'Sử dụng vốn từ phong phú, linh hoạt; Sử dụng thành ngữ (idioms) và collocations tự nhiên đúng văn cảnh nói.',
                GRA: 'Sử dụng đa dạng và chính xác các cấu trúc câu; Hầu như không có lỗi sai hoặc chỉ là lỗi vấp nhỏ tự sửa được ngay.',
                PR: 'Phát âm cực kỳ rõ ràng, ngữ điệu tự nhiên truyền tải cảm xúc và trọng tâm thông tin xuất sắc.'
            },
            {
                band: '7.0',
                FC: 'Có thể nói dài mà không cần nỗ lực quá lớn; Đôi lúc có thể ngập ngừng hoặc lặp từ khi xử lý ý tưởng phức tạp; Dùng từ nối linh hoạt.',
                LR: 'Vốn từ đa dạng để thảo luận nhiều chủ đề; Dùng được một số idioms và collocations tự nhiên dù thỉnh thoảng có chút gượng ép.',
                GRA: 'Sử dụng đa dạng các câu phức với độ chính xác cao; Có thể có vài lỗi ngữ pháp nhỏ nhưng không ảnh hưởng đến sự thông suốt.',
                PR: 'Phát âm chuẩn xác đa số các âm; Kiểm soát tốt trọng âm và ngữ điệu, dễ nghe hiểu xuyên suốt bài nói.'
            },
            {
                band: '6.0',
                FC: 'Có khả năng nói dài dù đôi khi phải dừng lại để tự sửa lỗi hoặc tìm cấu trúc câu; Sử dụng được các từ nối cơ bản nhưng đôi khi bị lạm dụng.',
                LR: 'Vốn từ đủ để thảo luận các chủ đề quen thuộc và một số chủ đề trừu tượng; Cố gắng dùng idioms nhưng thường dùng sai ngữ cảnh.',
                GRA: 'Kết hợp được câu đơn và câu phức nhưng độ chính xác chưa cao ở các câu phức; Lỗi ngữ pháp xuất hiện thường xuyên nhưng người nghe vẫn hiểu.',
                PR: 'Phát âm nhìn chung rõ ràng; Có thể còn một số lỗi phát âm cục bộ hoặc phát âm sai trọng âm từ.'
            }
        ]
    }
};

// -----------------------------------------------------------------------------
// 2. COGNITIVE METHODOLOGIES & FRAMEWORKS
// -----------------------------------------------------------------------------
export const IELTS_METHODOLOGIES = [
    {
        id: 'peel_framework',
        skill: 'writing',
        title: 'Mô Hình Tư Duy Lập Luận Đoạn Văn PEEL',
        subtitle: 'Khung cấu trúc vàng để đạt điểm tối đa tiêu chí Coherence & Task Response trong Writing Task 2',
        steps: [
            { code: 'P', name: 'Point (Luận điểm)', desc: 'Câu chủ đề (Topic Sentence) nêu bật trực tiếp luận điểm cốt lõi của đoạn văn. Tránh viết vòng vo.', example: 'First and foremost, investing in public transport systems significantly mitigates urban air pollution.' },
            { code: 'E1', name: 'Evidence / Explanation (Dẫn chứng & Giải thích)', desc: 'Giải thích cơ chế logic hoặc nguyên nhân - hệ quả của luận điểm. Trả lời câu hỏi: Tại sao lại như vậy?', example: 'When commuters are provided with efficient and affordable subway networks, the reliance on private vehicles decreases drastically, leading to a substantial decline in exhaust emissions.' },
            { code: 'E2', name: 'Example (Ví dụ thực tế)', desc: 'Đưa ra một ví dụ cụ thể, có tính xác thực cao để củng cố luận điểm.', example: 'For instance, major metropolitan areas like Tokyo and Singapore have reported up to a 30% reduction in carbon emissions following the expansion of their electric rail networks.' },
            { code: 'L', name: 'Link (Liên kết)', desc: 'Câu chốt tóm lại tác động của luận điểm và liên kết trực tiếp trở lại câu hỏi đề bài.', example: 'Therefore, allocating state funds to green transit infrastructure is undeniably an effective solution to environmental degradation.' }
        ]
    },
    {
        id: '5w1h_framework',
        skill: 'speaking',
        title: 'Công Thức Phản Xạ Mở Rộng Ý 5W1H + Past/Present/Future',
        subtitle: 'Bí quyết giúp bài nói Speaking Part 1 & Part 2 trôi chảy, không bao giờ rơi vào tình trạng "cạn ý tưởng"',
        steps: [
            { code: 'What', name: 'What is it?', desc: 'Giới thiệu đối tượng chính bằng cách paraphrase lại câu hỏi của giám khảo kèm cảm xúc ban đầu.' },
            { code: 'Where & When', name: 'Where & When does it happen?', desc: 'Bổ sung ngữ cảnh không gian và thời gian cụ thể (kỷ niệm quá khứ hoặc thói quen hiện tại).' },
            { code: 'Why', name: 'Why do you like / dislike it?', desc: 'Đưa ra 2 lý do then chốt (nguyên nhân cảm xúc hoặc lợi ích thực tế).' },
            { code: 'How', name: 'How has it changed?', desc: 'So sánh trải nghiệm trong quá khứ so với hiện tại hoặc dự định trong tương lai.' }
        ]
    },
    {
        id: 'reading_skimming_scanning',
        skill: 'reading',
        title: 'Kỹ Năng Nhận Thức Skimming, Scanning & Paraphrasing',
        subtitle: 'Quy trình 3 bước xử lý mọi đoạn văn dài trong 20 phút mà không cần dịch từng chữ',
        steps: [
            { code: 'Skim', name: '1. Skimming (Đọc lướt định vị ý chính)', desc: 'Đọc câu đầu (Topic Sentence) và câu cuối của mỗi đoạn văn trong 2-3 phút đầu để vẽ sơ đồ tư duy toàn bài.' },
            { code: 'Scan', name: '2. Scanning (Đọc quét tọa độ từ khóa)', desc: 'Sử dụng mắt di chuyển ziczac tìm các từ khóa không thể paraphrase (Tên riêng, Số liệu, Năm, Thuật ngữ in hoa) trong câu hỏi.' },
            { code: 'Paraphrase', name: '3. Paraphrase Decoding (Giải mã từ đồng nghĩa)', desc: 'Nhận diện cặp từ tương đương giữa câu hỏi và bài đọc (Ví dụ: "cut down" = "deplete / diminish", "residents" = "local populace").' }
        ]
    },
    {
        id: 'listening_predicting',
        skill: 'listening',
        title: 'Chiến Thuật Đoán Trước Đáp Án (Predicting) & Nhận Diện Bẫy (Distractor Traps)',
        subtitle: 'Làm chủ khoảng thời gian trống 30 giây trước mỗi phần nghe để chủ động đón đầu thông tin',
        steps: [
            { code: 'Grammar', name: '1. Dự đoán loại từ (Part of Speech)', desc: 'Xác định chỗ trống cần danh từ số ít/nhiều, tính từ, động từ hay con số.' },
            { code: 'Context', name: '2. Dự đoán trường từ vựng (Semantic Field)', desc: 'Đoán chủ đề: Nếu đề nói về "Booking a room", từ cần điền có thể là loại phòng (single/double), tiện nghi (balcony/sea view) hoặc phương thức thanh toán.' },
            { code: 'Trap Warning', name: '3. Nhận diện bẫy sửa lời (Self-correction traps)', desc: 'Người nói đưa ra thông tin A, nhưng ngay sau đó dùng từ "Actually, sorry...", "I used to... but now..." để đổi sang đáp án B.' }
        ]
    }
];

// -----------------------------------------------------------------------------
// 3. DISTRACTOR ANALYSIS & COMMON L1 (VIETNAMESE) PITFALLS
// -----------------------------------------------------------------------------
export const IELTS_ERROR_ANALYSIS = [
    {
        id: 'l1_interference_1',
        type: 'Grammar & Syntax (L1 Transfer)',
        title: 'Lỗi cấu trúc câu "There are many people think that..."',
        vietnamesePattern: 'Người Việt có thói quen dịch "Có nhiều người nghĩ rằng..." thành "There are many people think that...".',
        academicCorrection: 'Động từ "are" và "think" bị trùng lặp vị ngữ trong câu đơn. Cần chuyển sang Mệnh đề quan hệ hoặc Rút gọn mệnh đề.',
        wrongExample: '❌ There are many students choose to study abroad after high school.',
        rightExample: '✅ A significant number of students opt to pursue higher education abroad after high school. (Hoặc: There are many students who choose...)',
        bandImpact: 'Kéo điểm tiêu chí GRA từ Band 7.0 xuống Band 5.5 - 6.0 vì lỗi sai cấu trúc câu cơ bản.'
    },
    {
        id: 'l1_interference_2',
        type: 'Lexicology & Register (Văn phong học thuật)',
        title: 'Lạm dụng các từ ngữ thân mật / văn nói trong Writing',
        vietnamesePattern: 'Dùng các từ quen thuộc trong văn nói như "a lot of", "kids", "get", "big problem" vào bài luận Writing Task 2.',
        academicCorrection: 'Thay thế bằng các từ vựng trang trọng (Academic Register) và chuẩn xác hơn.',
        wrongExample: '❌ The government should spend a lot of money to fix this big problem.',
        rightExample: '✅ The authorities ought to allocate substantial financial resources to address this pressing issue.',
        bandImpact: 'Ảnh hưởng trực tiếp đến tiêu chí Lexical Resource (Band 6.0 nếu từ ngữ thiếu tính học thuật).'
    },
    {
        id: 'distractor_reading_tfn',
        type: 'Reading Trap: True / False / Not Given',
        title: 'Bẫy quy nạp quá mức (Over-Generalization Trap)',
        vietnamesePattern: 'Đề bài dùng các từ tuyệt đối như "Always, Never, All, Only" trong khi bài đọc chỉ dùng "Often, Tend to, Some".',
        academicCorrection: 'Nếu bài đọc chỉ nói một nhóm đối tượng có xu hướng làm việc X, mà câu hỏi khẳng định "MỌI NGƯỜI LUÔN LÀM VIỆC X", đáp án là FALSE (chứ không phải Not Given).',
        wrongExample: 'Bài đọc: "Smartphones tend to cause distractions among teenagers." -> Câu hỏi: "All teenagers are distracted by smartphones." -> Chọn True vì thấy có từ khóa.',
        rightExample: 'Đáp án chuẩn: FALSE. Sự khác biệt giữa "tend to" (có xu hướng) và "all" (tất cả) tạo nên mâu thuẫn trực tiếp.',
        bandImpact: 'Là nguyên nhân phổ biến nhất khiến thí sinh mất điểm ở Band 6.5 Reading.'
    }
];

// -----------------------------------------------------------------------------
// 4. ADVANCED LINGUISTICS & LEXICOLOGY (Collocations, Register, Syntax)
// -----------------------------------------------------------------------------
export const IELTS_LINGUISTICS = [
    {
        id: 'collocations_environment',
        topic: 'Environment & Climate Change',
        items: [
            { term: 'Exert pressure on', type: 'Collocation', meaning: 'Gây áp lực nặng nề lên...', example: 'Rapid urbanisation exerts immense pressure on natural ecosystems.' },
            { term: 'Precipitate irreversible damage', type: 'High-Band Verb + Noun', meaning: 'Gây ra những thiệt hại không thể đảo ngược', example: 'Deforestation precipitates irreversible damage to biodiversity.' },
            { term: 'Shift towards renewables', type: 'Academic Collocation', meaning: 'Chuyển dịch sang năng lượng tái tạo', example: 'Governments must expedite the shift towards renewable energy sources.' }
        ]
    },
    {
        id: 'syntax_inversion',
        topic: 'Complex Syntax (Đảo ngữ nâng cao Band 8.0+)',
        items: [
            { term: 'Not only... but also (Inversion)', type: 'Inversion Structure', formula: 'Not only + Trợ động từ + S + V..., but S also...', example: 'Not only does tourism stimulate local economies, but it also fosters cross-cultural understanding.' },
            { term: 'Under no circumstances', type: 'Negative Adverb Inversion', formula: 'Under no circumstances + should/must + S + V...', example: 'Under no circumstances should the safety of laboratory personnel be compromised.' }
        ]
    }
];

// -----------------------------------------------------------------------------
// 5. SKILL DRILLS DATABASE (Interactive 3-5m Exercises with Explanation)
// -----------------------------------------------------------------------------
export const IELTS_DRILLS = [
    {
        id: 'drill_lis_01',
        skill: 'listening',
        questionType: 'Form Completion',
        targetBand: '6.0 - 7.0',
        title: 'Customer Service Inquiry - Hotel Booking',
        duration: '3 phút',
        audioUrl: 'https://cdn.freesound.org/previews/518/518887_11294862-lq.mp3',
        tapescript: `Receptionist: Good afternoon, Grand Palace Hotel. How may I assist you today?
Customer: Hello, I'd like to book a conference room for our annual marketing seminar on the 14th of November.
Receptionist: Certainly, sir. For how many attendees would that be?
Customer: Well, initially we thought of 50 people, but after confirming with our branch offices, the total number will be [45 participants].
Receptionist: Wonderful. And regarding audio-visual equipment, do you require a wireless projector and microphones?
Customer: Yes, absolutely. We will also need high-speed [Wi-Fi] connection for all our delegates throughout the afternoon session.
Receptionist: Noted. Could I have your company's full billing address, please?
Customer: Sure, it's 24 [Highland Road], Edinburgh.`,
        highlightPositions: ['45 participants', 'Wi-Fi', 'Highland Road'],
        questions: [
            {
                id: 'q1',
                label: '1. Total number of confirmed attendees:',
                correctAnswer: '45',
                distractorNotes: 'Bẫy sửa lời (Self-Correction Trap): Người gọi ban đầu nhắc đến con số "50 people", nhưng sau đó đính chính lại là "45" sau khi kiểm tra với các chi nhánh.',
                synonymMap: 'initially thought (50) -> total confirmed number (45)'
            },
            {
                id: 'q2',
                label: '2. Additional technical requirement:',
                correctAnswer: 'Wi-Fi',
                distractorNotes: 'Người tiếp tân hỏi về "projector and microphones", nhưng khách hàng nhấn mạnh yêu cầu bổ sung là "high-speed Wi-Fi".',
                synonymMap: 'require -> will also need'
            },
            {
                id: 'q3',
                label: '3. Company street address: 24 ______',
                correctAnswer: 'Highland Road',
                distractorNotes: 'Cần chú ý chính tả viết hoa tên đường riêng.',
                synonymMap: 'billing address -> street address'
            }
        ]
    },
    {
        id: 'drill_rea_01',
        skill: 'reading',
        questionType: 'True / False / Not Given',
        targetBand: '6.5 - 7.5',
        title: 'The Psychological Impact of Urban Green Spaces',
        duration: '4 phút',
        passage: `Recent empirical investigations conducted by environmental psychologists indicate that regular exposure to urban foliage exerts a profound restorative influence on human cognitive performance. In a study involving over 1,200 office workers in Scandinavian capitals, researchers observed that individuals whose desks offered unobstructed views of parks demonstrated a 23% reduction in cortisol levels—the primary biological marker of chronic stress. 

However, the researchers emphasized that the aesthetic appeal alone does not account for the entirety of psychological benefits; rather, the multisensory dimension, encompassing birdsong and the scent of damp soil, actively facilitates involuntary attention recovery. While some municipal planners argue that artificial indoor plants provide an equivalent psychological buffer, the data revealed that synthetic greenery failed to produce any statistically measurable improvement in long-term mental fatigue.`,
        questions: [
            {
                id: 'rq1',
                question: '1. Workers with views of natural parks had lower stress hormone levels compared to those without.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correctAnswer: 'TRUE',
                explanation: 'Đoạn 1 chỉ ra: "...whose desks offered unobstructed views of parks demonstrated a 23% reduction in cortisol levels—the primary biological marker of chronic stress."',
                evidenceLocation: 'Đoạn 1, Dòng 3-5',
                synonymMap: 'lower stress hormone levels = 23% reduction in cortisol levels (primary biological marker of chronic stress)'
            },
            {
                id: 'rq2',
                question: '2. Visual appearance is the single most important factor contributing to mental restoration in parks.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correctAnswer: 'FALSE',
                explanation: 'Đoạn 2 nêu rõ: "...aesthetic appeal alone does not account for the entirety of psychological benefits; rather, the multisensory dimension... actively facilitates attention recovery." Do đó, tuyên bố rằng yếu tố thị giác là yếu tố duy nhất/quan trọng nhất là SAI (FALSE).',
                evidenceLocation: 'Đoạn 2, Dòng 1-3',
                synonymMap: 'visual appearance = aesthetic appeal; single most important factor >< does not account for the entirety'
            },
            {
                id: 'rq3',
                question: '3. Artificial indoor plants were found to be cheaper to maintain than living trees.',
                options: ['TRUE', 'FALSE', 'NOT GIVEN'],
                correctAnswer: 'NOT GIVEN',
                explanation: 'Bài đọc có nhắc đến "synthetic greenery" (cây nhân tạo) về mặt tác dụng tâm lý, nhưng HOÀN TOÀN KHÔNG đề cập đến chi phí bảo dưỡng (cost of maintenance). Do đó đáp án là NOT GIVEN.',
                evidenceLocation: 'Đoạn 2, Dòng 4-6',
                synonymMap: 'Không có thông tin so sánh chi phí trong bài đọc'
            }
        ]
    },
    {
        id: 'drill_wri_01',
        skill: 'writing',
        questionType: 'Paraphrasing & Sentence Transformation',
        targetBand: '7.0+',
        title: 'Academic Paraphrasing for Writing Task 2 Introductions',
        duration: '5 phút',
        instructions: 'Viết lại các câu đề bài sau bằng cách sử dụng cấu trúc bị động, danh từ hóa (Nominalisation) hoặc từ vựng tương đương nâng cao.',
        exercises: [
            {
                original: 'Many people believe that universities should focus only on providing skills for future jobs.',
                suggestedBand8: 'It is widely contended that tertiary institutions ought to restrict their curriculum exclusively to career-oriented competencies.',
                hint: 'Thay "universities" bằng "tertiary institutions", "focus on" bằng "restrict their curriculum to", "skills for future jobs" bằng "career-oriented competencies".'
            },
            {
                original: 'Traffic congestion is getting worse in big cities because of the increasing number of private cars.',
                suggestedBand8: 'Gridlock in metropolitan areas is escalating at an unprecedented pace, predominantly precipitated by the proliferation of private automobiles.',
                hint: 'Dùng từ "Gridlock" thay cho "Traffic congestion", "proliferation" thay cho "increasing number".'
            }
        ]
    }
];

// -----------------------------------------------------------------------------
// 6. VIRTUAL LABS: WRITING LAB PROMPTS & SAMPLE ESSAYS
// -----------------------------------------------------------------------------
export const IELTS_WRITING_TASKS = [
    {
        id: 'w_task1_line_graph',
        type: 'Task 1 (Academic Report)',
        topic: 'Renewable Energy Consumption (1980 - 2020)',
        timeLimitMinutes: 20,
        recommendedWords: 150,
        prompt: `The line graph below illustrates the percentage of total electricity generated from renewable sources in four European countries between 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
        graphData: {
            years: ['1980', '1990', '2000', '2010', '2020'],
            countries: [
                { name: 'Germany', data: [12, 15, 25, 40, 58] },
                { name: 'Norway', data: [65, 70, 75, 82, 92] },
                { name: 'France', data: [20, 22, 24, 28, 35] },
                { name: 'United Kingdom', data: [5, 8, 14, 26, 48] }
            ]
        },
        outlineGuide: {
            introduction: 'Paraphrase đề bài (The line graph compares four European nations in terms of renewable electricity generation from 1980 to 2020).',
            overview: 'Nêu 2 đặc điểm nổi bật nhất: Na Uy luôn dẫn đầu với tỷ lệ áp đảo, trong khi Đức và Anh chứng kiến mức tăng trưởng ngoạn mục nhất.',
            body1: 'Phân tích chi tiết số liệu của Na Uy (từ 65% lên 92%) và Pháp (tăng nhẹ từ 20% lên 35%).',
            body2: 'Phân tích chi tiết sự bứt phá của Đức (từ 12% lên 58%) và Vương quốc Anh (tăng vọt gần gấp 10 lần từ 5% lên 48%).'
        },
        sampleEssayBand85: {
            title: 'Sample Task 1 Report - Band 8.5 (Examiner Standard)',
            content: `The line graph illustrates the proportion of electricity produced from renewable resources across four European countries—namely Germany, Norway, France, and the United Kingdom—over a 40-year period from 1980 to 2020.

Overall, it is immediately evident that all four nations experienced an upward trajectory in green power generation throughout the timeline. Norway consistently maintained its commanding lead, whereas Germany and the UK demonstrated the most dramatic surges in clean energy adoption.

At the start of the period in 1980, Norway was by far the dominant producer, with green electricity comprising 65% of its total output. This figure climbed steadily to reach an impressive peak of 92% in 2020. In contrast, France started at 20% and exhibited only a modest, gradual ascent to finish at 35% by the end of the timeframe.

Meanwhile, Germany and the United Kingdom embarked from relatively humble beginnings, at 12% and 5% respectively in 1980. However, both nations witnessed accelerated growth from 2000 onwards. Germany's share escalated nearly fivefold to reach 58% by 2020, while the UK registered a nearly tenfold surge, culminating at 48% and successfully overtaking France by 2010.`,
            examinerComments: [
                { criteria: 'Task Achievement (Band 9.0)', comment: 'Overview cực kỳ rõ ràng, nêu bật được vị thế dẫn đầu của Na Uy và xu hướng tăng vọt của Đức/Anh; số liệu chọn lọc chính xác và so sánh sắc bén.' },
                { criteria: 'Coherence & Cohesion (Band 8.5)', comment: 'Chia đoạn mạch lạc theo nhóm nước, sử dụng từ nối thời gian và chuyển đoạn ("Overall", "At the start", "Meanwhile") rất tự nhiên.' },
                { criteria: 'Lexical Resource (Band 8.5)', comment: 'Từ vựng miêu tả biểu đồ xuất sắc: "commanding lead", "upward trajectory", "dramatic surges", "modest gradual ascent", "escalated nearly fivefold".' },
                { criteria: 'GRA (Band 8.5)', comment: 'Cấu trúc so sánh đa dạng ("by far the dominant", "nearly tenfold surge, culminating at..."), không có lỗi ngữ pháp.' }
            ]
        }
    },
    {
        id: 'w_task2_tech_education',
        type: 'Task 2 (Essay)',
        topic: 'Technology & Education',
        timeLimitMinutes: 40,
        recommendedWords: 250,
        prompt: `Some people think that online learning will completely replace traditional classroom teaching in universities in the near future. 
To what extent do you agree or disagree with this statement? Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
        outlineGuide: {
            introduction: 'Paraphrase đề bài + Nêu rõ quan điểm (Ví dụ: Hoàn toàn không đồng ý hoặc Chỉ đồng ý một phần).',
            body1: 'Thừa nhận sự bùng nổ và ưu điểm của E-learning (Tính linh hoạt, tiết kiệm chi phí, tiếp cận học liệu toàn cầu).',
            body2: 'Khẳng định vai trò không thể thay thế của lớp học truyền thống (Tương tác trực tiếp giữa người với người, kỹ năng mềm, thực hành trong phòng thí nghiệm, kỷ luật học tập).',
            conclusion: 'Tóm lược lại luận điểm và khẳng định: Tương lai là mô hình kết hợp (Blended Learning) chứ không phải thay thế hoàn toàn.'
        },
        sampleEssayBand85: {
            title: 'Sample Essay - Band 8.5 (Examiner Standard)',
            content: `In the contemporary digital epoch, the rapid proliferation of electronic learning platforms has revolutionized tertiary education. While proponents assert that virtual classrooms will eventually render conventional lecture halls obsolete, I firmly disagree with this prediction. In my view, notwithstanding the unprecedented convenience offered by remote education, the multifaceted merits of in-person pedagogical engagement remain fundamentally irreplaceable.

On the one hand, it is undeniable that online learning confers substantial benefits, notably in terms of geographic accessibility and scheduling autonomy. Through internet-enabled modules, students residing in underprivileged or rural vicinities can access prestigious lectures from globally renowned institutions without incurring exorbitant relocation expenses. Furthermore, asynchronous instructional materials empower learners to pace their education according to individual cognitive capacities. These undeniable proficiencies have established distance education as an indispensable adjunct to modern academia.

Nevertheless, traditional university settings foster holistic interpersonal developments that algorithms and computer screens cannot replicate. Primarily, the physical classroom environment provides a vital crucible for real-time intellectual debates, immediate pedagogical feedback, and collaborative team dynamics. Engaging in spontaneous discussions alongside peers not only sharpens critical thinking but also cultivates essential soft skills, such as negotiation and emotional intelligence. Moreover, disciplines demanding tactile experimentation—such as medicine, surgical sciences, and chemical engineering—mandate hands-on laboratory access and direct supervision, which virtual simulations can only approximate superficially.

In conclusion, although digital instruction represents a monumental breakthrough in educational democratization, it lacks the interpersonal richness and experiential depth intrinsic to physical campuses. Therefore, rather than outright substitution, the future of higher education undoubtedly lies in the harmonious integration of both modalities via blended learning paradigms.`,
            examinerComments: [
                { criteria: 'Task Response (Band 9.0)', comment: 'Quan điểm rõ ràng xuyên suốt bài, các luận điểm đều được phát triển sâu với ví dụ và lập luận đa tầng.' },
                { criteria: 'Coherence & Cohesion (Band 8.5)', comment: 'Chuyển ý tự nhiên, sử dụng từ nối một cách nhuần nhuyễn, cấu trúc đoạn văn chuẩn PEEL.' },
                { criteria: 'Lexical Resource (Band 9.0)', comment: 'Sử dụng từ vựng cực kỳ trang trọng và chính xác: "digital epoch", "render obsolete", "scheduling autonomy", "crucible for intellectual debates".' },
                { criteria: 'GRA (Band 8.5)', comment: 'Sử dụng thuần thục câu phức, mệnh đề phân từ ("Engaging in spontaneous discussions..."), câu điều kiện và câu nhượng bộ ("notwithstanding the convenience...").' }
            ]
        }
    }
];

// -----------------------------------------------------------------------------
// 7. VIRTUAL LABS: SPEAKING LAB CUE CARDS & PROMPTS
// -----------------------------------------------------------------------------
export const IELTS_SPEAKING_TOPICS = [
    {
        id: 'sp_part1_hobbies',
        part: 'Part 1 (Introduction & Interview)',
        topic: 'Daily Routine & Leisure Time',
        cuePrompt: `Trả lời trực tiếp các câu hỏi phỏng vấn Part 1 bằng công thức 5W1H và mở rộng câu trả lời từ 2-3 câu:`,
        prepTimeSeconds: 0,
        talkTimeSeconds: 60,
        questions: [
            { q: 'What do you usually do in your spare time?', tip: 'Áp dụng 5W1H: Nêu sở thích + tần suất + cảm xúc mang lại.' },
            { q: 'Do you prefer spending your weekends outdoors or staying at home?', tip: 'So sánh: Chỉ ra ưu điểm của cả hai nhưng chọn một bên làm trọng tâm.' },
            { q: 'How has your leisure routine changed compared to when you were a child?', tip: 'Dùng thì Quá khứ đơn (used to) đối chiếu với Hiện tại hoàn thành.' }
        ],
        usefulVocab: [
            { word: 'Unwind and recharge', meaning: 'Thư giãn và nạp lại năng lượng' },
            { word: 'Sedentary pastimes', meaning: 'Các hoạt động giải trí ít vận động' },
            { word: 'Outdoor pursuits', meaning: 'Các hoạt động thể thao/dã ngoại ngoài trời' },
            { word: 'Drastic shift', meaning: 'Sự thay đổi rõ rệt, sâu sắc' }
        ]
    },
    {
        id: 'sp_cue_01',
        part: 'Part 2 (Cue Card)',
        topic: 'Describe an environmental project or event in your local area',
        cuePrompt: `You should say:
• What the project or event was
• Where and when it took place
• Who participated in it
and explain how effective you think this project was in raising environmental awareness.`,
        prepTimeSeconds: 60,
        talkTimeSeconds: 120,
        mindmapSuggestions: {
            what: 'Community Tree Planting & Plastic Waste Cleanup Initiative ("Green Neighborhood Project")',
            whereWhen: 'Public park along the Saigon River, held on World Environment Day last summer',
            who: 'Youth union volunteers, local residents, secondary school students and municipal authorities',
            whyEffective: 'Collected 2 tons of recyclable plastic, planted 500 saplings, fostered deep civic responsibility'
        },
        usefulVocab: [
            { word: 'Civic responsibility', meaning: 'Ý thức trách nhiệm công dân' },
            { word: 'Spearhead an initiative', meaning: 'Dẫn đầu một sáng kiến / chiến dịch' },
            { word: 'Galvanize public participation', meaning: 'Kêu gọi, thúc đẩy sự tham gia của cộng đồng' },
            { word: 'Tangible outcomes', meaning: 'Kết quả rõ ràng, hữu hình' }
        ]
    }
];

// -----------------------------------------------------------------------------
// 8. LANGUAGE GYM: FLASHCARDS & GRAMMAR QUIZZES
// -----------------------------------------------------------------------------
export const IELTS_VOCAB_FLASHCARDS = [
    {
        id: 'flash_01',
        topic: 'Environment & Urbanization',
        word: 'Proliferation',
        ipa: '/prəˌlɪf.əˈreɪ.ʃən/',
        partOfSpeech: 'noun',
        vietnameseMeaning: 'Sự gia tăng nhanh chóng, sự bùng nổ về số lượng',
        collocations: ['rapid proliferation of', 'proliferation of private vehicles', 'prevent the proliferation of nuclear weapons'],
        register: 'Formal / Academic Writing Task 2',
        exampleSentence: 'The rapid proliferation of personal automobiles has exacerbated traffic gridlock in modern metropolises.'
    },
    {
        id: 'flash_02',
        topic: 'Society & Economy',
        word: 'Precipitate',
        ipa: '/prɪˈsɪp.ɪ.teɪt/',
        partOfSpeech: 'verb',
        vietnameseMeaning: 'Gây ra, thúc đẩy một sự việc (thường mang tính tiêu cực) xảy ra đột ngột',
        collocations: ['precipitate an economic crisis', 'precipitate environmental degradation'],
        register: 'High-Band Academic Writing & Speaking Part 3',
        exampleSentence: 'Uncontrolled commercial exploitation can precipitate severe disruptions to local ecosystems.'
    },
    {
        id: 'flash_03',
        topic: 'Education & Psychology',
        word: 'Crucible',
        ipa: '/ˈkruː.sɪ.bəl/',
        partOfSpeech: 'noun',
        vietnameseMeaning: 'Nơi thử thách, môi trường rèn luyện khắc nghiệt tạo nên phẩm chất',
        collocations: ['crucible for critical thinking', 'crucible of leadership'],
        register: 'Band 8.0+ Metaphorical Academic Lexicon',
        exampleSentence: 'University debate clubs serve as a vital crucible for refining students’ persuasive communication skills.'
    },
    {
        id: 'flash_04',
        topic: 'Technology & AI',
        word: 'Ubiquitous',
        ipa: '/juːˈbɪk.wɪ.təs/',
        partOfSpeech: 'adjective',
        vietnameseMeaning: 'Có mặt ở khắp mọi nơi, phổ biến rộng rãi',
        collocations: ['ubiquitous presence of', 'ubiquitous technology', 'become increasingly ubiquitous'],
        register: 'Academic Writing & Speaking',
        exampleSentence: 'Smart devices have become ubiquitous in contemporary daily life.'
    }
];

export const IELTS_GRAMMAR_QUIZZES = [
    {
        id: 'g_quiz_01',
        title: 'Đảo ngữ với cụm từ phủ định (Negative Inversion)',
        question: 'Chọn câu viết lại đúng nhất cho câu: "The government should not neglect funding for renewable energy under any circumstances."',
        options: [
            'Under no circumstances should the government neglect funding for renewable energy.',
            'Under no circumstances the government should neglect funding for renewable energy.',
            'Under no circumstances does the government neglected funding for renewable energy.',
            'The government under no circumstances should neglect funding for renewable energy.'
        ],
        correctIndex: 0,
        explanation: 'Cấu trúc đảo ngữ với "Under no circumstances": Cụm phủ định + Modal verb (should) + Chủ ngữ (the government) + Động từ nguyên thể (neglect).'
    },
    {
        id: 'g_quiz_02',
        title: 'Mệnh đề quan hệ rút gọn dạng Phân từ hiện tại (Active Participle)',
        question: 'Chọn phương án kết hợp câu mượt mà nhất: "Many students graduate each year. They often struggle to find employment in their major."',
        options: [
            'Many students graduating each year often struggle to find employment in their major.',
            'Many students graduate each year, struggle to find employment in their major.',
            'Many students graduated each year struggling to find employment in their major.',
            'Many students who graduating each year often struggle to find employment in their major.'
        ],
        correctIndex: 0,
        explanation: '"Many students graduating each year..." là dạng rút gọn của mệnh đề chủ động "Many students who graduate each year...".'
    }
];

// -----------------------------------------------------------------------------
// 9. EXAM SIMULATOR: MOCK TEST DATA (Computer-Delivered IELTS Simulation)
// -----------------------------------------------------------------------------
export const IELTS_MOCK_TESTS = [
    {
        id: 'mock_cambridge_18_test_1',
        title: 'Cambridge Academic Practice Test - Full Section',
        level: 'Official Academic Format',
        totalQuestions: 40,
        durationMinutes: 60,
        sections: [
            {
                id: 'sec_1',
                title: 'Passage 1: Urban Architecture and Sustainable Microclimates',
                timeRecommended: '20 mins',
                text: `The design of urban spaces exerts a measurable influence on localized meteorological phenomena, a concept known scientifically as the urban microclimate. High-density concrete structures absorb solar radiation during daylight hours and re-radiate thermal energy throughout the evening, thereby precipitating the well-documented Urban Heat Island (UHI) effect.

In recent years, avant-garde architects in Singapore and Copenhagen have pioneered biomimetic cooling facades. By integrating vertical botanical gardens and aerodynamic wind-funneling breezeways into high-rise facades, ambient temperatures within pedestrian precincts have been reduced by as much as 3.5 degrees Celsius. These empirical breakthroughs substantiate the hypothesis that architectural engineering can effectively mitigate anthropogenically driven microclimate warming without excessive reliance on mechanical air conditioning.`,
                questions: [
                    { id: 'm1_q1', type: 'MCQ', question: '1. What primarily causes the Urban Heat Island effect according to paragraph 1?', options: ['Excessive use of glass in skyscrapers', 'Absorption and re-radiation of thermal energy by concrete', 'The scarcity of pedestrian walkways', 'High levels of traffic congestion'], correctIndex: 1 },
                    { id: 'm1_q2', type: 'TFNG', question: '2. Singapore and Copenhagen have successfully tested biomimetic cooling facades.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'TRUE' },
                    { id: 'm1_q3', type: 'TFNG', question: '3. Mechanical air conditioning systems are completely banned in new Singaporean skyscrapers.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'NOT GIVEN' }
                ]
            }
        ]
    }
];

// -----------------------------------------------------------------------------
// 10. DIAGNOSTIC PLACEMENT & GAP ANALYSIS
// -----------------------------------------------------------------------------
export const IELTS_DIAGNOSTIC_ITEMS = [
    {
        id: 'diag_01',
        skill: 'reading',
        questionType: 'Matching Headings',
        prompt: 'Đoạn văn sau có nội dung chính là gì: "While early agricultural practices depleted topsoil nutrients, modern regenerative farming restores microbial biodiversity through cover crops and zero-tillage techniques."',
        options: [
            'The historical evolution of soil restoration methods',
            'Economic advantages of zero-tillage farming',
            'How cover crops replace chemical fertilizers entirely'
        ],
        correctIndex: 0,
        skillEvaluated: 'Skimming & Synthesizing Central Theme'
    },
    {
        id: 'diag_02',
        skill: 'writing',
        questionType: 'Coherence & Linking',
        prompt: 'Từ nối nào phù hợp nhất để nối 2 vế biểu thị sự đối lập nhượng bộ trang trọng: "______ some critics argue that space exploration is wasteful, the technological spin-offs have yielded immense societal benefits."',
        options: ['Notwithstanding', 'While', 'In spite of'],
        correctIndex: 1,
        skillEvaluated: 'Complex Clause Linking & Concession'
    }
];

export const DEFAULT_IELTS_PROFILE = {
    targetBandOverall: '7.5',
    targetBands: {
        listening: '8.0',
        reading: '8.0',
        writing: '7.0',
        speaking: '7.0'
    },
    currentBands: {
        listening: '6.5',
        reading: '7.0',
        writing: '6.0',
        speaking: '6.0'
    },
    targetListening: '8.0',
    targetReading: '8.0',
    targetWriting: '7.0',
    targetSpeaking: '7.0',
    targetDate: '2026-11-20',
    examDate: '2026-11-20',
    currentEstimatedBand: '6.5',
    weakestSkills: ['Writing Task 2 (Coherence)', 'Reading (True/False/Not Given)'],
    weaknesses: [
        {
            skill: 'Writing Task 2',
            aspect: 'Coherence & Cohesion',
            issue: 'Sử dụng từ nối (Connectors) quá dày đặc nhưng thiếu tính liên kết ý tưởng logic (Underlying Logical Flow).',
            remedy: 'Áp dụng khung PEEL Paragraph Framework, tập trung triển khai câu giải thích sâu hơn.',
            priority: 'High'
        },
        {
            skill: 'Reading',
            aspect: 'True/False/Not Given',
            issue: 'Dễ suy diễn thông tin thực tế ngoài bài đọc thay vì bám sát văn bản của tác giả.',
            remedy: 'Luyện 10 bài drill dạng Distractor Traps để rèn phản xạ nhận biết Not Given.',
            priority: 'High'
        },
        {
            skill: 'Speaking',
            aspect: 'Fluency & Pronunciation',
            issue: 'Thường dừng lại ngập ngừng (hesitation) khi tìm từ vựng học thuật phức tạp.',
            remedy: 'Sử dụng kỹ thuật Paraphrasing và sơ đồ phản xạ 5W1H để mở rộng câu tự nhiên.',
            priority: 'Medium'
        }
    ],
    pathwayMilestones: [
        {
            month: 'Tháng 1-2',
            phase: 'Nền Tảng Ngôn Ngữ & Format Bài Thi',
            focus: 'Làm quen chuẩn Band Descriptors, luyện 500 từ vựng Academic Collocations & Luyện phát âm IPA.',
            target: 'Band 6.0 - 6.5',
            status: 'completed'
        },
        {
            month: 'Tháng 3-4',
            phase: 'Tăng Tốc Kỹ Năng & Bẻ Bẫy Distractors',
            focus: 'Luyện Drills chuyên sâu từng dạng bài, áp dụng khung PEEL cho Writing và sơ đồ 5W1H cho Speaking.',
            target: 'Band 7.0',
            status: 'in_progress'
        },
        {
            month: 'Tháng 5-6',
            phase: 'Mô Phỏng Phòng Thi & Tối Ưu Điểm Rơi',
            focus: 'Thi thử Computer-Delivered Full Mock Tests 3 tiếng liên tục, chấm bài và khắc phục lỗi L1 Pitfalls.',
            target: 'Band 7.5+',
            status: 'upcoming'
        }
    ],
    completedDrillsCount: 14,
    completedEssaysCount: 3,
    savedVocabCount: 28,
    streakDays: 5
};
