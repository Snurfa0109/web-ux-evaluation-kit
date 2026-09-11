'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconDownload,
  IconArrowRight,
  IconTrash,
  IconCheck,
  IconMessageSquare,
  IconLayers,
  IconClipboard,
} from '@/components/icons'

interface UatTaskItem {
  id: number
  taskId: number
  taskCode: string
  taskTitle: string
  feature?: string | null
  status: string
  notes?: string | null
  timeOnTaskSeconds?: number | null
  completedAt: string
}

interface UatOverallItem {
  id: number
  rating1: number
  rating2: number
  rating3: number
  rating4?: number | null
  rating5?: number | null
  meanRating: number
  fb1?: string | null
  fb2?: string | null
  fb3?: string | null
  completedAt: string
}

interface ParticipantWithUat {
  id: number
  participantCode: string
  name: string
  age: number
  gender: string
  occupation: string
  hasUat: boolean
  uatSuccessRate: number | null
  uatAcceptanceMean: number | null
  uatCompletedAt?: string | null
  uatDetails?: {
    overall: UatOverallItem | null
    tasks: UatTaskItem[]
  }
}

export default function UatDataPage() {
  const [participants, setParticipants] = useState<ParticipantWithUat[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tugas' | 'kendala' | 'gabungan'>('tugas')
  const [search, setSearch] = useState('')

  const fetchData = () => {
    fetch('/api/admin/participants')
      .then(r => r.json())
      .then((data: ParticipantWithUat[]) => {
        setParticipants(data.filter(p => p.hasUat))
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

  // Filter by search query
  const filteredParticipants = participants.filter(p => {
    const s = search.toLowerCase()
    const matchBasic = (
      p.name.toLowerCase().includes(s) ||
      p.participantCode.toLowerCase().includes(s) ||
      p.occupation.toLowerCase().includes(s)
    )
    if (matchBasic) return true
    if (p.uatDetails) {
      const fb = p.uatDetails.overall
      if (fb) {
        if ((fb.fb1 || '').toLowerCase().includes(s) ||
            (fb.fb2 || '').toLowerCase().includes(s) ||
            (fb.fb3 || '').toLowerCase().includes(s)) return true
      }
      const taskNotesMatch = p.uatDetails.tasks.some(t => (t.notes || '').toLowerCase().includes(s))
      if (taskNotesMatch) return true
    }
    return false
  })

  // Collect all task notes for Tab 2
  const allTaskNotes: { participant: ParticipantWithUat; task: UatTaskItem }[] = []
  filteredParticipants.forEach(p => {
    p.uatDetails?.tasks.forEach(t => {
      if (t.notes && t.notes.trim()) {
        allTaskNotes.push({ participant: p, task: t })
      }
    })
  })

  return (
    <div className="admin-content fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-accent">Tahap 03</span>
            <h1 className="page-title" style={{ margin: 0 }}>Data & Feedback Evaluasi UAT</h1>
          </div>
          <p className="page-subtitle">Hasil pengujian penerimaan sistem (User Acceptance Testing) & evaluasi kualitatif website final</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="/api/admin/export?type=uat" download className="btn btn-secondary btn-sm" id="btn-export-uat">
            <IconDownload size={14} /> Ekspor Excel (UAT)
          </a>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="metric-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="metric-label">Total Responden UAT</div>
          <div className="metric-value">{participants.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Menyelesaikan skenario & feedback</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Rata-rata Task Success Rate</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>
            {avgRate !== null ? `${avgRate.toFixed(1)}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Tingkat keberhasilan skenario</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Rata-rata Overall Acceptance</div>
          <div className="metric-value" style={{ color: 'var(--accent)' }}>
            {avgAcc !== null ? `${avgAcc.toFixed(2)} / 5` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Skor TAM / ISO 9241-11</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Catatan Kendala Task</div>
          <div className="metric-value">{allTaskNotes.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Masukan spesifik alur tugas</div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--slate-200)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('tugas')}
          className={`btn btn-sm ${activeTab === 'tugas' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconCheck size={15} /> 1. Hasil Tugas & Overall Acceptance
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kendala')}
          className={`btn btn-sm ${activeTab === 'kendala' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconMessageSquare size={15} /> 2. Catatan Kendala Tugas & Feedback Kualitatif
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gabungan')}
          className={`btn btn-sm ${activeTab === 'gabungan' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconLayers size={15} /> 3. Dataset Gabungan Lengkap (Tabel Komprehensif)
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <input
            className="form-input"
            type="text"
            placeholder="Cari nama, kode, atau kendala..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TAB 1: HASIL TUGAS & ACCEPTANCE */}
      {activeTab === 'tugas' && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>Daftar Hasil Pengujian UAT per Responden</h3>
            <span className="badge badge-neutral">{filteredParticipants.length} Responden</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Responden</th>
                  <th style={{ textAlign: 'center' }}>Task Success Rate</th>
                  <th style={{ textAlign: 'center' }}>Jumlah Tugas Diuji</th>
                  <th style={{ textAlign: 'center' }}>Overall Acceptance</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map(p => (
                  <tr key={p.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {p.participantCode}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{p.occupation} ({p.age} thn)</div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--success)' }}>
                      {p.uatSuccessRate !== null ? `${p.uatSuccessRate.toFixed(0)}%` : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                      {p.uatDetails?.tasks.length || 0} Tugas
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {p.uatAcceptanceMean !== null ? (
                        <span className="badge badge-success">{p.uatAcceptanceMean.toFixed(2)} / 5</span>
                      ) : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
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

          {filteredParticipants.length === 0 && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              Belum ada data responden yang menyelesaikan pengujian UAT.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATATAN KENDALA & FEEDBACK KUALITATIF */}
      {activeTab === 'kendala' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section A: Overall Qualitative Feedback */}
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>A. Masukan Kualitatif Keseluruhan UAT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredParticipants.map(p => {
                const fb = p.uatDetails?.overall
                if (!fb) return null

                return (
                  <div key={p.id} className="card">
                    <div className="card-header" style={{ padding: '0.875rem 1.25rem', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)', background: 'var(--slate-200)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                          {p.participantCode}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--slate-900)' }}>{p.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>({p.occupation}, {p.age} thn)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                          Acceptance: <strong>{fb.meanRating.toFixed(2)} / 5</strong>
                        </span>
                        <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                          Detail <IconArrowRight size={12} />
                        </Link>
                      </div>
                    </div>

                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { title: '1. Kesesuaian fungsi & alur layanan', val: fb.fb1 },
                        { title: '2. Kendala / bug yang ditemukan selama pengujian', val: fb.fb2 },
                        { title: '3. Saran & kritik akhir penerapan operasional website', val: fb.fb3 },
                      ].map((q, idx) => {
                        const hasAnswer = Boolean(q.val && q.val.trim())
                        return (
                          <div key={idx} style={{ padding: '0.625rem 0.875rem', background: hasAnswer ? 'var(--white)' : 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: `1px solid ${hasAnswer ? 'var(--slate-200)' : 'var(--slate-100)'}` }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '0.25rem' }}>{q.title}</div>
                            <div style={{ fontSize: '0.875rem', color: hasAnswer ? 'var(--slate-900)' : 'var(--slate-400)', fontStyle: hasAnswer ? 'normal' : 'italic' }}>
                              {hasAnswer ? q.val : '— (Tidak ada / Tidak diisi)'}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section B: Task Notes */}
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>B. Catatan Kendala per Skenario Tugas ({allTaskNotes.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {allTaskNotes.map((item, idx) => (
                <div key={idx} style={{ padding: '0.875rem 1.125rem', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-900)', background: 'var(--slate-200)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                        {item.task.taskCode}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)' }}>{item.task.taskTitle}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>oleh {item.participant.name} ({item.participant.participantCode})</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                      "{item.task.notes}"
                    </p>
                  </div>
                  <span className={`badge ${item.task.status === 'BERHASIL' ? 'badge-warning' : 'badge-danger'}`}>
                    {item.task.status}
                  </span>
                </div>
              ))}

              {allTaskNotes.length === 0 && (
                <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                  Tidak ada catatan kendala spesifik pada skenario tugas UAT.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATASET GABUNGAN LENGKAP */}
      {activeTab === 'gabungan' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem' }}>Dataset Komprehensif: Hasil Tugas + Acceptance + Feedback Akhir</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>Seluruh data UAT terpadu per responden</p>
            </div>
            <span className="badge badge-neutral">{filteredParticipants.length} Baris Data</span>
          </div>

          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: 1500 }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, background: 'var(--white)', zIndex: 2 }}>ID</th>
                  <th style={{ position: 'sticky', left: 85, background: 'var(--white)', zIndex: 2 }}>Nama</th>
                  <th style={{ textAlign: 'center' }}>Task Success Rate</th>
                  <th style={{ textAlign: 'center' }}>Overall Acceptance</th>
                  <th>Kesesuaian Layanan (FB1)</th>
                  <th>Kendala/Bug Ditemukan (FB2)</th>
                  <th>Saran & Kritik Akhir (FB3)</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map(p => {
                  const fb = p.uatDetails?.overall
                  return (
                    <tr key={p.id}>
                      <td style={{ position: 'sticky', left: 0, background: 'var(--white)', zIndex: 1, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {p.participantCode}
                      </td>
                      <td style={{ position: 'sticky', left: 85, background: 'var(--white)', zIndex: 1, fontWeight: 600 }}>
                        {p.name}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--success)' }}>
                        {p.uatSuccessRate !== null ? `${p.uatSuccessRate.toFixed(0)}%` : '—'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {fb ? `${fb.meanRating.toFixed(2)} / 5` : '—'}
                      </td>
                      <td style={{ maxWidth: 260, fontSize: '0.8rem' }}>{fb?.fb1 || '—'}</td>
                      <td style={{ maxWidth: 260, fontSize: '0.8rem' }}>{fb?.fb2 || '—'}</td>
                      <td style={{ maxWidth: 260, fontSize: '0.8rem' }}>{fb?.fb3 || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }}>
                          Detail
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
