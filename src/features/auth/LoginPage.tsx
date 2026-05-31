import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, QrCode, Smartphone, ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
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

      <div className="container mx-auto flex max-w-md flex-col px-4 py-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Log in to access your farm intelligence and voice-first guidance.
        </p>

        <Tabs defaultValue="mobile" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="h-4 w-4" /> Mobile
            </TabsTrigger>
            <TabsTrigger value="qr" className="gap-2">
              <QrCode className="h-4 w-4" /> QR Kiosk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile">
            <Card className="border-border/60 p-6">
              {step === "phone" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("otp");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="phone">Mobile number</Label>
                    <div className="mt-1.5 flex gap-2">
                      <div className="flex items-center rounded-md border border-input bg-background px-3 text-sm">
                        +91
                      </div>
                      <Input id="phone" type="tel" placeholder="98765 43210" required className="h-11" />
                    </div>
                  </div>
                  <Button type="submit" className="h-11 w-full gap-2 bg-primary hover:bg-primary/90">
                    Send OTP <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = "/dashboard";
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Enter 6-digit OTP</Label>
                    <Input
                      maxLength={6}
                      placeholder="......"
                      className="mt-1.5 h-12 text-center font-display text-2xl tracking-[0.5em]"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Sent to +91 ..... 43210  - {" "}
                      <button
                        type="button"
                        onClick={() => setStep("phone")}
                        className="text-primary"
                      >
                        Change
                      </button>
                    </p>
                  </div>
                  <Button type="submit" className="h-11 w-full bg-primary hover:bg-primary/90">
                    Verify & continue
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="qr">
            <Card className="flex flex-col items-center border-border/60 p-8 text-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-foreground text-background">
                <QrCode className="h-24 w-24" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Open the Sanjaya kiosk camera and scan this code to log in instantly.
              </p>
              <Button variant="outline" className="mt-6 gap-2">
                <Mic className="h-4 w-4" /> Use voice help
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Sanjaya?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
