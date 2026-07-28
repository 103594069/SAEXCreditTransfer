// Fixed reference date so seeded "guide last verified" dates always resolve
// to the same freshness classification, regardless of when the demo runs.
export const REFERENCE_DATE = new Date('2026-07-28')

const PRECEDENT_SCORES = {
  approved: 95,
  partial: 78,
  none: 58,
  outdated: 62,
}

export const PRECEDENT_LABELS = {
  approved: 'Established precedent',
  partial: 'Partial precedent',
  none: 'No precedent on file',
  outdated: 'Precedent exists, course has changed',
}

export function monthsSince(dateStr) {
  const then = new Date(dateStr)
  return (
    (REFERENCE_DATE.getFullYear() - then.getFullYear()) * 12 +
    (REFERENCE_DATE.getMonth() - then.getMonth())
  )
}

export function guideFreshness(dateStr) {
  const months = monthsSince(dateStr)
  if (months >= 24) return { months, level: 'critical', penalty: -18, label: 'Not verified in 2+ years' }
  if (months >= 18) return { months, level: 'stale', penalty: -12, label: 'Not verified in 18+ months' }
  if (months >= 12) return { months, level: 'aging', penalty: -6, label: 'Not verified in 12+ months' }
  return { months, level: 'fresh', penalty: 0, label: 'Recently verified' }
}

export function computeMatch(course) {
  const precedentScore = PRECEDENT_SCORES[course.precedentStatus] ?? 58
  const freshness = guideFreshness(course.guideLastVerified)
  const base =
    0.4 * course.learningOutcomeOverlap +
    0.3 * course.durationAlignment +
    0.3 * precedentScore
  const confidence = Math.max(0, Math.min(100, Math.round(base + freshness.penalty)))
  return {
    confidence,
    precedentScore,
    freshness,
    components: {
      learningOutcomeOverlap: course.learningOutcomeOverlap,
      durationAlignment: course.durationAlignment,
      precedentScore,
      precedentStatus: course.precedentStatus,
    },
  }
}

export function confidenceTier(confidence) {
  if (confidence >= 80) return { tier: 'high', label: 'High confidence' }
  if (confidence >= 60) return { tier: 'medium', label: 'Medium confidence' }
  return { tier: 'low', label: 'Low confidence' }
}
