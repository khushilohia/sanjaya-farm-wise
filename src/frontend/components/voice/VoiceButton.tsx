import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

type VoiceButtonSize = "sm" | "md" | "lg" | "xl";

type VoiceButtonProps = {
  size?: VoiceButtonSize;
  listening?: boolean;
  onClick?: () => void;
  className?: string;
  label?: string;
};

const sizeStyles: Record<VoiceButtonSize, { circle: string; icon: string }> = {
  sm: { circle: "h-12 w-12", icon: "h-5 w-5" },
  md: { circle: "h-16 w-16", icon: "h-6 w-6" },
  lg: { circle: "h-20 w-20", icon: "h-8 w-8" },
  xl: { circle: "h-[120px] w-[120px]", icon: "h-12 w-12" },
};

export default function VoiceButton({
  size = "md",
  listening = false,
  onClick,
  className,
  label,
}: VoiceButtonProps) {
  const { circle, icon } = sizeStyles[size];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          circle,
          listening
            ? "bg-primary shadow-lg shadow-primary/40"
            : "bg-primary shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:scale-105",
        )}
        aria-label={listening ? "Stop listening" : "Start listening"}
      >
        {listening && (
          <span
            className={cn("absolute inset-0 rounded-full bg-primary/40 animate-pulse", circle)}
          />
        )}
        {listening && (
          <span className={cn("absolute rounded-full bg-primary/20 animate-ping", circle)} />
        )}
        <span className="relative z-10 text-primary-foreground">
          {listening ? <MicOff className={icon} /> : <Mic className={icon} />}
        </span>
      </button>
      {label ? <span className="text-xs font-medium text-muted-foreground">{label}</span> : null}
    </div>
  );
}
