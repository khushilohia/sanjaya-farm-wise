import { Link } from "@tanstack/react-router";
import { Mic, Sparkles } from "lucide-react";
import { Card } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/lib/utils";

type VoiceCTAProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
};

export function VoiceCTA({
  className,
  title = "Speak naturally, in your language",
  subtitle = "Sanjaya listens first, then responds with clear, local advice. Voice mode works on kiosk and mobile.",
  actionLabel = "Try voice mode",
  actionTo = "/assistant",
}: VoiceCTAProps) {
  return (
    <Card
      className={cn(
        "border-border/60 bg-linear-to-br from-primary/10 via-card to-harvest/10 p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-warm">
            <Mic className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {["Hindi", "Nepali", "Bengali", "English", "Local dialects"].map((lang) => (
              <span key={lang} className="rounded-full bg-background/80 px-3 py-1">
                {lang}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:flex">
          <Sparkles className="h-10 w-10" />
        </div>
      </div>
      <Button asChild size="sm" className="mt-6 w-full gap-2 bg-primary hover:bg-primary/90">
        <Link to={actionTo}>
          <Sparkles className="h-4 w-4" /> {actionLabel}
        </Link>
      </Button>
    </Card>
  );
}
