import { loadFarmData, saveFarmData } from "@/backend/api/authFns";
import { useAuthStore } from "@/frontend/store/authStore";
import { useFarmStore, type FarmData } from "@/frontend/store/farmStore";

// Keeps farm data in sync with the server for logged-in users:
// localStorage stays the offline cache, the server is the source of truth.
// Imported once from __root so subscriptions register on app start.

type FarmSnapshot = Omit<
  FarmData,
  | "updateCropEntries"
  | "updateSetupField"
  | "advanceSetup"
  | "addAILog"
  | "toggleTagAILog"
  | "addDiseaseScan"
  | "updateScanStatus"
  | "resetFarm"
>;

function snapshot(): FarmSnapshot {
  const s = useFarmStore.getState();
  return {
    cropEntries: s.cropEntries,
    soilType: s.soilType,
    irrigationSource: s.irrigationSource,
    nearestMandi: s.nearestMandi,
    lastFertilizerDate: s.lastFertilizerDate,
    lastPestInspectionDate: s.lastPestInspectionDate,
    farmNotes: s.farmNotes,
    setupStep: s.setupStep,
    setupComplete: s.setupComplete,
    aiLogs: s.aiLogs,
    diseaseScans: s.diseaseScans,
  };
}

let hydrating = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

async function hydrateFromServer(): Promise<void> {
  hydrating = true;
  try {
    const { data } = await loadFarmData();
    if (data) {
      useFarmStore.setState(JSON.parse(data) as Partial<FarmSnapshot>);
    } else {
      // First login on this account — push the local (offline) farm up.
      await saveFarmData({ data: { json: JSON.stringify(snapshot()) } });
    }
  } catch {
    // Offline or server error — local cache keeps working.
  } finally {
    hydrating = false;
  }
}

function schedulePush(): void {
  if (hydrating || !useAuthStore.getState().isAuthenticated) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveFarmData({ data: { json: JSON.stringify(snapshot()) } }).catch(() => {});
  }, 2000);
}

export function startFarmSync(): void {
  if (typeof window === "undefined") return;

  let wasAuthenticated = useAuthStore.getState().isAuthenticated;
  if (wasAuthenticated) void hydrateFromServer();

  useAuthStore.subscribe((state) => {
    if (state.isAuthenticated && !wasAuthenticated) void hydrateFromServer();
    wasAuthenticated = state.isAuthenticated;
  });

  useFarmStore.subscribe(schedulePush);
}
