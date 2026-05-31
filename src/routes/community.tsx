import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="Community & Learning Hub"
      description="Talk to other farmers, ask experts, learn from seasonal guides and video tutorials."
      bullets={[
        "Discussion forums by crop and region",
        "Expert Q&A with agricultural officers",
        "Video tutorials in your language",
        "Seasonal crop guides and best practices",
      ]}
    />
  ),
});
