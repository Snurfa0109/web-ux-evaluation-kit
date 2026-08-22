import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const NAMES = [
  'Siti Rahmawati', 'Budi Santoso', 'Rizky Pratama', 'Dewi Lestari', 'Ahmad Fauzi',
  'Anisa Fitriani', 'Fajar Nugraha', 'Indah Permatasari', 'Hendra Wijaya', 'Rina Anggraini',
  'Nurfadhilah', 'Bagus Saputra', 'Dini Kartika', 'Eko Prasetyo', 'Larasati'
]

const OCCUPATIONS = ['Pencari Kerja', 'Mahasiswa', 'Pegawai Swasta', 'Wirausaha', 'ASN']

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// POST /api/admin/bot-generator
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const count = parseInt(body.count || '5', 10)
    const tendency = body.tendency || 'HIGH' // HIGH | MIXED | EXCELLENT

    const phases = await prisma.studyPhase.findMany({ orderBy: { phaseNumber: 'asc' }, include: { tasks: true } })
    const phase1 = phases.find(p => p.instrument === 'SUS')
    const phase2 = phases.find(p => p.instrument === 'UEQ')
    const phase3 = phases.find(p => p.instrument === 'UAT')

    if (!phase1 || !phase2 || !phase3) {
      return NextResponse.json({ error: 'Tahapan penelitian belum lengkap di database.' }, { status: 400 })
    }

    const logs: string[] = []
    let createdCount = 0

    for (let i = 0; i < count; i++) {
      const name = NAMES[i % NAMES.length] + (i >= NAMES.length ? ` (${i + 1})` : '')
      const age = getRandomInt(20, 34)
      const gender = i % 2 === 0 ? 'Laki-laki' : 'Perempuan'
      const occupation = OCCUPATIONS[i % OCCUPATIONS.length]
      const wa = `0812345${String(i + 1).padStart(4, '0')}`

      // Generate unique code
      const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = ''
      let isUnique = false
      while (!isUnique) {
        code = 'BOT-' + Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
        const existing = await prisma.participant.findUnique({ where: { participantCode: code } })
        isUnique = !existing
      }

      // Create Participant
      const participant = await prisma.participant.create({
        data: {
          participantCode: code,
          name,
          age,
          gender,
          occupation,
          governmentWebsiteExperience: true,
          disnakertransExperience: i % 2 === 0,
          whatsappNumber: wa,
        },
      })

      // 1. SUS Response
      const isHigh = tendency === 'HIGH' || (tendency === 'MIXED' && i % 2 === 0) || tendency === 'EXCELLENT'
      const q1 = isHigh ? getRandomInt(4, 5) : getRandomInt(2, 3)
      const q2 = isHigh ? getRandomInt(1, 2) : getRandomInt(3, 4)
      const q3 = isHigh ? getRandomInt(4, 5) : getRandomInt(2, 3)
      const q4 = isHigh ? getRandomInt(1, 2) : getRandomInt(3, 4)
      const q5 = isHigh ? getRandomInt(4, 5) : getRandomInt(2, 3)
      const q6 = isHigh ? getRandomInt(1, 2) : getRandomInt(3, 4)
      const q7 = isHigh ? getRandomInt(4, 5) : getRandomInt(2, 3)
      const q8 = isHigh ? getRandomInt(1, 2) : getRandomInt(3, 4)
      const q9 = isHigh ? getRandomInt(4, 5) : getRandomInt(2, 3)
      const q10 = isHigh ? getRandomInt(1, 2) : getRandomInt(3, 4)
      const susScore = ((q1 - 1) + (5 - q2) + (q3 - 1) + (5 - q4) + (q5 - 1) + (5 - q6) + (q7 - 1) + (5 - q8) + (q9 - 1) + (5 - q10)) * 2.5

      await prisma.susResponse.create({
        data: {
          participantId: participant.id,
          phaseId: phase1.id,
          q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
          susScore,
          fb1: 'Fitur info pencarian lowongan kerja dan pelatihan.',
          fb2: 'Navigasi menu utama yang kadang membingungkan.',
          fb3: 'Persyaratan lengkap pembuatan AK.1.',
          fb4: 'Tampilkan filter lokasi dan bidang pekerjaan di halaman depan.',
          fb5: 'Desain visual disesuaikan agar lebih modern dan ramah HP.',
          fb6: 'Ya',
          fb6Phone: wa,
        },
      })

      // 2. UEQ Response
      const baseRating = tendency === 'EXCELLENT' ? 7 : tendency === 'HIGH' ? 6 : 5
      await prisma.ueqResponse.create({
        data: {
          participantId: participant.id,
          phaseId: phase2.id,
          item1: baseRating, item2: baseRating, item3: baseRating, item4: baseRating, item5: baseRating, item6: baseRating,
          item7: baseRating, item8: baseRating, item9: baseRating, item10: baseRating, item11: baseRating, item12: baseRating,
          item13: baseRating, item14: baseRating, item15: baseRating, item16: baseRating, item17: baseRating, item18: baseRating,
          item19: baseRating, item20: baseRating, item21: baseRating, item22: baseRating, item23: baseRating, item24: baseRating,
          item25: baseRating, item26: baseRating,
          attractiveness: (baseRating - 4) * 0.6,
          perspicuity: (baseRating - 4) * 0.65,
          efficiency: (baseRating - 4) * 0.55,
          dependability: (baseRating - 4) * 0.6,
          stimulation: (baseRating - 4) * 0.5,
          novelty: (baseRating - 4) * 0.45,
          fb1: 'Tampilan visual prototype terkesan elegan dan modern.',
          fb2: 'Beberapa kontras warna.',
          fb3: 'Tingkatkan kerapihan animasi.',
          fb4: 'Ya',
          fb4Phone: wa,
        },
      })

      // 3. UAT Tasks
      for (const t of phase3.tasks) {
        await prisma.uatTaskResponse.create({
          data: {
            participantId: participant.id,
            phaseId: phase3.id,
            taskId: t.id,
            status: 'PASS',
            notes: 'Tugas pengujian berhasil dilaksanakan dengan lancar.',
            timeOnTaskSeconds: getRandomInt(25, 60),
          },
        })
      }

      // 4. UAT Overall
      await prisma.uatOverallFeedback.create({
        data: {
          participantId: participant.id,
          phaseId: phase3.id,
          rating1: 5, rating2: 4, rating3: 5, rating4: 5, rating5: 4,
          meanRating: 4.6,
          fb1: 'Layanan publik digital Disnakertrans kini sangat mudah diakses.',
          fb2: 'Tidak ada kendala utama.',
          fb3: 'Sistem sangat memuaskan.',
        },
      })

      createdCount++
      logs.push(`✅ [${code}] ${name} (${gender}, ${age}thn) — Terisi SUS (${susScore.toFixed(1)}), UEQ, & UAT!`)
    }

    return NextResponse.json({
      success: true,
      createdCount,
      logs,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menjalankan simulator bot' }, { status: 500 })
  }
}
