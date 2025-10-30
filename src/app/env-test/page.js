'use client'

export default function EnvTestPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
            <div className="card">
                <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
                <p><strong>Expected:</strong> https://model-test-backend.onrender.com</p>
                <p><strong>Status:</strong> {
                    process.env.NEXT_PUBLIC_API_URL === 'https://model-test-backend.onrender.com'
                        ? '✅ CORRECT'
                        : '❌ INCORRECT'
                }</p>
            </div>
        </div>
    )
}