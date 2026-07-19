import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bot, CloudSun, TrendingUp, Camera, Landmark, Bell, LogIn, Leaf } from "lucide-react";
import VoiceButton from "@/frontend/components/voice/VoiceButton";
import { LANGUAGES } from "@/lib/i18n";
import { useLang } from "@/lib/i18n";
import { useAuthStore } from "@/frontend/store/authStore";

const TILES = [
  { label: "Ask AI", icon: Bot, to: "/assistant", color: "bg-primary text-primary-foreground" },
  { label: "Weather", icon: CloudSun, to: "/weather", color: "bg-sky/80 text-white" },
  {
    label: "Market Prices",
    icon: TrendingUp,
    to: "/market",
    color: "bg-harvest/80 text-harvest-foreground",
  },
  {
    label: "Disease Scan",
    icon: Camera,
    to: "/disease-detection",
    color: "bg-destructive/80 text-white",
  },
  { label: "Schemes", icon: Landmark, to: "/schemes", color: "bg-soil/80 text-white" },
  { label: "Alerts", icon: Bell, to: "/alerts", color: "bg-muted text-muted-foreground" },
];

export function KioskPage() {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const user = useAuthStore((s) => s.user);
  const [now, setNow] = useState(() => new Date());

  // Live clock — a kiosk screen stays open all day.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

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
          {/* Language switcher — changes the whole app language */}
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

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center px-8 py-8 gap-10">
        {/* Central voice button — opens the real voice assistant */}
        <div className="flex flex-col items-center gap-6">
          <VoiceButton
            size="xl"
            listening={false}
            onClick={() => navigate({ to: "/assistant" })}
            label="Press to speak"
          />
          <p className="text-center text-base text-muted-foreground max-w-xs">
            Tap the button and ask about weather, crops, diseases, or schemes — in your language.
          </p>
        </div>

        {/* Touch tiles grid */}
        <div className="w-full max-w-3xl grid grid-cols-2 gap-4 sm:grid-cols-3">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.label}
                to={tile.to}
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center transition-all active:scale-95 ${tile.color}`}
                style={{ minHeight: "200px" }}
              >
                <Icon className="h-16 w-16" strokeWidth={1.5} />
                <span className="text-2xl font-semibold">{tile.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Login / current farmer */}
        <div className="w-full max-w-3xl pb-8">
          {user ? (
            <div className="text-center text-sm text-muted-foreground">
              Logged in as <span className="font-semibold text-foreground">{user.name}</span>
              {user.village ? ` — ${user.village}` : ""}
            </div>
          ) : (
            <Link
              to="/login"
              className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-xl border-2 border-border/60 bg-card px-4 py-4 text-base font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              <LogIn className="h-5 w-5 text-primary" />
              Login with your phone number
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
