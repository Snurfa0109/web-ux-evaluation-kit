'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconArrowRight, IconCheck, IconX, IconExternalLink } from '@/components/icons'

interface Task {
  id: number; taskCode: string; feature: string; title: string;
  description: string; expectedResult: string; acceptanceCriteria: string; order: number
}

function getEmbeddableUrl(url: string) {
  if (!url) return ''
  if (url.includes('figma.com/file/') || url.includes('figma.com/design/')) {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
  }
  return url
}

export default function UatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const phaseId = params.phaseId as string
  const code = searchParams.get('code') || ''

  const [tasks, setTasks] = useState<Task[]>([])
  const [taskResults, setTaskResults] = useState<Record<number, { status: string; notes: string }>>({})
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0)
  const [showOverall, setShowOverall] = useState(false)
  const [overallRatings, setOverallRatings] = useState({ r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 })
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [loading, setLoading] = useState(true)

  // Split-screen & responsive states
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMode, setMobileMode] = useState<'panel' | 'website'>('panel')
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  const [taskStartTime, setTaskStartTime] = useState<number>(Date.now())

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetch('/api/phases')
      .then(r => r.json())
      .then(phases => {
        if (Array.isArray(phases)) {
          const p = phases.find((ph: any) => ph.id === parseInt(phaseId))
          if (p) {
            setTasks(p.tasks || [])
            setExternalUrl(p.externalUrl || '')
          }
        }
        setTaskStartTime(Date.now())
      })
      .catch(err => console.error('Fetch UAT phase error:', err))
      .finally(() => setLoading(false))
  }, [phaseId])

  useEffect(() => {
    if (externalUrl) {
      const timer = setTimeout(() => {
        setIframeLoaded(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [externalUrl])

  useEffect(() => {
    setTaskStartTime(Date.now())
  }, [currentTaskIdx])

  const submitTask = async (taskId: number, status: string, notes: string) => {
    const timeOnTaskSeconds = Math.max(1, Math.round((Date.now() - taskStartTime) / 1000))
    const res = await fetch('/api/uat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantCode: code, phaseId: parseInt(phaseId), taskId, status, notes, timeOnTaskSeconds }),
    })
    if (!res.ok) throw new Error('Gagal menyimpan hasil task')
  }

  const handleTaskSubmit = async () => {
    const current = tasks[currentTaskIdx]
    const result = taskResults[current.id]
    if (!result?.status) { setError('Mohon tentukan apakah tugas berhasil dilakukan.'); return }
    setError('')
    setSubmitting(true)
    try {
      await submitTask(current.id, result.status, result.notes || '')
      if (currentTaskIdx < tasks.length - 1) {
        setCurrentTaskIdx(prev => prev + 1)
      } else {
        setShowOverall(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOverallSubmit = async () => {
    if (!overallRatings.r1 || !overallRatings.r2 || !overallRatings.r3 || !overallRatings.r4 || !overallRatings.r5) {
      setError('Mohon berikan penilaian untuk kelima pernyataan ulasan keseluruhan.')
      return
    }
    if (!feedback['fb1']?.trim() || !feedback['fb2']?.trim() || !feedback['fb3']?.trim()) {
      setError('Mohon lengkapi seluruh pertanyaan feedback kualitatif.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/uat/overall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantCode: code,
          phaseId: parseInt(phaseId),
          rating1: overallRatings.r1,
          rating2: overallRatings.r2,
          rating3: overallRatings.r3,
          rating4: overallRatings.r4,
          rating5: overallRatings.r5,
          feedback,
        }),
      })
      if (!res.ok) throw new Error('Gagal menyimpan hasil evaluasi')
      router.push(`/fase/${phaseId}/selesai?code=${code}&instrument=UAT`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  const currentTask = tasks[currentTaskIdx]
  const RATINGS = [1, 2, 3, 4, 5]
  const RATING_LABELS = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--slate-50)' }}>
      {/* Top Bar Header */}
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href={`/fase/${phaseId}/instruksi?code=${code}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 500 }}>
            <IconArrowLeft size={16} /> <span className="hide-mobile">Petunjuk</span>
          </Link>
          <div style={{ width: 1, height: 16, background: 'var(--slate-200)' }}></div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-800)' }}>
            User Acceptance Testing (UAT)
          </span>
          <span className="badge badge-accent" style={{ fontSize: '0.6875rem' }}>
            {!showOverall ? `Tugas ${currentTaskIdx + 1}/${tasks.length}` : 'Ulasan Akhir'}
          </span>
        </div>

        {/* Mobile View Toggle */}
        {isMobile && (
          <div style={{ display: 'flex', background: 'var(--slate-100)', padding: '0.1875rem', borderRadius: 'var(--radius-sm)', gap: '0.25rem' }}>
            <button
              type="button"
              onClick={() => setMobileMode('panel')}
              className={`btn btn-xs ${mobileMode === 'panel' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Form UAT
            </button>
            <button
              type="button"
              onClick={() => setMobileMode('website')}
              className={`btn btn-xs ${mobileMode === 'website' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Website yang Diuji
            </button>
          </div>
        )}

        {/* Right Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-xs"
              style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <IconExternalLink size={12} /> <span className="hide-mobile">Buka di</span> Tab Baru
            </a>
          )}
          {code && (
            <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
              {code}
            </span>
          )}
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left Side: UAT Tasks / Overall Feedback Panel */}
        {(!isMobile || mobileMode === 'panel') && (
          <div
            style={{
              width: isMobile ? '100%' : '460px',
              minWidth: isMobile ? '100%' : '420px',
              maxWidth: isMobile ? '100%' : '480px',
              height: '100%',
              overflowY: 'auto',
              borderRight: '1px solid var(--slate-200)',
              background: 'var(--white)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '2px 0 10px rgba(0,0,0,0.03)',
              zIndex: 20,
            }}
          >
            {!showOverall ? (
              <>
                {/* Task Header & Progress */}
                <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Skenario Tugas {currentTaskIdx + 1} dari {tasks.length}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-sm)' }}>
                      {currentTask?.taskCode}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.1875rem', margin: '0 0 0.375rem 0', color: 'var(--slate-900)', lineHeight: 1.3 }}>
                    {currentTask?.title}
                  </h2>
                  {currentTask?.feature && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      Fitur: <strong>{currentTask.feature}</strong>
                    </span>
                  )}
                </div>

                {/* Task Details Card */}
                {currentTask && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                        Petunjuk Tugas
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--slate-800)', lineHeight: 1.6, margin: 0, background: 'var(--slate-50)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                        {currentTask.description}
                      </p>
                    </div>

                    {currentTask.expectedResult && (
                      <div style={{ padding: '0.75rem 0.875rem', background: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                          Hasil yang Diharapkan
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#1e3a8a', lineHeight: 1.4 }}>
                          {currentTask.expectedResult}
                        </div>
                      </div>
                    )}

                    {isMobile && (
                      <button
                        type="button"
                        onClick={() => setMobileMode('website')}
                        className="btn btn-secondary btn-sm btn-full"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                      >
                        Buka & Coba di Website ↗
                      </button>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--slate-100)', margin: '0.25rem 0' }} />

                    {/* Result Decision */}
                    <div>
                      <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.8125rem' }}>
                        Apakah Anda berhasil menyelesaikan tugas ini pada sistem? <span className="required">*</span>
                      </label>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[
                          { val: 'BERHASIL', label: 'Berhasil', icon: IconCheck, activeClass: 'btn-primary' },
                          { val: 'TIDAK_BERHASIL', label: 'Ada Kendala', icon: IconX, activeClass: 'btn-danger' },
                        ].map(opt => {
                          const isSelected = taskResults[currentTask.id]?.status === opt.val
                          const Icon = opt.icon
                          return (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => setTaskResults(prev => ({
                                ...prev,
                                [currentTask.id]: {
                                  ...prev[currentTask.id],
                                  status: opt.val,
                                  notes: prev[currentTask.id]?.notes || '',
                                }
                              }))}
                              className={`btn ${isSelected ? opt.activeClass : 'btn-secondary'} btn-sm`}
                              style={{ flex: 1, padding: '0.625rem 0.5rem', justifyContent: 'center' }}
                              id={`uat-task-${currentTask.id}-${opt.val.toLowerCase()}`}
                            >
                              <Icon size={14} />
                              <span>{opt.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor={`uat-notes-${currentTask.id}`} style={{ fontSize: '0.8125rem' }}>
                        Catatan atau Kendala (Opsional)
                      </label>
                      <textarea
                        id={`uat-notes-${currentTask.id}`}
                        className="form-textarea"
                        placeholder="Tuliskan jika terdapat kesulitan, saran, atau masukan..."
                        value={taskResults[currentTask.id]?.notes || ''}
                        onChange={e => setTaskResults(prev => ({
                          ...prev,
                          [currentTask.id]: {
                            ...prev[currentTask.id],
                            notes: e.target.value,
                          }
                        }))}
                        style={{ minHeight: 65, fontSize: '0.8125rem' }}
                      />
                    </div>

                    {error && (
                      <div className="alert alert-danger" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}>
                        {error}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
                      {currentTaskIdx > 0 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentTaskIdx(p => p - 1)}
                          className="btn btn-secondary btn-sm"
                        >
                          <IconArrowLeft size={14} /> Sebelumnya
                        </button>
                      ) : <div />}

                      <button
                        type="button"
                        onClick={handleTaskSubmit}
                        disabled={!taskResults[currentTask.id]?.status || submitting}
                        className="btn btn-primary btn-sm"
                        id="btn-uat-next"
                      >
                        {submitting
                          ? <span className="loading-spinner"></span>
                          : currentTaskIdx < tasks.length - 1
                            ? <>Simpan & Lanjut <IconArrowRight size={14} /></>
                            : <>Lanjut ke Ulasan Akhir <IconArrowRight size={14} /></>}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Overall Feedback Form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Tahap Terakhir
                  </div>
                  <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.375rem 0', color: 'var(--slate-900)' }}>
                    Ulasan Penerimaan Sistem (UAT)
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.4 }}>
                    Berikan penilaian umum Anda terhadap kesesuaian sistem website secara keseluruhan.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  {[
                    { key: 'r1', text: 'Secara keseluruhan, website ini memenuhi kebutuhan dan ekspektasi saya.' },
                    { key: 'r2', text: 'Fungsi dan alur layanan pada website ini dapat berjalan dengan baik dan bebas dari kesalahan fatal.' },
                    { key: 'r3', text: 'Saya dapat menggunakan website ini untuk menyelesaikan kebutuhan layanan saya dengan mudah.' },
                    { key: 'r4', text: 'Informasi dan petunjuk yang disajikan pada website ini jelas dan membantu kelancaran pengujian.' },
                    { key: 'r5', text: 'Saya merekomendasikan website ini untuk diterapkan dalam operasional pelayanan publik Disnakertrans.' },
                  ].map((q, idx) => (
                    <div key={q.key} style={{ background: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                      <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.8125rem', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                        {idx + 1}. {q.text}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.25rem' }}>
                        {RATINGS.map((val, rIdx) => {
                          const isSelected = overallRatings[q.key as keyof typeof overallRatings] === val
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setOverallRatings(prev => ({ ...prev, [q.key]: val }))}
                              className={`scale-btn ${isSelected ? 'selected' : ''}`}
                              id={`uat-overall-${q.key}-val${val}`}
                              style={{
                                height: 'auto',
                                padding: '0.5rem 0.25rem',
                                flexDirection: 'column',
                                gap: '0.125rem',
                                background: isSelected ? 'var(--slate-900)' : 'var(--white)',
                                borderColor: isSelected ? 'var(--slate-900)' : 'var(--slate-300)',
                                color: isSelected ? 'var(--white)' : 'var(--slate-700)',
                              }}
                            >
                              <span style={{ fontSize: '1rem', fontWeight: 800 }}>{val}</span>
                              <span style={{ fontSize: '0.5625rem', fontWeight: 600, opacity: 0.85, textAlign: 'center', lineHeight: 1.1 }}>
                                {RATING_LABELS[rIdx]}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Qualitative Feedback */}
                  <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: 'var(--slate-900)' }}>
                      Ulasan Kualitatif & Masukan
                    </h4>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: 'var(--slate-800)', marginBottom: '0.25rem' }}>
                        6. Apakah seluruh fungsi dan layanan pada website ini sudah sesuai dengan yang Anda harapkan? <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <textarea
                        rows={2}
                        className="form-textarea"
                        placeholder="Tuliskan jawaban Anda..."
                        value={feedback['fb1'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb1: e.target.value }))}
                        style={{ fontSize: '0.8125rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: 'var(--slate-800)', marginBottom: '0.25rem' }}>
                        7. Apakah terdapat kendala atau hal yang membingungkan selama pengujian? <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <textarea
                        rows={2}
                        className="form-textarea"
                        placeholder="Tuliskan jika ada kendala..."
                        value={feedback['fb2'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb2: e.target.value }))}
                        style={{ fontSize: '0.8125rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: 'var(--slate-800)', marginBottom: '0.25rem' }}>
                        8. Saran dan masukan untuk kesiapan penerapan website layanan ini. <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <textarea
                        rows={2}
                        className="form-textarea"
                        placeholder="Tuliskan saran dan masukan akhir Anda..."
                        value={feedback['fb3'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb3: e.target.value }))}
                        style={{ fontSize: '0.8125rem' }}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowOverall(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.625rem 0.75rem' }}
                    >
                      <IconArrowLeft size={14} /> Kembali ke Tugas
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleOverallSubmit}
                      disabled={submitting}
                      id="btn-submit-uat"
                      style={{ flex: 1, padding: '0.625rem 1rem', fontWeight: 700 }}
                    >
                      {submitting ? <><span className="loading-spinner"></span> Menyimpan...</> : <>Kirim Evaluasi UAT <IconCheck size={14} /></>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Live Website Iframe Workspace */}
        {(!isMobile || mobileMode === 'website') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--slate-100)', minWidth: 0, width: isMobile ? '100%' : 'auto', height: '100%' }}>
            {externalUrl ? (
              <>
                {/* Clean URL bar */}
                <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', zIndex: 15, flexShrink: 0 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--slate-700)', fontWeight: 500 }}>
                    Alamat Website: <strong style={{ color: 'var(--slate-900)' }}>{externalUrl}</strong>
                  </span>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                  >
                    <IconExternalLink size={12} /> Buka di Tab Baru
                  </a>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                  {!iframeError ? (
                    <iframe
                      src={getEmbeddableUrl(externalUrl)}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="UAT Workspace"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                      onLoad={() => setIframeLoaded(true)}
                      onError={() => setIframeError(true)}
                      id="uat-iframe"
                    />
                  ) : (
                    <IframeFallback url={externalUrl} />
                  )}

                  {!iframeLoaded && !iframeError && (
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--slate-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.5rem', textAlign: 'center', zIndex: 10 }}>
                      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--slate-800)', fontWeight: 600, margin: 0 }}>Sedang memuat tampilan website...</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', maxWidth: 380, margin: 0, lineHeight: 1.4 }}>
                        *Jika halaman website tidak muncul di kotak ini, klik tombol di bawah untuk membuka langsung di jendela/tab baru.
                      </p>
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                        style={{ marginTop: '0.25rem', fontWeight: 600 }}
                      >
                        <IconExternalLink size={14} /> Buka Website yang Akan Diuji di Tab Baru ↗
                      </a>
                    </div>
                  )}

                  {/* Floating Action Button for Mobile viewing Website */}
                  {isMobile && (
                    <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 25 }}>
                      <button
                        type="button"
                        onClick={() => setMobileMode('panel')}
                        className="btn btn-accent"
                        style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.25)', fontWeight: 700, fontSize: '0.8125rem', borderRadius: 'var(--radius-full)', padding: '0.625rem 1.125rem' }}
                      >
                        Kembali ke Form UAT ✎
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>URL Belum Dikonfigurasi</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                    Peneliti belum memasukkan URL website untuk tahapan ini.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function IframeFallback({ url }: { url: string }) {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: 480, textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Buka Website di Tab Baru</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Untuk kenyamanan dan keamanan tampilan, silakan klik tombol di bawah untuk membuka website resmi di tab baru. Setelah selesai mencoba, Anda bisa kembali ke halaman ini untuk mengisi evaluasi UAT.
        </p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ margin: '0 auto', fontWeight: 600 }}>
          <IconExternalLink size={16} /> Buka Website yang Akan Diuji ↗
        </a>
      </div>
    </div>
  )
}
