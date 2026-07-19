import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { requireSessionUserId } from "../session";

// Super-admin access: comma-separated phone numbers in ADMIN_PHONES.
// e.g. ADMIN_PHONES=9812345678,9800000001
async function requireAdmin(): Promise<void> {
  const userId = requireSessionUserId();
  const admins = (process.env.ADMIN_PHONES ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (admins.length === 0) throw new Error("Admin access is not configured (set ADMIN_PHONES).");
  const client = await db();
  const row = await client.execute({
    sql: "SELECT phone FROM users WHERE id = ?",
    args: [userId],
  });
  const phone = row.rows[0]?.phone as string | undefined;
  if (!phone || !admins.includes(phone)) throw new Error("Not authorized.");
}

export const isAdmin = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await requireAdmin();
    return { admin: true as const };
  } catch {
    return { admin: false as const };
  }
});

export const getAdminOverview = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const client = await db();

  const [totals, recent, farmers, farmRows] = await Promise.all([
    client.execute("SELECT COUNT(*) AS n FROM users"),
    client.execute(
      "SELECT COUNT(*) AS n FROM users WHERE created_at >= datetime('now', '-30 days')",
    ),
    client.execute(
      `SELECT u.id, u.name, u.phone, u.village, u.crops, u.language, u.created_at,
              f.updated_at AS last_active
       FROM users u LEFT JOIN farm_data f ON f.user_id = u.id
       ORDER BY COALESCE(f.updated_at, u.created_at) DESC
       LIMIT 100`,
    ),
    client.execute("SELECT data FROM farm_data"),
  ]);

  // Aggregate what farmers actually do, from their synced farm data.
  let totalAIQueries = 0;
  let setupCompleteCount = 0;
  const cropCounts = new Map<string, number>();
  const questionSamples: { question: string; language: string }[] = [];
  for (const row of farmRows.rows) {
    try {
      const parsed = JSON.parse(row.data as string) as {
        aiLogs?: { question?: string; language?: string }[];
        cropEntries?: { name?: string }[];
        setupComplete?: boolean;
      };
      totalAIQueries += parsed.aiLogs?.length ?? 0;
      if (parsed.setupComplete) setupCompleteCount++;
      for (const c of parsed.cropEntries ?? []) {
        if (c.name) cropCounts.set(c.name, (cropCounts.get(c.name) ?? 0) + 1);
      }
      for (const log of (parsed.aiLogs ?? []).slice(0, 3)) {
        if (log.question && questionSamples.length < 20) {
          questionSamples.push({ question: log.question, language: log.language ?? "en" });
        }
      }
    } catch {
      // skip unparseable rows
    }
  }

  const users = farmers.rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    phone: r.phone as string,
    village: (r.village as string) || "—",
    crops: JSON.parse((r.crops as string) || "[]") as string[],
    language: r.language as string,
    createdAt: r.created_at as string,
    lastActive: (r.last_active as string | null) ?? null,
  }));

  const villages = new Set(users.map((u) => u.village).filter((v) => v !== "—"));

  return {
    stats: {
      totalFarmers: Number(totals.rows[0]?.n ?? 0),
      newLast30Days: Number(recent.rows[0]?.n ?? 0),
      villages: villages.size,
      setupComplete: setupCompleteCount,
      totalAIQueries,
    },
    topCrops: [...cropCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    recentQuestions: questionSamples,
    users,
  };
});
