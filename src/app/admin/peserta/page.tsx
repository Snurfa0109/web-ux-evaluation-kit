'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconCheck, IconX, IconArrowRight, IconDownload, IconTrash } from '@/components/icons'

interface Participant {
  id: number; participantCode: string; name: string; age: number; gender: string
  occupation: string; governmentWebsiteExperience: boolean; disnakertransExperience: boolean
  whatsappNumber?: string | null; susFb6?: string | null; ueqFb4?: string | null
  createdAt: string; hasSus: boolean; hasUeq: boolean; hasUat: boolean
  susScore: number | null; ueqAttractiveness: number | null; uatSuccessRate: number | null
  uatAcceptanceMean: number | null; overallStatus: string
}

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'complete', label: 'Selesai 3 Tahap' },
  { key: 'partial', label: 'Sebagian' },
  { key: 'wa_optin', label: 'Bersedia Lanjutan (WA)' },
  { key: 'sus_only', label: 'SUS Saja' },
  { key: 'ueq_only', label: 'UEQ Saja' },
  { key: 'uat_only', label: 'UAT Saja' },
]

export default function PesertaAdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchParticipants = () => {
    fetch('/api/admin/participants').then(r => r.json()).then(setParticipants).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  const handleDelete = async (p: Participant) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus responden ${p.name} (${p.participantCode}) beserta seluruh data kuesionernya?`)) return
    setDeletingId(p.id)
    try {
      const res = await fetch(`/api/admin/participants/${p.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        alert(`Gagal menghapus: ${err.error || 'Terjadi kesalahan'}`)
      } else {
        fetchParticipants()
      }
    } catch {
      alert('Gagal menghapus responden')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = participants.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.participantCode.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    switch (filter) {
      case 'complete': return p.hasSus && p.hasUeq && p.hasUat
      case 'partial': return (p.hasSus || p.hasUeq || p.hasUat) && !(p.hasSus && p.hasUeq && p.hasUat)
      case 'wa_optin': return Boolean(p.whatsappNumber) || p.susFb6 === 'Ya' || p.ueqFb4 === 'Ya'
      case 'sus_only': return p.hasSus && !p.hasUeq && !p.hasUat
      case 'ueq_only': return !p.hasSus && p.hasUeq && !p.hasUat
      case 'uat_only': return !p.hasSus && !p.hasUeq && p.hasUat
      default: return true
    }
  })

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  return (
    <div className="admin-content fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Data Responden</h1>
          <p className="page-subtitle">{participants.length} responden terdaftar · {participants.filter(p => p.hasSus && p.hasUeq && p.hasUat).length} selesai seluruh tahap</p>
        </div>
        <Link href="/admin/ekspor" className="btn btn-secondary btn-sm">
          <IconDownload size={14} /> Ekspor Excel
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          type="text"
          placeholder="Cari nama atau kode..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-secondary'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>WhatsApp</th>
                <th style={{ textAlign: 'center' }}>P1 (SUS)</th>
                <th style={{ textAlign: 'center' }}>P2 (UEQ)</th>
                <th style={{ textAlign: 'center' }}>P3 (UAT)</th>
                <th style={{ textAlign: 'center' }}>Skor SUS</th>
                <th style={{ textAlign: 'center' }}>UAT Rate</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {p.participantCode}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</td>
                  <td>
                    {p.whatsappNumber ? (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>
                        {p.whatsappNumber}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem' }}>Tidak ada</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.hasSus ? <span style={{ color: 'var(--success)' }}><IconCheck size={16} /></span> : <span style={{ color: 'var(--slate-300)' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.hasUeq ? <span style={{ color: 'var(--success)' }}><IconCheck size={16} /></span> : <span style={{ color: 'var(--slate-300)' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.hasUat ? <span style={{ color: 'var(--success)' }}><IconCheck size={16} /></span> : <span style={{ color: 'var(--slate-300)' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>
                    {p.susScore !== null ? p.susScore.toFixed(1) : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: p.uatSuccessRate !== null ? 'var(--success)' : 'inherit' }}>
                    {p.uatSuccessRate !== null ? `${p.uatSuccessRate.toFixed(0)}%` : <span style={{ color: 'var(--slate-300)', fontWeight: 400 }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge ${p.overallStatus === 'Selesai' ? 'badge-success' : p.overallStatus === 'Sebagian' ? 'badge-warning' : 'badge-neutral'}`}>
                      {p.overallStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {p.whatsappNumber && (
                        <a
                          href={`https://wa.me/${p.whatsappNumber.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${p.name}, terima kasih telah berpartisipasi pada pengujian evaluasi website Disnakertrans!\n\nKode peserta Anda adalah: ${p.participantCode}.\nTahap evaluasi selanjutnya telah dibuka. Silakan masuk ke portal peserta untuk melanjutkan pengisian kuesioner. Terima kasih!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm"
                          style={{ background: '#25D366', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}
                          title="Kirim pesan undangan WhatsApp"
                        >
                          💬 Kirim WA
                        </a>
                      )}
                      <Link href={`/admin/peserta/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                        Detail <IconArrowRight size={12} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p.id}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="Hapus responden / kuesioner nyeleneh"
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--slate-500)' }}>
            <p>Tidak ada data responden yang sesuai dengan kriteria pencarian.</p>
          </div>
        )}
      </div>
    </div>
  )
}

