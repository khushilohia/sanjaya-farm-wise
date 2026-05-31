import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/soil")({
  head: () => ({ meta: [{ title: "Soil & Farm Analytics · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="Soil & Farm Analytics"
      description="pH, NPK, moisture, organic carbon — your soil health score and how to improve it."
      bullets={[
        "Soil health score with simple visuals",
        "Crop suitability based on your soil profile",
        "Nutrient deficiency detection",
        "Personalized improvement plan",
      ]}
    />
  ),
});
