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

**Partner Credit**:
A Partner Institution's own measure of a Partner Course's load (e.g. ECTS).

**Credit Conversion**:
The rule that turns Partner Credit into Home Credit for one Home Institution and Partner Institution pair.
_Avoid_: Exchange rate, credit equivalence

**Partner Institution**:
An overseas university with which the Home Institution has an exchange agreement.
_Avoid_: Host university, destination, school

**Partner Course**:
A course offered by a Partner Institution, mapped to the Home Unit it is expected to be credited as. One record per course, shared by every Home Institution using the product.
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

**Direct Match**:
A Partner Course whose mapped Home Unit is still a Remaining Unit for the student.

**Substitute Candidate**:
A Partner Course whose mapped Home Unit the student has already completed, but whose content overlaps strongly or moderately with a different Remaining Unit.
_Avoid_: Alternative, replacement

**Not Applicable**:
A Partner Course whose mapped Home Unit is already completed and which overlaps no Remaining Unit meaningfully. Students see it labelled "Already completed".

### Evidence

**Precedent**:
A record of a past student being credited for a specific Partner Course, with the year it happened. Approving a course creates a new one. Belongs to one Home Institution and is never shared with others.
_Avoid_: History, past approval

**Combination Precedent**:
A record of a complete Semester Load having been approved together as a unit, with the year.
_Avoid_: Past package, bundle precedent

**Precedent Score**:
A directional tier of **Likely**, **Possible**, or **Uncommon** derived from how many Precedents exist and how recent the latest is. Not a probability.
_Avoid_: Approval likelihood, confidence

**Recency Caution**:
A flag shown to Assessors when a course has Precedents but the most recent one is dated.
_Avoid_: Stale warning

**Content Overlap Score**:
A **Strong**, **Moderate**, or **Weak** rating of how closely a Partner Course's topics match a Home Unit. Independent of, and never blended with, the Precedent Score.
_Avoid_: Similarity, match score

### Approval

**Study Plan**:
A student's proposed Semester Load plus Backup Courses at one Partner Institution, submitted for approval and tracked as a single item through the approval Stages.
_Avoid_: Application, Shortlist, Learning Agreement (the Erasmus name), submission, request, case

**Stage**:
Where a Study Plan is in the pipeline: **Submitted**, **With Staff**, **With Assessor**, or **Decision Pending**. Every course in a Study Plan always shares the same Stage.
_Avoid_: Status (in domain language; "Status Board" and status screens are UI names only)

**Staff Review**:
Staff checking and forwarding a single course of a Study Plan to the Assessor. The Study Plan advances only once every course in it is forwarded.

**Assessor Review**:
An Assessor opening a single course of a Study Plan to examine it. Decisions unlock only once every course has been reviewed.

**Decision**:
The Outcome an Assessor gives to one course at Decision Pending, made one course at a time and never as a bundle.

**Outcome**:
The result of a Decision on a course: **Approved**, **Denied**, or **More Info Requested**.
_Avoid_: Result, verdict

**Document Checklist**:
The supporting documents a student must confirm before a Study Plan can be submitted.

### Roles

**Student**:
The Home Institution student planning an exchange who builds and submits a Study Plan.

**Staff**:
Administrative reviewers who do the first pass on a Study Plan and forward courses to the Assessor.
_Avoid_: Admin, coordinator

**Assessor**:
The academic who decides the Outcome for each course.
_Avoid_: Reviewer, approver

## Relationships

- A **Home Institution** has many **Programs**; a **Program** has many **Home Units**; a **Student** has many **Remaining Units** within their Program
- A **Partner Institution** offers many **Partner Courses**; each Partner Course maps to one **Home Unit**
- A **Semester Load** belongs to one **Program** and one **Partner Institution** and contains enough **Partner Courses** to meet the full-semester **Home Credit** requirement after **Credit Conversion**
- A **Study Plan** holds one **Semester Load** and any number of **Backup Courses**, all at one **Partner Institution**
- A **Study Plan** moves through its **Stages** as one unit; each course in it receives its own **Outcome** only at Decision Pending
- An **Assessor** approving a course creates a **Precedent** that changes future **Precedent Scores**
- A **Combination Precedent** refers to a **Semester Load**; a **Precedent** refers to a **Partner Course**
