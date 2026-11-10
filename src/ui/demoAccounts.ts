import type { Role } from '../domain/roles.ts'

/** The seeded demo accounts (supabase/seed.sql), listed on the sign-in screen for test sessions. */
export const DEMO_PASSWORD = 'demo-password'

export const DEMO_ACCOUNTS: { email: string; roles: Role[] }[] = [
  { email: 'student@rmit-demo.test', roles: ['Student'] },
  { email: 'staff@rmit-demo.test', roles: ['Staff'] },
  { email: 'assessor@rmit-demo.test', roles: ['Assessor'] },
  { email: 'admin@rmit-demo.test', roles: ['Institution Admin'] },
  { email: 'operator@saex-demo.test', roles: ['Operator'] },
  { email: 'staff.admin@rmit-demo.test', roles: ['Staff', 'Institution Admin'] },
]
