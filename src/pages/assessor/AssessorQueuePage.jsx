import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { scoreCourse } from '../../lib/courseScoring.js'
import { APPLICATION_STAGE_TONE, DECISION_TONE } from '../../lib/stageTone.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import PrecedentBadge from '../../components/PrecedentBadge.jsx'
import OverlapBadge from '../../components/OverlapBadge.jsx'

export default function AssessorQueuePage({ onOpenCourse }) {
  const { applications, precedents } = useAppData()

  const queue = useMemo(
    () =>
      applications.filter(
        (app) =>
          app.stage === 'With Assessor' ||
          (app.stage === 'Decision Pending' && app.courses.some((c) => !c.decision)),
      ),
    [applications],
  )

  const reviewingCount = queue.filter((app) => app.stage === 'With Assessor').length
  const decidingCount = queue.filter((app) => app.stage === 'Decision Pending').length

  function openApplication(app) {
    const target =
      app.stage === 'Decision Pending'
        ? (app.courses.find((c) => !c.decision) ?? app.courses[0])
        : (app.courses.find((c) => !c.assessorReviewed) ?? app.courses[0])
    onOpenCourse(app.id, target.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Assessor queue</h1>
        <p className="mt-1 text-sm text-paper-500">
          Applications forwarded by staff. Each course is reviewed individually, and once every course in an
          application has been reviewed, its decisions become available — still one course at a time.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Being reviewed</p>
          <p className="mt-1 text-2xl font-semibold text-paper-900">{reviewingCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Decisions pending</p>
          <p className="mt-1 text-2xl font-semibold text-brand-700">{decidingCount}</p>
        </Card>
      </div>

      {queue.length === 0 ? (
        <Card className="p-8 text-center text-sm text-paper-500">
          Nothing forwarded from staff yet — applications only appear here once staff review is complete.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((app) => {
            const student = studentById(app.studentId)
            const institution = institutionById(app.institutionId)
            const reviewedCount = app.courses.filter((c) => c.assessorReviewed).length
            const decidedCount = app.courses.filter((c) => c.decision).length
            return (
              <Card key={app.id} className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-paper-900">{student?.name}</p>
                      <span className="text-xs text-paper-400">{student?.studentId}</span>
                      <Badge tone={APPLICATION_STAGE_TONE[app.stage]}>{app.stage}</Badge>
                    </div>
                    <p className="text-xs text-paper-500">
                      {institution?.name} ·{' '}
                      {app.stage === 'Decision Pending'
                        ? `${decidedCount} of ${app.courses.length} courses decided`
                        : `${reviewedCount} of ${app.courses.length} courses reviewed`}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => openApplication(app)}>
                    {app.stage === 'Decision Pending' ? 'Decide courses' : 'Assess application'}
                  </Button>
                </div>

                <ul className="flex flex-col divide-y divide-paper-100">
                  {app.courses.map((c) => {
                    const partnerCourse = partnerCourseById(c.partnerCourseId)
                    const unit = rmitUnitById(c.rmitUnitId)
                    const score = scoreCourse(partnerCourse, precedents)
                    const decisionLabel = c.decision ?? (app.stage === 'Decision Pending' ? 'Awaiting Decision' : null)
                    return (
                      <li key={c.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-paper-800">
                            {partnerCourse.hostCourseTitle} <span className="text-paper-400">→</span> {unit.code}
                          </p>
                          {decisionLabel && <Badge tone={DECISION_TONE[decisionLabel]}>{decisionLabel}</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <PrecedentBadge precedent={score.precedent} />
                          <OverlapBadge overlap={score.overlap} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
