import { useState, useEffect, useRef, useCallback } from "react";
import {
  Keyboard,
  MapPin,
  CloudSun,
  Sprout,
  MicOff,
  WifiOff,
  AlertCircle,
  Radio,
  Square,
  Trash2,
  Send,
} from "lucide-react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AppLayout } from "@/app/layouts/AppLayout";
import { VoiceOrb, type OrbState } from "@/features/ai-assistant/components/VoiceOrb";
import { useVoiceInput } from "@/features/ai-assistant/hooks/useVoiceInput";
import { useAIChat, type ChatTurn } from "@/features/ai-assistant/hooks/useAIChat";
import { useSarvamTTS } from "@/features/ai-assistant/hooks/useSarvamTTS";
import { useAuthStore } from "@/store/authStore";
import { useFarmStore } from "@/store/farmStore";
import { useWeather } from "@/features/weather/hooks/useWeather";
import { weatherCodeToLabel } from "@/features/weather/api/openmeteo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ne", label: "नेपाली" },
  { code: "bn", label: "বাংলা" },
];

const STATUS_TEXT: Record<OrbState, string> = {
  idle: "Tap the orb and ask anything",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

const SPEECH_ERROR_LABELS: Record<string, string> = {
  "permission-denied":
    "Microphone access denied. Allow mic in browser settings, then retry.",
  "no-speech": "No speech detected. Tap again and speak clearly.",
  network: "Network error reaching the voice service. Check your connection.",
  unknown: "Voice input failed. Try typing instead.",
};

const STARTERS: Record<string, string[]> = {
  en: [
    "When should I plant cardamom this season?",
    "My ginger leaves are turning yellow, what should I do?",
    "How much urea per acre for maize?",
  ],
  hi: [
    "इस मौसम में इलायची कब बोनी चाहिए?",
    "मेरे अदरक के पत्ते पीले हो रहे हैं, क्या करूँ?",
    "मक्का के लिए प्रति एकड़ कितना यूरिया डालें?",
  ],
  ne: [
    "यो सिजनमा अलैंची कहिले रोप्ने?",
    "मेरो अदुवाको पात पहेँलो हुँदैछ, के गर्ने?",
    "मकैका लागि प्रति एकड कति युरिया हाल्ने?",
  ],
  bn: [
    "এই মৌসুমে এলাচ কখন রোপণ করব?",
    "আমার আদার পাতা হলুদ হয়ে যাচ্ছে, কী করব?",
    "ভুট্টার জন্য একর প্রতি কত ইউরিয়া দেব?",
  ],
};

type Message = { role: "user" | "assistant"; content: string };

export function AssistantPage() {
  const user = useAuthStore((s) => s.user);
  const { addAILog, cropEntries, soilType, setupComplete } = useFarmStore();
  const { data: weather } = useWeather();

  const [lang, setLang] = useState(user?.language ?? "en");
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveMode, setLiveMode] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");

  const aiChat = useAIChat();
  const { speak, stop: stopSpeaking } = useSarvamTTS();
  const liveModeRef = useRef(false);
  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const farmContext =
    [
      user && `Farmer: ${user.name}`,
      user?.village && `Village: ${user.village}`,
      user?.farmSize && `Farm size: ${user.farmSize} acres`,
      user?.crops?.length && `Registered crops: ${user.crops.join(", ")}`,
      cropEntries.length > 0 &&
        `Current crop stages: ${cropEntries
          .map((c) => `${c.name} (${c.stage}, ${c.progress}% to harvest)`)
          .join("; ")}`,
      soilType && `Soil type: ${soilType}`,
      weather?.current &&
        `Today's weather: ${weatherCodeToLabel(weather.current.weather_code)}, ${Math.round(
          weather.current.temperature_2m
        )}°C, humidity ${weather.current.relative_humidity_2m}%, rain chance ${
          weather.current.precipitation_probability
        }%`,
      weather?.daily &&
        `Next days rain chance: ${weather.daily.precipitation_probability_max
          .slice(0, 3)
          .map((p) => `${p}%`)
          .join(", ")}`,
      !setupComplete && "Note: farm setup incomplete",
    ]
      .filter(Boolean)
      .join(". ") || "General farming context, Northeast India / Nepal";

  const handleQuestion = useCallback(
    async (question: string) => {
      setOrbState("thinking");
      setMessages((m) => [...m, { role: "user", content: question }]);

      // Pass recent turns for conversational memory.
      const history: ChatTurn[] = messagesRef.current.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const result = await aiChat.mutateAsync({
          question,
          context: farmContext,
          language: lang,
          history,
        });
        const answer = (result as { answer: string }).answer;
        addAILog({ question, answer, language: lang });
        setMessages((m) => [...m, { role: "assistant", content: answer }]);

        setOrbState("speaking");
        await speak(answer, lang);
      } catch (err) {
        const msg =
          err instanceof Error && err.message
            ? err.message
            : "Could not reach the AI. Check your internet and try again.";
        setMessages((m) => [...m, { role: "assistant", content: msg }]);
      } finally {
        setOrbState("idle");
        // Hands-free: reopen the mic for the next turn automatically.
        if (liveModeRef.current) {
          setTimeout(() => {
            if (liveModeRef.current) startListening();
          }, 400);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [aiChat, farmContext, lang, addAILog, speak]
  );

  const onFinalTranscript = useCallback(
    (text: string) => {
      handleQuestion(text);
    },
    [handleQuestion]
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

  const startListening = useCallback(async () => {
    const started = await start();
    if (started) setOrbState("listening");
  }, [start]);

  // Reflect transcription state in the orb.
  useEffect(() => {
    if (isTranscribing) setOrbState("thinking");
  }, [isTranscribing]);

  // Reset orb to idle if recognition ends without producing a question.
  useEffect(() => {
    if (!isListening && orbState === "listening" && !isTranscribing) {
      setOrbState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, isTranscribing]);

  useEffect(() => {
    if (speechError) {
      setOrbState("idle");
      liveModeRef.current = false;
      setLiveMode(false);
    }
  }, [speechError]);

  // Auto-scroll the conversation thread.
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, orbState]);

  async function handleOrbClick() {
    if (speechError) {
      clearError();
      return;
    }
    if (orbState === "idle") {
      await startListening();
    } else if (orbState === "listening") {
      stop();
      setOrbState("idle");
    } else if (orbState === "speaking") {
      stopSpeaking();
      setOrbState("idle");
    }
  }

  function toggleLiveMode() {
    const next = !liveMode;
    setLiveMode(next);
    liveModeRef.current = next;
    if (next && orbState === "idle") {
      startListening();
    } else if (!next) {
      stop();
      stopSpeaking();
      setOrbState("idle");
    }
  }

  async function handleTextSubmit() {
    const q = textInput.trim();
    if (!q || orbState !== "idle") return;
    setTextInput("");
    await handleQuestion(q);
  }

  function clearConversation() {
    stopSpeaking();
    setMessages([]);
  }

  const starters = STARTERS[lang] ?? STARTERS.en;

  return (
    <AuthGuard>
      <AppLayout showFooter={false}>
        <div
          className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-screen"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)/0.12) 0%, hsl(var(--background)) 40%, hsl(var(--primary)/0.08) 100%)",
          }}
        >
          {/* Top bar: language + live toggle */}
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 pt-6">
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
            <button
              type="button"
              onClick={toggleLiveMode}
              className={`ml-2 flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                liveMode
                  ? "border-destructive bg-destructive text-white"
                  : "border-border/60 bg-background/60 text-muted-foreground hover:border-primary/40"
              }`}
              title="Hands-free conversation — Sanjaya listens again after each answer"
            >
              <Radio className="h-3.5 w-3.5" />
              {liveMode ? "Live talk on" : "Live talk"}
            </button>
          </div>

          {/* Conversation thread */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto w-full max-w-2xl space-y-4">
              {messages.length === 0 && orbState === "idle" && (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Ask about crops, weather, pests, fertilizer, market prices, or
                    schemes — by voice or text, in your language.
                  </p>
                  <div className="flex flex-col items-stretch gap-2 sm:items-center">
                    {starters.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleQuestion(s)}
                        className="rounded-xl border border-border/60 bg-background/70 px-4 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary/5 sm:max-w-md"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-primary/20 bg-background/85 backdrop-blur-sm"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                        <Sprout className="h-3.5 w-3.5" /> Sanjaya
                      </div>
                    )}
                    {m.content}
                  </div>
                </div>
              ))}

              {orbState === "thinking" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-primary/20 bg-background/85 px-4 py-3 text-sm text-muted-foreground">
                    Sanjaya is thinking…
                  </div>
                </div>
              )}
              <div ref={threadEndRef} />
            </div>
          </div>

          {/* Orb + controls */}
          <div className="flex flex-col items-center gap-3 px-4 pb-4">
            <VoiceOrb state={orbState} onClick={handleOrbClick} size={132} />

            <div className="min-h-6 text-center">
              <p className="text-sm font-medium">
                {isTranscribing ? "Transcribing…" : STATUS_TEXT[orbState]}
              </p>
              {orbState === "listening" && interim && (
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  "{interim}"
                </p>
              )}
            </div>

            {speechError && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
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

            {/* Secondary controls */}
            <div className="flex items-center gap-2">
              {orbState === "speaking" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    stopSpeaking();
                    setOrbState("idle");
                  }}
                >
                  <Square className="h-3.5 w-3.5" /> Stop
                </Button>
              )}
              <button
                type="button"
                onClick={() => setShowTextInput((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Keyboard className="h-3.5 w-3.5" /> Type instead
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearConversation}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>

            {showTextInput && (
              <div className="flex w-full max-w-lg gap-2">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTextSubmit();
                  }}
                  placeholder="Type your question…"
                  className="flex-1 bg-background/80"
                  autoFocus
                />
                <Button
                  onClick={handleTextSubmit}
                  className="gap-1.5 bg-primary hover:bg-primary/90"
                  disabled={!textInput.trim() || orbState !== "idle"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Farm context footer strip */}
          {user && (
            <div className="border-t border-border/40 bg-background/60 px-4 py-2.5 backdrop-blur-sm">
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
                  {setupComplete
                    ? "Full context loaded"
                    : "Partial context — complete farm setup"}
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
