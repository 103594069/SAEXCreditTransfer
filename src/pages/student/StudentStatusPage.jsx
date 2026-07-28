import { useAppData } from '../../context/AppDataContext.jsx'
import { courseById } from '../../data/hostCourses.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import StageStepper from '../../components/StageStepper.jsx'

export default function StudentStatusPage({ onNavigate }) {
  const { currentStudentCase } = useAppData()

  if (!currentStudentCase) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-paper-900">My application</h1>
          <p className="mt-1 text-sm text-paper-500">Track your credit transfer application here once submitted.</p>
        </div>
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-sm text-paper-500">You haven't submitted a study plan yet.</p>
          <Button onClick={() => onNavigate('search')}>Find courses to get started</Button>
        </Card>
      </div>
    )
  }

  const courses = currentStudentCase.courseIds.map((id) => courseById(id)).filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">My application</h1>
        <p className="mt-1 text-sm text-paper-500">
          Submitted {currentStudentCase.submittedDate} · Last updated {currentStudentCase.lastUpdated}
        </p>
      </div>

      <Card className="p-6">
        <StageStepper studyCase={currentStudentCase} />
      </Card>

      {currentStudentCase.staffNote && (
        <Card className="border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
          <p className="font-medium">Latest update from staff</p>
          <p className="mt-1 text-brand-700">{currentStudentCase.staffNote}</p>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-paper-900">Courses in this application</h2>
        <ul className="flex flex-col divide-y divide-paper-100">
          {courses.map((course) => (
            <li key={course.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-paper-900">{course.hostCourseTitle}</p>
                <p className="text-xs text-paper-500">
                  {course.hostInstitution} · maps to {course.rmit.code} ({course.rmit.creditPoints}cp)
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {currentStudentCase.stage === 'Transcript Received' && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-paper-900">Transcript matching</h2>
          <p className="mt-1 text-sm text-paper-500">
            {currentStudentCase.transcriptStatus === 'pending manual match'
              ? 'Your host transcript has arrived. RMIT staff are manually matching grades to your record — this is usually the slowest step.'
              : 'Your host transcript has been matched to your RMIT record.'}
          </p>
        </Card>
      )}
    </div>
  )
}
