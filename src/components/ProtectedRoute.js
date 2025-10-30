'use client'

import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading, requireAuth } = useAuth()

    useEffect(() => {
        if (!isLoading) {
            requireAuth()
        }
    }, [isLoading, requireAuth])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-theme-primary flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-theme-primary">Loading...</span>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null // requireAuth will handle redirect
    }

    return children
}