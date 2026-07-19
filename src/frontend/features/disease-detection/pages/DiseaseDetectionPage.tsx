import { useRef, useState } from "react";
import {
  Camera,
  ShieldCheck,
  Droplets,
  Leaf,
  Loader2,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { AuthGuard } from "@/frontend/app/guards/AuthGuard";
import { AppLayout } from "@/frontend/app/layouts/AppLayout";
import { SectionHeading } from "@/frontend/components/layout/SectionHeading";
import { IconCard } from "@/frontend/components/cards/IconCard";
import { Card } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Progress } from "@/frontend/components/ui/progress";
import { Badge } from "@/frontend/components/ui/badge";
import { detectDisease } from "@/backend/api/serverFns";
import { useAuthStore } from "@/frontend/store/authStore";
import { useFarmStore } from "@/frontend/store/farmStore";

type UploadState = "idle" | "analyzing" | "result";

type Report = {
  isPlant: boolean;
  crop: string;
  disease: string;
  confidence: number;
  severity: "Low" | "Medium" | "High" | string;
  summary: string;
  organicTreatment: string;
  chemicalTreatment: string;
  prevention: string;
};

const CARDAMOM = [
  "Capsule Rot",
  "Rhizome Rot",
  "Leaf Blotch",
  "Damping Off",
  "Katte Viral Disease",
  "Clump Rot",
];
const GINGER = [
  "Soft Rot",
  "Bacterial Wilt",
  "Rhizome Rot",
  "Leaf Spot",
  "Yellow Disease",
  "Shoot Borer",
];

function severityClass(sev: string): string {
  if (sev === "High") return "bg-destructive/10 text-destructive border-destructive/20";
  if (sev === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-primary/10 text-primary border-primary/20";
}

function langName(code: string): string {
  return code === "hi" ? "Hindi" : code === "ne" ? "Nepali" : code === "bn" ? "Bengali" : "English";
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function DiseaseDetectionPage() {
  const user = useAuthStore((s) => s.user);
  const { diseaseScans, addDiseaseScan, updateScanStatus } = useFarmStore();

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const lang = user?.language ?? "en";
  const cropGuess = user?.crops?.[0] ?? "";

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large — keep it under 10MB.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPreview(dataUrl);
    setUploadState("analyzing");
    setReport(null);
    setRawText(null);

    try {
      const res = await detectDisease({
        data: { imageDataUrl: dataUrl, crop: cropGuess, language: lang },
      });
      if (res.ok && res.report) {
        const r = res.report as Report;
        setReport(r);
        if (r.isPlant && r.disease && r.disease.toLowerCase() !== "healthy") {
          addDiseaseScan({
            crop: r.crop || cropGuess || "Unknown",
            disease: r.disease,
            confidence: Math.round(r.confidence ?? 0),
            severity: r.severity ?? "Medium",
            summary: r.summary ?? "",
          });
        }
      } else {
        setRawText(res.raw);
      }
      setUploadState("result");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed. Try again.");
      setUploadState("idle");
      setPreview(null);
    }
  }

  function reset() {
    setUploadState("idle");
    setPreview(null);
    setReport(null);
    setRawText(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="AI disease detection"
            title="Snap a photo, get a real diagnosis"
            subtitle="Our AI vision model inspects your plant photo and returns the likely disease, confidence, severity, and organic + chemical treatment — in your language."
          />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Upload / preview */}
            {uploadState === "idle" && (
              <Card
                className="cursor-pointer border-2 border-dashed border-border/60 bg-card p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                onClick={() => fileRef.current?.click()}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  Upload or capture plant image
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Take a clear photo of the affected leaf, stem, or rhizome in good light.
                </p>
                <Button className="mt-5 bg-primary hover:bg-primary/90">Choose photo</Button>
                <div className="mt-4 text-xs text-muted-foreground">JPG / PNG — up to 10MB</div>
              </Card>
            )}

            {uploadState === "analyzing" && (
              <Card className="flex flex-col items-center justify-center gap-5 border-border/60 bg-card p-8">
                {preview && (
                  <img
                    src={preview}
                    alt="Uploaded plant"
                    className="h-40 w-40 rounded-xl object-cover"
                  />
                )}
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="w-full space-y-2">
                  <Progress value={66} className="h-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    AI is examining the image for disease patterns…
                  </p>
                </div>
              </Card>
            )}

            {uploadState === "result" && (
              <Card className="space-y-4 border-border/60 bg-card p-6">
                {preview && (
                  <img
                    src={preview}
                    alt="Analyzed plant"
                    className="h-36 w-full rounded-xl object-cover"
                  />
                )}

                {report ? (
                  report.isPlant ? (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                          AI diagnosis report
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                          <span className="text-muted-foreground">Diagnosis</span>
                          <span className="font-semibold">{report.disease}</span>
                        </div>
                        <div className="space-y-2 rounded-lg bg-muted/30 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className="font-semibold text-primary">
                              {Math.round(report.confidence)}%
                            </span>
                          </div>
                          <Progress value={report.confidence} className="h-1.5" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                          <span className="text-muted-foreground">Severity</span>
                          <Badge className={severityClass(report.severity)}>
                            {report.severity}
                          </Badge>
                        </div>
                        {report.summary && (
                          <div className="rounded-lg bg-muted/20 p-3 text-sm text-muted-foreground">
                            {report.summary}
                          </div>
                        )}
                        {report.organicTreatment && (
                          <div className="space-y-1 rounded-lg border border-green-100 bg-green-50 p-3">
                            <div className="text-xs font-semibold text-green-700">
                              Organic treatment
                            </div>
                            <p className="text-xs text-green-800">{report.organicTreatment}</p>
                          </div>
                        )}
                        {report.chemicalTreatment && (
                          <div className="space-y-1 rounded-lg border border-blue-100 bg-blue-50 p-3">
                            <div className="text-xs font-semibold text-blue-700">
                              Chemical treatment
                            </div>
                            <p className="text-xs text-blue-800">{report.chemicalTreatment}</p>
                          </div>
                        )}
                        {report.prevention && (
                          <div className="space-y-1 rounded-lg border border-amber-100 bg-amber-50 p-3">
                            <div className="text-xs font-semibold text-amber-700">Prevention</div>
                            <p className="text-xs text-amber-800">{report.prevention}</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {report.summary ||
                          "That doesn't look like a plant. Please upload a clear photo of the affected plant."}
                      </span>
                    </div>
                  )
                ) : (
                  <div className="space-y-2 rounded-lg bg-muted/30 p-4 text-sm">
                    <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                      AI analysis
                    </div>
                    <p className="text-muted-foreground">{rawText}</p>
                  </div>
                )}

                <Button variant="outline" className="w-full gap-2" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Scan another
                </Button>
              </Card>
            )}

            {/* Info panel */}
            {uploadState !== "result" && (
              <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                  How it works
                </div>
                <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      1
                    </span>
                    Take a sharp, well-lit photo of the affected part of the plant.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      2
                    </span>
                    Our AI vision model compares it against known regional disease patterns.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      3
                    </span>
                    You get a diagnosis with confidence, severity, and a treatment plan in{" "}
                    {langName(lang)}.
                  </li>
                </ol>
                <p className="mt-5 rounded-lg bg-background/60 p-3 text-xs text-muted-foreground">
                  Tip: AI diagnosis is guidance, not a lab test. For severe or spreading outbreaks,
                  consult your local Krishi Vigyan Kendra.
                </p>
              </Card>
            )}
          </div>
        </section>

        {/* Detection history — real, persisted */}
        <section className="container mx-auto px-4 pb-8">
          <SectionHeading
            eyebrow="Detection history"
            title="Your past diagnoses"
            subtitle="Every scan you run is saved here so you can track treatment progress."
          />
          {diseaseScans.length === 0 ? (
            <Card className="mt-6 border-dashed border-border/60 bg-card/50 p-8 text-center text-sm text-muted-foreground">
              No scans yet. Upload a plant photo above to get your first diagnosis.
            </Card>
          ) : (
            <div className="mt-6 grid gap-3">
              {diseaseScans.map((row) => (
                <Card key={row.id} className="border-border/60 bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Camera className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {row.disease}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            · {Math.round(row.confidence)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {row.crop} —{" "}
                          {new Date(row.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(["Detected", "Treating", "Resolved"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateScanStatus(row.id, st)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            row.status === st
                              ? st === "Resolved"
                                ? "border-primary bg-primary/10 text-primary"
                                : st === "Treating"
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-border/60 text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Supported diseases reference */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Regional knowledge"
              title="Cardamom + Ginger focus"
              subtitle="The assistant is tuned for the common diseases of Northeast India's hill crops."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Cardamom
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  {CARDAMOM.map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> {d}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="border-border/60 bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Ginger
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  {GINGER.map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> {d}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Smart context"
            title="More than a photo classifier"
            subtitle="Pair a diagnosis with weather and soil data from the other tools to plan your response."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <IconCard
              icon={Droplets}
              title="Weather aware"
              description="Check the Weather page — high humidity raises moisture-disease risk."
              tone="sky"
            />
            <IconCard
              icon={Leaf}
              title="Tracked history"
              description="Mark scans as Treating or Resolved to follow outbreaks over time."
              tone="harvest"
            />
            <IconCard
              icon={ShieldCheck}
              title="Treatment plan"
              description="Every diagnosis includes organic and chemical options plus prevention."
              tone="primary"
            />
          </div>
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
