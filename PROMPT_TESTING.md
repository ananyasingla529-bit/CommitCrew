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

## Persona A v4 

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

## Persona A v5 — Thin-Profile Retest

### Change Applied

Persona A v5 introduced one targeted change from Persona A v4:

- Added a thin-profile fallback for candidates with fewer than 8 eligible
  passed days.
- Once every eligible day has been asked about once, the interviewer may
  revisit previously covered eligible days from a genuinely different angle
  until the normal ~8-question minimum is reached, or until no meaningful
  new question remains.
- Revisited questions must not repeat or lightly rephrase earlier questions.
- Revisit questions must be grounded in the candidate's actual completed work
  and should connect naturally to something the candidate said earlier.
- Failed/skipped days remain completely off-limits.

No other Persona A behavior was intentionally changed.

### Test Candidate

**Gerald Combs (CAND-010)**

Gerald was selected because he has a thin eligible-day pool:

- Day 1 — 2 attempts
- Day 7 — 5 attempts
- Day 12 — 5 attempts
- Day 16 — 4 attempts
- Day 31 — 3 attempts

Failed days:

- Day 8
- Day 10
- Day 22

Skipped days:

- Day 27
- Day 28

### Test Results

| Metric | Result |
| --- | ---: |
| Eligible curriculum days | 5 |
| Primary questions | **8** |
| Distinct curriculum days | **5** |
| Follow-ups | **8/8** |
| Generic verification questions | **0** |
| Failed/skipped days referenced | **0** |

### Thin-Profile Handling

**PASS**

The candidate had only five eligible passed days, so reaching the normal
8-question minimum required revisiting previously covered days.

The interviewer revisited Days 1, 12, and 16 from genuinely different angles:

- Day 1 → practical setup advice for a new hire
- Day 12 → diagnosing vague prompts before testing them
- Day 16 → concurrent requests and session isolation

These were not repetitions or light rephrasings of the original questions.

### Revisit Quality

**PASS**

Each revisit produced new signal and was grounded in something Gerald had
already said.

The interviewer did not announce the revisits procedurally with phrases such
as "let's go back to Day X." Instead, transitions connected naturally to
Gerald's earlier answers.

### Follow-Up Quality

**PASS**

All 8 primary questions received grounded follow-ups.

Follow-ups continued to use the required four types:

- Trace a dependency
- Explore a consequence
- Examine a trade-off
- Probe a failure/scaling scenario

No generic "did you test/measure that?" questions appeared.

### Guardrail Check

**PASS**

The interviewer never asked about or referenced Gerald's:

- Failed days: 8, 10, 22
- Skipped days: 27, 28

No fabricated completion was introduced.

### Persona Fidelity

**PASS**

The systems-thinking identity remained intact.

Even the revisits continued to probe how components behave in practical system
conditions, especially the Day 16 concurrency question.

### Feedback Quality

**PASS**

The final feedback correctly distinguished between:

- Capabilities demonstrated by Gerald
- Gaps or uncertainties Gerald himself identified
- Areas that remained structurally unverified because the eligible pool was
  limited

This is especially important for thin profiles because lack of evidence should
not be treated as evidence of weakness.

### Regression Check

**No regressions identified.**

The following Persona A v4 behaviors remained intact:

- SHIP_IT prioritization
- Dependency tracing
- Attempts-based calibration
- Typed follow-ups
- Failed/skipped-day protection
- Natural transitions
- No repetition
- Evidence-based structured feedback

### v4 → v5 Conclusion

Persona A v5 successfully fixes the thin-profile defect:

> Candidates with fewer than 8 eligible days no longer cause the interview to
> stop early simply because the eligible pool is exhausted.

The Gerald test produced:

**5 eligible days → 8 primary questions**

while maintaining:

**8/8 grounded typed follow-ups**

with:

**0 failed/skipped-day violations**

and no meaningful repetition.

### Recommendation

**Persona A v5 is FINAL.**

The Persona A iteration cycle is now complete:

- **v1 → v2:** improved question-count floor, follow-up handling, and transitions
- **v2 → v3:** replaced generic verification with typed follow-ups
- **v3 → v4:** fixed rich-profile breadth-over-depth behavior
- **v4 → v5:** fixed thin-profile early termination through grounded revisits

---

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

## Persona B Retest — Vague Answer Escalation

### Test Candidate

David Miller — Business Analyst

### Test Configuration

* Persona: B — The Practical Recruiter
* Prompt: Unmodified Persona B baseline
* Same candidate used for baseline comparison
* 8 primary questions
* 4 modules
* Deliberately vague answers introduced on Day 12 and Day 10

### Results

| Criterion                                             | Result |
| ----------------------------------------------------- | ------ |
| Detects vague/non-concrete answers                    | ✅      |
| Explicitly identifies lack of evidence                | ✅      |
| Records vague answers as feedback gaps                | ✅      |
| Pushes beyond the initial vague answer                | ✅      |
| Consistent escalation threshold                       | ❌      |
| Uses an alternative probing strategy before giving up | ❌      |
| Maintains conversational recruiter style              | ✅      |
| Overall interview flow                                | ✅      |

### Confirmed Defect

Persona B recognizes vague answers and explicitly states that the candidate has not provided enough concrete evidence. However, its escalation behavior is inconsistent.

On Day 12, the interviewer continued probing after multiple vague responses before eventually stopping.

On Day 10, the interviewer stopped after a shorter escalation.

In neither case did the interviewer consistently apply a defined escalation strategy such as:

1. requesting a concrete example,
2. if still vague, reframing the question or providing a smaller concrete anchor,
3. then recording the gap and moving on.

### What Is Working

The transparency behavior should be preserved.

The interviewer correctly:

* identified that the answers remained vague,
* did not pretend the answers were sufficient,
* explicitly communicated the evidence gap,
* recorded the issue in the final feedback.

### Verdict

**CONFIRMED DEFECT — Persona B escalation behavior**

The defect is limited to the lack of a consistent escalation rule for repeatedly vague answers.

### Recommended Fix

Make the escalation behavior explicit and bounded.

The interviewer should use a consistent progression when an answer remains vague:

1. Ask for a concrete example or specific evidence.
2. If the response remains vague, try one different, simpler or more specific angle to help the candidate provide evidence.
3. If the answer is still non-concrete, explicitly identify the evidence gap, record it as a gap, and move on.

Do not require unlimited probing or repeatedly ask the same question.

**No prompt modification has been made yet.**

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

# Persona C v2 — Test Run: Gerald Combs (CAND-010)

## Test Purpose

Second validation pass for Persona C v2 using Gerald Combs, selected to test
behaviors that Emily Chen could not exercise:

- Attempts-based difficulty calibration under a high-attempt profile
- Protection against asking about failed/skipped days
- Persona C's behavior with a thinner pool of usable curriculum days
- Whether rich-profile breadth guidance avoids padding when the candidate has
  limited passed-day coverage
- Whether Persona C's casual, peer-style identity remains intact under these
  constraints

## Candidate Profile

**Candidate:** Gerald Combs (CAND-010)

**Role:** IT Support Specialist

**Passed, non-failed, non-skipped days available:**
- Day 1 — attempts 2
- Day 7 — attempts 5
- Day 12 — attempts 5
- Day 16 — attempts 4
- Day 31 — attempts 3

**Failed days:** 8, 10, 22

**Skipped days:** 27, 28

This is intentionally a thin-profile candidate compared with Emily Chen.
The test therefore checks whether Persona C follows the signal rather than
artificially expanding the interview to satisfy a question-count target.

## Expected Behaviors Under Test

### 1. Attempts-Based Calibration

Persona C v2 should visibly adjust question difficulty based on attempts.

For Gerald's high-attempt days (especially Days 7, 12, and 16), questions should
lean toward simple explanation and practical understanding rather than assuming
deep mastery.

The interviewer should not punish the candidate for struggling during the
cohort. The goal is to determine what they actually understand now.

### 2. Failed/Skipped-Day Guardrail

The interviewer must never ask Gerald about:

- Day 8
- Day 10
- Day 22
- Day 27
- Day 28

These days can inform the candidate's available profile internally, but should
not become interview questions.

### 3. Thin-Profile Handling

Gerald only has five usable passed days.

Persona C should still reach the required minimum of:

- 8+ primary questions
- 4+ modules

However, it should achieve this through useful depth and natural thread
exploration rather than padding the interview with irrelevant or unavailable
days.

Revisiting a useful day is acceptable when it produces genuinely different
signal.

### 4. Persona C Identity

The interviewer should remain:

- Casual
- Curious
- Peer-like
- Candidate-led
- Story-first
- Flexible with follow-up chaining

It should NOT become a rigid Persona A/B-style interview merely because the
candidate has a thin profile.

Avoid explicit procedural narration such as:

> "That's a complete answer, so I don't think we need to dig further."

unless it genuinely fits the conversational flow.

### 5. Follow-Up Quality

Follow-ups should continue to naturally pull toward:

- Dependency
- Consequence
- Trade-off
- Failure/scaling scenario

They should not become a checklist.

Generic filler such as:

- "Did you test that?"
- "Can you tell me more?"
- "Was that verified?"

should be avoided unless the question is specifically relevant to testing or
verification.

## Validation Status

**Status:** Pending test

**Emily Chen v2 test:** PASS

The Emily test confirmed:

- Follow-up diagnostic quality improved
- Generic filler was eliminated
- Rich-profile breadth improved from 8 questions / 7 days to 10 questions /
  10 days
- Story-first opening remained intact
- Flexible chaining remained intact
- Persona C did not drift toward Persona A/B rigidity
- Feedback remained informal and concrete

**Remaining validation gap:**

Gerald Combs is required to validate attempts-based calibration and
failed/skipped-day protection under real pressure.

## Decision Rule

After the Gerald test:

- **PASS with no meaningful regression:** Persona C v2 can be finalized.
- **Attempts calibration works but another Persona C-specific issue appears:**
  make a targeted v3 change.
- **Failed/skipped guardrail breaks:** fix the guardrail before finalizing.
- **Persona C loses its peer-chat identity:** revert the problematic change and
  make the smallest possible correction.

Do not make additional prompt changes before this validation unless the test
reveals a concrete failure.

# Persona C v2 — Validation Test: Gerald Combs (CAND-010)

## Test Purpose

Second and final validation pass for Persona C v2 using Gerald Combs.

This test was specifically chosen to exercise behaviors that Emily Chen could
not validate:

- Attempts-based calibration with a high-attempt candidate
- Failed/skipped-day protection
- Thin-profile handling
- Persona C identity under constrained curriculum coverage
- Natural follow-up chaining without padding

## Candidate Profile

**Candidate:** Gerald Combs (CAND-010)

**Role:** IT Support Specialist

**Usable passed days:**

- Day 1 — attempts 2
- Day 7 — attempts 5
- Day 12 — attempts 5
- Day 16 — attempts 4
- Day 31 — attempts 3

**Failed days:** 8, 10, 22

**Skipped days:** 27, 28

---

## Testing Report

### Interview Structure

| Metric | Result |
|---|---|
| Primary questions | **8** |
| Distinct curriculum days | **5** — Days 1, 7, 12, 16, 31 |
| Modules covered | **5** |
| Follow-ups | **8/8** |
| Generic filler follow-ups | **0** |

Day 16 was revisited once, but the second discussion produced new signal
around concurrency implementation rather than repeating the original question.

### 1. Attempts-Based Calibration — PASS

The interviewer correctly adjusted difficulty for Gerald's high-attempt days.

- **Day 12 — 5 attempts:** Asked for a plain-language explanation of a
  system prompt rather than a deep technical question.
- **Day 7 — 5 attempts:** Asked what an embedding does "in your own words"
  instead of requiring mathematical or implementation-level reasoning.
- **Day 16 — 4 attempts:** Used a practical scaling scenario around 50
  concurrent users rather than assuming production-level implementation
  experience.

The interviewer did not treat passing a day as evidence of deep mastery.

### 2. Failed/Skipped-Day Protection — PASS

The interviewer never asked about or referenced:

- Failed: Days 8, 10, 22
- Skipped: Days 27, 28

All questions remained within Gerald's five eligible passed days.

### 3. Thin-Profile Handling — PASS

Gerald only had five usable curriculum days, yet Persona C reached the
8-question minimum without inventing topics or padding the interview.

Day 16 was revisited because it offered additional useful signal:

- Initial discussion → understanding of concurrency risks
- Revisit → distinction between recognizing a risk and actually implementing
  a solution

This produced new hiring signal rather than repetition.

### 4. Persona C Identity — PASS

Persona C's defining characteristics remained intact:

- Casual, peer-like tone
- Story-first opening
- Candidate-led exploration
- Flexible follow-up chaining
- Natural topic revisits
- No rigid one-follow-up-per-question structure
- No explicit procedural narration about interview rules

The interviewer opened with the capstone rather than automatically starting at
Day 1 and repeatedly used Gerald's IT support background to shape the
conversation.

### 5. Follow-Up Quality — PASS

Follow-ups naturally explored:

- **Consequence/failure:** What could cause the chatbot to hang?
- **Scaling:** What would strain with 50 concurrent users?
- **Trade-off/reality check:** Was concurrency actually handled or merely
  recognized as a risk?

The follow-ups were not distributed mechanically as a checklist.

Two softer follow-ups were appropriate for the candidate's high-attempt
profile and remained conversational rather than becoming generic filler.

No generic verification questions appeared.

### 6. Context Maintenance — PASS

The interviewer consistently incorporated Gerald's IT support background into
later questions.

Examples included:

- Applying his operational experience to diagnosing a hanging request
- Connecting environment consistency to his previous server experience
- Framing system prompts as a configuration/policy concept

This created continuity across otherwise separate curriculum days.

### 7. Repetition / Padding — PASS

No unnecessary repetition was identified.

The single revisited day (Day 16) generated new information about the gap
between understanding a scalability risk and implementing a solution.

### 8. Structured Feedback — PASS

The final response used the required schema:

- `summary`
- `strengths`
- `gaps`
- `next`

Feedback remained informal and concrete, with observations grounded in
Gerald's actual answers.

### 9. Naturalness — PASS

The interview remained conversational and peer-like rather than becoming a
formal quiz or rigid evaluation script.

---

## Regressions

**None identified.**

Persona C v2 maintained the improvements from the Emily test while also
passing the high-attempt, thin-profile, and failed/skipped-day validation
conditions introduced by the Gerald test.

---

## Persona C v2 Final Validation Summary

| Behavior | Emily Chen | Gerald Combs | Result |
|---|---|---|---|
| Follow-up diagnostic quality | PASS | PASS | **PASS** |
| Rich-profile breadth | PASS | N/A — thin profile | **PASS** |
| Attempts calibration | Not exercised | PASS | **PASS** |
| Failed/skipped guardrail | Not exercised | PASS | **PASS** |
| Thin-profile handling | N/A — rich profile | PASS | **PASS** |
| Persona C identity | PASS | PASS | **PASS** |
| Flexible chaining | PASS | PASS | **PASS** |
| Structured feedback | PASS | PASS | **PASS** |
| Naturalness | PASS | PASS | **PASS** |

## Final Recommendation

**Persona C v2 is FINAL.**

Both required validation profiles passed:

- **Emily Chen:** rich, low-attempt profile → validated diagnostic follow-ups,
  story-first selection, and rich-profile breadth.
- **Gerald Combs:** thin, high-attempt profile with real failed/skipped days →
  validated attempts calibration, guardrails, thin-profile handling, and
  Persona C identity.

No Persona C v3 change is required.

### Phase 1 Persona Status

- **Persona A v4 — FINAL**
- **Persona B v3 — FINAL**
- **Persona C v2 — FINAL**

All three personas have now completed individual validation.

# Head-to-Head Persona Comparison — A vs B vs C

## Finalized Versions Tested

- Persona A — v4 FINAL
- Persona B — v3 FINAL
- Persona C — v2 FINAL

Persona C transcripts reuse the validated Emily Chen and Gerald Combs runs already documented above. No prompt modifications were made between those validation runs and this comparison.

---

## Executive Summary

All three personas met the mandatory interview requirements on both candidates with zero guardrail violations.

The comparison confirmed that the personas are intentionally different rather than competing to behave identically:

- **Persona A:** strongest pure technical and architectural signal
- **Persona B:** strongest hiring-decision-ready feedback
- **Persona C:** strongest candidate experience, adaptability, and natural conversation

No persona showed a concrete defect requiring another prompt revision.

The results support keeping all three personas rather than converging them into a single interviewing style.

---

## Persona A — Final Assessment

**Version:** v4 FINAL

### Strengths

- Deepest dependency and architectural reasoning
- Strongest systems-level signal
- Consistently traces how components depend on and feed into each other
- Strong breadth on rich candidate profiles
- Strong typed follow-ups across the interview
- Effective at exposing failure propagation and architectural trade-offs

### Weaknesses

- More audit-like than conversational
- Less warm and natural than Persona C
- Can feel more structured and directed
- Dependency probing must remain restricted to the candidate's eligible curriculum pool

### Best Use

Architecture-heavy or systems-focused evaluations where maximum technical depth is the priority.

### Verdict

**FINAL — No changes recommended.**

---

## Persona B — Final Assessment

**Version:** v3 FINAL

### Strengths

- Most directly useful for hiring decisions
- Strong production and job-readiness framing
- Good balance between technical reasoning and practical applicability
- Strong attempts-based calibration
- Strong failed/skipped-day protection
- Feedback is immediately understandable to a hiring manager

### Weaknesses

- Question framing can become somewhat formulaic
- Less deep dependency tracing than Persona A
- More structured than Persona C

### Best Use

Standard hiring-decision interviews where the primary question is whether the candidate can apply their knowledge effectively in a real role.

### Verdict

**FINAL — No changes recommended.**

---

## Persona C — Final Assessment

**Version:** v2 FINAL

### Strengths

- Most natural and conversational
- Strongest candidate experience
- Highly adaptable to candidate answers
- Candidate-led tangents and thread chaining work well
- Strong follow-up diagnostics without becoming checklist-driven
- Rich-profile breadth improved without mechanical question padding
- Strong attempts-based calibration
- Strong thin-profile and failed/skipped-day handling

### Weaknesses

- Maximum technical depth is slightly below Persona A
- Feedback is less explicitly formatted around hiring decisions than Persona B
- Closing synthesis can be less explicit

### Best Use

Candidates who benefit from a lower-pressure, conversational interview style, particularly junior, non-traditional, or candidates with backgrounds outside AI.

### Verdict

**FINAL — No changes recommended.**

---

## Head-to-Head Results

| Criterion | Persona A | Persona B | Persona C | Winner |
|---|---:|---:|---:|---|
| Technical signal | 9 | 8 | 7.5 | A |
| Depth | 9.5 | 8 | 7.5 | A |
| Adaptability | 7.5 | 8 | 9.5 | C |
| Curriculum coverage | 9 | 7.5 | 8.5 | A |
| Follow-up quality | 9 | 8.5 | 8 | A |
| Naturalness | 6.5 | 7.5 | 9.5 | C |
| Candidate experience | 7 | 8 | 9.5 | C |
| Feedback quality | 8.5 | 9 | 8 | B |
| Cross-profile consistency | 9 | 9 | 9 | Tie |
| Overall hiring usefulness | 8.5 | 9 | 7.5 | B |

---

## Candidate Comparison

### Emily Chen — Rich, AI-Native Profile

**Persona A**
- 10 primary questions
- 9 distinct curriculum days
- 5 modules
- 10/10 grounded typed follow-ups
- Strongest dependency tracing
- Deepest architectural signal

**Persona B**
- 8 primary questions
- 6 distinct curriculum days
- 4 modules
- 8/8 grounded follow-ups
- Strongest hiring-manager-oriented feedback

**Persona C**
- 10 primary questions
- 10 distinct curriculum days
- 4 modules
- 9 follow-ups
- Strongest natural candidate-led exploration
- Preserved conversational identity while increasing breadth

### Gerald Combs — Thin, High-Attempt Profile

All three personas:

- Used only eligible passed days
- Avoided all failed/skipped days
- Reached 8 questions without inventing curriculum content
- Adapted difficulty to higher attempt counts
- Produced concrete feedback
- Maintained cross-profile consistency

**Persona A**
- Strongest dependency reasoning
- Revisited Day 16 for additional signal

**Persona B**
- Strongest direct hiring-readiness signal
- Extracted useful production/reliability information without needing additional curriculum breadth

**Persona C**
- Strongest low-pressure candidate experience
- Naturally encouraged honest admissions about what was and wasn't implemented
- Preserved peer-conversation style under a thin profile

---

## Final Behavioral Distinction

The three personas should remain intentionally different:

- **A = Audit-style:** "How does the system connect?"
- **B = Decision-style:** "Can this person actually do the job?"
- **C = Conversation-style:** "How does this candidate think when we follow their story?"

Trying to make all three behave the same would remove the reason for having three personas.

---

## Final Recommendation

Do **not** merge the personas or make additional prompt changes at this stage.

Use a routing layer to select the persona based on the interview context:

- **Persona B** → default hiring-decision interviews
- **Persona A** → architecture/systems-heavy roles where technical depth is the priority
- **Persona C** → candidates who benefit from a more conversational and lower-pressure experience

The evidence does not justify a more complex routing system yet. Job role/type and candidate profile are sufficient signals for an initial routing strategy.

---

## Phase 1 Status

**Phase 1 — COMPLETE**

### Final Versions

- Persona A → **v5 FINAL**
- Persona B → **v3 FINAL**
- Persona C → **v2 FINAL**

### Validation Completed

- Persona-specific iteration testing
- Emily Chen validation
- Gerald Combs validation
- Attempts-based calibration
- Failed/skipped-day protection
- Thin-profile handling
- Rich-profile breadth
- Follow-up quality
- Curriculum coverage
- Candidate experience
- Structured feedback
- Cross-persona comparison

### Regressions

**None identified.**

### Prompt Changes Required

**None.**

The three personas are considered finalized and ready for implementation/integration.

## Phase 2 — Persona B Baseline Test

### Test Candidate
David Miller — Business Analyst

### Test Configuration
- Persona: B — The Practical Recruiter
- Primary questions: 8
- Distinct curriculum days: 8
- Modules covered: 4
- Candidate profile: Same David Miller profile used for persona comparison

### Results

| Criterion | Result |
|---|---|
| Business/job-role framing | ✅ Strong |
| Attempts-based calibration | ✅ Worked |
| Follow-ups grounded in candidate answers | ✅ Strong |
| Generic verification avoided | ✅ |
| Skipped/failed days avoided | ✅ |
| 8+ primary questions | ✅ |
| 4+ modules | ✅ |
| Conversational recruiter style | ✅ Strong |
| Feedback format | ✅ Correct |

### Strengths Observed

- Questions consistently connected AI concepts to business/stakeholder concerns.
- Attempts were used appropriately to adjust question difficulty and framing.
- Follow-ups referenced specific parts of David's answers rather than using generic prompts.
- Persona B maintained a natural hiring-manager tone.
- The interviewer correctly avoided skipped/failed curriculum days.
- Feedback accurately identified David's strongest and weakest areas.

### Observation

Persona B detected when David's answers were too abstract and asked for
concrete examples. However, when the second answer remained somewhat
abstract, the interviewer moved on after one additional push.

This is an observation rather than a confirmed defect. Further persona
comparison is needed before changing the prompt.

### Verdict

Persona B baseline test: **PASS**

No prompt changes made yet.

## Phase 3 — Test 1 (Live UI)

**Environment:** Local UI (`localhost:3000/interview`), backend running
post-fix `route.ts` (PERSONA_A/B text synced to `prompts/phase1-personas.md`,
`generateFeedback` now receives the real transcript).

**Persona:** C — routed automatically via job-role keyword match
("IT Support Specialist" hits the junior/support keyword list).

**Candidate:** Gerald Combs (CAND-010) — thin profile.
- 5 real eligible (passed, non-skipped) days
- 3 failed days (8, 10, 22)
- 2 skipped days (27, 28)

**Expected behavior:**
- Never reference the failed or skipped days
- Reach the 8-question minimum despite only 5 real eligible days, via
  genuine revisits rather than stopping early
- Final feedback grounded in what the candidate actually said, not
  generic or invented content

### Interview observations
- Completed at exactly 8 primary questions
- Zero references to Day 8, 10, 22 (failed) or Day 27, 28 (skipped)
- Revisited days were reported as genuinely different from the first
  pass, not repetitive
- Feedback strengths cited specific real content from the conversation
  (PCA, dimensionality/clustering, conversation memory vs. retrieval
  separation) — independently confirmed by the candidate-player as
  things they actually typed, not invented by the model

### Problems found
- None in this run.

### Root cause
- N/A

### Change required
- None. This run supports keeping the current fix as-is.

### After-change result
- N/A — no change made from this test.

### Open item (coverage gap, not a defect)
This run validates Persona C's thin-profile revisit handling and the
transcript-grounded feedback fix. It does **not** validate Persona A's
thin-profile fallback specifically — the original bug we found and fixed
was in Persona A's path, and Gerald's real `jobRole` routes to Persona C,
not A. No candidate in `candidates.json` is both thin-profile and
A-routed. Follow-up needed: either temporarily override `jobRole` for one
test call (as done in the earlier curl tests) to force Persona A, or
explicitly accept this as an untested path.

### Verdict
**PASS** — for Persona C thin-profile handling and feedback grounding.
Persona A thin-profile path and Persona B live-UI behavior remain
untested as of this entry.

---


