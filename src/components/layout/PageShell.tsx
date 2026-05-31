import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
  showFooter?: boolean;
};

export function PageShell({
  children,
  className,
  mainClassName,
  showFooter = true,
}: PageShellProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      <SiteHeader />
      <main className={cn("relative", mainClassName)}>{children}</main>
      {showFooter ? <SiteFooter /> : null}
    </div>
  );
}
