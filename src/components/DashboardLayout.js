'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardSidebar from './DashboardSidebar'
import Icons from './Icons'

export default function DashboardLayout({
    children,
    activeSection = 'notes',
    title = 'Dashboard',
    subtitle = null,
    headerActions = null
}) {
    const [user, setUser] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const { getApiBaseUrl } = await import('../lib/api')
            const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            } else {
                router.push('/login')
            }
        } catch (error) {
            console.error('Auth check error:', error)
            router.push('/login')
        } finally {
            setIsLoading(false)
        }
    }

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

    return (
        <div className="min-h-screen bg-theme-primary">
            <DashboardSidebar
                user={user}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeSection={activeSection}
            />

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-theme-secondary/80 backdrop-blur-md border-b border-theme-primary px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden btn btn-ghost p-2"
                            >
                                <Icons.Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-theme-primary">{title}</h1>
                                {subtitle && (
                                    <p className="text-theme-secondary text-sm">{subtitle}</p>
                                )}
                            </div>
                        </div>

                        {headerActions && (
                            <div className="flex items-center gap-4">
                                {headerActions}
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}