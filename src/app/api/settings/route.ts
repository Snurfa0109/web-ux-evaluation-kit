import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const DEFAULT_SETTINGS: Record<string, string> = {
  researchTitle: 'Pengembangan Sistem Informasi Layanan Dinas Tenaga Kerja dan Transmigrasi Kabupaten Serang Berbasis Web dengan Pendekatan User Centered Design (UCD)',
  researcherName: 'Siti Nurfadiyah',
  welcomeGreeting: 'Halo, Bapak/Ibu/Rekan-rekan sekalian!\n\nPerkenalkan, saya Siti Nurfadiyah. Saat ini saya sedang melakukan penelitian mengenai "Pengembangan Sistem Informasi Layanan Dinas Tenaga Kerja dan Transmigrasi Kabupaten Serang Berbasis Web dengan Pendekatan User Centered Design (UCD)".\n\nMohon kesediaan dan bantuan Bapak/Ibu/Rekan-rekan sekalian untuk berpartisipasi dalam pengujian serta memberikan penilaian jujur pada kuesioner evaluasi ini. Masukan dan bantuan Anda sangat berharga bagi peningkatan kualitas pelayanan publik digital. Terima kasih banyak atas waktu dan bantuannya!',
  appDescription: 'Platform evaluasi pengalaman pengguna (UX) terpadu untuk pengujian kebergunaan dan penerimaan sistem pelayanan publik digital.',
}


// GET /api/settings — public settings
export async function GET() {
  try {
    const dbSettings = await prisma.systemSetting.findMany()
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS }

    dbSettings.forEach(s => {
      settings[s.key] = s.value
    })

    return NextResponse.json(settings)
  } catch (err: any) {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

// POST /api/settings — admin save settings
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const keys = ['researchTitle', 'researcherName', 'welcomeGreeting', 'appDescription']

    for (const key of keys) {
      if (body[key] !== undefined) {
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value: body[key] },
          create: { key, value: body[key] },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan pengaturan' }, { status: 500 })
  }
}
