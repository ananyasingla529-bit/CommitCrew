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
// Interview state: Structure 2 (Conversation History) + Structure 3
// (Question Tracker).
//
// Design note: these two structures describe the same underlying session
// from two different angles — Structure 2 groups Q&A by conversational
// "turn" (a main question, its answer, and an optional follow-up in the
// same exchange); Structure 3 flattens every question actually uttered
// (main + follow-ups) into one running list for completion tracking.
//
// Rather than maintaining two separate, hand-synced copies of this data,
// InterviewState keeps ONE source of truth (`turns`, exactly Structure 2's
// shape) and derives Structure 3 from it on demand via getQuestionTracker().
// This guarantees the two views can never disagree, while both exported
// shapes remain byte-for-byte what was designed.
// ============================================================================

import type {
  CompletionStatus,
  ConversationHistoryData,
  ConversationTurn,
  QuestionAskedEntry,
  QuestionTracker,
} from "./types";
import { MIN_DISTINCT_DAYS, MIN_QUESTIONS } from "./types";

export class InterviewState {
  sessionId: string;
  candidateId: string;
  startTime: string;
  private turns: ConversationTurn[] = [];

  constructor(sessionId: string, candidateId: string, startTime: string = new Date().toISOString()) {
    this.sessionId = sessionId;
    this.candidateId = candidateId;
    this.startTime = startTime;
  }

  /** Record a new main question + the candidate's answer as a new turn. */
  addTurn(dayAsked: number, topicAsked: string, question: string, candidateAnswer: string): ConversationTurn {
    const turn: ConversationTurn = {
      turnNumber: this.turns.length + 1,
      dayAsked,
      topicAsked,
      question,
      candidateAnswer,
      followUpQuestion: null,
      followUpAnswer: null,
      timestamp: new Date().toISOString(),
    };
    this.turns.push(turn);
    return turn;
  }

  /** Attach a follow-up question + answer to the most recent turn. */
  addFollowUp(followUpQuestion: string, followUpAnswer: string): void {
    const lastTurn = this.turns[this.turns.length - 1];
    if (!lastTurn) {
      throw new Error("Cannot add a follow-up: no turns recorded yet.");
    }
    lastTurn.followUpQuestion = followUpQuestion;
    lastTurn.followUpAnswer = followUpAnswer;
  }

  /** Structure 2, exactly as designed. */
  getConversationHistory(): ConversationHistoryData {
    return {
      sessionId: this.sessionId,
      candidateId: this.candidateId,
      startTime: this.startTime,
      turns: this.turns,
    };
  }

  /**
   * Structure 3, derived from the turns recorded so far. Every main
   * question and every follow-up question is flattened into one
   * sequential list, in the order the turns were recorded.
   */
  getQuestionTracker(): QuestionTracker {
    const questionsAsked: QuestionAskedEntry[] = [];
    let counter = 0;

    for (const turn of this.turns) {
      counter++;
      questionsAsked.push({
        turnNumber: counter,
        day: turn.dayAsked,
        topicTitle: turn.topicAsked,
        questionText: turn.question,
      });

      if (turn.followUpQuestion) {
        counter++;
        questionsAsked.push({
          turnNumber: counter,
          day: turn.dayAsked, // follow-up stays on the same day/topic as its parent turn
          topicTitle: turn.topicAsked,
          questionText: turn.followUpQuestion,
        });
      }
    }

    const daysUsedForQuestions = Array.from(new Set(this.turns.map((t) => t.dayAsked)));
    const totalQuestionsAsked = questionsAsked.length;
    const totalDistinctDays = daysUsedForQuestions.length;

    const minimumQuestionsReached = totalQuestionsAsked >= MIN_QUESTIONS;
    const minimumDaysReached = totalDistinctDays >= MIN_DISTINCT_DAYS;

    const completionStatus: CompletionStatus = {
      minimumQuestionsReached,
      minimumDaysReached,
      reason: (minimumQuestionsReached && minimumDaysReached)
        ? "Completion requirements met."
        : `Need ${MIN_QUESTIONS} questions across ${MIN_DISTINCT_DAYS}+ days. Have ${totalQuestionsAsked} questions across ${totalDistinctDays} days.`,
    };

    return {
      sessionId: this.sessionId,
      candidateId: this.candidateId,
      questionsAsked,
      daysUsedForQuestions,
      totalQuestionsAsked,
      totalDistinctDays,
      isSessionComplete: minimumQuestionsReached && minimumDaysReached,
      completionStatus,
    };
  }

  /** Convenience: which days have already been asked about (for no-repeat logic). */
  getDaysAsked(): Set<number> {
    return new Set(this.turns.map((t) => t.dayAsked));
  }
}

// ----------------------------------------------------------------------------
// In-memory session store, keyed by sessionId — same storage model Person 1's
// Phase 1 prototype already uses (a Map). Swappable for persistence later
// without changing the InterviewState class itself.
// ----------------------------------------------------------------------------

const activeSessions = new Map<string, InterviewState>();

export function createSession(sessionId: string, candidateId: string): InterviewState {
  const state = new InterviewState(sessionId, candidateId);
  activeSessions.set(sessionId, state);
  return state;
}

export function getSession(sessionId: string): InterviewState | null {
  return activeSessions.get(sessionId) ?? null;
}

export function deleteSession(sessionId: string): void {
  activeSessions.delete(sessionId);
}
