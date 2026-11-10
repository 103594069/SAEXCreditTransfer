# Handoff: restarting SAEX Credit Transfer with proper planning

Written from a cloud CLI session to continue on a laptop with fuller tooling. Branch: `claude/brave-newton-capewm`.

## Goal

The v1 build was done without proper planning. Restart with evidence and logic behind each engineering decision, keeping the context and rules already established. Treat v1 as evidence of what stakeholders reacted to, not as a base to build on.

## What exists

- **v1 prototype**: React 19 + Vite + Tailwind 4 clickable prototype for RMIT's outbound Study Abroad Exchange (SAEX) credit approval. Mock data only, `localStorage` persistence, no backend or auth. Three roles (Student, Staff, Assessor) over shared data. See `README.md`.
- **`GLOSSARY.md`**: agreed domain language (Semester Load, Application, Stage, Outcome, Precedent, Combination Precedent, Precedent Score, Content Overlap Score, and others).
- **`CLAUDE.md` and `docs/agents/*`**: skill configuration. GitHub Issues tracker, default seven triage labels, single-context domain docs, external peers set to `host-only`.

## Rules already established (from v1, to be re-validated, not assumed)

- An application is one 4-course Semester Load. It moves through Submitted, With Staff, With Assessor, Decision Pending as a single unit.
- Staff and Assessor review each course individually, but the application only advances once every course is reviewed.
- Only at Decision Pending does each course get its own Outcome (Approved, Denied, More Info Requested), decided one at a time, never bundled.
- Precedent Score (directional: Likely, Possible, Uncommon) and Content Overlap Score are shown side by side and never blended into one number.
- Eligibility uses RMIT's real outbound rules: GPA at least 2.0/4.0, at least 72cp completed by departure (early application allowed if projected), at least 12cp remaining after a standard 48cp exchange semester (OS-HELP). Result: Eligible, On Track (application is Preliminary), or Needs Review.
- Approving a course adds a Precedent, which changes future scores.

## Glossary decisions settled

1. **RMIT Unit** (RMIT side) vs **Partner Course** (host side). Avoid "host course", "RMIT course".
2. **Stage** and **Outcome** are the domain terms. "Status" survives only as UI names (Status Board, My Application).
3. **Semester Load** is the canonical term. "Package" and "combination" are informal; "combination" is used only in **Combination Precedent**.
4. **Not Applicable** is the domain term. Students see the label "Already completed".

## Known gaps in what was read

The summary and glossary were built from the README and these files: `eligibility.js`, `substituteMapping.js`, `precedentScoring.js`, `combinationPrecedents.js`, `semesterLoads.js`, `recommendations.js`, `App.jsx`. Not read: `applications.js`, the other `src/data` files, and the pages. The Application, Stage and Outcome glossary entries come from the README alone.

## Recommended plan

1. Tag the prototype before rebuilding: `prototype/v1`.
2. **`/research`**: replace assumptions with cited evidence. Candidate questions are below.
3. **`/grill-with-docs`** over the whole product, using the research and the glossary. Record hard-to-reverse, surprising, real trade-off decisions as ADRs in `docs/adr/` (for example the application-as-one-unit model, scoring approach, persistence and data).
4. **`/prototype`** only for questions that cannot be settled on paper (for example the assessor review UX). v1 may already answer some.
5. **`/wayfinder`** if the picture is still foggy: map open decisions as tickets and resolve them one at a time.
6. **`/to-spec`, `/to-tickets`, `/implement`**: test-first build, QA in the running app, review per ticket. Use `/codebase-design` for module shape.

Some of these skills (`grill-with-docs`, `wayfinder`, `to-spec`, `to-tickets`, `implement`) were not loaded in the cloud session. They should be available on the laptop.

## Draft research questions (not yet approved or run)

- What is RMIT's actual credit-transfer policy and approval workflow for outbound exchange, and who decides what at each step?
- Do assessors actually decide using precedent, or is that an assumption? What evidence do they use today?
- Is the all-4-courses-as-one-application model how RMIT really processes exchange credit, or only how the v1 solution design framed it?
- What are the real eligibility rules and their sources (GPA, 72cp, 12cp OS-HELP), and do they vary by program?
- How do other universities handle exchange credit mapping and precedent, and what fails in practice?
- What data exists today (past approvals, course mappings) and in what form, since precedent scoring depends on it?
- What are the privacy and records constraints for student data in a real build?

## Environment notes

- `host-only` in `docs/agents/cross-model.json` was chosen because only the `claude` CLI was installed in the cloud session. If the laptop has Codex, Cursor Agent or OMP, consider `auto`.
- `docs/agents/issue-tracker.md` includes a fallback line for the GitHub MCP tools where `gh` is unavailable. With `gh` on the laptop it is not needed.

## Next step

Approve or edit the research questions above, then run `/research` on them.

## Update: first grilling session (2026-11-10)

Product decisions are recorded in `GLOSSARY.md`, `docs/adr/0001` to `0003`, and research in `docs/research/`. Summary:

- **Product:** your own product, modelled on RMIT's process, built for any Home Institution. Pitch to RMIT University Pathways went well but it was the wrong audience. Buyer is the Home Institution.
- **First release:** pre-approval wedge only. Study Plan (replaces Application/Shortlist) holds a credit-based Semester Load plus Backup Courses. Approved Study Plans are exported for the existing mobility portal. Course changes after arrival are deferred. Replacing the mobility platform is the long-term vision only.
- **Data:** students supply Partner Course outlines; Partner Courses are shared across Home Institutions, Course Mappings and Precedents are private (ADR-0001). Home Institutions supply Home Unit outlines. The Operator merges duplicate Partner Courses.
- **Evidence:** Content Overlap Score by AI comparison of outlines, shown to students and Assessors. AI Assistance Level is Explain or Recommend; the AI never decides (ADR-0002). Student context sent to the AI is a setting to test. Precedents carry a Review By Date (default 3 years), Lapsed Precedents count less, Outline Snapshots are stored, and a Content Change Hint flags likely drift.
- **Testing:** options are switchable settings per Home Institution, tried in moderated sessions with your contacts; the product logs time per assessment.
- **Engineering:** demo students with real outlines (no real student data, no SSO yet). React + Supabase (ADR-0003). Fresh build; surviving v1 rules ported test-first. AI provider decided at the first AI ticket.
- **Parked:** the approval workflow (Stages, Staff vs Assessor steps, per-course Decisions, Combination Precedent, Document Checklist), waiting on answers to `docs/research/stakeholder-questionnaire.md`.

**Next step:** send the questionnaire. When answers come back, run `/grill-with-docs` on the workflow branch, then `/to-spec` and `/to-tickets`.

## Update: workflow round (provisional, 2026-11-10)

The questionnaire hasn't been answered, so these workflow decisions are **provisional**. Check them against the answers when they arrive, and reopen only those that are contradicted.

- Submission Checks run automatically (Eligible, outlines present, credit total met). One Staff Check per Study Plan, never per course.
- One Assessor per Program (RMIT: Program Coordinator/Manager). Decisions per course, in any order, with the whole Study Plan in view. The Assessor may retarget a Course Mapping to another Remaining Unit or Elective Credit before deciding.
- Stages: Draft, Submitted, With Assessor, Decided, Exported. A Course Revision sends only the revised course back to the Assessor.
- Export is a PDF Study Plan, allowed only when approved courses meet the semester Home Credit requirement.
- Preliminary Study Plans (On Track students) stay in Draft until the student is Eligible.
- Email notifications on Stage changes and Outcomes.
- Document Checklist: a current outline per Partner Course (confirm the shared one or upload a newer one). The learning agreement upload is dropped (the export replaces it). GPA and completed units come from demo student records.

**Deferred, to revisit:**
- Combination Precedent: tracked in issue #1 (industry request).
- Travel documents (passport, visa, health insurance): out of the first release; how to integrate them is undecided.
- Course changes after arrival.
- Real student data: SSO, data residency, student-records integration.

**Next step:** `/to-spec`, then `/to-tickets`. Order tickets so the workflow-independent parts (eligibility, outlines and catalogue, Home Unit import, AI overlap, Precedents, Study Plan builder, export) come before the Staff and Assessor flow.

## Update: ticket #3 implemented (2026-11-10, paused)

Ticket #3 ("01: Scaffold the fresh build with demo sign-in and role screens", child of spec #2) is implemented on `claude/brave-newton-capewm` and pushed. The issue stays open until the branch is merged (`/ship-pr` closes it). Review decisions are posted as comments on #3.

**What exists now**

- v1 is out of the main tree. A TypeScript React (Vite) app runs on local Supabase; the README lists the commands (`npm install`, `npx supabase start`, `npx supabase db reset`, `npm run dev`) and the demo accounts (password `demo-password`).
- `src/service/creditApproval.ts` is the Credit Approval service. It checks the active role against `src/domain/permissions.ts` on every command, lets a user switch only to a role they hold, and falls back to a held role if the active one was removed. It has ports for Storage, Outline Comparison and Notifier (`src/service/ports.ts`). Tests use the in-memory and fake adapters (36 tests); the app uses the Supabase adapters in `src/adapters/supabase`. Lint stops `src/domain` and `src/service` importing Supabase or adapters.
- `supabase/migrations/20261110000000_accounts_and_roles.sql` holds accounts, roles, Home Institutions and the Demo Outbox, with RLS. Browsers have no access to the outbox. `supabase/seed.sql` seeds RMIT (demo) and six demo accounts. Sign-up is disabled.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck and tests on every push. It passed on the first push.

**Status of the implement flow**

- QA passed in the running app, apart from the blocked tag push below. Code review verdict: Ready (no P0/P1). All findings are fixed or decided; see the comments on #3.
- The last fix, `4941cd8` (60-second read-back window), was checked only by this session in the browser: a 30 s run of 502s recovers, and a permanent error gives up at 60 s. It still needs its independent follow-up QA and review pass. Run that first on resuming, with fixed point `35bbf17`.

**Waiting on you**

- Push the v1 tag. This session's git proxy refuses tag pushes:
  ```bash
  git push origin prototype/v1
  ```
- Then open a PR for `claude/brave-newton-capewm` and merge it (`/ship-pr`).

**Constraints recorded for later tickets**

- Notification ticket: `send-notification` must send only to the account's own verified email, looked up on the server, and build the subject and body from stored data. It must never write an email the caller supplies.
- Seam 2 ticket: add automated tests for the Supabase Storage adapter and the role-switch RLS policy, which are covered only by QA today.
- The service runs in the browser, so RLS is the boundary that is actually enforced. Policies in later tickets must not rely on the active role alone.

**Local environment notes (cloud session)**

- Docker must be started (`dockerd`), and `public.ecr.aws` is blocked, so start Supabase with `SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io npx supabase start`.
