// Deliberately simple: how many of the RMIT unit's listed topic keywords
// also appear in the partner course's topic list. No semantic matching.
export function computeContentOverlap(rmitUnit, partnerCourse) {
  const matchedTopics = rmitUnit.topics.filter((t) => partnerCourse.topics.includes(t))
  const totalTopics = rmitUnit.topics.length
  const fraction = totalTopics === 0 ? 0 : matchedTopics.length / totalTopics

  let tier
  if (fraction >= 0.75) tier = 'strong'
  else if (fraction >= 0.5) tier = 'moderate'
  else tier = 'weak'

  return {
    tier,
    matchedTopics,
    totalTopics,
    fraction,
    note: `Content overlap: ${matchedTopics.length} of ${totalTopics} key topics match`,
  }
}

export const OVERLAP_TIER_LABEL = {
  strong: 'Strong overlap',
  moderate: 'Moderate overlap',
  weak: 'Weak overlap',
}
