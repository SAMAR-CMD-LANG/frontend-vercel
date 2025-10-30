'use client'

import { useState } from 'react'

export default function CorsTestPage() {
    const [result, setResult] = useState(null)

    const testCors = async () => {
        try {
            console.log('Testing CORS...')
            const response = await fetch('https://model-test-backend.onrender.com/health', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            setResult({
                success: true,
                status: response.status,
                data: data
            })
        } catch (error) {
            console.error('CORS test failed:', error)
            setResult({
                success: false,
                error: error.message,
                type: error.name
            })
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">CORS Test</h1>

            <button onClick={testCors} className="btn btn-primary mb-4">
                Test Backend Connection
            </button>

            {result && (
                <div className="card">
                    <h3 className="font-bold mb-2">Result:</h3>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}