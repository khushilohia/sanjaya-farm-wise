// Backend smoke test: DB schema, password hashing, scheme rules, alert rules.
// Run: bun run scripts/smoke.ts  (uses a throwaway DB file)
import { strict as assert } from "node:assert";

process.env.DATABASE_URL = "file:./data/smoke-test.db";

const { db } = await import("../src/backend/db");
const { hashPassword, verifyPassword } = await import("../src/backend/session");
const { checkEligibility } = await import("../src/frontend/features/schemes/eligibility");
const { deriveAlerts } = await import("../src/frontend/features/alerts/deriveAlerts");

// --- password hashing --------------------------------------------------------
const hash = await hashPassword("secret123");
assert.ok(await verifyPassword("secret123", hash), "correct password verifies");
assert.ok(!(await verifyPassword("wrong", hash)), "wrong password rejected");
assert.notEqual(hash, await hashPassword("secret123"), "salts are unique");

// --- db schema + CRUD --------------------------------------------------------
const client = await db();
const id = crypto.randomUUID();
await client.execute({
  sql: "INSERT INTO users (id, phone, name, password_hash) VALUES (?, ?, ?, ?)",
  args: [id, `9${Date.now()}`, "Smoke Test", hash],
});
const row = await client.execute({
  sql: "SELECT name FROM users WHERE id = ?",
  args: [id],
});
assert.equal(row.rows[0]?.name, "Smoke Test", "user roundtrip");
await client.execute({
  sql: "INSERT INTO farm_data (user_id, data) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data",
  args: [id, JSON.stringify({ soilType: "loamy" })],
});
const farm = await client.execute({
  sql: "SELECT data FROM farm_data WHERE user_id = ?",
  args: [id],
});
assert.equal(JSON.parse(farm.rows[0]?.data as string).soilType, "loamy");

// --- scheme eligibility ------------------------------------------------------
const landless = checkEligibility({ landAcres: 0, crop: "", state: "Sikkim" });
assert.ok(!landless.find((s) => s.name.includes("PM-Kisan"))!.eligible);
assert.ok(landless.find((s) => s.name.includes("Soil Health"))!.eligible);
const small = checkEligibility({ landAcres: 2, crop: "Rice", state: "Sikkim" });
assert.equal(small.filter((s) => s.eligible).length, 5, "small farmer gets all 5");
const large = checkEligibility({ landAcres: 12, crop: "Rice", state: "Sikkim" });
assert.ok(!large.find((s) => s.name.includes("Maandhan"))!.eligible, "pension capped at 5 acres");

// --- alert derivation --------------------------------------------------------
const calm = {
  current: {
    temperature_2m: 22,
    relative_humidity_2m: 60,
    precipitation_probability: 10,
    weather_code: 1,
    wind_speed_10m: 8,
  },
  daily: {
    time: ["a", "b", "c"],
    temperature_2m_max: [24, 25, 26],
    temperature_2m_min: [12, 13, 12],
    precipitation_sum: [0, 1, 0],
    weather_code: [1, 1, 1],
    precipitation_probability_max: [10, 20, 10],
  },
};
assert.equal(deriveAlerts(calm, []).length, 0, "calm weather → no alerts");
const stormy = {
  current: {
    temperature_2m: 28,
    relative_humidity_2m: 92,
    precipitation_probability: 90,
    weather_code: 63,
    wind_speed_10m: 55,
  },
  daily: {
    time: ["a", "b", "c"],
    temperature_2m_max: [37, 33, 30],
    temperature_2m_min: [1, 2, 5],
    precipitation_sum: [40, 30, 5],
    weather_code: [63, 63, 61],
    precipitation_probability_max: [95, 80, 40],
  },
};
const alerts = deriveAlerts(stormy, ["Cardamom"]);
assert.ok(alerts.length >= 4, "stormy weather → rain/humidity/heat/frost/wind alerts");
assert.ok(
  alerts.some((a) => a.title.includes("Capsule rot")),
  "crop-aware humidity alert",
);

console.log("SMOKE OK —", alerts.length, "alerts derived, all assertions passed");
