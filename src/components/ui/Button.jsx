const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 disabled:bg-paper-300 disabled:text-paper-500',
  secondary:
    'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 disabled:text-paper-400 disabled:border-paper-200',
  success: 'bg-sage-600 text-white hover:bg-sage-700 disabled:bg-paper-300 disabled:text-paper-500',
  ghost: 'text-paper-600 hover:bg-paper-200 disabled:text-paper-300',
  danger: 'bg-clay-600 text-white hover:bg-clay-700 disabled:bg-paper-300 disabled:text-paper-500',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
