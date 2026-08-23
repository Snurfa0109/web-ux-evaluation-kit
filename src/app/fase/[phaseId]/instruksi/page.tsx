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

          {/* General instructions */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1rem' }}>Petunjuk Pelaksanaan</h3>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, margin: 0 }}>
                {phase.instructions || 'Silakan coba fitur yang tersedia dan selesaikan skenario tugas yang ditentukan.'}
              </p>

              <div className="alert alert-info" style={{ marginTop: '1.25rem' }}>
                <IconInfo size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  Setelah mencoba sistem dan menyelesaikan tugas-tugas di bawah, Anda akan diarahkan untuk mengisi kuesioner evaluasi <strong>{phase.instrument}</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Task list */}
          {phase.tasks.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 style={{ fontSize: '1rem' }}>Skenario Tugas</h3>
                <span className="badge badge-neutral">{phase.tasks.length} Tugas</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {phase.tasks.map((task, idx) => (
                  <div key={task.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--slate-900)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>{task.title}</div>
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
              style={{ flex: 1 }}
            >
              Mulai Uji Coba Sistem <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
