'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconDownload, IconArrowRight, IconInfo } from '@/components/icons'

export default function LongitudinalPage() {
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('complete')

  useEffect(() => {
    fetch('/api/admin/participants')
      .then(r => r.json())
      .then(setParticipants)
      .finally(() => setLoading(false))
  }, [])

  const filtered = participants.filter(p => {
    if (filter === 'complete') return p.hasSus && p.hasUeq && p.hasUat
    return true
  })

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  const UEQ_DIMS = ['ueqAttractiveness', 'ueqPerspicuity', 'ueqEfficiency', 'ueqDependability', 'ueqStimulation', 'ueqNovelty']
  const UEQ_LABELS = ['Att', 'Per', 'Eff', 'Dep', 'Sti', 'Nov']

  return (
    <div className="admin-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Dataset Longitudinal</h1>
          <p className="page-subtitle">Perbandingan individual hasil evaluasi lintas 3 tahapan (SUS → UEQ → UAT)</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Excel
        </Link>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        <IconInfo size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          Masing-masing instrumen menggunakan skala yang berbeda (SUS: 0–100, UEQ: -3 s.d. +3, UAT: persentase keberhasilan). Matriks ini memetakan konsistensi dan perkembangan pengalaman pengguna per individu.
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => setFilter('complete')}
          className={`btn btn-sm ${filter === 'complete' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Selesai 3 Tahap ({participants.filter(p => p.hasSus && p.hasUeq && p.hasUat).length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Semua Responden ({participants.length})
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th style={{ textAlign: 'center' }}>SUS Score</th>
                {UEQ_LABELS.map(l => (
                  <th key={l} style={{ textAlign: 'center' }}>UEQ {l}</th>
                ))}
                <th style={{ textAlign: 'center' }}>UAT Rate</th>
                <th style={{ textAlign: 'center' }}>UAT Acc</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/peserta/${p.id}`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {p.participantCode}
                    </Link>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>
                    {p.susScore !== null ? p.susScore.toFixed(1) : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                  </td>
                  {UEQ_DIMS.map(dim => {
                    const val = p[dim] as number | null
                    return (
                      <td key={dim} style={{ textAlign: 'center', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {val !== null && val !== undefined ? (
                          <span style={{ color: val >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {val >= 0 ? '+' : ''}{val.toFixed(2)}
                          </span>
                        ) : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                      </td>
                    )
                  })}
                  <td style={{ textAlign: 'center', fontWeight: 700, color: p.uatSuccessRate !== null ? 'var(--success)' : 'inherit' }}>
                    {p.uatSuccessRate !== null ? `${p.uatSuccessRate.toFixed(0)}%` : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>
                    {p.uatAcceptanceMean !== null ? `${p.uatAcceptanceMean.toFixed(2)}` : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge ${p.overallStatus === 'Selesai' ? 'badge-success' : p.overallStatus === 'Sebagian' ? 'badge-warning' : 'badge-neutral'}`}>
                      {p.overallStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            Belum ada responden yang menyelesaikan seluruh 3 tahapan.
          </div>
        )}
      </div>
    </div>
  )
}
