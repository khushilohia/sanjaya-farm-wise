import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot, TrendingUp, Landmark, Sprout, CalendarCheck, Droplets, Bug, Wheat,
  ArrowRight, MapPin, Bell,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Sanjaya" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Namaste, Pemba</div>
            <h1 className="mt-1 font-display text-4xl font-semibold">Your farm today</h1>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Gangtok, Sikkim · 2.5 acres
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Bell className="h-4 w-4" /> 3 alerts</Button>
            <Button asChild size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <Link to="/assistant"><Bot className="h-4 w-4" /> Ask Sanjaya</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left column: weather + AI advice */}
          <div className="space-y-6 lg:col-span-2">
            <WeatherWidget />

            {/* AI Recommendations */}
            <Card className="border-border/60 bg-gradient-to-br from-primary/5 to-card p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Bot className="h-3.5 w-3.5" /> AI recommendations
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">Today's farming advice</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Advice icon={Droplets} title="Irrigation" body="Skip today. 68% rain probability in next 24h." tone="sky" />
                <Advice icon={Wheat} title="Fertilizer" body="Apply NPK 19-19-19 after rain stops, ~2 days." tone="harvest" />
                <Advice icon={Bug} title="Pest watch" body="High humidity → capsule rot risk for cardamom. Inspect daily." tone="destructive" />
              </div>
              <Button asChild variant="link" className="mt-2 gap-1 px-0 text-primary">
                <Link to="/assistant">Ask why <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </Card>

            {/* Farm summary */}
            <Card className="border-border/60 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Farm summary</h2>
                <Badge variant="secondary">Kharif season</Badge>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <CropRow name="Large cardamom" stage="Flowering" progress={62} area="1.5 acres" />
                <CropRow name="Ginger" stage="Rhizome formation" progress={45} area="1.0 acre" />
              </div>
              <div className="mt-6 border-t border-border/60 pt-5">
                <div className="text-sm font-semibold">Upcoming tasks</div>
                <ul className="mt-3 space-y-2 text-sm">
                  <Task day="Tomorrow" task="Check cardamom for capsule rot symptoms" />
                  <Task day="Thu" task="Apply organic mulch to ginger rows" />
                  <Task day="Sat" task="Soil moisture test — cardamom plot" />
                </ul>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Market snapshot */}
            <Card className="border-border/60 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <TrendingUp className="h-3.5 w-3.5" /> Market snapshot
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">Nearby mandi prices</h3>
              <div className="mt-4 space-y-3">
                <Price crop="Large cardamom" price="₹2,150/kg" change="+4.2%" up />
                <Price crop="Ginger (fresh)" price="₹68/kg" change="+1.1%" up />
                <Price crop="Rice (basmati)" price="₹42/kg" change="-0.8%" />
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/market">Open marketplace</Link>
              </Button>
            </Card>

            {/* Schemes */}
            <Card className="border-border/60 bg-gradient-to-br from-harvest/15 to-card p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-harvest-foreground">
                <Landmark className="h-3.5 w-3.5" /> Government benefits
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">You qualify for 4 schemes</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between"><span>PM-Kisan</span><span className="font-semibold text-primary">₹2,000 due</span></li>
                <li className="flex justify-between"><span>Soil Health Card</span><span className="text-muted-foreground">Apply</span></li>
                <li className="flex justify-between"><span>Crop Insurance</span><span className="text-muted-foreground">Renew</span></li>
              </ul>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/schemes">View all schemes</Link>
              </Button>
            </Card>

            {/* Quick links */}
            <Card className="border-border/60 p-6">
              <h3 className="font-display text-lg font-semibold">Quick actions</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <QuickLink to="/disease-detection" icon={Sprout} label="Scan crop" />
                <QuickLink to="/weather" icon={CalendarCheck} label="7-day forecast" />
                <QuickLink to="/soil" icon={Wheat} label="Soil health" />
                <QuickLink to="/community" icon={Bot} label="Community" />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Advice({ icon: Icon, title, body, tone }: { icon: any; title: string; body: string; tone: "sky" | "harvest" | "destructive" }) {
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

function Task({ day, task }: { day: string; task: string }) {
  return (
    <li className="flex items-start gap-3 rounded-lg bg-muted/40 p-2.5">
      <div className="min-w-[60px] rounded-md bg-primary/10 px-2 py-1 text-center text-xs font-semibold text-primary">{day}</div>
      <span>{task}</span>
    </li>
  );
}

function Price({ crop, price, change, up }: { crop: string; price: string; change: string; up?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
      <div>
        <div className="text-sm font-semibold">{crop}</div>
        <div className="text-xs text-muted-foreground">Gangtok mandi</div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{price}</div>
        <div className={`text-xs font-medium ${up ? "text-primary" : "text-destructive"}`}>{change}</div>
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-background p-3 text-center transition-colors hover:bg-muted">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
