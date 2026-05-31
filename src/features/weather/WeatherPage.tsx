import {
  CloudRain,
  ThermometerSun,
  Wind,
  AlertTriangle,
  Droplets,
  Sun,
  Cloud,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FORECAST = [
  { day: "Mon", temp: "24°C", rain: "20%", icon: Sun },
  { day: "Tue", temp: "23°C", rain: "45%", icon: Cloud },
  { day: "Wed", temp: "22°C", rain: "68%", icon: CloudRain },
  { day: "Thu", temp: "21°C", rain: "70%", icon: CloudRain },
  { day: "Fri", temp: "24°C", rain: "30%", icon: Cloud },
  { day: "Sat", temp: "26°C", rain: "15%", icon: Sun },
  { day: "Sun", temp: "25°C", rain: "25%", icon: Sun },
];

const SMART_RECS = [
  {
    title: "Delay irrigation",
    detail: "Rain expected in 48h — skip today's irrigation to conserve water and prevent waterlogging.",
    tone: "sky" as const,
    badge: "Advisory",
  },
  {
    title: "Apply fertilizer Thursday",
    detail: "Clear weather window after Thursday rain. Ideal to apply NPK without runoff risk.",
    tone: "harvest" as const,
    badge: "Opportunity",
  },
  {
    title: "Capsule rot risk elevated",
    detail: "Check cardamom daily — humidity above 80% for 3 days increases fungal disease risk.",
    tone: "destructive" as const,
    badge: "Warning",
  },
];

const HOURLY = [
  { time: "6AM", temp: "18°C", icon: Sun, desc: "Clear" },
  { time: "9AM", temp: "20°C", icon: Sun, desc: "Sunny" },
  { time: "12PM", temp: "23°C", icon: Cloud, desc: "Partly cloudy" },
  { time: "3PM", temp: "22°C", icon: Cloud, desc: "Cloudy" },
  { time: "5PM", temp: "21°C", icon: CloudRain, desc: "Light rain" },
  { time: "7PM", temp: "20°C", icon: CloudRain, desc: "Rain" },
  { time: "9PM", temp: "19°C", icon: Cloud, desc: "Overcast" },
  { time: "11PM", temp: "18°C", icon: Cloud, desc: "Cloudy" },
];

const WEEKLY_RAIN = [
  { week: "W1 Apr", mm: 22 },
  { week: "W2 Apr", mm: 45 },
  { week: "W3 Apr", mm: 18 },
  { week: "W4 Apr", mm: 60 },
  { week: "W1 May", mm: 38 },
  { week: "W2 May", mm: 72 },
];

const MAX_MM = Math.max(...WEEKLY_RAIN.map((w) => w.mm));

export function WeatherPage() {
  return (
    <PageShell>
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Weather intelligence"
          title="Real-time forecasts and farm-ready alerts"
          subtitle="Track temperature, rain, humidity, and wind with crop-specific recommendations, tuned to your village."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <WeatherWidget location="Gangtok" summary="Cloudy with showers" />
          <Card className="border-border/60 bg-card p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">7-day outlook</div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
              {FORECAST.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.day} className="rounded-lg bg-muted/30 p-3 text-center">
                    <div className="font-semibold">{item.day}</div>
                    <Icon className="mx-auto my-1.5 h-5 w-5 text-sky" />
                    <div className="text-base font-display font-semibold">{item.temp}</div>
                    <div className="text-xs text-muted-foreground">Rain {item.rain}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
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
            {SMART_RECS.map((rec) => (
              <Card key={rec.title} className={`border-border/60 p-5 ${rec.tone === "sky" ? "bg-sky/10" : rec.tone === "harvest" ? "bg-harvest/10" : "bg-destructive/5"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className={`text-sm font-semibold ${rec.tone === "sky" ? "text-sky-foreground" : rec.tone === "harvest" ? "text-harvest-foreground" : "text-destructive"}`}>
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

      {/* Hourly forecast */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Hourly forecast"
          title="Today hour by hour"
          subtitle="Plan your day with confidence knowing exactly when conditions change."
        />
        <div className="mt-6">
          <Card className="border-border/60 bg-card p-5 overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {HOURLY.map((slot) => {
                const Icon = slot.icon;
                return (
                  <div key={slot.time} className="flex flex-col items-center gap-2 rounded-xl bg-muted/30 px-4 py-3 min-w-[72px]">
                    <div className="text-xs font-semibold text-muted-foreground">{slot.time}</div>
                    <Icon className="h-6 w-6 text-sky" />
                    <div className="text-sm font-semibold">{slot.temp}</div>
                    <div className="text-xs text-muted-foreground text-center">{slot.desc}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* Historical rainfall bar chart */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Seasonal history"
            title="Rainfall this season"
            subtitle="Weekly rainfall totals for this growing season compared to normal levels."
          />
          <Card className="mt-8 border-border/60 bg-card p-6">
            <div className="flex items-end gap-3 h-48">
              {WEEKLY_RAIN.map((w) => {
                const heightPct = Math.round((w.mm / MAX_MM) * 100);
                return (
                  <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                    <div className="text-xs font-semibold text-primary">{w.mm}mm</div>
                    <div
                      className="w-full rounded-t-md bg-primary/70 transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    <div className="text-xs text-muted-foreground text-center leading-tight">{w.week}</div>
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

      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { text: "Heavy rain expected in 48h — delay irrigation.", icon: CloudRain },
            { text: "Frost warning for high-altitude plots tonight.", icon: AlertTriangle },
            { text: "Heat stress risk for rice in low-lying fields.", icon: ThermometerSun },
          ].map((alert) => (
            <Card key={alert.text} className="border-border/60 bg-card p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <alert.icon className="h-3.5 w-3.5" /> Alert
              </div>
              <p className="mt-3 text-sm">{alert.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
