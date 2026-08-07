const ICONS = {
  pass: (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
      <path d="M8 5.5v3.5M8 11.5h.01M2.5 13h11L8 2.5 2.5 13z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  fail: (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

const TONE = {
  pass: 'border-sage-200 bg-sage-50 text-sage-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  fail: 'border-clay-200 bg-clay-50 text-clay-700',
}

const ICON_TONE = {
  pass: 'bg-sage-600 text-white',
  warning: 'bg-amber-500 text-white',
  fail: 'bg-clay-600 text-white',
}

export default function EligibilityCheckRow({ state, title, detail }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3.5 ${TONE[state]}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ICON_TONE[state]}`}>
        {ICONS[state]}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs opacity-90">{detail}</p>
      </div>
    </div>
  )
}
