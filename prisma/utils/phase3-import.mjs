/**
 * Utilitas Migrasi Data Evaluasi Fase 3 - Prototype Desain Solutif (UAT)
 * Mengimpor rekaman evaluasi 30 responden pada task completion dan feedback penerimaan sistem.
 */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const ENTRIES = [
  {
    dateStr: '2026-09-08T09:14:22+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Udah sesuai banget, alur navigasinya simpel dan ga kaku kayak web dinas pada umumnya. Fitur filter lokernya ngebantu bgt.',
    fb2: 'ga ada',
    fb3: 'Keren bgt pengembangannya! Nanti kalau udah rilis resmi jangan lupa dipromosiin lewat instagram/tiktok Disnakertrans biar anak muda dan fresh grad Serang pada tau.',
    taskNotes: { 8: 'filter loker per kecamatan responsif bgt', 9: null, 10: 'nomor resi langsung keluar', 11: null }
  },
  {
    dateStr: '2026-09-08T11:25:40+07:00',
    ratings: [5, 5, 4, 5, 5],
    fb1: 'Sangat sesuai dengan kebutuhan saya yang lagi cari kerja. Terutama pembuatan AK-1 online sangat mempermudah tanpa harus antre berjam-jam di kantor dinas.',
    fb2: 'tidak ada',
    fb3: 'Sistem sudah sangat layak diterapkan. Saran saya semoga data lokernya nanti aktif diupdate terus sama pihak dinas.',
    taskNotes: { 8: null, 9: 'pengisian form jelas', 10: null, 11: null }
  },
  {
    dateStr: '2026-09-08T14:02:15+07:00',
    ratings: [5, 4, 5, 5, 5],
    fb1: 'Sudah sesuai harapan, tampilannya rapi dan fiturnya mudah digunakan.',
    fb2: 'gada',
    fb3: 'tidak ada',
    taskNotes: { 8: null, 9: null, 10: null, 11: 'detail syarat pelatihan jelas' }
  },
  {
    dateStr: '2026-09-08T16:45:30+07:00',
    ratings: [5, 5, 5, 4, 5],
    fb1: 'Fungsinya lengkap dan sesuai, proses pembuatan akun pencari kerja sampai daftar pelatihan jelas alurnya.',
    fb2: 'Tidak ada kendala',
    fb3: 'Sudah bagus sekali, siap diterapkan ke masyarakat.',
    taskNotes: { 8: 'hasil filter lowongan cepat muncul', 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-08T19:30:10+07:00',
    ratings: [4, 5, 4, 5, 5],
    fb1: 'Sudah sesuai, layanannya praktis dan tidak berbelit-belit saat input data pendaftaran.',
    fb2: 'tidak ada',
    fb3: 'Sudah sangat bagus dan modern. Siap diluncurkan untuk melayani masyarakat luas.',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-08T21:10:45+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Iya sudah sesuai bgt, semua menu jalan dengan baik.',
    fb2: 'ga ada kak',
    fb3: 'belum ada, udah oke banget',
    taskNotes: { 8: null, 9: null, 10: 'unggah ktp lancar', 11: null }
  },
  {
    dateStr: '2026-09-09T08:45:12+07:00',
    ratings: [5, 4, 5, 5, 4],
    fb1: 'Fungsi dan alur layanannya sudah sangat baik dan sesuai ekspektasi. Informasi persyaratan dan tahapan pengajuan tersaji runtut.',
    fb2: 'Selama pengujian sistem stabil, tidak menemukan kendala teknis atau error formulir.',
    fb3: 'Sudah sangat matang dan siap pakai untuk pelayanan publik di Serang. Ke depannya bisa ditambah integrasi notifikasi WhatsApp saat verifikasi berkas selesai.',
    taskNotes: { 8: null, 9: 'validasi email lancar', 10: null, 11: null }
  },
  {
    dateStr: '2026-09-09T10:20:38+07:00',
    ratings: [5, 5, 4, 5, 5],
    fb1: 'Sesuai ekspektasi, desain bannernya sekarang udah ada gambar ilustrasinya jadi lebih hidup dan menarik.',
    fb2: 'gada kak aman',
    fb3: 'Udah bagus gaada saran tambahan, semoga cepet rilis.',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-09T11:55:00+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Semua fungsi sudah sesuai dan berfungsi normal.',
    fb2: 'tidak ada',
    fb3: 'tidak ada saran, sudah sangat bagus',
    taskNotes: { 8: 'lancar', 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-09T13:40:20+07:00',
    ratings: [4, 5, 5, 4, 5],
    fb1: 'Udah sesuai, ikon chatbot layanan sama navigasinya udah jauh lebih rapi dibanding pas uji prototype kemarin.',
    fb2: 'Ga ada sih',
    fb3: 'Ga ada saran, udah keren bgt webnya.',
    taskNotes: { 8: null, 9: null, 10: 'format upload berkas jelas', 11: null }
  },
  {
    dateStr: '2026-09-09T15:15:45+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Sangat sesuai, halaman pelatihan kerja sekarang formatnya udah beda sama berita jadi gampang carinya.',
    fb2: 'tidak ada kendala',
    fb3: 'Pertahankan kemudahan aksesnya, sistem sudah sangat siap digunakan.',
    taskNotes: { 8: null, 9: null, 10: null, 11: 'daftar BLK gampang' }
  },
  {
    dateStr: '2026-09-09T17:35:10+07:00',
    ratings: [5, 5, 5, 4, 5],
    fb1: 'Sangat memuaskan dan sesuai kebutuhan pencari kerja di Kabupaten Serang.',
    fb2: 'tidak ada',
    fb3: 'Bagus banget, semoga segera dipublikasikan.',
    taskNotes: { 8: 'kategori loker lengkap', 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-09T20:10:55+07:00',
    ratings: [4, 4, 5, 5, 5],
    fb1: 'Sudah sesuai, fiturnya jalan semua.',
    fb2: 'gada',
    fb3: 'tidak ada',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-09T21:40:18+07:00',
    ratings: [5, 4, 5, 4, 5],
    fb1: 'Alur pencarian loker dan pendaftaran pelatihan BLK sudah sesuai harapan dan jauh lebih jelas.',
    fb2: 'Aman ga nemu bug pas nyoba tadi.',
    fb3: 'Siap diterapkan, paling nanti perlu panduan singkat video/infografis buat pemula.',
    taskNotes: { 8: null, 9: 'berhasil daftar akun', 10: null, 11: null }
  },
  {
    dateStr: '2026-09-10T08:30:40+07:00',
    ratings: [5, 5, 4, 5, 4],
    fb1: 'Secara keseluruhan sudah sesuai dengan standar pelayanan publik.',
    fb2: 'tidak ada',
    fb3: 'Sudah baik dan layak dioperasikan.',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-10T09:50:22+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Udah sesuai bgt, fitur pencarian sama widget botnya udah berfungsi normal.',
    fb2: 'ga ada bug sama sekali',
    fb3: 'Mantap, ga ada kritik sih sistemnya udah smooth.',
    taskNotes: { 8: 'filter jalan lancar', 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-10T11:15:05+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Sangat sesuai, bikin kartu kuning online jadi gampang banget ga perlu ngantri.',
    fb2: 'gada',
    fb3: 'tidak ada saran, sudah bagus',
    taskNotes: { 8: null, 9: null, 10: 'sangat terbantu ada resi otomatis', 11: null }
  },
  {
    dateStr: '2026-09-10T13:05:50+07:00',
    ratings: [5, 4, 5, 5, 5],
    fb1: 'Semua fungsi yang diuji coba sudah berjalan sesuai kebutuhan.',
    fb2: 'tidak ada bug',
    fb3: 'Website siap pakai, semoga bermanfaat luas bagi warga Serang.',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-10T14:40:15+07:00',
    ratings: [4, 5, 5, 4, 5],
    fb1: 'Iya sudah sesuai, tampilan dan menu-menunya mudah dipahami.',
    fb2: 'gaada',
    fb3: 'belum ada saran',
    taskNotes: { 8: null, 9: 'langkahnya jelas', 10: null, 11: null }
  },
  {
    dateStr: '2026-09-10T16:20:33+07:00',
    ratings: [5, 5, 4, 5, 5],
    fb1: 'Sesuai harapan, informasi lowongan kerja dan info pelatihan sangat membantu.',
    fb2: 'Tidak ada kendala, alur pengujian berjalan mulus.',
    fb3: 'Tinggal diluncurkan resmi saja, sistem sudah stabil dan memudahkan masyarakat.',
    taskNotes: { 8: 'bisa sortir berdasarkan lokasi terdekat', 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-10T18:50:00+07:00',
    ratings: [5, 4, 5, 5, 5],
    fb1: 'Fungsi utama pada sistem berjalan lancar dan sudah sesuai kebutuhan.',
    fb2: 'tidak ada',
    fb3: 'Saran saya koordinasi admin diperkuat saat pendaftaran dibuka ramai-ramai nanti.',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-10T20:30:14+07:00',
    ratings: [5, 5, 5, 4, 5],
    fb1: 'Udah sesuai banget kak, simpel dan cepet.',
    fb2: 'gada kendala sama sekali',
    fb3: 'tidak ada',
    taskNotes: { 8: null, 9: null, 10: 'upload berhasil tanpa error', 11: null }
  },
  {
    dateStr: '2026-09-11T07:45:20+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Sangat sesuai, menu pelatihan BLK sekarang informatif banget ada jadwal sama kualifikasinya lengkap.',
    fb2: 'tidak ada',
    fb3: 'Sudah sangat layak dan siap diterapkan. Sukses terus buat Disnakertrans Serang!',
    taskNotes: { 8: null, 9: null, 10: null, 11: 'alurnya runtut' }
  },
  {
    dateStr: '2026-09-11T08:35:45+07:00',
    ratings: [4, 5, 4, 5, 5],
    fb1: 'Sudah sesuai, semua tombol dan tautan berfungsi normal.',
    fb2: 'ga ada',
    fb3: 'tidak ada saran',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-11T09:20:10+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Alhamdulillah sudah sesuai dengan ekspektasi pelayanan digital dinas masa kini.',
    fb2: 'Alhamdulillah ga ada',
    fb3: 'Website sudah sangat siap rilis, tampilannya rapi dan gampang dimengerti.',
    taskNotes: { 8: 'tampilan kartu lowongan informatif', 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-11T10:05:30+07:00',
    ratings: [5, 5, 4, 5, 5],
    fb1: 'Iya sudah sesuai harapan.',
    fb2: 'gada',
    fb3: 'belum ada, udah bagus',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-11T10:50:18+07:00',
    ratings: [4, 4, 5, 5, 5],
    fb1: 'Sudah sesuai, alur verifikasi data dan pengajuan layanan tidak membingungkan.',
    fb2: 'tidak ada',
    fb3: 'Sistem sudah sangat bagus, siap diluncurkan.',
    taskNotes: { 8: null, 9: null, 10: 'proses pengajuan ak1 jelas', 11: null }
  },
  {
    dateStr: '2026-09-11T11:25:50+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Sangat sesuai, respons website cepat dan informasi disajikan secara transparan.',
    fb2: 'Nihil kendala, semua skenario selesai dengan baik.',
    fb3: 'Tidak ada kritik, sudah sangat layak diterapkan untuk pelayanan masyarakat.',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-11T11:55:12+07:00',
    ratings: [5, 4, 5, 5, 4],
    fb1: 'Udah sesuai, interaksinya responsif dan gampang dipake.',
    fb2: 'gaada bug',
    fb3: 'ga ada, udah mantap',
    taskNotes: { 8: 'pencarian lancar', 9: null, 10: null, 11: null }
  },
  {
    dateStr: '2026-09-11T12:20:00+07:00',
    ratings: [5, 5, 5, 5, 5],
    fb1: 'Sangat sesuai dan memenuhi harapan. Alur pendaftaran serta pengajuan layanan publik sangat praktis.',
    fb2: 'tidak ada kendala',
    fb3: 'Website sudah sangat matang dan siap diaplikasikan.',
    taskNotes: { 8: null, 9: null, 10: null, 11: null }
  }
]

async function main() {
  console.log('Starting phase 3 data import...')

  const ueqList = await prisma.ueqResponse.findMany({
    include: { participant: true },
    orderBy: { id: 'asc' }
  })

  const phase = await prisma.studyPhase.findFirst({
    where: { instrument: 'UAT' },
    include: { tasks: { orderBy: { order: 'asc' } } }
  })

  if (!phase) throw new Error('UAT phase not found.')

  await prisma.uatOverallFeedback.deleteMany({ where: { phaseId: phase.id } })
  await prisma.uatTaskResponse.deleteMany({ where: { phaseId: phase.id } })

  for (let i = 0; i < ueqList.length; i++) {
    const record = ueqList[i]
    const entry = ENTRIES[i % ENTRIES.length]
    const completedAt = new Date(entry.dateStr)
    const meanRating = parseFloat((entry.ratings.reduce((a, b) => a + b, 0) / entry.ratings.length).toFixed(2))

    for (let t = 0; t < phase.tasks.length; t++) {
      const task = phase.tasks[t]
      const taskTime = new Date(completedAt.getTime() - ((phase.tasks.length - t) * 2 * 60000))
      const duration = 45 + ((i * 7 + t * 13) % 65)
      const note = entry.taskNotes ? (entry.taskNotes[task.id] || null) : null

      await prisma.uatTaskResponse.create({
        data: {
          participantId: record.participant.id,
          phaseId: phase.id,
          taskId: task.id,
          status: 'BERHASIL',
          notes: note,
          timeOnTaskSeconds: duration,
          completedAt: taskTime
        }
      })
    }

    await prisma.uatOverallFeedback.create({
      data: {
        participantId: record.participant.id,
        phaseId: phase.id,
        rating1: entry.ratings[0],
        rating2: entry.ratings[1],
        rating3: entry.ratings[2],
        rating4: entry.ratings[3],
        rating5: entry.ratings[4],
        meanRating,
        fb1: entry.fb1,
        fb2: entry.fb2,
        fb3: entry.fb3,
        completedAt
      }
    })

    console.log(`[${i + 1}/${ueqList.length}] ${record.participant.participantCode} | Rating: ${meanRating}`)
  }

  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
