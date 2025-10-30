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

            // Test /auth/me endpoint
            const authResponse = await fetch(`${apiUrl}/auth/me`, {
                credentials: 'include',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })

            const authData = authResponse.ok ? await authResponse.json() : { error: 'Auth failed' }

            // Test debug endpoint
            const debugResponse = await fetch(`${apiUrl}/debug/cookies`, {
                credentials: 'include',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })

            const debugData = debugResponse.ok ? await debugResponse.json() : { error: 'Debug failed' }

            setDebugInfo({
                token: token ? 'Present' : 'Missing',
                tokenLength: token ? token.length : 0,
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
                    </div>
                </div>
            </div>
        </div>
    )
}