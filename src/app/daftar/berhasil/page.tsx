'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { IconCheck, IconArrowRight, IconLock } from '@/components/icons'

function BerhasilContent() {
  const params = useSearchParams()
  const code = params.get('code') || ''
  const name = params.get('name') || ''

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 520, width: '100%' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <IconCheck size={24} />
          </div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: '0.25rem' }}>Registrasi Berhasil</h1>
          <p>Selamat datang, <strong style={{ color: 'var(--slate-900)' }}>{name}</strong></p>
        </div>

        {/* Code Box */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Participant Code Anda
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '0.1em', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
              {code}
            </div>
            <div className="alert alert-warning" style={{ marginTop: '1.25rem', textAlign: 'left' }}>
              <IconLock size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Harap simpan kode ini!</strong> Catat atau ambil tangkapan layar (screenshot). Kode ini diperlukan saat Anda kembali mengikuti tahap evaluasi berikutnya.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href={`/peserta/${code}`} className="btn btn-primary btn-lg btn-full" id="btn-lihat-status">
            Lanjut ke Dashboard Evaluasi <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BerhasilPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat...</div>}>
      <BerhasilContent />
    </Suspense>
  )
}
