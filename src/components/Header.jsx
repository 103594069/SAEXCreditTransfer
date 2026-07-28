import { useAppData } from '../context/AppDataContext.jsx'
import { CURRENT_STUDENT } from '../data/students.js'

const STUDENT_NAV = [
  { id: 'search', label: 'Find Courses' },
  { id: 'plan', label: 'Study Plan' },
  { id: 'status', label: 'My Application' },
]

const STAFF_NAV = [
  { id: 'queue', label: 'Review Queue' },
  { id: 'board', label: 'Status Board' },
]

export default function Header({ page, onNavigate }) {
  const { role, setRole } = useAppData()
  const nav = role === 'student' ? STUDENT_NAV : STAFF_NAV

  return (
    <header className="border-b border-paper-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
              R
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-paper-900">SAEX Credit Transfer</p>
              <p className="text-xs text-paper-500">RMIT Study Abroad Exchange</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  page === item.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-paper-600 hover:bg-paper-100 hover:text-paper-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {role === 'student' && (
            <div className="hidden text-right text-xs text-paper-500 sm:block">
              <p className="font-medium text-paper-800">{CURRENT_STUDENT.name}</p>
              <p>{CURRENT_STUDENT.studentId}</p>
            </div>
          )}
          <div className="flex items-center rounded-full border border-paper-300 bg-paper-100 p-1 text-sm">
            <button
              onClick={() => setRole('student')}
              className={`rounded-full px-3 py-1 font-medium transition-colors ${
                role === 'student' ? 'bg-brand-600 text-white shadow-sm' : 'text-paper-600 hover:text-paper-900'
              }`}
            >
              Student view
            </button>
            <button
              onClick={() => setRole('staff')}
              className={`rounded-full px-3 py-1 font-medium transition-colors ${
                role === 'staff' ? 'bg-brand-600 text-white shadow-sm' : 'text-paper-600 hover:text-paper-900'
              }`}
            >
              Staff view
            </button>
          </div>
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-paper-100 px-6 py-2 md:hidden">
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              page === item.id ? 'bg-brand-50 text-brand-700' : 'text-paper-600 hover:bg-paper-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
