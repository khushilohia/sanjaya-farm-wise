import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  TrendingUp,
  Landmark,
  Sprout,
  CalendarCheck,
  Droplets,
  Bug,
  Wheat,
  ArrowRight,
  MapPin,
  Bell,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AppLayout } from "@/app/layouts/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useFarmStore, type CropEntry } from "@/store/farmStore";
import { useWeather } from "@/features/weather/hooks/useWeather";
import { weatherCodeToEmoji, weatherCodeToLabel } from "@/features/weather/api/openmeteo";

// ─── Setup wizard ────────────────────────────────────────────────────────────

const SOIL_TYPES = ["Clay", "Loamy", "Sandy", "Silt", "Red laterite"];
const IRRIGATION = ["Rain-fed", "Canal", "Borewell", "Drip / Sprinkler", "River / Stream"];
const CROP_STAGES = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest-ready", "Post-harvest"];

function SetupWizard() {
  const { setupStep, cropEntries, soilType, irrigationSource, nearestMandi, updateSetupField, updateCropEntries, advanceSetup } = useFarmStore();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(true);

  // Draft crop list while filling step 1
  const [draftCrops, setDraftCrops] = useState<CropEntry[]>(() =>
    cropEntries.length > 0
      ? cropEntries
      : (user?.crops ?? []).map((c) => ({
          name: c,
          stage: "",
          progress: 0,
          plantedDate: "",
          areaAcres: "",
        }))
  );

  const steps = [
    { n: 1, title: "Crop stages", done: cropEntries.length > 0 && cropEntries.every((c) => c.stage) },
    { n: 2, title: "Soil & irrigation", done: !!soilType && !!irrigationSource },
    { n: 3, title: "Nearest market", done: !!nearestMandi },
    { n: 4, title: "Done", done: setupStep >= 4 },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  if (allDone && !open) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 p-5 mb-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Farm setup — {completedCount}/{steps.length} complete
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Answer a few questions so Sanjaya can give you personalized advice.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Step indicators */}
      <div className="mt-3 flex gap-3 flex-wrap">
        {steps.map((s) => (
          <div key={s.n} className="flex items-center gap-1.5 text-xs font-medium">
            {s.done ? (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={s.done ? "text-primary" : "text-muted-foreground"}>{s.title}</span>
          </div>
        ))}
      </div>

      {open && (
        <div className="mt-5 space-y-5">
          {/* Step 1: Crop stages */}
          {!steps[0].done && (
            <div className="space-y-3">
              <div className="text-sm font-semibold">What stage are your crops at?</div>
              {draftCrops.map((crop, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-background p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{crop.name}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setDraftCrops((d) => d.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Growth stage</label>
                      <select
                        value={crop.stage}
                        onChange={(e) =>
                          setDraftCrops((d) =>
                            d.map((c, idx) => (idx === i ? { ...c, stage: e.target.value } : c))
                          )
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select stage</option>
                        {CROP_STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Planted date</label>
                      <Input
                        type="date"
                        value={crop.plantedDate}
                        onChange={(e) =>
                          setDraftCrops((d) =>
                            d.map((c, idx) => (idx === i ? { ...c, plantedDate: e.target.value } : c))
                          )
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Area (acres)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 1.5"
                        value={crop.areaAcres}
                        onChange={(e) =>
                          setDraftCrops((d) =>
                            d.map((c, idx) => (idx === i ? { ...c, areaAcres: e.target.value } : c))
                          )
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      % to harvest ({crop.progress}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={crop.progress}
                      onChange={(e) =>
                        setDraftCrops((d) =>
                          d.map((c, idx) => (idx === i ? { ...c, progress: Number(e.target.value) } : c))
                        )
                      }
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  setDraftCrops((d) => [
                    ...d,
                    { name: "", stage: "", progress: 0, plantedDate: "", areaAcres: "" },
                  ])
                }
              >
                <Plus className="h-3.5 w-3.5" /> Add crop
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90"
                disabled={draftCrops.some((c) => !c.stage || !c.name)}
                onClick={() => {
                  updateCropEntries(draftCrops);
                  advanceSetup(Math.max(1, setupStep));
                }}
              >
                Save crop stages
              </Button>
            </div>
          )}

          {/* Step 2: Soil & irrigation */}
          {steps[0].done && !steps[1].done && (
            <div className="space-y-3">
              <div className="text-sm font-semibold">Tell us about your soil and water source</div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Soil type</label>
                <div className="flex flex-wrap gap-2">
                  {SOIL_TYPES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateSetupField({ soilType: s })}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        soilType === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Irrigation source</label>
                <div className="flex flex-wrap gap-2">
                  {IRRIGATION.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateSetupField({ irrigationSource: s })}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        irrigationSource === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90"
                disabled={!soilType || !irrigationSource}
                onClick={() => advanceSetup(Math.max(2, setupStep))}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 3: Nearest mandi */}
          {steps[0].done && steps[1].done && !steps[2].done && (
            <div className="space-y-3">
              <div className="text-sm font-semibold">Where do you usually sell your produce?</div>
              <Input
                placeholder="Nearest mandi / market name"
                value={nearestMandi}
                onChange={(e) => updateSetupField({ nearestMandi: e.target.value })}
                className="max-w-sm"
              />
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90"
                disabled={!nearestMandi.trim()}
                onClick={() => advanceSetup(4)}
              >
                Finish setup
              </Button>
            </div>
          )}

          {allDone && (
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <CheckCircle2 className="h-4 w-4" /> Farm setup complete! Your dashboard is now personalized.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { cropEntries, soilType, irrigationSource, nearestMandi, setupComplete, aiLogs } = useFarmStore();
  const { data: weather, isLoading: weatherLoading } = useWeather();

  const displayName = user?.name ?? "Farmer";
  const village = user?.village ?? "Your Village";
  const crops = user?.crops ?? [];

  const current = weather?.current;
  const rainChance = current?.precipitation_probability ?? null;
  const humidity = current?.relative_humidity_2m ?? null;

  // Dynamic AI advice based on real data
  const irrigationAdvice = rainChance !== null
    ? rainChance > 60
      ? `Skip irrigation — ${rainChance}% rain probability today.`
      : rainChance > 30
      ? `Rain possible (${rainChance}%). Check soil moisture before irrigating.`
      : "Low rain chance. Monitor soil moisture and irrigate if dry."
    : "Check weather before deciding on irrigation.";

  const pestAdvice = humidity !== null
    ? humidity > 80
      ? `High humidity (${humidity}%) — elevated fungal risk. Inspect crops today.`
      : humidity > 65
      ? `Humidity at ${humidity}%. Watch for early fungal signs.`
      : "Humidity normal. Routine pest watch is sufficient."
    : "Set up your farm to get pest risk advisories.";

  const fertilizerAdvice = setupComplete
    ? soilType
      ? `${soilType} soil detected. Ask AI assistant for crop-specific NPK dosage.`
      : "Log your soil type in farm setup for fertilizer recommendations."
    : "Complete farm setup to get fertilizer guidance.";

  return (
    <AuthGuard>
      <AppLayout showFooter={false}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Namaste, {displayName.split(" ")[0]}
              </div>
              <h1 className="mt-1 font-display text-4xl font-semibold">Your farm today</h1>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {village}
                {user?.farmSize && ` — ${user.farmSize} acres`}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                <Link to="/assistant">
                  <Bot className="h-4 w-4" /> Ask Sanjaya
                </Link>
              </Button>
            </div>
          </div>

          {/* Crop chips from auth */}
          {crops.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {crops.map((crop) => (
                <span key={crop} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {crop}
                </span>
              ))}
            </div>
          )}

          {/* Setup wizard */}
          <div className="mt-8">
            <SetupWizard />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {/* Live weather card */}
              <Card className="border-border/60 p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <CalendarCheck className="h-3.5 w-3.5" /> Live weather
                </div>
                {weatherLoading ? (
                  <div className="mt-4 h-16 animate-pulse rounded-lg bg-muted" />
                ) : current ? (
                  <div className="mt-3 flex items-center gap-4">
                    <div className="text-5xl">{weatherCodeToEmoji(current.weather_code)}</div>
                    <div>
                      <div className="font-display text-4xl font-bold">{Math.round(current.temperature_2m)}°C</div>
                      <div className="text-muted-foreground">{weatherCodeToLabel(current.weather_code)}</div>
                    </div>
                    <div className="ml-auto grid gap-1 text-right text-sm">
                      <div><span className="text-muted-foreground">Humidity </span><span className="font-semibold">{current.relative_humidity_2m}%</span></div>
                      <div><span className="text-muted-foreground">Rain </span><span className="font-semibold">{current.precipitation_probability}%</span></div>
                      <div><span className="text-muted-foreground">Wind </span><span className="font-semibold">{Math.round(current.wind_speed_10m)} km/h</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-muted-foreground">Weather unavailable. <Link to="/weather" className="text-primary underline">Open weather page</Link></div>
                )}
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/weather">Full forecast <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </Card>

              {/* AI advice — driven by real weather + setup data */}
              <Card className="border-border/60 bg-linear-to-br from-primary/5 to-card p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <Bot className="h-3.5 w-3.5" /> Smart advice
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold">Today's recommendations</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Advice icon={Droplets} title="Irrigation" body={irrigationAdvice} tone="sky" />
                  <Advice icon={Wheat} title="Fertilizer" body={fertilizerAdvice} tone="harvest" />
                  <Advice icon={Bug} title="Pest watch" body={pestAdvice} tone={humidity !== null && humidity > 80 ? "destructive" : "sky"} />
                </div>
                <Button asChild variant="link" className="mt-2 gap-1 px-0 text-primary">
                  <Link to="/assistant">Ask AI for details <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </Card>

              {/* Crop progress — only if setup done */}
              {cropEntries.length > 0 ? (
                <Card className="border-border/60 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold">My crops</h2>
                    {setupComplete && <Badge variant="secondary">{irrigationSource || "Farm"}</Badge>}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {cropEntries.map((crop) => (
                      <CropRow key={crop.name} name={crop.name} stage={crop.stage} progress={crop.progress} area={`${crop.areaAcres} acres`} />
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="border-dashed border-2 border-border/40 p-8 text-center">
                  <Sprout className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="mt-3 text-sm text-muted-foreground">Complete the farm setup above to see your crop tracker here.</p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Market info — placeholder pointing to market page */}
              <Card className="border-border/60 p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <TrendingUp className="h-3.5 w-3.5" /> Market
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">
                  {nearestMandi ? nearestMandi : "Mandi prices"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {nearestMandi
                    ? `Live rates from ${nearestMandi} and nearby mandis.`
                    : "Set your nearest market in farm setup to see local prices."}
                </p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link to="/market">Open marketplace <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </Card>

              {/* Schemes */}
              <Card className="border-border/60 bg-linear-to-br from-harvest/15 to-card p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-harvest-foreground">
                  <Landmark className="h-3.5 w-3.5" /> Government benefits
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">Eligible schemes</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {setupComplete
                    ? "Based on your farm profile, check which national and state schemes apply."
                    : "Complete farm setup to see which schemes you qualify for."}
                </p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link to="/schemes">View schemes</Link>
                </Button>
              </Card>

              {/* Quick actions */}
              <Card className="border-border/60 p-6">
                <h3 className="font-display text-lg font-semibold">Quick actions</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <QuickLink to="/disease-detection" icon={Sprout} label="Scan crop" />
                  <QuickLink to="/weather" icon={CalendarCheck} label="7-day forecast" />
                  <QuickLink to="/soil" icon={Wheat} label="Soil health" />
                  <QuickLink to="/alerts" icon={AlertTriangle} label="Alerts" />
                </div>
              </Card>

              {/* AI log preview */}
              {aiLogs.length > 0 && (
                <Card className="border-border/60 p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Bot className="h-3.5 w-3.5" /> Recent AI advice
                  </div>
                  <div className="mt-3 space-y-3">
                    {aiLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="rounded-lg bg-muted/40 p-3 text-xs">
                        <div className="font-medium text-foreground truncate">{log.question}</div>
                        <div className="mt-1 text-muted-foreground line-clamp-2">{log.answer}</div>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="link" className="mt-2 px-0 text-primary text-xs gap-1">
                    <Link to="/assistant">Open AI assistant <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Advice({ icon: Icon, title, body, tone }: { icon: React.ElementType; title: string; body: string; tone: "sky" | "harvest" | "destructive" }) {
  const tones = {
    sky: "bg-sky/15 text-sky-foreground",
    harvest: "bg-harvest/20 text-harvest-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function CropRow({ name, stage, progress, area }: { name: string; stage: string; progress: number; area: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-baseline justify-between">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground">{area}</div>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{stage}</div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground">{progress}% to harvest</div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-background p-3 text-center transition-colors hover:bg-muted"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
