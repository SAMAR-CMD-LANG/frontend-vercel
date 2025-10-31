'use client'

import { useState, useEffect } from 'react'

export default function DebugOverlay() {
    const [debugInfo, setDebugInfo] = useState({})
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const updateDebugInfo = () => {
            const info = {
                url: window.location.href,
                search: window.location.search,
                hash: window.location.hash,
                hasToken: !!localStorage.getItem('auth_token'),
                tokenPreview: localStorage.getItem('auth_token')?.substring(0, 20) + '...',
                timestamp: new Date().toISOString()
            }
            setDebugInfo(info)
        }

        updateDebugInfo()
        const interval = setInterval(updateDebugInfo, 1000)

        // Show debug overlay if there's a token in URL
        if (window.location.search.includes('token=')) {
            setIsVisible(true)
        }

        return () => clearInterval(interval)
    }, [])

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    zIndex: 9999,
                    background: 'red',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '3px',
                    fontSize: '12px'
                }}
            >
                Debug
            </button>
        )
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '15px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '400px',
            fontFamily: 'monospace'
        }}>
            <div style={{ marginBottom: '10px' }}>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        float: 'right'
                    }}
                >
                    ×
                </button>
                <strong>Debug Info</strong>
            </div>

            <div><strong>URL:</strong> {debugInfo.url}</div>
            <div><strong>Search:</strong> {debugInfo.search || 'none'}</div>
            <div><strong>Hash:</strong> {debugInfo.hash || 'none'}</div>
            <div><strong>Has Token:</strong> {debugInfo.hasToken ? 'YES' : 'NO'}</div>
            {debugInfo.hasToken && (
                <div><strong>Token:</strong> {debugInfo.tokenPreview}</div>
            )}
            <div><strong>Updated:</strong> {debugInfo.timestamp}</div>

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #333' }}>
                <button
                    onClick={() => {
                        const urlParams = new URLSearchParams(window.location.search)
                        const token = urlParams.get('token')
                        if (token) {
                            localStorage.setItem('auth_token', token)
                            window.history.replaceState({}, '', '/dashboard')
                            window.location.reload()
                        } else {
                            alert('No token found in URL')
                        }
                    }}
                    style={{
                        background: 'green',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        marginRight: '5px'
                    }}
                >
                    Force Process Token
                </button>

                <button
                    onClick={() => {
                        localStorage.removeItem('auth_token')
                        window.location.reload()
                    }}
                    style={{
                        background: 'orange',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px'
                    }}
                >
                    Clear Token
                </button>
            </div>
        </div>
    )
}