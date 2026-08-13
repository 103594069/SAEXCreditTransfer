export const APPLICATIONS_SEED_VERSION = 6

const ALL_DOCS = {
  'learning-agreement': true,
  'host-course-outlines': true,
  'academic-transcript': true,
  'passport-copy': true,
  'visa-evidence': true,
  'health-insurance': true,
}

// `appTag` keeps course ids unique across applications even when two
// applications happen to include the same partner course (e.g. two
// students both shortlisting Copenhagen Business School) — without it,
// course ids would collide and duplicate as React keys wherever courses
// from different applications render in the same list (the status board).
// `rmitUnitId` is the *effective* mapping (what this course actually
// counts towards) — normally the same as the partner course's static
// original mapping, but pass opts.originalRmitUnitId + isSubstituteMapping
// when a course was credited against a different, still-remaining unit
// instead (see src/lib/substituteMapping.js).
function course(appTag, partnerCourseId, rmitUnitId, opts = {}) {
  return {
    id: `crs-${appTag}-${partnerCourseId}`,
    partnerCourseId,
    rmitUnitId,
    originalRmitUnitId: opts.originalRmitUnitId ?? rmitUnitId,
    isSubstituteMapping: opts.isSubstituteMapping ?? false,
    staffReviewed: opts.staffReviewed ?? false,
    assessorReviewed: opts.assessorReviewed ?? false,
    decision: opts.decision ?? null,
    staffNote: opts.staffNote ?? null,
    assessorNote: opts.assessorNote ?? null,
    timeline: opts.timeline ?? [],
  }
}

// Seed applications for the 3 demo students (see src/data/students.js) —
// gives the staff/assessor queues and status board real volume from first
// load without needing a live submission first. The 4-course shortlist
// moves through the pipeline as a single application (all courses share
// `stage`); only once an application reaches "Decision Pending" do
// individual courses get their own independent outcome. These seeds
// deliberately show applications mid-stage with partial per-course review
// progress, to demonstrate that the application doesn't advance until
// every course has been reviewed.
export function buildSeedApplications() {
  return [
    // Student A — "Full precedent match": every course here maps directly
    // to a still-remaining unit (see students.js), and every course in
    // this combination already has established precedent, so the "Full
    // shortlist" panel should read "Previously approved" throughout once
    // reviewed, never a bare "Reviewed".
    {
      id: 'app-amara',
      studentId: 'stu-amara',
      institutionId: 'pi-toronto',
      programId: 'bp094',
      submittedDate: '2026-07-20',
      documents: ALL_DOCS,
      stage: 'With Staff',
      timeline: [
        { stage: 'Submitted', date: '2026-07-20', note: 'Shortlist submitted for review.' },
        { stage: 'With Staff', date: '2026-07-21', note: 'Opened for staff review.' },
      ],
      courses: [
        course('amara', 'pc-toronto-ds', 'ru-cosc2123', {
          staffReviewed: true,
          staffNote: 'Strong, well-established precedent — forwarding as-is.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-21', note: 'Reviewed and forwarded.' }],
        }),
        course('amara', 'pc-toronto-se', 'ru-cosc2299', {
          staffReviewed: true,
          staffNote: 'Clean match, nothing to flag.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-22', note: 'Reviewed and forwarded.' }],
        }),
        course('amara', 'pc-toronto-intro', 'ru-cosc1076', {}),
        course('amara', 'pc-toronto-web', 'ru-cosc2626', {}),
      ],
    },

    // Student C — "Substitute mapping case": Fundamentals of Marketing was
    // originally precedented against Marketing Principles (mktg1025), but
    // that unit is already completed for this student, so it's mapped
    // here to Marketing Analytics (mktg2115) instead — the only remaining
    // unit its content overlaps meaningfully with. The other 3 CBS courses
    // are ordinary direct matches.
    {
      id: 'app-sienna',
      studentId: 'stu-sienna',
      institutionId: 'pi-cbs',
      programId: 'bp250',
      submittedDate: '2026-07-10',
      documents: ALL_DOCS,
      stage: 'With Assessor',
      timeline: [
        { stage: 'Submitted', date: '2026-07-10', note: 'Shortlist submitted for review.' },
        { stage: 'With Staff', date: '2026-07-11', note: 'Opened for staff review.' },
        { stage: 'With Assessor', date: '2026-07-13', note: 'All courses reviewed by staff — forwarded to assessor.' },
      ],
      courses: [
        course('sienna', 'pc-cbs-consumerbeh', 'ru-mktg2031', {
          staffReviewed: true,
          assessorReviewed: true,
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-11', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-14', note: 'Opened for assessor review.' },
          ],
        }),
        course('sienna', 'pc-cbs-fundmarketing', 'ru-mktg2115', {
          originalRmitUnitId: 'ru-mktg1025',
          isSubstituteMapping: true,
          staffReviewed: true,
          assessorReviewed: true,
          staffNote: 'Originally precedented against Marketing Principles, already completed by this student — content overlap checked against Marketing Analytics instead, which is still remaining.',
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-11', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-14', note: 'Opened for assessor review.' },
          ],
        }),
        course('sienna', 'pc-cbs-digital', 'ru-mktg2087', {
          staffReviewed: true,
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-11', note: 'Reviewed and forwarded.' }],
        }),
        course('sienna', 'pc-cbs-intlbusiness', 'ru-intb1046', {
          staffReviewed: true,
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-11', note: 'Reviewed and forwarded.' }],
        }),
      ],
    },
  ]
}
