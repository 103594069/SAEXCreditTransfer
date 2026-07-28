import { useMemo, useState } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { programName } from '../../data/programs.js'
import { REQUIRED_DOCUMENTS } from '../../data/documents.js'
import { caseConfidence, caseCoursesWithMatch, caseHasStaleGuide } from '../../lib/caseHelpers.js'
import { confidenceTier } from '../../lib/matching.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ConfidenceBadge from '../../components/ui/ConfidenceBadge.jsx'
import MatchBreakdown from '../../components/MatchBreakdown.jsx'
import StageStepper from '../../components/StageStepper.jsx'

export default function StaffCasePage({ caseId, onBack }) {
  const { cases, approveCase, escalateCase, advanceCase } = useAppData()
  const [showContextPack, setShowContextPack] = useState(false)

  const studyCase = cases.find((c) => c.id === caseId)

  const confidence = useMemo(() => (studyCase ? caseConfidence(studyCase) : 0), [studyCase])
  const entries = useMemo(() => (studyCase ? caseCoursesWithMatch(studyCase) : []), [studyCase])
  const stale = studyCase ? caseHasStaleGuide(studyCase) : false

  if (!studyCase) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={onBack} className="w-fit text-sm text-brand-700 hover:underline">
          ← Back to queue
        </button>
        <Card className="p-8 text-center text-sm text-paper-500">Case not found.</Card>
      </div>
    )
  }

  const student = studentById(studyCase.studentId)
  const { tier } = confidenceTier(confidence)
  const isPending = studyCase.stage === 'Submitted'
  const documentsAttached = REQUIRED_DOCUMENTS.filter((d) => studyCase.documents?.[d.id])

  function handleApprove() {
    approveCase(studyCase.id)
  }

  function handleEscalate() {
    escalateCase(studyCase.id)
    setShowContextPack(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onBack} className="w-fit text-sm text-brand-700 hover:underline">
        ← Back to queue
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">{student?.name}</h1>
          <p className="text-sm text-paper-500">
            {student?.studentId} · {programName(student?.programId)} · {student?.yearLevel}
          </p>
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <Card className="p-6">
        <StageStepper studyCase={studyCase} />
      </Card>

      {stale && (
        <Card className="border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">Guide freshness flag</p>
          <p className="mt-1 text-amber-700">
            One or more course guides in this plan haven't been verified recently. Review the match details below
            before relying on the automated score.
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-paper-900">Course-by-course match explanation</h2>
        {entries.map(({ course, match }) => (
          <Card key={course.id} className="p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-paper-900">{course.hostCourseTitle}</p>
                <p className="text-xs text-paper-500">
                  {course.hostInstitution} · {course.hostCourseCode} · {course.hostCredits}
                </p>
                <p className="mt-1 text-xs text-paper-600">
                  Maps to <span className="font-medium">{course.rmit.code} — {course.rmit.title}</span> (
                  {course.rmit.creditPoints}cp)
                </p>
              </div>
              <ConfidenceBadge confidence={match.confidence} />
            </div>
            <MatchBreakdown course={course} match={match} />
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">Documents attached</h2>
        <ul className="flex flex-wrap gap-2">
          {documentsAttached.map((d) => (
            <Badge key={d.id} tone="neutral">
              {d.label}
            </Badge>
          ))}
        </ul>
      </Card>

      {studyCase.staffNote && (
        <Card className="border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
          <p className="font-medium">Staff note</p>
          <p className="mt-1 text-brand-700">{studyCase.staffNote}</p>
        </Card>
      )}

      {studyCase.contextPack && (
        <Card className="p-5">
          <h2 className="mb-2 text-sm font-semibold text-paper-900">Context pack sent to coordinator</h2>
          <pre className="whitespace-pre-wrap rounded-lg bg-paper-50 p-4 font-mono text-xs text-paper-700">
            {studyCase.contextPack}
          </pre>
        </Card>
      )}

      {isPending && (
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold text-paper-900">Decision</h2>
          <p className="mb-4 text-sm text-paper-500">
            {tier === 'low'
              ? 'Confidence is low — consider sending this case onward with a context pack for course coordinator input.'
              : tier === 'medium'
                ? 'Confidence is medium — approve if you\'re satisfied, or send onward for a second opinion.'
                : 'Confidence is high — this case is a strong candidate for one-click approval.'}
          </p>

          {showContextPack && (
            <div className="mb-4 rounded-lg border border-paper-200 bg-paper-50 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-paper-400">
                Context pack preview
              </p>
              <pre className="whitespace-pre-wrap font-mono text-xs text-paper-700">
                {entries
                  .map(
                    ({ course, match }) =>
                      `${course.hostCourseTitle} → ${course.rmit.code}: ${match.confidence}% confidence, ${match.components.precedentStatus} precedent`,
                  )
                  .join('\n')}
              </pre>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="success" onClick={handleApprove}>
              Approve in one click
            </Button>
            {showContextPack ? (
              <Button variant="secondary" onClick={handleEscalate}>
                Confirm & send with context pack
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setShowContextPack(true)}>
                Send onward with context pack
              </Button>
            )}
          </div>
        </Card>
      )}

      {!isPending && ['Approved', 'Enrolled'].includes(studyCase.stage) && (
        <Card className="flex items-center justify-between p-5">
          <p className="text-sm text-paper-500">
            Simulate the next milestone in this case's lifecycle for demo purposes.
          </p>
          <Button variant="secondary" size="sm" onClick={() => advanceCase(studyCase.id)}>
            Mark as {studyCase.stage === 'Approved' ? 'Enrolled' : 'Transcript Received'}
          </Button>
        </Card>
      )}
    </div>
  )
}
