import { useAppData } from '../../context/AppDataContext.jsx'
import { programName } from '../../data/programs.js'
import { degreeStructureFor } from '../../data/degreeStructures.js'
import { creditPointsCompleted, creditPointsRemaining, remainingCourses } from '../../data/students.js'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import EligibilityCheckRow from '../../components/EligibilityCheckRow.jsx'

const OVERALL_TONE = { Eligible: 'high', 'On Track': 'medium', 'Needs Review': 'low' }

export default function ProfilePage({ onNavigate }) {
  const { currentStudent, currentStudentApplication, currentStudentEligibility: eligibility } = useAppData()

  if (!currentStudent || !eligibility) return null

  const structure = degreeStructureFor(currentStudent.programId)
  const completed = creditPointsCompleted(currentStudent)
  const remaining = creditPointsRemaining(currentStudent)
  const courses = remainingCourses(currentStudent)
  const coursesBySemester = courses.reduce((acc, c) => {
    ;(acc[c.semester] ??= []).push(c)
    return acc
  }, {})

  const hasApplication = Boolean(currentStudentApplication)
  const { overallStatus } = eligibility

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">{currentStudent.name}</h1>
          <p className="mt-1 text-sm text-paper-500">
            {programName(currentStudent.programId)} · Semester {currentStudent.currentSemester} of{' '}
            {structure.totalSemesters}
          </p>
        </div>
        <Badge tone={OVERALL_TONE[overallStatus]} className="text-sm">
          {overallStatus}
        </Badge>
      </div>

      <Card className="grid grid-cols-1 divide-y divide-paper-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">GPA</p>
          <p className={`mt-1 text-2xl font-semibold ${eligibility.gpa.pass ? 'text-sage-700' : 'text-clay-700'}`}>
            {currentStudent.gpa.toFixed(1)} <span className="text-sm font-normal text-paper-400">/ 4.0</span>
          </p>
          <p className="mt-0.5 text-xs text-paper-500">{eligibility.gpa.pass ? 'Above minimum' : 'Below minimum'}</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Credit points completed</p>
          <p className="mt-1 text-2xl font-semibold text-paper-900">{completed}cp</p>
          <p className="mt-0.5 text-xs text-paper-500">of {structure.totalCreditPoints}cp total</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Credit points remaining</p>
          <p className="mt-1 text-2xl font-semibold text-paper-900">{remaining}cp</p>
          <p className="mt-0.5 text-xs text-paper-500">{courses.length} courses remaining</p>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">Exchange eligibility</h2>
        <div className="flex flex-col gap-2.5">
          <EligibilityCheckRow
            state={eligibility.gpa.pass ? 'pass' : 'fail'}
            title={`GPA ${eligibility.gpa.pass ? 'meets' : 'is below'} the 2.0 minimum`}
            detail={`Current GPA ${eligibility.gpa.value.toFixed(1)}/4.0 — RMIT requires at least 2.0/4.0 by departure.`}
          />
          <EligibilityCheckRow
            state={
              eligibility.creditThreshold.status === 'met'
                ? 'pass'
                : eligibility.creditThreshold.status === 'projected'
                  ? 'warning'
                  : 'fail'
            }
            title={
              eligibility.creditThreshold.status === 'met'
                ? '72 credit point threshold already met'
                : eligibility.creditThreshold.status === 'projected'
                  ? '72 credit point threshold not yet met, but on track'
                  : '72 credit point threshold not on track'
            }
            detail={
              eligibility.creditThreshold.status === 'met'
                ? `${eligibility.creditThreshold.completed}cp completed — RMIT requires at least 72cp completed by departure (not by application).`
                : `${eligibility.creditThreshold.completed}cp completed now, projected ${eligibility.creditThreshold.projected}cp within two semesters. RMIT allows applying before reaching 72cp as long as you're on track to clear it before departure.`
            }
          />
          <EligibilityCheckRow
            state={eligibility.postExchange.pass ? 'pass' : 'fail'}
            title={
              eligibility.postExchange.pass
                ? 'Sufficient credit remains after exchange'
                : 'Credit shortfall after exchange'
            }
            detail={`${eligibility.postExchange.remainingBeforeExchange}cp remaining now − ${eligibility.postExchange.standardExchangeCredit}cp for a standard exchange semester = ${eligibility.postExchange.remainingAfterExchange}cp left. At least ${eligibility.postExchange.minimum}cp is required to retain OS-HELP loan eligibility.`}
          />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">
          Remaining units ({courses.length})
        </h2>
        <div className="flex flex-col gap-4">
          {Object.entries(coursesBySemester).map(([semester, semCourses]) => (
            <div key={semester}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-paper-400">Semester {semester}</p>
              <ul className="flex flex-col divide-y divide-paper-100">
                {semCourses.map((c) => (
                  <li key={c.code} className="flex items-center justify-between gap-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-paper-800">{c.title}</p>
                      <p className="text-xs text-paper-500">
                        {c.code} · {c.creditPoints}cp
                      </p>
                    </div>
                    {c.rmitUnitId && <Badge tone="brand">Exchange-eligible</Badge>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {courses.length === 0 && <p className="text-sm text-paper-500">All courses completed.</p>}
        </div>
      </Card>

      <Card className="p-6">
        {hasApplication ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-paper-600">You already have an exchange application in progress.</p>
            <Button onClick={() => onNavigate('status')}>View Exchange Application</Button>
          </div>
        ) : overallStatus === 'Needs Review' ? (
          <div className="flex flex-col gap-3">
            <Button disabled className="w-fit">
              Start Exchange Journey
            </Button>
            <div className="rounded-lg bg-clay-50 p-3.5 text-sm text-clay-700">
              <p className="font-medium">This is blocking your application:</p>
              <ul className="mt-1.5 list-disc pl-4">
                {eligibility.blockers.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : overallStatus === 'On Track' ? (
          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              className="w-fit border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
              onClick={() => onNavigate('recommendations')}
            >
              Start Exchange Journey (Preliminary)
            </Button>
            <p className="text-sm text-paper-500">
              You can begin exploring and shortlisting institutions now, but formal submission requires reaching 72
              credit points before departure.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button className="w-fit" onClick={() => onNavigate('recommendations')}>
              Start Exchange Journey
            </Button>
            <p className="text-sm text-sage-700">You meet all eligibility checks and can submit a full application.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
