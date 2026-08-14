import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

/**
 * EditorialSelect - Custom dropdown matching Pedagogy's Editorial Design System
 */
export const EditorialSelect = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Chọn...',
    className = '',
    size = 'md', // 'sm' | 'md'
    direction = 'auto',
    buttonClassName = '',
    portalZIndex = 9999
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, openUpward: false });
    const buttonRef = useRef(null);

    const selectedOption = options.find(opt => String(opt.value) === String(value));
    const displayLabel = selectedOption?.label || selectedOption?.name || value || placeholder;

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUp = direction === 'up' || (direction === 'auto' && spaceBelow < 240 && rect.top > 240);
            setCoords({
                top: rect.bottom + 4,
                bottom: window.innerHeight - rect.top + 4,
                left: Math.max(8, Math.min(rect.left, window.innerWidth - Math.max(rect.width, 220) - 8)),
                width: Math.max(rect.width, 180),
                openUpward: openUp
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target) &&
                !event.target.closest('.editorial-portal-dropdown')
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [isOpen]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (optValue, e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(optValue);
        setIsOpen(false);
    };

    const isSmall = size === 'sm';

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-xs font-serif-title text-brand-cerulean font-bold mb-1">
                    {label}
                </label>
            )}

            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`w-full flex items-center justify-between bg-white text-left transition-all group ${
                    isSmall
                        ? 'py-1 px-2.5 border border-brand-cerulean/30 hover:border-brand-cerulean text-xs font-serif-title rounded-sm'
                        : 'py-2 px-3 border border-brand-cerulean/30 hover:border-brand-jasper focus:border-brand-jasper text-sm font-body shadow-sm'
                } ${buttonClassName} ${isOpen ? 'ring-1 ring-brand-jasper border-brand-jasper' : ''}`}
            >
                <span className="truncate text-brand-ink pr-2 font-medium" title={typeof displayLabel === 'string' ? displayLabel : ''}>
                    {displayLabel}
                </span>
                <ChevronDown
                    size={isSmall ? 13 : 15}
                    className={`text-brand-cerulean shrink-0 transition-transform duration-200 group-hover:text-brand-jasper ${
                        isOpen ? 'rotate-180 text-brand-jasper' : ''
                    }`}
                />
            </button>

            {isOpen && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                        top: coords.openUpward ? 'auto' : `${coords.top}px`,
                        bottom: coords.openUpward ? `${coords.bottom}px` : 'auto',
                        zIndex: portalZIndex
                    }}
                    className="editorial-portal-dropdown bg-brand-cream border-editorial shadow-2xl max-h-60 overflow-y-auto animate-fade-in-down py-1"
                >
                    {options.map((opt) => {
                        const isSelected = String(value) === String(opt.value);
                        const labelText = opt.label || opt.name || opt.value;
                        return (
                            <div
                                key={opt.value}
                                onClick={(e) => handleSelectOption(opt.value, e)}
                                className={`px-3.5 py-2 text-xs font-body cursor-pointer flex items-center justify-between transition-colors ${
                                    isSelected
                                        ? 'bg-brand-cerulean text-brand-cream font-bold'
                                        : 'text-brand-ink hover:bg-brand-cerulean/10 hover:text-brand-jasper'
                                }`}
                            >
                                <span className="truncate pr-2">{labelText}</span>
                                {isSelected && (
                                    <Check size={14} className="shrink-0 text-brand-cream" />
                                )}
                            </div>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
};

export default EditorialSelect;
