import { useState } from 'react'
import { AppDataProvider, useAppData } from './context/AppDataContext.jsx'
import Header from './components/Header.jsx'
import StudentSearchPage from './pages/student/StudentSearchPage.jsx'
import StudentPlanPage from './pages/student/StudentPlanPage.jsx'
import StudentStatusPage from './pages/student/StudentStatusPage.jsx'
import StaffQueuePage from './pages/staff/StaffQueuePage.jsx'
import StaffCasePage from './pages/staff/StaffCasePage.jsx'
import StaffBoardPage from './pages/staff/StaffBoardPage.jsx'

function AppShell() {
  const { role } = useAppData()
  const [studentPage, setStudentPage] = useState('search')
  const [staffPage, setStaffPage] = useState('queue')
  const [selectedCaseId, setSelectedCaseId] = useState(null)

  function openCase(caseId) {
    setSelectedCaseId(caseId)
    setStaffPage('case')
  }

  function navigate(page) {
    if (role === 'student') {
      setStudentPage(page)
    } else {
      if (page !== 'case') setSelectedCaseId(null)
      setStaffPage(page)
    }
  }

  const activePage = role === 'student' ? studentPage : staffPage

  return (
    <div className="flex min-h-screen flex-col bg-paper-100">
      <Header page={role === 'staff' && staffPage === 'case' ? 'queue' : activePage} onNavigate={navigate} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {role === 'student' && studentPage === 'search' && <StudentSearchPage onNavigate={navigate} />}
        {role === 'student' && studentPage === 'plan' && <StudentPlanPage onNavigate={navigate} />}
        {role === 'student' && studentPage === 'status' && <StudentStatusPage onNavigate={navigate} />}

        {role === 'staff' && staffPage === 'queue' && <StaffQueuePage onOpenCase={openCase} />}
        {role === 'staff' && staffPage === 'board' && <StaffBoardPage onOpenCase={openCase} />}
        {role === 'staff' && staffPage === 'case' && (
          <StaffCasePage caseId={selectedCaseId} onBack={() => navigate('queue')} />
        )}
      </main>
      <footer className="border-t border-paper-200 bg-white py-4 text-center text-xs text-paper-400">
        Prototype for stakeholder review — all data is mocked and stored locally in your browser.
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppDataProvider>
      <AppShell />
    </AppDataProvider>
  )
}
