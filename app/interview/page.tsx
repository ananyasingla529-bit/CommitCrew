"use client";

import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatWindow, { type ChatMessage } from "./components/ChatWindow";
import FeedbackScreen from "./components/FeedbackScreen";
import { startInterview, sendMessage, InterviewApiError, type InterviewProgress, type InterviewFeedback } from "@/lib/interview-api";

interface RawCandidateEntry {
  member: {
    id: string;
    name: string;
    jobRole: string;
    yearsExperience: number;
    education: string;
    status: string;
  };
  missions: unknown[];
  signals: unknown;
}

export default function InterviewPage() {
  const [candidate, setCandidate] = useState<RawCandidateEntry | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [progress, setProgress] = useState<InterviewProgress | null>(null);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const screen: "welcome" | "chat" | "feedback" = feedback ? "feedback" : sessionId ? "chat" : "welcome";

  async function handleStart(selected: RawCandidateEntry) {
    setCandidate(selected);
    setLoading(true);
    setError(null);
    try {
      const { sessionId: newSessionId, response } = await startInterview(selected);
      setSessionId(newSessionId);
      setCurrentQuestion(response.reply);
      setProgress(response.progress ?? null);
    } catch (err) {
      // Session/candidate selection is preserved (nothing above is reset),
      // so the user can just retry without losing anything.
      setError(err instanceof InterviewApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!sessionId || draftAnswer.trim().length === 0 || loading) return;

    const answeredQuestion = currentQuestion;
    const answerText = draftAnswer;

    // Show the exchange immediately (like a normal chat) instead of waiting
    // for the evaluation to finish before it appears.
    setHistory((prev) => [
      ...prev,
      { role: "ai", text: answeredQuestion },
      { role: "user", text: answerText },
    ]);
    setCurrentQuestion("");
    setDraftAnswer("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage(sessionId, answerText);
      setProgress(response.progress ?? null);

      if (response.done) {
        // Show the interviewer's closing message as a real chat bubble first
        // — the candidate should see the interview actually wrap up in
        // conversation before the report appears, not jump straight to it.
        if (response.reply) {
          setHistory((prev) => [...prev, { role: "ai", text: response.reply }]);
        }
        setFinishing(true);
        setTimeout(() => {
          if (response.feedback) setFeedback(response.feedback);
          setFinishing(false);
          setLoading(false);
        }, 1800);
      } else {
        setCurrentQuestion(response.reply);
        setLoading(false);
      }
    } catch (err) {
      // Roll back the optimistic update and restore the question + draft
      // so Retry (or Send again) picks up exactly where it left off.
      setHistory((prev) => prev.slice(0, -2));
      setCurrentQuestion(answeredQuestion);
      setDraftAnswer(answerText);
      setError(err instanceof InterviewApiError ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function handleRestart() {
    setCandidate(null);
    setSessionId(null);
    setHistory([]);
    setCurrentQuestion("");
    setProgress(null);
    setDraftAnswer("");
    setFeedback(null);
    setFinishing(false);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0F1115]">
      {screen === "welcome" && (
        <WelcomeScreen onStart={handleStart} loading={loading} error={error} onRetry={() => candidate && handleStart(candidate)} />
      )}

      {screen === "chat" && candidate && (
        <ChatWindow
          candidateName={candidate.member.name}
          jobRole={candidate.member.jobRole}
          history={history}
          currentQuestion={currentQuestion}
          progress={progress}
          draftAnswer={draftAnswer}
          onDraftChange={setDraftAnswer}
          onSend={handleSend}
          loading={loading}
          finishing={finishing}
          error={error}
          onRetry={handleSend}
        />
      )}

      {screen === "feedback" && candidate && feedback && (
        <FeedbackScreen candidateName={candidate.member.name} feedback={feedback} onRestart={handleRestart} />
      )}
    </div>
  );
}
