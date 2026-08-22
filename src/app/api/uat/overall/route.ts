import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/uat/overall — submit overall acceptance feedback
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { participantCode, phaseId, rating1, rating2, rating3, rating4, rating5, feedback } = body

    const participant = await prisma.participant.findUnique({
      where: { participantCode: participantCode.toUpperCase() },
    })
    if (!participant) return NextResponse.json({ error: 'Participant tidak ditemukan' }, { status: 404 })

    const validRatings = [rating1, rating2, rating3, rating4, rating5].filter(r => typeof r === 'number' && r > 0)
    const sum = validRatings.reduce((acc, curr) => acc + curr, 0)
    const meanRating = validRatings.length > 0 ? parseFloat((sum / validRatings.length).toFixed(2)) : 0

    const feedbackData = {
      fb1: feedback?.fb1 ?? null,
      fb2: feedback?.fb2 ?? null,
      fb3: feedback?.fb3 ?? null,
    }

    await prisma.uatOverallFeedback.upsert({
      where: {
        participantId_phaseId: {
          participantId: participant.id,
          phaseId: parseInt(phaseId),
        },
      },
      update: {
        rating1, rating2, rating3,
        rating4: rating4 ?? null,
        rating5: rating5 ?? null,
        meanRating,
        ...feedbackData,
        completedAt: new Date(),
      },
      create: {
        participantId: participant.id,
        phaseId: parseInt(phaseId),
        rating1, rating2, rating3,
        rating4: rating4 ?? null,
        rating5: rating5 ?? null,
        meanRating,
        ...feedbackData,
      },
    })

    return NextResponse.json({ success: true, meanRating })
  } catch (error: any) {
    console.error('UAT overall submit error:', error)
    return NextResponse.json({ error: error?.message || 'Gagal menyimpan feedback keseluruhan' }, { status: 500 })
  }
}
