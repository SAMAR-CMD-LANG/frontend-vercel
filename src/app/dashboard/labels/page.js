'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Icons from '../../../components/Icons'

export default function LabelsPage() {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [features, setFeatures] = useState(null)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
        checkFeatures()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/auth/me`, {
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
        }
    }

    const checkFeatures = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/features`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setFeatures(data)
            }
        } catch (error) {
            console.error('Features check error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <Icons.Logo size={28} className="text-blue-500" />
                        <span className="text-xl font-bold text-white">Note.io</span>
                    </div>

                    <nav className="space-y-2">
                        <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                            <Icons.Notes size={20} />
                            All Notes
                        </a>
                        <a href="/dashboard/drafts" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                            <Icons.Drafts size={20} />
                            Drafts
                        </a>
                        <a href="/dashboard/labels" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            <Icons.Labels size={20} />
                            Labels
                        </a>
                        <a href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                            <Icons.Profile size={20} />
                            Profile
                        </a>
                    </nav>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">{user?.name}</p>
                                <p className="text-gray-400 text-xs">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-ghost w-full justify-start"
                    >
                        <Icons.ChevronRight size={16} className="rotate-180" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden btn btn-ghost p-2"
                            >
                                <Icons.Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Labels & Categories</h1>
                                <p className="text-gray-400 text-sm">Organize your notes with tags and categories</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6">
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="max-w-2xl mx-auto">
                            <Icons.Labels size={64} className="text-gray-600 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-4">Labels & Categories</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                This feature allows you to organize your notes with custom labels and categories.
                                You'll be able to create color-coded tags, filter notes by categories, and
                                maintain a well-organized note collection.
                            </p>

                            {features && (
                                <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-4">Feature Status</h3>
                                    <div className="space-y-3 text-left">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">Labels System</span>
                                            <span className="text-yellow-400 text-sm">Coming Soon</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">Categories</span>
                                            <span className="text-yellow-400 text-sm">Coming Soon</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">Color Coding</span>
                                            <span className="text-yellow-400 text-sm">Coming Soon</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">Advanced Filtering</span>
                                            <span className="text-yellow-400 text-sm">Coming Soon</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <Icons.Shield size={24} className="text-blue-400 mt-1" />
                                    <div className="text-left">
                                        <h4 className="text-white font-semibold mb-2">Database Update Required</h4>
                                        <p className="text-gray-300 text-sm mb-4">
                                            To enable labels and categories, run the database update script:
                                        </p>
                                        <code className="bg-gray-900 text-green-400 px-3 py-2 rounded text-sm block">
                                            simple-database-updates.sql
                                        </code>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <a href="/dashboard" className="btn btn-primary">
                                    <Icons.ChevronRight size={16} className="rotate-180" />
                                    Back to Notes
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    )
}