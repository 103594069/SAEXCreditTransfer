import { useState } from 'react'
import { useAppData, CURRENT_YEAR } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { programName } from '../../data/programs.js'
import { degreeStructureFor } from '../../data/degreeStructures.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { scoreCourse } from '../../lib/courseScoring.js'
import { STAGE_TONE } from '../../lib/stageTone.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import CourseScorePanel from '../../components/CourseScorePanel.jsx'
import CourseStageStepper from '../../components/CourseStageStepper.jsx'

export default function AssessorCourseDetailPage({ applicationId, courseId, onBack, onOpenCourse }) {
  const { applications, precedents, decideCourse } = useAppData()
  const [note, setNote] = useState('')
  const [justDecided, setJustDecided] = useState(null)
  const [precedentCountAtDecision, setPrecedentCountAtDecision] = useState(null)

  const application = applications.find((a) => a.id === applicationId)
  const course = application?.courses.find((c) => c.id === courseId)

  if (!application || !course) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={onBack} className="w-fit text-sm text-brand-700 hover:underline">
          ← Back to queue
        </button>
        <Card className="p-8 text-center text-sm text-paper-500">Course not found.</Card>
      </div>
    )
  }

  const student = studentById(application.studentId)
  const structure = student ? degreeStructureFor(student.programId) : null
  const institution = institutionById(application.institutionId)
  const partnerCourse = partnerCourseById(course.partnerCourseId)
  const unit = rmitUnitById(course.rmitUnitId)
  const score = scoreCourse(partnerCourse, precedents)
  const canDecide = course.stage === 'With Assessor'

  const precedentPrior = precedents.filter((p) => p.partnerCourseId === course.partnerCourseId).length

  function handleDecide(decision) {
    setPrecedentCountAtDecision(precedentPrior)
    decideCourse(applicationId, courseId, decision, note)
    setJustDecided(decision)
  }

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onBack} className="w-fit text-sm text-brand-700 hover:underline">
        ← Back to queue
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">{partnerCourse.hostCourseTitle}</h1>
          <p className="text-sm text-paper-500">
            {institution?.name} · {partnerCourse.hostCourseCode} · maps to {unit.code} — {unit.title}
          </p>
          <p className="mt-1 text-xs text-paper-500">
            {student?.name} ({student?.studentId}) · {programName(student?.programId)}
            {structure && ` · Semester ${student.currentSemester} of ${structure.totalSemesters}`}
          </p>
        </div>
        <Badge tone="neutral">{course.stage}</Badge>
      </div>

      <Card className="p-5">
        <h2 className="mb-1 text-sm font-semibold text-paper-900">Full shortlist</h2>
        <p className="mb-3 text-xs text-paper-500">
          All {application.courses.length} courses submitted together in this application — shown for context only.
          Each is still decided individually.
        </p>
        <div className="flex flex-col gap-2.5">
          {application.courses.map((c) => {
            const isCurrent = c.id === course.id
            const cPartnerCourse = partnerCourseById(c.partnerCourseId)
            const cUnit = rmitUnitById(c.rmitUnitId)
            const content = (
              <div className="flex flex-1 items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-paper-900">{cPartnerCourse.hostCourseTitle}</p>
                    {isCurrent && <Badge tone="brand">You are here</Badge>}
                  </div>
                  <p className="text-xs text-paper-500">
                    {institution?.name} · maps to {cUnit.code} — {cUnit.title}
                  </p>
                </div>
                <Badge tone={STAGE_TONE[c.stage]}>{c.stage}</Badge>
              </div>
            )
            return isCurrent ? (
              <div key={c.id} className="rounded-lg border-2 border-brand-300 bg-brand-50/50 p-3">
                {content}
              </div>
            ) : (
              <button
                key={c.id}
                onClick={() => onOpenCourse?.(applicationId, c.id)}
                className="rounded-lg border border-paper-200 bg-white p-3 text-left transition-colors hover:border-brand-200 hover:bg-paper-50"
              >
                {content}
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="p-6">
        <CourseStageStepper course={course} />
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">Context flags</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2 rounded-lg bg-paper-50 p-3 text-sm">
            <Badge tone={unit.accreditationType === 'Accredited' ? 'brand' : 'neutral'}>
              {unit.accreditationType}
            </Badge>
            <p className="text-paper-600">
              {unit.accreditationType === 'Accredited'
                ? 'This unit sits within the core accredited curriculum — mismatches carry accreditation risk.'
                : 'This is a general elective — lower stakes if the content match is imperfect.'}
            </p>
          </div>
          {score.precedent.recencyCaution && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm">
              <Badge tone="medium">Recency caution</Badge>
              <p className="text-amber-800">
                Most recent precedent is from {score.precedent.mostRecentYear} ({CURRENT_YEAR - score.precedent.mostRecentYear}{' '}
                years ago) — verify the host course hasn't materially changed since.
              </p>
            </div>
          )}
          {score.precedent.count === 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-clay-50 p-3 text-sm">
              <Badge tone="low">No precedent</Badge>
              <p className="text-clay-700">
                No prior students have taken this course for credit — this would be a first-of-kind assessment.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">Match explanation</h2>
        <CourseScorePanel score={score} />
        <p className="mt-3 text-xs text-paper-400">
          Precedent dataset currently references this course {precedentPrior} time{precedentPrior === 1 ? '' : 's'}.
        </p>
      </Card>

      {course.staffNote && (
        <Card className="border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
          <p className="font-medium">Staff note</p>
          <p className="mt-1 text-brand-700">{course.staffNote}</p>
        </Card>
      )}

      {course.assessorNote && !canDecide && (
        <Card className="p-4 text-sm text-paper-700">
          <p className="font-medium text-paper-900">Assessor note</p>
          <p className="mt-1">{course.assessorNote}</p>
        </Card>
      )}

      {canDecide && (
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold text-paper-900">Decision</h2>
          <p className="mb-3 text-sm text-paper-500">
            Decide this course on its own — never as part of a bundled decision for the whole application.
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reasoning for the student's record (required for Deny / Request More Info)…"
            rows={3}
            className="mb-4 w-full rounded-lg border border-paper-300 bg-white px-3 py-2 text-sm text-paper-800 placeholder:text-paper-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="success" onClick={() => handleDecide('Approved')}>
              Approve
            </Button>
            <Button variant="danger" disabled={!note.trim()} onClick={() => handleDecide('Denied')}>
              Deny
            </Button>
            <Button variant="secondary" disabled={!note.trim()} onClick={() => handleDecide('More Info Requested')}>
              Request more info
            </Button>
          </div>
        </Card>
      )}

      {justDecided === 'Approved' && (
        <Card className="border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">
          Precedent dataset updated — this course is now referenced by {precedentCountAtDecision + 1} past outcome
          {precedentCountAtDecision + 1 === 1 ? '' : 's'}, which future recommendation and precedent scores will
          reflect.
        </Card>
      )}
    </div>
  )
}
