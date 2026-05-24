import { cn } from "@/lib/utils";

const variants = {
  ring: ({ size, color }) => (
    <div
      className={cn("rounded-full border-2 border-t-transparent animate-spin", color, size)}
    />
  ),
  dots: ({ size, color }) => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("rounded-full animate-bounce", color,
            size === "w-4 h-4" ? "w-1.5 h-1.5" : size === "w-6 h-6" ? "w-2 h-2" : "w-3 h-3"
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  ),
  pulse: ({ size, color }) => (
    <div className={cn("rounded-full animate-pulse", color, size)} />
  ),
  bars: ({ size, color }) => (
    <div className="flex items-end gap-0.5 h-5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn("w-1 rounded-sm animate-bounce", color)}
          style={{
            height: `${Math.random() * 60 + 40}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s"
          }}
        />
      ))}
    </div>
  ),
};

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colors = {
  primary: "border-primary bg-primary",
  muted: "border-muted-foreground bg-muted-foreground",
  white: "border-white bg-white",
  destructive: "border-destructive bg-destructive",
};

export default function Spinner({
  variant = "ring",
  size = "md",
  color = "primary",
  label,
  fullPage = false,
  className,
}) {
  const Variant = variants[variant] ?? variants.ring;
  const sizeClass = sizes[size] ?? sizes.md;
  const colorClass = colors[color] ?? colors.primary;

  const spinner = (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Variant size={sizeClass} color={colorClass} />
      {label && <p className="text-sm text-muted-foreground animate-pulse">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}