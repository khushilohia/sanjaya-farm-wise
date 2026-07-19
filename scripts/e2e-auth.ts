// End-to-end auth test against a running dev server (npm run dev), using the
// real TanStack Start client RPC wire protocol.
// Run: bun run scripts/e2e-auth.ts
import { strict as assert } from "node:assert";

process.env.TSS_SERVER_FN_BASE = "http://localhost:8080/_serverFn/";
const { createClientRpc } = await import("@tanstack/start-client-core/client-rpc");

const fnId = (exportName: string) =>
  Buffer.from(
    JSON.stringify({
      file: "/src/backend/api/authFns.ts?tss-serverfn-split",
      export: `${exportName}_createServerFn_handler`,
    }),
  ).toString("base64url");

const registerUser = createClientRpc(fnId("registerUser"));
const loginUser = createClientRpc(fnId("loginUser"));
const getMe = createClientRpc(fnId("getMe"));
const saveFarmData = createClientRpc(fnId("saveFarmData"));
const loadFarmData = createClientRpc(fnId("loadFarmData"));

// Minimal cookie jar so the httpOnly session cookie round-trips.
let cookie = "";
const jarFetch: typeof fetch = async (input, init) => {
  const headers = new Headers(init?.headers);
  if (cookie) headers.set("cookie", cookie);
  const res = await fetch(input, { ...init, headers });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return res;
};

const phone = `9${Date.now()}`.slice(0, 10);

// register → sets session cookie and returns the user
const registered = (
  await registerUser({
    method: "POST",
    fetch: jarFetch,
    data: {
      name: "E2E Farmer",
      phone,
      village: "Gangtok",
      farmSize: "2.5",
      crops: ["Cardamom", "Ginger"],
      language: "en",
      password: "secret123",
    },
  })
).result;
assert.equal(registered.name, "E2E Farmer");
assert.ok(cookie.startsWith("sanjaya_session="), "session cookie set");

// getMe with cookie → same user
const me = (await getMe({ method: "GET", fetch: jarFetch })).result;
assert.equal(me?.phone, phone, "getMe returns the registered user");

// farm data sync round-trip
await saveFarmData({
  method: "POST",
  fetch: jarFetch,
  data: { json: JSON.stringify({ soilType: "loamy", setupComplete: true }) },
});
const farm = (await loadFarmData({ method: "GET", fetch: jarFetch })).result;
assert.equal(JSON.parse(farm.data!).soilType, "loamy", "farm data roundtrip");

// wrong password rejected (raw RPC returns the error in the envelope;
// the createServerFn client wrapper re-throws it in the real app)
const bad = await loginUser({
  method: "POST",
  fetch: jarFetch,
  data: { phone, password: "wrong-password" },
});
assert.ok(bad.error instanceof Error, "wrong password returns an error");
assert.match(bad.error.message, /Invalid phone number or password/);

// getMe without cookie → null
cookie = "";
const anon = (await getMe({ method: "GET", fetch: jarFetch })).result;
assert.equal(anon, null, "no session → null");

// correct login works and re-issues a session
const loggedIn = (
  await loginUser({
    method: "POST",
    fetch: jarFetch,
    data: { phone, password: "secret123" },
  })
).result;
assert.equal(loggedIn.id, registered.id);
assert.ok(cookie.startsWith("sanjaya_session="), "login re-issues cookie");

console.log("E2E AUTH OK — register, session cookie, farm sync, login all verified");
