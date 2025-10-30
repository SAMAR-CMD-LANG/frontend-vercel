'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Icons from '../../components/Icons'
import ThemeToggle from '../../components/ThemeToggle'
import TokenHandler from '../../components/TokenHandler'
import { useAuth } from '../../contexts/AuthContext'
import { notesAPI } from '../../lib/api'

export default function DashboardPage() {
    const [notes, setNotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('updated_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, isAuthenticated, requireAuth, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!requireAuth()) return
        fetchNotes()
    }, [searchQuery, sortBy, sortOrder, currentPage, isAuthenticated])

    const fetchNotes = async () => {
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search: searchQuery,
                sortBy,
                sortOrder
            }

            const { data } = await notesAPI.getNotes(params)
            setNotes(data.notes)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error('Fetch notes error:', error)
            toast.error('Failed to fetch notes')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        await logout()
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const truncateContent = (content, maxLength = 150) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + '...'
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <span className="text-primary">Loading your notes...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <TokenHandler />
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed z-40 lg:hidden"
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Professional Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-72 sidebar-blur z-50 transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6 h-full flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <Icons.Logo size={32} className="text-accent" />
                        <span className="text-2xl font-bold text-primary">Note.io</span>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 flex-1">
                        <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                            <Icons.Notes size={20} />
                            All Notes
                        </a>
                        <a href="/dashboard/drafts" className="nav-link">
                            <Icons.Drafts size={20} />
                            Drafts
                        </a>
                        <a href="/dashboard/labels" className="nav-link">
                            <Icons.Labels size={20} />
                            Labels
                        </a>
                        <a href="/dashboard/profile" className="nav-link">
                            <Icons.Profile size={20} />
                            Profile
                        </a>
                    </nav>

                    {/* User Profile */}
                    <div className="mt-auto">
                        <div className="user-profile-card">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="user-avatar">
                                    <span className="user-avatar-text">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-primary text-sm font-semibold truncate">{user?.name}</p>
                                    <p className="text-muted text-xs truncate">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-ghost w-full justify-start text-sm"
                            >
                                <Icons.ChevronRight size={16} className="rotate-180" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-72">
                {/* Professional Header */}
                <header className="nav-blur px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden btn btn-ghost"
                                style={{ padding: '0.5rem' }}
                            >
                                <Icons.Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-primary">My Notes</h1>
                                <p className="text-muted text-sm">Manage your secure notes</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />

                            {/* Search */}
                            <div className="search-container">
                                <Icons.Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-')
                                    setSortBy(field)
                                    setSortOrder(order)
                                }}
                                className="form-input w-auto min-w-[160px]"
                            >
                                <option value="updated_at-desc">Recently Updated</option>
                                <option value="created_at-desc">Recently Created</option>
                                <option value="title-asc">Title A-Z</option>
                                <option value="title-desc">Title Z-A</option>
                            </select>

                            {/* New Note Button */}
                            <a href="/dashboard/notes/new" className="btn btn-primary">
                                <Icons.Plus size={18} />
                                New Note
                            </a>
                        </div>
                    </div>
                </header>

                {/* Notes Content */}
                <main className="p-6">
                    {notes.length === 0 ? (
                        <motion.div
                            className="text-center py-20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="empty-state-icon">
                                <Icons.Notes size={40} className="text-muted" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-3">No notes yet</h2>
                            <p className="text-secondary mb-8 max-w-md mx-auto">
                                Create your first note to get started with your secure note-taking journey
                            </p>
                            <a href="/dashboard/notes/new" className="btn btn-primary btn-lg">
                                <Icons.Plus size={20} />
                                Create Your First Note
                            </a>
                        </motion.div>
                    ) : (
                        <>
                            {/* Notes Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {notes.map((note, index) => (
                                    <motion.div
                                        key={note.id}
                                        className="card hover:border-blue-500/30 cursor-pointer group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => router.push(`/dashboard/notes/${note.id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="note-title">
                                                {note.title}
                                            </h3>
                                            <div className="flex items-center gap-2 ml-2">
                                                {note.is_draft && (
                                                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">
                                                        Draft
                                                    </span>
                                                )}
                                                {note.is_public && (
                                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">
                                                        Public
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="note-content">
                                            {truncateContent(note.content)}
                                        </p>

                                        <div className="note-footer">
                                            <span className="font-medium">{formatDate(note.updated_at)}</span>
                                            <Icons.ChevronRight size={14} className="group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Professional Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-12">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <Icons.ChevronRight size={16} className="rotate-180" />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1 mx-4">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page = i + 1
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                                        ? 'pagination-button-active'
                                                        : 'pagination-button'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Next
                                        <Icons.ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}