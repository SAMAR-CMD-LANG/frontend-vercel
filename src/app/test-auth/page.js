'use client'

import { useState } from 'react'
import { getStoredToken, setStoredToken } from '../../lib/api'

export default function TestAuthPage() {
    const [result, setResult] = useState(null)

    const testCookieAuth = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'

            // Test login to get cookies
            const loginResponse = await fetch(`${apiUrl}/debug/test-login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const loginData = await loginResponse.json()

            // Store token in localStorage
            if (loginData.token) {
                setStoredToken(loginData.token)
            }

            // Test auth endpoint
            const authResponse = await fetch(`${apiUrl}/auth/me`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${getStoredToken()}`
                }
            })

            const authData = await authResponse.json()

            setResult({
                login: loginData,
                auth: authData,
                authStatus: authResponse.status,
                storedToken: getStoredToken(),
                cookies: document.cookie
            })
        } catch (error) {
            setResult({ error: error.message })
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Test Authentication</h1>

            <div className="mb-6">
                <button
                    onClick={testCookieAuth}
                    className="btn btn-primary"
                >
                    Test Cookie Authentication
                </button>
            </div>

            {result && (
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-6">
                <a href="/dashboard" className="btn btn-secondary">
                    Back to Dashboard
                </a>
            </div>
        </div>
    )
}