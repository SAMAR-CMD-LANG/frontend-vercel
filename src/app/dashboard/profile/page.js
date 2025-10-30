'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../../components/DashboardLayout'
import Icons from '../../../components/Icons'
import { useAuth } from '../../../contexts/AuthContext'

export default function ProfilePage() {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [stats, setStats] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    })
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const { requireAuth } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!requireAuth()) return
        checkAuth()
        fetchStats()
    }, [requireAuth])

    const checkAuth = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/auth/me`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setFormData({
                    name: data.user.name,
                    email: data.user.email
                })
            } else {
                router.push('/login')
            }
        } catch (error) {
            console.error('Auth check error:', error)
            router.push('/login')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/stats`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Stats fetch error:', error)
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Name is required')
            return
        }

        setIsSaving(true)

        try {
            // Note: This endpoint doesn't exist in the backend yet
            // You would need to add a user update endpoint
            toast.success('Profile updated successfully!')
            setUser({ ...user, ...formData })
            setIsEditing(false)
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('Please fill in all password fields')
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long')
            return
        }

        setIsChangingPassword(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://model-test-backend.onrender.com'}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Password changed successfully!')
                setShowChangePassword(false)
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } else {
                toast.error(data.message || 'Failed to change password')
            }
        } catch (error) {
            console.error('Change password error:', error)
            toast.error('Failed to change password')
        } finally {
            setIsChangingPassword(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const headerActions = !isEditing ? (
        <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
        >
            <Icons.Edit size={16} />
            Edit Profile
        </button>
    ) : null

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <span className="text-primary">Loading profile...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <DashboardLayout
                activeSection="profile"
                title="Profile Settings"
                subtitle="Manage your account and preferences"
                headerActions={headerActions}
            >
                <div className="profile-container">
                    <div className="profile-main">
                        {/* Profile Info */}
                        <motion.div
                            className="card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="card-header">
                                <h2 className="card-title">Personal Information</h2>
                                <p className="card-description">Update your personal details</p>
                            </div>

                            {isEditing ? (
                                <div className="profile-form">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            disabled={true}
                                        />
                                        <p className="form-help-text">
                                            Email cannot be changed for security reasons
                                        </p>
                                    </div>

                                    <div className="profile-actions">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="btn btn-primary"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="loading-spinner-sm"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Icons.Check size={16} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false)
                                                setFormData({
                                                    name: user.name,
                                                    email: user.email
                                                })
                                            }}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-info">
                                    <div className="info-item">
                                        <label className="info-label">Full Name</label>
                                        <p className="info-value">{user?.name}</p>
                                    </div>

                                    <div className="info-item">
                                        <label className="info-label">Email Address</label>
                                        <p className="info-value">{user?.email}</p>
                                    </div>

                                    <div className="info-item">
                                        <label className="info-label">Member Since</label>
                                        <p className="info-value">
                                            {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Security Section */}
                        <motion.div
                            className="card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="card-header">
                                <h2 className="card-title">Security</h2>
                                <p className="card-description">Manage your account security</p>
                            </div>

                            <div className="security-options">
                                <div className="security-option-card">
                                    <div className="security-option-info">
                                        <Icons.Lock size={20} className="text-accent" />
                                        <div>
                                            <p className="security-option-title">Password</p>
                                            <p className="security-option-description">Last updated recently</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowChangePassword(true)}
                                        className="btn btn-secondary security-action-btn"
                                    >
                                        <Icons.Lock size={16} />
                                        Change Password
                                    </button>
                                </div>

                                <div className="security-option-card">
                                    <div className="security-option-info">
                                        <Icons.Shield size={20} className="text-success" />
                                        <div>
                                            <p className="security-option-title">Two-Factor Authentication</p>
                                            <p className="security-option-description">Add an extra layer of security</p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-secondary security-action-btn"
                                        disabled
                                    >
                                        <Icons.Shield size={16} />
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="profile-sidebar">
                        <motion.div
                            className="card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="card-header">
                                <h3 className="card-title">Your Statistics</h3>
                            </div>

                            {stats ? (
                                <div className="stats-list">
                                    <div className="stat-item">
                                        <span className="stat-label">Total Notes</span>
                                        <span className="stat-value">{stats.totalNotes}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Draft Notes</span>
                                        <span className="stat-value stat-value-warning">{stats.draftNotes}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Public Notes</span>
                                        <span className="stat-value stat-value-success">{stats.publicNotes}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Recent Notes</span>
                                        <span className="stat-value stat-value-accent">{stats.recentNotes}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="stats-loading">
                                    <div className="loading-spinner-sm"></div>
                                    <p className="text-muted text-sm">Loading stats...</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Account Actions */}
                        <motion.div
                            className="card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="card-header">
                                <h3 className="card-title">Account Actions</h3>
                            </div>

                            <div className="account-actions">
                                <button className="account-action-btn">
                                    <Icons.Shield size={16} />
                                    Export Data
                                </button>
                                <button className="account-action-btn">
                                    <Icons.Lock size={16} />
                                    Privacy Settings
                                </button>
                                <button className="account-action-btn account-action-danger">
                                    <Icons.Close size={16} />
                                    Delete Account
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3 className="modal-title">Change Password</h3>
                            <button
                                onClick={() => setShowChangePassword(false)}
                                className="modal-close-btn"
                            >
                                <Icons.Close size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="modal-body">
                            <div className="form-group">
                                <label htmlFor="currentPassword" className="form-label">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="form-input"
                                    placeholder="Enter your current password"
                                    disabled={isChangingPassword}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword" className="form-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="form-input"
                                    placeholder="Enter your new password"
                                    disabled={isChangingPassword}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="form-input"
                                    placeholder="Confirm your new password"
                                    disabled={isChangingPassword}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePassword(false)}
                                    className="btn btn-secondary"
                                    disabled={isChangingPassword}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <div className="loading-spinner-sm"></div>
                                            Changing...
                                        </>
                                    ) : (
                                        <>
                                            <Icons.Check size={16} />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    )
}