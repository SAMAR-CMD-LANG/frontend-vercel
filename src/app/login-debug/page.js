'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { authAPI, getApiBaseUrl } from '../../lib/api'

export default function LoginDebugPage() {
    const [formData, setFormData] = useState({
        email: 'test@example.com',
        password: 'testpass123'
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const testDirectFetch = async () => {
        setLoading(true)
        setResult(null)

        try {
            console.log('Testing direct fetch to:', `${getApiBaseUrl()}/auth/login`)
            console.log('Request data:', formData)

            const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            console.log('Response status:', response.status)
            console.log('Response headers:', Object.fromEntries(response.headers.entries()))

            const data = await response.json()
            console.log('Response data:', data)

            setResult({
                success: response.ok,
                status: response.status,
                data: data,
                method: 'Direct Fetch'
            })

            if (response.ok) {
                toast.success('Direct fetch login successful!')
            } else {
                toast.error(`Direct fetch failed: ${data.message}`)
            }

        } catch (error) {
            console.error('Direct fetch error:', error)
            setResult({
                success: false,
                error: error.message,
                method: 'Direct Fetch'
            })
            toast.error(`Direct fetch error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const testApiWrapper = async () => {
        setLoading(true)
        setResult(null)

        try {
            console.log('Testing API wrapper login')
            console.log('Request data:', formData)

            const response = await authAPI.login(formData)
            console.log('API wrapper response:', response)

            setResult({
                success: true,
                data: response.data,
                method: 'API Wrapper'
            })

            toast.success('API wrapper login successful!')

        } catch (error) {
            console.error('API wrapper error:', error)
            setResult({
                success: false,
                error: error.message,
                method: 'API Wrapper'
            })
            toast.error(`API wrapper error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const testAuthContext = async () => {
        setLoading(true)
        setResult(null)

        try {
            console.log('Testing AuthContext login')

            // Import AuthContext dynamically to avoid SSR issues
            const { useAuth } = await import('../../contexts/AuthContext')

            // Note: This won't work properly outside of AuthProvider context
            // This is just for demonstration
            setResult({
                success: false,
                error: 'AuthContext test requires component to be wrapped in AuthProvider',
                method: 'AuthContext'
            })

        } catch (error) {
            console.error('AuthContext error:', error)
            setResult({
                success: false,
                error: error.message,
                method: 'AuthContext'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Login Debug Test</h1>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Credentials</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <button
                            onClick={testDirectFetch}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Test Direct Fetch
                        </button>

                        <button
                            onClick={testApiWrapper}
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 ml-4"
                        >
                            Test API Wrapper
                        </button>

                        <button
                            onClick={testAuthContext}
                            disabled={loading}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 ml-4"
                        >
                            Test AuthContext
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Testing...</p>
                        </div>
                    )}

                    {result && (
                        <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                            <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {result.method}: {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                            </h3>
                            {result.success ? (
                                <pre className="mt-2 text-sm text-green-700 bg-green-100 p-2 rounded overflow-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            ) : (
                                <div className="mt-2 text-sm text-red-700">
                                    <p><strong>Error:</strong> {result.error}</p>
                                    {result.status && <p><strong>Status:</strong> {result.status}</p>}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-medium text-blue-800 mb-2">Configuration</h3>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p><strong>API Base URL:</strong> {getApiBaseUrl()}</p>
                            <p><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <a href="/login" className="text-blue-600 hover:text-blue-800">
                            ← Back to Login Page
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}