// API Configuration and Utilities

export const getApiBaseUrl = () => {
    // Always use environment variable if available
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL
    }

    // Fallback for development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000'
    }

    // Production fallback - update this to match your actual Render backend URL
    return 'https://model-test-backend.onrender.com'
}

const API_BASE_URL = getApiBaseUrl()

// Token storage utilities
const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token')
    }
    return null
}

const setStoredToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
    }
}

const removeStoredToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
    }
}

// API request wrapper with error handling
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    const token = getStoredToken()

    console.log(`API Request: ${options.method || 'GET'} ${url}`)
    if (token) {
        console.log(`Using token: ${token.substring(0, 20)}...`)
    }

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    }

    const config = {
        ...defaultOptions,
        ...options,
    }

    try {
        const response = await fetch(url, config)

        console.log(`API Response: ${response.status} ${response.statusText}`)

        // Handle different response types
        const contentType = response.headers.get('content-type')
        let data

        if (contentType && contentType.includes('application/json')) {
            data = await response.json()
        } else {
            data = await response.text()
        }

        if (!response.ok) {
            console.error(`API Error Response:`, data)
            // If 401, clear stored token
            if (response.status === 401) {
                console.log('Clearing stored token due to 401')
                removeStoredToken()
            }
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        console.log(`API Success:`, data)
        return { data, response }
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error)
        console.error(`API Base URL: ${API_BASE_URL}`)
        console.error(`Full URL: ${url}`)
        throw error
    }
}

// Export token utilities
export { getStoredToken, setStoredToken, removeStoredToken }

// Auth API endpoints
export const authAPI = {
    // Register new user
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
    },

    // Login user
    login: async (credentials) => {
        const result = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })

        // Store token if provided in response (for cross-origin issues)
        if (result.data.token) {
            setStoredToken(result.data.token)
        }

        return result
    },

    // Logout user
    logout: async () => {
        const result = await apiRequest('/auth/logout', {
            method: 'POST',
        })

        // Clear stored token on logout
        removeStoredToken()

        return result
    },

    // Get current user
    me: async () => {
        return apiRequest('/auth/me')
    },

    // Forgot password
    forgotPassword: async (email) => {
        return apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        return apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        })
    },

    // Google OAuth URL
    googleAuth: () => `${API_BASE_URL}/auth/google`,
}

// Notes API endpoints
export const notesAPI = {
    // Get all notes with filters
    getNotes: async (params = {}) => {
        const searchParams = new URLSearchParams(params)
        return apiRequest(`/notes?${searchParams}`)
    },

    // Get single note
    getNote: async (id) => {
        return apiRequest(`/notes/${id}`)
    },

    // Create new note
    createNote: async (noteData) => {
        return apiRequest('/notes', {
            method: 'POST',
            body: JSON.stringify(noteData),
        })
    },

    // Update note
    updateNote: async (id, noteData) => {
        return apiRequest(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(noteData),
        })
    },

    // Delete note
    deleteNote: async (id) => {
        return apiRequest(`/notes/${id}`, {
            method: 'DELETE',
        })
    },

    // Auto-save note
    autoSaveNote: async (id, noteData) => {
        return apiRequest(`/notes/${id}/autosave`, {
            method: 'POST',
            body: JSON.stringify(noteData),
        })
    },

    // Get public notes
    getPublicNotes: async (params = {}) => {
        const searchParams = new URLSearchParams(params)
        return apiRequest(`/notes/public?${searchParams}`)
    },
}

// User API endpoints
export const userAPI = {
    // Get user statistics
    getStats: async () => {
        return apiRequest('/stats')
    },

    // Get feature status
    getFeatures: async () => {
        return apiRequest('/features')
    },
}

export default {
    authAPI,
    notesAPI,
    userAPI,
    apiRequest,
}