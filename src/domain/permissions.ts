import type { Role } from './roles.ts'

/**
 * Which roles may run each Credit Approval command or query. The service checks the
 * user's active role against this table before doing anything else.
 */
export const PERMISSIONS = {
  viewStudentHome: ['Student'],
  viewStaffHome: ['Staff'],
  viewAssessorHome: ['Assessor'],
  viewInstitutionAdminHome: ['Institution Admin'],
  viewOperatorHome: ['Operator'],
} as const satisfies Record<string, readonly Role[]>

export type Command = keyof typeof PERMISSIONS

export function isAllowed(command: Command, activeRole: Role): boolean {
  return (PERMISSIONS[command] as readonly Role[]).includes(activeRole)
}
