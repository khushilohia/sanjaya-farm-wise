import { Sprout } from "lucide-react";

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
            AI-powered farming assistance for every village, every farmer, every season.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Platform</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>AI Assistant</li>
            <li>Weather Intelligence</li>
            <li>Disease Detection</li>
            <li>Market Prices</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">For Farmers</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Kiosk Access</li>
            <li>Mobile App</li>
            <li>Voice Assistant</li>
            <li>Community Hub</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Support</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Help Center</li>
            <li>Contact</li>
            <li>Government Partners</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sidebar-border py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Sanjaya — Empowering farmers with intelligence.
      </div>
    </footer>
  );
}
