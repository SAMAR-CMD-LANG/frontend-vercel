'use client'

import { useState } from 'react'
import { getApiBaseUrl, getStoredToken } from '../../lib/api'

export default function TestSimpleOAuthPage() {
    const [status, setStatus] = useState('')

    const testOAuth = () => {
        setStatus('Starting OAuth...')
        window.location.href = `${getApiBaseUrl()}/auth/google`
    }

    const checkToken = () => {
        const token = getStoredToken()
        setStatus(token ? `Token found: ${token.substring(0, 20)}...` : 'No token found')
    }

    const testAuthMe = async () => {
        try {
            const token = getStoredToken()
            if (!token) {
                setStatus('No token to test with')
                return
            }

            const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setStatus(`Auth successful: ${data.user.email}`)
            } else {
                setStatus(`Auth failed: ${response.status}`)
            }
        } catch (error) {
            setStatus(`Auth error: ${error.message}`)
        }
    }

    const clearToken = () => {
        localStorage.removeItem('auth_token')
        setStatus('Token cleared')
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Simple OAuth Test</h1>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={testOAuth}
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded block w-full"
                    >
                        Test Google OAuth
                    </button>

                    <button
                        onClick={checkToken}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded block w-full"
                    >
                        Check Token
                    </button>

                    <button
                        onClick={testAuthMe}
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded block w-full"
                    >
                        Test /auth/me
                    </button>

                    <button
                        onClick={clearToken}
                        className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded block w-full"
                    >
                        Clear Token
                    </button>
                </div>

                {status && (
                    <div className="bg-gray-800 p-4 rounded">
                        <h2 className="font-semibold mb-2">Status:</h2>
                        <p className="text-green-400">{status}</p>
                    </div>
                )}

                <div className="mt-8 text-sm text-gray-400">
                    <h3 className="font-semibold mb-2">How it works now:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Click "Test Google OAuth" → Goes to Google</li>
                        <li>Google redirects to: /auth/success?token=...</li>
                        <li>Success page stores token in localStorage</li>
                        <li>All API requests use Authorization: Bearer token</li>
                        <li>No cookies, no complex cross-origin issues</li>
                    </ol>
                </div>

                <div className="mt-6 flex gap-4">
                    <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                        Dashboard
                    </a>
                    <a href="/login" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
                        Login
                    </a>
                </div>
            </div>
        </div>
    )
}