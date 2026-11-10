import { isAllowed, type Command } from '../domain/permissions.ts'
import type { Role } from '../domain/roles.ts'
import type { HomeInstitution, Notifier, OutlineComparison, Storage, UserAccount } from './ports.ts'

export interface CreditApprovalDependencies {
  storage: Storage
  outlineComparison: OutlineComparison
  notifier: Notifier
}

/** What the signed-in user is: who they are, the roles they hold and the one they act in. */
export interface UserSession {
  userId: string
  displayName: string
  email: string
  homeInstitution: HomeInstitution | null
  roles: Role[]
  activeRole: Role
}

/** What a role's home screen shows. */
export interface RoleHome {
  displayName: string
  homeInstitution: HomeInstitution | null
}

/** What the Operator's home screen shows: the product runs across every Home Institution. */
export interface OperatorHome {
  displayName: string
  homeInstitutions: HomeInstitution[]
}

/** The active role is not allowed to run the command. */
export class NotPermittedError extends Error {
  constructor(
    readonly command: string,
    readonly activeRole: Role,
  ) {
    super(`${activeRole} may not ${command}`)
    this.name = 'NotPermittedError'
  }
}

/** A user tried to act in a role they do not hold. */
export class RoleNotHeldError extends Error {
  constructor(readonly role: Role) {
    super(`You do not hold the ${role} role`)
    this.name = 'RoleNotHeldError'
  }
}

/** The signed-in identity has no user account in the product. */
export class UnknownUserError extends Error {
  constructor(readonly userId: string) {
    super('No account found for this sign-in')
    this.name = 'UnknownUserError'
  }
}

export function createCreditApprovalService({ storage }: CreditApprovalDependencies) {
  /** Loads the user. An active role they no longer hold falls back to the first role they do hold. */
  async function loadUser(userId: string): Promise<UserAccount> {
    const user = await storage.users.findById(userId)
    if (!user) throw new UnknownUserError(userId)
    if (user.roles.includes(user.activeRole)) return user
    const [firstHeld] = user.roles
    if (!firstHeld) throw new UnknownUserError(userId)
    return { ...user, activeRole: firstHeld }
  }

  async function homeInstitutionOf(user: UserAccount): Promise<HomeInstitution | null> {
    return user.homeInstitutionId ? storage.homeInstitutions.findById(user.homeInstitutionId) : null
  }

  async function getSession(userId: string): Promise<UserSession> {
    const user = await loadUser(userId)
    return {
      userId: user.id,
      displayName: user.displayName,
      email: user.email,
      homeInstitution: await homeInstitutionOf(user),
      roles: user.roles,
      activeRole: user.activeRole,
    }
  }

  /** Loads the user and refuses the command unless their active role allows it. */
  async function authorize(userId: string, command: Command): Promise<UserAccount> {
    const user = await loadUser(userId)
    if (!isAllowed(command, user.activeRole)) throw new NotPermittedError(command, user.activeRole)
    return user
  }

  async function homeFor(user: UserAccount): Promise<RoleHome> {
    return { displayName: user.displayName, homeInstitution: await homeInstitutionOf(user) }
  }

  async function studentHome(userId: string): Promise<RoleHome> {
    return homeFor(await authorize(userId, 'viewStudentHome'))
  }

  async function staffHome(userId: string): Promise<RoleHome> {
    return homeFor(await authorize(userId, 'viewStaffHome'))
  }

  async function institutionAdminHome(userId: string): Promise<RoleHome> {
    return homeFor(await authorize(userId, 'viewInstitutionAdminHome'))
  }

  async function assessorHome(userId: string): Promise<RoleHome> {
    return homeFor(await authorize(userId, 'viewAssessorHome'))
  }

  async function operatorHome(userId: string): Promise<OperatorHome> {
    const user = await authorize(userId, 'viewOperatorHome')
    return { displayName: user.displayName, homeInstitutions: await storage.homeInstitutions.list() }
  }

  async function switchActiveRole(userId: string, role: Role): Promise<UserSession> {
    const user = await loadUser(userId)
    if (!user.roles.includes(role)) throw new RoleNotHeldError(role)
    await storage.users.saveActiveRole(userId, role)
    return getSession(userId)
  }

  return { getSession, switchActiveRole, studentHome, staffHome, assessorHome, institutionAdminHome, operatorHome }
}

export type CreditApprovalService = ReturnType<typeof createCreditApprovalService>
