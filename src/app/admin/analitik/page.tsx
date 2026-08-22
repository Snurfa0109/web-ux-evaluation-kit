'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconDownload, IconBarChart, IconClipboard, IconCheck } from '@/components/icons'

export default function AnalitikPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  const UEQ_DIMS = [
    { key: 'attractiveness', label: 'Attractiveness (Daya Tarik)' },
    { key: 'perspicuity', label: 'Perspicuity (Kejelasan)' },
    { key: 'efficiency', label: 'Efficiency (Efisiensi)' },
    { key: 'dependability', label: 'Dependability (Ketepatan)' },
    { key: 'stimulation', label: 'Stimulation (Stimulasi)' },
    { key: 'novelty', label: 'Novelty (Kebaruan)' },
  ]

  const susScores = data?.susDistribution || []
  const buckets = [
    { label: '0–20', min: 0, max: 20 },
    { label: '21–40', min: 21, max: 40 },
    { label: '41–60', min: 41, max: 60 },
    { label: '61–70', min: 61, max: 70 },
    { label: '71–80', min: 71, max: 80 },
    { label: '81–100', min: 81, max: 100 },
  ].map(b => ({ ...b, count: susScores.filter((s: number) => s >= b.min && s <= b.max).length }))
  const maxBucketCount = Math.max(...buckets.map(b => b.count), 1)

  return (
    <div className="admin-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Analitik Penelitian</h1>
          <p className="page-subtitle">Distribusi dan parameter statistik hasil evaluasi SUS, UEQ, dan UAT</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Data
        </Link>
      </div>

      {/* SUS Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Tahap 1 — System Usability Scale (SUS)</h3>
          <span className="badge badge-neutral">{data?.susCount} Responden</span>
        </div>
        <div className="card-body">
          {data?.susCount > 0 ? (
            <div className="grid-2">
              <div>
                <div style={{ padding: '1.25rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', marginBottom: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Skor Rata-Rata SUS
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {data.avgSus?.toFixed(1) ?? '—'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                    Skala 0 – 100
                  </div>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Rata-rata kebergunaan sistem dihitung dari 10 pernyataan terstandarisasi dengan pembobotan skala Likert baku.
                </div>
              </div>

              {/* Distribution */}
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.75rem' }}>
                  Distribusi Nilai Responden
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {buckets.map(b => (
                    <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', width: 56, textAlign: 'right', flexShrink: 0 }}>{b.label}</span>
                      <div style={{ flex: 1, background: 'var(--slate-100)', borderRadius: 'var(--radius-full)', height: 20, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--slate-800)', borderRadius: 'var(--radius-full)', width: `${(b.count / maxBucketCount) * 100}%`, minWidth: b.count > 0 ? 6 : 0 }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', width: 24 }}>{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: 0 }}>Belum ada data responden untuk instrumen SUS.</p>
          )}
        </div>
      </div>

      {/* UEQ Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Tahap 2 — User Experience Questionnaire (UEQ)</h3>
          <span className="badge badge-neutral">{data?.ueqCount} Responden</span>
        </div>
        <div className="card-body">
          {data?.ueqCount > 0 && data?.avgUeq ? (
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '1rem' }}>
                Rata-rata 6 Dimensi Pengalaman Pengguna (Skala -3 s.d. +3)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {UEQ_DIMS.map(dim => {
                  const score = data.avgUeq[dim.key] ?? 0
                  return (
                    <div key={dim.key} style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '0.375rem' }}>
                        {dim.label}
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: score >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {score >= 0 ? '+' : ''}{score.toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: 0 }}>Belum ada data responden untuk instrumen UEQ.</p>
          )}
        </div>
      </div>

      {/* UAT Card */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Tahap 3 — User Acceptance Testing (UAT)</h3>
          <span className="badge badge-neutral">{data?.uatCount} Responden</span>
        </div>
        <div className="card-body">
          {data?.uatCount > 0 ? (
            <div className="grid-2">
              <div style={{ padding: '1.25rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Task Success Rate
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>
                  {data.uatSuccessRate !== null && data.uatSuccessRate !== undefined ? `${data.uatSuccessRate.toFixed(1)}%` : '—'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                  Tingkat penyelesaian tugas berhasil
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Overall Acceptance
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {data.avgUatAcceptance !== null ? `${data.avgUatAcceptance.toFixed(2)}` : '—'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                  Rata-rata penerimaan (Skala 1 – 5)
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: 0 }}>Belum ada data responden untuk instrumen UAT.</p>
          )}
        </div>
      </div>
    </div>
  )
}
