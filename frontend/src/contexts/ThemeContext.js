import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#303030',
            paper: '#424242',
        },
    },
});

export const ThemeProvider = ({ children }) => {
    const storedTheme = localStorage.getItem("theme") || "light";
    const [currentTheme, setCurrentTheme] = useState(storedTheme);

    const toggleTheme = () => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setCurrentTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const theme = currentTheme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};