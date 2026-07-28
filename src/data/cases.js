// Seed data for staff-side volume: cases belonging to students other than
// the current demo student. The current student's case is created live
// when they submit their study plan in the Student view.
export const SEED_VERSION = 3

const REQUIRED_DOC_IDS = [
  'learning-agreement',
  'host-course-outlines',
  'academic-transcript',
  'passport-copy',
  'visa-evidence',
  'health-insurance',
]

function allDocsComplete() {
  return Object.fromEntries(REQUIRED_DOC_IDS.map((id) => [id, true]))
}

export function buildSeedCases() {
  return [
    {
      id: 'case-mei',
      studentId: 'stu-mei',
      hostInstitution: 'National University of Singapore',
      courseIds: ['hc-nus-molcell'],
      stage: 'Submitted',
      documents: allDocsComplete(),
      contextPack: null,
      staffNote: null,
      submittedDate: '2026-07-21',
      lastUpdated: '2026-07-21',
      timeline: [{ stage: 'Submitted', date: '2026-07-21', note: 'Study plan submitted for review.' }],
    },
    {
      id: 'case-jack',
      studentId: 'stu-jack',
      hostInstitution: 'University of Hong Kong',
      courseIds: ['hc-hku-comp2396'],
      stage: 'Submitted',
      documents: allDocsComplete(),
      contextPack: null,
      staffNote: null,
      submittedDate: '2026-07-19',
      lastUpdated: '2026-07-19',
      timeline: [{ stage: 'Submitted', date: '2026-07-19', note: 'Study plan submitted for review.' }],
    },
    {
      id: 'case-sofia',
      studentId: 'stu-sofia',
      hostInstitution: 'Universidad Autónoma de Madrid / University of Hong Kong',
      courseIds: ['hc-uam-fundmarketing', 'hc-hku-marketinganalytics'],
      stage: 'Submitted',
      documents: allDocsComplete(),
      contextPack: null,
      staffNote: null,
      submittedDate: '2026-07-23',
      lastUpdated: '2026-07-23',
      timeline: [{ stage: 'Submitted', date: '2026-07-23', note: 'Study plan submitted for review.' }],
    },
    {
      id: 'case-dylan',
      studentId: 'stu-dylan',
      hostInstitution: 'Trinity College Dublin',
      courseIds: ['hc-tcd-digitalstory'],
      stage: 'Submitted',
      documents: allDocsComplete(),
      contextPack: null,
      staffNote: null,
      submittedDate: '2026-07-24',
      lastUpdated: '2026-07-24',
      timeline: [{ stage: 'Submitted', date: '2026-07-24', note: 'Study plan submitted for review.' }],
    },
    {
      id: 'case-grace',
      studentId: 'stu-grace',
      hostInstitution: 'University of Amsterdam',
      courseIds: ['hc-uva-bioprocess'],
      stage: 'With Coordinator',
      documents: allDocsComplete(),
      contextPack:
        'Context pack — Grace Okafor (s3892341), Bachelor of Science (Biotechnology)\n' +
        'Host course: Bioprocess Technology, University of Amsterdam (6 ECTS)\n' +
        'Proposed RMIT equivalent: BIOT2011 Bioprocess Engineering (12cp)\n' +
        'Match confidence: 63% (medium) — learning outcome overlap 70%, duration alignment 65%, partial precedent (1 prior match)\n' +
        'Flag: course guide not verified in 15 months.\n' +
        'Sent for course coordinator review.',
      staffNote: 'Sent to course coordinator for confirmation on bioprocessing lab-hours equivalence.',
      submittedDate: '2026-07-05',
      lastUpdated: '2026-07-08',
      timeline: [
        { stage: 'Submitted', date: '2026-07-05', note: 'Study plan submitted for review.' },
        { stage: 'With Coordinator', date: '2026-07-08', note: 'Escalated to course coordinator with context pack.' },
      ],
    },
    {
      id: 'case-liam',
      studentId: 'stu-liam',
      hostInstitution: 'Copenhagen Business School',
      courseIds: ['hc-cbs-consumerbeh'],
      stage: 'Approved',
      documents: allDocsComplete(),
      contextPack: null,
      staffNote: 'Approved on established precedent — 6 prior matches from this program.',
      submittedDate: '2026-06-20',
      lastUpdated: '2026-06-22',
      timeline: [
        { stage: 'Submitted', date: '2026-06-20', note: 'Study plan submitted for review.' },
        { stage: 'Approved', date: '2026-06-22', note: 'Approved — high confidence match on established precedent.' },
      ],
    },
    {
      id: 'case-noah',
      studentId: 'stu-noah',
      hostInstitution: 'University of Manchester',
      courseIds: ['hc-manchester-landscape'],
      stage: 'Enrolled',
      documents: allDocsComplete(),
      contextPack: null,
      staffNote: 'Approved and enrolled for Semester 2.',
      submittedDate: '2026-05-14',
      lastUpdated: '2026-06-02',
      timeline: [
        { stage: 'Submitted', date: '2026-05-14', note: 'Study plan submitted for review.' },
        { stage: 'Approved', date: '2026-05-16', note: 'Approved — high confidence match.' },
        { stage: 'Enrolled', date: '2026-06-02', note: 'Enrolment confirmed with host institution.' },
      ],
    },
    {
      id: 'case-ava',
      studentId: 'stu-ava',
      hostInstitution: 'Trinity College Dublin',
      courseIds: ['hc-tcd-digitalstory'],
      stage: 'Transcript Received',
      documents: allDocsComplete(),
      contextPack: null,
      staffNote: 'Host transcript received — grade matching to RMIT record still outstanding.',
      transcriptStatus: 'pending manual match',
      submittedDate: '2026-01-10',
      lastUpdated: '2026-07-15',
      timeline: [
        { stage: 'Submitted', date: '2026-01-10', note: 'Study plan submitted for review.' },
        { stage: 'Approved', date: '2026-01-14', note: 'Approved — high confidence match.' },
        { stage: 'Enrolled', date: '2026-02-01', note: 'Enrolment confirmed with host institution.' },
        { stage: 'Transcript Received', date: '2026-07-15', note: 'Host transcript received, awaiting manual grade match.' },
      ],
    },
  ]
}
