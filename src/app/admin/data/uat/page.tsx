'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconDownload, IconArrowRight, IconTrash } from '@/components/icons'

interface ParticipantWithUat {
  id: number
  participantCode: string
  name: string
  hasUat: boolean
  uatSuccessRate: number | null
  uatAcceptanceMean: number | null
}

export default function UatDataPage() {
  const [participants, setParticipants] = useState<ParticipantWithUat[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/admin/participants')
      .then(r => r.json())
      .then((p: ParticipantWithUat[]) => {
        setParticipants(p.filter(x => x.hasUat))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteUat = async (p: ParticipantWithUat) => {
    if (!confirm(`Hapus data pengujian UAT dari ${p.name} (${p.participantCode})?`)) return
    try {
      const res = await fetch(`/api/admin/participants/${p.id}?type=uat`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        alert(`Gagal menghapus: ${err.error}`)
      } else {
        fetchData()
      }
    } catch {
      alert('Gagal menghapus kuesioner UAT')
    }
  }

  const avgRate = participants.length > 0
    ? participants.reduce((a, p) => a + (p.uatSuccessRate ?? 0), 0) / participants.length
    : null
  const avgAcc = participants.length > 0
    ? participants.reduce((a, p) => a + (p.uatAcceptanceMean ?? 0), 0) / participants.length
    : null

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  return (
    <div className="admin-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Data Evaluasi UAT</h1>
          <p className="page-subtitle">Hasil pengujian penerimaan sistem berbasis skenario tugas pada Website Final</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Excel
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="metric-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="metric-label">Total Responden UAT</div>
          <div className="metric-value">{participants.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Rata-rata Task Success Rate</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>
            {avgRate !== null ? `${avgRate.toFixed(1)}%` : '—'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Rata-rata Overall Acceptance</div>
          <div className="metric-value" style={{ color: 'var(--accent)' }}>
            {avgAcc !== null ? avgAcc.toFixed(2) : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Skala 1 – 5</div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Daftar Hasil UAT per Responden</h3>
          <span className="badge badge-neutral">{participants.length} Responden</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th style={{ textAlign: 'center' }}>Task Success Rate</th>
                <th style={{ textAlign: 'center' }}>Overall Acceptance</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {p.participantCode}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--success)' }}>
                    {p.uatSuccessRate !== null ? `${p.uatSuccessRate.toFixed(0)}%` : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>
                    {p.uatAcceptanceMean !== null ? `${p.uatAcceptanceMean.toFixed(2)} / 5` : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                        Detail <IconArrowRight size={12} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteUat(p)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="Hapus Kuesioner UAT Ini"
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {participants.length === 0 && (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            Belum ada data responden yang menyelesaikan pengujian UAT.
          </div>
        )}
      </div>
    </div>
  )
}
