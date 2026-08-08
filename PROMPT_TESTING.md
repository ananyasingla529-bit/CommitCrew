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


