import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ComingSoon({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link>
        </Button>
        <Card className="border-border/60 bg-gradient-to-br from-card to-primary/5 p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Coming in Phase 2
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{description}</p>
          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">What's planned</div>
            <ul className="mt-3 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 rounded-lg bg-background/60 p-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </main>
    </div>
  );
}
