'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function SelesaiContent() {
  const params = useSearchParams()
  const code = params.get('code') || ''

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
        {/* Trophy */}
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🏆</div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
          Seluruh Evaluasi Telah Selesai ✓
        </h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--gray-600)', lineHeight: 1.65 }}>
          Terima kasih atas partisipasi Anda dalam penelitian evaluasi UX website Disnakertrans Kabupaten Serang.
          Kontribusi Anda sangat berarti dalam pengembangan layanan digital pemerintah.
        </p>

        {/* Phase summary */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header"><h3>Ringkasan Partisipasi</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { phase: 'Phase 1', label: 'System Usability Scale (SUS)', icon: '✅' },
                { phase: 'Phase 2', label: 'User Experience Questionnaire (UEQ)', icon: '✅' },
                { phase: 'Phase 3', label: 'User Acceptance Testing (UAT)', icon: '✅' },
              ].map(p => (
                <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: 'var(--success-bg)', borderRadius: '0.625rem', border: '1px solid #86efac' }}>
                  <span style={{ fontSize: '1.25rem' }}>{p.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>{p.phase} — Selesai</div>
                    <div style={{ fontSize: '0.8125rem', color: '#166534' }}>{p.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy note */}
        <div className="alert alert-info" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <span>🔒</span>
          <div>
            Data yang Anda berikan akan dirahasiakan dan hanya digunakan untuk keperluan penelitian akademik. Hasil penelitian tidak akan menampilkan identitas Anda secara personal.
          </div>
        </div>

        <Link href="/" className="btn btn-primary btn-lg btn-full">
          Kembali ke Beranda
        </Link>

        <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
          Participant Code: <strong style={{ fontFamily: 'monospace' }}>{code}</strong>
        </p>
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
