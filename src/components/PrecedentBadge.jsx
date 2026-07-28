import Badge from './ui/Badge.jsx'

const TONE = { likely: 'high', possible: 'medium', uncommon: 'low' }

export default function PrecedentBadge({ precedent }) {
  return <Badge tone={TONE[precedent.tier]}>Precedent: {precedent.label}</Badge>
}
