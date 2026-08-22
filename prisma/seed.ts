import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@disnakertrans-research.id' },
    update: {},
    create: {
      email: 'admin@disnakertrans-research.id',
      password: hashedPassword,
      name: 'Administrator',
    },
  })
  console.log('✅ Admin user created')

  // Phase 1 — SUS
  const phase1 = await prisma.studyPhase.upsert({
    where: { phaseNumber: 1 },
    update: {},
    create: {
      phaseNumber: 1,
      phaseName: 'Existing Website — SUS',
      instrument: 'SUS',
      status: 'DRAFT',
      participantMode: 'SAME_ONLY',
      externalUrl: 'https://disnakertrans.serangkab.go.id/',
      instructions: 'Silakan gunakan website seperti Anda sedang mencari informasi layanan ketenagakerjaan. Selesaikan seluruh tugas yang diberikan sebelum mengisi kuesioner SUS.',
    },
  })

  // Tasks Phase 1 — 4 skenario tugas awal
  const phase1Tasks = [
    { taskCode: 'T1-01', title: 'Temukan Informasi Lowongan Pekerjaan', description: 'Temukan informasi lowongan pekerjaan yang tersedia pada website.', order: 1 },
    { taskCode: 'T1-02', title: 'Temukan Informasi Pelatihan Kerja', description: 'Temukan informasi mengenai pelatihan kerja yang diselenggarakan.', order: 2 },
    { taskCode: 'T1-03', title: 'Temukan Informasi Layanan AK.1', description: 'Temukan informasi mengenai layanan AK.1 (Kartu Kuning).', order: 3 },
    { taskCode: 'T1-04', title: 'Temukan Informasi Kontak', description: 'Temukan informasi kontak Disnakertrans Kabupaten Serang.', order: 4 },
  ]


  for (const task of phase1Tasks) {
    await prisma.phaseTask.upsert({
      where: { id: task.order },
      update: {},
      create: { phaseId: phase1.id, ...task },
    })
  }
  console.log('✅ Phase 1 (SUS) created with tasks')

  // Phase 2 — UEQ
  const phase2 = await prisma.studyPhase.upsert({
    where: { phaseNumber: 2 },
    update: {},
    create: {
      phaseNumber: 2,
      phaseName: 'Prototype Redesign — UEQ',
      instrument: 'UEQ',
      status: 'DRAFT',
      participantMode: 'SAME_ONLY',
      externalUrl: '',
      instructions: 'Silakan gunakan prototype redesign website Disnakertrans. Selesaikan seluruh tugas yang diberikan sebelum mengisi kuesioner UEQ.',
    },
  })

  // Tasks Phase 2
  const phase2Tasks = [
    { taskCode: 'T2-01', title: 'Cari Lowongan Pekerjaan', description: 'Cari lowongan pekerjaan yang sesuai dengan profil Anda.', order: 1 },
    { taskCode: 'T2-02', title: 'Temukan Informasi Program Pelatihan', description: 'Temukan informasi program pelatihan yang tersedia.', order: 2 },
    { taskCode: 'T2-03', title: 'Temukan Informasi Layanan AK.1', description: 'Temukan informasi mengenai layanan AK.1 (Kartu Kuning).', order: 3 },
    { taskCode: 'T2-04', title: 'Temukan Informasi Kontak', description: 'Temukan informasi kontak Disnakertrans Kabupaten Serang.', order: 4 },
    { taskCode: 'T2-05', title: 'Jelajahi Navigasi Utama', description: 'Jelajahi menu navigasi utama website dan pahami strukturnya.', order: 5 },
  ]

  for (const task of phase2Tasks) {
    await prisma.phaseTask.upsert({
      where: { id: phase1Tasks.length + task.order },
      update: {},
      create: { phaseId: phase2.id, ...task },
    })
  }
  console.log('✅ Phase 2 (UEQ) created with tasks')

  // Phase 3 — UAT
  const phase3 = await prisma.studyPhase.upsert({
    where: { phaseNumber: 3 },
    update: {},
    create: {
      phaseNumber: 3,
      phaseName: 'Final Website — UAT',
      instrument: 'UAT',
      status: 'DRAFT',
      participantMode: 'SAME_ONLY',
      externalUrl: '',
      instructions: 'Silakan lakukan setiap tugas berikut pada website final Disnakertrans Kabupaten Serang yang telah diimplementasikan.',
    },
  })

  // UAT Test Cases (default)
  const phase3Tasks = [
    {
      taskCode: 'TC-001',
      feature: 'Pencarian Lowongan',
      title: 'Cari Lowongan Berdasarkan Lokasi',
      description: 'Cari lowongan pekerjaan berdasarkan lokasi yang Anda inginkan.',
      expectedResult: 'Sistem menampilkan lowongan sesuai lokasi yang dipilih.',
      acceptanceCriteria: 'User dapat menemukan hasil lowongan yang relevan dengan lokasi.',
      order: 1,
    },
    {
      taskCode: 'TC-002',
      feature: 'Detail Lowongan',
      title: 'Buka Detail Lowongan',
      description: 'Buka salah satu lowongan pekerjaan dan periksa informasi detailnya.',
      expectedResult: 'Sistem menampilkan informasi posisi, perusahaan, lokasi, deskripsi, kualifikasi, dan cara melamar.',
      acceptanceCriteria: 'Semua informasi penting lowongan tersedia dan terbaca dengan jelas.',
      order: 2,
    },
    {
      taskCode: 'TC-003',
      feature: 'Program Pelatihan',
      title: 'Cari Program Pelatihan',
      description: 'Cari program pelatihan kerja yang tersedia.',
      expectedResult: 'Sistem menampilkan daftar pelatihan yang tersedia.',
      acceptanceCriteria: 'User dapat melihat daftar dan detail program pelatihan.',
      order: 3,
    },
  ]

  for (const task of phase3Tasks) {
    await prisma.phaseTask.upsert({
      where: { id: phase1Tasks.length + phase2Tasks.length + task.order },
      update: {},
      create: { phaseId: phase3.id, ...task },
    })
  }
  console.log('✅ Phase 3 (UAT) created with test cases')

  console.log('\n🎉 Seeding complete!')
  console.log('Admin email: admin@disnakertrans-research.id')
  console.log('Admin password: Admin123!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
