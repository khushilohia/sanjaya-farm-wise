import { Cloud, CloudRain, Droplets, Wind, ThermometerSun, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function WeatherWidget({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-sky/15 via-card to-primary/5 p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Today · Sikkim</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-5xl font-semibold">22°</span>
            <span className="text-sm text-muted-foreground">Partly cloudy</span>
          </div>
        </div>
        <Cloud className="h-12 w-12 text-sky" strokeWidth={1.5} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <Metric icon={<CloudRain className="h-4 w-4" />} label="Rain" value="68%" />
        <Metric icon={<Droplets className="h-4 w-4" />} label="Humidity" value="82%" />
        <Metric icon={<Wind className="h-4 w-4" />} label="Wind" value="12 km/h" />
      </div>
      {!compact && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-harvest/15 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-harvest-foreground" />
          <p className="text-foreground/90">
            <strong>Heavy rain expected in 48h.</strong> Delay irrigation and fertilizer.
          </p>
        </div>
      )}
    </Card>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/60 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
