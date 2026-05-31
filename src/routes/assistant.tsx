import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="AI Farming Assistant"
      description="Ask anything by voice or text. Sanjaya enriches every question with your location, weather, soil, crop history, and market data before answering."
      bullets={[
        "Natural language queries in Hindi, Nepali, Bengali, English & local languages",
        "Voice in / voice out — speak naturally, get spoken answers",
        "Context-aware: knows your farm size, crop stage, soil profile, history",
        "Powered by Lovable AI Gateway (Gemini) — enabled in Phase 2",
      ]}
    />
  ),
});
