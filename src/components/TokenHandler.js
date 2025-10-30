'use client'

import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function TokenHandler() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            console.log('TokenHandler: Processing OAuth token...')
            localStorage.setItem('auth_token', token)

            // Clean URL first
            window.history.replaceState({}, '', '/dashboard')

            // Force reload after ensuring token is stored
            setTimeout(() => {
                console.log('TokenHandler: Reloading page with stored token')
                window.location.reload()
            }, 50)
        }
    }, [])

    return null
}