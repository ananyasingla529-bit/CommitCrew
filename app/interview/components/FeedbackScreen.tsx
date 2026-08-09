import type { InterviewFeedback } from "@/lib/interview-api";

interface FeedbackScreenProps {
  candidateName: string;
  feedback: InterviewFeedback;
  onRestart: () => void;
}

function Section({ label, items, accent }: { label: string; items: string[]; accent: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: accent }}>
        {label}
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-[#E5E4E0]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FeedbackScreen({ candidateName, feedback, onRestart }: FeedbackScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-10 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A33D]">
        Interview Complete
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-[#F2F1ED] sm:text-3xl">{candidateName}</h1>

      <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-[#E5E4E0]">
        {feedback.summary}
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <Section label="Strengths" items={feedback.strengths} accent="#4FD1C5" />
        <Section label="Areas to Improve" items={feedback.gaps} accent="#F2C572" />
        <Section label="Next Steps" items={feedback.next} accent="#E8A33D" />
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-8 w-full rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-[#F2F1ED] transition-colors hover:border-white/30"
      >
        Start New Interview
      </button>
    </div>
  );
}
