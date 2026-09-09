import React, { createContext, useContext, useState, useEffect } from 'react';

export const ScrollContext = createContext({
    isScrolled: false,
    scrollY: 0
});

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children, isScrolled = false, scrollY = 0 }) => {
    return (
        <ScrollContext.Provider value={{ isScrolled: !!isScrolled, scrollY: scrollY || 0 }}>
            {children}
        </ScrollContext.Provider>
    );
};
