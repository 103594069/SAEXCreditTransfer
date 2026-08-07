import { degreeStructureFor } from '../data/degreeStructures.js'
import { creditPointsCompleted, creditPointsRemaining } from '../data/students.js'

// Based on RMIT's real outbound exchange rules:
// - GPA of at least 2.0/4.0 is required by departure.
// - At least 72 credit points must be completed by departure — not by
//   application, so students may apply early if they're on track to clear
//   the threshold before they leave.
// - At least 12 credit points must remain after a standard semester of
//   exchange (48cp) to retain OS-HELP loan eligibility.
export const MIN_GPA = 2.0
export const MIN_CREDIT_POINTS = 72
export const MIN_POST_EXCHANGE_CREDIT = 12
export const STANDARD_EXCHANGE_CREDIT = 48

// How far ahead we project a student's credit point trajectory when
// deciding whether an early applicant is "on track" — two semesters is a
// realistic exchange planning/approval lead time.
const PROJECTION_SEMESTERS_AHEAD = 2

export function computeEligibility(student) {
  const structure = degreeStructureFor(student.programId)
  const completed = creditPointsCompleted(student)
  const remaining = creditPointsRemaining(student)

  const gpaPass = student.gpa >= MIN_GPA

  const creditMet = completed >= MIN_CREDIT_POINTS
  const projectedCreditPoints = completed + PROJECTION_SEMESTERS_AHEAD * structure.creditPointsPerSemester
  const creditProjectedMet = projectedCreditPoints >= MIN_CREDIT_POINTS
  const creditStatus = creditMet ? 'met' : creditProjectedMet ? 'projected' : 'not-on-track'

  const remainingAfterExchange = remaining - STANDARD_EXCHANGE_CREDIT
  const postExchangePass = remainingAfterExchange >= MIN_POST_EXCHANGE_CREDIT

  const blockers = []
  if (!gpaPass) {
    blockers.push(`GPA of ${student.gpa.toFixed(1)} is below the 2.0 minimum required by departure.`)
  }
  if (!postExchangePass) {
    blockers.push(
      `Only ${remainingAfterExchange} credit point${remainingAfterExchange === 1 ? '' : 's'} would remain after a standard semester of exchange (${MIN_POST_EXCHANGE_CREDIT}cp minimum required to retain OS-HELP loan eligibility).`,
    )
  }
  if (creditStatus === 'not-on-track') {
    blockers.push(
      `Not projected to reach the ${MIN_CREDIT_POINTS}cp threshold before a typical departure window.`,
    )
  }

  let overallStatus
  if (blockers.length > 0) overallStatus = 'Needs Review'
  else if (creditStatus !== 'met') overallStatus = 'On Track'
  else overallStatus = 'Eligible'

  return {
    overallStatus,
    blockers,
    gpa: { value: student.gpa, pass: gpaPass, minimum: MIN_GPA },
    creditThreshold: {
      completed,
      required: MIN_CREDIT_POINTS,
      status: creditStatus,
      projected: projectedCreditPoints,
    },
    postExchange: {
      remainingBeforeExchange: remaining,
      remainingAfterExchange,
      pass: postExchangePass,
      minimum: MIN_POST_EXCHANGE_CREDIT,
      standardExchangeCredit: STANDARD_EXCHANGE_CREDIT,
    },
  }
}
