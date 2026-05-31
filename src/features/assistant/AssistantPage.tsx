import { useState } from "react";
import {
  Sparkles,
  MapPin,
  CloudSun,
  Droplets,
  Sprout,
  ShieldCheck,
  Globe,
  MessageSquare,
  Volume2,
  Send,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoiceButton from "@/components/voice/VoiceButton";

const CONTEXT = [
  { icon: MapPin, label: "Location", value: "Gangtok, Sikkim" },
  { icon: CloudSun, label: "Weather", value: "22°C — Rain in 48h" },
  { icon: Droplets, label: "Soil", value: "Loamy — pH 6.2" },
  { icon: Sprout, label: "Crops", value: "Cardamom — Ginger" },
];

const CAPABILITIES = [
  {
    icon: MessageSquare,
    title: "Natural language queries",
    desc: "Ask about irrigation, fertilizer, pests, or harvest in simple words.",
    tone: "primary",
  },
  {
    icon: Volume2,
    title: "Voice in / voice out",
    desc: "Speak naturally and get spoken answers in your dialect.",
    tone: "sky",
  },
  {
    icon: Globe,
    title: "Multilingual support",
    desc: "Hindi, Nepali, Bengali, English, and local languages.",
    tone: "harvest",
  },
  {
    icon: ShieldCheck,
    title: "Context aware",
    desc: "Sanjaya remembers your farm profile and past questions.",
    tone: "soil",
  },
];

type Message = {
  id: number;
  role: "farmer" | "ai";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  { id: 1, role: "farmer", text: "Should I irrigate my rice field today?" },
  {
    id: 2,
    role: "ai",
    text: "Skip irrigation today. Heavy rain expected in 24h. Soil moisture is already high.",
  },
  { id: 3, role: "farmer", text: "क्या मुझे आज सिंचाई करनी चाहिए?" },
  {
    id: 4,
    role: "ai",
    text: "आज सिंचाई न करें। 24 घंटों में बारिश होने की संभावना है।",
  },
];

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [listening, setListening] = useState(false);

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    const newId = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { id: newId, role: "farmer", text },
      {
        id: newId + 1,
        role: "ai",
        text: "I'm analyzing your farm context to give you the best advice. Please wait a moment.",
      },
    ]);
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  function toggleListening() {
    setListening((v) => !v);
  }

  return (
    <PageShell>
      {/* Section A — Interactive AI Chat */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Audio-first AI assistant
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Chat panel */}
            <Card className="border-border/60 bg-card flex flex-col" style={{ minHeight: "520px" }}>
              <div className="border-b border-border/40 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Sanjaya AI</div>
                    <div className="text-xs text-muted-foreground">Online — Context loaded</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-primary font-medium">Live</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 px-5 py-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "farmer" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Sprout className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "farmer"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted/60 text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {listening && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                      <span className="animate-pulse">Listening...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-border/40 px-5 py-4">
                <div className="flex items-center gap-3">
                  <VoiceButton
                    size="md"
                    listening={listening}
                    onClick={toggleListening}
                  />
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type or speak in any language..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="bg-primary hover:bg-primary/90 shrink-0"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Farm context panel */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Farm context
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {CONTEXT.map((item) => (
                  <Card key={item.label} className="border-border/60 bg-card p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <item.icon className="h-3.5 w-3.5" /> {item.label}
                    </div>
                    <div className="mt-2 text-sm font-semibold">{item.value}</div>
                  </Card>
                ))}
              </div>
              <Card className="border-border/60 bg-primary/5 p-4 mt-2">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                  Voice flow
                </div>
                <div className="space-y-2">
                  {[
                    "Farmer speaks in their language",
                    "Speech-to-text converts the query",
                    "AI enriches with farm context",
                    "Voice response is played back",
                  ].map((step) => (
                    <div key={step} className="flex items-start gap-2.5 rounded-lg bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {step}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section B — Context enrichment */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="How context works"
          title="Every answer is farm-enriched"
          subtitle="Sanjaya combines your location, live weather, soil data, and crop stage before responding."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTEXT.map((item) => (
            <Card key={item.label} className="border-border/60 bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {item.label}
              </div>
              <div className="mt-1 text-sm font-semibold">{item.value}</div>
            </Card>
          ))}
        </div>
        <div className="mt-12">
          <SectionHeading
            eyebrow="What you can ask"
            title="Designed for real farm decisions"
            subtitle="From irrigation timing to pest management, Sanjaya answers with actionable, local recommendations."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((item) => (
              <IconCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.desc}
                tone={item.tone as "primary"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section C — Voice flow explanation */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Example workflow"
              title="Voice to answer in seconds"
              subtitle="Every question is auto-enriched with context so farmers get clear, confident actions."
            />
            <div className="mt-6 space-y-4">
              <Card className="border-border/60 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Farmer</div>
                <p className="mt-2 text-sm">"Should I irrigate my rice field today?"</p>
              </Card>
              <Card className="border-border/60 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Sanjaya checks</div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Rain forecast — 68% chance in next 24h</li>
                  <li>Soil moisture — High</li>
                  <li>Crop stage — Tillering</li>
                  <li>Humidity — 82%</li>
                </ul>
              </Card>
              <Card className="border-border/60 bg-primary/10 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">AI answer</div>
                <p className="mt-2 text-sm">
                  "Skip irrigation today. Rain is expected within 24 hours. Check moisture again tomorrow."
                </p>
              </Card>
            </div>
          </div>
          <div className="self-center">
            <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                <Sparkles className="h-3.5 w-3.5" /> Powered by Sanjaya
              </div>
              <div className="flex flex-col items-center gap-6">
                <VoiceButton size="xl" label="Press to speak" />
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  Tap the button above and ask anything about your farm in Hindi, Nepali, Bengali, or English.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
