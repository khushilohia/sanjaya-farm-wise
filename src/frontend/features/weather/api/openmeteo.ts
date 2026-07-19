export async function fetchWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,precipitation_probability_max&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

// Past ~8 weeks of daily rainfall, aggregated into weekly totals.
export async function fetchRainfallHistory(
  lat: number,
  lon: number,
): Promise<{ week: string; mm: number }[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&past_days=56&forecast_days=1&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch rainfall history");
  const json = (await res.json()) as {
    daily: { time: string[]; precipitation_sum: (number | null)[] };
  };
  const { time, precipitation_sum } = json.daily;
  const weeks: { week: string; mm: number }[] = [];
  for (let start = 0; start + 7 <= time.length; start += 7) {
    const mm = precipitation_sum
      .slice(start, start + 7)
      .reduce<number>((sum, v) => sum + (v ?? 0), 0);
    const label = new Date(time[start]).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    weeks.push({ week: label, mm: Math.round(mm) });
  }
  return weeks;
}

export type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation_probability: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
};

export function weatherCodeToLabel(code: number): string {
  if (code <= 1) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code === 95) return "Thunderstorm";
  if (code >= 96 && code <= 99) return "Thunderstorm";
  return "Cloudy";
}

export function weatherCodeToEmoji(code: number): string {
  if (code <= 1) return "☀️";
  if (code <= 3) return "⛅";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "⛅";
}

export function getDayLabel(dateStr: string, idx: number): string {
  if (idx === 0) return "Today";
  if (idx === 1) return "Tomorrow";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { weekday: "short" });
}
