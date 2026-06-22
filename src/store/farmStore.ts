import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CropEntry = {
  name: string;
  stage: string;
  progress: number; // 0-100
  plantedDate: string; // ISO date
  areaAcres: string;
};

export type AILogEntry = {
  id: string;
  date: string; // ISO
  question: string;
  answer: string;
  language: string;
  tagged?: boolean;
};

export type DiseaseScan = {
  id: string;
  date: string; // ISO
  crop: string;
  disease: string;
  confidence: number;
  severity: string;
  summary: string;
  status: "Detected" | "Treating" | "Resolved";
};

export type FarmData = {
  // Questionnaire answers
  cropEntries: CropEntry[];
  soilType: string; // "clay" | "loamy" | "sandy" | "silt" | ""
  irrigationSource: string; // "rain" | "canal" | "borewell" | "drip" | ""
  nearestMandi: string;
  lastFertilizerDate: string;
  lastPestInspectionDate: string;
  farmNotes: string;

  // Setup state
  setupStep: number; // 0 = not started, 1-4 = steps, 5 = complete
  setupComplete: boolean;

  // AI conversation log
  aiLogs: AILogEntry[];

  // Disease detection history
  diseaseScans: DiseaseScan[];

  // Actions
  updateCropEntries: (entries: CropEntry[]) => void;
  updateSetupField: (
    field: Partial<
      Omit<
        FarmData,
        | "aiLogs"
        | "diseaseScans"
        | "updateCropEntries"
        | "updateSetupField"
        | "advanceSetup"
        | "addAILog"
        | "toggleTagAILog"
        | "addDiseaseScan"
        | "updateScanStatus"
        | "resetFarm"
      >
    >
  ) => void;
  advanceSetup: (step: number) => void;
  addAILog: (entry: Omit<AILogEntry, "id" | "date">) => void;
  toggleTagAILog: (id: string) => void;
  addDiseaseScan: (entry: Omit<DiseaseScan, "id" | "date" | "status">) => void;
  updateScanStatus: (id: string, status: DiseaseScan["status"]) => void;
  resetFarm: () => void;
};

const DEFAULTS = {
  cropEntries: [],
  soilType: "",
  irrigationSource: "",
  nearestMandi: "",
  lastFertilizerDate: "",
  lastPestInspectionDate: "",
  farmNotes: "",
  setupStep: 0,
  setupComplete: false,
  aiLogs: [],
  diseaseScans: [],
};

export const useFarmStore = create<FarmData>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      updateCropEntries: (entries) => set({ cropEntries: entries }),

      updateSetupField: (fields) => set((s) => ({ ...s, ...fields })),

      advanceSetup: (step) =>
        set({ setupStep: step, setupComplete: step >= 4 }),

      addAILog: (entry) =>
        set((s) => ({
          aiLogs: [
            { id: crypto.randomUUID(), date: new Date().toISOString(), ...entry },
            ...s.aiLogs.slice(0, 99), // keep last 100
          ],
        })),

      toggleTagAILog: (id) =>
        set((s) => ({
          aiLogs: s.aiLogs.map((l) =>
            l.id === id ? { ...l, tagged: !l.tagged } : l
          ),
        })),

      addDiseaseScan: (entry) =>
        set((s) => ({
          diseaseScans: [
            {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              status: "Detected" as const,
              ...entry,
            },
            ...s.diseaseScans.slice(0, 49),
          ],
        })),

      updateScanStatus: (id, status) =>
        set((s) => ({
          diseaseScans: s.diseaseScans.map((d) =>
            d.id === id ? { ...d, status } : d
          ),
        })),

      resetFarm: () => set(DEFAULTS),
    }),
    { name: "sanjaya-farm" }
  )
);
