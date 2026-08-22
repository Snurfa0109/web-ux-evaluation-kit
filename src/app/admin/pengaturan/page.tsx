'use client'

import { useEffect, useState } from 'react'
import { IconSettings, IconShield, IconInfo, IconTrash, IconX, IconEdit } from '@/components/icons'

export default function PengaturanPage() {
  const [showResetModal, setShowResetModal] = useState(false)
  const [confirmInput, setConfirmInput] = useState('')
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState('')

  // System Settings state
  const [settings, setSettings] = useState({
    researchTitle: '',
    researcherName: '',
    welcomeGreeting: '',
    appDescription: '',
  })
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Gagal menyimpan pengaturan')
      setMessage('Pengaturan Judul Penelitian & Teks Pembuka Halaman Depan berhasil diperbarui!')
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleResetData = async () => {
    if (confirmInput !== 'RESET') return
    setResetting(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText: confirmInput }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mereset data')
      setMessage('Berhasil: Seluruh data uji coba responden telah dibersihkan. Sistem siap untuk Go-Live!')
      setShowResetModal(false)
      setConfirmInput('')
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="admin-content fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Pengaturan Penelitian</h1>
        <p className="page-subtitle">Konfigurasi metodologi penelitian, identitas peneliti, dan teks halaman depan</p>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {/* Dynamic Front-Page Settings Card */}
      <form onSubmit={handleSaveSettings} className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconEdit size={16} /> Pengaturan Teks Halaman Depan & Identitas Peneliti
          </h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="inp-research-title">
              Judul Penelitian / Skripsi <span className="required">*</span>
            </label>
            <textarea
              id="inp-research-title"
              className="form-textarea"
              rows={2}
              value={settings.researchTitle}
              onChange={e => setSettings(prev => ({ ...prev, researchTitle: e.target.value }))}
              placeholder="Contoh: PENGEMBANGAN SISTEM INFORMASI LAYANAN..."
              required
              style={{ minHeight: 60, fontWeight: 600 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="inp-researcher-name">
              Nama Peneliti <span className="required">*</span>
            </label>
            <input
              id="inp-researcher-name"
              type="text"
              className="form-input"
              value={settings.researcherName}
              onChange={e => setSettings(prev => ({ ...prev, researcherName: e.target.value }))}
              placeholder="Contoh: Siti Nurfadiyah"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="inp-welcome-greeting">
              Teks Pembuka & Permohonan Bantuan Responden <span className="required">*</span>
            </label>
            <textarea
              id="inp-welcome-greeting"
              className="form-textarea"
              rows={4}
              value={settings.welcomeGreeting}
              onChange={e => setSettings(prev => ({ ...prev, welcomeGreeting: e.target.value }))}
              placeholder="Tuliskan kalimat permohonan bantuan kepada responden..."
              required
            />
            <span className="form-hint">Kalimat ini akan tampil di bagian depan (Hero Section) saat responden membuka website/pendaftaran.</span>
          </div>

          <div>
            <button
              type="submit"
              disabled={savingSettings}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.625rem 1.25rem' }}
            >
              {savingSettings ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan Halaman Depan'}
            </button>
          </div>
        </div>
      </form>

      {/* Overview Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Informasi Umum Penelitian</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Judul Penelitian', value: settings.researchTitle || 'PENGEMBANGAN SISTEM INFORMASI...' },
            { label: 'Nama Peneliti', value: settings.researcherName || 'Siti Nurfadiyah' },
            { label: 'Target Partisipan', value: '30 Responden Utama (Longitudinal)' },
            { label: 'Strategi Responden', value: 'Same Participants (Peserta yang sama mengikuti 3 tahap)' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--slate-100)', fontSize: '0.875rem', gap: '1rem' }}>
              <span style={{ color: 'var(--slate-500)' }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--slate-900)', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>


      {/* Instruments Specification */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem' }}>Spesifikasi Instrumen Terstandarisasi</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            { phase: 'Tahap 1', name: 'System Usability Scale (SUS)', version: '10 Item Terstandarisasi', scale: '1–5 Skala Likert', scoring: 'Formula Baku SUS (0–100)', target: 'Website Existing Disnakertrans' },
            { phase: 'Tahap 2', name: 'User Experience Questionnaire (UEQ)', version: '26 Item Lengkap (6 Dimensi)', scale: '7-point Semantic Differential', scoring: 'Rata-rata 6 Dimensi (-3 s.d. +3)', target: 'Prototype Redesign (Figma/Stitch)' },
            { phase: 'Tahap 3', name: 'User Acceptance Testing (UAT)', version: 'Researcher-defined (Task-based)', scale: 'Keberhasilan Tugas + Skala Likert 1–5', scoring: 'Task Success Rate (%) & Acceptance Mean', target: 'Website Final' },
          ].map(inst => (
            <div key={inst.phase} style={{ padding: '1rem 1.25rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--white)', background: 'var(--slate-900)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)' }}>
                  {inst.phase}
                </span>
                <strong style={{ fontSize: '0.9375rem', color: 'var(--slate-900)' }}>{inst.name}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div><span style={{ color: 'var(--slate-500)' }}>Versi: </span><span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{inst.version}</span></div>
                <div><span style={{ color: 'var(--slate-500)' }}>Skala: </span><span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{inst.scale}</span></div>
                <div><span style={{ color: 'var(--slate-500)' }}>Kalkulasi: </span><span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{inst.scoring}</span></div>
                <div><span style={{ color: 'var(--slate-500)' }}>Objek Uji: </span><span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{inst.target}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="card" style={{ borderColor: 'var(--danger-border)', marginBottom: '1.5rem' }}>
        <div className="card-header" style={{ background: 'var(--danger-light)', borderBottom: '1px solid var(--danger-border)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconTrash size={16} /> Zona Bahaya: Perataan / Reset Data Uji Coba
          </h3>
        </div>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              Kosongkan Seluruh Data Pengetesan Responden (Persiapan Go-Live)
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
              Tindakan ini akan menghapus seluruh profil responden, skor SUS, UEQ, dan hasil UAT yang ada saat ini agar dapat dimulai murni dari awal.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="btn btn-danger btn-sm"
            style={{ padding: '0.5rem 1rem' }}
          >
            Reset Data Pengetesan
          </button>
        </div>
      </div>

      <div className="alert alert-info">
        <IconInfo size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          Kuesioner SUS dan UEQ menggunakan butir pernyataan resmi tervalidasi. Seluruh rumus kalkulasi skor dijalankan secara otomatis di sisi server untuk menjamin integritas data penelitian.
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1rem', color: 'var(--danger)' }}>Konfirmasi Reset Data Go-Live</h3>
              <button onClick={() => setShowResetModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <IconX size={16} />
              </button>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', margin: 0 }}>
                Ketikkan kata <strong>RESET</strong> di bawah ini untuk mengonfirmasi pembersihan seluruh data uji coba.
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="Ketik RESET"
                value={confirmInput}
                onChange={e => setConfirmInput(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowResetModal(false)} className="btn btn-secondary btn-sm">
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleResetData}
                  disabled={confirmInput !== 'RESET' || resetting}
                  className="btn btn-danger btn-sm"
                >
                  {resetting ? 'Mereset Data...' : 'Konfirmasi Kosongkan Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

