import { CloudRain, Bug, ThermometerSun, Snowflake, Wind } from "lucide-react";
import type { WeatherData } from "@/frontend/features/weather/api/openmeteo";

export type Severity = "Critical" | "Warning" | "Info";

export type DerivedAlert = {
  id: string;
  icon: typeof CloudRain;
  title: string;
  detail: string;
  severity: Severity;
};

// Turns a real Open-Meteo forecast into farm alerts. Pure function — the
// thresholds are the alert logic, tune them here.
export function deriveAlerts(weather: WeatherData, crops: string[] = []): DerivedAlert[] {
  const alerts: DerivedAlert[] = [];
  const { current, daily } = weather;
  const growsCardamom = crops.some((c) => c.toLowerCase().includes("cardamom"));

  const next48Rain = Math.max(
    daily.precipitation_probability_max[0] ?? 0,
    daily.precipitation_probability_max[1] ?? 0,
  );
  const next48Sum = (daily.precipitation_sum[0] ?? 0) + (daily.precipitation_sum[1] ?? 0);
  if (next48Rain >= 70 && next48Sum >= 20) {
    alerts.push({
      id: "heavy-rain",
      icon: CloudRain,
      title: "Heavy rainfall expected",
      detail: `${next48Rain}% chance of rain with ~${Math.round(next48Sum)} mm over the next 48 hours. Delay irrigation and fertilizer application.`,
      severity: next48Sum >= 50 ? "Critical" : "Warning",
    });
  } else if (next48Rain >= 50) {
    alerts.push({
      id: "rain-likely",
      icon: CloudRain,
      title: "Rain likely soon",
      detail: `${next48Rain}% chance of rain in the next two days. Plan spraying and harvesting around it.`,
      severity: "Info",
    });
  }

  if (current.relative_humidity_2m >= 80) {
    alerts.push({
      id: "humidity",
      icon: Bug,
      title: growsCardamom ? "Capsule rot risk elevated" : "Fungal disease risk elevated",
      detail: `Humidity is ${current.relative_humidity_2m}%. ${growsCardamom ? "Inspect cardamom plots daily and consider preventive fungicide." : "Inspect crops for fungal symptoms and ensure airflow."}`,
      severity: current.relative_humidity_2m >= 90 ? "Critical" : "Warning",
    });
  }

  const maxTemp = Math.max(...daily.temperature_2m_max.slice(0, 3));
  if (maxTemp >= 32) {
    alerts.push({
      id: "heat",
      icon: ThermometerSun,
      title: "Heat stress risk",
      detail: `Temperatures up to ${Math.round(maxTemp)}°C in the next 3 days. Irrigate early morning and provide shade to sensitive crops.`,
      severity: maxTemp >= 36 ? "Critical" : "Warning",
    });
  }

  const minTemp = Math.min(...daily.temperature_2m_min.slice(0, 3));
  if (minTemp <= 2) {
    alerts.push({
      id: "frost",
      icon: Snowflake,
      title: "Frost risk",
      detail: `Night temperatures near ${Math.round(minTemp)}°C expected. Cover seedlings and irrigate in the evening to protect roots.`,
      severity: minTemp <= 0 ? "Critical" : "Warning",
    });
  }

  if (current.wind_speed_10m >= 30) {
    alerts.push({
      id: "wind",
      icon: Wind,
      title: "Strong winds",
      detail: `Wind at ${Math.round(current.wind_speed_10m)} km/h. Avoid pesticide spraying and secure greenhouse sheets.`,
      severity: current.wind_speed_10m >= 50 ? "Critical" : "Warning",
    });
  }

  return alerts;
}
