import React from "react";
import { cn } from "@/lib/utils";

export default function RichTextDisplay({ value, className }) {
  if (!value) return <span className="text-sm text-muted-foreground italic">—</span>;

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none text-foreground",
        "[&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold",
        "[&_p]:text-sm [&_p]:leading-relaxed",
        "[&_ul]:list-disc [&_ol]:list-decimal [&_li]:text-sm",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_a]:text-primary [&_a]:underline",
        "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs",
        className
      )}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}