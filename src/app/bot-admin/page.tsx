'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconRepeat, IconBarChart, IconDownload, IconCheck, IconTrash, IconInfo, IconLogOut, IconShield } from '@/components/icons'

export default function BotAdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState('10')
  const [tendency, setTendency] = useState('HIGH')
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/bot-admin/login')
      .then(r => {
        if (!r.ok) throw new Error('Unauthenticated')
        return r.json()
      })
      .then(() => setLoading(false))
      .catch(() => router.push('/bot-admin/login'))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/bot-admin/login', { method: 'DELETE' })
    router.push('/bot-admin/login')
  }

  const handleRunBot = async (e: React.FormEvent) => {
    e.preventDefault()
    setRunning(true)
    setMessage('')
    setLogs([])

    try {
      const res = await fetch('/api/admin/bot-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: parseInt(count, 10), tendency }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menjalankan bot')

      setLogs(data.logs || [])
      setMessage(`Berhasil meregenerasi ${data.createdCount} responden bot! Seluruh kuesioner (SUS, UEQ, UAT) terisi otomatis.`)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setRunning(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Standalone Topbar */}
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.875rem 0', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconRepeat size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--slate-900)' }}>Portal Bot Simulator</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Terpisah dari Dashboard Peneliti Utama</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', background: 'var(--slate-100)', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)' }}>
              botadmin@disnakertrans-research.id
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <IconLogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 className="page-title">Dashboard Pengelola Bot Responden</h1>
            <p className="page-subtitle">Panel instan terpisah untuk mensimulasikan data pengisian kuesioner responden bot</p>
          </div>

          {message && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              {message}
            </div>
          )}

          <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'flex-start' }}>
            {/* Form Control Card */}
            <form onSubmit={handleRunBot} className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconRepeat size={16} /> Panel Pengatur Simulasi Bot
                </h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="inp-count">
                    Jumlah Responden Bot <span className="required">*</span>
                  </label>
                  <select
                    id="inp-count"
                    className="form-select"
                    value={count}
                    onChange={e => setCount(e.target.value)}
                  >
                    <option value="1">1 Responden Bot</option>
                    <option value="5">5 Responden Bot</option>
                    <option value="10">10 Responden Bot (Standar)</option>
                    <option value="15">15 Responden Bot (Lengkap 3 Phase)</option>
                    <option value="30">30 Responden Bot (Target Riset Penuh)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="inp-tendency">
                    Kecenderungan Nilai (*Usability Tendency*) <span className="required">*</span>
                  </label>
                  <select
                    id="inp-tendency"
                    className="form-select"
                    value={tendency}
                    onChange={e => setTendency(e.target.value)}
                  >
                    <option value="HIGH">Tinggi / Positif (Skor SUS ~75-85)</option>
                    <option value="EXCELLENT">Sangat Tinggi / Excellent (Skor SUS &gt;85)</option>
                    <option value="MIXED">Bervariasi / Mixed (Realistis Gabungan)</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={running}
                    className="btn btn-primary btn-lg btn-full"
                    style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-full)', background: '#2563eb' }}
                  >
                    {running ? 'Sedang Mengisi Data Bot...' : 'Jalankan Bot Responden Otomatis'}
                  </button>
                </div>
              </div>
            </form>

            {/* Live Terminal Log */}
            <div className="card" style={{ background: '#0f172a', color: '#f8fafc', minHeight: 320, display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ borderBottom: '1px solid #1e293b', background: '#1e293b', padding: '0.75rem 1rem' }}>
                <h3 style={{ fontSize: '0.875rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)', margin: 0 }}>
                  Live Terminal Bot Activity Logs
                </h3>
              </div>
              <div className="card-body" style={{ padding: '1rem', flex: 1, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                {running && (
                  <div style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>
                    ⚡ Memproses pembuatan responden bot & pengisian instrumen...
                  </div>
                )}

                {logs.map((log, i) => (
                  <div key={i} style={{ color: '#4ade80', marginBottom: '0.375rem' }}>
                    {log}
                  </div>
                ))}

                {!running && logs.length === 0 && (
                  <div style={{ color: '#64748b' }}>
                    Klik tombol "Jalankan Bot Responden Otomatis" untuk mengamati proses simulasi bot di sini secara langsung.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <IconInfo size={18} style={{ flexShrink: 0, marginTop: 2, color: '#2563eb' }} />
            <div style={{ fontSize: '0.8125rem' }}>
              <strong>Portal Terpisah:</strong> Halaman ini beroperasi pada akun &amp; portal terpisah khusus simulasi bot. Dashboard peneliti utama (`sitinurfadiyah74@gmail.com`) tetap bersih dan independen.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
