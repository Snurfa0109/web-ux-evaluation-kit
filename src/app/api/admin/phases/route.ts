import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const phases = await prisma.studyPhase.findMany({
    orderBy: { phaseNumber: 'asc' },
    include: { tasks: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(phases)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const phase = await prisma.studyPhase.create({ data: body })
  return NextResponse.json(phase)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  // Strip non-updatable & relation fields from Prisma update
  const {
    id,
    tasks,
    susResponses,
    ueqResponses,
    uatTaskResponses,
    uatOverallFeedback,
    createdAt,
    updatedAt,
    ...updateData
  } = body

  // Normalize dates: convert empty string to null
  if ('startDate' in updateData) {
    updateData.startDate = updateData.startDate ? new Date(updateData.startDate) : null
  }
  if ('endDate' in updateData) {
    updateData.endDate = updateData.endDate ? new Date(updateData.endDate) : null
  }

  const phase = await prisma.studyPhase.update({ where: { id }, data: updateData })
  return NextResponse.json(phase)
}

