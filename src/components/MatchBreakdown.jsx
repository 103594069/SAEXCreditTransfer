import { PRECEDENT_LABELS } from '../lib/matching.js'
import Badge from './ui/Badge.jsx'

function ScoreBar({ label, value, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-paper-600">
        <span>{label}</span>
        <span className="font-medium tabular-nums text-paper-800">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-paper-200">
        <div
          className={`h-full rounded-full ${value >= 80 ? 'bg-sage-500' : value >= 60 ? 'bg-amber-400' : 'bg-clay-400'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {hint && <p className="mt-0.5 text-xs text-paper-400">{hint}</p>}
    </div>
  )
}

const FRESHNESS_TONE = { fresh: 'high', aging: 'medium', stale: 'low', critical: 'low' }

export default function MatchBreakdown({ course, match }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScoreBar label="Learning outcome overlap" value={match.components.learningOutcomeOverlap} />
        <ScoreBar label="Duration alignment" value={match.components.durationAlignment} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge tone={match.components.precedentStatus === 'approved' ? 'high' : match.components.precedentStatus === 'none' ? 'low' : 'medium'}>
          {PRECEDENT_LABELS[match.components.precedentStatus]}
        </Badge>
        <Badge tone={FRESHNESS_TONE[match.freshness.level]}>
          Course guide: {match.freshness.label} ({match.freshness.months} mo)
        </Badge>
      </div>

      {course && (
        <p className="text-xs text-paper-500">
          Precedent score contributes {match.precedentScore}% toward the weighted match; freshness applies a{' '}
          {match.freshness.penalty === 0 ? 'no' : `${match.freshness.penalty}pt`} adjustment.
        </p>
      )}
    </div>
  )
}
