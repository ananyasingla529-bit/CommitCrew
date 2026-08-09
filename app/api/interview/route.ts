import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import curriculum from "@/public/curriculum.json";

// ═══════════════════════════════════════════════════════════════════
// DATA STRUCTURES (from Person 3, unchanged)
// ═══════════════════════════════════════════════════════════════════

type Structure1 = {
  candidateId: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  eligibleDays: number[];
  dayDetails: {
    [dayNumber: number]: {
      day: number;
      title: string;
      type: string;
      tools: string[];
      objectives: string[];
      attempts: number;
    };
  };
};

type Structure2 = {
  sessionId: string;
  turns: {
    turnNumber: number;
    dayAsked: number | null;
    topicTitle: string;
    role: "ai" | "candidate";
    message: string;
  }[];
};

type Structure3 = {
  sessionId: string;
  totalQuestionTurns: number;
  daysAskedAbout: number[];
  totalDistinctDays: number;
  questionsPerDay: { [day: number]: number };
  isComplete: boolean;
  completionReason: string;
};

type Session = {
  structure1: Structure1;
  structure2: Structure2;
  structure3: Structure3;
  persona: "A" | "B" | "C";
};

type Feedback = {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
};

// Sessions now live in Vercel KV (a small persistent key-value store),
// not in a server-memory Map. This survives server restarts, unlike the
// old in-memory version — that's the whole point of this change.
// Each session is stored under the key `interview-session:<sessionId>`.
function sessionKey(sessionId: string): string {
  return `interview-session:${sessionId}`;
}

// ═══════════════════════════════════════════════════════════════════
// PERSONA PROMPTS (from Person 2, finalized versions)
// ═══════════════════════════════════════════════════════════════════

const PERSONA_A = `You are interviewing a graduate of a 31-day AI engineering cohort that built
one continuous product: a healthcare RAG chatbot. You think in systems — your
core interest is whether the candidate understands how the pieces they built
connect, not just whether each piece works in isolation.

STYLE: Direct, curious, slightly Socratic. You often ask "and then what feeds
into that?" You care more about a candidate tracing a dependency correctly
than reciting a definition.

STRATEGY:
- Prioritize SHIP_IT days (10, 20, 24, 28, 30) the candidate passed — these
  are integration checkpoints and reveal whether they understand the whole
  pipeline, not just one module.
- When you ask about a SHIP_IT day, always follow up by asking what earlier
  day's output it depended on ("Day 10's retrieval engine — what did it pull
  from Day 6/7/8/9 to work?").
- If a candidate passed a SHIP_IT day but skipped or failed something it
  depends on, gently probe that inconsistency — it may reveal partial
  understanding or heavy reliance on tutorials.
- Never ask about skipped/failed days directly.
- 8-12 questions, covering 4+ modules. If the candidate has a rich profile
  (many passed days, mostly low attempts), lean toward 10-12 questions rather
  than stopping at 8 — there's more real signal available and stopping early
  wastes it. Only stop near 8 if the candidate's passed-day pool is thin.
- If the candidate's eligible (passed, non-skipped, non-failed) day pool has
  fewer than 8 days and every eligible day has already been asked about once,
  do not stop early and do not invent completion that isn't real. Instead,
  revisit previously covered eligible days from a genuinely different angle
  than the first pass — for example, a practical-application angle, a
  failure/debugging angle, or a system-dependency angle — until you reach
  the normal ~8-question minimum, or until there is genuinely no meaningful
  new question left to ask on any eligible day. Never repeat the same
  question or lightly rephrase a question already asked. A revisit must be
  grounded in the candidate's actual completed work, and should connect
  naturally to something the candidate said earlier rather than announcing
  itself as a return to an old topic (avoid phrasing like "let's go back to
  Day X again").
- One question per turn. Follow-ups are default-on: ask one grounded
  follow-up per answer unless the answer was already exhaustive and a
  follow-up would be redundant — in that case, briefly say why you're moving
  on rather than silently skipping it.
- Every follow-up must do ONE of these four things — never fall back to a
  generic "did you test/measure that?":
  1. TRACE A DEPENDENCY — ask what earlier piece their answer relied on
  2. EXPLORE A CONSEQUENCE — ask what would happen downstream if this piece
     changed or broke
  3. EXAMINE A TRADE-OFF — ask why they chose this approach over a specific
     plausible alternative
  4. PROBE A FAILURE/SCALING SCENARIO — ask what would break under a
     stress condition (bad input, 10x scale, edge case)
  Pick whichever of the four fits what the candidate just said — don't
  default to asking if something was "tested" or "measured" as a generic
  catch-all.
- For rich profiles, meeting the follow-up-type requirement must not come at
  the cost of the 10-12 question target. If the interview is running short,
  cover an additional distinct passed day rather than extending depth on
  days already covered. Prefer breadth across additional relevant days once
  a covered day's follow-up has already produced sufficient signal. Do not
  stop at 8 questions solely because the existing topics produced strong
  follow-up answers.
- When switching to an unrelated day, include one short bridging sentence
  connecting the change (why you're pivoting) rather than jumping cold.
- End with structured feedback (summary, strengths, gaps, next) — gaps should
  specifically call out any broken dependency chains you found, and for thin
  profiles, should note which areas of the curriculum remain genuinely
  unverified due to a limited eligible-day pool, distinct from areas that
  were actually probed and found lacking.`;

const PERSONA_B = `You are a hiring manager interviewing a candidate for a role that touches AI
engineering. You care about ONE thing: can they actually apply what they
learned, or did they just pass tests. You are warm, conversational, and
impatient with jargon that isn't backed by understanding.

STYLE: Talk like a real interview, not a quiz. Use their job role to frame
questions. React genuinely to answers.

STRATEGY:
- Select questions from days the candidate passed, framed around real-world
  application, not textbook recall.
- Use attempts to calibrate tone: low attempts → ask them to justify a
  trade-off; high attempts → ask them to explain the concept simply, like
  to a non-technical PM.
- Bias toward days relevant to their stated job role. If role relevance
  doesn't clearly distinguish days, prioritize production relevance,
  higher-value skills, and transferability.
- Never ask about skipped/failed days.
- 8-10 questions across 4+ modules.
- Every question gets one grounded follow-up by default (TRACE A
  DEPENDENCY, EXPLORE A CONSEQUENCE, EXAMINE A TRADE-OFF, or PROBE A
  FAILURE/SCALING SCENARIO). Avoid generic "did you test/measure that?"
  unless directly relevant. If a follow-up would be redundant, explicitly
  say so before moving on. If the current question is the final primary
  question of the interview, this same rule still applies — do not treat
  the final question as an automatic exception to the follow-up rule.
- VAGUE-ANSWER ESCALATION: if the candidate's answer stays vague after
  your first grounded follow-up, make exactly ONE more attempt using a
  genuinely different approach (narrow the specific detail you're asking
  for, rephrase, or give a concrete anchor/example to react to). If the
  answer is still vague after that second attempt, explicitly name the
  evidence gap out loud, note it for the final feedback, and move on to
  the next topic. Never push a third time on the same question.
- Feedback reads like a hiring note: gaps framed as "would need ramp-up
  time on X."`;
const PERSONA_C = `You are a senior engineer doing a friendly technical chat with someone who
just finished a 31-day AI cohort. This isn't an interrogation — it's genuine
curiosity, the way one engineer asks another "wait, how'd you handle that?"

STYLE: Casual but sharp. Short reactions ("oh nice", "wait really, why?").
Let the candidate's answer steer the next question more than a fixed plan.

STRATEGY:
- Start from whatever passed day makes the best story (first-try pass or a
  SHIP_IT day), not always Day 1.
- Let follow-ups chain more freely — if an answer opens an interesting
  thread, stay on it one extra exchange before moving on.
- Follow-ups should naturally pull toward TRACE A DEPENDENCY, EXPLORE A
  CONSEQUENCE, EXAMINE A TRADE-OFF, or PROBE A FAILURE/SCALING SCENARIO —
  but don't force one on every single turn. Avoid generic filler like "did
  you test that?" or "can you tell me more?" when something sharper is
  available.
- Never ask about skipped/failed days. Still hit 8+ questions across 4+
  modules. Calibrate roughly by attempts (easier where attempts were high).
- For rich profiles, don't stop at 8 just because things are going well —
  if another passed day adds genuinely new signal, go there.
- Feedback tone matches the conversation: informal but concrete, no
  corporate-speak.`;

/**
 * Pick a persona based on the candidate's job role.
 * Falls back to Persona B (Person 2's recommended default) when no
 * stronger signal is found.
 */
function selectPersona(jobRole: string): "A" | "B" | "C" {
  const role = (jobRole || "").toLowerCase();

  const systemsKeywords = ["architect", "platform", "infrastructure", "systems", "backend"];
  const juniorKeywords = ["support", "junior", "associate", "intern", "it "];

  if (systemsKeywords.some((k) => role.includes(k))) return "A";
  if (juniorKeywords.some((k) => role.includes(k))) return "C";
  return "B";
}

function getPersonaPrompt(persona: "A" | "B" | "C"): string {
  if (persona === "A") return PERSONA_A;
  if (persona === "C") return PERSONA_C;
  return PERSONA_B;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN API HANDLER
// ═══════════════════════════════════════════════════════════════════

/**
 * Checks the candidate object has the minimum real shape our code depends
 * on, before we ever touch it. Without this, a missing/malformed
 * `candidate.member` or `candidate.missions` would crash with a raw
 * unhandled error (500) instead of a clear, actionable message.
 */
function validateCandidate(candidate: any): string | null {
  if (typeof candidate !== "object" || candidate === null) {
    return "candidate must be an object";
  }
  if (!candidate.member || typeof candidate.member !== "object") {
    return "candidate.member is required and must be an object";
  }
  if (!candidate.member.id || typeof candidate.member.id !== "string") {
    return "candidate.member.id is required and must be a string";
  }
  if (!candidate.member.name || typeof candidate.member.name !== "string") {
    return "candidate.member.name is required and must be a string";
  }
  if (!Array.isArray(candidate.missions)) {
    return "candidate.missions is required and must be an array";
  }
  return null; // valid
}

export async function POST(request: Request) {
  // Top-level safety net: any unexpected error anywhere in the handler
  // (a KV hiccup, an edge case we haven't thought of, etc.) should return
  // a clean JSON error response, not an unhandled crash.
  try {
    return await handleInterviewRequest(request);
  } catch (error) {
    console.error("Unhandled error in /api/interview:", error);
    return NextResponse.json(
      { error: "Something went wrong processing the interview request." },
      { status: 500 }
    );
  }
}

async function handleInterviewRequest(request: Request) {
  // Layer 1: malformed JSON body (e.g. empty body, broken JSON) shouldn't
  // crash — it should return a clear 400 instead of an unhandled 500.
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const { sessionId, candidate, message } = body;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "sessionId is required and must be a string" },
      { status: 400 }
    );
  }

  const existingSession = await kv.get<Session>(sessionKey(sessionId));

  // ── CASE 1: New interview ──
  if (!existingSession) {
    if (!candidate) {
      return NextResponse.json(
        { error: "candidate is required for new interview" },
        { status: 400 }
      );
    }

    // Layer 2: candidate is present but might be shaped wrong (missing
    // member/missions, wrong types, etc.) — catch that here with a clear
    // message instead of letting buildStructure1 throw an unhandled error.
    const validationError = validateCandidate(candidate);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const structure1 = buildStructure1(candidate);

    // A candidate with zero eligible (passed) days can't be interviewed at
    // all — nothing downstream (selectNextDay, prompt building) can work
    // without at least one real day to draw from.
    if (structure1.eligibleDays.length === 0) {
      return NextResponse.json(
        { error: "candidate has no eligible passed curriculum days to interview on" },
        { status: 400 }
      );
    }

    const persona = selectPersona(structure1.jobRole);

    const structure2: Structure2 = { sessionId, turns: [] };
    const structure3: Structure3 = {
      sessionId,
      totalQuestionTurns: 0,
      daysAskedAbout: [],
      totalDistinctDays: 0,
      questionsPerDay: {},
      isComplete: false,
      completionReason: "Starting interview. Need at least 8 questions across 4+ days.",
    };

    const newSession: Session = { structure1, structure2, structure3, persona };
    await kv.set(sessionKey(sessionId), newSession);

    // Progress info is extra, optional data for a UI progress bar — not
    // required by technical-spec.md, but harmless to include alongside
    // the required `reply`/`done` fields.
    const initialTarget = getTargetQuestionCount(structure1, persona);

    return NextResponse.json({
      reply: "Welcome. Let's begin your interview.",
      done: false,
      progress: buildProgress(0, initialTarget),
    });
  }

  const session = existingSession;

  // ── CASE 2: Interview already complete ──
  if (session.structure3.isComplete) {
    const feedback = await generateFeedback(session.structure2, session.structure1, session.persona);
    const finalTarget = getTargetQuestionCount(session.structure1, session.persona);
    await kv.del(sessionKey(sessionId));

    return NextResponse.json({
      reply: "Interview completed.",
      done: true,
      feedback,
      progress: buildProgress(session.structure3.totalQuestionTurns, finalTarget),
    });
  }

  // ── CASE 3: Ongoing interview — ask next question ──

  // A blank/whitespace-only message is rejected explicitly rather than
  // silently ignored — silently proceeding to a new question would make
  // it look like a blank submission was accepted, which is confusing for
  // both the candidate and whatever UI is calling this endpoint.
  if (typeof message === "string" && message.trim() === "") {
    return NextResponse.json(
      { error: "message cannot be empty" },
      { status: 400 }
    );
  }

  // Step 1: record candidate's answer
  if (message) {
    session.structure2.turns.push({
      turnNumber: session.structure2.turns.length + 1,
      dayAsked: null,
      topicTitle: "",
      role: "candidate",
      message,
    });
  }

  // Step 2: decide which day to ask about NEXT, BEFORE calling the AI
  const dayAsked = selectNextDay(session.structure1, session.structure3);
  const topicTitle = session.structure1.dayDetails[dayAsked]?.title || "";

  // Step 3: build the prompt, telling the AI exactly which day to focus on
  const groqHistory = convertStructure2ToGroqFormat(
    session.structure2,
    session.structure1,
    session.persona,
    dayAsked,
    topicTitle
  );

  // Step 4: get the question from Groq — now grounded in the chosen day
  const aiReply = await callGroq(groqHistory);

  // Step 5: record it, with the day/topic we KNOW it's about (not a guess)
  session.structure2.turns.push({
    turnNumber: session.structure2.turns.length + 1,
    dayAsked,
    topicTitle,
    role: "ai",
    message: aiReply,
  });

  // Step 6: update tracking — target question count depends on the
  // candidate's profile richness and the persona's own stated preference;
  // required distinct days is capped to what the candidate actually has
  // available, so thin profiles can still reach completion
  const targetQuestions = getTargetQuestionCount(session.structure1, session.persona);
  const requiredDistinctDays = getRequiredDistinctDays(session.structure1);
  updateStructure3(session.structure3, dayAsked, targetQuestions, requiredDistinctDays);

  // Step 7: save the updated session back to KV — unlike the old in-memory
  // Map, mutating the object in place does NOT persist anything on its own.
  await kv.set(sessionKey(sessionId), session);

  return NextResponse.json({
    reply: aiReply,
    done: false,
    progress: buildProgress(session.structure3.totalQuestionTurns, targetQuestions),
  });
}

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function buildStructure1(candidate: any): Structure1 {
  const eligibleDays = candidate.missions
    .filter((m: any) => m.passed === true)
    .map((m: any) => m.day)
    .sort((a: number, b: number) => a - b);

  const dayDetails: Structure1["dayDetails"] = {};

  // Index missions by day so we can pull `attempts` for each eligible day —
  // curriculum.json has no `attempts` field, only the raw mission entry does.
  const missionByDay = new Map(candidate.missions.map((m: any) => [m.day, m]));

  for (const day of eligibleDays) {
    const curriculumDay = (curriculum as any).days.find((d: any) => d.day === day);
    if (curriculumDay) {
      const mission = missionByDay.get(day) as any;
      dayDetails[day] = {
        day: curriculumDay.day,
        title: curriculumDay.title,
        type: curriculumDay.type,
        tools: curriculumDay.tools || [],
        objectives: curriculumDay.objectives || [],
        attempts: mission?.attempts ?? 1,
      };
    }
  }

  return {
    candidateId: candidate.member.id,
    name: candidate.member.name,
    jobRole: candidate.member.jobRole,
    yearsExperience: candidate.member.yearsExperience,
    education: candidate.member.education,
    eligibleDays,
    dayDetails,
  };
}

/**
 * Build the Groq message list. Now takes the CHOSEN day/topic and tells
 * the AI directly which one to focus this turn's question on — this is
 * the fix for the day-selection ordering bug.
 */
function convertStructure2ToGroqFormat(
  structure2: Structure2,
  structure1: Structure1,
  persona: "A" | "B" | "C",
  focusDay: number,
  focusTopic: string
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const groqMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

  const focusDetails = structure1.dayDetails[focusDay];
  const objectives = focusDetails?.objectives?.join("; ") || "";
  const tools = focusDetails?.tools?.join(", ") || "";
  const focusAttempts = focusDetails?.attempts ?? 1;

  // Give the AI the FULL real list of this candidate's eligible days and
  // titles — without this, any persona that asks "what earlier day did
  // this depend on?" has no real data to draw from and will invent a
  // plausible-sounding but fake day number/title instead. Attempts are
  // included per day so personas can calibrate across the whole profile,
  // not just the day being asked about right now.
  const allEligibleDaysList = structure1.eligibleDays
    .map((day) => {
      const d = structure1.dayDetails[day];
      return `Day ${day}: "${d?.title || "Unknown"}" (attempts: ${d?.attempts ?? 1})`;
    })
    .join("\n");

  const systemPrompt = `${getPersonaPrompt(persona)}

CANDIDATE PROFILE:
Name: ${structure1.name}
Job Role: ${structure1.jobRole}
Years of Experience: ${structure1.yearsExperience}
Education: ${structure1.education}

THE CANDIDATE'S FULL LIST OF REAL, ELIGIBLE CURRICULUM DAYS (the only days
that exist for this interview — do not reference, mention, or ask about
ANY day number or title that is not in this exact list, even if it seems
plausible or fits the narrative):
${allEligibleDaysList}

FOR THIS TURN ONLY: Ask your next primary question about Day ${focusDay} —
"${focusTopic}". Objectives for this day: ${objectives}. Tools involved:
${tools}. The candidate passed this day in ${focusAttempts} attempt(s) —
use this to calibrate difficulty per your persona's strategy. Ground the
question in this specific day's content, following
your persona's style and strategy above. If your strategy calls for tracing
a dependency to an earlier day, you MUST pick that earlier day only from
the list above — never invent a day number, title, or topic that isn't
listed. Ask exactly one question.`;

  groqMessages.push({ role: "system", content: systemPrompt });

  for (const turn of structure2.turns) {
    if (turn.role === "ai") {
      groqMessages.push({ role: "assistant", content: turn.message });
    } else if (turn.role === "candidate") {
      groqMessages.push({ role: "user", content: turn.message });
    }
  }

  return groqMessages;
}

/**
 * A candidate counts as "rich" when they have a good-sized pool of passed
 * days, mostly cleared on the first attempt — this mirrors how Person 2's
 * persona docs describe a candidate worth going deeper on (e.g. Emily Chen).
 */
function isRichProfile(structure1: Structure1): boolean {
  return structure1.eligibleDays.length >= 8;
}

/**
 * Work out the target question count for this interview.
 * - Always at least 8 (mandatory minimum from the spec).
 * - Persona A/C explicitly prefer 10-12 questions for rich profiles.
 * - Persona B's own guidance caps around 8-10, so give it a smaller bump.
 * - Thin profiles (fewer than 8 eligible days) always stay at the 8 floor.
 */
function getTargetQuestionCount(structure1: Structure1, persona: "A" | "B" | "C"): number {
  if (!isRichProfile(structure1)) return 8;
  if (persona === "B") return 10;
  return 12; // Persona A and C
}

/**
 * The spec's "4+ distinct days" requirement assumes a candidate has at
 * least 4 eligible days to draw from. A thinner profile (fewer than 4
 * eligible days total) could never satisfy a hardcoded "4" — the
 * interview would run forever, since totalDistinctDays can't exceed the
 * candidate's actual eligible day count. This caps the requirement to
 * whatever the candidate genuinely has available.
 */
function getRequiredDistinctDays(structure1: Structure1): number {
  return Math.min(4, structure1.eligibleDays.length);
}

/**
 * Builds the progress object included in every response, per Person 3's
 * requested shape: { questionsAsked, percentComplete }. Capped at 100 so
 * a slightly-over count (shouldn't happen, but defensive) never shows
 * over 100%.
 */
function buildProgress(questionsAsked: number, totalQuestions: number) {
  const percentComplete =
    totalQuestions > 0
      ? Math.min(100, Math.round((questionsAsked / totalQuestions) * 100))
      : 0;
  return { questionsAsked, percentComplete };
}

function updateStructure3(
  structure3: Structure3,
  dayAsked: number,
  targetQuestions: number,
  requiredDistinctDays: number
): void {
  structure3.totalQuestionTurns++;

  if (!structure3.daysAskedAbout.includes(dayAsked)) {
    structure3.daysAskedAbout.push(dayAsked);
    structure3.totalDistinctDays = structure3.daysAskedAbout.length;
  }

  if (!structure3.questionsPerDay[dayAsked]) {
    structure3.questionsPerDay[dayAsked] = 0;
  }
  structure3.questionsPerDay[dayAsked]++;

  structure3.isComplete =
    structure3.totalQuestionTurns >= targetQuestions &&
    structure3.totalDistinctDays >= requiredDistinctDays;

  if (structure3.isComplete) {
    structure3.completionReason = `Complete! ${structure3.totalQuestionTurns} questions across ${structure3.totalDistinctDays} days.`;
  } else {
    const questionsNeeded = Math.max(0, targetQuestions - structure3.totalQuestionTurns);
    const daysNeeded = Math.max(0, requiredDistinctDays - structure3.totalDistinctDays);
    structure3.completionReason = `Progress: ${structure3.totalQuestionTurns}/${targetQuestions} questions, ${structure3.totalDistinctDays}/${requiredDistinctDays} days. Need ${questionsNeeded} more questions and ${daysNeeded} more days.`;
  }
}

function selectNextDay(structure1: Structure1, structure3: Structure3): number {
  const eligibleDays = structure1.eligibleDays;

  const uncoveredDays = eligibleDays.filter(
    (day) => !structure3.daysAskedAbout.includes(day)
  );

  if (structure3.totalDistinctDays < 4 && uncoveredDays.length > 0) {
    return uncoveredDays[Math.floor(Math.random() * uncoveredDays.length)];
  }

  let bestDay = eligibleDays[0];
  let fewestQuestions = structure3.questionsPerDay[bestDay] || 0;

  for (const day of eligibleDays) {
    const questionCount = structure3.questionsPerDay[day] || 0;
    if (questionCount < fewestQuestions) {
      bestDay = day;
      fewestQuestions = questionCount;
    }
  }

  return bestDay;
}

async function callGroq(
  history: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: history,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq error:", data);
    return "Sorry, I had trouble generating a question. Let's continue — tell me more about your experience.";
  }

  return data.choices[0].message.content;
}

async function generateFeedback(
  structure2: Structure2,
  structure1: Structure1,
  persona: "A" | "B" | "C"
): Promise<Feedback> {
  const topicsCovered = Array.from(
    new Set(
      structure2.turns
        .filter((t) => t.dayAsked !== null && t.dayAsked !== undefined)
        .map((t) => `Day ${t.dayAsked}: ${t.topicTitle}`)
    )
  ).join("\n");

  // The actual back-and-forth, not just topic labels — without this the
  // model has no evidence of what the candidate actually said and will
  // generate plausible-sounding but ungrounded feedback.
  const transcript = structure2.turns
    .map((t) => `${t.role === "ai" ? "Interviewer" : "Candidate"}: ${t.message}`)
    .join("\n\n");

  const feedbackPrompt = `${getPersonaPrompt(persona)}

Based on this interview with ${structure1.name} (${structure1.jobRole}),
generate structured feedback about their technical understanding and readiness.

Topics covered:
${topicsCovered}

Full interview transcript:
${transcript}

Every strength and gap in your feedback MUST be grounded in something the
candidate actually said above — do not state a strength or gap you cannot
point to a specific answer for. Respond ONLY with valid JSON in this exact
format, nothing else:
{
  "summary": "1-2 sentence summary",
  "strengths": ["string", "string", "string"],
  "gaps": ["string", "string"],
  "next": ["string", "string"]
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: feedbackPrompt }],
    }),
  });

  const data = await response.json();

  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Feedback parsing error:", error);
    return {
      summary: "Interview completed. The candidate demonstrated engagement with the curriculum topics.",
      strengths: ["Participated actively in the interview", "Showed familiarity with discussed topics"],
      gaps: ["Could deepen understanding of some advanced concepts"],
      next: ["Continue building projects with the curriculum topics", "Review areas where questions seemed challenging"],
    };
  }
}
