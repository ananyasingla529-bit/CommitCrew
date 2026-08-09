import type { InterviewProgress } from "@/lib/interview-api";

interface ProgressBarProps {
  progress: InterviewProgress | null;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  // Defensive: the backend's `progress` field may not be live yet.
  // Render nothing rather than a fake/zeroed bar.
  if (!progress) return null;

  const pct = Math.max(0, Math.min(100, progress.percentComplete));

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider text-[#9B9CA6]">
        <span>Coverage</span>
        <span className="text-[#E8A33D]">
          {String(progress.questionsAsked).padStart(2, "0")} asked
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E8A33D] to-[#F2C572] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
