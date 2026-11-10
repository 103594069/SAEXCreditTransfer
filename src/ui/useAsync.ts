import { useEffect, useState } from 'react'

export type AsyncState<T> = { status: 'loading' } | { status: 'ready'; value: T } | { status: 'failed'; error: unknown }

/** Runs `load` when `key` changes and tracks its result. */
export function useAsync<T>(load: () => Promise<T>, key: unknown): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  useEffect(() => {
    let current = true
    setState({ status: 'loading' })
    load().then(
      (value) => current && setState({ status: 'ready', value }),
      (error: unknown) => current && setState({ status: 'failed', error }),
    )
    return () => {
      current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when the key changes
  }, [key])
  return state
}

/** A readable message for an error, including Supabase's plain-object errors. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return 'Something went wrong.'
}
