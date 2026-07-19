import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/frontend/store/authStore";
import { useFarmStore } from "@/frontend/store/farmStore";
import { useWeather, useGeolocation } from "@/frontend/features/weather/hooks/useWeather";
import { weatherCodeToLabel } from "@/frontend/features/weather/api/openmeteo";
import { fetchSoilData, fetchMarketPrices } from "@/backend/api/serverFns";
import { checkEligibility } from "@/frontend/features/schemes/eligibility";

// Assembles everything the app knows about this farmer into one context string
// for the AI. Query keys match SoilPage / MarketPage so their cache is shared.
export function useFarmContext(): string {
  const user = useAuthStore((s) => s.user);
  const { cropEntries, soilType, setupComplete } = useFarmStore();
  const { data: weather } = useWeather();
  const { coords } = useGeolocation();

  const { data: soil } = useQuery({
    queryKey: ["soil", coords?.lat, coords?.lon],
    queryFn: () => fetchSoilData({ data: { lat: coords!.lat, lon: coords!.lon } }),
    enabled: Boolean(coords),
    staleTime: 1000 * 60 * 60,
  });
  const { data: market } = useQuery({
    queryKey: ["market-prices", user?.crops ?? []],
    queryFn: () =>
      fetchMarketPrices({
        data: {
          state: "Sikkim",
          commodity: "",
          crops: user?.crops ?? [],
          language: user?.language ?? "en",
        },
      }),
    staleTime: 1000 * 60 * 30,
  });

  return (
    [
      user && `Farmer: ${user.name}`,
      user?.village && `Village: ${user.village}`,
      user?.farmSize && `Farm size: ${user.farmSize} acres`,
      user?.crops?.length && `Registered crops: ${user.crops.join(", ")}`,
      cropEntries.length > 0 &&
        `Current crop stages: ${cropEntries
          .map((c) => `${c.name} (${c.stage}, ${c.progress}% to harvest)`)
          .join("; ")}`,
      soilType && `Soil type: ${soilType}`,
      weather?.current &&
        `Today's weather: ${weatherCodeToLabel(weather.current.weather_code)}, ${Math.round(
          weather.current.temperature_2m,
        )}°C, humidity ${weather.current.relative_humidity_2m}%, rain chance ${
          weather.current.precipitation_probability
        }%`,
      weather?.daily &&
        `Next days rain chance: ${weather.daily.precipitation_probability_max
          .slice(0, 3)
          .map((p) => `${p}%`)
          .join(", ")}`,
      soil &&
        `Soil test (satellite, this location): pH ${soil.ph?.toFixed(1)}, texture ${soil.texture}, nitrogen ${soil.nitrogen?.toFixed(1)} g/kg, organic carbon ${soil.organicCarbon?.toFixed(1)} g/kg, health score ${soil.healthScore}/100`,
      market?.records?.length &&
        `Mandi prices ₹/quintal (${market.source === "live" ? "live Agmarknet" : "AI estimate"}): ${(
          market.records as Array<{ commodity?: string; modalPrice?: number; trend?: string }>
        )
          .slice(0, 6)
          .map(
            (r) => `${r.commodity} ${r.modalPrice ?? "?"}${r.trend ? ` (trend ${r.trend})` : ""}`,
          )
          .join("; ")}`,
      user &&
        `Govt schemes this farmer qualifies for: ${
          checkEligibility({
            landAcres: Number(user.farmSize) || 0,
            crop: user.crops?.[0] ?? "",
            state: user.village ?? "",
          })
            .filter((s) => s.eligible)
            .map((s) => `${s.name} (${s.benefit})`)
            .join("; ") || "none confirmed yet"
        }`,
      !setupComplete && "Note: farm setup incomplete",
    ]
      .filter(Boolean)
      .join(". ") || "General farming context, Northeast India / Nepal"
  );
}
