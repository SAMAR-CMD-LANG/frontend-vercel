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
            console.log('IMMEDIATE TokenHandler - found token, storing and reloading!')
            localStorage.setItem('auth_token', immediateToken)

            // Clean URL and reload immediately
            const cleanUrl = window.location.pathname
            window.history.replaceState({}, '', cleanUrl)
            window.location.reload()
        }
    }

    useEffect(() => {
        // This useEffect is backup in case immediate check doesn't work
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            console.log('TokenHandler useEffect - processing remaining token')
            setStoredToken(token)

            // Clean URL and reload
            const url = new URL(window.location)
            url.searchParams.delete('token')
            window.history.replaceState({}, '', url)
            window.location.reload()
        }
    }, [])

    return null // This component doesn't render anything
}