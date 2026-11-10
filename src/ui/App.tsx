import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Role } from '../domain/roles.ts'
import type { UserSession } from '../service/creditApproval.ts'
import { creditApproval, supabase } from './creditApproval.ts'
import { AssessorScreen, InstitutionAdminScreen, OperatorScreen, StaffScreen, StudentScreen } from './screens/RoleScreens.tsx'
import { SignInScreen } from './screens/SignInScreen.tsx'
import { errorMessage } from './useAsync.ts'

/** One screen per role. Only the active role's screen is ever rendered. */
const ROLE_SCREENS: Record<Role, (props: { userId: string }) => ReactNode> = {
  Student: StudentScreen,
  Staff: StaffScreen,
  Assessor: AssessorScreen,
  'Institution Admin': InstitutionAdminScreen,
  Operator: OperatorScreen,
}

export function App() {
  const [auth, setAuth] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuth(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setAuth(session))
    return () => data.subscription.unsubscribe()
  }, [])

  if (auth === undefined) return <p className="p-8 text-paper-500">Loading…</p>
  if (auth === null) return <SignInScreen />
  return <SignedIn key={auth.user.id} userId={auth.user.id} />
}

function SignedIn({ userId }: { userId: string }) {
  const [session, setSession] = useState<UserSession | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    creditApproval.getSession(userId).then(setSession, (e: unknown) => setError(errorMessage(e)))
  }, [userId])

  const [switching, setSwitching] = useState(false)

  // One switch at a time, so replies cannot land out of order. After a failure, reload
  // the stored session so the screen never shows a role other than the stored one.
  async function switchRole(role: Role) {
    setError(null)
    setSwitching(true)
    try {
      setSession(await creditApproval.switchActiveRole(userId, role))
    } catch (e) {
      setError(errorMessage(e))
      await creditApproval.getSession(userId).then(setSession, () => {})
    } finally {
      setSwitching(false)
    }
  }

  const signOut = () => void supabase.auth.signOut()

  if (!session) {
    return (
      <main className="p-8">
        {error ? (
          <>
            <p role="alert" className="text-clay-600">
              {error}
            </p>
            <button onClick={signOut} className="mt-4 text-brand-700 hover:underline">
              Sign out
            </button>
          </>
        ) : (
          <p className="text-paper-500">Loading…</p>
        )}
      </main>
    )
  }

  const ActiveScreen = ROLE_SCREENS[session.activeRole]
  return (
    <>
      <header className="border-b border-paper-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <span className="font-semibold text-paper-900">SAEX Credit Transfer</span>
          <span className="text-sm text-paper-600">
            {session.displayName}
            {session.homeInstitution ? ` · ${session.homeInstitution.name}` : ''}
          </span>
          <div className="ml-auto flex items-center gap-3">
            {session.roles.length > 1 ? (
              <label className="text-sm">
                <span className="mr-2 text-paper-600">Acting as</span>
                <select
                  value={session.activeRole}
                  disabled={switching}
                  onChange={(e) => void switchRole(e.target.value as Role)}
                  className="rounded border border-paper-300 px-2 py-1"
                >
                  {session.roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="text-sm text-paper-600">{session.activeRole}</span>
            )}
            <button onClick={signOut} className="text-sm text-brand-700 hover:underline">
              Sign out
            </button>
          </div>
        </div>
      </header>
      {error && (
        <p role="alert" className="mx-auto w-full max-w-4xl px-4 pt-4 text-clay-600">
          {error}
        </p>
      )}
      <ActiveScreen key={session.activeRole} userId={session.userId} />
    </>
  )
}
