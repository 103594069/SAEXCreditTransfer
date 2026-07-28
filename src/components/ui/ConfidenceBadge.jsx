import Badge from './Badge.jsx'
import { confidenceTier } from '../../lib/matching.js'

export default function ConfidenceBadge({ confidence, showLabel = true }) {
  const { tier, label } = confidenceTier(confidence)
  return (
    <Badge tone={tier}>
      <span className="font-semibold tabular-nums">{confidence}%</span>
      {showLabel && <span>{label}</span>}
    </Badge>
  )
}
