import type { HomeInstitution, Storage, UserAccount } from '../../service/ports.ts'

export interface InMemorySeed {
  homeInstitutions?: HomeInstitution[]
  users?: UserAccount[]
}

/** Storage adapter that keeps everything in memory. Used in tests. */
export function createInMemoryStorage(seed: InMemorySeed = {}): Storage {
  const users = new Map((seed.users ?? []).map((u) => [u.id, structuredClone(u)]))
  const homeInstitutions = new Map((seed.homeInstitutions ?? []).map((h) => [h.id, structuredClone(h)]))

  return {
    users: {
      async findById(id) {
        const user = users.get(id)
        return user ? structuredClone(user) : null
      },
      async saveActiveRole(id, role) {
        const user = users.get(id)
        if (user) user.activeRole = role
      },
    },
    homeInstitutions: {
      async findById(id) {
        const homeInstitution = homeInstitutions.get(id)
        return homeInstitution ? structuredClone(homeInstitution) : null
      },
      async list() {
        return [...homeInstitutions.values()].map((h) => structuredClone(h))
      },
    },
  }
}
