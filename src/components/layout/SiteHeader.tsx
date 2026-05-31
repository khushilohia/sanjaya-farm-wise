import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu, Mic, Sprout, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PRIMARY_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/weather", label: "Weather" },
  { to: "/market", label: "Market" },
  { to: "/schemes", label: "Schemes" },
];

const MORE_LINKS = [
  { to: "/soil", label: "Soil & Farm" },
  { to: "/disease-detection", label: "Disease Detection" },
  { to: "/alerts", label: "Alerts" },
  { to: "/community", label: "Community" },
  { to: "/kiosk", label: "Kiosk" },
  { to: "/admin", label: "Admin" },
];

const PUBLIC_LINKS = [
  { to: "/", label: "Home" },
  { to: "/assistant", label: "Features" },
];

export function SiteHeader() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "F";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-warm">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-semibold tracking-tight">
              Sanjaya
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Smart Farming AI
            </div>
          </div>
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-5 lg:flex">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    More <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {MORE_LINKS.map((link) => (
                    <DropdownMenuItem key={link.to} asChild>
                      <Link to={link.to}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden gap-2 lg:flex"
              >
                <Link to="/assistant">
                  <Mic className="h-4 w-4" /> Voice mode
                </Link>
              </Button>
              <LanguageSwitcher />

              {/* User avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <div className="font-semibold text-sm">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.village}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="gap-2">
                      <User className="h-4 w-4" /> My Farm
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-warm">
                        <Sprout className="h-5 w-5" />
                      </div>
                      Sanjaya
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-lg bg-muted/40 p-3">
                      <div className="font-semibold text-sm">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.village}</div>
                    </div>
                    <div className="grid gap-2">
                      {PRIMARY_LINKS.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="text-sm font-medium"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border/60 pt-4">
                      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        More modules
                      </div>
                      <div className="mt-2 grid gap-2">
                        {MORE_LINKS.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="text-sm font-medium"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2 border-t border-border/60 pt-4">
                      <Button
                        asChild
                        className="gap-2 bg-primary hover:bg-primary/90"
                      >
                        <Link to="/assistant">
                          <Mic className="h-4 w-4" /> Voice mode
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </Button>
                      <div className="pt-2">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <>
            <nav className="hidden items-center gap-5 lg:flex">
              {PUBLIC_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex bg-primary hover:bg-primary/90"
              >
                <Link to="/register">Register</Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="sm:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Sanjaya</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 grid gap-3">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/register">Register free</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/login">Login</Link>
                    </Button>
                    <LanguageSwitcher />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
