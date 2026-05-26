import { useState, useRef, useId } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import FieldWrapper from "./FieldWrapper";

export default function TagsField({
  id: idProp,
  label,
  hint,
  error,
  required,
  value = [],
  onChange,
  disabled,
  placeholder = "Adicionar tag...",
  suggestions = [],
  maxTags,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();

  const tags = value ?? [];

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    if (maxTags && tags.length >= maxTags) return;
    onChange?.([...tags, trimmed]);
    setInput("");
  };

  const removeTag = (tag) => {
    onChange?.(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "min-h-[42px] flex flex-wrap gap-1.5 items-center rounded-lg border border-input bg-background px-3 py-2 transition-all cursor-text",
          focused && "ring-2 ring-ring/40 border-ring",
          error && "border-destructive",
          error && focused && "ring-destructive/30",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-md"
          >
            {tag}
            {!disabled && (
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary/60 transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        <input
          id={id}
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input.trim()) addTag(input); }}
          disabled={disabled}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
        />
      </div>
      {focused && filteredSuggestions.length > 0 && (
        <div className="rounded-lg border border-border bg-popover shadow-md overflow-hidden">
          {filteredSuggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {maxTags && (
        <p className="text-xs text-muted-foreground text-right">{tags.length}/{maxTags}</p>
      )}
    </FieldWrapper>
  );
}