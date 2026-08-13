import { useMemo } from 'react'
import { useAppData, COURSE_STAGES, DECISION_STAGES } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { STAGE_TONE } from '../../lib/stageTone.js'

const ALL_STAGES = [...COURSE_STAGES, ...DECISION_STAGES]

export default function StatusBoardPage() {
  const { applications } = useAppData()

  const byStage = useMemo(() => {
    const map = Object.fromEntries(ALL_STAGES.map((s) => [s, []]))
    for (const app of applications) {
      for (const c of app.courses) {
        map[c.stage]?.push({ application: app, course: c })
      }
    }
    return map
  }, [applications])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Status board</h1>
        <p className="mt-1 text-sm text-paper-500">
          Shared, live view of every course in the pipeline — visible to students, staff, and assessors alike.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {ALL_STAGES.map((stage) => (
          <div key={stage} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-paper-800">{stage}</h2>
              <Badge tone={STAGE_TONE[stage]}>{byStage[stage].length}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {byStage[stage].length === 0 && (
                <p className="rounded-lg border border-dashed border-paper-300 p-3 text-center text-xs text-paper-400">
                  None
                </p>
              )}
              {byStage[stage].map(({ application, course: c }) => {
                const student = studentById(application.studentId)
                const institution = institutionById(application.institutionId)
                const partnerCourse = partnerCourseById(c.partnerCourseId)
                const unit = rmitUnitById(c.rmitUnitId)
                const lastUpdate = c.timeline[c.timeline.length - 1]
                return (
                  <Card key={c.id} className="flex flex-col gap-1.5 p-3.5">
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
