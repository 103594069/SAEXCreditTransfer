const TONES = {
  neutral: 'bg-paper-200 text-paper-700',
  brand: 'bg-brand-100 text-brand-700',
  high: 'bg-sage-100 text-sage-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-clay-100 text-clay-700',
}

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
