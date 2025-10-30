'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setStoredToken } from '../../../lib/api'
import { useAuth } from '../../../contexts/AuthContext'

export default function AuthSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { checkAuth } = useAuth()

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            const token = searchParams.get('token')
            const error = searchParams.get('error')

            if (error) {
                console.error('OAuth error:', error)
                router.push(`/login?error=${error}`)
                return
            }

            if (token) {
                console.log('OAuth success - storing token')

                // Store token
                setStoredToken(token)

                // Verify storage
                const stored = localStorage.getItem('auth_token')
                console.log('Token stored successfully:', !!stored)

                // Check auth and redirect
                await checkAuth()
                router.push('/dashboard')
            } else {
                console.error('No token received')
                router.push('/login?error=no_token')
            }
        }

        handleOAuthSuccess()
    }, [searchParams, checkAuth, router])

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Completing authentication...</p>
            </div>
        </div>
    )
}