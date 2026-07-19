import { createFileRoute } from "@tanstack/react-router";
import { AlertsPage } from "@/frontend/features/alerts/pages/AlertsPage";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts · Sanjaya" }] }),
  component: AlertsPage,
});
