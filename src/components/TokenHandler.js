'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'

export default function TokenHandler() {
    const { checkAuth } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        const processToken = async () => {
            const urlParams = new URLSearchParams(window.location.search)
            const token = urlParams.get('token')
            const error = urlParams.get('error')
            const details = urlParams.get('details')

            // Handle OAuth errors
            if (error) {
                console.error('OAuth Error:', error, details)
                let errorMessage = 'Authentication failed'

                switch (error) {
                    case 'oauth_failed':
                        errorMessage = 'Google authentication failed'
                        break
                    case 'no_user_data':
                        errorMessage = 'No user data received from Google'
                        break
                    case 'callback_processing_failed':
                        errorMessage = `Authentication processing failed: ${details || 'Unknown error'}`
                        break
                    default:
                        errorMessage = `Authentication error: ${error}`
                }

                toast.error(errorMessage)

                // Clean URL and redirect to login
                window.history.replaceState({}, '', '/login')
                return
            }

            // Process OAuth token
            if (token && !isProcessing) {
                setIsProcessing(true)
                console.log('TokenHandler: Processing OAuth token...')

                try {
                    // Store token
                    localStorage.setItem('auth_token', token)

                    // Clean URL first
                    window.history.replaceState({}, '', '/dashboard')

                    // Trigger auth check
                    console.log('TokenHandler: Triggering auth check...')
                    await checkAuth()

                    toast.success('Successfully signed in with Google!')
                } catch (error) {
                    console.error('Token processing error:', error)
                    toast.error('Failed to process authentication token')
                    localStorage.removeItem('auth_token')
                    window.location.href = '/login'
                } finally {
                    setIsProcessing(false)
                }
            }
        }

        processToken()
    }, [checkAuth, isProcessing])

    return null
}