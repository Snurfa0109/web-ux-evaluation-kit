'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconCheck, IconLock, IconArrowRight, IconUser, IconShield, IconInfo } from '@/components/icons'


interface PhaseData {
  id: number
  phaseNumber: number
  phaseName: string
  instrument: string
  phaseStatus: string
  participantStatus: 'completed' | 'available' | 'locked' | 'not_started'
  completedAt: string | null
}

interface ParticipantData {
  participantCode: string
  name: string
  whatsappNumber?: string | null
  phases: PhaseData[]
}

const INSTRUMENT_LABELS: Record<string, string> = {
  SUS: 'System Usability Scale (SUS)',
  UEQ: 'User Experience Questionnaire (UEQ)',
  UAT: 'User Acceptance Testing (UAT)',
}

const PHASE_DESCRIPTIONS: Record<string, string> = {
  SUS: 'Evaluasi kebergunaan website existing melalui 10 butir pertanyaan.',
  UEQ: 'Pengujian pengalaman pengguna pada prototype redesign (26 item, 6 dimensi).',
  UAT: 'Uji penerimaan sistem berbasis skenario tugas pada website final.',
}

export default function PesertaPage() {
  const params = useParams()
  const router = useRouter()
  const code = (params.code as string).toUpperCase()

  const [data, setData] = useState<ParticipantData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/participant/${code}`)
      .then(res => {
        if (!res.ok) throw new Error('Participant code tidak ditemukan')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [code])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  if (error || !data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Kode Tidak Ditemukan</h2>
        <p style={{ marginBottom: '1.5rem' }}>{error || 'Data peserta tidak tersedia.'}</p>
        <Link href="/masuk" className="btn btn-primary">Masukkan Kode Lain</Link>
      </div>
    </div>
  )

  const visiblePhases = data.phases.filter(phase => phase.phaseStatus !== 'DRAFT' || phase.participantStatus === 'completed')
  const completedCount = visiblePhases.filter(p => p.participantStatus === 'completed').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/evalux.png" alt="Evalux Logo" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
          </div>
          <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Keluar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="content-container">
          {/* User Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Responden
                </div>
                <h2 style={{ fontSize: '1.375rem', marginBottom: '0.25rem' }}>{data.name}</h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>Kode: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate-900)' }}>{data.participantCode}</strong></span>
                  {data.whatsappNumber && (
                    <span>WhatsApp: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate-900)' }}>{data.whatsappNumber}</strong></span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Progres
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {completedCount} / {visiblePhases.length} Tahap
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Invitation Banner if participant has WhatsApp number and an available phase exists */}
          {data.whatsappNumber && visiblePhases.some(p => p.participantStatus === 'available' && p.phaseNumber > 1) && (
            <div className="card" style={{ marginBottom: '1.5rem', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div className="card-body" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div style={{ color: '#166534', flexShrink: 0, marginTop: 2 }}>
                    <IconInfo size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#166534', marginBottom: '0.25rem' }}>
                      Undangan Pengujian Lanjutan
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#15803d', margin: 0, lineHeight: 1.5 }}>
                      Halo <strong>{data.name}</strong>, terima kasih telah bersedia berpartisipasi dan memberikan nomor WhatsApp Anda (<code>{data.whatsappNumber}</code>).
                      Tahap evaluasi selanjutnya telah dibuka dan siap dikerjakan. Silakan pilih tahap di bawah ini untuk membantu kami melanjutkan kuesioner!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phase List */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Tahapan Penelitian</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', margin: 0 }}>Pilih tahapan yang aktif untuk memulai pengujian.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {visiblePhases.map(phase => {
              const isDone = phase.participantStatus === 'completed'
              const isAvailable = phase.participantStatus === 'available'
              const isLocked = phase.participantStatus === 'locked' || phase.participantStatus === 'not_started'

              return (
                <div
                  key={phase.id}
                  className="card"
                  style={{
                    borderColor: isAvailable ? 'var(--slate-400)' : isDone ? 'var(--success-border)' : 'var(--slate-200)',
                    background: isDone ? 'var(--white)' : isAvailable ? 'var(--white)' : 'var(--slate-50)',
                  }}
                >
                  <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {/* Phase Number Indicator */}
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: isDone ? 'var(--success-light)' : isAvailable ? 'var(--slate-900)' : 'var(--slate-200)',
                      color: isDone ? 'var(--success)' : isAvailable ? 'var(--white)' : 'var(--slate-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      flexShrink: 0,
                    }}>
                      {isDone ? <IconCheck size={20} /> : `0${phase.phaseNumber}`}
                    </div>

                    {/* Phase Info */}
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '1rem', margin: 0 }}>{phase.phaseName}</h4>
                        {isDone && <span className="badge badge-success">Selesai</span>}
                        {isAvailable && <span className="badge badge-accent">Siap Dikerjakan</span>}
                        {isLocked && <span className="badge badge-neutral">Belum Dibuka</span>}
                      </div>

                      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
                        {INSTRUMENT_LABELS[phase.instrument]} — {PHASE_DESCRIPTIONS[phase.instrument]}
                      </p>

                      {phase.completedAt && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.375rem' }}>
                          Selesai pada {new Date(phase.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div style={{ flexShrink: 0 }}>
                      {isAvailable && (
                        <Link href={`/fase/${phase.id}/instruksi?code=${code}`} className="btn btn-primary" id={`btn-mulai-fase-${phase.phaseNumber}`}>
                          Mulai Tahap Ini <IconArrowRight size={15} />
                        </Link>
                      )}
                      {isDone && (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <IconCheck size={16} /> Lengkap
                        </span>
                      )}
                      {isLocked && (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--slate-400)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <IconLock size={14} /> Belum aktif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {visiblePhases.length === 0 && (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                  Belum ada tahapan pengujian yang dibuka oleh peneliti saat ini. Silakan periksa kembali secara berkala.
                </p>
              </div>
            )}
          </div>

          {/* All done message */}
          {completedCount === visiblePhases.length && visiblePhases.length > 0 && (
            <div className="card" style={{ marginTop: '2rem', borderColor: 'var(--success-border)', background: 'var(--success-light)' }}>
              <div className="card-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--white)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <IconCheck size={20} />
                </div>
                <h3 style={{ color: '#166534', marginBottom: '0.375rem' }}>Seluruh Tahapan Telah Selesai</h3>
                <p style={{ color: '#166534', fontSize: '0.875rem', margin: 0 }}>
                  Terima kasih banyak atas partisipasi Anda dalam membantu evaluasi layanan Disnakertrans Kabupaten Serang.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
