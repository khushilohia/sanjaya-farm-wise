import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-warm">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-semibold tracking-tight">Sanjaya</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Smart Farming AI
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Dashboard
          </Link>
          <Link to="/assistant" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            AI Assistant
          </Link>
          <Link to="/market" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Market
          </Link>
          <Link to="/schemes" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Schemes
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
