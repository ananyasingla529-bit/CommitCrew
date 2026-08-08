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
// Shared types for the four Phase 1 data structures.
//
// These mirror the structures Person 3 designed and the team already
// reviewed. Field names and shapes are kept exactly as designed. Where a
// field is genuinely useful pass-through data that exists in the raw source
// files (public/candidates.json, public/curriculum.json) but wasn't part of
// the original four structures, it is added as a clearly separated "extra"
// field rather than folded into the original fields — see comments below.
// ============================================================================

// ---------------------------------------------------------------------------
// STRUCTURE 1: Candidate
// ---------------------------------------------------------------------------

/** One curriculum day's detail, as attached inside a Candidate's dayDetails map. */
export interface CandidateDayDetail {
  dayNumber: number;
  title: string;
  type: string; // e.g. "SETUP" | "BUILD" | "AI_CORE" | "LEARN" | "OPTIMIZE" | "SHIP_IT" | "CAPSTONE"
  tools: string[];
  objectives: string[];
}

export interface Candidate {
  candidateId: string;
  name: string;

  completedDays: number[]; // missions[].passed === true
  skippedDays: number[]; // missions[].skipped === true
  failedDays: number[]; // missions[].passed === false

  dayDetails: Record<string, CandidateDayDetail>; // keyed by day number as string

  // --- Extra pass-through fields (not part of the original 4-structure design) ---
  // These come straight from public/candidates.json's `member` and `signals`
  // objects. Included because they're real, already-available data an
  // interviewer/prompt-writer will likely want, but kept clearly separate
  // from the original fields above so nothing is silently redefined.
  extra?: {
    jobRole: string;
    yearsExperience: number;
    education: string;
    status: string;
    signals: {
      commitDays: number;
      missionsCompleted: number;
      missionsFirstTry: number;
    };
  };
}

// ---------------------------------------------------------------------------
// STRUCTURE 2: Conversation History
// ---------------------------------------------------------------------------

export interface ConversationTurn {
  turnNumber: number;
  dayAsked: number;
  topicAsked: string;
  question: string;
  candidateAnswer: string;
  followUpQuestion: string | null;
  followUpAnswer: string | null;
  timestamp: string; // ISO 8601
}

export interface ConversationHistoryData {
  sessionId: string;
  candidateId: string;
  startTime: string; // ISO 8601
  turns: ConversationTurn[];
}

// ---------------------------------------------------------------------------
// STRUCTURE 3: Question Tracker
// ---------------------------------------------------------------------------

export interface QuestionAskedEntry {
  turnNumber: number; // sequential counter over every question utterance (main + follow-ups)
  day: number;
  topicTitle: string;
  questionText: string;
}

export interface CompletionStatus {
  minimumQuestionsReached: boolean;
  minimumDaysReached: boolean;
  reason: string;
}

export interface QuestionTracker {
  sessionId: string;
  candidateId: string;
  questionsAsked: QuestionAskedEntry[];
  daysUsedForQuestions: number[];
  totalQuestionsAsked: number;
  totalDistinctDays: number;
  isSessionComplete: boolean;
  completionStatus: CompletionStatus;
}

// ---------------------------------------------------------------------------
// STRUCTURE 4: Feedback
// ---------------------------------------------------------------------------

export interface TopicCoverage {
  day: number;
  title: string;
  performance: string; // e.g. "strong" | "solid" | "developing" | "weak"
}

export interface ScoreBreakdown {
  technicalUnderstanding: number;
  communicationClarity: number;
  problemSolving: number;
}

export interface InterviewAssessment {
  topicsCovered: TopicCoverage[];
  strengths: string[];
  areasForImprovement: string[];
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  recommendation: string;
}

export interface InterviewFeedback {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  endTime: string; // ISO 8601
  durationMinutes: number;
  assessment: InterviewAssessment;
}

// ---------------------------------------------------------------------------
// Completion rule constants (8 questions across 4+ distinct days)
// ---------------------------------------------------------------------------

export const MIN_QUESTIONS = 8;
export const MIN_DISTINCT_DAYS = 4;

// ---------------------------------------------------------------------------
// Raw source file shapes (public/candidates.json, public/curriculum.json)
// Included so the transform functions have honest input types instead of `any`.
// ---------------------------------------------------------------------------

export interface RawMission {
  day: number;
  title: string;
  passed?: boolean; // present when passed or explicitly failed
  attempts?: number; // absent when skipped
  skipped?: boolean; // present (true) only when the day was skipped
}

export interface RawCandidateEntry {
  member: {
    id: string;
    name: string;
    jobRole: string;
    yearsExperience: number;
    education: string;
    status: string;
  };
  missions: RawMission[];
  signals: {
    commitDays: number;
    missionsCompleted: number;
    missionsFirstTry: number;
  };
}

export interface RawCandidatesFile {
  candidates: RawCandidateEntry[];
}

export interface RawCurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export interface RawCurriculumModule {
  n: number;
  title: string;
  days: [number, number]; // inclusive day range
}

export interface RawCurriculumFile {
  cohort: string;
  modules: RawCurriculumModule[];
  days: RawCurriculumDay[];
}
