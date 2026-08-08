# Integration Guide — Personas A, B & C

## Persona A Integration
Persona A is integrated through the same general Claude/API flow, but it is intentionally different from Personas B and C.

Persona A is the **audit-style, systems-focused interviewer**. Its primary purpose is to extract deep technical and architectural signal by understanding how the candidate's components, decisions, dependencies, and failure modes connect.

### Persona A Responsibilities

Persona A should maintain its own interview identity:

* Technical and systems-focused
* Architecture-oriented
* Analytical and structured
* Focused on how components connect and depend on each other
* Strong at exposing failure propagation and architectural trade-offs
* Conversational enough to avoid sounding like a checklist

Persona A should not be changed to behave like Persona B's hiring-manager style or Persona C's casual peer style.

### Curriculum Selection

Persona A should prioritize relevant eligible passed curriculum content.

For candidates with strong SHIP_IT coverage, Persona A should use those areas when they provide useful technical or systems-level signal.

Dependency tracing should remain restricted to the candidate's eligible curriculum pool. Persona A must not invent dependencies or ask about unavailable, skipped, or failed curriculum days.

### Question Breadth

For rich candidate profiles with many eligible passed days, Persona A should favor breadth when another curriculum area can provide genuinely new signal.

It should not continue digging into one day after the existing follow-up has already produced sufficient evidence if another relevant passed day would add meaningful signal.

The goal is not to add questions merely to increase the count.

### Thin Profiles

When a candidate has fewer than 8 eligible passed days, Persona A may revisit previously covered eligible days after the available days have been used.

A revisit must:

* Approach the topic from a genuinely different angle.
* Be grounded in something the candidate previously said.
* Produce potentially new diagnostic signal.
* Not repeat or lightly rephrase the earlier question.
* Transition naturally rather than announcing the procedural revisit.

Failed and skipped days remain completely off-limits.

### Follow-Up Behavior

Persona A should generate grounded follow-ups based on the candidate's actual answer.

Follow-ups should primarily investigate systems-level reasoning through:

* **Trace a dependency** — what earlier component, decision, or concept the answer relied on.
* **Explore a consequence** — what would happen downstream if the approach changed or failed.
* **Examine a trade-off** — why the candidate chose the approach over a plausible alternative.
* **Probe a failure/scaling scenario** — what would break under bad input, edge cases, increased scale, concurrency, or other realistic stress.

Generic verification questions such as "Did you test that?" or "Did you measure that?" should be avoided unless testing or measurement is specifically relevant.

If the candidate's answer already provides sufficient signal, Persona A may move on rather than forcing unnecessary additional depth.

### Attempts-Based Calibration

Persona A should use the candidate's `attempts` information to calibrate difficulty.

Higher-attempt topics should generally receive more accessible, practical questioning rather than assuming deep mastery.

Lower-attempt topics can support deeper technical, architectural, dependency, trade-off, or failure-mode exploration when the candidate's answer provides enough evidence to justify it.

### Failed/Skipped-Day Protection

Persona A must never directly ask about curriculum days that the candidate failed or skipped.

Only eligible passed curriculum content should be used for interview questions.

### Feedback

Persona A's feedback should be evidence-based and should reflect the systems-level signal demonstrated during the interview.

Feedback should distinguish between:

* Technical capabilities actually demonstrated.
* Gaps or uncertainties identified from the candidate's answers.
* Areas that remained unverified because the candidate's eligible curriculum pool was limited.

A lack of evidence should not automatically be treated as evidence of weakness, particularly for thin candidate profiles.

### Persona A Completion

The application should use the same confirmed completion mechanism:

```json
{
  "done": true
}
```

When `done: true` is returned, the application should stop requesting additional interview turns and proceed to final feedback handling.

### Persona A Validation Status

Persona A v5 has completed its validation cycle.

The final validation covered:

* Rich-profile breadth
* Thin-profile handling
* SHIP_IT prioritization
* Dependency tracing
* Attempts-based calibration
* Typed follow-ups
* Failed/skipped-day protection
* Natural transitions
* No unnecessary repetition
* Evidence-based structured feedback

The rich-profile validation reached 10 primary questions across 9 distinct curriculum days with 10/10 grounded typed follow-ups and zero generic verification questions.

The thin-profile validation reached 8 primary questions from only 5 eligible days by using genuinely different, grounded revisits, while producing 8/8 grounded follow-ups and zero failed/skipped-day violations.

**Persona A v5 status: FINAL.**

No further Persona A prompt changes are required based on the completed validation.

## Persona B

## Purpose

This document explains how Person 1 should use the refined interview prompt created and tested by Person 2.

The goal is to keep the prompt logic separate from the application/API implementation while providing Person 1 with the information needed to integrate the prompt into the interview flow.

---

## 1. What Person 1 Provides to Claude

The interview process starts with a **phase-specific prompt**.

Person 1 provides:

* The system/interview prompt for the current phase.
* Any candidate, curriculum, or other project data requested by that phase's prompt.
* Relevant files or text needed for Claude to perform the requested step.

The required data should be provided according to what the current phase prompt requests rather than assuming that every phase requires the same data.

### Typical relevant inputs

Depending on the phase/task, this may include:

* Candidate profile/data
* Curriculum data
* Conversation history
* Previously asked questions
* Other files or text required by the prompt

---

## 2. What Claude Provides

Claude is expected to perform the requested phase step-by-step using the provided prompt and supporting data.

For the interview flow, the response may contain:

* The next interview question
* A grounded follow-up question when appropriate
* Interview progression information
* Final structured feedback when the interview is complete

The application should use the response produced by the model according to the current prompt's specified output format.

---

## 3. Interview Completion

The interview is considered complete when Claude returns:

```json
{
  "done": true
}
```

Person 1's application can use the `done` field to determine when to stop requesting additional interview turns and move to the final feedback/display stage.

---

## 4. Prompt Responsibilities

The refined Persona B prompt is responsible for the interview behavior, including:

* Selecting appropriate eligible curriculum topics.
* Considering the candidate's job role.
* Using attempts to calibrate questioning.
* Avoiding skipped/failed curriculum days.
* Asking grounded follow-ups.
* Handling vague answers with bounded escalation.
* Maintaining a conversational recruiter style.
* Producing hiring-oriented feedback.

The application/API layer should provide the data and conversation context required by the prompt rather than duplicating these behavioral rules in application code.

---

## 5. Important Persona B Behavior

### Candidate-specific questioning

Questions should be based on the candidate's available curriculum history and profile rather than using the same fixed questions for every candidate.

### Attempts-based calibration

The `attempts` information should be available to the prompt so that question framing can be calibrated appropriately.

### Passed/skipped/failed days

Persona B should only question the candidate about eligible curriculum content and must not directly ask about skipped or failed days.

### Grounded follow-ups

Follow-ups should build from what the candidate actually said rather than using generic verification questions.

### Vague-answer escalation

If the candidate remains vague after the first follow-up:

1. Make one additional attempt using a genuinely different approach.
2. The second attempt may narrow the requested detail, rephrase the question, or provide a concrete anchor.
3. If the candidate remains vague, explicitly identify the evidence gap.
4. Record the gap for final feedback.
5. Move to the next topic.
6. Do not push a third time.

This behavior was specifically retested with David Miller and passed.

---

## 6. Final Feedback

When the interview is complete, the feedback should reflect the actual interview evidence.

Feedback should:

* Identify concrete strengths.
* Identify evidence-based gaps.
* Frame gaps as areas where the candidate would need ramp-up time.
* Avoid inventing weaknesses that were not demonstrated during the interview.
* Reflect the candidate's actual responses and follow-up performance.

---

## 7. API / Platform

The current integration uses:

* **API provider:** Groq
* **Deployment:** Vercel

The exact model name and request/response schema are determined by the current implementation and are not specified in this guide because they were not provided as part of the confirmed integration contract.

---

## 8. Files and Data

Person 1 should provide Claude with the files or text required by the current phase prompt.

Relevant project data may include:

* Candidate data
* Curriculum data
* Interview/conversation context
* Prompt documentation

The prompt should determine which supporting data is required for the current task.

---

## 9. Testing Evidence

Persona B has been tested through multiple mock candidate interviews.

Testing has covered:

* Candidate/job-role adaptation
* Attempts-based calibration
* Skipped/failed-day protection
* Grounded follow-ups
* Final-question follow-up handling
* Interview breadth requirements
* Structured feedback
* Vague-answer escalation

The latest targeted vague-answer escalation fix was tested independently and passed.

### Vague-answer retest result

Two independent cases were tested:

* Day 20 — Conversation Memory
* Day 23 — MCP

In both cases, Persona B:

**first follow-up → different second approach → continued vagueness → explicit evidence gap → move on**

No third push occurred.

**Result: PASS**

---

## 10. Person 1 Handoff Checklist

Before integrating the final prompt, confirm:

* [ ] Current refined Persona B prompt is being used.
* [ ] Required candidate/curriculum data is available to Claude.
* [ ] Conversation context is passed as required by the prompt.
* [ ] Claude's `done: true` response can be detected.
* [ ] Final feedback can be passed/displayed by the application.
* [ ] Groq API integration is working.
* [ ] Vercel deployment can make the required API calls.
* [ ] No application logic overrides the prompt's candidate-selection or follow-up rules without a deliberate reason.

---

## 11. Current Status

**Persona B prompt refinement:** Complete

**Persona B behavioral testing:** Passed

**Vague-answer escalation fix:** Validated

**Integration guide:** Created for Person 1 handoff

**API provider:** Groq

**Deployment:** Vercel

## 12. Example Input

A phase request should provide Claude with the relevant prompt and the supporting data required for that phase.

Conceptually, the input includes:

```text
Phase prompt:
[The current phase-specific instructions]

Supporting data:
[Candidate data, curriculum data, conversation context,
or other files/text requested by the phase prompt]
```

For an interview turn, the supporting context may include the candidate profile, eligible curriculum information, and previous conversation messages.

The exact data included should follow the requirements of the current phase prompt.

---

## 13. Example Output

During an active interview, Claude returns the next interview response according to the output format specified by the current prompt.

When the interview is complete, Claude indicates completion using:

```json
{
  "done": true
}
```

The application should use this signal to stop the interview loop and process/display the final feedback returned by Claude.

A completed response may therefore contain:

```json
{
  "done": true,
  "feedback": {
    "summary": "Hiring-oriented summary based on the interview evidence.",
    "strengths": [
      "Evidence-based strength from the candidate's responses."
    ],
    "gaps": [
      "Evidence-based area where the candidate would need ramp-up."
    ],
    "next": [
      "Relevant development or follow-up recommendation."
    ]
  }
}
```

The exact feedback fields should follow the final Persona B prompt and the application's current parsing implementation.

---

## 14. Integration Edge Cases

### Candidate has failed or skipped curriculum days

Persona B must not ask questions about failed or skipped days.

Only eligible passed curriculum content should be used.

### Candidate has few eligible curriculum days

If the candidate has a thin profile, Persona B may revisit eligible material rather than inventing new curriculum content or using failed/skipped days.

### Candidate gives a vague answer

Persona B should:

1. Ask one grounded follow-up.
2. If the answer remains vague, use one differently angled second attempt.
3. If the answer remains vague again, explicitly identify the evidence gap.
4. Record the gap for final feedback.
5. Move on.
6. Never push a third time.

### Candidate gives an exhaustive answer

If another follow-up would be redundant, Persona B should explicitly acknowledge that and move on rather than silently skipping the follow-up.

### Final interview question

The final primary question follows the same follow-up decision rule as every other question. If no follow-up is necessary, Persona B should explicitly acknowledge that before closing the interview.

### Interview completion

When Claude returns:

```json
{
  "done": true
}
```

the application should stop requesting additional interview turns and proceed to the final feedback stage.

### API/model details change

The integration guide documents the confirmed platform-level setup but does not hard-code an unconfirmed model name or request schema. If the Groq model or application request format changes, Person 1 should update the implementation-specific details without changing the Persona B behavioral rules unless the prompt itself is intentionally revised.

## Persona C Integration

Persona C is integrated through the same general Claude/API flow, but its interview behavior is intentionally different from Persona B.

The application should provide Persona C with the same types of supporting candidate, curriculum, and conversation data required by the current phase prompt.

### Persona C Responsibilities

Persona C should maintain its own interview identity:

* Casual and peer-like
* Curious rather than formal
* Candidate-led
* Story-first
* Flexible in follow-up chaining
* Natural when revisiting previously discussed topics

Persona C should **not** be made to behave like Persona A or Persona B simply because the same application flow is being used.

### Follow-Up Behavior

Persona C does not use a rigid one-follow-up-per-primary-question structure.

Follow-ups should emerge naturally from the candidate's answer and may continue as a conversational thread when the answer creates useful diagnostic signal.

Useful follow-up directions include:

* Dependency — what another component or decision relied on
* Consequence — what happens if something changes or fails
* Trade-off — why one approach was chosen over another
* Failure/scaling — what could break under realistic stress

Generic filler such as "Did you test that?" or "Can you tell me more?" should be avoided unless specifically relevant.

### Candidate Context

Persona C should use the candidate's background to create continuity between otherwise separate curriculum topics.

For example, a candidate's previous work experience can be connected to later questions when the connection is meaningful.

### Attempts-Based Calibration

The candidate's `attempts` information should influence the level and framing of questions.

For higher-attempt topics, Persona C should favor practical understanding and simple explanation rather than assuming deep mastery.

The purpose is to determine what the candidate understands now, not to penalize them for having struggled during the cohort.

### Failed/Skipped-Day Protection

Persona C must not directly ask about curriculum days that the candidate failed or skipped.

Those days may inform the available candidate profile internally, but interview questions should use eligible passed material.

### Thin Profiles

When a candidate has few usable passed days, Persona C should still aim for the required interview breadth through useful depth and natural exploration.

Revisiting an eligible day is acceptable when it produces genuinely different diagnostic signal.

Persona C should not pad the interview with irrelevant topics or unavailable curriculum days.

### Persona C Completion and Feedback

The application should use the same confirmed completion mechanism:

```json
{
  "done": true
}
```

Final feedback should remain informal and concrete while being grounded in the candidate's actual answers.

The expected feedback structure remains:

```json
{
  "done": true,
  "feedback": {
    "summary": "...",
    "strengths": [],
    "gaps": [],
    "next": []
  }
}
```

### Persona C Validation Status

Persona C v2 has been validated with two complementary candidate profiles:

* **Emily Chen:** rich, low-attempt profile — validated diagnostic follow-ups, story-first selection, and rich-profile breadth.
* **Gerald Combs:** thin, high-attempt profile with failed/skipped days — validated attempts calibration, failed/skipped guardrails, thin-profile handling, and Persona C identity.

Validation results:

* Follow-up diagnostic quality: **PASS**
* Rich-profile breadth: **PASS**
* Attempts calibration: **PASS**
* Failed/skipped guardrail: **PASS**
* Thin-profile handling: **PASS**
* Persona C identity: **PASS**
* Flexible chaining: **PASS**
* Structured feedback: **PASS**
* Naturalness: **PASS**

**Persona C v2 status: FINAL.**

No Persona C v3 change is required based on the completed validation.


