'use client'

import { useState } from 'react'
import { getApiBaseUrl } from '../../lib/api'

export default function OAuthTestPage() {
    const [testResults, setTestResults] = useState({})

    const testBackendConnection = async () => {
        try {
            const apiUrl = getApiBaseUrl()

            // Test basic backend connection
            const healthResponse = await fetch(`${apiUrl}/health`)
            const healthData = await healthResponse.json()

            // Test OAuth callback test endpoint
            const callbackTestResponse = await fetch(`${apiUrl}/auth/google/callback-test`)
            const callbackTestData = await callbackTestResponse.json()

            // Test environment endpoint
            const envResponse = await fetch(`${apiUrl}/debug/env`)
            const envData = await envResponse.json()

            // Test OAuth configuration
            const oauthConfigResponse = await fetch(`${apiUrl}/debug/oauth-config`)
            const oauthConfigData = await oauthConfigResponse.json()

            setTestResults({
                apiUrl,
                health: healthData,
                callbackTest: callbackTestData,
                environment: envData,
                oauthConfig: oauthConfigData,
                googleOAuthUrl: `${apiUrl}/auth/google`,
                expectedCallbackUrl: `${oauthConfigData.callbackUrl}`,
                timestamp: new Date().toISOString()
            })
        } catch (error) {
            setTestResults({ error: error.message })
        }
    }

    const testGoogleOAuth = () => {
        const apiUrl = getApiBaseUrl()
        window.location.href = `${apiUrl}/auth/google`
    }

    const testCallbackUrl = () => {
        const apiUrl = getApiBaseUrl()
        window.open(`${apiUrl}/auth/google/callback-test?test=true`, '_blank')
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">OAuth Connection Test</h1>

                <div className="space-y-6">
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={testBackendConnection}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                        >
                            Test Backend Connection
                        </button>
                        <button
                            onClick={testCallbackUrl}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                        >
                            Test Callback URL
                        </button>
                        <button
                            onClick={testGoogleOAuth}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                        >
                            Test Google OAuth
                        </button>
                    </div>

                    {Object.keys(testResults).length > 0 && (
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                            <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
                                {JSON.stringify(testResults, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h3 className="font-semibold text-green-400">1. Test Backend Connection</h3>
                                <p>Verify that the backend is reachable and get environment info.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-400">2. Test Callback URL</h3>
                                <p>Check if the OAuth callback endpoint is working (opens in new tab).</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-400">3. Test Google OAuth</h3>
                                <p>Start the actual Google OAuth flow. Check browser console and backend logs.</p>
                            </div>
                            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                                <h3 className="font-semibold text-yellow-400">Google Cloud Console Setup</h3>
                                <p>Make sure your Google OAuth app has this exact redirect URI:</p>
                                <code className="block mt-2 p-2 bg-gray-700 rounded text-green-400">
                                    https://backend-render-vhvf.onrender.com/auth/google/callback
                                </code>
                                <div className="mt-3 text-sm">
                                    <p className="text-red-400 font-semibold">Common Issues:</p>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                        <li>Redirect URI must match EXACTLY (including https://)</li>
                                        <li>No trailing slash in the URL</li>
                                        <li>OAuth app must be published (not in testing mode for external users)</li>
                                        <li>Authorized domains must include your frontend domain</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <a href="/dashboard" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded inline-block">
                            Go to Dashboard
                        </a>
                        <a href="/oauth-debug" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded inline-block">
                            OAuth Debug Page
                        </a>
                        <a href="/login" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded inline-block">
                            Go to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}