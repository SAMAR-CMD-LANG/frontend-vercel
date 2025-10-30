'use client'

import { useRouter } from 'next/navigation'
import Icons from './Icons'
import ThemeToggle from './ThemeToggle'

export default function DashboardSidebar({
    user,
    sidebarOpen,
    setSidebarOpen,
    activeSection = 'notes'
}) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const { getApiBaseUrl } = await import('../lib/api')
            await fetch(`${getApiBaseUrl()}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const navigationItems = [
        {
            id: 'notes',
            label: 'All Notes',
            icon: Icons.Notes,
            href: '/dashboard',
            color: 'blue'
        },
        {
            id: 'drafts',
            label: 'Drafts',
            icon: Icons.Drafts,
            href: '/dashboard/drafts',
            color: 'yellow'
        },
        {
            id: 'labels',
            label: 'Labels',
            icon: Icons.Labels,
            href: '/dashboard/labels',
            color: 'purple'
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: Icons.Profile,
            href: '/dashboard/profile',
            color: 'green'
        }
    ]

    const getActiveClasses = (itemId, color) => {
        if (activeSection === itemId) {
            return `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`
        }
        return 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover transition-colors'
    }

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-theme-secondary/95 backdrop-blur-md border-r border-theme-primary z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <Icons.Logo size={28} className="text-blue-500" />
                        <span className="text-xl font-bold text-theme-primary">Note.io</span>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon
                            return (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getActiveClasses(item.id, item.color)}`}
                                >
                                    <IconComponent size={20} />
                                    {item.label}
                                </a>
                            )
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="sidebar-user-section">
                    {/* Theme Toggle */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-secondary">Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="user-info-container">
                        <div className="user-avatar">
                            <span className="user-avatar-text">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <div className="user-text-info">
                            <p className="user-name">{user?.name}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="btn btn-ghost w-full justify-start text-secondary"
                    >
                        <Icons.ChevronRight size={16} className="rotate-180" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    )
}