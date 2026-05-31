import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "AI Assistant", to: "/assistant" },
      { label: "Weather", to: "/weather" },
      { label: "Soil & Farm", to: "/soil" },
      { label: "Disease Detection", to: "/disease-detection" },
      { label: "Market", to: "/market" },
    ],
  },
  {
    title: "For Farmers",
    links: [
      { label: "Schemes", to: "/schemes" },
      { label: "Alerts", to: "/alerts" },
      { label: "Community", to: "/community" },
      { label: "Kiosk", to: "/kiosk" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Access",
    links: [
      { label: "Login", to: "/login" },
      { label: "Register", to: "/register" },
      { label: "Admin", to: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-harvest text-harvest-foreground">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="font-display text-xl font-semibold">Sanjaya</div>
          </div>
          <p className="mt-3 text-sm opacity-80">
            Audio-first farming intelligence for every village, kiosk, and mobile farmer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {[
              "Voice-first",
              "Multilingual",
              "Offline-ready",
              "Govt partnered",
            ].map((tag) => (
              <span key={tag} className="rounded-full bg-sidebar-accent/60 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">
              {col.title}
            </h4>
            <ul className="space-y-2 text-sm opacity-90">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-sidebar-border py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Sanjaya  -  Empowering farmers with intelligence.
      </div>
    </footer>
  );
}
