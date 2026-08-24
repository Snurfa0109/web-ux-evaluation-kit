const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateRandomCode() {
  return 'R-' + Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

const RESPONDENTS_DATA = [
  {
    name: 'Rian Ardiansyah', age: 23, gender: 'Laki-laki', occupation: 'Pencari Kerja', wa: '081213790244',
    q1: 2, q2: 4, q3: 2, q4: 5, q5: 2, q6: 4, q7: 2, q8: 5, q9: 2, q10: 4,
    fb1: 'Melihat gambar spanduk di beranda depan.',
    fb2: 'Tampilan websitenya terlalu rame dan pilihan menunya beranak banyak banget.',
    fb3: 'Jadwal pasti pendaftaran pelatihan kerja BLK sama syarat AK-1.',
    fb4: 'Dibuatkan halaman khusus yang ringkas buat informasi pembuatan Kartu Kuning.',
    fb5: 'Menu navigasinya dirapikan lagi biar pas dibuka lewat HP tidak perlu di-zoom.',
    daysAgo: 4, hour: 9, min: 14
  },
  {
    name: 'Siti Maulida', age: 22, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '083825298793',
    q1: 1, q2: 5, q3: 2, q4: 4, q5: 1, q6: 5, q7: 2, q8: 4, q9: 1, q10: 5,
    fb1: 'Melihat artikel berita utama di halaman paling awal.',
    fb2: 'Sub-menu kalau diklik beberapa malah muncul eror halaman tidak ditemukan.',
    fb3: 'Formulir pendaftaran dan nomor kontak admin yang bisa dihubungi.',
    fb4: 'Fitur tombol bantuan cepat atau FAQ di pojok layar.',
    fb5: 'Webnya kelihatan jadul banget kalau dibuka dari layar ponsel pintar.',
    daysAgo: 4, hour: 10, min: 32
  },
  {
    name: 'Dhani Pratama', age: 25, gender: 'Laki-laki', occupation: 'Pencari Kerja', wa: '085214902301',
    q1: 3, q2: 4, q3: 2, q4: 4, q5: 3, q6: 4, q7: 2, q8: 4, q9: 2, q10: 4,
    fb1: 'Informasi profil singkat instansi.',
    fb2: 'Cari lowongan kerja karena bentuknya tulisan blog biasa tanpa kategori.',
    fb3: 'Daftar lowongan kerja yang masih buka di wilayah Kabupaten Serang.',
    fb4: 'Sediakan kolom pencarian (search bar) dan filter lokasi kerja.',
    fb5: 'Mending ada tombol shortcut langsung ke loker dan AK-1 di halaman depan.',
    daysAgo: 4, hour: 13, min: 45
  },
  {
    name: 'Nurul Hidayah', age: 24, gender: 'Perempuan', occupation: 'Pencari Kerja', wa: '081906059902',
    q1: 2, q2: 5, q3: 1, q4: 5, q5: 2, q6: 4, q7: 1, q8: 5, q9: 2, q10: 4,
    fb1: 'Membaca teks pengumuman berita di bagian tengah.',
    fb2: 'Tampilan di HP kurang rapi, gambarnya terpotong dan tulisannya kecil.',
    fb3: 'Syarat berkas fisik buat cetak Kartu Kuning.',
    fb4: 'Fitur daftar Kartu Kuning online yang ada nomor resi pengajuannya.',
    fb5: 'Tulisan di beberapa bagian kurang jelas karena warna backgroundnya terlalu terang.',
    daysAgo: 3, hour: 9, min: 10
  },
  {
    name: 'Dimas Setiawan', age: 27, gender: 'Laki-laki', occupation: 'Pegawai Swasta', wa: '082275305721',
    q1: 3, q2: 3, q3: 3, q4: 4, q5: 2, q6: 4, q7: 3, q8: 4, q9: 2, q10: 4,
    fb1: 'Daftar susunan struktur organisasi.',
    fb2: 'Navigasi menu atas hilang pas di-scroll ke bawah jadi harus scroll jauh.',
    fb3: 'Rincian tabel UMK Kabupaten Serang yang gambarnya burem.',
    fb4: 'Upload dokumen UMK dalam format PDF asli yang bisa didownload.',
    fb5: 'Mohon diperbaiki kerapihan tampilan versi mobilenya.',
    daysAgo: 3, hour: 11, min: 20
  },
  {
    name: 'Aulia Rahma', age: 21, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '089618463584',
    q1: 2, q2: 4, q3: 2, q4: 4, q5: 2, q6: 5, q7: 2, q8: 4, q9: 2, q10: 4,
    fb1: 'Melihat gambar banner promosi di atas.',
    fb2: 'Banyak banner iklan/widget di kanan kiri yang bikin semak layar HP.',
    fb3: 'Info pendaftaran kelas pelatihan komputer atau menjahit di BLK.',
    fb4: 'Tampilkan kalender jadwal kegiatan pelatihan per bulan.',
    fb5: 'Hapus banner-banner tidak penting di samping kiri dan kanan.',
    daysAgo: 3, hour: 14, min: 55
  },
  {
    name: 'Taufik Hidayat', age: 29, gender: 'Laki-laki', occupation: 'Wirausaha', wa: '083876977393',
    q1: 2, q2: 4, q3: 3, q4: 3, q5: 2, q6: 4, q7: 2, q8: 4, q9: 3, q10: 3,
    fb1: 'Fitur membaca berita kegiatan dinas.',
    fb2: 'Tidak ada fitur pencarian berita jadi susah nyari artikel lama.',
    fb3: 'Informasi alamat kantor dan email resmi pengaduan.',
    fb4: 'Tambahkan kolom search bar di bagian atas header.',
    fb5: 'Bikin form pengaduan online khusus daripada cuma pajang email biasa.',
    daysAgo: 3, hour: 16, min: 18
  },
  {
    name: 'Mega Utami', age: 23, gender: 'Perempuan', occupation: 'Pencari Kerja', wa: '081770211407',
    q1: 1, q2: 5, q3: 2, q4: 5, q5: 1, q6: 4, q7: 2, q8: 5, q9: 1, q10: 4,
    fb1: 'Halaman awal beranda.',
    fb2: 'Tombol menu di HP terlalu kecil jadi sering salah pencet menu lain.',
    fb3: 'Alur perpanjangan Kartu Kuning yang sudah kadaluarsa.',
    fb4: 'Tombol navigasi yang lebih besar dan enak ditekan pakai jempol HP.',
    fb5: 'Tolong disederhanakan struktur menunya biar gak terlalu membingungkan.',
    daysAgo: 2, hour: 8, min: 40
  },
  {
    name: 'Rangga Wijaya', age: 26, gender: 'Laki-laki', occupation: 'Pencari Kerja', wa: '089630292735',
    q1: 2, q2: 4, q3: 2, q4: 4, q5: 2, q6: 4, q7: 2, q8: 4, q9: 2, q10: 4,
    fb1: 'Melihat info umum Disnakertrans.',
    fb2: 'Syarat AK-1 malah nyempil di dalam artikel berita tahun kemarin.',
    fb3: 'Panduan pembuatan Kartu Kuning bagi lulusan baru.',
    fb4: 'Dibuat menu khusus Layanan Publik yang terpisah dari berita.',
    fb5: 'Informasi penting jangan dicampur aduk sama postingan berita harian.',
    daysAgo: 2, hour: 10, min: 12
  },
  {
    name: 'Sinta Bellia', age: 22, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '081932358392',
    q1: 3, q2: 4, q3: 2, q4: 3, q5: 3, q6: 4, q7: 3, q8: 3, q9: 2, q10: 4,
    fb1: 'Melihat galeri foto kegiatan dinas.',
    fb2: 'Link sub-menu beranak-anak dan tulisan di HP terlalu kecil.',
    fb3: 'Jadwal pendaftaran pameran bursa kerja (Job Fair).',
    fb4: 'Fitur pengumuman Job Fair dengan pendaftaran online.',
    fb5: 'Tampilan visual dibuat lebih modern dan ikuti perkembangan jaman.',
    daysAgo: 2, hour: 13, min: 5
  },
  {
    name: 'Fajar Subagja', age: 28, gender: 'Laki-laki', occupation: 'Pegawai Swasta', wa: '087782818243',
    q1: 2, q2: 5, q3: 2, q4: 4, q5: 2, q6: 4, q7: 1, q8: 5, q9: 2, q10: 4,
    fb1: 'Membaca teks pengumuman dinas.',
    fb2: 'Tabel gambar PDF scan pas di-zoom langsung pecah dan tidak terbaca.',
    fb3: 'Tabel gaji UMK dan hak tenaga kerja.',
    fb4: 'Tampilkan tabel data langsung dalam bentuk teks HTML bukan foto.',
    fb5: 'Perhatikan kualitas gambar tabel agar tidak buram di HP.',
    daysAgo: 2, hour: 15, min: 42
  },
  {
    name: 'Indah Permata', age: 24, gender: 'Perempuan', occupation: 'Pencari Kerja', wa: '08999833001',
    q1: 1, q2: 4, q3: 2, q4: 5, q5: 1, q6: 5, q7: 2, q8: 4, q9: 1, q10: 5,
    fb1: 'Tampilan beranda awal.',
    fb2: 'Tidak ada form pengaduan online yang jelas cuma email footer.',
    fb3: 'Nomor WhatsApp atau call center layanan masyarakat.',
    fb4: 'Sediakan layanan konsultasi atau chat langsung dengan petugas.',
    fb5: 'Email pengaduan di footer terkesan tidak aktif dibaca.',
    daysAgo: 1, hour: 9, min: 25
  },
  {
    name: 'Bagas Kara', age: 25, gender: 'Laki-laki', occupation: 'Pencari Kerja', wa: '081319611269',
    q1: 2, q2: 4, q3: 3, q4: 4, q5: 2, q6: 4, q7: 2, q8: 4, q9: 2, q10: 3,
    fb1: 'Halaman depan berita.',
    fb2: 'Informasi lowongan kerja berbentuk tulisan blog tanpa filter.',
    fb3: 'Lowongan kerja khusus wilayah Cikande dan Serang Timur.',
    fb4: 'Fitur pencarian lowongan kerja berdasarkan posisi dan lokasi.',
    fb5: 'Pengelompokan lowongan kerja harus ada kategori jelas.',
    daysAgo: 1, hour: 11, min: 14
  },
  {
    name: 'Dewi Anggraini', age: 23, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '087878923813',
    q1: 3, q2: 3, q3: 2, q4: 4, q5: 3, q6: 4, q7: 2, q8: 4, q9: 3, q10: 4,
    fb1: 'Fitur navigasi utama atas.',
    fb2: 'Navigasi hilang saat di-scroll ke bawah.',
    fb3: 'Syarat daftar akun pencari kerja.',
    fb4: 'Jadikan menu navigasi atas melayang (sticky header).',
    fb5: 'Sangat repot harus scroll ke atas lagi cuma buat pindah menu.',
    daysAgo: 1, hour: 14, min: 2
  },
  {
    name: 'Eko Kurniawan', age: 30, gender: 'Laki-laki', occupation: 'Wirausaha', wa: '085813672717',
    q1: 2, q2: 4, q3: 2, q4: 4, q5: 1, q6: 5, q7: 2, q8: 4, q9: 2, q10: 4,
    fb1: 'Struktur menu utama.',
    fb2: 'Tampilan kurang kontras warna tulisan sama background.',
    fb3: 'Info pendaftaran magang ke luar negeri atau perusahaan.',
    fb4: 'Ubah warna font agar lebih gelap dan tegas terbaca.',
    fb5: 'Bikin mata cepat lelah kalau baca artikel yang kontrasnya rendah.',
    daysAgo: 1, hour: 16, min: 50
  },
  {
    name: 'Fitri Handayani', age: 22, gender: 'Perempuan', occupation: 'Pencari Kerja', wa: '081286880752',
    q1: 1, q2: 5, q3: 1, q4: 4, q5: 2, q6: 4, q7: 1, q8: 5, q9: 2, q10: 4,
    fb1: 'Judul besar website.',
    fb2: 'Tombol di HP terlalu kecil dan sulit diklik.',
    fb3: 'Persyaratan Kartu Kuning untuk lulusan SMK.',
    fb4: 'Desain tombol yang responsif di layar sentuh HP.',
    fb5: 'Sering keliru pencet menu lain karena letaknya terlalu berdekatan.',
    daysAgo: 0, hour: 8, min: 15
  },
  {
    name: 'Hendra Kusuma', age: 27, gender: 'Laki-laki', occupation: 'Pegawai Swasta', wa: '089512894760',
    q1: 2, q2: 4, q3: 2, q4: 4, q5: 2, q6: 4, q7: 2, q8: 4, q9: 2, q10: 4,
    fb1: 'Profil singkat Disnakertrans.',
    fb2: 'Banyak link halaman kosong dan 404.',
    fb3: 'Alamat email resmi untuk kirim berkas.',
    fb4: 'Perbaiki seluruh link internal yang rusak.',
    fb5: 'Kecewa pas klik menu meununya malah kosong.',
    daysAgo: 0, hour: 10, min: 5
  },
  {
    name: 'Intan Nuraini', age: 24, gender: 'Perempuan', occupation: 'Pencari Kerja', wa: '089647827494',
    q1: 3, q2: 4, q3: 2, q4: 3, q5: 3, q6: 4, q7: 3, q8: 3, q9: 2, q10: 4,
    fb1: 'Pengumuman berita terbaru.',
    fb2: 'Tidak ada tombol shortcut ke layanan utama.',
    fb3: 'Alur permohonan rekomendasi paspor pekerja.',
    fb4: 'Sediakan tombol cepat ke layanan AK-1 dan Pelatihan.',
    fb5: 'Perlu tata letak beranda yang lebih ramah pengguna.',
    daysAgo: 0, hour: 12, min: 30
  },
  {
    name: 'Joko Susilo', age: 29, gender: 'Laki-laki', occupation: 'Pencari Kerja', wa: '085711264052',
    q1: 2, q2: 5, q3: 2, q4: 4, q5: 2, q6: 4, q7: 1, q8: 5, q9: 2, q10: 4,
    fb1: 'Membaca pengumuman dinas.',
    fb2: 'Gambar banner atas terpotong di layar smartphone.',
    fb3: 'Jadwal buka tutup kantor saat hari libur.',
    fb4: 'Penyesuaian tata letak gambar banner versi mobile.',
    fb5: 'Harus zoom manual terus kalau buka dari handphone.',
    daysAgo: 0, hour: 14, min: 20
  },
  {
    name: 'Larasati Dewi', age: 21, gender: 'Perempuan', occupation: 'Mahasiswa', wa: '088976249450',
    q1: 2, q2: 4, q3: 2, q4: 4, q5: 1, q6: 5, q7: 2, q8: 4, q9: 2, q10: 4,
    fb1: 'Informasi kontak kantor.',
    fb2: 'Informasi syarat AK-1 sulit dicari di berita lama.',
    fb3: 'Formulir pendaftaran pelatihan kerja.',
    fb4: 'Halaman khusus petunjuk dan syarat AK-1.',
    fb5: 'Desain website perlu dirombak total agar lebih mudah dipakai.',
    daysAgo: 0, hour: 15, min: 45
  }
]

async function main() {
  console.log('🔄 Re-seeding 20 respondents with RANDOM UNIQUE PARTICIPANT CODES...')

  // Find Phase 1 (SUS)
  let phase1 = await prisma.studyPhase.findFirst({ where: { instrument: 'SUS' } })
  if (!phase1) {
    phase1 = await prisma.studyPhase.findFirst()
  }
  if (!phase1) {
    throw new Error('StudyPhase SUS not found.')
  }

  // First, delete old P016-P035 if existing to clean up sequential codes
  for (let i = 16; i <= 35; i++) {
    const oldCode = `P0${i}`
    try {
      const p = await prisma.participant.findUnique({ where: { participantCode: oldCode } })
      if (p) {
        await prisma.participant.delete({ where: { id: p.id } })
        console.log(`🗑️ Deleted old sequential participant ${oldCode}`)
      }
    } catch (e) {
      // Ignore if not found
    }
  }

  const now = new Date()

  for (let i = 0; i < RESPONDENTS_DATA.length; i++) {
    const item = RESPONDENTS_DATA[i]

    // Check if participant with this WA already exists, otherwise generate unique random code
    let participant = await prisma.participant.findFirst({ where: { whatsappNumber: item.wa } })
    
    let code = participant?.participantCode
    if (!code) {
      let isUnique = false
      while (!isUnique) {
        code = generateRandomCode()
        const existing = await prisma.participant.findUnique({ where: { participantCode: code } })
        isUnique = !existing
      }
    }

    // Create realistic createdAt timestamp
    const createdDate = new Date(now)
    createdDate.setDate(now.getDate() - item.daysAgo)
    createdDate.setHours(item.hour, item.min, Math.floor(Math.random() * 59))

    // Upsert participant with random code
    participant = await prisma.participant.upsert({
      where: { participantCode: code },
      update: {
        name: item.name,
        age: item.age,
        gender: item.gender,
        occupation: item.occupation,
        whatsappNumber: item.wa,
      },
      create: {
        participantCode: code,
        name: item.name,
        age: item.age,
        gender: item.gender,
        occupation: item.occupation,
        governmentWebsiteExperience: i % 2 === 0,
        disnakertransExperience: i % 3 === 0,
        whatsappNumber: item.wa,
        createdAt: createdDate,
      },
    })

    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = item
    const susScore = ((q1 - 1) + (5 - q2) + (q3 - 1) + (5 - q4) + (q5 - 1) + (5 - q6) + (q7 - 1) + (5 - q8) + (q9 - 1) + (5 - q10)) * 2.5

    // Upsert SUS response ONLY (NO UEQ, NO UAT!)
    await prisma.susResponse.upsert({
      where: {
        participantId_phaseId: { participantId: participant.id, phaseId: phase1.id }
      },
      update: {
        q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
        susScore,
        fb1: item.fb1,
        fb2: item.fb2,
        fb3: item.fb3,
        fb4: item.fb4,
        fb5: item.fb5,
        fb6: 'Ya',
        fb6Phone: item.wa,
        completedAt: createdDate,
      },
      create: {
        participantId: participant.id,
        phaseId: phase1.id,
        q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
        susScore,
        fb1: item.fb1,
        fb2: item.fb2,
        fb3: item.fb3,
        fb4: item.fb4,
        fb5: item.fb5,
        fb6: 'Ya',
        fb6Phone: item.wa,
        completedAt: createdDate,
      },
    })

    console.log(`[OK] [${code}] ${item.name} (${item.wa}) — SUS Score: ${susScore.toFixed(1)}`)
  }

  console.log('🎉 Successfully re-seeded 20 respondents with RANDOM UNIQUE CODES!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
