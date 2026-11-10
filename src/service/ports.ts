import type { Role } from '../domain/roles.ts'

export interface HomeInstitution {
  id: string
  name: string
}

/** A person who can sign in. Roles other than Operator are held at the user's Home Institution. */
export interface UserAccount {
  id: string
  email: string
  displayName: string
  homeInstitutionId: string | null
  roles: Role[]
  activeRole: Role
}

/** Storage port: repositories for each aggregate. */
export interface Storage {
  users: {
    findById(id: string): Promise<UserAccount | null>
    saveActiveRole(id: string, role: Role): Promise<void>
  }
  homeInstitutions: {
    findById(id: string): Promise<HomeInstitution | null>
    list(): Promise<HomeInstitution[]>
  }
}

export type AiAssistanceLevel = 'Explain' | 'Recommend'

export interface OutlineComparisonRequest {
  partnerCourseOutline: string
  homeUnitOutline: string
  aiAssistanceLevel: AiAssistanceLevel
  /** The Student's Program and Remaining Units, sent only when Student Context is on. */
  studentContext: { program: string; remainingUnits: string[] } | null
}

export interface OutlineComparisonResult {
  contentOverlapScore: 'Strong' | 'Moderate' | 'Weak'
  explanation: string
  /** Present only at the Recommend level; advisory, never a Decision (ADR-0002). */
  suggestion: { outcome: 'Approved' | 'Denied' | 'More Info Requested'; reasons: string } | null
}

/** Outline Comparison port: the AI provider sits behind this. */
export interface OutlineComparison {
  compare(request: OutlineComparisonRequest): Promise<OutlineComparisonResult>
}

export interface Email {
  to: string
  subject: string
  body: string
}

/** Notifier port: sends emails (the demo adapter captures them in the Demo Outbox). */
export interface Notifier {
  send(email: Email): Promise<void>
}
