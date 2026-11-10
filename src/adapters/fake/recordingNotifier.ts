import type { Email, Notifier } from '../../service/ports.ts'

/** Recording fake: keeps every email it is asked to send. */
export function createRecordingNotifier() {
  const sent: Email[] = []
  const port: Notifier = {
    async send(email) {
      sent.push(email)
    },
  }
  return { port, sent }
}
