import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/frontend/pages/auth/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · Sanjaya" }] }),
  component: LoginPage,
});
