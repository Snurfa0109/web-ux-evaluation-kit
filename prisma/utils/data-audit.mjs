/**
 * Utilitas Audit dan Verifikasi Integritas Data Evaluasi (SUS, UEQ, UAT)
 * Memvalidasi konsistensi data responden, task completion rate, dan skor rata-rata.
 */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const overallList = await prisma.uatOverallFeedback.findMany({
    include: { participant: true },
    orderBy: { completedAt: 'asc' }
  })
  const taskList = await prisma.uatTaskResponse.findMany()
  const ueqList = await prisma.ueqResponse.findMany({ select: { participantId: true } })

  console.log(`UAT overall records : ${overallList.length}`)
  console.log(`UAT task records    : ${taskList.length}`)

  const successCount = taskList.filter(t => t.status === 'BERHASIL').length
  const successRate = taskList.length > 0
    ? ((successCount / taskList.length) * 100).toFixed(2)
    : '0.00'
  console.log(`Task success rate   : ${successRate}%`)

  const avgAcceptance = overallList.length > 0
    ? (overallList.reduce((a, b) => a + b.meanRating, 0) / overallList.length).toFixed(2)
    : '0.00'
  console.log(`Avg acceptance      : ${avgAcceptance} / 5.00`)

  const ueqIds = new Set(ueqList.map(u => u.participantId))
  const uatIds = new Set(overallList.map(u => u.participantId))
  const allMatch = [...ueqIds].every(id => uatIds.has(id)) && [...uatIds].every(id => ueqIds.has(id))
  console.log(`Phase 2/3 parity    : ${allMatch ? 'OK' : 'MISMATCH'}`)

  if (overallList.length > 0) {
    console.log(`Earliest entry      : ${overallList[0].completedAt.toISOString()}`)
    console.log(`Latest entry        : ${overallList[overallList.length - 1].completedAt.toISOString()}`)
  }

  const complete = await prisma.participant.count({
    where: {
      susResponses: { some: {} },
      ueqResponses: { some: {} },
      uatOverallFeedback: { some: {} }
    }
  })
  console.log(`3-phase complete     : ${complete} participants`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
