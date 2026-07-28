// The demo is told from the perspective of a single "current" student,
// with additional seeded students used to populate staff-side volume.
export const CURRENT_STUDENT = {
  id: 'stu-priya',
  name: 'Priya Nair',
  studentId: 's3891204',
  programId: 'bp094',
  yearLevel: 'Year 2',
  email: 'priya.nair@student.rmit.edu.au',
}

export const OTHER_STUDENTS = [
  { id: 'stu-liam', name: 'Liam Cheung', studentId: 's3762211', programId: 'bp250', yearLevel: 'Year 3' },
  { id: 'stu-ava', name: 'Ava Thompson', studentId: 's3814402', programId: 'bp328', yearLevel: 'Year 2' },
  { id: 'stu-noah', name: 'Noah Fitzgerald', studentId: 's3729915', programId: 'bp279', yearLevel: 'Year 3' },
  { id: 'stu-mei', name: 'Mei Lin Tan', studentId: 's3855120', programId: 'bp217', yearLevel: 'Year 2' },
  { id: 'stu-jack', name: 'Jack Osei', studentId: 's3801177', programId: 'bp094', yearLevel: 'Year 4' },
  { id: 'stu-sofia', name: 'Sofia Ricci', studentId: 's3868803', programId: 'bp250', yearLevel: 'Year 2' },
  { id: 'stu-dylan', name: 'Dylan Prasad', studentId: 's3777654', programId: 'bp328', yearLevel: 'Year 3' },
  { id: 'stu-grace', name: 'Grace Okafor', studentId: 's3892341', programId: 'bp217', yearLevel: 'Year 3' },
]

export const ALL_STUDENTS = [CURRENT_STUDENT, ...OTHER_STUDENTS]

export function studentById(id) {
  return ALL_STUDENTS.find((s) => s.id === id)
}
