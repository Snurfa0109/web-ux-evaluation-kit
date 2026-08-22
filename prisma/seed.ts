import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with initial settings, phases, tasks, and 15 dummy respondents...')

  // System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'researchTitle' },
    update: { value: 'Pengembangan Sistem Informasi Layanan Dinas Tenaga Kerja dan Transmigrasi Kabupaten Serang Berbasis Web dengan Pendekatan User Centered Design (UCD)' },
    create: { key: 'researchTitle', value: 'Pengembangan Sistem Informasi Layanan Dinas Tenaga Kerja dan Transmigrasi Kabupaten Serang Berbasis Web dengan Pendekatan User Centered Design (UCD)' },
  })

  await prisma.systemSetting.upsert({
    where: { key: 'researcherName' },
    update: { value: 'Siti Nurfadiyah' },
    create: { key: 'researcherName', value: 'Siti Nurfadiyah' },
  })

  // Admin user
  const hashedPassword = await bcrypt.hash('Akuadminnyaguys', 12)
  await prisma.adminUser.upsert({
    where: { email: 'sitinurfadiyah74@gmail.com' },
    update: { password: hashedPassword, name: 'Siti Nurfadiyah' },
    create: {
      email: 'sitinurfadiyah74@gmail.com',
      password: hashedPassword,
      name: 'Siti Nurfadiyah',
    },
  })
  console.log('✅ Admin user created: sitinurfadiyah74@gmail.com')

  // Phase 1 — SUS
  const phase1 = await prisma.studyPhase.upsert({
    where: { phaseNumber: 1 },
    update: { status: 'ACTIVE' },
    create: {
      phaseNumber: 1,
      phaseName: 'Existing Website — SUS',
      instrument: 'SUS',
      status: 'ACTIVE',
      participantMode: 'SAME_ONLY',
      externalUrl: 'https://disnakertrans.serangkab.go.id/',
      instructions: 'Silakan gunakan website seperti Anda sedang mencari informasi layanan ketenagakerjaan. Selesaikan seluruh tugas yang diberikan sebelum mengisi kuesioner SUS.',
    },
  })

  // Tasks Phase 1
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

  // Phase 2 — UEQ
  const phase2 = await prisma.studyPhase.upsert({
    where: { phaseNumber: 2 },
    update: { status: 'ACTIVE' },
    create: {
      phaseNumber: 2,
      phaseName: 'Prototype Redesign — UEQ',
      instrument: 'UEQ',
      status: 'ACTIVE',
      participantMode: 'SAME_ONLY',
      externalUrl: 'https://disnakertrans.serangkab.go.id/',
      instructions: 'Silakan gunakan prototype redesign website Disnakertrans. Selesaikan seluruh tugas yang diberikan sebelum mengisi kuesioner UEQ.',
    },
  })

  // Tasks Phase 2
  const phase2Tasks = [
    { taskCode: 'T2-01', title: 'Cari Lowongan Pekerjaan', description: 'Cari lowongan pekerjaan yang sesuai dengan profil Anda.', order: 1 },
    { taskCode: 'T2-02', title: 'Temukan Informasi Program Pelatihan', description: 'Temukan informasi program pelatihan yang tersedia.', order: 2 },
    { taskCode: 'T2-03', title: 'Temukan Informasi Layanan AK.1', description: 'Temukan informasi mengenai layanan AK.1 (Kartu Kuning).', order: 3 },
  ]

  for (const task of phase2Tasks) {
    await prisma.phaseTask.upsert({
      where: { id: phase1Tasks.length + task.order },
      update: {},
      create: { phaseId: phase2.id, ...task },
    })
  }

  // Phase 3 — UAT
  const phase3 = await prisma.studyPhase.upsert({
    where: { phaseNumber: 3 },
    update: { status: 'ACTIVE' },
    create: {
      phaseNumber: 3,
      phaseName: 'Final Website — UAT',
      instrument: 'UAT',
      status: 'ACTIVE',
      participantMode: 'SAME_ONLY',
      externalUrl: 'https://disnakertrans.serangkab.go.id/',
      instructions: 'Silakan lakukan setiap tugas berikut pada website final Disnakertrans Kabupaten Serang yang telah diimplementasikan.',
    },
  })

  // UAT Test Cases
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

  const createdUatTasks: any[] = []
  for (const task of phase3Tasks) {
    const t = await prisma.phaseTask.upsert({
      where: { id: phase1Tasks.length + phase2Tasks.length + task.order },
      update: {},
      create: { phaseId: phase3.id, ...task },
    })
    createdUatTasks.push(t)
  }

  // Generate 15 Dummy Respondents
  const DUMMY_PARTICIPANTS = [
    { code: 'P001', name: 'Ahmad Fauzi', age: 24, gender: 'Laki-laki', occupation: 'Pencari Kerja', wa: '081234567890' },
    { code: 'P002', name: 'Budi Santoso', age: 28, gender: 'Laki-laki', occupation: 'Pegawai Swasta', wa: '081234567891' },
    { code: 'P003', name: 'Citra Dewi', age: 22, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '081234567892' },
    { code: 'P004', name: 'Dian Permata', age: 26, gender: 'Perempuan', occupation: 'Pencari Kerja', wa: '081234567893' },
    { code: 'P005', name: 'Eko Prasetyo', age: 31, gender: 'Laki-laki', occupation: 'ASN / PNS', wa: '081234567894' },
    { code: 'P006', name: 'Fikri Haikal', age: 23, gender: 'Laki-laki', occupation: 'Mahasiswa', wa: '081234567895' },
    { code: 'P007', name: 'Gita Gutawa', age: 25, gender: 'Perempuan', occupation: 'Wirausaha', wa: '081234567896' },
    { code: 'P008', name: 'Hadi Kurniawan', age: 29, gender: 'Laki-laki', occupation: 'Pegawai Swasta', wa: '081234567897' },
    { code: 'P009', name: 'Indah Sari', age: 21, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '081234567898' },
    { code: 'P010', name: 'Joko Widodo', age: 35, gender: 'Laki-laki', occupation: 'Wirausaha', wa: '081234567899' },
    { code: 'P011', name: 'Kania Putri', age: 24, gender: 'Perempuan', occupation: 'Pencari Kerja', wa: '081234567800' },
    { code: 'P012', name: 'Lukman Hakim', age: 27, gender: 'Laki-laki', occupation: 'Pegawai Swasta', wa: '081234567801' },
    { code: 'P013', name: 'Maya Anggraini', age: 23, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '081234567802' },
    { code: 'P014', name: 'Naufal Rizky', age: 22, gender: 'Laki-laki', occupation: 'Pencari Kerja', wa: '081234567803' },
    { code: 'P015', name: 'Olivia Zalianty', age: 30, gender: 'Perempuan', occupation: 'Wirausaha', wa: '081234567804' },
  ]

  for (let i = 0; i < DUMMY_PARTICIPANTS.length; i++) {
    const pData = DUMMY_PARTICIPANTS[i]

    const participant = await prisma.participant.upsert({
      where: { participantCode: pData.code },
      update: {},
      create: {
        participantCode: pData.code,
        name: pData.name,
        age: pData.age,
        gender: pData.gender,
        occupation: pData.occupation,
        governmentWebsiteExperience: i % 2 === 0,
        disnakertransExperience: i % 3 === 0,
        whatsappNumber: pData.wa,
      },
    })

    // 1. SUS Response
    const q1 = (i % 2 === 0) ? 4 : 5
    const q2 = (i % 2 === 0) ? 2 : 1
    const q3 = (i % 2 === 0) ? 4 : 5
    const q4 = (i % 2 === 0) ? 2 : 1
    const q5 = (i % 2 === 0) ? 5 : 4
    const q6 = (i % 2 === 0) ? 1 : 2
    const q7 = (i % 2 === 0) ? 4 : 5
    const q8 = (i % 2 === 0) ? 2 : 1
    const q9 = (i % 2 === 0) ? 5 : 4
    const q10 = (i % 2 === 0) ? 2 : 1
    const susScore = ((q1 - 1) + (5 - q2) + (q3 - 1) + (5 - q4) + (q5 - 1) + (5 - q6) + (q7 - 1) + (5 - q8) + (q9 - 1) + (5 - q10)) * 2.5

    await prisma.susResponse.upsert({
      where: { participantId_phaseId: { participantId: participant.id, phaseId: phase1.id } },
      update: {},
      create: {
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
        fb6Phone: pData.wa,
      },
    })

    // 2. UEQ Response
    await prisma.ueqResponse.upsert({
      where: { participantId_phaseId: { participantId: participant.id, phaseId: phase2.id } },
      update: {},
      create: {
        participantId: participant.id,
        phaseId: phase2.id,
        item1: 6, item2: 6, item3: 6, item4: 7, item5: 6, item6: 7, item7: 6, item8: 6, item9: 7, item10: 6,
        item11: 6, item12: 7, item13: 6, item14: 6, item15: 7, item16: 6, item17: 6, item18: 7, item19: 6, item20: 6,
        item21: 7, item22: 6, item23: 6, item24: 7, item25: 6, item26: 6,
        attractiveness: 1.85,
        perspicuity: 1.90,
        efficiency: 1.75,
        dependability: 1.80,
        stimulation: 1.70,
        novelty: 1.65,
        fb1: 'Tampilan card lowongan dan tombol aksi terlihat sangat modern.',
        fb2: 'Kontras warna beberapa teks kecil.',
        fb3: 'Pertahankan tata letak yang sudah bersih.',
        fb4: 'Ya',
        fb4Phone: pData.wa,
      },
    })

    // 3. UAT Task Responses
    for (const t of createdUatTasks) {
      await prisma.uatTaskResponse.upsert({
        where: { participantId_phaseId_taskId: { participantId: participant.id, phaseId: phase3.id, taskId: t.id } },
        update: {},
        create: {
          participantId: participant.id,
          phaseId: phase3.id,
          taskId: t.id,
          status: i === 4 && t.order === 2 ? 'FAIL' : 'PASS',
          notes: i === 4 && t.order === 2 ? 'Detail informasi perusahaan tidak muncul.' : 'Tugas berhasil dilaksanakan dengan cepat.',
          timeOnTaskSeconds: 25 + (i * 3) + (t.order * 10),
        },
      })
    }

    // 4. UAT Overall Feedback
    await prisma.uatOverallFeedback.upsert({
      where: { participantId_phaseId: { participantId: participant.id, phaseId: phase3.id } },
      update: {},
      create: {
        participantId: participant.id,
        phaseId: phase3.id,
        rating1: 5, rating2: 4, rating3: 5, rating4: 5, rating5: 4,
        meanRating: 4.6,
        fb1: 'Layanan publik digital Disnakertrans kini sangat mudah diakses.',
        fb2: 'Tidak menemukan kendala berarti selama pengujian UAT.',
        fb3: 'Sangat bagus dan layak segera di-online-kan.',
      },
    })
  }

  console.log('✅ 15 Dummy respondents with full SUS, UEQ, and UAT data created successfully!')
  console.log('\n🎉 Seeding complete! You can now log in to the admin panel to view full live analytics.')
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
