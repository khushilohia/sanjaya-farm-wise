import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FarmerUser = {
  id: string;
  name: string;
  phone: string;
  village: string;
  farmSize: string;
  crops: string[];
  language: string;
  token: string;
};

export type RegisterInput = {
  name: string;
  phone: string;
  village: string;
  farmSize: string;
  crops: string[];
  language: string;
  password: string;
};

type StoredUser = Omit<FarmerUser, "token"> & { passwordHash: string };

// SHA-256 so raw passwords are never stored, even in localStorage.
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`sanjaya:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function makeToken(id: string, phone: string): string {
  return btoa(JSON.stringify({ id, phone, exp: Date.now() + 30 * 86400000 }));
}

type AuthStore = {
  user: FarmerUser | null;
  isAuthenticated: boolean;
  // Local credential registry — persisted per device (no server DB needed,
  // so it survives reloads and works on stateless serverless deploys).
  users: Record<string, StoredUser>;
  register: (input: RegisterInput) => Promise<FarmerUser>;
  authenticate: (phone: string, password: string) => Promise<FarmerUser>;
  login: (user: FarmerUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: {},

      register: async (input) => {
        const phone = input.phone.trim();
        if (get().users[phone]) {
          throw new Error(
            "This phone number is already registered. Please log in."
          );
        }
        const id = crypto.randomUUID();
        const stored: StoredUser = {
          id,
          name: input.name.trim(),
          phone,
          village: input.village.trim(),
          farmSize: input.farmSize,
          crops: input.crops,
          language: input.language,
          passwordHash: await hashPassword(input.password),
        };
        const user: FarmerUser = {
          id,
          name: stored.name,
          phone,
          village: stored.village,
          farmSize: stored.farmSize,
          crops: stored.crops,
          language: stored.language,
          token: makeToken(id, phone),
        };
        set((s) => ({
          users: { ...s.users, [phone]: stored },
          user,
          isAuthenticated: true,
        }));
        return user;
      },

      authenticate: async (phone, password) => {
        const stored = get().users[phone.trim()];
        if (!stored || stored.passwordHash !== (await hashPassword(password))) {
          throw new Error("Invalid phone number or password.");
        }
        const user: FarmerUser = {
          id: stored.id,
          name: stored.name,
          phone: stored.phone,
          village: stored.village,
          farmSize: stored.farmSize,
          crops: stored.crops,
          language: stored.language,
          token: makeToken(stored.id, stored.phone),
        };
        set({ user, isAuthenticated: true });
        return user;
      },

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "sanjaya-auth" }
  )
);
