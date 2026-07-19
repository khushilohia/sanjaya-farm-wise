import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/frontend/pages/dashboard/DashboardPage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Sanjaya" }] }),
  component: DashboardPage,
});
