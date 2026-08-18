import React, { useState } from 'react';
import {
    Calendar,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    ExternalLink,
    Plus,
    Pencil,
    Trash2,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Grid,
    List
} from 'lucide-react';
import {
    EditorialSelect,
    EditorialDatePicker,
    EditorialTimePicker,
    Modal
} from '../../components/common/EditorialWidgets';

export const CalendarAttendanceView = ({ modules, events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventForm, setEventForm] = useState({
        moduleId: modules[0]?.id || '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '11:30',
        location: '',
        meetLink: '',
        attendanceStatus: 'planned',
        notes: ''
    });

    const handleCreateEvent = (e) => {
        e.preventDefault();
        onAddEvent({
            id: 'evt_' + Date.now(),
            ...eventForm
        });
        setIsModalOpen(false);
        setEventForm({
            moduleId: modules[0]?.id || '',
            title: '',
            date: new Date().toISOString().split('T')[0],
            startTime: '08:00',
            endTime: '11:30',
            location: '',
            meetLink: '',
            attendanceStatus: 'planned',
            notes: ''
        });
    };

    const handleCheckin = (evt, newStatus) => {
        onUpdateEvent({
            ...evt,
            attendanceStatus: newStatus
        });
    };

    const moduleOptions = modules.map(m => ({ label: `${m.code} - ${m.name}`, value: m.id }));

    // Month Navigation Helpers
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const monthNames = [
        "THÁNG 1", "THÁNG 2", "THÁNG 3", "THÁNG 4", "THÁNG 5", "THÁNG 6",
        "THÁNG 7", "THÁNG 8", "THÁNG 9", "THÁNG 10", "THÁNG 11", "THÁNG 12"
    ];

    // Calendar Grid Days Calculation
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6

    const todayStr = new Date().toISOString().split('T')[0];

    const openAddForDate = (dateString) => {
        setEventForm({
            ...eventForm,
            date: dateString
        });
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Lịch biểu & Điểm danh</h2>
                    <p className="text-lg text-gray-600 mt-1">Quản lý thời gian, link học trực tuyến & ghi chú chuyên cần.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
                        title={viewMode === 'list' ? 'Chuyển sang dạng Lịch theo tháng' : 'Chuyển sang dạng Danh sách'}
                        className="p-2.5 bg-white border border-brand-cerulean text-brand-cerulean hover:bg-brand-cerulean hover:text-white transition-all shadow-sm flex items-center justify-center group"
                    >
                        {viewMode === 'list' ? (
                            <Calendar size={18} className="group-hover:scale-110 transition-transform" />
                        ) : (
                            <List size={18} className="group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-jasper text-white font-serif-title shadow-editorial whitespace-nowrap">
                        <Plus size={18} /> Thêm Buổi học / Thi
                    </button>
                </div>
            </header>

            {/* MONTH GRID VIEW */}
            {viewMode === 'grid' ? (
                <div className="bg-white border-editorial p-6 shadow-editorial space-y-6">
                    {/* Month Nav Controls */}
                    <div className="flex justify-between items-center pb-4 border-b border-brand-cerulean/20">
                        <button onClick={prevMonth} className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-2xl font-serif-title text-brand-cerulean font-bold">
                            {monthNames[month]} - NĂM {year}
                        </h3>
                        <button onClick={nextMonth} className="p-2 text-brand-cerulean hover:bg-brand-cream border border-brand-cerulean/20 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Day Headers (Mon - Sun) */}
                    <div className="grid grid-cols-7 gap-1 text-center font-serif-title text-brand-cerulean font-bold text-sm bg-brand-cream py-2 border-b border-brand-cerulean">
                        <div>Thứ 2</div>
                        <div>Thứ 3</div>
                        <div>Thứ 4</div>
                        <div>Thứ 5</div>
                        <div>Thứ 6</div>
                        <div>Thứ 7</div>
                        <div>Chủ nhật</div>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty padding cells before first day */}
                        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="h-28 bg-gray-50/50 border border-gray-100 p-2 opacity-30"></div>
                        ))}

                        {/* Month Days */}
                        {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                            const dayNum = dayIdx + 1;
                            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isToday = dayStr === todayStr;
                            const dayEvents = events.filter(e => e.date === dayStr);

                            return (
                                <div
                                    key={dayStr}
                                    onClick={() => openAddForDate(dayStr)}
                                    className={`h-28 border p-2 flex flex-col justify-between transition-all cursor-pointer group hover:border-brand-jasper ${
                                        isToday ? 'bg-amber-50/60 border-brand-jasper font-bold' : 'bg-white border-brand-cerulean/20 hover:bg-brand-cream/50'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-sans font-bold ${isToday ? 'text-brand-jasper' : 'text-brand-cerulean'}`}>
                                            {dayNum}
                                        </span>
                                        {isToday && (
                                            <span className="text-[10px] bg-brand-jasper text-white px-1 font-sans uppercase">Hôm nay</span>
                                        )}
                                    </div>

                                    {/* Events List inside Day Cell */}
                                    <div className="space-y-1 overflow-y-auto max-h-20 my-1">
                                        {dayEvents.map(evt => {
                                            const mod = modules.find(m => m.id === evt.moduleId);
                                            const statusBg = evt.attendanceStatus === 'present' ? 'bg-green-700 text-white' : evt.attendanceStatus === 'absent' ? 'bg-red-700 text-white' : 'bg-brand-cerulean text-white';
                                            return (
                                                <div
                                                    key={evt.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert(`Buổi học: ${evt.title}\nGiờ: ${evt.startTime} - ${evt.endTime}\nĐịa điểm: ${evt.location || 'N/A'}`);
                                                    }}
                                                    className={`p-1 text-[11px] font-sans truncate rounded flex items-center justify-between ${statusBg}`}
                                                    title={`${evt.startTime} ${evt.title}`}
                                                >
                                                    <span className="truncate">{mod?.code || ''} {evt.title}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="text-[10px] text-gray-400 group-hover:text-brand-jasper opacity-0 group-hover:opacity-100 transition-opacity text-right font-serif-title">
                                        + Thêm
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* LIST VIEW */
                <div className="space-y-4">
                    {events.map(evt => {
                        const mod = modules.find(m => m.id === evt.moduleId);
                        return (
                            <div key={evt.id} className="bg-white border-editorial p-6 shadow-editorial flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-brand-cerulean/10 text-brand-cerulean text-xs font-bold font-sans">
                                            {mod?.code || 'Học phần'}
                                        </span>
                                        <span className="text-sm font-sans text-gray-500 font-bold">{evt.date} ({evt.startTime} - {evt.endTime})</span>
                                    </div>
                                    <h4 className="text-2xl font-serif-title text-brand-cerulean">{evt.title}</h4>
                                    <div className="flex gap-4 text-sm font-body text-gray-600">
                                        <span>📍 {evt.location || 'Chưa cập nhật địa điểm'}</span>
                                        {evt.meetLink && (
                                            <a href={evt.meetLink} target="_blank" rel="noreferrer" className="text-brand-jasper flex items-center gap-1 hover:underline font-bold">
                                                <ExternalLink size={14} /> Link Google Meet / Zoom
                                            </a>
                                        )}
                                    </div>
                                    {evt.notes && (
                                        <p className="text-xs bg-yellow-50 text-yellow-800 p-2 border-l-2 border-yellow-500 italic">
                                            📝 Ghi chú: {evt.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-serif-title text-gray-400 uppercase tracking-widest">Điểm danh</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`Xóa sự kiện "${evt.title}"?`)) {
                                                    onDeleteEvent(evt.id);
                                                }
                                            }}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Xóa sự kiện"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="flex gap-1 bg-brand-cream p-1 border border-brand-cerulean/20">
                                        <button
                                            onClick={() => handleCheckin(evt, 'present')}
                                            className={`px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'present' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-green-100'}`}
                                        >
                                            Có mặt
                                        </button>
                                        <button
                                            onClick={() => handleCheckin(evt, 'late')}
                                            className={`px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'late' ? 'bg-yellow-600 text-white' : 'text-gray-600 hover:bg-yellow-100'}`}
                                        >
                                            Trễ
                                        </button>
                                        <button
                                            onClick={() => handleCheckin(evt, 'absent')}
                                            className={`px-3 py-1 text-xs font-serif-title ${evt.attendanceStatus === 'absent' ? 'bg-red-700 text-white' : 'text-gray-600 hover:bg-red-100'}`}
                                        >
                                            Vắng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {events.length === 0 && (
                        <div className="p-12 text-center border border-dashed border-brand-cerulean text-gray-500 font-serif-title">
                            Chưa có buổi học hoặc lịch thi nào. Hãy tạo buổi học mới.
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm Sự kiện Lịch học / Lịch thi">
                <form onSubmit={handleCreateEvent} className="space-y-6">
                    <div>
                        <EditorialSelect
                            label="Môn học liên quan"
                            value={eventForm.moduleId}
                            onChange={val => setEventForm({ ...eventForm, moduleId: val })}
                            options={moduleOptions}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Tên buổi học / Sự kiện</label>
                        <input required type="text" className="input-editorial w-full" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="VD: Buổi 3 - Thảo luận nhóm..." />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <EditorialDatePicker
                                label="Ngày học"
                                value={eventForm.date}
                                onChange={val => setEventForm({ ...eventForm, date: val })}
                            />
                        </div>
                        <div>
                            <EditorialTimePicker
                                label="Giờ bắt đầu"
                                value={eventForm.startTime}
                                onChange={val => setEventForm({ ...eventForm, startTime: val })}
                            />
                        </div>
                        <div>
                            <EditorialTimePicker
                                label="Giờ kết thúc"
                                value={eventForm.endTime}
                                onChange={val => setEventForm({ ...eventForm, endTime: val })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Địa điểm / Phòng học</label>
                            <input type="text" className="input-editorial w-full" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="VD: Phòng A3.02" />
                        </div>
                        <div>
                            <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Link Meet / Zoom (Nếu online)</label>
                            <input type="url" className="input-editorial w-full" value={eventForm.meetLink} onChange={e => setEventForm({ ...eventForm, meetLink: e.target.value })} placeholder="https://meet.google.com/..." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-serif-title text-brand-cerulean mb-1">Ghi chú dặn dò</label>
                        <input type="text" className="input-editorial w-full" value={eventForm.notes} onChange={e => setEventForm({ ...eventForm, notes: e.target.value })} placeholder="Ví dụ: Mang theo máy tính cá nhân..." />
                    </div>

                    <div className="pt-4 flex justify-end gap-4 border-t border-brand-cerulean/20">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 font-serif-title">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-brand-cerulean text-white font-serif-title shadow-editorial">Lưu Sự Kiện</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
