
# Sanjaya — Smart AI Farming Assistant

This is a large multi-module platform (kiosk + mobile web). I'll build it in phases so each piece is solid and you can steer the direction. Phase 1 focuses on a beautiful, working foundation; later phases add AI, backend, and advanced modules.

## Phase 1 — Foundation (this iteration)

**Public Landing Page** (`/`)
- Hero with Sanjaya intro, tagline, language switcher (Hindi / Nepali / Bengali / English)
- Live weather preview card (mock data; wired to real API in Phase 2)
- 6 quick-access cards: Ask AI, Weather, Market Prices, Disease Detection, Schemes, Marketplace
- "How it works" 3-step section
- Farmer testimonials / success stories
- Government scheme highlights
- QR registration + Login/Register CTAs
- Footer

**Auth shell** (`/login`, `/register`)
- Mobile + OTP form (UI only, OTP flow stubbed)
- Farmer profile fields: name, village, farm location, size, crops, soil, language, irrigation
- QR registration tab

**Farmer Dashboard** (`/dashboard`)
- Weather widget (temp, rain %, humidity, wind, alerts)
- Farm summary (land area, active crops, growth stage, tasks)
- AI recommendations card (today's advice, irrigation, fertilizer, pest)
- Market snapshot (prices, nearby buyers, trends)
- Government benefits card
- Sidebar nav to all modules

**Design system**
- Earthy agricultural palette (deep green, soil brown, harvest gold, sky blue accent)
- Custom semantic tokens in `src/styles.css` (oklch)
- Display font: a warm humanist serif for headings; clean sans for body
- Large touch-friendly buttons (kiosk-ready), iconography from lucide
- Generated hero image (rural farm landscape) and module illustrations

**Routing scaffold** for Phase 2+ modules (placeholder pages):
`/assistant`, `/weather`, `/soil`, `/disease-detection`, `/market`, `/schemes`, `/alerts`, `/community`, `/admin`

## Phase 2 — Backend + AI (next iteration)
- Enable Lovable Cloud (database + auth)
- Real OTP auth, farmer profiles in DB
- AI assistant chat (Lovable AI Gateway, Gemini), voice in/out
- Real weather API integration
- Image upload + crop disease detection (Cardamom & Ginger model via vision LLM)

## Phase 3 — Marketplace, Schemes, Admin
- Buyer marketplace with listings
- Government scheme recommender
- Admin dashboard with regional analytics + disease heatmap
- Alerts/notifications system
- Offline-mode caching for kiosks
- Community forum

## Technical notes
- Stack: TanStack Start + React + Tailwind + shadcn (current template)
- All copy translatable via a `useLanguage()` hook + JSON dictionaries (English first, others stubbed)
- Mock data in Phase 1 so the UI is fully clickable before backend wiring

---

**Confirm or adjust before I start:**
1. OK to begin with Phase 1 (landing + auth shell + dashboard with mock data)?
2. Primary language for Phase 1 copy — English with language switcher stub, or build Hindi-first?
3. Visual direction — earthy/agricultural (my default), or more modern/techy (think fintech green)?
