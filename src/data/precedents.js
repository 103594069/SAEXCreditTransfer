import { PARTNER_COURSES } from './partnerCourses.js'

export const PRECEDENTS_SEED_VERSION = 1

// Expands each partner course's compact `precedentSeed` into individual
// historical records — one per past student who was credited. This seed
// array is copied into app state on first load and can grow at runtime as
// assessors approve new courses (see AppDataContext.decideCourse).
export function buildSeedPrecedents() {
  const records = []
  for (const course of PARTNER_COURSES) {
    const { count, years } = course.precedentSeed
    for (let i = 0; i < count; i++) {
      records.push({
        id: `prec-${course.id}-${i}`,
        programId: course.programId,
        institutionId: course.institutionId,
        partnerCourseId: course.id,
        rmitUnitId: course.rmitUnitId,
        year: years[i],
      })
    }
  }
  return records
}
