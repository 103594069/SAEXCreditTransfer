import { courseById } from '../data/hostCourses.js'
import { computeMatch } from './matching.js'
import { studentById } from '../data/students.js'
import { programName } from '../data/programs.js'

export function caseCoursesWithMatch(studyCase) {
  return studyCase.courseIds
    .map((id) => courseById(id))
    .filter(Boolean)
    .map((course) => ({ course, match: computeMatch(course) }))
}

// The weakest matched course drives triage priority — a plan is only as
// safe to approve as its riskiest line item.
export function caseConfidence(studyCase) {
  const entries = caseCoursesWithMatch(studyCase)
  if (entries.length === 0) return 0
  return Math.min(...entries.map((e) => e.match.confidence))
}

export function caseHasStaleGuide(studyCase) {
  return caseCoursesWithMatch(studyCase).some(
    (e) => e.match.freshness.level === 'stale' || e.match.freshness.level === 'critical',
  )
}

export function buildContextPack(studyCase) {
  const student = studentById(studyCase.studentId)
  const entries = caseCoursesWithMatch(studyCase)
  const lines = [
    `Context pack — ${student?.name ?? 'Unknown student'} (${student?.studentId ?? '—'}), ${programName(student?.programId)}`,
    `Case ID: ${studyCase.id}`,
    '',
    ...entries.flatMap(({ course, match }) => [
      `Host course: ${course.hostCourseTitle}, ${course.hostInstitution} (${course.hostCredits})`,
      `Proposed RMIT equivalent: ${course.rmit.code} ${course.rmit.title} (${course.rmit.creditPoints}cp)`,
      `Match confidence: ${match.confidence}% — learning outcome overlap ${match.components.learningOutcomeOverlap}%, duration alignment ${match.components.durationAlignment}%, ${match.components.precedentStatus} precedent`,
      match.freshness.level !== 'fresh' ? `Flag: course guide ${match.freshness.label.toLowerCase()}.` : null,
      '',
    ].filter(Boolean)),
    'Sent for course coordinator review.',
  ]
  return lines.join('\n')
}
