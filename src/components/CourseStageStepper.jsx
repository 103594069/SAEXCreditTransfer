import { COURSE_STAGES } from '../context/AppDataContext.jsx'

const DECISION_TONE = {
  Approved: { border: 'border-sage-600', bg: 'bg-sage-600', text: 'text-white' },
  Denied: { border: 'border-clay-600', bg: 'bg-clay-600', text: 'text-white' },
  'More Info Requested': { border: 'border-amber-500', bg: 'bg-amber-500', text: 'text-white' },
}

export default function CourseStageStepper({ course }) {
  const isDecided = !COURSE_STAGES.includes(course.stage)
  const currentIndex = isDecided ? COURSE_STAGES.length : COURSE_STAGES.indexOf(course.stage)

  const steps = [...COURSE_STAGES, isDecided ? course.stage : 'Decision']

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      {steps.map((label, i) => {
        const isFinal = i === steps.length - 1
        const isCurrent = i === currentIndex
        const isPast = i < currentIndex
        const entry =
          isFinal && !isDecided ? null : course.timeline.find((t) => t.stage === (isFinal ? course.stage : label))
        const decisionTone = isFinal && isDecided ? DECISION_TONE[course.stage] : null

        return (
          <li key={label + i} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-stretch sm:gap-2">
            <div className="flex items-center sm:w-full">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  decisionTone
                    ? `${decisionTone.border} ${decisionTone.bg} ${decisionTone.text}`
                    : isPast
                      ? 'border-sage-600 bg-sage-600 text-white'
                      : isCurrent
                        ? 'border-brand-600 bg-white text-brand-700'
                        : 'border-paper-300 bg-white text-paper-400'
                }`}
              >
                {isPast || decisionTone ? (
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <path
                      d="M3 8.5L6.5 12L13 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <div className={`hidden h-0.5 flex-1 sm:block ${isPast ? 'bg-sage-600' : 'bg-paper-200'}`} />
            </div>
            <div className="pb-6 sm:pb-0">
              <p
                className={`text-sm font-medium ${
                  !isPast && !isCurrent && !decisionTone ? 'text-paper-400' : 'text-paper-900'
                }`}
              >
                {isFinal && !isDecided ? 'Decision pending' : label}
              </p>
              {entry && <p className="text-xs text-paper-500">{entry.date}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
