// The canonical full-semester course package RMIT advises for a given
// program at a given partner institution. Shortlisting is always at this
// granularity — a complete load, never a single course.
export const SEMESTER_LOADS = [
  {
    id: 'load-toronto-bp094',
    institutionId: 'pi-toronto',
    programId: 'bp094',
    partnerCourseIds: ['pc-toronto-ds', 'pc-toronto-se', 'pc-toronto-intro', 'pc-toronto-web'],
  },
  {
    id: 'load-nus-bp094',
    institutionId: 'pi-nus',
    programId: 'bp094',
    partnerCourseIds: ['pc-nus-dsa', 'pc-nus-networks', 'pc-nus-interaction', 'pc-nus-gex'],
  },
  {
    id: 'load-manchester-bp094',
    institutionId: 'pi-manchester',
    programId: 'bp094',
    partnerCourseIds: ['pc-manchester-se', 'pc-manchester-fcs', 'pc-manchester-dist', 'pc-manchester-sustainability-cs'],
  },
  {
    id: 'load-cbs-bp250',
    institutionId: 'pi-cbs',
    programId: 'bp250',
    partnerCourseIds: ['pc-cbs-consumerbeh', 'pc-cbs-fundmarketing', 'pc-cbs-digital', 'pc-cbs-intlbusiness'],
  },
  {
    id: 'load-uam-bp250',
    institutionId: 'pi-uam',
    programId: 'bp250',
    partnerCourseIds: ['pc-uam-fundmarketing', 'pc-uam-analytics', 'pc-uam-negocios', 'pc-uam-global'],
  },
  {
    id: 'load-uva-bp328',
    institutionId: 'pi-uva',
    programId: 'bp328',
    partnerCourseIds: ['pc-uva-globalmedia', 'pc-uva-storytelling', 'pc-uva-theory', 'pc-uva-journalism'],
  },
  {
    id: 'load-tcd-bp328',
    institutionId: 'pi-tcd',
    programId: 'bp328',
    partnerCourseIds: ['pc-tcd-digitalmedia', 'pc-tcd-journalism', 'pc-tcd-mediasociety', 'pc-tcd-environment'],
  },
  {
    id: 'load-manchester-bp279',
    institutionId: 'pi-manchester',
    programId: 'bp279',
    partnerCourseIds: [
      'pc-manchester-landscape',
      'pc-manchester-planting',
      'pc-manchester-sitedocs',
      'pc-manchester-sustainability-la',
    ],
  },
  {
    id: 'load-kth-bp279',
    institutionId: 'pi-kth',
    programId: 'bp279',
    partnerCourseIds: ['pc-kth-urbanstudio', 'pc-kth-urbanecology', 'pc-kth-siteanalysis', 'pc-kth-globalsustain'],
  },
  {
    id: 'load-nus-bp217',
    institutionId: 'pi-nus',
    programId: 'bp217',
    partnerCourseIds: ['pc-nus-molcell', 'pc-nus-genetics', 'pc-nus-bioprocess', 'pc-nus-gex-bio'],
  },
  {
    id: 'load-ucb-bp217',
    institutionId: 'pi-ucb',
    programId: 'bp217',
    partnerCourseIds: ['pc-ucb-microbiology', 'pc-ucb-bioprocess', 'pc-ucb-genetics', 'pc-ucb-envpolicy'],
  },
]

export function loadsForProgram(programId) {
  return SEMESTER_LOADS.filter((l) => l.programId === programId)
}

export function loadById(id) {
  return SEMESTER_LOADS.find((l) => l.id === id)
}
