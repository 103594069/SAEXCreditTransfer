import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { scoreCourse } from '../../lib/courseScoring.js'
import { APPLICATION_STAGE_TONE } from '../../lib/stageTone.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import PrecedentBadge from '../../components/PrecedentBadge.jsx'
import OverlapBadge from '../../components/OverlapBadge.jsx'

export default function StaffQueuePage({ onOpenCourse }) {
  const { applications, precedents } = useAppData()

  const queue = useMemo(
    () => applications.filter((app) => app.stage === 'Submitted' || app.stage === 'With Staff'),
    [applications],
  )

  const submittedCount = queue.filter((app) => app.stage === 'Submitted').length
  const inProgressCount = queue.filter((app) => app.stage === 'With Staff').length

  function openApplication(app) {
    const target = app.courses.find((c) => !c.staffReviewed) ?? app.courses[0]
    onOpenCourse(app.id, target.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Review queue</h1>
        <p className="mt-1 text-sm text-paper-500">
          Submitted shortlists awaiting staff review. Each course is still reviewed individually, but the
          application only moves to the assessor once all of them are.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">New submissions</p>
          <p className="mt-1 text-2xl font-semibold text-paper-900">{submittedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">In progress</p>
          <p className="mt-1 text-2xl font-semibold text-brand-700">{inProgressCount}</p>
        </Card>
      </div>

      {queue.length === 0 ? (
        <Card className="p-8 text-center text-sm text-paper-500">Queue is empty — nothing awaiting review.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((app) => {
            const student = studentById(app.studentId)
            const institution = institutionById(app.institutionId)
            const reviewedCount = app.courses.filter((c) => c.staffReviewed).length
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
                      {institution?.name} · {reviewedCount} of {app.courses.length} courses reviewed
                    </p>
                  </div>
                  <Button size="sm" onClick={() => openApplication(app)}>
                    Review application
                  </Button>
                </div>

                <ul className="flex flex-col divide-y divide-paper-100">
                  {app.courses.map((c) => {
                    const partnerCourse = partnerCourseById(c.partnerCourseId)
                    const unit = rmitUnitById(c.rmitUnitId)
                    const score = scoreCourse(partnerCourse, precedents)
                    return (
                      <li key={c.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-paper-800">
                            {partnerCourse.hostCourseTitle} <span className="text-paper-400">→</span> {unit.code}
                          </p>
                          {c.staffReviewed && <p className="text-xs text-sage-700">Reviewed</p>}
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
