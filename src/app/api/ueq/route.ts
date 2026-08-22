import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateUeqScores } from '@/lib/ueq-instrument'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { participantCode, phaseId, responses, feedback } = body

    if (!participantCode || !phaseId || !responses || responses.length !== 26) {
      return NextResponse.json({ error: 'Data tidak valid — UEQ memerlukan 26 jawaban' }, { status: 400 })
    }

    const participant = await prisma.participant.findUnique({
      where: { participantCode: participantCode.toUpperCase() },
    })
    if (!participant) return NextResponse.json({ error: 'Participant tidak ditemukan' }, { status: 404 })

    const phase = await prisma.studyPhase.findUnique({ where: { id: parseInt(phaseId) } })
    if (!phase || phase.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Phase tidak aktif' }, { status: 403 })
    }

    const scores = calculateUeqScores(responses)

    const feedbackData = {
      fb1: feedback?.fb1 ?? null,
      fb2: feedback?.fb2 ?? null,
      fb3: feedback?.fb3 ?? null,
      fb4: feedback?.fb4 ?? null,
      fb4Phone: feedback?.fb4_phone ?? null,
    }

    if (feedback?.fb4 === 'Ya' && feedback?.fb4_phone) {
      await prisma.participant.update({
        where: { id: participant.id },
        data: { whatsappNumber: feedback.fb4_phone },
      })
    }

    const response = await prisma.ueqResponse.upsert({
      where: { participantId_phaseId: { participantId: participant.id, phaseId: parseInt(phaseId) } },
      update: {
        item1: responses[0],   item2: responses[1],   item3: responses[2],
        item4: responses[3],   item5: responses[4],   item6: responses[5],
        item7: responses[6],   item8: responses[7],   item9: responses[8],
        item10: responses[9],  item11: responses[10], item12: responses[11],
        item13: responses[12], item14: responses[13], item15: responses[14],
        item16: responses[15], item17: responses[16], item18: responses[17],
        item19: responses[18], item20: responses[19], item21: responses[20],
        item22: responses[21], item23: responses[22], item24: responses[23],
        item25: responses[24], item26: responses[25],
        ...scores,
        ...feedbackData,
        completedAt: new Date(),
      },
      create: {
        participantId: participant.id,
        phaseId: parseInt(phaseId),
        item1: responses[0],   item2: responses[1],   item3: responses[2],
        item4: responses[3],   item5: responses[4],   item6: responses[5],
        item7: responses[6],   item8: responses[7],   item9: responses[8],
        item10: responses[9],  item11: responses[10], item12: responses[11],
        item13: responses[12], item14: responses[13], item15: responses[14],
        item16: responses[15], item17: responses[16], item18: responses[17],
        item19: responses[18], item20: responses[19], item21: responses[20],
        item22: responses[21], item23: responses[22], item24: responses[23],
        item25: responses[24], item26: responses[25],
        ...scores,
        ...feedbackData,
      },
    })

    return NextResponse.json({ success: true, scores })
  } catch (error: any) {
    console.error('UEQ submit error:', error)
    return NextResponse.json({ error: error?.message || 'Gagal menyimpan respons UEQ' }, { status: 500 })
  }
}
