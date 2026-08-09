"use client";

import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import ProgressBar from "./ProgressBar";
import type { InterviewProgress } from "@/lib/interview-api";

export interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

interface ChatWindowProps {
  candidateName: string;
  jobRole: string;
  history: ChatMessage[];
  currentQuestion: string;
  progress: InterviewProgress | null;
  draftAnswer: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ChatWindow({
  candidateName,
  jobRole,
  history,
  currentQuestion,
  progress,
  draftAnswer,
  onDraftChange,
  onSend,
  loading,
  error,
  onRetry,
}: ChatWindowProps) {
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, currentQuestion]);

  const canSend = draftAnswer.trim().length > 0 && !loading;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
      {/* Header */}
      <div className="mb-4 shrink-0 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#F2F1ED]">{candidateName}</p>
            <p className="text-xs text-[#9B9CA6]">{jobRole}</p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Scrollable history */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 pb-2">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "self-start rounded-tl-sm bg-white/[0.06] text-[#E5E4E0]"
                  : "self-end rounded-tr-sm bg-[#E8A33D]/15 text-[#F2F1ED]"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {/* Current, not-yet-answered question */}
          {currentQuestion && (
            <div className="self-start max-w-[85%] rounded-2xl rounded-tl-sm border border-[#E8A33D]/30 bg-[#E8A33D]/10 px-4 py-2.5 text-sm leading-relaxed text-[#F2F1ED]">
              {currentQuestion}
            </div>
          )}

          <div ref={historyEndRef} />
        </div>
      </div>

      {/* Error banner — minimal, non-technical, always retryable, never implies the interview ended */}
      {error && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-[#F2637B]/30 bg-[#F2637B]/10 px-4 py-2.5 text-sm text-[#F2637B]">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="ml-3 shrink-0 font-medium underline decoration-[#F2637B]/50 underline-offset-2 hover:decoration-[#F2637B]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input */}
      <div className="mt-1 flex shrink-0 items-end gap-2">
        <textarea
          value={draftAnswer}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onDraftChange(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) onSend();
            }
          }}
          disabled={loading}
          rows={2}
          placeholder="Type your answer…"
          className="min-h-[52px] flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#F2F1ED] placeholder-[#6B6C76] outline-none focus:border-[#E8A33D]/50 disabled:opacity-50"
        />
        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          className="h-[52px] shrink-0 rounded-xl bg-[#E8A33D] px-5 text-sm font-semibold text-[#12141C] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:opacity-90"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
