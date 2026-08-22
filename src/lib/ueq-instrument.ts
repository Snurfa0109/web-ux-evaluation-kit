// UEQ — User Experience Questionnaire Full (26 items — Bahasa Indonesia)
// Berdasarkan instrumen UEQ resmi (Laugwitz, Held & Schrepp, 2008)
// Versi Bahasa Indonesia

// Orientasi: 1 = adjective kiri positif, -1 = adjective kiri negatif
// Skala 1–7 dikonversi ke -3 hingga +3

export type UeqDimension = 'attractiveness' | 'perspicuity' | 'efficiency' | 'dependability' | 'stimulation' | 'novelty'

export interface UeqItem {
  id: number
  left: string      // adjective kiri
  right: string     // adjective kanan
  dimension: UeqDimension
  // orientation: 1 berarti kanan positif (nilai tinggi = positif), -1 berarti kiri positif (nilai rendah = positif)
  // Untuk scoring: jika orientation=1: score = value - 4; jika orientation=-1: score = 4 - value
  orientation: 1 | -1
}

export const UEQ_ITEMS: UeqItem[] = [
  // Attractiveness (6 items): 1, 2, 12, 14, 16, 24 → items 1,2,6,8,10,21 per urutan di bawah
  { id: 1,  left: 'Menyusahkan',    right: 'Menyenangkan',    dimension: 'attractiveness', orientation: 1 },
  { id: 2,  left: 'Tidak Berguna',  right: 'Berguna',         dimension: 'attractiveness', orientation: 1 },
  { id: 3,  left: 'Sulit Dipelajari', right: 'Mudah Dipelajari', dimension: 'perspicuity', orientation: 1 },
  { id: 4,  left: 'Membosankan',    right: 'Mengasyikkan',    dimension: 'stimulation',    orientation: 1 },
  { id: 5,  left: 'Tidak Efektif',  right: 'Efektif',         dimension: 'efficiency',     orientation: 1 },
  { id: 6,  left: 'Membingungkan',  right: 'Jelas',           dimension: 'perspicuity',    orientation: 1 },
  { id: 7,  left: 'Tidak Menarik',  right: 'Menarik',         dimension: 'stimulation',    orientation: 1 },
  { id: 8,  left: 'Tidak Dapat Diprediksi', right: 'Dapat Diprediksi', dimension: 'dependability', orientation: 1 },
  { id: 9,  left: 'Lambat',         right: 'Cepat',           dimension: 'efficiency',     orientation: 1 },
  { id: 10, left: 'Konvensional',   right: 'Inovatif',        dimension: 'novelty',        orientation: 1 },
  { id: 11, left: 'Menghalang-halangi', right: 'Mendukung',   dimension: 'dependability',  orientation: 1 },
  { id: 12, left: 'Buruk',          right: 'Baik',            dimension: 'attractiveness', orientation: 1 },
  { id: 13, left: 'Rumit',          right: 'Sederhana',       dimension: 'perspicuity',    orientation: 1 },
  { id: 14, left: 'Tidak Disukai',  right: 'Disukai',         dimension: 'attractiveness', orientation: 1 },
  { id: 15, left: 'Tidak Lazim',    right: 'Lazim',           dimension: 'novelty',        orientation: -1 },
  { id: 16, left: 'Tidak Nyaman',   right: 'Nyaman',          dimension: 'attractiveness', orientation: 1 },
  { id: 17, left: 'Aman',           right: 'Tidak Aman',      dimension: 'dependability',  orientation: -1 },
  { id: 18, left: 'Memotivasi',     right: 'Tidak Memotivasi', dimension: 'stimulation',   orientation: -1 },
  { id: 19, left: 'Memenuhi Ekspektasi', right: 'Tidak Memenuhi Ekspektasi', dimension: 'dependability', orientation: -1 },
  { id: 20, left: 'Tidak Efisien',  right: 'Efisien',         dimension: 'efficiency',     orientation: 1 },
  { id: 21, left: 'Jelas',          right: 'Membingungkan',   dimension: 'perspicuity',    orientation: -1 },
  { id: 22, left: 'Tidak Praktis',  right: 'Praktis',         dimension: 'efficiency',     orientation: 1 },
  { id: 23, left: 'Terorganisir',   right: 'Tidak Terorganisir', dimension: 'dependability', orientation: -1 },
  { id: 24, left: 'Atraktif',       right: 'Tidak Atraktif',  dimension: 'attractiveness', orientation: -1 },
  { id: 25, left: 'Ramah Pengguna', right: 'Tidak Ramah Pengguna', dimension: 'perspicuity', orientation: -1 },
  { id: 26, left: 'Konservatif',    right: 'Kreatif',         dimension: 'novelty',        orientation: 1 },
]

export const UEQ_DIMENSIONS: { key: UeqDimension; label: string; itemIds: number[] }[] = [
  { key: 'attractiveness', label: 'Attractiveness', itemIds: [1, 2, 12, 14, 16, 24] },
  { key: 'perspicuity',    label: 'Perspicuity',    itemIds: [3, 6, 13, 21, 25] },
  { key: 'efficiency',     label: 'Efficiency',     itemIds: [5, 9, 20, 22] },
  { key: 'dependability',  label: 'Dependability',  itemIds: [8, 11, 17, 19, 23] },
  { key: 'stimulation',    label: 'Stimulation',    itemIds: [4, 7, 18] },
  { key: 'novelty',        label: 'Novelty',        itemIds: [10, 15, 26] },
]

// Convert raw 1-7 scale to -3 to +3
function convertToScale(rawValue: number, orientation: 1 | -1): number {
  if (orientation === 1) {
    return rawValue - 4 // 1→-3, 4→0, 7→+3
  } else {
    return 4 - rawValue // 1→+3, 4→0, 7→-3
  }
}

export function calculateUeqScores(responses: number[]): {
  attractiveness: number
  perspicuity: number
  efficiency: number
  dependability: number
  stimulation: number
  novelty: number
} {
  if (responses.length !== 26) throw new Error('UEQ requires exactly 26 responses')

  const convertedScores = UEQ_ITEMS.map((item, idx) =>
    convertToScale(responses[idx], item.orientation)
  )

  const calcDimension = (itemIds: number[]) => {
    const scores = itemIds.map(id => convertedScores[id - 1])
    return scores.reduce((a, b) => a + b, 0) / scores.length
  }

  return {
    attractiveness: parseFloat(calcDimension([1, 2, 12, 14, 16, 24]).toFixed(3)),
    perspicuity:    parseFloat(calcDimension([3, 6, 13, 21, 25]).toFixed(3)),
    efficiency:     parseFloat(calcDimension([5, 9, 20, 22]).toFixed(3)),
    dependability:  parseFloat(calcDimension([8, 11, 17, 19, 23]).toFixed(3)),
    stimulation:    parseFloat(calcDimension([4, 7, 18]).toFixed(3)),
    novelty:        parseFloat(calcDimension([10, 15, 26]).toFixed(3)),
  }
}

export function getUeqInterpretation(score: number): string {
  if (score > 0.8) return 'Excellent'
  if (score > 0.5) return 'Good'
  if (score >= -0.5) return 'Neutral'
  if (score >= -0.8) return 'Bad'
  return 'Awful'
}

export const UEQ_FEEDBACK_ITEMS = [
  {
    id: 'fb1',
    text: 'Bagian atau tampilan visual mana dari prototype redesign yang paling Anda sukai?',
    type: 'text' as const,
    required: true,
  },
  {
    id: 'fb2',
    text: 'Bagian mana dari prototype yang menurut Anda masih membingungkan atau kurang nyaman digunakan?',
    type: 'text' as const,
    required: true,
  },
  {
    id: 'fb3',
    text: 'Saran atau masukan untuk perbaikan prototype sebelum dikembangkan menjadi website final.',
    type: 'text' as const,
    required: true,
  },
  {
    id: 'fb4',
    text: 'Apakah Anda bersedia berpartisipasi dalam tahap pengujian akhir website (UAT)?',
    type: 'radio' as const,
    required: true,
    options: ['Ya', 'Tidak'],
  },
]

