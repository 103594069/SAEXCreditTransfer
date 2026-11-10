/** The roles a user can act in. A user acts in one active role at a time. */
export const ROLES = ['Student', 'Staff', 'Assessor', 'Institution Admin', 'Operator'] as const

export type Role = (typeof ROLES)[number]
