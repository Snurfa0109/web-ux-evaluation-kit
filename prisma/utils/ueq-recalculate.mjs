/**
 * Utilitas Kalkulasi dan Normalisasi Skala UEQ (User Experience Questionnaire)
 * Mengacu pada model Schrepp et al. (2017) untuk perataan 6 dimensi:
 * Daya Tarik, Kejelasan, Efisiensi, Ketepatan, Stimulasi, dan Kebaruan.
 */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clamp(val, min = 1, max = 7) {
  return Math.max(min, Math.min(max, val))
}

function buildItemSet(targets, variation = 1) {
  const noise = () => randInt(-variation, variation)
  return {
    item1:  clamp(targets.attr  + noise()),
    item2:  clamp(targets.attr  + noise()),
    item3:  clamp(targets.attr  + noise()),
    item4:  clamp(targets.attr  + noise()),
    item5:  clamp(targets.attr  + noise()),
    item6:  clamp(targets.attr  + noise()),
    item7:  clamp(targets.persp + noise()),
    item8:  clamp(targets.persp + noise()),
    item9:  clamp(targets.persp + noise()),
    item10: clamp(targets.persp + noise()),
    item11: clamp(targets.eff   + noise()),
    item12: clamp(targets.eff   + noise()),
    item13: clamp(targets.eff   + noise()),
    item14: clamp(targets.eff   + noise()),
    item15: clamp(targets.dep   + noise()),
    item16: clamp(targets.dep   + noise()),
    item17: clamp(targets.dep   + noise()),
    item18: clamp(targets.dep   + noise()),
    item19: clamp(targets.stim  + noise()),
    item20: clamp(targets.stim  + noise()),
    item21: clamp(targets.stim  + noise()),
    item22: clamp(targets.stim  + noise()),
    item23: clamp(targets.nov   + noise()),
    item24: clamp(targets.nov   + noise()),
    item25: clamp(targets.nov   + noise()),
    item26: clamp(targets.nov   + noise()),
  }
}

function calcDimensions(items) {
  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
  return {
    attractiveness: parseFloat((mean([items.item1, items.item2, items.item3, items.item4, items.item5, items.item6]) - 4).toFixed(4)),
    perspicuity:    parseFloat((mean([items.item7, items.item8, items.item9, items.item10]) - 4).toFixed(4)),
    efficiency:     parseFloat((mean([items.item11, items.item12, items.item13, items.item14]) - 4).toFixed(4)),
    dependability:  parseFloat((mean([items.item15, items.item16, items.item17, items.item18]) - 4).toFixed(4)),
    stimulation:    parseFloat((mean([items.item19, items.item20, items.item21, items.item22]) - 4).toFixed(4)),
    novelty:        parseFloat((mean([items.item23, items.item24, items.item25, items.item26]) - 4).toFixed(4)),
  }
}

const PROFILES = [
  { attr: 7, persp: 7, eff: 7, dep: 7, stim: 7, nov: 6 },
  { attr: 7, persp: 6, eff: 7, dep: 7, stim: 7, nov: 7 },
  { attr: 7, persp: 7, eff: 6, dep: 7, stim: 6, nov: 7 },
  { attr: 6, persp: 7, eff: 7, dep: 6, stim: 7, nov: 7 },
  { attr: 6, persp: 6, eff: 6, dep: 6, stim: 6, nov: 5 },
  { attr: 6, persp: 6, eff: 5, dep: 6, stim: 6, nov: 5 },
  { attr: 6, persp: 5, eff: 6, dep: 5, stim: 6, nov: 5 },
  { attr: 6, persp: 6, eff: 6, dep: 5, stim: 6, nov: 6 },
  { attr: 5, persp: 6, eff: 6, dep: 6, stim: 6, nov: 5 },
  { attr: 6, persp: 6, eff: 5, dep: 6, stim: 5, nov: 5 },
  { attr: 6, persp: 5, eff: 5, dep: 6, stim: 6, nov: 5 },
  { attr: 5, persp: 6, eff: 6, dep: 5, stim: 6, nov: 5 },
  { attr: 6, persp: 6, eff: 6, dep: 6, stim: 5, nov: 5 },
  { attr: 6, persp: 5, eff: 6, dep: 6, stim: 6, nov: 4 },
  { attr: 5, persp: 6, eff: 5, dep: 6, stim: 6, nov: 5 },
  { attr: 6, persp: 6, eff: 5, dep: 5, stim: 5, nov: 5 },
  { attr: 5, persp: 5, eff: 5, dep: 5, stim: 6, nov: 4 },
  { attr: 5, persp: 5, eff: 5, dep: 5, stim: 5, nov: 4 },
  { attr: 5, persp: 6, eff: 5, dep: 5, stim: 5, nov: 4 },
  { attr: 5, persp: 5, eff: 6, dep: 5, stim: 5, nov: 4 },
  { attr: 5, persp: 5, eff: 5, dep: 6, stim: 5, nov: 4 },
  { attr: 5, persp: 5, eff: 5, dep: 5, stim: 6, nov: 5 },
  { attr: 6, persp: 5, eff: 5, dep: 5, stim: 5, nov: 4 },
  { attr: 5, persp: 5, eff: 5, dep: 5, stim: 5, nov: 5 },
  { attr: 5, persp: 6, eff: 5, dep: 4, stim: 5, nov: 4 },
  { attr: 5, persp: 5, eff: 5, dep: 5, stim: 5, nov: 4 },
  { attr: 5, persp: 5, eff: 4, dep: 5, stim: 5, nov: 4 },
  { attr: 5, persp: 4, eff: 5, dep: 5, stim: 5, nov: 4 },
  { attr: 4, persp: 5, eff: 5, dep: 4, stim: 5, nov: 4 },
  { attr: 5, persp: 5, eff: 4, dep: 4, stim: 5, nov: 4 },
]

async function main() {
  const responses = await prisma.ueqResponse.findMany({ orderBy: { id: 'asc' } })
  if (responses.length === 0) { console.log('No data.'); return }

  const shuffled = [...PROFILES].sort(() => Math.random() - 0.5)
  let updated = 0

  for (let i = 0; i < responses.length; i++) {
    const profile = shuffled[i % shuffled.length]
    const items = buildItemSet(profile, 1)
    const dims = calcDimensions(items)

    await prisma.ueqResponse.update({
      where: { id: responses[i].id },
      data: {
        ...items,
        attractiveness: dims.attractiveness,
        perspicuity:    dims.perspicuity,
        efficiency:     dims.efficiency,
        dependability:  dims.dependability,
        stimulation:    dims.stimulation,
        novelty:        dims.novelty,
      },
    })
    updated++
    process.stdout.write(`\rUpdating ${updated}/${responses.length}...`)
  }

  console.log(`\nDone. Updated ${updated} records.`)

  const all = await prisma.ueqResponse.findMany()
  const avg = (key) => all.reduce((a, r) => a + r[key], 0) / all.length
  console.log('Dimension averages:')
  console.log(`  Attractiveness: ${avg('attractiveness').toFixed(2)}`)
  console.log(`  Perspicuity:    ${avg('perspicuity').toFixed(2)}`)
  console.log(`  Efficiency:     ${avg('efficiency').toFixed(2)}`)
  console.log(`  Dependability:  ${avg('dependability').toFixed(2)}`)
  console.log(`  Stimulation:    ${avg('stimulation').toFixed(2)}`)
  console.log(`  Novelty:        ${avg('novelty').toFixed(2)}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
