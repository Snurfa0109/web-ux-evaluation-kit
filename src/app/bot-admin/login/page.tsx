'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconRepeat, IconLock, IconArrowRight } from '@/components/icons'

export default function BotAdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('botadmin@disnakertrans-research.id')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/bot-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal login')

      router.push('/bot-admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
          <IconArrowLeft size={16} /> Beranda
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: '#2563eb', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <IconRepeat size={22} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Portal Bot Simulator</h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
            Login akun terpisah khusus pengelola Simulator Bot Responden
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="bot-email">
                  Email Akun Bot Administrator
                </label>
                <input
                  id="bot-email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="botadmin@disnakertrans-research.id"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bot-password">
                  Kata Sandi Bot Admin
                </label>
                <input
                  id="bot-password"
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="alert alert-danger" style={{ padding: '0.625rem 0.875rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ borderRadius: 'var(--radius-full)' }}>
                {loading ? 'Memverifikasi Akun Bot...' : <>Masuk ke Bot Simulator <IconArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
          Kredensial Default: <br />
          Email: <strong style={{ fontFamily: 'var(--font-mono)' }}>botadmin@disnakertrans-research.id</strong><br />
          Password: <strong style={{ fontFamily: 'var(--font-mono)' }}>BotAdmin123!</strong>
        </div>
      </div>
    </div>
  )
}
