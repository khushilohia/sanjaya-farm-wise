import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { QrCode, Smartphone, ArrowRight, Mic, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/frontend/components/ui/button";
import { Card } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { AuthLayout } from "@/frontend/app/layouts/AuthLayout";
import { useAuthStore } from "@/frontend/store/authStore";

const loginSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const authenticate = useAuthStore((s) => s.authenticate);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      const user = await authenticate(data.phone, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Mobile number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    className="h-11"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-11 w-full gap-2 bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
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
    </AuthLayout>
  );
}
