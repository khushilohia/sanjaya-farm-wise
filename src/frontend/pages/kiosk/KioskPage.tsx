import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  CloudSun,
  TrendingUp,
  Camera,
  Landmark,
  Bell,
  LogIn,
  Leaf,
  Square,
} from "lucide-react";
import VoiceButton from "@/frontend/components/voice/VoiceButton";
import { LANGUAGES, useLang, type Lang } from "@/lib/i18n";
import { useAuthStore } from "@/frontend/store/authStore";
import { useFarmContext } from "@/frontend/features/ai-assistant/hooks/useFarmContext";
import { useAIChat } from "@/frontend/features/ai-assistant/hooks/useAIChat";
import { useSarvamTTS } from "@/frontend/features/ai-assistant/hooks/useSarvamTTS";
import { useVoiceInput } from "@/frontend/features/ai-assistant/hooks/useVoiceInput";

// Voice-first: every tile SPEAKS its answer through the AI — no page redirects.
const TILES: { label: string; icon: typeof Bot; question: string; color: string }[] = [
  {
    label: "Ask AI",
    icon: Bot,
    question: "",
    color: "bg-primary text-primary-foreground",
  },
  {
    label: "Weather",
    icon: CloudSun,
    question: "Tell me today's weather and the coming days for my village, briefly.",
    color: "bg-sky/80 text-white",
  },
  {
    label: "Market Prices",
    icon: TrendingUp,
    question: "Tell me the current mandi prices for my crops, briefly.",
    color: "bg-harvest/80 text-harvest-foreground",
  },
  {
    label: "Disease Check",
    icon: Camera,
    question:
      "How do I check my plants for disease? Tell me briefly what signs to look for on leaves and stems this season.",
    color: "bg-destructive/80 text-white",
  },
  {
    label: "Schemes",
    icon: Landmark,
    question: "Which government schemes do I qualify for and what do they give? Briefly.",
    color: "bg-soil/80 text-white",
  },
  {
    label: "Alerts",
    icon: Bell,
    question: "Are there any weather alerts or risks for my farm in the coming days? Briefly.",
    color: "bg-muted text-muted-foreground",
  },
];

type KioskState = "idle" | "listening" | "thinking" | "speaking";

const STATUS: Record<KioskState, string> = {
  idle: "Tap the button or a tile — Sanjaya answers out loud",
  listening: "Listening… ask your question",
  thinking: "Thinking…",
  speaking: "Speaking… tap to stop",
};

export function KioskPage() {
  const { lang, setLang } = useLang();
  const user = useAuthStore((s) => s.user);
  const farmContext = useFarmContext();
  const aiChat = useAIChat();
  const { speak, stop: stopSpeaking } = useSarvamTTS();

  const [state, setState] = useState<KioskState>("idle");
  const [lastQuestion, setLastQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  const handleQuestion = useCallback(
    async (question: string) => {
      if (stateRef.current !== "idle") return;
      setState("thinking");
      setLastQuestion(question);
      setAnswer("");
      try {
        const result = await aiChat.mutateAsync({
          question,
          context: farmContext,
          language: lang,
        });
        const text = (result as { answer: string }).answer;
        setAnswer(text);
        setState("speaking");
        await speak(text, lang);
      } catch {
        const sorry = "Sorry, I could not get an answer. Please try again.";
        setAnswer(sorry);
        setState("speaking");
        await speak(sorry, lang).catch(() => {});
      } finally {
        setState("idle");
      }
    },
    [aiChat, farmContext, lang, speak],
  );

  const onFinalTranscript = useCallback(
    (text: string) => {
      setState("idle");
      void handleQuestion(text);
    },
    [handleQuestion],
  );

  const {
    isListening,
    isTranscribing,
    interim,
    error: speechError,
    start,
    stop,
    clearError,
  } = useVoiceInput(lang, onFinalTranscript);

  useEffect(() => {
    if (isTranscribing) setState("thinking");
  }, [isTranscribing]);

  useEffect(() => {
    if (speechError) setState("idle");
  }, [speechError]);

  async function handleVoiceButton() {
    if (speechError) {
      clearError();
      return;
    }
    if (state === "idle") {
      const started = await start();
      if (started) setState("listening");
    } else if (state === "listening") {
      stop();
      setState("idle");
    } else if (state === "speaking") {
      stopSpeaking();
      setState("idle");
    }
  }

  function handleTile(tile: (typeof TILES)[number]) {
    if (tile.question === "") {
      void handleVoiceButton();
    } else {
      void handleQuestion(tile.question);
    }
  }

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
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code as Lang)}
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
      <div className="flex flex-1 flex-col items-center px-8 py-8 gap-8">
        {/* Central voice button */}
        <div className="flex flex-col items-center gap-4">
          <VoiceButton
            size="xl"
            listening={state === "listening"}
            onClick={handleVoiceButton}
            label={STATUS[state]}
          />
          {state === "listening" && interim && (
            <p className="max-w-md text-center text-sm text-muted-foreground">"{interim}"</p>
          )}
          {speechError && (
            <p className="max-w-md text-center text-sm text-destructive">
              Microphone problem — tap the button to try again, or use a tile below.
            </p>
          )}
        </div>

        {/* Spoken answer, shown large for co-reading */}
        {(answer || state === "thinking") && (
          <div className="w-full max-w-3xl rounded-2xl border border-primary/20 bg-card p-6">
            {lastQuestion && (
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {lastQuestion}
              </div>
            )}
            <p className="mt-2 text-xl leading-relaxed">
              {state === "thinking" ? "Sanjaya is thinking…" : answer}
            </p>
            {state === "speaking" && (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setState("idle");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <Square className="h-4 w-4" /> Stop speaking
              </button>
            )}
          </div>
        )}

        {/* Touch tiles — each one speaks its answer */}
        <div className="w-full max-w-3xl grid grid-cols-2 gap-4 sm:grid-cols-3">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.label}
                type="button"
                disabled={state === "thinking"}
                onClick={() => handleTile(tile)}
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center transition-all active:scale-95 disabled:opacity-60 ${tile.color}`}
                style={{ minHeight: "180px" }}
              >
                <Icon className="h-14 w-14" strokeWidth={1.5} />
                <span className="text-xl font-semibold">{tile.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login / current farmer */}
        <div className="w-full max-w-3xl pb-8">
          {user ? (
            <div className="text-center text-sm text-muted-foreground">
              Logged in as <span className="font-semibold text-foreground">{user.name}</span>
              {user.village ? ` — ${user.village}` : ""} · answers are personalized to this farm
            </div>
          ) : (
            <Link
              to="/login"
              className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-xl border-2 border-border/60 bg-card px-4 py-4 text-base font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              <LogIn className="h-5 w-5 text-primary" />
              Login to get answers for YOUR farm
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
