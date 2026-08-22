'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconUsers, IconClipboard, IconBarChart, IconCheck, IconArrowRight, IconDownload, IconLayers } from '@/components/icons'

interface AnalyticsData {
  totalParticipants: number
  susCount: number
  ueqCount: number
  uatCount: number
  completedAll: number
  avgSus: number | null
  avgUeq: any
  avgUatAcceptance: number | null
  uatSuccessRate: number | null
  phases: any[]
  susDistribution: number[]
}

const PHASE_STATUS_MAP: Record<string, { label: string; badge: string }> = {
  DRAFT:     { label: 'Draft',     badge: 'badge-neutral' },
  SCHEDULED: { label: 'Terjadwal', badge: 'badge-warning' },
  ACTIVE:    { label: 'Aktif',     badge: 'badge-success' },
  CLOSED:    { label: 'Selesai',   badge: 'badge-danger' },
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  return (
    <div className="admin-content fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Dashboard Penelitian</h1>
          <p className="page-subtitle">Ringkasan progres evaluasi UX website Disnakertrans Kabupaten Serang</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
            <IconDownload size={14} /> Ekspor Data
          </Link>
          <Link href="/admin/fase" className="btn btn-primary btn-sm">
            <IconLayers size={14} /> Kelola Tahap
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metric-grid" style={{ marginBottom: '1.75rem' }}>
        <div className="metric-card">
          <div className="metric-label">Total Responden</div>
          <div className="metric-value">{data?.totalParticipants ?? 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Terdaftar di sistem</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Respon SUS (P1)</div>
          <div className="metric-value">{data?.susCount ?? 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Website Existing</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Respon UEQ (P2)</div>
          <div className="metric-value">{data?.ueqCount ?? 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Prototype Redesign</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Respon UAT (P3)</div>
          <div className="metric-value">{data?.uatCount ?? 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Website Final</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Selesai 3 Tahap</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>{data?.completedAll ?? 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Lengkap longitudinal</div>
        </div>
      </div>

      {/* Registration Share & QR Code Card */}
      <div className="card" style={{ marginBottom: '1.75rem', background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'var(--white)' }}>

        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span className="badge badge-accent" style={{ marginBottom: '0.5rem', background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', borderColor: '#3b82f6' }}>
              Link Pendaftaran Responden (Go-Live)
            </span>
            <h3 style={{ fontSize: '1.125rem', color: 'var(--white)', marginBottom: '0.375rem' }}>
              Sebarkan Link atau QR Code Pengujian
            </h3>
            <p style={{ fontSize: '0.84375rem', color: 'var(--slate-300)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Responden cukup men-scan QR Code di samping menggunakan smartphone atau mengklik link pendaftaran untuk langsung mengisi data diri dan memulai pengujian.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/daftar`
                  navigator.clipboard.writeText(url)
                  alert('Link Pendaftaran berhasil disalin ke clipboard:\n' + url)
                }}
                className="btn btn-sm"
                style={{ background: 'var(--white)', color: 'var(--slate-900)', fontWeight: 700 }}
              >
                Salin Link Pendaftaran
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/daftar`
                  const text = `Halo! Mohon kesediaan Anda untuk berpartisipasi dalam evaluasi pelayanan digital website Disnakertrans Kabupaten Serang melalui link resmi berikut:\n\n${url}\n\nTerima kasih atas bantuan dan masukan Anda!`
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
                }}
                className="btn btn-sm"
                style={{ background: '#25D366', color: 'var(--white)', fontWeight: 700, border: 'none' }}
              >
                Bagikan via WhatsApp
              </button>
            </div>
          </div>
          <div style={{ background: 'var(--white)', padding: '0.625rem', borderRadius: 'var(--radius-md)', textAlign: 'center', flexShrink: 0 }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/daftar` : 'https://disnakertrans.serangkab.go.id')}`}
              alt="QR Code Pendaftaran"
              style={{ width: 130, height: 130, display: 'block' }}
            />
            <span style={{ fontSize: '0.6875rem', color: 'var(--slate-600)', fontWeight: 600, marginTop: '0.25rem', display: 'block' }}>Scan untuk Daftar</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Phase Status + Score Summary */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>

        {/* Phase Status */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>Status Tahapan Penelitian</h3>
            <Link href="/admin/fase" className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              Detail →
            </Link>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data?.phases.map(phase => {
              const statusCfg = PHASE_STATUS_MAP[phase.status] || PHASE_STATUS_MAP.DRAFT
              return (
                <div key={phase.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                      Tahap 0{phase.phaseNumber} — {phase.phaseName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      Instrumen: {phase.instrument}
                    </div>
                  </div>
                  <span className={`badge ${statusCfg.badge}`}>
                    {statusCfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Score Summary */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>Ringkasan Hasil Evaluasi</h3>
            <Link href="/admin/analitik" className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              Analitik Lengkap →
            </Link>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* SUS */}
            <div style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>Skor Rata-rata SUS (0–100)</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {data?.avgSus ? data.avgSus.toFixed(1) : '—'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {data?.susCount} responden
              </div>
            </div>

            {/* UEQ */}
            <div style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                Rata-rata Dimensi UEQ (-3 s.d. +3)
              </div>
              {data?.avgUeq ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem' }}>
                  {Object.entries(data.avgUeq).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-500)', textTransform: 'capitalize' }}>{key.slice(0, 3)}:</span>
                      <span style={{ fontWeight: 700, color: (val as number) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {(val as number) >= 0 ? '+' : ''}{(val as number).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Belum ada data UEQ</span>
              )}
            </div>

            {/* UAT */}
            <div style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>UAT Task Success Rate</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                  {data?.uatSuccessRate !== null && data?.uatSuccessRate !== undefined ? `${data.uatSuccessRate.toFixed(1)}%` : '—'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                Overall Acceptance Mean: {data?.avgUatAcceptance?.toFixed(2) ?? '—'} / 5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
