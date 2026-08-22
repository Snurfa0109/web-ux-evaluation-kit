'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconArrowRight, IconLock, IconShield, IconClipboard, IconBarChart, IconLayers, IconCheck } from '@/components/icons'

export default function LandingPage() {
  const [settings, setSettings] = useState<any>({
    researchTitle: 'PENGEMBANGAN SISTEM INFORMASI LAYANAN DINAS TENAGA KERJA DAN TRANSMIGRASI KABUPATEN SERANG BERBASIS WEB DENGAN PENDEKATAN USER CENTERED DESIGN (UCD)',
    researcherName: 'Siti Nurfadiyah',
    welcomeGreeting: 'Halo, Bapak/Ibu/Rekan-rekan sekalian!\n\nPerkenalkan, saya Siti Nurfadiyah. Saat ini saya sedang melakukan penelitian mengenai "PENGEMBANGAN SISTEM INFORMASI LAYANAN DINAS TENAGA KERJA DAN TRANSMIGRASI KABUPATEN SERANG BERBASIS WEB DENGAN PENDEKATAN USER CENTERED DESIGN (UCD)".\n\nMohon kesediaan dan bantuan Bapak/Ibu/Rekan-rekan sekalian untuk berpartisipasi dalam pengujian serta memberikan penilaian jujur pada kuesioner evaluasi ini. Masukan dan bantuan Anda sangat berharga bagi peningkatan kualitas pelayanan publik digital. Terima kasih banyak atas waktu dan bantuannya!',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      {/* Header / Navbar */}
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--slate-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
              <IconShield size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)' }}>Portal Evaluasi UX</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Disnakertrans Kab. Serang</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/daftar" className="btn btn-secondary btn-sm">
              Daftar
            </Link>
            <Link href="/masuk" className="btn btn-primary btn-sm" id="btn-login-header">
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{ padding: '3.5rem 0 3.5rem', borderBottom: '1px solid var(--slate-100)', background: 'radial-gradient(ellipse at top, var(--slate-50), var(--white))' }}>
          <div className="container" style={{ maxWidth: 840, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.875rem', background: 'var(--slate-100)', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '1.25rem' }}>
              <span>Peneliti: <strong>{settings.researcherName || 'Siti Nurfadiyah'}</strong></span>
            </div>

            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.35, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              {settings.researchTitle}
            </h1>

            {/* Welcome Greeting Banner */}
            <div className="card" style={{ textAlign: 'left', padding: '1.25rem 1.5rem', background: 'var(--white)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {settings.welcomeGreeting}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/daftar" className="btn btn-primary btn-lg" id="btn-mulai-evaluasi">
                Mulai Partisipasi & Pengisian <IconArrowRight size={16} />
              </Link>
              <Link href="/masuk" className="btn btn-secondary btn-lg" id="btn-punya-code">
                Saya Sudah Memiliki Kode
              </Link>
            </div>
          </div>
        </section>


        {/* 3 Phases Overview */}
        <section style={{ padding: '4rem 0', background: 'var(--slate-50)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Tahapan Evaluasi</h2>
              <p style={{ color: 'var(--slate-500)' }}>Pengujian dilakukan bertahap menggunakan instrumen standar tervalidasi</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="card card-hover" style={{ padding: '1.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--slate-100)', color: 'var(--slate-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontWeight: 700, fontSize: '0.875rem' }}>
                  01
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '0.375rem' }}>
                  Website Existing
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>System Usability Scale (SUS)</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Evaluasi tingkat kebergunaan (*usability*) pada website Disnakertrans yang saat ini beroperasi menggunakan 10 item pernyataan standar.
                </p>
              </div>

              <div className="card card-hover" style={{ padding: '1.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--slate-100)', color: 'var(--slate-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontWeight: 700, fontSize: '0.875rem' }}>
                  02
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '0.375rem' }}>
                  Prototype Redesign
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>User Experience Questionnaire (UEQ)</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Pengujian rancangan desain baru mencakup 6 dimensi pengalaman pengguna (*Daya Tarik, Kejelasan, Efisiensi, Ketepatan, Stimulasi, dan Kebaruan*).
                </p>
              </div>

              <div className="card card-hover" style={{ padding: '1.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--slate-100)', color: 'var(--slate-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontWeight: 700, fontSize: '0.875rem' }}>
                  03
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '0.375rem' }}>
                  Website Final
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>User Acceptance Testing (UAT)</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Pengujian fungsionalitas dan penerimaan sistem pada implementasi akhir website berbasis skenario tugas terstruktur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Note */}
        <section style={{ padding: '2.5rem 0', background: 'var(--white)', borderTop: '1px solid var(--slate-200)' }}>
          <div className="content-container">
            <div className="alert alert-info">
              <IconLock size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Informasi Partisipasi:</strong> Anda cukup mendaftar satu kali untuk mendapatkan <em>Participant Code</em> unik. Kode tersebut digunakan untuk mengakses seluruh tahapan penelitian sesuai jadwal yang ditentukan.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--slate-200)', background: 'var(--slate-50)', padding: '1.75rem 0', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
        <div className="container">
          <p>© 2026 Platform Penelitian Evaluasi UX — Disnakertrans Kabupaten Serang</p>
        </div>
      </footer>
    </div>
  )
}
