import { rmitUnitById } from '../data/rmitUnits.js'
import { computePrecedentScore } from './precedentScoring.js'
import { computeContentOverlap } from './contentOverlap.js'

// The two scores are computed independently and never blended into a
// single number — that separation is deliberate, not an oversight.
export function scoreCourse(partnerCourse, precedents) {
  const rmitUnit = rmitUnitById(partnerCourse.rmitUnitId)
  return {
    rmitUnit,
    precedent: computePrecedentScore(partnerCourse.id, precedents),
    overlap: computeContentOverlap(rmitUnit, partnerCourse),
  }
}
