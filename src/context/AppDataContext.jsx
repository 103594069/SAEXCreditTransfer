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

export const COURSE_STAGES = ['Submitted', 'With Staff', 'With Assessor']
export const DECISION_STAGES = ['Approved', 'Denied', 'More Info Requested']

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
      courses: load.partnerCourseIds.map((partnerCourseId) => {
        const partnerCourse = partnerCourseById(partnerCourseId)
        return {
          id: `crs-${partnerCourseId}-${loggedInStudentId}-${Date.now()}`,
          partnerCourseId,
          rmitUnitId: partnerCourse.rmitUnitId,
          stage: 'Submitted',
          staffNote: null,
          assessorNote: null,
          timeline: [{ stage: 'Submitted', date: TODAY, note: 'Shortlist submitted for review.' }],
        }
      }),
    }
    setApplications((prev) => [...prev.filter((a) => a.studentId !== loggedInStudentId), newApplication])
    setShortlistDrafts((prev) => ({ ...prev, [loggedInStudentId]: EMPTY_DRAFT }))
  }

  function updateCourse(applicationId, courseId, updater) {
    setApplications((prev) =>
      prev.map((app) =>
        app.id !== applicationId
          ? app
          : { ...app, courses: app.courses.map((c) => (c.id === courseId ? updater(c) : c)) },
      ),
    )
  }

  function openCourseAsStaff(applicationId, courseId) {
    updateCourse(applicationId, courseId, (c) =>
      c.stage === 'Submitted'
        ? {
            ...c,
            stage: 'With Staff',
            timeline: [...c.timeline, { stage: 'With Staff', date: TODAY, note: 'Opened for staff review.' }],
          }
        : c,
    )
  }

  function forwardCourseToAssessor(applicationId, courseId, note) {
    updateCourse(applicationId, courseId, (c) => ({
      ...c,
      staffNote: note || c.staffNote,
      stage: 'With Assessor',
      timeline: [
        ...c.timeline,
        { stage: 'With Assessor', date: TODAY, note: 'Forwarded to assessor with staff notes.' },
      ],
    }))
  }

  function decideCourse(applicationId, courseId, decision, note) {
    updateCourse(applicationId, courseId, (c) => ({
      ...c,
      assessorNote: note || c.assessorNote,
      stage: decision,
      timeline: [...c.timeline, { stage: decision, date: TODAY, note: `${decision} by assessor.` }],
    }))

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
    openCourseAsStaff,
    forwardCourseToAssessor,
    decideCourse,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
