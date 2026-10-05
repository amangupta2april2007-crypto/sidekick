const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 10000;
const ollama = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const model = process.env.GEMMA_MODEL || "gemma3:4b";

app.get("/health", (_request, response) => response.json({ ok: true, agent: "sidekick-gemma", model }));
app.post("/coach", async (request, response) => {
  const note = typeof request.body?.note === "string" ? request.body.note : "Make this week feel easier.";
  const prompt = `You are Sidekick, an open-source Gemma wellness planning agent for a 56-year-old father. Create a kind, familiar, practical suggestion in under 120 words. Never diagnose or prescribe. Mention checking with a clinician for pain, medication, or conditions. User note: ${note}`;
  try {
    const result = await fetch(`${ollama}/api/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, prompt, stream: false }), signal: AbortSignal.timeout(20000) });
    if (!result.ok) throw new Error(`Ollama returned ${result.status}`);
    const data = await result.json();
    return response.json({ reply: data.response || "Keep the next step small and kind.", provider: "gemma", model });
  } catch (error) {
    return response.status(503).json({ error: "Gemma agent unavailable", detail: error.message });
  }
});
app.listen(port, () => console.log(`Sidekick Gemma agent listening on ${port}`));
