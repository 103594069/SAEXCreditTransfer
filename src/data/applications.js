export const APPLICATIONS_SEED_VERSION = 4

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
function course(appTag, partnerCourseId, rmitUnitId, opts = {}) {
  return {
    id: `crs-${appTag}-${partnerCourseId}`,
    partnerCourseId,
    rmitUnitId,
    staffReviewed: opts.staffReviewed ?? false,
    assessorReviewed: opts.assessorReviewed ?? false,
    decision: opts.decision ?? null,
    staffNote: opts.staffNote ?? null,
    assessorNote: opts.assessorNote ?? null,
    timeline: opts.timeline ?? [],
  }
}

// Seed applications for students other than whoever is live-demoed logging
// in — gives the staff/assessor queues and status board real volume from
// first load. The 4-course shortlist moves through the pipeline as a
// single application (all courses share `stage`); only once an
// application reaches "Decision Pending" do individual courses get their
// own independent outcome. These seeds deliberately show applications
// mid-stage with partial per-course review progress, to demonstrate that
// the application doesn't advance until every course has been reviewed.
export function buildSeedApplications() {
  return [
    {
      id: 'app-jack',
      studentId: 'stu-jack',
      institutionId: 'pi-manchester',
      programId: 'bp094',
      submittedDate: '2026-07-18',
      documents: ALL_DOCS,
      stage: 'With Staff',
      timeline: [
        { stage: 'Submitted', date: '2026-07-18', note: 'Shortlist submitted for review.' },
        { stage: 'With Staff', date: '2026-07-19', note: 'Opened for staff review.' },
      ],
      courses: [
        course('jack', 'pc-manchester-se', 'ru-cosc2299', {
          staffReviewed: true,
          staffNote: 'Content overlap solid — forwarding as-is.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-19', note: 'Reviewed and forwarded.' }],
        }),
        course('jack', 'pc-manchester-fcs', 'ru-cosc1076', {
          staffReviewed: true,
          staffNote: 'Weak precedent — flagging for assessor attention.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-20', note: 'Reviewed and forwarded.' }],
        }),
        course('jack', 'pc-manchester-dist', 'ru-cosc3020', {}),
        course('jack', 'pc-manchester-sustainability-cs', 'ru-gen1002', {}),
      ],
    },
    {
      id: 'app-liam',
      studentId: 'stu-liam',
      institutionId: 'pi-cbs',
      programId: 'bp250',
      submittedDate: '2026-07-05',
      documents: ALL_DOCS,
      stage: 'Decision Pending',
      timeline: [
        { stage: 'Submitted', date: '2026-07-05', note: 'Shortlist submitted for review.' },
        { stage: 'With Staff', date: '2026-07-06', note: 'Opened for staff review.' },
        { stage: 'With Assessor', date: '2026-07-07', note: 'All courses reviewed by staff — forwarded to assessor.' },
        { stage: 'Decision Pending', date: '2026-07-09', note: 'All courses reviewed by assessor — ready for decisions.' },
      ],
      courses: [
        course('liam', 'pc-cbs-consumerbeh', 'ru-mktg2031', {
          staffReviewed: true,
          assessorReviewed: true,
          decision: 'Approved',
          assessorNote: 'Strong, recent precedent. Approved without reservations.',
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-06', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-08', note: 'Opened for assessor review.' },
            { event: 'Approved', date: '2026-07-10', note: 'Approved by assessor.' },
          ],
        }),
        course('liam', 'pc-cbs-fundmarketing', 'ru-mktg1025', {
          staffReviewed: true,
          assessorReviewed: true,
          decision: 'Approved',
          assessorNote: 'Established precedent, content overlap strong.',
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-06', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-08', note: 'Opened for assessor review.' },
            { event: 'Approved', date: '2026-07-11', note: 'Approved by assessor.' },
          ],
        }),
        course('liam', 'pc-cbs-digital', 'ru-mktg2087', {
          staffReviewed: true,
          assessorReviewed: true,
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-06', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-09', note: 'Opened for assessor review.' },
          ],
        }),
        course('liam', 'pc-cbs-intlbusiness', 'ru-intb1046', {
          staffReviewed: true,
          assessorReviewed: true,
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-06', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-09', note: 'Opened for assessor review.' },
          ],
        }),
      ],
    },
    {
      id: 'app-grace',
      studentId: 'stu-grace',
      institutionId: 'pi-nus',
      programId: 'bp217',
      submittedDate: '2026-07-12',
      documents: ALL_DOCS,
      stage: 'With Assessor',
      timeline: [
        { stage: 'Submitted', date: '2026-07-12', note: 'Shortlist submitted for review.' },
        { stage: 'With Staff', date: '2026-07-13', note: 'Opened for staff review.' },
        { stage: 'With Assessor', date: '2026-07-15', note: 'All courses reviewed by staff — forwarded to assessor.' },
      ],
      courses: [
        course('grace', 'pc-nus-molcell', 'ru-biol2033', {
          staffReviewed: true,
          assessorReviewed: true,
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-14', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-16', note: 'Opened for assessor review.' },
          ],
        }),
        course('grace', 'pc-nus-genetics', 'ru-biol2078', {
          staffReviewed: true,
          assessorReviewed: true,
          timeline: [
            { event: 'Reviewed by staff', date: '2026-07-14', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-07-16', note: 'Opened for assessor review.' },
          ],
        }),
        course('grace', 'pc-nus-bioprocess', 'ru-biot2011', {
          staffReviewed: true,
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-14', note: 'Reviewed and forwarded.' }],
        }),
        course('grace', 'pc-nus-gex-bio', 'ru-gen1001', {
          staffReviewed: true,
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-14', note: 'Reviewed and forwarded.' }],
        }),
      ],
    },
    {
      id: 'app-mei',
      studentId: 'stu-mei',
      institutionId: 'pi-ucb',
      programId: 'bp217',
      submittedDate: '2026-06-10',
      documents: ALL_DOCS,
      stage: 'Decision Pending',
      timeline: [
        { stage: 'Submitted', date: '2026-06-10', note: 'Shortlist submitted for review.' },
        { stage: 'With Staff', date: '2026-06-11', note: 'Opened for staff review.' },
        { stage: 'With Assessor', date: '2026-06-13', note: 'All courses reviewed by staff — forwarded to assessor.' },
        { stage: 'Decision Pending', date: '2026-06-15', note: 'All courses reviewed by assessor — ready for decisions.' },
      ],
      courses: [
        course('mei', 'pc-ucb-microbiology', 'ru-biol2091', {
          staffReviewed: true,
          assessorReviewed: true,
          decision: 'Approved',
          assessorNote: 'Thin precedent but strong content overlap and a first-hand course outline review. Approved.',
          timeline: [
            { event: 'Reviewed by staff', date: '2026-06-11', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-06-14', note: 'Opened for assessor review.' },
            { event: 'Approved', date: '2026-06-18', note: 'Approved by assessor.' },
          ],
        }),
        course('mei', 'pc-ucb-bioprocess', 'ru-biot2011', {
          staffReviewed: true,
          assessorReviewed: true,
          decision: 'Approved',
          assessorNote: 'No prior precedent, but outline reviewed directly and content overlap is adequate. Approved as a new precedent case.',
          timeline: [
            { event: 'Reviewed by staff', date: '2026-06-11', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-06-14', note: 'Opened for assessor review.' },
            { event: 'Approved', date: '2026-06-19', note: 'Approved by assessor.' },
          ],
        }),
        course('mei', 'pc-ucb-genetics', 'ru-biol2078', {
          staffReviewed: true,
          assessorReviewed: true,
          decision: 'Approved',
          assessorNote: 'Approved with minor conditions noted for the student.',
          timeline: [
            { event: 'Reviewed by staff', date: '2026-06-12', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-06-14', note: 'Opened for assessor review.' },
            { event: 'Approved', date: '2026-06-20', note: 'Approved by assessor.' },
          ],
        }),
        course('mei', 'pc-ucb-envpolicy', 'ru-gen1002', {
          staffReviewed: true,
          assessorReviewed: true,
          decision: 'Approved',
          assessorNote: 'Solid general elective match. Approved.',
          timeline: [
            { event: 'Reviewed by staff', date: '2026-06-12', note: 'Reviewed and forwarded.' },
            { event: 'Reviewed by assessor', date: '2026-06-14', note: 'Opened for assessor review.' },
            { event: 'Approved', date: '2026-06-21', note: 'Approved by assessor.' },
          ],
        }),
      ],
    },
    {
      id: 'app-amelia',
      studentId: 'stu-amelia',
      institutionId: 'pi-cbs',
      programId: 'bp250',
      submittedDate: '2026-07-25',
      documents: ALL_DOCS,
      stage: 'With Assessor',
      timeline: [
        { stage: 'Submitted', date: '2026-07-25', note: 'Shortlist submitted for review.' },
        { stage: 'With Staff', date: '2026-07-26', note: 'Opened for staff review.' },
        { stage: 'With Assessor', date: '2026-07-27', note: 'All courses reviewed by staff — forwarded to assessor.' },
      ],
      courses: [
        course('amelia', 'pc-cbs-consumerbeh', 'ru-mktg2031', {
          staffReviewed: true,
          staffNote: 'Clean match, strong established precedent — nothing to flag.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-26', note: 'Reviewed and forwarded.' }],
        }),
        course('amelia', 'pc-cbs-fundmarketing', 'ru-mktg1025', {
          staffReviewed: true,
          staffNote: 'Clean match, strong established precedent — nothing to flag.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-26', note: 'Reviewed and forwarded.' }],
        }),
        course('amelia', 'pc-cbs-digital', 'ru-mktg2087', {
          staffReviewed: true,
          staffNote: 'Clean match, strong established precedent — nothing to flag.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-26', note: 'Reviewed and forwarded.' }],
        }),
        course('amelia', 'pc-cbs-intlbusiness', 'ru-intb1046', {
          staffReviewed: true,
          staffNote: 'Clean match, strong established precedent — nothing to flag.',
          timeline: [{ event: 'Reviewed by staff', date: '2026-07-26', note: 'Reviewed and forwarded.' }],
        }),
      ],
    },
  ]
}
