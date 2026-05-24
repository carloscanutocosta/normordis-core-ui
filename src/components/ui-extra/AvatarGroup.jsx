import React from "react";
import { cn } from "@/lib/utils";

const COLORS = ["bg-primary","bg-chart-2","bg-chart-3","bg-chart-4","bg-chart-5"];

function initials(name = "") {
  return name.split(" ").slice(0,2).map((w) => w[0]).join("").toUpperCase();
}

export default function AvatarGroup({ users = [], max = 4, size = "md", className }) {
  const sizes = { sm:"h-7 w-7 text-[10px]", md:"h-9 w-9 text-xs", lg:"h-11 w-11 text-sm" };
  const shown = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((u, i) => (
        <div
          key={u.id ?? i}
          title={u.name}
          className={cn(
            "rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-card -ml-2 first:ml-0 shrink-0",
            sizes[size],
            u.avatar ? "" : COLORS[i % COLORS.length]
          )}
          style={{ zIndex: shown.length - i }}
        >
          {u.avatar
            ? <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
            : <span>{initials(u.name)}</span>
          }
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn("rounded-full flex items-center justify-center font-semibold bg-muted text-muted-foreground ring-2 ring-card -ml-2 shrink-0", sizes[size])}
          style={{ zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}