import { useAppData } from '../context/AppDataContext.jsx'

const STUDENT_NAV = [
  { id: 'profile', label: 'Profile' },
  { id: 'recommendations', label: 'Find Institutions' },
  { id: 'submit', label: 'My Shortlist' },
  { id: 'status', label: 'My Application' },
  { id: 'board', label: 'Status Board' },
]

const STAFF_NAV = [
  { id: 'queue', label: 'Review Queue' },
  { id: 'board', label: 'Status Board' },
]

const ASSESSOR_NAV = [
  { id: 'queue', label: 'Assessor Queue' },
  { id: 'board', label: 'Status Board' },
]

const ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'staff', label: 'Staff' },
  { id: 'assessor', label: 'Assessor' },
]

export default function Header({ page, onNavigate }) {
  const { role, setRole, currentStudent, logout } = useAppData()
  const nav = role === 'student' ? STUDENT_NAV : role === 'staff' ? STAFF_NAV : ASSESSOR_NAV

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
          {(role !== 'student' || currentStudent) && (
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
          )}
        </div>

        <div className="flex items-center gap-4">
          {role === 'student' && currentStudent && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="text-right text-xs text-paper-500">
                <p className="font-medium text-paper-800">{currentStudent.name}</p>
                <p>{currentStudent.studentId}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-md border border-paper-300 px-2 py-1 text-xs font-medium text-paper-600 hover:bg-paper-100"
              >
                Switch student
              </button>
            </div>
          )}
          <div className="flex items-center rounded-full border border-paper-300 bg-paper-100 p-1 text-sm">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  role === r.id ? 'bg-brand-600 text-white shadow-sm' : 'text-paper-600 hover:text-paper-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {(role !== 'student' || currentStudent) && (
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
      )}
    </header>
  )
}
