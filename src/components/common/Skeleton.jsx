import React from 'react';

// --- BASE SKELETON PRIMITIVE ---
export const Skeleton = ({ className = '', style, variant = 'rect', ...props }) => {
    const baseClasses = 'skeleton-shimmer border border-brand-cerulean/10 select-none';
    const variantClasses = {
        rect: 'rounded-xs',
        circle: 'rounded-full',
        text: 'rounded-xs h-4 my-1',
        card: 'rounded-xs border-editorial'
    }[variant] || 'rounded-xs';

    return (
        <div
            className={`${baseClasses} ${variantClasses} ${className}`}
            style={style}
            aria-hidden="true"
            {...props}
        />
    );
};

// --- SKELETON TEXT LINES ---
export const SkeletonText = ({ lines = 3, className = '', lastLineWidth = '60%' }) => {
    return (
        <div className={`space-y-2 py-1 ${className}`}>
            {Array.from({ length: lines }).map((_, idx) => (
                <Skeleton
                    key={idx}
                    variant="text"
                    className="h-3.5 bg-brand-cerulean/5"
                    style={{
                        width: idx === lines - 1 ? lastLineWidth : '100%'
                    }}
                />
            ))}
        </div>
    );
};

// --- SKELETON CARD ---
export const SkeletonCard = ({ className = '', children }) => {
    return (
        <div className={`bg-white border-editorial p-6 shadow-editorial space-y-4 ${className}`}>
            {children || (
                <>
                    <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/10">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-7 w-3/4" />
                    <SkeletonText lines={3} />
                    <div className="pt-2 flex justify-end gap-2 border-t border-brand-cerulean/10">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                </>
            )}
        </div>
    );
};

// --- DASHBOARD SKELETON ---
export const DashboardSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64 sm:w-80" />
                    <Skeleton className="h-4 w-48 sm:w-60" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white border-editorial p-6 shadow-editorial flex items-center gap-4">
                        <Skeleton variant="circle" className="w-14 h-14 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Bar Banner */}
            <div className="bg-white border-editorial p-6 shadow-editorial space-y-3">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
                <div className="flex justify-between items-center pt-1">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-28" />
                </div>
            </div>

            {/* 2-Column Content: Upcoming Events & Modules List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 cols: Modules Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>

                {/* Right 1 col: Upcoming Schedule */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="bg-white border-editorial p-5 shadow-editorial space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-3 bg-brand-cream/40 border border-brand-cerulean/15 rounded-xs space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PROGRAMS SKELETON ---
export const ProgramsSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>

            {/* Program Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <SkeletonText lines={2} />
                        <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>
                        <div className="pt-3 border-t border-brand-cerulean/10 flex justify-between items-center">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- CALENDAR TIMETABLE SKELETON ---
export const CalendarSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-36" />
                </div>
            </div>

            {/* Timetable Matrix */}
            <div className="bg-white border-editorial shadow-editorial p-5 space-y-4">
                {/* Week Nav Header */}
                <div className="flex justify-between items-center pb-3 border-b border-brand-cerulean/10">
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-6 w-48" />
                </div>

                {/* 7 Columns for Days */}
                <div className="grid grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                        <div key={day} className="space-y-2">
                            <div className="p-2 bg-brand-cream/60 border border-brand-cerulean/20 text-center space-y-1">
                                <Skeleton className="h-4 w-12 mx-auto" />
                                <Skeleton className="h-3 w-16 mx-auto" />
                            </div>
                            <div className="h-32 bg-white border border-brand-cerulean/15 p-2 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                            <div className="h-32 bg-white border border-brand-cerulean/15 p-2 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- RESOURCES & STUDY LOGS SKELETON ---
export const ResourcesSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-36" />
                    <Skeleton className="h-9 w-36" />
                </div>
            </div>

            {/* Filter toolbar */}
            <div className="bg-white border-editorial p-5 shadow-editorial flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-3 flex-1 w-full">
                    <Skeleton className="h-10 w-52" />
                    <Skeleton className="h-10 flex-1" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white border-editorial p-4 shadow-editorial flex items-center gap-3">
                        <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-6 w-12" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3 Study Log Cards */}
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white border-editorial shadow-editorial p-6 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-brand-cerulean/15">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-18" />
                                <Skeleton className="h-6 w-36" />
                            </div>
                            <div className="flex gap-3">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-28" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-2/3" />
                        <div className="p-4 bg-brand-cream/40 border-l-4 border-brand-cerulean/40 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Skeleton className="h-6 w-24 rounded-xs" />
                            <Skeleton className="h-6 w-28 rounded-xs" />
                            <Skeleton className="h-6 w-20 rounded-xs" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- GRADEBOOK SKELETON ---
export const GradebookSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>

            {/* GPA Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white border-editorial p-4 shadow-editorial space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-7 w-16" />
                    </div>
                ))}
            </div>

            {/* Gradebook Matrix Table */}
            <div className="bg-white border-editorial shadow-editorial p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-brand-cerulean/15">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map(row => (
                        <div key={row} className="flex justify-between items-center p-3 border-b border-brand-cerulean/10">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-60" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MODULE DETAIL SKELETON ---
export const ModuleDetailSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header with back button */}
            <div className="space-y-4 pb-4 border-b-2 border-brand-cerulean/20">
                <Skeleton className="h-5 w-36" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex gap-2 items-center">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-9 w-3/4" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-28" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </div>

            {/* 2-Column Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 cols: Syllabus & Lessons */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <Skeleton className="h-6 w-44" />
                        <SkeletonText lines={4} />
                        <div className="pt-2 grid grid-cols-2 gap-4">
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                        </div>
                    </div>

                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/10">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 border border-brand-cerulean/15 space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right 1 col: Evaluation & Instructor Card */}
                <div className="space-y-6">
                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <Skeleton className="h-6 w-36" />
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-brand-cerulean/10">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border-editorial p-6 shadow-editorial space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex items-center gap-3">
                            <Skeleton variant="circle" className="w-12 h-12" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SYLLABUS SKELETON ---
export const SyllabusSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-48" />
                </div>
            </div>

            {/* Filter toolbar */}
            <div className="bg-white border-editorial p-4 shadow-editorial flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-3 flex-1 w-full">
                    <Skeleton className="h-10 w-60" />
                    <Skeleton className="h-10 flex-1" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Main syllabus view */}
            <div className="bg-white border-editorial p-8 shadow-editorial space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-brand-cerulean/20">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-8 w-2/3" />
                        <div className="flex gap-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <SkeletonText lines={3} />
                </div>

                {/* Session breakdown */}
                <div className="space-y-3 pt-4 border-t border-brand-cerulean/10">
                    <Skeleton className="h-5 w-48" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-4 bg-brand-cream/40 border border-brand-cerulean/15 flex justify-between items-center">
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                            <Skeleton className="h-7 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- PRACTICUM SKELETON ---
export const PracticumSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-60" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-2 border-b border-brand-cerulean/20 pb-1">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-9 w-32" />
                ))}
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white border-editorial p-4 shadow-editorial space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-7 w-16" />
                        <Skeleton className="h-2.5 w-24" />
                    </div>
                ))}
            </div>

            {/* 2-Column layout: School card & Observation diary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <Skeleton className="h-6 w-44" />
                    <div className="space-y-3 pt-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex justify-between items-center py-1.5 border-b border-brand-cerulean/10">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-3.5 w-32" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/10">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 border border-brand-cerulean/15 space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-5 w-3/4" />
                            <SkeletonText lines={2} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- LESSON PLANS SKELETON ---
export const LessonPlansSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-52" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>

            {/* Tab navigation */}
            <div className="flex gap-2 border-b border-brand-cerulean/20 pb-1">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-9 w-36" />
                ))}
            </div>

            {/* Search toolbar */}
            <div className="bg-white border-editorial p-4 shadow-editorial flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Skeleton className="h-10 flex-1 w-full" />
                <div className="flex gap-2 w-full sm:w-auto">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Lesson Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-6 w-4/5" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <SkeletonText lines={2} />
                        <div className="pt-3 border-t border-brand-cerulean/10 flex justify-between items-center">
                            <Skeleton className="h-4 w-28" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPETENCIES SKELETON ---
export const CompetenciesSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-80" />
                    <Skeleton className="h-4 w-60" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>

            {/* Tab navigation */}
            <div className="flex gap-2 border-b border-brand-cerulean/20 pb-1">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-9 w-36" />
                ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white border-editorial p-4 shadow-editorial space-y-1.5">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-7 w-12" />
                    </div>
                ))}
            </div>

            {/* Overall progress card */}
            <div className="bg-white border-editorial p-6 shadow-editorial space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
            </div>

            {/* Standards List */}
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-5 w-64" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-brand-cerulean/10">
                            {[1, 2].map(c => (
                                <div key={c} className="p-3 bg-brand-cream/40 border border-brand-cerulean/15 flex justify-between items-center">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- GRADUATION AUDIT SKELETON ---
export const GraduationAuditSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Overall Audit Verdict Card */}
            <div className="bg-white border-editorial p-6 shadow-editorial space-y-3">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                </div>
                <SkeletonText lines={2} />
            </div>

            {/* 4 Condition Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-brand-cerulean/10">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <SkeletonText lines={2} />
                        <div className="pt-2 flex justify-between items-center border-t border-brand-cerulean/10">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- PORTFOLIO EXPORT SKELETON ---
export const PortfolioExportSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>

            {/* 2-Column: Configuration & Document Preview Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left col: Export Settings */}
                <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <Skeleton className="h-6 w-36" />
                    <div className="space-y-3 pt-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-brand-cerulean/10">
                                <Skeleton className="w-4 h-4 rounded-xs" />
                                <Skeleton className="h-4 flex-1" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                </div>

                {/* Right 2 cols: Paper Mockup Preview */}
                <div className="lg:col-span-2 bg-white border-editorial p-10 shadow-editorial space-y-6">
                    <div className="text-center space-y-2 pb-6 border-b border-brand-cerulean/20">
                        <Skeleton className="h-4 w-48 mx-auto" />
                        <Skeleton className="h-8 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-36 mx-auto" />
                    </div>
                    <SkeletonText lines={6} />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PROFILE SKELETON ---
export const ProfileSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-brand-cerulean/20">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-60" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>

            {/* Top Identity Hero Card */}
            <div className="bg-white border-editorial p-6 shadow-editorial flex flex-col sm:flex-row items-center gap-6">
                <Skeleton variant="circle" className="w-24 h-24 shrink-0" />
                <div className="space-y-2 flex-1 text-center sm:text-left">
                    <Skeleton className="h-7 w-56 mx-auto sm:mx-0" />
                    <Skeleton className="h-4 w-40 mx-auto sm:mx-0" />
                    <div className="flex gap-2 justify-center sm:justify-start pt-1">
                        <Skeleton className="h-5 w-28 rounded-full" />
                        <Skeleton className="h-5 w-32 rounded-full" />
                    </div>
                </div>
            </div>

            {/* 2-Column Details: Info form & Credentials */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <Skeleton className="h-6 w-44" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="space-y-1.5">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-9 w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border-editorial p-6 shadow-editorial space-y-4">
                    <Skeleton className="h-6 w-36" />
                    <div className="h-48 border border-brand-cerulean/20 p-4 flex flex-col justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-44 mx-auto" />
                        <Skeleton className="h-3 w-28 ml-auto" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                </div>
            </div>
        </div>
    );
};

// --- UNIFIED VIEW SKELETON DISPATCHER ---
export const ViewSkeleton = ({ currentView = 'dashboard' }) => {
    switch (currentView) {
        case 'calendar':
            return <CalendarSkeleton />;
        case 'resources':
            return <ResourcesSkeleton />;
        case 'programs':
        case 'program_detail':
            return <ProgramsSkeleton />;
        case 'module_detail':
            return <ModuleDetailSkeleton />;
        case 'syllabus':
            return <SyllabusSkeleton />;
        case 'gradebook':
            return <GradebookSkeleton />;
        case 'practicum':
            return <PracticumSkeleton />;
        case 'lesson_plans':
            return <LessonPlansSkeleton />;
        case 'competencies':
            return <CompetenciesSkeleton />;
        case 'graduation':
            return <GraduationAuditSkeleton />;
        case 'portfolio_export':
            return <PortfolioExportSkeleton />;
        case 'profile':
            return <ProfileSkeleton />;
        case 'dashboard':
        default:
            return <DashboardSkeleton />;
    }
};

// --- FULL APPLICATION LAYOUT SKELETON ---
// (Mirrors App.jsx layout with stationary sidebar + header + main content)
export const AppLayoutSkeleton = ({ currentView = 'dashboard' }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-brand-cream select-none">
            {/* SIDEBAR SKELETON */}
            <aside className="w-72 bg-brand-cream border-r border-brand-cerulean/20 h-full p-5 md:p-6 flex flex-col justify-between shrink-0 shadow-sm">
                {/* Logo & Brand Title */}
                <div>
                    <div className="mb-6 flex items-center gap-3">
                        <Skeleton variant="circle" className="w-12 h-12 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-3 w-36" />
                        </div>
                    </div>

                    {/* Nav link skeletons */}
                    <div className="space-y-2 pt-2">
                        {/* Dashboard Link */}
                        <div className="flex items-center gap-3 py-2 px-2 border-b border-brand-cerulean/10">
                            <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
                            <Skeleton className="h-4 w-28" />
                        </div>

                        {/* Section 1 Header */}
                        <div className="pt-3 pb-1">
                            <Skeleton className="h-3 w-20" />
                        </div>

                        {/* 5 Course suite links */}
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-3 py-2 px-2 border-b border-brand-cerulean/10">
                                <Skeleton variant="circle" className="w-4 h-4 shrink-0" />
                                <Skeleton className="h-3.5 w-32" />
                            </div>
                        ))}

                        {/* Section 2 Header */}
                        <div className="pt-3 pb-1">
                            <Skeleton className="h-3 w-28" />
                        </div>

                        {/* 4 Pedagogical suite links */}
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3 py-2 px-2 border-b border-brand-cerulean/10">
                                <Skeleton variant="circle" className="w-4 h-4 shrink-0" />
                                <Skeleton className="h-3.5 w-36" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom User Profile Skeleton */}
                <div className="pt-4 border-t border-brand-cerulean/15 flex items-center gap-3">
                    <Skeleton variant="circle" className="w-9 h-9 shrink-0" />
                    <div className="space-y-1 flex-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-2.5 w-16" />
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT SKELETON */}
            <main className="flex-1 h-full overflow-y-auto p-6 md:p-12">
                <ViewSkeleton currentView={currentView} />
            </main>
        </div>
    );
};

