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
