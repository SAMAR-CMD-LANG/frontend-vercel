'use client'

import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function TokenHandler() {
    const { checkAuth } = useAuth()

    useEffect(() => {
        const processToken = async () => {
            const urlParams = new URLSearchParams(window.location.search)
            const token = urlParams.get('token')

            if (token) {
                console.log('TokenHandler: Processing OAuth token...')
                localStorage.setItem('auth_token', token)

                // Clean URL first
                window.history.replaceState({}, '', '/dashboard')

                // Wait a bit then trigger auth check
                setTimeout(async () => {
                    console.log('TokenHandler: Triggering auth check...')
                    await checkAuth()
                }, 100)
            }
        }

        processToken()
    }, [checkAuth])

    return null
}