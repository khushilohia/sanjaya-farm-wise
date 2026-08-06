# Sanjaya Farm AI — System Documentation

> ⚠️ HISTORICAL — this document predates the 2026-07-19 overhaul (real auth,
> DB, backend/frontend split). See `docs/ARCHITECTURE.md` and `docs/TODO.md`
> for the current system.

> Last updated: 2026-05-31

---

## Overview

Sanjaya is a voice-first AI farming assistant for smallholder farmers in Northeast India and Nepal. It combines real-time weather, AI-powered advice, multilingual voice I/O, government scheme discovery, market prices, and a farm setup questionnaire — all surfaced in a clean software-style left-sidebar shell.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (SSR + file-based routing) |
| Router | TanStack Router — routes in `src/routes/`, auto-generates `routeTree.gen.ts` |
| State | Zustand v5 with `persist` middleware (localStorage) |
| Data fetching | TanStack React Query v5 |
| UI components | Radix UI primitives + shadcn/ui |
| Styling | Tailwind CSS v4 — `@theme inline`, oklch color tokens |
| Icons | Lucide React |
| Build | Vite + `@tanstack/router-plugin` |
| Language | TypeScript (strict) |
| Path alias | `@/` → `src/` |

---

## External APIs

### OpenAI (AI chat + vision)
- **Used for**: Farmer question answering, crop disease photo diagnosis, soil interpretation, market price estimates
- **Model**: `gpt-4o-mini`
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Auth**: `Authorization: Bearer <OPEN_AI_API_KEY>`
- **Key env var**: `OPEN_AI_API_KEY`

### Sarvam AI (Text-to-Speech)
- **Used for**: Speaking AI answers back to the farmer in their language
- **Endpoint**: `https://api.sarvam.ai/text-to-speech`
- **Auth**: `api-subscription-key: <SARVAM_AI_API_KEY>`
- **Key env var**: `SARVAM_AI_API_KEY`
- **Model**: `bulbul:v2` (previously `bulbul:v1` — deprecated)
- **Speaker**: `anushka` (previously `meera` — removed from API)
- **Char limit per request**: 490 chars — long answers are split at sentence boundaries and played sequentially
- **Valid speakers** (as of 2026-05): anushka, abhilash, manisha, vidya, arya, karun, hitesh, aditya, ritu, priya, neha, rahul, pooja, rohan, simran, kavya, amit, dev, ishita, shreya, ratan, varun, manan, sumit, roopa, kabir, aayan, shubh, ashutosh, advait, anand, tanya, tarun, sunny, mani, gokul, vijay, shruti, suhani, mohit, kavitha, rehan, soham, rupali

### Open-Meteo (Weather)
- **Used for**: Real-time weather and 7-day forecast
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Auth**: None (free, no key required)
- **Location**: Browser Geolocation API → falls back to Gangtok coords (27.33°N, 88.62°E) if denied
- **Cache**: 30 minutes (`staleTime`), geolocation cached 10 minutes (`maximumAge`)

---

## API Security

All external API keys are **server-side only** via TanStack Start `createServerFn`. They are never bundled into client JavaScript. Server functions live in `src/api/serverFns.ts` and are called from the client like regular async functions — TanStack Start handles the RPC boundary automatically.

---

## Environment Variables

File: `.env` in project root (never commit this file)

```
SARVAM_AI_API_KEY=...      # Sarvam AI TTS
OPEN_AI_API_KEY=...        # OpenAI AI chat + vision
```

---

## Project Structure

```
src/
├── api/
│   └── serverFns.ts              # All server functions (auth, AI, TTS)
├── app/
│   ├── guards/
│   │   └── AuthGuard.tsx         # Redirects unauthenticated users to /login
│   └── layouts/
│       └── AppLayout.tsx         # Authenticated shell — left sidebar + mobile sheet
├── components/
│   ├── cards/                    # IconCard, etc.
│   ├── layout/                   # SectionHeading, SiteFooter, SiteHeader
│   ├── ui/                       # shadcn/ui components (button, card, badge, …)
│   └── voice/                    # VoiceButton (legacy landing page use)
├── features/
│   ├── ai-assistant/
│   │   ├── components/
│   │   │   └── VoiceOrb.tsx      # Animated mic orb (idle/listening/thinking/speaking)
│   │   ├── hooks/
│   │   │   ├── useAIChat.ts      # React Query mutation wrapping askAI server fn
│   │   │   ├── useSarvamTTS.ts   # TTS with chunked playback + browser TTS fallback
│   │   │   └── useSpeechRecognition.ts  # Web Speech API with permission handling
│   │   └── pages/
│   │       └── AssistantPage.tsx # Main voice/text AI chat page
│   ├── weather/
│   │   ├── api/
│   │   │   └── openmeteo.ts      # fetchWeather, weatherCodeToEmoji, getDayLabel
│   │   ├── hooks/
│   │   │   └── useWeather.ts     # useGeolocation + useWeather (React Query)
│   │   └── pages/
│   │       └── WeatherPage.tsx   # 7-day forecast + smart recommendations
│   ├── auth/                     # Login/Register pages (legacy path)
│   ├── alerts/                   # Alerts page
│   ├── assistant/                # Legacy assistant page (not used by router)
│   ├── community/                # Community page
│   ├── kiosk/                    # Kiosk mode
│   ├── schemes/                  # Government schemes page
│   └── (others)
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx     # Setup wizard + live advice cards + AI log preview
│   ├── admin/
│   ├── kiosk/
│   └── landing/
├── routes/                       # TanStack Router file-based routes (auto-scanned)
│   ├── __root.tsx
│   ├── index.tsx                 # Landing page
│   ├── login.tsx
│   ├── register.tsx
│   ├── dashboard.tsx
│   ├── assistant.tsx             # → features/ai-assistant/pages/AssistantPage
│   ├── weather.tsx
│   ├── market.tsx
│   ├── schemes.tsx
│   ├── soil.tsx
│   ├── disease-detection.tsx
│   ├── alerts.tsx
│   ├── community.tsx
│   ├── kiosk.tsx
│   └── admin.tsx
├── store/
│   ├── authStore.ts              # Zustand persist — key: sanjaya-auth
│   └── farmStore.ts              # Zustand persist — key: sanjaya-farm
└── lib/
    ├── i18n.tsx
    └── utils.ts
```

---

## State Management

### Auth Store — `sanjaya-auth` (localStorage)

```ts
{
  user: {
    id, name, phone, village, farmSize,
    crops: string[], language, token
  } | null,
  login(user): void,
  logout(): void,
}
```

### Farm Store — `sanjaya-farm` (localStorage)

```ts
{
  // Setup questionnaire
  cropEntries: CropEntry[],       // { name, stage, progress, plantedDate, areaAcres }
  soilType: string,
  irrigationSource: string,
  nearestMandi: string,
  lastFertilizerDate: string,
  lastPestInspectionDate: string,
  farmNotes: string,
  setupStep: 0 | 1 | 2 | 3 | 4,
  setupComplete: boolean,         // true when setupStep >= 4

  // AI conversation log
  aiLogs: AILogEntry[],           // { id, date, question, answer, language, tagged? }
                                  // max 100 entries, newest first

  // Actions
  updateCropEntries(entries): void,
  updateSetupField(field, value): void,
  advanceSetup(step): void,
  addAILog(entry): void,
  toggleTagAILog(id): void,
  resetFarm(): void,
}
```

---

## Layout System

### Authenticated pages — `AppLayout`

File: `src/app/layouts/AppLayout.tsx`

- **Desktop**: Fixed 240px left sidebar, content fills remaining width
- **Mobile**: Compact top bar with hamburger → Sheet slide-over sidebar
- **Nav sections**:
  - Main: Dashboard, AI Assistant
  - Farm Tools: Weather, Market Prices, Gov Schemes, Soil & Farm, Disease Detection
  - Community: Alerts, Community
  - System: Kiosk Mode, Admin
- Active route: highlighted with `bg-primary text-primary-foreground` + ChevronRight
- Sidebar bottom: user name + village, LanguageSwitcher, Logout button

### Unauthenticated pages

Use `PageShell` or no layout wrapper — full-width landing/auth pages.

---

## Voice Assistant

### Speech Input (`useSpeechRecognition`)

File: `src/features/ai-assistant/hooks/useSpeechRecognition.ts`

1. Calls `navigator.mediaDevices.getUserMedia({ audio: true })` to trigger the browser mic permission dialog
2. **Immediately stops all returned stream tracks** — this releases the mic handle so Web Speech API can open its own (critical: not stopping causes silent failure on many browsers)
3. Creates a `SpeechRecognition` / `webkitSpeechRecognition` instance
4. Maps language codes → BCP-47 tags: `en→en-IN`, `hi→hi-IN`, `ne→ne-NP`, `bn→bn-IN`
5. `start()` returns `Promise<boolean>` — `true` if recognition started, `false` on any early error
6. Errors mapped to typed `SpeechError`: `not-supported | permission-denied | no-speech | network | unknown`

**Browser compatibility**: Web Speech API requires Chrome on desktop or Android. Does not work in Firefox or Safari. Users on unsupported browsers see the text input fallback.

### Voice Orb States

| State | Visual | Meaning |
|---|---|---|
| `idle` | Green, subtle pulse ring | Ready to record |
| `listening` | Red, expanding ping rings | Recording speech |
| `thinking` | Spinning conic gradient border | Waiting for AI response |
| `speaking` | Green, outward ripple rings | Playing TTS audio |

### orbState Synchronisation (AssistantPage)

- `handleOrbClick` is `async` — awaits `start()` before setting "listening"
- useEffect syncs: if `isListening` drops to false while orb is "listening", resets to "idle" (handles recognition timeout/network-end without user stopping)
- useEffect syncs: if `speechError` is set, resets orb to "idle"

### Text-to-Speech (`useSarvamTTS`)

File: `src/features/ai-assistant/hooks/useSarvamTTS.ts`

1. Sends full answer text to `sarvamTTS` server function
2. Server splits text into ≤490-char chunks at sentence boundaries
3. All chunks fetched in parallel from Sarvam API
4. Client plays chunks sequentially; each chunk has a 20s playback timeout
5. If Sarvam fails or times out (10s), falls back to `SpeechSynthesisUtterance` (browser TTS)
6. Browser TTS fallback resolves after `onend` OR after estimated duration (text.length × 70ms), whichever comes first — never hangs

### AI Prompt

System prompt instructs Sanjaya to:
- Answer in the farmer's selected language
- Give complete, thorough, **spoken-style** answers (no markdown, no bullet points)
- Cover timing, quantity, methods, and common mistakes for farming questions
- Include farm context: farmer name, village, farm size, crop stages, soil type

`max_tokens`: 800

---

## Dashboard Setup Wizard

File: `src/pages/dashboard/DashboardPage.tsx`

4-step collapsible questionnaire that populates `farmStore`:

| Step | Data collected |
|---|---|
| 1 | Crop entries: name, stage, planted date, area (acres), harvest progress % |
| 2 | Soil type (chip selector), irrigation source (chip selector) |
| 3 | Nearest mandi name |
| 4 | Completion |

Once `setupComplete = true`, the dashboard unlocks:
- Live AI advice cards (irrigation based on rain %, pest risk based on humidity, fertilizer tip based on soil type)
- Crop progress tracker
- Nearest mandi label on market card
- AI conversation log preview (last 3 entries)

---

## AI Conversation Auto-Log

Every successful AI exchange (voice or text) is automatically saved to `farmStore.aiLogs` via `addAILog()`. Each entry stores:
- `id`: `crypto.randomUUID()`
- `date`: ISO timestamp
- `question`: what the farmer asked
- `answer`: Sanjaya's full response
- `language`: language code used

Max 100 entries kept (oldest pruned). Entries can be tagged/starred via `toggleTagAILog`.

---

## Weather

File: `src/features/weather/hooks/useWeather.ts`

1. `useGeolocation()` calls `navigator.geolocation.getCurrentPosition` with 8s timeout, 10-min cache
2. On success: uses browser coords
3. On error: falls back to Gangtok (27.33°N, 88.62°E), sets `locationError` message shown as a banner
4. Weather query only fires after location resolves (`enabled: !locationLoading`)
5. Open-Meteo fetches: current conditions + hourly + 7-day daily forecast

---

## Known Limitations / Future Work

- **Voice STT**: Web Speech API only works in Chrome. Consider integrating Sarvam AI STT (`POST /speech-to-text`) for cross-browser support — the SDK is available (`sarvamai` npm package, see `.env` comments).
- **Auth**: User store is in-memory on the server (resets on server restart). Production needs a real database.
- **Market prices**: Currently static placeholder. Connect to Agmarknet or eNAM API for live mandi data.
- **Disease detection**: Route exists (`/disease-detection`) but needs YOLOv11 + EfficientNet model integration (see `.env` comments).
- **Weather history**: Rainfall bar chart uses hardcoded weekly data. Connect to Open-Meteo historical API.
- **IMD integration**: Request sent to `api.imd.gov.in` — check dashboard at https://api.imd.gov.in/public/dashboard.php for API access status.
