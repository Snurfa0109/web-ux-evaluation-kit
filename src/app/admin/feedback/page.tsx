'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconDownload, IconArrowRight, IconMessageSquare, IconClipboard, IconBarChart, IconCheck } from '@/components/icons'

interface SusFeedbackItem {
  id: number
  participantId: number
  susScore: number
  fb1?: string | null
  fb2?: string | null
  fb3?: string | null
  fb4?: string | null
  fb5?: string | null
  fb6?: string | null
  fb6Phone?: string | null
  completedAt: string
  participant: {
    id: number
    participantCode: string
    name: string
    occupation: string
    age: number
  }
}

interface UeqFeedbackItem {
  id: number
  participantId: number
  attractiveness: number
  fb1?: string | null
  fb2?: string | null
  fb3?: string | null
  fb4?: string | null
  fb4Phone?: string | null
  completedAt: string
  participant: {
    id: number
    participantCode: string
    name: string
    occupation: string
    age: number
  }
}

interface UatOverallFeedbackItem {
  id: number
  participantId: number
  meanRating: number
  fb1?: string | null
  fb2?: string | null
  fb3?: string | null
  completedAt: string
  participant: {
    id: number
    participantCode: string
    name: string
    occupation: string
    age: number
  }
}

interface UatTaskNoteItem {
  id: number
  status: string
  notes: string
  completedAt: string
  task: {
    taskCode: string
    title: string
  }
  participant: {
    id: number
    participantCode: string
    name: string
    occupation: string
  }
}

interface FeedbackData {
  sus: SusFeedbackItem[]
  ueq: UeqFeedbackItem[]
  uat: {
    overall: UatOverallFeedbackItem[]
    taskNotes: UatTaskNoteItem[]
  }
}

export default function FeedbackPage() {
  const [data, setData] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sus' | 'ueq' | 'uat'>('sus')
  const [search, setSearch] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState('all')

  useEffect(() => {
    fetch('/api/admin/feedback')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  const susList = data?.sus || []
  const ueqList = data?.ueq || []
  const uatOverallList = data?.uat.overall || []
  const uatTaskList = data?.uat.taskNotes || []

  // Filter SUS
  const filteredSus = susList.filter(item => {
    const p = item.participant
    const textMatch = (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.participantCode.toLowerCase().includes(search.toLowerCase()) ||
      (item.fb1 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb2 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb3 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb4 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb5 || '').toLowerCase().includes(search.toLowerCase())
    )
    if (!textMatch) return false

    if (selectedQuestion === 'fb1') return Boolean(item.fb1 && item.fb1.trim())
    if (selectedQuestion === 'fb2') return Boolean(item.fb2 && item.fb2.trim())
    if (selectedQuestion === 'fb3') return Boolean(item.fb3 && item.fb3.trim())
    if (selectedQuestion === 'fb4') return Boolean(item.fb4 && item.fb4.trim())
    if (selectedQuestion === 'fb5') return Boolean(item.fb5 && item.fb5.trim())
    return true
  })

  // Filter UEQ
  const filteredUeq = ueqList.filter(item => {
    const p = item.participant
    const textMatch = (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.participantCode.toLowerCase().includes(search.toLowerCase()) ||
      (item.fb1 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb2 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb3 || '').toLowerCase().includes(search.toLowerCase())
    )
    if (!textMatch) return false

    if (selectedQuestion === 'fb1') return Boolean(item.fb1 && item.fb1.trim())
    if (selectedQuestion === 'fb2') return Boolean(item.fb2 && item.fb2.trim())
    if (selectedQuestion === 'fb3') return Boolean(item.fb3 && item.fb3.trim())
    return true
  })

  // Filter UAT
  const filteredUatOverall = uatOverallList.filter(item => {
    const p = item.participant
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.participantCode.toLowerCase().includes(search.toLowerCase()) ||
      (item.fb1 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb2 || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.fb3 || '').toLowerCase().includes(search.toLowerCase())
    )
  })

  const filteredUatTasks = uatTaskList.filter(item => {
    const p = item.participant
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.participantCode.toLowerCase().includes(search.toLowerCase()) ||
      item.task.taskCode.toLowerCase().includes(search.toLowerCase()) ||
      item.notes.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="admin-content fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Rangkuman Feedback Responden</h1>
          <p className="page-subtitle">Kumpulan masukan kualitatif, saran perbaikan, & kendala yang dilaporkan responden per instrumen</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Excel (Lengkap)
        </Link>
      </div>

      {/* Summary Metrics */}
      <div className="metric-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="metric-label">Responden Feedback SUS</div>
          <div className="metric-value">{susList.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Website Existing</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Responden Feedback UEQ</div>
          <div className="metric-value" style={{ color: 'var(--accent)' }}>{ueqList.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Prototype Redesign</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Responden Feedback UAT</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>{uatOverallList.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Overall Acceptance</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Catatan Kendala Task UAT</div>
          <div className="metric-value">{uatTaskList.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Catatan spesifik tugas</div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--slate-200)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>

        <button
          type="button"
          onClick={() => { setActiveTab('sus'); setSelectedQuestion('all'); setSearch('') }}
          className={`btn btn-sm ${activeTab === 'sus' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconClipboard size={15} /> 1. SUS Feedback ({susList.length})
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('ueq'); setSelectedQuestion('all'); setSearch('') }}
          className={`btn btn-sm ${activeTab === 'ueq' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconBarChart size={15} /> 2. UEQ Feedback ({ueqList.length})
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('uat'); setSelectedQuestion('all'); setSearch('') }}
          className={`btn btn-sm ${activeTab === 'uat' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IconCheck size={15} /> 3. UAT Feedback ({uatOverallList.length})
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          type="text"
          placeholder="Cari nama, kode, atau kata kunci..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />

        {activeTab === 'sus' && (
          <select
            className="form-select"
            value={selectedQuestion}
            onChange={e => setSelectedQuestion(e.target.value)}
            style={{ maxWidth: 260 }}
          >
            <option value="all">Semua Pertanyaan SUS</option>
            <option value="fb1">1. Fitur Paling Mudah</option>
            <option value="fb2">2. Fitur Paling Sulit / Membingungkan</option>
            <option value="fb3">3. Informasi Sulit Ditemukan</option>
            <option value="fb4">4. Fitur / Informasi Perlu Ditambah</option>
            <option value="fb5">5. Saran & Masukan Umum</option>
          </select>
        )}

        {activeTab === 'ueq' && (
          <select
            className="form-select"
            value={selectedQuestion}
            onChange={e => setSelectedQuestion(e.target.value)}
            style={{ maxWidth: 260 }}
          >
            <option value="all">Semua Pertanyaan UEQ</option>
            <option value="fb1">1. Tampilan Visual Paling Disukai</option>
            <option value="fb2">2. Tampilan Kurang Nyaman / Bingung</option>
            <option value="fb3">3. Saran Perbaikan Prototype</option>
          </select>
        )}
      </div>

      {/* TAB 1: SUS FEEDBACK CONTENT */}
      {activeTab === 'sus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredSus.map((item) => (
            <div key={item.id} className="card">
              <div className="card-header" style={{ padding: '0.875rem 1.25rem', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)', background: 'var(--slate-200)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                    {item.participant.participantCode}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--slate-900)' }}>{item.participant.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>({item.participant.occupation}, {item.participant.age} thn)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                    Skor SUS: <strong>{item.susScore.toFixed(1)}</strong>
                  </span>
                  <Link href={`/admin/peserta/${item.participantId}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                    Detail <IconArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'fb1', title: '1. Fitur paling mudah digunakan', val: item.fb1 },
                  { key: 'fb2', title: '2. Fitur paling sulit / membingungkan', val: item.fb2 },
                  { key: 'fb3', title: '3. Informasi yang sulit ditemukan', val: item.fb3 },
                  { key: 'fb4', title: '4. Fitur/informasi yang perlu ditambahkan', val: item.fb4 },
                  { key: 'fb5', title: '5. Saran & masukan umum peningkatan', val: item.fb5 },
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
          ))}

          {filteredSus.length === 0 && (
            <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              Tidak ada data masukan kuesioner SUS yang sesuai.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UEQ FEEDBACK CONTENT */}
      {activeTab === 'ueq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredUeq.map((item) => (
            <div key={item.id} className="card">
              <div className="card-header" style={{ padding: '0.875rem 1.25rem', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)', background: 'var(--slate-200)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                    {item.participant.participantCode}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--slate-900)' }}>{item.participant.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>({item.participant.occupation}, {item.participant.age} thn)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    Attractiveness: <strong>{item.attractiveness.toFixed(2)}</strong>
                  </span>
                  <Link href={`/admin/peserta/${item.participantId}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                    Detail <IconArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'fb1', title: '1. Tampilan visual yang paling disukai (Prototype)', val: item.fb1 },
                  { key: 'fb2', title: '2. Tampilan visual yang membingungkan / kurang nyaman', val: item.fb2 },
                  { key: 'fb3', title: '3. Saran perbaikan untuk prototype redesign', val: item.fb3 },
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
          ))}

          {filteredUeq.length === 0 && (
            <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              Tidak ada data masukan kuesioner UEQ yang sesuai.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: UAT FEEDBACK CONTENT */}
      {activeTab === 'uat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Overall Acceptance Feedback */}
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>A. Masukan Kualitatif Keseluruhan UAT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredUatOverall.map((item) => (
                <div key={item.id} className="card">
                  <div className="card-header" style={{ padding: '0.875rem 1.25rem', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)', background: 'var(--slate-200)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                        {item.participant.participantCode}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--slate-900)' }}>{item.participant.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>({item.participant.occupation}, {item.participant.age} thn)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        Mean Rating: <strong>{item.meanRating.toFixed(2)} / 5</strong>
                      </span>
                      <Link href={`/admin/peserta/${item.participantId}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                        Detail <IconArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { key: 'fb1', title: '1. Kesesuaian fungsi & alur layanan', val: item.fb1 },
                      { key: 'fb2', title: '2. Kendala / bug yang ditemukan saat pengujian', val: item.fb2 },
                      { key: 'fb3', title: '3. Saran & kritik akhir untuk penerapan final', val: item.fb3 },
                    ].map(q => {
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
              ))}

              {filteredUatOverall.length === 0 && (
                <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                  Belum ada data masukan kualitatif akhir UAT.
                </div>
              )}
            </div>
          </div>

          {/* Task-Specific Notes */}
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>B. Catatan Kendala per Skenario Tugas UAT ({filteredUatTasks.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredUatTasks.map((t) => (
                <div key={t.id} style={{ padding: '0.875rem 1.125rem', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-900)', background: 'var(--slate-200)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                        {t.task.taskCode}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)' }}>{t.task.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>oleh {t.participant.name} ({t.participant.participantCode})</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                      "{t.notes}"
                    </p>
                  </div>
                  <span className={`badge ${t.status === 'BERHASIL' ? 'badge-warning' : 'badge-danger'}`}>
                    {t.status}
                  </span>
                </div>
              ))}

              {filteredUatTasks.length === 0 && (
                <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                  Tidak ada catatan kendala spesifik pada skenario tugas UAT.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
