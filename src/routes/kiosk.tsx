import { createFileRoute } from "@tanstack/react-router";
import { KioskPage } from "@/pages/kiosk/KioskPage";

export const Route = createFileRoute("/kiosk")({
  head: () => ({ meta: [{ title: "Kiosk · Sanjaya" }] }),
  component: KioskPage,
});
