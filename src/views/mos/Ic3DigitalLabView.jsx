import React, { useState } from 'react';
import {
    ShieldCheck,
    Lock,
    Cpu,
    Cloud,
    HardDrive,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Search,
    RefreshCw,
    Terminal,
    Key,
    Mail,
    Globe,
    Layers,
    Award
} from 'lucide-react';
import { IC3_LEVELS_DATA } from '../../data/mosIc3Data';

export const Ic3DigitalLabView = ({ showToast, navigate }) => {
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [activeLabTab, setActiveLabTab] = useState('phishing_inspector');

    // Phishing Inspector Lab State
    const [inspectedFlags, setInspectedFlags] = useState({
        fakeDomain: false,
        urgentTone: false,
        suspiciousAttachment: false,
        mismatchedUrl: false
    });
    const [phishingVerdict, setPhishingVerdict] = useState(null);

    // Network Diagnostic CLI Simulator State
    const [cliCommands, setCliCommands] = useState([
        { text: 'C:\\Users\\Student> ping 8.8.8.8', type: 'input' },
        { text: 'Pinging 8.8.8.8 with 32 bytes of data:', type: 'output' },
        { text: 'Reply from 8.8.8.8: bytes=32 time=18ms TTL=116', type: 'output' },
        { text: 'Reply from 8.8.8.8: bytes=32 time=19ms TTL=116', type: 'output' },
        { text: 'Ping statistics for 8.8.8.8: Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)', type: 'output' },
        { text: 'C:\\Users\\Student> nslookup pedagogy.edu.vn', type: 'input' },
        { text: 'Server: dns.google\nAddress: 8.8.8.8\nNon-authoritative answer:\nName: pedagogy.edu.vn\nAddress: 103.142.24.88', type: 'output' }
    ]);
    const [cliInput, setCliInput] = useState('');

    // 2FA Simulator State
    const [totpCode, setTotpCode] = useState('842 195');
    const [userEnteredTotp, setUserEnteredTotp] = useState('');
    const [totpVerified, setTotpVerified] = useState(false);

    const handleToggleFlag = (key) => {
        setInspectedFlags(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleCheckPhishingVerdict = () => {
        const selectedCount = Object.values(inspectedFlags).filter(Boolean).length;
        if (selectedCount >= 3) {
            setPhishingVerdict('phishing_correct');
            if (showToast) showToast('Chính xác! Bạn đã phát hiện 4 dấu hiệu Phishing nguy hiểm.', 'success');
        } else {
            setPhishingVerdict('phishing_incomplete');
            if (showToast) showToast('Chưa đủ dấu hiệu nhận diện. Hãy kiểm tra thêm tên miền và đường link ẩn!', 'warning');
        }
    };

    const handleRunCli = (e) => {
        e.preventDefault();
        const cmd = cliInput.trim();
        if (!cmd) return;

        let response = `Unknown command: ${cmd}. Thử: 'ipconfig', 'ping google.com', 'tracert', 'nslookup'`;
        const lower = cmd.toLowerCase();

        if (lower.startsWith('ipconfig')) {
            response = `Windows IP Configuration\nEthernet adapter Local Area Connection:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.105\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1\n   DNS Servers . . . . . . . . . . . : 8.8.8.8, 1.1.1.1`;
        } else if (lower.startsWith('ping')) {
            response = `Pinging ${cmd.split(' ')[1] || 'gateway'} with 32 bytes of data:\nReply from host: bytes=32 time=14ms TTL=58\nReply from host: bytes=32 time=15ms TTL=58\nPackets: Sent = 2, Received = 2, Lost = 0 (0% loss)`;
        } else if (lower.startsWith('cls') || lower.startsWith('clear')) {
            setCliCommands([]);
            setCliInput('');
            return;
        }

        setCliCommands(prev => [
            ...prev,
            { text: `C:\\Users\\Student> ${cmd}`, type: 'input' },
            { text: response, type: 'output' }
        ]);
        setCliInput('');
    };

    const currentLevelData = IC3_LEVELS_DATA.find(l => l.level === selectedLevel) || IC3_LEVELS_DATA[0];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Standard Pedagogy Sticky Header */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Phòng Thực Hành Năng Lực Số IC3 GS6</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">An toàn thông tin, nhận diện Phishing, chẩn đoán mạng CLI và xác thực 2FA.</p>
                </div>

                <div className="flex gap-2">
                    {[
                        { lvl: 1, label: 'Level 1: Nền tảng' },
                        { lvl: 2, label: 'Level 2: Ứng dụng' },
                        { lvl: 3, label: 'Level 3: An toàn số' }
                    ].map(item => (
                        <button
                            key={item.lvl}
                            type="button"
                            onClick={() => setSelectedLevel(item.lvl)}
                            className={`px-3.5 py-2 font-serif-title text-xs font-bold transition-all ${
                                selectedLevel === item.lvl
                                    ? 'bg-brand-cerulean text-brand-cream shadow-editorial'
                                    : 'bg-white border-editorial text-brand-cerulean hover:bg-brand-cream'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Level Overview Box */}
            <div className="bg-white p-6 border-editorial shadow-editorial relative space-y-4">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-jasper"></div>
                <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-3">
                    <div>
                        <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">{currentLevelData.title}</h3>
                        <p className="text-xs font-body text-gray-600 mt-1">Chứng chỉ điện tử: <strong className="text-brand-jasper">{currentLevelData.badgeName}</strong> &bull; Điểm chuẩn: {currentLevelData.targetScore}/1000</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentLevelData.topics.map(t => (
                        <div key={t.id} className="p-4 bg-brand-cream/60 border border-brand-cerulean/20 rounded space-y-2">
                            <h4 className="font-serif-title font-bold text-base text-brand-cerulean">{t.title}</h4>
                            <p className="text-xs font-body text-gray-700 leading-relaxed">{t.scenario}</p>
                            <span className="inline-block text-[11px] font-bold text-brand-cerulean bg-white px-2 py-0.5 border border-brand-cerulean/30 rounded font-mono">
                                Ngân hàng: {t.questionsCount} câu thực hành
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* INTERACTIVE SIMULATION LABS SECTION */}
            <div className="bg-white border-editorial shadow-editorial p-6 space-y-6 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-cerulean"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-3 gap-3">
                    <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                        <Terminal size={22} className="text-brand-jasper" /> Phòng Lab Mô Phỏng Tình Huống Trực Quan
                    </h3>
                    <div className="flex gap-2 text-xs font-serif-title">
                        <button
                            onClick={() => setActiveLabTab('phishing_inspector')}
                            className={`px-3 py-1.5 font-bold transition-colors ${activeLabTab === 'phishing_inspector' ? 'bg-brand-cerulean text-brand-cream shadow-editorial' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Phishing Inspector
                        </button>
                        <button
                            onClick={() => setActiveLabTab('network_cli')}
                            className={`px-3 py-1.5 font-bold transition-colors ${activeLabTab === 'network_cli' ? 'bg-brand-cerulean text-brand-cream shadow-editorial' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Network CLI
                        </button>
                        <button
                            onClick={() => setActiveLabTab('totp_2fa')}
                            className={`px-3 py-1.5 font-bold transition-colors ${activeLabTab === 'totp_2fa' ? 'bg-brand-cerulean text-brand-cream shadow-editorial' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            2FA Security
                        </button>
                    </div>
                </div>

                {/* LAB 1: PHISHING EMAIL INSPECTOR */}
                {activeLabTab === 'phishing_inspector' && (
                    <div className="space-y-4 font-body">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-xs text-amber-900 leading-relaxed">
                            <strong>Tình huống IC3 Level 3:</strong> Bạn nhận được email sau đây thông báo tài khoản ngân hàng bị khóa. Hãy phân tích các trường dữ liệu và nhấp chọn các điểm đáng ngờ để đưa ra kết luận an toàn.
                        </div>

                        {/* Simulated Email Client Window */}
                        <div className="border border-gray-300 shadow-md bg-white overflow-hidden">
                            {/* Email Header */}
                            <div className="bg-gray-100 p-4 border-b border-gray-300 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-gray-500" />
                                        <span className="font-bold text-gray-900 font-serif-title">Người gửi (From):</span>
                                        <span className="font-mono bg-red-50 text-red-700 px-2 py-0.5 border border-red-200">
                                            Trung Tâm An Ninh &lt;security-alert@vietcom-bank-security-support.tk&gt;
                                        </span>
                                    </div>
                                    <span className="text-gray-500 font-mono">10:45 AM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 font-serif-title">Tiêu đề (Subject):</span>
                                    <span className="font-bold text-brand-jasper">[KHẨN CẤP] Tài khoản của bạn sẽ bị tạm dừng trong 24 giờ tới nếu không xác minh!</span>
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className="p-6 text-sm space-y-4 leading-relaxed text-gray-800 font-serif">
                                <p>Kính gửi Quý khách hàng,</p>
                                <p>Hệ thống phát hiện hoạt động đăng nhập bất thường từ thiết bị lạ tại địa chỉ IP 14.162.20.11 (Nga). Để bảo vệ tiền trong tài khoản, quý khách bắt buộc phải truy cập liên kết dưới đây để cập nhật mã OTP và mật khẩu ngân hàng trực tuyến.</p>

                                <div className="p-4 bg-gray-50 border border-gray-200 text-center font-sans">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFlag('mismatchedUrl')}
                                        className="px-6 py-2.5 bg-brand-jasper hover:bg-red-800 text-white font-serif-title font-bold shadow inline-flex items-center gap-2 text-sm transition-colors"
                                    >
                                        <Lock size={15} /> XÁC MINH DANH TÍNH NGAY TẠI ĐÂY
                                    </button>
                                    <p className="text-[11px] text-gray-500 mt-2 font-mono">
                                        Đích liên kết thực tế: http://192.241.18.99:8080/fake-login/token?user=13861
                                    </p>
                                </div>

                                <p className="text-xs text-gray-500 italic">Trân trọng,<br />Phòng An ninh Thông tin Ngân hàng.</p>
                            </div>
                        </div>

                        {/* Interactive Diagnostic Checklist */}
                        <div className="bg-brand-cream/70 p-5 border border-brand-cerulean/20 space-y-3">
                            <h4 className="font-serif-title font-bold text-brand-cerulean text-base">Bảng Đối Chiếu Chỉ Số Nguy Hiểm:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-body">
                                {[
                                    { key: 'fakeDomain', label: 'Tên miền người gửi giả mạo (.tk, đuôi tên miền dài bất thường, không phải domain chính thức)' },
                                    { key: 'urgentTone', label: 'Ngôn từ đe dọa khẩn cấp (Hối thúc trong 24h nhằm gây hoang mang tâm lý)' },
                                    { key: 'mismatchedUrl', label: 'Đường link ẩn trỏ về địa chỉ IP lạ không có chứng chỉ bảo mật HTTPS' },
                                    { key: 'suspiciousAttachment', label: 'Yêu cầu cung cấp cả mật khẩu và mã xác thực OTP cá nhân' }
                                ].map(item => (
                                    <label key={item.key} className="flex items-start gap-2.5 p-3 bg-white border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(inspectedFlags[item.key])}
                                            onChange={() => handleToggleFlag(item.key)}
                                            className="accent-brand-cerulean w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                                        />
                                        <span className="font-medium text-gray-800">{item.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleCheckPhishingVerdict}
                                    className="px-6 py-2.5 bg-brand-cerulean hover:bg-brand-jasper text-white font-serif-title font-bold text-sm shadow-editorial transition-colors"
                                >
                                    Kiểm Tra Kết Quả Chẩn Đoán
                                </button>

                                {phishingVerdict === 'phishing_correct' && (
                                    <span className="inline-flex items-center gap-1.5 text-sm font-serif-title font-bold text-emerald-800 bg-emerald-100 px-3 py-1 border border-emerald-300">
                                        <CheckCircle2 size={16} /> BẠN ĐÃ ĐÁNH GIÁ ĐÚNG: ĐÂY LÀ PHISHING ATTACK!
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* LAB 2: NETWORK DIAGNOSTIC CLI */}
                {activeLabTab === 'network_cli' && (
                    <div className="space-y-4">
                        <div className="bg-slate-900 text-slate-100 p-4 border-b border-slate-700 flex justify-between items-center text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <Terminal size={15} className="text-emerald-400" />
                                <span>Command Prompt (CLI Simulation - IC3 Troubleshooting)</span>
                            </div>
                            <span className="text-slate-400">Windows PowerShell / CMD</span>
                        </div>

                        {/* Terminal Window */}
                        <div className="bg-black text-emerald-400 p-5 font-mono text-xs space-y-2 min-h-[280px] max-h-[360px] overflow-y-auto border border-slate-800">
                            {cliCommands.map((cmd, i) => (
                                <div key={i} className={cmd.type === 'input' ? 'text-white font-bold' : 'text-emerald-400/90 whitespace-pre-wrap'}>
                                    {cmd.text}
                                </div>
                            ))}

                            <form onSubmit={handleRunCli} className="flex items-center gap-2 pt-2">
                                <span className="text-white font-bold">C:\Users\Student&gt;</span>
                                <input
                                    type="text"
                                    value={cliInput}
                                    onChange={e => setCliInput(e.target.value)}
                                    placeholder="gõ 'ipconfig', 'ping google.com', 'cls'..."
                                    className="flex-1 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none"
                                />
                            </form>
                        </div>

                        <div className="p-3 bg-brand-cream border border-brand-cerulean/20 text-xs font-body flex items-center justify-between text-gray-700">
                            <span>💡 Lệnh gợi ý IC3: <strong className="font-mono text-brand-cerulean">ipconfig /all</strong> (xem IP/Gateway), <strong className="font-mono text-brand-cerulean">ping 127.0.0.1</strong> (kiểm tra loopback card mạng), <strong className="font-mono text-brand-cerulean">cls</strong> (xóa màn hình).</span>
                        </div>
                    </div>
                )}

                {/* LAB 3: 2FA & PASSWORD STRENGTH */}
                {activeLabTab === 'totp_2fa' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-brand-cream/50 border border-brand-cerulean/20">
                        <div className="bg-white p-6 border-editorial shadow-editorial space-y-4">
                            <h4 className="font-serif-title font-bold text-lg text-brand-cerulean flex items-center gap-2">
                                <Key size={18} /> Mô Phỏng Authenticator App (TOTP)
                            </h4>
                            <p className="text-xs text-gray-600 font-body leading-relaxed">
                                Mã xác thực 6 chữ số thay đổi mỗi 30 giây dựa trên thuật toán Time-based One-Time Password.
                            </p>

                            <div className="p-4 bg-brand-cream border border-brand-cerulean/30 text-center space-y-1">
                                <span className="text-xs text-brand-cerulean font-serif-title font-bold uppercase">Pedagogy 2FA Code</span>
                                <div className="text-3xl font-mono font-black text-brand-cerulean tracking-widest">{totpCode}</div>
                                <div className="w-full bg-gray-200 h-1 overflow-hidden mt-2">
                                    <div className="bg-brand-cerulean h-1 w-3/4 animate-pulse"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold font-body text-gray-700">Nhập mã 2FA để xác nhận:</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={userEnteredTotp}
                                        onChange={e => setUserEnteredTotp(e.target.value)}
                                        placeholder="842195"
                                        className="px-3 py-2 border border-gray-300 font-mono text-sm flex-1 focus:outline-none focus:border-brand-cerulean"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (userEnteredTotp.replace(/\s+/g, '') === '842195') {
                                                setTotpVerified(true);
                                                if (showToast) showToast('Xác thực 2FA thành công!', 'success');
                                            } else {
                                                if (showToast) showToast('Mã OTP không chính xác!', 'error');
                                            }
                                        }}
                                        className="px-4 py-2 bg-brand-cerulean text-white font-serif-title text-xs font-bold hover:bg-brand-jasper transition-colors"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                                {totpVerified && (
                                    <p className="text-xs text-emerald-800 font-serif-title font-bold flex items-center gap-1 mt-1">
                                        <CheckCircle2 size={14} /> Phiên đăng nhập được bảo vệ bởi xác thực đa yếu tố.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 border-editorial shadow-editorial space-y-4 font-body text-xs">
                            <h4 className="font-serif-title font-bold text-lg text-brand-cerulean">
                                Tiêu Chuẩn Mật Khẩu IC3 Chuẩn Quốc Tế
                            </h4>
                            <ul className="space-y-2.5 text-gray-700 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                                    <span><strong>Độ dài tối thiểu:</strong> Từ 12 ký tự trở lên (Passphrase nhiều từ có nghĩa).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                                    <span><strong>Đa dạng ký tự:</strong> Kết hợp chữ HOA, chữ thường, chữ số và ký tự đặc biệt (@, #, $...).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                                    <span><strong>Không dùng chung:</strong> Mỗi dịch vụ một mật khẩu độc lập, quản lý bằng Password Manager.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
