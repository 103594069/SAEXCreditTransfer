import type { OutlineComparison, OutlineComparisonRequest, OutlineComparisonResult } from '../../service/ports.ts'

/** Scripted fake: returns a fixed result and records each request. */
export function createFakeOutlineComparison(
  result: OutlineComparisonResult = { contentOverlapScore: 'Moderate', explanation: 'Scripted result.', suggestion: null },
) {
  const requests: OutlineComparisonRequest[] = []
  const port: OutlineComparison = {
    async compare(request) {
      requests.push(request)
      return result
    },
  }
  return { port, requests }
}
