import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { calculateRuleBreakdown } from '../../utils/ruleValidators';

export const RuleValidationPanel = ({ program, modules }) => {
    const breakdown = calculateRuleBreakdown(program, modules);
    if (!breakdown) return null;
    const { evalType, levelLabel, blocks, totalEarned, totalTarget, unit, missingBlocks, isComplete } = breakdown;

    return (
        <div className="bg-white border-editorial p-3.5 sm:p-6 shadow-editorial space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-brand-cerulean/20 pb-3 sm:pb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isComplete 
                            ? 'bg-brand-cerulean text-brand-cream border-brand-cerulean shadow-xs' 
                            : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30 shadow-xs'
                    }`}>
                        {isComplete ? <CheckCircle2 size={20} className="text-brand-cream" /> : <AlertCircle size={20} className="text-brand-jasper" />}
                    </div>
                    <div>
                        <h4 className="text-base sm:text-xl font-serif-title text-brand-cerulean font-bold">
                            Quy tắc Phân bổ & Kiểm tra Định mức ({levelLabel || (evalType === 'credits' ? 'Hệ Tín chỉ' : evalType === 'modules' ? 'Hệ Chuyên đề' : 'Hệ Tiết học')})
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs font-sans mt-0.5 flex-wrap">
                            {isComplete ? (
                                <span className="inline-flex items-center gap-1.5 text-brand-cerulean font-semibold text-[11px] sm:text-xs">
                                    <CheckCircle2 size={13} className="shrink-0 text-brand-cerulean" />
                                    Tất cả các khối học phần đã đáp ứng đầy đủ định mức của CTĐT!
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-brand-jasper font-medium text-[11px] sm:text-xs">
                                    <AlertCircle size={13} className="shrink-0 text-brand-jasper" />
                                    Còn {missingBlocks.map(b => `${b.label}: thiếu ${b.target - b.current} ${b.unit}`).join(', ')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-auto text-center px-3 py-1.5 sm:px-4 sm:py-2 font-serif-title text-xs sm:text-sm border rounded-sm shrink-0 shadow-xs bg-brand-cream text-brand-cerulean border-brand-cerulean/30">
                    Hiện có trong CTĐT: <span className={`font-bold ${isComplete ? 'text-brand-cerulean' : 'text-brand-jasper'}`}>{totalEarned}</span> / {totalTarget} {unit}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3.5">
                {blocks.map(b => {
                    const isOk = b.current >= b.target && b.target > 0;
                    const isShort = b.current < b.target && b.target > 0;
                    const isOver = b.current > b.target && b.target > 0;
                    const diff = b.target - b.current;

                    return (
                        <div key={b.id || b.label} className={`p-2.5 sm:p-4 border rounded-sm text-xs font-sans space-y-1.5 sm:space-y-2 transition-all ${
                            isShort 
                                ? 'bg-brand-cream/90 border-brand-jasper/40 text-gray-800 shadow-xs hover:border-brand-jasper' 
                                : isOk 
                                    ? 'bg-white border-brand-cerulean/40 text-brand-cerulean shadow-xs hover:border-brand-cerulean' 
                                    : 'bg-brand-cream/60 border-brand-cerulean/20 text-gray-600'
                        }`}>
                            <div className="font-serif-title font-bold text-[11px] sm:text-xs truncate text-brand-cerulean">{b.label}</div>
                            <div className="text-lg sm:text-xl font-bold font-serif-title text-brand-cerulean">
                                <span className={isShort ? 'text-brand-jasper' : 'text-brand-cerulean'}>{b.current}</span>
                                <span className="text-[10px] sm:text-xs text-gray-500 font-normal"> / {b.target} {b.unit}</span>
                            </div>
                            <div className="font-bold text-[10px] sm:text-[11px] pt-0.5 border-t border-brand-cerulean/10">
                                {b.target === 0 ? (
                                    <span className="text-gray-400 font-normal">Không quy định</span>
                                ) : isOk && !isOver ? (
                                    <span className="inline-flex items-center gap-1 text-brand-cerulean">
                                        <CheckCircle2 size={11} className="shrink-0 text-brand-cerulean" /> Đã đủ
                                    </span>
                                ) : isOver ? (
                                    <span className="inline-flex items-center gap-1 text-brand-cerulean">
                                        <Info size={11} className="shrink-0 text-brand-cerulean" /> Vượt {b.current - b.target}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-brand-jasper">
                                        <AlertCircle size={11} className="shrink-0 text-brand-jasper" /> Thiếu {diff}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
