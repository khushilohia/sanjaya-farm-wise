import { useState } from "react";
import {
  Landmark,
  ShieldCheck,
  FileText,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { AuthGuard } from "@/frontend/app/guards/AuthGuard";
import { AppLayout } from "@/frontend/app/layouts/AppLayout";
import { SectionHeading } from "@/frontend/components/layout/SectionHeading";
import { IconCard } from "@/frontend/components/cards/IconCard";
import { Card } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { checkEligibility, type SchemeResult } from "@/frontend/features/schemes/eligibility";

const SCHEMES = [
  { title: "PM-Kisan Samman Nidhi", tag: "Direct benefit", amount: "₹6,000/year" },
  { title: "Soil Health Card", tag: "Free testing", amount: "Free, all farmers" },
  { title: "Pradhan Mantri Fasal Bima", tag: "Crop insurance", amount: "Premium capped at 1.5–5%" },
  { title: "Kisan Credit Card", tag: "Subsidised credit", amount: "Loans up to ₹3 lakh" },
];

export function SchemesPage() {
  const [district, setDistrict] = useState("");
  const [landSize, setLandSize] = useState("");
  const [crop, setCrop] = useState("");
  const [results, setResults] = useState<SchemeResult[] | null>(null);

  function handleCheck() {
    if (!district || !landSize) return;
    setResults(
      checkEligibility({
        landAcres: Number(landSize) || 0,
        crop,
        state: district,
      }),
    );
  }

  const eligible = results?.filter((r) => r.eligible) ?? [];
  const notEligible = results?.filter((r) => !r.eligible) ?? [];

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Government schemes"
            title="Find benefits you qualify for"
            subtitle="Sanjaya checks real scheme criteria against your land size and crops, and links you to the official application portals."
          />
          <div className="mt-8">
            <Card className="border-border/60 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Major schemes
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SCHEMES.map((scheme) => (
                  <div
                    key={scheme.title}
                    className="rounded-xl border border-border/60 bg-background p-4"
                  >
                    <div className="font-semibold">{scheme.title}</div>
                    <div className="text-xs text-muted-foreground">{scheme.tag}</div>
                    <div className="mt-2 text-sm font-semibold text-primary">{scheme.amount}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Eligibility checker */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Eligibility checker"
              title="Check which schemes you qualify for"
              subtitle="Enter your details — eligibility is checked against each scheme's published rules."
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <Card className="border-border/60 bg-card p-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="district-input">District</Label>
                    <Input
                      id="district-input"
                      placeholder="e.g. East Sikkim"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="land-input">Land size (acres)</Label>
                    <Input
                      id="land-input"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="crop-select">Primary crop</Label>
                    <Select value={crop} onValueChange={setCrop}>
                      <SelectTrigger id="crop-select">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardamom">Cardamom</SelectItem>
                        <SelectItem value="Ginger">Ginger</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Tea">Tea</SelectItem>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 gap-2"
                    onClick={handleCheck}
                    disabled={!district || !landSize}
                  >
                    <ShieldCheck className="h-4 w-4" /> Check eligibility
                  </Button>
                </div>
              </Card>
              {results ? (
                <Card className="border-border/60 bg-card p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                    <CheckCircle2 className="h-4 w-4" /> {eligible.length} of {results.length}{" "}
                    schemes match
                  </div>
                  <div className="space-y-3">
                    {eligible.map((scheme) => (
                      <div
                        key={scheme.name}
                        className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{scheme.name}</span>
                            <a
                              href={scheme.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-0.5 text-xs"
                            >
                              Apply <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {scheme.benefit}
                          </div>
                          <div className="text-xs text-muted-foreground/80 mt-0.5">
                            {scheme.reason}
                          </div>
                        </div>
                      </div>
                    ))}
                    {notEligible.map((scheme) => (
                      <div
                        key={scheme.name}
                        className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4"
                      >
                        <XCircle className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-muted-foreground">
                              {scheme.name}
                            </span>
                            <Badge className="bg-muted text-muted-foreground border-border text-xs">
                              Not eligible
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground/80 mt-0.5">
                            {scheme.reason}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6 flex items-center justify-center">
                  <p className="text-center text-sm text-muted-foreground max-w-xs">
                    Fill in your district and land size to discover government schemes you are
                    eligible for.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 pb-20">
          <SectionHeading
            eyebrow="How it works"
            title="Guided scheme applications"
            subtitle="Check eligibility here, then apply on the official portal — Sanjaya links you straight to it."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IconCard
              icon={Landmark}
              title="Scheme match"
              description="Real published criteria checked against your farm details."
              tone="harvest"
            />
            <IconCard
              icon={ShieldCheck}
              title="Eligibility check"
              description="Clear yes/no with the reason, based on your land size and crop."
              tone="primary"
            />
            <IconCard
              icon={FileText}
              title="Official portals"
              description="Direct links to government application sites — no middlemen."
              tone="soil"
            />
            <IconCard
              icon={CalendarCheck}
              title="Application tracking"
              description="Coming soon: track your application status inside Sanjaya."
              tone="sky"
            />
          </div>
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
