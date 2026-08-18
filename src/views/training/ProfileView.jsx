import React, { useState, useEffect } from 'react';
import {
    Pencil,
    Award,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    CheckCircle2,
    Sparkles,
    BookOpen,
    Target,
    Activity,
    User,
    FolderOpen
} from 'lucide-react';
import vietnamLocations from '../../data/vietnamLocations.json';
import { EditorialSelect, EditorialDatePicker } from '../../components/common/EditorialWidgets';

export const ProfileView = ({ profile, programs, thptProfile, navigate, onUpdateProfile, onOpenCertificate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile || {});

    useEffect(() => {
        setFormData(profile || {});
    }, [profile]);

    const handleSave = (e) => {
        e.preventDefault();
        const fullAddr = [formData.addressDetail, formData.ward, formData.province].filter(Boolean).join(', ');
        const updated = {
            ...formData,
            address: fullAddr
        };
        onUpdateProfile(updated);
        setIsEditing(false);
    };

    if (!profile) return null;

    const programOptions = (programs && programs.length > 0)
        ? programs.map(p => ({ label: p.name, value: p.name }))
        : [
            { label: "Nghiệp vụ sư phạm THCS 2026", value: "Nghiệp vụ sư phạm THCS 2026" },
            { label: "Nghiệp vụ sư phạm THPT 2026", value: "Nghiệp vụ sư phạm THPT 2026" }
        ];

    const genderOptions = [
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
        { label: 'Khác', value: 'Khác' },
    ];

    const statusOptions = [
        { label: 'Đang học', value: 'Đang học' },
        { label: 'Bảo lưu', value: 'Bảo lưu' },
        { label: 'Đã hoàn thành', value: 'Đã hoàn thành' },
        { label: 'Đã tốt nghiệp', value: 'Đã tốt nghiệp' },
    ];

    // Structured Address Location Dropdowns
    const provinceList = Object.keys(vietnamLocations || {});
    const provinceOptions = provinceList.map(p => ({ label: p, value: p }));

    const currentProvince = formData.province || provinceList[0] || 'Thành phố Hồ Chí Minh';
    const wardList = vietnamLocations[currentProvince] || [];
    const wardOptions = wardList.map(w => ({ label: w, value: w }));

    const emergencyRelationOptions = [
        { label: 'Anh em', value: 'Anh em' },
        { label: 'Chị em', value: 'Chị em' },
        { label: 'Ba', value: 'Ba' },
        { label: 'Mẹ', value: 'Mẹ' },
        { label: 'Bạn bè', value: 'Bạn bè' },
        { label: 'Người yêu', value: 'Người yêu' },
        { label: 'Khác', value: 'Khác' },
    ];

    const handleProvinceChange = (newProv) => {
        const newWardList = vietnamLocations[newProv] || [];
        const firstWard = newWardList[0] || '';
        const newAddrDetail = formData.addressDetail || '';
        const fullAddr = [newAddrDetail, firstWard, newProv].filter(Boolean).join(', ');
        setFormData(prev => ({
            ...prev,
            province: newProv,
            ward: firstWard,
            address: fullAddr
        }));
    };

    const handleWardChange = (newWard) => {
        const fullAddr = [formData.addressDetail || '', newWard, formData.province || ''].filter(Boolean).join(', ');
        setFormData(prev => ({
            ...prev,
            ward: newWard,
            address: fullAddr
        }));
    };

    const handleAddressDetailChange = (newDetail) => {
        const fullAddr = [newDetail, formData.ward || '', formData.province || ''].filter(Boolean).join(', ');
        setFormData(prev => ({
            ...prev,
            addressDetail: newDetail,
            address: fullAddr
        }));
    };

    const handleEmergencyFieldChange = (field, value) => {
        setFormData(prev => {
            const nextRel = field === 'emergencyRelation' ? value : (prev.emergencyRelation || 'Anh em');
            const nextName = field === 'emergencyName' ? value : (prev.emergencyName || '');
            const nextPhone = field === 'emergencyPhone' ? value : (prev.emergencyPhone || '');
            
            let fullContact = nextRel;
            if (nextName) fullContact += ` - ${nextName}`;
            if (nextPhone) fullContact += ` (${nextPhone})`;

            return {
                ...prev,
                [field]: value,
                emergencyContact: fullContact
            };
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Hồ sơ cá nhân</h2>
                    <p className="text-gray-500 font-body mt-1">Thông tin cá nhân, chương trình đào tạo & liên lạc cá nhân hóa.</p>
                </div>
                <div className="flex gap-3 items-center flex-wrap">
                    <button
                        type="button"
                        onClick={onOpenCertificate}
                        className="px-4 py-2 bg-brand-jasper hover:bg-brand-cerulean text-white font-serif-title shadow-editorial transition-colors flex items-center gap-2"
                    >
                        <Award size={16} /> Xem Chứng chỉ mẫu
                    </button>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors flex items-center gap-2"
                        >
                            <Pencil size={16} /> Chỉnh sửa hồ sơ
                        </button>
                    )}
                </div>
            </header>

            <form onSubmit={handleSave} className="bg-white p-8 border-editorial shadow-editorial space-y-8">
                {/* GROUP 1: THÔNG TIN ĐỊNH DANH & CÁ NHÂN */}
                <div className="space-y-4">
                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        1. Thông tin Định danh & Cá nhân
                    </h3>

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Avatar Link Input */}
                            <div className="md:col-span-2 space-y-3 p-4 bg-brand-cream/30 border border-brand-cerulean/20">
                                <label className="block text-xs font-serif-title text-brand-cerulean font-bold">Link Ảnh đại diện (URL Avatar)</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full border-2 border-brand-cerulean overflow-hidden bg-brand-cream flex items-center justify-center shrink-0 shadow-sm">
                                        {formData.avatarUrl ? (
                                            <img
                                                src={formData.avatarUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <User size={32} className="text-brand-cerulean" />
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        className="input-editorial flex-1"
                                        value={formData.avatarUrl || ''}
                                        onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                                        placeholder="https://images.unsplash.com/... hoặc dán link ảnh từ internet"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Họ và Tên đầy đủ</label>
                                <input required type="text" className="input-editorial w-full font-serif-title text-lg font-bold" value={formData.fullName || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Mã số học viên (MSSV)</label>
                                <input required type="text" className="input-editorial w-full font-bold" value={formData.studentId || ''} onChange={e => setFormData({ ...formData, studentId: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Ngày sinh</label>
                                <EditorialDatePicker
                                    value={formData.dob || ''}
                                    onChange={val => setFormData({ ...formData, dob: val })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <EditorialSelect
                                        label="Giới tính"
                                        value={formData.gender || 'Nam'}
                                        onChange={val => setFormData({ ...formData, gender: val })}
                                        options={genderOptions}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Số CCCD / CMND</label>
                                    <input type="text" className="input-editorial w-full" value={formData.idCard || ''} onChange={e => setFormData({ ...formData, idCard: e.target.value })} placeholder="079200..." />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-brand-cream/40 p-6 border border-brand-cerulean/20 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-editorial overflow-hidden bg-brand-cream flex items-center justify-center shrink-0">
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.fullName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                                    />
                                ) : (
                                    <User size={48} className="text-brand-cerulean" />
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Họ và Tên</span>
                                    <span className="text-2xl font-serif-title text-brand-cerulean font-bold">{profile.fullName}</span>
                                </div>
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Mã số học viên</span>
                                    <span className="text-lg font-sans text-brand-jasper font-bold">{profile.studentId || 'Chưa cập nhật'}</span>
                                </div>
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Ngày sinh</span>
                                    <span className="text-base font-body">{profile.dob || 'Chưa cập nhật'}</span>
                                </div>
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block">Giới tính & CCCD</span>
                                    <span className="text-base font-body">{profile.gender || 'Nam'} &bull; CCCD: {profile.idCard || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* GROUP 2: THÔNG TIN ĐÀO TẠO & KHÓA HỌC */}
                <div className="space-y-4">
                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        2. Thông tin Đào tạo & Khóa học
                    </h3>

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <EditorialSelect
                                    label="Chương trình bồi dưỡng"
                                    value={formData.major || ''}
                                    onChange={val => setFormData({ ...formData, major: val })}
                                    options={programOptions}
                                    placeholder="Chọn chương trình bồi dưỡng (có thể chọn nhiều)..."
                                    isMulti={true}
                                />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Môn đăng ký giảng dạy"
                                    value={formData.teachingSubject || ''}
                                    onChange={val => setFormData({ ...formData, teachingSubject: val })}
                                    options={[
                                        { label: 'Toán', value: 'Toán' },
                                        { label: 'Tin học', value: 'Tin học' },
                                        { label: 'Vật lý', value: 'Vật lý' },
                                        { label: 'Hóa học', value: 'Hóa học' },
                                        { label: 'Sinh học', value: 'Sinh học' },
                                        { label: 'Ngữ văn', value: 'Ngữ văn' },
                                        { label: 'Tiếng Anh', value: 'Tiếng Anh' },
                                        { label: 'Giáo dục Quốc phòng', value: 'Giáo dục Quốc phòng' },
                                        { label: 'Giáo dục kinh tế và pháp luật', value: 'Giáo dục kinh tế và pháp luật' },
                                        { label: 'Lịch sử', value: 'Lịch sử' },
                                        { label: 'Địa lý', value: 'Địa lý' },
                                        { label: 'Lịch sử và Địa lý', value: 'Lịch sử và Địa lý' },
                                        { label: 'Khoa học tự nhiên (KHTN)', value: 'Khoa học tự nhiên' },
                                        { label: 'Tiếng Trung', value: 'Tiếng Trung' },
                                        { label: 'Tiếng Nga', value: 'Tiếng Nga' },
                                        { label: 'Tiếng Pháp', value: 'Tiếng Pháp' },
                                        { label: 'Công nghệ', value: 'Công nghệ' },
                                        { label: 'Giáo dục thể chất', value: 'Giáo dục thể chất' },
                                    ]}
                                    placeholder="Chọn môn giảng dạy (có thể chọn nhiều)..."
                                    isMulti={true}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Khoa / Viện quản lý</label>
                                <input type="text" className="input-editorial w-full" value={formData.faculty || ''} onChange={e => setFormData({ ...formData, faculty: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Chuyên ngành gốc / Đầu vào</label>
                                <input type="text" className="input-editorial w-full" value={formData.originalMajor || ''} onChange={e => setFormData({ ...formData, originalMajor: e.target.value })} placeholder="VD: Cử nhân Công nghệ..." />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Lớp sinh hoạt / Mã lớp</label>
                                <input type="text" className="input-editorial w-full" value={formData.className || ''} onChange={e => setFormData({ ...formData, className: e.target.value })} placeholder="VD: K2026-NVSP" />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Hình thức đào tạo</label>
                                <input type="text" className="input-editorial w-full" value={formData.trainingMode || ''} onChange={e => setFormData({ ...formData, trainingMode: e.target.value })} placeholder="VD: Bồi dưỡng nghiệp vụ" />
                            </div>
                            <div>
                                <EditorialSelect
                                    label="Trạng thái học tập"
                                    value={formData.status || 'Đang học'}
                                    onChange={val => setFormData({ ...formData, status: val })}
                                    options={statusOptions}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-cream/40 p-5 border border-brand-cerulean/20">
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Chương trình học</span>
                                <span className="text-lg font-serif-title text-brand-cerulean font-bold">
                                    {Array.isArray(profile.major) ? profile.major.join(', ') : (profile.major || 'Chưa cập nhật')}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Môn đăng ký giảng dạy (Nhánh B & C)</span>
                                <span className="text-base font-serif-title font-bold text-brand-jasper">
                                    {profile.teachingSubject
                                        ? (Array.isArray(profile.teachingSubject) ? `Môn: ${profile.teachingSubject.join(', ')}` : `Môn ${profile.teachingSubject}`)
                                        : 'Chưa chọn môn dạy (Nhấp Chỉnh sửa để chọn)'}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Khoa / Đơn vị</span>
                                <span className="text-base font-body">{profile.faculty}</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Chuyên ngành gốc</span>
                                <span className="text-base font-body">{profile.originalMajor || 'Chưa cập nhật'}</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Lớp & Trạng thái</span>
                                <span className="text-base font-body">{profile.className || 'Chưa xếp lớp'} &bull; <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded">{profile.status || 'Đang học'}</span></span>
                            </div>
                            <div className="md:col-span-2 p-4 bg-blue-50/60 border border-brand-cerulean/50 rounded flex justify-between items-center flex-wrap gap-3 mt-2">
                                <div className="flex items-center gap-3">
                                    <Award className="text-brand-cerulean" size={24} />
                                    <div>
                                        <span className="text-xs uppercase font-bold text-brand-cerulean block">Chứng chỉ nghiệp vụ dự kiến</span>
                                        <span className="text-sm font-serif-title font-bold text-gray-800">Chứng chỉ Nghiệp vụ Sư phạm THCS / THPT chuẩn Bộ GD&ĐT</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onOpenCertificate}
                                    className="px-3.5 py-1.5 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-serif-title font-bold rounded shadow-sm transition-colors flex items-center gap-1.5"
                                >
                                    <Award size={14} /> Mở bản xem trước
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* GROUP 3: THÔNG TIN LIÊN LẠC & KHẨN CẤP */}
                <div className="space-y-4">
                    <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2 border-b border-brand-cerulean/20 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cerulean"></span>
                        3. Thông tin Liên lạc & Khẩn cấp
                    </h3>

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Email học viên</label>
                                <input type="email" className="input-editorial w-full" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Số điện thoại di động (+84...)</label>
                                <input
                                    type="tel"
                                    className="input-editorial w-full font-bold"
                                    value={formData.phone || '+84 '}
                                    onChange={e => {
                                        let val = e.target.value;
                                        if (!val.startsWith('+84') && val !== '') {
                                            val = '+84 ' + val.replace(/^\+?84\s?/, '');
                                        }
                                        setFormData({ ...formData, phone: val });
                                    }}
                                    placeholder="+84 703 506 140"
                                />
                            </div>

                            {/* Structured Address */}
                            <div className="md:col-span-2 space-y-4 p-4 bg-brand-cream/30 border border-brand-cerulean/20">
                                <span className="text-xs uppercase font-bold text-brand-cerulean block border-b border-brand-cerulean/20 pb-1">Chi tiết Địa chỉ liên hệ (Sau sáp nhập)</span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <EditorialSelect
                                            label="Tỉnh / Thành phố"
                                            value={formData.province || currentProvince}
                                            onChange={handleProvinceChange}
                                            options={provinceOptions}
                                        />
                                    </div>
                                    <div>
                                        <EditorialSelect
                                            label="Phường / Xã / Thị trấn"
                                            value={formData.ward || wardOptions[0]?.value || ''}
                                            onChange={handleWardChange}
                                            options={wardOptions}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Địa chỉ cụ thể (Số nhà, đường...)</label>
                                        <input
                                            type="text"
                                            className="input-editorial w-full"
                                            value={formData.addressDetail || ''}
                                            onChange={e => handleAddressDetailChange(e.target.value)}
                                            placeholder="VD: 351A Lạc Long Quân"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Structured Emergency Contact (3 Fields) */}
                            <div className="md:col-span-2 space-y-4 p-4 bg-brand-cream/30 border border-brand-cerulean/20">
                                <span className="text-xs uppercase font-bold text-brand-cerulean block border-b border-brand-cerulean/20 pb-1">Chi tiết Người liên hệ khẩn cấp (3 Mục thông tin)</span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <EditorialSelect
                                            label="1. Mối quan hệ"
                                            value={formData.emergencyRelation || 'Anh em'}
                                            onChange={val => handleEmergencyFieldChange('emergencyRelation', val)}
                                            options={emergencyRelationOptions}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">2. Họ và Tên người thân</label>
                                        <input
                                            type="text"
                                            className="input-editorial w-full font-bold"
                                            value={formData.emergencyName || ''}
                                            onChange={e => handleEmergencyFieldChange('emergencyName', e.target.value)}
                                            placeholder="VD: Nguyễn Huỳnh Phúc Hải"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">3. Số điện thoại (+84...)</label>
                                        <input
                                            type="tel"
                                            className="input-editorial w-full font-bold"
                                            value={formData.emergencyPhone || '+84 '}
                                            onChange={e => {
                                                let val = e.target.value;
                                                if (!val.startsWith('+84') && val !== '') {
                                                    val = '+84 ' + val.replace(/^\+?84\s?/, '');
                                                }
                                                handleEmergencyFieldChange('emergencyPhone', val);
                                            }}
                                            placeholder="+84 789 515 248"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-cream/40 p-5 border border-brand-cerulean/20">
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Email</span>
                                <span className="text-base font-body flex items-center gap-2 mt-0.5"><Mail size={16} className="text-brand-cerulean" /> {profile.email}</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-400 block">Số điện thoại</span>
                                <span className="text-base font-body flex items-center gap-2 mt-0.5 font-bold text-brand-cerulean">
                                    <Phone size={16} className="text-brand-cerulean" />
                                    {profile.phone && profile.phone.startsWith('0') ? `+84 ${profile.phone.substring(1)}` : (profile.phone || 'Chưa cập nhật')}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Địa chỉ liên hệ</span>
                                <span className="text-lg font-serif-title text-brand-cerulean font-bold">
                                    {profile.address || [profile.addressDetail, profile.ward, profile.province].filter(Boolean).join(', ') || 'Chưa cập nhật'}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Liên hệ khẩn cấp</span>
                                <div className="flex items-center gap-3 font-body mt-1 flex-wrap">
                                    <span className="px-3 py-1 bg-brand-cerulean text-white text-xs font-serif-title font-bold rounded shadow-sm">
                                        {profile.emergencyRelation || 'Người thân'}
                                    </span>
                                    {profile.emergencyName && (
                                        <span className="text-lg font-serif-title font-bold text-brand-cerulean">
                                            {profile.emergencyName}
                                        </span>
                                    )}
                                    <span className="text-lg font-serif-title font-bold text-brand-jasper flex items-center gap-1.5">
                                        <Phone size={16} /> {profile.emergencyPhone || profile.emergencyContact || 'Chưa cập nhật'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* GROUP 4: KẾT QUẢ KỲ THI THPT & TRÚNG TUYỂN ĐẠI HỌC */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-2">
                        <h3 className="text-lg font-serif-title text-brand-cerulean font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper"></span>
                            4. Kết quả Kỳ thi THPT & Trúng tuyển Đại học
                        </h3>
                        {navigate && (
                            <button
                                type="button"
                                onClick={() => navigate('thpt_goals')}
                                className="text-xs font-serif-title font-bold text-brand-jasper hover:text-brand-cerulean underline flex items-center gap-1"
                            >
                                Quản lý Nguyện vọng & Điểm thi THPT →
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-cream/40 p-5 border border-brand-cerulean/20">
                        <div>
                            <span className="text-xs uppercase font-bold text-gray-400 block">Trường Đại học trúng tuyển</span>
                            <span className="text-base font-serif-title text-brand-cerulean font-bold">
                                {thptProfile?.admittedUniversity || profile?.admittedUniversity || 'Chưa cập nhật'}
                            </span>
                            {(thptProfile?.admittedWishNumber || profile?.admittedWishNumber) && (
                                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-serif-title border border-emerald-300">
                                    {thptProfile?.admittedWishNumber || profile?.admittedWishNumber}
                                </span>
                            )}
                        </div>

                        <div>
                            <span className="text-xs uppercase font-bold text-gray-400 block">Ngành & Khối xét tuyển</span>
                            <span className="text-base font-serif-title text-brand-jasper font-bold">
                                {thptProfile?.admittedMajor || profile?.admittedMajor || 'Chưa cập nhật'}
                            </span>
                            {(thptProfile?.admittedCombination || profile?.combination) && (
                                <span className="text-xs text-gray-600 font-body block mt-0.5">
                                    Khối: <strong>{thptProfile?.admittedCombination || profile?.combination}</strong>
                                </span>
                            )}
                        </div>

                        <div>
                            <span className="text-xs uppercase font-bold text-gray-400 block">Điểm chuẩn & Nguyện vọng</span>
                            <span className="text-base font-serif-title text-emerald-700 font-bold">
                                {(thptProfile?.admittedScore || profile?.admittedScore) ? `${thptProfile?.admittedScore || profile?.admittedScore} đ` : 'Chưa cập nhật'}
                            </span>
                            <span className="text-xs text-gray-500 font-body block mt-0.5">
                                Đã lưu {(thptProfile?.aspirations || []).length} nguyện vọng đăng ký
                            </span>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="pt-6 border-t border-brand-cerulean/20 flex justify-end gap-4">
                        <button type="button" onClick={() => { setFormData(profile); setIsEditing(false); }} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                        <button type="submit" className="px-8 py-2.5 bg-brand-cerulean text-white font-serif-title shadow-editorial hover:bg-brand-jasper transition-colors">Lưu Hồ Sơ</button>
                    </div>
                )}
            </form>
        </div>
    );
};
