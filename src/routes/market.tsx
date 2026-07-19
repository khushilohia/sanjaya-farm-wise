import { createFileRoute } from "@tanstack/react-router";
import { MarketPage } from "@/frontend/features/market-intelligence/pages/MarketPage";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [{ title: "Market & Buyers · Sanjaya" }] }),
  component: MarketPage,
});
