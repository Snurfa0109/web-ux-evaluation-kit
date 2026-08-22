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
      susResponses: true,
      ueqResponses: true,
      uatTaskResponses: { include: { task: true } },
      uatOverallFeedback: true,
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

  // Sheet 2 — SUS RAW
  if (type === 'all' || type === 'sus') {
    const sh = workbook.addWorksheet('SUS RAW')
    sh.columns = [{ key: 'code', width: 14 }, ...Array.from({ length: 10 }, (_, i) => ({ key: `q${i+1}`, width: 8 })), { key: 'date', width: 20 }]
    applyHeaders(sh, ['Participant ID', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Tanggal Selesai'])
    for (const p of participants) {
      if (p.susResponses.length > 0) {
        const s = p.susResponses[0]
        sh.addRow([p.participantCode, s.q1, s.q2, s.q3, s.q4, s.q5, s.q6, s.q7, s.q8, s.q9, s.q10,
          s.completedAt.toLocaleDateString('id-ID')])
      }
    }

    // Sheet 3 — SUS RESULTS
    const sh3 = workbook.addWorksheet('SUS RESULTS')
    sh3.columns = [{ key: 'code', width: 14 }, { key: 'score', width: 12 }, { key: 'date', width: 20 }]
    applyHeaders(sh3, ['Participant ID', 'SUS Score', 'Tanggal Selesai'])
    for (const p of participants) {
      if (p.susResponses.length > 0) {
        const s = p.susResponses[0]
        sh3.addRow([p.participantCode, s.susScore, s.completedAt.toLocaleDateString('id-ID')])
      }
    }
  }

  // Sheet 4 — UEQ RAW
  if (type === 'all' || type === 'ueq') {
    const sh = workbook.addWorksheet('UEQ RAW')
    const itemCols = Array.from({ length: 26 }, (_, i) => ({ key: `item${i+1}`, width: 8 }))
    sh.columns = [{ key: 'code', width: 14 }, ...itemCols, { key: 'date', width: 20 }]
    applyHeaders(sh, ['Participant ID', ...Array.from({ length: 26 }, (_, i) => `Item ${i+1}`), 'Tanggal Selesai'])
    for (const p of participants) {
      if (p.ueqResponses.length > 0) {
        const u = p.ueqResponses[0]
        sh.addRow([p.participantCode,
          u.item1, u.item2, u.item3, u.item4, u.item5, u.item6, u.item7,
          u.item8, u.item9, u.item10, u.item11, u.item12, u.item13,
          u.item14, u.item15, u.item16, u.item17, u.item18, u.item19,
          u.item20, u.item21, u.item22, u.item23, u.item24, u.item25, u.item26,
          u.completedAt.toLocaleDateString('id-ID')])
      }
    }

    // Sheet 5 — UEQ RESULTS
    const sh5 = workbook.addWorksheet('UEQ RESULTS')
    sh5.columns = [
      { key: 'code', width: 14 }, { key: 'att', width: 16 }, { key: 'per', width: 14 },
      { key: 'eff', width: 14 }, { key: 'dep', width: 16 }, { key: 'sti', width: 14 },
      { key: 'nov', width: 12 }, { key: 'date', width: 20 }
    ]
    applyHeaders(sh5, ['Participant ID', 'Attractiveness', 'Perspicuity', 'Efficiency',
      'Dependability', 'Stimulation', 'Novelty', 'Tanggal Selesai'])
    for (const p of participants) {
      if (p.ueqResponses.length > 0) {
        const u = p.ueqResponses[0]
        sh5.addRow([p.participantCode, u.attractiveness, u.perspicuity, u.efficiency,
          u.dependability, u.stimulation, u.novelty, u.completedAt.toLocaleDateString('id-ID')])
      }
    }
  }

  // Sheets 6 & 7 — UAT
  if (type === 'all' || type === 'uat') {
    const sh = workbook.addWorksheet('UAT RAW')
    sh.columns = [
      { key: 'code', width: 14 }, { key: 'tcid', width: 10 }, { key: 'feat', width: 22 },
      { key: 'task', width: 40 }, { key: 'expected', width: 40 },
      { key: 'status', width: 16 }, { key: 'notes', width: 30 }, { key: 'date', width: 20 },
    ]
    applyHeaders(sh, ['Participant ID', 'Test Case ID', 'Feature', 'Task', 'Expected Result', 'Status', 'Catatan', 'Tanggal'])
    for (const p of participants) {
      for (const r of p.uatTaskResponses) {
        sh.addRow([p.participantCode, r.task.taskCode, r.task.feature || '', r.task.description,
          r.task.expectedResult || '', r.status, r.notes || '', r.completedAt.toLocaleDateString('id-ID')])
      }
    }

    const sh7 = workbook.addWorksheet('UAT RESULTS')
    sh7.columns = [
      { key: 'code', width: 14 }, { key: 'rate', width: 20 }, { key: 'acc', width: 24 }, { key: 'date', width: 20 }
    ]
    applyHeaders(sh7, ['Participant ID', 'Task Success Rate (%)', 'Overall Acceptance Rating', 'Tanggal Selesai'])
    for (const p of participants) {
      if (p.uatTaskResponses.length > 0 || p.uatOverallFeedback.length > 0) {
        const passed = p.uatTaskResponses.filter(r => r.status === 'BERHASIL').length
        const total = p.uatTaskResponses.length
        const rate = total > 0 ? parseFloat(((passed / total) * 100).toFixed(2)) : null
        const acc = p.uatOverallFeedback[0]?.meanRating ?? null
        const date = p.uatOverallFeedback[0]?.completedAt.toLocaleDateString('id-ID') ?? ''
        sh7.addRow([p.participantCode, rate, acc, date])
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
