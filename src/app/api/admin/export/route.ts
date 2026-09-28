import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

const HEADER_STYLE: Partial<ExcelJS.Style> = {
  font: { bold: true, color: { argb: 'FFFFFFFF' } },
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A6B' } },
  alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
  border: {
    top: { style: 'thin' }, left: { style: 'thin' },
    bottom: { style: 'thin' }, right: { style: 'thin' }
  },
}

function applyHeaders(sheet: ExcelJS.Worksheet, headers: string[], rowHeight = 30) {
  sheet.addRow(headers)
  const headerRow = sheet.lastRow!
  headerRow.height = rowHeight
  headerRow.eachCell(cell => { Object.assign(cell, HEADER_STYLE) })
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'all'

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Research Evaluation Platform — Disnakertrans Kab. Serang'
  workbook.created = new Date()

  const participants = await prisma.participant.findMany({
    orderBy: { participantCode: 'asc' },
    include: {
      susResponses: { include: { phase: true }, orderBy: { completedAt: 'asc' } },
      ueqResponses: { include: { phase: true }, orderBy: { completedAt: 'asc' } },
      uatTaskResponses: { include: { task: true, phase: true } },
      uatOverallFeedback: { include: { phase: true } },
    },
  })

  // Sheet 1 — PARTICIPANTS
  if (type === 'all' || type === 'participants') {
    const sh = workbook.addWorksheet('PARTICIPANTS')
    sh.columns = [
      { key: 'code', width: 14 }, { key: 'name', width: 24 }, { key: 'age', width: 8 },
      { key: 'gender', width: 14 }, { key: 'occ', width: 28 },
      { key: 'gov', width: 30 }, { key: 'dis', width: 30 }, { key: 'reg', width: 20 },
    ]
    applyHeaders(sh, ['Participant ID', 'Nama', 'Usia', 'Jenis Kelamin', 'Pekerjaan',
      'Pernah Website Pemerintah', 'Pernah Website Disnakertrans', 'Tanggal Registrasi'])
    for (const p of participants) {
      sh.addRow([
        p.participantCode, p.name, p.age, p.gender, p.occupation,
        p.governmentWebsiteExperience ? 'Ya' : 'Tidak',
        p.disnakertransExperience ? 'Ya' : 'Tidak',
        p.createdAt.toLocaleDateString('id-ID'),
      ])
    }
  }

  // Sheet 2 — SUS EXISTING RAW (Fase 1)
  if (type === 'all' || type === 'sus') {
    const sh1 = workbook.addWorksheet('SUS EXISTING RAW (F1)')
    sh1.columns = [
      { key: 'code', width: 14 },
      { key: 'name', width: 22 },
      { key: 'age', width: 8 },
      { key: 'gender', width: 14 },
      { key: 'occ', width: 22 },
      ...Array.from({ length: 10 }, (_, i) => ({ key: `q${i+1}`, width: 8 })),
      { key: 'score', width: 12 },
      { key: 'fb1', width: 40 },
      { key: 'fb2', width: 40 },
      { key: 'fb3', width: 40 },
      { key: 'fb4', width: 40 },
      { key: 'fb5', width: 40 },
      { key: 'fb6', width: 16 },
      { key: 'fb6Phone', width: 18 },
      { key: 'date', width: 20 },
    ]
    applyHeaders(sh1, [
      'Participant ID', 'Nama', 'Usia', 'Jenis Kelamin', 'Pekerjaan',
      'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
      'Skor SUS',
      'Fitur Paling Mudah (FB1)',
      'Fitur Membingungkan (FB2)',
      'Informasi Sulit Ditemukan (FB3)',
      'Usulan Fitur Tambahan (FB4)',
      'Saran & Masukan Umum (FB5)',
      'Bersedia Kontak Lanjutan',
      'No. WhatsApp',
      'Tanggal Selesai'
    ])
    for (const p of participants) {
      const s = p.susResponses.find(r => r.phase?.phaseNumber === 1 || r.phaseId === 1)
      if (s) {
        sh1.addRow([
          p.participantCode, p.name, p.age, p.gender, p.occupation,
          s.q1, s.q2, s.q3, s.q4, s.q5, s.q6, s.q7, s.q8, s.q9, s.q10,
          s.susScore,
          s.fb1 || '', s.fb2 || '', s.fb3 || '', s.fb4 || '', s.fb5 || '',
          s.fb6 || '', s.fb6Phone || '',
          s.completedAt.toLocaleDateString('id-ID')
        ])
      }
    }

    // Sheet 3 — SUS BARU RAW (Fase 4)
    const sh4 = workbook.addWorksheet('SUS BARU RAW (F4)')
    sh4.columns = [
      { key: 'code', width: 14 },
      { key: 'name', width: 22 },
      { key: 'age', width: 8 },
      { key: 'gender', width: 14 },
      { key: 'occ', width: 22 },
      ...Array.from({ length: 10 }, (_, i) => ({ key: `q${i+1}`, width: 8 })),
      { key: 'score', width: 12 },
      { key: 'fb1', width: 40 },
      { key: 'fb2', width: 40 },
      { key: 'fb3', width: 40 },
      { key: 'fb4', width: 40 },
      { key: 'fb5', width: 40 },
      { key: 'fb6', width: 16 },
      { key: 'fb6Phone', width: 18 },
      { key: 'date', width: 20 },
    ]
    applyHeaders(sh4, [
      'Participant ID', 'Nama', 'Usia', 'Jenis Kelamin', 'Pekerjaan',
      'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
      'Skor SUS',
      'Fitur Paling Disukai (FB1)',
      'Fitur Membingungkan (FB2)',
      'Informasi Sulit Ditemukan (FB3)',
      'Usulan Fitur Tambahan (FB4)',
      'Saran & Masukan Umum (FB5)',
      'Bersedia Kontak Lanjutan',
      'No. WhatsApp',
      'Tanggal Selesai'
    ])
    for (const p of participants) {
      const s = p.susResponses.find(r => r.phase?.phaseNumber === 4 || r.phaseId === 30001)
      if (s) {
        sh4.addRow([
          p.participantCode, p.name, p.age, p.gender, p.occupation,
          s.q1, s.q2, s.q3, s.q4, s.q5, s.q6, s.q7, s.q8, s.q9, s.q10,
          s.susScore,
          s.fb1 || '', s.fb2 || '', s.fb3 || '', s.fb4 || '', s.fb5 || '',
          s.fb6 || '', s.fb6Phone || '',
          s.completedAt.toLocaleDateString('id-ID')
        ])
      }
    }

    // Sheet 4 — SUS BARU RESULTS (Fase 4)
    const shRes4 = workbook.addWorksheet('SUS BARU RESULTS (F4)')
    shRes4.columns = [
      { key: 'code', width: 14 },
      { key: 'name', width: 22 },
      { key: 'occ', width: 22 },
      { key: 'score', width: 12 },
      { key: 'grade', width: 20 },
      { key: 'fb1', width: 40 },
      { key: 'fb2', width: 40 },
      { key: 'fb3', width: 40 },
      { key: 'fb4', width: 40 },
      { key: 'fb5', width: 40 },
      { key: 'date', width: 20 },
    ]
    applyHeaders(shRes4, [
      'Participant ID', 'Nama Responden', 'Pekerjaan', 'Skor SUS', 'Kategori Grade',
      'Fitur Paling Disukai (FB1)',
      'Fitur Membingungkan (FB2)',
      'Informasi Sulit Ditemukan (FB3)',
      'Usulan Fitur Tambahan (FB4)',
      'Saran & Masukan Umum (FB5)',
      'Tanggal Selesai'
    ])
    for (const p of participants) {
      const s = p.susResponses.find(r => r.phase?.phaseNumber === 4 || r.phaseId === 30001)
      if (s) {
        let grade = 'Sangat Baik (A)'
        if (s.susScore < 72.6) grade = 'Cukup (C)'
        else if (s.susScore < 84.1) grade = 'Baik (B)'

        shRes4.addRow([
          p.participantCode, p.name, p.occupation, s.susScore, grade,
          s.fb1 || '', s.fb2 || '', s.fb3 || '', s.fb4 || '', s.fb5 || '',
          s.completedAt.toLocaleDateString('id-ID')
        ])
      }
    }
  }

  // Sheet 4 — UEQ RAW
  if (type === 'all' || type === 'ueq') {
    const sh = workbook.addWorksheet('UEQ RAW')
    const itemCols = Array.from({ length: 26 }, (_, i) => ({ key: `item${i+1}`, width: 8 }))
    sh.columns = [
      { key: 'code', width: 14 }, { key: 'name', width: 22 }, ...itemCols,
      { key: 'fb1', width: 40 }, { key: 'fb2', width: 40 }, { key: 'fb3', width: 40 },
      { key: 'fb4', width: 16 }, { key: 'fb4Phone', width: 18 },
      { key: 'date', width: 20 }
    ]
    applyHeaders(sh, [
      'Participant ID', 'Nama', ...Array.from({ length: 26 }, (_, i) => `Item ${i+1}`),
      'Tampilan Visual Disukai (FB1)', 'Tampilan Kurang Nyaman (FB2)', 'Saran Perbaikan Prototype (FB3)',
      'Bersedia UAT', 'No. WhatsApp', 'Tanggal Selesai'
    ])
    for (const p of participants) {
      if (p.ueqResponses.length > 0) {
        const u = p.ueqResponses[0]
        sh.addRow([p.participantCode, p.name,
          u.item1, u.item2, u.item3, u.item4, u.item5, u.item6, u.item7,
          u.item8, u.item9, u.item10, u.item11, u.item12, u.item13,
          u.item14, u.item15, u.item16, u.item17, u.item18, u.item19,
          u.item20, u.item21, u.item22, u.item23, u.item24, u.item25, u.item26,
          u.fb1 || '', u.fb2 || '', u.fb3 || '', u.fb4 || '', u.fb4Phone || '',
          u.completedAt.toLocaleDateString('id-ID')])
      }
    }

    // Sheet 5 — UEQ RESULTS
    const sh5 = workbook.addWorksheet('UEQ RESULTS')
    sh5.columns = [
      { key: 'code', width: 14 }, { key: 'name', width: 22 },
      { key: 'att', width: 16 }, { key: 'per', width: 14 },
      { key: 'eff', width: 14 }, { key: 'dep', width: 16 }, { key: 'sti', width: 14 },
      { key: 'nov', width: 12 },
      { key: 'fb1', width: 40 }, { key: 'fb2', width: 40 }, { key: 'fb3', width: 40 },
      { key: 'date', width: 20 }
    ]
    applyHeaders(sh5, [
      'Participant ID', 'Nama', 'Attractiveness', 'Perspicuity', 'Efficiency',
      'Dependability', 'Stimulation', 'Novelty',
      'Tampilan Visual Disukai (FB1)', 'Tampilan Kurang Nyaman (FB2)', 'Saran Perbaikan (FB3)',
      'Tanggal Selesai'
    ])
    for (const p of participants) {
      if (p.ueqResponses.length > 0) {
        const u = p.ueqResponses[0]
        sh5.addRow([
          p.participantCode, p.name, u.attractiveness, u.perspicuity, u.efficiency,
          u.dependability, u.stimulation, u.novelty,
          u.fb1 || '', u.fb2 || '', u.fb3 || '',
          u.completedAt.toLocaleDateString('id-ID')
        ])
      }
    }
  }

  // Sheets 6 & 7 — UAT
  if (type === 'all' || type === 'uat') {
    const sh = workbook.addWorksheet('UAT RAW')
    sh.columns = [
      { key: 'code', width: 14 }, { key: 'name', width: 22 }, { key: 'tcid', width: 10 }, { key: 'feat', width: 22 },
      { key: 'task', width: 40 }, { key: 'expected', width: 40 },
      { key: 'status', width: 16 }, { key: 'notes', width: 35 }, { key: 'date', width: 20 },
    ]
    applyHeaders(sh, ['Participant ID', 'Nama', 'Test Case ID', 'Feature', 'Task', 'Expected Result', 'Status', 'Catatan Kendala Task', 'Tanggal'])
    for (const p of participants) {
      for (const r of p.uatTaskResponses) {
        sh.addRow([p.participantCode, p.name, r.task.taskCode, r.task.feature || '', r.task.description,
          r.task.expectedResult || '', r.status, r.notes || '', r.completedAt.toLocaleDateString('id-ID')])
      }
    }

    const sh7 = workbook.addWorksheet('UAT RESULTS')
    sh7.columns = [
      { key: 'code', width: 14 }, { key: 'name', width: 22 },
      { key: 'rate', width: 20 }, { key: 'acc', width: 24 },
      { key: 'fb1', width: 40 }, { key: 'fb2', width: 40 }, { key: 'fb3', width: 40 },
      { key: 'date', width: 20 }
    ]
    applyHeaders(sh7, [
      'Participant ID', 'Nama', 'Task Success Rate (%)', 'Overall Acceptance Rating',
      'Kesesuaian Fungsi (FB1)', 'Kendala/Bug Ditemukan (FB2)', 'Saran & Kritik Final (FB3)',
      'Tanggal Selesai'
    ])
    for (const p of participants) {
      if (p.uatTaskResponses.length > 0 || p.uatOverallFeedback.length > 0) {
        const passed = p.uatTaskResponses.filter(r => r.status === 'BERHASIL').length
        const total = p.uatTaskResponses.length
        const rate = total > 0 ? parseFloat(((passed / total) * 100).toFixed(2)) : null
        const fb = p.uatOverallFeedback[0]
        const acc = fb?.meanRating ?? null
        const date = fb?.completedAt.toLocaleDateString('id-ID') ?? ''
        sh7.addRow([
          p.participantCode, p.name, rate, acc,
          fb?.fb1 || '', fb?.fb2 || '', fb?.fb3 || '',
          date
        ])
      }
    }
  }

  // Sheet 8 — LONGITUDINAL
  if (type === 'all' || type === 'longitudinal') {
    const sh = workbook.addWorksheet('LONGITUDINAL')
    sh.columns = [
      { key: 'code', width: 14 }, { key: 'sus', width: 12 },
      { key: 'att', width: 16 }, { key: 'per', width: 14 }, { key: 'eff', width: 14 },
      { key: 'dep', width: 16 }, { key: 'sti', width: 14 }, { key: 'nov', width: 12 },
      { key: 'uatRate', width: 20 }, { key: 'uatAcc', width: 24 },
      { key: 'susDone', width: 18 }, { key: 'ueqDone', width: 18 }, { key: 'uatDone', width: 18 },
      { key: 'status', width: 16 },
    ]
    applyHeaders(sh, [
      'Participant ID', 'SUS Score',
      'UEQ Attractiveness', 'UEQ Perspicuity', 'UEQ Efficiency',
      'UEQ Dependability', 'UEQ Stimulation', 'UEQ Novelty',
      'UAT Success Rate (%)', 'UAT Acceptance Mean',
      'SUS Selesai', 'UEQ Selesai', 'UAT Selesai', 'Status Keseluruhan',
    ])
    for (const p of participants) {
      const sus = p.susResponses[0]
      const ueq = p.ueqResponses[0]
      const passed = p.uatTaskResponses.filter(r => r.status === 'BERHASIL').length
      const total = p.uatTaskResponses.length
      const uatRate = total > 0 ? parseFloat(((passed / total) * 100).toFixed(2)) : null
      const uatAcc = p.uatOverallFeedback[0]?.meanRating ?? null

      const hasSus = !!sus
      const hasUeq = !!ueq
      const hasUat = !!p.uatOverallFeedback[0]

      let overallStatus = 'Belum Mulai'
      if (hasSus && hasUeq && hasUat) overallStatus = 'Selesai'
      else if (hasSus || hasUeq || hasUat) overallStatus = 'Sebagian'

      sh.addRow([
        p.participantCode,
        sus?.susScore ?? null,
        ueq?.attractiveness ?? null, ueq?.perspicuity ?? null, ueq?.efficiency ?? null,
        ueq?.dependability ?? null, ueq?.stimulation ?? null, ueq?.novelty ?? null,
        uatRate, uatAcc,
        sus ? sus.completedAt.toLocaleDateString('id-ID') : null,
        ueq ? ueq.completedAt.toLocaleDateString('id-ID') : null,
        p.uatOverallFeedback[0] ? p.uatOverallFeedback[0].completedAt.toLocaleDateString('id-ID') : null,
        overallStatus,
      ])
    }
  }

  // Style all rows
  workbook.worksheets.forEach(sheet => {
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'hair' }, left: { style: 'hair' },
          bottom: { style: 'hair' }, right: { style: 'hair' }
        }
      })
      if (rowNumber % 2 === 0) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4FF' } }
        })
      }
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const filename = `data-evaluasi-disnakertrans-${type}-${new Date().toISOString().split('T')[0]}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
