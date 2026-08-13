import { curriculumForProgram, STANDARD_STRUCTURE } from './degreeStructures.js'

// Selectable demo identities for the mock login. There is no real
// authentication — logging in just sets which of these profiles is
// "current" for the session. `completedCourses` is the number of courses
// (in curriculum order) the student has finished — credit points, GPA
// pass/fail, and remaining units are all derived from it plus `gpa`.
//
// Deliberately reduced to exactly 3 students, each a specific, checkable
// demo case (see the comment above each):
export const STUDENTS = [
  // -- Student A — "Full precedent match": comfortably eligible on every
  // check, and every unit in the University of Toronto combination
  // (load-toronto-bp094) is still remaining — none completed, so every
  // course pill for that combination renders as a direct match, never
  // faded or substitute. Relies on the bp094 curriculum in
  // degreeStructures.js placing cosc1076/cosc2123/cosc2299/cosc2626 in
  // semester 5, after the 16 courses (192cp) this student has completed.
  {
    id: 'stu-amara',
    name: 'Amara Chen',
    studentId: 's3812004',
    programId: 'bp094',
    currentSemester: 5,
    completedCourses: 16,
    gpa: 3.7,
    email: 'amara.chen@student.rmit.edu.au',
  },

  // -- Student B — "Not yet eligible": 96cp completed (comfortably clears
  // the 72cp threshold on its own) but GPA of 1.8 is below the 2.0
  // minimum required by departure — the sole blocker, so overallStatus
  // resolves to "Needs Review" for a single, unambiguous reason.
  {
    id: 'stu-noah',
    name: 'Noah Bianchi',
    studentId: 's3899512',
    programId: 'bp217',
    currentSemester: 3,
    completedCourses: 8,
    gpa: 1.8,
    email: 'noah.bianchi@student.rmit.edu.au',
  },

  // -- Student C — "Substitute mapping case": eligible, and 3 of the 4
  // units in the Copenhagen Business School combination (load-cbs-bp250)
  // are still remaining (direct match) — but Marketing Principles
  // (ru-mktg1025), the 4th, is already completed. Its host course
  // (Fundamentals of Marketing) still overlaps meaningfully with Marketing
  // Analytics (ru-mktg2115), which is remaining, so it should classify as
  // a Substitute Candidate rather than Not Applicable.
  {
    id: 'stu-sienna',
    name: 'Sienna Park',
    studentId: 's3877391',
    programId: 'bp250',
    currentSemester: 2,
    completedCourses: 6,
    gpa: 3.3,
    email: 'sienna.park@student.rmit.edu.au',
  },
]

export function studentById(id) {
  return STUDENTS.find((s) => s.id === id)
}

export function creditPointsCompleted(student) {
  return student.completedCourses * 12
}

export function remainingCourses(student) {
  return curriculumForProgram(student.programId).slice(student.completedCourses)
}

export function creditPointsRemaining(student) {
  return STANDARD_STRUCTURE.totalCreditPoints - creditPointsCompleted(student)
}

// The subset of a student's remaining courses that also exist in the
// exchange-matching catalog (src/data/rmitUnits.js) — these are the units
// that can actually be shown as candidates on the recommendations page.
export function remainingUnitIds(student) {
  return remainingCourses(student)
    .filter((c) => c.rmitUnitId)
    .map((c) => c.rmitUnitId)
}
