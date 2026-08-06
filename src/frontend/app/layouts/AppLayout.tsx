import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mic2,
  CloudSun,
  TrendingUp,
  Landmark,
  Sprout,
  Camera,
  Bell,
  Users,
  Map,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Avatar, AvatarFallback } from "@/frontend/components/ui/avatar";
import { LanguageSwitcher } from "@/frontend/components/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/frontend/components/ui/sheet";
import { useAuthStore } from "@/frontend/store/authStore";
import type { ReactNode } from "react";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/assistant", icon: Mic2, label: "AI Assistant" },
    ],
  },
  {
    label: "Farm Tools",
    items: [
      { to: "/weather", icon: CloudSun, label: "Weather" },
      { to: "/market", icon: TrendingUp, label: "Market Prices" },
      { to: "/schemes", icon: Landmark, label: "Gov Schemes" },
      { to: "/soil", icon: Sprout, label: "Soil & Farm" },
      { to: "/disease-detection", icon: Camera, label: "Disease Detection" },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/alerts", icon: Bell, label: "Alerts" },
      { to: "/community", icon: Users, label: "Community" },
    ],
  },
  {
    label: "System",
    items: [
      // Kiosk mode disabled — see src/routes/kiosk.tsx.disabled
      { to: "/admin", icon: Map, label: "Admin" },
    ],
  },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "F";

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sprout className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-base font-semibold tracking-tight">Sanjaya</div>
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Smart Farming AI
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavClick}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="h-3 w-3 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-border/60 p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{user?.name}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.village}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex-1 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({
  children,
  showFooter: _showFooter = true,
}: {
  children: ReactNode;
  showFooter?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile: top bar + sheet sidebar */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-border/60 bg-card px-4 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <SidebarContent onNavClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sprout className="h-3.5 w-3.5" />
            </div>
            <span className="font-display text-base font-semibold">Sanjaya</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
