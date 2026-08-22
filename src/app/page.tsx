'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconArrowRight, IconLock, IconShield, IconClipboard, IconBarChart, IconLayers, IconCheck } from '@/components/icons'

export default function LandingPage() {
  const [settings, setSettings] = useState<any>({
    researchTitle: 'Pengembangan Sistem Informasi Layanan Dinas Tenaga Kerja dan Transmigrasi Kabupaten Serang Berbasis Web dengan Pendekatan User Centered Design (UCD)',
    researcherName: 'Siti Nurfadiyah',
    welcomeGreeting: 'Halo, Bapak/Ibu/Rekan-rekan sekalian!\n\nPerkenalkan, saya Siti Nurfadiyah. Saat ini saya sedang melakukan penelitian mengenai "Pengembangan Sistem Informasi Layanan Dinas Tenaga Kerja dan Transmigrasi Kabupaten Serang Berbasis Web dengan Pendekatan User Centered Design (UCD)".\n\nMohon kesediaan dan bantuan Bapak/Ibu/Rekan-rekan sekalian untuk berpartisipasi dalam pengujian serta memberikan penilaian jujur pada kuesioner evaluasi ini. Masukan dan bantuan Anda sangat berharga bagi peningkatan kualitas pelayanan publik digital. Terima kasih banyak atas waktu dan bantuannya!',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
      {/* Header / Navbar */}
      <header style={{ borderBottom: '1px solid #e2e8f0', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 2px 8px rgba(15,23,42,0.15)' }}>
              <IconShield size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>Portal Evaluasi UX</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Disnakertrans Kabupaten Serang</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/masuk" className="btn btn-secondary btn-sm" id="btn-login-header" style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1rem' }}>
              Masuk dengan Kode
            </Link>
            <Link href="/daftar" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1.125rem' }}>
              Daftar Responden
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{ padding: '4rem 0 3.5rem', background: 'radial-gradient(100% 100% at 50% 0%, #eff6ff 0%, #ffffff 70%)', borderBottom: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
          {/* Ambient Glow Orbs */}
          <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.08), transparent 70%)', pointerEvents: 'none' }} />

          <div className="container" style={{ maxWidth: 860, position: 'relative', zIndex: 10 }}>
            {/* Researcher Pill Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.375rem 0.875rem 0.375rem 0.5rem', background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-full)', boxShadow: '0 2px 6px rgba(37,99,235,0.08)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800 }}>
                  SN
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#1e40af', fontWeight: 600 }}>
                  Peneliti: <strong>{settings.researcherName || 'Siti Nurfadiyah'}</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                  UCD Method
                </span>
              </div>
            </div>

            {/* Title Hierarchy */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2563eb', display: 'block', marginBottom: '0.5rem' }}>
                Penelitian Evaluasi Kebergunaan & UX Digital
              </span>
              <h1 style={{ fontSize: '2.125rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Evaluasi & Redesign Layanan Informasi Disnakertrans Kab. Serang
              </h1>

              {/* Collapsible/Subtle Research Title Box */}
              <div style={{ display: 'inline-block', maxWidth: 740, background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: '#475569', fontWeight: 600, lineHeight: 1.5 }}>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>Judul Resmi: </span>
                "{settings.researchTitle}"
              </div>
            </div>

            {/* Personal Letter / Welcome Greeting Card */}
            <div className="card" style={{ padding: '1.75rem 2rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-xl)', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)', marginBottom: '2.25rem', textAlign: 'left', borderLeft: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#eff6ff', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  👋
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Surat Permohonan Partisipasi Responden</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Dari Siti Nurfadiyah untuk Bapak/Ibu/Rekan-rekan Responden</span>
                </div>
              </div>

              <div style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line', fontStyle: 'normal' }}>
                {settings.welcomeGreeting}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: '#1e293b', background: '#f8fafc', padding: '0.35rem 0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <span>⏱️ Estimasi Waktu: 5–10 Menit</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#f0fdf4', padding: '0.35rem 0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <span>🔒 Data Dijamin Anonim & Rahasia</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', background: '#eff6ff', padding: '0.35rem 0.625rem', borderRadius: 'var(--radius-sm)' }}>
                  <span>🏆 3 Tahapan Pengujian Mandiri</span>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/daftar"
                className="btn btn-accent btn-lg"
                id="btn-mulai-evaluasi"
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                Mulai Partisipasi & Pengisian <IconArrowRight size={18} />
              </Link>
              <Link
                href="/masuk"
                className="btn btn-secondary btn-lg"
                id="btn-punya-code"
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.875rem 1.75rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                }}
              >
                Saya Sudah Memiliki Kode Responden
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Phases Overview */}
        <section style={{ padding: '4.5rem 0', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb' }}>
                Metodologi Riset Terstruktur
              </span>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                3 Tahapan Evaluasi Pengalaman Pengguna
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                Pengujian dilakukan bertahap menggunakan instrumen baku terstandarisasi internasional.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Card 1 */}
              <div className="card card-hover" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9375rem' }}>
                    01
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Phase 1</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', marginBottom: '0.375rem' }}>
                  Website Existing
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.625rem' }}>
                  System Usability Scale (SUS)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Penilaian kebergunaan (usability) pada website Disnakertrans yang saat ini beroperasi menggunakan 10 butir standar baku.
                </p>
              </div>

              {/* Card 2 */}
              <div className="card card-hover" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9375rem' }}>
                    02
                  </div>
                  <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>Phase 2</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', marginBottom: '0.375rem' }}>
                  Prototype Redesign
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.625rem' }}>
                  User Experience Questionnaire (UEQ)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Pengujian rancangan visual & interaksi baru mencakup 6 dimensi (Daya Tarik, Kejelasan, Efisiensi, Ketepatan, Stimulasi, & Kebaruan).
                </p>
              </div>

              {/* Card 3 */}
              <div className="card card-hover" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9375rem' }}>
                    03
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Phase 3</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#16a34a', marginBottom: '0.375rem' }}>
                  Website Final
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.625rem' }}>
                  User Acceptance Testing (UAT)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Pengujian penerimaan sistem akhir berbasis skenario tugas nyata (task success rate & time-on-task).
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Informational Banner */}
        <section style={{ padding: '2.5rem 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <div className="content-container">
            <div className="alert alert-info" style={{ borderRadius: 'var(--radius-lg)', padding: '1.125rem 1.25rem' }}>
              <IconLock size={20} style={{ flexShrink: 0, marginTop: 2, color: '#2563eb' }} />
              <div style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: 1.6 }}>
                <strong>Panduan Singkat Partisipasi:</strong> Cukup mendaftar satu kali untuk mendapatkan <em>Participant Code</em> unik Anda. Gunakan kode tersebut untuk masuk dan menyelesaikan setiap tahapan pengujian.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc', padding: '2rem 0', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
        <div className="container">
          <p>© 2026 Platform Riset Evaluasi UX — Siti Nurfadiyah (Disnakertrans Kabupaten Serang)</p>
        </div>
      </footer>
    </div>
  )
}
