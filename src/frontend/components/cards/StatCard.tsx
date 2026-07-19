import { Card } from "@/frontend/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "primary" | "sky" | "harvest" | "soil" | "muted";

const toneStyles: Record<Tone, string> = {
  primary: "from-primary/15 to-primary/5",
  sky: "from-sky/15 to-sky/5",
  harvest: "from-harvest/20 to-harvest/5",
  soil: "from-soil/15 to-soil/5",
  muted: "from-muted to-background",
};

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: Tone;
  className?: string;
};

export function StatCard({ label, value, helper, tone = "muted", className }: StatCardProps) {
  return (
    <Card className={cn("border-border/60 bg-linear-to-br p-4", toneStyles[tone], className)}>
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</div>
      {helper ? <div className="mt-1 text-xs text-muted-foreground">{helper}</div> : null}
    </Card>
  );
}
