# Integration Guide — Persona B (Person 2)

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

