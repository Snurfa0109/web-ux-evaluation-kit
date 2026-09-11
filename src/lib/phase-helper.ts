/**
 * Utility helper to compute dynamic effective phase status based on schedule dates
 */

export interface PhaseScheduleInput {
  id?: number
  status: string
  startDate?: Date | string | null
  endDate?: Date | string | null
}

export interface EffectivePhaseResult {
  effectiveStatus: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'CLOSED'
  isExpired: boolean
  isUpcoming: boolean
  scheduleMessage: string | null
}

export function computeEffectivePhaseStatus(phase: PhaseScheduleInput): EffectivePhaseResult {
  const now = new Date()

  // If phase is explicitly DRAFT, it remains DRAFT
  if (phase.status === 'DRAFT') {
    return {
      effectiveStatus: 'DRAFT',
      isExpired: false,
      isUpcoming: false,
      scheduleMessage: 'Draft (Belum dibuka oleh peneliti)',
    }
  }

  // Check endDate (Schedule expiration)
  if (phase.endDate) {
    const end = new Date(phase.endDate)
    // If the input date was just YYYY-MM-DD (hours/minutes/seconds are 0),
    // set to end of that calendar day 23:59:59.999 local time
    if (typeof phase.endDate === 'string' && phase.endDate.length <= 10) {
      const [y, m, d] = phase.endDate.split('-').map(Number)
      end.setFullYear(y, m - 1, d)
      end.setHours(23, 59, 59, 999)
    } else if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) {
      end.setHours(23, 59, 59, 999)
    }

    if (now.getTime() > end.getTime()) {
      return {
        effectiveStatus: 'CLOSED',
        isExpired: true,
        isUpcoming: false,
        scheduleMessage: `Selesai otomatis (Batas waktu ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} telah berakhir)`,
      }
    }
  }

  // Check startDate (Schedule upcoming)
  if (phase.startDate) {
    const start = new Date(phase.startDate)
    if (typeof phase.startDate === 'string' && phase.startDate.length <= 10) {
      const [y, m, d] = phase.startDate.split('-').map(Number)
      start.setFullYear(y, m - 1, d)
      start.setHours(0, 0, 0, 0)
    }

    if (now.getTime() < start.getTime()) {
      return {
        effectiveStatus: 'SCHEDULED',
        isExpired: false,
        isUpcoming: true,
        scheduleMessage: `Terjadwal (Akan aktif pada ${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})`,
      }
    }
  }

  // If manually CLOSED in database and no date contradiction
  if (phase.status === 'CLOSED') {
    return {
      effectiveStatus: 'CLOSED',
      isExpired: false,
      isUpcoming: false,
      scheduleMessage: 'Ditutup secara manual',
    }
  }

  // Otherwise, active
  return {
    effectiveStatus: 'ACTIVE',
    isExpired: false,
    isUpcoming: false,
    scheduleMessage: 'Aktif (Dapat dikerjakan)',
  }
}
