# Sidekick

Sidekick is a calm daily planner for a father who is also your friend. It brings meals, gentle movement, hydration, and small daily wins into one place.

## Architecture

- Vercel: Next.js dashboard and `/api/coach` proxy.
- Render: `agent-service`, a small open-source agent gateway.
- Gemma: served by Ollama using `gemma3:4b`.
- MongoDB Atlas: optional persistence for coach notes in `coach_notes`.
- GitHub: source, pull requests, Actions, and deployment workflow.

## Run locally

```bash
npm install
copy .env.example .env.local
ollama run gemma3:4b
npm run dev
```

The coach calls `POST /api/coach`. Without a reachable model it returns a clearly labeled demo response so the UI remains usable.

## Deploy

1. Push the repository to GitHub.
2. In Render, create the Blueprint from `render.yaml`. Point `OLLAMA_URL` at your Ollama/Gemma host and confirm `/health` works.
3. Import the same repository into Vercel.
4. Add `MONGODB_URI`, `MONGODB_DB`, `RENDER_AGENT_URL`, and `GEMMA_MODEL` in Vercel.
5. Deploy.

For real hosted inference, use a Render-compatible Ollama host or private GPU provider and set that URL as the agent service's `OLLAMA_URL`. Do not put model credentials in client-side code.

This is a planning companion, not medical advice. Dad should check with a clinician before changing exercise, diet, or routines related to a health condition or medication.
