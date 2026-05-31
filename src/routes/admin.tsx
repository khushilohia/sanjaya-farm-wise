import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="Agricultural Officer Dashboard"
      description="Regional analytics, disease heatmaps, scheme distribution, and AI usage insights — for officers and government partners."
      bullets={[
        "Farmer management & regional analytics",
        "Disease heatmap with village-wise outbreak monitoring",
        "Early warning system for regional disease spikes",
        "Scheme distribution tracking & crop production forecasting",
      ]}
    />
  ),
});
