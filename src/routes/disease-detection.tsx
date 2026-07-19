import { createFileRoute } from "@tanstack/react-router";
import { DiseaseDetectionPage } from "@/frontend/features/disease-detection/pages/DiseaseDetectionPage";

export const Route = createFileRoute("/disease-detection")({
  head: () => ({ meta: [{ title: "Crop Disease Detection · Sanjaya" }] }),
  component: DiseaseDetectionPage,
});
