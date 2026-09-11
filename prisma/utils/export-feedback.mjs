/**
 * Utilitas Rekapitulasi dan Ekspor Umpan Balik Kualitatif Responden
 * Menyusun ringkasan tanggapan terbuka kuesioner ke dalam format dokumentasi.
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const records = await prisma.susResponse.findMany({
    include: { participant: true, phase: true },
    orderBy: { completedAt: 'asc' }
  })

  let output = `# RANGKUMAN FEEDBACK EVALUASI SUS (SYSTEM USABILITY SCALE)\n`
  output += `Total Responden: ${records.length}\n\n`

  records.forEach((item, index) => {
    output += `### Responden ${index + 1}: ${item.participant.name} (${item.participant.participantCode})\n`
    output += `- **Demografi**: ${item.participant.occupation}, ${item.participant.age} thn, ${item.participant.gender}\n`
    output += `- **Skor SUS**: ${item.susScore}\n`
    output += `- **Fitur Paling Mudah Digunakan**: ${item.fb1 || '-'}\n`
    output += `- **Fitur Sulit / Membingungkan**: ${item.fb2 || '-'}\n`
    output += `- **Informasi Sulit Ditemukan**: ${item.fb3 || '-'}\n`
    output += `- **Usulan Fitur / Informasi Tambahan**: ${item.fb4 || '-'}\n`
    output += `- **Saran & Masukan Umum**: ${item.fb5 || '-'}\n`
    output += `- **Kontak Lanjutan**: ${item.fb6 || '-'} (${item.fb6Phone || '-'})\n\n`
  })

  const outPath = new URL('../utils/sus-feedback-summary.md', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
  fs.writeFileSync(outPath, output, 'utf-8')
  console.log(`Saved to prisma/utils/sus-feedback-summary.md`)
}

main()
  .catch(err => console.error('ERROR:', err))
  .finally(() => prisma.$disconnect())
