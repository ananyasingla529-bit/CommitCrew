# PROMPTS.md — AI Interview Agent (Team CommitCrew)

This document records how Claude was used as a technical co-founder across
Phase 1 and Phase 2 of building the AI Interview Agent backend, including
real production issues found and fixed through live testing.

---

## Phase 1 — Infrastructure

**Goal:** working Next.js project, deployed, with two placeholder API
endpoints, mock data, and a live URL.

Person 1 (no prior backend experience) worked step-by-step with Claude
acting as a patient teacher — every command explained before running it,
every error diagnosed from actual terminal output rather than assumed.

Key decisions made during Phase 1:
- Switched from Claude API to **Groq** (free tier) after confirming the
  team's Anthropic account had zero available credits and the hackathon
  had a strict no-budget constraint.
- After receiving `technical-spec.md`, rebuilt the initial two-endpoint
  design (`/api/interview/init`, `/api/interview/chat`) into a single
  spec-compliant `POST /api/interview` endpoint using a `sessionId` to
  track start/continue/end state, matching the actual grading contract
  instead of an earlier internal draft spec.
- Diagnosed and fixed real deployment issues along the way: a Windows
  PowerShell execution-policy block, an IPv6/DNS timeout preventing Node
  from reaching Groq's API, and a Vercel project that had silently
  connected to the wrong GitHub repository (auto-created during initial
  import instead of the team's actual repo) — found by comparing commit
  history between the two repos and reconnecting Vercel to the correct one.

## Phase 2 — Intelligence

**Goal:** integrate Person 2's three finalized interviewer personas and
Person 3's four data structures into the working endpoint.

### Persona routing
Implemented automatic persona selection (A/B/C) based on candidate job
role, per Person 2's own recommendation in her persona comparison
document, rather than hardcoding a single persona.

### Bug found: question/day mismatch
The initial integration selected which curriculum day to "label" a
question with *after* asking Groq for the question — meaning the AI
generated a question with no grounding in a specific day, and the code
guessed the topic label afterward via round-robin. Fixed by reordering:
select the day first, tell the AI explicitly which day/topic to focus on,
then generate the question. Verified against real candidate data
(Gerald Combs, CAND-010) that resulting questions were correctly grounded.

### Bug found: rich-profile question count ignored persona preference
The completion rule was a hardcoded "8 questions minimum" regardless of
persona or candidate richness, even though Person 2's persona docs
described Persona A/C targeting 10-12 questions for rich profiles and
Persona B targeting 8-10. Fixed with `getTargetQuestionCount()`, which
computes the target from candidate profile richness (8+ eligible days)
and persona. Verified live: Emily Chen (CAND-003, rich profile) correctly
extended from 8 to 10 questions once routed to Persona B.

### Bug found (production): session persistence
Live testing with Noah Kim (CAND-015, Principal Architect / Persona A)
revealed that a mid-interview request failed with
`"candidate is required for new interview"` — the server had "forgotten"
an in-progress session. Root cause: sessions were stored in a plain
in-memory `Map`, which does not survive Vercel spinning up a fresh
serverless instance mid-conversation. Fixed by provisioning a free
Upstash Redis database via Vercel's Storage tab and replacing all
`Map` reads/writes/deletes with `@vercel/kv` calls. Verified live: the
same Noah Kim interview ran to full completion (12 questions) afterward
with no session loss.

### Bug found (production): hallucinated curriculum days
The same Noah Kim run also surfaced the AI referencing curriculum days
that don't exist (e.g. "Day 14: Language Model Training", "Day 20:
Building the QA Pipeline") once the interview needed to revisit topics
late in a long, rich-profile interview. Root cause: the per-turn prompt
only ever told the AI about the single day it should focus on that turn
— when Persona A's strategy called for tracing a dependency to "an
earlier day," the AI had no real data to draw from and invented a
plausible-sounding but fake one. Fixed by including the candidate's full
real list of eligible days and titles in every turn's system prompt, with
an explicit instruction never to reference a day outside that list.
Verified live with a fresh 12-question Noah Kim run: zero invented days.

### Refinements from teammate's integration guide
After Person 2/3 published `INTEGRATION_GUIDE.md`, added two documented-
but-missing behaviors directly into the persona prompt text:
- **Persona B vague-answer escalation**: one follow-up, one differently-
  angled second attempt if still vague, then explicitly naming the
  evidence gap and moving on — never a third push. (Teammate-tested
  against a candidate named David Miller.)
- **Persona A revisit-quality rule**: when a thin profile forces revisiting
  a previously-covered day, the revisit must take a genuinely different
  angle, be grounded in something the candidate actually said, and
  transition naturally rather than announcing the revisit.

### Attempts-based difficulty calibration (Person 3)
All three personas' written strategies describe calibrating question
difficulty using the candidate's per-day `attempts` count, but the initial
integration never actually passed that data to the AI — only day title,
objectives, and tools. Person 3 extended `Structure1.dayDetails` to carry
`attempts` per day (sourced from each mission entry, since curriculum.json
itself has no attempts field) and updated the per-turn prompt to state the
attempt count explicitly. Verified live with Gerald Combs (CAND-010,
Persona C): low-attempt days (Day 1, 2 attempts) got straightforward
questions; high-attempt days (Day 7/12, 5 attempts) were framed more
casually around what caused difficulty, matching the persona's calibration
rule. Also re-verified Persona A's dependency-tracing and day-grounding
fixes hold on a second, independent candidate (Alex Turner, CAND-002,
Backend Software Engineer) — 10 questions, all referencing real days with
correct titles, zero hallucinated content.

### Hardening against malformed input
The endpoint had no defense against malformed requests — a missing
`candidate.member`, a non-array `candidate.missions`, or invalid JSON in
the request body would all crash with an unhandled 500 error rather than
a clear message. Added three layers: JSON parse errors return a clean 400,
a `validateCandidate()` check catches shape/type problems before they
reach any downstream logic, and a top-level try/catch around the whole
handler catches anything unexpected and returns a clean 500 instead of
crashing raw. Verified with deliberately broken input (missing candidate
fields, invalid JSON) — both return clear, specific error messages.

### Known, accepted limitation
Groq's free tier enforces a tokens-per-minute rate limit. Heavy back-to-
back test-interview sessions can trigger it (confirmed via Groq's own
usage dashboard — total spend was $0.08, ruling out a cost/budget issue;
the dashboard's rate-limit graph showed repeated spikes above the line).
The endpoint already degrades gracefully (a friendly fallback message,
no crash) rather than failing hard. Documented as a pacing consideration
for live demos rather than a code defect.

---

## Team data structures referenced

Person 3's four Phase 1 data structures (Candidate, Conversation History,
Question Tracker, Feedback) and Person 2's three finalized personas
(A — Systems Thinker, B — Practical Recruiter, C — Curious Peer) were used
as the source of truth for what the live endpoint implements. Person 3's
later modular refactor (`types.ts`, `curriculum.ts`, `candidates.ts`,
`interview-state.ts`, `question-selector.ts`, `feedback.ts`) is included
in `/lib/interview-structures/` as reference material; it was not wired
into the live route in this session, since it would have reintroduced the
same two production bugs (in-memory session storage, non-static file
reads inside serverless functions) that were just fixed and verified live.

## Phase 3 — Final Summary (Submission-Ready)

### Status: READY FOR SUBMISSION

All three interviewer personas were iteratively tested and refined against
mock candidates, with confirmed fixes verified both in simulated testing and
live against the deployed endpoint / local UI.

---

### Persona A — "The Systems Thinker" (v5, final)

- Fixed: rich-profile question count (was stopping at 8, now correctly
  extends to 10-12 when candidate has 8+ eligible days)
- Fixed: generic follow-up phrasing, replaced with four required follow-up
  types (dependency / consequence / trade-off / failure-scaling)
- Fixed: thin-profile handling — candidates with fewer than 8 eligible days
  now get genuine revisits from new angles instead of the interview ending
  early or repeating questions
- Verified against Emily Chen (rich, 10 eligible days) and Gerald Combs
  (thin, 5 eligible days) in simulated testing

### Persona B — "The Practical Recruiter" (v3, final)

- Fixed: job-role prioritization fallback for broadly-relevant roles
- Fixed: generic verification follow-ups ("did you test that?"), replaced
  with the same four typed follow-up categories as Persona A
- Fixed: silent follow-up skips, including on the final question
- Fixed: vague-answer escalation — one follow-up, one differently-angled
  second attempt, then explicit gap-naming and move on (never a third push)
- Verified against David Miller (Business Analyst) with deliberately vague
  answers to confirm the escalation sequence behaves consistently

### Persona C — "The Curious Peer" (baseline, documented gaps not yet
patched — lower priority given time constraints, no blocking defect found)

- Baseline tested against Emily Chen; free-chaining follow-up style and
  story-first day selection both work as designed
- Known, non-blocking gap: doesn't yet have the typed-follow-up or
  rich-profile breadth fixes applied to A/B — flagged for future iteration,
  not required for submission since no failure was observed in testing

---

### Live integration testing (Phase 3)

**Bug found and fixed (pre-submission):** the live `route.ts` had drifted
from the validated persona prompts — PERSONA_A was missing the thin-profile
fallback instructions, PERSONA_B was missing the final-question follow-up
clause, and `generateFeedback()` was only given topic labels, not the actual
interview transcript, risking ungrounded/generic feedback. All three fixed
directly in `route.ts` and confirmed deployed (commit `0c605f3`).

**Live UI test — Gerald Combs (thin profile, Persona C via job-role
routing):**
- 8 questions reached despite only 5 real eligible days, via genuine
  revisits (confirmed by candidate-player as not repetitive)
- Zero references to failed (Day 8, 10, 22) or skipped (Day 27, 28) days
- Final feedback confirmed grounded in real transcript content (specific
  technical details the candidate actually typed, not invented)
- **PASS**

**Live UI test — Emily Chen (rich profile, Persona B via job-role
routing):**
- Correct persona framing confirmed ("that's exactly what we're looking
  for in this role" — job-relevance framing, not dependency-chasing)
- Confirms persona routing logic is working correctly
- Full completion not observed due to Groq free-tier rate limiting
  (known, documented, non-blocking environment constraint — see below)
- Partial result supports correct behavior; not treated as a failure

---

### Known, accepted limitation

Groq's free-tier tokens-per-minute rate limit was hit twice during back-to-
back live testing. This is a pre-existing, documented limitation (see
`PROMPTS.md` "Known, accepted limitation" section) — the endpoint degrades
gracefully with a friendly fallback message rather than crashing. Not a
code defect. Recommendation: pace any live demo interviews with gaps
between them rather than running several back-to-back.

---

### Outstanding items (not blocking submission)

1. Persona A's thin-profile fallback has not been tested through the live
   UI specifically (only in simulation) — no real candidate in
   `candidates.json` is both thin-profile and routes to Persona A.
2. Persona C has not received the same typed-follow-up and rich-profile
   breadth fixes applied to A and B — no defect found, but not yet
   symmetric with the other two personas.
3. Emily Chen's live-UI rich-profile question-count extension (8→10) was
   not observed to full completion due to rate limiting; code logic was
   independently verified correct via direct code review.

### Recommendation

Submit as-is. All mandatory requirements (8+ questions, 4+ modules,
follow-ups, context maintenance, structured feedback, fairness guardrails)
are confirmed working in both simulation and live testing. The three
outstanding items are refinements, not defects, and none were observed to
cause incorrect or unfair behavior in any test run.
