'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Icons from '../../components/Icons'
import ThemeToggle from '../../components/ThemeToggle'
import TokenHandler from '../../components/TokenHandler'
import DebugOverlay from '../../components/DebugOverlay'
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
    const { user, isAuthenticated, isLoading: authLoading, requireAuth, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Only fetch if authenticated - let AuthContext handle redirects
        if (isAuthenticated) {
            fetchNotes()
        }
    }, [searchQuery, sortBy, sortOrder, currentPage, isAuthenticated])

    const fetchNotes = async () => {
        try {
            console.log('Dashboard: Starting to fetch notes...')
            console.log('Dashboard: User authenticated:', isAuthenticated)
            console.log('Dashboard: User data:', user)

            const params = {
                page: currentPage,
                limit: 10,
                search: searchQuery,
                sortBy,
                sortOrder
            }

            console.log('Dashboard: Fetching notes with params:', params)
            const { data } = await notesAPI.getNotes(params)
            console.log('Dashboard: Notes fetched successfully:', data)

            setNotes(data.notes)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error('Dashboard: Fetch notes error:', error)
            toast.error(`Failed to fetch notes: ${error.message}`)
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

    const truncateContent = (content, maxLength) => {
        // Default maxLength based on screen size
        if (!maxLength) {
            maxLength = typeof window !== 'undefined' && window.innerWidth < 640 ? 80 : 150
        }
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + '...'
    }

    if (authLoading || isLoading) {
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
            <DebugOverlay />
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
            <div className={`fixed left-0 top-0 h-full w-64 sm:w-72 sidebar-blur z-50 transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-4 sm:p-6 h-full flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                        <Icons.Logo size={28} className="text-accent sm:w-8 sm:h-8" />
                        <span className="text-xl sm:text-2xl font-bold text-primary">Note.io</span>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 sm:space-y-2 flex-1">
                        <a href="/dashboard" className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium text-sm sm:text-base">
                            <Icons.Notes size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                            All Notes
                        </a>
                        <a href="/dashboard/drafts" className="nav-link flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                            <Icons.Drafts size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                            Drafts
                        </a>
                        <a href="/dashboard/labels" className="nav-link flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                            <Icons.Labels size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                            Labels
                        </a>
                        <a href="/dashboard/profile" className="nav-link flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                            <Icons.Profile size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                            Profile
                        </a>
                    </nav>

                    {/* User Profile */}
                    <div className="mt-auto">
                        <div className="user-profile-card p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="user-avatar w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                                    <span className="user-avatar-text text-sm sm:text-base">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-primary text-xs sm:text-sm font-semibold truncate">{user?.name}</p>
                                    <p className="text-muted text-xs truncate">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-ghost w-full justify-start text-xs sm:text-sm py-1.5 sm:py-2"
                            >
                                <Icons.ChevronRight size={14} className="rotate-180 sm:w-4 sm:h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 xl:ml-72">
                {/* Professional Header - Fixed Responsive Layout */}
                <header className="nav-blur px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-30">
                    {/* Main Header Row - Always Visible */}
                    <div className="flex items-center gap-3">
                        {/* Left Section */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Hamburger Menu - Always visible below lg */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden btn btn-ghost p-2 flex-shrink-0"
                            >
                                <Icons.Menu size={20} />
                            </button>

                            {/* Title Section - Never hidden */}
                            <div className="min-w-0">
                                <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-primary">My Notes</h1>
                                <p className="text-muted text-xs hidden sm:block">Manage your secure notes</p>
                            </div>
                        </div>

                        {/* Right Section - Essential Controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <ThemeToggle />

                            {/* New Note Button - Always visible */}
                            <a href="/dashboard/notes/new" className="btn btn-primary text-xs sm:text-sm px-3 py-2">
                                <Icons.Plus size={16} />
                                <span className="ml-1">New</span>
                            </a>
                        </div>
                    </div>

                    {/* Second Row - Search and Sort */}
                    <div className="flex items-center gap-3 mt-3">
                        {/* Search Bar - Full width on mobile */}
                        <div className="search-container flex-1">
                            <Icons.Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Sort Dropdown - Compact */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-')
                                setSortBy(field)
                                setSortOrder(order)
                            }}
                            className="form-input w-auto min-w-[90px] sm:min-w-[120px] text-xs sm:text-sm flex-shrink-0"
                        >
                            <option value="updated_at-desc">Recent</option>
                            <option value="created_at-desc">Created</option>
                            <option value="title-asc">A-Z</option>
                            <option value="title-desc">Z-A</option>
                        </select>
                    </div>
                </header>

                {/* Notes Content */}
                <main className="p-3 sm:p-4 lg:p-6">
                    {notes.length === 0 ? (
                        <motion.div
                            className="text-center py-12 sm:py-16 lg:py-20 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="empty-state-icon">
                                <Icons.Notes size={32} className="text-muted sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3">No notes yet</h2>
                            <p className="text-secondary mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto text-sm sm:text-base">
                                Create your first note to get started with your secure note-taking journey
                            </p>
                            <a href="/dashboard/notes/new" className="btn btn-primary btn-lg">
                                <Icons.Plus size={18} className="sm:w-5 sm:h-5" />
                                Create Your First Note
                            </a>
                        </motion.div>
                    ) : (
                        <>
                            {/* Notes Grid - Responsive */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                {notes.map((note, index) => (
                                    <motion.div
                                        key={note.id}
                                        className="card hover:border-blue-500/30 cursor-pointer group p-3 sm:p-4 lg:p-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => router.push(`/dashboard/notes/${note.id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                                            <h3 className="note-title text-sm sm:text-base lg:text-lg font-semibold text-primary line-clamp-2 flex-1 mr-2">
                                                {note.title}
                                            </h3>
                                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                                {note.is_draft && (
                                                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                                                        Draft
                                                    </span>
                                                )}
                                                {note.is_public && (
                                                    <span className="text-xs bg-green-500/20 text-green-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                                                        Public
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="note-content text-xs sm:text-sm text-secondary line-clamp-3 sm:line-clamp-4 mb-3 sm:mb-4">
                                            {truncateContent(note.content)}
                                        </p>

                                        <div className="note-footer flex items-center justify-between text-xs sm:text-sm">
                                            <span className="font-medium text-muted truncate">{formatDate(note.updated_at)}</span>
                                            <Icons.ChevronRight size={12} className="group-hover:text-blue-400 transition-colors flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Professional Pagination - Responsive */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 px-4">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="btn btn-secondary btn-sm text-xs sm:text-sm px-2 sm:px-3"
                                    >
                                        <Icons.ChevronRight size={14} className="rotate-180 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Previous</span>
                                        <span className="sm:hidden">Prev</span>
                                    </button>

                                    <div className="flex items-center gap-1 mx-2 sm:mx-4">
                                        {/* Show fewer pages on mobile */}
                                        <div className="flex items-center gap-1 sm:hidden">
                                            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                                const page = i + 1
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-6 h-6 rounded-lg text-xs font-medium transition-all ${currentPage === page
                                                            ? 'pagination-button-active'
                                                            : 'pagination-button'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {/* Show more pages on desktop */}
                                        <div className="hidden sm:flex items-center gap-1">
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
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-secondary btn-sm text-xs sm:text-sm px-2 sm:px-3"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <span className="sm:hidden">Next</span>
                                        <Icons.ChevronRight size={14} className="sm:w-4 sm:h-4" />
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