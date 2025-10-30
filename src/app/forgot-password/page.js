'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Icons from '../../components/Icons'
import ThemeToggle from '../../components/ThemeToggle'
import { authAPI } from '../../lib/api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error('Please enter your email address')
            return
        }

        setIsLoading(true)

        try {
            await authAPI.forgotPassword(email)
            setIsSubmitted(true)
            toast.success('Password reset instructions sent to your email')
        } catch (error) {
            console.error('Forgot password error:', error)
            toast.error(error.message || 'Failed to send reset instructions')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="hero-section">
            {/* Theme Toggle */}
            <div className="absolute" style={{ top: '1.5rem', right: '1.5rem' }}>
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md mx-auto px-6">
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
                    <h1 className="text-3xl font-bold text-primary mb-2">Forgot Password</h1>
                    <p className="text-secondary">
                        {isSubmitted
                            ? 'Check your email for reset instructions'
                            : 'Enter your email to receive password reset instructions'
                        }
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {isSubmitted ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icons.Check size={24} className="text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Email Sent!</h3>
                            <p className="text-secondary mb-6">
                                We've sent password reset instructions to <strong>{email}</strong>
                            </p>
                            <div className="space-y-3">
                                <a href="/login" className="btn btn-primary w-full">
                                    <Icons.ChevronRight size={16} className="rotate-180" />
                                    Back to Sign In
                                </a>
                                <button
                                    onClick={() => {
                                        setIsSubmitted(false)
                                        setEmail('')
                                    }}
                                    className="btn btn-secondary w-full"
                                >
                                    Try Different Email
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your email address"
                                    required
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="loading-spinner-sm"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Icons.Lock size={20} />
                                        Send Reset Instructions
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Back to Login */}
                    {!isSubmitted && (
                        <div className="text-center mt-6 pt-6 border-t border-primary">
                            <p className="text-muted">
                                Remember your password?{' '}
                                <a href="/login" className="font-medium text-accent">
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    )}
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