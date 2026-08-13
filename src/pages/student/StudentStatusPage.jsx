import { useAppData } from '../../context/AppDataContext.jsx'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { DECISION_TONE } from '../../lib/stageTone.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ApplicationStageStepper from '../../components/ApplicationStageStepper.jsx'
import PreliminaryBanner from '../../components/PreliminaryBanner.jsx'

export default function StudentStatusPage({ onNavigate }) {
  const { currentStudentApplication, currentStudentEligibility } = useAppData()
  const showPreliminaryBanner = currentStudentEligibility?.overallStatus === 'On Track'

  if (!currentStudentApplication) {
    return (
      <div className="flex flex-col gap-6">
        {showPreliminaryBanner && <PreliminaryBanner />}
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

  const application = currentStudentApplication
  const institution = institutionById(application.institutionId)
  const atDecisionStage = application.stage === 'Decision Pending'

  return (
    <div className="flex flex-col gap-6">
      {showPreliminaryBanner && <PreliminaryBanner />}
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">My application</h1>
        <p className="mt-1 text-sm text-paper-500">
          {institution?.name} · submitted {application.submittedDate}
        </p>
      </div>

      <Card className="p-6">
        <ApplicationStageStepper application={application} />
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">Courses in this application</h2>
        <ul className="flex flex-col divide-y divide-paper-100">
          {application.courses.map((c) => {
            const partnerCourse = partnerCourseById(c.partnerCourseId)
            const unit = rmitUnitById(c.rmitUnitId)
            const decisionLabel = atDecisionStage ? (c.decision ?? 'Awaiting Decision') : null
            return (
              <li key={c.id} className="flex flex-col gap-3 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-paper-900">{partnerCourse.hostCourseTitle}</p>
                      {c.isSubstituteMapping && <Badge tone="medium">Substitute mapping</Badge>}
                    </div>
                    <p className="text-xs text-paper-500">
                      maps to {unit.code} — {unit.title} ({unit.creditPoints}cp)
                    </p>
                  </div>
                  {decisionLabel && <Badge tone={DECISION_TONE[decisionLabel]}>{decisionLabel}</Badge>}
                </div>
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
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
