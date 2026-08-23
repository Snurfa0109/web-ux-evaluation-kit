import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let phases = await prisma.studyPhase.findMany({
      orderBy: { phaseNumber: 'asc' },
      include: { tasks: { orderBy: { order: 'asc' } } },
    })

    // Auto-seed default 3 phases if database is empty
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
              { taskCode: 'T1-01', title: 'Mencari Lowongan Kerja Terbaru', description: 'Bayangkan Anda sedang mencari pekerjaan di wilayah Serang. Jelajahi beranda website untuk menemukan informasi lowongan kerja yang tersedia.', order: 1 },
              { taskCode: 'T1-02', title: 'Mencari Info & Jadwal Pelatihan Kerja (BLK)', description: 'Bayangkan Anda ingin mengikuti pelatihan keterampilan gratis di Disnakertrans. Cari informasi mengenai program pelatihan atau jadwal pendaftarannya pada website.', order: 2 },
              { taskCode: 'T1-03', title: 'Mencari Syarat Pembuatan Kartu Kuning (AK-1)', description: 'Bayangkan Anda ingin membuat Kartu Kuning (AK-1) sebagai syarat melamar kerja. Cari informasi dokumen persyaratan atau langkah pengajuannya.', order: 3 },
              { taskCode: 'T1-04', title: 'Mencari Alamat Kantor & Nomor Kontak Resmi', description: 'Bayangkan Anda perlu datang langsung atau menghubungi pihak kantor Disnakertrans. Cari informasi nomor telepon, email, atau alamat kantor resminya.', order: 4 },
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
              { taskCode: 'T2-01', title: 'Eksplorasi Beranda & Fitur Utama Redesign', description: 'Jelajahi tampilan baru beranda prototype. Perhatikan kemudahan membaca informasi, tombol menu shortcut, dan tata letaknya.', order: 1 },
              { taskCode: 'T2-02', title: 'Uji Fitur Pencarian Lowongan & Filter', description: 'Cobalah fitur pencarian lowongan kerja baru. Rasakan bagaimana kemudahan memfilter lowongan berdasarkan lokasi atau bidang pekerjaan.', order: 2 },
              { taskCode: 'T2-03', title: 'Cek Panduan Kartu Kuning (AK-1) & Pelatihan', description: 'Buka menu layanan Kartu Kuning (AK-1) atau Program Pelatihan pada rancangan desain baru, lalu amati kejelasan poin-poin persyaratannya.', order: 3 },
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
              { taskCode: 'TC-001', feature: 'Pencarian Lowongan', title: 'Simulasi Pencarian Loker Berdasarkan Lokasi', description: 'Gunakan fitur pencarian atau filter untuk menemukan lowongan pekerjaan yang sesuai dengan lokasi Anda.', expectedResult: 'Sistem menampilkan hasil pencarian lowongan yang relevan secara cepat.', acceptanceCriteria: 'User dapat memfilter dan melihat daftar lowongan pekerjaan.', order: 1 },
              { taskCode: 'TC-002', feature: 'Detail Lowongan & Cara Melamar', title: 'Periksa Informasi Detail & Syarat Lowongan', description: 'Buka salah satu lowongan pekerjaan dan pastikan kualifikasi serta alur pendaftaran terbaca dengan jelas.', expectedResult: 'Sistem menampilkan deskripsi lengkap lowongan beserta instruksi melamar.', acceptanceCriteria: 'Informasi lowongan dapat dibaca dengan jelas tanpa membingungkan.', order: 2 },
              { taskCode: 'TC-003', feature: 'Layanan Kartu Kuning (AK-1)', title: 'Simulasi Pendaftaran Layanan Kartu Kuning (AK-1)', description: 'Jelajahi alur pendaftaran Kartu Kuning (AK-1) online dan periksa kemudahan pengisian data persyaratannya.', expectedResult: 'User memahami syarat dan alur pengajuan Kartu Kuning secara digital.', acceptanceCriteria: 'Syarat Kartu Kuning disajikan dalam poin-poin yang mudah dipahami.', order: 3 },
              { taskCode: 'TC-004', feature: 'Layanan Pengaduan & Pelatihan Kerja', title: 'Akses Layanan Pengaduan Online & Pendaftaran Pelatihan', description: 'Cobalah mengakses halaman Pengaduan Masyarakat atau Pendaftaran Pelatihan Kerja BLK.', expectedResult: 'Sistem menyediakan formulir pengaduan yang jelas dan jadwal pelatihan yang pasti.', acceptanceCriteria: 'User dapat menemukan info pelatihan dan form pengaduan tanpa kendala.', order: 4 },
            ],
          },
        },
      })
    }

    // Auto-update existing tasks to friendly scenario-based descriptions if database contains old text
    const friendlyPhase1Tasks = [
      { taskCode: 'T1-01', title: 'Mencari Lowongan Kerja Terbaru', description: 'Bayangkan Anda sedang mencari pekerjaan di wilayah Serang. Jelajahi beranda website untuk menemukan informasi lowongan kerja yang tersedia.' },
      { taskCode: 'T1-02', title: 'Mencari Info & Jadwal Pelatihan Kerja (BLK)', description: 'Bayangkan Anda ingin mengikuti pelatihan keterampilan gratis di Disnakertrans. Cari informasi mengenai program pelatihan atau jadwal pendaftarannya pada website.' },
      { taskCode: 'T1-03', title: 'Mencari Syarat Pembuatan Kartu Kuning (AK-1)', description: 'Bayangkan Anda ingin membuat Kartu Kuning (AK-1) sebagai syarat melamar kerja. Cari informasi dokumen persyaratan atau langkah pengajuannya.' },
      { taskCode: 'T1-04', title: 'Mencari Alamat Kantor & Nomor Kontak Resmi', description: 'Bayangkan Anda perlu datang langsung atau menghubungi pihak kantor Disnakertrans. Cari informasi nomor telepon, email, atau alamat kantor resminya.' },
    ]

    const friendlyPhase2Tasks = [
      { taskCode: 'T2-01', title: 'Mengeksplorasi Tampilan Baru Beranda Redesign', description: 'Bayangkan Anda baru pertama kali membuka rancangan tampilan baru website Disnakertrans. Jelajahi halaman utama untuk melihat kerapihan tata letak, tombol navigasi cepat, dan kejelasan informasinya.' },
      { taskCode: 'T2-02', title: 'Mencari & Memfilter Lowongan Pekerjaan', description: 'Bayangkan Anda ingin mencari lowongan pekerjaan yang pas dengan minat Anda. Cobalah fitur pencarian lowongan kerja baru ini dan rasakan kemudahan memfilter hasilnya.' },
      { taskCode: 'T2-03', title: 'Melihat Syarat Kartu Kuning (AK-1) & Info Pelatihan', description: 'Bayangkan Anda ingin mengetahui syarat membuat Kartu Kuning (AK-1) atau mendaftar pelatihan kerja. Buka menu layanannya dan amati kejelasan poin-poin petunjuknya.' },
    ]

    const friendlyPhase3Tasks = [
      { taskCode: 'TC-001', title: 'Mencari Lowongan Kerja Berdasarkan Lokasi / Kategori', description: 'Bayangkan Anda sedang mencari pekerjaan di area Serang. Gunakan fitur pencarian atau filter lokasi untuk menemukan lowongan yang sesuai.', expectedResult: 'Sistem menampilkan daftar lowongan pekerjaan yang sesuai dengan pencarian Anda.' },
      { taskCode: 'TC-002', title: 'Mendaftar Akun Pencari Kerja Baru', description: 'Bayangkan Anda ingin mendaftarkan diri sebagai pencari kerja. Coba isi formulir registrasi akun baru dengan data yang diminta hingga selesai.', expectedResult: 'Sistem menyimpan akun Anda dan menampilkan konfirmasi pendaftaran berhasil.' },
      { taskCode: 'TC-003', title: 'Pengajuan Kartu Kuning (AK-1) Secara Online', description: 'Bayangkan Anda hendak mengajukan pembuatan Kartu Kuning secara digital dari rumah. Isi formulir pengajuan AK-1 online dan periksa alurnya.', expectedResult: 'Formulir terkirim dan sistem memberikan bukti / nomor resi pengajuan Kartu Kuning.' },
      { taskCode: 'TC-004', title: 'Mendaftar Program Pelatihan Kerja (BLK)', description: 'Bayangkan Anda berminat mengikuti salah satu kelas pelatihan kerja gratis. Pilih program pelatihan yang tersedia lalu ikuti langkah pendaftarannya.', expectedResult: 'Pendaftaran berhasil tercatat dan Anda terdaftar pada kelas pelatihan yang dipilih.' },
    ]

    const allFriendlyTasks = [...friendlyPhase1Tasks, ...friendlyPhase2Tasks, ...friendlyPhase3Tasks]

    for (const t of allFriendlyTasks) {
      await prisma.phaseTask.updateMany({
        where: { taskCode: t.taskCode },
        data: {
          title: t.title,
          description: t.description,
          ...(('expectedResult' in t) ? { expectedResult: (t as any).expectedResult } : {}),
        },
      })
    }

    phases = await prisma.studyPhase.findMany({
      orderBy: { phaseNumber: 'asc' },
      include: { tasks: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(phases)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
