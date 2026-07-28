export const PROGRAMS = [
  { id: 'bp250', name: 'Bachelor of Business (Marketing)' },
  { id: 'bp094', name: 'Bachelor of Engineering (Software Engineering)' },
  { id: 'bp328', name: 'Bachelor of Communication (Media)' },
  { id: 'bp279', name: 'Bachelor of Design (Landscape Architecture)' },
  { id: 'bp217', name: 'Bachelor of Science (Biotechnology)' },
]

export function programName(id) {
  return PROGRAMS.find((p) => p.id === id)?.name ?? id
}
