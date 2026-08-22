'use client'

import { SessionProvider, useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconHome,
  IconLayers,
  IconUsers,
  IconBarChart,
  IconClipboard,
  IconCheck,
  IconRepeat,
  IconDownload,
  IconSettings,
  IconLogOut,
  IconShield,
  IconExternalLink,
  IconMessageSquare,
} from '@/components/icons'

const NAV_ITEMS = [
  { section: 'Utama' },
  { href: '/admin/dashboard', icon: IconHome, label: 'Dashboard' },
  { href: '/admin/fase', icon: IconLayers, label: 'Kelola Phase' },
  { section: 'Responden' },
  { href: '/admin/peserta', icon: IconUsers, label: 'Data Peserta' },
  { section: 'Instrumen' },
  { href: '/admin/data/sus', icon: IconClipboard, label: 'Data SUS' },
  { href: '/admin/data/ueq', icon: IconBarChart, label: 'Data UEQ' },
  { href: '/admin/data/uat', icon: IconCheck, label: 'Data UAT' },
  { href: '/admin/feedback', icon: IconMessageSquare, label: 'Feedback Responden' },
  { section: 'Analisis' },
  { href: '/admin/analitik', icon: IconBarChart, label: 'Analitik' },
  { href: '/admin/longitudinal', icon: IconRepeat, label: 'Longitudinal' },
  { href: '/admin/simulator', icon: IconRepeat, label: 'Simulator Bot' },
  { section: 'Sistem' },
  { href: '/admin/ekspor', icon: IconDownload, label: 'Ekspor Excel' },
  { href: '/admin/pengaturan', icon: IconSettings, label: 'Pengaturan' },
]


function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [status, router, pathname])

  // Allow login page to render standalone
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
        <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', background: 'var(--slate-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
              <IconShield size={16} />
            </div>
            <div>
              <div className="logo-title">Admin Panel</div>
              <div className="logo-subtitle">Evaluasi Disnakertrans</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item, idx) => {
            if ('section' in item && !item.href) {
              return <div key={idx} className="sidebar-section-label">{item.section}</div>
            }
            const Icon = item.icon!
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href!))
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User / Logout */}
        <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', flexShrink: 0 }}>
              AD
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.user?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Peneliti</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: 4 }}
            title="Keluar"
            id="btn-admin-logout"
          >
            <IconLogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            className="mobile-menu-btn"
            id="btn-toggle-sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>

          <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Research Evaluation Platform
          </div>

          <Link href="/" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--slate-600)', fontWeight: 500 }}>
            <span>Halaman Peserta</span>
            <IconExternalLink size={13} />
          </Link>
        </div>

        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  )
}
