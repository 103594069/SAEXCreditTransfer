import type { Notifier } from '../../service/ports.ts'
import type { SupabaseClient } from './client.ts'

/** Demo Notifier: stores every email in the Demo Outbox table; nothing reaches a real inbox. */
export function createDemoOutboxNotifier(client: SupabaseClient): Notifier {
  return {
    async send(email) {
      const { error } = await client
        .from('demo_outbox')
        .insert({ to_address: email.to, subject: email.subject, body: email.body })
      if (error) throw error
    },
  }
}
