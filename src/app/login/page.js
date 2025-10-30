'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Icons from '../../components/Icons'
import ThemeToggle from '../../components/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'
import { authAPI } from '../../lib/api'

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { login, isLoading, redirectIfAuthenticated } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        redirectIfAuthenticated()
    }, [redirectIfAuthenticated])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const result = await login(formData)
        if (result.success) {
            router.push('/dashboard')
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = authAPI.googleAuth()
    }

    return (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-6 relative">
            {/* Theme Toggle */}
            <div className="absolute" style={{ top: '1.5rem', right: '1.5rem' }}>
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Icons.Logo size={32} className="text-accent" />
                        <span className="text-2xl font-bold text-primary">Note.io</span>
                    </div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
                    <p className="text-secondary">Sign in to your secure notes</p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-muted">
                                <input type="checkbox" className="rounded" />
                                Remember me
                            </label>
                            <a href="/forgot-password" className="text-blue-500" style={{ color: 'var(--accent-primary)' }}>
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <Icons.Profile size={20} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 border-t border-primary"></div>
                        <span className="text-muted text-sm">or</span>
                        <div className="flex-1 border-t border-primary"></div>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-secondary w-full"
                        disabled={isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6 pt-6 border-t border-primary">
                        <p className="text-muted">
                            Don't have an account?{' '}
                            <a href="/register" className="font-medium text-accent">
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <a href="/" className="text-muted flex items-center justify-center gap-2">
                        <Icons.ChevronRight size={16} className="rotate-180" />
                        Back to Home
                    </a>
                </motion.div>
            </div>
        </div>
    )
}