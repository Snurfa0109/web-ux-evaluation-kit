'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { IconArrowRight, IconArrowLeft, IconLock } from '@/components/icons'

export default function MasukPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)

  // Auto-detect if user typed an email address
  const isEmail = identifier.includes('@')
  const showPasswordField = isAdminMode || isEmail

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const raw = identifier.trim()

    if (!raw) {
      setError('Mohon masukkan kode peserta atau email Anda.')
      return
    }

    setLoading(true)

    try {
      // 1. If email or admin mode -> Authenticate Admin via NextAuth
      if (showPasswordField) {
        if (!password) {
          setError('Mohon masukkan kata sandi admin.')
          setLoading(false)
          return
        }

        const res = await signIn('credentials', {
          email: raw,
          password: password,
          redirect: false,
        })

        if (res?.error) {
          throw new Error('Email atau password tidak sesuai.')
        }

        router.push('/admin/dashboard')
        return
      }

      // 2. Otherwise -> Lookup Participant Code
      const code = raw.toUpperCase()
      const res = await fetch(`/api/participant/${code}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Kode peserta tidak ditemukan.')
      }

      router.push(`/peserta/${code}`)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
          <IconArrowLeft size={16} /> Beranda
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img src="/evalux.png" alt="EvalUX Logo" style={{ height: 42, width: 'auto', margin: '0 auto 0.875rem', display: 'block', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Masuk ke Platform</h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
            Masukkan kode peserta atau akun peneliti untuk melanjutkan
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="user-identifier">
                  {showPasswordField ? 'Email Admin / Peneliti' : 'Participant Code / Identitas'}
                </label>
                <input
                  id="user-identifier"
                  className="form-input"
                  type={showPasswordField ? 'email' : 'text'}
                  placeholder={showPasswordField ? 'Masukkan email' : 'Contoh: R001'}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  style={{
                    fontFamily: !showPasswordField ? 'var(--font-mono)' : 'inherit',
                    fontSize: !showPasswordField ? '1.25rem' : '0.9375rem',
                    fontWeight: !showPasswordField ? 700 : 400,
                    letterSpacing: !showPasswordField ? '0.05em' : 'normal',
                    textAlign: !showPasswordField ? 'center' : 'left',
                    textTransform: !showPasswordField && !isEmail ? 'uppercase' : 'none',
                    padding: '0.75rem',
                  }}
                  autoComplete="off"
                  autoFocus
                  required
                />
                {!showPasswordField && (
                  <p className="form-hint" style={{ textAlign: 'center' }}>
                    Peserta: masukkan kode yang didapat saat mendaftar (misal: R001)
                  </p>
                )}
              </div>

              {/* Password field - automatically appears if email or admin mode */}
              {showPasswordField && (
                <div className="form-group fade-in">
                  <label className="form-label" htmlFor="user-password">
                    Kata Sandi
                  </label>
                  <input
                    id="user-password"
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              )}

              {error && (
                <div className="alert alert-danger" style={{ padding: '0.625rem 0.875rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg btn-full" id="btn-login-submit" disabled={loading}>
                {loading ? (
                  <><span className="loading-spinner"></span> Memverifikasi...</>
                ) : (
                  <>Masuk <IconArrowRight size={16} /></>
                )}
              </button>

              {/* Mode switch helper */}
              <div style={{ textAlign: 'center', paddingTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(!isAdminMode)
                    setError('')
                    if (!isAdminMode && !identifier.includes('@')) {
                      setIdentifier('')
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    color: 'var(--slate-400)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {isAdminMode ? '← Masuk sebagai Responden (Gunakan Kode)' : 'Masuk sebagai Peneliti / Administrator'}
                </button>
              </div>
            </form>
          </div>

          <div className="card-footer" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', margin: 0 }}>
              Belum terdaftar sebagai responden?{' '}
              <Link href="/daftar" style={{ color: 'var(--slate-900)', fontWeight: 600 }}>Daftar di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
