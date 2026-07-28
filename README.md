# SAEX Credit Transfer — Prototype

A clickable prototype of a platform for RMIT's outbound Study Abroad Exchange
(SAEX) credit approval process, built for a stakeholder pitch. All data is
mocked and seeded on load; anything that needs to persist between reloads
(role selection, study plan drafts, case state) is kept in `localStorage`.
There is no backend, no external API calls, and no authentication.

## Stack

React + Vite + Tailwind CSS. No other runtime dependencies.

## Running it

```
npm install
npm run dev
```

## What's in it

Use the **Student view / Staff view** toggle in the header to switch
perspectives — both share the same underlying mock data, so actions taken in
one view (e.g. a staff member approving a case) are reflected in the other
(e.g. the student's status tracker).

**Student view**
- *Find Courses* — search host institution courses and see a match
  confidence score against RMIT credit, plus peer precedent for your program.
- *Study Plan* — build a plan from selected courses; submission is blocked
  until a mock document checklist is complete.
- *My Application* — a live stage tracker (Submitted → With Coordinator →
  Approved → Enrolled → Transcript Received).

**Staff view**
- *Review Queue* — pending study plans ranked by match confidence.
- Case detail — a guide freshness flag and a scored explanation panel
  (learning outcome overlap, precedent status, duration alignment) for each
  course in the plan, with one-click approval or escalation to a course
  coordinator with an auto-generated context pack.
- *Status Board* — a shared, live board of every case and its current stage.

## Resetting demo data

Clear `localStorage` for the site (or open in a private window) to reseed
the mock data from scratch.
