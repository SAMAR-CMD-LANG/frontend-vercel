'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { authAPI } from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    // Check authentication status on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const { data } = await authAPI.me()
            if (data.user) {
                setUser(data.user)
                setIsAuthenticated(true)
            } else {
                setUser(null)
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (credentials) => {
        try {
            setIsLoading(true)
            const { data } = await authAPI.login(credentials)

            setUser(data.user)
            setIsAuthenticated(true)
            toast.success('Welcome back!')

            return { success: true, user: data.user }
        } catch (error) {
            const message = error.message || 'Login failed'
            toast.error(message)
            return { success: false, error: message }
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData) => {
        try {
            setIsLoading(true)
            const { data } = await authAPI.register(userData)

            toast.success('Account created successfully!')
            return { success: true, user: data.user }
        } catch (error) {
            const message = error.message || 'Registration failed'
            toast.error(message)
            return { success: false, error: message }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
            setUser(null)
            setIsAuthenticated(false)
            toast.success('Logged out successfully')
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
            // Even if logout fails on server, clear local state
            setUser(null)
            setIsAuthenticated(false)
            router.push('/')
        }
    }

    const forgotPassword = async (email) => {
        try {
            const { data } = await authAPI.forgotPassword(email)
            toast.success('Password reset email sent!')
            return { success: true, message: data.message }
        } catch (error) {
            const message = error.message || 'Failed to send reset email'
            toast.error(message)
            return { success: false, error: message }
        }
    }

    const resetPassword = async (token, newPassword) => {
        try {
            const { data } = await authAPI.resetPassword(token, newPassword)
            toast.success('Password reset successfully!')
            return { success: true, message: data.message }
        } catch (error) {
            const message = error.message || 'Password reset failed'
            toast.error(message)
            return { success: false, error: message }
        }
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser)
    }

    // Redirect to login if not authenticated (for protected routes)
    const requireAuth = () => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
            return false
        }
        return true
    }

    // Redirect to dashboard if already authenticated (for auth pages)
    const redirectIfAuthenticated = () => {
        if (!isLoading && isAuthenticated) {
            router.push('/dashboard')
            return true
        }
        return false
    }

    const value = {
        // State
        user,
        isLoading,
        isAuthenticated,

        // Actions
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUser,
        checkAuth,

        // Utilities
        requireAuth,
        redirectIfAuthenticated,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}