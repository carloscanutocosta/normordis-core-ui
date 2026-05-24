import React, { useState, useRef } from "react";
import FormField from "./FormField";
import { Button } from "@/components/ui/button";
import { Upload, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImageCropInput({ label, description, error, required, disabled, value, onChange, aspectRatio = 1, className }) {
  const [src, setSrc] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const CANVAS_W = 280;
  const CANVAS_H = Math.round(CANVAS_W / aspectRatio);

  const draw = (img, sc, off) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    const iw = img.naturalWidth * sc;
    const ih = img.naturalHeight * sc;
    ctx.drawImage(img, off.x, off.y, iw, ih);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    const img = new Image();
    img.onload = () => { imgRef.current = img; draw(img, 1, { x: 0, y: 0 }); };
    img.src = url;
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const off = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    setOffset(off);
    draw(imgRef.current, scale, off);
  };
  const handleMouseUp = () => setDragging(false);

  const zoom = (delta) => {
    const sc = Math.max(0.2, Math.min(3, scale + delta));
    setScale(sc);
    draw(imgRef.current, sc, offset);
  };

  const crop = () => {
    const canvas = canvasRef.current;
    onChange?.(canvas.toDataURL("image/jpeg", 0.9));
  };

  const clear = () => { setSrc(null); imgRef.current = null; onChange?.(""); };

  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      {!src ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
          className={cn("w-full border-2 border-dashed border-input rounded-lg py-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors", disabled && "opacity-50 cursor-not-allowed")}
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm">Clique para seleccionar imagem</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border border-border" style={{ width: CANVAS_W, height: CANVAS_H }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => zoom(-0.1)}><ZoomOut className="h-3.5 w-3.5" /></Button>
            <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(scale * 100)}%</span>
            <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => zoom(0.1)}><ZoomIn className="h-3.5 w-3.5" /></Button>
            <Button type="button" size="sm" className="h-7 ml-2" onClick={crop}>Recortar</Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={clear}><X className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </FormField>
  );
}