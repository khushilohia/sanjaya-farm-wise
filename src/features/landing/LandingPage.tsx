import { Link } from "@tanstack/react-router";
import {
  Bot,
  CloudSun,
  TrendingUp,
  Camera,
  Landmark,
  Store,
  Mic,
  QrCode,
  ArrowRight,
  Sparkles,
  Leaf,
  Users,
  ShieldCheck,
  Sprout,
  Radio,
  MapPin,
  Wheat,
} from "lucide-react";
import heroImg from "@/assets/hero-farm.jpg";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { IconCard } from "@/components/cards/IconCard";
import { StatCard } from "@/components/cards/StatCard";
import { VoiceCTA } from "@/components/widgets/VoiceCTA";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const QUICK_ACCESS = [
  {
    icon: Bot,
    title: "Ask AI Assistant",
    desc: "Voice or text answers in your language",
    to: "/assistant",
    tone: "primary",
  },
  {
    icon: CloudSun,
    title: "Weather Updates",
    desc: "7-day forecast & smart alerts",
    to: "/weather",
    tone: "sky",
  },
  {
    icon: TrendingUp,
    title: "Market Prices",
    desc: "Live mandi rates & demand trends",
    to: "/market",
    tone: "harvest",
  },
  {
    icon: Camera,
    title: "Disease Detection",
    desc: "Snap a photo, get a diagnosis",
    to: "/disease-detection",
    tone: "destructive",
  },
  {
    icon: Landmark,
    title: "Government Schemes",
    desc: "Find subsidies you qualify for",
    to: "/schemes",
    tone: "soil",
  },
  {
    icon: Store,
    title: "Buyer Marketplace",
    desc: "List produce & connect to buyers",
    to: "/market",
    tone: "primary",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Pemba Sherpa",
    village: "Gangtok, Sikkim",
    crop: "Cardamom",
    quote:
      "Sanjaya warned me about capsule rot 3 days before I noticed it. Saved my entire harvest.",
  },
  {
    name: "Asha Devi",
    village: "Darjeeling",
    crop: "Ginger",
    quote:
      "I doubled my income after Sanjaya told me when to sell. The voice assistant speaks Nepali  -  my whole family uses it.",
  },
  {
    name: "Ram Bahadur",
    village: "Ilam, Nepal",
    crop: "Rice",
    quote:
      "The kiosk in our village changed how we farm. We get weather alerts, scheme updates, everything in one place.",
  },
];

const SCHEMES = [
  { title: "PM-Kisan Samman Nidhi", amount: "Rs 6,000/year", tag: "Direct benefit" },
  { title: "Soil Health Card Scheme", amount: "Free testing", tag: "Soil analysis" },
  { title: "Pradhan Mantri Fasal Bima", amount: "Up to 90% subsidy", tag: "Crop insurance" },
];

const ADVISORIES = [
  {
    icon: Sprout,
    title: "Crop advisory",
    desc: "Which crop to plant this season based on soil and market demand.",
    tone: "harvest",
  },
  {
    icon: Wheat,
    title: "Nutrition planning",
    desc: "Fertilizer mix and dosage recommendations per crop stage.",
    tone: "soil",
  },
  {
    icon: Radio,
    title: "Pest early warning",
    desc: "Moisture + weather risk alerts to prevent disease outbreaks.",
    tone: "destructive",
  },
] as const;

export function LandingPage() {
  return (
    <PageShell mainClassName="bg-farm-gradient">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Farmer walking through terraced fields at dawn"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/30" />
        </div>
        <div className="container relative mx-auto grid gap-10 px-4 py-20 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Audio-first AI for every farmer
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Your farm's <span className="italic text-primary">wisest</span> companion.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Sanjaya combines real-time weather, soil intelligence, market data and your farm's
              history to give advice that's truly personal  -  in Hindi, Nepali, Bengali, English,
              and local dialects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 gap-2 bg-primary text-primary-foreground shadow-warm hover:bg-primary/90">
                <Link to="/register">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2">
                <Link to="/assistant">
                  <Mic className="h-4 w-4" /> Talk to Sanjaya
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard label="Farmers" value="12k+" helper="Across 340 villages" tone="harvest" />
              <StatCard label="Advisories" value="98%" helper="Voice comprehension" tone="sky" />
              <StatCard label="Alerts" value="24/7" helper="Weather + pest" tone="primary" />
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 12,000+ farmers</div>
              <div className="flex items-center gap-2"><Leaf className="h-4 w-4" /> 340 villages</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Govt. partnered</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <div className="w-full max-w-sm space-y-4">
              <WeatherWidget location="Gangtok" />
              <Card className="border-border/60 bg-card p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <MapPin className="h-3.5 w-3.5" /> Your farm context
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between"><span>Soil</span><span className="font-medium">Loamy, pH 6.2</span></div>
                  <div className="flex items-center justify-between"><span>Crop</span><span className="font-medium">Cardamom  -  Flowering</span></div>
                  <div className="flex items-center justify-between"><span>Market</span><span className="font-medium">Rs 2,150/kg (↑4.2%)</span></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Everything in one place"
          title="Quick access"
          subtitle="Jump straight into the tools farmers need the most. Every module is voice-enabled and kiosk-ready."
          action={
            <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">
              Open dashboard {'>'}
            </Link>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACCESS.map((item) => (
            <Link key={item.title} to={item.to}>
              <IconCard
                icon={item.icon}
                title={item.title}
                description={item.desc}
                tone={item.tone}
              >
                <div className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </IconCard>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="How Sanjaya works"
            title="Three steps to smarter farming"
            align="center"
            subtitle="From kiosk onboarding to personalized AI, everything is designed to be simple and voice-first."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Register your farm",
                desc: "Tell us your village, crops, and soil. Or scan a QR at your village kiosk.",
              },
              {
                n: "02",
                title: "Ask anything",
                desc: "Speak or type in your language. Sanjaya knows your weather, soil and history.",
              },
              {
                n: "03",
                title: "Act with confidence",
                desc: "Get clear advice on irrigation, fertilizer, pests, market timing  -  instantly.",
              },
            ].map((s) => (
              <Card key={s.n} className="border-border/60 bg-card p-7">
                <div className="font-display text-5xl font-semibold text-primary/30">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading
              eyebrow="Audio-first assistance"
              title="Built for voice and low literacy"
              subtitle="Sanjaya listens first. Farmers can ask questions, receive spoken answers, and navigate the kiosk without typing."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <IconCard
                icon={Mic}
                title="Voice navigation"
                description="Wake word support and guided audio prompts at every step."
                tone="primary"
              />
              <IconCard
                icon={Radio}
                title="Spoken alerts"
                description="Critical weather and pest warnings arrive via audio + SMS."
                tone="sky"
              />
            </div>
          </div>
          <VoiceCTA />
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Crop advisory showcase"
            title="Daily guidance, tailored to your farm"
            subtitle="Sanjaya combines soil data, crop stage, and market trends to recommend the right action for today."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {ADVISORIES.map((item) => (
              <IconCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.desc}
                tone={item.tone}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card p-7 lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Landmark className="h-3.5 w-3.5" /> Government schemes
            </div>
            <h3 className="mt-2 font-display text-2xl font-semibold">Subsidies you may qualify for</h3>
            <div className="mt-5 space-y-3">
              {SCHEMES.map((s) => (
                <div key={s.title} className="flex items-center justify-between rounded-xl border border-border/60 bg-background p-4">
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.tag}</div>
                  </div>
                  <div className="text-sm font-semibold text-primary">{s.amount}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex flex-col items-center justify-center border-border/60 bg-linear-to-br from-primary to-primary-glow p-8 text-primary-foreground shadow-warm">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <QrCode className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-center font-display text-2xl font-semibold">
              Visit a village kiosk
            </h3>
            <p className="mt-2 text-center text-sm opacity-90">
              Scan the QR at any Sanjaya kiosk to register in 30 seconds  -  no smartphone needed.
            </p>
            <Button asChild variant="secondary" className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/kiosk">Find a kiosk near me</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Kiosk ready"
            title="Made for village touch screens"
            subtitle="Large buttons, offline mode, and shared access for entire communities."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <IconCard
              icon={QrCode}
              title="QR quick login"
              description="Scan once, save your profile, and reuse across kiosks."
              tone="harvest"
            />
            <IconCard
              icon={Mic}
              title="Voice guidance"
              description="Hands-free navigation for farmers with low literacy."
              tone="primary"
            />
            <IconCard
              icon={Store}
              title="Offline sync"
              description="Recent advice, alerts, and records sync when internet returns."
              tone="sky"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Farmer stories"
          title="Trusted across the hills"
          subtitle="Real outcomes from farmers using Sanjaya every season."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-border/60 bg-linear-to-br from-card to-secondary/40 p-6">
              <div className="font-display text-3xl leading-none text-primary/40">"</div>
              <p className="mt-2 text-foreground/90">{t.quote}</p>
              <div className="mt-6 border-t border-border/60 pt-4">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t.village}  -  {t.crop} farmer
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <Card className="border-border/60 bg-linear-to-br from-card via-secondary/40 to-card p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Ready to start</div>
              <h3 className="mt-2 font-display text-3xl font-semibold">Bring Sanjaya to your village today</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Register in minutes and get instant, audio-first farming advice.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/register">Create free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/assistant">Try the voice assistant</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
