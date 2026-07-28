import { useEffect, useState } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { programName } from '../../data/programs.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { REQUIRED_DOCUMENTS } from '../../data/documents.js'
import { scoreCourse } from '../../lib/courseScoring.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import CourseScorePanel from '../../components/CourseScorePanel.jsx'
import CourseStageStepper from '../../components/CourseStageStepper.jsx'

export default function StaffCourseDetailPage({ applicationId, courseId, onBack }) {
  const { applications, precedents, openCourseAsStaff, forwardCourseToAssessor } = useAppData()
  const [note, setNote] = useState('')

  const application = applications.find((a) => a.id === applicationId)
  const course = application?.courses.find((c) => c.id === courseId)

  useEffect(() => {
    if (course?.stage === 'Submitted') {
      openCourseAsStaff(applicationId, courseId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, courseId, course?.stage])

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
  const institution = institutionById(application.institutionId)
  const partnerCourse = partnerCourseById(course.partnerCourseId)
  const unit = rmitUnitById(course.rmitUnitId)
  const score = scoreCourse(partnerCourse, precedents)
  const documentsAttached = REQUIRED_DOCUMENTS.filter((d) => application.documents?.[d.id])
  const canForward = course.stage === 'With Staff' || course.stage === 'Submitted'

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
          </p>
        </div>
        <Badge tone="neutral">{course.stage}</Badge>
      </div>

      <Card className="p-6">
        <CourseStageStepper course={course} />
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">Match explanation</h2>
        <CourseScorePanel score={score} />
      </Card>

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

      {course.staffNote && (
        <Card className="border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
          <p className="font-medium">Staff note</p>
          <p className="mt-1 text-brand-700">{course.staffNote}</p>
        </Card>
      )}

      {course.assessorNote && (
        <Card className="p-4 text-sm text-paper-700">
          <p className="font-medium text-paper-900">Assessor note</p>
          <p className="mt-1">{course.assessorNote}</p>
        </Card>
      )}

      {canForward && (
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold text-paper-900">Forward to assessor</h2>
          <p className="mb-3 text-sm text-paper-500">
            Staff review each course individually — this course must be forwarded on its own before an assessor
            can act on it.
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note for the assessor…"
            rows={3}
            className="mb-4 w-full rounded-lg border border-paper-300 bg-white px-3 py-2 text-sm text-paper-800 placeholder:text-paper-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <Button onClick={() => forwardCourseToAssessor(applicationId, courseId, note)}>
            Forward this course to assessor
          </Button>
        </Card>
      )}
    </div>
  )
}
