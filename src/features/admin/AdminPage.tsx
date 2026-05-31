import { ShieldCheck, TrendingUp, Bug, Users, BarChart3, Activity } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { StatCard } from "@/components/cards/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATS = [
  { label: "Total Farmers", value: "12,450", helper: "+320 this month", tone: "primary" },
  { label: "Active Kiosks", value: "48", helper: "Across 4 districts", tone: "sky" },
  { label: "Diseases Detected", value: "328", helper: "Last 30 days", tone: "soil" },
  { label: "Schemes Applied", value: "1,240", helper: "85% approval rate", tone: "harvest" },
] as const;

const FARMERS = [
  { name: "Ramesh Rai", village: "Rumtek", crops: "Cardamom, Ginger", lastActive: "Today", status: "Active" },
  { name: "Sunita Tamang", village: "Ranipool", crops: "Ginger, Rice", lastActive: "Yesterday", status: "Active" },
  { name: "Bikash Sharma", village: "Khamdong", crops: "Cardamom", lastActive: "3 days ago", status: "Active" },
  { name: "Purnima Basnet", village: "Soreng", crops: "Tea, Maize", lastActive: "1 week ago", status: "Inactive" },
  { name: "Deepak Gurung", village: "Gyalshing", crops: "Cardamom, Ginger", lastActive: "2 days ago", status: "Active" },
];

const DISTRICTS = [
  { name: "East Sikkim", cases: 142, disease: "Capsule Rot", trend: "up" },
  { name: "West Sikkim", cases: 98, disease: "Ginger Soft Rot", trend: "down" },
  { name: "North Sikkim", cases: 45, disease: "Leaf Spot", trend: "stable" },
];

const FORECASTS = [
  { crop: "Cardamom", season: "Kharif 2026", yield: "4,200 MT", change: "+8%" },
  { crop: "Ginger", season: "Pre-monsoon 2026", yield: "12,500 MT", change: "+3%" },
  { crop: "Rice", season: "Rabi 2026", yield: "28,000 MT", change: "-2%" },
];

const AI_CATEGORIES = [
  { label: "Weather & irrigation", pct: 42 },
  { label: "Disease identification", pct: 31 },
  { label: "Scheme queries", pct: 27 },
];

export function AdminPage() {
  return (
    <PageShell>
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <SectionHeading
            eyebrow="Admin dashboard"
            title="Regional insights for officers"
            subtitle="Monitor farmer adoption, disease outbreaks, and scheme distribution across districts."
          />
          <div className="ml-auto shrink-0">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Admin
            </Badge>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              helper={stat.helper}
              tone={stat.tone}
            />
          ))}
        </div>
      </section>

      {/* Farmer management table */}
      <section className="container mx-auto px-4 pb-16">
        <SectionHeading
          eyebrow="Farmer management"
          title="Registered farmers"
          subtitle="View active profiles, crops, and recent activity across your region."
        />
        <Card className="mt-6 border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Crops</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FARMERS.map((farmer) => (
                <TableRow key={farmer.name}>
                  <TableCell className="font-medium">{farmer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{farmer.village}</TableCell>
                  <TableCell className="text-muted-foreground">{farmer.crops}</TableCell>
                  <TableCell className="text-muted-foreground">{farmer.lastActive}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        farmer.status === "Active"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {farmer.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Regional disease monitoring */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Regional monitoring"
            title="Disease heatmaps + early warnings"
            subtitle="Identify hotspots and send preventive advisories before outbreaks spread."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {DISTRICTS.map((d) => (
              <Card key={d.name} className="border-border/60 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{d.name}</div>
                  <span className="text-lg">
                    {d.trend === "up" ? "↑" : d.trend === "down" ? "↓" : "→"}
                  </span>
                </div>
                <div className="mt-3 text-3xl font-display font-bold text-foreground">
                  {d.cases}
                </div>
                <div className="text-xs text-muted-foreground">reported cases</div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Bug className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-xs text-muted-foreground">{d.disease}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crop production forecast */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Production forecast"
          title="Crop yield projections"
          subtitle="AI-driven production estimates based on current soil, weather, and crop data."
        />
        <Card className="mt-6 border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Expected yield</TableHead>
                <TableHead>Change vs last year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FORECASTS.map((row) => (
                <TableRow key={row.crop}>
                  <TableCell className="font-medium">{row.crop}</TableCell>
                  <TableCell className="text-muted-foreground">{row.season}</TableCell>
                  <TableCell className="font-semibold">{row.yield}</TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-semibold ${
                        row.change.startsWith("+") ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {row.change}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* AI usage analytics */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="AI usage analytics"
            title="Platform intelligence"
            subtitle="Track query volume, voice usage, and top categories to improve farmer support."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="border-border/60 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Usage overview</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <div className="font-display text-3xl font-bold text-primary">48,290</div>
                  <div className="text-xs text-muted-foreground mt-1">Total queries this month</div>
                </div>
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <div className="font-display text-3xl font-bold text-sky">72%</div>
                  <div className="text-xs text-muted-foreground mt-1">Voice query usage</div>
                </div>
              </div>
            </Card>
            <Card className="border-border/60 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Top query categories</div>
              <div className="space-y-3">
                {AI_CATEGORIES.map((cat) => (
                  <div key={cat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{cat.label}</span>
                      <span className="font-semibold">{cat.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <SectionHeading
          eyebrow="Officer tools"
          title="Everything in one console"
          subtitle="Track scheme uptake, AI usage, and support requests across districts."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <IconCard
            icon={Users}
            title="Farmer management"
            description="View active profiles and onboarding status."
            tone="primary"
          />
          <IconCard
            icon={TrendingUp}
            title="Production forecast"
            description="Predict crop output with AI trends."
            tone="harvest"
          />
          <IconCard
            icon={Bug}
            title="Disease monitoring"
            description="Track outbreaks and respond quickly."
            tone="destructive"
          />
          <IconCard
            icon={Activity}
            title="AI analytics"
            description="Monitor voice usage and query patterns."
            tone="sky"
          />
        </div>
      </section>
    </PageShell>
  );
}
