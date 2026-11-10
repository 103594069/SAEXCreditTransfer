import type { Role } from '../../domain/roles.ts'
import type { Storage } from '../../service/ports.ts'
import type { SupabaseClient } from './client.ts'

interface UserAccountRow {
  id: string
  email: string
  display_name: string
  home_institution_id: string | null
  active_role: Role
  user_roles: { role: Role }[]
}

/** Storage adapter over the Supabase Postgres tables. Row-level security limits what each user reads. */
export function createSupabaseStorage(client: SupabaseClient): Storage {
  return {
    users: {
      async findById(id) {
        const { data, error } = await client
          .from('user_accounts')
          .select('id, email, display_name, home_institution_id, active_role, user_roles(role)')
          .eq('id', id)
          .maybeSingle<UserAccountRow>()
        if (error) throw error
        if (!data) return null
        return {
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          homeInstitutionId: data.home_institution_id,
          roles: data.user_roles.map((r) => r.role),
          activeRole: data.active_role,
        }
      },
      async saveActiveRole(id, role) {
        const { error } = await client.from('user_accounts').update({ active_role: role }).eq('id', id)
        if (error) throw error
      },
    },
    homeInstitutions: {
      async findById(id) {
        const { data, error } = await client.from('home_institutions').select('id, name').eq('id', id).maybeSingle()
        if (error) throw error
        return data
      },
      async list() {
        const { data, error } = await client.from('home_institutions').select('id, name').order('name')
        if (error) throw error
        return data
      },
    },
  }
}
