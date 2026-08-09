# CommitCrew — AI Interview Agent

**ABTalks Hackathon Submission**

An AI-powered technical interview agent that conducts realistic, adaptive
mock interviews for graduates of a 31-day AI engineering cohort — based on
what each candidate actually completed, not a generic quiz.

🔗 **Live:** https://commit-crew-phi.vercel.app/interview

---

## What it does

The agent interviews a candidate about a healthcare RAG chatbot they built
during a 31-day curriculum, using their real progress data (which days they
passed, failed, skipped, and how many attempts each took) to:

- Ask questions **only** about topics they actually completed
- Calibrate difficulty to their attempt history
- Ask grounded, specific follow-ups based on what they just said — never
  generic "did you test that?" filler
- Adapt to thin profiles (few completed days) by revisiting topics from new
  angles, and to rich profiles by asking more questions across more days
- End with structured feedback: a summary, strengths, gaps, and next steps —
  all grounded in the actual conversation, not invented

## The three interviewer personas

The system routes each candidate to one of three distinct interviewer
personalities based on their job role:

| Persona | Style | Best for |
|---|---|---|
| **A — The Systems Thinker** | Direct, dependency-chasing, traces how components connect | Architecture/systems-heavy roles |
| **B — The Practical Recruiter** | Warm, job-relevance-focused, frames everything around real-world application | Default / standard hiring roles |
| **C — The Curious Peer** | Casual, exploratory, lets the candidate's answers steer the conversation | Junior/non-traditional candidates |

All three share the same guardrails (never ask about skipped/failed
content, 8–12 questions across 4+ modules, grounded follow-ups) but differ
deliberately in tone and strategy. Full design rationale and iteration
history are in [`PROMPTS.md`](./PROMPTS.md) and
[`PROMPT_TESTING.md`](./PROMPT_TESTING.md).

## Tech stack

- **Frontend:** Next.js (App Router)
- **LLM:** Groq (`llama-3.3-70b-versatile`)
- **Session storage:** Vercel KV (Upstash Redis) — persists across restarts
- **Deployment:** Vercel

## API

One endpoint handles the full interview lifecycle via `sessionId`:

```
POST /api/interview
```

Full request/response contract, error handling, and session behavior are
documented in [`api-documentation.md`](./api-documentation.md).

## Running locally

```bash
npm install
npm run dev
```

Requires a `.env.local` with a Groq API key and Vercel KV credentials.

## Project documentation

| File | What's in it |
|---|---|
| [`PROMPTS.md`](./PROMPTS.md) | Persona design, curriculum analysis, prompt engineering strategy |
| [`PROMPT_TESTING.md`](./PROMPT_TESTING.md) | Full iteration history — every bug found, fix made, and retest result |
| [`api-documentation.md`](./api-documentation.md) | API contract for integrators |
| [`ERROR_HANDLING_AUDIT.md`](./ERROR_HANDLING_AUDIT.md) | Every error branch traced to code |
| [`BACKEND_READINESS_CHECKLIST.md`](./BACKEND_READINESS_CHECKLIST.md) | Pre-submission verification checklist |
| [`QUALITY_ASSESSMENT_REPORT.md`](./QUALITY_ASSESSMENT_REPORT.md) | Final interview quality sign-off, evidence-based |

## A note on testing

Groq's free tier enforces a tokens-per-minute limit. If a demo response is
slow or briefly falls back to a generic reply, that's this limit — not a
bug — documented in `api-documentation.md`. Waiting a short moment and
retrying resolves it.

## Team

- **Person 1**(Ananya Singla)[@ananyasingla529-bit] — Backend, API, deployment
- **Person 2**(Charu Malhotra)[@charu-blabla] — Interview strategy, prompt engineering, persona design and validation
- **Person 3**(Bhakti Gupta)[@bhaktigupta51-ai] — Frontend/UI, candidate data integration
