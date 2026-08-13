import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { loadById } from '../../data/semesterLoads.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { scoreCourse } from '../../lib/courseScoring.js'
import { classifyCourseForStudent } from '../../lib/substituteMapping.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import CourseScorePanel from '../../components/CourseScorePanel.jsx'
import PreliminaryBanner from '../../components/PreliminaryBanner.jsx'

export default function InstitutionDetailPage({ loadId, onBack, onNavigate }) {
  const { currentStudent, precedents, shortlistDraft, selectLoad, currentStudentApplication, currentStudentEligibility } =
    useAppData()

  const load = loadById(loadId)
  const institution = load ? institutionById(load.institutionId) : null
  const courses = useMemo(
    () => (load ? load.partnerCourseIds.map((id) => partnerCourseById(id)) : []),
    [load],
  )

  if (!load || !institution) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={onBack} className="w-fit text-sm text-brand-700 hover:underline">
          ← Back to recommendations
        </button>
        <Card className="p-8 text-center text-sm text-paper-500">Institution not found.</Card>
      </div>
    )
  }

  const totalCredits = courses.length * 12
  const isShortlisted = shortlistDraft.loadId === load.id
  const locked = Boolean(currentStudentApplication)

  return (
    <div className="flex flex-col gap-6">
      {currentStudentEligibility?.overallStatus === 'On Track' && <PreliminaryBanner />}

      <button onClick={onBack} className="w-fit text-sm text-brand-700 hover:underline">
        ← Back to recommendations
      </button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">{institution.name}</h1>
          <p className="text-sm text-paper-500">{institution.country}</p>
        </div>
        <Badge tone="neutral">Full semester load · {courses.length} courses · {totalCredits} RMIT credit points</Badge>
      </div>

      <Card className="border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
        Partner institutions are shortlisted as a complete semester load — you can't shortlist individual courses.
      </Card>

      <div className="flex flex-col gap-4">
        {courses.map((course) => {
          const classification = classifyCourseForStudent(course, currentStudent)
          const score = scoreCourse(course, precedents, classification.mappedUnitId)
          return (
            <Card key={course.id} className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-paper-900">{course.hostCourseTitle}</p>
                  <p className="text-xs text-paper-500">
                    {course.hostCourseCode} · {course.hostCredits}
                  </p>
                  <p className="mt-1 text-xs text-paper-600">
                    Maps to <span className="font-medium">{score.rmitUnit.code} — {score.rmitUnit.title}</span> (
                    {score.rmitUnit.creditPoints}cp)
                  </p>
                </div>
                {classification.state === 'direct-match' && <Badge tone="brand">Matches a remaining unit</Badge>}
                {classification.state === 'substitute-candidate' && (
                  <Badge tone="medium">
                    Possible substitute — {classification.overlap.matchedTopics.length}/
                    {classification.overlap.totalTopics} topics match
                  </Badge>
                )}
              </div>
              <CourseScorePanel score={score} />
            </Card>
          )
        })}
      </div>

      <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-paper-600">
          {locked
            ? 'Your current application is already submitted — resolve it before shortlisting a new institution.'
            : isShortlisted
              ? 'This institution is your shortlisted load.'
              : 'Shortlist this institution to proceed to submission.'}
        </p>
        <Button
          disabled={locked}
          variant={isShortlisted ? 'secondary' : 'primary'}
          onClick={() => {
            selectLoad(load.id)
            onNavigate('submit')
          }}
        >
          {isShortlisted ? 'View shortlist' : 'Shortlist this institution'}
        </Button>
      </Card>
    </div>
  )
}
