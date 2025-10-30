'use client'

import { useState } from 'react'
import { getApiBaseUrl } from '../../lib/api'

export default function ManualTokenTestPage() {
    const [result, setResult] = useState('')

    const extractAndTestToken = () => {
        // Get token from URL if present
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            console.log('Found token in URL:', token.substring(0, 20) + '...')

            // Store it manually
            localStorage.setItem('auth_token', token)
            console.log('Token stored in localStorage')

            // Remove from URL
            window.history.replaceState({}, '', window.location.pathname)

            setResult(`Token stored! Length: ${token.length}`)
        } else {
            setResult('No token in URL')
        }
    }

    const testStoredToken = async () => {
        const token = localStorage.getItem('auth_token')

        if (!token) {
            setResult('No token in localStorage')
            return
        }

        try {
            console.log('Testing token:', token.substring(0, 20) + '...')

            const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            console.log('Response status:', response.status)

            if (response.ok) {
                const data = await response.json()
                setResult(`SUCCESS! User: ${data.user.email}`)
                console.log('Auth successful:', data)
            } else {
                const errorData = await response.text()
                setResult(`FAILED! Status: ${response.status}, Error: ${errorData}`)
                console.log('Auth failed:', errorData)
            }
        } catch (error) {
            setResult(`ERROR: ${error.message}`)
            console.error('Request error:', error)
        }
    }

    const clearToken = () => {
        localStorage.removeItem('auth_token')
        setResult('Token cleared')
    }

    const checkToken = () => {
        const token = localStorage.getItem('auth_token')
        setResult(token ? `Token exists: ${token.substring(0, 30)}...` : 'No token found')
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Manual Token Test</h1>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={extractAndTestToken}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded block w-full"
                    >
                        Extract Token from URL
                    </button>

                    <button
                        onClick={checkToken}
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded block w-full"
                    >
                        Check Stored Token
                    </button>

                    <button
                        onClick={testStoredToken}
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded block w-full"
                    >
                        Test Token with /auth/me
                    </button>

                    <button
                        onClick={clearToken}
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded block w-full"
                    >
                        Clear Token
                    </button>
                </div>

                {result && (
                    <div className="bg-gray-800 p-4 rounded mb-6">
                        <h2 className="font-semibold mb-2">Result:</h2>
                        <p className="text-green-400">{result}</p>
                    </div>
                )}

                <div className="text-sm text-gray-400">
                    <p><strong>Instructions:</strong></p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>After Google OAuth, you'll be redirected to dashboard with ?token=...</li>
                        <li>Come to this page: /manual-token-test</li>
                        <li>Or manually add ?token=YOUR_TOKEN to this page URL</li>
                        <li>Click "Extract Token from URL" to store it</li>
                        <li>Click "Test Token" to verify it works</li>
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