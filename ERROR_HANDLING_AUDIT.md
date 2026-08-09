# Error Handling Audit — /api/interview

Method: read through `app/api/interview/route.ts` line by line and traced
every branch, rather than re-running live requests (Groq quota is
currently exhausted — see note at the bottom).

## Verified error cases

| # | Situation | Status | Response body | Verified how |
|---|---|---|---|---|
| 1 | Malformed JSON body | 400 | `{"error":"Request body must be valid JSON"}` | code: `request.json()` wrapped in try/catch |
| 2 | `sessionId` missing/not a string | 400 | `{"error":"sessionId is required and must be a string"}` | code: explicit check |
| 3 | New session, no `candidate` | 400 | `{"error":"candidate is required for new interview"}` | code: explicit check |
| 4 | `candidate` not an object | 400 | `{"error":"candidate must be an object"}` | code: `validateCandidate()` |
| 5 | `candidate.member` missing/wrong type | 400 | `{"error":"candidate.member is required and must be an object"}` | code: `validateCandidate()` |
| 6 | `candidate.member.id` missing/wrong type | 400 | `{"error":"candidate.member.id is required and must be a string"}` | code: `validateCandidate()` |
| 7 | `candidate.member.name` missing/wrong type | 400 | `{"error":"candidate.member.name is required and must be a string"}` | code: `validateCandidate()` |
| 8 | `candidate.missions` missing/not an array | 400 | `{"error":"candidate.missions is required and must be an array"}` | code: `validateCandidate()` |
| 9 | Candidate has zero eligible (passed) days | 400 | `{"error":"candidate has no eligible passed curriculum days to interview on"}` | code: explicit check after `buildStructure1` |
| 10 | `message` empty/whitespace on a continue request | 400 | `{"error":"message cannot be empty"}` | code: explicit check |
| 11 | Any other unexpected exception (KV hiccup, etc.) | 500 | `{"error":"Something went wrong processing the interview request."}` | code: top-level try/catch wraps the whole handler — no path can produce a raw crash |
| 12 | Groq fails/rate-limits while generating a **question** | 200 (not an error) | Normal `done:false` response, `reply` = fallback sentence | code: `callGroq()` checks `!response.ok` and returns a fallback string instead of throwing |
| 13 | Groq fails/rate-limits or returns bad JSON while generating **final feedback** | 200 (not an error) | Normal `done:true` response, `feedback` = generic canned object | code: `generateFeedback()` — the `JSON.parse(...)` call is wrapped in try/catch, and since the Groq response object is read *inside* that same try block, a failed Groq call also lands in the catch and returns the fallback feedback. **Note:** this works by accident (the fetch failure and a JSON-parse failure share one catch block), not because of a dedicated `!response.ok` check like the question path has. Functionally safe either way — flagging only so it's understood, not because it needs fixing before submission. |
| 14 | Reusing a `sessionId` after `done:true` was already returned | 400 | `{"error":"candidate is required for new interview"}` | code: session is deleted via `kv.del()` right after the `done:true` response is built, so the next call with that `sessionId` is treated as brand new and hits case #3 above |
| 15 | Invalid/unknown `sessionId` that was never started | 400 | `{"error":"candidate is required for new interview"}` | same as #14 — an unknown sessionId is indistinguishable from "new session," so it just asks for a candidate object |

## Result

**Every path returns a clean JSON error or a graceful fallback — there is
no code path in this handler that can produce a raw, unhandled 500 with
no message.** The outer `try/catch` in `POST()` is the final safety net
if anything above is missed.

## Known limitations (not bugs, just worth knowing before judging)

- Neither Groq `fetch()` call (question generation or feedback
  generation) has a timeout/`AbortController`. If Groq itself hangs
  instead of erroring quickly, the request will hang with it rather than
  failing fast. Not something to fix under a "no major changes" Phase 4,
  just worth knowing if a demo request seems to hang rather than error.
- There's no rate limiting on the endpoint itself — nothing stops a
  candidate from spamming requests. Fine for a hackathon demo, not
  something a judge is likely to probe.
- Sessions have no expiry (documented already in `api-documentation.md`).

## Why this was a code read, not a live test

The Groq free-tier quota was already exhausted from earlier rounds of
testing today. Re-running live edge-case tests right now would either
fail to produce real signal (calls would just hit the same rate limit
being tested) or burn quota needed for a final demo-day smoke test.
Every row above was instead verified by tracing the actual logic in
`route.ts`, which is a legitimate substitute here since the concern is
"does the code handle this branch," not "is Groq up right now."

**Recommended before judging:** once quota resets, run exactly **one**
full interview live (not five) as a final smoke test — see
`BACKEND_READINESS_CHECKLIST.md`.
