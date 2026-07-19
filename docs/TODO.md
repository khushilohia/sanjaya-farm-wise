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
