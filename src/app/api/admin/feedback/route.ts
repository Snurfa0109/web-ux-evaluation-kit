import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // 1. SUS Feedback
    const susFeedbacks = await prisma.susResponse.findMany({
      select: {
        id: true,
        participantId: true,
        susScore: true,
        fb1: true,
        fb2: true,
        fb3: true,
        fb4: true,
        fb5: true,
        fb6: true,
        fb6Phone: true,
        completedAt: true,
        participant: {
          select: {
            id: true,
            participantCode: true,
            name: true,
            occupation: true,
            age: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    })

    // 2. UEQ Feedback
    const ueqFeedbacks = await prisma.ueqResponse.findMany({
      select: {
        id: true,
        participantId: true,
        attractiveness: true,
        perspicuity: true,
        efficiency: true,
        dependability: true,
        stimulation: true,
        novelty: true,
        fb1: true,
        fb2: true,
        fb3: true,
        fb4: true,
        fb4Phone: true,
        completedAt: true,
        participant: {
          select: {
            id: true,
            participantCode: true,
            name: true,
            occupation: true,
            age: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    })

    // 3. UAT Feedback
    const uatOverallFeedbacks = await prisma.uatOverallFeedback.findMany({
      select: {
        id: true,
        participantId: true,
        meanRating: true,
        fb1: true,
        fb2: true,
        fb3: true,
        completedAt: true,
        participant: {
          select: {
            id: true,
            participantCode: true,
            name: true,
            occupation: true,
            age: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    })

    const uatTaskNotes = await prisma.uatTaskResponse.findMany({
      where: { notes: { not: null } },
      select: {
        id: true,
        status: true,
        notes: true,
        completedAt: true,
        task: {
          select: {
            taskCode: true,
            title: true,
          },
        },
        participant: {
          select: {
            id: true,
            participantCode: true,
            name: true,
            occupation: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    })

    return NextResponse.json({
      sus: susFeedbacks,
      ueq: ueqFeedbacks,
      uat: {
        overall: uatOverallFeedbacks,
        taskNotes: uatTaskNotes,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal memuat feedback' }, { status: 500 })
  }
}
