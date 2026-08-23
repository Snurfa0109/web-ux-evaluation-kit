import { NextResponse } from 'next/server'
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

async function ensureDefaultPhases() {
  let phase1 = await prisma.studyPhase.findFirst({ where: { instrument: 'SUS' }, include: { tasks: true } })
  if (!phase1) {
    phase1 = await prisma.studyPhase.create({
      data: {
        phaseNumber: 1,
        phaseName: 'Existing Website — SUS',
        instrument: 'SUS',
        status: 'ACTIVE',
        externalUrl: 'https://disnakertrans.serangkab.go.id/',
        tasks: {
          create: [
            { taskCode: 'T1-01', title: 'Pencarian Lowongan', description: 'Temukan informasi lowongan kerja pada website.', order: 1 },
            { taskCode: 'T1-02', title: 'Pencarian Pelatihan', description: 'Temukan informasi program pelatihan kerja.', order: 2 },
          ],
        },
      },
      include: { tasks: true },
    })
  }

  let phase2 = await prisma.studyPhase.findFirst({ where: { instrument: 'UEQ' }, include: { tasks: true } })
  if (!phase2) {
    phase2 = await prisma.studyPhase.create({
      data: {
        phaseNumber: 2,
        phaseName: 'Prototype Redesign — UEQ',
        instrument: 'UEQ',
        status: 'ACTIVE',
        externalUrl: 'https://disnakertrans.serangkab.go.id/',
        tasks: {
          create: [
            { taskCode: 'T2-01', title: 'Uji Prototype Visual', description: 'Coba navigasi prototype desain baru.', order: 1 },
          ],
        },
      },
      include: { tasks: true },
    })
  }

  let phase3 = await prisma.studyPhase.findFirst({ where: { instrument: 'UAT' }, include: { tasks: true } })
  if (!phase3) {
    phase3 = await prisma.studyPhase.create({
      data: {
        phaseNumber: 3,
        phaseName: 'Final Website — UAT',
        instrument: 'UAT',
        status: 'ACTIVE',
        externalUrl: 'https://disnakertrans.serangkab.go.id/',
        tasks: {
          create: [
            { taskCode: 'TC-001', title: 'Pengujian Skenario Utama', description: 'Buka layanan publik dan lakukan pengujian.', order: 1 },
          ],
        },
      },
      include: { tasks: true },
    })
  }

  return { phase1, phase2, phase3 }
}

// POST /api/admin/bot-generator
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const count = parseInt(body.count || '5', 10)
    const tendency = body.tendency || 'HIGH'
    const targetInstruments: string[] = body.instruments || ['SUS', 'UEQ', 'UAT']
    const customFeedback: string = (body.customFeedback || '').trim()
    const timeMode: string = body.timeMode || 'REALISTIC'
    const customSeconds = parseInt(body.customSeconds || '90', 10)

    // Ensure default study phases exist in DB
    const { phase1, phase2, phase3 } = await ensureDefaultPhases()

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

      const filledInstruments: string[] = []

      // Calculate completion duration in seconds
      let durationSeconds = 60
      if (timeMode === 'FAST') durationSeconds = getRandomInt(20, 45)
      else if (timeMode === 'SLOW') durationSeconds = getRandomInt(120, 240)
      else if (timeMode === 'CUSTOM') durationSeconds = customSeconds
      else durationSeconds = getRandomInt(45, 135)

      // 1. SUS Response
      if (targetInstruments.includes('SUS') && phase1) {
        const isHigh = tendency === 'HIGH' || (tendency === 'MIXED' && i % 2 === 0) || tendency === 'EXCELLENT'
        const isAvg = tendency === 'AVERAGE'

        const q1 = isHigh ? getRandomInt(4, 5) : isAvg ? 3 : getRandomInt(2, 3)
        const q2 = isHigh ? getRandomInt(1, 2) : isAvg ? 3 : getRandomInt(3, 4)
        const q3 = isHigh ? getRandomInt(4, 5) : isAvg ? 3 : getRandomInt(2, 3)
        const q4 = isHigh ? getRandomInt(1, 2) : isAvg ? 3 : getRandomInt(3, 4)
        const q5 = isHigh ? getRandomInt(4, 5) : isAvg ? 3 : getRandomInt(2, 3)
        const q6 = isHigh ? getRandomInt(1, 2) : isAvg ? 3 : getRandomInt(3, 4)
        const q7 = isHigh ? getRandomInt(4, 5) : isAvg ? 3 : getRandomInt(2, 3)
        const q8 = isHigh ? getRandomInt(1, 2) : isAvg ? 3 : getRandomInt(3, 4)
        const q9 = isHigh ? getRandomInt(4, 5) : isAvg ? 3 : getRandomInt(2, 3)
        const q10 = isHigh ? getRandomInt(1, 2) : isAvg ? 3 : getRandomInt(3, 4)
        const susScore = ((q1 - 1) + (5 - q2) + (q3 - 1) + (5 - q4) + (q5 - 1) + (5 - q6) + (q7 - 1) + (5 - q8) + (q9 - 1) + (5 - q10)) * 2.5

        const USER_SUS_FEEDBACKS = [
          "Menu di web lama terlalu banyak dan beranak-pinak, bikin pusing pas nyari info Kartu Kuning (AK-1).",
          "Banyak link sub-menu yang pas diklik malah muncul tulisan 404 Not Found atau halaman kosong.",
          "Tampilan di HP kurang rapi, gambar bannernya terpotong dan tulisannya kecil banget jadi harus di-zoom manual.",
          "Informasi syarat buat AK-1 tersembunyi di artikel berita lama tahun lalu, mending dibikin halaman khusus yang isinya poin-poin syarat.",
          "Gak ada form pengaduan online yang jelas, cuma nampilin email biasa di footer yang gak tahu dibaca atau enggak.",
          "Banner-banner di sebelah kanan-kiri bikin layar HP semak, penuh, dan kelihatan jadul.",
          "Tabel info UMK cuma gambar foto scan PDF, pas di-zoom dari HP gambarnya pecah dan burem.",
          "Harusnya di beranda depan ada tombol shortcut ke layanan utama kayak AK-1, Loker, dan Pengaduan biar gak ribet.",
          "Tidak ada fitur pencarian (search bar), jadi susah kalau mau cari berita atau pengumuman pelatihan bulan lalu.",
          "Susah nyari info jadwal pelatihan BLK, pengumumannya tidak ada tanggal pendaftaran yang pasti.",
          "Kalau bisa ada tombol bantuan cepat atau FAQ di pojok layar buat nanya-nanya syarat dasar tanpa harus datang ke kantor.",
          "Info lowongan kerja bentuknya cuma tulisan blog biasa, tidak ada kategori lowongan atau filter pencarian.",
          "Navigasi menu atas hilang pas di-scroll ke bawah, jadi harus scroll jauh lagi ke atas cuma buat pindah halaman.",
          "Warna tulisan di beberapa bagian kurang kontras sama background-nya, bikin mata gampang lelah.",
          "Tombol-tombol menu kalau dibuka di HP terlalu kecil, sering salah pencet menu lain."
        ]

        const currentFeedback = customFeedback || USER_SUS_FEEDBACKS[i % USER_SUS_FEEDBACKS.length]

        await prisma.susResponse.create({
          data: {
            participantId: participant.id,
            phaseId: phase1.id,
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
            susScore,
            fb1: 'Fitur info pencarian lowongan kerja dan pelatihan.',
            fb2: 'Navigasi menu utama yang terlalu kompleks dan tautan mati.',
            fb3: 'Persyaratan Kartu Kuning (AK-1) dan jadwal pelatihan BLK.',
            fb4: 'Tampilkan filter lokasi, pencarian (search bar), dan desain mobile-friendly.',
            fb5: currentFeedback,
            fb6: 'Ya',
            fb6Phone: wa,
          },
        })
        filledInstruments.push(`SUS (${susScore.toFixed(1)})`)
      }

      // 2. UEQ Response
      if (targetInstruments.includes('UEQ') && phase2) {
        const baseRating = tendency === 'EXCELLENT' ? 7 : tendency === 'HIGH' ? 6 : tendency === 'AVERAGE' ? 4 : 5
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
            fb1: customFeedback || 'Tampilan visual prototype terkesan elegan dan modern.',
            fb2: 'Beberapa kontras warna.',
            fb3: 'Tingkatkan kerapihan animasi.',
            fb4: 'Ya',
            fb4Phone: wa,
          },
        })
        filledInstruments.push('UEQ')
      }

      // 3. UAT Response with Humanized Time-on-Task
      if (targetInstruments.includes('UAT') && phase3) {
        for (const t of phase3.tasks) {
          const taskTime = durationSeconds + getRandomInt(-10, 15)
          await prisma.uatTaskResponse.create({
            data: {
              participantId: participant.id,
              phaseId: phase3.id,
              taskId: t.id,
              status: 'PASS',
              notes: 'Tugas pengujian berhasil dilaksanakan dengan lancar.',
              timeOnTaskSeconds: Math.max(15, taskTime),
            },
          })
        }

        const ratingVal = tendency === 'EXCELLENT' ? 5 : tendency === 'HIGH' ? 5 : 4
        await prisma.uatOverallFeedback.create({
          data: {
            participantId: participant.id,
            phaseId: phase3.id,
            rating1: ratingVal, rating2: ratingVal, rating3: ratingVal, rating4: ratingVal, rating5: ratingVal,
            meanRating: ratingVal * 1.0,
            fb1: customFeedback || 'Layanan publik digital Disnakertrans kini sangat mudah diakses.',
            fb2: 'Tidak ada kendala utama.',
            fb3: customFeedback || 'Sistem sangat memuaskan.',
          },
        })
        filledInstruments.push(`UAT (${durationSeconds}s/task)`)
      }

      createdCount++
      logs.push(`✅ [${code}] ${name} (${gender}, ${age}thn) — Terisi: ${filledInstruments.join(', ')} [Durasi: ~${durationSeconds}s]`)
    }

    return NextResponse.json({
      success: true,
      createdCount,
      logs,
    })
  } catch (err: any) {
    console.error('Bot Generator Error:', err)
    return NextResponse.json({ error: err.message || 'Koneksi database MySQL lokal belum siap. Mohon pastikan MySQL/XAMPP aktif.' }, { status: 500 })
  }
}
