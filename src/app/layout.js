import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata = {
  title: 'Note.io - Professional Note Taking',
  description: 'Secure, encrypted note-taking application with advanced features',
  keywords: 'notes, productivity, encryption, secure, professional',
  authors: [{ name: 'Note.io Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div id="root">
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '8px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}