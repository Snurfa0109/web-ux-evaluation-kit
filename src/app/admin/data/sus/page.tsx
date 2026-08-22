'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconDownload, IconArrowRight, IconTrash } from '@/components/icons'

interface ParticipantWithSus {
  id: number
  participantCode: string
  name: string
  hasSus: boolean
  susScore: number | null
  susCompletedAt?: string
}

export default function SusDataPage() {
  const [responses, setResponses] = useState<ParticipantWithSus[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/admin/participants')
      .then(r => r.json())
      .then((participants: ParticipantWithSus[]) => {
        const data = participants.filter(p => p.hasSus)
        setResponses(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteSus = async (p: ParticipantWithSus) => {
    if (!confirm(`Hapus kuesioner SUS dari ${p.name} (${p.participantCode})?`)) return
    try {
      const res = await fetch(`/api/admin/participants/${p.id}?type=sus`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        alert(`Gagal menghapus: ${err.error}`)
      } else {
        fetchData()
      }
    } catch {
      alert('Gagal menghapus kuesioner SUS')
    }
  }

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  const scores = responses.map(p => p.susScore || 0)
  const avgSus = responses.length > 0
    ? scores.reduce((a, b) => a + b, 0) / responses.length
    : null

  return (
    <div className="admin-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Data Evaluasi SUS</h1>
          <p className="page-subtitle">Hasil pengukuran System Usability Scale pada Website Existing Disnakertrans</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Excel
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="metric-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="metric-label">Total Responden SUS</div>
          <div className="metric-value">{responses.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Rata-rata Skor SUS</div>
          <div className="metric-value" style={{ color: 'var(--accent)' }}>{avgSus !== null ? avgSus.toFixed(1) : '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Skala 0 – 100</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Skor Tertinggi</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>{responses.length > 0 ? Math.max(...scores).toFixed(1) : '—'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Skor Terendah</div>
          <div className="metric-value">{responses.length > 0 ? Math.min(...scores).toFixed(1) : '—'}</div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Daftar Nilai SUS per Responden</h3>
          <span className="badge badge-neutral">{responses.length} Responden</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th style={{ textAlign: 'center' }}>Skor SUS</th>
                <th>Kategori</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {responses.map(p => {
                const score = p.susScore || 0
                let grade = 'OK'
                let badge = 'badge-neutral'
                if (score >= 84.1) { grade = 'Sangat Baik (A)'; badge = 'badge-success' }
                else if (score >= 72.6) { grade = 'Baik (B)'; badge = 'badge-success' }
                else if (score >= 52) { grade = 'Cukup (C)'; badge = 'badge-warning' }
                else { grade = 'Kurang (D/F)'; badge = 'badge-danger' }

                return (
                  <tr key={p.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {p.participantCode}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '1rem' }}>
                      {score.toFixed(1)}
                    </td>
                    <td>
                      <span className={`badge ${badge}`}>
                        {grade}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                          Detail <IconArrowRight size={12} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteSus(p)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                          title="Hapus Kuesioner SUS Ini"
                        >
                          <IconTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {responses.length === 0 && (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            Belum ada data responden yang mengisi kuesioner SUS.
          </div>
        )}
      </div>
    </div>
  )
}

