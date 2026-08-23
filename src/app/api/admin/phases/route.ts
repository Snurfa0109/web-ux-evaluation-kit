import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let phases = await prisma.studyPhase.findMany({
    orderBy: { phaseNumber: 'asc' },
    include: { tasks: { orderBy: { order: 'asc' } } },
  })

  // Auto-seed initial 3 phases if DB is empty
  if (phases.length === 0) {
    await prisma.studyPhase.create({
      data: {
        phaseNumber: 1,
        phaseName: 'Existing Website — SUS',
        instrument: 'SUS',
        status: 'ACTIVE',
        participantMode: 'SAME_ONLY',
        externalUrl: 'https://disnakertrans.serangkab.go.id/',
        instructions: 'Silakan gunakan website seperti Anda sedang mencari informasi layanan ketenagakerjaan. Selesaikan seluruh tugas yang diberikan sebelum mengisi kuesioner SUS.',
        tasks: {
          create: [
            { taskCode: 'T1-01', title: 'Temukan Informasi Lowongan Pekerjaan', description: 'Temukan informasi lowongan pekerjaan yang tersedia pada website.', order: 1 },
            { taskCode: 'T1-02', title: 'Temukan Informasi Pelatihan Kerja', description: 'Temukan informasi mengenai pelatihan kerja yang diselenggarakan.', order: 2 },
            { taskCode: 'T1-03', title: 'Temukan Informasi Layanan AK.1', description: 'Temukan informasi mengenai layanan AK.1 (Kartu Kuning).', order: 3 },
            { taskCode: 'T1-04', title: 'Temukan Informasi Kontak', description: 'Temukan informasi kontak Disnakertrans Kabupaten Serang.', order: 4 },
          ],
        },
      },
    })

    await prisma.studyPhase.create({
      data: {
        phaseNumber: 2,
        phaseName: 'Prototype Redesign — UEQ',
        instrument: 'UEQ',
        status: 'ACTIVE',
        participantMode: 'SAME_ONLY',
        externalUrl: 'https://disnakertrans.serangkab.go.id/',
        instructions: 'Silakan gunakan prototype redesign website Disnakertrans. Selesaikan seluruh tugas yang diberikan sebelum mengisi kuesioner UEQ.',
        tasks: {
          create: [
            { taskCode: 'T2-01', title: 'Cari Lowongan Pekerjaan', description: 'Cari lowongan pekerjaan yang sesuai dengan profil Anda.', order: 1 },
            { taskCode: 'T2-02', title: 'Temukan Informasi Program Pelatihan', description: 'Temukan informasi program pelatihan yang tersedia.', order: 2 },
            { taskCode: 'T2-03', title: 'Temukan Informasi Layanan AK.1', description: 'Temukan informasi mengenai layanan AK.1 (Kartu Kuning).', order: 3 },
          ],
        },
      },
    })

    await prisma.studyPhase.create({
      data: {
        phaseNumber: 3,
        phaseName: 'Final Website — UAT',
        instrument: 'UAT',
        status: 'ACTIVE',
        participantMode: 'SAME_ONLY',
        externalUrl: 'https://disnakertrans.serangkab.go.id/',
        instructions: 'Silakan lakukan setiap tugas berikut pada website final Disnakertrans Kabupaten Serang yang telah diimplementasikan.',
        tasks: {
          create: [
            { taskCode: 'TC-001', feature: 'Pencarian Lowongan', title: 'Cari Lowongan Berdasarkan Lokasi', description: 'Cari lowongan pekerjaan berdasarkan lokasi yang Anda inginkan.', expectedResult: 'Sistem menampilkan lowongan sesuai lokasi yang dipilih.', acceptanceCriteria: 'User dapat menemukan hasil lowongan yang relevan dengan lokasi.', order: 1 },
            { taskCode: 'TC-002', feature: 'Pendaftaran Akun', title: 'Registrasi Pencari Kerja', description: 'Lakukan pendaftaran akun pencari kerja baru dengan data yang valid.', expectedResult: 'Sistem menyimpan data dan menampilkan konfirmasi pendaftaran berhasil.', acceptanceCriteria: 'Akun berhasil terdaftar dan user menerima konfirmasi.', order: 2 },
            { taskCode: 'TC-003', feature: 'Pengajuan Kartu Kuning (AK.1)', title: 'Pengajuan Layanan AK.1', description: 'Isi formulir pengajuan Kartu Kuning (AK.1) secara online.', expectedResult: 'Formulir berhasil terkirim dan status pengajuan masuk ke antrean.', acceptanceCriteria: 'Sistem menghasilkan nomor resi / bukti pengajuan AK.1.', order: 3 },
            { taskCode: 'TC-004', feature: 'Pendaftaran Pelatihan', title: 'Daftar Program Pelatihan Kerja', description: 'Pilih salah satu program pelatihan kerja yang buka pendaftaran lalu selesaikan alur mendaftar.', expectedResult: 'Status pendaftaran pelatihan tercatat pada profil peserta.', acceptanceCriteria: 'User terdaftar pada kelas pelatihan yang dipilih.', order: 4 },
          ],
        },
      },
    })

    phases = await prisma.studyPhase.findMany({
      orderBy: { phaseNumber: 'asc' },
      include: { tasks: { orderBy: { order: 'asc' } } },
    })
  }

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

