import { useAppData } from '../../context/AppDataContext.jsx'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import CourseStageStepper from '../../components/CourseStageStepper.jsx'

const DECISION_TONE = { Approved: 'high', Denied: 'low', 'More Info Requested': 'medium' }

export default function StudentStatusPage({ onNavigate }) {
  const { currentStudentApplication } = useAppData()

  if (!currentStudentApplication) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">My application</h1>
          <p className="mt-1 text-sm text-paper-500">Track your credit transfer application here once submitted.</p>
        </div>
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-sm text-paper-500">You haven't submitted a shortlist yet.</p>
          <Button onClick={() => onNavigate('recommendations')}>Find institutions to get started</Button>
        </Card>
      </div>
    )
  }

  const institution = institutionById(currentStudentApplication.institutionId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">My application</h1>
        <p className="mt-1 text-sm text-paper-500">
          {institution?.name} · submitted {currentStudentApplication.submittedDate}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {currentStudentApplication.courses.map((c) => {
          const partnerCourse = partnerCourseById(c.partnerCourseId)
          const unit = rmitUnitById(c.rmitUnitId)
          const isDecided = DECISION_TONE[c.stage]
          return (
            <Card key={c.id} className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-paper-900">{partnerCourse.hostCourseTitle}</p>
                  <p className="text-xs text-paper-500">
                    maps to {unit.code} — {unit.title} ({unit.creditPoints}cp)
                  </p>
                </div>
                {isDecided && <Badge tone={isDecided}>{c.stage}</Badge>}
              </div>
              <CourseStageStepper course={c} />
              {c.staffNote && (
                <div className="rounded-lg bg-paper-50 p-3 text-xs text-paper-600">
                  <span className="font-medium text-paper-700">Staff note: </span>
                  {c.staffNote}
                </div>
              )}
              {c.assessorNote && (
                <div className="rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
                  <span className="font-medium">Assessor note: </span>
                  {c.assessorNote}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
