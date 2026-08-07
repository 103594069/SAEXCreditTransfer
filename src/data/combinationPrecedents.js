export const COMBINATION_PRECEDENTS_SEED_VERSION = 1

// Historical record of a *complete* course package being approved together
// as a unit — distinct from src/data/precedents.js, which tracks precedent
// per individual course. Each entry here is keyed to an existing
// SEMESTER_LOADS id, since a "past combination" is always a full semester
// load (the same granularity shortlisting already uses), never a partial
// set of courses.
const COMBINATION_HISTORY = [
  { loadId: 'load-toronto-bp094', years: [2022, 2023, 2024, 2024, 2025] },
  { loadId: 'load-nus-bp094', years: [2022, 2023, 2025] },
  { loadId: 'load-manchester-bp094', years: [2021] },
  { loadId: 'load-cbs-bp250', years: [2022, 2023, 2024, 2025] },
  { loadId: 'load-uam-bp250', years: [2020, 2022] },
  { loadId: 'load-nus-bp217', years: [2023, 2024, 2024, 2025] },
  { loadId: 'load-ucb-bp217', years: [2024] },
]

export function buildSeedCombinationPrecedents() {
  const records = []
  for (const { loadId, years } of COMBINATION_HISTORY) {
    years.forEach((year, i) => {
      records.push({ id: `combo-${loadId}-${i}`, loadId, year })
    })
  }
  return records
}
