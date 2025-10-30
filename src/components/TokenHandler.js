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
        console.log('TokenHandler: Checking for token in URL...')
        const token = searchParams.get('token')
        console.log('TokenHandler: Token found:', token ? 'Yes' : 'No')
        console.log('TokenHandler: Token length:', token ? token.length : 0)

        if (token) {
            console.log('TokenHandler: Processing OAuth token...')

            // Store the token from OAuth redirect
            setStoredToken(token)
            console.log('TokenHandler: Token stored in localStorage')

            // Verify storage
            const storedToken = localStorage.getItem('auth_token')
            console.log('TokenHandler: Verification - token stored successfully:', !!storedToken)

            // Remove token from URL
            const url = new URL(window.location)
            url.searchParams.delete('token')
            window.history.replaceState({}, '', url)
            console.log('TokenHandler: Token removed from URL')

            // Refresh auth state with a small delay to ensure token is stored
            setTimeout(() => {
                console.log('TokenHandler: Calling checkAuth...')
                checkAuth()
            }, 200)
        } else {
            console.log('TokenHandler: No token in URL, skipping...')
        }
    }, [searchParams, checkAuth])

    return null // This component doesn't render anything
}