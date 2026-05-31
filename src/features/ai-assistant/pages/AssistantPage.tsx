import { useState, useEffect, useRef } from "react";
import { Keyboard, MapPin, CloudSun, Sprout, BookMarked, Check, MicOff, WifiOff, AlertCircle } from "lucide-react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AppLayout } from "@/app/layouts/AppLayout";
import { VoiceOrb, type OrbState } from "@/features/ai-assistant/components/VoiceOrb";
import { useSpeechRecognition } from "@/features/ai-assistant/hooks/useSpeechRecognition";
import { useAIChat } from "@/features/ai-assistant/hooks/useAIChat";
import { useSarvamTTS } from "@/features/ai-assistant/hooks/useSarvamTTS";
import { useAuthStore } from "@/store/authStore";
import { useFarmStore } from "@/store/farmStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ne", label: "नेपाली" },
  { code: "bn", label: "বাংলা" },
];

const STATUS_TEXT: Record<OrbState, string> = {
  idle: "Tap orb to speak",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

const SPEECH_ERROR_LABELS: Record<string, string> = {
  "not-supported": "Voice not supported in this browser. Use Chrome on Android/desktop.",
  "permission-denied": "Microphone access denied. Allow mic in browser settings, then retry.",
  "no-speech": "No speech detected. Tap again and speak clearly.",
  "network": "Network error with speech service. Check connection.",
  "unknown": "Voice input failed. Try typing instead.",
};

type Exchange = { question: string; answer: string; logged: boolean };

export function AssistantPage() {
  const user = useAuthStore((s) => s.user);
  const { addAILog, cropEntries, soilType, setupComplete } = useFarmStore();

  const [lang, setLang] = useState(user?.language ?? "en");
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [lastExchange, setLastExchange] = useState<Exchange | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const prevTranscriptRef = useRef("");

  const { transcript, isListening, error: speechError, isSupported, start, stop, clearError } = useSpeechRecognition(lang);
  const aiChat = useAIChat();
  const { speak } = useSarvamTTS();

  // Rich farm context injected into AI prompt
  const farmContext = [
    user && `Farmer: ${user.name}`,
    user?.village && `Village: ${user.village}`,
    user?.farmSize && `Farm size: ${user.farmSize} acres`,
    user?.crops?.length && `Registered crops: ${user.crops.join(", ")}`,
    cropEntries.length > 0 &&
      `Current crop stages: ${cropEntries.map((c) => `${c.name} (${c.stage}, ${c.progress}% to harvest)`).join("; ")}`,
    soilType && `Soil type: ${soilType}`,
    !setupComplete && "Note: farm setup incomplete",
  ]
    .filter(Boolean)
    .join(". ") || "General farming context, Northeast India";

  // Trigger AI when speech ends and we have a new transcript
  useEffect(() => {
    if (!isListening && transcript && transcript !== prevTranscriptRef.current) {
      prevTranscriptRef.current = transcript;
      handleQuestion(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  // Keep orbState in sync: if recognition ends externally (timeout, error) reset to idle
  useEffect(() => {
    if (speechError) {
      setOrbState("idle");
    }
  }, [speechError]);

  useEffect(() => {
    if (!isListening && orbState === "listening") {
      setOrbState("idle");
    }
    // intentionally exclude orbState to avoid infinite loop — we only care when isListening drops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  async function handleQuestion(question: string) {
    setOrbState("thinking");
    try {
      const result = await aiChat.mutateAsync({ question, context: farmContext, language: lang });
      const answer = (result as { answer: string }).answer;

      // Auto-log every AI exchange to farmStore
      addAILog({ question, answer, language: lang });

      setLastExchange({ question, answer, logged: true });
      setOrbState("speaking");
      await speak(answer, lang);
    } catch {
      setLastExchange({
        question,
        answer: "Could not connect to AI. Check your internet and try again.",
        logged: false,
      });
    } finally {
      setOrbState("idle");
    }
  }

  async function handleOrbClick() {
    if (speechError) {
      clearError();
      return;
    }
    if (orbState === "idle") {
      const started = await start();
      if (started) setOrbState("listening");
    } else if (orbState === "listening") {
      stop();
      setOrbState("idle");
    }
    // thinking/speaking — ignore
  }

  async function handleTextSubmit() {
    const q = textInput.trim();
    if (!q) return;
    setTextInput("");
    setShowTextInput(false);
    await handleQuestion(q);
  }

  return (
    <AuthGuard>
      <AppLayout showFooter={false}>
        <div
          className="min-h-[calc(100vh-3.5rem)] flex flex-col lg:min-h-screen"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)/0.12) 0%, hsl(var(--background)) 40%, hsl(var(--primary)/0.08) 100%)",
          }}
        >
          {/* Language selector */}
          <div className="flex items-center justify-center gap-2 pt-8 px-4">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  lang === l.code
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-background/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Central area */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
            <VoiceOrb state={orbState} onClick={handleOrbClick} size={200} />

            {/* Status + error */}
            <div className="text-center space-y-2">
              <p className="text-xl font-medium">{STATUS_TEXT[orbState]}</p>
              {orbState === "listening" && transcript && (
                <p className="text-sm text-muted-foreground max-w-xs">"{transcript}"</p>
              )}
              {speechError && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-destructive max-w-sm">
                  {speechError === "permission-denied" ? (
                    <MicOff className="h-4 w-4 shrink-0" />
                  ) : speechError === "network" ? (
                    <WifiOff className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{SPEECH_ERROR_LABELS[speechError]}</span>
                </div>
              )}
              {!isSupported && !speechError && (
                <p className="text-xs text-muted-foreground">
                  Voice not available in this browser — use text input below.
                </p>
              )}
            </div>

            {/* Exchange display */}
            {lastExchange && orbState === "idle" && (
              <div className="w-full max-w-lg space-y-3">
                <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                    You asked
                  </div>
                  <p className="text-sm font-medium">{lastExchange.question}</p>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                      <Sprout className="h-3.5 w-3.5" /> Sanjaya answered
                    </div>
                    {lastExchange.logged && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <BookMarked className="h-3 w-3" />
                        <Check className="h-3 w-3" />
                        Logged
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{lastExchange.answer}</p>
                </div>
              </div>
            )}

            {/* Text input fallback */}
            {showTextInput ? (
              <div className="w-full max-w-lg flex gap-2">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleTextSubmit(); }}
                  placeholder="Type your question…"
                  className="flex-1 bg-background/80"
                  autoFocus
                />
                <Button onClick={handleTextSubmit} className="bg-primary hover:bg-primary/90" disabled={!textInput.trim() || orbState !== "idle"}>
                  Ask
                </Button>
                <Button variant="ghost" onClick={() => setShowTextInput(false)}>Cancel</Button>
              </div>
            ) : (
              orbState === "idle" && (
                <button
                  type="button"
                  onClick={() => setShowTextInput(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Keyboard className="h-3.5 w-3.5" />
                  Type instead
                </button>
              )
            )}
          </div>

          {/* Farm context footer strip */}
          {user && (
            <div className="border-t border-border/40 bg-background/60 backdrop-blur-sm px-4 py-3">
              <div className="container mx-auto flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> {user.village}
                </div>
                {cropEntries.length > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Sprout className="h-3 w-3" />
                    {cropEntries.map((c) => c.name).join(", ")}
                  </div>
                ) : user.crops.length > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Sprout className="h-3 w-3" />
                    {user.crops.slice(0, 2).join(", ")}
                    {user.crops.length > 2 && ` +${user.crops.length - 2}`}
                  </div>
                ) : null}
                {soilType && (
                  <div className="flex items-center gap-1.5">
                    <CloudSun className="h-3 w-3" /> {soilType} soil
                  </div>
                )}
                <div className="ml-auto font-medium text-primary">
                  {setupComplete ? "Full context loaded" : "Partial context — complete farm setup"}
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
