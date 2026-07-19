import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/frontend/pages/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanjaya — AI Farming Assistant for Every Village" },
      {
        name: "description",
        content:
          "Real-time weather, market prices, crop disease detection, and AI-powered farming advice in your language. Built for kiosks and mobile.",
      },
    ],
  }),
  component: LandingPage,
});
