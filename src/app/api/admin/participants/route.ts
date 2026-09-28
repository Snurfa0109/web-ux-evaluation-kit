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
        orderBy: { completedAt: 'desc' },
      },
      ueqResponses: {
        include: { phase: true },
        orderBy: { completedAt: 'desc' },
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
    const susFase1 = p.susResponses.find(r => r.phase?.phaseNumber === 1 || r.phaseId === 1) || null
    const susFase4 = p.susResponses.find(r => r.phase?.phaseNumber === 4 || r.phaseId === 30001) || null
    const sus = susFase4 || susFase1 || p.susResponses[0] || null
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

    const hasSus = p.susResponses.length > 0
    const hasUeq = !!ueq
    const hasUat = !!uatFeedback

    let overallStatus = 'Belum Mulai'
    if (hasSus && hasUeq && hasUat) overallStatus = 'Selesai'
    else if (hasSus || hasUeq || hasUat) overallStatus = 'Sebagian'

    const formatSusDetails = (item: any) => item ? {
      id: item.id,
      phaseId: item.phaseId,
      phaseNumber: item.phase?.phaseNumber ?? (item.phaseId === 1 ? 1 : 4),
      q1: item.q1, q2: item.q2, q3: item.q3, q4: item.q4, q5: item.q5,
      q6: item.q6, q7: item.q7, q8: item.q8, q9: item.q9, q10: item.q10,
      susScore: item.susScore,
      fb1: item.fb1,
      fb2: item.fb2,
      fb3: item.fb3,
      fb4: item.fb4,
      fb5: item.fb5,
      fb6: item.fb6,
      fb6Phone: item.fb6Phone,
      completedAt: item.completedAt,
    } : null

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
      hasSusFase1: !!susFase1,
      hasSusFase4: !!susFase4,
      overallStatus,

      // SUS Data per fase
      susFase1: formatSusDetails(susFase1),
      susFase4: formatSusDetails(susFase4),

      // Latest SUS fallback
      susScore: sus?.susScore ?? null,
      susCompletedAt: sus?.completedAt ?? null,
      susDetails: formatSusDetails(sus),
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

