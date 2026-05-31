import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CloudRain,
  Bug,
  TrendingUp,
  Landmark,
  X,
  ShieldAlert,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Severity = "Critical" | "Warning" | "Info";

type Alert = {
  id: number;
  icon: typeof CloudRain;
  title: string;
  detail: string;
  severity: Severity;
  timeAgo: string;
};

const INITIAL_ALERTS: Alert[] = [
  {
    id: 1,
    icon: CloudRain,
    title: "Heavy rainfall incoming",
    detail: "Expected in 48 hours. Delay irrigation and hold off on fertilizer application.",
    severity: "Warning",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    icon: Bug,
    title: "Capsule rot risk elevated",
    detail: "High humidity in cardamom plots. Inspect daily and apply preventive fungicide.",
    severity: "Critical",
    timeAgo: "5 hours ago",
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Cardamom price spike",
    detail: "Demand up 18% this week. Consider selling current stock at premium rates.",
    severity: "Info",
    timeAgo: "1 day ago",
  },
  {
    id: 4,
    icon: Landmark,
    title: "Scheme deadline approaching",
    detail: "Soil Health Card camp closes in 5 days. Complete your application today.",
    severity: "Warning",
    timeAgo: "3 hours ago",
  },
];

const severityStyles: Record<Severity, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  Warning: "bg-harvest/15 text-harvest-foreground border-harvest/20",
  Info: "bg-sky/15 text-sky-foreground border-sky/20",
};

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [voiceCalls, setVoiceCalls] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [quietHours, setQuietHours] = useState(true);

  function dismissAlert(id: number) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <PageShell>
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Alerts & notifications"
          title="Never miss a critical update"
          subtitle="Weather, pest, market, and scheme alerts delivered by voice, SMS, and in-app notifications."
        />
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
              {alerts.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  All alerts dismissed.
                </div>
              )}
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
                >
                  <alert.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-sm font-semibold">{alert.title}</div>
                      <Badge className={`text-xs shrink-0 ${severityStyles[alert.severity]}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{alert.detail}</div>
                    <div className="mt-1 text-xs text-muted-foreground/60">{alert.timeAgo}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => dismissAlert(alert.id)}
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
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Notification preferences</div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-background/60 px-4 py-3">
                <Label htmlFor="voice-calls" className="text-sm cursor-pointer">
                  Voice calls
                </Label>
                <Switch
                  id="voice-calls"
                  checked={voiceCalls}
                  onCheckedChange={setVoiceCalls}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background/60 px-4 py-3">
                <Label htmlFor="sms-alerts" className="text-sm cursor-pointer">
                  SMS alerts
                </Label>
                <Switch
                  id="sms-alerts"
                  checked={smsAlerts}
                  onCheckedChange={setSmsAlerts}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background/60 px-4 py-3">
                <Label htmlFor="app-notifications" className="text-sm cursor-pointer">
                  App notifications
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
                <Switch
                  id="quiet-hours"
                  checked={quietHours}
                  onCheckedChange={setQuietHours}
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Regional alert */}
      <section className="container mx-auto px-4 pb-4">
        <Card className="border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm font-semibold text-destructive">Regional outbreak alert</div>
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Critical</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Capsule rot outbreak detected in 3 nearby villages: Rumtek, Ranipool, and Khamdong. Inspect your cardamom plots immediately and apply Copper oxychloride 0.3% as a preventive measure.
              </p>
              <div className="mt-2 text-xs text-muted-foreground/70">Issued 30 minutes ago by District Agriculture Officer</div>
            </div>
          </div>
        </Card>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Alert categories"
            title="Prioritized by risk"
            subtitle="Sanjaya classifies alerts by severity so farmers act fast on what matters."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IconCard
              icon={CloudRain}
              title="Weather alerts"
              description="Storm, frost, heatwave, and rainfall warnings."
              tone="sky"
            />
            <IconCard
              icon={Bug}
              title="Pest outbreaks"
              description="Early warnings for disease and insect activity."
              tone="destructive"
            />
            <IconCard
              icon={TrendingUp}
              title="Market signals"
              description="Price spikes or drops for your crops."
              tone="harvest"
            />
            <IconCard
              icon={Landmark}
              title="Scheme deadlines"
              description="Stay ahead of application windows and subsidies."
              tone="soil"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <SectionHeading
          eyebrow="Voice-ready"
          title="Alerts that speak your language"
          subtitle="Audio announcements ensure every farmer hears critical updates instantly."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Hindi voice calls at 7:00 AM", "Nepali SMS + audio on kiosk", "Local dialects for village kiosks"].map((item) => (
            <Card key={item} className="border-border/60 bg-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-primary" /> {item}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
