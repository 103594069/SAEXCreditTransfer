import { partnerCourseById } from '../data/partnerCourses.js'
import { rmitUnitById } from '../data/rmitUnits.js'
import Card from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'

// Shows all courses in an application together for context — the shared
// application stage is displayed once elsewhere on the page, never
// repeated per course here. `renderStatus(course)` lets callers show
// whatever's appropriate for their role (e.g. staff show a reviewed tag,
// assessors show a decision badge only once Decision Pending).
export default function FullShortlistPanel({ application, currentCourseId, onOpenCourse, renderStatus, institutionName }) {
  return (
    <Card className="p-5">
      <h2 className="mb-1 text-sm font-semibold text-paper-900">Full shortlist</h2>
      <p className="mb-3 text-xs text-paper-500">
        All {application.courses.length} courses submitted together in this application — shown for context only.
        Each is still reviewed and decided individually.
      </p>
      <div className="flex flex-col gap-2.5">
        {application.courses.map((c) => {
          const isCurrent = c.id === currentCourseId
          const partnerCourse = partnerCourseById(c.partnerCourseId)
          const unit = rmitUnitById(c.rmitUnitId)
          const content = (
            <div className="flex flex-1 items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-paper-900">{partnerCourse.hostCourseTitle}</p>
                  {isCurrent && <Badge tone="brand">You are here</Badge>}
                  {c.isSubstituteMapping && <Badge tone="medium">Substitute mapping</Badge>}
                </div>
                <p className="text-xs text-paper-500">
                  {institutionName} · maps to {unit.code} — {unit.title}
                </p>
              </div>
              {renderStatus(c)}
            </div>
          )
          return isCurrent ? (
            <div key={c.id} className="rounded-lg border-2 border-brand-300 bg-brand-50/50 p-3">
              {content}
            </div>
          ) : (
            <button
              key={c.id}
              onClick={() => onOpenCourse?.(application.id, c.id)}
              className="rounded-lg border border-paper-200 bg-white p-3 text-left transition-colors hover:border-brand-200 hover:bg-paper-50"
            >
              {content}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
