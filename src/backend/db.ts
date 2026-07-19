import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { createClient, type Client } from "@libsql/client";

// Server-only database. Local dev uses a file-backed SQLite DB with zero
// setup; production points DATABASE_URL at Turso (libsql://...) with
// DATABASE_AUTH_TOKEN. Never import this from client code.

let client: Client | undefined;
let ready: Promise<void> | undefined;

function getClient(): Client {
  if (!client) {
    const url = process.env.DATABASE_URL ?? "file:./data/sanjaya.db";
    if (url.startsWith("file:")) {
      mkdirSync(dirname(url.slice("file:".length)), { recursive: true });
    }
    client = createClient({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return client;
}

async function migrate(c: Client): Promise<void> {
  await c.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      village TEXT NOT NULL DEFAULT '',
      farm_size TEXT NOT NULL DEFAULT '',
      crops TEXT NOT NULL DEFAULT '[]',
      language TEXT NOT NULL DEFAULT 'en',
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS farm_data (
      user_id TEXT PRIMARY KEY REFERENCES users(id),
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export async function db(): Promise<Client> {
  const c = getClient();
  if (!ready) ready = migrate(c);
  await ready;
  return c;
}
