// ============================================================================
// STATUS: Reference module — NOT currently imported by app/api/interview/route.ts
//
// The live API route implements equivalent logic inline (tested and fixed
// against two production bugs: session persistence via Vercel KV instead of
// in-memory storage, and file access patterns safe for Vercel serverless).
// Before wiring this file into the live route, it needs the same two fixes:
//   1. Any fs.readFileSync() file reads should become static imports
//      (e.g. `import curriculum from "@/public/curriculum.json"`) so
//      Vercel's build reliably bundles the file.
//   2. Any in-memory Map-based session storage should be replaced with
//      Vercel KV (see route.ts for the working pattern) so sessions
//      survive server restarts.
// Kept here as clean reference structure for future integration.
// ============================================================================

// ============================================================================
// Question selection + duplicate-topic prevention.
//
// Replaces Person 1's Phase 1 `MAX_QUESTIONS = 5` count-only cutoff with the
// real completion rule: 8+ questions across 4+ distinct days, no day asked
// about twice. Only draws from the candidate's own completedDays — days
// they skipped or failed aren't fair interview material.
// ============================================================================

import type { Candidate } from "./types";
import { MIN_DISTINCT_DAYS, MIN_QUESTIONS } from "./types";
import type { InterviewState } from "./interview-state";
import { getModuleForDay } from "./curriculum";

/** Days from the candidate's completedDays that haven't been asked about yet. */
export function getUncoveredTopics(candidate: Candidate, state: InterviewState): number[] {
  const askedDays = state.getDaysAsked();
  return candidate.completedDays.filter((day) => !askedDays.has(day));
}

/**
 * Pick the next day to ask about, in ascending curriculum order (earlier
 * modules first, since the curriculum is sequenced and later days build on
 * earlier ones — this is the same difficulty proxy noted in curriculum.ts,
 * not an invented difficulty field).
 *
 * Returns null when every completed day has already been covered.
 */
export function selectNextTopic(candidate: Candidate, state: InterviewState): number | null {
  const uncovered = getUncoveredTopics(candidate, state);
  if (uncovered.length === 0) return null;

  const sorted = [...uncovered].sort((a, b) => {
    const moduleA = getModuleForDay(a)?.n ?? Number.MAX_SAFE_INTEGER;
    const moduleB = getModuleForDay(b)?.n ?? Number.MAX_SAFE_INTEGER;
    if (moduleA !== moduleB) return moduleA - moduleB;
    return a - b;
  });

  return sorted[0];
}

export function hasTopicBeenCovered(day: number, state: InterviewState): boolean {
  return state.getDaysAsked().has(day);
}

/**
 * True once the interview meets the 8-questions/4-distinct-days rule.
 * This is the direct replacement for Person 1's `questionCount > MAX_QUESTIONS`.
 */
export function isInterviewComplete(state: InterviewState): boolean {
  return state.getQuestionTracker().isSessionComplete;
}

/** Re-exported here for convenience so callers don't need to import from types.ts too. */
export { MIN_QUESTIONS, MIN_DISTINCT_DAYS };
