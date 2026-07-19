# Deployment

## Environment variables

Copy `.env.example` and fill in:

| Variable | Required | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | yes | AI chat, disease detection, soil interpretation |
| `SARVAM_AI_API_KEY` | yes | Speech-to-text + text-to-speech |
| `AUTH_SECRET` | yes | Signs session cookies. `openssl rand -hex 32` |
| `DATABASE_URL` | prod | `libsql://…` (Turso). Defaults to local SQLite file |
| `DATABASE_AUTH_TOKEN` | prod | Turso auth token |
| `DATA_GOV_IN_API_KEY` | no | Live Agmarknet mandi prices (AI-estimate fallback without it) |
| `ADMIN_PHONES` | no | Comma-separated phone numbers with super-admin access to `/admin` |

## Vercel (default)

`vercel.json` + the Nitro `vercel` preset already output to `.vercel/output`.

1. Create a Turso database (`turso db create sanjaya`) — Vercel functions have no persistent disk, so file SQLite won't survive there.
2. Set all env vars above in the Vercel project (with `DATABASE_URL` + `DATABASE_AUTH_TOKEN`).
3. Push to the connected repo, or `vercel deploy`.

## Docker (self-hosted)

```sh
cp .env.example .env   # fill in keys
docker compose up --build
# → http://localhost:3000
```

- The image builds with `NITRO_PRESET=node-server` → standalone Node server (`dist/server/index.mjs`), no Vercel involved.
- SQLite lives in the `sanjaya-data` volume (`/app/data/sanjaya.db`). Point `DATABASE_URL` at Turso in `.env` if you prefer a managed DB.
- Container runs as a non-root user and restarts unless stopped.

## Local production build

```sh
NITRO_PRESET=node-server npm run build
node dist/server/index.mjs   # PORT=3000 by default
```
