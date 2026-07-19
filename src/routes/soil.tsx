import { createFileRoute } from "@tanstack/react-router";
import { SoilPage } from "@/frontend/features/soil-health/pages/SoilPage";

export const Route = createFileRoute("/soil")({
  head: () => ({ meta: [{ title: "Soil & Farm Analytics · Sanjaya" }] }),
  component: SoilPage,
});
