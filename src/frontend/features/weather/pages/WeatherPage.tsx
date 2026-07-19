import { CloudRain, ThermometerSun, Wind, Droplets } from "lucide-react";
import { AuthGuard } from "@/frontend/app/guards/AuthGuard";
import { AppLayout } from "@/frontend/app/layouts/AppLayout";
import { SectionHeading } from "@/frontend/components/layout/SectionHeading";
import { IconCard } from "@/frontend/components/cards/IconCard";
import { Card } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useWeather, useGeolocation } from "@/frontend/features/weather/hooks/useWeather";
import {
  fetchRainfallHistory,
  weatherCodeToEmoji,
  weatherCodeToLabel,
  getDayLabel,
} from "@/frontend/features/weather/api/openmeteo";
import { deriveAlerts } from "@/frontend/features/alerts/deriveAlerts";
import { useAuthStore } from "@/frontend/store/authStore";

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-8 bg-muted rounded w-1/2" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  );
}

export function WeatherPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error, locationError } = useWeather();
  const { coords } = useGeolocation();

  const rainQuery = useQuery({
    queryKey: ["rainfall-history", coords?.lat, coords?.lon],
    queryFn: () => fetchRainfallHistory(coords!.lat, coords!.lon),
    enabled: Boolean(coords),
    staleTime: 1000 * 60 * 60 * 6,
  });
  const weeklyRain = rainQuery.data ?? [];
  const maxMm = Math.max(1, ...weeklyRain.map((w) => w.mm));

  const current = data?.current;
  const daily = data?.daily;
  const alerts = data ? deriveAlerts(data, user?.crops ?? []) : [];

  // First upcoming day with low rain chance = safe fertilizer/spray window.
  const clearDayIdx = daily
    ? daily.precipitation_probability_max.slice(0, 7).findIndex((p) => p < 30)
    : -1;

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Weather intelligence"
            title="Real-time forecasts and farm-ready alerts"
            subtitle="Track temperature, rain, humidity, and wind with crop-specific recommendations, tuned to your village."
          />

          {isLoading && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
              Failed to load weather data. Showing cached data if available.
            </div>
          )}

          {locationError && (
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground">
              📍 {locationError}
            </div>
          )}

          {current && daily && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Current conditions */}
              <Card className="border-border/60 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Current — your location
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-6xl">{weatherCodeToEmoji(current.weather_code)}</div>
                  <div>
                    <div className="font-display text-5xl font-bold">
                      {Math.round(current.temperature_2m)}°C
                    </div>
                    <div className="text-muted-foreground mt-1">
                      {weatherCodeToLabel(current.weather_code)}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <Droplets className="h-4 w-4 text-sky mx-auto mb-1" />
                    <div className="font-semibold">{current.relative_humidity_2m}%</div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <CloudRain className="h-4 w-4 text-sky mx-auto mb-1" />
                    <div className="font-semibold">{current.precipitation_probability}%</div>
                    <div className="text-xs text-muted-foreground">Rain chance</div>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <Wind className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <div className="font-semibold">{Math.round(current.wind_speed_10m)} km/h</div>
                    <div className="text-xs text-muted-foreground">Wind</div>
                  </div>
                </div>
              </Card>

              {/* 7-day forecast */}
              <Card className="border-border/60 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                  7-day outlook
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm xl:grid-cols-4">
                  {daily.time.slice(0, 7).map((day, i) => (
                    <div
                      key={day}
                      className={`rounded-lg p-3 text-center ${i === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}
                    >
                      <div className="font-semibold text-xs">{getDayLabel(day, i)}</div>
                      <div className="my-1.5 text-xl">
                        {weatherCodeToEmoji(daily.weather_code[i])}
                      </div>
                      <div className="font-display font-semibold">
                        {Math.round(daily.temperature_2m_max[i])}°
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(daily.temperature_2m_min[i])}°
                      </div>
                      <div className="mt-1 text-xs text-sky-foreground">
                        {daily.precipitation_probability_max[i]}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </section>

        {/* Smart recommendations */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Smart recommendations"
              title="Weather-aware farming advice"
              subtitle="Sanjaya turns forecasts into clear actions for irrigation, fertilizer, and pest control."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Delay irrigation",
                  detail: current
                    ? current.precipitation_probability > 50
                      ? `Rain ${current.precipitation_probability}% likely today — skip irrigation.`
                      : "Rain probability is low — check soil moisture and irrigate if needed."
                    : "Rain expected in 48h — skip today's irrigation to conserve water.",
                  tone: "sky" as const,
                  badge: "Advisory",
                },
                {
                  title:
                    clearDayIdx >= 0 && daily
                      ? `Fertilizer window: ${getDayLabel(daily.time[clearDayIdx], clearDayIdx)}`
                      : "No clear fertilizer window",
                  detail:
                    clearDayIdx >= 0 && daily
                      ? `Only ${daily.precipitation_probability_max[clearDayIdx]}% rain chance ${getDayLabel(daily.time[clearDayIdx], clearDayIdx).toLowerCase()} — ideal to apply NPK without runoff risk.`
                      : "Rain is likely all week. Hold fertilizer to avoid runoff losses.",
                  tone: "harvest" as const,
                  badge: clearDayIdx >= 0 ? "Opportunity" : "Advisory",
                },
                {
                  title:
                    current && current.relative_humidity_2m > 75
                      ? "Capsule rot risk elevated"
                      : "Pest watch normal",
                  detail:
                    current && current.relative_humidity_2m > 75
                      ? `Humidity ${current.relative_humidity_2m}% — inspect cardamom daily and apply preventive fungicide.`
                      : "Humidity is manageable. Continue regular pest inspection.",
                  tone:
                    current && current.relative_humidity_2m > 75
                      ? ("destructive" as const)
                      : ("sky" as const),
                  badge: current && current.relative_humidity_2m > 75 ? "Warning" : "Normal",
                },
              ].map((rec) => (
                <Card
                  key={rec.title}
                  className={`border-border/60 p-5 ${rec.tone === "sky" ? "bg-sky/10" : rec.tone === "harvest" ? "bg-harvest/10" : "bg-destructive/5"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`text-sm font-semibold ${rec.tone === "sky" ? "text-sky-foreground" : rec.tone === "harvest" ? "text-harvest-foreground" : "text-destructive"}`}
                    >
                      {rec.title}
                    </div>
                    <Badge
                      className={
                        rec.tone === "sky"
                          ? "bg-sky/20 text-sky-foreground border-sky/30 text-xs"
                          : rec.tone === "harvest"
                            ? "bg-harvest/20 text-harvest-foreground border-harvest/30 text-xs"
                            : "bg-destructive/10 text-destructive border-destructive/20 text-xs"
                      }
                    >
                      {rec.badge}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{rec.detail}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Historical rainfall bar chart */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Seasonal history"
              title="Rainfall — past 8 weeks"
              subtitle="Measured weekly rainfall totals at your location (week starting date shown)."
            />
            <Card className="mt-8 border-border/60 bg-card p-6">
              {rainQuery.isLoading && (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                  Loading rainfall history…
                </div>
              )}
              {rainQuery.isError && (
                <div className="flex h-48 items-center justify-center text-sm text-destructive">
                  Could not load rainfall history.
                </div>
              )}
              <div className="flex items-end gap-3 h-48">
                {weeklyRain.map((w) => {
                  const heightPct = Math.round((w.mm / maxMm) * 100);
                  return (
                    <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                      <div className="text-xs font-semibold text-primary">{w.mm}mm</div>
                      <div
                        className="w-full rounded-t-md bg-primary/70 transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      <div className="text-xs text-muted-foreground text-center leading-tight">
                        {w.week}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Alert types"
            title="Never miss a critical update"
            subtitle="Voice + SMS alerts for storms, frost, heatwaves, and crop-specific risks."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IconCard
              icon={CloudRain}
              title="Rain prediction"
              description="Delay irrigation when heavy rain is expected in 24-48 hours."
              tone="sky"
            />
            <IconCard
              icon={ThermometerSun}
              title="Heatwave alerts"
              description="Protect crops with shade and extra moisture during heat spikes."
              tone="harvest"
            />
            <IconCard
              icon={Wind}
              title="Storm warnings"
              description="Secure greenhouse sheets and avoid pesticide spraying."
              tone="soil"
            />
            <IconCard
              icon={Droplets}
              title="Humidity watch"
              description="High humidity triggers fungal disease risk notifications."
              tone="destructive"
            />
          </div>
        </section>

        {alerts.length > 0 && (
          <section className="container mx-auto px-4 pb-20">
            <div className="grid gap-4 md:grid-cols-3">
              {alerts.slice(0, 3).map((alert) => (
                <Card key={alert.id} className="border-border/60 bg-card p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <alert.icon className="h-3.5 w-3.5" /> {alert.severity}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{alert.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{alert.detail}</p>
                </Card>
              ))}
            </div>
          </section>
        )}
      </AppLayout>
    </AuthGuard>
  );
}
