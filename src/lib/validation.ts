import { z } from 'zod'

/**
 * Optional numeric id from HTML selects (`""` → null).
 * Avoids z.coerce.number() turning empty string into 0.
 */
export const optionalFormId = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return null
    const n = Number(val)
    return Number.isFinite(n) && n > 0 ? n : null
  },
  z.number().nullable().optional()
)
