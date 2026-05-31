import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-primary/5 flex flex-col">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold">Sanjaya</span>
        </Link>
        <LanguageSwitcher />
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
}
