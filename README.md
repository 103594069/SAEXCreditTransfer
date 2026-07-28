# SAEX Credit Transfer — Prototype

A clickable prototype of a platform for RMIT's outbound Study Abroad Exchange
(SAEX) credit approval process, built for a stakeholder pitch. All data is
mocked and seeded on load; anything that needs to persist between reloads
(mock login, shortlist drafts, application/precedent state) is kept in
`localStorage`. There is no backend, no external API calls, and no real
authentication.

## Stack

React + Vite + Tailwind CSS. No other runtime dependencies.

## Running it

```
npm install
npm run dev
```

## What's in it

Use the **Student / Staff / Assessor** toggle in the header to switch
perspectives — all three share the same underlying mock data, so actions
taken in one view (e.g. an assessor approving a course) are reflected live
in the others (e.g. the student's status tracker, the shared status board).

**Student**
1. *Sign in* — mock login: pick a demo student. Their degree and remaining
   units auto-populate a profile panel — nothing is entered manually.
2. *Find Institutions* — partner institutions ranked using historical
   precedent from students in the same degree and how well each institution's
   course package covers the student's remaining units.
3. Institution detail — a full semester load (always 4 courses, never a
   single course), each mapped to its RMIT unit with two independent scores:
   a directional **precedent score** (Likely / Possible / Uncommon, from
   historical outcomes) and a **content overlap score** (simple topic-keyword
   match against the RMIT unit) — shown side by side with a "why" note each,
   never blended into one number.
4. *My Shortlist* — review the load and submit; blocked until a document
   checklist is fully checked.
5. *My Application* — a live, per-course stage tracker.

**Staff**
- *Review Queue* — submitted courses, opened and reviewed one at a time
  (never bundled), each forwarded individually to an assessor with an
  optional note.

**Assessor**
- *Assessor Queue* — courses forwarded by staff only. Each course shows both
  scores plus a context-flags panel (accreditation type, and a precedent
  recency caution when the most recent match is dated) and gets its own
  Approve / Deny / Request More Info decision — never bundled, never
  auto-approved.
- Approving a course visibly appends to the mock precedent dataset, so the
  precedent score for that course — and future recommendations — reflect it
  immediately.

**Shared**
- *Status Board* — every course's current stage (Submitted → With Staff →
  With Assessor → Approved / Denied / More Info Requested), visible from all
  three roles.

## Resetting demo data

Clear `localStorage` for the site (or open in a private window) to reseed
the mock data from scratch.
