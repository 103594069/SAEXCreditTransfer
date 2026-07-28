import { useState } from 'react'
import { STUDENTS } from '../../data/students.js'
import { programName } from '../../data/programs.js'
import { useAppData } from '../../context/AppDataContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

export default function LoginPage() {
  const { login } = useAppData()
  const [selected, setSelected] = useState('')

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-paper-900">Sign in</h1>
        <p className="mt-1 text-sm text-paper-500">
          This is a demo login — select a student profile to continue. Your degree and remaining units load
          automatically.
        </p>
      </div>

      <Card className="p-6">
        <label className="mb-1.5 block text-sm font-medium text-paper-700" htmlFor="student-select">
          Select a demo student
        </label>
        <select
          id="student-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-lg border border-paper-300 bg-white px-3 py-2.5 text-sm text-paper-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="" disabled>
            Choose a name or student ID…
          </option>
          {STUDENTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.studentId} · {programName(s.programId)}
            </option>
          ))}
        </select>

        <Button className="mt-5 w-full" disabled={!selected} onClick={() => login(selected)}>
          Continue
        </Button>
      </Card>
    </div>
  )
}
