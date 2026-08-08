import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1. Get the message the user sent us
  const body = await request.json();
  const userMessage = body.message || "Hello";

  // 2. Call Groq's API
  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a technical interviewer asking AI engineering questions.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  });

  // 3. Get Groq's reply out of the response
  const data = await groqResponse.json();

  // 4. Handle errors from Groq gracefully
  if (!groqResponse.ok) {
    return NextResponse.json(
      { error: "Groq API error", details: data },
      { status: 500 }
    );
  }

  const aiReply = data.choices[0].message.content;

  // 5. Send it back to whoever called our endpoint
  return NextResponse.json({
    reply: aiReply,
  });
}