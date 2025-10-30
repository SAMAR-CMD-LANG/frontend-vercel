'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setStoredToken } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function TokenHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { checkAuth } = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')

        if (token) {
            // Store the token from OAuth redirect
            setStoredToken(token)

            // Remove token from URL
            const url = new URL(window.location)
            url.searchParams.delete('token')
            window.history.replaceState({}, '', url)

            // Refresh auth state
            checkAuth()
        }
    }, [searchParams, checkAuth])

    return null // This component doesn't render anything
}