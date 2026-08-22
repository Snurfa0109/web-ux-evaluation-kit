import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/uat — submit individual task response
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { participantCode, phaseId, taskId, status, notes, timeOnTaskSeconds } = body

    const participant = await prisma.participant.findUnique({
      where: { participantCode: participantCode.toUpperCase() },
    })
    if (!participant) return NextResponse.json({ error: 'Participant tidak ditemukan' }, { status: 404 })

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
