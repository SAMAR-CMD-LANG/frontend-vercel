'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Icons from '../components/Icons'
import ThemeToggle from '../components/ThemeToggle'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: <Icons.Shield size={32} />,
      title: "End-to-End Encryption",
      description: "Your notes are encrypted client-side before being stored, ensuring complete privacy and security."
    },
    {
      icon: <Icons.Notes size={32} />,
      title: "Rich Note Taking",
      description: "Create, organize, and manage your notes with powerful editing tools and intuitive interface."
    },
    {
      icon: <Icons.Search size={32} />,
      title: "Advanced Search",
      description: "Find any note instantly with full-text search, filters, and smart categorization."
    },
    {
      icon: <Icons.Labels size={32} />,
      title: "Smart Organization",
      description: "Organize notes with categories, labels, and priority levels for efficient workflow."
    }
  ]

  const stats = [
    { number: "256-bit", label: "AES Encryption" },
    { number: "99.9%", label: "Uptime" },
    { number: "< 100ms", label: "Response Time" },
    { number: "GDPR", label: "Compliant" }
  ]

  return (
    <div className="hero-section">
      {/* Navigation */}
      <nav className="nav-blur nav-container">
        <div className="container nav-content">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icons.Logo size={32} className="text-accent" />
              <span className="text-2xl font-bold text-primary">Note.io</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ThemeToggle />
              <a href="/login" className="btn btn-ghost">Sign In</a>
              <a href="/register" className="btn btn-primary">Get Started</a>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-container">
        <div className="container-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              <span className="hero-gradient-text">
                Secure Note Taking
              </span>
              <br />
              <span className="text-accent">Reimagined</span>
            </h1>

            <p className="hero-subtitle">
              Experience the future of note-taking with military-grade encryption,
              intelligent organization, and seamless synchronization across all your devices.
            </p>

            <div className="hero-cta-container">
              <a href="/register" className="btn btn-primary btn-lg">
                <Icons.Plus size={20} />
                Start Taking Notes
              </a>
              <a href="#features" className="btn btn-secondary btn-lg">
                <Icons.ChevronDown size={20} />
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-primary">
              Everything You Need
            </h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Powerful features designed for professionals who demand security,
              efficiency, and reliability in their note-taking workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-accent mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section">
        <div className="container-center">
          <div className="security-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="security-title">
                Security First
                <br />
                <span className="text-accent">Always</span>
              </h2>
              <p className="security-description">
                Your privacy is our priority. Every note is encrypted with AES-256
                encryption before leaving your device. We can't read your notes,
                and neither can anyone else.
              </p>

              <div className="security-features">
                <div className="security-feature">
                  <Icons.Check size={20} className="text-success" />
                  <span className="security-feature-text">Client-side encryption</span>
                </div>
                <div className="security-feature">
                  <Icons.Check size={20} className="text-success" />
                  <span className="security-feature-text">Zero-knowledge architecture</span>
                </div>
                <div className="security-feature">
                  <Icons.Check size={20} className="text-success" />
                  <span className="security-feature-text">GDPR compliant</span>
                </div>
                <div className="security-feature">
                  <Icons.Check size={20} className="text-success" />
                  <span className="security-feature-text">Regular security audits</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="encryption-card">
                <div className="flex items-center gap-3 mb-6">
                  <Icons.Lock size={24} className="text-accent" />
                  <span className="text-primary font-semibold">Encryption Process</span>
                </div>

                <div className="space-y-4">
                  <div className="process-step">
                    <div className="process-indicator process-indicator-green"></div>
                    <span className="text-secondary text-sm">Note created locally</span>
                  </div>
                  <div className="process-step">
                    <div className="process-indicator process-indicator-yellow"></div>
                    <span className="text-secondary text-sm">AES-256 encryption applied</span>
                  </div>
                  <div className="process-step">
                    <div className="process-indicator process-indicator-blue"></div>
                    <span className="text-secondary text-sm">Encrypted data transmitted</span>
                  </div>
                  <div className="process-step">
                    <div className="process-indicator process-indicator-purple"></div>
                    <span className="text-secondary text-sm">Stored securely in database</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding">
        <div className="container-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-primary">
              Ready to Get Started?
            </h2>
            <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust Note.io for their
              secure note-taking needs. Start your free account today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn btn-primary btn-lg">
                <Icons.Plus size={20} />
                Create Free Account
              </a>
              <a href="/login" className="btn btn-secondary btn-lg">
                <Icons.Profile size={20} />
                Sign In
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container-center">
          <div className="footer-content">
            <div className="footer-brand">
              <Icons.Logo size={24} className="text-accent" />
              <span className="text-lg font-semibold text-primary">Note.io</span>
            </div>

            <div className="footer-links">
              <a href="/privacy" className="footer-link">Privacy</a>
              <a href="/terms" className="footer-link">Terms</a>
              <a href="/security" className="footer-link">Security</a>
              <a href="/contact" className="footer-link">Contact</a>
            </div>
          </div>

          <div className="footer-copyright">
            <p>&copy; 2025 Note.io. All rights reserved. Built with security and privacy in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}