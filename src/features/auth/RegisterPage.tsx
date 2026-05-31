import { Link } from "@tanstack/react-router";
import { Sprout, ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-secondary/40 to-primary/5">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold">Sanjaya</span>
        </Link>
        <LanguageSwitcher />
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Register your farm</h1>
        <p className="mt-2 text-muted-foreground">
          Takes 2 minutes. Personalized advice from day one, by voice or text.
        </p>

        <Card className="mt-8 border-border/60 p-6 md:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
            className="grid gap-5 md:grid-cols-2"
          >
            <Field label="Full name">
              <Input placeholder="Pemba Sherpa" required />
            </Field>
            <Field label="Mobile number">
              <Input type="tel" placeholder="+91 98765 43210" required />
            </Field>
            <Field label="Village / Town">
              <Input placeholder="Gangtok" required />
            </Field>
            <Field label="District / State">
              <Input placeholder="Sikkim" required />
            </Field>
            <Field label="Farm size (acres)">
              <Input type="number" step="0.1" placeholder="2.5" required />
            </Field>
            <Field label="Soil type">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="silty">Silty</SelectItem>
                  <SelectItem value="peaty">Peaty</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Primary crop">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="cardamom">Cardamom</SelectItem>
                  <SelectItem value="ginger">Ginger</SelectItem>
                  <SelectItem value="tea">Tea</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Irrigation method">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rainfed">Rain-fed</SelectItem>
                  <SelectItem value="drip">Drip</SelectItem>
                  <SelectItem value="sprinkler">Sprinkler</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="canal">Canal</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Preferred language" full>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="md:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                By registering you agree to Sanjaya's terms and privacy policy.
              </p>
              <Button type="submit" size="lg" className="h-12 gap-2 bg-primary hover:bg-primary/90">
                Create account <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <Button variant="outline" className="gap-2">
            <Mic className="h-4 w-4" /> Need help? Register by voice
          </Button>
          <div>
            Already registered?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : undefined}>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
