'use client'

import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import Icons from './Icons'

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme, isLoading } = useTheme()

    if (isLoading) {
        return (
            <div className={`theme-toggle-loading ${className}`} />
        )
    }

    return (
        <motion.button
            onClick={toggleTheme}
            className={`theme-toggle-button ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : 180,
                    scale: theme === 'dark' ? 1 : 0.8,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="theme-toggle-icon"
            >
                {theme === 'dark' ? (
                    <Icons.Moon size={20} className="theme-icon" />
                ) : (
                    <Icons.Sun size={20} className="theme-icon theme-icon-sun" />
                )}
            </motion.div>

            {/* Background animation */}
            <motion.div
                className="theme-toggle-background"
                animate={{
                    background: theme === 'dark'
                        ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)'
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    )
}