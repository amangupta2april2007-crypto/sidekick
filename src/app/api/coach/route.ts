import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";

const fallback =
  "Start with one small change: keep meals familiar, walk at an easy pace, and leave room for rest. A plan should support Dad's day, not take it over.";

const APP_CONTEXT = `
You are Sidekick, a kind wellness coach powered by Gemma for a 56-year-old father.
Give one practical, gentle suggestion. Prefer familiar home meals, short walks, hydration,
and chair-friendly movement. Be warm, concise, and under 60 words. Never diagnose,
prescribe, or make disease claims. Mention checking with a clinician for pain, medication,
or existing conditions.
`;

async function findLocalOllamaModel(ollamaBase: string, preferredModel: string): Promise<string> {
  try {
    const res = await fetch(`${ollamaBase}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      const models: Array<{ name: string; model: string }> = data.models || [];
      if (models.length > 0) {
        // 1. Look for exact match (case-insensitive)
        const exact = models.find(
          (m) =>
            m.name.toLowerCase() === preferredModel.toLowerCase() ||
            m.model.toLowerCase() === preferredModel.toLowerCase()
        );
        if (exact) return exact.name;

        // 2. Look for any gemma model
        const gemma = models.find(
          (m) =>
            m.name.toLowerCase().includes("gemma") ||
            m.model.toLowerCase().includes("gemma")
        );
        if (gemma) return gemma.name;

        // 3. Fallback to the first available model
        return models[0].name;
      }
    }
  } catch {
    // Ollama not reachable via tags
  }
  return preferredModel;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const planSummary = Array.isArray(body.plan)
    ? body.plan.map((p: { title?: string; done?: boolean }) => `${p.title}: ${p.done ? "Done" : "Pending"}`).join(", ")
    : "";

  const prompt = `${APP_CONTEXT}

Current user request / question from Dad or caregiver:
"${note || "Give me a practical, gentle tip to make Dad's week easier and healthier."}"
${planSummary ? `Today's current tasks status: [${planSummary}]` : ""}

Please provide a caring, actionable wellness response for Dad:`;

  let reply = fallback;
  let provider = "demo";
  let activeModel = process.env.GEMMA_MODEL || "gemma3:4B";

  const localOllamaBase = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  const remoteAgent = process.env.RENDER_AGENT_URL?.replace(/\/$/, "");
  const gemmaApiUrl = process.env.GEMMA_API_URL?.replace(/\/$/, "");

  let success = false;

  // A deployed app cannot reach Ollama through localhost, so use local inference only
  // when no hosted agent or cloud endpoint has been configured.
  if (!remoteAgent && !gemmaApiUrl) {
    try {
      const detectedModel = await findLocalOllamaModel(localOllamaBase, activeModel);
      activeModel = detectedModel;

      const localResponse = await fetch(`${localOllamaBase}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: detectedModel,
          prompt,
          stream: false,
          keep_alive: "10m",
          options: {
            num_ctx: 1024,
            num_predict: 48,
            temperature: 0.3,
          },
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (localResponse.ok) {
        const data = await localResponse.json();
        if (data.response) {
          reply = data.response.trim();
          provider = "local-gemma";
          success = true;
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`Local Ollama inference failed: ${errorMsg}. Trying fallback endpoints...`);
    }
  }

  // 2. If local Ollama wasn't available, try remote agent or cloud GEMMA_API_URL
  if (!success && (remoteAgent || gemmaApiUrl)) {
    try {
      const endpoint = remoteAgent ? `${remoteAgent}/coach` : `${gemmaApiUrl}/api/generate`;
      const isRemoteAgent = Boolean(remoteAgent);

      const remoteResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.GEMMA_API_KEY ? { Authorization: `Bearer ${process.env.GEMMA_API_KEY}` } : {}),
        },
        body: isRemoteAgent
          ? JSON.stringify({ note })
          : JSON.stringify({
              model: activeModel,
              prompt,
              stream: false,
              options: { num_ctx: 1024, num_predict: 48, temperature: 0.3 },
            }),
        signal: AbortSignal.timeout(20000),
      });

      if (remoteResponse.ok) {
        const data = await remoteResponse.json();
        reply = data.reply || data.response || data.output || data.text || reply;
        provider = remoteAgent ? "render-gemma" : "cloud-gemma";
        success = true;
      }
    } catch {
      // Remote fallback also unavailable
    }
  }

  // Optional MongoDB persistence for coach queries
  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      await client
        .db(process.env.MONGODB_DB || "sidekick")
        .collection("coach_notes")
        .insertOne({
          note,
          reply,
          provider,
          model: activeModel,
          createdAt: new Date(),
        });
    } catch {
      /* Persistence is optional */
    }
  }

  return NextResponse.json({
    reply,
    provider,
    model: activeModel,
  });
}
