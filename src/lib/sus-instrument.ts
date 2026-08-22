// SUS — System Usability Scale (Bahasa Indonesia)
// Berdasarkan instrumen SUS standar (Brooke, 1996)
// Terjemahan tervalidasi — Sharfina & Santoso (2016), Cronbach's α ≈ 0.841

export const SUS_ITEMS = [
  {
    id: 1,
    text: 'Saya berpikir akan sering menggunakan sistem ini.',
    type: 'positive' as const, // odd → score - 1
  },
  {
    id: 2,
    text: 'Saya merasa sistem ini terlalu kompleks (rumit) tanpa perlu.',
    type: 'negative' as const, // even → 5 - score
  },
  {
    id: 3,
    text: 'Saya merasa sistem ini mudah untuk digunakan.',
    type: 'positive' as const,
  },
  {
    id: 4,
    text: 'Saya membutuhkan bantuan dari orang yang ahli/teknisi untuk dapat menggunakan sistem ini.',
    type: 'negative' as const,
  },
  {
    id: 5,
    text: 'Saya menemukan berbagai fungsi dalam sistem ini terintegrasi dengan baik.',
    type: 'positive' as const,
  },
  {
    id: 6,
    text: 'Saya merasa terdapat terlalu banyak ketidakkonsistenan dalam sistem ini.',
    type: 'negative' as const,
  },
  {
    id: 7,
    text: 'Saya bayangkan kebanyakan orang akan belajar menggunakan sistem ini dengan sangat cepat.',
    type: 'positive' as const,
  },
  {
    id: 8,
    text: 'Saya merasa sistem ini sangat tidak praktis (canggung) untuk digunakan.',
    type: 'negative' as const,
  },
  {
    id: 9,
    text: 'Saya merasa sangat percaya diri menggunakan sistem ini.',
    type: 'positive' as const,
  },
  {
    id: 10,
    text: 'Saya perlu banyak belajar sebelum saya dapat mulai menggunakan sistem ini.',
    type: 'negative' as const,
  },
]

export const SUS_SCALE = [
  { value: 1, label: 'Sangat Tidak Setuju' },
  { value: 2, label: 'Tidak Setuju' },
  { value: 3, label: 'Netral' },
  { value: 4, label: 'Setuju' },
  { value: 5, label: 'Sangat Setuju' },
]

// Pertanyaan feedback kualitatif (open-ended + pilihan)
export const SUS_FEEDBACK_ITEMS = [
  {
    id: 'fb1',
    text: 'Bagian atau fitur apa yang menurut Anda paling mudah digunakan?',
    type: 'text' as const,
    required: false,
    placeholder: "Tuliskan jawaban Anda atau ketik 'Tidak ada' jika tidak menemukan kendala.",
  },
  {
    id: 'fb2',
    text: 'Bagian atau fitur apa yang menurut Anda sulit digunakan atau membingungkan?',
    type: 'text' as const,
    required: false,
    placeholder: "Tuliskan jawaban Anda atau ketik 'Tidak ada' jika tidak menemukan kendala.",
  },
  {
    id: 'fb3',
    text: 'Apakah ada informasi yang sulit ditemukan? Jika ada, sebutkan.',
    type: 'text' as const,
    required: false,
    placeholder: "Tuliskan jawaban Anda atau ketik 'Tidak ada' jika tidak menemukan kendala.",
  },
  {
    id: 'fb4',
    text: 'Fitur atau informasi apa yang menurut Anda perlu ditambahkan atau ditingkatkan?',
    type: 'text' as const,
    required: false,
    placeholder: "Tuliskan jawaban Anda atau ketik 'Tidak ada' jika tidak menemukan kendala.",
  },
  {
    id: 'fb5',
    text: 'Saran atau masukan untuk peningkatan website layanan Disnakertrans Kabupaten Serang.',
    type: 'text' as const,
    required: false,
    placeholder: "Tuliskan jawaban Anda atau ketik 'Tidak ada' jika tidak menemukan kendala.",
  },
  {
    id: 'fb6',
    text: 'Apakah Anda bersedia berpartisipasi dalam pengujian/kuesioner lanjutan setelah pengembangan website?',
    type: 'radio' as const,
    required: true,
    options: ['Ya', 'Tidak'],
  },
]


export function calculateSusScore(responses: number[]): number {
  if (responses.length !== 10) throw new Error('SUS requires exactly 10 responses')

  let total = 0
  for (let i = 0; i < 10; i++) {
    const r = responses[i]
    const itemNum = i + 1
    if (itemNum % 2 !== 0) {
      // Odd items (positive): score - 1
      total += r - 1
    } else {
      // Even items (negative): 5 - score
      total += 5 - r
    }
  }
  return total * 2.5
}

export function getSusGrade(score: number): { grade: string; adjective: string; color: string } {
  if (score >= 84.1) return { grade: 'A', adjective: 'Excellent', color: '#22c55e' }
  if (score >= 72.6) return { grade: 'B', adjective: 'Good', color: '#84cc16' }
  if (score >= 52.0) return { grade: 'C', adjective: 'OK', color: '#eab308' }
  if (score >= 38.0) return { grade: 'D', adjective: 'Poor', color: '#f97316' }
  return { grade: 'F', adjective: 'Awful', color: '#ef4444' }
}
