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

      phases = await prisma.studyPhase.findMany({
        orderBy: { phaseNumber: 'asc' },
        include: { tasks: { orderBy: { order: 'asc' } } },
      })
    }

    return NextResponse.json(phases)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
