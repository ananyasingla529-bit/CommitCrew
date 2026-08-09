# API Documentation — AI Interview Agent

For Person 3 (UI integration). This documents the real, live, tested
endpoint — not a planned/future contract.

---

## 1. Endpoint Overview

There is **one** endpoint. It handles starting, continuing, and ending an
interview, all through the same URL, using `sessionId` to track state.

```
POST /api/interview
```

- **Local:** `http://localhost:3000/api/interview`
- **Live:** `https://commit-crew-phi.vercel.app/api/interview`

No authentication required. Content-Type must be `application/json`.

---

## 2. Starting an Interview

Send this the **first** time for a given `sessionId`. You (the UI) generate
the `sessionId` — the server doesn't create one for you.

### Request

```json
{
  "sessionId": "any-unique-string-you-generate",
  "candidate": {
    "member": {
      "id": "CAND-001",
      "name": "Sarah Johnson",
      "jobRole": "Senior Data Engineer",
      "yearsExperience": 6,
      "education": "MS Computer Science"
    },
    "missions": [
      { "day": 7, "passed": true, "attempts": 1 },
      { "day": 8, "passed": true, "attempts": 3 }
    ]
  }
}
```

`candidate` follows the same shape as an entry in `public/candidates.json`
(the `member` + `missions` object). Pass the real candidate object as-is.

### Response

```json
{
  "reply": "Welcome. Let's begin your interview.",
  "done": false,
  "progress": { "questionsAsked": 0, "percentComplete": 0 }
}
```

---

## 3. Continuing an Interview

Send this for every turn **after** the first, using the **same**
`sessionId`. Do not resend `candidate` — it's only read on the first
request.

### Request

```json
{
  "sessionId": "same-session-id-as-before",
  "message": "The candidate's answer to the previous question."
}
```

`message` must be a non-empty string. An empty or whitespace-only message
is rejected (see Error Handling below).

### Response (interview continuing)

```json
{
  "reply": "The next question the AI is asking.",
  "done": false,
  "progress": { "questionsAsked": 5, "percentComplete": 63 }
}
```

### Response (interview finished)

Once enough questions have been asked across enough distinct curriculum
days, the next call returns final feedback instead of a new question:

```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "1-2 sentence summary of the candidate's performance.",
    "strengths": ["string", "string", "string"],
    "gaps": ["string", "string"],
    "next": ["string", "string"]
  },
  "progress": { "questionsAsked": 8, "percentComplete": 100 }
}
```

**Once `done: true` is returned, stop calling the endpoint for that
`sessionId`.** The server deletes that session's data immediately after
sending this response — sending another request with the same
`sessionId` afterward will be treated as starting a brand-new interview
(and will fail, since no `candidate` was sent).

---

## 4. The `progress` Field

Included in every successful response. Safe to use for a progress bar
from the very first response onward — the total is fixed once the
interview starts and never changes mid-interview.

```json
"progress": {
  "questionsAsked": 5,
  "percentComplete": 63
}
```

- `questionsAsked` — how many primary questions have been asked so far.
- `percentComplete` — `questionsAsked / totalQuestions`, rounded, 0-100.

The actual total question count varies per interview (typically 8-12)
depending on the candidate's profile and which interviewer persona was
selected — you don't need to know the exact total, just read
`percentComplete` directly.

---

## 5. Error Handling

All errors return a JSON body with an `error` field and an appropriate
HTTP status code (never a raw crash/500 with no message, except for
truly unexpected failures — see below).

| Situation | Status | Response |
|---|---|---|
| `sessionId` missing or not a string | 400 | `{"error":"sessionId is required and must be a string"}` |
| Starting a session with no `candidate` | 400 | `{"error":"candidate is required for new interview"}` |
| `candidate.member` missing/malformed | 400 | `{"error":"candidate.member is required and must be an object"}` |
| `candidate.missions` missing/not an array | 400 | `{"error":"candidate.missions is required and must be an array"}` |
| Candidate has zero eligible (passed) days | 400 | `{"error":"candidate has no eligible passed curriculum days to interview on"}` |
| `message` is empty/whitespace on a continue request | 400 | `{"error":"message cannot be empty"}` |
| Request body is not valid JSON | 400 | `{"error":"Request body must be valid JSON"}` |
| Anything else unexpected | 500 | `{"error":"Something went wrong processing the interview request."}` |

**Recommendation for the UI:** show the `error` message directly to the
user (or a friendly variant of it) when the response status is 400/500,
and don't advance the conversation UI when an error is returned.

---

## 6. Session Behavior

- Sessions are stored in a persistent database (Vercel KV / Upstash
  Redis), not in server memory — they survive server restarts, so a
  session started now will still work correctly even if there's a delay
  before the next message.
- Sessions are **deleted** the moment the interview completes
  (`done: true`). Don't reuse a `sessionId` after that.
- There is no explicit session expiry/timeout configured. If an
  interview is abandoned mid-way (candidate never sends another
  message), the session just sits there indefinitely — not a problem for
  a hackathon demo, but worth knowing.

---

## 7. Example Interview Flow

```
1. UI generates sessionId (e.g. a UUID) and loads a candidate.
2. POST /api/interview  { sessionId, candidate }
   → { reply: "Welcome...", done: false, progress: {0, 0%} }
   Show the welcome message. Wait for the candidate's first answer.

3. POST /api/interview  { sessionId, message: "<candidate's answer>" }
   → { reply: "<next question>", done: false, progress: {1, ~13%} }
   Show the question. Wait for the next answer.

4. Repeat step 3 for every subsequent answer.

5. Eventually, a response comes back with done: true and a feedback
   object instead of a new question. Show the feedback screen. Stop
   calling the endpoint for this sessionId.
```

---

## 8. Performance Notes

- Each request that generates a question or feedback calls the Groq API
  (llama-3.3-70b-versatile) — typical response time is **a few seconds**,
  not instant. Show a loading/typing indicator between sending an answer
  and receiving the next question.
- **Rate limits:** Groq's free tier enforces a tokens-per-minute limit.
  Heavy, rapid-fire testing (many full interviews back-to-back) can
  trigger it. When it happens, the endpoint does NOT crash — it returns
  a normal `done: false` response with a graceful fallback reply
  ("Sorry, I had trouble generating a question...") instead of the real
  next question. The UI doesn't need special handling for this; it's
  just a slightly awkward reply, not an error. Avoid demo-day rehearsals
  running many full interviews in quick succession right before
  presenting.
