'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconRepeat, IconBarChart, IconDownload, IconCheck, IconTrash, IconInfo } from '@/components/icons'

export default function BotSimulatorPage() {
  const [count, setCount] = useState('5')
  const [tendency, setTendency] = useState('HIGH')
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [message, setMessage] = useState('')

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

  return (
    <div className="admin-content fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Simulator Bot Responden</h1>
        <p className="page-subtitle">Panel instan untuk mensimulasikan data responden dummy untuk pengetesan analitik & demo</p>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'flex-start' }}>
        {/* Form Card */}
        <form onSubmit={handleRunBot} className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconRepeat size={16} /> Panel Pengatur Bot Responden
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
                <option value="1">1 Responden</option>
                <option value="5">5 Responden (Rekomendasi Quick Test)</option>
                <option value="10">10 Responden</option>
                <option value="15">15 Responden (Lengkap 3 Phase)</option>
                <option value="30">30 Responden (Target Riset Penuh)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inp-tendency">
                Kecenderungan Nilai (Usability Tendency) <span className="required">*</span>
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
                style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-full)' }}
              >
                {running ? 'Sedang Mengisi Data Bot...' : 'Jalankan Bot Responden Otomatis'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link href="/admin/analitik" className="btn btn-secondary btn-sm style-full" style={{ flex: 1, textAlign: 'center' }}>
                <IconBarChart size={14} /> Lihat Analitik
              </Link>
              <Link href="/admin/ekspor" className="btn btn-secondary btn-sm style-full" style={{ flex: 1, textAlign: 'center' }}>
                <IconDownload size={14} /> Ekspor Excel
              </Link>
            </div>
          </div>
        </form>

        {/* Live Terminal Log View */}
        <div className="card" style={{ background: '#0f172a', color: '#f8fafc', minHeight: 320, display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ borderBottom: '1px solid #1e293b', background: '#1e293b', padding: '0.75rem 1rem' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Live Terminal Bot Logs</span>
            </h3>
          </div>
          <div className="card-body" style={{ padding: '1rem', flex: 1, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
            {running && (
              <div style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>
                ⚡ Sedang memproses pembuatan responden & pengisian instrumen...
              </div>
            )}

            {logs.map((log, i) => (
              <div key={i} style={{ color: '#4ade80', marginBottom: '0.375rem' }}>
                {log}
              </div>
            ))}

            {!running && logs.length === 0 && (
              <div style={{ color: '#64748b' }}>
                Klik tombol "Jalankan Bot Responden Otomatis" di sebelah kiri untuk melihat log aktivitas pengisian bot secara langsung di sini.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <IconInfo size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Informasi Simulator:</strong> Bot ini mengisi data langsung ke database secara instan untuk kebutuhan simulasi tampilan dashboard, grafik analitik, dan format ekspor file Excel. Data uji coba ini dapat dikosongkan kapan saja melalui menu <em>Pengaturan → Reset Data</em> saat penelitian asli dimulai.
        </div>
      </div>
    </div>
  )
}
