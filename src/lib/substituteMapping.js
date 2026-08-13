import { rmitUnitById } from '../data/rmitUnits.js'
import { remainingUnitIds } from '../data/students.js'
import { computeContentOverlap } from './contentOverlap.js'

// Same "meaningful overlap" bar used everywhere else content overlap is
// shown (OverlapBadge, CourseScorePanel) — strong or moderate counts,
// weak doesn't. Reused rather than reinvented for substitute matching.
const SUBSTITUTE_TIERS = new Set(['strong', 'moderate'])

// Classifies a host course for a specific student's remaining units:
// - direct-match: its originally-mapped unit is still remaining
// - substitute-candidate: that unit is done, but content overlaps well
//   enough with a different remaining unit to still be worth taking
// - not-applicable: done, and no remaining unit overlaps meaningfully
export function classifyCourseForStudent(partnerCourse, student) {
  const originalUnitId = partnerCourse.rmitUnitId
  const remaining = student ? remainingUnitIds(student) : []

  if (remaining.includes(originalUnitId)) {
    return {
      state: 'direct-match',
      mappedUnitId: originalUnitId,
      originalUnitId,
      overlap: computeContentOverlap(rmitUnitById(originalUnitId), partnerCourse),
    }
  }

  const candidates = remaining
    .filter((unitId) => unitId !== originalUnitId)
    .map((unitId) => ({ unitId, overlap: computeContentOverlap(rmitUnitById(unitId), partnerCourse) }))
    .filter((c) => SUBSTITUTE_TIERS.has(c.overlap.tier))
    .sort((a, b) => b.overlap.fraction - a.overlap.fraction)

  if (candidates.length > 0) {
    const best = candidates[0]
    return {
      state: 'substitute-candidate',
      mappedUnitId: best.unitId,
      originalUnitId,
      overlap: best.overlap,
    }
  }

  return {
    state: 'not-applicable',
    mappedUnitId: originalUnitId,
    originalUnitId,
    overlap: computeContentOverlap(rmitUnitById(originalUnitId), partnerCourse),
  }
}
