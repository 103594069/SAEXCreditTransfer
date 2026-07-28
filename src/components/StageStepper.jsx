import { STAGES } from '../context/AppDataContext.jsx'

export default function StageStepper({ studyCase }) {
  const visited = new Set(studyCase.timeline.map((t) => t.stage))
  const currentIndex = STAGES.indexOf(studyCase.stage)

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      {STAGES.map((stage, i) => {
        const isCurrent = i === currentIndex
        const isPast = i < currentIndex
        const wasVisited = visited.has(stage)
        const entry = studyCase.timeline.find((t) => t.stage === stage)
        const state = isCurrent ? 'current' : isPast ? (wasVisited ? 'done' : 'skipped') : 'upcoming'

        return (
          <li key={stage} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-stretch sm:gap-2">
            <div className="flex items-center sm:w-full">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  state === 'done'
                    ? 'border-sage-600 bg-sage-600 text-white'
                    : state === 'current'
                      ? 'border-brand-600 bg-white text-brand-700'
                      : state === 'skipped'
                        ? 'border-paper-300 bg-paper-100 text-paper-400'
                        : 'border-paper-300 bg-white text-paper-400'
                }`}
              >
                {state === 'done' ? (
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <div className={`hidden h-0.5 flex-1 sm:block ${isPast ? 'bg-sage-600' : 'bg-paper-200'}`} />
            </div>
            <div className="pb-6 sm:pb-0">
              <p className={`text-sm font-medium ${state === 'upcoming' ? 'text-paper-400' : 'text-paper-900'}`}>
                {stage}
              </p>
              {state === 'skipped' && <p className="text-xs text-paper-400">Not required for this case</p>}
              {entry && <p className="text-xs text-paper-500">{entry.date}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
