// Fixed reference year so seeded precedent years always resolve to the same
// recency classification, regardless of when the demo runs.
export const REFERENCE_YEAR = 2026
const RECENCY_WINDOW_YEARS = 2

export const PRECEDENT_TIER_LABEL = {
  likely: 'Likely',
  possible: 'Possible',
  uncommon: 'Uncommon',
}

// Deliberately directional, not a fake-precise percentage — precedent is a
// count of past outcomes, not a probability model.
export function computePrecedentScore(partnerCourseId, precedents) {
  const matches = precedents.filter((p) => p.partnerCourseId === partnerCourseId)
  const count = matches.length
  const mostRecentYear = count > 0 ? Math.max(...matches.map((p) => p.year)) : null
  const isRecent = mostRecentYear !== null && REFERENCE_YEAR - mostRecentYear <= RECENCY_WINDOW_YEARS

  let tier
  if (count === 0) tier = 'uncommon'
  else if (count >= 3 && isRecent) tier = 'likely'
  else tier = 'possible'

  const note =
    count === 0
      ? 'No prior students have taken this course for credit.'
      : `Precedent: ${count} student${count === 1 ? '' : 's'}, most recent ${mostRecentYear}`

  return {
    tier,
    label: PRECEDENT_TIER_LABEL[tier],
    count,
    mostRecentYear,
    isRecent,
    note,
    // Surfaced separately in the assessor's context flags panel.
    recencyCaution: count > 0 && !isRecent,
  }
}
