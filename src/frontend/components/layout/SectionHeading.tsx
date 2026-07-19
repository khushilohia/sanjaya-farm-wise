import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        isCenter ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </div>
      ) : null}
      <div className={cn("flex w-full items-center justify-between gap-4", isCenter && "flex-col")}>
        <h2 className="font-display text-4xl font-semibold tracking-tight">{title}</h2>
        {action ? <div>{action}</div> : null}
      </div>
      {subtitle ? <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
