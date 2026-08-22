'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SUS_ITEMS, SUS_SCALE, SUS_FEEDBACK_ITEMS } from '@/lib/sus-instrument'
import { IconArrowLeft, IconArrowRight, IconCheck, IconInfo, IconClipboard } from '@/components/icons'

interface Task { id: number; taskCode: string; title: string; description: string; order: number }

type FeedbackValues = Record<string, string>

export default function SusPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const phaseId = params.phaseId as string
  const code = searchParams.get('code') || ''

  const [responses, setResponses] = useState<(number | null)[]>(Array(10).fill(null))
  const [feedback, setFeedback] = useState<FeedbackValues>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTasks, setShowTasks] = useState(true)

  useEffect(() => {
    fetch('/api/admin/phases')
      .then(r => r.json())
      .then((phases: any[]) => {
        const phase = phases.find(p => p.id === parseInt(phaseId))
        if (phase?.tasks) setTasks(phase.tasks)
      })
  }, [phaseId])

  const answeredCount = responses.filter(r => r !== null).length
  const allSusAnswered = answeredCount === 10

  // Check all required feedback answered
  const standardFeedbackAnswered = SUS_FEEDBACK_ITEMS.every(item =>
    !item.required || (feedback[item.id] && feedback[item.id].trim() !== '')
  )
  const phoneAnswered = feedback['fb6'] !== 'Ya' || Boolean(feedback['fb6_phone'] && feedback['fb6_phone'].trim() !== '')
  const allFeedbackAnswered = standardFeedbackAnswered && phoneAnswered
  const allAnswered = allSusAnswered && allFeedbackAnswered
  const totalItems = 10 + SUS_FEEDBACK_ITEMS.length + (feedback['fb6'] === 'Ya' ? 1 : 0)

  const handleSubmit = async () => {
    if (!allSusAnswered) { setError('Mohon jawab seluruh 10 pernyataan SUS sebelum submit.'); return }
    if (!allFeedbackAnswered) { setError('Mohon lengkapi seluruh pertanyaan feedback.'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/sus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantCode: code,
          phaseId: parseInt(phaseId),
          responses,
          feedback,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/fase/${phaseId}/selesai?code=${code}&instrument=SUS`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const answeredFeedbackCount = SUS_FEEDBACK_ITEMS.filter(
    item => feedback[item.id] && feedback[item.id].trim() !== ''
  ).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.875rem 0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/fase/${phaseId}/testing?code=${code}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            <IconArrowLeft size={16} /> Kembali ke Uji Coba
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>
              Terisi: {answeredCount + answeredFeedbackCount}/{totalItems}
            </span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="questionnaire-container">
          {/* Task Summary */}
          {tasks.length > 0 && (
            <div style={{
              marginBottom: '2rem',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              <button
                type="button"
                onClick={() => setShowTasks(t => !t)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1.25rem',
                  background: 'var(--slate-50)',
                  border: 'none',
                  cursor: 'pointer',
                  borderBottom: showTasks ? '1px solid var(--slate-200)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconClipboard size={15} style={{ color: 'var(--slate-500)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                    Skenario Tugas yang Telah Diuji ({tasks.length} tugas)
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  {showTasks ? 'Sembunyikan ▲' : 'Tampilkan ▼'}
                </span>
              </button>

              {showTasks && (
                <div style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {tasks.map((task, idx) => (
                    <div key={task.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.625rem 0', borderBottom: idx < tasks.length - 1 ? '1px solid var(--slate-100)' : 'none' }}>
                      <div style={{ minWidth: 22, height: 22, borderRadius: '50%', background: 'var(--slate-200)', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.125rem' }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>{task.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Instrumen Evaluasi
            </div>
            <h1 style={{ fontSize: '1.625rem', marginBottom: '0.5rem' }}>System Usability Scale (SUS)</h1>
            <p style={{ margin: 0 }}>
              Pilih nilai 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju) yang paling menggambarkan pengalaman Anda.
            </p>
          </div>

          {/* SUS Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SUS_ITEMS.map((item, idx) => (
              <div key={item.id} className={`sus-item ${responses[idx] !== null ? 'answered' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span className="sus-item-number">{String(item.id).padStart(2, '0')}</span>
                  <div className="sus-item-text" style={{ margin: 0 }}>{item.text}</div>
                </div>

                <div>
                  <div className="sus-scale-labels">
                    <span>Sangat Tidak Setuju</span>
                    <span>Sangat Setuju</span>
                  </div>

                  <div className="sus-scale">
                    {SUS_SCALE.map(scale => (
                      <button
                        key={scale.value}
                        type="button"
                        className={`scale-btn ${responses[idx] === scale.value ? 'selected' : ''}`}
                        onClick={() => {
                          const newResp = [...responses]
                          newResp[idx] = scale.value
                          setResponses(newResp)
                        }}
                        id={`sus-q${item.id}-val${scale.value}`}
                      >
                        {scale.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Section */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{
              borderTop: '2px solid var(--slate-200)',
              paddingTop: '2rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Bagian Kedua
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.375rem' }}>Pertanyaan Feedback</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', margin: 0 }}>
                Jawaban Anda sangat berharga untuk membantu pengembangan website lebih lanjut.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {SUS_FEEDBACK_ITEMS.map((item, idx) => (
                <div
                  key={item.id}
                  className={`sus-item ${feedback[item.id] && feedback[item.id].trim() ? 'answered' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span className="sus-item-number">{String(10 + idx + 1).padStart(2, '0')}</span>
                    <div className="sus-item-text" style={{ margin: 0 }}>
                      {item.text}
                      {item.required && (
                        <span style={{ color: 'var(--danger)', marginLeft: '0.25rem' }}>*</span>
                      )}
                    </div>
                  </div>

                  {item.type === 'text' && (
                    <textarea
                      id={`sus-${item.id}`}
                      rows={3}
                      placeholder={(item as any).placeholder || "Tuliskan jawaban Anda atau ketik 'Tidak ada'..."}
                      value={feedback[item.id] || ''}
                      onChange={e => setFeedback(prev => ({ ...prev, [item.id]: e.target.value }))}

                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1.5px solid var(--slate-200)',
                        fontSize: '0.9375rem',
                        fontFamily: 'inherit',
                        color: 'var(--slate-800)',
                        background: 'var(--white)',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.15s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--slate-200)')}
                    />
                  )}

                  {item.type === 'radio' && item.options && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {item.options.map(opt => (
                        <label
                          key={opt}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            padding: '0.625rem 1.25rem',
                            borderRadius: '0.5rem',
                            border: `1.5px solid ${feedback[item.id] === opt ? 'var(--accent)' : 'var(--slate-200)'}`,
                            background: feedback[item.id] === opt ? 'var(--accent-light, #eef2ff)' : 'var(--white)',
                            fontWeight: feedback[item.id] === opt ? 600 : 400,
                            color: feedback[item.id] === opt ? 'var(--accent)' : 'var(--slate-700)',
                            transition: 'all 0.15s',
                            userSelect: 'none',
                          }}
                        >
                          <input
                            type="radio"
                            name={item.id}
                            value={opt}
                            checked={feedback[item.id] === opt}
                            onChange={() => setFeedback(prev => ({ ...prev, [item.id]: opt }))}
                            style={{ display: 'none' }}
                            id={`sus-${item.id}-${opt}`}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {item.id === 'fb6' && feedback['fb6'] === 'Ya' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#166534', marginBottom: '0.375rem' }}>
                        📱 Nomor WhatsApp / HP (Aktif) <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '0 0 0.5rem 0' }}>
                        Nomor ini hanya digunakan untuk menghubungi Anda saat tahap pengujian berikutnya (UEQ / UAT) siap dilaksanakan.
                      </p>
                      <input
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        value={feedback['fb6_phone'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb6_phone: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.875rem',
                          borderRadius: '0.375rem',
                          border: '1.5px solid #86efac',
                          fontSize: '0.9375rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--slate-900)',
                          background: 'var(--white)',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        id="input-whatsapp-number"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginTop: '1.5rem' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <div style={{ marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg btn-full"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              id="btn-submit-sus"
            >
              {submitting
                ? <><span className="loading-spinner"></span> Menyimpan data...</>
                : allAnswered
                  ? <>Kirim Kuesioner SUS <IconArrowRight size={16} /></>
                  : `Lengkapi ${(10 - answeredCount) + (SUS_FEEDBACK_ITEMS.length - answeredFeedbackCount)} pertanyaan lagi`}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
