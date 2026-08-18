import React, { useState, useMemo } from 'react';
import {
    Users, Plus, Search, Filter, Phone, Mail, GraduationCap,
    Target, Award, TrendingUp, FileText, Trash2, Edit2, ChevronRight, Sparkles, Check, AlertTriangle
} from 'lucide-react';
import { ThptStudentDetailModal } from '../../components/thpt/ThptStudentDetailModal';
import { EditorialSelect } from '../../components/common/EditorialWidgets';

export const ThptStudentsView = ({
    students = [],
    exams = [],
    results = [],
    subjects = [],
    onAddStudent,
    onUpdateStudent,
    onDeleteStudent,
    onOpenTestEntry,
    onNavigateToTracking,
    showToast
}) => {
    // States
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');

    // New student form
    const [newStudentForm, setNewStudentForm] = useState({
        fullName: '',
        studentCode: '',
        phone: '',
        email: '',
        school: '',
        grade: '12',
        combination: 'A00 (Toán, Lí, Hóa)',
        totalTarget: '27.0'
    });

    // Filtered students
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesSearch = !searchTerm ||
                s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.phone?.includes(searchTerm);
            const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;
            return matchesSearch && matchesGrade;
        });
    }, [students, searchTerm, selectedGrade]);

    // Handle add student submit
    const handleAddStudentSubmit = (e) => {
        e.preventDefault();
        if (!newStudentForm.fullName.trim()) return;

        const newId = 'stu_' + Date.now();
        const studentObj = {
            id: newId,
            studentCode: (newStudentForm.studentCode || 'HS-' + Math.floor(1000 + Math.random() * 9000)).toUpperCase().trim(),
            fullName: newStudentForm.fullName.trim(),
            dob: '',
            gender: 'Nam',
            phone: newStudentForm.phone.trim(),
            email: newStudentForm.email.trim(),
            school: newStudentForm.school.trim(),
            grade: newStudentForm.grade,
            status: 'active',
            targetScores: {
                combination: newStudentForm.combination,
                totalTarget: newStudentForm.totalTarget
            },
            diagnosticNotes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onAddStudent(studentObj);
        setIsAddModalOpen(false);
        setNewStudentForm({
            fullName: '',
            studentCode: '',
            phone: '',
            email: '',
            school: '',
            grade: '12',
            combination: 'A00 (Toán, Lí, Hóa)',
            totalTarget: '27.0'
        });
        showToast?.('Đã thêm học viên mới');
    };

    const activeStudent = students.find(s => s.id === selectedStudentId);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-brand-cerulean/20 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-brand-jasper font-bold mb-1">
                        <Users size={14} /> Quản lý Lớp & Học viên Ôn thi
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif-title text-brand-cerulean tracking-tight">
                        Danh sách Học viên THPT
                    </h1>
                    <p className="text-sm italic text-gray-600 font-body mt-1">
                        Theo dõi hồ sơ cá nhân, mục tiêu điểm số đại học, lịch sử làm đề & ghi chú chẩn đoán sư phạm
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-editorial transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Thêm học viên mới
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Tổng số học viên</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-cerulean mt-1">{students.length}</p>
                </div>
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Lớp 12 trọng tâm</span>
                    <p className="text-2xl font-serif-title font-bold text-brand-jasper mt-1">
                        {students.filter(s => s.grade === '12').length}
                    </p>
                </div>
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Lượt làm bài thi</span>
                    <p className="text-2xl font-serif-title font-bold text-emerald-700 mt-1">{results.length}</p>
                </div>
                <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm">
                    <span className="text-xs font-serif-title text-gray-500 uppercase">Ghi chú sư phạm</span>
                    <p className="text-2xl font-serif-title font-bold text-indigo-700 mt-1">
                        {students.reduce((acc, curr) => acc + (curr.diagnosticNotes?.length || 0), 0)}
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 border border-brand-cerulean/20 shadow-sm space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8 relative">
                        <Search size={16} className="absolute left-3 top-3 text-brand-cerulean/60" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên học viên, mã số, trường học, số điện thoại..."
                            className="w-full pl-9 pr-3 py-2 input-editorial text-sm font-body bg-transparent"
                        />
                    </div>
                    <div className="sm:col-span-4">
                        <EditorialSelect
                            value={selectedGrade}
                            onChange={setSelectedGrade}
                            options={[
                                { value: 'all', label: 'Tất cả các khối lớp' },
                                { value: '12', label: 'Khối Lớp 12 (Ôn thi THPT)' },
                                { value: '11', label: 'Khối Lớp 11' },
                                { value: '10', label: 'Khối Lớp 10' },
                                { value: 'luyen_thi', label: 'Lớp Luyện thi cấp tốc' }
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Students Grid */}
            {filteredStudents.length === 0 ? (
                <div className="p-12 text-center bg-white border border-brand-cerulean/20 shadow-sm space-y-3">
                    <Users size={36} className="mx-auto text-brand-cerulean/40" />
                    <h3 className="font-serif-title font-bold text-lg text-brand-cerulean">Không tìm thấy học viên</h3>
                    <p className="text-xs text-gray-500 font-body">Hãy thêm học viên mới vào hệ thống để bắt đầu theo dõi quá trình làm bài.</p>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-2 px-4 py-2 bg-brand-cerulean text-white font-sans text-xs font-bold shadow-sm"
                    >
                        Thêm học viên mới
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map(stu => {
                        const studentResults = results.filter(r => r.studentId === stu.id);
                        const testCount = studentResults.length;
                        const avgScore = testCount > 0
                            ? (studentResults.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / testCount).toFixed(1)
                            : null;
                        const latestNote = stu.diagnosticNotes?.[0];

                        return (
                            <div
                                key={stu.id}
                                className="bg-white border border-brand-cerulean/20 shadow-editorial hover:shadow-editorial-hover transition-all flex flex-col justify-between group"
                            >
                                <div className="p-5 space-y-4">
                                    {/* Student Card Top */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-full bg-brand-cerulean text-white font-serif-title font-bold text-lg flex items-center justify-center shadow-sm">
                                                {stu.fullName?.charAt(0) || 'H'}
                                            </div>
                                            <div>
                                                <h3
                                                    onClick={() => setSelectedStudentId(stu.id)}
                                                    className="font-serif-title font-bold text-lg text-brand-cerulean hover:text-brand-jasper transition-colors cursor-pointer"
                                                >
                                                    {stu.fullName}
                                                </h3>
                                                <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {stu.studentCode || 'HS-001'}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="text-xs font-serif font-bold text-brand-jasper px-2 py-0.5 bg-brand-jasper/10 rounded">
                                            Lớp {stu.grade || '12'}
                                        </span>
                                    </div>

                                    {/* School & Target */}
                                    <div className="space-y-1 text-xs font-body text-gray-600">
                                        <p className="truncate">🏫 {stu.school || 'Chưa cập nhật trường'}</p>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="font-serif-title text-brand-cerulean font-bold">
                                                🎯 {stu.targetScores?.combination || 'Khối xét tuyển'}:
                                            </span>
                                            <strong className="text-brand-jasper text-sm font-serif-title">
                                                {stu.targetScores?.totalTarget || '27.0+'}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs font-body">
                                        <div className="bg-brand-cream p-2 rounded text-center">
                                            <span className="text-[10px] text-gray-500 block">Số bài thi đã làm</span>
                                            <strong className="font-serif-title text-brand-cerulean text-sm">{testCount} đề</strong>
                                        </div>
                                        <div className="bg-brand-cream p-2 rounded text-center">
                                            <span className="text-[10px] text-gray-500 block">Điểm trung bình</span>
                                            <strong className="font-serif-title text-brand-jasper text-sm">
                                                {avgScore !== null ? `${avgScore} đ` : '---'}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* Latest Note Snippet */}
                                    {latestNote && (
                                        <div className={`p-2.5 rounded text-xs font-body border ${
                                            latestNote.type === 'weakness'
                                                ? 'bg-red-50/70 border-red-200 text-red-900'
                                                : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                        }`}>
                                            <div className="flex items-center gap-1.5 font-bold text-[11px] mb-0.5">
                                                {latestNote.type === 'weakness' ? (
                                                    <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                                                ) : (
                                                    <Sparkles size={13} className="text-emerald-700 shrink-0" />
                                                )}
                                                <span>{latestNote.type === 'weakness' ? 'Cần cải thiện:' : 'Điểm mạnh:'}</span>
                                                <span className="truncate">{latestNote.title}</span>
                                            </div>
                                            <p className="line-clamp-1 text-[11px] opacity-90">{latestNote.content}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer Actions */}
                                <div className="p-3 bg-brand-cerulean/5 border-t border-brand-cerulean/15 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStudentId(stu.id)}
                                        className="text-xs font-serif-title font-bold text-brand-cerulean hover:text-brand-jasper flex items-center gap-1"
                                    >
                                        <FileText size={14} /> Hồ sơ & Lịch sử
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onOpenTestEntry?.(stu.id)}
                                            className="px-2.5 py-1 bg-brand-cerulean text-white hover:bg-brand-jasper text-[11px] font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                                            title="Nhập kết quả kiểm tra cho học viên này"
                                        >
                                            <Award size={12} /> Chấm bài
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`Bạn có chắc muốn xóa học viên "${stu.fullName}"?`)) {
                                                    onDeleteStudent(stu.id);
                                                    showToast?.('Đã xóa học viên');
                                                }
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                                            title="Xóa học viên"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Student Detail Modal */}
            <ThptStudentDetailModal
                isOpen={!!selectedStudentId}
                onClose={() => setSelectedStudentId(null)}
                student={activeStudent}
                exams={exams}
                results={results}
                subjects={subjects}
                onUpdateStudent={(updated) => {
                    onUpdateStudent(updated);
                    showToast?.('Đã cập nhật hồ sơ');
                }}
                onNavigateToTracking={onNavigateToTracking}
                showToast={showToast}
            />

            {/* Quick Add Student Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-brand-cerulean/50 backdrop-blur-sm animate-backdrop-in">
                    <div className="bg-brand-cream border-editorial shadow-2xl w-full max-w-lg p-6 space-y-4 animate-modal-pop-in">
                        <div className="flex justify-between items-center border-b border-brand-cerulean/20 pb-3">
                            <h3 className="font-serif-title font-bold text-lg text-brand-cerulean">
                                Thêm Học viên THPT Mới
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-brand-jasper">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddStudentSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Họ và tên học viên *</label>
                                <input
                                    type="text"
                                    value={newStudentForm.fullName}
                                    onChange={e => setNewStudentForm({ ...newStudentForm, fullName: e.target.value })}
                                    placeholder="Vd: Nguyễn Văn An"
                                    className="w-full input-editorial text-sm font-body px-2 py-1"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Mã học viên</label>
                                    <input
                                        type="text"
                                        value={newStudentForm.studentCode}
                                        onChange={e => setNewStudentForm({ ...newStudentForm, studentCode: e.target.value })}
                                        placeholder="HS-2026-005"
                                        className="w-full input-editorial text-sm font-body px-2 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Khối lớp</label>
                                    <EditorialSelect
                                        value={newStudentForm.grade}
                                        onChange={val => setNewStudentForm({ ...newStudentForm, grade: val })}
                                        options={[
                                            { value: '12', label: 'Lớp 12 (Luyện thi THPT)' },
                                            { value: '11', label: 'Lớp 11' },
                                            { value: '10', label: 'Lớp 10' },
                                            { value: 'luyen_thi', label: 'Lớp Cấp tốc' }
                                        ]}
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Trường THPT đang học</label>
                                <input
                                    type="text"
                                    value={newStudentForm.school}
                                    onChange={e => setNewStudentForm({ ...newStudentForm, school: e.target.value })}
                                    placeholder="Vd: THPT Chuyên Lê Hồng Phong"
                                    className="w-full input-editorial text-sm font-body px-2 py-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Số điện thoại / Zalo</label>
                                    <input
                                        type="text"
                                        value={newStudentForm.phone}
                                        onChange={e => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                                        placeholder="0912345678"
                                        className="w-full input-editorial text-sm font-body px-2 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Email liên hệ</label>
                                    <input
                                        type="email"
                                        value={newStudentForm.email}
                                        onChange={e => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                                        placeholder="hocvien@gmail.com"
                                        className="w-full input-editorial text-sm font-body px-2 py-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Khối thi nguyện vọng</label>
                                    <input
                                        type="text"
                                        value={newStudentForm.combination}
                                        onChange={e => setNewStudentForm({ ...newStudentForm, combination: e.target.value })}
                                        placeholder="Vd: A00, D01, B00"
                                        className="w-full input-editorial text-sm font-body px-2 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Mục tiêu tổng điểm</label>
                                    <input
                                        type="text"
                                        value={newStudentForm.totalTarget}
                                        onChange={e => setNewStudentForm({ ...newStudentForm, totalTarget: e.target.value })}
                                        placeholder="Vd: 27.5+ (ĐH Ngoại Thương)"
                                        className="w-full input-editorial text-sm font-body px-2 py-1"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-brand-cerulean/20">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 font-sans text-xs font-bold"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-brand-cerulean hover:bg-brand-jasper text-white font-sans text-xs font-bold shadow-sm"
                                >
                                    Lưu học viên
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThptStudentsView;
