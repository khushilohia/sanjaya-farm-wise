import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { useAuthStore } from "@/store/authStore";
import { useFarmStore } from "@/store/farmStore";

const CROP_OPTIONS = [
  "Cardamom",
  "Ginger",
  "Rice",
  "Maize",
  "Vegetables",
  "Tea",
  "Wheat",
];

const step1Schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const step2Schema = z.object({
  village: z.string().min(2, "Enter your village or town"),
  farmSize: z.string().min(1, "Enter your farm size"),
  soilType: z.string().min(1, "Select your soil type"),
  irrigation: z.string().min(1, "Select irrigation method"),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;

type AllData = Step1Form & Step2Form & { crops: string[]; language: string };

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const updateSetupField = useFarmStore((s) => s.updateSetupField);
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Form | null>(null);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const form1 = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
  });

  const form2 = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
  });

  function handleStep1(data: Step1Form) {
    setStep1Data(data);
    setStep(2);
  }

  function handleStep2(data: Step2Form) {
    setStep2Data(data);
    setStep(3);
  }

  function toggleCrop(crop: string) {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  }

  async function handleFinalSubmit() {
    if (!step1Data || !step2Data) return;
    if (selectedCrops.length === 0) {
      toast.error("Select at least one crop");
      return;
    }
    const allData: AllData = {
      ...step1Data,
      ...step2Data,
      crops: selectedCrops,
      language,
    };
    setLoading(true);
    try {
      const user = await register({
        name: allData.name,
        phone: allData.phone,
        village: allData.village,
        farmSize: allData.farmSize,
        crops: allData.crops,
        language: allData.language,
        password: allData.password,
      });
      // Carry the registration details into the farm profile so the
      // dashboard, soil and assistant pages have context from day one.
      updateSetupField({
        soilType: allData.soilType,
        irrigationSource: allData.irrigation,
      });
      toast.success(`Welcome, ${user.name}! Your farm is registered.`);
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Account", "Farm details", "Crops & language"];

  return (
    <AuthLayout>
      <div className="w-full max-w-lg">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Register your farm
        </h1>
        <p className="mt-2 text-muted-foreground">
          Takes 2 minutes. Personalized advice from day one, by voice or text.
        </p>

        {/* Step indicator */}
        <div className="mt-6 flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  step > i + 1
                    ? "bg-primary text-primary-foreground"
                    : step === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${step === i + 1 ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
              {i < 2 && <div className="h-px flex-1 bg-border/60 min-w-[20px]" />}
            </div>
          ))}
        </div>

        <Card className="mt-6 border-border/60 p-6">
          {step === 1 && (
            <form
              onSubmit={form1.handleSubmit(handleStep1)}
              className="space-y-4"
            >
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                Step 1 of 3 — Account
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Pemba Sherpa"
                    {...form1.register("name")}
                  />
                  {form1.formState.errors.name && (
                    <p className="text-xs text-destructive">
                      {form1.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Mobile number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...form1.register("phone")}
                  />
                  {form1.formState.errors.phone && (
                    <p className="text-xs text-destructive">
                      {form1.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form1.register("password")}
                  />
                  {form1.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {form1.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...form1.register("confirmPassword")}
                  />
                  {form1.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {form1.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={form2.handleSubmit(handleStep2)}
              className="space-y-4"
            >
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                Step 2 of 3 — Farm details
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="village">Village / Town</Label>
                  <Input
                    id="village"
                    placeholder="Gangtok"
                    {...form2.register("village")}
                  />
                  {form2.formState.errors.village && (
                    <p className="text-xs text-destructive">
                      {form2.formState.errors.village.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="farmSize">Farm size (acres)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    {...form2.register("farmSize")}
                  />
                  {form2.formState.errors.farmSize && (
                    <p className="text-xs text-destructive">
                      {form2.formState.errors.farmSize.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Soil type</Label>
                  <Select
                    onValueChange={(v) => form2.setValue("soilType", v)}
                  >
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
                  {form2.formState.errors.soilType && (
                    <p className="text-xs text-destructive">
                      {form2.formState.errors.soilType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Irrigation method</Label>
                  <Select
                    onValueChange={(v) => form2.setValue("irrigation", v)}
                  >
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
                  {form2.formState.errors.irrigation && (
                    <p className="text-xs text-destructive">
                      {form2.formState.errors.irrigation.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                Step 3 of 3 — Crops & language
              </div>
              <div>
                <Label className="text-sm">Primary crops (select all that apply)</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CROP_OPTIONS.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        selectedCrops.includes(crop)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Preferred language</Label>
                <Select defaultValue="en" onValueChange={setLanguage}>
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
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  type="button"
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
