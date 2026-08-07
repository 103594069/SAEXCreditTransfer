import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { loadsForProgram } from '../../data/semesterLoads.js'
import { partnerCourseById } from '../../data/partnerCourses.js'
import { institutionById } from '../../data/partnerInstitutions.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import { remainingUnitIds } from '../../data/students.js'
import { computeCombinationPrecedentScore } from '../../lib/precedentScoring.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import CombinationPrecedentBadge from '../../components/CombinationPrecedentBadge.jsx'
import PreliminaryBanner from '../../components/PreliminaryBanner.jsx'

export default function PastCombinationsPage({ onNavigate }) {
  const {
    currentStudent,
    combinationPrecedents,
    selectLoad,
    shortlistDraft,
    currentStudentApplication,
    currentStudentEligibility,
  } = useAppData()

  const combinations = useMemo(() => {
    if (!currentStudent) return []
    const remaining = remainingUnitIds(currentStudent)
    const list = loadsForProgram(currentStudent.programId).map((load) => {
      const courses = load.partnerCourseIds
        .map((id) => partnerCourseById(id))
        .map((course) => ({ course, applies: remaining.includes(course.rmitUnitId) }))
      const matchedCount = courses.filter((c) => c.applies).length
      return {
        load,
        institution: institutionById(load.institutionId),
        courses,
        matchedCount,
        precedent: computeCombinationPrecedentScore(load.id, combinationPrecedents),
      }
    })
    list.sort((a, b) => b.precedent.count - a.precedent.count || b.matchedCount - a.matchedCount)
    return list
  }, [currentStudent, combinationPrecedents])

  if (!currentStudent) return null

  const locked = Boolean(currentStudentApplication)

  return (
    <div className="flex flex-col gap-6">
      {currentStudentEligibility?.overallStatus === 'On Track' && <PreliminaryBanner />}

      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Past combinations</h1>
        <p className="mt-1 text-sm text-paper-500">
          Full course packages previously approved for students in your degree, most established first.
        </p>
      </div>

      {locked && (
        <Card className="border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You've already submitted a shortlist — you can still browse past combinations here, but a new shortlist
          can't be started until your current application is resolved.
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {combinations.map(({ load, institution, courses, matchedCount, precedent }) => {
          const isSelected = shortlistDraft.loadId === load.id
          return (
            <Card key={load.id} className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-paper-900">{institution.name}</h2>
                  <p className="text-xs text-paper-400">{institution.country}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <CombinationPrecedentBadge precedent={precedent} />
                  <Badge tone={matchedCount > 0 ? 'brand' : 'neutral'}>
                    {matchedCount} of {courses.length} mapped units still apply to you
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-paper-500">{precedent.note}</p>

              <ul className="flex flex-col divide-y divide-paper-100">
                {courses.map(({ course, applies }) => {
                  const unit = rmitUnitById(course.rmitUnitId)
                  return (
                    <li key={course.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className={`text-sm font-medium ${applies ? 'text-paper-900' : 'text-paper-400'}`}>
                          {course.hostCourseTitle}
                        </p>
                        <p className="text-xs text-paper-500">
                          {course.hostCourseCode} · maps to {unit.code} — {unit.title}
                        </p>
                      </div>
                      {!applies && <Badge tone="neutral">Already completed</Badge>}
                    </li>
                  )
                })}
              </ul>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  disabled={locked}
                  onClick={() => {
                    selectLoad(load.id)
                    onNavigate('submit')
                  }}
                >
                  {isSelected ? 'View shortlist' : 'Shortlist this combination'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
