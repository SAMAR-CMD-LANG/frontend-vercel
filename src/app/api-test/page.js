'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { authAPI, getApiBaseUrl } from '../../lib/api'

export default function ApiTestPage() {
    const [testResults, setTestResults] = useState({})
    const [loading, setLoading] = useState(false)

    const runTest = async (testName, testFunction) => {
        setLoading(true)
        try {
            const result = await testFunction()
            setTestResults(prev => ({
                ...prev,
                [testName]: { success: true, data: result }
            }))
            toast.success(`${testName} passed`)
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                [testName]: { success: false, error: error.message }
            }))
            toast.error(`${testName} failed: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const testBackendConnection = async () => {
        const response = await fetch(`${getApiBaseUrl()}/test`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return await response.json()
    }

    const testCorsPreflightLogin = async () => {
        const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        })
        if (!response.ok) throw new Error(`CORS preflight failed: ${response.status}`)
        return { status: response.status, headers: Object.fromEntries(response.headers.entries()) }
    }

    const testLoginEndpoint = async () => {
        try {
            const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                })
            })

            const data = await response.json()

            // We expect this to fail with invalid credentials, which means the endpoint is working
            if (response.status === 400 && data.message === 'Invalid credentials') {
                return { status: 'Login endpoint working (correctly rejected invalid credentials)', data }
            } else {
                throw new Error(`Unexpected response: ${response.status} - ${data.message}`)
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error - cannot reach backend')
            }
            throw error
        }
    }

    const testApiWrapper = async () => {
        try {
            await authAPI.login({ email: 'test@example.com', password: 'wrongpassword' })
        } catch (error) {
            // We expect this to fail, but it should be a proper API error, not a network error
            if (error.message === 'Invalid credentials') {
                return { status: 'API wrapper working (correctly rejected invalid credentials)' }
            } else {
                throw error
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p><strong>API Base URL:</strong> {getApiBaseUrl()}</p>
                            <p><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <button
                            onClick={() => runTest('Backend Connection', testBackendConnection)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Test Backend Connection
                        </button>

                        <button
                            onClick={() => runTest('CORS Preflight', testCorsPreflightLogin)}
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 ml-4"
                        >
                            Test CORS Preflight
                        </button>

                        <button
                            onClick={() => runTest('Login Endpoint', testLoginEndpoint)}
                            disabled={loading}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 ml-4"
                        >
                            Test Login Endpoint
                        </button>

                        <button
                            onClick={() => runTest('API Wrapper', testApiWrapper)}
                            disabled={loading}
                            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 ml-4"
                        >
                            Test API Wrapper
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Running test...</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Test Results</h2>
                        {Object.entries(testResults).map(([testName, result]) => (
                            <div key={testName} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                }`}>
                                <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {testName}: {result.success ? '✅ PASSED' : '❌ FAILED'}
                                </h3>
                                {result.success ? (
                                    <pre className="mt-2 text-sm text-green-700 bg-green-100 p-2 rounded overflow-auto">
                                        {JSON.stringify(result.data, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="mt-2 text-sm text-red-700">
                                        Error: {result.error}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Tips</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• If "Backend Connection" fails: Check if backend server is running on port 5000</li>
                            <li>• If "CORS Preflight" fails: Check CORS configuration in backend</li>
                            <li>• If "Login Endpoint" fails with network error: Check firewall/antivirus blocking localhost</li>
                            <li>• If "API Wrapper" fails: Check frontend API configuration</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}