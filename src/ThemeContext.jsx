import React, { createContext, useState, useContext } from 'react';

// ThemeContextni yaratish
const ThemeContext = createContext();

// ThemeProvider komponenti, ushbu komponentni App.jsx da o'rnatamiz
export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(localStorage.getItem("mode") || true);

    const toggleTheme = () => {

        setIsDark(prev => !prev);
        localStorage.setItem("mode", isDark)
        document.body.classList.toggle("dark bg-gray-900")

    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// ThemeContextni qo'llash uchun hook
export const useTheme = () => useContext(ThemeContext);
