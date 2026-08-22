'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { IconCheck, IconArrowRight, IconLock } from '@/components/icons'

const COMPLETION_TEXTS: Record<string, { title: string; desc: string }> = {
  SUS: {
    title: 'Evaluasi Tahap 1 Selesai',
    desc: 'Terima kasih atas penilaian System Usability Scale (SUS) yang Anda berikan. Tahapan berikutnya akan dibuka ketika pengujian prototype siap dilaksanakan.',
  },
  UEQ: {
    title: 'Evaluasi Tahap 2 Selesai',
    desc: 'Terima kasih telah mengevaluasi prototype redesign melalui User Experience Questionnaire (UEQ). Anda akan dihubungi untuk tahap pengujian website final.',
  },
  UAT: {
    title: 'User Acceptance Testing Selesai',
    desc: 'Anda telah menyelesaikan seluruh skenario pengujian dan kuesioner penerimaan sistem. Kontribusi Anda sangat berarti bagi pengembangan layanan ini.',
  },
}

function SelesaiContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || ''
  const instrument = searchParams.get('instrument') || 'SUS'

  const content = COMPLETION_TEXTS[instrument] || COMPLETION_TEXTS.SUS

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <IconCheck size={24} />
          </div>

          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{content.title}</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
            {content.desc}
          </p>

          <div style={{ padding: '0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
            Kode Peserta: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate-900)' }}>{code}</strong>
          </div>
        </div>

        {/* Reward Claim Card specifically for UAT (Final Phase) */}
        {instrument === 'UAT' && (
          <div className="card" style={{ marginBottom: '1.25rem', background: '#fefce8', borderColor: '#fef08a', textAlign: 'center' }}>
            <div className="card-body" style={{ padding: '1.5rem 1.25rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
              <h3 style={{ fontSize: '1.125rem', color: '#854d0e', marginBottom: '0.375rem' }}>
                Klaim Hadiah / Insentif Evaluasi
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#713f12', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Sebagai bentuk apresiasi atas partisipasi Anda menyelesaikan seluruh rangkaian pengujian dari awal hingga akhir, silakan klik tombol di bawah untuk mengklaim e-wallet / hadiah Anda.
              </p>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Link hadiah / e-wallet dapat dihubungkan ke link e-wallet / Google Form klaim sesuai kebijakan peneliti.') }}
                className="btn btn-accent btn-lg btn-full"
                style={{ background: '#ca8a04', borderColor: '#ca8a04', color: '#ffffff', fontWeight: 700 }}
                id="btn-klaim-hadiah"
              >
                🎁 Klaim Hadiah / Insentif Responden
              </a>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href={`/peserta/${code}`} className="btn btn-primary btn-lg btn-full" id="btn-lihat-progress">
            Kembali ke Dashboard Peserta <IconArrowRight size={16} />
          </Link>
          <Link href="/" className="btn btn-secondary btn-full">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SelesaiPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat...</div>}>
      <SelesaiContent />
    </Suspense>
  )
}
