import { loadsForProgram } from '../data/semesterLoads.js'
import { partnerCourseById } from '../data/partnerCourses.js'
import { institutionById } from '../data/partnerInstitutions.js'
import { remainingUnitIds } from '../data/students.js'

// Ranks partner institutions for a student's degree using two signals: how
// much of the proposed full load covers units the student still needs, and
// how many past students from the same degree were credited at that
// institution for units matching those remaining requirements.
export function rankInstitutions(student, precedents) {
  const loads = loadsForProgram(student.programId)
  const remaining = remainingUnitIds(student)

  const ranked = loads.map((load) => {
    const courses = load.partnerCourseIds.map((id) => partnerCourseById(id))
    const matchedRemainingUnits = courses.filter((c) => remaining.includes(c.rmitUnitId))
    const relevantPrecedentCount = precedents.filter(
      (p) =>
        p.programId === student.programId &&
        p.institutionId === load.institutionId &&
        remaining.includes(p.rmitUnitId),
    ).length

    let reasonNote
    if (relevantPrecedentCount > 0) {
      reasonNote = `${relevantPrecedentCount} student${relevantPrecedentCount === 1 ? '' : 's'} in your degree went here and ${relevantPrecedentCount === 1 ? 'was' : 'were'} credited for units matching your remaining requirements.`
    } else if (matchedRemainingUnits.length > 0) {
      reasonNote = `Covers ${matchedRemainingUnits.length} of your ${remaining.length} remaining unit${remaining.length === 1 ? '' : 's'} — no prior students from your degree yet.`
    } else {
      reasonNote = 'No direct coverage of your remaining units yet — shown as a general option in your discipline.'
    }

    return {
      load,
      institution: institutionById(load.institutionId),
      courses,
      matchedRemainingUnits,
      relevantPrecedentCount,
      reasonNote,
    }
  })

  ranked.sort((a, b) => {
    if (b.matchedRemainingUnits.length !== a.matchedRemainingUnits.length) {
      return b.matchedRemainingUnits.length - a.matchedRemainingUnits.length
    }
    return b.relevantPrecedentCount - a.relevantPrecedentCount
  })

  return ranked
}
