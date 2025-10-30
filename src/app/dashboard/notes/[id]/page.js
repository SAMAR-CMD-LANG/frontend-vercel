'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Icons from '../../../../components/Icons'

export default function NotePage() {
    const [note, setNote] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isPublic: false,
        isDraft: false
    })
    const [autoSaveTimeout, setAutoSaveTimeout] = useState(null)

    const router = useRouter()
    const params = useParams()
    const noteId = params.id

    useEffect(() => {
        if (noteId && noteId !== 'new') {
            fetchNote()
        } else if (noteId === 'new') {
            setIsEditing(true)
            setIsLoading(false)
            setFormData({
                title: '',
                content: '',
                isPublic: false,
                isDraft: true
            })
        }
    }, [noteId])

    const fetchNote = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/notes/${noteId}`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setNote(data.note)
                setFormData({
                    title: data.note.title,
                    content: data.note.content,
                    isPublic: data.note.is_public,
                    isDraft: data.note.is_draft
                })
            } else {
                toast.error('Note not found')
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Fetch note error:', error)
            toast.error('Failed to load note')
            router.push('/dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === 'checkbox' ? checked : value

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }))

        // Auto-save after 2 seconds of inactivity
        if (note && (name === 'title' || name === 'content')) {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout)
            }

            const timeout = setTimeout(() => {
                autoSave()
            }, 2000)

            setAutoSaveTimeout(timeout)
        }
    }

    const autoSave = async () => {
        if (!note || !formData.title.trim() || !formData.content.trim()) return

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/notes/${note.id}/autosave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content
                }),
            })
        } catch (error) {
            console.error('Auto-save error:', error)
        }
    }

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Title and content are required')
            return
        }

        setIsSaving(true)

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'
            const url = noteId === 'new'
                ? `${baseUrl}/notes`
                : `${baseUrl}/notes/${noteId}`

            const method = noteId === 'new' ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(noteId === 'new' ? 'Note created!' : 'Note saved!')

                if (noteId === 'new') {
                    router.push(`/dashboard/notes/${data.note.id}`)
                } else {
                    setNote(data.note)
                    setIsEditing(false)
                }
            } else {
                toast.error(data.message || 'Failed to save note')
            }
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Network error. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!note) return

        if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/notes/${note.id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                toast.success('Note deleted')
                router.push('/dashboard')
            } else {
                toast.error('Failed to delete note')
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Network error')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white">Loading note...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="btn btn-ghost p-2"
                        >
                            <Icons.ChevronRight size={20} className="rotate-180" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-white">
                                {noteId === 'new' ? 'New Note' : (isEditing ? 'Edit Note' : note?.title)}
                            </h1>
                            {note && !isEditing && (
                                <p className="text-sm text-gray-400">
                                    Last updated {formatDate(note.updated_at)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {note && !isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-secondary"
                                >
                                    <Icons.Drafts size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-ghost text-red-400 hover:text-red-300"
                                >
                                    <Icons.Close size={16} />
                                    Delete
                                </button>
                            </>
                        )}

                        {isEditing && (
                            <>
                                <button
                                    onClick={() => {
                                        if (noteId === 'new') {
                                            router.push('/dashboard')
                                        } else {
                                            setIsEditing(false)
                                            setFormData({
                                                title: note.title,
                                                content: note.content,
                                                isPublic: note.is_public,
                                                isDraft: note.is_draft
                                            })
                                        }
                                    }}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="btn btn-primary"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Icons.Check size={16} />
                                            Save
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                {isEditing ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Title Input */}
                        <div>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Note title..."
                                className="w-full text-3xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none"
                                style={{ fontFamily: 'inherit' }}
                            />
                        </div>

                        {/* Content Input */}
                        <div>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="Start writing your note..."
                                className="w-full h-96 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 resize-none leading-relaxed"
                                style={{ fontFamily: 'inherit', fontSize: '1.1rem' }}
                            />
                        </div>

                        {/* Options */}
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-800">
                            <label className="flex items-center gap-2 text-gray-400">
                                <input
                                    type="checkbox"
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onChange={handleInputChange}
                                    className="rounded"
                                />
                                Make public
                            </label>

                            <label className="flex items-center gap-2 text-gray-400">
                                <input
                                    type="checkbox"
                                    name="isDraft"
                                    checked={formData.isDraft}
                                    onChange={handleInputChange}
                                    className="rounded"
                                />
                                Save as draft
                            </label>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Title */}
                        <div className="flex items-start justify-between">
                            <h1 className="text-4xl font-bold text-white leading-tight">
                                {note?.title}
                            </h1>
                            <div className="flex items-center gap-2">
                                {note?.is_draft && (
                                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                                        Draft
                                    </span>
                                )}
                                {note?.is_public && (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                        Public
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                                {note?.content}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    Created {formatDate(note?.created_at)}
                                </div>
                                <div>
                                    {note?.updated_at !== note?.created_at && (
                                        <>Updated {formatDate(note?.updated_at)}</>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    )
}