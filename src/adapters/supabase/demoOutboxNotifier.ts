import type { Notifier } from '../../service/ports.ts'
import type { SupabaseClient } from './client.ts'

/**
 * Notifier through the `send-notification` server function, which writes the Demo Outbox
 * with the service role (nothing reaches a real inbox). Browsers have no direct write access
 * to the outbox. The function arrives with the first notification ticket, and it must not
 * write a caller-supplied email as-is: a signed-in user could then still plant one. It has to
 * check or build the email from stored data on the server (see issue #3's review notes).
 */
export function createDemoOutboxNotifier(client: SupabaseClient): Notifier {
  return {
    async send(email) {
      const { error } = await client.functions.invoke('send-notification', { body: email })
      if (error) throw error
    },
  }
}
