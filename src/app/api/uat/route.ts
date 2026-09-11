import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeEffectivePhaseStatus } from '@/lib/phase-helper'

// POST /api/uat — submit individual task response
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { participantCode, phaseId, taskId, status, notes, timeOnTaskSeconds } = body

    const participant = await prisma.participant.findUnique({
      where: { participantCode: participantCode.toUpperCase() },
    })
    if (!participant) return NextResponse.json({ error: 'Participant tidak ditemukan' }, { status: 404 })

    const phase = await prisma.studyPhase.findUnique({ where: { id: parseInt(phaseId) } })
    if (!phase) return NextResponse.json({ error: 'Tahap pengujian tidak ditemukan' }, { status: 404 })

    const schedule = computeEffectivePhaseStatus(phase)
    if (schedule.effectiveStatus !== 'ACTIVE') {
      return NextResponse.json({
        error: `Tahap ini sudah ditutup atau belum dibuka (${schedule.scheduleMessage || 'Non-aktif'})`
      }, { status: 403 })
    }

    const duration = timeOnTaskSeconds ? parseInt(timeOnTaskSeconds) : null

    await prisma.uatTaskResponse.upsert({
      where: {
        participantId_phaseId_taskId: {
          participantId: participant.id,
          phaseId: parseInt(phaseId),
          taskId: parseInt(taskId),
        },
      },
      update: { status, notes: notes || null, timeOnTaskSeconds: duration, completedAt: new Date() },
      create: {
        participantId: participant.id,
        phaseId: parseInt(phaseId),
        taskId: parseInt(taskId),
        status,
        notes: notes || null,
        timeOnTaskSeconds: duration,
      },
    })


    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('UAT task submit error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan respons UAT' }, { status: 500 })
  }
}
