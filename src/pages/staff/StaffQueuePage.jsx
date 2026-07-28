import { useMemo, useState } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { programName } from '../../data/programs.js'
import { caseConfidence, caseCoursesWithMatch, caseHasStaleGuide } from '../../lib/caseHelpers.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfidenceBadge from '../../components/ui/ConfidenceBadge.jsx'
import Badge from '../../components/ui/Badge.jsx'

export default function StaffQueuePage({ onOpenCase }) {
  const { cases } = useAppData()
  const [sort, setSort] = useState('confidence-asc')

  const pending = useMemo(() => {
    let list = cases
      .filter((c) => c.stage === 'Submitted')
      .map((c) => ({ studyCase: c, confidence: caseConfidence(c), stale: caseHasStaleGuide(c) }))
    list.sort((a, b) => (sort === 'confidence-asc' ? a.confidence - b.confidence : b.confidence - a.confidence))
    return list
  }, [cases, sort])

  const highCount = pending.filter((p) => p.confidence >= 80).length
  const lowCount = pending.filter((p) => p.confidence < 60).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-paper-900">Review queue</h1>
        <p className="text-sm text-paper-500">Study plans awaiting a decision, ranked by match confidence.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Pending cases</p>
          <p className="mt-1 text-2xl font-semibold text-paper-900">{pending.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">High confidence</p>
          <p className="mt-1 text-2xl font-semibold text-sage-700">{highCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Needs close review</p>
          <p className="mt-1 text-2xl font-semibold text-clay-700">{lowCount}</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-paper-500">{pending.length} case(s) in queue</p>
        <div className="flex items-center gap-2 text-sm text-paper-500">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-paper-300 bg-white px-2 py-1.5 text-paper-700 focus:border-brand-400 focus:outline-none"
          >
            <option value="confidence-asc">Lowest confidence first</option>
            <option value="confidence-desc">Highest confidence first</option>
          </select>
        </div>
      </div>

      {pending.length === 0 ? (
        <Card className="p-8 text-center text-sm text-paper-500">Queue is empty — nothing awaiting review.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map(({ studyCase, confidence, stale }) => {
            const student = studentById(studyCase.studentId)
            const entries = caseCoursesWithMatch(studyCase)
            return (
              <Card key={studyCase.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-paper-900">{student?.name}</p>
                    <span className="text-xs text-paper-400">{student?.studentId}</span>
                    {stale && <Badge tone="medium">Guide needs review</Badge>}
                  </div>
                  <p className="text-xs text-paper-500">{programName(student?.programId)}</p>
                  <p className="text-sm text-paper-600">
                    {entries.map((e) => e.course.hostCourseTitle).join(', ')}
                  </p>
                  <p className="text-xs text-paper-400">Submitted {studyCase.submittedDate}</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <ConfidenceBadge confidence={confidence} />
                  <Button size="sm" onClick={() => onOpenCase(studyCase.id)}>
                    Review case
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
