import { createFileRoute } from "@tanstack/react-router";
import { AssistantPage } from "@/features/ai-assistant/pages/AssistantPage";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant · Sanjaya" }] }),
  component: AssistantPage,
});
