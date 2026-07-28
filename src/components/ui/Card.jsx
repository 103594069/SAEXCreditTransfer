export default function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={`rounded-xl border border-paper-200 bg-white shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
