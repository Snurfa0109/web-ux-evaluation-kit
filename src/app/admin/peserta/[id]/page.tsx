'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SUS_ITEMS } from '@/lib/sus-instrument'
import { IconArrowLeft, IconCheck, IconX, IconTrash } from '@/components/icons'

interface ParticipantDetail {
  id: number
  participantCode: string
  name: string
  age: number
  gender: string
  occupation: string
  governmentWebsiteExperience: boolean
  disnakertransExperience: boolean
  createdAt: string
  susResponses?: any[]
  ueqResponses?: any[]
  uatTaskResponses?: any[]
  uatOverallFeedback?: any[]
}

export default function ParticipantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [data, setData] = useState<ParticipantDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDetail = () => {
    if (!id) return
    fetch(`/api/admin/participants/${id}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleDeleteAll = async () => {
    if (!data) return
    if (!confirm(`Hapus responden ${data.name} (${data.participantCode}) beserta SELURUH data pengujiannya?`)) return
    try {
      const res = await fetch(`/api/admin/participants/${data.id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Responden berhasil dihapus')
        router.push('/admin/peserta')
      } else {
        const err = await res.json()
        alert(`Gagal: ${err.error}`)
      }
    } catch {
      alert('Gagal menghapus data')
    }
  }

  const handleDeleteInstrument = async (type: 'sus' | 'ueq' | 'uat') => {
    if (!data) return
    const nameMap = { sus: 'SUS', ueq: 'UEQ', uat: 'UAT' }
    if (!confirm(`Hapus data kuesioner ${nameMap[type]} dari responden ${data.name}?`)) return
    try {
      const res = await fetch(`/api/admin/participants/${data.id}?type=${type}`, { method: 'DELETE' })
      if (res.ok) {
        fetchDetail()
      } else {
        const err = await res.json()
        alert(`Gagal: ${err.error}`)
      }
    } catch {
      alert(`Gagal menghapus data ${nameMap[type]}`)
    }
  }

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  if (!data) return (
    <div className="admin-content">
      <p>Data responden tidak ditemukan.</p>
    </div>
  )

  const sus = data.susResponses?.[0]
  const ueq = data.ueqResponses?.[0]
  const uatTasks = data.uatTaskResponses || []
  const uatFeedback = data.uatOverallFeedback?.[0]
  const uatTotal = uatTasks.length
  const uatPassed = uatTasks.filter((t: any) => t.status === 'BERHASIL').length
  const uatRate = uatTotal > 0 ? ((uatPassed / uatTotal) * 100).toFixed(1) : null

  const UEQ_DIMS = ['attractiveness', 'perspicuity', 'efficiency', 'dependability', 'stimulation', 'novelty']
  const UEQ_LABELS: Record<string, string> = {
    attractiveness: 'Attractiveness',
    perspicuity: 'Perspicuity',
    efficiency: 'Efficiency',
    dependability: 'Dependability',
    stimulation: 'Stimulation',
    novelty: 'Novelty',
  }

  return (
    <div className="admin-content fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <Link href="/admin/peserta" className="btn btn-secondary btn-sm">
            <IconArrowLeft size={14} /> Kembali
          </Link>
          <div>
            <h1 className="page-title">Responden {data.participantCode}</h1>
            <p className="page-subtitle">{data.name} — Detail riwayat partisipasi & hasil pengujian</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDeleteAll}
          className="btn btn-danger btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <IconTrash size={14} /> Hapus Responden
        </button>
      </div>


      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>Profil Responden</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { label: 'Nama Lengkap', value: data.name },
              { label: 'Participant Code', value: data.participantCode },
              { label: 'Usia', value: `${data.age} tahun` },
              { label: 'Jenis Kelamin', value: data.gender },
              { label: 'Pekerjaan', value: data.occupation },
              { label: 'Website Pemda', value: data.governmentWebsiteExperience ? 'Pernah' : 'Belum Pernah' },
              { label: 'Website Disnakertrans', value: data.disnakertransExperience ? 'Pernah' : 'Belum Pernah' },
              { label: 'Waktu Daftar', value: new Date(data.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--slate-100)', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Summary Card */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem' }}>Status Partisipasi</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Tahap 1 (SUS)', has: !!sus, score: sus ? `Skor: ${sus.susScore.toFixed(1)} / 100` : 'Belum mengisi', date: sus?.completedAt },
              { label: 'Tahap 2 (UEQ)', has: !!ueq, score: ueq ? `Attractiveness: ${ueq.attractiveness.toFixed(2)}` : 'Belum mengisi', date: ueq?.completedAt },
              { label: 'Tahap 3 (UAT)', has: !!uatFeedback, score: uatRate ? `${uatRate}% task berhasil (${uatPassed}/${uatTotal})` : 'Belum mengisi', date: uatFeedback?.completedAt },
            ].map(p => (
              <div key={p.label} style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-900)' }}>{p.label}</span>
                  {p.has ? (
                    <span className="badge badge-success">Selesai</span>
                  ) : (
                    <span className="badge badge-neutral">Belum</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--slate-600)' }}>{p.score}</div>
                {p.date && (
                  <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '0.25rem' }}>
                    {new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUS Detail */}
      {sus && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem' }}>Hasil Kuesioner SUS</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>10 Item Pernyataan Likert (1–5)</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>{sus.susScore.toFixed(1)}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Skor SUS (0–100)</div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteInstrument('sus')}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.25rem 0.5rem' }}
                title="Hapus Data Kuesioner SUS Responden Ini"
              >
                <IconTrash size={14} /> Hapus SUS
              </button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))', gap: '0.5rem' }}>
              {SUS_ITEMS.map(item => {
                const qKey = `q${item.id}` as keyof typeof sus
                const val = sus[qKey]
                return (
                  <div key={item.id} style={{ textAlign: 'center', padding: '0.625rem 0.25rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>Q{item.id}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>{val}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* UEQ Detail */}
      {ueq && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem' }}>Hasil Kuesioner UEQ</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>6 Dimensi Pengalaman Pengguna (-3 s.d. +3)</div>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteInstrument('ueq')}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.25rem 0.5rem' }}
              title="Hapus Data Kuesioner UEQ Responden Ini"
            >
              <IconTrash size={14} /> Hapus UEQ
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {UEQ_DIMS.map(dim => {
                const val = ueq[dim] ?? 0
                return (
                  <div key={dim} style={{ padding: '0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '0.25rem' }}>{UEQ_LABELS[dim]}</div>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: val >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {val >= 0 ? '+' : ''}{val.toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* UAT Detail */}
      {(uatTasks.length > 0 || uatFeedback) && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem' }}>Hasil Pengujian UAT</h3>
              {uatFeedback && (
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Overall Acceptance Mean: {uatFeedback.meanRating?.toFixed(2)} / 5</div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {uatRate && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{uatRate}%</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Task Success Rate</div>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleDeleteInstrument('uat')}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.25rem 0.5rem' }}
                title="Hapus Data Pengujian UAT Responden Ini"
              >
                <IconTrash size={14} /> Hapus UAT
              </button>
            </div>
          </div>

          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {uatTasks.map((t: any) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)' }}>{t.task?.taskCode}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-900)' }}>{t.task?.title}</span>
                    </div>
                    {t.notes && <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Catatan: {t.notes}</div>}
                  </div>
                  <span className={`badge ${t.status === 'BERHASIL' ? 'badge-success' : 'badge-danger'}`}>
                    {t.status === 'BERHASIL' ? 'Berhasil' : 'Kendala'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
