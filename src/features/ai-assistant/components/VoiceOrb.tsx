import { Mic, MicOff, Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

type VoiceOrbProps = {
  state: OrbState;
  onClick: () => void;
  size?: number;
};

export function VoiceOrb({ state, onClick, size = 200 }: VoiceOrbProps) {
  const halfSize = size / 2;
  const iconSize = Math.round(size * 0.22);
  const iconClass = `h-[${iconSize}px] w-[${iconSize}px] text-white relative z-10`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 select-none",
        state === "idle" && "hover:scale-105 active:scale-95",
        state === "listening" && "scale-105"
      )}
      style={{
        width: size,
        height: size,
        borderRadius: halfSize,
      }}
      aria-label={
        state === "idle"
          ? "Tap to speak"
          : state === "listening"
            ? "Tap to stop"
            : state
      }
    >
      {/* Background glow layers by state */}
      {state === "idle" && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-primary"
            style={{ borderRadius: halfSize }}
          />
          {/* Subtle idle pulse ring */}
          <span
            className="absolute rounded-full border border-primary/30 animate-pulse"
            style={{
              width: size + 16,
              height: size + 16,
              borderRadius: halfSize + 8,
            }}
          />
        </>
      )}

      {state === "listening" && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-destructive"
            style={{ borderRadius: halfSize }}
          />
          {/* Expanding ping rings */}
          <span
            className="absolute inset-0 rounded-full bg-destructive/40 animate-ping"
            style={{ borderRadius: halfSize }}
          />
          <span
            className="absolute rounded-full border-2 border-destructive/30 animate-ping"
            style={{
              width: size + 32,
              height: size + 32,
              borderRadius: halfSize + 16,
              animationDelay: "150ms",
            }}
          />
          <span
            className="absolute rounded-full border border-destructive/20 animate-ping"
            style={{
              width: size + 64,
              height: size + 64,
              borderRadius: halfSize + 32,
              animationDelay: "300ms",
            }}
          />
        </>
      )}

      {state === "thinking" && (
        <>
          {/* Rotating gradient border */}
          <span
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              borderRadius: halfSize,
              background:
                "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--primary)/0.2), hsl(var(--harvest)), hsl(var(--primary)))",
            }}
          />
          <span
            className="absolute rounded-full bg-background/90"
            style={{
              inset: 4,
              borderRadius: halfSize - 4,
            }}
          />
          <span
            className="absolute rounded-full bg-primary/20"
            style={{
              inset: 8,
              borderRadius: halfSize - 8,
            }}
          />
        </>
      )}

      {state === "speaking" && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-primary"
            style={{ borderRadius: halfSize }}
          />
          {/* Ripple rings outward */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute rounded-full border-2 border-primary/30 animate-ping"
              style={{
                width: size + (i + 1) * 28,
                height: size + (i + 1) * 28,
                borderRadius: halfSize + (i + 1) * 14,
                animationDelay: `${i * 200}ms`,
                animationDuration: "1.2s",
              }}
            />
          ))}
        </>
      )}

      {/* Icon */}
      <span className="relative z-10 text-white">
        {state === "idle" && <Mic style={{ width: iconSize, height: iconSize }} />}
        {state === "listening" && (
          <MicOff style={{ width: iconSize, height: iconSize }} />
        )}
        {state === "thinking" && (
          <Sparkles
            style={{ width: iconSize, height: iconSize }}
            className="text-primary animate-pulse"
          />
        )}
        {state === "speaking" && (
          <Volume2 style={{ width: iconSize, height: iconSize }} />
        )}
      </span>
    </button>
  );
}
