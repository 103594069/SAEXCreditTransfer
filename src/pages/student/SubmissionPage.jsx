import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { loadById } from '../../data/semesterLoads.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { scoreCourse } from '../../lib/courseScoring.js'
import { REQUIRED_DOCUMENTS } from '../../data/documents.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import PrecedentBadge from '../../components/PrecedentBadge.jsx'
import OverlapBadge from '../../components/OverlapBadge.jsx'
import PreliminaryBanner from '../../components/PreliminaryBanner.jsx'

export default function SubmissionPage({ onNavigate }) {
  const {
    shortlistDraft,
    toggleDocument,
    clearShortlist,
    submitShortlist,
    currentStudentApplication,
    precedents,
    currentStudentEligibility,
  } = useAppData()
  const showPreliminaryBanner = currentStudentEligibility?.overallStatus === 'On Track'

  const load = shortlistDraft.loadId ? loadById(shortlistDraft.loadId) : null
  const institution = load ? institutionById(load.institutionId) : null
  const courses = useMemo(
    () => (load ? load.partnerCourseIds.map((id) => partnerCourseById(id)) : []),
    [load],
  )

  if (currentStudentApplication) {
    const appInstitution = institutionById(currentStudentApplication.institutionId)
    return (
      <div className="flex flex-col gap-6">
        {showPreliminaryBanner && <PreliminaryBanner />}
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">My shortlist</h1>
          <p className="mt-1 text-sm text-paper-500">Your shortlist has been submitted and is now locked.</p>
        </div>
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-sm text-paper-600">
            You submitted a full semester load at {appInstitution?.name} on {currentStudentApplication.submittedDate}
            .
          </p>
          <Button onClick={() => onNavigate('status')}>View application status</Button>
        </Card>
      </div>
    )
  }

  if (!load || !institution) {
    return (
      <div className="flex flex-col gap-6">
        {showPreliminaryBanner && <PreliminaryBanner />}
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">My shortlist</h1>
          <p className="mt-1 text-sm text-paper-500">
            You haven't shortlisted an institution yet — shortlisting is always a full semester load.
          </p>
        </div>
        <Card className="flex flex-col items-start gap-3 p-8">
          <Button onClick={() => onNavigate('recommendations')}>Browse recommended institutions</Button>
        </Card>
      </div>
    )
  }

  const docsComplete = REQUIRED_DOCUMENTS.every((doc) => shortlistDraft.documents[doc.id])
  const canSubmit = docsComplete

  return (
    <div className="flex flex-col gap-6">
      {showPreliminaryBanner && <PreliminaryBanner />}
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Review and submit your shortlist</h1>
        <p className="mt-1 text-sm text-paper-500">
          {institution.name} · full semester load · {courses.length} courses
        </p>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-paper-900">Proposed courses</h2>
          <button className="text-xs font-medium text-clay-600 hover:text-clay-700" onClick={clearShortlist}>
            Remove shortlist
          </button>
        </div>
        <ul className="flex flex-col divide-y divide-paper-100">
          {courses.map((course) => {
            const score = scoreCourse(course, precedents)
            const unit = rmitUnitById(course.rmitUnitId)
            return (
              <li key={course.id} className="flex flex-col gap-2 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-paper-900">{course.hostCourseTitle}</p>
                    <p className="text-xs text-paper-500">
                      maps to {unit.code} — {unit.title} ({unit.creditPoints}cp)
                    </p>
                  </div>
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

      <Card className="p-5">
        <h2 className="mb-1 text-sm font-semibold text-paper-900">Completeness checklist</h2>
        <p className="mb-4 text-xs text-paper-500">Every item must be checked before you can submit.</p>
        <ul className="flex flex-col divide-y divide-paper-100">
          <li className="flex items-start gap-3 py-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-sage-600 bg-sage-600 text-white">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-paper-800">Full semester load selected</p>
              <p className="text-xs text-paper-500">{courses.length} of {courses.length} courses proposed.</p>
            </div>
          </li>
          {REQUIRED_DOCUMENTS.map((doc) => {
            const checked = Boolean(shortlistDraft.documents[doc.id])
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
          {!docsComplete && (
            <p>
              {REQUIRED_DOCUMENTS.filter((d) => !shortlistDraft.documents[d.id]).length} document(s) still required
              before you can submit.
            </p>
          )}
          {docsComplete && <p className="text-sage-700">Ready to submit for review.</p>}
        </div>
        <Button
          disabled={!canSubmit}
          onClick={() => {
            submitShortlist()
            onNavigate('status')
          }}
        >
          Submit shortlist
        </Button>
      </Card>
    </div>
  )
}
