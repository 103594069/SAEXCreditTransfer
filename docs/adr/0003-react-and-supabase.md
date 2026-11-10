# React front end on Supabase

The rebuild needs login, a Postgres database, file storage for outlines and server-side AI calls, and it is built and run by one person with basic knowledge across front end, backend, SQL and hosting. We chose a React (Vite) front end on Supabase, which provides Postgres, auth, storage and server functions as one managed service in TypeScript, because it leaves the least infrastructure to operate. The cost is lock-in on Supabase's auth, storage and functions; the data itself is plain Postgres and can move.

## Considered Options

- **Next.js full-stack on Vercel with a separate Postgres and auth library:** more flexible, but more pieces to wire together and keep running.
- **Python API (FastAPI or Django) with React:** strongest if text and AI processing grow, but two languages to maintain.

## Consequences

- Keep domain logic in plain TypeScript modules that don't import Supabase, so the rules can be tested without it and moved if the platform changes.
- University SSO and Australian data residency are needed before real student data arrives (not in the first release); check Supabase's support for both at that point.
