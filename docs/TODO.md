# Sanjaya — Current State & Next Steps

_Updated: 2026-07-19 (supersedes the morning audit; Phases A, B, C1–2, D1 done)_

## What's real now

| Area | Status | Detail |
|---|---|---|
| AI chat (`/assistant`) | ✅ Real | OpenRouter → Gemini 2.5 Flash, live farm context + weather + history. |
| Speech-to-text / TTS | ✅ Real | Web Speech API + Sarvam AI fallback / Sarvam `bulbul:v2` TTS. |
| Disease detection | ✅ Real (LLM vision) | Gemini 2.5 Flash vision. Accuracy = good LLM guess, not a trained classifier. |
| Weather | ✅ Real | Live Open-Meteo, incl. rainfall history chart and derived alert cards. |
| Auth | ✅ Real | Server-side: scrypt password hashing, HMAC-signed httpOnly session cookie, users in SQLite/Turso (`src/backend/`). |
| Farm data | ✅ Real + synced | Zustand + localStorage as offline cache; synced to server per user (`farmSync.ts`). |
| Market prices | ✅ Real | Agmarknet live feed with clearly-labelled AI-estimate fallback. |
| Soil health | ✅ Real | ISRIC SoilGrids by GPS + AI interpretation (score, plan, suitability). |
| Alerts | ✅ Real (in-app) | Derived from live forecast (`deriveAlerts.ts`). No SMS/voice delivery yet — UI says so. |
| Gov schemes | ✅ Real eligibility | Rules-based checker with reasons + official portal links. No application tracking yet. |
| Buyer marketplace | ⚠️ Preview | Sample buyers, labelled as preview. Listing form is local-only. |
| Community | ❌ Static | Acceptable for now (per original plan). |
| Admin | ❌ Static | Only matters once there are real users. |

## Page elevation ideas (UX roadmap, 2026-07-20)

Small, high-impact additions per page. Items marked ✅ are done.

- **Assistant** — ✅ context-aware advice (soil/prices/schemes fed in), ✅ deep-link chips under answers ("See mandi prices", "Check scheme eligibility"). Next: tappable follow-up suggestion chips after each answer; save/share an answer.
- **Market** — ✅ commodity search, ✅ price trend chart. Next: "best day to sell" hint from the trend; compare two mandis side by side; price alert ("tell me when ginger crosses ₹X" — needs alert delivery).
- **Weather** — has rainfall history + derived alerts. Next: 7-day temperature band chart (same inline-SVG pattern as market trend); spray/irrigation window strip (colored day squares); yesterday-vs-today comparison line.
- **Soil** — has gauge + AI plan. Next: radar/bar comparing each nutrient vs ideal range for the farmer's main crop; "retest reminder" (soil data is satellite-static, so show sample-collection guidance instead).
- **Dashboard** — add a "today at a glance" strip (weather icon + top alert + top price move) so the farmer sees everything without visiting 3 pages; harvest countdown per crop from `cropEntries` progress.
- **Schemes** — show a deadline/documents checklist per eligible scheme; a "documents you'll need" accordion (Aadhaar, land record, bank passbook).
- **Disease detection** — history of past scans (already stored in farm data?); side-by-side healthy-vs-diseased reference photos for common local crops.
- **Alerts** — group by crop; per-alert "ask Sanjaya about this" button that opens the assistant pre-filled with the alert.
- **Kiosk** — ✅ working launcher (tiles navigate, voice opens assistant, app-wide language switch, live clock, login state). Next: idle timeout that auto-logs-out and returns to /kiosk (shared village device).

## Remaining work (priority order)

1. **Alert delivery** — SMS/voice/push. Data layer exists (weather-derived alerts); needs a delivery channel (e.g. Twilio/MSG91) and a scheduled job.
2. **Buyer marketplace backend** — listings table + buyer offers; the form and UI already exist.
3. **Scheme application tracking** — per-user table; checker already real.
4. **OTP login** — deferred from v1; password + phone works. Add Sarvam/MSG91 OTP if farmers struggle with passwords.
5. **Community backend** — lowest priority.
6. **Disease detection** — revisit a dedicated CV model only if real usage shows LLM-vision accuracy problems.

## Deployment notes

- Vercel needs Turso (`DATABASE_URL`, `DATABASE_AUTH_TOKEN`) — serverless has no disk.
- Docker path: `docker compose up --build` (SQLite volume). See `docs/DEPLOYMENT.md`.
- `docs/SYSTEM.md` and `docs/plan.md` are historical — this file supersedes them.
