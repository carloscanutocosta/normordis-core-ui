import React, { useRef, useEffect, useState } from "react";
import FormField from "./FormField";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignaturePad({ label, description, error, required, disabled, value, onChange, className }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1e1e32";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const start = (e) => {
    if (disabled) return;
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setIsEmpty(false);
  };

  const stop = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange?.(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange?.("");
  };

  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className={cn("rounded-md border border-input overflow-hidden", error && "border-destructive", disabled && "opacity-50")}>
        <canvas
          ref={canvasRef}
          width={500}
          height={150}
          className="w-full bg-background cursor-crosshair touch-none"
          onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
        />
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">{isEmpty ? "Assine acima" : "Assinatura capturada"}</span>
          <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={disabled || isEmpty} className="h-6 text-xs gap-1 text-muted-foreground">
            <Trash2 className="h-3 w-3" /> Limpar
          </Button>
        </div>
      </div>
    </FormField>
  );
}