import type { OutlineComparison, OutlineComparisonResult } from '../../service/ports.ts'
import type { SupabaseClient } from './client.ts'

/**
 * Outline Comparison through the `compare-outlines` server function, the only place
 * that will know the AI provider. The provider and the function arrive with the first AI ticket.
 */
export function createServerOutlineComparison(client: SupabaseClient): OutlineComparison {
  return {
    async compare(request) {
      const { data, error } = await client.functions.invoke<OutlineComparisonResult>('compare-outlines', {
        body: request,
      })
      if (error) throw error
      if (!data) throw new Error('compare-outlines returned no result')
      return data
    },
  }
}
