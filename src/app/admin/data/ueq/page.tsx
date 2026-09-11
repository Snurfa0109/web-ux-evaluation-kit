'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconDownload,
  IconArrowRight,
  IconTrash,
  IconBarChart,
  IconMessageSquare,
  IconLayers,
  IconCheck,
} from '@/components/icons'
import { UEQ_ITEMS, UEQ_FEEDBACK_ITEMS } from '@/lib/ueq-instrument'

interface UeqDetails {
  id: number
  item1: number; item2: number; item3: number; item4: number; item5: number
  item6: number; item7: number; item8: number; item9: number; item10: number
  item11: number; item12: number; item13: number; item14: number; item15: number
  item16: number; item17: number; item18: number; item19: number; item20: number
  item21: number; item22: number; item23: number; item24: number; item25: number
  item26: number
  attractiveness: number
  perspicuity: number
  efficiency: number
  dependability: number
  stimulation: number
  novelty: number
  fb1?: string | null
  fb2?: string | null
  fb3?: string | null
  fb4?: string | null
  fb4Phone?: string | null
  completedAt: string
}

interface ParticipantWithUeq {
  id: number
  participantCode: string
  name: string
  age: number
  gender: string
  occupation: string
  hasUeq: boolean
  ueqAttractiveness: number | null
  ueqPerspicuity: number | null
  ueqEfficiency: number | null
  ueqDependability: number | null
  ueqStimulation: number | null
  ueqNovelty: number | null
  ueqDetails?: UeqDetails | null
  ueqFb4?: string | null
  whatsappNumber?: string | null
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
  const [participants, setParticipants] = useState<ParticipantWithUeq[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dimensi' | 'kualitatif' | 'gabungan'>('dimensi')
  const [search, setSearch] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState('all')

  const fetchData = () => {
    fetch('/api/admin/participants')
      .then(r => r.json())
      .then((data: ParticipantWithUeq[]) => {
        setParticipants(data.filter(p => p.hasUeq))
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

  const avgDim = (key: keyof ParticipantWithUeq) => participants.length > 0
    ? participants.reduce((a, p) => a + ((p[key] as number) ?? 0), 0) / participants.length
    : null

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  // Filtered by search query
  const filteredParticipants = participants.filter(p => {
    const s = search.toLowerCase()
    const matchBasic = (
      p.name.toLowerCase().includes(s) ||
      p.participantCode.toLowerCase().includes(s) ||
      p.occupation.toLowerCase().includes(s)
    )
    if (matchBasic) return true
    if (p.ueqDetails) {
      const d = p.ueqDetails
      return (
        (d.fb1 || '').toLowerCase().includes(s) ||
        (d.fb2 || '').toLowerCase().includes(s) ||
        (d.fb3 || '').toLowerCase().includes(s)
      )
    }
    return false
  })

  return (
    <div className="admin-content fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-accent">Tahap 02</span>
            <h1 className="page-title" style={{ margin: 0 }}>Data & Feedback Evaluasi UEQ</h1>
          </div>
          <p className="page-subtitle">Dataset kuantitatif 26 butir & 6 skala dimensi UEQ digabung dengan feedback kualitatif prototype redesign</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="/api/admin/export?type=ueq" download className="btn btn-secondary btn-sm" id="btn-export-ueq">
            <IconDownload size={14} /> Ekspor Excel (UEQ)
          </a>
        </div>
      </div>

      {/* 6 Dimensions Average Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1rem' }}>Rata-rata 6 Dimensi User Experience Questionnaire</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>Rentang nilai skala standar UEQ: -3.0 (Sangat Buruk) hingga +3.0 (Sangat Baik)</p>
          </div>
          <span className="badge badge-neutral">{participants.length} Responden</span>
        </div>
        <div className="card-body">
          {participants.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem' }}>
              {DIMS.map((dim, i) => {
                const avg = avgDim(dim)
                const score = avg ?? 0
                return (
                  <div key={dim} style={{ padding: '0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '0.375rem' }}>
                      {DIM_LABELS[i]}
                    </div>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: score >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {score >= 0 ? '+' : ''}{score.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: score >= 0.8 ? 'var(--success)' : score >= 0 ? 'var(--accent)' : 'var(--danger)', fontWeight: 600 }}>
                      {score >= 0.8 ? 'Sangat Positif' : score >= 0 ? 'Cukup Positif' : 'Negatif'}
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

      {/* View Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--slate-200)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('dimensi')}
          className={`btn btn-sm ${activeTab === 'dimensi' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconBarChart size={15} /> 1. Dataset 6 Dimensi UEQ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kualitatif')}
          className={`btn btn-sm ${activeTab === 'kualitatif' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconMessageSquare size={15} /> 2. Masukan & Feedback Kualitatif Prototype
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
            placeholder="Cari nama, kode, atau kata kunci..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {activeTab === 'kualitatif' && (
          <select
            className="form-select"
            value={selectedQuestion}
            onChange={e => setSelectedQuestion(e.target.value)}
            style={{ maxWidth: 280 }}
          >
            <option value="all">Semua Pertanyaan Feedback (FB1–FB4)</option>
            <option value="fb1">1. Tampilan Visual Paling Disukai</option>
            <option value="fb2">2. Tampilan Kurang Nyaman / Bingung</option>
            <option value="fb3">3. Saran Perbaikan Prototype</option>
            <option value="fb4">4. Kesediaan Ikut UAT</option>
          </select>
        )}
      </div>

      {/* TAB 1: DATASET 6 DIMENSI */}
      {activeTab === 'dimensi' && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>Daftar Skor 6 Dimensi UEQ per Responden</h3>
            <span className="badge badge-neutral">{filteredParticipants.length} Responden</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Responden</th>
                  <th style={{ textAlign: 'center' }}>Attractiveness</th>
                  <th style={{ textAlign: 'center' }}>Perspicuity</th>
                  <th style={{ textAlign: 'center' }}>Efficiency</th>
                  <th style={{ textAlign: 'center' }}>Dependability</th>
                  <th style={{ textAlign: 'center' }}>Stimulation</th>
                  <th style={{ textAlign: 'center' }}>Novelty</th>
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

          {filteredParticipants.length === 0 && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              Tidak ada data responden UEQ yang sesuai.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MASUKAN & FEEDBACK KUALITATIF */}
      {activeTab === 'kualitatif' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredParticipants.map(p => {
            const d = p.ueqDetails
            if (!d) return null

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
                      Attractiveness: <strong>{(p.ueqAttractiveness ?? 0) >= 0 ? '+' : ''}{(p.ueqAttractiveness ?? 0).toFixed(2)}</strong>
                    </span>
                    <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                      Detail <IconArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { key: 'fb1', title: '1. Tampilan visual yang paling disukai pada prototype', val: d.fb1 },
                    { key: 'fb2', title: '2. Tampilan visual yang membingungkan / kurang nyaman', val: d.fb2 },
                    { key: 'fb3', title: '3. Saran perbaikan desain untuk website final', val: d.fb3 },
                    {
                      key: 'fb4',
                      title: '4. Kesediaan berpartisipasi pada pengujian tahap final (UAT)',
                      val: d.fb4 ? `${d.fb4} ${d.fb4Phone ? `(No. WA: ${d.fb4Phone})` : ''}` : null,
                    },
                  ].map(q => {
                    if (selectedQuestion !== 'all' && selectedQuestion !== q.key) return null
                    const hasAnswer = Boolean(q.val && q.val.trim())
                    return (
                      <div key={q.key} style={{ padding: '0.625rem 0.875rem', background: hasAnswer ? 'var(--white)' : 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: `1px solid ${hasAnswer ? 'var(--slate-200)' : 'var(--slate-100)'}` }}>
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

          {filteredParticipants.length === 0 && (
            <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              Tidak ada feedback kualitatif UEQ yang cocok dengan kata kunci.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATASET GABUNGAN LENGKAP */}
      {activeTab === 'gabungan' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem' }}>Dataset Komprehensif: 6 Dimensi + 26 Butir Item + Feedback Prototype</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>Seluruh data kuesioner UEQ terpadu per baris responden</p>
            </div>
            <span className="badge badge-neutral">{filteredParticipants.length} Baris Data</span>
          </div>

          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: 1600 }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, background: 'var(--white)', zIndex: 2 }}>ID</th>
                  <th style={{ position: 'sticky', left: 85, background: 'var(--white)', zIndex: 2 }}>Nama</th>
                  <th style={{ textAlign: 'center' }}>Attractiveness</th>
                  <th style={{ textAlign: 'center' }}>Perspicuity</th>
                  <th style={{ textAlign: 'center' }}>Efficiency</th>
                  <th style={{ textAlign: 'center' }}>Dependability</th>
                  <th style={{ textAlign: 'center' }}>Stimulation</th>
                  <th style={{ textAlign: 'center' }}>Novelty</th>
                  <th>Visual Disukai (FB1)</th>
                  <th>Visual Kurang Nyaman (FB2)</th>
                  <th>Saran Perbaikan Prototype (FB3)</th>
                  <th>Bersedia UAT</th>
                  <th>No. WhatsApp</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map(p => {
                  const d = p.ueqDetails
                  return (
                    <tr key={p.id}>
                      <td style={{ position: 'sticky', left: 0, background: 'var(--white)', zIndex: 1, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {p.participantCode}
                      </td>
                      <td style={{ position: 'sticky', left: 85, background: 'var(--white)', zIndex: 1, fontWeight: 600 }}>
                        {p.name}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {p.ueqAttractiveness !== null ? `${p.ueqAttractiveness >= 0 ? '+' : ''}${p.ueqAttractiveness.toFixed(2)}` : '—'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {p.ueqPerspicuity !== null ? `${p.ueqPerspicuity >= 0 ? '+' : ''}${p.ueqPerspicuity.toFixed(2)}` : '—'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {p.ueqEfficiency !== null ? `${p.ueqEfficiency >= 0 ? '+' : ''}${p.ueqEfficiency.toFixed(2)}` : '—'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {p.ueqDependability !== null ? `${p.ueqDependability >= 0 ? '+' : ''}${p.ueqDependability.toFixed(2)}` : '—'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {p.ueqStimulation !== null ? `${p.ueqStimulation >= 0 ? '+' : ''}${p.ueqStimulation.toFixed(2)}` : '—'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {p.ueqNovelty !== null ? `${p.ueqNovelty >= 0 ? '+' : ''}${p.ueqNovelty.toFixed(2)}` : '—'}
                      </td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb1 || '—'}</td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb2 || '—'}</td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb3 || '—'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${d?.fb4 === 'Ya' ? 'badge-success' : 'badge-neutral'}`}>
                          {d?.fb4 || '—'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{d?.fb4Phone || '—'}</td>
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
