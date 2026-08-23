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

  // Tasks Phase 1 — Existing Website (SUS)
  const phase1Tasks = [
    {
      taskCode: 'T1-01',
      title: 'Mencari Lowongan Kerja Terbaru',
      description: 'Bayangkan Anda sedang mencari pekerjaan di wilayah Serang. Jelajahi beranda website untuk menemukan informasi lowongan kerja yang tersedia.',
      order: 1,
    },
    {
      taskCode: 'T1-02',
      title: 'Mencari Info & Jadwal Pelatihan Kerja (BLK)',
      description: 'Bayangkan Anda ingin mengikuti pelatihan keterampilan gratis di Disnakertrans. Cari informasi mengenai program pelatihan atau jadwal pendaftarannya pada website.',
      order: 2,
    },
    {
      taskCode: 'T1-03',
      title: 'Mencari Syarat Pembuatan Kartu Kuning (AK-1)',
      description: 'Bayangkan Anda ingin membuat Kartu Kuning (AK-1) sebagai syarat melamar kerja. Cari informasi dokumen persyaratan atau langkah pengajuannya.',
      order: 3,
    },
    {
      taskCode: 'T1-04',
      title: 'Mencari Alamat Kantor & Nomor Kontak Resmi',
      description: 'Bayangkan Anda perlu datang langsung atau menghubungi pihak kantor Disnakertrans. Cari informasi nomor telepon, email, atau alamat kantor resminya.',
      order: 4,
    },
  ]

  for (const task of phase1Tasks) {
    await prisma.phaseTask.upsert({
      where: { id: task.order },
      update: { title: task.title, description: task.description },
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

  // Tasks Phase 2 — Prototype Redesign (UEQ)
  const phase2Tasks = [
    {
      taskCode: 'T2-01',
      title: 'Eksplorasi Beranda & Fitur Utama Redesign',
      description: 'Jelajahi tampilan baru beranda prototype. Perhatikan kemudahan membaca informasi, tombol menu shortcut, dan tata letaknya.',
      order: 1,
    },
    {
      taskCode: 'T2-02',
      title: 'Uji Fitur Pencarian Lowongan & Filter',
      description: 'Cobalah fitur pencarian lowongan kerja baru. Rasakan bagaimana kemudahan memfilter lowongan berdasarkan lokasi atau bidang pekerjaan.',
      order: 2,
    },
    {
      taskCode: 'T2-03',
      title: 'Cek Panduan Kartu Kuning (AK-1) & Pelatihan',
      description: 'Buka menu layanan Kartu Kuning (AK-1) atau Program Pelatihan pada rancangan desain baru, lalu amati kejelasan poin-poin persyaratannya.',
      order: 3,
    },
  ]

  for (const task of phase2Tasks) {
    await prisma.phaseTask.upsert({
      where: { id: phase1Tasks.length + task.order },
      update: { title: task.title, description: task.description },
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
      title: 'Simulasi Pencarian Loker Berdasarkan Lokasi',
      description: 'Gunakan fitur pencarian atau filter untuk menemukan lowongan pekerjaan yang sesuai dengan lokasi Anda.',
      expectedResult: 'Sistem menampilkan hasil pencarian lowongan yang relevan secara cepat.',
      acceptanceCriteria: 'User dapat memfilter dan melihat daftar lowongan pekerjaan.',
      order: 1,
    },
    {
      taskCode: 'TC-002',
      feature: 'Detail Lowongan & Cara Melamar',
      title: 'Periksa Informasi Detail & Syarat Lowongan',
      description: 'Buka salah satu lowongan pekerjaan dan pastikan kualifikasi serta alur pendaftaran terbaca dengan jelas.',
      expectedResult: 'Sistem menampilkan deskripsi lengkap lowongan beserta instruksi melamar.',
      acceptanceCriteria: 'Informasi lowongan dapat dibaca dengan jelas tanpa membingungkan.',
      order: 2,
    },
    {
      taskCode: 'TC-003',
      feature: 'Layanan Kartu Kuning (AK-1)',
      title: 'Simulasi Pendaftaran Layanan Kartu Kuning (AK-1)',
      description: 'Jelajahi alur pendaftaran Kartu Kuning (AK-1) online dan periksa kemudahan pengisian data persyaratannya.',
      expectedResult: 'User memahami syarat dan alur pengajuan Kartu Kuning secara digital.',
      acceptanceCriteria: 'Syarat Kartu Kuning disajikan dalam poin-poin yang mudah dipahami.',
      order: 3,
    },
    {
      taskCode: 'TC-004',
      feature: 'Layanan Pengaduan & Pelatihan Kerja',
      title: 'Akses Layanan Pengaduan Online & Pendaftaran Pelatihan',
      description: 'Cobalah mengakses halaman Pengaduan Masyarakat atau Pendaftaran Pelatihan Kerja BLK.',
      expectedResult: 'Sistem menyediakan formulir pengaduan yang jelas dan jadwal pelatihan yang pasti.',
      acceptanceCriteria: 'User dapat menemukan info pelatihan dan form pengaduan tanpa kendala.',
      order: 4,
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

    // 1. SUS Response (Phase 1 - Existing Website)
    const SUS_PROFILES = [
      { q1: 2, q2: 4, q3: 2, q4: 4, q5: 2, q6: 5, q7: 2, q8: 4, q9: 2, q10: 4, feedback: "Menu di web lama terlalu banyak dan beranak-pinak, bikin pusing pas nyari info Kartu Kuning (AK-1)." },
      { q1: 1, q2: 5, q3: 2, q4: 5, q5: 1, q6: 4, q7: 2, q8: 5, q9: 1, q10: 4, feedback: "Banyak link sub-menu yang pas diklik malah muncul tulisan 404 Not Found atau halaman kosong." },
      { q1: 3, q2: 4, q3: 2, q4: 4, q5: 3, q6: 4, q7: 2, q8: 4, q9: 2, q10: 3, feedback: "Tampilan di HP kurang rapi, gambar bannernya terpotong dan tulisannya kecil banget jadi harus di-zoom manual." },
      { q1: 2, q2: 5, q3: 1, q4: 4, q5: 2, q6: 5, q7: 1, q8: 4, q9: 2, q10: 5, feedback: "Informasi syarat buat AK-1 tersembunyi di artikel berita lama tahun lalu, mending dibikin halaman khusus yang isinya poin-poin syarat." },
      { q1: 3, q2: 3, q3: 3, q4: 4, q5: 2, q6: 4, q7: 3, q8: 4, q9: 2, q10: 4, feedback: "Gak ada form pengaduan online yang jelas, cuma nampilin email biasa di footer yang gak tahu dibaca atau enggak." },
      { q1: 1, q2: 4, q3: 2, q4: 5, q5: 1, q6: 4, q7: 2, q8: 5, q9: 1, q10: 4, feedback: "Banner-banner di sebelah kanan-kiri bikin layar HP semak, penuh, dan kelihatan jadul." },
      { q1: 2, q2: 4, q3: 3, q4: 3, q5: 2, q6: 4, q7: 2, q8: 4, q9: 3, q10: 3, feedback: "Tabel info UMK cuma gambar foto scan PDF, pas di-zoom dari HP gambarnya pecah dan burem." },
      { q1: 2, q2: 5, q3: 2, q4: 4, q5: 1, q6: 5, q7: 2, q8: 4, q9: 2, q10: 4, feedback: "Harusnya di beranda depan ada tombol shortcut ke layanan utama kayak AK-1, Loker, dan Pengaduan biar gak ribet." },
      { q1: 1, q2: 4, q3: 1, q4: 4, q5: 2, q6: 4, q7: 1, q8: 5, q9: 2, q10: 4, feedback: "Tidak ada fitur pencarian (search bar), jadi susah kalau mau cari berita atau pengumuman pelatihan bulan lalu." },
      { q1: 3, q2: 4, q3: 2, q4: 3, q5: 3, q6: 4, q7: 3, q8: 3, q9: 2, q10: 4, feedback: "Susah nyari info jadwal pelatihan BLK, pengumumannya tidak ada tanggal pendaftaran yang pasti." },
      { q1: 2, q2: 5, q3: 2, q4: 4, q5: 2, q6: 4, q7: 1, q8: 5, q9: 2, q10: 4, feedback: "Kalau bisa ada tombol bantuan cepat atau FAQ di pojok layar buat nanya-nanya syarat dasar tanpa harus datang ke kantor." },
      { q1: 1, q2: 4, q3: 2, q4: 5, q5: 1, q6: 5, q7: 2, q8: 4, q9: 1, q10: 5, feedback: "Info lowongan kerja bentuknya cuma tulisan blog biasa, tidak ada kategori lowongan atau filter pencarian." },
      { q1: 2, q2: 4, q3: 3, q4: 4, q5: 2, q6: 4, q7: 2, q8: 4, q9: 2, q10: 3, feedback: "Navigasi menu atas hilang pas di-scroll ke bawah, jadi harus scroll jauh lagi ke atas cuma buat pindah halaman." },
      { q1: 3, q2: 3, q3: 2, q4: 4, q5: 3, q6: 4, q7: 2, q8: 4, q9: 3, q10: 4, feedback: "Warna tulisan di beberapa bagian kurang kontras sama background-nya, bikin mata gampang lelah." },
      { q1: 2, q2: 4, q3: 2, q4: 4, q5: 1, q6: 5, q7: 2, q8: 4, q9: 2, q10: 4, feedback: "Tombol-tombol menu kalau dibuka di HP terlalu kecil, sering salah pencet menu lain." }
    ]

    const prof = SUS_PROFILES[i % SUS_PROFILES.length]
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, feedback } = prof
    const susScore = ((q1 - 1) + (5 - q2) + (q3 - 1) + (5 - q4) + (q5 - 1) + (5 - q6) + (q7 - 1) + (5 - q8) + (q9 - 1) + (5 - q10)) * 2.5

    await prisma.susResponse.upsert({
      where: { participantId_phaseId: { participantId: participant.id, phaseId: phase1.id } },
      update: {
        q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
        susScore,
        fb1: 'Mencoba melihat tampilan awal beranda.',
        fb2: 'Navigasi menu utama yang terlalu kompleks dan tautan mati.',
        fb3: 'Persyaratan Kartu Kuning (AK-1) dan jadwal pelatihan BLK.',
        fb4: 'Tambahkan shortcut layanan, pencarian (search bar), dan desain mobile-friendly.',
        fb5: feedback,
      },
      create: {
        participantId: participant.id,
        phaseId: phase1.id,
        q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
        susScore,
        fb1: 'Mencoba melihat tampilan awal beranda.',
        fb2: 'Navigasi menu utama yang terlalu kompleks dan tautan mati.',
        fb3: 'Persyaratan Kartu Kuning (AK-1) dan jadwal pelatihan BLK.',
        fb4: 'Tambahkan shortcut layanan, pencarian (search bar), dan desain mobile-friendly.',
        fb5: feedback,
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
