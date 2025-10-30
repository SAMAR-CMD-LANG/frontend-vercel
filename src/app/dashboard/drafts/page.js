'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../../components/DashboardLayout'
import Icons from '../../../components/Icons'
import { useAuth } from '../../../contexts/AuthContext'
import { notesAPI } from '../../../lib/api'

export default function DraftsPage() {
    const [drafts, setDrafts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { requireAuth } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!requireAuth()) return
        fetchDrafts()
    }, [searchQuery, currentPage, requireAuth])

    const fetchDrafts = async () => {
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search: searchQuery,
                visibility: 'all',
                sortBy: 'updated_at',
                sortOrder: 'desc'
            }

            const { data } = await notesAPI.getNotes(params)
            // Filter only drafts on the client side
            const draftNotes = data.notes.filter(note => note.is_draft)
            setDrafts(draftNotes)
            setTotalPages(Math.ceil(draftNotes.length / 10))
        } catch (error) {
            console.error('Fetch drafts error:', error)
            toast.error('Failed to fetch drafts')
        } finally {
            setIsLoading(false)
        }
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

    const headerActions = (
        <div className="flex items-center gap-3">
            {/* Search */}
            <div className="search-container">
                <Icons.Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search drafts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            <a href="/dashboard/notes/new" className="btn btn-primary">
                <Icons.Plus size={18} />
                New Draft
            </a>
        </div>
    )

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <span className="text-primary">Loading drafts...</span>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout
            activeSection="drafts"
            title="Draft Notes"
            subtitle="Unfinished notes and work in progress"
            headerActions={headerActions}
        >
            {drafts.length === 0 ? (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="empty-state-icon">
                        <Icons.Drafts size={40} className="text-muted" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-3">No drafts yet</h2>
                    <p className="text-secondary mb-8 max-w-md mx-auto">
                        Start writing and save as draft to see them here
                    </p>
                    <a href="/dashboard/notes/new" className="btn btn-primary btn-lg">
                        <Icons.Plus size={20} />
                        Create Your First Draft
                    </a>
                </motion.div>
            ) : (
                <>
                    {/* Drafts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {drafts.map((draft, index) => (
                            <motion.div
                                key={draft.id}
                                className="draft-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                onClick={() => router.push(`/dashboard/notes/${draft.id}`)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="draft-title">
                                        {draft.title || 'Untitled Draft'}
                                    </h3>
                                    <span className="draft-badge">
                                        Draft
                                    </span>
                                </div>

                                <p className="draft-content">
                                    {truncateContent(draft.content || draft.body)}
                                </p>

                                <div className="draft-footer">
                                    <span className="font-medium">Last edited {formatDate(draft.updated_at)}</span>
                                    <Icons.ChevronRight size={14} className="draft-arrow" />
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
        </DashboardLayout>
    )
}