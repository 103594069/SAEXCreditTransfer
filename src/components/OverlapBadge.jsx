import Badge from './ui/Badge.jsx'

const TONE = { strong: 'high', moderate: 'medium', weak: 'low' }

export default function OverlapBadge({ overlap }) {
  return (
    <Badge tone={TONE[overlap.tier]}>
      Content overlap: {overlap.matchedTopics.length}/{overlap.totalTopics} topics
    </Badge>
  )
}
