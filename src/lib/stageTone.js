// Badge tone for an application's shared pipeline stage.
export const APPLICATION_STAGE_TONE = {
  Submitted: 'brand',
  'With Staff': 'medium',
  'With Assessor': 'medium',
  'Decision Pending': 'medium',
}

// Badge tone for a course's individual decision outcome — only meaningful
// once the application has reached "Decision Pending". 'Awaiting Decision'
// covers a course whose application is at that stage but hasn't been
// decided yet.
export const DECISION_TONE = {
  Approved: 'high',
  Denied: 'low',
  'More Info Requested': 'low',
  'Awaiting Decision': 'medium',
}
