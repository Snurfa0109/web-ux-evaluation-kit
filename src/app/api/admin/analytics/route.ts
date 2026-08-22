import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    totalParticipants,
    susCount,
    ueqCount,
    uatCount,
    susResponses,
    ueqResponses,
    uatFeedbacks,
    uatTaskResponses,
    phases,
  ] = await Promise.all([
    prisma.participant.count(),
    prisma.susResponse.count(),
    prisma.ueqResponse.count(),
    prisma.uatOverallFeedback.count(),
    prisma.susResponse.findMany({ select: { susScore: true, completedAt: true } }),
    prisma.ueqResponse.findMany({
      select: { attractiveness: true, perspicuity: true, efficiency: true, dependability: true, stimulation: true, novelty: true, completedAt: true }
    }),
    prisma.uatOverallFeedback.findMany({ select: { meanRating: true } }),
    prisma.uatTaskResponse.findMany({ select: { status: true, phaseId: true } }),
    prisma.studyPhase.findMany({ orderBy: { phaseNumber: 'asc' } }),
  ])

  // Participants who completed all 3 phases
  const participants = await prisma.participant.findMany({
    include: { susResponses: true, ueqResponses: true, uatOverallFeedback: true }
  })
  const completedAll = participants.filter(p =>
    p.susResponses.length > 0 && p.ueqResponses.length > 0 && p.uatOverallFeedback.length > 0
  ).length

  const avgSus = susResponses.length > 0
    ? susResponses.reduce((a, b) => a + b.susScore, 0) / susResponses.length
    : null

  const avgUeq = ueqResponses.length > 0 ? {
    attractiveness: ueqResponses.reduce((a, b) => a + b.attractiveness, 0) / ueqResponses.length,
    perspicuity:    ueqResponses.reduce((a, b) => a + b.perspicuity, 0) / ueqResponses.length,
    efficiency:     ueqResponses.reduce((a, b) => a + b.efficiency, 0) / ueqResponses.length,
    dependability:  ueqResponses.reduce((a, b) => a + b.dependability, 0) / ueqResponses.length,
    stimulation:    ueqResponses.reduce((a, b) => a + b.stimulation, 0) / ueqResponses.length,
    novelty:        ueqResponses.reduce((a, b) => a + b.novelty, 0) / ueqResponses.length,
  } : null

  const avgUatAcceptance = uatFeedbacks.length > 0
    ? uatFeedbacks.reduce((a, b) => a + b.meanRating, 0) / uatFeedbacks.length
    : null

  const phase3 = phases.find(p => p.instrument === 'UAT')
  let uatSuccessRate: number | null = null
  if (phase3) {
    const p3Tasks = uatTaskResponses.filter(r => r.phaseId === phase3.id)
    if (p3Tasks.length > 0) {
      uatSuccessRate = (p3Tasks.filter(r => r.status === 'BERHASIL').length / p3Tasks.length) * 100
    }
  }

  return NextResponse.json({
    totalParticipants,
    susCount,
    ueqCount,
    uatCount,
    completedAll,
    avgSus: avgSus ? parseFloat(avgSus.toFixed(2)) : null,
    avgUeq,
    avgUatAcceptance: avgUatAcceptance ? parseFloat(avgUatAcceptance.toFixed(2)) : null,
    uatSuccessRate: uatSuccessRate ? parseFloat(uatSuccessRate.toFixed(2)) : null,
    phases,
    susDistribution: susResponses.map(r => r.susScore),
    ueqResponses,
  })
}
