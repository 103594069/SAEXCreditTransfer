import { rmitUnitById } from '../data/rmitUnits.js'
import { computePrecedentScore } from './precedentScoring.js'
import { computeContentOverlap } from './contentOverlap.js'

// The two scores are computed independently and never blended into a
// single number — that separation is deliberate, not an oversight.
//
// `overrideUnitId` lets a substitute-mapped course be scored against its
// alternative unit instead of the partner course's static original
// mapping — precedent stays keyed to the partner course itself (it's
// already unit-agnostic), only the overlap calculation shifts.
export function scoreCourse(partnerCourse, precedents, overrideUnitId) {
  const rmitUnit = rmitUnitById(overrideUnitId ?? partnerCourse.rmitUnitId)
  return {
    rmitUnit,
    precedent: computePrecedentScore(partnerCourse.id, precedents),
    overlap: computeContentOverlap(rmitUnit, partnerCourse),
  }
}
