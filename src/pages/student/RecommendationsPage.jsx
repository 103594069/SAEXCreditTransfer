import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { rankInstitutions } from '../../lib/recommendations.js'
import { rmitUnitById } from '../../data/rmitUnits.js'
import ProfilePanel from '../../components/ProfilePanel.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'

export default function RecommendationsPage({ onViewInstitution }) {
  const { currentStudent, precedents, currentStudentApplication } = useAppData()

  const ranked = useMemo(
    () => (currentStudent ? rankInstitutions(currentStudent, precedents) : []),
    [currentStudent, precedents],
  )

  if (!currentStudent) return null

  const locked = Boolean(currentStudentApplication)

  return (
    <div className="flex flex-col gap-6">
      <ProfilePanel student={currentStudent} />

      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Recommended partner institutions</h1>
        <p className="mt-1 text-sm text-paper-500">
          Ranked using historical outcomes from students in your degree and coverage of your remaining units.
        </p>
      </div>

      {locked && (
        <Card className="border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You've already submitted a shortlist — you can still browse institutions here, but a new shortlist can't
          be started until your current application is resolved.
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {ranked.map(({ load, institution, courses, matchedRemainingUnits, reasonNote }, index) => (
          <Card key={load.id} className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                    {index + 1}
                  </span>
                  <h2 className="text-base font-semibold text-paper-900">{institution.name}</h2>
                  <span className="text-xs text-paper-400">{institution.country}</span>
                </div>
                <p className="mt-1.5 text-sm text-paper-600">{reasonNote}</p>
              </div>
              <Badge tone={matchedRemainingUnits.length > 0 ? 'brand' : 'neutral'}>
                {matchedRemainingUnits.length} of {currentStudent.remainingUnitIds.length} remaining units covered
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {courses.map((c) => {
                const unit = rmitUnitById(c.rmitUnitId)
                const isRemaining = currentStudent.remainingUnitIds.includes(c.rmitUnitId)
                return (
                  <span
                    key={c.id}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      isRemaining
                        ? 'border-brand-200 bg-brand-50 text-brand-700'
                        : 'border-paper-200 bg-paper-50 text-paper-500'
                    }`}
                  >
                    {c.hostCourseTitle} → {unit.code}
                  </span>
                )
              })}
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => onViewInstitution(load.id)}>
                View full semester load
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
