/**
 * Evaluasi API Endpoint Verification & Test Utility
 * Skrip pengujian otomatis untuk memverifikasi alur API kuesioner:
 * Register Peserta -> Fase 1 (SUS) -> Fase 2 (UEQ) -> Fase 3 (UAT)
 */

const fs = require('fs')
const path = require('path')

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000'

function loadSampleData() {
  const jsonPath = path.join(__dirname, '../../data/respondents.json')
  if (fs.existsSync(jsonPath)) {
    try {
      const content = fs.readFileSync(jsonPath, 'utf8')
      const data = JSON.parse(content)
      if (Array.isArray(data) && data.length > 0) {
        return data
      }
    } catch (e) {
      console.warn('Gagal membaca data/respondents.json, menggunakan dataset uji default.')
    }
  }
  return null
}

async function testEndpointFlow(item, index) {
  const name = item.name || `Peserta Uji #${index + 1}`
  const age = item.age || 24
  const gender = item.gender || (index % 2 === 0 ? 'Laki-laki' : 'Perempuan')
  const occupation = item.occupation || 'Pencari Kerja'
  const wa = item.whatsappNumber || `08123456${String(index).padStart(4, '0')}`

  console.log(`[${index + 1}] Memverifikasi alur: ${name} (${occupation})`)

  try {
    // 1. Registrasi Peserta
    const regRes = await fetch(`${TARGET_URL}/api/participant/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        age,
        gender,
        occupation,
        governmentWebsiteExperience: item.governmentWebsiteExperience ?? true,
        disnakertransExperience: item.disnakertransExperience ?? false,
      }),
    })

    const regData = await regRes.json()
    if (!regRes.ok) throw new Error(regData.error || 'Registrasi gagal')
    const code = regData.participantCode
    console.log(`  -> Terdaftar dengan kode: ${code}`)

    // 2. Fetch Status Fase
    const pRes = await fetch(`${TARGET_URL}/api/participant/${code}`)
    const pData = await pRes.json()
    if (!pRes.ok) throw new Error('Gagal mengambil status fase')
    const phases = pData.phases || []

    // 3. Submit Evaluasi Fase 1 (SUS)
    const phase1 = phases.find(p => p.instrument === 'SUS')
    if (phase1 && phase1.participantStatus === 'available') {
      const susRes = await fetch(`${TARGET_URL}/api/sus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantCode: code,
          phaseId: phase1.id,
          q1: 4, q2: 2, q3: 4, q4: 2, q5: 4,
          q6: 2, q7: 4, q8: 2, q9: 4, q10: 2,
          fb1: item.feedbackText || 'Fitur informasi lowongan kerja dan pelatihan sangat membantu.',
          fb2: 'Navigasi menu utama.',
          fb3: 'Persyaratan lengkap kartu AK.1.',
          fb4: 'Filter pencarian lowongan kerja.',
          fb5: 'Sangat baik.',
          fb6: 'Ya',
          fb6Phone: wa,
        }),
      })
      if (susRes.ok) console.log('  -> Endpoint SUS terverifikasi.')
    }

    // 4. Submit Evaluasi Fase 2 (UEQ)
    const phase2 = phases.find(p => p.instrument === 'UEQ')
    if (phase2) {
      const ueqAnswers = {}
      for (let i = 1; i <= 26; i++) {
        ueqAnswers[`item${i}`] = 6
      }
      const ueqRes = await fetch(`${TARGET_URL}/api/ueq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantCode: code,
          phaseId: phase2.id,
          ...ueqAnswers,
          fb1: 'Desain visual baru sangat modern dan mudah dipahami.',
          fb2: 'Beberapa kontras warna teks.',
          fb3: 'Pertahankan tata letak yang sudah bersih.',
          fb4: 'Ya',
          fb4Phone: wa,
        }),
      })
      if (ueqRes.ok) console.log('  -> Endpoint UEQ terverifikasi.')
    }

    // 5. Submit Evaluasi Fase 3 (UAT)
    const phase3 = phases.find(p => p.instrument === 'UAT')
    if (phase3) {
      const uatRes = await fetch(`${TARGET_URL}/api/uat/overall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantCode: code,
          phaseId: phase3.id,
          rating1: 5, rating2: 5, rating3: 5, rating4: 4, rating5: 5,
          fb1: 'Layanan publik digital Disnakertrans mudah digunakan.',
          fb2: 'Tidak ada kendala utama.',
          fb3: 'Sistem sangat baik dan siap di-online-kan.',
        }),
      })
      if (uatRes.ok) console.log('  -> Endpoint UAT terverifikasi.')
    }

    console.log(`  -> Selesai verifikasi untuk: ${name}`)
  } catch (err) {
    console.error(`  -> Gagal pada [${name}]:`, err.message)
  }
}

async function main() {
  const entries = loadSampleData() || [
    { name: 'Rizky Pratama', age: 24, gender: 'Laki-laki', occupation: 'Pencari Kerja' },
    { name: 'Siti Rahmawati', age: 26, gender: 'Perempuan', occupation: 'Mahasiswa' },
  ]

  console.log(`Menjalankan pengujian endpoint pada: ${TARGET_URL}`)
  console.log(`Jumlah sampel pengujian: ${entries.length}\n`)

  for (let i = 0; i < entries.length; i++) {
    await testEndpointFlow(entries[i], i)
  }

  console.log(`\nVerifikasi endpoint selesai. Dashboard analitik siap diperiksa di ${TARGET_URL}/admin/dashboard`)
}

main()
