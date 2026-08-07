import Badge from './ui/Badge.jsx'

const TONE = { likely: 'high', possible: 'medium', uncommon: 'low' }

export default function CombinationPrecedentBadge({ precedent }) {
  return <Badge tone={TONE[precedent.tier]}>Combination: {precedent.label}</Badge>
}
