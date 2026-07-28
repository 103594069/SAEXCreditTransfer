import { useMemo } from 'react'
import { useAppData, STAGES } from '../../context/AppDataContext.jsx'
import { studentById } from '../../data/students.js'
import { programName } from '../../data/programs.js'
import { caseConfidence } from '../../lib/caseHelpers.js'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ConfidenceBadge from '../../components/ui/ConfidenceBadge.jsx'

const STAGE_TONE = {
  Submitted: 'brand',
  'With Coordinator': 'medium',
  Approved: 'high',
  Enrolled: 'high',
  'Transcript Received': 'neutral',
}

export default function StaffBoardPage({ onOpenCase }) {
  const { cases } = useAppData()

  const byStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s, []]))
    for (const c of cases) {
      map[c.stage]?.push(c)
    }
    return map
  }, [cases])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper-900">Status board</h1>
        <p className="mt-1 text-sm text-paper-500">
          Shared, live view of every case in the pipeline — visible to both academic and professional staff.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {STAGES.map((stage) => (
          <div key={stage} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-paper-800">{stage}</h2>
              <Badge tone={STAGE_TONE[stage]}>{byStage[stage].length}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {byStage[stage].length === 0 && (
                <p className="rounded-lg border border-dashed border-paper-300 p-3 text-center text-xs text-paper-400">
                  No cases
                </p>
              )}
              {byStage[stage].map((c) => {
                const student = studentById(c.studentId)
                const confidence = caseConfidence(c)
                return (
                  <Card
                    key={c.id}
                    as="button"
                    onClick={() => onOpenCase(c.id)}
                    className="flex flex-col gap-2 p-3.5 text-left transition-shadow hover:shadow-md"
                  >
                    <p className="text-sm font-medium text-paper-900">{student?.name}</p>
                    <p className="text-xs text-paper-500">{programName(student?.programId)}</p>
                    <div className="flex items-center justify-between">
                      <ConfidenceBadge confidence={confidence} showLabel={false} />
                      <span className="text-xs text-paper-400">{c.lastUpdated}</span>
                    </div>
                    {c.transcriptStatus === 'pending manual match' && (
                      <p className="rounded-md bg-clay-50 px-2 py-1 text-xs text-clay-700">
                        Transcript match outstanding
                      </p>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
