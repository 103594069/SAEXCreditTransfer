# SAEX Credit Transfer

A web product for outbound study abroad exchange credit pre-approval, modelled on
RMIT's Study Abroad Exchange (SAEX) process and built for any Home Institution.
Domain language is in [`GLOSSARY.md`](GLOSSARY.md), decisions in [`docs/adr/`](docs/adr/).

The v1 clickable prototype is kept for reference on the `prototype/v1` tag
(`git checkout prototype/v1`). It is not part of this build.

## Stack

TypeScript React (Vite) front end on Supabase (ADR-0003): Postgres, email sign-in,
storage and server functions. Run locally with the Supabase CLI, which needs Docker.

## Running it locally

```bash
npm install
```

```bash
npx supabase start
```

```bash
npx supabase db reset
```

```bash
npm run dev
```

Then open <http://localhost:5173>. `supabase db reset` applies the migrations in
`supabase/migrations/` and loads the demo data in `supabase/seed.sql`; run it again at
any time to return to a clean demo. `.env.development` points the app at the local
Supabase defaults; if `npx supabase status` prints a different API URL or publishable
key, put yours in `.env.development.local`.

If Docker cannot pull from `public.ecr.aws`, start Supabase from Docker Hub instead:

```bash
SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io npx supabase start
```

Stop the local stack with `npx supabase stop`.

## Demo accounts

Every demo account's password is `demo-password`. The sign-in screen lists them.

| Email | Roles |
| --- | --- |
| `student@rmit-demo.test` | Student |
| `staff@rmit-demo.test` | Staff |
| `assessor@rmit-demo.test` | Assessor |
| `admin@rmit-demo.test` | Institution Admin |
| `operator@saex-demo.test` | Operator |
| `staff.admin@rmit-demo.test` | Staff and Institution Admin (switch with "Acting as") |

All but the Operator belong to the demo Home Institution, RMIT (demo).

## Checks

```bash
npm run check
```

runs lint (`npm run lint`), the typecheck (`npm run typecheck`) and the tests
(`npm test`). CI runs the same on every push (`.github/workflows/ci.yml`).

## Code layout

- `src/domain/`: plain TypeScript rules (roles, permissions). Never imports Supabase.
- `src/service/`: the Credit Approval service, the single entry point for user actions,
  and its ports (Storage, Outline Comparison, Notifier). Never imports Supabase or an
  adapter; lint enforces both.
- `src/adapters/memory`, `src/adapters/fake`: the in-memory Storage adapter and fake
  ports used in tests.
- `src/adapters/supabase`: the Supabase adapters used by the app.
- `src/ui/`: React screens. The composition root is `src/ui/creditApproval.ts`.
- `supabase/`: local Supabase config, migrations and seed data.
