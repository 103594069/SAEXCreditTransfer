export const PROGRAMS = [
  { id: 'bp250', name: 'Bachelor of Business' },
  { id: 'bp094', name: 'Bachelor of Information Technology' },
  { id: 'bp217', name: 'Bachelor of Biomedical Science' },
]

export function programName(id) {
  return PROGRAMS.find((p) => p.id === id)?.name ?? id
}
