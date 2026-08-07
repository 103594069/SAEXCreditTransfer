import { curriculumForProgram, STANDARD_STRUCTURE } from './degreeStructures.js'

// Selectable demo identities for the mock login. There is no real
// authentication — logging in just sets which of these profiles is
// "current" for the session. `completedCourses` is the number of courses
// (in curriculum order) the student has finished — credit points, GPA
// pass/fail, and remaining units are all derived from it plus `gpa`.
export const STUDENTS = [
  // -- Cleanly eligible: Semester 4/5, two per degree, on standard pace --
  {
    id: 'stu-priya',
    name: 'Priya Nair',
    studentId: 's3891204',
    programId: 'bp094',
    currentSemester: 4,
    completedCourses: 12,
    gpa: 3.4,
    email: 'priya.nair@student.rmit.edu.au',
  },
  {
    id: 'stu-jack',
    name: 'Jack Osei',
    studentId: 's3801177',
    programId: 'bp094',
    currentSemester: 5,
    completedCourses: 16,
    gpa: 2.8,
    email: 'jack.osei@student.rmit.edu.au',
  },
  {
    id: 'stu-liam',
    name: 'Liam Cheung',
    studentId: 's3762211',
    programId: 'bp250',
    currentSemester: 4,
    completedCourses: 12,
    gpa: 3.6,
    email: 'liam.cheung@student.rmit.edu.au',
  },
  {
    id: 'stu-sofia',
    name: 'Sofia Ricci',
    studentId: 's3868803',
    programId: 'bp250',
    currentSemester: 5,
    completedCourses: 16,
    gpa: 3.1,
    email: 'sofia.ricci@student.rmit.edu.au',
  },
  {
    id: 'stu-grace',
    name: 'Grace Okafor',
    studentId: 's3892341',
    programId: 'bp217',
    currentSemester: 4,
    completedCourses: 12,
    gpa: 3.9,
    email: 'grace.okafor@student.rmit.edu.au',
  },
  {
    id: 'stu-mei',
    name: 'Mei Lin Tan',
    studentId: 's3855120',
    programId: 'bp217',
    currentSemester: 5,
    completedCourses: 16,
    gpa: 2.5,
    email: 'mei.tan@student.rmit.edu.au',
  },

  // -- Early applicants: Semester 1/2, under 72cp but allowed to apply early --
  {
    id: 'stu-ethan',
    name: 'Ethan Walsh',
    studentId: 's3903318',
    programId: 'bp094',
    currentSemester: 1,
    completedCourses: 0,
    gpa: 3.0,
    email: 'ethan.walsh@student.rmit.edu.au',
  },
  {
    id: 'stu-zara',
    name: 'Zara Ahmed',
    studentId: 's3907742',
    programId: 'bp250',
    currentSemester: 2,
    completedCourses: 4,
    gpa: 3.2,
    email: 'zara.ahmed@student.rmit.edu.au',
  },

  // -- Needs review: post-exchange credit-remaining rule fails --
  {
    id: 'stu-marcus',
    name: 'Marcus Webb',
    studentId: 's3714209',
    programId: 'bp217',
    currentSemester: 6,
    completedCourses: 20,
    gpa: 3.0,
    email: 'marcus.webb@student.rmit.edu.au',
  },
  {
    id: 'stu-isla',
    name: 'Isla Fernandez',
    studentId: 's3788851',
    programId: 'bp094',
    currentSemester: 5,
    completedCourses: 21,
    gpa: 3.3,
    email: 'isla.fernandez@student.rmit.edu.au',
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
