// Professional SVG Icons for Note.io

export const Icons = {
    // Logo and Branding
    Logo: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <polyline
                points="14,2 14,8 20,8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                x1="16"
                y1="13"
                x2="8"
                y2="13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="16"
                y1="17"
                x2="8"
                y2="17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <polyline
                points="10,9 9,9 8,9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    // Navigation Icons
    Home: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <polyline
                points="9,22 9,12 15,12 15,22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Notes: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <polyline
                points="14,2 14,8 20,8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Drafts: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Labels: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                x1="7"
                y1="7"
                x2="7.01"
                y2="7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Profile: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    // Action Icons
    Plus: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    ),

    Search: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="m21 21-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Filter: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polygon
                points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Sort: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 6h18M7 12h10m-7 6h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    // UI Icons
    Menu: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="3"
                y1="18"
                x2="21"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    ),

    Close: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    ),

    ChevronDown: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polyline
                points="6,9 12,15 18,9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    ChevronRight: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polyline
                points="9,18 15,12 9,6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    // Security Icons
    Lock: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="16"
                r="1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Shield: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    // Status Icons
    Check: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polyline
                points="20,6 9,17 4,12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Star: ({ size = 24, className = "", filled = false }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    // Theme Icons
    Sun: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                x1="12"
                y1="1"
                x2="12"
                y2="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="12"
                y1="21"
                x2="12"
                y2="23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="4.22"
                y1="4.22"
                x2="5.64"
                y2="5.64"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="18.36"
                y1="18.36"
                x2="19.78"
                y2="19.78"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="1"
                y1="12"
                x2="3"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="21"
                y1="12"
                x2="23"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="4.22"
                y1="19.78"
                x2="5.64"
                y2="18.36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1="18.36"
                y1="5.64"
                x2="19.78"
                y2="4.22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    ),

    Moon: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    // Additional Icons for Create Note Page
    Edit: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Priority: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Globe: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                x1="2"
                y1="12"
                x2="22"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Lightbulb: ({ size = 24, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9 21h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 17c-3.31 0-6-2.69-6-6 0-3.31 2.69-6 6-6s6 2.69 6 6c0 3.31-2.69 6-6 6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 1v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M22 12h-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4 12H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20.49 4.64l-1.42 1.42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.93 4.93l1.42 1.42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
}

export default Icons