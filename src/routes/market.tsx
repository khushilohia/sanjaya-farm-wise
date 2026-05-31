import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [{ title: "Market & Buyers · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="Market Intelligence & Buyer Connect"
      description="Live mandi prices, demand forecasts, and a marketplace to connect directly with buyers."
      bullets={[
        "Nearby mandi, state and national prices",
        "AI demand prediction — when to sell, what to plant",
        "List your produce, receive buyer offers, negotiate, schedule delivery",
        "Price alerts for your crops",
      ]}
    />
  ),
});
