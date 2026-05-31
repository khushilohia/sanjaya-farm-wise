import { useState } from "react";
import { Landmark, ShieldCheck, FileText, CalendarCheck, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCHEMES = [
  { title: "PM-Kisan Samman Nidhi", tag: "Direct benefit", amount: "Rs 6,000/year" },
  { title: "Soil Health Card", tag: "Free testing", amount: "Apply now" },
  { title: "Pradhan Mantri Fasal Bima", tag: "Crop insurance", amount: "Up to 90% subsidy" },
];

const MATCHED_SCHEMES = [
  { name: "PM-Kisan Samman Nidhi", benefit: "Rs 6,000/year direct transfer to bank account." },
  { name: "Pradhan Mantri Fasal Bima Yojana", benefit: "Crop insurance with up to 90% premium subsidy." },
  { name: "Soil Health Card Scheme", benefit: "Free soil testing and nutrient recommendations." },
];

const TRACKING = [
  { scheme: "PM-Kisan Samman Nidhi", applied: "15 Jan 2026", status: "Approved" },
  { scheme: "Pradhan Mantri Fasal Bima", applied: "02 Mar 2026", status: "Pending" },
  { scheme: "Soil Health Card", applied: "—", status: "Not Applied" },
];

export function SchemesPage() {
  const [district, setDistrict] = useState("");
  const [landSize, setLandSize] = useState("");
  const [crop, setCrop] = useState("");
  const [showResults, setShowResults] = useState(false);

  function handleCheck() {
    if (!district || !landSize) return;
    setShowResults(true);
  }

  return (
    <PageShell>
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Government schemes"
          title="Find benefits you qualify for"
          subtitle="Sanjaya matches schemes based on location, farm size, and crop type, then tracks your application progress."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/60 bg-card p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Recommended schemes</div>
            <div className="mt-4 space-y-3">
              {SCHEMES.map((scheme) => (
                <div key={scheme.title} className="rounded-xl border border-border/60 bg-background p-4">
                  <div className="font-semibold">{scheme.title}</div>
                  <div className="text-xs text-muted-foreground">{scheme.tag}</div>
                  <div className="mt-2 text-sm font-semibold text-primary">{scheme.amount}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Eligibility snapshot</div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg bg-background/60 p-3">
                Land holding verified — Eligible for PM-Kisan
              </div>
              <div className="rounded-lg bg-background/60 p-3">
                Soil test pending — Apply for Soil Health Card
              </div>
              <div className="rounded-lg bg-background/60 p-3">
                Insurance renewal due in 12 days
              </div>
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
            subtitle="Enter your details to find matching government programs instantly."
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
                      <SelectItem value="cardamom">Cardamom</SelectItem>
                      <SelectItem value="ginger">Ginger</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="tea">Tea</SelectItem>
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
            {showResults ? (
              <Card className="border-border/60 bg-card p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                  <CheckCircle2 className="h-4 w-4" /> 3 matching schemes found
                </div>
                <div className="space-y-3">
                  {MATCHED_SCHEMES.map((scheme) => (
                    <div key={scheme.name} className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold">{scheme.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{scheme.benefit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6 flex items-center justify-center">
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  Fill in your district and land size to discover government schemes you are eligible for.
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Application tracking */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Application tracking"
          title="Track your applications"
          subtitle="Monitor the status of every scheme you have applied for."
        />
        <Card className="mt-6 border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">Scheme</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {TRACKING.map((row) => (
                  <tr key={row.scheme} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.scheme}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.applied}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          row.status === "Approved"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : row.status === "Pending"
                            ? "bg-harvest/15 text-harvest-foreground border-harvest/20"
                            : "bg-muted text-muted-foreground border-border"
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="How it works"
            title="Guided scheme applications"
            subtitle="AI helps you collect documents, check eligibility, and track approvals."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IconCard
              icon={Landmark}
              title="Scheme match"
              description="Auto-recommend programs based on your profile."
              tone="harvest"
            />
            <IconCard
              icon={ShieldCheck}
              title="Eligibility check"
              description="Clear yes/no based on your location and land size."
              tone="primary"
            />
            <IconCard
              icon={FileText}
              title="Document checklist"
              description="Get the exact list of required documents."
              tone="soil"
            />
            <IconCard
              icon={CalendarCheck}
              title="Application tracking"
              description="Follow status and receive reminders before deadlines."
              tone="sky"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <SectionHeading
          eyebrow="Status tracking"
          title="Never miss a deadline"
          subtitle="Sanjaya sends voice and SMS reminders for every scheme milestone."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["PM-Kisan payout due in 8 days", "Soil Health Card camp on 15 June", "Crop insurance renewal in 12 days"].map((item) => (
            <Card key={item} className="border-border/60 bg-card p-5">
              <div className="text-sm font-semibold">{item}</div>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
