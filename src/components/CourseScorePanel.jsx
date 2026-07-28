import PrecedentBadge from './PrecedentBadge.jsx'
import OverlapBadge from './OverlapBadge.jsx'

export default function CourseScorePanel({ score }) {
  const { precedent, overlap } = score
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-paper-200 bg-paper-50 p-3">
        <PrecedentBadge precedent={precedent} />
        <p className="mt-1.5 text-xs text-paper-500">{precedent.note}</p>
      </div>
      <div className="rounded-lg border border-paper-200 bg-paper-50 p-3">
        <OverlapBadge overlap={overlap} />
        <p className="mt-1.5 text-xs text-paper-500">{overlap.note}</p>
      </div>
    </div>
  )
}
