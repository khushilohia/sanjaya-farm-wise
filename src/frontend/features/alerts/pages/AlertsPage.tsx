import { useState } from "react";
import { Bell, CloudRain, Bug, TrendingUp, Landmark, X, CheckCircle2 } from "lucide-react";
import { AuthGuard } from "@/frontend/app/guards/AuthGuard";
import { AppLayout } from "@/frontend/app/layouts/AppLayout";
import { SectionHeading } from "@/frontend/components/layout/SectionHeading";
import { IconCard } from "@/frontend/components/cards/IconCard";
import { Card } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Switch } from "@/frontend/components/ui/switch";
import { Label } from "@/frontend/components/ui/label";
import { useWeather } from "@/frontend/features/weather/hooks/useWeather";
import { deriveAlerts, type Severity } from "@/frontend/features/alerts/deriveAlerts";
import { useAuthStore } from "@/frontend/store/authStore";

const severityStyles: Record<Severity, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  Warning: "bg-harvest/15 text-harvest-foreground border-harvest/20",
  Info: "bg-sky/15 text-sky-foreground border-sky/20",
};

export function AlertsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: weather, isLoading, locationError } = useWeather();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [appNotifications, setAppNotifications] = useState(true);
  const [quietHours, setQuietHours] = useState(true);

  const alerts = weather
    ? deriveAlerts(weather, user?.crops ?? []).filter((a) => !dismissed.includes(a.id))
    : [];

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Alerts & notifications"
            title="Never miss a critical update"
            subtitle="Alerts generated from the live weather forecast at your location, tuned to your crops."
          />

          {locationError && (
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground">
              📍 {locationError}
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Live alerts */}
            <Card className="border-border/60 bg-card p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Bell className="h-3.5 w-3.5" /> Live alerts
                {alerts.length > 0 && (
                  <Badge className="ml-auto bg-destructive/10 text-destructive border-destructive/20 text-xs">
                    {alerts.length} active
                  </Badge>
                )}
              </div>
              <div className="mt-4 space-y-3">
                {isLoading && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Checking the forecast for your location…
                  </div>
                )}
                {!isLoading && alerts.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    No weather risks detected for the next few days.
                  </div>
                )}
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <alert.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-sm font-semibold">{alert.title}</div>
                        <Badge className={`text-xs shrink-0 ${severityStyles[alert.severity]}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{alert.detail}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setDismissed((prev) => [...prev, alert.id])}
                      aria-label="Dismiss alert"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notification preferences */}
            <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Notification preferences
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-background/60 px-4 py-3">
                  <Label htmlFor="app-notifications" className="text-sm cursor-pointer">
                    In-app alerts
                  </Label>
                  <Switch
                    id="app-notifications"
                    checked={appNotifications}
                    onCheckedChange={setAppNotifications}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-background/60 px-4 py-3">
                  <div>
                    <Label htmlFor="quiet-hours" className="text-sm cursor-pointer">
                      Quiet hours
                    </Label>
                    <div className="text-xs text-muted-foreground">9:00 PM – 5:00 AM</div>
                  </div>
                  <Switch id="quiet-hours" checked={quietHours} onCheckedChange={setQuietHours} />
                </div>
                <div className="rounded-lg bg-background/60 px-4 py-3 text-xs text-muted-foreground">
                  Voice call and SMS delivery are coming soon. For now, alerts appear here and on
                  your dashboard.
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4 pb-4">
            <SectionHeading
              eyebrow="Alert categories"
              title="Prioritized by risk"
              subtitle="Sanjaya classifies alerts by severity so farmers act fast on what matters."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <IconCard
                icon={CloudRain}
                title="Weather alerts"
                description="Storm, frost, heatwave, and rainfall warnings from the live forecast."
                tone="sky"
              />
              <IconCard
                icon={Bug}
                title="Disease risk"
                description="Humidity-driven fungal and pest risk for your crops."
                tone="destructive"
              />
              <IconCard
                icon={TrendingUp}
                title="Market signals"
                description="Coming soon: price spikes or drops for your crops."
                tone="harvest"
              />
              <IconCard
                icon={Landmark}
                title="Scheme deadlines"
                description="Coming soon: application windows and subsidy reminders."
                tone="soil"
              />
            </div>
          </div>
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
