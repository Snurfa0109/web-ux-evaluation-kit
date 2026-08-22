'use client'

import { useState } from 'react'
import { IconDownload, IconClipboard, IconBarChart, IconCheck, IconUsers, IconRepeat, IconInfo } from '@/components/icons'

export default function EksporPage() {
  const [exporting, setExporting] = useState('')

  const handleExport = async (type: string) => {
    setExporting(type)
    try {
      const res = await fetch(`/api/admin/export?type=${type}`)
      if (!res.ok) throw new Error('Export gagal')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `evaluasi-disnakertrans-${type}-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Gagal mengunduh file export. Pastikan ada data penelitian.')
    } finally {
      setExporting('')
    }
  }

  const EXPORTS = [
    { type: 'all', label: 'Ekspor Seluruh Dataset (8 Sheet)', desc: 'File Excel lengkap mencakup data responden, raw & calculated data SUS, UEQ, UAT, dan matriks longitudinal.', icon: IconDownload, primary: true },
    { type: 'participants', label: 'Data Profil Responden', desc: 'Sheet PARTICIPANTS — Data demografis seluruh responden terdaftar.', icon: IconUsers, primary: false },
    { type: 'sus', label: 'Dataset Evaluasi SUS', desc: 'Sheet SUS RAW & SUS RESULTS — Jawaban butir Q1–Q10 dan skor terhitung.', icon: IconClipboard, primary: false },
    { type: 'ueq', label: 'Dataset Evaluasi UEQ', desc: 'Sheet UEQ RAW & UEQ RESULTS — 26 item kuesioner dan nilai 6 dimensi UX.', icon: IconBarChart, primary: false },
    { type: 'uat', label: 'Dataset Evaluasi UAT', desc: 'Sheet UAT RAW & UAT RESULTS — Hasil task skenario dan overall acceptance.', icon: IconCheck, primary: false },
    { type: 'longitudinal', label: 'Dataset Longitudinal (Lintas Tahap)', desc: 'Sheet LONGITUDINAL — Matriks komparasi hasil per responden untuk 3 tahap.', icon: IconRepeat, primary: false },
  ]

  return (
    <div className="admin-content fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Pusat Ekspor Data</h1>
        <p className="page-subtitle">Unduh data penelitian dalam format Microsoft Excel (.xlsx) untuk analisis statistik</p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1.75rem' }}>
        <IconInfo size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          Data diekspor dalam format <code>.xlsx</code> terstandarisasi. Sel data kosong menunjukkan responden belum menyelesaikan tahapan tersebut (tidak diisi angka 0 agar tidak merusak perhitungan statistik).
        </div>
      </div>

      {/* Export List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {EXPORTS.map(exp => {
          const Icon = exp.icon
          const isCurrentLoading = exporting === exp.type

          return (
            <div key={exp.type} className="card" style={{ borderColor: exp.primary ? 'var(--slate-400)' : 'var(--slate-200)' }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 260 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: exp.primary ? 'var(--slate-900)' : 'var(--slate-100)', color: exp.primary ? 'var(--white)' : 'var(--slate-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{exp.label}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', margin: 0 }}>{exp.desc}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleExport(exp.type)}
                  disabled={!!exporting}
                  className={`btn ${exp.primary ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  id={`btn-export-${exp.type}`}
                  style={{ minWidth: 140 }}
                >
                  {isCurrentLoading ? (
                    <><span className="loading-spinner"></span> Menyiapkan...</>
                  ) : (
                    <><IconDownload size={14} /> Unduh (.xlsx)</>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
