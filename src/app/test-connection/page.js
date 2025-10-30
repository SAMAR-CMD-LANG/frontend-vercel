'use client'

import { useState } from 'react'
import { authAPI, notesAPI, userAPI } from '../../lib/api'

export default function TestConnectionPage() {
    const [results, setResults] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const testEndpoint = async (name, apiCall) => {
        try {
            const result = await apiCall()
            setResults(prev => ({
                ...prev,
                [name]: { success: true, data: result.data }
            }))
        } catch (error) {
            setResults(prev => ({
                ...prev,
                [name]: { success: false, error: error.message }
            }))
        }
    }

    const runTests = async () => {
        setIsLoading(true)
        setResults({})

        // Test various endpoints
        await testEndpoint('Auth Check', authAPI.me)
        await testEndpoint('Public Notes', () => notesAPI.getPublicNotes({ limit: 5 }))
        await testEndpoint('Features', userAPI.getFeatures)

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-theme-primary p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-theme-primary mb-8">API Connection Test</h1>

                <button
                    onClick={runTests}
                    disabled={isLoading}
                    className="btn btn-primary mb-8"
                >
                    {isLoading ? 'Testing...' : 'Test API Connection'}
                </button>

                <div className="space-y-4">
                    {Object.entries(results).map(([name, result]) => (
                        <div key={name} className="card">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-theme-primary">{name}</h3>
                                <span className={`px-2 py-1 rounded text-xs ${result.success
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {result.success ? 'SUCCESS' : 'FAILED'}
                                </span>
                            </div>

                            <pre className="bg-theme-secondary p-4 rounded text-sm text-theme-secondary overflow-auto">
                                {result.success
                                    ? JSON.stringify(result.data, null, 2)
                                    : result.error
                                }
                            </pre>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <a href="/" className="btn btn-secondary">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}