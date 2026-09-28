'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconDownload,
  IconArrowRight,
  IconTrash,
  IconClipboard,
  IconMessageSquare,
  IconLayers,
  IconCheck,
} from '@/components/icons'

import { SUS_ITEMS, SUS_FEEDBACK_ITEMS } from '@/lib/sus-instrument'

interface SusDetails {
  id: number
  phaseId?: number
  phaseNumber?: number
  q1: number; q2: number; q3: number; q4: number; q5: number
  q6: number; q7: number; q8: number; q9: number; q10: number
  susScore: number
  fb1?: string | null
  fb2?: string | null
  fb3?: string | null
  fb4?: string | null
  fb5?: string | null
  fb6?: string | null
  fb6Phone?: string | null
  completedAt: string
}

interface ParticipantWithSus {
  id: number
  participantCode: string
  name: string
  age: number
  gender: string
  occupation: string
  hasSus: boolean
  hasSusFase1?: boolean
  hasSusFase4?: boolean
  susScore: number | null
  susCompletedAt?: string | null
  susDetails?: SusDetails | null
  susFase1?: SusDetails | null
  susFase4?: SusDetails | null
  susFb6?: string | null
  whatsappNumber?: string | null
}

export default function SusDataPage() {
  const [participants, setParticipants] = useState<ParticipantWithSus[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'kuantitatif' | 'kualitatif' | 'gabungan'>('kuantitatif')
  const [search, setSearch] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState('all')
  const [selectedPhase, setSelectedPhase] = useState<1 | 4>(4)

  const fetchData = () => {
    fetch('/api/admin/participants')
      .then(r => r.json())
      .then((data: ParticipantWithSus[]) => {
        setParticipants(data.filter(p => p.hasSus))
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

  const activeParticipants = participants
    .map(p => {
      const susData = selectedPhase === 4 ? (p.susFase4 || (p.susDetails?.phaseNumber === 4 ? p.susDetails : null)) : (p.susFase1 || (p.susDetails?.phaseNumber === 1 ? p.susDetails : null))
      if (!susData) return null
      return {
        ...p,
        susScore: susData.susScore,
        susCompletedAt: susData.completedAt,
        susDetails: susData,
        susFb6: susData.fb6,
      }
    })
    .filter(Boolean) as ParticipantWithSus[]

  const scores = activeParticipants.map(p => p.susScore || 0)
  const avgSus = activeParticipants.length > 0
    ? scores.reduce((a, b) => a + b, 0) / activeParticipants.length
    : null

  // Filtered participants by search
  const filteredParticipants = activeParticipants.filter(p => {
    const s = search.toLowerCase()
    const matchBasic = (
      p.name.toLowerCase().includes(s) ||
      p.participantCode.toLowerCase().includes(s) ||
      p.occupation.toLowerCase().includes(s)
    )
    if (matchBasic) return true
    if (p.susDetails) {
      const d = p.susDetails
      return (
        (d.fb1 || '').toLowerCase().includes(s) ||
        (d.fb2 || '').toLowerCase().includes(s) ||
        (d.fb3 || '').toLowerCase().includes(s) ||
        (d.fb4 || '').toLowerCase().includes(s) ||
        (d.fb5 || '').toLowerCase().includes(s)
      )
    }
    return false
  })

  return (
    <div className="admin-content fade-in">
      {/* Phase Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setSelectedPhase(4)}
          className={`btn ${selectedPhase === 4 ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedPhase === 4 ? '#22c55e' : '#94a3b8' }}></span>
          Fase 4: Website Baru (25–27 Sep 2026)
          <span className="badge badge-neutral" style={{ marginLeft: 4 }}>33 Responden</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPhase(1)}
          className={`btn ${selectedPhase === 1 ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedPhase === 1 ? '#22c55e' : '#94a3b8' }}></span>
          Fase 1: Website Existing (22–25 Ags 2026)
          <span className="badge badge-neutral" style={{ marginLeft: 4 }}>33 Responden</span>
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-accent">
              {selectedPhase === 4 ? 'Tahap 04' : 'Tahap 01'}
            </span>
            <h1 className="page-title" style={{ margin: 0 }}>
              {selectedPhase === 4 ? 'Data & Feedback SUS — Website Baru' : 'Data & Feedback SUS — Website Existing'}
            </h1>
          </div>
          <p className="page-subtitle">
            {selectedPhase === 4
              ? 'Dataset kuantitatif System Usability Scale (SUS) hasil rancangan baru dengan 33 responden (timeframe: 25–27 September 2026).'
              : 'Dataset kuantitatif System Usability Scale (SUS) evaluasi awal kebergunaan pada Website Existing sebelum perancangan ulang.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="/api/admin/export?type=sus" download className="btn btn-secondary btn-sm" id="btn-export-sus">
            <IconDownload size={14} /> Ekspor Excel (SUS)
          </a>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="metric-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="metric-label">Total Responden SUS</div>
          <div className="metric-value">{participants.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Mengisi lengkap Q1–Q10 + Feedback</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Rata-rata Skor SUS</div>
          <div className="metric-value" style={{ color: 'var(--accent)' }}>{avgSus !== null ? avgSus.toFixed(1) : '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
            {avgSus !== null ? (
              avgSus >= 84.1 ? 'Grade A (Sangat Baik)' :
              avgSus >= 72.6 ? 'Grade B (Baik / Good)' :
              avgSus >= 52 ? 'Grade C (Cukup / OK)' : 'Grade D/F (Kurang)'
            ) : 'Skala 0 – 100'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Skor Tertinggi</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>{participants.length > 0 ? Math.max(...scores).toFixed(1) : '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Maksimum 100</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Skor Terendah</div>
          <div className="metric-value" style={{ color: 'var(--danger)' }}>{participants.length > 0 ? Math.min(...scores).toFixed(1) : '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Minimum 0</div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--slate-200)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('kuantitatif')}
          className={`btn btn-sm ${activeTab === 'kuantitatif' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconClipboard size={15} /> 1. Dataset Kuantitatif & Skor SUS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kualitatif')}
          className={`btn btn-sm ${activeTab === 'kualitatif' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconMessageSquare size={15} /> 2. Masukan & Feedback Kualitatif Responden
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

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <input
            className="form-input"
            type="text"
            placeholder="Cari nama, kode, atau saran..."
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
            <option value="all">Semua Pertanyaan Feedback (FB1–FB6)</option>
            <option value="fb1">1. Fitur Paling Mudah Digunakan</option>
            <option value="fb2">2. Fitur Membingungkan / Sulit</option>
            <option value="fb3">3. Informasi Sulit Ditemukan</option>
            <option value="fb4">4. Usulan Fitur / Informasi Tambahan</option>
            <option value="fb5">5. Saran & Masukan Umum</option>
            <option value="fb6">6. Bersedia Kontak Lanjutan</option>
          </select>
        )}
      </div>

      {/* TAB 1: DATASET KUANTITATIF & SKOR */}
      {activeTab === 'kuantitatif' && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>Daftar Nilai Kuesioner SUS (Q1–Q10 & Skor)</h3>
            <span className="badge badge-neutral">{filteredParticipants.length} Responden</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Responden</th>
                  <th style={{ textAlign: 'center' }}>Q1</th>
                  <th style={{ textAlign: 'center' }}>Q2</th>
                  <th style={{ textAlign: 'center' }}>Q3</th>
                  <th style={{ textAlign: 'center' }}>Q4</th>
                  <th style={{ textAlign: 'center' }}>Q5</th>
                  <th style={{ textAlign: 'center' }}>Q6</th>
                  <th style={{ textAlign: 'center' }}>Q7</th>
                  <th style={{ textAlign: 'center' }}>Q8</th>
                  <th style={{ textAlign: 'center' }}>Q9</th>
                  <th style={{ textAlign: 'center' }}>Q10</th>
                  <th style={{ textAlign: 'center', background: 'var(--slate-100)' }}>Skor SUS</th>
                  <th>Kategori Grade</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map(p => {
                  const score = p.susScore || 0
                  const d = p.susDetails
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
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{p.occupation} ({p.age} thn)</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{d?.q1 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q2 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q3 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q4 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q5 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q6 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q7 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q8 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q9 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q10 ?? '—'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)', background: 'var(--slate-50)' }}>
                        {score.toFixed(1)}
                      </td>
                      <td>
                        <span className={`badge ${badge}`}>{grade}</span>
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

          {filteredParticipants.length === 0 && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              Tidak ada data responden SUS yang cocok.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MASUKAN & FEEDBACK KUALITATIF */}
      {activeTab === 'kualitatif' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredParticipants.map(p => {
            const d = p.susDetails
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
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      Skor SUS: <strong>{(p.susScore || 0).toFixed(1)}</strong>
                    </span>
                    <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                      Detail <IconArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { key: 'fb1', title: '1. Fitur paling mudah digunakan', val: d.fb1 },
                    { key: 'fb2', title: '2. Fitur paling sulit / membingungkan', val: d.fb2 },
                    { key: 'fb3', title: '3. Informasi yang sulit ditemukan', val: d.fb3 },
                    { key: 'fb4', title: '4. Fitur / informasi yang perlu ditambahkan', val: d.fb4 },
                    { key: 'fb5', title: '5. Saran & masukan umum peningkatan', val: d.fb5 },
                    {
                      key: 'fb6',
                      title: '6. Kesediaan dihubungi untuk evaluasi lanjutan',
                      val: d.fb6 ? `${d.fb6} ${d.fb6Phone ? `(No. WA: ${d.fb6Phone})` : ''}` : null,
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
              Tidak ada masukan kualitatif SUS yang sesuai filter pencarian.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATASET GABUNGAN LENGKAP (TABEL KOMPREHENSIF) */}
      {activeTab === 'gabungan' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem' }}>Dataset Komprehensif: Skor Kuantitatif + Feedback Kualitatif</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>Seluruh variabel data instrumen SUS dalam satu tampilan tabel terpadu</p>
            </div>
            <span className="badge badge-neutral">{filteredParticipants.length} Baris Data</span>
          </div>

          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: 1400 }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, background: 'var(--white)', zIndex: 2 }}>ID</th>
                  <th style={{ position: 'sticky', left: 85, background: 'var(--white)', zIndex: 2 }}>Nama</th>
                  <th style={{ textAlign: 'center' }}>Q1</th>
                  <th style={{ textAlign: 'center' }}>Q2</th>
                  <th style={{ textAlign: 'center' }}>Q3</th>
                  <th style={{ textAlign: 'center' }}>Q4</th>
                  <th style={{ textAlign: 'center' }}>Q5</th>
                  <th style={{ textAlign: 'center' }}>Q6</th>
                  <th style={{ textAlign: 'center' }}>Q7</th>
                  <th style={{ textAlign: 'center' }}>Q8</th>
                  <th style={{ textAlign: 'center' }}>Q9</th>
                  <th style={{ textAlign: 'center' }}>Q10</th>
                  <th style={{ textAlign: 'center', background: 'var(--slate-100)' }}>Skor SUS</th>
                  <th>Fitur Paling Mudah (FB1)</th>
                  <th>Fitur Membingungkan (FB2)</th>
                  <th>Info Sulit Ditemukan (FB3)</th>
                  <th>Usulan Fitur Baru (FB4)</th>
                  <th>Saran Umum (FB5)</th>
                  <th>Bersedia Lanjutan</th>
                  <th>No. WhatsApp</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map(p => {
                  const d = p.susDetails
                  const score = p.susScore || 0
                  return (
                    <tr key={p.id}>
                      <td style={{ position: 'sticky', left: 0, background: 'var(--white)', zIndex: 1, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {p.participantCode}
                      </td>
                      <td style={{ position: 'sticky', left: 85, background: 'var(--white)', zIndex: 1, fontWeight: 600 }}>
                        {p.name}
                      </td>
                      <td style={{ textAlign: 'center' }}>{d?.q1 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q2 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q3 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q4 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q5 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q6 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q7 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q8 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q9 ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>{d?.q10 ?? '—'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 800, background: 'var(--slate-50)' }}>
                        {score.toFixed(1)}
                      </td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb1 || '—'}</td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb2 || '—'}</td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb3 || '—'}</td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb4 || '—'}</td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>{d?.fb5 || '—'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${d?.fb6 === 'Ya' ? 'badge-success' : 'badge-neutral'}`}>
                          {d?.fb6 || '—'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{d?.fb6Phone || '—'}</td>
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
