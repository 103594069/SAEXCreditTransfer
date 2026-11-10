import { useState, type FormEvent } from 'react'
import { supabase } from '../creditApproval.ts'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../demoAccounts.ts'

export function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function signIn(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError(error.message)
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-paper-900">SAEX Credit Transfer</h1>
      <p className="mt-1 text-paper-600">Sign in with your email.</p>

      <form onSubmit={signIn} className="mt-6 space-y-4 rounded-lg border border-paper-200 bg-white p-6">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-paper-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-paper-300 px-3 py-2"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-clay-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <section className="mt-6 rounded-lg border border-paper-200 bg-paper-50 p-4">
        <h2 className="text-sm font-semibold">Demo accounts</h2>
        <p className="mt-1 text-sm text-paper-600">
          Password for every demo account: <code>{DEMO_PASSWORD}</code>. Choose one to fill the form.
        </p>
        <ul className="mt-3 space-y-1">
          {DEMO_ACCOUNTS.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                onClick={() => {
                  setEmail(account.email)
                  setPassword(DEMO_PASSWORD)
                }}
                className="text-left text-sm text-brand-700 hover:underline"
              >
                {account.email} <span className="text-paper-500">({account.roles.join(', ')})</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
