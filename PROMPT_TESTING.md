# Interview Prompt Testing

## Mandatory Requirements

Every interview must:

- Conduct a conversational technical interview
- Ask at least 8 primary questions
- Cover at least 4 distinct curriculum days
- Generate follow-up questions based on previous candidate responses
- Maintain conversation context throughout the interview
- Produce structured feedback at the end
- Never end before the minimum requirements are satisfied

## Prompt Quality Criteria

Each persona will be evaluated on:

1. Naturalness
2. Quality of follow-up questions
3. Curriculum relevance
4. Difficulty calibration
5. Lack of repetition
6. Ability to maintain context
7. Overall interview quality

## Testing Candidates

Test each persona using:

- Strong candidate
- Average/mixed candidate
- Limited/thin candidate

## Persona A — Version 1

Test candidate: Emily Chen (CAND-003)

Result:
- 8 primary questions
- 6 curriculum days
- 6 grounded follow-ups
- Context maintained
- Structured feedback generated
- Mostly conversational

Issues identified:
1. Stopped at the minimum 8 questions despite a rich candidate profile.
2. Follow-ups were skipped on two questions.
3. Transitions between unrelated curriculum days felt abrupt.

Planned changes for Version 2:
1. Target 10-12 questions for rich candidates.
2. Make grounded follow-ups the default.
3. Add natural transition guidance.

## Persona A — Version 2

Test candidate: Emily Chen (CAND-003)

Result:
- 10 primary questions
- 8 curriculum days
- 8 grounded follow-ups
- Context maintained
- Structured feedback generated
- More natural transitions
- All mandatory requirements satisfied

Improvements from v1:
1. Rich candidate profile produced a longer, more useful interview.
2. Follow-up skips were explicitly justified.
3. Topic transitions became more conversational.
4. Additional SHIP_IT coverage surfaced stronger technical evidence.

Remaining issue:
- Some follow-ups remained generic despite being relevant.

Next change for Version 3:
- Strengthen follow-up instructions so questions explore dependencies,
  consequences, trade-offs, failure modes, and system-level reasoning
  instead of merely asking for elaboration or verification.

## Persona A — Version 3

Test candidate: Emily Chen (CAND-003)

Result:
- 8 primary questions
- 7 distinct curriculum days
- 8 grounded follow-ups
- Every follow-up had a purposeful angle
- Context maintained
- Structured feedback generated
- All mandatory requirements satisfied

Improvement from v2:
- Generic follow-ups were eliminated.
- Follow-ups now explore dependencies, consequences, trade-offs, or
  failure/scaling scenarios.
- Questions referenced specific details from the candidate's answers.
- The interview remained conversational and did not become unnecessarily
  difficult.

Remaining issue:
- The interview returned to the minimum of 8 questions instead of the
  10-question target used for rich candidate profiles in v2.
- However, 8 strong primary questions plus 8 grounded follow-ups already
  produced a substantial interview.
- Forcing additional questions could make the interview unnecessarily long.

Decision:
- Do not require 10-12 questions for rich candidates.
- Prioritize interview quality over question quantity.
- Use 8-10 primary questions normally.
- Use up to 10 only when additional curriculum areas provide meaningful
  new signal.
- Never add questions solely to increase the question count.

Next refinement:
- Replace the 10-12 question target with an 8-10 question target while
  keeping the improved follow-up rules from Version 3.

## Persona A v4 — Final Testing

### Change Applied

Persona A v4 introduced **one targeted change** to Persona A v3:

- Added a breadth-over-depth tie-breaker for rich candidate profiles.
- When a candidate has many passed days and mostly low attempt counts, the interviewer should prioritize reaching **10–12 primary questions**.
- If a covered day's follow-up has already produced sufficient signal, the interviewer should move to another relevant passed day instead of continuing to dig deeper.
- The change does not alter SHIP_IT prioritization, dependency tracing, follow-up types, difficulty calibration, transitions, or feedback structure.

### Test Candidate

**Emily Chen (CAND-003)**

Emily was deliberately reused from the Persona A v3 test because she has a rich profile:

- 10 passed days
- All passed days completed on attempt 1
- Multiple SHIP_IT days
- Large enough passed-day pool to test breadth

Using the same candidate isolates the effect of the v4 prompt change.

### Test Results

| Metric | Persona A v3 | Persona A v4 |
|---|---:|---:|
| Primary questions | 8 | **10** |
| Distinct curriculum days | 7 | **9** |
| Modules covered | 5 | **5** |
| Follow-ups | 8/8 | **10/10** |
| Generic verification questions | 0 | **0** |

### Follow-Up Quality

- **10/10** primary questions received grounded follow-ups.
- Follow-ups continued to use the required four types:
  - Trace a dependency
  - Explore a consequence
  - Examine a trade-off
  - Probe a failure/scaling scenario
- No generic "did you test/measure that?" questions appeared.
- No silent follow-up skips occurred.

### Rich-Profile Calibration

**PASS**

The v4 change successfully resolved the v3 question-count regression.

The interview reached **10 primary questions**, within the intended 10–12 range for a rich profile.

The interviewer also explicitly favored breadth over additional depth, using transitions such as:

> "Let's cover new ground now rather than dig deeper here."

and

> "Let's bring in a new day rather than extend this one further."

This demonstrates that the new tie-breaker was actively influencing interview behavior.

### Breadth

**PASS**

The interviewer covered **9 distinct curriculum days** instead of stopping at 7 as in v3.

No individual day received unnecessary additional depth after its follow-up had already produced sufficient signal.

### Other Requirements

- **SHIP_IT prioritization:** Maintained.
- **Dependency tracing:** Maintained.
- **Follow-up grounding:** Maintained.
- **Follow-up types:** Maintained.
- **Topic transitions:** Natural and contextual.
- **Context maintenance:** Maintained across the interview.
- **Conversational tone:** Maintained.
- **Skipped/failed-day protection:** Maintained.
- **Structured feedback:** Maintained.

### Regressions

**None identified.**

The targeted change improved question-count calibration without weakening the follow-up quality or systems-thinking behavior established in Persona A v3.

### v3 → v4 Conclusion

Persona A v4 successfully fixes the main issue identified in v3:

> Rich profiles no longer stop at the 8-question floor when additional relevant days are available.

The result was:

**8 questions / 7 days → 10 questions / 9 days**

while maintaining:

**8/8 → 10/10 grounded typed follow-ups**

with **zero generic verification questions**.

### Recommendation

**Persona A v4 is ready to finalize.**

The Persona A iteration cycle is complete:

- **v1 → v2:** improved question-count floor, follow-up handling, and transitions
- **v2 → v3:** replaced generic verification with typed follow-ups
- **v3 → v4:** fixed the rich-profile breadth-over-depth regression

No further Persona A prompt changes are required.
# Prompt Testing

## Persona B — Baseline Testing

### Test Information

* **Persona:** Persona B — The Practical Recruiter
* **Candidate:** Emily Chen (CAND-003)
* **Version:** Original / Unmodified
* **Primary Questions:** 8
* **Distinct Curriculum Days:** 7
* **Modules Covered:** 4
* **Follow-ups:** 6/8
* **Structured Feedback:** ✅
* **Mandatory Requirements:** ✅ Met

---

## Baseline Results

### Strengths

1. **Strong practical framing**

   * Questions consistently focused on real-world and production applications.
   * The interviewer frequently asked how technical decisions would matter in an actual product or workplace.

2. **Conversational authenticity**

   * The interviewer reacted naturally to Emily's answers.
   * Comments such as acknowledging honesty and practical judgment made the interaction feel more like a real recruiter conversation than a scripted technical quiz.

3. **Rewards honesty**

   * The interview created opportunities for Emily to admit when something was theoretical or unverified.
   * This worked especially well with the MCP and multi-agent questions.

4. **Clear business communication**

   * The capstone question successfully tested whether Emily could explain a technical system to a non-technical PM without unnecessary jargon.

---

## Weaknesses Identified

### 1. Job-role prioritization was not meaningfully exercised

Emily is an AI Engineer, so almost the entire curriculum is relevant to her role. As a result, the job-role prioritization rule did not have to make meaningful choices.

**Impact:** The test does not prove that Persona B will correctly prioritize curriculum days for candidates with more specialized roles.

---

### 2. Attempt-based difficulty calibration was not meaningfully exercised

Emily passed all tested days on her first attempt. Therefore, the interview mainly used the highest-difficulty branch of the persona's calibration logic.

The lower-attempt-performance branches were not tested.

**Impact:** We still need to verify that Persona B appropriately simplifies questions for candidates who struggled with a topic.

---

### 3. Generic verification follow-up appeared

The question:

> "Did you actually measure that improvement, or was it more of a gut sense?"

is reasonable, but it is a generic verification question.

It does not specifically investigate a dependency, consequence, trade-off, or failure/scaling scenario.

**Impact:** Persona B can fall back to generic "did you test/measure that?" questions instead of producing more diagnostic follow-ups.

---

### 4. Two questions lacked explicit follow-ups

Two questions did not receive a distinct follow-up, and the interviewer did not explicitly explain why it was moving on.

**Impact:** This creates inconsistent interview depth and leaves a potential gap in context-driven questioning.

---

## Mandatory Requirements

* ✅ Conducted a conversational technical interview
* ✅ Asked 8 primary questions
* ✅ Covered 4+ curriculum modules
* ✅ Maintained conversation context
* ✅ Generated follow-up questions
* ✅ Produced structured feedback
* ⚠️ Follow-ups were not present for every question
* ✅ Did not directly ask about skipped/failed days

---

## Planned Persona B v2 Improvements

The baseline prompt should remain unchanged. The following changes will be applied only in v2.

### Fix 1 — Improve job-role prioritization

Add a fallback rule for candidates whose job role is broadly relevant to most of the curriculum.

When job-role relevance does not clearly distinguish between days, prioritize:

* Days with stronger integration or practical relevance
* Higher-difficulty days
* Skills transferable to adjacent engineering roles

This ensures the job-role strategy still makes a meaningful selection.

---

### Fix 2 — Make follow-ups purposeful

Require follow-ups to primarily use one of these approaches:

1. **Trace a dependency** — ask what earlier component or decision the answer relied on.
2. **Explore a consequence** — ask what would happen downstream if the approach failed or changed.
3. **Examine a trade-off** — ask why the candidate chose this approach over a plausible alternative.
4. **Probe a failure/scaling scenario** — ask what would break under stress, unusual inputs, or increased scale.

Avoid generic questions such as:

> "Did you test that?"

or

> "Did you measure that?"

unless testing or measurement itself is directly relevant to the candidate's answer.

---

### Fix 3 — Require explicit follow-up decisions

Every primary question should receive one grounded follow-up by default.

If the candidate's answer is already exhaustive and another question would be redundant, the interviewer may move on, but should briefly explain why.

Example:

> "That's a complete answer, so I don't think we need to dig further there."

This prevents silent follow-up omissions.

---

## Expected Outcome for Persona B v2

The goal is to preserve Persona B's strongest qualities:

* Practical, production-focused questioning
* Natural recruiter-style conversation
* Honest evaluation of candidate claims
* Business-oriented communication

while improving:

* Follow-up quality
* Interview consistency
* Job-role prioritization
* Difficulty calibration
* Context-driven questioning

**Baseline Decision:** Keep Persona B v1 unchanged as the control version and test the above changes in Persona B v2.

## Persona B — v2 Testing

### Test Information

* **Persona:** Persona B — The Practical Recruiter
* **Candidate:** Emily Chen (CAND-003)
* **Version:** v2
* **Primary Questions:** 8
* **Distinct Curriculum Days:** 7
* **Modules Covered:** 4
* **Follow-ups:** 7/8
* **Structured Feedback:** ✅
* **Mandatory Requirements:** ✅ Mostly met

---

## v2 Results

### What Improved

1. **Generic verification questions were eliminated**

   * No generic "did you test/measure that?" follow-ups appeared.
   * Follow-ups consistently used dependency tracing, consequences, trade-offs, or failure/scaling scenarios.

2. **Follow-up quality improved**

   * Questions were more diagnostic and grounded in Emily's actual answers.
   * Example: the Day 22 follow-up explored the coordination failure introduced by a multi-agent architecture.

3. **Context linking improved**

   * The Day 21 follow-up explicitly connected the agent architecture to the earlier Day 13 function-calling implementation.

4. **Conversational personality was preserved**

   * The practical recruiter tone remained intact.
   * Reactions such as acknowledging honesty and practical judgment continued to make the interview feel natural.

---

## Remaining Issues

### 1. Final-question follow-up was not explicitly acknowledged

The final Day 31 question ended directly with the interview closing.

Unlike the mid-interview questions, it did not explicitly state why no further follow-up was needed.

**Result:** 7/8 follow-ups were clearly accounted for.

This is a small consistency issue rather than a major functional failure.

---

### 2. Job-role prioritization remains unverified

Emily is an AI Engineer, so most of the curriculum is naturally relevant to her role.

The fallback rule was added successfully, but this test did not demonstrate that it actually changes day selection in a meaningful way.

**Conclusion:** The rule exists, but requires a more differentiated candidate to validate.

---

### 3. Attempts-based calibration remains unverified

Emily's profile is dominated by first-attempt passes, so the interview only exercised the "justify a trade-off" difficulty branch.

The higher-attempt branch that should produce simpler, PM-style explanations was not exercised.

**Conclusion:** This is a test coverage limitation, not evidence that the prompt rule is broken.

---

## v1 vs v2

| Metric               |      v1 |     v2 | Result    |
| -------------------- | ------: | -----: | --------- |
| Primary questions    |       8 |      8 | Same      |
| Distinct days        |       7 |      7 | Same      |
| Modules              |       4 |      4 | Same      |
| Follow-ups           |     6/8 |    7/8 | Improved  |
| Generic verification | Present |   None | Improved  |
| Context linking      |    Good | Better | Improved  |
| Conversational tone  |  Strong | Strong | Preserved |
| Structured feedback  |       ✅ |      ✅ | Preserved |

---

## Regression Check

**No major regressions identified.**

The only remaining issue is the lack of an explicit follow-up decision on the final question.

The three targeted v2 changes otherwise behaved as intended.

---

## Decision

**Do not lock Persona B as final yet.**

Create Persona B v3 with only one targeted change:

> If the current question is the final interview question, still explicitly acknowledge that no additional follow-up is needed before closing the interview and generating feedback.

Do not make any other prompt changes.

After v3, test Persona B against a candidate whose profile can exercise the currently unverified rules:

* A candidate with a job role less directly related to AI engineering, and/or
* A candidate with several higher-attempt curriculum days.

This will validate job-role prioritization and attempts-based difficulty calibration before Persona B is finalized.

## Persona B — Version 3 Testing

### Test Information

* **Persona:** Persona B — The Practical Recruiter
* **Candidate:** Gerald Combs (CAND-010)
* **Version:** v3
* **Primary Questions:** 8
* **Distinct Curriculum Days:** 5
* **Modules Covered:** 4
* **Follow-ups:** 8/8
* **Structured Feedback:** ✅
* **Mandatory Requirements:** ✅ Met

### Why Gerald Was Selected

Gerald was selected specifically because his profile exercises the two Persona B rules that could not be meaningfully validated using Emily Chen:

* **Job role:** IT Support Specialist — not directly AI-engineering-focused, forcing the interviewer to make a meaningful job-role prioritization decision.
* **Attempts:** His passed days are mostly at attempts 3–5, allowing the simpler-explanation calibration branch to be exercised.
* He also has failed days (8, 10, 22) and skipped days (27, 28), providing a meaningful test of the rule that skipped/failed days must never be surfaced.

Eligible passed days for questioning:

* Day 1 — 2 attempts
* Day 7 — 5 attempts
* Day 12 — 5 attempts
* Day 16 — 4 attempts
* Day 31 — 3 attempts

---

## v3 Change

Persona B v3 introduced **one targeted change** from v2:

> If the current question is the final primary question, apply the same follow-up decision rule as every other question. If a follow-up would be redundant, explicitly acknowledge that before closing the interview.

No other Persona B behavior was intentionally changed.

---

## v3 Results

### Interview Structure

* **8 primary questions**
* **5 distinct curriculum days**
* **4 distinct curriculum modules**
* **8/8 grounded follow-ups**
* **Structured feedback generated**
* **Context maintained throughout**

The candidate had only five eligible passed days, so the interviewer appropriately revisited available material rather than violating the guardrail against asking about failed or skipped days.

---

## Follow-Up Quality

**PASS**

All 8 primary questions received a grounded follow-up or explicit follow-up decision.

Follow-ups were based on the candidate's actual response or profile context and used purposeful approaches such as:

* **Trade-off**
* **Consequence**
* **Dependency**
* **Failure/scenario reasoning**

No generic verification questions such as "Did you test that?" or "Did you measure that?" appeared.

### Final-Question Rule

**PASS**

The final Day 31 question received an explicit follow-up decision before the interview closed.

The interviewer acknowledged that the candidate's answer was complete and explained why no additional probing was necessary before ending the interview.

This directly resolves the issue identified in Persona B v2.

---

## Job-Role Prioritization

**PASS**

The candidate's IT Support Specialist background meaningfully influenced the interview.

Examples included:

* Connecting virtual-environment isolation to the candidate's existing server/system experience.
* Framing the Day 16 API question around how someone with an IT support background would diagnose a failing or hanging endpoint.
* Asking the candidate to explain the capstone using an analogy appropriate for an IT support team.

This is the first Persona B test where job-role prioritization was meaningfully exercised rather than being effectively irrelevant because the candidate was already an AI Engineer.

---

## Attempts-Based Difficulty Calibration

**PASS**

The candidate's higher attempt counts correctly triggered the simpler explanation branch.

Examples included questions such as:

* Asking the candidate to explain embeddings "in plain terms, no jargon."
* Asking for a simple explanation of what a system prompt is.
* Focusing on understanding and practical reasoning rather than requiring advanced theoretical explanations.

This confirms that the attempts-based calibration rule works when tested against a candidate with a heavier struggle profile.

---

## Context Maintenance

**PASS**

The interviewer maintained a consistent understanding of Gerald's background throughout the conversation.

The candidate's IT support experience was repeatedly used to connect new questions to previous answers and existing knowledge.

The interview therefore felt like one continuous conversation rather than a sequence of unrelated curriculum questions.

---

## Conversational Quality

**PASS**

The interview remained warm and conversational without losing technical substance.

Examples of successful behavior included:

* Acknowledging Gerald's honesty about concepts that took multiple attempts.
* Connecting his existing operational experience to new AI concepts.
* Using his IT support background to frame technical questions.
* Avoiding unnecessary jargon when the attempts-based calibration required simpler explanations.

The interviewer did not feel like it was simply reading a fixed list of questions.

---

## Guardrail Check

**PASS**

Gerald had:

* Failed days: 8, 10, 22
* Skipped days: 27, 28

None of these were directly questioned or surfaced as interview topics.

The interviewer restricted questioning to the candidate's eligible passed-day pool.

---

## Mandatory Requirements

* ✅ Conducted a conversational technical interview
* ✅ Asked at least 8 primary questions
* ✅ Covered at least 4 distinct curriculum modules
* ✅ Generated grounded follow-ups
* ✅ Maintained conversation context
* ✅ Produced structured feedback
* ✅ Never asked about skipped days
* ✅ Never asked about failed days
* ✅ Applied attempts-based difficulty calibration
* ✅ Applied job-role prioritization
* ✅ Applied the final-question follow-up rule

---

## v2 vs v3

| Metric                        | Persona B v2 |  Persona B v3 |
| ----------------------------- | -----------: | ------------: |
| Primary questions             |            8 |             8 |
| Distinct curriculum days      |            7 |             5 |
| Modules                       |            4 |             4 |
| Follow-ups                    |          7/8 |       **8/8** |
| Generic verification          |         None |      **None** |
| Final-question acknowledgment |      Missing |   **Present** |
| Job-role calibration          |   Unverified | **Confirmed** |
| Attempts calibration          |   Unverified | **Confirmed** |
| Context maintenance           |         Good |      **Good** |
| Conversational tone           |       Strong |    **Strong** |
| Structured feedback           |            ✅ |             ✅ |

The lower number of curriculum days in v3 is expected because Gerald had only five eligible passed days. The interviewer correctly prioritized the available passed-day pool instead of asking about failed or skipped days.

The important improvement from v2 to v3 was the **final-question handling**, which was confirmed to work without causing regressions.

---

## Regression Check

**No regressions identified.**

The v3 change did not negatively affect:

* Follow-up quality
* Conversational tone
* Job-role framing
* Attempts-based calibration
* Context maintenance
* Curriculum guardrails
* Feedback structure

No generic verification questions appeared, and no silent follow-up skips occurred.

---

## Decision

**Persona B v3 is FINAL.**

The Persona B iteration cycle is complete:

* **v1 → v2:** improved follow-up quality, job-role fallback, and explicit follow-up decisions
* **v2 → v3:** fixed final-question follow-up handling
* **v3:** validated against a candidate specifically chosen to exercise job-role and attempts-based calibration

### Final Status

**Persona B v3 — FINALIZED ✅**

No further Persona B prompt changes are required.

## Persona C — Baseline Testing

### Test Information

* **Persona:** Persona C — The Curious Peer
* **Candidate:** Emily Chen (CAND-003)
* **Version:** Original / Unmodified
* **Primary Questions:** 8
* **Distinct Curriculum Days:** 7
* **Modules Covered:** 4
* **Follow-ups:** 8
* **Structured Feedback:** ✅
* **Mandatory Requirements:** ✅ Met

---

## Baseline Results

### Strengths

1. **Strong free-flowing conversation**

   * The interviewer naturally followed interesting threads instead of rigidly moving from one question to another.
   * The MCP discussion received multiple follow-ups before moving to another curriculum area.
   * The agent discussion similarly continued for an extra exchange.

2. **Story-first day selection worked**

   * The interview opened with Day 23 (MCP) rather than early curriculum content.
   * This matched Persona C's instruction to start with whichever passed day creates the strongest conversation.

3. **Most natural conversational tone so far**

   * Reactions such as "Ha, fair, that tracks" and "Oh totally" made the interaction feel like a genuine peer conversation.
   * The interviewer remained technically curious without sounding like a formal interviewer.

4. **Context was maintained**

   * Follow-ups referenced Emily's actual answers.
   * The interviewer was able to stay on a topic for multiple exchanges when the candidate provided something interesting.

---

## Weaknesses Identified

### 1. Follow-up quality was less diagnostic than Personas A/B

One follow-up approached a generic verification pattern:

> "Did switching to the agent fix it cleanly, or did you run into new weirdness?"

The question was relevant, but it did not clearly investigate a dependency, consequence, trade-off, or failure/scaling scenario.

**Impact:** Persona C's flexible follow-up style can occasionally produce less diagnostic questions than Personas A and B.

---

### 2. Rich candidate profile was underused

Emily has a rich profile with multiple passed days, but the interview stopped at:

* 8 primary questions
* 7 curriculum days

This is technically compliant with the minimum requirements, but it leaves additional useful curriculum signal unexplored.

**Impact:** Persona C's exploratory style should not become an excuse to stop early when a rich candidate has additional relevant passed areas worth discussing.

---

### 3. Attempts-based calibration was not meaningfully tested

Emily's tested profile is dominated by first-attempt passes.

Therefore, the "go easier where attempts were high" rule was not meaningfully exercised.

**Impact:** This is a test coverage limitation rather than evidence that the prompt rule is broken.

A high-attempt candidate should be used in a later test to verify this behavior.

---

## Mandatory Requirements

* ✅ Conducted a conversational technical interview
* ✅ Asked 8 primary questions
* ✅ Covered 4+ distinct curriculum modules
* ✅ Maintained conversation context
* ✅ Generated follow-up questions
* ✅ Produced structured feedback
* ✅ Did not ask about skipped/failed days

---

## Baseline Comparison Signal

Persona C already demonstrates a meaningful difference from Personas A and B:

* **Persona A:** strongest systems/dependency reasoning
* **Persona B:** strongest job-relevance and hiring signal
* **Persona C:** strongest exploratory conversation and natural peer interaction

The Persona C refinement should preserve this distinction rather than turning it into another rigid interviewer.

---

## Planned Persona C v2 Improvements

The baseline prompt should remain unchanged as the control version. The following changes will be applied only in v2.

### Fix 1 — Improve follow-up diagnostic quality

Add guidance encouraging follow-ups to investigate one of these areas when appropriate:

1. **Trace a dependency** — what earlier component or decision the answer relied on.
2. **Explore a consequence** — what would happen downstream if the approach changed or failed.
3. **Examine a trade-off** — why the candidate chose this approach over a plausible alternative.
4. **Probe a failure/scaling scenario** — what would break under unusual input, edge cases, or increased scale.

However, Persona C should **not** be forced into a rigid one-follow-up-per-question structure.

The interviewer should still be able to:

* Stay on an interesting thread for an extra exchange.
* Follow something the candidate mentioned naturally.
* Move on when the conversation has produced enough signal.

The goal is **better diagnostic follow-ups without losing the peer-like flow**.

---

### Fix 2 — Improve rich-profile breadth

When the candidate has many passed days and enough relevant curriculum areas remain available, do not stop at the 8-question minimum solely because the conversation has already produced strong answers.

Prefer exploring another meaningful passed day when:

* The current topic has already produced sufficient signal.
* Another passed day can provide genuinely new evidence.
* The additional question will not feel repetitive.

Do not add questions solely to increase the count.

Persona C should remain exploratory rather than becoming a rigid 10-12 question interviewer.

---

### Fix 3 — Preserve Persona C's defining behavior

The v2 changes must **not** remove Persona C's core characteristics:

* Casual peer-to-peer tone
* Story-first topic selection
* Flexible follow-up chaining
* Candidate-led exploration
* Genuine reactions to interesting answers
* Informal but concrete feedback

The purpose of v2 is to make the interview **more diagnostically useful**, not more scripted.

---

## Persona C v2 Testing Plan

### Primary Test Candidate

**Emily Chen (CAND-003)**

Reason:

* Same candidate as the Persona C baseline.
* Rich passed-day profile.
* Allows the v2 changes to be isolated and compared directly against v1.
* Tests whether the rich-profile breadth issue improves without sacrificing naturalness.

### Additional Validation Candidate

After the Emily v2 test, use a candidate with:

* Several higher-attempt passed days, and
* A less directly AI-focused job role if available.

This will verify that Persona C's attempts-based calibration and candidate-context behavior work outside the all-first-attempt Emily profile.

---

## Expected Outcome for Persona C v2

The goal is to preserve Persona C's strongest baseline qualities:

* Natural peer conversation
* Flexible exploration
* Strong short-term context
* Story-first topic selection

while improving:

* Follow-up diagnostic quality
* Rich-profile curriculum coverage
* Evidence gathered per interview

**Baseline Decision:** Keep Persona C v1 unchanged as the control version and test the targeted changes in Persona C v2.






