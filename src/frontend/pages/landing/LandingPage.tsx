import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Camera,
  CloudSun,
  Landmark,
  Mic,
  Sprout,
  TrendingUp,
  Users,
  Leaf,
  ShieldCheck,
  Volume2,
  Star,
  ClipboardList,
  Thermometer,
  CloudRain,
  Fingerprint,
  Smartphone,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card } from "@/frontend/components/ui/card";
import { SiteFooter } from "@/frontend/components/layout/SiteFooter";
import { useAuthStore } from "@/frontend/store/authStore";

const LANG_CHIPS = ["Hindi", "Nepali", "Bengali", "English", "हिन्दी", "नेपाली", "বাংলা"];

const STATS = [
  { value: "12,000+", label: "farmers" },
  { value: "340", label: "villages" },
  { value: "4", label: "languages" },
  { value: "24/7", label: "AI" },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Voice Assistant",
    desc: "Ask in any language, get answers instantly",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Camera,
    title: "Disease Detection",
    desc: "Photo → AI diagnosis in seconds",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    desc: "7-day hyperlocal forecast",
    color: "bg-sky/15 text-sky-foreground",
  },
  {
    icon: TrendingUp,
    title: "Market Prices",
    desc: "Live mandi rates + sell timing",
    color: "bg-harvest/20 text-harvest-foreground",
  },
  {
    icon: Landmark,
    title: "Government Schemes",
    desc: "Find subsidies you qualify for",
    color: "bg-soil/15 text-soil-foreground",
  },
];

// The physical workflow: a trained operator visits the field with testing
// hardware, records readings against the farmer's ID, and the farmer gets it
// back on their phone or by calling the AI. Each phase gets its own tone so
// the path reads as a real journey, not four identical cards.
const FIELD_WORKFLOW = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Operator visits the field",
    desc: "A trained Sanjaya field operator comes to your farm in person, on a scheduled village round.",
    more: "Visits are scheduled by village, so operators cover several farms in one round trip — no cost passed to you.",
    place: "At your farm",
    tone: "soil" as const,
  },
  {
    n: "02",
    icon: Thermometer,
    title: "On-site testing",
    desc: "Handheld soil, temperature and rainfall equipment records real readings from your actual plot.",
    more: "The same reading a soil-testing lab would take — pH, moisture and temperature, measured where your crop actually grows.",
    place: "In your soil",
    tone: "sky" as const,
  },
  {
    n: "03",
    icon: Fingerprint,
    title: "Saved to your farmer ID",
    desc: "Every reading is logged against your unique ID, building a real history of your field over time.",
    more: "Your farmer ID keeps every visit on record, so Sanjaya can compare this season to last and notice what's changed.",
    place: "In Sanjaya",
    tone: "primary" as const,
  },
  {
    n: "04",
    icon: Smartphone,
    title: "You see it, or you call",
    desc: "View results on your phone, or dial the toll-free number and ask the AI what it means.",
    more: "Nothing to install. Open the app to see the numbers, or just call — the AI already has your latest test in front of it.",
    place: "In your hand",
    tone: "harvest" as const,
  },
];

const TONE_STYLES = {
  soil: {
    badge: "bg-soil text-soil-foreground",
    text: "text-soil",
  },
  sky: {
    badge: "bg-sky text-sky-foreground",
    text: "text-sky-foreground",
  },
  primary: {
    badge: "bg-primary text-primary-foreground",
    text: "text-primary",
  },
  harvest: {
    badge: "bg-harvest text-harvest-foreground",
    text: "text-harvest-foreground",
  },
} as const;

const FIELD_BENEFITS = [
  {
    icon: ClipboardList,
    title: "Real data, not a guess",
    desc: "Soil, temperature and rainfall are measured on your own field by a person with proper equipment — the same figures an agronomist would trust.",
    tone: "soil" as const,
  },
  {
    icon: PhoneCall,
    title: "No smartphone required",
    desc: "Don't have a phone or don't want to type? Call the toll-free number and talk to the AI in your language — it already knows your test results.",
    tone: "harvest" as const,
  },
  {
    icon: CloudRain,
    title: "A history that grows",
    desc: "Every visit adds to your farmer ID's record, so advice gets sharper over seasons instead of starting fresh each time.",
    tone: "sky" as const,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Register farm profile",
    desc: "Tell Sanjaya your village, crops, and soil type. Done in 2 minutes.",
  },
  {
    n: "02",
    title: "Ask Sanjaya",
    desc: "Speak or type in Hindi, Nepali, Bengali or English. Sanjaya answers with farm context.",
  },
  {
    n: "03",
    title: "Act with confidence",
    desc: "Get clear actions on irrigation, fertilizer, market timing, and schemes.",
  },
];

const TESTIMONIALS = [
  {
    name: "Pemba Sherpa",
    village: "Gangtok, Sikkim",
    crop: "Cardamom",
    quote:
      "Sanjaya warned me about capsule rot 3 days before I noticed it. Saved my entire harvest.",
    initial: "P",
  },
  {
    name: "Asha Devi",
    village: "Darjeeling",
    crop: "Ginger",
    quote:
      "I doubled my income after Sanjaya told me when to sell. The voice assistant speaks Nepali — my whole family uses it.",
    initial: "A",
  },
  {
    name: "Ram Bahadur",
    village: "Ilam, Nepal",
    crop: "Rice",
    quote:
      "The field operator tested our soil last season, and now I just call the toll-free number whenever I need advice. Everything is in one place.",
    initial: "R",
  },
];

// Fades + slides an element in the first time it scrolls into view.
// One shared IntersectionObserver-per-instance, respects reduced motion.
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export function LandingPage() {
  const [chipIdx, setChipIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [openPhase, setOpenPhase] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const t = setInterval(() => {
      setChipIdx((i) => (i + 1) % LANG_CHIPS.length);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal header for landing */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-semibold">Sanjaya</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                  <Link to="/register">Register free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Mic className="h-3.5 w-3.5" />
              Voice-first AI for every farmer
            </div>
            <h1 className="mt-8 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              AI farming intelligence{" "}
              <span className="italic text-primary">for every village.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Ask Sanjaya about weather, crop diseases, market prices, and government schemes — by
              voice, in your language, in seconds.
            </p>

            {/* Animated language chips */}
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
              {LANG_CHIPS.slice(0, 4).map((lang, i) => (
                <span
                  key={lang}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition-all duration-500 ${
                    chipIdx % 4 === i
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/60 bg-muted text-muted-foreground"
                  }`}
                >
                  {lang}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 bg-primary text-primary-foreground shadow-warm hover:bg-primary/90"
              >
                <Link to="/register">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-2" disabled>
                Watch demo
              </Button>
            </div>
          </div>

          {/* Mock UI preview */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden">
                <div className="bg-muted/40 border-b border-border/60 px-4 py-3 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/50" />
                  <div className="h-3 w-3 rounded-full bg-harvest/50" />
                  <div className="h-3 w-3 rounded-full bg-primary/50" />
                  <div className="ml-4 text-xs text-muted-foreground">sanjaya.farm/dashboard</div>
                </div>
                <div className="p-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-primary/10 p-4 text-center">
                    <div className="font-display text-2xl font-bold text-primary">22°C</div>
                    <div className="text-xs text-muted-foreground mt-1">Rain in 24h</div>
                  </div>
                  <div className="rounded-xl bg-harvest/15 p-4 text-center">
                    <div className="font-display text-2xl font-bold text-harvest-foreground">
                      Rs 2,150
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Cardamom/kg ↑4.2%</div>
                  </div>
                  <div className="rounded-xl bg-sky/15 p-4 text-center">
                    <div className="font-display text-2xl font-bold text-sky-foreground">72</div>
                    <div className="text-xs text-muted-foreground mt-1">Soil health score</div>
                  </div>
                  <div className="sm:col-span-3 rounded-xl bg-muted/30 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Mic className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Sanjaya says:</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Skip irrigation today. Rain expected in 24h. Apply NPK after rain stops.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-warm">
                <span className="h-2 w-2 rounded-full bg-primary-foreground/60 animate-pulse" />
                Live AI
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/60 bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl font-bold text-primary">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Field testing workflow */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              How your field gets tested
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              A person visits. Real hardware tests your soil. You get the answer.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sanjaya isn't only an app — a trained field operator carries soil, temperature and
              rainfall testing equipment to your farm, records it against your farmer ID, and you
              get it back on your phone or by calling our AI.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">Tap a phase to see more.</p>
          </Reveal>

          {/* Connected path: a literal line from field to phone, one badge per phase */}
          <div className="relative mt-16">
            {/* the connecting line — horizontal on desktop, vertical on mobile */}
            <div
              className="absolute left-6 top-6 bottom-6 w-px bg-linear-to-b from-soil/50 via-sky/50 to-harvest/50 md:left-0 md:right-0 md:top-8 md:h-px md:w-auto md:bg-linear-to-r"
              aria-hidden="true"
            />
            <div className="grid gap-10 md:grid-cols-4 md:gap-6">
              {FIELD_WORKFLOW.map((step, i) => {
                const tone = TONE_STYLES[step.tone];
                const isOpen = openPhase === step.n;
                return (
                  <Reveal key={step.n} delay={i * 120} className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenPhase(isOpen ? null : step.n)}
                      aria-expanded={isOpen}
                      className="group flex w-full gap-4 rounded-xl text-left transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:flex-col md:gap-0 md:text-center"
                    >
                      {/* icon badge sitting directly on the connecting line */}
                      <div className="relative shrink-0 md:flex md:justify-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ring-4 ring-background ${tone.badge} shadow-md transition-transform duration-300 group-hover:scale-110 ${isOpen ? "scale-110" : ""}`}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="md:mt-5">
                        <div
                          className={`font-mono text-[11px] font-semibold uppercase tracking-widest ${tone.text}`}
                        >
                          Phase {step.n} · {step.place}
                        </div>
                        <h3 className="mt-1 font-display text-lg font-semibold">{step.title}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground md:mx-auto md:max-w-[22ch]">
                          {step.desc}
                        </p>
                      </div>
                    </button>
                    {/* expandable detail */}
                    <div
                      className={`grid overflow-hidden transition-all duration-300 ease-out ${
                        isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0">
                        <div
                          className={`rounded-lg border-l-2 bg-muted/40 p-3 text-left text-xs leading-relaxed text-muted-foreground md:mx-auto md:max-w-[26ch] ${
                            step.tone === "soil"
                              ? "border-soil"
                              : step.tone === "sky"
                                ? "border-sky"
                                : step.tone === "primary"
                                  ? "border-primary"
                                  : "border-harvest"
                          }`}
                        >
                          {step.more}
                        </div>
                      </div>
                    </div>
                    {/* arrow between phases, desktop only */}
                    {i < FIELD_WORKFLOW.length - 1 && (
                      <div
                        className="absolute top-4 hidden text-muted-foreground/50 md:block"
                        style={{ left: "calc(100% - 8px)" }}
                        aria-hidden="true"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {FIELD_BENEFITS.map((b, i) => {
              const tone = TONE_STYLES[b.tone];
              return (
                <Reveal key={b.title} delay={i * 100}>
                  <Card className="border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone.badge}`}
                    >
                      <b.icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="mt-3 font-display text-base font-semibold">{b.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center sm:flex-row sm:justify-center sm:text-left">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-warm">
                <PhoneCall className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="font-display text-lg font-semibold">
                Prefer to talk? Call our toll-free number.
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                No smartphone, no app, no typing — just call and speak to Sanjaya's AI in Hindi,
                Nepali, Bengali or English about your latest field test.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Everything you need
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold">Built for real farmers</h2>
            <p className="mt-4 text-muted-foreground">
              Five powerful features in one platform — voice-enabled, multilingual, and backed by
              real field visits.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <Card className="group border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              How it works
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold">Simple for every farmer</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <Card key={s.n} className="relative border-border/60 bg-card p-7 overflow-hidden">
                <div className="font-display text-6xl font-bold text-primary/15 absolute -top-2 -right-2 leading-none">
                  {s.n}
                </div>
                <div className="font-display text-5xl font-semibold text-primary/30">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Voice demo section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Voice demo
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Tap and ask anything about your farm
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sanjaya listens in Hindi, Nepali, Bengali, and English — and speaks back in the same
              language.
            </p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <button
                type="button"
                onClick={() => setListening((v) => !v)}
                className="relative flex h-36 w-36 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                style={{
                  background: listening ? "hsl(var(--destructive))" : "hsl(var(--primary))",
                  boxShadow: listening
                    ? "0 0 0 8px hsl(var(--destructive)/0.15), 0 0 32px hsl(var(--destructive)/0.3)"
                    : "0 0 0 8px hsl(var(--primary)/0.15), 0 0 32px hsl(var(--primary)/0.2)",
                }}
              >
                {listening && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
                    <span className="absolute -inset-4 rounded-full border border-destructive/20 animate-ping" />
                  </>
                )}
                {listening ? (
                  <Volume2 className="h-16 w-16 text-white relative z-10" />
                ) : (
                  <Mic className="h-16 w-16 text-white relative z-10" />
                )}
              </button>
              <p className="text-sm font-medium text-muted-foreground">
                {listening ? "Listening... (tap to stop)" : "Tap to speak"}
              </p>
              {/* Language chips */}
              <div className="flex gap-2 flex-wrap justify-center">
                {["English", "हिन्दी", "नेपाली", "বাংলা"].map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Farmer stories
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold">Trusted across the hills</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.name}
                className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.village} · {t.crop}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-harvest text-harvest" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-foreground/90 leading-relaxed">"{t.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Govt. partnered
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              340 villages
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              12,000+ farmers
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary" />
              Voice-first
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="border-border/60 bg-gradient-to-br from-primary/5 via-card to-card p-8 md:p-12 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Ready to start
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold">Join 12,000+ farmers today</h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Register free in 2 minutes. Get personalized AI advice by voice, from day one.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 gap-2 bg-primary hover:bg-primary/90">
                <Link to="/register">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already a farmer?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login here
              </Link>
            </p>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
