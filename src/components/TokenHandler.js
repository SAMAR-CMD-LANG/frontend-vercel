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
        console.log('=== SIMPLIFIED TokenHandler ===')
        const token = searchParams.get('token')
        console.log('Token in URL:', token ? 'YES' : 'NO')
        console.log('Token length:', token ? token.length : 0)

        if (token) {
            console.log('STORING TOKEN IN LOCALSTORAGE...')

            // Store the token from OAuth redirect
            setStoredToken(token)

            // Verify it was stored
            const stored = localStorage.getItem('auth_token')
            console.log('Token stored successfully:', !!stored)
            console.log('Stored token length:', stored ? stored.length : 0)

            // Remove token from URL
            const url = new URL(window.location)
            url.searchParams.delete('token')
            window.history.replaceState({}, '', url)
            console.log('Token removed from URL')

            // Refresh auth state
            setTimeout(() => {
                console.log('Calling checkAuth after token storage...')
                checkAuth()
            }, 200)
        } else {
            console.log('No token in URL parameters')
        }
    }, [searchParams, checkAuth])

    return null // This component doesn't render anything
}