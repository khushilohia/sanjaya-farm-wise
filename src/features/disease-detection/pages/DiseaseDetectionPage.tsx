import { useState } from "react";
import { Camera, ShieldCheck, Droplets, Leaf, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AppLayout } from "@/app/layouts/AppLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type UploadState = "idle" | "uploading" | "result";

const CARDAMOM = [
  "Capsule Rot",
  "Rhizome Rot",
  "Leaf Blotch",
  "Damping Off",
  "Katte Viral Disease",
  "Clump Rot",
  "Shoot and Capsule Borer",
];

const GINGER = [
  "Soft Rot",
  "Bacterial Wilt",
  "Rhizome Rot",
  "Leaf Spot",
  "Yellow Disease",
  "Shoot Borer Attack",
  "Nutrient Deficiency Symptoms",
];

const HISTORY = [
  { date: "12 May 2026", disease: "Leaf Blotch", status: "Treated", crop: "Cardamom" },
  { date: "28 Apr 2026", disease: "Rhizome Rot", status: "Monitoring", crop: "Ginger" },
  { date: "10 Mar 2026", disease: "Capsule Rot", status: "Resolved", crop: "Cardamom" },
];

export function DiseaseDetectionPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);

  function handleUpload() {
    setUploadState("uploading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploadState("result");
          return 100;
        }
        return p + 10;
      });
    }, 200);
  }

  function handleReset() {
    setUploadState("idle");
    setProgress(0);
  }

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="AI disease detection"
            title="Snap a photo, get a diagnosis"
            subtitle="Specialized detection for Cardamom and Ginger. Get confidence scores, severity, and treatment recommendations."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Upload area */}
            {uploadState === "idle" && (
              <Card
                className="border-2 border-dashed border-border/60 bg-card p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                onClick={handleUpload}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">Upload plant image</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag photo here. Capture leaf, stem, or rhizome in clear light.
                </p>
                <Button className="mt-5 bg-primary hover:bg-primary/90">Choose photo</Button>
                <div className="mt-4 text-xs text-muted-foreground">Supported: JPG, PNG — Up to 10MB</div>
              </Card>
            )}

            {uploadState === "uploading" && (
              <Card className="border-border/60 bg-card p-8 flex flex-col items-center justify-center gap-5">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing image...</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Checking against disease patterns, weather conditions, and farm history.
                </p>
              </Card>
            )}

            {uploadState === "result" && (
              <Card className="border-border/60 bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">AI diagnosis report</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-muted-foreground">Disease</span>
                    <span className="font-semibold">Capsule Rot</span>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-semibold text-primary">91%</span>
                    </div>
                    <Progress value={91} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-muted-foreground">Severity</span>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>
                  </div>
                  <div className="rounded-lg bg-green-50 border border-green-100 p-3 space-y-1">
                    <div className="text-xs font-semibold text-green-700">Organic treatment</div>
                    <p className="text-xs text-green-800">Remove infected capsules, apply Trichoderma-based fungicide.</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 space-y-1">
                    <div className="text-xs font-semibold text-blue-700">Chemical treatment</div>
                    <p className="text-xs text-blue-800">Copper oxychloride 0.3% spray every 7 days.</p>
                  </div>
                  <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 space-y-1">
                    <div className="text-xs font-semibold text-destructive">Risk assessment</div>
                    <p className="text-xs text-destructive/80">Disease spread probability: 45% without treatment. Nearby humidity: 82%.</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" /> Scan another
                </Button>
              </Card>
            )}

            {/* Sample report / info panel */}
            {uploadState !== "result" && (
              <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Sample AI report</div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-background/60 p-3">
                    <span>Disease</span>
                    <span className="font-semibold">Capsule Rot</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-background/60 p-3">
                    <span>Confidence</span>
                    <span className="font-semibold">91%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-background/60 p-3">
                    <span>Severity</span>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>
                  </div>
                  <div className="rounded-lg bg-background/60 p-3 text-muted-foreground">
                    Treatment: isolate affected plants, apply organic fungicide within 24h, and monitor nearby plots.
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Disease history */}
        <section className="container mx-auto px-4 pb-8">
          <SectionHeading
            eyebrow="Detection history"
            title="Past diagnoses"
            subtitle="Track previous detections and their treatment outcomes."
          />
          <div className="mt-6 grid gap-3">
            {HISTORY.map((row) => (
              <Card key={row.date} className="border-border/60 bg-card p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Camera className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{row.disease}</div>
                      <div className="text-xs text-muted-foreground">{row.crop} — {row.date}</div>
                    </div>
                  </div>
                  <Badge
                    className={
                      row.status === "Resolved"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : row.status === "Treated"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  >
                    {row.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Supported diseases"
              title="Cardamom + Ginger intelligence"
              subtitle="Sanjaya models are trained for regional disease patterns and weather conditions."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Cardamom</div>
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  {CARDAMOM.map((disease) => (
                    <li key={disease} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> {disease}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="border-border/60 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Ginger</div>
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  {GINGER.map((disease) => (
                    <li key={disease} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> {disease}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <SectionHeading
            eyebrow="Smart context"
            title="More than a photo classifier"
            subtitle="Disease confidence adapts to rainfall, humidity, and your farm history to reduce false alarms."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <IconCard
              icon={Droplets}
              title="Weather aware"
              description="Heavy rainfall increases moisture-related disease detection confidence."
              tone="sky"
            />
            <IconCard
              icon={Leaf}
              title="Farm history"
              description="Recurring outbreaks are tracked to prevent re-infection."
              tone="harvest"
            />
            <IconCard
              icon={ShieldCheck}
              title="Risk assessment"
              description="Get spread probability and immediate action plan."
              tone="primary"
            />
          </div>
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
