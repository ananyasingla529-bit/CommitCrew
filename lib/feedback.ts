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
// Structure 4: Feedback.
//
// The full InterviewFeedback shape (Structure 4, as designed) is richer
// than what technical-spec.md's API contract requires for the actual HTTP
// response (`{ summary, strengths, gaps, next }`). Both are kept:
//
//   - buildFeedback()      -> assembles the full Structure 4 object.
//   - toApiFeedback()      -> thin mapper: Structure 4 -> spec's minimal shape,
//                             used only at the HTTP response boundary.
//
// The qualitative parts (performance labels, scores, recommendation) are
// expected to come from an LLM call (Person 2's territory) — this module
// takes that raw LLM output plus the tracker/candidate data and assembles
// the final, correctly-shaped object. It does not call the LLM itself.
// ============================================================================

import type {
  Candidate,
  InterviewFeedback,
  QuestionTracker,
  TopicCoverage,
} from "./types";

/** What the LLM call is expected to produce (the qualitative judgment calls). */
export interface RawAssessmentInput {
  topicPerformance: Record<string, string>; // day (as string) -> "strong" | "solid" | "developing" | "weak"
  strengths: string[];
  areasForImprovement: string[];
  overallScore: number;
  scoreBreakdown: {
    technicalUnderstanding: number;
    communicationClarity: number;
    problemSolving: number;
  };
  recommendation: string;
}

/**
 * Assemble the full Structure 4 InterviewFeedback object from the
 * question tracker (for which days/topics were actually covered),
 * the candidate (for name), and the LLM's qualitative assessment.
 */
export function buildFeedback(
  candidate: Candidate,
  tracker: QuestionTracker,
  startTime: string,
  assessment: RawAssessmentInput
): InterviewFeedback {
  const endTime = new Date().toISOString();
  const durationMinutes = Math.max(
    0,
    Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
  );

  const topicsCovered: TopicCoverage[] = tracker.daysUsedForQuestions.map((day) => {
    const detail = candidate.dayDetails[String(day)];
    return {
      day,
      title: detail ? detail.title : `Day ${day}`,
      performance: assessment.topicPerformance[String(day)] ?? "not assessed",
    };
  });

  return {
    sessionId: tracker.sessionId,
    candidateId: candidate.candidateId,
    candidateName: candidate.name,
    endTime,
    durationMinutes,
    assessment: {
      topicsCovered,
      strengths: assessment.strengths,
      areasForImprovement: assessment.areasForImprovement,
      overallScore: assessment.overallScore,
      scoreBreakdown: assessment.scoreBreakdown,
      recommendation: assessment.recommendation,
    },
  };
}

/**
 * Map the full Structure 4 object down to technical-spec.md's minimal
 * required response shape: { summary, strengths, gaps, next }.
 * This is the ONLY place that shape gets constructed.
 */
export function toApiFeedback(feedback: InterviewFeedback): {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
} {
  return {
    summary: feedback.assessment.recommendation,
    strengths: feedback.assessment.strengths,
    gaps: feedback.assessment.areasForImprovement,
    next: feedback.assessment.topicsCovered
      .filter((t) => t.performance === "developing" || t.performance === "weak")
      .map((t) => `Revisit: ${t.title}`),
  };
}
