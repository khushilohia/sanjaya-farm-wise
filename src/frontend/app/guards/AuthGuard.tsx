import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/frontend/store/authStore";
import type { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}
