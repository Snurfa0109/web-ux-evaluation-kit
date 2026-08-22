import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    if (body.confirmText !== 'RESET') {
      return NextResponse.json({ error: 'Teks konfirmasi salah' }, { status: 400 })
    }

    // Reset all research data
    await prisma.$transaction([
      prisma.susResponse.deleteMany({}),
      prisma.ueqResponse.deleteMany({}),
      prisma.uatTaskResponse.deleteMany({}),
      prisma.uatOverallFeedback.deleteMany({}),
      prisma.participant.deleteMany({}),
    ])

    return NextResponse.json({ success: true, message: 'Seluruh data pengetesan berhasil dikosongkan untuk Go-Live' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal mereset data' }, { status: 500 })
  }
}
