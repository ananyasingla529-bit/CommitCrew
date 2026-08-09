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
    setLoading(true);
    setError(null);
    try {
      const response = await sendMessage(sessionId, draftAnswer);

      if (response.done) {
        if (response.feedback) setFeedback(response.feedback);
        setCurrentQuestion("");
        setDraftAnswer("");
      } else {
        setHistory((prev) => [
          ...prev,
          { role: "ai", text: currentQuestion },
          { role: "user", text: draftAnswer },
        ]);
        setCurrentQuestion(response.reply);
        setDraftAnswer("");
      }
      setProgress(response.progress ?? null);
    } catch (err) {
      // Conversation, session, and the unsent draft are all left untouched
      // so the user can hit Retry (or Send again) without losing anything
      // or thinking the interview ended.
      setError(err instanceof InterviewApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
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
