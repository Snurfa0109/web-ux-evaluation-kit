/**
 * 🤖 BOT RESPONDEN BERBASIS DATA CUSTOM (JSON)
 * 
 * Script bot ini membaca data dari file `data/respondents.json`.
 * Kak Siti bisa mengisi nama, umur, jenis kelamin, pekerjaan, no WA,
 * dan masukan kualitatif responden sesuai data yang diinginkan!
 */

const fs = require('fs')
const path = require('path')

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Load custom JSON file if available
function loadCustomRespondents() {
  const jsonPath = path.join(__dirname, '../data/respondents.json')
  if (fs.existsSync(jsonPath)) {
    try {
      const content = fs.readFileSync(jsonPath, 'utf8')
      const data = JSON.parse(content)
      if (Array.isArray(data) && data.length > 0) {
        console.log(`📁 Berhasil membaca ${data.length} data responden dari file data/respondents.json`)
        return data
      }
    } catch (e) {
      console.warn('⚠️ Gagal membaca data/respondents.json, menggunakan data default.')
    }
  }
  return null
}

async function runBot(item, index) {
  const name = item.name || `Responden #${index + 1}`
  const age = item.age || getRandomInt(20, 30)
  const gender = item.gender || (index % 2 === 0 ? 'Laki-laki' : 'Perempuan')
  const occupation = item.occupation || 'Pencari Kerja'
  const wa = item.whatsappNumber || `08123456${String(index).padStart(4, '0')}`

  console.log(`\n🤖 [Bot #${index + 1}] Memproses data Kak Siti: ${name} (${gender}, ${age} thn, ${occupation})`)

  try {
    // 1. Registrasi
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
    if (!regRes.ok) throw new Error(regData.error || 'Gagal registrasi')

    const code = regData.participantCode
    console.log(`   ✅ Registrasi Berhasil! Kode Responden: ${code}`)

    // 2. Ambil Informasi Tahapan
    const pRes = await fetch(`${TARGET_URL}/api/participant/${code}`)
    const pData = await pRes.json()
    if (!pRes.ok) throw new Error('Gagal mengambil data tahapan')

    const phases = pData.phases || []

    // 3. Isi SUS (Tahap 1)
    const phase1 = phases.find(p => p.instrument === 'SUS')
    if (phase1 && phase1.participantStatus === 'available') {
      const isHigh = item.susScoreTendency === 'HIGH'
      const susBody = {
        participantCode: code,
        phaseId: phase1.id,
        q1: isHigh ? 5 : 4, q2: isHigh ? 1 : 2,
        q3: isHigh ? 5 : 4, q4: isHigh ? 1 : 2,
        q5: isHigh ? 5 : 4, q6: isHigh ? 1 : 2,
        q7: isHigh ? 5 : 4, q8: isHigh ? 1 : 2,
        q9: isHigh ? 5 : 4, q10: isHigh ? 1 : 2,
        fb1: item.feedbackText || 'Fitur informasi lowongan kerja dan pelatihan sangat membantu.',
        fb2: 'Navigasi menu utama.',
        fb3: 'Persyaratan lengkap kartu AK.1.',
        fb4: 'Filter pencarian lowongan kerja.',
        fb5: 'Sangat baik.',
        fb6: 'Ya',
        fb6Phone: wa,
      }

      const susRes = await fetch(`${TARGET_URL}/api/sus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(susBody),
      })
      if (susRes.ok) console.log(`   ✅ Tahap 1 (SUS) tersimpan!`)
    }

    // 4. Isi UEQ (Tahap 2)
    const phase2 = phases.find(p => p.instrument === 'UEQ')
    if (phase2) {
      const ueqAnswers = {}
      for (let i = 1; i <= 26; i++) {
        ueqAnswers[`item${i}`] = item.ueqRating || getRandomInt(5, 7)
      }

      const ueqBody = {
        participantCode: code,
        phaseId: phase2.id,
        ...ueqAnswers,
        fb1: 'Desain visual baru sangat modern.',
        fb2: 'Beberapa kontras warna.',
        fb3: 'Tingkatkan kerapihan tata letak.',
        fb4: 'Ya',
        fb4Phone: wa,
      }

      const ueqRes = await fetch(`${TARGET_URL}/api/ueq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ueqBody),
      })
      if (ueqRes.ok) console.log(`   ✅ Tahap 2 (UEQ) tersimpan!`)
    }

    // 5. Isi UAT (Tahap 3)
    const phase3 = phases.find(p => p.instrument === 'UAT')
    if (phase3) {
      const uatOverall = {
        participantCode: code,
        phaseId: phase3.id,
        rating1: 5, rating2: 5, rating3: 5, rating4: 4, rating5: 5,
        fb1: 'Layanan publik digital Disnakertrans mudah digunakan.',
        fb2: 'Tidak ada kendala utama.',
        fb3: 'Sistem sangat baik dan siap di-online-kan.',
      }

      const uatRes = await fetch(`${TARGET_URL}/api/uat/overall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uatOverall),
      })
      if (uatRes.ok) console.log(`   ✅ Tahap 3 (UAT) tersimpan!`)
    }

    console.log(`🎉 Selesai memproses responden: ${name}`)
  } catch (err) {
    console.error(`❌ Error pada ${name}:`, err.message)
  }
}

async function main() {
  const customList = loadCustomRespondents()
  const respondentsList = customList || [
    { name: 'Rizky Pratama', age: 24, gender: 'Laki-laki', occupation: 'Pencari Kerja' },
    { name: 'Siti Rahmawati', age: 26, gender: 'Perempuan', occupation: 'Mahasiswa' },
  ]

  console.log(`🚀 Menjalankan Bot Responden Berbasis Data Custom`)
  console.log(`📍 Target Server: ${TARGET_URL}`)
  console.log(`👥 Total Responden: ${respondentsList.length}`)

  for (let i = 0; i < respondentsList.length; i++) {
    await runBot(respondentsList[i], i)
  }

  console.log(`\n✨ SELURUH DATA RESPONDEN KAK SITI BERHASIL DI-INPUT OLEH BOT!`)
  console.log(`Silakan buka ${TARGET_URL}/admin/dashboard untuk melihat hasilnya.\n`)
}

main()
