import { NextResponse } from "next/server";

// This keeps track of every ongoing interview, in memory.
// Key = sessionId, Value = the conversation so far + how many questions asked
type Session = {
  history: { role: "system" | "user" | "assistant"; content: string }[];
  questionCount: number;
};

const sessions = new Map<string, Session>();

const MAX_QUESTIONS = 5; // how many questions before we wrap up the interview

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, candidate, message } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  // ── CASE 1: New interview (we haven't seen this sessionId before) ──
  if (!sessions.has(sessionId)) {
    const systemPrompt = `You are a technical interviewer for an AI engineering role.
You are interviewing this candidate: ${JSON.stringify(candidate)}.
Ask one technical question at a time based on their experience and completed curriculum modules.
Keep questions focused and specific. Do not ask more than one question per turn.`;

    sessions.set(sessionId, {
      history: [{ role: "system", content: systemPrompt }],
      questionCount: 0,
    });

    return NextResponse.json({
      reply: "Welcome. Let's begin your interview.",
      done: false,
    });
  }

  // ── From here on, this is an ongoing interview ──
  const session = sessions.get(sessionId)!;

  // Add the candidate's latest answer to the conversation
  if (message) {
    session.history.push({ role: "user", content: message });
  }

  session.questionCount++;

  // ── CASE 2: We've asked enough questions — wrap up with feedback ──
  if (session.questionCount > MAX_QUESTIONS) {
    const feedback = await generateFeedback(session.history);
    sessions.delete(sessionId); // clean up, interview is over

    return NextResponse.json({
      reply: "Interview completed.",
      done: true,
      feedback,
    });
  }

  // ── CASE 3: Ask the next question ──
  const aiReply = await callGroq(session.history);
  session.history.push({ role: "assistant", content: aiReply });

  return NextResponse.json({
    reply: aiReply,
    done: false,
  });
}

async function callGroq(history: Session["history"]): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
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

async function generateFeedback(history: Session["history"]) {
  const feedbackPrompt = `Based on this interview conversation, generate structured feedback.
Respond ONLY with valid JSON in this exact format, nothing else:
{
  "summary": "a short paragraph summarizing performance",
  "strengths": ["point 1", "point 2"],
  "gaps": ["point 1", "point 2"],
  "next": ["point 1", "point 2"]
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [...history, { role: "user", content: feedbackPrompt }],
    }),
  });

  const data = await response.json();

  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    // If the AI didn't return clean JSON, we still return something usable
    return {
      summary: "Interview completed. Detailed feedback generation had an issue.",
      strengths: [],
      gaps: [],
      next: [],
    };
  }
}