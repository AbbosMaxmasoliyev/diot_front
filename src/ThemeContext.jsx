import React, { createContext, useState, useContext } from 'react';

// ThemeContextni yaratish
const ThemeContext = createContext();

// ThemeProvider komponenti, ushbu komponentni App.jsx da o'rnatamiz
export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// ThemeContextni qo'llash uchun hook
export const useTheme = () => useContext(ThemeContext);
