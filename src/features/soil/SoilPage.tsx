import { Beaker, Leaf, Droplets, Sparkles, Cpu, FileText, MapPin, Activity } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const METRICS = [
  { label: "pH", value: "6.2", range: "Optimal 6.0–6.5", level: "Good", tone: "primary" },
  { label: "Nitrogen", value: "Low", range: "Apply 18 kg/acre", level: "Low", tone: "destructive" },
  { label: "Phosphorus", value: "Medium", range: "Maintain current", level: "Medium", tone: "harvest" },
  { label: "Potassium", value: "High", range: "Reduce dosage", level: "High", tone: "sky" },
];

const HISTORY = [
  { month: "Nov 2025", ph: "6.0", nitrogen: "Low", moisture: "21%" },
  { month: "Dec 2025", ph: "6.1", nitrogen: "Low", moisture: "23%" },
  { month: "Jan 2026", ph: "6.2", nitrogen: "Medium", moisture: "24%" },
  { month: "Feb 2026", ph: "6.3", nitrogen: "Medium", moisture: "22%" },
  { month: "Mar 2026", ph: "6.1", nitrogen: "Low", moisture: "20%" },
  { month: "Apr 2026", ph: "6.2", nitrogen: "Low", moisture: "21%" },
];

const SUITABILITY = [
  { crop: "Cardamom", rating: "Excellent", color: "bg-primary/10 text-primary border-primary/20" },
  { crop: "Ginger", rating: "Good", color: "bg-sky/15 text-sky-foreground border-sky/20" },
  { crop: "Rice", rating: "Moderate", color: "bg-harvest/15 text-harvest-foreground border-harvest/20" },
];

const HEALTH_SCORE = 72;

export function SoilPage() {
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (HEALTH_SCORE / 100) * circumference;

  return (
    <PageShell>
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Soil health overview"
          title="Know your soil, grow smarter"
          subtitle="Track pH, NPK, moisture, and organic carbon. Sanjaya turns it into a soil health score and crop suitability plan."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Soil health score */}
          <Card className="border-border/60 bg-card p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Soil health score</div>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative">
                <svg width="128" height="128" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
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
                  <span className="font-display text-4xl font-bold text-foreground">{HEALTH_SCORE}</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Soil is healthy with mild nitrogen deficiency. Recommended crops: cardamom, ginger, maize.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {METRICS.map((metric) => (
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

          {/* Improvement plan */}
          <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Improvement plan</div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2 rounded-lg bg-background/60 p-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                Add 18 kg/acre urea after the next rain.
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-background/60 p-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                Apply organic compost to increase carbon. Target: 2 ton/acre.
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-background/60 p-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                Maintain moisture between 22–26%.
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-background/60 p-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                Re-test soil in 6 weeks to track nitrogen recovery.
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* AI insights */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="AI insights"
            title="Soil intelligence that predicts yield"
            subtitle="Sanjaya blends soil sensors, farmer input, and government records to guide decisions."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {/* Crop suitability */}
            <Card className="border-border/60 bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Crop suitability</h3>
              <div className="mt-3 space-y-2">
                {SUITABILITY.map((item) => (
                  <div key={item.crop} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.crop}</span>
                    <Badge className={`text-xs ${item.color}`}>{item.rating}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Nutrient deficiency */}
            <Card className="border-border/60 bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Beaker className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Nutrient deficiency</h3>
              <div className="mt-3 rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                <div className="text-sm font-semibold text-destructive">Nitrogen deficiency detected</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Yellowing of lower leaves. Apply split doses of urea: 9 kg/acre now, 9 kg/acre after 21 days.
                </p>
              </div>
            </Card>

            {/* Improvement suggestions */}
            <Card className="border-border/60 bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-harvest/20 text-harvest-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Improvement suggestions</h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Apply compost 2 ton/acre this month.
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Add green manure crop before monsoon.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Soil parameters history */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Historical data"
          title="Soil parameters history"
          subtitle="Track how your soil conditions have changed over the past growing season."
        />
        <Card className="mt-6 border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">Month</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">pH</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nitrogen</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">Moisture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {HISTORY.map((row) => (
                  <tr key={row.month} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.month}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.ph}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          row.nitrogen === "High"
                            ? "bg-primary/10 text-primary border-primary/20 text-xs"
                            : row.nitrogen === "Medium"
                            ? "bg-harvest/15 text-harvest-foreground border-harvest/20 text-xs"
                            : "bg-destructive/10 text-destructive border-destructive/20 text-xs"
                        }
                      >
                        {row.nitrogen}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.moisture}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Data sources */}
      <section className="bg-muted/40 pb-20 pt-8">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Data sources"
            title="Powered by multiple data streams"
            subtitle="Sanjaya combines sensor data, farmer inputs, and government records for accurate soil intelligence."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IconCard
              icon={Activity}
              title="Soil sensors"
              description="Real-time NPK and moisture readings from IoT sensors."
              tone="primary"
            />
            <IconCard
              icon={FileText}
              title="Farmer inputs"
              description="Manual readings and observation logs from farmers."
              tone="harvest"
            />
            <IconCard
              icon={Cpu}
              title="Govt soil records"
              description="District-level soil health card data integration."
              tone="soil"
            />
            <IconCard
              icon={MapPin}
              title="GPS data"
              description="Plot-level mapping for precision soil management."
              tone="sky"
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
