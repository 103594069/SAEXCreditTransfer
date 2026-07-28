import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { scoreCourse } from '../../lib/courseScoring.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import PrecedentBadge from '../../components/PrecedentBadge.jsx'
import OverlapBadge from '../../components/OverlapBadge.jsx'

export default function AssessorQueuePage({ onOpenCourse }) {
  const { applications, precedents } = useAppData()

  const queue = useMemo(() => {
    const rows = []
    for (const app of applications) {
      for (const c of app.courses) {
        if (c.stage === 'With Assessor') rows.push({ application: app, course: c })
      }
    }
    return rows
  }, [applications])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Assessor queue</h1>
        <p className="mt-1 text-sm text-paper-500">
          Courses forwarded by staff, awaiting an individual approve / deny / more-info decision.
        </p>
      </div>

      <Card className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Awaiting decision</p>
        <p className="mt-1 text-2xl font-semibold text-paper-900">{queue.length}</p>
      </Card>

      {queue.length === 0 ? (
        <Card className="p-8 text-center text-sm text-paper-500">
          Nothing forwarded from staff yet — courses only appear here once staff review is complete.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map(({ application, course: c }) => {
            const student = studentById(application.studentId)
            const institution = institutionById(application.institutionId)
            const partnerCourse = partnerCourseById(c.partnerCourseId)
            const unit = rmitUnitById(c.rmitUnitId)
            const score = scoreCourse(partnerCourse, precedents)
            return (
              <Card key={c.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-paper-900">{student?.name}</p>
                    <span className="text-xs text-paper-400">{student?.studentId}</span>
                    <Badge tone={unit.accreditationType === 'Accredited' ? 'brand' : 'neutral'}>
                      {unit.accreditationType}
                    </Badge>
                  </div>
                  <p className="text-xs text-paper-500">
                    {institution?.name} · {partnerCourse.hostCourseTitle} → {unit.code}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <PrecedentBadge precedent={score.precedent} />
                    <OverlapBadge overlap={score.overlap} />
                  </div>
                </div>
                <Button size="sm" onClick={() => onOpenCourse(application.id, c.id)}>
                  Assess course
                </Button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
