import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/disease-detection")({
  head: () => ({ meta: [{ title: "Crop Disease Detection · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="Crop Disease Detection"
      description="Snap a photo of an affected leaf or rhizome. Sanjaya identifies the disease and tells you exactly what to do — specialized for Cardamom & Ginger."
      bullets={[
        "Cardamom: Capsule rot, Rhizome rot, Leaf blotch, Katte virus, Clump rot + more",
        "Ginger: Soft rot, Bacterial wilt, Rhizome rot, Leaf spot, Yellow disease + more",
        "Confidence score, severity level, organic + chemical treatment options",
        "Disease history per farm + regional outbreak alerts",
      ]}
    />
  ),
});
