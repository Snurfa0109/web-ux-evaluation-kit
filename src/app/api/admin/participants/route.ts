import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const participants = await prisma.participant.findMany({
    orderBy: { participantCode: 'asc' },
    include: {
      susResponses: true,
      ueqResponses: true,
      uatOverallFeedback: true,
      uatTaskResponses: { include: { phase: true } },
    },
  })

  const phases = await prisma.studyPhase.findMany({ orderBy: { phaseNumber: 'asc' } })

  const mapped = participants.map(p => {
    const sus = p.susResponses[0] || null
    const ueq = p.ueqResponses[0] || null
    const uatFeedback = p.uatOverallFeedback[0] || null

    // UAT success rate
    let uatSuccessRate: number | null = null
    if (p.uatTaskResponses.length > 0) {
      const phase3 = phases.find(ph => ph.instrument === 'UAT')
      if (phase3) {
        const phase3Tasks = p.uatTaskResponses.filter(r => r.phaseId === phase3.id)
        if (phase3Tasks.length > 0) {
          const passed = phase3Tasks.filter(r => r.status === 'BERHASIL').length
          uatSuccessRate = parseFloat(((passed / phase3Tasks.length) * 100).toFixed(2))
        }
      }
    }

    const hasSus = !!sus
    const hasUeq = !!ueq
    const hasUat = !!uatFeedback

    let overallStatus = 'Belum Mulai'
    if (hasSus && hasUeq && hasUat) overallStatus = 'Selesai'
    else if (hasSus || hasUeq || hasUat) overallStatus = 'Sebagian'

    return {
      id: p.id,
      participantCode: p.participantCode,
      name: p.name,
      age: p.age,
      gender: p.gender,
      occupation: p.occupation,
      governmentWebsiteExperience: p.governmentWebsiteExperience,
      disnakertransExperience: p.disnakertransExperience,
      whatsappNumber: p.whatsappNumber,
      susFb6: sus?.fb6 ?? null,
      ueqFb4: ueq?.fb4 ?? null,
      createdAt: p.createdAt,
      hasSus,
      hasUeq,
      hasUat,
      susScore: sus?.susScore ?? null,
      susCompletedAt: sus?.completedAt ?? null,
      ueqAttractiveness: ueq?.attractiveness ?? null,
      ueqPerspicuity: ueq?.perspicuity ?? null,
      ueqEfficiency: ueq?.efficiency ?? null,
      ueqDependability: ueq?.dependability ?? null,
      ueqStimulation: ueq?.stimulation ?? null,
      ueqNovelty: ueq?.novelty ?? null,
      ueqCompletedAt: ueq?.completedAt ?? null,
      uatSuccessRate,
      uatAcceptanceMean: uatFeedback?.meanRating ?? null,
      uatCompletedAt: uatFeedback?.completedAt ?? null,
      overallStatus,
    }
  })

  return NextResponse.json(mapped)
}
