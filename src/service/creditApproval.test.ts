import { describe, expect, it } from 'vitest'
import { createInMemoryStorage } from '../adapters/memory/inMemoryStorage.ts'
import { createFakeOutlineComparison } from '../adapters/fake/fakeOutlineComparison.ts'
import { createRecordingNotifier } from '../adapters/fake/recordingNotifier.ts'
import { ROLES, type Role } from '../domain/roles.ts'
import type { Storage, UserAccount } from './ports.ts'
import { createCreditApprovalService, NotPermittedError, RoleNotHeldError, UnknownUserError } from './creditApproval.ts'

const demoHomeInstitution = { id: 'hi-demo', name: 'Demo Home Institution' }
const otherHomeInstitution = { id: 'hi-other', name: 'Other Home Institution' }

const student: UserAccount = {
  id: 'u-student',
  email: 'student@demo.test',
  displayName: 'Sam Student',
  homeInstitutionId: 'hi-demo',
  roles: ['Student'],
  activeRole: 'Student',
}
const staffAndAdmin: UserAccount = {
  id: 'u-staff-admin',
  email: 'staff.admin@demo.test',
  displayName: 'Alex Both',
  homeInstitutionId: 'hi-demo',
  roles: ['Staff', 'Institution Admin'],
  activeRole: 'Staff',
}
const assessor: UserAccount = {
  id: 'u-assessor',
  email: 'assessor@demo.test',
  displayName: 'Ari Assessor',
  homeInstitutionId: 'hi-demo',
  roles: ['Assessor'],
  activeRole: 'Assessor',
}
const holdsEveryRole: UserAccount = {
  id: 'u-every-role',
  email: 'every.role@demo.test',
  displayName: 'Eve Every',
  homeInstitutionId: 'hi-demo',
  roles: [...ROLES],
  activeRole: 'Student',
}
const revokedStaff: UserAccount = {
  id: 'u-revoked',
  email: 'revoked@demo.test',
  displayName: 'Rex Revoked',
  homeInstitutionId: 'hi-demo',
  roles: ['Student'],
  activeRole: 'Staff',
}
const operator: UserAccount = {
  id: 'u-operator',
  email: 'operator@demo.test',
  displayName: 'Olive Operator',
  homeInstitutionId: null,
  roles: ['Operator'],
  activeRole: 'Operator',
}

function seededStorage(): Storage {
  return createInMemoryStorage({
    homeInstitutions: [demoHomeInstitution, otherHomeInstitution],
    users: [student, staffAndAdmin, assessor, holdsEveryRole, revokedStaff, operator],
  })
}

function serviceOver(storage: Storage = seededStorage()) {
  return createCreditApprovalService({
    storage,
    outlineComparison: createFakeOutlineComparison().port,
    notifier: createRecordingNotifier().port,
  })
}

describe('Credit Approval service: signing in and roles', () => {
  it('gives a signed-in Student their roles, active role and Home Institution', async () => {
    const session = await serviceOver().getSession('u-student')

    expect(session).toEqual({
      userId: 'u-student',
      displayName: 'Sam Student',
      email: 'student@demo.test',
      homeInstitution: { id: 'hi-demo', name: 'Demo Home Institution' },
      roles: ['Student'],
      activeRole: 'Student',
    })
  })
})

describe('Credit Approval service: switching the active role', () => {
  it('lets a user holding Staff and Institution Admin act as Institution Admin after switching', async () => {
    const service = serviceOver()

    const session = await service.switchActiveRole('u-staff-admin', 'Institution Admin')

    expect(session.activeRole).toBe('Institution Admin')
    await expect(service.institutionAdminHome('u-staff-admin')).resolves.toMatchObject({ displayName: 'Alex Both' })
  })

  it('refuses a signed-in identity that has no user account', async () => {
    await expect(serviceOver().getSession('u-nobody')).rejects.toBeInstanceOf(UnknownUserError)
  })

  it('refuses switching to a role the user does not hold, and keeps the current active role', async () => {
    const service = serviceOver()

    await expect(service.switchActiveRole('u-student', 'Assessor')).rejects.toBeInstanceOf(RoleNotHeldError)
    expect((await service.getSession('u-student')).activeRole).toBe('Student')
  })
})

describe('Credit Approval service: role screens', () => {
  it('lets a Student open the Student home at their Home Institution', async () => {
    const home = await serviceOver().studentHome('u-student')

    expect(home).toEqual({ displayName: 'Sam Student', homeInstitution: { id: 'hi-demo', name: 'Demo Home Institution' } })
  })

  it('lets an Assessor open the Assessor home', async () => {
    const home = await serviceOver().assessorHome('u-assessor')

    expect(home).toEqual({ displayName: 'Ari Assessor', homeInstitution: { id: 'hi-demo', name: 'Demo Home Institution' } })
  })

  it('lets the Operator open the Operator home listing every Home Institution', async () => {
    const home = await serviceOver().operatorHome('u-operator')

    expect(home).toEqual({
      displayName: 'Olive Operator',
      homeInstitutions: [
        { id: 'hi-demo', name: 'Demo Home Institution' },
        { id: 'hi-other', name: 'Other Home Institution' },
      ],
    })
  })

  it('refuses a screen whose role was taken away while it was the active role', async () => {
    await expect(serviceOver().staffHome('u-revoked')).rejects.toBeInstanceOf(NotPermittedError)
  })

  it('moves a user whose active role was taken away to a role they still hold', async () => {
    expect((await serviceOver().getSession('u-revoked')).activeRole).toBe('Student')
  })

  it('refuses a user who holds no role at all', async () => {
    const storage = createInMemoryStorage({ users: [{ ...student, id: 'u-no-roles', roles: [] }] })

    await expect(serviceOver(storage).getSession('u-no-roles')).rejects.toBeInstanceOf(UnknownUserError)
  })

  it('refuses a Student the Staff home', async () => {
    await expect(serviceOver().staffHome('u-student')).rejects.toBeInstanceOf(NotPermittedError)
  })
})

describe('Credit Approval service: each role screen is open only to its active role', () => {
  type Service = ReturnType<typeof serviceOver>
  const homeQueries: Record<Role, (service: Service, userId: string) => Promise<unknown>> = {
    Student: (service, userId) => service.studentHome(userId),
    Staff: (service, userId) => service.staffHome(userId),
    Assessor: (service, userId) => service.assessorHome(userId),
    'Institution Admin': (service, userId) => service.institutionAdminHome(userId),
    Operator: (service, userId) => service.operatorHome(userId),
  }

  for (const activeRole of ROLES) {
    for (const screenRole of ROLES) {
      const allowed = activeRole === screenRole
      it(`${allowed ? 'opens' : 'refuses'} the ${screenRole} home when acting as ${activeRole}`, async () => {
        const service = serviceOver()
        await service.switchActiveRole('u-every-role', activeRole)

        const opening = homeQueries[screenRole](service, 'u-every-role')

        if (allowed) await expect(opening).resolves.toBeDefined()
        else await expect(opening).rejects.toBeInstanceOf(NotPermittedError)
      })
    }
  }
})
