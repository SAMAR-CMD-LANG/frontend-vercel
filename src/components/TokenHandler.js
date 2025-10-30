'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setStoredToken } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function TokenHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { checkAuth } = useAuth()

    // Run token check immediately when component mounts
    useEffect(() => {
        const immediateUrlParams = new URLSearchParams(window.location.search)
        const immediateToken = immediateUrlParams.get('token')

        if (immediateToken) {
            console.log('TokenHandler - found token, storing and reloading!')
            localStorage.setItem('auth_token', immediateToken)

            // Clean URL and reload immediately
            const cleanUrl = window.location.pathname
            window.history.replaceState({}, '', cleanUrl)
            window.location.reload()
        }
    }, []) // Run once on mount



    return null // This component doesn't render anything
}