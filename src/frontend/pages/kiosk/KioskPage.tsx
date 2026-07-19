import { useState } from "react";
import {
  Bot,
  CloudSun,
  TrendingUp,
  Camera,
  Landmark,
  Users,
  QrCode,
  Smartphone,
  CreditCard,
  WifiOff,
  Leaf,
} from "lucide-react";
import VoiceButton from "@/frontend/components/voice/VoiceButton";
import { LANGUAGES, type Lang } from "@/lib/i18n";

const TILES = [
  { label: "Ask AI", icon: Bot, color: "bg-primary text-primary-foreground" },
  { label: "Weather", icon: CloudSun, color: "bg-sky/80 text-white" },
  { label: "Market Prices", icon: TrendingUp, color: "bg-harvest/80 text-harvest-foreground" },
  { label: "Disease Scan", icon: Camera, color: "bg-destructive/80 text-white" },
  { label: "Schemes", icon: Landmark, color: "bg-soil/80 text-white" },
  { label: "Community", icon: Users, color: "bg-muted text-muted-foreground" },
];

const LOGIN_METHODS = [
  { label: "QR Scan", icon: QrCode },
  { label: "Mobile OTP", icon: Smartphone },
  { label: "Farmer ID", icon: CreditCard },
];

export function KioskPage() {
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border/40 bg-card px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">Sanjaya</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
            Kiosk Mode
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  lang === l.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
          <div className="text-right">
            <div className="text-base font-semibold">{timeStr}</div>
            <div className="text-xs text-muted-foreground">{dateStr}</div>
          </div>
        </div>
      </div>

      {/* Offline indicator */}
      <div className="flex items-center justify-end gap-2 px-8 py-2 bg-muted/30">
        <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Offline mode available</span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center px-8 py-8 gap-10">
        {/* Central voice button */}
        <div className="flex flex-col items-center gap-6">
          <VoiceButton
            size="xl"
            listening={listening}
            onClick={() => setListening((v) => !v)}
            label={listening ? "Listening... tap to stop" : "Press to speak"}
          />
          <p className="text-center text-base text-muted-foreground max-w-xs">
            {listening
              ? "Sanjaya is listening. Ask anything about your farm."
              : "Tap the button and ask about weather, crops, diseases, or schemes."}
          </p>
        </div>

        {/* Touch tiles grid */}
        <div className="w-full max-w-3xl grid grid-cols-2 gap-4 sm:grid-cols-3">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.label}
                type="button"
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center transition-all active:scale-95 ${tile.color}`}
                style={{ minHeight: "200px" }}
              >
                <Icon className="h-16 w-16" strokeWidth={1.5} />
                <span className="text-2xl font-semibold">{tile.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login methods */}
        <div className="w-full max-w-3xl">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Login to your farmer profile
          </div>
          <div className="grid grid-cols-3 gap-3">
            {LOGIN_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.label}
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-xl border-2 border-border/60 bg-card px-4 py-4 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  {method.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
