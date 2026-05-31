import { createFileRoute } from "@tanstack/react-router";
import { WeatherPage } from "@/features/weather/pages/WeatherPage";

export const Route = createFileRoute("/weather")({
  head: () => ({ meta: [{ title: "Weather · Sanjaya" }] }),
  component: WeatherPage,
});
