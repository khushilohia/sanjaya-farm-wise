import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "primary" | "sky" | "harvest" | "soil" | "muted" | "destructive";

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  sky: "bg-sky/15 text-sky-foreground",
  harvest: "bg-harvest/20 text-harvest-foreground",
  soil: "bg-soil/15 text-soil-foreground",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

type IconCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: Tone;
  className?: string;
  children?: ReactNode;
};

export function IconCard({
  icon: Icon,
  title,
  description,
  tone = "primary",
  className,
  children,
}: IconCardProps) {
  return (
    <Card
      className={cn(
        "border-border/60 p-6 transition-all hover:-translate-y-1 hover:shadow-warm",
        className,
      )}
    >
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", toneStyles[tone])}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </Card>
  );
}
