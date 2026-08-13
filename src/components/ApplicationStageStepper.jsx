import { APPLICATION_STAGES } from '../context/AppDataContext.jsx'

// The 4-course shortlist moves through the pipeline as a single unit, so
// this stepper is driven entirely by the application's shared stage —
// never by an individual course. Decision Pending is the terminal stage
// here; what happens to each course after that is shown elsewhere (see
// the per-course decision badges in the Full Shortlist panel / status
// pages), not as a further step in this stepper.
export default function ApplicationStageStepper({ application }) {
  const currentIndex = APPLICATION_STAGES.indexOf(application.stage)

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      {APPLICATION_STAGES.map((label, i) => {
        const isCurrent = i === currentIndex
        const isPast = i < currentIndex
        const entry = application.timeline.find((t) => t.stage === label)

        return (
          <li key={label} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-stretch sm:gap-2">
            <div className="flex items-center sm:w-full">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  isPast
                    ? 'border-sage-600 bg-sage-600 text-white'
                    : isCurrent
                      ? 'border-brand-600 bg-white text-brand-700'
                      : 'border-paper-300 bg-white text-paper-400'
                }`}
              >
                {isPast ? (
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
              <p className={`text-sm font-medium ${!isPast && !isCurrent ? 'text-paper-400' : 'text-paper-900'}`}>
                {label}
              </p>
              {entry && <p className="text-xs text-paper-500">{entry.date}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
