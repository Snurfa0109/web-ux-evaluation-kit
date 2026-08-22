'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconArrowRight, IconShield, IconArrowLeft } from '@/components/icons'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', age: '', gender: '', occupation: '',
    governmentWebsiteExperience: '', disnakertransExperience: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.age || !form.gender || !form.occupation ||
        !form.governmentWebsiteExperience || !form.disnakertransExperience) {
      setError('Mohon lengkapi seluruh isian.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/participant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: parseInt(form.age),
          gender: form.gender,
          occupation: form.occupation,
          governmentWebsiteExperience: form.governmentWebsiteExperience === 'ya',
          disnakertransExperience: form.disnakertransExperience === 'ya',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registrasi gagal')

      router.push(`/daftar/berhasil?code=${data.participantCode}&name=${encodeURIComponent(data.name)}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const setField = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--white)', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-600)' }}>
            <IconArrowLeft size={16} /> Beranda
          </Link>
          <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Pendaftaran Responden</span>
        </div>
      </header>

      {/* Form Area */}
      <main style={{ flex: 1, padding: '3rem 0 4rem' }}>
        <div className="content-container">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.625rem', marginBottom: '0.375rem' }}>Data Responden</h1>
            <p>Isi data profil singkat berikut sebelum memulai evaluasi sistem.</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Nama Lengkap <span className="required">*</span>
                </label>
                <input
                  id="reg-name"
                  className="form-input"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-age">
                    Usia <span className="required">*</span>
                  </label>
                  <input
                    id="reg-age"
                    className="form-input"
                    type="number"
                    placeholder="Contoh: 24"
                    min={15}
                    max={80}
                    value={form.age}
                    onChange={e => setField('age', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-gender">
                    Jenis Kelamin <span className="required">*</span>
                  </label>
                  <select
                    id="reg-gender"
                    className="form-select"
                    value={form.gender}
                    onChange={e => setField('gender', e.target.value)}
                    required
                  >
                    <option value="">Pilih...</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-occ">
                  Pekerjaan / Aktivitas <span className="required">*</span>
                </label>
                <input
                  id="reg-occ"
                  className="form-input"
                  type="text"
                  placeholder="Contoh: Mahasiswa, Pegawai Swasta, Pencari Kerja, ASN"
                  value={form.occupation}
                  onChange={e => setField('occupation', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Pernah mengakses website layanan pemerintah daerah? <span className="required">*</span>
                </label>
                <div className="radio-group">
                  {['ya', 'tidak'].map(v => (
                    <label key={v} className={`radio-option ${form.governmentWebsiteExperience === v ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gov-exp"
                        value={v}
                        checked={form.governmentWebsiteExperience === v}
                        onChange={() => setField('governmentWebsiteExperience', v)}
                      />
                      {v === 'ya' ? 'Pernah' : 'Belum Pernah'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Pernah mengakses website Disnakertrans Kabupaten Serang sebelumnya? <span className="required">*</span>
                </label>
                <div className="radio-group">
                  {['ya', 'tidak'].map(v => (
                    <label key={v} className={`radio-option ${form.disnakertransExperience === v ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="dis-exp"
                        value={v}
                        checked={form.disnakertransExperience === v}
                        onChange={() => setField('disnakertransExperience', v)}
                      />
                      {v === 'ya' ? 'Pernah' : 'Belum Pernah'}
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <button type="submit" className="btn btn-primary btn-lg btn-full" id="btn-daftar-mulai" disabled={loading}>
                  {loading ? <><span className="loading-spinner"></span> Menyimpan data...</> : <>Daftar & Lanjut ke Evaluasi <IconArrowRight size={16} /></>}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--slate-500)', margin: 0 }}>
                  Sudah memiliki kode?{' '}
                  <Link href="/masuk" style={{ color: 'var(--slate-900)', fontWeight: 600 }}>Masuk di sini</Link>
                </p>
              </div>
            </form>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            <IconShield size={16} style={{ color: 'var(--slate-400)' }} />
            <span>Data Anda hanya digunakan untuk kepentingan penelitian akademik dan dijaga kerahasiaannya.</span>
          </div>
        </div>
      </main>
    </div>
  )
}
