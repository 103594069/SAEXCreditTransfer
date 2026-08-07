export const APPLICATIONS_SEED_VERSION = 2

const ALL_DOCS = {
  'learning-agreement': true,
  'host-course-outlines': true,
  'academic-transcript': true,
  'passport-copy': true,
  'visa-evidence': true,
  'health-insurance': true,
}

function course(partnerCourseId, rmitUnitId, stage, timeline, notes = {}) {
  return {
    id: `crs-${partnerCourseId}`,
    partnerCourseId,
    rmitUnitId,
    stage,
    staffNote: notes.staffNote ?? null,
    assessorNote: notes.assessorNote ?? null,
    timeline,
  }
}

// Seed applications for students other than whoever is live-demoed logging
// in — gives the staff/assessor queues and status board real volume from
// first load. Deliberately mixes course stages *within* a single
// application to show that each course in a load is reviewed independently.
export function buildSeedApplications() {
  return [
    {
      id: 'app-jack',
      studentId: 'stu-jack',
      institutionId: 'pi-manchester',
      programId: 'bp094',
      submittedDate: '2026-07-18',
      documents: ALL_DOCS,
      courses: [
        course('pc-manchester-se', 'ru-cosc2299', 'Submitted', [
          { stage: 'Submitted', date: '2026-07-18', note: 'Shortlist submitted for review.' },
        ]),
        course('pc-manchester-fcs', 'ru-cosc1076', 'With Staff', [
          { stage: 'Submitted', date: '2026-07-18', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-20', note: 'Opened for staff review.' },
        ]),
        course('pc-manchester-dist', 'ru-cosc3020', 'With Assessor', [
          { stage: 'Submitted', date: '2026-07-18', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-19', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-21', note: 'Forwarded to assessor with staff notes.' },
        ], { staffNote: 'Weak precedent — please check module has not changed since 2020.' }),
        course('pc-manchester-sustainability-cs', 'ru-gen1002', 'Submitted', [
          { stage: 'Submitted', date: '2026-07-18', note: 'Shortlist submitted for review.' },
        ]),
      ],
    },
    {
      id: 'app-liam',
      studentId: 'stu-liam',
      institutionId: 'pi-cbs',
      programId: 'bp250',
      submittedDate: '2026-07-05',
      documents: ALL_DOCS,
      courses: [
        course('pc-cbs-consumerbeh', 'ru-mktg2031', 'Approved', [
          { stage: 'Submitted', date: '2026-07-05', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-06', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-07', note: 'Forwarded to assessor.' },
          { stage: 'Approved', date: '2026-07-10', note: 'Approved — strong, recent precedent.' },
        ], { assessorNote: 'Strong, recent precedent. Approved without reservations.' }),
        course('pc-cbs-fundmarketing', 'ru-mktg1025', 'Approved', [
          { stage: 'Submitted', date: '2026-07-05', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-06', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-07', note: 'Forwarded to assessor.' },
          { stage: 'Approved', date: '2026-07-11', note: 'Approved — established precedent.' },
        ], { assessorNote: 'Established precedent, content overlap strong.' }),
        course('pc-cbs-digital', 'ru-mktg2087', 'With Assessor', [
          { stage: 'Submitted', date: '2026-07-05', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-06', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-08', note: 'Forwarded to assessor.' },
        ]),
        course('pc-cbs-intlbusiness', 'ru-intb1046', 'With Assessor', [
          { stage: 'Submitted', date: '2026-07-05', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-06', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-09', note: 'Forwarded to assessor.' },
        ]),
      ],
    },
    {
      id: 'app-grace',
      studentId: 'stu-grace',
      institutionId: 'pi-nus',
      programId: 'bp217',
      submittedDate: '2026-07-12',
      documents: ALL_DOCS,
      courses: [
        course('pc-nus-molcell', 'ru-biol2033', 'With Assessor', [
          { stage: 'Submitted', date: '2026-07-12', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-13', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-15', note: 'Forwarded to assessor.' },
        ]),
        course('pc-nus-genetics', 'ru-biol2078', 'With Assessor', [
          { stage: 'Submitted', date: '2026-07-12', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-13', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-15', note: 'Forwarded to assessor.' },
        ]),
        course('pc-nus-bioprocess', 'ru-biot2011', 'With Assessor', [
          { stage: 'Submitted', date: '2026-07-12', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-14', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-16', note: 'Forwarded to assessor.' },
        ]),
        course('pc-nus-gex-bio', 'ru-gen1001', 'With Assessor', [
          { stage: 'Submitted', date: '2026-07-12', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-07-14', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-07-16', note: 'Forwarded to assessor.' },
        ]),
      ],
    },
    {
      id: 'app-mei',
      studentId: 'stu-mei',
      institutionId: 'pi-ucb',
      programId: 'bp217',
      submittedDate: '2026-06-10',
      documents: ALL_DOCS,
      courses: [
        course('pc-ucb-microbiology', 'ru-biol2091', 'Approved', [
          { stage: 'Submitted', date: '2026-06-10', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-06-11', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-06-13', note: 'Forwarded to assessor.' },
          { stage: 'Approved', date: '2026-06-18', note: 'Approved on balance despite thin precedent.' },
        ], { assessorNote: 'Thin precedent but strong content overlap and a first-hand course outline review. Approved.' }),
        course('pc-ucb-bioprocess', 'ru-biot2011', 'Approved', [
          { stage: 'Submitted', date: '2026-06-10', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-06-11', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-06-13', note: 'Forwarded to assessor.' },
          { stage: 'Approved', date: '2026-06-19', note: 'Approved — first precedent for this course.' },
        ], { assessorNote: 'No prior precedent, but outline reviewed directly and content overlap is adequate. Approved as a new precedent case.' }),
        course('pc-ucb-genetics', 'ru-biol2078', 'Approved', [
          { stage: 'Submitted', date: '2026-06-10', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-06-12', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-06-14', note: 'Forwarded to assessor.' },
          { stage: 'Approved', date: '2026-06-20', note: 'Approved.' },
        ], { assessorNote: 'Approved with minor conditions noted for the student.' }),
        course('pc-ucb-envpolicy', 'ru-gen1002', 'Approved', [
          { stage: 'Submitted', date: '2026-06-10', note: 'Shortlist submitted for review.' },
          { stage: 'With Staff', date: '2026-06-12', note: 'Opened for staff review.' },
          { stage: 'With Assessor', date: '2026-06-14', note: 'Forwarded to assessor.' },
          { stage: 'Approved', date: '2026-06-21', note: 'Approved.' },
        ], { assessorNote: 'Solid general elective match. Approved.' }),
      ],
    },
  ]
}
