# Precedent drift: how others handle stale approvals, and what to build

Researched 2026-11-10. **Verification caveat:** direct fetches of creditprecedents.app.uq.edu.au, registrar.ucdavis.edu, sjsu.edu, international.uky.edu and global.rutgers.edu were blocked, so every finding below comes from search-engine extracts of the cited pages. None was checked against the page itself; re-check before quoting.

## 1. What existing systems do

| System | Drift handling (from search extracts) |
|---|---|
| **UQ Credit Precedents** | Each precedent shows an **Assessed** date and a **Review Date**, usually about 3 years later (e.g. assessed 4 Nov 2024, review 4 Nov 2027; some 2022 entries show a 3-year review date that has since passed). The site says precedents are "a guide only". The 3-year pattern is inferred from examples, not a stated rule. https://creditprecedents.app.uq.edu.au/precedent/search-by-institution-and-course-or-program/institution/uq/page/2571 |
| **TES / Transferology (CollegeSource)** | Equivalencies have **Begin and End Dates**. Expired ones still appear in searches, shown in red, so advisors can check rules that applied when a course was taken. An "Active" filter hides them. UC Davis assumes a **5-year lifespan** when no end date is set. https://registrar.ucdavis.edu/node/3321 , https://www.unomaha.edu/registrar/_documents/tutorials/TES%20Manual.pdf , https://www.csueastbay.edu/cbeadvising/articulation.html |
| **US study-abroad databases** | SJSU: approvals are "usually five years", after which a new review is needed, because partners "frequently update syllabi". Kentucky: the approver **chooses 1, 3 or 5 years**. Rutgers: "Approved through Spring 2026"-style labels, and re-approval after that date. Oklahoma and UTSA: 3 years. https://www.sjsu.edu/studyabroad/getting-started/academics/course-equivalency-database.php , https://international.uky.edu/ea/course-equivalency-database , https://global.rutgers.edu/sites/default/files/2025-05/Course-Equivalency-Guidelines.pdf , https://lists.it.utsa.edu/hyperkitty/list/advising@lists.it.utsa.edu/message/XEDDN6G477RAXJ5U4SKEVUVRCRJYKNU5/attachment/6/StudyAbroadCourseEquivalenciesGuide-April2020.pdf |
| **Terra Dotta** | No vendor documentation on expiry was found. Expiry is probably set by each institution. https://support.terradotta.com/hc/en-us/articles/37321446504087-The-Study-Abroad-Course-Catalog |
| **Melbourne / Monash / Deakin** | No public validity period was found for outbound pre-approvals. |

**Pattern:** a dated validity window (3 to 5 years) is the norm, and the approver sometimes sets it. Expired items stay visible but are marked. **No system found ties a precedent to an outline version.**

## 2. Policy guidance

- **TEQSA** credit and RPL guidance note (v2.0, 2023): credit means equivalence "in content and learning outcomes". Decisions must rest on evidence and academic judgement and be recorded explicitly. It sets no review interval for precedents. https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-credit-and-recognition-prior-learning
- **RMIT Credit Policy** defines "Precedent", but the definition was not retrieved. The policy itself is reviewed every 5 years; that cycle covers the policy, not the precedents. https://policies.rmit.edu.au/document/view.php?id=126
- **UniSC** does not accept prior study more than **10 years** old for specified credit. That is a recency rule on the student's own study. https://edit.unisc.edu.au/about/policies-and-procedures/credit-transfer-academic-policy
- **ECTS Users' Guide 2015** (a 2027 revision is in draft) relies on an up-to-date course catalogue and a learning agreement amended when courses change. No precedent-validity rule was found. https://ehea.info/wp-content/uploads/2026/04/BFUG_99_CY_NO_10_ECTS_Draft-3.1_Clean_06.03.2026.pdf

## 3. How often content changes

No cross-institution measurement was found. Snow College reviews syllabi on a 5-year cycle (https://snow.edu/academics/faculty_senate/curriculum/bylaws.html). One small study found 72% of courses changed after a systematic review, mostly in outcomes and assessment (https://pmc.ncbi.nlm.nih.gov/articles/PMC6418851). Treat drift as real and uneven: some courses are stable for a decade, others change yearly.

## 4. Options analysed

**(a) Recency Caution only.** Adds nothing beyond approval year. It costs nothing and does not depend on outline quality. It fails in two ways: a course rewritten last year still has a "fresh" Precedent, and an unchanged old course is wrongly flagged.

**(b) Outline Version per Partner Course.** Adds an Outline Version entity, a Precedent→version link and "newer outline exists" flags. The cost is high with student uploads. The same content arrives in different formats (PDF, web page, handbook extract), so naive diffs create false new versions. Uploads are irregular, so a version's effective year is often unknown. Because Partner Courses are shared, an upload by another Home Institution's student (wrong year, wrong campus variant) can flag RMIT's private Precedents. This needs a curation step.

**(c) Expiry after N years.** Adds an expiry date. It is cheap, matches the norm across institutions, and is easy for approvers to understand. It fails by being content-blind: it throws away good evidence for stable courses and keeps stale evidence inside the window. A hard cut-off also empties the Precedent Score for rarely-visited partners.

**(d) Assessor-set review date (UQ/Kentucky style).** Adds a "Review By" field on approval, with a default the institution can set. It is cheap and puts judgement where it belongs. Expired items are greyed out, not deleted, as in TES. It depends on approvers bothering to change the default.

**(e) AI material-change detection.** Compares the outline snapshot a Precedent was approved against with the newest upload. It flags changes to learning outcomes, topics, assessment or Partner Credit, and ignores formatting. It reuses the Content Overlap Score machinery and avoids (b)'s false versions. It needs the stored snapshot. Risks: false negatives on subtle changes, and explaining to an assessor why the system flagged a course.

**(f) Home Unit versioning.** Home Unit outlines come from the Home Institution's own system, so they are cleaner and dated, which makes this cheaper than (b). Changes there are just as likely to invalidate a Precedent and are easy to miss.

**(g) Re-confirmation workflow.** One click lets an approver re-affirm a flagged or lapsed Precedent, which renews its date. It turns flags into fresh evidence, but it adds load for approvers and needs someone to own it.

**Interaction with AI overlap:** the Content Overlap Score always reads the *current* outline, so it already partly offsets drift. Precedents record past human judgement. A high Precedent Score alongside a low overlap score is itself a strong drift signal and is worth showing to approvers.

## 5. Recommendation

**First release:**
1. Keep Recency Caution, driven by a **Review By date** on each Precedent. Default it to 3 years (UQ pattern) and let the approver change it. Past-date Precedents stay visible as "lapsed" and count less in the Precedent Score.
2. **Store the outline snapshot** (file plus extracted text) that each Precedent was approved against, and the Home Unit outline/year. This is cheap now and impossible to recover later.
3. Show a "content may have changed" hint when the overlap score for the current outline is well below what the Precedent implies.

**Later:** AI material-change detection between the stored snapshot and new uploads (e); Home Unit change flags (f); one-click re-confirmation (g). Build curated Outline Versions (b) only if (e) proves unreliable.

## 6. Ask Global Mobility / approvers

- Does RMIT set any validity period on approved mappings or Study Plans? Is 3 years a reasonable default?
- Can one student's approval be reused for another student, and for how long?
- What counts as a material change: learning outcomes, assessment, contact hours, Partner Credit, prerequisites?
- When an RMIT Home Unit is revised or recoded, do its Precedents lapse?
- Would approvers re-confirm lapsed Precedents in bulk, and who would own that?
- Does a lapsed Precedent still have advisory value, or should it be hidden?
