'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconArrowRight, IconExternalLink, IconClipboard, IconX, IconCheck } from '@/components/icons'
import { SUS_ITEMS, SUS_SCALE, SUS_FEEDBACK_ITEMS } from '@/lib/sus-instrument'

interface Task { id: number; taskCode: string; title: string; description: string; order: number }
interface PhaseDetail {
  id: number; phaseNumber: number; phaseName: string; instrument: string;
  status: string; externalUrl: string; tasks: Task[]
}

export default function TestingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const phaseId = params.phaseId as string
  const code = searchParams.get('code') || ''

  const [phase, setPhase] = useState<PhaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [showTasks, setShowTasks] = useState(true)
  const [activeTab, setActiveTab] = useState<'tasks' | 'questionnaire'>('tasks')
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Mobile responsiveness states
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMode, setMobileMode] = useState<'panel' | 'website'>('panel')

  // State for Embedded SUS Questionnaire
  const [susResponses, setSusResponses] = useState<(number | null)[]>(Array(10).fill(null))
  const [susFeedback, setSusFeedback] = useState<Record<string, string>>({})
  const [submittingSus, setSubmittingSus] = useState(false)
  const [susError, setSusError] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
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
          setPhase(p || null)
        }
      })
      .catch(err => console.error('Fetch phase error:', err))
      .finally(() => setLoading(false))
  }, [phaseId])

  useEffect(() => {
    if (phase?.externalUrl) {
      // Auto-dismiss loading spinner after 2.5s if browser blocks iframe due to X-Frame-Options
      const timer = setTimeout(() => {
        setIframeLoaded(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const getQuestionnaireUrl = () => {
    if (!phase) return '#'
    const map: Record<string, string> = { SUS: 'sus', UEQ: 'ueq', UAT: 'uat' }
    return `/fase/${phaseId}/${map[phase.instrument]}?code=${code}`
  }

  const handleEmbeddedSusSubmit = async () => {
    const answeredCount = susResponses.filter(r => r !== null).length
    if (answeredCount < 10) {
      setSusError(`Mohon jawab seluruh 10 pernyataan SUS (${answeredCount}/10 terisi).`)
      return
    }
    setSusError('')
    setSubmittingSus(true)
    try {
      const res = await fetch('/api/sus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantCode: code,
          phaseId: parseInt(phaseId),
          responses: susResponses,
          feedback: susFeedback,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan Kuesioner SUS')
      router.push(`/fase/${phaseId}/selesai?code=${code}&instrument=SUS`)
    } catch (err: any) {
      setSusError(err.message)
    } finally {
      setSubmittingSus(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  if (!phase) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Tahap tidak ditemukan.</p>
    </div>
  )

  const susAnsweredCount = susResponses.filter(r => r !== null).length

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--white)' }}>
      {/* Sleek Modern Header */}
      <header style={{
        background: 'linear-gradient(to right, #0f172a, #1e293b)',
        color: 'var(--white)',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        flexShrink: 0,
        zIndex: 30,
        minHeight: 52
      }}>
        {/* Title Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: '#2563eb', color: '#fff', flexShrink: 0 }}>
            Tahap 0{phase.phaseNumber}
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {phase.phaseName}
          </span>
        </div>

        {/* Action Buttons Header */}
        {!isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {phase.externalUrl && (
              <a
                href={phase.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78125rem' }}
                title="Buka website di tab baru"
              >
                <IconExternalLink size={13} />
                <span>Buka di Tab Baru ↗</span>
              </a>
            )}

            <button
              onClick={() => setShowTasks(!showTasks)}
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78125rem' }}
            >
              <IconClipboard size={13} />
              <span>{showTasks ? 'Sembunyikan Panel' : 'Tampilkan Panel'}</span>
            </button>

            {activeTab !== 'questionnaire' ? (
              <button
                onClick={() => { setShowTasks(true); setActiveTab('questionnaire') }}
                className="btn btn-sm btn-accent"
                style={{ fontSize: '0.78125rem', fontWeight: 700 }}
              >
                <span>Isi Kuesioner {phase.instrument}</span>
                <IconArrowRight size={13} />
              </button>
            ) : (
              <Link
                href={getQuestionnaireUrl()}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.78125rem' }}
              >
                <span>Kuesioner Layar Penuh ↗</span>
              </Link>
            )}
          </div>
        ) : (
          /* Mobile View Switcher Segmented Bar */
          <div style={{ display: 'flex', width: '100%', background: 'rgba(255, 255, 255, 0.1)', padding: '0.2rem', borderRadius: 'var(--radius-md)', gap: '0.25rem' }}>
            <button
              type="button"
              onClick={() => setMobileMode('panel')}
              style={{
                flex: 1,
                padding: '0.4rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mobileMode === 'panel' ? '#2563eb' : 'transparent',
                color: 'var(--white)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              📋 Tugas & Kuesioner
            </button>
            <button
              type="button"
              onClick={() => setMobileMode('website')}
              style={{
                flex: 1,
                padding: '0.4rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mobileMode === 'website' ? '#2563eb' : 'transparent',
                color: 'var(--white)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              🌐 Web Target
            </button>
            {phase.externalUrl && (
              <a
                href={phase.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.4rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'var(--white)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <IconExternalLink size={12} /> Tab Baru
              </a>
            )}
          </div>
        )}
      </header>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Panel Sidebar (Tasks / Questionnaire) */}
        {(!isMobile ? showTasks : mobileMode === 'panel') && (
          <div style={{
            width: isMobile ? '100%' : (activeTab === 'questionnaire' ? 380 : 320),
            background: 'var(--white)',
            borderRight: isMobile ? 'none' : '1px solid var(--slate-200)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            zIndex: 20,
            transition: 'width 0.2s',
            height: '100%',
            overflow: 'hidden'
          }}>
            {/* Sidebar Tab Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', background: 'var(--slate-50)' }}>
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  border: 'none',
                  background: activeTab === 'tasks' ? 'var(--white)' : 'transparent',
                  borderBottom: activeTab === 'tasks' ? '2px solid var(--slate-900)' : 'none',
                  fontWeight: activeTab === 'tasks' ? 700 : 500,
                  fontSize: '0.8125rem',
                  color: activeTab === 'tasks' ? 'var(--slate-900)' : 'var(--slate-500)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                }}
              >
                Daftar Tugas ({phase.tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('questionnaire')}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  border: 'none',
                  background: activeTab === 'questionnaire' ? 'var(--white)' : 'transparent',
                  borderBottom: activeTab === 'questionnaire' ? '2px solid var(--slate-900)' : 'none',
                  fontWeight: activeTab === 'questionnaire' ? 700 : 500,
                  fontSize: '0.8125rem',
                  color: activeTab === 'questionnaire' ? 'var(--slate-900)' : 'var(--slate-500)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                }}
              >
                Kuesioner {phase.instrument} {susAnsweredCount > 0 ? `(${susAnsweredCount}/10)` : ''}
              </button>
            </div>

            {/* TAB 1: DAFTAR TUGAS */}
            {activeTab === 'tasks' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Cobalah tugas berikut pada website target:</span>
                </div>

                {phase.tasks.map((task, idx) => (
                  <div key={task.id} style={{ padding: '0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: 'var(--slate-200)', color: 'var(--slate-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>{task.description}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {phase.tasks.length === 0 && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', textAlign: 'center', padding: '1rem' }}>
                    Tidak ada daftar tugas khusus. Silakan eksplorasi website/prototype secara bebas.
                  </p>
                )}

                {isMobile ? (
                  <button
                    type="button"
                    onClick={() => setMobileMode('website')}
                    className="btn btn-secondary btn-sm btn-full"
                    style={{ marginTop: '0.5rem' }}
                  >
                    🌐 Buka & Uji Website Target <IconArrowRight size={14} />
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setActiveTab('questionnaire')}
                  className="btn btn-primary btn-sm btn-full"
                  style={{ marginTop: '0.25rem' }}
                >
                  Selesai Menguji & Isi Kuesioner <IconArrowRight size={14} />
                </button>
              </div>
            )}

            {/* TAB 2: KUESIONER SIDE-BY-SIDE */}
            {activeTab === 'questionnaire' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {phase.instrument === 'SUS' ? (
                  <>
                    <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.9375rem', margin: 0 }}>System Usability Scale (SUS)</h4>
                        <Link href={getQuestionnaireUrl()} style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>
                          Layar Penuh ↗
                        </Link>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '0.25rem 0 0 0' }}>
                        Nilai 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju) setelah mencoba website.
                      </p>
                    </div>

                    {/* 10 SUS Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      {SUS_ITEMS.map((item, idx) => (
                        <div key={item.id} style={{ padding: '0.75rem', background: susResponses[idx] !== null ? '#f0fdf4' : 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: `1px solid ${susResponses[idx] !== null ? '#bbf7d0' : 'var(--slate-200)'}` }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                            {item.id}. {item.text}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--slate-400)' }}>STS</span>
                            <div style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
                              {SUS_SCALE.map(scale => (
                                <button
                                  key={scale.value}
                                  type="button"
                                  onClick={() => {
                                    const next = [...susResponses]
                                    next[idx] = scale.value
                                    setSusResponses(next)
                                  }}
                                  style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    border: `1.5px solid ${susResponses[idx] === scale.value ? 'var(--slate-900)' : 'var(--slate-300)'}`,
                                    background: susResponses[idx] === scale.value ? 'var(--slate-900)' : 'var(--white)',
                                    color: susResponses[idx] === scale.value ? 'var(--white)' : 'var(--slate-700)',
                                    fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                  }}
                                >
                                  {scale.value}
                                </button>
                              ))}
                            </div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--slate-400)' }}>SS</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Feedback Items */}
                    <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      <h5 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Masukan & Feedback Kualitatif</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {SUS_FEEDBACK_ITEMS.map((item) => (
                          <div key={item.id}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.25rem' }}>
                              {item.text}
                            </label>
                            {item.type === 'text' && (
                              <textarea
                                rows={2}
                                placeholder={(item as any).placeholder || "Tuliskan jawaban Anda atau ketik 'Tidak ada'..."}
                                value={susFeedback[item.id] || ''}
                                onChange={e => setSusFeedback(prev => ({ ...prev, [item.id]: e.target.value }))}
                                style={{ width: '100%', padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-300)', fontSize: '0.75rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                              />
                            )}
                            {item.type === 'radio' && item.options && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {item.options.map(opt => (
                                  <label key={opt} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`embedded-${item.id}`}
                                      value={opt}
                                      checked={susFeedback[item.id] === opt}
                                      onChange={() => setSusFeedback(prev => ({ ...prev, [item.id]: opt }))}
                                    />
                                    {opt}
                                  </label>
                                ))}
                              </div>
                            )}
                            {item.id === 'fb6' && susFeedback['fb6'] === 'Ya' && (
                              <div style={{ marginTop: '0.375rem' }}>
                                <input
                                  type="tel"
                                  placeholder="Nomor WA (contoh: 081234567890)"
                                  value={susFeedback['fb6_phone'] || ''}
                                  onChange={e => setSusFeedback(prev => ({ ...prev, fb6_phone: e.target.value }))}
                                  style={{ width: '100%', padding: '0.375rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #86efac', boxSizing: 'border-box' }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {susError && (
                      <div className="alert alert-danger" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
                        {susError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleEmbeddedSusSubmit}
                      disabled={submittingSus}
                      className="btn btn-primary btn-sm btn-full"
                      style={{ marginTop: '0.5rem', padding: '0.625rem 1rem' }}
                    >
                      {submittingSus ? 'Menyimpan data...' : 'Kirim Kuesioner SUS'}
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
                      Silakan buka mode kuesioner lengkap untuk mengisi instrumen {phase.instrument}.
                    </p>
                    <Link href={getQuestionnaireUrl()} className="btn btn-primary btn-sm">
                      Buka Kuesioner {phase.instrument} <IconArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Iframe Viewport */}
        {(!isMobile || mobileMode === 'website') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--slate-100)', minWidth: 0, width: isMobile ? '100%' : 'auto', height: '100%' }}>
            {phase.externalUrl ? (
              <>
                {/* Clean URL bar */}
                <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', zIndex: 15, flexShrink: 0 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--slate-700)', fontWeight: 500 }}>
                    🌐 Target Website: <strong style={{ color: 'var(--slate-900)' }}>{phase.externalUrl}</strong>
                  </span>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                  {!iframeError ? (
                    <iframe
                      src={phase.externalUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title={`${phase.phaseName} Workspace`}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                      onLoad={() => setIframeLoaded(true)}
                      onError={() => setIframeError(true)}
                      id="testing-iframe"
                    />
                  ) : (
                    <IframeFallback url={phase.externalUrl} />
                  )}

                  {!iframeLoaded && !iframeError && (
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--slate-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.5rem', textAlign: 'center', zIndex: 10 }}>
                      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--slate-800)', fontWeight: 600, margin: 0 }}>Menghubungkan ke website target...</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', maxWidth: 380, margin: 0, lineHeight: 1.4 }}>
                        *Catatan: Server pemerintah (`.go.id`) terkadang membatasi tampilan di dalam frame demi keamanan browser HP.
                      </p>
                      <a
                        href={phase.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                        style={{ marginTop: '0.25rem' }}
                      >
                        <IconExternalLink size={14} /> Buka Website Target di Tab Baru ↗
                      </a>
                    </div>
                  )}

                  {/* Floating Action Button for Mobile viewing Website */}
                  {isMobile && (
                    <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 25 }}>
                      <button
                        type="button"
                        onClick={() => { setMobileMode('panel'); setActiveTab('questionnaire') }}
                        className="btn btn-accent"
                        style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.25)', fontWeight: 700, fontSize: '0.8125rem', borderRadius: 'var(--radius-full)', padding: '0.625rem 1.125rem' }}
                      >
                        📋 Isi Kuesioner {phase.instrument}
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
                    Peneliti belum memasukkan URL untuk tahapan ini. Silakan hubungi admin atau langsung lanjut ke kuesioner jika telah mencoba di perangkat lain.
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
      <div className="card" style={{ maxWidth: 460, textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Buka Website di Tab Baru</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
          Server target (`.go.id`) membatasi tampilan langsung di dalam frame demi keamanan. Silakan buka website target di tab terpisah.
        </p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ margin: '0 auto' }}>
          <IconExternalLink size={16} /> Buka Website Target ↗
        </a>
      </div>
    </div>
  )
}
