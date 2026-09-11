import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeEffectivePhaseStatus } from '@/lib/phase-helper'

// GET /api/participant/[code]
export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode } = await context.params
    const code = rawCode.toUpperCase()

    const participant = await prisma.participant.findUnique({
      where: { participantCode: code },
      include: {
        susResponses: { include: { phase: true } },
        ueqResponses: { include: { phase: true } },
        uatTaskResponses: { include: { phase: true, task: true } },
        uatOverallFeedback: { include: { phase: true } },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Participant Code tidak ditemukan' }, { status: 404 })
    }

    // Get all active/scheduled phases
    const phases = await prisma.studyPhase.findMany({
      orderBy: { phaseNumber: 'asc' },
      include: { tasks: { orderBy: { order: 'asc' } } },
    })

    const phaseStatus = phases.map((phase) => {
      const schedule = computeEffectivePhaseStatus(phase)
      const effectiveStatus = schedule.effectiveStatus

      let status: 'completed' | 'available' | 'locked' | 'not_started' = 'locked'
      let completedAt: string | null = null

      if (phase.instrument === 'SUS') {
        const resp = participant.susResponses.find(r => r.phaseId === phase.id)
        if (resp) { status = 'completed'; completedAt = resp.completedAt.toISOString() }
        else if (effectiveStatus === 'ACTIVE') status = 'available'
        else if (effectiveStatus === 'CLOSED') status = 'locked'
        else status = 'not_started'
      } else if (phase.instrument === 'UEQ') {
        const resp = participant.ueqResponses.find(r => r.phaseId === phase.id)
        if (resp) { status = 'completed'; completedAt = resp.completedAt.toISOString() }
        else if (effectiveStatus === 'ACTIVE') status = 'available'
        else if (effectiveStatus === 'CLOSED') status = 'locked'
        else status = 'not_started'
      } else if (phase.instrument === 'UAT') {
        const taskResps = participant.uatTaskResponses.filter(r => r.phaseId === phase.id)
        const feedback = participant.uatOverallFeedback.find(r => r.phaseId === phase.id)
        if (feedback) { status = 'completed'; completedAt = feedback.completedAt.toISOString() }
        else if (effectiveStatus === 'ACTIVE') status = 'available'
        else if (effectiveStatus === 'CLOSED') status = 'locked'
        else status = 'not_started'
      }

      return {
        id: phase.id,
        phaseNumber: phase.phaseNumber,
        phaseName: phase.phaseName,
        instrument: phase.instrument,
        phaseStatus: effectiveStatus,
        participantStatus: status,
        isExpired: schedule.isExpired,
        isUpcoming: schedule.isUpcoming,
        scheduleMessage: schedule.scheduleMessage,
        completedAt,
        tasks: phase.tasks,
        externalUrl: phase.externalUrl,
        instructions: phase.instructions,
      }
    })


    return NextResponse.json({
      participantCode: participant.participantCode,
      name: participant.name,
      whatsappNumber: participant.whatsappNumber,
      phases: phaseStatus,
    })
  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
