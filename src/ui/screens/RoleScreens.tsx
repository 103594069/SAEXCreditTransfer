import type { ReactNode } from 'react'
import type { RoleHome } from '../../service/creditApproval.ts'
import { creditApproval } from '../creditApproval.ts'
import { errorMessage, useAsync } from '../useAsync.ts'

function Screen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-paper-900">{title}</h1>
      <div className="mt-4 rounded-lg border border-paper-200 bg-white p-6">{children}</div>
    </main>
  )
}

function AsyncView<T>({ state, children }: { state: ReturnType<typeof useAsync<T>>; children: (value: T) => ReactNode }) {
  if (state.status === 'loading') return <p className="text-paper-500">Loading…</p>
  if (state.status === 'failed')
    return (
      <p role="alert" className="text-clay-600">
        {errorMessage(state.error)}
      </p>
    )
  return <>{children(state.value)}</>
}

function HomeScreen({ title, load, userId, intro }: { title: string; load: (userId: string) => Promise<RoleHome>; userId: string; intro: string }) {
  const state = useAsync(() => load(userId), userId)
  return (
    <Screen title={title}>
      <AsyncView state={state}>
        {(home) => (
          <>
            <p>
              Welcome, {home.displayName}. {home.homeInstitution ? `You are at ${home.homeInstitution.name}.` : ''}
            </p>
            <p className="mt-2 text-paper-600">{intro}</p>
          </>
        )}
      </AsyncView>
    </Screen>
  )
}

export function OperatorScreen({ userId }: { userId: string }) {
  const state = useAsync(() => creditApproval.operatorHome(userId), userId)
  return (
    <Screen title="Operator">
      <AsyncView state={state}>
        {(home) => (
          <>
            <p>Welcome, {home.displayName}. You run the shared catalogue across every Home Institution.</p>
            <h2 className="mt-4 font-semibold">Home Institutions</h2>
            <ul className="mt-2 list-disc pl-5">
              {home.homeInstitutions.map((h) => (
                <li key={h.id}>{h.name}</li>
              ))}
            </ul>
          </>
        )}
      </AsyncView>
    </Screen>
  )
}

export function StudentScreen({ userId }: { userId: string }) {
  return <HomeScreen title="Student" userId={userId} load={creditApproval.studentHome} intro="Your eligibility and Study Plans will appear here." />
}

export function StaffScreen({ userId }: { userId: string }) {
  return (
    <HomeScreen title="Staff" userId={userId} load={creditApproval.staffHome} intro="Submitted Study Plans awaiting a Staff Check will appear here." />
  )
}

export function AssessorScreen({ userId }: { userId: string }) {
  return (
    <HomeScreen title="Assessor" userId={userId} load={creditApproval.assessorHome} intro="Study Plans With Assessor for your Program will appear here." />
  )
}

export function InstitutionAdminScreen({ userId }: { userId: string }) {
  return (
    <HomeScreen
      title="Institution Admin"
      userId={userId}
      load={creditApproval.institutionAdminHome}
      intro="Programs, Home Units, eligibility thresholds and Assessor assignments will be managed here."
    />
  )
}
