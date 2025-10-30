'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Icons from '../../components/Icons'
import ThemeToggle from '../../components/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'
import { authAPI } from '../../lib/api'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [passwordStrength, setPasswordStrength] = useState(0)
    const { register, isLoading, redirectIfAuthenticated } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        redirectIfAuthenticated()
    }, [redirectIfAuthenticated])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

        // Calculate password strength
        if (name === 'password') {
            let strength = 0
            if (value.length >= 6) strength += 1
            if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength += 1
            if (value.match(/\d/)) strength += 1
            if (value.match(/[^a-zA-Z\d]/)) strength += 1
            setPasswordStrength(strength)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        })

        if (result.success) {
            router.push('/login')
        }
    }

    const handleGoogleSignup = () => {
        window.location.href = authAPI.googleAuth()
    }

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0: return 'bg-gray-600'
            case 1: return 'bg-red-500'
            case 2: return 'bg-yellow-500'
            case 3: return 'bg-blue-500'
            case 4: return 'bg-green-500'
            default: return 'bg-gray-600'
        }
    }

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0: return 'Enter password'
            case 1: return 'Weak'
            case 2: return 'Fair'
            case 3: return 'Good'
            case 4: return 'Strong'
            default: return ''
        }
    }

    return (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-6 py-12 relative">
            {/* Theme Toggle */}
            <div className="absolute top-6 right-6">
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
                        <Icons.Logo size={32} className="text-blue-500" />
                        <span className="text-2xl font-bold text-white">Note.io</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Start your secure note-taking journey</p>
                </motion.div>

                {/* Registration Form */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your full name"
                                required
                                disabled={isLoading}
                            />
                        </div>

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
                                placeholder="Create a strong password"
                                required
                                disabled={isLoading}
                            />

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Use 6+ characters with a mix of letters, numbers & symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Confirm your password"
                                required
                                disabled={isLoading}
                            />
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                            )}
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1"
                                required
                                disabled={isLoading}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-400">
                                I agree to the{' '}
                                <a href="/terms" className="text-blue-500 hover:text-blue-400">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-blue-500 hover:text-blue-400">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <Icons.Plus size={20} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-700"></div>
                        <span className="text-gray-400 text-sm">or</span>
                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>

                    {/* Google Signup */}
                    <button
                        onClick={handleGoogleSignup}
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

                    {/* Sign In Link */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-700">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                                Sign in
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
                    <a href="/" className="text-gray-400 hover:text-white flex items-center justify-center gap-2">
                        <Icons.ChevronRight size={16} className="rotate-180" />
                        Back to Home
                    </a>
                </motion.div>
            </div>
        </div>
    )
}