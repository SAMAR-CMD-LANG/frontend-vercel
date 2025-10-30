'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setStoredToken } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function TokenHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { checkAuth } = useAuth()

    // IMMEDIATE token check - run before anything else
    if (typeof window !== 'undefined') {
        const immediateUrlParams = new URLSearchParams(window.location.search)
        const immediateToken = immediateUrlParams.get('token')

        if (immediateToken) {
            console.log('IMMEDIATE TokenHandler - found token, storing now!')
            localStorage.setItem('auth_token', immediateToken)

            // Clean URL immediately
            const cleanUrl = window.location.pathname
            window.history.replaceState({}, '', cleanUrl)

            // Trigger page reload to ensure auth state updates
            console.log('IMMEDIATE TokenHandler - reloading to apply auth')
            setTimeout(() => {
                window.location.reload()
            }, 100)
        }
    }

    useEffect(() => {
        // Check URL immediately on mount, before anything else can clean it
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        console.log('TokenHandler - checking URL:', window.location.href)
        console.log('TokenHandler - token found:', token ? 'YES' : 'NO')

        if (token) {
            console.log('TokenHandler - storing token immediately')
            setStoredToken(token)

            // Remove token from URL immediately
            const url = new URL(window.location)
            url.searchParams.delete('token')
            window.history.replaceState({}, '', url)
            console.log('TokenHandler - token removed from URL')

            // Trigger page reload to ensure auth state updates
            console.log('TokenHandler - reloading to apply auth')
            setTimeout(() => {
                window.location.reload()
            }, 100)
        }
    }, []) // Remove dependencies to run immediately on mount

    return null // This component doesn't render anything
}