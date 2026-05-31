import { createFileRoute } from "@tanstack/react-router";
import { CommunityPage } from "@/features/community/pages/CommunityPage";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community · Sanjaya" }] }),
  component: CommunityPage,
});
