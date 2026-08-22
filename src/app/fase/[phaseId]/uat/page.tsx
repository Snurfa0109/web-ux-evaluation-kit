'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconArrowRight, IconCheck, IconX, IconExternalLink } from '@/components/icons'

interface Task {
  id: number; taskCode: string; feature: string; title: string;
  description: string; expectedResult: string; acceptanceCriteria: string; order: number
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

  useEffect(() => {
    fetch('/api/admin/phases')
      .then(r => r.json())
      .then(phases => {
        const p = phases.find((ph: any) => ph.id === parseInt(phaseId))
        if (p) {
          setTasks(p.tasks || [])
          setExternalUrl(p.externalUrl || '')
        }
        setLoading(false)
      })
  }, [phaseId])

  const submitTask = async (taskId: number, status: string, notes: string) => {
    const res = await fetch('/api/uat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantCode: code, phaseId: parseInt(phaseId), taskId, status, notes }),
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
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/fase/${phaseId}/testing?code=${code}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            <IconArrowLeft size={16} /> Kembali ke Uji Coba
          </Link>
          <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            User Acceptance Testing (UAT)
          </span>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="content-container">
          {!showOverall ? (
            <>
              {/* Task Header & Progress */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Skenario Tugas {currentTaskIdx + 1} dari {tasks.length}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                    Kode: {currentTask?.taskCode}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{currentTask?.title}</h1>
              </div>

              {/* Task Details Card */}
              {currentTask && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                        Instruksi Tugas
                      </div>
                      <p style={{ fontSize: '1rem', color: 'var(--slate-900)', fontWeight: 500, margin: 0 }}>
                        {currentTask.description}
                      </p>
                    </div>

                    {currentTask.expectedResult && (
                      <div style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                          Hasil yang Diharapkan
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--slate-700)' }}>
                          {currentTask.expectedResult}
                        </div>
                      </div>
                    )}

                    {externalUrl && (
                      <div>
                        <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                          <IconExternalLink size={14} /> Buka Halaman Terkait
                        </a>
                      </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--slate-100)' }} />

                    {/* Result Decision */}
                    <div>
                      <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                        Apakah Anda berhasil menyelesaikan tugas ini pada sistem? <span className="required">*</span>
                      </label>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {[
                          { val: 'BERHASIL', label: 'Berhasil', icon: IconCheck, activeClass: 'btn-primary' },
                          { val: 'TIDAK_BERHASIL', label: 'Tidak Berhasil / Ada Kendala', icon: IconX, activeClass: 'btn-danger' },
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
                              className={`btn ${isSelected ? opt.activeClass : 'btn-secondary'}`}
                              style={{ flex: 1, padding: '0.875rem', justifyContent: 'center' }}
                              id={`uat-task-${currentTask.id}-${opt.val.toLowerCase()}`}
                            >
                              <Icon size={16} />
                              <span>{opt.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="form-group">
                      <label className="form-label" htmlFor={`uat-notes-${currentTask.id}`}>
                        Catatan atau Kendala (Opsional)
                      </label>
                      <textarea
                        id={`uat-notes-${currentTask.id}`}
                        className="form-textarea"
                        placeholder="Tuliskan jika terdapat kesulitan, pesan error, atau masukan..."
                        value={taskResults[currentTask.id]?.notes || ''}
                        onChange={e => setTaskResults(prev => ({
                          ...prev,
                          [currentTask.id]: {
                            ...prev[currentTask.id],
                            notes: e.target.value,
                          }
                        }))}
                        style={{ minHeight: 70 }}
                      />
                    </div>

                    {error && (
                      <div className="alert alert-danger">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      className="btn btn-primary"
                      id="btn-uat-next"
                    >
                      {submitting
                        ? <span className="loading-spinner"></span>
                        : currentTaskIdx < tasks.length - 1
                          ? <>Simpan & Lanjut <IconArrowRight size={15} /></>
                          : <>Lanjut ke Ulasan Akhir <IconArrowRight size={15} /></>}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Overall Feedback Form */
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Tahap Terakhir
                </div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Ulasan Penerimaan Sistem (UAT)</h1>
                <p>Berikan penilaian umum Anda terhadap kesesuaian sistem website final secara keseluruhan.</p>
              </div>

              <div className="card">
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { key: 'r1', text: 'Secara keseluruhan, website ini memenuhi kebutuhan dan ekspektasi saya.' },
                    { key: 'r2', text: 'Fungsi dan alur layanan pada website ini dapat berjalan dengan baik dan bebas dari kesalahan fatal.' },
                    { key: 'r3', text: 'Saya dapat menggunakan website ini untuk menyelesaikan kebutuhan layanan saya dengan mudah.' },
                    { key: 'r4', text: 'Informasi dan petunjuk yang disajikan pada website ini jelas dan membantu kelancaran pengujian.' },
                    { key: 'r5', text: 'Saya merekomendasikan website ini untuk diterapkan dalam operasional pelayanan publik Disnakertrans.' },
                  ].map((q, idx) => (
                    <div key={q.key}>
                      <p style={{ fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.75rem' }}>
                        {idx + 1}. {q.text}
                      </p>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {RATINGS.map((val, rIdx) => {
                          const isSelected = overallRatings[q.key as keyof typeof overallRatings] === val
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setOverallRatings(prev => ({ ...prev, [q.key]: val }))}
                              className={`scale-btn ${isSelected ? 'selected' : ''}`}
                              id={`uat-overall-${q.key}-val${val}`}
                              style={{ height: 'auto', padding: '0.75rem 0.5rem', flexDirection: 'column', gap: '0.25rem' }}
                            >
                              <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{val}</span>
                              <span style={{ fontSize: '0.6875rem', fontWeight: 500, opacity: 0.8, textAlign: 'center', lineHeight: 1.2 }}>
                                {RATING_LABELS[rIdx]}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Qualitative Feedback Section for UAT */}
                  <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Ulasan Kualitatif & Feedback Akhir</h4>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)', marginBottom: '0.375rem' }}>
                        6. Apakah seluruh fungsi dan layanan pada website ini sudah sesuai dengan yang Anda harapkan? Jelaskan singkat. <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        placeholder="Tuliskan jawaban Anda..."
                        value={feedback['fb1'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb1: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)', marginBottom: '0.375rem' }}>
                        7. Apakah terdapat kendala atau bug yang Anda temukan selama pengujian website ini? <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        placeholder="Tuliskan jika ada kendala/bug yang ditemukan..."
                        value={feedback['fb2'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb2: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)', marginBottom: '0.375rem' }}>
                        8. Saran dan kritik akhir untuk kesiapan penerapan website layanan Disnakertrans Kabupaten Serang. <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        placeholder="Tuliskan saran dan masukan akhir Anda..."
                        value={feedback['fb3'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb3: e.target.value }))}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary btn-lg btn-full"
                    onClick={handleOverallSubmit}
                    disabled={submitting}
                    id="btn-submit-uat"
                    style={{ marginTop: '0.5rem' }}
                  >
                    {submitting ? <><span className="loading-spinner"></span> Menyimpan...</> : <>Kirim Evaluasi UAT <IconCheck size={16} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
