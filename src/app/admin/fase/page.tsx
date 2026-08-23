'use client'

import { useEffect, useState } from 'react'
import { IconLayers, IconCheck, IconX, IconLock, IconEdit, IconInfo, IconClipboard } from '@/components/icons'
import { SUS_ITEMS, SUS_FEEDBACK_ITEMS } from '@/lib/sus-instrument'
import { UEQ_ITEMS, UEQ_FEEDBACK_ITEMS } from '@/lib/ueq-instrument'

interface Task {
  id: number; taskCode: string; feature: string; title: string
  description: string; expectedResult: string; acceptanceCriteria: string; order: number
}

interface Phase {
  id: number; phaseNumber: number; phaseName: string; instrument: string
  status: string; startDate: string | null; endDate: string | null
  participantMode: string; externalUrl: string; instructions: string
  tasks: Task[]
}

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  DRAFT:     { label: 'Draft',     badge: 'badge-neutral' },
  SCHEDULED: { label: 'Terjadwal', badge: 'badge-warning' },
  ACTIVE:    { label: 'Aktif',     badge: 'badge-success' },
  CLOSED:    { label: 'Selesai',   badge: 'badge-danger' },
}

export default function FaseManagementPage() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Phase>>({})
  const [saving, setSaving] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [addingTask, setAddingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editTaskForm, setEditTaskForm] = useState<Partial<Task>>({})
  const [savingTask, setSavingTask] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const fetchPhases = () => {
    setLoading(true)
    fetch('/api/admin/phases')
      .then(r => r.json())
      .then((data: any) => {
        if (Array.isArray(data)) {
          setPhases(data)
          if (selectedPhase) {
            const updated = data.find(p => p.id === selectedPhase.id)
            if (updated) setSelectedPhase(updated)
            else if (data.length > 0) setSelectedPhase(data[0])
          } else if (data.length > 0) {
            setSelectedPhase(data[0])
          }
        }
      })
      .catch(err => console.error('Fetch phases error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPhases() }, [])

  const handleSavePhase = async () => {
    if (!selectedPhase) return
    setSaving(true)
    // Only send editable scalar fields, not relations
    const { id, phaseName, phaseNumber, instrument, status, participantMode,
            externalUrl, instructions, startDate, endDate } = editForm as Phase
    await fetch('/api/admin/phases', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedPhase.id, phaseName, phaseNumber, instrument,
        status, participantMode, externalUrl, instructions, startDate, endDate }),
    })
    setSaving(false)
    setEditing(false)
    fetchPhases()
  }

  const handleAddTask = async () => {
    if (!selectedPhase || !newTask.taskCode || !newTask.title || !newTask.description) return
    await fetch('/api/admin/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phaseId: selectedPhase.id,
        ...newTask,
        order: (selectedPhase.tasks?.length || 0) + 1,
      }),
    })
    setNewTask({})
    setAddingTask(false)
    fetchPhases()
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Hapus skenario tugas ini?')) return
    await fetch(`/api/admin/tasks?id=${taskId}`, { method: 'DELETE' })
    fetchPhases()
  }

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTaskForm({ title: task.title, description: task.description, expectedResult: task.expectedResult, taskCode: task.taskCode, feature: task.feature })
  }

  const handleSaveTask = async (taskId: number) => {
    setSavingTask(true)
    await fetch(`/api/admin/tasks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, ...editTaskForm }),
    })
    setSavingTask(false)
    setEditingTaskId(null)
    fetchPhases()
  }

  if (loading) return (
    <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <div className="loading-spinner" style={{ width: 32, height: 32, color: 'var(--slate-700)' }}></div>
    </div>
  )

  return (
    <div className="admin-content fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Manajemen Tahap Penelitian</h1>
        <p className="page-subtitle">Atur status aktif, URL website/prototype, instruksi pengujian, dan skenario tugas</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Phase List Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {phases.map(phase => {
            const isSelected = selectedPhase?.id === phase.id
            const statusCfg = STATUS_CONFIG[phase.status] || STATUS_CONFIG.DRAFT

            return (
              <div
                key={phase.id}
                className="card card-hover"
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--slate-900)' : 'var(--slate-200)',
                  backgroundColor: isSelected ? 'var(--white)' : 'var(--slate-50)',
                }}
                onClick={() => { setSelectedPhase(phase); setEditing(false) }}
              >
                <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)' }}>
                      Tahap 0{phase.phaseNumber}
                    </span>
                    <span className={`badge ${statusCfg.badge}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                    {phase.phaseName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Instrumen: {phase.instrument}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Phase Detail & Configuration */}
        {selectedPhase && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Phase Info Card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '1.125rem' }}>Tahap 0{selectedPhase.phaseNumber} — {selectedPhase.phaseName}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                    Instrumen: <strong>{selectedPhase.instrument}</strong>
                  </div>
                </div>

                {!editing && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                      id="btn-preview-instrumen"
                    >
                      <IconInfo size={14} /> Lihat Pertanyaan ({selectedPhase.instrument})
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditing(true); setEditForm({ ...selectedPhase }) }}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit Konfigurasi
                    </button>
                  </div>
                )}
              </div>

              {!editing ? (
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-2">
                    <div>
                      <div className="form-label" style={{ marginBottom: '0.25rem', color: 'var(--slate-500)' }}>Status Tahap</div>
                      <span className={`badge ${STATUS_CONFIG[selectedPhase.status]?.badge}`}>
                        {STATUS_CONFIG[selectedPhase.status]?.label}
                      </span>
                    </div>
                    <div>
                      <div className="form-label" style={{ marginBottom: '0.25rem', color: 'var(--slate-500)' }}>Mode Partisipasi</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                        {selectedPhase.participantMode === 'SAME_ONLY' ? 'Responden Sama' : 'Bebas / Responden Baru'}
                      </div>
                    </div>
                  </div>

                  {/* Show schedule dates in view mode if SCHEDULED or ACTIVE */}
                  {(selectedPhase.status === 'SCHEDULED' || selectedPhase.startDate || selectedPhase.endDate) && (
                    <div className="grid-2">
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem', color: 'var(--slate-500)' }}>Tanggal Mulai</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                          {selectedPhase.startDate ? new Date(selectedPhase.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '(belum diatur)'}
                        </div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem', color: 'var(--slate-500)' }}>Tanggal Selesai</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                          {selectedPhase.endDate ? new Date(selectedPhase.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '(belum diatur)'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="form-label" style={{ marginBottom: '0.25rem', color: 'var(--slate-500)' }}>URL Eksternal (Website / Prototype)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--slate-800)', background: 'var(--slate-50)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', wordBreak: 'break-all' }}>
                      {selectedPhase.externalUrl || '(belum diatur)'}
                    </div>
                  </div>

                  <div>
                    <div className="form-label" style={{ marginBottom: '0.25rem', color: 'var(--slate-500)' }}>Petunjuk untuk Responden</div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                      {selectedPhase.instructions || '(belum diatur)'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Status Tahap</label>
                      <select
                        className="form-select"
                        value={editForm.status}
                        onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                      >
                        <option value="DRAFT">Draft (Belum Dibuka)</option>
                        <option value="SCHEDULED">Terjadwal</option>
                        <option value="ACTIVE">Aktif (Dapat Dikerjakan)</option>
                        <option value="CLOSED">Selesai / Ditutup</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mode Partisipasi</label>
                      <select
                        className="form-select"
                        value={editForm.participantMode}
                        onChange={e => setEditForm(p => ({ ...p, participantMode: e.target.value }))}
                      >
                        <option value="SAME_ONLY">Peserta Sama (Longitudinal)</option>
                        <option value="ALLOW_NEW">Izinkan Peserta Baru</option>
                      </select>
                    </div>
                  </div>

                  {/* Date fields — shown when status is SCHEDULED or ACTIVE */}
                  {(editForm.status === 'SCHEDULED' || editForm.status === 'ACTIVE' || editForm.status === 'CLOSED') && (
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Tanggal Mulai</label>
                        <input
                          className="form-input"
                          type="date"
                          value={editForm.startDate ? editForm.startDate.slice(0, 10) : ''}
                          onChange={e => setEditForm(p => ({ ...p, startDate: e.target.value || null }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tanggal Selesai</label>
                        <input
                          className="form-input"
                          type="date"
                          value={editForm.endDate ? editForm.endDate.slice(0, 10) : ''}
                          onChange={e => setEditForm(p => ({ ...p, endDate: e.target.value || null }))}
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">URL Eksternal (Website / Prototype)</label>
                    <input
                      className="form-input"
                      type="url"
                      placeholder="https://..."
                      value={editForm.externalUrl || ''}
                      onChange={e => setEditForm(p => ({ ...p, externalUrl: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Petunjuk Pengujian</label>
                    <textarea
                      className="form-textarea"
                      value={editForm.instructions || ''}
                      onChange={e => setEditForm(p => ({ ...p, instructions: e.target.value }))}
                      style={{ minHeight: 90 }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSavePhase} disabled={saving}>
                      {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Task list card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '1rem' }}>Skenario Tugas ({selectedPhase.tasks?.length || 0})</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Daftar tugas yang diuji coba responden</div>
                </div>

                {!addingTask && (
                  <button
                    type="button"
                    onClick={() => setAddingTask(true)}
                    className="btn btn-primary btn-sm"
                    id="btn-tambah-task"
                  >
                    + Tambah Tugas
                  </button>
                )}
              </div>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedPhase.tasks?.map((task, idx) => (
                  <div key={task.id} style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: `1px solid ${editingTaskId === task.id ? 'var(--accent)' : 'var(--slate-200)'}`, overflow: 'hidden' }}>
                    {editingTaskId === task.id ? (
                      /* Inline Edit Form */
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="grid-2">
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Kode Tugas</label>
                            <input className="form-input" value={editTaskForm.taskCode || ''} onChange={e => setEditTaskForm(p => ({ ...p, taskCode: e.target.value }))} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Fitur Terkait</label>
                            <input className="form-input" value={editTaskForm.feature || ''} onChange={e => setEditTaskForm(p => ({ ...p, feature: e.target.value }))} />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Judul Tugas</label>
                          <input className="form-input" value={editTaskForm.title || ''} onChange={e => setEditTaskForm(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Deskripsi / Instruksi Tugas</label>
                          <textarea className="form-textarea" value={editTaskForm.description || ''} onChange={e => setEditTaskForm(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 60 }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Hasil yang Diharapkan</label>
                          <input className="form-input" value={editTaskForm.expectedResult || ''} onChange={e => setEditTaskForm(p => ({ ...p, expectedResult: e.target.value }))} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => handleSaveTask(task.id)} disabled={savingTask}>
                            {savingTask ? 'Menyimpan...' : <><IconCheck size={13} /> Simpan</>}
                          </button>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingTaskId(null)}>
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.875rem 1rem', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-900)', background: 'var(--slate-200)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-sm)' }}>
                              {task.taskCode}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-900)' }}>{task.title}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--slate-600)' }}>{task.description}</p>
                          {task.expectedResult && (
                            <div style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                              <em>Expected: {task.expectedResult}</em>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleEditTask(task)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem' }}
                            title="Edit tugas"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.25rem 0.5rem' }}
                            title="Hapus tugas"
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Task Form */}
                {addingTask && (
                  <div style={{ padding: '1.25rem', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <h4 style={{ fontSize: '0.875rem', margin: 0 }}>Tambah Skenario Tugas Baru</h4>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Kode Tugas / TC</label>
                        <input
                          className="form-input"
                          placeholder="TC-004"
                          value={newTask.taskCode || ''}
                          onChange={e => setNewTask(p => ({ ...p, taskCode: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Fitur Terkait</label>
                        <input
                          className="form-input"
                          placeholder="Pencarian Lowongan"
                          value={newTask.feature || ''}
                          onChange={e => setNewTask(p => ({ ...p, feature: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Judul Tugas</label>
                      <input
                        className="form-input"
                        placeholder="Mencari lowongan kerja di wilayah Serang"
                        value={newTask.title || ''}
                        onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Deskripsi / Instruksi Tugas</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Buka menu Lowongan, filter kota Serang, dan buka detail satu lowongan..."
                        value={newTask.description || ''}
                        onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                        style={{ minHeight: 60 }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hasil yang Diharapkan (Expected Result)</label>
                      <input
                        className="form-input"
                        placeholder="Daftar lowongan ditampilkan dan halaman detail terbuka normal"
                        value={newTask.expectedResult || ''}
                        onChange={e => setNewTask(p => ({ ...p, expectedResult: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={handleAddTask}>
                        Simpan Tugas
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAddingTask(false)}>
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Preview Pertanyaan Instrumen */}
      {showPreviewModal && selectedPhase && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="card" style={{ maxWidth: 760, width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            {/* Modal Header */}
            <div className="card-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
              <div>
                <span className="badge badge-accent" style={{ marginBottom: '0.25rem' }}>{selectedPhase.instrument} Instrument</span>
                <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Daftar Pertanyaan — Tahap 0{selectedPhase.phaseNumber} ({selectedPhase.phaseName})</h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                <IconX size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Preview SUS */}
              {selectedPhase.instrument === 'SUS' && (
                <>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                      1. 10 Pertanyaan Baku System Usability Scale (SUS)
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Skala penilaian: Likert 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju).
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {SUS_ITEMS.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.625rem 0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.84rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--slate-500)', width: 24 }}>{String(item.id).padStart(2, '0')}</span>
                          <span style={{ flex: 1, color: 'var(--slate-800)' }}>{item.text}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: '4px', background: item.type === 'positive' ? '#dcfce7' : '#fee2e2', color: item.type === 'positive' ? '#15803d' : '#b91c1c' }}>
                            {item.type === 'positive' ? 'Positif (Odd)' : 'Negatif (Even)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                      2. Pertanyaan Feedback Kualitatif Tambahan
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Pertanyaan isian terbuka untuk mendapatkan masukan mendalam dari responden.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {SUS_FEEDBACK_ITEMS.map((item, idx) => (
                        <div key={item.id} style={{ padding: '0.625rem 0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.84rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--slate-500)', marginRight: '0.5rem' }}>{10 + idx + 1}.</span>
                          <span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{item.text}</span>
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>
                            ({item.type === 'text' ? 'Isian Teks' : 'Pilihan Ya/Tidak'})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Preview UEQ */}
              {selectedPhase.instrument === 'UEQ' && (
                <>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                      1. 26 Pasang Kata Sifat User Experience Questionnaire (UEQ)
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Metode Semantic Differential dengan skala 7 poin (1 = Kata Sifat Kiri, 7 = Kata Sifat Kanan).
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                      {UEQ_ITEMS.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--slate-700)', width: '35%' }}>{item.id}. {item.left}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>[ 1 — 7 ]</span>
                          <span style={{ fontWeight: 600, color: 'var(--slate-700)', textAlign: 'right', width: '35%' }}>{item.right}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                      2. Pertanyaan Feedback Prototype Redesign
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {UEQ_FEEDBACK_ITEMS.map((item, idx) => (
                        <div key={item.id} style={{ padding: '0.625rem 0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.84rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--slate-500)', marginRight: '0.5rem' }}>{26 + idx + 1}.</span>
                          <span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{item.text}</span>
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>
                            ({item.type === 'text' ? 'Isian Teks' : 'Pilihan Ya/Tidak'})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Preview UAT */}
              {selectedPhase.instrument === 'UAT' && (
                <>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                      1. Skenario Tugas & Acceptance Criteria ({selectedPhase.tasks?.length || 0} Tugas)
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Setiap tugas dinilai langsung oleh responden (Berhasil / Berhasil dengan Kendala / Gagal).
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {selectedPhase.tasks?.map((t) => (
                        <div key={t.id} style={{ padding: '0.75rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.84rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'var(--slate-200)', padding: '0.1rem 0.35rem', borderRadius: '3px', marginRight: '0.5rem' }}>{t.taskCode}</span>
                            {t.title}
                          </div>
                          <p style={{ margin: 0, color: 'var(--slate-600)', fontSize: '0.8rem' }}>{t.description}</p>
                          {t.expectedResult && (
                            <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500 }}>
                              Expected Result: {t.expectedResult}
                            </div>
                          )}
                        </div>
                      ))}
                      {(!selectedPhase.tasks || selectedPhase.tasks.length === 0) && (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>Belum ada tugas yang ditambahkan untuk UAT.</p>
                      )}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                      2. Pernyataan Penilaian Keseluruhan (Overall Acceptance)
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Skala penilaian Likert 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju).
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        '1. Secara keseluruhan, website ini memenuhi kebutuhan dan ekspektasi saya. (TAM - Perceived Usefulness)',
                        '2. Fungsi dan alur layanan pada website ini dapat berjalan dengan baik dan bebas dari kesalahan fatal. (ISO 9241-11 - Effectiveness)',
                        '3. Saya dapat menggunakan website ini untuk menyelesaikan kebutuhan layanan saya dengan mudah. (TAM - Perceived Ease of Use)',
                        '4. Informasi dan petunjuk yang disajikan pada website ini jelas dan membantu kelancaran pengujian. (ISO 9241-11 - Efficiency)',
                        '5. Saya merekomendasikan website ini untuk diterapkan dalam operasional pelayanan publik Disnakertrans. (System Adoption / Satisfaction)'
                      ].map((st, i) => (
                        <div key={i} style={{ padding: '0.625rem 0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.84rem', color: 'var(--slate-800)', fontWeight: 500 }}>
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                      3. Pertanyaan Feedback Kualitatif Akhir
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        '6. Apakah seluruh fungsi dan layanan pada website ini sudah sesuai dengan yang Anda harapkan? Jelaskan singkat.',
                        '7. Apakah terdapat kendala atau bug yang Anda temukan selama pengujian website ini?',
                        '8. Saran dan kritik akhir untuk kesiapan penerapan website layanan Disnakertrans Kabupaten Serang.'
                      ].map((st, i) => (
                        <div key={i} style={{ padding: '0.625rem 0.875rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.84rem', color: 'var(--slate-800)', fontWeight: 500 }}>
                          {st} <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>(Isian Teks)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'flex-end', background: 'var(--slate-50)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
              <button onClick={() => setShowPreviewModal(false)} className="btn btn-secondary btn-sm">
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
