import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  type SessionUser,
} from "@/backend/api/authFns";

export type FarmerUser = SessionUser;

export type RegisterInput = {
  name: string;
  phone: string;
  village: string;
  farmSize: string;
  crops: string[];
  language: string;
  password: string;
};

type AuthStore = {
  // `user` is a local cache for instant UI; the httpOnly session cookie is
  // the real credential and is verified server-side by every protected fn.
  user: FarmerUser | null;
  isAuthenticated: boolean;
  register: (input: RegisterInput) => Promise<FarmerUser>;
  authenticate: (phone: string, password: string) => Promise<FarmerUser>;
  refreshSession: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      register: async (input) => {
        const user = await registerUser({ data: input });
        set({ user, isAuthenticated: true });
        return user;
      },

      authenticate: async (phone, password) => {
        const user = await loginUser({ data: { phone, password } });
        set({ user, isAuthenticated: true });
        return user;
      },

      // Re-validate the cookie session on app start; clears stale local
      // state if the server session expired or was revoked.
      refreshSession: async () => {
        try {
          const user = await getMe();
          set({ user, isAuthenticated: Boolean(user) });
        } catch {
          // Network failure — keep cached state so offline use still works.
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        logoutUser().catch(() => {});
      },
    }),
    { name: "sanjaya-auth" },
  ),
);
