import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage.js'
import { buildSeedPrecedents, PRECEDENTS_SEED_VERSION } from '../data/precedents.js'
import {
  buildSeedCombinationPrecedents,
  COMBINATION_PRECEDENTS_SEED_VERSION,
} from '../data/combinationPrecedents.js'
import { buildSeedApplications, APPLICATIONS_SEED_VERSION } from '../data/applications.js'
import { studentById } from '../data/students.js'
import { loadById } from '../data/semesterLoads.js'
import { partnerCourseById } from '../data/partnerCourses.js'
import { computeEligibility } from '../lib/eligibility.js'

const AppDataContext = createContext(null)

export const TODAY = '2026-07-28'
export const CURRENT_YEAR = 2026

// The 4-course shortlist moves through these stages as a single unit — all
// courses in an application always share the same stage. Only once an
// application reaches "Decision Pending" do individual courses get their
// own independent outcome (see DECISION_OUTCOMES).
export const APPLICATION_STAGES = ['Submitted', 'With Staff', 'With Assessor', 'Decision Pending']
export const DECISION_OUTCOMES = ['Approved', 'Denied', 'More Info Requested']

function loadPrecedents() {
  const stored = readJSON('precedents', null)
  if (stored && stored.version === PRECEDENTS_SEED_VERSION) return stored.records
  const seeded = buildSeedPrecedents()
  writeJSON('precedents', { version: PRECEDENTS_SEED_VERSION, records: seeded })
  return seeded
}

function loadCombinationPrecedents() {
  const stored = readJSON('combinationPrecedents', null)
  if (stored && stored.version === COMBINATION_PRECEDENTS_SEED_VERSION) return stored.records
  const seeded = buildSeedCombinationPrecedents()
  writeJSON('combinationPrecedents', { version: COMBINATION_PRECEDENTS_SEED_VERSION, records: seeded })
  return seeded
}

function loadApplications() {
  const stored = readJSON('applications', null)
  if (stored && stored.version === APPLICATIONS_SEED_VERSION) return stored.applications
  const seeded = buildSeedApplications()
  writeJSON('applications', { version: APPLICATIONS_SEED_VERSION, applications: seeded })
  return seeded
}

const EMPTY_DRAFT = { loadId: null, documents: {} }

export function AppDataProvider({ children }) {
  const [role, setRole] = useState(() => readJSON('role', 'student'))
  const [loggedInStudentId, setLoggedInStudentId] = useState(() => readJSON('loggedInStudentId', null))
  const [precedents, setPrecedents] = useState(loadPrecedents)
  const [combinationPrecedents] = useState(loadCombinationPrecedents)
  const [applications, setApplications] = useState(loadApplications)
  const [shortlistDrafts, setShortlistDrafts] = useState(() => readJSON('shortlistDrafts', {}))

  useEffect(() => writeJSON('role', role), [role])
  useEffect(() => writeJSON('loggedInStudentId', loggedInStudentId), [loggedInStudentId])
  useEffect(() => writeJSON('precedents', { version: PRECEDENTS_SEED_VERSION, records: precedents }), [precedents])
  useEffect(
    () => writeJSON('applications', { version: APPLICATIONS_SEED_VERSION, applications }),
    [applications],
  )
  useEffect(() => writeJSON('shortlistDrafts', shortlistDrafts), [shortlistDrafts])

  const currentStudent = useMemo(
    () => (loggedInStudentId ? studentById(loggedInStudentId) : null),
    [loggedInStudentId],
  )

  const currentStudentEligibility = useMemo(
    () => (currentStudent ? computeEligibility(currentStudent) : null),
    [currentStudent],
  )

  const shortlistDraft = shortlistDrafts[loggedInStudentId] ?? EMPTY_DRAFT

  const currentStudentApplication = useMemo(
    () => applications.find((a) => a.studentId === loggedInStudentId) ?? null,
    [applications, loggedInStudentId],
  )

  function login(studentId) {
    setLoggedInStudentId(studentId)
  }

  function logout() {
    setLoggedInStudentId(null)
  }

  function selectLoad(loadId) {
    setShortlistDrafts((prev) => ({ ...prev, [loggedInStudentId]: { loadId, documents: {} } }))
  }

  function clearShortlist() {
    setShortlistDrafts((prev) => ({ ...prev, [loggedInStudentId]: EMPTY_DRAFT }))
  }

  function toggleDocument(docId) {
    setShortlistDrafts((prev) => {
      const current = prev[loggedInStudentId] ?? EMPTY_DRAFT
      return {
        ...prev,
        [loggedInStudentId]: { ...current, documents: { ...current.documents, [docId]: !current.documents[docId] } },
      }
    })
  }

  function submitShortlist() {
    const draft = shortlistDrafts[loggedInStudentId]
    if (!draft?.loadId) return
    const load = loadById(draft.loadId)
    const newApplication = {
      id: `app-${loggedInStudentId}-${Date.now()}`,
      studentId: loggedInStudentId,
      institutionId: load.institutionId,
      programId: load.programId,
      submittedDate: TODAY,
      documents: draft.documents,
      stage: 'Submitted',
      timeline: [{ stage: 'Submitted', date: TODAY, note: 'Shortlist submitted for review.' }],
      courses: load.partnerCourseIds.map((partnerCourseId) => {
        const partnerCourse = partnerCourseById(partnerCourseId)
        return {
          id: `crs-${partnerCourseId}-${loggedInStudentId}-${Date.now()}`,
          partnerCourseId,
          rmitUnitId: partnerCourse.rmitUnitId,
          staffReviewed: false,
          assessorReviewed: false,
          decision: null,
          staffNote: null,
          assessorNote: null,
          timeline: [],
        }
      }),
    }
    setApplications((prev) => [...prev.filter((a) => a.studentId !== loggedInStudentId), newApplication])
    setShortlistDrafts((prev) => ({ ...prev, [loggedInStudentId]: EMPTY_DRAFT }))
  }

  function updateApplication(applicationId, updater) {
    setApplications((prev) => prev.map((app) => (app.id === applicationId ? updater(app) : app)))
  }

  // Opening any course in a freshly-submitted application puts the whole
  // application "with staff" — this is application-level, not course-level.
  function openApplicationAsStaff(applicationId) {
    updateApplication(applicationId, (app) =>
      app.stage === 'Submitted'
        ? {
            ...app,
            stage: 'With Staff',
            timeline: [...app.timeline, { stage: 'With Staff', date: TODAY, note: 'Opened for staff review.' }],
          }
        : app,
    )
  }

  // Staff still review and forward each course individually, but the
  // application only advances to "With Assessor" once every course in it
  // has been reviewed this way.
  function markCourseReviewedByStaff(applicationId, courseId, note) {
    updateApplication(applicationId, (app) => {
      if (app.stage !== 'With Staff') return app
      const courses = app.courses.map((c) =>
        c.id === courseId && !c.staffReviewed
          ? {
              ...c,
              staffReviewed: true,
              staffNote: note || c.staffNote,
              timeline: [
                ...c.timeline,
                { event: 'Reviewed by staff', date: TODAY, note: note || 'Reviewed and forwarded to assessor.' },
              ],
            }
          : c,
      )
      const allReviewed = courses.every((c) => c.staffReviewed)
      return {
        ...app,
        courses,
        stage: allReviewed ? 'With Assessor' : app.stage,
        timeline: allReviewed
          ? [
              ...app.timeline,
              { stage: 'With Assessor', date: TODAY, note: 'All courses reviewed by staff — forwarded to assessor.' },
            ]
          : app.timeline,
      }
    })
  }

  // Mirrors markCourseReviewedByStaff for the assessor side: opening a
  // course marks it reviewed, and once every course has been opened this
  // way the application advances to "Decision Pending", unlocking the
  // per-course decision panel.
  function openCourseAsAssessor(applicationId, courseId) {
    updateApplication(applicationId, (app) => {
      if (app.stage !== 'With Assessor') return app
      const course = app.courses.find((c) => c.id === courseId)
      if (!course || course.assessorReviewed) return app
      const courses = app.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              assessorReviewed: true,
              timeline: [...c.timeline, { event: 'Reviewed by assessor', date: TODAY, note: 'Opened for assessor review.' }],
            }
          : c,
      )
      const allReviewed = courses.every((c) => c.assessorReviewed)
      return {
        ...app,
        courses,
        stage: allReviewed ? 'Decision Pending' : app.stage,
        timeline: allReviewed
          ? [
              ...app.timeline,
              { stage: 'Decision Pending', date: TODAY, note: 'All courses reviewed by assessor — ready for decisions.' },
            ]
          : app.timeline,
      }
    })
  }

  // The only per-course action that was always meant to be independent —
  // unchanged in spirit, just keyed off `decision` instead of `stage`, and
  // only meaningful once the application has collectively reached
  // "Decision Pending".
  function decideCourse(applicationId, courseId, decision, note) {
    updateApplication(applicationId, (app) => {
      if (app.stage !== 'Decision Pending') return app
      return {
        ...app,
        courses: app.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                decision,
                assessorNote: note || c.assessorNote,
                timeline: [...c.timeline, { event: decision, date: TODAY, note: `${decision} by assessor.` }],
              }
            : c,
        ),
      }
    })

    if (decision === 'Approved') {
      const application = applications.find((a) => a.id === applicationId)
      const courseEntry = application?.courses.find((c) => c.id === courseId)
      if (application && courseEntry) {
        setPrecedents((prev) => [
          ...prev,
          {
            id: `prec-${courseEntry.partnerCourseId}-${Date.now()}`,
            programId: application.programId,
            institutionId: application.institutionId,
            partnerCourseId: courseEntry.partnerCourseId,
            rmitUnitId: courseEntry.rmitUnitId,
            year: CURRENT_YEAR,
          },
        ])
      }
    }
  }

  const value = {
    role,
    setRole,
    loggedInStudentId,
    currentStudent,
    currentStudentEligibility,
    login,
    logout,
    precedents,
    combinationPrecedents,
    applications,
    shortlistDraft,
    selectLoad,
    clearShortlist,
    toggleDocument,
    submitShortlist,
    currentStudentApplication,
    openApplicationAsStaff,
    markCourseReviewedByStaff,
    openCourseAsAssessor,
    decideCourse,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
