'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../../../components/DashboardLayout'
import Icons from '../../../../components/Icons'
import { useAuth } from '../../../../contexts/AuthContext'
import { notesAPI } from '../../../../lib/api'

export default function CreateNotePage() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        priority: 'medium',
        is_public: false,
        is_draft: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const { requireAuth } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!requireAuth()) return
    }, [requireAuth])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title.trim()) {
            toast.error('Please enter a title for your note')
            return
        }

        if (!formData.content.trim()) {
            toast.error('Please enter some content for your note')
            return
        }

        setIsLoading(true)

        try {
            const noteData = {
                ...formData,
                isDraft: formData.is_draft,
                isPublic: formData.is_public
            }
            const { data } = await notesAPI.createNote(noteData)
            toast.success('Note created successfully!')
            router.push(`/dashboard/notes/${data.id}`)
        } catch (error) {
            console.error('Create note error:', error)
            toast.error(error.response?.data?.message || 'Failed to create note')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveDraft = async () => {
        if (!formData.title.trim() && !formData.content.trim()) {
            toast.error('Please enter a title or content to save as draft')
            return
        }

        setIsSaving(true)

        try {
            const draftData = {
                ...formData,
                isDraft: true,
                isPublic: formData.is_public
            }
            const { data } = await notesAPI.createNote(draftData)
            toast.success('Draft saved successfully!')
            router.push('/dashboard/drafts')
        } catch (error) {
            console.error('Save draft error:', error)
            toast.error(error.response?.data?.message || 'Failed to save draft')
        } finally {
            setIsSaving(false)
        }
    }

    const headerActions = (
        <div className="create-note-actions">
            <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving || isLoading}
                className="btn btn-secondary btn-sm"
            >
                {isSaving ? (
                    <>
                        <div className="loading-spinner-sm"></div>
                        Saving...
                    </>
                ) : (
                    <>
                        <Icons.Drafts size={16} />
                        Save Draft
                    </>
                )}
            </button>
            <button
                type="submit"
                form="create-note-form"
                disabled={isLoading || isSaving}
                className="btn btn-primary btn-sm"
            >
                {isLoading ? (
                    <>
                        <div className="loading-spinner-sm"></div>
                        Creating...
                    </>
                ) : (
                    <>
                        <Icons.Plus size={16} />
                        Create Note
                    </>
                )}
            </button>
        </div>
    )

    return (
        <DashboardLayout
            activeSection="notes"
            title="Create New Note"
            subtitle="Write and organize your thoughts securely"
            headerActions={headerActions}
        >
            <div className="create-note-container">
                <motion.div
                    className="create-note-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <form id="create-note-form" onSubmit={handleSubmit} className="create-note-form">
                        {/* Title Input */}
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                <Icons.Notes size={16} />
                                Note Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter your note title..."
                                className="form-input note-title-input"
                                disabled={isLoading || isSaving}
                                autoFocus
                            />
                        </div>

                        {/* Content Textarea */}
                        <div className="form-group">
                            <label htmlFor="content" className="form-label">
                                <Icons.Edit size={16} />
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Start writing your note..."
                                className="form-textarea note-content-input"
                                rows={12}
                                disabled={isLoading || isSaving}
                            />
                        </div>

                        {/* Note Options */}
                        <div className="note-options-grid">
                            {/* Category */}
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">
                                    <Icons.Labels size={16} />
                                    Category
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g., Work, Personal, Ideas..."
                                    className="form-input"
                                    disabled={isLoading || isSaving}
                                />
                            </div>

                            {/* Priority */}
                            <div className="form-group">
                                <label htmlFor="priority" className="form-label">
                                    <Icons.Priority size={16} />
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="form-select"
                                    disabled={isLoading || isSaving}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="note-checkboxes">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="is_public"
                                    checked={formData.is_public}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                    disabled={isLoading || isSaving}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-text">
                                    <Icons.Globe size={16} />
                                    Make this note public
                                </span>
                            </label>
                        </div>
                    </form>
                </motion.div>

                {/* Tips Card */}
                <motion.div
                    className="create-note-tips"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="tips-header">
                        <Icons.Lightbulb size={20} />
                        <h3>Writing Tips</h3>
                    </div>
                    <ul className="tips-list">
                        <li>Use descriptive titles to find notes easily</li>
                        <li>Add categories to organize your thoughts</li>
                        <li>Set priority levels for important notes</li>
                        <li>Save as draft if you're not ready to publish</li>
                        <li>Use markdown for rich formatting</li>
                    </ul>
                </motion.div>
            </div>
        </DashboardLayout>
    )
}