import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { courseById } from '../../data/hostCourses.js'
import { computeMatch } from '../../lib/matching.js'
import { REQUIRED_DOCUMENTS } from '../../data/documents.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfidenceBadge from '../../components/ui/ConfidenceBadge.jsx'

export default function StudentPlanPage({ onNavigate }) {
  const { draftPlan, toggleCourse, toggleDocument, submitStudyPlan, currentStudentCase } = useAppData()

  const selectedCourses = useMemo(
    () => draftPlan.courseIds.map((id) => courseById(id)).filter(Boolean),
    [draftPlan.courseIds],
  )

  const docsComplete = REQUIRED_DOCUMENTS.every((doc) => draftPlan.documents[doc.id])
  const hasCourses = selectedCourses.length > 0
  const canSubmit = hasCourses && docsComplete && !currentStudentCase

  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.rmit.creditPoints, 0)

  if (currentStudentCase) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">Study plan</h1>
          <p className="mt-1 text-sm text-paper-500">Your study plan has been submitted and is now locked.</p>
        </div>
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-sm text-paper-600">
            You submitted {currentStudentCase.courseIds.length} course{currentStudentCase.courseIds.length === 1 ? '' : 's'} for
            review on {currentStudentCase.submittedDate}.
          </p>
          <Button onClick={() => onNavigate('status')}>View application status</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Build your study plan</h1>
        <p className="mt-1 text-sm text-paper-500">
          Review your selected courses, attach the required documents, then submit for staff review.
        </p>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-paper-900">
            Selected courses ({selectedCourses.length})
          </h2>
          {hasCourses && <p className="text-xs text-paper-500">{totalCredits} RMIT credit points total</p>}
        </div>

        {!hasCourses ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-paper-300 p-6">
            <p className="text-sm text-paper-500">No courses selected yet.</p>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('search')}>
              Find courses
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-paper-100">
            {selectedCourses.map((course) => {
              const match = computeMatch(course)
              return (
                <li key={course.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-paper-900">{course.hostCourseTitle}</p>
                    <p className="text-xs text-paper-500">
                      {course.hostInstitution} · maps to {course.rmit.code} ({course.rmit.creditPoints}cp)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ConfidenceBadge confidence={match.confidence} showLabel={false} />
                    <button
                      className="text-xs font-medium text-clay-600 hover:text-clay-700"
                      onClick={() => toggleCourse(course.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="mb-1 text-sm font-semibold text-paper-900">Required documents</h2>
        <p className="mb-4 text-xs text-paper-500">
          All items must be attached before you can submit your study plan.
        </p>
        <ul className="flex flex-col divide-y divide-paper-100">
          {REQUIRED_DOCUMENTS.map((doc) => {
            const checked = Boolean(draftPlan.documents[doc.id])
            return (
              <li key={doc.id} className="flex items-start gap-3 py-3">
                <button
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleDocument(doc.id)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    checked ? 'border-sage-600 bg-sage-600 text-white' : 'border-paper-300 bg-white'
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium text-paper-800">{doc.label}</p>
                  <p className="text-xs text-paper-500">{doc.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-paper-600">
          {!hasCourses && <p>Add at least one course to your plan to continue.</p>}
          {hasCourses && !docsComplete && (
            <p>
              {REQUIRED_DOCUMENTS.filter((d) => !draftPlan.documents[d.id]).length} document(s) still required
              before you can submit.
            </p>
          )}
          {hasCourses && docsComplete && <p className="text-sage-700">Ready to submit for review.</p>}
        </div>
        <Button
          disabled={!canSubmit}
          onClick={() => {
            submitStudyPlan()
            onNavigate('status')
          }}
        >
          Submit study plan
        </Button>
      </Card>
    </div>
  )
}
