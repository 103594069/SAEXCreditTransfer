import { useMemo, useState } from 'react'
import { HOST_COURSES } from '../../data/hostCourses.js'
import { computeMatch } from '../../lib/matching.js'
import { CURRENT_STUDENT } from '../../data/students.js'
import { useAppData } from '../../context/AppDataContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfidenceBadge from '../../components/ui/ConfidenceBadge.jsx'

function peerPrecedentLine(course) {
  const entry = course.peerPrecedent.find((p) => p.programId === CURRENT_STUDENT.programId)
  if (!entry) return 'No prior matches from your program yet — you would be an early precedent.'
  if (entry.count === 1) return '1 student in your program matched this course previously.'
  return `${entry.count} students in your program matched this course previously.`
}

export default function StudentSearchPage({ onNavigate }) {
  const { draftPlan, toggleCourse, currentStudentCase } = useAppData()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('confidence')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = HOST_COURSES.map((course) => ({ course, match: computeMatch(course) }))
    if (q) {
      list = list.filter(({ course }) =>
        [course.hostInstitution, course.hostCourseTitle, course.hostCourseCode, course.discipline, course.rmit.title]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    }
    list.sort((a, b) =>
      sort === 'confidence' ? b.match.confidence - a.match.confidence : a.course.hostInstitution.localeCompare(b.course.hostInstitution),
    )
    return list
  }, [query, sort])

  const locked = Boolean(currentStudentCase)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Find host courses</h1>
        <p className="mt-1 text-sm text-paper-500">
          Search host institution courses and see how strongly each one is likely to match RMIT credit.
        </p>
      </div>

      {locked && (
        <Card className="border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Your study plan has already been submitted and is being reviewed. You can browse courses here, but the
          plan itself is locked — check{' '}
          <button className="font-medium underline underline-offset-2" onClick={() => onNavigate('status')}>
            My Application
          </button>{' '}
          for progress.
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by course title, institution, or discipline…"
          className="w-full rounded-lg border border-paper-300 bg-white px-4 py-2.5 text-sm text-paper-800 placeholder:text-paper-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:max-w-md"
        />
        <div className="flex items-center gap-2 text-sm text-paper-500">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-paper-300 bg-white px-2 py-1.5 text-paper-700 focus:border-brand-400 focus:outline-none"
          >
            <option value="confidence">Match confidence</option>
            <option value="institution">Institution</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-paper-500">
        {results.length} course{results.length === 1 ? '' : 's'} found
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {results.map(({ course, match }) => {
          const inPlan = draftPlan.courseIds.includes(course.id)
          return (
            <Card key={course.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-paper-400">
                    {course.hostInstitution} · {course.hostCountry}
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold text-paper-900">{course.hostCourseTitle}</h3>
                  <p className="text-xs text-paper-500">
                    {course.hostCourseCode} · {course.hostCredits}
                  </p>
                </div>
                <ConfidenceBadge confidence={match.confidence} />
              </div>

              <div className="rounded-lg bg-paper-50 px-3 py-2 text-sm text-paper-700">
                <span className="text-paper-500">Maps to </span>
                <span className="font-medium">{course.rmit.code} — {course.rmit.title}</span>
                <span className="text-paper-500"> ({course.rmit.creditPoints}cp)</span>
              </div>

              <p className="flex items-start gap-1.5 text-sm text-paper-600">
                <span aria-hidden className="mt-0.5 text-brand-500">◆</span>
                {peerPrecedentLine(course)}
              </p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <button
                  className="text-xs text-paper-400 hover:text-paper-600"
                  onClick={(e) => e.currentTarget.blur()}
                  title="Learning outcome overlap, duration alignment and precedent status are scored on the staff case view."
                >
                  Why this score?
                </button>
                <Button
                  variant={inPlan ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={locked}
                  onClick={() => toggleCourse(course.id)}
                >
                  {inPlan ? 'Remove from plan' : 'Add to study plan'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
