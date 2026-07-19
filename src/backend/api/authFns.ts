import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/backend/db";
import {
  clearSession,
  createSession,
  getSessionUserId,
  hashPassword,
  requireSessionUserId,
  verifyPassword,
} from "@/backend/session";

export type SessionUser = {
  id: string;
  name: string;
  phone: string;
  village: string;
  farmSize: string;
  crops: string[];
  language: string;
};

type UserRow = {
  id: string;
  name: string;
  phone: string;
  village: string;
  farm_size: string;
  crops: string;
  language: string;
  password_hash: string;
};

function toUser(row: UserRow): SessionUser {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    village: row.village,
    farmSize: row.farm_size,
    crops: JSON.parse(row.crops) as string[],
    language: row.language,
  };
}

export const registerUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(2).max(100),
      phone: z.string().min(10).max(20),
      village: z.string().max(100).default(""),
      farmSize: z.string().max(20).default(""),
      crops: z.array(z.string().max(50)).max(20).default([]),
      language: z.string().max(5).default("en"),
      password: z.string().min(6).max(200),
    }),
  )
  .handler(async ({ data }): Promise<SessionUser> => {
    const client = await db();
    const phone = data.phone.trim();
    const existing = await client.execute({
      sql: "SELECT id FROM users WHERE phone = ?",
      args: [phone],
    });
    if (existing.rows.length > 0) {
      throw new Error("This phone number is already registered. Please log in.");
    }
    const id = crypto.randomUUID();
    await client.execute({
      sql: `INSERT INTO users (id, phone, name, village, farm_size, crops, language, password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        phone,
        data.name.trim(),
        data.village.trim(),
        data.farmSize,
        JSON.stringify(data.crops),
        data.language,
        await hashPassword(data.password),
      ],
    });
    createSession(id);
    return {
      id,
      name: data.name.trim(),
      phone,
      village: data.village.trim(),
      farmSize: data.farmSize,
      crops: data.crops,
      language: data.language,
    };
  });

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ phone: z.string().min(1), password: z.string().min(1) }))
  .handler(async ({ data }): Promise<SessionUser> => {
    const client = await db();
    const result = await client.execute({
      sql: "SELECT * FROM users WHERE phone = ?",
      args: [data.phone.trim()],
    });
    const row = result.rows[0] as unknown as UserRow | undefined;
    if (!row || !(await verifyPassword(data.password, row.password_hash))) {
      throw new Error("Invalid phone number or password.");
    }
    createSession(row.id);
    return toUser(row);
  });

export const getMe = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionUser | null> => {
    const userId = getSessionUserId();
    if (!userId) return null;
    const client = await db();
    const result = await client.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [userId],
    });
    const row = result.rows[0] as unknown as UserRow | undefined;
    return row ? toUser(row) : null;
  },
);

export const logoutUser = createServerFn({ method: "POST" }).handler(async () => {
  clearSession();
  return { ok: true };
});

// --- Farm data sync (server is source of truth once logged in) --------------

export const saveFarmData = createServerFn({ method: "POST" })
  .inputValidator(z.object({ json: z.string().max(500_000) }))
  .handler(async ({ data }) => {
    const userId = requireSessionUserId();
    JSON.parse(data.json); // reject non-JSON payloads
    const client = await db();
    await client.execute({
      sql: `INSERT INTO farm_data (user_id, data, updated_at) VALUES (?, ?, datetime('now'))
            ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = datetime('now')`,
      args: [userId, data.json],
    });
    return { ok: true };
  });

export const loadFarmData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ data: string | null }> => {
    const userId = getSessionUserId();
    if (!userId) return { data: null };
    const client = await db();
    const result = await client.execute({
      sql: "SELECT data FROM farm_data WHERE user_id = ?",
      args: [userId],
    });
    return { data: (result.rows[0]?.data as string | undefined) ?? null };
  },
);
