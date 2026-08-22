import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const participant = await prisma.participant.findUnique({
    where: { id: parseInt(id) },
    include: {
      susResponses: { include: { phase: true } },
      ueqResponses: { include: { phase: true } },
      uatTaskResponses: { include: { task: true, phase: true } },
      uatOverallFeedback: { include: { phase: true } },
    },
  })

  if (!participant) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 })

  return NextResponse.json(participant)
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const participantId = parseInt(id)

  if (isNaN(participantId)) {
    return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'all'

  try {
    if (type === 'sus') {
      await prisma.susResponse.deleteMany({ where: { participantId } })
      return NextResponse.json({ success: true, message: 'Data kuesioner SUS berhasil dihapus' })
    }

    if (type === 'ueq') {
      await prisma.ueqResponse.deleteMany({ where: { participantId } })
      return NextResponse.json({ success: true, message: 'Data kuesioner UEQ berhasil dihapus' })
    }

    if (type === 'uat') {
      await prisma.$transaction([
        prisma.uatTaskResponse.deleteMany({ where: { participantId } }),
        prisma.uatOverallFeedback.deleteMany({ where: { participantId } }),
      ])
      return NextResponse.json({ success: true, message: 'Data kuesioner UAT berhasil dihapus' })
    }

    // Default: delete entire participant + all responses
    await prisma.$transaction([
      prisma.susResponse.deleteMany({ where: { participantId } }),
      prisma.ueqResponse.deleteMany({ where: { participantId } }),
      prisma.uatTaskResponse.deleteMany({ where: { participantId } }),
      prisma.uatOverallFeedback.deleteMany({ where: { participantId } }),
      prisma.participant.delete({ where: { id: participantId } }),
    ])

    return NextResponse.json({ success: true, message: 'Data responden berhasil dihapus seluruhnya' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menghapus data' }, { status: 500 })
  }
}

