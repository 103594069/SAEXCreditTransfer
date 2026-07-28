import { useState } from 'react'
import { AppDataProvider, useAppData } from './context/AppDataContext.jsx'
import Header from './components/Header.jsx'
import LoginPage from './pages/student/LoginPage.jsx'
import RecommendationsPage from './pages/student/RecommendationsPage.jsx'
import InstitutionDetailPage from './pages/student/InstitutionDetailPage.jsx'
import SubmissionPage from './pages/student/SubmissionPage.jsx'
import StudentStatusPage from './pages/student/StudentStatusPage.jsx'
import StaffQueuePage from './pages/staff/StaffQueuePage.jsx'
import StaffCourseDetailPage from './pages/staff/StaffCourseDetailPage.jsx'
import AssessorQueuePage from './pages/assessor/AssessorQueuePage.jsx'
import AssessorCourseDetailPage from './pages/assessor/AssessorCourseDetailPage.jsx'
import StatusBoardPage from './pages/shared/StatusBoardPage.jsx'

function AppShell() {
  const { role, currentStudent } = useAppData()
  const [studentPage, setStudentPage] = useState('recommendations')
  const [staffPage, setStaffPage] = useState('queue')
  const [assessorPage, setAssessorPage] = useState('queue')
  const [selectedLoadId, setSelectedLoadId] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null) // { applicationId, courseId }

  function viewInstitution(loadId) {
    setSelectedLoadId(loadId)
    setStudentPage('institution')
  }

  function openStaffCourse(applicationId, courseId) {
    setSelectedCourse({ applicationId, courseId })
    setStaffPage('course')
  }

  function openAssessorCourse(applicationId, courseId) {
    setSelectedCourse({ applicationId, courseId })
    setAssessorPage('course')
  }

  function navigate(page) {
    if (role === 'student') {
      setStudentPage(page)
    } else if (role === 'staff') {
      if (page !== 'course') setSelectedCourse(null)
      setStaffPage(page)
    } else {
      if (page !== 'course') setSelectedCourse(null)
      setAssessorPage(page)
    }
  }

  const activePage =
    role === 'student'
      ? studentPage === 'institution'
        ? 'recommendations'
        : studentPage
      : role === 'staff'
        ? staffPage === 'course'
          ? 'queue'
          : staffPage
        : assessorPage === 'course'
          ? 'queue'
          : assessorPage

  const showLogin = role === 'student' && !currentStudent

  return (
    <div className="flex min-h-screen flex-col bg-paper-100">
      <Header page={activePage} onNavigate={navigate} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {showLogin && <LoginPage />}

        {!showLogin && role === 'student' && studentPage === 'recommendations' && (
          <RecommendationsPage onViewInstitution={viewInstitution} />
        )}
        {!showLogin && role === 'student' && studentPage === 'institution' && (
          <InstitutionDetailPage
            loadId={selectedLoadId}
            onBack={() => navigate('recommendations')}
            onNavigate={navigate}
          />
        )}
        {!showLogin && role === 'student' && studentPage === 'submit' && <SubmissionPage onNavigate={navigate} />}
        {!showLogin && role === 'student' && studentPage === 'status' && <StudentStatusPage onNavigate={navigate} />}
        {!showLogin && role === 'student' && studentPage === 'board' && <StatusBoardPage />}

        {role === 'staff' && staffPage === 'queue' && <StaffQueuePage onOpenCourse={openStaffCourse} />}
        {role === 'staff' && staffPage === 'board' && <StatusBoardPage />}
        {role === 'staff' && staffPage === 'course' && (
          <StaffCourseDetailPage
            applicationId={selectedCourse?.applicationId}
            courseId={selectedCourse?.courseId}
            onBack={() => navigate('queue')}
          />
        )}

        {role === 'assessor' && assessorPage === 'queue' && <AssessorQueuePage onOpenCourse={openAssessorCourse} />}
        {role === 'assessor' && assessorPage === 'board' && <StatusBoardPage />}
        {role === 'assessor' && assessorPage === 'course' && (
          <AssessorCourseDetailPage
            applicationId={selectedCourse?.applicationId}
            courseId={selectedCourse?.courseId}
            onBack={() => navigate('queue')}
          />
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
