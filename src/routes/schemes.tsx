import { createFileRoute } from "@tanstack/react-router";
import { SchemesPage } from "@/features/schemes/pages/SchemesPage";

export const Route = createFileRoute("/schemes")({
  head: () => ({ meta: [{ title: "Government Schemes · Sanjaya" }] }),
  component: SchemesPage,
});
