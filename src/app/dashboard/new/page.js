'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewNotePage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to the notes/new route
        router.replace('/dashboard/notes/new')
    }, [router])

    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-spinner"></div>
                <span className="text-primary">Creating new note...</span>
            </div>
        </div>
    )
}