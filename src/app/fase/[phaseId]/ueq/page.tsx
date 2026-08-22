'use client'

import { useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { UEQ_ITEMS, UEQ_DIMENSIONS, UEQ_FEEDBACK_ITEMS } from '@/lib/ueq-instrument'
import { IconArrowLeft, IconArrowRight } from '@/components/icons'

type FeedbackValues = Record<string, string>

export default function UeqPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const phaseId = params.phaseId as string
  const code = searchParams.get('code') || ''

  const [responses, setResponses] = useState<(number | null)[]>(Array(26).fill(null))
  const [feedback, setFeedback] = useState<FeedbackValues>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const answeredCount = responses.filter(r => r !== null).length
  const allUeqAnswered = answeredCount === 26

  const standardFeedbackAnswered = UEQ_FEEDBACK_ITEMS.every(item =>
    !item.required || (feedback[item.id] && feedback[item.id].trim() !== '')
  )
  const phoneAnswered = feedback['fb4'] !== 'Ya' || Boolean(feedback['fb4_phone'] && feedback['fb4_phone'].trim() !== '')
  const allFeedbackAnswered = standardFeedbackAnswered && phoneAnswered
  const allAnswered = allUeqAnswered && allFeedbackAnswered

  const totalItems = 26 + UEQ_FEEDBACK_ITEMS.length + (feedback['fb4'] === 'Ya' ? 1 : 0)
  const answeredFeedbackCount = UEQ_FEEDBACK_ITEMS.filter(
    item => feedback[item.id] && feedback[item.id].trim() !== ''
  ).length + (feedback['fb4'] === 'Ya' && feedback['fb4_phone']?.trim() ? 1 : 0)

  const handleSubmit = async () => {
    if (!allUeqAnswered) { setError('Mohon lengkapi semua 26 item UEQ sebelum submit.'); return }
    if (!allFeedbackAnswered) { setError('Mohon lengkapi seluruh pertanyaan feedback.'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/ueq', {
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
      router.push(`/fase/${phaseId}/selesai?code=${code}&instrument=UEQ`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const UEQ_VALUES = [1, 2, 3, 4, 5, 6, 7]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.875rem 0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/fase/${phaseId}/testing?code=${code}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            <IconArrowLeft size={16} /> Kembali ke Uji Coba
          </Link>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>
            Terisi: {answeredCount + answeredFeedbackCount}/{totalItems}
          </span>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="questionnaire-container">
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Instrumen Evaluasi
            </div>
            <h1 style={{ fontSize: '1.625rem', marginBottom: '0.5rem' }}>User Experience Questionnaire (UEQ)</h1>
            <p style={{ margin: 0 }}>
              Pilih satu angka di antara dua kata sifat berlawanan yang paling mencerminkan kesan Anda terhadap prototype yang baru saja dicoba.
            </p>
          </div>

          {/* UEQ Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {UEQ_ITEMS.map((item, idx) => (
              <div key={item.id} className={`ueq-item card ${responses[idx] !== null ? 'answered' : ''}`}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Item {String(item.id).padStart(2, '0')}
                </div>

                <div className="ueq-row">
                  <span className="ueq-left">{item.left}</span>
                  <div className="ueq-scale">
                    {UEQ_VALUES.map(val => (
                      <button
                        key={val}
                        type="button"
                        className={`ueq-btn ${responses[idx] === val ? 'selected' : ''}`}
                        onClick={() => {
                          const newResp = [...responses]
                          newResp[idx] = val
                          setResponses(newResp)
                        }}
                        id={`ueq-item${item.id}-val${val}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <span className="ueq-right">{item.right}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Section for UEQ */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ borderTop: '2px solid var(--slate-200)', paddingTop: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Bagian Kedua
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.375rem' }}>Pertanyaan Feedback Prototype</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', margin: 0 }}>
                Masukan Anda sangat berharga untuk menyempurnakan prototype sebelum dikembangkan menjadi website final.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {UEQ_FEEDBACK_ITEMS.map((item, idx) => (
                <div key={item.id} className={`sus-item card ${feedback[item.id] && feedback[item.id].trim() ? 'answered' : ''}`} style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span className="sus-item-number">{String(26 + idx + 1).padStart(2, '0')}</span>
                    <div className="sus-item-text" style={{ margin: 0 }}>
                      {item.text}
                      {item.required && <span style={{ color: 'var(--danger)', marginLeft: '0.25rem' }}>*</span>}
                    </div>
                  </div>

                  {item.type === 'text' && (
                    <textarea
                      id={`ueq-${item.id}`}
                      rows={3}
                      placeholder="Tuliskan jawaban Anda di sini..."
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
                        boxSizing: 'border-box',
                      }}
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
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {item.id === 'fb4' && feedback['fb4'] === 'Ya' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#166534', marginBottom: '0.375rem' }}>
                        📱 Nomor WhatsApp / HP (Aktif) <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '0 0 0.5rem 0' }}>
                        Nomor ini digunakan untuk menghubungi Anda saat tahap pengujian akhir (UAT) siap dilaksanakan.
                      </p>
                      <input
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        value={feedback['fb4_phone'] || ''}
                        onChange={e => setFeedback(prev => ({ ...prev, fb4_phone: e.target.value }))}
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
              id="btn-submit-ueq"
            >
              {submitting
                ? <><span className="loading-spinner"></span> Menyimpan data...</>
                : allAnswered
                  ? <>Kirim Kuesioner UEQ <IconArrowRight size={16} /></>
                  : `Lengkapi ${26 - answeredCount} item lagi`}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
