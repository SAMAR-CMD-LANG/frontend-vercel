'use client'

import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function TokenHandler() {
    const { checkAuth } = useAuth()

    useEffect(() => {
        // Exact copy of the manual fix that worked
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            console.log('TokenHandler: Processing OAuth token...')
            localStorage.setItem('auth_token', token)
            window.history.replaceState({}, '', '/dashboard')

            // Trigger auth check instead of page reload
            checkAuth()
        }
    }, [checkAuth])

    return null
}