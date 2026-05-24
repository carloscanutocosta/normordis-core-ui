import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LANG_COLORS = {
  javascript: "text-yellow-400", js: "text-yellow-400",
  typescript: "text-blue-400",  ts: "text-blue-400",
  jsx: "text-cyan-400", tsx: "text-cyan-400",
  python: "text-green-400", css: "text-pink-400",
  html: "text-orange-400", json: "text-amber-300",
  bash: "text-muted-foreground", shell: "text-muted-foreground",
};

export default function CodeBlock({ code = "", language = "javascript", filename, showLineNumbers = true, className }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");
  const langColor = LANG_COLORS[language.toLowerCase()] || "text-muted-foreground";

  return (
    <div className={cn("rounded-xl overflow-hidden border border-border font-mono text-sm", className)}>
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e2e] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          {filename && <span className="text-xs text-white/50">{filename}</span>}
          <span className={cn("text-[10px] font-semibold uppercase tracking-wider", langColor)}>{language}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto bg-[#1a1a2e]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/5">
                {showLineNumbers && (
                  <td className="select-none text-right px-4 py-0.5 text-white/20 text-xs w-10 border-r border-white/10 align-top">
                    {i + 1}
                  </td>
                )}
                <td className="px-4 py-0.5 text-white/90 text-xs whitespace-pre align-top">{line || " "}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}