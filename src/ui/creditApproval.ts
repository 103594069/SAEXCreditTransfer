// Composition root: the app's Credit Approval service, wired to the Supabase adapters.
import { supabase } from '../adapters/supabase/client.ts'
import { createDemoOutboxNotifier } from '../adapters/supabase/demoOutboxNotifier.ts'
import { createServerOutlineComparison } from '../adapters/supabase/serverOutlineComparison.ts'
import { createSupabaseStorage } from '../adapters/supabase/supabaseStorage.ts'
import { createCreditApprovalService } from '../service/creditApproval.ts'

export { supabase }

export const creditApproval = createCreditApprovalService({
  storage: createSupabaseStorage(supabase),
  outlineComparison: createServerOutlineComparison(supabase),
  notifier: createDemoOutboxNotifier(supabase),
})
