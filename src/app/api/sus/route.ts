import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateSusScore } from '@/lib/sus-instrument'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { participantCode, phaseId, responses, feedback } = body

    if (!participantCode || !phaseId || !responses || responses.length !== 10) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }

    const participant = await prisma.participant.findUnique({
      where: { participantCode: participantCode.toUpperCase() },
    })
    if (!participant) return NextResponse.json({ error: 'Participant tidak ditemukan' }, { status: 404 })

    const phase = await prisma.studyPhase.findUnique({ where: { id: parseInt(phaseId) } })
    if (!phase || phase.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Phase tidak aktif' }, { status: 403 })
    }

    const susScore = calculateSusScore(responses)

    const feedbackData = {
      fb1: feedback?.fb1 ?? null,
      fb2: feedback?.fb2 ?? null,
      fb3: feedback?.fb3 ?? null,
      fb4: feedback?.fb4 ?? null,
      fb5: feedback?.fb5 ?? null,
      fb6: feedback?.fb6 ?? null,
      fb6Phone: feedback?.fb6_phone ?? null,
    }

    if (feedback?.fb6 === 'Ya' && feedback?.fb6_phone) {
      await prisma.participant.update({
        where: { id: participant.id },
        data: { whatsappNumber: feedback.fb6_phone },
      })
    }

    const response = await prisma.susResponse.upsert({
      where: { participantId_phaseId: { participantId: participant.id, phaseId: parseInt(phaseId) } },
      update: {
        q1: responses[0], q2: responses[1], q3: responses[2], q4: responses[3], q5: responses[4],
        q6: responses[5], q7: responses[6], q8: responses[7], q9: responses[8], q10: responses[9],
        susScore,
        ...feedbackData,
        completedAt: new Date(),
      },
      create: {
        participantId: participant.id,
        phaseId: parseInt(phaseId),
        q1: responses[0], q2: responses[1], q3: responses[2], q4: responses[3], q5: responses[4],
        q6: responses[5], q7: responses[6], q8: responses[7], q9: responses[8], q10: responses[9],
        susScore,
        ...feedbackData,
      },
    })

    return NextResponse.json({ success: true, susScore: response.susScore })
  } catch (error: any) {
    console.error('SUS submit error:', error)
    return NextResponse.json({ error: error?.message || 'Gagal menyimpan respons SUS' }, { status: 500 })
  }
}
