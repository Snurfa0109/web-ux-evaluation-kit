'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { IconCheck, IconShield } from '@/components/icons'

const INSTRUMENT_LABELS: Record<string, string> = {
  SUS: 'System Usability Scale (SUS)',
  UEQ: 'User Experience Questionnaire (UEQ)',
  UAT: 'User Acceptance Testing (UAT)',
}

interface PhaseData {
  id: number
  phaseNumber: number
  phaseName: string
  instrument: string
  participantStatus: string
}

function SelesaiContent() {
  const params = useSearchParams()
  const code = params.get('code') || ''

  const [phases, setPhases] = useState<PhaseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) { setLoading(false); return }
    fetch(`/api/participant/${code}`)
      .then(r => r.json())
      .then(data => {
        if (data?.phases) setPhases(data.phases)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [code])

  const completedPhases = phases.filter(p => p.participantStatus === 'completed')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
        {/* Success Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-light)', border: '2px solid var(--success-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '1.25rem' }}>
          <IconCheck size={32} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>
          Evaluasi Selesai! 🎉
        </h1>
        <p style={{ fontSize: '0.9375rem', marginBottom: '2rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
          Terima kasih atas partisipasi Anda dalam penelitian evaluasi UX website Disnakertrans Kabupaten Serang.
          Kontribusi Anda sangat berarti dalam pengembangan layanan digital publik.
        </p>

        {/* Phase summary - dynamic */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header"><h3 style={{ fontSize: '1rem' }}>Ringkasan Partisipasi</h3></div>
          <div className="card-body">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <div className="loading-spinner" style={{ width: 24, height: 24, color: 'var(--slate-500)' }}></div>
              </div>
            ) : completedPhases.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {completedPhases.map((p, idx) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1rem', background: 'var(--success-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success-border)' }}>
                    <IconCheck size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>Phase {p.phaseNumber} — Selesai ✓</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-700)' }}>{INSTRUMENT_LABELS[p.instrument] || p.phaseName}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Fallback jika tidak ada data (e.g., tidak ada code)
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { phase: 'Phase 1', label: 'System Usability Scale (SUS)' },
                  { phase: 'Phase 2', label: 'User Experience Questionnaire (UEQ)' },
                  { phase: 'Phase 3', label: 'User Acceptance Testing (UAT)' },
                ].map(p => (
                  <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1rem', background: 'var(--success-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success-border)' }}>
                    <IconCheck size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>{p.phase} — Selesai</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-700)' }}>{p.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Privacy note */}
        <div className="alert alert-info" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <IconShield size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--accent)' }} />
          <div style={{ fontSize: '0.8125rem' }}>
            Data yang Anda berikan akan dirahasiakan dan hanya digunakan untuk keperluan penelitian akademik. Hasil penelitian tidak akan menampilkan identitas Anda secara personal.
          </div>
        </div>

        <Link href="/" className="btn btn-primary btn-lg btn-full" style={{ borderRadius: 'var(--radius-full)' }}>
          Kembali ke Beranda
        </Link>

        {code && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Participant Code: <strong style={{ fontFamily: 'var(--font-mono)' }}>{code}</strong>
          </p>
        )}
      </div>
    </div>
  )
}

export default function FinalSelesaiPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat...</div>}>
      <SelesaiContent />
    </Suspense>
  )
}
