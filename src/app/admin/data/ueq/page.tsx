'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconDownload, IconArrowRight, IconTrash } from '@/components/icons'

interface ParticipantWithUeq {
  id: number
  participantCode: string
  name: string
  hasUeq: boolean
  ueqAttractiveness: number | null
  ueqPerspicuity: number | null
  ueqEfficiency: number | null
  ueqDependability: number | null
  ueqStimulation: number | null
  ueqNovelty: number | null
}

const DIMS: (keyof ParticipantWithUeq)[] = [
  'ueqAttractiveness',
  'ueqPerspicuity',
  'ueqEfficiency',
  'ueqDependability',
  'ueqStimulation',
  'ueqNovelty',
]

const DIM_LABELS = ['Attractiveness', 'Perspicuity', 'Efficiency', 'Dependability', 'Stimulation', 'Novelty']

export default function UeqDataPage() {
  const [responses, setResponses] = useState<ParticipantWithUeq[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/admin/participants')
      .then(r => r.json())
      .then((p: ParticipantWithUeq[]) => {
        setResponses(p.filter(x => x.hasUeq))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteUeq = async (p: ParticipantWithUeq) => {
    if (!confirm(`Hapus data kuesioner UEQ dari ${p.name} (${p.participantCode})?`)) return
    try {
      const res = await fetch(`/api/admin/participants/${p.id}?type=ueq`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        alert(`Gagal menghapus: ${err.error}`)
      } else {
        fetchData()
      }
    } catch {
      alert('Gagal menghapus kuesioner UEQ')
    }
  }

  const avgDim = (key: keyof ParticipantWithUeq) => responses.length > 0
    ? responses.reduce((a, p) => a + ((p[key] as number) ?? 0), 0) / responses.length
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
          <h1 className="page-title">Data Evaluasi UEQ</h1>
          <p className="page-subtitle">Hasil pengukuran User Experience Questionnaire (26 Item, 6 Dimensi)</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Excel
        </Link>
      </div>

      {/* 6 Dimensions Average Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Rata-rata 6 Dimensi UEQ</h3>
          <span className="badge badge-neutral">Skala -3 s.d. +3</span>
        </div>
        <div className="card-body">
          {responses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
              {DIMS.map((dim, i) => {
                const avg = avgDim(dim)
                const score = avg ?? 0
                return (
                  <div key={dim} style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '0.375rem' }}>
                      {DIM_LABELS[i]}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: score >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {score >= 0 ? '+' : ''}{score.toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: 0 }}>Belum ada data responden UEQ.</p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Daftar Nilai UEQ per Responden</h3>
          <span className="badge badge-neutral">{responses.length} Responden</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                {DIM_LABELS.map(d => (
                  <th key={d} style={{ textAlign: 'center' }}>{d.slice(0, 3)}</th>
                ))}
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {responses.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {p.participantCode}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</td>
                  {DIMS.map(dim => {
                    const val = p[dim] as number | null
                    return (
                      <td key={dim} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                        {val !== null ? (
                          <span style={{ color: val >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {val >= 0 ? '+' : ''}{val.toFixed(2)}
                          </span>
                        ) : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                      </td>
                    )
                  })}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                        Detail <IconArrowRight size={12} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteUeq(p)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="Hapus Kuesioner UEQ Ini"
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

        {responses.length === 0 && (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            Belum ada data responden yang mengisi kuesioner UEQ.
          </div>
        )}
      </div>
    </div>
  )
}

