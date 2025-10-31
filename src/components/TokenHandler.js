'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'

export default function TokenHandler() {
    const { checkAuth } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)
    const [hasProcessed, setHasProcessed] = useState(false)

    useEffect(() => {
        const processToken = async () => {
            // Prevent multiple processing attempts
            if (hasProcessed || isProcessing) {
                console.log('TokenHandler: Already processed or processing, skipping...')
                return
            }

            console.log('TokenHandler: Starting token processing...')
            console.log('TokenHandler: Current URL:', window.location.href)
            console.log('TokenHandler: URL search params:', window.location.search)

            // Try multiple ways to get the token in case URL parsing fails
            const urlParams = new URLSearchParams(window.location.search)
            let token = urlParams.get('token')

            // Fallback: try to extract token from hash if not in search params
            if (!token && window.location.hash) {
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                token = hashParams.get('token')
                console.log('TokenHandler: Trying hash params, found token:', !!token)
            }

            // Fallback: try to extract token directly from URL string
            if (!token) {
                const tokenMatch = window.location.href.match(/[?&]token=([^&]+)/)
                if (tokenMatch) {
                    token = decodeURIComponent(tokenMatch[1])
                    console.log('TokenHandler: Extracted token via regex:', !!token)
                }
            }

            const error = urlParams.get('error')
            const details = urlParams.get('details')

            console.log('TokenHandler: Extracted token:', token ? `${token.substring(0, 20)}...` : 'null')
            console.log('TokenHandler: Extracted error:', error)

            // Handle OAuth errors
            if (error) {
                console.error('TokenHandler: OAuth Error:', error, details)
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
                setHasProcessed(true)

                // Clean URL and redirect to login
                window.history.replaceState({}, '', '/login')
                return
            }

            // Process OAuth token
            if (token) {
                setIsProcessing(true)
                setHasProcessed(true)
                console.log('TokenHandler: Processing OAuth token...')
                console.log('TokenHandler: Token length:', token.length)

                try {
                    // Store token
                    console.log('TokenHandler: Storing token in localStorage...')
                    localStorage.setItem('auth_token', token)

                    // Verify token was stored
                    const storedToken = localStorage.getItem('auth_token')
                    console.log('TokenHandler: Token stored successfully:', !!storedToken)
                    console.log('TokenHandler: Stored token matches:', storedToken === token)

                    // Clean URL first
                    console.log('TokenHandler: Cleaning URL...')
                    window.history.replaceState({}, '', '/dashboard')

                    // Small delay to ensure everything is ready
                    await new Promise(resolve => setTimeout(resolve, 500))

                    // Trigger auth check
                    console.log('TokenHandler: Triggering auth check...')
                    await checkAuth()

                    console.log('TokenHandler: OAuth processing completed successfully')
                    toast.success('Successfully signed in with Google!')
                } catch (error) {
                    console.error('TokenHandler: Token processing error:', error)
                    toast.error('Failed to process authentication token')
                    localStorage.removeItem('auth_token')
                    window.location.href = '/login'
                } finally {
                    setIsProcessing(false)
                }
            } else {
                console.log('TokenHandler: No token found in URL')
                setHasProcessed(true)
            }
        }

        // Multiple attempts with increasing delays to ensure token processing works
        const timer1 = setTimeout(processToken, 100)
        const timer2 = setTimeout(processToken, 500)
        const timer3 = setTimeout(processToken, 1000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
        }
    }, [checkAuth, isProcessing, hasProcessed])

    return null
}