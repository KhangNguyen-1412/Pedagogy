import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useScroll } from '../../context/ScrollContext';

/**
 * CollapsiblePageHeader
 * 
 * Reusable unified sticky page header for all views.
 * When scrolled down:
 *  - Title smoothly shrinks to a standardized uniform size (`text-base sm:text-lg font-serif-title font-bold text-brand-cerulean`) across ALL pages.
 *  - Subtitle smoothly fades out and collapses using CSS Grid 1fr -> 0fr interpolation with zero dead-zone.
 *  - Header padding contracts smoothly to a compact height (`py-2 sm:py-2.5 md:py-3`).
 *  - Action buttons/indicators smoothly align in a stable compact layout with Apple-standard fluid deceleration bezier.
 */
export const CollapsiblePageHeader = ({
    title,
    subtitle,
    badge,
    backButton,
    actions,
    children,
    className = '',
    contentClassName = '',
    headerRef: externalRef
}) => {
    const scrollContext = useScroll();
    const [localScrolled, setLocalScrolled] = useState(false);
    const localScrolledRef = useRef(false);
    const internalRef = useRef(null);
    const headerRef = externalRef || internalRef;

    // Fallback scroll listener in case component is mounted without ScrollProvider
    useEffect(() => {
        if (scrollContext && scrollContext.isScrolled !== undefined) {
            return;
        }

        const handleScrollFallback = () => {
            const scrollContainer = headerRef.current?.closest('main') || window;
            const top = scrollContainer === window
                ? window.scrollY
                : (scrollContainer?.scrollTop || 0);
            
            const nextScrolled = localScrolledRef.current ? top > 12 : top > 35;
            if (nextScrolled !== localScrolledRef.current) {
                localScrolledRef.current = nextScrolled;
                setLocalScrolled(nextScrolled);
            }
        };

        const target = headerRef.current?.closest('main') || window;
        target.addEventListener('scroll', handleScrollFallback, { passive: true });
        handleScrollFallback();

        return () => {
            target.removeEventListener('scroll', handleScrollFallback);
        };
    }, [scrollContext]);

    const isScrolled = scrollContext?.isScrolled !== undefined
        ? scrollContext.isScrolled
        : localScrolled;

    return (
        <header
            ref={headerRef}
            className={`sticky -top-3.5 sm:-top-4 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md border-b-2 border-brand-cerulean will-change-[padding,box-shadow] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -mt-3.5 sm:-mt-4 md:-mt-12 ${
                isScrolled
                    ? 'pt-2 sm:pt-2.5 md:pt-3 pb-2 sm:pb-2.5 md:pb-3 shadow-xs mb-4 sm:mb-6 md:mb-8'
                    : 'pt-3 sm:pt-4 md:pt-7 pb-2.5 sm:pb-3.5 md:pb-4 mb-4 sm:mb-6 md:mb-8'
            } ${className}`}
        >
            <div className={`max-w-6xl mx-auto w-full ${contentClassName}`}>
                {/* Optional Back Navigation Button */}
                {backButton && (
                    <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'mb-1' : 'mb-2'}`}>
                        {typeof backButton === 'function' ? (
                            backButton({ isScrolled })
                        ) : backButton.onClick ? (
                            <button
                                type="button"
                                onClick={backButton.onClick}
                                className="flex items-center gap-1.5 text-brand-cerulean hover:text-brand-jasper font-serif-title text-xs sm:text-sm font-bold transition-colors"
                            >
                                <ArrowLeft size={16} />
                                <span>{backButton.label || 'Quay lại'}</span>
                            </button>
                        ) : (
                            backButton
                        )}
                    </div>
                )}

                {/* Pre-title Badge Row (CSS Grid collapse with 0 dead-zone) */}
                {badge && (
                    <div
                        className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled
                                ? 'grid-rows-[0fr] opacity-0 -translate-y-1 pointer-events-none mb-0'
                                : 'grid-rows-[1fr] opacity-100 translate-y-0 mb-1 sm:mb-2'
                        }`}
                    >
                        <div className="overflow-hidden">
                            {badge}
                        </div>
                    </div>
                )}

                {/* Primary Row: Title & Action Items (Full width on mobile when expanded, compact row when scrolled) */}
                <div
                    className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isScrolled
                            ? 'flex flex-row items-center justify-between gap-3'
                            : 'flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6'
                    }`}
                >
                    <div className={isScrolled ? 'flex-1 min-w-0' : 'w-full md:flex-1 md:min-w-0'}>
                        {/* UNIFIED SHRINKABLE TITLE: Full width & readable when expanded, standardized shrunk size when scrolled */}
                        <h1
                            className={`font-serif-title font-bold text-brand-cerulean leading-tight tracking-tight origin-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                isScrolled
                                    ? 'text-base sm:text-lg truncate tracking-normal'
                                    : 'text-2xl sm:text-3xl md:text-4xl break-words'
                            }`}
                        >
                            {title}
                        </h1>

                        {/* Subtitle / Description (CSS Grid 1fr -> 0fr for mathematically smooth collapse) */}
                        {subtitle && (
                            <div
                                className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                    isScrolled
                                        ? 'grid-rows-[0fr] opacity-0 -translate-y-1 pointer-events-none mt-0'
                                        : 'grid-rows-[1fr] opacity-100 translate-y-0 mt-1 sm:mt-1.5'
                                }`}
                            >
                                <div className="overflow-hidden">
                                    {typeof subtitle === 'string' ? (
                                        <p className="text-xs sm:text-sm md:text-base text-gray-600 font-body leading-relaxed">
                                            {subtitle}
                                        </p>
                                    ) : (
                                        subtitle
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action buttons / metrics / filters */}
                    {actions && (
                        <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'shrink-0' : 'w-full md:w-auto shrink-0'
                        }`}>
                            {typeof actions === 'function' ? actions({ isScrolled }) : actions}
                        </div>
                    )}
                </div>

                {/* Optional additional sub-row content */}
                {children && (
                    <div
                        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isScrolled ? 'mt-1' : 'mt-2.5 sm:mt-3'
                        }`}
                    >
                        {typeof children === 'function' ? children({ isScrolled }) : children}
                    </div>
                )}
            </div>
        </header>
    );
};

export default CollapsiblePageHeader;
