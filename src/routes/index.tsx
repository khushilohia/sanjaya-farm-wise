import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot, CloudSun, TrendingUp, Camera, Landmark, Store,
  Mic, QrCode, ArrowRight, Sparkles, Leaf, Users, ShieldCheck,
} from "lucide-react";
import heroImg from "@/assets/hero-farm.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanjaya — AI Farming Assistant for Every Village" },
      { name: "description", content: "Real-time weather, market prices, crop disease detection, and AI-powered farming advice in your language. Built for kiosks and mobile." },
    ],
  }),
  component: Landing,
});

const QUICK_ACCESS = [
  { icon: Bot, title: "Ask AI Assistant", desc: "Voice or text answers in your language", to: "/assistant", tint: "bg-primary/10 text-primary" },
  { icon: CloudSun, title: "Weather Updates", desc: "7-day forecast & smart alerts", to: "/weather", tint: "bg-sky/15 text-sky-foreground" },
  { icon: TrendingUp, title: "Market Prices", desc: "Live mandi rates & demand trends", to: "/market", tint: "bg-harvest/20 text-harvest-foreground" },
  { icon: Camera, title: "Disease Detection", desc: "Snap a photo, get a diagnosis", to: "/disease-detection", tint: "bg-destructive/10 text-destructive" },
  { icon: Landmark, title: "Government Schemes", desc: "Find subsidies you qualify for", to: "/schemes", tint: "bg-soil/15 text-soil" },
  { icon: Store, title: "Buyer Marketplace", desc: "List produce & connect to buyers", to: "/market", tint: "bg-primary/10 text-primary" },
];

const TESTIMONIALS = [
  { name: "Pemba Sherpa", village: "Gangtok, Sikkim", crop: "Cardamom", quote: "Sanjaya warned me about capsule rot 3 days before I noticed it. Saved my entire harvest." },
  { name: "Asha Devi", village: "Darjeeling", crop: "Ginger", quote: "I doubled my income after Sanjaya told me when to sell. The voice assistant speaks Nepali — my whole family uses it." },
  { name: "Ram Bahadur", village: "Ilam, Nepal", crop: "Rice", quote: "The kiosk in our village changed how we farm. We get weather alerts, scheme updates, everything in one place." },
];

const SCHEMES = [
  { title: "PM-Kisan Samman Nidhi", amount: "₹6,000/year", tag: "Direct benefit" },
  { title: "Soil Health Card Scheme", amount: "Free testing", tag: "Soil analysis" },
  { title: "Pradhan Mantri Fasal Bima", amount: "Up to 90% subsidy", tag: "Crop insurance" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Farmer walking through terraced fields at dawn"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="container relative mx-auto grid gap-10 px-4 py-20 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Context-aware AI for every farmer
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Your farm's <span className="italic text-primary">wisest</span> companion.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Sanjaya combines real-time weather, soil intelligence, market data and your farm's
              history to give advice that's actually <em>yours</em> — in Hindi, Nepali, Bengali,
              English, and your local language.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 gap-2 bg-primary text-primary-foreground shadow-warm hover:bg-primary/90">
                <Link to="/register">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2">
                <Link to="/assistant">
                  <Mic className="h-4 w-4" /> Try voice assistant
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 12,000+ farmers</div>
              <div className="flex items-center gap-2"><Leaf className="h-4 w-4" /> 340 villages</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Govt. partnered</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <div className="w-full max-w-sm">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Everything in one place</div>
            <h2 className="mt-2 font-display text-4xl font-semibold">Quick access</h2>
          </div>
          <Link to="/dashboard" className="hidden text-sm font-medium text-primary hover:underline md:inline">
            Open dashboard →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACCESS.map(({ icon: Icon, title, desc, to, tint }) => (
            <Link key={title} to={to}>
              <Card className="group h-full cursor-pointer border-border/60 p-6 transition-all hover:-translate-y-1 hover:shadow-warm">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">How Sanjaya works</div>
            <h2 className="mt-2 font-display text-4xl font-semibold">Three steps to smarter farming</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", title: "Register your farm", desc: "Tell us your village, crops, and soil. Or scan a QR at your village kiosk." },
              { n: "02", title: "Ask anything", desc: "Speak or type in your language. Sanjaya knows your weather, soil and history." },
              { n: "03", title: "Act with confidence", desc: "Get clear advice on irrigation, fertilizer, pests, market timing — instantly." },
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

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Farmer stories</div>
          <h2 className="mt-2 font-display text-4xl font-semibold">Trusted across the hills</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
              <div className="font-display text-3xl leading-none text-primary/40">"</div>
              <p className="mt-2 text-foreground/90">{t.quote}</p>
              <div className="mt-6 border-t border-border/60 pt-4">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.village} · {t.crop} farmer</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Schemes + QR */}
      <section className="container mx-auto px-4 pb-20">
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
          <Card className="flex flex-col items-center justify-center border-border/60 bg-gradient-to-br from-primary to-primary-glow p-8 text-primary-foreground shadow-warm">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <QrCode className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-center font-display text-2xl font-semibold">
              Visit a village kiosk
            </h3>
            <p className="mt-2 text-center text-sm opacity-90">
              Scan the QR at any Sanjaya kiosk to register in 30 seconds — no smartphone needed.
            </p>
            <Button asChild variant="secondary" className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/register">Find a kiosk near me</Link>
            </Button>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
