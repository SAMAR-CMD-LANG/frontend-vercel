'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('note-io-theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
        setTheme(initialTheme)
        applyTheme(initialTheme)
        setIsLoading(false)
    }, [])

    const applyTheme = (newTheme) => {
        const body = document.body

        if (newTheme === 'dark') {
            body.classList.remove('light')
            // Dark is default, no class needed
        } else {
            body.classList.add('light')
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        applyTheme(newTheme)
        localStorage.setItem('note-io-theme', newTheme)
    }

    const value = {
        theme,
        toggleTheme,
        isLoading,
        isDark: theme === 'dark',
        isLight: theme === 'light'
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}