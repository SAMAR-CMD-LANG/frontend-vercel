'use client'

import { useState, useEffect } from 'react'
import { getApiBaseUrl, getStoredToken } from '../../lib/api'

export default function OAuthDebugPage() {
    const [debugInfo, setDebugInfo] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = getStoredToken()
            const apiUrl = getApiBaseUrl()

            // Test token validation
            let tokenValidation = null
            if (token) {
                const validateResponse = await fetch(`${apiUrl}/debug/validate-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                })
                tokenValidation = validateResponse.ok ? await validateResponse.json() : { error: 'Validation failed' }
            }

            // Test /auth/me endpoint
            const authResponse = await fetch(`${apiUrl}/auth/me`, {
                credentials: 'include',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })

            const authData = authResponse.ok ? await authResponse.json() : { error: 'Auth failed', status: authResponse.status }

            // Test debug endpoint
            const debugResponse = await fetch(`${apiUrl}/debug/cookies`, {
                credentials: 'include',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })

            const debugData = debugResponse.ok ? await debugResponse.json() : { error: 'Debug failed' }

            setDebugInfo({
                token: token ? 'Present' : 'Missing',
                tokenLength: token ? token.length : 0,
                tokenValidation,
                apiUrl,
                authStatus: authResponse.status,
                authData,
                debugData,
                localStorage: typeof window !== 'undefined' ? {
                    authToken: localStorage.getItem('auth_token') ? 'Present' : 'Missing'
                } : {},
                cookies: typeof window !== 'undefined' ? document.cookie : 'N/A'
            })
        } catch (error) {
            setDebugInfo({ error: error.message })
        } finally {
            setLoading(false)
        }
    }

    const clearAuth = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            // Clear cookies
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            document.cookie = 'token_client=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        }
        checkAuthStatus()
    }

    const extractTokenFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            console.log('MANUAL: Found token in URL:', token.substring(0, 20) + '...')
            localStorage.setItem('auth_token', token)
            console.log('MANUAL: Token stored in localStorage')
            window.history.replaceState({}, '', window.location.pathname)
            setDebugInfo({ manualTest: `Token extracted and stored! Length: ${token.length}` })
        } else {
            setDebugInfo({ manualTest: 'No token found in URL' })
        }
    }

    const testStoredToken = async () => {
        const token = localStorage.getItem('auth_token')

        if (!token) {
            setDebugInfo({ manualTest: 'No token in localStorage' })
            return
        }

        try {
            const apiUrl = getApiBaseUrl()
            console.log('MANUAL: Testing token with /auth/me...')

            const response = await fetch(`${apiUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            console.log('MANUAL: Response status:', response.status)

            if (response.ok) {
                const data = await response.json()
                console.log('MANUAL: Auth successful!', data)
                setDebugInfo({
                    manualTest: `🎉 AUTH SUCCESS! User: ${data.user.email}`,
                    authResult: data
                })
            } else {
                const errorData = await response.text()
                console.log('MANUAL: Auth failed:', errorData)
                setDebugInfo({
                    manualTest: `❌ Auth failed: ${response.status} - ${errorData}`
                })
            }
        } catch (error) {
            console.log('MANUAL: Request error:', error)
            setDebugInfo({ manualTest: `❌ Request error: ${error.message}` })
        }
    }

    if (loading) {
        return <div className="p-8">Loading debug info...</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">OAuth Debug Information</h1>

                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
                        <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={checkAuthStatus}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                        >
                            Refresh Status
                        </button>
                        <button
                            onClick={clearAuth}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                        >
                            Clear Auth Data
                        </button>
                        <a
                            href="/dashboard"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block"
                        >
                            Go to Dashboard
                        </a>
                        <a
                            href="/login"
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded inline-block"
                        >
                            Go to Login
                        </a>
                        <button
                            onClick={() => window.location.href = `${getApiBaseUrl()}/auth/google`}
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                        >
                            Test Google OAuth
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                        <h3 className="font-semibold text-yellow-400 mb-4">Manual Token Testing</h3>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={extractTokenFromUrl}
                                className="bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-sm"
                            >
                                Extract Token from URL
                            </button>
                            <button
                                onClick={testStoredToken}
                                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
                            >
                                Test Stored Token
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            After Google OAuth, come back here and click "Extract Token from URL", then "Test Stored Token"
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div >
    )
}