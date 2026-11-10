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
