"use client";

import { useEffect, useState } from "react";

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

interface WelcomeScreenProps {
  onStart: (candidate: RawCandidateEntry) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function WelcomeScreen({ onStart, loading, error, onRetry }: WelcomeScreenProps) {
  const [candidates, setCandidates] = useState<RawCandidateEntry[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/candidates.json")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: { candidates: RawCandidateEntry[] }) => setCandidates(data.candidates ?? []))
      .catch(() => setLoadError(true));
  }, []);

  const selected = candidates.find((c) => c.member.id === selectedId) ?? null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-10 sm:px-6">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A33D]">
          ABTalks
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#F2F1ED] sm:text-3xl">
          Technical Interview
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#9B9CA6]">
          Select a candidate profile to begin a practice interview based on their
          real cohort progress.
        </p>
      </div>

      {loadError && (
        <p className="mb-4 rounded-lg border border-[#F2637B]/30 bg-[#F2637B]/10 px-4 py-3 text-sm text-[#F2637B]">
          Couldn&apos;t load candidate profiles. Refresh the page to try again.
        </p>
      )}

      <div className="mb-6 flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
        {candidates.map((c) => {
          const isSelected = c.member.id === selectedId;
          return (
            <button
              key={c.member.id}
              type="button"
              onClick={() => setSelectedId(c.member.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                isSelected
                  ? "border-[#E8A33D] bg-[#E8A33D]/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#F2F1ED]">{c.member.name}</span>
                <span className="font-mono text-[10px] text-[#9B9CA6]">{c.member.id}</span>
              </div>
              <p className="mt-0.5 text-xs text-[#9B9CA6]">{c.member.jobRole}</p>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-[#F2637B]/30 bg-[#F2637B]/10 px-4 py-3 text-sm text-[#F2637B]">
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

      <button
        type="button"
        disabled={!selected || loading}
        onClick={() => selected && onStart(selected)}
        className="w-full rounded-xl bg-[#E8A33D] px-5 py-3 text-sm font-semibold text-[#12141C] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:opacity-90"
      >
        {loading ? "Starting…" : "Start Interview"}
      </button>
    </div>
  );
}
