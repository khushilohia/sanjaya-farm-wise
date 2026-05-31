import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/schemes")({
  head: () => ({ meta: [{ title: "Government Schemes · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="Government Scheme Assistant"
      description="AI matches you to schemes based on your farm, location, and category. Eligibility, documents, and application tracking — all in one place."
      bullets={[
        "Auto-recommended schemes based on your profile",
        "Eligibility checker with clear yes/no",
        "Document checklist for each scheme",
        "Application status tracking",
      ]}
    />
  ),
});
