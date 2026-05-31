import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/auth/RegisterPage";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register · Sanjaya" }] }),
  component: RegisterPage,
});
