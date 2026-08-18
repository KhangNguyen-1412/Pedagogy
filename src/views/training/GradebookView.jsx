import React, { useState } from 'react';
import { Award, BookOpen, AlertCircle } from 'lucide-react';
import { EditorialSelect } from '../../components/common/EditorialWidgets';
import { normalizeProgram, getFilteredModules, getModuleProgramNames } from "../../utils/ruleValidators";
import { calculateModuleFinal, calculateOverallGPA } from "../../utils/gpaCalculators";

export const GradebookView = ({ modules, programs = [], onUpdateModule }) => {
    const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');
    const normalizedPrograms = programs.map(normalizeProgram);
    const activeModules = getFilteredModules(modules, normalizedPrograms, selectedProgramFilter);

    const currentProg = selectedProgramFilter !== 'all' ? normalizedPrograms.find(p => p.id === selectedProgramFilter) : null;
    const evalType = currentProg?.evaluationType || 'credits';

    const programOptions = [
        { label: '🌟 Tất cả chương trình học', value: 'all' },
        ...normalizedPrograms.map(p => ({
            label: `${p.name} (${p.evaluationType === 'modules' ? 'Hệ Chuyên đề' : p.evaluationType === 'hours' ? 'Hệ Tiết học' : 'Hệ Tín chỉ'})`,
            value: p.id
        }))
    ];

    const overall = calculateOverallGPA(activeModules, normalizedPrograms, selectedProgramFilter);

    const handleGradeChange = (mod, field, val) => {
        const numVal = Math.min(10, Math.max(0, Number(val)));
        const updatedGrades = { ...(mod.grades || { attendance: 0, midterm: 0, final: 0 }), [field]: numVal };
        onUpdateModule({
            ...mod,
            grades: updatedGrades
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean">Sổ điểm & Đánh giá kết quả</h2>
                    <p className="text-lg text-gray-600 mt-1">Cập nhật điểm thành phần và theo dõi tiến độ tích lũy theo từng chương trình.</p>
                </div>
                <div className="flex gap-4 items-center flex-wrap w-full md:w-auto">
                    <div className="w-full md:w-72">
                        <EditorialSelect
                            label="Đang xem chương trình"
                            value={selectedProgramFilter}
                            onChange={val => setSelectedProgramFilter(val)}
                            options={programOptions}
                        />
                    </div>
                    {evalType === 'credits' ? (
                        <>
                            <div className="bg-white border-editorial p-3.5 text-center shadow-editorial min-w-[90px]">
                                <span className="text-[10px] uppercase text-gray-400 font-bold block">GPA Hệ 10</span>
                                <span className="text-2xl font-serif-title text-brand-cerulean font-bold">{overall.gpa10}</span>
                            </div>
                            <div className="bg-brand-cerulean text-white border-editorial p-3.5 text-center shadow-editorial min-w-[90px]">
                                <span className="text-[10px] uppercase text-white/80 font-bold block">GPA Hệ 4.0</span>
                                <span className="text-2xl font-serif-title font-bold">{overall.gpa4}</span>
                            </div>
                        </>
                    ) : (
                        <div className="bg-emerald-800 text-white border-editorial p-3.5 text-center shadow-editorial min-w-[120px]">
                            <span className="text-[10px] uppercase text-white/80 font-bold block">Đạt Chuyên đề</span>
                            <span className="text-xl font-serif-title font-bold">
                                {activeModules.filter(m => calculateModuleFinal(m.grades, m.syllabus?.weights).score10 >= 5.0 || m.status === 'completed').length} / {activeModules.length}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <div className="bg-white border-editorial shadow-editorial overflow-x-auto max-h-[500px] overflow-y-auto pr-1">
                <table className="w-full text-left font-body relative border-collapse">
                    <thead className="bg-brand-cream border-b border-brand-cerulean text-brand-cerulean font-serif-title sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-4">Mã môn</th>
                            <th className="p-4">Tên học phần / Chuyên đề</th>
                            <th className="p-4 text-center">{evalType === 'hours' ? 'Thời lượng' : 'Số TC'}</th>
                            <th className="p-4 text-center">Chuyên cần</th>
                            <th className="p-4 text-center">{evalType === 'credits' ? 'Giữa kỳ' : 'Bài tập / Thảo luận'}</th>
                            <th className="p-4 text-center">{evalType === 'credits' ? 'Cuối kỳ' : 'Bài thu hoạch / Đồ án'}</th>
                            <th className="p-4 text-center">Tổng kết (Hệ 10)</th>
                            <th className="p-4 text-center">Kết quả Đánh giá</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeModules.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-12 text-center text-gray-500 font-serif text-base bg-white/50">
                                    Chưa có học phần nào trong chương trình đã chọn. Hãy vào mục <strong className="text-brand-cerulean">Chương trình học</strong> để đăng ký hoặc thêm học phần mới.
                                </td>
                            </tr>
                        ) : (
                            activeModules.map(mod => {
                                const { score10, letter, gpa4 } = calculateModuleFinal(mod.grades, mod.syllabus?.weights);
                                const isPassed = score10 >= 5.0 || mod.status === 'completed';
                                return (
                                    <tr key={mod.id} className="hover:bg-brand-cream/50">
                                        <td className="p-4 font-sans font-bold text-gray-500">{(mod.code || '').toUpperCase()}</td>
                                        <td className="p-4 font-serif-title text-lg text-brand-cerulean font-bold flex items-center gap-2">
                                            <span>{mod.name}</span>
                                            {mod.type === 'elective' ? (
                                                <span className="px-2 py-0.5 text-xs font-serif bg-red-100 text-brand-jasper rounded font-bold">
                                                    Tự chọn
                                                </span>
                                            ) : mod.type === 'practice' ? (
                                                <span className="px-2 py-0.5 text-xs font-serif bg-blue-100 text-blue-800 rounded font-normal">
                                                    Thực hành
                                                </span>
                                            ) : null}
                                        </td>
                                        <td className="p-4 text-center font-bold">{evalType === 'hours' ? `${Number(mod.credits || 3) * 15} tiết` : `${mod.credits} TC`}</td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center"
                                                value={mod.grades?.attendance || 0}
                                                onChange={e => handleGradeChange(mod, 'attendance', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center"
                                                value={mod.grades?.midterm || 0}
                                                onChange={e => handleGradeChange(mod, 'midterm', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-editorial w-16 text-center"
                                                value={mod.grades?.final || 0}
                                                onChange={e => handleGradeChange(mod, 'final', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-4 text-center font-serif-title text-xl text-brand-jasper font-bold">
                                            {score10}
                                        </td>
                                        <td className="p-4 text-center font-bold">
                                            {evalType === 'credits' ? (
                                                <span className="px-2 py-1 bg-brand-cerulean/10 text-brand-cerulean">
                                                    {letter} ({gpa4})
                                                </span>
                                            ) : (
                                                <span className={`px-2.5 py-1 text-xs rounded font-bold ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {isPassed ? '✓ ĐẠT' : 'CHƯA ĐẠT'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
