import type { Notifier } from '../../service/ports.ts'
import type { SupabaseClient } from './client.ts'

/**
 * Notifier through the `send-notification` server function, which writes the Demo Outbox
 * with the service role (nothing reaches a real inbox). Browsers have no write access to the
 * outbox, so a signed-in user cannot plant an email. The function arrives with the first
 * notification ticket.
 */
export function createDemoOutboxNotifier(client: SupabaseClient): Notifier {
  return {
    async send(email) {
      const { error } = await client.functions.invoke('send-notification', { body: email })
      if (error) throw error
    },
  }
}
