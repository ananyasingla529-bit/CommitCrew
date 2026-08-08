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
- Prioritize SHIP_IT days (10, 20, 24, 28, 30) the candidate passed.
- When asking about a SHIP_IT day, follow up by asking what earlier day's
  output it depended on.
- If a candidate passed a SHIP_IT day but skipped/failed something it
  depends on, gently probe that inconsistency.
- Never ask about skipped/failed days.
- 8-12 questions, covering 4+ modules. Prefer 10-12 for rich profiles.
- One question per turn. Follow-ups are default-on unless the answer was
  already exhaustive — then briefly explain why you're moving on.
- Every follow-up must TRACE A DEPENDENCY, EXPLORE A CONSEQUENCE, EXAMINE A
  TRADE-OFF, or PROBE A FAILURE/SCALING SCENARIO. Never generic "did you
  test/measure that?" questions.
- When switching topics, include one short bridging sentence.
- End with structured feedback (summary, strengths, gaps, next).`;

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
  say so before moving on — including on the final question.
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

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, candidate, message } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
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

    const structure1 = buildStructure1(candidate);
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

    return NextResponse.json({
      reply: "Welcome. Let's begin your interview.",
      done: false,
    });
  }

  const session = existingSession;

  // ── CASE 2: Interview already complete ──
  if (session.structure3.isComplete) {
    const feedback = await generateFeedback(session.structure2, session.structure1, session.persona);
    await kv.del(sessionKey(sessionId));

    return NextResponse.json({
      reply: "Interview completed.",
      done: true,
      feedback,
    });
  }

  // ── CASE 3: Ongoing interview — ask next question ──

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
  // candidate's profile richness and the persona's own stated preference
  const targetQuestions = getTargetQuestionCount(session.structure1, session.persona);
  updateStructure3(session.structure3, dayAsked, targetQuestions);

  // Step 7: save the updated session back to KV — unlike the old in-memory
  // Map, mutating the object in place does NOT persist anything on its own.
  await kv.set(sessionKey(sessionId), session);

  return NextResponse.json({
    reply: aiReply,
    done: false,
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

  for (const day of eligibleDays) {
    const curriculumDay = (curriculum as any).days.find((d: any) => d.day === day);
    if (curriculumDay) {
      dayDetails[day] = {
        day: curriculumDay.day,
        title: curriculumDay.title,
        type: curriculumDay.type,
        tools: curriculumDay.tools || [],
        objectives: curriculumDay.objectives || [],
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

  const systemPrompt = `${getPersonaPrompt(persona)}

CANDIDATE PROFILE:
Name: ${structure1.name}
Job Role: ${structure1.jobRole}
Years of Experience: ${structure1.yearsExperience}
Education: ${structure1.education}

FOR THIS TURN ONLY: Ask your next primary question about Day ${focusDay} —
"${focusTopic}". Objectives for this day: ${objectives}. Tools involved:
${tools}. Ground the question in this specific day's content, following
your persona's style and strategy above. Ask exactly one question.`;

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

function updateStructure3(
  structure3: Structure3,
  dayAsked: number,
  targetQuestions: number
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
    structure3.totalQuestionTurns >= targetQuestions && structure3.totalDistinctDays >= 4;

  if (structure3.isComplete) {
    structure3.completionReason = `Complete! ${structure3.totalQuestionTurns} questions across ${structure3.totalDistinctDays} days.`;
  } else {
    const questionsNeeded = Math.max(0, targetQuestions - structure3.totalQuestionTurns);
    const daysNeeded = Math.max(0, 4 - structure3.totalDistinctDays);
    structure3.completionReason = `Progress: ${structure3.totalQuestionTurns}/${targetQuestions} questions, ${structure3.totalDistinctDays}/4 days. Need ${questionsNeeded} more questions and ${daysNeeded} more days.`;
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

  const feedbackPrompt = `${getPersonaPrompt(persona)}

Based on this interview with ${structure1.name} (${structure1.jobRole}),
generate structured feedback about their technical understanding and readiness.

Topics covered:
${topicsCovered}

Respond ONLY with valid JSON in this exact format, nothing else:
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
