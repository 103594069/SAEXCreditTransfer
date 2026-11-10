# SAEX Credit Transfer

How RMIT students on outbound Study Abroad Exchange (SAEX) get the courses they take at a partner institution approved as credit towards their RMIT degree.

## Language

### Academic structure

**Program**:
An RMIT degree a student is enrolled in, identified by its program code (e.g. BP094).
_Avoid_: Degree (when referring to the specific code), course of study

**RMIT Unit**:
A single course in an RMIT program's degree structure that a student must complete.
_Avoid_: RMIT course, subject

**Remaining Unit**:
An RMIT Unit a student has not yet completed and still needs for their program.
_Avoid_: Outstanding unit, required unit

**Credit Points (cp)**:
The measure of academic load; eligibility rules and degree progress are expressed in it.
_Avoid_: Credits, points

**Partner Institution**:
An overseas university with which RMIT has an exchange agreement.
_Avoid_: Host university, destination, school

**Partner Course**:
A course offered by a Partner Institution, mapped to the RMIT Unit it is expected to be credited as.
_Avoid_: Host course, overseas course, subject

### Eligibility

**Eligibility Status**:
A student's overall standing against RMIT's outbound exchange rules: **Eligible**, **On Track**, or **Needs Review**.
_Avoid_: Eligibility result, readiness

**Eligible**:
All exchange rules are met now.

**On Track**:
No rule is failed, but the credit point threshold is only projected to be met by departure. Applications from On Track students are **Preliminary**.

**Needs Review**:
At least one rule is failed or the credit point threshold is not projected to be met. Blocks starting an application.

**Blocker**:
A specific reason a student's Eligibility Status is Needs Review.

**Preliminary**:
The state of an application from an On Track student: exploratory until the student crosses the credit point threshold.
_Avoid_: Provisional, draft

### Planning an exchange

**Semester Load**:
The canonical full-semester package of exactly four Partner Courses RMIT advises for one Program at one Partner Institution.
_Avoid_: Package (informal), course set, single-course plan

**Shortlist**:
The Semester Load a student has chosen to apply with. Always a whole load, never individual courses.
_Avoid_: Cart, basket, selection

**Direct Match**:
A Partner Course whose mapped RMIT Unit is still a Remaining Unit for the student.

**Substitute Candidate**:
A Partner Course whose mapped RMIT Unit the student has already completed, but whose content overlaps strongly or moderately with a different Remaining Unit.
_Avoid_: Alternative, replacement

**Not Applicable**:
A Partner Course whose mapped RMIT Unit is already completed and which overlaps no Remaining Unit meaningfully. Students see it labelled "Already completed".

### Evidence

**Precedent**:
A record of a past student being credited for a specific Partner Course, with the year it happened. Approving a course creates a new one.
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
A **Strong**, **Moderate**, or **Weak** rating of how closely a Partner Course's topics match an RMIT Unit. Independent of, and never blended with, the Precedent Score.
_Avoid_: Similarity, match score

### Approval

**Application**:
A student's submitted Shortlist, tracked as a single item through the approval stages.
_Avoid_: Submission, request, case

**Stage**:
Where an Application is in the pipeline: **Submitted**, **With Staff**, **With Assessor**, or **Decision Pending**. Every course in an Application always shares the same Stage.
_Avoid_: Status (in domain language; "Status Board" and "My Application" status screens are UI names only)

**Staff Review**:
Staff checking and forwarding a single course of an Application to the Assessor. The Application advances only once all four courses are forwarded.

**Assessor Review**:
An Assessor opening a single course of an Application to examine it. Decisions unlock only once every course has been reviewed.

**Decision**:
The Outcome an Assessor gives to one course at Decision Pending, made one course at a time and never as a bundle.

**Outcome**:
The result of a Decision on a course: **Approved**, **Denied**, or **More Info Requested**.
_Avoid_: Result, verdict

**Document Checklist**:
The supporting documents a student must confirm before an Application can be submitted.

### Roles

**Student**:
The RMIT student planning an exchange who builds a Shortlist and submits an Application.

**Staff**:
Administrative reviewers who do the first pass on an Application and forward courses to the Assessor.
_Avoid_: Admin, coordinator

**Assessor**:
The academic who decides the Outcome for each course.
_Avoid_: Reviewer, approver

## Relationships

- A **Program** has many **RMIT Units**; a **Student** has many **Remaining Units** within their Program
- A **Partner Institution** offers many **Partner Courses**; each Partner Course maps to one **RMIT Unit**
- A **Semester Load** belongs to one **Program** and one **Partner Institution** and contains exactly four **Partner Courses**
- A **Shortlist** is one **Semester Load**; submitting it creates one **Application** with four courses
- An **Application** moves through its **Stages** as one unit; each course in it receives its own **Outcome** only at Decision Pending
- An **Assessor** approving a course creates a **Precedent** that changes future **Precedent Scores**
- A **Combination Precedent** refers to a **Semester Load**; a **Precedent** refers to a **Partner Course**
