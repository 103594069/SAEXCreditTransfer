import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { APPLICATION_STAGE_TONE, DECISION_TONE } from '../../lib/stageTone.js'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'

// The board mixes two granularities on purpose: while an application is
// still moving through Submitted / With Staff / With Assessor, all 4
// courses share one stage, so it shows as a single application card. Once
// an application reaches Decision Pending, each course gets its own
// independent outcome, so from that point on the board shows one card per
// course instead.
const APPLICATION_COLUMNS = ['Submitted', 'With Staff', 'With Assessor']
const DECISION_COLUMNS = ['Approved', 'Denied', 'More Info Requested', 'Awaiting Decision']
const ALL_COLUMNS = [...APPLICATION_COLUMNS, ...DECISION_COLUMNS]

export default function StatusBoardPage() {
  const { applications } = useAppData()

  const columns = useMemo(() => {
    const map = Object.fromEntries(ALL_COLUMNS.map((s) => [s, []]))
    for (const app of applications) {
      if (app.stage === 'Decision Pending') {
        for (const c of app.courses) {
          map[c.decision ?? 'Awaiting Decision'].push({ type: 'course', application: app, course: c })
        }
      } else {
        map[app.stage]?.push({ type: 'application', application: app })
      }
    }
    return map
  }, [applications])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Status board</h1>
        <p className="mt-1 text-sm text-paper-500">
          Shared, live view of every application in the pipeline — visible to students, staff, and assessors alike.
          Applications move as one unit; once decisions are pending, each course's outcome is tracked individually.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {ALL_COLUMNS.map((stage) => (
          <div key={stage} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-paper-800">{stage}</h2>
              <Badge tone={APPLICATION_STAGE_TONE[stage] ?? DECISION_TONE[stage]}>{columns[stage].length}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {columns[stage].length === 0 && (
                <p className="rounded-lg border border-dashed border-paper-300 p-3 text-center text-xs text-paper-400">
                  None
                </p>
              )}
              {columns[stage].map((entry) => {
                const student = studentById(entry.application.studentId)
                const institution = institutionById(entry.application.institutionId)
                if (entry.type === 'application') {
                  const lastUpdate = entry.application.timeline[entry.application.timeline.length - 1]
                  return (
                    <Card key={entry.application.id} className="flex flex-col gap-1.5 p-3.5">
                      <p className="text-sm font-medium text-paper-900">{student?.name}</p>
                      <p className="text-xs text-paper-500">{institution?.name}</p>
                      <p className="text-xs text-paper-500">{entry.application.courses.length} courses</p>
                      <p className="text-xs text-paper-400">{lastUpdate?.date}</p>
                    </Card>
                  )
                }
                const partnerCourse = partnerCourseById(entry.course.partnerCourseId)
                const unit = rmitUnitById(entry.course.rmitUnitId)
                const lastUpdate = entry.course.timeline[entry.course.timeline.length - 1]
                return (
                  <Card key={entry.course.id} className="flex flex-col gap-1.5 p-3.5">
                    <p className="text-sm font-medium text-paper-900">{student?.name}</p>
                    <p className="text-xs text-paper-500">{institution?.name}</p>
                    <p className="text-xs text-paper-500">
                      {partnerCourse.hostCourseTitle} → {unit.code}
                    </p>
                    <p className="text-xs text-paper-400">{lastUpdate?.date}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
