'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconDownload } from '@/components/icons'
import { getUeqBenchmark, UeqDimension } from '@/lib/ueq-instrument'

export default function AnalitikPage() {
  const [data, setData] = useState<any>(null)
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

  const ueqDims = [
    { key: 'attractiveness', label: 'Attractiveness (Daya Tarik)' },
    { key: 'perspicuity', label: 'Perspicuity (Kejelasan)' },
    { key: 'efficiency', label: 'Efficiency (Efisiensi)' },
    { key: 'dependability', label: 'Dependability (Ketepatan)' },
    { key: 'stimulation', label: 'Stimulation (Stimulasi)' },
    { key: 'novelty', label: 'Novelty (Kebaruan)' },
  ]

  return (
    <div className="admin-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Analitik Evaluasi UX</h1>
          <p className="page-subtitle">Statistik komprehensif instrumen SUS, UEQ, dan UAT</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Data Excel
        </Link>
      </div>

      {/* SUS Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Tahap 1 — System Usability Scale (SUS)</h3>
          <span className="badge badge-neutral">{data?.susCount ?? 0} Responden</span>
        </div>
        <div className="card-body">
          {data?.susCount > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '1.25rem 1.5rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center', minWidth: 160 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Skor Rata-rata SUS
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {data?.avgSus ? data.avgSus.toFixed(1) : '—'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    dari skala 0 — 100
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                    Interpretasi Skor SUS:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem' }}>
                    <div>Grade Scale: <strong style={{ color: (data?.avgSus ?? 0) >= 80.3 ? 'var(--success)' : (data?.avgSus ?? 0) >= 68 ? 'var(--accent)' : 'var(--danger)' }}>
                      {(data?.avgSus ?? 0) >= 80.3 ? 'A (Excellent)' : (data?.avgSus ?? 0) >= 68 ? 'C/B (Good)' : 'F (Poor)'}
                    </strong></div>
                    <div>Acceptability Range: <strong>{(data?.avgSus ?? 0) >= 70 ? 'Acceptable' : 'Marginal / Unacceptable'}</strong></div>
                    <div>Adjective Rating: <strong>{(data?.avgSus ?? 0) >= 85 ? 'Best Imaginable' : (data?.avgSus ?? 0) >= 72 ? 'Good' : (data?.avgSus ?? 0) >= 52 ? 'OK' : 'Poor'}</strong></div>
                  </div>
                </div>
              </div>

              {/* Distribution Bar */}
              {data?.susDistribution && (
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                    Distribusi Skor SUS Responden:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                    {[
                      { label: '< 51 (Poor)', count: data.susDistribution[0] ?? 0, color: 'var(--danger-light)', border: 'var(--danger-border)' },
                      { label: '51–67 (OK)', count: data.susDistribution[1] ?? 0, color: 'var(--warning-light)', border: 'var(--warning-border)' },
                      { label: '68–80 (Good)', count: data.susDistribution[2] ?? 0, color: 'var(--accent-light)', border: 'var(--accent-border)' },
                      { label: '> 80 (Excellent)', count: data.susDistribution[3] ?? 0, color: 'var(--success-light)', border: 'var(--success-border)' },
                    ].map(dist => (
                      <div key={dist.label} style={{ padding: '0.625rem', background: dist.color, border: `1px solid ${dist.border}`, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-700)', fontWeight: 500 }}>{dist.label}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>{dist.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: 0 }}>Belum ada data responden untuk instrumen SUS.</p>
          )}
        </div>
      </div>

      {/* UEQ Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Tahap 2 — User Experience Questionnaire (UEQ)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Benchmark Resmi Schrepp Data Analysis Standards</span>
          </div>
          <span className="badge badge-accent">{data?.ueqCount ?? 0} Responden</span>
        </div>
        <div className="card-body">
          {data?.ueqCount > 0 && data?.avgUeq ? (
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
                Nilai skala berada dalam rentang -3.00 (Sangat Buruk) hingga +3.00 (Sangat Baik). Kategori benchmark di bawah dihitung otomatis berdasarkan baku riset UEQ internasional (Schrepp):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                {ueqDims.map(dim => {
                  const score = data.avgUeq[dim.key] ?? 0
                  const benchmark = getUeqBenchmark(dim.key as UeqDimension, score)
                  return (
                    <div key={dim.key} style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '0.25rem' }}>
                        {dim.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <div style={{ fontSize: '1.375rem', fontWeight: 800, color: score >= 0 ? 'var(--slate-900)' : 'var(--danger)' }}>
                          {score >= 0 ? '+' : ''}{score.toFixed(2)}
                        </div>
                        <span className={`badge ${benchmark.badge}`} style={{ fontSize: '0.6875rem' }}>
                          {benchmark.label}
                        </span>
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
          <span className="badge badge-neutral">{data?.uatCount ?? 0} Responden</span>
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
