import { Cloud, CloudRain, Droplets, Wind, AlertTriangle } from "lucide-react";
import { Card } from "@/frontend/components/ui/card";

type WeatherWidgetProps = {
  compact?: boolean;
  location?: string;
  summary?: string;
  temperature?: string;
  alert?: string;
};

export function WeatherWidget({
  compact = false,
  location = "Sikkim",
  summary = "Partly cloudy",
  temperature = "22 C",
  alert = "Heavy rain expected in 48h. Delay irrigation and fertilizer.",
}: WeatherWidgetProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-linear-to-br from-sky/15 via-card to-primary/5 p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Today - {location}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-5xl font-semibold">{temperature}</span>
            <span className="text-sm text-muted-foreground">{summary}</span>
          </div>
        </div>
        <Cloud className="h-12 w-12 text-sky" strokeWidth={1.5} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <Metric icon={<CloudRain className="h-4 w-4" />} label="Rain" value="68%" />
        <Metric icon={<Droplets className="h-4 w-4" />} label="Humidity" value="82%" />
        <Metric icon={<Wind className="h-4 w-4" />} label="Wind" value="12 km/h" />
      </div>
      {!compact ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-harvest/15 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-harvest-foreground" />
          <p className="text-foreground/90">
            <strong>{alert.split(".")[0]}.</strong> {alert.split(".").slice(1).join(".").trim()}
          </p>
        </div>
      ) : null}
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
