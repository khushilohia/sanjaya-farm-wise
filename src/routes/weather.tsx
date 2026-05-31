import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/weather")({
  head: () => ({ meta: [{ title: "Weather · Sanjaya" }] }),
  component: () => (
    <ComingSoon
      title="Weather Intelligence"
      description="7-day forecasts, rain prediction, heat & frost alerts — tuned to your village and crops."
      bullets={[
        "Real-time temperature, humidity, wind, rain probability",
        "Storm, heatwave, frost early warnings",
        "Crop-specific advice when conditions change",
        "SMS + push alerts for critical events",
      ]}
    />
  ),
});
