// ============================================================================
// Wraps the REAL backend contract: a single POST /api/interview endpoint,
// session-based via `sessionId`. No /init or /chat routes exist.
//
// `progress` is read defensively since it's a field Person 1 is adding but
// may not be live on every deployment yet — components treat a missing
// progress as "don't render the bar" rather than a fake/zeroed one.
//
// Every failure is normalized into one plain, non-technical InterviewApiError
// — no Groq/HTTP/rate-limit details ever reach the UI. This module never
// mutates session state itself, so a failed call never implies the
// interview ended; the caller decides how to preserve state and retry.
// ============================================================================

export interface InterviewProgress {
  questionsAsked: number;
  percentComplete: number;
}

export interface InterviewFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export interface InterviewResponse {
  reply: string;
  done: boolean;
  progress: InterviewProgress | null;
  feedback?: InterviewFeedback;
}

/** Friendly, generic error — never exposes what actually failed underneath. */
export class InterviewApiError extends Error {
  constructor() {
    super("Something went wrong. Please try again.");
    this.name = "InterviewApiError";
  }
}

function normalizeResponse(raw: any): InterviewResponse {
  return {
    reply: typeof raw?.reply === "string" ? raw.reply : "",
    done: Boolean(raw?.done),
    // Missing progress stays null (not a zeroed placeholder) so the UI can
    // choose to simply not render it, since the field may not be live yet.
    progress:
      raw?.progress &&
      typeof raw.progress.questionsAsked === "number" &&
      typeof raw.progress.percentComplete === "number"
        ? {
            questionsAsked: raw.progress.questionsAsked,
            percentComplete: raw.progress.percentComplete,
          }
        : null,
    feedback: raw?.feedback,
  };
}

async function callInterviewApi(body: unknown): Promise<InterviewResponse> {
  let res: Response;
  try {
    res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Network failure (offline, DNS, CORS, etc.)
    throw new InterviewApiError();
  }

  if (!res.ok) {
    // Covers rate limits, server errors, anything non-2xx — deliberately
    // not surfaced beyond "something went wrong."
    throw new InterviewApiError();
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new InterviewApiError();
  }

  return normalizeResponse(data);
}

/**
 * Starts a new interview. Generates and returns the sessionId so the caller
 * can hold onto it for every subsequent sendMessage() call.
 */
export async function startInterview(
  candidate: unknown
): Promise<{ sessionId: string; response: InterviewResponse }> {
  const sessionId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const response = await callInterviewApi({ sessionId, candidate });
  return { sessionId, response };
}

/** Submits the candidate's answer and gets the next question (or final feedback). */
export function sendMessage(sessionId: string, message: string): Promise<InterviewResponse> {
  return callInterviewApi({ sessionId, message });
}
