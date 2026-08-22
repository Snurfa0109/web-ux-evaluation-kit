import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/participant/register
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, age, gender, occupation, governmentWebsiteExperience, disnakertransExperience } = body

    if (!name || !age || !gender || !occupation) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Generate unique random participant code (e.g. R-X7K2M9)
    const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars (0,O,1,I)
    let code = ''
    let isUnique = false
    while (!isUnique) {
      code = 'R-' + Array.from({ length: 7 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
      const existing = await prisma.participant.findUnique({ where: { participantCode: code } })
      isUnique = !existing
    }

    const participant = await prisma.participant.create({
      data: {
        participantCode: code,
        name: name.trim(),
        age: parseInt(age),
        gender,
        occupation: occupation.trim(),
        governmentWebsiteExperience: governmentWebsiteExperience === true || governmentWebsiteExperience === 'ya',
        disnakertransExperience: disnakertransExperience === true || disnakertransExperience === 'ya',
      },
    })

    return NextResponse.json({
      participantCode: participant.participantCode,
      name: participant.name,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Gagal mendaftarkan peserta' }, { status: 500 })
  }
}
