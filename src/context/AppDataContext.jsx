import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage.js'
import { buildSeedCases, SEED_VERSION } from '../data/cases.js'
import { CURRENT_STUDENT } from '../data/students.js'
import { buildContextPack } from '../lib/caseHelpers.js'

const AppDataContext = createContext(null)

export const STAGES = ['Submitted', 'With Coordinator', 'Approved', 'Enrolled', 'Transcript Received']

function loadCases() {
  const stored = readJSON('cases', null)
  if (stored && stored.version === SEED_VERSION) return stored.cases
  const seeded = buildSeedCases()
  writeJSON('cases', { version: SEED_VERSION, cases: seeded })
  return seeded
}

const EMPTY_DRAFT = { courseIds: [], documents: {} }

export function AppDataProvider({ children }) {
  const [role, setRole] = useState(() => readJSON('role', 'student'))
  const [cases, setCases] = useState(loadCases)
  const [draftPlan, setDraftPlan] = useState(() => readJSON('studentDraft', EMPTY_DRAFT))

  useEffect(() => writeJSON('role', role), [role])
  useEffect(() => writeJSON('cases', { version: SEED_VERSION, cases }), [cases])
  useEffect(() => writeJSON('studentDraft', draftPlan), [draftPlan])

  const currentStudentCase = useMemo(
    () => cases.find((c) => c.studentId === CURRENT_STUDENT.id) ?? null,
    [cases],
  )

  function toggleCourse(courseId) {
    setDraftPlan((prev) => {
      const exists = prev.courseIds.includes(courseId)
      return {
        ...prev,
        courseIds: exists ? prev.courseIds.filter((id) => id !== courseId) : [...prev.courseIds, courseId],
      }
    })
  }

  function toggleDocument(docId) {
    setDraftPlan((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docId]: !prev.documents[docId] },
    }))
  }

  function submitStudyPlan() {
    const today = '2026-07-28'
    const newCase = {
      id: `case-${CURRENT_STUDENT.id}-${Date.now()}`,
      studentId: CURRENT_STUDENT.id,
      hostInstitution: '—',
      courseIds: draftPlan.courseIds,
      stage: 'Submitted',
      documents: draftPlan.documents,
      contextPack: null,
      staffNote: null,
      submittedDate: today,
      lastUpdated: today,
      timeline: [{ stage: 'Submitted', date: today, note: 'Study plan submitted for review.' }],
    }
    setCases((prev) => [...prev.filter((c) => c.studentId !== CURRENT_STUDENT.id), newCase])
    setDraftPlan(EMPTY_DRAFT)
  }

  function updateCase(caseId, stage, note) {
    const today = '2026-07-28'
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              stage,
              staffNote: note ?? c.staffNote,
              lastUpdated: today,
              timeline: [...c.timeline, { stage, date: today, note }],
            }
          : c,
      ),
    )
  }

  function approveCase(caseId) {
    updateCase(caseId, 'Approved', 'Approved — high confidence match.')
  }

  function escalateCase(caseId) {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, contextPack: buildContextPack(c) } : c)),
    )
    updateCase(caseId, 'With Coordinator', 'Escalated to course coordinator with context pack.')
  }

  function advanceCase(caseId) {
    const target = cases.find((c) => c.id === caseId)
    if (!target) return
    const idx = STAGES.indexOf(target.stage)
    const next = STAGES[idx + 1]
    if (!next) return
    const notes = {
      Enrolled: 'Enrolment confirmed with host institution.',
      'Transcript Received': 'Host transcript received.',
    }
    updateCase(caseId, next, notes[next] ?? `Advanced to ${next}.`)
  }

  const value = {
    role,
    setRole,
    cases,
    currentStudentCase,
    draftPlan,
    toggleCourse,
    toggleDocument,
    submitStudyPlan,
    approveCase,
    escalateCase,
    advanceCase,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
