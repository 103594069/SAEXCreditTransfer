# SAEX Credit Transfer

How students on outbound study abroad exchange get the courses they take at a partner institution approved as credit towards their degree at their home institution. Modelled on RMIT's Study Abroad Exchange (SAEX) process, designed to apply to any home institution.

## Language

### Academic structure

**Home Institution**:
The university a student is enrolled at and that grants the credit. RMIT is the first Home Institution the product is modelled on.
_Avoid_: Home university, sending institution

**Program**:
A degree at the Home Institution that a student is enrolled in, identified by its program code (e.g. BP094 at RMIT).
_Avoid_: Degree (when referring to the specific code), course of study

**Home Unit**:
A single unit in a Program's degree structure that a student must complete.
_Avoid_: RMIT Unit, home course, subject, module

**Remaining Unit**:
A Home Unit a student has not yet completed and still needs for their Program.
_Avoid_: Outstanding unit, required unit

**Home Credit**:
The Home Institution's own measure of academic load (credit points at RMIT); eligibility rules, degree progress and Semester Load totals are expressed in it.
_Avoid_: Credits, points

**Elective Credit**:
Credit towards a Program's elective allowance rather than a specific Home Unit.
_Avoid_: Free elective, general credit

**Partner Credit**:
A Partner Institution's own measure of a Partner Course's load (e.g. ECTS).

**Credit Conversion**:
The rule that turns Partner Credit into Home Credit for one Home Institution and Partner Institution pair.
_Avoid_: Exchange rate, credit equivalence

**Partner Institution**:
An overseas university with which the Home Institution has an exchange agreement.
_Avoid_: Host university, destination, school

**Partner Course**:
A course offered by a Partner Institution: its outline, topics and Partner Credit. One record per course, shared by every Home Institution using the product; it carries no link to any Home Unit.
_Avoid_: Host course, overseas course, subject

### Eligibility

**Eligibility Status**:
A student's overall standing against the Home Institution's outbound exchange rules: **Eligible**, **On Track**, or **Needs Review**.
_Avoid_: Eligibility result, readiness

**Eligible**:
All exchange rules are met now.

**On Track**:
No rule is failed, but the credit point threshold is only projected to be met by departure. Study Plans from On Track students are **Preliminary**.

**Needs Review**:
At least one rule is failed or the credit point threshold is not projected to be met. Blocks starting a Study Plan.

**Blocker**:
A specific reason a student's Eligibility Status is Needs Review.

**Preliminary**:
The state of a Study Plan from an On Track student: exploratory until the student crosses the credit point threshold.
_Avoid_: Provisional, draft

### Planning an exchange

**Semester Load**:
A set of Partner Courses at one Partner Institution whose converted Home Credit meets the Home Institution's full-semester requirement (48cp at RMIT). Defined by credit total, not course count.
_Avoid_: Package (informal), course set, "four courses"

**Backup Course**:
A Partner Course listed in a Study Plan alongside its Semester Load and assessed with it, but not counted towards the semester's Home Credit unless it is swapped in for a course the Partner Institution does not offer.
_Avoid_: Alternate, reserve, spare

**Course Mapping**:
A pairing of one Partner Course with either one Home Unit or Elective Credit, belonging to one Home Institution. A Study Plan proposes Course Mappings; an approved one becomes a Precedent.
_Avoid_: Equivalence, match, mapping (unqualified)

**Direct Match**:
A Course Mapping whose Home Unit is still a Remaining Unit for the student.

**Substitute Candidate**:
A Partner Course whose usual Course Mapping targets a Home Unit the student has already completed, but whose content overlaps strongly or moderately with a different Remaining Unit.
_Avoid_: Alternative, replacement

**Not Applicable**:
A Partner Course whose usual Course Mapping targets a Home Unit already completed and which overlaps no Remaining Unit meaningfully. Students see it labelled "Already completed".

### Evidence

**Precedent**:
An approved Course Mapping from a past Study Plan, with the year it was approved. Belongs to one Home Institution and is never shared with others.
_Avoid_: History, past approval

**Combination Precedent**:
A record of a complete Semester Load having been approved together as a unit, with the year. _(Deferred: not in the first release. Requested by industry contacts; kept as a future enhancement.)_
_Avoid_: Past package, bundle precedent

**Review By Date**:
The date after which a Precedent should no longer be relied on without re-checking. Set by the Assessor on approval; defaults to three years.
_Avoid_: Expiry date, valid-until

**Lapsed Precedent**:
A Precedent past its Review By Date. Still visible as evidence, but weighted less in the Precedent Score.
_Avoid_: Expired precedent, stale precedent

**Outline Snapshot**:
The copy of a Partner Course outline that a Precedent was approved against, kept with the Precedent.
_Avoid_: Outline version, archived outline

**Precedent Score**:
A directional tier of **Likely**, **Possible**, or **Uncommon** derived from how many Precedents exist, how many are Lapsed, and how recent the latest is. Not a probability.
_Avoid_: Approval likelihood, confidence

**Recency Caution**:
A flag shown to Assessors when a Course Mapping's Precedents are all Lapsed.
_Avoid_: Stale warning

**Content Change Hint**:
A flag shown when the current Content Overlap Score is well below what a Course Mapping's Precedents suggest, signalling the Partner Course may have changed since approval.
_Avoid_: Drift warning

**Content Overlap Score**:
A **Strong**, **Moderate**, or **Weak** rating, with a written explanation, of how closely a Partner Course's outline matches the Home Unit's outline in a Course Mapping. Produced by AI comparison. Independent of, and never blended with, the Precedent Score.

**AI Assistance Level**:
A Home Institution setting for how far AI goes in assessment: **Explain** (Content Overlap Score and explanation only) or **Recommend** (also suggests an Outcome with reasons). The Assessor always makes the Decision.
_Avoid_: AI mode, automation level
_Avoid_: Similarity, match score

### Approval

**Study Plan**:
A student's proposed Semester Load plus Backup Courses at one Partner Institution, submitted for approval and tracked as a single item through the approval Stages.
_Avoid_: Application, Shortlist, Learning Agreement (the Erasmus name), submission, request, case

**Stage**:
Where a Study Plan is in the pipeline: **Draft**, **Submitted** (awaiting Staff Check), **With Assessor**, **Decided** (every course has an Outcome), or **Exported** (handed off to the Home Institution's mobility portal). Every course in a Study Plan always shares the same Stage. _(Provisional, pending stakeholder answers.)_
_Avoid_: Status (in domain language; "Status Board" and status screens are UI names only)

**Submission Checks**:
The automatic checks run when a Student submits a Study Plan: Eligibility Status, Document Checklist complete, and Semester Load credit total met.

**Staff Check**:
Staff confirming a submitted Study Plan, informed by its Submission Checks, and either passing the whole Study Plan to the Assessor or returning it to the Student. Done once per Study Plan, never per course. _(Provisional, pending stakeholder answers.)_
_Avoid_: Staff review, forwarding

**Assessor Review**:
An Assessor examining a single course of a Study Plan, with the whole Study Plan in view. Courses can be decided in any order. Before deciding, the Assessor may retarget the course's Course Mapping to a different Remaining Unit or to Elective Credit; the change is recorded and shown to the Student.

**Decision**:
The Outcome an Assessor gives to one course in a Study Plan, made one course at a time and never as a bundle.

**Outcome**:
The result of a Decision on a course: **Approved**, **Denied**, or **More Info Requested**.
_Avoid_: Result, verdict

**Document Checklist**:
The supporting documents a student must confirm before a Study Plan can be submitted.

### Roles

**Student**:
The Home Institution student planning an exchange who builds and submits a Study Plan.

**Staff**:
Exchange office staff (Global Experience at RMIT) who do the Staff Check on a Study Plan and export it once decided.
_Avoid_: Admin, coordinator

**Assessor**:
The academic who decides the Outcome for each course in a Study Plan. Each Program has one Assessor (at RMIT, its Program Coordinator/Manager), who decides every course in that Program's Study Plans. _(Provisional, pending stakeholder answers.)_
_Avoid_: Reviewer, approver

**Institution Admin**:
The person at a Home Institution who manages its users, imports its Home Unit outlines and sets its AI Assistance Level. A separate role from Staff, even when one person holds both.
_Avoid_: Administrator (unqualified), super user

**Operator**:
The person running the product across all Home Institutions, who merges duplicate Partner Course records and corrects shared data.
_Avoid_: Platform admin, curator

## Relationships

- A **Home Institution** has many **Programs**; a **Program** has many **Home Units**; a **Student** has many **Remaining Units** within their Program
- A **Partner Institution** offers many **Partner Courses**, shared across all **Home Institutions**
- A **Home Institution** owns its **Course Mappings**; each pairs one **Partner Course** with one **Home Unit** or **Elective Credit**
- A **Semester Load** belongs to one **Program** and one **Partner Institution** and contains enough **Partner Courses** to meet the full-semester **Home Credit** requirement after **Credit Conversion**
- A **Study Plan** holds one **Semester Load** and any number of **Backup Courses**, all at one **Partner Institution**
- A **Study Plan** moves through its **Stages** as one unit; each course in it receives its own **Outcome** while the Study Plan is With Assessor
- An **Assessor** approving a course turns its **Course Mapping** into a **Precedent**, which changes future **Precedent Scores**
- A **Combination Precedent** refers to a **Semester Load**; a **Precedent** refers to a **Course Mapping**
