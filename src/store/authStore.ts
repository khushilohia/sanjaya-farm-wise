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

type AuthStore = {
  user: FarmerUser | null;
  isAuthenticated: boolean;
  login: (user: FarmerUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "sanjaya-auth" }
  )
);
