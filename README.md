# Sanjaya — AI Farming Assistant

Voice-first farming assistant for smallholder farmers in Northeast India and Nepal: AI chat in Hindi/Nepali/Bengali/English, crop disease detection from photos, live weather and mandi prices, soil health from satellite data, and government scheme eligibility.

## Stack

One TanStack Start (React 19 + Vite + Nitro) app that builds into two artifacts: a static frontend bundle and a Node/serverless backend.

| Layer | Where | What |
|---|---|---|
| Frontend | [src/frontend/](src/frontend/) | Pages, components, stores (Zustand), hooks |
| Backend | [src/backend/](src/backend/) | Server functions (API), SQLite/Turso DB, sessions |
| Routes | [src/routes/](src/routes/) | Thin framework glue mapping URLs to frontend pages |
| Docs | [docs/](docs/) | Architecture, deployment, historical plans |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## Quick start

```sh
npm install
cp .env.example .env       # fill in keys (see below)
npm run dev                # http://localhost:8080
```

The local database is a zero-setup SQLite file at `data/sanjaya.db`.

## Environment variables

See [.env.example](.env.example). Required: `OPEN_AI_API_KEY` (AI), `SARVAM_AI_API_KEY` (voice), `AUTH_SECRET` (sessions). Optional: `DATA_GOV_IN_API_KEY` (live mandi prices), `DATABASE_URL`/`DATABASE_AUTH_TOKEN` (Turso in production), `ADMIN_PHONES` (super-admin access to `/admin`).

## Production

Two supported targets — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md):

- **Vercel** (default): `npm run build` outputs `.vercel/output`. Needs Turso for the database (serverless has no persistent disk).
- **Docker**: `docker compose up --build` — standalone Node server on port 3000 with SQLite in a volume.

## Scripts

```sh
npm run dev      # dev server
npm run build    # production build
npm run lint     # eslint
npm run format   # prettier
node ./node_modules/typescript/bin/tsc --noEmit   # typecheck
node scripts/smoke.ts       # backend logic tests (db, auth, rules)
node scripts/e2e-auth.ts    # full auth flow (needs `npm run dev` running)
```
