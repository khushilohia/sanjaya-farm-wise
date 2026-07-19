import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const COOKIE_NAME = "sanjaya_session";
const SESSION_DAYS = 30;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Server is not configured (missing AUTH_SECRET).");
  return s;
}

// --- Password hashing (scrypt, per-user salt) ------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt, 32);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const key = await scryptAsync(password, salt, 32);
  const expected = Buffer.from(hex, "hex");
  return key.length === expected.length && timingSafeEqual(key, expected);
}

// --- Signed session cookie (HMAC-SHA256) ------------------------------------

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSession(userId: string): void {
  const exp = Date.now() + SESSION_DAYS * 86400000;
  const payload = Buffer.from(JSON.stringify({ userId, exp })).toString("base64url");
  setCookie(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export function getSessionUserId(): string | null {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { userId, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      userId: string;
      exp: number;
    };
    if (Date.now() > exp) return null;
    return userId;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  deleteCookie(COOKIE_NAME, { path: "/" });
}

export function requireSessionUserId(): string {
  const userId = getSessionUserId();
  if (!userId) throw new Error("Not logged in.");
  return userId;
}
