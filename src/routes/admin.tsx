import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/pages/admin/AdminPage";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Sanjaya" }] }),
  component: AdminPage,
});
