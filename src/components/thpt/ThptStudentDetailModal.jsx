import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X, User, Phone, Mail, GraduationCap, Target, Award,
    Plus, Trash2, Check, Calendar, AlertCircle, FileText, CheckCircle2, TrendingUp, Sparkles, BookOpen
} from 'lucide-react';
import { EditorialSelect } from './EditorialSelect';

export const ThptStudentDetailModal = ({
    isOpen,
    onClose,
    student,
    exams = [],
    results = [],
    subjects = [],
    onUpdateStudent,
    onNavigateToTracking,
    showToast
}) => {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'history' | 'notes'
    const [isEditing, setIsEditing] = useState(false);

    // Profile form state
    const [formData, setFormData] = useState(() => {
        if (!student) return {};
        return JSON.parse(JSON.stringify(student));
    });

    // New Note state
    const [noteForm, setNoteForm] = useState({
        type: 'weakness', // 'strength' | 'weakness' | 'general'
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
    });

    if (!isOpen || !student) return null;

    // Student's test results
    const studentResults = results.filter(r => r.studentId === student.id).sort((a, b) => new Date(b.testDate) - new Date(a.testDate));

    // Calculate metrics
    const totalTests = studentResults.length;
    const avgScore = totalTests > 0
        ? (studentResults.reduce((sum, r) => sum + (Number(r.score) || 0), 0) / totalTests).toFixed(1)
        : 'Chưa có';
    const highestScore = totalTests > 0
        ? Math.max(...studentResults.map(r => Number(r.score) || 0)).toFixed(1)
        : 'Chưa có';

    // Save profile updates
    const handleSaveProfile = (e) => {
        e.preventDefault();
        onUpdateStudent(formData);
        setIsEditing(false);
        showToast?.('Đã cập nhật hồ sơ học viên');
    };

    // Add diagnostic note
    const handleAddNote = (e) => {
        e.preventDefault();
        if (!noteForm.title.trim() || !noteForm.content.trim()) return;

        const newNote = {
            id: 'note_' + Date.now(),
            date: noteForm.date,
            type: noteForm.type,
            title: noteForm.title.trim(),
            content: noteForm.content.trim()
        };

        const updatedNotes = [newNote, ...(formData.diagnosticNotes || [])];
        const updatedStudent = { ...formData, diagnosticNotes: updatedNotes };
        setFormData(updatedStudent);
        onUpdateStudent(updatedStudent);

        setNoteForm({
            type: 'weakness',
            title: '',
            content: '',
            date: new Date().toISOString().split('T')[0]
        });
        showToast?.('Đã thêm ghi chú đánh giá');
    };

    // Delete note
    const handleDeleteNote = (noteId) => {
        const updatedNotes = (formData.diagnosticNotes || []).filter(n => n.id !== noteId);
        const updatedStudent = { ...formData, diagnosticNotes: updatedNotes };
        setFormData(updatedStudent);
        onUpdateStudent(updatedStudent);
        showToast?.('Đã xóa ghi chú');
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-brand-cerulean/50 backdrop-blur-sm animate-backdrop-in">
            <div className="bg-brand-cream border-editorial shadow-2xl w-full max-w-4xl h-[680px] max-h-[90vh] flex flex-col animate-modal-pop-in overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-brand-cerulean/20 flex justify-between items-center bg-brand-cerulean text-brand-cream shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-cerulean flex items-center justify-center font-serif-title font-bold text-xl shadow-md border-2 border-white/40">
                            {student.fullName?.charAt(0) || 'H'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-serif-title font-bold tracking-wide">
                                    {student.fullName}
                                </h2>
                                <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded font-bold">
                                    {student.studentCode || 'HS-THPT'}
                                </span>
                            </div>
                            <p className="text-xs opacity-85 font-sans mt-0.5">
                                {student.school || 'Trường THPT'} • Lớp {student.grade || '12'} • {student.targetScores?.combination || 'Khối thi THPT'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors text-brand-cream"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Performance Strip */}
                <div className="bg-white px-6 py-3 border-b border-brand-cerulean/15 grid grid-cols-3 sm:grid-cols-4 gap-4 text-center shrink-0">
                    <div className="border-r border-gray-100">
                        <span className="text-[11px] text-gray-500 font-serif">Số đề đã thi</span>
                        <p className="font-serif-title font-bold text-brand-cerulean text-lg">{totalTests}</p>
                    </div>
                    <div className="border-r border-gray-100">
                        <span className="text-[11px] text-gray-500 font-serif">Điểm trung bình</span>
                        <p className="font-serif-title font-bold text-brand-jasper text-lg">{avgScore}</p>
                    </div>
                    <div className="border-r border-gray-100">
                        <span className="text-[11px] text-gray-500 font-serif">Điểm cao nhất</span>
                        <p className="font-serif-title font-bold text-emerald-700 text-lg">{highestScore}</p>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-[11px] text-gray-500 font-serif">Mục tiêu tổng</span>
                        <p className="font-serif-title font-bold text-indigo-700 text-lg">
                            {student.targetScores?.totalTarget || '27.0+'}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-brand-cerulean/20 bg-brand-cerulean/5 px-6 pt-3 gap-6 shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 px-1 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'profile'
                                ? 'border-brand-jasper text-brand-jasper'
                                : 'border-transparent text-brand-cerulean/70 hover:text-brand-cerulean'
                        }`}
                    >
                        <User size={16} /> Hồ sơ & Mục tiêu
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 px-1 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'history'
                                ? 'border-brand-jasper text-brand-jasper'
                                : 'border-transparent text-brand-cerulean/70 hover:text-brand-cerulean'
                        }`}
                    >
                        <Award size={16} /> Lịch sử Giải đề ({studentResults.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('notes')}
                        className={`pb-3 px-1 font-serif-title text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'notes'
                                ? 'border-brand-jasper text-brand-jasper'
                                : 'border-transparent text-brand-cerulean/70 hover:text-brand-cerulean'
                        }`}
                    >
                        <FileText size={16} /> Đánh giá & Ghi chú ({(formData.diagnosticNotes || []).length})
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* TAB 1: PROFILE & TARGETS */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-serif-title font-bold text-brand-cerulean text-base">
                                    Thông tin Cá nhân & Mục tiêu Kỳ thi
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-xs font-sans font-bold text-brand-cerulean hover:text-brand-jasper underline"
                                >
                                    {isEditing ? 'Hủy chỉnh sửa' : '✏️ Chỉnh sửa thông tin'}
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSaveProfile} className="bg-white p-5 border border-brand-cerulean/20 shadow-sm space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Họ và tên *</label>
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full input-editorial text-sm font-body px-2 py-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Mã học viên</label>
                                            <input
                                                type="text"
                                                value={formData.studentCode}
                                                onChange={e => setFormData({ ...formData, studentCode: e.target.value })}
                                                className="w-full input-editorial text-sm font-body px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Trường THPT đang học</label>
                                            <input
                                                type="text"
                                                value={formData.school}
                                                onChange={e => setFormData({ ...formData, school: e.target.value })}
                                                className="w-full input-editorial text-sm font-body px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Lớp</label>
                                            <input
                                                type="text"
                                                value={formData.grade}
                                                onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                                className="w-full input-editorial text-sm font-body px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Số điện thoại / Zalo</label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full input-editorial text-sm font-body px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full input-editorial text-sm font-body px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <h4 className="font-serif-title font-bold text-xs text-brand-cerulean uppercase mb-2">
                                            Mục tiêu xét tuyển Đại học & Điểm số
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Khối xét tuyển</label>
                                                <input
                                                    type="text"
                                                    value={formData.targetScores?.combination || ''}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        targetScores: { ...(formData.targetScores || {}), combination: e.target.value }
                                                    })}
                                                    placeholder="Vd: A00 (Toán, Lí, Hóa)"
                                                    className="w-full input-editorial text-sm font-body px-2 py-1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Mục tiêu tổng điểm</label>
                                                <input
                                                    type="text"
                                                    value={formData.targetScores?.totalTarget || ''}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        targetScores: { ...(formData.targetScores || {}), totalTarget: e.target.value }
                                                    })}
                                                    placeholder="Vd: 28.0 (ĐH Bách Khoa)"
                                                    className="w-full input-editorial text-sm font-body px-2 py-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-1.5 border border-gray-300 text-xs font-bold"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-1.5 bg-brand-cerulean text-white text-xs font-bold shadow-sm"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Personal Info Box */}
                                    <div className="bg-white p-5 border border-brand-cerulean/20 shadow-sm space-y-3">
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm border-b pb-2 flex items-center gap-2">
                                            <User size={16} /> Thông tin liên hệ
                                        </h4>
                                        <div className="space-y-2 text-sm font-body text-gray-700">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Mã học viên:</span>
                                                <strong className="font-mono text-brand-cerulean">{student.studentCode || '---'}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Trường THPT:</span>
                                                <strong>{student.school || '---'}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Lớp:</span>
                                                <strong>{student.grade || '---'}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Số điện thoại/Zalo:</span>
                                                <strong className="text-brand-jasper">{student.phone || '---'}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Email:</span>
                                                <span>{student.email || '---'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Targets Box */}
                                    <div className="bg-white p-5 border border-brand-cerulean/20 shadow-sm space-y-3">
                                        <h4 className="font-serif-title font-bold text-brand-cerulean text-sm border-b pb-2 flex items-center gap-2">
                                            <Target size={16} /> Mục tiêu Kỳ thi THPT Quốc gia
                                        </h4>
                                        <div className="space-y-2.5 text-sm font-body">
                                            <div className="p-3 bg-brand-cerulean/5 rounded border border-brand-cerulean/15">
                                                <span className="text-xs text-gray-500 block">Khối thi & Nguyện vọng:</span>
                                                <strong className="font-serif-title text-base text-brand-cerulean">
                                                    {student.targetScores?.combination || 'Chưa thiết lập'}
                                                </strong>
                                            </div>
                                            <div className="p-3 bg-brand-jasper/5 rounded border border-brand-jasper/15">
                                                <span className="text-xs text-gray-500 block">Tổng điểm mục tiêu:</span>
                                                <strong className="font-serif-title text-lg text-brand-jasper">
                                                    {student.targetScores?.totalTarget || '27.0+'}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: TEST HISTORY */}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-serif-title font-bold text-brand-cerulean text-base">
                                    Lịch sử làm bài kiểm tra & Đề thi thử
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onNavigateToTracking?.(student.id);
                                    }}
                                    className="text-xs font-sans font-bold text-brand-jasper hover:underline flex items-center gap-1"
                                >
                                    <TrendingUp size={14} /> Xem biểu đồ phân tích tiến bộ
                                </button>
                            </div>

                            {studentResults.length === 0 ? (
                                <div className="p-8 text-center bg-white border border-brand-cerulean/20 shadow-sm">
                                    <Award size={32} className="mx-auto text-gray-400 mb-2" />
                                    <p className="font-serif-title text-brand-cerulean text-sm">Chưa có dữ liệu bài làm</p>
                                    <p className="text-xs text-gray-500 mt-1">Hãy nhập kết quả kiểm tra hoặc chấm đề thi cho học viên này.</p>
                                </div>
                            ) : (
                                <div className="bg-white border border-brand-cerulean/20 shadow-sm overflow-hidden">
                                    <table className="w-full text-left text-xs font-body">
                                        <thead className="bg-brand-cerulean text-brand-cream font-serif-title font-bold">
                                            <tr>
                                                <th className="p-3">Ngày làm</th>
                                                <th className="p-3">Tên đề thi</th>
                                                <th className="p-3 text-center">Thời gian</th>
                                                <th className="p-3 text-center">Đúng/Tổng</th>
                                                <th className="p-3 text-center">Điểm số</th>
                                                <th className="p-3">Nhận xét của GV</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {studentResults.map(res => {
                                                const exam = exams.find(e => e.id === res.examId) || { title: 'Đề thi đã lưu' };
                                                const isGood = Number(res.score) >= 8.0;
                                                return (
                                                    <tr key={res.id} className="hover:bg-brand-cream/60 transition-colors">
                                                        <td className="p-3 font-mono text-gray-600">{res.testDate}</td>
                                                        <td className="p-3 font-serif-title font-bold text-brand-cerulean">{exam.title}</td>
                                                        <td className="p-3 text-center">{res.timeSpent || 90}p</td>
                                                        <td className="p-3 text-center font-bold">{res.correctCount || 0} / {res.totalQuestions || 0}</td>
                                                        <td className="p-3 text-center">
                                                            <span className={`px-2.5 py-1 rounded font-bold font-serif-title text-sm ${
                                                                isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                                                            }`}>
                                                                {Number(res.score).toFixed(1)}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-gray-600 italic line-clamp-2 max-w-xs">{res.teacherFeedback || '---'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: DIAGNOSTIC NOTES */}
                    {activeTab === 'notes' && (
                        <div className="space-y-6">
                            {/* Add Note Form */}
                            <form onSubmit={handleAddNote} className="bg-white p-4 border border-brand-cerulean/20 shadow-sm space-y-3">
                                <h4 className="font-serif-title font-bold text-brand-cerulean text-sm flex items-center gap-1.5">
                                    <Sparkles size={16} className="text-brand-jasper" /> Thêm ghi chú sư phạm mới:
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Phân loại ghi chú</label>
                                        <EditorialSelect
                                            value={noteForm.type}
                                            onChange={val => setNoteForm({ ...noteForm, type: val })}
                                            options={[
                                                { value: 'weakness', label: '⚠️ Điểm yếu / Hay sai' },
                                                { value: 'strength', label: '🌟 Điểm mạnh / Thế mạnh' },
                                                { value: 'general', label: '📝 Ghi chú chung' }
                                            ]}
                                            size="sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-6">
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Tiêu đề ghi chú *</label>
                                        <input
                                            type="text"
                                            value={noteForm.title}
                                            onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                                            placeholder="Vd: Thường xuyên sai phần nguyên hàm..."
                                            className="w-full input-editorial text-xs font-body px-2 py-1"
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Ngày ghi chú</label>
                                        <input
                                            type="date"
                                            value={noteForm.date}
                                            onChange={e => setNoteForm({ ...noteForm, date: e.target.value })}
                                            className="w-full input-editorial text-xs font-body px-2 py-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-serif-title text-brand-cerulean mb-1">Chi tiết nhận xét & Hướng dẫn khắc phục *</label>
                                    <textarea
                                        rows={2}
                                        value={noteForm.content}
                                        onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                                        placeholder="Nhập ghi chú chi tiết về bài test, kiến thức học sinh bị hổng..."
                                        className="w-full p-2 bg-brand-cream/40 border border-brand-cerulean/20 text-xs font-body rounded"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 bg-brand-cerulean hover:bg-brand-jasper text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                                    >
                                        <Plus size={14} /> Thêm ghi chú
                                    </button>
                                </div>
                            </form>

                            {/* Notes List */}
                            <div className="space-y-3">
                                {(formData.diagnosticNotes || []).length === 0 ? (
                                    <div className="p-6 text-center bg-white border border-brand-cerulean/20">
                                        <p className="text-xs text-gray-500 font-body">Chưa có ghi chú sư phạm nào cho học viên này.</p>
                                    </div>
                                ) : (
                                    (formData.diagnosticNotes || []).map(note => {
                                        const isWeakness = note.type === 'weakness';
                                        const isStrength = note.type === 'strength';
                                        return (
                                            <div
                                                key={note.id}
                                                className={`p-4 bg-white border rounded shadow-sm relative transition-all ${
                                                    isWeakness
                                                        ? 'border-l-4 border-l-red-500 border-gray-200'
                                                        : isStrength
                                                            ? 'border-l-4 border-l-emerald-500 border-gray-200'
                                                            : 'border-l-4 border-l-brand-cerulean border-gray-200'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                                            isWeakness
                                                                ? 'bg-red-100 text-red-800'
                                                                : isStrength
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {isWeakness ? 'Điểm yếu' : isStrength ? 'Điểm mạnh' : 'Ghi chú'}
                                                        </span>
                                                        <h5 className="font-serif-title font-bold text-brand-cerulean text-sm">
                                                            {note.title}
                                                        </h5>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <span>{note.date}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteNote(note.id)}
                                                            className="text-gray-400 hover:text-red-600 p-1"
                                                            title="Xóa ghi chú này"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-700 font-body mt-2 leading-relaxed">
                                                    {note.content}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-brand-cerulean/20 bg-brand-cerulean/5 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-brand-cerulean text-white font-sans text-xs font-bold hover:bg-brand-cerulean/90 shadow-sm"
                    >
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ThptStudentDetailModal;
