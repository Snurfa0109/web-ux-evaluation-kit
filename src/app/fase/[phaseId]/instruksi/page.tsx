'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { IconArrowRight, IconArrowLeft, IconClipboard, IconInfo } from '@/components/icons'

interface PhaseDetail {
  id: number
  phaseNumber: number
  phaseName: string
  instrument: string
  status: string
  instructions: string
  externalUrl: string
  tasks: { id: number; taskCode: string; title: string; description: string; order: number }[]
}

export default function InstruksiPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const phaseId = params.phaseId as string
  const code = searchParams.get('code') || ''

  const [phase, setPhase] = useState<PhaseDetail | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  if (!phase) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Tahap Tidak Ditemukan</h2>
        <Link href={`/peserta/${code}`} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Kembali ke Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/peserta/${code}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            <IconArrowLeft size={16} /> Dashboard Peserta
          </Link>
          <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Tahap 0{phase.phaseNumber}</span>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="content-container">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Petunjuk Pengujian
            </div>
            <h1 style={{ fontSize: '1.625rem', marginBottom: '0.5rem' }}>{phase.phaseName}</h1>
            <p style={{ margin: 0 }}>Harap baca panduan dan daftar tugas sebelum mencoba sistem.</p>
          </div>

          {/* Step-by-Step Guide for Laypeople */}
          <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'var(--white)' }}>
            <div className="card-body" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Alur Pengujian Responden
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--white)', marginBottom: '1rem' }}>
                Bagaimana Cara Mengikuti Pengujian Ini?
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {/* Step 1 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ background: '#2563eb', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem' }}>1</span>
                    <strong style={{ fontSize: '0.9375rem', color: '#93c5fd' }}>Uji Coba Website Target</strong>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-300)', margin: 0, lineHeight: 1.5 }}>
                    Pertama, Anda akan membuka website target <strong>Disnakertrans</strong>. Coba lakukan 4 skenario tugas sehari-hari (Mencari Loker, Pelatihan BLK, Kartu Kuning AK-1, & Kontak).
                  </p>
                </div>

                {/* Step 2 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ background: '#10b981', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem' }}>2</span>
                    <strong style={{ fontSize: '0.9375rem', color: '#a7f3d0' }}>Isi Kuesioner {phase.instrument}</strong>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-300)', margin: 0, lineHeight: 1.5 }}>
                    Setelah selesai mencoba website target, klik tombol <strong>"Isi Kuesioner {phase.instrument}"</strong> untuk memberikan penilaian dan masukan jujur Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Task list */}
          {phase.tasks.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '1rem' }}>Skenario Tugas Pengujian</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', margin: '0.25rem 0 0 0' }}>
                    Cobalah bayangkan posisi Anda dalam setiap situasi di bawah ini saat membuka website:
                  </p>
                </div>
                <span className="badge badge-neutral" style={{ flexShrink: 0 }}>{phase.tasks.length} Tugas</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {phase.tasks.map((task, idx) => (
                  <div key={task.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--slate-900)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>{task.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>{task.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start CTA */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              href={`/fase/${phaseId}/testing?code=${code}`}
              className="btn btn-primary btn-lg"
              id="btn-mulai-testing"
              style={{ flex: 1, padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '1rem' }}
            >
              Buka Website Target & Mulai Pengujian <IconArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
