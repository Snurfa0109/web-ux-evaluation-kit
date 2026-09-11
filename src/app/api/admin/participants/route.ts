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
      susResponses: {
        include: { phase: true },
      },
      ueqResponses: {
        include: { phase: true },
      },
      uatOverallFeedback: {
        include: { phase: true },
      },
      uatTaskResponses: {
        include: { phase: true, task: true },
        orderBy: { taskId: 'asc' },
      },
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
      createdAt: p.createdAt,

      // Flags
      hasSus,
      hasUeq,
      hasUat,
      overallStatus,

      // Complete SUS Data (Quantitative + Qualitative)
      susScore: sus?.susScore ?? null,
      susCompletedAt: sus?.completedAt ?? null,
      susDetails: sus ? {
        id: sus.id,
        q1: sus.q1, q2: sus.q2, q3: sus.q3, q4: sus.q4, q5: sus.q5,
        q6: sus.q6, q7: sus.q7, q8: sus.q8, q9: sus.q9, q10: sus.q10,
        susScore: sus.susScore,
        fb1: sus.fb1,
        fb2: sus.fb2,
        fb3: sus.fb3,
        fb4: sus.fb4,
        fb5: sus.fb5,
        fb6: sus.fb6,
        fb6Phone: sus.fb6Phone,
        completedAt: sus.completedAt,
      } : null,
      susFb6: sus?.fb6 ?? null,

      // Complete UEQ Data (Quantitative + Qualitative)
      ueqAttractiveness: ueq?.attractiveness ?? null,
      ueqPerspicuity: ueq?.perspicuity ?? null,
      ueqEfficiency: ueq?.efficiency ?? null,
      ueqDependability: ueq?.dependability ?? null,
      ueqStimulation: ueq?.stimulation ?? null,
      ueqNovelty: ueq?.novelty ?? null,
      ueqCompletedAt: ueq?.completedAt ?? null,
      ueqDetails: ueq ? {
        id: ueq.id,
        item1: ueq.item1, item2: ueq.item2, item3: ueq.item3, item4: ueq.item4, item5: ueq.item5,
        item6: ueq.item6, item7: ueq.item7, item8: ueq.item8, item9: ueq.item9, item10: ueq.item10,
        item11: ueq.item11, item12: ueq.item12, item13: ueq.item13, item14: ueq.item14, item15: ueq.item15,
        item16: ueq.item16, item17: ueq.item17, item18: ueq.item18, item19: ueq.item19, item20: ueq.item20,
        item21: ueq.item21, item22: ueq.item22, item23: ueq.item23, item24: ueq.item24, item25: ueq.item25,
        item26: ueq.item26,
        attractiveness: ueq.attractiveness,
        perspicuity: ueq.perspicuity,
        efficiency: ueq.efficiency,
        dependability: ueq.dependability,
        stimulation: ueq.stimulation,
        novelty: ueq.novelty,
        fb1: ueq.fb1,
        fb2: ueq.fb2,
        fb3: ueq.fb3,
        fb4: ueq.fb4,
        fb4Phone: ueq.fb4Phone,
        completedAt: ueq.completedAt,
      } : null,
      ueqFb4: ueq?.fb4 ?? null,

      // Complete UAT Data (Quantitative Tasks + Acceptance + Qualitative)
      uatSuccessRate,
      uatAcceptanceMean: uatFeedback?.meanRating ?? null,
      uatCompletedAt: uatFeedback?.completedAt ?? null,
      uatDetails: {
        overall: uatFeedback ? {
          id: uatFeedback.id,
          rating1: uatFeedback.rating1,
          rating2: uatFeedback.rating2,
          rating3: uatFeedback.rating3,
          rating4: uatFeedback.rating4,
          rating5: uatFeedback.rating5,
          meanRating: uatFeedback.meanRating,
          fb1: uatFeedback.fb1,
          fb2: uatFeedback.fb2,
          fb3: uatFeedback.fb3,
          completedAt: uatFeedback.completedAt,
        } : null,
        tasks: p.uatTaskResponses.map(r => ({
          id: r.id,
          taskId: r.taskId,
          taskCode: r.task.taskCode,
          taskTitle: r.task.title,
          feature: r.task.feature,
          status: r.status,
          notes: r.notes,
          timeOnTaskSeconds: r.timeOnTaskSeconds,
          completedAt: r.completedAt,
        })),
      },
    }
  })

  return NextResponse.json(mapped)
}

