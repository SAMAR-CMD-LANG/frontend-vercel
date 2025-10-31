'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function OAuthDebugPage() {
    const [config, setConfig] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOAuthConfig()
    }, [])

    const fetchOAuthConfig = async () => {
        try {
            const response = await fetch('http://localhost:5000/debug/oauth-config')
            const data = await response.json()
            setConfig(data)
        } catch (error) {
            console.error('Failed to fetch OAuth config:', error)
            toast.error('Failed to fetch OAuth configuration')
        } finally {
            setLoading(false)
        }
    }

    const testOAuthFlow = () => {
        window.location.href = 'http://localhost:5000/auth/google'
    }

    const testCallbackUrl = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/google/callback-test')
            const data = await response.json()
            console.log('Callback test response:', data)
            toast.success('Callback URL is reachable')
        } catch (error) {
            console.error('Callback test failed:', error)
            toast.error('Callback URL test failed')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading OAuth configuration...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">OAuth Debug Dashboard</h1>

                    {/* Configuration Status */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">Google Client ID</h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${config?.googleClientId === 'Set'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {config?.googleClientId || 'Unknown'}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">Google Client Secret</h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${config?.googleClientSecret === 'Set'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {config?.googleClientSecret || 'Unknown'}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">Session Secret</h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${config?.sessionSecret === 'Set'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {config?.sessionSecret || 'Unknown'}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">JWT Secret</h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${config?.jwtSecret === 'Set'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {config?.jwtSecret || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* URLs */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">URLs Configuration</h2>
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-1">Backend URL</h3>
                                <code className="text-sm text-blue-600">{config?.backendUrl}</code>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-1">Frontend URL</h3>
                                <code className="text-sm text-blue-600">{config?.frontendUrl}</code>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-1">OAuth Callback URL</h3>
                                <code className="text-sm text-blue-600">{config?.callbackUrl}</code>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-1">OAuth Initiation URL</h3>
                                <code className="text-sm text-blue-600">{config?.oauthInitUrl}</code>
                            </div>
                        </div>
                    </div>

                    {/* Test Actions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Actions</h2>
                        <div className="space-y-4">
                            <button
                                onClick={testCallbackUrl}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Test Callback URL Reachability
                            </button>

                            <button
                                onClick={testOAuthFlow}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors ml-4"
                            >
                                Start OAuth Flow
                            </button>
                        </div>
                    </div>

                    {/* Environment Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-2">Environment</h3>
                        <p className="text-sm text-gray-600">Node Environment: {config?.nodeEnv}</p>
                        <p className="text-sm text-gray-600">Timestamp: {config?.timestamp}</p>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-medium text-blue-800 mb-2">Google Cloud Console Setup</h3>
                        <div className="text-sm text-blue-700 space-y-2">
                            <p>Make sure your Google Cloud Console OAuth configuration includes:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Authorized JavaScript origins: <code>http://localhost:3000</code></li>
                                <li>Authorized redirect URIs: <code>{config?.callbackUrl}</code></li>
                                <li>OAuth consent screen is configured</li>
                                <li>OAuth 2.0 Client ID is created and enabled</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}