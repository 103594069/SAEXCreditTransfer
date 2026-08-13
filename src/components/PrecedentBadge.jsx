import Badge from './ui/Badge.jsx'

const TONE = { likely: 'high', possible: 'medium', uncommon: 'low' }

// `factual` swaps the directional Likely/Possible/Uncommon prediction for
// a plain record of whether this exact host-course-to-RMIT-unit mapping
// has prior approved precedent — used on assessor-facing screens, where
// the assessor is recording a fact rather than weighing a signal.
export default function PrecedentBadge({ precedent, factual = false }) {
  if (factual) {
    return precedent.count === 0 ? (
      <Badge tone="low">Precedent: No prior approval — first assessment of this mapping</Badge>
    ) : (
      <Badge tone="high">
        Precedent: Approved previously ({precedent.count} time{precedent.count === 1 ? '' : 's'}, most recent{' '}
        {precedent.mostRecentYear})
      </Badge>
    )
  }
  return <Badge tone={TONE[precedent.tier]}>Precedent: {precedent.label}</Badge>
}
