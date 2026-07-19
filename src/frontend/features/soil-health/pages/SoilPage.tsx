import { useQuery } from "@tanstack/react-query";
import { Beaker, Leaf, Sparkles, Globe, FileText, MapPin } from "lucide-react";
import { AuthGuard } from "@/frontend/app/guards/AuthGuard";
import { AppLayout } from "@/frontend/app/layouts/AppLayout";
import { SectionHeading } from "@/frontend/components/layout/SectionHeading";
import { IconCard } from "@/frontend/components/cards/IconCard";
import { Card } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { fetchSoilData, interpretSoil } from "@/backend/api/serverFns";
import { useGeolocation } from "@/frontend/features/weather/hooks/useWeather";
import { useAuthStore } from "@/frontend/store/authStore";

const RATING_STYLES: Record<string, string> = {
  Excellent: "bg-primary/10 text-primary border-primary/20",
  Good: "bg-sky/15 text-sky-foreground border-sky/20",
  Moderate: "bg-harvest/15 text-harvest-foreground border-harvest/20",
  Poor: "bg-destructive/10 text-destructive border-destructive/20",
};

function fmt(value: number | null | undefined, digits = 1): string {
  return value == null ? "—" : value.toFixed(digits);
}

function phLevel(ph: number | null): { level: string; tone: string; hint: string } {
  if (ph == null) return { level: "Unknown", tone: "muted", hint: "No data" };
  if (ph < 5.5) return { level: "Acidic", tone: "destructive", hint: "Consider liming" };
  if (ph > 7.5) return { level: "Alkaline", tone: "harvest", hint: "Add organic matter" };
  return { level: "Good", tone: "primary", hint: "Optimal 5.5–7.5" };
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-8 bg-muted rounded w-1/2" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  );
}

export function SoilPage() {
  const user = useAuthStore((s) => s.user);
  const { coords, locationError } = useGeolocation();

  const soilQuery = useQuery({
    queryKey: ["soil", coords?.lat, coords?.lon],
    queryFn: () => fetchSoilData({ data: { lat: coords!.lat, lon: coords!.lon } }),
    enabled: Boolean(coords),
    staleTime: Infinity, // soil properties don't change between visits
  });
  const soil = soilQuery.data;

  const aiQuery = useQuery({
    queryKey: ["soil-ai", soil?.coordinates, user?.crops, user?.language],
    queryFn: () =>
      interpretSoil({
        data: {
          soil: soil!,
          crops: user?.crops ?? [],
          language: user?.language ?? "en",
        },
      }),
    enabled: Boolean(soil),
    staleTime: Infinity,
  });
  const ai = aiQuery.data;

  const score = soil?.healthScore ?? 0;
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (score / 100) * circumference;
  const ph = phLevel(soil?.ph ?? null);

  const metrics = soil
    ? [
        { label: "pH", value: fmt(soil.ph), range: ph.hint, level: ph.level, tone: ph.tone },
        {
          label: "Nitrogen",
          value: `${fmt(soil.nitrogen, 2)} g/kg`,
          range: "Topsoil total N",
          level: soil.nitrogen != null && soil.nitrogen < 1.5 ? "Low" : "OK",
          tone: soil.nitrogen != null && soil.nitrogen < 1.5 ? "destructive" : "primary",
        },
        {
          label: "Organic carbon",
          value: `${fmt(soil.organicCarbon)} g/kg`,
          range: "Higher is better",
          level: soil.organicCarbon != null && soil.organicCarbon < 10 ? "Low" : "Good",
          tone: soil.organicCarbon != null && soil.organicCarbon < 10 ? "harvest" : "primary",
        },
        {
          label: "Texture",
          value: soil.texture,
          range: `Clay ${fmt(soil.clay, 0)}% · Sand ${fmt(soil.sand, 0)}% · Silt ${fmt(soil.silt, 0)}%`,
          level: "Info",
          tone: "sky",
        },
      ]
    : [];

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Soil health overview"
            title="Know your soil, grow smarter"
            subtitle="Real satellite-derived soil data for your location (ISRIC SoilGrids), interpreted by AI into a health score and crop plan."
          />

          {locationError && (
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground">
              📍 {locationError}
            </div>
          )}

          {(soilQuery.isLoading || !coords) && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {soilQuery.isError && (
            <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
              Could not load soil data for your location. Please try again later.
            </div>
          )}

          {soil && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
              {/* Soil health score */}
              <Card className="border-border/60 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Soil health score
                </div>
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="relative">
                    <svg width="128" height="128" viewBox="0 0 128 128">
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted/30"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 64 64)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-4xl font-bold text-foreground">
                        {score}
                      </span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    {aiQuery.isLoading
                      ? "Interpreting your soil data…"
                      : (ai?.summary ?? `${soil.texture} soil at your location.`)}
                  </p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg bg-muted/30 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                        <Badge
                          className={
                            metric.tone === "primary"
                              ? "bg-primary/10 text-primary border-primary/20 text-xs"
                              : metric.tone === "destructive"
                                ? "bg-destructive/10 text-destructive border-destructive/20 text-xs"
                                : metric.tone === "harvest"
                                  ? "bg-harvest/15 text-harvest-foreground border-harvest/20 text-xs"
                                  : "bg-sky/15 text-sky-foreground border-sky/20 text-xs"
                          }
                        >
                          {metric.level}
                        </Badge>
                      </div>
                      <div className="mt-1 text-lg font-semibold">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.range}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Improvement plan (AI, from real numbers) */}
              <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Improvement plan
                </div>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {aiQuery.isLoading && (
                    <div className="py-6 text-center">Generating recommendations…</div>
                  )}
                  {aiQuery.isError && (
                    <div className="py-6 text-center text-destructive">
                      Could not generate recommendations right now.
                    </div>
                  )}
                  {(ai?.recommendations ?? []).map((rec: string) => (
                    <div
                      key={rec}
                      className="flex items-start gap-2 rounded-lg bg-background/60 p-3"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </section>

        {/* AI insights */}
        {soil && (
          <section className="bg-muted/40 py-16">
            <div className="container mx-auto px-4">
              <SectionHeading
                eyebrow="AI insights"
                title="Crop suitability for your soil"
                subtitle="Based on the measured pH, nutrients, and texture at your farm's location."
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Card className="border-border/60 bg-card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">Crop suitability</h3>
                  <div className="mt-3 space-y-2">
                    {aiQuery.isLoading && (
                      <div className="text-sm text-muted-foreground">Rating crops…</div>
                    )}
                    {(ai?.suitability ?? []).map(
                      (item: { crop: string; rating: string; note?: string }) => (
                        <div key={item.crop} className="flex items-center justify-between gap-2">
                          <span className="text-sm text-muted-foreground">
                            {item.crop}
                            {item.note ? ` — ${item.note}` : ""}
                          </span>
                          <Badge
                            className={`text-xs shrink-0 ${RATING_STYLES[item.rating] ?? "bg-muted text-muted-foreground border-border"}`}
                          >
                            {item.rating}
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                </Card>

                <Card className="border-border/60 bg-card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-harvest/20 text-harvest-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    Measured at your location
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-2.5">
                      <Beaker className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      CEC (nutrient holding): {fmt(soil.cec)} cmol/kg
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Coordinates: {soil.coordinates.lat.toFixed(3)},{" "}
                      {soil.coordinates.lon.toFixed(3)}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Data sources */}
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Data sources"
            title="Where this data comes from"
            subtitle="Sanjaya combines global soil mapping with your farm profile for practical advice."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <IconCard
              icon={Globe}
              title="ISRIC SoilGrids"
              description="Satellite and survey-derived soil properties at 250 m resolution, read for your GPS location."
              tone="primary"
            />
            <IconCard
              icon={FileText}
              title="Your farm profile"
              description="Crops and soil type you entered during registration shape the recommendations."
              tone="harvest"
            />
            <IconCard
              icon={Sparkles}
              title="AI interpretation"
              description="An agronomy AI turns the raw numbers into a plan in your language."
              tone="soil"
            />
          </div>
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
