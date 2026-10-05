import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";

const fallback = "Start with one small change: keep meals familiar, walk at an easy pace, and leave room for rest. A plan should support Dad's day, not take it over.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const prompt = `You are Sidekick, a kind open-source wellness planning agent powered by Gemma. Create a practical, culturally familiar daily plan for a 56-year-old father. Never diagnose, prescribe, or make claims about disease. Ask him to check with a clinician for pain, medication, or medical conditions. Keep the answer under 120 words. User note: ${note || "Make this week feel easier."}`;
  let reply = fallback;
  let provider = "demo";

  const renderAgent = process.env.RENDER_AGENT_URL?.replace(/\/$/, "");
  const endpoint = renderAgent ? `${renderAgent}/coach` : process.env.GEMMA_API_URL || (process.env.OLLAMA_URL ? `${process.env.OLLAMA_URL.replace(/\/$/, "")}/api/generate` : "http://127.0.0.1:11434/api/generate");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.GEMMA_API_KEY ? { Authorization: `Bearer ${process.env.GEMMA_API_KEY}` } : {}) },
      body: renderAgent ? JSON.stringify({ note }) : JSON.stringify({ model: process.env.GEMMA_MODEL || "gemma3:4b", prompt, stream: false }),
      signal: AbortSignal.timeout(12000),
    });
    if (response.ok) {
      const data = await response.json();
      reply = data.reply || data.response || data.output || data.text || reply;
      provider = data.provider || "gemma";
    }
  } catch { /* Demo mode keeps the Vercel preview useful without a hosted model. */ }

  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      await client.db(process.env.MONGODB_DB || "sidekick").collection("coach_notes").insertOne({ note, reply, provider, createdAt: new Date() });
    } catch { /* Persistence is optional for the preview experience. */ }
  }
  return NextResponse.json({ reply, provider });
}
