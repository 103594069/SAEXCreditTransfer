// Selectable demo identities for the mock login. There is no real
// authentication — logging in just sets which of these profiles is
// "current" for the session.
export const STUDENTS = [
  {
    id: 'stu-priya',
    name: 'Priya Nair',
    studentId: 's3891204',
    programId: 'bp094',
    yearLevel: 'Year 2',
    email: 'priya.nair@student.rmit.edu.au',
    remainingUnitIds: ['ru-cosc2123', 'ru-cosc2299', 'ru-cosc2626'],
  },
  {
    id: 'stu-jack',
    name: 'Jack Osei',
    studentId: 's3801177',
    programId: 'bp094',
    yearLevel: 'Year 4',
    email: 'jack.osei@student.rmit.edu.au',
    remainingUnitIds: ['ru-cosc3020', 'ru-cosc1076'],
  },
  {
    id: 'stu-liam',
    name: 'Liam Cheung',
    studentId: 's3762211',
    programId: 'bp250',
    yearLevel: 'Year 3',
    email: 'liam.cheung@student.rmit.edu.au',
    remainingUnitIds: ['ru-mktg2031', 'ru-mktg1025', 'ru-intb1046'],
  },
  {
    id: 'stu-sofia',
    name: 'Sofia Ricci',
    studentId: 's3868803',
    programId: 'bp250',
    yearLevel: 'Year 2',
    email: 'sofia.ricci@student.rmit.edu.au',
    remainingUnitIds: ['ru-mktg2115', 'ru-mktg2087'],
  },
  {
    id: 'stu-ava',
    name: 'Ava Thompson',
    studentId: 's3814402',
    programId: 'bp328',
    yearLevel: 'Year 2',
    email: 'ava.thompson@student.rmit.edu.au',
    remainingUnitIds: ['ru-comm2299', 'ru-comm2245', 'ru-jour1102'],
  },
  {
    id: 'stu-dylan',
    name: 'Dylan Prasad',
    studentId: 's3777654',
    programId: 'bp328',
    yearLevel: 'Year 3',
    email: 'dylan.prasad@student.rmit.edu.au',
    remainingUnitIds: ['ru-comm1050', 'ru-jour1102'],
  },
  {
    id: 'stu-noah',
    name: 'Noah Fitzgerald',
    studentId: 's3729915',
    programId: 'bp279',
    yearLevel: 'Year 3',
    email: 'noah.fitzgerald@student.rmit.edu.au',
    remainingUnitIds: ['ru-land2021', 'ru-land2044', 'ru-land1099'],
  },
  {
    id: 'stu-grace',
    name: 'Grace Okafor',
    studentId: 's3892341',
    programId: 'bp217',
    yearLevel: 'Year 3',
    email: 'grace.okafor@student.rmit.edu.au',
    remainingUnitIds: ['ru-biol2033', 'ru-biol2078', 'ru-biot2011'],
  },
  {
    id: 'stu-mei',
    name: 'Mei Lin Tan',
    studentId: 's3855120',
    programId: 'bp217',
    yearLevel: 'Year 2',
    email: 'mei.tan@student.rmit.edu.au',
    remainingUnitIds: ['ru-biol2091', 'ru-biot2011'],
  },
]

export function studentById(id) {
  return STUDENTS.find((s) => s.id === id)
}
