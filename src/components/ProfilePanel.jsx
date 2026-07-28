import { programName } from '../data/programs.js'
import { rmitUnitById } from '../data/rmitUnits.js'
import Card from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'

export default function ProfilePanel({ student }) {
  const remainingUnits = student.remainingUnitIds.map((id) => rmitUnitById(id))

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">Your profile</p>
          <h2 className="mt-0.5 text-lg font-semibold text-paper-900">{student.name}</h2>
          <p className="text-sm text-paper-500">
            {student.studentId} · {programName(student.programId)} · {student.yearLevel}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-paper-400">
            Remaining units ({remainingUnits.length})
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5 sm:justify-end">
            {remainingUnits.map((u) => (
              <Badge key={u.id} tone="brand">
                {u.code} · {u.creditPoints}cp
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
